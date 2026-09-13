# AUD-BIOHUERTO-INVENTED-FAMILY-ACTOR-275

## Alcance

Auditoría focalizada del flujo Unidad/Proyecto bajo `AUDITORIA_MAESTRA_INTEGRAL_V2.md`, `ADENDA_AUDITORIA_EJECUTABLE_V3.md`, `AUDITORIA_SIMPLICIDAD_USO_V4.md`, `AUDITORIA_PRELANZAMIENTO_V5.md` y `NUCLEO_IA_DOCENTEDIGITAL.md`.

Esta ronda no declara vigencia de ninguna norma externa ni aplica una nueva regla legal. El hallazgo se deriva de las especificaciones internas obligatorias de DocenteDigital: no inventar actores, distinguir datos seguros/inferidos/faltantes y conservar la finalidad expresada por el usuario.

## AUD-BIO-275-A — Actor no declarado en caso biohuerto

- **Módulo:** Unidad / Proyecto → comprensión semántica → situación significativa.
- **Entrada:** `Aprenderemos saberes de la siembra de tubérculos y estos conocimientos los aplicaremos para sembrar hortalizas en nuestro biohuerto.`
- **Resultado esperado:** conservar la relación fuente→finalidad (saberes de siembra → aplicación en biohuerto) sin agregar actores que el usuario no mencionó. Si familias, comunidad u otros actores no están expresados, deben permanecer ausentes o claramente pendientes.
- **Resultado obtenido antes de la corrección:** `planning-coherence-v51.js`, dentro del paquete especial `biohuerto`, proponía: `Los estudiantes conocen, por sus familias y su entorno, diversos saberes...`, introduciendo `familias` aunque la entrada de prueba no lo contenía.
- **Evidencia:** función `verifiedPack(raw)` de `planning-coherence-v51.js`, rama `biohuerto`.
- **Estado previo:** **NO PASA**.
- **Clasificación previa:** **PARCIALMENTE FUNCIONAL**.
- **Severidad:** **S2 ALTO**.
- **Causa raíz:** una defensa de regresión específica para el caso biohuerto contenía una formulación fija que bypassaba el principio general de no inventar actores. La corrección focalizada del caso X→Y podía por ello reintroducir una inferencia no sustentada que otras capas territoriales ya intentaban impedir.
- **Acción correctiva aplicada:** sustituir `por sus familias y su entorno` por `por sus experiencias y su entorno`, manteniendo la finalidad, el reto y el producto del biohuerto sin afirmar una fuente familiar no expresada.

## AUD-BIO-275-R1 — Reprueba técnica posterior

- **Entrada:** misma descripción de prueba sin mención de familias.
- **Resultado esperado:** la rama de regresión biohuerto no debe incorporar `familias` como actor.
- **Resultado obtenido:** el código servido en producción contiene `Los estudiantes conocen, por sus experiencias y su entorno...`; la formulación fija `por sus familias y su entorno` ya no existe en esa propuesta.
- **Estado:** **PASA EN IMPLEMENTACIÓN**.
- **Clasificación actual:** **FUNCIONAL EN IMPLEMENTACIÓN / E2E REAL PENDIENTE**.
- **Commit funcional:** `b4e60cd6a7f8712c4b6fc6adb3676d0bfd61d47b` — `fix: avoid invented family actor in biohuerto regression`.
- **Evidencia posterior técnica:** Vercel desplegó el commit funcional como producción `READY`; la raíz canónica respondió HTTP 200; `/planning-coherence-v51.js` respondió HTTP 200 con la formulación corregida; no se observaron errores runtime en la última hora de la comprobación.

## Riesgo de regresión

La formulación neutral evita inventar un actor. Si el usuario sí menciona explícitamente familias, una evolución posterior podría personalizar esta rama usando el perfil semántico estructurado en lugar de una frase fija. No debe reintroducirse una suposición universal de `familias`, `comunidad` u otro actor.

## Pruebas todavía pendientes

La corrección no equivale a validar el flujo completo según V3/V5. Debe probarse en navegador real la entrada completa del biohuerto y verificar título → situación → reto → producto → sesiones → materiales → evaluación → exportación. También siguen pendientes: textos alternativos no codificados, EIB/monolingüe, móvil físico, persistencia tras interrupción, DOCX/PDF/impresión reales, batería de 100 generaciones y anti-alucinación.

## Impacto en indicadores

- **IUD / ICGD:** mejora cualitativa de coherencia semántica y fidelidad a datos expresados; no se asigna puntaje definitivo sin batería trazable.
- **IFR:** reduce una fuente concreta de invención semántica; no se calcula IFR final.
- **ISU:** sin cambio cuantificable; requiere prueba real con usuarios.
- **Prelaunch:** el hallazgo puntual queda corregido en implementación, pero el gate V5 general continúa bloqueado por pruebas reales esenciales pendientes.

## Dictamen

**AUD-BIOHUERTO-INVENTED-FAMILY-ACTOR-275: corregido en implementación, E2E real pendiente.** DocenteDigital no queda aprobada para V1.0 por esta corrección aislada.