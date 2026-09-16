# AUD-REDACTION-COHERENCE-287

Fecha: 2026-09-16

## Objetivo

Auditar y mejorar la coherencia de redacción de DocenteDigital usando conjuntamente V2, V3, V4, V5 y `NUCLEO_IA_DOCENTEDIGITAL.md`, con foco en la cadena:

**intención/contexto → título → situación significativa → reto → producto → sesión → criterio → evidencia**.

No se evalúa una función como correcta solo porque produce texto. Esta ronda distingue redacción visible, coherencia pedagógica, no invención y verdad funcional.

## AUD-RED-287-A — Metarredacción en Situación Significativa

- **Entrada:** descripción libre de una Unidad/Proyecto.
- **Esperado:** una situación significativa natural, escrita como parte del documento pedagógico, sin explicar al usuario cómo la IA interpretó su pedido; reto separado de la situación.
- **Obtenido antes:** `proposal-choice-v8.js` construía frases como “La descripción del docente plantea…”, “La intención expresada es…” y añadía `Reto: ...` dentro del texto de la situación, aunque el reto se almacena por separado.
- **Evidencia:** implementación previa de `proposal-choice-v8.js` y `goal-alignment-v28.js`.
- **Estado previo:** NO PASA.
- **Clasificación previa:** PARCIALMENTE FUNCIONAL.
- **Severidad:** S2 ALTO por incoherencia importante y duplicación dentro de un documento pedagógico.
- **Causa raíz:** mezcla entre telemetría/análisis interno y redacción final visible.
- **Corrección:** `proposal-choice-v8.js` v8.1 redacta en lenguaje natural, elimina metarredacción y mantiene el reto como campo independiente; `planning-coherence-v51.js` v51.1 incorpora saneamiento defensivo para evitar que vuelva a aparecer `Reto:` dentro de la situación.
- **Post-fix:** PASA EN IMPLEMENTACIÓN. E2E real con navegador/dispositivo permanece PENDIENTE.
- **Riesgo de regresión:** medio por existencia de varias capas históricas de generación.
- **Impacto:** mejora IUD/ICGD/ISU; no desbloquea V5 por sí sola.

## AUD-RED-287-B — Caso “hormigas en el aula”: preguntas inventadas

- **Entrada:** “Aparecieron hormigas en el aula y queremos investigar sobre ello”.
- **Esperado:** conservar la observación y la intención de investigar sin inventar preguntas específicas no expresadas.
- **Obtenido antes:** el pack de regresión añadía “por qué están allí”, “cómo viven” y “qué características tienen”.
- **Estado previo:** NO PASA.
- **Clasificación previa:** PARCIALMENTE FUNCIONAL.
- **Severidad:** S2 ALTO por añadir contenido no sustentado en la situación del usuario.
- **Corrección:** la nueva redacción parte de la aparición de hormigas, la curiosidad y la indagación; las preguntas concretas deben surgir de los estudiantes o de información realmente proporcionada.
- **Post-fix:** PASA EN IMPLEMENTACIÓN.
- **Evidencia posterior:** `planning-coherence-v51.js` v51.1 y prueba de regresión `ddPlanningRegressionV51.check()`.
- **Riesgo de regresión:** bajo-medio; se añadió gate estático al smoke de prelaunch.

## AUD-RED-287-C — Análisis semántico interno visible en Modo Fácil

- **Entrada:** escribir una idea/contexto en Unidad/Proyecto.
- **Esperado V4:** menos texto, lenguaje sencillo y análisis técnico interno oculto.
- **Obtenido antes:** `meaning-engine-v25.js` podía pintar CONTEXTO/FOCO, claridad de interpretación, actores, problema, causa, síntesis y porcentaje de confianza.
- **Estado previo:** NO PASA en simplicidad de superficie.
- **Clasificación previa:** PARCIALMENTE FUNCIONAL.
- **Severidad:** S3 MEDIO.
- **Causa raíz:** el motor semántico y la interfaz compartían la misma representación de diagnóstico.
- **Corrección:** `visible-analysis-guard-v52.js` v52.2 conserva `state.lastPlanningMeaning` internamente, pero retira cuadrícula técnica, síntesis y notas de telemetría del flujo normal; mantiene títulos propuestos y advertencia breve cuando faltan datos.
- **Post-fix:** PASA EN IMPLEMENTACIÓN; verificación visual física/usuarios reales PENDIENTE.
- **Impacto:** mejora ISU y reduce carga cognitiva.

## AUD-RED-287-D — Finalidad biohuerto

- **Entrada:** saberes de la siembra/tubérculos que se aplicarán para sembrar hortalizas en un biohuerto.
- **Esperado:** la fuente de aprendizaje no debe confundirse con la finalidad; título, situación, reto y producto deben conducir al biohuerto.
- **Obtenido:** el pack focalizado mantiene reto y productos orientados al biohuerto y conserva la relación saberes de siembra → aplicación en hortalizas.
- **Estado:** PASA EN IMPLEMENTACIÓN.
- **Clasificación:** FUNCIONAL EN IMPLEMENTACIÓN / E2E REAL PENDIENTE.
- **Severidad:** S4 residual de estilo, no bloqueante por esta prueba específica.

## AUD-RED-287-E — Títulos naturales en descripciones libres

- **Entrada:** textos libres rurales, urbanos, de interés, observación, problema, oportunidad o finalidad explícita.
- **Esperado:** títulos naturales, pertinentes y no copiados literalmente; la finalidad domina cuando está explícita.
- **Obtenido:** existen capas `title-context-v38.js`, `goal-alignment-v28.js` y motor de sentido; sin embargo, el núcleo actual continúa apoyándose en reglas, regex y plantillas locales. No existe evidencia suficiente de comprensión semántica general mediante IA real para cualquier descripción inédita.
- **Estado:** NO PASA COMO CAPACIDAD GENERAL V1.0.
- **Clasificación:** PARCIALMENTE FUNCIONAL.
- **Acción:** mantener los casos focalizados como guardas, pero cerrar el bloqueante semántico canónico mediante una capa real de comprensión estructurada + guardas locales y batería amplia de entradas libres.
- **Nota:** no crear un S1 duplicado; este punto pertenece a los hallazgos semánticos canónicos ya existentes.

## AUD-RED-287-F — Coherencia de sesión

- **Entrada:** actividad heredada de una Unidad/Proyecto.
- **Esperado:** actividad → título → propósito (qué/cómo/para qué) → competencia/desempeño → criterio → evidencia → secuencia → evaluación.
- **Obtenido:** `session-learning-core-v54.js` implementa la cadena y evita inventar competencia oficial cuando no existe herencia validada.
- **Estado:** PASA EN IMPLEMENTACIÓN / E2E REAL PENDIENTE.
- **Clasificación:** PARCIALMENTE FUNCIONAL hasta verificar sesión completa, edición, persistencia, Word/PDF y registro.

## Funciones que no pueden aprobar coherencia de salida todavía

- **Materiales:** generación real permanece no disponible; no se puede aprobar coherencia de materiales inexistentes.
- **Evaluación/Registro:** flujo funcional completo sigue pendiente; no se puede aprobar coherencia de conclusiones ni trazabilidad final.
- **Carpeta Director:** funciones directivas principales siguen en construcción; no se debe declarar coherencia de RD/oficios/PAT/actas sin generación real, verificación normativa y pruebas E2E.
- **Programación anual:** la función real continúa pendiente.

## Prevención de regresiones añadida

Se amplió `.github/workflows/prelaunch-smoke.yml` con un gate de coherencia de redacción que comprueba como mínimo:

1. que no reaparezcan frases internas como “La descripción del docente…” en la superficie de propuestas;
2. que no se vuelva a insertar `Reto:` dentro de la Situación Significativa;
3. que las dos situaciones se presenten como propuestas simples;
4. que el caso hormigas no vuelva a inventar “por qué están allí” o “cómo viven”;
5. que las guardas de saneamiento permanezcan presentes.

Este gate es técnico y no sustituye pruebas con docentes reales ni una evaluación semántica de 100 generaciones.

## Commits de corrección

- `c3f20ca1f08a3158809ab56aa9c4fb83f8378f46` — `fix: improve planning proposal writing coherence`
- `91902c4a38d02d1cd379dc5f107c0c365cfdaf19` — `fix: remove invented detail from known planning cases`
- `1ab2b1023519131c9556da0542106cc610d06261` — `test: gate planning redaction coherence`
- `0b3d54a38a42ea094e295ee7d0b24341aca236c1` — `fix: simplify visible semantic analysis wording`

## Gate V5

**CONTINÚA BLOQUEADO.**

Estas correcciones mejoran coherencia, lenguaje y no invención, pero no sustituyen los bloqueantes pendientes de V5: funciones esenciales reales, E2E Docente/Director, 100 generaciones, móvil físico, Word/PDF/impresión reales, seguridad/aislamiento, restore, concurrencia, año completo y pilotos.

No se calcula ISU/IFR/Prelaunch definitivo con esta ronda.