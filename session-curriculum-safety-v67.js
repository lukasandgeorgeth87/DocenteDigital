/* DocenteDigital – seguridad curricular específica de sesiones v67
   V3/V5: una sesión no puede presentar una heurística o propuesta generada como
   competencia/capacidad/desempeño oficial mientras la matriz curricular literal,
   versionada y verificada no esté conectada.
   Esta capa no inventa ni corrige currículo: solo evita una afirmación engañosa.
*/
(function(){
  if(window.__ddSessionCurriculumSafetyV67)return;window.__ddSessionCurriculumSafetyV67=true;
  if(typeof state!=='object')return;

  const ready=()=>state.curriculumMatrixReady===true;
  const note='<div class="dd-session-curriculum-safety"><b>🛡 Referencia curricular provisional.</b> La matriz curricular oficial literal todavía no está conectada/verificada. Revisa la competencia, capacidades y desempeño con la fuente oficial antes de usar o imprimir esta sesión.</div>';

  function sanitize(html){
    if(ready()||typeof html!=='string')return html;
    let out=html
      .replace(/<b>Competencia priorizada:<\/b>/g,'<b>Referencia curricular provisional:<\/b>')
      .replace(/<b>Capacidades:<\/b>/g,'<b>Capacidades por verificar:<\/b>')
      .replace(/<b>Desempeño precisado:<\/b>/g,'<b>Desempeño por verificar:<\/b>');
    if(!out.includes('dd-session-curriculum-safety')){
      const h2=out.match(/<h2[^>]*>.*?<\/h2>/i);
      if(h2)out=out.replace(h2[0],h2[0]+note);
      else out=note+out;
    }
    return out;
  }

  const baseHtml=window.sessionHtml;
  if(typeof baseHtml==='function'&&!baseHtml.__ddSessionCurriculumSafety){
    const wrapped=function(){return sanitize(baseHtml.apply(this,arguments));};
    wrapped.__ddSessionCurriculumSafety=true;
    window.sessionHtml=wrapped;
  }

  const baseRender=window.renderSessionOutput;
  if(typeof baseRender==='function'&&!baseRender.__ddSessionCurriculumSafety){
    const wrapped=function(session){
      const result=baseRender.apply(this,arguments);
      if(!ready()){
        const doc=document.getElementById('sessionDocument');
        if(doc)doc.innerHTML=sanitize(doc.innerHTML);
      }
      return result;
    };
    wrapped.__ddSessionCurriculumSafety=true;
    window.renderSessionOutput=wrapped;
  }

  window.ddAuditSessionCurriculumSafety=function(){
    const html=document.getElementById('sessionDocument')?.innerHTML||'';
    const unsafe=!ready()&&(/<b>Competencia priorizada:<\/b>/i.test(html)||/<b>Capacidades:<\/b>/i.test(html)||/<b>Desempeño precisado:<\/b>/i.test(html));
    return{testId:'AUD-SES-CURR-043',matrixReady:ready(),unsafeOfficialLabels:unsafe,pass:!unsafe};
  };

  const css=document.createElement('style');
  css.textContent='.dd-session-curriculum-safety{margin:8px 0 12px;padding:10px 12px;border:1px solid #dfc36c;border-radius:11px;background:#fff8df;color:#66501a;font-size:13px;line-height:1.4}';
  document.head.appendChild(css);
})();