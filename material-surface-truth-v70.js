/* DocenteDigital – verdad de superficie del módulo Materiales v70
   V3/V4/V5: una función todavía no conectada a generación real no debe presentarse como terminada.
*/
(function(){
  if(window.__ddMaterialSurfaceTruthV70)return;window.__ddMaterialSurfaceTruthV70=true;

  function apply(){
    const homeCard=[...document.querySelectorAll('#home .action-card')].find(b=>/Materiales/i.test(b.querySelector('h2')?.textContent||''));
    if(homeCard){
      const p=homeCard.querySelector('p');
      if(p)p.textContent='Registra el tema y el idioma. La generación contextualizada aún está en desarrollo.';
    }

    const section=document.getElementById('materials');
    if(!section)return;
    const sub=section.querySelector(':scope > .sub');
    if(sub)sub.textContent='Prepara la solicitud del material. La generación contextualizada todavía está en desarrollo.';

    const button=[...section.querySelectorAll('button')].find(b=>/crear lectura/i.test(b.textContent||''));
    if(button){
      button.textContent='Revisar solicitud de material';
      button.setAttribute('aria-label','Revisar solicitud de material');
    }

    const output=document.getElementById('materialOutput');
    const heading=output?.querySelector('h2');
    if(heading&&/Lectura generada/i.test(heading.textContent||''))heading.textContent='Estado del material';
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});
  else apply();
  setTimeout(apply,250);

  window.ddAuditMaterialSurfaceTruth=function(){
    const section=document.getElementById('materials');
    const button=[...section?.querySelectorAll('button')||[]].find(b=>/solicitud de material/i.test(b.textContent||''));
    return {
      guard:'v70',
      truthfulSurface:Boolean(button),
      generationDeclaredReady:false,
      physicalOutputTested:false
    };
  };
})();