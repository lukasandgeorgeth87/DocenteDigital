import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const source=readFileSync(new URL('../openai-runtime-v1.js',import.meta.url),'utf8');
let configured=false;
let enabled=false;
let quotaConfigured=true;
const title={value:'Patrimonio de nuestra comunidad',dataset:{}};
const situation={value:'Investigamos pinturas rupestres',dataset:{},dispatchEvent(){this.changed=true;}};
const kind={value:'Unidad de aprendizaje'};
const box={
  innerHTML:'',
  buttons:[],
  querySelectorAll(){
    this.buttons=[...this.innerHTML.matchAll(/data-dd-ai-title="([^"]+)"/g)].map(match=>({
      dataset:{ddAiTitle:match[1]},
      addEventListener(_name,callback){this.click=callback;}
    }));
    return this.buttons;
  }
};
const card={innerHTML:''};
const situationApply={onclick:null};
const situationResult={set innerHTML(value){this._html=value;nodes.ddUseAiSituation=situationApply;},get innerHTML(){return this._html||'';}};
const nodes={unitTitle:title,unitSituation:situation,unitType:kind,unitTitleSuggestions:box,
  ddAiConnectedCard:card,ddUnitAiResult:situationResult,ddUseAiSituation:situationApply};
const document={
  readyState:'loading',
  addEventListener(){},
  getElementById(id){return nodes[id]||null;}
};
const window={
  state:{},
  proposeUnitTitleOptions(){return ['Exploramos nuestro patrimonio','Conocemos las pinturas rupestres'];},
  ddPlanningRegressionV51:{
    preview(raw){
      return /biohuerto escolar/i.test(raw) && /hortalizas/i.test(raw)
        ? {situations:[{text:'Aprovechamos lo que sabemos de la siembra de papas para aprender a sembrar hortalizas en el biohuerto escolar.'}]}
        : null;
    }
  }
};
const fetch=async()=>({ok:true,json:async()=>({ok:true,configured,enabled,access_configured:true,quota_configured:quotaConfigured,text:configured&&enabled&&quotaConfigured,image:configured&&enabled&&quotaConfigured,verified:false})});
runInNewContext(source,{window,document,fetch,setTimeout,clearTimeout,AbortController,console,Event:class Event{}});

const button={textContent:'Tres títulos con IA',dataset:{},disabled:false};
await window.DDOpenAI.improveTitles(button);
assert.match(box.innerHTML,/Opciones locales sin IA/,'The fallback must be explicitly labeled as local');
assert.doesNotMatch(box.innerHTML,/Propuestas de IA/,'Local results must never be presented as GPT output');
assert.equal(box.buttons.length,2,'The fallback must render local title options');
box.buttons[1].click();
assert.equal(title.value,'Conocemos las pinturas rupestres','A local suggestion must remain selectable');
assert.equal(title.dataset.autoTitle,'false');
assert.equal(button.disabled,false,'The action must be re-enabled after fallback');

// GPT may be disabled for the private preview; significant-situation
// planning must offer truthful, editable LOCAL assistance, not a dead button.
const situationButton={textContent:'Situación significativa con IA',dataset:{},disabled:false};
situation.value='Sabemos sembrar papas; queremos sembrar hortalizas en el biohuerto escolar.';
await window.DDOpenAI.improveSituation(situationButton);
assert.match(situationResult.innerHTML,/Propuesta local revisable \(sin IA\)/);
assert.match(situationResult.innerHTML,/hortalizas/);
assert.doesNotMatch(situationResult.innerHTML,/Situación propuesta por IA/);
assert.equal(situation.value,'Sabemos sembrar papas; queremos sembrar hortalizas en el biohuerto escolar.',
  'A local draft must not overwrite teacher work without explicit acceptance');
assert.equal(typeof situationApply.onclick,'function');
situationApply.onclick();
assert.match(situation.value,/aprender a sembrar hortalizas/);
assert.equal(situation.changed,true,'Applying the local suggestion should notify the editor');
assert.equal(situationButton.disabled,false);

// Unknown community facts cannot be fabricated by a narrow local template.
situation.value='En la comunidad encontramos una roca de forma singular.';
situation.changed=false;
await window.DDOpenAI.improveSituation(situationButton);
assert.match(situationResult.innerHTML,/Texto del docente conservado \(sin IA\)/);
assert.match(situationResult.innerHTML,/roca de forma singular/);
assert.doesNotMatch(situationResult.innerHTML,/hortalizas|papas|costumbre inventada/i);
situationApply.onclick();
assert.equal(situation.value,'En la comunidad encontramos una roca de forma singular.');
assert.equal(situationButton.disabled,false);
console.log('AI_SITUATION_LOCAL_FALLBACK_PASS: teacher-approved context and safe editable local draft');

configured=true;
await window.DDOpenAI.renderHubStatus();
assert.match(card.innerHTML,/IA desactivada por seguridad/,'An API key without the beta switch must display a disabled state');
assert.doesNotMatch(card.innerHTML,/conexión aún no verificada/,'A disabled beta must not imply the service is enabled');
assert.doesNotMatch(card.innerHTML,/IA DocenteDigital conectada/);

enabled=true;
await window.DDOpenAI.renderHubStatus();
assert.match(card.innerHTML,/conexión aún no verificada/,'An enabled beta without a real provider test must not be advertised as verified');
assert.doesNotMatch(card.innerHTML,/IA DocenteDigital conectada/);

quotaConfigured=false;
await window.DDOpenAI.renderHubStatus();
assert.match(card.innerHTML,/Falta límite de consumo/,'A missing durable quota must be visible instead of claiming beta is ready');
assert.doesNotMatch(card.innerHTML,/conexión aún no verificada/);
console.log('AI_LOCAL_FALLBACK_PASS: offline titles, selection and truthful connection status');


 // When GPT is offline, invoking "improve material" must NEVER replace
 // an existing edited worksheet. Local generation requires teacher action.
const existingWorksheet='<article class="dd-editable-material">FICHA_EDITADA_POR_DOCENTE</article>';
const worksheetHost={
  innerHTML:existingWorksheet,notes:[],classList:{remove(){}},
  querySelector(selector){return selector==='.dd-editable-material'?{}:null;},
  prepend(node){this.notes.unshift(node);},
  appendChild(node){this.notes.push(node);}
};
nodes.materialOutput=worksheetHost;
window.DDMaterials={localCalls:0,create(){this.localCalls++;}};
const priorCreateElement=document.createElement;
document.createElement=()=>({
  innerHTML:'',children:[],appendChild(child){this.children.push(child);},
  textContent:'',className:'',type:'button',onclick:null
});
const materialButton={textContent:'Crear o mejorar con IA',dataset:{},disabled:false};
await window.DDOpenAI.materialWithAI(materialButton);
assert.equal(worksheetHost.innerHTML,existingWorksheet,'Provider failure must not erase edited material');
assert.equal(worksheetHost.notes.length,1);
assert.match(worksheetHost.notes[0].innerHTML,/Respaldo local sin IA/);
assert.match(worksheetHost.notes[0].innerHTML,/cambios realizados se han conservado/);
assert.equal(window.DDMaterials.localCalls,0,'Local recreation cannot happen without teacher permission');
worksheetHost.notes[0].children[0].onclick();
assert.equal(window.DDMaterials.localCalls,1,'Local fallback must work after explicit click');
assert.equal(materialButton.disabled,false);
document.createElement=priorCreateElement;
console.log('AI_MATERIAL_OFFLINE_PRESERVATION_PASS: teacher edits survive GPT outage with opt-in local fallback');
