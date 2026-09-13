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
- **Corrección aplicada:** commit `abbe52b6e6dde36c780d2d55e75fa861eded367e`, capa v26.5.

## Revalidación 2026-09-13 — interacción entre capas

La conclusión anterior “PASA EN CÓDIGO” era demasiado fuerte al analizar `storage-recovery-v26.js` de forma aislada.

Producción carga en este orden:

1. `storage-recovery-v26.js`
2. `storage-access-guard-v71.js`
3. `app.js`

`storage-access-guard-v71.js` reemplaza posteriormente `Storage.prototype.getItem()`. Cuando detecta errores de acceso bloqueado (`SecurityError`, `InvalidStateError`, `NotAllowedError`), registra la advertencia y devuelve `null` en lugar de relanzar la excepción.

Esto afecta a la guarda de v26.5: el wrapper de `resetDemo()` espera capturar una excepción de `localStorage.getItem(KEY)` para cancelar de forma fail-closed, pero la capa v71 puede convertir esa excepción en `null`. El wrapper interpreta entonces `current === null` como “no existe estado guardado” y delega en el `resetDemo()` original.

El `resetDemo()` original ejecuta confirmación y `localStorage.removeItem('docenteDigitalPrototype')` sin crear la copia de recuperación de v26.5.

### AUD-STORAGE-266-C — lectura bloqueada transformada en null antes de Restablecer

- **ID:** AUD-STORAGE-266-C
- **Módulo:** Persistencia / recuperación / Restablecer datos.
- **Entrada:** Storage con lectura bloqueada de forma que la guardia v71 captura el error y devuelve `null`; usuario pulsa Restablecer datos.
- **Resultado esperado:** la acción debe distinguir “no existe estado” de “no puedo leer el estado”, cancelar y conservar el camino de recuperación.
- **Resultado obtenido por inspección del wiring actual:** v71 puede transformar el fallo de lectura en `null`; v26.5 recibe `null` y puede derivar al `resetDemo()` original sin crear backup.
- **Evidencia:** orden de scripts de `index.html`; `storage-access-guard-v71.js` devuelve `null` para errores de lectura bloqueada; `storage-recovery-v26.js` contiene `if(current===null)return previous.apply(this,arguments)`; `app.js` define `resetDemo()` con eliminación directa del estado principal.
- **Resultado:** NO PASA A NIVEL DE INTEGRACIÓN ESTÁTICA.
- **Clasificación:** PARCIALMENTE FUNCIONAL.
- **Severidad:** S2 ALTO.
- **Causa raíz:** dos capas de resiliencia aplican contratos incompatibles: una necesita recibir la excepción para actuar fail-closed y la otra la normaliza a `null`.
- **Acción correctiva recomendada:** introducir una lectura estricta para operaciones destructivas (que no convierta errores de acceso en `null`) o devolver un estado distinguible de “ausente”; después probar Restablecer y Eliminar con Storage realmente bloqueado.
- **Riesgo de regresión:** medio; modificar globalmente `Storage.prototype.getItem()` puede romper el arranque, por lo que la corrección debe limitarse a rutas destructivas y validarse E2E.

## Estado consolidado

La protección de bootstrap añadida en v26.5 sigue siendo válida, pero la protección de Restablecer no puede considerarse cerrada mientras exista la interacción descrita con `storage-access-guard-v71.js`.

**Resultado actual:** PARCIALMENTE FUNCIONAL / NO PASA EN INTEGRACIÓN ESTÁTICA / E2E REAL PENDIENTE.

No se eleva a S0 porque esta revisión no ha demostrado pérdida irreversible en navegador real: falta probar el comportamiento conjunto de lectura bloqueada, `removeItem`, recarga y posterior recuperación. Conforme a V3 y V5, no se presume ese resultado.

## Pruebas pendientes obligatorias

- navegador real con Storage bloqueado por privacidad/política;
- distinguir lectura bloqueada de clave inexistente;
- Restablecer con lectura bloqueada;
- Eliminar unidad con lectura bloqueada;
- cuota agotada real;
- recarga y cierre/reapertura;
- recuperación de unidad con backup pendiente;
- móvil físico económico y gama media.

Estas pruebas no se sustituyen con inspección estática, smoke ni HTTP 200.

## Impacto en métricas

- IUD: riesgo de mensaje/comportamiento inconsistente en una acción destructiva; no cuantificado.
- ICGD: sin cambio demostrado.
- IFR: resiliencia de persistencia queda parcialmente abierta; no cuantificado.
- ISU: no calculado.
- Prelaunch: persistencia/recuperación continúa bloqueada hasta prueba real y corrección del contrato entre capas.

## Gate

V5 continúa BLOQUEADO. Este informe no autoriza lanzamiento y no se calcula Prelaunch Score definitivo.