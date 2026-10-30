# Docente Digital — Fase 3: sesiones completas y evaluación formativa

**Fecha:** 28 de octubre de 2026  
**Base:** copia independiente de fase 2, acumulando los cambios de fases 1 y 2.  
**Estado:** versión para pruebas pedagógicas; no publicada ni comercializable todavía.

## Hallazgos y correcciones

La aplicación ya contaba con varios motores que intervenían en una misma sesión (`enhancements.js`, `master-session-v1.js`, `sesiones-maestras-core-v1.js`, núcleo de sesiones y controles curriculares). Se detectó que algunas capas sustituían los momentos pedagógicos elaborados por otras. Para mantener esa compatibilidad, se incorporó una capa final, `session-teaching-sequence-v3.js`, cargada después de los controles curriculares desde `schedule-prompt-v6.js`.

### ¿Qué incorpora ahora la sesión completa?

1. **Preparación:** sugerencias de recursos y mediación diferenciadas por Inicial, Primaria y Secundaria. En Inicial se priorizan exploración, seguridad y materiales apropiados para la edad.
2. **Inicio, desarrollo y cierre:** acciones para docente y estudiantes vinculadas al foco de la Unidad/Proyecto, y distribución del tiempo tomado de la sesión guardada.
3. **Secuencia según el área:** lectura/comunicación, Matemática, Ciencia y Tecnología, y un itinerario general para otras áreas. No se presenta una misma receta de desarrollo para todas las sesiones.
4. **Atención multigrado:** tareas concretas diferenciadas para 1.º, 3.º y 5.º de Primaria, con una sugerencia de alternancia de atención directa, trabajo autónomo y socialización común.
5. **Evaluación formativa:** cuadro de criterios por grado, evidencias, espacio para registrar «sí / con apoyo / aún no observado» y una casilla de retroalimentación o siguiente paso. El docente debe comprobar y ajustar los criterios antes de aplicarlos.
6. **Inicial:** registro de descubrimientos mediante observaciones, dibujos, expresiones orales y juego, sin exigir escritura convencional ni una formalización a la pizarra propia de otros niveles.
7. **Secundaria:** contraste de fuentes, interpretación de datos y justificación de conclusiones cuando la actividad o el área lo requiere.
8. **Compatibilidad con Sesiones Maestras:** conserva la matriz de uso de recursos y el apartado final de sistematización; no borra las secciones adicionales del proyecto.
9. **Precaución curricular:** cuando la matriz oficial literal aún no está validada, el documento muestra las capacidades como pendientes de verificar y mantiene la advertencia curricular de seguridad.

## Casos comprobados en el código

| Nivel / caso | Secuencia nueva revisada | Evidencia e instrumento |
| --- | --- | --- |
| **Inicial, 5 años:** hormigas en el aula | Preguntas y observación; exploración de imágenes o materiales seguros; representación mediante palabras, gestos y dibujos | Registro de expresiones, dibujos y observación, con retroalimentación cercana |
| **Primaria, 1.º/3.º/5.º:** semillas del biohuerto | Lectura y comprensión diferenciada: apoyos visuales en 1.º, inferencias en 3.º, contraste de fuentes en 5.º; alternancia multigrado | Respuestas orales, organizadores y comparación escrita por grado |
| **Secundaria, 4.º:** consumo de agua | Pregunta con sentido; lectura crítica y contraste de fuentes; explicación orientada a decisiones y propuestas justificadas | Cuadro de fuentes, argumento sustentado y registro de mejora |

Los tres son **casos sintéticos** que sirven para buscar regresiones: no equivalen a una prueba de desempeño docente ni a un acta de conformidad del MINEDU.

## Archivos de esta fase

- **Nuevo:** `session-teaching-sequence-v3.js` (secuencia didáctica final y registros formativos).
- **Modificado:** `schedule-prompt-v6.js` (carga del nuevo módulo después de las capas curriculares).
- **Ampliado:** `tests/three-level-pedagogy.mjs` (comprueba las capas maestras completas, diferenciación multigrado, continuidad histórica y contenido Word OOXML).
- Se mantienen todos los archivos y correcciones de fases 1 y 2.

## Evidencia de prueba y límites

- **14 de 14 pruebas automáticas offline aprobadas**. Incluyen tres niveles, selección real de situación y producto, creación de Unidad/Proyecto, sesión, integración con dos capas maestras, preservación de anexos y generación de archivo DOCX válido a nivel ZIP/XML.
- La extracción de texto DOCX usa un analizador HTML simulado: **no certifica diseño de tablas, salto de página o representación en Microsoft Word real**.
- No se ejecutó Chromium/Playwright porque el navegador de pruebas no está instalado. Falta prueba visual y funcional en computadora/celular.
- La prueba usa **competencias sintéticas** para comprobar el flujo. No certifica que cada competencia, capacidad, estándar o desempeño oficial esté correctamente vinculado a cada grado.
- Los criterios y las tareas son propuestas editables: el docente o especialista curricular debe contrastarlas con el CNEB vigente y el contexto real.

## Antes de vender Docente Digital

1. **Verificación curricular documental:** conectar matriz literal y versionada de competencias/capacidades/estándares/desempeños de Inicial, Primaria y Secundaria, con fuentes oficiales trazables; verificar precisión por ciclo y grado.
2. **Revisión pedagógica humana:** al menos un docente por nivel, incluyendo docente multigrado, debe revisar y aplicar una planificación completa; registrar observaciones y corregirlas.
3. **Pruebas de documentos reales:** abrir varios `.docx` en Microsoft Word y móviles; revisar tablas, títulos, paginación y exportación.
4. **Pruebas de seguridad y persistencia:** revisar acceso, guardado, recuperación y protección de información personal antes de abrir registros reales de estudiantes.
5. **Comercialización:** cuentas separadas por usuario, respaldo, suscripciones, cobro y soporte. Estos componentes no se implementaron en esta fase.

### Fuentes oficiales para la siguiente verificación

- [MINEDU — Currículo Nacional: recursos y cartilla de planificación](https://minedu.gob.pe/curriculo/recursos.php).
- [MINEDU — Programa curricular de Educación Inicial](https://repositorio.minedu.gob.pe/handle/20.500.12799/4548).
- [MINEDU — Planificación, mediación y evaluación de los aprendizajes en Secundaria](https://repositorio.minedu.gob.pe/handle/20.500.12799/6646).
- [MINEDU — La planificación en la Educación Inicial: guía de orientaciones](https://repositorio.minedu.gob.pe/handle/20.500.12799/6518).

El repositorio MINEDU aplicó una verificación automática a algunos PDF durante la consulta, por lo que no se presenta ninguna transcripción curricular como comprobada línea por línea.

## Cómo revisar esta versión

1. Descomprimir el ZIP en una **carpeta nueva** y conservar las versiones anteriores.
2. Abrir la aplicación desde un servidor local (por ejemplo, `python3 -m http.server 4173` y después `http://localhost:4173`).
3. Crear una Unidad/Proyecto para Inicial, otra para Primaria multigrado y otra para Secundaria.
4. Revisar cada sesión completa y descargarla en Word. Prestar atención a preparación, tareas por grado, evaluación y anexos.
5. Si un especialista detecta un criterio o desempeño inadecuado, anotar nivel, área, grado, texto exacto y corrección deseada para una próxima iteración.

Esta es una **copia técnica completa**, no todavía un instalador `.exe`/`.apk`. No se modificaron GitHub, Supabase ni otras versiones guardadas.
