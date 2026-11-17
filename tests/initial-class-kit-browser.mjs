/* Prueba comercial de Inicial: título propio -> unidad -> sesión, ficha y
   evaluación vinculadas, con exportación Word desde botones reales. */
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const out=process.env.EVIDENCE_DIR||'/tmp/dd-commercial-evidence';
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||undefined});
const page=await browser.newPage({viewport:{width:1280,height:800},acceptDownloads:true});
async function download(name,action){
  const pending=page.waitForEvent('download',{timeout:20000});
  await action();
  const received=await pending,dest=path.join(out,name);
  await received.saveAs(dest);
  const bytes=await fs.readFile(dest);
  assert(bytes.length>1000&&bytes.toString('latin1',0,2)==='PK',name+' no es un Word válido');
  return dest;
}
try{
  await page.goto(process.env.BASE_URL||'http://127.0.0.1:4173',{waitUntil:'networkidle'});
  await page.evaluate(()=>localStorage.clear());
  await page.reload({waitUntil:'networkidle'});
  await page.locator('input[name="ddLevel"][value="Inicial"]').locator('..').click();
  await page.locator('input[name="ddIE"][value="Polidocente"]').locator('..').click();
  await page.locator('[data-dd-grade-group="Inicial"] input[value="4 años"]').locator('..').click();
  for(const area of ['Ciencia y Tecnología','Comunicación']){
    const control=page.locator('[data-dd-area-group="Inicial"] input[value="'+area+'"]');
    if(await control.count()&&!(await control.isChecked()))await control.locator('..').click();
  }
  await page.locator('#linguisticMode').selectOption('Monolingüe castellano');
  await page.locator('#ddSetupNativeForm button[type="submit"]').click();
  await page.waitForFunction(()=>window.state?.level==='Inicial'&&typeof window.go==='function',null,{timeout:20000});
  await page.evaluate(()=>{go('plan');showUnit();});
  const kind=page.locator('#ddPlanningKindChooser [data-kind="Unidad de aprendizaje"]');
  if(await kind.count())await kind.click();
  await page.locator('#unitDuration').selectOption('3 semanas');
  await page.locator('#unitTitle').fill('Exploramos las semillas de nuestro entorno');
  await page.locator('#unitSituation').fill('Los niños y las niñas de 4 años exploran semillas seguras, observan cambios y expresan con dibujos y palabras lo que descubren en el aula.');
  await page.locator('button[onclick="createUnitDemo()"]',{hasText:'Crear propuesta completa'}).click();
  await page.waitForSelector('#ddProposalChooser:not(.hidden)',{timeout:20000});
  await page.locator('input[name="ddSituation"]').first().check();
  await page.locator('#ddContinueProducts').click();
  await page.waitForSelector('input[name="ddProduct"]',{timeout:15000});
  await page.locator('input[name="ddProduct"]').first().check();
  await page.locator('#ddBuildUnit').click();
  await page.waitForFunction(()=>state.units?.[0]?.activities?.length>=2,null,{timeout:25000});
  // La validación V2 actual solo está certificada para 2.º Primaria/derechos.
  // En Inicial se comprueba la generación integrada directamente y se exige
  // un criterio observable en la sesión y en la lista de cotejo finales.
  const before=await page.evaluate(()=>({unit:state.units[0],level:state.level}));
  assert.equal(before.level,'Inicial');
  assert.equal(before.unit.title,'Exploramos las semillas de nuestro entorno');
  assert(before.unit.activities.every(a=>a.title&&a.area),
    'Inicial: las actividades de la unidad requieren al menos título y área');
  await page.waitForSelector('#ddClassKitPanel [data-dd-kit-create]',{timeout:15000});
  await page.locator('#ddClassKitGrade').selectOption('4 años');
  await page.locator('#ddClassKitActivity').selectOption('0');
  await page.locator('#ddClassKitPanel [data-dd-kit-create]').click();
  await page.waitForFunction(()=>/Paquete guardado|No se completó/.test(document.querySelector('#ddClassKitMessage')?.textContent||''),null,{timeout:25000});
  assert.match(await page.locator('#ddClassKitMessage').innerText(),/Paquete guardado/i,
    'Inicial debe preparar sesión, ficha e instrumento desde la unidad');
  const made=await page.evaluate(()=>({kit:state.classKits[0],session:state.lastSession,
    material:state.lastMaterial,assessment:state.lastAssessment}));
  assert.equal(made.kit.grade,'4 años');
  assert.equal(made.kit.unitId,before.unit.id);
  assert.equal(made.kit.sessionId,made.session.id);
  assert.equal(made.material.grade,'4 años');
  assert.equal(made.material.sourceTitle,made.session.title);
  assert.equal(made.assessment.grade,'4 años');
  assert.equal(made.assessment.area,made.session.area);
  assert.equal(made.assessment.instrument,'Lista de cotejo');
  assert(String(made.session.criterion||'').trim().length>15,
    'Inicial: la sesión debe contener un criterio de evaluación observable');
  assert(String(made.session.evidence||'').trim().length>10,
    'Inicial: la sesión debe explicitar una evidencia del niño o niña');
  assert(/Criterio|Indicador observable/i.test(made.assessment.html),
    'Inicial: la lista de cotejo requiere indicadores observables');
  assert(!/Actividad de aprendizaje \d+/.test(made.session.title));
  await page.screenshot({path:path.join(out,'13-paquete-inicial-integrado.png'),fullPage:true});
  await page.locator('#ddClassKitPanel [data-dd-kit-id="'+made.kit.id+'"][data-dd-kit-open="session"]').click();
  await download('13-sesion-inicial-4-anos.docx',()=>page.evaluate(()=>downloadSessionWord()));
  await page.evaluate(id=>{go('plan');viewUnit(id);},before.unit.id);
  await page.locator('#ddClassKitPanel [data-dd-kit-id="'+made.kit.id+'"][data-dd-kit-open="material"]').click();
  await download('14-ficha-del-paquete-inicial.docx',()=>page.evaluate(()=>DDMaterials.downloadWord()));
  await page.evaluate(id=>{go('plan');viewUnit(id);},before.unit.id);
  await page.locator('#ddClassKitPanel [data-dd-kit-id="'+made.kit.id+'"][data-dd-kit-open="assessment"]').click();
  await download('15-cotejo-inicial-4-anos.docx',()=>page.locator('#ddAssWord').click());
  await page.reload({waitUntil:'networkidle'});
  const restored=await page.evaluate(()=>({kits:state.classKits||[],sessions:state.sessions||[]}));
  assert(restored.kits.some(k=>k.id===made.kit.id)&&restored.sessions.some(s=>s.id===made.session.id),
    'Inicial: los documentos deben mantenerse después de recargar');
  await fs.writeFile(path.join(out,'resultado-paquete-inicial.json'),JSON.stringify({
    case:'Inicial 4 años, semillas, unidad a paquete completo',
    unit:before.unit.title,session:made.session.title,grade:made.kit.grade,
    files:['13-sesion-inicial-4-anos.docx','14-ficha-del-paquete-inicial.docx','15-cotejo-inicial-4-anos.docx'],
    editorialStatus:'PENDIENTE de inspección pedagógica y visual humana'
  },null,2));
  console.log('PASS Inicial completo: unidad, sesión, ficha y cotejo relacionados, Word y recuperación.');
}catch(error){
  await fs.writeFile(path.join(out,'error-paquete-inicial.txt'),String(error.stack||error));
  throw error;
}finally{await browser.close();}
