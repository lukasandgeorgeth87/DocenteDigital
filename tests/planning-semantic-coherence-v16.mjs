import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const src=readFileSync(new URL('../planning-chain-integrity-v10.js',import.meta.url),'utf8');
const window={};
const ctx={window, state:{units:[],sessions:[]},console};
runInNewContext(src,ctx);
const api=window.DD_PLANNING_CHAIN_V10;
assert(api&&typeof api.auditUnit==='function','El auditor de unidades debe estar disponible');
const initial={id:'unit1',type:'Unidad de aprendizaje',level:'Primaria',grades:['4.º'],areas:['Comunicación','Matemática','Personal Social','Ciencia y Tecnología'],duration:'3 semanas',
  situation:'En nuestra escuela se desperdicia agua potable cuando quedan los caños abiertos. Los estudiantes desean investigar el consumo de agua.',
  reto:'¿Cómo podemos reducir el desperdicio de agua mediante el registro del consumo y recomendaciones?',
  product:'Campaña escolar Cada gota cuenta para ahorrar agua',
  activities:[{area:'Comunicación',title:'Leemos textos sobre el cuidado del agua',time:'08:30'},
    {area:'Matemática',title:'Construimos gráficos del consumo de agua',time:'09:30'},
    {area:'Ciencia y Tecnología',title:'Investigamos el desperdicio de agua en los caños',time:'10:30'},
    {area:'Personal Social',title:'Proponemos acuerdos para ahorrar agua',time:'11:30'}]};
const good=api.auditUnit(initial);
assert.equal(good.warnings.filter(x=>x.id.startsWith('semantic-')).length,0,'No inventar contradicciones sobre el agua');
const bad={...initial,reto:'¿Cómo organizamos un campeonato de fútbol entre nuestros equipos?',product:'Una maqueta de volcanes y lava',activities:[
 {area:'Comunicación',title:'Escribimos poemas sobre estrellas y planetas',time:'08:30'},
 {area:'Matemática',title:'Clasificamos minerales y rocas',time:'09:30'}]};
const fail=api.auditUnit(bad);
for(const id of ['semantic-challenge','semantic-product','semantic-activity-0','semantic-activity-1'])
 assert(fail.warnings.some(x=>x.id===id),`Falta detectar ${id}`);
assert.equal(fail.ok,false,'La incoherencia debe impedir mostrar sin alertas');
assert.match(api.unitPanel(bad),/volcanes|otro tema|tema distinto/);
assert.doesNotMatch(api.unitPanel(bad),/Sin alertas estructurales detectadas/);
const project={...initial,type:'Proyecto de aprendizaje',activities:[
 {area:'Comunicación',title:'Leemos textos sobre el cuidado del agua',time:'08:30'},
 {area:'Matemática',title:'Construimos gráficos del consumo de agua',time:'09:30'},
 {area:'Ciencia y Tecnología',title:'Investigamos el desperdicio de agua',time:'10:30'},
 {area:'Personal Social',title:'Proponemos acuerdos para ahorrar agua',time:'11:30'},
 {area:'Comunicación',title:'Explicamos el cuidado del agua',time:'12:30'}]};
let missing=api.auditUnit(project).warnings;
assert(missing.some(x=>x.id.startsWith('project-')&&x.message.includes('revisión o mejora')),'Proyecto debe avisar si no mejora producto');
assert(missing.some(x=>x.id.startsWith('project-')&&x.message.includes('comunicación del producto')),'Proyecto debe avisar si no socializa');
const validProject={...project,activities:[...project.activities,
 {area:'Comunicación',title:'Revisamos y mejoramos la campaña del agua',time:'12:30'},
 {area:'Comunicación',title:'Presentamos la campaña del agua a las familias',time:'12:30'}]};
const clear=api.auditUnit(validProject).warnings.filter(x=>x.id.startsWith('project-'));
assert.equal(clear.length,0,`Proyecto con cinco fases no debe tener avisos de fase: ${JSON.stringify(clear)}`);
const heritage={...initial,situation:'Investigamos el Día de Todos los Santos y sus costumbres en la comunidad',reto:'¿Cómo investigar y enseñar las costumbres de Todos los Santos?',product:'Galería Guiada de la Memoria',activities:[{area:'Comunicación',title:'Dialogamos con nuestros abuelos sobre las costumbres',time:'08:30'}]};
assert.equal(api.auditUnit(heritage).warnings.filter(x=>x.id.startsWith('semantic-')).length,0,'No penalizar productos creativos de nombre implícito');
console.log('PASS: coherencia unidad/proyecto, contradicciones temáticas, alertas visibles, cinco fases y ausencia de falsos positivos básicos');
