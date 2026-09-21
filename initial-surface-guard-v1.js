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

  let applying=false;
  function enforce(){
    if(applying||!isInitial())return;
    applying=true;
    try{

    if(typeof state==='object'){
      state.unitSessionMode='initial-daily';
      try{typeof save==='function'&&save();}catch(_e){}
    }

    const inline=document.getElementById('ddUnitModeInline');
    if(inline&&!/1 actividad de aprendizaje \+ 1 taller/i.test(inline.textContent||'')){
      inline.innerHTML='Organización diaria<input value="1 actividad de aprendizaje + 1 taller" readonly><small>Modelo específico de Educación Inicial; no se usan 2 o 3 sesiones por día.</small>';
    }

    const mode=document.getElementById('ddSessionMode');
    if(mode){
      const label=mode.closest('label');
      if(label&&!/1 actividad de aprendizaje \+ 1 taller/i.test(label.textContent||'')){
        label.innerHTML='Organización diaria<input value="1 actividad de aprendizaje + 1 taller" readonly><small>En Inicial la jornada se organiza con una actividad de aprendizaje de la unidad/proyecto y un taller.</small>';
      }
    }

    const scheduleCard=document.getElementById('ddScheduleCard');
    if(scheduleCard){
      const bad=/2 sesiones por día|3 sesiones por día|sesiones\/semana/i.test(scheduleCard.textContent||'');
      if(bad){
        scheduleCard.innerHTML='<h2>🗓️ Organización diaria de Inicial</h2><div class="success"><b>Modelo del nivel:</b> 1 actividad de aprendizaje de la unidad/proyecto + 1 taller por día.</div><p class="sub">La jornada incluye además juego libre, actividades permanentes, alimentación, recreo, cuidado y otros momentos propios de Educación Inicial.</p><div class="notice topgap">Los talleres se ajustan a la edad, intereses, necesidades del grupo y planificación docente; no se organiza la jornada como una sucesión de sesiones de Primaria o Secundaria.</div>';
      }
    }

    const heading=document.querySelector('#session h1');
    if(heading&&heading.textContent!=='Crear actividad o taller')heading.textContent='Crear actividad o taller';

    const primary=[...document.querySelectorAll('#session button')].find(b=>(b.getAttribute('onclick')||'').includes('generateSession'));
    if(primary&&primary.textContent!=='✨ PREPARAR ACTIVIDAD / TALLER')primary.textContent='✨ PREPARAR ACTIVIDAD / TALLER';

    document.querySelectorAll('.mobile-nav [data-screen="session"]').forEach(btn=>{
      if(!/Actividad\/Taller/i.test(btn.textContent||'')){
        const b=btn.querySelector('b');
        btn.innerHTML=(b?b.outerHTML:'<b>📝</b>')+'Actividad/Taller';
      }
    });

    const help=document.querySelector('#session>p.sub');
    if(help&&!/actividad de aprendizaje o un taller/i.test(help.textContent||''))help.textContent='En Inicial, DocenteDigital prepara una actividad de aprendizaje o un taller vinculado con la unidad/proyecto, respetando la organización propia de la jornada.';
    }finally{applying=false;}
  }

  const observer=new MutationObserver(()=>enforce());
  observer.observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('change',e=>{
    if(e.target?.id==='level'||e.target?.closest?.('#step2'))setTimeout(enforce,0);
  },true);

  [0,150,400,900,1800,3500,6000].forEach(ms=>setTimeout(enforce,ms));
  window.ddInitialSurfaceGuardV1={enforce};
})();