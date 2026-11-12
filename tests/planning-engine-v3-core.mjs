// Contratos V3: una sola fuente de verdad para unidad, proyecto y Word, sin parches por tema.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const root={};
vm.runInNewContext(readFileSync(new URL('../planning-engine-v3-core.js',import.meta.url),'utf8'),
 {window:root});
const core=root.DDPlanningCoreV3;
assert.equal(core.version,'3.0.0-contract-first');
const competences={
 'Comunicación':[ {name:'Lee diversos tipos de textos escritos en su lengua materna',capacities:['Obtiene información del texto escrito']} ],
 'Personal Social':[ {name:'Convive y participa democráticamente en la búsqueda del bien común',capacities:['Interactúa con todas las personas']} ]
};
const curriculum={getArea(level,area){return level==='Primaria'?(competences[area]||[]):[];},
 sourceFor(){return {title:'Programa curricular de Primaria'};}};
const context={
 type:'Unidad de aprendizaje',level:'Primaria',grades:['2.º'],areas:['Comunicación','Personal Social'],
 duration:'2 semanas',title:'Investigamos los derechos para convivir mejor',
 situationBrief:'Los derechos de las niñas y los niños',
 product:'Guía ilustrada sobre los derechos',productTitle:'Guía ilustrada sobre los derechos',
 documentContextSnapshot:{institution:'I.E. de prueba',teacher:'Docente de prueba'}
};
const situation='Un grupo de personajes ficticios necesita reconocer los derechos de las niñas y los niños en situaciones de juego, lectura y convivencia. Cada equipo analizará relatos breves, realizará preguntas y preparará mensajes comprensibles para un público infantil. Se trabajará sin atribuir hechos de vulneración a familias o estudiantes reales.';
const specs=[
 ['Comunicación',1,'Leemos historias sobre el derecho a jugar','En parejas leen una historieta ficticia, identifican dos pistas textuales y explican cómo se reconoce el derecho a jugar.','Ficha con pistas del texto y una explicación escrita.','Identifica información explícita del texto y justifica su respuesta con una pista.','Lee diversos tipos de textos escritos en su lengua materna','Obtiene información del texto escrito'],
 ['Personal Social',1,'Debatimos acuerdos sobre el derecho a participar','En equipos analizan un desacuerdo ficticio, escuchan dos opiniones y proponen una decisión de convivencia respetuosa.','Acta de acuerdos con una razón de cada equipo.','Propone un acuerdo para participar y justifica cómo respeta el derecho de todos.','Convive y participa democráticamente en la búsqueda del bien común','Interactúa con todas las personas'],
 ['Comunicación',2,'Revisamos mensajes que explican nuestros derechos','En parejas revisan una página escrita, identifican qué información falta y reescriben dos oraciones para explicar mejor un derecho.','Versión corregida de una página con cambios visibles.','Corrige información de su mensaje usando una pista del texto fuente revisado.','Lee diversos tipos de textos escritos en su lengua materna','Obtiene información del texto escrito'],
 ['Personal Social',2,'Compartimos acuerdos para respetar nuestros derechos','En pequeños grupos presentan los acuerdos construidos, escuchan preguntas y explican una mejora de convivencia que puedan observar.','Presentación oral y ficha de compromisos revisados.','Explica un acuerdo de buen trato y propone un seguimiento respetuoso.','Convive y participa democráticamente en la búsqueda del bien común','Interactúa con todas las personas']
];
const generator=(unit)=>({
 title:unit.title,situation,reto:'¿Cómo podemos explicar nuestros derechos mediante ejemplos y acuerdos claros?',
 purpose:'Comprender derechos de la niñez en textos y situaciones ficticias, conversar, tomar acuerdos y elaborar una guía ilustrada accesible para todos.',
 product:unit.product,
 activities:specs.map((s,i)=>({area:s[0],week:s[1],day:i%2?'Martes':'Lunes',block:i%2?2:1,
  title:s[2],studentAction:s[3],evidence:s[4],criterion:s[5],v2Plan:{
   question:'¿Qué necesitamos comprender y explicar acerca de nuestros derechos?',
   resource:'Historietas, fichas de lectura y materiales para acuerdos.',
   competence:s[6],capacities:[s[7]],phase:i<2?'exploracion':'comunicacion'
  }}))
});
const first=core.compile(context,generator,curriculum);
assert(first.ok,JSON.stringify(first.errors));
assert.equal(first.reviewRequired,true);
assert.equal(first.readyForPublishing,false);
assert.equal(first.coverage.sessions,4);
assert.equal(first.normalized.sessions[0].source,'Programa curricular de Primaria');
const html=core.renderDocument(first);
assert(html.includes('MATRIZ')===false);
assert(html.includes('Leemos historias sobre el derecho a jugar'));
assert(html.includes('Guía ilustrada sobre los derechos'));
assert(!html.includes('CNEB certificado'));
assert(html.includes('pendientes de cotejo'));
assert.equal(core.compile(context,null,curriculum).errors[0].code,'provider_missing');
assert.equal(core.compile({...context,title:'Investigamos el agua para convivir mejor'},generator,curriculum).errors[0].code,'topic_mismatch');
assert.equal(core.compile({...context,areas:['Personal Social']},generator,curriculum).ok,false);
assert.equal(core.compile({...context,product:'Producto por confirmar',productTitle:''},generator,curriculum).ok,false);
assert.equal(core.compile({...context,type:'Proyecto de aprendizaje'},generator,curriculum).ok,true);
assert(core.compile({...context,topic:'El agua'},generator,curriculum).errors.some(x=>x.code==='topic_mismatch'));
const replaced=(u)=>({...generator(u),activities:generator(u).activities.map((a,i)=>i===1?{...a,title:generator(u).activities[0].title}:a)});
assert(core.compile(context,replaced,curriculum).errors.some(x=>x.code==='title_duplicate'));
const falseComp=(u)=>({...generator(u),activities:generator(u).activities.map((a,i)=>i===2?{
 ...a,v2Plan:{...a.v2Plan,competence:'Competencia inventada'}
}:a)});
assert(core.compile(context,falseComp,curriculum).errors.some(x=>x.code==='curriculum_unverified'));
const weak=(u)=>({...generator(u),activities:generator(u).activities.map((a,i)=>i===3?{
 ...a,criterion:'Bien',studentAction:'Hace algo',evidence:'trabajo'
}:a)});
const bad=core.compile(context,weak,curriculum);
assert(bad.errors.some(x=>x.code==='criterion_weak'));
assert(bad.errors.some(x=>x.code==='action_weak'));
assert(bad.errors.some(x=>x.code==='evidence_weak'));
assert.deepEqual(JSON.stringify(context),JSON.stringify({...context}));
assert.equal(context.activities,undefined);
console.log('PASS V3 CORE: fuente única, trazabilidad curricular, documentos, integridad del original y rechazo de contenidos defectuosos');
