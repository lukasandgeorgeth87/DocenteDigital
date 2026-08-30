/* DocenteDigital – Biblioteca Maestra Pedagógica + vigilancia normativa */
(function(){
  if(window.__ddMasterLibraryV10)return; window.__ddMasterLibraryV10=true;
  const E=v=>escapeHtml(v);
  const HIERARCHY=[
    'Normas legales vigentes del MINEDU',
    'Currículo Nacional de la Educación Básica (CNEB)',
    'Programa Curricular del nivel correspondiente',
    'Orientaciones y fascículos oficiales MINEDU',
    'Documentos especializados por modalidad/contexto: EIB, multigrado, inclusión',
    'Guías por área curricular',
    'Investigación y autores pedagógicos'
  ];
  const AUTHORS=[
    {cat:'Diseño curricular',name:'Grant Wiggins y Jay McTighe',use:'Diseño inverso: resultados → evidencias → experiencias.'},
    {cat:'Evaluación formativa',name:'Dylan Wiliam',use:'Criterios, evidencia de aprendizaje y decisiones para hacer avanzar.'},
    {cat:'Retroalimentación',name:'Susan Brookhart',use:'Feedback específico, comprensible, oportuno y accionable.'},
    {cat:'Retroalimentación',name:'John Hattie y Helen Timperley',use:'Meta, progreso y próximo paso.'},
    {cat:'Competencias',name:'Antoni Zabala y Laia Arnau',use:'Actuaciones competentes en situaciones reales.'},
    {cat:'Enseñanza situada',name:'Frida Díaz Barriga',use:'Problemas auténticos, proyectos, casos y evaluación auténtica.'},
    {cat:'Enseñanza explícita',name:'Barak Rosenshine',use:'Repaso, pasos pequeños, modelado, práctica guiada y comprobación.'},
    {cat:'Diferenciación',name:'Carol Ann Tomlinson',use:'Diferenciar proceso, producto, apoyos y autonomía.'},
    {cat:'Aprendizaje cooperativo',name:'Johnson, Johnson y Holubec',use:'Interdependencia positiva, responsabilidad individual y habilidades sociales.'},
    {cat:'Inclusión / DUA',name:'Meyer, Rose y Gordon',use:'Múltiples formas de implicación, representación y acción/expresión.'},
    {cat:'EIB Perú',name:'Trapnell, Quintasi, Quispe y equipos MINEDU-DEIB',use:'Caracterización sociocultural/lingüística, calendario comunal y diálogo de saberes.'},
    {cat:'EIB Matemática',name:'Martha Villavicencio',use:'Etnomatemática y articulación del saber local con la matemática escolar.'}
  ];
  const WATCH_STATES=['VIGENTE','VIGENTE CON MODIFICATORIAS','MODIFICADA','DEROGADA','SUSTITUIDA','EN REVISIÓN','PENDIENTE DE VERIFICACIÓN'];
  state.masterLibrary=state.masterLibrary||{version:'2026-08-29',normativeStatus:'PENDIENTE DE VERIFICACIÓN',lastVerification:null};
  save();

  function activeAuthors(kind){
    const out=[];
    if(kind==='unit'||kind==='project') out.push(AUTHORS[0],AUTHORS[4],AUTHORS[5]);
    if(kind==='session') out.push(AUTHORS[1],AUTHORS[2],AUTHORS[3],AUTHORS[6],AUTHORS[7],AUTHORS[9]);
    const multi=state.level==='Primaria'&&(state.ieType==='Multigrado'||state.ieType==='Unidocente');
    const eib=(state.language==='Quechua'||state.language==='Bilingüe');
    if(multi&&eib)out.push(AUTHORS[10]);
    const activity=(()=>{try{return selectedActivity()?.activity}catch(e){return null}})();
    if(multi&&eib&&activity?.area==='Matemática')out.push(AUTHORS[11]);
    return [...new Map(out.map(x=>[x.name,x])).values()];
  }

  function sourceStrip(kind){
    const authors=activeAuthors(kind);
    const status=state.masterLibrary.normativeStatus;
    const tone=status==='VIGENTE'?'ok':'warn';
    return `<div class="dd-source-strip"><div><b>📚 Biblioteca Maestra activa</b><span>MINEDU primero → orientación oficial → EIB/multigrado → autores.</span></div><div class="dd-source-pills"><span class="${tone}">🛡 ${E(status)}</span>${authors.slice(0,4).map(a=>`<span>${E(a.name)}</span>`).join('')}</div></div>`;
  }

  function mountSettings(){
    const screen=byId('settings'); if(!screen||byId('ddMasterLibraryCard'))return;
    const card=document.createElement('div'); card.id='ddMasterLibraryCard';card.className='card topgap';
    card.innerHTML=`<h2>📚 Biblioteca Maestra Pedagógica</h2><p class="sub">Regla base: la app nunca debe presentar una teoría de autor como si fuera una norma del MINEDU. Si existe contradicción, prevalece la fuente oficial vigente.</p>
      <div class="dd-lib-grid"><div><h3>Jerarquía obligatoria</h3><ol>${HIERARCHY.map(x=>`<li>${E(x)}</li>`).join('')}</ol></div><div><h3>🛡 Vigilancia normativa</h3><p><b>Estado actual del prototipo:</b> <span class="dd-status-warn">${E(state.masterLibrary.normativeStatus)}</span></p><p class="sub">No se afirmará que una norma está vigente hasta verificarla en una fuente oficial. Estados previstos: ${WATCH_STATES.map(E).join(' · ')}</p><div class="notice"><b>⚠ Regla:</b> una norma derogada o sustituida no se usa como fuente principal; una norma con modificatorias debe leerse junto con sus cambios.</div></div></div>
      <details class="topgap"><summary><b>🧠 Ver autores de referencia incorporados</b></summary><div class="dd-author-grid">${AUTHORS.map(a=>`<div class="dd-author"><b>${E(a.name)}</b><small>${E(a.cat)}</small><p>${E(a.use)}</p></div>`).join('')}</div></details>`;
    screen.appendChild(card);
  }

  function mountPlan(){
    const p=byId('plan');if(!p||byId('ddPlanSources'))return;
    const s=document.createElement('div');s.id='ddPlanSources';s.innerHTML=sourceStrip('unit');
    const h=p.querySelector('h1'); if(h)h.insertAdjacentElement('afterend',s); else p.prepend(s);
  }
  function mountSession(){
    const p=byId('session');if(!p||byId('ddSessionSources'))return;
    const s=document.createElement('div');s.id='ddSessionSources';s.innerHTML=sourceStrip('session');
    const h=p.querySelector('h1'); if(h)h.insertAdjacentElement('afterend',s); else p.prepend(s);
  }
  function refreshStrips(){
    const ps=byId('ddPlanSources');if(ps)ps.innerHTML=sourceStrip('unit');
    const ss=byId('ddSessionSources');if(ss)ss.innerHTML=sourceStrip('session');
  }

  function enrichAudits(){
    const ua=byId('ddAuditToast');
    if(ua?.classList.contains('show')&&!ua.querySelector('.dd-lib-audit-note')){
      const n=document.createElement('div');n.className='dd-lib-audit-note';n.innerHTML=`📚 <b>Jerarquía de fuentes:</b> activa · 🛡 <b>Normativa:</b> ${E(state.masterLibrary.normativeStatus)} · No se presentan teorías de autor como normas MINEDU.`;ua.appendChild(n);
    }
    const sa=byId('ddSessionAuditToast');
    if(sa?.classList.contains('show')&&!sa.querySelector('.dd-lib-audit-note')){
      const authors=activeAuthors('session').slice(0,5).map(a=>a.name).join(', ');
      const n=document.createElement('div');n.className='dd-lib-audit-note';n.innerHTML=`📚 <b>Biblioteca Maestra:</b> fuentes oficiales primero · Autores de apoyo: ${E(authors)}.`;sa.appendChild(n);
    }
  }

  window.ddMasterLibrary={hierarchy:HIERARCHY,authors:AUTHORS,watchStates:WATCH_STATES,activeAuthors};
  const observer=new MutationObserver(()=>{mountSettings();mountPlan();mountSession();refreshStrips();enrichAudits();});
  observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  mountSettings();mountPlan();mountSession();refreshStrips();

  const css=document.createElement('style');css.textContent=`
    .dd-source-strip{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin:7px 0 14px;padding:10px 12px;border:1px solid #d6e4dc;border-radius:13px;background:#f7fbf9}.dd-source-strip>div:first-child{display:grid;gap:2px}.dd-source-strip span{font-size:12px;color:#5e7268}.dd-source-pills{display:flex;gap:5px;flex-wrap:wrap;justify-content:flex-end}.dd-source-pills span{padding:4px 7px;border-radius:999px;background:#edf4f0;color:#355b49;font-weight:800}.dd-source-pills .warn,.dd-status-warn{background:#fff3cf;color:#755719}.dd-source-pills .ok{background:#e9f7ee;color:#24613d}.dd-lib-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:16px}.dd-lib-grid ol{margin:8px 0 0;padding-left:22px}.dd-lib-grid li{margin:6px 0}.dd-author-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;margin-top:10px}.dd-author{border:1px solid #dbe7ef;border-radius:12px;padding:10px;background:#fbfdfc}.dd-author small{display:block;color:#6b7d73;margin-top:3px}.dd-author p{font-size:13px;margin:7px 0 0}.dd-lib-audit-note{margin-top:8px;padding:7px 9px;border-radius:9px;background:#eef7f3;font-size:12px;color:#355b49}@media(max-width:780px){.dd-source-strip{display:block}.dd-source-pills{justify-content:flex-start;margin-top:7px}.dd-lib-grid,.dd-author-grid{grid-template-columns:1fr}}
  `;document.head.appendChild(css);
})();