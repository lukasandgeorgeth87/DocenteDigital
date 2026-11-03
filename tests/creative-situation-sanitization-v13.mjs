import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createContext,runInContext} from 'node:vm';
const file=name=>readFileSync(new URL('../'+name,import.meta.url),'utf8');
const sample='Quiero crear una unidad de aprendizaje de tres semanas para 4.º grado de Primaria sobre el cuidado del agua en nuestra comunidad. Incluye Comunicación, Matemática, Personal Social y Ciencia y Tecnología. El producto final será una campaña escolar para promover el uso responsable del agua, con competencias, criterios, evidencias y actividades apropiadas para el grado.';
const rawApp=file('app.js'),a=rawApp.indexOf('function contextTopicFromBrief(brief){'),b=rawApp.indexOf('function activityVariants(area,brief){',a);
const topicCtx=createContext({window:{}});runInContext(rawApp.slice(a,b),topicCtx);
const p={brief:sample,type:'Unidad de aprendizaje',contextFocus:'el cuidado del agua',situations:[
{key:'A',title:'Propuesta A',text:'Las familias viven la situación “crear una unidad de aprendizaje de tres semanas para 4.º grado sobre el cuidado del agua”.'},
{key:'B',title:'Propuesta B',text:'Los estudiantes podrán crear una unidad de aprendizaje sobre el cuidado del agua.'}
],products:[{key:'1',title:'Campaña',text:'Una campaña de cuidado del agua'}]};
const state={pendingUnitChoice:p,grades:['4.º'],units:[]};
let clickHandler=null;const shown=[];
const card=()=>({querySelector:(what)=>{if(what==='h3')return{set textContent(v){shown.push(['title',v])}};if(what==='p')return{set textContent(v){shown.push(['situation',v])}};return null}});
const host={querySelector:(sel)=>{if(sel.startsWith('input[name="ddSituation"]'))return{closest:card};if(sel==='.dd-choice-intro p')return {set innerHTML(v){}};if(sel==='.dd-new-ideas-note')return true;return null}};
const document={addEventListener:(type,listener)=>{if(type==='click')clickHandler=listener},createElement(){return{style:{}}},head:{appendChild(){}}};
const window={ddCreativeChoices:()=>({situations:[{key:'A',title:'Creativa',text:'En la comunidad, crear una unidad de aprendizaje es la situación.'}],products:[{key:'1',text:'Campaña'}]}),ddCreativeTitleOptions:()=>['Aprendemos desde ° grado'],ddContextTopic:topicCtx.window.ddContextTopic,ddGoalAlignment:{extractGoal:()=>({phrase:'promover el uso responsable del agua'})}};
const c=createContext({state,window,document,byId:(id)=>({unitTitle:{value:''},ddProposalChooser:host})[id]||null,save(){},setTimeout(fn){fn()},escapeHtml:x=>String(x)});
runInContext(file('creative-runtime-v18.js'),c);
assert.equal(typeof clickHandler,'function');
clickHandler({target:{closest:()=>({id:'',getAttribute:()=> 'createUnitDemo()'})}});
assert.equal(p._creativeData.situations.length,2);
for(const s of p._creativeData.situations){assert.doesNotMatch(s.text,/crear una unidad de aprendizaje/i);assert.match(s.text,/cuidado del agua/i)}
assert.equal(shown.filter(x=>x[0]==='situation').length,2);
console.log('PASS: el motor creativo muestra situaciones temáticas sin reciclar la orden del docente');
