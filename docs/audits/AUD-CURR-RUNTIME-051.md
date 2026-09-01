# AUD-CURR-RUNTIME-051 — Arranque silencioso de la protección curricular

## Especificaciones aplicadas
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

## Prueba
**ID:** AUD-CURR-RUNTIME-051  
**Módulo:** Seguridad curricular / errores silenciosos  
**Entrada:** cargar `curriculum-safety-v27.js` cuando el estado base `state` todavía no está disponible por retraso o fallo previo de arranque.  
**Resultado esperado:** la protección curricular no debe quedar desactivada silenciosamente; debe reintentar el arranque y, si el estado continúa ausente, registrar el fallo para auditoría.  
**Resultado obtenido antes:** el archivo marcaba `window.__ddCurriculumSafetyV27=true` y luego ejecutaba `if(typeof state!=='object')return;`. Si `state` aún no existía, la guardia quedaba marcada como iniciada aunque no hubiese instalado ninguna protección.  
**Estado antes:** NO PASA.  
**Severidad:** S2.  
**Clasificación:** PARCIALMENTE FUNCIONAL.  
**Causa raíz:** orden de inicialización no tolerante a retrasos: el indicador de módulo activo se fijaba antes de comprobar su dependencia crítica.

## Corrección segura y reversible
Se actualizó la lógica interna de `curriculum-safety-v27.js` a v29:
- no marca la guardia como activa hasta disponer de `state`;
- reintenta durante una ventana acotada;
- si la dependencia no aparece, registra `curriculum-safety-v27.js` en `window.ddModuleLoadFailures` y crea `window.__ddCurriculumSafetyStartupFailure`;
- mantiene intacta la política existente: mientras `state.curriculumMatrixReady !== true`, las referencias curriculares generadas no se presentan como currículo oficial verificado.

**Commit funcional:** `5c4b334797630d6062d35f80f779713efca3e37c`.

## Evidencia posterior
- GitHub confirmó estado Vercel `success` para el commit funcional.
- Producción `https://docente-digital.vercel.app/curriculum-safety-v27.js` respondió HTTP 200 y sirvió la lógica v29.
- La comprobación administrativa mediante `list_deployments` continúa PENDIENTE por respuesta 403 del scope del equipo; no se declara READY administrativo sin esa evidencia.

## Resultado posterior
PASA dentro del alcance técnico verificable de esta prueba. La seguridad curricular global continúa PARCIALMENTE FUNCIONAL hasta conectar y versionar una matriz curricular oficial y completar las pruebas V5 requeridas.

## Riesgo de regresión
Bajo. El cambio solo afecta el arranque de la guardia y conserva su comportamiento cuando `state` ya está disponible.

## Impacto
- IUD: sin cambio significativo.
- ICGD: mejora la confiabilidad del gate curricular.
- IFR: mejora al eliminar un modo de fallo silencioso.
- ISU: sin puntuación definitiva.
- Prelaunch: reduce un riesgo técnico, pero no cierra bloqueantes V5.

No se aplicó ni se declaró vigente ninguna norma MINEDU en esta corrección; no fue necesaria una afirmación normativa externa.