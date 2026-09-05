# AUD-EXPORT-PDF-162 — PDF e impresión no implementados en el flujo productivo

## Alcance
Auditoría acumulativa V2 + V3 + V4 + V5 + Núcleo IA. Esta prueba no certifica apertura física en Word/PDF ni impresión en dispositivo físico.

## ID de prueba
**AUD-EXPORT-PDF-162**

## Módulo
Exportación profesional / Unidad-Proyecto / Sesión / móvil / Prelaunch V5.

## Entrada
1. Crear o abrir una Unidad/Proyecto real.
2. Revisar las acciones de salida disponibles.
3. Crear una Sesión real vinculada a esa unidad.
4. Revisar las acciones de salida disponibles.
5. Intentar obtener PDF o una vista de impresión desde el flujo principal de DocenteDigital.
6. Revisar la cadena estable de módulos para comprobar si existe una implementación productiva que añada PDF/impresión después de `app.js`.

## Resultado esperado
- V4 §32: `Vista previa → Word / PDF / Imprimir`.
- V3 §17: comparar `vista en app ↔ Word ↔ PDF ↔ impresión`, verificando márgenes, encabezados, tablas, saltos, firmas, anexos, imágenes, tipografía, quechua, caracteres especiales, numeración y orientación.
- V5 §9: probar al menos 20 documentos Word reales y probar **PDF e impresión reales**.
- La descarga no debe considerarse aprobada únicamente porque Word abra.

## Resultado obtenido
### DOCX
Existe `docx-export-v29.js`, cargado por `schedule-prompt-v6.js`, que reemplaza las funciones legado y genera un paquete OOXML `.docx` real con MIME `application/vnd.openxmlformats-officedocument.wordprocessingml.document`. Esto evita registrar como hallazgo la vieja implementación `.doc` de `app.js`.

### PDF / impresión
No se encontró una implementación equivalente de PDF en la cadena estable de módulos. `schedule-prompt-v6.js` carga `export-fallback-guard-v39.js` y `docx-export-v29.js`, pero no carga módulo PDF.

En las superficies actuales:
- Unidad/Proyecto ofrece `Descargar Word` y `Compartir`.
- Sesión ofrece `Descargar Word` y `Compartir`.
- No existe acción visible `PDF`.
- No existe acción visible `Imprimir` ni una vista de impresión controlada por el producto.

Por tanto, DocenteDigital aún no puede demostrar el recorrido V4 `Vista previa → Word / PDF / Imprimir`, ni ejecutar las pruebas obligatorias de PDF/impresión de V3/V5 desde su flujo productivo.

## Evidencia
- `app.js`: `renderUnitOutput()` y `renderSessionOutput()` exponen Word/Compartir, sin PDF/Imprimir.
- `docx-export-v29.js`: implementación OOXML real para `.docx`.
- `schedule-prompt-v6.js`: lista estable de módulos incluye `docx-export-v29.js` pero no un motor PDF.
- Producción `/app.js` fue consultada directamente y respondió HTTP 200 con la misma superficie Word/Compartir.

## PASA / NO PASA
**NO PASA**

## Clasificación
- DOCX técnico: **PARCIALMENTE FUNCIONAL**, pendiente apertura física/20 documentos/impresión/quechua/imágenes.
- PDF: **INEXISTENTE**.
- Impresión guiada/controlada por producto: **INEXISTENTE**.

## Severidad
**S1 — CRÍTICO para Prelaunch V5.**

No se afirma corrupción de archivos PDF porque actualmente no existe exportación PDF que pueda someterse a esa prueba. El bloqueo es de capacidad/evidencia obligatoria previa al lanzamiento.

## Causa raíz
La exportación profesional evolucionó primero hacia DOCX OOXML real, pero el flujo de salida quedó incompleto: no existe aún una capa PDF/impresión homologable con la vista de la app y el DOCX.

## Acción correctiva
No simular PDF descargando HTML renombrado ni usar una captura como sustituto documental.

Implementar una ruta de exportación profesional que:
1. mantenga una fuente estructurada común para vista, DOCX, PDF e impresión;
2. genere PDF válido con fuentes y caracteres Unicode/quechua;
3. controle márgenes, tablas, saltos, orientación, encabezados/pies, imágenes y anexos;
4. incorpore una vista de impresión estable;
5. mantenga botones claros `Word`, `PDF`, `Imprimir` después de la vista previa;
6. aplique protección contra doble clic/duplicado también a PDF;
7. muestre errores comprensibles si falla la generación.

## Repruebas obligatorias
- 20 documentos Word reales + sus PDF equivalentes.
- Unidad y sesión en vertical/horizontal según corresponda.
- Tablas largas y saltos de página.
- Quechua y caracteres especiales.
- Imágenes y fichas cuando estén implementadas.
- Celular económico, gama media, tablet y laptop físicos.
- Impresión física o a impresora PDF del sistema con comparación visual.
- Doble clic rápido en Word/PDF/Imprimir.
- Interrupción o fallo durante la exportación sin pérdida del documento fuente.

## Fuente normativa externa
No se aplicó ni declaró vigente ninguna norma MINEDU nueva en esta prueba. El hallazgo es funcional/técnico y se sustenta en las especificaciones internas V2–V5/Núcleo IA.

## Riesgo de regresión
Medio/alto: una futura capa PDF puede divergir del DOCX o de la vista en app. Debe partir del mismo modelo documental y añadirse al smoke gate antes de publicación.

## Impacto en indicadores
- **IUD:** pendiente; una salida incompleta obliga al usuario a resolver PDF/impresión fuera de la app.
- **ICGD:** pendiente; no cambia calidad pedagógica, pero sí la utilizabilidad documental final.
- **IFR:** negativo mientras PDF/impresión no existan y no se prueben.
- **ISU:** no definitivo; falta la ruta simple de salida exigida por V4.
- **Prelaunch:** bloqueado hasta implementar y probar PDF/impresión reales.

## Estado de lanzamiento
**DocenteDigital NO está aprobada para V1.0.** Este hallazgo se suma a los bloqueantes V5 ya abiertos y no reemplaza las pruebas físicas, seguridad, restore real, 100 generaciones, año completo, concurrencia y pilotos.