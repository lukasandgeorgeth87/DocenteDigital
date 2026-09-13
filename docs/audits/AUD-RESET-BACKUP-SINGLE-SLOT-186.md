# AUD-RESET-BACKUP-SINGLE-SLOT-186 — Restablecimientos sucesivos y copia recuperable

## Estado canónico
Hallazgo original confirmado el 2026-09-05. Corrección implementada posteriormente en `storage-recovery-v26.js` v26.3. La corrección está validada a nivel de implementación; la recuperación E2E en navegador/dispositivo real continúa PENDIENTE y el gate V5 general permanece BLOQUEADO.

## Especificaciones obligatorias
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

No se aplica en este hallazgo una norma curricular/administrativa MINEDU concreta; no se declara vigencia normativa externa nueva.

## Módulo
Configuración → Restablecer datos → persistencia y recuperación local.

## ID de prueba
`AUD-RESET-BACKUP-SINGLE-SLOT-186`

## Prueba A — segundo restablecimiento con copia anterior pendiente

**Entrada:** estado A persistido → Restablecer → no Restaurar ni Descartar → crear/guardar estado B → intentar Restablecer nuevamente.

**Resultado esperado:** la copia recuperable A no debe sobrescribirse. El segundo restablecimiento debe bloquearse hasta que el usuario restaure o descarte explícitamente la copia anterior.

**Resultado obtenido originalmente:** la versión anterior utilizaba una única clave `docenteDigitalPrototype_reset_backup` y escribía una copia nueva sin comprobar si existía otra pendiente. La copia A podía ser sustituida por B.

**Resultado original:** **NO PASA**.

**Clasificación original:** **PARCIALMENTE FUNCIONAL / ROTA para dos restablecimientos pendientes**.

**Severidad histórica corregida:** **S0 BLOQUEANTE**, porque V3 clasifica la pérdida irreversible como S0. El informe inicial la dejó en S1 por requerir dos confirmaciones explícitas; esa justificación era insuficiente frente a la taxonomía de V3.

**Causa raíz:** respaldo de ranura única sin guardia previa contra sobrescritura.

## Corrección aplicada
`storage-recovery-v26.js` v26.3 consulta `RESET_BACKUP_KEY` antes de permitir un nuevo restablecimiento:

- si existe una copia pendiente, cancela el segundo restablecimiento y vuelve a ofrecer Restaurar/Descartar;
- si falla la comprobación del backup, cancela la operación de forma conservadora;
- si falla la creación del nuevo backup, conserva el estado principal y cancela el restablecimiento.

**Estado posterior:** **CORREGIDO EN IMPLEMENTACIÓN; E2E REAL PENDIENTE**.

## Prueba B — fallo al comprobar backup pendiente
**Entrada:** `localStorage.getItem(RESET_BACKUP_KEY)` lanza una excepción antes de restablecer.

**Esperado:** no borrar el estado principal.

**Obtenido en v26.3:** `try/catch` muestra un aviso y retorna antes de la operación destructiva.

**Resultado:** **PASA A NIVEL DE IMPLEMENTACIÓN**.

**Clasificación:** **FUNCIONAL EN IMPLEMENTACIÓN; navegador real con Storage restringido PENDIENTE**.

## Prueba C — fallo al crear el backup
**Entrada:** el estado principal existe pero `setItem` para `RESET_BACKUP_KEY` falla por cuota/permisos.

**Esperado:** no borrar el estado principal.

**Obtenido:** la excepción cancela el restablecimiento y conserva `docenteDigitalPrototype`.

**Resultado:** **PASA A NIVEL DE IMPLEMENTACIÓN; E2E PENDIENTE**.

## Evidencia
- `storage-recovery-v26.js` v26.3 conserva una sola `RESET_BACKUP_KEY`, pero ahora impide explícitamente sobrescribir una copia pendiente y falla de forma cerrada ante errores de lectura/escritura.
- V4 exige recuperación segura del trabajo.
- V5 exige probar persistencia, recuperación, interrupciones y restauración real; el código por sí solo no cierra esas pruebas.

## Evidencia posterior de despliegue y smoke — 2026-09-12
- GitHub `main` quedó en `b4240eb3466bb9b8d96c2c374f09909fc3ef34c0` tras consolidar el hallazgo canónico y retirar el duplicado 265.
- Vercel desplegó ese SHA como `dpl_5aP48QA7pEsW1YAiffFqbCd5dF5a`, estado `READY`, target `production`.
- La URL canónica `https://docente-digital.vercel.app/` respondió HTTP 200.
- Vercel no reportó errores runtime en la ventana de una hora revisada.
- GitHub Actions `Prelaunch Smoke` run #269 (`34728145645`) terminó `completed / success` exactamente sobre `b4240eb3466bb9b8d96c2c374f09909fc3ef34c0`.

Esta evidencia cierra únicamente la comprobación técnica de despliegue/smoke que estaba pendiente en la ronda anterior. **No convierte la recuperación en PASA E2E**: siguen pendientes navegador real, recarga/cierre, almacenamiento restringido/cuota llena, móvil físico y verificación íntegra de Restaurar/Descartar.

## Evidencia adicional — Prelaunch Smoke #270
- GitHub Actions `Prelaunch Smoke` run #270 (`34732398003`) terminó `completed / success` exactamente sobre `329c674dcbb85e0799bc06e107b14d57e43d3a8a`, commit `audit: append confirmed smoke evidence for reset backup 186`.
- Vercel desplegó ese mismo SHA como `dpl_Fjyui9iEbgnVE1nnYCcSwRR11rZk`, estado `READY`, target `production`.
- La URL canónica respondió HTTP 200 después del despliegue y Vercel no registró errores runtime en la hora revisada.

**Interpretación de esta evidencia:** PASA el smoke técnico del SHA 329c674d y la disponibilidad HTTP del despliegue. Esto no cambia el estado funcional de recuperación: la prueba E2E real continúa PENDIENTE conforme a V3/V5.

## Retest obligatorio antes de cerrar definitivamente
1. A → Restablecer → Restaurar A.
2. A → Restablecer → recargar/cerrar/abrir → Restaurar A.
3. A → Restablecer → crear B → segundo Restablecer: debe bloquearse y A debe permanecer íntegra.
4. A → Restablecer → Descartar copia → Restablecer B: debe permitirse solo después del descarte explícito.
5. Forzar fallo de `getItem` sobre la clave de recuperación: A no debe borrarse.
6. Forzar fallo de `setItem`/cuota llena al crear backup: A no debe borrarse.
7. Ejecutar en móvil físico y con interrupción/cierre de pestaña.
8. Confirmar asset productivo, Vercel READY y HTTP 200 tras cualquier cambio relacionado.

## Riesgo de regresión
**Medio-bajo.** La protección está localizada en la acción destructiva; vigilar bloqueo permanente por backup inválido, visibilidad/accesibilidad del aviso y restauración tras recarga.

## Impacto
- **IUD:** mejora esperable al impedir sobrescritura, sin puntaje definitivo.
- **ICGD:** mejora integridad local, sin puntaje definitivo.
- **IFR / ISU / Prelaunch Score:** NO CALCULADOS por falta de pruebas reales obligatorias.
- **Prelaunch:** este defecto histórico está corregido en implementación, pero el gate general continúa BLOQUEADO por pruebas esenciales y otros hallazgos abiertos.
