// Fase 46: corrección incorporada a la unidad/sesión, sin ChatGPT falso.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const read=name=>readFileSync(new URL('../'+name,import.meta.url),'utf8');
const src=read('review-inline-v46.js');
const dom={
 head:{appendChild(){}},
 createElement(){return {textContent:'',className:'',style:{},appendChild(){},setAttribute(){},addEventListener(){}};}
};
const saved=[];
const unit={id:'u-2',situation:'En nuestra comunidad, En una actividad de aula, los niños analizan una historieta ficticia.',
 reto:'¿Qué derechos identificamos y cómo los explicamos?',product:'Guía ilustrada de los derechos',
 productTitle:'Guía ilustrada de los derechos',selectionApproved:true,
 approvedSelectionSnapshot:{productTitle:'Guía ilustrada de los derechos',situationText:'Historia inicial'},
 selectedSituationSource:'B',reviewHistory:[]};
const session={id:'s-2',grades:['2.º'],purpose:'Aprendemos sobre sobre los derechos de la niñez.',
 evidence:'Registro de participación oral',challenge:'¿Qué derecho representa la historieta?',
 criterion:'Explica una idea sobre los derechos'};
const state={units:[unit],lastSession:session};
let saves=0;
const window={state,save(){saves++;return true;},renderUnits(){},renderUnitOutput(){},renderSessionOutput(){},fillSessionUnits(){}};
runInNewContext(src,{document:dom,window});
const api=window.DDReviewV46;
assert(api);
assert.equal(api.cleanup('En nuestra comunidad, En una actividad de aula, dialogamos sobre sobre los derechos.'),
 'En una actividad de aula, dialogamos sobre los derechos.');
const improved='En una actividad de aula, estudiantes de segundo grado analizan historietas ficticias sobre el derecho a aprender y a jugar.';
const previous=unit.product;
api.commitUnit(unit,{situation:improved,reto:'¿Qué derechos identificamos?',product:'Guía ilustrada sobre nuestros derechos'});
assert.equal(unit.productTitle,unit.product);
assert.equal(unit.approvedSelectionSnapshot.situationText,improved);
assert.equal(unit.selectedSituationSource,'Docente');
assert.equal(unit.reviewHistory.length,1);
assert.equal(unit.productDescription,'');
assert(saves>=1);
assert.equal(api.undoUnit(unit),true);
assert.equal(unit.product,previous,'Debe restaurar el producto antes de la corrección');
assert.equal(unit.productTitle,previous);
assert.equal(unit.selectedSituationSource,'B');
api.commitSession(session,{purpose:'Dialogamos sobre derechos a partir de historietas ficticias',
 evidence:'Participación oral',challenge:'¿Qué aprendimos con esta historieta?',
 criteria:{'2.º':'Expresa una idea y formula una pregunta sobre un derecho'}});
assert.equal(session.teacherCriteria['2.º'],'Expresa una idea y formula una pregunta sobre un derecho');
assert.equal(session.criterion,session.teacherCriteria['2.º']);
assert.equal(session.reviewHistory.length,1);
api.undoSession(session);
assert.equal(session.teacherCriteria,undefined);
assert.equal(session.criterion,'Explica una idea sobre los derechos');
const oldSave=window.save;
window.save=()=>false;
assert.throws(()=>api.commitUnit(unit,{situation:improved,reto:'¿Qué derechos?',product:'Guía ilustrada'}),/Cambios en memoria/);
window.save=oldSave;
for(const p of ['index.html','enhancements.js','app.js']){
 const text=read(p);
 assert(!text.includes('Laboratorio Plus · sin costo'),p+' todavía muestra el laboratorio en la navegación');
}
const idx=read('index.html'),enh=read('enhancements.js'),app=read('app.js');
assert(idx.includes('src="review-inline-v46.js"'));
assert(enh.includes('DDReviewV46?.openUnit'));
assert(app.includes('DDReviewV46?.openSession'));
assert(enh.includes("session.teacherCriteria?.[g]"));
assert(app.includes("unit?.selectedSituationSource==='Docente'&&saved"));
assert(!/fetch\s*\(|XMLHttpRequest|\/api\/ai|OPENAI_API_KEY|navigator\.clipboard|chatgpt\.com/i.test(src),
 'El editor integrado nunca hace llamadas a la API ni pide copiar/pegar');
console.log('PASS v46: revisión integrada editable, historial, restauración y sin API');
