# AUD-CURR-UX-050 — Simplificación del aviso de seguridad curricular

## Especificaciones aplicadas
- AUDITORIA_MAESTRA_INTEGRAL_V2.md
- ADENDA_AUDITORIA_EJECUTABLE_V3.md
- AUDITORIA_SIMPLICIDAD_USO_V4.md
- AUDITORIA_PRELANZAMIENTO_V5.md
- NUCLEO_IA_DOCENTEDIGITAL.md

## Prueba
**ID:** AUD-CURR-UX-050

**Entrada:** Abrir `Mi planificación` cuando `state.curriculumMatrixReady !== true`.

**Resultado esperado:** La app debe advertir que las referencias curriculares todavía requieren verificación, pero en Modo Fácil el mensaje debe ser breve, comprensible y no exponer lenguaje técnico innecesario. La protección contra presentar contenido generado como currículo oficial debe mantenerse.

**Resultado obtenido antes:** Se mostraba un aviso largo: “Seguridad curricular: la matriz curricular oficial literal todavía no está conectada/verificada. Los textos pedagógicos generados se muestran como orientaciones provisionales y no como competencias, capacidades, estándares o desempeños oficiales MINEDU.” El contenido era correcto como defensa, pero demasiado técnico para la superficie principal y contradecía V4 (menos texto, lenguaje sencillo, complejidad interna oculta).

**Estado inicial:** NO PASA

**Severidad:** S3 — dificultad UX / exceso de tecnicismo visible.

**Clasificación funcional:** PARCIALMENTE FUNCIONAL.

## Causa raíz
La misma redacción técnica usada para la política interna de seguridad curricular se exponía directamente al usuario final.

## Corrección aplicada
Cambio pequeño y reversible en `curriculum-safety-v27.js`, manteniendo la lógica de bloqueo intacta y simplificando únicamente el texto visible a:

> ⚠ Currículo por verificar. Aún no se ha conectado la matriz curricular oficial. Revisa las referencias curriculares antes de usar o descargar este documento.

La política interna sigue impidiendo presentar heurísticas como currículo oficial mientras `curriculumMatrixReady !== true`.

## Evidencia posterior
- Commit funcional: `8ecde7b54e6f7906dbfd87afd426051a80df9cfc`.
- Producción `/`: HTTP 200 verificado.
- Producción `/curriculum-safety-v27.js`: HTTP 200 y sirve la lógica v28 con el nuevo aviso.
- Estado administrativo Vercel READY: PENDIENTE. La API de deployments devolvió HTTP 403 por falta de autorización al scope del equipo; no se declara READY sin esa evidencia.

## Resultado posterior
PASA dentro de la evidencia técnica verificable de esta corrección UX.

## Riesgo de regresión
Bajo. Solo cambia el texto visible y la versión interna; no se modifica la condición `curriculumMatrixReady`, la sanitización ni el bloqueo de referencias oficiales.

## Impacto
- IUD: mejora de claridad y menor carga cognitiva.
- ICGD/IFR: sin cambio funcional sustantivo.
- ISU: mejora parcial no cuantificada; no se asigna puntaje definitivo sin usuarios reales.
- Prelaunch: no elimina bloqueantes V5.

## Pendientes V5 relacionados
La matriz curricular oficial literal, versionada y verificada sigue sin estar conectada. No retirar la protección hasta completar esa integración y su validación. Pruebas físicas, seguridad, backend, IA real, usuarios reales y demás gates V5 continúan PENDIENTES cuando corresponda.
