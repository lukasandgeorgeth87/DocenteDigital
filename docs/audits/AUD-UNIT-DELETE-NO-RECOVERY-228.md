# AUD-UNIT-DELETE-NO-RECOVERY-228

## Alcance
Auditoría estática verificable sobre el flujo de eliminación de Unidades/Proyectos en DocenteDigital, contrastada con V4 y V5. No se simularon usuarios reales, dispositivos físicos, backend ni IA real.

## Hallazgo principal

### AUD-UNIT-228-A
**ID:** AUD-UNIT-228-A  
**Entrada:** Crear o disponer de una Unidad/Proyecto guardada y ejecutar `Eliminar`, confirmando el cuadro de confirmación.  
**Esperado:** La eliminación debe ser segura: confirmación + papelera/estado recuperable + posibilidad de restauración antes de eliminación definitiva. Debe poder demostrarse también el caso eliminar → recuperar.  
**Obtenido:** `deleteUnit(id)` confirma mediante `confirm(...)` y, tras aceptar, ejecuta directamente `state.units=state.units.filter(u=>u.id!==id)`, actualiza `activeUnitId`, guarda el nuevo estado y oculta la salida. No existe `trash`, `deletedUnits`, `deletedAt`, comando de restauración ni interfaz de recuperación en este flujo.  
**Evidencia:** `app.js`, función `deleteUnit(id)`. V4 §23 exige “Confirmación + papelera + recuperación antes de eliminación definitiva”. V5 §3 exige probar crear/guardar/editar/duplicar/buscar/descargar/imprimir/**eliminar/recuperar** documentos.  
**Resultado:** **NO PASA**.  
**Severidad:** **S1 – CRÍTICO** para prelan­zamiento por riesgo de pérdida irreversible causada por una acción ordinaria del usuario y por incumplimiento directo del flujo de recuperación exigido.  
**Clasificación:** confirmación = **FUNCIONAL**; eliminación = **FUNCIONAL pero destructiva**; papelera = **INEXISTENTE**; recuperación = **INEXISTENTE**; trazabilidad de eliminación = **INEXISTENTE**.  
**Acción requerida:** Implementar eliminación blanda con metadatos (`deletedAt`, identificador estable y contexto documental), vista Papelera, Restaurar y eliminación definitiva separada con confirmación reforzada. Mantener referencias históricas necesarias para sesiones/documentos derivados y definir qué ocurre al restaurar una unidad que tiene sesiones vinculadas.

## Riesgo de integridad y trazabilidad
La eliminación actual no distingue entre “quitar de la lista” y “destruir definitivamente”. Una unidad puede estar vinculada por `unitId` a sesiones históricas; eliminarla del arreglo `state.units` hace que el documento fuente deje de estar disponible en la colección principal sin un mecanismo de recuperación o auditoría. Esto debilita la cadena Unidad → Sesión y agrava los hallazgos previos de trazabilidad/snapshot.

## Por qué no se aplicó una corrección rápida
No es seguro sustituir únicamente el `filter()` por un arreglo `deletedUnits`: sin una pantalla de papelera, restauración, reglas sobre referencias `unitId`, migración del estado existente y pruebas de reapertura, el cambio sería parcial y podría crear estados huérfanos. Debe corregirse como flujo completo, pequeño pero coherente, y retestearse.

## Retest requerido
1. Crear U1 y una sesión S1 vinculada a U1.  
2. Eliminar U1: debe desaparecer de la lista normal y aparecer en Papelera, sin perder S1.  
3. Recargar/cerrar y reabrir: U1 debe seguir recuperable.  
4. Restaurar U1: debe recuperar el mismo ID y volver a enlazar coherentemente con S1.  
5. Eliminar definitivamente desde Papelera: confirmación reforzada; verificar política para documentos derivados.  
6. Probar doble clic y recarga durante eliminar/restaurar para impedir duplicados o pérdida de estado.

## Estado V5
**Bloqueante pendiente. DocenteDigital no debe aprobarse para lanzamiento V1.0 mientras la eliminación ordinaria de documentos pueda producir pérdida irreversible sin papelera y recuperación.**
