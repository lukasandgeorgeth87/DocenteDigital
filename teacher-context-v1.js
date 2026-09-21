/* DocenteDigital — perfil institucional y contexto territorial v1 */
(function(){
  if(window.__ddTeacherContextV1)return;
  window.__ddTeacherContextV1=true;

  const E=v=>escapeHtml(v);
  const $=id=>document.getElementById(id);

  state.teacherContext=Object.assign({
    teacherName:state.teacherName||'',
    institutionName:state.schoolName||'',
    localityType:'Comunidad',
    community:'',
    district:'',
    province:'',
    region:'',
    ugel:'',
    calendar:'',
    notes:''
  },state.teacherContext||{});
  if(!state.teacherContext.teacherName&&state.teacherName)state.teacherContext.teacherName=state.teacherName;
  if(!state.teacherContext.institutionName&&state.schoolName)state.teacherContext.institutionName=state.schoolName;
  save();

  function summary(){
    const p=state.teacherContext||{};
    return [
      p.institutionName,
      p.community?((p.localityType||'Localidad')+' '+p.community):'',
      p.district?('Distrito '+p.district):'',
      p.province?('Provincia '+p.province):'',
      p.region?('Región '+p.region):''
    ].filter(Boolean).join(' · ');
  }

  function mount(){
    const settings=$('settings')?.querySelector('.card');if(!settings)return;
    let card=$('ddTeacherContextCard');
    if(!card){
      card=document.createElement('div');
      card.id='ddTeacherContextCard';
      card.className='dd-profile-box';
      settings.appendChild(card);
    }
    const p=state.teacherContext||{};
    card.innerHTML=`<h2>📍 Institución y lugar donde trabajo</h2>
      <p class="sub">Se guarda una sola vez. DocenteDigital reutiliza estos datos para contextualizar situaciones significativas, productos, sesiones y materiales.</p>
      <div class="form2">
        <label>Nombre del docente<input id="ddTcTeacher" value="${E(p.teacherName||state.teacherName||'')}"></label>
        <label>Institución educativa<input id="ddTcInstitution" value="${E(p.institutionName||state.schoolName||'')}" placeholder="Ej.: I.E. N.° 501086"></label>
        <label>Tipo de localidad<select id="ddTcLocalityType"><option>Comunidad</option><option>Centro poblado</option><option>Anexo</option><option>Caserío</option><option>Barrio</option><option>Ciudad</option><option>Localidad</option></select></label>
        <label>Nombre de la localidad<input id="ddTcCommunity" value="${E(p.community||'')}" placeholder="Ej.: Ccotataqui"></label>
        <label>Distrito<input id="ddTcDistrict" value="${E(p.district||'')}"></label>
        <label>Provincia<input id="ddTcProvince" value="${E(p.province||'')}"></label>
        <label>Región<input id="ddTcRegion" value="${E(p.region||'')}"></label>
        <label>UGEL<input id="ddTcUgel" value="${E(p.ugel||'')}" placeholder="Opcional"></label>
        <label class="full">Calendario comunal / situación del momento<input id="ddTcCalendar" value="${E(p.calendar||'')}" placeholder="Opcional"></label>
        <label class="full">Otros rasgos útiles para contextualizar<textarea id="ddTcNotes" placeholder="Ej.: contexto rural, lengua originaria, actividades productivas, recursos del entorno...">${E(p.notes||'')}</textarea></label>
      </div>
      <div class="actions"><button class="btn" type="button" id="ddTcSave">💾 Guardar contexto</button></div>
      <div class="success topgap" id="ddTcSummary">${E(summary()||'Completa estos datos para mejorar la contextualización automática.')}</div>`;
    $('ddTcLocalityType').value=p.localityType||'Comunidad';
    $('ddTcSave').onclick=()=>{
      state.teacherContext={
        teacherName:$('ddTcTeacher').value.trim(),
        institutionName:$('ddTcInstitution').value.trim(),
        localityType:$('ddTcLocalityType').value,
        community:$('ddTcCommunity').value.trim(),
        district:$('ddTcDistrict').value.trim(),
        province:$('ddTcProvince').value.trim(),
        region:$('ddTcRegion').value.trim(),
        ugel:$('ddTcUgel').value.trim(),
        calendar:$('ddTcCalendar').value.trim(),
        notes:$('ddTcNotes').value.trim()
      };
      state.teacherName=state.teacherContext.teacherName;
      state.schoolName=state.teacherContext.institutionName;
      save();
      $('ddTcSummary').textContent=summary()||'Contexto guardado.';
      if($('settingsSummary'))refresh();
    };
  }

  const oldRefresh=window.refresh;
  if(typeof oldRefresh==='function'){
    window.refresh=function(){
      const r=oldRefresh.apply(this,arguments);
      mount();
      return r;
    };
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
  window.DDTeacherContext={summary,mount};
})();