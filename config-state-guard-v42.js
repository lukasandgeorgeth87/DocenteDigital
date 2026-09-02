/* DocenteDigital – guardia de coherencia de configuración entre niveles y tipos de IE */
(function(){
  if(window.__ddConfigStateGuardV42)return;
  window.__ddConfigStateGuardV42=true;

  const allowedGrades=()=>typeof gradeOptions==='function'?gradeOptions():[];
  const allowedAreas=()=>typeof areaOptions==='function'?areaOptions():[];
  const NONE='Ninguna';

  function sanitizeConfiguration(){
    if(typeof state==='undefined')return;
    const grades=allowedGrades();
    const areas=allowedAreas();
    state.grades=Array.isArray(state.grades)?state.grades.filter(g=>grades.includes(g)):[];
    state.areas=Array.isArray(state.areas)?state.areas.filter(a=>areas.includes(a)):[];
    if(state.ieType==='Polidocente'&&state.grades.length>1)state.grades=[];
    if(state.level==='Secundaria'&&state.areas.length>1)state.areas=[];

    /* El prototipo base antiguo asignaba "Quechua Collao" aun sin confirmación.
       Un perfil no confirmado no puede heredar una lengua originaria como hecho. */
    if(!state.linguisticMode&&state.quechuaVar==='Quechua Collao'){
      state.quechuaVar=NONE;
      if(!state.indigenousLanguage)state.indigenousLanguage=NONE;
      state.linguisticSelectionConfirmed=false;
    }

    /* Mantiene coherencia mínima aun antes de que cargue linguistic-profile-v26.js. */
    if(state.linguisticMode==='Monolingüe castellano'){
      state.language='Castellano';
      state.indigenousLanguage=NONE;
      state.quechuaVar=NONE;
      state.linguisticSelectionConfirmed=false;
    }
  }

  function persistSetupProgress(){
    sanitizeConfiguration();
    if(typeof save==='function')save();
  }

  function hasCompleteLinguisticConfiguration(){
    if(typeof state==='undefined')return false;
    if(state.linguisticMode==='Monolingüe castellano')return true;
    if(state.linguisticMode!=='EIB')return false;
    const origin=String(state.indigenousLanguage||state.quechuaVar||'').trim();
    return Boolean(origin&&origin!==NONE&&state.linguisticSelectionConfirmed===true);
  }

  function hasCompleteBaseConfiguration(){
    if(typeof state==='undefined')return false;
    sanitizeConfiguration();
    return Boolean(
      state.level&&
      state.ieType&&
      state.grades.length&&
      state.areas.length&&
      hasCompleteLinguisticConfiguration()
    );
  }

  function hasPedagogicalSetupWithoutLanguage(){
    if(typeof state==='undefined')return false;
    sanitizeConfiguration();
    return Boolean(state.level&&state.ieType&&state.grades.length&&state.areas.length);
  }

  const originalChooseOne=window.chooseOne;
  if(typeof originalChooseOne==='function'){
    window.chooseOne=function(key,val,btn){
      if(key==='level'&&state.level&&state.level!==val){
        state.grades=[];
        state.areas=[];
      }
      if(key==='ieType'&&state.ieType&&state.ieType!==val){
        state.grades=[];
      }
      const result=originalChooseOne.apply(this,arguments);
      persistSetupProgress();
      return result;
    };
  }

  const originalNextSetup=window.nextSetup;
  if(typeof originalNextSetup==='function'){
    window.nextSetup=function(n){
      persistSetupProgress();
      return originalNextSetup.apply(this,arguments);
    };
  }

  const originalFinishSetup=window.finishSetup;
  if(typeof originalFinishSetup==='function'){
    window.finishSetup=function(){
      sanitizeConfiguration();
      if(!state.grades.length){
        alert('Selecciona al menos un grado o edad válido para el nivel actual.');
        if(typeof nextSetup==='function')nextSetup(3);
        return;
      }
      if(!state.areas.length){
        alert('Selecciona al menos un área válida para el nivel actual.');
        if(typeof nextSetup==='function')nextSetup(4);
        return;
      }
      return originalFinishSetup.apply(this,arguments);
    };
  }

  // Evita salir del asistente con una configuración semánticamente incompleta.
  // Además de nivel/IE/grados/áreas, el perfil lingüístico debe estar confirmado:
  // monolingüe castellano o EIB con lengua originaria seleccionada explícitamente.
  const originalGo=window.go;
  if(typeof originalGo==='function')window.go=function(id){
    if(id!=='setup'&&!hasCompleteBaseConfiguration()){
      if(typeof showSetup==='function')showSetup();
      else originalGo.call(this,'setup');
      return;
    }
    return originalGo.apply(this,arguments);
  };

  function installSetupAutosave(){
    if(window.__ddSetupAutosaveV42)return;
    window.__ddSetupAutosaveV42=true;

    document.addEventListener('click',function(event){
      const button=event.target&&event.target.closest?event.target.closest('#gradeChoices button, #areaChoices button'):null;
      if(!button)return;
      // Los handlers de grado/área actualizan state antes de que el evento llegue a document.
      persistSetupProgress();
    });

    document.addEventListener('change',function(event){
      const target=event.target;
      if(!target||!['linguisticMode','language','quechuaVar'].includes(target.id))return;
      if(target.id==='linguisticMode'){
        state.linguisticMode=target.value;
        if(target.value==='EIB')state.linguisticSelectionConfirmed=false;
      }
      if(target.id==='language')state.language=target.value;
      if(target.id==='quechuaVar'){
        state.quechuaVar=target.value;
        if(state.linguisticMode==='EIB'){
          state.indigenousLanguage=target.value||NONE;
          state.linguisticSelectionConfirmed=Boolean(target.value&&target.value!==NONE);
        }
      }
      persistSetupProgress();
    });
  }

  /* app.js puede abrir Inicio antes de que esta guardia cargue si existe un estado legado
     con nivel/IE/grados/áreas completos pero perfil lingüístico incompleto. V4/V5: no mostrar
     una configuración como terminada y bloquear recién en el siguiente clic. Se corrige el
     estado visual inmediatamente y se lleva al paso lingüístico sin borrar lo ya registrado. */
  function enforceIncompleteLinguisticSetup(){
    if(!hasPedagogicalSetupWithoutLanguage()||hasCompleteLinguisticConfiguration())return;
    const setup=document.getElementById('setup');
    const isSetupActive=setup?.classList.contains('active');
    if(!isSetupActive&&typeof showSetup==='function')showSetup();
    if(typeof nextSetup==='function')nextSetup(4);
    window.__ddIncompleteLinguisticSetup={at:new Date().toISOString(),reason:'Perfil lingüístico pendiente de confirmación'};
  }

  sanitizeConfiguration();
  if(typeof save==='function')save();
  const init=()=>{installSetupAutosave();enforceIncompleteLinguisticSetup();};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
  setTimeout(enforceIncompleteLinguisticSetup,0);
})();