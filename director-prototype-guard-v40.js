/* DocenteDigital – guardia de acciones prototipo del Director v42
   Evita presentar botones aparentemente funcionales cuando todavía no existe un flujo real.
   V4: la limitación se comunica en lenguaje breve y sencillo; el detalle técnico queda fuera de la superficie principal.
*/
(function(){
  if(window.__ddDirectorPrototypeGuardV42)return;window.__ddDirectorPrototypeGuardV42=true;

  function mount(){
    const screen=document.getElementById('director');if(!screen)return;
    const buttons=[...screen.querySelectorAll('button')];
    buttons.forEach(btn=>{
      const hasAction=!!(btn.getAttribute('onclick')||btn.dataset.screen||btn.dataset.action||btn.formAction);
      if(hasAction||btn.dataset.ddPrototypeGuard)return;
      btn.dataset.ddPrototypeGuard='1';
      btn.type='button';
      btn.disabled=true;
      btn.setAttribute('aria-disabled','true');
      btn.title='Esta opción aún está en desarrollo.';
      if(!/en desarrollo/i.test(btn.textContent||''))btn.textContent=`${btn.textContent.trim()} · En desarrollo`;
    });

    let note=document.getElementById('ddDirectorPrototypeNotice');
    if(!note&&buttons.some(b=>b.dataset.ddPrototypeGuard==='1')){
      note=document.createElement('div');note.id='ddDirectorPrototypeNotice';note.className='notice';
      note.style.margin='0 0 12px';
      note.innerHTML='<b>En desarrollo:</b> algunas opciones todavía no están disponibles.';
      const sub=screen.querySelector('.sub');
      if(sub?.nextSibling)screen.insertBefore(note,sub.nextSibling);else screen.prepend(note);
    }
  }

  const oldGo=window.go;
  if(typeof oldGo==='function')window.go=function(id){const r=oldGo.apply(this,arguments);if(id==='director')setTimeout(mount,0);return r;};
  setTimeout(mount,0);
})();