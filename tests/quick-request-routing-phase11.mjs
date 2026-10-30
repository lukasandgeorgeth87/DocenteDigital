import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

// Reproduce the teacher's actual home input without depending on Playwright.
const src=readFileSync(new URL('../format-v2.js',import.meta.url),'utf8');
const routes=[];
const setup=[];
const state={teacherName:'',schoolName:'',units:[],level:'Primaria',ieType:'Unidocente',grades:['1.º','3.º','5.º'],areas:['Comunicación','Matemática','Personal Social','Ciencia y Tecnología']};
const input={value:''};
const duration={value:'1 semana',options:Array.from({length:6},(_,i)=>({value:`${i+1} semana${i?'s':''}`}))};
const type={value:'Unidad de aprendizaje'};
const situation={value:''};
const run={onclick:null};
const grid={prepend(){}};
const lookup={home:{querySelector:selector=>selector==='.grid'?grid:null},ddQuickInput:input,ddQuickGo:run,unitDuration:duration,unitType:type,unitSituation:situation};
const window={createUnitDemo(){},unitWordHtml:()=>'',renderUnitOutput(){}};
const context={window,state,byId:id=>lookup[id]||null,go:id=>routes.push(id),showUnit:()=>setup.push('opened'),escapeHtml:value=>String(value??''),document:{createElement:()=>({}),head:{appendChild(){}}},alert(){},console};
runInNewContext(src,context,{filename:'format-v2.js'});
assert.equal(typeof run.onclick,'function');
assert.equal(typeof window.ddQuickRequestKind,'function');
window.ddSuggestTitles=()=>{};
function check(text,expected){routes.length=0;setup.length=0;input.value=text;run.onclick();assert.equal(routes[0],expected,text);assert.equal(setup.length,expected==='plan'?1:0,text);}
const actual='Quiero crear una unidad de aprendizaje de 3 semanas para 1.º, 3.º y 5.º de Primaria sobre las costumbres de Todos los Santos en nuestra comunidad. Trabajaremos Comunicación, Matemática, Personal Social y Ciencia y Tecnología. El producto final será una «Galería Guiada de la Memoria». Incluye actividades, criterios de evaluación y evidencias diferenciadas por grado, con una secuencia progresiva de sesiones.';
check(actual,'plan');
assert.equal(duration.value,'3 semanas');
assert.equal(type.value,'Unidad de aprendizaje');
assert.ok(situation.value.includes('Galería Guiada de la Memoria'));
assert.ok(situation.value.includes('Comunicación, Matemática, Personal Social y Ciencia y Tecnología'));
assert.deepEqual(state.grades,['1.º','3.º','5.º']);
check('Necesito una sesión de aprendizaje de Matemática para la unidad de Todos los Santos','session');
check('Quiero un proyecto de aprendizaje de 2 semanas con varias sesiones','plan');
assert.equal(type.value,'Proyecto de aprendizaje');
assert.equal(duration.value,'2 semanas');
check('Necesito una rúbrica para evaluar las sesiones de la unidad','evaluation');
check('Elabora un acta para el director','director');
check('Quiero una unidad sobre la siembra de mi localidad','plan');
check('Quiero una sesión de Comunicación','session');
console.log('PASS: petición real de 3 semanas va a unidad, conserva duración, producto, grados y áreas; otras intenciones siguen su ruta');
