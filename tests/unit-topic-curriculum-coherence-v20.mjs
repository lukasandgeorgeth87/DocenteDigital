import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const original='¿Cómo podemos investigar y analizar el uso del agua en nuestra comunidad para proponer soluciones viables que permitan reducir su desperdicio?';
const text=[
  'Quiero crear una UNIDAD DE APRENDIZAJE para 6.º grado de Primaria.',
  '**Título:** Investigamos y actuamos para proteger el agua de nuestra comunidad.',
  '**Nivel:** Primaria. **Grado:** 6.º grado (ciclo V).',
  '**Duración:** 3 semanas, con 2 sesiones por día.',
  '**Áreas curriculares:** Comunicación, Matemática, Personal Social y Ciencia y Tecnología.',
  '**Contexto:** En nuestra comunidad se desperdicia agua. Los estudiantes investigarán su uso.',
  '**Pregunta retadora:** '+original,
  '**Producto final:** Campaña escolar Guardianes del agua, con información y compromisos.'
].join(' ');

const titleWin={ddContextTopic:()=>'el uso y cuidado del agua'};
const titleCtx={
 window:titleWin,state:{level:'Primaria'},
 document:{getElementById:()=>null,querySelector:()=>null,addEventListener(){}},
 MutationObserver:class {observe(){}},setTimeout:()=>0,clearTimeout(){}
};
runInNewContext(read('title-context-v38.js'),titleCtx);
const offered=titleWin.ddNaturalPlanningTitles(text,'Unidad de aprendizaje');
assert.equal(offered[0],'Investigamos y actuamos para proteger el agua de nuestra comunidad');
assert.equal(offered.length,3);
assert(offered.every(s=>!/crear una UNIDAD DE APRENDIZAJE/i.test(s)),'No se deben sugerir órdenes como títulos');

const currWin={};
runInNewContext(read('official-curriculum-v1.js'),{
 window:currWin,state:{level:'Primaria'},
 document:{readyState:'complete',getElementById:()=>null}
});
const official=currWin.DD_OFFICIAL_CURRICULUM;
assert.equal(official.mathematicsModeFromTitle('Interpretamos gráficos y explicamos qué información muestran'),'datos');
assert.equal(official.mathematicsModeFromTitle('Revisamos que los gráficos representen correctamente los datos recogidos'),'datos');
assert.equal(official.scienceModeFromTitle('Elaboramos explicaciones sustentadas para el producto final'),'explica');
assert.equal(official.personalSocialModeFromTitle('Conversamos sobre prácticas y decisiones de las personas'),'convivencia');
assert.equal(official.personalSocialModeFromTitle('Reconocemos diferentes responsabilidades en nuestra comunidad'),'convivencia');
assert.equal(official.personalSocialModeFromTitle('Conocemos nuestra comunidad'),'indefinido');

const unitWin={
 DD_OFFICIAL_CURRICULUM:official,
 unitWordHtml:()=>'<p>Exportador anterior</p>',
 renderUnitOutput:()=>{}
};
runInNewContext(read('unit-export-quality-v11.js'),{window:unitWin});
const exportV=unitWin.DD_UNIT_EXPORT_QUALITY_V11;
assert.match(exportV.competences({level:'Primaria'},'Matemática','Interpretamos gráficos y explicamos qué información muestran'),/gestión de datos/);
assert.match(exportV.competences({level:'Primaria'},'Personal Social','Conversamos sobre prácticas y decisiones de las personas'),/Convive y participa/);
assert.match(exportV.competences({level:'Primaria'},'Ciencia y Tecnología','Elaboramos explicaciones sustentadas para el producto final'),/Explica el mundo físico/);
assert.match(exportV.competences({level:'Primaria'},'Personal Social','Conocemos nuestra comunidad'),/por seleccionar y confirmar/);
const unit={
 type:'Unidad de aprendizaje',title:'Investigamos y actuamos para proteger el agua de nuestra comunidad',
 level:'Primaria',ieType:'Polidocente',grades:['6.º'],areas:['Comunicación','Matemática','Personal Social','Ciencia y Tecnología'],
 duration:'3 semanas',situationBrief:text,
 situation:'La comunidad desperdicia agua. Los estudiantes investigan su uso y proponen soluciones. El reto será: '+original,
 reto:'¿Cómo podemos comprender el uso y cuidado del agua y utilizar lo aprendido para cuidar el agua?',
 product:'Campaña escolar Guardianes del agua, con informe de investigación, gráficos y compromisos.',
 documentContextSnapshot:{institution:'I.E. de prueba',teacher:'Docente de prueba'},
 purposes:[],activities:[
 {week:1,day:'Lunes',time:'08:00',area:'Comunicación',title:'Dialogamos sobre el cuidado del agua'},
 {week:1,day:'Martes',time:'09:00',area:'Matemática',title:'Interpretamos gráficos y explicamos qué información muestran'},
 {week:2,day:'Miércoles',time:'09:00',area:'Personal Social',title:'Conversamos sobre prácticas y decisiones de las personas'},
 {week:3,day:'Jueves',time:'09:00',area:'Ciencia y Tecnología',title:'Elaboramos explicaciones sustentadas para el producto final'}
 ]
};
assert.equal(exportV.challenge(unit),original);
const html=exportV.word(unit);
assert(html.includes('<b>Pregunta retadora:</b> '+original));
assert.equal((html.match(/¿Cómo podemos investigar y analizar el uso del agua/g)||[]).length,1,'Una sola pregunta retadora, no duplicada');
assert(html.includes('Resuelve problemas de gestión de datos e incertidumbre'));
assert(html.includes('Convive y participa democráticamente'));
assert(html.includes('Explica el mundo físico'));
assert(!html.includes('Exportador anterior'));
assert(exportV.qualityFlags(unit).some(x=>/reto almacenado difiere/i.test(x)));

const auditWin={};
runInNewContext(read('planning-chain-integrity-v10.js'),{window:auditWin,state:{units:[]}});
const review=auditWin.DD_PLANNING_CHAIN_V10.auditUnit(unit);
assert(review.warnings.some(w=>w.id==='explicit-challenge-differs'));
console.log('PASS v20: título explícito, pregunta intacta, competencias correctas y alerta de discrepancia');
