/* DocenteDigital – integridad de evaluación diagnóstica v60
   Regla V3/V5: no inventar cantidades, niveles ni resultados de estudiantes.
   Regla curricular: mientras la matriz oficial no esté conectada/verificada,
   la evaluación diagnóstica no puede afirmar que toma automáticamente
   competencias o aprendizajes oficiales del grado anterior.
*/
(function(){
  if(window.__ddDiagnosticIntegrityV60)return;window.__ddDiagnosticIntegrityV60=true;
  const E=v=>typeof window.escapeHtml==='function'?window.escapeHtml(String(v??'')):String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const matrixReady=()=>typeof state==='object'&&state.curriculumMatrixReady===true;

  function markCurricularReference(){
    const panel=document.getElementById('diagnosticPanel');
    if(!panel)return;
    const notice=panel.querySelector('.notice');
    if(!notice)return;
    if(matrixReady()){
      notice.textContent='Referencia curricular conectada y verificada para preparar el diagnóstico.';
      notice.removeAttribute('data-dd-curriculum-pending');
    }else{
      notice.textContent='Referencias curriculares por verificar. La matriz oficial todavía no está conectada; revisa la fuente curricular antes de usar el diagnóstico.';
      notice.setAttribute('data-dd-curriculum-pending','true');
    }
  }

  markCurricularReference();

  const original=window.generateDiagnostic;
  window.generateDiagnostic=function(){
    markCurricularReference();
    const result=document.getElementById('diagnosticResult');
    if(!result){if(typeof original==='function')return original.apply(this,arguments);return;}
    const area=document.getElementById('diagnosticArea')?.value||'área seleccionada';
    result.classList.remove('hidden');
    const curricularNote=matrixReady()
      ?'La referencia curricular está conectada y verificada.'
      :'La referencia curricular oficial sigue pendiente de conexión/verificación; revisa la fuente antes de aplicar el diagnóstico.';
    result.innerHTML=`<div class="notice" role="status"><b>Diagnóstico preparado para ${E(area)}.</b><br>${E(curricularNote)}<br>DocenteDigital no mostrará cantidades ni niveles de logro hasta que registres evidencias o resultados reales de tus estudiantes.<br><small>Los datos de ejemplo no se consideran resultados institucionales.</small></div>`;
    try{
      if(typeof state==='object'){
        state.diagnosticDraft={area,createdAt:new Date().toISOString(),status:'pendiente-de-evidencias',results:null,source:'usuario-pendiente',curriculumMatrixReady:matrixReady()};
        if(typeof save==='function')save();
      }
    }catch(e){console.warn('DocenteDigital: no se pudo guardar el borrador diagnóstico local.',e);}
  };
  window.ddAuditDiagnosticIntegrity=function(){
    const html=document.getElementById('diagnosticResult')?.textContent||'';
    const panelText=document.getElementById('diagnosticPanel')?.textContent||'';
    const fabricated=/\b(?:8\s*Consolidado|4\s*En proceso|2\s*Requieren apoyo)\b/i.test(html);
    const claimsAutomaticOfficialReference=!matrixReady()&&/Referencia automática:\s*competencias y aprendizajes del grado anterior/i.test(panelText);
    return {testId:'AUD-EVA-DIAG-050',matrixReady:matrixReady(),fabricatedResultsVisible:fabricated,unsafeAutomaticCurricularClaim:claimsAutomaticOfficialReference,passes:!fabricated&&!claimsAutomaticOfficialReference};
  };
})();