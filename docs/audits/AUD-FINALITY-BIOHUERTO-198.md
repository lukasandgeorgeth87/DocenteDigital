# AUD-FINALITY-BIOHUERTO-198 — Pérdida de finalidad X→Y en el caso biohuerto

## Alcance
Auditoría ejecutable acumulativa de DocenteDigital conforme a V2 + V3 + V4 + V5 + Núcleo IA.

## Módulo
Carpeta Docente → Unidad/Proyecto → comprensión de descripción libre → título/situación/reto/producto.

## ID de prueba
`AUD-FINALITY-BIOHUERTO-198`

## Entrada
Texto de prueba exigido por el Núcleo IA y por las prioridades de auditoría:

> En Ccotataqui se realiza la siembra de tubérculos y productos verdes. Hablaremos sobre esos conocimientos y los volcaremos para sembrar hortalizas en nuestro biohuerto.

Relación semántica esperada:

- fuente de aprendizaje X = saberes y conocimientos de la siembra;
- finalidad Y = aplicar esos saberes para sembrar hortalizas en el biohuerto.

## Resultado esperado
El sistema debe comprender la relación X→Y y conservar la finalidad explícita en:

- título;
- situación significativa;
- reto;
- producto/acción final;
- secuencia de actividades;
- sesiones y evidencias relacionadas.

No debe reducir el pedido a la palabra dominante `siembra` ni sustituir la finalidad por una plantilla temática genérica.

## Resultado obtenido
El motor creativo productivo `creativity-engine-v14.js` clasifica el texto únicamente por coincidencia temática:

```js
const themeFor=brief=>{
  const s=norm(brief);
  if(/siembr|tarpuy|papa|añu|oca|olluco/.test(s))return'siembra';
  ...
};
```

Después, `ddCreativeTitleOptions()` y `ddCreativeChoices()` seleccionan títulos, situaciones y productos desde bancos cerrados de `siembra` basados en ese tema. El banco de títulos de siembra se centra en semillas, chacra, Hatun Tarpuy, saberes familiares, calendario de siembra y comunidad; el banco de productos se centra en atlas de semillas, maleta del Hatun Tarpuy, calendario comunal, mapa de decisiones de la chacra, banco de semillas, guía de siembra, museo, etc.

La finalidad explícita `aplicar esos saberes para sembrar hortalizas en nuestro biohuerto` no participa como variable estructurada en `themeFor`, `titlePool`, `situationPools` ni `productPool`. El motor conserva el texto bruto en `ctx.raw`, pero cuando el tema se clasifica como `siembra`, las propuestas específicas se extraen del banco temático y no de la relación fuente→finalidad.

Por diseño, este caso puede producir una unidad coherente sobre la siembra, pero no necesariamente la unidad solicitada: aprender de la siembra para aplicar esos conocimientos al biohuerto.

## Evidencia
### Repositorio `main`
`creativity-engine-v14.js`:

- `themeFor()` reduce toda entrada que contenga `siembr|tarpuy|papa|añu|oca|olluco` al tema `siembra`;
- `ddCreativeTitleOptions()` usa `themeFor(brief)` para elegir un banco cerrado de títulos;
- `ddCreativeChoices()` usa el mismo tema para escoger situación y productos;
- los bancos de `siembra` no modelan explícitamente una relación `fuente de aprendizaje → finalidad` ni el destino `biohuerto`.

`context-semantic-v20.js` declara expresamente que su análisis es `lexical-preliminary` y que **NO infiere intención, finalidad ni relaciones causales**. Por tanto, esa capa tampoco resuelve la relación X→Y.

### Producción
`https://docente-digital.vercel.app/creativity-engine-v14.js` respondió HTTP 200 y sirve la misma implementación de `themeFor`, bancos de siembra y selección por tema.

## PASA / NO PASA
**NO PASA.**

## Clasificación funcional
- detección temática de `siembra`: **FUNCIONAL**;
- conservación de términos explícitos: **PARCIALMENTE FUNCIONAL**;
- comprensión de finalidad X→Y: **INEXISTENTE en esta capa / no demostrada E2E**;
- generación fiel al caso biohuerto: **PARCIALMENTE FUNCIONAL / ROTA para la finalidad explícita**.

## Severidad
**S1 CRÍTICO — bloqueante V5.**

### Justificación
El Núcleo IA usa precisamente este caso como ejemplo obligatorio de comprensión semántica y establece que la finalidad debe influir en título, situación, reto, producto, secuencia, sesiones, evidencias y evaluación. V3 clasifica como S1 un documento pedagógicamente incorrecto. Una unidad que trate correctamente la siembra pero pierda el objetivo explícito de transferir esos saberes al biohuerto puede ser pedagógicamente coherente en apariencia y, aun así, responder a otra intención.

## Causa raíz
La inteligencia principal de la generación creativa continúa basada en clasificación temática por expresiones regulares + bancos cerrados. La capa léxica adicional conserva términos pero declara no inferir finalidad. No existe en esta ruta un perfil semántico estructurado con campos del tipo:

- `sourceOfLearning`;
- `goal/finality`;
- `sourceToGoalRelation`;
- `explicitProductOrAction`;
- `confidence`.

## Acción correctiva requerida
1. Incorporar antes de cualquier banco creativo una interpretación semántica estructurada de la descripción libre.
2. Separar `foco/tema`, `fuente de aprendizaje` y `finalidad/resultado esperado`.
3. Para este caso, producir explícitamente algo equivalente a `saberes de la siembra → aplicar en el cultivo de hortalizas del biohuerto`.
4. Hacer que título, situación, reto y producto consuman ese perfil semántico, no solo `themeFor()`.
5. Mantener los bancos únicamente como apoyo de variación lingüística posterior.
6. Añadir golden test determinista para el caso biohuerto y variantes con errores ortográficos, finalidad al inicio/medio/final y formulaciones nuevas.
7. Propagar la finalidad aprobada hacia sesiones, materiales, evaluación y registro.

## Corrección aplicada en esta pasada
**No se modificó el runtime.** La corrección requiere la capa IA semántica/contrato de interpretación definida por el Núcleo IA. Añadir una regex para `biohuerto` sería otro banco de palabras y no resolvería solicitudes nuevas con la misma estructura X→Y.

## Evidencia posterior requerida
- entrada original → perfil semántico con fuente y finalidad separadas;
- título natural que incluya o refleje la transferencia al biohuerto;
- situación sin inventar problema;
- reto que conduzca a aplicar saberes en el biohuerto;
- producto concreto ligado al cultivo/organización/seguimiento del biohuerto;
- sesiones que conduzcan al producto;
- prueba de consistencia con al menos 20 paráfrasis;
- prueba de no regresión en temas sin biohuerto.

## Riesgo de regresión
**Alto** si se corrige solo agregando `biohuerto` a expresiones regulares: podría mejorar este ejemplo y seguir fallando cualquier finalidad nueva no programada.

## Impacto en indicadores
- IUD: negativo, porque el docente debe rehacer título/situación/reto/producto para recuperar la intención.
- ICGD: crítico en coherencia finalidad → producto → sesiones.
- IFR: no aprobable para comprensión libre mientras dependa del tema dominante.
- ISU: no calculable definitivamente; una interfaz simple no compensa interpretar mal el pedido.
- Prelaunch: **bloqueante**.

## Fuente oficial
No se aplicó ni declaró vigente ninguna norma MINEDU/UGEL/legal externa para este hallazgo. La exigencia deriva de las especificaciones internas V2/V3/V4/V5 y, de forma directa, del `NUCLEO_IA_DOCENTEDIGITAL.md`.

## Gate V5
**NO PASA. DocenteDigital no debe declararse lista para V1.0 mientras el caso biohuerto obligatorio pierda la finalidad explícita X→Y.**