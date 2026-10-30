import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createContext,runInContext} from 'node:vm';
const source=readFileSync(new URL('../unit-export-quality-v11.js',import.meta.url),'utf8');
let rendered='';
const fake={
  getElementById:(id)=>id==='dd-sesiones'?{set innerHTML(v){rendered=v}}:null
};
const unit={
  level:'Primaria',type:'Unidad de aprendizaje',title:'Memorias de Todos los Santos',
  duration:'3 semanas',ieType:'Unidocente',grades:['1.º','3.º','5.º'],
  areas:['Comunicación','Matemática','Personal Social','Ciencia y Tecnología'],
  situationBrief:'En nuestra comunidad, las familias conservan las tradiciones. Los estudiantes desean investigar su historia y compartirla mediante una Galería Guiada de la Memoria.',
  situation:'Un hecho relacionado con “En nuestra comunidad, las familias conservan las tradiciones” llamó la atención de los estudiantes de nuestra comunidad.',
  reto:'¿Cómo compartiremos lo investigado?',product:'Galería Guiada de la Memoria',
  documentContextSnapshot:{institution:'I.E. Demo',teacher:'Docente Demo'},
  purposes:[...['Comunicación','Matemática','Personal Social','Ciencia y Tecnología'].map(area=>({area,instrument:'Lista de cotejo'}))],
  activities:[
    {area:'Comunicación',title:'Leemos relatos de Todos los Santos',week:1,day:'Lunes',time:'8:00 a 9:30'},
    {area:'Matemática',title:'Registramos datos en gráficos',week:1,day:'Martes',time:'8:00 a 9:30'},
    {area:'Personal Social',title:'Comparamos cambios y permanencias',week:2,day:'Lunes',time:'8:00 a 9:30'},
    {area:'Ciencia y Tecnología',title:'Indagamos cambios en la masa',week:3,day:'Lunes',time:'8:00 a 9:30'}
  ]
};
const window={
 unitWordHtml:()=>'<p>antiguo documento</p>',renderUnitOutput:()=>{},
 DD_OFFICIAL_CURRICULUM:{pickCompetence:(level,area,title)=>({name:({
  'Comunicación':'Lee diversos tipos de textos escritos en su lengua materna',
  'Matemática':'Resuelve problemas de gestión de datos e incertidumbre',
  'Personal Social':'Construye interpretaciones históricas',
  'Ciencia y Tecnología':'Indaga mediante métodos científicos para construir sus conocimientos'
})[area]||'Competencia por revisar'})}
};
const ctx=createContext({window,document:fake});
runInContext(source,ctx);
assert.equal(window.__ddUnitExportQualityV11,true);
if(process.env.DD_STRESS45){
  const seed=[...unit.activities];unit.activities=[];
  const areas=['Comunicación','Matemática','Personal Social','Ciencia y Tecnología'];
  for(let week=1;week<=3;week++)for(let d=0;d<5;d++)for(let block=1;block<=3;block++){
    const template=seed[unit.activities.length%seed.length];
    unit.activities.push({...template,area:areas[unit.activities.length%4],week,day:['Lunes','Martes','Miércoles','Jueves','Viernes'][d],block,time:['8:00 a 9:30','9:45 a 11:15','11:30 a 13:00'][block-1]});
  }
}
const html=window.unitWordHtml(unit);
if(process.env.DD_DUMP_HTML)writeFileSync(process.env.DD_DUMP_HTML,html,'utf8');
assert.ok(html.includes('Galería Guiada de la Memoria'));
assert.ok(!html.includes('Un hecho relacionado con'));
assert.equal((html.match(/<h3>Semana \d/g)||[]).length,3);
assert.ok(html.includes('Criterios orientadores por grado'));
for(const g of unit.grades)assert.ok(html.includes(`<b>${g}:</b>`));
for(const block of ['III. PROPÓSITOS','IV. RUTA','V. SECUENCIA','VI. EVALUACIÓN','VII. ASPECTOS'])assert.ok(html.includes(block));
assert.ok(!html.includes('antiguo documento'));
const criteria=window.DD_UNIT_EXPORT_QUALITY_V11;
assert.match(criteria.gradeAction('Comunicación','Escribimos rótulos', '3.º'),/escribe/);
assert.match(criteria.gradeAction('Comunicación','Leemos textos', '5.º'),/Contrasta/);
assert.match(criteria.gradeAction('Matemática','Registramos datos en gráficos', '1.º'),/pictograma/);
assert.match(criteria.gradeAction('Ciencia y Tecnología','Indagamos cambios de la masa','5.º'),/variables/);
assert.match(criteria.gradeAction('Personal Social','Comparamos cambios y permanencias','3.º'),/hechos/);
window.renderUnitOutput(unit);
assert.ok(rendered.includes('Semana 3'));
assert.ok(rendered.includes('Criterio / acción por grado'));
const historical={level:'Secundaria',title:'Otra unidad'};
assert.equal(window.unitWordHtml(historical),'<p>antiguo documento</p>');
console.log('PASS: Fase 11 conserva situación y producto, secuencia por semanas, criterios por grado, otras etapas sin cambios');
