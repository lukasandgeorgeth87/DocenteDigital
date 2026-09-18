# AUD-UNAVAILABLE-SURFACE-BOOT-RACE-286 — Funciones no disponibles quedan accionables durante el arranque

**Fecha de auditoría:** 2026-09-14  
**Módulo:** Arranque / verdad de superficie / Materiales / Evaluación  
**Estado:** NO PASA  
**Clasificación:** PARCIALMENTE FUNCIONAL  
**Severidad:** S2 — ALTO

## Especificaciones obligatorias aplicadas

Se revisaron conjuntamente antes de emitir este hallazgo:

- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

V3 exige demostrar funcionalidad real y no aprobar por presencia o respuesta. V4 exige una superficie simple y veraz. V5 prohíbe presentar como listas funciones esenciales que aún no superan su gate. El Núcleo IA exige verificar contexto antes de producir contenido.

## Relación con hallazgos existentes

Este expediente **no duplica** `AUD-MATERIAL-CONTROLS-IGNORED-HARDCODED-254` ni `AUD-MATERIAL-SURFACE-TRUTH-CLICKABLE-SIMULATION-279`.

- `AUD-254` documenta que el generador real de Materiales no existe y que el legado es simulado/roto.
- `AUD-279` corrigió la superficie **una vez cargada** `material-surface-truth-v70.js` v70.1.
- `AUD-286` audita una ventana distinta: **antes de que las guardas dinámicas terminen de cargar**, el HTML inicial todavía entrega Materiales y Evaluación como acciones habilitadas.

## AUD-BOOT-286-A — Materiales accionable antes de la guarda de verdad

**Entrada**  
Abrir producción con un perfil ya existente y, durante el arranque, pulsar Materiales o su tarjeta de Inicio antes de que termine la cadena dinámica de módulos; luego intentar el botón `Crear lectura`.

**Resultado esperado**  
Como Materiales no está disponible para V1.0, la superficie debe nacer cerrada (fail-closed): navegación y botón de generación deben estar deshabilitados desde el HTML inicial o mediante una guarda síncrona cargada antes de `app.js`. En ningún instante debe quedar alcanzable el generador simulado por una carrera de carga.

**Resultado obtenido**  
NO PASA en implementación estática. `index.html` entrega inicialmente:

- navegación lateral `data-screen="materials"` con `onclick="go('materials')"`;
- tarjeta de Inicio Materiales con `onclick="go('materials')"`;
- botón de Materiales con `onclick="generateMaterial()"`.

`app.js` se carga de forma síncrona antes de `schedule-prompt-v6.js`, por lo que `go()` y `generateMaterial()` ya pueden existir antes de que la guarda posterior deshabilite la función. `material-surface-truth-v70.js` y `home-surface-truth-v73.js` se cargan dinámicamente dentro de una lista extensa y secuencial iniciada por `schedule-prompt-v6.js`; `home-surface-truth-v73.js` aparece después de numerosos módulos previos. Esto crea una ventana real de arranque en la que la verdad de superficie depende del tiempo de carga.

**PASA / NO PASA:** NO PASA  
**Clasificación:** PARCIALMENTE FUNCIONAL  
**Severidad:** S2 — ALTO  
**Severidad funcional subyacente:** `AUD-254` continúa S1 — CRÍTICO.

## AUD-BOOT-286-B — Evaluación accionable antes de la guarda de verdad

**Entrada**  
Abrir producción con perfil existente y pulsar Evaluación durante el arranque antes de que se cargue `home-surface-truth-v73.js`.

**Resultado esperado**  
Mientras Evaluación permanezca fuera del gate V1.0, la navegación y tarjetas correspondientes deben nacer deshabilitadas y no depender de una modificación tardía del DOM.

**Resultado obtenido**  
NO PASA en implementación estática. `index.html` entrega inicialmente la navegación y la tarjeta de Evaluación con `onclick="go('evaluation')"`, y la pantalla contiene acciones de Registro, Evaluación de Unidad/Proyecto y Conclusiones SIAGIE. La desactivación se aplica recién cuando `home-surface-truth-v73.js` es cargado dinámicamente.

**PASA / NO PASA:** NO PASA  
**Clasificación:** PARCIALMENTE FUNCIONAL  
**Severidad:** S2 — ALTO.

## Evidencia técnica

1. `index.html`: Materiales y Evaluación aparecen accionables en el HTML inicial; el botón de Materiales conserva `onclick="generateMaterial()"`.
2. Orden síncrono de scripts de `index.html`: `app.js` se carga antes de `schedule-prompt-v6.js`.
3. `schedule-prompt-v6.js` v50.1: las guardas funcionales se cargan secuencialmente; `material-surface-truth-v70.js` y `home-surface-truth-v73.js` llegan después de numerosos módulos.
4. `home-surface-truth-v73.js`: `markUnavailableHomeAction()` y `markUnavailableNavigation()` son las funciones que finalmente eliminan `onclick` y deshabilitan Materiales/Evaluación.
5. `AUD-MATERIAL-SURFACE-TRUTH-CLICKABLE-SIMULATION-279.md`: confirma que v70.1 funciona después de cargarse, pero su evidencia E2E física sigue pendiente.

## Causa raíz

La arquitectura mantiene el HTML base en estado optimista y confía en una capa dinámica tardía para convertir funciones no listas en estados `Próximamente`. La verdad funcional, por tanto, no es fail-closed desde el primer byte de interfaz.

## Acción correctiva requerida

1. Hacer que Materiales y Evaluación nazcan deshabilitados directamente en el HTML productivo mientras sigan fuera de V1.0; eliminar sus `onclick` productivos de entrada o sustituirlos por un estado estático `Próximamente`.
2. El botón de generación de Materiales debe nacer sin `onclick`, `disabled` y `aria-disabled="true"` hasta que exista un motor real validado.
3. Si en el futuro una función supera V5, habilitarla solo desde una transición explícita y probada; no usar un estado optimista seguido de desactivación tardía.
4. Añadir prueba automatizada sobre el HTML inicial, antes de ejecutar JavaScript dinámico, que falle si una función declarada no disponible contiene `onclick` o está habilitada.
5. Reprobar con red lenta/throttling, recarga dura, doble clic, teclado y móvil real.

## Corrección directa

No se modifica runtime en esta ronda. La corrección segura debe hacerse en la fuente estática de la superficie inicial o en una guarda síncrona dedicada cargada **antes de `app.js`**. Mezclar esta responsabilidad dentro de una guarda de almacenamiento u otro módulo no relacionado aumentaría acoplamiento y riesgo de regresión. Se deja el defecto documentado en lugar de simular una solución parcial.

## Riesgo de regresión

**MEDIO-ALTO.** Una solución tardía puede volver a abrir la ventana por cambios de orden, latencia, caché o error de módulo. La condición segura es que el HTML inicial ya exprese el estado real.

## Impacto cualitativo

- **IUD:** riesgo de que el usuario acceda a una función que el sistema declara no disponible y confunda una salida demostrativa con producto real.
- **ISU:** inconsistencia visible durante el arranque; mayor impacto con red lenta o dispositivo de baja gama.
- **ICGD/IFR:** no se recalculan; el defecto puede exponer funciones ya bloqueadas por otros hallazgos.
- **Prelaunch:** no crea un segundo S1 de Materiales, pero refuerza que V5 sigue BLOQUEADO y que las superficies no disponibles deben ser fail-closed desde el arranque.

## Evidencia real todavía pendiente

- reproducción con throttling de red en navegador real;
- dispositivo Android/iOS físico de gama media/baja;
- interacción por toque/teclado durante el arranque;
- prueba automatizada de HTML inicial antes de ejecutar módulos dinámicos.

No se aplicó ni se declaró vigente normativa MINEDU/UGEL externa en este hallazgo técnico. No se calculan ISU/IFR/Prelaunch Score definitivos.

## Revalidación y corrección — 2026-09-18

- **Cambio aplicado:** `index.html` ahora entrega Materiales, Evaluación, Diagnóstico y Programación anual en estado **fail-closed desde el HTML inicial**; también se deshabilitaron sus acciones internas y accesos móviles antes de que carguen las guardas dinámicas.
- **Commit funcional:** `975aa270f22654c9b5deda90f1ddac361dd12fba` — `fix: fail closed unavailable V5 surfaces from initial HTML`.
- **Evidencia previa al cambio:** el HTML inicial contenía `onclick="go('materials')"`, `onclick="go('evaluation')"`, `onclick="showDiagnostic()"`, `onclick="demoAnnual()"`, `onclick="generateMaterial()"` y acciones `showEvaluation(...)`.
- **Evidencia posterior:** esas rutas ya no están presentes como acciones clicables en el HTML inicial; se conservan las guardas dinámicas como segunda barrera.
- **Prelaunch Smoke #380:** PASA sobre el commit funcional.
- **Beta E2E Browser Gate:** el recorrido principal de navegador pasó; el workflow continuaba ejecutando regresiones semánticas/resiliencia al registrar esta actualización.
- **Prevención añadida:** el Prelaunch Smoke ahora falla si cualquiera de esas acciones vuelve a aparecer clicable en `index.html` o si desaparecen los marcadores de estado fail-closed.

### Estado actualizado de AUD-BOOT-286

`PASA EN IMPLEMENTACIÓN · FUNCIONAL EN IMPLEMENTACIÓN · S4 residual`.

La causa técnica original (ventana de arranque con superficies no listas clicables) queda corregida y protegida contra regresión estática. Permanece **PENDIENTE** la validación física en dispositivos reales y no se interpreta este cierre como aprobación de las funciones Materiales, Evaluación ni Programación anual; sus capacidades reales siguen sujetas a sus hallazgos canónicos V5.
