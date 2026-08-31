/* DocenteDigital – integridad de evaluación diagnóstica v59
   Regla V3/V5: no inventar cantidades, niveles ni resultados de estudiantes.
*/
(function(){
  if(window.__ddDiagnosticIntegrityV59)return;window.__ddDiagnosticIntegrityV59=true;
  const E=v=>typeof window.escapeHtml==='function'?window.escapeHtml(String(v??'')):String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const original=window.generateDiagnostic;
  window.generateDiagnostic=function(){
    const result=document.getElementById('diagnosticResult');
    if(!result){if(typeof original==='function')return original.apply(this,arguments);return;}
    const area=document.getElementById('diagnosticArea')?.value||'área seleccionada';
    result.classList.remove('hidden');
    result.innerHTML=`<div class="notice" role="status"><b>Diagnóstico preparado para ${E(area)}.</b><br>DocenteDigital no mostrará cantidades ni niveles de logro hasta que registres evidencias o resultados reales de tus estudiantes.<br><small>Los datos de ejemplo no se consideran resultados institucionales.</small></div>`;
    try{
      if(typeof state==='object'){
        state.diagnosticDraft={area,createdAt:new Date().toISOString(),status:'pendiente-de-evidencias',results:null,source:'usuario-pendiente'};
        if(typeof save==='function')save();
      }
    }catch(e){console.warn('DocenteDigital: no se pudo guardar el borrador diagnóstico local.',e);}
  };
  window.ddAuditDiagnosticIntegrity=function(){
    const html=document.getElementById('diagnosticResult')?.textContent||'';
    const fabricated=/\b(?:8\s*Consolidado|4\s*En proceso|2\s*Requieren apoyo)\b/i.test(html);
    return {testId:'AUD-EVA-DIAG-016',fabricatedResultsVisible:fabricated,passes:!fabricated};
  };
})();