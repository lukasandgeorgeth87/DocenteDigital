import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createContext,runInContext} from 'node:vm';
const source=name=>readFileSync(new URL(`../${name}`,import.meta.url),'utf8');
const window={};
const state={level:'Primaria',units:[],curriculumMatrixReady:true};
const ctx=createContext({window,state,document:{readyState:'complete',getElementById:()=>null}});
runInContext(source('official-curriculum-v1.js'),ctx);
runInContext(source('primary-personal-social-source-pages-v9.js'),ctx);
const core=window.DD_OFFICIAL_CURRICULUM;
const refs=window.DD_PRIMARY_PERSONAL_SOCIAL_PAGES;
const expectations={
  identidad:{name:'Construye su identidad',count:4,grades:[[78,79],[80,80],[81,82]]},
  convivencia:{name:'Convive y participa democráticamente en la búsqueda del bien común',count:5,grades:[[86,86],[87,88],[89,90]]},
  historia:{name:'Construye interpretaciones históricas',count:3,grades:[[94,94],[95,95],[96,96]]},
  ambiente:{name:'Gestiona responsablemente el espacio y el ambiente',count:3,grades:[[100,100],[101,101],[102,103]]},
  economia:{name:'Gestiona responsablemente los recursos económicos',count:2,grades:[[108,108],[109,109],[110,110]]}
};
const competencies=core.getArea('Primaria','Personal Social');
assert.equal(competencies.length,5);
assert.deepEqual([...competencies.map(c=>c.capacities.length)],[4,5,3,3,2]);
assert.equal(refs.source.attachedPdfPageCount,396);
assert.equal(refs.source.attachedPdfSha256,'34009689b6e3fe2194ec61c1675af13407528ae5e0f34f4d484007efd9e832f7');
let count=0;
for(const [mode,info] of Object.entries(expectations)){
  assert.ok(competencies.some(c=>c.name===info.name&&c.capacities.length===info.count));
  for(let n=1;n<=6;n++){
    const r=refs.forGrade(mode,`${n}.º`),ix=Math.floor((n-1)/2);
    assert.equal(r.competence,info.name);
    assert.equal(r.standardPdfPage,info.grades[ix][0]);
    assert.equal(r.performancePdfPages[0],info.grades[ix][1]);
    assert.equal(r.literalPerformanceIncluded,false);
    assert.equal(r.teacherVerificationRequired,true);
    count++;
  }
}
for(const [title,mode] of [
  ['Reconocemos nuestras emociones','identidad'],
  ['Valoramos nuestras cualidades personales','identidad'],
  ['Acordamos normas para convivir en el aula','convivencia'],
  ['Deliberamos sobre un asunto público','convivencia'],
  ['Comparamos los altares de antes y ahora','historia'],
  ['Reconocemos cambios y permanencias en los panes de Todos los Santos','historia'],
  ['Elaboramos un croquis de las zonas de riesgo','ambiente'],
  ['Cuidamos el ambiente de nuestra comunidad','ambiente'],
  ['Elaboramos un presupuesto para la feria escolar','economia'],
  ['Decidimos cómo ahorrar para el biohuerto','economia'],
]){
  assert.equal(core.personalSocialModeFromTitle(title),mode,title);
  assert.equal(core.pickCompetence('Primaria','Personal Social',title).name,expectations[mode].name,title);
}
for(const title of ['Conocemos nuestra comunidad','Compartimos tradiciones familiares','Valoramos nuestras costumbres']){
  assert.equal(core.personalSocialModeFromTitle(title),'indefinido',title);
}
assert.equal(core.personalSocialModeFromTitle('Acordamos normas y elaboramos un presupuesto'),'indefinido');
const cases=[
  ['Reconocemos nuestras emociones','identidad','Reconocer la situación personal'],
  ['Acordamos normas para convivir','convivencia','Problematizar una situación de convivencia'],
  ['Comparamos el altar de antes y ahora','historia','Presentar un problema histórico'],
  ['Elaboramos un croquis de zonas de riesgo','ambiente','Reconocer un problema del espacio geográfico'],
  ['Elaboramos un presupuesto para la feria','economia','Identificar una decisión económica']
];
window.escapeHtml=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
window.sessionHtml=()=>'<h2>5. PREPARACIÓN DE LA SESIÓN</h2><p>base</p><h2>6. MOMENTOS DE LA SESIÓN</h2><p>base</p><h2>8. RECURSOS</h2><p>anexo original</p>';
runInContext(source('session-teaching-sequence-v3.js'),ctx);
const teaching=window.ddSessionTeachingSequenceV3;
for(const [title,mode,phrase] of cases){
  const s={level:'Primaria',area:'Personal Social',title,grades:['2.º','4.º','6.º'],ieType:'Multigrado',criterion:'Criterio editable',times:{start:15,dev:60,close:15}};
  const html=window.sessionHtml(s,true);
  assert.match(html,new RegExp(phrase),title);
  assert.ok(html.includes(expectations[mode].name),title);
  assert.match(html,/Capacidades del programa/);
  assert.match(html,/Referencia curricular — Personal Social/);
  assert.match(html,/Ubicación de estándares y desempeños en el PDF oficial/);
  assert.match(html,/Ciclo III/);assert.match(html,/Ciclo IV/);assert.match(html,/Ciclo V/);
  assert.match(html,/anexo original/);
  assert.match(html,/NO desempeños oficiales literales/);
  assert.notEqual(teaching.gradeTask(s,'2.º').task,teaching.gradeTask(s,'4.º').task);
  assert.notEqual(teaching.gradeTask(s,'4.º').task,teaching.gradeTask(s,'6.º').task);
  assert.match(teaching.gradeCriterion(s,'6.º'),/Ajuste sugerido para 6.º/);
  assert.equal(refs.forSession(s).length,3);
}
const ambiguous={level:'Primaria',area:'Personal Social',title:'Conocemos nuestra comunidad',grades:['3.º'],times:{start:15,dev:60,close:15}};
const htmlAmbiguous=window.sessionHtml(ambiguous,true);
assert.match(htmlAmbiguous,/Competencia por confirmar/);
assert.doesNotMatch(htmlAmbiguous,/Ubicación de estándares y desempeños en el PDF oficial/);
assert.match(teaching.gradeCriterion(ambiguous,'3.º'),/Criterio por confirmar/);
assert.equal(refs.forSession(ambiguous).length,0);
assert.equal(refs.forSession({level:'Inicial',area:'Personal Social',title:'Acordamos normas',grades:['5 años']}).length,0);
assert.equal(refs.forSession({level:'Secundaria',area:'Personal Social',title:'Acordamos normas',grades:['4.º']}).length,0);
assert.equal(refs.forSession({level:'Primaria',area:'Matemática',title:'Acordamos normas',grades:['3.º']}).length,0);
// Verificación directa de propósito, criterio y evidencia de la capa pedagógica.
runInContext(source('session-learning-core-v54.js'),ctx);
const learning=window.ddSessionLearningCore;
for(const [title,mode] of cases){
  const p=learning.purposeParts('Personal Social',title,'el reto del aula','Primaria');
  const c=learning.criterionForSession('Personal Social',title,'el reto del aula',null,'Primaria');
  const e=learning.evidenceForSession('Personal Social',title,'el reto del aula',null,'Primaria');
  assert.ok(p.what&&p.how&&p.forWhat&&c&&e,mode);
  assert.ok(!/Evidencia por definir/.test(e),mode);
}
assert.match(learning.criterionForSession('Personal Social','Conocemos nuestra comunidad','entorno',null,'Primaria'),/Criterio por confirmar/);
assert.ok(core.getArea('Inicial','Personal Social').length>0);
assert.ok(core.getArea('Secundaria','Ciencias Sociales').length>0);
console.log(`PRIMARY_PERSONAL_SOCIAL_CURRICULUM_PASS: cinco competencias, 17 capacidades, ${count} referencias por grado, 5 sesiones multigrado/Word y 5 cadenas de propósito-criterio-evidencia`);
