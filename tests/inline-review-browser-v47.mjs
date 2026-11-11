// Fase 47: revisión de 2.º, persistencia y DOCX usando el navegador real.
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const BASE=process.env.BASE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1366,height:768},acceptDownloads:true});
const page=await context.newPage();
const errs=[];
page.on('pageerror',e=>errs.push(e.message));
const forbidden=[];
page.on('request',r=>{if(/\/api\/(?:ai|image)(?:\?|$)/.test(r.url()))forbidden.push(r.url());});
function xml(buf){
 let i=0;
 while(i+30<=buf.length&&buf.readUInt32LE(i)===0x04034b50){
  const m=buf.readUInt16LE(i+8),size=buf.readUInt32LE(i+18),n=buf.readUInt16LE(i+26),ex=buf.readUInt16LE(i+28);
  const name=buf.subarray(i+30,i+30+n).toString('utf8'),at=i+30+n+ex;
  if(name==='word/document.xml'){assert.equal(m,0);return buf.subarray(at,at+size).toString('utf8');}
  i=at+size;
 }
 throw Error('DOCX sin word/document.xml');
}
try{
 await page.goto(BASE,{waitUntil:'networkidle'});
 await page.evaluate(()=>localStorage.clear());
 await page.reload({waitUntil:'networkidle'});
 await page.locator('input[name="ddLevel"][value="Primaria"]').locator('..').click();
 await page.locator('input[name="ddIE"][value="Polidocente"]').locator('..').click();
 await page.locator('[data-dd-grade-group="Primaria"] input[type="checkbox"][value="2.º"]').locator('..').click();
 for(const area of ['Comunicación','Matemática','Personal Social','Ciencia y Tecnología','Arte y Cultura','Educación Física','Educación Religiosa']){
  const el=page.locator('[data-dd-area-group="Primaria"] input[type="checkbox"][value="'+area+'"]');
  if(await el.count()&&!(await el.isChecked()))await el.locator('..').click();
 }
 await page.locator('#linguisticMode').selectOption('Monolingüe castellano');
 await page.locator('#ddSetupNativeForm button[type="submit"]').click();
 await page.waitForFunction(()=>window.__ddPlanningRuntimeReady===true,null,{timeout:20000});
 await page.evaluate(()=>window.go('plan'));
 await page.locator('button[onclick="showUnit()"]',{hasText:'Crear nueva'}).click();
 const unitKind=page.locator('#ddPlanningKindChooser [data-kind="Unidad de aprendizaje"]');
 if(await unitKind.count())await unitKind.click();
 await page.locator('#unitDuration').selectOption({label:'3 semanas'});
 await page.locator('#unitSituation').fill('los derechos');
 await page.locator('button[onclick="createUnitDemo()"]').click();
 await page.waitForSelector('#ddProposalChooser:not(.hidden)',{timeout:15000});
 await page.locator('input[name="ddSituation"]').first().check();
 await page.locator('#ddContinueProducts').click();
 await page.waitForSelector('input[name="ddProduct"]',{timeout:15000});
 await page.locator('input[name="ddProduct"]').nth(1).check();
 await page.locator('#ddBuildUnit').click();
 await page.waitForFunction(()=>JSON.parse(localStorage.getItem('docenteDigitalPrototype')||'{}').units?.length>0,null,{timeout:15000});
 const unit=await page.evaluate(()=>{const d=JSON.parse(localStorage.getItem('docenteDigitalPrototype'));return d.units[0];});
 await page.locator('#unitOutput button',{hasText:'Revisar y corregir'}).click();
 await page.waitForSelector('#ddReviewPanel textarea');
 const change='Los estudiantes de segundo grado examinan historias ficticias sobre sus derechos. Dialogan, formulan preguntas y elaboran una guía ilustrada para compartir en el aula.';
 const newReto='¿Cómo podemos explicar los derechos de niñas y niños mediante nuestra guía ilustrada?';
 const product='Guía ilustrada de los derechos de la niñez';
 await page.locator('#ddReviewPanel textarea').nth(0).fill(change);
 await page.locator('#ddReviewPanel textarea').nth(1).fill(newReto);
 await page.locator('#ddReviewPanel textarea').nth(2).fill(product);
 await page.getByRole('button',{name:'Guardar correcciones'}).click();
 await page.waitForFunction(()=>!document.getElementById('ddReviewPanel'),null,{timeout:12000});
 const stored=await page.evaluate(id=>{
  const d=JSON.parse(localStorage.getItem('docenteDigitalPrototype'));
  return d.units.find(u=>u.id===id);
 },unit.id);
 assert.equal(stored.situation,change);
 assert.equal(stored.reto,newReto);
 assert.equal(stored.product,product);
 assert.equal(stored.productTitle,product);
 assert.equal(stored.selectedSituationSource,'Docente');
 assert.equal(stored.reviewHistory.length,1);
 const html=await page.evaluate(id=>{const s=JSON.parse(localStorage.getItem('docenteDigitalPrototype'));return window.unitWordHtml(s.units.find(u=>u.id===id))},unit.id);
 assert(html.includes(change)&&html.includes(product),'Los cambios deben estar en Word');
 const coming=page.waitForEvent('download',{timeout:15000});
 await page.evaluate(id=>window.downloadUnitWord(id),unit.id);
 const file=await (await coming).path();
 const real=xml(await fs.readFile(file));
 assert(real.includes(product));
 await page.reload({waitUntil:'networkidle'});
 await page.waitForFunction(()=>window.__ddPlanningRuntimeReady===true,null,{timeout:20000});
 const persisted=await page.evaluate(id=>JSON.parse(localStorage.getItem('docenteDigitalPrototype')||'{}').units.find(u=>u.id===id),unit.id);
 assert.equal(persisted.product,product);
 assert.equal(persisted.situation,change);
 assert.deepEqual(forbidden,[]);
 assert(!errs.some(x=>/ReferenceError|SyntaxError/.test(x)),errs.join('\n'));
 console.log('PASS v47 BROWSER: unidad de 2.º corregida, guardada, recargada y exportada en DOCX');
}catch(e){
 await fs.mkdir('/tmp/dd-inline-review',{recursive:true});
 await page.screenshot({path:'/tmp/dd-inline-review/failure.png',fullPage:true}).catch(()=>{});
 console.error('FAIL v47 BROWSER:',e.stack||e);
 throw e;
}finally{await browser.close();}
