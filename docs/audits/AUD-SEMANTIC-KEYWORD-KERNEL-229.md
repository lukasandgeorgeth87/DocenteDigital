# AUD-SEMANTIC-KEYWORD-KERNEL-229

## Alcance
Auditoría acumulativa de DocenteDigital contra `AUDITORIA_MAESTRA_INTEGRAL_V2.md`, `ADENDA_AUDITORIA_EJECUTABLE_V3.md`, `AUDITORIA_SIMPLICIDAD_USO_V4.md`, `AUDITORIA_PRELANZAMIENTO_V5.md` y `NUCLEO_IA_DOCENTEDIGITAL.md`.

## Hallazgo
El flujo productivo de Unidad/Proyecto no implementa todavía el perfil semántico y la cadena **Comprender → estructurar significado → verificar contexto → proponer → auditar coherencia** definida por el Núcleo IA. En `app.js`, las funciones `proposeUnitTitle`, `expandSituation` y `proposeProduct` deciden principalmente mediante expresiones regulares cerradas (`siembr|papa|tarpuy|añu|oca|olluco`, `pachamama`, `agua|yaku`, `residuo|basura|contamin`) y, si no hay coincidencia, caen en títulos, situaciones y productos genéricos. `createUnitDemo()` llama directamente a esas funciones y guarda el resultado sin construir un perfil semántico estructurado, sin finalidad separada, sin confianza de interpretación, sin contradicciones, sin datos faltantes ni auditoría semántica previa a la entrega.

Esto contradice de forma directa el Núcleo IA, que prohíbe usar bancos cerrados como inteligencia principal, exige conservar la finalidad por encima de la palabra dominante y demanda comprender expresiones nuevas como intereses, problemas, oportunidades, prácticas, términos locales y finalidades explícitas.

## Evidencia técnica
Código de producción verificado en `https://docente-digital.vercel.app/app.js` y rama `main`:

- `proposeUnitTitle(brief,type)` contiene cuatro grupos de regex y luego retorna un título genérico.
- `expandSituation(brief)` contiene las mismas familias temáticas y luego retorna una situación genérica.
- `proposeProduct(brief,type)` contiene las mismas familias temáticas y luego retorna un producto genérico.
- `createUnitDemo()` ejecuta esas funciones directamente.
- No existe, en esa cadena, un objeto equivalente al perfil semántico obligatorio con `intention`, `purpose/finality`, `problemNeedOpportunityInterest`, `actors`, `territory`, `languageProfile`, `missingData`, `ambiguities`, `confidence` y procedencia.

## Prueba 229-A — finalidad biohuerto desplazada por palabra dominante
**ID:** AUD-SEM-229-A  
**Módulo:** Unidad/Proyecto → comprensión de descripción libre  
**Entrada:** `En Ccotataqui se realiza la siembra de tubérculos y productos verdes. Hablaremos sobre esos conocimientos y los volcaremos para sembrar hortalizas en nuestro biohuerto.`  
**Resultado esperado:** identificar dos relaciones diferentes: fuente de aprendizaje = saberes de la siembra; finalidad = aplicar esos saberes para sembrar hortalizas en el biohuerto. El título, situación, reto, producto y secuencia deben conservar esa relación X→Y.  
**Resultado obtenido determinista por código:** al detectar `siembr`, `proposeUnitTitle()` retorna `Aprendemos y participamos en la siembra de nuestra comunidad`; `expandSituation()` entra en la rama de siembra y centra el reto en comprender/explicar/valorar la siembra de la comunidad; `proposeProduct()` retorna una `Libro o muestra comunitaria sobre la siembra...`. La finalidad explícita `aplicar ... para sembrar hortalizas en nuestro biohuerto` no controla la propuesta.  
**Estado:** NO PASA  
**Clasificación:** PARCIALMENTE FUNCIONAL / semántica central SIMULADA por reglas cerradas  
**Severidad:** S1 CRÍTICO  
**Causa raíz:** selección por coincidencia léxica antes que interpretación de relaciones y finalidad.  
**Acción correctiva:** introducir un `SemanticProfile` previo a la generación que separe texto original, foco, finalidad, fuente de aprendizaje, problema/necesidad/interés, producto explícito, contexto y confianza; después generar título/situación/reto/producto desde ese perfil y auditar coherencia antes de guardar.

## Prueba 229-B — caso hormigas en el aula
**ID:** AUD-SEM-229-B  
**Módulo:** Unidad/Proyecto → comprensión de interés infantil  
**Entrada:** `Los estudiantes quieren saber por qué aparecen hormigas en el aula, cómo encuentran alimento y qué podemos observar para conocerlas mejor.`  
**Resultado esperado:** interpretar un **interés/curiosidad de los estudiantes**, conservar `hormigas` y `aula`, no transformarlo automáticamente en problema comunitario y proponer un título natural relacionado con la indagación de las hormigas.  
**Resultado obtenido determinista por código:** no coincide con ninguna familia regex; para Unidad `proposeUnitTitle()` retorna `Aprendemos a partir de situaciones de nuestra comunidad`; `expandSituation()` usa el fallback `En el contexto de [texto]...` y agrega preguntas genéricas sobre comprender/mejorar la situación; `proposeProduct()` devuelve `Conjunto organizado de producciones y evidencias...`. El sistema no clasifica la entrada como interés/curiosidad ni genera una propuesta específica sobre las hormigas.  
**Estado:** NO PASA  
**Clasificación:** PARCIALMENTE FUNCIONAL; comprensión libre = ROTA para entradas fuera del banco  
**Severidad:** S1 CRÍTICO  
**Causa raíz:** fallback genérico y ausencia de representación semántica del interés infantil.  
**Acción correctiva:** misma capa semántica de 229-A más golden test obligatorio `hormigas en el aula`, verificando que título, situación, reto, producto y actividades mantengan foco y tipo de situación sin inventar conflicto.

## Prueba 229-C — territorialidad rígida por fallback
**ID:** AUD-SEM-229-C  
**Módulo:** Unidad/Proyecto → territorialidad  
**Entrada:** descripción de contexto urbano o escolar sin referencia a comunidad, por ejemplo `En el aula los estudiantes observan hormigas cerca de las loncheras y quieren investigar cómo encuentran alimento.`  
**Resultado esperado:** conservar `aula` como lugar real y no imponer una territorialidad rural/comunal inexistente.  
**Resultado obtenido:** el título fallback incorpora `nuestra comunidad`; `purpose` se fija como `articulando saberes de la comunidad y conocimientos escolares`; varias variantes de actividades agregan `comunidad`, `familias`, `saberes locales` aunque esos datos no proceden de la entrada.  
**Estado:** NO PASA  
**Clasificación:** territorialidad = PARCIALMENTE FUNCIONAL / RÍGIDA  
**Severidad:** S2 ALTO, absorbido por el S1 semántico global.  
**Causa raíz:** supuestos territoriales hardcodeados en textos base.

## Impacto V2/V3/V4/V5/Núcleo IA
- **V2:** degrada coherencia Unidad → Sesiones → evidencias porque la intención inicial puede quedar mal representada desde el origen.
- **V3:** la función responde y guarda, pero no demuestra corrección semántica; por tanto no puede aprobarse.
- **V4:** “crear con una frase” existe superficialmente, pero el usuario necesita corregir resultados cuando su caso no pertenece al banco; esto aumenta reelaboración.
- **V5:** afecta el E2E Docente desde Unidad/Proyecto y la batería de anti-alucinación/coherencia; mantiene cerrado el gate mientras pueda producir unidades pedagógicamente desviadas.
- **Núcleo IA:** incumple las reglas 1, 2, 3, 4, 5, 6, 7, 9, 10 y 11 sobre perfil semántico, finalidad, bancos cerrados, guardas, herencia, situación significativa, reto, confianza y auditoría semántica.

## Riesgo de regresión
ALTO. Un parche agregando nuevas palabras (`hormiga`, `biohuerto`, etc.) ampliaría el banco pero conservaría la causa raíz. No corregir mediante más regex temáticas. La prueba debe incluir temas nunca programados previamente y variaciones de redacción.

## Corrección aplicada en esta auditoría
No se modificó lógica productiva. La corrección requiere arquitectura semántica/IA real, contrato de salida estructurado, guardas y decisiones pedagógicas; no es un cambio pequeño y seguro. Solo se documentó el hallazgo verificable.

## Evidencia pendiente obligatoria
PENDIENTE: pruebas con IA real, golden tests validados por especialista, 100 generaciones, usuarios docentes reales, medición de reelaboración y continuidad del significado hasta Sesión/Materiales/Evaluación/Registro.

## Gate
**DocenteDigital NO está lista para lanzamiento V1.0.** Este S1 se suma a los bloqueantes ya abiertos y no autoriza calcular ISU/IFR/Prelaunch Score definitivos.
