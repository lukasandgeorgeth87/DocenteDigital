import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createContext,runInContext} from 'node:vm';
const file=n=>readFileSync(new URL('../'+n,import.meta.url),'utf8');
const brief=`Quiero crear una unidad de aprendizaje para 4.º grado de Primaria.

**Título:** Cuidamos el agua para cuidar la vida.

**Duración:** 3 semanas, con 2 sesiones por día.

**Áreas curriculares:** Comunicación, Matemática, Personal Social y Ciencia y Tecnología. Trabajar únicamente estas cuatro áreas.

**Contexto:** En nuestra comunidad, el agua es indispensable para beber, cocinar, asearnos, regar las plantas y realizar nuestras actividades diarias. Sin embargo, algunas personas dejan los caños abiertos, desperdician el agua o no conocen las consecuencias de utilizarla irresponsablemente. Ante esta situación, los estudiantes de 4.º grado desean investigar cómo se usa el agua en sus hogares y en la escuela, identificar problemas y proponer soluciones para cuidarla.

**Pregunta retadora:** ¿Cómo podemos investigar el uso del agua y promover acciones responsables para evitar su desperdicio en nuestra comunidad?

**Producto final:** Campaña escolar «Cada gota cuenta», con afiches informativos, gráficos estadísticos, recomendaciones y compromisos para el uso responsable del agua.

**Indicaciones pedagógicas:**
- Organizar las sesiones de manera progresiva durante las tres semanas.
- Seleccionar competencias y capacidades del CNEB correspondientes a 4.º grado.
- Proponer criterios observables, evidencias e instrumentos de evaluación.
- Incluir actividades de investigación, lectura, resolución de problemas, experimentación y comunicación.
- Evitar repetir actividades y mantener todas las sesiones relacionadas con el cuidado del agua.
- Preparar la unidad para descargarla en Word.`;
const topicSrc=file('app.js');
const topicCode=topicSrc.slice(topicSrc.indexOf('function contextTopicFromBrief(brief){'),topicSrc.indexOf('function activityVariants(area,brief){'));
const topicCtx=createContext({window:{}});runInContext(topicCode,topicCtx);
const topic=topicCtx.window.ddContextTopic(brief);
assert.match(topic,/agua/i); assert.doesNotMatch(topic,/tema solicitado|unidad de aprendizaje|siembra|Word/i);

const choices=file('proposal-choice-v8.js');
const helpers=choices.slice(choices.indexOf('  const tidy='),choices.indexOf('  function meaningFor('));
const state={areas:['Comunicación','Matemática','Personal Social','Ciencia y Tecnología','Arte y Cultura','Educación Física','Educación Religiosa'],grades:['4.º'],level:'Primaria',teacherContext:{}};
const field={value:'Aprendemos sobre las semillas para cuidar la vida',focus(){}};
const byId=id=>id==='unitTitle'?field:id==='unitSituation'?{value:brief}:id==='unitType'?{value:'Unidad de aprendizaje'}:null;
const ctx=createContext({window:{ddContextTopic:topicCtx.window.ddContextTopic},state,byId,tidy:x=>String(x).trim()});
runInContext(helpers,ctx);
assert.equal(ctx.namedUnitTitle(brief),'Cuidamos el agua para cuidar la vida');
assert.match(ctx.teacherContext(brief),/caños abiertos/);
assert.doesNotMatch(ctx.teacherContext(brief),/Descargar|competencias|Producto final|Indicaciones pedagógicas/i);
assert.match(ctx.statedChallenge(brief),/investigar el uso del agua/);
const wrapper=choices.slice(choices.indexOf('  window.createUnitDemo=function(){'),choices.indexOf('  const css=',choices.indexOf('  window.createUnitDemo=function(){')));
let opened=false;ctx.showSituations=()=>opened=true;ctx.alert=x=>{throw Error('No debe alertar: '+x)};
runInContext(wrapper,ctx);ctx.window.createUnitDemo();
assert(opened);assert.equal(field.value,'Cuidamos el agua para cuidar la vida');

const titleSource=file('title-context-v38.js');
const fn=titleSource.slice(titleSource.indexOf('  function titlesFromIntent(raw,type){'),titleSource.indexOf('  function naturalTitles(raw,type){'));
const tctx=createContext({window:{ddContextTopic:topicCtx.window.ddContextTopic},tidy:x=>String(x).replace(/\s+/g,' ').trim(),BAD:/\b(?:unidad|proyecto|sesión|sesion)\s+(?:sobre|de|acerca de)\b/i});
runInContext(fn,tctx);const titles=tctx.titlesFromIntent(brief,'Unidad de aprendizaje');
assert.equal(titles[0],'Cuidamos el agua para cuidar la vida');
for(const title of titles){assert.match(title,/agua|aprendid/i);assert.doesNotMatch(title,/tema solicitado|crear una unidad|siembra/i)}

// Preserve the specific proposals when the creative diversity adapter runs.
const creative=file('creative-runtime-v18.js');
const cre=creative.slice(creative.indexOf('  function ensureCreativeData(){'),creative.indexOf('  // La propuesta automática de título'));
let saves=0;let cp={brief,type:'Unidad de aprendizaje',situations:[{key:'A',text:'Investigamos el uso y cuidado del agua'}],products:[{key:'1',title:'Campaña escolar para cuidar el agua'}]};
const cctx=createContext({window:{ddCreativeChoices:()=>({situations:[{key:'A',text:'Tema solicitado por el docente'}],products:[{key:'1',title:'Tema solicitado por el docente'}]})},pending:()=>cp,isPlanningInstruction:()=>true,cleanSituationOption:x=>x,save:()=>saves++});
runInContext(cre,cctx);const d=cctx.ensureCreativeData();
assert.match(d.products[0].title,/agua/i);assert.match(d.situations[0].text,/agua/i);
assert(saves>0);

console.log('PASS v15: texto exacto de 4.º, título, tema, contexto, reto y propuestas alineadas');
