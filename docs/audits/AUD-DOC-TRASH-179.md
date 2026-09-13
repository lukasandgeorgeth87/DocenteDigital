# AUD-DOC-TRASH-179 — CANÓNICO: recuperación parcial, sin Papelera persistente

## Estado revalidado — 2026-09-13

Auditoría acumulativa contra V2 + V3 + V4 + V5 + Núcleo IA. Se revisó el flujo real de `Mi planificación → Mis unidades/proyectos → Eliminar`, incluyendo `app.js` y `storage-recovery-v26.js` v26.6.

## ID de prueba
**AUD-DOC-TRASH-179**

## Entrada
1. Tener una Unidad/Proyecto guardada.
2. Pulsar `Eliminar` y confirmar.
3. Recuperarla después del borrado.
4. Mantener A pendiente e intentar eliminar B.
5. Buscar una Papelera donde administrar varios elementos eliminados.

## Esperado
V4 §23 exige **confirmación + papelera + recuperación antes de eliminación definitiva**. V5 exige demostrar eliminar/recuperar documentos y conservar información ante interrupciones.

## Resultado obtenido actual
La lectura de `app.js` aislada no representa el comportamiento productivo completo. `storage-recovery-v26.js` envuelve `window.deleteUnit` y:
- crea una copia preventiva en `docenteDigitalPrototype_delete_backup`;
- muestra `🗑️ Unidad eliminada` con **Restaurar / Descartar**;
- al restaurar vuelve a insertar la unidad conservando su `id`;
- si A está pendiente e intenta borrarse B, bloquea B para evitar sobrescribir A;
- si no puede verificar/crear la copia, cancela el borrado de forma conservadora.

Por tanto, **la recuperación inmediata de un borrado individual existe en implementación** y ya no es correcto describir ese borrado como irreversible por defecto.

Lo que sigue faltando es una **Papelera persistente multi-documento**. No existe una colección navegable de eliminados, fecha de borrado por elemento, restauración independiente de múltiples documentos ni gestión de eliminación definitiva por elemento. La protección actual sigue siendo una ranura preventiva y obliga a resolver A antes de poder borrar B.

## Evidencia
- `app.js`: `deleteUnit(id)` confirma y elimina de `state.units`.
- `storage-recovery-v26.js` v26.6: `DELETE_BACKUP_KEY`, `installRecoverableUnitDelete()` y `offerUnitDeleteRestore()`.
- V4 §23: “Confirmación + papelera + recuperación antes de eliminación definitiva”.
- `AUD-UNIT-DELETE-SINGLE-BACKUP-OVERWRITE-210`: corrección histórica de la sobrescritura consecutiva.

## Matriz de prueba

### AUD-DOC-TRASH-179-A — borrado individual
**Entrada:** eliminar A → Restaurar.

**Esperado:** A vuelve a estar disponible con su identidad.

**Obtenido:** el código guarda A antes de borrar y la acción Restaurar la reinyecta conservando `id`.

**Resultado:** **PASA EN IMPLEMENTACIÓN / E2E REAL PENDIENTE**.

**Clasificación:** **FUNCIONAL EN IMPLEMENTACIÓN**.

### AUD-DOC-TRASH-179-B — segundo borrado con A pendiente
**Entrada:** eliminar A → no resolver recuperación → intentar eliminar B.

**Esperado:** A no se pierde.

**Obtenido:** v26.6 cancela B y vuelve a ofrecer A.

**Resultado:** **PASA EN IMPLEMENTACIÓN / E2E REAL PENDIENTE**.

**Clasificación:** **FUNCIONAL EN IMPLEMENTACIÓN** como protección contra sobrescritura.

### AUD-DOC-TRASH-179-C — Papelera multiítem
**Entrada:** eliminar varios documentos, continuar trabajando y abrir una Papelera para gestionarlos de forma independiente.

**Esperado:** colección persistente con varios elementos, `deletedAt`, Restaurar y Eliminar definitivamente por elemento.

**Obtenido:** no existe esa colección ni vista. Solo existe una copia pendiente única y el segundo borrado se bloquea hasta resolverla.

**Resultado:** **NO PASA**.

**Clasificación:** **INEXISTENTE** para Papelera persistente multi-documento.

**Severidad:** **S2 ALTO** por incumplimiento del ciclo de borrado seguro V4 y recuperación previa a lanzamiento. No hay en esta revalidación una nueva evidencia de pérdida irreversible que active S0/S1.

## Causa raíz
El diseño actual implementa “deshacer un borrado pendiente” mediante una sola ranura de backup, no un ciclo de vida documental de soft delete/Papelera.

## Acción correctiva pendiente
Implementar una colección de Papelera preservando `id`, `deletedAt`, contenido y relaciones. Permitir Restaurar y Eliminar definitivamente por elemento, migrar de forma segura la copia única existente y probar varios borrados, recarga/cierre, restauración fuera de orden, `activeUnitId`, sesiones/documentos relacionados, Storage restringido y móvil real.

No se aplica automáticamente en esta ronda porque cambia persistencia, ciclo de vida y relaciones; no es un parche pequeño de bajo riesgo.

## Riesgo de regresión
**Medio-alto** si la migración no conserva referencias e históricos.

## Impacto
- IUD/ISU: recuperación parcial; Papelera completa pendiente.
- ICGD: requiere preservar trazabilidad y relaciones al implementar soft delete.
- IFR/Prelaunch: sin puntaje definitivo; pruebas E2E/físicas continúan pendientes.

## Normativa externa
No se aplicó ni declaró vigente normativa MINEDU/UGEL externa. El hallazgo deriva de V3/V4/V5 y del comportamiento técnico observado.

## Estado de lanzamiento
**Gate V5 BLOQUEADO. DocenteDigital continúa NO APROBADA PARA V1.0.**