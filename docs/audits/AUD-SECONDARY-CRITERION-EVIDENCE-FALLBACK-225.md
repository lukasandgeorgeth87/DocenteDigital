# AUD-SECONDARY-CRITERION-EVIDENCE-FALLBACK-225

## Alcance

Auditoría conjunta con:

- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

Se revisó el flujo Sesión con prioridad V4/V5 y la cadena competencia → criterio → evidencia → instrumento. No se simularon usuarios reales, dispositivos físicos, backend, IA real ni validación pedagógica con especialistas externos.

## Hallazgo

**ID:** AUD-SECONDARY-CRITERION-EVIDENCE-FALLBACK-225-A  
**Módulo:** Sesiones · criterio/evidencia · cobertura por área  
**Clasificación:** PARCIALMENTE FUNCIONAL / ROTA para cobertura real de varias áreas  
**Severidad:** S2 ALTO  
**Resultado:** NO PASA

### Entrada

Configurar una de las áreas que la aplicación permite seleccionar pero que no tiene tratamiento específico en `criterionFor()` y `evidenceFor()`, por ejemplo:

- Secundaria → Ciencias Sociales, DPCC, Inglés, EPT, Arte y Cultura, Educación Física o Educación Religiosa;
- Inicial → Psicomotriz o Arte y Cultura;
- Primaria → Arte y Cultura, Educación Física o Educación Religiosa.

Crear una unidad/proyecto y preparar una sesión desde una actividad concreta de esa área.

### Esperado

La sesión debe construir o heredar un criterio y una evidencia coherentes con, como mínimo, la competencia/intención de aprendizaje, actividad, grado/ciclo, producto o desempeño esperado y contexto. Si el motor no puede determinar esos elementos con suficiente respaldo, debe indicarlo explícitamente en lugar de completar silenciosamente campos pedagógicos genéricos.

### Obtenido

`criterionFor(area, brief)` solo diferencia Comunicación, Matemática, Personal Social y Ciencia y Tecnología. Todas las demás áreas retornan exactamente la misma estructura:

`Elabora y explica una producción vinculada con ${ctx}, aplicando los aprendizajes priorizados del área.`

`evidenceFor(area)` también solo diferencia esas cuatro áreas. Todas las demás reciben:

`Producción o desempeño observable desarrollado durante la sesión.`

`buildSession()` asigna esos valores directamente a `session.criterion` y `session.evidence`. Las funciones no reciben competencia, título/actividad, grado/ciclo, tipo de evidencia, producto, desempeño ni finalidad de evaluación. Por tanto, áreas con naturalezas de aprendizaje distintas pueden recibir el mismo criterio y la misma evidencia genéricos aun cuando la actividad concreta sea diferente.

### Evidencia

- `app.js`: `areaOptions()` oferta las áreas indicadas.
- `app.js`: `criterionFor(area, brief)` solo implementa cuatro ramas específicas y luego un fallback único.
- `app.js`: `evidenceFor(area)` solo implementa cuatro ramas específicas y luego un fallback único.
- `app.js`: `buildSession()` persiste ambos resultados directamente dentro de la sesión.
- Producción `https://docente-digital.vercel.app/app.js`: HTTP 200 y conserva las mismas funciones/fallbacks durante el retest de esta auditoría.

### PASA / NO PASA

**NO PASA — S2 ALTO.**

No se eleva este caso aislado a S0/S1 porque los textos no se presentan como citas normativas literales y existen guardas curriculares previas para no atribuir como oficial lo no verificado. Sin embargo, la función Sesiones continúa incompleta: la aplicación ofrece áreas para las cuales no demuestra una cadena específica competencia → criterio → evidencia → instrumento.

## Relación con auditorías anteriores

Este hallazgo es distinto pero complementario a:

- `AUD-SECONDARY-COMPETENCE-FALLBACK-219`: falta de competencia real para áreas de Secundaria;
- `AUD-INSTRUMENT-SELECTION-BY-AREA-224`: selección del instrumento basada esencialmente en el nombre del área;
- `AUD-SES-CURR-043`: guarda de seguridad que evita presentar heurísticas curriculares como oficiales cuando la matriz curricular no está verificada.

AUD-225 se concentra en los campos **criterio y evidencia**, que siguen siendo completados automáticamente mediante fallbacks transversales aun cuando competencia e instrumento tengan auditorías separadas.

## Acción correctiva recomendada

No corregir agregando cadenas fijas por área. Implementar un selector auditable que reciba un contexto estructurado, por ejemplo:

`selectAssessmentChain({ level, area, competence, activity, grade, purpose, expectedProduct, context })`

Debe producir/proponer de forma coherente:

1. criterio observable y medible;
2. evidencia concreta esperada;
3. tipo de evidencia;
4. instrumento compatible;
5. procedencia/estado de verificación curricular cuando corresponda;
6. opción de revisión y edición docente antes de persistir.

Añadir golden tests al menos para Comunicación, Matemática, Personal Social, CyT, Arte y Cultura, Educación Física, Ciencias Sociales, DPCC, Inglés y EPT, incluyendo dos actividades diferentes de una misma área para demostrar que la salida no depende únicamente del nombre del área.

## Corrección aplicada

No se modificó el runtime. Un parche pequeño agregando textos hardcodeados sería inseguro porque aparentaría cobertura pedagógica sin resolver coherencia semántica, grado, competencia, tipo de evidencia ni trazabilidad. Se documenta el defecto para integrarlo con la corrección estructural de AUD-219 y AUD-224.

## Estado V5

Los bloqueantes V5 S0/S1 ya registrados permanecen pendientes. Este hallazgo S2 no cambia por sí solo el estado global: DocenteDigital continúa NO APROBADA para lanzamiento V1.0 hasta cerrar los bloqueantes y demostrar los recorridos E2E exigidos por V5.
