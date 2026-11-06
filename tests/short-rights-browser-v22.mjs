import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const URL=process.env.BASE_URL||'http://127.0.0.1:4173';
const brief='quiero crear una unidad para 3 semanas sobre los derechos';
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1366,height:768},acceptDownloads:true});
const page=await context.newPage();
let errors=[];
page.on('pageerror',e=>errors.push(e.message));
function documentXml(bytes){
 let o=0;while(o+30<=bytes.length&&bytes.readUInt32LE(o)===0x04034b50){
  const method=bytes.readUInt16LE(o+8),size=bytes.readUInt32LE(o+18),len=bytes.readUInt16LE(o+26),extra=bytes.readUInt16LE(o+28);
  const name=bytes.subarray(o+30,o+30+len).toString('utf8'),start=o+30+len+extra;
  if(name==='word/document.xml'){assert.equal(method,0);return bytes.subarray(start,start+size).toString('utf8');}
  o=start+size;
 }throw Error('No se encontró el XML del Word');
}
try{
 await page.goto(URL,{waitUntil:'networkidle'});
 await page.evaluate(()=>localStorage.clear());
 await page.reload({waitUntil:'networkidle'});
 await page.waitForSelector('input[name="ddLevel"][value="Primaria"]');
 await page.locator('input[name="ddLevel"][value="Primaria"]').locator('..').click();
 const ie=page.locator('input[name="ddIE"][value="Polidocente"]');
 if(await ie.count())await ie.locator('..').click();
 else await page.locator('input[name="ddIE"][value="Multigrado"]').locator('..').click();
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
 await page.locator('#unitSituation').fill(brief);
 await page.waitForFunction(()=>{const t=[...document.querySelectorAll('#ddIntentBox .dd-title-suggestions button')].map(x=>x.textContent.trim());return t.length===3&&t.every(x=>/derechos/i.test(x)&&!/crear una unidad|3 semanas/i.test(x))},null,{timeout:15000});
 const titles=await page.locator('#ddIntentBox .dd-title-suggestions button').allTextContents();
 assert(titles.length===3);
 await page.locator('button[onclick="createUnitDemo()"]').click();
 await page.waitForSelector('#ddProposalChooser:not(.hidden)',{timeout:15000});
 const situationOptions=await page.locator('#ddProposalChooser .dd-choice-card').allTextContents();
 assert(situationOptions.some(x=>/derechos/i.test(x)));
 await page.locator('input[name="ddSituation"]').first().check();
 await page.locator('#ddContinueProducts').click();
 await page.waitForSelector('#ddOwnProduct',{timeout:15000});
 const available=await page.locator('#ddProposalChooser').innerText();
 assert.match(available,/Expo interactiva:\s*descubrimos los derechos/i);
 await page.locator('input[name="ddProduct"]').nth(1).check();
 await page.locator('#ddBuildUnit').click();
 await page.waitForFunction(()=>{const s=JSON.parse(localStorage.getItem('docenteDigitalPrototype')||'{}');return s.units?.length>0},null,{timeout:15000});
 const data=await page.evaluate(()=>JSON.parse(localStorage.getItem('docenteDigitalPrototype')||'{}'));
 const u=data.units.find(x=>x.id===data.activeUnitId)||data.units[0];
 assert.equal(u.grades.join(','),'2.º');
 assert.equal(u.duration,'3 semanas');
 assert.match(u.title,/derechos/i);
 assert.doesNotMatch(u.title,/crear una unidad|3 semanas/i);
 assert.match(u.reto,/derechos/i);
 assert.doesNotMatch(u.reto,/3 semanas/i);
 assert.match(u.product,/Expo interactiva|descubrimos los derechos/i);
 const week3=u.activities.filter(x=>x.week===3&&x.area==='Comunicación').map(x=>x.title).join(' | ');
 assert.match(week3,/Expo interactiva/i,'Las sesiones deben mencionar el producto seleccionado');
 assert.doesNotMatch(week3,/Muestra por estaciones/i,'No incluir descripciones largas en títulos');
 const html=await page.evaluate(id=>{const s=JSON.parse(localStorage.getItem('docenteDigitalPrototype')||'{}');const u=s.units.find(z=>z.id===id);return window.unitWordHtml(u)},u.id);
 assert.match(html,/Expo interactiva/i);
 assert.doesNotMatch(html,/3 semanas sobre los derechos/i);
 const download=page.waitForEvent('download',{timeout:15000});
 await page.evaluate(id=>window.downloadUnitWord(id),u.id);
 const file=await (await download).path();
 const xml=documentXml(await fs.readFile(file));
 assert.match(xml,/Expo interactiva/);
 assert.doesNotMatch(xml,/3 semanas sobre los derechos/);
 assert(!errors.some(x=>/ReferenceError|SyntaxError/.test(x)),errors.join('\n'));
 console.log('PASS v22 BROWSER: texto natural de segundo grado, títulos, reto, expo y DOCX real');
}catch(e){
 await fs.mkdir('/tmp/dd-rights-regression',{recursive:true});
 await page.screenshot({path:'/tmp/dd-rights-regression/failure.png',fullPage:true}).catch(()=>{});
 console.error('FAIL v22 BROWSER:',e.stack||e.message);throw e;
}finally{await browser.close();}
