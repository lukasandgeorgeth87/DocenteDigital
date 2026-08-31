/* DocenteDigital – áreas curriculares de Educación Inicial v43
   Corrige la lista del II ciclo según el Programa Curricular MINEDU.
   - Arte y Cultura no se presenta como área independiente en Inicial.
   - Castellano como segunda lengua aparece solo para IE EIB con 5 años.
*/
(function(){
  if(window.__ddInitialCurriculumAreasV43)return;window.__ddInitialCurriculumAreasV43=true;
  if(typeof state!=='object')return;

  const CORE=['Comunicación','Matemática','Personal Social','Ciencia y Tecnología','Psicomotriz'];
  const CSL='Castellano como segunda lengua';
  const INVALID='Arte y Cultura';
  const originalAreaOptions=window.areaOptions;

  const eligibleForCSL=()=>state.level==='Inicial'&&state.linguisticMode==='EIB'&&Array.isArray(state.grades)&&state.grades.includes('5 años');

  function sanitizeState(){
    if(state.level!=='Inicial'||!Array.isArray(state.areas))return false;
    const before=JSON.stringify(state.areas);
    state.areas=state.areas.filter(a=>a!==INVALID&&(a!==CSL||eligibleForCSL()));
    const changed=before!==JSON.stringify(state.areas);
    if(changed&&typeof save==='function')save();
    return changed;
  }

  if(typeof originalAreaOptions==='function'){
    window.areaOptions=function(){
      if(state.level==='Inicial')return eligibleForCSL()?[...CORE,CSL]:CORE.slice();
      return originalAreaOptions.apply(this,arguments);
    };
  }

  const previousRenderAreas=window.renderAreas;
  if(typeof previousRenderAreas==='function'){
    window.renderAreas=function(){
      sanitizeState();
      return previousRenderAreas.apply(this,arguments);
    };
  }

  document.addEventListener('change',e=>{
    if(e.target&&e.target.id==='linguisticMode'){
      setTimeout(()=>{
        sanitizeState();
        if(state.level==='Inicial'&&typeof window.renderAreas==='function')window.renderAreas();
      },0);
    }
  },true);

  sanitizeState();
})();
