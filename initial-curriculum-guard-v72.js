/* DocenteDigital – guardia curricular de Educación Inicial v72
   Corrige la lista base de áreas del ciclo II (3, 4 y 5 años) según el Programa Curricular de Educación Inicial del MINEDU.
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

  const previousAreaOptions=window.areaOptions;
  if(typeof previousAreaOptions==='function'){
    window.areaOptions=function(){
      if(window.state?.level==='Inicial')return [...INITIAL_CYCLE_II_AREAS];
      return previousAreaOptions.apply(this,arguments);
    };
  }

  function normalizeInitialAreaState(){
    if(!window.state||state.level!=='Inicial'||!Array.isArray(state.areas))return false;
    const before=state.areas.slice();
    const next=[];
    for(const area of before){
      if(area==='Arte y Cultura'){
        if(!next.includes('Comunicación'))next.push('Comunicación');
        continue;
      }
      if(INITIAL_CYCLE_II_AREAS.includes(area)&&!next.includes(area))next.push(area);
    }
    if(before.length===next.length&&before.every((value,index)=>value===next[index]))return false;
    state.areas=next;
    try{save();}catch(_e){}
    return true;
  }

  const previousRenderAreas=window.renderAreas;
  if(typeof previousRenderAreas==='function'){
    window.renderAreas=function(){
      normalizeInitialAreaState();
      return previousRenderAreas.apply(this,arguments);
    };
  }

  normalizeInitialAreaState();
})();
