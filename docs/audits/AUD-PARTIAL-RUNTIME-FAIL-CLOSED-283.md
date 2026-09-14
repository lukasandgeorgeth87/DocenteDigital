# AUD-PARTIAL-RUNTIME-FAIL-CLOSED-283

## Resumen

**Módulo:** bootstrap / carga dinámica / continuidad segura

**Estado:** NO PASA

**Clasificación:** PARCIALMENTE FUNCIONAL

**Severidad:** S2 ALTO

## Especificaciones aplicables

- V3: una función no aprueba por aparecer o responder; debe conservar corrección, datos y seguridad, y los errores silenciosos son especialmente peligrosos.
- V5: si falla una función crítica, no publicar; la aplicación debe evitar ejecutar funciones principales con runtime incompleto.
- V4: los errores deben ser comprensibles y no dejar al usuario en un estado engañoso.

## Prueba AUD-BOOT-283-A

**Entrada**

1. Abrir DocenteDigital.
2. Provocar o simular el fallo definitivo de carga de uno de los módulos dinámicos del bootstrap, por ejemplo `docx-export-v29.js`, `session-curriculum-safety-v67.js`, `material-integrity-v65.js` o cualquier otro elemento de `modules`.
3. Esperar a que `showLoadFailure()` muestre la barra de error.
4. Sin recargar, intentar usar una función distinta de Unidad/Proyecto: preparar sesión, abrir evaluación, descargar/exportar o ejecutar otra acción disponible.

**Resultado esperado**

Al existir un fallo definitivo de un módulo necesario, el runtime debe quedar en modo seguro/fail-closed: no debe permitir crear, guardar, evaluar, descargar ni ejecutar funciones que podrían depender del módulo faltante. Debe ofrecer únicamente una recuperación segura (recargar/reintentar) o bloquear de manera explícita las superficies afectadas.

**Resultado obtenido por inspección ejecutable del código**

`schedule-prompt-v6.js` registra fallos en `window.ddModuleLoadFailures` y `showLoadFailure()` advierte: “Recarga la página antes de crear, guardar o descargar documentos”. Sin embargo, el bloqueo implementado mediante `lockPlanningButtons()` y el listener de captura solo reconoce `#ddBuildUnit` o botones cuyo `onclick` contenga `createUnitDemo`. Al finalizar la cadena, `finishPlanningBootstrap()` únicamente mantiene bloqueada la planificación si falló alguno de los módulos de `planningCritical`.

Por tanto, un fallo de módulos no incluidos en `planningCritical` puede coexistir con superficies funcionales todavía activas. Incluso ante un fallo crítico ajeno a Unidad/Proyecto (por ejemplo exportación o seguridad curricular de sesión), la barra instruye no continuar, pero el código no impide técnicamente continuar.

## Evidencia

Archivo: `schedule-prompt-v6.js` (v49.1 / loader v50 en HEAD auditado).

Elementos relevantes:

- `window.ddModuleLoadFailures` registra fallos definitivos.
- `showLoadFailure()` solicita recargar antes de crear, guardar o descargar.
- `planningButtons()` solo selecciona `#ddBuildUnit` y acciones `createUnitDemo`.
- el listener de captura únicamente bloquea esos mismos botones mientras `__ddPlanningRuntimeReady` sea falso.
- `finishPlanningBootstrap()` decide disponibilidad usando solo `planningCritical`, no el conjunto completo de módulos requeridos por las demás funciones.

## Dictamen

**NO PASA · S2 ALTO · PARCIALMENTE FUNCIONAL.**

No se clasifica S1 de forma automática porque esta auditoría no ha demostrado todavía que una salida pedagógica incorrecta o una exportación corrupta llegue a emitirse en navegador real bajo un fallo concreto; sí existe una ruta demostrable para operar con runtime parcial, por lo que el riesgo de error silencioso es alto.

## Causa raíz

La política de recuperación es global en el mensaje visible, pero parcial en el control técnico. La aplicación reconoce el estado degradado, pero solo aplica fail-closed a la creación de Unidad/Proyecto.

## Acción correctiva recomendada

Implementar una guarda global y pequeña en el propio bootstrap:

1. cuando `ddModuleLoadFailures.length > 0`, establecer un estado global de runtime degradado;
2. bloquear en captura todas las acciones que creen, modifiquen, guarden, evalúen o descarguen documentos, excepto el botón explícito de recarga/recuperación;
3. alternativamente, mantener una matriz módulo→superficies y bloquear solamente las funciones realmente dependientes, siempre que la cobertura sea demostrable;
4. nunca permitir fallback silencioso al generador base/prototipo;
5. añadir prueba automatizada que fuerce el fallo de cada módulo crítico y compruebe que la superficie dependiente queda bloqueada.

## Corrección en esta ronda

**PENDIENTE.** No se modificó el runtime porque el cambio seguro requiere tocar el cargador central que coordina decenas de módulos. Se evita una modificación apresurada que pueda bloquear navegación legítima o introducir una regresión global. El hallazgo queda documentado para una corrección pequeña, revisable y con prueba de fallo inducido.

## Repruebas obligatorias

- AUD-BOOT-283-R1: fallo de `docx-export-v29.js` → exportación bloqueada.
- AUD-BOOT-283-R2: fallo de `session-curriculum-safety-v67.js` → creación de sesión bloqueada.
- AUD-BOOT-283-R3: fallo de `material-integrity-v65.js` → Materiales permanece no ejecutable.
- AUD-BOOT-283-R4: fallo de módulo de planificación → Unidad/Proyecto permanece bloqueada.
- AUD-BOOT-283-R5: todos los módulos cargan → las funciones permitidas recuperan su disponibilidad normal.
- AUD-BOOT-283-R6: móvil y recarga tras fallo → no pantalla blanca/negra y recuperación comprensible.

## Riesgo de regresión

**Medio-alto** si se corrige con un bloqueo global indiscriminado; por ello debe preservarse el botón de recarga y verificarse que el estado normal no quede bloqueado cuando todos los módulos carguen correctamente.

## Impacto en métricas/gates

- **IUD:** impacto indirecto; un estado degradado puede producir documentos no confiables.
- **ICGD:** impacto por pérdida de confianza funcional y trazabilidad del runtime.
- **IFR:** negativo mientras exista posibilidad de ejecutar con dependencias faltantes.
- **ISU:** negativo porque el mensaje dice “recarga” pero la interfaz todavía permite actuar.
- **Prelaunch:** mantiene V5 BLOQUEADO; no permite declarar continuidad segura ante fallos parciales.

## Normativa externa

Este hallazgo es técnico y deriva de V2/V3/V4/V5 y del Núcleo IA del propio proyecto. No requiere declarar vigente ninguna norma externa nueva.

## Exclusión

No se modificó ni se analizó `CUSCO-DECIDE-ELECCIONES-2026`.