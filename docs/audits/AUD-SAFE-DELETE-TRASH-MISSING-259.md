# AUD-SAFE-DELETE-TRASH-MISSING-259

## Resumen

La eliminación de unidades/proyectos requiere confirmación, pero actualmente es irreversible: el registro se quita de `state.units` y el estado persistido se sobrescribe sin papelera ni mecanismo de recuperación. Esto incumple el requisito V4 de borrado seguro (`confirmación + papelera + recuperación antes de eliminación definitiva`) y deja incompleta la prueba V5 de `eliminar/recuperar documentos`.

## Clasificación

- **ID:** AUD-259
- **Módulo:** Planificación / Archivo / Persistencia / Recuperación
- **Estado:** NO PASA
- **Clasificación funcional:** PARCIALMENTE FUNCIONAL
- **Severidad:** S2 ALTO
- **Gate V5:** abierto; no es por sí solo S0/S1, pero impide aprobar la capacidad de eliminar/recuperar documentos.

## Especificaciones aplicables

- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`, punto 23: borrado seguro con confirmación, papelera y recuperación antes de eliminación definitiva.
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`, punto 3: probar crear/guardar/editar/duplicar/buscar/descargar/imprimir/**eliminar/recuperar** documentos.
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`, punto 19: definir papelera, recuperación y eliminación definitiva.

## Prueba

### ID
AUD-SAFE-DELETE-TRASH-MISSING-259

### Entrada
1. Tener al menos una unidad/proyecto guardado.
2. Abrir `Mis unidades y proyectos`.
3. Elegir `Eliminar`.
4. Confirmar el diálogo.
5. Intentar recuperar el documento eliminado.

### Resultado esperado
La aplicación debe:
1. pedir confirmación;
2. mover el documento a una papelera o estado equivalente recuperable;
3. permitir restaurarlo durante un periodo definido;
4. separar la eliminación definitiva de la eliminación normal;
5. conservar consistencia de referencias dependientes.

### Resultado obtenido
La implementación actual ejecuta `deleteUnit(id)` y, tras `confirm(...)`, aplica:

```js
state.units = state.units.filter(u => u.id !== id);
if (state.activeUnitId === id) state.activeUnitId = state.units[0]?.id || null;
save();
```

No se observa una colección de papelera, estado `deletedAt`, acción `restaurar`, ni flujo de eliminación definitiva. `planning-archive-simplicity-v56.js` conserva la acción `Eliminar` tanto en Modo Fácil como Experto y delega en `deleteUnit(...)`, sin añadir recuperación.

### Evidencia
- `app.js`: función `deleteUnit(id)` elimina físicamente el elemento del arreglo persistido después de una confirmación.
- `planning-archive-simplicity-v56.js`: el archivo compacto sigue exponiendo `Eliminar` y llama a `deleteUnit(...)`.
- No se encontró un hallazgo de auditoría previo específico para papelera/recuperación de borrado en `docs/audits/`.

### Resultado
**NO PASA**

## Causa raíz

El modelo persistente contempla unidades activas, pero no un ciclo de vida documental con estados como activo → papelera → restaurado/eliminado definitivamente. La confirmación modal reduce borrados accidentales, pero no equivale a recuperación.

## Acción correctiva

Implementar de forma pequeña y reversible:

1. añadir una colección o estado de papelera versionado para unidades/proyectos;
2. cambiar `deleteUnit` por `moveUnitToTrash`;
3. registrar `deletedAt` y mantener el objeto completo sin mutar históricos;
4. añadir `Restaurar` y `Eliminar definitivamente`;
5. confirmar de forma reforzada solo la eliminación definitiva;
6. probar referencias a sesiones/unidades activas antes y después de restaurar;
7. añadir pruebas automáticas de borrar → recargar → restaurar → recargar;
8. en una fase posterior, aplicar el mismo patrón al resto de documentos V1.0.

## Riesgo de regresión

Medio. Tocar el modelo de persistencia puede afectar `activeUnitId`, `lastSession`, archivo y recuperación. Debe incorporarse con migración compatible y pruebas sobre datos existentes.

## Impacto

- **IUD:** negativo por falta de recuperación documental.
- **IFR:** negativo por irreversibilidad de una operación de usuario.
- **ISU:** negativo por incumplimiento explícito de V4.
- **ICGD:** indirecto si el patrón se replica en documentos de Director.
- **Prelaunch:** mantiene pendiente la prueba eliminar/recuperar de V5.

## Límites de esta prueba

No se ejecutó borrado sobre datos reales de usuario ni se afirma pérdida ocurrida en producción. El hallazgo demuestra, por inspección de la implementación actual, que la ruta normal de eliminación de unidades/proyectos no ofrece recuperación. Las pruebas físicas/E2E siguen pendientes.
