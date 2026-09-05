# AUD-DOC-TRASH-179 — Eliminación irreversible de Unidad/Proyecto sin papelera ni recuperación

## Alcance
Auditoría acumulativa contra V2 + V3 + V4 + V5 + Núcleo IA. Se revisó el flujo real de `Mi planificación → Mis unidades/proyectos → Eliminar` en el código de `main` y su equivalente servido en producción.

## ID de prueba
**AUD-DOC-TRASH-179**

## Módulo
Carpeta Docente → Unidad/Proyecto → biblioteca de documentos / borrado seguro.

## Persona
Docente principiante, docente experimentado, QA, UX y auditor de persistencia.

## Entrada
1. Tener al menos una Unidad/Proyecto guardada.
2. Pulsar `Eliminar` en `Mis unidades/proyectos`.
3. Confirmar el diálogo del navegador.
4. Intentar localizar papelera, deshacer o recuperar el documento.

## Resultado esperado
Conforme a V4, el borrado seguro debe aplicar **confirmación + papelera + recuperación antes de eliminación definitiva**. Conforme a V5, las pruebas funcionales de documentos deben incluir eliminar y recuperar. V3 también exige definir papelera, recuperación y eliminación definitiva.

El resultado esperado es que una eliminación normal sea reversible durante un periodo o hasta una acción explícita de eliminación definitiva, manteniendo suficiente metadato para recuperar el documento sin reconstruirlo manualmente.

## Resultado obtenido
`renderUnits()` expone un botón `Eliminar` que llama a `deleteUnit(id)`.

`deleteUnit(id)`:

```js
if(!confirm(`¿Eliminar “${unit.title}”?`))return;
state.units=state.units.filter(u=>u.id!==id);
if(state.activeUnitId===id)state.activeUnitId=state.units[0]?.id||null;
save();
```

Después de confirmar:
- la unidad se elimina directamente de `state.units`;
- el nuevo estado se persiste inmediatamente en `localStorage`;
- no se mueve a una colección `trash`, `deleted`, `archive` o equivalente;
- no existe en la interfaz de unidades una Papelera ni acción Restaurar;
- no hay mecanismo de deshacer en este flujo.

La misma implementación está servida actualmente en `https://docente-digital.vercel.app/app.js` con HTTP 200.

## Evidencia
- `app.js`: `renderUnits()` contiene el botón `Eliminar`.
- `app.js`: `deleteUnit()` filtra la unidad fuera de `state.units` y llama `save()`.
- V4 §23: borrado seguro = confirmación + papelera + recuperación antes de eliminación definitiva.
- V5 §3: probar crear/editar/.../eliminar/recuperar documentos.
- V3 §19: definir papelera, recuperación y eliminación definitiva.

## PASA / NO PASA
**NO PASA**

## Clasificación funcional
**PARCIALMENTE FUNCIONAL**

La eliminación funciona técnicamente, pero el ciclo documental de borrado seguro y recuperación está incompleto.

## Severidad
**S2 — ALTO**

No se clasifica como S0 porque la eliminación requiere confirmación explícita y no se demostró una pérdida espontánea o corrupción. Sin embargo, una vez confirmada, la aplicación elimina el único objeto persistido por este flujo sin ofrecer recuperación normal, incumpliendo requisitos explícitos V3/V4/V5 y aumentando el riesgo de pérdida accidental de trabajo docente.

## Causa raíz
El modelo de persistencia de unidades solo contempla `state.units` y no modela estados de ciclo de vida documental (activo, eliminado recuperable, eliminación definitiva). La UI de biblioteca fue implementada antes que la arquitectura de archivo/papelera requerida por V4/V5.

## Acción correctiva recomendada
No parchear con un simple `undo` temporal en memoria. Implementar un ciclo mínimo y persistente:

1. `deletedAt` / estado `trashed` o colección equivalente.
2. Acción `Mover a papelera` en lugar de eliminación definitiva inmediata.
3. Vista Papelera.
4. Acción Restaurar que conserve ID, contenido y relaciones.
5. Eliminación definitiva separada y reforzada.
6. Pruebas de cierre/recarga antes y después de restaurar.
7. Cuando exista backend multiusuario, aplicar el mismo contrato en servidor y bitácora.

## Corrección aplicada en esta pasada
**No se modificó el runtime.** La solución afecta el modelo de persistencia y ciclo de vida documental; un cambio superficial podría crear falsas garantías de recuperación. Solo se documenta el defecto hasta implementar y probar la arquitectura correspondiente.

## Evidencia posterior requerida
- crear una unidad;
- moverla a papelera;
- recargar navegador;
- comprobar que permanece recuperable;
- restaurarla y verificar contenido/ID/relaciones;
- eliminarla definitivamente mediante acción separada;
- comprobar que el flujo no afecta otras unidades ni sesiones relacionadas;
- repetir en móvil y, cuando exista backend, en otro dispositivo según alcance real.

## Riesgo de regresión
**Medio-Alto.** Cambiar el ciclo de vida de unidades afecta selector de sesiones, unidad activa, biblioteca, exportación y futuras relaciones Unidad → Sesiones.

## Impacto en indicadores
- **IUD:** negativo; el usuario puede perder una unidad sin recuperación.
- **ICGD:** negativo; rompe continuidad del ciclo documental.
- **IFR:** negativo; recuperación documental incompleta.
- **ISU:** negativo; V4 exige borrado seguro y recuperación.
- **Prelaunch:** negativo; V5 exige probar eliminación/recuperación y no permite considerar completo el flujo documental mientras falte.

## Estado de lanzamiento
Este hallazgo no autoriza cálculo definitivo de ISU/IFR/Prelaunch Score. DocenteDigital continúa **NO APROBADA PARA LANZAMIENTO V1.0** mientras existan bloqueantes V5 y pruebas reales esenciales pendientes.
