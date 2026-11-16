/* Demostración: de una unidad real a 2 clases distintas, con ficha/instrumento
   y recuperación de la primera sesión tras recargar. */
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
const out=process.env.EVIDENCE_DIR||'/tmp/dd-commercial-evidence';
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||undefined});
const page=await browser.newPage({viewport:{width:1365,height:900},acceptDownloads:true});
async function download(name,action){
  const awaiting=page.waitForEvent('download',{timeout:20000});
  await action();
  const file=await awaiting,dest=path.join(out,name);
  await file.saveAs(dest);
  const bytes=await fs.readFile(dest);assert.equal(bytes.toString('latin1',0,2),'PK');
  return dest;
}
try{
  await page.goto(process.env.BASE_URL||'http://127.0.0.1:4173',{waitUntil:'networkidle'});
  await page.evaluate(()=>localStorage.clear());
  await page.reload({waitUntil:'networkidle'});
  // First visit goes to the lightweight onboarding page. Its submit redirects
  // back to the actual app; wait for that navigation before using app globals.
  await page.waitForURL(url=>url.pathname.endsWith('/onboarding.html'),{timeout:15000});
  await page.locator('input[name="ddLevel"][value="Primaria"]').locator('..').click();
  await page.locator('input[name="ddIE"][value="Polidocente"]').locator('..').click();
  await page.locator('[data-dd-grade-group="Primaria"] input[value="3.º"]').locator('..').click();
  await page.locator('[data-dd-area-group="Primaria"] input[value="Comunicación"]').locator('..').click();
  await page.locator('#linguisticMode').selectOption('Monolingüe castellano');
  await page.locator('#ddSetupNativeForm button[type="submit"]').click();
  await page.waitForURL(url=>!url.pathname.endsWith('/onboarding.html'),{timeout:15000});
  await page.waitForFunction(()=>typeof window.go==='function'&&window.state?.level==='Primaria',null,{timeout:15000});
  await page.evaluate(()=>{go('plan');showUnit();});
  const kind=page.locator('#ddPlanningKindChooser [data-kind="Unidad de aprendizaje"]');
  if(await kind.count())await kind.click();
  await page.locator('#unitDuration').selectOption('3 semanas');
  await page.locator('#unitTitle').fill('Leemos relatos y escuchamos distintas voces');
  await page.locator('#unitSituation').fill('El aula trabaja con relatos ficticios y preguntas de lectura para escuchar distintas voces y expresarse con respeto.');
  await page.locator('button[onclick="createUnitDemo()"]',{hasText:'Crear propuesta completa'}).click();
  await page.waitForSelector('#ddProposalChooser:not(.hidden)',{timeout:20000});
  await page.locator('input[name="ddSituation"]').first().check();
  await page.locator('#ddContinueProducts').click();
  await page.locator('input[name="ddProduct"]').first().check();
  await page.locator('#ddBuildUnit').click();
  await page.waitForFunction(()=>state.units?.[0]?.activities?.length>=2,{},{timeout:20000});
  await page.waitForSelector('#ddClassKitPanel [data-dd-kit-create]');
  const unitId=await page.evaluate(()=>state.units[0].id);
  const suggestedTitle=await page.evaluate(()=>state.units[0].activities[0].title);
  assert.match(suggestedTitle,/relatos|voces/i,'La actividad debe conservar el tema del título elegido por el docente');
  assert(!/[·|•]/.test(suggestedTitle),'Un listado de palabras clave no es un título pedagógico');
  await page.locator('#ddClassKitActivity').selectOption('0');
  await page.locator('#ddClassKitGrade').selectOption('3.º');
  await page.locator('#ddClassKitPanel [data-dd-kit-create]').click();
  await page.waitForFunction(()=>state.classKits?.length===1,null,{timeout:20000});
  // IndexedDB history is written asynchronously after the kit enters state.
  await page.waitForFunction(()=>/Paquete guardado|No se completó/.test(document.querySelector('#ddClassKitMessage')?.textContent||''),null,{timeout:20000});
  assert.match(await page.locator('#ddClassKitMessage').innerText(),/Paquete guardado/i);
  const first=await page.evaluate(()=>({kit:state.classKits[0],session:state.sessions[0],material:state.lastMaterial,assessment:state.lastAssessment}));
  assert.equal(first.kit.unitId,unitId);
  assert.equal(first.kit.sessionId,first.session.id);
  assert.equal(first.material.sourceTitle,first.session.title);
  assert.equal(first.material.source,'session');
  assert.equal(first.material.grade,'3.º');
  assert.equal(first.assessment.unitId,unitId);
  assert.equal(first.assessment.grade,'3.º');
  assert.equal(first.assessment.instrument,'Lista de cotejo');
  assert.match(first.material.html,/Situación ficticia para practicar la conversación/,
    'La ficha oral debe contener una situación real de trabajo, sin depender de material ausente');
  assert.match(first.material.html,/Luz leyó un relato|Luz leyó un relato sobre/,
    'La conversación sobre relatos debe traer ejemplos concretos relacionados con el tema');
  assert.match(first.material.html,/Una pregunta para mi compañero/,
    'La ficha debe dar espacio para una pregunta del estudiante');
  assert.equal((first.assessment.html.match(/<tr><td>/g)||[]).length,3,
    'Una lista de cotejo oral debe tener tres indicadores distinguibles');
  assert.match(first.assessment.html,/criterio de referencia/i);
  assert.doesNotMatch(first.assessment.html,/escuchar dis y la comunica/i,
    'El criterio de revisión no puede contener una situación truncada a mitad de palabra');
  await page.screenshot({path:path.join(out,'10-paquete-clase-integrado.png'),fullPage:true});
  await page.locator('#ddClassKitActivity').selectOption('1');
  await page.locator('#ddClassKitPanel [data-dd-kit-create]').click();
  await page.waitForFunction(()=>state.classKits?.length===2,null,{timeout:20000});
  await page.waitForFunction(()=>/Paquete guardado|No se completó/.test(document.querySelector('#ddClassKitMessage')?.textContent||''),null,{timeout:20000});
  assert.match(await page.locator('#ddClassKitMessage').innerText(),/Paquete guardado/i);
  const second=await page.evaluate(()=>({kit:state.classKits[0],sessions:state.sessions.map(s=>s.id)}));
  assert.notEqual(second.kit.sessionId,first.kit.sessionId);
  assert(second.sessions.includes(first.session.id),'Se perdió la primera sesión al generar la siguiente');
  await page.reload({waitUntil:'networkidle'});
  await page.evaluate(id=>{go('plan');viewUnit(id);},unitId);
  assert.equal(await page.locator('#ddClassKitPanel [data-dd-kit-open="session"]').count(),2);
  const firstButton=page.locator('#ddClassKitPanel [data-dd-kit-id="'+first.kit.id+'"][data-dd-kit-open="session"]');
  await firstButton.click();
  assert.equal(await page.evaluate(()=>state.lastSession.id),first.session.id);
  await download('10-sesion-recuperada.docx',()=>page.evaluate(()=>downloadSessionWord()));
  await page.evaluate(id=>{go('plan');viewUnit(id);},unitId);
  await page.locator('#ddClassKitPanel [data-dd-kit-id="'+first.kit.id+'"][data-dd-kit-open="material"]').click();
  assert.equal(await page.evaluate(()=>state.lastMaterial.id),first.material.id);
  await download('11-ficha-del-paquete.docx',()=>page.evaluate(()=>window.DDMaterials.downloadWord()));
  await page.evaluate(id=>{go('plan');viewUnit(id);},unitId);
  await page.locator('#ddClassKitPanel [data-dd-kit-id="'+first.kit.id+'"][data-dd-kit-open="assessment"]').click();
  assert.equal(await page.evaluate(()=>state.lastAssessment.id),first.assessment.id);
  await download('12-cotejo-del-paquete.docx',()=>page.locator('#ddAssWord').click());
  await page.evaluate(()=>{go('documents');window.DDDocumentLibrary.open();});
  await page.waitForFunction(()=>document.querySelectorAll('#documentsList [data-doc^="sesion:"]').length>=2,null,{timeout:15000});
  console.log('PASS Dos clases: sesión+ficha+instrumento vinculados, 2 sesiones archivadas, recarga y 3 Word reales.');
}finally{await browser.close();}
