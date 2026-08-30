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

const save=()=>localStorage.setItem('docenteDigitalPrototype',JSON.stringify(state));
const byId=id=>document.getElementById(id);
const escapeHtml=value=>String(value??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

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
  if(byId('sessionContext'))byId('sessionContext').innerHTML=`<b>Contexto cargado:</b> ${escapeHtml(text)}<br>La app no vuelve a pedir estos datos.`;
  if(byId('settingsSummary'))byId('settingsSummary').innerHTML=`<b>Nivel:</b> ${escapeHtml(state.level)}<br><b>Tipo de IE:</b> ${escapeHtml(state.ieType)}<br><b>Grados/edades:</b> ${escapeHtml(state.grades.join(', '))}<br><b>Áreas:</b> ${escapeHtml(state.areas.join(', '))}<br><b>Idioma:</b> ${escapeHtml(state.language)}${state.language!=='Castellano'?' · '+escapeHtml(state.quechuaVar):''}`;
}

function continueWork(){
  if(state.units.length){go('plan');viewUnit(state.activeUnitId||state.units[0].id);}
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

function proposeUnitTitle(situation,type){
  const s=(situation||'').toLowerCase();
  if(/siembr|papa|tarpuy|añu|oca/.test(s))return 'Aprendemos y participamos en la siembra de nuestra comunidad';
  if(/pachamama|madre tierra/.test(s))return 'Cuidamos y valoramos la Pachamama';
  if(/agua|yaku/.test(s))return 'Cuidamos y usamos responsablemente el agua';
  if(/residuo|basura|contamin/.test(s))return 'Cuidamos nuestra comunidad reduciendo la contaminación';
  return type==='Proyecto de aprendizaje'?'Investigamos y aprendemos desde nuestra comunidad':'Aprendemos a partir de situaciones de nuestra comunidad';
}

function activityForArea(area,situation){
  const topic=situation||'la situación de nuestra comunidad';
  const map={
    'Comunicación':'Leemos, dialogamos y producimos textos sobre '+topic,
    'Matemática':'Resolvemos problemas matemáticos vinculados con '+topic,
    'Personal Social':'Analizamos la participación de las familias y la comunidad en '+topic,
    'Ciencia y Tecnología':'Indagamos y explicamos procesos relacionados con '+topic,
    'Arte y Cultura':'Representamos creativamente saberes y experiencias de '+topic,
    'Educación Física':'Participamos en actividades motrices vinculadas al contexto comunitario',
    'Educación Religiosa':'Reflexionamos y agradecemos por la vida, la comunidad y la naturaleza',
    'Psicomotriz':'Exploramos movimientos y acciones a partir de experiencias del contexto',
    'Ciencias Sociales':'Analizamos cambios, actores y relaciones sociales presentes en '+topic,
    'DPCC':'Deliberamos y proponemos acuerdos frente a situaciones de '+topic,
    'Inglés':'Comunicamos ideas sencillas relacionadas con el contexto de la unidad',
    'EPT':'Diseñamos propuestas y productos vinculados con '+topic
  };
  return map[area]||('Desarrollamos aprendizajes de '+area+' a partir de '+topic);
}

function buildActivities(situation){
  return state.areas.map((area,i)=>({area,title:activityForArea(area,situation),week:(i%Math.max(1,parseInt(byId('unitDuration')?.value)||4))+1}));
}

function createUnitDemo(){
  const type=byId('unitType').value;
  const duration=byId('unitDuration').value;
  const situation=byId('unitSituation').value.trim();
  if(!situation)return alert('Escribe la situación significativa antes de crear la propuesta.');
  let title=byId('unitTitle').value.trim();
  if(!title){title=proposeUnitTitle(situation,type);byId('unitTitle').value=title;}
  const unit={
    id:'u'+Date.now(),title,type,duration,situation,
    level:state.level,ieType:state.ieType,grades:[...state.grades],areas:[...state.areas],
    language:state.language,quechuaVar:state.quechuaVar,
    purpose:'Desarrollar competencias de manera articulada a partir de una situación real de la comunidad, con actividades comunes y diferenciadas según el grado.',
    product:type==='Proyecto de aprendizaje'?'Producto o acción final acordada con los estudiantes y vinculada a la situación significativa.':'Producciones y evidencias organizadas que muestran los aprendizajes logrados durante la unidad.',
    activities:buildActivities(situation),createdAt:new Date().toISOString()
  };
  state.units.unshift(unit);state.activeUnitId=unit.id;save();
  byId('unitReady').classList.remove('hidden');
  renderUnits();renderUnitOutput(unit);fillSessionUnits();
  byId('unitOutput').scrollIntoView({behavior:'smooth'});
}

function renderUnits(){
  const wrap=byId('unitsList');if(!wrap)return;
  if(!state.units.length){wrap.innerHTML='<div class="notice">Aún no tienes unidades o proyectos guardados. Pulsa “Crear nueva” para comenzar.</div>';return;}
  wrap.innerHTML=state.units.map(u=>`<div class="document topgap"><div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap"><div><span class="pill">${escapeHtml(u.type)}</span><h2 style="margin-top:8px">${escapeHtml(u.title)}</h2><p><b>${escapeHtml(u.level)}</b> · ${escapeHtml(u.ieType)} · ${escapeHtml(u.grades.join(', '))} · ${escapeHtml(u.duration)}</p><p>${escapeHtml(u.situation)}</p></div><div class="actions"><button class="btn alt" onclick="viewUnit('${u.id}')">👁 Ver</button><button class="btn" onclick="useUnit('${u.id}')">📝 Crear sesiones</button><button class="btn ghost" onclick="deleteUnit('${u.id}')">Eliminar</button></div></div></div>`).join('');
}

function renderUnitOutput(unit){
  const out=byId('unitOutput');if(!out||!unit)return;
  const activities=unit.activities.map((a,i)=>`<div class="document topgap"><b>Actividad ${i+1} · ${escapeHtml(a.area)}</b><br>${escapeHtml(a.title)}</div>`).join('');
  out.innerHTML=`<span class="pill">✓ Guardada</span><h1 style="margin-top:10px">${escapeHtml(unit.title)}</h1><p><b>Tipo:</b> ${escapeHtml(unit.type)} &nbsp; <b>Duración:</b> ${escapeHtml(unit.duration)}</p><p><b>Nivel y atención:</b> ${escapeHtml(unit.level)} · ${escapeHtml(unit.ieType)} · ${escapeHtml(unit.grades.join(', '))}</p><p><b>Áreas:</b> ${escapeHtml(unit.areas.join(', '))}</p><div class="notice"><b>Situación significativa:</b><br>${escapeHtml(unit.situation)}</div><div class="document"><p><b>Propósito integrador:</b> ${escapeHtml(unit.purpose)}</p><p><b>Producto/evidencia integradora:</b> ${escapeHtml(unit.product)}</p></div><h2 class="topgap">Actividades propuestas</h2>${activities}<div class="actions"><button class="btn" onclick="useUnit('${unit.id}')">📝 Usar esta unidad para crear sesiones</button><button class="btn alt" onclick="showUnit()">➕ Crear otra unidad/proyecto</button></div>`;
  out.classList.remove('hidden');
}

function viewUnit(id){
  const unit=state.units.find(u=>u.id===id);if(!unit)return;
  state.activeUnitId=id;save();
  renderUnitOutput(unit);
  byId('unitOutput').scrollIntoView({behavior:'smooth'});
}

function deleteUnit(id){
  const unit=state.units.find(u=>u.id===id);if(!unit)return;
  if(!confirm(`¿Eliminar “${unit.title}”?`))return;
  state.units=state.units.filter(u=>u.id!==id);
  if(state.activeUnitId===id)state.activeUnitId=state.units[0]?.id||null;
  save();renderUnits();fillSessionUnits();byId('unitOutput')?.classList.add('hidden');
}

function useUnit(id){
  state.activeUnitId=id;save();
  go('session');fillSessionUnits();
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
  if(!unit){activity.innerHTML='<option>Medimos espacios para organizar nuestra feria</option><option>Sistematizamos tablas y gráficos estadísticos</option><option>Dialogamos sobre saberes de nuestra comunidad</option>';syncTitle();return;}
  state.activeUnitId=unit.id;save();
  activity.innerHTML=unit.activities.map(a=>`<option>${escapeHtml(a.title)}</option>`).join('');
  syncTitle();
}

function syncTitle(){
  const title=byId('sessionTitle'),activity=byId('activity');if(!title||!activity)return;
  title.value=activity.value||'';title.readOnly=state.mode==='easy';
}

function generateSession(){
  syncTitle();byId('docTitle').textContent=byId('sessionTitle').value.toUpperCase();
  byId('sessionOutput').classList.remove('hidden');byId('sessionOutput').scrollIntoView({behavior:'smooth'});
}

function sendCorrection(){
  const input=byId('chatInput');const t=input.value.trim();if(!t)return;
  const d=document.createElement('div');d.className='chatmsg';d.innerHTML=`💬 <b>Tu indicación:</b> ${escapeHtml(t)}<br><span>Prototipo: se conservaría lo aprobado y se modificaría únicamente lo solicitado.</span>`;
  byId('chatLog').prepend(d);input.value='';
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