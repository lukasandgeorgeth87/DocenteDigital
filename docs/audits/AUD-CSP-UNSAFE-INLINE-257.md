# AUD-CSP-UNSAFE-INLINE-257

## Resumen

**Módulo:** Seguridad web / Content Security Policy / V5

**Clasificación:** PARCIALMENTE FUNCIONAL

**Resultado:** NO PASA

**Severidad:** S2 ALTO

**Gate V5:** abierto; no constituye por sí solo evidencia de explotación ni fuga de datos, pero la política productiva debilita materialmente la defensa en profundidad contra XSS y debe endurecerse antes de declarar superada la auditoría de seguridad.

## ID de prueba

AUD-SEG-CSP-257

## Entrada

Inspeccionar la respuesta HTTP productiva de `https://docente-digital.vercel.app/` y contrastar el header `Content-Security-Policy` con el HTML y la guía vigente de OWASP para CSP.

## Resultado esperado

V5 exige auditoría con un estándar reconocido como OWASP ASVS y revisión de validación, APIs, almacenamiento, sesiones y seguridad antes del lanzamiento. La CSP debe reducir la superficie XSS; si existen scripts inline o manejadores inline, deben migrarse a mecanismos compatibles con una política más estricta (por ejemplo listeners externos y, cuando corresponda, nonce/hash), sin romper la aplicación.

## Resultado obtenido

Producción responde HTTP 200 y sí envía una CSP, junto con otras cabeceras de endurecimiento (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`). Esto es positivo.

Sin embargo, la política configurada en `vercel.json` incluye:

```text
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
```

Además, `index.html` utiliza numerosos manejadores inline como `onclick="go('home')"`, `onclick="setMode('easy')"`, `onclick="createUnitDemo()"`, etc. Por tanto, retirar hoy `'unsafe-inline'` de `script-src` rompería funciones; la debilidad no es un simple error de cabecera, sino una dependencia arquitectónica actual del HTML.

La respuesta productiva comprobada sirve exactamente esa CSP.

## Evidencia

- `vercel.json`: `Content-Security-Policy` permite `script-src 'self' 'unsafe-inline'` y `style-src 'self' 'unsafe-inline'`.
- `index.html`: existen manejadores de eventos inline en botones principales.
- Producción: HTTP 200 y header CSP idéntico al configurado.
- OWASP Web Security Testing Guide, sección Content Security Policy, consultada el 10/09/2026: clasifica `unsafe-inline` entre las directivas de alto riesgo y señala que debilita significativamente la protección XSS.
- OWASP CSP Cheat Sheet, consultada el 10/09/2026: recomienda restringir scripts inline y muestra migración de manejadores inline a `addEventListener`; cuando se necesita código inline controlado, documenta nonce/hash como alternativas.

Fuentes oficiales OWASP:

- https://wstg.owasp.org/latest/4-Web_Application_Security_Testing/02-Configuration_and_Deployment_Management/12-Content_Security_Policy/
- https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html
- https://owasp.org/www-project-application-security-verification-standard/

## PASA / NO PASA

**NO PASA.**

Tener una CSP es una mejora real, pero permitir scripts inline en producción reduce una de sus defensas principales contra XSS. No se declara vulnerabilidad explotable ni fuga de datos porque esta prueba no demuestra una fuente de inyección controlable por atacante.

## Causa raíz

La interfaz fue construida con manejadores de eventos inline (`onclick`, `onchange`) y existe al menos un bloque `<script>` inline. La CSP se relajó para conservar compatibilidad con esa arquitectura.

## Acción correctiva

1. Migrar progresivamente manejadores inline a JavaScript externo mediante `addEventListener`.
2. Mover bloques `<script>` inline a archivos externos cuando sea posible.
3. Retirar `'unsafe-inline'` de `script-src` cuando la migración esté completa.
4. Si queda código inline legítimo, evaluar nonce/hash conforme al modelo de renderizado y despliegue; no introducir nonces estáticos o reutilizados.
5. Mantener inicialmente una política `Content-Security-Policy-Report-Only` más estricta en pruebas para descubrir regresiones antes de endurecer producción.
6. Ejecutar pruebas de navegación Docente/Director, móvil, descarga y generación tras el cambio.
7. Mantener la auditoría OWASP ASVS completa como PENDIENTE: este hallazgo no sustituye pentest, pruebas de autorización, aislamiento, secretos, almacenamiento ni pruebas físicas.

## Riesgo de regresión

**ALTO si se elimina `'unsafe-inline'` sin refactor previo**, porque los botones con manejadores inline dejarían de ejecutar acciones. La corrección debe ser incremental y acompañada de E2E.

## Impacto en indicadores

- **IUD:** impacto indirecto; una corrección abrupta puede romper navegación.
- **ICGD:** sin impacto pedagógico directo.
- **IFR:** impacto de seguridad/robustez; no se calcula puntaje definitivo.
- **ISU:** sin puntaje definitivo; debe preservarse la simplicidad al refactorizar.
- **Prelaunch:** hallazgo abierto dentro del gate de seguridad V5.

## Estado de pruebas no ejecutables en esta ronda

PENDIENTE: pentest real, navegador E2E, CSP Report-Only con telemetría, dispositivo móvil físico, autenticación/autorización, aislamiento multiusuario y restore real.
