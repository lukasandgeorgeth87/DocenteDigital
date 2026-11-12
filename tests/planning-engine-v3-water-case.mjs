// Second independent pedagogical domain for contract V3: water, fourth grade, project.
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const root={};
vm.runInNewContext(readFileSync(new URL('../planning-engine-v3-core.js',import.meta.url),'utf8'),{window:root});
const core=root.DDPlanningCoreV3;
const comps={
 'Ciencia y Tecnología':{name:'Indaga mediante métodos científicos para construir sus conocimientos',capacities:['Problematiza situaciones para hacer indagación']},
 'Personal Social':{name:'Gestiona responsablemente el espacio y el ambiente',capacities:['Comprende las relaciones entre los elementos naturales y sociales']}
};
const official={getArea(level,area){return level==='Primaria'&&comps[area]?[comps[area]]:[];},
 sourceFor(){return {title:'Programa curricular de Educación Primaria'};}};
const request={type:'Proyecto de aprendizaje',level:'Primaria',grades:['4.º'],duration:'2 semanas',
 areas:['Ciencia y Tecnología','Personal Social'],title:'Investigamos el agua para cuidarla mejor',
 topic:'Uso responsable del agua en la escuela',situationBrief:'Uso y cuidado del agua en la escuela',
 product:'Campaña escolar sobre el uso responsable del agua',productTitle:'Campaña escolar sobre el uso responsable del agua',
 documentContextSnapshot:{institution:'I.E. de prueba',teacher:'Docente de prueba'}};
const actions=[
 ['Ciencia y Tecnología',1,'Observamos dónde y cuándo usamos el agua',
  'En grupos observan recipientes graduados y registran en una tabla cuánta agua emplean en una actividad segura y simulada.',
  'Tabla de mediciones obtenidas con recipientes graduados.','Registra cantidades observadas y explica las condiciones de su medición.',
  '¿Cuánta agua usamos en una actividad sencilla y cómo la medimos?'],
 ['Personal Social',1,'Reconocemos acuerdos para cuidar el agua',
  'Analizan dos escenas ficticias de uso del agua, identifican efectos posibles y acuerdan acciones de uso responsable en la escuela.',
  'Cuadro con acuerdos y sus razones justificadas.','Propone acuerdos realistas para el uso del agua y explica a quién benefician.',
  '¿Qué acuerdos pueden ayudar a usar el agua sin desperdiciarla?'],
 ['Ciencia y Tecnología',2,'Comparamos mediciones de agua con evidencias',
  'Repiten una medición en recipientes iguales, anotan datos comparables y explican qué diferencias observaron realmente.',
  'Registro comparativo y explicación basada en las mediciones.','Compara datos observados y distingue resultados de suposiciones.',
  '¿Qué diferencias encontramos cuando comparamos nuestros registros de agua?'],
 ['Personal Social',2,'Presentamos compromisos de cuidado del agua',
  'Elaboran una recomendación de ahorro de agua apoyada en los acuerdos, la presentan a otra pareja y ajustan un detalle.',
  'Versión revisada del mensaje de campaña y compromiso.','Justifica una acción de cuidado del agua y mejora su mensaje con una observación.',
  '¿Cómo podemos comunicar a otros nuestro compromiso con el agua?']
];
const milestones=[
 ['planificacion','En equipos formulan preguntas y acuerdan responsabilidades para elaborar una campaña con información comprensible.','Plan de investigación y reparto de tareas por equipo.'],
 ['investigacion','Observan una situación simulada de uso del agua y recogen mediciones sin atribuir hechos no registrados.','Tabla de datos con observaciones y condiciones de registro.'],
 ['construccion','Diseñan mensajes y carteles basados en datos observados y acuerdos de uso responsable del agua.','Borradores de los carteles con datos y recomendaciones.'],
 ['evaluacion','Presentan la campaña a compañeros y justifican qué mensaje corrigieron después de escuchar sugerencias.','Cartel final, autoevaluación y mejora justificada.']
].map(([phase,action,evidence])=>({phase,action,evidence}));
const provider=u=>({
 title:u.title,product:u.product,
 situation:'Al revisar unas ilustraciones ficticias sobre el uso del agua en una escuela, los estudiantes de cuarto grado se preguntan qué prácticas favorecen su cuidado. Para responder, compararán mediciones realizadas con materiales seguros, analizarán acuerdos de convivencia y elaborarán mensajes de ahorro. No se afirmará que la escuela tiene una fuga ni que alguna familia desperdicia agua; el proyecto parte de situaciones hipotéticas.',
 reto:'¿Cómo utilizamos mediciones y acuerdos para proponer mejores formas de cuidar el agua?',
 purpose:'Investigar usos del agua con registros observables, analizar acciones responsables y comunicar recomendaciones fundamentadas en una campaña escolar elaborada en equipos.',
 projectMilestones:milestones,
 activities:actions.map((a,i)=>({
 area:a[0],week:a[1],day:i%2?'Martes':'Lunes',block:i%2+1,
 title:a[2],studentAction:a[3],evidence:a[4],criterion:a[5],
 question:a[6],competence:comps[a[0]].name,capacities:comps[a[0]].capacities,
 resource:'Recipientes seguros, tarjetas ilustradas y fichas de registro.'
 }))
});
const compiled=core.compile(request,provider,official);
assert(compiled.ok,JSON.stringify(compiled.errors));
assert.equal(compiled.normalized.grades[0],'4.º');
assert.equal(compiled.normalized.sessions.length,4);
assert.equal(compiled.normalized.projectMilestones.length,4);
assert.equal(compiled.normalized.product,request.product);
const html=core.renderDocument(compiled);
assert(html.includes('Hitos del proyecto'));
assert(html.includes('mediciones'));
assert(!html.includes('derecho a jugar'));
const guide={purpose:'Comparar cantidades medidas en recipientes iguales y explicar las diferencias con evidencias observables y sin suponer resultados.',
 instrument:'Lista de cotejo de observación y registro',minutes:{start:15,develop:60,close:15},steps:[
 ['Planteamiento del problema','Observan recipientes, plantean una pregunta investigable y acuerdan cómo registrar los datos con cuidado.'],
 ['Diseño y registro','Definen qué compararán, mantienen la condición principal y registran solo los datos medidos realmente.'],
 ['Comunicación de resultados','Comparan sus tablas, distinguen datos y opiniones, y explican un resultado según sus registros.']
 ]};
const ses=core.compileSession(compiled,1,guide);
assert(ses.ok,JSON.stringify(ses.errors));
assert.equal(ses.session.competence,comps['Ciencia y Tecnología'].name);
assert(core.renderSessionDocument(ses).includes('Observamos dónde y cuándo usamos el agua'));
console.log('PASS V3 WATER: proyecto distinto en 4.º, secuencia, ciencia con evidencia, hitos y sesión/Word vinculados');
