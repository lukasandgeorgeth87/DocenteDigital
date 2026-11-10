// Fase 29: nunca borrar ajustes curriculares al volver a abrir una unidad.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const raw=readFileSync(new URL('../enhancements.js',import.meta.url),'utf8');
const start=raw.indexOf('  function ddEnrich(unit){'),end=raw.indexOf('  createUnitDemo=function(){',start);
assert(start>=0&&end>start,'La unidad debe tener función de enriquecimiento');
const core={
  version:'test-oficial',
  getTransversals(){return [{name:'Se desenvuelve en entornos virtuales generados por las TIC',capacities:['Personaliza entornos virtuales']}]}
};
const sandbox={
 window:{DD_OFFICIAL_CURRICULUM:core},
 ddResolveUnitLevel:u=>u.level,
 ddContext:u=>u.situationBrief||'derechos',
 ddReto:()=> '¿Qué derechos conocemos?',
 ddProduct:()=> 'Expo interactiva',
 buildActivities:()=>[{area:'Comunicación',title:'Dialogamos'}],
 ddOfficialSource:()=>({id:'cneb-test'}),
 ddBuildPurposes:u=>u.areas.map(area=>({area,
   officialCompetencies:[{name:'Se comunica oralmente en su lengua materna'}],
   evidence:'Intervención oral',instrument:'Rúbrica automática',
   criteria:u.grades.map(grade=>({grade,text:'Criterio automático '+grade}))}))
};
runInNewContext(raw.slice(start,end)+'\nthis.enrich=ddEnrich;',sandbox);
const unit={
 level:'Primaria',type:'Unidad de aprendizaje',title:'Convivimos',
 grades:['1.º','3.º'],areas:['Comunicación'],duration:'3 semanas',
 situationBrief:'Derechos de la niñez',
 purposes:[{area:'Comunicación',officialCompetencies:[{name:'Se comunica oralmente en su lengua materna'}],
 evidence:'Grabación oral elegida por el docente',instrument:'Lista personalizada',
 criteria:[{grade:'1.º',text:'Expresa una idea con apoyo'},{grade:'3.º',text:'Sustenta una opinión con un ejemplo'}]}],
 transversals:[{name:'Se desenvuelve en entornos virtuales generados por las TIC',
 capacities:['Capacidad incorrecta antigua'],application:'Mi aplicación personalizada'}]
};
sandbox.enrich(unit);
assert.equal(unit.purposes[0].criteria[0].text,'Expresa una idea con apoyo');
assert.equal(unit.purposes[0].criteria[1].text,'Sustenta una opinión con un ejemplo');
assert.equal(unit.purposes[0].evidence,'Grabación oral elegida por el docente');
assert.equal(unit.purposes[0].instrument,'Lista personalizada');
assert.equal(unit.transversals[0].application,'Mi aplicación personalizada');
assert.equal(unit.transversals[0].capacities[0],'Personaliza entornos virtuales');
unit.grades.push('5.º');
sandbox.enrich(unit);
assert.equal(unit.purposes[0].criteria.length,3);
assert.equal(unit.purposes[0].criteria[0].text,'Expresa una idea con apoyo');
assert.equal(unit.purposes[0].criteria[2].text,'Criterio automático 5.º');
sandbox.enrich(unit);
assert.equal(unit.purposes[0].instrument,'Lista personalizada');
assert.equal(unit.transversals[0].application,'Mi aplicación personalizada');
const fresh={...unit,purposes:[],transversals:[]};
sandbox.enrich(fresh);
assert.equal(fresh.purposes[0].criteria.length,3,'Nuevas unidades se deben completar');
assert.equal(fresh.purposes[0].instrument,'Rúbrica automática');
console.log('PASS v29: enriquecimiento idempotente conserva modificaciones y completa solo lo faltante');
