# AUD-OBSERVABILITY-165 — Observabilidad cliente no demostrada

## Alcance
Auditoría V2 + V3 + V4 + V5 + Núcleo IA. Este hallazgo evalúa monitoreo productivo y detección de errores silenciosos en navegador.

## ID de prueba
AUD-OBSERVABILITY-165

## Módulo
Producción / Observabilidad / Monitoreo / UX cliente

## Entrada
1. Revisar el proyecto y la producción actual.
2. Buscar SDK, endpoint o capa de captura para errores JavaScript de navegador, fallos de exportación, latencia percibida, generaciones, costo IA y eventos críticos.
3. Consultar errores runtime de Vercel de la última hora.
4. Contrastar con V3 §20 y V5 §14.

## Resultado esperado
V3 exige que producción permita conocer errores, latencia, tasa de éxito, costo IA, tokens, caídas y servicio afectado, detectando degradación antes de que el usuario tenga que reportarla. V5 exige controlar servicio, errores, latencia, generaciones, costo IA, usuarios activos, fallos de exportación y fallos de login; los errores graves deben generar alertas sin esperar al docente.

## Resultado obtenido
- La búsqueda del repositorio no encontró integración de Sentry, telemetría, observabilidad, error tracking ni una capa equivalente.
- No se encontró `window.onerror` ni un manejador global equivalente de errores de cliente.
- La producción servida es esencialmente una aplicación cliente/estática con scripts JavaScript en navegador.
- La política CSP productiva declara `connect-src 'self'`, por lo que cualquier futura telemetría remota requerirá un endpoint same-origin o un cambio explícito y controlado de CSP.
- Vercel reportó **sin errores runtime** en la última hora; esto no demuestra ausencia de errores JavaScript del navegador porque los runtime logs consultados cubren ejecución serverless/edge, no fallos de la UI estática en el dispositivo del usuario.
- No existe evidencia de alertas automáticas por pantalla blanca/negra, excepción cliente, fallo de exportación DOCX, error de persistencia local, degradación de flujo o error silencioso pedagógico/administrativo.

## Evidencia
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`, §20 Observabilidad y §30 error silencioso.
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`, §14 Monitoreo.
- Producción `https://docente-digital.vercel.app/`: HTTP 200 y CSP con `connect-src 'self'`.
- Consulta Vercel `get_runtime_errors` de la última hora: sin runtime errors.
- Búsqueda de código: sin resultados para Sentry/telemetry/observability/monitor/error tracking/latency/tokens/cost y sin `window.onerror`.

## PASA / NO PASA
**NO PASA**

## Clasificación
**INEXISTENTE** para observabilidad cliente integral.

## Severidad
**S2 ALTO**.

No se eleva a S1/S0 porque en esta prueba no se demostró una falla funcional crítica ni pérdida/fuga real; se demostró ausencia de capacidad de detección/alerta exigida para prelaunch. Si una falla crítica de cliente ocurre y queda invisible en producción, su severidad se evaluará por el daño causado.

## Causa raíz
La arquitectura productiva actual prioriza una SPA/cliente estático sin una capa de observabilidad end-to-end. La observabilidad de plataforma disponible no sustituye la captura de errores que ocurren exclusivamente en el navegador.

## Acción correctiva
1. Diseñar telemetría mínima y respetuosa de privacidad antes de añadir SDKs.
2. Capturar `error` y `unhandledrejection` globalmente sin incluir contenido pedagógico sensible ni datos personales innecesarios.
3. Registrar fallos críticos de guardado, recuperación, exportación, generación y navegación con IDs de evento y versión de app.
4. Implementar endpoint same-origin o ajustar CSP de forma explícita si se usa un proveedor externo.
5. Definir alertas por tasa de error, exportación fallida, pantalla no renderizada y disponibilidad.
6. Medir latencia y tasa de éxito por flujo crítico, no solo HTTP 200.
7. Para IA real futura: registrar costo/tokens/latencia por función sin exponer prompts o datos sensibles.
8. Probar deliberadamente una excepción cliente y confirmar que se registra y alerta.
9. Probar un fallo de exportación y confirmar que se registra sin perder el trabajo del usuario.

## Evidencia posterior requerida para cerrar
- Evento de error cliente reproducible visible en observabilidad.
- Alerta real recibida para un error crítico de prueba.
- Panel o consulta con versión, ruta/flujo, tipo de error y frecuencia.
- Evidencia de que la telemetría no captura datos personales/pedagógicos innecesarios.
- Prueba de recuperación del usuario después del fallo.

## Riesgo de regresión
Alto si se incorpora telemetría sin revisar privacidad/CSP: podría filtrar datos, romper `connect-src` o afectar rendimiento. Implementar de forma pequeña, versionada y reversible.

## Impacto en indicadores
- IUD: afecta capacidad de detectar fallos que degradan experiencia.
- ICGD: afecta confianza en estabilidad y trazabilidad operativa.
- IFR: no se recalcula sin evidencia completa.
- ISU: no se recalcula sin usuarios reales.
- Prelaunch: mantiene requisito de monitoreo **PENDIENTE / NO PASA**.

## Estado de lanzamiento
Este hallazgo por sí solo es S2, pero DocenteDigital sigue **NO APROBADA PARA LANZAMIENTO V1.0** mientras existan S0/S1 abiertos y pruebas reales esenciales pendientes.
