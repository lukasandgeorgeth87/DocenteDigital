# AMPLIACIÓN DE LA AUDITORÍA MAESTRA

# SISTEMA INTEGRAL CARPETA DOCENTE + CARPETA DIRECTOR + FUNCIONALIDAD REAL

## PROPÓSITO

La aplicación debe ser auditada como un SISTEMA INTEGRAL DE GESTIÓN EDUCATIVA y no solamente como un generador de documentos mediante inteligencia artificial.

Debe responder a dos grandes espacios de trabajo:

### CARPETA DOCENTE

Orientada a:

- planificación curricular;
- programación anual;
- unidades;
- proyectos;
- experiencias de aprendizaje cuando correspondan;
- sesiones;
- actividades;
- materiales;
- fichas;
- instrumentos de evaluación;
- registro auxiliar;
- seguimiento de estudiantes;
- evaluación formativa;
- retroalimentación;
- evidencias;
- atención diferenciada;
- documentos propios del trabajo docente.

### CARPETA DIRECTOR

Orientada a:

- planificación institucional;
- gestión pedagógica;
- gestión administrativa;
- condiciones operativas;
- bienestar;
- convivencia;
- documentos de gestión;
- resoluciones directorales;
- oficios;
- informes;
- actas;
- planes;
- comités;
- CONEI;
- seguimiento institucional;
- monitoreo pedagógico;
- mantenimiento;
- cronogramas;
- comunicaciones;
- archivo institucional;
- demás documentos y procedimientos que correspondan legalmente a la dirección de una institución educativa.

Ambas carpetas deben compartir información institucional para evitar que el usuario vuelva a escribir repetidamente los mismos datos.

---

# 1. NUEVA ARQUITECTURA DE MOTORES

La aplicación deberá integrar los motores ya definidos:

MRP
Motor de Razonamiento Pedagógico.

MSF
Motor de Sustento y Formalización.

MAPI
Motor de Auditoría Pedagógica Inteligente.

MAN
Motor de Actualización Normativa.

MROA
Motor de Rúbricas y Observabilidad de Aula.

MDPD
Motor de Procesos Pedagógicos y Didácticos.

Y agregar:

### MOTOR 7: MGD

MOTOR DE GESTIÓN DIRECTIVA.

### MOTOR 8: MDA

MOTOR DE DOCUMENTACIÓN ADMINISTRATIVA.

### MOTOR 9: MFO

MOTOR DE FUNCIONALIDAD OPERATIVA.

### MOTOR 10: MTD

MOTOR DE TRAZABILIDAD DOCUMENTAL.

---

# 2. PRINCIPIO DE FUNCIONAMIENTO

La app debe dejar de pensar solamente:

“¿QUÉ DOCUMENTO QUIERE GENERAR?”

Debe comenzar a pensar:

¿QUIÉN ES EL USUARIO?

↓

¿QUÉ FUNCIÓN ESTÁ REALIZANDO?

↓

¿QUÉ TIPO DE IE TIENE?

↓

¿QUÉ NORMA LE CORRESPONDE?

↓

¿QUÉ INFORMACIÓN YA EXISTE EN EL SISTEMA?

↓

¿QUÉ DOCUMENTO O ACCIÓN NECESITA?

↓

¿QUÉ INFORMACIÓN ES OBLIGATORIA?

↓

¿QUÉ PUEDE COMPLETAR LA IA?

↓

¿QUÉ DEBE DECIDIR EL PROFESIONAL?

↓

GENERAR

↓

AUDITAR

↓

EDITAR

↓

APROBAR

↓

ARCHIVAR

↓

REUTILIZAR.

---

# 3. UNA SOLA BASE INSTITUCIONAL

La aplicación debe tener una FICHA MAESTRA DE LA IE.

Registrar una sola vez:

- nombre de la IE;
- código modular;
- código de local;
- UGEL;
- DRE/GRE;
- región;
- provincia;
- distrito;
- centro poblado/comunidad;
- ámbito rural/urbano;
- modalidad;
- niveles;
- turnos;
- tipo de gestión;
- característica;
- unidocente/multigrado/polidocente;
- EIB/no EIB;
- lengua o lenguas;
- director;
- docentes;
- grados;
- secciones;
- número de estudiantes;
- calendario escolar;
- calendario comunal cuando corresponda;
- recursos disponibles;
- características relevantes de la comunidad.

Esta información debe reutilizarse automáticamente.

PROHIBIDO solicitarla nuevamente en cada documento.

---

# 4. PERFIL DOCENTE Y PERFIL DIRECTOR

El sistema debe reconocer roles.

### DOCENTE

Accede prioritariamente a herramientas pedagógicas.

### DIRECTOR

Accede a:

CARPETA DIRECTOR

-

cuando corresponda:

CARPETA DOCENTE.

Esto es especialmente importante en instituciones unidocentes donde una misma persona puede ejercer funciones de director y docente.

---

# 5. NO DUPLICAR INFORMACIÓN

Si el director ya registró:

Nombre IE.

UGEL.

Director.

Año.

Características.

Número de estudiantes.

estos datos deben aparecer automáticamente en:

PEI.

PAT.

PCI.

RI.

Documento de Gestión.

RD.

Oficios.

Informes.

Planes.

Actas.

No pedirlos nuevamente.

---

# 6. CARPETA DOCENTE

La auditoría debe comprobar como mínimo los siguientes módulos.

## PLANIFICACIÓN

- Programación anual.
- Unidad de aprendizaje.
- Proyecto de aprendizaje.
- Experiencia de aprendizaje cuando corresponda.
- Sesiones.
- actividades.
- secuencias.
- organización temporal.

---

# 7. GENERACIÓN ARTICULADA

Debe existir trazabilidad:

PROGRAMACIÓN ANUAL

↓

UNIDAD / PROYECTO

↓

SESIONES

↓

ACTIVIDADES

↓

EVIDENCIAS

↓

EVALUACIÓN

↓

REGISTRO.

Una sesión no debe aparecer desconectada de la unidad.

---

# 8. BOTÓN “CREAR SESIONES DE TODA LA UNIDAD”

Esta función debe ser auditada rigurosamente.

Al ejecutarla:

1. leer la unidad completa;
2. identificar todas las sesiones;
3. respetar títulos;
4. respetar áreas;
5. respetar competencias;
6. respetar productos;
7. respetar temporalización;
8. desarrollar cada sesión;
9. diferenciar grados cuando corresponda;
10. generar instrumentos;
11. generar materiales cuando corresponda;
12. auditar cada sesión;
13. guardar cada sesión individualmente;
14. permitir descargar todo;
15. mantener relación con la unidad original.

PROHIBIDO cambiar arbitrariamente los títulos definidos en la unidad.

---

# 9. AUDITORÍA DE COHERENCIA ENTRE DOCUMENTOS

Comprobar:

PROGRAMACIÓN ↔ UNIDAD.

UNIDAD ↔ SESIONES.

SESIÓN ↔ CRITERIO.

CRITERIO ↔ EVIDENCIA.

EVIDENCIA ↔ INSTRUMENTO.

INSTRUMENTO ↔ REGISTRO AUXILIAR.

Si existe contradicción:

ALERTA.

---

# 10. REGISTRO AUXILIAR

El registro auxiliar no debe ser una simple tabla vacía.

Debe recuperar automáticamente:

- estudiantes;
- áreas;
- competencias;
- criterios;
- evidencias;
- periodos;
- valoraciones.

Debe permitir:

- editar;
- filtrar;
- ordenar;
- guardar;
- recuperar;
- exportar;
- visualizar progresos.

---

# 11. EVALUACIÓN POR COMPETENCIAS

El sistema debe mantener:

ESTUDIANTE

↓

COMPETENCIA

↓

CRITERIOS

↓

EVIDENCIAS

↓

VALORACIONES

↓

RETROALIMENTACIONES

↓

PROGRESO.

No convertir automáticamente una competencia en promedio matemático si la normativa vigente no establece dicho procedimiento.

---

# 12. HISTORIAL DEL ESTUDIANTE

La app puede permitir visualizar pedagógicamente:

- evidencias anteriores;
- fortalezas;
- dificultades;
- retroalimentaciones;
- progreso.

Pero debe proteger estrictamente los datos personales.

---

# 13. GENERADOR DE INSTRUMENTOS

Debe crear según necesidad:

- lista de cotejo;
- rúbrica;
- escala de valoración;
- otros instrumentos pertinentes.

No seleccionar un instrumento únicamente por costumbre.

Primero analizar:

CRITERIO + EVIDENCIA + NATURALEZA DEL APRENDIZAJE.

---

# 14. AUDITORÍA DE MATERIALES

La carpeta docente debe permitir generar:

- fichas;
- lecturas;
- tarjetas;
- organizadores;
- material gráfico;
- recursos para evaluación;
- material diferenciado.

Cada material debe ser auditado por:

grado + edad + propósito + criterio + legibilidad + ortografía + pertinencia.

---

# 15. CARPETA DIRECTOR

La carpeta Director debe funcionar como:

CENTRO DE GESTIÓN DE LA IE.

No como una colección desordenada de plantillas Word.

---

# 16. PANEL PRINCIPAL DEL DIRECTOR

Mostrar:

HOY.

PENDIENTES.

DOCUMENTOS POR ACTUALIZAR.

DOCUMENTOS POR APROBAR.

PLAZOS.

ACTIVIDADES DEL PAT.

COMITÉS.

INFORMES PENDIENTES.

DOCUMENTOS RECIENTES.

ALERTAS NORMATIVAS.

---

# 17. INSTRUMENTOS DE GESTIÓN

La aplicación deberá trabajar correctamente:

### PEI

Proyecto Educativo Institucional.

### PAT

Plan Anual de Trabajo.

### PCI

Proyecto Curricular Institucional.

### RI

Reglamento Interno.

---

# 18. DOCUMENTO DE GESTIÓN PARA IE UNIDOCENTE/MULTIGRADO

La aplicación debe reconocer automáticamente cuando corresponde elaborar un DOCUMENTO DE GESTIÓN ÚNICO.

No obligar a una IE unidocente o multigrado a desarrollar innecesariamente documentos separados cuando la normativa permita el documento único.

Preguntar o detectar:

TIPO DE IE

↓

APLICAR ESTRUCTURA CORRESPONDIENTE.

---

# 19. AUDITORÍA DEL PEI

Verificar:

- identidad;
- diagnóstico;
- características de la comunidad;
- resultados;
- objetivos institucionales;
- metas;
- propuesta de gestión;
- relación con aprendizajes;
- acceso;
- permanencia;
- mediano plazo;
- articulación con otros instrumentos.

No generar diagnósticos ficticios.

---

# 20. DATOS DEL PEI

Clasificar información como:

### DATO REAL REGISTRADO

### DATO CALCULADO

### DATO PROPUESTO POR IA

### DATO PENDIENTE

La IA nunca debe inventar:

número de estudiantes,
resultados de aprendizaje,
porcentaje de asistencia,
infraestructura,
deserción,
personal,
presupuesto.

---

# 21. AUDITORÍA DEL PAT

El PAT debe derivarse del:

DIAGNÓSTICO

-

OBJETIVOS DEL PEI

-

NECESIDADES DEL AÑO.

Debe incluir actividades viables.

Cada actividad deberá tener:

- responsable;
- periodo;
- recursos;
- evidencia;
- seguimiento.

---

# 22. PAT INTELIGENTE

El sistema debe permitir:

ACTIVIDAD DEL PAT

↓

CALENDARIO

↓

RESPONSABLE

↓

RECORDATORIO

↓

EVIDENCIA

↓

ESTADO.

Estados:

PENDIENTE.

EN PROCESO.

CUMPLIDO.

REPROGRAMADO.

NO EJECUTADO.

---

# 23. PAT VIVO

El PAT no debe convertirse en un archivo que se genera en marzo y nunca vuelve a utilizarse.

Debe funcionar como instrumento de seguimiento durante todo el año.

---

# 24. AUDITORÍA DEL PCI

El PCI debe construirse con base en:

- CNEB;
- programas curriculares;
- contexto;
- diagnóstico;
- características de estudiantes;
- necesidades;
- diversificación curricular;
- enfoques;
- estrategias pedagógicas;
- evaluación;
- contexto lingüístico cuando corresponda.

---

# 25. CONEXIÓN PCI → DOCENTE

Una fortaleza importante de la app debe ser:

PCI

↓

PROGRAMACIÓN DOCENTE.

Lo acordado institucionalmente debe poder alimentar automáticamente las planificaciones docentes.

---

# 26. AUDITORÍA DEL RI

Verificar que contenga, conforme corresponda:

- organización;
- convivencia;
- derechos;
- responsabilidades;
- mecanismos de atención;
- funcionamiento institucional;
- disposiciones pertinentes.

Evitar copiar reglamentos de otra IE sin contextualización.

---

# 27. NORMAS DE CONVIVENCIA

Las normas de convivencia deberán estar articuladas con el RI.

No crear un conjunto diferente y contradictorio en cada documento.

---

# 28. MOTOR DE GESTIÓN DIRECTIVA

Antes de generar cualquier documento:

IDENTIFICAR NECESIDAD

↓

IDENTIFICAR COMPETENCIA DEL DIRECTOR

↓

IDENTIFICAR NORMA

↓

IDENTIFICAR TIPO DE DOCUMENTO

↓

RECUPERAR DATOS

↓

GENERAR BORRADOR

↓

AUDITAR

↓

ENTREGAR PARA REVISIÓN.

---

# 29. RESOLUCIONES DIRECTORALES

Crear un módulo específico:

### RESOLUCIONES DIRECTORALES – RD

Debe permitir:

- correlativo automático;
- año;
- fecha;
- asunto;
- vistos cuando corresponda;
- considerandos;
- base legal;
- parte resolutiva;
- artículos;
- destinatarios;
- firma;
- archivo.

---

# 30. CONTROL DE COMPETENCIA EN RD

ANTES de generar una RD:

preguntar internamente:

¿EL DIRECTOR TIENE COMPETENCIA PARA RESOLVER ESTO?

Si no existe sustento:

NO INVENTAR AUTORIDAD.

Mostrar:

“Se requiere verificar competencia normativa.”

Este debe ser un ERROR CRÍTICO.

---

# 31. NUMERACIÓN DE RD

Ejemplo conceptual:

RD N.° 001-2026-D-IE-XXXX

Luego:

2.
3.
4.

El sistema debe mantener el correlativo.

PROHIBIDO duplicar números.

---

# 32. NO REINICIAR CORRELATIVOS ACCIDENTALMENTE

Si existen 27 RD emitidas:

la siguiente debe reconocer el registro existente.

No volver a:

RD N.° 001.

---

# 33. REGISTRO DE RD

Crear libro digital:

NÚMERO.

FECHA.

ASUNTO.

DOCUMENTO APROBADO.

ESTADO.

ARCHIVO.

OBSERVACIONES.

---

# 34. OFICIOS

Crear módulo:

OFICIO.

OFICIO MÚLTIPLE cuando corresponda.

Debe manejar:

- correlativo;
- destinatario;
- cargo;
- institución;
- asunto;
- referencia;
- cuerpo;
- anexos;
- firma.

---

# 35. GENERADOR INTELIGENTE DE OFICIO

El director debe poder escribir:

“Solicita apoyo a la municipalidad para reparar el techo.”

Y la app:

1. comprende finalidad;
2. propone tipo de documento;
3. recupera datos de IE;
4. redacta formalmente;
5. permite seleccionar destinatario;
6. genera asunto;
7. permite agregar anexos;
8. asigna correlativo cuando se aprueba.

---

# 36. NUMERACIÓN DIFERENCIADA

Mantener registros independientes:

RD.

OFICIOS.

INFORMES.

MEMORANDOS si corresponden.

ACTAS.

No mezclar correlativos.

---

# 37. INFORMES

Crear asistentes para:

- informe pedagógico;
- informe de actividad;
- informe de gestión;
- informe técnico cuando corresponda;
- informe de cumplimiento;
- informe dirigido a UGEL;
- otros informes institucionales.

---

# 38. INFORMES BASADOS EN DATOS REALES

Si el sistema posee datos:

utilizarlos.

Ejemplo:

ACTIVIDAD PAT

↓

EVIDENCIAS

↓

RESULTADOS

↓

INFORME.

No obligar al director a volver a escribir toda la actividad.

---

# 39. PROHIBICIÓN DE INVENTAR RESULTADOS

Nunca inventar:

“Participó el 98 % de estudiantes”

si no existe dato.

Utilizar:

[INGRESAR RESULTADO]

o solicitar el dato dentro del formulario.

---

# 40. ACTAS

Crear módulo de:

- reuniones;
- acuerdos;
- compromisos;
- responsables;
- fechas.

Luego convertir automáticamente los acuerdos en tareas del PAT o pendientes cuando corresponda.

---

# 41. PLANES

La app debe diferenciar:

PLAN OBLIGATORIO.

PLAN INTEGRADO.

PLAN REQUERIDO POR SITUACIÓN.

PLAN SOLICITADO POR UGEL/DRE.

PLAN OPCIONAL DE LA IE.

Nunca afirmar que todo plan existente en internet es obligatorio.

---

# 42. MATRIZ DE OBLIGATORIEDAD

Para cada documento guardar:

NOMBRE.

TIPO.

BASE NORMATIVA.

A QUIÉN APLICA.

PERIODO.

VIGENCIA.

QUIÉN LO APRUEBA.

SI REQUIERE RD.

SI REQUIERE ACTUALIZACIÓN.

SI PUEDE INTEGRARSE A OTRO DOCUMENTO.

---

# 43. ALERTA ANTI-BUROCRACIA

Si una actividad ya forma parte del PAT y la norma no exige un plan independiente:

la aplicación debe considerar si realmente es necesario crear otro documento.

Objetivo:

REDUCIR CARGA DOCUMENTAL.

No multiplicarla.

---

# 44. COMITÉS DE GESTIÓN ESCOLAR

Incorporar:

### Comité de Gestión de Condiciones Operativas.

### Comité de Gestión Pedagógica.

### Comité de Gestión del Bienestar.

La app debe consultar normativa vigente antes de determinar conformación y responsabilidades.

---

# 45. IE UNIDOCENTE

No pedir al director de una IE unidocente que conforme estructuras imposibles con personal inexistente.

Aplicar las reglas especiales correspondientes a instituciones con reducido número de secciones y unidocentes.

---

# 46. COMITÉS → PAT

Las actividades que correspondan deben poder vincularse directamente al PAT.

Evitar crear planes independientes innecesarios de cada comité cuando la normativa permite incorporarlos en el PAT.

---

# 47. CONEI

Crear módulo específico:

CONEI.

Debe ayudar con:

- conformación;
- representantes;
- periodo;
- acta;
- RD cuando corresponda;
- registro;
- sesiones;
- acuerdos;
- seguimiento.

Consultar como referencia normativa vigente la RM N.° 168-2025-MINEDU y las disposiciones posteriores que la modifiquen.

---

# 48. PARTICIPACIÓN

El sistema no debe generar documentos dando por realizada una elección o participación que todavía no ocurrió.

Ejemplo:

No inventar:

“Luego de realizada la elección democrática…”

si el director no registró que efectivamente se realizó.

---

# 49. GESTIÓN DE CONDICIONES OPERATIVAS

Crear un espacio para:

- infraestructura;
- mantenimiento;
- recursos;
- materiales;
- inventario;
- riesgos;
- necesidades;
- servicios;
- condiciones de funcionamiento.

---

# 50. MANTENIMIENTO

Para cada año escolar consultar la normativa vigente del Programa de Mantenimiento.

Para 2026 considerar como fuente normativa la RM N.° 007-2026-MINEDU mientras corresponda.

---

# 51. MI MANTENIMIENTO

Si la app dice:

“INFORME A MI MANTENIMIENTO”

debe distinguir claramente dos escenarios:

### INTEGRACIÓN REAL

La aplicación se comunica realmente con el sistema oficial mediante mecanismo autorizado.

### ASISTENTE

La aplicación prepara:

- información;
- relación de acciones;
- evidencias;
- documentos;
- archivos;

para que el director posteriormente los registre en el sistema oficial.

Está prohibido llamarlo:

“Integración con Mi Mantenimiento”

si solamente prepara un archivo.

---

# 52. MISMA REGLA PARA CUALQUIER SISTEMA EXTERNO

Aplicar a:

SIAGIE.

Mi Mantenimiento.

PerúEduca.

Plataformas UGEL.

Otros sistemas públicos.

NO SIMULAR INTEGRACIONES.

---

# 53. BOTONES HONESTOS

Utilizar nombres como:

“PREPARAR INFORMACIÓN PARA…”

cuando no existe integración directa.

Utilizar:

“ENVIAR A…”

solo si técnicamente realiza el envío.

---

# 54. MONITOREO PEDAGÓGICO

La Carpeta Director debe permitir organizar:

- visitas;
- observaciones;
- acompañamiento;
- compromisos;
- seguimiento.

Cuando corresponda utilizar:

- Marco de Buen Desempeño Docente;
- Rúbricas de Observación de Aula vigentes;
- instrumentos oficiales pertinentes.

---

# 55. NO CONVERTIR MONITOREO EN FISCALIZACIÓN

El sistema debe favorecer:

OBSERVACIÓN

↓

EVIDENCIA

↓

ANÁLISIS

↓

DIÁLOGO

↓

RETROALIMENTACIÓN

↓

COMPROMISO

↓

SEGUIMIENTO.

---

# 56. CALENDARIO DIRECTIVO

Integrar:

PAT.

reuniones.

comités.

CONEI.

monitoreos.

plazos.

informes.

mantenimiento.

actividades institucionales.

---

# 57. ALERTAS

Ejemplos:

“Esta actividad del PAT vence esta semana.”

“Este documento requiere revisión.”

“Falta registrar evidencia.”

“Existe una norma nueva relacionada con este documento.”

“Esta RD todavía está en borrador.”

---

# 58. CARPETA DEL AÑO

La app debe organizar documentos automáticamente:

2026

2027

2028.

Nunca mezclar documentos de años diferentes sin indicarlo.

---

# 59. ARCHIVO DIGITAL

Organizar:

CARPETA DOCENTE.

CARPETA DIRECTOR.

DOCUMENTOS DE GESTIÓN.

RD.

OFICIOS.

INFORMES.

ACTAS.

PLANES.

COMITÉS.

CONEI.

MANTENIMIENTO.

MONITOREO.

OTROS.

---

# 60. BUSCADOR GLOBAL

El usuario debe poder escribir:

“RD CONEI”

“Informe mantenimiento”

“Sesión fracciones”

“Unidad septiembre”

y encontrar el documento inmediatamente.

---

# 61. AUDITORÍA DE VERDADERA FUNCIONALIDAD

## MOTOR MFO

Este es uno de los componentes más importantes de toda la auditoría.

No basta revisar:

“EL BOTÓN EXISTE.”

Debe comprobar:

“LA FUNCIÓN COMPLETA SU OBJETIVO.”

---

# 62. ESTADOS DE FUNCIONALIDAD

Cada función será clasificada:

### FUNCIONAL

Completa correctamente el proceso.

### PARCIALMENTE FUNCIONAL

Inicia el proceso pero presenta limitaciones.

### SIMULADA

Parece funcionar pero no completa la acción.

### ROTA

Produce error.

### INEXISTENTE

El botón o función prometida no existe.

---

# 63. ERROR CRÍTICO: FUNCIÓN SIMULADA

Ejemplo:

Botón:

“DESCARGAR WORD”.

Si al presionarlo:

- no descarga;
- descarga archivo vacío;
- pierde tablas;
- pierde imágenes;
- cambia formato;
- genera archivo corrupto;

la función:

NO APRUEBA.

---

# 64. PRUEBA DE PUNTA A PUNTA

Cada función importante debe probarse:

ENTRADA

↓

PROCESAMIENTO

↓

GUARDADO

↓

RECUPERACIÓN

↓

EDICIÓN

↓

EXPORTACIÓN

↓

REAPERTURA.

---

# 65. PRUEBA DE REGISTRO

Crear estudiante.

Cerrar aplicación.

Volver a entrar.

El estudiante debe continuar registrado.

Si desaparece:

ERROR CRÍTICO.

---

# 66. PRUEBA DE DOCUMENTO

Crear sesión.

Guardar.

Cerrar.

Volver a abrir.

Editar.

Guardar.

Descargar.

Abrir Word.

Comprobar contenido.

---

# 67. PRUEBA DE VERSIONES

Documento:

VERSIÓN 1.

Editar.

VERSIÓN 2.

Debe existir posibilidad de:

- identificar cambios;
- recuperar versión anterior;
- evitar pérdida accidental.

---

# 68. AUTOGUARDADO

Mientras trabaja el usuario:

guardar periódicamente.

Si:

- se cierra navegador;
- falla internet;
- se actualiza página;
- la IA genera error;

no perder todo el documento.

---

# 69. PRUEBA DE PANTALLA EN BLANCO

Ningún botón puede llevar a:

PANTALLA BLANCA.

PANTALLA NEGRA.

CARGA INFINITA.

404.

ERROR SIN EXPLICACIÓN.

Estas incidencias deben ser registradas automáticamente.

---

# 70. MENSAJES DE ERROR

Incorrecto:

ERROR 500.

Correcto:

“No pudimos generar el documento. La información que ingresaste está guardada. Puedes volver a intentarlo.”

---

# 71. PRUEBA DE BOTONES

Auditar TODOS:

- crear;
- editar;
- eliminar;
- guardar;
- cancelar;
- volver;
- siguiente;
- anterior;
- duplicar;
- descargar;
- imprimir;
- compartir;
- buscar;
- filtrar;
- auditar;
- corregir;
- regenerar.

Ningún botón sin función.

---

# 72. PRUEBA DE NAVEGACIÓN

El usuario siempre debe saber:

DÓNDE ESTÁ.

CÓMO VOLVER.

QUÉ ESTÁ EDITANDO.

QUÉ FALTA.

---

# 73. NO CALLEJONES SIN SALIDA

Toda pantalla debe tener una ruta lógica de salida.

Nunca obligar al usuario a:

cerrar pestaña

o

reiniciar app.

---

# 74. PRUEBA DE GENERACIÓN IA

Medir:

- exactitud;
- coherencia;
- tiempo;
- estabilidad;
- formato;
- contexto;
- fuentes;
- repetición;
- alucinaciones.

---

# 75. PRUEBA DE 100 GENERACIONES

Ejecutar una batería amplia.

La app no puede ser evaluada solamente haciendo una sesión correcta.

Probar decenas o cientos de casos.

Registrar:

ÉXITO.

ERROR.

TIEMPO.

ALUCINACIÓN.

REGENERACIÓN.

---

# 76. PRUEBAS DE CASOS EXTREMOS

Probar:

Inicial.

Primaria.

Secundaria.

EIB.

Rural.

Urbano.

Unidocente.

Multigrado.

Polidocente.

IE pequeña.

IE grande.

---

# 77. PRUEBA DE DATOS INCOMPLETOS

Si falta información:

no inventarla.

Ejemplo:

DIRECTOR:

“Hazme el informe del simulacro.”

La app debe utilizar información existente.

Lo que no conozca deberá:

solicitarlo mediante campos sencillos

o

dejar marcador editable.

No inventar resultados.

---

# 78. PRUEBA DE CONTEXTO PERSISTENTE

Si el usuario ya configuró:

IE rural EIB multigrado.

La app debe recordarlo al generar el siguiente documento.

No volver a producir automáticamente una planificación urbana monogrado.

---

# 79. PRUEBA DE DOCUMENTOS RELACIONADOS

Ejemplo:

Crear CONEI.

Después:

“Generar RD de conformación.”

La app debe recuperar automáticamente los integrantes previamente registrados.

No hacer que el usuario escriba nuevamente todos los nombres.

---

# 80. DOCUMENTOS EN CADENA

Ejemplo:

ACTA DE ELECCIÓN

↓

CONEI

↓

RD

↓

REGISTRO

↓

SEGUIMIENTO.

La app debe aprovechar los mismos datos.

---

# 81. INTELIGENCIA OPERATIVA

La IA debe reducir pasos.

Ejemplo:

El director escribe:

“Necesito conformar el CONEI.”

La app debe ofrecer la ruta completa y pertinente.

No obligarlo a conocer previamente todos los documentos necesarios.

---

# 82. PERO SIN ACTUAR SIN AUTORIZACIÓN

La IA puede proponer:

“Con estos datos puedo preparar el acta y la RD.”

Pero no debe:

- inventar elección;
- aprobar automáticamente;
- firmar por el director;
- asumir acuerdos.

---

# 83. ESTADOS DOCUMENTALES

Todo documento debería tener:

BORRADOR.

EN REVISIÓN.

APROBADO.

FIRMADO/EMITIDO.

ARCHIVADO.

ANULADO, si corresponde.

---

# 84. NUMERACIÓN SOLO AL EMITIR

Evitar consumir correlativos innecesariamente al crear borradores.

La numeración definitiva debe asignarse según el flujo institucional configurado.

---

# 85. FIRMAS

La app no debe simular firma válida si no existe un mecanismo legal.

Puede:

PREPARAR DOCUMENTO PARA FIRMA.

Si integra una firma válida:

debe indicarlo claramente.

---

# 86. EXPORTACIÓN WORD

Auditar:

- tamaño de página;
- márgenes;
- títulos;
- tablas;
- imágenes;
- numeración;
- encabezados;
- pies;
- saltos;
- firmas;
- caracteres especiales;
- quechua cuando corresponda.

---

# 87. EXPORTACIÓN PDF

Comprobar:

- no cortar tablas;
- no perder texto;
- no superponer imágenes;
- no cambiar páginas;
- no generar hojas vacías innecesarias.

---

# 88. IMPRESIÓN

Antes de imprimir:

VISTA PREVIA.

El resultado debe coincidir razonablemente con lo visto.

---

# 89. PRUEBA MÓVIL REAL

No limitarse a emulador.

Probar en teléfonos Android reales:

- económicos;
- gama media;
- pantallas pequeñas.

---

# 90. PRUEBA DE INTERNET RURAL

Simular:

- conexión lenta;
- latencia;
- pérdida de conexión;
- reconexión.

La app debe mantener el trabajo.

---

# 91. MODO DE BAJO CONSUMO

Cuando sea posible:

- reducir carga de imágenes;
- evitar descargas innecesarias;
- permitir guardar borrador;
- optimizar consultas de IA.

---

# 92. RENDIMIENTO

Medir:

TIEMPO PARA ABRIR.

TIEMPO PARA GUARDAR.

TIEMPO PARA BUSCAR.

TIEMPO PARA GENERAR.

TIEMPO PARA DESCARGAR.

---

# 93. ESCALABILIDAD

No probar solamente con un usuario.

Simular:

100.

101.

1 000.

5 000.

10 000.

usuarios según proyección.

---

# 94. PRUEBA DE CONCURRENCIA

Muchos docentes generando sesiones simultáneamente no deben:

- tumbar la app;
- mezclar documentos;
- mostrar información ajena;
- duplicar registros.

---

# 95. AISLAMIENTO DE DATOS

Usuario A nunca debe ver:

estudiantes,
documentos,
informes,
IE,

del usuario B sin autorización.

ERROR CRÍTICO DE SEGURIDAD si ocurre.

---

# 96. COSTO DE IA

Medir por función:

COSTO POR SESIÓN.

COSTO POR UNIDAD.

COSTO POR PROYECTO.

COSTO POR DOCUMENTO DIRECTIVO.

COSTO MENSUAL POR USUARIO.

Evitar enviar documentos completos al modelo cuando únicamente necesita una sección.

---

# 97. USO INTELIGENTE DE IA

No utilizar un modelo costoso para tareas como:

- ordenar tabla;
- calcular correlativo;
- cambiar fecha;
- filtrar registros.

Reservar IA para tareas que requieren razonamiento o generación.

---

# 98. NORMATIVA

Crear biblioteca normativa central.

Cada regla debe tener:

NORMA.

ARTÍCULO/SECCIÓN.

FECHA.

VIGENCIA.

FUENTE.

FECHA DE VERIFICACIÓN.

---

# 99. FUENTES LOCALES

Además de MINEDU:

permitir incorporar normativa u orientaciones de:

DRE/GRE.

UGEL.

Pero clasificarlas claramente.

---

# 100. JERARQUÍA

La app debe saber diferenciar:

NORMA NACIONAL.

NORMA REGIONAL.

DISPOSICIÓN UGEL.

ORIENTACIÓN.

GUÍA.

MATERIAL PEDAGÓGICO.

PLANTILLA.

No tratarlas como equivalentes.

---

# 101. ACTUALIZACIÓN NORMATIVA

Cuando una norma cambia:

identificar:

QUÉ DOCUMENTOS AFECTA.

QUÉ PLANTILLAS AFECTA.

QUÉ REGLAS AFECTA.

QUÉ DOCUMENTOS YA GENERADOS PODRÍAN NECESITAR ACTUALIZACIÓN.

---

# 102. ALERTA NORMATIVA

Ejemplo:

“Nueva disposición detectada que podría afectar la conformación del CONEI.”

No modificar documentos institucionales automáticamente.

Mostrar primero:

QUÉ CAMBIÓ.

---

# 103. DOCUMENTOS 2026 QUE EL MOTOR DEBE VIGILAR

Entre las referencias pertinentes actualmente:

- RM N.° 501-2025-MINEDU – Norma Técnica del Año Escolar 2026.
- RVM N.° 011-2019-MINEDU – instrumentos de gestión.
- DS N.° 006-2021-MINEDU – lineamientos para la gestión escolar.
- RM N.° 189-2021-MINEDU – Comités de Gestión Escolar.
- RM N.° 168-2025-MINEDU – CONEI.
- RVM N.° 223-2021-MINEDU – funciones directivas, según corresponda.
- RM N.° 007-2026-MINEDU – Programa de Mantenimiento 2026.
- orientaciones MINEDU 2026.
- normativa posterior que modifique o reemplace cualquiera de las anteriores.

> **Regla de seguridad normativa:** esta lista funciona como referencia de vigilancia. Ninguna vigencia, obligatoriedad o aplicabilidad se debe asumir únicamente por aparecer aquí; cada norma debe verificarse contra fuente oficial vigente antes de aplicarla.

---

# 104. NO CONFUNDIR COMPROMISOS

La app debe distinguir correctamente:

COMPROMISOS DE GESTIÓN ESCOLAR

de

COMPROMISOS DE DESEMPEÑO.

No usar ambos términos como sinónimos.

---

# 105. AUDITORÍA DE DIRECTOR

Crear:

ÍNDICE DE CALIDAD DE GESTIÓN DIGITAL – ICGD.

Puntaje sobre 100.

### Normativa

15.

### Instrumentos de gestión

15.

### Gestión pedagógica

10.

### Gestión administrativa

10.

### Documentación

10.

### Condiciones operativas

8.

### Bienestar y convivencia

8.

### Trazabilidad

5.

### Funcionalidad tecnológica

10.

### Seguridad

5.

### Facilidad de uso

4.

---

# 106. AUDITORÍA DE CARPETA DOCENTE

Crear:

ÍNDICE DE UTILIDAD DOCENTE – IUD.

Evaluar:

- ahorro de tiempo;
- calidad pedagógica;
- coherencia;
- evaluación;
- fuentes;
- multigrado;
- EIB;
- materiales;
- facilidad;
- estabilidad.

---

# 107. ÍNDICE DE FUNCIONALIDAD REAL

Crear:

IFR = ÍNDICE DE FUNCIONALIDAD REAL.

La funcionalidad debe tener peso propio.

Evaluar:

### Navegación

10%.

### Guardado

10%.

### Recuperación

10%.

### Generación IA

15%.

### Edición

10%.

### Exportación

10%.

### Persistencia de datos

10%.

### Rendimiento

10%.

### Móvil

5%.

### Seguridad

5%.

### Integraciones

5%.

---

# 108. CONDICIÓN DE APROBACIÓN FUNCIONAL

La app no puede ser considerada:

“LISTA PARA PRODUCCIÓN”

solo porque tiene 95 puntos pedagógicos.

También debe alcanzar:

IFR ≥ 95/100.

---

# 109. ERRORES BLOQUEANTES

La app NO puede pasar a producción si:

- pierde documentos;
- mezcla información entre usuarios;
- descarga archivos corruptos;
- genera documentos en blanco;
- presenta pantallas blancas frecuentes;
- no guarda cambios;
- inventa normativa;
- inventa resultados;
- duplica correlativos;
- permite acceso no autorizado;
- promete integraciones que no existen;
- no funciona correctamente en móvil.

---

# 110. PRUEBA “DOCENTE NUEVO”

Entregar app a un docente que nunca la utilizó.

Pedir:

“Crea una unidad y una sesión.”

No explicarle dónde hacer clic.

Medir:

TIEMPO.

DUDAS.

RETROCESOS.

ERRORES.

CLICS.

ABANDONO.

---

# 111. PRUEBA “DIRECTOR NUEVO”

Entregar app a un director nuevo.

Pedir:

“Necesito actualizar mis documentos de gestión y generar una RD.”

Observar si puede hacerlo sin capacitación extensa.

---

# 112. PRUEBA DE LOS 5 MINUTOS DEL DIRECTOR

El director debe poder redactar un oficio sencillo en aproximadamente pocos minutos.

La app debe encargarse de:

- formato;
- datos;
- encabezado;
- redacción;
- correlativo;
- archivo.

El director decide el contenido final.

---

# 113. PRUEBA DE LOS 10 SEGUNDOS

Desde el panel principal el usuario debe localizar rápidamente:

“Crear sesión”.

“Crear unidad”.

“Registro auxiliar”.

“Crear oficio”.

“Crear RD”.

“PEI/PAT/PCI/RI”.

No ocultar funciones importantes en múltiples menús.

---

# 114. MENOS COMPLEJIDAD

Regla:

SI UNA FUNCIÓN PUEDE HACERSE EN 3 PASOS, NO UTILIZAR 8.

---

# 115. MODO FÁCIL

Para usuarios que solo necesitan:

“Hazme mi oficio.”

“Haz mi sesión.”

“Crea mi PAT.”

La app guía.

---

# 116. MODO EXPERTO

Permitir:

- seleccionar norma;
- modificar estructura;
- editar criterios;
- revisar fuentes;
- controlar campos;
- personalizar formato.

---

# 117. ASISTENTE DIRECTIVO

Agregar un chat especializado dentro de Carpeta Director.

Ejemplos:

“Necesito responder este oficio de UGEL.”

“Necesito una RD para aprobar el PAT.”

“Necesito informar sobre una actividad.”

“¿Qué documentos debo actualizar este mes?”

El asistente debe reconocer el contexto institucional.

---

# 118. ASISTENTE DOCENTE

Agregar chat especializado en Carpeta Docente.

Ejemplo:

“Mis niños quieren saber sobre mariposas.”

El sistema debe convertir esa necesidad en una propuesta pedagógica coherente.

---

# 119. NO MEZCLAR PERSONALIDADES

El asistente Docente razona pedagógicamente.

El asistente Director razona:

- normativamente;
- administrativamente;
- institucionalmente;
- pedagógicamente cuando corresponda.

---

# 120. AUTORIDAD PROFESIONAL

La IA:

PROPONE.

REVISA.

ADVIERTE.

AUTOMATIZA.

Pero:

DOCENTE/DIRECTOR DECIDE.

---

# 121. BOTÓN AUDITAR

En Carpeta Docente:

🔍 AUDITORÍA PEDAGÓGICA.

En Carpeta Director:

🔍 AUDITORÍA DE GESTIÓN Y NORMATIVA.

---

# 122. AUDITORÍA DEL DOCUMENTO DIRECTIVO

Debe revisar:

- correspondencia institucional;
- competencia;
- normativa;
- estructura;
- coherencia;
- fechas;
- nombres;
- correlativos;
- anexos;
- lenguaje administrativo;
- ortografía;
- firma;
- trazabilidad.

---

# 123. AUDITORÍA DE DATOS

Detectar contradicciones como:

Documento:
2026.

Fecha:
2025.

Director A en encabezado.

Director B en firma.

IE diferente.

UGEL diferente.

Número RD repetido.

Emitir ALERTA CRÍTICA.

---

# 124. DOCUMENTO AUTOCONSISTENTE

Antes de exportar comprobar:

NOMBRES.

FECHAS.

NÚMEROS.

CARGOS.

IE.

UGEL.

AÑO.

BASE LEGAL.

ANEXOS.

---

# 125. TABLERO DE AUDITORÍA DE TODA LA APP

Mostrar al administrador:

CARPETA DOCENTE: 97/100.

CARPETA DIRECTOR: 93/100.

FUNCIONALIDAD: 89/100.

SEGURIDAD: 98/100.

MÓVIL: 92/100.

IA: 95/100.

NORMATIVA: 96/100.

Si funcionalidad está en 89:

APP TODAVÍA NO LISTA.

---

# 126. PRUEBAS AUTOMÁTICAS EN CADA ACTUALIZACIÓN

Cada actualización debe volver a probar:

LOGIN.

PERFILES.

DOCENTE.

DIRECTOR.

UNIDADES.

PROYECTOS.

SESIONES.

REGISTROS.

PEI.

PAT.

PCI.

RI.

RD.

OFICIOS.

INFORMES.

EXPORTACIÓN.

MÓVIL.

SEGURIDAD.

---

# 127. REGRESIÓN

Si antes funcionaba:

“Crear sesión multigrado”

y después de actualizar deja de funcionar:

LA VERSIÓN NO APRUEBA.

---

# 128. ENTORNO DE PRUEBA

Antes de actualizar para todos:

PROBAR EN ENTORNO DE PRUEBAS.

Luego:

PRODUCCIÓN.

Nunca experimentar directamente con documentos reales de usuarios.

---

# 129. REGISTRO DE ERRORES

Cuando ocurre error registrar:

- función;
- pantalla;
- usuario anonimizado;
- dispositivo;
- navegador;
- fecha;
- acción anterior;
- tipo de error.

Esto permitirá encontrar errores recurrentes.

---

# 130. FEEDBACK DEL USUARIO

Incorporar en cada módulo:

👍 ME SIRVIÓ.

👎 NECESITA MEJORA.

Opcional:

“¿Qué salió mal?”

---

# 131. NO APRENDER AUTOMÁTICAMENTE DE TODO

Los comentarios de usuarios deben analizarse antes de cambiar reglas pedagógicas o normativas.

Una sugerencia frecuente no convierte algo incorrecto en correcto.

---

# 132. MÉTRICAS REALES

Medir:

- documentos creados;
- documentos terminados;
- documentos abandonados;
- regeneraciones;
- tiempo;
- errores;
- descargas;
- correcciones;
- satisfacción.

---

# 133. KPI MÁS IMPORTANTE

### TIEMPO REAL AHORRADO.

Calcular:

TIEMPO CON APP

versus

TIEMPO SIN APP.

---

# 134. SEGUNDO KPI

### TASA DE CORRECCIÓN.

¿Cuánto del documento generado modifica el docente?

Si el usuario cambia el 70 %:

la IA no está funcionando suficientemente bien.

---

# 135. TERCER KPI

### FINALIZACIÓN.

¿Qué porcentaje de usuarios termina realmente el documento?

---

# 136. CUARTO KPI

### ERROR POR DOCUMENTO.

Cantidad de:

- errores curriculares;
- normativos;
- conceptuales;
- de formato;
- técnicos.

---

# 137. QUINTO KPI

### CONFIANZA.

Preguntar:

“¿Usarías este documento mañana sin rehacerlo?”

Este indicador es más valioso que:

“¿Te gusta la app?”

---

# 138. AUDITORÍA DE VALOR DIFERENCIAL

Preguntar:

¿QUÉ HACE ESTA APP QUE NO HACE UN CHAT DE IA GENÉRICO?

Respuesta esperada:

- conoce la IE;
- conoce al docente;
- conoce estructura institucional;
- utiliza CNEB;
- consulta MINEDU;
- conoce normativa;
- conserva planificación;
- relaciona documentos;
- genera evaluaciones;
- mantiene registros;
- recuerda contexto;
- audita;
- guarda;
- organiza;
- genera documentos directivos;
- controla correlativos;
- mantiene trazabilidad;
- actualiza normas;
- exporta documentos listos.

---

# 139. SI SOLO GENERA TEXTO, NO ES SUFICIENTE

Una aplicación educativa excelente debe:

PENSAR

-

ORGANIZAR

-

AUTOMATIZAR

-

VERIFICAR

-

GUARDAR

-

CONECTAR

-

RECUPERAR

-

EXPORTAR

-

DAR SEGUIMIENTO.

---

# 140. AUDITORÍA FINAL DE EXPERIENCIA

Preguntar a docentes y directores:

¿Me ahorra tiempo?

¿Es fácil?

¿Confío en lo que genera?

¿Puedo corregir fácilmente?

¿Encuentro mis documentos?

¿Funciona desde mi celular?

¿Me ayuda con normativa?

¿Evita trabajo repetitivo?

¿Me ayuda a tomar decisiones?

¿La volvería a usar mañana?

---

# 141. NIVEL DE CERTIFICACIÓN INTERNA

### NIVEL 1

PROTOTIPO.

### NIVEL 2

FUNCIONAL.

### NIVEL 3

LISTO PARA PRUEBAS CON DOCENTES.

### NIVEL 4

LISTO PARA PILOTO INSTITUCIONAL.

### NIVEL 5

LISTO PARA ESCALAR.

No saltar directamente de prototipo a miles de usuarios.

---

# 142. CONDICIONES PARA NIVEL 5

Debe demostrar:

- calidad pedagógica;
- calidad directiva;
- estabilidad;
- seguridad;
- escalabilidad;
- respaldo normativo;
- móvil funcional;
- recuperación de datos;
- exportaciones fiables;
- experiencia sencilla;
- costos sostenibles.

---

# 143. PRINCIPIO DE CERO PANTALLAS VACÍAS

Toda opción visible debe:

FUNCIONAR

o

estar claramente identificada como:

“PRÓXIMAMENTE”.

Nunca simular que está terminada.

---

# 144. PRINCIPIO DE CERO DATOS INVENTADOS

La IA puede:

PROPONER.

No puede:

INVENTAR HECHOS INSTITUCIONALES.

---

# 145. PRINCIPIO DE CERO NORMAS INVENTADAS

Si no encuentra sustento:

“NO VERIFICADO.”

---

# 146. PRINCIPIO DE CERO DOCUMENTOS AISLADOS

Siempre buscar relaciones.

Ejemplo:

PEI → PAT → ACTIVIDADES → INFORMES.

PCI → UNIDAD → SESIONES → EVALUACIÓN.

CONEI → ACTA → RD → REGISTRO.

MONITOREO → RETROALIMENTACIÓN → COMPROMISO → SEGUIMIENTO.

---

# 147. PRINCIPIO DE CERO TRABAJO DUPLICADO

Todo dato que ya posee la aplicación debe reutilizarse cuando sea legal y pertinente.

---

# 148. OBJETIVO DE CARPETA DOCENTE

Que el docente dedique menos tiempo a:

FORMATEAR

COPIAR

REPETIR

BUSCAR

y más tiempo a:

PENSAR

ENSEÑAR

OBSERVAR

RETROALIMENTAR.

---

# 149. OBJETIVO DE CARPETA DIRECTOR

Que el director dedique menos tiempo a:

REPETIR DATOS

BUSCAR FORMATOS

CAMBIAR NOMBRES

NUMERAR DOCUMENTOS

REDACTAR DESDE CERO

ORDENAR ARCHIVOS

y más tiempo a:

LIDERAR

ACOMPAÑAR

ANALIZAR

DECIDIR

MEJORAR LA IE.

---

# 150. REGLA MAESTRA DE TODA LA APLICACIÓN

La aplicación debe dejar de ser:

UN GENERADOR DE SESIONES

-

UN GENERADOR DE DOCUMENTOS.

Debe convertirse en:

### SISTEMA INTELIGENTE INTEGRAL PARA LA GESTIÓN DOCENTE Y DIRECTIVA.

Debe comprender:

QUIÉN SOY

↓

DÓNDE TRABAJO

↓

QUÉ NECESITO

↓

QUÉ NORMA CORRESPONDE

↓

QUÉ INFORMACIÓN YA TENGO

↓

QUÉ DEBO CREAR

↓

CÓMO DEBO HACERLO

↓

CÓMO VERIFICO SU CALIDAD

↓

CÓMO LO GUARDO

↓

CÓMO LO REUTILIZO

↓

CÓMO LE DOY SEGUIMIENTO.

---

# PROTOCOLO FINAL DE AUDITORÍA DE LA APP

ANTES DE DECLARAR LA APLICACIÓN LISTA PARA PRODUCCIÓN:

AUDITAR:

PEDAGOGÍA.

CNEB.

PROCESOS PEDAGÓGICOS.

PROCESOS DIDÁCTICOS.

RÚBRICAS DE OBSERVACIÓN.

EVALUACIÓN.

FORMALIZACIÓN.

FUENTES MINEDU.

FUENTES CIENTÍFICAS.

EIB.

MULTIGRADO.

INICIAL.

PRIMARIA.

SECUNDARIA.

CARPETA DOCENTE.

CARPETA DIRECTOR.

DOCUMENTOS DE GESTIÓN.

RD.

OFICIOS.

INFORMES.

PLANES.

COMITÉS.

CONEI.

GESTIÓN PEDAGÓGICA.

CONDICIONES OPERATIVAS.

BIENESTAR.

MANTENIMIENTO.

NORMATIVA.

NUMERACIÓN.

ARCHIVO.

TRAZABILIDAD.

GUARDADO.

RECUPERACIÓN.

WORD.

PDF.

IMPRESIÓN.

MÓVIL.

INTERNET LENTO.

SEGURIDAD.

PRIVACIDAD.

RENDIMIENTO.

ESCALABILIDAD.

COSTO IA.

EXPERIENCIA DE USUARIO.

FUNCIONALIDAD REAL.

---

# PREGUNTA FINAL DE AUDITORÍA

No preguntar solamente:

“¿FUNCIONA LA APP?”

Preguntar:

### ¿UN DOCENTE O DIRECTOR REAL PUEDE UTILIZAR ESTA APP DURANTE TODO EL AÑO ESCOLAR, CONFIAR EN ELLA, RECUPERAR SU INFORMACIÓN, REDUCIR SU TRABAJO Y OBTENER DOCUMENTOS PEDAGÓGICA, TÉCNICA Y NORMATIVAMENTE SÓLIDOS SIN NECESITAR REHACERLOS?

Si la respuesta no es:

SÍ,

la aplicación todavía necesita mejorar.

---

# ORDEN FINAL DE TRABAJO DEL SISTEMA

USUARIO

↓

CONTEXTO INSTITUCIONAL

↓

INTENCIÓN

↓

NORMATIVA

↓

RAZONAMIENTO ESPECIALIZADO

↓

GENERACIÓN

↓

AUDITORÍA

↓

AUTOCORRECCIÓN

↓

REVISIÓN HUMANA

↓

APROBACIÓN

↓

ARCHIVO

↓

SEGUIMIENTO

↓

REUTILIZACIÓN.

---

# PRINCIPIO FINAL

LA MEJOR APLICACIÓN NO ES LA QUE TIENE MÁS BOTONES.

ES LA QUE ELIMINA MÁS TRABAJO INNECESARIO SIN QUITARLE AL DOCENTE O AL DIRECTOR EL CONTROL PROFESIONAL DE SUS DECISIONES.
