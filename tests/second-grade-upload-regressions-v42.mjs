// Fase 42: errores confirmados en los Word de 2.º grado del docente.
// Incluye ancho de tabla A4, foco gramatical y situación duplicada.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const src=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const docx=src('docx-export-v29.js');
assert(docx.includes('function tableXml(table,totalWidth)'));
assert(docx.includes('const body=htmlToWordXml(html,landscape?15000:10400)'));
const a=docx.indexOf('  function tableXml(table,totalWidth){');
const b=docx.indexOf('  function htmlToWordXml(',a);
const tableCode=docx.slice(a,b);
const xmlCtx={
 E:x=>String(x??''),
 textOf:n=>String(n.textContent||''),
 pXml:t=>'<w:p>'+String(t||'')+'</w:p>'
};
runInNewContext(tableCode+'\nthis.renderTable=tableXml;',xmlCtx);
const col=(label)=>({tagName:'TD',textContent:label,getAttribute:()=>null});
const input={rows:[{children:Array.from({length:8},(_,i)=>col('C'+i))}],getAttribute:()=>null};
for(const [width,landscape] of [[10400,false],[15000,true]]){
 const xml=xmlCtx.renderTable(input,width);
 assert(xml.includes('<w:tblW w:w="'+width+'" w:type="dxa"/>'));
 const values=[...xml.matchAll(/<w:gridCol w:w="(\d+)"\/>/g)].map(m=>Number(m[1]));
 assert.equal(values.length,8);
 assert.equal(values.reduce((a,b)=>a+b,0),width);
 assert(width<= (landscape?16838:11906)-1440,'La tabla no puede desbordar el ancho imprimible');
}
const learning=src('session-learning-core-v54.js');
const start=learning.indexOf('  function shortFocus(title,unit,session){');
const end=learning.indexOf('  function communicationMode(title){',start);
assert(start>=0&&end>start);
const context={tidy:x=>String(x??'').replace(/\s+/g,' ').trim(),window:{}};
runInNewContext(learning.slice(start,end)+'\nthis.focus=shortFocus;',context);
const selected=context.focus('Dialogamos sobre los derechos de la niñez y formulamos preguntas',{}, {});
assert.equal(selected,'los derechos de la niñez');
assert.equal(context.focus('Leemos sobre el cuidado del agua',{}, {}),'el cuidado del agua');
const enh=src('enhancements.js');
const e1=enh.indexOf('  function ddCleanGeneratedSessionText(value){');
const e2=enh.indexOf('  sessionHtml=function(session,forWord=false){',e1);
assert(e1>=0&&e2>e1);
const display={};
runInNewContext(enh.slice(e1,e2)+'\nthis.clean=ddCleanGeneratedSessionText;',display);
assert.equal(display.clean('Comunica información relevante sobre sobre los derechos de la niñez y formulamos preguntas.'),
 'Comunica información relevante sobre los derechos de la niñez.');
assert(enh.includes('purpose:ddCleanGeneratedSessionText(session.purpose)'));
const uq=src('unit-export-quality-v11.js');
const u1=uq.indexOf('  function situation(u){'),u2=uq.indexOf('  function competences(u,area,title){',u1);
assert(u1>=0&&u2>u1);
const ctx={clean:x=>String(x??'').replace(/\s+/g,' ').trim()};
runInNewContext(uq.slice(u1,u2)+'\nthis.situation=situation;',ctx);
const bad='En nuestra comunidad, En una actividad de aula, los estudiantes de 2.º analizan historietas ficticias e ilustraciones sobre los derechos. Estas historias les permiten formular preguntas y compartir con la comunidad educativa. forma parte de la experiencia de los estudiantes de 2.º. Aunque conocen algunos aspectos por su vida familiar y comunitaria, todavía existen preguntas.';
const sanitized=ctx.situation({situation:bad,reto:'¿Cómo explicamos nuestros derechos?',selectedSituationSource:'B'});
assert(sanitized.startsWith('En una actividad de aula,'));
assert(!/forma parte de la experiencia|Aunque conocen algunos aspectos/i.test(sanitized));
assert.equal(ctx.situation({situation:bad,reto:'¿Cómo explicamos nuestros derechos?',selectedSituationSource:'Docente'}),bad,
 'La situación manual es inmutable');
const resources=src('sesiones-maestras-core-v1.js');
const r1=resources.indexOf('  function resourceTable(session,forWord=false){');
const r2=resources.indexOf('  function compactResources(session){',r1);
assert(r1>=0&&r2>r1);
const rctx={resourcePlan:()=>[{
 code:'PIZ-01',resource:'Pizarra',grade:'2.º',moment:'Cierre',
 teacher:'Conduce la síntesis',student:'Explica su idea',mode:'Uso común',purpose:'Organizar lo aprendido'
}],E:x=>String(x)};
runInNewContext(resources.slice(r1,r2)+'\nthis.resourceTable=resourceTable;',rctx);
const wordTable=rctx.resourceTable({},true);
const screenTable=rctx.resourceTable({},false);
assert.equal((wordTable.match(/<th>/g)||[]).length,4,'La matriz A4 vertical no admite ocho columnas');
assert.equal((screenTable.match(/<th>/g)||[]).length,8,'Conservar detalle de navegación en pantalla');
assert(wordTable.includes('Conduce la síntesis')&&wordTable.includes('Explica su idea'));
assert(resources.includes('RECURSOS SELECCIONADOS PARA PLANIFICAR (USO POR CONFIRMAR)'));
assert(!resources.includes('RECURSOS Y MATERIALES REALMENTE UTILIZADOS'));
console.log('PASS v42: ancho A4, tema de 2.º, situación y edición histórica protegida');
