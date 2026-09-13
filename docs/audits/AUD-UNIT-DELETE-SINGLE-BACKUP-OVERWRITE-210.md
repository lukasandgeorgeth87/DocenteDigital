# AUD-UNIT-DELETE-SINGLE-BACKUP-OVERWRITE-210

## Estado revalidado — 2026-09-13
- Módulo: Planificación → Mis unidades/proyectos → Eliminar / recuperación.
- Hallazgo original: una segunda eliminación podía sobrescribir la única copia recuperable de la primera.
- Severidad original: **S0 BLOQUEANTE**, por ruta determinista de pérdida irreversible en la implementación histórica.
- Estado actual: **CORREGIDO EN CÓDIGO / E2E REAL PENDIENTE**.
- Runtime actual: `storage-recovery-v26.js` **v26.6**; la protección introducida originalmente en v26.2 continúa vigente y fue reforzada después con lecturas estrictas para operaciones destructivas.
- Clasificación actual: eliminación individual y bloqueo preventivo de segunda eliminación = **FUNCIONAL EN IMPLEMENTACIÓN**; validación de recuperación en navegador/dispositivo real = **PENDIENTE**; Papelera histórica multiítem = **INEXISTENTE**.
- Gate V5: **continúa BLOQUEADO** por pruebas reales pendientes y otros hallazgos abiertos.

## Especificaciones aplicadas
- V4 §23: confirmación + papelera + recuperación antes de eliminación definitiva.
- V5: probar eliminar/recuperar documentos y no perder información.
- V3: papelera, recuperación y eliminación definitiva; pérdida irreversible demostrada = severidad máxima según su taxonomía.

## ID de prueba
**AUD-UNIT-DELETE-SINGLE-BACKUP-OVERWRITE-210**

### Entrada original
1. Tener dos unidades A y B.
2. Eliminar A y confirmar.
3. No pulsar Restaurar ni Descartar.
4. Intentar eliminar B.

### Resultado esperado
La copia recuperable de A no debe ser sobrescrita ni quedar inaccesible por intentar eliminar B.

### Resultado obtenido antes de la corrección
La implementación histórica utilizaba una sola clave `docenteDigitalPrototype_delete_backup` y permitía que una nueva eliminación reemplazara la copia anterior. Por ello la secuencia A→B podía dejar A sin ruta de recuperación dentro de la aplicación.

### Corrección aplicada
Commit funcional original: `d49a8ccc698c6dd10b6468be8e2d2d48ab6d38b2`.

La protección introducida en v26.2 y vigente en v26.6 verifica la copia pendiente antes de una nueva eliminación:
- si existe una copia de otra unidad, cancela el segundo borrado;
- vuelve a mostrar la opción de recuperación anterior;
- exige resolver primero **Restaurar** o **Descartar definitivamente**;
- si no puede comprobar el backup, cancela de forma conservadora la eliminación.

Además, v26.6 usa lectura estricta del Storage para comprobaciones destructivas, de modo que un bloqueo de acceso no sea confundido con “no existe copia”.

### Evidencia actual
- `storage-recovery-v26.js` declara v26.6.
- `installRecoverableUnitDelete()` usa `strictGetItem(DELETE_BACKUP_KEY)` antes del borrado y retorna sin invocar `deleteUnit()` si existe otra unidad pendiente.
- Si la lectura del backup falla, también retorna y no elimina.
- Producción carga la capa de recuperación junto al runtime de la app.

### PASA / NO PASA actual
- **PASA a nivel de implementación** para impedir la sobrescritura consecutiva.
- **PENDIENTE a nivel E2E real**: esta inspección no equivale a aprobación V5.

## Pruebas reales todavía obligatorias
1. eliminar A → Restaurar A;
2. eliminar A → recargar → Restaurar A;
3. eliminar A → intentar eliminar B → confirmar que B no se elimina y A sigue recuperable;
4. eliminar A → Descartar definitivamente → eliminar B;
5. verificar `activeUnitId`, `continueWork()` y sesiones vinculadas;
6. repetir en móvil real y con almacenamiento restringido/cuota llena.

## Causa raíz histórica
La recuperación se modeló inicialmente como una sola ranura de deshacer. La corrección actual conserva esa ranura, pero impide que una segunda eliminación la sobrescriba. Una Papelera multiítem sigue pendiente para cumplir plenamente V4; su hallazgo canónico es `AUD-DOC-TRASH-179`.

## Riesgo de regresión
**Bajo–medio** para la protección actual. El riesgo pendiente está en interacción real, persistencia y relaciones con sesiones.

## Impacto
- IUD/ICGD: mejora técnica al evitar la pérdida por sobrescritura del backup.
- IFR/ISU/Prelaunch: no puntuar definitivamente hasta prueba E2E/física.
- El S0 histórico no se considera activo en la implementación actual, pero la evidencia real de recuperación sigue pendiente.

## Normativa externa
No se utilizó normativa MINEDU/UGEL/legal externa para este hallazgo. Se deriva de V3/V4/V5 y del comportamiento técnico del producto.
