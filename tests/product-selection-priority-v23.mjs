// Regresión: la última elección explícita entre tarjeta y texto libre controla
// producto guardado, sesiones y Word. Nunca gana un texto precargado anterior.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const src=readFileSync(new URL('../proposal-choice-v8.js',import.meta.url),'utf8');
const start=src.indexOf('  function resolveProductChoice(');
const end=src.indexOf('  function showProducts(',start);
assert(start>0&&end>start,'El selector debe exponer una función pura comprobable');
const ctx={};
runInNewContext(
  'const tidy=s=>String(s||"").replace(/\\s+/g," ").trim();\n'+
  'const plain=s=>String(s||"").replace(/\\*\\*/g,"").replace(/__+/g,"").trim();\n'+
  src.slice(start,end)+'\nthis.pick=resolveProductChoice;',ctx);
const products=[
  {key:'1',title:'Portafolio de evidencias sobre los derechos',text:'Carpeta de evidencias'},
  {key:'2',title:'Expo interactiva: descubrimos nuestros derechos',text:'Muestra por estaciones'},
  {key:'3',title:'Guía ilustrada de los derechos',text:'Guía explicativa'}
];
const choice=ctx.pick('Juego de mesa «Reto Tarpuy»','2','card',products,'Producto final indicado por el docente');
assert.equal(choice.title,products[1].title,'La tarjeta elegida gana a un texto autocompletado');
assert.equal(choice.description,products[1].text);
assert.equal(choice.key,'2');
const manual=ctx.pick('Mural de compromisos sobre derechos','2','own',products,'');
assert.equal(manual.title,'Mural de compromisos sobre derechos','El texto ingresado después de elegir tarjeta gana');
assert.equal(manual.key,'');
const explicit=ctx.pick('Campaña escolar Guardianes del agua',undefined,null,products,'Producto final indicado por el docente');
assert.equal(explicit.title,'Campaña escolar Guardianes del agua','Un producto explícito no debe perderse');
const assisted=ctx.pick('Incluye paneles, preguntas y respuestas',undefined,'own',products,'Museo interactivo sobre nuestros derechos');
assert.equal(assisted.title,'Museo interactivo sobre nuestros derechos');
assert.equal(assisted.description,'Incluye paneles, preguntas y respuestas');
assert.equal(ctx.pick('',undefined,null,products,''),null);
assert(src.includes("productChoiceSource='card'"),'Registrar selección explícita de tarjeta');
assert(src.includes("productChoiceSource='own'"),'Registrar selección explícita de texto libre');
assert(src.includes('lastExplicitProductSelection?tidy(pending.selectedProductTitle)||declaredProduct'),'Persistir el nombre elegido');
assert(src.includes('unit.productTitle=unit.product'),'Título del producto coherente en unidades y sesiones');
console.log('PASS v23: prioridad de producto por última elección, tarjeta, texto y exportación');
