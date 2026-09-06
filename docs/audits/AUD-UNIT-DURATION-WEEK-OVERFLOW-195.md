# AUD-UNIT-DURATION-WEEK-OVERFLOW-195

## Resumen

La generación base de actividades de Unidad/Proyecto puede crear semanas fuera de la duración seleccionada. El caso determinista más simple es **1 semana + 6 o 7 áreas**: `buildActivities()` crea al menos una actividad por área, pero asigna la semana mediante bloques fijos de cinco actividades (`Math.floor(i/5)+1`), por lo que la actividad 6 y siguientes quedan etiquetadas como **Semana 2** aunque la unidad conserve `duration: "1 semana"`.

## Prueba

**ID:** AUD-UNIT-DURATION-WEEK-OVERFLOW-195  
**Módulo:** Unidad / Proyecto → Secuencia temporal  
**Entrada:** Primaria, múltiples áreas (por ejemplo las 7 áreas disponibles), duración `1 semana`, contexto válido y creación de Unidad/Proyecto.  
**Resultado esperado:** ninguna actividad debe quedar fuera del rango temporal aprobado por el usuario; para una unidad de 1 semana todas las actividades deben pertenecer a Semana 1 o el sistema debe advertir que la carga seleccionada requiere ampliar/reorganizar la duración.  
**Resultado obtenido:** `weeks=1`; `target=Math.max(state.areas.length,weeks*5)`. Con 7 áreas, `target=7`. La semana se calcula como `Math.floor(i/5)+1`, produciendo semanas `[1,1,1,1,1,2,2]`. La Unidad mantiene simultáneamente `duration="1 semana"`.  
**Evidencia de código:** `app.js`, funciones `buildActivities()`, `createUnitDemo()` y `renderUnitOutput()`.  
**Evidencia de producción:** `https://docente-digital.vercel.app/app.js` sirve la misma implementación y respondió HTTP 200 durante la auditoría. La pantalla productiva permite seleccionar `1 semana` y Primaria permite seleccionar múltiples áreas.  
**PASA/NO PASA:** **NO PASA**.  
**Clasificación:** secuencia temporal = **PARCIALMENTE FUNCIONAL**; validación duración ↔ actividades = **INEXISTENTE**.  
**Severidad:** **S2 ALTO**.

## Causa raíz

El algoritmo mezcla dos reglas independientes:

1. garantizar como mínimo una actividad por área (`target >= state.areas.length`);
2. asumir implícitamente cinco actividades por semana (`week = floor(i/5)+1`).

Cuando el número de áreas supera `weeks*5`, la primera regla aumenta el número total de actividades pero la segunda crea semanas adicionales sin actualizar ni validar la duración declarada.

## Riesgo

Es un error silencioso de trazabilidad temporal. Una unidad puede mostrarse como de una semana y simultáneamente contener actividades de una segunda semana. Esto puede propagarse a selección de actividades, creación de sesiones, Word y planificación posterior. También contradice la exigencia V2 de respetar la temporalización de la unidad y V3/V5 de no aprobar una función por generar contenido si pierde coherencia entre fases.

## Acción correctiva

1. Tratar `duration` como límite temporal explícito, no solo como multiplicador aproximado.
2. Distribuir las actividades únicamente entre `1..weeks`.
3. Si la cantidad/organización de áreas no cabe en la disponibilidad real, mostrar una advertencia clara y pedir ajustar horario/duración o usar la distribución registrada; no inventar semanas adicionales.
4. Cuando exista horario real, derivar la secuencia desde ese horario en lugar de asumir cinco actividades por semana.
5. Añadir prueba automática de invariantes: `max(activity.week) <= weeks` para 1–6 semanas, Inicial/Primaria/Secundaria y diferentes cantidades de áreas.
6. Retestar exportación y creación de sesiones para confirmar que no aparezcan semanas fuera del rango de la unidad.

## Corrección aplicada en esta auditoría

Solo documentación de evidencia. No se modificó runtime porque decidir cuántas actividades caben por semana depende del horario/distribución real y una corrección local que simplemente comprima actividades podría ocultar una carga pedagógica inviable.

## Riesgo de regresión

Medio. Cambiar únicamente la fórmula de `week` puede mantener el rango correcto pero concentrar demasiadas actividades en una semana. La corrección debe integrarse con horario/distribución, no limitarse a un `Math.min()` visual.

## Impacto en indicadores

- **IUD:** impacto negativo por incoherencia temporal de Unidad/Proyecto.
- **ICGD:** impacto indirecto por pérdida de coherencia entre configuración, unidad y sesiones.
- **IFR:** afecta confiabilidad funcional de la secuencia.
- **ISU:** una unidad que dice simultáneamente “1 semana” y “Semana 2” aumenta confusión del usuario.
- **Prelaunch:** pendiente; no calcular puntuación definitiva. El hallazgo debe corregirse y retestearse antes de considerar sólido el flujo Unidad → Sesiones.

## Estado V5

**Pendiente de corrección y retest.** DocenteDigital continúa NO APROBADA PARA LANZAMIENTO V1.0 mientras existan bloqueantes previos y falten pruebas reales esenciales.