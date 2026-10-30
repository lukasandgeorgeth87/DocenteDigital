# Docente Digital — Fase 4: multigrado real por ciclos III, IV y V

**Fecha:** 28 de octubre de 2026  
**Base:** copia independiente de fase 3, con todas sus mejoras acumuladas.  
**Estado:** corrección funcional comprobada con pruebas offline; validación curricular literal pendiente.

## Corrección solicitada

La planificación no puede asumir siempre 1.º, 3.º y 5.º. El docente de Primaria selecciona **cualquier combinación real** entre 1.º y 6.º, incluso grados no consecutivos. A partir de esa selección, el sistema muestra únicamente los ciclos pertinentes:

| Ciclo de Educación Primaria | Grados comprendidos |
| --- | --- |
| III | 1.º y 2.º |
| IV | 3.º y 4.º |
| V | 5.º y 6.º |

Ejemplos comprobados:

| Grados seleccionados | Ciclos que debe mostrar | Ciclos que no debe crear |
| --- | --- | --- |
| 2.º y 4.º | III y IV | V |
| 3.º y 6.º | IV y V | III |
| 1.º y 2.º | III | IV y V |
| 2.º, 5.º y 6.º | III y V | IV |
| 1.º, 2.º, 3.º, 4.º, 5.º y 6.º | III, IV y V | Ninguno |
| Solo 6.º | V | III y IV |

La unidad/proyecto incorpora la tabla de ciclos según grados elegidos. La sesión organiza tareas, evidencias y un registro formativo **por cada grado seleccionado**, con una sugerencia de mediación distinta para cada grado de 1.º a 6.º; la rotación se presenta solo si hay más de uno. No asigna por defecto actividades a grados ausentes ni impone una rotación fija de tres ciclos.

La interfaz de configuración —incluida la selección nativa de grados— explica III, IV y V ciclo. Para multigrado y unidocente conserva la selección múltiple.

## Alcance real de la validación curricular

**Comprobado contra referencia institucional:** correspondencia ciclo/grado de Primaria y pertinencia de organizar atención simultánea y diferenciada en multigrado.

**Todavía no certificado:** correspondencia literal de cada competencia, capacidad, estándar y desempeño con área, grado y ciclo; tampoco que cada tarea sugerida sea la mejor para el diagnóstico de un aula determinada. Los textos didácticos son borradores editables, no citas normativas del MINEDU.

Fuentes institucionales de referencia para la revisión especializada:

1. [MINEDU — Programa curricular de Educación Primaria](https://repositorio.minedu.gob.pe/handle/20.500.12799/4549).
2. [MINEDU — Cómo planificar sesiones de aprendizaje para aulas multigrado](https://repositorio.minedu.gob.pe/handle/20.500.12799/10342).
3. [MINEDU — Diversificación y programación curricular: orientaciones para el aula multigrado](https://repositorio.minedu.gob.pe/handle/20.500.12799/9618).
4. [MINEDU — Cartilla de planificación curricular para educación primaria](https://repositorio.minedu.gob.pe/handle/20.500.12799/5310).

## Pruebas realizadas

- **14/14 pruebas automáticas offline aprobadas.**
- Casos completos de Inicial, Primaria multigrado y Secundaria: Unidad/Proyecto, sesión, registro formativo y archivo Word OOXML.
- Seis combinaciones adicionales de grados en Primaria, incluidos los seis grados, un único grado, dos grados del mismo ciclo y grados separados por ciclos.
- Un archivo Word de la combinación 2.º–4.º contiene III y IV sin incorporar V; inspección a nivel ZIP/XML, no visual en Word.
- Prueba de selección 2.º y 6.º en la interfaz base.
- Se conserva el contenido histórico y los anexos de Sesiones Maestras.

### Archivos modificados en esta fase

- `session-teaching-sequence-v3.js`: organización dinámica por ciclos y grado, progresión de tareas, Unidad/Proyecto y sesión.
- `index.html` y `onboarding.html`: etiquetas de ciclo en la selección nativa.
- `app.js` y `setup-navigation-hotfix-v1.js`: ayuda contextual en selección de Primaria.
- `tests/three-level-pedagogy.mjs`: nuevas combinaciones, selección y Word.

## Siguiente trabajo curricular

1. Construir una **matriz oficial trazable y versionada** por nivel, área, competencia, capacidad, estándar, ciclo, grado y desempeño, a partir de documentos del MINEDU.
2. Contrastar por especialista de aula multigrado las propuestas de trabajo simultáneo y diferenciado, evitando equiparar el desempeño de dos grados de un mismo ciclo.
3. Probar archivos Word reales en computadora y móvil, con docentes de los tres niveles, antes de publicar o vender la plataforma.

**No se modificaron GitHub, Supabase, producción ni versiones anteriores.** Esta entrega es código fuente en ZIP; todavía no es instalador `.exe` o `.apk`.
