/* DocenteDigital — Biblioteca local de documentos con historial recuperable.
   Almacena copias en IndexedDB, sin llamadas a servidores y sin modificar las fuentes. */
(function(root){
  'use strict';
  if(root.DDDocumentLibrary)return;
  const DB='dd-documents-v1', STORE='documents', MAX_VERSIONS=8;
  let connection=null,debounce=null,pending=Promise.resolve();
  const $=id=>document.getElementById(id);
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const copy=value=>JSON.parse(JSON.stringify(value));
  function database(){
    if(!root.indexedDB)return Promise.reject(new Error('Este navegador no permite guardar versiones en IndexedDB.'));
    if(connection)return connection;
    connection=new Promise((resolve,reject)=>{
      const request=indexedDB.open(DB,1);
      request.onupgradeneeded=()=>request.result.createObjectStore(STORE,{keyPath:'key'});
      request.onsuccess=()=>resolve(request.result);
      request.onerror=()=>reject(request.error||new Error('No se pudo abrir la biblioteca.'));
      request.onblocked=()=>reject(new Error('Cierra otras pestañas de Docente Digital para acceder a tus versiones.'));
    }).catch(error=>{connection=null;throw error;});
    return connection;
  }
  async function readAll(){
    const db=await database();
    return new Promise((resolve,reject)=>{
      const req=db.transaction(STORE,'readonly').objectStore(STORE).getAll();
      req.onsuccess=()=>resolve(req.result||[]);
      req.onerror=()=>reject(req.error||new Error('No se pudo leer el historial.'));
    });
  }
  async function read(key){
    const db=await database();
    return new Promise((resolve,reject)=>{
      const req=db.transaction(STORE,'readonly').objectStore(STORE).get(key);
      req.onsuccess=()=>resolve(req.result||null);
      req.onerror=()=>reject(req.error||new Error('No se pudo abrir el documento.'));
    });
  }
  function sources(){
    const docs=[];
    function add(kind,source){
      if(!source||!source.id)return;
      const title=kind==='anual'?'Programación anual '+(source.year||''):kind==='unidad'?source.title:kind==='sesion'?source.title:
        kind==='material'?source.topic:kind==='rubrica'?'Rúbrica · '+(source.area||'')+' · '+(source.grade||''):
        'Instrumento · '+(source.area||'')+' · '+(source.grade||'');
      docs.push({key:kind+':'+source.id,kind,sourceId:String(source.id),title:String(title||'Sin título'),unitId:String(source.unitId||''),payload:copy(source)});
    }
    (Array.isArray(state.units)?state.units:[]).forEach(u=>add('unidad',u));
    (Array.isArray(state.annualPlans)?state.annualPlans:[]).forEach(p=>add('anual',p));
    (Array.isArray(state.sessions)?state.sessions:[]).forEach(s=>add('sesion',s));
    if(state.lastSession&&!docs.some(d=>d.key==='sesion:'+state.lastSession.id))add('sesion',state.lastSession);
    (Array.isArray(state.materials)?state.materials:[]).forEach(m=>add('material',m));
    (Array.isArray(state.generatedAssessments)?state.generatedAssessments:[]).forEach(a=>add('instrumento',a));
    if(state.lastRubric)add('rubrica',state.lastRubric);
    return docs;
  }
  async function capture(doc){
    const db=await database();
    return new Promise((resolve,reject)=>{
      const tx=db.transaction(STORE,'readwrite'),store=tx.objectStore(STORE);
      tx.oncomplete=()=>resolve();
      tx.onerror=()=>reject(tx.error||new Error('No se pudo conservar una versión.'));
      const request=store.get(doc.key);
      request.onsuccess=()=>{
        const existing=request.result||{key:doc.key,kind:doc.kind,sourceId:doc.sourceId,createdAt:new Date().toISOString(),versions:[]};
        const content=JSON.stringify(doc.payload);
        const last=existing.versions[existing.versions.length-1];
        if(last&&JSON.stringify(last.payload)===content)return;
        const at=new Date().toISOString();
        existing.title=doc.title;existing.unitId=doc.unitId;existing.updatedAt=at;
        existing.versions.push({number:(last?.number||0)+1,at,payload:doc.payload});
        existing.versions=existing.versions.slice(-MAX_VERSIONS);
        store.put(existing);
      };
    });
  }
  function synchronize(){
    const snapshot=sources();
    pending=pending.catch(()=>{}).then(async()=>{for(const doc of snapshot)await capture(doc);});
    return pending;
  }
  function onStateSaved(){
    clearTimeout(debounce);
    debounce=setTimeout(()=>{synchronize().catch(error=>{root.__ddDocumentLibraryError=String(error);console.warn('Historial no disponible:',error);});},650);
  }
  function target(){return $('documentsList');}
  function message(text){const box=$('documentsMessage');if(box){box.textContent=text;box.classList.remove('hidden');}}
  function human(kind){return ({anual:'Programación anual',unidad:'Unidad / proyecto',sesion:'Sesión',material:'Material',instrumento:'Instrumento',rubrica:'Rúbrica'})[kind]||kind;}
  function datestring(value){const date=new Date(value);return Number.isNaN(date.getTime())?'Fecha no disponible':date.toLocaleString('es-PE');}
  async function open(){
    const box=target();if(!box)return;
    box.innerHTML='<p>Recuperando documentos guardados…</p>';
    try{
      await synchronize();
      const docs=(await readAll()).sort((a,b)=>String(b.updatedAt||'').localeCompare(String(a.updatedAt||'')));
      if(!docs.length){box.innerHTML='<div class="notice">Aún no tienes documentos. Crea una unidad para comenzar.</div>';return;}
      box.innerHTML=docs.map(d=>'<article class="document topgap" data-doc="'+esc(d.key)+'"><span class="pill">'+esc(human(d.kind))+'</span><h3>'+esc(d.title)+'</h3><p class="sub">'+d.versions.length+' versiones conservadas · '+esc(datestring(d.updatedAt))+'</p><div class="actions"><button class="btn alt" data-action="open">Abrir</button><button class="btn ghost" data-action="history">Versiones</button><button class="btn ghost" data-action="duplicate">Duplicar</button><button class="btn ghost" data-action="word">⬇ Word</button></div></article>').join('');
    }catch(error){message('No fue posible leer el historial de versiones: '+error.message);box.innerHTML='<div class="notice">Los documentos activos siguen en sus módulos. Comprueba que el navegador permite guardar datos.</div>';}
  }
  async function selected(key,number){
    const doc=await read(key);
    if(!doc)throw new Error('El documento no se encuentra en esta biblioteca.');
    const version=number==null?doc.versions[doc.versions.length-1]:doc.versions.find(v=>v.number===number);
    if(!version)throw new Error('La versión seleccionada no existe.');
    return {doc,version,payload:copy(version.payload)};
  }
  function assign(kind,payload){
    if(kind==='anual'){
      state.annualPlans=Array.isArray(state.annualPlans)?state.annualPlans:[];
      const index=state.annualPlans.findIndex(x=>x.id===payload.id);
      if(index<0)state.annualPlans.unshift(payload);else state.annualPlans[index]=payload;
      state.lastAnnualPlan=payload;
    }else if(kind==='unidad'){
      const index=state.units.findIndex(x=>x.id===payload.id);
      if(index<0)state.units.unshift(payload);else state.units[index]=payload;
      state.activeUnitId=payload.id;
    }else if(kind==='sesion'){
      state.lastSession=payload;
      state.sessions=Array.isArray(state.sessions)?state.sessions:[];
      const index=state.sessions.findIndex(x=>x.id===payload.id);
      if(index<0)state.sessions.unshift(payload);else state.sessions[index]=payload;
      if(state.units.some(x=>x.id===payload.unitId))state.activeUnitId=payload.unitId;
    }else if(kind==='material'){
      state.materials=Array.isArray(state.materials)?state.materials:[];
      const index=state.materials.findIndex(x=>x.id===payload.id);
      if(index<0)state.materials.unshift(payload);else state.materials[index]=payload;
      state.lastMaterial=payload;
    }else if(kind==='instrumento'){
      state.generatedAssessments=Array.isArray(state.generatedAssessments)?state.generatedAssessments:[];
      const index=state.generatedAssessments.findIndex(x=>x.id===payload.id);
      if(index<0)state.generatedAssessments.unshift(payload);else state.generatedAssessments[index]=payload;
      state.lastAssessment=payload;
      if(state.units.some(x=>x.id===payload.unitId))state.activeUnitId=payload.unitId;
    }else if(kind==='rubrica'){
      state.lastRubric=payload;
      if(state.units.some(x=>x.id===payload.unitId))state.activeUnitId=payload.unitId;
    }
    if(!save())throw new Error('No se pudo guardar el documento recuperado. Libera espacio o descarga un respaldo.');
  }
  function show(kind,payload){
    if(kind==='anual'){go('annual');root.DDAnnualPlanning?.open?.();}
    else if(kind==='unidad'){go('plan');renderUnits();fillSessionUnits();viewUnit(payload.id);}
    else if(kind==='sesion'){go('session');renderSessionOutput(payload);}
    else if(kind==='material'){go('materials');root.DDMaterials?.renderHistory?.();root.DDMaterials?.reopen?.(payload.id);}
    else if(kind==='instrumento'){go('evaluation');root.DDEvaluation?.openSavedAssessment?.();}
    else if(kind==='rubrica'){go('evaluation');root.DDEvaluation?.openSavedRubric?.();}
  }
  async function restore(key,number,duplicate=false){
    const {doc,payload}=await selected(key,number);
    if(duplicate){
      payload.id=doc.kind[0]+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
      if(doc.kind==='unidad')payload.title=(payload.title||'Unidad')+' (copia)';
      if(doc.kind==='material')payload.topic=(payload.topic||'Material')+' (copia)';
      payload.createdAt=new Date().toISOString();
    }else if(!confirm('¿Restaurar esta versión de “'+doc.title+'”? Se conservarán las versiones anteriores.'))return;
    assign(doc.kind,payload);
    await synchronize();
    show(doc.kind,payload);
  }
  async function download(key,number){
    const {doc,payload}=await selected(key,number);
    if(!root.DDWordExport?.downloadHtml)throw new Error('El exportador Word no está disponible.');
    let html='';
    if(doc.kind==='anual'){
      html=root.DDAnnualPlanning?.printHtml?.(payload)||'';
    }else if(doc.kind==='unidad'){
      if(typeof unitWordHtml!=='function')throw new Error('El generador Word de unidades no está disponible.');
      html=unitWordHtml(payload);
    }else if(doc.kind==='sesion'){
      if(typeof sessionHtml!=='function')throw new Error('El generador Word de sesiones no está disponible.');
      html=sessionHtml(payload,true);
    }else if(doc.kind==='material')html=root.DDMaterials?.materialWordHtml?.(payload)||String(payload.html||'').replace(/<div class="actions[\s\S]*$/,'');
    else html=payload.html||'';
    if(!html)throw new Error('Esta versión no contiene un documento exportable.');
    root.DDWordExport.downloadHtml(doc.title,html,doc.kind==='anual'||doc.kind==='unidad'||doc.kind==='rubrica','Documento_'+doc.title+'_v'+(number||'actual'));
  }
  async function history(key){
    const doc=await read(key),box=$('documentsHistory');if(!doc||!box)return;
    box.classList.remove('hidden');
    box.innerHTML='<h2>Versiones · '+esc(doc.title)+'</h2>'+doc.versions.slice().reverse().map(v=>'<div class="document topgap" data-doc="'+esc(key)+'" data-version="'+v.number+'"><b>Versión '+v.number+'</b> · '+esc(datestring(v.at))+'<div class="actions"><button class="btn alt" data-action="restore">Restaurar</button><button class="btn ghost" data-action="wordVersion">⬇ Word</button></div></div>').join('');
    box.scrollIntoView({behavior:'auto',block:'start'});
  }
  function onClick(event){
    const button=event.target.closest('[data-action]'),article=button?.closest('[data-doc]');
    if(!article)return;
    const key=article.dataset.doc,version=article.dataset.version?Number(article.dataset.version):null;
    const action=button.dataset.action;
    const job=action==='history'?history(key):action==='restore'?restore(key,version):action==='duplicate'?restore(key,null,true):action==='word'||action==='wordVersion'?download(key,version):selected(key).then(({doc,payload})=>{assign(doc.kind,payload);show(doc.kind,payload);});
    Promise.resolve(job).catch(error=>{console.warn('Biblioteca:',error);message(error.message||'No se pudo completar la acción.');});
  }
  root.DDDocumentLibrary={open,onStateSaved,synchronize,readAll,read};
  if(target()){
    target().addEventListener('click',onClick);
    $('documentsHistory')?.addEventListener('click',onClick);
  }
  // Conserva documentos anteriores aun si el usuario todavía no abrió esta pantalla.
  onStateSaved();
})(window);
