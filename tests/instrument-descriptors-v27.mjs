// Fase 27: descriptores observables diferentes, sin presentarlos como desempeños oficiales.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const src=readFileSync(new URL('../unit-export-quality-v11.js',import.meta.url),'utf8');
const env={window:{unitWordHtml:()=>'<p>anterior</p>'}};
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
console.log('PASS v27: instrumentos por competencia con cuatro niveles observables');
