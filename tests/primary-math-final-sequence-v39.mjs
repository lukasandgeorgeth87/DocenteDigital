// Fase 39: el motor que reemplaza la sesión final conserva cinco momentos
// concretos de Matemática tanto en pantalla como en Word.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const src=readFileSync(new URL('../session-teaching-sequence-v3.js',import.meta.url),'utf8');
const helperStart=src.indexOf('  function primaryMathematicsSteps(mode){');
const helperEnd=src.indexOf('  function steps(session){',helperStart);
assert(helperStart>=0&&helperEnd>helperStart,'Debe existir secuencia final');
const ctx={};
runInNewContext(src.slice(helperStart,helperEnd)+'\nthis.math=primaryMathematicsSteps;',ctx);
const markers=[
 /^Familiarización con el problema:/,
 /^Búsqueda y ejecución de estrategias:/,
 /^Socialización de representaciones:/,
 /^Reflexión y generalización:/,
 /^Planteamiento de otros problemas:/
];
const modes=['cantidad','regularidad','forma','datos'];
for(const mode of modes){
 const actions=ctx.math(mode);
 assert.equal(actions.length,5,mode+' necesita cinco momentos');
 markers.forEach((m,i)=>assert.match(actions[i],m,mode+' '+i));
 assert(actions.every(s=>s.length>105),'Instrucciones insuficientes: '+mode);
 assert(!actions.some(x=>/el docente podrá completar|se propone desarrollar/i.test(x)));
}
const text={
 cantidad:'cantidades',regularidad:'patrones',forma:'geométricas',datos:'estadística'
};
for(const [mode,word] of Object.entries(text))assert(ctx.math(mode).join(' ').includes(word),'Falta enfoque '+mode);
assert(ctx.math('indefinido').some(x=>/confirmar con el docente/.test(x)),'No inventar la competencia');
const start=src.indexOf('  function steps(session){');
const end=src.indexOf('  function sections(session){',start);
assert(start>=0&&end>start);
const stepCtx={primaryMathematicsSteps:ctx.math,mathematicsMode:()=> 'datos'};
runInNewContext(src.slice(start,end)+'\nthis.steps=steps;',stepCtx);
const actions=stepCtx.steps({level:'Primaria',area:'Matemática',title:'Organizamos datos de la encuesta'});
assert.equal(actions.length,5);
assert.match(actions[0],/pregunta estadística/);
assert.match(actions[4],/otra pregunta/);
assert(src.includes('const development=steps(session).map('));
assert(src.includes('const timing=table('));
assert(src.includes('window.sessionHtml=function(session,forWord=false)'));
assert(src.includes('if(generic.test(html))html=html.replace(generic,sections(session))'));
console.log('PASS v39: cinco momentos diferenciados en la sesión final de Matemática');
