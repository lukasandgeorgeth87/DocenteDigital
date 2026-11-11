// Phase 45: test the actual no-API manual workflow, including real DOCX.
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const base=process.env.BASE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1280,height:800},acceptDownloads:true});
const page=await context.newPage();
const requests=[];
page.on('request',req=>{
 if(/\/api\/(?:ai|image)/.test(req.url()))requests.push(req.url());
});
try{
 await page.goto(base+'/laboratorio-plus.html',{waitUntil:'networkidle'});
 await page.locator('[data-section="situation"]').waitFor();
 assert.equal(await page.locator('#downloadWord').isDisabled(),true);
 assert.match(await page.locator('#draftText').inputValue(),/historietas ficticias/);
 await page.locator('[data-section="session"]').click();
 assert.match(await page.locator('#draftText').inputValue(),/INICIO \(10 minutos\)/);
 await page.locator('#approve').click();
 assert.equal(await page.locator('#downloadWord').isEnabled(),true);
 await page.locator('#draftText').fill('Se cambió la propuesta y debe aprobarse de nuevo, aunque el texto tenga más de sesenta caracteres completos.');
 assert.equal(await page.locator('#downloadWord').isDisabled(),true);
 const teacher='Como situación ficticia, los estudiantes de segundo grado conocen sus derechos mediante viñetas. Explican su punto de vista y escuchan respetuosamente a los demás.';
 await page.locator('#fromChatGPT').fill(teacher);
 await page.locator('#usePasted').click();
 assert.equal(await page.locator('#draftText').inputValue(),teacher);
 assert.equal(await page.locator('#downloadWord').isDisabled(),true);
 await page.locator('#approve').click();
 assert.equal(await page.locator('#downloadWord').isEnabled(),true);
 assert.match(await page.locator('#approvedPreview').textContent(),/Como situación ficticia/);
 const coming=page.waitForEvent('download',{timeout:15000});
 await page.locator('#downloadWord').click();
 const file=await coming;
 assert.match(file.suggestedFilename(),/Demostracion_session_2do_grado\.docx/);
 const path=await file.path();
 const buf=await fs.readFile(path);
 const text=buf.toString('utf8');
 assert(buf.length>550,'El DOCX debe contener XML OOXML');
 assert(text.includes('word/document.xml'));
 assert(text.includes('Como situación ficticia'));
 assert(!text.includes('En nuestra comunidad, En una actividad de aula'));
 await page.locator('[data-section="rubric"]').click();
 const rubric=await page.locator('#draftText').inputValue();
 for(const s of ['C – Inicio','B – Proceso','A – Logro esperado','AD – Destacado'])
  assert(rubric.includes(s),'Falta nivel '+s);
 assert.equal(await page.locator('#downloadWord').isDisabled(),true);
 assert.deepEqual(requests,[],'La demostración nunca debe llamar a la API');
 console.log('PASS v45 BROWSER: Plus manual, edición revoca aprobación, DOCX válido y cero llamadas a API');
}catch(e){
 await fs.mkdir('/tmp/dd-plus-demo',{recursive:true});
 await page.screenshot({path:'/tmp/dd-plus-demo/failure.png',fullPage:true}).catch(()=>{});
 console.error('FAIL v45 BROWSER',e.stack||e);
 throw e;
}finally{await browser.close();}
