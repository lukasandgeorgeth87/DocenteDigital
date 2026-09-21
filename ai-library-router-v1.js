(() => {
  'use strict';

  const CATALOG = [
    {
      id:'PRI-CYT-PLANTAS-001',
      title:'Plantas distintas: observamos y comparamos',
      level:'Primaria',
      area:'Ciencia y Tecnología',
      topic:'plantas crecimiento biohuerto',
      kind:'Imagen de problematización',
      quality:'A',
      source:'Biblioteca propia DocenteDigital',
      license:'Recurso propio / generado para el proyecto',
      fileName:'IMG-PROB-01_plantas_distintas.png',
      reusable:true
    },
    {
      id:'PRI-CYT-PLANTAS-002',
      title:'Condiciones para el crecimiento de una planta',
      level:'Primaria',
      area:'Ciencia y Tecnología',
      topic:'planta agua sol tierra crecimiento',
      kind:'Lámina conceptual',
      quality:'A',
      source:'Biblioteca propia DocenteDigital',
      license:'Recurso propio / generado para el proyecto',
      fileName:'IMG-CONC-01_condiciones_crecimiento.png',
      reusable:true
    },
    {
      id:'PRI-CYT-GERMINACION-003',
      title:'Registros de germinación: día 1, día 4 y día 8',
      level:'Primaria',
      area:'Ciencia y Tecnología',
      topic:'germinación semilla registro crecimiento',
      kind:'Secuencia visual',
      quality:'A',
      source:'Biblioteca propia DocenteDigital',
      license:'Recurso propio / generado para el proyecto',
      fileName:'IMG-01_registros_dia1_dia4_dia8.png',
      reusable:true
    },
    {
      id:'PRI-CYT-PLANTAS-004',
      title:'Comparamos plantas — 1.º de primaria',
      level:'Primaria',
      area:'Ciencia y Tecnología',
      topic:'plantas comparación observación primer grado',
      kind:'Ficha ilustrada',
      quality:'A',
      source:'Biblioteca propia DocenteDigital',
      license:'Recurso propio / generado para el proyecto',
      fileName:'FIC-1-01_comparamos_plantas.png',
      reusable:true
    },
    {
      id:'PRI-PS-BIOHUERTO-005',
      title:'Acuerdos para cuidar el biohuerto',
      level:'Primaria',
      area:'Personal Social',
      topic:'biohuerto acuerdos convivencia responsabilidades',
      kind:'Imagen de problematización',
      quality:'A',
      source:'Biblioteca propia DocenteDigital',
      license:'Recurso propio / generado para el proyecto',
      fileName:'IMG-PROB-01_acuerdos_biohuerto(4).png',
      reusable:true
    },
    {
      id:'SEC-CYT-RESIDUOS-006',
      title:'Gestión de residuos sólidos en el Perú',
      level:'Secundaria',
      area:'Ciencia y Tecnología',
      topic:'residuos sólidos reciclaje contaminación Perú',
      kind:'Infografía',
      quality:'A',
      source:'Biblioteca propia DocenteDigital',
      license:'Recurso propio / generado para el proyecto',
      fileName:'Infografía: Gestión de residuos en Perú.png',
      reusable:true
    },
    {
      id:'PRI-CYT-BIOHUERTO-007',
      title:'Carteles para cultivos del biohuerto',
      level:'Primaria',
      area:'Ciencia y Tecnología',
      topic:'papa tarwi habas lisas arvejas cebolla culantro biohuerto',
      kind:'Cartel imprimible',
      quality:'A',
      source:'Biblioteca propia DocenteDigital',
      license:'Recurso propio / generado para el proyecto',
      fileName:'Colección carteles biohuerto',
      reusable:true
    }
  ];

  const POLICY = {
    teacherMonthlyAiBudgetSoles: 5,
    directorMonthlyAiBudgetSoles: 5,
    reuseThreshold: 0.8,
    imageStrategy: [
      '1. Buscar en biblioteca',
      '2. Reutilizar si encaja',
      '3. Adaptar si requiere cambios menores',
      '4. Generar imagen nueva solo si no existe una opción adecuada'
    ]
  };

  function appState(){
    try { return JSON.parse(localStorage.getItem('docenteDigitalPrototype') || '{}'); }
    catch { return {}; }
  }

  function esc(value){
    return String(value ?? '').replace(/[&<>'"]/g, c => ({
      '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'
    }[c]));
  }

  function normalize(value){
    return String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g,'')
      .replace(/[^a-z0-9ñ ]/g,' ');
  }

  function tokens(value){
    return [...new Set(normalize(value).split(/\s+/).filter(x => x.length > 2))];
  }

  function scoreResource(resource, ctx){
    const hay = normalize([
      resource.title, resource.level, resource.area, resource.topic, resource.kind
    ].join(' '));
    const needles = tokens(ctx);
    if(!needles.length) return 0;
    let hits = 0;
    needles.forEach(t => { if(hay.includes(t)) hits += 1; });
    if(resource.area && normalize(ctx).includes(normalize(resource.area))) hits += 2;
    if(resource.level && normalize(ctx).includes(normalize(resource.level))) hits += 1;
    return hits / Math.max(needles.length + 3, 1);
  }

  function currentContextText(){
    const s = appState();
    const last = s.lastSession || {};
    return [
      s.level, s.ieType, ...(s.grades || []), ...(s.areas || []),
      last.title, last.area, last.brief, last.unitTitle
    ].filter(Boolean).join(' ');
  }

  function bestResources(limit=6){
    const ctx = currentContextText();
    return CATALOG
      .map(r => ({...r, score:scoreResource(r, ctx)}))
      .sort((a,b) => b.score - a.score)
      .slice(0, limit);
  }

  function openChatGPTFree(){
    window.open('https://chatgpt.com/', '_blank', 'noopener,noreferrer');
  }

  async function copyGeneralPrompt(){
    const s = appState();
    const last = s.lastSession || {};
    const prompt = last.title
      ? `Ayúdame con una explicación general y ejemplos sobre: "${last.title}". Área: ${last.area || 'educación'}. No necesito datos personales ni información privada de mi institución.`
      : 'Ayúdame con una consulta educativa general. No necesito datos personales ni información privada de mi institución.';
    try{
      await navigator.clipboard.writeText(prompt);
      alert('Consulta general copiada. Puedes pegarla en ChatGPT Gratis.');
    }catch{
      promptFallback(prompt);
    }
  }

  function promptFallback(text){
    const ta=document.createElement('textarea');
    ta.value=text;document.body.appendChild(ta);ta.select();
    try{document.execCommand('copy');alert('Consulta general copiada.');}
    catch{alert(text);}
    ta.remove();
  }

  function renderResourceCards(items){
    if(!items.length) return '<div class="dd-empty">No encontramos recursos con esos filtros. En la siguiente fase se buscará primero en fuentes con licencia clara antes de generar una imagen nueva.</div>';
    return items.map(r => `
      <article class="dd-resource">
        <div class="dd-resource-preview" aria-hidden="true">${iconFor(r.kind)}</div>
        <div class="dd-resource-body">
          <div class="dd-badges">
            <span class="dd-badge">${esc(r.level)}</span>
            <span class="dd-badge green">Calidad ${esc(r.quality)}</span>
          </div>
          <h3>${esc(r.title)}</h3>
          <p><b>Área:</b> ${esc(r.area)} · <b>Tipo:</b> ${esc(r.kind)}</p>
          <p class="dd-small"><b>Origen:</b> ${esc(r.source)}<br><b>Uso:</b> reutilizable · <b>Licencia:</b> ${esc(r.license)}</p>
          <button class="btn alt" type="button" onclick="window.DocenteDigitalAI.selectResource('${esc(r.id)}')">Usar como referencia</button>
        </div>
      </article>
    `).join('');
  }

  function iconFor(kind){
    const k=normalize(kind);
    if(k.includes('infografia')) return '📊';
    if(k.includes('ficha')) return '📝';
    if(k.includes('cartel')) return '🏷️';
    if(k.includes('secuencia')) return '🌱';
    if(k.includes('conceptual')) return '💡';
    return '🖼️';
  }

  function renderLibrary(){
    const level = document.getElementById('ddLibLevel')?.value || '';
    const area = document.getElementById('ddLibArea')?.value || '';
    const query = normalize(document.getElementById('ddLibQuery')?.value || '');
    let items=[...CATALOG];
    if(level) items=items.filter(x=>x.level===level);
    if(area) items=items.filter(x=>x.area===area);
    if(query) items=items.filter(x=>normalize([x.title,x.topic,x.kind,x.area].join(' ')).includes(query));
    const target=document.getElementById('ddLibraryResults');
    if(target) target.innerHTML=renderResourceCards(items);
  }

  function selectResource(id){
    const r=CATALOG.find(x=>x.id===id);
    if(!r) return;
    localStorage.setItem('docenteDigitalSelectedResource', JSON.stringify({
      id:r.id,title:r.title,fileName:r.fileName,selectedAt:new Date().toISOString()
    }));
    alert('Recurso seleccionado como referencia. En la integración siguiente se insertará automáticamente en ficha, PPT o sesión según corresponda.');
  }

  function showSessionSuggestions(){
    const items=bestResources(5);
    const box=document.getElementById('ddSessionSuggestions');
    if(!box) return;
    box.innerHTML = `
      <div class="dd-panel">
        <div class="dd-panel-head">
          <div><span class="pill">Biblioteca primero</span><h3>Imágenes sugeridas para esta sesión</h3></div>
          <button class="btn ghost" type="button" onclick="go('aihub')">Ver biblioteca</button>
        </div>
        <p class="sub">Se priorizan recursos ya existentes para ahorrar tiempo y consumo. Una imagen nueva será opcional y con crédito.</p>
        <div class="dd-resource-grid">${renderResourceCards(items)}</div>
      </div>`;
    box.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function installSessionActions(){
    const output=document.getElementById('sessionOutput');
    if(!output || document.getElementById('ddImageActions')) return;
    const block=document.createElement('div');
    block.id='ddImageActions';
    block.className='dd-image-actions hidden';
    block.innerHTML=`
      <div class="dd-inline-actions">
        <button class="btn alt" type="button" onclick="window.DocenteDigitalAI.showSessionSuggestions()">🖼 Usar imagen incluida</button>
        <button class="btn ghost" type="button" onclick="window.DocenteDigitalAI.newPremiumImage()">✨ Nueva imagen · crédito</button>
      </div>
      <div id="ddSessionSuggestions"></div>`;
    output.appendChild(block);

    const observer = new MutationObserver(() => {
      const visible=!output.classList.contains('hidden');
      block.classList.toggle('hidden',!visible);
    });
    observer.observe(output,{attributes:true,attributeFilter:['class']});
    block.classList.toggle('hidden',output.classList.contains('hidden'));
  }

  function newPremiumImage(){
    alert('La generación de imagen nueva quedará detrás de créditos y límites mensuales. Antes se buscará una coincidencia útil en la biblioteca.');
  }

  function injectStyles(){
    if(document.getElementById('ddAiLibraryStyles')) return;
    const style=document.createElement('style');
    style.id='ddAiLibraryStyles';
    style.textContent=`
      .dd-hero{background:linear-gradient(135deg,#eefbf7,#eef4ff);border:1px solid var(--line);border-radius:var(--r);padding:20px;margin-bottom:14px}
      .dd-hero h1{margin:4px 0 8px}
      .dd-two{display:grid;grid-template-columns:1fr 1fr;gap:14px}
      .dd-panel{background:#fff;border:1px solid var(--line);border-radius:18px;padding:16px;margin-top:14px}
      .dd-panel-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap}
      .dd-panel h3{margin:7px 0}
      .dd-inline-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}
      .dd-library-controls{display:grid;grid-template-columns:180px 240px 1fr;gap:10px;margin:12px 0}
      .dd-library-controls select,.dd-library-controls input{margin:0}
      .dd-resource-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:12px}
      .dd-resource{display:grid;grid-template-columns:90px 1fr;gap:12px;border:1px solid var(--line);border-radius:16px;padding:12px;background:#fff}
      .dd-resource-preview{display:grid;place-items:center;border-radius:13px;background:linear-gradient(135deg,#eaf7f5,#eef4ff);min-height:90px;font-size:36px}
      .dd-resource-body h3{margin:6px 0 4px;font-size:17px}
      .dd-resource-body p{margin:4px 0;color:var(--muted)}
      .dd-badges{display:flex;flex-wrap:wrap;gap:5px}
      .dd-badge{font-size:11px;font-weight:900;border-radius:999px;padding:4px 7px;background:#eef4ff;color:#315a94}
      .dd-badge.green{background:#eaf8ef;color:#235f38}
      .dd-small{font-size:12px}
      .dd-empty{padding:18px;border:1px dashed #bfd0da;border-radius:14px;color:var(--muted)}
      .dd-policy{counter-reset:step;display:grid;gap:8px;margin-top:10px}
      .dd-policy div{background:#f7fafc;border:1px solid var(--line);border-radius:12px;padding:9px 11px}
      .dd-cost{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:10px}
      .dd-cost strong{display:block;font-size:26px;color:var(--p)}
      .dd-image-actions{margin-top:14px}
      @media(max-width:850px){
        .dd-two,.dd-resource-grid,.dd-library-controls,.dd-cost{grid-template-columns:1fr}
        .dd-resource{grid-template-columns:70px 1fr}
      }`;
    document.head.appendChild(style);
  }

  function installHub(){
    if(document.getElementById('aihub')) return;
    const content=document.querySelector('.content');
    if(!content) return;
    const section=document.createElement('section');
    section.id='aihub';
    section.className='screen';
    section.innerHTML=`
      <div class="dd-hero">
        <span class="pill">Ahorro inteligente</span>
        <h1>IA y Biblioteca DocenteDigital</h1>
        <p>Primero reutilizamos recursos de calidad. Para consultas generales puedes usar tu propia cuenta de ChatGPT Gratis. La API de DocenteDigital se reserva para trabajo conectado con tus datos, proyectos y documentos.</p>
      </div>

      <div class="dd-two">
        <div class="card">
          <h2>💬 ChatGPT Gratis</h2>
          <p>Úsalo para explicaciones, ideas o consultas generales que no necesitan información privada de DocenteDigital.</p>
          <div class="dd-inline-actions">
            <button class="btn" type="button" onclick="window.DocenteDigitalAI.openChatGPTFree()">Abrir ChatGPT Gratis</button>
            <button class="btn ghost" type="button" onclick="window.DocenteDigitalAI.copyGeneralPrompt()">Copiar consulta general</button>
          </div>
        </div>
        <div class="card">
          <h2>🤖 Asistente DocenteDigital</h2>
          <p>Se conectará por API solo cuando la tarea necesite tus unidades, proyectos, criterios, evidencias, registros o documentos directivos.</p>
          <div class="notice">Fase actual: arquitectura preparada. La conexión de API se hará en servidor para no exponer claves.</div>
        </div>
      </div>

      <div class="dd-panel">
        <div class="dd-panel-head">
          <div><span class="pill">Biblioteca Visual v1</span><h2>Recursos reutilizables</h2></div>
          <span class="dd-badge green">Calidad A prioritaria</span>
        </div>
        <p class="sub">Los primeros recursos catalogados provienen de materiales que ya se han creado para DocenteDigital. No se genera una imagen nueva si una existente resuelve bien la necesidad.</p>
        <div class="dd-library-controls">
          <select id="ddLibLevel" onchange="window.DocenteDigitalAI.renderLibrary()">
            <option value="">Todos los niveles</option>
            <option>Inicial</option><option>Primaria</option><option>Secundaria</option>
          </select>
          <select id="ddLibArea" onchange="window.DocenteDigitalAI.renderLibrary()">
            <option value="">Todas las áreas</option>
            <option>Comunicación</option><option>Matemática</option><option>Ciencia y Tecnología</option><option>Personal Social</option><option>Ciencias Sociales</option>
          </select>
          <input id="ddLibQuery" placeholder="Buscar: germinación, residuos, biohuerto..." oninput="window.DocenteDigitalAI.renderLibrary()">
        </div>
        <div id="ddLibraryResults" class="dd-resource-grid"></div>
      </div>

      <div class="dd-two">
        <div class="dd-panel">
          <h2>♻️ Regla de ahorro</h2>
          <div class="dd-policy">
            ${POLICY.imageStrategy.map(x=>`<div>${esc(x)}</div>`).join('')}
          </div>
        </div>
        <div class="dd-panel expert-only">
          <h2>💰 Presupuesto interno inicial</h2>
          <div class="dd-cost">
            <div><strong>S/ ${POLICY.teacherMonthlyAiBudgetSoles}</strong><span>objetivo máximo IA / docente / mes</span></div>
            <div><strong>S/ ${POLICY.directorMonthlyAiBudgetSoles}</strong><span>reserva máxima IA / director / mes</span></div>
          </div>
          <p class="dd-small">Registro, conclusiones, Word/PDF/PPT y reutilización de biblioteca deben resolverse sin nuevas llamadas de IA cuando los datos ya existen.</p>
        </div>
      </div>`;
    content.appendChild(section);
    renderLibrary();

    const sidebar=document.querySelector('.sidebar');
    if(sidebar && !sidebar.querySelector('[data-screen="aihub"]')){
      const settings=sidebar.querySelector('[data-screen="settings"]');
      const b=document.createElement('button');
      b.className='nav';b.dataset.screen='aihub';b.onclick=()=>go('aihub');
      b.innerHTML='🤖 IA y Biblioteca';
      sidebar.insertBefore(b,settings||null);
    }

    const homeGrid=document.querySelector('#home .grid');
    if(homeGrid && !document.getElementById('ddHomeAiCard')){
      const card=document.createElement('button');
      card.id='ddHomeAiCard';card.className='card action-card span4';
      card.onclick=()=>go('aihub');
      card.innerHTML='<span>🤖</span><h2>IA y Biblioteca</h2><p>Reutiliza imágenes, abre ChatGPT Gratis y controla el consumo.</p>';
      homeGrid.appendChild(card);
    }
  }

  function enhanceDirector(){
    const grid=document.querySelector('#director .grid');
    if(!grid || document.getElementById('ddDirectorLibrary')) return;
    const card=document.createElement('div');
    card.id='ddDirectorLibrary';card.className='card span6';
    card.innerHTML='<h2>🖼️ Biblioteca institucional</h2><p>Portadas, íconos, diagramas, cronogramas y recursos reutilizables para documentos de gestión.</p><button class="btn alt" type="button" onclick="go(\'aihub\')">Abrir biblioteca</button>';
    grid.appendChild(card);
  }

  function init(){
    injectStyles();
    installHub();
    installSessionActions();
    enhanceDirector();
  }

  window.DocenteDigitalAI={
    openChatGPTFree,
    copyGeneralPrompt,
    renderLibrary,
    selectResource,
    showSessionSuggestions,
    newPremiumImage,
    bestResources,
    catalog:CATALOG,
    policy:POLICY
  };

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();