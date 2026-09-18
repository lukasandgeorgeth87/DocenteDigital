import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const baseUrl=process.env.BASE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1280,height:720},acceptDownloads:true});
const page=await context.newPage();

function assert(condition,message){if(!condition)throw new Error(message);}
const fixture=()=>({
  mode:'easy',level:'Primaria',ieType:'Multigrado',grades:['1.º','3.º','5.º'],areas:['Comunicación','Matemática'],
  linguisticMode:'Monolingüe castellano',language:'Castellano',indigenousLanguage:'Ninguna',quechuaVar:'Ninguna',linguisticSelectionConfirmed:false,units:[{id:'u-continuity',title:'Unidad de continuidad',type:'Unidad de aprendizaje',duration:'2 semanas',situationBrief:'Prueba de continuidad',situation:'Situación de prueba para continuidad.',grades:['1.º','3.º','5.º'],areas:['Comunicación','Matemática'],activities:[{area:'Comunicación',title:'Leemos para probar continuidad',week:1,order:1}],selectionApproved:true}],
  activeUnitId:'u-continuity',lastSession:{unitId:'u-continuity',title:'Leemos para probar continuidad',area:'Comunicación',duration:'90 minutos',criterion:'Identifica información y explica lo comprendido.',evidence:'Respuesta y explicación.',instrument:'Lista de cotejo',createdAt:new Date().toISOString()}
});

async function waitPlanningRuntime(){
  await page.waitForFunction(()=>window.__ddPlanningRuntimeReady===true,null,{timeout:20000});
  const failures=await page.evaluate(()=>Array.isArray(window.ddModuleLoadFailures)?[...window.ddModuleLoadFailures]:[]);
  assert(failures.length===0,`Fallaron módulos críticos antes de probar continuidad: ${failures.join(', ')}`);
}

async function configureValidTeacher(){
  await page.goto(baseUrl,{waitUntil:'networkidle'});
  await page.evaluate(()=>localStorage.clear());
  await page.reload({waitUntil:'networkidle'});
  await page.locator('#step1 .choice',{hasText:'Primaria'}).click();
  await page.locator('#step1 .btn',{hasText:'Continuar'}).click();
  await page.locator('#step2 .choice',{hasText:'Multigrado'}).click();
  await page.locator('#step2 .btn',{hasText:'Continuar'}).click();
  for(const grade of ['1.º','3.º','5.º'])await page.locator('#gradeChoices .choice',{hasText:grade}).click();
  await page.locator('#step3 .btn',{hasText:'Continuar'}).click();
  for(const area of ['Comunicación','Matemática'])await page.locator('#areaChoices .choice',{hasText:area}).click();
  await page.locator('#linguisticMode').selectOption({label:'Monolingüe castellano'});
  await page.locator('#step4 .btn',{hasText:'Guardar y entrar'}).click();
  await waitPlanningRuntime();
  const configured=await page.evaluate(()=>JSON.parse(localStorage.getItem('docenteDigitalPrototype')||'{}'));
  assert(configured.level==='Primaria'&&configured.ieType==='Multigrado','El setup real no dejó una configuración Docente válida');
  assert(configured.linguisticMode==='Monolingüe castellano','El setup real no guardó el perfil lingüístico monolingüe');
  return configured;
}

async function openUnitDraft(){
  await waitPlanningRuntime();
  await page.evaluate(()=>window.go('plan'));
  const create=page.locator('button[onclick="showUnit()"]',{hasText:'Crear nueva'}).first();
  await create.waitFor({state:'visible',timeout:10000});
  assert(await create.isEnabled(),'Crear nueva sigue bloqueado después de completar el runtime');
  await create.click();
  const chooser=page.locator('#ddPlanningKindChooser');
  if(await chooser.count()){
    await chooser.waitFor({state:'visible',timeout:10000});
    const unitKind=chooser.locator('[data-kind="Unidad de aprendizaje"]');
    if(await unitKind.count())await unitKind.click();
  }
  await page.locator('#unitSituation').waitFor({state:'visible',timeout:10000});
}

try{
  console.log('CONTINUITY 1/5 Autosave de borrador antes de crear una unidad');
  const configured=await configureValidTeacher();
  const seeded={...configured,units:fixture().units,activeUnitId:fixture().activeUnitId,lastSession:fixture().lastSession};
  await page.evaluate(data=>localStorage.setItem('docenteDigitalPrototype',JSON.stringify(data)),seeded);
  await page.reload({waitUntil:'networkidle'});
  await waitPlanningRuntime();
  await page.waitForFunction(()=>!!window.ddBetaDraftAutosave,null,{timeout:10000});
  await openUnitDraft();
  const draftText='Borrador rural de prueba que debe sobrevivir a una recarga antes de crear la unidad.';
  await page.locator('#unitSituation').fill(draftText);
  await page.waitForTimeout(700);
  const storedDraft=await page.evaluate(()=>JSON.parse(localStorage.getItem('docenteDigitalBetaDraftUnit')||'null'));
  assert(storedDraft?.situation===draftText,'El borrador no se guardó mientras se escribía');
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>!!window.ddBetaDraftAutosave,null,{timeout:10000});
  await openUnitDraft();
  await page.waitForFunction(expected=>document.getElementById('unitSituation')?.value===expected,draftText,{timeout:10000});
  assert(await page.locator('#unitSituation').inputValue()===draftText,'El borrador no reapareció después de recargar');
  await page.evaluate(()=>window.ddBetaDraftAutosave.clear());

  console.log('CONTINUITY 2/5 Exportación e importación de respaldo JSON');
  await page.evaluate(data=>localStorage.setItem('docenteDigitalPrototype',JSON.stringify(data)),fixture());
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForSelector('#ddBetaBanner',{timeout:10000});
  await page.evaluate(()=>window.go('settings'));
  await page.waitForSelector('#ddBetaBackupCard',{timeout:10000});
  const backupPromise=page.waitForEvent('download');
  await page.locator('#ddExportBackup').click();
  const backup=await backupPromise;
  const backupPath=await backup.path();
  assert(backupPath,'No se obtuvo archivo de respaldo');
  const envelope=JSON.parse(await fs.readFile(backupPath,'utf8'));
  assert(envelope.format==='DocenteDigitalBackup','Formato de respaldo incorrecto');
  assert(envelope.data?.units?.[0]?.id==='u-continuity','El respaldo no conserva la unidad');
  await page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('docenteDigitalPrototype')||'{}');s.units=[];s.activeUnitId=null;s.lastSession=null;localStorage.setItem('docenteDigitalPrototype',JSON.stringify(s));});
  await page.reload({waitUntil:'domcontentloaded'});
  await page.evaluate(()=>window.go('settings'));
  await page.waitForSelector('#ddImportBackupFile',{state:'attached',timeout:10000});
  let accepted=false;
  page.once('dialog',async dialog=>{accepted=true;await dialog.accept();});
  await page.locator('#ddImportBackupFile').setInputFiles(backupPath);
  await page.waitForLoadState('domcontentloaded').catch(()=>{});
  await page.waitForFunction(()=>{try{const s=JSON.parse(localStorage.getItem('docenteDigitalPrototype')||'{}');return s.units?.some(u=>u.id==='u-continuity')&&s.lastSession?.unitId==='u-continuity';}catch{return false;}},null,{timeout:10000});
  assert(accepted,'La importación no pidió confirmación');

  console.log('CONTINUITY 3/5 Recuperación de almacenamiento corrupto');
  await page.evaluate(()=>localStorage.setItem('docenteDigitalPrototype','{"estado":'));
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>!!window.__ddStorageRecovered,null,{timeout:10000});
  const corruption=await page.evaluate(()=>{
    const primary=localStorage.getItem('docenteDigitalPrototype');
    let primaryValid=primary===null;
    if(primary!==null){
      try{const parsed=JSON.parse(primary);primaryValid=!!parsed&&typeof parsed==='object'&&!Array.isArray(parsed);}catch{primaryValid=false;}
    }
    return {primary,primaryValid,recoveryKeys:Object.keys(localStorage).filter(k=>k.startsWith('docenteDigitalPrototype_recovery_')),recovered:window.__ddStorageRecovered};
  });
  assert(corruption.primaryValid===true,'El estado corrupto siguió activo o fue reemplazado por otro valor inválido');
  assert(corruption.primary!=='{"estado":','El valor corrupto original siguió activo');
  assert(corruption.recoveryKeys.length>0,'No se creó copia del estado corrupto');
  assert(corruption.recovered?.backedUp===true,'La recuperación no confirmó respaldo del estado inválido');

  console.log('CONTINUITY 4/5 Restablecer fixture para prueba sin red');
  await page.evaluate(data=>localStorage.setItem('docenteDigitalPrototype',JSON.stringify(data)),fixture());
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof window.ddDocxSelfTest==='function',null,{timeout:10000});

  console.log('CONTINUITY 5/5 Continuidad con red caída después de cargar');
  await context.setOffline(true);
  await page.evaluate(()=>window.go('plan'));
  const unitVisible=await page.locator('#unitsList').textContent();
  assert(unitVisible?.includes('Unidad de continuidad'),'No se pudo consultar la unidad cargada sin red');
  await page.evaluate(()=>window.go('session'));
  const docxOk=await page.evaluate(()=>window.ddDocxSelfTest());
  assert(docxOk===true,'La generación DOCX dejó de funcionar sin red');
  const offlineDownloadPromise=page.waitForEvent('download');
  await page.evaluate(()=>window.downloadSessionWord());
  const offlineDownload=await offlineDownloadPromise;
  const offlinePath=await offlineDownload.path();
  assert(offlinePath,'No se pudo descargar DOCX con red caída');
  const offlineBytes=await fs.readFile(offlinePath);
  assert(offlineBytes.length>500,'DOCX offline insuficiente o corrupto');
  await context.setOffline(false);

  console.log('CONTINUITY_RESILIENCE_PASS');
}finally{
  await context.setOffline(false).catch(()=>{});
  await browser.close();
}
