/* DocenteDigital — guardia final de superficie para Educación Inicial v1
   Mantiene la organización propia de Inicial aunque otros módulos de horario
   o interfaz se carguen después.
*/
(function(){
  if(window.__ddInitialSurfaceGuardV1)return;
  window.__ddInitialSurfaceGuardV1=true;

  function isInitial(){
    return typeof state==='object'&&state?.level==='Inicial';
  }

  function enforce(){
    if(!isInitial())return;

    if(typeof state==='object'){
      state.unitSessionMode='initial-daily';
      try{typeof save==='function'&&save();}catch(_e){}
    }

    const inline=document.getElementById('ddUnitModeInline');
    if(inline){
      inline.innerHTML='Organización diaria<input value="1 actividad de aprendizaje + 1 taller" readonly><small>Modelo específico de Educación Inicial; no se usan 2 o 3 sesiones por día.</small>';
    }

    const mode=document.getElementById('ddSessionMode');
    if(mode){
      const label=mode.closest('label');
      if(label){
        label.innerHTML='Organización diaria<input value="1 actividad de aprendizaje + 1 taller" readonly><small>En Inicial la jornada se organiza con una actividad de aprendizaje de la unidad/proyecto y un taller.</small>';
      }
    }

    const scheduleCard=document.getElementById('ddScheduleCard');
    if(scheduleCard){
      const bad=[...scheduleCard.querySelectorAll('select,option')].some(x=>/2 sesiones por día|3 sesiones por día/i.test(x.textContent||''));
      if(bad&&typeof window.ddInitialDailySurfaceRefresh==='function'){
        window.ddInitialDailySurfaceRefresh();
      }
    }

    const heading=document.querySelector('#session h1');
    if(heading)heading.textContent='Crear actividad o taller';

    const primary=[...document.querySelectorAll('#session button')].find(b=>(b.getAttribute('onclick')||'').includes('generateSession'));
    if(primary)primary.textContent='✨ PREPARAR ACTIVIDAD / TALLER';

    document.querySelectorAll('.mobile-nav [data-screen="session"]').forEach(btn=>{
      const b=btn.querySelector('b');
      btn.innerHTML=(b?b.outerHTML:'<b>📝</b>')+'Actividad/Taller';
    });

    const help=document.querySelector('#session>p.sub');
    if(help)help.textContent='En Inicial, DocenteDigital prepara una actividad de aprendizaje o un taller vinculado con la unidad/proyecto, respetando la organización propia de la jornada.';
  }

  const observer=new MutationObserver(()=>enforce());
  observer.observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('change',e=>{
    if(e.target?.id==='level'||e.target?.closest?.('#step2'))setTimeout(enforce,0);
  },true);

  [0,150,400,900,1800,3500,6000].forEach(ms=>setTimeout(enforce,ms));
  window.ddInitialSurfaceGuardV1={enforce};
})();