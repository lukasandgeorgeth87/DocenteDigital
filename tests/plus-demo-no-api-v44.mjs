// Offline proof: ChatGPT Plus remains a manual copy/paste workflow.
// No token, fetch, storage or automatic API call is permitted.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const read=x=>readFileSync(new URL('../'+x,import.meta.url),'utf8');
const html=read('laboratorio-plus.html'),src=read('plus-demo-v44.js'),home=read('index.html');
assert(home.includes('href="laboratorio-plus.html"'));
for(const id of ['draftText','fromChatGPT','copyPrompt','approve','usePasted','downloadWord','approvedPreview','demoMessage'])
 assert(html.includes('id="'+id+'"'),'Falta control visible '+id);
assert(html.includes('src="docx-export-v29.js"'));
assert.match(html,/DEMO SIN API/);
assert.match(html,/no modifica tus unidades guardadas/);
assert.doesNotMatch(src,/fetch\s*\(|XMLHttpRequest|localStorage|sessionStorage|\/api\/ai|OPENAI_API_KEY/);
const env={window:{},document:{readyState:'loading',addEventListener(){}}};
runInNewContext(src,env);
const api=env.window.DDPlusDemoV44;
assert(api);
for(const key of ['situation','session','rubric']){
 const data=api.samples[key];
 assert(data.before.length>40&&data.after.length>200);
 const p=api.createPrompt(key);
 assert(p.includes('2.º grado')&&p.includes('CNEB'));
 assert(p.includes('No inventes hechos reales'));
 assert(p.includes(data.before));
 const html=api.wordHtml(key,data.after);
 assert.match(html,/2.º grado de Primaria/);
 assert.match(html,/revisada y aprobada/);
 assert(!html.includes(data.before),'El Word solo debe mostrar el borrador revisado');
}
assert.equal(api.validateText('corto'),false);
assert.equal(api.validateText('x'.repeat(12001)),false);
assert.equal(api.validateText('x'.repeat(60)),true);
const malicious=api.wordHtml('situation','<script>alert("a")</script>'+' x'.repeat(16));
assert(!malicious.includes('<script>'));
assert(malicious.includes('&lt;script&gt;'));
assert.match(api.samples.session.after,/INICIO \(10 minutos\)[\s\S]*DESARROLLO \(20 minutos\)[\s\S]*CIERRE \(10 minutos\)/);
assert.match(api.samples.rubric.after,/C – Inicio[\s\S]*B – Proceso[\s\S]*A – Logro esperado[\s\S]*AD – Destacado/);
console.log('PASS v44: laboratorio Plus manual, 3 ejemplos, aprobación y Word seguro, sin API');
