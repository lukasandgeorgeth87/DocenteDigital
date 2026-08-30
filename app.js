const state=JSON.parse(localStorage.getItem('docenteDigitalPrototype')||'{}');
state.mode=state.mode||'easy';
state.level=state.level||'';
state.ieType=state.ieType||'';
state.grades=state.grades||[];
state.areas=state.areas||[];
state.language=state.language||'Castellano';
state.quechuaVar=state.quechuaVar||'Quechua Collao';
state.units=Array.isArray(state.units)?state.units:[];
state.activeUnitId=state.activeUnitId||null;
state.lastSession=state.lastSession||null;

const save=()=>localStorage.setItem('docenteDigitalPrototype',JSON.stringify(state));
const byId=id=>document.getElementById(id);
const escapeHtml=value=>String(value??'').replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));
const cleanFileName=value=>String(value||'documento').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9-_ ]/g,'').trim().replace(/\s+/g,'_').slice(0,80)||'documento';

function setMode(mode){
  state.mode=mode;save();
  document.body.classList.toggle('expert',mode==='expert');
  byId('easyBtn')?.classList.toggle('active',mode==='easy');
  byId('expertBtn')?.classList.toggle('active',mode==='expert');
  syncTitle();
}

function go(id){
  if(!state.level&&id!=='setup'){showSetup();return}
  document.querySelectorAll('.screen').forEach(x=>x.classList.remove('active'));
  byId(id)?.classList.add('active');
  document.querySelectorAll('[data-screen]').forEach(b=>b.classList.toggle('active',b.dataset.screen===id));
  refresh();
  window.scrollTo({top:0,behavior:'smooth'});
}

function showSetup(){
  document.querySelectorAll('.screen').forEach(x=>x.classList.remove('active'));
  byId('setup')?.classList.add('active');
}

function chooseOne(key,val,btn){
  state[key]=val;
  btn.parentElement.querySelectorAll('.choice').forEach(x=>x.classList.remove('active'));
  btn.classList.add('active');
}

function nextSetup(n){
  if(n===2&&!state.level)return alert('Primero selecciona el nivel educativo.');
  if(n===3&&!state.ieType)return alert('Selecciona el tipo de IE.');
  if(n===4&&!state.grades.length)return alert('Selecciona al menos un grado o edad.');
  [1,2,3,4].forEach(i=>byId('step'+i)?.classList.toggle('hidden',i!==n));
  [1,2,3,4].forEach(i=>byId('s'+i)?.classList.toggle('active',i<=n));
  if(n===3)renderGrades();
  if(n===4)renderAreas();
}

function gradeOptions(){
  if(state.level==='Inicial')return['3 años','4 años','5 años'];
  if(state.level==='Primaria')return['1.º','2.º','3.º','4.º','5.º','6.º'];
  return['1.º','2.º','3.º','4.º','5.º'];
}

function areaOptions(){
  if(state.level==='Inicial')return['Comunicación','Matemática','Personal Social','Ciencia y Tecnología','Psicomotriz','Arte y Cultura'];
  if(state.level==='Primaria')return['Comunicación','Matemática','Personal Social','Ciencia y Tecnología','Arte y Cultura','Educación Física','Educación Religiosa'];
  return['Comunicación','Matemática','Ciencia y Tecnología','Ciencias Sociales','DPCC','Inglés','Educación Física','Arte y Cultura','Educación Religiosa','EPT'];
}

function renderGrades(){
  const wrap=byId('gradeChoices');if(!wrap)return;
  wrap.innerHTML='';
  const multi=state.ieType==='Multigrado'||state.ieType==='Unidocente';
  byId('gradeHelp').textContent=multi?'Puedes seleccionar varios grados o edades para una planificación común y diferenciada.':'Selecciona el grado con el que trabajarás.';
  gradeOptions().forEach(g=>{
    const b=document.createElement('button');
    b.className='choice'+(state.grades.includes(g)?' active':'');b.textContent=g;
    b.onclick=()=>{if(multi){state.grades=state.grades.includes(g)?state.grades.filter(x=>x!==g):[...state.grades,g]}else state.grades=[g];renderGrades()};
    wrap.appendChild(b);
  });
}

function renderAreas(){
  const wrap=byId('areaChoices');if(!wrap)return;
  wrap.innerHTML='';
  const multiple=state.level!=='Secundaria';
  byId('areaHelp').textContent=multiple?'En Inicial y Primaria puedes seleccionar varias áreas.':'En Secundaria la programación se organiza por área.';
  areaOptions().forEach(a=>{
    const b=document.createElement('button');
    b.className='choice'+(state.areas.includes(a)?' active':'');b.textContent=a;
    b.onclick=()=>{if(multiple){state.areas=state.areas.includes(a)?state.areas.filter(x=>x!==a):[...state.areas,a]}else state.areas=[a];renderAreas()};
    wrap.appendChild(b);
  });
}

function finishSetup(){
  if(!state.areas.length)return alert('Selecciona al menos un área.');
  state.language=byId('language').value;
  state.quechuaVar=byId('quechuaVar').value;
  save();fillSelects();go('home');
}

function fillSelects(){
  const grades=state.grades.length?state.grades:gradeOptions();
  const areas=state.areas.length?state.areas:areaOptions();
  if(byId('materialGrade'))byId('materialGrade').innerHTML=grades.map(x=>`<option>${escapeHtml(x)}</option>`).join('');
  if(byId('diagnosticArea'))byId('diagnosticArea').innerHTML=areas.map(x=>`<option>${escapeHtml(x)}</option>`).join('');
}

function contextText(){return`${state.level} · ${state.ieType} · ${state.grades.join(', ')} · ${state.areas.join(', ')}`}

function refresh(){
  if(!state.level)return;
  fillSelects();renderUnits();fillSessionUnits();
  const text=contextText();
  if(byId('homeContext'))byId('homeContext').textContent=text;
  if(byId('sessionContext'))byId('sessionContext').innerHTML=`<b>Contexto cargado:</b> ${escapeHtml(text)}<br>La app reutiliza esta información y no vuelve a pedirla.`;
  if(byId('settingsSummary'))byId('settingsSummary').innerHTML=`<b>Nivel:</b> ${escapeHtml(state.level)}<br><b>Tipo de IE:</b> ${escapeHtml(state.ieType)}<br><b>Grados/edades:</b> ${escapeHtml(state.grades.join(', '))}<br><b>Áreas:</b> ${escapeHtml(state.areas.join(', '))}<br><b>Idioma:</b> ${escapeHtml(state.language)}${state.language!=='Castellano'?' · '+escapeHtml(state.quechuaVar):''}`;
}

function continueWork(){
  if(state.lastSession){go('session');renderSessionOutput(state.lastSession);}
  else if(state.units.length){go('plan');viewUnit(state.activeUnitId||state.units[0].id);}
  else{go('plan');showUnit();}
}

function showDiagnostic(){byId('diagnosticPanel').classList.remove('hidden');fillSelects();byId('diagnosticPanel').scrollIntoView({behavior:'smooth'})}
function generateDiagnostic(){byId('diagnosticResult').classList.remove('hidden')}
function demoAnnual(){alert('Prototipo: la programación anual usará diagnóstico, contexto, calendario, recursos y CNEB para proponer una planificación editable.')}

function showUnit(){
  if(!state.level||!state.ieType||!state.grades.length||!state.areas.length){alert('Primero completa Nivel + Tipo de IE + Grados/Áreas.');return restartSetup()}
  byId('unitContext').innerHTML=`✓ <b>${escapeHtml(state.level)}</b> · <b>${escapeHtml(state.ieType)}</b> · Grados/edades: <b>${escapeHtml(state.grades.join(', '))}</b> · Áreas: <b>${escapeHtml(state.areas.join(', '))}</b>`;
  byId('unitPanel').classList.remove('hidden');
  byId('unitPanel').scrollIntoView({behavior:'smooth'});
}

function proposeUnitTitle(brief,type){
  const s=(brief||'').toLowerCase();
  if(/siembr|papa|tarpuy|añu|oca|olluco/.test(s))return 'Aprendemos y participamos en la siembra de nuestra comunidad';
  if(/pachamama|madre tierra/.test(s))return 'Cuidamos y valoramos la Pachamama';
  if(/agua|yaku/.test(s))return 'Cuidamos y usamos responsablemente el agua';
  if(/residuo|basura|contamin/.test(s))return 'Cuidamos nuestra comunidad reduciendo la contaminación';
  return type==='Proyecto de aprendizaje'?'Investigamos y aprendemos desde nuestra comunidad':'Aprendemos a partir de situaciones de nuestra comunidad';
}

function expandSituation(brief){
  const text=(brief||'').trim();
  const s=text.toLowerCase();
  const grades=state.grades.join(', ');
  if(/siembr|papa|tarpuy|añu|oca|olluco/.test(s)){
    const place=/ccotataqui|cotataqui/.test(s)?'Ccotataqui':'la comunidad';
    return `En ${place}, las familias participan en la época de siembra, una práctica agrícola y cultural que moviliza saberes sobre la preparación del terreno, selección y cuidado de semillas de papa, añu, oca y otros cultivos, uso de abonos, organización familiar y comunal, así como el respeto a la Pachamama. Los estudiantes de ${grades} observan y participan de estas actividades; sin embargo, no siempre reconocen cómo los saberes de sus familias se relacionan con los aprendizajes de Comunicación, Matemática, Personal Social, Ciencia y Tecnología y las demás áreas. Esta situación ofrece la oportunidad de investigar, dialogar con los yachaq y las familias, resolver problemas reales, registrar información y valorar conocimientos locales. Frente a ello se plantea el reto: ¿cómo podemos comprender, explicar y valorar el proceso de siembra de nuestra comunidad?, ¿qué conocimientos necesitamos para tomar decisiones durante la siembra?, ¿cómo podemos comunicar y compartir lo aprendido con nuestras familias y comunidad? Como respuesta al reto, los estudiantes elaborarán producciones y evidencias articuladas que recuperen saberes locales y conocimientos escolares, respetando las posibilidades y nivel de complejidad de cada grado.`;
  }
  if(/pachamama|madre tierra/.test(s)){
    return `En la comunidad, durante las actividades vinculadas con la Pachamama, las familias expresan agradecimiento, respeto y cuidado por la naturaleza mediante prácticas culturales propias. Los estudiantes de ${grades} conocen parte de estas costumbres, pero requieren analizar su significado, reconocer los saberes de sus familias y relacionarlos con acciones concretas de cuidado del ambiente. El reto será responder: ¿qué saberes y prácticas de nuestra comunidad ayudan a cuidar la Pachamama?, ¿qué problemas ambientales observamos y cómo podemos contribuir a solucionarlos?, ¿cómo comunicaremos nuestros compromisos a otras personas? A partir de estas preguntas, los estudiantes movilizarán competencias de las distintas áreas y producirán evidencias que permitan explicar, argumentar, representar y proponer acciones pertinentes a su realidad.`;
  }
  if(/agua|yaku/.test(s)){
    return `En la comunidad, el agua es indispensable para la vida familiar, la agricultura, los animales y las plantas. No obstante, existen situaciones en las que se desperdicia, se contamina o no se aprovecha adecuadamente. Los estudiantes de ${grades} necesitan comprender de dónde proviene el agua que usan, cómo se puede cuidar y qué decisiones pueden tomar desde la escuela y el hogar. Se plantea el reto: ¿cómo podemos conocer mejor el uso del agua en nuestra comunidad?, ¿qué acciones permitirían cuidarla y reutilizarla responsablemente?, ¿cómo podemos sustentar y comunicar nuestras propuestas? Para responder, los estudiantes investigarán, resolverán problemas, producirán textos y elaborarán propuestas o productos que evidencien sus aprendizajes.`;
  }
  if(/residuo|basura|contamin/.test(s)){
    return `En la comunidad se generan residuos de diferentes tipos y no siempre se separan, reutilizan o disponen adecuadamente. Esta situación puede afectar el suelo, el agua, los animales y los espacios que utilizan las familias. Los estudiantes de ${grades} observan estas prácticas cotidianas y requieren analizar sus causas y consecuencias para proponer alternativas viables. El reto será responder: ¿qué ocurre con los residuos que producimos?, ¿cómo afectan nuestro entorno?, ¿qué acciones podemos realizar y comunicar para reducir la contaminación? A partir de este desafío, los estudiantes movilizarán saberes previos y competencias de distintas áreas para investigar, representar datos, argumentar y desarrollar productos o acciones de mejora.`;
  }
  return `En el contexto de ${text || 'una situación cercana de la comunidad'}, los estudiantes de ${grades} conviven con experiencias, saberes, necesidades y oportunidades que pueden convertirse en fuente de aprendizaje. Se requiere que observen la realidad, recuperen sus saberes previos y reconozcan aspectos que necesitan comprender o mejorar. Por ello se plantea el reto: ¿qué sabemos sobre esta situación?, ¿qué necesitamos investigar o aprender para comprenderla mejor?, ¿qué decisiones o propuestas podemos construir y cómo comunicaremos nuestros aprendizajes? La unidad articulará competencias de las áreas seleccionadas y culminará con productos o evidencias vinculadas con el reto planteado.`;
}

function proposeProduct(brief,type){
  const s=(brief||'').toLowerCase();
  if(/siembr|papa|tarpuy|añu|oca|olluco/.test(s))return 'Libro o muestra comunitaria sobre la siembra, con textos, registros de saberes familiares, problemas matemáticos, observaciones científicas, representaciones artísticas y exposición final.';
  if(/pachamama/.test(s))return 'Libro cartonero, mural o feria de compromisos y producciones para el cuidado de la Pachamama.';
  if(/agua|yaku/.test(s))return 'Campaña o muestra escolar con propuestas, registros, textos y evidencias para el cuidado y uso responsable del agua.';
  if(/residuo|basura|contamin/.test(s))return 'Propuesta de acción ambiental con registros, afiches, datos, explicaciones y compromisos para reducir residuos.';
  return type==='Proyecto de aprendizaje'?'Producto o acción final acordada con los estudiantes y vinculada directamente con el reto.':'Conjunto organizado de producciones y evidencias que muestran los aprendizajes logrados durante la unidad.';
}

function activityVariants(area,brief){
  const topic=brief||'la situación de nuestra comunidad';
  const map={
    'Comunicación':[
      `Escuchamos y dialogamos sobre ${topic}`,
      `Leemos textos vinculados con ${topic}`,
      `Planificamos y escribimos un texto sobre ${topic}`,
      `Revisamos y mejoramos nuestras producciones`,
      `Compartimos oralmente lo aprendido con la comunidad`
    ],
    'Matemática':[
      `Resolvemos problemas de cantidad vinculados con ${topic}`,
      `Medimos, comparamos y representamos datos del contexto`,
      `Organizamos información en tablas y gráficos`,
      `Resolvemos problemas de forma, ubicación o patrones presentes en la experiencia`,
      `Explicamos y sustentamos nuestras estrategias de solución`
    ],
    'Personal Social':[
      `Reconocemos saberes, roles y responsabilidades de las familias`,
      `Dialogamos sobre cambios y permanencias en las prácticas de la comunidad`,
      `Deliberamos sobre decisiones que favorecen el bien común`,
      `Construimos acuerdos para participar respetuosamente`,
      `Valoramos la identidad y los saberes de nuestra comunidad`
    ],
    'Ciencia y Tecnología':[
      `Observamos y formulamos preguntas sobre procesos presentes en ${topic}`,
      `Planteamos posibles explicaciones y organizamos una indagación`,
      `Registramos observaciones y analizamos resultados`,
      `Explicamos científicamente un proceso relacionado con ${topic}`,
      `Comunicamos conclusiones y recomendaciones`
    ],
    'Arte y Cultura':[
      `Exploramos manifestaciones artísticas relacionadas con la comunidad`,
      `Representamos creativamente experiencias y saberes locales`,
      `Creamos una producción artística para comunicar lo aprendido`
    ],
    'Educación Física':[
      `Participamos en retos motrices y cooperativos vinculados con el contexto`,
      `Organizamos actividades físicas cuidando nuestro cuerpo y a los demás`
    ],
    'Educación Religiosa':[
      `Reflexionamos sobre el agradecimiento, la vida y el cuidado de la creación`,
      `Expresamos compromisos de respeto y solidaridad desde nuestra fe y cultura`
    ],
    'Psicomotriz':[
      `Exploramos movimientos, espacios y materiales del contexto`,
      `Representamos corporalmente experiencias de nuestra comunidad`
    ],
    'Ciencias Sociales':[
      `Analizamos actores, cambios y relaciones sociales presentes en ${topic}`,
      `Interpretamos fuentes y explicamos procesos del contexto`
    ],
    'DPCC':[
      `Deliberamos sobre decisiones y responsabilidades relacionadas con ${topic}`,
      `Construimos propuestas y acuerdos para el bien común`
    ],
    'Inglés':[
      `Comprendemos expresiones sencillas relacionadas con el contexto de la unidad`,
      `Comunicamos información breve sobre nuestra experiencia`
    ],
    'EPT':[
      `Identificamos necesidades y oportunidades vinculadas con ${topic}`,
      `Diseñamos y mejoramos una propuesta o producto`
    ]
  };
  return map[area]||[`Desarrollamos aprendizajes de ${area} a partir de ${topic}`];
}

function buildActivities(brief,duration){
  const weeks=Math.max(1,parseInt(duration)||3);
  const target=Math.max(state.areas.length,weeks*5);
  const counters={};
  return Array.from({length:target},(_,i)=>{
    const area=state.areas[i%state.areas.length];
    const variants=activityVariants(area,brief);
    counters[area]=(counters[area]||0)+1;
    return {area,title:variants[(counters[area]-1)%variants.length],week:Math.floor(i/5)+1,order:i+1};
  });
}

function createUnitDemo(){
  const type=byId('unitType').value;
  const duration=byId('unitDuration').value;
  const brief=byId('unitSituation').value.trim();
  if(!brief)return alert('Escribe una idea breve del contexto o situación de tu comunidad.');
  let title=byId('unitTitle').value.trim();
  if(!title){title=proposeUnitTitle(brief,type);byId('unitTitle').value=title;}
  const situation=expandSituation(brief);
  const unit={
    id:'u'+Date.now(),title,type,duration,situationBrief:brief,situation,
    level:state.level,ieType:state.ieType,grades:[...state.grades],areas:[...state.areas],
    language:state.language,quechuaVar:state.quechuaVar,
    purpose:'Movilizar y desarrollar competencias de las áreas seleccionadas mediante retos auténticos del contexto, articulando saberes de la comunidad y conocimientos escolares, con atención diferenciada según el grado.',
    product:proposeProduct(brief,type),
    activities:buildActivities(brief,duration),createdAt:new Date().toISOString()
  };
  state.units.unshift(unit);state.activeUnitId=unit.id;save();
  byId('unitReady').classList.remove('hidden');
  renderUnits();renderUnitOutput(unit);fillSessionUnits();
  byId('unitOutput').scrollIntoView({behavior:'smooth'});
}

function unitSituation(unit){return unit.situation&&unit.situation.length>180?unit.situation:expandSituation(unit.situationBrief||unit.situation||'')}
function unitBrief(unit){return unit.situationBrief||unit.situation||''}

function renderUnits(){
  const wrap=byId('unitsList');if(!wrap)return;
  if(!state.units.length){wrap.innerHTML='<div class="notice">Aún no tienes unidades o proyectos guardados. Pulsa “Crear nueva” para comenzar.</div>';return;}
  wrap.innerHTML=state.units.map(u=>`<div class="document topgap"><div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap"><div><span class="pill">${escapeHtml(u.type)}</span><h2 style="margin-top:8px">${escapeHtml(u.title)}</h2><p><b>${escapeHtml(u.level)}</b> · ${escapeHtml(u.ieType)} · ${escapeHtml(u.grades.join(', '))} · ${escapeHtml(u.duration)}</p><p><b>Contexto base:</b> ${escapeHtml(unitBrief(u))}</p></div><div class="actions"><button class="btn alt" onclick="viewUnit('${u.id}')">👁 Ver</button><button class="btn" onclick="useUnit('${u.id}')">📝 Crear sesiones</button><button class="btn ghost" onclick="downloadUnitWord('${u.id}')">⬇ Word</button><button class="btn ghost" onclick="deleteUnit('${u.id}')">Eliminar</button></div></div></div>`).join('');
}

function renderUnitOutput(unit){
  const out=byId('unitOutput');if(!out||!unit)return;
  const situation=unitSituation(unit);
  const activities=unit.activities.map((a,i)=>`<div class="document topgap"><b>Semana ${a.week} · Actividad ${i+1} · ${escapeHtml(a.area)}</b><br>${escapeHtml(a.title)}</div>`).join('');
  out.innerHTML=`<span class="pill">✓ Guardada</span><h1 style="margin-top:10px">${escapeHtml(unit.title)}</h1><p><b>Tipo:</b> ${escapeHtml(unit.type)} &nbsp; <b>Duración:</b> ${escapeHtml(unit.duration)}</p><p><b>Nivel y atención:</b> ${escapeHtml(unit.level)} · ${escapeHtml(unit.ieType)} · ${escapeHtml(unit.grades.join(', '))}</p><p><b>Áreas:</b> ${escapeHtml(unit.areas.join(', '))}</p><div class="notice"><b>Idea/contexto registrado por el docente:</b><br>${escapeHtml(unitBrief(unit))}</div><div class="document"><h2>Situación significativa</h2><p>${escapeHtml(situation)}</p><small><b>Referencia pedagógica MINEDU:</b> se presenta un contexto, una necesidad o condición que da sentido al aprendizaje, retos/preguntas y relación con productos o evidencias. Es una propuesta editable por el docente.</small></div><div class="document topgap"><p><b>Propósito integrador:</b> ${escapeHtml(unit.purpose)}</p><p><b>Producto/evidencia integradora:</b> ${escapeHtml(unit.product)}</p></div><h2 class="topgap">Secuencia de actividades propuestas</h2>${activities}<div class="actions"><button class="btn" onclick="useUnit('${unit.id}')">📝 Crear sesiones</button><button class="btn alt" onclick="downloadUnitWord('${unit.id}')">⬇ Descargar Word</button><button class="btn ghost" onclick="shareUnit('${unit.id}')">📤 Compartir</button><button class="btn ghost" onclick="showUnit()">➕ Crear otra</button></div>`;
  out.classList.remove('hidden');
}

function viewUnit(id){
  const unit=state.units.find(u=>u.id===id);if(!unit)return;
  state.activeUnitId=id;save();renderUnitOutput(unit);byId('unitOutput').scrollIntoView({behavior:'smooth'});
}

function deleteUnit(id){
  const unit=state.units.find(u=>u.id===id);if(!unit)return;
  if(!confirm(`¿Eliminar “${unit.title}”?`))return;
  state.units=state.units.filter(u=>u.id!==id);
  if(state.activeUnitId===id)state.activeUnitId=state.units[0]?.id||null;
  save();renderUnits();fillSessionUnits();byId('unitOutput')?.classList.add('hidden');
}

function useUnit(id){
  state.activeUnitId=id;save();go('session');fillSessionUnits();
  if(byId('sessionUnit'))byId('sessionUnit').value=id;
  loadUnitForSession();
}

function fillSessionUnits(){
  const sel=byId('sessionUnit');if(!sel)return;
  if(!state.units.length){
    sel.innerHTML='<option value="demo">Ejemplo: Proyecto Cuidamos la Pachamama</option>';
    loadUnitForSession();return;
  }
  sel.innerHTML=state.units.map(u=>`<option value="${u.id}">${escapeHtml(u.title)}</option>`).join('');
  if(state.activeUnitId&&state.units.some(u=>u.id===state.activeUnitId))sel.value=state.activeUnitId;
  else{state.activeUnitId=state.units[0].id;sel.value=state.activeUnitId;save();}
  loadUnitForSession();
}

function loadUnitForSession(){
  const activity=byId('activity');const sel=byId('sessionUnit');if(!activity||!sel)return;
  const unit=state.units.find(u=>u.id===sel.value);
  if(!unit){activity.innerHTML='<option value="0">Matemática · Medimos espacios para organizar nuestra feria</option><option value="1">Comunicación · Dialogamos sobre saberes de nuestra comunidad</option>';syncTitle();return;}
  state.activeUnitId=unit.id;save();
  activity.innerHTML=unit.activities.map((a,i)=>`<option value="${i}">${escapeHtml(a.area)} · ${escapeHtml(a.title)}</option>`).join('');
  syncTitle();
}

function selectedActivity(){
  const unit=state.units.find(u=>u.id===byId('sessionUnit')?.value);
  if(!unit)return {unit:null,activity:{area:'Matemática',title:'Medimos espacios para organizar nuestra feria'}};
  const index=parseInt(byId('activity')?.value||'0');
  return {unit,activity:unit.activities[index]||unit.activities[0]};
}

function syncTitle(){
  const title=byId('sessionTitle'),activitySelect=byId('activity');if(!title||!activitySelect)return;
  const {activity}=selectedActivity();
  title.value=activity?.title||activitySelect.options[activitySelect.selectedIndex]?.textContent||'';
  title.readOnly=state.mode==='easy';
}

function competenceFor(area,title=''){
  const t=title.toLowerCase();
  if(area==='Comunicación'){
    if(/lee|lectura|texto/.test(t))return 'Lee diversos tipos de textos escritos en su lengua materna.';
    if(/escrib|produc|revis/.test(t))return 'Escribe diversos tipos de textos en su lengua materna.';
    return 'Se comunica oralmente en su lengua materna.';
  }
  if(area==='Matemática'){
    if(/tabla|gráfico|dato/.test(t))return 'Resuelve problemas de gestión de datos e incertidumbre.';
    if(/med|forma|ubic|espacio/.test(t))return 'Resuelve problemas de forma, movimiento y localización.';
    if(/patrón|regular/.test(t))return 'Resuelve problemas de regularidad, equivalencia y cambio.';
    return 'Resuelve problemas de cantidad.';
  }
  if(area==='Personal Social')return 'Convive y participa democráticamente en la búsqueda del bien común.';
  if(area==='Ciencia y Tecnología')return /indag|observ|pregunta|resultado/.test(t)?'Indaga mediante métodos científicos para construir sus conocimientos.':'Explica el mundo físico basándose en conocimientos sobre los seres vivos, materia y energía, biodiversidad, Tierra y universo.';
  if(area==='Arte y Cultura')return 'Crea proyectos desde los lenguajes artísticos.';
  if(area==='Educación Física')return 'Interactúa a través de sus habilidades sociomotrices.';
  if(area==='Educación Religiosa')return 'Asume la experiencia del encuentro personal y comunitario con Dios en su proyecto de vida.';
  if(area==='Psicomotriz')return 'Se desenvuelve de manera autónoma a través de su motricidad.';
  return `Desarrolla la competencia priorizada del área de ${area}, de acuerdo con la unidad y el grado.`;
}

function criterionFor(area,brief){
  const ctx=brief||'la situación de la comunidad';
  if(area==='Comunicación')return `Comunica o produce información pertinente sobre ${ctx}, organizando sus ideas de acuerdo con el propósito y destinatario.`;
  if(area==='Matemática')return `Resuelve y explica una situación problemática vinculada con ${ctx}, usando una estrategia y representación pertinente.`;
  if(area==='Personal Social')return `Explica y sustenta acuerdos o responsabilidades relacionados con ${ctx}, considerando el bienestar de la comunidad.`;
  if(area==='Ciencia y Tecnología')return `Obtiene y comunica evidencias para explicar un proceso relacionado con ${ctx}, contrastando sus ideas con lo observado.`;
  return `Elabora y explica una producción vinculada con ${ctx}, aplicando los aprendizajes priorizados del área.`;
}

function evidenceFor(area){
  if(area==='Comunicación')return 'Texto, intervención oral o producción comunicativa revisada según el propósito.';
  if(area==='Matemática')return 'Resolución del reto con representación, procedimiento y explicación de la respuesta.';
  if(area==='Personal Social')return 'Conclusiones, acuerdos o propuesta argumentada sobre la situación analizada.';
  if(area==='Ciencia y Tecnología')return 'Registro de indagación o explicación con observaciones, resultados y conclusión.';
  return 'Producción o desempeño observable desarrollado durante la sesión.';
}

function instrumentFor(area){return area==='Ciencia y Tecnología'?'Rúbrica breve de indagación':'Lista de cotejo con un criterio claro y medible'}

function challengeFor(area,brief){
  const ctx=brief||'la situación de nuestra comunidad';
  if(area==='Matemática')return `A partir de datos reales o simulados de ${ctx}, los estudiantes deberán resolver un problema, elegir una estrategia, representar la información y explicar por qué su respuesta tiene sentido.`;
  if(area==='Ciencia y Tecnología')return `Se presenta una observación o hecho relacionado con ${ctx}. Los estudiantes formulan preguntas, anticipan una explicación, recogen información u observaciones y comunican una conclusión.`;
  return `Se presenta una experiencia, testimonio, imagen, objeto o pregunta vinculada con ${ctx} para recuperar saberes previos y plantear un reto auténtico.`;
}

function differentiatedTasks(grades,area,brief){
  const ctx=brief||'el contexto de la unidad';
  return grades.map(g=>{
    const n=parseInt(g)||0;
    let task='Participa en la actividad con apoyos acordes a su grado.';
    if(/años/.test(g))task=`Explora, representa y comunica mediante juego, movimiento, dibujo u oralidad una experiencia relacionada con ${ctx}.`;
    else if(n<=2)task=`Representa con dibujos, material concreto, palabras u oralidad una idea o solución relacionada con ${ctx}.`;
    else if(n<=4)task=`Organiza información, resuelve el reto y explica con frases o procedimientos cómo llegó a su respuesta.`;
    else task=`Analiza información, justifica decisiones y comunica conclusiones usando evidencias y vocabulario pertinente.`;
    return `<tr><td>${escapeHtml(g)}</td><td>${escapeHtml(task)}</td></tr>`;
  }).join('');
}

function sessionTimes(durationText){
  const m=parseInt(durationText)||45;
  if(m>=90)return {start:15,dev:60,close:15};
  if(m>=60)return {start:15,dev:35,close:10};
  return {start:10,dev:25,close:10};
}

function buildSession(){
  const {unit,activity}=selectedActivity();
  const duration=byId('sessionDuration')?.value||'45 minutos';
  const resources=byId('sessionResources')?.value||'Materiales básicos';
  const brief=unit?unitBrief(unit):'la situación de nuestra comunidad';
  const area=activity?.area||'Área';
  const title=byId('sessionTitle')?.value||activity?.title||'Sesión de aprendizaje';
  const times=sessionTimes(duration);
  const session={
    id:'s'+Date.now(),unitId:unit?.id||null,unitTitle:unit?.title||'Unidad de ejemplo',title,area,duration,resources,
    level:state.level,ieType:state.ieType,grades:[...state.grades],brief,
    competence:competenceFor(area,title),criterion:criterionFor(area,brief),evidence:evidenceFor(area),instrument:instrumentFor(area),
    challenge:challengeFor(area,brief),times,
    purpose:`Desarrollar la competencia priorizada del área de ${area} mediante un reto contextualizado en ${brief}, diferenciando las tareas según el grado y promoviendo que los estudiantes expliquen lo que hacen y aprenden.`,
    createdAt:new Date().toISOString()
  };
  state.lastSession=session;save();return session;
}

function sessionHtml(session,forWord=false){
  const multigrade=(session.ieType==='Multigrado'||session.ieType==='Unidocente')&&session.grades.length>1;
  const attention=multigrade?'<p><b>Atención multigrado:</b> se alternan momentos de atención directa con un grado y trabajo autónomo/colaborativo de los demás, cerrando con socialización común.</p>':'<p><b>Organización:</b> trabajo individual, en pares y grupal según el momento de la sesión.</p>';
  const tasks=differentiatedTasks(session.grades,session.area,session.brief);
  return `<h2>${escapeHtml(session.title)}</h2>
  <p><b>Área:</b> ${escapeHtml(session.area)} &nbsp; <b>Nivel:</b> ${escapeHtml(session.level)} &nbsp; <b>Grados:</b> ${escapeHtml(session.grades.join(', '))} &nbsp; <b>Duración:</b> ${escapeHtml(session.duration)}</p>
  <p><b>Unidad/Proyecto:</b> ${escapeHtml(session.unitTitle)}</p>
  <p><b>Competencia priorizada:</b> ${escapeHtml(session.competence)}</p>
  <p><b>Propósito:</b> ${escapeHtml(session.purpose)}</p>
  <p><b>Criterio de evaluación:</b> ${escapeHtml(session.criterion)}</p>
  <p><b>Evidencia:</b> ${escapeHtml(session.evidence)}</p>
  <p><b>Instrumento:</b> ${escapeHtml(session.instrument)}</p>
  <p><b>Recursos:</b> ${escapeHtml(session.resources)}. Se debe ofrecer alternativa no digital cuando corresponda.</p>
  ${attention}
  <h3>Inicio · ${session.times.start} min</h3>
  <p>Acogida, conexión con la experiencia de los estudiantes y recuperación de saberes previos. El docente comunica el propósito y el criterio en lenguaje comprensible, acuerda normas breves de trabajo y presenta el reto.</p>
  <p><b>Reto o problema de partida:</b> ${escapeHtml(session.challenge)}</p>
  <h3>Desarrollo · ${session.times.dev} min</h3>
  <p>Los estudiantes exploran, dialogan, representan, resuelven, producen o investigan de acuerdo con el área. El docente formula preguntas que exigen explicar, comparar, justificar y tomar decisiones; observa evidencias y brinda retroalimentación oportuna.</p>
  <table style="width:100%;border-collapse:collapse" border="1" cellpadding="6"><thead><tr><th>Grado/edad</th><th>Tarea diferenciada</th></tr></thead><tbody>${tasks}</tbody></table>
  <h3>Formalización / construcción del aprendizaje</h3>
  <p>Se recuperan las estrategias y producciones de los estudiantes, se contrastan ideas y se construye una conclusión, procedimiento o explicación común acorde con la competencia trabajada. Cada grado registra la formalización con el nivel de complejidad que le corresponde.</p>
  <h3>Cierre · ${session.times.close} min</h3>
  <p>Los estudiantes socializan evidencias, responden qué aprendieron, cómo lo hicieron y para qué les sirve en su contexto. El docente retroalimenta a partir del criterio y recoge una evidencia para orientar la siguiente sesión.</p>
  <h3>Instrumento breve</h3>
  <table style="width:100%;border-collapse:collapse" border="1" cellpadding="6"><tr><th>Criterio</th><th>Logrado</th><th>En proceso</th><th>Requiere apoyo</th></tr><tr><td>${escapeHtml(session.criterion)}</td><td></td><td></td><td></td></tr></table>
  ${forWord?'<p><i>Documento generado como propuesta editable por el docente.</i></p>':''}`;
}

function generateSession(){
  syncTitle();
  const session=buildSession();
  renderSessionOutput(session);
}

function renderSessionOutput(session){
  const out=byId('sessionOutput');if(!out)return;
  const doc=byId('sessionDocument')||out.querySelector('.document');
  if(doc)doc.innerHTML=sessionHtml(session,false);
  let tools=byId('sessionTools');
  if(!tools){
    tools=document.createElement('div');tools.id='sessionTools';tools.className='actions topgap';
    const chat=out.querySelector('.chatbar');out.insertBefore(tools,chat||null);
  }
  tools.innerHTML=`<button class="btn alt" onclick="downloadSessionWord()">⬇ Descargar Word</button><button class="btn ghost" onclick="shareSession()">📤 Compartir</button>`;
  out.classList.remove('hidden');out.scrollIntoView({behavior:'smooth'});
}

function sendCorrection(){
  const input=byId('chatInput');const t=input.value.trim();if(!t)return;
  const d=document.createElement('div');d.className='chatmsg';d.innerHTML=`💬 <b>Tu indicación:</b> ${escapeHtml(t)}<br><span>En la siguiente fase con IA, la app conservará lo aprobado y modificará únicamente lo solicitado.</span>`;
  byId('chatLog').prepend(d);input.value='';
}

function wordDocument(title,body){
  return `<!doctype html><html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>${escapeHtml(title)}</title><style>body{font-family:Arial,sans-serif;font-size:11pt;line-height:1.35;color:#111}h1{font-size:18pt}h2{font-size:15pt}h3{font-size:12pt}table{border-collapse:collapse;width:100%}th,td{border:1px solid #666;padding:6px;vertical-align:top}.box{border:1px solid #999;padding:10px;margin:8px 0}</style></head><body>${body}</body></html>`;
}

function wordBlob(title,body){return new Blob(['\ufeff',wordDocument(title,body)],{type:'application/msword;charset=utf-8'});}
function downloadBlob(blob,fileName){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=fileName;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1200)}

function unitWordHtml(unit){
  const situation=unitSituation(unit);
  const activities=unit.activities.map((a,i)=>`<tr><td>${i+1}</td><td>${escapeHtml(a.week)}</td><td>${escapeHtml(a.area)}</td><td>${escapeHtml(a.title)}</td></tr>`).join('');
  return `<h1>${escapeHtml(unit.title)}</h1><p><b>Tipo:</b> ${escapeHtml(unit.type)} &nbsp; <b>Duración:</b> ${escapeHtml(unit.duration)}</p><p><b>Nivel:</b> ${escapeHtml(unit.level)} &nbsp; <b>Tipo de IE:</b> ${escapeHtml(unit.ieType)} &nbsp; <b>Grados/edades:</b> ${escapeHtml(unit.grades.join(', '))}</p><p><b>Áreas:</b> ${escapeHtml(unit.areas.join(', '))}</p><h2>Situación significativa</h2><p>${escapeHtml(situation)}</p><h2>Propósito integrador</h2><p>${escapeHtml(unit.purpose)}</p><h2>Producto/evidencia integradora</h2><p>${escapeHtml(unit.product)}</p><h2>Secuencia de actividades</h2><table><tr><th>N.º</th><th>Semana</th><th>Área</th><th>Actividad</th></tr>${activities}</table><p><i>Referencia pedagógica: propuesta estructurada con criterios de planificación curricular del MINEDU; debe ser revisada y contextualizada por el docente.</i></p>`;
}

function downloadUnitWord(id){
  const unit=state.units.find(u=>u.id===id);if(!unit)return;
  downloadBlob(wordBlob(unit.title,unitWordHtml(unit)),cleanFileName(unit.title)+'.doc');
}

async function shareFile(blob,fileName,title){
  try{
    const file=new File([blob],fileName,{type:blob.type});
    if(navigator.share&&(!navigator.canShare||navigator.canShare({files:[file]}))){await navigator.share({title,files:[file]});return;}
  }catch(e){console.warn(e)}
  downloadBlob(blob,fileName);alert('Tu dispositivo no permite compartir el archivo directamente. Se descargó el Word para que puedas enviarlo.');
}

function shareUnit(id){
  const unit=state.units.find(u=>u.id===id);if(!unit)return;
  shareFile(wordBlob(unit.title,unitWordHtml(unit)),cleanFileName(unit.title)+'.doc',unit.title);
}

function downloadSessionWord(){
  const s=state.lastSession;if(!s)return alert('Primero crea una sesión.');
  downloadBlob(wordBlob(s.title,sessionHtml(s,true)),cleanFileName(s.title)+'.doc');
}

function shareSession(){
  const s=state.lastSession;if(!s)return alert('Primero crea una sesión.');
  shareFile(wordBlob(s.title,sessionHtml(s,true)),cleanFileName(s.title)+'.doc',s.title);
}

function generateMaterial(){
  const lang=byId('materialLanguage').value;const variety=byId('materialQuechua').value;let text='';
  if(lang==='Castellano')text='En nuestra comunidad cuidamos el agua porque sostiene la vida de las personas, animales y plantas. Reutilizarla responsablemente ayuda a proteger nuestro entorno.';
  else if(lang==='Quechua')text=`[Demostración ${variety}] Kay yakuqa kawsayninchikpaq ancha chaninniyuqmi. Yaku waqaychayqa ayllunchikta yanapan.`;
  else text=`CASTELLANO: Cuidamos el agua y evitamos desperdiciarla. | ${variety}: Kay yakuqa kawsayninchikpaq ancha chaninniyuqmi.`;
  byId('materialText').textContent=text;byId('materialOutput').classList.remove('hidden');
}

function showEvaluation(kind){
  const p=byId('evaluationPanel');p.classList.remove('hidden');
  if(kind==='register')p.innerHTML=`<h2>📋 Registro de evaluación</h2><p>Usa criterios y evidencias ya registrados.</p><label>Nivel de logro<select><option>AD</option><option>A</option><option selected>B</option><option>C</option></select></label>`;
  else if(kind==='unit')p.innerHTML=`<h2>🧪 Evaluación de unidad/proyecto</h2><div class="form2"><label>Idioma<select><option>Castellano</option><option>Quechua</option><option>Bilingüe</option></select></label><label>Tipo<select><option>Mixta</option><option>Escrita</option><option>Oral</option><option>Producto/desempeño</option></select></label></div><div class="notice">Cambiar el idioma no cambia el criterio ni la dificultad.</div><button class="btn">✨ Crear evaluación</button>`;
  else p.innerHTML=`<h2>📝 Conclusiones descriptivas SIAGIE</h2><div class="document"><p><b>Competencia:</b> Resuelve problemas de cantidad</p><p><b>Nivel:</b> B</p><p><b>Conclusión propuesta:</b> Resuelve situaciones empleando estrategias de cálculo y explica parte de sus procedimientos. Requiere fortalecer la justificación de sus respuestas en situaciones nuevas.</p></div><p><button class="btn">✓ Aprobar</button> <button class="btn alt">✏️ Corregir</button> <button class="btn ghost">📋 Copiar para SIAGIE</button></p>`;
  p.scrollIntoView({behavior:'smooth'});
}

function restartSetup(){showSetup();nextSetup(1)}
function resetDemo(){if(confirm('¿Restablecer la configuración y los datos del prototipo?')){localStorage.removeItem('docenteDigitalPrototype');location.reload()}}

setMode(state.mode);
if(state.level){fillSelects();go('home')}else showSetup();
