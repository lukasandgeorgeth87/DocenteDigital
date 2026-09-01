# AUD-SES-CURR-043 — Seguridad curricular en sesiones

## Especificaciones aplicadas

- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

## Prueba

**ID:** AUD-SES-CURR-043  
**Módulo:** Sesiones — currículo — anti-alucinación / trazabilidad  
**Clasificación inicial:** PARCIALMENTE FUNCIONAL  
**Severidad:** S1

### Entrada

Crear una sesión desde una unidad/proyecto mientras `state.curriculumMatrixReady !== true`, es decir, sin matriz curricular oficial literal, versionada y verificada conectada.

### Resultado esperado

La sesión puede mostrar orientación pedagógica provisional, pero no debe presentar una heurística, inferencia o propuesta generada como si fuera competencia, capacidad o desempeño oficial. La ausencia de fuente oficial debe quedar visible antes de usar, descargar o imprimir.

### Resultado obtenido antes

`app.js` asignaba `session.competence` mediante `competenceFor(area,title)`, una heurística local basada en área/título. `session-learning-core-v54.js` heredaba `p.competence` cuando existía, pero mantenía `session.competence` como respaldo; luego `sessionHtml()` continuaba mostrando `Competencia priorizada:` y podía añadir `Capacidades:` y `Desempeño precisado:`. La guardia `curriculum-safety-v27.js` protegía la salida de Unidad y Word de Unidad, pero no envolvía la salida de Sesión y además cargaba antes de `session-learning-core-v54.js`.

### Evidencia

- `app.js`: `competenceFor()` y `buildSession()`.
- `session-learning-core-v54.js`: `inheritCurriculum()`, `enrich()` y wrapper de `sessionHtml()`.
- `curriculum-safety-v27.js`: saneamiento limitado a `renderUnitOutput` y `unitWordHtml`.
- Orden de carga previo en `schedule-prompt-v6.js`.

### Resultado inicial

**NO PASA — S1 — PARCIALMENTE FUNCIONAL.**

## Causa raíz

La protección curricular se implementó primero para Unidad/Proyecto, pero la capa posterior de Sesión agregó y volvió a renderizar campos curriculares sin una segunda defensa específica después del núcleo de sesión.

## Corrección segura y reversible

Se añadió `session-curriculum-safety-v67.js` y se carga inmediatamente después de `session-learning-core-v54.js`.

Mientras `state.curriculumMatrixReady !== true`:

- `Competencia priorizada:` pasa a `Referencia curricular provisional:`;
- `Capacidades:` pasa a `Capacidades por verificar:`;
- `Desempeño precisado:` pasa a `Desempeño por verificar:`;
- se añade una advertencia visible antes de usar o imprimir la sesión;
- no se inventa, reemplaza ni declara como oficial ningún contenido curricular;
- la misma defensa se aplica a `sessionHtml()`, por lo que alcanza la salida HTML utilizada por exportación cuando ésta reutiliza esa función.

Se añadió `ddAuditSessionCurriculumSafety()` como comprobación técnica local.

## Evidencia posterior

- Commit de la defensa: `2a392ae6c34103f8741b2188fbf29f7a3b5c666c`.
- Commit de carga estable: `ee3a2b4e5d1f5243ed05fb897c858fef76d649a0`.
- Deployment asociado al commit de carga: `dpl_Ey1UuaymeKFYaJdFn2g4gLtNKeVM` — **production / READY**.
- `https://docente-digital.vercel.app/` — **HTTP 200**.
- `https://docente-digital.vercel.app/schedule-prompt-v6.js` — **HTTP 200** y contiene `session-curriculum-safety-v67.js` inmediatamente después del núcleo de sesión.
- `https://docente-digital.vercel.app/session-curriculum-safety-v67.js` — **HTTP 200** y sirve la defensa desplegada.

## Estado posterior

**PASA la defensa técnica de etiquetado / PARCIALMENTE FUNCIONAL el módulo de sesión.**

No se declara que la competencia, capacidad o desempeño sean correctos u oficiales. La conexión de matriz curricular literal/versionada y las pruebas pedagógicas reales siguen PENDIENTES. Tampoco se simularon Word físico, PDF, impresión, celular, usuarios reales ni prueba de 100 generaciones.

## Fuente oficial

No se aplicó ni declaró vigente una norma MINEDU específica en esta corrección. Por tanto, no se introdujo ninguna afirmación normativa nueva que requiera declarar vigencia. La verificación curricular oficial continúa pendiente hasta conectar y versionar fuentes oficiales.

## Riesgo de regresión

Bajo-medio. Si una futura capa reemplaza `sessionHtml()` después de V67, podría omitir la defensa; por ello `ddAuditSessionCurriculumSafety()` debe permanecer en regresión y V67 debe conservarse después del núcleo de sesión.

## Impacto en gates

- **IUD / ICGD / IFR:** mejora parcial de confianza documental; sin puntuación definitiva.
- **ISU:** impacto neutro/ligeramente positivo por advertencia clara; sin puntuación definitiva.
- **Prelaunch:** reduce un riesgo S1 de presentación curricular engañosa, pero no cierra el bloqueante de exactitud curricular/anti-alucinación porque la matriz oficial real todavía falta.

## Bloqueantes V5 que permanecen

Autenticación y aislamiento multiusuario, backend seguro, OWASP ASVS, backup/restauración real, matriz curricular y normativa oficial versionadas, IA semántica real, prueba de 100 generaciones, Word/PDF/impresión físicos, dispositivos físicos, año escolar completo, concurrencia productiva y pilotos con usuarios reales.