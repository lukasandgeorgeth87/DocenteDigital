# AUD-SESSION-NO-UNIT-DEMO-FALLBACK-284

**Estado:** CORREGIDO EN IMPLEMENTACIÓN · E2E REAL PENDIENTE · BLOQUEANTE V5 HASTA REPRUEBA  
**Clasificación funcional:** FUNCIONAL EN IMPLEMENTACIÓN / VALIDACIÓN REAL PENDIENTE  
**Severidad original:** S1 CRÍTICO  
**Módulo:** Docente → Sesiones → trazabilidad Unidad/Proyecto → actividad → sesión  

## Relación con el historial acumulativo

Este expediente **no representa un defecto independiente adicional** respecto de `AUD-SES-SRC-031`, ya registrado previamente en `docs/AUDITORIA_CONTINUA_HORARIA.md` para la misma causa raíz: creación de sesiones desde unidades/actividades demostrativas cuando no existe una Unidad/Proyecto real.

`AUD-SESSION-284` se conserva como expediente ampliado y evidencia posterior de la misma familia de falla, pero **no debe contarse dos veces** al calcular bloqueantes, tendencias, tasas de error ni cualquier indicador futuro. La severidad S1 corresponde al defecto original; el estado actual debe seguirse por las repruebas descritas aquí.

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

1. `app.js` contenía un fallback demostrativo en `fillSessionUnits()` con `value="demo"` y “Ejemplo: Proyecto Cuidamos la Pachamama”.
2. `loadUnitForSession()` podía cargar actividades demostrativas cuando no encontraba una unidad real.
3. `selectedActivity()` podía devolver un objeto con `unit:null` y una actividad sintética.
4. `buildSession()` podía continuar, asignar `unitId:null`, `unitTitle:'Unidad de ejemplo'` y persistir la sesión.
5. La auditoría pedagógica posterior detectaba la falta de vínculo después de la construcción, demasiado tarde para impedir el estado simulado.

**Resultado original:** **NO PASA**.

**Clasificación original:** **SIMULADA**.

**Severidad:** **S1 CRÍTICO** por permitir crear contenido pedagógico desde una fuente demostrativa no proporcionada por el usuario.

## Causa raíz

El runtime base conservaba fallbacks demostrativos dentro del flujo de Sesiones. La protección debía actuar antes de generar o persistir, no después.

## Correcciones implementadas

La defensa actual está compuesta por dos capas complementarias:

### 1. Superficie y entrada — `prototype-data-guard-v41.js` V44

La guarda ya existente envuelve `fillSessionUnits()` y, cuando no hay unidades reales, reemplaza la opción demo visible por:

- `Primero crea una unidad/proyecto`;
- `Sin actividad programada`;
- título de sesión vacío.

También bloquea `generateSession()` cuando no existe una unidad real o una actividad válida. Por ello, la afirmación anterior de que el fallback demo seguía visible en producción era incorrecta y queda rectificada en este expediente.

### 2. Defensa en profundidad — `session-curriculum-safety-v67.js` V67.1

Commit funcional: `e0fad5eff9abbb3c6960b6bd6f7a3e9aebee95c0` — `fix: block session generation without real unit activity`.

Añade `realSessionSelection()` y protege tanto `generateSession()` como `buildSession()` antes de ejecutar el generador base. Exige:

1. una Unidad/Proyecto real presente en `state.units`;
2. actividades reales en esa unidad;
3. una actividad seleccionada con `area` y `title` válidos.

Si falta cualquiera de esas condiciones, el usuario recibe un mensaje simple y no se ejecuta la generación base. No se modifican históricos emitidos.

## Evidencia posterior

- `prototype-data-guard-v41.js` V44 reemplaza visualmente el fallback demo cuando `state.units` está vacío y bloquea `generateSession()` sin fuente real.
- `session-curriculum-safety-v67.js` V67.1 añade una segunda guarda previa sobre `generateSession()` y `buildSession()`.
- Vercel desplegó el commit funcional `e0fad5eff9abbb3c6960b6bd6f7a3e9aebee95c0` como `dpl_6xs2Tu6bCjWaSN4d3gLXCgVviPeU` con estado **READY** y target **production**.
- El HEAD documental posterior `aa68f351a8fa4ade7b1d9bbd0ff52c927deecc63` fue desplegado como `dpl_GTjK6Rs6d25AfpkPrWzmYGixSBYP`, también **READY** en producción.
- La URL canónica `https://docente-digital.vercel.app/` respondió **HTTP 200 OK**.
- `Prelaunch Smoke` run `34867962784` sobre el HEAD `aa68f351a8fa4ade7b1d9bbd0ff52c927deecc63` terminó `completed / success`.

Estas evidencias prueban integración y despliegue, pero **no sustituyen** la prueba E2E real de interacción requerida por V3/V5.

## Repruebas obligatorias

- `AUD-SESSION-284-R1`: sin unidades → generar sesión debe quedar bloqueado y no crear/modificar `lastSession`. **PASA EN IMPLEMENTACIÓN / E2E PENDIENTE**.
- `AUD-SESSION-284-R2`: con una unidad y actividad reales → debe generar y conservar `unitId`, `unitTitle` y `activityTitle` reales. **PENDIENTE E2E**.
- `AUD-SESSION-284-R3`: unidad eliminada/restaurada → no debe aparecer una sesión nueva huérfana. **PENDIENTE E2E**.
- `AUD-SESSION-284-R4`: recarga/direct link a Sesiones sin unidad → debe mostrar el estado vacío real, sin opción demo, y continuar bloqueado de forma comprensible. **PENDIENTE E2E**.
- `AUD-SESSION-284-R5`: doble clic → no debe saltar la guarda ni crear dos sesiones. **PENDIENTE E2E**.
- `AUD-SESSION-284-R6`: móvil físico → mismo comportamiento y acción principal visible. **PENDIENTE PRUEBA FÍSICA**.
- `AUD-SESSION-284-R7`: exportación posterior → ningún DOCX puede declarar “Unidad de ejemplo” como origen productivo. **PENDIENTE WORD REAL**.

## Riesgo de regresión

Medio-bajo a nivel de implementación: las guardas no alteran unidades válidas ni históricos ya emitidos. El riesgo principal restante está en composición de wrappers, interacción real, doble clic y recuperación tras recarga/interrupción.

## Impacto en indicadores

- **IUD:** mejora al eliminar de la superficie el fallback demostrativo y mostrar un estado vacío comprensible.
- **ICGD:** mejora alta por reforzar la precondición Unidad/Proyecto → actividad → sesión.
- **IFR:** mejora en implementación al impedir persistencia de una sesión sin fuente real.
- **ISU:** no calculable definitivamente sin usuarios/pruebas reales.
- **Prelaunch:** continúa bloqueado hasta terminar las pruebas reales esenciales y cerrar los demás S0/S1/bloqueantes V5.

No se calculan puntuaciones definitivas.

## Gate V5

**BLOQUEADO.** La falla específica queda corregida en implementación y reconciliada con `AUD-SES-SRC-031`, pero DocenteDigital no puede declararse lista para V1.0 hasta completar las repruebas E2E/Word/móvil y el resto de pruebas reales esenciales del gate V5.

`CUSCO-DECIDE-ELECCIONES-2026` no fue modificado.