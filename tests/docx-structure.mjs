import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const baseUrl=process.env.BASE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1280,height:720},acceptDownloads:true});
const page=await context.newPage();
function assert(condition,message){if(!condition)throw new Error(message);}

try{
  console.log('DOCX 1/3 Preparar sesión de prueba');
  await page.goto(baseUrl,{waitUntil:'domcontentloaded'});
  const fixture={mode:'easy',level:'Primaria',ieType:'Multigrado',grades:['1.º','3.º','5.º'],areas:['Comunicación'],language:'Castellano',quechuaVar:'Ninguna',units:[{id:'u-docx',title:'Unidad DOCX',type:'Unidad de aprendizaje',duration:'1 semana',situationBrief:'Prueba de exportación',situation:'Situación de prueba.',grades:['1.º','3.º','5.º'],areas:['Comunicación'],activities:[{area:'Comunicación',title:'Leemos un texto informativo',week:1,order:1}],selectionApproved:true}],activeUnitId:'u-docx',lastSession:{unitId:'u-docx',title:'Leemos un texto informativo',area:'Comunicación',duration:'90 minutos',criterion:'Identifica información explícita y explica una idea del texto.',evidence:'Respuesta escrita y explicación oral.',instrument:'Lista de cotejo',createdAt:new Date().toISOString()}};
  await page.evaluate(data=>localStorage.setItem('docenteDigitalPrototype',JSON.stringify(data)),fixture);
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof window.ddDocxSelfTest==='function'&&typeof window.downloadSessionWord==='function',null,{timeout:10000});

  console.log('DOCX 2/3 Descargar OOXML');
  const downloadPromise=page.waitForEvent('download');
  await page.evaluate(()=>window.downloadSessionWord());
  const download=await downloadPromise;
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
  assert(raw.includes('Identifica información explícita')||raw.includes('Identifica informaci'),'El documento no contiene el criterio esperado');
  assert(download.suggestedFilename().toLowerCase().endsWith('.docx'),'Nombre de archivo sin extensión .docx');
  console.log('DOCX_STRUCTURE_PASS');
}finally{
  await browser.close();
}
