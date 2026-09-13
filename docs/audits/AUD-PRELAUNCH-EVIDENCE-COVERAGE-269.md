# AUD-PRELAUNCH-EVIDENCE-COVERAGE-269 — El gate visible V5 omitía pruebas obligatorias

## Alcance
Auditoría acumulativa V2 + V3 + V4 + V5 + Núcleo IA. Revisión del gate de evidencia de prelanza mostrado y expuesto programáticamente por `prelaunch-evidence-gate-v50.js`. No modifica `CUSCO-DECIDE-ELECCIONES-2026`.

## ID de prueba
AUD-PRELAUNCH-EVIDENCE-COVERAGE-269

## Módulo
Prelaunch V5 · trazabilidad de bloqueantes · Settings · evidencia de lanzamiento

## Entrada
1. Leer conjuntamente V2, V3, V4, V5 y Núcleo IA.
2. Comparar las pruebas obligatorias de V5 con el arreglo `mandatory` de `prelaunch-evidence-gate-v50.js` en `main` antes de la corrección.
3. Verificar si el gate interno enumera explícitamente las pruebas reales que todavía deben permanecer pendientes.

## Resultado esperado
El gate interno no debe sugerir una cobertura menor que la exigida por V5. Como mínimo debe mantener visibles/programáticamente pendientes las pruebas reales esenciales que no pueden aprobarse por presencia de código: seguridad/aislamiento, DOCX, PDF/impresión, móvil físico, backup/restore, continuidad ante caída de IA, E2E Docente, E2E Director, 100 generaciones/anti-alucinación, año completo/escala, monitoreo/costo y pilotos.

La lista no sustituye las pruebas: solo evita que el producto pierda trazabilidad sobre lo que falta demostrar.

## Resultado obtenido antes de corregir
`prelaunch-evidence-gate-v50.js` contenía ocho entradas obligatorias:

- seguridad/aislamiento;
- DOCX real;
- móvil físico;
- backup/restauración;
- E2E Docente;
- E2E Director;
- 100 generaciones;
- pilotos.

Sin embargo, V5 exige además de manera expresa probar PDF e impresión reales, año escolar completo y escala, continuidad cuando falla el proveedor IA, costos IA y monitoreo productivo. Esas obligaciones no aparecían en `mandatory`.

El módulo seguía devolviendo `productionGate:false`, por lo que el defecto no hacía que la aplicación se aprobara automáticamente en el estado actual. El riesgo era de cobertura y trazabilidad: al ir cerrando los ocho ítems existentes, el gate podía dejar de representar todas las pruebas V5 todavía pendientes.

## Evidencia
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`:
  - sección 9: Word/PDF e impresión reales;
  - sección 10: año completo y escala;
  - sección 12: continuidad y caída del proveedor IA;
  - sección 13: costos IA;
  - sección 14: monitoreo productivo;
  - secciones 2, 5, 8, 11 y 16: E2E, IA100, móvil, seguridad y pilotos.
- `prelaunch-evidence-gate-v50.js` previo a `7035a6e69369f6802bd281f9c6b525361b950014`: solo ocho entradas en `mandatory`.
- `.github/workflows/prelaunch-smoke.yml` ya advierte que el smoke técnico no sustituye pruebas físicas, backend, seguridad, restore, IA semántica, concurrencia ni pilotos.

## PASA / NO PASA antes de corregir
NO PASA

## Clasificación antes de corregir
PARCIALMENTE FUNCIONAL

El gate decía correctamente “NO APROBADO”, pero su inventario de evidencia obligatoria era incompleto.

## Severidad
S2 — ALTO.

Justificación: es una incoherencia importante de trazabilidad del gate de prelanza. No se eleva a S1 porque el estado actual seguía siendo `productionGate:false` y no se demostró que una publicación hubiera sido aprobada por esta omisión. Tampoco es S0: no se demostró fuga, pérdida irreversible, corrupción o privilegio indebido.

## Causa raíz
El arreglo `mandatory` se creó como una lista resumida de ocho pruebas reales y no se mantuvo sincronizado con todas las obligaciones explícitas añadidas/recogidas por V5.

## Corrección aplicada
Commit funcional:

`7035a6e69369f6802bd281f9c6b525361b950014` — `fix: complete V5 runtime evidence gate coverage`

Se agregaron cuatro controles de evidencia:

1. `V5-PDF-PRINT-REAL-001` — S1 — PDF e impresión reales.
2. `V5-CONTINUITY-IA-001` — S1 — continuidad ante indisponibilidad del proveedor IA.
3. `V5-YEAR-SCALE-001` — S1 — año escolar completo y escala prevista.
4. `V5-MONITOR-COST-001` — S2 — monitoreo productivo y costo IA medidos.

Todos nacen como `PENDIENTE_PRUEBA_REAL`, `passed:false`; no se simula ninguna aprobación. Los S0/S1 añadidos pasan al arreglo `blockers` de manera automática por la lógica existente.

## Resultado posterior
PASA EN IMPLEMENTACIÓN / PENDIENTE DE LAS PRUEBAS REALES QUE EL GATE ENUMERA.

Evidencia posterior observada:

- GitHub `main` posterior al registro inicial: `96a55cbf366f01dc24665a11ffff00e9e76aab32`, cuyo padre es el commit funcional `7035a6e69369f6802bd281f9c6b525361b950014`.
- GitHub Actions `Prelaunch Smoke` run `34762491197` / #290: `completed / success` exactamente sobre `96a55cbf366f01dc24665a11ffff00e9e76aab32`.
- Vercel deployment `dpl_HVKydJ1diXhbrzBigtNEupTg24rd`: `READY · production` exactamente sobre `96a55cbf366f01dc24665a11ffff00e9e76aab32`.
- URL canónica `https://docente-digital.vercel.app/`: HTTP 200 en la reprueba posterior.
- Asset productivo `prelaunch-evidence-gate-v50.js`: HTTP 200 y contiene los cuatro nuevos identificadores `V5-PDF-PRINT-REAL-001`, `V5-CONTINUITY-IA-001`, `V5-YEAR-SCALE-001` y `V5-MONITOR-COST-001`.
- Observabilidad Vercel: sin errores runtime detectados en la última hora de la reprueba.

La corrección demuestra cobertura del inventario del gate, no ejecución de PDF/impresión, caída de IA, año completo, escala, monitoreo/costo ni el resto de pruebas físicas/usuarios/backend. Esas pruebas permanecen `PENDIENTE_PRUEBA_REAL`.

## Acción correctiva adicional
- Añadir en una futura suite automatizada una aserción que compare identificadores mínimos del gate con los requisitos V5 automatizables/no automatizables, para evitar regresión de cobertura.
- Mantener cada evidencia real externa con fecha, entorno, dispositivo/herramienta, resultado y responsable de prueba.
- No convertir manualmente un ítem en PASA solo por existencia de código.

## Riesgo de regresión
MEDIO. Si V5 se amplía o cambia y el arreglo `mandatory` no se sincroniza, el gate puede volver a subrepresentar requisitos. El riesgo puede reducirse con una prueba de contrato de cobertura.

## Impacto en indicadores
- IUD: PENDIENTE; el hallazgo no autoriza cálculo definitivo.
- ICGD: mejora de trazabilidad del gate, sin puntuación definitiva.
- IFR: mejora de cobertura de riesgos; sigue PENDIENTE de pruebas reales.
- ISU: sin cálculo; el cambio no sustituye piloto de usabilidad.
- Prelaunch: sigue BLOQUEADO. La corrección solo mejora la representación de bloqueantes; no demuestra ninguno de ellos.

## Fuente oficial externa
No se aplicó ni declaró vigente ninguna norma externa nueva en esta prueba. La corrección se basa exclusivamente en las especificaciones internas obligatorias V2–V5 y Núcleo IA.

## Estado
CORREGIDO EN IMPLEMENTACIÓN Y DESPLEGADO / PRUEBAS V5 REALES SIGUEN PENDIENTES.
