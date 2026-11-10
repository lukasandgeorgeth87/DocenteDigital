// Fase 27: descriptores observables diferentes, sin presentarlos como desempeños oficiales.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const src=readFileSync(new URL('../unit-export-quality-v11.js',import.meta.url),'utf8');
const env={window:{
 unitWordHtml:()=>'<p>anterior</p>',
 DD_OFFICIAL_CURRICULUM:{
   pickCompetence(_level,area){return area==='Comunicación'?{name:'Se comunica oralmente en su lengua materna'}:null},
   getArea(){return []}
 }
}};
runInNewContext(src,env);
const q=env.window.DD_UNIT_EXPORT_QUALITY_V11;
const samples=[
 {area:'Comunicación',competence:'Se comunica oralmente en su lengua materna',activity:'Dialogamos sobre los derechos'},
 {area:'Comunicación',competence:'Lee diversos tipos de textos escritos en su lengua materna',activity:'Leemos relatos'},
 {area:'Comunicación',competence:'Escribe diversos tipos de textos',activity:'Redactamos mensajes'},
 {area:'Matemática',competence:'Resuelve problemas de gestión de datos e incertidumbre',activity:'Planteamos preguntas estadísticas'},
 {area:'Personal Social',competence:'Convive y participa democráticamente en la búsqueda del bien común',activity:'Deliberamos sobre derechos'},
 {area:'Ciencia y Tecnología',competence:'Indaga mediante métodos científicos para construir sus conocimientos',activity:'Formulamos preguntas investigables'},
 {area:'Arte y Cultura',competence:'Aprecia de manera crítica manifestaciones artístico-culturales',activity:'Exploramos manifestaciones'},
 {area:'Educación Física',competence:'Se desenvuelve de manera autónoma a través de su motricidad',activity:'Retos motrices'},
 {area:'Educación Religiosa',competence:'Construye su identidad como persona humana',activity:'Reflexionamos sobre el respeto'}
];
for(const sample of samples){
 const v=q.instrumentLevels(sample);
 for(const level of ['C','B','A','AD'])assert(v[level]&&v[level].length>35,sample.area+' '+level);
 assert.equal(new Set(Object.values(v)).size,4,'Los cuatro niveles deben ser diferentes: '+sample.area);
 assert(!Object.values(v).some(x=>/requiere ayuda para mostrar los elementos del criterio|muestra algunos elementos con apoyo/i.test(x)),'No conservar los descriptores vacíos anteriores');
}
assert.match(q.instrumentLevels(samples[0]).A,/razones pertinentes/);
assert.match(q.instrumentLevels(samples[3]).A,/variables pertinentes/);
assert.match(q.instrumentLevels(samples[4]).A,/bien común/);
assert.match(q.instrumentLevels(samples[7]).A,/movimientos/);
const word=q.word({title:'Derechos',level:'Primaria',type:'Unidad de aprendizaje',grades:['6.º'],areas:['Comunicación'],
 duration:'3 semanas',ieType:'Polidocente',situation:'Analizamos historias ficticias sobre derechos.',
 reto:'¿Cómo protegemos nuestros derechos?',product:'Expo interactiva',
 activities:[{area:'Comunicación',week:1,day:'Lunes',title:'Dialogamos sobre los derechos'}],
 purposes:[],documentContextSnapshot:{}});
assert.match(word,/C – Inicio:/);
assert.match(word,/razones pertinentes/);
assert.doesNotMatch(word,/requiere ayuda para mostrar los elementos del criterio/);
// Regresión multigrado: diferenciación de criterios y descriptores.
const early=q.instrumentLevels({area:'Comunicación',competence:'Se comunica oralmente en su lengua materna',
 activity:'Dialogamos',grade:'1.º',criterion:'1.º: Comunica ideas sencillas sobre sus derechos.'});
assert.match(early.A,/Comunica ideas sencillas/);
assert.doesNotMatch(early.A,/razones pertinentes/);
const middle=q.instrumentLevels({area:'Matemática',competence:'Resuelve problemas de gestión de datos e incertidumbre',
 activity:'Representamos datos',grade:'3.º',criterion:'3.º: Registra datos en una tabla y compara frecuencias.'});
assert.match(middle.A,/Registra datos en una tabla/);
const multi=q.word({title:'Convivimos',level:'Primaria',type:'Unidad de aprendizaje',grades:['1.º','3.º','5.º'],
 areas:['Comunicación'],duration:'3 semanas',ieType:'Multigrado',
 situation:'Analizamos relatos ficticios de derechos.',reto:'¿Cómo dialogamos con respeto?',
 product:'Mural',activities:[{area:'Comunicación',week:1,day:'Lunes',title:'Dialogamos sobre nuestros derechos'}],
 purposes:[],documentContextSnapshot:{}});
for(const grade of ['1.º','3.º','5.º'])assert(multi.includes('Grado: '+grade),'Debe aparecer su instrumento: '+grade);
console.log('PASS v27: instrumentos por competencia y grado, también multigrado');
