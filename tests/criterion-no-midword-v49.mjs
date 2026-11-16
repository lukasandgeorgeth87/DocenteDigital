// Regressión comercial: la lista de cotejo no debe heredar una situación
// truncada a mitad de palabra como criterio de revisión docente.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const source=readFileSync(new URL('../enhancements.js',import.meta.url),'utf8');
const start=source.indexOf('  function ddConciseContext(value){');
const end=source.indexOf('  function ddOfficialSource(',start);
assert(start>=0&&end>start,'No se encontraron funciones curriculares');
const ctx={};
runInNewContext(source.slice(start,end)+'\nthis.context=ddConciseContext;this.criterion=ddCriterion;',ctx);

const narratives=[
  'El aula trabaja con relatos ficticios y preguntas de lectura para escuchar distintas voces y expresarse con respeto.',
  'La comunidad conversa sobre los derechos de niñas y niños en la escuela, para reflexionar sobre el buen trato.',
  'Los estudiantes investigan sobre tradiciones y costumbres de la comunidad altoandina que merecen protección y valoración.',
];

for(const narrative of narratives){
  const focus=ctx.context(narrative);
  assert(focus.length<=92,'El foco breve no debe ser un párrafo entero: '+focus);
  assert(!/\b(?:de|del|para|con|y|el|la|los|las)\s*$/i.test(focus),'Foco cortado: '+focus);
  const criterion=ctx.criterion('Comunicación','3.º',narrative,'Primaria');
  assert(criterion.includes(focus),'El criterio debe usar el foco contextualizado');
}

assert.equal(ctx.context(narratives[0]),'los relatos y las distintas voces');
assert(!ctx.criterion('Comunicación','3.º',narratives[0],'Primaria').includes('escuchar dis'));
assert.equal(ctx.context('Cuidamos el agua en Ccotataqui'),'el cuidado del agua');
assert.equal(ctx.context('Celebramos Todos los Santos'),'las costumbres de Todos los Santos');
console.log('PASS v49: criterios contextualizados completos, sin cortes a mitad de palabra');
