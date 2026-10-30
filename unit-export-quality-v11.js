/* DocenteDigital Fase 11: corrección de calidad observable en exportación y vista.
   Primaria: conserva decisiones del docente; no inventa desempeños literales ni horario.
   Se aplica al vuelo incluso a unidades ya creadas, sin reescribir el historial. */
(function(){
  if(window.__ddUnitExportQualityV11)return;
  window.__ddUnitExportQualityV11=true;
  const esc=v=>typeof window.escapeHtml==='function'?window.escapeHtml(String(v??'')):
    String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clean=v=>String(v??'').replace(/\s+/g,' ').trim();
  const lower=v=>clean(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const limit=(s,n=130)=>{s=clean(s);return s.length>n?s.slice(0,n).replace(/\s+\S*$/,'')+'…':s;};
  const gradeNum=g=>Number((String(g).match(/\d+/)||[])[0]||0);
  const cycle=n=>n<=2?'III':n<=4?'IV':'V';
  const days=['Lunes','Martes','Miércoles','Jueves','Viernes'];
  function situation(u){
    const authored=clean(u?.situationBrief),selected=clean(u?.situation);
    if(/^Un hecho relacionado con\s*[“"]/.test(selected) || /llam[oó] la atenci[oó]n de los estudiantes de nuestra comunidad/i.test(selected)) {
      if(authored.length>=100)return authored;
      const quote=selected.match(/Un hecho relacionado con\s*[“"]([\s\S]*?)[”"]/);
      if(quote?.[1])return clean(quote[1]);
    }
    return selected||authored||'Situación por completar y confirmar con el docente.';
  }
  function competences(u,area,title){
    const core=window.DD_OFFICIAL_CURRICULUM;
    const c=core?.pickCompetence?.(u.level,area,title);
    return c?.name||'Competencia por identificar y confirmar';
  }
  function strand(area,title){
    const t=lower(title);
    if(area==='Comunicación')return /escrib|produc|redact|planificamos un texto|rotulo|cartel/.test(t)?'escritura':/leer|leemos|lectura|texto|comprende|interpretamos|informacion/.test(t)?'lectura':'oralidad';
    if(area==='Matemática')return /dato|graf|encuesta|tabla|estad|probab/.test(t)?'datos':/perimetr|area|figura|mapa|croquis|forma|geometr/.test(t)?'forma':/patron|equiv|regular|sucesion/.test(t)?'regularidad':'cantidad';
    if(area==='Personal Social')return /antes|ahora|pasado|histori|cambio|permanencia|fuente|memoria|tradicion/.test(t)?'historia':/dinero|presupuesto|ahorro|consumo|compra/.test(t)?'economía':/espacio|ambiente|territor|croquis|riesgo/.test(t)?'ambiente':'convivencia';
    if(area==='Ciencia y Tecnología')return /diseñ|constru|prototipo|solucion tecnol/.test(t)?'diseña':/explica|causa|por que/.test(t)?'explica':'indaga';
    return 'general';
  }
  function gradeAction(area,title,grade){
    const n=gradeNum(grade),s=strand(area,title);
    if(!n)return 'Definir una actuación observable para la edad o grado seleccionado.';
    if(area==='Comunicación'){
      if(s==='lectura')return n<=2?'Identifica información explícita con imágenes y explica oralmente una idea del texto.':n<=4?'Localiza información relevante y explica con sus palabras la idea principal del texto.':'Contrasta información del texto, infiere una idea y la sustenta con detalles leídos.';
      if(s==='escritura')return n<=2?'Produce un rótulo o frase comprensible con apoyo y revisa si comunica su intención.':n<=4?'Organiza y escribe un texto breve para un destinatario y revisa su claridad.':'Planifica, redacta y revisa un texto coherente usando información de fuentes.';
      return n<=2?'Comunica una idea y escucha respetuosamente a sus compañeros.':n<=4?'Organiza un relato oral y responde preguntas relacionadas con el tema.':'Sustenta oralmente una explicación con razones y responde preguntas.';
    }
    if(area==='Matemática'){
      if(s==='datos')return n<=2?'Organiza conteos en un pictograma sencillo y comenta qué categoría tiene más.':n<=4?'Registra datos en una tabla y compara sus frecuencias con un gráfico.':'Representa datos, interpreta diferencias y sustenta una conclusión.';
      if(s==='forma')return n<=2?'Identifica y representa formas o recorridos con objetos y dibujos.':n<=4?'Elabora croquis o mide y compara longitudes explicando cómo lo hizo.':'Aplica medidas y representaciones espaciales para resolver y verificar un problema.';
      if(s==='regularidad')return n<=2?'Continúa un patrón con material concreto y explica su regla.':n<=4?'Identifica la regla de una secuencia y verifica sus resultados.':'Modela relaciones, compara procedimientos y justifica equivalencias.';
      return n<=2?'Resuelve un problema con material concreto o dibujos y explica su reparto o conteo.':n<=4?'Elige operaciones para resolver el problema y comprueba el procedimiento.':'Modela la situación, compara estrategias y justifica el resultado.';
    }
    if(area==='Personal Social'){
      if(s==='historia')return n<=2?'Describe semejanzas o diferencias entre dos testimonios o imágenes del pasado y presente.':n<=4?'Ordena hechos y distingue cambios y permanencias apoyándose en fuentes.':'Contrasta dos fuentes, explica cambios y permanencias y diferencia hechos de opiniones.';
      if(s==='economía')return n<=2?'Distingue necesidades y decisiones de consumo en un caso cercano.':n<=4?'Explica decisiones de uso responsable de recursos con ejemplos.':'Compara opciones de gasto y ahorro, y argumenta decisiones responsables.';
      if(s==='ambiente')return n<=2?'Reconoce una situación del entorno y propone una acción de cuidado.':n<=4?'Interpreta información del espacio y propone una acción ambiental.':'Analiza causas y consecuencias de un problema territorial y sustenta una propuesta.';
      return n<=2?'Escucha experiencias y propone un acuerdo sencillo de convivencia.':n<=4?'Explica un acuerdo y participa respetando opiniones distintas.':'Delibera con argumentos y propone acciones para el bien común.';
    }
    if(area==='Ciencia y Tecnología'){
      if(s==='diseña')return n<=2?'Representa una posible solución con un dibujo y prueba su funcionamiento.':n<=4?'Diseña un modelo, lo pone a prueba y registra una mejora.':'Justifica un diseño, evalúa pruebas y modifica el prototipo según evidencias.';
      if(s==='explica')return n<=2?'Describe el fenómeno observado con ejemplos y palabras propias.':n<=4?'Relaciona causas y efectos utilizando observaciones y fuentes.':'Elabora una explicación sustentada en conocimientos y evidencias.';
      return n<=2?'Plantea una pregunta, observa y registra mediante dibujos lo que encontró.':n<=4?'Formula una predicción, registra datos y los compara con lo esperado.':'Define variables pertinentes, analiza datos y sustenta una conclusión.';
    }
    return n<=2?'Participa y comunica mediante una representación sencilla lo que aprendió.':n<=4?'Elabora una producción y explica las decisiones tomadas.':'Desarrolla una producción y argumenta sus decisiones con evidencias.';
  }
  function evidence(area,title){
    const s=strand(area,title);
    if(area==='Comunicación')return s==='lectura'?'Respuestas y organizador de lectura':s==='escritura'?'Borrador revisado y texto final':'Intervención oral registrada';
    if(area==='Matemática')return s==='datos'?'Tabla y gráfico interpretados':'Resolución con representación y explicación';
    if(area==='Personal Social')return s==='historia'?'Comparación de fuentes y línea de tiempo':'Organizador o acuerdo argumentado';
    if(area==='Ciencia y Tecnología')return s==='indaga'?'Registro de observaciones y conclusión':s==='diseña'?'Boceto, prototipo y registro de pruebas':'Explicación sustentada';
    return 'Producción o actuación observable';
  }
  function table(head,rows,weights){
    return `<table${weights?' data-col-weights="'+weights.join(',')+'"':''}><thead><tr>${head.map(s=>`<th>${esc(s)}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table>`;
  }
  function gradeRows(unit,area,title){return (unit.grades||[]).map(g=>`<b>${esc(g)}:</b> ${esc(gradeAction(area,title,g))}`).join('<br>');}
  function scheduleTable(unit,week){
    const rows=(unit.activities||[]).filter(x=>(Number(x.week)||1)===week);
    return table(['Día y horario','Área · sesión','Criterio / acción por grado','Evidencia'],rows.map((a,i)=>{
      const idx=(Number(a.order)||((week-1)*15+i+1))-1;
      const day=a.day||days[Math.floor((idx%15)/3)]||'Por confirmar';
      const time=a.time?' · '+a.time:' · Hora por confirmar';
      return `<tr><td> ${esc(day)}${esc(time)}</td><td><b>${esc(a.area)}</b><br>${esc(limit(a.title,105))}</td><td>${gradeRows(unit,a.area,a.title)}</td><td>${esc(evidence(a.area,a.title))}<br><i>${esc((unit.purposes||[]).find(p=>p.area===a.area)?.instrument||'Instrumento por definir')}</i></td></tr>`;
    }),[17,25,40,18]);
  }
  function purposeTable(unit){
    const rows=(unit.areas||[]).map(area=>{
      const acts=(unit.activities||[]).filter(a=>a.area===area),title=acts[0]?.title||'';
      const comps=[...new Set(acts.map(a=>competences(unit,area,a.title)))].slice(0,3);
      return `<tr><td><b>${esc(area)}</b><br>${comps.map(esc).join('<br>')}<br><i>Competencia(s) para cotejo docente</i></td><td>${gradeRows(unit,area,title)}</td><td>${esc(evidence(area,title))}</td></tr>`;
    });
    return table(['Área y competencias propuestas','Criterios orientadores por grado','Evidencia'],rows,[31,47,22]);
  }
  function qualityFlags(unit){
    const notes=[];
    const acts=unit.activities||[];
    if(acts.some(a=>!a.time))notes.push('Horarios sin registrar: verificar bloques antes de aplicar.');
    if(!unit.documentContextSnapshot?.institution)notes.push('Institución educativa por completar.');
    if(!unit.documentContextSnapshot?.teacher)notes.push('Nombre del docente por completar.');
    if((unit.areas||[]).some(a=>!acts.some(x=>x.area===a)))notes.push('Hay áreas sin sesiones asignadas. Revisar la programación.');
    const clause=clean(unit.situationBrief||'').match(/(?:incluye|trabajaremos|[aá]reas:)([^.!?]{8,180})/i)?.[1]||'';
    const available=['Comunicación','Matemática','Personal Social','Ciencia y Tecnología','Arte y Cultura','Educación Física','Educación Religiosa'];
    const requested=available.filter(area=>lower(clause).includes(lower(area)));
    if(requested.length>=2&&(unit.areas||[]).some(area=>!requested.includes(area)))
      notes.push('La solicitud escrita menciona menos áreas que el perfil. Revisar las áreas de la unidad antes de aplicar.');
    if(acts.some(x=>!x.title||!x.area))notes.push('Existen actividades incompletas.');
    if(!acts.length)notes.push('Falta programar la secuencia de actividades.');
    const titles=new Map();
    for(const a of acts){const name=lower(a.title);if(name)titles.set(name,(titles.get(name)||0)+1);}
    const repeated=[...titles].filter(([,count])=>count>=4);
    if(repeated.length)notes.push('Hay títulos de sesiones repetidos cuatro o más veces. Revisar la progresión y evitar reiteraciones.');
    return notes;
  }
  function word(unit){
    const id=unit.documentContextSnapshot||{},activities=unit.activities||[];
    const weeks=[...new Set(activities.map(a=>Number(a.week)||1))].sort((a,b)=>a-b);
    const title=/proyecto/i.test(unit.type||'')?'PROYECTO DE APRENDIZAJE':'UNIDAD DE APRENDIZAJE';
    const general=table(['Campo','Registro','Campo','Registro'],[
      `<tr><td>I.E.</td><td>${esc(id.institution||'Por completar')}</td><td>Docente</td><td>${esc(id.teacher||'Por completar')}</td></tr>`,
      `<tr><td>Nivel</td><td>${esc(unit.level)}</td><td>Organización</td><td>${esc(unit.ieType)}</td></tr>`,
      `<tr><td>Grados / ciclos</td><td>${esc((unit.grades||[]).map(g=>`${g} (ciclo ${cycle(gradeNum(g))})`).join(' · '))}</td><td>Duración</td><td>${esc(unit.duration)}</td></tr>`
    ],[14,35,17,34]);
    const notes=qualityFlags(unit);
    const sequence=weeks.map(week=>`<h3>Semana ${week} — actividades programadas</h3>${scheduleTable(unit,week)}`).join('');
    return `<div class="dd-word-v11"><h1>${esc(title)}</h1><h2>“${esc(unit.title)}”</h2>
      <h2>I. DATOS GENERALES</h2>${general}
      <h2>II. SITUACIÓN SIGNIFICATIVA, RETO Y PRODUCTO</h2><p>${esc(situation(unit))}</p>
      <p><b>Pregunta retadora:</b> ${esc(unit.reto||'Por confirmar con el docente')}</p><p><b>Producto integrador:</b> ${esc(unit.product||'Por confirmar con el docente')}</p>
      <h2>III. PROPÓSITOS Y CRITERIOS ORIENTADORES</h2><p>Competencias y criterios sugeridos para revisar con el programa curricular MINEDU. Estos criterios no son desempeños oficiales literales.</p>${purposeTable(unit)}
      <h2>IV. RUTA PEDAGÓGICA DE LA UNIDAD</h2><p><b>Explorar y preguntar → Investigar y registrar → Organizar y crear → Comunicar y evaluar.</b> La secuencia detallada figura en las sesiones de cada semana.</p>
      <h2>V. SECUENCIA DE SESIONES</h2>${sequence}
      <h2>VI. EVALUACIÓN FORMATIVA</h2><p>Recoger evidencias durante el trabajo, compararlas con los criterios por grado, ofrecer retroalimentación y permitir mejoras del producto antes de su presentación.</p>
      ${table(['Grado','Evidencia de avance','Instrumento orientador'],(unit.grades||[]).map(g=>`<tr><td>${esc(g)}</td><td>Producción vinculada a la actividad del día</td><td>Lista de cotejo o rúbrica revisada por el docente</td></tr>`),[16,47,37])}
      <h2>VII. ASPECTOS POR COMPLETAR</h2>${notes.length?`<ul>${notes.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'<p>Los campos esenciales se encuentran registrados. Cotejar competencias y desempeños antes de utilizar la planificación.</p>'}
      <p><i>Documento editable de apoyo. Verificar el CNEB, los desempeños por grado y la pertinencia didáctica antes de usar en aula.</i></p></div>`;
  }
  function preview(unit){
    const weeks=[...new Set((unit.activities||[]).map(a=>Number(a.week)||1))].sort((a,b)=>a-b);
    return `<h2>Secuencia de sesiones por semana (vista resumida)</h2><p><small>Los criterios son propuestas observables editables, no desempeños MINEDU literales.</small></p>${weeks.map(w=>`<h3>Semana ${w}</h3>${scheduleTable(unit,w)}`).join('')}`;
  }
  const oldWord=window.unitWordHtml;
  if(typeof oldWord==='function')window.unitWordHtml=function(unit){
    if(unit?.level!=='Primaria')return oldWord.apply(this,arguments);
    return word(unit);
  };
  const oldRender=window.renderUnitOutput;
  if(typeof oldRender==='function')window.renderUnitOutput=function(unit){
    const result=oldRender.apply(this,arguments);
    if(unit?.level==='Primaria'){
      const section=document.getElementById('dd-sesiones');
      if(section)section.innerHTML=preview(unit);
    }
    return result;
  };
  window.DD_UNIT_EXPORT_QUALITY_V11={situation,gradeAction,scheduleTable,word,qualityFlags,preview};
})();
