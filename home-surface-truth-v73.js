/* DocenteDigital – V4/V5: verdad funcional en la pantalla de Inicio.
   No presenta Materiales/Evaluación como acciones disponibles mientras sus flujos
   principales estén explícitamente bloqueados por las guardas de prelaunch. */
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
    button.setAttribute('title','Función aún no disponible para lanzamiento');
    button.removeAttribute('onclick');
    const h2=button.querySelector('h2');
    if(h2&&!/Próximamente/i.test(h2.textContent||''))h2.textContent=`${label} · Próximamente`;
    const p=button.querySelector('p');
    if(p)p.textContent='Este flujo todavía está en construcción y no se considera disponible para lanzamiento.';
    return true;
  }

  function clarifyPlanningHomeCard(){
    const home=document.getElementById('home');
    if(!home)return;
    const button=[...home.querySelectorAll('button')].find(b=>(b.getAttribute('onclick')||'').includes("go('plan')"));
    const p=button?.querySelector('p');
    if(p)p.textContent='Unidades, proyectos y horario disponibles. Diagnóstico y programación anual: próximamente.';
  }

  function apply(){
    clarifyPlanningHomeCard();
    markUnavailableHomeAction('materials','Materiales');
    markUnavailableHomeAction('evaluation','Evaluación');
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});
  else apply();
})();
