/* DocenteDigital – formato pedagógico y de exportación v2.3 */
(function(){
  /* V3/V5: no inventar identidad docente ni institución. Los perfiles nuevos parten vacíos;
     los valores existentes se conservan para no alterar históricos ni datos ya registrados. */
  if(typeof state.teacherName!=='string')state.teacherName='';
  if(typeof state.schoolName!=='string')state.schoolName='';

  const esc=v=>escapeHtml(v);
  const titleOptions=(brief,type)=>{
    if(typeof window.proposeUnitTitleOptions==='function'){
      return window.proposeUnitTitleOptions(brief,type);
    }
    return [
      type==='Proyecto de aprendizaje'?'Investigamos una situación significativa de nuestro contexto':'Aprendemos a partir de una situación significativa de nuestro contexto',
      'Aprendemos con sentido desde nuestra realidad',
      'Observamos, investigamos y proponemos'
    ];
  };

  proposeUnitTitle=function(brief,type){ return titleOptions(brief,type)[0]; };

  const oldCreate=window.createUnitDemo;
  window.createUnitDemo=function(){
    const brief=byId('unitSituation')?.value.trim()||'';
    const type=byId('unitType')?.value||'Unidad de aprendizaje';
    const title=byId('unitTitle');
    if(brief&&title&&!title.value.trim()){
      title.value=titleOptions(brief,type)[0]||'';
      title.dataset.autoTitle='true';
    }
    return oldCreate();
  };

  window.ddSuggestTitles=function(){
    let brief=byId('unitSituation')?.value.trim()||'';
    if(!brief&&typeof window.ddAssistPlanningContext==='function'){
      brief=window.ddAssistPlanningContext(true)||'';
    }
    const type=byId('unitType')?.value||'Unidad de aprendizaje';
    const titleSeed=byId('unitTitle')?.value.trim()||'';
    if(!brief)brief=titleSeed||'una experiencia cercana y significativa para los estudiantes';
    const opts=titleOptions(brief,type);
    let box=byId('ddTitleSuggestions');
    if(!box){box=document.createElement('div');box.id='ddTitleSuggestions';box.className='dd-title-suggestions';byId('unitTitle').parentElement.appendChild(box);}
    box.innerHTML='<small><b>Títulos propuestos por DocenteDigital:</b> breves, coherentes y ajustados al contexto.</small><div class="dd-title-options">'+opts.map((t,i)=>`<button type="button" class="dd-title-option" onclick="chooseUnitTitle(${JSON.stringify(t)})">${esc(t)}</button>`).join('')+'</div><div class="actions topgap"><button type="button" class="btn ghost" onclick="window.DocenteDigitalAI?.openTitleAssistant?.()">💬 Mejorar con IA</button></div>';
  };

  const titleInput=byId('unitTitle');
  if(titleInput){
    titleInput.placeholder='DocenteDigital propondrá un título coherente a partir del contexto';
    if(!titleInput.parentElement.querySelector('.dd-title-btn')){
      const b=document.createElement('button'); b.type='button'; b.className='btn ghost dd-title-btn'; b.textContent='✨ Proponer títulos'; b.onclick=ddSuggestTitles; titleInput.parentElement.appendChild(b);
    }
  }

  // Perfil institucional editable para encabezados y pie de página.
  const settingsCard=byId('settings')?.querySelector('.card');
  if(settingsCard){
    const p=document.createElement('div');p.className='dd-profile-box';
    p.innerHTML=`<h2>🪪 Datos para documentos</h2><div class="form2"><label>Nombre del docente<input id="ddTeacher" value="${esc(state.teacherName)}"></label><label>Institución educativa<input id="ddSchool" value="${esc(state.schoolName)}"></label></div><button class="btn" id="ddSaveProfile">Guardar datos</button>`;
    settingsCard.prepend(p);
    byId('ddSaveProfile').onclick=()=>{state.teacherName=byId('ddTeacher').value.trim();state.schoolName=byId('ddSchool').value.trim();save();alert('Datos guardados. Se usarán en el pie de página de Word.');};
  }

  // Mejora el documento de unidad/proyecto sin alterar la estructura pedagógica ya generada.
  const oldUnitWordHtml=window.unitWordHtml;
  window.unitWordHtml=function(unit){
    let html=oldUnitWordHtml(unit);
    const heading=(unit.type||'Unidad de aprendizaje').toUpperCase();
    html=html.replace('UNIDAD DE APRENDIZAJE',heading);
    return html;
  };

  // Word: Agency FB 11, títulos en negrita, borde entrecortado, unidades/proyectos en A4 horizontal y pie 9 cursiva.
  wordDocument=function(title,body){
    const isLandscape=/UNIDAD DE APRENDIZAJE|PROYECTO DE APRENDIZAJE/.test(body);
    const page=isLandscape?'841.9pt 595.3pt':'595.3pt 841.9pt';
    const orientation=isLandscape?'mso-page-orientation:landscape;':'';
    const teacher=esc(state.teacherName||'Docente');
    const school=esc(state.schoolName||'Institución Educativa');
    return `<!doctype html><html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>${esc(title)}</title><style>
      @page Section1{size:${page};${orientation}margin:34pt 38pt 40pt 38pt;mso-footer:f1;}
      div.Section1{page:Section1;}
      body{font-family:"Agency FB","Arial Narrow",Arial,sans-serif;font-size:11pt;line-height:1.2;color:#111;margin:0;}
      .page-frame{border:1.5pt dashed #333;padding:14pt 16pt;min-height:480pt;box-sizing:border-box;}
      h1,h2,h3,h4{font-family:"Agency FB","Arial Narrow",Arial,sans-serif;font-weight:700;margin:8pt 0 5pt;}
      h1{font-size:16pt;text-align:center;}h2{font-size:13pt;}h3{font-size:11.5pt;}
      p,td,th,li{font-size:11pt;}table{border-collapse:collapse;width:100%;}th,td{border:1px solid #555;padding:4px 5px;vertical-align:top;}th{font-weight:700;background:#eaf2ec;}
      .dd-table{min-width:0!important}.dd-table th{background:#dfeee3!important;color:#111!important}.dd-scroll{overflow:visible!important}.dd-reto{border:1px solid #777;padding:7px;margin:7px 0;background:#f7faf8;}
      .doc-footer{font-family:"Agency FB","Arial Narrow",Arial,sans-serif;font-size:9pt;font-style:italic;text-align:center;color:#555;margin-top:10pt;border-top:0.5pt solid #aaa;padding-top:4pt;}
      .mso-footer{mso-element:footer;font-family:"Agency FB","Arial Narrow",Arial,sans-serif;font-size:9pt;font-style:italic;text-align:center;color:#555;}
    </style></head><body><div class="Section1"><div class="page-frame">${body}<div class="doc-footer">${teacher} · ${school}</div></div><div style="mso-element:footer" id="f1"><p class="MsoFooter mso-footer">${teacher} · ${school}</p></div></div></body></html>`;
  };

  const oldRenderUnitOutput=window.renderUnitOutput;
  window.renderUnitOutput=function(unit){
    oldRenderUnitOutput(unit);
    const out=byId('unitOutput');if(!out)return;
    out.classList.add('dd-landscape-preview');
    const first=out.querySelector('#dd-resumen .dd-cover');
    if(first&&!first.querySelector('.dd-doc-type')){
      const type=document.createElement('div');type.className='dd-doc-type';type.textContent=(unit.type||'Unidad de aprendizaje').toUpperCase();
      first.querySelector('div')?.prepend(type);
    }
    if(!out.querySelector('.dd-preview-footer')){
      const f=document.createElement('div');f.className='dd-preview-footer';f.textContent=`${state.teacherName||'Docente'} · ${state.schoolName||'Institución Educativa'}`;out.appendChild(f);
    }
    const actions=out.querySelector('.actions.topgap');
    if(actions&&!actions.querySelector('.dd-review-btn')){
      const b=document.createElement('button');b.className='btn ghost dd-review-btn';b.textContent='✅ Revisar coherencia';b.onclick=()=>ddReviewUnit(unit.id);actions.appendChild(b);
    }
  };

  window.ddReviewUnit=function(id){
    const u=state.units.find(x=>x.id===id);if(!u)return;
    const checks=[
      ['Situación significativa',!!unitSituation(u),''],
      ['Reto',!!u.reto,''],
      ['Producto',!!u.product,''],
      ['Propósitos y desempeños',Array.isArray(u.purposes)&&u.purposes.length>0,''],
      ['Secuencia de sesiones',Array.isArray(u.activities)&&u.activities.length>0,''],
      ['Instrumentos',null,'pendiente de verificación funcional'],
      ['Registro auxiliar',null,'pendiente de verificación funcional']
    ];
    const icon=v=>v===true?'✓':v===false?'⚠':'…';
    const detail=x=>x[2]?` — ${x[2]}`:'';
    alert('Revisión pedagógica de la unidad\n\n'+checks.map(x=>`${icon(x[1])} ${x[0]}${detail(x)}`).join('\n')+'\n\nEsta revisión comprueba solo datos visibles de la unidad. La revisión avanzada con IA, fuentes curriculares, instrumentos y registro auxiliar permanece pendiente hasta contar con evidencia funcional.');
  };

  // Entrada conversacional simple, inspirada en flujos públicos de asistentes docentes; no simula IA.
  const homeGrid=byId('home')?.querySelector('.grid');
  if(homeGrid&&!byId('ddQuickBox')){
    const q=document.createElement('div');q.id='ddQuickBox';q.className='card dd-quickbox';
    q.innerHTML='<h2>💬 ¿Qué quieres preparar hoy?</h2><p class="sub">Escribe en lenguaje natural y DocenteDigital te lleva al flujo correcto.</p><div class="chatbar"><input id="ddQuickInput" placeholder="Ej.: Quiero una unidad sobre la siembra de mi localidad"><button class="btn" id="ddQuickGo">Continuar</button></div><small>Acceso rápido del prototipo: organiza la solicitud y reutiliza tu configuración; no reemplaza tu criterio docente.</small>';
    homeGrid.prepend(q);
    byId('ddQuickGo').onclick=()=>{
      const t=(byId('ddQuickInput').value||'').trim();
      if(!t)return;
      if(/\b(oficio|resoluci[oó]n|\brd\b|pat|pei|pci|reglamento interno|\bri\b|informe|acta|conei|comit[eé]|ugel|dre|gre|director|gesti[oó]n escolar)\b/i.test(t)){
        if(typeof go==='function')go('director');
        alert('Carpeta Director: esta función todavía está en construcción. Tu solicitud no se convertirá en una Unidad/Proyecto.');
        return;
      }
      if(/sesión|sesion/i.test(t)){go('session');return;}
      if(/evaluación|evaluacion|rúbrica|rubrica/i.test(t)){go('evaluation');return;}
      go('plan');showUnit();byId('unitSituation').value=t.replace(/^(quiero|crear|preparar|hazme|necesito)\s+/i,'');ddSuggestTitles();
    };
  }

  const css=document.createElement('style');
  css.textContent=`
    .dd-landscape-preview{font-family:"Agency FB","Arial Narrow",Arial,sans-serif;font-size:15px;}
    .dd-landscape-preview .dd-unit-section{max-width:1120px;margin:12px auto;border:2px dashed #555;border-radius:4px;background:#fff;box-shadow:0 8px 26px rgba(0,0,0,.06);padding:22px 26px;}
    .dd-landscape-preview h1,.dd-landscape-preview h2,.dd-landscape-preview h3{font-weight:800;}
    .dd-doc-type{font-size:18px;font-weight:900;text-align:center;letter-spacing:.5px;margin-bottom:8px;}
    .dd-preview-footer{max-width:1120px;margin:8px auto 0;text-align:center;font-family:"Agency FB","Arial Narrow",Arial,sans-serif;font-size:13px;font-style:italic;color:#667;}
    .dd-title-btn{margin-top:8px}.dd-title-suggestions{display:grid;gap:7px;margin-top:8px}.dd-title-suggestions button{border:1px solid #d7dfdb;background:#f8fbf9;text-align:left;padding:8px 10px;border-radius:10px;cursor:pointer}.dd-title-suggestions button:hover{background:#eef7f1}
    .dd-profile-box{border-bottom:1px solid #ddd;padding-bottom:16px;margin-bottom:16px}.dd-quickbox{grid-column:span 12;background:linear-gradient(135deg,#f4fbf7,#eef5ff)}
    @media(max-width:720px){.dd-landscape-preview .dd-unit-section{padding:14px 12px;border-width:1.5px}.dd-preview-footer{font-size:11px}.dd-quickbox{grid-column:span 12}}
  `;
  document.head.appendChild(css);
})();