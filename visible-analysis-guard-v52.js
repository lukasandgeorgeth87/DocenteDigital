/* DocenteDigital – salida simple v52.2
   Mantiene el análisis técnico en estado interno, pero no muestra porcentajes,
   confianza, taxonomías ni diagnósticos semánticos al usuario en el flujo normal.
*/
(function(){
  if(window.__ddVisibleAnalysisGuardV522)return;window.__ddVisibleAnalysisGuardV522=true;
  if(typeof state!=='object')return;
  const tidy=v=>String(v??'').replace(/\s+/g,' ').trim();
  const esc=v=>typeof window.escapeHtml==='function'?window.escapeHtml(String(v??'')):String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function simplifyDirectorMeaning(){
    const r=document.getElementById('ddDirectorMeaningResult');
    const p=state.semanticProfiles?.directorDraft;
    if(!r||!p)return;
    const missing=Array.isArray(p.missing)?p.missing.map(tidy).filter(Boolean):[];
    r.innerHTML=`<b>Tipo probable:</b> ${esc(tidy(p.documentType)||'Por determinar')}<br>`+
      `<b>¿Qué necesitas hacer?</b> ${esc(tidy(p.intentKind)||'Por precisar')}<br>`+
      `<b>Tema principal:</b> ${esc(tidy(p.focus)||'Por precisar')}<br>`+
      `<b>Resultado esperado:</b> ${esc(tidy(p.desiredOutcome)||'No expresado todavía')}`+
      (missing.length?`<br><b>Antes de continuar, conviene precisar:</b> ${esc(missing.join('; '))}`:'')+
      `<br><small>Usaremos esta interpretación como apoyo y verificaremos los requisitos antes de construir el documento.</small>`;
  }

  function simplifyTeacherMeaning(){
    const box=document.getElementById('ddIntentBox');
    if(!box)return;

    // El análisis detallado permanece en state.lastPlanningMeaning para auditoría,
    // pero no debe convertirse en carga cognitiva para el docente.
    box.querySelector('.dd-intent-grid')?.remove();
    box.querySelector('.dd-meaning-synthesis')?.remove();

    const lead=[...box.children].find(el=>el.tagName==='B'&&!el.classList.contains('dd-title-label'));
    if(lead&&tidy(lead.textContent)!=='✨ Propuestas según tu idea')lead.textContent='✨ Propuestas según tu idea';

    const titleLabel=box.querySelector('.dd-title-label');
    if(titleLabel&&tidy(titleLabel.textContent)!=='Títulos propuestos:')titleLabel.textContent='Títulos propuestos:';

    const warning=box.querySelector('.dd-meaning-warning');
    if(warning){
      const simple='⚠️ Falta precisar algunos datos. Puedes completar tu idea o continuar y revisar la propuesta antes de guardarla.';
      if(tidy(warning.textContent)!==simple)warning.textContent=simple;
    }

    [...box.querySelectorAll(':scope > small')].forEach(note=>{
      const text=tidy(note.textContent).toLowerCase();
      if(text.includes('vista previa')||text.includes('historial')||text.includes('análisis se actualiza')||text.includes('analisis se actualiza'))note.remove();
    });
  }

  let teacherTimer=0;
  function scheduleTeacherSimplification(){
    clearTimeout(teacherTimer);
    teacherTimer=setTimeout(simplifyTeacherMeaning,0);
  }

  document.addEventListener('click',e=>{
    const b=e.target.closest?.('button');
    if(b?.id==='ddAnalyzeDirectorRequest')setTimeout(simplifyDirectorMeaning,30);
  });
  document.addEventListener('input',e=>{
    if(e.target?.id==='unitSituation')setTimeout(scheduleTeacherSimplification,320);
  },true);
  document.addEventListener('change',e=>{
    if(e.target?.id==='unitType')setTimeout(scheduleTeacherSimplification,30);
  },true);

  const observer=new MutationObserver(mutations=>{
    if(mutations.some(m=>m.target?.closest?.('#ddIntentBox')||m.target?.id==='ddIntentBox'))scheduleTeacherSimplification();
  });
  function armTeacherObserver(){
    const box=document.getElementById('ddIntentBox');
    if(box){observer.observe(box,{subtree:true,childList:true,characterData:true});simplifyTeacherMeaning();return;}
    setTimeout(armTeacherObserver,250);
  }
  setTimeout(armTeacherObserver,0);

  window.ddVisibleAnalysisGuardV52={simplifyDirectorMeaning,simplifyTeacherMeaning};
})();