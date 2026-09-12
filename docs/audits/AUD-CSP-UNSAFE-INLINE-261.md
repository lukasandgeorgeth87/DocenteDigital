# AUD-CSP-UNSAFE-INLINE-261 — CSP productiva permite JavaScript inline

## Especificaciones obligatorias aplicadas
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

## Regla aplicable
V5 exige auditoría de seguridad con un estándar reconocido como OWASP ASVS antes del lanzamiento y establece que seguridad/privacidad deben demostrarse, no suponerse. V3 clasifica como S0 solo cuando existe fuga, corrupción o privilegio indebido demostrado; por eso este hallazgo no se eleva artificialmente a S0 sin explotación comprobada.

Fuente oficial verificada el 12-09-2026:
- OWASP Content Security Policy Cheat Sheet: recomienda restringir scripts inline y explica que los manejadores inline como `onclick` quedan bloqueados por una CSP estricta y deben migrarse a `addEventListener` o autorizarse de forma granular mediante nonce/hash cuando corresponda.
- OWASP Web Security Testing Guide, sección CSP: identifica `unsafe-inline` como directiva de alto riesgo porque debilita significativamente la protección XSS.

## Prueba
**ID:** AUD-SEG-CSP-261-A  
**Módulo:** Seguridad HTTP / frontend productivo.  
**Entrada:** solicitud HTTP real a `https://docente-digital.vercel.app/` y revisión del HTML entregado.  
**Resultado esperado:** CSP de producción que reduzca la superficie XSS y evite permitir JavaScript inline de forma global, salvo excepción justificada y controlada.  
**Resultado obtenido:** producción devuelve `Content-Security-Policy` con `script-src 'self' 'unsafe-inline'`. El HTML depende de numerosos manejadores inline (`onclick="..."`, `onchange="..."`) y contiene además un bloque `<script>` inline, por lo que retirar `unsafe-inline` de forma directa rompería la interfaz actual. Otros controles sí están presentes: `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer` y `X-Frame-Options: DENY`.  
**Evidencia:** respuesta HTTP 200 productiva observada el 12-09-2026; cabecera CSP y HTML servidos por Vercel.  
**Resultado:** NO PASA el endurecimiento CSP previo a V1.0.  
**Clasificación:** PARCIALMENTE FUNCIONAL: existe CSP real y varios controles correctos, pero `unsafe-inline` reduce su capacidad de contención frente a XSS.  
**Severidad:** S2 ALTO. No se demostró explotación XSS ni fuga de datos; si una prueba posterior demuestra ejecución inyectada con impacto sobre datos/identidad, reclasificar según V3.  
**Acción correctiva:** migrar gradualmente manejadores `onclick`/`onchange` a listeners registrados desde scripts externos; retirar el bloque JS inline; después eliminar `'unsafe-inline'` de `script-src` o usar una política estricta compatible con la arquitectura. Aplicar primero en preview, ejecutar smoke funcional Docente/Director/móvil y solo después promover a producción.

## Causa raíz
La UI actual usa ampliamente event handlers embebidos en HTML. La CSP fue configurada para mantener compatibilidad con esa arquitectura, lo que obliga a permitir scripts inline globalmente.

## Corrección aplicada en esta ronda
No se modificó runtime. Quitar `'unsafe-inline'` sin refactor previo rompería botones y selects críticos, por lo que no cumple la regla de cambios pequeños, seguros y reversibles. Se registra el hallazgo y la secuencia segura de remediación.

## Evidencia posterior requerida para cerrar
1. `script-src` productivo sin `'unsafe-inline'` global, o justificación técnica equivalente mediante CSP estricta verificable.
2. Cero manejadores `onclick`/`onchange` inline en las rutas principales o autorización granular demostrada.
3. Pruebas E2E de Perfil IE, Unidad/Proyecto, Sesión, Materiales, Evaluación y Director en preview y producción.
4. Prueba de inyección/XSS autorizada en entorno de pruebas.
5. Confirmar Vercel `READY`, HTTP 200 y ausencia de errores runtime tras el cambio.

## Riesgo de regresión
ALTO si se retira `unsafe-inline` antes de migrar los handlers. MEDIO/BAJO si se refactoriza por módulos con pruebas automáticas y rollback.

## Impacto cualitativo
- **IUD/ISU:** sin cambio directo; un refactor mal ejecutado sí podría romper interacción.
- **ICGD:** sin cambio directo.
- **IFR/Prelaunch:** empeora la evidencia de seguridad pendiente y mantiene el gate V5 bloqueado hasta prueba ASVS/seguridad real.
- No se calcula score definitivo.

## Nota de alcance
Este hallazgo no declara que exista una vulnerabilidad XSS explotable concreta. Declara que una defensa en profundidad productiva está debilitada y requiere remediación/verificación antes de V1.0 conforme al gate de seguridad de V5.