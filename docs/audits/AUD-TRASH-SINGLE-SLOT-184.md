# AUD-TRASH-SINGLE-SLOT-184 — REVALIDADO / HALLAZGO HISTÓRICO CORREGIDO

## Estado actual — 2026-09-13

Este ID conserva la evidencia histórica del defecto de ranura única, pero su resultado anterior ya no describe el runtime actual.

**Hallazgo original:** eliminar A y después B sin resolver la recuperación de A podía sobrescribir `docenteDigitalPrototype_delete_backup` y dejar A sin vía de restauración.

**Estado actual:** **CORREGIDO EN IMPLEMENTACIÓN / E2E REAL PENDIENTE**. `storage-recovery-v26.js` v26.6 conserva una sola ranura, pero antes de un segundo borrado comprueba si existe otra unidad pendiente y cancela la nueva eliminación hasta que el usuario elija **Restaurar** o **Descartar definitivamente**.

El expediente canónico y más completo del defecto de sobrescritura es `AUD-UNIT-DELETE-SINGLE-BACKUP-OVERWRITE-210`.

La ausencia de una Papelera multiítem sigue abierta y se mantiene canónicamente en `AUD-DOC-TRASH-179`.

## ID de prueba
**AUD-TRASH-SINGLE-SLOT-184**

## Entrada revalidada
1. Tener A y B guardadas.
2. Eliminar A y confirmar.
3. No restaurar ni descartar A.
4. Intentar eliminar B.

## Esperado
A debe seguir recuperable y el intento de borrar B no debe sobrescribir su respaldo.

## Resultado obtenido actual
`installRecoverableUnitDelete()` lee primero `DELETE_BACKUP_KEY`. Si encuentra una unidad pendiente distinta de B:
- muestra una advertencia;
- vuelve a ofrecer la recuperación de A;
- retorna sin invocar el `deleteUnit()` base.

Si la lectura de la copia pendiente falla, la eliminación también se cancela de forma conservadora.

## PASA / NO PASA
- Protección contra sobrescritura A→B: **PASA EN IMPLEMENTACIÓN**.
- Restauración A→recarga→Restaurar y comportamiento en navegador/móvil real: **PENDIENTE**.
- Papelera persistente con varios elementos: **NO PASA / INEXISTENTE**.

## Clasificación actual
- Prevención de sobrescritura de la ranura: **FUNCIONAL EN IMPLEMENTACIÓN**.
- Recuperación real E2E: **PENDIENTE**.
- Papelera multi-documento: **INEXISTENTE**.

## Severidad
El **S0/S1 histórico por pérdida mediante sobrescritura deja de considerarse activo en código** tras la corrección ya desplegada. La falta de Papelera completa permanece como brecha **S2** de UX/recuperación, tratada en AUD-179.

## Acción pendiente
No reemplazar la protección actual hasta disponer de una migración segura a una Papelera como colección. Probar al menos:
1. A→Restaurar;
2. A→recargar→Restaurar;
3. A→intentar borrar B y confirmar que B permanece;
4. A→Descartar→borrar B;
5. `activeUnitId`, sesiones vinculadas y continuidad;
6. navegador/móvil real y Storage restringido.

## Riesgo de regresión
**Bajo–medio** para la protección actual; **medio-alto** para una futura migración de modelo de datos.

## Normativa externa
No se aplicó ni declaró vigente normativa externa. La revalidación se deriva de V3/V4/V5 y del runtime actual.

## Gate
**V5 continúa BLOQUEADO. DocenteDigital no está aprobada para V1.0.**