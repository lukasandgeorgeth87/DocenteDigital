import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createContext,runInContext} from 'node:vm';

// Prueba del núcleo real, no una competencia simulada. La matriz literal
// de desempeños por grado sigue pendiente y NO se suplanta aquí.
const officialSource=readFileSync(new URL('../official-curriculum-v1.js',import.meta.url),'utf8');
const window={};
const context=createContext({window,state:{level:'Primaria'},document:{readyState:'complete',getElementById:()=>null}});
runInContext(officialSource,context,{filename:'official-curriculum-v1.js'});
const curriculum=window.DD_OFFICIAL_CURRICULUM;
assert.equal(curriculum.sourceFor('Primaria').id,'PC-PRIMARIA');
assert.equal(curriculum.performanceMatrixReady,false,'No afirmar que existen desempeños literales verificados');
const entries=curriculum.getArea('Primaria','Comunicación');
assert.equal(entries.length,3,'Deben existir las tres competencias de Comunicación');
const byMode={
  oral:'Se comunica oralmente en su lengua materna',
  lectura:'Lee diversos tipos de textos escritos en su lengua materna',
  escritura:'Escribe diversos tipos de textos en su lengua materna'
};
assert.deepEqual([...entries.map(c=>c.capacities.length)],[6,3,4]);
for(const [mode,name] of Object.entries(byMode))assert.ok(entries.some(c=>c.name===name),`${mode}: competencia ausente`);

const examples=[
  ['Dialogamos sobre la lectura de las semillas','oral'],
  ['Escuchamos y leemos un relato','oral'],
  ['Presentamos nuestros argumentos','oral'],
  ['Leemos textos y escribimos un resumen','lectura'],
  ['Comprendemos un relato','lectura'],
  ['Escribimos un texto y luego lo leemos','escritura'],
  ['Revisamos un texto para publicarlo','escritura'],
  ['Redactamos una carta y la compartimos','escritura']
];
for(const [title,mode] of examples){
  assert.equal(curriculum.communicationModeFromTitle(title),mode,`Clasificación equivocada: ${title}`);
  assert.equal(curriculum.pickCompetence('Primaria','Comunicación',title).name,byMode[mode],`Competencia equivocada: ${title}`);
}
assert.equal(curriculum.communicationModeFromTitle('Exploramos experiencias comunicativas'),'indefinido');
console.log('PRIMARY_COMMUNICATION_CURRICULUM_PASS: 3 competencias, 13 capacidades, 8 títulos y guardia de desempeños');
