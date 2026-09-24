/* DocenteDigital — Herramientas de planificación v1
   Diagnóstico y programación anual. Reutiliza perfil, currículo oficial y unidades guardadas.
*/
(function(){
  if(window.__ddPlanningToolsV1)return;
  window.__ddPlanningToolsV1=true;

  const $=id=>document.getElementById(id);
  const E=v=>escapeHtml(v);
  const CUR=()=>window.DD_OFFICIAL_CURRICULUM;
  const clone=o=>JSON.parse(JSON.stringify(o));

  state.diagnostics=Array.isArray(state.diagnostics)?state.diagnostics:[];
  state.annualPlans=Array.isArray(state.annualPlans)?state.annualPlans:[];
  save();

  function activeUnit(){
    return (state.units||[]).find(u=>u.id===state.activeUnitId)||(state.units||[])[0]||null;
  }

  function profile(){
    return Object.assign({
      teacherName:state.teacherName||'',
      institutionName:state.schoolName||'',
      localityType:'Localidad',
      community:'',
      district:'',
      province:'',
      region:'',
      ugel:''
    },state.teacherContext||{});
  }

  function contextLine(){
    const p=profile();
    return [
      p.institutionName,
      p.community?((p.localityType||'Localidad')+' '+p.community):'',
      p.district?('Distrito '+p.district):'',
      p.province?('Provincia '+p.province):'',
      p.region?('Región '+p.region):''
    ].filter(Boolean).join(' · ');
  }

  function ensurePlanPanel(){
    let panel=$('ddPlanningToolsPanel');
    if(panel)return panel;
    const plan=$('plan');
    panel=document.createElement('div');
    panel.id='ddPlanningToolsPanel';
    panel.className='card hidden topgap';
    const before=$('unitsLibrary');
    if(before)before.insertAdjacentElement('beforebegin',panel);
    else plan?.appendChild(panel);
    return panel;
  }

  function gradeNumber(g){
    const m=String(g||'').match(/\d+/);
    return m?parseInt(m[0]):0;
  }

  function officialCompetences(area){
    try{return CUR()?.getArea?.(state.level,area)||[];}catch{return [];}
  }

  function taskByArea(level,area,grade,competence,index){
    const n=gradeNumber(grade);
    const comp=competence?.name||'Competencia del área';
    const base={title:'Situación '+(index+1),task:'',observe:'',evidence:'',instrument:'Lista de cotejo breve'};

    if(level==='Inicial'){
      base.title='Experiencia de observación '+(index+1);
      if(area==='Comunicación'){
        base.task='Presenta una imagen, cuento breve, objeto o situación cercana. Invita a la niña o niño a observar, conversar, anticipar, contar lo que comprende o representar una idea mediante dibujo, gesto o dramatización.';
        base.observe='Cómo comunica ideas, escucha, recupera información, pregunta, describe o representa según la experiencia.';
        base.evidence='Expresión oral, dibujo, gesto, elección o producción espontánea registrada por la docente.';
      }else if(area==='Matemática'){
        base.task='Ofrece objetos concretos para agrupar, contar, ordenar, comparar cantidades, reconocer posiciones o resolver un pequeño reto de reparto o correspondencia.';
        base.observe='Estrategias espontáneas de conteo, comparación, clasificación, correspondencia y explicación.';
        base.evidence='Acciones con material, explicación oral y representación sencilla.';
      }else if(area==='Ciencia y Tecnología'){
        base.task='Presenta un elemento natural o fenómeno observable y permite explorar con seguridad. Formula preguntas como “¿qué ves?”, “¿qué cambió?”, “¿qué crees que pasará?”.';
        base.observe='Curiosidad, observación, preguntas, comparaciones y explicaciones iniciales.';
        base.evidence='Registro anecdótico, dibujo, comentario o acción observable.';
      }else if(area==='Personal Social'){
        base.task='Propón una situación cotidiana de convivencia, identidad, cuidado o participación y conversa mediante imágenes, juego de roles o experiencias del aula.';
        base.observe='Cómo expresa emociones, reconoce necesidades, participa, respeta acuerdos o propone acciones.';
        base.evidence='Respuesta oral, juego de roles, decisión o acción registrada.';
      }else{
        base.task='Propón una experiencia breve, lúdica y concreta vinculada con '+comp+' para observar cómo participa, expresa, explora o representa.';
        base.observe='Acciones y expresiones relacionadas con la competencia.';
        base.evidence='Registro de observación y producción breve.';
      }
      base.instrument='Registro de observación / lista de cotejo';
      return base;
    }

    if(area==='Matemática'){
      base.task=n<=2
        ? 'Plantea un problema breve con material o dibujo. Pide que represente, resuelva y explique cómo obtuvo la respuesta.'
        : n<=4
          ? 'Presenta un problema contextualizado que exija elegir una estrategia, representar datos, resolver y comprobar.'
          : 'Presenta una situación no rutinaria que exija modelar, justificar el procedimiento, verificar y explicar la razonabilidad del resultado.';
      base.observe='Comprensión del problema, representación, estrategia, procedimiento, verificación y explicación.';
      base.evidence='Resolución escrita/gráfica y explicación del procedimiento.';
    }else if(area==='Comunicación'||/Castellano|Inglés/.test(area)){
      base.task=n<=2
        ? 'Propón una lectura o escucha breve y una pequeña producción oral o escrita. Observa qué información recupera y cómo comunica una idea.'
        : n<=4
          ? 'Presenta un texto breve. Pide localizar información, inferir una idea y producir una respuesta organizada para un propósito concreto.'
          : 'Presenta un texto o situación comunicativa con información suficiente para interpretar, contrastar ideas y producir una respuesta sustentada y revisada.';
      base.observe='Comprensión, inferencia, organización de ideas, adecuación al propósito y revisión.';
      base.evidence='Respuestas al texto y producción oral/escrita.';
    }else if(area==='Ciencia y Tecnología'){
      base.task=n<=2
        ? 'Presenta un fenómeno observable. Pide describir qué ocurre, formular una pregunta y registrar una observación.'
        : n<=4
          ? 'Presenta una situación investigable con datos u observaciones. Pide formular una explicación inicial, organizar evidencias y concluir.'
          : 'Presenta un caso o conjunto de datos. Pide plantear una pregunta, analizar evidencias, explicar relaciones y reconocer qué información falta.';
      base.observe='Problematización, uso de evidencia, explicación, registro y comunicación.';
      base.evidence='Registro de observaciones/datos y conclusión explicada.';
    }else if(['Personal Social','Desarrollo Personal, Ciudadanía y Cívica','Ciencias Sociales'].includes(area)){
      base.task=n<=2
        ? 'Presenta una situación cotidiana o imagen del entorno. Pide explicar qué ocurre y proponer una acción.'
        : n<=4
          ? 'Presenta una situación con actores o información del entorno. Pide identificar puntos de vista, consecuencias y una decisión sustentada.'
          : 'Presenta un caso con dos o más fuentes o perspectivas. Pide analizar, contrastar y sostener una conclusión o propuesta con evidencias.';
      base.observe='Comprensión de la situación, consideración de perspectivas, argumentación y toma de decisiones.';
      base.evidence='Explicación oral/escrita y propuesta sustentada.';
    }else{
      base.task='Propón una actuación breve vinculada con la competencia “'+comp+'” que permita observar qué sabe hacer el estudiante antes de iniciar la nueva planificación.';
      base.observe='Nivel de autonomía, estrategias, precisión y capacidad para explicar decisiones.';
      base.evidence='Actuación o producción breve relacionada con la competencia.';
    }
    return base;
  }

  function buildDiagnosticModel(grade,area){
    const comps=officialCompetences(area);
    const selected=comps.length?comps.slice(0,Math.min(3,comps.length)):[{name:'Competencia priorizada del área',capacities:[]}];
    const tasks=selected.map((comp,i)=>({
      competence:comp.name,
      capacities:comp.capacities||[],
      ...taskByArea(state.level,area,grade,comp,i)
    }));
    return {
      id:'diag'+Date.now(),
      createdAt:new Date().toISOString(),
      level:state.level,
      grade,area,
      profile:clone(profile()),
      tasks
    };
  }

  function openDiagnostic(){
    const panel=ensurePlanPanel();
    const grades=state.grades?.length?state.grades:gradeOptions();
    const areas=state.areas?.length?state.areas:areaOptions();
    panel.classList.remove('hidden');
    panel.innerHTML=`
      <div class="dd-plan-tool-head"><span class="pill">Diagnóstico</span><h2>Evaluación diagnóstica</h2></div>
      <p class="sub">Recoge evidencias iniciales sin convertir el diagnóstico en una calificación. Las situaciones se adaptan a Inicial, Primaria o Secundaria y usan competencias oficiales del área.</p>
      <div class="success">${E(contextLine()||'Completa tu institución y localidad en Configuración para una mejor contextualización.')}</div>
      <div class="form2 topgap">
        <label>Grado / edad<select id="ddDiagGrade">${grades.map(g=>`<option>${E(g)}</option>`).join('')}</select></label>
        <label>Área<select id="ddDiagArea">${areas.map(a=>`<option>${E(a)}</option>`).join('')}</select></label>
      </div>
      <div class="actions"><button class="btn" id="ddDiagCreate">✨ Crear diagnóstico</button><button class="btn ghost" id="ddDiagClose">Cerrar</button></div>
      <div id="ddDiagResult" class="topgap"></div>`;
    $('ddDiagCreate').onclick=createDiagnostic;
    $('ddDiagClose').onclick=()=>panel.classList.add('hidden');
    panel.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function createDiagnostic(){
    const grade=$('ddDiagGrade').value,area=$('ddDiagArea').value;
    const model=buildDiagnosticModel(grade,area);
    state.diagnostics.unshift(model);state.diagnostics=state.diagnostics.slice(0,20);state.lastDiagnostic=model;save();
    renderDiagnostic(model);
  }

  function renderDiagnostic(model){
    const box=$('ddDiagResult');if(!box)return;
    const rows=model.tasks.map((t,i)=>`
      <section class="dd-diagnostic-task">
        <span class="pill">Situación ${i+1}</span>
        <h3>${E(t.competence)}</h3>
        <p><b>Consigna / experiencia:</b> ${E(t.task)}</p>
        <p><b>Qué observar:</b> ${E(t.observe)}</p>
        <p><b>Evidencia:</b> ${E(t.evidence)}</p>
        <p><b>Instrumento:</b> ${E(t.instrument)}</p>
      </section>`).join('');
    box.innerHTML=`<div class="dd-editable-material" contenteditable="true" spellcheck="true">
      <h1>Evaluación diagnóstica · ${E(model.area)}</h1>
      <p><b>Nivel:</b> ${E(model.level)} · <b>Grado/edad:</b> ${E(model.grade)}</p>
      ${rows}
      <h2>Lectura pedagógica posterior</h2>
      <p>Registra fortalezas observadas, necesidades de apoyo, estrategias que ya utiliza el estudiante y decisiones para la siguiente planificación. Evita convertir esta evidencia inicial en una etiqueta permanente.</p>
    </div>
    <div class="actions topgap"><button class="btn" id="ddDiagWord">⬇ Word</button><button class="btn alt" id="ddDiagPrint">🖨 Imprimir / PDF</button></div>`;
    $('ddDiagWord').onclick=downloadDiagnosticWord;
    $('ddDiagPrint').onclick=()=>window.print();
  }

  function downloadDiagnosticWord(){
    const m=state.lastDiagnostic;if(!m)return;
    const body=$('ddDiagResult')?.querySelector('.dd-editable-material')?.innerHTML||'';
    if(window.DDWordExport?.downloadHtml)return window.DDWordExport.downloadHtml('Evaluación diagnóstica',body,false,'Diagnostico_'+m.area+'_'+m.grade);
    downloadBlob(wordBlob('Evaluación diagnóstica',body),cleanFileName('Diagnostico_'+m.area+'_'+m.grade)+'.doc');
  }

  const MONTHS=['Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

  function periods(mode){
    return mode==='Trimestres'
      ? [
          {name:'I trimestre',months:['Marzo','Abril','Mayo']},
          {name:'II trimestre',months:['Junio','Julio','Agosto']},
          {name:'III trimestre',months:['Septiembre','Octubre','Noviembre','Diciembre']}
        ]
      : [
          {name:'I bimestre',months:['Marzo','Abril']},
          {name:'II bimestre',months:['Mayo','Junio']},
          {name:'III bimestre',months:['Julio','Agosto','Septiembre']},
          {name:'IV bimestre',months:['Octubre','Noviembre','Diciembre']}
        ];
  }

  function competencySummary(areas){
    return areas.map(area=>{
      const comps=officialCompetences(area);
      return {area,competences:comps.map(c=>c.name)};
    });
  }

  function buildAnnual(mode){
    const unitList=state.units||[];
    const areas=state.areas||[];
    const ps=periods(mode);
    const cells=ps.map((p,pi)=>{
      const assigned=unitList.filter((u,ui)=>ui%ps.length===pi);
      return {
        ...p,
        units:assigned.map(u=>({id:u.id,title:u.title,type:u.type||'Unidad/Proyecto'}))
      };
    });
    return {
      id:'annual'+Date.now(),
      year:new Date().getFullYear(),
      createdAt:new Date().toISOString(),
      level:state.level,ieType:state.ieType,
      grades:clone(state.grades||[]),areas:clone(areas),
      mode,profile:clone(profile()),
      competencies:competencySummary(areas),
      periods:cells
    };
  }

  function openAnnual(){
    const panel=ensurePlanPanel();
    panel.classList.remove('hidden');
    panel.innerHTML=`
      <div class="dd-plan-tool-head"><span class="pill">Planificación anual</span><h2>Programación anual editable</h2></div>
      <p class="sub">Organiza el año con los datos que ya tiene DocenteDigital. Si ya creaste unidades/proyectos, se incorporan automáticamente como borrador y puedes reorganizarlos.</p>
      <div class="success">${E(contextLine()||'Completa tu institución y localidad en Configuración para una mejor contextualización.')}</div>
      <div class="form2 topgap">
        <label>Organización<select id="ddAnnualMode"><option>Bimestres</option><option>Trimestres</option></select></label>
        <label>Año<input id="ddAnnualYear" type="number" min="2024" max="2035" value="${new Date().getFullYear()}"></label>
      </div>
      <div class="actions"><button class="btn" id="ddAnnualBuild">✨ Construir programación</button><button class="btn ghost" id="ddAnnualClose">Cerrar</button></div>
      <div id="ddAnnualResult" class="topgap"></div>`;
    $('ddAnnualBuild').onclick=createAnnual;
    $('ddAnnualClose').onclick=()=>panel.classList.add('hidden');
    panel.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function createAnnual(){
    const mode=$('ddAnnualMode').value;
    const plan=buildAnnual(mode);
    plan.year=parseInt($('ddAnnualYear').value)||new Date().getFullYear();
    state.annualPlans.unshift(plan);state.annualPlans=state.annualPlans.slice(0,10);state.lastAnnualPlan=plan;save();
    renderAnnual(plan);
  }

  function unitCards(period){
    if(!period.units.length)return '<div class="dd-annual-unit empty">Unidad/proyecto por definir</div>';
    return period.units.map(u=>`<div class="dd-annual-unit"><b>${E(u.title)}</b><span>${E(u.type)}</span></div>`).join('');
  }

  function renderAnnual(plan){
    const box=$('ddAnnualResult');if(!box)return;
    const comp=plan.competencies.map(x=>`
      <section class="dd-annual-competence"><h3>${E(x.area)}</h3><ul>${x.competences.map(c=>`<li>${E(c)}</li>`).join('')}</ul></section>`).join('');
    const rows=plan.periods.map(p=>`
      <tr>
        <td><b>${E(p.name)}</b><br><small>${E(p.months.join(' · '))}</small></td>
        <td contenteditable="true">${unitCards(p)}</td>
        <td contenteditable="true">Situación o contexto a precisar con datos reales del periodo.</td>
        <td contenteditable="true">Evidencias y productos de las unidades/proyectos del periodo.</td>
        <td contenteditable="true">Decisiones de evaluación, retroalimentación y reajuste.</td>
      </tr>`).join('');
    box.innerHTML=`<div class="dd-editable-material" contenteditable="true" spellcheck="true">
      <h1>Programación anual ${E(plan.year)}</h1>
      <p><b>Nivel:</b> ${E(plan.level)} · <b>Tipo de IE:</b> ${E(plan.ieType)} · <b>Grados/edades:</b> ${E(plan.grades.join(', '))}</p>
      <h2>Competencias del año por área</h2>
      <div class="dd-annual-competence-grid">${comp}</div>
      <h2>Organización temporal</h2>
      <div class="dd-scroll"><table class="dd-table"><thead><tr><th>Periodo</th><th>Unidades / proyectos</th><th>Contexto o situación</th><th>Evidencias / productos</th><th>Evaluación y reajuste</th></tr></thead><tbody>${rows}</tbody></table></div>
      <h2>Reajuste durante el año</h2>
      <p>La programación se revisa con evidencias del diagnóstico, avances reales de los estudiantes, calendario de la institución y cambios del contexto. Las unidades/proyectos pueden reorganizarse sin alterar las competencias oficiales.</p>
    </div>
    <div class="actions topgap"><button class="btn" id="ddAnnualWord">⬇ Word</button><button class="btn alt" id="ddAnnualPrint">🖨 Imprimir / PDF</button><button class="btn ghost" id="ddAnnualSaveEdit">💾 Guardar edición</button></div>`;
    $('ddAnnualWord').onclick=downloadAnnualWord;
    $('ddAnnualPrint').onclick=()=>window.print();
    $('ddAnnualSaveEdit').onclick=saveAnnualEdit;
  }

  function saveAnnualEdit(){
    const plan=state.lastAnnualPlan,editable=$('ddAnnualResult')?.querySelector('.dd-editable-material');
    if(!plan||!editable)return;
    plan.editedHtml=editable.innerHTML;plan.updatedAt=new Date().toISOString();
    const idx=state.annualPlans.findIndex(x=>x.id===plan.id);if(idx>=0)state.annualPlans[idx]=plan;save();
    const b=$('ddAnnualSaveEdit');if(b){const old=b.textContent;b.textContent='✓ Guardado';setTimeout(()=>b.textContent=old,1200);}
  }

  function downloadAnnualWord(){
    const plan=state.lastAnnualPlan;if(!plan)return;
    const body=$('ddAnnualResult')?.querySelector('.dd-editable-material')?.innerHTML||plan.editedHtml||'';
    if(window.DDWordExport?.downloadHtml)return window.DDWordExport.downloadHtml('Programación anual '+plan.year,body,true,'Programacion_anual_'+plan.year);
    downloadBlob(wordBlob('Programación anual '+plan.year,body),cleanFileName('Programacion_anual_'+plan.year)+'.doc');
  }

  const css=document.createElement('style');
  css.textContent=`
    .dd-plan-tool-head h2{margin:6px 0 8px}.dd-diagnostic-task{margin:12px 0;padding:12px;border:1px solid #dbe5df;border-radius:12px;background:#fbfdfc}.dd-diagnostic-task h3{margin:7px 0}
    .dd-annual-competence-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.dd-annual-competence{border:1px solid #dbe5df;border-radius:12px;padding:11px;background:#fbfdfc}.dd-annual-competence h3{margin:0 0 6px}.dd-annual-competence ul{margin:0;padding-left:18px}
    .dd-annual-unit{padding:7px 9px;margin:4px 0;border-radius:9px;background:#eef7f2;border:1px solid #d5e8dd}.dd-annual-unit b,.dd-annual-unit span{display:block}.dd-annual-unit span{font-size:11px;color:#617168;margin-top:3px}.dd-annual-unit.empty{background:#fafafa;color:#7b8580;border-style:dashed}
    @media(max-width:700px){.dd-annual-competence-grid{grid-template-columns:1fr}}
  `;
  document.head.appendChild(css);

  window.DDPlanningTools={openDiagnostic,openAnnual,createDiagnostic,createAnnual};
})();