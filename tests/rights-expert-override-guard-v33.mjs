// Fase 33: el experto no debe reemplazar propuestas seguras específicas
// por metarredacción cuando la solicitud es solo «los derechos».
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const src=readFileSync(new URL('../proposal-choice-v8.js',import.meta.url),'utf8');
const start=src.indexOf('  function dataFor(brief){');
const end=src.indexOf('  function ensureHost(){',start);
assert(start>=0&&end>start);
const rightsBase=()=>({
 focus:'los derechos de la niñez',
 reto:'¿Cómo podemos reconocer nuestros derechos y responsabilidades y explicarlos con ejemplos respetuosos de la vida cotidiana?',
 situations:[
  {key:'A',title:'Situaciones cotidianas: derechos y responsabilidades',text:'Los estudiantes analizarán cuentos y situaciones ficticias sobre sus derechos.'},
  {key:'B',title:'Aprendemos nuestros derechos',text:'Los estudiantes leerán historias ilustradas de derechos y prepararán una exposición.'}
 ]
});
const rightsProducts=()=>[
 {key:'1',title:'Portafolio de evidencias',text:'Textos y dibujos'},
 {key:'2',title:'Expo interactiva: derechos de la niñez',text:'Presentación por estaciones'},
 {key:'3',title:'Guía ilustrada de derechos',text:'Guía elaborada por estudiantes'}
];
const ctx={
 situationOptions:raw=>raw==='los derechos'||raw.startsWith('quiero crear')
  ?rightsBase():{focus:'el agua',reto:'¿Cómo cuidamos el agua?',situations:[{key:'A',title:'Agua',text:'Investigamos el agua'}]},
 productOptions:(raw)=>raw==='los derechos'||raw.startsWith('quiero crear')
  ?rightsProducts():[{key:'1',title:'Campaña del agua',text:'Afiches'}],
 window:{
  ddApplyExpertReasoningToProposal(_raw,p){
   // Reproducción de la regresión: muta la base y la reemplaza.
   if(p.focus==='los derechos de la niñez'){
    p.situations[0].text='En el entorno cercano de los estudiantes, se propone desarrollar el tema.';
    return {situations:[
      {key:'A',text:'El docente podrá completar después la situación'},
      {key:'B',text:'En el entorno cercano de los estudiantes...'}],
      products:[{key:'2',title:'Juego de mesa «Reto Tarpuy»'}],
      reto:'¿Qué evidencias necesitamos reunir sobre En el entorno cercano de los estudiantes?'};
   }
   return {products:[{key:'1',title:'Feria de la campaña de agua'}]};
  }
 },
 console
};
runInNewContext(src.slice(start,end)+'\nthis.generate=dataFor;',ctx);
for(const raw of ['los derechos','quiero crear una unidad de 3 semanas sobre los derechos']){
 const p=ctx.generate(raw);
 assert.equal(p.situations.length,2);
 assert.match(p.situations[0].text,/cuentos y situaciones ficticias/);
 assert.match(p.situations[1].text,/historias ilustradas/);
 assert.match(p.reto,/derechos y responsabilidades/);
 assert.match(p.products[1].title,/Expo interactiva/);
 assert(!p.situations.some(x=>/en el entorno cercano|el docente podrá completar|se propone desarrollar/i.test(x.text)));
}
const water=ctx.generate('el cuidado del agua');
assert.equal(water.products[0].title,'Feria de la campaña de agua','No bloquear la mejora experta en otros temas');
console.log('PASS v33: derechos conservan su situación segura y su producto frente a metarredacción experta');
