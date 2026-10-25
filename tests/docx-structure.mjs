import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const baseUrl=process.env.BASE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1280,height:720},acceptDownloads:true});
const page=await context.newPage();
function assert(condition,message){if(!condition)throw new Error(message);}

try{
  console.log('DOCX 1/3 Preparar sesión de prueba con perfil docente válido');
  await page.goto(baseUrl,{waitUntil:'networkidle'});
  await page.evaluate(()=>localStorage.clear());
  await page.reload({waitUntil:'networkidle'});
  await page.locator('input[name="ddLevel"][value="Primaria"]').locator('..').click();
  await page.locator('input[name="ddIE"][value="Multigrado"]').locator('..').click();
  for(const grade of ['1.º','3.º','5.º']){
    await page.locator('[data-dd-grade-group="Primaria"] input[type="checkbox"][value="'+grade+'"]').locator('..').click();
  }
  await page.locator('[data-dd-area-group="Primaria"] input[type="checkbox"][value="Comunicación"]').locator('..').click();
  await page.locator('#linguisticMode').selectOption('Monolingüe castellano');
  await page.locator('#ddSetupNativeForm button[type="submit"]').click();
  await page.waitForFunction(()=>window.__ddPlanningRuntimeReady===true,null,{timeout:20000});
  const configured=await page.evaluate(()=>JSON.parse(localStorage.getItem('docenteDigitalPrototype')||'{}'));
  assert(configured.level==='Primaria'&&configured.ieType==='Multigrado','El setup real no dejó una configuración válida para DOCX');
  assert(configured.linguisticMode==='Monolingüe castellano','El perfil lingüístico no quedó guardado antes de DOCX');
  const fixture={...configured,units:[{id:'u-docx',title:'Unidad DOCX',type:'Unidad de aprendizaje',duration:'1 semana',level:'Primaria',ieType:'Multigrado',situationBrief:'Prueba de exportación',situation:'Situación de prueba.',grades:['1.º','3.º','5.º'],areas:['Comunicación'],activities:[{area:'Comunicación',title:'Leemos un texto informativo',week:1,order:1}],selectionApproved:true}],activeUnitId:'u-docx',lastSession:{unitId:'u-docx',title:'Leemos un texto informativo',area:'Comunicación',level:'Primaria',ieType:'Multigrado',grades:['1.º','3.º','5.º'],unitTitle:'Unidad DOCX',duration:'90 minutos',purpose:'Comprender información explícita y explicar una idea del texto.',criterion:'Identifica información explícita y explica una idea del texto.',evidence:'Respuesta escrita y explicación oral.',instrument:'Lista de cotejo',resources:'Texto breve y lápices.',challenge:'Explicar qué información del texto sustenta la respuesta.',times:{start:15,dev:60,close:15},createdAt:new Date().toISOString()}};
  await page.evaluate(data=>localStorage.setItem('docenteDigitalPrototype',JSON.stringify(data)),fixture);
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.__ddPlanningRuntimeReady===true,null,{timeout:20000});
  await page.waitForFunction(()=>typeof window.ddDocxSelfTest==='function'&&typeof window.downloadSessionWord==='function',null,{timeout:10000});
  // A ready module is not sufficient if hydration has not restored the saved session.
  await page.waitForFunction(()=>window.state?.lastSession?.unitId==='u-docx',null,{timeout:15000});
  const exportReady=await page.evaluate(()=>({
    unitId:window.state?.lastSession?.unitId||'',
    exporter:typeof window.DDWordExport?.createBlob==='function',
    selfTest:window.ddDocxSelfTest()
  }));
  assert(exportReady.exporter&&exportReady.selfTest,`DOCX exporter not ready: ${JSON.stringify(exportReady)}`);

  console.log('DOCX 2/3 Descargar OOXML');
  let unexpectedDialog='';
  page.once('dialog',async dialog=>{unexpectedDialog=dialog.message();await dialog.dismiss();});
  const downloadPromise=page.waitForEvent('download',{timeout:15000});
  await page.evaluate(()=>window.downloadSessionWord());
  const download=await downloadPromise.catch(error=>{
    throw new Error(`No DOCX download. Browser dialog: ${unexpectedDialog||'none'}; ${error.message}`);
  });
  const path=await download.path();
  assert(path,'No se obtuvo el DOCX');
  const bytes=await fs.readFile(path);
  assert(bytes.length>500,'DOCX demasiado pequeño');
  assert(bytes[0]===0x50&&bytes[1]===0x4b,'DOCX no inicia como ZIP');

  console.log('DOCX 3/3 Verificar piezas OOXML obligatorias');
  const raw=bytes.toString('utf8');
  for(const entry of ['[Content_Types].xml','_rels/.rels','word/document.xml']){
    assert(raw.includes(entry),`Falta pieza OOXML ${entry}`);
  }
  assert(raw.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml'),'Falta ContentType principal de Word');
  assert(raw.includes('Leemos un texto informativo'),'El documento no contiene el título esperado de la sesión');
  assert(raw.includes('Identifica e interpreta información relevante del texto'),'El documento no contiene el criterio efectivo generado por el Núcleo de Sesión');
  assert(download.suggestedFilename().toLowerCase().endsWith('.docx'),'Nombre de archivo sin extensión .docx');
  console.log('DOCX_STRUCTURE_PASS');
}finally{
  await browser.close();
}
