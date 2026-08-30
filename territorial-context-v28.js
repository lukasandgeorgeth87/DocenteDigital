/* DocenteDigital – perfil territorial neutral v28
   Evita asumir que toda IE está en una “comunidad”. Mantiene compatibilidad con teacherContext.community legado.
*/
(function(){
  if(window.__ddTerritorialContextV28)return;window.__ddTerritorialContextV28=true;
  if(typeof state!=='object')return;
  const E=v=>typeof escapeHtml==='function'?escapeHtml(String(v??'')):String(v??'');
  const TYPES=['Localidad','Centro poblado','Ciudad','Pueblo','Caserío','Anexo','Barrio / urbanización','Comunidad campesina','Comunidad nativa','Otro'];
  const AREAS=['No especificada','Urbana','Rural','Periurbana'];
  const old=state.teacherContext||{};
  state.teacherContext={
    ...old,
    locationType:old.locationType||'Localidad',
    locationName:old.locationName||old.community||'',
    areaType:old.areaType||'No especificada'
  };
  if(typeof save==='function')save();

  function territorialLabel(){
    const c=state.teacherContext||{};
    const name=(c.locationName||c.community||'').trim();
    const type=(c.locationType||'Localidad').trim();
    if(name)return `${type}: ${name}`;
    if((c.district||'').trim())return `Distrito: ${c.district.trim()}`;
    return 'entorno de los estudiantes';
  }
  function territorialPhrase(){
    const c=state.teacherContext||{};
    const name=(c.locationName||c.community||'').trim();
    const type=(c.locationType||'Localidad').trim().toLowerCase();
    if(name)return `${type} ${name}`;
    if((c.district||'').trim())return `distrito de ${c.district.trim()}`;
    return 'entorno de los estudiantes';
  }
  function summary(){
    const c=state.teacherContext||{};
    return [territorialLabel(),c.areaType&&c.areaType!=='No especificada'?`Área ${c.areaType}`:'',c.district,c.province,c.region,c.calendar,c.notes].filter(Boolean).join(' · ');
  }
  function typeOptions(current){return TYPES.map(x=>`<option${x===current?' selected':''}>${E(x)}</option>`).join('')}
  function areaOptions(current){return AREAS.map(x=>`<option${x===current?' selected':''}>${E(x)}</option>`).join('')}

  function mount(){
    const settings=document.getElementById('settings');if(!settings)return;
    let card=document.getElementById('ddTeacherContextSettings');
    if(!card){card=document.createElement('div');card.id='ddTeacherContextSettings';card.className='card topgap';settings.appendChild(card);}
    const c=state.teacherContext||{};
    card.innerHTML=`<h2>📍 Contexto donde trabajo</h2>
      <p class="sub">Registra el lugar sin asumir que es una comunidad. Se guarda una sola vez y se reutiliza en unidades, proyectos y sesiones.</p>
      <div class="form2">
        <label>Tipo de lugar<select id="ddCtxLocationType">${typeOptions(c.locationType||'Localidad')}</select></label>
        <label>Nombre del lugar<input id="ddCtxLocationName" value="${E(c.locationName||c.community||'')}" placeholder="Ej.: Ccotataqui, Lamay, Wanchaq"></label>
        <label>Área geográfica<select id="ddCtxAreaType">${areaOptions(c.areaType||'No especificada')}</select></label>
        <label>Distrito<input id="ddCtxDistrict" value="${E(c.district||'')}"></label>
        <label>Provincia<input id="ddCtxProvince" value="${E(c.province||'')}"></label>
        <label>Región<input id="ddCtxRegion" value="${E(c.region||'')}"></label>
        <label class="full">Calendario local/comunal / actividad del momento<input id="ddCtxCalendar" value="${E(c.calendar||'')}"></label>
        <label class="full">Otros rasgos importantes<textarea id="ddCtxNotes">${E(c.notes||'')}</textarea></label>
      </div>
      <div class="notice">Usaremos el nombre real registrado. Si no especificas un tipo de lugar, la planificación empleará expresiones neutrales como <b>entorno</b> o <b>realidad de los estudiantes</b>.</div>
      <button class="btn" id="ddSaveTeacherContext">💾 Guardar contexto</button>`;
    document.getElementById('ddSaveTeacherContext').onclick=()=>{
      const locationName=(document.getElementById('ddCtxLocationName')?.value||'').trim();
      state.teacherContext={
        ...state.teacherContext,
        locationType:document.getElementById('ddCtxLocationType')?.value||'Localidad',
        locationName,
        community:locationName,
        areaType:document.getElementById('ddCtxAreaType')?.value||'No especificada',
        district:(document.getElementById('ddCtxDistrict')?.value||'').trim(),
        province:(document.getElementById('ddCtxProvince')?.value||'').trim(),
        region:(document.getElementById('ddCtxRegion')?.value||'').trim(),
        calendar:(document.getElementById('ddCtxCalendar')?.value||'').trim(),
        notes:(document.getElementById('ddCtxNotes')?.value||'').trim()
      };
      if(typeof save==='function')save();
      refreshQuick();alert('Contexto territorial guardado.');
    };
  }
  function refreshQuick(){
    const box=document.getElementById('ddQuickContext');if(!box)return;
    box.innerHTML=`<b>📍 Contexto que usará esta planificación:</b> ${E(summary())} <button type="button" class="btn ghost dd-mini" id="ddEditContext">Editar contexto</button>`;
    const b=document.getElementById('ddEditContext');if(b)b.onclick=()=>{if(typeof go==='function')go('settings');setTimeout(()=>document.getElementById('ddTeacherContextSettings')?.scrollIntoView({behavior:'smooth'}),50);};
  }
  window.ddTerritorialLabel=territorialLabel;
  window.ddTerritorialPhrase=territorialPhrase;
  window.ddTerritorialSummary=summary;
  const oldGo=window.go;if(typeof oldGo==='function')window.go=function(id){const r=oldGo.apply(this,arguments);setTimeout(()=>{if(id==='settings')mount();refreshQuick();},0);return r;};
  const oldShow=window.showUnit;if(typeof oldShow==='function')window.showUnit=function(){const r=oldShow.apply(this,arguments);setTimeout(refreshQuick,0);return r;};
  setTimeout(()=>{mount();refreshQuick();},0);
})();