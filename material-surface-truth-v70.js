/* DocenteDigital – verdad de superficie del módulo Materiales v70.1
   V3/V4/V5: una función todavía no conectada a generación real no debe presentarse como terminada
   ni conservar una acción que ejecute el generador demostrativo legado.
*/
(function(){
  if(window.__ddMaterialSurfaceTruthV701)return;window.__ddMaterialSurfaceTruthV701=true;

  function materialButton(section){
    return [...section?.querySelectorAll('button')||[]].find(b=>
      b.dataset.ddMaterialTruth==='1'||/crear lectura|revisar solicitud de material|generación de material/i.test(b.textContent||'')
    );
  }

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

    const button=materialButton(section);
    if(button){
      if(!button.dataset.ddLegacyAction)button.dataset.ddLegacyAction=button.getAttribute('onclick')||'';
      button.dataset.ddMaterialTruth='1';
      button.removeAttribute('onclick');
      button.disabled=true;
      button.setAttribute('aria-disabled','true');
      button.setAttribute('title','La generación contextualizada de materiales todavía está en desarrollo.');
      button.textContent='Generación de material · En desarrollo';
      button.setAttribute('aria-label','Generación contextualizada de material en desarrollo');
    }

    const output=document.getElementById('materialOutput');
    if(output)output.classList.add('hidden');
    const heading=output?.querySelector('h2');
    if(heading&&/Lectura generada|Estado del material/i.test(heading.textContent||''))heading.textContent='Estado del material';
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});
  else apply();
  setTimeout(apply,250);

  window.ddAuditMaterialSurfaceTruth=function(){
    const section=document.getElementById('materials');
    const button=materialButton(section);
    const inlineAction=button?.getAttribute('onclick')||'';
    return {
      guard:'v70.1',
      truthfulSurface:Boolean(button&&button.disabled&&!inlineAction),
      generationDeclaredReady:false,
      simulatedGeneratorReachable:Boolean(button&&!button.disabled&&/generateMaterial/.test(inlineAction)),
      physicalOutputTested:false
    };
  };
})();