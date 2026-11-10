// Fase 26: verificar redacción y consistencia más allá de campos presentes.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const src=readFileSync(new URL('../planning-chain-integrity-v10.js',import.meta.url),'utf8');
const env={window:{},state:{units:[]},document:{getElementById(){return null}}};
runInNewContext(src,env);
const auditor=env.window.DD_PLANNING_CHAIN_V10;
const broken={
 type:'Unidad de aprendizaje',level:'Primaria',grades:['6.º'],areas:['Comunicación'],
 title:'Descubrimos los derechos',
 situation:'En el entorno cercano de los estudiantes, se propone desarrollar una unidad. El docente podrá completar luego.',
 reto:'¿Qué evidencias necesitamos reunir sobre En el entorno cercano de los estudiantes para enriquecer la contextualización?',
 product:'Juego de mesa «Reto Tarpuy»',productTitle:'Expo interactiva: derechos y responsabilidades',
 selectionApproved:true,
 activities:[{area:'Comunicación',title:'Dialogamos sobre el en el entorno cercano de los estudiantes'}]
};
const result=auditor.auditUnit(broken);
for(const id of ['situation-scaffold','challenge-scaffold','selected-product-mismatch','session-scaffold'])
 assert(result.warnings.some(x=>x.id===id),'Debe detectar '+id);
assert.equal(result.checks.find(x=>x.name==='Producto o evidencia integradora').present,true);
const panel=auditor.unitPanel(broken);
assert.match(panel,/Presente · revisar/);
assert.match(panel,/producto guardado no coincide/i);
const healthy={...broken,
 situation:'En el aula analizamos relatos ficticios sobre derechos y participación.',
 reto:'¿Cómo podemos explicar nuestros derechos y respetar los de los demás?',
 product:broken.productTitle,
 activities:[{area:'Comunicación',title:'Dialogamos sobre nuestros derechos en el aula'}]};
const ids=auditor.auditUnit(healthy).warnings.map(x=>x.id);
for(const id of ['situation-scaffold','challenge-scaffold','selected-product-mismatch','session-scaffold'])
 assert(!ids.includes(id),'No generar falso positivo: '+id);
console.log('PASS v26: alertas visibles, sin falsos positivos básicos');
