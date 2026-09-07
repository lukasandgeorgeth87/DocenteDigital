# AUD-UNIT-DOUBLE-CLICK-DUPLICATION-218

## Alcance
Auditoría V4/V5 de la creación de Unidad/Proyecto en el runtime canónico de DocenteDigital. No se realizaron pruebas con usuarios reales ni dispositivos físicos. El hallazgo se demuestra por flujo determinista de código y se contrastó con el HTML productivo vigente.

## Caso principal

**ID:** AUD-UNIT-DOUBLE-CLICK-DUPLICATION-218-A  
**Entrada:** completar Tipo, Duración, Título/Idea y ejecutar dos veces rápidamente `Crear propuesta completa` (doble clic o dos activaciones consecutivas antes de que el usuario perciba el resultado).  
**Esperado:** una única Unidad/Proyecto persistida; la acción de creación debe ser idempotente durante el envío o bloquear reentrada. V5 ordena probar doble clic rápido en generar/guardar/descargar/crear documentos para impedir duplicados.  
**Obtenido:** el botón productivo invoca directamente `createUnitDemo()`. La función crea siempre un objeto nuevo con `id:'u'+Date.now()` y ejecuta incondicionalmente `state.units.unshift(unit)` seguido de `save()`. No existe `disabled`, bandera `inProgress`, debounce, fingerprint/idempotency key ni comprobación de duplicado antes de insertar. Dos activaciones generan dos inserciones; si ocurren en milisegundos distintos, quedan dos documentos equivalentes con IDs distintos; si coinciden en el mismo milisegundo, el esquema basado únicamente en `Date.now()` tampoco garantiza unicidad lógica.  
**Evidencia:** `index.html` → botón `onclick="createUnitDemo()"`; `app.js` → creación de `unit`, `id:'u'+Date.now()`, `state.units.unshift(unit); state.activeUnitId=unit.id; save();`.  
**Resultado:** **NO PASA**.  
**Severidad:** **S1 CRÍTICO / bloqueante V5** para lanzamiento mientras el flujo de creación documental no sea protegido y retestado.  
**Clasificación:** creación normal = **FUNCIONAL/PARCIAL**; protección de reentrada = **INEXISTENTE**; idempotencia = **INEXISTENTE**; doble clic = **ROTA** respecto del requisito V5.

## Impacto
- Duplicación silenciosa de unidades/proyectos.
- Biblioteca contaminada con documentos aparentemente idénticos.
- Posible selección de una copia distinta como `activeUnitId`.
- Sesiones posteriores pueden quedar vinculadas a copias diferentes de una misma planificación.
- Aumenta la ambigüedad de trazabilidad y agrava los bloqueantes ya abiertos de historial, edición y relación Unidad→Sesión.

## Acción recomendada
No corregir únicamente cambiando el ID. La protección correcta debe impedir reentrada en la acción documental: deshabilitar temporalmente el botón durante la transacción, usar una guarda/idempotency key o fingerprint estable de la solicitud y reactivar la UI únicamente cuando el estado se haya confirmado. Agregar una prueba automatizada que invoque dos veces la creación con los mismos datos y demuestre que `state.units` aumenta exactamente en 1.

La misma política de idempotencia debe revisarse posteriormente en guardar, exportar y creación de otros documentos, tal como exige V5.

## Decisión de esta pasada
No se modificó runtime porque una guarda aislada sin prueba automatizada de regresión puede bloquear creaciones legítimas o dejar el botón permanentemente deshabilitado ante excepciones. Se registra el bloqueante y se mantiene el Prelaunch Gate cerrado.
