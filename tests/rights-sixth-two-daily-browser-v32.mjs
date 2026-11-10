// Regresión browser real de la auditoría del docente: 6.º, derechos,
// 3 semanas, 2 sesiones al día y producto Expo interactiva en Word OOXML.
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const URL=process.env.BASE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1366,height:768},acceptDownloads:true});
const page=await context.newPage();
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
const unitTitle='Descubrimos los derechos a partir de preguntas y evidencias';
function wordXml(buffer){
 let n=0;
 while(n+30<=buffer.length&&buffer.readUInt32LE(n)===0x04034b50){
  const method=buffer.readUInt16LE(n+8),len=buffer.readUInt32LE(n+18),
   nameLen=buffer.readUInt16LE(n+26),extra=buffer.readUInt16LE(n+28);
  const name=buffer.subarray(n+30,n+30+nameLen).toString('utf8');
  const start=n+30+nameLen+extra;
  if(name==='word/document.xml'){
   assert.equal(method,0);return buffer.subarray(start,start+len).toString('utf8');
  }
  n=start+len;
 }
 throw Error('DOCX descargado sin XML de Word');
}
try{
 await page.goto(URL,{waitUntil:'networkidle'});
 await page.evaluate(()=>localStorage.clear());
 await page.reload({waitUntil:'networkidle'});
 await page.locator('input[name="ddLevel"][value="Primaria"]').locator('..').click();
 await page.locator('input[name="ddIE"][value="Polidocente"]').locator('..').click();
 await page.locator('[data-dd-grade-group="Primaria"] input[type="checkbox"][value="6.º"]').locator('..').click();
 for(const area of ['Comunicación','Matemática','Personal Social','Ciencia y Tecnología','Arte y Cultura','Educación Física','Educación Religiosa']){
  const el=page.locator('[data-dd-area-group="Primaria"] input[type="checkbox"][value="'+area+'"]');
  if(await el.count()&&!(await el.isChecked()))await el.locator('..').click();
 }
 await page.locator('#linguisticMode').selectOption('Monolingüe castellano');
 await page.locator('#ddSetupNativeForm button[type="submit"]').click();
 await page.waitForFunction(()=>window.__ddPlanningRuntimeReady===true,null,{timeout:20000});
 await page.evaluate(()=>window.go('plan'));
 await page.locator('button[onclick="showUnit()"]',{hasText:'Crear nueva'}).click();
 const kind=page.locator('#ddPlanningKindChooser [data-kind="Unidad de aprendizaje"]');
 if(await kind.count())await kind.click();
 await page.locator('#unitDuration').selectOption({label:'3 semanas'});
 await page.waitForSelector('#ddInlineSessionMode',{timeout:15000});
 await page.locator('#ddInlineSessionMode').selectOption('2');
 await page.locator('#unitSituation').fill('los derechos');
 await page.locator('#unitTitle').fill(unitTitle);
 await page.locator('button[onclick="createUnitDemo()"]').click();
 await page.waitForSelector('#ddProposalChooser:not(.hidden)',{timeout:15000});
 await page.locator('input[name="ddSituation"]').nth(1).check();
 await page.locator('#ddContinueProducts').click();
 await page.waitForSelector('input[name="ddProduct"]',{timeout:15000});
 await page.evaluate(()=>{
   window.__ddProductTrace=[];
   const original=window.save;
   if(typeof original==='function')window.save=function(...args){
     try{
       const u=typeof state==='object'?state.units?.[0]:null;
       if(u){
         window.__ddProductTrace.push({
           product:u.product,productTitle:u.productTitle,
           at:new Error().stack?.split('\n').slice(1,4).join(' | ')
         });
         if(window.__ddProductTrace.length>100)window.__ddProductTrace.shift();
       }
     }catch(_){}
     return original.apply(this,args);
   };
 });
 await page.locator('input[name="ddProduct"]').nth(1).check();
 await page.locator('#ddBuildUnit').click();
 await page.waitForFunction(()=>JSON.parse(localStorage.getItem('docenteDigitalPrototype')||'{}').units?.length>0,null,{timeout:15000});
 const state=await page.evaluate(()=>JSON.parse(localStorage.getItem('docenteDigitalPrototype')||'{}'));
 const unit=state.units.find(u=>u.id===state.activeUnitId)||state.units[0];
 assert.equal(unit.title,unitTitle);
 assert.equal(unit.grades.join(','),'6.º');
 assert.equal(unit.duration,'3 semanas');
 assert.match(unit.situation,/derechos/i);
 assert.doesNotMatch(unit.situation,/se propone desarrollar|el docente podrá completar/i);
 assert.match(unit.reto,/derechos/i);
 assert.match(unit.product,/Expo interactiva/i);
 assert.doesNotMatch(unit.product,/juego de mesa|Reto Tarpuy/i);
 assert.equal(unit.activities.length,30,'3 semanas × 5 días × 2 sesiones');
 for(let week=1;week<=3;week++)
  for(const day of ['Lunes','Martes','Miércoles','Jueves','Viernes'])
   assert.equal(unit.activities.filter(a=>a.week===week&&a.day===day).length,2,week+' '+day);
 const titles=unit.activities.filter(a=>a.area==='Ciencia y Tecnología').map(a=>a.title).join(' | ');
 assert(!/preguntas investigables sobre los derechos|indagamos los derechos/i.test(titles));
 const auditSnapshot=await page.evaluate(id=>{
  const state=JSON.parse(localStorage.getItem('docenteDigitalPrototype')||'{}');
  const latest=state.units.find(u=>u.id===id);
  return {audit:window.DD_PLANNING_CHAIN_V10.auditUnit(latest),
    product:latest.product,productTitle:latest.productTitle,
    selectionApproved:latest.selectionApproved,selectedProductKey:latest.selectedProductKey,
    productTrace:(window.__ddProductTrace||[]).slice(-18)};
 },unit.id);
 const audit=auditSnapshot.audit;
 for(const id of ['situation-scaffold','challenge-scaffold','selected-product-mismatch','session-scaffold'])
  assert(!audit.warnings.some(x=>x.id===id),'Error de coherencia: '+id+'; valores persistidos='+JSON.stringify(auditSnapshot));
 const html=await page.evaluate(id=>{
  const state=JSON.parse(localStorage.getItem('docenteDigitalPrototype')||'{}');
  return window.unitWordHtml(state.units.find(u=>u.id===id));
 },unit.id);
 for(const text of ['Expo interactiva','ENFOQUES TRANSVERSALES','INSTRUMENTOS DE EVALUACIÓN','REGISTRO AUXILIAR'])
  assert(html.includes(text),'Falta en Word: '+text);
 assert(!html.includes('Juego de mesa «Reto Tarpuy»'));
 const download=page.waitForEvent('download',{timeout:15000});
 await page.evaluate(id=>window.downloadUnitWord(id),unit.id);
 const file=await (await download).path();
 const xml=wordXml(await fs.readFile(file));
 assert.match(xml,/Expo interactiva/);
 assert.doesNotMatch(xml,/Juego de mesa|Reto Tarpuy/);
 assert(!errors.some(x=>/ReferenceError|SyntaxError/.test(x)),errors.join('\n'));
 console.log('PASS v32 BROWSER: 6.º derechos 3 semanas, 30 sesiones correctas, Expo y DOCX');
}catch(e){
 await fs.mkdir('/tmp/dd-rights-sixth',{recursive:true});
 await page.screenshot({path:'/tmp/dd-rights-sixth/failure.png',fullPage:true}).catch(()=>{});
 console.error('FAIL v32 BROWSER:',e.stack||e.message);throw e;
}finally{await browser.close();}
