/* DocenteDigital – motor combinatorio de estrategias v15 */
(function(){
  if(window.__ddStrategyCombinatorV15)return;window.__ddStrategyCombinatorV15=true;
  state.strategyCombinationHistory=Array.isArray(state.strategyCombinationHistory)?state.strategyCombinationHistory:[];
  const E=v=>escapeHtml(v);
  const pick=a=>a[Math.floor(Math.random()*a.length)];

  const activation=[
    'Objeto sorpresa del contexto y pregunta de anticipación','Imagen parcial para inferir antes de revelar','Testimonio breve de una familia o yachaq','Caso cercano con dos respuestas posibles','Dato inesperado que contradice una idea común','Mini historia inconclusa para formular hipótesis','Clasificación rápida de ejemplos y no ejemplos','Recorrido de observación con una pregunta guía','Tarjetas de verdadero/falso justificadas','Predicción individual antes de conversar','Problema cotidiano sin procedimiento sugerido','Comparación de dos objetos, textos o situaciones','Pregunta generadora desde una experiencia familiar','Mapa de ideas previas con coincidencias y diferencias','Demostración breve que produzca curiosidad','Elección entre alternativas con explicación inicial'
  ];
  const grouping=[
    'Piensa individualmente, contrasta en pareja y socializa','Parejas tutor–aprendiz que luego intercambian roles','Tríos con roles: explica, pregunta y registra','Equipos heterogéneos con producto común','Grupos temporales por necesidad de apoyo','Estaciones con rotación de tareas y materiales','Trabajo individual seguido de galería silenciosa','Mesa de expertos y retorno al grupo de origen','Parejas por grados diferentes con tarea complementaria','Equipos por interés con un mismo criterio','Círculo de diálogo y luego producción individual','Trabajo simultáneo por grados con punto de encuentro común'
  ];
  const reasoning=[
    'Pedir siempre una razón o evidencia después de la respuesta','Comparar dos estrategias y decidir cuál conviene más','Buscar un contraejemplo que obligue a revisar una idea','Explicar qué cambiaría si cambia una condición del problema','Ordenar evidencias de más a menos convincentes','Detectar un error preparado y explicar cómo corregirlo','Resolver primero un caso sencillo y transferirlo a otro más complejo','Construir una conclusión usando porque, por eso y sin embargo','Defender una decisión frente a una alternativa distinta','Formular una nueva pregunta a partir de lo descubierto','Representar la misma idea de dos maneras y compararlas','Explicar el procedimiento a un compañero sin mostrar la respuesta','Distinguir observación, interpretación y conclusión','Predecir, comprobar y explicar por qué coincidió o no la predicción'
  ];
  const evidence=[
    'Ticket de salida con una respuesta y su evidencia','Mini pizarra o tarjeta de respuesta simultánea','Producción breve antes y después para comparar avance','Registro de observación con dibujo, dato o frase','Explicación oral grabada o presentada al grupo','Resolución comentada paso a paso','Tabla de hallazgos y conclusiones','Mapa conceptual construido durante la actividad','Producto parcial revisado con el criterio','Fotografía o dibujo anotado como evidencia','Autoexplicación de un minuto','Pregunta creada por el estudiante y respuesta sustentada'
  ];
  const feedback=[
    'Valorar un avance, formular una pregunta y pedir una mejora inmediata','Dar una pista graduada sin entregar la respuesta','Comparar el trabajo con un ejemplo y un no ejemplo','Retroalimentación entre pares sobre un solo aspecto del criterio','Conferencia breve docente–estudiante con siguiente paso concreto','Semáforo del criterio y justificación de la elección','Devolver una pregunta que obligue a revisar la evidencia','Mostrar dos producciones anónimas y decidir qué mejorar','Retroalimentación oral seguida de reescritura o nuevo intento','Lista corta de verificación usada durante la tarea','Comentario descriptivo centrado en lo logrado y lo que falta','Autoevaluación con evidencia antes de recibir ayuda del docente'
  ];
  const differentiation=[
    'Mismo propósito con distinta cantidad de apoyo','Mismo criterio con materiales de diferente complejidad','Opciones de responder con oralidad, dibujo, texto, modelo o esquema','Andamiaje con palabras clave para quien lo necesite','Reto de ampliación para quienes avanzan con mayor autonomía','Agrupamiento flexible que cambia según la evidencia','Modelado adicional solo para el grupo que lo requiere','Tarea base común y extensión voluntaria','Apoyo visual y concreto antes de pasar a representación simbólica','Consigna común con preguntas diferenciadas por grado','Tiempo adicional y ejemplo resuelto parcial para quienes lo requieran','Roles diferenciados que permiten participar desde distintas fortalezas'
  ];
  const closure=[
    '¿Qué aprendí, qué evidencia tengo y para qué me sirve?','Antes pensaba… ahora pienso… porque…','Una idea que mantengo, una que cambié y una pregunta que me queda','Explicar el aprendizaje a alguien que no estuvo en la clase','Elegir la evidencia que mejor demuestra el criterio y justificar','Completar: hoy fue difícil…, lo resolví…, la próxima vez…','Comparar el reto inicial con la respuesta final','Crear una pregunta para la siguiente sesión','Resumir el aprendizaje en tres palabras y explicar una','Compromiso o transferencia a una situación de la comunidad'
  ];
  const areaMoves={
    'Comunicación':['leer o escuchar con un propósito real antes de responder','modelar una decisión del lector/escritor en voz alta','planificar, producir, revisar y volver a escribir con destinatario'],
    'Matemática':['comprender el problema antes de operar','representar con material, dibujo, esquema o símbolo y comparar','validar la respuesta y mirar atrás para explicar si tiene sentido'],
    'Ciencia y Tecnología':['formular una pregunta investigable y una predicción justificada','registrar observaciones o datos antes de concluir','contrastar evidencia con la explicación inicial y revisarla'],
    'Personal Social':['analizar actores, decisiones y consecuencias de un caso cercano','contrastar puntos de vista y saberes de la comunidad','construir un acuerdo o propuesta sustentada en el bien común'],
    'Arte y Cultura':['explorar referentes y materiales antes de crear','probar alternativas expresivas y tomar decisiones','apreciar, explicar decisiones y mejorar la producción'],
    'Educación Física':['plantear un reto motor con reglas claras','observar estrategias propias y de otros durante la práctica','ajustar decisiones motrices y explicar qué ayudó a mejorar'],
    'Educación Religiosa':['partir de una experiencia humana significativa','dialogar el mensaje con la vida y la cultura del estudiante','formular una respuesta o compromiso coherente con lo reflexionado']
  };
  const eibMoves=[
    'recuperar primero el saber local mediante voces de estudiantes, familias o yachaq',
    'profundizar preguntando por razones, procedimientos, señales y significados',
    'comparar el saber local con otras fuentes sin jerarquizar automáticamente uno sobre otro',
    'proponer una alternativa, explicación o acción pertinente al contexto',
    'usar la lengua pertinente para pensar, preguntar y explicar antes de traducir o reformular'
  ];

  const TOTAL=activation.length*grouping.length*reasoning.length*evidence.length*feedback.length*differentiation.length*closure.length;
  function signature(parts){return parts.map((x,i)=>i+':'+x).join('|');}
  function uniqueRoute(session){
    for(let tries=0;tries<80;tries++){
      const parts=[pick(activation),pick(grouping),pick(reasoning),pick(evidence),pick(feedback),pick(differentiation),pick(closure)];
      const sig=signature(parts);
      if(!state.strategyCombinationHistory.includes(sig)){
        state.strategyCombinationHistory.push(sig);if(state.strategyCombinationHistory.length>500)state.strategyCombinationHistory.shift();save();return parts;
      }
    }
    state.strategyCombinationHistory=[];save();return[pick(activation),pick(grouping),pick(reasoning),pick(evidence),pick(feedback),pick(differentiation),pick(closure)];
  }
  function routeFor(session){
    if(session.ddStrategyRoute)return session.ddStrategyRoute;
    const parts=uniqueRoute(session);const area=areaMoves[session.area]||['plantear un reto auténtico','hacer visible el razonamiento','producir evidencia y revisar'];
    const needsEib=state.language==='Quechua'||state.language==='Bilingüe'||state.ieType==='Unidocente'||state.ieType==='Multigrado';
    let eib=[];
    if(needsEib){
      const firstEib=pick(eibMoves);
      const remainingEib=eibMoves.filter(x=>x!==firstEib);
      eib=[firstEib,pick(remainingEib)];
    }
    session.ddStrategyRoute={signature:signature(parts),activation:parts[0],grouping:parts[1],reasoning:parts[2],evidence:parts[3],feedback:parts[4],differentiation:parts[5],closure:parts[6],area:[...area],eib,total:TOTAL};
    save();return session.ddStrategyRoute;
  }
  const base=window.sessionHtml;
  if(typeof base==='function')window.sessionHtml=function(session,forWord=false){
    // El combinador trabaja en segundo plano. Su ruta sirve al motor maestro para
    // variar y enriquecer la secuencia, pero no se muestra al docente como tabla,
    // conteo de combinaciones ni explicación técnica.
    session.ddStrategyRoute=routeFor(session);
    return base.apply(this,arguments);
  };

  window.ddStrategyCombinationCount=TOTAL;
})();