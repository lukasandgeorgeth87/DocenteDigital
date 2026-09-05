# AUD-100GEN-EVIDENCE-171 — No existe evidencia ejecutable de la prueba obligatoria de 100 generaciones

## Alcance
Auditoría acumulativa V2 + V3 + V4 + V5 + Núcleo IA. Hallazgo de prelaunch/evidencia. No modifica CUSCO-DECIDE-ELECCIONES-2026.

## ID de prueba
AUD-100GEN-EVIDENCE-171

## Módulo
IA · Calidad pedagógica/directiva · Prelaunch Gate · Pruebas repetibles

## Entrada
1. Revisar V3 y V5 para identificar la batería obligatoria de 100 generaciones.
2. Inspeccionar el árbol actual del repositorio y la automatización de prelaunch.
3. Buscar harness, dataset/golden tests, resultados versionados o job automatizado que ejecute y mida 100 generaciones.
4. Contrastar con producción actual y con el alcance declarado por el workflow de CI.

## Resultado esperado
V3 exige una prueba de 100 generaciones midiendo éxito técnico, coherencia, exactitud curricular y normativa, formato, tiempo, alucinaciones, repetición, documentos vacíos, datos perdidos y archivos corruptos, usando golden tests pedagógicos y directivos previamente validados. V5 repite esta obligación para pedagogía y dirección antes del lanzamiento.

La evidencia válida debe ser repetible y conservar, como mínimo: caso/entrada, salida, versión/commit, criterios evaluados, resultado por caso, fallos, fecha y artefactos suficientes para revisar los NO PASA. No basta con declarar que “se probó”.

## Resultado obtenido
El repositorio actual contiene una única automatización principal de prelaunch: `.github/workflows/prelaunch-smoke.yml`. Ese workflow verifica existencia de especificaciones, sintaxis JavaScript, marcadores de merge, archivos de entrada, activos locales y cableado de ciertos módulos críticos. Al final declara expresamente que es solo un `technical smoke gate` y que NO valida IA semántica, usuarios, backend, OWASP ASVS, restore, concurrencia, móvil físico ni otras pruebas V5.

No existe en el árbol versionado un harness identificable de 100 generaciones, un conjunto golden de casos Docente/Director, ni un resultado versionado que permita comprobar las métricas exigidas por V3/V5 para cien ejecuciones. Tampoco hay un job del workflow que ejecute dicha batería antes de producción.

La producción actual responde HTTP 200 y el último deployment visible está READY, pero esas señales solo demuestran disponibilidad/despliegue; no constituyen evidencia de 100 generaciones correctas.

## Evidencia
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`, secciones 9, 10 y 28: prueba de 100 generaciones, consistencia y pruebas definitivas.
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`, sección 5: prueba de 100 generaciones obligatoria antes de lanzamiento.
- `.github/workflows/prelaunch-smoke.yml`: alcance técnico explícitamente limitado y sin job de 100 generaciones.
- Árbol actual del repositorio: no contiene suite/harness/dataset golden/resultados de 100 generaciones identificables.
- Producción `https://docente-digital.vercel.app/`: HTTP 200 en la verificación de esta pasada; ello no sustituye la batería.

## PASA / NO PASA
NO PASA

## Clasificación
INEXISTENTE como evidencia ejecutable de prelaunch.

No se clasifica la calidad de la IA como ROTA solo por ausencia de esta batería: lo que está demostrado como inexistente es la evidencia requerida para aprobarla.

## Severidad
S1 — CRÍTICO para Prelaunch V5.

Justificación: V5 la exige de forma explícita antes del lanzamiento y la batería es la que debe detectar alucinaciones, inconsistencias, documentos vacíos/corruptos y errores pedagógicos/normativos repetitivos. Sin ella no existe base probatoria para liberar la IA como función esencial. No es S0 porque en esta prueba no se demostró fuga, pérdida irreversible, privilegio indebido ni corrupción efectiva de un documento real.

## Causa raíz
El proyecto tiene smoke técnico y muchas guardas locales, pero todavía no posee una infraestructura de evaluación reproducible que trate la generación Docente/Director como un sistema sometido a casos golden y métricas por versión.

## Acción correctiva
Pendiente; requiere IA real/evaluable y un diseño de evaluación, por lo que no se debe simular con 100 salidas locales deterministas.

Implementar:
1. corpus golden separado Docente/Director con casos rural, urbano, EIB, monolingüe, multigrado, unidocente, polidocente, Inicial, Primaria y Secundaria;
2. casos adversariales: norma inexistente, competencia inexistente, dato institucional faltante, contradicción, biohuerto/finalidad X→Y, hormigas en aula, territorio no comunitario y actos administrativos fuera de competencia;
3. runner que conserve entrada, salida, SHA, versión de modelo/prompt/reglas y métricas;
4. evaluadores deterministas para hechos/currículo/normativa y revisión humana para calidad pedagógica/directiva donde corresponda;
5. detección de repetición, vacío, pérdida de datos y corrupción de exportación;
6. umbrales de bloqueo definidos antes de ejecutar, sin acomodarlos al resultado;
7. artefacto auditable por ejecución y comparación con baseline;
8. integración como gate previo a promoción productiva cuando exista la arquitectura de IA real.

## Reprueba obligatoria
- Ejecutar exactamente 100 casos versionados sobre un SHA candidato.
- Conservar los 100 resultados y el resumen reproducible.
- Revisar manualmente muestras y todos los fallos críticos.
- Repetir tras cambios de modelo, prompt, RAG, currículo o guardas críticas.
- Demostrar que un caso S0/S1 bloquea la promoción a producción.

## Riesgo de regresión
MUY ALTO en funciones generativas: un cambio pequeño de prompt/modelo/regla puede mejorar un caso y romper otro sin que el smoke de sintaxis lo detecte.

## Impacto en indicadores
- IUD: PENDIENTE; no calcular sin usuarios/resultado utilizable.
- ICGD: PENDIENTE; falta evidencia de consistencia documental.
- IFR: PENDIENTE; la batería faltante impide estimar fiabilidad generativa.
- ISU: PENDIENTE; no sustituye pilotos ni medición real.
- Prelaunch: BLOQUEADO por ausencia de esta evidencia obligatoria.

## Estado
ABIERTO / PENDIENTE DE IA REAL + CORPUS GOLDEN + RUNNER + GATE PREPRODUCTIVO.
