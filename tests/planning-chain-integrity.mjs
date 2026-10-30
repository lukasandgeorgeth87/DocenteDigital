import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createContext,runInContext} from 'node:vm';

// Contratos del módulo integrado (sin servicios externos ni datos de estudiantes).
const path=new URL('../planning-chain-integrity-v10.js',import.meta.url);
const state={units:[]};
const preview={insertions:[],querySelectorAll(){return[];},insertAdjacentHTML(pos,html){this.insertions.push(html)}};
const document={getElementById:id=>id==='unitOutput'?preview:null};
const window={escapeHtml:s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')};
let saved=0;
const ctx=createContext({state,window,document,Date,save:()=>{saved++;}});
runInContext(`window.buildSession=function(){const unit=state.units[0];return {unitId:unit.id,unitTitle:unit.title,activityIndex:0,activitySnapshot:{title:unit.activities[0].title,area:unit.activities[0].area},title:unit.activities[0].title,area:unit.activities[0].area,level:unit.level,grades:[...unit.grades],criterion:'Identifica datos',evidence:'Registro de datos',purpose:'Explica una relación',createdAt:'2026-10-30'};};window.sessionHtml=s=>'<section><h1>'+s.title+'</h1></section>';window.unitWordHtml=u=>'<article>'+u.title+'</article>';window.renderUnitOutput=()=>{};`,ctx);
runInContext(readFileSync(path,'utf8'),ctx,{filename:'planning-chain-integrity-v10.js'});
const mod=window.DD_PLANNING_CHAIN_V10;
assert.equal(mod.version,'10.0');
const unit={id:'u-test',title:'Nuestro biohuerto',type:'Proyecto de aprendizaje',level:'Primaria',ieType:'Multigrado',grades:['2.º','4.º'],areas:['Ciencia y Tecnología','Comunicación'],situation:'Aparecieron semillas en el biohuerto y observamos sus cambios.',reto:'¿Qué condiciones favorecen la germinación?',product:'Bitácora de experimentos',activities:[{area:'Ciencia y Tecnología',title:'Indagamos cómo germinan las semillas'}]};
state.units=[unit];
assert.equal(mod.auditUnit(unit).ok,true);
const session=window.buildSession();
assert.equal(saved,1,'Conservar snapshot en persistencia local sin modificar la unidad');
assert.deepEqual([...session.planningChainSnapshot.grades],['2.º','4.º']);
assert.equal(session.planningChainSnapshot.product,'Bitácora de experimentos');
assert.equal(mod.auditSession(session).ok,true);
const html=window.sessionHtml(session,true);
assert.match(html,/TRAZABILIDAD UNIDAD\/PROYECTO/);
assert.match(html,/germinan las semillas/);
assert.match(html,/Bitácora de experimentos/);
assert.match(window.unitWordHtml(unit),/VERIFICACIÓN DE COHERENCIA/);
window.renderUnitOutput(unit);
assert.equal(preview.insertions.length,1,'Mostrar verificación estructural en vista previa');

// El título se puede editar, pero no debe ocultarse su diferencia con la actividad planificada.
session.title='Diseñamos un filtro';
assert.ok(mod.auditSession(session).warnings.some(w=>w.id==='title-edited'));
assert.match(window.sessionHtml(session,true),/El título fue editado/);
// La lista de grados no puede cambiar silenciosamente entre proyecto y sesión.
session.grades=['1.º','4.º'];
assert.ok(mod.auditSession(session).warnings.some(w=>w.id==='grades-mismatch'));
// La unidad original puede eliminarse: el snapshot ya archivado sigue trazable.
state.units=[];
assert.equal(mod.auditSession(session).context.product,'Bitácora de experimentos');
assert.match(window.sessionHtml(session,true),/Bitácora de experimentos/);
// Otro proyecto o título no debe reemplazar el contexto histórico.
state.units=[{...unit,id:'u-otro',product:'Otro producto'}];
assert.equal(mod.auditSession(session).context.product,'Bitácora de experimentos');

// La unidad incompleta o con área ajena debe mostrar advertencias, sin asignar competencias artificiales.
const broken={...unit,product:'',reto:'',areas:['Comunicación'],activities:[{title:'Leemos un texto',area:'Ciencia y Tecnología'}]};
assert.ok(mod.auditUnit(broken).warnings.some(w=>w.id.startsWith('missing-')));
assert.ok(mod.auditUnit(broken).warnings.some(w=>w.id==='activity-area-0'));
assert.match(mod.unitPanel(broken),/Por revisar/);

// Contenido aportado por el usuario debe escaparse para evitar inyección HTML en paneles.
const escaped={...unit,situation:'<img src=x onerror=alert(1)> & detalles'};
assert.doesNotMatch(mod.unitPanel(escaped),/<img src/);
assert.match(mod.sessionPanel({...session,planningChainSnapshot:{...session.planningChainSnapshot,situation:'<script>x</script>'}}),/&lt;script&gt;/);

// Registro antiguo no es certificado como aprobado automáticamente.
const legacy={unitId:'u-antiguo',level:'Primaria',grades:['3.º'],title:'Actividad antigua',area:'Personal Social',criterion:'Evaluar cambios',evidence:'Texto breve',purpose:'Explicar hechos'};
assert.ok(mod.auditSession(legacy).warnings.some(w=>w.id==='missing-unit'||w.id==='no-snapshot'));
console.log('PLANNING_CHAIN_INTEGRITY_PASS: 3 niveles y vínculos; auditoría, histórico, título, grado, área, Word y escape HTML');
