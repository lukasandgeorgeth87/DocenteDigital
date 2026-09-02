# AUD-NAV-ACCESSIBILITY-096

## Especificaciones aplicadas
AUDITORIA_MAESTRA_INTEGRAL_V2 + ADENDA_AUDITORIA_EJECUTABLE_V3 + AUDITORIA_SIMPLICIDAD_USO_V4 + AUDITORIA_PRELANZAMIENTO_V5 + NUCLEO_IA_DOCENTEDIGITAL.

## Hallazgo 1 — Volver visible
- ID: AUD-UX-NAV-096A
- Entrada: navegar desde Inicio a Mi planificación, Sesión, Director o Configuración.
- Esperado: ruta clara y visible para volver, sin obligar a descubrir el menú lateral/móvil.
- Obtenido antes: las pantallas principales no tenían una acción Volver persistente; solo el asistente inicial tenía Atrás por pasos.
- Estado previo: NO PASA.
- Severidad: S3 MEDIO.
- Clasificación: PARCIALMENTE FUNCIONAL.
- Causa raíz: navegación SPA basada en `go(id)` sin historial visible de pantalla.
- Corrección: `home-surface-truth-v73.js` agrega `ddGlobalBack`, conserva la pantalla anterior y vuelve a Inicio cuando no existe antecedente seguro.
- Riesgo de regresión: bajo; la acción usa el `go()` existente y no modifica datos.
- Impacto: mejora IUD/ISU y reduce riesgo de abandono en móvil.

## Hallazgo 2 — Estado accesible de navegación
- ID: AUD-A11Y-NAV-096B
- Entrada: cambiar entre pantallas mediante navegación lateral o móvil.
- Esperado: el elemento de navegación activo debe exponer estado semántico y la nueva pantalla debe poder recibir foco comprensible para teclado/lector de pantalla.
- Obtenido antes: el estado activo dependía principalmente de clase CSS; no se actualizaba `aria-current`, y el encabezado principal no recibía foco tras navegación SPA.
- Estado previo: NO PASA.
- Severidad: S3 MEDIO.
- Clasificación: PARCIALMENTE FUNCIONAL.
- Causa raíz: navegación visual sin sincronización ARIA/foco.
- Corrección: actualización de `aria-current="page"`, `tabindex="-1"` en el `h1` de la pantalla activa y foco programático seguro cuando la navegación procede de controles de menú.
- Riesgo de regresión: bajo; no altera contenido ni estado pedagógico.
- Impacto: mejora accesibilidad, navegación por teclado y claridad de contexto.

## Evidencia posterior
Commit funcional: `6761d0d8b4049b4aaad9f384522fdc9fb3e5878a`.
Integración Vercel del commit: success.
Producción: `https://docente-digital.vercel.app/home-surface-truth-v73.js` responde HTTP 200 y sirve `ensureBackButton`, `guardNavigationHistory` y `syncNavigationAccessibility`.

## Pendiente V5
No sustituye prueba física con usuarios, lector de pantalla real, teclado completo, contraste, zoom, VoiceOver/TalkBack ni prueba de pulgar en dispositivos reales. Esas verificaciones permanecen PENDIENTES.

## Gate
DocenteDigital continúa NO APROBADA PARA LANZAMIENTO V1.0 mientras existan bloqueantes V5.