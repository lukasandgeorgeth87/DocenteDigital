/* DocenteDigital – superficie simple de revisión v66.1
   V4: la complejidad de auditoría permanece interna en Modo Fácil.
   No modifica resultados, datos ni reglas de la auditoría; solo evita mostrar
   puntuaciones, telemetría técnica y lenguaje interno de prototipo al usuario.
*/
(function(){
  if(window.__ddEasyAuditSurfaceV661)return;window.__ddEasyAuditSurfaceV661=true;

  const tidy=v=>String(v??'').replace(/\s+/g,' ').trim();
  const easy=()=>typeof state!=='object'||state.mode!=='expert';

  function simplify(){
    if(!easy())return;
    const toast=document.getElementById('ddAuditToast');
    if(!toast)return;
    toast.classList.add('dd-easy-audit-toast');
    const heading=toast.querySelector('.dd-audit-head b');
    if(heading)heading.textContent='✓ Revisando antes de crear';
    const score=toast.querySelector('.dd-audit-head strong');
    if(score)score.setAttribute('aria-hidden','true');
    const small=toast.querySelector('small');
    if(small){
      const hadWarning=/puede seguir|versión final|matriz curricular|literal/i.test(tidy(small.textContent));
      small.textContent=hadWarning
        ?'Puedes continuar con el borrador. Los datos que requieran verificación seguirán marcados como pendientes.'
        :'Comprobamos los datos necesarios para preparar el borrador.';
    }
  }

  function simplifyProductLanguage(){
    const reset=[...document.querySelectorAll('button')].find(button=>(button.getAttribute('onclick')||'').includes('resetDemo'));
    if(reset)reset.textContent='Restablecer datos';

    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    let node;
    while((node=walker.nextNode())){
      if(node.nodeValue&&node.nodeValue.includes('Acceso rápido del prototipo')){
        node.nodeValue=node.nodeValue.replace(/Acceso rápido del prototipo/g,'Acceso rápido');
      }
    }
  }

  function guardResetLanguage(){
    const previous=window.resetDemo;
    if(typeof previous!=='function'||previous.__ddSimpleResetLanguage)return;
    const wrapped=function(){
      const nativeConfirm=window.confirm;
      window.confirm=function(message){
        return nativeConfirm.call(window,String(message||'').replace(/del prototipo/gi,'de la aplicación'));
      };
      try{return previous.apply(this,arguments)}finally{window.confirm=nativeConfirm;}
    };
    wrapped.__ddSimpleResetLanguage=true;
    window.resetDemo=wrapped;
  }

  const observer=new MutationObserver(muts=>{
    if(muts.some(m=>m.addedNodes?.length||m.type==='attributes'))setTimeout(()=>{simplify();simplifyProductLanguage();},0);
  });
  observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});

  const css=document.createElement('style');
  css.textContent=`
    body:not(.expert) #ddAuditToast.dd-easy-audit-toast .dd-audit-grid,
    body:not(.expert) #ddAuditToast.dd-easy-audit-toast .dd-audit-head strong{display:none!important}
    body:not(.expert) #ddAuditToast.dd-easy-audit-toast{width:min(520px,calc(100vw - 24px));padding:12px 14px}
    body:not(.expert) #ddAuditToast.dd-easy-audit-toast .dd-audit-head{margin-bottom:4px}
    body:not(.expert) #ddAuditToast.dd-easy-audit-toast small{margin-top:2px}
  `;
  document.head.appendChild(css);
  guardResetLanguage();
  setTimeout(()=>{simplify();simplifyProductLanguage();},0);

  window.ddEasyAuditSurfaceV66={apply:()=>{simplify();simplifyProductLanguage();}};
})();