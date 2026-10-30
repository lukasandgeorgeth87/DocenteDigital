# Docente Digital — Fase 9: Personal Social de Primaria

**Fecha:** 30 de octubre de 2026.  
**Versión base:** DocenteDigital refinamiento Fase 8 (29 de octubre de 2026).  
**Fuente curricular:** *Programa curricular de Educación Primaria*, MINEDU, PDF de 396 páginas aportado en la conversación (SHA-256: `34009689b6e3fe2194ec61c1675af13407528ae5e0f34f4d484007efd9e832f7`).

## 1. Alcance y propósito

Esta fase trata exclusivamente el área **Personal Social de Educación Primaria**. Mantiene las capacidades e índices ya existentes para Comunicación, Matemática y Ciencia y Tecnología y conserva los módulos de Inicial, Secundaria y Director. En aulas multigrado o unidocentes, se trabajan únicamente los grados que el docente selecciona entre 1.º y 6.º, agrupados en los ciclos III, IV y V.

## 2. Competencias verificadas

| Competencia | Capacidades en el núcleo curricular |
| --- | ---: |
| Construye su identidad | 4 |
| Convive y participa democráticamente en la búsqueda del bien común | 5 |
| Construye interpretaciones históricas | 3 |
| Gestiona responsablemente el espacio y el ambiente | 3 |
| Gestiona responsablemente los recursos económicos | 2 |

**Total:** 5 competencias y 17 capacidades cuyos nombres proceden del módulo curricular y se cotejaron con las secciones correspondientes del PDF.

## 3. Ubicación de estándares y desempeños

Numeración del **visor PDF** (base 1; página impresa = página PDF menos 2). Las referencias de desempeños ubican las tablas con las columnas de ambos grados del ciclo; **no seleccionan por sí solas un desempeño para una sesión**.

| Competencia | III ciclo (1.º–2.º) | IV ciclo (3.º–4.º) | V ciclo (5.º–6.º) |
| --- | --- | --- | --- |
| Identidad | estándar p. 78 / desempeños p. 79 | estándar y desempeños p. 80 | estándar p. 81 / desempeños p. 82 |
| Convivencia | estándar y desempeños p. 86 | estándar p. 87 / desempeños p. 88 | estándar p. 89 / desempeños p. 90 |
| Historia | estándar y desempeños p. 94 | estándar y desempeños p. 95 | estándar y desempeños p. 96 |
| Espacio y ambiente | estándar y desempeños p. 100 | estándar y desempeños p. 101 | estándar p. 102 / desempeños p. 103 |
| Recursos económicos | estándar y desempeños p. 108 | estándar y desempeños p. 109 | estándar y desempeños p. 110 |

## 4. Correcciones funcionales

- `official-curriculum-v1.js`: incorporación de `personalSocialModeFromTitle`, que diferencia cinco intenciones didácticas. Títulos ambiguos como «Conocemos nuestra comunidad» **no se certifican automáticamente** como una competencia. Si se encuentran señales incompatibles de varias competencias, el docente debe confirmar cuál prioriza.
- `primary-personal-social-source-pages-v9.js` (**nuevo**): índice de 30 referencias por combinación de 5 competencias × 6 grados, con indicadores de consulta obligatoria de desempeños en el PDF.
- `session-learning-core-v54.js`: propósito, criterio y evidencia específicos para identidad, convivencia, historia, ambiente y economía **solo en Primaria**.
- `session-teaching-sequence-v3.js`: propuestas distintas de pasos didácticos, mediación, tareas, criterios y evidencias por grado, con trazabilidad al PDF en el HTML de la sesión/Word. Los apartados y anexos históricos se conservan.
- `schedule-prompt-v6.js`: carga el nuevo índice curricular de Personal Social junto con los anteriores.
- `tests/primary-personal-social-curriculum.mjs` (**nuevo**): prueba selección de competencia, títulos ambiguos, referencias, grados/ciclos, cinco sesiones multigrado, salida HTML para Word y propósito-criterio-evidencia.

## 5. Ejemplos comprobados

| Actividad | Competencia principal | Enfoque de la sesión |
| --- | --- | --- |
| «Reconocemos nuestras emociones» | Identidad | Autoconocimiento y decisiones responsables; sin exigir confidencias personales |
| «Acordamos normas para convivir» | Convivencia | Diálogo, deliberación y acuerdos orientados al bien común |
| «Comparamos el altar de antes y ahora» | Historia | Fuentes, secuencia temporal, cambios y permanencias |
| «Elaboramos un croquis de zonas de riesgo» | Espacio y ambiente | Interpretación espacial y propuesta de prevención |
| «Elaboramos un presupuesto para la feria» | Recursos económicos | Necesidades, recursos, opciones y decisión económica responsable |

## 6. Pruebas y límites

- **19/19 pruebas Node.js offline aprobadas** (todas las pruebas del proyecto que no requieren Playwright). Incluyen nueva prueba del área, regresiones de Comunicación, Matemática, Ciencia y Tecnología, continuidad del contenido y seguridad básica.
- **30/30 referencias grado-competencia verificadas por el test** contra el índice de páginas del PDF inspeccionado.
- **5/5 recorridos de sesión** de Personal Social probados con grados 2.º, 4.º y 6.º y salida HTML destinada a Word.
- Se revisó que títulos indeterminados **no presenten competencia confirmada ni referencias de desempeño**.
- Los demás módulos se conservaron; no se ha modificado GitHub, Supabase ni Vercel.

**No acreditado todavía:** transcripción/selección de desempeños oficiales por indicador concreto; validación pedagógica humana por sesión; apertura e impresión en Microsoft Word real; pruebas E2E de navegador, móvil o plataforma comercial; IA pagada, cuentas, almacenamiento privado y pagos.

## 7. Siguiente prioridad propuesta

Realizar una **validación transversal de unidades y proyectos completos** en diferentes tipos de IE: grado único, multigrado y unidocente. Abarcar como mínimo los tres niveles de la plataforma y revisar la coherencia situación significativa → reto/producto → secuencia de actividades → sesión → criterio/evidencia → Word. Para Inicial y Secundaria, usar sus programas curriculares oficiales correspondientes antes de afirmar validación literal.

**Este ZIP es código fuente completo para trabajo, no un instalador ni una publicación de producción.**
