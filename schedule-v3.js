/* DocenteDigital – horario persistente y distribución real de sesiones */
(function(){
  const DAYS=['Lunes','Martes','Miércoles','Jueves','Viernes'];
  const DEFAULT_SCHEDULE={
    Lunes:[
      {block:1,time:'8:00 a 9:30',area:'Comunicación'},
      {block:2,time:'9:45 a 11:15',area:'Personal Social'},
      {block:3,time:'11:30 a 12:15',area:'Ciencia y Tecnología'}
    ],
    Martes:[
      {block:1,time:'8:00 a 9:30',area:'Matemática'},
      {block:2,time:'9:45 a 11:15',area:'Ciencia y Tecnología'},
      {block:3,time:'11:30 a 12:15',area:'Refuerzo Matemática'}
    ],
    Miércoles:[
      {block:1,time:'8:00 a 9:30',area:'Comunicación'},
      {block:2,time:'9:45 a 11:15',area:'Matemática'},
      {block:3,time:'11:30 a 12:15',area:'Educación Religiosa'}
    ],
    Jueves:[
      {block:1,time:'8:00 a 9:30',area:'Matemática'},
      {block:2,time:'9:45 a 11:15',area:'Arte y Cultura'},
      {block:3,time:'11:30 a 12:15',area:'Refuerzo Comunicación'}
    ],
    Viernes:[
      {block:1,time:'8:00 a 9:30',area:'Comunicación'},
      {block:2,time:'9:45 a 11:15',area:'Personal Social'},
      {block:3,time:'11:30 a 12:15',area:'Educación Física'}
    ]
  };

  const clone=o=>JSON.parse(JSON.stringify(o));
  const E=v=>escapeHtml(v);
  state.schedule=state.schedule&&state.schedule.Lunes?state.schedule:clone(DEFAULT_SCHEDULE);
  state.scheduleSource=state.scheduleSource||'Horario guardado del docente';
  state.unitSessionMode=state.unitSessionMode||'schedule';
  save();

  function normalizeArea(label){
    const t=(label||'').trim().toLowerCase();
    if(!t||/receso|almuerzo|libre/.test(t))return null;
    if(/refuerzo.*mat|matem/.test(t))return 'Matemática';
    if(/refuerzo.*com|comunic/.test(t))return 'Comunicación';
    if(/personal/.test(t))return 'Personal Social';
    if(/ciencia|tecnolog/.test(t))return 'Ciencia y Tecnología';
    if(/arte/.test(t))return 'Arte y Cultura';
    if(/f[ií]sica/.test(t))return 'Educación Física';
    if(/religi/.test(t))return 'Educación Religiosa';
    if(/psicom/.test(t))return 'Psicomotriz';
    if(/ciencias sociales/.test(t))return 'Ciencias Sociales';
    if(/dpcc/.test(t))return 'DPCC';
    if(/ingl[eé]s/.test(t))return 'Inglés';
    if(/ept/.test(t))return 'EPT';
    if(/tutor/.test(t))return 'Tutoría';
    const exact=(state.areas||[]).find(a=>a.toLowerCase()===t);
    return exact||label.trim();
  }

  function countWeekly(schedule=state.schedule){
    return DAYS.reduce((n,d)=>n+((schedule[d]||[]).filter(s=>normalizeArea(s.area)).length),0);
  }

  function manualSchedule(count){
    const areas=(state.areas&&state.areas.length?state.areas:areaOptions()).filter(Boolean);
    let k=0; const out={};
    DAYS.forEach(day=>{
      out[day]=Array.from({length:count},(_,i)=>({block:i+1,time:'',area:areas[k++%areas.length]}));
    });
    return out;
  }

  function effectiveSchedule(){
    if(state.unitSessionMode==='2')return manualSchedule(2);
    if(state.unitSessionMode==='3')return manualSchedule(3);
    return state.schedule||clone(DEFAULT_SCHEDULE);
  }

  // Reemplaza la antigua lógica de una sola sesión diaria.
  buildActivities=function(brief,duration){
    const weeks=Math.max(1,parseInt(duration)||3);
    const schedule=effectiveSchedule();
    const counters={}; const activities=[]; let order=0;
    for(let week=1;week<=weeks;week++){
      DAYS.forEach(day=>{
        (schedule[day]||[]).forEach((slot,idx)=>{
          const area=normalizeArea(slot.area);
          if(!area||area==='Tutoría')return;
          // En una unidad integrada se programan las áreas elegidas por el docente.
          if(state.areas&&state.areas.length&&!state.areas.includes(area))return;
          const variants=activityVariants(area,brief);
          counters[area]=(counters[area]||0)+1;
          const title=variants[(counters[area]-1)%variants.length];
          activities.push({area,title,week,day,block:slot.block||idx+1,time:slot.time||'',order:++order});
        });
      });
    }
    return activities;
  };

  function scheduleSequenceHtml(unit){
    const rows=(unit.activities||[]).map((a,i)=>{
      const p=(unit.purposes||[]).find(x=>x.area===a.area)||(unit.purposes||[])[0];
      const perf=p?.performances?.map(x=>`${x.grade}: ${x.text}`).join(' / ')||'';
      const crit=p?.criteria?.map(x=>`${x.grade}: ${x.text}`).join(' / ')||'';
      return `<tr><td>Semana ${E(a.week)}</td><td>${E(a.day||'')}</td><td>${E(a.block||'')}</td><td>${E(a.time||'')}</td><td>${E(a.area)}</td><td><b>${E(a.title)}</b></td><td>${E(perf)}</td><td>${E(p?.evidence||'')}</td><td>${E(crit)}</td><td>${E(p?.instrument||'')}</td><td>${E(a.title)}</td></tr>`;
    }).join('');
    return `<div class="dd-scroll"><table class="dd-table"><thead><tr><th>Semana</th><th>Día</th><th>Bloque</th><th>Hora</th><th>Área</th><th>Título de la sesión</th><th>Desempeño precisado</th><th>Evidencia</th><th>Criterio</th><th>Instrumento</th><th>Actividad principal</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  }

  const prevRender=window.renderUnitOutput;
  window.renderUnitOutput=function(unit){
    prevRender(unit);
    const section=byId('dd-sesiones');
    if(section){
      const weekly=countWeekly(effectiveSchedule());
      const weeks=Math.max(1,parseInt(unit.duration)||3);
      section.innerHTML=`<h2>V. Secuencia de sesiones de aprendizaje</h2><div class="success"><b>Distribución:</b> ${state.unitSessionMode==='schedule'?'según horario guardado':state.unitSessionMode+' sesiones por día'} · <b>${weekly} sesiones por semana</b> · <b>${unit.activities.length} sesiones programadas en ${weeks} semanas</b>.</div><p class="sub">Cada día puede contener varias sesiones. El horario se guarda una sola vez y se reutiliza en las siguientes unidades/proyectos.</p>${scheduleSequenceHtml(unit)}`;
    }
    const actions=byId('unitOutput')?.querySelector('.actions.topgap');
    if(actions&&!actions.querySelector('.dd-rebuild-schedule')){
      const b=document.createElement('button');b.className='btn ghost dd-rebuild-schedule';b.textContent='🗓️ Reorganizar según horario';b.onclick=()=>ddRebuildUnitSchedule(unit.id);actions.appendChild(b);
    }
  };

  const prevUnitWord=window.unitWordHtml;
  window.unitWordHtml=function(unit){
    let html=prevUnitWord(unit);
    const seq=`<h2>V. SECUENCIA DE SESIONES DE APRENDIZAJE</h2><p><b>Distribución:</b> ${state.unitSessionMode==='schedule'?'según horario guardado':state.unitSessionMode+' sesiones por día'}.</p>${scheduleSequenceHtml(unit)}`;
    html=html.replace(/<h2>V\. SECUENCIA DE SESIONES DE APRENDIZAJE<\/h2>[\s\S]*?(?=<h2>VI\. INSTRUMENTOS DE EVALUACIÓN<\/h2>)/,seq);
    return html;
  };

  window.ddRebuildUnitSchedule=function(id){
    const u=state.units.find(x=>x.id===id);if(!u)return;
    u.activities=buildActivities(unitBrief(u),u.duration);save();renderUnits();renderUnitOutput(u);fillSessionUnits();
    alert(`Unidad reorganizada: ${u.activities.length} sesiones según la distribución elegida.`);
  };

  function areaChoicesForEditor(current){
    const extra=['Comunicación','Matemática','Personal Social','Ciencia y Tecnología','Arte y Cultura','Educación Física','Educación Religiosa','Psicomotriz','Ciencias Sociales','DPCC','Inglés','EPT','Tutoría','Refuerzo Matemática','Refuerzo Comunicación','Libre'];
    return [...new Set([...(state.areas||[]),...extra,current].filter(Boolean))];
  }

  function scheduleEditorHtml(){
    const max=Math.max(3,...DAYS.map(d=>(state.schedule[d]||[]).length));
    let rows='';
    for(let i=0;i<max;i++){
      rows+=`<tr><td><b>Bloque ${i+1}</b></td>${DAYS.map(day=>{
        const s=(state.schedule[day]||[])[i]||{block:i+1,time:'',area:'Libre'};
        const opts=areaChoicesForEditor(s.area).map(a=>`<option ${a===s.area?'selected':''}>${E(a)}</option>`).join('');
        return `<td><select data-day="${day}" data-slot="${i}" class="dd-sch-area">${opts}</select><input data-day="${day}" data-slot="${i}" class="dd-sch-time" value="${E(s.time||'')}" placeholder="Hora"></td>`;
      }).join('')}</tr>`;
    }
    return `<div class="dd-scroll"><table class="dd-table dd-schedule-table"><thead><tr><th>Bloque</th>${DAYS.map(d=>`<th>${d}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>`;
  }

  function renderScheduleCard(){
    const card=byId('ddScheduleCard');if(!card)return;
    const weekly=countWeekly();
    card.innerHTML=`<h2>🗓️ Horario de clases</h2><div class="success"><b>Horario guardado:</b> ${E(state.scheduleSource)} · ${weekly} sesiones/semana. No tendrás que volver a subirlo mientras no cambie.</div><div class="form2 topgap"><label>Distribución para nuevas unidades/proyectos<select id="ddSessionMode"><option value="schedule" ${state.unitSessionMode==='schedule'?'selected':''}>Usar mi horario guardado</option><option value="2" ${state.unitSessionMode==='2'?'selected':''}>2 sesiones por día</option><option value="3" ${state.unitSessionMode==='3'?'selected':''}>3 sesiones por día</option></select></label><label>Subir horario en Word (.docx)<input id="ddScheduleFile" type="file" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"></label></div><div class="actions"><button class="btn alt" id="ddToggleSchedule">👁 Ver/editar horario</button><button class="btn ghost" id="ddUseModelSchedule">↺ Usar horario modelo actual</button></div><div id="ddScheduleEditor" class="hidden topgap"></div><div id="ddScheduleImportMsg" class="notice hidden topgap"></div>`;
    byId('ddSessionMode').onchange=e=>{state.unitSessionMode=e.target.value;save();};
    byId('ddToggleSchedule').onclick=()=>{
      const ed=byId('ddScheduleEditor');ed.classList.toggle('hidden');
      if(!ed.classList.contains('hidden')){ed.innerHTML=scheduleEditorHtml()+`<div class="actions"><button class="btn" id="ddSaveSchedule">💾 Guardar horario</button><button class="btn ghost" id="ddAddBlock">➕ Añadir bloque</button></div>`;wireEditor();}
    };
    byId('ddUseModelSchedule').onclick=()=>{state.schedule=clone(DEFAULT_SCHEDULE);state.scheduleSource='Horario modelo del docente';save();renderScheduleCard();};
    byId('ddScheduleFile').onchange=e=>importWordSchedule(e.target.files?.[0]);
  }

  function wireEditor(){
    byId('ddSaveSchedule').onclick=()=>{
      const out={};DAYS.forEach(d=>out[d]=[]);
      document.querySelectorAll('.dd-sch-area').forEach(sel=>{
        const day=sel.dataset.day,slot=+sel.dataset.slot;
        const time=document.querySelector(`.dd-sch-time[data-day="${day}"][data-slot="${slot}"]`)?.value||'';
        out[day][slot]={block:slot+1,time,area:sel.value};
      });
      state.schedule=out;state.scheduleSource='Horario configurado y guardado';save();renderScheduleCard();alert('Horario guardado. DocenteDigital lo reutilizará en las siguientes unidades y proyectos.');
    };
    byId('ddAddBlock').onclick=()=>{DAYS.forEach(d=>{state.schedule[d]=state.schedule[d]||[];state.schedule[d].push({block:state.schedule[d].length+1,time:'',area:'Libre'});});save();const ed=byId('ddScheduleEditor');ed.innerHTML=scheduleEditorHtml()+`<div class="actions"><button class="btn" id="ddSaveSchedule">💾 Guardar horario</button><button class="btn ghost" id="ddAddBlock">➕ Añadir bloque</button></div>`;wireEditor();};
  }

  function loadMammoth(){
    if(window.mammoth)return Promise.resolve();
    return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='https://unpkg.com/mammoth@1.8.0/mammoth.browser.min.js';s.onload=resolve;s.onerror=reject;document.head.appendChild(s);});
  }

  function canonicalHeader(t){return t.normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();}
  async function importWordSchedule(file){
    if(!file)return;
    const msg=byId('ddScheduleImportMsg');msg.classList.remove('hidden');msg.textContent='Analizando el horario Word…';
    try{
      await loadMammoth();
      const arrayBuffer=await file.arrayBuffer();
      const result=await mammoth.convertToHtml({arrayBuffer});
      const doc=new DOMParser().parseFromString(result.value,'text/html');
      const tables=[...doc.querySelectorAll('table')];
      const table=tables.find(t=>{const tx=canonicalHeader(t.textContent);return DAYS.every(d=>tx.includes(canonicalHeader(d)));});
      if(!table)throw new Error('No se encontró una tabla con los días de la semana.');
      const rows=[...table.querySelectorAll('tr')];
      const headerIndex=rows.findIndex(r=>DAYS.every(d=>canonicalHeader(r.textContent).includes(canonicalHeader(d))));
      const headers=[...rows[headerIndex].querySelectorAll('th,td')].map(c=>canonicalHeader(c.textContent));
      const dayPos={};DAYS.forEach(d=>dayPos[d]=headers.findIndex(h=>h===canonicalHeader(d)||h.includes(canonicalHeader(d))));
      const parsed={};DAYS.forEach(d=>parsed[d]=[]);
      let block=0;
      rows.slice(headerIndex+1).forEach(r=>{
        const cells=[...r.querySelectorAll('th,td')].map(c=>c.textContent.trim().replace(/\s+/g,' '));
        const joined=canonicalHeader(cells.join(' '));
        if(/receso|almuerzo/.test(joined))return;
        if(/bloque/.test(joined))block++;
        if(!block)block=Math.max(1,...DAYS.map(d=>parsed[d].length+1));
        DAYS.forEach(day=>{
          const pos=dayPos[day]; if(pos<0||!cells[pos])return;
          const raw=cells[pos]; const area=normalizeArea(raw); if(!area||area==='Tutoría')return;
          if(!parsed[day].some(x=>x.block===block&&normalizeArea(x.area)===area))parsed[day].push({block,time:'',area:raw});
        });
      });
      const found=countWeekly(parsed);
      if(found<5)throw new Error('Se detectaron muy pocas áreas automáticamente.');
      state.schedule=parsed;state.scheduleSource=`Word: ${file.name}`;save();renderScheduleCard();
      byId('ddScheduleImportMsg').classList.remove('hidden');byId('ddScheduleImportMsg').innerHTML=`✓ Horario leído y guardado desde <b>${E(file.name)}</b>. Se detectaron ${found} sesiones semanales. Pulsa “Ver/editar horario” para confirmar o corregir.`;
    }catch(err){
      msg.classList.remove('hidden');msg.innerHTML=`No pude interpretar automáticamente toda la tabla (${E(err.message)}). Puedes abrir <b>Ver/editar horario</b>, copiar/corregir las áreas una sola vez y guardarlo.`;
    }
  }

  // Inserta el horario en Mi planificación y Configuración.
  const library=byId('unitsLibrary');
  if(library&&!byId('ddScheduleCard')){
    const card=document.createElement('div');card.id='ddScheduleCard';card.className='card topgap';library.parentElement.insertBefore(card,library);renderScheduleCard();
  }
  const settingsCard=byId('settings')?.querySelector('.card');
  if(settingsCard&&!byId('ddScheduleSettingsInfo')){
    const info=document.createElement('div');info.id='ddScheduleSettingsInfo';info.className='notice topgap';info.innerHTML=`🗓️ <b>Horario:</b> ${countWeekly()} sesiones semanales guardadas. Puedes editarlo desde <b>Mi planificación → Horario de clases</b>.`;settingsCard.appendChild(info);
  }

  // Añade el selector también junto a la creación de unidad para que el docente decida sin ir a otra pantalla.
  const duration=byId('unitDuration');
  if(duration&&!byId('ddUnitModeInline')){
    const label=document.createElement('label');label.id='ddUnitModeInline';label.innerHTML=`Distribución de sesiones<select id="ddInlineSessionMode"><option value="schedule">Según horario guardado</option><option value="2">2 sesiones por día</option><option value="3">3 sesiones por día</option></select><small>El horario guardado se reutiliza automáticamente.</small>`;
    duration.closest('.form2')?.insertBefore(label,duration.parentElement.nextSibling);
    const sel=byId('ddInlineSessionMode');sel.value=state.unitSessionMode;sel.onchange=e=>{state.unitSessionMode=e.target.value;save();if(byId('ddSessionMode'))byId('ddSessionMode').value=e.target.value;};
  }

  const css=document.createElement('style');css.textContent=`.dd-schedule-table td{min-width:155px}.dd-schedule-table select,.dd-schedule-table input{width:100%;margin:2px 0;padding:6px;border:1px solid #ccd5d0;border-radius:7px}.dd-schedule-table input{font-size:12px}.dd-sch-summary{font-weight:700}`;document.head.appendChild(css);
})();