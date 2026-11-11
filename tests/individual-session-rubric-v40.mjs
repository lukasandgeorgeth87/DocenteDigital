// Fase 40: sesión individual y Word heredan descriptores por competencia/grado.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const env={window:{unitWordHtml:()=>''}};
runInNewContext(read('unit-export-quality-v11.js'),env);
const quality=env.window.DD_UNIT_EXPORT_QUALITY_V11;
assert.equal(typeof quality.instrumentLevels,'function');
const source=read('enhancements.js');
const a=source.indexOf('  function ddSessionRubricLevels(session,grade,criterion){');
const b=source.indexOf('  sessionHtml=function(session,forWord=false){',a);
assert(a>=0&&b>a);
const ctx={
 window:{DD_UNIT_EXPORT_QUALITY_V11:quality},
 ddSessionCompetence:s=>({name:s.competence||''})
};
runInNewContext(source.slice(a,b)+'\nthis.rubric=ddSessionRubricLevels;',ctx);
const s={level:'Primaria',area:'Comunicación',title:'Dialogamos sobre nuestros derechos',
 competence:'Se comunica oralmente en su lengua materna'};
const first=ctx.rubric(s,'1.º','Comunica ideas sencillas con apoyo.');
assert.match(first.A,/Comunica ideas sencillas/);
assert.doesNotMatch(first.A,/razones pertinentes/);
const sixth=ctx.rubric(s,'6.º','Presenta argumentos sobre derechos');
assert.match(sixth.A,/razones pertinentes/);
assert.match(sixth.AD,/argumentos|evidencias|Contrasta/);
assert.notEqual(first.A,sixth.A);
const math={level:'Primaria',area:'Matemática',title:'Representamos datos de la encuesta',
 competence:'Resuelve problemas de gestión de datos e incertidumbre'};
const m=ctx.rubric(math,'5.º','Interpreta gráficos de la encuesta');
assert.match(m.A,/Organiza y representa|Formula preguntas/);
const noQ={...ctx,window:{}};
runInNewContext(source.slice(a,b)+'\nthis.rubric=ddSessionRubricLevels;',noQ);
assert.match(noQ.rubric({...s,level:'Secundaria'},'4.º','Explica razones').A,/evidencia solicitada/);
assert(source.includes('const levels=ddSessionRubricLevels(session,g,criterion)'));
for(const level of ['C','B','A','AD'])assert(source.includes('E(levels.'+level+')'));
assert(!source.includes('Requiere apoyo para evidenciar el criterio.'));
console.log('PASS v40: rúbricas de sesión diferenciadas, coherentes con unidad y Word');
