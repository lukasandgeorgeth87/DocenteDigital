import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const file=name=>readFileSync(new URL('../'+name,import.meta.url),'utf8');
const app=file('app.js');
const start=app.indexOf('function contextTopicFromBrief(brief){');
const end=app.indexOf('window.ddContextTopic=contextTopicFromBrief;',start);
assert(start>=0&&end>start,'No se encontró el extractor del tema');
const context={window:{}};
runInNewContext(app.slice(start,end+'window.ddContextTopic=contextTopicFromBrief;'.length),context);
const brief=[
'Quiero crear una UNIDAD DE APRENDIZAJE.',
'Título: Cuidamos el agua para cuidar la vida.',
'Nivel: Educación Primaria.',
'Grado: 4.º grado.',
'Duración: 3 semanas, con 2 sesiones diarias.',
'Áreas curriculares: Comunicación, Matemática, Personal Social y Ciencia y Tecnología.',
'Contexto: En nuestra comunidad el agua es indispensable para beber, cocinar y regar. Sin embargo, algunas personas dejan los caños abiertos y desperdician agua. Los estudiantes desean investigar cómo se utiliza el agua.',
'Pregunta retadora: ¿Cómo podemos investigar el uso del agua y promover acciones responsables?',
'Producto final: Campaña escolar «Cada gota cuenta».',
'Indicaciones pedagógicas: Evitar repetir actividades y preparar el Word.'
].join('\n');
const topic=context.window.ddContextTopic(brief);
assert.match(topic,/uso y cuidado del agua/i);
assert.doesNotMatch(topic,/tema solicitado|crear una unidad|grado/i);
assert.match(context.window.ddContextTopic(brief.replace(/\n/g,' ')),/uso y cuidado del agua/i);
assert.match(context.window.ddContextTopic('Quiero crear una unidad para 2.º grado sobre la alimentación saludable.'),/alimentaci[oó]n saludable/i);
const originalCreative=file('creative-runtime-v18.js');
const injection='  function paintSituations(){';
assert(originalCreative.includes(injection));
const runnable=originalCreative.replace(injection,'  window.__testEnsureCreative=ensureCreativeData;\n'+injection);
const pending={
  brief,type:'Unidad de aprendizaje',
  contextFocus:'el tema solicitado por el docente',
  situations:[{key:'A',title:'Propuesta 1',text:'En la institución educativa investigaremos el tema solicitado por el docente.'}],
  products:[{key:'1',title:'Portafolio del tema solicitado por el docente',text:'Un portafolio sobre el tema solicitado por el docente.'}]
};
const uiWindow={
  ddContextTopic:context.window.ddContextTopic,
  ddCreativeChoices:()=>({situations:pending.situations,products:pending.products})
};
const ui={
  window:uiWindow,state:{pendingUnitChoice:pending,grades:['4.º']},
  save(){},escapeHtml:x=>String(x),
  document:{addEventListener(){},createElement(){return {textContent:''}},head:{appendChild(){}}}
};
runInNewContext(runnable,ui);
const d=uiWindow.__testEnsureCreative();
assert.match(d.situations[0].text,/uso y cuidado del agua/i);
assert.match(d.products[0].title,/uso y cuidado del agua/i);
assert.doesNotMatch(d.situations[0].text,/tema solicitado por el docente/i);
assert.doesNotMatch(d.products[0].text,/tema solicitado por el docente/i);
const auditWindow={};
runInNewContext(file('planning-chain-integrity-v10.js'),{window:auditWindow,state:{units:[]}});
const bad={
  title:'Lo que aprendemos tiene un propósito: cuidar la vida',type:'Unidad de aprendizaje',level:'Primaria',
  grades:['4.º'],areas:['Comunicación'],situationBrief:brief,
  situation:'Los estudiantes investigarán el tema solicitado por el docente.',
  reto:'¿Qué debemos investigar sobre el tema solicitado por el docente?',
  product:'Campaña escolar «Cada gota cuenta»',
  activities:[{area:'Comunicación',title:'Dialogamos sobre el tema solicitado por el docente',time:'08:00'}]
};
const checked=auditWindow.DD_PLANNING_CHAIN_V10.auditUnit(bad);
assert.equal(checked.ok,false);
assert(checked.warnings.some(w=>w.id==='placeholder-sessions'));
assert(checked.warnings.some(w=>w.id==='explicit-title-differs'));
assert(checked.warnings.some(w=>w.id.startsWith('placeholder-')));
const good={
 ...bad,title:'Cuidamos el agua para cuidar la vida',
 situation:'En la comunidad algunos caños permanecen abiertos y los estudiantes desean investigar el uso y cuidado del agua.',
 reto:'¿Cómo investigar el cuidado del agua y evitar el desperdicio?',
 activities:[{area:'Comunicación',title:'Dialogamos sobre el cuidado del agua',time:'08:00'}]
};
const right=auditWindow.DD_PLANNING_CHAIN_V10.auditUnit(good);
assert(!right.warnings.some(w=>w.id.startsWith('placeholder-')));
assert(!right.warnings.some(w=>w.id==='explicit-title-differs'));
console.log('PASS v17: tema, títulos, propuestas automáticas, y alerta de relleno genérico');
