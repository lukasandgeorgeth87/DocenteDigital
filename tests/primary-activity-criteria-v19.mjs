import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const source=readFileSync(new URL('../unit-export-quality-v11.js',import.meta.url),'utf8');
const pickCompetence=(level,area,title)=>{
  const t=String(title||'').toLowerCase();
  if(area==='Comunicación')return {name:/revis|redact|escrib|borrador/.test(t)
    ?'Escribe diversos tipos de textos en su lengua materna':/leer|leemos|texto informativo/.test(t)
    ?'Lee diversos tipos de textos escritos en su lengua materna':'Se comunica oralmente en su lengua materna'};
  if(area==='Matemática')return {name:'Resuelve problemas de gestión de datos e incertidumbre'};
  if(area==='Ciencia y Tecnología')return {name:'Indaga mediante métodos científicos para construir sus conocimientos'};
  return {name:'Convive y participa democráticamente en la búsqueda del bien común'};
};
const window={unitWordHtml:()=>'<p>versión antigua</p>',DD_OFFICIAL_CURRICULUM:{pickCompetence}};
runInNewContext(source,{window});
const qa=window.DD_UNIT_EXPORT_QUALITY_V11;
assert(qa,'Exportador no inicializado');
const central='¿Cómo podemos investigar el uso del agua para reducir su desperdicio?';
const unit={
 type:'Unidad de aprendizaje',level:'Primaria',title:'Investigamos y actuamos para proteger el agua',
 ieType:'Polidocente',grades:['6.º'],areas:['Comunicación','Matemática','Personal Social','Ciencia y Tecnología'],
 duration:'3 semanas',reto:central,product:'Campaña «Guardianes del agua», con informe, gráficos, recomendaciones, materiales y compromisos',
 situation:'En la comunidad algunas personas desperdician agua. Los estudiantes investigan sus causas. El reto será: '+central,
 situationBrief:'Contexto: El agua es importante y debemos cuidarla.',
 documentContextSnapshot:{institution:'IE de prueba',teacher:'Docente de prueba'},
 purposes:[],
 activities:[
 {week:1,day:'Lunes',area:'Comunicación',title:'Dialogamos sobre el uso y cuidado del agua',order:1,time:'08:00'},
 {week:1,day:'Martes',area:'Ciencia y Tecnología',title:'Formulamos preguntas investigables sobre el uso y cuidado del agua',order:2,time:'09:30'},
 {week:1,day:'Miércoles',area:'Matemática',title:'Planteamos preguntas que podemos responder con datos sobre el agua',order:3,time:'08:00'},
 {week:2,day:'Jueves',area:'Comunicación',title:'Leemos información sobre el agua',order:4,time:'08:00'},
 {week:2,day:'Viernes',area:'Ciencia y Tecnología',title:'Comparamos los datos obtenidos con nuestras predicciones',order:5,time:'09:30'},
 {week:2,day:'Viernes',area:'Personal Social',title:'Analizamos decisiones para el bien común',order:6,time:'11:00'},
 {week:3,day:'Lunes',area:'Comunicación',title:'Redactamos mensajes claros para la campaña',order:7,time:'08:00'},
 {week:3,day:'Miércoles',area:'Comunicación',title:'Revisamos y mejoramos los textos de la campaña Guardianes del agua',order:8,time:'08:00'},
 {week:3,day:'Viernes',area:'Comunicación',title:'Presentamos y evaluamos los mensajes de la campaña',order:9,time:'08:00'},
 {week:3,day:'Viernes',area:'Ciencia y Tecnología',title:'Seleccionamos evidencias científicas para nuestras recomendaciones',order:10,time:'11:00'}
 ]
};
const html=window.unitWordHtml(unit);
assert.equal((html.match(/¿Cómo podemos investigar el uso del agua para reducir su desperdicio\?/g)||[]).length,1,'Reto duplicado en Word');
assert.equal(qa.situation(unit).includes('El reto será:'),false,'La situación impresa repite el reto');
assert.match(html,/Campa[nñ]a «Guardianes del agua», con informe, gráficos, recomendaciones, materiales y compromisos/);
assert.match(qa.gradeAction('Comunicación','Revisamos y mejoramos los textos de la campaña', '6.º'),/Revisa la coherencia/);
assert.match(qa.gradeAction('Comunicación','Revisamos y mejoramos los textos de la campaña', '4.º'),/Revisa la claridad/);
assert.match(qa.gradeAction('Comunicación','Leemos información del agua', '6.º'),/Contrasta información/);
assert.match(qa.gradeAction('Ciencia y Tecnología','Formulamos preguntas investigables sobre el agua', '6.º'),/Formula una pregunta investigable/);
assert.match(qa.gradeAction('Ciencia y Tecnología','Comparamos los datos obtenidos con nuestras predicciones', '6.º'),/Analiza datos/);
assert.match(qa.gradeAction('Matemática','Planteamos preguntas que podemos responder con datos', '6.º'),/preguntas de investigación estadística/);
assert.match(html,/Borrador con correcciones justificadas y versión mejorada/);
assert.match(html,/Pregunta investigable y variables propuestas/);
assert.match(html,/Preguntas estadísticas y variables por registrar/);
assert.match(html,/Escribe diversos tipos de textos en su lengua materna/);
assert.match(html,/Lee diversos tipos de textos escritos en su lengua materna/);
assert.equal((html.match(/<b>Comunicación<\/b><br>/g)||[]).length>=3,true,'Faltan filas separadas por competencias de Comunicación');
assert(!html.includes('versión antigua'));
assert.match(qa.gradeAction('Ciencia y Tecnología','Indagamos cambios de la masa', '5.º'),/variables/);
console.log('PASS v19: reto único, escritura vs lectura, criterios y evidencias por actividad y competencia');