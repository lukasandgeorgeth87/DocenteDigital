/* Programación anual conectada con las unidades. Amplía el módulo existente sin
   borrar planes anteriores ni atribuir desempeños oficiales no cotejados. */
(function(root){
  'use strict';
  if(root.DDAnnualPlanning)return;
  const MONTHS=['Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const THEMES={
    Inicial:[
      'Nos conocemos y jugamos juntos','Descubrimos cómo cuidar nuestro cuerpo',
      'Mi familia y las personas que me cuidan','Jugamos y exploramos con el agua',
      'Conocemos las costumbres de nuestro entorno','Pequeños exploradores de plantas y semillas',
      'Ordenamos, contamos y comparamos jugando','Escuchamos relatos de nuestras tradiciones',
      'Aprendemos a expresar lo que sentimos','Mostramos lo que descubrimos este año'
    ],
    Primaria:[
      'Construimos acuerdos para convivir','Cuidamos nuestra salud y bienestar',
      'Conocemos a nuestras familias y comunidad','Investigamos el agua que usamos',
      'Reconocemos la diversidad cultural del Perú','Exploramos plantas y cultivos de nuestro entorno',
      'Medimos y organizamos una feria escolar','Investigamos nuestras tradiciones con respeto',
      'Conocemos y defendemos los derechos de la niñez','Compartimos los aprendizajes del año'
    ],
    Secundaria:[
      'Analizamos acuerdos y desafíos de convivencia','Investigamos hábitos y decisiones de salud',
      'Estudiamos cambios en nuestra comunidad','Analizamos el uso sostenible del agua',
      'Dialogamos sobre identidad y diversidad cultural','Investigamos ecosistemas de nuestro entorno',
      'Modelamos situaciones de emprendimiento responsable','Contrastamos fuentes sobre nuestro patrimonio',
      'Argumentamos sobre derechos y participación','Presentamos proyectos y evaluamos aprendizajes'
    ]
  };
  const $=id=>document.getElementById(id);
  const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const currentYear=()=>{const date=new Date();return date.getFullYear()+(date.getMonth()>=10?1:0);};
  const plans=()=>Array.isArray(state.annualPlans)?state.annualPlans:(state.annualPlans=[]);
  const nextId=()=> 'annual'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
  function titleFor(month,level){return (THEMES[level]||THEMES.Primaria)[MONTHS.indexOf(month)]||'Experiencia por planificar';}
  function curricularHtml(plan){
    const curriculum=root.DD_OFFICIAL_CURRICULUM;
    if(!curriculum?.verified||typeof curriculum.getArea!=='function')
      return '<p>La selección de competencias oficiales está pendiente de verificación. No se han creado nombres curriculares nuevos.</p>';
    const rows=(plan.areas||[]).map(area=>({area,names:(curriculum.getArea(plan.level,area)||[]).map(c=>c.name).filter(Boolean)})).filter(x=>x.names.length);
    if(!rows.length)return '<p>Falta elegir áreas con competencias curriculares verificadas.</p>';
    return '<table data-col-weights="1,4"><thead><tr><th>Área</th><th>Competencias consideradas</th></tr></thead><tbody>'+
      rows.map(x=>'<tr><td>'+E(x.area)+'</td><td>'+E(x.names.join('; '))+'</td></tr>').join('')+'</tbody></table>';
  }
  function monthRows(level){return MONTHS.map(name=>{
    const suggested=root.DDPedagogicalInputs?.recommendedTitle?.(name,level)||'';
    return {name,title:suggested||titleFor(name,level),titleOrigin:suggested?'insumo':'sugerencia',context:'',linkedUnitId:'',type:'Unidad de aprendizaje'};
  });}
  function unitForMonth(row){
    return row.linkedUnitId?(state.units||[]).find(unit=>unit.id===row.linkedUnitId)||null:null;
  }
  function concise(value,max=165){
    const text=String(value||'').replace(/\s+/g,' ').trim();
    if(text.length<=max)return text;
    const cut=text.slice(0,max+1).lastIndexOf(' ');
    return text.slice(0,cut>80?cut:max).replace(/[\s,;:]+$/,'')+'…';
  }
  // El docente decide los títulos. Los productos son propuestas orientadoras
  // basadas en ese título, no observaciones inventadas ni desempeños oficiales.
  function suggestedProduct(title,level){
    const text=String(title||'').toLocaleLowerCase('es-PE');
    if(level==='Inicial'){
      if(/semill|plant|huerto|chacra|cultiv|agua|explor/.test(text))return 'Dibujos de observación y conversación sobre lo descubierto';
      if(/relat|cuent|cultur|costumb|tradici/.test(text))return 'Relato oral, dramatización o representación gráfica';
      return 'Producciones mediante juego, dibujos y expresión oral';
    }
    if(/conviv|dialog|acuerd|escuch/.test(text))return 'Acuerdos y registro de un diálogo respetuoso';
    if(/salud|cuerp|bienestar|higiene/.test(text))return 'Registro de prácticas y recomendaciones de autocuidado';
    if(/familia|comunidad|historia familiar/.test(text))return 'Álbum de relatos y testimonios voluntarios';
    if(/agua|yaku/.test(text))return 'Registro de observaciones y propuesta de cuidado del agua';
    if(/tradici|costumb|cultur|patrimonio|pachamama|difuntos|santos/.test(text))return 'Galería explicativa con fuentes y respeto a la diversidad';
    if(/semill|plant|huerto|chacra|cultiv/.test(text))return 'Cuaderno de observación y explicación de cambios';
    if(/feria|medim|presupuesto|organizamos/.test(text))return 'Tablas, planificación y muestra de producciones';
    if(/derech|niñez|participaci/.test(text))return 'Mural o campaña con mensajes fundamentados';
    if(/aprendizajes|año escolar/.test(text))return 'Portafolio comentado de evidencias del año';
    return 'Producción y evidencia por concretar durante la unidad';
  }
  function productFor(row,plan){
    const linked=unitForMonth(row);
    return String(linked?.productTitle||linked?.product||suggestedProduct(row.title,plan.level)).trim();
  }
  function contextualBasis(row){
    if(String(row.context||'').trim())return {text:concise(row.context,205),origin:'Contexto indicado por el docente'};
    const unit=unitForMonth(row),fromUnit=String(unit?.situationBrief||unit?.situation||'').trim();
    if(fromUnit)return {text:concise(fromUnit,205),origin:'Contexto de la unidad vinculada'};
    const events=root.DDPedagogicalInputs?.monthEvents?.(row.name)||[];
    if(events.length)return {text:concise(events.slice(0,2).map(e=>e.text).join('; '),205),origin:'Calendario aportado por el docente'};
    return {text:'Por caracterizar con información real del grupo y la comunidad',origin:'Pendiente de contextualizar'};
  }
  function normalize(plan){
    if(!Array.isArray(plan.months))plan.months=monthRows(plan.level);
    for(const name of MONTHS){
      if(!plan.months.some(m=>m.name===name))plan.months.push({name,title:titleFor(name,plan.level),context:'',linkedUnitId:'',type:'Unidad de aprendizaje'});
    }
    plan.months.sort((a,b)=>MONTHS.indexOf(a.name)-MONTHS.indexOf(b.name));
    return plan;
  }
  function syncWithUnits(){
    for(const plan of plans()){
      if(!Array.isArray(plan.months))continue;
      for(const row of plan.months){
        if(!row.linkedUnitId)continue;
        const unit=(state.units||[]).find(x=>x.id===row.linkedUnitId);
        if(unit){row.title=unit.title;row.type=unit.type||row.type;row.linked=true;}
      }
    }
  }
  function selectedPlan(){
    const id=$('ddAnnualPlanSelect')?.value;
    return plans().find(p=>p.id===id)||plans().find(p=>p.id===state.lastAnnualPlan?.id)||plans()[0]||null;
  }
  function makePlan(){
    const year=Number($('ddAnnualNewYear')?.value)||currentYear(),level=state.level||'Primaria';
    const existing=plans().find(x=>x.year===year&&x.level===level&&JSON.stringify(x.grades||[])===JSON.stringify(state.grades||[]));
    if(existing)return normalize(existing);
    const plan={id:nextId(),year,level,grades:[...(state.grades||[])],areas:[...(state.areas||[])],
      ieType:state.ieType,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),
      months:monthRows(level)};
    plans().unshift(plan);
    return plan;
  }
  function saveFields(){
    const plan=selectedPlan(),host=$('ddAnnualMonths');if(!plan||!host)return;
    normalize(plan);
    host.querySelectorAll('tr[data-month]').forEach(tr=>{
      const row=plan.months.find(m=>m.name===tr.dataset.month);if(!row)return;
      const title=tr.querySelector('[data-field="title"]')?.value.trim();
      const context=tr.querySelector('[data-field="context"]')?.value.trim();
      if(title&&!row.linkedUnitId&&title!==row.title){row.title=title;row.titleOrigin='docente';}
      if(context!=null)row.context=context;
    });
    plan.updatedAt=new Date().toISOString();state.lastAnnualPlan=plan;
    syncWithUnits();save();
  }
  function refreshSuggestions(){
    saveFields();const plan=selectedPlan();if(!plan)return;
    let count=0;
    for(const row of plan.months){
      if(row.linkedUnitId||!['sugerencia','insumo'].includes(row.titleOrigin))continue;
      const updated=root.DDPedagogicalInputs?.recommendedTitle?.(row.name,plan.level);
      if(!updated||updated===row.title)continue;
      row.title=updated;row.titleOrigin='insumo';count++;
    }
    save();render(plan);
    const note=$('ddAnnualSuggestStatus');
    if(note)note.textContent=count
      ?'✓ Se actualizaron '+count+' propuestas a partir de tus insumos. Se conservaron los títulos escritos por ti.'
      :'No hay nuevas propuestas por actualizar. Los títulos escritos por ti se han conservado.';
  }
  function render(plan){
    const host=$('ddAnnualEditor');if(!host||!plan)return;
    normalize(plan);state.lastAnnualPlan=plan;syncWithUnits();
    const rows=plan.months.map(m=>{
      const linked=m.linkedUnitId&&(state.units||[]).some(u=>u.id===m.linkedUnitId);
      return `<tr data-month="${E(m.name)}"><td><b>${E(m.name)}</b></td>
        <td><input data-field="title" aria-label="Título sugerido ${E(m.name)}" value="${E(m.title)}" ${linked?'readonly':''}>
          ${m.titleOrigin==='insumo'?'<small>Propuesta a partir del calendario registrado</small>':''}
          <small data-annual-product="${E(m.name)}">Producto sugerido: ${E(productFor(m,plan))}</small>
          <details><summary>Opcional: añadir un contexto específico</summary>
            <textarea data-field="context" aria-label="Contexto ${E(m.name)}" rows="2" placeholder="Solo si deseas indicar un hecho real o necesidad particular de tu grupo">${E(m.context||'')}</textarea>
          </details></td>
        <td><span class="pill">${linked?'Vinculada':'Sugerida'}</span><button class="btn alt" type="button" data-annual-create="${E(m.name)}">${linked?'Abrir unidad':'Crear unidad'}</button></td></tr>`;
    }).join('');
    host.innerHTML=`<div class="success"><b>Programación ${E(plan.year)}</b> · ${E(plan.level)} · ${E(plan.grades.join(', '))} · ${E(plan.ieType||'')}</div>
      <p class="sub">Elige o escribe el título de cada mes. Si registraste un calendario comunal, se usa para las nuevas sugerencias; los títulos elegidos por ti nunca se reemplazan automáticamente. El contexto adicional es opcional.</p>
      <div class="dd-scroll"><table class="dd-table dd-annual-month-table" data-col-weights="1,4,2"><thead><tr><th>Mes</th><th>Título elegido por el docente</th><th>Acción</th></tr></thead><tbody id="ddAnnualMonths">${rows}</tbody></table></div>
      <details class="topgap"><summary>Competencias curriculares de las áreas seleccionadas</summary>${curricularHtml(plan)}</details>
      <div class="actions topgap"><button class="btn" id="ddAnnualSave">💾 Guardar programación</button><button class="btn alt" id="ddAnnualSuggest">✨ Sugerir desde mis insumos</button><button class="btn alt" id="ddAnnualDownload">⬇ Descargar Word</button></div><p id="ddAnnualSuggestStatus" class="sub" role="status"></p>`;
    $('ddAnnualSave').onclick=()=>{saveFields();$('ddAnnualSave').textContent='✓ Guardado';};
    $('ddAnnualSuggest').onclick=refreshSuggestions;
    $('ddAnnualDownload').onclick=downloadWord;
  }
  function open(){
    const host=$('annualRoot');if(!host)return;
    syncWithUnits();
    host.innerHTML=`<div class="card"><h2>Programación anual vinculada a tus unidades</h2>
      <p>Organiza de marzo a diciembre. Puedes modificar las propuestas, guardar y crear una unidad desde el mes que elijas.</p>
      <div class="form2"><label>Año escolar<input id="ddAnnualNewYear" type="number" min="2024" max="2040" value="${currentYear()}"></label>
      <label>Programaciones guardadas<select id="ddAnnualPlanSelect"></select></label></div>
      <div class="actions"><button class="btn" id="ddAnnualNew">Crear o recuperar este año</button></div>
      <div id="ddAnnualEditor" class="topgap"></div></div>`;
    const selector=$('ddAnnualPlanSelect');
    selector.innerHTML=plans().map(p=>`<option value="${E(p.id)}">${E(p.year)} · ${E(p.level)} · ${E((p.grades||[]).join(', '))}</option>`).join('');
    selector.onchange=()=>render(selectedPlan());
    $('ddAnnualNew').onclick=()=>{
      const plan=makePlan();state.lastAnnualPlan=plan;save();open();
      if($('ddAnnualPlanSelect'))$('ddAnnualPlanSelect').value=plan.id;
      render(plan);
    };
    if(plans().length){const p=plans().find(x=>x.id===state.lastAnnualPlan?.id)||plans()[0];selector.value=p.id;render(p);}
  }
  function createFromMonth(month){
    saveFields();const plan=selectedPlan(),row=plan?.months?.find(m=>m.name===month);if(!plan||!row)return;
    const existing=(state.units||[]).find(u=>u.id===row.linkedUnitId);
    if(existing){go('plan');viewUnit(existing.id);return;}
    state.annualPendingUnit={planId:plan.id,month};save();
    go('plan');showUnit();
    // El selector global Unidad/Proyecto se reinicia al abrir un nuevo plan.
    // Desde la programación anual ya conocemos el tipo de esta entrada:
    // seleccionarlo después del reinicio evita pedir la misma decisión otra vez.
    setTimeout(()=>{
      const kind=row.type||'Unidad de aprendizaje';
      const button=[...document.querySelectorAll('#ddPlanningKindChooser [data-kind]')]
        .find(b=>b.dataset.kind===kind);
      if(button)button.click();
      else if($('unitType'))$('unitType').value=kind;
    },0);
    const title=$('unitTitle'),brief=$('unitSituation');
    if(title){title.value=row.title;title.dataset.autoTitle='false';title.dataset.ddSuggestedTitle='true';}
    if(brief){
      brief.value=row.context||'';
      // El título basta para preparar un contexto didáctico provisional.
      // La función existente incorpora nivel, grados y datos del perfil sin
      // presentar necesidades inventadas como observaciones de la comunidad.
      if(!row.context&&typeof root.ddAssistPlanningContext==='function')root.ddAssistPlanningContext(true);
      if(!brief.value.trim())brief.value=`Experiencia didáctica sobre «${row.title}» para ${plan.level} (${plan.grades.join(', ')}). Los hechos del contexto real serán verificados con el grupo.`;
    }
    if(typeof refreshUnitTitleSuggestions==='function')refreshUnitTitleSuggestions();
  }
  function attachUnit(unit){
    const pending=state.annualPendingUnit;if(!pending||!unit?.id)return;
    const plan=plans().find(p=>p.id===pending.planId),row=plan?.months?.find(m=>m.name===pending.month);
    if(!row)return;
    row.linkedUnitId=unit.id;row.title=unit.title;row.titleOrigin='unidad';row.type=unit.type||row.type;
    unit.annualPlanId=plan.id;unit.annualMonth=row.name;
    state.lastAnnualPlan=plan;delete state.annualPendingUnit;
  }
  function printHtml(plan){
    normalize(plan);
    const rows=plan.months.map(m=>{
      const linked=!!unitForMonth(m),basis=contextualBasis(m);
      return `<tr><td>${E(m.name)}<br><small>${linked?'Vinculada':'Sugerida'}</small></td>`+
        `<td>${E(m.title)}</td><td>${E(basis.text)}<br><small>${E(basis.origin)}</small></td>`+
        `<td>${E(productFor(m,plan))}</td></tr>`;
    }).join('');
    return `<h1>PROGRAMACIÓN ANUAL ${E(plan.year)}</h1><p><b>Nivel:</b> ${E(plan.level)} · <b>Grados/edades:</b> ${E(plan.grades.join(', '))} · <b>Tipo de IE:</b> ${E(plan.ieType||'')}</p>
      <p><b>Áreas previstas:</b> ${E(plan.areas.join(', '))}</p>
      <h2>Competencias de las áreas previstas</h2>${curricularHtml(plan)}
      <h2>Organización mensual de unidades y proyectos</h2>
      <p>Los títulos los elige el docente. Los productos no vinculados son propuestas que se precisarán en cada unidad a partir del diagnóstico y el contexto real.</p>
      <table data-col-weights="1,3,4,3" data-dd-compact-rows="true"><thead><tr><th>Mes</th><th>Unidad o proyecto</th><th>Situación o insumo disponible</th><th>Producto o evidencia</th></tr></thead><tbody>${rows}</tbody></table>
      <p>Nota: ajustar al diagnóstico y verificar el currículo oficial al desarrollar cada unidad.</p>`;
  }
  function downloadWord(){
    saveFields();const plan=selectedPlan();if(!plan)return;
    if(!root.DDWordExport?.downloadHtml)return alert('El exportador Word todavía no está disponible.');
    root.DDWordExport.downloadHtml('Programación anual '+plan.year,printHtml(plan),true,'Programacion_anual_'+plan.year);
  }
  document.addEventListener('click',event=>{
    const button=event.target.closest('[data-annual-create]');if(button)createFromMonth(button.dataset.annualCreate);
  });
  let autosave;
  document.addEventListener('input',event=>{
    if(!event.target.closest('#ddAnnualMonths'))return;
    if(event.target.matches('[data-field="title"]')){
      const row=event.target.closest('tr[data-month]'),label=row?.querySelector('[data-annual-product]');
      const plan=selectedPlan();
      if(label&&plan)label.textContent='Producto sugerido: '+suggestedProduct(event.target.value,plan.level);
    }
    clearTimeout(autosave);autosave=setTimeout(saveFields,750);
  });
  const css=document.createElement('style');
  css.textContent='.dd-annual-month-table input,.dd-annual-month-table textarea{width:100%;min-width:150px;padding:9px;border:1px solid #c8d9d2;border-radius:8px;font:inherit}.dd-annual-month-table details{margin-top:7px}.dd-annual-month-table details summary{font-size:12px;color:#396b57;cursor:pointer}.dd-annual-month-table details textarea{margin-top:8px}.dd-annual-month-table td{vertical-align:middle}.dd-annual-month-table td:last-child{min-width:124px}.dd-annual-month-table td:last-child .btn{margin-top:7px;font-size:13px}@media(max-width:650px){.dd-annual-month-table{min-width:600px}}';
  document.head.appendChild(css);
  root.DDAnnualPlanning={open,syncWithUnits,attachUnit,printHtml,downloadWord};
  root.DDPlanningTools.openAnnual=function(){go('annual');open();};
})(window);
