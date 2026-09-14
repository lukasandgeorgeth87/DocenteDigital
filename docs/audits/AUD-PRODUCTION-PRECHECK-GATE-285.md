# AUD-PRODUCTION-PRECHECK-GATE-285

## Estado

**NO PASA · PARCIALMENTE FUNCIONAL · S1 CRÍTICO · BLOQUEANTE V5**

Fecha de evidencia: 2026-09-14.

## Alcance

Control de publicación GitHub → Vercel production, branch `main`, Prelaunch Smoke y puerta V5 previa a producción.

## Especificaciones obligatorias aplicadas

- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

V5 §15 exige ejecutar automáticamente pruebas mínimas **antes de cada publicación**, establece que si falla una función crítica **NO PUBLICAR**, y exige separar desarrollo, pruebas y producción con rollback rápido.

## AUD-REL-285-A — ¿el smoke es una precondición real para producción?

**Entrada:** push al branch `main` del commit `167ec0fee10e1c735f2478c90ccd731bcb366b11` (`audit: append director gate regression evidence`).

**Resultado esperado:** el commit no debe quedar publicado en producción hasta que el conjunto de checks obligatorios haya terminado satisfactoriamente.

**Resultado obtenido:** GitHub Actions `Prelaunch Smoke` se dispara por `push` a `main`, pero Vercel crea en paralelo un deployment con `target=production`. El deployment queda READY antes de que el smoke termine.

**Evidencia temporal concreta:**

- Commit en GitHub: `2026-09-14T18:50:33Z`.
- Prelaunch Smoke run `34883269971`: creado/iniciado `2026-09-14T18:50:36Z`; finalizado con `success` `2026-09-14T18:50:48Z`.
- Vercel deployment `dpl_Gta56NwnwZQooEuipA8i1DHqUanY`: `target=production`, creado `2026-09-14T18:50:36.096Z`, `READY` `2026-09-14T18:50:39.112Z`.
- Por tanto, el commit estuvo READY en producción aproximadamente 9 segundos antes de existir un resultado exitoso del smoke.
- El deployment declara `githubCommitRef=main` y `githubCommitSha=167ec0fee10e1c735f2478c90ccd731bcb366b11`.

**PASA/NO PASA:** NO PASA.

**Severidad:** S1 CRÍTICO para gate de lanzamiento. La existencia del smoke no constituye una puerta preventiva si producción puede quedar activa antes de que el smoke finalice.

## AUD-REL-285-B — ¿main impide integrar cambios sin checks obligatorios?

**Entrada:** inspección del branch `main` mediante GitHub REST.

**Resultado esperado:** la rama que alimenta producción debe tener una política efectiva que impida publicar cambios sin checks requeridos o debe existir otra puerta equivalente previa a la promoción a producción.

**Resultado obtenido:** `main` aparece con `protected=false`; `protection.enabled=false`; `required_status_checks.enforcement_level=off`; `contexts=[]`; `checks=[]`.

**PASA/NO PASA:** NO PASA.

**Severidad:** S1 CRÍTICO para prelaunch/release governance.

## AUD-REL-285-C — ¿el workflow actual demuestra la condición V5 completa?

**Entrada:** `.github/workflows/prelaunch-smoke.yml`.

**Resultado esperado:** pruebas automáticas suficientemente amplias y utilizadas como precondición de publicación.

**Resultado obtenido:** el workflow ejecuta validaciones estáticas útiles (existencia de especificaciones, sintaxis JS, merge markers, archivos de entrada, referencias de assets y wiring de módulos). El propio workflow declara que es solo un `technical smoke gate` y que **no valida** dispositivos físicos, Word/PDF real, usuarios, backend, OWASP ASVS, restore, IA semántica, concurrencia ni pilotos. Además se ejecuta tanto en `pull_request` como en `push`, pero el push a `main` ya dispara producción en paralelo.

**PASA/NO PASA:** PARCIAL / NO PASA como gate V5 de publicación.

**Severidad:** S1 por la falta de una puerta preventiva; las pruebas físicas/usuarios siguen PENDIENTES por definición y no deben simularse.

## Causa raíz

La integración GitHub→Vercel promueve automáticamente cada commit de `main` a `production`, mientras `Prelaunch Smoke` corre en paralelo después del push. `main` no tiene protección/check requerido que convierta el smoke en condición previa de entrada a la rama productiva. Se confunde "tener CI" con "tener un release gate".

## Acción correctiva requerida

No aplicar un parche de código cliente: la corrección correcta es de control de entrega.

1. Dejar de usar un push directo a `main` como publicación inmediata sin gate.
2. Exigir PR/checks antes de integrar a la rama productiva o implementar una promoción explícita a producción solo después de checks exitosos.
3. Configurar protección/ruleset equivalente para impedir integración cuando falle `Prelaunch Smoke` y las pruebas automáticas críticas que se incorporen.
4. Mantener preview/staging para pruebas y producción separada.
5. Incorporar progresivamente pruebas automáticas críticas de Docente, Director, persistencia, exportación, móvil emulado, seguridad técnica y anti-regresión; las pruebas físicas y pilotos deben seguir como evidencia externa pendiente.
6. Verificar rollback real antes del lanzamiento.

No se modifica configuración de GitHub/Vercel automáticamente en esta auditoría porque requiere una decisión explícita de estrategia de despliegue y cambios de plataforma, no un parche pequeño del runtime.

## Reprueba obligatoria

- Abrir PR con un cambio que haga fallar deliberadamente el smoke: debe ser imposible promoverlo a producción.
- Abrir PR con smoke exitoso: debe poder integrarse/promoverse.
- Confirmar que el deployment de producción se crea **después** del check exitoso, no en paralelo.
- Confirmar que preview/staging sigue disponible para validación.
- Confirmar rollback a deployment anterior.
- Mantener pruebas físicas/usuarios/restore/OWASP como PENDIENTES hasta evidencia real.

## Evidencia posterior requerida

Registrar: SHA probado, run de CI, hora de finalización de checks, deployment ID, hora de creación y READY de producción, HTTP 200 y rollback comprobado cuando corresponda.

## Impacto

- **IUD:** sin cálculo definitivo; riesgo indirecto por regresiones publicadas.
- **ICGD:** sin cálculo definitivo; afecta confiabilidad de entrega de funciones docentes/directivas.
- **IFR:** negativo: existe un camino de publicación que no espera la prueba automática.
- **ISU:** no se recalcula; una regresión de producción puede degradarlo.
- **Prelaunch:** bloqueante explícito hasta convertir CI en gate preventivo y completar las demás evidencias reales V5.

## Riesgo de regresión

Alto mientras cualquier push a `main` siga generando production automáticamente sin una condición previa verificable.

## Observación

`READY` y HTTP 200 solo demuestran disponibilidad técnica del deployment; no prueban que una publicación haya pasado previamente todas las verificaciones requeridas ni que DocenteDigital esté lista para V1.0.

No se tocó `CUSCO-DECIDE-ELECCIONES-2026`.