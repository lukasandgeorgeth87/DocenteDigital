/* DocenteDigital – guardia de acciones prototipo del Director v40
   Evita presentar botones aparentemente funcionales cuando todavía no existe un flujo real.
   Regla de producto: un prototipo no debe simular una función terminada.
*/
(function(){
  if(window.__ddDirectorPrototypeGuardV40)return;window.__ddDirectorPrototypeGuardV40=true;

  function mount(){
    const screen=document.getElementById('director');if(!screen)return;
    const buttons=[...screen.querySelectorAll('button')];
    buttons.forEach(btn=>{
      const hasAction=!!(btn.getAttribute('onclick')||btn.dataset.screen||btn.dataset.action||btn.formAction);
      if(hasAction||btn.dataset.ddPrototypeGuard)return;
      btn.dataset.ddPrototypeGuard='1';
      btn.type='button';
      btn.setAttribute('aria-disabled','true');
      btn.title='Función en desarrollo: aún no ejecuta una acción real.';
      btn.addEventListener('click',e=>{
        e.preventDefault();e.stopPropagation();
        alert('Esta función del Módulo Director todavía está en desarrollo. DocenteDigital no la presenta como completada hasta que exista un flujo real y verificable.');
      });
      if(!/en desarrollo/i.test(btn.textContent||''))btn.textContent=`${btn.textContent.trim()} · En desarrollo`;
    });

    let note=document.getElementById('ddDirectorPrototypeNotice');
    if(!note&&buttons.some(b=>b.dataset.ddPrototypeGuard==='1')){
      note=document.createElement('div');note.id='ddDirectorPrototypeNotice';note.className='notice';
      note.style.margin='0 0 12px';
      note.innerHTML='<b>Estado del módulo:</b> las acciones marcadas “En desarrollo” son prototipos visibles y todavía no generan, guardan ni modifican documentos. Las funciones se habilitarán solo cuando tengan un flujo real y verificable.';
      const sub=screen.querySelector('.sub');
      if(sub?.nextSibling)screen.insertBefore(note,sub.nextSibling);else screen.prepend(note);
    }
  }

  const oldGo=window.go;
  if(typeof oldGo==='function')window.go=function(id){const r=oldGo.apply(this,arguments);if(id==='director')setTimeout(mount,0);return r;};
  setTimeout(mount,0);
})();