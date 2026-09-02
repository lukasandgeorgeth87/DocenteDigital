# AUD-SEC-HEADERS-084 — Cabeceras HTTP básicas de seguridad

## Módulo
Infraestructura / seguridad HTTP / producción Vercel.

## Especificaciones aplicadas
- AUDITORIA_MAESTRA_INTEGRAL_V2.md
- ADENDA_AUDITORIA_EJECUTABLE_V3.md
- AUDITORIA_SIMPLICIDAD_USO_V4.md
- AUDITORIA_PRELANZAMIENTO_V5.md
- NUCLEO_IA_DOCENTEDIGITAL.md

## Prueba
**ID:** AUD-SEC-HEADERS-084  
**Entrada:** solicitar `https://docente-digital.vercel.app/` e inspeccionar cabeceras HTTP.  
**Esperado:** HTTPS y cabeceras básicas de endurecimiento que no rompan el prototipo actual.  
**Obtenido antes:** Vercel servía HSTS, pero no se observaron `X-Content-Type-Options`, `X-Frame-Options` ni `Referrer-Policy`.  
**Resultado inicial:** NO PASA.  
**Severidad:** S3 MEDIO.  
**Clasificación:** PARCIALMENTE FUNCIONAL (endurecimiento HTTP incompleto; no equivale a vulnerabilidad demostrada ni a auditoría OWASP completa).

## Causa raíz
No existía `vercel.json` con una política explícita de cabeceras para las respuestas estáticas.

## Corrección segura aplicada
Se añadió `vercel.json` con:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: no-referrer`

No se añadió una CSP estricta en este cambio porque la aplicación aún usa `onclick` e scripts inline. Imponerla sin refactor y prueba de navegador podría romper funciones principales. CSP queda como trabajo posterior de endurecimiento y debe probarse realmente.

## Evidencia posterior
- Commit funcional: `35b44527f6bd053291ff5243f2ac89dd99c44f56`.
- Deployment Vercel: `dpl_CPRkVFZRFAFABes2AQ3dBywebyq6`.
- Estado observado: `READY`, target `production`.
- Respuesta de producción posterior: HTTP `200 OK`.
- Cabeceras observadas posteriormente: `x-content-type-options: nosniff`, `x-frame-options: DENY`, `referrer-policy: no-referrer`, además de HSTS servido por Vercel.

## Retest
**Resultado:** PASA para estas tres cabeceras y para disponibilidad técnica posterior al cambio.

## Fuente técnica
Configuración oficial de headers de Vercel mediante `vercel.json`: https://vercel.com/docs/caching/cdn-cache

## Riesgo de regresión
Bajo. Las tres cabeceras no cambian la lógica de negocio ni almacenamiento. `X-Frame-Options: DENY` impide embeber DocenteDigital en iframes; si en el futuro existe una integración legítima embebida, deberá revisarse explícitamente.

## Impacto en métricas/gates
- IUD: sin impacto pedagógico directo.
- ICGD: sin impacto directivo directo.
- IFR: mejora técnica parcial de endurecimiento HTTP.
- ISU: sin cambio esperado.
- Prelaunch: reduce un riesgo técnico, pero NO cierra el gate de seguridad V5.

## Pendientes V5 relacionados
Continúan PENDIENTES y no simulados: OWASP ASVS, autenticación, autorización, sesiones, privacidad, aislamiento multiusuario, backend/base de datos, secretos, pruebas de penetración, restore real, dispositivos físicos y demás pruebas esenciales de V5.
