# AUD-DOCX-IMAGE-LOSS-188

## Alcance
Auditoría estática y de runtime productivo de la exportación DOCX, contrastada con AUDITORIA_PRELANZAMIENTO_V5 §9 y el principio V4 de verdad funcional. No se simularon aperturas físicas en Word, impresión ni pruebas de dispositivos reales.

## Caso
**ID:** AUD-DOCX-IMAGE-LOSS-188  
**Entrada:** contenido de Unidad/Sesión que incluya una imagen o recurso visual dentro del HTML exportable y ejecutar `Descargar Word`.  
**Esperado:** el DOCX debe conservar el contenido pedagógico y visual pertinente; V5 exige comprobar imágenes, tablas, márgenes, fuentes, encabezados/pies y caracteres quechua en documentos Word reales.  
**Obtenido:** `docx-export-v29.js` transforma el HTML a OOXML recorriendo TABLE, H1-H4, P, UL/OL y nodos textuales. No implementa manejo de `IMG`, no crea partes `word/media/*`, relaciones de imagen ni DrawingML. Por tanto, una imagen presente en el HTML de origen no puede quedar embebida en el DOCX generado por este runtime. El `ddDocxSelfTest()` solo valida MIME/tamaño y un caso de texto+tabla, por lo que no detecta esta pérdida.  
**Evidencia:** `docx-export-v29.js`: `htmlToWordXml()`, `docxBlob()` y `ddDocxSelfTest()`. La producción actual carga este módulo mediante los loaders auditados y el despliegue correspondiente a `main` está READY.  
**Resultado:** **NO PASA**.  
**Severidad:** **S2 ALTO**; se mantiene el bloqueo V5 de exportación profesional hasta completar pruebas Word/PDF reales.  
**Clasificación:** exportación de texto/tablas = **FUNCIONAL/PARCIAL**; preservación de imágenes = **INEXISTENTE**; fidelidad DOCX completa = **PARCIAL**.  

## Riesgo
Un documento puede parecer exportado correctamente y abrir como DOCX válido, pero perder apoyos visuales, fichas con imágenes, problematizaciones, logotipos o recursos gráficos sin advertencia. Es un error silencioso de fidelidad documental.

## Acción requerida
1. Incorporar soporte OOXML para imágenes (`word/media`, relaciones, tipos de contenido y DrawingML), o utilizar una librería local/fijada y auditada que preserve imágenes sin degradar la CSP.
2. Añadir casos automáticos que fallen si un HTML con `<img>` produce un DOCX sin media/relationships correspondientes.
3. Ejecutar la batería V5 con al menos 20 DOCX reales que incluyan tablas, imágenes, caracteres quechua, membretes y orientación; abrirlos en Word/LibreOffice cuando corresponda a la prueba física autorizada.
4. No declarar exportación profesional completa mientras esta evidencia no exista.

## Corrección automática
No se modifica el runtime en esta pasada. Implementar imágenes en OOXML afecta la estructura interna del archivo, relaciones y compatibilidad; no es un cambio pequeño y seguro para aplicar sin pruebas reales de apertura. La corrección realizada es únicamente de trazabilidad de auditoría.
