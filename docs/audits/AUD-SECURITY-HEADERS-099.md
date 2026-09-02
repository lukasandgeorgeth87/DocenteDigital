# AUD-SECURITY-HEADERS-099

## Módulo
Seguridad / producción / cabeceras HTTP

## Especificaciones aplicadas
AUDITORIA_MAESTRA_INTEGRAL_V2, ADENDA_AUDITORIA_EJECUTABLE_V3, AUDITORIA_SIMPLICIDAD_USO_V4 y AUDITORIA_PRELANZAMIENTO_V5.

## Prueba
**ID:** AUD-SECURITY-HEADERS-099

**Entrada:** solicitud HTTP a la producción de DocenteDigital.

**Esperado:** además de las cabeceras ya existentes de protección básica, restringir capacidades del navegador que la aplicación no utiliza actualmente y deshabilitar políticas heredadas de cross-domain.

**Obtenido antes:** X-Content-Type-Options=nosniff, X-Frame-Options=DENY y Referrer-Policy=no-referrer estaban configurados; no existían Permissions-Policy ni X-Permitted-Cross-Domain-Policies.

**Estado inicial:** NO PASA / PARCIALMENTE FUNCIONAL.

**Severidad:** S3 MEDIO. No sustituye autenticación, autorización, CSP, OWASP ASVS ni una auditoría de seguridad real.

## Causa raíz
`vercel.json` solo incluía tres cabeceras básicas.

## Corrección segura aplicada
Se añadieron:

- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `X-Permitted-Cross-Domain-Policies: none`

No se añadió Content-Security-Policy en esta corrección porque la aplicación todavía usa scripts y manejadores inline; imponer una CSP estricta sin refactor previo podría romper funciones productivas.

## Evidencia posterior
Commit funcional: `549cd3182708965079a0b24c1f4817ea9f1f7402`.

La integración Vercel del commit reportó `success` y la producción respondió HTTP 200 incluyendo ambas nuevas cabeceras.

## Resultado posterior
PASA para esta protección puntual.

## Pendientes V5
Seguridad global continúa PENDIENTE: autenticación, autorización, aislamiento entre usuarios/IE, secretos, APIs, backend, almacenamiento, OWASP ASVS, privacidad, pruebas de escalamiento de privilegios, backup/restore e incident response.

## Riesgo de regresión
Bajo. Si en el futuro DocenteDigital necesita cámara, micrófono o geolocalización, la política deberá revisarse de forma explícita y por la ruta mínima necesaria.

## Impacto
Mejora técnica de seguridad del navegador. No modifica ni permite elevar un puntaje definitivo de Prelaunch/ISU/IFR sin las pruebas reales exigidas por V5.
