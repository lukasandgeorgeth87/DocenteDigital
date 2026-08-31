/* DocenteDigital – Archivo simple de planificación v56
   Auditoría de simplicidad aplicada a unidades/proyectos guardados.
   Regla: crear y consultar lo ya creado son momentos distintos.

   Modo Fácil:
   - el archivo se mueve al final de Mi planificación;
   - permanece cerrado por defecto;
   - muestra solo cantidad + botón Ver archivo;
   - cada registro se resume a título + datos esenciales;
   - acciones frecuentes: Abrir y Crear sesiones;
   - Word/Eliminar quedan en “Más”.

   Modo Experto conserva acceso al mismo archivo, sin perder datos.
*/
(function(){
  if(window.__ddPlanningArchiveSimplicityV56)return;window.__ddPlanningArchiveSimplicityV56=true;
  if(typeof state!=='object')return;
  const tidy=v=>String(v??'').replace(/\s+/g,' ').trim();
  const esc=v=>typeof window.escapeHtml==='function'?window.escapeHtml(String(v??'')):String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const easy=()=>state.mode!=='expert';

  function unitBriefSafe(u){
    try{return typeof window.unitBrief==='function'?window.unitBrief(u):tidy(u?.situationBrief||u?.situation||'');}catch(e){return tidy(u?.situationBrief||u?.situation||'');}
  }

  function archiveHost(){return document.getElementById('unitsLibrary');}
  function archiveList(){return document.getElementById('unitsList');}

  function moveArchiveToEnd(){
    const plan=document.getElementById('plan'),host=archiveHost();if(!plan||!host)return;
    if(plan.lastElementChild!==host)plan.appendChild(host);
  }

  function ensureShell(){
    const host=archiveHost();if(!host)return;
    host.classList.add('dd-planning-archive');
    let head=host.querySelector('.dd-archive-head');
    if(!head){
      head=document.createElement('div');head.className='dd-archive-head';
      const oldH=host.querySelector(':scope > h2'),oldP=host.querySelector(':scope > p.sub');
      if(oldH)oldH.remove();if(oldP)oldP.remove();
      host.prepend(head);
    }
    if(!host.dataset.ddArchiveInit){host.dataset.ddArchiveInit='1';host.dataset.open='false';}
    renderHead();
  }

  function renderHead(){
    const host=archiveHost(),head=host?.querySelector('.dd-archive-head');if(!host||!head)return;
    const count=Array.isArray(state.units)?state.units.length:0;
    const open=host.dataset.open==='true';
    head.innerHTML=`<div class="dd-archive-title"><span class="dd-archive-icon">📁</span><div><b>Mis unidades y proyectos</b><small>${count?`${count} guardado${count===1?'':'s'}`:'Aún no hay documentos guardados'}</small></div></div>${count?`<button type="button" class="btn ghost dd-archive-toggle">${open?'Cerrar':'Ver archivo'}</button>`:''}`;
    const b=head.querySelector('.dd-archive-toggle');if(b)b.onclick=()=>{host.dataset.open=open?'false':'true';renderHead();applyVisibility();};
  }

  function compactRender(){
    const wrap=archiveList();if(!wrap)return;
    const units=Array.isArray(state.units)?state.units:[];
    if(!units.length){wrap.innerHTML='';renderHead();return;}
    if(!easy()){
      // En Experto se conserva una ficha más informativa, sin volver al bloque gigante.
      wrap.innerHTML=units.map(u=>`<article class="dd-archive-item dd-archive-item-expert"><div class="dd-archive-main"><span class="pill">${esc(u.type||'Planificación')}</span><h3>${esc(u.title||'Sin título')}</h3><p>${esc(u.level||'')} · ${esc(u.ieType||'')} · ${esc((u.grades||[]).join(', '))} · ${esc(u.duration||'')}</p><small>${esc(unitBriefSafe(u))}</small></div><div class="dd-archive-actions"><button class="btn alt" onclick="viewUnit('${esc(u.id)}')">Abrir</button><button class="btn" onclick="useUnit('${esc(u.id)}')">Crear sesiones</button><button class="btn ghost" onclick="downloadUnitWord('${esc(u.id)}')">Word</button><button class="btn ghost" onclick="deleteUnit('${esc(u.id)}')">Eliminar</button></div></article>`).join('');
    }else{
      wrap.innerHTML=units.map(u=>`<article class="dd-archive-item"><div class="dd-archive-main"><span class="pill">${/proyecto/i.test(u.type||'')?'Proyecto':'Unidad'}</span><h3 title="${esc(u.title||'')}">${esc(u.title||'Sin título')}</h3><p>${esc((u.grades||[]).join(', '))}${u.duration?` · ${esc(u.duration)}`:''}</p></div><div class="dd-archive-actions"><button class="btn alt" onclick="viewUnit('${esc(u.id)}')">Abrir</button><button class="btn" onclick="useUnit('${esc(u.id)}')">Crear sesiones</button><details class="dd-archive-more"><summary aria-label="Más opciones">Más</summary><div><button type="button" onclick="downloadUnitWord('${esc(u.id)}')">Descargar Word</button><button type="button" class="danger" onclick="deleteUnit('${esc(u.id)}')">Eliminar</button></div></details></div></article>`).join('');
    }
    renderHead();applyVisibility();
  }

  function applyVisibility(){
    const host=archiveHost(),wrap=archiveList();if(!host||!wrap)return;
    if(easy()){
      const count=(state.units||[]).length;
      host.classList.toggle('dd-archive-empty',count===0);
      wrap.hidden=host.dataset.open!=='true'||count===0;
    }else wrap.hidden=false;
  }

  function apply(){moveArchiveToEnd();ensureShell();compactRender();applyVisibility();}

  const baseRender=window.renderUnits;
  if(typeof baseRender==='function')window.renderUnits=function(){
    // No dibujamos las tarjetas legadas porque inmediatamente se sustituyen por el archivo compacto.
    const r=baseRender.apply(this,arguments);setTimeout(compactRender,0);return r;
  };
  const baseGo=window.go;
  if(typeof baseGo==='function')window.go=function(id){const r=baseGo.apply(this,arguments);if(id==='plan')setTimeout(apply,0);return r;};
  const baseSetMode=window.setMode;
  if(typeof baseSetMode==='function')window.setMode=function(mode){const r=baseSetMode.apply(this,arguments);setTimeout(apply,0);return r;};

  // Si una unidad se crea/elimina mientras el usuario está en planificación, actualiza el contador sin abrir el archivo.
  const observer=new MutationObserver(()=>{
    if(!document.getElementById('plan')?.classList.contains('active'))return;
    clearTimeout(observer._t);observer._t=setTimeout(()=>{moveArchiveToEnd();ensureShell();applyVisibility();},30);
  });
  observer.observe(document.body,{childList:true,subtree:true});

  const simplicityTest={
    id:'AUD-USO-011',area:'Simplicidad',severity:'S2',name:'Archivo separado del flujo de creación',
    run(){
      const host=archiveHost(),plan=document.getElementById('plan'),list=archiveList();
      const count=(state.units||[]).length;
      const closed=easy()?list?.hidden===true||count===0:true;
      const atEnd=!!host&&!!plan&&plan.lastElementChild===host;
      const passed=!!host&&atEnd&&closed;
      return {id:this.id,area:this.area,severity:this.severity,passed,status:'EJECUTADA',expected:'Unidades guardadas al final y archivo cerrado en Modo Fácil',obtained:passed?'Archivo separado y compacto':'El archivo todavía interfiere con el flujo de creación',evidence:{count,closed,atEnd},action:'Mantener creación y consulta de documentos guardados en momentos separados',executedAt:new Date().toISOString()};
    }
  };
  function attachAudit(){const base=window.ddExecutableAudit;if(!base||!Array.isArray(base.tests))return false;if(!base.tests.some(t=>t.id===simplicityTest.id))base.tests.push(simplicityTest);return true;}
  let tries=0;const timer=setInterval(()=>{tries++;if(attachAudit()||tries>20)clearInterval(timer);},100);

  const css=document.createElement('style');css.textContent=`
    #plan .dd-planning-archive{padding:0!important;overflow:visible;border:1px solid #dce7e1;background:#fff}
    #plan .dd-archive-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:13px 15px}
    #plan .dd-archive-title{display:flex;align-items:center;gap:10px;min-width:0}
    #plan .dd-archive-icon{font-size:22px}
    #plan .dd-archive-title>div{display:grid;gap:2px;min-width:0}
    #plan .dd-archive-title b{font-size:15px;color:#173b52}
    #plan .dd-archive-title small{font-size:12px;color:#718077}
    #plan #unitsList{border-top:1px solid #e7eeea;padding:10px 12px}
    #plan .dd-archive-item{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:11px 4px;border-bottom:1px solid #edf2ef}
    #plan .dd-archive-item:last-child{border-bottom:0}
    #plan .dd-archive-main{min-width:0;flex:1}
    #plan .dd-archive-main h3{font-size:15px;margin:5px 0 3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#173b52}
    #plan .dd-archive-main p{font-size:12px;margin:0;color:#6b7b73}
    #plan .dd-archive-main small{display:block;margin-top:4px;color:#78857e;max-width:720px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    #plan .dd-archive-actions{display:flex;align-items:center;gap:7px;flex-wrap:wrap;justify-content:flex-end}
    #plan .dd-archive-actions .btn{padding:8px 10px;min-height:38px}
    #plan .dd-archive-more{position:relative}
    #plan .dd-archive-more summary{list-style:none;cursor:pointer;border:1px solid #d7e1dc;border-radius:9px;padding:8px 10px;font-weight:800;color:#315447;background:#fff}
    #plan .dd-archive-more summary::-webkit-details-marker{display:none}
    #plan .dd-archive-more>div{position:absolute;right:0;top:42px;z-index:20;min-width:165px;padding:6px;background:#fff;border:1px solid #dce5e0;border-radius:10px;box-shadow:0 10px 24px rgba(0,0,0,.12)}
    #plan .dd-archive-more button{display:block;width:100%;border:0;background:#fff;text-align:left;padding:9px;border-radius:7px;cursor:pointer;font-weight:700;color:#294b3e}
    #plan .dd-archive-more button:hover{background:#f2f7f4}
    #plan .dd-archive-more .danger{color:#9b2c2c}
    body:not(.expert) #plan .dd-archive-empty{display:none}
    @media(max-width:720px){
      #plan .dd-archive-item{align-items:flex-start;flex-direction:column}
      #plan .dd-archive-actions{width:100%;justify-content:flex-start}
      #plan .dd-archive-actions .btn{flex:1}
      #plan .dd-archive-main{width:100%}
    }
  `;document.head.appendChild(css);

  setTimeout(apply,0);
  window.ddPlanningArchiveSimplicityV56={apply,test:()=>simplicityTest.run()};
})();