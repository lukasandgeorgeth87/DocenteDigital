# AUD-RUNTIME-GUARDS-NOT-LOADED-230 — RECTIFICADO

## Alcance
Auditoría V4/V5 + NÚCLEO IA sobre integración real de módulos presentes en el repositorio y carga efectiva en producción.

## Rectificación 2026-09-11
La conclusión histórica de este hallazgo era incorrecta en un punto material: se inspeccionó solamente la lista de `<script src>` declarada directamente en `index.html` y no se siguió el cargador transitivo implementado dentro de `schedule-prompt-v6.js`.

La producción canónica carga `schedule-prompt-v6.js`. Ese archivo contiene `__ddStableModuleLoaderV49` y una lista secuencial `modules=[...]` que incluye expresamente, entre otros:

- `context-semantic-v20.js`
- `curriculum-safety-v27.js`
- `material-integrity-v65.js`
- `director-creativity-v16.js`
- `home-surface-truth-v73.js`
- `planning-archive-simplicity-v56.js`

El cargador crea elementos `<script>`, fija `async=false`, espera `onload` para continuar y reintenta una vez ante `onerror`. Por tanto, la afirmación anterior “no se cargan porque no aparecen directamente en index.html” no es válida.

## Caso AUD-RUNTIME-230-A — integración de `context-semantic-v20.js`
**Entrada:** inspeccionar el grafo real de carga de producción, incluyendo carga transitiva desde `schedule-prompt-v6.js`.

**Resultado esperado:** el módulo debe estar dentro del grafo productivo o quedar explícitamente fuera.

**Resultado obtenido:** `context-semantic-v20.js` figura en la lista del cargador estable de producción.

**Estado de integración por código:** PASA.

**Evidencia pendiente:** no se considera demostrada todavía, mediante navegador E2E real, la ejecución correcta de todas sus funciones ni la calidad semántica resultante. La comprensión semántica real continúa evaluándose por hallazgos específicos como `AUD-FREE-DESCRIPTION-SEMANTIC-ENGINE-MISSING-248` y pruebas del Núcleo IA.

## Caso AUD-RUNTIME-230-B — integración de `curriculum-safety-v27.js`
**Entrada:** inspeccionar el mismo grafo transitivo.

**Resultado esperado:** la guarda curricular debe estar cableada al runtime si se declara activa.

**Resultado obtenido:** `curriculum-safety-v27.js` figura expresamente en la lista del cargador estable de producción.

**Estado de integración por código:** PASA.

**Evidencia pendiente:** sigue siendo obligatorio comprobar en navegador/E2E que la guarda se ejecuta, no es sobrescrita posteriormente y bloquea o etiqueta correctamente referencias curriculares no verificadas. Esto no demuestra por sí solo exactitud curricular ni vigencia normativa.

## Clasificación vigente
- Carga transitiva declarada de los módulos citados: **FUNCIONAL a nivel de integración de código**.
- Ejecución efectiva completa y orden final de overrides: **PENDIENTE DE E2E REAL**.
- Comprensión semántica robusta: **NO DEMOSTRADA** por este hallazgo; se audita en pruebas específicas.
- Seguridad curricular/normativa efectiva: **NO DEMOSTRADA** solo por estar cargada; requiere pruebas anti-alucinación y fuentes oficiales.

## Severidad vigente
El **S1 por “módulos no cargados” queda RETIRADO**, porque la premisa causal era falsa.

Esto no elimina otros S0/S1 abiertos del gate V5 ni convierte DocenteDigital en lista para lanzar. La falta de pruebas E2E, anti-alucinación, matriz/fuentes oficiales verificadas, usuarios reales y demás requisitos V5 permanecen pendientes.

## Causa raíz de la falsa alarma
La auditoría anterior trató la lista de scripts directos de `index.html` como si fuera el grafo completo de ejecución y no inspeccionó el loader transitivo de `schedule-prompt-v6.js`.

## Acción correctiva de auditoría
1. Toda futura auditoría de wiring debe seguir cargas directas y transitivas.
2. No inferir “no cargado” solo porque un asset no figure en `index.html`.
3. Para declarar una guarda FUNCIONAL, añadir prueba E2E de su efecto observable o sentinela runtime.
4. Mantener separadas tres evidencias: asset disponible, módulo cableado, comportamiento probado.

## Riesgo de regresión
**MEDIO.** El loader depende del orden secuencial y de overrides globales. Un cambio en la lista o en el orden puede modificar comportamiento aunque todos los assets respondan 200.

## Impacto en indicadores
- Se retira la penalización S1 específica atribuida a “no cargado”.
- IFR/ICGD siguen pendientes de pruebas del comportamiento real.
- ISU y Prelaunch no se recalculan sin evidencia de usuario/E2E.

## Estado de lanzamiento
**Gate V5 continúa BLOQUEADO** por otros hallazgos y pruebas esenciales pendientes. Esta rectificación evita un falso positivo, no constituye aprobación de V1.0.
