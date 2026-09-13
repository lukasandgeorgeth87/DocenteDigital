# AUD-STORAGE-RECOVERY-BOOTSTRAP-266

Fecha de revisión inicial: 2026-09-12 (hora local Perú)
Revalidación: 2026-09-13 (hora local Perú)

## Alcance

Auditoría de resiliencia de persistencia/recuperación conforme a V3, V4 y V5, con foco en almacenamiento local bloqueado o inaccesible. No se considera prueba física de navegador/dispositivo.

## Hallazgo inicial

`storage-recovery-v26.js` protegía varios fallos de escritura, pero quedaban lecturas directas que podían abortar el bootstrap o la acción Restablecer cuando `localStorage.getItem()` lanzaba una excepción.

### AUD-STORAGE-266-A — bootstrap con lectura bloqueada

- **Entrada:** navegador donde `localStorage.getItem(DELETE_BACKUP_KEY)` lanza una excepción durante `initSafety()`.
- **Resultado esperado:** conservar estado, advertir y no romper silenciosamente el bootstrap de seguridad.
- **Resultado previo:** lectura directa sin manejo suficiente.
- **Estado previo:** NO PASA.
- **Clasificación:** PARCIALMENTE FUNCIONAL.
- **Severidad:** S2 ALTO.
- **Corrección aplicada:** commit `90118f8f8f3064e5b471d84ef7dc42c80947bde4`.

### AUD-STORAGE-266-B — Restablecer con lectura principal bloqueada

- **Entrada:** pulsar Restablecer cuando `localStorage.getItem(KEY)` lanza una excepción.
- **Resultado esperado:** cancelar, explicar que no puede verificarse el estado y preservar los datos.
- **Resultado previo:** excepción antes de crear/verificar backup.
- **Estado previo:** NO PASA.
- **Clasificación:** PARCIALMENTE FUNCIONAL.
- **Severidad:** S2 ALTO.
- **Corrección inicial:** commit `abbe52b6e6dde36c780d2d55e75fa861eded367e`, capa v26.5.

## Revalidación de integración — AUD-STORAGE-266-C

La revisión integrada detectó que `storage-access-guard-v71.js`, cargado después de `storage-recovery-v26.js`, sustituía `Storage.prototype.getItem()` y convertía errores de acceso bloqueado (`SecurityError`, `InvalidStateError`, `NotAllowedError`) en `null`.

Eso hacía ambiguo `null`: podía significar tanto “la clave no existe” como “el navegador no permite leerla”. En v26.5, la ruta destructiva de Restablecer contenía `if(current===null)return previous.apply(this,arguments)`, de modo que una lectura bloqueada normalizada a `null` podía delegar en el `resetDemo()` original sin crear el backup recuperable de la capa v26.5. En la eliminación de unidades ocurría un riesgo equivalente al comprobar el backup pendiente y al leer el estado previo.

- **ID:** AUD-STORAGE-266-C.
- **Entrada:** Storage con lectura bloqueada; la guardia v71 captura el error y devuelve `null`; el usuario intenta Restablecer o Eliminar una unidad.
- **Resultado esperado:** distinguir “clave ausente” de “lectura inaccesible” y cancelar de forma fail-closed cualquier operación destructiva si no puede verificarse el estado.
- **Resultado previo:** NO PASA EN INTEGRACIÓN ESTÁTICA.
- **Clasificación previa:** PARCIALMENTE FUNCIONAL.
- **Severidad:** S2 ALTO. No se eleva a S0 porque no se demostró pérdida irreversible en navegador real.
- **Causa raíz:** contratos incompatibles entre dos capas de resiliencia: una necesitaba recibir la excepción y otra la convertía globalmente a `null`.

## Corrección 2026-09-13 — v26.6

Commit funcional: `d672454551f303d1e9cf78fe906f904023643a59` — `fix: keep destructive storage reads fail-closed`.

La corrección es deliberadamente local y reversible:

1. `storage-recovery-v26.js` captura antes de cargar la guardia v71 una referencia a `Storage.prototype.getItem` como `nativeGetItem`.
2. Introduce `strictGetItem(key)`, que usa esa referencia nativa.
3. Las comprobaciones previas a **Restablecer** usan `strictGetItem(KEY)` y `strictGetItem(RESET_BACKUP_KEY)`.
4. Las comprobaciones previas a **Eliminar unidad** usan `strictGetItem(DELETE_BACKUP_KEY)` y `strictGetItem(KEY)`.
5. Si el navegador bloquea esas lecturas estrictas, la excepción vuelve a llegar a los `catch` ya existentes y la operación destructiva se cancela con aviso al usuario.
6. La guardia v71 sigue intacta para lecturas normales de la aplicación; no se cambió globalmente su contrato tolerante.

### Resultado posterior por inspección de wiring

- **AUD-STORAGE-266-C / Restablecer:** PASA EN IMPLEMENTACIÓN. Una lectura bloqueada ya no puede transformarse en `null` por v71 antes de la decisión destructiva; el `catch` de v26.6 cancela la operación.
- **AUD-STORAGE-266-D / Eliminar unidad:** PASA EN IMPLEMENTACIÓN. Las dos lecturas críticas previas al borrado utilizan lectura estricta y cancelan si el almacenamiento no es verificable.
- **Clasificación actual:** FUNCIONAL EN IMPLEMENTACIÓN / E2E REAL PENDIENTE.
- **Severidad residual:** S2 PENDIENTE DE PRUEBA REAL, no porque exista un fallo estático conocido después del parche, sino porque V5 exige demostrar el comportamiento en navegador/dispositivo real.

## Evidencia posterior

- Producción carga `storage-recovery-v26.js` antes de `storage-access-guard-v71.js`, por lo que la referencia nativa se captura antes de la envoltura global.
- Vercel deployment `dpl_91FqsUGoi1zQ68k4Qzdb4JMbqaga` está `READY`, target `production`, asociado exactamente a `d672454551f303d1e9cf78fe906f904023643a59`.
- `https://docente-digital.vercel.app/` respondió HTTP 200 después del despliegue.
- `https://docente-digital.vercel.app/storage-recovery-v26.js` respondió HTTP 200 y sirve `v26.6`, `nativeGetItem`, `strictGetItem` y las lecturas estrictas en Restablecer/Eliminar.
- GitHub Actions **Prelaunch Smoke #276**, run `34742847026`, terminó `completed / success` exactamente sobre `d672454551f303d1e9cf78fe906f904023643a59`.

HTTP 200, READY y el smoke técnico no sustituyen la prueba funcional E2E real.

## Pruebas pendientes obligatorias

- navegador real con Storage bloqueado por privacidad/política;
- Restablecer con lectura bloqueada y comprobar que no elimina datos;
- Eliminar unidad con lectura bloqueada y comprobar que no elimina datos;
- clave realmente inexistente para confirmar que no se confunde con acceso bloqueado;
- cuota agotada real;
- recarga y cierre/reapertura;
- recuperación de unidad con backup pendiente;
- restauración del estado completo;
- móvil físico económico y gama media.

Estas pruebas no se sustituyen con inspección estática, smoke ni HTTP 200.

## Riesgo de regresión

Bajo-medio. La modificación está limitada a la capa de recuperación y a lecturas previas a acciones destructivas. No se alteró globalmente `Storage.prototype.getItem()` ni la política tolerante de v71. Debe vigilarse especialmente que un navegador con Storage bloqueado no permita Restablecer/Eliminar y que un Storage accesible sin clave siga funcionando normalmente.

## Impacto en métricas

- IUD: mejora esperada al evitar que una acción destructiva continúe cuando el estado no puede verificarse; no cuantificado.
- ICGD: sin cambio demostrado.
- IFR: mejora técnica de resiliencia; no cuantificada hasta E2E real.
- ISU: no calculado.
- Prelaunch: persistencia/recuperación sigue bloqueada hasta pruebas reales esenciales.

## Gate

V5 continúa BLOQUEADO. Este informe no autoriza lanzamiento y no se calcula Prelaunch Score definitivo.