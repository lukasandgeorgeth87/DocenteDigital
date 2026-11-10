// Fase 34: la propuesta de derechos elegida A/B no puede volver a ser
// metarredacción al finalizar. Proteger la opción manual del docente.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const src=readFileSync(new URL('../proposal-choice-v8.js',import.meta.url),'utf8');
const start=src.indexOf('  function explicitlyRequestedAreas(brief){');
const end=src.indexOf('  window.createUnitDemo=function(){',start);
assert(start>=0&&end>start);
const good={
 focus:'los derechos de la niñez',
 reto:'¿Cómo reconocer los derechos?',
 situations:[
  {key:'A',text:'Los estudiantes analizan cuentos ficticios sobre sus derechos.'},
  {key:'B',text:'A partir de historias ilustradas, conocen sus derechos y explican cómo respetarlos.'}
 ]
};
let seq=0;
function run(pending){
 const state={areas:['Comunicación','Personal Social'],grades:['6.º'],
  units:[],pendingUnitChoice:pending};
 const baseCreate=()=>state.units.unshift({id:'u'+(++seq),title:'Derechos',level:'Primaria',
  grades:state.grades,areas:state.areas,product:'Producto anterior'});
 const sandbox={
  state,baseCreate,save(){},renderUnits(){},renderUnitOutput(){},fillSessionUnits(){},
  profileSnapshot:()=>({}),byId:()=>({scrollIntoView(){}}),
  window:{},situationOptions:()=>good,statedChallenge:()=>'',namedUnitTitle:()=>'',namedProductFinal:()=>''
 };
 runInNewContext(src.slice(start,end),sandbox);
 sandbox.finalizeChoice({classList:{add(){}}});
 return {unit:state.units[0],pending:state.pendingUnitChoice};
}
const standard={
 brief:'los derechos',
 situations:[
  {key:'A',text:'En el entorno cercano de los estudiantes, se propone desarrollar los derechos.'},
  {key:'B',text:'El docente podrá completar luego la situación significativa.'}
 ],
 selectedSituation:'El docente podrá completar luego la situación significativa.',
 products:[{key:'2',title:'Expo interactiva',text:'Una exposición por estaciones'}],
 selectedProduct:'Una exposición por estaciones',selectedProductTitle:'Expo interactiva',
 selectedProductKey:'2',productChoiceSource:'card',
 reto:'¿Qué evidencias necesitamos reunir sobre En el entorno cercano de los estudiantes?'
};
const result=run({...standard,situations:standard.situations.map(s=>({...s}))});
assert.equal(result.unit.situation,good.situations[1].text,'Conservar la elección B pedagógicamente válida');
assert.equal(result.unit.reto,good.reto);
assert.equal(result.unit.selectedSituationSource,'B');
assert.equal(result.unit.product,'Expo interactiva');
const manual=run({...standard,situations:standard.situations.map(s=>({...s})),selectedSituationKey:'Docente',selectedSituation:'Mi situación original escrita por el docente sobre los derechos'});
assert.equal(manual.unit.situation,'Mi situación original escrita por el docente sobre los derechos','Nunca sustituir autoría manual');
const rich=run({...standard,situations:standard.situations.map(s=>({...s})),brief:'En mi comunidad observamos un caso de discriminación y los estudiantes van a analizar documentos y normas sobre los derechos.'});
assert.match(rich.unit.situation,/El docente podrá completar/i,'No convertir un contexto específico en otro por fuerza');
const changed=run({...standard,situations:[{key:'A',text:'Una situación distinta ya fue cargada'},{key:'B',text:'Otro texto cargado'}],selectedSituationKey:'B'});
assert.equal(changed.unit.situation,good.situations[1].text,'El identificador B debe proteger la situación ante cambios posteriores en las tarjetas');
console.log('PASS v34: guardado final respeta opción de derechos y autoría manual');
