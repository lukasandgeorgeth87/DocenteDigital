/* DocenteDigital – integridad del horario v62
   Nunca presenta un horario modelo como si fuera un dato real del docente.
*/
(function(){
  if(window.__ddScheduleIntegrityV62)return;window.__ddScheduleIntegrityV62=true;
  if(typeof state!=='object')return;
  const DAYS=['Lunes','Martes','Miércoles','Jueves','Viernes'];
  const emptySchedule=()=>Object.fromEntries(DAYS.map(d=>[d,[]]));
  const legacyDefault={
    Lunes:[{block:1,time:'8:00 a 9:30',area:'Comunicación'},{block:2,time:'9:45 a 11:15',area:'Personal Social'},{block:3,time:'11:30 a 12:15',area:'Ciencia y Tecnología'}],
    Martes:[{block:1,time:'8:00 a 9:30',area:'Matemática'},{block:2,time:'9:45 a 11:15',area:'Ciencia y Tecnología'},{block:3,time:'11:30 a 12:15',area:'Refuerzo Matemática'}],
    Miércoles:[{block:1,time:'8:00 a 9:30',area:'Comunicación'},{block:2,time:'9:45 a 11:15',area:'Matemática'},{block:3,time:'11:30 a 12:15',area:'Educación Religiosa'}],
    Jueves:[{block:1,time:'8:00 a 9:30',area:'Matemática'},{block:2,time:'9:45 a 11:15',area:'Arte y Cultura'},{block:3,time:'11:30 a 12:15',area:'Refuerzo Comunicación'}],
    Viernes:[{block:1,time:'8:00 a 9:30',area:'Comunicación'},{block:2,time:'9:45 a 11:15',area:'Personal Social'},{block:3,time:'11:30 a 12:15',area:'Educación Física'}]
  };
  const same=(a,b)=>{try{return JSON.stringify(a)===JSON.stringify(b)}catch(e){return false}};
  const source=String(state.scheduleSource||'').trim();
  const autoLegacy=(source===''||source==='Horario guardado del docente')&&same(state.schedule,legacyDefault);
  if(!autoLegacy)return;

  state.schedule=emptySchedule();
  state.scheduleSource='Sin horario confirmado';
  if(!state.unitSessionMode||state.unitSessionMode==='schedule')state.unitSessionMode='2';
  if(typeof save==='function')save();

  const card=document.getElementById('ddScheduleCard');
  if(card){
    const summary=card.querySelector('.success');
    if(summary)summary.innerHTML='<b>Horario:</b> aún no confirmado. Puedes subir tu Word, configurarlo manualmente o usar una distribución provisional de 2 o 3 sesiones por día.';
    const select=document.getElementById('ddSessionMode');if(select)select.value=state.unitSessionMode;
  }
  const inline=document.getElementById('ddInlineSessionMode');if(inline)inline.value=state.unitSessionMode;
  const info=document.getElementById('ddScheduleSettingsInfo');if(info)info.innerHTML='🗓️ <b>Horario:</b> pendiente de confirmar. Puedes configurarlo desde <b>Mi planificación → Horario de clases</b>.';

  window.ddScheduleIntegrityAudit=function(){
    return {source:state.scheduleSource,mode:state.unitSessionMode,weekly:DAYS.reduce((n,d)=>n+((state.schedule?.[d]||[]).length),0),fabricatedDefault:state.scheduleSource==='Horario guardado del docente'&&same(state.schedule,legacyDefault)};
  };
})();