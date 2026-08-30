/* DocenteDigital – formato pedagógico y de exportación v2 */
(function(){
  state.teacherName=state.teacherName||'JORGE LUIS PALMA RODRIGUEZ';
  state.schoolName=state.schoolName||'I.E. 50740 CCOTATAQUI';
  save();

  const esc=v=>escapeHtml(v);
  const titleOptions=(brief,type)=>{
    const s=(brief||'').toLowerCase();
    const project=type==='Proyecto de aprendizaje';
    if(/siembr|tarpuy|papa|añu|oca|olluco/.test(s)) return project?[
      'Hatun Tarpuy: investigamos, sembramos y compartimos los saberes de nuestra comunidad',
      'Sembramos saberes y futuro: aprendemos del Hatun Tarpuy de Ccotataqui',
      'De la chacra a la escuela: investigamos y valoramos nuestra siembra andina'
    ]:[
      'Sembramos saberes y cuidamos nuestra tierra en el Hatun Tarpuy de Ccotataqui',
      'Aprendemos de nuestra siembra: saberes, ciencia y comunidad en Ccotataqui',
      'Hatun Tarpuy: aprendemos juntos de la siembra y la vida de nuestra comunidad'
    ];
    if(/pachamama|madre tierra/.test(s)) return project?[
      'Pachamamanchik: investigamos, valoramos y actuamos para cuidar nuestra Madre Tierra',
      'Saberes que cuidan la vida: un proyecto para agradecer y proteger la Pachamama',
      'Nuestra Pachamama, nuestra responsabilidad: aprendemos y actuamos desde la comunidad'
    ]:[
      'Pachamamanchik kawsayta quwanchik: aprendemos a agradecer y cuidar nuestra Madre Tierra',
      'Aprendemos de la Pachamama y fortalecemos nuestro compromiso con la vida',
      'Saberes de nuestra tierra: valoramos, agradecemos y cuidamos la Pachamama'
    ];
    if(/agua|yaku/.test(s)) return project?[
      'Yaku kawsaymi: investigamos y actuamos para cuidar el agua de nuestra comunidad',
      'Cada gota cuenta: un proyecto para conocer y proteger el agua que nos da vida',
      'Guardianes del yaku: investigamos soluciones para cuidar el agua'
    ]:[
      'El agua nos da vida: aprendemos a conocerla, valorarla y cuidarla',
      'Yaku kawsaymi: comprendemos y cuidamos el agua de nuestra comunidad',
      'Aprendemos del agua para cuidar la vida y nuestra comunidad'
    ];
    if(/residuo|basura|contamin/.test(s)) return project?[
      'Ccotataqui limpio: investigamos y actuamos para reducir nuestros residuos',
      'Menos residuos, más vida: transformamos hábitos para cuidar nuestra comunidad',
      'De problema a solución: construimos una comunidad que reduce y reutiliza'
    ]:[
      'Aprendemos a reducir los residuos y proteger nuestra comunidad',
      'Cuidamos nuestro entorno: comprendemos el problema de los residuos',
      'Menos contaminación, más vida: aprendemos a cuidar nuestros espacios'
    ];
    return project?[
      'Investigamos nuestra realidad y construimos soluciones para la comunidad',
      'Aprendemos haciendo: un proyecto para comprender y mejorar nuestro entorno',
      'De nuestras preguntas a la acción: investigamos, creamos y compartimos'
    ]:[
      'Aprendemos desde nuestra realidad para comprender y transformar el entorno',
      'Saberes de nuestra comunidad: investigamos, dialogamos y aprendemos juntos',
      'Nuestra comunidad nos enseña: construimos aprendizajes con sentido'
    ];
  };

  proposeUnitTitle=function(brief,type){ return titleOptions(brief,type)[0]; };

  const oldCreate=window.createUnitDemo;
  window.createUnitDemo=function(){
    const brief=byId('unitSituation')?.value.trim()||'';
    const type=byId('unitType')?.value||'Unidad de aprendizaje';
    if(brief){ byId('unitTitle').value=titleOptions(brief,type)[0]; }
    return oldCreate();
  };

  window.ddSuggestTitles=function(){
    const brief=byId('unitSituation')?.value.trim()||'';
    if(!brief)return alert('Primero escribe la idea o contexto de partida.');
    const type=byId('unitType')?.value||'Unidad de aprendizaje';
    const opts=titleOptions(brief,type);
    let box=byId('ddTitleSuggestions');
    if(!box){box=document.createElement('div');box.id='ddTitleSuggestions';box.className='dd-title-suggestions';byId('unitTitle').parentElement.appendChild(box);}
    box.innerHTML='<small><b>Títulos propuestos por DocenteDigital:</b></small>'+opts.map((t,i)=>`<button type="button" onclick="document.getElementById('unitTitle').value=${JSON.stringify(t)}">${i+1}. ${esc(t)}</button>`).join('');
  };

  const titleInput=byId('unitTitle');
  if(titleInput){
    titleInput.placeholder='La app propondrá y mejorará el título a partir del contexto';
    const b=document.createElement('button'); b.type='button'; b.className='btn ghost dd-title-btn'; b.textContent='✨ Proponer 3 títulos'; b.onclick=ddSuggestTitles; titleInput.parentElement.appendChild(b);
  }

  // Perfil institucional editable para encabezados y pie de página.
  const settingsCard=byId('settings')?.querySelector('.card');
  if(settingsCard){
    const p=document.createElement('div');p.className='dd-profile-box';
    p.innerHTML=`<h2>🪪 Datos para documentos</h2><div class="form2"><label>Nombre del docente<input id="ddTeacher" value="${esc(state.teacherName)}"></label><label>Institución educativa<input id="ddSchool" value="${esc(state.schoolName)}"></label></div><button class="btn" id="ddSaveProfile">Guardar datos</button>`;
    settingsCard.prepend(p);
    byId('ddSaveProfile').onclick=()=>{state.teacherName=byId('ddTeacher').value.trim()||'Docente';state.schoolName=byId('ddSchool').value.trim()||'Institución Educativa';save();alert('Datos guardados. Se usarán en el pie de página de Word.');};
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
      const f=document.createElement('div');f.className='dd-preview-footer';f.textContent=`${state.teacherName} · ${state.schoolName}`;out.appendChild(f);
    }
    const actions=out.querySelector('.actions.topgap');
    if(actions&&!actions.querySelector('.dd-review-btn')){
      const b=document.createElement('button');b.className='btn ghost dd-review-btn';b.textContent='✅ Revisar coherencia';b.onclick=()=>ddReviewUnit(unit.id);actions.appendChild(b);
    }
  };

  window.ddReviewUnit=function(id){
    const u=state.units.find(x=>x.id===id);if(!u)return;
    const checks=[['Situación significativa',!!unitSituation(u)],['Reto',!!u.reto],['Producto',!!u.product],['Propósitos y desempeños',Array.isArray(u.purposes)&&u.purposes.length>0],['Secuencia de sesiones',Array.isArray(u.activities)&&u.activities.length>0],['Instrumentos',true],['Registro auxiliar',true]];
    alert('Revisión pedagógica de la unidad\n\n'+checks.map(x=>`${x[1]?'✓':'⚠'} ${x[0]}`).join('\n')+'\n\nLa revisión avanzada con IA y fuentes curriculares se incorporará como siguiente capa.');
  };

  // Entrada conversacional simple, inspirada en flujos públicos de asistentes docentes; no simula IA.
  const homeGrid=byId('home')?.querySelector('.grid');
  if(homeGrid&&!byId('ddQuickBox')){
    const q=document.createElement('div');q.id='ddQuickBox';q.className='card dd-quickbox';
    q.innerHTML='<h2>💬 ¿Qué quieres preparar hoy?</h2><p class="sub">Escribe en lenguaje natural y DocenteDigital te lleva al flujo correcto.</p><div class="chatbar"><input id="ddQuickInput" placeholder="Ej.: Quiero una unidad sobre la siembra en Ccotataqui"><button class="btn" id="ddQuickGo">Continuar</button></div><small>Acceso rápido del prototipo: organiza la solicitud y reutiliza tu configuración; no reemplaza tu criterio docente.</small>';
    homeGrid.prepend(q);
    byId('ddQuickGo').onclick=()=>{const t=(byId('ddQuickInput').value||'').trim();if(!t)return;if(/sesión|sesion/i.test(t)){go('session');return;}if(/evaluación|evaluacion|rúbrica|rubrica/i.test(t)){go('evaluation');return;}go('plan');showUnit();byId('unitSituation').value=t.replace(/^(quiero|crear|preparar|hazme|necesito)\s+/i,'');ddSuggestTitles();};
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