# AUD-DOCX-BOOT-RACE-267 — ventana de exportación legado durante el arranque

## Estado

- **Módulo:** exportación Word / bootstrap / degradación segura.
- **Clasificación actual:** FUNCIONAL EN IMPLEMENTACIÓN; validación E2E temporal real PENDIENTE.
- **Resultado actual:** PASA en invariante estático de bootstrap corregido; E2E con throttling y pruebas físicas PENDIENTES.
- **Severidad:** S2 ALTO histórico; riesgo residual no cerrado hasta prueba interactiva/Word físico.
- **Gate V5:** continúa bloqueado; este hallazgo no sustituye las pruebas físicas DOCX/PDF/impresión.

## Especificaciones obligatorias aplicadas

Se contrastaron conjuntamente `AUDITORIA_MAESTRA_INTEGRAL_V2`, `ADENDA_AUDITORIA_EJECUTABLE_V3`, `AUDITORIA_SIMPLICIDAD_USO_V4`, `AUDITORIA_PRELANZAMIENTO_V5` y `NUCLEO_IA_DOCENTEDIGITAL`.

V3 exige seguir la cadena `asset → wiring → ejecución → comportamiento`; V5 exige degradación segura y exportación real antes del lanzamiento.

## Prueba original

**ID:** `AUD-DOCX-BOOT-RACE-267`  
**Entrada:** arranque limpio o red lenta; `app.js` termina de ejecutarse y, antes de que finalice la carga asíncrona de las guardias/exportador posteriores, se intenta `⬇ Word` o `📤 Compartir` sobre una unidad/sesión ya persistida.  
**Esperado:** desde el primer instante utilizable, el exportador OOXML real está listo o la acción queda bloqueada visiblemente. Nunca debe quedar invocable el exportador legado `.doc`.  
**Obtenido previo:** `app.js` definía sincrónicamente `downloadUnitWord()` con `wordBlob(...)` y extensión `.doc`; las defensas específicas se incorporaban después mediante módulos posteriores. No existía una barrera sincrónica inmediata entre la definición legado y la disponibilidad de las defensas.  
**Resultado previo:** **NO PASA** el invariante de bootstrap.  
**Severidad:** **S2 ALTO**.  
**Clasificación previa:** **PARCIALMENTE FUNCIONAL**.

No se afirmó que un usuario real hubiera descargado un `.doc`; la falla demostrada era el orden de inicialización.

## Causa raíz

La seguridad de exportación dependía de módulos posteriores, mientras las funciones legado quedaban disponibles inmediatamente al ejecutar `app.js`.

## Corrección aplicada — 2026-09-13

Commit funcional: `9acca599ca79e21d843f6cd335e8278b3f35a593` — `fix: close DOCX startup export guard race`.

Se añadió una carga directa de `export-fallback-guard-v39.js` inmediatamente después de `app.js` en `index.html`:

`app.js → export-fallback-guard-v39.js → director-prototype-guard-v40.js → initial-curriculum-guard-v72.js → ... → schedule-prompt-v6.js`

La guardia v39 es idempotente y reemplaza inmediatamente `downloadUnitWord`, `shareUnit`, `downloadSessionWord` y `shareSession` por una degradación visible que no descarga `.doc`. Cuando `docx-export-v29.js` termina de cargar, este reemplaza esas funciones por el exportador OOXML real `.docx`.

## Reprueba posterior

**ID:** `AUD-DOCX-BOOT-RACE-267-R1`  
**Entrada:** inspección del HTML productivo después del commit `9acca599...`.  
**Esperado:** `export-fallback-guard-v39.js` debe cargarse sincrónicamente inmediatamente después de `app.js`, antes de cualquier módulo que dependa de carga dinámica del exportador.  
**Resultado obtenido:** producción sirve exactamente `app.js` seguido por `export-fallback-guard-v39.js`. La guardia v39 impide el fallback `.doc`, y `docx-export-v29.js` está diseñado para sustituir posteriormente esas funciones por `.docx` real.  
**Evidencia:** `index.html` en `main`, HTML canónico de producción, `export-fallback-guard-v39.js`, `docx-export-v29.js`, deployment Vercel del SHA funcional.  
**Resultado:** **PASA EN IMPLEMENTACIÓN / E2E TEMPORAL REAL PENDIENTE**.  
**Severidad residual:** **S2** hasta ejecutar throttling, fallo intencional del asset y Word físico.  
**Clasificación actual:** **FUNCIONAL EN IMPLEMENTACIÓN**.

## Evidencia de infraestructura posterior

- Vercel desplegó el commit funcional `9acca599ca79e21d843f6cd335e8278b3f35a593` como `dpl_5DJbQSzcz3WBhNdLoQhVhHesCszY` con estado `READY` en producción.
- `https://docente-digital.vercel.app/` respondió HTTP 200 después del despliegue y sirvió el nuevo orden de scripts con la guardia inmediatamente después de `app.js`.
- La consulta de errores runtime de Vercel para la última hora no encontró errores.

## Evidencia todavía requerida por V5

- navegador real con throttling: Word/Compartir debe permanecer bloqueado hasta `window.__ddDocxExportV29 === true`;
- fallo intencional de carga de `docx-export-v29.js`: debe permanecer la guardia y nunca descargarse `.doc`;
- doble clic rápido en descargar/compartir;
- `ddDocxSelfTest() === true` en navegador real;
- al menos 20 DOCX reales con tablas, márgenes, caracteres quechua, orientación, saltos e impresión;
- PDF e impresión reales;
- móvil físico.

## Fuente normativa externa

No se declara ni aplica una norma MINEDU externa nueva. El hallazgo se sustenta en V2–V5/Núcleo IA y evidencia técnica del repositorio/runtime.

## Riesgo de regresión

Bajo-medio. La corrección agrega una barrera idempotente ya existente y no cambia el generador OOXML. El principal riesgo es que una futura modificación del orden de scripts vuelva a colocar `app.js` sin la guardia inmediata; conviene añadir un smoke específico del orden crítico de exportación.

## Impacto

IUD/ISU e IFR mejoran cualitativamente al eliminar la ventana estática de degradación insegura, pero no se recalculan puntuaciones. ICGD no tiene impacto pedagógico directo. Prelaunch permanece bloqueado y sin puntuación definitiva.

## Estado de lanzamiento

DocenteDigital **NO está aprobada para V1.0**. La corrección de AUD-267 no reemplaza las pruebas reales exigidas por V5.