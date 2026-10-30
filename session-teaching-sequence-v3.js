/* DocenteDigital – Fase 3: secuencia didáctica práctica y evaluación formativa.
   Propuesta editable, NO una transcripción de desempeños literales del MINEDU.
*/
(function(){
  if(window.__ddSessionTeachingSequenceV3)return;
  window.__ddSessionTeachingSequenceV3=true;
  if(typeof state!=='object'||typeof window.sessionHtml!=='function')return;
  const E=v=>typeof window.escapeHtml==='function'?window.escapeHtml(String(v??''))
    :String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const table=(heads,rows)=>`<div class="dd-scroll"><table class="dd-table"><thead><tr>${heads.map(h=>`<th>${E(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(cell=>`<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  // Primaria: III = 1.º y 2.º; IV = 3.º y 4.º; V = 5.º y 6.º.
  // Organizar ÚNICAMENTE los grados seleccionados por el docente.
  function primaryGradeNumber(grade){
    const match=String(grade??'').trim().match(/^([1-6])(?:\.?[º°])?$/);
    return match?Number(match[1]):0;
  }
  function primaryCycle(grade){
    const n=primaryGradeNumber(grade);
    return n<=0?null:n<=2?'III':n<=4?'IV':'V';
  }
  function primaryCycleGroups(grades){
    const selected=[...new Set((Array.isArray(grades)?grades:[]).filter(g=>primaryGradeNumber(g)))].sort((a,b)=>primaryGradeNumber(a)-primaryGradeNumber(b));
    return ['III','IV','V'].map(cycle=>({cycle,grades:selected.filter(g=>primaryCycle(g)===cycle)})).filter(group=>group.grades.length);
  }

  function origin(session){return(state.units||[]).find(u=>u.id===session.unitId)||null;}
  function focus(session){
    return String(origin(session)?.contextFocus||window.ddContextTopic?.(session.brief||'')||session.brief||session.title||'la actividad').trim();
  }
  function gradeCriterion(session,grade){
    if(session.level==='Primaria'&&session.area==='Comunicación'){
      const mode=communicationMode(session),n=primaryGradeNumber(grade);
      const details={
        lectura:{
          1:'Distingue información visible con ayuda y la relaciona con las ilustraciones.',
          2:'Ubica información en distintas partes e interpreta secuencia y tema.',
          3:'Identifica información próxima, infiere una idea y señala la pista textual.',
          4:'Distingue información relevante y explica relaciones mediante evidencia textual.',
          5:'Integra datos de varias partes e interpreta ideas y propósito.',
          6:'Relaciona información entre textos y evalúa recursos o efectos sobre el lector.'
        },
        escritura:{
          1:'Escribe según su proceso alfabético y revisa con ayuda el propósito y destinatario.',
          2:'Organiza oraciones, usa secuencia y revisa recursos básicos con apoyo.',
          3:'Organiza ideas y revisa adecuación, referentes y conectores.',
          4:'Desarrolla ideas coherentes y revisa recursos ortográficos y textuales.',
          5:'Organiza párrafos y subtemas y revisa la cohesión y el registro.',
          6:'Jerarquiza ideas y revisa argumentos, conectores y recursos textuales.'
        },
        oral:{
          1:'Expresa ideas sobre el tema, escucha e interviene con preguntas pertinentes.',
          2:'Mantiene el tema, establece secuencias y responde a sus interlocutores.',
          3:'Organiza su intervención y adecúa el mensaje al propósito y público.',
          4:'Justifica ideas y responde a las necesidades de sus interlocutores.',
          5:'Alterna roles de hablante y oyente y fundamenta una opinión.',
          6:'Integra aportes de otros, contraargumenta pertinentemente y revisa su intervención.'
        }
      };
      if(mode==='indefinido')return'Criterio por confirmar: seleccionar la competencia principal de Comunicación antes de evaluar.';
      const base=String(session.criterion||'Criterio contextualizado por revisar').trim();
      return`${base} Ajuste sugerido para ${grade}: ${details[mode]?.[n]||'Verificar el desempeño correspondiente al grado.'}`;
    }
    if(session.level==='Primaria'&&session.area==='Ciencia y Tecnología'){
      const mode=scienceMode(session),n=primaryGradeNumber(grade);
      const details={
        indaga:[null,
          'Hace una pregunta cercana, propone una respuesta y compara observaciones con apoyo.',
          'Propone pasos sencillos, registra cambios y confronta su respuesta inicial.',
          'Registra observaciones organizadas y explica qué resultados apoyan sus ideas.',
          'Planifica una comparación y organiza datos para contrastar una predicción.',
          'Identifica variables pertinentes, registra datos y sustenta conclusiones con cautela.',
          'Analiza datos cualitativos o cuantitativos, revisa hipótesis y explica limitaciones.'],
        explica:[null,
          'Describe características observables y las vincula con necesidades de los seres vivos.',
          'Relaciona cambios cotidianos con conocimientos sencillos y razones observables.',
          'Relaciona estructuras o propiedades con funciones usando información confiable.',
          'Explica interacciones y cambios mediante fuentes e información contrastable.',
          'Relaciona conocimientos científicos y evidencias sobre estructuras o procesos.',
          'Sustenta relaciones entre fenómenos, evalúa explicaciones e implicancias de uso.'],
        disena:[null,
          'Identifica una necesidad y dibuja una solución segura usando materiales cercanos.',
          'Describe los pasos y prueba si su solución cumple una función simple.',
          'Precisa requisitos, construye de manera segura y registra ajustes.',
          'Compara alternativas, representa su diseño y prueba su funcionamiento.',
          'Justifica requisitos y materiales, verifica resultados y mejora el prototipo.',
          'Argumenta decisiones de diseño, aplica criterios de prueba y evalúa impactos.']
      };
      if(mode==='indefinido')return 'Criterio por confirmar: elegir indagación, explicación científica o diseño tecnológico antes de evaluar.';
      const base=String(session.criterion||'Criterio contextualizado por revisar').trim();
      return `${base} Ajuste sugerido para ${grade}: ${details[mode]?.[n]||'Cotejar desempeño del grado.'}`;
    }
    if(session.level==='Primaria'&&session.area==='Personal Social'){
      const mode=personalSocialMode(session),n=primaryGradeNumber(grade);
      const details={
        identidad:['','Reconoce sus cualidades y expresa una emoción y una forma de cuidarse.','Identifica características propias y comunica cómo regula una emoción.','Reconoce fortalezas y compara opciones ante una situación que afecta sus emociones.','Explica cómo sus características y acciones se relacionan con decisiones responsables.','Argumenta una decisión personal considerando emociones, valores y consecuencias.','Sustenta decisiones responsables respetando diferencias y reflexiona sobre sus efectos.'],
        convivencia:['','Propone una regla para convivir y respeta turnos en el diálogo.','Explica por qué una norma ayuda a convivir y participa en un acuerdo.','Compara propuestas para resolver un desacuerdo y explica su elección.','Delibera escuchando opiniones diferentes y justifica un acuerdo colectivo.','Argumenta acuerdos considerando derechos y responsabilidades.','Contrasta distintas posiciones y sustenta una decisión orientada al bien común.'],
        historia:['','Ordena hechos de antes y ahora usando un testimonio o imagen.','Reconoce un cambio y una permanencia a partir de fuentes cercanas.','Compara dos fuentes y organiza hechos en una secuencia temporal.','Explica cambios y permanencias usando fuentes y relaciones temporales.','Contrasta fuentes y explica causas y consecuencias de un proceso histórico.','Elabora una interpretación sustentada distinguiendo hechos, versiones y límites de las fuentes.'],
        ambiente:['','Describe elementos de un espacio y propone un cuidado concreto.','Ubica lugares en un croquis y reconoce un riesgo ambiental cercano.','Relaciona actividades humanas y cambios ambientales a partir de fuentes.','Interpreta planos o mapas y propone medidas de prevención o cuidado.','Analiza relaciones naturales y sociales y justifica una acción sostenible.','Contrasta información territorial y evalúa una propuesta ambiental con criterios.'],
        economia:['','Distingue necesidades y deseos para una decisión cotidiana.','Explica una elección de uso responsable de recursos cercanos.','Compara necesidades, alternativas y costos sencillos al decidir.','Justifica una decisión de compra, ahorro o consumo usando información.','Analiza un presupuesto y argumenta prioridades y consecuencias.','Evalúa decisiones económicas responsables y posibles efectos en otros.']
      };
      if(mode==='indefinido')return'Criterio por confirmar: precisar una de las cinco competencias de Personal Social antes de evaluar.';
      const base=String(session.criterion||'Criterio contextualizado por revisar').trim();
      return `${base} Ajuste sugerido para ${grade}: ${details[mode]?.[n]||'Cotejar desempeño del grado.'}`;
    }
    if(session.level==='Primaria'&&session.area==='Matemática'){
      const mode=mathematicsMode(session),n=primaryGradeNumber(grade);
      const details={
        cantidad:['','Representa cantidades pequeñas y explica una suma o resta con material concreto.','Usa decenas y unidades y comprueba cálculos de adición o sustracción.','Relaciona datos con operaciones y explica su estrategia de resolución.','Representa problemas aditivos o multiplicativos y verifica resultados.','Opera con números y fracciones pertinentes y justifica procedimientos.','Compara estrategias con números, fracciones o decimales y fundamenta resultados.'],
        regularidad:['','Continúa un patrón visible y explica la repetición con objetos.','Representa equivalencias simples y explica una regla de patrón.','Identifica relaciones o patrones y verifica la regla con ejemplos.','Explica equivalencias y cambios usando representaciones.','Generaliza patrones o relaciones y contrasta varios casos.','Modela equivalencias o cambios y argumenta si una regla se mantiene.'],
        forma:['','Reconoce y construye formas o recorridos con objetos y dibujos.','Describe elementos de formas y ubicaciones con puntos de referencia.','Modela figuras o desplazamientos y explica su medición o construcción.','Compara propiedades geométricas y verifica medidas o recorridos.','Relaciona propiedades y transformaciones de figuras con un modelo.','Justifica procedimientos de medida, ubicación o transformación geométrica.'],
        datos:['','Registra conteos sencillos en una lista o gráfico y señala el dato mayor.','Construye y lee tablas o pictogramas y explica resultados.','Representa datos discretos en gráficos sencillos y compara frecuencias.','Interpreta gráficos y tablas y sustenta una conclusión.','Selecciona gráficos adecuados y fundamenta decisiones con datos.','Compara representaciones y justifica predicciones o conclusiones con datos.']
      };
      if(mode==='indefinido')return'Criterio por confirmar: precisar cuál de las cuatro competencias de Matemática se prioriza antes de evaluar.';
      const base=String(session.criterion||'Criterio contextualizado por revisar').trim();
      return`${base} Ajuste sugerido para ${grade}: ${details[mode]?.[n]||'Revisar el desempeño específico del grado.'}`;
    }
    const unit=origin(session),purpose=(unit?.purposes||[]).find(p=>p.area===session.area);
    const saved=(purpose?.criteria||[]).find(c=>c.grade===grade)?.text;
    // La matriz oficial literal no está verificada: el texto se etiqueta como
    // criterio contextualizado, y solo el docente puede validarlo por ciclo.
    return String(saved||session.criterion||'Criterio contextualizado pendiente de revisar');
  }
  function communicationMode(session){
    const resolve=window.DD_OFFICIAL_CURRICULUM?.communicationModeFromTitle;
    if(typeof resolve==='function')return resolve(session.title||session.activityTitle||'');
    // Compatibilidad con versiones de prueba que no cargan el núcleo oficial.
    const title=String(session.title||session.activityTitle||'').toLowerCase();
    if(/^(?:leemos|leer|lectura)/.test(title))return'lectura';
    if(/^(?:escribimos|redactamos|producimos|revisamos)/.test(title))return'escritura';
    if(/^(?:conversamos|dialogamos|escuchamos|presentamos|exponemos)/.test(title))return'oral';
    return'indefinido';
  }
  function mathematicsMode(session){
    const resolve=window.DD_OFFICIAL_CURRICULUM?.mathematicsModeFromTitle;
    if(typeof resolve==='function')return resolve(session.title||session.activityTitle||'');
    const title=String(session.title||session.activityTitle||'').toLowerCase();
    if(/cantidad|sumas?|restas?|fracciones?/.test(title))return'cantidad';
    if(/patrones?|equivalencias?/.test(title))return'regularidad';
    if(/geometría|perímetro|figuras?/.test(title))return'forma';
    if(/encuesta|pictogramas?|datos/.test(title))return'datos';
    return'indefinido';
  }
  function scienceMode(session){
    const resolver=window.DD_OFFICIAL_CURRICULUM?.scienceModeFromTitle;
    return typeof resolver==='function'?resolver(session.title||session.activityTitle||''):'indefinido';
  }
  function personalSocialMode(session){
    const resolver=window.DD_OFFICIAL_CURRICULUM?.personalSocialModeFromTitle;
    return typeof resolver==='function'?resolver(session.title||session.activityTitle||''):'indefinido';
  }
  function personalSocialTrace(session){
    if(session.level!=='Primaria'||session.area!=='Personal Social')return'';
    const core=window.DD_OFFICIAL_CURRICULUM,source=core?.sourceFor?.('Primaria');
    const mode=personalSocialMode(session),trusted=core?.verified===true&&source?.id==='PC-PRIMARIA';
    const comp=trusted&&mode!=='indefinido'?core?.pickCompetence?.('Primaria','Personal Social',session.title):null;
    const label=comp
      ?`<p><b>Competencia priorizada para esta actividad:</b> ${E(comp.name)}.</p><p><b>Capacidades del programa:</b> ${E(comp.capacities.join('; '))}.</p>`
      :'<p><b>Competencia por confirmar:</b> elegir de forma explícita identidad, convivencia, interpretación histórica, gestión ambiental o gestión económica. No basta con el título «Conocemos nuestra comunidad».</p>';
    const refs=trusted?window.DD_PRIMARY_PERSONAL_SOCIAL_PAGES?.forSession?.(session)||[]:[];
    const located=refs.length
      ?`<h4>Ubicación de estándares y desempeños en el PDF oficial</h4>${table(
        ['Grado elegido','Ciclo','Estándar: página PDF','Desempeños: páginas PDF'],
        refs.map(r=>[E(r.grade),E(r.cycle),E(r.standardPdfPage),E(r.performancePdfPages.join(', '))])
      )}<p>Numeración del visor PDF (la numeración impresa es dos páginas menor).</p>`:'';
    const url=trusted&&source?.repositoryUrl?`<p><a href="${E(source.repositoryUrl)}" target="_blank" rel="noopener noreferrer">Fuente: Programa curricular de Educación Primaria — MINEDU</a></p>`:'';
    return `<h3>Referencia curricular — Personal Social</h3>${label}${url}${located}<p><b>Importante:</b> estas actividades y criterios son propuestas editables, NO desempeños oficiales literales. ${refs.length?'Cotejar en el PDF el desempeño del grado y la pertinencia del criterio antes de su aplicación.':'Confirmar competencia y después consultar estándares y desempeños del grado.'}</p>`;
  }
  function scienceTrace(session){
    if(session.level!=='Primaria'||session.area!=='Ciencia y Tecnología')return'';
    const core=window.DD_OFFICIAL_CURRICULUM,source=core?.sourceFor?.('Primaria');
    const mode=scienceMode(session),trusted=core?.verified===true&&source?.id==='PC-PRIMARIA';
    const competence=trusted&&mode!=='indefinido'?core?.pickCompetence?.('Primaria','Ciencia y Tecnología',session.title):null;
    const title=competence
      ?`<p><b>Competencia priorizada para esta actividad:</b> ${E(competence.name)}.</p><p><b>Capacidades del programa:</b> ${E((competence.capacities||[]).join('; '))}.</p>`
      :'<p><b>Competencia por confirmar:</b> precisar si la actividad prioriza indagación, explicación o diseño y construcción tecnológica antes de cerrar la sesión.</p>';
    const refs=trusted?window.DD_PRIMARY_SCIENCE_PAGES?.forSession?.(session)||[]:[];
    const located=refs.length
      ?`<h4>Ubicación de estándares y desempeños en el PDF oficial</h4>${table(
        ['Grado seleccionado','Ciclo','Estándar: página PDF','Desempeños: páginas PDF'],
        refs.map(x=>[E(x.grade),E(x.cycle),E(x.standardPdfPage),E(x.performancePdfPages.join(', '))])
      )}<p>Numeración del visor PDF; el número impreso del libro es dos páginas menor.</p>`:'';
    const url=source?.repositoryUrl?`<p><a href="${E(source.repositoryUrl)}" target="_blank" rel="noopener noreferrer">Fuente: Programa curricular de Educación Primaria — MINEDU</a></p>`:'';
    return `<h3>Referencia curricular — Ciencia y Tecnología</h3>${title}${url}${located}<p><b>Advertencia:</b> los criterios y actividades son propuestas contextualizadas, NO desempeños oficiales literales. ${refs.length?'Consultar las páginas del grado y verificar la pertinencia antes de usar.':'Confirmar la competencia y consultar los desempeños correspondientes al grado.'}</p>`;
  }
  function communicationTrace(session){
    if(session.level!=='Primaria'||session.area!=='Comunicación')return'';
    const core=window.DD_OFFICIAL_CURRICULUM,source=core?.sourceFor?.('Primaria');
    const mode=communicationMode(session);
    const trusted=core?.verified===true&&source?.id==='PC-PRIMARIA';
    const competence=trusted&&mode!=='indefinido'?core?.pickCompetence?.('Primaria','Comunicación',session.title):null;
    const grades=session.grades.filter(g=>primaryGradeNumber(g));
    const label=competence
      ?`<p><b>Competencia priorizada para esta actividad:</b> ${E(competence.name)}.</p><p><b>Capacidades del programa:</b> ${E((competence.capacities||[]).join('; '))}.</p>`
      :'<p><b>Competencia por confirmar:</b> el docente debe precisar si la actividad prioriza comunicación oral, lectura o escritura antes de emitir la sesión final.</p>';
    const link=trusted&&source.repositoryUrl
      ?`<p><a href="${E(source.repositoryUrl)}" target="_blank" rel="noopener noreferrer">Fuente: Programa curricular de Educación Primaria — MINEDU</a></p>`:'';
    const located=trusted?window.DD_PRIMARY_COMMUNICATION_PAGES?.forSession?.(session)||[]:[];
    const references=located.length
      ?`<h4>Ubicación de estándares y desempeños en el PDF oficial</h4>${table(
          ['Grado seleccionado','Ciclo','Estándar: página PDF','Desempeños del grado: páginas PDF'],
          located.map(x=>[E(x.grade),E(x.cycle),E(x.standardPdfPage),E(x.performancePdfPages.join(', '))])
        )}<p>La numeración corresponde a las páginas del visor PDF; en este capítulo la numeración impresa es dos páginas menor. Consultar la tabla oficial antes de aprobar cada criterio.</p>`
      :'';
    return `<h3>Referencia curricular — Comunicación</h3>${label}${link}${references}<p><b>Importante:</b> las actividades y criterios aquí propuestos son contextualizaciones editables. ${located.length?'Los desempeños oficiales están localizados por página, pero no se han transcrito ni asignado automáticamente a cada criterio.':'Los desempeños deben cotejarse por grado con el documento oficial.'} El docente debe revisar la pertinencia del desempeño para ${E(grades.join(', '))} antes de utilizar la sesión.</p>`;
  }
  function mathematicsTrace(session){
    if(session.level!=='Primaria'||session.area!=='Matemática')return'';
    const core=window.DD_OFFICIAL_CURRICULUM,source=core?.sourceFor?.('Primaria'),mode=mathematicsMode(session);
    const trusted=core?.verified===true&&source?.id==='PC-PRIMARIA';
    const competence=trusted&&mode!=='indefinido'?core?.pickCompetence?.('Primaria','Matemática',session.title):null;
    const label=competence
      ?`<p><b>Competencia priorizada para esta actividad:</b> ${E(competence.name)}.</p><p><b>Capacidades del programa:</b> ${E((competence.capacities||[]).join('; '))}.</p>`
      :'<p><b>Competencia por confirmar:</b> identificar si la actividad requiere cantidad, regularidad, forma o gestión de datos antes de emitir la sesión final.</p>';
    const link=trusted&&source.repositoryUrl
      ?`<p><a href="${E(source.repositoryUrl)}" target="_blank" rel="noopener noreferrer">Fuente: Programa curricular de Educación Primaria — MINEDU</a></p>`:'';
    const located=trusted?window.DD_PRIMARY_MATHEMATICS_PAGES?.forSession?.(session)||[]:[];
    const references=located.length
      ?`<h4>Ubicación de estándares y desempeños en el PDF oficial</h4>${table(
          ['Grado seleccionado','Ciclo','Estándar: página PDF','Desempeños del grado: páginas PDF'],
          located.map(x=>[E(x.grade),E(x.cycle),E(x.standardPdfPage),E(x.performancePdfPages.join(', '))])
        )}<p>Se usa la numeración del visor PDF; la página impresa de este capítulo es dos números menor.</p>`
      :'';
    return `<h3>Referencia curricular — Matemática</h3>${label}${link}${references}<p><b>Importante:</b> las tareas y criterios son contextualizaciones editables. ${located.length?'Los desempeños oficiales están localizados por página, pero no se han transcrito ni asignado automáticamente a los criterios.':'El docente debe cotejar el desempeño por grado en la fuente oficial.'} Revisar su pertinencia para los grados seleccionados antes de aplicar.</p>`;
  }
  function baseGradeTask(session,grade){
    const topic=focus(session),area=session.area,n=parseInt(grade,10)||0;
    const mode=communicationMode(session);
    if(session.level==='Inicial'){
      if(area==='Comunicación')return{
        task:`Explora imágenes o escucha relatos sobre ${topic}; expresa una pregunta o una idea mediante palabras, gestos, dibujos o trazos.`,
        evidence:'Dibujo y explicación oral, o anotación de lo observado por el docente.'
      };
      if(area==='Matemática')return{
        task:`Juega a agrupar, contar o comparar objetos seguros relacionados con ${topic}; comunica cómo los organizó.`,
        evidence:'Agrupación con material concreto, registro de observación y explicación.'
      };
      if(area==='Ciencia y Tecnología')return{
        task:`Explora materiales seguros relacionados con ${topic}, observa cambios o semejanzas y los representa.`,
        evidence:'Dibujo o registro simple y explicación oral espontánea.'
      };
      return{task:`Participa en un juego, exploración o creación sobre ${topic} y comparte lo que hizo.`,evidence:'Actuación, producción u observación registrada.'};
    }
    if(session.level==='Secundaria'){
      if(area==='Comunicación'){
        if(mode==='lectura')return{task:`Contrasta dos textos o fuentes sobre ${topic}; distingue datos, opiniones e interpretaciones, y justifica una conclusión citando evidencias.`,evidence:'Cuadro de contraste y argumento sustentado.'};
        if(mode==='oral')return{task:`Prepara y sostiene un diálogo o exposición sobre ${topic}; escucha objeciones y responde con argumentos pertinentes.`,evidence:'Registro de intervenciones, escucha activa y fundamentación oral.'};
        if(mode==='escritura')return{task:`Planifica, produce y revisa un mensaje escrito sobre ${topic} dirigido a un público real.`,evidence:'Texto revisado con justificación de decisiones.'};
        return{task:`Precisa con el docente si la tarea prioriza oralidad, lectura o escritura sobre ${topic} y recoge evidencias acordes.`,evidence:'Evidencia pendiente de precisar según la competencia priorizada.'};
      }
      if(area==='Matemática')return{task:`Organiza o modela datos de ${topic}, verifica resultados y sustenta una interpretación para tomar decisiones.`,evidence:'Tabla o representación, cálculos y conclusión argumentada.'};
      if(area==='Ciencia y Tecnología')return{task:`Formula una pregunta investigable sobre ${topic}, registra o analiza evidencias y reconoce sus límites.`,evidence:'Registro de datos/fuentes y explicación sustentada.'};
      return{task:`Examina fuentes y perspectivas sobre ${topic}, propone una respuesta y argumenta sus consecuencias.`,evidence:'Argumento o propuesta sustentada con fuentes.'};
    }
    const early=n<=2,middle=n<=4;
    if(area==='Comunicación'){
      if(mode==='lectura')return early
        ?{task:`Con apoyo, observa imágenes y lee o escucha fragmentos sobre ${topic}; señala información y explica una idea mediante oralidad o dibujo.`,evidence:'Respuestas señaladas, dibujo y explicación oral.'}
        :middle
          ?{task:`Lee un texto accesible sobre ${topic}, identifica información e infiere una idea con pistas del texto.`,evidence:'Organizador con información e inferencia sustentada.'}
          :{task:`Compara dos fragmentos o fuentes sobre ${topic} e interpreta sus ideas con evidencia textual.`,evidence:'Comparación escrita y explicación de fuentes.'};
      if(mode==='oral')return early
        ?{task:`Conversa o relata una experiencia sobre ${topic}; escucha a sus compañeros y responde una pregunta con apoyos.`,evidence:'Registro de intervención oral y escucha.'}
        :middle
          ?{task:`Organiza una exposición o intercambio sobre ${topic}; escucha, pregunta y explica una idea con claridad.`,evidence:'Intervenciones orales y respuestas pertinentes.'}
          :{task:`Participa en un diálogo o exposición sobre ${topic}; sustenta ideas, escucha posiciones y responde pertinentemente.`,evidence:'Registro de argumentación e interacción oral.'};
      if(mode==='escritura')return early
        ?{task:`Planifica con dibujos o palabras y escribe un mensaje breve sobre ${topic} para un destinatario, con apoyo y revisión.`,evidence:'Producción escrita inicial, revisada según posibilidades.'}
        :middle
          ?{task:`Planifica, redacta y revisa un texto sobre ${topic} atendiendo al propósito y destinatario.`,evidence:'Borrador y versión revisada de un texto.'}
          :{task:`Redacta y revisa un texto argumentado sobre ${topic}, con propósito claro, organización y referencias pertinentes.`,evidence:'Texto final y registro de revisión.'};
      return{task:`Elige con el docente si la tarea central sobre ${topic} será oral, de lectura o de escritura antes de definir las actividades del grado.`,evidence:'Evidencia pendiente de precisar tras la selección de competencia.'};
    }
    if(area==='Matemática'){
      const mathMode=mathematicsMode(session);
      if(mathMode==='cantidad')return early
        ?{task:`Resuelve una situación con cantidades de ${topic} usando objetos, dibujos y sumas o restas pertinentes.`,evidence:'Modelo concreto, registro numérico y explicación.'}
        :middle
          ?{task:`Representa una situación de ${topic} con operaciones adecuadas y compara procedimientos de resolución.`,evidence:'Operaciones, representaciones y comprobación.'}
          :{task:`Modela una situación de ${topic} con números, fracciones o decimales pertinentes y argumenta el resultado.`,evidence:'Modelo numérico, estrategia y justificación.'};
      if(mathMode==='regularidad')return early
        ?{task:`Construye y continúa patrones o equivalencias de ${topic} con objetos y explica la regla.`,evidence:'Patrón concreto y explicación de regularidad.'}
        :middle
          ?{task:`Representa patrones o igualdades de ${topic} con tablas o esquemas y verifica una regla.`,evidence:'Tabla o equivalencia con regla comprobada.'}
          :{task:`Generaliza una relación de cambio o equivalencia en ${topic} y prueba su regla en varios casos.`,evidence:'Relación, expresión y argumentación.'};
      if(mathMode==='forma')return early
        ?{task:`Modela formas o recorridos de ${topic} con objetos, dibujos y puntos de referencia.`,evidence:'Modelo geométrico o recorrido descrito.'}
        :middle
          ?{task:`Construye o mide figuras y desplazamientos de ${topic}, explica propiedades y verifica resultados.`,evidence:'Dibujo, medidas y explicación geométrica.'}
          :{task:`Representa transformaciones, ubicaciones o medidas espaciales de ${topic} y justifica procedimientos.`,evidence:'Modelo o plano con propiedades y justificación.'};
      if(mathMode==='datos')return early
        ?{task:`Recoge y cuenta datos sencillos de ${topic}; elabora una lista o pictograma y lo interpreta.`,evidence:'Conteo, pictograma o gráfico sencillo y respuesta.'}
        :middle
          ?{task:`Organiza datos de ${topic} en tablas y gráficos de barras, compara frecuencias y explica una conclusión.`,evidence:'Tabla, gráfico e interpretación.'}
          :{task:`Selecciona representaciones de datos de ${topic}, analiza tendencias o posibilidades y fundamenta decisiones.`,evidence:'Gráficos, análisis de datos y conclusión.'};
      return{task:`Confirma con el docente si ${topic} prioriza cantidad, regularidad, forma o gestión de datos antes de definir tareas.`,evidence:'Evidencia pendiente de precisar según la competencia seleccionada.'};
    }
    if(area==='Personal Social'){
      const mode=personalSocialMode(session);
      const cases={
        identidad:early
          ?{task:`Describe una cualidad, emoción o experiencia personal vinculada con ${topic}; ensaya una decisión de autocuidado con apoyo.`,evidence:'Autorretrato o relato de cualidades, emoción reconocida y decisión expresada.'}
          :middle?{task:`Analiza una situación sobre ${topic}, reconoce sentimientos y características personales y propone una respuesta responsable.`,evidence:'Organizador personal y explicación de una decisión con razones.'}
          :{task:`Contrasta situaciones de ${topic}, reconoce derechos y responsabilidades individuales y fundamenta decisiones respetuosas.`,evidence:'Reflexión argumentada sobre consecuencias y respeto de diferencias.'},
        convivencia:early
          ?{task:`Dialoga sobre un problema de convivencia en ${topic} y acuerda una norma sencilla escuchando a otros.`,evidence:'Acuerdo ilustrado y registro de participación y escucha.'}
          :middle?{task:`Delibera con ejemplos sobre ${topic}, compara alternativas y construye acuerdos con el grupo.`,evidence:'Acta breve de acuerdos y razones expresadas.'}
          :{task:`Debate posiciones sobre ${topic}, considera derechos y consecuencias y sustenta acuerdos para el bien común.`,evidence:'Propuesta colectiva sustentada y registro de argumentos.'},
        historia:early
          ?{task:`Observa imágenes o escucha un testimonio sobre ${topic}, ordena antes y ahora y señala qué cambió.`,evidence:'Secuencia con imágenes y fuente oral identificada.'}
          :middle?{task:`Compara dos fuentes sobre ${topic}, organiza una secuencia temporal y distingue cambios y permanencias.`,evidence:'Cuadro de fuentes, línea de tiempo y explicación.'}
          :{task:`Contrasta fuentes de distinta procedencia sobre ${topic}, explica cambios, continuidades y posibles causas.`,evidence:'Interpretación histórica escrita con fuentes y límites reconocidos.'},
        ambiente:early
          ?{task:`Reconoce lugares y elementos naturales o sociales de ${topic} con una caminata o croquis y propone un cuidado seguro.`,evidence:'Croquis o dibujo espacial y acción de cuidado.'}
          :middle?{task:`Utiliza croquis, mapa o testimonios para identificar un problema ambiental de ${topic} y propone prevención.`,evidence:'Mapa sencillo con factores de riesgo y una propuesta.'}
          :{task:`Analiza información territorial de ${topic}, relaciona elementos naturales y sociales y evalúa una medida ambiental.`,evidence:'Mapa o análisis territorial y propuesta fundamentada.'},
        economia:early
          ?{task:`Reconoce necesidades y deseos de ${topic}, compara opciones y decide cómo usar recursos sencillos.`,evidence:'Clasificación de necesidades y decisión explicada oralmente.'}
          :middle?{task:`Compara precios o gastos relacionados con ${topic}, distingue necesidades y justifica una decisión de consumo.`,evidence:'Cuadro de alternativas y decisión sustentada.'}
          :{task:`Elabora y analiza un presupuesto de ${topic}, sopesa prioridades y propone decisiones económicas responsables.`,evidence:'Presupuesto con explicación de alternativas y consecuencias.'}
      };
      return cases[mode]||{task:`Confirma con el docente qué competencia de Personal Social se prioriza al estudiar ${topic}.`,evidence:'Evidencia pendiente de definir tras precisar la competencia.'};
    }
    if(area==='Ciencia y Tecnología'){
      const sm=scienceMode(session);
      if(sm==='indaga')return early
        ?{task:`Formula una pregunta sobre ${topic}, propone una respuesta, observa con apoyo y registra dibujos comparables.`,evidence:'Pregunta, predicción, dibujos y contraste oral.'}
        :middle?{task:`Planifica una observación o comparación segura sobre ${topic}, registra datos y contrasta su predicción.`,evidence:'Plan, tabla de observaciones y conclusión.'}
        :{task:`Plantea una hipótesis sobre ${topic}, decide qué observar, organiza datos y contrasta resultados reconociendo variables.`,evidence:'Hipótesis, plan, datos y conclusión contrastada.'};
      if(sm==='explica')return early
        ?{task:`Observa ${topic}, describe características y relaciona lo visto con una explicación cercana y fuente accesible.`,evidence:'Dibujo rotulado y explicación oral con razones.'}
        :middle?{task:`Busca información confiable sobre ${topic}, compara explicaciones y relaciona causas y efectos con evidencia.`,evidence:'Organizador de conceptos y explicación fundamentada.'}
        :{task:`Integra información científica contrastable sobre ${topic}, explica relaciones y evalúa sus implicancias.`,evidence:'Modelo o explicación sustentada con fuente.'};
      if(sm==='disena')return early
        ?{task:`Identifica una necesidad de ${topic}, dibuja una solución con materiales seguros, construye con ayuda y la prueba.`,evidence:'Dibujo, construcción sencilla y prueba observable.'}
        :middle?{task:`Define requisitos de una solución para ${topic}, compara ideas, construye un modelo seguro y registra ajustes.`,evidence:'Esquema, prototipo y registro de pruebas.'}
        :{task:`Compara alternativas de diseño para ${topic}, justifica materiales, construye, prueba requisitos y propone mejoras.`,evidence:'Plan técnico, prototipo, datos de pruebas y mejoras.'};
      return{task:`Precisa junto con el docente si ${topic} exige indagar, explicar o diseñar antes de realizar la tarea.`,evidence:'Evidencia pendiente de definir según la competencia.'};
    }
    return early
      ?{task:`Observa y representa una experiencia concreta sobre ${topic}.`,evidence:'Dibujo, actuación o relato breve.'}
      :middle
        ?{task:`Organiza información y prepara una producción para comunicar lo aprendido sobre ${topic}.`,evidence:'Producción y explicación.'}
        :{task:`Compara perspectivas y construye una propuesta argumentada sobre ${topic}.`,evidence:'Propuesta con fundamentos.'};
  }
  function gradeTask(session,grade){
    const base=baseGradeTask(session,grade);
    if(session.level!=='Primaria')return base;
    const gradeNumber=primaryGradeNumber(grade);
    const generalProgression={
      1:'Usar apoyos visuales o concretos; permitir respuesta oral, señalamiento o dibujo, sin exigir escritura autónoma.',
      2:'Ofrecer una pauta para comparar dos ejemplos y registrar una palabra, frase breve, número o esquema según el área.',
      3:'Organizar información en un cuadro sencillo e identificar una relación sustentada en lo observado o leído.',
      4:'Comparar dos casos o estrategias y explicar con evidencia una semejanza, diferencia o relación.',
      5:'Contrastar dos fuentes, procedimientos o registros y explicar por qué una conclusión se sostiene.',
      6:'Evaluar la solidez de la evidencia, reconocer límites y proponer una mejora o alternativa fundamentada.'
    };
    const readingProgression={
      1:'Ubicar datos evidentes en un texto breve con ilustraciones y apoyo, anticipar y relacionar texto e imagen.',
      2:'Leer textos sencillos por sí mismo cuando sea posible, ubicar datos de distintas partes, explicar tema y secuencia.',
      3:'Distinguir información cercana, inferir ideas y explicar el propósito utilizando pistas del texto.',
      4:'Seleccionar datos relevantes, inferir tema y subtemas y justificar relaciones con fragmentos.',
      5:'Integrar información de distintas secciones e interpretar el propósito y los recursos del texto.',
      6:'Integrar datos entre textos, explicar inferencias y valorar los recursos y efectos sobre el lector.'
    };
    const writingProgression={
      1:'Iniciarse en escritura alfabética según su proceso, con propósito y destinatario, y revisar con ayuda.',
      2:'Desarrollar oraciones sobre un tema, usar conectores de secuencia y revisar mayúscula y punto con apoyo.',
      3:'Ordenar ideas, utilizar conectores y revisar adecuación a propósito y destinatario.',
      4:'Desarrollar ideas con coherencia, referentes y conectores; revisar recursos ortográficos y organización.',
      5:'Organizar subtemas en párrafos, adecuar el registro y revisar coherencia y cohesión.',
      6:'Jerarquizar ideas principales y subtemas, integrar fuentes pertinentes y revisar argumentos y recursos textuales.'
    };
    const oralProgression={
      1:'Narrar una experiencia, escuchar e intervenir con preguntas y gestos pertinentes.',
      2:'Mantener el tema con conectores sencillos, escuchar, preguntar y responder según el intercambio.',
      3:'Organizar intervenciones, aclarar ideas y adecuar el mensaje al propósito y a quien escucha.',
      4:'Relacionar ideas con evidencias, responder preguntas y ajustar el registro a la situación.',
      5:'Argumentar con información del contexto y alternar los roles de hablante y oyente.',
      6:'Integrar lo dicho por otros, defender una opinión y valorar la pertinencia de los argumentos.'
    };
    const mathProgression={
      cantidad:{
        1:'Modelar sumas o restas sencillas con objetos y números pertinentes al grado.',
        2:'Usar valor posicional de decenas y unidades y explicar los cálculos.',
        3:'Resolver con representaciones numéricas y explicar la elección de una operación.',
        4:'Comparar estrategias de reparto o multiplicación y comprobar resultados.',
        5:'Representar cantidades, fracciones o decimales y justificar equivalencias pertinentes.',
        6:'Contrastar procedimientos y evaluar si el resultado responde al contexto del problema.'
      },
      regularidad:{
        1:'Continuar patrones visibles y explicar qué se repite.',
        2:'Representar igualdades simples y justificar una regla con material.',
        3:'Identificar patrones de cambio y describir reglas con ejemplos.',
        4:'Verificar equivalencias y reglas usando tablas o expresiones.',
        5:'Generalizar una regularidad y comprobarla con diferentes valores.',
        6:'Explicar relaciones de proporcionalidad o equivalencia pertinentes y defender la regla.'
      },
      forma:{
        1:'Reconocer lados, esquinas o ubicaciones mediante manipulación.',
        2:'Comparar figuras y describir recorridos con puntos de referencia.',
        3:'Representar y medir figuras o recorridos con unidades pertinentes.',
        4:'Analizar propiedades geométricas y justificar una construcción.',
        5:'Comparar transformaciones o figuras y verificar relaciones espaciales.',
        6:'Justificar una transformación o medición con un modelo geométrico.'
      },
      datos:{
        1:'Registrar frecuencias simples y comparar cantidades en un pictograma.',
        2:'Leer tablas o gráficos sencillos y explicar la frecuencia mayor.',
        3:'Construir gráficos de barras y explicar comparaciones.',
        4:'Interpretar gráficos con escala o tablas y justificar decisiones.',
        5:'Elegir gráficos adecuados e interpretar datos para una conclusión.',
        6:'Comparar medidas o posibilidades y justificar una predicción o decisión.'
      }
    };
    const scienceProgression={
      indaga:{1:'Registra una observación con dibujos.',2:'Compara dos registros e indica un cambio.',3:'Organiza observaciones y propone una explicación provisional.',4:'Planifica una comparación y contrasta la predicción.',5:'Reconoce las variables pertinentes y verifica con datos.',6:'Analiza resultados e identifica limitaciones de su indagación.'},
      explica:{1:'Relaciona una característica observable con una necesidad.',2:'Explica una relación cotidiana con ejemplos cercanos.',3:'Clasifica características y relaciona funciones.',4:'Explica cambios o interacciones con información contrastable.',5:'Sustenta relaciones usando explicaciones científicas.',6:'Evalúa las implicancias de la explicación con evidencia.'},
      disena:{1:'Propone una solución con un dibujo y ayuda al construir.',2:'Describe materiales y prueba su función básica.',3:'Propone requisitos y registra un ajuste.',4:'Contrasta materiales y describe pruebas con criterios.',5:'Fundamenta la elección de materiales y mejoras.',6:'Justifica resultados, efectos y limitaciones del prototipo.'}
    };
    const personalSocialProgression={
      identidad:{1:'Nombra una cualidad y una emoción con apoyo.',2:'Explica cómo se siente y ensaya una respuesta.',3:'Relaciona emoción, causa y decisión.',4:'Analiza consecuencias de acciones y emociones.',5:'Argumenta elecciones con respeto a la diversidad.',6:'Evalúa decisiones con criterios éticos y respeto.'},
      convivencia:{1:'Propone una norma con palabras o dibujos.',2:'Explica la utilidad de un acuerdo común.',3:'Compara alternativas para resolver un conflicto.',4:'Argumenta un acuerdo después de deliberar.',5:'Escucha posturas contrarias y sustenta una solución.',6:'Evalúa una propuesta considerando derechos y bienestar común.'},
      historia:{1:'Secuencia dos hechos observables de antes y ahora.',2:'Señala un cambio y una permanencia.',3:'Distingue datos de dos fuentes cercanas.',4:'Organiza hechos y explica cambios con fuentes.',5:'Relaciona causas y consecuencias contrastando fuentes.',6:'Sustenta una interpretación e identifica límites de sus evidencias.'},
      ambiente:{1:'Identifica lugares y un cuidado necesario.',2:'Ubica espacios y reconoce un riesgo cercano.',3:'Relaciona una actividad humana con un cambio ambiental.',4:'Representa zonas y justifica una medida de prevención.',5:'Contrasta mapas o registros y propone una mejora sostenible.',6:'Evalúa impactos ambientales y viabilidad de una acción.'},
      economia:{1:'Distingue una necesidad de un deseo.',2:'Compara dos opciones de gasto sencillo.',3:'Justifica el uso responsable de recursos.',4:'Relaciona gastos con prioridades del hogar o aula.',5:'Compara presupuestos y argumenta opciones.',6:'Evalúa decisiones económicas y sus consecuencias.'}
    };
    const mode=communicationMode(session);
    const specific=session.area==='Comunicación'
      ?({lectura:readingProgression,escritura:writingProgression,oral:oralProgression}[mode]||generalProgression)
      :session.area==='Personal Social'?(personalSocialProgression[personalSocialMode(session)]||generalProgression)
        :session.area==='Matemática'?(mathProgression[mathematicsMode(session)]||generalProgression)
        :session.area==='Ciencia y Tecnología'?(scienceProgression[scienceMode(session)]||generalProgression)
          :generalProgression;
    if(!specific[gradeNumber])return base;
    return{
      task:`${base.task} Ajuste sugerido para ${grade} (ciclo ${primaryCycle(grade)}): ${specific[gradeNumber]}`,
      evidence:`${base.evidence} Registrar el proceso y la explicación propia de ${grade}; no intercambiar el criterio de un grado por el de otro.`
    };
  }
  function steps(session){
    if(session.level==='Inicial')return[
      'Explorar con materiales e imágenes seguros; recoger ideas y preguntas sin adelantar respuestas.',
      'Jugar, comparar y conversar con apoyos adecuados a la edad, mientras el docente observa.',
      'Invitar a mostrar descubrimientos mediante palabras, gestos, dibujos o creaciones.'
    ];
    if(session.area==='Comunicación'){
      const mode=communicationMode(session);
      if(mode==='lectura')return[
        'Antes de leer: activar saberes previos, anticipar y establecer el propósito de lectura.',
        'Durante la lectura: localizar e interpretar información, contrastar ideas con fragmentos del texto.',
        'Después de leer: conversar sobre interpretaciones y fundamentar respuestas en lo leído.'
      ];
      if(mode==='escritura')return[
        'Planificar: propósito, destinatario, ideas y organización del texto.',
        'Escribir: elaborar un borrador con recursos lingüísticos y apoyos según el grado.',
        'Revisar y mejorar: contrastar con criterios, ajustar el texto y compartir la versión final.'
      ];
      if(mode==='oral')return[
        'Preparar ideas, destinatarios y normas para dialogar, narrar o exponer.',
        'Participar: expresar y organizar ideas, escuchar activamente y responder con pertinencia.',
        'Reflexionar sobre la claridad, la escucha y las mejoras para una siguiente intervención.'
      ];
      return[
        'Precisar si el propósito comunicativo central será oralidad, lectura o escritura.',
        'Acordar con el docente las actividades y evidencias de la competencia elegida.',
        'Revisar el producto o intervención con criterios propios de esa competencia.'
      ];
    }
    if(session.area==='Matemática'){
      if(session.level==='Primaria'){
        const mode=mathematicsMode(session);
        if(mode==='cantidad')return[
          'Interpretar la situación de cantidad, reconocer relaciones y representar datos con materiales o números.',
          'Elegir operaciones y procedimientos adecuados al grado; resolver y comprobar.',
          'Explicar la operación usada, comparar estrategias y verificar sentido de la respuesta.'
        ];
        if(mode==='regularidad')return[
          'Observar una secuencia, igualdad o relación de cambio e identificar qué se mantiene.',
          'Representar y comprobar la regla con objetos, tablas o expresiones.',
          'Explicar cómo se verificó la regularidad y cuándo se puede aplicar.'
        ];
        if(mode==='forma')return[
          'Explorar formas, ubicaciones o recorridos y representar el problema espacial.',
          'Modelar, construir o medir usando materiales e instrumentos pertinentes.',
          'Comunicar las propiedades y justificar medidas, recorridos o transformaciones.'
        ];
        if(mode==='datos')return[
          'Plantear una pregunta para recoger o interpretar datos del contexto.',
          'Registrar, organizar y representar datos mediante tablas o gráficos apropiados al grado.',
          'Interpretar resultados y sustentar una decisión o predicción según la evidencia.'
        ];
        return[
          'Identificar con el docente si la situación corresponde a cantidad, regularidad, forma o datos.',
          'Elegir representaciones y procedimientos coherentes con la competencia confirmada.',
          'Recoger evidencias y revisar la respuesta con criterios específicos.'
        ];
      }
      return[
        'Comprender el problema, identificar datos y representarlo con objetos, esquemas o tablas.',
        'Elegir y aplicar una estrategia; contrastar procedimientos y verificar resultados.',
        'Explicar la solución y analizar si sigue siendo válida con otros datos.'
      ];
    }
    if(session.area==='Personal Social'&&session.level==='Primaria'){
      const mode=personalSocialMode(session);
      const routes={
        identidad:[
          'Reconocer la situación personal: identificar características, emociones e ideas previas sin exigir revelaciones íntimas.',
          'Analizar situaciones cotidianas, reconocer emociones y alternativas de acción con respeto a la diversidad.',
          'Tomar una decisión responsable, explicar las razones y valorar sus posibles consecuencias.'
        ],
        convivencia:[
          'Problematizar una situación de convivencia o asunto público cercano y escuchar puntos de vista diferentes.',
          'Examinar derechos, responsabilidades y alternativas; deliberar con turnos y evidencias disponibles.',
          'Construir acuerdos o propuestas para el bien común y decidir cómo comprobar su cumplimiento.'
        ],
        historia:[
          'Presentar un problema histórico y reconocer qué sabemos y qué necesitamos indagar del pasado.',
          'Examinar fuentes diversas, ubicar hechos en el tiempo y distinguir información, interpretación y dudas.',
          'Explicar cambios, permanencias y posibles causas con referencia explícita a las fuentes.'
        ],
        ambiente:[
          'Reconocer un problema del espacio geográfico y observar cómo se relacionan elementos naturales y sociales.',
          'Interpretar croquis, mapas o testimonios y ubicar lugares, riesgos y posibles causas.',
          'Evaluar y proponer acciones de cuidado o prevención justificadas y seguras para la comunidad.'
        ],
        economia:[
          'Identificar una decisión económica cercana y distinguir necesidades, deseos y recursos disponibles.',
          'Comparar alternativas, precios o presupuestos, y analizar consecuencias de consumir, gastar o ahorrar.',
          'Justificar una decisión responsable con información, prioridades y posibles efectos.'
        ]
      };
      return routes[mode]||[
        'Confirmar con el docente cuál competencia de Personal Social es la principal.',
        'Seleccionar fuentes y procesos acordes con la competencia elegida y los grados atendidos.',
        'Acordar criterios y evidencias antes de la evaluación; no utilizar criterios genéricos como oficiales.'
      ];
    }
    if(session.area==='Ciencia y Tecnología'){
      if(session.level==='Primaria'){
        const sm=scienceMode(session);
        if(sm==='indaga')return[
          'Problematizar: formular una pregunta investigable, recoger saberes previos y proponer una predicción.',
          'Diseñar el plan: elegir materiales seguros y cómo observar o comparar; obtener y registrar datos según el grado.',
          'Analizar y comunicar: contrastar datos con la predicción, explicar conclusiones y reconocer límites.'
        ];
        if(sm==='explica')return[
          'Plantear una cuestión científica sobre el fenómeno y recuperar ideas iniciales sin presentarlas como hechos.',
          'Buscar y comprender información científica fiable, relacionarla con observaciones o modelos y contrastar explicaciones.',
          'Argumentar una explicación sustentada y dialogar sobre sus implicancias y qué fuentes faltan.'
        ];
        if(sm==='disena')return[
          'Identificar el problema tecnológico y los requisitos que debe cumplir una solución adecuada al contexto.',
          'Diseñar y representar alternativas; construir de modo seguro, usando herramientas apropiadas para la edad.',
          'Probar la solución frente a los requisitos, registrar resultados, mejorarla y comunicar ventajas, límites e impactos.'
        ];
        return[
          'Confirmar con el docente la competencia principal: indagación, explicación o diseño tecnológico.',
          'Elegir procedimientos y tareas apropiados para la competencia confirmada y los grados presentes.',
          'Definir evidencias y criterios antes de evaluar para no mezclar rutas.'
        ];
      }
      return[
        'Plantear una pregunta y explicitar predicciones o ideas previas.',
        'Planificar observación o consulta de fuentes seguras; registrar y comparar datos.',
        'Contrastar datos con predicciones, comunicar conclusiones y reconocer lo no comprobado.'
      ];
    }
    return[
      'Partir de experiencias reales y plantear preguntas relacionadas con el reto.',
      'Examinar fuentes o materiales y elaborar una respuesta, actuación o producción.',
      'Revisarla con criterios, justificar elecciones y plantear mejoras.'
    ];
  }
  function sections(session){
    const topic=focus(session),initial=session.level==='Inicial';
    const grades=session.level==='Primaria'
      ?[...new Set(session.grades)].sort((a,b)=>primaryGradeNumber(a)-primaryGradeNumber(b))
      :session.grades;
    const items=grades.map(grade=>({grade,cycle:primaryCycle(grade),...gradeTask(session,grade)}));
    const start=initial
      ?`Acoger, mostrar objetos o imágenes sobre ${topic} y preguntar «¿qué ves?, ¿qué te gustaría saber?». Explicar el propósito con palabras cercanas.`
      :`Presentar una pregunta relacionada con ${topic}; recuperar saberes previos y compartir propósito y criterio de la actividad.`;
    const development=steps(session).map((step,i)=>`${i+1}. ${step}`).join(' ');
    const end=initial
      ?'Compartir hallazgos en una ronda de palabras, dibujos o gestos. Registrar lo expresado y proponer una nueva exploración.'
      :'Socializar la evidencia, contrastarla con el criterio, autoevaluar y acordar una mejora concreta para la próxima tarea.';
    const timing=table(['Momento','Actividades y mediación','Tiempo'],[
      [E('Inicio'),E(start),E(`${session.times?.start??''} min`)],
      [E('Desarrollo'),E(development),E(`${session.times?.dev??''} min`)],
      [E('Cierre'),E(end),E(`${session.times?.close??''} min`)]
    ]);
    const isPrimary=session.level==='Primaria';
    const cycleGroups=isPrimary?primaryCycleGroups(grades):[];
    const cycleTable=isPrimary
      ?`<h3>Ciclos de Primaria presentes en esta aula</h3><p>Solo se incluyen los grados elegidos por el docente. Las tareas comparten una situación retadora, con complejidad y criterios ajustables por grado.</p>${table(['Ciclo curricular','Grados seleccionados'],cycleGroups.map(g=>[E(`Ciclo ${g.cycle}`),E(g.grades.join(', '))]))}`
      :'';
    const taskTable=isPrimary
      ?table(['Ciclo','Grado seleccionado','Tarea concreta sugerida','Evidencia a observar'],items.map(x=>[E(x.cycle?`Ciclo ${x.cycle}`:'Por verificar'),E(x.grade),E(x.task),E(x.evidence)]))
      :table(['Grado / edad','Tarea concreta sugerida','Evidencia a observar'],items.map(x=>[E(x.grade),E(x.task),E(x.evidence)]));
    const multigrade=!initial&&['Multigrado','Unidocente'].includes(session.ieType)&&items.length>1;
    const alternation=multigrade?`<p><b>Rotación multigrado:</b> organizar atención directa, trabajo autónomo/cooperativo y socialización común entre ${E(cycleGroups.map(g=>`ciclo ${g.cycle} (${g.grades.join(', ')})`).join('; ')||grades.join(', '))}. La atención se prioriza según los apoyos reales necesarios, no por un orden fijo de ciclos. No planificar tareas para grados ausentes.</p>`:'';
    const formative=isPrimary
      ?table(['Ciclo','Grado seleccionado','Criterio contextualizado por verificar','Evidencia','Observación formativa','Retroalimentación / siguiente paso'],items.map(x=>[
        E(x.cycle?`Ciclo ${x.cycle}`:'Por verificar'),E(x.grade),E(gradeCriterion(session,x.grade)),E(x.evidence),
        '□ Sí &nbsp; □ Con apoyo &nbsp; □ Aún no observado','________________________']))
      :table(['Grado / edad','Criterio contextualizado por verificar','Evidencia','Observación formativa','Retroalimentación / siguiente paso'],items.map(x=>[
        E(x.grade),E(gradeCriterion(session,x.grade)),E(x.evidence),
        '□ Sí &nbsp; □ Con apoyo &nbsp; □ Aún no observado','________________________']));
    const synthesis=initial
      ?'<h3>Registro de descubrimientos</h3><p>Guardar dibujos, producciones, palabras dictadas y observaciones del juego sin exigir escritura convencional ni respuestas únicas.</p>'
      :'<h3>Síntesis y transferencia</h3><p>Construir una conclusión o procedimiento breve basado en la evidencia, explicar dónde aplicarlo y reconocer qué falta comprobar.</p>';
    return `<div class="dd-phase3-sequence"><h2>6. MOMENTOS DE LA SESIÓN</h2>${timing}${cycleTable}${communicationTrace(session)}${mathematicsTrace(session)}${scienceTrace(session)}${personalSocialTrace(session)}<h3>Atención diferenciada</h3>${taskTable}${alternation}<h2>7. REGISTRO DE EVALUACIÓN FORMATIVA</h2><p>Instrumento editable: verificar los criterios con las competencias y desempeños del grado/ciclo antes de aplicar. Marcar solo evidencias observadas y anotar un siguiente paso concreto.</p>${formative}${synthesis}</div>`;
  }
  function preparation(session){
    const initial=session.level==='Inicial',multi=['Multigrado','Unidocente'].includes(session.ieType)&&session.grades.length>1;
    const prepare=initial
      ?'Prever espacios accesibles de juego y exploración, objetos e imágenes apropiados para la edad, higiene y materiales seguros. Observar necesidades de apoyo sin exigir escritura convencional.'
      :session.level==='Secundaria'
        ?'Seleccionar datos o fuentes contrastables, formular la pregunta de trabajo y preparar un instrumento de observación ligado al criterio.'
        :'Seleccionar textos o tareas con apoyos diferenciados según el grado, materiales concretos y preguntas de mediación relacionadas con el propósito.';
    const resources=initial
      ?'Materiales reales seguros, láminas, cuentos, objetos para clasificar y papel para dibujar; prever alternativas no digitales.'
      :session.level==='Secundaria'
        ?'Fuentes, registros de datos o textos pertinentes; cuaderno, organizadores y herramientas disponibles sin depender de conexión.'
        :'Textos, fichas y material concreto diferenciados por grado; cuadernos, organizadores y recursos del entorno.';
    const selectedCycles=session.level==='Primaria'
      ?primaryCycleGroups(session.grades).map(g=>`ciclo ${g.cycle}: ${g.grades.join(', ')}`).join('; '):'';
    const rotation=multi?` Planificar la alternancia de atención docente entre los grados presentes (${selectedCycles||session.grades.join(', ')}).`:'';
    return `<h2>5. PREPARACIÓN DE LA SESIÓN</h2>${table(['¿Qué preparar?','Recursos y organización'],[[E(prepare+rotation),E(`${session.resources||''}. ${resources}`)]])}`;
  }
  function annexes(session){
    const initial=session.level==='Inicial';
    const content=initial
      ?'Registros de observación, dibujos o producciones de los niños, imágenes autorizadas y materiales seguros para explorar o jugar. Ajustar la selección a la edad y al contexto.'
      :session.level==='Secundaria'
        ?'Fuentes o textos revisados, tabla de registro de datos, organizador de evidencias y guía de evaluación editable. Incluir referencias verificables.'
        :'Textos y fichas diferenciados por grado, material concreto, plantillas de registro y guía de evaluación editable.';
    return `<h2>9. MATERIALES / ANEXOS</h2><p>${E(content)}</p>`;
  }
  const previous=window.sessionHtml;
  // La Unidad/Proyecto también debe indicar el ciclo de cada grado elegido,
  // sin crear apartados para grados que el docente no atiende.
  const previousUnitWord=window.unitWordHtml;
  if(typeof previousUnitWord==='function')window.unitWordHtml=function(unit){
    const html=previousUnitWord.apply(this,arguments);
    if(!unit||unit.level!=='Primaria'||typeof html!=='string')return html;
    const groups=primaryCycleGroups(unit.grades);
    if(!groups.length)return html;
    const panel=`<h3>Organización curricular por ciclos y grados seleccionados</h3>${table(
      ['Ciclo de Primaria','Grados elegidos para esta Unidad/Proyecto'],
      groups.map(g=>[E(`Ciclo ${g.cycle}`),E(g.grades.join(', '))])
    )}<p>Planificar con un reto común y criterios, tareas y evidencias diferenciados por cada grado seleccionado. Verificar competencias y desempeños oficiales antes de aplicar.</p>`;
    return html.replace(/(<h2>III\.[^<]*<\/h2>)/,`${panel}$1`);
  };
  window.sessionHtml=function(session,forWord=false){
    let html=previous.apply(this,arguments);
    if(!session||!Array.isArray(session.grades)||!session.grades.length||typeof html!=='string')return html;
    const oldPreparation=/<h2>5\. PREPARACIÓN DE LA SESIÓN<\/h2>[\s\S]*?(?=<h2>6\.[^<]*<\/h2>)/;
    if(oldPreparation.test(html))html=html.replace(oldPreparation,preparation(session));
    // Las capas maestras previas usan títulos distintos en Inicial y reemplazan
    // los apartados 8–10. Sustituir 6–7 sin eliminar sus anexos adicionales.
    const generic=/<h2>6\.[^<]*<\/h2>[\s\S]*?(?=<h2>8\.[^<]*<\/h2>)/;
    if(generic.test(html))html=html.replace(generic,sections(session));
    const obsoleteBoard=/<h2>8\. FORMALIZACIÓN PARA PIZARRA<\/h2>[\s\S]*?(?=<h2>9\.[^<]*<\/h2>)/;
    if(obsoleteBoard.test(html))html=html.replace(obsoleteBoard,'');
    const oldAnnexes=/<h2>9\. MATERIALES \/ ANEXOS<\/h2><p>Fichas diferenciadas por grado,[\s\S]*?<\/p>/;
    if(oldAnnexes.test(html))html=html.replace(oldAnnexes,annexes(session));
    if(state.curriculumMatrixReady!==true){
      html=html.replace(/Capacidades MINEDU:/g,'Capacidades por verificar:')
        .replace(/Competencia y capacidades MINEDU/g,'Referencia curricular provisional');
    }
    return html;
  };
  window.ddSessionTeachingSequenceV3={gradeTask,gradeCriterion,sections,communicationMode,mathematicsMode,scienceMode,personalSocialMode,primaryGradeNumber,primaryCycle,primaryCycleGroups};
})();
