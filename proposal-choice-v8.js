/* DocenteDigital – flujo de elección v8.1: situaciones y productos basados en el sentido expresado por el docente */
(function(){
  if(window.__ddProposalChoiceV8)return;window.__ddProposalChoiceV8=true;
  const E=v=>escapeHtml(v), baseCreate=window.createUnitDemo; state.pendingUnitChoice=state.pendingUnitChoice||null;if(typeof save==='function')save();
  const tidy=s=>String(s||'').replace(/\s+/g,' ').trim();
  function meaningFor(raw){try{if(typeof window.ddUnderstandPlanningDescription==='function')return window.ddUnderstandPlanningDescription(raw)}catch(e){}return {raw,focus:raw||'la situación descrita',problem:'',cause:'',consequence:'',goal:'',opportunity:'',actors:[],place:'',confidence:0,status:'lectura preliminar',gaps:['falta precisar el sentido de la situación']};}
  function shortFocus(m,raw){const f=tidy(m?.focus||'');const base=f&&f!=='la realidad descrita'?f:tidy(raw).slice(0,140)||'la situación descrita';const s=tidy(raw+' '+base).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');if(/pinturas?\s+rupestres?|arte\s+rupestre|petroglif|restos?\s+arqueologic|sitios?\s+arqueologic|patrimonio\s+arqueologic/.test(s))return 'las pinturas rupestres y el patrimonio arqueológico local';return base;}
  function placeFor(m){
    if(tidy(m?.place))return tidy(m.place);
    const p=state.teacherContext||{};
    const locality=p.community?((p.localityType||'localidad')+' de '+p.community):'';
    const parts=[
      p.institutionName?('la '+p.institutionName):'',
      locality,
      p.district?('distrito de '+p.district):'',
      p.province?('provincia de '+p.province):'',
      p.region?('región '+p.region):''
    ].filter(Boolean);
    if(parts.length)return parts.join(', ');
    if(typeof window.ddTerritorialPhrase==='function'){
      const x=window.ddTerritorialPhrase();
      if(x&&x!=='el entorno de los estudiantes')return x;
    }
    return 'el entorno de los estudiantes';
  }

  function profileSnapshot(){
    const p=state.teacherContext||{};
    return {
      teacherName:p.teacherName||state.teacherName||'',
      institutionName:p.institutionName||state.schoolName||'',
      localityType:p.localityType||'',
      community:p.community||'',
      district:p.district||'',
      province:p.province||'',
      region:p.region||'',
      ugel:p.ugel||''
    };
  }
  function challengeFor(m,focus){const problem=tidy(m?.problem),goal=tidy(m?.goal);if(problem&&goal)return `¿Cómo podemos comprender ${focus}, analizar la situación planteada y construir una respuesta sustentada que contribuya a ${goal}?`;if(problem)return `¿Qué necesitamos investigar y explicar sobre ${focus} para comprender mejor la situación y sustentar una respuesta pertinente con evidencias?`;if(goal)return `¿Qué necesitamos comprender y poner en práctica sobre ${focus} para ${goal}, y cómo demostraremos lo aprendido?`;return `¿Qué necesitamos observar, preguntar e investigar sobre ${focus} para comprenderlo mejor y comunicar con evidencias lo que descubramos?`;}
  function naturalEvidence(m){
    const pieces=[];
    if(tidy(m.problem))pieces.push(`La situación presenta ${tidy(m.problem)}.`);
    if(tidy(m.cause))pieces.push(`Entre los aspectos señalados se menciona ${tidy(m.cause)}.`);
    if(tidy(m.consequence))pieces.push(`También se expresa como consecuencia ${tidy(m.consequence)}.`);
    if(tidy(m.opportunity))pieces.push(`A la vez, se reconoce como oportunidad o fortaleza ${tidy(m.opportunity)}.`);
    if(tidy(m.goal))pieces.push(`La experiencia busca ${tidy(m.goal)}.`);
    return pieces.join(' ');
  }
  function situationOptions(raw){
    const m=meaningFor(raw),focus=shortFocus(m,raw),grades=(state.grades||[]).join(', ')||'los grados/edades seleccionados',place=placeFor(m),reto=challengeFor(m,focus),facts=naturalEvidence(m);
    const level=state.level||'Primaria';
    const low=tidy(focus).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    const profile=profileSnapshot();
    const institution=profile.institutionName||'la institución educativa';
    const locality=profile.community?((profile.localityType||'localidad')+' '+profile.community):place;
    let a='',b='';
    const heritage=/pinturas?\s+rupestres?|arte\s+rupestre|petroglif|restos?\s+arqueologic|sitios?\s+arqueologic|patrimonio\s+arqueologic/.test(tidy(raw+' '+focus).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''));

    if(heritage){
      const hasArchaeology=/restos?\s+arqueol[oó]gic|sitios?\s+arqueol[oó]gic|patrimonio\s+arqueol[oó]gic/i.test(raw);
      const heritageFocus=hasArchaeology?'los restos arqueológicos y las pinturas rupestres de nuestro territorio':'las pinturas rupestres de nuestro territorio';
      const retoHeritage=`¿Qué podemos descubrir, a partir de la observación y de fuentes confiables, sobre ${heritageFocus} y cómo podemos comunicar su valor diferenciando lo observado, lo investigado y lo que todavía no está comprobado?`;
      if(level==='Inicial'){
        a=`En ${institution}, ubicada en ${locality}, las niñas y los niños de ${grades} se acercarán a las pinturas rupestres como huellas visuales del pasado presentes en su entorno. A partir de imágenes verificadas, relatos del docente y experiencias de observación, describirán formas, líneas, colores y semejanzas, expresarán lo que imaginan y diferenciarán lo que observan de lo que suponen. Representarán sus descubrimientos mediante dibujos, modelado, conversación y juego, sin atribuir significados históricos que no hayan sido comprobados. El reto será: ${retoHeritage}`;
        b=`En ${institution}, en ${locality}, las pinturas rupestres se convertirán en una oportunidad para observar, preguntar y representar. Las niñas y los niños de ${grades} explorarán imágenes o registros seguros, compararán detalles, formularán preguntas y comunicarán lo que descubren mediante distintos lenguajes. La experiencia culminará con una pequeña galería de hallazgos explicada con sus propias palabras.`;
      }else if(level==='Secundaria'){
        a=`En ${institution}, ubicada en ${locality}, la presencia de pinturas rupestres y otros vestigios arqueológicos del entorno plantea una oportunidad para investigar el patrimonio local con rigor. Los estudiantes de ${grades} distinguirán observación, inferencia e interpretación; contrastarán fuentes; analizarán ubicación, características y posibles explicaciones, y reconocerán qué afirmaciones requieren evidencia adicional. No se asignarán autores, fechas ni significados sin respaldo verificable. El reto central será: ${retoHeritage}`;
        b=`En ${institution}, en ${locality}, los estudiantes de ${grades} investigarán las pinturas rupestres como parte del patrimonio arqueológico local. Organizarán preguntas, seleccionarán fuentes pertinentes, contrastarán información y elaborarán explicaciones sustentadas, diferenciando hechos comprobables de hipótesis. Comunicarán sus hallazgos mediante un producto de divulgación dirigido a la comunidad educativa.`;
      }else{
        a=`En ${institution}, ubicada en ${locality}, los estudiantes de ${grades} cuentan con un punto de partida cercano: la presencia de ${heritageFocus}. Este patrimonio despierta preguntas sobre qué huellas del pasado pueden reconocer, qué información pueden obtener de imágenes, testimonios u otras fuentes pertinentes y qué afirmaciones necesitan todavía ser comprobadas. Observarán y registrarán evidencias, formularán preguntas, contrastarán información y construirán explicaciones acordes con cada grado. El reto será: ${retoHeritage}`;
        b=`En ${institution}, en ${locality}, los estudiantes de ${grades} asumirán el desafío de conocer y valorar ${heritageFocus}. Partirán de sus saberes e interrogantes, revisarán registros y fuentes pertinentes, compararán datos y organizarán hallazgos. Finalmente prepararán una muestra o recurso de divulgación para la comunidad educativa en el que expliquen qué evidencias encontraron, qué interpretaciones pueden sostener y qué preguntas permanecen abiertas.`;
      }
      return {meaning:m,focus,reto:retoHeritage,situations:[
        {key:'A',title:'Patrimonio cercano: observamos e investigamos',text:a},
        {key:'B',title:'Huellas del pasado: buscamos evidencias y comunicamos',text:b}
      ]};
    }

    if(level==='Inicial'){
      const theme=/animal/.test(low)
        ? 'animales que conocen, han visto en casa, en el camino, en la comunidad o en imágenes y relatos'
        : /semill|siembr|planta|biohuerto/.test(low)
          ? 'semillas, plantas y experiencias de siembra cercanas a su vida cotidiana'
          : /agua/.test(low)
            ? 'formas en que usan y observan el agua en casa, en la institución y en su entorno'
            : focus;
      a=`En ${institution}, ubicada en ${locality}, las niñas y los niños de ${grades} muestran curiosidad por ${focus}. Para convertir este interés en una experiencia significativa, la docente recuperará lo que saben a partir de conversaciones, dibujos, juego, relatos, objetos e imágenes vinculadas con ${theme}. A partir de sus preguntas, observarán, compararán, clasificarán, representarán y comunicarán lo que descubren, respetando sus distintas formas de expresión. El reto será ${reto.replace(/^¿|\?$/g,'').toLowerCase()} y los hallazgos se irán haciendo visibles mediante producciones, registros y explicaciones propias de su edad.`;
      b=`En ${institution}, en ${locality}, se propone una experiencia de indagación y expresión alrededor de ${focus}. Las niñas y los niños de ${grades} partirán de situaciones concretas de su entorno, materiales seguros, imágenes, relatos o testimonios familiares para reconocer qué saben y qué desean averiguar. Durante el proyecto formularán preguntas, explorarán características, encontrarán semejanzas y diferencias, comunicarán sus ideas mediante el lenguaje oral, gráfico, corporal o artístico y construirán un producto colectivo que muestre cómo cambió lo que pensaban al inicio.`;
    }else if(level==='Secundaria'){
      a=`En ${institution}, ubicada en ${locality}, los estudiantes de ${grades} abordarán ${focus} a partir de una situación vinculada con su realidad y con información verificable. Recuperarán experiencias y saberes previos, formularán preguntas que puedan investigarse, analizarán datos, fuentes o casos, contrastarán distintas explicaciones y construirán una posición o respuesta sustentada. ${facts||'Cuando sea necesario, el docente incorporará datos locales reales antes de presentar afirmaciones como hechos.'} El reto central será: ${reto}`;
      b=`En ${institution}, en ${locality}, ${focus} se convertirá en un desafío de aprendizaje que exija investigar y tomar decisiones. Los estudiantes de ${grades} identificarán qué información necesitan, seleccionarán fuentes pertinentes, contrastarán evidencias, reconocerán relaciones y posibles explicaciones y elaborarán una respuesta, producto o propuesta dirigida a un destinatario concreto. El trabajo culminará comunicando conclusiones sustentadas y explicando qué evidencias fueron decisivas para construirlas.`;
    }else{
      a=`En ${institution}, ubicada en ${locality}, los estudiantes de ${grades} desarrollarán una experiencia de aprendizaje vinculada con ${focus}. Partirán de lo que observan, conocen o viven en su entorno y de preguntas que permitan convertir el tema en un reto auténtico. Según las áreas involucradas, observarán, leerán, dialogarán, resolverán problemas, registrarán datos, compararán información, producirán textos o representaciones y contrastarán sus ideas con evidencias. ${facts||'El docente incorporará ejemplos y datos reales del contexto cuando estén disponibles, evitando presentarlos como hechos si todavía no han sido verificados.'} El reto será: ${reto}`;
      b=`En ${institution}, en ${locality}, los estudiantes de ${grades} investigarán ${focus} a partir de una situación cercana y comprensible. Primero explicitarán qué saben y qué necesitan averiguar; después trabajarán con materiales, textos, datos, testimonios, problemas o experiencias pertinentes; finalmente organizarán sus hallazgos y comunicarán una respuesta o producto que muestre no solo el resultado, sino también las evidencias y estrategias que utilizaron para aprender.`;
    }

    return {meaning:m,focus,reto,situations:[
      {key:'A',title:'Propuesta contextualizada',text:a},
      {key:'B',title:'Propuesta de indagación y producción',text:b}
    ]};
  }
  function productOptions(raw,pack){
    const m=pack.meaning,focus=pack.focus,level=state.level||'Primaria';
    const low=tidy(focus).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    const animal=/animal/.test(low),seed=/semill|siembr|planta|biohuerto/.test(low),water=/agua/.test(low);
    const heritage=/pinturas?\s+rupestres?|arte\s+rupestre|petroglif|restos?\s+arqueologic|sitios?\s+arqueologic|patrimonio\s+arqueologic/.test((tidy(raw)+' '+low).normalize('NFD').replace(/[\u0300-\u036f]/g,''));
    if(heritage){
      if(level==='Inicial')return [
        {key:'1',title:'Galería “Huellas del pasado”',text:'Muestra sencilla con dibujos, reproducciones seguras, formas y colores observados por los niños, acompañada de breves explicaciones dictadas a la docente.'},
        {key:'2',title:'Libro gigante de descubrimientos rupestres',text:'Álbum colectivo con dibujos, preguntas y hallazgos expresados por los niños sobre lo que observaron en las pinturas de las rocas.'},
        {key:'3',title:'Rincón de pequeños exploradores del pasado',text:'Espacio de aula con imágenes, reproducciones, preguntas y producciones para que los niños expliquen lo que observaron y lo que todavía desean saber.'}
      ];
      if(level==='Secundaria')return [
        {key:'1',title:'Dossier de investigación sobre el patrimonio rupestre local',text:'Documento con preguntas, fuentes, registros, análisis, distinción entre evidencias e interpretaciones y conclusiones sustentadas sobre las pinturas rupestres del entorno.'},
        {key:'2',title:'Exposición de divulgación “Huellas del pasado”',text:'Muestra pública con paneles, mapas referenciales, fuentes, explicaciones y conclusiones que comuniquen el valor del patrimonio sin presentar hipótesis como hechos.'},
        {key:'3',title:'Ruta interpretativa escolar del patrimonio arqueológico',text:'Propuesta de recorrido o recurso digital que organiza puntos, preguntas, evidencias y mensajes de valoración del patrimonio arqueológico local.'}
      ];
      return [
        {key:'1',title:'Museo escolar “Huellas de nuestra comunidad”',text:'Muestra por estaciones con dibujos o registros de observación, textos breves, preguntas investigadas y explicaciones sustentadas sobre las pinturas rupestres, diferenciadas según el grado.'},
        {key:'2',title:'Guía ilustrada de las pinturas rupestres de nuestro entorno',text:'Guía elaborada por los estudiantes con observaciones, vocabulario, preguntas, información comprobada y recomendaciones para valorar el patrimonio local.'},
        {key:'3',title:'Galería comentada “Lo que descubrimos del pasado”',text:'Exposición con producciones de distintas áreas en la que los estudiantes explican qué observaron, qué investigaron y qué aspectos todavía requieren comprobación.'}
      ];
    }
    if(level==='Inicial'){
      if(animal)return [
        {key:'1',title:'Museo de huellas, pelos, plumas y descubrimientos',text:'Muestra colectiva con dibujos, clasificaciones, huellas, imágenes y explicaciones orales de los niños sobre las características que descubrieron en distintos animales.'},
        {key:'2',title:'Álbum gigante “Así son los animales que descubrimos”',text:'Álbum mural construido por el grupo con ilustraciones, nombres dictados a la docente, características visibles, sonidos, movimientos y pequeños hallazgos expresados por los niños.'},
        {key:'3',title:'Rincón interactivo de exploradores de animales',text:'Espacio de aula con tarjetas, figuras, producciones, preguntas y juegos de clasificación para que los niños expliquen a otros qué observaron y cómo agruparon a los animales.'}
      ];
      if(seed)return [
        {key:'1',title:'Diario visual “De semilla a plantita”',text:'Secuencia de dibujos, fotografías o registros sencillos elaborados por los niños para mostrar los cambios observados en semillas y plantas.'},
        {key:'2',title:'Estación verde de descubrimientos',text:'Rincón del aula con germinadores, dibujos, preguntas, etiquetas y explicaciones orales de los niños sobre lo que necesita una planta para crecer.'},
        {key:'3',title:'Mural “Lo que descubrimos al sembrar”',text:'Producción colectiva que reúne observaciones, acuerdos de cuidado, dibujos y expresiones de los niños sobre la experiencia de siembra.'}
      ];
      return [
        {key:'1',title:`Muestra de descubrimientos: ${focus}`.slice(0,95),text:`Galería de dibujos, representaciones, objetos o registros que permita a los niños mostrar y contar qué descubrieron sobre ${focus}.`},
        {key:'2',title:`Álbum colectivo: así comprendimos ${focus}`.slice(0,95),text:`Álbum mural con producciones infantiles, palabras dictadas, preguntas y hallazgos construidos durante la experiencia sobre ${focus}.`},
        {key:'3',title:`Rincón interactivo de ${focus}`.slice(0,95),text:`Espacio de juego y comunicación con materiales y producciones que los niños usarán para explicar a otros lo aprendido sobre ${focus}.`}
      ];
    }
    if(level==='Secundaria'){
      return [
        {key:'1',title:`Dossier de evidencias y conclusiones sobre ${focus}`.slice(0,100),text:`Documento o portafolio que integra fuentes, datos, análisis, representaciones y conclusiones argumentadas sobre ${focus}.`},
        {key:'2',title:`Producto de divulgación: comprendemos ${focus}`.slice(0,100),text:`Infografía, podcast, video breve, exposición o artículo de divulgación dirigido a un público definido y sustentado en fuentes y evidencias verificables.`},
        {key:'3',title:`Propuesta argumentada frente al reto de ${focus}`.slice(0,100),text:`Propuesta, campaña, protocolo, diseño o acción viable que responda al reto trabajado y explique criterios, evidencias, beneficios, límites y posibles mejoras.`}
      ];
    }
    if(animal)return [
      {key:'1',title:'Guía ilustrada de los animales de nuestro entorno',text:'Guía elaborada por los estudiantes con fichas, dibujos o fotografías, características, formas de desplazamiento, alimentación, hábitat y explicaciones construidas a partir de evidencias.'},
      {key:'2',title:'Museo escolar “Animales sorprendentes”',text:'Muestra organizada por estaciones con modelos, clasificaciones, textos breves, preguntas y explicaciones orales para compartir lo aprendido con otros estudiantes o familias.'},
      {key:'3',title:'Mapa de biodiversidad y compromisos de cuidado',text:'Mapa o mural de los animales conocidos en el entorno, sus características y hábitats, acompañado de acuerdos o recomendaciones de cuidado justificadas por los estudiantes.'}
    ];
    if(seed)return [
      {key:'1',title:'Bitácora científica del biohuerto',text:'Registro integrado de preguntas, predicciones, observaciones, medidas, dibujos, datos, conclusiones y decisiones tomadas durante la siembra y el cuidado del biohuerto.'},
      {key:'2',title:'Feria “De la semilla a la cosecha”',text:'Presentación por estaciones donde los estudiantes explican procesos, muestran evidencias y resuelven preguntas de visitantes sobre siembra, germinación y cuidado de cultivos.'},
      {key:'3',title:'Guía práctica para sembrar y cuidar nuestro biohuerto',text:'Guía ilustrada con pasos, recomendaciones, registros, problemas resueltos y explicaciones elaboradas desde distintas áreas del aprendizaje.'}
    ];
    if(water)return [
      {key:'1',title:'Guía comunitaria “Cada gota cuenta”',text:'Guía con observaciones, datos, textos, problemas y recomendaciones para el uso responsable del agua en la escuela y el hogar.'},
      {key:'2',title:'Campaña escolar sustentada para cuidar el agua',text:'Campaña con afiches, mensajes, datos y compromisos elaborados a partir de evidencias recogidas durante la unidad o proyecto.'},
      {key:'3',title:'Expo “El viaje y el valor del agua”',text:'Muestra donde los estudiantes presentan modelos, explicaciones, textos y situaciones matemáticas relacionadas con el agua y su cuidado.'}
    ];
    return [
      {key:'1',title:`Portafolio de evidencias: investigamos ${focus}`.slice(0,100),text:`Portafolio que reúne preguntas, registros, textos, representaciones, datos, resoluciones y conclusiones producidas durante el trabajo sobre ${focus}.`},
      {key:'2',title:`Expo interactiva: descubrimos ${focus}`.slice(0,100),text:`Muestra por estaciones en la que los estudiantes presentan productos de las áreas y explican a un público real qué aprendieron, cómo lo aprendieron y qué evidencias lo demuestran.`},
      {key:'3',title:`Guía práctica para comunicar lo aprendido sobre ${focus}`.slice(0,100),text:`Guía, mural o recurso digital que organiza los principales hallazgos, ejemplos, producciones y recomendaciones construidas por los estudiantes.`}
    ];
  }
  function dataFor(brief){let pack=situationOptions((brief||'').trim());pack={...pack,products:productOptions(brief,pack)};if(typeof window.ddApplyExpertReasoningToProposal==='function')pack=window.ddApplyExpertReasoningToProposal(brief,pack)||pack;return pack;}
  function ensureHost(){let host=byId('ddProposalChooser');if(!host){host=document.createElement('div');host.id='ddProposalChooser';host.className='dd-proposal-chooser hidden topgap';byId('unitPanel')?.appendChild(host);}return host;}
  const situationCard=x=>`<label class="dd-choice-card"><input type="radio" name="ddSituation" value="${x.key}"><span class="pill">${E(x.key)}</span><h3>${E(x.title)}</h3><p>${E(x.text)}</p><b class="dd-pick">○ Elegir esta propuesta</b></label>`,productCard=x=>`<label class="dd-choice-card"><input type="radio" name="ddProduct" value="${x.key}"><span class="pill">Producto ${E(x.key)}</span><h3>${E(x.title)}</h3><p>${E(x.text)}</p><b class="dd-pick">○ Elegir este producto</b></label>`;
  function wireSelection(name){document.querySelectorAll(`input[name="${name}"]`).forEach(r=>r.addEventListener('change',()=>document.querySelectorAll(`input[name="${name}"]`).forEach(x=>x.closest('.dd-choice-card')?.classList.toggle('selected',x.checked))));}
  function showSituations(brief,type){const d=dataFor(brief),host=ensureHost();host.classList.remove('hidden');state.pendingUnitChoice={brief,type,situations:d.situations,products:d.products,meaning:d.meaning,reto:d.reto,expertReasoning:d.expertReasoning||null,profileSnapshot:profileSnapshot(),selectedSituation:null,selectedProduct:null};if(typeof save==='function')save();const anchor=tidy([byId('unitTitle')?.value||'',brief||''].filter(Boolean).join(' '));const specificAnchor=anchor.split(/\s+/).length>=5||/pinturas?\s+rupestres?|restos?\s+arqueol[oó]gic|biohuerto|siembr|agua|residu|animal|pachamama/i.test(anchor);const warning=d.meaning?.confidence<50&&!specificAnchor?`<div class="notice">⚠️ <b>Falta precisar algunos datos.</b> Puedes completar el contexto para que la situación sea todavía más específica.</div>`:'';host.innerHTML=`<div class="dd-choice-intro"><span class="pill">PASO 2</span><h2>Elige la situación significativa</h2><p>Las propuestas parten de lo que escribiste y no añaden causas, problemas o finalidades que no estén sustentados.</p>${warning}</div><div class="dd-choice-grid">${d.situations.map(situationCard).join('')}</div><label class="dd-own"><b>✍️ O escribe tu propia situación significativa</b><textarea id="ddOwnSituation" placeholder="Escribe o pega aquí tu situación significativa..."></textarea></label><div class="actions"><button class="btn" id="ddContinueProducts">Continuar: elegir producto →</button><button class="btn ghost" id="ddCancelChoice">Cancelar</button></div>`;wireSelection('ddSituation');byId('ddCancelChoice').onclick=()=>host.classList.add('hidden');byId('ddContinueProducts').onclick=()=>{const own=(byId('ddOwnSituation')?.value||'').trim(),chosen=document.querySelector('input[name="ddSituation"]:checked')?.value;if(!own&&!chosen)return alert('Elige una situación o escribe la tuya.');state.pendingUnitChoice.selectedSituation=own||d.situations.find(x=>x.key===chosen)?.text;if(typeof save==='function')save();showProducts(d,host);};host.scrollIntoView({behavior:'smooth',block:'start'});}
  function extraProductIdeas(d){
    const focus=d.focus||state.pendingUnitChoice?.meaning?.focus||state.pendingUnitChoice?.brief||'el tema trabajado';
    const level=state.level||'Primaria';
    const base=[...(d.products||[])];
    const extras=level==='Inicial'
      ? [
          {title:'Maleta viajera de descubrimientos',text:`Maleta o caja itinerante con dibujos, tarjetas, pequeños registros y preguntas creadas por los niños para compartir con las familias lo descubierto sobre ${focus}.`},
          {title:'Galería viviente de lo que aprendimos',text:`Recorrido con producciones, dramatizaciones, modelos, sonidos o explicaciones breves en el que los niños muestran a otros sus hallazgos sobre ${focus}.`}
        ]
      : level==='Secundaria'
        ? [
            {title:'Informe visual con datos y evidencias',text:`Informe breve, infografía o tablero de evidencias que sintetiza hallazgos, fuentes, datos, interpretaciones y conclusiones sobre ${focus}.`},
            {title:'Foro o panel de propuestas sustentadas',text:`Presentación pública en la que los estudiantes exponen alternativas frente al reto de ${focus}, sustentan criterios y responden preguntas del público.`}
          ]
        : [
            {title:'Ruta de aprendizaje abierta a la comunidad',text:`Recorrido por estaciones con producciones de las áreas, retos, demostraciones y explicaciones de los estudiantes para comunicar qué aprendieron sobre ${focus} y cómo lo comprobaron.`},
            {title:'Guía ilustrada hecha por estudiantes',text:`Guía práctica con textos, dibujos, problemas, datos, recomendaciones y conclusiones elaboradas por los estudiantes sobre ${focus}, dirigida a un lector real.`}
          ];
    return [...base,...extras].slice(0,5);
  }

  function openProductAssistant(d){
    document.getElementById('ddProductSidePanel')?.remove();
    document.getElementById('ddProductSideShade')?.remove();
    const ideas=extraProductIdeas(d);
    const panel=document.createElement('aside');
    panel.id='ddProductSidePanel';
    panel.className='dd-product-side-panel';
    panel.innerHTML=`<div class="dd-side-head"><div><span class="pill">Asistente de producto</span><h2>Construye un producto más potente</h2></div><button class="dd-side-close" type="button">×</button></div>
      <p>DocenteDigital usa el nivel, el reto, el contexto y la situación elegida. Selecciona una propuesta y luego edítala si deseas.</p>
      <div class="dd-product-assistant-list">${ideas.map((x,i)=>`<button type="button" class="dd-product-assistant-option" data-index="${i}"><b>${E(x.title)}</b><span>${E(x.text)}</span></button>`).join('')}</div>
      <div class="notice topgap">Puedes elegir una propuesta, editarla o pedir nuevas variantes con el asistente IA de DocenteDigital cuando la conexión esté activa.</div>`;
    const shade=document.createElement('div');shade.id='ddProductSideShade';shade.className='dd-title-side-shade';
    document.body.appendChild(shade);document.body.appendChild(panel);
    const close=()=>{panel.remove();shade.remove();};
    shade.onclick=close;panel.querySelector('.dd-side-close').onclick=close;
    panel.querySelectorAll('.dd-product-assistant-option').forEach(btn=>btn.onclick=()=>{
      const item=ideas[Number(btn.dataset.index)];
      const ta=byId('ddOwnProduct');
      if(ta){ta.value=item.text;ta.dataset.title=item.title;ta.focus();}
      close();
    });
    requestAnimationFrame(()=>panel.classList.add('open'));
  }

  function showProducts(d,host){host.innerHTML=`<div class="dd-choice-intro"><span class="pill">PASO 3</span><h2>Elige el producto o evidencia integradora</h2><p>El producto debe responder al reto, ser útil o comunicable y permitir mostrar con claridad lo que los estudiantes aprendieron, investigaron, resolvieron o crearon.</p></div><div class="dd-product-grid">${d.products.map(productCard).join('')}</div><label class="dd-own"><b>✍️ O escribe tu propio producto</b><textarea id="ddOwnProduct" placeholder="Escribe un producto concreto, observable y conectado con el reto..."></textarea></label><div class="actions"><button class="btn alt" type="button" id="ddHelpProduct">✨ Ayúdame a crear un producto</button></div><div class="actions"><button class="btn" id="ddBuildUnit">✓ Construir la unidad/proyecto</button><button class="btn ghost" id="ddBackSituation">← Volver a situaciones</button></div>`;wireSelection('ddProduct');byId('ddHelpProduct').onclick=()=>openProductAssistant(d);byId('ddBackSituation').onclick=()=>showSituations(state.pendingUnitChoice.brief,state.pendingUnitChoice.type);byId('ddBuildUnit').onclick=()=>{const own=(byId('ddOwnProduct')?.value||'').trim(),chosen=document.querySelector('input[name="ddProduct"]:checked')?.value;if(!own&&!chosen)return alert('Elige uno de los productos o escribe el tuyo.');const currentProducts=state.pendingUnitChoice?.products||d.products;const item=currentProducts.find(x=>String(x.key)===String(chosen));state.pendingUnitChoice.selectedProduct=own||item?.text;state.pendingUnitChoice.selectedProductTitle=own?(byId('ddOwnProduct')?.dataset.title||'Producto propuesto por el docente'):(item?.title||'Producto final');if(typeof save==='function')save();finalizeChoice(host);};host.scrollIntoView({behavior:'smooth',block:'start'});}
  function finalizeChoice(host){const pending=state.pendingUnitChoice;if(!pending)return;const before=new Set((state.units||[]).map(u=>u.id));baseCreate();const unit=(state.units||[]).find(u=>!before.has(u.id))||state.units?.[0];if(!unit)return;unit.situation=pending.selectedSituation;unit.reto=pending.reto||unit.reto;unit.planningMeaning=pending.meaning||unit.planningMeaning;unit.expertReasoning=pending.expertReasoning||null;unit.selectedSituationSource=pending.situations.find(x=>x.text===pending.selectedSituation)?.key||'Docente';unit.teacherProfile=pending.profileSnapshot||profileSnapshot();unit.situationOptions=pending.situations;unit.product=pending.selectedProduct;unit.productTitle=pending.selectedProductTitle;unit.productOptions=pending.products;unit.selectionApproved=true;if(typeof save==='function')save();renderUnits();renderUnitOutput(unit);fillSessionUnits();host.classList.add('hidden');byId('unitOutput')?.scrollIntoView({behavior:'smooth'});}
  window.createUnitDemo=function(){
    const type=byId('unitType')?.value||'Unidad de aprendizaje';
    const title=byId('unitTitle')?.value.trim()||'';
    let brief=byId('unitSituation')?.value.trim()||'';
    if(!brief&&typeof window.ddAssistPlanningContext==='function'){
      brief=window.ddAssistPlanningContext(true)||'';
    }
    if(!brief){
      brief=title||'una experiencia cercana y significativa para los estudiantes';
      if(byId('unitSituation'))byId('unitSituation').value=brief;
    }
    const analysisBrief=[title,brief].filter(Boolean).join('. ');
    showSituations(analysisBrief,type);
  };
  const css=document.createElement('style');css.textContent=`.dd-proposal-chooser{border-top:2px dashed #8a9a90;padding-top:18px;margin-top:18px}.dd-choice-intro{background:#f5faf7;border:1px solid #d6e4dc;border-radius:14px;padding:14px 16px;margin-bottom:12px}.dd-choice-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.dd-product-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.dd-choice-card{display:block;border:2px solid #d8dfdb;border-radius:14px;padding:14px;background:#fff;cursor:pointer}.dd-choice-card.selected{border-color:#2f7e5a;background:#ebf7f0}.dd-choice-card h3{margin:8px 0}.dd-choice-card p{line-height:1.45}.dd-pick{display:block;margin-top:10px;color:#286c4e}.dd-own{display:block;margin-top:14px}.dd-own textarea{width:100%;min-height:95px;margin-top:7px}.dd-proposal-chooser .actions{margin-top:14px}.dd-product-side-panel{position:fixed;top:0;right:0;z-index:999;width:min(460px,94vw);height:100vh;background:#fff;border-left:1px solid #d8e1dc;box-shadow:-18px 0 46px rgba(20,40,55,.18);padding:18px;overflow:auto;transform:translateX(104%);transition:transform .22s ease}.dd-product-side-panel.open{transform:translateX(0)}.dd-product-assistant-list{display:grid;gap:9px;margin-top:12px}.dd-product-assistant-option{display:block;width:100%;text-align:left;border:1px solid #d8e1dc;border-radius:13px;background:#fff;padding:12px;cursor:pointer}.dd-product-assistant-option:hover{border-color:#2f7e5a;background:#eff8f3}.dd-product-assistant-option b,.dd-product-assistant-option span{display:block}.dd-product-assistant-option span{margin-top:5px;color:#53645c;line-height:1.4}@media(max-width:850px){.dd-product-grid,.dd-choice-grid{grid-template-columns:1fr}}`;document.head.appendChild(css);
})();