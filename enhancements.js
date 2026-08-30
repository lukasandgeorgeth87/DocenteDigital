/* DocenteDigital - mejoras de estructura de unidad/sesión basadas en los modelos maestros del docente */
(function(){
  const E=(v)=>escapeHtml(v);
  const primarySchedule={
    Lunes:['Comunicación','Personal Social','Ciencia y Tecnología'],
    Martes:['Matemática','Ciencia y Tecnología','Matemática'],
    Miércoles:['Comunicación','Matemática','Educación Religiosa'],
    Jueves:['Matemática','Arte y Cultura','Comunicación'],
    Viernes:['Comunicación','Personal Social','Educación Física']
  };

  const competenceMap={
    'Comunicación':{
      competence:'Se comunica oralmente / Lee / Escribe diversos tipos de textos en su lengua materna.',
      capacities:'Obtiene información; infiere e interpreta; adecúa, organiza y desarrolla ideas; utiliza convenciones; reflexiona y evalúa.',
      evidence:'Texto, intervención oral o producción comunicativa vinculada al reto.',instrument:'Rúbrica o lista de cotejo.'},
    'Matemática':{
      competence:'Resuelve problemas de cantidad, regularidad, forma y gestión de datos según la situación.',
      capacities:'Traduce datos; comunica su comprensión; usa estrategias y procedimientos; argumenta afirmaciones.',
      evidence:'Resolución contextualizada con representación, procedimiento y explicación.',instrument:'Lista de cotejo o rúbrica.'},
    'Personal Social':{
      competence:'Construye su identidad / Convive y participa democráticamente en la búsqueda del bien común.',
      capacities:'Se valora a sí mismo; autorregula sus emociones; interactúa; construye normas; delibera y participa.',
      evidence:'Organizador, acuerdos o propuesta argumentada vinculada a la comunidad.',instrument:'Escala de valoración.'},
    'Ciencia y Tecnología':{
      competence:'Indaga mediante métodos científicos para construir conocimientos.',
      capacities:'Problematiza situaciones; diseña estrategias; genera y registra datos; analiza datos; evalúa y comunica.',
      evidence:'Registro de indagación, explicación o conclusión sustentada en evidencias.',instrument:'Rúbrica de indagación.'},
    'Arte y Cultura':{
      competence:'Aprecia de manera crítica manifestaciones artístico-culturales / Crea proyectos desde los lenguajes artísticos.',
      capacities:'Percibe; contextualiza; reflexiona; explora lenguajes; aplica procesos creativos; evalúa y comunica.',
      evidence:'Producción artística contextualizada y explicación de su proceso.',instrument:'Rúbrica.'},
    'Educación Física':{
      competence:'Se desenvuelve de manera autónoma a través de su motricidad / Interactúa mediante habilidades sociomotrices.',
      capacities:'Comprende su cuerpo; se expresa corporalmente; se relaciona usando habilidades sociomotrices.',
      evidence:'Participación motriz y cooperativa observable.',instrument:'Lista de cotejo.'},
    'Educación Religiosa':{
      competence:'Construye su identidad como persona humana y asume la experiencia del encuentro personal y comunitario con Dios.',
      capacities:'Conoce y valora su identidad religiosa; transforma su entorno desde el encuentro personal y comunitario.',
      evidence:'Reflexión, compromiso o participación respetuosa.',instrument:'Escala de valoración.'}
  };

  function ddContext(unit){return unit.situationBrief||unit.situation||'la situación de nuestra comunidad';}
  function ddReto(brief){
    const s=(brief||'').toLowerCase();
    if(/siembr|papa|tarpuy|añu|oca|olluco/.test(s)) return '¿Qué podemos aprender de la siembra de nuestra comunidad y cómo podemos integrar los saberes de nuestras familias con los conocimientos escolares para cuidar la tierra y mejorar nuestras prácticas?';
    if(/pachamama|madre tierra/.test(s)) return '¿Qué podemos aprender de nuestras prácticas de agradecimiento a la Pachamama y qué podemos hacer para valorar nuestra cultura y cuidar la Madre Tierra?';
    if(/agua|yaku/.test(s)) return '¿Cómo podemos conocer mejor el uso del agua en nuestra comunidad y qué acciones podemos proponer para cuidarla y usarla responsablemente?';
    if(/residuo|basura|contamin/.test(s)) return '¿Qué ocurre con los residuos que producimos y qué alternativas podemos aplicar para reducir la contaminación de nuestra comunidad?';
    return '¿Qué necesitamos comprender, investigar y hacer para responder de manera pertinente al reto de nuestra comunidad y comunicar lo aprendido?';
  }
  function ddProduct(brief,type){
    const s=(brief||'').toLowerCase();
    if(/siembr|papa|tarpuy|añu|oca|olluco/.test(s)) return 'Gran Libro de la Siembra de Ccotataqui y muestra comunitaria: saberes familiares, textos, problemas matemáticos, registros científicos, producciones artísticas y compromisos de cuidado de la tierra.';
    if(/pachamama/.test(s)) return 'El Gran Libro de la Madre Tierra / Pachamamanchikpa Hatun Qillqa y presentación comunitaria.';
    return proposeProduct(brief,type);
  }
  function ddGradePerformance(area,g,brief){
    const n=parseInt(g)||0; const ctx=brief||'el contexto de la unidad';
    if(area==='Comunicación'){
      if(n<=2)return `Recupera y comunica información sobre ${ctx} mediante oralidad, dibujos, palabras o frases breves, con apoyo según su nivel lector.`;
      if(n<=4)return `Organiza información sobre ${ctx}, comprende textos y produce mensajes breves considerando propósito y destinatario.`;
      return `Analiza, organiza y comunica información sobre ${ctx}, sustentando ideas y produciendo textos coherentes para destinatarios reales.`;
    }
    if(area==='Matemática'){
      if(n<=2)return `Representa y resuelve situaciones de ${ctx} usando material concreto, dibujos, conteo, comparación y lenguaje matemático elemental.`;
      if(n<=4)return `Resuelve problemas vinculados con ${ctx}, selecciona estrategias, representa datos o medidas y explica el procedimiento seguido.`;
      return `Modela y resuelve problemas vinculados con ${ctx}, selecciona estrategias pertinentes, verifica resultados y justifica sus decisiones.`;
    }
    if(area==='Ciencia y Tecnología'){
      if(n<=2)return `Observa, formula ideas iniciales y registra con dibujos u oralidad cambios o características relacionadas con ${ctx}.`;
      if(n<=4)return `Formula predicciones, registra datos, compara evidencias y comunica conclusiones sencillas sobre ${ctx}.`;
      return `Formula hipótesis, reconoce variables, analiza datos, contrasta evidencias y sustenta conclusiones relacionadas con ${ctx}.`;
    }
    if(area==='Personal Social'){
      if(n<=2)return `Expresa experiencias familiares y comunitarias relacionadas con ${ctx}, reconoce su participación y respeta otras formas de vivir.`;
      if(n<=4)return `Explica prácticas y responsabilidades vinculadas con ${ctx} y propone acuerdos para el bien común.`;
      return `Analiza prácticas, valores y responsabilidades vinculadas con ${ctx}, argumenta su importancia y propone acciones para el bien común.`;
    }
    return n<=2?`Participa y representa aprendizajes sobre ${ctx} mediante oralidad, imágenes o acciones.`:n<=4?`Organiza y explica una producción vinculada con ${ctx}.`:`Analiza, produce y sustenta una propuesta vinculada con ${ctx}.`;
  }
  function ddCriterion(area,g,brief){
    const n=parseInt(g)||0; const ctx=brief||'el reto de la unidad';
    if(area==='Comunicación') return n<=2?`Comunica una idea comprensible sobre ${ctx}, usando recursos orales, gráficos o escritos según su nivel.`:n<=4?`Organiza y comunica información pertinente sobre ${ctx}, considerando propósito y destinatario.`:`Sustenta y organiza información sobre ${ctx} con coherencia, adecuación al propósito y revisión de su producción.`;
    if(area==='Matemática') return n<=2?`Representa y resuelve una situación de ${ctx} con material, dibujo o números y explica qué hizo.`:n<=4?`Resuelve una situación problemática de ${ctx}, representa datos y explica su estrategia.`:`Modela, resuelve y justifica una situación problemática de ${ctx}, verificando la pertinencia de su estrategia.`;
    if(area==='Ciencia y Tecnología') return n<=2?`Observa y registra cambios relacionados con ${ctx} y comunica qué descubrió.`:n<=4?`Registra y compara evidencias sobre ${ctx} para formular una conclusión.`:`Contrasta hipótesis y utiliza evidencias sobre ${ctx} para sustentar una conclusión y reconocer limitaciones.`;
    if(area==='Personal Social') return n<=2?`Expresa cómo participa en prácticas relacionadas con ${ctx} y respeta las experiencias de otros.`:n<=4?`Explica una práctica o problema de ${ctx} y propone una acción responsable.`:`Argumenta cómo las prácticas y decisiones vinculadas con ${ctx} afectan a la comunidad y propone acciones para el bien común.`;
    return `Elabora y explica una producción pertinente sobre ${ctx}, aplicando los aprendizajes del área.`;
  }
  function ddBuildPurposes(unit){
    const brief=ddContext(unit);
    return unit.areas.map(area=>{
      const base=competenceMap[area]||{competence:`Competencia priorizada del área de ${area}.`,capacities:'Capacidades correspondientes a la competencia priorizada.',evidence:'Producción o desempeño observable.',instrument:'Instrumento pertinente.'};
      return {area,...base,performances:unit.grades.map(g=>({grade:g,text:ddGradePerformance(area,g,brief)})),criteria:unit.grades.map(g=>({grade:g,text:ddCriterion(area,g,brief)}))};
    });
  }
  function ddEnrich(unit){
    if(!unit)return unit;
    unit.reto=unit.reto||ddReto(ddContext(unit));
    unit.product=unit.product||ddProduct(ddContext(unit),unit.type);
    unit.purposes=unit.purposes||ddBuildPurposes(unit);
    unit.enfoques=unit.enfoques||[
      {name:'Orientación al bien común',value:'Responsabilidad',action:'Asumen responsabilidades y toman decisiones considerando el bienestar propio, de sus compañeros, familias y comunidad.'},
      {name:'Inclusivo o Atención a la diversidad',value:'Respeto por las diferencias',action:'Participan con apoyos diferenciados según grado, nivel lector, ritmo y forma de comunicación, manteniendo un reto común.'},
      {name:'Intercultural',value:'Respeto a la identidad cultural',action:'Valoran los saberes, la lengua, las costumbres y las prácticas de la comunidad sin considerar una cultura superior a otra.'},
      {name:'Ambiental',value:'Respeto a toda forma de vida',action:'Relacionan el aprendizaje con acciones concretas de cuidado de la tierra, el agua, los seres vivos y los espacios comunes.'}
    ];
    unit.transversals=unit.transversals||[
      {name:'Se desenvuelve en entornos virtuales generados por las TIC',text:'Selecciona y utiliza recursos digitales pertinentes para observar, organizar, comunicar o producir información, según el grado y los recursos disponibles.'},
      {name:'Gestiona su aprendizaje de manera autónoma',text:'Reconoce la meta, organiza acciones, monitorea su avance y mejora sus productos a partir de los criterios y la retroalimentación.'}
    ];
    unit.activities=unit.activities&&unit.activities.length?unit.activities:buildActivities(ddContext(unit),unit.duration);
    return unit;
  }

  createUnitDemo=function(){
    const type=byId('unitType').value, duration=byId('unitDuration').value, brief=byId('unitSituation').value.trim();
    if(!brief)return alert('Escribe una idea breve del contexto o situación de tu comunidad.');
    let title=byId('unitTitle').value.trim(); if(!title){title=proposeUnitTitle(brief,type);byId('unitTitle').value=title;}
    const unit=ddEnrich({id:'u'+Date.now(),title,type,duration,situationBrief:brief,situation:expandSituation(brief),level:state.level,ieType:state.ieType,grades:[...state.grades],areas:[...state.areas],language:state.language,quechuaVar:state.quechuaVar,purpose:'Desarrollar competencias de manera articulada a partir de una situación real y retadora de la comunidad, integrando saberes locales y conocimientos escolares, con atención diferenciada según grado.',product:ddProduct(brief,type),activities:buildActivities(brief,duration),createdAt:new Date().toISOString()});
    state.units.unshift(unit);state.activeUnitId=unit.id;save();byId('unitReady').classList.remove('hidden');renderUnits();renderUnitOutput(unit);fillSessionUnits();byId('unitOutput').scrollIntoView({behavior:'smooth'});
  };

  function ddTable(rows,heads){return `<div class="dd-scroll"><table class="dd-table"><thead><tr>${heads.map(h=>`<th>${E(h)}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>`}
  function ddPurposesHtml(unit){
    const rows=unit.purposes.map(p=>`<tr><td><b>${E(p.area)}</b><br>${E(p.competence)}<hr><small>${E(p.capacities)}</small></td><td>${p.performances.map(x=>`<b>${E(x.grade)}:</b> ${E(x.text)}`).join('<br><br>')}</td><td>${p.criteria.map(x=>`<b>${E(x.grade)}:</b> ${E(x.text)}`).join('<br><br>')}</td><td>${E(p.evidence)}</td><td>${E(p.instrument)}</td></tr>`).join('');
    return ddTable(rows,['Área / Competencia y capacidades','Desempeños precisados por grado','Criterios de evaluación por grado','Evidencia','Instrumento']);
  }
  function ddEnfoquesHtml(unit){return ddTable(unit.enfoques.map(x=>`<tr><td><b>${E(x.name)}</b></td><td>${E(x.value)}</td><td>${E(x.action)}</td></tr>`).join(''),['Enfoque transversal','Valor','Actitudes o acciones observables']);}
  function ddTransversalHtml(unit){return ddTable(unit.transversals.map(x=>`<tr><td><b>${E(x.name)}</b></td><td>${E(x.text)}</td></tr>`).join(''),['Competencia transversal','Desempeño precisado / aplicación']);}
  function ddSequenceHtml(unit){
    const days=['Lunes','Martes','Miércoles','Jueves','Viernes'];
    const rows=unit.activities.map((a,i)=>{
      const p=unit.purposes.find(x=>x.area===a.area)||unit.purposes[0]; const gradeCrit=p?.criteria?.map(x=>`${x.grade}: ${x.text}`).join(' / ')||'';
      return `<tr><td>Semana ${a.week}<br>${days[(i)%5]}</td><td>${E(a.area)}</td><td><b>${E(a.title)}</b></td><td>${E(p?.performances?.map(x=>`${x.grade}: ${x.text}`).join(' / ')||'')}</td><td>${E(p?.evidence||'')}</td><td>${E(gradeCrit)}</td><td>${E(p?.instrument||'')}</td><td>${E(a.title)}</td></tr>`;
    }).join('');
    return ddTable(rows,['Semana / día','Área','Título de la sesión','Desempeño precisado','Evidencia','Criterio de evaluación','Instrumento','Actividad principal']);
  }
  function ddRegisterHtml(unit){
    const names=unit.grades.map((g,i)=>({g,name:['Estudiante 1','Estudiante 2','Estudiante 3','Estudiante 4','Estudiante 5','Estudiante 6'][i]||`Estudiante ${i+1}`}));
    const core=unit.purposes.slice(0,Math.min(4,unit.purposes.length));
    return ddTable(names.map(s=>`<tr><td><b>${E(s.name)}</b><br>${E(s.g)}</td>${core.map(()=>'<td class="dd-center">—</td>').join('')}<td></td></tr>`).join(''),['Estudiante / grado',...core.map(p=>p.area),'Conclusión descriptiva']);
  }
  function ddInstrumentHtml(unit){
    const p=unit.purposes[0]; if(!p)return '';
    const criterion=p.criteria?.[p.criteria.length-1]?.text||'Criterio de la competencia';
    return `<h3>Rúbrica analítica de ejemplo – ${E(p.area)}</h3>${ddTable(`<tr><td>${E(criterion)}</td><td>Requiere apoyo frecuente y aún no evidencia las actuaciones esperadas.</td><td>Evidencia parcialmente las actuaciones y necesita apoyo para sostenerlas.</td><td>Evidencia las actuaciones esperadas de manera pertinente y autónoma.</td><td>Supera lo esperado, sustenta sus decisiones y transfiere lo aprendido a nuevas situaciones.</td></tr>`,['Criterio','C – Inicio','B – Proceso','A – Logro esperado','AD – Destacado'])}`;
  }
  function ddSection(id,title,body){return `<section class="dd-unit-section" id="${id}"><h2>${title}</h2>${body}</section>`}
  function ddTabs(unit){return `<div class="dd-tabs"><button onclick="ddShowTab('resumen')">Resumen</button><button onclick="ddShowTab('propositos')">Propósitos</button><button onclick="ddShowTab('matriz')">Matriz</button><button onclick="ddShowTab('sesiones')">Sesiones</button><button onclick="ddShowTab('instrumentos')">Instrumentos</button><button onclick="ddShowTab('registro')">Registro</button></div>`}
  window.ddShowTab=function(id){document.querySelectorAll('#unitOutput .dd-unit-section').forEach(x=>x.classList.toggle('dd-hidden',x.id!==`dd-${id}`));document.querySelectorAll('#unitOutput .dd-tabs button').forEach(b=>b.classList.toggle('active',b.textContent.toLowerCase().startsWith(id.substring(0,4))));};

  renderUnitOutput=function(unit){
    unit=ddEnrich(unit);save(); const out=byId('unitOutput'); if(!out)return;
    const summary=`<div class="dd-cover"><div><span class="pill">✓ Guardada</span><h1>${E(unit.title)}</h1><p><b>${E(unit.type)}</b> · ${E(unit.duration)}</p><p>${E(unit.level)} · ${E(unit.ieType)} · ${E(unit.grades.join(', '))}</p></div><div class="dd-cover-icon">🌱📚</div></div>
      <div class="dd-info"><b>I.E.:</b> Datos institucionales configurables &nbsp; | &nbsp; <b>Docente:</b> Datos del perfil &nbsp; | &nbsp; <b>Áreas:</b> ${E(unit.areas.join(', '))}</div>
      <h3>II. SITUACIÓN SIGNIFICATIVA Y PRODUCTO</h3><p>${E(unitSituation(unit))}</p><div class="dd-reto"><b>RETO</b><br>${E(unit.reto)}</div><h3>PRODUCTO</h3><p>${E(unit.product)}</p>${unit.language==='Bilingüe'?'<div class="notice">🌎 La versión final podrá presentar situación, reto y producto en castellano y en la variedad de quechua configurada.</div>':''}`;
    const matrix=`<p>Esta matriz articula competencia, capacidades, desempeños diferenciados, criterios, evidencia e instrumento. Los criterios se contextualizan al reto y deben ser revisados contra la matriz curricular oficial correspondiente.</p>${ddPurposesHtml(unit)}`;
    out.innerHTML=`${ddTabs(unit)}${ddSection('dd-resumen','I–II. Datos generales, situación significativa, reto y producto',summary)}${ddSection('dd-propositos','III. Propósitos de aprendizaje',ddPurposesHtml(unit)+ddEnfoquesHtml(unit)+ddTransversalHtml(unit))}${ddSection('dd-matriz','IV. Matriz de articulación y evaluación',matrix)}${ddSection('dd-sesiones','V. Secuencia de sesiones de aprendizaje',`<p class="sub">Distribuida por semanas; en la versión definitiva se cruza con el horario real guardado por el docente.</p>${ddSequenceHtml(unit)}`)}${ddSection('dd-instrumentos','VI. Instrumentos de evaluación',ddInstrumentHtml(unit))}${ddSection('dd-registro','VII. Registro auxiliar',`<p>Registro formativo conectado con los criterios y evidencias de la unidad. Escala: C, B, A y AD.</p>${ddRegisterHtml(unit)}`)}<div class="actions topgap"><button class="btn" onclick="useUnit('${unit.id}')">📝 Crear sesiones</button><button class="btn alt" onclick="downloadUnitWord('${unit.id}')">⬇ Descargar Word completo</button><button class="btn ghost" onclick="shareUnit('${unit.id}')">📤 Compartir</button></div>`;
    out.classList.remove('hidden');ddShowTab('resumen');
  };

  unitWordHtml=function(unit){
    unit=ddEnrich(unit);
    return `<div class="word-border"><h1 style="text-align:center">UNIDAD DE APRENDIZAJE</h1><h2 style="text-align:center">“${E(unit.title)}”</h2><h2>I. DATOS GENERALES</h2><table><tr><th>Categoría</th><th>Detalle</th></tr><tr><td>Institución educativa</td><td>Datos configurados en el perfil</td></tr><tr><td>Docente</td><td>Datos configurados en el perfil</td></tr><tr><td>Ciclo, grado y sección</td><td>${E(unit.grades.join(', '))} · ${E(unit.ieType)}</td></tr><tr><td>Duración</td><td>${E(unit.duration)}</td></tr></table><h2>II. SITUACIÓN SIGNIFICATIVA Y PRODUCTO</h2><p>${E(unitSituation(unit))}</p><p><b>RETO</b><br>${E(unit.reto)}</p><p><b>PRODUCTO</b><br>${E(unit.product)}</p><h2>III. PROPÓSITOS DE APRENDIZAJE</h2>${ddPurposesHtml(unit)}<h3>Enfoques transversales</h3>${ddEnfoquesHtml(unit)}<h3>Competencias transversales</h3>${ddTransversalHtml(unit)}<h2>IV. MATRIZ DE ARTICULACIÓN Y EVALUACIÓN</h2>${ddPurposesHtml(unit)}<h2>V. SECUENCIA DE SESIONES DE APRENDIZAJE</h2>${ddSequenceHtml(unit)}<h2>VI. INSTRUMENTOS DE EVALUACIÓN</h2>${ddInstrumentHtml(unit)}<h2>VII. REGISTRO AUXILIAR</h2>${ddRegisterHtml(unit)}</div>`;
  };

  function ddSessionCriterion(session,g){return ddCriterion(session.area,g,session.brief);}
  function ddSessionPerf(session,g){return ddGradePerformance(session.area,g,session.brief);}
  function ddSessionProcesses(session){
    if(session.area==='Comunicación')return ['Planificación o comprensión del propósito comunicativo','Textualización / interacción con el texto','Revisión, reflexión y uso social del producto'];
    if(session.area==='Matemática')return ['Comprender el problema','Planificar una estrategia','Ejecutar la estrategia','Verificar, formalizar y socializar'];
    if(session.area==='Ciencia y Tecnología')return ['Problematización de situaciones','Planteamiento de hipótesis','Diseño del plan de indagación','Generación y análisis de datos','Evaluación y comunicación'];
    if(session.area==='Personal Social')return ['Problematización','Análisis de información','Toma de decisiones'];
    return ['Exploración del reto','Desarrollo de la actividad','Análisis y mejora de la producción'];
  }
  sessionHtml=function(session,forWord=false){
    const crit=session.grades.map(g=>`<b>${E(g)}:</b> ${E(ddSessionCriterion(session,g))}`).join('<br>');
    const perf=session.grades.map(g=>`<b>${E(g)}:</b> ${E(ddSessionPerf(session,g))}`).join('<br>');
    const processes=ddSessionProcesses(session);
    const taskRows=session.grades.map(g=>`<tr><td><b>${E(g)}</b></td><td>${E(ddSessionPerf(session,g))}</td><td>${E(ddSessionCriterion(session,g))}</td></tr>`).join('');
    const rubricRows=session.grades.map(g=>`<tr><td>${E(g)} – ${E(ddSessionCriterion(session,g))}</td><td>Requiere apoyo para evidenciar el criterio.</td><td>Lo evidencia parcialmente con apoyo.</td><td>Lo evidencia de manera pertinente y autónoma.</td><td>Lo supera, sustenta decisiones y transfiere lo aprendido.</td></tr>`).join('');
    return `<div class="dd-session-doc"><h1 style="text-align:center">SESIÓN DE APRENDIZAJE MAESTRA</h1><h2 style="text-align:center">“${E(session.title)}”</h2><h2>1. DATOS INFORMATIVOS</h2>${ddTable(`<tr><td><b>Área:</b> ${E(session.area)}</td><td><b>Grados:</b> ${E(session.grades.join(', '))}</td><td><b>Duración:</b> ${E(session.duration)}</td><td><b>Unidad:</b> ${E(session.unitTitle)}</td></tr>`,['','','',''])}<h2>2. PROPÓSITOS DE APRENDIZAJE</h2>${ddTable(`<tr><td>${E(session.competence)}<br><small>${E((competenceMap[session.area]||{}).capacities||'Capacidades pertinentes')}</small></td><td>${perf}</td><td>${crit}</td><td>${E(session.evidence)}</td><td>${E(session.instrument)}</td></tr>`,['Competencias / Capacidades','Desempeños precisados','Criterios desagregados','Evidencia','Instrumento'])}<h3>Propósito para los estudiantes</h3><p>${E(session.purpose)}</p><h2>3. ENFOQUES TRANSVERSALES</h2>${ddEnfoquesHtml(ddEnrich(state.units.find(u=>u.id===session.unitId)||{enfoques:[],transversals:[],areas:[],grades:[]}))}<h2>4. COMPETENCIAS TRANSVERSALES</h2>${ddTransversalHtml(ddEnrich(state.units.find(u=>u.id===session.unitId)||{enfoques:[],transversals:[],areas:[],grades:[]}))}<h2>5. PREPARACIÓN DE LA SESIÓN</h2>${ddTable(`<tr><td>Preparar la situación de problematización, fichas diferenciadas, instrumento de evaluación y materiales por grado. Prever alternancia de atención directa e indirecta cuando corresponda.</td><td>${E(session.resources)}; materiales concretos; papelotes; plumones; fichas A4; recurso visual o proyector si está disponible.</td></tr>`,['¿Qué hacer antes?','Recursos y materiales'])}<h2>6. MOMENTOS DE LA SESIÓN</h2>${ddTable(`<tr><td><b>INICIO</b><br>(Involucramiento, bienestar y desafío)</td><td>• Acogida y motivación socioemocional vinculada al contexto.<br>• Acuerdos de convivencia y señal de autorregulación.<br>• Recuperación de saberes previos mediante preguntas abiertas.<br>• Criterios en lenguaje del estudiante: ${crit}<br>• <b>Conflicto cognitivo / reto:</b> ${E(session.challenge)}<br>• Propósito y utilidad de lo que aprenderán.</td><td>${session.times.start} min</td></tr><tr><td><b>DESARROLLO</b><br>(Pensamiento crítico y mediación)</td><td>${processes.map((p,i)=>`<b>PROCESO ${i+1} – ${E(p).toUpperCase()}</b><br>Se desarrolla el proceso con preguntas de alta demanda cognitiva, uso de evidencias, producción o resolución y retroalimentación por descubrimiento.<br><br>`).join('')}<b>Atención diferenciada y simultánea:</b>${ddTable(taskRows,['Grado','Desempeño / tarea diferenciada','Criterio'])}<br><b>Acompañamiento:</b> el docente monitorea activamente, recoge evidencias y formula repreguntas: <b>¿por qué?, ¿qué evidencia tienes?, ¿cómo lo comprobarías?, ¿qué cambiarías para mejorar?</b></td><td>${session.times.dev} min</td></tr><tr><td><b>CIERRE</b><br>(Metacognición y regulación positiva)</td><td>• Socialización de producciones y evidencias.<br>• Metacognición: ¿qué aprendí?, ¿cómo lo hice?, ¿qué estrategia me ayudó?, ¿para qué me sirve?<br>• Retroalimentación breve vinculada al criterio.<br>• Compromiso o transferencia a una nueva situación del contexto.</td><td>${session.times.close} min</td></tr>`,['MOMENTOS','ESTRATEGIAS / ACTIVIDADES','TIEMPO'])}<h2>7. INSTRUMENTO DE EVALUACIÓN</h2>${ddTable(rubricRows,['Criterio por grado','C – Inicio','B – Proceso','A – Logrado','AD – Destacado'])}<h2>8. FORMALIZACIÓN PARA PIZARRA</h2><div class="dd-reto">Idea clave, procedimiento o conclusión construida con los estudiantes a partir de sus producciones. Debe ser breve, clara y adecuada al área y grado.</div><h2>9. MATERIALES / ANEXOS</h2><p>Fichas diferenciadas por grado, recurso de problematización, banco de palabras o material concreto según el área, y versión imprimible A4.</p>${forWord?'<p><i>Propuesta editable. Revisar y contextualizar antes de aplicar.</i></p>':''}</div>`;
  };

  const css=`.dd-tabs{display:flex;gap:8px;overflow:auto;padding:4px 0 12px;position:sticky;top:68px;background:var(--bg,#f7f8fb);z-index:3}.dd-tabs button{border:1px solid #d7dfdb;background:#fff;border-radius:999px;padding:9px 14px;font-weight:700;white-space:nowrap;cursor:pointer}.dd-tabs button.active{background:#1f6f55;color:#fff}.dd-unit-section{background:#fff;border:1px solid #dde5e1;border-radius:18px;padding:20px;margin:8px 0}.dd-hidden{display:none!important}.dd-cover{display:flex;justify-content:space-between;gap:20px;align-items:center;border:1px dashed #8aa89a;padding:18px;border-radius:16px;background:linear-gradient(135deg,#fbfffc,#eef7f1)}.dd-cover-icon{font-size:48px}.dd-info{padding:12px;background:#eef7f1;border-radius:10px;margin:14px 0}.dd-reto{padding:14px;border-left:5px solid #2e7d5b;background:#f0f8f3;border-radius:8px;margin:12px 0}.dd-scroll{overflow:auto;margin:12px 0}.dd-table{width:100%;border-collapse:collapse;min-width:760px;font-size:14px}.dd-table th{background:#2e7656;color:white;text-align:left;padding:9px;border:1px solid #466c5a}.dd-table td{padding:9px;vertical-align:top;border:1px solid #9aa9a0;background:#fff}.dd-table tr:nth-child(even) td{background:#fafcfb}.dd-center{text-align:center}.dd-session-doc h2,.dd-unit-section h2{color:#265f49}.dd-session-doc h3{color:#3d6b58}@media(max-width:720px){.dd-tabs{top:56px}.dd-unit-section{padding:13px}.dd-cover{align-items:flex-start}.dd-cover-icon{font-size:34px}.dd-table{font-size:12px}.dd-session-doc h1{font-size:20px}.dd-session-doc h2{font-size:17px}}`;
  const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
  state.units=state.units.map(ddEnrich);save();renderUnits();fillSessionUnits();
})();