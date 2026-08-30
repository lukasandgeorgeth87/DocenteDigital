# Especificación Maestra – Módulo Director v1.0

**Proyecto:** DocenteDigital  
**Base recibida:** Biblioteca Maestra de Gestión Escolar EBR – MINEDU 2026  
**Estado:** Documento rector del módulo Director  
**Regla:** La app no inventa obligaciones. Primero determina qué corresponde a la IE y luego genera.

---

## 1. Principio de simplificación y anti-burocracia

El Módulo Director debe evitar multiplicar documentos por costumbre. Antes de ofrecer un documento debe identificar:

- gestión pública o privada;
- nivel o niveles: Inicial, Primaria, Secundaria;
- tipo de IE: unidocente, multigrado, polidocente incompleta o polidocente completa;
- pertenencia o no a una red educativa;
- modelo de servicio educativo;
- contexto rural, urbano y/o EIB;
- número de secciones;
- servicios, programas y acciones que realmente implementa la IE.

La app debe advertir cuando el usuario intenta crear un plan independiente que puede o debe integrarse en PAT, RI, PCI o DG, según la base normativa vigente.

---

## 2. Decisión automática del instrumento de gestión

### 2.1 IE polidocente completa

La carpeta del Director debe trabajar, según corresponda, con:

- PEI.
- PAT.
- PCI.
- RI.
- Resolución Directoral de aprobación o actualización.
- Evidencias de participación.
- Comités de Gestión Escolar.
- CONEI.
- Calendarización y horarios.
- Normas de convivencia.
- Plan Lector.
- Tutoría, orientación educativa y convivencia.
- Monitoreo y acompañamiento pedagógico.
- Gestión del Riesgo de Desastres y contingencia según riesgos y norma aplicable.
- SAE interno cuando corresponda.
- Matrícula y registros.
- Mantenimiento cuando el local sea beneficiario.
- Seguimiento y balance de metas.

### 2.2 IE unidocente / multigrado / polidocente incompleta

Antes de generar documentos, la app debe preguntar si la IE pertenece a una red educativa.

Si no pertenece a una red y corresponde la simplificación normativa, la app debe priorizar un **Documento de Gestión (DG) único**, evitando generar PEI, PAT, PCI y RI separados innecesariamente.

El DG debe integrar como mínimo:

- identidad: misión, visión, principios y/o valores;
- diagnóstico de la gestión escolar;
- normas de convivencia concertadas;
- plan de estudios o lineamientos pedagógicos básicos;
- programación anual de actividades;
- calendarización;
- objetivos, metas y acciones priorizadas;
- seguimiento y evaluación.

---

## 3. Estructura y relación entre instrumentos

### PEI

**Función:** orientar la gestión de mediano plazo y servir de base para los demás instrumentos.

Debe considerar:

- identidad institucional;
- diagnóstico basado en evidencias;
- objetivos y metas institucionales;
- propuesta pedagógica;
- propuesta de gestión.

### PAT

**Función:** concretar los objetivos y metas del PEI en actividades, responsables y plazos.

Debe considerar:

- programación anual de actividades;
- responsables y plazos;
- actividades mínimas sectoriales aplicables;
- calendarización y horas lectivas;
- seguimiento y evaluación.

### PCI

**Función:** concretar la propuesta pedagógica y contextualizar/diversificar el CNEB.

Debe considerar:

- caracterización y diagnóstico pedagógico;
- propuesta pedagógica institucional;
- orientaciones para planificación curricular;
- orientaciones para mediación y estrategias;
- evaluación formativa;
- plan de estudios;
- atención a la diversidad e inclusión;
- orientaciones EIB/interculturales cuando corresponda.

### RI

**Función:** regular organización, funcionamiento, convivencia y procedimientos internos.

Debe considerar:

- organización de la IE y responsabilidades;
- procedimientos de actuación y comunicación;
- normas de convivencia concertadas;
- derechos, responsabilidades y participación;
- procedimientos de convivencia, atención y protección;
- reglas propias de la IE sin copiar innecesariamente toda la normativa nacional.

---

## 4. Coherencia institucional obligatoria

La aplicación debe mantener una relación verificable:

**Diagnóstico → PEI → objetivos/metas → PAT → PCI → RI → seguimiento → balance anual**

Reglas:

- El PAT debe derivar de objetivos y metas del PEI.
- El PCI debe concretar la propuesta pedagógica institucional y el contexto de estudiantes.
- El RI debe ser coherente con la organización, convivencia y responsabilidades institucionales.
- Si cambia un dato estructural, la app debe advertir qué documentos podrían necesitar actualización.
- En una IE con DG único, esa coherencia se mantiene dentro del mismo documento articulador.

---

## 5. Documentos vinculados y anexos

La carpeta del Director debe poder organizar, según corresponda:

- RD de aprobación/actualización de IIGG o DG.
- Actas y evidencias de participación de la comunidad educativa.
- Conformación de los tres Comités de Gestión Escolar.
- Documentación del CONEI.
- Documentación APAFA.
- Programación de Tutoría, Orientación Educativa y Convivencia.
- Normas de convivencia institucional y de aula.
- Registro de incidencias y gestión de casos vinculados a SíseVe.
- Plan Lector.
- Monitoreo, acompañamiento y fortalecimiento de la práctica pedagógica.
- Documentación de creación/implementación del SAE interno.
- Gestión del riesgo de desastres y contingencias.
- Calendarización, horarios y distribución del tiempo.
- Documentación del proceso de matrícula.
- Inventario, recepción, distribución y control de materiales.
- Documentación de mantenimiento para locales beneficiarios.
- Balance/evaluación anual de metas y actividades.

La app debe diferenciar claramente: **instrumento de gestión / plan articulado / protocolo / registro / resolución / acta / evidencia / informe**.

---

## 6. Motor independiente de normativas de gestión

La normativa del Director debe estar separada del código de generación de documentos.

Cada registro normativo deberá guardar:

- identificador;
- categoría;
- norma;
- título;
- materia de uso;
- año o periodo de aplicación;
- fuente oficial;
- estado;
- modificatorias;
- norma que deroga o sustituye;
- fecha de última verificación.

Estados mínimos:

- VIGENTE.
- VIGENTE CON MODIFICATORIAS.
- MODIFICADA.
- DEROGADA.
- SUSTITUIDA.
- PENDIENTE DE VERIFICACIÓN.
- REQUIERE REEMPLAZO PARA EL NUEVO AÑO.

Las normas anuales, como Año Escolar o Mantenimiento, no deben seguir utilizándose automáticamente cuando termina su periodo.

---

## 7. Auditoría relámpago del Director

Antes de generar cualquier documento, el sistema debe revisar rápidamente:

1. Tipo de IE y gestión.
2. Nivel(es) atendidos.
3. Red educativa, cuando corresponda.
4. Contexto y modelo de servicio.
5. Instrumento correcto: PEI/PAT/PCI/RI o DG único.
6. Norma aplicable y estado de verificación.
7. Coherencia con documentos institucionales ya aprobados.
8. Duplicación documental innecesaria.
9. Datos institucionales obligatorios.
10. Responsables, plazos, metas o mecanismos de seguimiento cuando corresponda.
11. Resolución, acta o evidencia vinculada si corresponde.
12. Versiones y vigencia del documento.

Resultado esperado:

**⚡ Auditoría de Gestión: 12/12 – Lista para generar**

o, si falta algo:

**⚠ Falta verificar la norma anual / el documento puede estar duplicando una acción ya integrada en el PAT.**

---

## 8. Carpeta Director propuesta

La interfaz debe organizarse por bloques simples:

### 🏫 Gestión institucional
- PEI
- PAT
- PCI
- RI
- Documento de Gestión – DG

### 👥 Organización y participación
- Comités de Gestión Escolar
- CONEI
- APAFA
- Actas
- Resoluciones Directorales

### ❤️ Bienestar y convivencia
- Tutoría y Orientación Educativa
- Convivencia escolar
- Normas de convivencia
- Incidencias / SíseVe
- SAE / inclusión

### 📚 Gestión pedagógica
- Plan Lector
- Monitoreo y acompañamiento
- Calendarización
- Horarios
- Seguimiento de aprendizajes y acciones pedagógicas

### 🛡️ Condiciones operativas
- GRD y contingencias
- Matrícula
- Inventarios y materiales
- Mantenimiento

### ✉️ Trámite documentario
- Oficios
- Informes
- Memorandos, si corresponde
- Resoluciones
- Numeración controlada
- Recibidos / enviados

### 📊 Seguimiento y cierre
- Seguimiento de metas
- Balance anual
- Historial de versiones
- Documentos pendientes de actualización

---

## 9. Generador de Resoluciones Directorales

La app debe poder crear RD contextualizadas para aprobación o actualización de IIGG/DG.

Reglas:

- reutilizar datos de la IE;
- usar numeración controlada;
- incluir VISTOS, CONSIDERANDO y SE RESUELVE;
- completar la base legal solo con normas aplicables y verificadas;
- evitar normas derogadas;
- relacionar la RD con el documento que aprueba;
- guardar versión, fecha, responsable y archivo exportado.

---

## 10. Fuentes prioritarias de la Biblioteca recibida

La biblioteca entregada por el usuario identifica como fuentes prioritarias para el módulo:

- Guía para la gestión escolar en instituciones y programas educativos de la Educación Básica.
- Guía para la elaboración del PEI y PAT.
- Guía para la elaboración e implementación del PCI.
- Guía para la elaboración del RI.
- Guía para la elaboración e implementación del Documento de Gestión para IE unidocente, polidocente incompleta o multigrado y programas educativos.
- Cartilla para diagnóstico de IE unidocente y multigrado.
- Cartilla sobre semanas de gestión.
- Portal oficial de normas MINEDU.

**Importante:** las referencias normativas y su vigencia deberán verificarse periódicamente en la fuente oficial antes de que la plataforma las marque como vigentes.

---

## 11. Regla final del Módulo Director

DocenteDigital debe ayudar al Director a **reducir burocracia, no aumentarla**.

Antes de crear un documento debe responder internamente:

1. ¿Este documento realmente corresponde a esta IE?
2. ¿Puede integrarse en otro instrumento?
3. ¿La norma está vigente y aplica al caso?
4. ¿Es coherente con PEI/PAT/PCI/RI o DG?
5. ¿Ya existe una versión aprobada que debe actualizarse en lugar de crear otra desde cero?

Si alguna respuesta es incierta, la app debe advertir y pedir solo el dato indispensable, nunca inventar.