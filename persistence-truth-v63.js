/* DocenteDigital – verdad de persistencia v64
   V4/V5: nunca presentar una unidad/proyecto o sesión como trabajo recuperable si el navegador no pudo persistirlo realmente.
   Esta defensa no sustituye backend, backup ni pruebas físicas; solo evita confirmaciones engañosas en localStorage.
*/
(function(){
  if(window.__ddPersistenceTruthV64)return;window.__ddPersistenceTruthV64=true;
  const KEY='docenteDigitalPrototype';
  const tidy=s=>String(s||'').replace(/\s+/g,' ').trim();

  function persistedState(){
    try{
      const raw=localStorage.getItem(KEY);
      const parsed=raw?JSON.parse(raw):null;
      return parsed&&typeof parsed==='object'&&!Array.isArray(parsed)?parsed:null;
    }catch(e){return null;}
  }
  function unitPersisted(id){
    if(!id)return false;
    const stored=persistedState();
    return !!(stored&&Array.isArray(stored.units)&&stored.units.some(u=>u&&String(u.id)===String(id)));
  }
  function sessionPersisted(id){
    if(!id)return false;
    const stored=persistedState();
    return !!(stored&&stored.lastSession&&String(stored.lastSession.id)===String(id));
  }
  function markUnitUnsaved(unit){
    if(!unit||!unit.id)return;
    const ready=document.getElementById('unitReady');
    if(ready){
      ready.classList.remove('success');
      ready.classList.add('notice');
      ready.textContent='⚠️ La unidad se creó en esta pantalla, pero no quedó guardada en el dispositivo. Libera espacio o habilita el almacenamiento antes de continuar.';
      ready.classList.remove('hidden');
    }
    const out=document.getElementById('unitOutput');
    if(out){
      const pill=[...out.querySelectorAll('.pill')].find(x=>/guardad/i.test(tidy(x.textContent)));
      if(pill) pill.textContent='⚠️ No guardada';
      if(!out.querySelector('[data-dd-unsaved-warning]')){
        const n=document.createElement('div');
        n.className='notice';n.dataset.ddUnsavedWarning='1';
        n.innerHTML='<b>⚠️ Este trabajo no está persistido todavía.</b><br>La pantalla puede seguir visible, pero al recargar podrías perderlo. Libera espacio o permite el almacenamiento y vuelve a guardar antes de continuar.';
        out.prepend(n);
      }
    }
  }
  function markSessionUnsaved(session){
    if(!session||!session.id)return;
    const out=document.getElementById('sessionOutput');
    if(!out)return;
    let n=out.querySelector('[data-dd-session-unsaved-warning]');
    if(!n){
      n=document.createElement('div');
      n.className='notice';n.dataset.ddSessionUnsavedWarning='1';
      n.innerHTML='<b>⚠️ Esta sesión no quedó guardada en el dispositivo.</b><br>Puedes verla o descargarla ahora, pero una recarga podría perderla. Libera espacio o permite el almacenamiento y vuelve a generarla antes de cerrar esta pantalla.';
      const doc=document.getElementById('sessionDocument')||out.querySelector('.document');
      if(doc)out.insertBefore(n,doc);else out.prepend(n);
    }
  }

  const baseCreate=window.createUnitDemo;
  if(typeof baseCreate==='function'&&!baseCreate.__ddPersistenceTruth){
    const wrapped=function(){
      const beforeError=window.__ddStorageQuotaError?.at||'';
      const result=baseCreate.apply(this,arguments);
      const unit=Array.isArray(state?.units)?state.units.find(u=>String(u?.id)===String(state?.activeUnitId)):null;
      if(unit&&!unitPersisted(unit.id)){
        markUnitUnsaved(unit);
        const afterError=window.__ddStorageQuotaError?.at||'';
        window.__ddPersistenceTruthFailure={at:new Date().toISOString(),kind:'unit',unitId:unit.id,storageErrorChanged:beforeError!==afterError};
      }
      return result;
    };
    wrapped.__ddPersistenceTruth=true;
    window.createUnitDemo=wrapped;
  }

  const baseRender=window.renderUnitOutput;
  if(typeof baseRender==='function'&&!baseRender.__ddPersistenceTruth){
    const wrapped=function(unit){
      const result=baseRender.apply(this,arguments);
      if(unit&&unit.id&&!unitPersisted(unit.id))markUnitUnsaved(unit);
      return result;
    };
    wrapped.__ddPersistenceTruth=true;
    window.renderUnitOutput=wrapped;
  }

  const baseGenerateSession=window.generateSession;
  if(typeof baseGenerateSession==='function'&&!baseGenerateSession.__ddPersistenceTruth){
    const wrapped=function(){
      const beforeError=window.__ddStorageQuotaError?.at||'';
      const result=baseGenerateSession.apply(this,arguments);
      const session=state?.lastSession||null;
      if(session&&session.id&&!sessionPersisted(session.id)){
        markSessionUnsaved(session);
        const afterError=window.__ddStorageQuotaError?.at||'';
        window.__ddPersistenceTruthFailure={at:new Date().toISOString(),kind:'session',sessionId:session.id,storageErrorChanged:beforeError!==afterError};
      }
      return result;
    };
    wrapped.__ddPersistenceTruth=true;
    window.generateSession=wrapped;
  }

  const baseRenderSession=window.renderSessionOutput;
  if(typeof baseRenderSession==='function'&&!baseRenderSession.__ddPersistenceTruth){
    const wrapped=function(session){
      const result=baseRenderSession.apply(this,arguments);
      if(session&&session.id&&!sessionPersisted(session.id))markSessionUnsaved(session);
      return result;
    };
    wrapped.__ddPersistenceTruth=true;
    window.renderSessionOutput=wrapped;
  }

  window.ddAuditPersistenceTruth=function(){
    const unitId=state?.activeUnitId||null;
    const sessionId=state?.lastSession?.id||null;
    return {
      testId:'AUD-STO-TRUTH-037',
      activeUnitId:unitId,
      unitPersisted:unitId?unitPersisted(unitId):null,
      lastSessionId:sessionId,
      sessionPersisted:sessionId?sessionPersisted(sessionId):null,
      storageQuotaError:window.__ddStorageQuotaError||null
    };
  };
})();