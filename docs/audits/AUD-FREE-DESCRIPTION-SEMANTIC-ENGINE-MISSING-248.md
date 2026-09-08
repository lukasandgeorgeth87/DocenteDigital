# AUD-FREE-DESCRIPTION-SEMANTIC-ENGINE-MISSING-248

## Resumen

**Estado:** NO PASA  
**Clasificación:** PARCIALMENTE FUNCIONAL  
**Severidad:** S2 ALTO  
**Gate V5:** afecta coherencia del recorrido Unidad/Proyecto y bloquea declarar comprensión semántica robusta.

DocenteDigital recibe descripciones libres, pero el runtime base no demuestra el Núcleo IA obligatorio. La interpretación principal de Unidad/Proyecto se resuelve mediante bancos cerrados de expresiones regulares y respuestas predeterminadas para título, situación significativa y producto. Esto contradice `docs/NUCLEO_IA_DOCENTEDIGITAL.md`, que exige interpretar la intención completa y dispone que los bancos de palabras sean solo apoyo, nunca el motor principal.

## Evidencia de código

En `app.js`:

- `proposeUnitTitle(brief,type)` decide principalmente mediante cuatro familias de regex: siembra/tubérculos, Pachamama, agua y residuos/contaminación; fuera de ellas devuelve un título genérico centrado en “nuestra comunidad”.
- `expandSituation(brief)` repite la misma clasificación por palabras y, si no coincide, produce una situación genérica con “comunidad”.
- `proposeProduct(brief,type)` repite las mismas familias y, fuera de ellas, devuelve un producto genérico.

El código no demuestra en estas funciones un perfil semántico estructurado que preserve foco, finalidad, problema/interés, actores, territorio, restricciones, datos explícitos/inferidos/faltantes, contradicciones y confianza antes de proponer.

## Pruebas

### AUD-SEM-248-A — Finalidad X→Y / biohuerto

**Entrada:** `En Ccotataqui se realiza la siembra de tubérculos y productos verdes. Hablaremos sobre esos conocimientos y los volcaremos para sembrar hortalizas en nuestro biohuerto.`

**Resultado esperado:** comprender que la siembra comunal es la fuente de aprendizaje y que la finalidad es aplicar esos saberes para sembrar hortalizas en el biohuerto; esa finalidad debe gobernar título, situación, reto, producto y secuencia.

**Resultado obtenido por la lógica desplegable del repositorio:** la palabra `siembra` activa la primera rama de `proposeUnitTitle()` y propone `Aprendemos y participamos en la siembra de nuestra comunidad`. `expandSituation()` entra también en la rama de siembra y centra el texto en la época de siembra, tubérculos, saberes familiares y comunidad. `proposeProduct()` devuelve una muestra/libro comunitario sobre la siembra. La finalidad explícita “aplicar esos saberes al biohuerto” no gobierna la propuesta.

**Evidencia:** `app.js`, funciones `proposeUnitTitle`, `expandSituation`, `proposeProduct`.

**Resultado:** NO PASA.  
**Severidad:** S2 ALTO.  
**Clasificación:** PARCIALMENTE FUNCIONAL.

### AUD-SEM-248-B — Caso hormigas en el aula

**Entrada:** `En el aula aparecieron hormigas y los niños quieren saber por qué vienen, cómo viven y qué podemos hacer para mantener limpio el aula sin dañarlas.`

**Resultado esperado:** reconocer curiosidad/interés y propósito de indagación/cuidado; conservar “aula”, “hormigas” y “sin dañarlas”; no convertir automáticamente el caso en una situación comunal genérica.

**Resultado obtenido por la lógica del repositorio:** ninguna de las regex de `proposeUnitTitle()` coincide, por lo que retorna el fallback `Aprendemos a partir de situaciones de nuestra comunidad` para Unidad. `expandSituation()` usa el fallback `En el contexto de [texto]...` y vuelve a introducir “experiencias... de la comunidad”; `proposeProduct()` retorna un conjunto genérico de producciones/evidencias. No existe una interpretación estructurada que clasifique explícitamente curiosidad, finalidad y restricciones del pedido.

**Resultado:** NO PASA.  
**Severidad:** S2 ALTO.  
**Clasificación:** PARCIALMENTE FUNCIONAL.

### AUD-SEM-248-C — Tema fuera del banco

**Entrada:** una descripción libre pertinente cuyo foco no contenga siembra/tubérculos, Pachamama, agua o residuos/contaminación.

**Resultado esperado:** interpretar el significado aunque las expresiones nunca hayan sido programadas.

**Resultado obtenido:** el título y producto caen en fallbacks genéricos; no hay evidencia de un motor semántico previo a la generación en este camino base.

**Resultado:** NO PASA.  
**Severidad:** S2 ALTO.

## Causa raíz

La comprensión está implementada en el runtime base como clasificación heurística por palabras/regex y fallbacks. Falta demostrar la arquitectura exigida por el Núcleo IA: `Comprender → estructurar significado → verificar contexto/normativa → proponer → auditar coherencia → permitir decisión`, con IA semántica real más guardas locales estructuradas.

## Acción correctiva

No se aplica un parche de palabras nuevas porque solo ampliaría el banco cerrado y ocultaría la causa raíz. La corrección necesita:

1. construir un `semanticProfile` estructurado a partir del texto original;
2. separar foco, fuente de aprendizaje, finalidad, problema/interés/oportunidad, actores, territorio, restricciones, productos explícitos y nivel de confianza;
3. usar ese perfil como entrada única para título, situación, reto, producto, actividades, sesiones y evaluación;
4. conservar el texto original y la procedencia de cada dato;
5. usar bancos/regex únicamente como guardas o apoyo, no como motor principal;
6. añadir pruebas automatizadas de biohuerto, hormigas, textos urbanos/rurales/EIB/monolingües, mala ortografía, finalidades múltiples y términos desconocidos;
7. no declarar la función FUNCIONAL hasta demostrar pruebas reales con IA y anti-alucinación.

## Corrección realizada en esta auditoría

No se modificó lógica funcional. Este defecto requiere IA semántica real, decisiones de arquitectura y pruebas anti-alucinación; simularlo con más regex incumpliría las especificaciones. Se documenta como pendiente verificable.

## Riesgo de regresión

**Alto** si se intenta corregir agregando palabras clave: casos nuevos seguirían fallando y podrían cambiar resultados previamente esperados. La migración debe conservar históricos ya emitidos.

## Impacto en indicadores

- **IUD:** impacto negativo por pertinencia de Unidad/Proyecto.
- **ICGD:** impacto negativo por incoherencia potencial entre intención, título, situación, reto, producto y sesiones.
- **IFR:** afecta confiabilidad funcional de generación contextual.
- **ISU:** no se calcula; una interfaz simple no compensa comprensión incorrecta.
- **Prelaunch:** no se calcula; el hallazgo refuerza que el Gate V5 permanece abierto.

## Fuente normativa externa

No se aplicó ni se declaró vigente una norma MINEDU/UGEL externa para este hallazgo. La exigencia proviene de las especificaciones internas obligatorias, especialmente `docs/NUCLEO_IA_DOCENTEDIGITAL.md`, y debe complementarse con verificación oficial cuando una generación concreta invoque normativa.
