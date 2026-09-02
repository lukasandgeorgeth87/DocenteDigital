# AUD-PRELAUNCH-ASSET-GATE-106

## Alcance
Auditoría conjunta bajo AUDITORIA_MAESTRA_INTEGRAL_V2, ADENDA_AUDITORIA_EJECUTABLE_V3, AUDITORIA_SIMPLICIDAD_USO_V4, AUDITORIA_PRELANZAMIENTO_V5 y NUCLEO_IA_DOCENTEDIGITAL.

## Prueba
**ID:** AUD-PRELAUNCH-ASSET-GATE-106

**Módulo:** CI / Prelaunch Smoke / integridad de producción.

**Entrada:** publicación de `index.html` con referencias locales `script[src]` o `link[rel=stylesheet][href]`.

**Resultado esperado:** el gate previo a publicación debe fallar si cualquier recurso local referenciado por `index.html` no existe en el repositorio. Una compilación/deployment READY no debe ser suficiente si una dependencia de la superficie puede responder 404.

**Resultado obtenido antes:** el workflow verificaba archivos esenciales seleccionados y sintaxis JavaScript, pero no recorría automáticamente todas las referencias locales de `index.html`. Por tanto, una referencia local nueva o renombrada podía quedar fuera de la lista manual y no ser detectada por CI.

**Evidencia previa:** `.github/workflows/prelaunch-smoke.yml` contenía `Verify production entry files` con una lista fija de archivos, sin análisis de `script[src]` ni hojas de estilo enlazadas desde `index.html`.

**Estado previo:** NO PASA.

**Severidad:** S2 — ALTO. Un asset faltante puede producir una función rota o pantalla incompleta sin impedir por sí solo un deployment estático.

**Clasificación previa:** PARCIALMENTE FUNCIONAL.

## Causa raíz
El gate utilizaba una lista manual de archivos críticos. Esa estrategia no se actualiza automáticamente cuando cambia `index.html`.

## Corrección
Commit funcional `bb54470269ce39817ecfa0d0f632d9443ad21c4b`.

Se añadió al workflow `Prelaunch Smoke` el paso `Verify local assets referenced by production HTML`, basado únicamente en biblioteca estándar de Python. El paso:

- analiza `index.html`;
- obtiene `script[src]` y `link[rel=stylesheet][href]`;
- ignora recursos externos;
- normaliza query strings mediante `urlparse`;
- falla el workflow si un recurso local referenciado no existe.

El cambio es pequeño, reversible y no modifica lógica pedagógica, normativa, datos ni documentos del usuario.

## Retest
GitHub Actions run `33681631574` completó `static-smoke` con conclusión `success`. El paso nuevo `Verify local assets referenced by production HTML` concluyó `success`.

Vercel deployment `dpl_E9Ru58jRkvojb54aLxwQYxAtc4t5` correspondiente al commit funcional quedó `READY`, target `production`.

`https://docente-digital.vercel.app/` respondió HTTP 200 después del despliegue.

**Estado posterior:** PASA para integridad estática de referencias locales de la entrada HTML.

**Clasificación posterior:** FUNCIONAL para este alcance técnico.

## Límites de evidencia / V5
Esta prueba NO demuestra funcionamiento semántico de cada módulo, ejecución de JavaScript en navegador real, dispositivo móvil físico, exportación Word/PDF física, IA real, backend, autenticación, aislamiento, OWASP ASVS, backup/restore, concurrencia, pilotos ni año completo. Esos puntos continúan PENDIENTES y no se convierten en PASA por este gate.

## Normativa
No se aplicó ni declaró vigente ninguna norma MINEDU en esta corrección. Por ello no corresponde atribuir sustento normativo externo a este cambio puramente técnico.

## Riesgo de regresión
Bajo. Un recurso local generado dinámicamente que no exista en el repositorio podría hacer fallar el gate; actualmente `index.html` referencia archivos estáticos del repositorio, que es precisamente el alcance buscado.

## Impacto en indicadores
- IUD: sin puntuación definitiva; reduce riesgo de superficie rota por asset faltante.
- ICGD: sin puntuación definitiva; no cambia coherencia documental.
- IFR: sin puntuación definitiva; mejora una evidencia técnica de fiabilidad de publicación.
- ISU: sin puntuación definitiva; evita potenciales pantallas/acciones incompletas por dependencias 404.
- Prelaunch: mejora el gate automático, pero no elimina bloqueantes V5 ni habilita lanzamiento.
