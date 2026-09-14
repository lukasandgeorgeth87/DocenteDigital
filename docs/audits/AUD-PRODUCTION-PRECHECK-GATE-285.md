# AUD-PRODUCTION-PRECHECK-GATE-285

## Estado

**ALIAS / AMPLIACIÓN DE AUD-CICD-GATE-160 · NO CONTAR COMO HALLAZGO INDEPENDIENTE**

Fecha de reconciliación: 2026-09-14.

## Dictamen

La evidencia registrada inicialmente bajo `AUD-PRODUCTION-PRECHECK-GATE-285` describe el mismo defecto ya abierto y confirmado como `AUD-CICD-GATE-160`: la integración GitHub→Vercel puede publicar un push de `main` en producción antes de que termine `Prelaunch Smoke`, y `main` no tiene protección/checks requeridos que conviertan el smoke en una barrera preventiva.

Por tanto, `AUD-285` se conserva únicamente como referencia histórica y ampliación de evidencia. **No debe sumarse nuevamente como S1 independiente** en conteos, métricas, IFR, ISU ni Prelaunch.

## Hallazgo canónico

Usar como expediente principal:

`docs/audits/AUD-CICD-GATE-160.md`

Clasificación canónica:

- **PASA/NO PASA:** NO PASA.
- **Estado funcional:** PARCIALMENTE FUNCIONAL.
- **Severidad:** S1 CRÍTICO.
- **Gate V5:** BLOQUEADO.

## Evidencia adicional aportada por 285

Para el commit `167ec0fee10e1c735f2478c90ccd731bcb366b11`:

- GitHub Actions `Prelaunch Smoke` run `34883269971` finalizó con `success` a `2026-09-14T18:50:48Z`.
- Vercel deployment `dpl_Gta56NwnwZQooEuipA8i1DHqUanY` quedó `READY` a `2026-09-14T18:50:39.112Z`.
- Producción estuvo READY aproximadamente 9 segundos antes de existir resultado exitoso del smoke.

La rama `main` fue revalidada el 2026-09-14 con:

- `protected=false`;
- `protection.enabled=false`;
- `required_status_checks.enforcement_level=off`;
- `contexts=[]`;
- `checks=[]`.

El workflow `.github/workflows/prelaunch-smoke.yml` sigue ejecutándose en `push` y `pull_request`, y declara expresamente que es solo un `technical smoke gate`.

## Acción correctiva

La misma definida en `AUD-CICD-GATE-160`:

1. usar PR/preview para validar cambios;
2. exigir checks requeridos antes de merge/promoción;
3. proteger `main` o aplicar ruleset equivalente;
4. promover a producción solo después de checks exitosos;
5. mantener staging/preview separado;
6. comprobar rollback real;
7. mantener pruebas físicas, OWASP, restore, usuarios y pilotos como pendientes hasta evidencia real.

## Regla de conteo

Para el informe acumulativo:

- `AUD-CICD-GATE-160` = hallazgo canónico S1.
- `AUD-PRODUCTION-PRECHECK-GATE-285` = alias/evidencia adicional.
- No contar ambos como dos defectos.

No se tocó `CUSCO-DECIDE-ELECCIONES-2026`.
