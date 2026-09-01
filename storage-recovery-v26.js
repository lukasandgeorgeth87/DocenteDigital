/* DocenteDigital – recuperación preventiva de almacenamiento v26 */
(function(){
  if(window.__ddStorageRecoveryV26)return;window.__ddStorageRecoveryV26=true;
  const KEY='docenteDigitalPrototype';
  const RESET_BACKUP_KEY='docenteDigitalPrototype_reset_backup';
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

  /* V4/V5: un restablecimiento no debe convertirse en pérdida irreversible por un clic.
     Conservamos una única copia local recuperable del estado principal antes de borrar. */
  function installRecoverableReset(){
    if(typeof window.resetDemo!=='function'||window.resetDemo.__ddRecoverable)return;
    const previous=window.resetDemo;
    const wrapped=function(){
      const current=localStorage.getItem(KEY);
      if(current===null)return previous.apply(this,arguments);
      const ok=confirm('¿Restablecer la configuración y los datos del prototipo? Se guardará una copia local para que puedas restaurarlos si fue un error.');
      if(!ok)return;
      try{
        nativeSetItem.call(localStorage,RESET_BACKUP_KEY,JSON.stringify({savedAt:new Date().toISOString(),data:current}));
      }catch(error){
        alert('No se pudo crear la copia de recuperación. Para evitar pérdida de información, el restablecimiento fue cancelado.');
        console.warn('DocenteDigital: no se pudo respaldar antes de restablecer.',error);
        return;
      }
      localStorage.removeItem(KEY);
      location.reload();
    };
    wrapped.__ddRecoverable=true;
    window.resetDemo=wrapped;
  }

  function offerResetRestore(){
    if(!document.body||document.getElementById('ddResetRestore'))return;
    let backup=null;
    try{backup=localStorage.getItem(RESET_BACKUP_KEY)}catch(error){return;}
    if(!backup)return;
    const box=document.createElement('div');
    box.id='ddResetRestore';
    box.setAttribute('role','status');
    box.style.cssText='position:fixed;left:12px;right:12px;bottom:74px;z-index:99998;padding:12px 14px;border-radius:12px;background:#eef8f2;border:1px solid #8bc6a0;box-shadow:0 4px 18px rgba(0,0,0,.14);font:14px/1.35 system-ui,sans-serif;color:#17351f;display:flex;gap:10px;align-items:center;justify-content:space-between;flex-wrap:wrap';
    box.innerHTML='<span><b>↩️ Hay una copia del estado anterior.</b> Puedes restaurarla si el restablecimiento fue accidental.</span><span><button type="button" data-action="restore">Restaurar</button> <button type="button" data-action="discard">Descartar copia</button></span>';
    box.querySelectorAll('button').forEach(btn=>{btn.style.cssText='border:0;border-radius:9px;padding:8px 11px;font-weight:700;cursor:pointer'});
    box.querySelector('[data-action="restore"]').onclick=()=>{
      try{
        const parsed=JSON.parse(localStorage.getItem(RESET_BACKUP_KEY)||'null');
        if(!parsed||typeof parsed.data!=='string')throw new Error('Copia inválida');
        nativeSetItem.call(localStorage,KEY,parsed.data);
        localStorage.removeItem(RESET_BACKUP_KEY);
        location.reload();
      }catch(error){
        alert('No se pudo restaurar la copia guardada. No se eliminará automáticamente.');
        console.warn('DocenteDigital: fallo al restaurar copia de restablecimiento.',error);
      }
    };
    box.querySelector('[data-action="discard"]').onclick=()=>{
      if(confirm('¿Descartar definitivamente esta copia de recuperación?')){localStorage.removeItem(RESET_BACKUP_KEY);box.remove();}
    };
    document.body.appendChild(box);
  }

  const initResetSafety=()=>{installRecoverableReset();offerResetRestore();};
  if(document.readyState==='loading')window.addEventListener('DOMContentLoaded',()=>setTimeout(initResetSafety,0),{once:true});
  else setTimeout(initResetSafety,0);
})();