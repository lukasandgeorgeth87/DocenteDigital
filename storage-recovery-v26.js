/* DocenteDigital – recuperación preventiva de almacenamiento v26 */
(function(){
  if(window.__ddStorageRecoveryV26)return;window.__ddStorageRecoveryV26=true;
  const KEY='docenteDigitalPrototype';
  let raw=null;

  try{
    raw=localStorage.getItem(KEY);
    if(raw!==null){
      const parsed=JSON.parse(raw);
      if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))throw new Error('Estado guardado no es un objeto válido');

      /* app.js decide que la configuración está terminada solo por la existencia de level.
         Si una sesión anterior se interrumpió después de elegir nivel, puede abrir Inicio con
         tipo de IE, grados o áreas incompletos. Recuperamos ese estado antes de app.js y
         obligamos a rehacer únicamente la configuración base, sin borrar unidades/sesiones. */
      const levels=['Inicial','Primaria','Secundaria'];
      const ieTypes=['Unidocente','Multigrado','Polidocente'];
      const hasAnySetup=Boolean(parsed.level||parsed.ieType||(Array.isArray(parsed.grades)&&parsed.grades.length)||(Array.isArray(parsed.areas)&&parsed.areas.length));
      const setupComplete=levels.includes(parsed.level)&&ieTypes.includes(parsed.ieType)&&Array.isArray(parsed.grades)&&parsed.grades.length>0&&Array.isArray(parsed.areas)&&parsed.areas.length>0;
      if(hasAnySetup&&!setupComplete){
        parsed.level='';
        parsed.ieType='';
        parsed.grades=[];
        parsed.areas=[];
        localStorage.setItem(KEY,JSON.stringify(parsed));
        raw=JSON.stringify(parsed);
        window.__ddSetupRecovered={at:new Date().toISOString(),reason:'Configuración base incompleta'};
        console.warn('DocenteDigital detectó una configuración incompleta y reabrirá el asistente inicial.',window.__ddSetupRecovered);
      }
    }
  }catch(error){
    const stamp=new Date().toISOString().replace(/[:.]/g,'-');
    let backedUp=false;
    if(raw!==null){
      try{localStorage.setItem(`${KEY}_recovery_${stamp}`,raw);backedUp=true}catch(backupError){console.warn('DocenteDigital: no se pudo crear copia de recuperación.',backupError)}
    }
    try{localStorage.removeItem(KEY)}catch(removeError){console.warn('DocenteDigital: no se pudo limpiar el estado dañado.',removeError)}
    window.__ddStorageRecovered={at:new Date().toISOString(),backedUp,error:String(error&&error.message||error)};
    console.warn('DocenteDigital recuperó un estado local inválido antes del arranque.',window.__ddStorageRecovered);
  }

  /* app.js usa un save() directo. Protegemos Storage antes de que app.js cargue para que
     una cuota llena no rompa clics, cambios de pantalla o generación de documentos. */
  const nativeSetItem=Storage.prototype.setItem;
  function showStorageWarning(){
    if(document.getElementById('ddStorageWarning'))return;
    if(!document.body)return;
    const box=document.createElement('div');
    box.id='ddStorageWarning';
    box.setAttribute('role','alert');
    box.style.cssText='position:fixed;left:12px;right:12px;bottom:74px;z-index:99999;padding:12px 14px;border-radius:12px;background:#fff4df;border:1px solid #e6bd67;box-shadow:0 4px 18px rgba(0,0,0,.16);font:14px/1.35 system-ui,sans-serif;color:#3b2b0b';
    box.innerHTML='<b>⚠️ No se pudo guardar este último cambio en el dispositivo.</b><br>El almacenamiento local está lleno o bloqueado. Puedes seguir viendo la pantalla, pero libera espacio antes de continuar para no perder cambios.';
    document.body.appendChild(box);
  }
  Storage.prototype.setItem=function(key,value){
    try{return nativeSetItem.call(this,key,value)}
    catch(error){
      const quota=error&&(error.name==='QuotaExceededError'||error.name==='NS_ERROR_DOM_QUOTA_REACHED'||error.code===22||error.code===1014);
      if(!quota)throw error;
      window.__ddStorageQuotaError={at:new Date().toISOString(),key:String(key),error:String(error.message||error)};
      console.warn('DocenteDigital: almacenamiento local sin espacio; el cambio no pudo persistirse.',error);
      if(document.body)showStorageWarning();else window.addEventListener('DOMContentLoaded',showStorageWarning,{once:true});
      return undefined;
    }
  };
})();