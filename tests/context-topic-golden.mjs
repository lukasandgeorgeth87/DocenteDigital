import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createContext,runInContext} from 'node:vm';

const source=readFileSync(new URL('../app.js',import.meta.url),'utf8');
const window={};
const document={body:{classList:{toggle(){}}},getElementById:()=>null,querySelectorAll:()=>[],querySelector:()=>null};
const context=createContext({window,document,localStorage:{getItem:()=>null,setItem(){}},console,Date,setTimeout,clearTimeout});
runInContext(source,context,{filename:'app.js'});
const samples=[
  ['Primavera','Observamos cambios de la primavera en el entorno.',/cambios de la primavera/i],
  ['Abejas','Vemos abejas cerca de algunas flores y queremos observarlas.',/abejas cerca de algunas flores/i],
  ['Biohuerto','Estamos trabajando en el biohuerto escolar y queremos registrar lo que sucede con nuestras plantas.',/biohuerto escolar/i],
  ['Agua','Queremos conocer cómo usamos el agua en la escuela.',/agua en la escuela/i],
  ['Familia','Queremos recoger saberes que nuestras familias comparten con nosotros.',/saberes que nuestras familias/i],
  ['Residuos','Observamos residuos en algunos espacios y queremos registrar lo que encontramos.',/residuos en algunos espacios/i],
  ['Lectura','Queremos mejorar la comprensión de textos informativos sobre nuestro entorno.',/comprensión de textos informativos/i],
  ['Alimentación','Queremos conocer mejor los alimentos que consumimos en nuestra comunidad.',/alimentos que consumimos/i],
  ['Tecnología','Queremos explorar cómo algunas herramientas tecnológicas ayudan en tareas cotidianas.',/herramientas tecnológicas/i],
  ['Patrimonio','En la comunidad encontramos pinturas rupestres.',/pinturas rupestres/i]
];
for(const [name,contextText,expected] of samples){
  const topic=window.ddContextTopic(contextText);
  assert.match(topic,expected,`${name}: pérdida del núcleo de la descripción: ${topic}`);
  assert.ok(topic.length<=105,`${name}: el foco es demasiado extenso`);
  assert.doesNotMatch(topic,/^(?:el|la|los|las)\s+(?:queremos|estamos|los estudiantes)/i);
  assert.doesNotMatch(topic,/Ccotataqui|Cusco/i,'No inventar localidad');
}
console.log('CONTEXT_TOPIC_GOLDEN_PASS: 10 contextos reales sintetizados sin inventar localidades');
