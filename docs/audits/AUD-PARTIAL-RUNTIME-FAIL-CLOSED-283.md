# AUD-PARTIAL-RUNTIME-FAIL-CLOSED-283

## Resumen

**Módulo:** bootstrap / carga dinámica / continuidad segura

**Estado:** PASA EN IMPLEMENTACIÓN / E2E DE FALLO INDUCIDO PENDIENTE

**Clasificación:** FUNCIONAL EN IMPLEMENTACIÓN; validación ejecutable completa pendiente

**Severidad original:** S2 ALTO

## Especificaciones aplicables

- V3: una función no aprueba por aparecer o responder; debe conservar corrección, datos y seguridad, y los errores silenciosos son especialmente peligrosos.
- V5: si falla una función crítica, no publicar; la aplicación debe evitar ejecutar funciones principales con runtime incompleto.
- V4: los errores deben ser comprensibles y no dejar al usuario en un estado engañoso.
- Núcleo IA: comprender, verificar y proteger coherencia antes de permitir generación; no caer silenciosamente al generador base/prototipo.

## Prueba AUD-BOOT-283-A

**Entrada**

1. Abrir DocenteDigital.
2. Provocar o simular el fallo definitivo de carga de uno de los módulos dinámicos del bootstrap, por ejemplo `docx-export-v29.js`, `session-curriculum-safety-v67.js`, `material-integrity-v65.js` o cualquier otro elemento de `modules`.
3. Esperar a que `showLoadFailure()` muestre la barra de error.
4. Sin recargar, intentar usar una función distinta de Unidad/Proyecto: preparar sesión, abrir evaluación, descargar/exportar o ejecutar otra acción disponible.

**Resultado esperado**

Al existir un fallo definitivo de un módulo necesario, el runtime debe quedar en modo seguro/fail-closed: no debe permitir crear, modificar, guardar, evaluar, descargar ni ejecutar funciones documentales que podrían depender del módulo faltante. Debe ofrecer una recuperación segura mediante recarga, sin impedir navegación informativa que no modifica documentos.

**Resultado obtenido antes de corregir**

`schedule-prompt-v6.js` registraba fallos en `window.ddModuleLoadFailures` y `showLoadFailure()` advertía: “Recarga la página antes de crear, guardar o descargar documentos”. Sin embargo, el bloqueo implementado mediante `lockPlanningButtons()` y el listener de captura solo reconocía `#ddBuildUnit` o botones cuyo `onclick` contuviera `createUnitDemo`. `finishPlanningBootstrap()` únicamente mantenía bloqueada planificación si fallaba alguno de los módulos de `planningCritical`.

Por tanto, un fallo de módulos no incluidos en `planningCritical` podía coexistir con superficies documentales activas. El mensaje visible era global pero el control técnico era parcial.

## Evidencia inicial

Archivo auditado: `schedule-prompt-v6.js` (loader v50).

Elementos relevantes antes de corregir:

- `window.ddModuleLoadFailures` registraba fallos definitivos.
- `showLoadFailure()` solicitaba recargar antes de crear, guardar o descargar.
- `planningButtons()` solo seleccionaba `#ddBuildUnit` y acciones `createUnitDemo`.
- el listener de captura únicamente bloqueaba esos mismos botones mientras `__ddPlanningRuntimeReady` fuera falso.
- `finishPlanningBootstrap()` decidía disponibilidad usando `planningCritical`, no el conjunto completo de módulos requerido por las demás superficies.

## Dictamen inicial

**NO PASA · S2 ALTO · PARCIALMENTE FUNCIONAL.**

No se clasificó S1 automáticamente porque no se demostró una salida pedagógica incorrecta o una exportación corrupta emitida en navegador real bajo un fallo concreto; sí existía una ruta demostrable para operar con runtime parcial.

## Causa raíz

La política de recuperación era global en el mensaje visible, pero parcial en el control técnico. La aplicación reconocía el estado degradado, pero solo aplicaba fail-closed a la creación de Unidad/Proyecto.

## Corrección aplicada

Commit funcional: `c955f9d164aca627faa87f40b2422351789c904e` — `fix: fail closed after runtime module load failure`.

`schedule-prompt-v6.js` pasa a loader **v50.1** y añade una guarda global acotada:

1. `window.__ddRuntimeFullyReady` representa el estado global de carga.
2. `isRiskyDocumentButton()` identifica acciones documentales de creación, generación, guardado, evaluación, exportación, eliminación, restauración, duplicado, registro o emisión.
3. `lockRiskyDocumentButtons()` deshabilita esas acciones cuando existe al menos un fallo definitivo en `ddModuleLoadFailures` y añade `aria-disabled`, `data-dd-runtime-blocked` y un mensaje simple de recuperación.
4. un listener de captura `blockRiskyActionDuringFailure()` impide que botones dinámicos o creados después del fallo evadan la guarda.
5. `showLoadFailure()` conserva un único botón explícito `ddRuntimeReload`, que nunca es bloqueado.
6. tanto `rememberFailure()` como el `onerror` definitivo del cargador marcan el runtime como no listo y activan la defensa.
7. si todos los módulos terminan correctamente, `__ddRuntimeFullyReady` queda verdadero y no se aplica el bloqueo global.

La corrección no modifica contenido pedagógico, históricos, datos maestros ni documentos emitidos.

## Evidencia posterior de producción

- Vercel desplegó el commit funcional `c955f9d164aca627faa87f40b2422351789c904e` como `dpl_81sVNVegpJ4bSzADBYNEM9fdd5mo`.
- Estado observado: `READY`, target `production` y alias canónico `docente-digital.vercel.app`.
- `https://docente-digital.vercel.app/` respondió HTTP 200.
- `https://docente-digital.vercel.app/schedule-prompt-v6.js` respondió HTTP 200 y sirvió efectivamente loader v50.1 con `__ddRuntimeFullyReady`, `isRiskyDocumentButton`, `lockRiskyDocumentButtons` y `blockRiskyActionDuringFailure`.
- La consulta de errores runtime de Vercel durante la última hora no reportó errores.

Estas evidencias prueban despliegue e implementación, pero no sustituyen la inducción real de cada fallo en navegador.

## Repruebas

- **AUD-BOOT-283-R1:** fallo de `docx-export-v29.js` → exportación bloqueada. **PASA EN IMPLEMENTACIÓN / fallo inducido real pendiente.**
- **AUD-BOOT-283-R2:** fallo de `session-curriculum-safety-v67.js` → creación de sesión bloqueada. **PASA EN IMPLEMENTACIÓN / fallo inducido real pendiente.**
- **AUD-BOOT-283-R3:** fallo de `material-integrity-v65.js` → Materiales permanece no ejecutable. **PASA EN IMPLEMENTACIÓN / fallo inducido real pendiente.**
- **AUD-BOOT-283-R4:** fallo de módulo de planificación → Unidad/Proyecto permanece bloqueada. **PASA EN IMPLEMENTACIÓN / fallo inducido real pendiente.**
- **AUD-BOOT-283-R5:** todos los módulos cargan → las funciones permitidas recuperan su disponibilidad normal. **PASA por inspección + producción HTTP; E2E interactivo pendiente.**
- **AUD-BOOT-283-R6:** móvil y recarga tras fallo → no pantalla blanca/negra y recuperación comprensible. **PENDIENTE físico.**

## Riesgo de regresión

**Medio.** La guarda no bloquea navegación general y solo entra en efecto cuando `ddModuleLoadFailures.length > 0`; aun así debe probarse con fallos inducidos para verificar que ninguna acción documental legítima quede fuera y que el botón de recarga siempre permanezca utilizable.

## Impacto en métricas/gates

- **IUD:** mejora de integridad potencial; no se calcula puntaje definitivo.
- **ICGD:** mejora de confianza y trazabilidad del estado degradado; pendiente E2E.
- **IFR:** mejora técnica al cerrar ejecución documental cuando faltan módulos; sin puntaje definitivo.
- **ISU:** mejora porque mensaje y comportamiento son ahora coherentes; prueba con usuarios pendiente.
- **Prelaunch:** el hallazgo deja de ser una brecha abierta de implementación, pero V5 continúa BLOQUEADO por pruebas reales y otros bloqueantes esenciales.

## Normativa externa

Este hallazgo es técnico y deriva de V2/V3/V4/V5 y del Núcleo IA del propio proyecto. No requiere declarar vigente ninguna norma externa nueva.

## Exclusión

No se modificó ni se analizó `CUSCO-DECIDE-ELECCIONES-2026`.