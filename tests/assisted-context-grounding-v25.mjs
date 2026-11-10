// Fase 25: no insertar instrucciones administrativas como situación significativa.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const src=read('app.js');
const start=src.indexOf('function ddAssistPlanningContext(apply=true){');
const end=src.indexOf('function refreshUnitTitleSuggestions(){',start);
assert(start>=0&&end>start,'Debe existir ayuda contextual');
function make(title){
 const textarea={value:'',dataset:{},dispatchEvent(){},parentElement:{appendChild(){}}};
 const titleEl={value:title};
 const state={level:'Primaria',grades:['6.º'],areas:['Comunicación','Personal Social'],teacherContext:{}};
 const byId=id=>id==='unitSituation'?textarea:id==='unitTitle'?titleEl:null;
 const env={state,byId,window:{},document:{getElementById(){return null},createElement(){return {}}},Event:class{}};
 runInNewContext(src.slice(start,end),env);
 return {text:env.ddAssistPlanningContext(false),textarea,env};
}
const rights=make('Descubrimos los derechos a partir de preguntas y evidencias');
assert.match(rights.text,/derechos de las niñas y los niños/);
assert.match(rights.text,/historietas ficticias/);
assert.match(rights.text,/6.º/);
assert.doesNotMatch(rights.text,/se propone desarrollar|el docente podrá completar|interpretación preliminar|contextualización/i);
assert.doesNotMatch(rights.text,/las familias vulneran|los estudiantes sufren vulneraciones/i);
const water=make('El uso responsable del agua');
assert.match(water.text,/agua/);
assert.match(water.text,/relatos ficticios|datos de ejemplo/);
assert.doesNotMatch(water.text,/se propone desarrollar|el docente podrá completar/i);
const manual=make('Nuestros derechos');
manual.textarea.value='Los estudiantes preguntan por los derechos y las responsabilidades en el aula.';
assert.equal(manual.env.ddAssistPlanningContext(false),manual.textarea.value,'El contexto del docente prevalece');
const proposal=read('proposal-choice-v8.js');
const a=proposal.indexOf('  function shortFocus(m,raw){');
const b=proposal.indexOf('  function placeFor(m){',a);
assert(a>=0&&b>a);
const sandbox={window:{ddContextTopic:()=> 'en una actividad de aula'},
 tidy:s=>String(s||'').replace(/\s+/g,' ').trim(),
 document:{getElementById(id){return id==='unitTitle'?{value:'Descubrimos los derechos a partir de preguntas y evidencias'}:null}}};
runInNewContext(proposal.slice(a,b)+'\nthis.topic=shortFocus;',sandbox);
assert.equal(sandbox.topic({focus:'en una actividad de aula'},rights.text),'los derechos de la niñez');
console.log('PASS v25: contexto asistido sin metainstrucciones ni hechos locales inventados');
