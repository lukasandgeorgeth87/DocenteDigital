// Fase 47: clicks, preview cleanup, guardar, restaurar y sesiones sin API.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const src=readFileSync(new URL('../review-inline-v46.js',import.meta.url),'utf8');
function el(tag='div'){
 const x={tagName:tag.toUpperCase(),id:'',textContent:'',className:'',value:'',children:[],handlers:{},parent:null,
  appendChild(child){this.append(child);return child;},
  append(...children){for(const c of children){this.children.push(c);c.parent=this;}},
  setAttribute(){},
  addEventListener(name,fn){this.handlers[name]=fn;},
  remove(){if(this.parent)this.parent.children=this.parent.children.filter(c=>c!==this);},
  scrollIntoView(){},
  querySelectorAll(selector){
    const result=[];
    function traverse(node){
      for(const child of node.children){if((selector==='textarea'&&child.tagName==='TEXTAREA')||(selector.startsWith('#')&&child.id===selector.slice(1)))result.push(child);traverse(child);}
    }
    traverse(this);return result;
  },
  querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
 };
 return x;
}
function button(root,title){
 const find=node=>{
  if(node.tagName==='BUTTON'&&node.textContent===title)return node;
  for(const child of node.children){const hit=find(child);if(hit)return hit;}
  return null;
 };
 return find(root);
}
const containers={unitOutput:el(),sessionOutput:el()};
const document={head:el(),createElement:el,getElementById:id=>containers[id]||null};
const unit={id:'u',situation:'En nuestra comunidad, En una actividad de aula, los estudiantes representan derechos.',
 reto:'¿Cómo explicamos nuestros derechos?',product:'Guía antigua',productTitle:'Guía antigua',
 selectedSituationSource:'B',productChoiceSource:'card',approvedSelectionSnapshot:{situationText:'Inicial',productTitle:'Guía antigua'},
 selectionApproved:true};
const session={id:'s',grades:['2.º'],purpose:'Dialogamos y formulamos preguntas sobre nuestros derechos.',
 evidence:'Registro oral',challenge:'¿Qué derecho aparece?',criterion:'Explica un derecho'};
const state={units:[unit],lastSession:session};
let calls=0,renders=0;
const window={state,save(){calls++;return true;},
 renderUnits(){},fillSessionUnits(){},renderUnitOutput(){renders++;},
 renderSessionOutput(){renders++;}};
runInNewContext(src,{document,window});
const api=window.DDReviewV46;
assert(api);
assert.equal(api.openUnit('u'),true);
let panel=containers.unitOutput.querySelector('#ddReviewPanel');
assert(panel);
assert(button(panel,'Corregir repeticiones'));
assert(button(panel,'Guardar correcciones'));
const fields=panel.querySelectorAll('textarea');
assert.equal(fields.length,3);
fields[0].value='En nuestra comunidad, En una actividad de aula,\n los estudiantes dialogan sobre sobre los derechos.';
button(panel,'Corregir repeticiones').handlers.click();
assert(fields[0].value.startsWith('En una actividad de aula,\n'));
assert(fields[0].value.includes('sobre los derechos.'));
fields[1].value='¿Qué derechos aprendemos?';
fields[2].value='Guía ilustrada de nuestros derechos';
button(panel,'Guardar correcciones').handlers.click();
assert(unit.situation.includes('\n'));
assert.equal(unit.productTitle,'Guía ilustrada de nuestros derechos');
assert.equal(unit.selectedSituationSource,'Docente');
assert(calls>0&&renders>0);
assert.equal(api.openUnit('u'),true);
panel=containers.unitOutput.querySelector('#ddReviewPanel');
assert(button(panel,'Restaurar versión anterior'));
button(panel,'Restaurar versión anterior').handlers.click();
assert.equal(unit.product,'Guía antigua');
assert.equal(unit.productChoiceSource,'card');
assert.equal(api.openSession(),true);
panel=containers.sessionOutput.querySelector('#ddReviewPanel');
let sessionFields=panel.querySelectorAll('textarea');
assert.equal(sessionFields.length,4);
sessionFields[0].value='Escuchamos y explicamos derechos a partir de una historia ficticia.';
sessionFields[1].value='Intervención oral';
sessionFields[2].value='¿Qué derecho observamos en la historia?';
sessionFields[3].value='Expresa una idea y pregunta sobre un derecho en la historieta.';
button(panel,'Guardar correcciones').handlers.click();
assert.equal(session.teacherCriteria['2.º'],'Expresa una idea y pregunta sobre un derecho en la historieta.');
assert(session.reviewHistory.length);
assert(!/fetch\s*\(|navigator\.clipboard|chatgpt\.com|\/api\/ai/.test(src));
console.log('PASS v47: botones de unidad y sesión, limpieza preserva saltos, guardado y restauración');
