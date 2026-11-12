// Compatibility with the real V2 rights planner: V3 must accept curated interdisciplinary sequences
// without rewriting the original teacher submission or inventing official performances.
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const load=name=>readFileSync(new URL('../'+name,import.meta.url),'utf8');
const root={};
const ctx=vm.createContext({window:root,console});
vm.runInContext(load('pedagogical-engine-v2-data.js'),ctx);
const catalog=root.DD_PED_V2_CATALOG;
const curriculum={
 getArea(level,area){
  if(level!=='Primaria'||!catalog.routes[area])return[];
  const keys=[...new Set(catalog.routes[area].flat().map(x=>x[6]))];
  return keys.map(k=>({name:catalog.competences[k],capacities:['Capacidad verificada en fuente']}));
 },
 sourceFor(){return {title:'Programa curricular de Educación Primaria'};}
};
root.DD_OFFICIAL_CURRICULUM=curriculum;
vm.runInContext(load('pedagogical-engine-v2.js'),ctx);
vm.runInContext(load('planning-engine-v3-core.js'),ctx);
const areas=['Comunicación','Personal Social','Matemática','Comunicación','Ciencia y Tecnología',
 'Matemática','Personal Social','Arte y Cultura','Educación Física','Educación Religiosa'];
const days=['Lunes','Martes','Miércoles','Jueves','Viernes'];
const activities=[];
for(let w=1;w<=3;w++)for(let i=0;i<10;i++)activities.push({
 week:w,day:days[Math.floor(i/2)],area:areas[i],block:i%2+1,
 title:'Título previo '+i,order:activities.length+1,time:'8:00-9:30'
});
const unit={id:'compat',type:'Unidad de aprendizaje',level:'Primaria',ieType:'Polidocente',
 grades:['2.º'],areas:[...new Set(areas)],duration:'3 semanas',
 title:'Conocemos y hacemos respetar nuestros derechos',situationBrief:'los derechos',
 situation:'Situación previa que debe conservarse hasta una aprobación explícita.',
 product:'Guía ilustrada de nuestros derechos',productTitle:'Guía ilustrada de nuestros derechos',
 activities,documentContextSnapshot:{institution:'I.E. ficticia',teacher:'Docente de prueba'}};
const unchanged=JSON.stringify(unit);
const out=root.DDPlanningCoreV3.compile(unit,u=>root.DDPedagogicalV2.design(u),curriculum);
assert(out.ok,JSON.stringify(out.errors));
assert.equal(out.coverage.sessions,30);
assert.equal(out.coverage.uniqueTitles,30);
assert.equal(out.normalized.product,unit.product);
assert.equal(JSON.stringify(unit),unchanged);
for(const row of out.normalized.sessions){
 assert(row.competence);
 assert(row.capacities.length);
 assert(row.criterion);
 assert(row.evidence);
 assert(row.studentAction);
}
const html=root.DDPlanningCoreV3.renderDocument(out);
for(const row of out.normalized.sessions)assert(html.includes(row.title));
assert(html.includes('Guía ilustrada de nuestros derechos'));
console.log('PASS V3+V2: 30 sesiones de derechos trazadas y Word consistente sin alterar la unidad original');
