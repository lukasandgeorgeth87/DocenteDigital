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

No se pudo confirmar desde la integración actual la configuración de branch protection de `main`: la lectura del endpoint de protección devolvió HTTP 403 por permisos insuficientes. Por ello NO se afirma que `main` carezca de protección; sí queda demostrado que, para el commit observado, Vercel finalizó producción antes que el check.

## Evidencia
- GitHub commit status del SHA auditado: contexto Vercel `success`, `2026-09-04T22:31:05Z`.
- GitHub check-runs del mismo SHA: `static-smoke`, conclusión `success`, final `2026-09-04T22:31:09Z`.
- `.github/workflows/prelaunch-smoke.yml`: triggers `push`/`pull_request` y aviso explícito de alcance limitado.
- Vercel deployment `dpl_8cqvUNL245JsBj5ekr45RF7ZQg6q`: READY, target production, mismo SHA.

## PASA / NO PASA
NO PASA

## Clasificación
PARCIALMENTE FUNCIONAL

Existe automatización smoke útil, pero todavía no actúa como puerta preventiva de producción.

## Severidad
S1 — CRÍTICO para Prelaunch V5.

Justificación: no implica por sí solo fuga/corrupción S0, pero permite publicar una regresión crítica antes de conocer el resultado de la prueba automática. Una puntuación alta o un deployment READY no corrigen ese riesgo.

## Causa raíz
Acoplamiento directo `push a main → deployment productivo` mientras el smoke se ejecuta en paralelo al mismo evento. La comprobación existe, pero no controla la promoción a producción.

## Acción correctiva
Pendiente de decisión de arquitectura/CI-CD. No aplicar un parche cosmético.

Diseño recomendado:
1. trabajar por rama/PR;
2. ejecutar smoke y pruebas críticas sobre PR/preview;
3. exigir checks requeridos antes de merge/promoción;
4. desplegar a producción únicamente después de checks obligatorios exitosos;
5. incorporar progresivamente pruebas V5 reales: Docente, Director, multigrado, Unidad, Proyecto, Sesión, Evaluación, Registro, guardado, buscador, exportación, móvil automatizable, seguridad y normativa;
6. conservar preview/staging separado de production;
7. documentar rollback y verificarlo con ensayo controlado.

La selección exacta entre branch protection, rulesets, promotion workflow o configuración equivalente debe realizarse con permisos administrativos y sin afirmar una configuración no observada.

## Reprueba obligatoria
- Crear un PR con fallo deliberado del smoke y demostrar que NO alcanza producción.
- Crear un PR válido y demostrar secuencia: checks SUCCESS → merge/promoción → Vercel READY.
- Registrar timestamps y SHA.
- Verificar rollback a deployment anterior.
- Verificar que previews no modifiquen production.

## Riesgo de regresión
ALTO. Cualquier cambio futuro puede alcanzar producción antes de que CI detecte sintaxis rota, módulos críticos no cableados u otras regresiones incorporadas al gate.

## Impacto en indicadores
- IUD: no calcular definitivo; impacto indirecto por riesgo de publicar UX rota.
- ICGD: disminuye confianza de despliegue controlado.
- IFR: no calcular definitivo; riesgo directo de regresión funcional publicada.
- ISU: no calcular definitivo.
- Prelaunch: BLOQUEADO hasta demostrar que las pruebas requeridas preceden a la publicación productiva.

## Estado
ABIERTO / PENDIENTE DE ARQUITECTURA CI-CD Y PERMISOS DE REPOSITORIO/VERCEL.
