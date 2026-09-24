/* DocenteDigital — OpenAI runtime v1
   Frontend seguro: nunca contiene ni recibe OPENAI_API_KEY.
   Toda generación real pasa por /api/ai o /api/image.
*/
(function(){
  if(window.__ddOpenAIRuntimeV1)return;
  window.__ddOpenAIRuntimeV1=true;

  const $=id=>document.getElementById(id);
  const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const STATUS_TTL=30000;
  let statusCache=null,statusAt=0;

  function appState(){return window.state&&typeof window.state==='object'?window.state:{};}

  function safeContext(extra={}){
    const s=appState(),t=s.teacherContext||{},u=(s.units||[]).find(x=>x.id===s.activeUnitId)||{};
    const ctx={
      level:s.level||'',
      ieType:s.ieType||'',
      grades:Array.isArray(s.grades)?s.grades.slice(0,8):[],
      areas:Array.isArray(s.areas)?s.areas.slice(0,12):[],
      language:s.language||'',
      indigenousLanguage:s.indigenousLanguage||s.quechuaVar||'',
      linguisticMode:s.linguisticMode||'',
      institutionName:t.institutionName||s.schoolName||'',
      localityType:t.localityType||'',
      community:t.community||'',
      district:t.district||'',
      province:t.province||'',
      region:t.region||'',
      ugel:t.ugel||'',
      planningType:document.getElementById('unitType')?.value||u.type||'',
      duration:document.getElementById('unitDuration')?.value||u.duration||'',
      title:document.getElementById('unitTitle')?.value||u.title||'',
      brief:document.getElementById('unitSituation')?.value||u.situationBrief||'',
      area:document.getElementById('materialArea')?.value||s.lastSession?.area||'',
      grade:document.getElementById('materialGrade')?.value||'',
      topic:document.getElementById('materialTopic')?.value||s.lastSession?.title||'',
      teacherInstruction:document.getElementById('materialInstruction')?.value||'',
      sourceText:document.getElementById('materialSourceText')?.value||''
    };
    return Object.assign(ctx,extra||{});
  }

  async function health(force=false){
    if(!force&&statusCache&&Date.now()-statusAt<STATUS_TTL)return statusCache;
    try{
      const r=await fetch('/api/ai-status',{headers:{'Accept':'application/json'},cache:'no-store'});
      const data=await r.json();
      statusCache=data;statusAt=Date.now();return data;
    }catch(_e){
      statusCache={ok:false,configured:false,server_side:true};statusAt=Date.now();return statusCache;
    }
  }

  function readUsage(){
    try{return Object.assign({requests:0,input_tokens:0,output_tokens:0,byTask:{}},JSON.parse(localStorage.getItem('ddOpenAIUsage')||'{}'));}catch(_e){return {requests:0,input_tokens:0,output_tokens:0,byTask:{}};}
  }
  function recordUsage(task,usage){
    const s=readUsage();
    s.requests=(s.requests||0)+1;
    s.input_tokens=(s.input_tokens||0)+(usage?.input_tokens||0);
    s.output_tokens=(s.output_tokens||0)+(usage?.output_tokens||0);
    s.byTask=s.byTask||{};s.byTask[task]=(s.byTask[task]||0)+1;
    try{localStorage.setItem('ddOpenAIUsage',JSON.stringify(s));}catch(_e){}
    updateHubUsage();
  }

  function friendlyError(error){
    if(error==='openai_not_configured')return 'La conexión está preparada, pero falta activar la clave segura de OpenAI en el servidor.';
    if(error==='openai_timeout')return 'OpenAI tardó demasiado. Puedes volver a intentarlo.';
    if(error==='openai_request_failed')return 'OpenAI no pudo responder en este momento. Intenta nuevamente.';
    if(error==='premium_credit_confirmation_required')return 'Debes confirmar el uso del crédito premium.';
    return 'No se pudo completar la generación con IA.';
  }

  async function request(task,prompt,options={}){
    const status=await health();
    if(!status?.configured)throw Object.assign(new Error(friendlyError('openai_not_configured')),{code:'openai_not_configured'});
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),32000);
    try{
      const r=await fetch('/api/ai',{
        method:'POST',
        headers:{'Content-Type':'application/json','Accept':'application/json'},
        body:JSON.stringify({
          task,
          prompt:String(prompt||'').slice(0,12000),
          context:safeContext(options.context),
          quality:options.quality||'auto'
        }),
        signal:controller.signal
      });
      const data=await r.json().catch(()=>({ok:false,error:'invalid_response'}));
      if(!r.ok||!data.ok)throw Object.assign(new Error(friendlyError(data.error)),{code:data.error,status:r.status,retryable:data.retryable});
      recordUsage(task,data.usage);
      return data;
    }finally{clearTimeout(timeout);}
  }

  function setBusy(button,busy,label='Trabajando con IA…'){
    if(!button)return;
    if(busy){
      button.dataset.ddOriginal=button.textContent;
      button.disabled=true;button.textContent=label;
    }else{
      button.disabled=false;button.textContent=button.dataset.ddOriginal||button.textContent;
      delete button.dataset.ddOriginal;
    }
  }

  function planningPrompt(){
    const title=$('unitTitle')?.value.trim()||'';
    const brief=$('unitSituation')?.value.trim()||'';
    const type=$('unitType')?.value||'Unidad de aprendizaje';
    return `Necesito mejorar una ${type}. Tema o título escrito: "${title||'sin título'}". Idea/contexto del docente: "${brief||'sin contexto adicional'}". Respeta el nivel, edades/grados, áreas y contexto institucional que recibe la aplicación.`;
  }

  async function improveTitles(button){
    setBusy(button,true);
    const box=$('unitTitleSuggestions');
    try{
      const r=await request('title_options',planningPrompt(),{quality:'auto'});
      const options=(r.data?.options||[]).filter(Boolean).slice(0,3);
      if(!options.length&&r.data?.result)options.push(r.data.result);
      if(!options.length)throw new Error('La IA no devolvió títulos.');
      box.innerHTML='<small>Propuestas de IA: elige una o edítala.</small>'+options.map((x,i)=>`<button type="button" class="dd-title-option" data-dd-ai-title="${encodeURIComponent(x)}"><b>${i+1}.</b> ${esc(x)}</button>`).join('');
      box.querySelectorAll('[data-dd-ai-title]').forEach(b=>b.addEventListener('click',()=>{
        const value=decodeURIComponent(b.dataset.ddAiTitle);$('unitTitle').value=value;$('unitTitle').dataset.autoTitle='false';
      }));
    }catch(e){
      box.innerHTML=`<div class="notice">${esc(e.message)}</div>`;
    }finally{setBusy(button,false);}
  }

  async function improveSituation(button){
    setBusy(button,true);
    const host=$('ddUnitAiResult');
    try{
      const r=await request('significant_situation',planningPrompt(),{quality:'high'});
      const text=r.data?.result||'';
      if(!text)throw new Error('La IA no devolvió una situación.');
      host.innerHTML=`<div class="notice"><b>Situación propuesta por IA</b><p>${esc(text)}</p><button type="button" class="btn alt" id="ddUseAiSituation">Usar y seguir editando</button></div>`;
      $('ddUseAiSituation').onclick=()=>{$('unitSituation').value=text;$('unitSituation').dispatchEvent(new Event('input',{bubbles:true}));host.innerHTML='';};
    }catch(e){host.innerHTML=`<div class="notice">${esc(e.message)}</div>`;}
    finally{setBusy(button,false);}
  }

  async function materialWithAI(button){
    setBusy(button,true);
    const host=$('materialOutput');
    try{
      const prompt=[
        'Crea el contenido base del material solicitado.',
        'Tipo: '+($('materialType')?.value||'material educativo')+'.',
        'Tema: '+($('materialTopic')?.value||'usar la planificación actual')+'.',
        'Indicación docente: '+($('materialInstruction')?.value||'ninguna')+'.',
        $('materialSourceText')?.value?'Transforma y conserva las ideas importantes del texto base proporcionado por el docente.':''
      ].join(' ');
      const r=await request('material',prompt,{quality:'auto'});
      const text=r.data?.result||'';
      if(!text)throw new Error('La IA no devolvió contenido.');
      $('materialSourceText').value=text;
      window.DDMaterials?.create();
      const note=document.createElement('div');note.className='success';note.innerHTML='<b>Contenido base generado con IA.</b> Puedes editarlo antes de imprimir o exportar.';
      host?.prepend(note);
    }catch(e){
      if(host){host.classList.remove('hidden');host.innerHTML=`<div class="notice">${esc(e.message)}</div>`;}
    }finally{setBusy(button,false);}
  }

  async function contextualChat(button){
    const input=$('ddAiChatInput'),out=$('ddAiChatResult');
    const q=input?.value.trim()||'';
    if(!q)return;
    setBusy(button,true,'Consultando…');
    try{
      const r=await request('contextual_help',q,{quality:'auto'});
      out.innerHTML=`<div class="dd-ai-answer"><b>Asistente DocenteDigital</b><p>${esc(r.data?.result||'')}</p></div>`;
    }catch(e){out.innerHTML=`<div class="notice">${esc(e.message)}</div>`;}
    finally{setBusy(button,false);}
  }

  async function directorDraft(button){
    setBusy(button,true);
    const result=$('ddAiDirectorResult');
    try{
      const type=$('ddDirType')?.value||$('ddPlanType')?.value||'Documento';
      const subject=$('ddDirSubject')?.value||$('ddPlanNeed')?.value||'';
      const context=$('ddDirContext')?.value||$('ddPlanEvidence')?.value||'';
      const main=$('ddDirMain')?.value||'';
      const r=await request('director_document',`Tipo: ${type}. Asunto/necesidad: ${subject}. Contexto/evidencia: ${context}. Idea principal: ${main}. Redacta un borrador prudente sin inventar normativa.`,{quality:'high'});
      const text=r.data?.result||'';
      if($('ddDirMain'))$('ddDirMain').value=text;
      else if($('ddPlanNeed'))$('ddPlanNeed').value=text;
      if(result)result.textContent='Borrador IA insertado. Revísalo antes de generar el documento.';
    }catch(e){if(result)result.textContent=e.message;}
    finally{setBusy(button,false);}
  }

  async function generatePremiumImage(){
    const status=await health();
    if(!status?.configured){alert(friendlyError('openai_not_configured'));return;}
    const s=appState(),last=s.lastSession||{};
    const prompt=[
      'Crea una imagen educativa para '+(s.level||'educación')+'.',
      'Tema: '+(last.title||$('materialTopic')?.value||'aprendizaje escolar')+'.',
      'Área: '+(last.area||$('materialArea')?.value||'').'.',
      'Debe ser pedagógicamente clara, visualmente limpia y lista para material escolar.',
      s.level==='Inicial'?'Si es una ficha para Inicial, usa referencias solo como inspiración; varía la composición y prioriza una actividad visual concreta.':'Ajusta la complejidad al nivel.',
      'No incluyas nombres ni datos personales de estudiantes.'
    ].join(' ');
    try{
      const r=await fetch('/api/image',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt,confirmedCredit:true,size:'1024x1536',quality:'medium'})});
      const data=await r.json();
      if(!r.ok||!data.ok)throw new Error(friendlyError(data.error));
      const src=data.image_base64?'data:image/png;base64,'+data.image_base64:data.image_url;
      if(!src)throw new Error('La imagen no llegó correctamente.');
      const panel=document.createElement('div');panel.className='dd-panel';panel.innerHTML=`<span class="pill">Imagen nueva</span><h3>Generada con IA</h3><img src="${src}" alt="Imagen educativa generada" style="max-width:100%;max-height:520px;object-fit:contain;border-radius:12px"><div class="actions topgap"><button class="btn alt" type="button" id="ddUseGeneratedImage">Usar en esta sesión</button></div>`;
      const target=$('ddSessionSuggestions')||$('materialOutput')||$('aihub');target?.prepend(panel);
      $('ddUseGeneratedImage')?.addEventListener('click',()=>{
        try{localStorage.setItem('docenteDigitalGeneratedImage',JSON.stringify({src,title:last.title||'Imagen educativa',selectedAt:new Date().toISOString()}));}catch(_e){}
        alert('Imagen guardada para la sesión actual.');
      });
    }catch(e){alert(e.message);}
  }

  function updateHubUsage(){
    const el=$('ddAiUsage');
    if(!el)return;
    const u=readUsage();
    el.textContent=`${u.requests||0} solicitudes · ${u.input_tokens||0} tokens de entrada · ${u.output_tokens||0} tokens de salida`;
  }

  async function renderHubStatus(){
    const card=$('ddAiConnectedCard');if(!card)return;
    const s=await health(true);
    card.innerHTML=s.configured
      ? '<div class="success"><b>IA DocenteDigital conectada</b><br>Las solicitudes se procesan en servidor; la clave de OpenAI no se expone en el navegador.</div>'
      : '<div class="notice"><b>Conexión preparada.</b><br>Falta activar OPENAI_API_KEY en el servidor de DocenteDigital.</div>';
  }

  function installHub(){
    const hub=$('aihub');if(!hub||$('ddAiConnectedCard'))return;
    const cards=hub.querySelectorAll('.dd-two .card');
    const card=cards[1];if(!card)return;
    card.innerHTML=`
      <h2>🤖 Asistente DocenteDigital</h2>
      <div id="ddAiConnectedCard"></div>
      <label class="full topgap">Consulta usando tu contexto de DocenteDigital
        <textarea id="ddAiChatInput" placeholder="Ej.: mejora el título de mi proyecto o dame una idea para trabajar el tema actual."></textarea>
      </label>
      <div class="actions"><button class="btn" type="button" id="ddAiChatSend">Preguntar aquí</button><button class="btn ghost" type="button" id="ddAiRetryStatus">Revisar conexión</button></div>
      <div id="ddAiChatResult" class="topgap"></div>
      <small id="ddAiUsage"></small>`;
    $('ddAiChatSend').onclick=e=>contextualChat(e.currentTarget);
    $('ddAiRetryStatus').onclick=renderHubStatus;
    renderHubStatus();updateHubUsage();
  }

  function installPlanning(){
    const holder=$('unitTitleSuggestions');if(!holder||$('ddUnitAiActions'))return;
    const actions=document.createElement('div');actions.id='ddUnitAiActions';actions.className='actions topgap';
    actions.innerHTML='<button type="button" class="btn alt" id="ddAiTitles">✨ 3 títulos con IA</button><button type="button" class="btn ghost" id="ddAiSituation">✨ Situación significativa con IA</button>';
    holder.insertAdjacentElement('afterend',actions);
    const result=document.createElement('div');result.id='ddUnitAiResult';actions.insertAdjacentElement('afterend',result);
    $('ddAiTitles').onclick=e=>improveTitles(e.currentTarget);
    $('ddAiSituation').onclick=e=>improveSituation(e.currentTarget);
  }

  function installMaterials(){
    const screen=$('materials');if(!screen||$('ddAiMaterial'))return;
    const anchor=[...screen.querySelectorAll('.actions')].find(x=>x.querySelector('[onclick*="DDMaterials"]'));if(!anchor)return;
    const b=document.createElement('button');b.id='ddAiMaterial';b.type='button';b.className='btn';b.textContent='✨ Crear/mejorar con IA';
    b.onclick=e=>materialWithAI(e.currentTarget);anchor.appendChild(b);
  }

  function installDirector(){
    const panel=$('directorPanel');if(!panel)return;
    const observer=new MutationObserver(()=>{
      if(($('ddDirMain')||$('ddPlanNeed'))&&!$('ddAiDirector')){
        const b=document.createElement('button');b.id='ddAiDirector';b.type='button';b.className='btn alt';b.textContent='✨ Redactar borrador con IA';
        const actions=panel.querySelector('.actions');actions?.prepend(b);
        const note=document.createElement('small');note.id='ddAiDirectorResult';actions?.insertAdjacentElement('afterend',note);
        b.onclick=e=>directorDraft(e.currentTarget);
      }
    });
    observer.observe(panel,{childList:true,subtree:true});
  }

  function boot(){
    installHub();installPlanning();installMaterials();installDirector();
    const observer=new MutationObserver(()=>{installHub();installPlanning();installMaterials();});
    observer.observe(document.body,{childList:true,subtree:true});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();

  window.DDOpenAI={health,request,safeContext,improveTitles,improveSituation,materialWithAI,contextualChat,directorDraft,generatePremiumImage,readUsage,renderHubStatus};
})();