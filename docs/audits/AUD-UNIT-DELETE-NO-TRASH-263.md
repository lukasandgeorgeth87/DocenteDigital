# AUD-UNIT-DELETE-NO-TRASH-263

**Fecha de revalidación:** 2026-09-12

## Alcance

Auditoría de eliminación, recuperación y persistencia de unidades/proyectos según V3, V4 y V5. Esta revalidación corrige la evidencia anterior: `app.js` no es la última capa del runtime para el borrado. Producción carga `storage-recovery-v26.js` antes de `app.js`; al terminar el arranque, dicho módulo envuelve `deleteUnit()` y crea una copia recuperable antes de ejecutar el borrado base.

## Prueba AUD-DOC-263-A — Eliminación individual recuperable

- **Entrada:** crear una unidad/proyecto, abrir `Mis unidades/proyectos`, pulsar `Eliminar` y aceptar la confirmación.
- **Resultado esperado:** conservar una ruta visible de recuperación antes de una eliminación definitiva.
- **Resultado obtenido:** `storage-recovery-v26.js` guarda la unidad eliminada en `docenteDigitalPrototype_delete_backup`, ejecuta el borrado base y muestra una barra con `Restaurar` / `Descartar`. La restauración reinserta la unidad en `state.units` sin sobrescribir otros cambios posteriores.
- **Evidencia:** `storage-recovery-v26.js` y carga productiva real desde `index.html`.
- **PASA/NO PASA:** **PASA a nivel de implementación y wiring** para una eliminación individual. La interacción E2E en navegador/dispositivo real continúa **PENDIENTE** y no se sustituye por inspección de código.
- **Clasificación:** **FUNCIONAL EN CÓDIGO / E2E PENDIENTE**.
- **Severidad actual:** no corresponde mantener el S0 anterior por la afirmación “no existe recuperación”, porque esa afirmación era incompleta.

## Prueba AUD-DOC-263-B — Eliminaciones consecutivas sin resolver la recuperación anterior

- **Entrada:** eliminar una primera unidad A, no restaurarla ni descartarla, y tratar de eliminar una segunda unidad B.
- **Resultado esperado:** la copia de A no debe ser sobrescrita; el sistema debe impedir pérdida irreversible o mantener una papelera capaz de contener ambas eliminaciones.
- **Resultado obtenido antes de la corrección de esta ronda:** el módulo utilizaba una sola clave `docenteDigitalPrototype_delete_backup`; al iniciar el borrado de B escribía la copia de B sobre la copia de A. A quedaba sin ruta de recuperación.
- **PASA/NO PASA antes de la corrección:** **NO PASA**.
- **Clasificación antes de la corrección:** **PARCIALMENTE FUNCIONAL**.
- **Severidad antes de la corrección:** **S0 BLOQUEANTE**, porque la secuencia podía convertir una eliminación inicialmente recuperable en pérdida irreversible.
- **Corrección aplicada:** `storage-recovery-v26.js` v26.2 comprueba si existe una eliminación pendiente. Si la copia corresponde a otra unidad, cancela el segundo borrado, vuelve a mostrar la recuperación anterior y exige `Restaurar` o `Descartar definitivamente` antes de continuar. Si la copia no puede verificarse, también cancela el borrado de forma conservadora.
- **Resultado posterior esperado:** un segundo borrado no puede sobrescribir una copia pendiente.
- **Evidencia posterior:** commit de corrección `d49a8ccc698c6dd10b6468be8e2d2d48ab6d38b2`; revalidación de despliegue/HTTP y prueba E2E deben registrarse después del despliegue.
- **Estado posterior:** **CORREGIDO EN CÓDIGO / E2E PENDIENTE**. No se declara PASA definitivo hasta probar el flujo en ejecución real.

## Causa raíz corregida

La causa real no era ausencia total de recuperación. El riesgo estaba en modelar la recuperación de borrado con una única ranura de backup reemplazable. La corrección evita sobrescribir esa ranura mientras exista una eliminación sin resolver.

## Especificaciones afectadas

- **V3:** papelera/recuperación/eliminación definitiva y S0 para pérdida irreversible.
- **V4:** confirmación + recuperación antes de eliminación definitiva.
- **V5:** eliminar y recuperar documentos; persistencia/recuperación; ninguna puntuación puede ocultar pérdida de información.

## Riesgo de regresión

**Bajo–medio.** El cambio no altera el formato de `state.units` ni las relaciones existentes; únicamente bloquea un segundo borrado mientras exista una copia pendiente. Deben probarse: cancelar el primer borrado, borrar A/restaurar A, borrar A/descartar A/borrar B, recargar con copia pendiente, `activeUnitId`, `continueWork()` y sesiones vinculadas.

## Impacto en métricas

- **IUD/ICGD:** mejora técnica por evitar sobrescritura de la única copia recuperable; no puntuar definitivamente sin E2E.
- **IFR/ISU/Prelaunch:** el S0 previo de esta secuencia deja de considerarse demostrado una vez desplegada y probada la corrección; el gate V5 sigue bloqueado por otros hallazgos/pruebas reales pendientes.

## Decisión

El acumulado deja de afirmar que `deleteUnit()` es irreversiblemente destructivo en todos los casos. Se conserva el ID 263 para trazabilidad histórica y se documenta la causa real encontrada y la corrección mínima aplicada. No se declara V1.0 lista hasta completar la prueba E2E real y los demás bloqueantes V5.
