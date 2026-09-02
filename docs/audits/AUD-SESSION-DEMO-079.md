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

**Resultado obtenido antes de corregir:** `fillSessionUnits()` insertaba cuando `state.units` estaba vacío una opción demo (`Ejemplo: Proyecto Cuidamos la Pachamama`); `loadUnitForSession()` creaba actividades demo; `selectedActivity()` devolvía una actividad por defecto; y `buildSession()` podía construir una sesión con `unitId: null` y `unitTitle: 'Unidad de ejemplo'`.

**Estado inicial:** NO PASA.

**Severidad:** S1 CRÍTICO.

**Clasificación inicial:** SIMULADA / PARCIALMENTE FUNCIONAL.

## Causa raíz
El prototipo conservaba fallbacks demostrativos dentro del flujo productivo de Sesiones. Esos fallbacks permitían continuar sin una fuente real de planificación y aparentar trazabilidad donde no existía.

## Corrección aplicada
En `initial-curriculum-guard-v72.js` v73.4 se agregó `guardSessionRequiresRealUnit()` con dos barreras:

1. Si no existe ninguna Unidad/Proyecto real en `state.units`, `sessionUnit` muestra `Primero crea o abre una Unidad/Proyecto`, el selector de actividad queda sin actividad programada y el botón de preparar sesión queda deshabilitado.
2. `generateSession()` queda envuelto con una validación independiente: solo continúa si el `sessionUnit` seleccionado coincide con un `id` realmente presente en `state.units`.

La pantalla muestra además un aviso breve explicando que DocenteDigital no utilizará ejemplos automáticos como si fueran planificación del usuario. La corrección no modifica documentos históricos ni crea backend, IA o datos inexistentes.

**Commit funcional:** `ea8857f80508ff4dedf89bc66386412c8b6c570d`.

## Retest
**Entrada:** estado sin unidades reales.

**Esperado:** no permitir generar sesión demo.

**Obtenido técnico:** la versión productiva de `initial-curriculum-guard-v72.js` sirve v73.4 y contiene la barrera visual y la validación de `generateSession()` contra un `id` de unidad real.

**Evidencia posterior:** deployment `dpl_FT7VCchFvNaMmEptKS4w1caJwDCz` en `production` con estado `READY`; `https://docente-digital.vercel.app/` responde HTTP 200 y `https://docente-digital.vercel.app/initial-curriculum-guard-v72.js` responde HTTP 200 sirviendo v73.4.

**Resultado posterior:** PASA a nivel de integración técnica respecto de impedir el fallback demo sin unidad real.

**Clasificación posterior del punto corregido:** FUNCIONAL como guardia de trazabilidad. El flujo completo de Sesiones sigue siendo PARCIALMENTE FUNCIONAL mientras no apruebe todas las pruebas pedagógicas, DOCX, móvil físico, persistencia y E2E exigidas por V5.

## Pruebas que permanecen pendientes
- navegación física en celular y tablet;
- doble clic real;
- cierre/reapertura durante el flujo;
- exportación Word/PDF física;
- recorrido completo Programación → Unidad/Proyecto → Sesión → Materiales → Evaluación → Registro;
- 100 generaciones y año completo.

No se consideran validadas por este cambio.

## Fuente oficial
No se aplicó ni declaró una norma educativa nueva en esta prueba. El hallazgo es de trazabilidad y calidad del propio sistema, derivado de V2/V3/V4/V5/Núcleo IA.

## Riesgo de regresión
Medio. `app.js` todavía contiene fallbacks demo internos; la guardia v73.4 los bloquea en el flujo actual, pero una futura ruta nueva que invoque directamente funciones base podría reintroducirlos. La solución estructural posterior deberá retirar esos fallbacks del núcleo una vez existan pruebas automatizadas suficientes.

## Impacto
- **IUD:** mejora: ya no inicia una sesión con planificación ficticia cuando no existe unidad real.
- **ICGD:** mejora: refuerza Unidad/Proyecto → Sesión.
- **IFR:** mejora parcial: elimina una simulación concreta, sin declarar el módulo completo terminado.
- **ISU:** no calcular definitivo; el mensaje de estado vacío es más claro, pero requiere prueba con usuarios reales.
- **Prelaunch:** este defecto puntual deja de actuar como bloqueante S1, pero V5 continúa bloqueado por los demás requisitos y pruebas reales pendientes.
