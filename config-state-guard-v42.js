/* DocenteDigital – guardia de coherencia de configuración entre niveles y tipos de IE */
(function(){
  if(window.__ddConfigStateGuardV42)return;
  window.__ddConfigStateGuardV42=true;

  const allowedGrades=()=>typeof gradeOptions==='function'?gradeOptions():[];
  const allowedAreas=()=>typeof areaOptions==='function'?areaOptions():[];

  function sanitizeConfiguration(){
    if(typeof state==='undefined')return;
    const grades=allowedGrades();
    const areas=allowedAreas();
    state.grades=Array.isArray(state.grades)?state.grades.filter(g=>grades.includes(g)):[];
    state.areas=Array.isArray(state.areas)?state.areas.filter(a=>areas.includes(a)):[];
    if(state.ieType==='Polidocente'&&state.grades.length>1)state.grades=[];
    if(state.level==='Secundaria'&&state.areas.length>1)state.areas=[];
  }

  function hasCompleteBaseConfiguration(){
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
      sanitizeConfiguration();
      return result;
    };
  }

  const originalNextSetup=window.nextSetup;
  if(typeof originalNextSetup==='function'){
    window.nextSetup=function(n){
      sanitizeConfiguration();
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
  // app.js solo comprobaba state.level, por lo que elegir el nivel bastaba para
  // poder entrar al Inicio desde la barra lateral antes de definir IE, grados y áreas.
  const originalGo=window.go;
  if(typeof originalGo==='function'){
    window.go=function(id){
      if(id!=='setup'&&!hasCompleteBaseConfiguration()){
        if(typeof showSetup==='function')showSetup();
        else originalGo.call(this,'setup');
        return;
      }
      return originalGo.apply(this,arguments);
    };
  }

  sanitizeConfiguration();
  if(typeof save==='function')save();
})();
