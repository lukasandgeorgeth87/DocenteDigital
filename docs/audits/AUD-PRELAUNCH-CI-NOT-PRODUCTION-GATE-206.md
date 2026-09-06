# AUD-PRELAUNCH-CI-NOT-PRODUCTION-GATE-206

## Resumen

**Severidad:** S1 CRÍTICO — bloqueante V5  
**Estado:** NO PASA  
**Clasificación:** CI técnico = FUNCIONAL; gate de publicación = ROTO / NO DEMOSTRADO  
**Módulo:** CI/CD · Publicación controlada · Prelaunch Gate

## Especificaciones obligatorias aplicadas

Esta prueba se ejecuta conjuntamente contra:

- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

V5 exige ejecutar pruebas mínimas antes de cada publicación y establece expresamente que si falla una función crítica, **NO PUBLICAR**. También exige separar desarrollo, pruebas y producción y mantener rollback rápido.

## ID de prueba

`AUD-PRELAUNCH-CI-NOT-PRODUCTION-GATE-206`

## Entrada

1. Revisar el workflow `.github/workflows/prelaunch-smoke.yml`.
2. Revisar el último push a `main`, su GitHub Actions run y su deployment Vercel.
3. Buscar un run histórico de `Prelaunch Smoke` con conclusión `failure`.
4. Verificar si el mismo SHA fallido fue desplegado como `target: production` y recibió el alias canónico.

## Resultado esperado

El flujo de publicación debe garantizar:

`cambio -> pruebas -> todas las pruebas críticas PASAN -> promoción a producción`

Si el smoke/prelaunch falla, ese SHA no debe convertirse en producción ni recibir `docente-digital.vercel.app`.

## Resultado obtenido

### Evidencia A — el workflow existe y actualmente pasa

El repositorio contiene `.github/workflows/prelaunch-smoke.yml`, ejecutado en `push` y `pull_request` sobre `main`. Comprueba especificaciones, sintaxis JS, assets, wiring de módulos críticos y declara explícitamente que es solo un smoke técnico; no valida móvil físico, Word/PDF real, usuarios, backend, OWASP ASVS, restore, IA semántica, concurrencia ni pilotos.

El último run inspeccionado para SHA `9a9f85158ae1b7039349c5e93407af57838b4123` terminó `success`.

### Evidencia B — Vercel publica antes de que termine el smoke

Para el mismo SHA `9a9f85158ae1b7039349c5e93407af57838b4123`:

- Vercel creó el deployment `dpl_9y5JtD5Ncre8WBzXZcu43Tsn9DgY` a las `2026-09-06T19:34:52.061Z`.
- quedó `READY` a las `2026-09-06T19:34:56.235Z`.
- GitHub Actions inició `2026-09-06T19:34:52Z` y terminó recién `2026-09-06T19:35:01Z`.

Por tanto, el deployment estaba READY aproximadamente cinco segundos antes de conocerse el resultado final del smoke.

### Evidencia C — existe un caso histórico donde el smoke FALLÓ y el mismo SHA fue producción

GitHub Actions registra un run `Prelaunch Smoke` fallido para:

- SHA: `32593b18458761e69c7687e2c690ef319993971a`
- inicio: `2026-09-02T21:44:44Z`
- fin: `2026-09-02T21:45:00Z`
- conclusión: `failure`

Vercel registra para ese mismo SHA:

- deployment: `dpl_HxWn314RMCZ9c3cf7wfFCbdzoSLM`
- `target: production`
- creado: `2026-09-02T21:44:44.728Z`
- READY: `2026-09-02T21:44:47.880Z`
- aliases asignados: `docente-digital.vercel.app`, `docente-digital-jorgeluispalma87-7403.vercel.app`, `docente-digital-git-main-jorgeluispalma87-7403.vercel.app`

Esto demuestra que el smoke no funciona como barrera de promoción: un commit cuyo check terminó en `failure` llegó efectivamente a producción y recibió el alias canónico.

## PASA / NO PASA

**NO PASA**

## Clasificación funcional

- GitHub Actions `Prelaunch Smoke`: **FUNCIONAL como smoke técnico**.
- Validación de wiring de módulos críticos: **FUNCIONAL en el CI actual**.
- Orden prueba antes de publicar: **ROTO**.
- Gate automático que impide producción cuando falla CI: **INEXISTENTE / NO DEMOSTRADO**.
- Cumplimiento V5 `si falla una función crítica: NO PUBLICAR`: **ROTO**.

## Causa raíz

La integración Git de Vercel despliega automáticamente los pushes a `main` como producción en paralelo con GitHub Actions. El workflow actual no controla la promoción del alias de producción ni hay evidencia de una barrera que espere su resultado.

## Acción correctiva requerida

No aplicar un parche superficial al YAML. La corrección debe cambiar el contrato de publicación:

1. dejar de promover automáticamente cada push de `main` a producción antes del gate;
2. ejecutar smoke + pruebas críticas en PR/preview;
3. exigir checks requeridos antes de merge/promoción;
4. promover a producción únicamente un SHA que tenga los checks obligatorios en verde;
5. añadir prueba automática que confirme que el SHA de producción coincide con el SHA aprobado;
6. mantener rollback probado;
7. ampliar progresivamente el gate con pruebas reales exigidas por V5, manteniendo como PENDIENTES las que requieran dispositivos/usuarios/restore/seguridad real.

Una alternativa válida es desplegar previews automáticamente y promover a producción solo mediante un workflow posterior a CI exitoso. La decisión exacta depende de la configuración de Vercel/GitHub y debe hacerse sin interrumpir producción actual.

## Corrección directa

**No aplicada.** Cambiar el mecanismo de promoción de producción afecta CI/CD y la disponibilidad del servicio; no es un cambio pequeño y reversible que deba hacerse sin validar la política de despliegue.

## Evidencia posterior

Pendiente hasta implementar un gate real. La prueba de cierre debe incluir deliberadamente un commit de prueba cuyo check falle y demostrar que **NO** recibe el alias canónico de producción.

## Riesgo de regresión

**Alto** si se cambia la integración de despliegue sin preview/promoción/rollback correctamente configurados.  
**Muy alto si no se corrige:** cualquier futuro fallo crítico detectado por CI puede quedar públicamente disponible durante minutos o hasta el siguiente deploy correctivo.

## Impacto en indicadores

- **IUD:** afecta confiabilidad de publicación; no calcular valor definitivo.
- **ICGD:** indirecto; una regresión pedagógica/directiva puede publicarse aun si el smoke la detecta.
- **IFR:** impacto negativo directo en confiabilidad operacional.
- **ISU:** sin puntuación; una regresión publicada puede degradar UX aunque CI la detecte.
- **Prelaunch:** **BLOQUEADO** por incumplimiento explícito del gate V5.

## Normativa externa

Este hallazgo no requiere declarar vigente ninguna norma MINEDU/UGEL externa. Se sustenta en las especificaciones internas V2–V5 y en evidencia real de GitHub Actions + Vercel.

## Estado de lanzamiento

DocenteDigital **NO está aprobada para lanzamiento V1.0** mientras permanezca este bloqueante y los demás S0/S1 abiertos o falten las pruebas reales esenciales de V5.
