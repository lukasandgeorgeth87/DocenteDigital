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
  getElementById:id=>nodes[id]||null,
  createElement:()=>({className:'',innerHTML:''})
};
const window={state:{}};
let captured=null, imageCaptured=null, imageCalls=0;
const samplePng='iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP4z8DwHwAFAAH/iZk9HQAAAABJRU5ErkJggg==';
let imageResponse={ok:true,image_base64:samplePng,image_url:null};
const alerts=[];
const fetch=async(url,options={})=>{
  if(url==='/api/ai-status')return {ok:true,json:async()=>({
    ok:true,configured:true,enabled:true,access_configured:true,
    access_required:true,text:true,image:true,verified:false
  })};
  if(url==='/api/image'){
    imageCalls++;
    imageCaptured=options;
    return {ok:true,status:200,json:async()=>({
      ...imageResponse
    })};
  }
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
runInNewContext(source,{window,document,fetch,localStorage,MutationObserver,setTimeout,clearTimeout,AbortController,console,alert:message=>alerts.push(String(message))});
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
// An orphan session from a previously closed unit must never contaminate
// a new planning flow when no unit is selected.
window.state.activeUnitId=null;
window.state.lastSession.unitId='u1';
await window.DDOpenAI.request('material','Ficha para un nuevo contexto sin unidad');
const orphan=JSON.parse(captured.body).context;
for(const key of ['title','brief','purpose','product','criterion','evidence'])
  assert.equal(orphan[key],'',key+' must not leak from orphan session when no unit is active');
assert.equal(orphan.topic,'','Old session title must not be reused without active unit');
await window.DDOpenAI.request('session_strategy','Estrategia para un nuevo contexto');
const orphanStrategy=JSON.parse(captured.body).context;
for(const key of ['purpose','criterion','evidence'])
  assert.equal(orphanStrategy[key],'',key+' must not leak into session strategy without active unit');
window.state.activeUnitId='u1';
window.state.lastSession.unitId='u1';
nodes.unitTitle.value='';
nodes.unitSituation.value='';
await window.DDOpenAI.request('title_options','Propón títulos para nueva unidad');
const fresh=JSON.parse(captured.body).context;
assert.equal(fresh.title,'','A blank new-unit title must not borrow the previous unit title');
assert.equal(fresh.brief,'','A blank new-unit situation must not borrow the previous unit situation');
for(const key of ['purpose','product','criterion','evidence'])assert.equal(fresh[key],'',key+' must not leak from prior unit into a new title proposal');
console.log('AI_CONTEXT_TRACEABILITY_PASS: approved unit/session/free contexts isolated from stale drafts');
console.log('AI_BETA_CLIENT_PASS: memory-only token, request header, no localStorage secret');

// Premium image credits must never be silently spent by a hardcoded
// confirmedCredit:true. Explicit teacher consent is required for EACH image.
let imageConsent=false, consentMessage='';
window.confirm=message=>{consentMessage=String(message);return imageConsent;};
nodes.materialTopic={value:'Hortalizas del nuevo proyecto'};
nodes.materialArea={value:'Ciencia y Tecnología'};
let imagePanel=null;
nodes.ddSessionSuggestions={prepend:panel=>{imagePanel=panel;}};
window.state={level:'Primaria',activeUnitId:'unidad-actual',
  lastSession:{unitId:'unidad-antigua',title:'Minerales de otro proyecto',area:'Comunicación'}};
await window.DDOpenAI.generatePremiumImage();
assert.match(consentMessage,/5 unidades/,'Consent must show the real quota cost');
assert.equal(imageCalls,0,'Declining consent must not call the paid image endpoint');
assert.equal(imagePanel,null,'Declining consent must not display a generated image');
imageConsent=true;
await window.DDOpenAI.generatePremiumImage();
assert.equal(imageCalls,1,'Confirmed image should request the provider exactly once');
assert.equal(JSON.parse(imageCaptured.body).confirmedCredit,true);
assert.equal(imageCaptured.headers['x-dd-beta-token'],'temporary-preview-token-12345678901234567890');
assert.match(JSON.parse(imageCaptured.body).prompt,/Hortalizas del nuevo proyecto/);
assert.doesNotMatch(JSON.parse(imageCaptured.body).prompt,/Minerales de otro proyecto/,
  'A stale session must not contaminate a paid image prompt');
assert.match(imagePanel.innerHTML,/Imagen educativa generada/);
assert.match(imagePanel.innerHTML,/src="data:image\/png;base64,iVBORw0KGgo/,
  'A server-validated PNG must render as an inline data URI, never a provider URL');
// A future API regression returning only an HTTPS URL must not make the
// teacher browser contact an external provider or display unverified bytes.
imagePanel=null;
imageResponse={ok:true,image_url:'https://untrusted.example.test/teacher-image.png'};
await window.DDOpenAI.generatePremiumImage();
assert.equal(imageCalls,2);
assert.equal(imagePanel,null,'URL-only image responses must not render');
assert.match(alerts.at(-1)||'',/La imagen no llegó correctamente/);
imageResponse={ok:true,image_base64:'bm90IGEgcG5n',image_url:'https://untrusted.example.test/teacher-image.png'};
await window.DDOpenAI.generatePremiumImage();
assert.equal(imageCalls,3);
assert.equal(imagePanel,null,'Malformed base64 with URL fallback must not render');
assert.match(alerts.at(-1)||'',/La imagen no llegó correctamente/);
imageConsent=false;
await window.DDOpenAI.generatePremiumImage();
assert.equal(imageCalls,3,'A later image request must ask consent again');
console.log('AI_IMAGE_CONSENT_PASS: per-image confirmation, quota notice, stale-session isolation, PNG-only rendering, URL-only rejection');
