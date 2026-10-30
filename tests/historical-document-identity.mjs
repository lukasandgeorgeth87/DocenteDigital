import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createContext,runInContext} from 'node:vm';

// Regresión offline sobre el código real de planificación, enriquecimiento y
// exportación: cambiar de IE/docente o de unidad no puede reescribir lo guardado.
const source=name=>readFileSync(new URL(`../${name}`,import.meta.url),'utf8');
const elements={
  sessionUnit:{value:'u-a'},
  activity:{value:'0',selectedIndex:0,options:[{textContent:'Comunicación · Leemos sobre el biohuerto'}],closest:()=>null},
  sessionTitle:{value:'Leemos sobre el biohuerto'},
  sessionDuration:{value:'45 minutos'},
  sessionResources:{value:'Textos locales'}
};
const storage=new Map();
const window={
  DD_OFFICIAL_CURRICULUM:{pickCompetence:(level,area)=>({name:`Competencia referencial ${level} ${area}`})}
};
const document={
  body:{classList:{toggle(){}}},
  getElementById:id=>elements[id]||null,
  querySelectorAll:()=>[],querySelector:()=>null
};
class DOMParserMock {
  parseFromString(html){
    return{body:{children:[{tagName:'P',textContent:html.replace(/<[^>]*>/g,' '),children:[]}]}};
  }
}
const ctx=createContext({
  window,document,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,String(v))},
  DOMParser:DOMParserMock,TextEncoder,Uint8Array,Blob,Date,URL,setTimeout,clearTimeout,console
});
runInContext(source('app.js'),ctx,{filename:'app.js'});
runInContext('window.buildSession=buildSession; window.sessionHtml=sessionHtml; window.selectedActivity=selectedActivity; window.escapeHtml=escapeHtml;',ctx);
runInContext(source('session-learning-core-v54.js'),ctx,{filename:'session-learning-core-v54.js'});
runInContext(source('docx-export-v29.js'),ctx,{filename:'docx-export-v29.js'});

const state=window.state;
state.institutionMaster={ieName:'I.E. Los Pinos',teacherName:'Prof. Ana Quispe'};
state.teacherName='Prof. Ana Quispe';
state.level='Primaria';state.ieType='Multigrado';state.grades=['1.º','3.º'];
state.language='Quechua';state.quechuaVar='Quechua Chanka';
const snapshot=runInContext('documentContextFor(state.level,state.ieType,state.grades,state.language,state.quechuaVar)',ctx);
assert.equal(snapshot.institution,'I.E. Los Pinos');
assert.equal(snapshot.teacher,'Prof. Ana Quispe');

// Creación real de una Unidad/Proyecto: la nueva identidad se guarda al crear,
// no se consulta posteriormente durante la exportación.
Object.assign(elements,{
  unitType:{value:'Proyecto de aprendizaje'},unitDuration:{value:'2 semanas'},
  unitSituation:{value:'Exploramos cómo crecen las plantas de nuestra comunidad'},
  unitTitle:{value:'Cuidamos el biohuerto'},
  unitReady:{classList:{remove(){}}},unitOutput:{scrollIntoView(){}}
});
state.areas=['Comunicación'];
runInContext('renderUnits=()=>{}; renderUnitOutput=()=>{}; fillSessionUnits=()=>{}; createUnitDemo()',ctx);
assert.equal(state.units[0].documentContextSnapshot.institution,'I.E. Los Pinos');
assert.equal(state.units[0].documentContextSnapshot.teacher,'Prof. Ana Quispe');
assert.equal(state.units[0].documentContextSnapshot.level,'Primaria');
assert.deepEqual([...state.units[0].documentContextSnapshot.grades],['1.º','3.º']);

const unitA={
  id:'u-a',title:'Cuidamos el biohuerto',type:'Proyecto de aprendizaje',
  level:'Primaria',ieType:'Multigrado',grades:['1.º','3.º'],language:'Quechua',quechuaVar:'Quechua Chanka',
  situationBrief:'Exploramos el biohuerto',documentContextSnapshot:snapshot,
  activities:[{area:'Comunicación',title:'Leemos sobre el biohuerto'}]
};
const unitB={
  id:'u-b',title:'Medimos el agua',type:'Unidad de aprendizaje',
  level:'Secundaria',ieType:'Polidocente',grades:['4.º'],language:'Castellano',
  situationBrief:'Medimos consumo de agua',
  activities:[{area:'Matemática',title:'Resolvemos problemas de consumo del agua'}]
};
state.units=[unitA,unitB];
const sessionA=window.buildSession();
assert.equal(sessionA.documentContextSnapshot.teacher,'Prof. Ana Quispe');
assert.equal(sessionA.informativeData.institution,'I.E. Los Pinos');
const frozenPurpose=sessionA.purpose;
const frozenCriterion=sessionA.criterion;

// Configuración y selector ahora apuntan a otro colegio, docente, unidad y área.
state.institutionMaster={ieName:'I.E. Nuevo Horizonte',teacherName:'Prof. Luis Soto'};
state.teacherName='Prof. Luis Soto';
Object.assign(state,{level:'Secundaria',ieType:'Polidocente',grades:['4.º'],language:'Castellano'});
elements.sessionUnit.value='u-b';
elements.sessionTitle.value=unitB.activities[0].title;
window.ddSessionLearningCore.enrich(sessionA);
window.sessionHtml(sessionA);
assert.equal(sessionA.informativeData.institution,'I.E. Los Pinos');
assert.equal(sessionA.informativeData.teacher,'Prof. Ana Quispe');
assert.equal(sessionA.activityTitle,'Leemos sobre el biohuerto');
assert.equal(sessionA.purpose,frozenPurpose,'El propósito histórico no debe regenerarse con otra unidad');
assert.equal(sessionA.criterion,frozenCriterion,'El criterio histórico no debe regenerarse con otra área');

async function wordXml(documentContext){
  const blob=window.DDWordExport.createBlob('Sesión','<p>Contenido</p>',false,documentContext);
  const raw=new TextDecoder().decode(await blob.arrayBuffer());
  const start=raw.indexOf('<w:document '),end=raw.indexOf('</w:document>',start);
  assert.ok(start>=0&&end>start,'Se generó un DOCX OOXML válido');
  return raw.slice(start,end+'</w:document>'.length);
}
const historicalXml=await wordXml(sessionA.documentContextSnapshot);
assert.match(historicalXml,/I\.E\. Los Pinos/);
assert.match(historicalXml,/Prof\. Ana Quispe/);
assert.doesNotMatch(historicalXml,/Nuevo Horizonte|Luis Soto/);

// Los documentos previos sin snapshot deben mostrar una advertencia explícita,
// sin incorporar silenciosamente la nueva identidad.
const oldUnit={...unitA,id:'u-legacy',documentContextSnapshot:undefined};
state.units.push(oldUnit);
elements.sessionUnit.value='u-legacy';
elements.sessionTitle.value='Leemos sobre el biohuerto';
const legacy=window.buildSession();
assert.equal(legacy.documentContextSnapshot.historicalIdentityUnverified,true);
assert.equal(legacy.documentContextSnapshot.teacher,'');
legacy.informativeData={...legacy.informativeData,institution:'I.E. Nuevo Horizonte',teacher:'Prof. Luis Soto'};
const legacyHtml=window.sessionHtml(legacy);
assert.match(legacyHtml,/Identidad histórica por verificar/);
assert.equal(legacy.informativeData.institution,'','No mostrar la IE vigente como dato histórico');
assert.equal(legacy.informativeData.teacher,'','No mostrar al docente vigente como dato histórico');
const legacyXml=await wordXml(legacy.documentContextSnapshot);
assert.match(legacyXml,/Identidad histórica por verificar/);
assert.doesNotMatch(legacyXml,/Nuevo Horizonte|Luis Soto/);

console.log('HISTORICAL_DOCUMENT_IDENTITY_PASS: IE/docente, actividad, propósito y criterio preservados en vista y DOCX');
