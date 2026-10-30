import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const source=readFileSync(new URL('../format-v2.js',import.meta.url),'utf8');
const state={teacherName:'Docente actual',schoolName:'I.E. actual',units:[]};
const output={
  footer:null,
  classList:{add(){}},
  querySelector(selector){return selector==='.dd-preview-footer'?this.footer:null;},
  appendChild(node){if(node.className==='dd-preview-footer')this.footer=node;}
};
const window={
  createUnitDemo(){},unitWordHtml:()=>'<h1>UNIDAD DE APRENDIZAJE</h1>',
  renderUnitOutput(){}
};
const context={
  window,state,byId:id=>id==='unitOutput'?output:null,
  document:{createElement:()=>({textContent:'',className:''}),head:{appendChild(){}}},
  escapeHtml:v=>String(v??''),console
};
runInNewContext(source,context,{filename:'format-v2.js'});

const a={id:'a',type:'Proyecto de aprendizaje',documentContextSnapshot:{teacher:'Prof. Ana',institution:'I.E. Los Pinos'}};
const b={id:'b',type:'Unidad de aprendizaje',documentContextSnapshot:{teacher:'Prof. Luis',institution:'I.E. Nuevo Horizonte'}};
window.renderUnitOutput(a);
assert.match(output.footer.textContent,/Prof\. Ana.*Los Pinos/);
assert.doesNotMatch(output.footer.textContent,/Docente actual|I\.E\. actual/);

window.renderUnitOutput(b);
assert.match(output.footer.textContent,/Prof\. Luis.*Nuevo Horizonte/);
assert.doesNotMatch(output.footer.textContent,/Prof\. Ana/,'El pie debe actualizarse al cambiar de documento');

const html=context.wordDocument('Documento','<p>Contenido</p>',a.documentContextSnapshot);
assert.match(html,/Prof\. Ana.*Los Pinos/);
assert.doesNotMatch(html,/Docente actual|I\.E\. actual/);
const old=context.wordDocument('Documento antiguo','<p>Contenido</p>',{historicalIdentityUnverified:true});
assert.match(old,/Docente por verificar.*I\.E\. por verificar/);
assert.doesNotMatch(old,/Docente actual|I\.E\. actual/);

const legacy={id:'old',type:'Unidad de aprendizaje'};
window.renderUnitOutput(legacy);
assert.match(output.footer.textContent,/Docente por verificar.*I\.E\. por verificar/);

console.log('UNIT_PREVIEW_HISTORY_PASS: pie visual y .doc histórico sin identidad global');
