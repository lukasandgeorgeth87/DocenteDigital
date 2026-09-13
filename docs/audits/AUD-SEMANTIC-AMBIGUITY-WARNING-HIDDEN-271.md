# AUD-SEMANTIC-AMBIGUITY-WARNING-HIDDEN-271

## Alcance

Auditoría integrada de `NUCLEO_IA_DOCENTEDIGITAL.md`, V3, V4 y V5 sobre la comprensión de descripciones libres dentro del flujo Unidad/Proyecto.

## Hallazgo

El motor de sentido `meaning-engine-v25.js` genera una advertencia visible `.dd-meaning-warning` cuando la confianza de la interpretación local es menor de 50. El mensaje informa que la interpretación es preliminar, enumera vacíos como ausencia de problema/oportunidad, finalidad o actores, y declara que la aplicación no inventará esos datos.

Sin embargo, `simple-planning-ui-v48.js` v50 ocultaba esa advertencia mediante `display:none!important` junto con telemetría interna. Esto mezclaba dos categorías distintas:

- telemetría técnica que V4 exige mantener fuera de la interfaz normal (porcentajes, cuadrículas internas, diagnósticos);
- una advertencia de decisión para el docente cuando la comprensión es insuficiente, que el Núcleo IA exige no fingir ni ocultar.

La secuencia estable de `schedule-prompt-v6.js` carga `meaning-engine-v25.js` antes de `simple-planning-ui-v48.js`, por lo que la regla CSS posterior anulaba efectivamente la advertencia producida por el motor.

## Prueba AUD-SEM-271-A

**Entrada:** descripción de Unidad/Proyecto suficientemente larga para analizar, pero sin finalidad clara, actores principales ni problema/oportunidad distinguible.

**Resultado esperado:** conservar una interfaz simple, sin porcentajes ni telemetría técnica, pero advertir en lenguaje comprensible que la interpretación es preliminar y qué información conviene precisar antes de confiar en la propuesta.

**Resultado obtenido antes de la corrección:** `meaning-engine-v25.js` construía `.dd-meaning-warning`, pero `simple-planning-ui-v48.js` la ocultaba incondicionalmente con CSS.

**Evidencia:**
- Núcleo IA: cuando la comprensión es insuficiente la app no debe fingir seguridad y debe distinguir comprensión sólida/razonable/preliminar; solo debe preguntar cuando la falta impida generar correctamente.
- `meaning-engine-v25.js`: calcula `status`, `gaps` y construye `<div class="dd-meaning-warning">...` cuando `confidence < 50`.
- `simple-planning-ui-v48.js` v50 previo: incluía `.dd-meaning-warning` en el selector oculto de `#ddIntentBox`.
- `schedule-prompt-v6.js`: carga estable `meaning-engine-v25.js` antes de `simple-planning-ui-v48.js`.

**Estado previo:** NO PASA.

**Clasificación previa:** PARCIALMENTE FUNCIONAL.

**Severidad:** S2 ALTO. La aplicación podía ofrecer títulos/propuesta mientras ocultaba al usuario que la comprensión local era preliminar y que faltaban datos relevantes. No se clasifica S1 porque no se demostró en esta prueba un documento pedagógico incorrecto concreto ni una invención ya emitida.

## Causa raíz

La simplificación de V4 trató una advertencia semántica accionable como si fuera telemetría técnica. El objetivo correcto era ocultar porcentajes, palabras clave y diagnósticos internos, no ocultar señales de incertidumbre que ayudan al profesional a decidir.

## Corrección aplicada

Commit funcional `83374055c559ec815278266ceaa8a9862a9cc4ac` (`fix: keep semantic ambiguity warning visible`).

`simple-planning-ui-v48.js` pasa a v50.1 y elimina `.dd-meaning-warning` del selector oculto. Se mantienen ocultos:

- `#ddKeywordBox`;
- `#ddProposalKeywords`;
- `#ddGoalDetected`;
- `#ddTitleSuggestions`;
- cuadrícula interna de interpretación;
- síntesis técnica;
- filas de claridad/porcentaje mediante las otras guardas visuales.

La advertencia semántica conserva el texto breve generado por el motor y no expone porcentajes ni parámetros internos.

## Reprueba AUD-SEM-271-R1

**Entrada:** inspección integrada del orden de módulos y de las reglas CSS después del parche.

**Esperado:** la advertencia `.dd-meaning-warning` no debe quedar anulada por la capa de simplicidad.

**Obtenido:** el selector v50.1 ya no contiene `.dd-meaning-warning`; `meaning-engine-v25.js` continúa generando la advertencia cuando `confidence < 50`.

**Estado:** PASA EN IMPLEMENTACIÓN.

**Clasificación:** FUNCIONAL EN IMPLEMENTACIÓN / E2E REAL PENDIENTE.

## Pruebas reales pendientes

No se declara cierre V5 hasta ejecutar en navegador real al menos:

1. descripción ambigua corta y extensa;
2. finalidad ausente;
3. actores ausentes;
4. interés sin problema, verificando que no se invente uno;
5. caso biohuerto X→Y;
6. caso hormigas en el aula;
7. descripción contradictoria;
8. móvil y teclado;
9. confirmar que la advertencia desaparece cuando la interpretación deja de ser preliminar;
10. confirmar que el flujo no bloquea innecesariamente cuando la información faltante no es indispensable.

## Riesgo de regresión

Bajo. El cambio solo modifica una regla CSS de visibilidad y no altera el perfil semántico, los productos, títulos, persistencia ni generación. Debe vigilarse que futuras capas de “simplificación” no vuelvan a ocultar advertencias accionables.

## Impacto en índices/gates

- IUD/ICGD: mejora cualitativa de coherencia entre interpretación y decisión del usuario; sin puntuación definitiva.
- IFR: sin puntuación definitiva.
- ISU: mejora de claridad de error/incertidumbre, pero pendiente de usuarios reales.
- Prelaunch: no modifica el gate general; V5 continúa BLOQUEADO mientras falten pruebas reales esenciales.

## Estado de lanzamiento

DocenteDigital NO se declara lista para V1.0 por este cambio. La corrección elimina un defecto de visibilidad semántica, pero no sustituye las pruebas E2E, móviles, exportación física, 100 generaciones, seguridad, restore real, año completo, escala ni pilotos.