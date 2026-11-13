// Integration contract: V2 provides curated content, V3 is the single approval/export gate.
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const read=x=>readFileSync(new URL('../'+x,import.meta.url),'utf8');
const root={},ctx=vm.createContext({window:root,console});
vm.runInContext(read('pedagogical-engine-v2-data.js'),ctx);
const catalog=root.DD_PED_V2_CATALOG;
root.DD_OFFICIAL_CURRICULUM={
 getArea(level,area){return level==='Primaria'?[...new Set(catalog.routes[area]?.flat().map(a=>a[6])||[])]
  .map(k=>({name:catalog.competences[k],capacities:['Capacidad curricular de prueba']})):[];},
 sourceFor(){return {title:'Programa curricular de Primaria'};}
};
root.state={units:[],lastSession:null};let saves=0;root.save=()=>{saves++;return true;};
root.unitWordHtml=u=>'<p>Exportador histórico: '+u.title+'</p>';
root.sessionHtml=s=>'<p>Sesión histórica: '+s.title+'</p>';
root.buildSession=()=>{
 const u=root.state.units[0],a=u.activities[0];
 const session={id:'test-session',unitId:u.id,unitTitle:u.title,activityIndex:0,
  title:a.title,area:a.area,grades:[...u.grades],duration:'40 minutos',times:{start:10,dev:20,close:10},
  instrument:'Lista de cotejo',criterion:a.criterion,evidence:a.evidence,
  purpose:'Redacción histórica',resources:'Materiales reales'};
 root.state.lastSession=session;root.save();return session;
};
vm.runInContext(read('planning-engine-v3-core.js'),ctx);
vm.runInContext(read('pedagogical-engine-v2.js'),ctx);
const old=(name)=>({name,kind:'sesion'});
const days=['Lunes','Martes','Miércoles','Jueves','Viernes'];
const choices=['Comunicación','Personal Social','Matemática','Comunicación','Ciencia y Tecnología',
 'Matemática','Personal Social','Arte y Cultura','Educación Física','Educación Religiosa'];
const activities=[];
for(let w=1;w<=3;w++)for(let i=0;i<10;i++)activities.push({
 area:choices[i],title:'Título genérico '+i,week:w,day:days[Math.floor(i/2)],
 block:i%2+1,time:i%2?'9:45-10:30':'8:00-8:45'
});
const unit={id:'u-integration',type:'Unidad de aprendizaje',level:'Primaria',ieType:'Polidocente',
 grades:['2.º'],areas:[...new Set(choices)],duration:'3 semanas',
 title:'Conocemos y hacemos respetar nuestros derechos',situationBrief:'los derechos',
 situation:'Una situación inicial sin detalles aún.',reto:'¿Qué derechos conocemos?',
 purpose:'Propósito inicial',product:'Guía ilustrada de nuestros derechos',
 productTitle:'Guía ilustrada de nuestros derechos',
 documentContextSnapshot:{institution:'Institución ficticia',teacher:'Docente ficticio'},activities};
root.state.units.push(unit);
const version=JSON.stringify(unit);
const design=root.DDPedagogicalV2.design(unit);
assert(design.ok,JSON.stringify(design));
assert.equal(JSON.stringify(unit),version,'La propuesta previa no reescribe el original');
assert.equal(saves,0,'No se guarda antes de aprobar');
const beforeFailedSave=JSON.stringify(unit);
root.save=()=>false;
assert.throws(()=>root.DDPedagogicalV2.apply(unit,design),/No se pudo guardar/,
 'El fallo de almacenamiento no debe dejar una propuesta parcialmente aprobada');
assert.equal(JSON.stringify(unit),beforeFailedSave,'Restaurar todos los campos incluidos V3 ante fallo de guardado');
root.save=()=>{saves++;return true;};
root.DDPedagogicalV2.apply(unit,design);
assert(unit.pedagogicalV2?.approved);
assert.equal(unit.pedagogicalV3?.version,'3.0.0-contract-first');
const html=root.unitWordHtml(unit);
for(const s of unit.activities)assert(html.includes(s.title),s.title);
assert(html.includes('MATRIZ CURRICULAR'));
assert(html.includes('SECUENCIA PROGRESIVA'));
assert(html.includes('¿Qué derecho reconocemos en las viñetas?'));
assert(!html.includes('Exportador histórico'));
const act=unit.activities[0];
const originalCriterion=act.criterion;
act.criterion='Muy bien';
assert.throws(()=>root.unitWordHtml(unit),/no superó la revisión V3/,
 'No exportar Word luego de una edición inválida');
act.criterion='Identifica con claridad una situación concreta de su lectura y explica qué derecho se representa.';
assert(root.unitWordHtml(unit).includes(act.criterion),'Word usa la corrección actual, no una copia obsoleta');
const ses=root.buildSession();
assert.equal(ses.pedagogicalV3?.version,'3.0.0-contract-first');
assert.equal(ses.pedagogicalV3?.criterion,act.criterion);
assert.equal(ses.evidence,act.evidence);
assert(root.sessionHtml(ses).includes(act.criterion));
const originalQuestion=ses.challenge,originalEvidence=ses.evidence;
ses.challenge='¿Cómo escuchamos con respeto lo que opina el personaje?';
ses.evidence='Ficha revisada con la explicación del derecho y una pregunta pertinente.';
const editedSessionWord=root.sessionHtml(ses);
assert(editedSessionWord.includes(ses.challenge),'La pregunta nueva se aplica también al inicio y reto');
assert(editedSessionWord.includes(ses.evidence),'La evidencia nueva se aplica también al cierre');
assert(!editedSessionWord.includes('ante la pregunta «'+originalQuestion+'»'),'No reinsertar la pregunta antigua en el inicio');
assert(!editedSessionWord.includes('<b>Pregunta de trabajo:</b> '+originalQuestion),'La pregunta de trabajo debe ser la corregida');
assert(!editedSessionWord.includes(originalEvidence),'No reinsertar la evidencia antigua en Word');
ses.challenge=originalQuestion;ses.evidence=originalEvidence;
const keep=root.state.lastSession;
act.criterion='Malo';
assert.throws(()=>root.buildSession(),/no superó la revisión V3/);
assert.equal(root.state.lastSession,keep,'El fallo no debe reemplazar la sesión anterior');
act.criterion=originalCriterion;
const back=root.DDPedagogicalV2.restore(unit);
assert.equal(back,true);
assert.equal(unit.pedagogicalV3,undefined,'Restaurar también desactiva la certificación V3');
assert.equal(unit.activities.length,30);
// Fail closed: without the central V3 module the real browser cannot export an approved V2 unit.
const noCore={unitWordHtml:()=>'<p>Legacy</p>'};
const fakeDocument={head:{appendChild(){}},createElement(){return {textContent:''};}};
const guarded=vm.createContext({window:noCore,document:fakeDocument,console});
vm.runInContext(read('pedagogical-engine-v2-data.js'),guarded);
vm.runInContext(read('pedagogical-engine-v2.js'),guarded);
assert.throws(()=>noCore.unitWordHtml({pedagogicalV2:{approved:true}}),/Motor V3 no está cargado/);
const index=read('index.html');
assert(index.indexOf('src="planning-engine-v3-core.js"')>0);
assert(index.indexOf('src="planning-engine-v3-core.js"')<index.indexOf('src="pedagogical-engine-v2.js"'));
console.log('PASS V3 INTEGRATION: aprobación, Word actual, sesión trazable, rechazo de errores y restauración');
