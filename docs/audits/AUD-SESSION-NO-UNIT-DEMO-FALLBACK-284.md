# AUD-SESSION-NO-UNIT-DEMO-FALLBACK-284

**Estado:** CORREGIDO EN IMPLEMENTACIÓN · E2E REAL PENDIENTE · BLOQUEANTE V5 HASTA REPRUEBA  
**Clasificación funcional:** FUNCIONAL EN IMPLEMENTACIÓN / VALIDACIÓN REAL PENDIENTE  
**Severidad original:** S1 CRÍTICO  
**Módulo:** Docente → Sesiones → trazabilidad Unidad/Proyecto → actividad → sesión  

## Especificaciones obligatorias aplicadas

Este hallazgo se evalúa conjuntamente contra:

- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`: la sesión debe mantener continuidad y coherencia con la planificación que la origina.
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`: no basta que una función produzca contenido; debe demostrarse que usa datos reales y no oculta fallos o simulaciones.
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`: el Modo Fácil debe guiar al usuario y evitar estados engañosos o decisiones técnicas innecesarias.
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`: la cadena Docente debe funcionar extremo a extremo antes del lanzamiento.
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`: la sesión debe comprender y heredar la intención pedagógica de la Unidad/Proyecto y de su actividad, sin inventar contexto de origen.

No se aplica ni declara vigente una norma externa en este hallazgo técnico.

## AUD-SESSION-284-A

**Entrada:** estado válido de perfil docente pero sin ninguna Unidad/Proyecto real guardada (`state.units=[]`). Abrir Sesiones e intentar generar una sesión.

**Resultado esperado:** la aplicación debe impedir generar la sesión y mostrar una instrucción simple y accionable, por ejemplo: “Primero crea o elige una Unidad/Proyecto”. No debe crear Unidad, actividad, título, contexto ni trazabilidad demostrativos para aparentar continuidad pedagógica.

**Resultado obtenido originalmente:**

1. `fillSessionUnits()` detectaba que no existían unidades y cargaba en el selector una opción sintética `value="demo"` con el texto “Ejemplo: Proyecto Cuidamos la Pachamama”.
2. `loadUnitForSession()` no encontraba una unidad real y cargaba actividades demostrativas.
3. `selectedActivity()` devolvía un objeto con `unit:null` y una actividad sintética.
4. `buildSession()` continuaba, asignaba `unitId:null`, `unitTitle:'Unidad de ejemplo'` y persistía la sesión en `state.lastSession` mediante `save()`.
5. `session-learning-core-v54.js` detectaba después la falta de Unidad/Proyecto y actividad programada, pero demasiado tarde para impedir la creación/persistencia.

**Resultado original:** **NO PASA**.

**Clasificación original:** **SIMULADA**.

**Severidad:** **S1 CRÍTICO** por permitir crear contenido pedagógico desde una fuente demostrativa no proporcionada por el usuario.

## Causa raíz

El prototipo base conserva fallbacks demostrativos dentro del flujo productivo. Las capas posteriores enriquecían y auditaban la sesión, pero no aplicaban una guarda previa de fuente real antes de `buildSession()`/`save()`.

## Corrección implementada

Commit funcional: `e0fad5eff9abbb3c6960b6bd6f7a3e9aebee95c0` — `fix: block session generation without real unit activity`.

`session-curriculum-safety-v67.js` pasa a v67.1 y añade una guarda fail-closed previa a la generación:

1. `realSessionSelection()` exige que `sessionUnit` resuelva a un objeto real de `state.units`;
2. exige que la Unidad tenga `activities` reales;
3. exige que el índice seleccionado resuelva a una actividad con `area` y `title`;
4. `generateSession()` se bloquea antes de llamar al generador base si falta cualquiera de esas condiciones;
5. `buildSession()` también queda protegido para evitar invocaciones directas inseguras;
6. el usuario recibe un mensaje simple: “Primero crea o elige una Unidad/Proyecto con una actividad programada. La sesión debe nacer de esa planificación.”;
7. no se modifica ningún histórico emitido.

La corrección no elimina todavía las opciones visuales demo del runtime base; las vuelve no ejecutables como fuente productiva. Retirarlas visualmente sigue siendo una mejora V4 pendiente, no un requisito para evitar la persistencia simulada.

## Evidencia posterior

- Vercel desplegó el commit funcional exacto `e0fad5eff9abbb3c6960b6bd6f7a3e9aebee95c0` como `dpl_6xs2Tu6bCjWaSN4d3gLXCgVviPeU` con estado **READY** y target **production**.
- La URL canónica `https://docente-digital.vercel.app/` respondió **HTTP 200 OK** tras el despliegue.
- El asset productivo `session-curriculum-safety-v67.js` respondió **HTTP 200** y contiene v67.1 con `realSessionSelection`, guardas de `buildSession` y `generateSession`, y el mensaje de bloqueo.
- Vercel no reportó errores runtime durante la última hora posterior al cambio.

Estas evidencias demuestran despliegue e implementación, no sustituyen la prueba E2E real de interacción.

## Repruebas obligatorias

- `AUD-SESSION-284-R1`: sin unidades → generar sesión debe quedar bloqueado y no crear/modificar `lastSession`. **PASA EN IMPLEMENTACIÓN / E2E PENDIENTE**.
- `AUD-SESSION-284-R2`: con una unidad y actividad reales → debe generar y conservar `unitId`, `unitTitle` y `activityTitle` reales. **PENDIENTE E2E**.
- `AUD-SESSION-284-R3`: unidad eliminada/restaurada → no debe aparecer una sesión nueva huérfana. **PENDIENTE E2E**.
- `AUD-SESSION-284-R4`: recarga/direct link a Sesiones sin unidad → debe continuar bloqueado de forma comprensible. **PENDIENTE E2E**.
- `AUD-SESSION-284-R5`: doble clic → no debe saltar la guarda ni crear dos sesiones. **PENDIENTE E2E**.
- `AUD-SESSION-284-R6`: móvil físico → mismo comportamiento y acción principal visible. **PENDIENTE PRUEBA FÍSICA**.
- `AUD-SESSION-284-R7`: exportación posterior → ningún DOCX puede declarar “Unidad de ejemplo” como origen productivo. **PENDIENTE WORD REAL**.

## Riesgo de regresión

Medio-bajo a nivel de implementación: la guarda se limita a la entrada de generación y no modifica `state.units`, `state.lastSession` histórico ni el contenido de las unidades válidas. Sigue siendo necesaria la reprueba E2E para comprobar interacción, doble clic y recuperación.

## Impacto en indicadores

- **IUD:** mejora al impedir una ruta engañosa; la superficie demo visual todavía debe simplificarse.
- **ICGD:** mejora alta por restaurar la precondición Unidad/Proyecto → actividad → sesión.
- **IFR:** mejora en implementación al evitar persistencia de una sesión sin fuente real.
- **ISU:** no calculable definitivamente sin usuarios/pruebas reales.
- **Prelaunch:** continúa bloqueado hasta terminar las pruebas reales esenciales y cerrar los demás S0/S1/bloqueantes V5.

No se calculan puntuaciones definitivas.

## Gate V5

**BLOQUEADO.** La falla específica queda corregida en implementación, pero DocenteDigital no puede declararse lista para V1.0 hasta completar las repruebas E2E/Word/móvil de este hallazgo y el resto de pruebas reales esenciales del gate V5.

`CUSCO-DECIDE-ELECCIONES-2026` no fue modificado.