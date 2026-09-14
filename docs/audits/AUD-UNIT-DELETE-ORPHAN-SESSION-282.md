# AUD-UNIT-DELETE-ORPHAN-SESSION-282

## Resumen

Se detectó una ruptura de trazabilidad entre Unidad/Proyecto y Sesión cuando se elimina una unidad que todavía tiene una sesión vinculada en `state.lastSession`.

La aplicación conserva únicamente la sesión más reciente en `state.lastSession`. Esa sesión registra `unitId` y `unitTitle`. Sin embargo, `deleteUnit(id)` eliminaba la unidad de `state.units` sin comprobar si `state.lastSession.unitId === id`. La capa `storage-recovery-v26.js` protegía la unidad mediante una copia recuperable, pero tampoco protegía ni reconciliaba esa relación. Como consecuencia, la sesión podía quedar huérfana y `continueWork()` podía reabrirla como trabajo vigente aunque su unidad de origen ya no existiera.

Esto no equivale a pérdida directa de la sesión, pero sí rompe la cadena exigida por V2/V3: Unidad/Proyecto → Sesiones, genera un estado contradictorio y puede inducir al usuario a continuar o exportar un documento desconectado de su fuente pedagógica.

## Especificaciones obligatorias aplicadas

- V2: trazabilidad PROGRAMACIÓN → UNIDAD/PROYECTO → SESIONES → ACTIVIDADES → EVIDENCIAS → EVALUACIÓN → REGISTRO.
- V3: fuente única de verdad, consistencia entre documentos y conservación de históricos.
- V4: borrado seguro, recuperación y continuidad comprensible del trabajo.
- V5: crear/guardar/editar/eliminar/recuperar documentos debe probarse de extremo a extremo.
- Núcleo IA: herencia de significado Unidad/Proyecto → Sesiones y coherencia entre fases.

No se aplicó ni declaró vigente ninguna norma externa en este hallazgo; se trata de integridad y trazabilidad interna.

## Prueba AUD-TRACE-282-A

**Módulo:** Unidad/Proyecto → Sesiones → Persistencia/Recuperación

**Entrada:**
1. Crear una unidad `U1`.
2. Crear una sesión `S1` desde `U1`, de modo que `S1.unitId === U1.id` y quede almacenada en `state.lastSession`.
3. Volver a `Mis unidades/proyectos`.
4. Eliminar `U1` y confirmar.
5. Pulsar `Continuar mi trabajo`.

**Resultado esperado:** la aplicación no debe permitir una ruptura silenciosa de la relación Unidad→Sesión. Mientras exista una sesión vinculada, debe bloquear la eliminación de la unidad o ejecutar un flujo explícito que preserve/gestione ambos documentos sin modificar históricos silenciosamente.

**Resultado obtenido previo:** `deleteUnit(id)` eliminaba `U1` de `state.units`, mientras `state.lastSession` permanecía intacta y podía ser reabierta por `continueWork()`.

**Estado previo:** NO PASA.

**Clasificación previa:** PARCIALMENTE FUNCIONAL.

**Severidad:** S2 ALTO.

## Causa raíz

El borrado recuperable fue diseñado a nivel del documento Unidad/Proyecto, pero no como una operación referencial entre documentos relacionados. La persistencia mantiene `state.units` y `state.lastSession` como estructuras separadas y la eliminación no validaba dependencias antes de confirmar el cambio.

## Corrección aplicada

Commit funcional: `56a8fe542da9f637b25f1d4ae2607eda27b3e0ac` — `fix: block deleting units with linked sessions`.

`storage-recovery-v26.js` pasa de v26.6 a v26.7. El wrapper `installRecoverableUnitDelete()` ahora:

1. lee el estado persistido antes de cualquier borrado;
2. comprueba `before.lastSession && before.lastSession.unitId === id`;
3. si existe esa dependencia, cancela la eliminación y muestra un mensaje simple explicando que la unidad tiene una sesión vinculada;
4. si no puede leer/verificar la dependencia, falla de forma cerrada y cancela la eliminación;
5. solo continúa al respaldo recuperable y al borrado original cuando no existe una sesión vinculada.

La corrección no modifica ni elimina la sesión histórica y no cambia documentos emitidos.

## Reprueba AUD-TRACE-282-R1

**Entrada técnica:** estado con `lastSession.unitId === id` y llamada a `deleteUnit(id)`.

**Resultado esperado:** la capa de seguridad debe interrumpir el borrado antes de ejecutar la función original.

**Resultado obtenido por inspección del commit y del asset productivo:** v26.7 contiene la comprobación explícita de dependencia antes del backup y antes de `previous.apply(...)`; producción sirve exactamente esa lógica.

**Estado:** PASA EN IMPLEMENTACIÓN.

**Clasificación:** FUNCIONAL EN IMPLEMENTACIÓN / E2E REAL PENDIENTE.

**Pendiente para cierre real:** navegador real con unidad sin sesión, unidad con sesión, cancelar, restaurar, recargar, `Continuar mi trabajo`, doble clic y móvil físico.

## Evidencia posterior

- Commit funcional: `56a8fe542da9f637b25f1d4ae2607eda27b3e0ac`.
- HEAD auditado previo a esta actualización documental: `5257d2de64b906c1e46476d3249dc5512001cdae`.
- Vercel desplegó ese HEAD como `dpl_EaBATcrPqidkzCaRY3EHqKYiDCPy`, estado `READY`, target `production`.
- La URL canónica `https://docente-digital.vercel.app/` respondió HTTP 200.
- `https://docente-digital.vercel.app/storage-recovery-v26.js` respondió HTTP 200 y sirve v26.7 con la defensa Unidad→Sesión.
- Vercel no reportó errores runtime en la última hora consultada.
- Prelaunch Smoke #323, run `34819145059`, terminó `completed / success` exactamente sobre `5257d2de64b906c1e46476d3249dc5512001cdae`.

Estas evidencias acreditan implementación, integración automática y disponibilidad técnica; no sustituyen la prueba E2E física exigida por V5.

## Riesgo de regresión

Medio. El flujo depende de wrappers sobre funciones globales; una futura biblioteca de sesiones, papelera relacional o múltiples sesiones por unidad deberá centralizar integridad referencial y no depender solo de `lastSession`.

## Impacto en indicadores

- IUD: mejora cualitativa al impedir una relación documental huérfana; no se calcula puntaje.
- ICGD: mejora la coherencia Unidad↔Sesión; no se recalcula índice.
- IFR: no se recalcula sin batería completa.
- ISU: no se calcula sin usuarios reales.
- Prelaunch: continúa bloqueado porque la prueba E2E real sigue pendiente y existen otros bloqueantes V5.

## Gate V5

BLOQUEADO. La implementación de AUD-282 no sustituye las pruebas reales de E2E Docente/Director, 100 generaciones/anti-alucinación, móvil físico, Word/PDF/impresión, autoguardado/restore, seguridad/aislamiento/privacidad, continuidad sin IA, año completo, escala y pilotos.