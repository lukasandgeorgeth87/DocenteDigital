import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createContext,runInContext} from 'node:vm';

const source=filename=>readFileSync(new URL(`../${filename}`,import.meta.url),'utf8');
const window={};
const context=createContext({window,state:{level:'Primaria'},document:{readyState:'complete',getElementById:()=>null}});
runInContext(source('official-curriculum-v1.js'),context);
runInContext(source('primary-communication-source-pages-v6.js'),context);
const refs=window.DD_PRIMARY_COMMUNICATION_PAGES;
assert.equal(refs.source.attachedPdfPageCount,396);
assert.equal(refs.source.attachedPdfSha256.length,64);
const expected={
  oral:{III:[152,152,153],IV:[154,154,155],V:[158,158,160]},
  lectura:{III:[164,164,165],IV:[166,166,167],V:[168,168,169]},
  escritura:{III:[174,174,175],IV:[176,176,177],V:[178,178,179]}
};
let checks=0;
for(const [mode,cycles] of Object.entries(expected)){
  for(const grade of ['1.º','2.º','3.º','4.º','5.º','6.º']){
    const ref=refs.forGrade(mode,grade);
    assert.ok(ref);
    const [standard,first,last]=cycles[ref.cycle];
    assert.equal(ref.standardPdfPage,standard);
    assert.equal(ref.performancePdfPages[0],first);
    assert.equal(ref.performancePdfPages.at(-1),last);
    assert.equal(ref.literalPerformanceIncluded,false);
    assert.equal(ref.teacherVerificationRequired,true);
    checks++;
  }
}
const caseSession={level:'Primaria',area:'Comunicación',grades:['2.º','6.º'],title:'Escribimos un texto para la escuela'};
const selected=refs.forSession(caseSession);
assert.deepEqual([...selected.map(s=>s.cycle)],['III','V']);
assert.deepEqual([...selected.map(s=>s.grade)],['2.º','6.º']);
assert.equal(selected[0].standardPdfPage,174);
assert.equal(selected[1].standardPdfPage,178);
assert.deepEqual([...refs.forSession({...caseSession,level:'Secundaria'})],[]);
assert.deepEqual([...refs.forSession({...caseSession,area:'Matemática'})],[]);
assert.deepEqual([...refs.forSession({...caseSession,title:'Exploramos recursos escolares'})],[]);
console.log(`PRIMARY_COMMUNICATION_SOURCE_PAGES_PASS: ${checks} cruces competencia/grado con páginas oficiales, sin desempeños inventados`);
