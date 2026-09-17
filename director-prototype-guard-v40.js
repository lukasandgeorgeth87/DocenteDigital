/* DocenteDigital – guardia de acciones prototipo del Director v45
   Evita presentar botones aparentemente funcionales cuando todavía no existe un flujo real.
   Reaplica la verdad de superficie después de navegación, restauración o mutaciones del DOM.
   V45: hace la guarda idempotente para no provocar bucles de MutationObserver al volver a
   aplicar disabled sobre controles ya protegidos.
*/
(function(){
  if(window.__ddDirectorPrototypeGuardV45)return;window.__ddDirectorPrototypeGuardV45=true;

  function ensureMobileNavigation(){
    if(window.__ddMobileNavigationGuardV60||document.querySelector('script[data-dd-early-mobile-nav]'))return;
    const script=document.createElement('script');
    script.src='mobile-navigation-guard-v60.js';
    script.async=false;
    script.setAttribute('data-dd-early-mobile-nav','1');
    script.onerror=()=>console.warn('DocenteDigital: no se pudo cargar tempranamente la navegación móvil; el cargador estable volverá a intentarlo.');
    document.body.appendChild(script);
  }

  function hasRealAction(btn){
    return Boolean(
      btn.hasAttribute('onclick') ||
      btn.hasAttribute('formaction') ||
      btn.dataset.screen ||
      btn.dataset.action ||
      btn.dataset.ddRealAction==='true'
    );
  }

  function guardButton(btn){
    if(!btn||hasRealAction(btn))return false;
    let changed=false;
    if(btn.dataset.ddPrototypeGuard!=='1'){btn.dataset.ddPrototypeGuard='1';changed=true;}
    if(btn.type!=='button'){btn.type='button';changed=true;}
    if(!btn.disabled){btn.disabled=true;changed=true;}
    if(btn.getAttribute('aria-disabled')!=='true'){btn.setAttribute('aria-disabled','true');changed=true;}
    if(btn.getAttribute('title')!=='Esta opción aún está en desarrollo.'){
      btn.setAttribute('title','Esta opción aún está en desarrollo.');changed=true;
    }
    const label=(btn.textContent||'').trim();
    if(label&&!/(en desarrollo|próximamente)/i.test(label)){
      btn.textContent=`${label} · En desarrollo`;changed=true;
    }
    return changed;
  }

  function mount(){
    const screen=document.getElementById('director');if(!screen)return 0;
    const buttons=[...screen.querySelectorAll('button')];
    let changed=0;
    buttons.forEach(btn=>{if(guardButton(btn))changed++;});

    let note=document.getElementById('ddDirectorPrototypeNotice');
    if(!note&&buttons.some(b=>b.dataset.ddPrototypeGuard==='1')){
      note=document.createElement('div');note.id='ddDirectorPrototypeNotice';note.className='notice';
      note.style.margin='0 0 12px';
      note.innerHTML='<b>En desarrollo:</b> estas opciones se habilitarán cuando su flujo completo haya sido validado.';
      const sub=screen.querySelector('.sub');
      if(sub?.nextSibling)screen.insertBefore(note,sub.nextSibling);else screen.prepend(note);
      changed++;
    }
    return changed;
  }

  ensureMobileNavigation();

  const oldGo=window.go;
  if(typeof oldGo==='function'&&!oldGo.__ddDirectorPrototypeWrapped){
    const wrapped=function(id){
      const r=oldGo.apply(this,arguments);
      if(id==='director')setTimeout(mount,0);
      return r;
    };
    wrapped.__ddDirectorPrototypeWrapped=true;
    window.go=wrapped;
  }

  let observer=null;
  let observerScheduled=false;
  function scheduleMount(){
    if(observerScheduled)return;
    observerScheduled=true;
    queueMicrotask(()=>{observerScheduled=false;mount();});
  }
  function startObserver(){
    const screen=document.getElementById('director');if(!screen||observer)return;
    observer=new MutationObserver(scheduleMount);
    observer.observe(screen,{childList:true,subtree:true,attributes:true,attributeFilter:['disabled','onclick','formaction','data-action','data-dd-real-action']});
  }

  function init(){mount();startObserver();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
  setTimeout(init,0);

  window.ddEnforceDirectorPrototypeTruth=mount;
})();