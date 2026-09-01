/* DocenteDigital – Ficha Maestra de la IE v46.2
   Registra una vez los datos institucionales y los reutiliza en Docente y Director.
   No sustituye autenticación ni una base de datos multiusuario; en este prototipo se guarda en localStorage.
*/
(function(){
  if(window.__ddInstitutionMasterV46)return;window.__ddInstitutionMasterV46=true;
  if(typeof state!=='object')return;

  const E=v=>typeof escapeHtml==='function'?escapeHtml(String(v??'')):String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const tidy=v=>String(v??'').replace(/\s+/g,' ').trim();
  const locationTypes=['Localidad','Centro poblado','Ciudad','Pueblo','Caserío','Anexo','Comunidad campesina','Comunidad nativa','Barrio / urbanización','Otro'];
  const levels=['Inicial','Primaria','Secundaria'];

  function initialMaster(){
    const c=state.teacherContext||{};
    return {
      ieName:tidy(state.ieName||''),
      modularCode:'',localCode:'',ugel:'',dreGre:'',
      region:tidy(c.region||''),province:tidy(c.province||''),district:tidy(c.district||''),
      locationType:tidy(c.locationType||c.placeType||''),
      locationName:tidy(c.locationName||c.locality||c.community||''),
      geographicArea:'No especificado',
      managementType:'',
      levels:state.level?[state.level]:[],
      organization:tidy(state.ieType||''),
      shifts:[],
      directorName:tidy(state.directorName||''),
      teacherCount:'',studentCount:'',
      schoolCalendar:'',communalCalendar:tidy(c.calendar||''),
      notes:tidy(c.notes||''),
      updatedAt:null
    };
  }

  state.institutionMaster=Object.assign(initialMaster(),state.institutionMaster||{});
  /* Versiones anteriores asignaban “Docente y Director” sin que el usuario lo eligiera.
     Solo limpiamos ese valor heredado cuando la Ficha Maestra nunca fue guardada. */
  if(!state.institutionMaster.updatedAt&&state.userRole==='Docente y Director')state.userRole='';
  state.userRole=tidy(state.userRole||'');
  /* Corrige únicamente el valor heredado por defecto de versiones previas. Si la ficha
     ya fue guardada por el usuario, se conserva su decisión. */
  if(!state.institutionMaster.updatedAt&&state.institutionMaster.managementType==='Pública')state.institutionMaster.managementType='';

  function syncLegacy(){
    const m=state.institutionMaster;
    state.ieName=m.ieName||state.ieName||'';
    state.directorName=m.directorName||state.directorName||'';
    state.teacherContext=Object.assign({},state.teacherContext||{}, {
      locationType:m.locationType||'',locationName:m.locationName||'',locality:m.locationName||'',
      district:m.district||'',province:m.province||'',region:m.region||'',calendar:m.communalCalendar||'',notes:m.notes||''
    });
    if(/comunidad/i.test(m.locationType||''))state.teacherContext.community=m.locationName||'';
    else state.teacherContext.community='';
  }

  function institutionLabel(){
    const m=state.institutionMaster||{};
    return [m.ieName,m.locationName,m.district,m.province,m.region].filter(Boolean).join(' · ')||'Ficha institucional pendiente de completar';
  }

  function levelChecks(selected){return levels.map(x=>`<label class="dd-check"><input type="checkbox" data-dd-level="${E(x)}" ${selected.includes(x)?'checked':''}> ${E(x)}</label>`).join('');}
  function options(list,current){return list.map(x=>`<option value="${E(x)}" ${x===current?'selected':''}>${E(x||'Por precisar')}</option>`).join('');}

  function mountSettings(){
    const host=document.getElementById('settings');if(!host)return;
    let card=document.getElementById('ddInstitutionMaster');
    const m=state.institutionMaster;
    if(!card){card=document.createElement('div');card.id='ddInstitutionMaster';card.className='card topgap';host.insertBefore(card,host.firstChild?.nextSibling||null);}
    card.innerHTML=`
      <h2>🏫 Ficha Maestra de la IE</h2>
      <p class="sub">Registra estos datos una sola vez. DocenteDigital debe reutilizarlos en planificación, sesiones y documentos del Director en lugar de volver a pedirlos.</p>
      <div class="notice"><b>Regla:</b> un dato institucional registrado se reutiliza. Si falta, se marca como pendiente; no se inventa.</div>
      <div class="form2 topgap">
        <label>Mi función principal<select id="ddUserRole"><option value="">Selecciona tu función</option><option>Docente</option><option>Director</option><option>Docente y Director</option></select></label>
        <label>Nombre de la IE<input id="ddIeName" value="${E(m.ieName)}" placeholder="Ej.: I.E. 50740 Ccotataqui"></label>
        <label>Código modular<input id="ddModularCode" value="${E(m.modularCode)}"></label>
        <label>Código de local<input id="ddLocalCode" value="${E(m.localCode)}"></label>
        <label>UGEL<input id="ddUgel" value="${E(m.ugel)}"></label>
        <label>DRE / GRE<input id="ddDreGre" value="${E(m.dreGre)}"></label>
        <label>Región<input id="ddRegion" value="${E(m.region)}"></label>
        <label>Provincia<input id="ddProvince" value="${E(m.province)}"></label>
        <label>Distrito<input id="ddDistrict" value="${E(m.district)}"></label>
        <label>Tipo de lugar<select id="ddLocationType"><option value="">Selecciona</option>${options(locationTypes,m.locationType)}</select></label>
        <label>Nombre del lugar<input id="ddLocationName" value="${E(m.locationName)}" placeholder="Nombre real del lugar"></label>
        <label>Ámbito<select id="ddGeoArea">${options(['No especificado','Rural','Urbano','Periurbano'],m.geographicArea)}</select></label>
        <label>Gestión<select id="ddManagementType">${options(['','Pública','Privada','Otra / por precisar'],m.managementType)}</select></label>
        <label>Organización de la IE<select id="ddOrganization">${options(['','Unidocente','Multigrado','Polidocente'],m.organization)}</select></label>
        <label>Director/a<input id="ddDirectorName" value="${E(m.directorName)}"></label>
        <label>N.º de docentes<input id="ddTeacherCount" inputmode="numeric" value="${E(m.teacherCount)}"></label>
        <label>N.º de estudiantes<input id="ddStudentCount" inputmode="numeric" value="${E(m.studentCount)}"></label>
        <label class="full">Niveles que atiende la IE<div class="dd-level-checks">${levelChecks(Array.isArray(m.levels)?m.levels:[])}</div></label>
        <label class="full">Calendario escolar / referencia anual<input id="ddSchoolCalendar" value="${E(m.schoolCalendar)}"></label>
        <label class="full">Calendario comunal o local, cuando corresponda<input id="ddCommunalCalendar" value="${E(m.communalCalendar)}"></label>
        <label class="full">Características o datos institucionales relevantes<textarea id="ddInstitutionNotes">${E(m.notes)}</textarea></label>
      </div>
      <div class="actions"><button class="btn" id="ddSaveInstitutionMaster">💾 Guardar Ficha Maestra</button></div>
      <small>En esta etapa del prototipo los datos se guardan solo en este navegador. La versión multiusuario requerirá autenticación y base de datos segura.</small>`;
    const role=document.getElementById('ddUserRole');if(role)role.value=state.userRole||'';
    document.getElementById('ddSaveInstitutionMaster').onclick=saveMaster;
  }

  function selectedLevels(){return [...document.querySelectorAll('#ddInstitutionMaster [data-dd-level]:checked')].map(x=>x.getAttribute('data-dd-level'));}
  function val(id){return tidy(document.getElementById(id)?.value||'');}
  function saveMaster(){
    const selectedRole=val('ddUserRole');
    if(!selectedRole){alert('Selecciona tu función principal: Docente, Director o Docente y Director.');document.getElementById('ddUserRole')?.focus();return;}
    const next={
      ieName:val('ddIeName'),modularCode:val('ddModularCode'),localCode:val('ddLocalCode'),ugel:val('ddUgel'),dreGre:val('ddDreGre'),
      region:val('ddRegion'),province:val('ddProvince'),district:val('ddDistrict'),locationType:val('ddLocationType'),locationName:val('ddLocationName'),
      geographicArea:val('ddGeoArea')||'No especificado',managementType:val('ddManagementType'),levels:selectedLevels(),organization:val('ddOrganization'),
      shifts:state.institutionMaster?.shifts||[],directorName:val('ddDirectorName'),teacherCount:val('ddTeacherCount'),studentCount:val('ddStudentCount'),
      schoolCalendar:val('ddSchoolCalendar'),communalCalendar:val('ddCommunalCalendar'),notes:val('ddInstitutionNotes'),updatedAt:new Date().toISOString()
    };
    state.userRole=selectedRole;
    state.institutionMaster=next;
    if(next.organization)state.ieType=next.organization;
    syncLegacy();if(typeof save==='function')save();
    paintSummary();
    alert('Ficha Maestra guardada. Estos datos quedan disponibles para reutilizarlos en Docente y Director.');
  }

  function paintSummary(){
    const home=document.getElementById('home');if(home){
      let box=document.getElementById('ddInstitutionSummary');
      if(!box){box=document.createElement('div');box.id='ddInstitutionSummary';box.className='dd-master-summary';const hero=home.querySelector('.hero');hero?.appendChild(box);}
      const m=state.institutionMaster||{};
      box.innerHTML=`<b>🏫 ${E(m.ieName||'IE por completar')}</b><span>👤 ${E(state.userRole||'Rol por definir')}</span><span>📍 ${E([m.locationType,m.locationName].filter(Boolean).join(': ')||'Ubicación por completar')}</span>`;
    }
    const director=document.getElementById('director');if(director){
      let box=document.getElementById('ddDirectorInstitutionStrip');
      if(!box){box=document.createElement('div');box.id='ddDirectorInstitutionStrip';box.className='notice';const sub=director.querySelector('.sub');sub?.insertAdjacentElement('afterend',box);}
      const m=state.institutionMaster||{};
      box.innerHTML=`<b>Ficha institucional reutilizable:</b> ${E(institutionLabel())}<br><small>Los documentos directivos deberán recuperar estos datos antes de pedirlos nuevamente.</small>`;
    }
  }

  function get(field,fallback=''){const v=state.institutionMaster?.[field];return (v!==undefined&&v!==null&&v!=='')?v:fallback;}
  function requireFields(fields){return fields.map(k=>({field:k,value:get(k,''),ok:!!tidy(get(k,''))}));}

  const oldGo=window.go;if(typeof oldGo==='function')window.go=function(id){const r=oldGo.apply(this,arguments);setTimeout(()=>{if(id==='settings')mountSettings();paintSummary();},0);return r;};
  const oldRefresh=window.refresh;if(typeof oldRefresh==='function')window.refresh=function(){const r=oldRefresh.apply(this,arguments);setTimeout(paintSummary,0);return r;};

  syncLegacy();if(typeof save==='function')save();
  window.ddInstitutionMaster={get,all:()=>({...state.institutionMaster}),requireFields,institutionLabel};
  window.ddInstitutionData=()=>({...state.institutionMaster,userRole:state.userRole});
  setTimeout(()=>{mountSettings();paintSummary();},0);

  const css=document.createElement('style');css.textContent=`.dd-level-checks{display:flex;gap:8px;flex-wrap:wrap;margin-top:6px}.dd-check{display:flex!important;align-items:center;gap:5px;padding:7px 9px;border:1px solid #d7e0db;border-radius:9px;background:#fafcfb}.dd-master-summary{display:flex;gap:7px;flex-wrap:wrap;margin-top:10px}.dd-master-summary>*{padding:5px 8px;border-radius:999px;background:#eef6f1;font-size:12px}`;document.head.appendChild(css);
})();