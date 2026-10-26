/* DocenteDigital — Director v1
   Documentos de gestión editables y reutilizables.
*/
(function(){
  if(window.__ddDirectorV1)return;
  window.__ddDirectorV1=true;

  const $=id=>document.getElementById(id);
  const E=v=>escapeHtml(v);

  state.directorDocs=Array.isArray(state.directorDocs)?state.directorDocs:[];
  save();

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

  function place(){
    const p=profile();
    return [
      p.community?((p.localityType||'Localidad')+' '+p.community):'',
      p.district?('Distrito '+p.district):'',
      p.province?('Provincia '+p.province):'',
      p.region?('Región '+p.region):''
    ].filter(Boolean).join(' · ');
  }

  function panel(){
    const p=$('directorPanel');if(p)p.classList.remove('hidden');return p;
  }

  function headerHtml(title){
    const p=profile();
    return `<div class="dd-director-letterhead">
      <div><b>${E(p.institutionName||'Institución educativa')}</b><br><span>${E(place())}</span></div>
      <div><b>${E(title)}</b></div>
    </div>`;
  }

  function openDocument(){
    const p=panel();if(!p)return;
    p.innerHTML=`
      <div class="dd-plan-tool-head"><span class="pill">Gestión</span><h2>Crear documento</h2></div>
      <div class="form2">
        <label>Tipo<select id="ddDirType"><option>Oficio</option><option>Informe</option><option>Memorando</option><option>Acta</option><option>Resolución Directoral</option></select></label>
        <label>Fecha<input id="ddDirDate" type="date" value="${new Date().toISOString().slice(0,10)}"></label>
        <label>Destinatario<input id="ddDirRecipient" placeholder="Nombre / cargo / entidad"></label>
        <label>Asunto<input id="ddDirSubject" placeholder="Asunto concreto del documento"></label>
        <label class="full">Antecedente o contexto<textarea id="ddDirContext" placeholder="Describe brevemente qué ocurrió o qué se necesita comunicar."></textarea></label>
        <label class="full">Decisión, solicitud o información principal<textarea id="ddDirMain" placeholder="Escribe la idea principal que debe quedar clara."></textarea></label>
        <label class="full">Base normativa verificada <span class="pill">Opcional</span><textarea id="ddDirLegal" placeholder="Solo incorpora normas verificadas. Si no tienes una base legal confirmada, déjalo vacío."></textarea></label>
      </div>
      <div class="actions"><button data-dd-real-action="true" class="btn" id="ddDirBuild">✨ Construir documento</button><button data-dd-real-action="true" class="btn ghost" id="ddDirClose">Cerrar</button></div>
      <div id="ddDirResult" class="topgap"></div>`;
    $('ddDirBuild').onclick=buildDocument;
    $('ddDirClose').onclick=()=>p.classList.add('hidden');
    p.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function bodyByType(type,data){
    const ctx=data.context||'';
    const main=data.main||'';
    const legal=data.legal||'';
    if(type==='Oficio'){
      return `<p>De mi consideración:</p><p>${E(ctx)}</p><p>${E(main)}</p>${legal?`<p><b>Referencia normativa:</b> ${E(legal)}</p>`:''}<p>Sin otro particular, hago propicia la ocasión para expresarle las muestras de mi consideración.</p>`;
    }
    if(type==='Informe'){
      return `<h3>I. Antecedentes</h3><p>${E(ctx)}</p><h3>II. Análisis / desarrollo</h3><p>${E(main)}</p>${legal?`<h3>III. Base normativa verificada</h3><p>${E(legal)}</p>`:''}<h3>${legal?'IV':'III'}. Conclusiones y/o recomendaciones</h3><p contenteditable="true">Completa aquí las conclusiones y recomendaciones derivadas de la información presentada.</p>`;
    }
    if(type==='Memorando'){
      return `<p><b>Para:</b> ${E(data.recipient)}</p><p><b>Asunto:</b> ${E(data.subject)}</p><p>${E(ctx)}</p><p>${E(main)}</p>${legal?`<p><b>Referencia:</b> ${E(legal)}</p>`:''}`;
    }
    if(type==='Acta'){
      return `<p>En ${E(place()||'la institución educativa')}, siendo la fecha indicada, se reunieron las personas convocadas para tratar el asunto: <b>${E(data.subject)}</b>.</p><h3>1. Contexto</h3><p>${E(ctx)}</p><h3>2. Acuerdos</h3><p>${E(main)}</p><h3>3. Responsables y plazos</h3><p contenteditable="true">Completa responsables, fechas y compromisos verificables.</p>`;
    }
    return `<p><b>VISTO:</b> ${E(ctx)}</p>${legal?`<p><b>CONSIDERANDO:</b> ${E(legal)}</p>`:''}<p><b>SE RESUELVE:</b></p><p>${E(main)}</p><p><b>Regístrese, comuníquese y archívese.</b></p>`;
  }

  function buildDocument(){
    const type=$('ddDirType').value;
    const data={
      recipient:$('ddDirRecipient').value.trim(),
      subject:$('ddDirSubject').value.trim(),
      context:$('ddDirContext').value.trim(),
      main:$('ddDirMain').value.trim(),
      legal:$('ddDirLegal').value.trim(),
      date:$('ddDirDate').value
    };
    const p=profile();
    const title=type.toUpperCase();
    const html=`<article class="dd-director-doc">
      ${headerHtml(title)}
      <p><b>Fecha:</b> ${E(data.date)}</p>
      ${data.recipient?`<p><b>Destinatario:</b> ${E(data.recipient)}</p>`:''}
      <p><b>Asunto:</b> ${E(data.subject||'Por completar')}</p>
      ${bodyByType(type,data)}
      <div class="dd-signature"><p>Atentamente,</p><p><b>${E(p.teacherName||'Director/a')}</b><br>Director/a</p></div>
    </article>`;
    const item={id:'dir'+Date.now(),type,title:data.subject||type,createdAt:new Date().toISOString(),html};
    state.directorDocs.unshift(item);state.directorDocs=state.directorDocs.slice(0,40);state.lastDirectorDoc=item;save();
    renderDocument(item);
  }

  // Summarize ONLY observable, recorded evidence. A proposed date alone,
  // or an unsupported "Realizada" status, is never a verified visit.
  function updateMonitoringSummary(host){
    const editor=host?.querySelector('.dd-editable-material');
    const summary=editor?.querySelector('.dd-monitor-summary');
    if(!summary)return;
    const readRows=selector=>[...editor.querySelectorAll(selector)].map(row=>
      [...row.querySelectorAll('td')].map(cell=>cell.textContent.trim()));
    const visits=readRows('.dd-monitoring-table tbody tr');
    const agreements=readRows('.dd-monitoring-agreements tbody tr');
    const completed=status=>/^(realizad[ao]|completad[ao]|verificad[ao])\b/i.test(status||'');
    const scheduled=visits.filter(cols=>cols[1]&&cols[2]&&cols[3]).length;
    const realized=visits.filter(cols=>completed(cols[5])&&cols[4]).length;
    const unsupported=visits.filter(cols=>completed(cols[5])&&!cols[4]).length;
    const commitments=agreements.filter(cols=>cols[2]&&cols[3]&&cols[4]).length;
    const checked=agreements.filter(cols=>
      cols[1]&&cols[2]&&cols[3]&&cols[4]&&cols[5]&&
      !/^(pendiente|por completar|sin verificar)$/i.test(cols[5])).length;
    summary.innerHTML='<b>Resumen de seguimiento (solo registros verificables)</b>'+
      '<p>Grados/secciones: '+visits.length+
      ' · Programaciones completas: '+scheduled+
      ' · Visitas realizadas con evidencia: '+realized+
      ' · Compromisos con responsable y plazo: '+commitments+
      ' · Acuerdos con verificación registrada: '+checked+'</p>'+
      (unsupported?'<p><b>Atención:</b> '+unsupported+
        ' visita(s) marcada(s) como realizada(s) SIN evidencia registrada. No se contabilizan como verificadas.</p>':'')+
      '<small>No se infieren visitas, logros ni cumplimiento por una fecha o un estado sin sustento.</small>';
  }

  function renderDocument(item){
    const box=$('ddDirResult');if(!box)return;
    box.innerHTML=`<div class="dd-editable-material" contenteditable="true" spellcheck="true">${item.html}</div>
      <div class="actions topgap"><button data-dd-real-action="true" class="btn" id="ddDirSave">💾 Guardar cambios</button><button data-dd-real-action="true" class="btn alt" id="ddDirWord">⬇ Word</button><button data-dd-real-action="true" class="btn alt" id="ddDirPrint">🖨 Imprimir / PDF</button></div>`;
    $('ddDirSave').onclick=saveCurrent;
    $('ddDirWord').onclick=downloadCurrent;
    $('ddDirPrint').onclick=()=>window.print();
    // Reopening a saved monitoring plan must immediately recompute its true
    // follow-up counts from the recorded evidence, not trust a stale summary.
    updateMonitoringSummary(box);
    box.querySelector('.dd-editable-material')?.addEventListener('input',()=>{
      updateMonitoringSummary(box);
      saveCurrent();
    });
  }

  function saveCurrent(){
    const item=state.lastDirectorDoc,ed=$('ddDirResult')?.querySelector('.dd-editable-material');
    if(!item||!ed)return;
    updateMonitoringSummary($('ddDirResult'));
    item.html=ed.innerHTML;item.updatedAt=new Date().toISOString();
    const i=state.directorDocs.findIndex(x=>x.id===item.id);if(i>=0)state.directorDocs[i]=item;save();
  }

  function downloadCurrent(){
    saveCurrent();
    const item=state.lastDirectorDoc;if(!item)return;
    if(window.DDWordExport?.downloadHtml)return window.DDWordExport.downloadHtml(item.type,item.html,false,item.type+'_'+item.title);
    downloadBlob(wordBlob(item.type,item.html),cleanFileName(item.type+'_'+item.title)+'.doc');
  }

  function openPlan(){
    const p=panel();if(!p)return;
    p.innerHTML=`
      <div class="dd-plan-tool-head"><span class="pill">Plan institucional</span><h2>Construir estructura de plan</h2></div>
      <div class="form2">
        <label>Tipo de plan<select id="ddPlanType"><option>Plan de trabajo</option><option>Plan lector</option><option>Plan de gestión del riesgo</option><option>Plan de monitoreo y acompañamiento</option><option>Plan de convivencia</option><option>Otro plan institucional</option></select></label>
        <label>Periodo<input id="ddPlanPeriod" value="${new Date().getFullYear()}"></label>
        <label class="full">Problema, necesidad u objetivo institucional<textarea id="ddPlanNeed" placeholder="Describe qué se busca atender o mejorar."></textarea></label>
        <label class="full">Datos o evidencias disponibles<textarea id="ddPlanEvidence" placeholder="Incluye solo datos reales o verificables de la institución."></textarea></label>
      </div>
      <div class="actions"><button data-dd-real-action="true" class="btn" id="ddPlanBuild">✨ Construir plan</button><button data-dd-real-action="true" class="btn ghost" id="ddPlanClose">Cerrar</button></div>
      <div id="ddPlanResult" class="topgap"></div>`;
    $('ddPlanBuild').onclick=buildPlan;
    $('ddPlanClose').onclick=()=>p.classList.add('hidden');
    p.scrollIntoView({behavior:'smooth',block:'start'});
  }

  // This plan must support actual school follow-up: separate scheduling
  // from verified observations and agreements, by the grades selected by the
  // director. Empty cells mean NOT RECORDED, never an invented visit.
  function monitoringTable(){
    const grades=(Array.isArray(state.grades)?state.grades:[]).filter(Boolean);
    const rows=(grades.length?grades:['Por definir']).map(grade=>
      `<tr data-grade="${E(grade)}"><td>${E(grade)}</td><td contenteditable="true"></td><td contenteditable="true"></td><td contenteditable="true"></td><td contenteditable="true"></td><td contenteditable="true">Pendiente</td></tr>`
    ).join('');
    return `<section class="dd-monitor-summary notice" contenteditable="false" aria-live="polite"><b>Resumen de seguimiento</b><p>Sin registros verificados.</p></section>
      <h2>VIII. Programación de monitoreo por grado / sección</h2>
      <p>Registra observaciones REALES cuando se efectúen; esta tabla no acredita visitas, logros ni desempeños.</p>
      <div class="dd-scroll"><table class="dd-table dd-monitoring-table">
      <thead><tr><th>Grado / sección</th><th>Fecha programada</th><th>Foco de observación</th><th>Responsable</th><th>Evidencia recogida</th><th>Estado</th></tr></thead><tbody>${rows}</tbody></table></div>
      <h2>IX. Retroalimentación y compromisos verificables</h2>
      <p>Redacta hallazgos sustentados, acuerdos consensuados y una fecha de verificación después de cada acompañamiento.</p>
      <div class="dd-scroll"><table class="dd-table dd-monitoring-agreements">
      <thead><tr><th>Grado / fecha</th><th>Hallazgo con evidencia</th><th>Compromiso</th><th>Responsable</th><th>Fecha de revisión</th><th>Verificación / resultado</th></tr></thead>
      <tbody><tr>${Array.from({length:6},()=>'<td contenteditable="true"></td>').join('')}</tr></tbody></table></div>
      <h2>X. Seguimiento de acuerdos</h2>
      <p contenteditable="true">Pendiente de evidencia: registrar si los compromisos se cumplieron y qué ajustes se requieren, con fecha y sustento.</p>
      <h2>XI. Base normativa verificada</h2>
      <p contenteditable="true">Pendiente de verificación: incorporar únicamente las normas vigentes que correspondan a la institución.</p>`;
  }

  function buildPlan(){
    const type=$('ddPlanType').value,period=$('ddPlanPeriod').value.trim(),need=$('ddPlanNeed').value.trim(),evidence=$('ddPlanEvidence').value.trim();
    const isMonitoring=type==='Plan de monitoreo y acompañamiento';
    const monitoring=isMonitoring?monitoringTable():'';
    const html=`<article class="dd-director-doc">
      ${headerHtml(type.toUpperCase())}
      <h1>${E(type)} · ${E(period)}</h1>
      <h2>I. Datos generales</h2>
      <p><b>Institución:</b> ${E(profile().institutionName||'Por completar')}<br><b>Ubicación:</b> ${E(place()||'Por completar')}</p>
      <h2>II. Situación de partida</h2><p>${E(need||'Por completar')}</p>
      <h2>III. Evidencias disponibles</h2><p>${E(evidence||'Por completar con datos verificables')}</p>
      <h2>IV. Objetivo</h2><p contenteditable="true">Formula un objetivo observable y alcanzable relacionado con la necesidad priorizada.</p>
      <h2>V. Metas</h2><p contenteditable="true">Define metas verificables y un indicador sencillo para cada una.</p>
      <h2>VI. Actividades, responsables y cronograma</h2>
      <table class="dd-table"><thead><tr><th>Actividad</th><th>Responsable</th><th>Periodo</th><th>Evidencia</th></tr></thead><tbody><tr><td contenteditable="true">Actividad 1</td><td contenteditable="true"></td><td contenteditable="true"></td><td contenteditable="true"></td></tr><tr><td contenteditable="true">Actividad 2</td><td contenteditable="true"></td><td contenteditable="true"></td><td contenteditable="true"></td></tr></tbody></table>
      <h2>VII. Seguimiento y evaluación</h2><p contenteditable="true">Indica cómo se revisarán avances, evidencias y decisiones de reajuste.</p>
      ${monitoring||'<h2>VIII. Base normativa</h2><p contenteditable="true">Incorpora únicamente normativa vigente y verificada relacionada con este plan.</p>'}
    </article>`;
    const item={id:'dir'+Date.now(),type:'Plan',title:type,createdAt:new Date().toISOString(),html};
    state.directorDocs.unshift(item);state.directorDocs=state.directorDocs.slice(0,40);state.lastDirectorDoc=item;save();
    const box=$('ddPlanResult');box.innerHTML=`<div class="dd-editable-material" contenteditable="true" spellcheck="true">${html}</div><div class="actions topgap"><button data-dd-real-action="true" class="btn" id="ddPlanSave">💾 Guardar</button><button data-dd-real-action="true" class="btn alt" id="ddPlanWord">⬇ Word</button><button data-dd-real-action="true" class="btn alt" id="ddPlanPrint">🖨 Imprimir / PDF</button></div>`;
    // Exporting a plan must persist the exact edited version being downloaded.
    // Otherwise the DOCX contains edits that disappear after a reload.
    function savePlanCurrent(){
      const ed=box.querySelector('.dd-editable-material');
      if(!ed)return;
      updateMonitoringSummary(box);
      item.html=ed.innerHTML;
      item.updatedAt=new Date().toISOString();
      const i=state.directorDocs.findIndex(x=>x.id===item.id);
      if(i>=0)state.directorDocs[i]=item;
      state.lastDirectorDoc=item;
      save();
    }
    $('ddPlanSave').onclick=savePlanCurrent;
    updateMonitoringSummary(box);
    savePlanCurrent();
    box.querySelector('.dd-editable-material')?.addEventListener('input',savePlanCurrent);
    $('ddPlanWord').onclick=()=>{
      savePlanCurrent();
      if(window.DDWordExport?.downloadHtml)return window.DDWordExport.downloadHtml(item.title,item.html,false,item.title);
      downloadBlob(wordBlob(item.title,item.html),cleanFileName(item.title)+'.doc');
    };
    $('ddPlanPrint').onclick=()=>window.print();
  }

  function openHistory(){
    const p=panel();if(!p)return;
    const items=state.directorDocs||[];
    p.classList.remove('hidden');
    p.innerHTML=`<div class="dd-plan-tool-head"><span class="pill">Historial</span><h2>Documentos recientes</h2></div>
      <div class="dd-director-history">${items.length?items.map(x=>`<article><div><span class="pill">${E(x.type)}</span><h3>${E(x.title)}</h3><small>${E(new Date(x.createdAt).toLocaleDateString('es-PE'))}</small></div><button data-dd-real-action="true" class="btn alt" type="button" data-id="${E(x.id)}">Abrir</button></article>`).join(''):'<div class="dd-empty">Aún no has creado documentos de dirección.</div>'}</div>`;
    p.querySelectorAll('[data-id]').forEach(b=>b.onclick=()=>{
      const item=items.find(x=>x.id===b.dataset.id);if(!item)return;
      p.innerHTML=`<div id="ddDirResult"></div>`;state.lastDirectorDoc=item;renderDocument(item);
    });
    p.scrollIntoView({behavior:'smooth',block:'start'});
  }

  const css=document.createElement('style');
  css.textContent=`
    .dd-director-letterhead{display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:2px solid #223f35;margin-bottom:15px}.dd-director-letterhead span{font-size:12px;color:#5c6f66}.dd-director-doc{max-width:850px;margin:auto}.dd-director-doc h1{text-align:center}.dd-signature{margin-top:32px}.dd-director-history{display:grid;gap:9px}.dd-director-history article{display:flex;justify-content:space-between;gap:12px;align-items:center;border:1px solid #dce5df;border-radius:12px;padding:11px}.dd-director-history h3{margin:5px 0}
    @media(max-width:650px){.dd-director-letterhead,.dd-director-history article{flex-direction:column;align-items:flex-start}}
  `;
  document.head.appendChild(css);

  window.DDDirector={openDocument,openPlan,openHistory};
})();