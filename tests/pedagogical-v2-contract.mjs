// Motor pedagógico V2 — contrato contra títulos incoherentes, repetidos y criterios genéricos.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const src=name=>readFileSync(new URL('../'+name,import.meta.url),'utf8');
const curriculumSource=src('official-curriculum-v1.js');
const root={};
const ctx=vm.createContext({window:root,console});
vm.runInContext(src('pedagogical-engine-v2-data.js'),ctx);
const data=root.DD_PED_V2_CATALOG;
assert(data,'Falta catálogo V2');
const names=Object.values(data.competences);
for(const name of names)assert(curriculumSource.includes(name),'Competencia no localizada literalmente en fuente oficial del proyecto: '+name);
root.DD_OFFICIAL_CURRICULUM={getArea(level,area){
 if(level!=='Primaria'||!data.routes[area])return[];
 const keys=[...new Set(data.routes[area].flat().map(x=>x[6]))];
 return keys.map(k=>({name:data.competences[k],capacities:['Capacidad verificada en fuente']}));
}};
root.state={units:[]};let saves=0;root.save=()=>{saves++;return true;};
vm.runInContext(src('pedagogical-engine-v2.js'),ctx);
const api=root.DDPedagogicalV2;
assert(api&&api.version==='2.0.0-rights-grade2');
const days=['Lunes','Martes','Miércoles','Jueves','Viernes'];
const areas=['Comunicación','Personal Social','Matemática','Comunicación','Ciencia y Tecnología',
 'Matemática','Personal Social','Arte y Cultura','Educación Física','Educación Religiosa'];
const activities=[];
for(let w=1;w<=3;w++)for(let i=0;i<10;i++)activities.push({
 kind:'sesion',area:areas[i],title:'Título genérico repetido '+i,
 week:w,day:days[Math.floor(i/2)],block:i%2+1,
 time:i%2?'9:45-10:30':'8:00-8:45',order:activities.length+1
});
const unit={id:'test-u2',level:'Primaria',ieType:'Polidocente',grades:['2.º'],
 duration:'3 semanas',type:'Unidad de aprendizaje',
 title:'Conocemos y hacemos respetar nuestros derechos',
 situationBrief:'Los derechos',situation:'En nuestra comunidad, En una actividad de aula...',
 reto:'¿Qué derechos conocemos?',product:'Guía ilustrada de nuestros derechos',
 productTitle:'Guía ilustrada de nuestros derechos',
 selectedSituationSource:'B',selectedProductKey:'3',selectionApproved:true,
 approvedSelectionSnapshot:{productTitle:'Guía ilustrada de nuestros derechos',situationText:'Situación anterior'},
 activities,documentContextSnapshot:{institution:'IE de prueba',teacher:'Docente de prueba'}};
root.state.units.push(unit);
assert.equal(api.eligible(unit),true);
const design=api.design(unit);
assert.equal(design.ok,true,JSON.stringify(design));
assert.equal(design.activities.length,30);
assert.equal(design.product,unit.product);
assert.equal(design.coverage.sessions,30);
assert.equal(design.coverage.areas.length,7);
assert.equal(new Set(design.activities.map(a=>a.title)).size,30);
assert(design.activities.every(a=>a.evidence.length>23&&a.criterion.length>28&&a.studentAction.length>65));
assert(design.activities.every(a=>a.v2Plan.capacities.length>0),'Competencia sin capacidades');
assert(!design.activities.some(a=>/se propone desarrollar|el docente podrá completar|actividades vinculadas|sobre sobre/i.test(a.title)));
assert(design.situation.length>450&&design.situation.includes('historietas ficticias'));
assert(design.situation.includes(unit.product.toLowerCase()));
assert(!design.situation.includes('En nuestra comunidad, En una actividad de aula'));
assert(design.activities[0].title.includes('viñetas'));
assert(design.activities.some(a=>a.area==='Matemática'&&a.v2Plan.kind==='data'&&/vot[ao]|marcas/.test(a.studentAction)));
assert(design.activities.some(a=>a.area==='Ciencia y Tecnología'&&/no se pudo comprobar|no se pudo|límites|microbios/.test(a.title+' '+a.studentAction+' '+a.evidence)));
assert(!design.activities.some(a=>/24 tarjetas entre 6/.test(a.studentAction)), 'Evitar división formal no requerida');
for(let w=1;w<=3;w++){
 const week=design.activities.filter(a=>a.week===w);
 assert.equal(week.length,10);
 for(const day of days)assert.equal(week.filter(a=>a.day===day).length,2);
}
for(let i=0;i<activities.length;i++){
 assert.equal(design.activities[i].time,activities[i].time);
 assert.equal(design.activities[i].day,activities[i].day);
 assert.equal(design.activities[i].area,activities[i].area);
}
assert.equal(unit.activities[0].title,'Título genérico repetido 0','La vista previa no muta la unidad');
assert.equal(saves,0,'Proponer no guarda datos');
assert.throws(()=>api.apply(unit,{ok:false}),/incompatible/);
api.apply(unit,design);
assert.equal(saves,1);
assert.equal(unit.title,'Conocemos y hacemos respetar nuestros derechos');
assert.equal(unit.activities.length,30);
assert.equal(unit.pedagogicalV2.approved,true);
assert.equal(unit.product,'Guía ilustrada de nuestros derechos');
assert.equal(unit.approvedSelectionSnapshot.productTitle,unit.product);
assert.equal(unit.selectedSituationSource,'Docente');
const word=api.unitHtml(unit);
assert(word.includes('UNIDAD DE APRENDIZAJE'));
assert(word.includes('SITUACIÓN SIGNIFICATIVA'));
assert(word.includes('MATRIZ CURRICULAR'));
assert(word.includes('EVALUACIÓN FORMATIVA'));
assert(word.includes('Guía ilustrada de nuestros derechos'));
for(const a of unit.activities)assert(word.includes(a.title),'Título ausente del Word: '+a.title);
const math=unit.activities.find(a=>a.area==='Matemática');
const physical=unit.activities.find(a=>a.area==='Ciencia y Tecnología');
const civic=unit.activities.find(a=>a.area==='Personal Social');
for(const a of [math,physical,civic]){
 const s={title:a.title,unitTitle:unit.title,area:a.area,grades:['2.º'],
  pedagogicalV2:api.sessionDetails({},unit,a),
  criterion:a.criterion,evidence:a.evidence,purpose:'Hoy aprendemos mediante una tarea concreta',
  duration:'40 minutos',times:{start:10,dev:20,close:10},instrument:'Lista de cotejo'};
 assert(s.pedagogicalV2);
 const html=api.sessionHtmlV2(s);
 assert(html.includes(a.title)&&html.includes(a.criterion));
 assert(html.includes(a.evidence));
 assert(html.includes(a.v2Plan.question));
 assert(html.includes('INICIO')===false||html.includes('Inicio'));
 assert(html.includes('10 min')&&html.includes('20 min'));
 if(a.area==='Matemática'){
  assert.equal(s.pedagogicalV2.steps.length,5);
  assert(s.pedagogicalV2.steps[0][0].includes('Familiarización'));
  assert(html.includes('Planteamiento de otros problemas'));
 }
 if(a.area==='Personal Social')assert(s.pedagogicalV2.steps.some(x=>x[0]==='Toma de decisiones'));
 if(a.area==='Ciencia y Tecnología')assert(s.pedagogicalV2.steps.some(x=>x[0]==='Conclusión y límites'));
}
assert.equal(api.restore(unit),true);
assert.equal(unit.activities[0].title,'Título genérico repetido 0');
assert.equal(unit.pedagogicalV2,undefined);
assert.equal(unit.product,'Guía ilustrada de nuestros derechos');
assert.equal(saves,2);
const missing=api.design({...unit,activities:unit.activities.slice(0,12)});
assert.equal(missing.ok,false);
assert.match(missing.reason,/30/);
assert.equal(api.design({...unit,grades:['3.º']}).ok,false);
assert.equal(api.design({...unit,duration:'2 semanas'}).ok,false);
const badArea=[...activities];badArea[0]={...badArea[0],area:'Área desconocida'};
assert.equal(api.design({...unit,activities:badArea}).ok,false);
const shortSchedule=activities.map((a,i)=>i===5?{...a,day:'Sábado'}:a);
assert.equal(api.design({...unit,activities:shortSchedule}).ok,false);
const tested=src('pedagogical-engine-v2.js');
assert(!/(?:fetch\s*\(|XMLHttpRequest|OPENAI_API_KEY|DD_AI_PAID_CALLS_ENABLED)/.test(tested));
assert(src('index.html').includes('src="pedagogical-engine-v2-data.js"'));
assert(src('index.html').includes('src="pedagogical-engine-v2.js"'));
console.log('PASS V2: 30 sesiones no repetidas, competencias cotejadas, actividades/evidencias/criterios, Word, restauración y sin GPT');
