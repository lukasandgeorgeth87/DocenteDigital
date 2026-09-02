# AUD-RUNTIME-WIRING-107 — Integridad de módulos auditados en runtime

## Alcance
Auditoría técnica V2/V3/V4/V5 y Núcleo IA. No introduce ni declara normativa educativa nueva.

## Prueba
- **ID:** AUD-RUNTIME-WIRING-107
- **Módulo:** bootstrap / prelaunch / integración de producción
- **Entrada:** `index.html` + `initial-curriculum-guard-v72.js` comparados con módulos críticos previamente auditados.
- **Resultado esperado:** todo módulo al que se atribuye una corrección crítica debe estar realmente conectado al runtime de producción; si no, el gate de prelaunch debe fallar.
- **Resultado obtenido antes de la corrección del gate:** los archivos existían en `main`, pero el smoke test solo verificaba los assets que ya estaban referenciados. Podía terminar correctamente aunque correcciones auditadas no fueran ejecutadas por producción.
- **Clasificación:** ROTA / PARCIALMENTE FUNCIONAL a nivel de integración de runtime.
- **Estado:** NO PASA.
- **Severidad:** S1 CRÍTICO, porque puede dejar activa lógica anterior en funciones pedagógicas, persistencia, simplicidad y protección contra acciones duplicadas mientras la auditoría atribuye la corrección a producción.

## Evidencia de módulos no conectados
GitHub Actions Prelaunch Smoke run `33686673297`, job `100435687476`, falló específicamente en `Verify audited critical runtime modules are wired to production` y reportó:

- `title-context-v38.js`
- `significant-situation-core-v53.js`
- `institution-master-v46.js`
- `runtime-audit-v23.js`
- `simplicity-audit-v49.js`

como existentes pero **NOT wired to production**.

## Causa raíz
El proyecto fue acumulando guardias y motores como archivos independientes, pero el bootstrap de producción no mantuvo un manifiesto obligatorio de módulos auditados. El control anterior verificaba que los assets ya referenciados existieran, no que todos los módulos críticos que sustentaban hallazgos cerrados estuvieran realmente conectados.

## Corrección segura aplicada
Se añadió al workflow `.github/workflows/prelaunch-smoke.yml` una comprobación explícita de integración de módulos críticos. La publicación ya no puede obtener un smoke verde si esos módulos siguen desconectados.

Commit funcional del gate: `454bbdead1e8cdb42e5e458d784457b21d2840f0`.

## Retest
- GitHub Actions run `33686673297`: **failure esperado** en el nuevo gate, demostrando el defecto real en lugar de ocultarlo.
- Vercel deployment del commit: `dpl_CePyEAkmheeJXjxZsGvpUjhD7Bnr` → **READY**, target `production`.
- Producción `https://docente-digital.vercel.app/` → **HTTP 200**.

`READY` y HTTP 200 solo demuestran despliegue/servicio, no que el gate V5 esté aprobado.

## Acción correctiva pendiente
No cargar automáticamente los cinco módulos sin revisar orden, dependencias y regresiones. Para cerrar el hallazgo se debe:
1. definir un manifiesto/orden de runtime único;
2. integrar cada módulo de forma explícita;
3. ejecutar sintaxis + smoke + pruebas funcionales de sus casos de regresión;
4. comprobar producción y volver a ejecutar el gate hasta obtener PASA.

## Riesgo de regresión
**Alto** si se conectan todos los módulos a ciegas, porque varias guardias envuelven funciones globales y dependen del orden de carga. Por eso en esta auditoría solo se corrigió el gate de evidencia, no se simuló una integración segura.

## Impacto en métricas
- **IUD/ICGD/IFR/ISU:** no deben aumentarse por estas correcciones mientras los módulos no estén ejecutándose en producción y probados.
- **Prelaunch:** bloqueado.
- No se calcula puntaje definitivo sin evidencia real.

## Fuente oficial
No aplica una nueva afirmación normativa MINEDU/UGEL en este hallazgo; es un defecto técnico de integración y evidencia.

## Estado V5
**BLOQUEANTE ABIERTO. DocenteDigital NO está lista para V1.0.**