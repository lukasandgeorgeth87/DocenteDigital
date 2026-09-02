# AUD-UNIT-DELETE-ASYNC-SURFACE-091

## Resumen

Se detectó una regresión de verdad funcional en la superficie del archivo de Unidades/Proyectos. La protección introducida para impedir borrado irreversible seguía bloqueando correctamente `deleteUnit()`, pero `planning-archive-simplicity-v56.js` reconstruía de forma asíncrona el archivo compacto y volvía a insertar botones `Eliminar` con `onclick="deleteUnit(...)"` después de que la guardia visual había terminado su barrido. El usuario podía, por tanto, ver una acción que parecía disponible aunque internamente ya estaba bloqueada.

## Prueba

- **ID:** AUD-UNIT-DELETE-ASYNC-SURFACE-091
- **Módulo:** Mi planificación → Mis unidades y proyectos → Eliminar
- **Entrada:** Tener al menos una Unidad/Proyecto guardado, abrir `Mi planificación`, esperar el render compacto del archivo y observar/intentar la acción `Eliminar`.
- **Resultado esperado:** Mientras no exista papelera + recuperación, toda acción de eliminación debe permanecer deshabilitada y marcada como `Eliminar · Próximamente`; ninguna reconstrucción asíncrona debe volver a presentarla como activa.
- **Resultado obtenido antes:** `planning-archive-simplicity-v56.js` reconstruía el archivo mediante `setTimeout(compactRender, 0)` y volvía a crear botones `Eliminar` con `onclick="deleteUnit(...)"`. La función `deleteUnit()` seguía protegida y no borraba datos, pero la superficie visual quedaba engañosa.
- **Evidencia previa:** Orden del cargador en `schedule-prompt-v6.js`: `home-surface-truth-v73.js` se carga antes de `planning-archive-simplicity-v56.js`. En `planning-archive-simplicity-v56.js`, `compactRender()` genera nuevamente acciones `Eliminar` después del render base.
- **Estado previo:** NO PASA
- **Clasificación previa:** PARCIALMENTE FUNCIONAL
- **Severidad:** S3 MEDIO
- **Causa raíz:** regeneración asíncrona del DOM posterior a una protección visual basada en barrido sin observación continua.

## Corrección aplicada

Commit funcional: `08410b363da50de3b34818cec2c4bb7e5b745afb`.

Se añadió `installUnsafeDeleteObserver()` en `home-surface-truth-v73.js`. El observador escucha únicamente cambios `childList` dentro de `#plan` y, en una microtarea, vuelve a ejecutar `markUnsafeUnitDeleteActions()`. Así, cualquier botón `deleteUnit(...)` insertado posteriormente por el archivo compacto queda deshabilitado, sin `onclick`, con `aria-disabled`, explicación y texto `Eliminar · Próximamente`.

La protección funcional de `deleteUnit()` permanece como segunda defensa, por lo que el cambio no habilita borrado ni simula una papelera.

## Retest técnico

- Vercel deployment del commit funcional: `dpl_2fiukTupH6r3NwZqmJM2YF8kxxZE`.
- Estado: `production · READY`.
- `https://docente-digital.vercel.app/`: HTTP 200.
- `https://docente-digital.vercel.app/home-surface-truth-v73.js`: HTTP 200.
- El archivo servido en producción contiene `installUnsafeDeleteObserver()`, `MutationObserver` y la llamada desde `guardUnsafeUnitDeletion()`.

## Resultado posterior

- **PASA:** integración técnica de la verdad visual frente a reconstrucciones asíncronas del archivo.
- **Clasificación posterior del punto específico:** FUNCIONAL como guardia de superficie.
- **Función completa Eliminar → Papelera → Recuperar → Eliminación definitiva:** INEXISTENTE / PENDIENTE V5.

## Riesgo de regresión

Bajo. El observador se limita a `#plan`, solo observa inserciones/remociones de nodos y solo modifica botones cuyo `onclick` contiene `deleteUnit(`. No cambia Unidades/Proyectos, documentos históricos, contenido pedagógico ni datos del usuario.

## Impacto en métricas/gates

- **ISU:** mejora parcial cualitativa al eliminar una acción contradictoria.
- **IUD/ICGD/IFR:** sin puntuación definitiva; no hay evidencia suficiente para recalcular índices globales.
- **Prelaunch:** mejora técnica parcial, pero no modifica el estado global del gate. Papelera y recuperación real continúan pendientes.

## Fuentes de especificación aplicadas

- V3: una función no aprueba por aparecer; exige comportamiento verificable y evidencia.
- V4: borrado seguro = confirmación + papelera + recuperación, y la interfaz debe ser clara y consistente.
- V5: crear/editar/eliminar/recuperar documentos debe probarse realmente antes del lanzamiento.

No se aplicó ni se declaró vigente ninguna norma educativa nueva en esta corrección.
