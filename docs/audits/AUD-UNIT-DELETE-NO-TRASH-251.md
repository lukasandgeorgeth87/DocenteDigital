# AUD-UNIT-DELETE-NO-TRASH-251 — REVALIDADO / SUPERSEDIDO PARCIALMENTE

## Estado actual — 2026-09-13

Este expediente conserva el ID histórico, pero corrige una conclusión que quedó desactualizada.

La versión anterior afirmaba que el runtime productivo no tenía ninguna vía de restauración después de `deleteUnit(id)`. Esa afirmación ya no es válida al revisar el orden completo de carga: `storage-recovery-v26.js` envuelve `window.deleteUnit`, crea una copia local antes de eliminar y ofrece **Restaurar / Descartar** después del borrado.

**Hallazgo que sí permanece:** DocenteDigital todavía no implementa una **Papelera persistente multiítem** con lista de eliminados, `deletedAt`, restauración por elemento y eliminación definitiva separada. La recuperación actual es una ranura preventiva de un solo elemento.

**Hallazgo canónico para la falta de Papelera:** `AUD-DOC-TRASH-179`.

**Hallazgo canónico para la sobrescritura histórica de la ranura única:** `AUD-UNIT-DELETE-SINGLE-BACKUP-OVERWRITE-210`.

## Especificaciones obligatorias aplicadas

Se revisaron conjuntamente V2, V3, V4, V5 y Núcleo IA. V4 §23 exige explícitamente **confirmación + papelera + recuperación antes de eliminación definitiva**.

## Prueba AUD-DEL-251-A — Borrado individual y recuperación inmediata

**Entrada:**
1. Tener una Unidad/Proyecto guardada.
2. Pulsar `Eliminar` y confirmar.
3. Intentar recuperarla antes de descartar la copia.

**Esperado:** el elemento eliminado debe disponer de una ruta recuperable antes de la eliminación definitiva.

**Resultado obtenido actual:**
- `app.js` realiza el borrado base de `state.units`.
- `storage-recovery-v26.js` v26.6 envuelve `deleteUnit()`.
- Antes de borrar guarda la unidad en `docenteDigitalPrototype_delete_backup`.
- Después del borrado muestra `🗑️ Unidad eliminada` con acciones **Restaurar** y **Descartar**.
- Restaurar vuelve a insertar la unidad conservando su `id` y recarga la aplicación.

**Resultado:** **PASA EN IMPLEMENTACIÓN / E2E REAL PENDIENTE**.

**Clasificación:** **FUNCIONAL EN IMPLEMENTACIÓN** para recuperación inmediata individual.

**Severidad residual:** no se asigna cierre definitivo hasta prueba E2E en navegador/dispositivo real.

## Prueba AUD-DEL-251-B — Papelera persistente

**Entrada:** eliminar A, continuar trabajando, consultar una vista de Papelera y gestionar varios eliminados de forma independiente.

**Esperado:** Papelera persistente con elementos identificables, fecha de eliminación, restauración por elemento y eliminación definitiva explícita.

**Resultado obtenido:** no existe una colección ni pantalla de Papelera. La recuperación se basa en una única clave `docenteDigitalPrototype_delete_backup`. Si existe otra unidad pendiente, v26.6 bloquea correctamente un segundo borrado hasta que la primera copia sea restaurada o descartada.

**Resultado:** **NO PASA** el requisito completo V4 §23.

**Clasificación:** **PARCIALMENTE FUNCIONAL** para ciclo de borrado; **INEXISTENTE** para Papelera multiítem.

**Severidad:** **S2 ALTO** como brecha de UX/recuperación previa a lanzamiento; no existe en esta revalidación una nueva evidencia de pérdida irreversible que justifique elevarla por sí sola a S0/S1.

## Causa raíz actual

El modelo de recuperación es una ranura de deshacer preventiva, no un ciclo de vida documental con Papelera. El parche de seguridad evita sobrescribir una recuperación pendiente, pero a costa de impedir un segundo borrado hasta resolver el primero.

## Acción correctiva pendiente

Implementar una Papelera persistente como colección, preservando IDs, relaciones e históricos; incluir `deletedAt`, Restaurar y Eliminar definitivamente por elemento; migrar de forma segura cualquier copia existente; probar recarga/cierre, varios borrados, restauración fuera de orden, referencias de sesiones, Storage restringido y móvil real.

## Riesgo de regresión

**Medio-alto** si se implementa sin migración y sin preservar relaciones (`activeUnitId`, sesiones y documentos derivados). Por ello no se aplica automáticamente en esta ronda.

## Impacto

- IUD/ISU: sigue afectada la recuperación del trabajo por ausencia de Papelera completa.
- ICGD: riesgo de trazabilidad si el ciclo de vida documental no preserva relaciones.
- IFR/Prelaunch: sin puntuación definitiva; gate V5 continúa bloqueado por pruebas reales y hallazgos acumulados.

## Normativa externa

No se aplicó ni declaró vigente normativa MINEDU/UGEL externa en esta revalidación. El dictamen deriva de V3/V4/V5 y del código observado.

## Estado de lanzamiento

**DocenteDigital continúa NO APROBADA PARA V1.0.**