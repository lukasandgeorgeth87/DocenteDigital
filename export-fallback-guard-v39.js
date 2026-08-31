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
})();
