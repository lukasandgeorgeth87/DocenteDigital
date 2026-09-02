# AUD-SESSION-DEMO-079

## Módulo
Carpeta Docente → Sesiones → trazabilidad Unidad/Proyecto → Sesión.

## Especificaciones aplicadas
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

## Prueba
**ID:** AUD-SESSION-DEMO-079

**Entrada:** perfil configurado sin ninguna Unidad/Proyecto guardada → abrir `Crear mi sesión` → preparar sesión.

**Resultado esperado:** la app debe exigir una Unidad/Proyecto real y trazable antes de generar una sesión, o indicar claramente que no existe una planificación de origen. V2 exige Programación → Unidad/Proyecto → Sesiones y prohíbe sesiones desconectadas; V5 exige ese recorrido E2E antes del lanzamiento.

**Resultado obtenido:** `fillSessionUnits()` inserta cuando `state.units` está vacío una opción demo (`Ejemplo: Proyecto Cuidamos la Pachamama`); `loadUnitForSession()` crea actividades demo; `selectedActivity()` devuelve una actividad por defecto; y `buildSession()` puede construir una sesión con `unitId: null` y `unitTitle: 'Unidad de ejemplo'`. La producción mantiene accesible el botón `Crear mi sesión` aunque no exista una unidad real.

**Evidencia:** `app.js` actual y HTML servido por producción.

**Estado:** NO PASA.

**Severidad:** S1 CRÍTICO.

**Clasificación:** SIMULADA / PARCIALMENTE FUNCIONAL.

## Causa raíz
El prototipo conserva fallbacks demostrativos dentro del flujo productivo de Sesiones. Esos fallbacks permiten continuar sin una fuente real de planificación y pueden aparentar trazabilidad donde no existe.

## Acción correctiva requerida
1. Bloquear la generación de sesión cuando no exista una Unidad/Proyecto real guardada.
2. Sustituir las opciones demo por un estado vacío claro: `Primero crea o abre una Unidad/Proyecto`.
3. No crear `unitId: null` ni `Unidad de ejemplo` en un flujo productivo.
4. Una vez exista una unidad real, reutilizar únicamente sus actividades, título, área y demás datos trazables.
5. Retestar recarga, regreso a la pantalla, doble clic y continuidad del trabajo.

## Corrección en esta ejecución
No aplicada. El hallazgo requiere intervenir el flujo dinámico de Sesiones y retestarlo en navegador real; el entorno de esta ejecución no dispone del navegador automatizado requerido. No se sustituye esa prueba por una simulación.

## Evidencia posterior
- Producción comprobada accesible con HTTP 200.
- Último deployment observado: `dpl_CgWKKbkvoWDbN1DmUomxdeZ3DJpM`, `production`, `READY`.
- El defecto funcional permanece abierto.

## Fuente oficial
No se aplicó ni declaró una norma educativa nueva en esta prueba. El hallazgo es de trazabilidad y calidad del propio sistema, derivado de V2/V3/V4/V5/Núcleo IA.

## Riesgo de regresión
Alto si se corrige solo ocultando la opción visual: deben bloquearse también los fallbacks de `fillSessionUnits`, `selectedActivity` y `buildSession`.

## Impacto
- **IUD:** negativo por permitir iniciar una tarea en un estado inválido.
- **ICGD:** negativo por pérdida de coherencia documental.
- **IFR:** negativo por flujo parcialmente simulado.
- **ISU:** no calcular definitivo; la facilidad aparente oculta un error funcional.
- **Prelaunch:** bloqueante abierto. No declarar V1.0 lista.
