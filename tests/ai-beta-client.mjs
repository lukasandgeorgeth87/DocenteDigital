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
  lastSession:{title:'Medimos nuestro biohuerto',area:'Matemática',purpose:'Medir el terreno',criterion:'Explica cómo midió',evidence:'Croquis con medidas'}
};
await window.DDOpenAI.request('material','Genera una ficha');
const linked=JSON.parse(captured.body).context;
assert.equal(linked.purpose,'Medir el terreno');
assert.equal(linked.product,'Biohuerto escolar');
assert.equal(linked.criterion,'Explica cómo midió');
assert.equal(linked.evidence,'Croquis con medidas');
await window.DDOpenAI.request('title_options','Propón títulos');
const fresh=JSON.parse(captured.body).context;
for(const key of ['purpose','product','criterion','evidence'])assert.equal(fresh[key],'',key+' must not leak from prior unit into a new title proposal');
console.log('AI_CONTEXT_TRACEABILITY_PASS: approved unit/session fields sent only for downstream tasks');
console.log('AI_BETA_CLIENT_PASS: memory-only token, request header, no localStorage secret');
