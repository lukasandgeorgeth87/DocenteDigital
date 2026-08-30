# Especificación Maestra – Plataforma de Gestión Docente y Directiva MINEDU v1.0

**Proyecto:** DocenteDigital  
**Estado:** Regla de arquitectura y documento rector del proyecto  
**Versión:** 1.0  
**Principio:** La IA propone; el docente y el director deciden.

---

## 1. Regla de arquitectura no negociable

DocenteDigital **no será únicamente un generador mediante inteligencia artificial**. La plataforma deberá construirse sobre una base estructurada, versionada y auditable del Currículo Nacional de la Educación Básica, programas curriculares, normativa MINEDU, orientaciones oficiales, gestión escolar y documentos propios de cada institución.

La IA deberá **consultar esa base**, recuperar la información pertinente al nivel, grado, área, modalidad y contexto, y utilizarla para proponer contenidos. **Nunca deberá sustituir una fuente oficial, inventar competencias, capacidades, estándares, desempeños o normas, ni presentar una teoría pedagógica de autor como si fuera una exigencia del MINEDU.**

Toda generación deberá conservar trazabilidad y permitir al usuario saber de dónde provino la información curricular o normativa utilizada.

Esta regla prevalece sobre cualquier decisión posterior de interfaz, proveedor de IA, base de datos o tecnología.

---

## 2. Alcance de la plataforma

La plataforma deberá soportar como mínimo:

- Educación Básica Regular.
- Inicial.
- Primaria.
- Secundaria.
- Instituciones unidocentes.
- Instituciones multigrado.
- Instituciones polidocentes.
- Contextos EIB.
- Trabajo en castellano, lengua originaria o bilingüe cuando corresponda.
- Uso desde computadora, laptop, tablet y celular.
- Roles separados de Docente, Director y Docente + Director.
- Varias instituciones sin mezclar información entre ellas.
- Escalamiento progresivo desde una IE hasta UGEL, región y uso nacional.

No se deberá usar un único motor pedagógico para todos los niveles y tipos de IE.

---

## 3. Arquitectura funcional por capas

DocenteDigital deberá separar claramente:

### 3.1 Capa oficial MINEDU

Contendrá información estructurada y versionada de:

- CNEB.
- Programas curriculares de Inicial, Primaria y Secundaria.
- Competencias.
- Capacidades.
- Estándares.
- Desempeños base por grado/ciclo cuando la fuente oficial los establezca.
- Enfoques transversales.
- Competencias transversales.
- Normativa de evaluación.
- Normativa de gestión escolar.
- Orientaciones EIB.
- Orientaciones para aula multigrado y rural.
- Normativa anual y disposiciones que afecten planificación, evaluación o gestión.

La capa deberá conservar **fuente, fecha, versión, estado normativo y alcance**.

### 3.2 Capa institucional

Contendrá información propia de cada IE:

- Datos de la institución.
- Nivel o niveles que atiende.
- Tipo de IE.
- Secciones y grados.
- Lenguas de trabajo.
- Calendario comunal.
- Diagnóstico.
- PEI.
- PAT.
- PCI.
- RI.
- Planes, comités y documentos de gestión.
- Horarios docentes.
- Recursos disponibles.
- Datos del docente y/o director.
- Versiones aprobadas de unidades, proyectos, sesiones e instrumentos.

### 3.3 Capa pedagógica

Transformará información oficial + institucional + contexto en propuestas de:

- Diagnóstico.
- Programación anual.
- Unidad de aprendizaje.
- Proyecto de aprendizaje.
- Sesiones.
- Estrategias.
- Materiales.
- Instrumentos.
- Registro auxiliar.
- Conclusiones descriptivas.

### 3.4 Capa IA

La IA actuará como **asistente**, nunca como fuente normativa principal.

Funciones permitidas:

- Proponer.
- Redactar.
- Adaptar lenguaje.
- Contextualizar.
- Sugerir estrategias.
- Revisar coherencia.
- Detectar vacíos.
- Mejorar títulos.
- Generar alternativas.
- Ayudar a producir materiales e instrumentos.

Funciones no permitidas:

- Inventar normas.
- Inventar datos curriculares oficiales.
- Declarar vigencia normativa sin verificación.
- Modificar silenciosamente contenido ya aprobado por el docente/director.
- Sustituir decisiones profesionales del usuario.

---

## 4. Jerarquía obligatoria de fuentes

Cuando exista información de varias procedencias, se usará esta prioridad:

1. Norma MINEDU vigente y aplicable.
2. CNEB.
3. Programa Curricular del nivel.
4. Orientaciones y fascículos oficiales MINEDU.
5. Documentos especializados EIB, multigrado, ruralidad e inclusión.
6. Guías por área curricular.
7. Investigación pedagógica y autores.
8. Documentos propios de la IE y del docente, siempre que no contradigan una fuente oficial vigente.

Si dos fuentes entran en conflicto, la plataforma debe advertirlo y no resolverlo inventando.

---

## 5. Trazabilidad pedagógica obligatoria

Toda unidad, proyecto o sesión deberá mantener una cadena verificable:

**Competencia → Capacidad → Estándar → Desempeño → Propósito → Criterio → Evidencia → Instrumento**

Reglas:

- No resumir una competencia omitiendo capacidades requeridas.
- No presentar un criterio como copia automática del desempeño.
- El criterio deberá derivarse de las acciones observables necesarias para alcanzar el propósito y responder al reto.
- La evidencia deberá permitir observar el criterio.
- El instrumento deberá evaluar exactamente los criterios aprobados.
- El desempeño deberá corresponder al grado/ciclo correcto.
- En multigrado, la misma sesión puede tener un propósito común y desempeños/tareas diferenciados por grado.
- Si una fuente curricular literal aún no está conectada, la plataforma deberá mostrar **Pendiente de verificación** y no afirmar que es literal.

---

## 6. Motores pedagógicos independientes

### 6.1 Primaria EIB multigrado/unidocente

Usará como referencia principal los Prompt Maestro entregados para Unidad/Proyecto y Sesión.

Debe incluir:

- Contexto sociocultural y lingüístico.
- Calendario comunal.
- Diálogo de saberes.
- Atención simultánea y diferenciada.
- Atención directa e indirecta.
- Tareas por grado/ciclo.
- Trabajo autónomo y agrupamientos flexibles.
- Uso pertinente de la lengua.
- Procesos didácticos por área.
- Evaluación formativa.
- Estrategias variadas según propósito y evidencia.

### 6.2 Primaria polidocente

No debe forzar lógica multigrado. Trabajará normalmente con grado/sección y mantendrá los procesos pedagógicos y didácticos correspondientes.

### 6.3 Inicial

Tendrá motor propio basado en:

- Edad/ciclo.
- Experiencias.
- Juego.
- Exploración.
- Interacción.
- Movimiento.
- Observación.
- Evidencias propias del nivel.

No se adaptarán de manera mecánica los formatos de Primaria.

### 6.4 Secundaria

Tendrá motor propio organizado por:

**Nivel → grado → sección → área → programación anual → unidad/proyecto → sesiones → evaluación → registro.**

No se copiará el motor multigrado de Primaria.

---

## 7. Unidad y Proyecto de aprendizaje

Antes de generar el documento completo deberá existir una **Auditoría Relámpago**.

La creación deberá contemplar:

- Datos generales.
- Contexto real del docente.
- Título mejorado/propuesto por la app.
- Dos propuestas de Situación Significativa conforme al Prompt Maestro.
- Opción para que el docente escriba la suya.
- Tres propuestas de Producto Final tangible conforme al Prompt Maestro.
- Opción para producto propio.
- Reto claro.
- Propósitos.
- Competencias y capacidades.
- Desempeños diferenciados por grado.
- Criterios.
- Evidencias.
- Instrumentos.
- Enfoques transversales.
- Competencias transversales.
- Matriz de articulación.
- Secuencia construida con horario real.
- Número real de sesiones por día.
- Registro e instrumentos.

**Unidad y Proyecto se exportarán en A4 horizontal**, con formato profesional.

Proyecto y Unidad no deberán diferenciarse solo por el nombre: el Proyecto debe mostrar un problema/desafío auténtico, investigación/creación, construcción progresiva de un producto, revisión y socialización.

---

## 8. Sesión de aprendizaje

Antes de generar una sesión deberá ejecutarse una **Auditoría Relámpago de Sesión** según el motor pedagógico activo.

Para Primaria EIB multigrado/unidocente deberá revisar al menos:

- Datos informativos reutilizados desde la unidad.
- Título motivador.
- Competencia y capacidades.
- Desempeños de la unidad.
- Criterio macro de la unidad y su desagregación.
- Evidencia.
- Instrumento.
- Inclusión o barreras.
- Materiales e insumos.
- Recursos disponibles en el aula.
- Procesos didácticos del área.
- Atención diferenciada y simultánea.
- Razonamiento y pensamiento de orden superior.
- Retroalimentación.
- Cierre y metacognición.
- Coherencia total con la unidad/proyecto.

No se deberán repetir siempre las mismas estrategias. El motor podrá combinar estrategias de autores y orientaciones oficiales de acuerdo con área, competencia, edad/grado, evidencia, recursos y contexto.

---

## 9. Horario y sesiones por día

El docente podrá:

- Subir su horario en Word (.docx).
- Editarlo manualmente.
- Guardarlo una sola vez.
- Reutilizarlo en las siguientes unidades/proyectos.

La plataforma deberá crear el número real de sesiones que correspondan a cada día según el horario, no asumir una sola sesión diaria.

También podrá existir una opción manual de 2 o 3 sesiones por día para prototipos o casos sin horario cargado.

---

## 10. Recursos disponibles

Los recursos del aula serán de selección múltiple y persistentes.

Ejemplos:

- Pizarra.
- TV.
- Impresora.
- Laptop/computadora.
- Cañón/proyector.
- Tabletas.
- Celulares.
- Internet.
- Parlantes.
- Biblioteca.
- Material concreto.
- Papelotes/cartulinas.
- Patio.
- Kits de ciencia.
- Otros.

La app seleccionará solo los pertinentes a la sesión y propondrá alternativa no digital cuando sea necesario.

---

## 11. Banco pedagógico de autores

Los autores enriquecen, no norman.

La plataforma podrá utilizar, entre otros:

- Doug Lemov.
- Rebeca Anijovich.
- Francisco Mora.
- Frida Díaz Barriga.
- Delia Lerner.
- Daniel Cassany.
- George Pólya.
- Guy Brousseau.
- Melina Furman.
- Carol Ann Tomlinson.
- Wiggins y McTighe.
- Dylan Wiliam.
- Black y Wiliam.
- Heritage.
- Sadler.
- Brookhart.
- Hattie y Timperley.
- Shute.
- Zabala y Arnau.
- Rosenshine.
- Archer y Hughes.
- Larmer, Mergendoller y Boss.
- Johnson & Johnson.
- Meyer, Rose y Gordon.
- Trapnell.
- Quintasi.
- Quispe.
- Villavicencio.

La selección será contextual y variable, no una receta fija.

---

## 12. Motor independiente de normativas

El sistema de normas deberá ser independiente del código principal de la aplicación.

Cada norma deberá registrar al menos:

- Código/tipo.
- Título.
- Fecha.
- Entidad emisora.
- Fuente oficial.
- Alcance.
- Nivel afectado.
- Tema.
- Estado.
- Norma que modifica.
- Norma que deroga/sustituye.
- Fecha de última verificación.

Estados previstos:

- VIGENTE.
- VIGENTE CON MODIFICATORIAS.
- MODIFICADA.
- DEROGADA.
- SUSTITUIDA.
- EN REVISIÓN.
- PENDIENTE DE VERIFICACIÓN.

Una actualización normativa deberá poder hacerse sin reconstruir toda la aplicación.

---

## 13. Módulo Director

Debe estar separado visual y funcionalmente del espacio Docente.

Funciones mínimas futuras:

- Datos institucionales.
- PEI.
- PAT.
- PCI.
- RI.
- Planes y comités.
- Oficios.
- Resoluciones Directorales.
- Informes.
- Numeración automática controlada.
- Documentos recibidos/enviados.
- Mantenimiento.
- Historial de documentos.
- Versiones.
- Alertas normativas.

Regla de coherencia:

**PEI → PAT → PCI → RI** deben guardar coherencia institucional. Un cambio relevante deberá advertir qué documentos pueden requerir actualización.

---

## 14. Arquitectura multiinstitución y roles

Cada usuario deberá pertenecer a una o varias instituciones con un rol explícito.

Roles mínimos:

- Docente.
- Director.
- Docente + Director.

Los datos de una institución nunca deberán mezclarse con los de otra.

Modelo esperado:

**Usuario → Institución → Rol → Nivel → Grado/Sección/Área → Documentos y datos.**

La futura base de datos deberá aplicar aislamiento y reglas de acceso por institución y rol.

---

## 15. Persistencia, autosave e historial

Todo trabajo importante deberá:

- Guardarse automáticamente.
- Poder recuperarse después de cerrar la app.
- Tener fecha de última edición.
- Tener versiones.
- Permitir restaurar una versión anterior.
- Evitar sobreescritura silenciosa.
- Mantener papelera o mecanismo de recuperación.

La IA no deberá reemplazar una versión aprobada sin generar una nueva versión o pedir confirmación.

---

## 16. Conectividad limitada y modo móvil

La interfaz deberá ser móvil primero.

En celular:

- Navegación simple.
- Botones grandes.
- Una columna.
- Campos táctiles.
- Mínima carga de datos.
- Reanudación después de cortes.

La arquitectura deberá permitir posteriormente:

- Caché local de datos esenciales.
- Edición básica sin conexión.
- Cola de sincronización.
- Reintento de operaciones cuando regrese internet.

---

## 17. Seguridad y privacidad

La plataforma deberá aplicar:

- Autenticación.
- Autorización por rol.
- Separación por institución.
- Protección de datos personales.
- Conexión cifrada.
- Registros de cambios relevantes.
- Copias de respaldo.
- Recuperación ante pérdida.
- Eliminación/archivo controlado.

No se deben exponer datos de estudiantes entre instituciones o usuarios no autorizados.

---

## 18. Exportaciones profesionales

Formatos requeridos:

- Word real (.docx).
- PDF.
- Excel (.xlsx).
- ZIP cuando corresponda a paquetes de sesión/materiales.

Formato pedagógico solicitado:

- Fuente Agency FB cuando esté disponible en el equipo.
- Cuerpo 11 pt.
- Títulos en negrita.
- Bordes entrecortados de página donde corresponda.
- Pie de página con docente + IE en 9 pt cursiva.
- Unidad/Proyecto A4 horizontal.
- Sesiones y fichas en orientación definida por el formato maestro correspondiente.

No se distribuirán archivos de fuentes tipográficas.

---

## 19. Sistema de validación

La plataforma deberá validar antes de generar y antes de exportar.

Tipos de validación:

### Pedagógica
- Coherencia competencia–capacidad–estándar–desempeño–criterio–evidencia–instrumento.
- Coherencia reto–producto–actividades.
- Correspondencia grado/ciclo.
- Inclusión.
- Atención diferenciada cuando corresponda.

### Normativa
- Fuente identificada.
- Estado normativo válido.
- Advertencia si está pendiente de verificación.
- No usar norma derogada/sustituida como principal.

### Gestión
- Coherencia PEI–PAT–PCI–RI.
- Datos institucionales consistentes.
- Numeración y vigencia de documentos.

### Técnica
- Guardado.
- Versión.
- Exportación.
- Apertura móvil/escritorio.
- Recuperación después de error.

---

## 20. Pruebas de aceptación obligatorias

Una función no se considerará terminada únicamente porque “se ve bien”. Deberá pasar pruebas concretas.

Ejemplos:

1. Crear una unidad Primaria EIB multigrado con 1.º, 3.º y 5.º y comprobar que cada grado usa su información curricular correspondiente.
2. Subir un horario Word y comprobar que la secuencia crea varias sesiones diarias según los bloques reales.
3. Crear una sesión desde una unidad y comprobar que reutiliza competencia, capacidad, desempeño, criterio, evidencia e instrumento sin volver a pedirlos.
4. Cambiar un criterio en la unidad y advertir qué sesiones/instrumentos quedan desactualizados.
5. Exportar una unidad en Word horizontal y abrirla correctamente.
6. Trabajar desde celular sin pantalla en blanco ni navegación perdida.
7. Cambiar de institución y comprobar aislamiento de datos.
8. Modificar una norma del motor normativo sin recompilar toda la app.
9. Simular pérdida de conexión y comprobar recuperación/autosave.
10. Restaurar una versión anterior de una unidad o documento de gestión.

---

## 21. Estado actual del prototipo

El prototipo actual sirve para validar experiencia, estructura y lógica de trabajo. **Todavía no debe considerarse la arquitectura final de producción.**

Pendientes principales antes de una versión productiva:

- Base curricular oficial estructurada completa.
- Motores específicos de Inicial y Secundaria.
- Motor normativo real y actualización independiente.
- Autenticación y multiinstitución.
- Base de datos con seguridad por rol/institución.
- IA real conectada a fuentes verificadas.
- Exportación real .docx/.xlsx/PDF.
- Historial de versiones y autosave en servidor.
- Copias de respaldo.
- Soporte robusto para conectividad limitada.
- Pruebas automatizadas y de aceptación.

---

## 22. Regla final de desarrollo

Toda nueva pantalla, botón o función deberá responder estas preguntas antes de incorporarse:

1. ¿Qué problema real del docente/director resuelve?
2. ¿Qué datos reutiliza para no volver a pedirlos?
3. ¿Qué fuente oficial o institucional respalda la información?
4. ¿Qué motor pedagógico corresponde al nivel y tipo de IE?
5. ¿Qué trazabilidad debe conservar?
6. ¿Qué validación pasa antes de generar/exportar?
7. ¿Cómo se guarda y versiona?
8. ¿Cómo funciona en celular?
9. ¿Qué ocurre con baja conectividad?
10. ¿Qué prueba de aceptación demuestra que funciona?

Si una función no puede responder adecuadamente estas preguntas, **no debe considerarse terminada**.
