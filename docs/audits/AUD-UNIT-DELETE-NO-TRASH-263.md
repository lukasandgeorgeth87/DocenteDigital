# AUD-UNIT-DELETE-NO-TRASH-263

**Fecha de revalidación:** 2026-09-12

## Alcance

Auditoría de eliminación, recuperación y persistencia de unidades/proyectos según V3, V4 y V5.

## Prueba AUD-DOC-263-A — Eliminación segura de Unidad/Proyecto

- **Entrada:** crear una unidad/proyecto, abrir `Mis unidades/proyectos`, pulsar `Eliminar` y aceptar la confirmación.
- **Resultado esperado:** el documento debe pasar a una papelera o estado recuperable; debe existir una ruta visible para restaurarlo antes de una eliminación definitiva.
- **Resultado obtenido:** `deleteUnit(id)` solicita confirmación y, al aceptarla, ejecuta inmediatamente `state.units=state.units.filter(u=>u.id!==id)`, actualiza `activeUnitId`, persiste el nuevo estado y oculta la salida. No crea papelera, tombstone, `deletedAt`, historial recuperable ni función de restauración.
- **Evidencia:** `app.js`, función `deleteUnit(id)`, y búsqueda del repositorio sin implementación de `trash`, `papelera`, `restoreUnit` o estado equivalente. La producción actual expone el botón `Eliminar` dentro de `Mis unidades/proyectos`.
- **PASA/NO PASA:** **NO PASA**.
- **Clasificación:** **PARCIALMENTE FUNCIONAL** (el borrado funciona, pero no cumple borrado seguro/recuperación).
- **Severidad:** **S1 CRÍTICO para prelaunch**. El borrado confirmado elimina el único registro persistido de la unidad/proyecto en el estado local y no existe recuperación propia de la aplicación. No se eleva a S0 porque esta ronda no demostró pérdida accidental sin acción del usuario ni corrupción/fuga; sí existe riesgo real de pérdida irreversible después de confirmar.
- **Acción correctiva:** implementar papelera lógica y restauración antes de habilitar eliminación definitiva: mover el documento a un contenedor recuperable con `deletedAt`, conservar relaciones necesarias, ofrecer `Restaurar`, exigir una segunda acción explícita para eliminación definitiva y probar recarga/cierre/retorno. En arquitectura multiusuario futura, la papelera deberá respetar autorización, aislamiento, trazabilidad y política de retención.

## Causa raíz

El modelo de persistencia trata `state.units` como colección única activa. `deleteUnit()` elimina físicamente el objeto de esa colección en lugar de cambiar su estado. El diseño no modela ciclo de vida documental (`activo → papelera → restaurado/eliminado definitivamente`).

## Especificaciones afectadas

- **V4 §23 Borrado seguro:** confirmación + papelera + recuperación antes de eliminación definitiva.
- **V5 §3:** probar eliminar y recuperar documentos.
- **V5 §4:** persistencia y recuperación.
- **V5 §18:** una puntuación global no puede ocultar bloqueantes de guardado/pérdida.
- **V3 §19:** definir papelera, recuperación y eliminación definitiva.

## Riesgo de regresión

**Medio.** Agregar una papelera puede afectar `renderUnits()`, selección de `activeUnitId`, `fillSessionUnits()`, `continueWork()` y relaciones con sesiones. Debe implementarse con cambios pequeños y pruebas sobre unidades activas, eliminadas y restauradas.

## Impacto en métricas

- **IUD:** negativo hasta que el usuario pueda recuperar documentos eliminados.
- **ICGD:** negativo por ciclo de vida documental incompleto.
- **IFR/ISU/Prelaunch:** no calcular definitivamente con esta evidencia aislada. El hallazgo mantiene abierto el gate V5 hasta contar con recuperación real comprobada.

## Decisión de esta ronda

No se modifica directamente `deleteUnit()` porque introducir papelera y restauración cambia el modelo de datos y requiere probar relaciones, persistencia y UX. Se documenta el bloqueo y se mantiene pendiente una corrección funcional con prueba E2E posterior.

**Gate V5:** BLOQUEADO.
