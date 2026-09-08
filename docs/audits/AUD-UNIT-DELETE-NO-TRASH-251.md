# AUD-UNIT-DELETE-NO-TRASH-251

## Resumen ejecutivo

**Hallazgo:** la eliminación de una Unidad/Proyecto en el runtime actual es definitiva desde la perspectiva de la aplicación. Tras una confirmación nativa, `deleteUnit(id)` filtra el objeto fuera de `state.units` y persiste inmediatamente el nuevo estado en `localStorage`. No existe papelera, `deletedAt`, estado de borrado, vista de recuperación ni acción Restaurar.

**Clasificación:** PARCIALMENTE FUNCIONAL para eliminar; INEXISTENTE para papelera/recuperación.

**Severidad:** S2 ALTO.

**Gate V5:** no añade por sí solo un S0/S1, pero impide aprobar recuperación del trabajo, robustez y ciclo documental antes de V1.0.

## Especificaciones obligatorias aplicadas

Se revisaron conjuntamente:

- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

V3 exige definir **papelera, recuperación y eliminación definitiva** y probar backups/restauración. V4 exige expresamente **Confirmación + papelera + recuperación antes de eliminación definitiva** y considera la recuperación del trabajo una dimensión de simplicidad.

## Evidencia técnica del runtime

El estado conserva unidades directamente en `state.units`:

```js
state.units=Array.isArray(state.units)?state.units:[];
const save=()=>localStorage.setItem('docenteDigitalPrototype',JSON.stringify(state));
```

La eliminación implementada es:

```js
function deleteUnit(id){
  const unit=state.units.find(u=>u.id===id);if(!unit)return;
  if(!confirm(`¿Eliminar “${unit.title}”?`))return;
  state.units=state.units.filter(u=>u.id!==id);
  if(state.activeUnitId===id)state.activeUnitId=state.units[0]?.id||null;
  save();renderUnits();fillSessionUnits();byId('unitOutput')?.classList.add('hidden');
}
```

No se mueve el documento a una colección de papelera ni se conserva un marcador recuperable.

## Prueba AUD-DEL-251-A — Eliminación y recuperación de Unidad/Proyecto

**Entrada:**
1. Crear y guardar una Unidad/Proyecto.
2. Pulsar `Eliminar`.
3. Confirmar la eliminación.
4. Recargar la aplicación.
5. Intentar localizar la unidad en Papelera y restaurarla.

**Resultado esperado:** la unidad debe quedar apartada de la biblioteca activa pero disponible en Papelera durante una etapa de recuperación. La eliminación definitiva debe ser una acción separada y claramente identificada.

**Resultado obtenido:** `deleteUnit()` elimina el objeto de `state.units`, ejecuta `save()` y no crea ninguna referencia de recuperación. Después de recargar, la UI no dispone de Papelera ni Restaurar.

**Evidencia:** `app.js` → estado `state.units`, `save()`, `renderUnits()`, `deleteUnit()`.

**Resultado:** NO PASA.

**Clasificación:** PARCIALMENTE FUNCIONAL para la acción Eliminar; INEXISTENTE para recuperación.

**Severidad:** S2 ALTO.

**Acción correctiva:** implementar borrado reversible con un estado o colección explícita (`deletedAt`/papelera), una vista sencilla de Papelera, acción Restaurar y una eliminación definitiva separada con confirmación reforzada. Probar recarga, cierre inesperado, doble clic/tap, referencia desde sesiones/documentos y compatibilidad con datos existentes.

## Prueba AUD-DEL-251-B — Persistencia del borrado

**Entrada:** confirmar la eliminación de una unidad y recargar la página.

**Resultado esperado:** si el borrado todavía no es definitivo, la unidad debe permanecer recuperable.

**Resultado obtenido por inspección determinista:** el estado filtrado se sobrescribe en `localStorage`; no existe estructura de soft delete o papelera que permita a la aplicación reconstruir la unidad eliminada.

**Resultado:** NO PASA para recuperabilidad.

## Causa raíz

El modelo de persistencia solo diferencia entre “presente en `state.units`” y “ausente”. No existe ciclo de vida de borrado ni una capa de recuperación. La confirmación nativa se usa como sustituto de una estrategia de borrado seguro.

## Relación con hallazgos anteriores

Este hallazgo no duplica el ciclo documental profesional ya auditado: aquí la falla concreta es **recuperación posterior al borrado accidental de una Unidad/Proyecto**. Tampoco duplica la falta de backup/restore productivo: una papelera es una defensa de UX y persistencia de primer nivel; un backup es una defensa distinta ante fallos o pérdida mayor.

## Corrección automática en esta ronda

No se modificó el runtime. Añadir una papelera de forma segura exige definir migración del estado persistido y cómo se comportan referencias como `activeUnitId`, sesiones derivadas, documentos históricos y futuras relaciones. Un parche superficial podría romper referencias o alterar históricos, por lo que se deja pendiente hasta implementar y probar el modelo completo.

## Riesgo de regresión

**Medio-alto** si se corrige sin migración: una nueva estructura de borrado puede dejar `activeUnitId` apuntando a objetos eliminados, ocultar sesiones relacionadas o cambiar el comportamiento de usuarios que ya tienen datos en `localStorage`.

## Impacto

- **IUD:** negativo por pérdida irreversible desde la UI tras una acción accidental confirmada.
- **ICGD:** negativo si una unidad eliminada deja sesiones/documentos derivados sin trazabilidad visible.
- **IFR:** negativo en recuperación y continuidad; sin puntuación definitiva.
- **ISU:** negativo en “Recuperación del trabajo”; sin puntuación definitiva.
- **Prelaunch:** permanece bloqueado por S0/S1 acumulados y pruebas reales esenciales pendientes.

## Normativa externa

Este hallazgo se deriva de las especificaciones internas V3/V4/V5 y de la implementación observada. No fue necesario aplicar ni declarar vigente una norma MINEDU/UGEL externa.

## Estado de lanzamiento

**DocenteDigital continúa NO APROBADA PARA LANZAMIENTO V1.0.** La existencia de puntuaciones parciales favorables no puede ocultar S0/S1 abiertos ni pruebas reales esenciales todavía pendientes.