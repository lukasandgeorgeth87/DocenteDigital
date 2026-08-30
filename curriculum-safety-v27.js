/* DocenteDigital – seguridad curricular v27
   Regla: mientras no exista matriz curricular oficial literal y versionada,
   ningún texto generado puede presentarse como competencia/capacidad/desempeño oficial MINEDU.
*/
(function(){
  if(window.__ddCurriculumSafetyV27)return;window.__ddCurriculumSafetyV27=true;
  if(typeof state!=='object')return;

  const ready=()=>state.curriculumMatrixReady===true;
  const warningHtml='<div class="dd-curriculum-safety"><b>🛡 Seguridad curricular:</b> la matriz curricular oficial literal todavía no está conectada/verificada. Los textos pedagógicos generados se muestran como <b>orientaciones provisionales</b> y no como competencias, capacidades, estándares o desempeños oficiales MINEDU.</div>';

  function sanitizeHtml(html){
    if(ready()||typeof html!=='string')return html;
    return html
      .replace(/Área \/ Competencia y capacidades/g,'Área / referencia curricular preliminar')
      .replace(/Desempeños precisados por grado/g,'Orientaciones pedagógicas provisionales por grado — NO desempeño oficial')
      .replace(/Desempeño precisado \/ aplicación/g,'Aplicación pedagógica orientativa — verificar fuente oficial')
      .replace(/Modo Experto: competencias, capacidades, desempeños, criterios, enfoques y fuentes normativas\./g,'Modo Experto: referencias pedagógicas provisionales; competencias, capacidades, estándares y desempeños oficiales requieren matriz MINEDU verificada.');
  }

  function markOutput(){
    if(ready())return;
    const out=document.getElementById('unitOutput');
    if(out&&!out.querySelector('.dd-curriculum-safety'))out.insertAdjacentHTML('afterbegin',warningHtml);
    const plan=document.getElementById('plan');
    if(plan&&!plan.querySelector('.dd-curriculum-global-warning')){
      const box=document.createElement('div');box.className='notice dd-curriculum-global-warning';box.innerHTML=warningHtml;
      const h=plan.querySelector('h1');if(h)h.insertAdjacentElement('afterend',box);
    }
  }

  const baseRender=window.renderUnitOutput;
  if(typeof baseRender==='function')window.renderUnitOutput=function(){
    const r=baseRender.apply(this,arguments);
    if(!ready()){
      const out=document.getElementById('unitOutput');
      if(out)out.innerHTML=sanitizeHtml(out.innerHTML);
      markOutput();
    }
    return r;
  };

  const baseWord=window.unitWordHtml;
  if(typeof baseWord==='function')window.unitWordHtml=function(){
    let html=baseWord.apply(this,arguments);
    if(!ready()){
      html=sanitizeHtml(html);
      const note='<div style="border:1px solid #d7b85b;padding:10px;margin:10px 0;background:#fff8df"><b>SEGURIDAD CURRICULAR:</b> matriz oficial literal pendiente de conexión/verificación. Las referencias pedagógicas de este documento no deben interpretarse como competencias, capacidades, estándares o desempeños oficiales MINEDU.</div>';
      const idx=html.indexOf('<body>');html=idx>=0?html.slice(0,idx+6)+note+html.slice(idx+6):note+html;
    }
    return html;
  };

  state.curriculumSafety={version:'v27',officialMatrixReady:ready(),policy:'No presentar contenido generado como currículo oficial sin matriz literal verificada'};
  try{save();}catch(e){console.warn('DocenteDigital: no se pudo guardar el estado de seguridad curricular.',e)}
  markOutput();
  const css=document.createElement('style');css.textContent='.dd-curriculum-safety{margin:8px 0 12px;padding:10px 12px;border:1px solid #dfc36c;border-radius:11px;background:#fff8df;color:#66501a;font-size:13px}.dd-curriculum-global-warning .dd-curriculum-safety{margin:0;border:0;padding:0;background:transparent}';document.head.appendChild(css);
})();