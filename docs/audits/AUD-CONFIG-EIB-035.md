# AUD-CONFIG-EIB-035 — Configuración inicial / horario / perfil lingüístico

**Entrada:** en el paso 4 del alta inicial, pulsar `Subir horario en Word` sin haber confirmado `Tipo de atención lingüística`, o seleccionar EIB sin lengua originaria.

**Esperado:** el flujo de subida de horario debe respetar exactamente las mismas validaciones que `Guardar y entrar`; no debe persistir ni permitir navegación a planificación si el perfil lingüístico obligatorio está incompleto.

**Obtenido antes:** `schedule-prompt-v6.js` guardaba `language/quechuaVar`, invocaba `finishSetup()` y programaba inmediatamente `go('plan')` mediante `setTimeout`. Si `finishSetup()` abortaba por falta de tipo EIB/monolingüe o lengua originaria, el temporizador seguía ejecutándose y podía saltar a planificación con una configuración incompleta. Además se ejecutaba `save()` antes de la validación final.

**Resultado inicial:** NO PASA.

**Severidad:** S2 ALTO.

**Clasificación:** PARCIALMENTE FUNCIONAL.

**Causa raíz:** el acceso alternativo `Subir horario en Word` duplicaba parcialmente el cierre de configuración y no compartía la misma precondición de validez del perfil lingüístico.

**Corrección:** `schedule-prompt-v6.js` valida primero que exista tipo de atención lingüística; si es EIB exige una lengua originaria distinta de `Ninguna`; después delega en `finishSetup()` y solo continúa a planificación cuando `state.linguisticMode` quedó confirmado. Se eliminó el guardado previo a la validación.

**Commit funcional:** `dd65bdf5f9f5bdda89cbe2eae8749a95437217b3`.

**Evidencia posterior:** GitHub check `Vercel` = `success`; producción pública `/` = HTTP 200; producción pública `/schedule-prompt-v6.js` = HTTP 200 y contiene las guardas nuevas. La consulta administrativa directa de Vercel para estado literal `READY` devuelve 403 por autorización del scope, por lo que `READY` literal queda PENDIENTE y no se simula.

**Resultado posterior:** PASA la defensa técnica; el flujo completo continúa PARCIALMENTE FUNCIONAL hasta prueba real de carga DOCX, persistencia, móvil físico y E2E de horario → planificación → sesiones.

**Riesgo de regresión:** bajo-medio. El cambio toca únicamente el acceso alternativo del paso 4 y reutiliza la validación ya existente de `finishSetup()`.

**Impacto V4/V5:** evita una ruta de salto de configuración, mejora consistencia de datos EIB/monolingüe y reduce pérdida de trazabilidad. No modifica los bloqueantes V5 de backend, autenticación, seguridad, exportación física, IA semántica real ni pruebas con usuarios reales.