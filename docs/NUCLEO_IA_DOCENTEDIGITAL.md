# Núcleo IA de DocenteDigital

## Regla maestra

DocenteDigital no debe generar primero y comprender después. El orden obligatorio es:

**Comprender → estructurar significado → verificar contexto y normativa → proponer → auditar coherencia → permitir decisión del docente/director.**

La app debe interpretar el lenguaje natural del usuario como una intención completa, no como una lista de palabras clave.

## 1. Perfil semántico único

Todo pedido del Docente o Director debe convertirse en un perfil semántico reutilizable con, cuando existan:

- texto original sin alterar;
- rol: Docente o Director;
- tipo de documento o tarea;
- foco principal;
- intención real;
- finalidad o resultado esperado;
- problema, necesidad, oportunidad o interés;
- causas y consecuencias expresadas;
- actores y destinatarios;
- lugar y perfil territorial;
- tiempo o duración;
- recursos y restricciones;
- lengua y perfil EIB/monolingüe;
- organización de IE, nivel, grados y áreas;
- acciones o productos explícitos;
- términos locales o propios que deben conservarse;
- datos seguros, datos inferidos y datos faltantes;
- contradicciones o ambigüedades;
- nivel de confianza de la interpretación.

## 2. Finalidad por encima de la palabra dominante

Ejemplo:

> En Ccotataqui se realiza la siembra de tubérculos y productos verdes. Hablaremos sobre esos conocimientos y los volcaremos para sembrar hortalizas en nuestro biohuerto.

La app no debe quedarse en **siembra**. Debe comprender la relación:

**fuente de aprendizaje = saberes de la siembra**

**finalidad = aplicar esos saberes para sembrar hortalizas en el biohuerto**

Por tanto, la finalidad debe influir en:

- título;
- situación significativa;
- pregunta retadora;
- producto/acción final;
- secuencia de actividades;
- sesiones;
- evidencias;
- evaluación.

## 3. No usar bancos cerrados como inteligencia principal

Los bancos de palabras, expresiones, títulos, estrategias y productos son apoyo de variación, nunca el motor principal de comprensión.

La interpretación debe ser capaz de trabajar con expresiones que nunca fueron programadas previamente, incluidos nombres locales, palabras quechuas, problemas nuevos, actividades productivas, temas urbanos, científicos, sociales, artísticos, tecnológicos o administrativos.

## 4. IA real + guardas locales

La arquitectura debe tener dos capas:

### Capa A: modelo de IA semántico

Responsable de comprender lenguaje natural, relaciones entre ideas, intención, finalidad, ambigüedad, contexto y coherencia global.

Debe devolver una salida estructurada, no redactar directamente el documento final sin control.

### Capa B: guardas estructuradas DocenteDigital

Responsables de:

- conservar datos explícitos;
- impedir invenciones no sustentadas;
- validar nivel, grados, tipo de IE, EIB/monolingüe y territorio;
- proteger currículo y normativa oficial;
- controlar coherencia entre fases;
- detectar contradicciones;
- registrar qué dato vino del usuario, cuál de una fuente oficial y cuál fue una propuesta de IA.

Si la IA y una fuente oficial vigente entran en conflicto, **gana la fuente oficial**.

## 5. Herencia de significado

El perfil semántico no debe perderse entre pantallas.

### Docente

Diagnóstico → Programación anual → Unidad/Proyecto → Sesiones → Materiales → Evaluación → Registro.

### Director

Diagnóstico institucional → PEI → PAT → PCI → RI/DG → RD/Oficios/Informes → seguimiento.

Una finalidad aprobada debe heredarse a los documentos relacionados hasta que el usuario la modifique expresamente.

## 6. Situación significativa

Antes de redactarla, el núcleo debe distinguir si el texto expresa:

- interés;
- curiosidad;
- problema;
- necesidad;
- oportunidad;
- práctica cultural/productiva;
- evento;
- desafío;
- objetivo explícito;
- combinación de varios elementos.

No debe convertir automáticamente un interés en problema ni inventar causas o consecuencias.

## 7. Reto

El reto debe nacer de la interpretación completa y conducir al resultado esperado. Debe ser desafiante, comprensible y suficientemente abierto para movilizar competencias, sin convertirse en una pregunta decorativa.

## 8. Director

El mismo núcleo debe comprender pedidos administrativos. Ejemplos:

- “Necesito una RD para conformar…”
- “Quiero actualizar el PAT porque…”
- “Debo informar a la UGEL sobre…”
- “Necesitamos adecuar el RI debido a…”

La interpretación debe separar:

- qué documento corresponde;
- motivo;
- resultado esperado;
- destinatario;
- datos institucionales;
- plazo;
- responsables;
- normativa que debe verificarse;
- información faltante que debe preguntarse.

Nunca debe inventar números de norma, fechas, responsables, acuerdos o firmas.

## 9. Confianza y aclaración

Si la comprensión es insuficiente, la app no debe fingir seguridad.

Debe marcar:

- comprensión sólida;
- comprensión razonable;
- comprensión preliminar.

Solo debe preguntar cuando la falta de información impida generar correctamente el documento. Debe evitar interrogatorios innecesarios si el contexto ya permite continuar.

## 10. Auditoría semántica obligatoria

Antes de entregar cualquier documento, comprobar:

1. ¿El documento responde a lo que realmente pidió el usuario?
2. ¿Conserva la finalidad explícita?
3. ¿Usa el territorio real sin asumir “comunidad”?
4. ¿Respeta EIB/monolingüe y lengua elegida?
5. ¿Respeta nivel, grados y organización de IE?
6. ¿Hay algo inventado que el usuario no dijo?
7. ¿Título, situación, reto, producto y actividades se relacionan entre sí?
8. ¿El producto responde al reto?
9. ¿Las sesiones conducen al producto/finalidad?
10. ¿El documento respeta fuentes oficiales y normas aplicables?

## 11. Pruebas de robustez

La auditoría debe probar periódicamente textos:

- cortos y extensos;
- con mala ortografía;
- rurales, urbanos y periurbanos;
- EIB y monolingües;
- agrícolas y no agrícolas;
- con términos locales desconocidos;
- con varias finalidades;
- con información contradictoria;
- con finalidad al inicio, medio o final;
- con productos explícitos e implícitos;
- de Docente y Director.

## 12. Filosofía final

**La IA comprende y propone; la base oficial protege; el docente y el director deciden.**
