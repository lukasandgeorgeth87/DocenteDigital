/* DocenteDigital – capa visible y reversible de Beta Privada v1.2
   - No rebaja el gate de producción.
   - Identifica claramente el estado Beta.
   - Permite exportar/restaurar un respaldo JSON del estado local.
   - Carga de forma no crítica el reporte local de incidencias del piloto.
*/
(function(){
  if(window.__ddBetaLaunchSafetyV1)return;
  window.__ddBetaLaunchSafetyV1=true;

  const KEY='docenteDigitalPrototype';
  const IMPORT_BACKUP_KEY='docenteDigitalPrototype_import_backup';
  const MAX_IMPORT_BYTES=5*1024*1024;

  function validState(value){
    if(!value||typeof value!=='object'||Array.isArray(value))return false;
    if(value.units!==undefined&&!Array.isArray(value.units))return false;
    if(value.grades!==undefined&&!Array.isArray(value.grades))return false;
    if(value.areas!==undefined&&!Array.isArray(value.areas))return false;
    if(value.lastSession!==undefined&&value.lastSession!==null&&typeof value.lastSession!=='object')return false;
    return true;
  }

  function safeFileName(){
    const stamp=new Date().toISOString().slice(0,19).replace(/[:T]/g,'-');
    return `DocenteDigital_respaldo_${stamp}.json`;
  }

  function exportBackup(){
    let raw='';
    try{raw=localStorage.getItem(KEY)||'{}';}
    catch(error){alert('No se pudo leer el almacenamiento local para crear el respaldo.');return;}
    let data;
    try{data=JSON.parse(raw);}catch(error){alert('El estado local no es válido. No se generará un respaldo defectuoso.');return;}
    if(!validState(data)){alert('El estado local no supera la validación mínima.');return;}
    const envelope={format:'DocenteDigitalBackup',version:1,exportedAt:new Date().toISOString(),app:'DocenteDigital',data};
    const blob=new Blob([JSON.stringify(envelope,null,2)],{type:'application/json;charset=utf-8'});
    const link=document.createElement('a');
    link.href=URL.createObjectURL(blob);
    link.download=safeFileName();
    document.body.appendChild(link);
    link.click();
    setTimeout(()=>{URL.revokeObjectURL(link.href);link.remove();},1500);
  }

  async function importBackup(file){
    if(!file)return;
    if(file.size>MAX_IMPORT_BYTES){alert('El respaldo es demasiado grande para esta versión Beta.');return;}
    let text='';
    try{text=await file.text();}catch(error){alert('No se pudo leer el archivo de respaldo.');return;}
    let parsed;
    try{parsed=JSON.parse(text);}catch(error){alert('El archivo no contiene un JSON válido.');return;}
    const data=parsed?.format==='DocenteDigitalBackup'?parsed.data:parsed;
    if(!validState(data)){alert('El archivo no parece un respaldo válido de DocenteDigital.');return;}
    if(!confirm('¿Restaurar este respaldo? Se guardará primero una copia del estado actual para poder recuperarlo manualmente si fuera necesario.'))return;
    try{
      const current=localStorage.getItem(KEY);
      if(current!==null)localStorage.setItem(IMPORT_BACKUP_KEY,JSON.stringify({savedAt:new Date().toISOString(),data:current}));
      localStorage.setItem(KEY,JSON.stringify(data));
      location.reload();
    }catch(error){
      alert('No se pudo restaurar el respaldo. El estado actual se conservará.');
      console.warn('DocenteDigital: fallo de restauración JSON.',error);
    }
  }

  function addBanner(){
    if(document.getElementById('ddBetaBanner')||!document.body)return;
    const banner=document.createElement('div');
    banner.id='ddBetaBanner';
    banner.setAttribute('role','status');
    banner.style.cssText='position:relative;z-index:50;background:#fff7df;border-bottom:1px solid #e7c56d;color:#4c3907;padding:8px 14px;text-align:center;font:600 13px/1.35 system-ui,sans-serif';
    banner.innerHTML='<b>BETA PRIVADA</b> · Revisa los documentos antes de usarlos. No ingreses DNI, teléfonos, direcciones, diagnósticos ni evidencias sensibles de estudiantes durante este piloto.';
    const topbar=document.querySelector('.topbar');
    if(topbar)topbar.insertAdjacentElement('afterend',banner);else document.body.prepend(banner);
  }

  function addBackupCard(){
    const settings=document.getElementById('settings');
    if(!settings||document.getElementById('ddBetaBackupCard'))return;
    const card=document.createElement('div');
    card.id='ddBetaBackupCard';
    card.className='card topgap';
    card.innerHTML=`<h2>💾 Respaldo de esta Beta</h2>
      <p class="sub">Guarda una copia local de tu configuración, unidades y última sesión antes de hacer cambios importantes.</p>
      <div class="notice"><b>Importante:</b> el respaldo se descarga en tu dispositivo y puede contener todo lo escrito en la Beta. Guárdalo de forma privada y no lo compartas si contiene información identificable.</div>
      <div class="actions topgap">
        <button type="button" class="btn" id="ddExportBackup">⬇ Descargar respaldo JSON</button>
        <button type="button" class="btn ghost" id="ddImportBackup">↩ Restaurar respaldo</button>
      </div>
      <input id="ddImportBackupFile" type="file" accept="application/json,.json" hidden>`;
    settings.appendChild(card);
    document.getElementById('ddExportBackup').onclick=exportBackup;
    const input=document.getElementById('ddImportBackupFile');
    document.getElementById('ddImportBackup').onclick=()=>input.click();
    input.onchange=async()=>{const file=input.files?.[0];input.value='';await importBackup(file);};
  }

  function loadFeedback(){
    if(window.__ddBetaFeedbackV1||document.querySelector('script[data-dd-beta-feedback]'))return;
    const script=document.createElement('script');
    script.src='beta-feedback-v1.js';
    script.defer=true;
    script.setAttribute('data-dd-beta-feedback','true');
    script.onerror=()=>console.warn('DocenteDigital: no se pudo cargar el reporte local de la Beta.');
    document.body.appendChild(script);
  }

  function exposeStatus(){
    window.ddBetaLaunchSafety={
      version:'v1.2',
      backupFormat:'DocenteDigitalBackup',
      exportBackup,
      validState,
      getStatus:()=>({beta:true,productionApproved:false,backupAvailable:true,feedbackAvailable:!!window.__ddBetaFeedbackV1})
    };
  }

  function init(){addBanner();addBackupCard();exposeStatus();loadFeedback();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
