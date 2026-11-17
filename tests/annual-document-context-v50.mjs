// La programación anual no debe fingir hechos: distingue insumos, títulos
// libres, productos sugeridos y productos ya aprobados en unidades vinculadas.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const source=readFileSync(new URL('../annual-planning-v2.js',import.meta.url),'utf8');
const units=[{id:'unidad-marzo',title:'Cuidamos las fuentes de agua',
  situationBrief:'Los niños observan que hay residuos junto al canal que se utiliza para regar el biohuerto escolar.',
  product:'Campaña de cuidado del canal y registro de observaciones.'}];
const state={units,annualPlans:[],grades:['3.º'],areas:['Comunicación'],level:'Primaria',ieType:'Polidocente'};
const document={addEventListener(){},createElement(){return {textContent:''};},head:{appendChild(){}}};
const root={DDPlanningTools:{},DDPedagogicalInputs:{monthEvents(name){
  return name==='Mayo'?[{text:'Intercambio de semillas en la comunidad',source:'Calendario comunal'},
    {text:'Preparación de la chacra escolar',source:'Calendario comunal'}]:[];
}}};
runInNewContext(source,{window:root,document,state,save(){},go(){},setTimeout(){},clearTimeout(){}});

const plan={id:'anual-prueba',year:2027,level:'Primaria',grades:['3.º'],areas:['Comunicación'],
  ieType:'Polidocente',months:[
    {name:'Marzo',title:'Cuidamos las fuentes de agua',context:'',linkedUnitId:'unidad-marzo'},
    {name:'Mayo',title:'Valoramos las semillas de la comunidad',context:'',linkedUnitId:''},
    {name:'Junio',title:'Investigamos el agua que usamos',context:'',linkedUnitId:''}
  ]};
const html=root.DDAnnualPlanning.printHtml(plan);
assert(html.includes('Campaña de cuidado del canal y registro de observaciones.'),'Usar el producto real de la unidad vinculada');
assert(html.includes('residuos junto al canal'),'Recuperar la situación aprobada, no un campo vacío');
assert(html.includes('Intercambio de semillas en la comunidad'),'Usar el calendario comunal aportado');
assert(html.includes('Preparación de la chacra escolar'),'Usar dos hechos del calendario, no perder el segundo');
assert(html.includes('Registro de observaciones y propuesta de cuidado del agua'),'Sugerir producto a partir del título libre del docente');
assert(html.includes('Por caracterizar con información real'),'Marcar la ausencia de contexto real');
assert(!html.includes('Contexto por precisar con el grupo'),'No repetir el marcador anterior sin información sobre el origen');
assert.equal(plan.months.length,10,'Conservar todos los meses de marzo a diciembre');
console.log('PASS v50: programación anual con calendario, situación real y productos vinculados');
