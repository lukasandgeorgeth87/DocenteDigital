/* DocenteDigital – guardia de acceso a almacenamiento v71.1
   V4/V5: si el navegador bloquea localStorage o se agota su cuota,
   la app no debe romperse ni ocultar que el guardado dejó de ser confiable.
   El trabajo continúa en memoria durante esa sesión y se informa claramente.
*/
(function(){
  if(window.__ddStorageAccessGuardV71)return;window.__ddStorageAccessGuardV71=true;

  const previousGetItem=Storage.prototype.getItem;
  const previousSetItem=Storage.prototype.setItem;
  const blockedErrors=new Set(['SecurityError','InvalidStateError','NotAllowedError']);
  const quotaErrors=new Set(['QuotaExceededError','NS_ERROR_DOM_QUOTA_REACHED']);

  function classify(error){
    if(!error)return '';
    if(blockedErrors.has(error.name))return 'blocked';
    if(quotaErrors.has(error.name)||error.code===22||error.code===1014)return 'quota';
    return '';
  }

  function warn(reason){
    window.__ddStorageAccessBlocked={at:new Date().toISOString(),reason};
    if(!document.body||document.getElementById('ddStorageAccessWarning'))return;
    const box=document.createElement('div');
    box.id='ddStorageAccessWarning';
    box.setAttribute('role','alert');
    box.style.cssText='position:fixed;left:12px;right:12px;bottom:74px;z-index:100000;padding:12px 14px;border-radius:12px;background:#fff4df;border:1px solid #e6bd67;box-shadow:0 4px 18px rgba(0,0,0,.16);font:14px/1.35 system-ui,sans-serif;color:#3b2b0b';
    box.innerHTML=reason==='quota'
      ?'<b>⚠️ No pudimos guardar porque el almacenamiento del navegador está lleno.</b><br>Puedes seguir trabajando durante esta sesión, pero los cambios nuevos podrían perderse al cerrar o recargar. Libera espacio antes de continuar con trabajo importante.'
      :'<b>⚠️ El navegador está bloqueando el guardado local.</b><br>Puedes continuar viendo y editando durante esta sesión, pero los cambios podrían perderse al cerrar o recargar. Habilita el almacenamiento del sitio antes de continuar con trabajo importante.';
    document.body.appendChild(box);
  }

  Storage.prototype.getItem=function(key){
    try{return previousGetItem.call(this,key)}
    catch(error){
      const reason=classify(error);
      if(reason!=='blocked')throw error;
      console.warn('DocenteDigital: el navegador bloqueó la lectura del almacenamiento local.',error);
      warn(reason);
      return null;
    }
  };

  Storage.prototype.setItem=function(key,value){
    try{return previousSetItem.call(this,key,value)}
    catch(error){
      const reason=classify(error);
      if(!reason)throw error;
      console.warn(reason==='quota'
        ?'DocenteDigital: el almacenamiento local está lleno; el cambio no pudo guardarse.'
        :'DocenteDigital: el navegador bloqueó la escritura del almacenamiento local.',error);
      warn(reason);
      return undefined;
    }
  };
})();
