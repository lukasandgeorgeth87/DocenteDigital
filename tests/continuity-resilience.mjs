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
  activeUnitId:'u-continuity',lastSession:{unitId:'u-continuity',title:'Leemos para probar continuidad',area:'Comunicación',level:'Primaria',ieType:'Multigrado',grades:['1.º','3.º','5.º'],unitTitle:'Unidad de continuidad',duration:'90 minutos',purpose:'Comprender información de un texto breve y explicar lo comprendido.',criterion:'Identifica información y explica lo comprendido.',evidence:'Respuesta y explicación.',instrument:'Lista de cotejo',resources:'Texto breve, fichas y lápices.',challenge:'Explicar qué información del texto sustenta la respuesta.',times:{start:15,dev:60,close:15},createdAt:new Date().toISOString()}
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
  await page.locator('input[name="ddLevel"][value="Primaria"]').locator('..').click();
  await page.locator('input[name="ddIE"][value="Multigrado"]').locator('..').click();
  for(const grade of ['1.º','3.º','5.º']) {
    await page.locator('[data-dd-grade-group="Primaria"] input[type="checkbox"][value="'+grade+'"]').locator('..').click();
  }
  for(const area of ["Comunicación","Matemática"]) {
    await page.locator('[data-dd-area-group="Primaria"] input[type="checkbox"][value="'+area+'"]').locator('..').click();
  }
  await page.locator('#linguisticMode').selectOption('Monolingüe castellano');
  await page.locator('#ddSetupNativeForm button[type="submit"]').click();
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
  // Regression from teacher screenshot: do not treat generated titles as new context.
  console.log('TITLE_CONTEXT: Todos los Santos / no recursive title feedback');
  await page.waitForFunction(()=>typeof window.ddNaturalPlanningTitles==='function'&&typeof window.refreshUnitTitleSuggestions==='function',null,{timeout:10000});
  const titleRegression=await page.evaluate(()=>{
    const input=document.getElementById('unitTitle'),brief=document.getElementById('unitSituation');
    const saved={title:input.value,auto:input.dataset.autoTitle,suggested:input.dataset.ddSuggestedTitle,situation:brief.value,level:state.level};
    const text='el 1 y 2 de noviembre recordamos la fiesta de todos los santos';
    try{
      input.value='Aprendemos desde nuestro contexto: '+text+' Aprendemos desde nuestro contexto';
      input.dataset.autoTitle='true';
      brief.value=text;
      const byLevel={};
      for(const level of ['Inicial','Primaria','Secundaria']){
        state.level=level;
        byLevel[level]=window.ddNaturalPlanningTitles(text,'Unidad de aprendizaje');
      }
      state.level='Primaria';
      window.refreshUnitTitleSuggestions();
      const first={
        title:input.value,
        options:[...document.querySelectorAll('#unitTitleSuggestions .dd-title-option')].map(b=>b.textContent.trim())
      };
      window.refreshUnitTitleSuggestions();
      const second={
        title:input.value,
        options:[...document.querySelectorAll('#unitTitleSuggestions .dd-title-option')].map(b=>b.textContent.trim())
      };
      window.chooseUnitTitle(second.options[0]);
      const afterChoice=window.ddNaturalPlanningTitles(text,'Unidad de aprendizaje');
      return {byLevel,first,second,afterChoice,clickedSuggestionMarked:input.dataset.ddSuggestedTitle==='true'};
    }finally{
      input.value=saved.title;
      if(saved.auto===undefined)delete input.dataset.autoTitle;else input.dataset.autoTitle=saved.auto;
      if(saved.suggested===undefined)delete input.dataset.ddSuggestedTitle;else input.dataset.ddSuggestedTitle=saved.suggested;
      brief.value=saved.situation;
      state.level=saved.level;
    }
  });
  for(const [level,titles] of Object.entries(titleRegression.byLevel)){
    assert(titles.length===3,level+': no se propusieron tres títulos');
    assert(new Set(titles).size===3,level+': títulos duplicados');
    assert(titles.filter(t=>/Todos los Santos/i.test(t)).length>=2,level+': se perdió la festividad expresada');
    assert(titles.every(t=>t.length<120&&!/Aprendemos desde nuestro contexto/i.test(t)),level+': títulos repetitivos o demasiado extensos');
  }
  assert(titleRegression.clickedSuggestionMarked,'Elegir un título no lo marcó como derivado del contexto');
  assert(JSON.stringify(titleRegression.afterChoice)===JSON.stringify(titleRegression.byLevel.Primaria),'Elegir una sugerencia volvió a inyectarla en el contexto');
  assert(titleRegression.first.title===titleRegression.second.title,'El título creció al recalcularlo');
  assert(JSON.stringify(titleRegression.first.options)===JSON.stringify(titleRegression.second.options),'Las propuestas cambiaron sin que cambiara el contexto');
  assert(titleRegression.second.options.length===3,'El formulario principal no ofrece tres títulos');
  assert(titleRegression.second.options.every(t=>/Todos los Santos/i.test(t)),'El formulario principal no usa los títulos contextuales');
  console.log('TITLE_CONTEXT_TODOS_LOS_SANTOS_PASS',JSON.stringify(titleRegression.second));
  // Regression from the teacher's 27 Oct significant-situation screenshot:
  // a stale auto-title must NOT be merged into the teacher's genuine context.
  console.log('SITUATION_CONTEXT: Todos los Santos; cultural meaning + products');
  const situationRegression=await page.evaluate(()=>{
    const situation=document.getElementById('unitSituation');
    const title=document.getElementById('unitTitle');
    const type=document.getElementById('unitType');
    const saved={
      situation:situation.value,title:title.value,
      auto:title.dataset.autoTitle,selected:title.dataset.ddSuggestedTitle,
      type:type.value,level:state.level,pending:state.pendingUnitChoice
    };
    const teacherText='el 1 y 2 de noviembre recordamos la fiesta de todos los santos';
    const results={};
    try{
      situation.value=teacherText;
      title.value='Aprendemos desde nuestro contexto: Aprendemos desde nuestro contexto';
      title.dataset.autoTitle='true';
      type.value='Unidad de aprendizaje';
      for(const level of ['Inicial','Primaria','Secundaria']){
        state.level=level;
        window.createUnitDemo(); // actual planning flow (also wrapped by safety guards)
        const choice=state.pendingUnitChoice||{};
        results[level]={
          brief:choice.brief,
          situations:(choice.situations||[]).map(x=>({title:x.title,text:x.text})),
          products:(choice.products||[]).map(x=>({title:x.title,text:x.text})),
          challenge:choice.reto||''
        };
      }
    }finally{
      situation.value=saved.situation;
      title.value=saved.title;
      if(saved.auto===undefined)delete title.dataset.autoTitle;else title.dataset.autoTitle=saved.auto;
      if(saved.selected===undefined)delete title.dataset.ddSuggestedTitle;else title.dataset.ddSuggestedTitle=saved.selected;
      type.value=saved.type;
      state.level=saved.level;
      state.pendingUnitChoice=saved.pending;
      document.getElementById('ddProposalChooser')?.classList.add('hidden');
      if(typeof window.save==='function')window.save();
    }
    return results;
  });
  for(const [level,pack] of Object.entries(situationRegression)){
    assert(pack.brief==='el 1 y 2 de noviembre recordamos la fiesta de todos los santos',level+': original teacher context changed');
    assert(pack.situations.length===2,level+': expected two significant situations');
    assert(pack.products.length===3,level+': expected three contextual products');
    const combined=pack.situations.map(x=>x.title+' '+x.text).join(' ')+pack.products.map(x=>x.title+' '+x.text).join(' ');
    assert(!/Aprendemos desde nuestro contexto|aprendemos · nuestro · contexto/i.test(combined),level+': generated-title content leaked into proposals');
    assert(pack.situations.every(x=>/Todos los Santos/.test(x.text)),level+': teacher cultural topic missing');
    assert(pack.products.some(x=>/Todos los Santos/.test(x.title)),level+': contextual products missing');
    assert(pack.situations.every(x=>x.text.length>250),level+': situation too superficial to guide a session');
    assert(!pack.situations.some(x=>/todas las familias celebran igual/i.test(x.text)),level+': false family generalization');
  }
  console.log('SITUATION_CONTEXT_TODOS_LOS_SANTOS_PASS',JSON.stringify(Object.fromEntries(Object.entries(situationRegression).map(([level,pack])=>[level,{titles:pack.situations.map(x=>x.title),products:pack.products.map(x=>x.title)}]))));
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
  // Regression: corrupt, expired or future-dated local drafts must not be restored.
  const draftValidation=await page.evaluate(()=>{
    const key='docenteDigitalBetaDraftUnit',api=window.ddBetaDraftAutosave;
    const base={title:'Unidad ficticia',situation:'Solo datos de prueba',type:'Unidad de aprendizaje',duration:'3 semanas'};
    const check=savedAt=>{
      localStorage.setItem(key,JSON.stringify({...base,savedAt}));
      const recovered=!!api.read();
      return {recovered,cleared:localStorage.getItem(key)===null};
    };
    const valid=check(new Date(Date.now()-60000).toISOString());
    const expired=check(new Date(Date.now()-8*24*60*60*1000).toISOString());
    const malformed=check('fecha-no-valida');
    const future=check(new Date(Date.now()+24*60*60*1000).toISOString());
    localStorage.setItem(key,'{json-incompleto');
    const corrupt=api.read()===null&&localStorage.getItem(key)===null;
    return {valid,expired,malformed,future,corrupt};
  });
  assert(draftValidation.valid.recovered,'Se rechazó un borrador local reciente válido');
  for(const key of ['expired','malformed','future']){
    assert(!draftValidation[key].recovered&&draftValidation[key].cleared,
      'Se aceptó un borrador con fecha inválida o caducada: '+key);
  }
  assert(draftValidation.corrupt,'Un borrador JSON corrupto quedó almacenado tras leerlo');
  await page.evaluate(()=>window.ddBetaDraftAutosave.clear());
  // Regression: a previous unit with the same situation must not make a
  // failed creation look successful and silently discard the teacher's draft.
  const draftClickRegression=await page.evaluate(async()=>{
    const key='docenteDigitalBetaDraftUnit',stateKey='docenteDigitalPrototype';
    const originalState=localStorage.getItem(stateKey);
    const title=document.getElementById('unitTitle'),situation=document.getElementById('unitSituation');
    const oldTitle=title.value,oldSituation=situation.value;
    const draftTitle='Unidad de continuidad',draftSituation='Prueba de continuidad';
    title.value=draftTitle;situation.value=draftSituation;
    localStorage.setItem(key,JSON.stringify({
      title:draftTitle,situation:draftSituation,type:'Unidad de aprendizaje',
      duration:'2 semanas',savedAt:new Date().toISOString()
    }));
    // A matching historical unit is not evidence of a fresh save.
    // The API itself must refuse to clear the draft for that old unit.
    const previousUnit=JSON.parse(localStorage.getItem(stateKey)||'{}').units?.find(u=>
      u.title===draftTitle&&u.situationBrief===draftSituation);
    const oldUnitRejected=!!previousUnit&&window.ddBetaDraftAutosave.clearIfPersisted(previousUnit)===false;
    const button=document.createElement('button');
    button.id='ddBuildUnit';button.type='button';document.body.appendChild(button);
    button.click();
    await new Promise(resolve=>setTimeout(resolve,650));
    const retained=localStorage.getItem(key)!==null;
    // A synthetic legacy button without a real save handler must NOT
    // be treated as a successful persistence event. The actual creation
    // path is exercised below with the production createUnitDemo() button.
    if(originalState===null)localStorage.removeItem(stateKey);
    else localStorage.setItem(stateKey,originalState);
    title.value=oldTitle;situation.value=oldSituation;button.remove();
    return {retained,oldUnitRejected};
  });
  assert(draftClickRegression.oldUnitRejected,'clearIfPersisted aceptó una unidad histórica como si fuera nueva');
  assert(draftClickRegression.retained,'Una unidad anterior con igual contexto borró el borrador sin crear otra');
  // The live createUnitDemo() opens the situation/product chooser. Only
  // confirming both steps invokes the underlying persistence handler.
  // A click on "Crear propuesta completa" alone must retain the draft.
  const liveButtonRegression=await page.evaluate(async()=>{
    const key='docenteDigitalBetaDraftUnit',stateKey='docenteDigitalPrototype';
    const savedState=localStorage.getItem(stateKey);
    const title=document.getElementById('unitTitle'),situation=document.getElementById('unitSituation');
    const oldTitle=title.value,oldSituation=situation.value;
    const draftTitle='Unidad desde botón real',draftSituation='Reto nuevo de continuidad';
    title.value=draftTitle;situation.value=draftSituation;
    localStorage.setItem(key,JSON.stringify({
      title:draftTitle,situation:draftSituation,savedAt:new Date().toISOString()
    }));
    // Step 1: the real button opens choices; it does NOT persist a unit yet.
    const button=document.querySelector('#unitPanel button[onclick="createUnitDemo()"]');
    if(!button)throw new Error('No se encontró el botón real de creación');
    // A normal (non-heritage) topic must use the real two-option generator,
    // not silently fall back after a ReferenceError in situationOptions().
    window.__ddProposalChoiceFallback=false;
    button.click();
    const proposalFallback=window.__ddProposalChoiceFallback===true;
    const proposalCount=document.querySelectorAll('#ddProposalChooser input[name="ddSituation"]').length;
    const afterOpening=localStorage.getItem(key)!==null;
    // Step 2: select an actual situation from the production chooser.
    const situationChoice=document.querySelector('#ddProposalChooser input[name="ddSituation"]');
    if(!situationChoice)throw new Error('No apareció el selector real de situaciones');
    situationChoice.click();
    const continueButton=document.getElementById('ddContinueProducts');
    if(!continueButton)throw new Error('Falta el botón real para continuar al producto');
    continueButton.click();
    const afterSituation=localStorage.getItem(key)!==null;
    // Step 3: select a real product and confirm construction/persistence.
    const productChoice=document.querySelector('#ddProposalChooser input[name="ddProduct"]');
    if(!productChoice)throw new Error('No apareció el selector real de productos');
    productChoice.click();
    const buildButton=document.getElementById('ddBuildUnit');
    if(!buildButton)throw new Error('Falta el botón real para construir la unidad');
    buildButton.click();
    await new Promise(resolve=>setTimeout(resolve,650));
    const persisted=JSON.parse(localStorage.getItem(stateKey)||'{}');
    const created=persisted.units?.some(u=>u.title===draftTitle&&u.situationBrief===draftSituation);
    const cleared=localStorage.getItem(key)===null;
    title.value=oldTitle;situation.value=oldSituation;
    if(savedState===null)localStorage.removeItem(stateKey);
    else localStorage.setItem(stateKey,savedState);
    return {afterOpening,afterSituation,created:!!created,cleared,proposalFallback,proposalCount};
  });
  assert(!liveButtonRegression.proposalFallback&&liveButtonRegression.proposalCount===2,
    'La propuesta común cayó al respaldo o no generó dos situaciones: '+JSON.stringify(liveButtonRegression));
  assert(liveButtonRegression.afterOpening&&liveButtonRegression.afterSituation,
    'Se perdió el borrador antes de confirmar la unidad: '+JSON.stringify(liveButtonRegression));
  assert(liveButtonRegression.created&&liveButtonRegression.cleared,
    'El flujo real situación→producto→guardar no persistió y limpió el borrador: '+JSON.stringify(liveButtonRegression));



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
  const corruptRaw='{"estado":';
  // Inject the corrupt fixture before app scripts run to avoid a navigation race.
  // sessionStorage prevents re-injection if onboarding redirects back to the app.
  await page.addInitScript(raw=>{
    if(sessionStorage.getItem('ddContinuityCorruptInjected')==='1')return;
    sessionStorage.setItem('ddContinuityCorruptInjected','1');
    localStorage.setItem('docenteDigitalPrototype',raw);
  },corruptRaw);
  // El gate previo al arranque respalda el estado corrupto y redirige al asistente
  // independiente antes de cargar storage-recovery-v26.js. Esperamos esa navegación
  // y verificamos el respaldo real, en lugar de esperar una variable del runtime no cargado.
  const onboardingNavigation=page.waitForURL(url=>url.pathname.endsWith('/onboarding.html'),{timeout:10000});
  await page.reload({waitUntil:'domcontentloaded'});
  await onboardingNavigation;
  // onboarding.html consume y elimina ddPreOnboardingRecovery de sessionStorage.
  // Esperamos la confirmación ya hidratada en window antes de verificarla.
  await page.waitForFunction(()=>window.__ddStorageRecovered?.backedUp===true,null,{timeout:10000});
  const corruption=await page.evaluate(expectedRaw=>{
    const primary=localStorage.getItem('docenteDigitalPrototype');
    const recoveryKeys=Object.keys(localStorage).filter(k=>k.startsWith('docenteDigitalPrototype_recovery_'));
    const backedUp=recoveryKeys.some(key=>localStorage.getItem(key)===expectedRaw);
    const recoveryMeta=window.__ddStorageRecovered||null;
    return {primary,recoveryKeys,backedUp,recoveryMeta};
  },corruptRaw);
  assert(corruption.primary===null,'El estado corrupto siguió activo después de la recuperación previa al arranque');
  assert(corruption.recoveryKeys.length>0,'No se creó una copia local del estado corrupto');
  assert(corruption.backedUp===true,'La copia local no conserva exactamente el estado corrupto original');
  assert(corruption.recoveryMeta?.backedUp===true,'El asistente no recibió confirmación de respaldo del estado inválido');

  console.log('CONTINUITY 4/5 Restablecer estado válido para prueba sin red');
  await page.evaluate(data=>localStorage.setItem('docenteDigitalPrototype',JSON.stringify(data)),seeded);
  // La recuperación de una configuración corrupta ahora dirige al asistente
  // independiente: volver a la raíz después de restaurar un perfil válido.
  await page.goto(baseUrl,{waitUntil:'networkidle'});
  await waitPlanningRuntime();
  // A late autosave in the old document must never overwrite the snapshot
  // that the recovery handler has just restored before location.reload().
  const restoreWriteProtected=await page.evaluate(()=>{
    const key='docenteDigitalPrototype',original=localStorage.getItem(key);
    window.__ddRestoreNavigationPending=true;
    try{
      localStorage.setItem(key,JSON.stringify({units:[],lastSession:null}));
      return localStorage.getItem(key)===original;
    }finally{window.__ddRestoreNavigationPending=false;}
  });
  assert(restoreWriteProtected,'Un autosave tardío sobrescribió el estado durante la restauración');
  await page.waitForFunction(()=>typeof window.ddDocxSelfTest==='function',null,{timeout:10000});
  const beforePlan=await page.evaluate(()=>({
    active:document.querySelector('.screen.active')?.id||'',
    level:window.state?.level||'',
    ieType:window.state?.ieType||'',
    grades:Array.isArray(window.state?.grades)?window.state.grades:[],
    areas:Array.isArray(window.state?.areas)?window.state.areas:[],
    linguisticMode:window.state?.linguisticMode||'',
    userRole:window.state?.userRole||'',
    incomplete:window.__ddIncompleteBaseSetup||null
  }));
  console.log('CONTINUITY_STATE_BEFORE_OFFLINE',JSON.stringify(beforePlan));
  await page.evaluate(()=>window.go('plan'));
  await page.waitForTimeout(120);
  const afterPlan=await page.evaluate(()=>({
    active:document.querySelector('.screen.active')?.id||'',
    incomplete:window.__ddIncompleteBaseSetup||null
  }));
  console.log('CONTINUITY_STATE_AFTER_GO_PLAN',JSON.stringify(afterPlan));
  assert(afterPlan.active==='plan',`No se pudo abrir planificación con estado válido: ${JSON.stringify({beforePlan,afterPlan})}`);
  await page.waitForFunction(()=>document.querySelector('#unitsList')?.textContent?.includes('Unidad de continuidad'),null,{timeout:10000});

  console.log('CONTINUITY 5/5 Continuidad con red caída después de cargar');
  await context.setOffline(true);
  const unitVisible=await page.locator('#unitsList').textContent();
  assert(unitVisible?.includes('Unidad de continuidad'),'No se pudo consultar la unidad ya cargada después de cortar la red');
  await page.evaluate(()=>window.go('session'));
  const docxOk=await page.evaluate(()=>window.ddDocxSelfTest());
  assert(docxOk===true,'La generación DOCX dejó de funcionar sin red');
  const offlineDocx=await page.evaluate(async()=>{
    const s=window.state?.lastSession;
    if(!s||!window.DDWordExport?.createBlob) return null;
    const blob=window.DDWordExport.createBlob(s.title,window.sessionHtml(s,true),false);
    const bytes=new Uint8Array(await blob.arrayBuffer());
    return {type:blob.type,size:bytes.length,head:Array.from(bytes.slice(0,4))};
  });
  assert(offlineDocx?.type==='application/vnd.openxmlformats-officedocument.wordprocessingml.document','El generador DOCX no produjo MIME OOXML sin red');
  assert(offlineDocx.size>500,'DOCX offline insuficiente o corrupto');
  assert(JSON.stringify(offlineDocx.head)==='[80,75,3,4]','DOCX offline no comienza con firma ZIP/OOXML válida');
  await context.setOffline(false);

  console.log('CONTINUITY 6/7 Rechazo de niveles contradictorios');
  const conflict=await page.evaluate(()=>{
    const s=window.state;
    const unit=s.units.find(u=>u.id==='u-continuity');
    delete unit.level;
    s.level='Primaria';
    s.lastSession.level='Secundaria';
    try{window.sessionHtml(s.lastSession,true);return '';}
    catch(error){return String(error?.message||error);}
  });
  assert(conflict.includes('no coincide'),'No se rechazaron niveles contradictorios: '+conflict);

  console.log('CONTINUITY 7/7 Rechazo si no hay nivel válido');
  const missing=await page.evaluate(()=>{
    const s=window.state;
    const unit=s.units.find(u=>u.id==='u-continuity');
    delete unit.level;
    s.lastSession.level='';
    s.level='';
    try{window.sessionHtml(s.lastSession,true);return '';}
    catch(error){return String(error?.message||error);}
  });
  assert(missing.includes('No se puede determinar'),'No se detuvo la generación sin nivel válido: '+missing);

  console.log('CONTINUITY_RESILIENCE_PASS');
}finally{
  await context.setOffline(false).catch(()=>{});
  await browser.close();
}
