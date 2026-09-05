# AUD-DOC-TRASH-179 — REVISADO: borrado recuperable parcial, sin Papelera completa

## Alcance
Auditoría acumulativa contra V2 + V3 + V4 + V5 + Núcleo IA. Se revisó el flujo real de `Mi planificación → Mis unidades/proyectos → Eliminar`, incluyendo el orden de carga completo del runtime y no solo `app.js`.

## ID de prueba
**AUD-DOC-TRASH-179**

## Entrada
1. Tener una Unidad/Proyecto guardada.
2. Pulsar `Eliminar`.
3. Confirmar.
4. Intentar restaurarla antes de efectuar otro borrado.

## Esperado
V4 exige confirmación + papelera + recuperación antes de eliminación definitiva. V5 exige probar eliminar y recuperar documentos.

## Obtenido revisado
La lectura aislada de `app.js` era incompleta. Aunque `deleteUnit(id)` elimina el objeto de `state.units`, producción carga **antes de `app.js`** el módulo `storage-recovery-v26.js`.

Ese módulo envuelve posteriormente `window.deleteUnit` y, antes del borrado, guarda una copia de la unidad en `docenteDigitalPrototype_delete_backup`. Tras el borrado, muestra una barra `🗑️ Unidad eliminada` con acción **Restaurar**. La restauración vuelve a insertar la unidad conservando su `id` y recarga la aplicación.

Por ello es incorrecto afirmar que el flujo productivo actual carece por completo de recuperación.

Sin embargo, no existe todavía una Papelera documental persistente con múltiples elementos, fechas de eliminación y eliminación definitiva separada. La implementación usa una sola clave de respaldo, por lo que el cumplimiento de V4/V5 sigue siendo parcial.

## Evidencia
- `index.html`: `storage-recovery-v26.js` se carga antes de `app.js`.
- `storage-recovery-v26.js`: `DELETE_BACKUP_KEY`, envoltorio `installRecoverableUnitDelete()` y `offerUnitDeleteRestore()`.
- `app.js`: confirmación y borrado base de `state.units`.
- V4 §23 y V5 §3 mantienen el requisito de ciclo de borrado/recuperación verificable.

## PASA / NO PASA
**PASA PARCIAL / NO PASA el ciclo completo V4-V5.**

## Clasificación
- Confirmación antes de borrar: **FUNCIONAL**.
- Recuperación inmediata de una unidad borrada: **FUNCIONAL/PARCIAL**.
- Papelera persistente multi-documento: **INEXISTENTE**.
- Eliminación definitiva separada: **INEXISTENTE**.

## Severidad revisada
**S2 — ALTO** por incumplimiento del ciclo documental completo y riesgo de pérdida en borrados consecutivos; ya no corresponde describir cada borrado individual como irreversible.

## Acción
Implementar una Papelera persistente como colección, con `id`, `deletedAt`, contenido y relaciones; permitir restaurar cada elemento y ejecutar eliminación definitiva como acción separada. Añadir pruebas de recarga, varios borrados consecutivos y restauración fuera de orden.

## Estado de lanzamiento
El hallazgo sigue abierto para V5, pero con evidencia corregida. DocenteDigital continúa **NO APROBADA PARA LANZAMIENTO V1.0** mientras existan bloqueantes V5.
