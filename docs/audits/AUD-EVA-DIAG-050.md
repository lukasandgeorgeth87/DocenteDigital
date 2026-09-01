# AUD-EVA-DIAG-050 — Evaluación diagnóstica y referencia curricular

Fecha: 2026-09-01

## Especificaciones aplicadas
- AUDITORIA_MAESTRA_INTEGRAL_V2
- ADENDA_AUDITORIA_EJECUTABLE_V3
- AUDITORIA_SIMPLICIDAD_USO_V4
- AUDITORIA_PRELANZAMIENTO_V5
- NUCLEO_IA_DOCENTEDIGITAL

## Prueba
**ID:** AUD-EVA-DIAG-050  
**Módulo:** Mi planificación → Evaluación diagnóstica  
**Entrada:** abrir la evaluación diagnóstica con `state.curriculumMatrixReady !== true`.  
**Esperado:** no afirmar que la app toma automáticamente competencias/aprendizajes oficiales del grado anterior mientras la matriz curricular oficial no esté conectada y verificada.  
**Obtenido antes:** la superficie base mostraba `Referencia automática: competencias y aprendizajes del grado anterior.` aunque la matriz curricular oficial seguía pendiente.  
**Evidencia:** `index.html` contiene esa afirmación base; `curriculum-safety-v27.js` confirma que `curriculumMatrixReady===true` es la condición para tratar la matriz como conectada/verificada.  
**Resultado inicial:** NO PASA.  
**Severidad:** S2 (alto: afirmación curricular no demostrada / trazabilidad insuficiente).  
**Clasificación:** PARCIALMENTE FUNCIONAL.

## Causa raíz
La guardia diagnóstica impedía fabricar resultados de estudiantes, pero no corregía la afirmación estática sobre procedencia curricular.

## Corrección segura
`diagnostic-integrity-v59.js` actualizado internamente a v60 para:
- reemplazar la afirmación automática por un aviso de referencias curriculares pendientes cuando la matriz no está lista;
- mostrar estado verificado solo cuando `state.curriculumMatrixReady===true`;
- conservar el bloqueo de resultados ficticios;
- registrar en el borrador el estado de la matriz;
- ampliar la auditoría local para detectar la afirmación insegura.

Commits funcionales: `6e87c1a719b7a9b7314d415ba148be272120a8cd`, corrección menor de escape `8ddd74d8bd67e944e4977ceeef7f4993734add63`.

## Evidencia posterior
- GitHub: archivo v60 presente en rama principal.
- Producción: `/diagnostic-integrity-v59.js` respondió HTTP 200 y comenzó a servir v60.
- Vercel READY administrativo: PENDIENTE en esta ejecución porque `list_deployments` devolvió 403 por autorización del scope del equipo.

## Riesgo de regresión
Bajo. Cambio localizado en texto/guardia de evaluación diagnóstica; no altera datos oficiales ni genera currículo.

## Impacto
- IUD: mejora veracidad de la interfaz.
- ICGD: mejora trazabilidad curricular.
- IFR: mejora parcial; no sustituye pruebas E2E.
- ISU: impacto neutro/positivo por mensaje claro.
- Prelaunch: reduce un S2, pero no elimina bloqueantes V5.

## Pendientes V5 relacionados
Conectar y versionar matriz curricular oficial; validar fuentes oficiales actuales; pruebas pedagógicas reales; persistencia real; exportación Word/PDF física; seguridad, autenticación, aislamiento, backup/restore, 100 generaciones, año completo y pilotos.