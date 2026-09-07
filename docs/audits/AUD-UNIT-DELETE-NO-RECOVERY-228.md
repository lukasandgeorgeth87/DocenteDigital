# AUD-UNIT-DELETE-NO-RECOVERY-228 — CORREGIDO

## Alcance
Auditoría estática verificable sobre el flujo de eliminación y recuperación de Unidades/Proyectos en DocenteDigital, contrastada con V4 y V5. No se simularon usuarios reales, dispositivos físicos, backend ni IA real.

## Corrección del hallazgo anterior
La versión anterior de este informe inspeccionó únicamente `app.js` y concluyó que la recuperación era inexistente. Esa conclusión era incompleta: `index.html` carga `storage-recovery-v26.js` **antes** de `app.js`, y dicho módulo envuelve posteriormente `deleteUnit()` para crear una copia local recuperable y ofrecer restauración.

La auditoría se corrige para distinguir entre **recuperación básica funcional** y la **papelera completa exigida por V4/V5**.

## Hallazgo actualizado

### AUD-UNIT-228-A
**ID:** AUD-UNIT-228-A  
**Entrada:** Crear o disponer de una Unidad/Proyecto guardada y ejecutar `Eliminar`, confirmando la acción.  
**Esperado:** Confirmación + estado recuperable/papelera + restauración persistente antes de una eliminación definitiva, conservando el mismo ID y la trazabilidad con documentos derivados.  
**Obtenido:** `app.js` elimina la unidad del arreglo principal, pero `storage-recovery-v26.js` intercepta `deleteUnit(id)`, guarda previamente una copia en `docenteDigitalPrototype_delete_backup` y, si la eliminación se concreta, muestra una interfaz `Unidad eliminada` con acciones `Restaurar` y `Descartar`. La restauración vuelve a insertar la unidad con su mismo `id` y conserva el respaldo si la restauración falla. `index.html` carga este módulo antes de `app.js`, por lo que la protección forma parte del runtime previsto.  
**Evidencia:** `index.html` carga `storage-recovery-v26.js` antes de `app.js`; `storage-recovery-v26.js` implementa `installRecoverableUnitDelete()`, `offerUnitDeleteRestore()` y la clave `docenteDigitalPrototype_delete_backup`.  
**Resultado:** **PASA PARCIALMENTE**.  
**Severidad:** **S2 – ALTO** para prelan­zamiento, no S1 por pérdida irreversible inmediata, porque existe recuperación básica.  
**Clasificación:** confirmación = **FUNCIONAL**; copia previa = **FUNCIONAL**; restauración inmediata/persistente = **FUNCIONAL/PARCIAL**; papelera navegable = **INEXISTENTE**; múltiples eliminados recuperables = **INEXISTENTE**; eliminación definitiva separada y auditable = **PARCIAL/INEXISTENTE**; trazabilidad histórica de la eliminación = **INEXISTENTE**.  
**Acción requerida:** Mantener la protección actual y evolucionarla a una Papelera real con colección de elementos eliminados, `deletedAt`, restauración de múltiples documentos, eliminación definitiva separada y reglas explícitas para referencias `unitId` y documentos derivados.

## Límites de la recuperación actual
La implementación conserva **una única copia local** bajo `docenteDigitalPrototype_delete_backup`. Una nueva eliminación puede sustituir el respaldo anterior. No existe una vista de Papelera con historial, metadatos de borrado o recuperación de múltiples elementos. Por ello V4/V5 todavía no quedan plenamente demostrados, pero ya no es correcto clasificar la recuperación como inexistente.

## Retest requerido
1. Crear U1 y una sesión S1 vinculada a U1.  
2. Eliminar U1 y confirmar que aparece la opción de restauración.  
3. Recargar antes de restaurar y confirmar que el respaldo sigue disponible.  
4. Restaurar U1 y verificar el mismo ID y coherencia con S1.  
5. Eliminar U1 y luego U2 antes de restaurar para documentar el comportamiento de respaldo único.  
6. Probar fallo de almacenamiento/cuota y confirmar que la eliminación se cancela si no puede crearse la copia previa.  
7. Implementar y retestear Papelera multi-elemento antes de marcar V4/V5 como plenamente aprobado.

## Estado V5
**Bloqueante específico de pérdida irreversible por un único borrado ordinario: mitigado por la recuperación actual.**  
**Requisito V4/V5 de Papelera completa y recuperación documental: pendiente.** DocenteDigital no debe aprobarse para lanzamiento V1.0 por este informe aislado; la decisión global continúa dependiendo de los demás S0/S1 abiertos y de los retests integrales de V5.
