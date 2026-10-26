import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const source=readFileSync(new URL('../openai-runtime-v1.js',import.meta.url),'utf8');
const storage=new Map();
const localStorage={
  getItem:key=>storage.get(key)||null,
  setItem:(key,value)=>storage.set(key,String(value))
};
const tokenInput={value:'temporary-preview-token-12345678901234567890'};
const message={textContent:''};
const card={innerHTML:''};
const hubCard={set innerHTML(value){this._html=value;nodes.ddAiConnectedCard=card;},get innerHTML(){return this._html||'';}};
const hub={querySelectorAll:()=>[{},hubCard]};
const nodes={
  aihub:hub,ddAiBetaToken:tokenInput,
  ddAiBetaSave:{onclick:null},ddAiBetaMessage:message,
  ddAiChatSend:{},ddAiRetryStatus:{},ddAiTestReal:{},
  ddAiUsage:{textContent:''}
};
const document={
  readyState:'complete',body:{},
  getElementById:id=>nodes[id]||null
};
const window={state:{}};
let captured=null;
const fetch=async(url,options={})=>{
  if(url==='/api/ai-status')return {ok:true,json:async()=>({
    ok:true,configured:true,enabled:true,access_configured:true,
    access_required:true,text:true,image:true,verified:false
  })};
  if(url==='/api/ai'){
    captured=options;
    return {ok:true,status:200,json:async()=>({
      ok:true,data:{result:'CONEXION_OK',options:[],warnings:[],teacher_note:''},
      usage:{input_tokens:2,output_tokens:1}
    })};
  }
  throw Error('Unexpected URL '+url);
};
class MutationObserver{observe(){}}
runInNewContext(source,{window,document,fetch,localStorage,MutationObserver,setTimeout,clearTimeout,AbortController,console});
assert.equal(typeof nodes.ddAiBetaSave.onclick,'function','Private beta token control must be installed');
nodes.ddAiBetaSave.onclick();
assert.equal(tokenInput.value,'','The token must be removed from the input field after loading');
assert.match(message.textContent,/solo en memoria/);
const result=await window.DDOpenAI.request('contextual_help','Hola');
assert.equal(result.data.result,'CONEXION_OK');
assert.equal(captured.headers['x-dd-beta-token'],'temporary-preview-token-12345678901234567890');
assert.equal([...storage.keys()].some(k=>/token|secret|beta/i.test(k)),false,'Never persist access tokens in localStorage');
assert.equal([...storage.values()].some(v=>v.includes('temporary-preview-token')),false);
window.state={
  activeUnitId:'u1',
  units:[{id:'u1',type:'Proyecto de aprendizaje',title:'Biohuerto',reto:'¿Cómo sembrar hortalizas?',product:'Biohuerto escolar'}],
  lastSession:{unitId:'u1',title:'Medimos nuestro biohuerto',area:'Matemática',purpose:'Medir el terreno',criterion:'Explica cómo midió',evidence:'Croquis con medidas'}
};
await window.DDOpenAI.request('material','Genera una ficha');
const linked=JSON.parse(captured.body).context;
assert.equal(linked.purpose,'Medir el terreno');
assert.equal(linked.product,'Biohuerto escolar');
assert.equal(linked.criterion,'Explica cómo midió');
assert.equal(linked.evidence,'Croquis con medidas');
// A draft in the unit editor must not replace the approved active unit.
nodes.unitTitle={value:'Borrador de otra unidad'};
nodes.unitSituation={value:'Otro contexto sin relación'};
window.state.units[0].situationBrief='Queremos sembrar hortalizas en el biohuerto.';
window.state.units[0].selectionApproved=true;
window.state.units[0].productTitle='Biohuerto demostrativo aprobado';
nodes.materialSource={value:'unit'};
await window.DDOpenAI.request('material','Genera material desde unidad');
const fromUnit=JSON.parse(captured.body).context;
assert.equal(fromUnit.title,'Biohuerto');
assert.equal(fromUnit.brief,'Queremos sembrar hortalizas en el biohuerto.');
assert.equal(fromUnit.purpose,'¿Cómo sembrar hortalizas?');
assert.equal(fromUnit.product,'Biohuerto demostrativo aprobado');
assert.equal(fromUnit.criterion,'','Unit materials must not borrow a session criterion');
assert.equal(fromUnit.evidence,'','Unit materials must not borrow a session evidence');
nodes.materialSource.value='free';
await window.DDOpenAI.request('material','Genera material libre');
const free=JSON.parse(captured.body).context;
for(const key of ['title','brief','purpose','product','criterion','evidence'])
  assert.equal(free[key],'',key+' must not leak into free-topic materials');
nodes.materialSource.value='session';
await window.DDOpenAI.request('material','Genera material de sesión');
const fromSession=JSON.parse(captured.body).context;
assert.equal(fromSession.purpose,'Medir el terreno');
assert.equal(fromSession.criterion,'Explica cómo midió');
assert.equal(fromSession.evidence,'Croquis con medidas');
assert.equal(fromSession.title,'Biohuerto','A planning draft must not override active unit in session materials');
window.state.lastSession.unitId='other-unit';
await window.DDOpenAI.request('material','Genera ficha para unidad actual');
const isolated=JSON.parse(captured.body).context;
assert.equal(isolated.purpose,'¿Cómo sembrar hortalizas?');
assert.equal(isolated.product,'Biohuerto demostrativo aprobado');
assert.equal(isolated.criterion,'');
assert.equal(isolated.evidence,'');
assert.equal(isolated.topic,'Biohuerto','Stale sessions must fall back to the active unit topic');
window.state.lastSession.unitId='u1';
await window.DDOpenAI.request('title_options','Propón títulos');
const fresh=JSON.parse(captured.body).context;
for(const key of ['purpose','product','criterion','evidence'])assert.equal(fresh[key],'',key+' must not leak from prior unit into a new title proposal');
console.log('AI_CONTEXT_TRACEABILITY_PASS: approved unit/session/free contexts isolated from stale drafts');
console.log('AI_BETA_CLIENT_PASS: memory-only token, request header, no localStorage secret');
