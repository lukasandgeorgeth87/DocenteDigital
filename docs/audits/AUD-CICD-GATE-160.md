# AUD-CICD-GATE-160 — Producción puede publicarse antes de terminar el Prelaunch Smoke

## Alcance
Auditoría acumulativa V2 + V3 + V4 + V5 + Núcleo IA. Hallazgo técnico de prepublicación/CI-CD. No modifica CUSCO-DECIDE-ELECCIONES-2026.

## ID de prueba
AUD-CICD-GATE-160

## Módulo
CI/CD · Publicación controlada · Prelaunch Gate

## Entrada
1. Tomar un commit enviado a `main`.
2. Observar el deployment automático de Vercel para ese SHA.
3. Observar el check `static-smoke` de GitHub Actions para el mismo SHA.
4. Comparar cronológicamente cuándo producción queda READY/success y cuándo termina el smoke.
5. Comprobar si `main` impide integrar/publicar cambios sin checks obligatorios.

## Resultado esperado
Antes de que un cambio llegue a producción deben finalizar satisfactoriamente las pruebas automáticas mínimas aplicables. V5 exige: “Antes de cada publicación ejecutar automáticamente pruebas mínimas…” y “Si falla una función crítica: NO PUBLICAR”, además de separar desarrollo, pruebas y producción y mantener rollback.

Por tanto, una comprobación ejecutada después o en paralelo al despliegue productivo no constituye una puerta preventiva.

## Resultado obtenido
Para el commit `599a385b83ac6f086a0ce6850fb2ee98899eaccd`:

- Vercel registró estado `success` / “Deployment has completed” a `2026-09-04T22:31:05Z`.
- GitHub Actions `static-smoke` comenzó a `2026-09-04T22:31:04Z` y terminó con `success` a `2026-09-04T22:31:09Z`.

Producción quedó declarada exitosa aproximadamente cuatro segundos antes de que terminara el smoke del mismo commit.

El workflow `.github/workflows/prelaunch-smoke.yml` se dispara en `push` a `main` y `pull_request` a `main`; Vercel también despliega automáticamente los pushes a `main`. No existe en el workflow una etapa que condicione/promueva el deployment productivo después del resultado del smoke.

Además, el workflow declara expresamente que es solo un `technical smoke gate` y que no valida móvil físico, Word/PDF real, usuarios, backend, OWASP ASVS, restore, IA semántica, concurrencia ni pilotos.

### Revalidación 2026-09-11

La integración de GitHub permite ahora observar directamente el estado de la rama `main`. Para `main` se obtuvo:

- `protected: false`;
- `protection.enabled: false`;
- `required_status_checks.enforcement_level: off`;
- `required_status_checks.contexts: []`;
- `required_status_checks.checks: []`.

Por tanto, ya no queda como “no confirmado”: **la rama principal no tiene protección ni checks requeridos activos** en la evidencia actual. El workflow existe y se ejecuta, pero su éxito no es una condición obligatoria para aceptar cambios en `main` ni para impedir que la integración Git de Vercel publique ese push.

Para el SHA actual `bcb672ba3e9e4cc4bfa8e5973f7d848bda3ba865`, el run `Prelaunch Smoke` n.° 224 terminó `success`, y Vercel mantiene el deployment productivo `dpl_9FpHheeUc8E8y7JhKniiHeMY7gBp` en estado `READY`. Esto demuestra que el smoke funciona como comprobación técnica, pero no corrige la falta de una barrera preventiva.

### Revalidación 2026-09-12

Se revalidó el HEAD `303656e0cdce651d08bb69ed23a97abc4271470f`.

- Vercel despliega ese SHA directamente como `target: production` mediante `dpl_J6HtcbPpZyWvLnxZAb15HZtCgDLF`, actualmente `READY`.
- La URL canónica `https://docente-digital.vercel.app/` responde HTTP 200 y sirve ese estado productivo.
- GitHub Actions ejecutó por separado `Prelaunch Smoke` n.° 251 sobre el mismo SHA; terminó `completed/success`.
- El estado combinado del commit muestra `Vercel: success`, pero esta evidencia no demuestra que el smoke sea un check requerido previo a la publicación productiva.

Por tanto, el hallazgo **permanece abierto**: la automatización smoke es útil, pero sigue sin demostrarse una secuencia obligatoria `preview/pruebas → checks requeridos → promoción a producción`. Un resultado exitoso del smoke no convierte por sí mismo el flujo actual en una puerta preventiva V5.

## Evidencia
- GitHub branch `main`: `protected=false`, protección deshabilitada y sin required status checks.
- `.github/workflows/prelaunch-smoke.yml`: triggers `push`/`pull_request` y aviso explícito de alcance limitado.
- GitHub Actions run n.° 224 del SHA `bcb672ba3e9e4cc4bfa8e5973f7d848bda3ba865`: `completed/success`.
- Evidencia histórica del SHA `599a385b83ac6f086a0ce6850fb2ee98899eaccd`: Vercel producción finalizó antes del check `static-smoke`.
- Revalidación 2026-09-12: deployment productivo `dpl_J6HtcbPpZyWvLnxZAb15HZtCgDLF` sobre SHA `303656e0cdce651d08bb69ed23a97abc4271470f`, estado `READY`; URL canónica HTTP 200; `Prelaunch Smoke` n.° 251 `completed/success`.

## PASA / NO PASA
NO PASA

## Clasificación
PARCIALMENTE FUNCIONAL

Existe automatización smoke útil, pero todavía no actúa como puerta preventiva de producción.

## Severidad
S1 — CRÍTICO para Prelaunch V5.

Justificación: no implica por sí solo fuga/corrupción S0, pero permite publicar una regresión crítica antes de conocer o exigir el resultado de la prueba automática. Una puntuación alta o un deployment READY no corrigen ese riesgo.

## Causa raíz
Acoplamiento directo `push a main → deployment productivo` mientras el smoke se ejecuta sobre el mismo evento, combinado con una rama `main` sin protección ni checks requeridos. La comprobación existe, pero no controla la integración/promoción a producción.

## Acción correctiva
Pendiente de decisión de arquitectura/CI-CD. No aplicar un parche cosmético.

Diseño recomendado:
1. trabajar por rama/PR;
2. ejecutar smoke y pruebas críticas sobre PR/preview;
3. proteger `main` y exigir checks requeridos antes de merge/promoción;
4. desplegar a producción únicamente después de checks obligatorios exitosos;
5. incorporar progresivamente pruebas V5 reales: Docente, Director, multigrado, Unidad, Proyecto, Sesión, Evaluación, Registro, guardado, buscador, exportación, móvil automatizable, seguridad y normativa;
6. conservar preview/staging separado de production;
7. documentar rollback y verificarlo con ensayo controlado.

La activación exacta de branch protection/rulesets y de una promoción productiva condicionada requiere permisos administrativos y debe probarse con un fallo deliberado antes de declarar corregido el hallazgo.

## Reprueba obligatoria
- Crear un PR con fallo deliberado del smoke y demostrar que NO puede fusionarse/promoverse a producción.
- Crear un PR válido y demostrar secuencia: checks SUCCESS → merge/promoción → Vercel READY.
- Registrar timestamps y SHA.
- Verificar rollback a deployment anterior.
- Verificar que previews no modifiquen production.

## Riesgo de regresión
ALTO. Cualquier cambio futuro puede alcanzar producción sin que GitHub exija el resultado del smoke y antes de que CI detecte sintaxis rota, módulos críticos no cableados u otras regresiones incorporadas al gate.

## Impacto en indicadores
- IUD: no calcular definitivo; impacto indirecto por riesgo de publicar UX rota.
- ICGD: disminuye confianza de despliegue controlado.
- IFR: no calcular definitivo; riesgo directo de regresión funcional publicada.
- ISU: no calcular definitivo.
- Prelaunch: BLOQUEADO hasta demostrar que las pruebas requeridas preceden a la publicación productiva.

## Estado
ABIERTO / CONFIRMADO. Pendiente de arquitectura CI/CD, protección de `main`, checks requeridos y promoción productiva condicionada.
