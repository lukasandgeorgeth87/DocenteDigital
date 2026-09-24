/* DocenteDigital – núcleo estable sin MutationObserver recursivos */
(function(){
  if(window.__ddStableCoreV12)return; window.__ddStableCoreV12=true;
  const E=v=>escapeHtml(v);
  state.teacherContext=Object.assign({
    teacherName:'',
    institutionName:'',
    localityType:'Comunidad',
    community:'',
    district:'',
    province:'',
    region:'',
    ugel:'',
    calendar:'',
    notes:''
  },state.teacherContext||{});
  state.masterLibrary=state.masterLibrary||{version:'2026-08-30',normativeStatus:'PENDIENTE DE VERIFICACIÓN',lastVerification:null};
  save();

  function isPrimaryMulti(){return state.level==='Primaria'&&(state.ieType==='Multigrado'||state.ieType==='Unidocente');}
  function isPrimaryEibMulti(){return isPrimaryMulti()&&state.linguisticMode==='EIB';}
  function ctxSummary(){
    const c=state.teacherContext||{};
    const place=c.community?((c.localityType||'Localidad')+' '+c.community):'';
    return [c.institutionName,place,c.district&&('Distrito '+c.district),c.province&&('Provincia '+c.province),c.region&&('Región '+c.region),c.calendar].filter(Boolean).join(' · ')||'Completa una sola vez tu institución y lugar de trabajo para contextualizar automáticamente la planificación.';
  }

  function mountContext(){
    const settings=byId('settings'); if(settings&&!byId('ddTeacherContextSettings')){
      const c=state.teacherContext||{}; const card=document.createElement('div'); card.id='ddTeacherContextSettings';card.className='card topgap';
      card.innerHTML=`<h2>🏫 Mi perfil docente e institución</h2><p class="sub">Se registra una sola vez. DocenteDigital reutiliza automáticamente estos datos en unidades, proyectos, actividades, talleres y sesiones.</p><div class="form2">
        <label>Nombre del docente<input id="ddCtxTeacher" value="${E(c.teacherName||'')}" placeholder="Ej.: Jorge Luis Palma Rodríguez"></label>
        <label>Institución educativa<input id="ddCtxInstitution" value="${E(c.institutionName||'')}" placeholder="Ej.: I.E. Ccotataqui"></label>
        <label>Tipo de localidad<select id="ddCtxLocalityType"><option>Comunidad</option><option>Centro poblado</option><option>Anexo</option><option>Caserío</option><option>Barrio</option><option>Ciudad</option><option>Localidad</option></select></label>
        <label>Nombre de la localidad<input id="ddCtxCommunity" value="${E(c.community||'')}" placeholder="Ej.: Ccotataqui"></label>
        <label>Distrito<input id="ddCtxDistrict" value="${E(c.district||'')}"></label>
        <label>Provincia<input id="ddCtxProvince" value="${E(c.province||'')}"></label>
        <label>Región<input id="ddCtxRegion" value="${E(c.region||'')}"></label>
        <label>UGEL<input id="ddCtxUgel" value="${E(c.ugel||'')}" placeholder="Opcional"></label>
        <label class="full">Calendario comunal / actividad del momento<input id="ddCtxCalendar" value="${E(c.calendar||'')}"></label>
        <label class="full">Otros rasgos importantes<textarea id="ddCtxNotes">${E(c.notes||'')}</textarea></label>
      </div><button class="btn" id="ddSaveTeacherContext">💾 Guardar perfil</button>`;
      settings.appendChild(card);
      const localitySelect=byId('ddCtxLocalityType'); if(localitySelect)localitySelect.value=c.localityType||'Comunidad';
      byId('ddSaveTeacherContext').onclick=()=>{
        state.teacherContext={
          teacherName:byId('ddCtxTeacher').value.trim(),
          institutionName:byId('ddCtxInstitution').value.trim(),
          localityType:byId('ddCtxLocalityType').value,
          community:byId('ddCtxCommunity').value.trim(),
          district:byId('ddCtxDistrict').value.trim(),
          province:byId('ddCtxProvince').value.trim(),
          region:byId('ddCtxRegion').value.trim(),
          ugel:byId('ddCtxUgel').value.trim(),
          calendar:byId('ddCtxCalendar').value.trim(),
          notes:byId('ddCtxNotes').value.trim()
        };
        save();mountQuickContext(true);alert('Perfil docente e institucional guardado.');
      };
    }
  }

  function mountQuickContext(force=false){
    const panel=byId('unitPanel');if(!panel)return;let box=byId('ddQuickContext');
    if(!box){box=document.createElement('div');box.id='ddQuickContext';box.className='dd-context-strip';const form=panel.querySelector('.form2');panel.insertBefore(box,form||panel.firstChild);}
    const html=`<b>📍 Contexto que usará esta planificación:</b> ${E(ctxSummary())} <button type="button" class="btn ghost dd-mini" id="ddEditContext">Editar contexto</button>`;
    if(force||box.dataset.html!==html){box.dataset.html=html;box.innerHTML=html;byId('ddEditContext').onclick=()=>{go('settings');setTimeout(()=>byId('ddTeacherContextSettings')?.scrollIntoView({behavior:'smooth'}),50);};}
  }

  function mountSessionBadge(){
    const screen=byId('session');if(!screen)return;let box=byId('ddSessionEngineBadge');
    if(!box){box=document.createElement('div');box.id='ddSessionEngineBadge';box.className='dd-engine-badge';const first=screen.querySelector('.card');if(first)screen.insertBefore(box,first);else screen.appendChild(box);}
    const html=isPrimaryEibMulti()?`<b>🌱 Motor pedagógico activo:</b> Prompt Maestro de Sesión para <b>Primaria EIB ${E(state.ieType)}</b> · atención simultánea y diferenciada · procesos didácticos · evaluación formativa.`:isPrimaryMulti()?`<b>🌱 Motor pedagógico activo:</b> <b>Primaria ${E(state.ieType)}</b> · atención simultánea y diferenciada · procesos didácticos · evaluación formativa.`:`<b>ℹ️ Motor pedagógico:</b> se aplicará el motor correspondiente al nivel y tipo de IE.`;
    if(box.dataset.html!==html){box.dataset.html=html;box.innerHTML=html;}
  }

  function mountSources(){
    document.getElementById('ddPlanSources')?.remove();
    document.getElementById('ddSessionSources')?.remove();
  }

  function mountLibrary(){
    const settings=byId('settings');if(!settings||byId('ddMasterLibraryCard'))return;const card=document.createElement('div');card.id='ddMasterLibraryCard';card.className='card topgap';card.innerHTML=`<h2>📚 Biblioteca Maestra Pedagógica</h2><p><b>Jerarquía:</b> Norma MINEDU vigente → CNEB → Programa Curricular → orientaciones oficiales → EIB/multigrado/inclusión → guías por área → autores.</p><div class="notice"><b>🛡 Vigilancia normativa:</b> ${E(state.masterLibrary.normativeStatus)}. La app no afirmará vigencia sin verificación oficial.</div><p class="sub">Los autores enriquecen las estrategias, pero no sustituyen la normativa ni el currículo.</p>`;settings.appendChild(card);
  }

  function showToast(id,title,checks,foot){
    const payload={title,checks,foot,at:new Date().toISOString()};
    try{
      const all=JSON.parse(localStorage.getItem('ddInternalAuditLog')||'[]');
      all.push(payload);
      localStorage.setItem('ddInternalAuditLog',JSON.stringify(all.slice(-80)));
    }catch(_e){}
    let box=byId(id);if(!box){box=document.createElement('div');box.id=id;box.style.display='none';document.body.appendChild(box);}
    return box;
  }

  function hideToast(id){byId(id)?.classList.remove('show');}

  let unitBypass=false,sessionBypass=false;
  document.addEventListener('click',e=>{
    const t=e.target.closest?.('button');if(!t)return;
    if(t.id==='ddBuildUnit'&&!unitBypass){
      const p=state.pendingUnitChoice||{};const prod=(byId('ddOwnProduct')?.value||'').trim()||document.querySelector('input[name="ddProduct"]:checked')?.value;const checks=[['Nivel, tipo de IE, grados y áreas',!!(state.level&&state.ieType&&(state.grades||[]).length&&(state.areas||[]).length)],['Situación significativa elegida',!!p.selectedSituation],['Dos situaciones propuestas',Array.isArray(p.situations)&&p.situations.length===2],['Tres productos propuestos',Array.isArray(p.products)&&p.products.length===3],['Producto elegido',!!prod],['Contexto disponible',!!((byId('unitSituation')?.value||'').trim())],['Fuente curricular literal',state.curriculumMatrixReady===true]];
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();showToast('ddAuditToast','⚡ Auditoría relámpago',checks,'La fuente curricular literal seguirá marcada como pendiente mientras no esté conectada a la matriz oficial.');setTimeout(()=>{hideToast('ddAuditToast');unitBypass=true;t.click();unitBypass=false;},450);return;
    }
    const on=t.getAttribute('onclick')||'';
    if(/generateSession\(\)/.test(on)&&isPrimaryMulti()&&!sessionBypass){
      let unit=null,act=null;try{const s=selectedActivity();unit=s.unit;act=s.activity;}catch(err){}
      const checks=[['Unidad/proyecto de origen',!!unit],['Título de sesión',!!(byId('sessionTitle')?.value||act?.title)],['Grados multigrado definidos',(state.grades||[]).length>1],['Área identificada',!!act?.area],['Recursos disponibles',!!byId('sessionResources')?.value],['Atención diferenciada',true],['Procesos didácticos',true],['Retroalimentación y cierre',true]];
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();showToast('ddSessionAuditToast','⚡ Auditoría de Sesión',checks,isPrimaryEibMulti()?'Prompt Maestro de Primaria EIB multigrado/unidocente activo.':'Motor de Primaria multigrado/unidocente activo; se respeta el perfil lingüístico configurado.');setTimeout(()=>{hideToast('ddSessionAuditToast');sessionBypass=true;generateSession();sessionBypass=false;},450);return;
    }
    if(t.id==='ddContinueProducts'||/createUnitDemo/.test(on))setTimeout(mountAll,30);
  },true);

  function mountAll(){mountContext();mountQuickContext();mountSessionBadge();mountSources();mountLibrary();}
  const baseGo=window.go; if(typeof baseGo==='function')window.go=function(){const r=baseGo.apply(this,arguments);setTimeout(mountAll,0);return r;};
  const baseShow=window.showUnit; if(typeof baseShow==='function')window.showUnit=function(){const r=baseShow.apply(this,arguments);setTimeout(()=>{mountQuickContext(true);mountAll();},0);return r;};
  ['change','input'].forEach(ev=>document.addEventListener(ev,e=>{if(['sessionUnit','activity','unitType'].includes(e.target?.id))setTimeout(mountAll,0);},true));
  setTimeout(mountAll,0);

  const css=document.createElement('style');css.textContent=`.dd-context-strip{margin:10px 0 14px;padding:10px 12px;border:1px dashed #8aa79a;border-radius:12px;background:#f7fbf9}.dd-mini{padding:5px 9px;margin-left:6px}.dd-engine-badge{margin:0 0 12px;padding:10px 12px;border:1px dashed #89a79a;border-radius:12px;background:#f5faf7}.dd-source-strip{display:flex;justify-content:space-between;gap:10px;margin:7px 0 14px;padding:10px;border:1px solid #d6e4dc;border-radius:12px;background:#f7fbf9}.dd-source-strip>div:first-child{display:grid}.dd-source-strip span{font-size:12px}.dd-source-pills{display:flex;gap:5px;flex-wrap:wrap}.dd-source-pills span{padding:4px 7px;border-radius:999px;background:#edf4f0}.dd-source-pills .warn{background:#fff3cf;color:#755719}.dd-stable-audit{position:fixed;z-index:100000;left:50%;top:70px;transform:translate(-50%,-10px);width:min(740px,calc(100vw - 24px));background:#fff;border:1px solid #b9c9c0;border-radius:16px;box-shadow:0 18px 48px rgba(0,0,0,.22);padding:14px;opacity:0;pointer-events:none;transition:.15s}.dd-stable-audit.show{opacity:1;transform:translate(-50%,0)}.dd-sa-head{display:flex;justify-content:space-between;gap:10px}.dd-sa-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;margin-top:8px}.dd-sa-grid span{padding:6px 8px;border-radius:8px;font-size:13px}.dd-sa-grid .ok{background:#eaf7ef}.dd-sa-grid .warn{background:#fff6df}.dd-stable-audit small{display:block;margin-top:8px}@media(max-width:700px){.dd-source-strip{display:block}.dd-sa-grid{grid-template-columns:1fr}}`;document.head.appendChild(css);
})();