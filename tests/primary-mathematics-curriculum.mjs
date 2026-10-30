import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createContext,runInContext} from 'node:vm';

const source=f=>readFileSync(new URL(`../${f}`,import.meta.url),'utf8');
const window={};
const ctx=createContext({window,state:{level:'Primaria'},document:{readyState:'complete',getElementById:()=>null}});
runInContext(source('official-curriculum-v1.js'),ctx);
runInContext(source('primary-mathematics-source-pages-v7.js'),ctx);
const core=window.DD_OFFICIAL_CURRICULUM,refs=window.DD_PRIMARY_MATHEMATICS_PAGES;
const expected={
  cantidad:{name:'Resuelve problemas de cantidad',III:[238,239],IV:[240,241],V:[242,243]},
  regularidad:{name:'Resuelve problemas de regularidad, equivalencia y cambio',III:[248,249],IV:[250,251],V:[252,253]},
  forma:{name:'Resuelve problemas de forma, movimiento y localización',III:[258,259],IV:[260,261],V:[262,263]},
  datos:{name:'Resuelve problemas de gestión de datos e incertidumbre',III:[268,268],IV:[269,270],V:[271,272]}
};
const entries=core.getArea('Primaria','Matemática');
assert.equal(entries.length,4);
assert.deepEqual([...entries.map(c=>c.capacities.length)],[4,4,4,4]);
assert.equal(refs.source.attachedPdfPageCount,396);
assert.equal(refs.source.attachedPdfSha256.length,64);
let checked=0;
for(const [mode,info] of Object.entries(expected)){
  assert.ok(entries.some(c=>c.name===info.name));
  for(const grade of ['1.º','2.º','3.º','4.º','5.º','6.º']){
    const entry=refs.forGrade(mode,grade);
    assert.equal(entry.competence,info.name);
    const [first,last]=info[entry.cycle];
    assert.equal(entry.standardPdfPage,first);
    assert.equal(entry.performancePdfPages[0],first);
    assert.equal(entry.performancePdfPages.at(-1),last);
    assert.equal(entry.literalPerformanceIncluded,false);
    assert.equal(entry.teacherVerificationRequired,true);
    checked++;
  }
}
const titles=[
  ['Calculamos la masa de las semillas','cantidad'],
  ['Resolvemos problemas de cantidad vinculados con el biohuerto','cantidad'],
  ['Sumamos y restamos cantidades','cantidad'],
  ['Completamos patrones de crecimiento','regularidad'],
  ['Resolvemos equivalencias y cambios','regularidad'],
  ['Calculamos el perímetro del biohuerto','forma'],
  ['Medimos la longitud del patio','forma'],
  ['Ubicamos figuras en el plano cartesiano','forma'],
  ['Organizamos datos en pictogramas','datos'],
  ['Representamos datos de una encuesta','datos'],
  ['Analizamos la frecuencia y la moda','datos']
];
for(const [title,mode] of titles){
  assert.equal(core.mathematicsModeFromTitle(title),mode,`Clasificación incorrecta: ${title}`);
  assert.equal(core.pickCompetence('Primaria','Matemática',title).name,expected[mode].name);
}
assert.equal(core.mathematicsModeFromTitle('Exploramos nuestra escuela'),'indefinido');
const selected=refs.forSession({level:'Primaria',area:'Matemática',title:'Calculamos el perímetro del huerto',grades:['2.º','6.º']});
assert.deepEqual([...selected.map(x=>x.cycle)],['III','V']);
assert.deepEqual([...selected.map(x=>x.standardPdfPage)],[258,262]);
assert.deepEqual([...refs.forSession({level:'Inicial',area:'Matemática',title:'Sumamos cantidades',grades:['5 años']})],[]);
assert.deepEqual([...refs.forSession({level:'Primaria',area:'Comunicación',title:'Sumamos cantidades',grades:['3.º']})],[]);
console.log(`PRIMARY_MATHEMATICS_CURRICULUM_PASS: 4 competencias, 16 capacidades, ${checked} referencias grado/competencia y 11 títulos`);
