# AUD-EXPORT-DOCX-PDF-GAP-226

## Alcance
Auditoría V4/V5 de exportación documental en DocenteDigital. Esta pasada no modifica runtime.

## Caso AUD-EXPORT-226-A — DOCX real
- **ID:** AUD-EXPORT-226-A
- **Entrada:** crear una Unidad/Proyecto o Sesión y usar la descarga presentada como Word.
- **Esperado:** archivo Word profesional verificable; para el objetivo V1, DOCX real cuando se ofrezca DOCX/Word moderno, con estructura y extensión coherentes.
- **Obtenido:** `wordDocument()` construye HTML completo; `wordBlob()` lo encapsula con MIME `application/msword;charset=utf-8`; `downloadUnitWord()` y `downloadSessionWord()` descargan extensión `.doc`. No se construye un paquete Office Open XML `.docx` (ZIP con `[Content_Types].xml`, `word/document.xml`, relaciones, etc.).
- **Evidencia:** `app.js`: `wordDocument`, `wordBlob`, `downloadUnitWord`, `downloadSessionWord`.
- **Resultado:** **NO PASA** para DOCX real.
- **Severidad:** **S1 CRÍTICO / bloqueante V5 de exportación profesional pendiente**.
- **Clasificación:** descarga Word legacy = **PARCIALMENTE FUNCIONAL**; DOCX = **INEXISTENTE**; validación profesional de 20 archivos Word = **NO DEMOSTRADA**.
- **Acción:** implementar exportador DOCX real y pruebas automáticas de integridad del paquete, más prueba manual/documental de al menos 20 documentos con tablas, imágenes, márgenes, fuentes, encabezados/pies, firmas, saltos, orientación y caracteres quechua. No reemplazar solo la extensión `.doc` por `.docx`, porque produciría un archivo con contenido incompatible.

## Caso AUD-EXPORT-226-B — PDF / Imprimir
- **ID:** AUD-EXPORT-226-B
- **Entrada:** desde vista previa de Unidad/Sesión buscar PDF o Imprimir.
- **Esperado:** V4 exige `Vista previa → Word / PDF / Imprimir`; V5 exige probar PDF e impresión reales.
- **Obtenido:** en `index.html` y `app.js` no existe ruta de exportación PDF ni función de impresión para estos documentos; no se encontró `.pdf` ni generador PDF en el runtime principal auditado.
- **Evidencia:** `index.html` expone descarga/compartir Word en los flujos; `app.js` implementa Blob `.doc` pero no exportación PDF.
- **Resultado:** **NO PASA**.
- **Severidad:** **S1 CRÍTICO / bloqueante de prelan­zamiento**.
- **Clasificación:** PDF = **INEXISTENTE**; imprimir = **INEXISTENTE** en el flujo documental auditado.
- **Acción:** implementar una ruta explícita y verificable de PDF e impresión, con control de errores visible y pruebas de caracteres quechua, tablas, imágenes y saltos de página.

## Relación con V4/V5
- **V4 §32:** Vista previa antes de descargar: `Vista previa → Word / PDF / Imprimir`.
- **V5 §9:** probar al menos 20 documentos Word reales y comprobar formato; probar PDF e impresión reales; Word/PDF corruptos son bloqueantes.
- **V5 Definición LISTA PARA LANZAR:** debe exportar documentos utilizables.

## Decisión
No se aplica corrección rápida. Cambiar solo extensión/MIME sería inseguro y engañoso; agregar un botón PDF sin un generador probado sería una función simulada. Se mantiene el bloqueante V5 hasta contar con exportación real y retest trazable.
