/* DocenteDigital – guardia curricular de Educación Inicial v72.2
   Corrige la lista base de áreas del ciclo II (3, 4 y 5 años) según el Programa Curricular de Educación Inicial del MINEDU.
   Además evita que el perfil EIB/monolingüe sea solo visual: lo valida y conserva en el estado activo.
   No activa una matriz curricular completa ni declara curriculumMatrixReady. */
(function(){
  if(window.__ddInitialCurriculumGuardV72)return;
  window.__ddInitialCurriculumGuardV72=true;

  const INITIAL_CYCLE_II_AREAS=[
    'Personal Social',
    'Psicomotriz',
    'Comunicación',
    'Castellano como Segunda Lengua',
    'Matemática',
    'Ciencia y Tecnología'
  ];

  function getState(){
    try{return typeof state!=='undefined'&&state&&typeof state==='object'?state:null;}catch(_e){return null;}
  }

  const previousAreaOptions=window.areaOptions;
  if(typeof previousAreaOptions==='function'){
    window.areaOptions=function(){
      const currentState=getState();
      if(currentState?.level==='Inicial')return [...INITIAL_CYCLE_II_AREAS];
      return previousAreaOptions.apply(this,arguments);
    };
  }

  function normalizeInitialAreaState(){
    const currentState=getState();
    if(!currentState||currentState.level!=='Inicial'||!Array.isArray(currentState.areas))return false;
    const before=currentState.areas.slice();
    const next=[];
    for(const area of before){
      if(area==='Arte y Cultura'){
        if(!next.includes('Comunicación'))next.push('Comunicación');
        continue;
      }
      if(INITIAL_CYCLE_II_AREAS.includes(area)&&!next.includes(area))next.push(area);
    }
    if(before.length===next.length&&before.every((value,index)=>value===next[index]))return false;
    currentState.areas=next;
    try{save();}catch(_e){}
    return true;
  }

  function syncLinguisticControlsFromState(){
    const currentState=getState();
    if(!currentState)return;
    const mode=document.getElementById('linguisticMode');
    const language=document.getElementById('language');
    const variety=document.getElementById('quechuaVar');
    if(mode&&currentState.linguisticMode)mode.value=currentState.linguisticMode;
    if(language&&currentState.language)language.value=currentState.language;
    if(variety&&currentState.quechuaVar&&[...variety.options].some(o=>o.value===currentState.quechuaVar))variety.value=currentState.quechuaVar;
  }

  const previousRenderAreas=window.renderAreas;
  if(typeof previousRenderAreas==='function'){
    window.renderAreas=function(){
      normalizeInitialAreaState();
      const result=previousRenderAreas.apply(this,arguments);
      syncLinguisticControlsFromState();
      return result;
    };
  }

  const previousFinishSetup=window.finishSetup;
  if(typeof previousFinishSetup==='function'){
    window.finishSetup=function(){
      const currentState=getState();
      const mode=document.getElementById('linguisticMode');
      const language=document.getElementById('language');
      const variety=document.getElementById('quechuaVar');
      const selectedMode=(mode?.value||'').trim();
      if(!selectedMode){
        alert('Selecciona si la IE brinda atención EIB o es monolingüe en castellano.');
        return;
      }
      if(selectedMode==='Monolingüe castellano'){
        if(language)language.value='Castellano';
        if(variety)variety.value='Ninguna';
      }
      const selectedLanguage=(language?.value||'Castellano').trim();
      const selectedVariety=(variety?.value||'Ninguna').trim();
      if(selectedMode==='EIB'&&selectedLanguage!=='Castellano'&&(!selectedVariety||selectedVariety==='Ninguna')){
        alert('Confirma la lengua originaria o variedad principal antes de guardar el perfil EIB.');
        return;
      }
      if(currentState)currentState.linguisticMode=selectedMode;
      return previousFinishSetup.apply(this,arguments);
    };
  }

  normalizeInitialAreaState();
  syncLinguisticControlsFromState();
})();