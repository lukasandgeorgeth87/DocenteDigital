# AUD-DRAFT-AUTOSAVE-LOSS-232

## Resumen

**Módulo:** Configuración inicial + Unidad/Proyecto + continuidad del trabajo  
**Estado:** NO PASA  
**Severidad:** S1 CRÍTICO  
**Clasificación:** persistencia de documentos creados = PARCIALMENTE FUNCIONAL; autoguardado de borradores = INEXISTENTE; recuperación de borrador interrumpido = INEXISTENTE.

## Especificaciones aplicables

- V4 exige guardado automático, estado comprensible de guardado y continuar donde quedó.
- V5 exige probar cierre de navegador, recarga, cambio de pestaña, interrupción y retorno durante una tarea, sin perder información ingresada; además, `guardado inestable` es bloqueante de prelaunch.
- V3 establece que una función solo aprueba si guarda, se recupera y no pierde información.

No se usa normativa MINEDU/UGEL externa para clasificar este hallazgo.

## Evidencia de implementación

En `app.js` el estado persistente se guarda únicamente cuando se invoca explícitamente `save()`.

Durante la configuración inicial:

- `chooseOne()` modifica `state[key]`, pero no ejecuta `save()`.
- la selección de grados en `renderGrades()` modifica `state.grades`, pero no ejecuta `save()`.
- la selección de áreas en `renderAreas()` modifica `state.areas`, pero no ejecuta `save()`.
- `finishSetup()` recién ejecuta `save()` al final del flujo.

Durante creación de Unidad/Proyecto:

- `unitType`, `unitDuration`, `unitTitle` y `unitSituation` viven exclusivamente en controles DOM;
- no existe `input`, `change`, debounce, draft object ni otro listener que persista esos campos mientras se editan;
- `createUnitDemo()` lee esos valores y recién después de crear la unidad ejecuta `save()`.

`continueWork()` únicamente puede recuperar `state.lastSession` o una unidad ya creada en `state.units`; no existe un borrador de Unidad/Proyecto pendiente que pueda retomarse.

## Pruebas

### AUD-DRAFT-232-A — recarga durante configuración inicial

**Entrada:** iniciar configuración → seleccionar Nivel → Tipo de IE → uno o varios grados → recargar antes de `Guardar y entrar`.

**Resultado esperado:** recuperar el paso y las selecciones ya realizadas, o como mínimo restaurar los valores autosalvados.

**Resultado obtenido por inspección del runtime:** esas selecciones no se persisten mientras se avanza; `save()` se ejecuta recién en `finishSetup()`.

**Evidencia:** `chooseOne`, `renderGrades`, `renderAreas`, `finishSetup` en `app.js` productivo.

**Resultado:** NO PASA.

### AUD-DRAFT-232-B — recarga con Unidad/Proyecto en edición

**Entrada:** abrir `Crear unidad/proyecto` → seleccionar tipo/duración → escribir título → escribir una situación significativa larga → recargar antes de `Crear propuesta completa`.

**Resultado esperado:** la app debe recuperar el borrador y permitir continuar donde quedó, mostrando un estado simple de guardado.

**Resultado obtenido por inspección del runtime:** los cuatro campos no se sincronizan con `state` ni con otro almacenamiento; `createUnitDemo()` es el primer punto que consume esos valores y guarda el resultado final.

**Evidencia:** `index.html` define los campos sin eventos de autosave; `app.js` no registra listeners de borrador y `createUnitDemo()` guarda únicamente la unidad ya creada.

**Resultado:** NO PASA.

### AUD-DRAFT-232-C — Continuar mi trabajo

**Entrada:** dejar una Unidad/Proyecto incompleta y usar Inicio → `Continuar mi trabajo` después de una interrupción/recarga.

**Resultado esperado:** retomar el borrador incompleto.

**Resultado obtenido:** `continueWork()` solo recupera `lastSession` o una unidad ya persistida; si no existe ninguna, abre un formulario nuevo.

**Resultado:** NO PASA.

## Causa raíz

La persistencia actual está diseñada alrededor de objetos terminados (`units`, `lastSession`) y configuraciones confirmadas, no alrededor de un modelo de trabajo en progreso. La interfaz promete continuidad, pero no existe una entidad de borrador con estado, timestamps o recuperación.

## Acción correctiva recomendada

Implementar de manera pequeña y reversible un modelo de borradores, por ejemplo:

- `drafts.setup` con paso actual y selecciones;
- `drafts.unit` con tipo, duración, título, situación y contexto de la Ficha Maestra;
- persistencia por `input/change` con debounce corto;
- `updatedAt` y estado `saved/pending/error`;
- restauración automática al reabrir;
- opción visible `Descartar borrador`;
- evitar sobrescribir documentos emitidos o históricos;
- cuando exista backend, migrar el mismo contrato de draft con ownership/tenant seguro.

No debe mostrarse `✓ Guardado` hasta que el dato haya sido persistido realmente.

## Repruebas obligatorias

1. escribir 2–3 párrafos → recargar → comprobar recuperación exacta;
2. cambiar pestaña y volver;
3. cierre/reapertura del navegador;
4. doble edición rápida y debounce;
5. storage no disponible / cuota agotada;
6. recuperar sin duplicar una unidad ya creada;
7. móvil físico y conexión intermitente cuando exista backend/sincronización.

## Riesgo de regresión

**Medio.** Un autosave implementado superficialmente podría sobrescribir documentos históricos, guardar valores parciales incoherentes o duplicar unidades cuando el usuario pulse Crear. Debe separarse claramente `draft` de `documento creado/emitido`.

## Impacto en indicadores/gate

- **ISU:** afecta recuperación del trabajo y confianza de usuario principiante.
- **IFR:** afecta directamente persistencia/recuperación funcional.
- **ICGD:** impacto indirecto si la Ficha Maestra/configuración se interrumpe.
- **Prelaunch:** bloquea V5 por guardado/recuperación inestable durante tareas.

No se calcula puntuación definitiva sin pruebas reales.

## Conclusión

DocenteDigital no demuestra todavía el requisito V4/V5 de autoguardado y continuidad de borradores. La aplicación conserva ciertos objetos terminados, pero una interrupción durante configuración o redacción de una Unidad/Proyecto puede obligar al usuario a reescribir información. Este hallazgo permanece abierto hasta implementar y probar recuperación real.