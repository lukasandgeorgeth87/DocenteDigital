# AUD-ROLE-UX-045 — Navegación coherente con rol explícito

## Especificaciones aplicadas
- `AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `AUDITORIA_PRELANZAMIENTO_V5.md`
- `NUCLEO_IA_DOCENTEDIGITAL.md`

## Prueba
**ID:** AUD-ROLE-UX-045  
**Módulo:** Ficha Maestra / roles / navegación escritorio y móvil  
**Entrada:** guardar `state.userRole = "Docente"` en la Ficha Maestra y navegar por la app.  
**Resultado esperado:** el perfil Docente debe acceder prioritariamente a funciones pedagógicas; el acceso Director no debe aparecer como función propia cuando el usuario eligió exclusivamente Docente. `Docente y Director` debe conservar ambos espacios.  
**Resultado obtenido antes:** la barra lateral mostraba siempre `Director` y el menú móvil `Más` añadía siempre `Director`, sin consultar el rol explícitamente guardado.  
**Evidencia previa:** `index.html`, `institution-master-v46.js`, `mobile-navigation-guard-v60.js`.  
**Estado previo:** NO PASA — PARCIALMENTE FUNCIONAL.  
**Severidad:** S2 (trazabilidad/rol y UX importante; no se clasifica como control de seguridad porque aún no existe autenticación/autorización real).  
**Causa raíz:** la Ficha Maestra registraba el rol, pero la capa de navegación no consumía ese dato.

## Corrección
Se añadió `role-surface-guard-v68.js` y se cargó inmediatamente después de `mobile-navigation-guard-v60.js`.

Comportamiento:
- si el rol explícito es `Docente`, oculta accesos `Director` en escritorio y móvil;
- bloquea navegación directa a `director` y explica cómo cambiar la función en Ficha Maestra;
- si el rol es `Director`, `Docente y Director` o está aún sin definir, no presume restricciones adicionales;
- vuelve a aplicar la superficie tras guardar la Ficha Maestra o cambiar de pantalla;
- declara expresamente que esta guarda es UX y NO sustituye autenticación, autorización ni aislamiento multiusuario.

## Evidencia posterior
- `role-surface-guard-v68.js` publicado en producción: HTTP 200.
- `schedule-prompt-v6.js` publicado en producción: HTTP 200 y contiene `role-surface-guard-v68.js` en el loader estable.
- raíz `https://docente-digital.vercel.app/`: HTTP 200.
- Confirmación administrativa Vercel READY: PENDIENTE; la API de deployments devuelve 403 por falta de autorización del scope del equipo. No se declara READY sin esa evidencia.

## Estado posterior
**PASA la defensa de superficie por rol / PARCIALMENTE FUNCIONAL el sistema de roles.**

## V5 pendiente
Autenticación, autorización real, aislamiento por usuario/IE, escalamiento de privilegios, sesiones y pruebas OWASP ASVS continúan PENDIENTES. Esta corrección no debe interpretarse como un control de seguridad.

## Impacto
- IUD: mejora de navegación y reducción de funciones irrelevantes para Docente.
- ICGD: mejora de coherencia Ficha Maestra → interfaz.
- IFR/ISU/Prelaunch: impacto positivo parcial, sin puntuación definitiva.
- Riesgo de regresión: bajo; la guarda solo actúa cuando el usuario eligió exactamente `Docente`.
