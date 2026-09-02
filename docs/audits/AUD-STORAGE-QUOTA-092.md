# AUD-STORAGE-QUOTA-092

## Módulo
Persistencia local / recuperación / continuidad V4-V5.

## Entrada
Forzar una escritura en `localStorage` cuando el almacenamiento del navegador está lleno y `setItem()` lanza `QuotaExceededError` (o su variante histórica equivalente).

## Resultado esperado
La aplicación no debe romper el flujo ni ocultar el fallo de guardado. Debe conservar la sesión en memoria, advertir de forma comprensible que los cambios nuevos no pudieron persistirse y dejar la prueba física de distintos navegadores como pendiente.

## Resultado obtenido antes
`storage-access-guard-v71.js` solo absorbía `SecurityError`, `InvalidStateError` y `NotAllowedError`. Un `QuotaExceededError` era relanzado. Como `app.js` usa `localStorage.setItem(...)` directamente mediante `save()`, una cuota agotada podía producir una excepción visible/no controlada durante acciones de configuración o guardado.

## Evidencia
- `app.js`: `save=()=>localStorage.setItem('docenteDigitalPrototype',JSON.stringify(state));`
- `storage-access-guard-v71.js` anterior: conjunto de errores bloqueados sin `QuotaExceededError`.
- Orden de carga real en `index.html`: `storage-recovery-v26.js` → `storage-access-guard-v71.js` → `app.js`, por lo que la guardia puede proteger las escrituras posteriores del núcleo.

## Estado inicial
**NO PASA · S2 ALTO · PARCIALMENTE FUNCIONAL.**

## Causa raíz
La guardia trataba únicamente bloqueo de acceso, no agotamiento de cuota, aunque ambos escenarios impiden persistir el trabajo.

## Corrección
Actualización pequeña y reversible de `storage-access-guard-v71.js` a lógica interna v71.1:
- clasifica errores de bloqueo y cuota;
- intercepta `QuotaExceededError`, `NS_ERROR_DOM_QUOTA_REACHED` y códigos históricos compatibles;
- no oculta errores desconocidos;
- informa al usuario con un mensaje específico de almacenamiento lleno;
- conserva el estado de degradación en `window.__ddStorageAccessBlocked.reason` para auditoría runtime.

Commit funcional: `1107e2b8dbb13d853fc4499aa0946c1191995970`.

## Evidencia posterior
- Producción `/storage-access-guard-v71.js`: HTTP 200 y sirve v71.1 con clasificación `quota`.
- Producción `/`: HTTP 200.
- Vercel administrativo READY: **PENDIENTE**, porque `list_deployments` devuelve 403 por falta de autorización al scope del equipo. No se declara READY sin esa evidencia.

## Retest
**PASA técnicamente para manejo de la excepción en la capa de guardia.**

## Pendientes reales
No se simulan ni se cierran pruebas físicas con Safari/iOS, Android WebView, navegación privada, navegadores con cuotas diferentes, almacenamiento realmente lleno, cierre forzado ni recuperación tras liberar espacio.

## Riesgo de regresión
Bajo. El cambio solo absorbe errores reconocidos que impiden persistencia; los errores desconocidos continúan propagándose para no ocultar defectos.

## Impacto
- IUD: mejora al mostrar un error comprensible.
- ICGD: mejora la continuidad del trabajo local.
- IFR/ISU/Prelaunch: impacto positivo parcial, sin puntuación definitiva.

## Estado V5
La persistencia global continúa **PARCIALMENTE FUNCIONAL**. Siguen pendientes backend multiusuario, aislamiento, backup/restauración real y pruebas de interrupción/dispositivos reales.
