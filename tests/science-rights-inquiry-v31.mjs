// Fase 31: los derechos no deben tratarse como fenómeno científico.
// Se propone una indagación de materiales segura, con vínculo al derecho a la salud.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const code=readFileSync(new URL('../schedule-v3.js',import.meta.url),'utf8');
const start=code.indexOf('  function primarySequenceTitle(');
const end=code.indexOf('  buildActivities=function(',start);
assert(start>=0&&end>start);
const state={pendingUnitChoice:{contextFocus:'los derechos de la niñez',selectedProductTitle:'Expo interactiva'}};
const ctx={state,window:{ddContextTopic:()=>state.pendingUnitChoice.contextFocus}};
runInNewContext(code.slice(start,end)+'\nthis.title=primarySequenceTitle;',ctx);
const request='quiero crear una unidad de 3 semanas sobre los derechos de los niños';
const titles=[];
for(let w=1;w<=3;w++)for(let n=1;n<=4;n++){
 const t=ctx.title('Ciencia y Tecnología',request,w,3,n);
 assert(t&&t.length<135,'Título científico legible');
 assert(!/preguntas investigables sobre los derechos|indagar los derechos como fenómeno/i.test(t),
 'No convertir derechos en fenómeno físico');
 assert(!/sufren enfermedades|familias vulneran|comunidad contaminada/i.test(t),
 'No inventar problemas reales');
 titles.push(t);
}
assert(titles.some(t=>/agua, aceite y jabón/.test(t)));
assert(titles.some(t=>/derecho a la salud/.test(t)));
assert(titles.some(t=>/preguntas investigables/.test(t)));
assert(titles.some(t=>/observaciones/.test(t)));
assert(titles.some(t=>/Explicamos/.test(t)));
assert.equal(new Set(titles).size,titles.length,'No repetir sesiones de las tres fases');
state.pendingUnitChoice.contextFocus='el cuidado del agua';
const water=ctx.title('Ciencia y Tecnología','Cuidamos el agua',1,3,1);
assert.match(water,/agua/);
assert(!/mezclas de agua, aceite y jabón/.test(water),'No cambiar unidades de agua por el tema de derechos');
console.log('PASS v31: indagación científica diferenciada sin atribuir fenómenos a los derechos');
