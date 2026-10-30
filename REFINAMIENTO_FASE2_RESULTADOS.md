# Docente Digital — fase 2: calidad de Unidades, Proyectos y Sesiones

**Fecha:** 28 de octubre de 2026  
**Base:** proyecto entregado por Jorge, identificador `408c9089b16929d7ddeb5e062c3853dc9a590c56`, más las correcciones acumuladas en fase 1.  
**Estado:** copia aislada lista para pruebas de docentes, no publicada ni instalada.

## Objetivo

Hacer más consistente la secuencia **contexto aportado por el docente → situación significativa → reto → producto/evidencia → actividades de Unidad/Proyecto → propósito, criterio y evidencia de Sesión**, diferenciando los niveles Inicial, Primaria y Secundaria.

## Fallas verificadas y cambios

| Hallazgo | Cambio aplicado |
| --- | --- |
| El creador de unidades enriquecido (`enhancements.js`) no guardaba la identidad histórica que sí conservaba la función base de fase 1. | La creación real captura IE, docente, nivel, grados y lengua desde el momento de guardar. |
| Algunos títulos incrustaban el párrafo íntegro del contexto: «Leemos textos vinculados con Los estudiantes observan…». | Se extrae un tema acotado y rastreable; diez contextos comunes se cubren con una regresión. |
| Al resumir una actividad larga, el propósito perdía el tema y volvía a un título genérico de la unidad. | Se conserva `contextFocus` desde la selección de propuesta y se reutiliza en las sesiones. |
| Inicial proponía lectoescritura convencional o criterios de grados superiores. | Actividades y criterios usan juego, oralidad, imágenes, objetos concretos, dibujos y escrituras espontáneas, según la tarea. |
| En Secundaria se podía perder una finalidad expresada (comparar datos y proponer mejoras). | El reto, el primer producto sugerido y la utilidad de la sesión conservan esa intención explícita. |
| La situación significativa genérica describía más la metodología que el hecho o interés del docente. | La alternativa A parte ahora de la descripción original sin inventar causas o datos locales. |
| La vista previa, el Word ampliado y la exportación `.doc` de respaldo podían mostrar otro docente/IE tras cambiar de perfil. | Se recuperan los datos del documento guardado o se indica que deben verificarse. |
| La exportación Word del proyecto podía conservar el encabezado «Unidad de aprendizaje». | Se utiliza el tipo real: proyecto o unidad. |

## Tres casos de comprobación

Los casos son **ejemplos sintéticos de prueba**, no testimonios de aulas reales ni certificaciones de aplicación pedagógica. Los nombres de IE y docentes de prueba son ficticios.

### 1. Educación Inicial — 5 años

- **Contexto introducido:** «Aparecieron hormigas en el aula y los niños de 5 años quieren observarlas y contar qué descubren».
- **Reto generado:** «¿Qué podemos observar y descubrir sobre las hormigas en el aula y cómo lo mostraremos o contaremos?»
- **Producto sugerido:** Muestra de descubrimientos sobre las hormigas en el aula.
- **Actividad de sesión:** Escuchamos relatos y exploramos imágenes vinculadas con las hormigas en el aula.
- **Criterio contextualizado:** Comunicar ideas o preguntas mediante palabras, gestos o dibujos y escuchar a los demás.
- **Evidencia:** Registro de expresiones orales, gestos o dibujos.
- **Comprobación:** No requiere escribir convencionalmente ni citar fuentes académicas a los niños.

### 2. Educación Primaria — aula multigrado 1.º, 3.º y 5.º

- **Contexto introducido:** «Los estudiantes observan cambios en las semillas del biohuerto y desean registrar su crecimiento».
- **Reto generado:** Investigar los cambios observados y comunicar los descubrimientos con evidencias.
- **Producto sugerido:** Bitácora científica del biohuerto.
- **Actividad de sesión:** Leemos textos vinculados con los cambios en las semillas del biohuerto.
- **Criterio contextualizado:** Identificar e interpretar información del texto y explicar respuestas con apoyo del texto.
- **Evidencia:** Respuestas u organizador de lectura.
- **Comprobación:** La sesión mantiene los tres grados de origen aunque se cambie el perfil general. Las tareas concretas por grado aún requieren una revisión docente más profunda.

### 3. Educación Secundaria — 4.º grado

- **Contexto introducido:** «En el colegio los estudiantes quieren medir el consumo de agua de los lavamanos para comparar datos y proponer mejoras».
- **Reto generado:** Reunir evidencias sobre el consumo de agua para comparar datos, proponer mejoras y justificarlas.
- **Producto sugerido:** Informe con datos y propuesta de mejora.
- **Actividad de sesión:** Leemos textos vinculados con el consumo de agua de los lavamanos.
- **Criterio contextualizado:** Interpretar y contrastar información de textos y fuentes; sustentar una posición con evidencias.
- **Evidencia:** Organizador o comentario crítico sustentado en fuentes.
- **Comprobación:** El propósito de la sesión de lectura aporta información al objetivo explícito del proyecto.

## Archivos modificados/acumulados

- `app.js`: continuidad histórica (fase 1), extracción de foco contextual y actividades diferenciadas para Inicial.
- `enhancements.js`: identidad histórica en el generador ampliado, criterios de Inicial, procesos y datos de unidad/proyecto y Word.
- `proposal-choice-v8.js`: foco, situaciones, retos y productos que conservan intención y contexto.
- `session-learning-core-v54.js`: propósito, criterio y evidencia según nivel y contexto; conservación de documentos históricos.
- `format-v2.js`: datos históricos en vistas previas y exportación `.doc` de respaldo.
- `docx-export-v29.js`: Word histórico en formato `.docx` (fase 1).
- Pruebas nuevas: `context-topic-golden.mjs`, `three-level-pedagogy.mjs`, `unit-preview-history.mjs`, además de las dos de fase 1.

## Pruebas

**14 de 14 pruebas offline aprobadas**, incluidas las tres nuevas: tres niveles educativos, diez descripciones docentes, y vista/Word histórico. Se comprobó sintaxis JavaScript de los archivos cambiados.

**Alcance real de las pruebas:** motores de generación y exportación en un entorno simulado (Node), con currículo ficticio dentro de los test para comprobar flujo, sin llamadas al servicio real de inteligencia artificial. **No equivalen a una validación de competencias oficiales, ni a un recorrido visual completo en navegador.** Chromium no estaba disponible para las pruebas E2E y no se probaron archivos en Microsoft Word real ni celulares físicos.

## Pendientes prioritarios antes de comercializar

1. Validar competencia, capacidades, estándares y desempeños con los programas curriculares oficiales del MINEDU, con nivel/ciclo/grado, fuente y versión. **La matriz curricular literal todavía requiere verificación documental.**
2. Hacer que cada actividad y tarea multigrado tenga instrucciones de dificultad y mediación verificables por grado, no solo diferencias genéricas.
3. Revisar por expertos en Inicial las rutinas de juego, exploración, observación y retroalimentación de los documentos completos; algunas secciones siguen siendo plantillas genéricas.
4. Realizar un piloto con docentes de Inicial, Primaria y Secundaria; corregir las unidades, proyectos y sesiones que realmente impriman y utilicen.
5. Probar navegador, celular, Word y preservación de datos antes de desplegar.
6. Separadamente: cuentas de docente/director, respaldo sincronizado, suscripción mensual, cobro, soporte y política de tratamiento de datos.

## Referencias oficiales para la revisión pedagógica

- [MINEDU — Planificación curricular: preguntas frecuentes](https://repositorio.minedu.gob.pe/bitstream/handle/20.500.12799/8311/Planificaci%C3%B3n%20curricular%20preguntas%20frecuentes.pdf?sequence=1).
- [MINEDU — Cartilla: cómo planificar el proceso de enseñanza, aprendizaje y evaluación formativa](https://repositorio.minedu.gob.pe/handle/20.500.12799/5310).
- [MINEDU — Programa curricular de Educación Inicial](https://repositorio.minedu.gob.pe/handle/20.500.12799/4548).
- [MINEDU — Programa curricular de Educación Primaria](https://repositorio.minedu.gob.pe/handle/20.500.12799/4549).

La consulta automatizada del repositorio encontró un control de seguridad; por ello estos documentos se enlazan como referencias para verificación humana y **no** se presenta una transcripción curricular como si se hubiera comprobado línea por línea.

## Cómo probar esta copia

1. Descomprimir el ZIP completo en una carpeta exclusiva.
2. Desde la carpeta descomprimida, levantar un servidor local (por ejemplo, `python3 -m http.server 4173`) y abrir `http://localhost:4173`.
3. Configurar una IE y un docente de prueba, generar una Unidad/Proyecto y seleccionar situación y producto.
4. Generar una sesión; revisar que actividad, propósito, criterio y evidencia se relacionen con el reto.
5. Cambiar la IE y el nivel, reabrir y exportar el documento anterior; verificar que los datos históricos no cambien.
6. Repetir para Inicial, Primaria multigrado y Secundaria, y abrir los documentos en Word real.

Pruebas offline principales:

```bash
node tests/context-topic-golden.mjs
node tests/three-level-pedagogy.mjs
node tests/unit-preview-history.mjs
node tests/unit-session-context-snapshot.mjs
node tests/historical-document-identity.mjs
```

Esta entrega **no se ha publicado**; los proyectos GitHub y Supabase originales no fueron modificados.
