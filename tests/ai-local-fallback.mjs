import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const source=readFileSync(new URL('../openai-runtime-v1.js',import.meta.url),'utf8');
let configured=false;
const title={value:'Patrimonio de nuestra comunidad',dataset:{}};
const situation={value:'Investigamos pinturas rupestres',dataset:{}};
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
const nodes={unitTitle:title,unitSituation:situation,unitType:kind,unitTitleSuggestions:box,ddAiConnectedCard:card};
const document={
  readyState:'loading',
  addEventListener(){},
  getElementById(id){return nodes[id]||null;}
};
const window={
  state:{},
  proposeUnitTitleOptions(){return ['Exploramos nuestro patrimonio','Conocemos las pinturas rupestres'];}
};
const fetch=async()=>({ok:true,json:async()=>({ok:true,configured,verified:false})});
runInNewContext(source,{window,document,fetch,setTimeout,clearTimeout,AbortController,console});

const button={textContent:'Tres títulos con IA',dataset:{},disabled:false};
await window.DDOpenAI.improveTitles(button);
assert.match(box.innerHTML,/Opciones locales sin IA/,'The fallback must be explicitly labeled as local');
assert.doesNotMatch(box.innerHTML,/Propuestas de IA/,'Local results must never be presented as GPT output');
assert.equal(box.buttons.length,2,'The fallback must render local title options');
box.buttons[1].click();
assert.equal(title.value,'Conocemos las pinturas rupestres','A local suggestion must remain selectable');
assert.equal(title.dataset.autoTitle,'false');
assert.equal(button.disabled,false,'The action must be re-enabled after fallback');

configured=true;
await window.DDOpenAI.renderHubStatus();
assert.match(card.innerHTML,/conexión aún no verificada/,'An API key alone must not be advertised as a verified GPT connection');
assert.doesNotMatch(card.innerHTML,/IA DocenteDigital conectada/);

console.log('AI_LOCAL_FALLBACK_PASS: offline titles, selection and truthful connection status');
