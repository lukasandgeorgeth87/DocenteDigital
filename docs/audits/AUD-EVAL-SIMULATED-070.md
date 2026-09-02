# AUD-EVAL-SIMULATED-070 — Evaluación presentada como funcional sin flujo real

## Especificaciones aplicadas
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

## Prueba
**ID:** AUD-EVAL-SIMULATED-070  
**Módulo:** Carpeta Docente → Evaluación  
**Entrada:** abrir `Evaluación` y usar `Registrar evaluación`, `Evaluación de unidad/proyecto` y `Conclusiones SIAGIE`.  
**Resultado esperado:** cada acción debe ejecutar un flujo real que recupere criterios/evidencias, permita guardar/recuperar/editar y mantenga trazabilidad hacia el registro; si todavía no existe, la interfaz debe indicarlo explícitamente y no simular funcionalidad.  
**Resultado obtenido antes:** `showEvaluation('register')` mostraba únicamente un selector de AD/A/B/C sin estudiante, competencia, criterio, evidencia ni persistencia. `showEvaluation('unit')` mostraba controles y un botón `Crear evaluación` sin acción. `showEvaluation('siagie')` mostraba una conclusión fija y botones Aprobar/Corregir/Copiar sin acciones.  
**Estado inicial:** NO PASA.  
**Clasificación:** SIMULADA / PARCIALMENTE FUNCIONAL.  
**Severidad:** S2 ALTO.  
**Causa raíz:** superficie UI adelantada respecto de la implementación funcional; el prototipo presenta controles como si los flujos V1.0 existieran.

## Acción correctiva aplicada
Cambio pequeño y reversible en `initial-curriculum-guard-v72.js`, versión interna v73.0:
- deshabilita únicamente los tres accesos simulados de Evaluación;
- elimina su `onclick` en la superficie;
- añade `aria-disabled=true` y texto `Próximamente`;
- muestra aviso sencillo indicando que Registro, Evaluación de unidad/proyecto y Conclusiones SIAGIE todavía no están implementados como flujos completos;
- no inventa estudiantes, criterios, evidencias, valoraciones, conclusiones ni persistencia.

**Commit funcional:** `d5de086657218c10ec348614764d5a6638d3ab1b`.

## Evidencia posterior
- Vercel desplegó el commit funcional como producción con estado `READY`: `dpl_CReZY2ySnnWNVcBVBCWZjNncvn3d`.
- `https://docente-digital.vercel.app/` respondió HTTP 200.
- `https://docente-digital.vercel.app/initial-curriculum-guard-v72.js` respondió HTTP 200 y sirve v73.0 con `markUnfinishedEvaluationActions()`.

## Retest
**PASA** respecto de la corrección de presentación: los flujos incompletos ya no deben presentarse como acciones terminadas cuando la guardia se ejecuta.  
**PENDIENTE:** ejecución interactiva en navegador real y dispositivos físicos, además de implementar los flujos completos de Evaluación, Registro y conclusiones basadas en evidencias.

## Riesgo de regresión
Bajo: cambio limitado a la habilitación/etiquetado de tres botones de una función que todavía no tiene implementación real. Debe retirarse o sustituirse cuando exista el flujo funcional correspondiente.

## Impacto
- **IUD:** evita una superficie engañosa y aclara el estado real del módulo.
- **ICGD:** sin mejora funcional; continúa pendiente la trazabilidad completa de evaluación.
- **IFR:** mejora la honestidad funcional, no la completitud.
- **ISU:** mejora claridad, sin puntuación definitiva.
- **Prelaunch:** mantiene abierto el bloqueante V5 de Evaluación/Registro extremo a extremo.

## Gate V5
No cerrar lanzamiento. Evaluación, Registro auxiliar y Seguimiento continúan pendientes como funciones V1.0 reales. Los demás bloqueantes V5 previamente registrados permanecen vigentes.