# AUD-STORAGE-RECOVERY-BOOTSTRAP-266

Fecha de revisión: 2026-09-12 (hora local Perú)

## Alcance

Auditoría de resiliencia de persistencia/recuperación conforme a V3, V4 y V5, con foco en almacenamiento local bloqueado o inaccesible. No se considera prueba física de navegador/dispositivo.

## Hallazgo

`storage-recovery-v26.js` ya protegía varios fallos de escritura y algunas lecturas de `localStorage`, pero quedaban dos lecturas directas fuera de manejo de errores:

1. El bootstrap `initSafety()` consultaba `DELETE_BACKUP_KEY` directamente. Si `localStorage.getItem()` lanzaba una excepción (almacenamiento bloqueado/restringido), el callback podía abortar antes de terminar la inicialización de recuperación y dejar una excepción no gestionada.
2. El wrapper de `resetDemo()` leía `KEY` antes de entrar a cualquier `try/catch`. Con almacenamiento bloqueado, pulsar Restablecer podía terminar en excepción en lugar de cancelar de forma comprensible y conservadora.

Los defectos no demostraban pérdida irreversible: en ambos casos la operación destructiva no había sido ejecutada y los datos existentes no se eliminaban. Por ello no corresponde S0/S1.

## Pruebas

### AUD-STORAGE-266-A — bootstrap con lectura bloqueada

- **Entrada:** navegador donde `localStorage.getItem(DELETE_BACKUP_KEY)` lanza una excepción durante `initSafety()`.
- **Resultado esperado:** la app conserva el estado, muestra advertencia comprensible y no deja fallar silenciosamente el bootstrap de seguridad.
- **Resultado obtenido antes de corregir:** lectura directa sin `try/catch`; podía abortar el callback con excepción.
- **Evidencia:** versión v26.3 de `storage-recovery-v26.js`, `initSafety()`.
- **Estado previo:** NO PASA.
- **Clasificación:** PARCIALMENTE FUNCIONAL.
- **Severidad:** S2 ALTO.
- **Causa raíz:** supuesto implícito de que la lectura de Storage siempre es accesible durante el bootstrap.
- **Acción correctiva aplicada:** envolver la lectura en manejo de errores, registrar `__ddStorageStartupError`, conservar datos y mostrar advertencia sin ejecutar acciones destructivas.

### AUD-STORAGE-266-B — Restablecer con lectura principal bloqueada

- **Entrada:** pulsar Restablecer cuando `localStorage.getItem(KEY)` lanza una excepción.
- **Resultado esperado:** cancelar el restablecimiento, explicar que no puede verificarse el estado y preservar los datos.
- **Resultado obtenido antes de corregir:** excepción no gestionada antes de crear/verificar el backup.
- **Evidencia:** versión v26.4 de `storage-recovery-v26.js`, inicio del wrapper `resetDemo()`.
- **Estado previo:** NO PASA.
- **Clasificación:** PARCIALMENTE FUNCIONAL.
- **Severidad:** S2 ALTO.
- **Acción correctiva aplicada:** lectura protegida; ante error se cancela el restablecimiento (fail-closed), se informa al usuario y se mantiene el estado existente.

## Corrección

- Commit `90118f8f8f3064e5b471d84ef7dc42c80947bde4`: protege la lectura de recuperación de unidad durante `initSafety()`.
- Commit `abbe52b6e6dde36c780d2d55e75fa861eded367e`: protege la lectura inicial del estado antes de `resetDemo()` y actualiza la capa a v26.5.

## Evidencia posterior

A nivel de implementación:

- el bootstrap ya no depende de una lectura de `DELETE_BACKUP_KEY` sin protección;
- Restablecer cancela si no puede leer el estado actual;
- no se borra el estado cuando la verificación de Storage falla;
- se mantiene advertencia visible para el usuario.

**Resultado posterior de implementación:** PASA EN CÓDIGO / E2E REAL PENDIENTE.

## Pruebas pendientes obligatorias

PENDIENTE hasta ejecución real:

- navegador con Storage bloqueado por privacidad/política;
- cuota agotada real;
- recarga y cierre/reapertura;
- Restablecer con lectura bloqueada;
- recuperación de unidad con backup pendiente;
- móvil físico económico y gama media.

Estas pruebas no se sustituyen con inspección estática ni con HTTP 200.

## Impacto en métricas

- IUD: mejora esperada al convertir un fallo silencioso en aviso comprensible; no cuantificado.
- ICGD: sin cambio demostrable.
- IFR: mejora técnica parcial de resiliencia; no cuantificado.
- ISU: no calculado.
- Prelaunch: el riesgo puntual queda corregido en implementación, pero persistencia/recuperación real sigue PENDIENTE según V5.

## Gate

Este hallazgo corregido no autoriza lanzamiento. V5 continúa bloqueado mientras falten pruebas reales esenciales y existan otros bloqueantes abiertos.