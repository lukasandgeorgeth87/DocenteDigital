/* DocenteDigital – banco pedagógico dinámico de estrategias (Primaria y Secundaria) */
(function(){
  const E=v=>escapeHtml(v);
  state.strategyProfile=state.strategyProfile||'variado';
  state.showStrategyReferences=state.showStrategyReferences!==false;
  save();

  const GENERAL=[
    {author:'Doug Lemov',tags:['general','oralidad','participacion'],name:'Piensa – conversa – comparte',desc:'Da un breve tiempo individual para pensar, luego contraste en pareja y finalmente socialización. El docente recoge respuestas de distintos niveles y pide justificar.'},
    {author:'Doug Lemov',tags:['general','comprension'],name:'Todos producen antes de responder',desc:'Antes de la puesta en común, todos escriben, dibujan, representan o registran una respuesta breve; así aumenta la participación cognitiva y se obtiene evidencia de comprensión.'},
    {author:'Doug Lemov',tags:['general','profundizacion'],name:'Estirar la respuesta',desc:'Después de una respuesta inicial, formula repreguntas: ¿por qué?, ¿cómo lo sabes?, ¿qué evidencia tienes?, ¿puedes explicarlo de otra manera?, ¿qué pasaría si…?'},
    {author:'Doug Lemov',tags:['general','comprension'],name:'Verificación rápida de comprensión',desc:'Usa respuestas simultáneas, tarjetas, mini pizarras, ejemplos/no ejemplos o una producción de un minuto para decidir si avanzar, volver a modelar o formar un grupo de apoyo.'},
    {author:'Rebeca Anijovich',tags:['general','evaluacion'],name:'Criterios visibles y anticipados',desc:'Presenta el criterio con ejemplos comprensibles antes de la tarea; durante el trabajo los estudiantes lo usan para revisar su producción y tomar decisiones de mejora.'},
    {author:'Rebeca Anijovich',tags:['general','evaluacion','retroalimentacion'],name:'Circuito de retroalimentación',desc:'Valora un avance concreto, formula una pregunta que ayude a pensar, sugiere una pista cuando sea necesario y pide al estudiante aplicar la mejora en la misma producción.'},
    {author:'Rebeca Anijovich',tags:['general','metacognicion'],name:'Autoevaluación con evidencia',desc:'El estudiante contrasta su trabajo con el criterio, identifica qué logró, muestra la evidencia y decide un próximo paso de mejora.'},
    {author:'Francisco Mora',tags:['general','atencion'],name:'Curiosidad y sorpresa pertinente',desc:'Inicia un tramo del aprendizaje con una imagen, objeto, dato inesperado, demostración o pregunta conectada con la vida del estudiante para activar atención y deseo de comprender.'},
    {author:'Francisco Mora',tags:['general','movimiento'],name:'Cambio breve de canal',desc:'Alterna explicación, manipulación, desplazamiento, observación y diálogo para renovar la atención sin perder el propósito de aprendizaje.'},
    {author:'Frida Díaz Barriga',tags:['general','situado'],name:'Tarea auténtica situada',desc:'Plantea una decisión, problema, caso o producto que tenga sentido en el contexto real de la comunidad y demande utilizar el conocimiento para actuar.'},
    {author:'Frida Díaz Barriga',tags:['general','colaboracion'],name:'Aprendizaje colaborativo con roles',desc:'Organiza equipos con roles cognitivos claros —explica, pregunta, registra, verifica, sintetiza— y un producto común que obligue a negociar significados.'},
    {author:'Carol Ann Tomlinson',tags:['general','diferenciacion'],name:'Tareas escalonadas con un mismo criterio',desc:'Mantén el mismo propósito y criterio, pero varía andamiajes, complejidad, representación, cantidad de información o autonomía según preparación de los estudiantes.'},
    {author:'Carol Ann Tomlinson',tags:['general','diferenciacion'],name:'Agrupamiento flexible',desc:'Forma grupos temporales por necesidad, estrategia, interés o nivel de autonomía; cambia los grupos durante la sesión según la evidencia recogida.'},
    {author:'Carol Ann Tomlinson',tags:['general','diferenciacion'],name:'Opciones de producto o representación',desc:'Permite demostrar el mismo aprendizaje mediante texto, explicación oral, gráfico, modelo, esquema o recurso digital cuando el criterio lo permita.'}
  ];

  const AREA={
    'Comunicación':[
      {author:'Delia Lerner',name:'Leer y escribir con propósito social',desc:'La lectura o escritura responde a una necesidad real: informarse, convencer, registrar, invitar, explicar o compartir con un destinatario auténtico.'},
      {author:'Delia Lerner',name:'Circulación real del texto',desc:'Define desde el inicio quién leerá o escuchará el producto y genera una situación de revisión porque el texto tendrá un uso más allá de “cumplir la tarea”.'},
      {author:'Daniel Cassany',name:'Proceso recursivo de escritura',desc:'Planificar, producir un borrador, leer como destinatario, revisar contenido y forma, reescribir y publicar. La revisión puede volver sobre decisiones anteriores.'},
      {author:'Daniel Cassany',name:'Revisión entre pares con foco',desc:'Los pares revisan uno o dos aspectos específicos del criterio, señalan evidencias y formulan una sugerencia concreta; luego el autor decide qué mejora aplicar.'},
      {author:'Daniel Cassany',name:'Modelado del pensamiento del lector/escritor',desc:'El docente piensa en voz alta al anticipar, inferir, seleccionar información, organizar ideas o revisar una frase, haciendo visible una estrategia que luego el estudiante intenta de manera autónoma.'}
    ],
    'Matemática':[
      {author:'George Pólya',name:'Comprender – planificar – ejecutar – mirar atrás',desc:'Comprenden qué se busca y qué datos importan; proponen más de una estrategia; ejecutan; verifican y explican si la respuesta tiene sentido en el contexto.'},
      {author:'George Pólya',name:'Problema relacionado o caso más simple',desc:'Si el problema bloquea, resuelven una versión más accesible, buscan un patrón o representan un caso particular para volver luego al reto original.'},
      {author:'Guy Brousseau',name:'Situación de búsqueda con medio didáctico',desc:'Entrega un problema y materiales o información que permitan tomar decisiones y recibir retroacciones del propio problema, evitando explicar de inmediato el procedimiento esperado.'},
      {author:'Guy Brousseau',name:'Formulación – validación – institucionalización',desc:'Primero los estudiantes formulan estrategias, luego las confrontan y validan con razones o contraejemplos; finalmente el docente organiza y formaliza el conocimiento matemático construido.'},
      {author:'Guy Brousseau',name:'Error como información para la situación',desc:'En lugar de corregir de inmediato, usa una pregunta, dato o caso que permita al estudiante comprobar la insuficiencia de su estrategia y revisarla.'}
    ],
    'Ciencia y Tecnología':[
      {author:'Melina Furman',name:'Pregunta investigable',desc:'Transforma una curiosidad amplia en una pregunta que pueda explorarse mediante observaciones, comparaciones, mediciones, pruebas o consulta crítica de fuentes.'},
      {author:'Melina Furman',name:'Predicción con justificación',desc:'Antes de observar el resultado, los estudiantes anticipan qué creen que ocurrirá y explican por qué; después contrastan predicción y evidencia.'},
      {author:'Melina Furman',name:'Cuaderno de evidencias',desc:'Registran datos, dibujos, tablas, medidas, cambios y dudas; luego separan “lo que observamos” de “lo que pensamos que significa”.'},
      {author:'Melina Furman',name:'Construcción y revisión de explicaciones',desc:'Elaboran una explicación inicial, la contrastan con datos o fuentes y la modifican cuando la evidencia no la sostiene.'},
      {author:'Melina Furman',name:'Comparar diseños de indagación',desc:'Analizan distintas maneras de investigar la misma pregunta y discuten cuál produce evidencias más confiables y por qué.'}
    ],
    'Personal Social':[
      {author:'Frida Díaz Barriga',name:'Análisis de caso situado',desc:'Presenta un caso cercano con decisiones en tensión; los estudiantes identifican actores, argumentos, consecuencias y construyen una decisión justificada.'},
      {author:'Frida Díaz Barriga',name:'Problema comunitario y propuesta viable',desc:'Analizan una necesidad del entorno, recuperan información y saberes locales, comparan alternativas y elaboran una acción posible con responsables y criterios.'}
    ],
    'Ciencias Sociales':[
      {author:'Frida Díaz Barriga',name:'Caso y fuentes para explicar una situación',desc:'Contrasta testimonios, datos, imágenes, mapas o documentos para formular explicaciones y tomar posición sustentada frente a un problema social.'},
      {author:'Frida Díaz Barriga',name:'Aprendizaje basado en problemas sociales',desc:'Parte de una pregunta problemática, distribuye tareas de investigación, organiza evidencias y culmina en una explicación o propuesta argumentada.'}
    ],
    'DPCC':[
      {author:'Frida Díaz Barriga',name:'Dilema situado y deliberación',desc:'Analiza un dilema realista, explicita valores e intereses en conflicto, escucha perspectivas diferentes y sustenta una decisión considerando derechos y bien común.'}
    ]
  };

  const EIB=[
    {author:'MINEDU – diálogo de saberes EIB',name:'Profundización del saber local',desc:'Recupera la explicación de estudiantes, familias o yachaq; pregunta por razones, procedimientos, señales, significados y cambios en el tiempo.'},
    {author:'MINEDU – diálogo de saberes EIB',name:'Comparación de saberes sin jerarquizarlos',desc:'Contrasta el saber local con otras fuentes o explicaciones, identifica coincidencias y diferencias y analiza para qué situaciones resulta útil cada conocimiento.'},
    {author:'MINEDU – enfoque intercultural',name:'Uso pedagógico de la lengua y repertorio local',desc:'Permite pensar, preguntar, explicar y producir en la lengua pertinente; recupera vocabulario comunitario y revisa su correspondencia con el registro escolar cuando sea necesario.'}
  ];

  function hash(s){let h=0;for(const c of String(s||''))h=(h*31+c.charCodeAt(0))>>>0;return h;}
  function rotatePick(arr,n,seed){if(!arr.length)return[];const start=seed%arr.length;return Array.from({length:Math.min(n,arr.length)},(_,i)=>arr[(start+i*3)%arr.length]);}
  function strategySet(session){
    const seed=hash(`${session.title}|${session.area}|${session.unitId}`);
    const area=AREA[session.area]||[];
    const general=rotatePick(GENERAL,5,seed);
    const specific=rotatePick(area,Math.min(4,area.length),seed+7);
    const eib=(state.language==='Quechua'||state.language==='Bilingüe')?rotatePick(EIB,2,seed+11):[];
    // Asegura siempre diversidad: evaluación, diferenciación, pensamiento y estrategia propia del área.
    const required=[];
    const byTag=(tag)=>GENERAL.find(x=>x.tags.includes(tag));
    ['evaluacion','diferenciacion'].forEach(t=>{const x=byTag(t);if(x)required.push(x);});
    return [...required,...specific,...general,...eib].filter((x,i,a)=>a.findIndex(y=>y.name===x.name)===i).slice(0,10);
  }

  function groupStrategies(list){
    const early=list.slice(0,2), core=list.slice(2,8), close=list.slice(8);
    return {early,core,close};
  }
  function stratHtml(list){return list.map((s,i)=>`<div class="dd-strategy"><b>${i+1}. ${E(s.name)}</b><span>${E(s.desc)}</span><small>Referencia pedagógica: ${E(s.author)}</small></div>`).join('');}

  const baseSessionHtml=window.sessionHtml;
  window.sessionHtml=function(session,forWord=false){
    const strategies=strategySet(session);session.strategies=strategies;
    const groups=groupStrategies(strategies);
    const crit=session.grades.map(g=>`<b>${E(g)}:</b> ${E(ddSessionCriterion?ddSessionCriterion(session,g):'Criterio diferenciado según el grado.')}`).join('<br>');
    const perf=session.grades.map(g=>`<b>${E(g)}:</b> ${E(ddSessionPerf?ddSessionPerf(session,g):'Desempeño precisado según el grado.')}`).join('<br>');
    const processNames=typeof ddSessionProcesses==='function'?ddSessionProcesses(session):['Exploración del reto','Construcción del aprendizaje','Socialización y formalización'];
    const taskRows=session.grades.map(g=>`<tr><td><b>${E(g)}</b></td><td>${E(ddSessionPerf?ddSessionPerf(session,g):'Tarea diferenciada')}</td><td>${E(ddSessionCriterion?ddSessionCriterion(session,g):'Criterio diferenciado')}</td></tr>`).join('');
    const rubricRows=session.grades.map(g=>`<tr><td>${E(g)} – ${E(ddSessionCriterion?ddSessionCriterion(session,g):'Criterio')}</td><td>Requiere apoyo frecuente y todavía no evidencia las actuaciones esperadas.</td><td>Evidencia parcialmente las actuaciones con apoyo o de manera inestable.</td><td>Evidencia las actuaciones esperadas de manera pertinente y autónoma.</td><td>Supera lo esperado, sustenta decisiones y transfiere el aprendizaje a nuevas situaciones.</td></tr>`).join('');
    const unit=state.units.find(u=>u.id===session.unitId);
    const enfoques=unit&&typeof ddEnfoquesHtml==='function'?ddEnfoquesHtml(unit):'';
    const trans=unit&&typeof ddTransversalHtml==='function'?ddTransversalHtml(unit):'';
    return `<div class="dd-session-doc"><h1 style="text-align:center">SESIÓN DE APRENDIZAJE MAESTRA</h1><h2 style="text-align:center">“${E(session.title)}”</h2>
      <h2>1. DATOS INFORMATIVOS</h2><div class="dd-scroll"><table class="dd-table"><tr><td><b>Área:</b> ${E(session.area)}</td><td><b>Grados:</b> ${E(session.grades.join(', '))}</td><td><b>Duración:</b> ${E(session.duration)}</td><td><b>Unidad:</b> ${E(session.unitTitle)}</td></tr></table></div>
      <h2>2. PROPÓSITOS DE APRENDIZAJE</h2><div class="dd-scroll"><table class="dd-table"><thead><tr><th>Competencia / capacidades</th><th>Desempeños precisados</th><th>Criterios</th><th>Evidencia</th><th>Instrumento</th></tr></thead><tbody><tr><td>${E(session.competence)}<br><small>${E((competenceMap?.[session.area]||{}).capacities||'Capacidades correspondientes a la competencia')}</small></td><td>${perf}</td><td>${crit}</td><td>${E(session.evidence)}</td><td>${E(session.instrument)}</td></tr></tbody></table></div><h3>Propósito para los estudiantes</h3><p>${E(session.purpose)}</p>
      <h2>3. ENFOQUES TRANSVERSALES</h2>${enfoques}<h2>4. COMPETENCIAS TRANSVERSALES</h2>${trans}
      <h2>5. PREPARACIÓN DE LA SESIÓN</h2><div class="dd-scroll"><table class="dd-table"><thead><tr><th>Antes de la sesión</th><th>Recursos</th></tr></thead><tbody><tr><td>Preparar el reto, ejemplos o contraejemplos, tareas diferenciadas, instrumento de evaluación y materiales. Definir qué evidencias se observarán y en qué momento se retroalimentará.</td><td>${E(session.resources)}; materiales concretos; papelotes; fichas A4; recursos de la comunidad y recurso visual o digital solo si aporta al propósito.</td></tr></tbody></table></div>
      <h2>6. MOMENTOS DE LA SESIÓN</h2><div class="dd-scroll"><table class="dd-table"><thead><tr><th>MOMENTOS</th><th>ESTRATEGIAS / ACTIVIDADES</th><th>TIEMPO</th></tr></thead><tbody>
      <tr><td><b>INICIO</b><br>Involucramiento y desafío</td><td>• Acogida y conexión socioemocional con la experiencia del estudiante.<br>• Recuperación activa de saberes previos mediante producción, diálogo, objeto, imagen, caso o situación breve.<br>• Presentación de propósito y criterios en lenguaje comprensible.<br>• <b>Reto:</b> ${E(session.challenge)}<div class="dd-strategy-pack">${stratHtml(groups.early)}</div></td><td>${session.times.start} min</td></tr>
      <tr><td><b>DESARROLLO</b><br>Pensamiento, acción y mediación</td><td>${processNames.map((p,i)=>`<div class="dd-process"><b>PROCESO ${i+1} – ${E(p).toUpperCase()}</b><p>El docente propone una tarea que obliga a observar, decidir, representar, contrastar, explicar, producir o argumentar; evita resolver por el estudiante y usa evidencias para ajustar la mediación.</p></div>`).join('')}<h4>Banco de estrategias seleccionado para esta sesión</h4><div class="dd-strategy-pack">${stratHtml(groups.core)}</div><h4>Atención diferenciada y simultánea</h4><div class="dd-scroll"><table class="dd-table"><thead><tr><th>Grado</th><th>Tarea / desempeño diferenciado</th><th>Criterio</th></tr></thead><tbody>${taskRows}</tbody></table></div><p><b>Mediación y retroalimentación:</b> observar, recoger evidencia, preguntar antes de explicar, ofrecer una pista graduada, pedir revisión y volver a comprobar. En multigrado, alternar atención directa, trabajo autónomo productivo, tutoría entre pares y reagrupamiento flexible.</p></td><td>${session.times.dev} min</td></tr>
      <tr><td><b>CIERRE</b><br>Metacognición y transferencia</td><td>• Socialización centrada en las evidencias y no solo en “la respuesta correcta”.<br>• Autoevaluación frente al criterio: qué logré, dónde está la evidencia y qué mejoraré.<br>• Transferencia: ¿en qué otra situación podría usar lo aprendido?<div class="dd-strategy-pack">${stratHtml(groups.close)}</div></td><td>${session.times.close} min</td></tr></tbody></table></div>
      <h2>7. INSTRUMENTO DE EVALUACIÓN</h2><div class="dd-scroll"><table class="dd-table"><thead><tr><th>Criterio por grado</th><th>C – Inicio</th><th>B – Proceso</th><th>A – Logrado</th><th>AD – Destacado</th></tr></thead><tbody>${rubricRows}</tbody></table></div>
      <h2>8. FORMALIZACIÓN PARA PIZARRA</h2><div class="dd-reto">La formalización se construye después de que los estudiantes hayan producido, contrastado o resuelto. Resume la idea, procedimiento, conclusión o regla que se desprende de la experiencia, con lenguaje adecuado al área y grado.</div>
      <h2>9. MATERIALES / ANEXOS</h2><p>Fichas diferenciadas, recurso de problematización, materiales concretos o fuentes, formalización visual e instrumento listo para aplicar.</p>
      ${state.showStrategyReferences?`<div class="dd-ped-note"><b>Base pedagógica empleada por la app:</b> ${E([...new Set(strategies.map(s=>s.author))].join(' · '))}. Las estrategias se seleccionan por pertinencia; no se aplican mecánicamente ni sustituyen los procesos didácticos del área.</div>`:''}${forWord?'<p><i>Documento editable. El docente revisa y contextualiza antes de su aplicación.</i></p>':''}</div>`;
  };

  // Configuración para que el docente pueda pedir diversidad o énfasis sin escoger autores.
  const sessionCard=byId('session')?.querySelector('.card');
  if(sessionCard&&!byId('ddStrategyProfile')){
    const form=sessionCard.querySelector('.form2');
    const label=document.createElement('label');label.innerHTML=`Estrategias de desarrollo<select id="ddStrategyProfile"><option value="variado">Variadas y pertinentes (recomendado)</option><option value="indagacion">Mayor énfasis en indagación y evidencia</option><option value="colaboracion">Mayor énfasis en colaboración y diálogo</option><option value="diferenciacion">Mayor énfasis en diferenciación</option><option value="pensamiento">Mayor énfasis en razonamiento y argumentación</option></select><small>La app combina varias estrategias; no usa una receta única.</small>`;form?.appendChild(label);byId('ddStrategyProfile').value=state.strategyProfile;byId('ddStrategyProfile').onchange=e=>{state.strategyProfile=e.target.value;save();};
  }

  // Muestra el banco en Modo Experto para transparencia pedagógica.
  const settingsCard=byId('settings')?.querySelector('.card');
  if(settingsCard&&!byId('ddStrategyInfo')){
    const div=document.createElement('div');div.id='ddStrategyInfo';div.className='dd-strategy-info topgap';div.innerHTML=`<h2>🧠 Banco pedagógico de estrategias</h2><p>DocenteDigital combina estrategias de participación y comprensión, evaluación formativa, aprendizaje situado, lectura y escritura, resolución de problemas, situaciones didácticas, indagación científica y diferenciación. La selección cambia según área, reto, evidencia, nivel y contexto.</p><p><b>Autores y referentes considerados:</b> Doug Lemov · Rebeca Anijovich · Francisco Mora · Frida Díaz Barriga · Delia Lerner · Daniel Cassany · George Pólya · Guy Brousseau · Melina Furman · Carol Ann Tomlinson · orientaciones MINEDU/EIB.</p>`;settingsCard.appendChild(div);
  }

  const css=document.createElement('style');css.textContent=`.dd-strategy-pack{display:grid;gap:7px;margin:10px 0}.dd-strategy{border-left:3px solid #6b8f7c;background:#f7faf8;padding:8px 10px;border-radius:5px}.dd-strategy b{display:block}.dd-strategy span{display:block;margin-top:2px}.dd-strategy small{display:block;margin-top:4px;color:#667;font-style:italic}.dd-process{padding:6px 0;border-bottom:1px dotted #bbb}.dd-ped-note{margin-top:14px;padding:9px;border:1px dashed #888;background:#fafafa;font-size:.92em}.dd-strategy-info{border-top:1px solid #ddd;padding-top:14px}`;document.head.appendChild(css);
})();