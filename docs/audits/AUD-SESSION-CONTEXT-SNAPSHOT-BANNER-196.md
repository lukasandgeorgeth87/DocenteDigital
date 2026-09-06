# AUD-SESSION-CONTEXT-SNAPSHOT-BANNER-196

## Alcance

Auditoría incremental basada conjuntamente en `AUDITORIA_MAESTRA_INTEGRAL_V2.md`, `ADENDA_AUDITORIA_EJECUTABLE_V3.md`, `AUDITORIA_SIMPLICIDAD_USO_V4.md`, `AUDITORIA_PRELANZAMIENTO_V5.md` y `NUCLEO_IA_DOCENTEDIGITAL.md`.

Este hallazgo no declara vigencia de una norma MINEDU, UGEL o legal externa. Se deriva de requisitos internos de trazabilidad, conservación histórica, simplicidad y herencia del contexto; por ello no se aplica aquí ninguna norma externa sin verificación oficial.

## ID de prueba

`AUD-SESSION-CONTEXT-SNAPSHOT-BANNER-196`

## Módulo

Sesiones / Continuar mi trabajo / trazabilidad documental / V4 / V5.

## Clasificación

- Estado global: **PARCIALMENTE FUNCIONAL**.
- Reapertura de sesión histórica tras cambiar datos maestros: **ROTA en coherencia visible del contexto**.
- Severidad: **S2 ALTO**.
- Gate: afecta trazabilidad y claridad V3/V4/V5, pero esta ruta no demuestra por sí sola modificación del contenido histórico guardado.

## Entrada de prueba determinista

1. Crear una sesión cuando la configuración es, por ejemplo, `Primaria · Multigrado · 1.º, 3.º y 5.º`.
2. Conservar esa sesión como `state.lastSession`.
3. Cambiar posteriormente la configuración general a otro contexto, por ejemplo `Primaria · Polidocente · 2.º`.
4. Ir a Inicio y pulsar `Continuar mi trabajo`.

## Resultado esperado

Al reabrir una sesión histórica, la pantalla debe mostrar como contexto principal el snapshot propio del documento o de su Unidad/Proyecto vinculada. Si se desea mostrar la configuración maestra actual, debe diferenciarse explícitamente de `Contexto del documento` y nunca presentarse como si fuera el contexto reutilizado por esa sesión.

Los documentos históricos no deben modificarse retroactivamente cuando cambian datos maestros, y la interfaz no debe crear una contradicción visual entre el histórico guardado y el estado maestro actual.

## Resultado obtenido

`refresh()` calcula `contextText()` exclusivamente desde el estado global actual (`state.level`, `state.ieType`, `state.grades`, `state.areas`) y escribe ese valor en `#sessionContext` con el mensaje `Contexto cargado` + `La app reutiliza esta información y no vuelve a pedirla.`.

A continuación, `continueWork()` ejecuta `go('session')`, lo cual dispara `refresh()`, y después llama a `renderSessionOutput(state.lastSession)`. `sessionHtml()` renderiza los campos que quedaron guardados en la sesión histórica (`session.level`, `session.ieType`, `session.grades`).

Por diseño, tras cambiar la configuración maestra puede ocurrir simultáneamente:

- banner superior: contexto maestro **nuevo**;
- documento reabierto: snapshot de sesión **anterior**.

La interfaz puede afirmar que está reutilizando un contexto distinto del que realmente contiene el documento mostrado.

## Evidencia

### `app.js`

```js
function contextText(){
  return `${state.level} · ${state.ieType} · ${state.grades.join(', ')} · ${state.areas.join(', ')}`
}

function refresh(){
  ...
  const text=contextText();
  if(byId('sessionContext'))
    byId('sessionContext').innerHTML=`<b>Contexto cargado:</b> ${escapeHtml(text)}<br>La app reutiliza esta información y no vuelve a pedirla.`;
}

function continueWork(){
  if(state.lastSession){
    go('session');
    renderSessionOutput(state.lastSession);
  }
  ...
}
```

El renderer del documento usa los campos almacenados en `session`, no el banner global.

## PASA / NO PASA

**NO PASA.**

## Causa raíz

La superficie `#sessionContext` está ligada a la configuración maestra global y no al documento que se está visualizando. El sistema no distingue visualmente:

1. configuración actual de la IE/docente;
2. snapshot histórico de la Unidad/Proyecto;
3. snapshot histórico de la sesión abierta.

Esto mezcla procedencias distintas en una sola etiqueta de `Contexto cargado`.

## Relación con hallazgos anteriores

No duplica `AUD-SESSION-GRADE-SNAPSHOT-185` ni `AUD-SESSION-LINGUISTIC-SNAPSHOT-193`.

- 185/193: la nueva sesión puede **nacer** con datos globales incorrectos en vez de heredar correctamente su Unidad.
- 196: una sesión **ya guardada** puede reabrirse junto a un banner de contexto maestro posterior incompatible, aun cuando su contenido histórico siga intacto.

## Acción correctiva recomendada

Corrección de bajo riesgo conceptual, pero debe implementarse conjuntamente con el contrato de snapshots pendiente:

1. Cuando existe una sesión mostrada, obtener el banner desde el snapshot de esa sesión o desde su Unidad/Proyecto histórica vinculada.
2. Rotularlo como `Contexto del documento`.
3. No reemplazar el snapshot histórico por datos maestros actuales.
4. Si la configuración actual difiere y el dato es relevante, mostrar una alerta secundaria breve: `La configuración actual cambió desde que se creó esta sesión`, sin alterar automáticamente el histórico.
5. En creación de sesiones nuevas, resolver previamente los hallazgos 185/193 para que el snapshot provenga de la Unidad/Proyecto y no de `state.*` global.
6. Añadir prueba automática: crear sesión A → cambiar configuración → reabrir A → comprobar que banner y documento A coinciden y que A no fue mutada.

No se recomienda parchear únicamente el texto del banner mientras siga pendiente el contrato integral de snapshots, porque podría ocultar la causa raíz.

## Evidencia posterior requerida

- prueba E2E navegador real;
- reabrir sesión histórica tras cambio de nivel/tipo/grados/áreas/perfil lingüístico;
- comprobar que el histórico no cambia;
- comprobar que la configuración actual tampoco es sobrescrita por abrir el histórico;
- móvil real;
- exportación Word del histórico antes/después para verificar que los datos emitidos permanecen estables.

## Riesgo de regresión

**Medio.** Un parche incorrecto podría copiar el contexto histórico de vuelta a la Ficha Maestra o, a la inversa, actualizar retroactivamente documentos ya guardados. Debe mantenerse separación explícita entre `master context` y `document snapshot`.

## Impacto en métricas/gate

- IUD: impacto negativo por contradicción visible y pérdida de confianza.
- ICGD: impacto negativo por procedencia/contexto ambiguos.
- IFR: no se calcula; esta prueba aporta evidencia de coherencia funcional parcial.
- ISU: no se calcula; V4 exige claridad y no hacer pensar al usuario qué contexto es el válido.
- Prelaunch: no se calcula. Continúa bloqueado por S1 previos y pruebas reales esenciales pendientes.

## Decisión de lanzamiento

**DocenteDigital NO queda aprobada para V1.0 por esta auditoría.** El hallazgo se suma al backlog de prelaunch y debe retestearse después de resolver el contrato integral de snapshots.