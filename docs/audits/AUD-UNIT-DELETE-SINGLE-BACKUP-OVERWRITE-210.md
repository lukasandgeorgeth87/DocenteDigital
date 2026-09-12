# AUD-UNIT-DELETE-SINGLE-BACKUP-OVERWRITE-210

## Estado revalidado — 2026-09-12
- Módulo: Planificación → Mis unidades/proyectos → Eliminar / recuperación
- Hallazgo original: una segunda eliminación podía sobrescribir la única copia recuperable de la primera.
- Severidad original: **S0 BLOQUEANTE**, por ruta determinista de pérdida irreversible.
- Estado actual: **CORREGIDO EN CÓDIGO / E2E REAL PENDIENTE**.
- Clasificación actual: eliminación individual y bloqueo preventivo de segunda eliminación = **FUNCIONAL EN IMPLEMENTACIÓN**; validación de recuperación en navegador/dispositivo real = **PENDIENTE**; papelera histórica multiítem = **INEXISTENTE**.
- Gate V5: **continúa BLOQUEADO** por pruebas reales pendientes y otros hallazgos abiertos.

## Especificaciones aplicadas
- V4 §23: confirmación + papelera + recuperación antes de eliminación definitiva.
- V5 §§3–4: probar eliminar/recuperar documentos y no perder información.
- V3 §19: papelera, recuperación y eliminación definitiva; V3 §23: pérdida irreversible = S0.

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
`storage-recovery-v26.js` utilizaba una sola clave `docenteDigitalPrototype_delete_backup` y una nueva eliminación podía reemplazar la copia anterior. Por ello la secuencia A→B podía dejar A sin ruta de recuperación dentro de la aplicación.

### Corrección aplicada
Commit funcional: `d49a8ccc698c6dd10b6468be8e2d2d48ab6d38b2`.

`storage-recovery-v26.js` v26.2 ahora verifica la copia pendiente antes de una nueva eliminación:
- si existe una copia de otra unidad, cancela el segundo borrado;
- vuelve a mostrar la opción de recuperación anterior;
- exige resolver primero **Restaurar** o **Descartar definitivamente**;
- si no puede comprobar el backup, cancela de forma conservadora la eliminación.

Esto elimina en código la ruta determinista de sobrescritura del primer backup sin cambiar el formato de `state.units`.

### Evidencia actual
- `storage-recovery-v26.js` declara v26.2.
- `installRecoverableUnitDelete()` lee `DELETE_BACKUP_KEY` antes del borrado y retorna sin invocar `deleteUnit()` si existe otra unidad pendiente.
- Si la lectura del backup falla, también retorna y no elimina.
- Producción carga `storage-recovery-v26.js` antes de `app.js`.

### PASA / NO PASA actual
- **PASA a nivel de implementación y wiring** para impedir la sobrescritura consecutiva.
- **PENDIENTE** a nivel E2E real: no convertir esta inspección en aprobación final V5.

## Pruebas reales todavía obligatorias
1. eliminar A → Restaurar A;
2. eliminar A → recargar → Restaurar A;
3. eliminar A → intentar eliminar B → confirmar que B no se elimina y A sigue recuperable;
4. eliminar A → Descartar definitivamente → eliminar B;
5. verificar `activeUnitId`, `continueWork()` y sesiones vinculadas;
6. repetir en móvil real y con almacenamiento restringido/cuota llena.

## Causa raíz histórica
La recuperación se modeló inicialmente como una sola ranura de deshacer. La corrección actual conserva esa ranura, pero impide que una segunda eliminación la sobrescriba. Una papelera multiítem sigue siendo una mejora pendiente para cumplir plenamente la experiencia V4.

## Riesgo de regresión
**Bajo–medio.** El parche no migra `state.units`; modifica únicamente la precondición de una segunda eliminación. El riesgo pendiente está en interacción real, persistencia y relaciones con sesiones.

## Impacto
- IUD/ICGD: mejora técnica al evitar la pérdida por sobrescritura del backup.
- IFR/ISU/Prelaunch: no puntuar definitivamente hasta prueba E2E/física.
- El S0 original deja de considerarse activo una vez desplegada la corrección, pero la evidencia real de recuperación sigue pendiente.

## Normativa externa
No se utilizó normativa MINEDU/UGEL/legal externa para este hallazgo. Se deriva de V3/V4/V5 y del comportamiento técnico del producto.
