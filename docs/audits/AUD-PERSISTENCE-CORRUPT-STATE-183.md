# AUD-PERSISTENCE-CORRUPT-STATE-183 — REVISADO: recuperación preventiva ya cargada antes de app.js

## Resultado corregido

**PASA PARCIAL · S3 MEDIO como riesgo residual · FUNCIONAL/PARCIAL**

## Motivo de la revisión

La primera lectura aislada de `app.js` produjo un falso positivo: allí existe un `JSON.parse(...)` directo y un `save()` directo, pero la producción no carga `app.js` sola. `index.html` carga primero `storage-recovery-v26.js` y `storage-access-guard-v71.js`.

`storage-recovery-v26.js` valida `docenteDigitalPrototype` antes de que se ejecute `app.js`. Si el JSON es inválido o no representa un objeto válido:

1. conserva la cadena original en una clave de recuperación con timestamp cuando el navegador permite escribir;
2. elimina únicamente la clave principal dañada;
3. deja que `app.js` arranque después con `{}`;
4. diferencia corrupción real de un fallo de acceso al Storage, evitando borrar datos correctos por error;
5. intercepta `Storage.prototype.setItem` para capturar errores de cuota y mostrar una advertencia visible al usuario.

Además incorpora recuperación para restablecimiento y borrado de unidad/proyecto.

## Entrada

Abrir DocenteDigital con `docenteDigitalPrototype` conteniendo JSON inválido.

## Esperado

Evitar que el `JSON.parse` de `app.js` derribe el arranque, preservar el dato defectuoso si es posible y advertir sobre fallos de almacenamiento.

## Obtenido

La guardia preventiva se ejecuta antes de `app.js`, valida/aisla el estado defectuoso y protege fallos de cuota. Por ello el escenario está cubierto estáticamente por la cadena runtime actual.

## Evidencia

- `index.html`: `storage-recovery-v26.js` y `storage-access-guard-v71.js` aparecen antes de `app.js`.
- `storage-recovery-v26.js`: validación preventiva, copia de recuperación, separación entre corrupción y fallo de Storage, advertencia de cuota y restauración de datos.
- Producción actual sirve esa misma cadena de scripts.

## PASA / NO PASA

**PASA PARCIAL** para recuperación preventiva de JSON corrupto y cuota agotada en la capa cliente.

No se declara PASA total V5 porque todavía faltan pruebas físicas/reales de navegadores, cierre/reapertura, cuota llena, almacenamiento bloqueado, migración de esquemas y recuperación por usuarios reales.

## Severidad

**S3 MEDIO** como riesgo residual de validación, no S1.

## Clasificación

- Guardia previa a `app.js`: **FUNCIONAL**.
- Recuperación de JSON local corrupto: **FUNCIONAL/PARCIAL**.
- Manejo de cuota: **FUNCIONAL/PARCIAL**.
- Evidencia V5 con navegadores/dispositivos reales: **PENDIENTE / NO DEMOSTRADA**.

## Acción

Mantener los bloqueantes V5 de pruebas reales. Añadir pruebas automatizadas reproducibles para JSON inválido, esquema antiguo, Storage bloqueado y `QuotaExceededError`. No modificar esta guardia sin regresión específica.
