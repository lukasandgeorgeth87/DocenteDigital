// Fase 35: en Primaria, «los derechos» ofrece siempre situación A/B y producto 2 Expo.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const code=readFileSync(new URL('../proposal-choice-v8.js',import.meta.url),'utf8');
const a=code.indexOf('  function isBriefRightsTopic(raw){');
const b=code.indexOf('  function showSituations(brief,type){',a);
assert(a>=0&&b>a);
const ctx={tidy:s=>String(s||'').replace(/\s+/g,' ').trim()};
runInNewContext(code.slice(a,b)+'\nthis.isRights=isBriefRightsTopic;this.pack=briefRightsPack;',ctx);
for(const topic of ['los derechos','Los derechos','derechos de la niñez','derechos de los niños']){
 assert.equal(ctx.isRights(topic),true);
 const p=ctx.pack({focus:'tema genérico',reto:'Reto administrativo',
  situations:[{key:'A',text:'El docente podrá completar'}],
  products:[{key:'2',title:'Juego de mesa Reto Tarpuy'}]});
 assert.equal(p.situations.length,2);
 assert.match(p.situations[1].text,/historias ilustradas/);
 assert(!p.situations.some(x=>/el docente podrá completar|se propone desarrollar|en el entorno cercano/i.test(x.text)));
 assert.equal(p.products[1].key,'2');
 assert.match(p.products[1].title,/Expo interactiva/);
 assert.match(p.reto,/derechos y responsabilidades/);
}
for(const topic of ['el cuidado del agua','derechos en caso de discriminación real','la fiesta de todos los santos'])
 assert.equal(ctx.isRights(topic),false,'No alterar otros contextos: '+topic);
assert(code.includes("if(state.level==='Primaria'&&isBriefRightsTopic(brief))d=briefRightsPack(d)"));
console.log('PASS v35: propuestas y Expo deterministas en petición breve sobre los derechos');
