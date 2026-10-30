# Docente Digital — Fase 7: Matemática de Primaria

**Fecha:** 28 de octubre de 2026  
**Base:** copia independiente de Fase 6, con todos los cambios previos acumulados.  
**Referencia:** PDF aportado por el usuario, «Programa curricular de Educación Primaria» (396 páginas); sección 6.7 de Matemática.  
**Alcance:** solo Matemática de Primaria, 1.º a 6.º; Inicial y Secundaria siguen presentes y no se modificaron sus reglas.

## Cuatro competencias, diferenciadas correctamente

| Competencia del MINEDU | Situaciones que puede priorizar |
| --- | --- |
| Resuelve problemas de cantidad | Sumas, restas, repartos, fracciones, decimales, medición de masa o tiempo |
| Resuelve problemas de regularidad, equivalencia y cambio | Patrones, reglas, igualdades, relaciones de cambio o proporcionalidad |
| Resuelve problemas de forma, movimiento y localización | Figuras, perímetros, ubicaciones, recorridos, transformaciones geométricas |
| Resuelve problemas de gestión de datos e incertidumbre | Encuestas, tablas, pictogramas, gráficos, frecuencias, probabilidad |

El selector ahora atiende términos y contexto matemáticos más específicos. Por ejemplo, «calculamos la **masa**» se orienta a cantidad, mientras «calculamos el **perímetro**» se orienta a forma. Los títulos con varios focos incompatibles se consideran **provisionales** y requieren confirmación docente; no se presenta su clasificación como oficial.

## Referencias comprobadas en el PDF recibido

La tabla utiliza la página **del visor PDF**, que en esta sección es dos unidades superior a la paginación impresa del libro.

| Competencia | III ciclo (1.º–2.º) | IV ciclo (3.º–4.º) | V ciclo (5.º–6.º) |
| --- | --- | --- | --- |
| Cantidad | Estándar 238; desempeños 238–239 | Estándar 240; desempeños 240–241 | Estándar 242; desempeños 242–243 |
| Regularidad, equivalencia y cambio | Estándar 248; desempeños 248–249 | Estándar 250; desempeños 250–251 | Estándar 252; desempeños 252–253 |
| Forma, movimiento y localización | Estándar 258; desempeños 258–259 | Estándar 260; desempeños 260–261 | Estándar 262; desempeños 262–263 |
| Gestión de datos e incertidumbre | Estándar 268; desempeños 268 | Estándar 269; desempeños 269–270 | Estándar 271; desempeños 271–272 |

El programa contiene las cuatro competencias y **16 capacidades** en total. SHA-256 del PDF que se cotejó: `34009689b6e3fe2194ec61c1675af13407528ae5e0f34f4d484007efd9e832f7`.

Fuente pública: [MINEDU — Programa curricular de Educación Primaria](https://www.gob.pe/institucion/minedu/informes-publicaciones/6790803-programa-curricular-de-educacion-primaria).

## Cambios en la plataforma

1. **Nuevo `primary-mathematics-source-pages-v7.js`:** índice de páginas verificado para las 24 combinaciones de cuatro competencias × seis grados; no copia los desempeños completos ni se aplica a otros niveles.
2. **`official-curriculum-v1.js`:** selección de competencia con detección más precisa de contenido matemático y advertencia implícita ante títulos ambiguos.
3. **`session-learning-core-v54.js`:** propósitos, criterios y evidencias específicas de cantidad, regularidad, forma o datos cuando la competencia puede determinarse.
4. **`session-teaching-sequence-v3.js`:** desarrollo y actividades concretas por competencia; tareas y criterios editables diferenciados para cada grado y ciclo. Incluye tabla de páginas de consulta del PDF en la sesión y en Word.
5. **`schedule-prompt-v6.js`:** incorpora el nuevo índice antes de construir la sesión.
6. **Pruebas:** nuevo `tests/primary-mathematics-curriculum.mjs` y ampliación de `tests/three-level-pedagogy.mjs`, incluida creación de sesión matemática desde una Unidad real.

## Verificación y límites

- **17/17 pruebas automáticas offline aprobadas.**
- Probadas cuatro competencias y sus 16 capacidades, 24 asociaciones con grado/ciclo/páginas, títulos susceptibles de confusión y documentos Word OOXML generados.
- No se alteraron las pruebas de Inicial, Secundaria, Comunicación ni las seis combinaciones multigrado de Primaria.
- **Importante:** la aplicación indica en qué páginas consultar estándares y desempeños, pero **no ha seleccionado ni transcrito literalmente los desempeños** por competencia y grado; el docente debe verificarlos y contextualizarlos. Las tareas propuestas no son citas textuales del MINEDU.
- Falta una prueba visual de Word real, una revisión especialista de Matemática y un piloto en aula antes de afirmar conformidad pedagógica.

## Próximo paso

Continuar por áreas de Primaria con el PDF ya disponible (Ciencia y Tecnología, Personal Social, etc.), conservando la separación curricular por nivel. Posteriormente, usar los programas propios de Inicial y Secundaria.

**Esta copia es código fuente en ZIP, no un instalador `.exe` o `.apk`.** No se modificaron GitHub, Supabase, producción ni versiones anteriores.
