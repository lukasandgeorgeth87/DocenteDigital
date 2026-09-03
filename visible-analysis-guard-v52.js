/* DocenteDigital – salida simple v52.1
   Mantiene el análisis técnico en estado interno, pero no muestra porcentajes,
   confianza ni diagnósticos semánticos al usuario en el flujo normal.
*/
(function(){
  if(window.__ddVisibleAnalysisGuardV521)return;window.__ddVisibleAnalysisGuardV521=true;
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
      `<br><small>DocenteDigital usará esta interpretación como apoyo y verificará los requisitos correspondientes antes de construir el documento.</small>`;
  }

  function simplifyTeacherMeaning(){
    const box=document.getElementById('ddIntentBox');
    if(!box)return;
    box.querySelectorAll('.dd-intent-grid > span').forEach(row=>{
      const label=tidy(row.querySelector('small')?.textContent).toLowerCase();
      if(label.includes('claridad de la interpretación')||label.includes('claridad de la interpretacion'))row.remove();
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