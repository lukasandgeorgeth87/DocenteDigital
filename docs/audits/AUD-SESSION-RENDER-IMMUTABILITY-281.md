# AUD-SESSION-RENDER-IMMUTABILITY-281

## Resumen

Se detectó que `runtime-audit-v23.js` podía modificar una sesión guardada durante una operación de representación (`sessionHtml`) cuando `session.ddStrategyRoute.eib` contenía dos movimientos idénticos. La función reemplazaba aleatoriamente el segundo movimiento, escribía el cambio dentro del objeto `session` y ejecutaba `save()`.

Esto mezclaba una corrección de presentación con una mutación persistente del histórico. Abrir, previsualizar o exportar una sesión no debe cambiar silenciosamente el documento guardado.

## Especificaciones aplicadas

- V2: el sistema debe conservar y reutilizar información de manera consistente.
- V3: los históricos emitidos conservan los datos vigentes al momento de emisión y no deben modificarse retroactivamente; la misma solicitud no puede variar arbitrariamente en hechos registrados.
- V4: la complejidad técnica debe permanecer interna y no provocar efectos inesperados al usuario.
- V5: guardar, recuperar, editar y exportar deben ser operaciones trazables y estables; las pruebas de persistencia y exportación son obligatorias antes del lanzamiento.
- Núcleo IA: la coherencia debe auditarse antes de entregar, sin inventar ni alterar silenciosamente datos ya aprobados.

## Prueba AUD-SESSION-RENDER-281-A

**Módulo:** Sesiones / EIB / representación y exportación

**Entrada:** sesión existente con `ddStrategyRoute.eib = [A, A]`, seguida de apertura de vista previa o llamada a `sessionHtml(session, false/true)`.

**Resultado esperado:** la representación puede evitar una repetición visible, pero no debe modificar `session.ddStrategyRoute`, no debe ejecutar `save()` y debe producir el mismo resultado ante entradas iguales.

**Resultado obtenido antes de la corrección:** el segundo elemento de `route.eib` se sustituía mediante `Math.random()`, el objeto de sesión quedaba mutado y se llamaba `save()` desde la función de renderizado.

**Estado previo:** NO PASA.

**Clasificación previa:** PARCIALMENTE FUNCIONAL.

**Severidad:** S2 ALTO.

**Causa raíz:** una defensa contra repetición EIB fue implementada dentro del renderizador usando mutación del objeto persistido y aleatoriedad.

## Corrección

Commit funcional: `86b6bec81e04170fdda529bc84f732bea8cfe04f` — `fix: keep EIB session rendering immutable`.

Cambios:

1. `runtime-audit-v23.js` pasa a v24.4.
2. Si una ruta EIB histórica contiene dos movimientos idénticos, la corrección se aplica solo al HTML de salida.
3. Ya no se modifica `route.eib`.
4. Ya no se ejecuta `save()` durante el renderizado.
5. El reemplazo deja de ser aleatorio y pasa a ser determinista.
6. Se expone `ddAuditSessionRenderImmutability()` para inspección técnica.

## Reprueba AUD-SESSION-RENDER-281-R1

**Resultado esperado:** renderizado inmutable y determinista.

**Resultado técnico en implementación:** PASA EN IMPLEMENTACIÓN.

**Evidencia pendiente:** prueba E2E real que compare el JSON de la sesión antes y después de vista previa, descarga Word y reapertura; prueba en móvil; comparación visual Word/PDF/impresión.

**Estado final de la función:** FUNCIONAL EN IMPLEMENTACIÓN / E2E REAL PENDIENTE.

## Riesgo de regresión

Medio. Otros wrappers de renderizado/exportación podrían volver a introducir efectos secundarios si usan objetos de estado por referencia.

## Impacto en indicadores

- IUD: impacto técnico positivo pendiente de medición real.
- ICGD: mejora la consistencia del documento guardado frente a su representación.
- IFR: no se recalcula sin batería completa.
- ISU: sin puntuación definitiva; evita cambios invisibles que confundirían al usuario.
- Prelaunch: reduce un riesgo de persistencia, pero no desbloquea V5.

## Gate V5

BLOQUEADO. Continúan pendientes E2E Docente/Director, generación contextual real de Materiales, 100 generaciones/anti-alucinación, móvil físico, Word/PDF/impresión reales, autoguardado/restore, OWASP/aislamiento/privacidad, continuidad sin IA, año completo, escala y pilotos.
