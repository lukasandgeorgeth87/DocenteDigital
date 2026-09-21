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
    },
    {
      id:'WEB-CYT-GERMINACION-001',
      title:'Etapas secuenciales de germinación de una semilla de frijol',
      level:'Primaria',
      area:'Ciencia y Tecnología',
      topic:'germinación semilla frijol raíz tallo crecimiento planta',
      kind:'Secuencia visual',
      quality:'A',
      source:'Wikimedia Commons',
      author:'HudsonFlagg',
      license:'CC0 1.0',
      sourcePage:'https://commons.wikimedia.org/wiki/File:Sequential_Steps_of_Bean_Seedling_Germination.svg',
      previewUrl:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Sequential_Steps_of_Bean_Seedling_Germination.svg?width=900',
      reusable:true,
      webLicensed:true
    },
    {
      id:'WEB-CYT-RECICLAJE-002',
      title:'Contenedor de reciclaje para trabajar clasificación de residuos',
      level:'Secundaria',
      area:'Ciencia y Tecnología',
      topic:'reciclaje residuos sólidos clasificación contenedor ambiente',
      kind:'Fotografía educativa',
      quality:'A',
      source:'Wikimedia Commons',
      author:'Jose M. Zarate Diaz',
      license:'CC0 1.0',
      sourcePage:'https://commons.wikimedia.org/wiki/File:USC_Recycling_Bin.png',
      previewUrl:'https://commons.wikimedia.org/wiki/Special:Redirect/file/USC_Recycling_Bin.png?width=650',
      reusable:true,
      webLicensed:true
    },
    {
      id:'WEB-CYT-PLANTAS-003',
      title:'Crecimiento de plantas — fotografía de referencia',
      level:'Primaria',
      area:'Ciencia y Tecnología',
      topic:'plantas crecimiento observación naturaleza',
      kind:'Fotografía educativa',
      quality:'A',
      source:'Wikimedia Commons',
      author:'Bhuvaneshwari kandhasamy',
      license:'CC BY-SA 4.0',
      sourcePage:'https://commons.wikimedia.org/wiki/File:Plant_growth.jpg',
      previewUrl:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Plant_growth.jpg?width=800',
      reusable:true,
      webLicensed:true
    },
    {
      id:'WEB-INI-MAT-FORMAS-004',
      title:'Formas básicas para clasificación, seriación y reconocimiento',
      level:'Inicial',
      area:'Matemática',
      topic:'formas figuras geométricas círculo cuadrado triángulo clasificación inicial',
      kind:'Lámina visual',
      quality:'A',
      source:'Wikimedia Commons',
      author:'RaviC',
      license:'Dominio público',
      sourcePage:'https://commons.wikimedia.org/wiki/File:BasicShapes_0001.svg',
      previewUrl:'https://commons.wikimedia.org/wiki/Special:Redirect/file/BasicShapes_0001.svg?width=650',
      reusable:true,
      webLicensed:true
    },
    {
      id:'WEB-PRI-CYT-AGUA-005',
      title:'Ciclo del agua — diagrama visual',
      level:'Primaria',
      area:'Ciencia y Tecnología',
      topic:'agua ciclo evaporación condensación precipitación naturaleza',
      kind:'Diagrama',
      quality:'A',
      source:'Wikimedia Commons',
      author:'j4p4n / NASA Precipitation Measurement Missions',
      license:'Dominio público / NASA',
      sourcePage:'https://commons.wikimedia.org/wiki/File:Water_cycle.svg',
      previewUrl:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Water_cycle.svg?width=900',
      reusable:true,
      webLicensed:true
    },
    {
      id:'WEB-SEC-CYT-CELULA-006',
      title:'Esquema simple de una célula',
      level:'Secundaria',
      area:'Ciencia y Tecnología',
      topic:'célula biología organelos citoplasma núcleo',
      kind:'Diagrama científico',
      quality:'A',
      source:'Wikimedia Commons',
      author:'Maxmath12',
      license:'CC0 1.0',
      sourcePage:'https://commons.wikimedia.org/wiki/File:Cell_diagram.svg',
      previewUrl:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Cell_diagram.svg?width=700',
      reusable:true,
      webLicensed:true
    },
    {
      id:'WEB-DIR-IE-007',
      title:'Edificio escolar — recurso institucional de referencia',
      level:'Director',
      area:'Gestión institucional',
      topic:'escuela institución educativa portada gestión director',
      kind:'Fotografía institucional',
      quality:'A',
      source:'Wikimedia Commons',
      author:'YMR Musslim',
      license:'CC0 1.0',
      sourcePage:'https://commons.wikimedia.org/wiki/File:Face_of_the_School_building.jpg',
      previewUrl:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Face_of_the_School_building.jpg?width=800',
      reusable:true,
      webLicensed:true
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
      '4. Probar primero en ChatGPT Gratis con la cuenta del docente',
      '5. Usar crédito premium solo si todavía necesita una imagen nueva'
    ]
  };

  function appState(){
    try { return JSON.parse(localStorage.getItem('docenteDigitalPrototype') || '{}'); }
    catch { return {}; }
  }

  function routeStats(){
    try{
      return Object.assign({libraryUses:0,freeChatHandoffs:0,premiumRequests:0},JSON.parse(localStorage.getItem('docenteDigitalRouteStats')||'{}'));
    }catch{return {libraryUses:0,freeChatHandoffs:0,premiumRequests:0};}
  }

  function bumpRoute(key){
    const s=routeStats();
    s[key]=(s[key]||0)+1;
    localStorage.setItem('docenteDigitalRouteStats',JSON.stringify(s));
    renderRouteStats();
  }

  function usageStats(){
    try{return JSON.parse(localStorage.getItem('docenteDigitalResourceUsage')||'{}');}
    catch{return {};}
  }

  function recordResourceUse(id){
    const s=usageStats();
    s[id]=(s[id]||0)+1;
    localStorage.setItem('docenteDigitalResourceUsage',JSON.stringify(s));
  }

  function renderRouteStats(){
    const el=document.getElementById('ddRouteStats');
    if(!el)return;
    const s=routeStats();
    el.innerHTML=`
      <div><strong>${s.libraryUses}</strong><span>reutilizaciones de biblioteca</span></div>
      <div><strong>${s.freeChatHandoffs}</strong><span>derivaciones a ChatGPT Gratis</span></div>
      <div><strong>${s.premiumRequests}</strong><span>solicitudes premium</span></div>`;
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
      s.level, s.ieType, ...(s.grades || []),
      last.title, last.area, last.brief, last.unitTitle
    ].filter(Boolean).join(' ');
  }

  function bestResources(limit=6){
    const ctx = currentContextText();
    const usage=usageStats();
    return CATALOG
      .map(r => ({...r, score:scoreResource(r, ctx)+(Math.min(usage[r.id]||0,10)*0.01)}))
      .filter(r => r.score >= 0.20 && r.previewUrl)
      .sort((a,b) => b.score - a.score)
      .slice(0, limit);
  }

  function openChatGPTFree(track=true,sameTab=false){
    if(track)bumpRoute('freeChatHandoffs');
    if(sameTab)window.location.assign('https://chatgpt.com/');
    else window.open('https://chatgpt.com/', '_blank', 'noopener,noreferrer');
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

  function imagePrompt(){
    const s=appState();
    const last=s.lastSession||{};
    const level=s.level||'nivel educativo';
    const grades=(s.grades||[]).join(', ')||'grado correspondiente';
    const area=last.area||(s.areas||[])[0]||'área correspondiente';
    const title=last.title||'el tema de la sesión';
    return [
      'Crea una imagen educativa clara y de buena calidad para una ficha escolar.',
      'Tema: '+title+'.',
      'Nivel: '+level+'. Grado(s): '+grades+'. Área: '+area+'.',
      'Debe ser pedagógicamente útil, visualmente limpia, sin exceso de elementos y adecuada para impresión en A4.',
      level==='Inicial'
        ? 'Si se trata de una ficha de Inicial, usa las fichas de referencia solo como inspiración visual, no como plantilla obligatoria. Varía composición, tipo de actividad, personajes, distribución y recursos gráficos según el propósito pedagógico, la edad y la consigna.'
        : 'Adapta la complejidad visual y cognitiva al nivel y al grado; no repitas una misma plantilla para todos los materiales.',
      'Evita texto largo dentro de la imagen; deja el texto principal fuera cuando sea posible.',
      'No incluyas datos personales de estudiantes ni información privada de la institución.'
    ].join(' ');
  }

  function titleAssistantContext(){
    const s=appState();
    const brief=(document.getElementById('unitSituation')?.value||'').trim();
    const type=(document.getElementById('unitType')?.value||'Proyecto de aprendizaje').trim();
    const current=(document.getElementById('unitTitle')?.value||'').trim();
    const level=s.level||'Primaria';
    const grades=(s.grades||[]).join(', ')||'grados/edades configurados';
    const topic=current||brief||'una experiencia significativa del contexto';
    return {s,brief,type,current,level,grades,topic};
  }

  function titlePrompt(){
    const {brief,type,current,level,grades,topic}=titleAssistantContext();
    return [
      'Actúa como especialista en Educación '+level+' y planificación curricular del MINEDU Perú.',
      'Genera 5 títulos breves, motivadores, potentes, naturales y pedagógicamente coherentes para un '+type+'.',
      'Tema o intención principal: '+topic+'.',
      'Grados/edades: '+grades+'.',
      brief?'Contexto aportado por el docente: '+brief+'.':'El docente todavía no escribió un contexto; formula títulos prudentes a partir del tema sin inventar hechos locales.',
      current?'Título inicial del docente: '+current+'.':'No existe título definitivo todavía.',
      'Evita títulos demasiado largos, repetitivos o burocráticos. Evita frases genéricas como "para construir una respuesta con sentido".',
      'El título debe despertar curiosidad, anticipar una experiencia de aprendizaje y sonar como algo que un buen docente realmente pondría en su unidad o proyecto.',
      'Usa lenguaje adecuado al nivel educativo y entrega únicamente 5 títulos.'
    ].join('\n');
  }

  function localTitleSuggestions(){
    const {brief,type,current,level,topic}=titleAssistantContext();
    const seed=brief||current||topic;
    let options=[];
    try{
      if(typeof window.ddCreativeTitleOptions==='function')options=window.ddCreativeTitleOptions(seed,type)||[];
    }catch(_e){}
    if(!options.length){
      try{
        if(typeof window.proposeUnitTitleOptions==='function')options=window.proposeUnitTitleOptions(seed,type)||[];
      }catch(_e){}
    }
    const low=String(seed).toLowerCase();
    if(/basura|residuo|recicl|contamin/.test(low)){
      if(level==='Inicial')options=[
        'Cada residuo en su lugar: cuidamos nuestros espacios',
        '¿Dónde va la basura? Descubrimos y aprendemos a cuidar',
        'Pequeñas acciones para mantener limpio nuestro entorno',
        'Cuidamos juntos el lugar donde aprendemos',
        'Jugamos y aprendemos a ordenar nuestros residuos'
      ];
      else if(level==='Secundaria')options=[
        'Residuos y convivencia: analizamos cómo nuestras decisiones afectan los espacios comunes',
        'Del problema a la solución: comprendemos la gestión responsable de los residuos',
        'Basura en el piso: analizamos causas y proponemos soluciones sostenibles',
        'Espacios limpios, decisiones responsables: investigamos y proponemos mejoras',
        'Del residuo a la acción: comprendemos, decidimos y transformamos'
      ];
      else options=[
        'Cuidamos nuestros espacios: aprendemos a manejar responsablemente los residuos',
        'Basura en el piso: observamos, pensamos y proponemos soluciones',
        'Menos residuos, más cuidado: aprendemos a convivir en un ambiente limpio',
        'Guardianes de nuestros espacios: reducimos, reutilizamos y cuidamos',
        'Cada residuo en su lugar: actuamos por una escuela limpia'
      ];
    }else if(/animal/.test(low)){
      if(level==='Inicial')options=[
        'Pequeños exploradores del mundo animal',
        '¿Quién vive, salta, vuela o se arrastra?',
        'Descubrimos a los animales que nos rodean',
        'Pelos, plumas y muchas sorpresas',
        'Conocemos y cuidamos a nuestros amigos animales'
      ];
      else if(level==='Secundaria')options=[
        'Biodiversidad animal: evidencias para comprender la vida',
        'Adaptarse para sobrevivir: investigamos el mundo animal',
        'Animales y ambiente: relaciones que sostienen la vida',
        'Fauna de nuestro entorno: observar, explicar y conservar',
        'Del comportamiento a la adaptación: comprendemos la diversidad animal'
      ];
      else options=[
        'Detectives de la naturaleza: pelos, plumas y escamas',
        'Animales sorprendentes: descubrimos cómo viven y se adaptan',
        'Huellas de vida: investigamos a los animales de nuestro entorno',
        '¿Cómo viven los animales? Observamos, comparamos y explicamos',
        'Entre pelos, plumas y escamas: exploramos el mundo animal'
      ];
    }
    return [...new Set(options.map(x=>String(x||'').replace(/\s+/g,' ').trim()).filter(Boolean))].slice(0,5);
  }

  function applyAssistantTitle(title){
    const input=document.getElementById('unitTitle');
    if(input){
      input.value=title;
      input.dataset.autoTitle='false';
      input.dispatchEvent(new Event('input',{bubbles:true}));
    }
    document.querySelectorAll('.dd-side-title-option').forEach(b=>b.classList.toggle('selected',b.dataset.title===title));
  }

  function refreshTitleSideAssistant(){
    const panel=document.getElementById('ddTitleSidePanel');
    if(!panel)return;
    const {type,level,grades,topic}=titleAssistantContext();
    const prompt=titlePrompt();
    const suggestions=localTitleSuggestions();
    const meta=panel.querySelector('[data-dd-title-meta]');
    const promptBox=panel.querySelector('[data-dd-title-prompt]');
    const list=panel.querySelector('[data-dd-title-list]');
    if(meta)meta.innerHTML='<b>'+esc(level)+'</b> · '+esc(type)+' · '+esc(grades)+'<br><span>Tema: '+esc(topic)+'</span>';
    if(promptBox)promptBox.value=prompt;
    if(list)list.innerHTML=suggestions.map(t=>'<button type="button" class="dd-side-title-option" data-title="'+esc(t)+'"><b>'+esc(t)+'</b><span>Usar este título</span></button>').join('');
    list?.querySelectorAll('.dd-side-title-option').forEach(b=>b.onclick=()=>applyAssistantTitle(b.dataset.title));
  }

  function closeTitleAssistant(){
    document.getElementById('ddTitleSidePanel')?.classList.remove('open');
    document.getElementById('ddTitleSideShade')?.remove();
  }

  async function openTitleAssistant(){
    let panel=document.getElementById('ddTitleSidePanel');
    if(!panel){
      panel=document.createElement('aside');
      panel.id='ddTitleSidePanel';
      panel.className='dd-title-side-panel';
      panel.innerHTML=`
        <div class="dd-side-head">
          <div><span class="pill">Asistente de títulos</span><h2>Mejora el título sin salir de DocenteDigital</h2></div>
          <button class="dd-side-close" type="button" aria-label="Cerrar">×</button>
        </div>
        <div class="dd-side-meta" data-dd-title-meta></div>
        <p class="dd-small">La instrucción se completa automáticamente como si consultaras a un especialista del nivel seleccionado.</p>
        <textarea class="dd-chat-prompt" data-dd-title-prompt readonly></textarea>
        <div class="dd-side-actions">
          <button type="button" class="btn ghost" data-dd-copy-title-prompt>📋 Copiar instrucción</button>
          <button type="button" class="btn alt" data-dd-refresh-title>↻ Otras propuestas</button>
        </div>
        <h3>Propuestas potentes</h3>
        <div class="dd-side-title-list" data-dd-title-list></div>
        <div class="notice topgap">Este panel funciona dentro de DocenteDigital. No abre otra pestaña. Cuando conectemos la API de OpenAI, este mismo panel podrá conversar con el modelo directamente.</div>`;
      document.body.appendChild(panel);
      panel.querySelector('.dd-side-close').onclick=closeTitleAssistant;
      panel.querySelector('[data-dd-copy-title-prompt]').onclick=async()=>{
        try{await navigator.clipboard.writeText(titlePrompt());}catch(_e){promptFallback(titlePrompt());}
      };
      panel.querySelector('[data-dd-refresh-title]').onclick=refreshTitleSideAssistant;
    }
    let shade=document.getElementById('ddTitleSideShade');
    if(!shade){
      shade=document.createElement('div');
      shade.id='ddTitleSideShade';
      shade.className='dd-title-side-shade';
      shade.onclick=closeTitleAssistant;
      document.body.appendChild(shade);
    }
    refreshTitleSideAssistant();
    requestAnimationFrame(()=>panel.classList.add('open'));
  }

  async function improveTitleWithChatGPTFree(){
    return openTitleAssistant();
  }

  async function tryChatGPTFreeForImage(){
    const prompt=imagePrompt();
    try{
      await navigator.clipboard.writeText(prompt);
      openChatGPTFree(true);
      setTimeout(()=>alert('Copiamos una indicación para crear la imagen. Pégala en ChatGPT Gratis. Si el límite gratuito de tu cuenta no está disponible, puedes volver y usar un crédito premium.'),250);
    }catch{
      promptFallback(prompt);
      openChatGPTFree(true);
    }
  }

  function closeCreditGate(){
    document.getElementById('ddCreditGate')?.remove();
  }

  function openCreditGate(){
    closeCreditGate();
    const wrap=document.createElement('div');
    wrap.id='ddCreditGate';
    wrap.className='dd-modal-backdrop';
    wrap.innerHTML=`
      <div class="dd-modal" role="dialog" aria-modal="true" aria-labelledby="ddCreditTitle">
        <button class="dd-modal-x" type="button" aria-label="Cerrar" onclick="window.DocenteDigitalAI.closeCreditGate()">×</button>
        <span class="pill">Antes de gastar</span>
        <h2 id="ddCreditTitle">¿Necesitas una imagen nueva?</h2>
        <p>DocenteDigital intenta ahorrar en este orden: biblioteca, ChatGPT Gratis y recién después un crédito premium.</p>
        <div class="dd-save-route">
          <div><b>1</b><span>Biblioteca incluida</span></div>
          <div><b>2</b><span>ChatGPT Gratis</span></div>
          <div><b>3</b><span>Crédito premium</span></div>
        </div>
        <div class="dd-modal-actions">
          <button class="btn alt" type="button" onclick="window.DocenteDigitalAI.closeCreditGate();window.DocenteDigitalAI.showSessionSuggestions()">📚 Buscar en biblioteca</button>
          <button class="btn" type="button" onclick="window.DocenteDigitalAI.tryChatGPTFreeForImage()">💬 Probar ChatGPT Gratis</button>
          <button class="btn amber" type="button" onclick="window.DocenteDigitalAI.confirmPremiumImage()">✨ Usar 1 crédito</button>
        </div>
        <p class="dd-small">El uso de ChatGPT Gratis depende de los límites disponibles en la cuenta del propio docente y no consume la API de DocenteDigital.</p>
      </div>`;
    document.body.appendChild(wrap);
  }

  function confirmPremiumImage(){
    bumpRoute('premiumRequests');
    closeCreditGate();
    alert('Solicitud premium registrada. El cobro real y la generación se activarán únicamente cuando el contador de créditos y la API estén conectados.');
  }

  function renderResourceCards(items){
    if(!items.length) return '<div class="dd-empty">No encontramos recursos con esos filtros. Prueba ChatGPT Gratis antes de usar un crédito premium.</div>';
    return items.map(r => {
      const ready=Boolean(r.previewUrl);
      const preview=ready
        ? `<a class="dd-resource-preview image" href="${esc(r.previewUrl)}" target="_blank" rel="noopener noreferrer" title="Abrir imagen en tamaño mayor"><img loading="lazy" src="${esc(r.previewUrl)}" alt="${esc(r.title)}" onerror="this.closest('.dd-resource-preview').classList.add('broken');this.remove()"></a>`
        : `<div class="dd-resource-preview pending"><span>Miniatura pendiente</span></div>`;
      const sourceLink=r.sourcePage
        ? ` <a class="dd-source-link" href="${esc(r.sourcePage)}" target="_blank" rel="noopener noreferrer">ver fuente</a>`
        : '';
      const imageLink=ready
        ? `<a class="btn ghost dd-image-link" href="${esc(r.previewUrl)}" target="_blank" rel="noopener noreferrer">🔎 Abrir imagen</a>`
        : '';
      const used=usageStats()[r.id]||0;
      const author=r.author ? `<br><b>Autor:</b> ${esc(r.author)}` : '';
      return `
      <article class="dd-resource ${ready?'':'not-ready'}">
        ${preview}
        <div class="dd-resource-body">
          <div class="dd-badges">
            <span class="dd-badge">${esc(r.level)}</span>
            <span class="dd-badge green">Calidad ${esc(r.quality)}</span>
            ${r.webLicensed?'<span class="dd-badge gold">Web con licencia</span>':'<span class="dd-badge">Biblioteca propia</span>'}
          </div>
          <h3>${esc(r.title)}</h3>
          <p><b>Área:</b> ${esc(r.area)} · <b>Tipo:</b> ${esc(r.kind)}</p>
          <p class="dd-small"><b>Origen:</b> ${esc(r.source)}${sourceLink}${author}<br><b>Uso:</b> reutilizable · <b>Licencia:</b> ${esc(r.license)}${used?'<br><b>Reutilizado:</b> '+used+' vez/veces':''}</p>
          <div class="dd-inline-actions">
            ${ready?`<button class="btn alt" type="button" onclick="window.DocenteDigitalAI.selectResource('${esc(r.id)}')">Usar como referencia</button>`:'<button class="btn alt" type="button" disabled title="Se habilitará cuando la miniatura real esté registrada">Referencia no disponible</button>'}
            ${imageLink}
          </div>
        </div>
      </article>`;
    }).join('');
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
    const s=appState();
    const selected={...r,selectedAt:new Date().toISOString(),selectedForSessionId:s.lastSession?.id||null};
    localStorage.setItem('docenteDigitalSelectedResource', JSON.stringify(selected));
    recordResourceUse(id);
    bumpRoute('libraryUses');
    applySelectedResourceToSession(selected);
  }

  function selectedResource(){
    try{return JSON.parse(localStorage.getItem('docenteDigitalSelectedResource')||'null');}
    catch{return null;}
  }

  function usageMoment(r){
    const k=normalize((r.kind||'')+' '+(r.title||''));
    if(k.includes('problematizacion'))return 'Inicio · problematización o conflicto cognitivo';
    if(k.includes('ficha'))return 'Desarrollo · ficha de trabajo';
    if(k.includes('secuencia'))return 'Desarrollo · observación y análisis de secuencia';
    if(k.includes('conceptual')||k.includes('diagrama'))return 'Formalización / construcción del aprendizaje';
    if(k.includes('infografia'))return 'Desarrollo o transferencia · análisis de información';
    if(k.includes('cartel'))return 'Ambientación, producto o recurso de aula';
    return 'Recurso visual de apoyo';
  }

  function resourceVisualHtml(r){
    if(!r)return '';
    const image=r.previewUrl
      ? `<a href="${esc(r.previewUrl)}" target="_blank" rel="noopener noreferrer"><img src="${esc(r.previewUrl)}" alt="${esc(r.title)}" loading="lazy" style="max-width:100%;max-height:320px;object-fit:contain;border-radius:12px;border:1px solid #dbe7ef"></a>`
      : '';
    const source=r.sourcePage
      ? `<a href="${esc(r.sourcePage)}" target="_blank" rel="noopener noreferrer">Fuente y licencia</a>`
      : esc(r.source||'Biblioteca DocenteDigital');
    return `<div class="dd-selected-resource">
      <div>${image}</div>
      <div>
        <span class="pill">Recurso visual seleccionado</span>
        <h3>${esc(r.title)}</h3>
        <p><b>Momento sugerido:</b> ${esc(usageMoment(r))}</p>
        <p class="dd-small"><b>Crédito:</b> ${r.author?esc(r.author)+' · ':''}${source} · ${esc(r.license||'')}</p>
        <div class="dd-inline-actions">
          ${r.previewUrl?`<a class="btn ghost" href="${esc(r.previewUrl)}" target="_blank" rel="noopener noreferrer">🔎 Abrir imagen</a>`:''}
          <button class="btn ghost" type="button" onclick="window.DocenteDigitalAI.clearSelectedResource()">Quitar</button>
          <button class="btn alt" type="button" onclick="go('aihub')">Cambiar recurso</button>
        </div>
      </div>
    </div>`;
  }

  function applySelectedResourceToSession(resource=selectedResource()){
    const output=document.getElementById('sessionOutput');
    if(!output||!resource)return;
    let slot=document.getElementById('ddSelectedResourcePanel');
    if(!slot){
      slot=document.createElement('div');
      slot.id='ddSelectedResourcePanel';
      slot.className='dd-panel';
      const doc=document.getElementById('sessionDocument');
      if(doc&&doc.parentNode)doc.parentNode.insertBefore(slot,doc.nextSibling);
      else output.appendChild(slot);
    }
    slot.innerHTML=resourceVisualHtml(resource);
    slot.scrollIntoView({behavior:'smooth',block:'nearest'});
  }

  function clearSelectedResource(){
    localStorage.removeItem('docenteDigitalSelectedResource');
    document.getElementById('ddSelectedResourcePanel')?.remove();
  }

  function showSessionSuggestions(){
    const items=bestResources(5);
    const box=document.getElementById('ddSessionSuggestions');
    if(!box) return;
    const content=items.length
      ? `<div class="dd-resource-grid">${renderResourceCards(items)}</div>`
      : `<div class="dd-empty">
          <b>No encontramos una coincidencia suficientemente buena.</b>
          <p>No mostraremos una imagen irrelevante solo por ahorrar. Puedes buscar manualmente, probar ChatGPT Gratis o usar un crédito premium.</p>
          <div class="dd-inline-actions">
            <button class="btn ghost" type="button" onclick="go('aihub')">📚 Buscar manualmente</button>
            <button class="btn" type="button" onclick="window.DocenteDigitalAI.tryChatGPTFreeForImage()">💬 Probar ChatGPT Gratis</button>
            <button class="btn amber" type="button" onclick="window.DocenteDigitalAI.newPremiumImage()">✨ Imagen nueva</button>
          </div>
        </div>`;
    box.innerHTML = `
      <div class="dd-panel">
        <div class="dd-panel-head">
          <div><span class="pill">Biblioteca primero</span><h3>Imágenes sugeridas para esta sesión</h3></div>
          <button class="btn ghost" type="button" onclick="go('aihub')">Ver biblioteca</button>
        </div>
        <p class="sub">Solo se muestran recursos con coincidencia suficiente de nivel, área y tema.</p>
        ${content}
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
        <button class="btn" type="button" onclick="window.DocenteDigitalAI.tryChatGPTFreeForImage()">💬 Probar ChatGPT Gratis</button>
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
    if(!output.classList.contains('hidden'))applySelectedResourceToSession();
  }

  function newPremiumImage(){
    openCreditGate();
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
      .dd-resource-preview{display:grid;place-items:center;border-radius:13px;background:linear-gradient(135deg,#eaf7f5,#eef4ff);min-height:90px;font-size:36px;overflow:hidden}
      .dd-resource-preview.image{background:#f3f6f8;text-decoration:none}
      .dd-resource-preview.pending{background:#f5f6f7;color:#7b858d;font-size:12px;text-align:center;padding:8px}
      .dd-resource-preview.broken{background:#fff1f1}
      .dd-resource.not-ready{opacity:.72}
      .dd-image-link{text-decoration:none;display:inline-flex;align-items:center}
      .dd-resource-preview.image img{width:100%;height:100%;min-height:90px;max-height:128px;object-fit:cover;display:block}
      .dd-source-link{color:var(--p2);font-weight:800;text-decoration:none}
      .dd-source-link:hover{text-decoration:underline}
      .dd-resource-body h3{margin:6px 0 4px;font-size:17px}
      .dd-resource-body p{margin:4px 0;color:var(--muted)}
      .dd-badges{display:flex;flex-wrap:wrap;gap:5px}
      .dd-badge{font-size:11px;font-weight:900;border-radius:999px;padding:4px 7px;background:#eef4ff;color:#315a94}
      .dd-badge.green{background:#eaf8ef;color:#235f38}
      .dd-badge.gold{background:#fff5d9;color:#7a5b00}
      .dd-small{font-size:12px}
      .dd-empty{padding:18px;border:1px dashed #bfd0da;border-radius:14px;color:var(--muted)}
      .dd-policy{counter-reset:step;display:grid;gap:8px;margin-top:10px}
      .dd-policy div{background:#f7fafc;border:1px solid var(--line);border-radius:12px;padding:9px 11px}
      .dd-cost{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:10px}
      .dd-cost strong{display:block;font-size:26px;color:var(--p)}
      .dd-image-actions{margin-top:14px}
      .dd-selected-resource{display:grid;grid-template-columns:minmax(180px,38%) 1fr;gap:16px;align-items:center}
      .dd-selected-resource h3{margin:8px 0}
      .dd-resource-large-icon{min-height:160px;display:grid;place-items:center;font-size:58px;background:linear-gradient(135deg,#eaf7f5,#eef4ff);border-radius:14px}
      .dd-route-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:12px}
      .dd-route-stats div{background:#f7fafc;border:1px solid var(--line);border-radius:14px;padding:12px}
      .dd-route-stats strong{font-size:26px;color:var(--p);display:block}
      .dd-route-stats span{font-size:12px;color:var(--muted)}
      .dd-modal-backdrop{position:fixed;inset:0;z-index:999;background:rgba(11,31,48,.55);display:grid;place-items:center;padding:16px}
      .dd-modal{position:relative;width:min(620px,100%);background:#fff;border-radius:20px;border:1px solid var(--line);box-shadow:0 24px 70px rgba(0,0,0,.25);padding:22px}
      .dd-modal h2{margin:8px 0}
      .dd-modal-x{position:absolute;right:12px;top:10px;border:0;background:transparent;font-size:28px;color:var(--muted)}
      .dd-modal-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}
      .dd-chat-helper{max-width:720px}
      .dd-chat-prompt{width:100%;min-height:180px;resize:vertical;border:1px solid var(--line);border-radius:12px;padding:11px;font:13px/1.45 ui-monospace,SFMono-Regular,Consolas,monospace;background:#f8fafb}
      .dd-title-side-shade{position:fixed;inset:0;background:rgba(10,30,45,.18);z-index:997}
      .dd-title-side-panel{position:fixed;top:0;right:0;z-index:998;width:min(430px,92vw);height:100vh;background:#fff;border-left:1px solid var(--line);box-shadow:-18px 0 46px rgba(24,46,62,.18);padding:18px;overflow:auto;transform:translateX(104%);transition:transform .22s ease}
      .dd-title-side-panel.open{transform:translateX(0)}
      .dd-side-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}
      .dd-side-head h2{font-size:21px;margin:7px 0 4px}
      .dd-side-close{border:0;background:#f3f6f7;border-radius:50%;width:36px;height:36px;font-size:24px;cursor:pointer}
      .dd-side-meta{margin:10px 0;padding:10px 12px;background:#eef8f4;border:1px solid #d4e8de;border-radius:12px;line-height:1.45}
      .dd-side-actions{display:flex;gap:8px;flex-wrap:wrap;margin:9px 0 14px}
      .dd-side-title-list{display:grid;gap:8px}
      .dd-side-title-option{display:flex;flex-direction:column;align-items:flex-start;width:100%;text-align:left;border:1px solid var(--line);background:#fff;border-radius:13px;padding:11px 12px;cursor:pointer}
      .dd-side-title-option:hover,.dd-side-title-option.selected{border-color:var(--p);background:#eef8f4}
      .dd-side-title-option span{font-size:11px;color:var(--muted);margin-top:4px}
      .dd-save-route{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:14px 0}
      .dd-save-route div{display:flex;align-items:center;gap:8px;background:#f7fafc;border:1px solid var(--line);border-radius:13px;padding:10px}
      .dd-save-route b{width:28px;height:28px;border-radius:50%;display:grid;place-items:center;background:#eaf7f5;color:var(--p)}
      @media(max-width:850px){
        .dd-two,.dd-resource-grid,.dd-library-controls,.dd-cost,.dd-save-route,.dd-route-stats,.dd-selected-resource{grid-template-columns:1fr}
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
            <option>Inicial</option><option>Primaria</option><option>Secundaria</option><option>Director</option>
          </select>
          <select id="ddLibArea" onchange="window.DocenteDigitalAI.renderLibrary()">
            <option value="">Todas las áreas</option>
            <option>Comunicación</option><option>Matemática</option><option>Ciencia y Tecnología</option><option>Personal Social</option><option>Ciencias Sociales</option><option>Gestión institucional</option>
          </select>
          <input id="ddLibQuery" placeholder="Buscar: germinación, residuos, biohuerto..." oninput="window.DocenteDigitalAI.renderLibrary()">
        </div>
        <div id="ddLibraryResults" class="dd-resource-grid"></div>
      </div>

`;
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
      card.innerHTML='<span>🤖</span><h2>IA y Biblioteca</h2><p>Encuentra recursos, reutiliza imágenes y recibe ayuda para crear materiales.</p>';
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
    improveTitleWithChatGPTFree,
    openTitleAssistant,
    closeTitleAssistant,
    refreshTitleSideAssistant,
    titlePrompt,
    renderLibrary,
    selectResource,
    selectedResource,
    applySelectedResourceToSession,
    clearSelectedResource,
    showSessionSuggestions,
    tryChatGPTFreeForImage,
    openCreditGate,
    closeCreditGate,
    confirmPremiumImage,
    newPremiumImage,
    bestResources,
    catalog:CATALOG,
    policy:POLICY
  };

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();