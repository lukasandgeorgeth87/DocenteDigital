/* DocenteDigital – seguridad curricular específica de sesiones v67.1
   V3/V5: una sesión no puede presentar una heurística o propuesta generada como
   competencia/capacidad/desempeño oficial mientras la matriz curricular literal,
   versionada y verificada no esté conectada.
   Esta capa no inventa ni corrige currículo: solo evita una afirmación engañosa.
   AUD-284: una sesión productiva tampoco puede nacer de la Unidad/actividad demo del runtime base.
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

  function realSessionSelection(){
    const unitId=document.getElementById('sessionUnit')?.value||'';
    const unit=Array.isArray(state.units)?state.units.find(u=>u&&u.id===unitId):null;
    if(!unit||!Array.isArray(unit.activities)||!unit.activities.length)return{ok:false,unit:null,activity:null};
    const index=parseInt(document.getElementById('activity')?.value||'0',10);
    const activity=Number.isInteger(index)?unit.activities[index]:null;
    if(!activity||!activity.area||!activity.title)return{ok:false,unit,activity:null};
    return{ok:true,unit,activity};
  }

  function explainMissingSessionSource(){
    alert('Primero crea o elige una Unidad/Proyecto con una actividad programada. La sesión debe nacer de esa planificación.');
  }

  const baseBuild=window.buildSession;
  if(typeof baseBuild==='function'&&!baseBuild.__ddRealUnitActivityGuard){
    const wrapped=function(){
      const selection=realSessionSelection();
      if(!selection.ok){explainMissingSessionSource();return null;}
      return baseBuild.apply(this,arguments);
    };
    wrapped.__ddRealUnitActivityGuard=true;
    window.buildSession=wrapped;
  }

  const baseGenerate=window.generateSession;
  if(typeof baseGenerate==='function'&&!baseGenerate.__ddRealUnitActivityGuard){
    const wrapped=function(){
      const selection=realSessionSelection();
      if(!selection.ok){explainMissingSessionSource();return null;}
      return baseGenerate.apply(this,arguments);
    };
    wrapped.__ddRealUnitActivityGuard=true;
    window.generateSession=wrapped;
  }

  window.ddAuditSessionCurriculumSafety=function(){
    const html=document.getElementById('sessionDocument')?.innerHTML||'';
    const unsafe=!ready()&&(/<b>Competencia priorizada:<\/b>/i.test(html)||/<b>Capacidades:<\/b>/i.test(html)||/<b>Desempeño precisado:<\/b>/i.test(html));
    const source=realSessionSelection();
    return{testId:'AUD-SES-CURR-043',matrixReady:ready(),unsafeOfficialLabels:unsafe,realUnitActivity:source.ok,pass:!unsafe&&source.ok};
  };

  const css=document.createElement('style');
  css.textContent='.dd-session-curriculum-safety{margin:8px 0 12px;padding:10px 12px;border:1px solid #dfc36c;border-radius:11px;background:#fff8df;color:#66501a;font-size:13px;line-height:1.4}';
  document.head.appendChild(css);
})();