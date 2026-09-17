/* DocenteDigital – guardia de exportación real v39
   Evita que, si el exportador OOXML no llega a cargar, el usuario reciba HTML disfrazado como .doc.
   docx-export-v29.js reemplaza estas funciones al cargar correctamente.
*/
(function(){
  if(window.__ddExportFallbackGuardV39)return;
  window.__ddExportFallbackGuardV39=true;

  const unavailable=()=>alert('La exportación Word real (.docx) no terminó de cargar. Revisa tu conexión y vuelve a intentarlo. DocenteDigital no descargará un archivo .doc incompatible como reemplazo.');

  window.downloadUnitWord=unavailable;
  window.shareUnit=unavailable;
  window.downloadSessionWord=unavailable;
  window.shareSession=unavailable;

  // Capa no crítica de Beta Privada: aviso visible + respaldo/restauración JSON.
  // Si no carga, las funciones principales siguen operativas y el gate de producción no cambia.
  function loadBetaSafety(){
    if(window.__ddBetaLaunchSafetyV1||document.querySelector('script[data-dd-beta-safety]'))return;
    const script=document.createElement('script');
    script.src='beta-launch-safety-v1.js';
    script.defer=true;
    script.setAttribute('data-dd-beta-safety','true');
    script.onerror=()=>console.warn('DocenteDigital: no se pudo cargar la capa visible de Beta Privada.');
    document.body.appendChild(script);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loadBetaSafety,{once:true});
  else loadBetaSafety();
})();
