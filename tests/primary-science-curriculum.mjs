import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createContext,runInContext} from 'node:vm';
const source=file=>readFileSync(new URL(`../${file}`,import.meta.url),'utf8');
const window={};
const state={level:'Primaria',units:[],curriculumMatrixReady:true};
const ctx=createContext({window,state,document:{readyState:'complete',getElementById:()=>null}});
runInContext(source('official-curriculum-v1.js'),ctx);
runInContext(source('primary-science-source-pages-v8.js'),ctx);
const core=window.DD_OFFICIAL_CURRICULUM;
const refs=window.DD_PRIMARY_SCIENCE_PAGES;
const expected={
  indaga:{name:'Indaga mediante métodos científicos para construir sus conocimientos',capacities:5,III:[278,279],IV:[280,281],V:[282,283]},
  explica:{name:'Explica el mundo físico basándose en conocimientos sobre los seres vivos, materia y energía, biodiversidad, Tierra y universo',capacities:2,III:[288,289],IV:[290,291],V:[292,293]},
  disena:{name:'Diseña y construye soluciones tecnológicas para resolver problemas de su entorno',capacities:4,III:[298,299],IV:[300,301],V:[302,304]}
};
const entries=core.getArea('Primaria','Ciencia y Tecnología');
assert.equal(entries.length,3);
assert.deepEqual([...entries.map(x=>x.capacities.length)],[5,2,4]);
assert.equal(refs.source.attachedPdfPageCount,396);
assert.equal(refs.source.attachedPdfSha256,'34009689b6e3fe2194ec61c1675af13407528ae5e0f34f4d484007efd9e832f7');
let checked=0;
for(const [mode,info] of Object.entries(expected)){
  assert.ok(entries.some(c=>c.name===info.name&&c.capacities.length===info.capacities));
  for(const grade of ['1.º','2.º','3.º','4.º','5.º','6.º']){
    const ref=refs.forGrade(mode,grade);
    assert.equal(ref.competence,info.name);
    const [first,last]=info[ref.cycle];
    assert.equal(ref.standardPdfPage,first);
    assert.equal(ref.performancePdfPages[0],first);
    assert.equal(ref.performancePdfPages.at(-1),last);
    assert.equal(ref.literalPerformanceIncluded,false);
    assert.equal(ref.teacherVerificationRequired,true);
    checked++;
  }
}
const titles=[
  ['Indagamos cómo cambia la masa con levadura','indaga'],
  ['Observamos el crecimiento de las semillas','indaga'],
  ['Experimentamos con agua y tierra','indaga'],
  ['Investigamos por qué germinan las semillas','indaga'],
  ['Explicamos cómo actúa la levadura en la masa','explica'],
  ['Explicamos el ciclo del agua con evidencias','explica'],
  ['Construimos una explicación científica sobre la fermentación','explica'],
  ['Diseñamos un filtro de agua','disena'],
  ['Construimos un horno solar para aprovechar el calor','disena'],
  ['Fabricamos un prototipo para regar el biohuerto','disena']
];
for(const [title,mode] of titles){
  assert.equal(core.scienceModeFromTitle(title),mode,`Título: ${title}`);
  assert.equal(core.pickCompetence('Primaria','Ciencia y Tecnología',title).name,expected[mode].name);
}
for(const title of ['Conocemos nuestro entorno','Comparamos nuestras ideas','Mejoramos las ideas sobre la vida']){
  assert.equal(core.scienceModeFromTitle(title),'indefinido',`Debe pedir confirmación: ${title}`);
}
const selected=refs.forSession({level:'Primaria',area:'Ciencia y Tecnología',title:'Diseñamos un filtro de agua',grades:['2.º','4.º','6.º']});
assert.deepEqual([...selected.map(x=>x.cycle)],['III','IV','V']);
assert.deepEqual([...selected.map(x=>x.standardPdfPage)],[298,300,302]);
assert.equal(refs.forSession({level:'Primaria',area:'Comunicación',title:'Diseñamos un filtro',grades:['3.º']}).length,0);
assert.equal(refs.forSession({level:'Inicial',area:'Ciencia y Tecnología',title:'Diseñamos un filtro',grades:['5 años']}).length,0);
assert.equal(refs.forSession({level:'Primaria',area:'Ciencia y Tecnología',title:'Conocemos nuestro entorno',grades:['3.º']}).length,0);

// Usar la capa de sesión REAL sobre un renderizador mínimo para comprobar que
// los criterios, momentos y referencias llegan a HTML tanto para pantalla como Word.
window.escapeHtml=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
window.sessionHtml=()=>'<h2>5. PREPARACIÓN DE LA SESIÓN</h2><p>original</p><h2>6. MOMENTOS DE LA SESIÓN</h2><p>original</p><h2>8. RECURSOS</h2><p>anexo existente</p>';
runInContext(source('session-teaching-sequence-v3.js'),ctx);
const sequence=window.ddSessionTeachingSequenceV3;
assert.ok(sequence,'Secuencia didáctica real cargada');
for(const [title,mode,unique] of [
  ['Indagamos cómo cambia la masa con levadura','indaga','Problematizar'],
  ['Explicamos cómo actúa la levadura en la masa','explica','Buscar y comprender información científica'],
  ['Diseñamos un filtro de agua','disena','Identificar el problema tecnológico']
]){
  const s={level:'Primaria',area:'Ciencia y Tecnología',title,grades:['1.º','3.º','6.º'],ieType:'Multigrado',criterion:'Criterio docente editado.',brief:'Actividad con datos reales del contexto',times:{start:15,dev:60,close:15}};
  const html=window.sessionHtml(s,true);
  assert.match(html,new RegExp(unique));
  assert.match(html, new RegExp(expected[mode].name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  assert.match(html,/Ubicación de estándares y desempeños en el PDF oficial/);
  assert.match(html,/Ciclo III/);
  assert.match(html,/Ciclo IV/);
  assert.match(html,/Ciclo V/);
  assert.match(html,/anexo existente/);
  assert.match(html,/NO desempeños oficiales literales/);
  assert.match(sequence.gradeCriterion(s,'1.º'),/Ajuste sugerido para 1.º/);
  assert.match(sequence.gradeCriterion(s,'3.º'),/Ajuste sugerido para 3.º/);
  assert.match(sequence.gradeCriterion(s,'6.º'),/Ajuste sugerido para 6.º/);
  assert.notEqual(sequence.gradeTask(s,'1.º').task,sequence.gradeTask(s,'6.º').task);
  assert.notEqual(sequence.gradeCriterion(s,'1.º'),sequence.gradeCriterion(s,'6.º'));
}
const undecided={level:'Primaria',area:'Ciencia y Tecnología',title:'Conocemos nuestro entorno',grades:['4.º'],times:{start:10,dev:30,close:5}};
const htmlUndecided=window.sessionHtml(undecided,true);
assert.match(htmlUndecided,/Competencia por confirmar/);
assert.doesNotMatch(htmlUndecided,/Ubicación de estándares y desempeños en el PDF oficial/);
assert.match(sequence.gradeCriterion(undecided,'4.º'),/Criterio por confirmar/);
assert.ok(core.getArea('Inicial','Ciencia y Tecnología').length);
assert.ok(core.getArea('Secundaria','Ciencia y Tecnología').length);
console.log(`PRIMARY_SCIENCE_CURRICULUM_PASS: 3 competencias, 11 capacidades, ${checked} grados-referencias, ${titles.length} títulos y 3 sesiones multigrado/Word`);
