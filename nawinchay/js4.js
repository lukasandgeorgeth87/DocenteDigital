function assignmentForReading(readingId){return state.assignments.find(a=>a.reading_id===readingId&&['assigned','closed'].includes(a.status));}
async function syncEvents(){
  if(!navigator.onLine){toast('Sin Internet. Tus avances siguen guardados.');return;}let boot=await bootstrapDevice(false);if(!state.binding?.student_id){toast('Primero genera el código y confirma la vinculación con el docente.');return;}const s=await ensureAnonymousSession(true);if(!s)return;const pending=(await allEvents()).filter(e=>!e.synced);if(!pending.length){toast('No hay eventos pendientes.');return;}
  const groups=new Map();for(const e of pending){if(!groups.has(e.reading_id))groups.set(e.reading_id,[]);groups.get(e.reading_id).push(e)}let syncedCount=0, skipped=0;
  for(const [readingId,events] of groups){const a=assignmentForReading(readingId);if(!a){skipped+=events.length;continue;}const code=events[0].reading_code;const p=state.progress[code]||{};const started=events.map(e=>e.occurred_at_client).sort()[0]||new Date().toISOString();const attempt={client_attempt_id:p.attemptId||events[0].client_attempt_id,assignment_id:a.id,status:p.completed?'completed':'in_progress',started_at_client:started,completed_at_client:p.completed?(p.completedAt||new Date().toISOString()):null,local_revision:1,metadata:{app:'nawinchay-pilot-v3',reading_code:code}};
    try{const r=await fetch(`${CONFIG.supabaseUrl}/functions/v1/sync-student`,{method:'POST',headers:authHeaders(s.access_token),body:JSON.stringify({attempt,events:events.map(({synced,synced_at,reading_code,reading_id,...e})=>e)})});const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.error||`HTTP ${r.status}`);const accepted=new Set(j.accepted_event_ids||[]);for(const e of events){if(accepted.has(e.client_event_id)){e.synced=true;e.synced_at=new Date().toISOString();await eventPut(e);syncedCount++;}}}catch(e){console.warn('sync reading',readingId,e)}
  }
  state.events=await allEvents();await renderTeacher();renderHome();toast(skipped?`Sincronizados ${syncedCount}; ${skipped} esperan una asignación.`:`Progreso sincronizado: ${syncedCount} eventos.`);
}
async function renderTeacher(){state.events=await allEvents();const completed=Object.values(state.progress).filter(x=>x.completed).length;$('#metricCompleted').textContent=completed;$('#metricAnswers').textContent=state.events.filter(e=>e.event_type==='question_answered').length;$('#metricRereads').textContent=state.events.filter(e=>e.event_type==='reread_started').length;$('#metricPending').textContent=state.events.filter(e=>!e.synced).length;$('#teacherRows').innerHTML=state.readings.map(r=>{const p=state.progress[r.code]||{};const ev=state.events.filter(e=>e.reading_code===r.code);const a=assignmentForReading(r.id);return `<div class="teacher-row"><strong>${r.code} · ${escapeHtml(r.title)}</strong><span>${p.completed?'✓ Completada':'En proceso'}</span><span>${ev.length} eventos · ${a?'asignada':'sin asignación'}</span></div>`}).join('');$('#pairCodeDisplay').textContent=state.binding?.student_id?'YA VINCULADA':'—';$('#pairStatus').textContent=state.binding?.student_name?`Vinculada con ${state.binding.student_name} (${state.binding.grade}.º).`:'Genera un código en esta tableta y confírmalo desde una sesión docente.';}
async function runDiagnostics(){
  const checks=[];
  const add=(label,ok,detail='')=>checks.push({label,ok,detail});
  add('Contexto seguro (HTTPS/localhost)',window.isSecureContext,location.protocol);
  add('IndexedDB disponible',Boolean(window.indexedDB));
  add('Service Worker disponible','serviceWorker' in navigator);
  let swReady=false;
  if('serviceWorker' in navigator){try{await navigator.serviceWorker.ready;swReady=true}catch{}}
  add('Service Worker listo',swReady);
  add('Biblioteca piloto cargada',state.readings.length===10,`${state.readings.length}/10`);
  add('Sesión de tableta',Boolean(state.session?.access_token),state.session?.access_token?'activa':'aún no creada');
  add('Tableta vinculada',Boolean(state.binding?.student_id),state.binding?.student_name||'sin vínculo');
  add('Asignaciones descargadas',state.assignments.length>=10,`${state.assignments.length} recibidas`);
  const ev=await allEvents();
  add('Cola local operativa',Array.isArray(ev),`${ev.filter(x=>!x.synced).length} pendientes`);
  try{const m=await fetch(CONFIG.manifestUrl,{cache:'no-store'});add('Manifest PWA',m.ok,`HTTP ${m.status}`)}catch(e){add('Manifest PWA',false,String(e))}
  try{const i=await fetch(CONFIG.iconUrl,{cache:'no-store'});add('Ícono PWA 192px',i.ok,`HTTP ${i.status}`)}catch(e){add('Ícono PWA 192px',false,String(e))}
  const out=$('#diagOutput');
  if(out)out.innerHTML=checks.map(c=>`<div class="diag-row ${c.ok?'ok':'warn'}"><strong>${c.ok?'✓':'!' } ${escapeHtml(c.label)}</strong><span>${escapeHtml(c.detail)}</span></div>`).join('');
  toast(checks.every(c=>c.ok)?'Diagnóstico: todo correcto':'Diagnóstico terminado: revisa las alertas');
}
function updateMetrics(){if(!$('#teacherView').classList.contains('hidden'))renderTeacher();renderHome();}
function updateNetwork(){const on=navigator.onLine;$('#netBadge').textContent=on?'● en línea':'● sin Internet';$('#netBadge').style.background=on?'var(--green2)':'#fff0e2';$('#netBadge').style.color=on?'#25713f':'#985d1e';renderHome();}
async function init(){await openDB();await loadLocalState();await loadReadings();if(navigator.storage?.persist){try{await navigator.storage.persist()}catch{}}if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js',{scope:'./'}).catch(console.warn);if(navigator.onLine&&state.session)await bootstrapDevice(false);renderHome();updateNetwork();window.addEventListener('online',async()=>{updateNetwork();await bootstrapDevice(false);if(state.binding?.student_id)await syncEvents()});window.addEventListener('offline',updateNetwork);$('#backBtn').onclick=()=>{speechSynthesis.cancel();renderHome();showView('studentHome')};$('#modeBtn').onclick=async()=>{const teacher=$('#teacherView').classList.contains('hidden');if(teacher){await renderTeacher();showView('teacherView');$('#modeBtn').textContent='Modo estudiante'}else{renderHome();showView('studentHome');$('#modeBtn').textContent='Modo docente'}};$('#pairBtn').onclick=requestPairCode;$('#checkPairBtn').onclick=async()=>{await bootstrapDevice(true);await renderTeacher();if(state.binding?.student_id)await syncEvents()};$('#syncBtn').onclick=syncEvents;$('#diagBtn').onclick=runDiagnostics;$('#teacherLoginBtn').onclick=teacherLogin;$('#teacherLogoutBtn').onclick=teacherLogout;$('#confirmPairBtn').onclick=confirmPairAsTeacher;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();state.installPrompt=e;$('#installBtn').hidden=false});$('#installBtn').onclick=async()=>{if(state.installPrompt){state.installPrompt.prompt();await state.installPrompt.userChoice;state.installPrompt=null;$('#installBtn').hidden=true}};}
document.addEventListener('DOMContentLoaded',init);
