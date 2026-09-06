# AUD-PREFLIGHT-NONBLOCKING-194

## Resumen

La “Auditoría relámpago” previa a construir una Unidad/Proyecto calcula y muestra verificaciones, pero actualmente **no actúa como gate**: después de mostrar el resultado, el flujo ejecuta `#ddBuildUnit` siempre, aunque existan verificaciones en falso.

## Prueba

**ID:** AUD-PREFLIGHT-NONBLOCKING-194  
**Entrada:** iniciar construcción de una Unidad/Proyecto con uno o más controles de `auditPreflight()` en falso; casos deterministas: sin producto final elegido, situación seleccionada sin reto válido, falta de horario/distribución o `state.curriculumMatrixReady !== true`.  
**Esperado:** los fallos que comprometen datos obligatorios, coherencia o sustento curricular deben impedir presentar la unidad como auditada/lista, o el sistema debe clasificarlos explícitamente como advertencias no bloqueantes sin otorgar apariencia de aprobación. V3 exige entrada → esperado → obtenido → evidencia → PASA/NO PASA y V5 impide aprobar por mera generación.  
**Obtenido:** `auditPreflight()` devuelve `checks`, `ok`, `total` y `warning`; `showAudit()` presenta los resultados; pero el listener de `#ddBuildUnit` ejecuta incondicionalmente, 700 ms después, `skipAudit=true; b.click();`, sin comprobar `a.ok`, los checks críticos ni un estado `pass`. El flujo luego guarda `u.promptAudit=state.lastPromptAudit` incluso cuando la auditoría contiene fallos.  
**Evidencia de código:** `context-audit-v8.js`, funciones `auditPreflight()`, `showAudit()` y listener de `#ddBuildUnit`.  
**Evidencia de producción:** `https://docente-digital.vercel.app/context-audit-v8.js` sirve la misma lógica y respondió HTTP 200 durante la auditoría.  
**Resultado:** **NO PASA**.  
**Severidad:** **S2 ALTO**.  
**Clasificación:** auditoría visual = **PARCIALMENTE FUNCIONAL**; gate preventivo = **INEXISTENTE**; trazabilidad del resultado = **PARCIAL**.

## Riesgo

Es un error silencioso de control de calidad: el usuario puede interpretar que la unidad pasó una auditoría previa porque el sistema muestra una puntuación y luego construye el documento, aunque haya controles fallidos. Esto debilita especialmente coherencia situación/reto/producto, datos obligatorios, horario/distribución y seguridad curricular.

Hay además una condición estructural importante: `curriculumSourceStatus()` solo retorna verdadero cuando `state.curriculumMatrixReady===true`; por tanto, convertir de forma automática todos los checks actuales en bloqueantes dejaría el flujo detenido mientras la matriz curricular literal no esté conectada. Por esa razón **no corresponde aplicar un parche ingenuo que bloquee por `a.ok < a.total`**.

## Acción correcta

1. Clasificar cada check como `BLOCKER`, `WARNING` o `INFO`.
2. Bloquear solamente por `BLOCKER` y mostrar qué debe corregirse.
3. Mantener “fuente curricular literal conectada” como bloqueo de publicación/uso final cuando corresponda, pero permitir un modo prototipo claramente rotulado si ese es el alcance vigente.
4. No registrar `promptAudit` como equivalente a aprobación; guardar estado explícito, por ejemplo `status: failed|warning|passed`, checks y timestamp.
5. Retestar con campos vacíos, situación sin reto, producto ausente, multigrado, EIB/monolingüe y matriz curricular no conectada.

## Corrección aplicada en esta auditoría

Solo documentación de evidencia. No se modificó runtime porque cambiar el gate sin clasificar previamente la criticidad de cada check podría inutilizar el flujo o generar una falsa aprobación.

## Estado V5

**Bloqueante V5 pendiente.** DocenteDigital no debe considerarse lista para lanzamiento mientras los controles de calidad previos puedan fallar sin impedir o diferenciar claramente la construcción de un documento final.