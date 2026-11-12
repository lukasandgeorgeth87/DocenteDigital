// Motor V2: recorrido real en Chrome de la creación, revisión, sesión y DOCX.
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const BASE=process.env.BASE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1440,height:850},acceptDownloads:true});
const page=await context.newPage();
const errors=[],calls=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('request',request=>{
 if(/api\.openai\.com|\/api\/(?:ai|image)(?:\?|\/|$)/.test(request.url()))calls.push(request.url());
});
function docxXml(bytes){
 let o=0;
 while(o+30<=bytes.length&&bytes.readUInt32LE(o)===0x04034b50){
  const method=bytes.readUInt16LE(o+8);
  const size=bytes.readUInt32LE(o+18),len=bytes.readUInt16LE(o+26),extra=bytes.readUInt16LE(o+28);
  const name=bytes.subarray(o+30,o+30+len).toString('utf8'),start=o+30+len+extra;
  if(name==='word/document.xml'){assert.equal(method,0);return bytes.subarray(start,start+size).toString('utf8');}
  o=start+size;
 }
 throw Error('Falta word/document.xml en el DOCX');
}
try{
 await page.goto(BASE,{waitUntil:'networkidle'});
 await page.evaluate(()=>localStorage.clear());
 await page.reload({waitUntil:'networkidle'});
 await page.waitForSelector('input[name="ddLevel"][value="Primaria"]');
 await page.locator('input[name="ddLevel"][value="Primaria"]').locator('..').click();
 const pol=page.locator('input[name="ddIE"][value="Polidocente"]');
 if(await pol.count())await pol.locator('..').click();
 else await page.locator('input[name="ddIE"][value="Multigrado"]').locator('..').click();
 await page.locator('[data-dd-grade-group="Primaria"] input[type="checkbox"][value="2.º"]').locator('..').click();
 const areas=['Comunicación','Matemática','Personal Social','Ciencia y Tecnología','Arte y Cultura','Educación Física','Educación Religiosa'];
 for(const area of areas){
  const el=page.locator('[data-dd-area-group="Primaria"] input[type="checkbox"][value="'+area+'"]');
  if(await el.count()&&!(await el.isChecked()))await el.locator('..').click();
 }
 await page.locator('#linguisticMode').selectOption('Monolingüe castellano');
 await page.locator('#ddSetupNativeForm button[type="submit"]').click();
 await page.waitForFunction(()=>window.__ddPlanningRuntimeReady===true,null,{timeout:20000});
 await page.evaluate(()=>window.go('plan'));
 await page.locator('button[onclick="showUnit()"]',{hasText:'Crear nueva'}).click();
 const type=page.locator('#ddPlanningKindChooser [data-kind="Unidad de aprendizaje"]');
 if(await type.count())await type.click();
 await page.locator('#unitDuration').selectOption({label:'3 semanas'});
 await page.locator('#unitSituation').fill('los derechos');
 await page.locator('button[onclick="createUnitDemo()"]').click();
 await page.waitForSelector('#ddProposalChooser:not(.hidden)',{timeout:15000});
 await page.locator('input[name="ddSituation"]').first().check();
 await page.locator('#ddContinueProducts').click();
 await page.waitForSelector('input[name="ddProduct"]',{timeout:15000});
 await page.locator('input[name="ddProduct"]').nth(2).check();
 await page.locator('#ddBuildUnit').click();
 await page.waitForSelector('#ddV2Start',{timeout:15000});
 const oldUnit=await page.evaluate(()=>JSON.parse(localStorage.getItem('docenteDigitalPrototype')||'{}').units[0]);
 assert.equal(oldUnit.pedagogicalV2,undefined,'No se debe rediseñar sin revisión y aprobación');
 assert.equal(oldUnit.grades.join(','),'2.º');
 assert.equal(oldUnit.duration,'3 semanas');
 assert.match(oldUnit.product,/Guía ilustrada/i);
 await page.locator('#ddV2Start').click();
 await page.waitForSelector('#ddV2Proposal');
 assert.equal(await page.locator('#ddV2Proposal li').count(),30);
 const titles=await page.locator('#ddV2Proposal li').allTextContents();
 assert.equal(new Set(titles.map(x=>x.split(' — Evidencia:')[0])).size,30);
 assert.match(await page.locator('#ddV2Proposal').innerText(),/Pregunta retadora/);
 assert.match(await page.locator('#ddV2Proposal [data-field="situation"]').inputValue(),/historietas ficticias/i);
 // Una propuesta editorial no se guarda al abrirla.
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('docenteDigitalPrototype')).units[0].pedagogicalV2),undefined);
 await page.getByRole('button',{name:'Aprobar y generar unidad 2.0'}).click();
 await page.waitForSelector('.dd-v2-panel .pill',{timeout:12000});
 const approved=await page.evaluate(()=>JSON.parse(localStorage.getItem('docenteDigitalPrototype')).units[0]);
 assert.equal(approved.pedagogicalV2.approved,true);
 assert.equal(approved.activities.length,30);
 assert.equal(new Set(approved.activities.map(x=>x.title)).size,30);
 assert.equal(approved.product,oldUnit.product,'Se debe mantener el producto seleccionado');
 assert(approved.activities.every(x=>x.v2Plan?.criterion&&x.v2Plan?.evidence),'Falta evaluación por sesión');
 const unitHtml=await page.evaluate(id=>{
  const s=JSON.parse(localStorage.getItem('docenteDigitalPrototype'));
  return window.unitWordHtml(s.units.find(u=>u.id===id));
 },approved.id);
 assert.match(unitHtml,/SECUENCIA PROGRESIVA/);
 assert.match(unitHtml,/MATRIZ CURRICULAR/);
 for(const a of approved.activities)assert(unitHtml.includes(a.title),'Sesión ausente de Word: '+a.title);
 const dl=page.waitForEvent('download',{timeout:15000});
 await page.evaluate(id=>window.downloadUnitWord(id),approved.id);
 const unitZip=docxXml(await fs.readFile(await (await dl).path()));
 assert.match(unitZip,/SITUACIÓN SIGNIFICATIVA/);
 assert.match(unitZip,/Guía ilustrada/i);
 assert.match(unitZip,/¿Qué derecho reconocemos en las viñetas\?/);
 await page.evaluate(id=>window.useUnit(id),approved.id);
 await page.locator('#activity option').first().waitFor({state:'attached',timeout:12000});
 assert.equal(await page.locator('#activity option').count(),30);
 await page.evaluate(()=>window.generateSession());
 await page.waitForFunction(()=>window.state.lastSession?.pedagogicalV2?.version==='2.0.0-rights-grade2',null,{timeout:15000});
 const session=await page.evaluate(()=>window.state.lastSession);
 assert.equal(session.grades.join(','),'2.º');
 assert.match(session.title,/viñetas/);
 assert.match(session.competence,/Se comunica oralmente/);
 assert.match(session.evidence,/Explicación oral/);
 const sesHtml=await page.evaluate(()=>window.sessionHtml(window.state.lastSession,true));
 assert.match(sesHtml,/Antes del intercambio/);
 assert.match(sesHtml,/Criterio observable/);
 assert.match(sesHtml,/Explicación oral/);
 const next=page.waitForEvent('download',{timeout:15000});
 await page.evaluate(()=>window.downloadSessionWord());
 const sesZip=docxXml(await fs.readFile(await (await next).path()));
 assert.match(sesZip,/SESIÓN DE APRENDIZAJE/);
 assert.match(sesZip,/Antes del intercambio/);
 await page.reload({waitUntil:'networkidle'});
 await page.waitForFunction(()=>window.__ddPlanningRuntimeReady===true,null,{timeout:20000});
 const restored=await page.evaluate(()=>JSON.parse(localStorage.getItem('docenteDigitalPrototype')).units[0]);
 assert.equal(restored.pedagogicalV2.approved,true);
 assert.equal(restored.activities.length,30);
 assert.deepEqual(calls,[],'La ruta V2 no debe activar GPT ni pagos');
 assert(!errors.some(s=>/ReferenceError|SyntaxError/.test(s)),errors.join('; '));
 console.log('PASS V2 BROWSER: selección, 30 sesiones progresivas, aprobación, Word completo, sesión y persistencia');
}catch(error){
 await fs.mkdir('/tmp/dd-pedagogical-v2',{recursive:true});
 await page.screenshot({path:'/tmp/dd-pedagogical-v2/failure.png',fullPage:true}).catch(()=>{});
 console.error('FAIL V2 BROWSER:',error.stack||error);
 throw error;
}finally{await browser.close();}
