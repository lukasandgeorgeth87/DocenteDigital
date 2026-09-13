# AUD-DOCX-BOOT-RACE-267 — ventana de exportación legado durante el arranque

## Estado

- **Módulo:** exportación Word / bootstrap / degradación segura.
- **Clasificación:** PARCIALMENTE FUNCIONAL.
- **Resultado:** NO PASA a nivel de invariante de integración; E2E temporal real PENDIENTE.
- **Severidad:** S2 ALTO.
- **Gate V5:** continúa bloqueado; este hallazgo no sustituye las pruebas físicas DOCX/PDF/impresión.

## Especificaciones obligatorias aplicadas

Se contrastaron conjuntamente `AUDITORIA_MAESTRA_INTEGRAL_V2`, `ADENDA_AUDITORIA_EJECUTABLE_V3`, `AUDITORIA_SIMPLICIDAD_USO_V4`, `AUDITORIA_PRELANZAMIENTO_V5` y `NUCLEO_IA_DOCENTEDIGITAL`.

V3 exige seguir la cadena `asset → wiring → ejecución → comportamiento`; V5 exige degradación segura y exportación real antes del lanzamiento.

## Prueba

**ID:** `AUD-DOCX-BOOT-RACE-267`  
**Entrada:** arranque limpio o red lenta; `app.js` termina de ejecutarse y, antes de que finalice la carga asíncrona de las guardias/exportador posteriores, se intenta `⬇ Word` o `📤 Compartir` sobre una unidad/sesión ya persistida.  
**Esperado:** desde el primer instante utilizable, el exportador OOXML real está listo o la acción queda bloqueada visiblemente. Nunca debe quedar invocable el exportador legado `.doc`.  
**Obtenido:** `app.js` define sincrónicamente `downloadUnitWord()` con `wordBlob(...)` y extensión `.doc`; el HTML carga después `initial-curriculum-guard-v72.js`, que incorpora `docx-export-v29.js` creando dinámicamente un `<script>`; `schedule-prompt-v6.js` también carga dinámicamente `export-fallback-guard-v39.js` y luego `docx-export-v29.js`. Por ello no existe una barrera sincrónica inmediata entre la definición legado y la disponibilidad de las defensas posteriores.  
**Evidencia:** `app.js`, `index.html`, `initial-curriculum-guard-v72.js`, `schedule-prompt-v6.js`, `export-fallback-guard-v39.js`, `docx-export-v29.js`.  
**Resultado:** **NO PASA** el invariante de bootstrap; reproducción temporal E2E con throttling queda **PENDIENTE**.  
**Severidad:** **S2 ALTO**.  
**Clasificación:** **PARCIALMENTE FUNCIONAL**.

No se afirma que un usuario real haya descargado un `.doc` en esta ronda. La falla demostrada es de orden de inicialización: las funciones legado existen antes de la barrera específica.

## Causa raíz

La seguridad de exportación depende de módulos dinámicos posteriores, mientras las funciones legado quedan disponibles inmediatamente al ejecutar `app.js`. Las defensas existentes son correctas una vez cargadas, pero no cubren todo el intervalo de bootstrap.

## Acción correctiva recomendada

1. Cargar `export-fallback-guard-v39.js` de forma directa inmediatamente después de `app.js` en `index.html` o aplicar una barrera sincrónica equivalente.
2. Mantener `docx-export-v29.js` en la cadena crítica existente y preservar la idempotencia de ambas capas.
3. Añadir un smoke que falle si, después de `app.js` y antes de `window.__ddDocxExportV29 === true`, `downloadUnitWord` puede producir `.doc` legado.
4. Ejecutar navegador real con throttling, doble clic y fallo intencional del asset.

No se aplica automáticamente en esta ronda porque el cambio de orden de bootstrap requiere retest de navegador de navegación/exportación/degradación y esa evidencia interactiva no está disponible aquí. No se simula validación.

## Evidencia posterior requerida

- barrera de exportación activa inmediatamente después de `app.js`;
- Vercel READY y HTTP 200 del SHA corregido;
- guardia y exportador HTTP 200;
- throttling real: Word/Compartir bloqueado hasta `window.__ddDocxExportV29 === true`;
- `ddDocxSelfTest() === true` en navegador real;
- pruebas físicas Word/móvil y batería V5.

## Evidencia de infraestructura confirmada — 2026-09-13

- El commit `300b2f8bd8aa1c1a20eceda380e20476ea6ff116`, que documentó este hallazgo, fue desplegado en producción por Vercel como `dpl_2VawSfgqr3vnj6L5fUpVEj92omMP` con estado `READY`.
- `https://docente-digital.vercel.app/` respondió HTTP 200 y continúa sirviendo el orden de scripts que coloca `app.js` antes de las capas de exportación posteriores.
- GitHub Actions `Prelaunch Smoke` run #282 (`34749767870`) terminó `completed / success` exactamente sobre `300b2f8bd8aa1c1a20eceda380e20476ea6ff116`.
- Esta evidencia confirma infraestructura y smoke técnico; **no cambia** `AUD-DOCX-BOOT-RACE-267` a PASA y **no sustituye** la reproducción E2E con red lenta/throttling ni las pruebas físicas de Word/PDF/impresión.

## Fuente normativa externa

No se declara ni aplica una norma MINEDU externa nueva. El hallazgo se sustenta en V2–V5/Núcleo IA y evidencia técnica del repositorio/runtime.

## Impacto

IUD/ISU e IFR quedan afectados cualitativamente por la posible experiencia inconsistente y degradación insegura durante arranque; no se recalculan puntuaciones. ICGD no tiene impacto pedagógico directo. Prelaunch permanece bloqueado y sin puntuación definitiva.

## Estado de lanzamiento

DocenteDigital **NO está aprobada para V1.0**.