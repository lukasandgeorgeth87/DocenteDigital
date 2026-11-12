/* Motor Pedagógico V2 — catálogo curado, ciclo III / derechos de la niñez.
 * No es una generación GPT ni pretende cubrir otras unidades.
 * Cada sesión explicita problema, actuación, evidencia y criterio observables.
 * Los nombres de competencias se cotejan con DD_OFFICIAL_CURRICULUM antes de usar.
 */
(function(root){
 'use strict';
 const C={
  oral:'Se comunica oralmente en su lengua materna',
  read:'Lee diversos tipos de textos escritos en su lengua materna',
  write:'Escribe diversos tipos de textos en su lengua materna',
  civic:'Convive y participa democráticamente en la búsqueda del bien común',
  amount:'Resuelve problemas de cantidad',
  data:'Resuelve problemas de gestión de datos e incertidumbre',
  inquiry:'Indaga mediante métodos científicos para construir sus conocimientos',
  explain:'Explica el mundo físico basándose en conocimientos sobre los seres vivos, materia y energía, biodiversidad, Tierra y universo',
  art:'Crea proyectos desde los lenguajes artísticos',
  move:'Interactúa a través de sus habilidades sociomotrices',
  religion:'Construye su identidad como persona humana, amada por Dios, digna, libre y trascendente, comprendiendo la doctrina de su propia religión, abierto al diálogo con las que le son cercanas'
 };
 // Orden de cada ficha: título, pregunta concreta, actuación estudiantil,
 // evidencia, criterio observable, recurso previsto, clave de competencia.
 const R={
 'Comunicación':[
  [
   ['¿Qué derecho reconocemos en las viñetas?','¿Qué quiere decir la niña cuando pide que escuchen su opinión?','Observan dos viñetas ficticias; cada pareja explica quién habla, qué solicita y qué pregunta haría al personaje.','Explicación oral y una pregunta pertinente sobre la viñeta.','Explica con orden una idea y formula una pregunta relacionada; escucha a su interlocutor.','Dos viñetas ficticias y registro de observación.','oral'],
   ['Leemos una historieta sobre el derecho a jugar','¿Qué pistas muestran que los personajes desean jugar juntos?','Antes de leer anticipan el tema; durante la lectura localizan personajes y acciones; después explican el derecho representado con un dibujo.','Respuesta apoyada en una pista del texto y dibujo del derecho.','Ubica información explícita y explica el derecho con una pista de la historieta.','Historieta breve impresa de lectura inicial.','read'],
   ['Preguntamos y respondemos con respeto','¿Qué pregunta ayudaría a comprender mejor el derecho a aprender?','En tríos desempeñan roles de hablante, oyente y observador; plantean preguntas, responden y acuerdan una forma de escuchar.','Registro de pregunta, respuesta y turno respetado.','Formula preguntas claras, responde sobre el tema y respeta turnos de palabra.','Tarjetas de turnos y situaciones ficticias.','oral'],
   ['Encontramos ideas importantes en un texto de derechos','¿Qué nos explica el texto sobre la educación y el buen trato?','Leen un texto informativo breve con apoyo de palabras clave; señalan dos ideas relevantes y comparan con una viñeta.','Subrayado de dos ideas y explicación de una semejanza.','Localiza dos ideas explícitas y explica una relación con la imagen.','Texto informativo breve y viñeta.','read']
  ],
  [
   ['Planificamos una página informativa de derechos','¿Para quién escribiremos y qué necesita saber esa persona?','Definen destinatario; eligen un derecho de las viñetas; preparan un esquema con nombre, ejemplo y recomendación.','Organizador previo de una página con destinatario y mensaje.','Ordena ideas en función del destinatario y del propósito comunicativo.','Plantilla de tres apartados y tarjetas de derechos.','write'],
   ['Escribimos explicaciones breves con ejemplos','¿Cómo explicar el derecho a ser escuchados con palabras sencillas?','Redactan un párrafo de dos o tres oraciones con un ejemplo ficticio; leen a un compañero para comprobar comprensión.','Primer borrador de explicación de un derecho.','Escribe oraciones relacionadas y un ejemplo coherente con el derecho elegido.','Borrador A4 y banco de conectores sencillos.','write'],
   ['Explicamos nuestras páginas a otra pareja','¿Se entiende el ejemplo de nuestra página al escuchar la explicación?','Presentan la página oralmente; la pareja formula una pregunta; anotan qué aclaración necesita el mensaje.','Explicación oral y una observación de la pareja.','Explica su ejemplo con claridad y responde una pregunta relacionada.','Página en borrador y lista de escucha.','oral'],
   ['Revisamos el texto para que todos lo comprendan','¿La página dice claramente qué derecho muestra la escena?','Intercambian borradores; revisan título, secuencia de ideas y signos básicos con una lista de cotejo; escriben una segunda versión.','Borrador corregido y lista de revisión marcada.','Mejora la claridad de su texto usando al menos una observación recibida.','Borradores y lista de cotejo de tres criterios.','write']
  ],
  [
   ['Seleccionamos mensajes finales para el producto','¿Qué información de la página no puede faltar?','Leen sus borradores y eligen un título, una explicación y un ejemplo que represente fielmente el derecho.','Texto final seleccionado con justificación breve.','Selecciona información relevante y explica su elección con base en el mensaje.','Borradores revisados y fichas de selección.','read'],
   ['Revisamos las instrucciones para presentar el producto','¿Qué necesita saber una persona que observe nuestro material?','Leen indicaciones breves; identifican a quién va dirigido el producto y preparan una consigna de uso o consulta.','Consigna escrita y comprobada con otro equipo.','Escribe una indicación breve y comprensible para el destinatario.','Producto en elaboración y tarjetas de visitantes.','write'],
   ['Ensayamos nuestra explicación de los derechos','¿Cómo responder sin repetir el texto de memoria?','En pequeños grupos explican una parte del producto usando su ejemplo; escuchan preguntas y mejoran su explicación.','Registro de explicación oral y ajuste realizado.','Comunica una idea sustentada en su ejemplo y responde pertinentemente.','Producto final y ficha de observación oral.','oral'],
   ['Compartimos y evaluamos nuestros mensajes','¿Qué aprendió el público a partir de nuestra explicación?','Presentan sus páginas o estaciones; recogen preguntas sin datos personales; explican qué mejorarían del mensaje.','Explicación final y autoevaluación con criterio.','Explica con claridad el derecho trabajado y propone una mejora de su comunicación.','Producto final y lista de cotejo.','oral']
  ]
 ],
 'Personal Social':[
  [
   ['Reconocemos derechos en historias ficticias','¿Qué derecho aparece cuando un personaje pide participar?','Analizan dos relatos ficticios, identifican el derecho presente y explican por qué debe respetarse.','Ficha de dos situaciones con derecho y explicación.','Reconoce derechos en historias ficticias y explica su importancia con ejemplos.','Relatos ilustrados y tarjetas de derechos.','civic'],
   ['Relacionamos derechos con nuestras responsabilidades','¿Qué podemos hacer para respetar el derecho de los demás?','Clasifican tarjetas de acciones y explican cómo las responsabilidades ayudan a la convivencia sin condicionar la existencia de los derechos.','Clasificación justificada de acciones y derechos.','Relaciona una responsabilidad concreta con el respeto del derecho ajeno.','Tarjetas de acciones y organizador comparativo.','civic'],
   ['Acordamos normas para participar y escuchar','¿Qué acuerdo asegura que todas las voces puedan escucharse?','Debaten dos alternativas, escuchan opiniones y escriben tres acuerdos verificables para el diálogo en clase.','Tres acuerdos construidos y explicación oral.','Propone normas de participación, escucha opiniones y explica su utilidad.','Tarjetas de turnos y acta de acuerdos.','civic']
  ],
  [
   ['Analizamos un desacuerdo en un juego','¿Qué diálogo ayudaría a resolver un desacuerdo sin excluir?','Representan una escena ficticia; identifican perspectivas; proponen una solución dialogada y respetuosa.','Secuencia dibujada de un diálogo de solución.','Propone una salida dialogada considerando los derechos de ambos personajes.','Viñeta de juego y tarjetas de diálogo.','civic'],
   ['Escuchamos opiniones distintas sobre un acuerdo','¿Cómo decidir si dos compañeros proponen reglas diferentes?','Comparan razones de dos personajes; deliberan en grupos y justifican un acuerdo inclusivo.','Acuerdo argumentado y breve registro de opiniones.','Escucha puntos de vista y justifica un acuerdo para el bien común.','Tarjetas de propuestas y papelote.','civic'],
   ['Proponemos compromisos realizables','¿Qué acción concreta podemos practicar esta semana?','Seleccionan compromisos de buen trato y participación que puedan observarse en el aula; acuerdan cómo verificar avances.','Compromiso colectivo con acción y forma de seguimiento.','Propone una acción viable para mejorar la convivencia y explica cómo observarla.','Cartel de compromisos y lista de seguimiento.','civic']
  ],
  [
   ['Incluimos compromisos en el producto','¿Qué compromiso comunica mejor cómo respetar un derecho?','Eligen acuerdos construidos durante la unidad y redactan una recomendación breve para el público.','Recomendación con derecho y acción correspondiente.','Relaciona el compromiso con un derecho y una acción practicable.','Acta de acuerdos y borrador del producto.','civic'],
   ['Practicamos el diálogo durante una presentación','¿Cómo responder a quien piensa distinto sin burlarse?','Ensayan preguntas de visitantes ficticios y responden de manera respetuosa usando acuerdos previos.','Rúbrica breve de escucha y respuesta respetuosa.','Respeta el turno y justifica una respuesta sin descalificar.','Tarjetas de preguntas y acuerdos.','civic'],
   ['Evaluamos cómo cumplimos los acuerdos','¿Qué evidencia tenemos de nuestra participación respetuosa?','Revisan registros de observación sin nombres públicos; reconocen avances y eligen un compromiso de mejora.','Autoevaluación y compromiso ajustado.','Describe una acción propia de convivencia y propone un siguiente paso concreto.','Registro docente y acuerdos de aula.','civic']
  ]
 ],
 'Matemática':[
  [
   ['Registramos preferencias sobre historias de derechos','¿Cuál de tres historias ficticias queremos leer primero?','Cada estudiante vota sin registrar nombres; cuentan marcas y organizan resultados en una tabla.','Tabla de conteos reales sin datos personales.','Organiza votos recogidos en una tabla y explica cuál fue el más frecuente.','Tres tarjetas de historias y tabla de marcas.','data'],
   ['Calculamos materiales para leer en equipos','¿Cuántas tarjetas hay si un grupo tiene 8 y otro 7?','Representan 8 y 7 tarjetas con fichas; suman, comparan dos estrategias y comprueban el total.','Representación de 8 + 7 y explicación del resultado.','Resuelve una suma de dos cantidades y comprueba su respuesta con material.','15 fichas o tarjetas reutilizables.','amount'],
   ['Comparamos cantidades de dibujos','¿Qué diferencia hay entre 18 dibujos y 12 dibujos?','Representan colecciones ficticias de 18 y 12 dibujos; calculan la diferencia con material o recta numérica.','Procedimiento para comparar 18 y 12 elementos.','Representa la diferencia entre dos cantidades y explica cómo la encontró.','Tarjetas numéricas y recta numérica.','amount']
  ],
  [
   ['Convertimos nuestros conteos en un gráfico','¿Cómo se verían nuestros votos en barras?','Usan los conteos reales de la primera semana; dibujan barras con escala de una unidad y verifican alturas.','Gráfico de barras con rótulos y cantidades coherentes.','Representa datos reales en barras con categorías y cantidades correctas.','Tabla de votos anterior y papel cuadriculado.','data'],
   ['Distribuimos tarjetas para trabajar en parejas','¿Cómo repartir 12 tarjetas entre seis parejas sin que falten?','Plantean y representan un reparto equitativo de 12 tarjetas entre seis parejas; comprueban distribuyendo fichas.','Esquema de reparto y comprobación con fichas.','Representa un reparto equitativo y justifica la cantidad que recibe cada pareja.','12 fichas y seis círculos de papel.','amount'],
   ['Resolvemos un problema con materiales de la guía','Si tenemos 20 hojas y usamos 8, ¿cuántas quedan?','Modelan 20 − 8 con dibujos o fichas; resuelven, comprueban y explican si alcanzan las hojas restantes.','Operación 20 − 8 justificada con una representación.','Resuelve una resta en contexto y comprueba la respuesta.','Tarjetas de hojas ficticias y fichas.','amount']
  ],
  [
   ['Explicamos qué muestran nuestros datos','¿Qué historia fue la más elegida según nuestro gráfico?','Interpretan el gráfico real, responden preguntas sobre mayor, menor e igualdad y justifican usando cantidades.','Tres conclusiones apoyadas en el gráfico del grupo.','Responde preguntas usando datos y explica de dónde obtiene la respuesta.','Gráfico elaborado y tarjetas de preguntas.','data'],
   ['Calculamos materiales para compartir nuestro producto','¿Cuántas páginas son necesarias si 9 equipos usan 2 cada uno?','Representan nueve grupos de dos con material y cuentan el total por adiciones sucesivas; verifican su resultado.','Representación de nueve grupos de dos y total correcto.','Resuelve una agrupación de cantidades iguales con adiciones o dibujos.','18 fichas y tarjetas de equipo.','amount'],
   ['Verificamos cantidades de la presentación','¿Qué cambia si tenemos 24 tarjetas y repartimos 6?','Comprueban una situación ficticia de 24 tarjetas y 6 usadas; explican por qué quedan 18.','Resolución de 24 − 6 y explicación del procedimiento.','Justifica el resultado de una resta y verifica con una estrategia distinta.','24 fichas y cuadro de registro.','amount']
  ]
 ],
 'Ciencia y Tecnología':[
  [
   ['Preguntamos qué sucede al mezclar agua y aceite','¿Qué ocurre cuando juntamos agua y aceite en un vaso?','Predicen qué observarán y comparan las dos sustancias en recipientes transparentes seguros, sin probarlas.','Predicción y dibujo de la mezcla observada.','Plantea una predicción y representa una observación concreta sin inventar resultados.','Agua, aceite vegetal y vasos transparentes.','inquiry'],
   ['Diseñamos una comparación con jabón','¿Qué cambio veremos si agregamos una pequeña cantidad de jabón?','Acuerdan mantener cantidades semejantes y comparar dos vasos, uno con jabón y otro sin jabón; registran lo visible.','Plan simple de comparación con una variable.','Propone una comparación y señala qué condición cambia y cuáles se mantienen.','Dos vasos, agua, aceite y jabón.','inquiry']
  ],
  [
   ['Registramos lo que realmente observamos','¿Cómo mostrar diferencias entre nuestras dos mezclas?','Repiten la observación con acompañamiento, dibujan ambos vasos y anotan semejanzas y diferencias sin anticipar conclusiones.','Tabla ilustrada de observaciones de ambos vasos.','Registra diferencias observables de dos muestras sin confundir predicción y dato.','Vasos de muestra y ficha de dos columnas.','inquiry'],
   ['Explicamos límites de nuestra demostración','¿Ver las mezclas permite saber si hay microbios?','Distinguen observaciones visibles de afirmaciones que requieren otras fuentes; leen recomendaciones de higiene apropiadas para su edad.','Lista de lo observado y lo que no se pudo comprobar.','Distingue un dato observable de una afirmación no comprobada.','Registro de mezcla y texto informativo revisado.','explain']
  ],
  [
   ['Preparamos mensajes de higiene basados en evidencia','¿Qué podemos afirmar realmente después del experimento?','Seleccionan observaciones registradas y separan mensajes de cuidado recomendados por fuentes confiables de los resultados de la mezcla.','Mensaje con observación y límite de la prueba.','Comunica un hallazgo y reconoce un límite de la comparación.','Registros reales y fuente escolar verificada.','inquiry'],
   ['Compartimos nuestra indagación y sus límites','¿Qué investigamos y qué necesitaríamos averiguar después?','Presentan pregunta, predicción, procedimiento, observación y una duda pendiente sin afirmar que el jabón eliminó microorganismos.','Relato científico breve del proceso y pregunta nueva.','Comunica observaciones y limitaciones de su indagación con claridad.','Fichas de experimento y panel de explicación.','inquiry']
  ]
 ],
 'Arte y Cultura':[
  [
   ['Exploramos símbolos para representar derechos','¿Cómo dibujar el derecho a jugar sin excluir a nadie?','Comparan símbolos ilustrados; proponen dos formas de representar el juego y explican a quiénes incluyen.','Dos bocetos y explicación de su significado.','Explora imágenes y justifica un símbolo que comunica un derecho.','Tarjetas ilustradas, lápices de colores.','art'],
   ['Elegimos colores y formas para nuestros mensajes','¿Qué colores y formas harán legible el mensaje?','Prueban combinaciones, observan legibilidad y seleccionan una composición para el producto.','Pruebas de composición y boceto elegido.','Experimenta con formas y colores para comunicar una idea.','Cartulina y colores disponibles.','art']
  ],
  [
   ['Ilustramos una escena respetuosa','¿Qué detalle ayuda a comprender la escena?','Crean una ilustración de un derecho mediante personajes ficticios; revisan la relación con el texto de Comunicación.','Ilustración coherente con un derecho.','Crea una imagen que representa una situación y explica su intención.','Hoja para ilustrar y texto seleccionado.','art'],
   ['Organizamos ilustraciones y mensajes','¿Se lee fácilmente la página que hicimos?','Distribuyen imagen, título y texto; comparan dos diseños y ajustan el orden visual.','Página ilustrada con título y texto legibles.','Organiza imagen y escritura con un propósito comunicativo.','Bocetos, papel y marcadores.','art']
  ],
  [
   ['Mejoramos la presentación visual del producto','¿Qué parte del diseño todavía es confusa?','Revisan claridad, tamaño y relación entre dibujo y mensaje; realizan una mejora concreta.','Comparación antes y después de una página.','Revisa una producción artística según un criterio y explica el cambio.','Producto y lista visual de revisión.','art'],
   ['Mostramos nuestras ilustraciones y decisiones','¿Por qué elegimos estos símbolos para representar derechos?','Exponen una imagen, explican su creación y escuchan opiniones de visitantes o compañeros.','Explicación de una decisión creativa.','Comunica el sentido de su producción y escucha comentarios.','Producto ilustrado terminado.','art']
  ]
 ],
 'Educación Física':[
  [
   ['Jugamos con reglas que permiten participar','¿Qué regla ayuda a que todos puedan jugar?','Realizan un juego cooperativo con roles y pausas; observan si todos participaron y ajustan una regla.','Acuerdo de juego y registro de participación grupal.','Participa con respeto y propone una regla inclusiva del juego.','Pelotas livianas y señales seguras.','move'],
   ['Cooperamos para superar un reto motriz','¿Cómo ayudarnos sin dejar a nadie fuera?','En equipos completan un recorrido sencillo sin competencia eliminatoria, coordinando turnos y apoyos.','Autoevaluación de cooperación y cuidado.','Coordina acciones con compañeros respetando turnos y diferencias.','Aros y conos seguros.','move']
  ],
  [
   ['Creamos una variante inclusiva de un juego','¿Qué cambiamos para que el juego sea más accesible?','Comparan reglas y proponen adaptaciones; prueban la variante y explican los cambios.','Reglas adaptadas y prueba realizada.','Propone y aplica una regla para favorecer la participación.','Material deportivo disponible.','move'],
   ['Resolvemos desacuerdos durante un juego','¿Qué hacemos cuando no estamos de acuerdo con una regla?','Interrumpen el juego ante una situación ficticia planteada; dialogan y acuerdan una regla antes de continuar.','Acuerdo de convivencia puesto a prueba.','Utiliza el diálogo y mantiene una participación respetuosa.','Juego por equipos y señal de pausa.','move']
  ],
  [
   ['Organizamos un juego cooperativo para compartir','¿Qué necesitará saber un visitante antes de participar?','Preparan instrucciones simples de un juego inclusivo; ensayan explicarlas y distribuir roles de manera equitativa.','Reglas claras y roles organizados.','Organiza acciones grupales y comunica reglas con respeto.','Tarjetas de reglas y materiales deportivos.','move'],
   ['Evaluamos nuestra cooperación y participación','¿Cómo mostramos que todos tuvieron oportunidad de jugar?','Realizan el juego acordado y revisan con una lista de cotejo participación, apoyo y cumplimiento de normas.','Autoevaluación de cooperación y mejora propuesta.','Participa respetuosamente y propone un ajuste para el siguiente juego.','Lista de cotejo y materiales seguros.','move']
  ]
 ],
 'Educación Religiosa':[
  [
   ['Reflexionamos sobre la dignidad de las personas','¿Cómo mostramos respeto por una persona diferente a nosotros?','Escuchan una historia ficticia de buen trato; expresan acciones concretas de respeto según el enfoque religioso de la institución.','Explicación oral de una acción de respeto.','Relaciona la dignidad de las personas con una acción respetuosa.','Relato de buen trato aprobado por la IE.','religion'],
   ['Valoramos el cuidado y la ayuda mutua','¿Qué gesto muestra atención a quien necesita apoyo?','En parejas analizan una escena de ayuda y dibujan una decisión respetuosa coherente con su fe.','Dibujo y explicación de un gesto de ayuda.','Explica una forma de cuidado del prójimo sin discriminar.','Viñeta ficticia y papel.','religion']
  ],
  [
   ['Proponemos gestos de solidaridad en el aula','¿Cómo ayudar sin avergonzar a otras personas?','Comparan acciones posibles; eligen un gesto de apoyo respetuoso y explican su intención.','Compromiso personal de ayuda mutua.','Propone una acción de solidaridad que respeta la dignidad ajena.','Tarjetas de situaciones ficticias.','religion'],
   ['Conversamos sobre el respeto de las diferencias','¿Por qué escuchar creencias u opiniones distintas?','Dialogan sobre un relato de convivencia y reconocen el valor de tratar con respeto a todas las personas.','Conclusión oral sobre convivencia respetuosa.','Explica la importancia del trato respetuoso ante diferencias.','Relato de convivencia aprobado por la IE.','religion']
  ],
  [
   ['Compartimos mensajes de buen trato','¿Qué palabra puede promover la solidaridad?','Preparan y explican un mensaje breve de respeto destinado a la exposición o guía, con acompañamiento.','Mensaje positivo justificado.','Comunica una propuesta de buen trato coherente con la dignidad humana.','Carteles y producciones de aula.','religion'],
   ['Revisamos nuestros compromisos de respeto','¿Qué gesto de ayuda podemos seguir practicando?','Revisan acciones acordadas y eligen una manera concreta de continuar mostrando consideración por los demás.','Compromiso de buen trato y autoevaluación.','Reconoce una acción solidaria y explica cómo practicarla.','Acuerdos y ficha de reflexión.','religion']
  ]
 ]
 };
 root.DD_PED_V2_CATALOG=Object.freeze({competences:Object.freeze(C),routes:Object.freeze(R),version:'2.0.0-rights-grade2'});
})(window);
