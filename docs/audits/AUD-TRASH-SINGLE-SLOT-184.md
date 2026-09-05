# AUD-TRASH-SINGLE-SLOT-184 — Segundo borrado sobrescribe la recuperación del primero

## ID
**AUD-TRASH-SINGLE-SLOT-184**

## Módulo
Carpeta Docente → Mis unidades/proyectos → borrado y recuperación.

## Entrada
1. Tener dos unidades/proyectos guardados: A y B.
2. Eliminar A y confirmar.
3. No pulsar todavía `Restaurar` ni `Descartar` en la barra de recuperación.
4. Eliminar B y confirmar.
5. Intentar recuperar A y B.

## Esperado
Conforme a V4 §23 y al gate de recuperación documental V5, cada documento eliminado debe permanecer recuperable hasta una acción explícita de eliminación definitiva. Un segundo borrado no debe destruir el respaldo del primero.

## Obtenido
`storage-recovery-v26.js` define una sola clave:

```js
const DELETE_BACKUP_KEY='docenteDigitalPrototype_delete_backup';
```

Antes de cada borrado, `installRecoverableUnitDelete()` escribe directamente en esa misma clave:

```js
nativeSetItem.call(localStorage,DELETE_BACKUP_KEY,JSON.stringify({savedAt:new Date().toISOString(),unit,activeUnitId:before.activeUnitId||null}));
```

Por tanto:
- al borrar A, la clave contiene A;
- al borrar B antes de restaurar A, la misma clave se sobrescribe con B;
- `offerUnitDeleteRestore()` además elimina la barra anterior y reconstruye la interfaz desde la única copia presente;
- A ya no está en `state.units` y su único respaldo de este flujo fue sustituido por B.

La consecuencia determinista es que A deja de ser recuperable mediante el mecanismo actual después del segundo borrado.

## Evidencia
- `storage-recovery-v26.js`: constante única `DELETE_BACKUP_KEY`.
- `installRecoverableUnitDelete()`: `setItem` sobre la misma clave en cada eliminación.
- `offerUnitDeleteRestore()`: elimina `#ddUnitDeleteRestore` anterior y trabaja con un único objeto `backup.unit`.
- V4 §23: confirmación + papelera + recuperación antes de eliminación definitiva.
- V5: pérdida de información y recuperación documental incompleta permanecen bloqueantes.

## PASA / NO PASA
**NO PASA**

## Severidad
**S1 — CRÍTICO / bloqueante V5**, porque existe un camino reproducible de pérdida irreversible de una unidad ya eliminada sin que el usuario haya ordenado su eliminación definitiva. Las confirmaciones de borrado reducen accidentalidad, pero no autorizan a sobrescribir la copia recuperable previa.

## Clasificación
- Recuperación de un solo borrado: **FUNCIONAL/PARCIAL**.
- Recuperación de dos o más borrados pendientes: **ROTA**.
- Papelera multi-documento: **INEXISTENTE**.
- Eliminación definitiva explícita por elemento: **INEXISTENTE**.

## Acción recomendada
Sustituir la clave única por una colección persistente de papelera, por ejemplo:

```text
trash = [{ id, deletedAt, unit, previousActiveUnitId }, ...]
```

Requisitos mínimos:
1. no sobrescribir elementos previos;
2. restaurar cualquier elemento por `id`;
3. conservar contenido, ID y relaciones;
4. permitir eliminación definitiva separada;
5. migrar la copia única existente si está presente;
6. probar A→B→restaurar A, A→B→restaurar B, recarga entre borrados, y 10 borrados consecutivos;
7. no declarar cierre V5 hasta probar también navegador/móvil real.

## Corrección automática
No aplicada. Convertir el respaldo único en una Papelera afecta ciclo de vida, persistencia, UI y relaciones Unidad→Sesiones; no es un parche pequeño suficientemente seguro para esta pasada.
