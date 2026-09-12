# AUD-SEMANTIC-CORE-KEYWORD-TEMPLATES-209

## Estado
- Fecha de auditoría inicial: 2026-09-06
- Revalidación: 2026-09-12
- Módulo: Unidad / Proyecto → comprensión de contexto → título → situación significativa → reto → producto
- Resultado: **NO PASA**
- Severidad: **S1 CRÍTICO**
- Clasificación: **PARCIALMENTE FUNCIONAL / SEMÁNTICAMENTE ROTA para descripciones libres**
- Gate V5: **BLOQUEADO**

## Especificaciones aplicadas
Se aplican conjuntamente:
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

El Núcleo IA exige: **Comprender → estructurar significado → verificar contexto/normativa → proponer → auditar coherencia → decisión profesional**; prohíbe usar bancos cerrados de palabras/títulos/productos como inteligencia principal y exige preservar la finalidad explícita.

## Evidencia productiva revalidada
La producción canónica carga `app.js`, `enhancements.js` y, mediante el cargador estable de `schedule-prompt-v6.js`, también carga transitivamente `context-semantic-v20.js` y otros módulos de apoyo semántico.

La corrección de cableado no demuestra todavía comprensión semántica suficiente. `context-semantic-v20.js` se autodefine como **“detección léxica preliminar, no sustituye comprensión semántica”** y declara expresamente que conserva expresiones explícitas pero **NO infiere intención, finalidad ni relaciones causales**. Su salida usa `analysisType:'lexical-preliminary'`.

En el runtime base siguen existiendo generadores por expresiones regulares y plantillas (`proposeUnitTitle()`, `expandSituation()`, `proposeProduct()` y lógica equivalente de apoyo). Por ello, mientras no exista evidencia E2E de que una capa semántica posterior gobierna efectivamente las salidas finales y supera los casos de prueba siguientes, el hallazgo no puede cerrarse por mera presencia/carga de módulos.

## Prueba 209-A — finalidad X→Y / biohuerto
### ID
`AUD-SEM-209-A`

### Entrada
“En Ccotataqui se realiza la siembra de tubérculos y productos verdes. Hablaremos sobre esos conocimientos y los volcaremos para sembrar hortalizas en nuestro biohuerto.”

### Resultado esperado
La comprensión debe distinguir:
- fuente de aprendizaje: saberes de la siembra;
- finalidad: aplicar esos saberes para sembrar hortalizas en el biohuerto.

Título, situación significativa, reto, producto, actividades y evidencias deben conducir al biohuerto.

### Resultado obtenido verificable en esta revalidación
El módulo `context-semantic-v20.js` actualmente desplegado no puede demostrar por sí mismo esa relación X→Y porque declara que no infiere finalidad ni relaciones causales. La existencia de módulos posteriores no constituye evidencia suficiente de resultado final correcto sin ejecutar y capturar la salida completa del flujo Unidad/Proyecto.

### Resultado vigente
**NO PASA por evidencia insuficiente de comprensión semántica E2E — S1 CRÍTICO.**

## Prueba 209-B — contexto libre no previsto / hormigas
### ID
`AUD-SEM-209-B`

### Entrada
“En el aula aparecieron hormigas y los niños quieren saber por qué vienen, cómo viven y qué podemos hacer para mantener limpio el aula sin dañarlas.”

### Resultado esperado
Interpretar interés/curiosidad, finalidad de indagación/cuidado, conservar `aula`, `hormigas` y `sin dañarlas`, y no convertir automáticamente el caso en una situación comunal genérica.

### Resultado obtenido verificable en esta revalidación
La capa léxica cargada conserva términos y frases, pero declara que no infiere intención/finalidad/causalidad. No existe en esta auditoría evidencia E2E capturada de que el resultado final clasifique correctamente curiosidad, restricciones y propósito sin apoyarse en fallbacks genéricos.

### Resultado vigente
**NO PASA por evidencia insuficiente de comprensión semántica E2E — S1 CRÍTICO.**

## Prueba 209-C — territorialidad no rígida
### ID
`AUD-SEM-209-C`

### Entrada
Descripción de siembra que no menciona una localidad concreta.

### Resultado esperado
Conservar únicamente el territorio explícito o dejarlo pendiente; nunca inventar comunidad/localidad.

### Resultado vigente
**PENDIENTE DE REPRUEBA E2E.** La existencia histórica de plantillas rígidas obliga a mantener esta prueba como regresión, pero no se afirma en esta revalidación que la salida final actual siga insertando una localidad concreta sin ejecutar el flujo completo.

## Causa raíz vigente
Existe una diferencia entre **módulos cargados** y **comprensión demostrada**. El runtime sí carga una cadena amplia de módulos semánticos, pero la capa observada directamente se declara léxica/preliminar. V3 impide aprobar una función por presencia de archivos o código: debe demostrarse con entrada, resultado esperado, resultado obtenido y evidencia.

## Acción correctiva
No agregar más palabras clave. Para cerrar el hallazgo se requiere:
1. demostrar un `semanticProfile` estructurado con foco, intención, finalidad, situación, actores, territorio, restricciones, producto explícito, faltantes, confianza y procedencia;
2. demostrar que ese perfil gobierna título, situación, reto, producto, actividades, sesiones y evaluación;
3. ejecutar en producción los golden tests de biohuerto, hormigas, contexto urbano/rural, EIB/monolingüe, mala ortografía, finalidades múltiples y términos desconocidos;
4. conservar evidencia de salida antes/después y anti-alucinación;
5. no declarar FUNCIONAL hasta que las pruebas E2E pasen.

## Corrección aplicada en la revalidación 2026-09-12
Se corrigió únicamente la evidencia del informe: ya no se afirma que `context-semantic-v20.js` esté fuera del grafo productivo. Está cargado transitivamente por `schedule-prompt-v6.js`. Este ajuste evita un falso argumento técnico sin cerrar el déficit semántico.

## Riesgo de regresión
**Alto.** La cadena contiene múltiples módulos y overrides; presencia/carga no garantiza que el perfil semántico gobierne la salida final. Cambios de orden pueden reactivar generadores/fallbacks anteriores.

## Impacto en indicadores
- IUD: afectado cualitativamente hasta probar pertinencia real.
- ICGD: afectado hasta demostrar coherencia intención → reto → producto → secuencia.
- IFR: afectado por riesgo de reelaboración silenciosa.
- ISU: no se calcula definitivamente.
- Prelaunch: **BLOQUEADO mientras este S1 y demás bloqueantes no tengan evidencia de cierre.**

## Pendientes de evidencia real V5
Usuarios reales, dispositivo móvil físico, 100 generaciones, Word/PDF/impresión físicos, año completo, concurrencia cuando exista backend multiusuario, restore real, aislamiento/seguridad y pilotos.

## Conclusión
DocenteDigital no puede declararse lista para V1.0 por la sola existencia o carga de módulos semánticos. Debe demostrar que comprende la intención completa y conserva finalidad, restricciones y territorialidad en salidas reales de extremo a extremo.