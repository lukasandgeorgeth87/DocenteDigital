# Docente Digital — Fase 5: Comunicación de Primaria

**Fecha:** 28 de octubre de 2026  
**Base:** copia independiente de fase 4; acumula sus correcciones multigrado y de ciclos III, IV y V.  
**Estado:** mejoró la trazabilidad de competencias y la secuencia según la actividad. **No** se certifican desempeños literales por grado.

## Fuente y alcance

La publicación institucional [Programa Curricular de Educación Primaria — MINEDU](https://www.gob.pe/institucion/minedu/informes-publicaciones/6790803-programa-curricular-de-educacion-primaria), publicada en el portal estatal el 21 de mayo de 2025, enlaza el programa curricular. El [repositorio institucional](https://repositorio.minedu.gob.pe/handle/20.500.12799/4549) describe las competencias, capacidades, estándares y desempeños por grado. El archivo `official-curriculum-v1.js` ya contenía las tres competencias de Comunicación y un listado de sus capacidades; en esta fase se ha auditado ese alcance y corregido la asignación por actividad.

**Límite verificable:** durante esta revisión el acceso directo al PDF original del repositorio presentó un control automático de seguridad. Las búsquedas oficiales respaldan la organización general, pero no fue posible cotejar literalmente, uno por uno, los desempeños por grado o cada página del PDF. Por eso `performanceMatrixReady` permanece en `false` y no se introdujeron desempeños como si fueran transcripciones oficiales.

## Tres competencias y clasificación funcional

| Competencia del área de Comunicación | Capacidades representadas en el núcleo | Acciones que la priorizan en el título |
| --- | ---: | --- |
| Se comunica oralmente en su lengua materna | 6 | Dialogamos, conversamos, escuchamos, presentamos, exponemos |
| Lee diversos tipos de textos escritos en su lengua materna | 3 | Leemos, leer, comprendemos |
| Escribe diversos tipos de textos en su lengua materna | 4 | Escribimos, redactamos, revisamos un texto |

La **acción principal al comienzo** del título tiene prioridad ante menciones secundarias. Así:

- «Dialogamos sobre la lectura de un relato» prioriza **oralidad**.
- «Leemos textos y escribimos un resumen» prioriza **lectura**.
- «Escribimos un texto y luego lo leemos» prioriza **escritura**.
- Cuando no hay acción principal reconocible, la sesión presenta la advertencia **competencia por confirmar**. Se mantiene provisionalmente la conducta histórica del selector para no romper documentos guardados; el docente todavía debe confirmar su elección.

## Mejoras incorporadas al producto

1. **Núcleo curricular:** `official-curriculum-v1.js` expone una clasificación común para las tres competencias, y el selector da prioridad a la acción principal.
2. **Propósito y criterio:** `session-learning-core-v54.js` usa el mismo clasificador y evita formular un propósito de lectura para una tarea de escritura cuyo título también dice «leemos».
3. **Secuencia didáctica:** `session-teaching-sequence-v3.js` ahora diferencia actividades, momentos, evidencias y mediación para lectura, escritura y comunicación oral.
4. **Trazabilidad visible:** las sesiones de Comunicación de Primaria incluyen competencia priorizada, capacidades y enlace al programa institucional cuando la fuente está identificada. Se muestra una advertencia de que los **desempeños de cada grado aún no han sido cotejados literalmente**.
5. **Compatibilidad:** se mantienen los grados seleccionados del III, IV y V ciclo, unidades/proyectos, registro formativo, anexos y exportación a Word.

## Resultados de prueba

- **15/15 pruebas automáticas offline aprobadas.** Se incorpora `tests/primary-communication-curriculum.mjs`.
- Tres competencias y 13 capacidades representadas; ocho ejemplos de títulos que podrían confundir la selección, probados contra el núcleo real.
- Ejercicios de oralidad, lectura y escritura de Primaria prueban actividades distintas dentro de la sesión y la referencia curricular en el documento Word generado (comprobación ZIP/XML).
- Continúan aprobadas las pruebas de Inicial, Secundaria, atención multigrado con seis combinaciones de grados y conservación de anexos históricos.
- No se hizo una prueba visual en Microsoft Word ni un ensayo docente con estudiantes reales.

## Lo que sigue pendiente de la validación curricular completa

1. Obtener una copia accesible, versionada y verificable del PDF oficial de Primaria; identificar páginas exactas de Comunicación.
2. Extraer una matriz **competencia → capacidad → estándar por ciclo → desempeño por grado (1.º a 6.º)** con enlace/página y revisión de especialista. Cada entrada debe documentar su procedencia y la versión normativa.
3. Relacionar criterios/evidencias específicos con esa matriz, con confirmación docente cuando el título combine dos competencias. Evitar presentar las propuestas generadas como desempeños literales.
4. Someter tres planificaciones completas (una por cada ciclo, con combinaciones multigrado) a docentes en aula y revisar el Word real.

**No se modificaron GitHub, Supabase, producción ni las copias de fases 1–4.** Este ZIP contiene el código fuente; no es un instalador `.exe` o `.apk`.
