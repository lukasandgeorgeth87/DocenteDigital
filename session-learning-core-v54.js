/* DocenteDigital – Núcleo de Sesión de Aprendizaje v54
   Cadena de coherencia de corto plazo:
   datos/contexto heredado → título de la actividad → propósito (qué + cómo + para qué)
   → competencia/desempeño pertinente → criterio → evidencia → secuencia didáctica
   → evaluación formativa.

   Reglas:
   - La sesión nace de la Unidad/Proyecto y de la actividad programada; no vuelve a inventar otro tema.
   - El título comunica la actividad principal y debe conservar acción + contenido; la condición/finalidad
     se incorpora cuando aporta claridad, sin convertir todos los títulos en fórmulas rígidas.
   - El propósito responde: ¿qué aprenderán?, ¿cómo lo harán?, ¿para qué?
   - Capacidades y desempeños oficiales se heredan cuando existen en la planificación; no se inventan.
   - El criterio es observable y medible; la evidencia demuestra ese mismo aprendizaje.
   - Inicio, desarrollo, cierre y retroalimentación deben responder al mismo propósito/criterio/evidencia.
*/
(function(){
  if(window.__ddSessionLearningCoreV54)return;window.__ddSessionLearningCoreV54=true;
  if(typeof state!=='object')return;
  const tidy=v=>String(v??'').replace(/\s+/g,' ').trim();
  const norm=v=>tidy(v).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const esc=v=>typeof window.escapeHtml==='function'?window.escapeHtml(String(v??'')):String(v??'');
  const cap=s=>{s=tidy(s);return s?s[0].toUpperCase()+s.slice(1):s;};

  function currentSelection(){
    try{if(typeof window.selectedActivity==='function')return window.selectedActivity()||{};}catch(e){}
    const unit=(state.units||[]).find(u=>u.id===document.getElementById('sessionUnit')?.value)||null;
    const index=parseInt(document.getElementById('activity')?.value||'0',10);
    return{unit,activity:unit?.activities?.[index]||unit?.activities?.[0]||null};
  }

  function shortFocus(title,unit,session){
    const t=tidy(title||session?.title||'');
    const stripped=t
      .replace(/^(?:conversamos|dialogamos|escuchamos|leemos|escribimos|revisamos|producimos|resolvemos|representamos|medimos|calculamos|comparamos|investigamos|indagamos|observamos|explicamos|analizamos|elaboramos|organizamos|valoramos|reconocemos|reflexionamos|exploramos|identificamos|registramos|comunicamos|compartimos)\s+/i,'')
      .replace(/[.!?]+$/,'').trim();
    if(stripped&&stripped.length<=115)return stripped;
    const semantic=unit?.semanticProfile||unit?.planningMeaning||{};
    const f=tidy(semantic.focus||semantic.contextConcepts?.[0]||unit?.title||session?.brief||'');
    return (f.length>115?f.slice(0,115).replace(/\s+\S*$/,''):f)||'la actividad de aprendizaje';
  }

  function communicationMode(title){
    const s=norm(title);
    if(/convers|dialog|escuch|oral|expon|present|entrevist/.test(s))return'oral';
    if(/leemos|leer|lectura|comprend|texto.*le/.test(s))return'lectura';
    if(/escrib|redact|produc.*texto|revis.*texto|afiche|articulo|cuento|carta|noticia/.test(s))return'escritura';
    return'comunicación';
  }

  function purposeParts(area,title,focus){
    const a=norm(area),mode=communicationMode(title);
    if(a==='comunicacion'){
      if(mode==='oral')return{what:`comunicar información relevante sobre ${focus}`,how:'dialogando, organizando sus ideas, escuchando y respondiendo de manera pertinente',forWhat:'compartir y contrastar sus saberes con claridad y respeto'};
      if(mode==='lectura')return{what:`comprender información relevante de textos vinculados con ${focus}`,how:'anticipando, localizando información, realizando inferencias y sustentando sus respuestas con el texto',forWhat:'construir y comunicar una comprensión pertinente de lo leído'};
      if(mode==='escritura')return{what:`producir y mejorar un texto relacionado con ${focus}`,how:'planificando, escribiendo, revisando y adecuando el texto al propósito y destinatario',forWhat:'comunicar sus ideas de manera clara y con sentido'};
      return{what:`comunicar y comprender información sobre ${focus}`,how:'leyendo, dialogando o produciendo textos según la actividad prevista',forWhat:'expresar y construir aprendizajes con un propósito comunicativo'};
    }
    if(a==='matematica')return{what:`resolver una situación problemática vinculada con ${focus}`,how:'usando estrategias, representaciones y procedimientos pertinentes, y verificando sus resultados',forWhat:'explicar y sustentar una solución que tenga sentido en el contexto planteado'};
    if(a==='ciencia y tecnologia')return{what:`indagar y construir una explicación sobre ${focus}`,how:'formulando preguntas, observando o recogiendo evidencias y contrastando sus ideas con los resultados o fuentes pertinentes',forWhat:'explicar lo aprendido mediante evidencias y conclusiones sustentadas'};
    if(a==='personal social')return{what:`comprender y sustentar ideas, acuerdos o decisiones relacionados con ${focus}`,how:'analizando experiencias, información y diferentes puntos de vista del contexto',forWhat:'participar y tomar decisiones responsables y pertinentes'};
    if(a==='ciencias sociales')return{what:`analizar y explicar una situación relacionada con ${focus}`,how:'interpretando información y contrastando fuentes o evidencias pertinentes',forWhat:'construir una explicación o posición sustentada'};
    if(a==='dpcc')return{what:`analizar y sustentar decisiones relacionadas con ${focus}`,how:'dialogando, contrastando perspectivas y considerando derechos, responsabilidades y bien común',forWhat:'actuar de manera responsable y argumentada'};
    if(a==='arte y cultura')return{what:`explorar y expresar aprendizajes relacionados con ${focus}`,how:'experimentando con lenguajes, materiales, técnicas o manifestaciones artísticas pertinentes',forWhat:'crear o comunicar una producción artística con intención'};
    if(a==='educacion fisica')return{what:`desarrollar acciones motrices vinculadas con ${focus}`,how:'participando en situaciones de movimiento, cooperación y toma de decisiones acordes con sus posibilidades',forWhat:'mejorar su desempeño, autonomía y convivencia durante la actividad física'};
    if(a==='educacion religiosa')return{what:`comprender y reflexionar sobre ${focus}`,how:'dialogando, relacionando experiencias y analizando mensajes o situaciones desde la formación religiosa prevista',forWhat:'expresar compromisos y decisiones coherentes con lo aprendido'};
    if(a==='psicomotriz')return{what:`desenvolverse corporalmente en situaciones relacionadas con ${focus}`,how:'explorando movimientos, espacios, objetos y posibilidades de acción con autonomía',forWhat:'expresar, coordinar y ampliar sus posibilidades motrices'};
    return{what:`desarrollar el aprendizaje previsto sobre ${focus}`,how:'participando en una tarea auténtica, usando estrategias pertinentes y explicando sus decisiones',forWhat:'demostrar lo aprendido mediante una actuación o producción observable'};
  }

  function purposeText(parts){return `${cap(parts.what)}, ${parts.how}, para ${parts.forWhat}.`;}

  function criterionForSession(area,title,focus,existing){
    const a=norm(area),mode=communicationMode(title);
    if(a==='comunicacion'){
      if(mode==='oral')return `Comunica información relevante sobre ${focus}, mantiene el tema e interactúa escuchando y respondiendo de manera pertinente.`;
      if(mode==='lectura')return `Identifica e interpreta información relevante del texto sobre ${focus} y sustenta sus respuestas con información del texto.`;
      if(mode==='escritura')return `Produce un texto sobre ${focus} adecuado al propósito y destinatario, organiza sus ideas y lo revisa para mejorar su claridad.`;
    }
    if(a==='matematica')return `Resuelve la situación vinculada con ${focus} usando una estrategia o representación pertinente y explica cómo obtuvo y verificó su respuesta.`;
    if(a==='ciencia y tecnologia')return `Obtiene y registra evidencias sobre ${focus}, las utiliza para construir una explicación o conclusión y comunica lo encontrado.`;
    if(a==='personal social')return `Explica y sustenta una idea, acuerdo o decisión relacionada con ${focus}, considerando la información y el contexto analizados.`;
    const old=tidy(existing);
    if(old&&old.length<=220&&!/la situación de nuestra comunidad|desarrolla la competencia priorizada/i.test(old))return old;
    return `Realiza y explica una actuación o producción relacionada con ${focus}, aplicando el aprendizaje previsto y el criterio comunicado.`;
  }

  function evidenceForSession(area,title,focus,existing){
    const a=norm(area),mode=communicationMode(title);
    if(a==='comunicacion'&&mode==='oral')return `Registro oral, gráfico o escrito de las ideas y conclusiones comunicadas sobre ${focus}.`;
    if(a==='comunicacion'&&mode==='lectura')return `Respuestas u organizador de lectura con información e interpretaciones sustentadas sobre ${focus}.`;
    if(a==='comunicacion'&&mode==='escritura')return `Texto producido y revisado sobre ${focus}, adecuado al propósito y destinatario.`;
    if(a==='matematica')return `Resolución del reto sobre ${focus} con representación o procedimiento y explicación de la respuesta.`;
    if(a==='ciencia y tecnologia')return `Registro de observaciones o datos y explicación/conclusión sustentada sobre ${focus}.`;
    if(a==='personal social')return `Conclusión, acuerdo, registro o propuesta sustentada relacionada con ${focus}.`;
    const old=tidy(existing);
    if(old&&old.length<=180&&!/producción o desempeño observable/i.test(old))return old;
    return `Producción o actuación observable que muestre el aprendizaje logrado sobre ${focus}.`;
  }

  function matchUnitPurpose(unit,area){
    const list=Array.isArray(unit?.purposes)?unit.purposes:[];
    const n=norm(area);
    return list.find(p=>norm(p.area||p.subject||'')===n)||list.find(p=>norm(p.area||p.subject||'').includes(n))||null;
  }

  function inheritCurriculum(unit,area,session){
    const p=matchUnitPurpose(unit,area)||{};
    const competence=tidy(p.competence||p.competencia||session.competence||'');
    const capacities=p.capacities||p.capacidades||p.capacity||p.capacidad||[];
    const performance=tidy(p.performance||p.desempeno||p['desempeño']||p.precisedPerformance||p.desempenoPrecisado||'');
    const approaches=unit?.transversalApproaches||unit?.approaches||unit?.enfoques||[];
    return{competence,capacities:Array.isArray(capacities)?capacities:(tidy(capacities)?[tidy(capacities)]:[]),performance,approaches:Array.isArray(approaches)?approaches:(tidy(approaches)?[tidy(approaches)]:[]),officialFieldsInherited:!!(p&&Object.keys(p).length)};
  }

  function informativeData(session){
    const master=state.institutionMaster||state.institutionProfile||{};
    return{
      institution:tidy(master.schoolName||master.ieName||state.schoolName||''),
      teacher:tidy(master.teacherName||state.teacherName||''),
      level:tidy(session.level||state.level||''),
      area:tidy(session.area||''),
      grades:Array.isArray(session.grades)?session.grades.slice():[],
      section:tidy(session.section||master.section||''),
      date:tidy(session.date||session.activityDate||''),
      duration:tidy(session.duration||'')
    };
  }

  function audit(session,unit,activity){
    const focus=shortFocus(activity?.title,unit,session),parts=session.learningPurposeParts||purposeParts(session.area,session.title,focus),issues=[];
    if(tidy(session.title).length<8)issues.push('El título no comunica con suficiente claridad la actividad principal.');
    if(!parts.what||!parts.how||!parts.forWhat)issues.push('El propósito no responde claramente qué, cómo y para qué.');
    if(!tidy(session.competence))issues.push('Falta competencia priorizada.');
    if(!tidy(session.criterion))issues.push('Falta criterio de evaluación.');
    if(!tidy(session.evidence))issues.push('Falta evidencia de aprendizaje.');
    if(!tidy(session.instrument))issues.push('Falta instrumento de evaluación.');
    if(!unit)issues.push('La sesión no está vinculada a una Unidad/Proyecto.');
    if(!activity)issues.push('La sesión no está vinculada a una actividad programada.');
    return{ok:issues.length===0,issues,focus,chain:['actividad programada','título','propósito qué-cómo-para qué','competencia/desempeño','criterio','evidencia','secuencia didáctica','evaluación formativa']};
  }

  function enrich(session){
    if(!session||typeof session!=='object')return session;
    const {unit,activity}=currentSelection();
    const title=tidy(session.title||activity?.title||'');
    const focus=shortFocus(title,unit,session);
    const parts=purposeParts(session.area,title,focus);
    session.activityTitle=tidy(activity?.title||title);
    session.sessionFocus=focus;
    session.learningPurposeParts=parts;
    session.purpose=purposeText(parts);
    session.criterion=criterionForSession(session.area,title,focus,session.criterion);
    session.evidence=evidenceForSession(session.area,title,focus,session.evidence);
    const curriculum=inheritCurriculum(unit,session.area,session);
    if(curriculum.competence)session.competence=curriculum.competence;
    session.capacities=curriculum.capacities;
    session.precisedPerformance=curriculum.performance;
    session.transversalApproaches=curriculum.approaches;
    session.curriculumInheritance={officialFieldsInherited:curriculum.officialFieldsInherited,doNotInventMissing:true};
    session.informativeData=informativeData(session);
    session.sessionPedagogicalChain='actividad programada → título → propósito → competencia/desempeño → criterio → evidencia → secuencia didáctica → evaluación formativa';
    session.sequenceContract={
      start:'Conectar con la experiencia, recuperar saberes previos, comunicar propósito y criterio y presentar el reto o actividad con sentido.',
      development:'Movilizar la competencia mediante procesos/estrategias pertinentes al área, recoger evidencias, diferenciar apoyos y retroalimentar durante la tarea.',
      closure:'Socializar o revisar la evidencia, contrastarla con el criterio, promover metacognición y acordar el siguiente paso de mejora.'
    };
    session.sessionAuditV54=audit(session,unit,activity);
    return session;
  }

  const baseBuild=window.buildSession;
  if(typeof baseBuild==='function')window.buildSession=function(){
    const session=baseBuild.apply(this,arguments);
    enrich(session);
    if(typeof save==='function'){state.lastSession=session;save();}
    return session;
  };

  // Añade únicamente datos informativos/curriculares que ya existen; no muestra diagnósticos técnicos.
  const baseHtml=window.sessionHtml;
  if(typeof baseHtml==='function')window.sessionHtml=function(session,forWord=false){
    enrich(session);
    let html=baseHtml.apply(this,arguments);
    const d=session.informativeData||{},extra=[];
    if(d.institution)extra.push(`<b>IE:</b> ${esc(d.institution)}`);
    if(d.teacher)extra.push(`<b>Docente:</b> ${esc(d.teacher)}`);
    if(d.date)extra.push(`<b>Fecha:</b> ${esc(d.date)}`);
    if(extra.length&&html.includes(`<h2>${esc(session.title)}</h2>`))html=html.replace(`<h2>${esc(session.title)}</h2>`,`<h2>${esc(session.title)}</h2><p>${extra.join(' &nbsp; ')}</p>`);
    const curricular=[];
    if(session.capacities?.length)curricular.push(`<p><b>Capacidades:</b> ${esc(session.capacities.join(' · '))}</p>`);
    if(session.precisedPerformance)curricular.push(`<p><b>Desempeño precisado:</b> ${esc(session.precisedPerformance)}</p>`);
    if(session.transversalApproaches?.length)curricular.push(`<p><b>Enfoques transversales:</b> ${esc(session.transversalApproaches.join(' · '))}</p>`);
    if(curricular.length&&html.includes('<p><b>Propósito:</b>'))html=html.replace('<p><b>Propósito:</b>',curricular.join('')+'<p><b>Propósito:</b>');
    return html;
  };

  window.ddSessionLearningCore={enrich,audit,purposeParts,criterionForSession,evidenceForSession,principle:'título → propósito (qué, cómo, para qué) → competencia/desempeño → criterio → evidencia → secuencia → evaluación'};
})();