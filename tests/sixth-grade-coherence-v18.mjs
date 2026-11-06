import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const original=[
'Quiero crear una UNIDAD DE APRENDIZAJE para 6.º grado de Educación Primaria.',
'**Título:** Investigamos y actuamos para proteger el agua de nuestra comunidad.',
'**Nivel:** Primaria.',
'**Grado:** 6.º grado (ciclo V).',
'**Duración:** 3 semanas, con 2 sesiones diarias.',
'**Áreas curriculares:** Comunicación, Matemática, Personal Social y Ciencia y Tecnología.',
'**Contexto:** El agua es un recurso indispensable para la vida, la salud y la agricultura. Algunas personas desperdician agua y los estudiantes investigarán su uso.',
'**Pregunta retadora:** ¿Cómo podemos investigar y analizar el uso del agua en nuestra comunidad para proponer soluciones viables que permitan reducir su desperdicio?',
'**Producto final:** Campaña escolar «Guardianes del agua», integrada por un informe de investigación, gráficos estadísticos, propuestas de solución, materiales de sensibilización y compromisos de uso responsable del agua.',
'**Organización de las tres semanas:** Semana 1: Identificamos el problema, formulamos preguntas, buscamos fuentes confiables y recogemos datos.',
'Semana 2: Analizamos información.',
'Semana 3: Elaboramos, revisamos y difundimos la campaña escolar.'
].join('\n');
const src=read('proposal-choice-v8.js');
const first=src.indexOf('  const tidy='),last=src.indexOf('  function topicClass(raw){',first);
assert(first>=0&&last>first);
const parsing={};
runInNewContext(src.slice(first,last)+'\nthis.readTitle=namedUnitTitle;this.readQuestion=statedChallenge;this.readProduct=namedProductFinal;',parsing);
assert.equal(parsing.readTitle(original),'Investigamos y actuamos para proteger el agua de nuestra comunidad');
const expected='¿Cómo podemos investigar y analizar el uso del agua en nuestra comunidad para proponer soluciones viables que permitan reducir su desperdicio?';
assert.equal(parsing.readQuestion(original),expected);
assert.equal(parsing.readQuestion(original.replace(/\n/g,' ')),expected);
assert.match(parsing.readProduct(original),/materiales de sensibilización y compromisos de uso responsable del agua/);
assert.doesNotMatch(parsing.readProduct(original),/Organización|Semana 1/i);
assert.match(parsing.readProduct(original.replace(/\n/g,' ')),/materiales de sensibilización y compromisos/);
assert(src.includes('unit.reto=statedChallenge(pending.brief)||pending.reto||unit.reto;'),'La pregunta indicada debe tener prioridad al guardar');

const code=read('schedule-v3.js'),a=code.indexOf('  function primarySequenceTitle('),b=code.indexOf('  function scheduleSequenceHtml(',a);
assert(a>=0&&b>a);
const areas=['Comunicación','Matemática','Personal Social','Ciencia y Tecnología'];
const DAYS=['Lunes','Martes','Miércoles','Jueves','Viernes'];
const schedule=Object.fromEntries(DAYS.map((day,i)=>[day,[
 {area:areas[(i*2)%4],block:1,time:''},{area:areas[(i*2+1)%4],block:2,time:''}
]]));
const frame={
 window:{ddContextTopic:()=> 'el uso y cuidado del agua'},
 state:{level:'Primaria',areas,unitSessionMode:'2',pendingUnitChoice:{selectedProduct:parsing.readProduct(original)}},
 DAYS,effectiveSchedule:()=>schedule,normalizeArea:x=>x,activityVariants:()=>['Actividad general'],
 buildActivities:()=>[]
};
runInNewContext(code.slice(a,b)+'\nthis.testBuild=buildActivities;',frame);
const generated=frame.testBuild(original,'3 semanas');
assert.equal(generated.length,30);
const close=generated.filter(x=>x.week===3&&x.area==='Comunicación');
assert.equal(close.length,3);
assert.match(close[0].title,/Redactamos mensajes claros/i);
assert.match(close[1].title,/Revisamos y mejoramos/i);
assert.match(close[2].title,/Presentamos y evaluamos/i);
assert(close.every(x=>!x.title.includes('integrada por un informe')));
const auditWindow={};
runInNewContext(read('planning-chain-integrity-v10.js'),{window:auditWindow,state:{units:[]}});
const check=auditWindow.DD_PLANNING_CHAIN_V10.auditUnit({
 title:'Investigamos y actuamos para proteger el agua',type:'Unidad de aprendizaje',
 level:'Primaria',grades:['6.º'],areas:['Comunicación'],
 situation:'Las familias desperdician agua y estudiantes investigan formas de cuidarla.',
 reto:'¿Cómo construir una respuesta que contribuya a fuentes confiables y recogemos datos?',
 product:'Campaña de cuidado del agua',
 activities:[{title:'Dialogamos sobre el cuidado del agua',area:'Comunicación',time:'08:00'}]
});
assert(check.warnings.some(x=>x.id==='challenge-malformed'));
console.log('PASS v18: reto original, título y producto íntegros, tres semanas ordenadas y alerta de reto malformado');