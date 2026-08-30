/* DocenteDigital – flujo de elección según Prompt Maestro: 2 situaciones + 3 productos */
(function(){
  const E=v=>escapeHtml(v);
  const baseCreate=window.createUnitDemo;
  state.pendingUnitChoice=state.pendingUnitChoice||null;
  save();

  function dataFor(brief){
    const raw=(brief||'').trim();
    const s=raw.toLowerCase();
    const grades=(state.grades||[]).join(', ')||'los grados seleccionados';
    const place=/ccotataqui|cotataqui/.test(s)?'Ccotataqui':'la comunidad';

    if(/siembr|tarpuy|papa|añu|oca|olluco/.test(s)) return {
      situations:[
        {
          key:'A', title:'Opción A · Formal / técnica',
          text:`En ${place}, la época de siembra constituye una práctica familiar y comunal en la que se movilizan saberes sobre la preparación del terreno, la selección y cuidado de semillas, el uso de abonos, la organización del trabajo y el respeto a la Pachamama. Los estudiantes de ${grades} participan u observan estas actividades; sin embargo, no siempre comprenden por qué se realizan determinados procedimientos ni cómo los conocimientos de sus familias se relacionan con los aprendizajes escolares. Esta situación plantea la necesidad de recuperar, profundizar y comparar saberes locales con otros conocimientos para tomar decisiones y comunicar lo aprendido. Reto: ¿Cómo podemos investigar y explicar el proceso de siembra de nuestra comunidad, valorar los saberes de nuestras familias y proponer formas de compartirlos y cuidarlos para las nuevas generaciones?`
        },
        {
          key:'B', title:'Opción B · Narrativa / vivencial',
          text:`Una mañana, mientras las familias de ${place} se preparaban para el Hatun Tarpuy, los estudiantes observaron semillas de papa, añu y oca, herramientas, abonos y distintas maneras de preparar la chacra. Al conversar, descubrieron que cada familia conocía señales, costumbres y procedimientos aprendidos de sus mayores, pero que varias de esas explicaciones no eran conocidas por todos los niños. Entonces surgió una inquietud: si estos saberes son importantes para nuestra alimentación y cultura, ¿cómo podemos conocerlos mejor y evitar que se pierdan? Reto: ¿Cómo podemos convertirnos en investigadores de la siembra, dialogar con nuestras familias y yachaq, explicar lo que descubrimos y compartirlo con nuestra comunidad?`
        }
      ],
      products:[
        {key:'1',title:'Museo vivo del Hatun Tarpuy',text:'Muestra comunitaria interactiva sobre la siembra con estaciones de saberes familiares, semillas y cultivos, textos y testimonios, problemas matemáticos contextualizados, registros de indagación científica, producciones artísticas y exposición oral de los estudiantes.'},
        {key:'2',title:'Gran libro de saberes de la siembra',text:'Libro colectivo ilustrado que integra entrevistas a familias o yachaq, textos por grado, registros de cultivos, cálculos y gráficos, explicaciones científicas, creaciones artísticas y propuestas para conservar los saberes agrícolas de la comunidad.'},
        {key:'3',title:'Feria escolar “De la chacra a la escuela”',text:'Feria de aprendizaje con estaciones por áreas donde los estudiantes muestran semillas y procesos de siembra, resuelven y explican situaciones matemáticas, presentan indagaciones, textos, producciones artísticas y compromisos para valorar la agricultura local.'}
      ]
    };

    if(/pachamama|madre tierra/.test(s)) return {
      situations:[
        {key:'A',title:'Opción A · Formal / técnica',text:`En ${place}, las familias mantienen prácticas de agradecimiento y respeto a la Pachamama que expresan una relación cultural con la naturaleza. Los estudiantes de ${grades} conocen algunos elementos de esta tradición, pero requieren comprender sus significados, reconocer los saberes de sus familias y analizar cómo estas prácticas se relacionan con el cuidado actual del ambiente. Se plantea una oportunidad para profundizar en el saber local, compararlo con otros conocimientos y construir compromisos pertinentes. Reto: ¿Cómo podemos comprender y valorar la tradición de agradecimiento a la Pachamama y convertir ese aprendizaje en acciones concretas para cuidar nuestra Madre Tierra y fortalecer nuestra identidad cultural?`},
        {key:'B',title:'Opción B · Narrativa / vivencial',text:`En ${place}, los estudiantes escucharon que pronto varias familias prepararían sus ofrendas de agradecimiento a la Pachamama. Algunos sabían el significado de ciertos elementos y otros solo habían observado la ceremonia sin comprender por qué se realizaba. Durante una conversación surgieron opiniones distintas sobre cómo agradecer a la tierra y cómo cuidarla frente a los problemas ambientales de hoy. Reto: ¿Cómo podemos descubrir qué enseñan nuestras familias sobre la Pachamama, comprender el sentido de esta tradición y demostrar con acciones que realmente cuidamos la tierra que nos da vida?`}
      ],
      products:[
        {key:'1',title:'Feria intercultural “Agradecemos cuidando”',text:'Feria con testimonios, afiches, maquetas o representaciones culturales, producciones escritas, situaciones matemáticas, explicaciones científicas y compromisos ambientales presentados a la comunidad educativa.'},
        {key:'2',title:'Gran Libro Cartonero de la Pachamama',text:'Libro colectivo por áreas que integra relatos y entrevistas, textos y compromisos, registros matemáticos, indagaciones ambientales, producciones artísticas y una presentación pública de cierre.'},
        {key:'3',title:'Ruta vivencial de saberes y compromisos',text:'Recorrido por estaciones preparado por los estudiantes para explicar elementos de la tradición, contrastar saberes, presentar evidencias de las áreas y culminar con compromisos comunitarios para el cuidado de la Madre Tierra.'}
      ]
    };

    if(/agua|yaku/.test(s)) return {
      situations:[
        {key:'A',title:'Opción A · Formal / técnica',text:`En ${place}, el agua es esencial para las familias, los cultivos, los animales y las actividades cotidianas. Los estudiantes de ${grades} observan diversas formas de uso y cuidado; sin embargo, también pueden identificar desperdicio, contaminación o dificultades de acceso. Se requiere comprender el problema desde datos, experiencias y saberes locales para construir alternativas viables. Reto: ¿Cómo podemos investigar el uso del agua en nuestra comunidad, explicar por qué debemos cuidarla y proponer acciones sustentadas que podamos poner en práctica y comunicar a otras personas?`},
        {key:'B',title:'Opción B · Narrativa / vivencial',text:`Un día los estudiantes notaron que en algunos lugares el agua se usaba con mucho cuidado y en otros se desperdiciaba o terminaba sucia. Recordaron lo que sus familias dicen sobre el yaku y se preguntaron si todos conocemos de dónde viene, para qué lo usamos y qué ocurriría si cada vez hubiera menos. Reto: ¿Cómo podemos convertirnos en guardianes del yaku, investigar lo que ocurre con el agua de nuestra comunidad y convencer a otros de cuidarla con acciones que sí podamos realizar?`}
      ],
      products:[
        {key:'1',title:'Observatorio escolar del agua',text:'Muestra con mapas o croquis, registros de consumo, tablas y gráficos, textos informativos, explicaciones científicas y propuestas de uso responsable sustentadas por los estudiantes.'},
        {key:'2',title:'Campaña comunitaria “Yaku kawsaymi”',text:'Campaña bilingüe o en la lengua de trabajo con afiches, audios o exposiciones, recomendaciones basadas en evidencias, soluciones sencillas y compromisos para cuidar el agua.'},
        {key:'3',title:'Feria de soluciones para cuidar el agua',text:'Feria por estaciones donde los estudiantes presentan problemas identificados, datos, experimentos o modelos, textos persuasivos y soluciones prácticas aplicables en la escuela, hogar o comunidad.'}
      ]
    };

    if(/residuo|basura|contamin/.test(s)) return {
      situations:[
        {key:'A',title:'Opción A · Formal / técnica',text:`En ${place}, la generación y disposición inadecuada de residuos puede afectar los espacios comunes, el suelo, el agua, los animales y la convivencia. Los estudiantes de ${grades} reconocen parte del problema, pero necesitan analizar causas, consecuencias y alternativas desde evidencias, saberes familiares y conocimientos de las áreas. Reto: ¿Cómo podemos investigar qué ocurre con los residuos que producimos, explicar sus efectos y organizar una propuesta viable para reducir la contaminación en nuestra escuela y comunidad?`},
        {key:'B',title:'Opción B · Narrativa / vivencial',text:`Durante un recorrido por ${place}, los estudiantes encontraron residuos en distintos espacios y comenzaron a preguntarse de dónde venían y qué les ocurriría después. Algunos dijeron que podían quemarse, otros que debían enterrarse y otros propusieron reutilizarlos. Como había opiniones diferentes, decidieron investigar antes de actuar. Reto: ¿Cómo podemos descubrir qué pasa realmente con nuestros residuos y transformar lo aprendido en una solución que ayude a tener una escuela y una comunidad más limpias?`}
      ],
      products:[
        {key:'1',title:'Ecoferia de soluciones para nuestra comunidad',text:'Feria con diagnóstico del problema, mapas, datos y gráficos, explicaciones científicas, objetos reutilizados, textos de sensibilización y compromisos colectivos.'},
        {key:'2',title:'Plan escolar “Menos residuos, más vida”',text:'Propuesta de acción elaborada por los estudiantes con evidencias del diagnóstico, acuerdos, rutas de separación o reutilización, materiales comunicativos y presentación pública.'},
        {key:'3',title:'Laboratorio creativo de reutilización',text:'Muestra de soluciones elaboradas a partir de residuos, acompañadas por la explicación del problema, datos recogidos, argumentos, instrucciones, costos o mediciones y compromisos de reducción.'}
      ]
    };

    return {
      situations:[
        {key:'A',title:'Opción A · Formal / técnica',text:`En ${place}, la situación “${raw||'una experiencia relevante del contexto'}” forma parte de la vida de los estudiantes de ${grades} y ofrece una oportunidad para articular saberes de la comunidad con aprendizajes escolares. A partir de lo que ya conocen, se requiere identificar una necesidad o problema auténtico, recuperar distintas perspectivas y movilizar competencias para comprenderlo y construir una respuesta pertinente. Reto: ¿Cómo podemos investigar esta situación desde diferentes áreas, comprenderla mejor y construir una respuesta o propuesta útil que podamos comunicar a nuestra comunidad?`},
        {key:'B',title:'Opción B · Narrativa / vivencial',text:`Los estudiantes de ${grades} se encontraron con una situación cercana a su vida: “${raw||'un desafío de su comunidad'}”. Al conversar, descubrieron que no todos pensaban igual ni tenían la misma información. Algunos recordaron lo que dicen sus familias y otros propusieron buscar nuevas explicaciones. Reto: ¿Cómo podemos convertir esta situación en una investigación que nos permita aprender, comparar ideas y crear una respuesta que tenga sentido para nosotros y nuestra comunidad?`}
      ],
      products:[
        {key:'1',title:'Feria de aprendizajes y soluciones',text:'Producto integrado con evidencias de las áreas seleccionadas, presentaciones, producciones escritas, representaciones, datos y propuestas vinculadas directamente con el reto.'},
        {key:'2',title:'Libro o portafolio comunitario',text:'Producción colectiva que reúne investigaciones, textos, registros, representaciones, conclusiones y propuestas de los estudiantes, culminando en una socialización con destinatarios reales.'},
        {key:'3',title:'Campaña o muestra de acción comunitaria',text:'Acción pública acompañada de materiales elaborados por los estudiantes para informar, explicar, argumentar y proponer alternativas frente al reto de la unidad o proyecto.'}
      ]
    };
  }

  function ensureHost(){
    let host=byId('ddProposalChooser');
    if(!host){host=document.createElement('div');host.id='ddProposalChooser';host.className='dd-proposal-chooser hidden topgap';byId('unitPanel')?.appendChild(host);}
    return host;
  }

  function situationCard(x){return `<label class="dd-choice-card"><input type="radio" name="ddSituation" value="${x.key}"><span class="pill">${E(x.key)}</span><h3>${E(x.title)}</h3><p>${E(x.text)}</p><b class="dd-pick">○ Elegir esta propuesta</b></label>`;}
  function productCard(x){return `<label class="dd-choice-card"><input type="radio" name="ddProduct" value="${x.key}"><span class="pill">Producto ${E(x.key)}</span><h3>${E(x.title)}</h3><p>${E(x.text)}</p><b class="dd-pick">○ Elegir este producto</b></label>`;}

  function wireSelection(name){
    document.querySelectorAll(`input[name="${name}"]`).forEach(r=>r.addEventListener('change',()=>{
      document.querySelectorAll(`input[name="${name}"]`).forEach(x=>x.closest('.dd-choice-card')?.classList.toggle('selected',x.checked));
    }));
  }

  function showSituations(brief,type){
    const d=dataFor(brief);const host=ensureHost();host.classList.remove('hidden');
    state.pendingUnitChoice={brief,type,situations:d.situations,products:d.products,selectedSituation:null,selectedProduct:null};save();
    host.innerHTML=`<div class="dd-choice-intro"><span class="pill">PASO 2 DEL PROMPT MAESTRO</span><h2>Elige la Situación Significativa</h2><p>La app propone <b>dos opciones</b>. Ambas consideran contexto, problema/necesidad y <b>un reto bien definido</b>. El docente decide cuál usar o puede escribir la suya.</p></div>
      <div class="dd-choice-grid">${d.situations.map(situationCard).join('')}</div>
      <label class="dd-own"><b>✍️ O usar mi propia Situación Significativa</b><textarea id="ddOwnSituation" placeholder="Pega o escribe aquí tu propia situación significativa..."></textarea></label>
      <div class="actions"><button class="btn" id="ddContinueProducts">Continuar: ver 3 productos →</button><button class="btn ghost" id="ddCancelChoice">Cancelar</button></div>`;
    wireSelection('ddSituation');
    byId('ddCancelChoice').onclick=()=>host.classList.add('hidden');
    byId('ddContinueProducts').onclick=()=>{
      const own=(byId('ddOwnSituation')?.value||'').trim();
      const chosen=document.querySelector('input[name="ddSituation"]:checked')?.value;
      if(!own&&!chosen)return alert('Elige la Opción A, la Opción B o escribe tu propia Situación Significativa.');
      const selected=own||d.situations.find(x=>x.key===chosen)?.text;
      state.pendingUnitChoice.selectedSituation=selected;save();showProducts(d,host);
    };
    host.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function showProducts(d,host){
    host.innerHTML=`<div class="dd-choice-intro"><span class="pill">PASO 3 DEL PROMPT MAESTRO</span><h2>Elige el Producto Final</h2><p>Con la Situación Significativa ya definida, DocenteDigital propone <b>tres productos tangibles</b> que integran las áreas y responden al reto. También puedes escribir uno propio.</p></div>
      <div class="dd-product-grid">${d.products.map(productCard).join('')}</div>
      <label class="dd-own"><b>✍️ O usar mi propio Producto Final</b><textarea id="ddOwnProduct" placeholder="Escribe aquí tu propia idea de producto final..."></textarea></label>
      <div class="actions"><button class="btn" id="ddBuildUnit">✓ Elegir y construir la unidad/proyecto</button><button class="btn ghost" id="ddBackSituation">← Volver a situaciones</button></div>`;
    wireSelection('ddProduct');
    byId('ddBackSituation').onclick=()=>showSituations(state.pendingUnitChoice.brief,state.pendingUnitChoice.type);
    byId('ddBuildUnit').onclick=()=>{
      const own=(byId('ddOwnProduct')?.value||'').trim();
      const chosen=document.querySelector('input[name="ddProduct"]:checked')?.value;
      if(!own&&!chosen)return alert('Elige uno de los 3 productos o escribe tu propia propuesta.');
      const p=own||d.products.find(x=>x.key===chosen)?.text;
      const pTitle=own?'Producto propuesto por el docente':(d.products.find(x=>x.key===chosen)?.title||'Producto final');
      state.pendingUnitChoice.selectedProduct=p;state.pendingUnitChoice.selectedProductTitle=pTitle;save();
      finalizeChoice(host);
    };
    host.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function finalizeChoice(host){
    const pending=state.pendingUnitChoice;if(!pending)return;
    const before=new Set((state.units||[]).map(u=>u.id));
    baseCreate();
    const unit=(state.units||[]).find(u=>!before.has(u.id))||state.units?.[0];
    if(!unit)return;
    unit.situation=pending.selectedSituation;
    unit.selectedSituationSource=pending.situations.find(x=>x.text===pending.selectedSituation)?.key||'Docente';
    unit.situationOptions=pending.situations;
    unit.product=pending.selectedProduct;
    unit.productTitle=pending.selectedProductTitle;
    unit.productOptions=pending.products;
    unit.selectionApproved=true;
    save();renderUnits();renderUnitOutput(unit);fillSessionUnits();
    host.classList.add('hidden');
    byId('unitOutput')?.scrollIntoView({behavior:'smooth'});
  }

  window.createUnitDemo=function(){
    const type=byId('unitType')?.value||'Unidad de aprendizaje';
    const brief=byId('unitSituation')?.value.trim()||'';
    if(!brief)return alert('Escribe una idea breve del contexto o situación de tu comunidad.');
    showSituations(brief,type);
  };

  const css=document.createElement('style');
  css.textContent=`
    .dd-proposal-chooser{border-top:2px dashed #8a9a90;padding-top:18px;margin-top:18px}.dd-choice-intro{background:#f5faf7;border:1px solid #d6e4dc;border-radius:14px;padding:14px 16px;margin-bottom:12px}.dd-choice-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.dd-product-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.dd-choice-card{display:block;border:2px solid #d8dfdb;border-radius:14px;padding:14px;background:#fff;cursor:pointer;transition:.15s}.dd-choice-card:hover{background:#f8fbf9;transform:translateY(-1px)}.dd-choice-card.selected{border-color:#2f7e5a;background:#ebf7f0;box-shadow:0 0 0 2px rgba(47,126,90,.12)}.dd-choice-card input{width:19px;height:19px;accent-color:#2f7e5a}.dd-choice-card h3{margin:8px 0}.dd-choice-card p{line-height:1.45}.dd-pick{display:block;margin-top:10px;color:#286c4e}.dd-choice-card.selected .dd-pick:before{content:'✓ '}.dd-own{display:block;margin-top:14px}.dd-own textarea{width:100%;min-height:95px;margin-top:7px}.dd-proposal-chooser .actions{margin-top:14px}@media(max-width:850px){.dd-product-grid{grid-template-columns:1fr}.dd-choice-grid{grid-template-columns:1fr}}
  `;
  document.head.appendChild(css);
})();