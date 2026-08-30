/* DocenteDigital – confirmación lingüística v37
   Evita imponer automáticamente una lengua/variedad al cambiar a EIB.
   La selección debe ser explícita del docente; una sugerencia regional nunca equivale a confirmación. */
(function(){
  if(window.__ddLinguisticConfirmationV37)return;window.__ddLinguisticConfirmationV37=true;
  const NONE='Ninguna';

  function saveSafe(){try{if(typeof save==='function')save();}catch(e){}}
  function regionText(){
    const c=state?.teacherContext||{};
    return String(c.region||c.department||c.departamento||'').trim();
  }
  function helpForEib(){
    const help=document.getElementById('ddLinguisticHelp');if(!help)return;
    const region=regionText();
    const suggestion=/cusco/i.test(region)?' <b>Sugerencia editable para Cusco:</b> revisa si corresponde Quechua Cusco-Collao; no se seleccionará automáticamente.':'';
    help.innerHTML='✓ <b>IE EIB:</b> selecciona y confirma explícitamente la lengua originaria/variedad que corresponde a tu IE.'+suggestion;
  }
  function wire(){
    const mode=document.getElementById('linguisticMode');
    const origin=document.getElementById('quechuaVar');
    if(!mode||!origin)return;

    if(!mode.dataset.dd37){
      mode.dataset.dd37='1';
      let previous=mode.value||state?.linguisticMode||'';
      mode.addEventListener('focus',()=>{previous=mode.value||state?.linguisticMode||'';});
      mode.addEventListener('change',()=>{
        const enteringEib=mode.value==='EIB'&&previous!=='EIB';
        if(enteringEib){
          origin.value=NONE;
          origin.disabled=false;
          state.indigenousLanguage=NONE;
          state.quechuaVar=NONE;
          state.linguisticSelectionConfirmed=false;
          helpForEib();
          saveSafe();
        }
        previous=mode.value;
      });
    }

    if(!origin.dataset.dd37){
      origin.dataset.dd37='1';
      origin.addEventListener('change',()=>{
        if(mode.value==='EIB'){
          state.linguisticSelectionConfirmed=!!origin.value&&origin.value!==NONE;
          state.indigenousLanguage=origin.value||NONE;
          state.quechuaVar=state.indigenousLanguage;
          saveSafe();
        }
      });
    }
  }

  const baseSync=window.ddSyncLinguisticProfile;
  if(typeof baseSync==='function')window.ddSyncLinguisticProfile=function(){
    const r=baseSync.apply(this,arguments);setTimeout(wire,0);return r;
  };

  const baseGo=window.go;
  if(typeof baseGo==='function')window.go=function(id){
    const r=baseGo.apply(this,arguments);if(id==='setup')setTimeout(wire,0);return r;
  };

  setTimeout(wire,0);
  window.ddAuditLinguisticConfirmation=function(){
    const mode=state?.linguisticMode||'';
    const origin=state?.indigenousLanguage||state?.quechuaVar||NONE;
    return {mode,origin,confirmed:mode!=='EIB'||(origin!==NONE&&state?.linguisticSelectionConfirmed===true)};
  };
})();