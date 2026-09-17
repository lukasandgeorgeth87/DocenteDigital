/* DocenteDigital – autosave local de borrador de Unidad/Proyecto v1
   Guarda solo en este dispositivo mientras el docente escribe.
   No convierte el borrador en una unidad aprobada ni lo envía a servidores.
*/
(function(){
  if(window.__ddBetaDraftAutosaveV1)return;
  window.__ddBetaDraftAutosaveV1=true;
  const KEY='docenteDigitalBetaDraftUnit';
  const MAX_AGE_MS=7*24*60*60*1000;
  let timer=null;

  function read(){
    try{
      const d=JSON.parse(localStorage.getItem(KEY)||'null');
      if(!d||typeof d!=='object')return null;
      if(!d.savedAt||Date.now()-new Date(d.savedAt).getTime()>MAX_AGE_MS){localStorage.removeItem(KEY);return null;}
      return d;
    }catch(_e){return null;}
  }
  function current(){
    return {
      title:(document.getElementById('unitTitle')?.value||'').trim(),
      situation:(document.getElementById('unitSituation')?.value||'').trim(),
      type:document.getElementById('unitType')?.value||'Unidad de aprendizaje',
      duration:document.getElementById('unitDuration')?.value||'3 semanas',
      savedAt:new Date().toISOString()
    };
  }
  function saveDraft(){
    const d=current();
    if(!d.title&&!d.situation){localStorage.removeItem(KEY);return;}
    try{localStorage.setItem(KEY,JSON.stringify(d));updateStatus('Borrador guardado automáticamente.');}
    catch(error){console.warn('DocenteDigital: no se pudo guardar el borrador.',error);}
  }
  function schedule(){clearTimeout(timer);timer=setTimeout(saveDraft,300);}
  function updateStatus(text){
    const el=document.getElementById('ddDraftStatus');if(el)el.textContent=text;
  }
  function ensureNotice(){
    const panel=document.getElementById('unitPanel');if(!panel||document.getElementById('ddDraftNotice'))return;
    const box=document.createElement('div');box.id='ddDraftNotice';box.className='notice topgap';
    box.innerHTML='<b>💾 Borrador local:</b> <span id="ddDraftStatus">Los cambios que escribas aquí se guardarán automáticamente en este dispositivo.</span> <button type="button" class="btn ghost" id="ddDiscardDraft" style="margin-left:8px">Descartar borrador</button>';
    panel.appendChild(box);
    document.getElementById('ddDiscardDraft').onclick=()=>{
      if(!confirm('¿Descartar el borrador local de esta Unidad/Proyecto?'))return;
      localStorage.removeItem(KEY);
      const title=document.getElementById('unitTitle'),situation=document.getElementById('unitSituation');
      if(title)title.value='';if(situation)situation.value='';
      updateStatus('Borrador descartado.');
    };
  }
  function restore(){
    const d=read();if(!d)return false;
    const title=document.getElementById('unitTitle'),situation=document.getElementById('unitSituation'),type=document.getElementById('unitType'),duration=document.getElementById('unitDuration');
    if(!title||!situation)return false;
    const existingTitle=(title.value||'').trim(),existingSituation=(situation.value||'').trim();
    if(existingTitle||existingSituation)return false;
    if(d.title)title.value=d.title;if(d.situation)situation.value=d.situation;
    if(type&&d.type&&[...type.options].some(o=>o.value===d.type||o.textContent===d.type))type.value=d.type;
    if(duration&&d.duration&&[...duration.options].some(o=>o.value===d.duration||o.textContent===d.duration))duration.value=d.duration;
    updateStatus(`Borrador recuperado · ${new Date(d.savedAt).toLocaleString('es-PE')}`);
    return true;
  }
  function attach(){
    ensureNotice();
    ['unitTitle','unitSituation','unitType','unitDuration'].forEach(id=>{
      const el=document.getElementById(id);if(!el||el.dataset.ddDraftBound==='1')return;
      el.dataset.ddDraftBound='1';el.addEventListener('input',schedule);el.addEventListener('change',schedule);
    });
    restore();
  }
  document.addEventListener('click',event=>{
    const build=event.target?.closest?.('#ddBuildUnit');if(!build)return;
    const before=read();
    setTimeout(()=>{
      if(!before)return;
      try{
        const state=JSON.parse(localStorage.getItem('docenteDigitalPrototype')||'{}');
        const saved=Array.isArray(state.units)&&state.units.some(u=>String(u?.situationBrief||'').trim()===String(before.situation||'').trim());
        if(saved){localStorage.removeItem(KEY);updateStatus('Unidad/Proyecto construido; borrador temporal limpiado.');}
      }catch(_e){}
    },500);
  },true);
  function init(){attach();const oldGo=window.go;if(typeof oldGo==='function'&&!oldGo.__ddDraftWrapped){const wrapped=function(id){const r=oldGo.apply(this,arguments);if(id==='plan')setTimeout(attach,0);return r;};wrapped.__ddDraftWrapped=true;window.go=wrapped;}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
  window.ddBetaDraftAutosave={read,saveDraft,restore,clear:()=>localStorage.removeItem(KEY)};
})();