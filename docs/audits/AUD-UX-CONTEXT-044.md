# AUD-UX-CONTEXT-044 — Unidad/Proyecto: ayuda visible duplicada en contexto

## Especificaciones aplicadas
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

## Prueba
**ID:** AUD-UX-CONTEXT-044  
**Módulo:** Unidad / Proyecto — Idea o contexto de partida  
**Entrada:** Abrir el formulario de Unidad/Proyecto en Modo Fácil y escribir una idea libre.  
**Resultado esperado:** Una sola ayuda breve, lenguaje sencillo y sin telemetría/análisis interno visible.  
**Resultado obtenido antes:** `index.html` ya contiene una ayuda bajo el campo, mientras `context-semantic-v20.js` insertaba un segundo bloque `ddKeywordBox`; en móvil esto añadía texto redundante y aumentaba la carga visual.  
**Evidencia:** código de `index.html` + `context-semantic-v20.js`; captura móvil reportada por usuario durante prueba real.  
**Estado inicial:** NO PASA  
**Severidad:** S3  
**Clasificación:** PARCIALMENTE FUNCIONAL  
**Causa raíz:** la capa léxica preliminar conservaba una superficie visible propia además de la ayuda del formulario.  
**Acción correctiva:** mantener el análisis léxico solo de forma interna y retirar `ddKeywordBox`; conservar una única ayuda del formulario.  
**Commit correctivo final:** `e7a1bb78d10c53a41071d63964e9fd3b19dc2730`  
**Evidencia posterior:** producción `/context-semantic-v20.js` responde HTTP 200 y contiene `document.getElementById('ddKeywordBox')?.remove()`; estado de integración Vercel en GitHub = `success`. La API administrativa de Vercel para consultar READY devuelve 403 por falta de autorización del scope, por lo que READY administrativo queda PENDIENTE y no se simula.  
**Estado posterior:** PASA la defensa de simplicidad técnica; la validación física en múltiples dispositivos y con usuarios reales permanece PENDIENTE.  
**Riesgo de regresión:** bajo; el análisis interno, persistencia de `contextAnalysis` y generación no se modificaron.  
**Impacto:** mejora IUD/ISU cualitativamente; no se calcula puntaje definitivo. IFR/ICGD/Prelaunch sin cambio material.

## Normativa
No se incorporó ni declaró vigente ninguna norma educativa en esta corrección. La prueba se sustenta en las especificaciones internas V2–V5 y Núcleo IA.