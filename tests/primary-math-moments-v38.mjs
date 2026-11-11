// Fase 38: procesos de Matemática ordenados y lenguaje claro.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const src=readFileSync(new URL('../master-session-v1.js',import.meta.url),'utf8');
const a=src.indexOf('  function mathProcess(){');
const b=src.indexOf('  function scienceProcess(session){',a);
assert(a>=0&&b>a);
const context={};
runInNewContext(src.slice(a,b)+'\nthis.math=mathProcess;',context);
const phases=context.math();
assert.deepEqual([...phases.map(x=>x[0])],[
  'FAMILIARIZACIÓN CON EL PROBLEMA',
  'BÚSQUEDA Y EJECUCIÓN DE ESTRATEGIAS',
  'SOCIALIZACIÓN DE REPRESENTACIONES',
  'REFLEXIÓN Y GENERALIZACIÓN',
  'PLANTEAMIENTO DE OTROS PROBLEMAS'
]);
assert(phases.every(x=>x[1].length>65),'Cada momento precisa actuaciones observables');
assert(phases[0][1].includes('qué se pregunta'));
assert(phases[1][1].includes('registran'));
assert(phases[2][1].includes('explican'));
assert(phases[3][1].includes('Comprueban'));
assert(phases[4][1].includes('nuevo caso'));
const l=src.indexOf('  function learnerAction(session,index,process){');
const n=src.indexOf('  function startActions(session){',l);
assert(l>=0&&n>l);
const contextual={};
runInNewContext(src.slice(l,n)+'\nthis.action=learnerAction;',contextual);
const session={area:'Matemática',title:'Resolvemos repartos equitativos',
  resourcesList:['semillas','tarjetas']};
const text=contextual.action(session,0,phases[0]);
assert.match(text,/Leen o escuchan el problema/);
assert.match(text,/trabajan en parejas/);
assert.match(text,/usan semillas/);
assert.doesNotMatch(text,/^(?:Analizan|Identifican) (?:Leen|Identifican|Analizan)\b/i);
assert(!text.includes('undefined')&&!text.includes('[object Object]'));
const without=contextual.action({...session,resourcesList:[]},1,phases[1]);
assert.match(without,/Proponen estrategias/);
assert(!without.includes('undefined'));
assert(!without.includes('usan material o recurso disponible'));
assert(src.includes("if(session.area==='Matemática')return mathProcess()"));
assert(src.includes('const main=learnerAction(session,i,p)'));
assert(src.includes('const master=momentsHtml(session)'));
assert(src.includes('if(re.test(html))html=html.replace(re,master)'));
console.log('PASS v38: cinco momentos matemáticos, consigna clara y sin recurso inventado');
