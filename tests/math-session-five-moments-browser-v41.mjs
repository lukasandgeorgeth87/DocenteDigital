// Fase 41: el navegador real muestra los cinco momentos matemáticos
// tanto en la sesión como en la exportación HTML para Word.
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const url=process.env.BASE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1366,height:768}});
const page=await context.newPage();
const errs=[];
page.on('pageerror',e=>errs.push(String(e.message)));
try{
 await page.goto(url,{waitUntil:'networkidle'});
 await page.evaluate(()=>localStorage.clear());
 await page.reload({waitUntil:'networkidle'});
 await page.waitForSelector('input[name="ddLevel"][value="Primaria"]',{timeout:15000});
 await page.locator('input[name="ddLevel"][value="Primaria"]').locator('..').click();
 await page.locator('input[name="ddIE"][value="Polidocente"]').locator('..').click();
 await page.locator('[data-dd-grade-group="Primaria"] input[type="checkbox"][value="6.º"]').locator('..').click();
 await page.locator('[data-dd-area-group="Primaria"] input[type="checkbox"][value="Matemática"]').locator('..').click();
 await page.locator('#linguisticMode').selectOption('Monolingüe castellano');
 await page.locator('#ddSetupNativeForm button[type="submit"]').click();
 await page.waitForFunction(()=>window.__ddPlanningRuntimeReady===true,null,{timeout:20000});
 const report=await page.evaluate(()=>{
   const session={
    id:'test-matematica-f41',level:'Primaria',ieType:'Polidocente',area:'Matemática',
    grades:['6.º'],title:'Resolvemos problemas de cantidad',activityTitle:'Resolvemos problemas de cantidad',
    unitTitle:'Unidad de prueba',brief:'Los estudiantes resuelven repartos equitativos ficticios.',
    purpose:'Resolvemos repartos equitativos y explicamos la estrategia empleada.',
    criterion:'Justifica una estrategia para repartir cantidades.',
    evidence:'Representación del reparto y explicación oral.',instrument:'Escala de valoración',
    challenge:'¿Cómo repartir cantidades de manera equitativa y comprobar la respuesta?',
    duration:'45 minutos',times:{start:10,dev:25,close:10},
    resources:'Semillas y tarjetas',resourcesList:['semillas','tarjetas']
   };
   const onScreen=window.sessionHtml(session,false);
   const forWord=window.sessionHtml(session,true);
   const headings=['FAMILIARIZACIÓN','BÚSQUEDA Y EJECUCIÓN','SOCIALIZACIÓN','REFLEXIÓN Y GENERALIZACIÓN','OTROS PROBLEMAS'];
   const aliases=[
     /FAMILIARIZACI[ÓO]N|Familiarizaci[oó]n/,
     /B[ÚU]SQUEDA Y EJECUCI[ÓO]N|B[uú]squeda y ejecuci[oó]n/,
     /SOCIALIZACI[ÓO]N|Socializaci[oó]n/,
     /REFLEXI[ÓO]N Y GENERALIZACI[ÓO]N|Reflexi[oó]n y generalizaci[oó]n/,
     /OTROS PROBLEMAS|otros problemas/i
   ];
   return {
     hasSessionHtml:typeof window.sessionHtml==='function',
     onScreen:aliases.map(re=>re.test(onScreen)),
     forWord:aliases.map(re=>re.test(forWord)),
     corrupt:/\b(?:Analizan|Identifican|Proponen)\s+(?:Leen|Identifican|Proponen)\b/i.test(forWord),
     hasPurpose:forWord.includes('Resolvemos repartos equitativos'),
     empty:forWord.length<700,
     headings
   };
 });
 assert(report.hasSessionHtml);
 assert.deepEqual(report.onScreen,[true,true,true,true,true],'No aparecen los cinco momentos en pantalla: '+JSON.stringify(report));
 assert.deepEqual(report.forWord,[true,true,true,true,true],'No aparecen los cinco momentos en Word: '+JSON.stringify(report));
 assert(!report.corrupt,'La sesión conserva la duplicación de verbos');
 assert(report.hasPurpose,'La sesión perdió el propósito');
 assert(!report.empty,'La sesión generada está incompleta');
 assert(!errs.some(x=>/SyntaxError|ReferenceError/.test(x)),errs.join('; '));
 console.log('PASS v41 BROWSER: cinco momentos Matemática visibles en sesión y Word');
}catch(error){
 await fs.mkdir('/tmp/dd-math-session',{recursive:true});
 await page.screenshot({path:'/tmp/dd-math-session/error.png',fullPage:true}).catch(()=>{});
 console.error('FAIL v41 BROWSER:',error.stack||error);
 throw error;
}finally{await browser.close();}
