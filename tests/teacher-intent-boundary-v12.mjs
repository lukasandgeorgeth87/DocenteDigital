import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createContext,runInContext} from 'node:vm';
const here = new URL('../',import.meta.url);
const load=name=>readFileSync(new URL(name,here),'utf8');
const sample='Quiero crear una unidad de aprendizaje de tres semanas para 4.º grado de Primaria sobre el cuidado del agua en nuestra comunidad. Incluye Comunicación, Matemática, Personal Social y Ciencia y Tecnología. El producto final será una campaña escolar para promover el uso responsable del agua, con competencias, criterios, evidencias y actividades apropiadas para el grado.';
const samples=[
  {input:sample,topic:'el cuidado del agua'},
  {input:'Quiero una unidad de aprendizaje para 2.º grado sobre la alimentación saludable. Producto final: un recetario.',topic:'la alimentación saludable'},
  {input:'Necesito preparar un proyecto para 6.º grado acerca de la historia de mi comunidad. Incluye Comunicación.',topic:'la historia de mi comunidad'},
  {input:'En nuestra comunidad encontramos semillas que deseamos observar y registrar.',topic:'las semillas que deseamos observar y registrar'}
];
const rawApp=load('app.js');
const start=rawApp.indexOf('function contextTopicFromBrief(brief){');const end=rawApp.indexOf('function activityVariants(area,brief){',start);
assert(start>=0&&end>start);
const context=createContext({window:{}});
runInContext(rawApp.slice(start,end),context);
for(const {input,topic} of samples){const value=context.window.ddContextTopic(input);assert.equal(value,topic,`tema incorrecto: ${value}`)}
const proposal=load('proposal-choice-v8.js');
const shortStart=proposal.indexOf('function shortFocus(m,raw){');const shortEnd=proposal.indexOf('function profileSnapshot(){',shortStart);
assert(shortStart>=0&&shortEnd>shortStart);
const pctx=createContext({window:context.window,tidy:s=>String(s||'').replace(/\s+/g,' ').trim()});
runInContext(proposal.slice(shortStart,shortEnd),pctx);
assert.equal(pctx.shortFocus({focus:'crear una unidad de aprendizaje de tres semanas'},sample),'el cuidado del agua');
const goalSource=load('goal-alignment-v28.js');
const egStart=goalSource.indexOf('function extractGoal(text){');const egEnd=goalSource.indexOf('function themeLabel(brief){',egStart);
const egCtx=createContext({tidy:s=>String(s||'').replace(/\s+/g,' ').trim().replace(/[.?!,;:]+$/,'')});
runInContext(goalSource.slice(egStart,egEnd),egCtx);
assert.equal(egCtx.extractGoal(sample).phrase,'promover el uso responsable del agua');
assert.equal(egCtx.extractGoal('Investiguemos la siembra para construir nuestro biohuerto escolar.').phrase,'construir nuestro biohuerto escolar');
const sched=load('schedule-v3.js');
const ps=sched.indexOf('function primarySequenceTitle(area,brief,week,weeks,turn){');const pe=sched.indexOf('buildActivities=function(brief,duration){',ps);
const sctx=createContext({window:context.window,state:{pendingUnitChoice:{selectedProduct:'una campaña escolar para promover el uso responsable del agua'}}});
runInContext(sched.slice(ps,pe),sctx);
const first=sctx.primarySequenceTitle('Comunicación',sample,1,3,1),middle=sctx.primarySequenceTitle('Comunicación',sample,2,3,1),last=sctx.primarySequenceTitle('Comunicación',sample,3,3,1);
assert.equal(new Set([first,middle,last]).size,3,'No hay progresión entre semanas');
for(const name of [first,middle,last,sctx.primarySequenceTitle('Matemática',sample,2,3,1),sctx.primarySequenceTitle('Ciencia y Tecnología',sample,3,3,1)]){
 assert(!/crear una unidad|aprendizaje de tres semanas|con competencias, criterios/i.test(name),`contaminación en ${name}`);
}
// Sin cambiar el enfoque real del profesor ni las competencias oficiales.
console.log('PASS: enfoque contextual, finalidad depurada, título por grado y progresión de 3 semanas');
