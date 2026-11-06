# Registro permanente de correcciones — Docente Digital (Preview)

**Propósito:** reducir al máximo que un error corregido vuelva a aparecer en unidades, proyectos, sesiones o Word.

## Reglas de aceptación

1. Una corrección solo se declara cerrada cuando incluye una prueba de regresión que reproduzca su error y valide el resultado nuevo.
2. Todas las pruebas anteriores deben permanecer. El archivo tests/regression-contract-v20.mjs verifica en GitHub Actions que no sean eliminadas ni omitidas.
3. Para compartir una nueva Preview como versión probada, deben terminar con éxito Preview Planning Regression Gate y Beta E2E Browser Gate, y Vercel debe informar READY para el mismo commit.
4. Las pruebas automáticas no reemplazan la validación curricular de MINEDU ni la revisión real de un Word en Chrome.
5. No tocar main, producción ni Supabase durante estas correcciones. Guardar cada avance en un commit identificable de la rama Preview, sin reescribir historial.

## Historial que no debe retroceder

| Fase | Problema corregido | Prueba obligatoria |
| --- | --- | --- |
| 11–12 | Grados y confusión de instrucciones docentes con tema | quick-request-routing-phase11.mjs; teacher-intent-boundary-v12.mjs |
| 13 | Áreas no solicitadas; situación genérica | unit-explicit-areas-and-situation-v13.mjs; creative-situation-sanitization-v13.mjs |
| 14–15 | Encabezados de título y contexto, solicitud sobre agua | planning-structured-request-v14.mjs; structured-water-regression-v15.mjs |
| 16 | Contradicción entre situación, reto y producto | planning-semantic-coherence-v16.mjs |
| 17 | Texto genérico «tema solicitado por el docente» | planning-topic-realization-v17.mjs |
| 18 | Reto mal formulado, producto recortado y progresión invertida | sixth-grade-coherence-v18.mjs |
| 19 | Revisar textos clasificado como lectura; criterios/evidencias incompatibles | primary-activity-criteria-v19.mjs |
| 20 | Títulos administrativos, reto original distinto y competencias de área mal asignadas | unit-topic-curriculum-coherence-v20.mjs |

La prueba de inventario también retiene unit-export-quality-phase11, planning-chain-integrity, docx-xml-safety, context-topic-golden, three-level-pedagogy y las cuatro pruebas curriculares de Primaria.

## Protocolo para próximas correcciones

- Guardar el caso mínimo con la solicitud real y la salida defectuosa.
- Incorporar la corrección y su prueba, sin borrar pruebas históricas.
- Ejecutar todas las regresiones y la prueba de navegador.
- Guardar un commit y confirmar su SHA exacto en Vercel Preview.
- Si falla una sola prueba, no declarar la versión aprobada: resolver el fallo y repetir.
- Cuando afecte contenido pedagógico, comprobar además un Word nuevo.

**Estado de la fase 20:** lista para ejecutar CI. No aprobar hasta comprobar resultados completos y nueva exportación real.

## Fase 21 — Captura y Word reales de 6.º grado (6 de noviembre de 2026)

- Fallo reproducido: el formulario propone títulos que incorporan «crear una UNIDAD DE APRENDIZAJE», el título final se sustituye por otro y el producto agrega «Organización de actividades».
- Regla de fuente de verdad: los campos explícitos Título, Pregunta retadora y Producto final expresados por el docente deben conservarse en la unidad guardada y en el Word; las sugerencias no pueden prevalecer sobre esos campos.
- Prevención: tests/teacher-explicit-fields-v21.mjs valida los extractores, el exportador y el auditor cargado. tests/sixth-grade-browser-regression-v21.mjs valida el recorrido del navegador y el DOCX descargado.
- Registro vinculante: ambas pruebas se ejecutan en CI y el inventario del contrato de regresiones comprueba que sigan allí. Si alguna prueba falla, la fase no se considera aprobada.
- La revisión de la pertinencia curricular y los desempeños sigue siendo necesaria; ningún resultado de CI certifica por sí solo el documento para uso en aula.

## Fase 22 — Prueba libre de 2.º grado: derechos (6 de noviembre de 2026)

- **Solicitud original:** «quiero crear una unidad para 3 semanas sobre los derechos»; el docente no proporcionó un título, problema de contexto ni producto obligatorio.
- **Fallos reproducidos:** títulos que incorporan la orden «crear una unidad», reto que trata «3 semanas» como objetivo educativo y sesiones que reemplazan el nombre de la «Expo interactiva» elegida por la descripción extensa «Muestra por estaciones»; las sesiones científicas también deben tener una justificación disciplinar.
- **Correcciones:** extracción del tema después de «sobre» en órdenes breves; descarte de la duración como finalidad educativa; situaciones sobre derechos basadas en relatos ficticios, sin atribuir vulneraciones a estudiantes reales; uso de selectedProductTitle en títulos de sesiones; advertencia de pertinencia de Ciencia y Tecnología para temas exclusivamente sociales.
- **Regresiones obligatorias:** tests/short-rights-unit-v22.mjs y tests/short-rights-browser-v22.mjs; no se sustituyen las pruebas 11–21.
- **Pendiente pedagógico:** el docente debe seleccionar áreas pertinentes y revisar criterios CNEB, especialmente si el perfil tenía las siete áreas por defecto. El horario sin registrar requiere confirmación, no asignación inventada.
