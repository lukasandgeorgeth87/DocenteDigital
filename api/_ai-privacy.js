// Small, deterministic pre-provider safety net for accidental identifiers
// pasted into pedagogical prompts. This is not anonymization: free-text names
// without labels, addresses and rare identifiers still require teacher review.
function redactPersonalData(value){
  return String(value??'')
    .replace(/\b(estudiante|alumn[oa])\s*:\s*[A-ZÁÉÍÓÚÑ][a-záéíóúñ]*(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]*){0,3}/gi,'$1: [nombre omitido]')
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,'[correo omitido]')
    .replace(/\b(?:DNI|documento(?: nacional)? de identidad)\s*(?:N[°º.]?\s*)?[:#-]?\s*\d{8}\b/gi,'DNI [omitido]')
    .replace(/(?<!\d)(?:\+?51[\s.-]*)?9(?:[\s.-]?\d){8}(?!\d)/g,'[teléfono omitido]');
}
module.exports={redactPersonalData};
