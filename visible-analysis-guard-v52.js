/* DocenteDigital – salida simple v52
   Mantiene el análisis técnico en estado interno, pero no muestra porcentajes,
   confianza ni diagnósticos semánticos al usuario en el flujo normal.
*/
(function(){
  if(window.__ddVisibleAnalysisGuardV52)return;window.__ddVisibleAnalysisGuardV52=true;
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

  document.addEventListener('click',e=>{
    const b=e.target.closest?.('button');
    if(b?.id==='ddAnalyzeDirectorRequest')setTimeout(simplifyDirectorMeaning,30);
  });

  window.ddVisibleAnalysisGuardV52={simplifyDirectorMeaning};
})();