/* DocenteDigital – solicitud de horario Word en configuración inicial */
(function(){
  const step4=document.getElementById('step4');if(!step4||document.getElementById('ddInitialSchedulePrompt'))return;
  const box=document.createElement('div');box.id='ddInitialSchedulePrompt';box.className='card inner dd-schedule-prompt';box.innerHTML=`<h3>🗓️ Horario docente</h3><p><b>¿Deseas subir tu horario docente en Word?</b></p><p class="sub">Es opcional, pero recomendado. DocenteDigital lo analizará y lo guardará para organizar automáticamente las sesiones por día, bloque y área. No tendrás que volver a subirlo mientras tu horario no cambie.</p><div class="actions"><button type="button" class="btn alt" id="ddUploadScheduleNow">📄 Subir horario en Word</button><button type="button" class="btn ghost" id="ddScheduleLater">Lo haré después</button></div><small>Formato recomendado: archivo .docx con una tabla que contenga los días de la semana y las áreas por bloque.</small>`;
  const eib=step4.querySelector('.card.inner');if(eib&&eib.nextSibling)step4.insertBefore(box,eib.nextSibling);else step4.appendChild(box);
  document.getElementById('ddUploadScheduleNow').onclick=()=>{if(!state.areas||!state.areas.length){alert('Primero selecciona las áreas de trabajo.');return;}const language=document.getElementById('language'),q=document.getElementById('quechuaVar');if(language)state.language=language.value;if(q)state.quechuaVar=q.value;save();finishSetup();setTimeout(()=>{go('plan');setTimeout(()=>{const input=document.getElementById('ddScheduleFile'),card=document.getElementById('ddScheduleCard');if(card)card.scrollIntoView({behavior:'smooth',block:'start'});if(input)input.click();else alert('Abre “Horario de clases” y selecciona “Subir horario en Word”.');},120);},80);};
  document.getElementById('ddScheduleLater').onclick=()=>{box.classList.add('dd-schedule-later');const p=box.querySelector('p.sub');if(p)p.textContent='Puedes subirlo después desde Mi planificación → Horario de clases. Mientras tanto, podrás elegir 2 o 3 sesiones por día.';};
  const style=document.createElement('style');style.textContent=`.dd-schedule-prompt{margin-top:12px;border:1px solid #cad9d1;background:linear-gradient(135deg,#f8fcfa,#eef7f2)}.dd-schedule-prompt h3{margin-top:0}.dd-schedule-prompt .actions{display:flex;gap:8px;flex-wrap:wrap}.dd-schedule-later{opacity:.9}`;document.head.appendChild(style);
})();

/* Carga estable de módulos DocenteDigital.
   Regla central: comprender primero → conservar intención/finalidad → recién generar.
*/
(function(){
  if(window.__ddStableModuleLoaderV49)return;window.__ddStableModuleLoaderV49=true;
  const modules=[
    'config-state-guard-v42.js',
    'linguistic-profile-v26.js',
    'initial-curriculum-areas-v43.js',
    'linguistic-confirmation-v37.js',
    'institution-master-v46.js',
    'context-semantic-v20.js',
    'creativity-engine-v14.js',
    'intent-engine-v21.js',
    'meaning-engine-v25.js',
    'context-keywords-v19.js',
    'title-context-v38.js',
    'goal-alignment-v28.js',
    'intelligence-core-v44.js',
    'semantic-goal-ui-v45.js',
    'expert-reasoning-v32.js',
    'proposal-choice-v8.js',
    'simple-planning-ui-v48.js',
    'stable-core-v12.js',
    'territorial-context-v28.js',
    'unit-project-mode-v13.js',
    'project-territorial-v31.js',
    'creative-runtime-v18.js',
    'strategy-combinator-v15.js',
    'director-creativity-v16.js',
    'director-prototype-guard-v40.js',
    'prototype-data-guard-v41.js',
    'planning-consistency-v34.js',
    'usage-reality-v35.js',
    'reasoning-audit-v33.js',
    'runtime-audit-v23.js',
    'curriculum-safety-v27.js',
    'export-fallback-guard-v39.js',
    'docx-export-v29.js',
    'executable-audit-v47.js',
    'prelaunch-evidence-gate-v50.js',
    'simplicity-audit-v49.js',
    'planning-coherence-v51.js',
    'visible-analysis-guard-v52.js',
    'significant-situation-core-v53.js',
    'session-learning-core-v54.js',
    'easy-surface-simplicity-v55.js',
    'planning-archive-simplicity-v56.js'
  ];
  let index=0;
  function next(){
    if(index>=modules.length)return;
    const src=modules[index++];
    if(document.querySelector(`script[data-dd-module="${src}"]`)){next();return;}
    const load=attempt=>{
      const s=document.createElement('script');s.src=src;s.async=false;s.setAttribute('data-dd-module',src);
      s.onload=next;
      s.onerror=()=>{
        console.warn(`DocenteDigital: no se pudo cargar ${src}${attempt===0?'; reintentando una vez.':'; se continúa con el siguiente módulo.'}`);
        s.remove();
        if(attempt===0)setTimeout(()=>load(1),350);else next();
      };
      document.body.appendChild(s);
    };
    load(0);
  }
  next();
})();