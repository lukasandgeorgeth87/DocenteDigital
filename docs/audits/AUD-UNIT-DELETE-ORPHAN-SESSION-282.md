# AUD-UNIT-DELETE-ORPHAN-SESSION-282

## Resumen

Se detectó una ruptura de trazabilidad entre Unidad/Proyecto y Sesión cuando se elimina una unidad que todavía tiene una sesión vinculada en `state.lastSession`.

La aplicación conserva únicamente la sesión más reciente en `state.lastSession`. Esa sesión registra `unitId` y `unitTitle`. Sin embargo, `deleteUnit(id)` elimina la unidad de `state.units` sin comprobar si `state.lastSession.unitId === id`. La capa `storage-recovery-v26.js` protege la unidad mediante una copia recuperable, pero tampoco protege ni reconcilia esa relación. Como consecuencia, la sesión puede quedar huérfana y `continueWork()` puede reabrirla como trabajo vigente aunque su unidad de origen ya no exista.

Esto no equivale a pérdida directa de la sesión, pero sí rompe la cadena exigida por V2/V3: Unidad/Proyecto → Sesiones, genera un estado contradictorio y puede inducir al usuario a continuar o exportar un documento desconectado de su fuente pedagógica.

## Especificaciones obligatorias aplicadas

- V2: trazabilidad PROGRAMACIÓN → UNIDAD/PROYECTO → SESIONES → ACTIVIDADES → EVIDENCIAS → EVALUACIÓN → REGISTRO. Una sesión no debe quedar desconectada de la unidad.
- V3: fuente única de verdad, consistencia entre documentos y conservación de históricos; una acción no debe producir estados contradictorios silenciosos.
- V4: borrado seguro, recuperación y continuidad comprensible del trabajo.
- V5: crear/guardar/editar/eliminar/recuperar documentos debe probarse de extremo a extremo; no puede aprobarse una función si pierde relaciones al avanzar.
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

**Resultado esperado:** la aplicación no debe permitir una ruptura silenciosa de la relación Unidad→Sesión. Mientras exista una sesión vinculada, debe bloquear la eliminación de la unidad o ejecutar un flujo explícito que preserve/gestione ambos documentos sin modificar históricos de manera silenciosa.

**Resultado obtenido por inspección reproducible de código:**
- `deleteUnit(id)` elimina `U1` de `state.units` y guarda el estado, pero no modifica ni valida `state.lastSession`.
- `buildSession()` guarda en `state.lastSession` una sesión con `unitId` y `unitTitle`.
- `continueWork()` prioriza `state.lastSession` y la reabre sin comprobar que `state.units` todavía contenga `lastSession.unitId`.
- `storage-recovery-v26.js` respalda únicamente `{savedAt, unit, activeUnitId}` para el borrado de unidades; no inspecciona `lastSession` ni la relación con la unidad eliminada.

**Estado:** NO PASA.

**Clasificación:** PARCIALMENTE FUNCIONAL.

**Severidad:** S2 ALTO.

## Causa raíz

El borrado recuperable fue diseñado a nivel del documento Unidad/Proyecto, pero no como una operación referencial entre documentos relacionados. La persistencia mantiene `state.units` y `state.lastSession` como estructuras separadas y la eliminación no valida dependencias antes de confirmar el cambio.

## Acción correctiva propuesta

Aplicar una defensa pequeña y reversible antes de borrar una unidad:

1. Leer el estado vigente.
2. Si `lastSession && lastSession.unitId === id`, bloquear la eliminación.
3. Mostrar un mensaje simple: `Esta unidad tiene una sesión vinculada. Para conservar la trazabilidad, no puede eliminarse mientras esa sesión dependa de ella.`
4. No borrar ni modificar silenciosamente la sesión histórica.
5. En una evolución posterior con biblioteca real de sesiones, sustituir esta defensa por una gestión explícita de dependencias y papelera relacional.

No se aplicó el cambio runtime en esta ronda porque el mecanismo de escritura disponible exige reemplazar archivos JavaScript completos de tamaño significativo. Hacer un reemplazo amplio únicamente para insertar esta guarda aumentaría innecesariamente el riesgo de regresión y no cumpliría la regla de cambio pequeño y verificable.

## Reprueba requerida AUD-TRACE-282-R1

Pendiente de implementación. Debe comprobar:

- unidad sin sesión vinculada → eliminación recuperable permitida;
- unidad con sesión vinculada → eliminación bloqueada;
- cancelar eliminación → estado idéntico;
- restaurar una unidad eliminada → relación conservada;
- recarga/cierre/reapertura → mismo resultado;
- `Continuar mi trabajo` nunca reabre una sesión cuyo `unitId` ya no existe sin advertencia explícita;
- móvil real y doble clic rápido.

## Evidencia técnica de producción de la ronda

Al momento del hallazgo, el HEAD de `main` era `9b85067a0b54033d4741c04636f94bf64cdaa759`, correspondiente a `audit: document immutable EIB session rendering 281`.

La producción asociada a ese HEAD estaba en Vercel como deployment `dpl_A9XgWRbuDX72w4NFu1CcEZYF8JHn`, estado `READY`, target `production`. La URL canónica respondió HTTP 200 y Vercel no reportó errores runtime en la última hora consultada. Estas evidencias acreditan disponibilidad técnica, no corrigen AUD-282.

## Riesgo de regresión

Medio. El flujo actual depende de wrappers sucesivos sobre funciones globales; una futura implementación de biblioteca de sesiones, papelera o restauración podría volver a introducir relaciones huérfanas si no existe una regla referencial central.

## Impacto en indicadores

- IUD: impacto negativo cualitativo por documento desconectado; no se calcula puntaje.
- ICGD: afectado porque Unidad y Sesión pueden divergir.
- IFR: no se recalcula sin batería completa.
- ISU: no se calcula; el usuario puede creer que continúa un trabajo válido cuando su documento padre ya no existe.
- Prelaunch: mantiene bloqueado V5; la trazabilidad Docente E2E no está demostrada.

## Gate V5

BLOQUEADO. AUD-282 se suma a los pendientes ya existentes y no sustituye las pruebas reales de E2E Docente/Director, 100 generaciones/anti-alucinación, móvil físico, Word/PDF/impresión, autoguardado/restore, seguridad/aislamiento/privacidad, continuidad sin IA, año completo, escala y pilotos.
