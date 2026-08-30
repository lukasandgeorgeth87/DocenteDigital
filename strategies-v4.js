/* DocenteDigital – banco pedagógico dinámico de estrategias (Primaria y Secundaria) */
(function(){
  const E=v=>escapeHtml(v);
  state.strategyProfile=state.strategyProfile||'variado';
  state.showStrategyReferences=state.showStrategyReferences!==false;
  save();

  const GENERAL=[
    {author:'Doug Lemov',tags:['participacion','comprension'],name:'Piensa – conversa – comparte',desc:'Da un breve tiempo individual para pensar, luego contraste en pareja y finalmente socialización. El docente recoge respuestas de distintos niveles y pide justificar.'},
    {author:'Doug Lemov',tags:['participacion','comprension'],name:'Todos producen antes de responder',desc:'Antes de la puesta en común, todos escriben, dibujan, representan o registran una respuesta breve; así aumenta la participación cognitiva y se obtiene evidencia de comprensión.'},
    {author:'Doug Lemov',tags:['pensamiento','argumentacion'],name:'Estirar la respuesta',desc:'Después de una respuesta inicial, formula repreguntas: ¿por qué?, ¿cómo lo sabes?, ¿qué evidencia tienes?, ¿puedes explicarlo de otra manera?, ¿qué pasaría si…?'},
    {author:'Doug Lemov',tags:['comprension','evaluacion'],name:'Verificación rápida de comprensión',desc:'Usa respuestas simultáneas, tarjetas, mini pizarras, ejemplos/no ejemplos o una producción de un minuto para decidir si avanzar, volver a modelar o formar un grupo de apoyo.'},
    {author:'Rebeca Anijovich',tags:['evaluacion','retroalimentacion'],name:'Criterios visibles y anticipados',desc:'Presenta el criterio con ejemplos comprensibles antes de la tarea; durante el trabajo los estudiantes lo usan para revisar su producción y tomar decisiones de mejora.'},
    {author:'Rebeca Anijovich',tags:['evaluacion','retroalimentacion'],name:'Circuito de retroalimentación',desc:'Valora un avance concreto, formula una pregunta que ayude a pensar, sugiere una pista cuando sea necesario y pide al estudiante aplicar la mejora en la misma producción.'},
    {author:'Rebeca Anijovich',tags:['metacognicion','evaluacion'],name:'Autoevaluación con evidencia',desc:'El estudiante contrasta su trabajo con el criterio, identifica qué logró, muestra la evidencia y decide un próximo paso de mejora.'},
    {author:'Francisco Mora',tags:['atencion','motivacion'],name:'Curiosidad y sorpresa pertinente',desc:'Introduce una imagen, objeto, dato inesperado, demostración o pregunta conectada con la vida del estudiante para activar atención y deseo de comprender.'},
    {author:'Francisco Mora',tags:['atencion','movimiento'],name:'Cambio breve de canal',desc:'Alterna explicación, manipulación, desplazamiento, observación y diálogo para renovar la atención sin perder el propósito de aprendizaje.'},
    {author:'Frida Díaz Barriga',tags:['situado','pensamiento'],name:'Tarea auténtica situada',desc:'Plantea una decisión, problema, caso o producto que tenga sentido en el contexto real y demande utilizar el conocimiento para actuar.'},
    {author:'Frida Díaz Barriga',tags:['colaboracion','situado'],name:'Aprendizaje colaborativo con roles cognitivos',desc:'Organiza equipos con roles claros —explica, pregunta, registra, verifica, sintetiza— y un producto común que obligue a negociar significados.'},
    {author:'Carol Ann Tomlinson',tags:['diferenciacion'],name:'Tareas escalonadas con un mismo criterio',desc:'Mantiene el mismo propósito y criterio, pero varía andamiajes, complejidad, representación, cantidad de información o autonomía según preparación de los estudiantes.'},
    {author:'Carol Ann Tomlinson',tags:['diferenciacion','colaboracion'],name:'Agrupamiento flexible',desc:'Forma grupos temporales por necesidad, estrategia, interés o autonomía y los reorganiza durante la sesión según la evidencia recogida.'},
    {author:'Carol Ann Tomlinson',tags:['diferenciacion'],name:'Opciones de producto o representación',desc:'Permite demostrar el mismo aprendizaje mediante texto, explicación oral, gráfico, modelo, esquema o recurso digital cuando el criterio lo permita.'}
  ];

  const AREA={
    'Comunicación':[
      {author:'Delia Lerner',tags:['area','lectura','escritura'],name:'Leer y escribir con propósito social',desc:'La lectura o escritura responde a una necesidad real: informarse, convencer, registrar, invitar, explicar o compartir con un destinatario auténtico.'},
      {author:'Delia Lerner',tags:['area','lectura','escritura'],name:'Circulación real del texto',desc:'Define desde el inicio quién leerá o escuchará el producto y genera una situación de revisión porque el texto tendrá un uso real.'},
      {author:'Daniel Cassany',tags:['area','escritura'],name:'Proceso recursivo de escritura',desc:'Planificar, producir un borrador, leer como destinatario, revisar contenido y forma, reescribir y publicar; la revisión puede volver sobre decisiones anteriores.'},
      {author:'Daniel Cassany',tags:['area','escritura','colaboracion'],name:'Revisión entre pares con foco',desc:'Los pares revisan uno o dos aspectos específicos del criterio, señalan evidencias y formulan una sugerencia concreta; luego el autor decide qué mejora aplicar.'},
      {author:'Daniel Cassany',tags:['area','lectura','escritura'],name:'Modelado del pensamiento del lector/escritor',desc:'El docente piensa en voz alta al anticipar, inferir, seleccionar información, organizar ideas o revisar una frase, haciendo visible una estrategia que luego el estudiante intenta de manera autónoma.'}
    ],
    'Matemática':[
      {author:'George Pólya',tags:['area','pensamiento'],name:'Comprender – planificar – ejecutar – mirar atrás',desc:'Comprenden qué se busca y qué datos importan; proponen estrategias; ejecutan; verifican y explican si la respuesta tiene sentido en el contexto.'},
      {author:'George Pólya',tags:['area','pensamiento'],name:'Problema relacionado o caso más simple',desc:'Si el problema bloquea, resuelven una versión más accesible, buscan un patrón o representan un caso particular para volver luego al reto original.'},
      {author:'Guy Brousseau',tags:['area','pensamiento'],name:'Situación de búsqueda con medio didáctico',desc:'Propone un problema y materiales o información que permitan tomar decisiones y recibir retroacciones del propio problema, evitando explicar de inmediato el procedimiento esperado.'},
      {author:'Guy Brousseau',tags:['area','argumentacion'],name:'Formulación – validación – institucionalización',desc:'Los estudiantes formulan estrategias, las confrontan y validan con razones o contraejemplos; luego el docente organiza y formaliza el conocimiento construido.'},
      {author:'Guy Brousseau',tags:['area','pensamiento'],name:'Error como información para revisar',desc:'En lugar de corregir de inmediato, usa una pregunta, dato o caso que permita al estudiante comprobar la insuficiencia de su estrategia y modificarla.'}
    ],
    'Ciencia y Tecnología':[
      {author:'Melina Furman',tags:['area','indagacion'],name:'Pregunta investigable',desc:'Transforma una curiosidad amplia en una pregunta que pueda explorarse mediante observaciones, comparaciones, mediciones, pruebas o consulta crítica de fuentes.'},
      {author:'Melina Furman',tags:['area','indagacion'],name:'Predicción con justificación',desc:'Antes de observar el resultado, los estudiantes anticipan qué creen que ocurrirá y explican por qué; después contrastan predicción y evidencia.'},
      {author:'Melina Furman',tags:['area','indagacion'],name:'Cuaderno de evidencias',desc:'Registran datos, dibujos, tablas, medidas, cambios y dudas; luego distinguen lo observado de la interpretación.'},
      {author:'Melina Furman',tags:['area','indagacion','argumentacion'],name:'Construcción y revisión de explicaciones',desc:'Elaboran una explicación inicial, la contrastan con datos o fuentes y la modifican cuando la evidencia no la sostiene.'},
      {author:'Melina Furman',tags:['area','indagacion','pensamiento'],name:'Comparar diseños de indagación',desc:'Analizan distintas maneras de investigar la misma pregunta y discuten cuál produce evidencias más confiables y por qué.'}
    ],
    'Personal Social':[
      {author:'Frida Díaz Barriga',tags:['area','situado','pensamiento'],name:'Análisis de caso situado',desc:'Presenta un caso cercano con decisiones en tensión; los estudiantes identifican actores, argumentos y consecuencias y construyen una decisión justificada.'},
      {author:'Frida Díaz Barriga',tags:['area','situado','colaboracion'],name:'Problema comunitario y propuesta viable',desc:'Analizan una necesidad del entorno, recuperan información y saberes locales, comparan alternativas y elaboran una acción posible con responsables y criterios.'}
    ],
    'Ciencias Sociales':[
      {author:'Frida Díaz Barriga',tags:['area','situado','argumentacion'],name:'Caso y fuentes para explicar una situación',desc:'Contrasta testimonios, datos, imágenes, mapas o documentos para formular explicaciones y tomar posición sustentada frente a un problema social.'},
      {author:'Frida Díaz Barriga',tags:['area','situado','pensamiento'],name:'Aprendizaje basado en problemas sociales',desc:'Parte de una pregunta problemática, distribuye tareas de investigación, organiza evidencias y culmina en una explicación o propuesta argumentada.'}
    ],
    'DPCC':[
      {author:'Frida Díaz Barriga',tags:['area','argumentacion'],name:'Dilema situado y deliberación',desc:'Analiza un dilema realista, explicita valores e intereses en conflicto, escucha perspectivas diferentes y sustenta una decisión considerando derechos y bien común.'}
    ]
  };

  const EIB=[
    {author:'MINEDU – diálogo de saberes EIB',tags:['eib','situado'],name:'Profundización del saber local',desc:'Recupera la explicación de estudiantes, familias o yachaq; pregunta por razones, procedimientos, señales, significados y cambios en el tiempo.'},
    {author:'MINEDU – diálogo de saberes EIB',tags:['eib','pensamiento'],name:'Comparación de saberes sin jerarquizarlos',desc:'Contrasta el saber local con otras fuentes o explicaciones, identifica coincidencias y diferencias y analiza para qué situaciones resulta útil cada conocimiento.'},
    {author:'MINEDU – enfoque intercultural',tags:['eib','comunicacion'],name:'Uso pedagógico de la lengua y repertorio local',desc:'Permite pensar, preguntar, explicar y producir en la lengua pertinente; recupera vocabulario comunitario y revisa su correspondencia con el registro escolar cuando sea necesario.'}
  ];

  function hash(s){let h=0;for(const c of String(s||''))h=(h*31+c.charCodeAt(0))>>>0;return h;}
  function rotatePick(arr,n,seed){if(!arr.length)return[];const start=seed%arr.length;return Array.from({length:Math.min(n,arr.length)},(_,i)=>arr[(start+i*3)%arr.length]);}
  function emphasisTags(){
    if(state.strategyProfile==='indagacion')return['indagacion','pensamiento'];
    if(state.strategyProfile==='colaboracion')return['colaboracion','participacion'];
    if(state.strategyProfile==='diferenciacion')return['diferenciacion','evaluacion'];
    if(state.strategyProfile==='pensamiento')return['pensamiento','argumentacion'];
    return[];
  }
  function strategySet(session){
    const seed=hash(`${session.title}|${session.area}|${session.unitId}`);
    const specific=AREA[session.area]||[];
    const eib=(state.language==='Quechua'||state.language==='Bilingüe')?EIB:[];
    const tags=emphasisTags();
    const emphasized=[...specific,...GENERAL,...eib].filter(x=>tags.some(t=>(x.tags||[]).includes(t)));
    const required=[GENERAL.find(x=>x.tags.includes('evaluacion')),GENERAL.find(x=>x.tags.includes('diferenciacion'))].filter(Boolean);
    const list=[...required,...rotatePick(specific,Math.min(4,specific.length),seed+5),...rotatePick(emphasized,2,seed+9),...rotatePick(GENERAL,5,seed),...rotatePick(eib,2,seed+13)];
    return list.filter((x,i,a)=>x&&a.findIndex(y=>y.name===x.name)===i).slice(0,10);
  }
  function stratHtml(list){return list.map((s,i)=>`<div class="dd-strategy"><b>${i+1}. ${E(s.name)}</b><span>${E(s.desc)}</span><small>Referencia pedagógica: ${E(s.author)}</small></div>`).join('');}

  const baseSessionHtml=window.sessionHtml;
  if(typeof baseSessionHtml==='function'){
    window.sessionHtml=function(session,forWord=false){
      const strategies=strategySet(session);session.strategies=strategies;
      const authors=[...new Set(strategies.map(s=>s.author))];
      const block=`<div class="dd-strategy-section"><h3>ESTRATEGIAS DIVERSIFICADAS PARA EL DESARROLLO</h3><p>La app selecciona y combina estrategias según área, reto, evidencia, nivel, contexto y necesidad de diferenciación. No se aplican como receta fija.</p><div class="dd-strategy-pack">${stratHtml(strategies)}</div>${state.showStrategyReferences?`<div class="dd-ped-note"><b>Referentes utilizados:</b> ${E(authors.join(' · '))}.</div>`:''}</div>`;
      let html=baseSessionHtml(session,forWord);
      if(html.includes('<b>Atención diferenciada y simultánea:</b>')) html=html.replace('<b>Atención diferenciada y simultánea:</b>',block+'<b>Atención diferenciada y simultánea:</b>');
      else if(html.includes('<h2>7. INSTRUMENTO DE EVALUACIÓN</h2>')) html=html.replace('<h2>7. INSTRUMENTO DE EVALUACIÓN</h2>',block+'<h2>7. INSTRUMENTO DE EVALUACIÓN</h2>');
      else html+=block;
      return html;
    };
  }

  const sessionCard=byId('session')?.querySelector('.card');
  if(sessionCard&&!byId('ddStrategyProfile')){
    const form=sessionCard.querySelector('.form2');
    const label=document.createElement('label');
    label.innerHTML=`Estrategias de desarrollo<select id="ddStrategyProfile"><option value="variado">Variadas y pertinentes (recomendado)</option><option value="indagacion">Mayor énfasis en indagación y evidencia</option><option value="colaboracion">Mayor énfasis en colaboración y diálogo</option><option value="diferenciacion">Mayor énfasis en diferenciación</option><option value="pensamiento">Mayor énfasis en razonamiento y argumentación</option></select><small>La app combina varias estrategias; no usa una receta única.</small>`;
    form?.appendChild(label);byId('ddStrategyProfile').value=state.strategyProfile;byId('ddStrategyProfile').onchange=e=>{state.strategyProfile=e.target.value;save();};
  }

  const settingsCard=byId('settings')?.querySelector('.card');
  if(settingsCard&&!byId('ddStrategyInfo')){
    const div=document.createElement('div');div.id='ddStrategyInfo';div.className='dd-strategy-info topgap';
    div.innerHTML=`<h2>🧠 Banco pedagógico de estrategias</h2><p>DocenteDigital combina participación y comprensión, evaluación formativa, aprendizaje situado, lectura y escritura, resolución de problemas, situaciones didácticas, indagación científica y diferenciación.</p><p><b>Referentes considerados:</b> Doug Lemov · Rebeca Anijovich · Francisco Mora · Frida Díaz Barriga · Delia Lerner · Daniel Cassany · George Pólya · Guy Brousseau · Melina Furman · Carol Ann Tomlinson · orientaciones MINEDU/EIB.</p>`;
    settingsCard.appendChild(div);
  }

  const css=document.createElement('style');css.textContent=`.dd-strategy-section{margin:12px 0;padding:10px;border:1px dashed #83988d;background:#fbfdfc}.dd-strategy-pack{display:grid;gap:7px;margin:10px 0}.dd-strategy{border-left:3px solid #6b8f7c;background:#f7faf8;padding:8px 10px;border-radius:5px}.dd-strategy b{display:block}.dd-strategy span{display:block;margin-top:2px}.dd-strategy small{display:block;margin-top:4px;color:#667;font-style:italic}.dd-ped-note{margin-top:10px;padding:8px;border-top:1px dotted #888;font-size:.92em}.dd-strategy-info{border-top:1px solid #ddd;padding-top:14px}`;document.head.appendChild(css);
})();