/* DocenteDigital – selección múltiple y persistente de recursos del aula */
(function(){
  const E=v=>escapeHtml(v);
  const OPTIONS=[
    {id:'pizarra',label:'Pizarra',icon:'🖍️'},
    {id:'tv',label:'TV',icon:'📺'},
    {id:'impresora',label:'Impresora',icon:'🖨️'},
    {id:'laptop',label:'Laptop / computadora',icon:'💻'},
    {id:'proyector',label:'Cañón / proyector',icon:'📽️'},
    {id:'tabletas',label:'Tabletas',icon:'📱'},
    {id:'celulares',label:'Celulares',icon:'📲'},
    {id:'internet',label:'Internet',icon:'🌐'},
    {id:'parlantes',label:'Parlantes',icon:'🔊'},
    {id:'biblioteca',label:'Biblioteca / libros',icon:'📚'},
    {id:'materiales',label:'Materiales concretos',icon:'🧩'},
    {id:'papelotes',label:'Papelotes / cartulinas',icon:'🗒️'},
    {id:'patio',label:'Patio / espacios abiertos',icon:'🌿'},
    {id:'laboratorio',label:'Laboratorio / kit de ciencia',icon:'🔬'}
  ];

  if(!Array.isArray(state.classroomResources)) state.classroomResources=['Pizarra','Materiales concretos'];
  if(!Array.isArray(state.sessionResourcesSelected)) state.sessionResourcesSelected=[...state.classroomResources];
  save();

  function labelSet(arr){return new Set((arr||[]).map(String));}
  function optionsHtml(selected,scope){
    const set=labelSet(selected);
    return `<div class="dd-resource-grid">${OPTIONS.map(o=>`<label class="dd-resource ${set.has(o.label)?'selected':''}"><input type="checkbox" data-resource-scope="${scope}" value="${E(o.label)}" ${set.has(o.label)?'checked':''}><span class="dd-resource-icon">${o.icon}</span><span>${E(o.label)}</span></label>`).join('')}</div>`;
  }
  function readScope(scope){return [...document.querySelectorAll(`input[data-resource-scope="${scope}"]:checked`)].map(x=>x.value);}
  function wireScope(scope,onChange){
    document.querySelectorAll(`input[data-resource-scope="${scope}"]`).forEach(cb=>cb.addEventListener('change',()=>{
      cb.closest('.dd-resource')?.classList.toggle('selected',cb.checked);onChange(readScope(scope));
    }));
  }
  function selectedText(arr){return arr&&arr.length?arr.join(', '):'Materiales básicos y recursos disponibles en el entorno';}

  function syncLegacySessionValue(){
    const old=byId('sessionResources');if(!old)return;
    const text=selectedText(state.sessionResourcesSelected);
    if(old.tagName==='SELECT'){
      let opt=[...old.options].find(o=>o.value===text);
      if(!opt){opt=document.createElement('option');opt.value=text;opt.textContent=text;old.appendChild(opt);}
      old.value=text;
    }else old.value=text;
  }

  function mountSessionResources(){
    const old=byId('sessionResources');if(!old||byId('ddSessionResourcesMulti'))return;
    state.sessionResourcesSelected=[...state.classroomResources];save();
    const label=old.closest('label');if(!label)return;
    old.style.display='none';
    const wrap=document.createElement('div');wrap.id='ddSessionResourcesMulti';wrap.className='dd-resource-panel';
    wrap.innerHTML=`<div class="dd-resource-title"><b>Recursos disponibles hoy</b><small>Selección múltiple: marca todos los que puedes usar en esta sesión.</small></div>${optionsHtml(state.sessionResourcesSelected,'session')}<div class="dd-resource-summary" id="ddSessionResourceSummary"></div>`;
    label.appendChild(wrap);
    const update=arr=>{state.sessionResourcesSelected=arr;save();syncLegacySessionValue();byId('ddSessionResourceSummary').innerHTML=`<b>Seleccionados:</b> ${E(selectedText(arr))}`;};
    wireScope('session',update);update(state.sessionResourcesSelected);
  }

  function mountSettingsResources(){
    const card=byId('settings')?.querySelector('.card');if(!card||byId('ddClassroomResources'))return;
    const wrap=document.createElement('div');wrap.id='ddClassroomResources';wrap.className='dd-profile-box';
    wrap.innerHTML=`<h2>🧰 Recursos con los que cuenta mi aula</h2><p class="sub">Marca todas las opciones disponibles. Se guardarán y la app las reutilizará en unidades, sesiones y materiales; no tendrás que seleccionarlas nuevamente salvo que cambien.</p>${optionsHtml(state.classroomResources,'classroom')}<div class="dd-resource-summary" id="ddClassroomResourceSummary"></div><label class="topgap">Otro recurso<input id="ddOtherResource" placeholder="Ej.: biohuerto, radio, cámara, instrumentos musicales"></label><button class="btn topgap" id="ddSaveResources">💾 Guardar recursos del aula</button>`;
    const reference=card.querySelector('.dd-profile-box');
    if(reference&&reference.nextSibling)card.insertBefore(wrap,reference.nextSibling);else card.prepend(wrap);
    const update=arr=>{byId('ddClassroomResourceSummary').innerHTML=`<b>Seleccionados:</b> ${E(selectedText(arr))}`;};
    wireScope('classroom',update);update(state.classroomResources);
    byId('ddSaveResources').onclick=()=>{
      const selected=readScope('classroom');const other=byId('ddOtherResource').value.trim();if(other&&!selected.includes(other))selected.push(other);
      state.classroomResources=selected;state.sessionResourcesSelected=[...selected];save();
      byId('ddClassroomResourceSummary').innerHTML=`✓ <b>Guardados:</b> ${E(selectedText(selected))}`;
      alert('Recursos guardados. DocenteDigital los reutilizará automáticamente.');
    };
  }

  // Añade recursos a los documentos sin obligar a usar tecnología.
  const oldBuild=window.buildSession;
  if(typeof oldBuild==='function'){
    window.buildSession=function(){syncLegacySessionValue();const s=oldBuild();s.resourcesList=[...state.sessionResourcesSelected];return s;};
  }

  const oldSessionHtml=window.sessionHtml;
  if(typeof oldSessionHtml==='function'){
    window.sessionHtml=function(session,forWord=false){
      let html=oldSessionHtml(session,forWord);const resources=session.resourcesList?.length?session.resourcesList:state.sessionResourcesSelected;
      const note=`<div class="dd-resource-doc"><b>Recursos realmente disponibles:</b> ${E(selectedText(resources))}. <b>Criterio de uso:</b> la tecnología se emplea solo si mejora el aprendizaje; toda actividad clave debe conservar una alternativa no digital pertinente.</div>`;
      if(html.includes('<h2>6. MOMENTOS DE LA SESIÓN</h2>'))html=html.replace('<h2>6. MOMENTOS DE LA SESIÓN</h2>',note+'<h2>6. MOMENTOS DE LA SESIÓN</h2>');else html+=note;
      return html;
    };
  }

  mountSessionResources();mountSettingsResources();

  const css=document.createElement('style');css.textContent=`
    .dd-resource-panel{margin-top:8px;padding:10px;border:1px solid #dbe4df;border-radius:12px;background:#fbfdfc}.dd-resource-title{display:grid;gap:2px;margin-bottom:8px}.dd-resource-title small{color:#667}.dd-resource-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.dd-resource{display:flex;align-items:center;gap:7px;border:1px solid #d4ddd8;border-radius:12px;padding:9px 10px;background:#fff;cursor:pointer;user-select:none}.dd-resource:hover{background:#f3f8f5}.dd-resource.selected{border-color:#31805e;background:#eaf6ef;box-shadow:0 0 0 1px #31805e inset}.dd-resource input{width:18px;height:18px;accent-color:#287255}.dd-resource-icon{font-size:20px}.dd-resource-summary{margin-top:9px;padding:8px 10px;border-radius:9px;background:#eef5f1}.dd-resource-doc{margin:10px 0;padding:9px;border:1px dashed #71867a;background:#fafcfb}.dd-profile-box{padding-bottom:16px;margin-bottom:16px;border-bottom:1px solid #ddd}@media(max-width:850px){.dd-resource-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:520px){.dd-resource-grid{grid-template-columns:1fr}.dd-resource{min-height:46px}}
  `;document.head.appendChild(css);
})();