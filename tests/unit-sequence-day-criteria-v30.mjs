// Fase 30: el día en la ruta debe ser el que tiene la sesión guardada.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const src=readFileSync(new URL('../enhancements.js',import.meta.url),'utf8');
const start=src.indexOf('  function ddSequenceHtml(unit){');
const end=src.indexOf('  function ddRegisterHtml(unit){',start);
assert(start>=0&&end>start);
const area='Personal Social',official='Convive y participa democráticamente en la búsqueda del bien común';
const context={
 window:{DD_UNIT_EXPORT_QUALITY_V11:{
   gradeAction:(_area,title,grade)=>'Criterio '+grade+' para '+title,
   evidence:(_area,title)=>'Evidencia de '+title}},
 ddPickOfficialCompetence:()=>({name:official}),
 ddTable:(rows,headers)=>'<table>'+headers.join(' | ')+'<tbody>'+rows+'</tbody></table>',
 E:v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
};
runInNewContext(src.slice(start,end)+'\nthis.sequence=ddSequenceHtml;',context);
const activities=[
 {week:1,day:'Lunes',time:'',area,title:'Dialogamos sobre nuestros derechos'},
 {week:1,day:'Lunes',time:'',area,title:'Reconocemos acuerdos de convivencia'},
 {week:1,day:'Martes',time:'',area,title:'Deliberamos sobre el derecho a jugar'},
 {week:1,day:'Martes',time:'',area,title:'Respetamos diferentes opiniones'}
];
const unit={level:'Primaria',grades:['1.º','3.º','5.º'],purposes:[{area,
 criteria:[{grade:'1.º',text:'CRITERIO GENÉRICO INCORRECTO'}],
 evidence:'EVIDENCIA GENÉRICA INCORRECTA',instrument:'Escala de valoración'}],activities};
const html=context.sequence(unit);
assert.equal((html.match(/Semana 1<br>Lunes/g)||[]).length,2,'Ambas sesiones deben conservar lunes');
assert.equal((html.match(/Semana 1<br>Martes/g)||[]).length,2,'Ambas sesiones deben conservar martes');
for(const activity of activities){
 assert(html.includes('Evidencia de '+activity.title));
 for(const grade of unit.grades)assert(html.includes('Criterio '+grade+' para '+activity.title));
}
assert(!html.includes('CRITERIO GENÉRICO INCORRECTO'));
assert(!html.includes('EVIDENCIA GENÉRICA INCORRECTA'));
assert(!html.includes('Semana 1<br>Miércoles'),'No inventar días por posición');
console.log('PASS v30: día, criterio y evidencia por sesión coherentes con exportación Word');
