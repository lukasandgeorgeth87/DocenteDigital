/* DocenteDigital – guardia curricular de Educación Inicial v73.4
   Corrige la lista base de áreas del ciclo II (3, 4 y 5 años) según el Programa Curricular de Educación Inicial del MINEDU.
   Además evita que el perfil EIB/monolingüe sea solo visual: lo valida y conserva en el estado activo.
   V5: marca como no disponibles las acciones del Director que todavía no tienen comportamiento real, evitando controles simulados.
   V5: no presenta diagnóstico ni programación anual simulados como funciones terminadas.
   V5: no presenta registro, evaluación de unidad ni conclusiones SIAGIE simuladas como funciones terminadas.
   V5: no presenta el generador de materiales fijo/simulado como función terminada.
   V5: asegura que las guardias críticas de seguridad curricular, coherencia de configuración y exportación DOCX real se carguen realmente en producción después de los módulos base.
   V4/V5: mantiene accesible el espacio Director en navegación móvil cuando la barra lateral de escritorio se oculta.
   V3/V5: no presenta la interpretación léxica/local actual como comprensión semántica IA real.
   V5: un fallo de carga de un módulo crítico debe ser visible para el usuario y no quedar solo en consola.
   Núcleo IA: evita que el producto preliminar introduzca Ccotataqui cuando el usuario no lo proporcionó.
   V2/V3/V5: impide crear una sesión desconectada usando la unidad y actividades de demostración del prototipo.
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

  function markUnfinishedDirectorActions(){
    const section=document.getElementById('director');
    if(!section)return;
    const buttons=[...section.querySelectorAll('button')];
    let marked=0;
    for(const button of buttons){
      const hasRealAction=button.hasAttribute('onclick')||button.hasAttribute('formaction');
      if(hasRealAction)continue;
      button.disabled=true;
      button.setAttribute('aria-disabled','true');
      button.setAttribute('title','Función aún no disponible');
      const label=(button.textContent||'').trim();
      if(label&&!/próximamente/i.test(label))button.textContent=`${label} · Próximamente`;
      marked++;
    }
    if(marked&&!section.querySelector('[data-dd-director-pending]')){
      const note=document.createElement('div');
      note.className='notice';
      note.setAttribute('data-dd-director-pending','true');
      note.textContent='Estas funciones del Director todavía están en construcción y no se consideran listas para lanzamiento.';
      const subtitle=section.querySelector('.sub');
      if(subtitle)subtitle.insertAdjacentElement('afterend',note); else section.prepend(note);
    }
  }

  function markUnfinishedPlanningActions(){
    const plan=document.getElementById('plan');
    if(!plan)return;
    const unfinished=[
      {handler:'generateDiagnostic',label:'Crear diagnóstico'},
      {handler:'demoAnnual',label:'Abrir programación anual'}
    ];
    let marked=0;
    for(const item of unfinished){
      const button=[...plan.querySelectorAll('button')].find(b=>(b.getAttribute('onclick')||'').includes(item.handler));
      if(!button)continue;
      button.disabled=true;
      button.setAttribute('aria-disabled','true');
      button.setAttribute('title','Función aún no disponible');
      button.removeAttribute('onclick');
      button.textContent=`${item.label} · Próximamente`;
      marked++;
    }
    if(marked&&!plan.querySelector('[data-dd-planning-pending]')){
      const note=document.createElement('div');
      note.className='notice topgap';
      note.setAttribute('data-dd-planning-pending','true');
      note.textContent='Evaluación diagnóstica y Programación anual todavía no están implementadas como flujos completos. No se consideran listas para lanzamiento.';
      const grid=plan.querySelector('.grid');
      if(grid)grid.insertAdjacentElement('afterend',note);
    }
  }

  function markUnfinishedEvaluationActions(){
    const section=document.getElementById('evaluation');
    if(!section)return;
    const labels={register:'Registrar evaluación',unit:'Evaluación de unidad/proyecto',siagie:'Conclusiones SIAGIE'};
    let marked=0;
    for(const button of section.querySelectorAll('button')){
      const handler=button.getAttribute('onclick')||'';
      const match=handler.match(/showEvaluation\(['\"](register|unit|siagie)['\"]\)/);
      if(!match)continue;
      const kind=match[1];
      button.disabled=true;
      button.setAttribute('aria-disabled','true');
      button.setAttribute('title','Función aún no disponible');
      button.removeAttribute('onclick');
      button.textContent=`${labels[kind]} · Próximamente`;
      marked++;
    }
    if(marked&&!section.querySelector('[data-dd-evaluation-pending]')){
      const note=document.createElement('div');
      note.className='notice topgap';
      note.setAttribute('data-dd-evaluation-pending','true');
      note.textContent='Registro, evaluación de unidad/proyecto y conclusiones SIAGIE todavía no están implementados como flujos completos. No se consideran listos para lanzamiento.';
      const grid=section.querySelector('.grid');
      if(grid)grid.insertAdjacentElement('afterend',note);
    }
  }

  function markUnfinishedMaterialsActions(){
    const section=document.getElementById('materials');
    if(!section)return;
    const button=[...section.querySelectorAll('button')].find(b=>(b.getAttribute('onclick')||'').includes('generateMaterial'));
    if(!button)return;
    button.disabled=true;
    button.setAttribute('aria-disabled','true');
    button.setAttribute('title','Función aún no disponible');
    button.removeAttribute('onclick');
    button.textContent='✨ Crear material · Próximamente';
    if(!section.querySelector('[data-dd-materials-pending]')){
      const note=document.createElement('div');
      note.className='notice topgap';
      note.setAttribute('data-dd-materials-pending','true');
      note.textContent='La generación contextualizada de materiales todavía no está implementada como flujo completo. No se considera lista para lanzamiento.';
      const card=section.querySelector('.card');
      if(card)card.insertAdjacentElement('beforebegin',note);
    }
  }

  function markPlanningAsPreliminary(){
    const panel=document.getElementById('unitPanel');
    if(!panel)return;
    const situation=document.getElementById('unitSituation');
    const help=situation?.parentElement?.querySelector('small');
    if(help)help.textContent='La propuesta actual usa interpretación local preliminar y debe revisarse. La comprensión semántica con IA real aún no está conectada.';
    const createButton=[...panel.querySelectorAll('button')].find(button=>/createUnitDemo/.test(button.getAttribute('onclick')||''));
    if(createButton)createButton.textContent='✨ Crear propuesta preliminar';
    const ready=document.getElementById('unitReady');
    if(ready)ready.textContent='Propuesta preliminar creada y guardada en “Mis unidades/proyectos”. Revísala antes de utilizarla.';
  }

  function preventHardcodedCcotataquiProduct(){
    const previousCreateUnit=window.createUnitDemo;
    if(typeof previousCreateUnit!=='function'||previousCreateUnit.__ddTerritoryGuard)return;
    const guarded=function(){
      const brief=(document.getElementById('unitSituation')?.value||'').trim();
      const result=previousCreateUnit.apply(this,arguments);
      if(/c+otataqui/i.test(brief))return result;
      const currentState=getState();
      const unit=currentState?.units?.find(u=>u.id===currentState.activeUnitId)||currentState?.units?.[0];
      if(unit&&typeof unit.product==='string'&&/Ccotataqui/i.test(unit.product)){
        unit.product=unit.product.replace(/\s+de\s+Ccotataqui/ig,'').replace(/Ccotataqui/ig,'el contexto descrito');
        try{save();}catch(_e){}
        try{if(typeof renderUnits==='function')renderUnits();}catch(_e){}
        try{if(typeof renderUnitOutput==='function')renderUnitOutput(unit);}catch(_e){}
      }
      return result;
    };
    guarded.__ddTerritoryGuard=true;
    window.createUnitDemo=guarded;
  }

  function guardSessionRequiresRealUnit(){
    if(window.__ddSessionRequiresRealUnitV734)return;
    window.__ddSessionRequiresRealUnitV734=true;

    const originalFillSessionUnits=window.fillSessionUnits;
    if(typeof originalFillSessionUnits==='function'){
      window.fillSessionUnits=function(){
        const currentState=getState();
        const select=document.getElementById('sessionUnit');
        const activity=document.getElementById('activity');
        const title=document.getElementById('sessionTitle');
        const button=[...document.querySelectorAll('#session button')].find(b=>(b.getAttribute('onclick')||'').includes('generateSession'));
        if(!currentState||!Array.isArray(currentState.units)||currentState.units.length===0){
          if(select){select.innerHTML='<option value="">Primero crea o abre una Unidad/Proyecto</option>';select.disabled=true;}
          if(activity){activity.innerHTML='<option value="">Sin actividad programada</option>';activity.disabled=true;}
          if(title)title.value='';
          if(button){button.disabled=true;button.setAttribute('aria-disabled','true');button.setAttribute('title','Primero crea o abre una Unidad/Proyecto');}
          const section=document.getElementById('session');
          if(section&&!section.querySelector('[data-dd-session-unit-required]')){
            const note=document.createElement('div');
            note.className='notice topgap';
            note.setAttribute('data-dd-session-unit-required','true');
            note.textContent='Para crear una sesión primero debes crear o abrir una Unidad/Proyecto real. DocenteDigital no usará ejemplos automáticos como si fueran tu planificación.';
            const card=section.querySelector('.card');
            if(card)card.insertAdjacentElement('beforebegin',note);
          }
          return;
        }
        if(select)select.disabled=false;
        if(activity)activity.disabled=false;
        if(button){button.disabled=false;button.removeAttribute('aria-disabled');button.removeAttribute('title');}
        document.querySelector('[data-dd-session-unit-required]')?.remove();
        return originalFillSessionUnits.apply(this,arguments);
      };
    }

    const originalGenerateSession=window.generateSession;
    if(typeof originalGenerateSession==='function'){
      window.generateSession=function(){
        const currentState=getState();
        const selectedId=document.getElementById('sessionUnit')?.value||'';
        const hasRealUnit=Boolean(currentState&&Array.isArray(currentState.units)&&currentState.units.some(u=>u&&u.id===selectedId));
        if(!hasRealUnit){
          alert('Primero crea o abre una Unidad/Proyecto real antes de preparar la sesión.');
          return;
        }
        return originalGenerateSession.apply(this,arguments);
      };
    }

    try{if(typeof window.fillSessionUnits==='function')window.fillSessionUnits();}catch(_e){}
  }

  function ensureDirectorMobileAccess(){
    const nav=document.querySelector('.mobile-nav');
    if(!nav||nav.querySelector('[data-screen="director"]'))return;
    const button=document.createElement('button');
    button.setAttribute('data-screen','director');
    button.setAttribute('aria-label','Abrir espacio del Director');
    button.innerHTML='<b>🏫</b>Director';
    button.onclick=function(){
      if(typeof go==='function')go('director');
    };
    nav.appendChild(button);
    nav.style.gridTemplateColumns='repeat(6, minmax(0, 1fr))';
  }

  function showCriticalModuleWarning(src){
    if(!document.body)return;
    const id='ddCriticalModuleWarning';
    let box=document.getElementById(id);
    if(!box){
      box=document.createElement('div');
      box.id=id;
      box.setAttribute('role','alert');
      box.style.cssText='position:fixed;left:12px;right:12px;bottom:74px;z-index:100001;padding:12px 14px;border-radius:12px;background:#fff1f1;border:1px solid #d88;box-shadow:0 4px 18px rgba(0,0,0,.16);font:14px/1.35 system-ui,sans-serif;color:#5b1717';
      document.body.appendChild(box);
    }
    const failures=Array.isArray(window.ddModuleLoadFailures)?window.ddModuleLoadFailures:[];
    box.innerHTML='<b>⚠️ Una protección importante de DocenteDigital no pudo cargarse.</b><br>No continúes con documentos importantes ni descargues archivos hasta recargar la página. Si el aviso continúa, la función debe considerarse temporalmente no disponible.';
    box.setAttribute('data-dd-critical-failures',failures.join(','));
    console.error(`DocenteDigital: fallo visible de módulo crítico ${src}.`);
  }

  function loadCriticalModule(src,readyFlag){
    if(window[readyFlag]||document.querySelector(`script[data-dd-critical-module="${src}"]`))return;
    const script=document.createElement('script');
    script.src=src;
    script.defer=true;
    script.setAttribute('data-dd-critical-module',src);
    script.onerror=function(){
      window.ddModuleLoadFailures=Array.isArray(window.ddModuleLoadFailures)?window.ddModuleLoadFailures:[];
      if(!window.ddModuleLoadFailures.includes(src))window.ddModuleLoadFailures.push(src);
      console.error(`DocenteDigital: no se pudo cargar el módulo crítico ${src}.`);
      showCriticalModuleWarning(src);
    };
    document.body.appendChild(script);
  }

  function loadCriticalGuards(){
    loadCriticalModule('config-state-guard-v42.js','__ddConfigStateGuardV42');
    loadCriticalModule('curriculum-safety-v27.js','__ddCurriculumSafetyV30');
    loadCriticalModule('docx-export-v29.js','__ddDocxExportV29');
  }

  function initializeUiGuards(){
    markUnfinishedDirectorActions();
    markUnfinishedPlanningActions();
    markUnfinishedEvaluationActions();
    markUnfinishedMaterialsActions();
    markPlanningAsPreliminary();
    preventHardcodedCcotataquiProduct();
    guardSessionRequiresRealUnit();
    ensureDirectorMobileAccess();
  }

  normalizeInitialAreaState();
  syncLinguisticControlsFromState();
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',initializeUiGuards,{once:true});
    document.addEventListener('DOMContentLoaded',()=>setTimeout(loadCriticalGuards,0),{once:true});
  }else{
    initializeUiGuards();
    setTimeout(loadCriticalGuards,0);
  }
})();