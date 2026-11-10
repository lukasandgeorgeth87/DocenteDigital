// Fase 28: instrumentos en Chrome y Word usan los mismos criterios y niveles.
// Incluye unidad multigrado sin modificar los módulos de exportación.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const read=name=>readFileSync(new URL('../'+name,import.meta.url),'utf8');
const qualityWindow={unitWordHtml:()=>''};
runInNewContext(read('unit-export-quality-v11.js'),{window:qualityWindow});
const quality=qualityWindow.DD_UNIT_EXPORT_QUALITY_V11;
assert.equal(typeof quality.instrumentLevels,'function');
const source=read('enhancements.js');
const start=source.indexOf('    function ddInstrumentHtml(unit){');
const end=source.indexOf('    function ddSection(',start);
assert(start>=0&&end>start);
const official='Se comunica oralmente en su lengua materna';
const ctx={
 window:{DD_UNIT_EXPORT_QUALITY_V11:quality},
 E:s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),
 ddPickOfficialCompetence:()=>({name:official}),
 ddCriterion:()=> 'Criterio genérico temporal',
 ddTable:(rows,headers)=>'<table><thead>'+headers.join(' | ')+'</thead><tbody>'+rows+'</tbody></table>'
};
runInNewContext(source.slice(start,end)+'\nthis.render=ddInstrumentHtml;',ctx);
const unit={
 level:'Primaria',grades:['1.º','3.º','5.º'],
 situationBrief:'Investigamos los derechos con relatos ficticios',
 purposes:[{area:'Comunicación',officialCompetencies:[{name:official}],evidence:'Intervención oral registrada'}],
 activities:[{area:'Comunicación',title:'Dialogamos sobre nuestros derechos'}]
};
const ui=ctx.render(unit);
for(const grade of unit.grades){
 const crit=quality.gradeAction('Comunicación',unit.activities[0].title,grade);
 const desc=quality.instrumentLevels({area:'Comunicación',competence:official,activity:unit.activities[0].title,grade,criterion:crit});
 assert(ui.includes('Grado: '+grade),'No se encontró '+grade);
 assert(ui.includes(crit),'Criterio distinto en Chrome para '+grade);
 for(const key of ['C','B','A','AD'])assert(ui.includes(desc[key]),'Nivel '+key+' distinto en Chrome para '+grade);
}
assert(!ui.includes('Requiere apoyo para demostrar los elementos del criterio.'));
assert(ui.includes('Borradores pedagógicos por competencia y grado'));
console.log('PASS v28: criterios y rúbricas con paridad Chrome-Word y diferenciación multigrado');
