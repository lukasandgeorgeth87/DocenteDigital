/* DocenteDigital – guardia de acceso a almacenamiento v71
   V4/V5: si el navegador bloquea localStorage, la app no debe quedar en blanco/negro.
   El trabajo continúa en memoria durante esa sesión y se informa claramente que no podrá persistirse.
*/
(function(){
  if(window.__ddStorageAccessGuardV71)return;window.__ddStorageAccessGuardV71=true;

  const previousGetItem=Storage.prototype.getItem;
  const previousSetItem=Storage.prototype.setItem;
  const blockedErrors=new Set(['SecurityError','InvalidStateError','NotAllowedError']);

  function isBlocked(error){
    return !!(error&&blockedErrors.has(error.name));
  }

  function warn(){
    window.__ddStorageAccessBlocked={at:new Date().toISOString()};
    if(!document.body||document.getElementById('ddStorageAccessWarning'))return;
    const box=document.createElement('div');
    box.id='ddStorageAccessWarning';
    box.setAttribute('role','alert');
    box.style.cssText='position:fixed;left:12px;right:12px;bottom:74px;z-index:100000;padding:12px 14px;border-radius:12px;background:#fff4df;border:1px solid #e6bd67;box-shadow:0 4px 18px rgba(0,0,0,.16);font:14px/1.35 system-ui,sans-serif;color:#3b2b0b';
    box.innerHTML='<b>⚠️ El navegador está bloqueando el guardado local.</b><br>Puedes continuar viendo y editando durante esta sesión, pero los cambios podrían perderse al cerrar o recargar. Habilita el almacenamiento del sitio antes de continuar con trabajo importante.';
    document.body.appendChild(box);
  }

  Storage.prototype.getItem=function(key){
    try{return previousGetItem.call(this,key)}
    catch(error){
      if(!isBlocked(error))throw error;
      console.warn('DocenteDigital: el navegador bloqueó la lectura del almacenamiento local.',error);
      warn();
      return null;
    }
  };

  Storage.prototype.setItem=function(key,value){
    try{return previousSetItem.call(this,key,value)}
    catch(error){
      if(!isBlocked(error))throw error;
      console.warn('DocenteDigital: el navegador bloqueó la escritura del almacenamiento local.',error);
      warn();
      return undefined;
    }
  };
})();
