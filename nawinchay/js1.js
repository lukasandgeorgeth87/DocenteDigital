const CONFIG = window.NAWINCHAY_CONFIG;
const $ = s => document.querySelector(s);
const state = { readings: [], current: null, step: 0, progress: {}, events: [], answers: {}, installPrompt: null, session: null, binding: null, assignments: [], teacherSession: null, teacherStudents: [] };
const steps = ['Predicción','Lectura','Palabras','Comprensión','Transferencia','Relectura'];
const DB_NAME='nawinchay-pilot-v3', DB_VERSION=1;
let db;

function toast(msg){ const el=$('#toast'); el.textContent=msg; el.classList.add('show'); clearTimeout(el._t); el._t=setTimeout(()=>el.classList.remove('show'),2800); }
function uuid(){ return crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.random()*16|0,v=c==='x'?r:(r&3|8);return v.toString(16)}); }
function escapeHtml(s){return String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]))}
function localDate(){ const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
function addDays(text,days){const d=new Date(`${text}T12:00:00`);d.setDate(d.getDate()+days);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function openDB(){ return new Promise((resolve,reject)=>{ const r=indexedDB.open(DB_NAME,DB_VERSION); r.onupgradeneeded=()=>{const d=r.result; if(!d.objectStoreNames.contains('kv'))d.createObjectStore('kv'); if(!d.objectStoreNames.contains('events')){const s=d.createObjectStore('events',{keyPath:'client_event_id'}); s.createIndex('synced','synced');} }; r.onsuccess=()=>{db=r.result; resolve(db)}; r.onerror=()=>reject(r.error); }); }
function kvGet(key){return new Promise((res,rej)=>{const t=db.transaction('kv'),r=t.objectStore('kv').get(key);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
function kvSet(key,val){return new Promise((res,rej)=>{const t=db.transaction('kv','readwrite'),r=t.objectStore('kv').put(val,key);r.onsuccess=()=>res();r.onerror=()=>rej(r.error)})}
function eventPut(e){return new Promise((res,rej)=>{const t=db.transaction('events','readwrite'),r=t.objectStore('events').put(e);r.onsuccess=()=>res();r.onerror=()=>rej(r.error)})}
function allEvents(){return new Promise((res,rej)=>{const t=db.transaction('events'),r=t.objectStore('events').getAll();r.onsuccess=()=>res(r.result||[]);r.onerror=()=>rej(r.error)})}
async function saveProgress(){await kvSet('progress',state.progress)}
async function loadLocalState(){state.progress=await kvGet('progress')||{}; state.session=await kvGet('session')||null; state.binding=await kvGet('binding')||null; state.assignments=await kvGet('assignments')||[]; state.events=await allEvents();}

function emojiForWord(word){const map={papa:'🥔',pala:'🛠️',chacra:'🌱',planta:'🪴',agua:'💧',tierra:'🟫',cocina:'🍳',olla:'🍲',balde:'🪣',abuela:'👵',canasta:'🧺',mesa:'🪑',escuela:'🏫',mochila:'🎒',camino:'🛤️',casa:'🏠',puerta:'🚪',patio:'🌿',oveja:'🐑',corral:'🏡',cuy:'🐹','maíz':'🌽',mercado:'🛍️',puesto:'🏪'};return map[word?.toLowerCase()]||'🔤';}
function emojiForReading(title){if(/chacra|papa/i.test(title))return '🥔';if(/planta/i.test(title))return '🪴';if(/cocina/i.test(title))return '🍲';if(/agua/i.test(title))return '🪣';if(/escuela/i.test(title))return '🏫';if(/casita/i.test(title))return '🏠';if(/oveja/i.test(title))return '🐑';if(/cuy/i.test(title))return '🐹';if(/mercado/i.test(title))return '🛍️';return '📖';}
function normalizeRemote(readRows, wordRows, questionRows){
  const order=new Map(CONFIG.pilotReadingIds.map((id,i)=>[id,i]));
  const wordsBy=new Map(), qsBy=new Map();
  for(const w of wordRows||[]){if(!wordsBy.has(w.reading_id))wordsBy.set(w.reading_id,[]);wordsBy.get(w.reading_id).push(w)}
  for(const q of questionRows||[]){if(!qsBy.has(q.reading_id))qsBy.set(q.reading_id,[]);qsBy.get(q.reading_id).push(q)}
  return (readRows||[]).filter(r=>order.has(r.id)).sort((a,b)=>order.get(a.id)-order.get(b.id)).map((r,i)=>({
    id:r.id, code:String(i+1).padStart(3,'0'), title:r.title, body_text:r.body_text, prediction:r.prediction_prompt||'', transfer:r.transfer_prompt||'', word_count:r.word_count, collection_name:r.collection_name, emoji:emojiForReading(r.title),
    words:(wordsBy.get(r.id)||[]).sort((a,b)=>(a.focus_order||99)-(b.focus_order||99)).map(w=>({id:w.id,word:w.word,emoji:emojiForWord(w.word),display_upper:w.display_upper,display_lower:w.display_lower,metadata:w.metadata||{}})),
    questions:(qsBy.get(r.id)||[]).sort((a,b)=>(a.sequence_no||99)-(b.sequence_no||99)).map(q=>({id:q.id,level:q.level,prompt:q.prompt,options:Array.isArray(q.options)?q.options:null,answer:q.answer_key?.value??null,answer_key:q.answer_key||{},metadata:q.metadata||{}}))
  }));
}
function authHeaders(token){return {'apikey':CONFIG.publishableKey,'Authorization':`Bearer ${token}`,'Content-Type':'application/json'}}
async function ensureAnonymousSession(showErrors=true){
  if(state.session?.access_token && state.session?.expires_at && state.session.expires_at*1000>Date.now()+60000) return state.session;
  if(state.session?.refresh_token){try{const r=await fetch(`${CONFIG.supabaseUrl}/auth/v1/token?grant_type=refresh_token`,{method:'POST',headers:{'apikey':CONFIG.publishableKey,'Content-Type':'application/json'},body:JSON.stringify({refresh_token:state.session.refresh_token})});if(r.ok){const s=await r.json();state.session={...s,expires_at:Math.floor(Date.now()/1000)+(s.expires_in||3600)};await kvSet('session',state.session);return state.session}}catch(e){console.warn(e)}}
  if(!navigator.onLine) return null;
  try{
    const r=await fetch(`${CONFIG.supabaseUrl}/auth/v1/signup`,{method:'POST',headers:{'apikey':CONFIG.publishableKey,'Content-Type':'application/json'},body:JSON.stringify({data:{app:'nawinchay-pilot-v3',device_label:navigator.userAgent.slice(0,80)}})});
    if(!r.ok) throw new Error(await r.text()); const s=await r.json(); if(!s.access_token)throw new Error('Supabase no devolvió sesión anónima');
    state.session={...s,expires_at:Math.floor(Date.now()/1000)+(s.expires_in||3600)}; await kvSet('session',state.session); return state.session;
  }catch(e){ if(showErrors)toast('No se pudo iniciar sesión anónima. El modo offline sigue disponible.'); console.warn(e); return null; }
}
async function restSelect(table,filterField,ids,token){
  const p=new URLSearchParams();p.set(filterField,`in.(${ids.join(',')})`);p.set('select','*');
  const r=await fetch(`${CONFIG.supabaseUrl}/rest/v1/${table}?${p.toString()}`,{headers:authHeaders(token)});if(!r.ok)throw new Error(`${table}: ${r.status} ${await r.text()}`);return r.json();
}
async function fetchAuthoritativeReadings(){
  const s=await ensureAnonymousSession(false); if(!s)return null;
  const ids=CONFIG.pilotReadingIds;
  const [rr,ww,qq]=await Promise.all([restSelect('readings','id',ids,s.access_token),restSelect('reading_words','reading_id',ids,s.access_token),restSelect('reading_questions','reading_id',ids,s.access_token)]);
  const out=normalizeRemote(rr,ww,qq); if(out.length===10){await kvSet('remote_readings',out);return out} return null;
}
async function loadReadings(){
  const fallback=await fetch(CONFIG.readingsUrl).then(r=>r.json());
  const cached=await kvGet('remote_readings');
  state.readings=Array.isArray(cached)&&cached.length===10?cached:fallback;
}
async function logEvent(type, activity_key, payload={}){
  const r=state.current;if(!r)return null;let p=state.progress[r.code]||{};if(!p.attemptId)p.attemptId=uuid();
  state.progress[r.code]=p;await saveProgress();
  const e={client_event_id:uuid(),client_attempt_id:p.attemptId,reading_id:r.id,reading_code:r.code,event_type:type,activity_key,occurred_at_client:new Date().toISOString(),payload,synced:false};
  await eventPut(e);state.events=await allEvents();updateMetrics();return e;
}

