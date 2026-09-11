# AUD-WORD-EXPORT-NOT-DOCX-PDF-207 — rectificación acumulativa

## Estado actual

**Estado:** RETIRADO como bloqueante independiente por premisa técnica incorrecta y solapamiento con `AUD-EXPORT-PDF-162`.  
**Clasificación histórica:** el hallazgo original mezcló una observación válida sobre PDF/impresión ausentes con una afirmación incorrecta de que el DOCX nativo era inexistente.  
**Severidad contabilizable:** **NO CONTABILIZAR S1 adicional**. El bloqueante de PDF/impresión y pruebas físicas continúa canónicamente en `AUD-EXPORT-PDF-162`.

## Especificaciones obligatorias aplicadas

Esta rectificación se contrasta conjuntamente con:

- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

V3 obliga a demostrar el comportamiento real; por ello no basta inspeccionar las funciones legado de `app.js`. Debe seguirse la cadena completa `asset → wiring directo/transitivo → ejecución → comportamiento probado`.

## ID de prueba

`AUD-WORD-EXPORT-NOT-DOCX-PDF-207`

## Entrada de reprueba

1. Inspeccionar la implementación vigente de exportación en `app.js`.
2. Inspeccionar `docx-export-v29.js`.
3. Seguir el grafo de carga real desde `schedule-prompt-v6.js`.
4. Verificar si el módulo DOCX sustituye las funciones legado `downloadUnitWord`, `shareUnit`, `downloadSessionWord` y `shareSession`.
5. Separar la capacidad DOCX de las capacidades PDF/impresión y de las pruebas físicas V5.

## Resultado esperado

- Un DOCX real debe producir un paquete OOXML `.docx`, con MIME coherente y una estructura ZIP/OOXML válida.
- Si el exportador real está cableado en el runtime, no debe clasificarse como inexistente por observar únicamente el fallback legado de `app.js`.
- PDF/impresión deben evaluarse por separado.
- Las pruebas físicas de apertura, fidelidad y compatibilidad móvil siguen pendientes hasta ejecutarse realmente.

## Resultado obtenido

### A. El DOCX nativo sí existe

`docx-export-v29.js` construye explícitamente un paquete ZIP OOXML con:

- `[Content_Types].xml`;
- `_rels/.rels`;
- `word/document.xml`;
- MIME `application/vnd.openxmlformats-officedocument.wordprocessingml.document`;
- extensión `.docx`.

El módulo redefine en `window` las acciones de exportación de Unidad/Proyecto y Sesión, por lo que reemplaza la salida legado `.doc` cuando termina de cargar.

### B. El exportador DOCX sí está integrado en la cadena estable

`schedule-prompt-v6.js` incluye expresamente `docx-export-v29.js` en `__ddStableModuleLoaderV49`, después de `export-fallback-guard-v39.js`.

Por tanto, la afirmación original de AUD-207 —“DOCX nativo = INEXISTENTE”— es incorrecta para el runtime actual y ya era incompatible con la implementación existente.

### C. El bloqueante PDF/impresión permanece, pero ya tiene hallazgo canónico

`AUD-EXPORT-PDF-162` documenta correctamente que:

- DOCX técnico existe pero requiere validación física;
- PDF no está implementado en el flujo productivo;
- impresión guiada/controlada no está implementada;
- faltan las pruebas V5 de 20 documentos reales, PDF, impresión y dispositivos físicos.

Mantener otro S1 en AUD-207 por la misma brecha duplicaría la penalización.

## PASA / NO PASA

- **Existencia técnica de DOCX OOXML:** PASA.
- **Wiring del exportador DOCX en el loader estable:** PASA.
- **Apertura/fidelidad física en Word y móvil:** PENDIENTE.
- **PDF/impresión:** NO PASA, registrado canónicamente en `AUD-EXPORT-PDF-162`.
- **Gate V5 de exportación profesional completo:** NO PASA por AUD-162 y por las pruebas físicas todavía pendientes.

## Clasificación funcional corregida

- DOCX técnico: **PARCIALMENTE FUNCIONAL**, no inexistente.
- Descarga/compartición DOCX: implementada técnicamente; requiere E2E físico.
- PDF: **INEXISTENTE** según AUD-162.
- Impresión guiada/controlada: **INEXISTENTE** según AUD-162.
- AUD-207 como hallazgo independiente: **RETIRADO / NO CONTABILIZAR**.

## Causa raíz de la falsa clasificación

La versión original de AUD-207 inspeccionó el fallback legado de `app.js` (`application/msword` + `.doc`) sin seguir la sobreescritura posterior realizada por `docx-export-v29.js` mediante el cargador transitivo de `schedule-prompt-v6.js`.

## Acción correctiva

No se requiere cambio funcional para corregir esta falsa premisa. La acción aplicada es de trazabilidad:

1. retirar el S1 duplicado de AUD-207;
2. conservar AUD-162 como hallazgo canónico de PDF/impresión;
3. mantener pendientes las pruebas físicas de DOCX;
4. exigir en futuras auditorías la cadena completa `asset → wiring → ejecución → comportamiento` antes de declarar una función inexistente.

## Evidencia posterior requerida para aprobar DOCX

- 20 DOCX reales abiertos y revisados;
- tablas, márgenes, orientación, saltos, encabezados/pies e identidad institucional;
- caracteres Unicode/quechua;
- imágenes cuando el flujo las soporte;
- apertura en Microsoft Word y dispositivos físicos relevantes;
- celular económico, celular gama media, tablet y laptop;
- doble clic, compartir/cancelar y fallo de descarga sin duplicaciones ni pérdida de datos.

## Fuente normativa externa

No se aplica ni declara vigente ninguna norma MINEDU externa nueva en esta rectificación. Se sustenta en V2–V5/Núcleo IA y en la implementación técnica del repositorio.

## Impacto

- **IUD/ISU:** no se recalculan; DOCX ya no debe penalizarse como inexistente, pero la experiencia completa de salida sigue pendiente.
- **IFR:** continúa afectado por PDF/impresión y pruebas físicas faltantes.
- **Prelaunch:** continúa bloqueado por `AUD-EXPORT-PDF-162` y otros S0/S1 reales.

## Estado de lanzamiento

DocenteDigital **NO está aprobada para V1.0**. Esta rectificación elimina un falso/duplicado S1, pero no desbloquea el gate V5.