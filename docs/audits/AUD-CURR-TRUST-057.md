# AUD-CURR-TRUST-057 — Límite de confianza de la matriz curricular

## Módulo
Seguridad curricular / Unidad-Proyecto / exportación.

## Entrada de prueba
Estado local persistido con `curriculumMatrixReady: true` sin que exista una matriz curricular oficial literal, versionada y conectada mediante una integración verificable.

## Resultado esperado
Un valor editable/persistido en el navegador no debe poder habilitar el modo que presenta referencias como currículo oficial. Mientras no exista una matriz oficial conectada y verificable, todo contenido curricular generado debe permanecer claramente marcado como preliminar.

## Resultado obtenido antes
`curriculum-safety-v27.js` consideraba lista la matriz únicamente con `state.curriculumMatrixReady===true`. `state` se reconstruye desde `localStorage` en `app.js`, por lo que un estado antiguo, corrupto o manipulado podía desactivar la protección curricular aunque todavía no exista integración oficial verificable.

Además, `enhancements.js` contiene bancos/propuestas locales de competencias, capacidades y orientaciones por grado. La guardia de seguridad los reetiqueta como preliminares mientras no haya matriz verificada, pero esa protección podía quedar anulada por el flag local.

## Evidencia
- `app.js`: `state` se carga desde `localStorage`.
- `curriculum-safety-v27.js` previo: `const ready=()=>state.curriculumMatrixReady===true`.
- `enhancements.js`: `competenceMap` y generación local de propósitos/desempeños orientativos.
- V3: exige fuente única, procedencia, RAG normativo/curricular verificable y prohíbe aprobar por mera respuesta.
- V5: normativa o competencias inventadas son bloqueantes de lanzamiento.
- Núcleo IA: si IA y fuente oficial entran en conflicto, gana la fuente oficial; la base oficial protege.

## Resultado inicial
**NO PASA — S1 CRÍTICO — PARCIALMENTE FUNCIONAL.**

Riesgo: una referencia local/provisional podía presentarse sin la advertencia de seguridad si el flag persistido quedaba en `true` antes de existir la integración curricular oficial.

## Causa raíz
Se utilizaba un dato del mismo almacenamiento local del usuario como evidencia de confianza para habilitar el modo curricular oficial.

## Acción correctiva
Cambio pequeño y reversible en `curriculum-safety-v27.js`, lógica interna v30:

1. el modo oficial permanece cerrado hasta que exista una integración curricular literal, versionada y verificable;
2. `curriculumMatrixReady` local ya no habilita la confianza curricular;
3. al iniciar, se fuerza `state.curriculumMatrixReady=false` mientras no exista dicha integración;
4. se conserva el aviso breve V4 y la sanitización de encabezados/exportación.

Commit funcional: `526465fe355014fbaba326af3465364f65193f2f`.

## Retest técnico
- Revisión estática posterior: el valor local `curriculumMatrixReady:true` ya no puede hacer que `ready()` devuelva `true`.
- No se declara todavía matriz curricular oficial integrada.
- No se simularon pruebas físicas, IA real, usuarios reales ni validación normativa de contenido generado.

## Estado posterior
**PASA para el defecto puntual con evidencia técnica disponible.**

El módulo curricular global continúa **PARCIALMENTE FUNCIONAL** hasta conectar una matriz oficial versionada y realizar pruebas de correspondencia nivel/ciclo/grado/área/competencia/capacidad/estándar/desempeño con fuentes oficiales vigentes.

## Riesgo de regresión
Medio: cuando se conecte la matriz oficial será necesario sustituir el cierre temporal por un mecanismo verificable de confianza (metadatos de fuente, versión/vigencia y validación), sin volver a depender de un simple flag de `localStorage`.

## Impacto en gates
- ICGD/IFR: mejora la confianza curricular y reduce error silencioso.
- ISU: sin impacto material; el aviso al usuario continúa breve.
- Prelaunch: elimina este bypass puntual, pero NO elimina los bloqueantes V5 generales (matriz oficial real, seguridad, backend/autenticación, Word/PDF físicos, móvil físico, backup/restore, 100 generaciones, año completo, concurrencia y pilotos).