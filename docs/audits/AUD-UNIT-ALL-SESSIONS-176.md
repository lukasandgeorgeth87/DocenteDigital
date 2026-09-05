# AUD-UNIT-ALL-SESSIONS-176

## Resumen

- Módulo: Carpeta Docente → Unidad/Proyecto → Crear sesiones de toda la unidad.
- Estado: NO PASA.
- Clasificación: INEXISTENTE como función masiva; PARCIALMENTE FUNCIONAL para preparación individual de una sesión.
- Severidad: S2 ALTO.
- Corrección automática: NO APLICADA; requiere diseño de modelo de sesiones, persistencia individual, generación masiva, materiales/instrumentos y pruebas E2E.

## Especificaciones obligatorias aplicadas

Se contrastó conjuntamente:

- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

V2 exige expresamente auditar el botón **“CREAR SESIONES DE TODA LA UNIDAD”** y establece que debe leer la unidad completa, identificar todas las sesiones, respetar títulos/áreas/competencias/productos/temporalización, desarrollar cada sesión, diferenciar grados, generar instrumentos y materiales cuando corresponda, auditar cada sesión, guardar cada sesión individualmente, permitir descargar todo y mantener la relación con la unidad original.

V3 exige demostrar funcionamiento real y no aprobar una función por aparecer o responder.

V4 busca reducir trabajo y clics del docente, y V5 exige probar el recorrido Docente de extremo a extremo antes de V1.0.

## Prueba

**ID:** AUD-UNIT-ALL-SESSIONS-176

**Entrada:** crear o abrir una Unidad/Proyecto con varias actividades programadas → pulsar `Crear sesiones` desde la biblioteca o desde la vista completa de la unidad.

**Resultado esperado:** disponer de la función masiva exigida por V2: generar todas las sesiones correspondientes a las actividades de la unidad, preservando la secuencia y relaciones de origen, guardando cada sesión individualmente y ofreciendo una salida conjunta descargable/revisable.

**Resultado obtenido:**

1. En `app.js`, los botones `📝 Crear sesiones` invocan `useUnit(unit.id)`.
2. `useUnit(id)` únicamente marca la unidad activa, guarda ese identificador y navega a la pantalla singular `session`.
3. La pantalla `Crear mi sesión` obliga a escoger una sola `Actividad programada` y su acción principal es `PREPARAR MI SESIÓN MAESTRA`.
4. `generateSession()` construye una sola sesión mediante `buildSession()`.
5. El estado base conserva solo `state.lastSession`; no existe en este flujo una colección persistente de todas las sesiones de una unidad, un proceso iterativo sobre `unit.activities`, una auditoría por sesión ni una descarga conjunta de todas ellas.
6. `enhancements.js` mejora la matriz y secuencia de sesiones de la unidad, pero conserva el botón `Crear sesiones` enlazado a `useUnit(unit.id)`; no implementa la generación masiva exigida.

Por tanto, el plural visible `Crear sesiones` conduce a un flujo de preparación individual y no equivale a **Crear sesiones de toda la unidad**.

## Evidencia técnica

- `app.js`: `renderUnits()` y `renderUnitOutput()` → `onclick="useUnit('...')"`.
- `app.js`: `useUnit()` → `go('session')` y carga de la unidad; sin loop de actividades ni lote de sesiones.
- `app.js`: `generateSession()` → una llamada a `buildSession()` y una salida.
- `app.js`: `state.lastSession=session; save()` → persistencia de la última sesión, no de todas las sesiones de la unidad.
- `index.html`: pantalla singular `Crear mi sesión`, selector `Actividad programada` y botón singular `PREPARAR MI SESIÓN MAESTRA`.
- `enhancements.js`: sección `V. Secuencia de sesiones de aprendizaje`, seguida de botón `Crear sesiones` que todavía llama `useUnit(unit.id)`.

## PASA / NO PASA

**NO PASA.**

## Clasificación funcional

- Preparar una sesión desde una actividad existente: **PARCIALMENTE FUNCIONAL**, sujeto a los demás hallazgos pedagógicos/curriculares ya abiertos.
- Crear automáticamente todas las sesiones de una unidad/proyecto: **INEXISTENTE**.

## Severidad

**S2 ALTO.**

No se eleva automáticamente a S1 porque existe un flujo individual para preparar una sesión; sin embargo, la función masiva está especificada expresamente en V2 y su ausencia afecta reducción de carga, continuidad documental, trazabilidad y el recorrido E2E previo a lanzamiento.

## Causa raíz

El modelo actual fue construido alrededor de una sesión activa/última (`state.lastSession`) y no alrededor de una colección de sesiones versionadas vinculadas a cada actividad de una unidad. La UI reutilizó el plural `Crear sesiones`, pero la implementación navega a un editor de sesión individual.

## Acción correctiva

Implementar, sin simulación:

1. modelo persistente `sessions[]` con `unitId`, `activityId/order`, versión y estado;
2. acción explícita `Crear sesiones de toda la unidad` separada de `Preparar una sesión`;
3. generación iterativa exactamente sobre las actividades vigentes de la unidad;
4. preservación de título, área, competencia validada, producto, temporalización y propósito de origen;
5. diferenciación por grado cuando corresponda;
6. instrumento y materiales relacionados por sesión;
7. auditoría antes de guardar cada sesión;
8. reintento idempotente para evitar duplicados por doble clic/interrupción;
9. guardado individual y recuperación por sesión;
10. revisión previa y descarga conjunta en formato real soportado;
11. pruebas de regresión que validen `n actividades = n sesiones esperadas` y que ninguna sesión quede fuera de su unidad/semana.

## Corrección aplicada en esta auditoría

No se modificó el runtime. Una implementación parcial o un loop rápido sobre `buildSession()` podría multiplicar errores curriculares existentes, sobrescribir `lastSession`, crear duplicados o aparentar una funcionalidad que todavía no posee persistencia y auditoría individual suficientes. Se registra el defecto para una corrección arquitectónica controlada.

## Riesgo de regresión

Alto cuando se implemente: afecta Unidad/Proyecto, Sesiones, materiales, instrumentos, persistencia, exportación y evaluación. Debe cubrirse con pruebas automatizadas antes de promoción a producción.

## Impacto

- **IUD:** impacto negativo alto: obliga a repetir manualmente el flujo por cada actividad.
- **ICGD:** impacto negativo: falta la relación persistente completa Unidad → todas sus Sesiones.
- **IFR:** impacto negativo: una función declarada por la especificación integral no existe como lote real.
- **ISU:** no calcular definitivo; la ausencia aumenta clics y trabajo repetitivo.
- **Prelaunch:** permanece abierto; no sustituye otros S0/S1 ni las pruebas reales de V5.

## Pruebas pendientes

Incluso después de implementar la función deberán seguir como PENDIENTES hasta ejecutarse realmente: Word/PDF físico, móviles físicos, interrupción real, año completo, 100 generaciones cuando exista IA real, seguridad, restore y pilotos con usuarios.

## Fuente normativa

Este hallazgo no declara ni aplica una norma MINEDU nueva. Se basa en las especificaciones internas obligatorias V2/V3/V4/V5/Núcleo IA; por tanto no corresponde inventar una vigencia normativa externa para esta prueba.