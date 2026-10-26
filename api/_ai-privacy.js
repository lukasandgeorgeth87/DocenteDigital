// Small, deterministic pre-provider safety net for accidental identifiers
// pasted into pedagogical prompts. This is not anonymization: free-text names
// without labels, addresses and rare identifiers still require teacher review.
function redactPersonalData(value){
  return String(value??'')
    // Case-insensitive labels but CASE-SENSITIVE name tokens: a trailing
    // lower-case verb ("aprende a sembrar") must not be mistaken for a surname.
    // Permit particles (de la / del) and uppercase names common in school lists.
    // School roster labels (including uppercase headings) and = / - separators are PII.
    .replace(/\b([Ee][Ss][Tt][Uu][Dd][Ii][Aa][Nn][Tt][Ee]|[Aa][Ll][Uu][Mm][Nn][AaOo]|(?:[Nn]ombres?|NOMBRES?)(?:\s+[Yy]\s+(?:[Aa]pellidos?|APELLIDOS?)|\s+(?:[Cc]ompletos?|COMPLETOS?)|\s+(?:[Dd]el?|DEL?)\s+(?:[Ee]studiante|ESTUDIANTE|[Aa]lumno|ALUMNO|[Aa]lumna|ALUMNA))?|(?:[Aa]pellidos?|APELLIDOS?)(?:\s+[Yy]\s+(?:[Nn]ombres?|NOMBRES?))?)\s*[:=–—-]\s*[A-ZÁÉÍÓÚÑ][a-záéíóúñA-ZÁÉÍÓÚÑ]*(?:[-'][A-ZÁÉÍÓÚÑ][a-záéíóúñA-ZÁÉÍÓÚÑ]*)*(?:\s+(?:(?:de|del|la|las|los|y)\s+){0,3}[A-ZÁÉÍÓÚÑ][a-záéíóúñA-ZÁÉÍÓÚÑ]*(?:[-'][A-ZÁÉÍÓÚÑ][a-záéíóúñA-ZÁÉÍÓÚÑ]*)*){0,5}/g,'$1: [nombre omitido]')
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,'[correo omitido]')
    // Also redact labeled DNI with grouped digits and Peruvian N.º / N.° / Nro. / No. prefixes.
    .replace(/\b(?:DNI|D\.N\.I\.?|documento(?: nacional)? de identidad)\s*[:#-]?\s*(?:N(?:\.\s*[°º]|[°º.]|ro\.?|o\.?|úmero)?\s*)?[:#-]?\s*\d(?:[\s.\/-]?\d){7}(?!\d)/gi,'DNI [omitido]')
    .replace(/(?<!\d)(?:\+?51[\s.-]*)?9(?:[\s.-]?\d){8}(?!\d)/g,'[teléfono omitido]');
}
module.exports={redactPersonalData};
