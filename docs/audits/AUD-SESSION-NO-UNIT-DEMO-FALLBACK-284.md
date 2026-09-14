# AUD-SESSION-NO-UNIT-DEMO-FALLBACK-284

**Estado:** ABIERTO · BLOQUEANTE V5  
**Clasificación funcional:** SIMULADA  
**Severidad:** S1 CRÍTICO  
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

**Resultado obtenido:**

1. `fillSessionUnits()` detecta que no existen unidades y carga en el selector una opción sintética `value="demo"` con el texto “Ejemplo: Proyecto Cuidamos la Pachamama”.
2. `loadUnitForSession()` no encuentra una unidad real y carga dos actividades demostrativas, entre ellas “Matemática · Medimos espacios para organizar nuestra feria”.
3. `selectedActivity()` devuelve un objeto con `unit:null` y una actividad sintética de Matemática.
4. `buildSession()` continúa, usa `brief='la situación de nuestra comunidad'`, asigna `unitId:null`, `unitTitle:'Unidad de ejemplo'` y persiste la sesión en `state.lastSession` mediante `save()`.
5. `session-learning-core-v54.js` sí detecta después que falta Unidad/Proyecto y actividad programada en `sessionAuditV54`, pero esa auditoría ocurre tras la construcción y no bloquea la creación/persistencia de la sesión.

**Evidencia:** `app.js` (`fillSessionUnits`, `loadUnitForSession`, `selectedActivity`, `buildSession`, `generateSession`) y `session-learning-core-v54.js` (`audit`, wrapper de `buildSession`).

**Resultado:** **NO PASA**.

**Clasificación:** **SIMULADA**. La función puede producir una sesión aparentemente coherente aun cuando no existe la fuente pedagógica real que debería originarla.

**Severidad:** **S1 CRÍTICO**. Afecta una función esencial del flujo Docente y permite persistir contenido pedagógico construido desde contexto de demostración no proporcionado por el usuario. Esto vulnera directamente la trazabilidad y el principio de no inventar datos/contexto, por lo que bloquea el gate V5 aunque la pantalla responda y el documento tenga formato correcto.

## Causa raíz

El prototipo base conserva fallbacks demostrativos dentro del flujo productivo. Las capas posteriores enriquecen y auditan la sesión, pero no aplican una guarda previa de fuente real antes de `buildSession()`/`save()`.

## Acción correctiva requerida

Aplicar una guarda previa y fail-closed antes de cualquier construcción o persistencia:

1. exigir que `sessionUnit` resuelva a un objeto real de `state.units`;
2. exigir que el índice seleccionado resuelva a una actividad real de esa Unidad/Proyecto;
3. si falta cualquiera, no llamar a `buildSession()`, no modificar `state.lastSession` y no ejecutar `save()`;
4. retirar de producción las opciones y actividades “demo” del selector de Sesiones;
5. mostrar una única acción principal simple: “Crear Unidad/Proyecto” o “Elegir Unidad/Proyecto”; y
6. mantener intactas las sesiones históricas ya emitidas.

La corrección debe ser pequeña, reversible y probarse antes de declararse cerrada. No se aplica automáticamente en este expediente porque intervenir el runtime central sin una reprueba interactiva disponible elevaría el riesgo de regresión.

## Repruebas obligatorias

- `AUD-SESSION-284-R1`: sin unidades → generar sesión debe quedar bloqueado y no crear `lastSession`.
- `AUD-SESSION-284-R2`: con una unidad y actividad reales → debe generar y conservar `unitId`, `unitTitle` y `activityTitle` reales.
- `AUD-SESSION-284-R3`: unidad eliminada/restaurada → no debe aparecer fallback demostrativo ni sesión nueva huérfana.
- `AUD-SESSION-284-R4`: recarga/direct link a Sesiones sin unidad → debe continuar bloqueado de forma comprensible.
- `AUD-SESSION-284-R5`: doble clic → no debe saltar la guarda ni crear dos sesiones.
- `AUD-SESSION-284-R6`: móvil físico → mismo comportamiento y acción principal visible.
- `AUD-SESSION-284-R7`: exportación posterior → ningún DOCX puede declarar “Unidad de ejemplo” como origen productivo.

## Evidencia posterior

**PENDIENTE.** Este expediente documenta el defecto; no simula una corrección inexistente.

## Riesgo de regresión

Medio: la eliminación del fallback debe preservar el flujo normal cuando sí existe Unidad/Proyecto y no debe impedir visualizar históricos válidos.

## Impacto en indicadores

- **IUD:** impacto negativo por guía engañosa en un estado vacío.
- **ICGD:** impacto alto por ruptura de coherencia y trazabilidad pedagógica.
- **IFR:** impacto negativo por permitir persistencia desde una fuente no real.
- **ISU:** no calculable definitivamente sin usuarios/pruebas reales.
- **Prelaunch:** bloqueante V5 por tratarse de una ruta esencial Docente.

No se calculan puntuaciones definitivas.

## Gate V5

**BLOQUEADO.** DocenteDigital no puede declararse lista para V1.0 mientras una sesión pueda nacer y persistirse sin una Unidad/Proyecto y actividad reales, además de los demás bloqueantes ya abiertos.

`CUSCO-DECIDE-ELECCIONES-2026` no fue modificado.