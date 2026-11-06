import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const baseUrl=process.env.BASE_URL||'http://127.0.0.1:4173';
const expectedTitle='Investigamos y actuamos para proteger el agua de nuestra comunidad';
const expectedProduct='Campaña escolar «Guardianes del agua», integrada por un informe de investigación, gráficos estadísticos, propuestas de solución, materiales de sensibilización y compromisos de uso responsable del agua';
const challenge='¿Cómo podemos investigar y analizar el uso del agua en nuestra comunidad para proponer soluciones viables que permitan reducir su desperdicio?';
const brief='Quiero crear una UNIDAD DE APRENDIZAJE para 6.º grado de Educación Primaria. Título: '+expectedTitle+
  '. Nivel: Primaria. Grado: 6.º grado (ciclo V). Duración: 3 semanas, con 2 sesiones diarias.'+
  ' Áreas curriculares: Comunicación, Matemática, Personal Social y Ciencia y Tecnología. Trabajar únicamente estas cuatro áreas.'+
  ' Contexto: El agua es indispensable para la salud y la agricultura. Algunas personas desperdician este recurso y los estudiantes desean investigar su uso.'+
  ' Pregunta retadora: '+challenge+' Producto final: '+expectedProduct+'. Organización de actividades Semana 1: identificamos problemas. Semana 2: analizamos datos. Semana 3: preparamos la campaña.';
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1366,height:768},acceptDownloads:true});
const page=await context.newPage();
const failures=[];
page.on('pageerror',e=>failures.push(e.message));
const screenshot=async()=>{await fs.mkdir('/tmp/dd-sixth-regression',{recursive:true});await page.screenshot({path:'/tmp/dd-sixth-regression/failure.png',fullPage:true}).catch(()=>{});};
const state=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('docenteDigitalPrototype')||'{}'));
function documentXml(bytes){
 let o=0;
 while(o+30<=bytes.length&&bytes.readUInt32LE(o)===0x04034b50){
  const method=bytes.readUInt16LE(o+8),size=bytes.readUInt32LE(o+18),nameLen=bytes.readUInt16LE(o+26),extra=bytes.readUInt16LE(o+28);
  const name=bytes.subarray(o+30,o+30+nameLen).toString('utf8'),start=o+30+nameLen+extra;
  if(name==='word/document.xml'){assert.equal(method,0);return bytes.subarray(start,start+size).toString('utf8');}
  o=start+size;
 }
 throw Error('Word sin documento OOXML');
}
try{
 await page.goto(baseUrl,{waitUntil:'networkidle'});
 await page.evaluate(()=>localStorage.clear());
 await page.reload({waitUntil:'networkidle'});
 await page.waitForSelector('input[name="ddLevel"][value="Primaria"]',{timeout:15000});
 await page.locator('input[name="ddLevel"][value="Primaria"]').locator('..').click();
 await page.locator('input[name="ddIE"][value="Multigrado"]').locator('..').click();
 await page.locator('[data-dd-grade-group="Primaria"] input[type="checkbox"][value="6.º"]').locator('..').click();
 for(const area of ['Comunicación','Matemática','Personal Social','Ciencia y Tecnología'])
   await page.locator('[data-dd-area-group="Primaria"] input[type="checkbox"][value="'+area+'"]').locator('..').click();
 await page.locator('#linguisticMode').selectOption('Monolingüe castellano');
 await page.locator('#ddSetupNativeForm button[type="submit"]').click();
 await page.waitForFunction(()=>window.__ddPlanningRuntimeReady===true,null,{timeout:20000});
 const loaded=await page.evaluate(()=>!!window.DD_PLANNING_CHAIN_V10&&typeof window.DD_PLANNING_CHAIN_V10.auditUnit==='function');
 assert(loaded,'Módulo de auditoría ausente en el navegador');
 await page.evaluate(()=>window.go('plan'));
 await page.locator('button[onclick="showUnit()"]',{hasText:'Crear nueva'}).click();
 const kind=page.locator('#ddPlanningKindChooser [data-kind="Unidad de aprendizaje"]');
 if(await kind.count())await kind.click();
 await page.locator('#unitSituation').fill(brief);
 await page.waitForFunction(t=>[...document.querySelectorAll('#ddIntentBox .dd-title-suggestions button')].some(x=>x.textContent?.trim()===t),expectedTitle,{timeout:15000});
 const suggestions=await page.locator('#ddIntentBox .dd-title-suggestions button').allTextContents();
 assert(suggestions.includes(expectedTitle),'El título del docente falta entre las sugerencias');
 assert(suggestions.every(x=>!x.includes('crear una UNIDAD DE APRENDIZAJE')),'Las sugerencias contienen instrucciones administrativas');
 await page.locator('button[onclick="createUnitDemo()"]').click();
 await page.waitForSelector('#ddProposalChooser:not(.hidden)',{timeout:15000});
 await page.locator('input[name="ddSituation"]').first().check();
 await page.locator('#ddContinueProducts').click();
 await page.waitForSelector('#ddOwnProduct',{timeout:15000});
 const prefilled=await page.locator('#ddOwnProduct').inputValue();
 assert.equal(prefilled,expectedProduct,'El producto prellenado contiene encabezados o perdió información');
 await page.locator('#ddBuildUnit').click();
 await page.waitForFunction(()=>{const u=JSON.parse(localStorage.getItem('docenteDigitalPrototype')||'{}');return u.units?.length>0;},null,{timeout:15000});
 let s=await state(),unit=s.units.find(u=>u.id===s.activeUnitId)||s.units[0];
 assert.equal(unit.title,expectedTitle,'Título incorrecto en la unidad guardada');
 assert.equal(unit.product,expectedProduct,'Producto incorrecto en la unidad guardada');
 assert.equal(unit.reto,challenge,'Pregunta retadora incorrecta');
 assert(unit.grades.includes('6.º'));
 const html=await page.evaluate(id=>{const u=JSON.parse(localStorage.getItem('docenteDigitalPrototype')||'{}').units.find(x=>x.id===id);return window.unitWordHtml(u);},unit.id);
 assert(html.includes(expectedTitle));
 assert(html.includes(expectedProduct));
 assert(!html.includes(expectedProduct+'. Organización de actividades'));
 const promise=page.waitForEvent('download',{timeout:15000});
 await page.evaluate(id=>window.downloadUnitWord(id),unit.id);
 const download=await promise;const file=await download.path();
 assert(download.suggestedFilename().endsWith('.docx'));
 const xml=documentXml(await fs.readFile(file));
 assert(xml.includes(expectedTitle),'Título no está en OOXML descargado');
 assert(xml.includes('Guardianes del agua'),'Campaña ausente del Word');
 assert(!xml.includes('Organización de actividades'),'El Word contiene encabezados administrativos del producto');
 assert(!failures.some(x=>/ReferenceError|SyntaxError/.test(x)),'Errores JavaScript en página: '+failures.join('; '));
 console.log('PASS v21 BROWSER: sexto grado, título y producto exactos, auditor cargado y DOCX real');
}catch(e){await screenshot();console.error('FAIL v21 BROWSER:',e.message);throw e}
finally{await browser.close()}
