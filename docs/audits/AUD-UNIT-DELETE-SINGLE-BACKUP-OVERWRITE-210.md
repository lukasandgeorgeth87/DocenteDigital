# AUD-UNIT-DELETE-SINGLE-BACKUP-OVERWRITE-210

## Estado
- Módulo: Planificación → Mis unidades/proyectos → Eliminar / recuperación
- Resultado: **NO PASA**
- Clasificación: eliminación individual = **PARCIALMENTE FUNCIONAL**; recuperación de una sola eliminación = **FUNCIONAL**; recuperación ante eliminaciones sucesivas = **ROTA**; papelera histórica = **INEXISTENTE**
- Severidad: **S0 BLOQUEANTE** por ruta determinista de pérdida irreversible del primer documento eliminado cuando se elimina un segundo antes de restaurar/descartar la copia anterior.
- Gate V5: **BLOQUEADO**

## Especificaciones aplicadas
- V4 §23 exige: confirmación + papelera + recuperación antes de eliminación definitiva.
- V5 §§3–4 exige probar eliminar/recuperar documentos y no perder información.
- V3 §19 exige papelera, recuperación y eliminación definitiva; V3 §23 clasifica pérdida irreversible como S0.

## ID de prueba
**AUD-UNIT-DELETE-SINGLE-BACKUP-OVERWRITE-210**

### Entrada
1. Tener al menos dos unidades guardadas: A y B.
2. Eliminar A y confirmar.
3. No pulsar Restaurar ni Descartar en el aviso de recuperación.
4. Eliminar B y confirmar.
5. Intentar recuperar A.

### Resultado esperado
- A y B deben quedar en una papelera o colección de eliminados recuperable de forma independiente.
- Eliminar B no debe destruir ni sobrescribir la posibilidad de recuperar A.
- La eliminación definitiva debe requerir una acción explícita posterior.

### Resultado obtenido por inspección del runtime productivo
`app.js` elimina la unidad del arreglo `state.units` y guarda inmediatamente el estado. La protección `storage-recovery-v26.js`, que sí está cargada en producción, guarda antes del borrado una sola copia en la clave fija `docenteDigitalPrototype_delete_backup`.

En `installRecoverableUnitDelete()`, cada nueva eliminación ejecuta `nativeSetItem(..., DELETE_BACKUP_KEY, JSON.stringify(...))`. Como `DELETE_BACKUP_KEY` es única, una segunda eliminación reemplaza la copia de la primera antes de ejecutar el borrado de B. El aviso de restauración también lee únicamente esa misma clave. No existe colección de eliminados ni papelera por ID.

Secuencia determinista:
- después de eliminar A: `DELETE_BACKUP_KEY = A`; A ya no está en `state.units`;
- al iniciar eliminación de B: `DELETE_BACKUP_KEY = B`; la copia de A queda sobrescrita;
- después de eliminar B: `state.units` ya no contiene A ni B y la única copia recuperable es B;
- A queda sin ruta de recuperación dentro de la aplicación.

### Evidencia
- `app.js`: `deleteUnit(id)` confirma, filtra la unidad de `state.units` y ejecuta `save()`.
- `storage-recovery-v26.js`: usa una sola `DELETE_BACKUP_KEY='docenteDigitalPrototype_delete_backup'`; la sobrescribe en cada eliminación y ofrece restaurar solo la unidad contenida en esa clave.
- Producción canónica carga `storage-recovery-v26.js` antes de `app.js`; por tanto esta ruta forma parte del runtime vigente.

### PASA / NO PASA
**NO PASA**.

## Causa raíz
La recuperación fue implementada como un único slot de deshacer, no como papelera/colección transaccional. No existe una guarda que impida una segunda eliminación mientras queda una copia pendiente ni una estructura `deletedUnits[]` con IDs independientes.

## Acción correctiva recomendada
Corrección mínima de seguridad, previa a una papelera completa:
1. si existe una copia pendiente en `DELETE_BACKUP_KEY`, bloquear una segunda eliminación hasta que el usuario restaure o descarte explícitamente la primera; o
2. preferiblemente migrar a una papelera `deletedUnits[]` con `id`, `deletedAt`, documento y contexto mínimo para restauración.

Después probar obligatoriamente: A→eliminar, B→eliminar, restaurar A, restaurar B, recarga entre pasos, cierre/reapertura, cuota llena y eliminación definitiva explícita.

No se aplicó parche automático en esta ejecución porque convertir el slot único en papelera afecta persistencia, migración de estado, UX de restauración y compatibilidad con datos locales existentes. Una modificación parcial podría crear otra ruta de pérdida.

## Evidencia posterior requerida
- prueba de navegador real de dos eliminaciones consecutivas;
- recuperación independiente de ambos documentos;
- recarga/cierre entre eliminaciones;
- verificación en móvil real;
- prueba de migración desde estados que ya contengan `docenteDigitalPrototype_delete_backup`.

## Riesgo de regresión
**ALTO** en persistencia local si se cambia el formato sin migración. La corrección debe conservar copias antiguas y no modificar históricos emitidos.

## Impacto
- IUD: afecta integridad y recuperación documental.
- ICGD: reduce confianza en guardado/archivo.
- IFR: afecta funcionalidad real de eliminación/recuperación.
- ISU: papelera y recuperación todavía no cumplen V4.
- Prelaunch: **bloqueante**; una puntuación global no puede ocultar este S0.

## Normativa externa
No se utilizó normativa MINEDU/UGEL/legal externa para este hallazgo. Se deriva de V3/V4/V5 y del comportamiento técnico del producto; por ello no se declara vigencia normativa externa.
