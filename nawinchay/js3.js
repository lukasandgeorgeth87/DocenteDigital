async function bootstrapDevice(showToast=false){
  if(!navigator.onLine)return null;const s=await ensureAnonymousSession(showToast);if(!s)return null;
  try{const today=localDate();const r=await fetch(`${CONFIG.supabaseUrl}/functions/v1/student-bootstrap`,{method:'POST',headers:authHeaders(s.access_token),body:JSON.stringify({local_date:today,from:addDays(today,-7),to:addDays(today,14)})});const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.error||`HTTP ${r.status}`);if(!j.paired){state.binding=null;await kvSet('binding',null);return j}state.binding={student_id:j.student?.id,student_name:j.student?.display_name,grade:j.student?.grade,last_bootstrap:new Date().toISOString()};state.assignments=j.assignments||[];await kvSet('binding',state.binding);await kvSet('assignments',state.assignments);
    if((j.readings||[]).length){const remote=normalizeRemote(j.readings,j.words||[],j.questions||[]);if(remote.length===10){state.readings=remote;await kvSet('remote_readings',remote);renderHome();}}
    if(showToast)toast(`Vinculada con ${state.binding.student_name||'estudiante'}`);return j;
  }catch(e){console.warn('bootstrap',e);if(showToast)toast('No se pudo comprobar la vinculación.');return null;}
}
async function teacherLogin(){
  if(!navigator.onLine){toast('Necesitas Internet para iniciar sesión docente.');return;}
  const email=$('#teacherEmail').value.trim();
  const password=$('#teacherPassword').value;
  if(!email||!password){toast('Escribe correo y contraseña del docente.');return;}
  $('#teacherAuthStatus').textContent='Iniciando sesión…';
  try{
    const r=await fetch(`${CONFIG.supabaseUrl}/auth/v1/token?grant_type=password`,{method:'POST',headers:{'apikey':CONFIG.publishableKey,'Content-Type':'application/json'},body:JSON.stringify({email,password})});
    const j=await r.json().catch(()=>({}));
    if(!r.ok||!j.access_token)throw new Error(j.error_description||j.msg||`HTTP ${r.status}`);
    state.teacherSession=j;
    $('#teacherPassword').value='';
    $('#teacherAuthStatus').textContent=`Sesión docente activa: ${email}`;
    $('#teacherLoginBtn').hidden=true;$('#teacherLogoutBtn').hidden=false;
    await loadTeacherStudents();
    toast('Sesión docente iniciada');
  }catch(e){console.warn('teacher login',e);state.teacherSession=null;$('#teacherAuthStatus').textContent='No se pudo iniciar sesión docente.';toast('Revisa el correo o la contraseña');}
}
async function loadTeacherStudents(){
  if(!state.teacherSession?.access_token)return;
  try{
    const p=new URLSearchParams({select:'id,display_name,grade',active:'eq.true',order:'grade.asc,display_name.asc'});
    const r=await fetch(`${CONFIG.supabaseUrl}/rest/v1/students?${p.toString()}`,{headers:authHeaders(state.teacherSession.access_token)});
    if(!r.ok)throw new Error(`HTTP ${r.status}`);
    state.teacherStudents=await r.json();
    const sel=$('#teacherStudentSelect');
    sel.innerHTML='<option value="">Selecciona estudiante…</option>'+state.teacherStudents.map(x=>`<option value="${escapeHtml(x.id)}">${escapeHtml(x.display_name)} · ${escapeHtml(x.grade)}.º</option>`).join('');
    sel.disabled=false;$('#confirmPairBtn').disabled=false;
  }catch(e){console.warn('teacher students',e);$('#teacherAuthStatus').textContent='Sesión iniciada, pero no se pudo cargar estudiantes.';}
}
function teacherLogout(){state.teacherSession=null;state.teacherStudents=[];$('#teacherLoginBtn').hidden=false;$('#teacherLogoutBtn').hidden=true;$('#teacherStudentSelect').innerHTML='<option value="">Inicia sesión docente…</option>';$('#teacherStudentSelect').disabled=true;$('#confirmPairBtn').disabled=true;$('#teacherAuthStatus').textContent='Sesión docente cerrada.';toast('Sesión docente cerrada');}
async function confirmPairAsTeacher(){
  if(!state.teacherSession?.access_token){toast('Primero inicia sesión docente.');return;}
  const pairing_code=$('#teacherPairCode').value.trim().toUpperCase();
  const student_id=$('#teacherStudentSelect').value;
  if(!/^[A-Z2-9]{6}$/.test(pairing_code)){toast('Escribe un código válido de 6 caracteres.');return;}
  if(!student_id){toast('Selecciona al estudiante.');return;}
  $('#teacherAuthStatus').textContent='Confirmando vínculo…';
  try{
    const r=await fetch(`${CONFIG.supabaseUrl}/functions/v1/confirm-device-pair`,{method:'POST',headers:authHeaders(state.teacherSession.access_token),body:JSON.stringify({pairing_code,student_id})});
    const j=await r.json().catch(()=>({}));
    if(!r.ok)throw new Error(j.error||`HTTP ${r.status}`);
    $('#teacherAuthStatus').textContent=`Vínculo confirmado con ${j.student?.display_name||'el estudiante'}.`;
    toast('Tableta vinculada correctamente');
    await bootstrapDevice(true);await renderTeacher();
  }catch(e){console.warn('confirm pair',e);$('#teacherAuthStatus').textContent='No se pudo confirmar el vínculo.';toast('No se pudo confirmar el código');}
}
async function requestPairCode(){
  if(!navigator.onLine){toast('Conéctate a Internet para generar el código.');return;}const s=await ensureAnonymousSession(true);if(!s)return;$('#pairStatus').textContent='Preparando vinculación…';
  try{const r=await fetch(`${CONFIG.supabaseUrl}/functions/v1/request-device-pair`,{method:'POST',headers:authHeaders(s.access_token),body:JSON.stringify({device_label:'Ñawinchay PWA v3 · Piloto 1.º'})});const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.error||`HTTP ${r.status}`);if(j.paired){await bootstrapDevice(true);$('#pairCodeDisplay').textContent='YA VINCULADA';return;}$('#pairCodeDisplay').textContent=j.pairing_code||'—';if($('#teacherPairCode'))$('#teacherPairCode').value=j.pairing_code||'';$('#pairStatus').textContent=`Entrega este código al docente. Vence aproximadamente en 15 minutos. Después pulsa “Comprobar vinculación”.`;toast('Código de vinculación generado');}catch(e){console.warn(e);$('#pairStatus').textContent='No se pudo generar el código.';toast('No se pudo generar el código');}
}
