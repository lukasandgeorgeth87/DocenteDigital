// Small, deterministic pre-provider safety net for accidental identifiers
// pasted into pedagogical prompts. This is not anonymization: free-text names
// without labels, addresses and rare identifiers still require teacher review.
function redactPersonalData(value){
  return String(value??'')
    // Case-insensitive labels but CASE-SENSITIVE name tokens: a trailing
    // lower-case verb ("aprende a sembrar") must not be mistaken for a surname.
    // Permit particles (de la / del) and uppercase names common in school lists.
    .replace(/\b([Ee][Ss][Tt][Uu][Dd][Ii][Aa][Nn][Tt][Ee]|[Aa][Ll][Uu][Mm][Nn][AaOo])\s*:\s*[A-ZÁÉÍÓÚÑ][a-záéíóúñA-ZÁÉÍÓÚÑ]*(?:[-'][A-ZÁÉÍÓÚÑ][a-záéíóúñA-ZÁÉÍÓÚÑ]*)*(?:\s+(?:(?:de|del|la|las|los|y)\s+){0,3}[A-ZÁÉÍÓÚÑ][a-záéíóúñA-ZÁÉÍÓÚÑ]*(?:[-'][A-ZÁÉÍÓÚÑ][a-záéíóúñA-ZÁÉÍÓÚÑ]*)*){0,5}/g,'$1: [nombre omitido]')
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,'[correo omitido]')
    // Also redact labeled DNI with grouped digits (spaces, dots, hyphens or slashes).
    .replace(/\b(?:DNI|D\.N\.I\.?|documento(?: nacional)? de identidad)\s*(?:N[°º.]?\s*)?[:#-]?\s*\d(?:[\s.\/-]?\d){7}(?!\d)/gi,'DNI [omitido]')
    .replace(/(?<!\d)(?:\+?51[\s.-]*)?9(?:[\s.-]?\d){8}(?!\d)/g,'[teléfono omitido]');
}
module.exports={redactPersonalData};
