# AUD-EXPERT-SESSION-TITLE-OVERWRITE-250

## Resumen ejecutivo

**Hallazgo:** en Modo Experto el campo `Título de la sesión` se vuelve editable, pero al pulsar `PREPARAR MI SESIÓN MAESTRA` `generateSession()` ejecuta nuevamente `syncTitle()` antes de construir la sesión. `syncTitle()` reemplaza el valor escrito por el docente con el título automático de la actividad seleccionada. La decisión profesional se descarta silenciosamente.

**Clasificación:** ROTA para personalización del título en Modo Experto; FUNCIONAL para el título automático en Modo Fácil.

**Severidad:** S2 ALTO.

**Gate V5:** no añade por sí solo un S0/S1, pero impide considerar confiable la edición experta y afecta títulos naturales, persistencia de decisiones y trazabilidad.

## Especificaciones obligatorias aplicadas

- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

V3 exige comprobar funcionalidad real, no solo presencia de controles. V4 exige que el Modo Experto permita mayor control sin hacer perder trabajo y que los títulos sean naturales y útiles. El Núcleo IA reserva la decisión profesional final al docente/director. V5 exige probar interrupciones, persistencia y operaciones reales antes del lanzamiento.

## Evidencia técnica

### `syncTitle()`

```js
function syncTitle(){
  const title=byId('sessionTitle'),activitySelect=byId('activity');if(!title||!activitySelect)return;
  const {activity}=selectedActivity();
  title.value=activity?.title||activitySelect.options[activitySelect.selectedIndex]?.textContent||'';
  title.readOnly=state.mode==='easy';
}
```

La función hace dos cosas distintas: sincroniza el valor y cambia `readOnly`. Aunque el modo sea Experto, siempre reasigna `title.value`.

### `generateSession()`

```js
function generateSession(){
  syncTitle();
  const session=buildSession();
  renderSessionOutput(session);
}
```

Por tanto, cualquier edición manual realizada después de que el campo quedó editable es reemplazada justo antes de `buildSession()`.

### `buildSession()`

`buildSession()` sí intenta usar el valor del campo:

```js
const title=byId('sessionTitle')?.value||activity?.title||'Sesión de aprendizaje';
```

pero para ese momento `generateSession()` ya lo restableció.

## Prueba AUD-EXP-TITLE-250-A — Modo Experto

**Entrada:**
1. Abrir una sesión con una actividad, por ejemplo `Medimos espacios para organizar nuestra feria`.
2. Activar Modo Experto.
3. Cambiar el título a `Medimos nuestro biohuerto para organizar la siembra`.
4. Pulsar `PREPARAR MI SESIÓN MAESTRA`.

**Resultado esperado:** la sesión debe conservar exactamente el título editado por el docente, salvo validación explícita que le informe y solicite una decisión.

**Resultado obtenido por ejecución determinista del código:** `generateSession()` llama `syncTitle()` y el campo vuelve al título de la actividad antes de construir el objeto sesión. La edición manual no llega a `state.lastSession`.

**Evidencia:** `app.js` → `syncTitle()`, `generateSession()`, `buildSession()`.

**Resultado:** NO PASA.

**Clasificación:** ROTA.

**Severidad:** S2 ALTO.

**Acción correctiva:** separar la sincronización automática del cambio de `readOnly`. En Modo Fácil se puede mantener el título automático; en Modo Experto la generación debe preservar el valor manual no vacío. El cambio debe probar además alternando Fácil↔Experto para no destruir texto sin advertencia.

## Prueba AUD-EXP-TITLE-250-B — Modo Fácil

**Entrada:** mantener Modo Fácil, cambiar de actividad y generar la sesión.

**Resultado esperado:** el título debe copiarse automáticamente de la actividad y no ser editable.

**Resultado obtenido:** `syncTitle()` actualiza el título y `title.readOnly=true` en Modo Fácil.

**Resultado:** PASA técnicamente en la inspección determinista.

**Clasificación:** FUNCIONAL para este requisito puntual.

## Causa raíz

`syncTitle()` mezcla dos responsabilidades: sincronización del contenido y política de editabilidad. `generateSession()` la invoca incondicionalmente, por lo que el comportamiento válido del Modo Fácil invade el Modo Experto.

## Relación con hallazgos anteriores

No duplica `AUD-EXPERT-MODE-SIMULATED-233`, que documenta que el Modo Experto carece de controles curriculares/evaluativos suficientes. AUD-250 demuestra un defecto adicional y concreto: **el único campo que sí se habilita para edición experta puede perder el cambio al generar**.

Tampoco duplica los hallazgos de títulos de Unidad/Proyecto; este caso pertenece a Sesión y a la transición edición → generación.

## Corrección automática en esta ronda

No se modificó el runtime en esta pasada. La corrección lógica es pequeña, pero el archivo productivo `app.js` es un núcleo compartido y la evidencia V3 exige volver a probar el flujo Fácil, Experto, cambio de actividad y alternancia de modos. Se documenta primero el defecto para no declarar como corregido algo que aún no ha sido ejecutado en navegador.

La próxima corrección segura debe, como mínimo:

1. impedir que `generateSession()` sobrescriba un título manual en Experto;
2. conservar sincronización automática en Fácil;
3. definir qué ocurre si se cambia de actividad después de editar el título;
4. evitar pérdida al alternar Experto → Fácil → Experto;
5. comprobar persistencia en `state.lastSession` y exportación Word;
6. verificar navegador productivo después del despliegue.

## Riesgo de regresión

Medio. Un parche demasiado simple puede conservar títulos obsoletos cuando el usuario cambia de actividad o puede romper el comportamiento automático del Modo Fácil.

## Impacto

- **IUD:** negativo: la acción del docente no se conserva.
- **ICGD:** negativo: título visible, sesión guardada y actividad pueden divergir respecto de la intención profesional.
- **IFR:** negativo parcial por pérdida silenciosa de una edición válida; no se calcula valor definitivo.
- **ISU:** negativo por comportamiento inesperado; no se calcula valor definitivo.
- **Prelaunch:** permanece bloqueado por S0/S1 acumulados y pruebas esenciales pendientes.

## Normativa externa

Este hallazgo se deriva exclusivamente de las especificaciones internas obligatorias y de la implementación observada. No fue necesario aplicar ni declarar vigente una norma MINEDU/UGEL externa.

## Estado de lanzamiento

**DocenteDigital continúa NO APROBADA PARA LANZAMIENTO V1.0.** La puntuación alta de cualquier dimensión no puede ocultar los S0/S1 ya abiertos ni las pruebas reales que V5 mantiene pendientes.