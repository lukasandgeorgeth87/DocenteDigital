# AUD-DRAFT-AUTOSAVE-RECOVERY-MISSING-252

## Resumen

**Estado:** NO PASA  
**Clasificación:** PARCIALMENTE FUNCIONAL / INEXISTENTE para borradores en curso  
**Severidad:** S1 CRÍTICO  
**Gate V5:** BLOQUEANTE por guardado/recuperación inestable durante una tarea

## Especificaciones aplicadas

- V3 exige probar cierre de navegador, recarga, cambio de pestaña, interrupción de internet y retorno durante una tarea, sin pérdida de información ingresada; también exige autoguardado comprensible y recuperación del trabajo pendiente.
- V4 exige guardado automático, estado simple de guardado y "Continuar donde quedó".
- V5 exige persistencia y recuperación durante una tarea y bloquea lanzamiento si el guardado es inestable.

## AUD-DRAFT-252-A — Borrador de Unidad/Proyecto ante recarga

**Entrada**  
1. Abrir `Mi planificación` → `Unidad / Proyecto` → `Crear nueva`.  
2. Seleccionar tipo y duración.  
3. Escribir un título manual.  
4. Escribir un contexto de partida extenso en `unitSituation`.  
5. Antes de pulsar `Crear propuesta completa`, recargar la página o cerrar y volver a abrir.

**Resultado esperado**  
El texto escrito y las selecciones deben autoguardarse como borrador y restaurarse al regresar. La interfaz debe poder informar un estado sencillo como `✓ Guardado` o equivalente.

**Resultado obtenido**  
`unitType`, `unitDuration`, `unitTitle` y `unitSituation` viven únicamente en controles DOM hasta que `createUnitDemo()` es invocado. El estado persistente solo incorpora la unidad después de construir el objeto `unit` y ejecutar `save()`. No existe `state.draftUnit`, listeners `input/change` que persistan el borrador, restauración de esos controles al cargar ni `beforeunload` que preserve el contenido.

**Evidencia**  
- `index.html` define `unitType`, `unitDuration`, `unitTitle` y `unitSituation` como controles normales sin lógica de autoguardado asociada.
- `app.js` lee dichos valores únicamente dentro de `createUnitDemo()`; luego crea el objeto final, lo inserta en `state.units` y recién entonces llama a `save()`.
- La producción servida en `https://docente-digital.vercel.app/` y `/app.js` contiene la misma implementación.

**Resultado:** NO PASA.  
**Clasificación:** PARCIALMENTE FUNCIONAL para persistencia final / INEXISTENTE para borrador.  
**Severidad:** S1.

## AUD-DRAFT-252-B — Configuración inicial incompleta ante recarga

**Entrada**  
1. Iniciar configuración desde cero.  
2. Elegir nivel, tipo de IE y uno o más grados.  
3. Recargar antes de `Guardar y entrar`.

**Resultado esperado**  
La configuración parcial debe conservarse o recuperarse de forma comprensible.

**Resultado obtenido**  
`chooseOne()` cambia `state[key]` pero no ejecuta `save()`. Los handlers generados por `renderGrades()` y `renderAreas()` modifican `state.grades`/`state.areas` y vuelven a renderizar, pero tampoco ejecutan `save()`. `finishSetup()` es el punto donde idioma/variedad se copian y se persiste la configuración terminada. Una recarga durante los pasos previos puede descartar las selecciones realizadas desde el último `save()`.

**Resultado:** NO PASA.  
**Clasificación:** PARCIALMENTE FUNCIONAL.  
**Severidad:** S2 ALTO, absorbido por el S1 principal de pérdida de borrador.

## Causa raíz

El modelo de persistencia diferencia principalmente entre objetos terminados (`units`, `lastSession`) y estado global, pero no modela explícitamente **trabajo en curso**. `Continuar mi trabajo` recupera la última sesión generada o una unidad ya creada; no restaura una unidad que el usuario estaba redactando antes de generarla.

## Acción correctiva requerida

Implementar un modelo de borradores pequeño, versionado y reversible, por ejemplo:

- `state.drafts.unit` para tipo, duración, título, contexto y marca temporal;
- `state.setupProgress` para paso actual y selecciones parciales;
- persistencia con debounce en `input/change` y guardado inmediato de elecciones discretas;
- restauración segura al abrir el flujo;
- indicador de estado sencillo (`Guardando…` / `✓ Guardado` / `No pudimos guardar`);
- limpieza del borrador solo después de crear correctamente el documento o mediante descarte explícito;
- prueba de recarga, cierre abrupto, cambio de pantalla y retorno;
- no sobrescribir un documento histórico ya emitido al restaurar un borrador.

## Motivo para no aplicar parche directo en esta ronda

Añadir llamadas `save()` aisladas a algunos botones no resuelve la pérdida del texto de `unitTitle`/`unitSituation` ni define el ciclo de vida del borrador. Un parche parcial podría crear una falsa sensación de autoguardado. La corrección debe abarcar persistencia + restauración + estado visible + limpieza controlada y luego repetirse la batería V5.

## Riesgo de regresión

Medio. Toca estado persistente y navegación. Debe probar migración desde `docenteDigitalPrototype` existente, cambio de IE/rol, reset, creación final, edición posterior y no restaurar borradores obsoletos sobre documentos ya creados.

## Impacto en indicadores

- **IUD:** negativo: reescritura de información tras interrupción.
- **ICGD:** negativo: el trabajo en curso no tiene trazabilidad/persistencia.
- **IFR:** no calcular definitivamente; la recuperación de tareas todavía no está demostrada.
- **ISU:** no calcular definitivamente; incumple guardado automático y continuar donde quedó.
- **Prelaunch:** bloquea por requisito V5 de persistencia/recuperación hasta prueba real.

## Estado de lanzamiento

DocenteDigital **NO está lista para lanzamiento V1.0** mientras este y otros bloqueantes V5 sigan abiertos o pendientes de prueba real.