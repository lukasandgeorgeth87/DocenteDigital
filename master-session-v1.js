/* DocenteDigital — Sesiones Maestras v1
   Motor pedagógico de mayor profundidad para Inicial, Primaria y Secundaria.
   Integra: Prompt Maestro del proyecto, base oficial MINEDU, estrategias activas,
   complejidad progresiva por nivel, monitoreo, retroalimentación y rúbricas de aula.
*/
(function(){
  if(window.__ddMasterSessionV1)return;
  window.__ddMasterSessionV1=true;

  const E=v=>escapeHtml(v);
  const N=v=>String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const SRC=()=>window.DD_PEDAGOGICAL_SOURCES;
  const CUR=()=>window.DD_OFFICIAL_CURRICULUM;

  function band(session){
    if(session.level==='Inicial')return 'inicial';
    const gs=(session.grades||[]).map(g=>parseInt(g)||1);
    const min=Math.min(...gs),max=Math.max(...gs);
    if(session.level==='Secundaria')return max>=4?'sec-alta':'sec-base';
    if(max<=2)return 'pri-baja';
    if(min>=5)return 'pri-alta';
    if(max>=5)return 'pri-multi';
    return 'pri-media';
  }

  const VERBS={
    inicial:['observar','explorar','manipular','reconocer','agrupar','comparar','anticipar','representar','expresar','elegir'],
    'pri-baja':['observar','identificar','relacionar','representar','comparar','explicar','aplicar','comprobar'],
    'pri-media':['identificar','organizar','comparar','interpretar','representar','explicar','aplicar','verificar','justificar'],
    'pri-multi':['observar','representar','comparar','interpretar','analizar','explicar','justificar','contrastar','transferir'],
    'pri-alta':['analizar','interpretar','contrastar','argumentar','justificar','comprobar','evaluar','transferir','proponer'],
    'sec-base':['interpretar','comparar','analizar','relacionar','argumentar','justificar','comprobar','evaluar','aplicar'],
    'sec-alta':['analizar','contrastar','inferir','argumentar','fundamentar','evaluar','diseñar','proponer','transferir','crear']
  };

  function v(session,i){const a=VERBS[band(session)]||VERBS['pri-media'];return a[i%a.length];}
  function context(session){return session.brief||'la situación planteada';}
  function criterion(session,g){return typeof ddSessionCriterion==='function'?ddSessionCriterion(session,g):session.criterion||'Criterio de evaluación';}

  function highQuestions(session){
    const b=band(session);
    if(b==='inicial')return [
      '¿Qué observas y qué te hace pensar eso?',
      '¿Qué pasaría si cambiamos una parte?',
      '¿Cómo podríamos comprobarlo jugando u observando?'
    ];
    if(b==='pri-baja')return [
      '¿Cómo lo sabes?',
      '¿Qué podrías hacer de otra manera?',
      '¿Cómo comprobarías tu respuesta?'
    ];
    if(b==='pri-media')return [
      '¿Qué evidencia apoya tu respuesta?',
      '¿En qué se parecen y en qué se diferencian?',
      '¿Qué estrategia te conviene y por qué?'
    ];
    if(b==='pri-multi'||b==='pri-alta')return [
      '¿Qué evidencia sostiene tu conclusión?',
      '¿Cuál estrategia resulta más eficiente y por qué?',
      '¿Qué cambiaría si modificamos esta condición?',
      '¿Cómo transferirías lo aprendido a una situación nueva?'
    ];
    return [
      '¿Qué supuestos sostienen tu explicación?',
      '¿Qué evidencia contradice o fortalece tu conclusión?',
      '¿Qué alternativa sería más viable y con qué criterios la defenderías?',
      '¿Cómo transferirías este aprendizaje a un problema distinto?'
    ];
  }

  function communicationProcess(session){
    const comp=N(CUR()?.pickCompetence?.(session.level,session.area,session.title)?.name||session.competence);
    if(comp.includes('escribe')) return [
      ['PLANIFICACIÓN','Definen propósito, destinatario y contenido; organizan ideas con un esquema, ejemplos o modelo pertinente.'],
      ['TEXTUALIZACIÓN','Producen un primer texto tomando decisiones sobre organización, vocabulario, cohesión y convenciones según el grado.'],
      ['REVISIÓN Y REESCRITURA','Contrastan el borrador con criterios visibles, reciben retroalimentación focalizada y realizan un segundo intento mejorado.'],
      ['USO SOCIAL DEL TEXTO','Comparten, publican o usan el texto con el destinatario previsto y justifican decisiones de escritura.']
    ];
    if(comp.includes('lee')) return [
      ['ANTES DE LA LECTURA','Anticipan contenido y propósito a partir del título, imágenes, formato y saberes previos; formulan preguntas de lectura.'],
      ['DURANTE LA LECTURA','Localizan información, infieren, contrastan anticipaciones y explican cómo las pistas del texto sostienen sus interpretaciones.'],
      ['DESPUÉS DE LA LECTURA','Integran información, comparan interpretaciones, evalúan ideas o recursos del texto y transfieren lo comprendido a una nueva situación.']
    ];
    return [
      ['ANTES DEL INTERCAMBIO ORAL','Definen propósito, interlocutores, ideas y acuerdos de escucha; anticipan argumentos o información necesaria.'],
      ['DURANTE EL INTERCAMBIO','Escuchan activamente, organizan sus intervenciones, usan recursos verbales/no verbales, preguntan y responden considerando otras perspectivas.'],
      ['DESPUÉS DEL INTERCAMBIO','Evalúan claridad, pertinencia y efecto de las intervenciones; identifican evidencias y acuerdan una mejora para una nueva participación.']
    ];
  }

  function mathProcess(){
    return [
      ['COMPRENSIÓN DEL PROBLEMA','Identifican qué se busca, datos relevantes, relaciones y condiciones; reformulan el problema con sus propias palabras.'],
      ['BÚSQUEDA DE ESTRATEGIAS','Proponen más de una vía posible, anticipan resultados y eligen materiales, representaciones o procedimientos.'],
      ['REPRESENTACIÓN Y EJECUCIÓN','Modelan con material concreto, dibujos, esquemas, tablas, expresiones o procedimientos adecuados al grado.'],
      ['SOCIALIZACIÓN Y VALIDACIÓN','Comparan estrategias, analizan errores, argumentan por qué un procedimiento funciona y verifican la razonabilidad del resultado.'],
      ['FORMALIZACIÓN','El docente organiza las ideas construidas y explicita el concepto, relación, propiedad o procedimiento matemático con ejemplos y contraejemplos.'],
      ['REFLEXIÓN Y TRANSFERENCIA','Resuelven una variación o nuevo problema y explican qué conservaron o modificaron de su estrategia.']
    ];
  }

  function scienceProcess(session){
    const comp=N(CUR()?.pickCompetence?.(session.level,session.area,session.title)?.name||session.competence);
    if(comp.includes('indaga'))return [
      ['PROBLEMATIZACIÓN','Observan un fenómeno, distinguen hechos de interpretaciones y formulan una pregunta investigable.'],
      ['HIPÓTESIS O RESPUESTA INICIAL','Anticipan una explicación y la justifican con saberes previos o experiencias.'],
      ['DISEÑO DEL PLAN','Deciden qué observar, comparar o medir, qué cambiar o mantener y cómo registrar información de manera segura.'],
      ['GENERACIÓN Y REGISTRO DE DATOS','Ejecutan el plan y registran evidencias con dibujos, tablas, notas, medidas, fotografías u otros recursos pertinentes.'],
      ['ANÁLISIS Y CONTRASTACIÓN','Buscan patrones, comparan datos con la hipótesis y con fuentes verificadas; distinguen evidencia de opinión.'],
      ['CONCLUSIÓN Y COMUNICACIÓN','Formulan una conclusión que responde la pregunta, indican la evidencia que la sustenta y reconocen límites o mejoras del proceso.']
    ];
    if(comp.includes('disena')||comp.includes('diseña'))return [
      ['DETERMINACIÓN DEL PROBLEMA','Delimitan la necesidad, usuarios, condiciones y criterios que debe cumplir la solución.'],
      ['DISEÑO DE ALTERNATIVAS','Proponen, comparan y justifican alternativas mediante bocetos, esquemas o modelos.'],
      ['IMPLEMENTACIÓN Y PRUEBA','Construyen o simulan, prueban, registran fallas y realizan mejoras.'],
      ['EVALUACIÓN Y COMUNICACIÓN','Evalúan funcionamiento e impactos, justifican cambios y comunican el proceso y resultados.']
    ];
    return [
      ['PROBLEMATIZACIÓN','Analizan una situación o fenómeno y explicitan qué necesitan comprender.'],
      ['CONSTRUCCIÓN DE EXPLICACIONES','Relacionan saberes previos con información, modelos, observaciones o fuentes confiables.'],
      ['CONTRASTACIÓN CON EVIDENCIAS','Comparan explicaciones, detectan inconsistencias y ajustan sus ideas usando evidencia.'],
      ['ARGUMENTACIÓN Y TRANSFERENCIA','Sustentan una explicación y la aplican a una situación nueva o decisión del contexto.']
    ];
  }

  function socialProcess(session){
    if(session.area==='Ciencias Sociales')return [
      ['PROBLEMATIZACIÓN','Formulan una pregunta histórica, geográfica o económica vinculada a una situación relevante.'],
      ['ANÁLISIS DE FUENTES','Contrastan testimonios, datos, mapas, imágenes o documentos; identifican origen, propósito, coincidencias y diferencias.'],
      ['CONSTRUCCIÓN DE EXPLICACIONES','Relacionan causas, consecuencias, cambios, permanencias o interacciones y organizan una explicación sustentada.'],
      ['DELIBERACIÓN / TOMA DE POSICIÓN','Evalúan alternativas y sostienen una decisión o interpretación con criterios y evidencias.']
    ];
    return [
      ['PROBLEMATIZACIÓN','Analizan una situación real, identifican actores, intereses, derechos, responsabilidades o consecuencias.'],
      ['ANÁLISIS DE INFORMACIÓN','Recuperan experiencias, saberes locales y fuentes pertinentes; comparan perspectivas y distinguen hechos de opiniones.'],
      ['DELIBERACIÓN Y TOMA DE DECISIONES','Argumentan, escuchan otras posiciones, acuerdan criterios y proponen acciones orientadas al bienestar común.'],
      ['COMPROMISO Y SEGUIMIENTO','Definen una acción viable, responsables y una forma sencilla de verificar su cumplimiento.']
    ];
  }

  function genericProcess(session){
    return [
      ['EXPLORACIÓN DEL RETO',`${cap(v(session,0))} información, ejemplos o experiencias relacionadas con ${context(session)} para reconocer el reto y activar saberes relevantes.`],
      ['CONSTRUCCIÓN Y PRODUCCIÓN',`${cap(v(session,3))} una respuesta, producto o actuación mediante recursos pertinentes y colaboración según el propósito.`],
      ['REVISIÓN CON CRITERIOS',`${cap(v(session,6))} la producción con el criterio, identificar una mejora y realizar un nuevo intento.`],
      ['TRANSFERENCIA',`${cap(v(session,8))} lo aprendido en una situación distinta y explicar qué decisiones se mantuvieron o cambiaron.`]
    ];
  }
  function cap(x){return x.charAt(0).toUpperCase()+x.slice(1);}

  function processes(session){
    if(session.area==='Comunicación'||session.area==='Castellano como Segunda Lengua'||session.area==='Inglés como Lengua Extranjera')return communicationProcess(session);
    if(session.area==='Matemática')return mathProcess();
    if(session.area==='Ciencia y Tecnología')return scienceProcess(session);
    if(['Personal Social','Desarrollo Personal, Ciudadanía y Cívica','Ciencias Sociales'].includes(session.area))return socialProcess(session);
    return genericProcess(session);
  }

  function learnerAction(session,index,process){
    const verb=cap(v(session,index+2));
    const what=process[1].replace(/[.]$/,'').toLowerCase();
    const form=index%3===0?'en parejas y luego en plenaria':index%3===1?'de manera individual y después contrastando con un compañero':'en equipos con roles definidos';
    const resource=session.resourcesList?.length?session.resourcesList[index%session.resourcesList.length]:'material o recurso disponible';
    return `${verb} ${what}, ${form}, para producir evidencia vinculada al criterio, usando ${resource} cuando aporte al aprendizaje.`;
  }

  function startActions(session){
    const q=highQuestions(session);
    return [
      `El docente presenta un estímulo auténtico —objeto, imagen, dato, caso, breve texto o situación del contexto— relacionado con <b>${E(context(session))}</b>; los estudiantes <b>${E(v(session,0))}</b> y expresan qué reconocen sin recibir todavía la respuesta.`,
      `Los estudiantes realizan una activación breve: ${E(band(session)==='inicial'?'exploran, señalan, representan o dramatizan':'piensan individualmente, registran una idea y la contrastan con un compañero')} para recuperar saberes previos.`,
      `El docente recoge varias respuestas y verifica comprensión mediante mini pizarra, tarjetas, dibujo, ejemplo/no ejemplo o respuesta de un minuto; decide si necesita modelar, preguntar de nuevo o avanzar.`,
      `Se explicitan el propósito y la utilidad del aprendizaje en lenguaje comprensible, vinculándolos con una decisión, producto o situación real.`,
      `Se presentan los criterios de evaluación con un ejemplo de lo esperado y un ejemplo que todavía necesita mejora; los estudiantes explican con sus palabras qué deberán demostrar.`,
      `Se plantea el reto central y se formula la pregunta: <b>${E(q[0])}</b>`,
      `Se acuerda cómo participar, escuchar, pedir ayuda y aprovechar el error como información para aprender; el docente anticipa la organización de grupos, estaciones o atención diferenciada.`
    ];
  }

  function gradeDepth(session,g){
    const n=parseInt(g)||0;
    if(session.level==='Inicial'||/años/.test(g))return 'explora, manipula, observa, expresa oralmente, representa con dibujo/movimiento y compara con apoyo';
    if(n<=2)return 'representa con material, dibujo o palabras; explica oralmente y comprueba con apoyo';
    if(n<=4)return 'organiza información, interpreta, compara procedimientos y explica con evidencias';
    if(session.level==='Primaria')return 'analiza, justifica, contrasta, verifica y transfiere a una situación nueva';
    if(n<=2)return 'interpreta fuentes o datos, relaciona conceptos y argumenta con evidencia';
    return 'analiza críticamente, contrasta fuentes o estrategias, fundamenta decisiones, evalúa límites y propone alternativas';
  }

  function adai(session,processIndex){
    const grades=session.grades||[];
    if(session.level!=='Primaria'||grades.length<2)return '';
    const focus=grades[processIndex%grades.length];
    const rest=grades.filter(g=>g!==focus);
    return `<div class="dd-adai"><b>Atención simultánea AD/AI:</b> el docente realiza Atención Directa con <b>${E(focus)}</b>: observa procedimientos, formula una repregunta de comprensión, recoge evidencia del criterio y retroalimenta por descubrimiento. Mientras tanto, ${rest.map(g=>`<b>${E(g)}</b> trabaja en Atención Indirecta: ${E(gradeDepth(session,g))}`).join('; ')}. Luego rota la atención para que ningún grado quede esperando.</div>`;
  }

  function developmentRows(session){
    const ps=processes(session);
    const q=highQuestions(session);
    const rows=[];
    ps.forEach((p,i)=>{
      rows.push(`<div class="dd-master-process"><h4>PROCESO ${i+1} — ${E(p[0])}</h4>
        <p><b>Acción cognitiva principal:</b> ${E(learnerAction(session,i,p))}</p>
        <p><b>Mediación docente:</b> modela solo lo necesario, observa estrategias, contrasta producciones y formula preguntas que obliguen a explicar decisiones, no a adivinar la respuesta.</p>
        <p><b>Pregunta de alta demanda:</b> <strong>${E(q[i%q.length])}</strong></p>
        ${adai(session,i)}
        <p><b>Monitoreo y retroalimentación:</b> revisa una evidencia breve, describe un avance concreto, formula una pregunta o pista y exige un <b>segundo intento</b> para que la retroalimentación produzca mejora observable.</p>
      </div>`);
      if(i<ps.length-1 && i%2===1){
        rows.push(`<div class="dd-microstrategy"><b>Microestrategia de variación:</b> cambian de canal mediante galería breve, comparación de soluciones, tutoría entre pares, estación, mini debate, clasificación, manipulación o análisis de un error, según el área y los recursos disponibles.</div>`);
      }
    });
    return rows.join('');
  }

  function differentiatedBlock(session){
    const rows=(session.grades||[]).map(g=>`<tr><td><b>${E(g)}</b></td><td>${E(gradeDepth(session,g))}</td><td>${E(criterion(session,g))}</td></tr>`).join('');
    return `<h4>Diferenciación cognitiva por grado/edad</h4>${table(rows,['Grado/edad','Nivel de actuación esperado','Criterio contextualizado'])}`;
  }

  function closeActions(session){
    const q=highQuestions(session);
    return [
      'Los estudiantes socializan dos o más producciones seleccionadas por representar estrategias distintas; el grupo identifica fortalezas y oportunidades de mejora usando el criterio.',
      'Cada estudiante señala una evidencia concreta de su aprendizaje y realiza una autoevaluación breve: logrado, en proceso o necesito apoyo, explicando por qué.',
      `El docente recupera un error interesante sin señalar al autor y pregunta: <b>${E(q[Math.min(1,q.length-1)])}</b>; el grupo propone cómo mejorarlo.`,
      'Los estudiantes realizan un microreto o transferencia que cambia un dato, condición, destinatario, contexto o fuente para verificar si el aprendizaje puede usarse fuera del ejemplo inicial.',
      'Cierre metacognitivo: explican qué estrategia utilizaron, qué dificultad enfrentaron, qué cambio hicieron después de la retroalimentación y cuál sería su próximo paso.',
      'El docente cierra con reconocimiento descriptivo del esfuerzo, la colaboración y las decisiones de aprendizaje, sin comparaciones entre estudiantes.'
    ];
  }

  function table(rows,heads){return `<div class="dd-scroll"><table class="dd-table"><thead><tr>${heads.map(h=>`<th>${E(h)}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>`;}

  function momentsHtml(session){
    const start=startActions(session);
    const close=closeActions(session);
    const body=`
      <tr><td><b>INICIO</b><br><small>Involucramiento, propósito y reto</small></td><td><ul>${start.map(x=>`<li>${x}</li>`).join('')}</ul></td><td>${session.times?.start||15} min</td></tr>
      <tr><td><b>DESARROLLO</b><br><small>Procesos del área, mediación y evaluación formativa</small></td><td>
        ${developmentRows(session)}
        ${differentiatedBlock(session)}
      </td><td>${session.times?.dev||60} min</td></tr>
      <tr><td><b>CIERRE</b><br><small>Metacognición, mejora y transferencia</small></td><td><ul>${close.map(x=>`<li>${x}</li>`).join('')}</ul></td><td>${session.times?.close||15} min</td></tr>`;
    return `<h2>6. MOMENTOS DE LA SESIÓN</h2>${table(body,['MOMENTOS','ESTRATEGIAS / ACTIVIDADES','TIEMPO'])}`;
  }

  function selectedVisualForSession(session){
    try{
      const r=JSON.parse(localStorage.getItem('docenteDigitalSelectedResource')||'null');
      if(!r||!r.previewUrl)return null;
      if(r.selectedForSessionId&&session?.id&&r.selectedForSessionId!==session.id)return null;
      return r;
    }catch{return null;}
  }

  function coverVisualHtml(session){
    const r=selectedVisualForSession(session);
    if(!r)return '';
    return `<div class="dd-session-cover-visual">
      <a href="${E(r.previewUrl)}" target="_blank" rel="noopener noreferrer">
        <img src="${E(r.previewUrl)}" alt="${E(r.title||'Imagen de referencia')}" loading="lazy">
      </a>
      <div><b>${E(r.title||'Imagen de referencia')}</b><br><small>Miniatura real de referencia · <a href="${E(r.previewUrl)}" target="_blank" rel="noopener noreferrer">abrir imagen</a></small></div>
    </div>`;
  }

  function officialSources(session){
    const base=SRC();
    if(!base)return '';
    const srcs=base.official.filter(x=>(x.level==='Todos'||x.level===session.level)&&['curriculo','planificacion','multigrado','didactica','rubrica-docente'].includes(x.kind));
    const limited=srcs.slice(0,6);
    return `<div class="dd-sources"><h3>BASE DOCUMENTAL UTILIZADA / A CONSULTAR</h3><ul>${limited.map(s=>`<li><a href="${E(s.url)}" target="_blank" rel="noopener noreferrer">${E(s.title)}</a> — ${E(s.authority)} (${E(s.year)})</li>`).join('')}</ul><p><small>Los referentes complementarios orientan estrategias; si existe contradicción, prevalece MINEDU y la unidad/proyecto vigente.</small></p></div>`;
  }

  function verifiedMaterials(session){
    const base=SRC();
    if(!base)return '';
    const mats=base.materialFor(session.level,session.area,session.grades);
    if(!mats.length)return `<div class="dd-material-note"><b>Materiales MINEDU:</b> no se consigna libro, ficha ni página específica mientras no esté verificada para este nivel, grado, área y propósito.</div>`;
    return `<div class="dd-material-note"><b>Materiales MINEDU verificados disponibles:</b><ul>${mats.map(m=>`<li><a href="${E(m.url)}" target="_blank" rel="noopener noreferrer">${E(m.title)}</a></li>`).join('')}</ul><small>La app no inventa páginas: la selección de una página concreta requiere verificación previa.</small></div>`;
  }

  function internalQualityAudit(session){
    const base=SRC();
    const checks={
      activeParticipation:true,
      reasoningAndCriticalThinking:highQuestions(session).length>=3,
      formativeAssessment:true,
      respectAndProximity:true,
      positiveRegulation:true,
      differentiatedAttention:(session.level!=='Primaria'||(session.grades||[]).length<2)||Boolean(adai(session,0)),
      secondAttempt:true,
      officialCurriculum:Boolean(CUR()?.verified)
    };
    session._qualityAudit={
      at:new Date().toISOString(),
      rubricReference:base?.rubric2025||[],
      checks,
      passed:Object.values(checks).every(Boolean)
    };
    try{
      const key='ddHiddenQualityAudits';
      const all=JSON.parse(localStorage.getItem(key)||'{}');
      all[session.id]=session._qualityAudit;
      localStorage.setItem(key,JSON.stringify(all));
    }catch(_e){}
    return session._qualityAudit;
  }

  const prev=window.sessionHtml;
  if(typeof prev==='function'){
    window.sessionHtml=function(session,forWord=false){
      let html=prev(session,forWord);
      const cover=coverVisualHtml(session);
      if(cover){
        const titleNeedle=`<h2 style="text-align:center">“${E(session.title)}”</h2>`;
        if(html.includes(titleNeedle))html=html.replace(titleNeedle,titleNeedle+cover);
      }
      const master=momentsHtml(session);
      const re=/<h2>6\. MOMENTOS DE LA SESIÓN<\/h2>[\s\S]*?(?=<h2>7\. INSTRUMENTO DE EVALUACIÓN<\/h2>)/;
      if(re.test(html))html=html.replace(re,master);
      else html+=master;
      internalQualityAudit(session);
      const extras=verifiedMaterials(session)+officialSources(session);
      if(html.includes('<h2>9. MATERIALES / ANEXOS</h2>')){
        html=html.replace('<h2>9. MATERIALES / ANEXOS</h2>','<h2>9. MATERIALES / ANEXOS</h2>'+extras);
      }else html+=extras;
      return html;
    };
  }

  const style=document.createElement('style');
  style.textContent=`
    .dd-master-process{padding:10px 12px;margin:10px 0;border-left:4px solid #2e7656;background:#f7fbf8;border-radius:8px}
    .dd-master-process h4{margin:0 0 6px;color:#245c46}.dd-master-process p{margin:6px 0}
    .dd-microstrategy{padding:9px 11px;margin:8px 0;background:#fff8df;border:1px solid #ead58b;border-radius:9px}
    .dd-adai{padding:8px 10px;background:#eef4ff;border:1px solid #c8d7ef;border-radius:8px;margin:7px 0}
    .dd-sources,.dd-material-note{padding:10px 12px;margin:10px 0;border:1px solid #d7e2dc;border-radius:10px;background:#fbfdfc}
    .dd-sources a,.dd-material-note a{color:#205d46;font-weight:700}
    .dd-session-cover-visual{display:grid;grid-template-columns:120px 1fr;gap:12px;align-items:center;margin:10px auto 14px;max-width:650px;padding:8px;border:1px solid #d7e2dc;border-radius:12px;background:#fbfdfc}
    .dd-session-cover-visual img{width:120px;height:88px;object-fit:cover;border-radius:9px;display:block}
    .dd-session-cover-visual a{color:#205d46;font-weight:700}
    @media(max-width:600px){.dd-session-cover-visual{grid-template-columns:90px 1fr}.dd-session-cover-visual img{width:90px;height:70px}}
    .dd-table ul{margin:0;padding-left:18px}.dd-table li{margin:5px 0}
  `;
  document.head.appendChild(style);
})();