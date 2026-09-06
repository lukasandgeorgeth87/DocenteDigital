# AUD-SESSION-FORMALIZATION-UNIVERSAL-190

**Estado:** ABIERTO — NO PASA  
**Severidad:** S2 ALTO  
**Clasificación:** PARCIALMENTE FUNCIONAL  
**Módulo:** Sesiones → secuencia pedagógica/didáctica  
**Gate:** V3 / V4 / V5 / Núcleo IA

## Hallazgo

La plantilla base de sesión incorpora de manera incondicional el bloque **“Formalización / construcción del aprendizaje”** en toda sesión, independientemente del área, competencia, actividad o proceso didáctico que corresponda.

El problema no es que una sesión nunca pueda sistematizar, concluir o formalizar un aprendizaje. El problema es que DocenteDigital presenta la misma etapa con el mismo rótulo y la misma lógica para todas las áreas, aun cuando el sistema ya conoce `session.area` y dispone de capas posteriores para adecuar propósito, criterio y evidencia según el área.

## Prueba

### ID
`AUD-SESSION-FORMALIZATION-UNIVERSAL-190`

### Entrada
Crear sesiones vinculadas a actividades de áreas diferentes, por ejemplo:

1. Comunicación — lectura, oralidad o escritura.
2. Matemática — resolución de problemas.
3. Ciencia y Tecnología — indagación o explicación.
4. Personal Social — deliberación/análisis.
5. Arte y Cultura, Educación Física, Educación Religiosa, Psicomotriz o EPT cuando correspondan.

### Resultado esperado
La secuencia debe responder a la actividad, competencia y procesos/estrategias pertinentes al área. La aplicación no debe imponer una fase denominada “Formalización” como bloque universal. Cuando corresponda pedagógicamente formalizar, sistematizar, institucionalizar, contrastar, concluir, revisar una producción, comunicar hallazgos u otra acción, debe seleccionarse según el aprendizaje y el área.

### Resultado obtenido
`app.js`, función `sessionHtml(session, forWord=false)`, inserta siempre:

```html
<h3>Formalización / construcción del aprendizaje</h3>
<p>Se recuperan las estrategias y producciones de los estudiantes, se contrastan ideas y se construye una conclusión, procedimiento o explicación común acorde con la competencia trabajada. Cada grado registra la formalización con el nivel de complejidad que le corresponde.</p>
```

No existe condición basada en `session.area`, competencia, intención, modalidad de actividad o proceso didáctico.

La revisión de la cadena runtime confirmó que:

- `session-learning-core-v54.js` adapta propósito, criterio, evidencia y herencia curricular, pero conserva el HTML base y no vuelve condicional este bloque.
- `session-curriculum-safety-v67.js` protege las etiquetas curriculares mientras la matriz oficial no esté conectada, pero tampoco modifica este bloque.
- El cargador `schedule-prompt-v6.js` carga primero `session-learning-core-v54.js` y luego `session-curriculum-safety-v67.js`; ninguna de las dos corrige esta universalización.
- La copia servida actualmente por `https://docente-digital.vercel.app/app.js` devuelve HTTP 200 y contiene el mismo bloque incondicional.

### Evidencia
- Repositorio: `app.js` → `sessionHtml()`.
- Repositorio: `session-learning-core-v54.js` → wrapper de `sessionHtml()` sin condicionalización del proceso.
- Repositorio: `session-curriculum-safety-v67.js` → sanitización curricular, no secuencia didáctica.
- Runtime: `/app.js` de producción comprobado con HTTP 200 y contenido equivalente.

### PASA / NO PASA
**NO PASA.**

## Causa raíz

La secuencia central de la sesión continúa heredando una plantilla pedagógica genérica de `app.js`. Las capas más nuevas mejoran el significado, propósito, criterio y seguridad curricular, pero todavía no son propietarias de la secuencia didáctica completa. Como consecuencia, un bloque genérico queda fuera del razonamiento por área.

## Severidad

**S2 ALTO.**

Es una incoherencia pedagógica transversal y silenciosa: no produce Error 500, pero puede inducir a que el docente acepte una estructura que no responde con suficiente precisión al área o actividad. No se eleva a S1 en esta auditoría porque no se ha ejecutado todavía una validación curricular/pedagógica completa con especialistas y usuarios reales para cada área ni una batería física de sesiones exportadas.

## Relación con las especificaciones obligatorias

### V2
Exige coherencia entre planificación, sesión, criterio, evidencia e instrumento, y que los procesos de la Carpeta Docente funcionen como sistema articulado.

### V3
Una función no aprueba por generar texto. Debe ser correcta y verificable; los errores silenciosos pedagógicos deben detectarse.

### V4
La interfaz debe ser simple sin esconder una lógica incorrecta. Simplificar no significa aplicar el mismo proceso a todas las áreas.

### V5
La prueba pedagógica de extremo a extremo debe demostrar Programación → Unidad → Sesiones → Criterios → Evidencias → Instrumentos → Registro antes del lanzamiento.

### Núcleo IA
Exige comprender primero la intención completa y heredar significado. La secuencia de la sesión debe responder al área, actividad y finalidad, no a una plantilla única.

## Verificación de fuente oficial

No se declara aquí la vigencia de una norma jurídica específica. Como contraste pedagógico, el Repositorio Institucional del MINEDU mantiene materiales diferenciados por área. Por ejemplo, **“Aula rural: apliquemos estrategias pedagógicas de Matemática en el aula”**, Ministerio de Educación del Perú, primera edición digital junio de 2025, presenta orientaciones específicas de Matemática alineadas con el enfoque del área del CNEB. El repositorio también publica una guía separada de lectura (febrero de 2025), lo que refuerza que la intervención pedagógica debe adecuarse al área en lugar de universalizar una sola secuencia.

Fuentes oficiales consultadas:
- https://repositorio.minedu.gob.pe/handle/20.500.12799/11489
- https://repositorio.minedu.gob.pe/handle/20.500.12799/11413

Estas fuentes se usan como contraste pedagógico oficial accesible; **no** como declaración de que una denominación de proceso didáctico sea una obligación normativa universal.

## Acción correctiva

No aplicar una sustitución textual global de “Formalización”, porque podría eliminar una fase pertinente en sesiones donde sí corresponde. La corrección debe ser pequeña pero conceptualmente segura:

1. mover la construcción de la secuencia a una función/contrato por área y tipo de actividad;
2. permitir que cada área determine sus procesos o acciones de construcción/sistematización pertinentes;
3. usar un bloque neutral solo cuando no exista aún una matriz validada, sin afirmar un proceso oficial;
4. mantener “formalización” únicamente cuando el proceso elegido la requiera;
5. añadir golden tests por área para comprobar que Comunicación, Matemática, CyT, Personal Social y demás no reciben automáticamente la misma secuencia;
6. retestar vista en app y Word/PDF.

No se corrige automáticamente en esta pasada porque cambiar la secuencia didáctica de todas las áreas requiere validación pedagógica y curricular; hacerlo por regla superficial podría crear una regresión más grave.

## Riesgo de regresión

**ALTO** si se corrige con reemplazo global: puede degradar Matemática u otras actividades donde una formalización/sistematización sí sea pertinente. La solución debe estar gobernada por área + competencia + tipo de actividad + finalidad.

## Impacto en indicadores

- **IUD:** impacto negativo en coherencia de sesión; no se calcula puntuación definitiva.
- **ICGD:** impacto negativo por falta de diferenciación pedagógica de la secuencia; pendiente de medición real.
- **IFR:** no se calcula; el defecto aumenta el riesgo de reelaboración docente.
- **ISU:** no se calcula; una interfaz simple no compensa una secuencia pedagógica genérica.
- **Prelaunch:** mantiene pendiente la demostración del gate pedagógico V5. No se usa una puntuación para ocultar bloqueantes existentes.

## Retest pendiente

- batería real de sesiones por área;
- validación con especialista/docente;
- comparación app ↔ DOCX ↔ PDF/impresión;
- verificación en contextos Inicial, Primaria, Secundaria, multigrado, EIB y monolingüe.

**DocenteDigital no debe declararse lista para V1.0 mientras persistan los bloqueantes V5 y falten estas pruebas reales.**
