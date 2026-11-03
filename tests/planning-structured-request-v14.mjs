import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createContext,runInContext} from 'node:vm';
const file=name=>readFileSync(new URL('../'+name,import.meta.url),'utf8');
const request=`Quiero crear una unidad de aprendizaje de 3 semanas para 4.º grado de Primaria, titulada **«Cuidamos el agua para cuidar la vida»**.

**Contexto:** En nuestra comunidad, el agua es indispensable para beber, cocinar, asearnos y regar las plantas. Sin embargo, algunas personas dejan los caños abiertos o utilizan más agua de la necesaria. Los estudiantes desean investigar cómo se utiliza el agua en sus hogares y en la escuela, qué problemas ocasiona su desperdicio y qué acciones pueden realizar para cuidarla.

**Áreas curriculares:** Comunicación, Matemática, Personal Social y Ciencia y Tecnología. Trabajar únicamente estas cuatro áreas.

**Pregunta retadora:** ¿Cómo podemos investigar el uso del agua en nuestra comunidad y promover acciones responsables para evitar su desperdicio?

**Producto final:** Una campaña escolar titulada «Cada gota cuenta», que incluya afiches informativos, gráficos de datos, recomendaciones y compromisos para el uso responsable del agua.

**Indicaciones pedagógicas:** Organizar actividades progresivas durante tres semanas.`;
const app=file('app.js');
const topicSection=app.slice(app.indexOf('function contextTopicFromBrief(brief){'),app.indexOf('function activityVariants(area,brief){'));
const topicCtx=createContext({window:{}});runInContext(topicSection,topicCtx);
const topic=topicCtx.window.ddContextTopic(request);assert.match(topic,/agua/);assert.doesNotMatch(topic,/tema solicitado|siembra|unidad de aprendizaje/i);
const source=file('proposal-choice-v8.js');
const helperSource=source.slice(source.indexOf('  const tidy='),source.indexOf('  function meaningFor('));
const st={areas:['Comunicación','Matemática','Personal Social','Ciencia y Tecnología','Arte y Cultura','Educación Física','Educación Religiosa'],grades:['4.º'],level:'Primaria',units:[],pendingUnitChoice:null,teacherContext:{}};
const field={value:'Aprendemos sobre los saberes y prácticas de la siembra para cuidar la vida**',focus(){}};
const byId=id=>id==='unitTitle'?field:id==='unitSituation'?{value:request}:id==='unitType'?{value:'Unidad de aprendizaje'}:null;
let sent='';
const ctx=createContext({state:st,window:{ddContextTopic:topicCtx.window.ddContextTopic},byId,save(){},showSituations(b){sent=b},alert(x){throw Error('Unexpected warning: '+x)},tidy:x=>String(x).trim()});
runInContext(helperSource,ctx);
assert.match(ctx.teacherContext(request),/caños abiertos/i);
assert.doesNotMatch(ctx.teacherContext(request),/competencias|indicaciones pedagógicas/i);
assert.equal(ctx.namedUnitTitle(request),'Cuidamos el agua para cuidar la vida');
assert.match(ctx.statedChallenge(request),/¿Cómo podemos investigar el uso del agua/);
const areaFunctions=source.slice(source.indexOf('  function explicitlyRequestedAreas(brief){'),source.indexOf('  window.createUnitDemo=function(){'));
runInContext(areaFunctions,ctx);assert.equal(JSON.stringify(ctx.explicitlyRequestedAreas(request)),JSON.stringify(st.areas.slice(0,4)));
const wrapper=source.slice(source.indexOf('  window.createUnitDemo=function(){'),source.indexOf('  const css=',source.indexOf('  window.createUnitDemo=function(){')));
runInContext(wrapper,ctx);ctx.window.createUnitDemo();assert.equal(field.value,'Cuidamos el agua para cuidar la vida');assert.equal(sent,request);
// La selección de áreas debe cambiar únicamente las de esta unidad.
st.pendingUnitChoice={brief:request,contextFocus:topic,selectedSituation:'Investigamos el cuidado del agua.',selectedProduct:'Campaña escolar Cada gota cuenta',selectedProductTitle:'Campaña',situations:[],products:[],reto:'¿Cómo usamos el agua?'};
let unit;
ctx.baseCreate=()=>{unit={id:'u1',areas:[...st.areas]};st.units.unshift(unit)};
ctx.renderUnits=()=>{};ctx.renderUnitOutput=()=>{};ctx.fillSessionUnits=()=>{};ctx.profileSnapshot=()=>({});
ctx.byId=id=>id==='unitOutput'?{scrollIntoView(){}}:byId(id);
ctx.finalizeChoice({classList:{add(){}}});assert.equal(JSON.stringify(unit.areas),JSON.stringify(st.areas.slice(0,4)));assert.equal(st.areas.length,7);
// Dos situaciones deben estar ancladas en el contexto, no en la instrucción.
const situationSource=source.slice(source.indexOf('  function situationOptions(raw){'),source.indexOf('  function productOptions(raw,pack){'));
const sctx=createContext({state:st,window:{ddContextTopic:topicCtx.window.ddContextTopic},byId,tidy:x=>String(x).replace(/\s+/g,' ').trim(),plain:ctx.plain,teacherContext:ctx.teacherContext,statedChallenge:ctx.statedChallenge,
 meaningFor:()=>({focus:topic,confidence:80}),shortFocus:()=>topic,placeFor:()=> 'nuestra comunidad',challengeFor:()=> '¿Cómo cuidamos el agua?',naturalEvidence:()=> '',profileSnapshot:()=>({}),isAllSaintsContext:()=>false,low:x=>String(x).toLowerCase()});
runInContext(situationSource,sctx);let pack=sctx.situationOptions(request);assert.equal(pack.situations.length,2);for(let v of pack.situations){assert.match(v.text,/agua/);assert.doesNotMatch(v.text,/tema solicitado por el docente|crear una unidad de aprendizaje/i);}assert.match(pack.reto,/evitar su desperdicio/i);
console.log('PASS: título recuperado, 4 áreas, contexto y pregunta sin instrucciones, producto y situaciones temáticas');
