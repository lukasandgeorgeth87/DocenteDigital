/* Evidencia reproducible: documentos descargados mediante botones de la aplicación.
   Solo datos ficticios, sin llamadas pagadas ni nombres de menores reales. */
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

const BASE=process.env.BASE_URL||'http://127.0.0.1:4173';
const out=process.env.EVIDENCE_DIR||'/tmp/dd-commercial-evidence';
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||undefined});
const context=await browser.newContext({viewport:{width:1365,height:900},acceptDownloads:true});
const page=await context.newPage();
const errors=[];page.on('pageerror',error=>errors.push(error.message));

async function download(filename,click){
  const promise=page.waitForEvent('download',{timeout:20000});
  await click();
  const dl=await promise;
  const location=path.join(out,filename);
  await dl.saveAs(location);
  const bytes=await fs.readFile(location);
  assert(bytes.length>1000,filename+' está vacío');
  assert.equal(bytes.toString('latin1',0,2),'PK',filename+' debe ser ZIP OOXML');
  return bytes;
}
function extractZipText(bytes,target){
  let pos=0;
  while(pos+30<bytes.length&&bytes.readUInt32LE(pos)===0x04034b50){
    const method=bytes.readUInt16LE(pos+8),size=bytes.readUInt32LE(pos+18);
    const nameSize=bytes.readUInt16LE(pos+26),extraSize=bytes.readUInt16LE(pos+28);
    const name=bytes.subarray(pos+30,pos+30+nameSize).toString('utf8');
    const begin=pos+30+nameSize+extraSize;
    if(name===target){assert.equal(method,0);return bytes.subarray(begin,begin+size).toString('utf8');}
    pos=begin+size;
  }
  throw new Error('No existe '+target);
}
try{
  await page.goto(BASE,{waitUntil:'networkidle'});
  await page.evaluate(()=>localStorage.clear());
  await page.reload({waitUntil:'networkidle'});
  await page.locator('input[name="ddLevel"][value="Primaria"]').locator('..').click();
  await page.locator('input[name="ddIE"][value="Polidocente"]').locator('..').click();
  await page.locator('[data-dd-grade-group="Primaria"] input[type="checkbox"][value="2.º"]').locator('..').click();
  for(const area of ['Comunicación','Matemática','Personal Social','Ciencia y Tecnología','Arte y Cultura','Educación Física','Educación Religiosa']){
    const choice=page.locator('[data-dd-area-group="Primaria"] input[type="checkbox"][value="'+area+'"]');
    if(await choice.count()&&!(await choice.isChecked()))await choice.locator('..').click();
  }
  await page.locator('#linguisticMode').selectOption('Monolingüe castellano');
  await page.locator('#ddSetupNativeForm button[type="submit"]').click();
  await page.waitForFunction(()=>window.__ddPlanningRuntimeReady===true,null,{timeout:25000});
  await page.evaluate(()=>go('plan'));
  await page.locator('button[onclick="showUnit()"]',{hasText:'Crear nueva'}).click();
  const unitKind=page.locator('#ddPlanningKindChooser [data-kind="Unidad de aprendizaje"]');
  if(await unitKind.count())await unitKind.click();
  await page.locator('#unitDuration').selectOption({label:'3 semanas'});
  await page.locator('#unitSituation').fill('Los derechos de las niñas y los niños: en el aula leemos historietas y aprendemos a respetar nuestras opiniones.');
  await page.locator('button[onclick="createUnitDemo()"]',{hasText:'Crear propuesta completa'}).click();
  await page.waitForSelector('#ddProposalChooser:not(.hidden)',{timeout:20000});
  await page.locator('input[name="ddSituation"]').first().check();
  await page.locator('#ddContinueProducts').click();
  await page.waitForSelector('input[name="ddProduct"]');
  await page.locator('input[name="ddProduct"]').nth(2).check();
  await page.locator('#ddBuildUnit').click();
  await page.waitForSelector('#ddV2Start',{timeout:18000});
  await page.locator('#ddV2Start').click();
  await page.waitForSelector('#ddV2Proposal');
  await page.getByRole('button',{name:'Aprobar y generar unidad 2.0'}).click();
  await page.waitForFunction(()=>window.state.units[0]?.pedagogicalV3?.version==='3.0.0-contract-first',{timeout:25000});
  const unit=await page.evaluate(()=>window.state.units[0]);
  assert.equal(unit.activities.length,30);
  assert(unit.title.length<=100,'El título automático es demasiado extenso para un documento comercial');
  assert(unit.activities.every(a=>a.criterion&&a.evidence&&a.title));
  assert(!unit.activities.some(a=>/Actividad de aprendizaje \d+/.test(a.title)));
  await page.screenshot({path:path.join(out,'01-unidad-en-la-app.png'),fullPage:true});
  const docxUnit=await download('01-unidad-derechos-2-primaria.docx',()=>page.evaluate(id=>downloadUnitWord(id),unit.id));
  const unitXml=extractZipText(docxUnit,'word/document.xml');
  for(const text of ['SITUACIÓN SIGNIFICATIVA','MATRIZ CURRICULAR','SECUENCIA PROGRESIVA'])assert(unitXml.includes(text),text+' ausente en la unidad');
  assert(!unitXml.includes('PROPUESTA PEDAGÓGICA V3'),'El documento exporta una etiqueta técnica interna');

  await page.evaluate(id=>useUnit(id),unit.id);
  await page.waitForSelector('#activity option',{state:'attached'});
  await page.evaluate(()=>generateSession());
  await page.waitForFunction(()=>window.state.lastSession?.pedagogicalV3?.version==='3.0.0-contract-first');
  const session=await page.evaluate(()=>window.state.lastSession);
  assert.equal(session.unitId,unit.id);
  assert.equal(session.pedagogicalV3.criterion,unit.activities[0].criterion);
  await page.screenshot({path:path.join(out,'02-sesion-en-la-app.png'),fullPage:true});
  const docxSession=await download('02-sesion-derechos-2-primaria.docx',()=>page.evaluate(()=>downloadSessionWord()));
  const sessionXml=extractZipText(docxSession,'word/document.xml');
  for(const text of ['SESIÓN DE APRENDIZAJE','Criterio observable','Evidencia'])assert(sessionXml.includes(text),text+' ausente en sesión');

  await page.evaluate(()=>{go('materials');window.DDMaterials.useCurrent();});
  await page.locator('#materialType').selectOption('Ficha de trabajo');
  await page.locator('#materialGrade').selectOption('2.º');
  await page.locator('#materialArea').selectOption('Comunicación');
  await page.locator('#materialTopic').fill('Leemos historietas sobre el derecho a participar');
  await page.evaluate(()=>window.DDMaterials.create());
  await page.waitForSelector('#materialOutput .dd-editable-material');
  await page.screenshot({path:path.join(out,'03-ficha-en-la-app.png'),fullPage:true});
  const docxMaterial=await download('03-ficha-derechos-2-primaria.docx',()=>page.evaluate(()=>window.DDMaterials.downloadWord()));
  const materialXml=extractZipText(docxMaterial,'word/document.xml');
  assert(/derecho a participar/i.test(materialXml),'La ficha perdió su tema');
  for(const expected of ['Una idea para jugar','Ana','Luis','Mara','LOCALIZO','PARTICIPO'])
    assert(materialXml.includes(expected),'La ficha no ofrece un estímulo o una tarea concreta: '+expected);
  assert(!materialXml.includes('todos?Ana'),'Word unió una pregunta y sus opciones sin espacio');
  assert(!materialXml.includes('Vinculación con la planificación'),'La ficha imprimible contiene metadatos administrativos');

  await page.evaluate(()=>{go('evaluation');window.DDEvaluation.openRubric();});
  await page.locator('#ddRubGrade').selectOption('2.º');
  await page.locator('#ddRubArea').selectOption('Comunicación');
  await page.locator('#ddRubBuild').click();
  await page.waitForSelector('#ddRubBody .dd-editable-material');
  await page.screenshot({path:path.join(out,'04-rubrica-en-la-app.png'),fullPage:true});
  const docxRubric=await download('04-rubrica-derechos-2-primaria.docx',()=>page.locator('#ddRubWord').click());
  const rubricXml=extractZipText(docxRubric,'word/document.xml');
  for(const text of ['Rúbrica','Criterio','AD','A','B','C'])assert(rubricXml.includes(text),text+' ausente en rúbrica');
  assert(rubricXml.includes('formula una pregunta relacionada'),'La rúbrica carece de un descriptor observable de la sesión');
  assert(!rubricXml.includes('Realiza lo esperado con autonomía'),'La rúbrica repite un descriptor genérico');

  await page.evaluate(()=>window.DDEvaluation.openAssessment());
  await page.locator('#ddAssGrade').selectOption('2.º');
  await page.locator('#ddAssArea').selectOption('Comunicación');
  await page.locator('#ddAssInstrument').selectOption('Lista de cotejo');
  await page.locator('#ddAssCreate').click();
  await page.waitForSelector('#ddAssBody .dd-editable-material');
  await page.screenshot({path:path.join(out,'04b-instrumento-en-la-app.png'),fullPage:true});
  const docxInstrument=await download('04b-instrumento-derechos-2-primaria.docx',()=>page.locator('#ddAssWord').click());
  const instrumentXml=extractZipText(docxInstrument,'word/document.xml');
  for(const text of ['Lista de cotejo','Indicador observable','En proceso','Formula una pregunta','Evidencia observada'])
    assert(instrumentXml.includes(text),'La lista de cotejo no permite registrar '+text);

  await page.evaluate(()=>window.DDEvaluation.openRegister());
  await page.locator('#ddEvalGrade').selectOption('2.º');
  await page.locator('#ddEvalArea').selectOption('Comunicación');
  await page.locator('#ddEvalRoster').click();
  await page.locator('#ddRosterText').fill('E01\nE02');
  await page.locator('#ddRosterSave').click();
  assert(await page.locator('.dd-eval-level').count()>0,'Faltan criterios de evaluación para registrar');
  await page.locator('.dd-eval-level').first().selectOption('A');
  await page.locator('.dd-eval-note').first().fill('Explicó oralmente el derecho a participar en la historieta.');
  await page.screenshot({path:path.join(out,'05-registro-en-la-app.png'),fullPage:true});
  const xlsx=await download('05-registro-derechos-2-primaria.xlsx',()=>page.locator('#ddEvalExcel').click());
  const sheet=extractZipText(xlsx,'xl/worksheets/sheet1.xml');
  assert(sheet.includes('E01'));
  assert(sheet.includes('E02'),'El Excel omite estudiantes sin evaluación aún registrada');
  assert(sheet.includes('Explicó oralmente el derecho a participar'));
  assert(!sheet.includes('<f>'),'Se exportó una fórmula ejecutable');

  await page.evaluate(()=>{go('documents');window.DDDocumentLibrary.open();});
  await page.waitForFunction(()=>document.querySelectorAll('#documentsList [data-doc]').length>=5,null,{timeout:15000});
  const available=await page.locator('#documentsList [data-doc]').count();
  assert(available>=5,'La biblioteca no contiene todos los documentos generados: '+available);
  await page.screenshot({path:path.join(out,'06-biblioteca-en-la-app.png'),fullPage:true});
  const before=await page.evaluate(()=>window.DDDocumentLibrary.readAll().then(ds=>ds.length));
  await page.locator('#documentsList [data-doc^="instrumento:"] [data-action="open"]').first().click();
  await page.waitForSelector('#ddAssBody .dd-editable-material');
  assert((await page.locator('#ddAssBody .dd-editable-material').innerText()).includes('Lista de cotejo'),'La biblioteca no abrió el instrumento archivado');
  await page.evaluate(()=>{go('documents');window.DDDocumentLibrary.open();});
  await page.locator('#documentsList [data-doc^="unidad:"] [data-action="duplicate"]').first().click();
  await page.waitForFunction(()=>window.state.units.length===2);
  assert((await page.evaluate(()=>window.state.units.map(u=>u.title))).some(t=>t.includes('(copia)')),'La biblioteca no duplicó la unidad');
  await page.waitForFunction(async count=>(await window.DDDocumentLibrary.readAll()).length>=count+1,before,{timeout:15000});
  await page.reload({waitUntil:'networkidle'});
  await page.waitForFunction(()=>window.DDDocumentLibrary?.readAll!=null);
  const after=await page.evaluate(()=>window.DDDocumentLibrary.readAll().then(ds=>ds.length));
  assert(after>=before+1,'La copia de la unidad no quedó archivada');
  assert.deepEqual(errors.filter(x=>/ReferenceError|SyntaxError/.test(x)),[]);

  const results={case:'Primaria, 2.º, Comunicación, derechos de los niños',unit:unit.title,unitId:unit.id,
    session:session.title,materials:1,rubrics:1,instruments:1,studentCodes:2,storedDocuments:after,
    files:['01-unidad-derechos-2-primaria.docx','02-sesion-derechos-2-primaria.docx','03-ficha-derechos-2-primaria.docx','04-rubrica-derechos-2-primaria.docx','04b-instrumento-derechos-2-primaria.docx','05-registro-derechos-2-primaria.xlsx'],
    editorialStatus:'PENDIENTE de inspección humana de contenido y maquetación; no equivale a aprobación comercial'};
  await fs.writeFile(path.join(out,'resultado-tecnico.json'),JSON.stringify(results,null,2));
  console.log('PASS prueba real de generación/exportación: '+JSON.stringify(results));
}catch(error){
  await page.screenshot({path:path.join(out,'error.png'),fullPage:true}).catch(()=>{});
  await fs.writeFile(path.join(out,'error.txt'),String(error.stack||error));
  console.error('FAIL prueba real de documentos:',error);
  throw error;
}finally{await browser.close();}
