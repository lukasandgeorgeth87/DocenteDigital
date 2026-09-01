/* DocenteDigital – guardia curricular de Educación Inicial v72.6
   Corrige la lista base de áreas del ciclo II (3, 4 y 5 años) según el Programa Curricular de Educación Inicial del MINEDU.
   Además evita que el perfil EIB/monolingüe sea solo visual: lo valida y conserva en el estado activo.
   V5: marca como no disponibles las acciones del Director que todavía no tienen comportamiento real, evitando controles simulados.
   V5: asegura que las guardias críticas de seguridad curricular y coherencia de configuración se carguen realmente en producción después de los módulos base.
   V4/V5: mantiene accesible el espacio Director en navegación móvil cuando la barra lateral de escritorio se oculta.
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
    };
    document.body.appendChild(script);
  }

  function loadCriticalGuards(){
    loadCriticalModule('config-state-guard-v42.js','__ddConfigStateGuardV42');
    loadCriticalModule('curriculum-safety-v27.js','__ddCurriculumSafetyV30');
  }

  function initializeUiGuards(){
    markUnfinishedDirectorActions();
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