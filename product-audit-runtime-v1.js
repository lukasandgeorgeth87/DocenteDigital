/* DocenteDigital — auditoría interna de producto v1
   No muestra puntuaciones al docente. Guarda un diagnóstico técnico local para el propietario.
*/
(function(){
  if(window.__ddProductAuditV1)return;
  window.__ddProductAuditV1=true;

  function check(name,pass,detail=''){return {name,pass:Boolean(pass),detail};}
  function run(){
    const checks=[];
    checks.push(check('setup-levels',document.querySelectorAll('#step1 .choice').length>=3,'Inicial/Primaria/Secundaria'));
    checks.push(check('materials-engine',typeof window.DDMaterials?.create==='function'));
    checks.push(check('evaluation-register',typeof window.DDEvaluation?.openRegister==='function'));
    checks.push(check('evaluation-rubric',typeof window.DDEvaluation?.openRubric==='function'));
    checks.push(check('evaluation-feedback',typeof window.DDEvaluation?.openFeedback==='function'));
    checks.push(check('annual-planning',typeof window.DDPlanningTools?.openAnnual==='function'));
    checks.push(check('diagnostic',typeof window.DDPlanningTools?.openDiagnostic==='function'));
    checks.push(check('director-documents',typeof window.DDDirector?.openDocument==='function'));
    checks.push(check('director-plans',typeof window.DDDirector?.openPlan==='function'));
    checks.push(check('docx-real',typeof window.ddDocxSelfTest==='function'&&window.ddDocxSelfTest()===true));
    checks.push(check('backup',typeof window.ddBetaLaunchSafety?.exportBackup==='function'));
    checks.push(check('mobile-more',Boolean(document.getElementById('ddMobileMoreBtn'))));
    checks.push(check('official-curriculum',Boolean(window.DD_OFFICIAL_CURRICULUM?.verified)));
    checks.push(check('performance-matrix',Boolean(window.DD_OFFICIAL_CURRICULUM?.performanceMatrixReady),'Debe permanecer pendiente hasta completar matriz literal/versionada.'));
    const indexText=document.body?.innerText||'';
    checks.push(check('no-visible-coming-soon-nav',![...document.querySelectorAll('.sidebar,.mobile-nav,#home')].some(el=>/Próximamente/.test(el.textContent||''))));
    const blockers={
      authentication:false,
      multiuserIsolation:false,
      cloudPersistence:false,
      serverSideOpenAI:false,
      productionBilling:false,
      physicalExportValidation:false
    };
    const result={
      version:'1.0',
      at:new Date().toISOString(),
      checks,
      passed:checks.filter(x=>x.pass).length,
      total:checks.length,
      productionBlockers:blockers,
      betaReady:checks.filter(x=>!['performance-matrix'].includes(x.name)).every(x=>x.pass),
      productionReady:false
    };
    try{localStorage.setItem('ddProductAuditLatest',JSON.stringify(result));}catch(_e){}
    window.ddProductAuditLatest=result;
    return result;
  }
  function schedule(){setTimeout(run,450);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
  window.ddRunProductAudit=run;
})();