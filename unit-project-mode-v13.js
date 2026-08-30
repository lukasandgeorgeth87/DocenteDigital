/* DocenteDigital – selector estable Unidad/Proyecto sin MutationObserver */
(function(){
  if(window.__ddUnitProjectModeV13)return; window.__ddUnitProjectModeV13=true;
  const E=v=>escapeHtml(v);
  const TYPE_UNIT='Unidad de aprendizaje';
  const TYPE_PROJECT='Proyecto de aprendizaje';
  state.currentPlanningKind=state.currentPlanningKind||'';
  save();

  function isProjectType(type){return String(type||'').toLowerCase().includes('proyecto');}
  function selectedType(){return byId('unitType')?.value||state.currentPlanningKind||'';}

  function projectMeta(unit){
    if(!unit||!isProjectType(unit.type))return null;
    const situation=unit.situation||unit.situationBrief||'la situación significativa seleccionada';
    const product=unit.product||'el producto final acordado';
    const ctx=state.teacherContext||{};
    const recipient=ctx.community?`familias y comunidad de ${ctx.community}`:'familias y comunidad educativa';
    unit.projectDesign=unit.projectDesign||{
      authenticProblem:`El proyecto parte de una situación, necesidad, oportunidad o problema auténtico del contexto que los estudiantes necesitan comprender y atender: ${unit.situationBrief||situation}`,
      studentVoice:'Los estudiantes participan en la planificación: expresan lo que saben, plantean preguntas, proponen qué necesitan averiguar, acuerdan tareas y asumen responsabilidades según sus posibilidades y grado.',
      actionPath:'Investigan, dialogan con fuentes y personas de la comunidad, toman decisiones, producen, prueban o revisan sus propuestas y mejoran el producto a partir de criterios y retroalimentación.',
      product:`Producto/solución con sentido: ${product}`,
      recipient,
      socialization:`El producto se comparte con ${recipient}; los estudiantes explican el proceso seguido, lo aprendido, las decisiones tomadas y evalúan el proyecto.`,
      phases:[
        '1. Identificamos y comprendemos el problema o desafío.',
        '2. Planificamos con participación de los estudiantes: qué sabemos, qué necesitamos saber, qué haremos, cómo nos organizaremos y qué producto construiremos.',
        '3. Investigamos y desarrollamos acciones desde las áreas y saberes del contexto.',
        '4. Construimos, revisamos y mejoramos el producto o solución.',
        '5. Socializamos el producto y evaluamos el proceso y los aprendizajes.'
      ]
    };
    return unit.projectDesign;
  }

  function projectHtml(unit,word=false){
    const p=projectMeta(unit); if(!p)return'';
    const cls=word?'':'dd-project-route';
    return `<section class="${cls}"><h2>RUTA PROPIA DEL PROYECTO DE APRENDIZAJE</h2>
      <p><b>Problema/desafío auténtico:</b> ${E(p.authenticProblem)}</p>
      <p><b>Participación y voz de los estudiantes:</b> ${E(p.studentVoice)}</p>
      <p><b>Investigación, acción y mejora:</b> ${E(p.actionPath)}</p>
      <p><b>Producto o solución:</b> ${E(p.product)}</p>
      <p><b>Destinatarios:</b> ${E(p.recipient)}</p>
      <p><b>Socialización y evaluación:</b> ${E(p.socialization)}</p>
      <h3>Fases del proyecto</h3><ol>${p.phases.map(x=>`<li>${E(x)}</li>`).join('')}</ol>
      <p><small>El proyecto conserva situación significativa, propósitos, criterios, evidencias y secuencia, pero incorpora participación estudiantil, investigación/acción, construcción y mejora de un producto o solución y socialización.</small></p></section>`;
  }

  function syncChooser(){
    const val=selectedType();
    document.querySelectorAll('#ddPlanningKindChooser [data-kind]').forEach(b=>b.classList.toggle('selected',b.dataset.kind===val));
    byId('ddProjectCharacteristics')?.classList.toggle('hidden',!isProjectType(val));
    const panel=byId('unitPanel');if(panel)panel.dataset.planningKind=isProjectType(val)?'project':val?'unit':'';
  }

  function chooseKind(kind){
    const type=byId('unitType');if(!type)return;
    type.value=kind;state.currentPlanningKind=kind;save();syncChooser();
    const title=byId('unitTitle');
    if(title&&!title.value.trim())title.placeholder=isProjectType(kind)?'La app propondrá un título de proyecto orientado al desafío y producto':'La app propondrá un título de unidad a partir del contexto';
  }

  function mountChooser(){
    const panel=byId('unitPanel'),type=byId('unitType');if(!panel||!type)return;
    if(!type.querySelector('option[value=""]')){
      const o=document.createElement('option');o.value='';o.textContent='Elige Unidad o Proyecto';o.hidden=true;type.prepend(o);
    }
    type.closest('label')?.classList.add('dd-original-type');
    let chooser=byId('ddPlanningKindChooser');
    if(!chooser){
      chooser=document.createElement('div');chooser.id='ddPlanningKindChooser';chooser.className='dd-kind-wrap';
      chooser.innerHTML=`<div class="dd-kind-head"><span class="pill">PASO 1</span><h2>¿Qué deseas crear?</h2><p>Elige primero. <b>Unidad y Proyecto tienen rutas diferentes</b>.</p></div>
        <div class="dd-kind-grid">
          <button type="button" class="dd-kind-card" data-kind="${TYPE_UNIT}"><span class="dd-kind-icon">📘</span><h3>Unidad de aprendizaje</h3><p>Organiza una experiencia alrededor de una situación significativa y un reto, articulando propósitos, criterios, evidencias y actividades.</p><b>Elegir Unidad →</b></button>
          <button type="button" class="dd-kind-card" data-kind="${TYPE_PROJECT}"><span class="dd-kind-icon">🧩</span><h3>Proyecto de aprendizaje</h3><p>Parte de un problema, necesidad u oportunidad auténtica y da mayor protagonismo a los estudiantes en la planificación, investigación, decisiones, producto y socialización.</p><b>Elegir Proyecto →</b></button>
        </div>
        <div id="ddProjectCharacteristics" class="dd-project-characteristics hidden"><b>🧩 Control específico del Proyecto:</b><div class="dd-project-checks"><span>✓ problema/desafío auténtico</span><span>✓ participación estudiantil</span><span>✓ planificación compartida</span><span>✓ investigación/acción</span><span>✓ producto o solución</span><span>✓ revisión y mejora</span><span>✓ destinatario real</span><span>✓ socialización y evaluación</span></div></div>`;
      const context=byId('unitContext');if(context)context.insertAdjacentElement('afterend',chooser);else panel.prepend(chooser);
      chooser.querySelectorAll('[data-kind]').forEach(b=>b.onclick=()=>chooseKind(b.dataset.kind));
    }
    syncChooser();
  }

  function resetKindForNewPlanning(){
    const type=byId('unitType');if(!type)return;
    state.currentPlanningKind='';type.value='';save();syncChooser();
  }

  function enrichProposalFlow(){
    const pending=state.pendingUnitChoice,host=byId('ddProposalChooser');if(!pending||!host||!isProjectType(pending.type))return;
    const intro=host.querySelector('.dd-choice-intro');
    if(intro&&!intro.querySelector('.dd-project-flow-note')){
      const n=document.createElement('div');n.className='dd-project-flow-note';n.innerHTML='<b>🧩 Estás construyendo un PROYECTO:</b> además del reto y producto, se tendrá en cuenta participación de los estudiantes, planificación compartida, investigación/acción, revisión y socialización.';intro.appendChild(n);
    }
  }

  function enrichAudit(){
    const toast=byId('ddAuditToast');if(!toast?.classList.contains('show')||!isProjectType(selectedType())||toast.querySelector('.dd-project-audit'))return;
    const n=document.createElement('div');n.className='dd-project-audit';n.innerHTML='<b>🧩 Control específico de Proyecto:</b> problema auténtico · participación estudiantil · planificación compartida · producto/solución · revisión/mejora · socialización/evaluación.';toast.appendChild(n);
  }

  const baseShowUnit=window.showUnit;
  if(typeof baseShowUnit==='function')window.showUnit=function(){
    const r=baseShowUnit.apply(this,arguments);
    setTimeout(()=>{mountChooser();resetKindForNewPlanning();byId('ddPlanningKindChooser')?.scrollIntoView({behavior:'smooth',block:'center'});},0);
    return r;
  };

  document.addEventListener('click',e=>{
    const b=e.target.closest?.('button');if(!b)return;
    const on=b.getAttribute('onclick')||'';
    if(b.closest('#unitPanel')&&/createUnitDemo/.test(on)&&!selectedType()){
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
      alert('Primero elige si crearás una Unidad de aprendizaje o un Proyecto de aprendizaje.');
      byId('ddPlanningKindChooser')?.scrollIntoView({behavior:'smooth',block:'center'});return;
    }
    if(b.id==='ddContinueProducts'||/createUnitDemo/.test(on)||b.id==='ddBuildUnit')setTimeout(()=>{enrichProposalFlow();enrichAudit();},20);
  },true);

  const baseRender=window.renderUnitOutput;
  if(typeof baseRender==='function')window.renderUnitOutput=function(unit){
    if(unit&&isProjectType(unit.type)){projectMeta(unit);save();}
    const r=baseRender.apply(this,arguments);const out=byId('unitOutput');
    if(out){
      out.querySelectorAll('.dd-project-route,.dd-kind-result').forEach(x=>x.remove());
      const tag=document.createElement('div');tag.className='dd-kind-result';tag.innerHTML=isProjectType(unit?.type)?'<b>🧩 PROYECTO DE APRENDIZAJE</b> · motor de proyecto activo':'<b>📘 UNIDAD DE APRENDIZAJE</b> · motor de unidad activo';out.prepend(tag);
      if(isProjectType(unit?.type)){const p=document.createElement('div');p.innerHTML=projectHtml(unit);const section=p.firstElementChild;if(section)out.insertBefore(section,tag.nextSibling);}
    }
    return r;
  };

  const baseWord=window.unitWordHtml;
  if(typeof baseWord==='function')window.unitWordHtml=function(unit){
    let html=baseWord.apply(this,arguments);if(!isProjectType(unit?.type))return html;projectMeta(unit);save();const block=projectHtml(unit,true);const idx=html.lastIndexOf('</body>');return idx>=0?html.slice(0,idx)+block+html.slice(idx):html+block;
  };

  mountChooser();

  const css=document.createElement('style');css.textContent=`
    .dd-original-type{display:none!important}.dd-kind-wrap{margin:14px 0;padding:14px;border:1px solid #d7e4dd;border-radius:16px;background:linear-gradient(135deg,#f8fcfa,#f7f9ff)}.dd-kind-head h2{margin:6px 0}.dd-kind-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px}.dd-kind-card{border:2px solid #dbe7ef;background:#fff;border-radius:16px;padding:16px;text-align:left;color:#29495f}.dd-kind-card.selected{border-color:#0f766e;background:#edf9f5}.dd-kind-icon{font-size:32px}.dd-kind-card h3{margin:7px 0}.dd-project-characteristics{margin-top:11px;padding:11px;border-radius:12px;background:#fff5df;border:1px solid #efd69c}.dd-project-checks{display:flex;gap:6px;flex-wrap:wrap;margin-top:7px}.dd-project-checks span{background:#fff;border:1px solid #ecd9ad;border-radius:999px;padding:5px 8px;font-size:12px}.dd-kind-result{margin:0 0 10px;padding:9px 11px;border-radius:11px;background:#edf7f3;border:1px solid #cfe4da}.dd-project-route{margin:10px 0 14px;padding:14px;border:1.5px dashed #b58a2d;border-radius:14px;background:#fffaf0}.dd-project-flow-note,.dd-project-audit{margin-top:9px;padding:9px 10px;border-radius:10px;background:#fff6df;border:1px solid #edd8a5;font-size:13px}@media(max-width:680px){.dd-kind-grid{grid-template-columns:1fr}}`;
  document.head.appendChild(css);
})();