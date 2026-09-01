/* DocenteDigital – hotfix de auditoría runtime v24 */
(function(){
  if(window.__ddRuntimeAuditV24)return;window.__ddRuntimeAuditV24=true;
  const required=[
    ['lector de contexto',()=>typeof window.ddAnalyzeContext==='function'],
    ['análisis exhaustivo',()=>typeof window.ddUnderstandPlanningDescription==='function'],
    ['creatividad',()=>typeof window.ddCreativeChoices==='function'],
    ['unidad/proyecto',()=>window.__ddUnitProjectModeV13===true],
    ['estrategias',()=>window.__ddStrategyCombinatorV15===true],
    ['director',()=>window.__ddDirectorCreativityV16===true]
  ];
  function audit(){
    const checks=required.map(([name,test])=>({name,ok:(()=>{try{return !!test()}catch(e){return false}})()}));
    const duration=document.getElementById('unitDuration');
    const weeks=duration?[...duration.options].map(o=>o.textContent.trim()):[];
    checks.push({name:'duración 1–6 semanas',ok:['1 semana','2 semanas','3 semanas','4 semanas','5 semanas','6 semanas'].every(x=>weeks.includes(x))});
    state.runtimeAudit={at:new Date().toISOString(),checks,ok:checks.every(x=>x.ok)};save();
    return state.runtimeAudit;
  }

  /* V5: si falló un módulo estable, no permitir crear/guardar/exportar como si la app siguiera íntegra. */
  const riskyAction=/\b(?:crear|generar|guardar|descargar|exportar|preparar|emitir|aprobar|subir)\b/i;
  function hasModuleFailure(){return Array.isArray(window.ddModuleLoadFailures)&&window.ddModuleLoadFailures.length>0;}
  function explainBlock(){
    const names=(window.ddModuleLoadFailures||[]).join(', ');
    alert(`DocenteDigital detectó una parte necesaria que no cargó${names?`: ${names}`:''}. Recarga la página antes de crear, guardar o descargar para evitar resultados incompletos.`);
  }
  document.addEventListener('click',e=>{
    if(!hasModuleFailure())return;
    const btn=e.target?.closest?.('button,a');
    if(!btn||!riskyAction.test((btn.textContent||'').trim()))return;
    e.preventDefault();e.stopImmediatePropagation();
    explainBlock();
  },true);
  document.addEventListener('submit',e=>{
    if(!hasModuleFailure())return;
    e.preventDefault();e.stopImmediatePropagation();
    explainBlock();
  },true);
  window.ddAuditModuleFailureGate=()=>({
    failures:Array.isArray(window.ddModuleLoadFailures)?window.ddModuleLoadFailures.slice():[],
    blocked:hasModuleFailure()
  });

  /* Corrige una repetición posible en el doble movimiento EIB del motor combinatorio. */
  const baseSessionHtml=window.sessionHtml;
  if(typeof baseSessionHtml==='function')window.sessionHtml=function(session,forWord=false){
    let html=baseSessionHtml.apply(this,arguments);
    const route=session&&session.ddStrategyRoute;
    if(route&&Array.isArray(route.eib)&&route.eib.length===2&&route.eib[0]===route.eib[1]){
      const alternatives=[
        'recuperar primero el saber local mediante voces de estudiantes, familias o yachaq',
        'profundizar preguntando por razones, procedimientos, señales y significados',
        'comparar el saber local con otras fuentes sin jerarquizar automáticamente uno sobre otro',
        'proponer una alternativa, explicación o acción pertinente al contexto',
        'usar la lengua pertinente para pensar, preguntar y explicar antes de traducir o reformular'
      ].filter(x=>x!==route.eib[0]);
      const replacement=alternatives[Math.floor(Math.random()*alternatives.length)];
      const oldText=route.eib.join(' → ');route.eib[1]=replacement;save();
      html=html.replace(oldText,route.eib.join(' → '));
    }
    return html;
  };

  setTimeout(audit,60);
  window.ddRunRuntimeAudit=audit;
})();