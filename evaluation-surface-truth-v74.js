/* DocenteDigital – verdad funcional de Evaluación v74
   V3/V4/V5: una acción no debe parecer terminada si todavía no guarda, genera ni modifica datos reales.
   Este guard no simula funcionalidad: conserva la demostración existente, pero identifica y desactiva
   los controles finales que hoy no ejecutan ninguna acción.
*/
(function(){
  if(window.__ddEvaluationSurfaceTruthV74)return;window.__ddEvaluationSurfaceTruthV74=true;

  function markIncomplete(kind){
    const panel=document.getElementById('evaluationPanel');if(!panel)return;
    let notice=document.getElementById('ddEvaluationTruthNotice');
    if(!notice){
      notice=document.createElement('div');
      notice.id='ddEvaluationTruthNotice';
      notice.className='notice';
      notice.setAttribute('role','status');
      notice.style.margin='0 0 12px';
      panel.prepend(notice);
    }

    const messages={
      register:'En desarrollo: puedes revisar la interfaz de registro, pero esta versión todavía no guarda la valoración en un registro auxiliar real.',
      unit:'En desarrollo: la creación de la evaluación todavía no genera ni guarda un instrumento real.',
      siagie:'Demostración: la conclusión mostrada no proviene todavía de evidencias reales del estudiante y no debe aprobarse ni copiarse como conclusión final.'
    };
    notice.innerHTML=`<b>${kind==='siagie'?'Demostración':'En desarrollo'}:</b> ${messages[kind]||'Esta función todavía no está disponible para uso real.'}`;

    [...panel.querySelectorAll('button')].forEach(btn=>{
      const hasAction=!!(btn.getAttribute('onclick')||btn.dataset.action||btn.formAction);
      if(hasAction)return;
      btn.type='button';
      btn.disabled=true;
      btn.setAttribute('aria-disabled','true');
      btn.title='Esta acción aún no está disponible.';
      if(!/en desarrollo|no disponible/i.test(btn.textContent||''))btn.textContent=`${btn.textContent.trim()} · En desarrollo`;
    });
  }

  const previous=window.showEvaluation;
  if(typeof previous==='function'){
    window.showEvaluation=function(kind){
      const result=previous.apply(this,arguments);
      setTimeout(()=>markIncomplete(kind),0);
      return result;
    };
  }
})();