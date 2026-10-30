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

  function currentSelection(session){
    // Al reabrir una sesión, nunca usar una unidad/actividad distinta por
    // el solo hecho de que el selector visual apunte ahora a otra.
    if(session?.unitId){
      const unit=(state.units||[]).find(u=>u.id===session.unitId)||null;
      const original=session.activitySnapshot||null;
      const activity=original||unit?.activities?.[session.activityIndex]
        ||unit?.activities?.find(a=>a.title===session.activityTitle&&a.area===session.area)
        ||{title:session.activityTitle||session.title,area:session.area};
      return{unit,activity};
    }
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
    const contextual=tidy(unit?.contextFocus||window.ddContextTopic?.(session?.brief||'')||'');
    if(contextual&&/^(?:textos? vinculados? con|relatos e imágenes vinculadas con|relatos y exploramos imágenes vinculadas con|problemas? de cantidad vinculados? con)\b/i.test(stripped))return contextual;
    if(stripped&&stripped.length<=115)return stripped;
    const semantic=unit?.semanticProfile||unit?.planningMeaning||{};
    const f=tidy(contextual||semantic.focus||semantic.contextConcepts?.[0]||session?.brief||unit?.title||'');
    return (f.length>115?f.slice(0,115).replace(/\s+\S*$/,''):f)||'la actividad de aprendizaje';
  }

  function communicationMode(title){
    // Un solo clasificador curricular para propósito, criterio y competencia.
    // Evita que «Escribimos un texto y luego lo leemos» sea lectura por
    // contener la palabra «leemos» al final.
    const official=window.DD_OFFICIAL_CURRICULUM?.communicationModeFromTitle;
    if(typeof official==='function'){
      const mode=official(title);
      return mode==='indefinido'?'comunicación':mode;
    }
    const s=norm(title);
    if(/convers|dialog|escuch|oral|expon|present|entrevist/.test(s))return'oral';
    if(/leemos|leer|lectura|comprend|texto.*le/.test(s))return'lectura';
    if(/escrib|redact|produc.*texto|revis.*texto|afiche|articulo|cuento|carta|noticia/.test(s))return'escritura';
    return'comunicación';
  }

  function mathematicsMode(title){
    const resolve=window.DD_OFFICIAL_CURRICULUM?.mathematicsModeFromTitle;
    return typeof resolve==='function'?resolve(title):'indefinido';
  }

  function scienceMode(title){
    const f=window.DD_OFFICIAL_CURRICULUM?.scienceModeFromTitle;
    return typeof f==='function'?f(title):'indefinido';
  }

  function personalSocialMode(title){
    const f=window.DD_OFFICIAL_CURRICULUM?.personalSocialModeFromTitle;
    return typeof f==='function'?f(title):'indefinido';
  }

  function purposeParts(area,title,focus,level='Primaria'){
    const a=norm(area),mode=communicationMode(title);
    if(level==='Inicial'){
      if(a==='comunicacion'){
        if(mode==='lectura')return{what:`explorar relatos, imágenes y textos cercanos sobre ${focus}`,how:'observando ilustraciones, anticipando de qué pueden tratar, escuchando lecturas compartidas y conversando sobre lo comprendido',forWhat:'comunicar sus ideas e interpretaciones mediante palabras, gestos o dibujos'};
        if(mode==='escritura')return{what:`comunicar ideas sobre ${focus}`,how:'dibujando, haciendo trazos o escrituras espontáneas y dictando mensajes al docente según sus posibilidades',forWhat:'expresar lo que desean comunicar a un destinatario cercano'};
        return{what:`expresar y escuchar ideas sobre ${focus}`,how:'conversando, narrando experiencias, escuchando a sus compañeros y apoyándose en imágenes, juegos o movimientos',forWhat:'compartir lo que piensan, sienten y descubren con confianza y respeto'};
      }
      if(a==='matematica')return{what:`explorar cantidades, formas o relaciones vinculadas con ${focus}`,how:'jugando, agrupando, comparando y representando con objetos y material concreto',forWhat:'explicar sus descubrimientos mediante acciones, palabras o gestos'};
      if(a==='ciencia y tecnologia')return{what:`explorar y descubrir características o cambios relacionados con ${focus}`,how:'observando objetos y materiales seguros, formulando preguntas y comparando lo que sucede',forWhat:'compartir sus hallazgos a través de dibujos, palabras o representaciones'};
      if(a==='arte y cultura')return{what:`expresar ideas y sensaciones relacionadas con ${focus}`,how:'explorando libremente materiales, colores, sonidos, movimientos o formas',forWhat:'crear y compartir producciones propias'};
    }
    if(a==='comunicacion'){
      if(mode==='oral')return{what:`comunicar información relevante sobre ${focus}`,how:'dialogando, organizando sus ideas, escuchando y respondiendo de manera pertinente',forWhat:'compartir y contrastar sus saberes con claridad y respeto'};
      if(mode==='lectura')return{what:`comprender información relevante de textos vinculados con ${focus}`,how:'anticipando, localizando información, realizando inferencias y sustentando sus respuestas con el texto',forWhat:'construir y comunicar una comprensión pertinente de lo leído'};
      if(mode==='escritura')return{what:`producir y mejorar un texto relacionado con ${focus}`,how:'planificando, escribiendo, revisando y adecuando el texto al propósito y destinatario',forWhat:'comunicar sus ideas de manera clara y con sentido'};
      return{what:`comunicar y comprender información sobre ${focus}`,how:'leyendo, dialogando o produciendo textos según la actividad prevista',forWhat:'expresar y construir aprendizajes con un propósito comunicativo'};
    }
    if(a==='matematica'){
      if(level==='Primaria'){
        const mode=mathematicsMode(title);
        if(mode==='cantidad')return{what:`resolver una situación de cantidades o mediciones vinculada con ${focus}`,how:'representando cantidades, eligiendo operaciones y verificando resultados con procedimientos adecuados al grado',forWhat:'explicar y sustentar por qué la respuesta tiene sentido en el contexto'};
        if(mode==='regularidad')return{what:`reconocer y resolver equivalencias, patrones o relaciones de cambio sobre ${focus}`,how:'organizando datos de la regularidad, representando la regla y comprobándola con casos',forWhat:'explicar cómo se mantiene o cambia la relación'};
        if(mode==='forma')return{what:`resolver una situación sobre formas, medidas espaciales o ubicación en ${focus}`,how:'modelando objetos o recorridos y utilizando dibujos, material concreto e instrumentos pertinentes',forWhat:'justificar las propiedades o relaciones espaciales empleadas'};
        if(mode==='datos')return{what:`recoger, representar o interpretar datos sobre ${focus}`,how:'usando tablas, gráficos o situaciones de incertidumbre acordes al grado',forWhat:'fundamentar una conclusión o decisión con los datos'};
      }
      return{what:`resolver una situación problemática vinculada con ${focus}`,how:'usando estrategias, representaciones y procedimientos pertinentes, y verificando sus resultados',forWhat:'explicar y sustentar una solución que tenga sentido en el contexto planteado'};
    }
    if(a==='ciencia y tecnologia'){
      if(level==='Primaria'){
        const sm=scienceMode(title);
        if(sm==='indaga')return{what:`indagar una pregunta investigable relacionada con ${focus}`,how:'planteando predicciones, planificando la obtención de información, registrando datos y contrastándolos con lo esperado',forWhat:'sustentar conclusiones y reconocer qué se observó y qué falta comprobar'};
        if(sm==='explica')return{what:`explicar un fenómeno o relación científica vinculada con ${focus}`,how:'analizando fuentes confiables y evidencias pertinentes y relacionándolas con conocimientos científicos',forWhat:'fundamentar una explicación y valorar sus implicancias'};
        if(sm==='disena')return{what:`diseñar y construir una solución tecnológica para una necesidad sobre ${focus}`,how:'definiendo requisitos, representando la propuesta, construyendo de forma segura y probando su funcionamiento',forWhat:'justificar mejoras según los resultados de las pruebas'};
        return{what:`precisar la competencia científica principal de ${focus}`,how:'distinguiendo con el docente si la meta es indagar, explicar o diseñar una solución',forWhat:'definir actividades y evidencias coherentes antes de elaborar la sesión'};
      }
      return{what:`indagar y construir una explicación sobre ${focus}`,how:'formulando preguntas, observando o recogiendo evidencias y contrastando sus ideas con los resultados o fuentes pertinentes',forWhat:'explicar lo aprendido mediante evidencias y conclusiones sustentadas'};
    }
    if(a==='personal social'){
      if(level==='Primaria'){
        const cases={
          identidad:{what:`reconocer y valorar características personales relacionadas con ${focus}`,how:'analizando experiencias, emociones y situaciones cotidianas seguras',forWhat:'tomar decisiones responsables respetando la identidad propia y la diversidad'},
          convivencia:{what:`deliberar sobre situaciones de convivencia relacionadas con ${focus}`,how:'escuchando posiciones y analizando derechos, responsabilidades y acuerdos',forWhat:'participar en decisiones orientadas al bien común'},
          historia:{what:`interpretar cambios y permanencias relacionados con ${focus}`,how:'consultando, comparando y ubicando en el tiempo fuentes y testimonios',forWhat:'explicar hechos del pasado con evidencias y reconocer límites de las fuentes'},
          ambiente:{what:`comprender relaciones espaciales y ambientales de ${focus}`,how:'interpretando mapas, croquis e información de elementos naturales y sociales',forWhat:'proponer acciones responsables de cuidado o prevención'},
          economia:{what:`comprender decisiones económicas relacionadas con ${focus}`,how:'comparando necesidades, recursos, alternativas y posibles gastos',forWhat:'sustentar decisiones de consumo o ahorro responsables'}
        };
        return cases[personalSocialMode(title)]||{what:`precisar la competencia de Personal Social que se trabajará con ${focus}`,how:'acordando el propósito con el docente antes de seleccionar actividades',forWhat:'evitar mezclas de criterios de competencias distintas'};
      }
      return{what:`comprender y sustentar ideas, acuerdos o decisiones relacionados con ${focus}`,how:'analizando experiencias, información y diferentes puntos de vista del contexto',forWhat:'participar y tomar decisiones responsables y pertinentes'};
    }
    if(a==='ciencias sociales')return{what:`analizar y explicar una situación relacionada con ${focus}`,how:'interpretando información y contrastando fuentes o evidencias pertinentes',forWhat:'construir una explicación o posición sustentada'};
    if(a==='dpcc')return{what:`analizar y sustentar decisiones relacionadas con ${focus}`,how:'dialogando, contrastando perspectivas y considerando derechos, responsabilidades y bien común',forWhat:'actuar de manera responsable y argumentada'};
    if(a==='arte y cultura')return{what:`explorar y expresar aprendizajes relacionados con ${focus}`,how:'experimentando con lenguajes, materiales, técnicas o manifestaciones artísticas pertinentes',forWhat:'crear o comunicar una producción artística con intención'};
    if(a==='educacion fisica')return{what:`desarrollar acciones motrices vinculadas con ${focus}`,how:'participando en situaciones de movimiento, cooperación y toma de decisiones acordes con sus posibilidades',forWhat:'mejorar su desempeño, autonomía y convivencia durante la actividad física'};
    if(a==='educacion religiosa')return{what:`comprender y reflexionar sobre ${focus}`,how:'dialogando, relacionando experiencias y analizando mensajes o situaciones desde la formación religiosa prevista',forWhat:'expresar compromisos y decisiones coherentes con lo aprendido'};
    if(a==='psicomotriz')return{what:`desenvolverse corporalmente en situaciones relacionadas con ${focus}`,how:'explorando movimientos, espacios, objetos y posibilidades de acción con autonomía',forWhat:'expresar, coordinar y ampliar sus posibilidades motrices'};
    return{what:`desarrollar el aprendizaje previsto sobre ${focus}`,how:'participando en una tarea auténtica, usando estrategias pertinentes y explicando sus decisiones',forWhat:'demostrar lo aprendido mediante una actuación o producción observable'};
  }

  function purposeText(parts){return `${cap(parts.what)}, ${parts.how}, para ${parts.forWhat}.`;}

  function criterionForSession(area,title,focus,existing,level='Primaria'){
    const a=norm(area),mode=communicationMode(title);
    if(level==='Inicial'){
      if(a==='comunicacion'){
        if(mode==='lectura')return `Anticipa lo que podría comunicar un relato o texto sobre ${focus} a partir de imágenes e indicios, escucha la lectura compartida y expresa sus ideas con palabras, gestos o dibujos.`;
        if(mode==='escritura')return `Representa y comunica una idea sobre ${focus} mediante dibujos, trazos, escritura espontánea o dictado al docente, y cuenta qué quiso expresar.`;
        return `Comunica ideas, experiencias o preguntas sobre ${focus} y escucha a otros usando palabras, gestos, dibujos u otras formas de expresión.`;
      }
      if(a==='matematica')return `Agrupa, compara o representa cantidades y relaciones vinculadas con ${focus} usando materiales concretos y comunica cómo lo hizo.`;
      if(a==='ciencia y tecnologia')return `Observa y compara características o cambios relacionados con ${focus}, formula preguntas y comunica sus hallazgos con dibujos, palabras o gestos.`;
    }
    if(level==='Secundaria'&&a==='comunicacion'&&mode==='lectura')return `Interpreta información e ideas de textos sobre ${focus}, contrasta afirmaciones con fragmentos o fuentes y sustenta su posición con evidencias.`;
    if(a==='comunicacion'){
      if(mode==='oral')return `Comunica información relevante sobre ${focus}, mantiene el tema e interactúa escuchando y respondiendo de manera pertinente.`;
      if(mode==='lectura')return `Identifica e interpreta información relevante del texto sobre ${focus} y sustenta sus respuestas con información del texto.`;
      if(mode==='escritura')return `Produce un texto sobre ${focus} adecuado al propósito y destinatario, organiza sus ideas y lo revisa para mejorar su claridad.`;
    }
    if(a==='matematica'){
      if(level==='Primaria'){
        const mode=mathematicsMode(title);
        if(mode==='cantidad')return `Representa las cantidades o mediciones de ${focus}, resuelve con una operación o estrategia pertinente y comprueba su respuesta.`;
        if(mode==='regularidad')return `Identifica una equivalencia, patrón o relación de cambio de ${focus}, expresa una regla y la verifica con ejemplos.`;
        if(mode==='forma')return `Representa formas o relaciones espaciales relacionadas con ${focus}, aplica propiedades o medidas y justifica el procedimiento.`;
        if(mode==='datos')return `Organiza y representa datos sobre ${focus}, interpreta la información y sustenta una conclusión o decisión.`;
      }
      return `Resuelve la situación vinculada con ${focus} usando una estrategia o representación pertinente y explica cómo obtuvo y verificó su respuesta.`;
    }
    if(a==='ciencia y tecnologia'){
      if(level==='Primaria'){
        const sm=scienceMode(title);
        if(sm==='indaga')return `Formula una pregunta y una posible respuesta sobre ${focus}, registra datos comparables y sustenta una conclusión indicando sus límites.`;
        if(sm==='explica')return `Relaciona conocimientos científicos y evidencias pertinentes para explicar ${focus}, y distingue lo comprobado de una opinión.`;
        if(sm==='disena')return `Define el problema y los requisitos de una solución para ${focus}, representa su propuesta, la prueba y explica una mejora.`;
        return 'Criterio por confirmar: precisar si la actividad prioriza indagación, explicación o diseño tecnológico.';
      }
      return `Obtiene y registra evidencias sobre ${focus}, las utiliza para construir una explicación o conclusión y comunica lo encontrado.`;
    }
    if(a==='personal social'){
      if(level==='Primaria'){
        const cases={
          identidad:`Describe una cualidad, emoción o decisión personal sobre ${focus} y explica sus razones con respeto a la diversidad.`,
          convivencia:`Participa en un diálogo sobre ${focus}, escucha otras posiciones y justifica un acuerdo orientado al bien común.`,
          historia:`Explica un cambio o permanencia sobre ${focus} con apoyo en fuentes identificadas y referencias temporales.`,
          ambiente:`Relaciona elementos naturales y sociales de ${focus}, interpreta un espacio y justifica una acción de cuidado o prevención.`,
          economia:`Compara necesidades y alternativas económicas sobre ${focus} y justifica una elección responsable.`
        };
        return cases[personalSocialMode(title)]||'Criterio por confirmar: elegir la competencia principal de Personal Social.';
      }
      return `Explica y sustenta una idea, acuerdo o decisión relacionada con ${focus}, considerando la información y el contexto analizados.`;
    }
    const old=tidy(existing);
    if(old&&old.length<=220&&!/la situación de nuestra comunidad|desarrolla la competencia priorizada/i.test(old))return old;
    return `Realiza y explica una actuación o producción relacionada con ${focus}, aplicando el aprendizaje previsto y el criterio comunicado.`;
  }

  function evidenceForSession(area,title,focus,existing,level='Primaria'){
    const a=norm(area),mode=communicationMode(title);
    if(level==='Inicial'){
      if(a==='comunicacion'){
        if(mode==='lectura')return `Conversaciones, respuestas orales, dibujos o señalamientos que muestren cómo interpretan imágenes y relatos relacionados con ${focus}.`;
        if(mode==='escritura')return `Dibujos, trazos, escrituras espontáneas o mensajes dictados al docente sobre ${focus}, acompañados de su explicación oral.`;
        return `Registro de expresiones orales, gestos o dibujos mediante los cuales comunican ideas y preguntas sobre ${focus}.`;
      }
      if(a==='matematica')return `Colecciones, agrupaciones o representaciones con material concreto y registro de la explicación de los niños sobre ${focus}.`;
      if(a==='ciencia y tecnologia')return `Dibujos, fotografías o registros sencillos de observaciones y explicaciones orales sobre ${focus}.`;
    }
    if(level==='Secundaria'&&a==='comunicacion'&&mode==='lectura')return `Organizador o comentario crítico sobre ${focus} con fragmentos, contrastación de fuentes y explicación de conclusiones.`;
    if(a==='comunicacion'&&mode==='oral')return `Registro oral, gráfico o escrito de las ideas y conclusiones comunicadas sobre ${focus}.`;
    if(a==='comunicacion'&&mode==='lectura')return `Respuestas u organizador de lectura con información e interpretaciones sustentadas sobre ${focus}.`;
    if(a==='comunicacion'&&mode==='escritura')return `Texto producido y revisado sobre ${focus}, adecuado al propósito y destinatario.`;
    if(a==='matematica'){
      if(level==='Primaria'){
        const mode=mathematicsMode(title);
        if(mode==='cantidad')return `Representación de cantidades, cálculos o medidas, procedimiento y comprobación sobre ${focus}.`;
        if(mode==='regularidad')return `Secuencia, igualdad o tabla con regla identificada, ejemplos y justificación sobre ${focus}.`;
        if(mode==='forma')return `Modelo, dibujo geométrico, medición o representación espacial de ${focus} con explicación.`;
        if(mode==='datos')return `Tabla o gráfico de ${focus}, interpretación de datos y decisión fundamentada.`;
      }
      return `Resolución del reto sobre ${focus} con representación o procedimiento y explicación de la respuesta.`;
    }
    if(a==='ciencia y tecnologia'){
      if(level==='Primaria'){
        const sm=scienceMode(title);
        if(sm==='indaga')return `Pregunta, predicción, plan sencillo, registro de datos, contraste y conclusión sobre ${focus}.`;
        if(sm==='explica')return `Explicación de ${focus} que relaciona conceptos científicos y evidencias o fuentes identificadas.`;
        if(sm==='disena')return `Croquis o esquema, prototipo seguro, registro de pruebas y propuesta de mejora para ${focus}.`;
        return 'Evidencia por definir después de confirmar la competencia principal de Ciencia y Tecnología.';
      }
      return `Registro de observaciones o datos y explicación/conclusión sustentada sobre ${focus}.`;
    }
    if(a==='personal social'){
      if(level==='Primaria'){
        const cases={
          identidad:`Autorretrato, registro reflexivo o explicación de una decisión personal vinculada con ${focus}.`,
          convivencia:`Registro de participación, acuerdos del grupo y razones argumentadas sobre ${focus}.`,
          historia:`Línea de tiempo o cuadro de fuentes con interpretación sustentada de ${focus}.`,
          ambiente:`Croquis o mapa y propuesta razonada de cuidado o prevención relacionada con ${focus}.`,
          economia:`Cuadro de alternativas o presupuesto de ${focus} con decisión justificada.`
        };
        return cases[personalSocialMode(title)]||'Evidencia por definir después de confirmar la competencia principal de Personal Social.';
      }
      return `Conclusión, acuerdo, registro o propuesta sustentada relacionada con ${focus}.`;
    }
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
    const snapshot=session.documentContextSnapshot&&typeof session.documentContextSnapshot==='object'
      ?session.documentContextSnapshot:null;
    return{
      institution:tidy(snapshot?.institution||''),
      teacher:tidy(snapshot?.teacher||''),
      level:tidy(session.level||snapshot?.level||''),
      area:tidy(session.area||''),
      grades:Array.isArray(session.grades)?session.grades.slice():[],
      section:tidy(session.section||snapshot?.section||''),
      date:tidy(session.date||session.activityDate||''),
      duration:tidy(session.duration||''),
      historicalIdentityUnverified:!snapshot||snapshot.historicalIdentityUnverified===true
    };
  }

  function ensureHistoricalIdentity(session){
    const source=informativeData(session);
    if(!session.informativeData||typeof session.informativeData!=='object'){
      session.informativeData=source;
    }else{
      // Los registros antiguos podían haber tomado nombres de la configuración
      // activa. Sin un snapshot verificable no deben atribuirse a nadie.
      session.informativeData.institution=source.historicalIdentityUnverified?'':source.institution;
      session.informativeData.teacher=source.historicalIdentityUnverified?'':source.teacher;
      session.informativeData.historicalIdentityUnverified=source.historicalIdentityUnverified;
    }
  }

  function audit(session,unit,activity){
    const focus=shortFocus(activity?.title,unit,session),parts=session.learningPurposeParts||purposeParts(session.area,session.title,focus,session.level),issues=[];
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
    // Una sesión ya enriquecida es una planificación guardada: la vista previa
    // o la exportación nunca deben reescribir su propósito/evaluación.
    if(session.learningPurposeParts&&session.sessionPedagogicalChain&&session.sessionAuditV54){
      ensureHistoricalIdentity(session);
      return session;
    }
    const {unit,activity}=currentSelection(session);
    const title=tidy(session.title||activity?.title||'');
    const focus=shortFocus(title,unit,session);
    const parts=purposeParts(session.area,title,focus,session.level);
    // La finalidad expresada por el docente para el proyecto debe orientar
    // también la utilidad de sus sesiones, sin inventar metas adicionales.
    const declared=tidy(unit?.planningMeaning?.goal||'');
    const rawGoal=tidy(unit?.situationBrief||'').match(/\bpara\s+([^.!?]{8,100})[.!?]?$/i)?.[1]||'';
    const goal=declared||tidy(rawGoal);
    if(session.level==='Secundaria'&&goal&&goal.length<=110&&!norm(parts.forWhat).includes(norm(goal))){
      parts.forWhat+=` y aportar información para ${goal}`;
    }
    session.activityTitle=tidy(activity?.title||title);
    session.sessionFocus=focus;
    session.learningPurposeParts=parts;
    session.purpose=purposeText(parts);
    session.criterion=criterionForSession(session.area,title,focus,session.criterion,session.level);
    session.evidence=evidenceForSession(session.area,title,focus,session.evidence,session.level);
    const curriculum=inheritCurriculum(unit,session.area,session);
    if(curriculum.competence)session.competence=curriculum.competence;
    session.capacities=curriculum.capacities;
    session.precisedPerformance=curriculum.performance;
    session.transversalApproaches=curriculum.approaches;
    session.curriculumInheritance={officialFieldsInherited:curriculum.officialFieldsInherited,doNotInventMissing:true};
    // Reabrir una sesión histórica no debe reescribir su identidad con la
    // Ficha Maestra vigente. Para las antiguas, conservar lo ya almacenado.
    ensureHistoricalIdentity(session);
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
    if(!session.documentContextSnapshot||session.documentContextSnapshot.historicalIdentityUnverified){
      html='<div class="notice"><b>Identidad histórica por verificar:</b> revisa el nombre de la institución y del docente antes de emitir este documento antiguo.</div>'+html;
    }
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
