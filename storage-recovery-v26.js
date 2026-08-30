/* DocenteDigital – recuperación preventiva de almacenamiento v26 */
(function(){
  if(window.__ddStorageRecoveryV26)return;window.__ddStorageRecoveryV26=true;
  const KEY='docenteDigitalPrototype';
  let raw=null;
  try{
    raw=localStorage.getItem(KEY);
    if(!raw)return;
    const parsed=JSON.parse(raw);
    if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))throw new Error('Estado guardado no es un objeto válido');
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
})();