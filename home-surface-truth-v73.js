/* DocenteDigital – V4/V5: verdad funcional en Inicio y navegación.
   No presenta Materiales/Evaluación ni acciones Director no conectadas como disponibles
   mientras sus flujos principales estén explícitamente pendientes de prelaunch.
   V4/V5: evita entradas activas hacia flujos de planificación todavía no implementados.
   V4: mantiene coherente la etiqueta visible de Modo Fácil/Experto con el estado activo. */
(function(){
  if(window.__ddHomeSurfaceTruthV73)return;
  window.__ddHomeSurfaceTruthV73=true;

  function markUnavailableHomeAction(screen,label){
    const home=document.getElementById('home');
    if(!home)return false;
    const button=[...home.querySelectorAll('button')].find(b=>(b.getAttribute('onclick')||'').includes(`go('${screen}')`));
    if(!button)return false;
    button.disabled=true;
    button.setAttribute('aria-disabled','true');
    button.setAttribute('aria-label',`${label}, próximamente`);
    button.setAttribute('title','Función aún no disponible para lanzamiento');
    button.removeAttribute('onclick');
    const h2=button.querySelector('h2');
    if(h2&&!/Próximamente/i.test(h2.textContent||''))h2.textContent=`${label} · Próximamente`;
    const p=button.querySelector('p');
    if(p)p.textContent='Este flujo todavía está en construcción y no se considera disponible para lanzamiento.';
    return true;
  }

  function markUnavailableNavigation(screen,label){
    document.querySelectorAll(`.sidebar [data-screen="${screen}"], .mobile-nav [data-screen="${screen}"]`).forEach(button=>{
      button.disabled=true;
      button.setAttribute('aria-disabled','true');
      button.setAttribute('aria-label',`${label}, próximamente`);
      button.setAttribute('title','Función aún no disponible para lanzamiento');
      button.removeAttribute('onclick');
      if(button.classList.contains('nav')&&!/Próximamente/i.test(button.textContent||'')){
        button.innerHTML=`${screen==='materials'?'🧩':'📊'} ${label} · Próximamente`;
      }
    });
  }

  function markUnavailableDirectorActions(){
    const director=document.getElementById('director');
    if(!director)return;
    director.querySelectorAll('.card button').forEach(button=>{
      if(button.getAttribute('onclick'))return;
      button.disabled=true;
      button.setAttribute('aria-disabled','true');
      button.setAttribute('title','Función aún no disponible para lanzamiento');
      if(!/Próximamente/i.test(button.textContent||''))button.textContent=`${button.textContent.trim()} · Próximamente`;
    });
    const sub=director.querySelector('.sub');
    if(sub)sub.textContent='Las funciones directivas principales siguen en construcción y no se consideran disponibles para lanzamiento.';
  }

  function clarifyPlanningHomeCard(){
    const home=document.getElementById('home');
    if(!home)return;
    const button=[...home.querySelectorAll('button')].find(b=>(b.getAttribute('onclick')||'').includes("go('plan')"));
    const p=button?.querySelector('p');
    if(p)p.textContent='Unidades, proyectos y horario disponibles. Diagnóstico y programación anual: próximamente.';
  }

  function markUnavailablePlanningEntry(handler,label){
    const plan=document.getElementById('plan');
    if(!plan)return false;
    const button=[...plan.querySelectorAll('button')].find(b=>(b.getAttribute('onclick')||'').includes(handler));
    if(!button)return false;
    button.disabled=true;
    button.setAttribute('aria-disabled','true');
    button.setAttribute('aria-label',`${label}, próximamente`);
    button.setAttribute('title','Función aún no disponible para lanzamiento');
    button.removeAttribute('onclick');
    if(!/Próximamente/i.test(button.textContent||''))button.textContent=`${label} · Próximamente`;
    return true;
  }

  function syncModeLabel(){
    const pill=document.querySelector('#home .hero .pill');
    if(!pill)return;
    let mode='easy';
    try{
      if(typeof state!=='undefined'&&state?.mode)mode=state.mode;
      else if(document.body.classList.contains('expert'))mode='expert';
    }catch(_e){
      if(document.body.classList.contains('expert'))mode='expert';
    }
    pill.textContent=mode==='expert'?'🔵 Modo Experto':'✨ Modo Fácil';
  }

  function guardModeLabel(){
    const previousSetMode=window.setMode;
    if(typeof previousSetMode!=='function'||previousSetMode.__ddModeLabelGuard)return;
    const guarded=function(){
      const result=previousSetMode.apply(this,arguments);
      syncModeLabel();
      return result;
    };
    guarded.__ddModeLabelGuard=true;
    window.setMode=guarded;
  }

  function apply(){
    clarifyPlanningHomeCard();
    markUnavailablePlanningEntry('showDiagnostic','Crear diagnóstico');
    markUnavailablePlanningEntry('demoAnnual','Abrir programación anual');
    markUnavailableHomeAction('materials','Materiales');
    markUnavailableHomeAction('evaluation','Evaluación');
    markUnavailableNavigation('materials','Materiales');
    markUnavailableNavigation('evaluation','Evaluación');
    markUnavailableDirectorActions();
    guardModeLabel();
    syncModeLabel();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});
  else apply();
  setTimeout(apply,350);
})();
