import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const baseUrl=process.env.BASE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1280,height:720},acceptDownloads:true});
const page=await context.newPage();

function assert(condition,message){if(!condition)throw new Error(message);}
const fixture=()=>({
  mode:'easy',level:'Primaria',ieType:'Multigrado',grades:['1.º','3.º','5.º'],areas:['Comunicación','Matemática'],
  language:'Castellano',quechuaVar:'Ninguna',units:[{id:'u-continuity',title:'Unidad de continuidad',type:'Unidad de aprendizaje',duration:'2 semanas',situationBrief:'Prueba de continuidad',situation:'Situación de prueba para continuidad.',grades:['1.º','3.º','5.º'],areas:['Comunicación','Matemática'],activities:[{area:'Comunicación',title:'Leemos para probar continuidad',week:1,order:1}],selectionApproved:true}],
  activeUnitId:'u-continuity',lastSession:{unitId:'u-continuity',title:'Leemos para probar continuidad',area:'Comunicación',duration:'90 minutos',criterion:'Identifica información y explica lo comprendido.',evidence:'Respuesta y explicación.',instrument:'Lista de cotejo',createdAt:new Date().toISOString()}
});

async function readState(){return page.evaluate(()=>JSON.parse(localStorage.getItem('docenteDigitalPrototype')||'{}'));}

try{
  console.log('CONTINUITY 1/4 Exportación e importación de respaldo JSON');
  await page.goto(baseUrl,{waitUntil:'domcontentloaded'});
  await page.evaluate(data=>{localStorage.clear();localStorage.setItem('docenteDigitalPrototype',JSON.stringify(data));},fixture());
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

  await page.evaluate(()=>{
    const s=JSON.parse(localStorage.getItem('docenteDigitalPrototype')||'{}');
    s.units=[];s.activeUnitId=null;s.lastSession=null;
    localStorage.setItem('docenteDigitalPrototype',JSON.stringify(s));
  });
  await page.reload({waitUntil:'domcontentloaded'});
  await page.evaluate(()=>window.go('settings'));
  await page.waitForSelector('#ddImportBackupFile',{timeout:10000});
  let accepted=false;
  page.once('dialog',async dialog=>{accepted=true;await dialog.accept();});
  await page.locator('#ddImportBackupFile').setInputFiles(backupPath);
  await page.waitForLoadState('domcontentloaded').catch(()=>{});
  await page.waitForFunction(()=>{
    try{const s=JSON.parse(localStorage.getItem('docenteDigitalPrototype')||'{}');return s.units?.some(u=>u.id==='u-continuity')&&s.lastSession?.unitId==='u-continuity';}catch{return false;}
  },null,{timeout:10000});
  assert(accepted,'La importación no pidió confirmación');

  console.log('CONTINUITY 2/4 Recuperación de almacenamiento corrupto');
  await page.evaluate(()=>localStorage.setItem('docenteDigitalPrototype','{"estado":'));
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>!!window.__ddStorageRecovered,null,{timeout:10000});
  const corruption=await page.evaluate(()=>({
    primary:localStorage.getItem('docenteDigitalPrototype'),
    recoveryKeys:Object.keys(localStorage).filter(k=>k.startsWith('docenteDigitalPrototype_recovery_')),
    recovered:window.__ddStorageRecovered
  }));
  assert(corruption.primary===null,'El estado corrupto siguió activo');
  assert(corruption.recoveryKeys.length>0,'No se creó copia del estado corrupto');
  assert(corruption.recovered?.backedUp===true,'La recuperación no confirmó respaldo del estado inválido');

  console.log('CONTINUITY 3/4 Restablecer fixture para prueba sin red');
  await page.evaluate(data=>localStorage.setItem('docenteDigitalPrototype',JSON.stringify(data)),fixture());
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof window.ddDocxSelfTest==='function',null,{timeout:10000});

  console.log('CONTINUITY 4/4 Continuidad con red caída después de cargar');
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
