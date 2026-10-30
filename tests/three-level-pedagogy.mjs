import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createContext,runInContext} from 'node:vm';

// Prueba offline de la capa ampliada REAL (enhancements.js), el selector de
// situación/producto y el núcleo de sesiones. El navegador completo todavía
// requiere una prueba E2E independiente.
const source=file=>readFileSync(new URL(`../${file}`,import.meta.url),'utf8');
const registry={};
const element=(props={})=>({
  value:'',innerHTML:'',classList:{add(){},remove(){},toggle(){}},
  scrollIntoView(){},setAttribute(){},querySelector(){return null;},querySelectorAll(){return[];},
  appendChild(child){if(child.id)registry[child.id]=child;},
  ...props
});
Object.assign(registry,{
  unitPanel:element(),unitType:element(),unitDuration:element(),
  unitSituation:element(),unitTitle:element(),unitReady:element(),unitOutput:element(),
  sessionUnit:element(),
  activity:element({value:'0',selectedIndex:0,options:[],closest:()=>null}),
  sessionTitle:element(),sessionDuration:element({value:'45 minutos',options:[{value:'40 minutos'},{value:'60 minutos'}]}),
  sessionResources:element({value:'Materiales del entorno'})
});
const document={
  getElementById:id=>registry[id]||null,
  createElement:()=>element(),
  head:{appendChild(){}},body:{classList:{toggle(){}}},
  querySelectorAll:()=>[],
  querySelector:selector=>selector==='input[name="ddSituation"]:checked'?{value:'A'}
    :selector==='input[name="ddProduct"]:checked'?{value:'1'}:null,
  addEventListener(){}
};
const entries=(level,area)=>[{name:`Competencia referencial de ${area} en ${level}`,capacities:['Capacidad de prueba']}];
class DOMParserMock {
  parseFromString(html){
    // Aísla solo el texto para comprobar las palabras preservadas en OOXML.
    // No pretende comprobar la maquetación de tablas en Microsoft Word.
    return{body:{children:[{tagName:'P',textContent:html.replace(/<[^>]*>/g,' '),children:[]}]}};
  }
}
const window={
  DD_OFFICIAL_CURRICULUM:{
    verified:true,version:'fixture-sin-fuente-oficial',
    getArea:entries,pickCompetence:(level,area)=>entries(level,area)[0],
    sourceFor:()=>({id:'fixture'}),getTransversals:()=>[]
  }
};
const store=new Map();
const context=createContext({
  window,document,localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,String(v))},
  Date,Node:{TEXT_NODE:3},TextEncoder,Uint8Array,Blob,DOMParser:DOMParserMock,URL,
  setTimeout,clearTimeout,console,alert:msg=>{throw Error(`Alert unexpected: ${msg}`);}
});
runInContext(source('app.js'),context,{filename:'app.js'});
// Sustituimos solo el renderizado; se ejecutan los generadores del producto.
runInContext('renderUnits=()=>{};renderUnitOutput=()=>{};fillSessionUnits=()=>{};',context);
runInContext(source('enhancements.js'),context,{filename:'enhancements.js'});
runInContext('renderUnits=()=>{};renderUnitOutput=()=>{};fillSessionUnits=()=>{};',context);
runInContext('window.createUnitDemo=createUnitDemo;window.unitWordHtml=unitWordHtml;window.buildSession=buildSession;window.sessionHtml=sessionHtml;window.selectedActivity=selectedActivity;window.escapeHtml=escapeHtml;',context);
runInContext(source('master-session-v1.js'),context,{filename:'master-session-v1.js'});
runInContext(source('sesiones-maestras-core-v1.js'),context,{filename:'sesiones-maestras-core-v1.js'});
runInContext(source('docx-export-v29.js'),context,{filename:'docx-export-v29.js'});
runInContext(source('proposal-choice-v8.js'),context,{filename:'proposal-choice-v8.js'});
runInContext(source('session-learning-core-v54.js'),context,{filename:'session-learning-core-v54.js'});
runInContext(source('session-curriculum-safety-v67.js'),context,{filename:'session-curriculum-safety-v67.js'});
runInContext(source('primary-communication-source-pages-v6.js'),context,{filename:'primary-communication-source-pages-v6.js'});
runInContext(source('primary-mathematics-source-pages-v7.js'),context,{filename:'primary-mathematics-source-pages-v7.js'});
runInContext(source('session-teaching-sequence-v3.js'),context,{filename:'session-teaching-sequence-v3.js'});
runInContext(source('planning-chain-integrity-v10.js'),context,{filename:'planning-chain-integrity-v10.js'});
runInContext(source('significant-situation-core-v53.js'),context,{filename:'significant-situation-core-v53.js'});

const cases=[
  {
    name:'Inicial',level:'Inicial',ieType:'Polidocente',grades:['5 años'],
    areas:['Comunicación','Ciencia y Tecnología'],type:'Proyecto de aprendizaje',
    brief:'Aparecieron hormigas en el aula y los niños de 5 años quieren observarlas y contar qué descubren.',
    chosenTitle:/Escuchamos relatos y exploramos imágenes/i,
    situationPart:/hormigas/i,
    criterion:/imágenes|gestos|dibujos/i,
    forbidden:/infiere e interpreta información relevante del texto|producción de textos convencionales/i
  },
  {
    name:'Primaria',level:'Primaria',ieType:'Multigrado',grades:['1.º','3.º','5.º'],
    areas:['Comunicación','Matemática','Ciencia y Tecnología'],type:'Unidad de aprendizaje',
    brief:'Los estudiantes observan cambios en las semillas del biohuerto y desean registrar su crecimiento.',
    chosenTitle:/Leemos textos/i,
    situationPart:/biohuerto/i,
    criterion:/información|interpreta/i,
    forbidden:/los estudiantes de 5 años/i
  },
  {
    name:'Secundaria',level:'Secundaria',ieType:'Polidocente',grades:['4.º'],
    areas:['Comunicación','Matemática'],type:'Proyecto de aprendizaje',
    brief:'En el colegio los estudiantes quieren medir el consumo de agua de los lavamanos para comparar datos y proponer mejoras.',
    chosenTitle:/Leemos textos/i,
    situationPart:/agua/i,
    criterion:/contrasta|sustenta/i,
    forbidden:/dibujos, trazos o dictados al docente/i
  }
];
const storedSessions=[];

for(const item of cases){
  const state=window.state;
  Object.assign(state,{
    level:item.level,ieType:item.ieType,grades:item.grades,areas:item.areas,
    language:'Castellano',teacherName:`Docente de ${item.name}`,
    institutionMaster:{ieName:`I.E. ${item.name}`,teacherName:`Docente de ${item.name}`}
  });
  Object.assign(registry,{
    unitType:element({value:item.type}),unitDuration:element({value:'2 semanas'}),
    unitTitle:element({value:`Exploramos ${item.name}`}),unitSituation:element({value:item.brief}),
    ddProposalChooser:element(),ddCancelChoice:element(),ddContinueProducts:element(),
    ddBuildUnit:element(),ddBackSituation:element(),ddHelpProduct:element(),
    ddOwnSituation:element(),ddOwnProduct:element()
  });
  window.createUnitDemo(); // Selector de dos situaciones y tres productos.
  const choice=state.pendingUnitChoice;
  assert.equal(choice.brief,item.brief,`${item.name}: contexto de origen`);
  assert.ok(choice.situations.length>=2,`${item.name}: debe ofrecer dos situaciones`);
  assert.ok(choice.products.length>=3,`${item.name}: debe ofrecer al menos tres productos`);
  assert.match(choice.situations[0].text,item.situationPart);
  assert.ok(choice.situations[0].text.includes(item.brief),`${item.name}: se omitió el hecho o interés aportado por el docente`);
  assert.match(choice.reto,item.situationPart);
  assert.match(choice.contextFocus,item.situationPart);
  assert.ok(choice.contextFocus.length<100,`${item.name}: foco temático excesivamente largo`);
  if(item.level==='Secundaria'){
    assert.match(choice.reto,/comparar datos y proponer mejoras/i,'El reto debe retener la finalidad expresada');
    assert.match(choice.products[0].title,/propuesta de mejora/i,'El producto debe permitir responder al reto');
  }

  // Simular los dos clics del docente: elegir situación A, producto 1 y
  // construir. Se ejecuta finalizeChoice() real, NO se asignan manualmente.
  registry.ddContinueProducts.onclick();
  registry.ddBuildUnit.onclick();
  const unit=state.units[0];
  unit.id=`unidad-${item.name.toLowerCase()}`;
  state.activeUnitId=unit.id;
  assert.equal(unit.selectionApproved,true);
  assert.equal(unit.situation,choice.situations[0].text);
  assert.equal(unit.product,choice.products[0].text);
  assert.equal(unit.contextFocus,choice.contextFocus);
  const audit=window.ddSignificantSituationCore.audit({
    context:item.brief,significantSituation:unit.situation,challenge:unit.reto,product:unit.product
  });
  assert.equal(audit.ok,true,`${item.name}: ${audit.issues.join(' | ')}`);
  assert.equal(unit.documentContextSnapshot.institution,`I.E. ${item.name}`,
    `${item.name}: creador ampliado debe guardar la identidad`);
  assert.equal(unit.documentContextSnapshot.teacher,`Docente de ${item.name}`);
  assert.deepEqual([...unit.grades],item.grades);
  assert.ok(unit.activities.length>=5);
  if(item.level==='Inicial'){
    assert.ok(unit.activities.some(a=>/trazos|dibujos|dictados/i.test(a.title)));
    assert.ok(unit.purposes.every(p=>p.criteria.every(c=>!/sustenta y organiza información|hipótesis|contrasta hipótesis/i.test(c.text))),
      'Inicial: criterios deben ser observables en el juego, exploración y comunicación');
  }
  const word=window.unitWordHtml(unit);
  assert.match(word,new RegExp(`I\\.E\\. ${item.name}`));
  assert.match(word,new RegExp(`Docente de ${item.name}`));
  if(item.level==='Primaria'){
    assert.match(word,/Organización curricular por ciclos y grados seleccionados/);
    assert.match(word,/Ciclo III/);
    assert.match(word,/Ciclo IV/);
    assert.match(word,/Ciclo V/);
  }
  if(item.type==='Proyecto de aprendizaje')assert.match(word,/PROYECTO DE APRENDIZAJE/);

  const activityIndex=unit.activities.findIndex(a=>item.chosenTitle.test(a.title));
  assert.ok(activityIndex>=0,`${item.name}: falta actividad lectora/relato planificada`);
  registry.sessionUnit.value=unit.id;
  registry.activity.value=String(activityIndex);
  registry.sessionTitle.value=unit.activities[activityIndex].title;
  registry.sessionDuration.value='45 minutos';
  const session=window.buildSession();
  assert.equal(session.unitId,unit.id);
  assert.equal(session.planningChainSnapshot?.unitId,unit.id,`${item.name}: se conserva traza del origen`);
  assert.equal(window.DD_PLANNING_CHAIN_V10.auditSession(session).ok,true,`${item.name}: traza inicial íntegra`);
  assert.equal(session.level,item.level);
  assert.deepEqual([...session.grades],item.grades);
  assert.match(session.criterion,item.criterion);
  assert.match(session.purpose,item.situationPart,`${item.name}: propósito sin el tema original`);
  assert.doesNotMatch(session.purpose,/Exploramos (?:Inicial|Primaria|Secundaria)/,`${item.name}: propósito dominado por título genérico`);
  assert.doesNotMatch(session.purpose,item.forbidden);
  assert.doesNotMatch(session.evidence,item.forbidden);
  assert.ok(session.purpose.length>70);
  assert.ok(session.evidence.length>25);
  assert.ok(session.criterion.length>30);
  const complete=window.sessionHtml(session);
  assert.match(complete,new RegExp(item.name,'i'));
  assert.match(complete,/dd-phase3-sequence/,'La sesión debe mostrar la secuencia didáctica concreta');
  assert.match(complete,/TRAZABILIDAD UNIDAD\/PROYECTO/,'La sesión debe mostrar el reto, producto y actividad de origen');
  assert.match(complete,/Producto integrador/);
  assert.match(complete,/REGISTRO DE EVALUACIÓN FORMATIVA/);
  assert.match(complete,/Evidencia a observar/);
  assert.match(complete,/MATRIZ DE USO DE RECURSOS/,'Conservar los anexos de Sesiones Maestras');
  assert.match(complete,/SISTEMATIZACIÓN|PARA PIZARRA \/ SISTEMATIZACIÓN/,'Conservar síntesis por nivel');
  assert.match(complete,/Capacidades por verificar/,'No presentar capacidades como oficiales sin matriz literal verificada');
  assert.doesNotMatch(complete,/FORMALIZACIÓN PARA PIZARRA|Se desarrolla el proceso con preguntas de alta demanda cognitiva|Preparar la situación de problematización/);
  if(item.level==='Inicial'){
    assert.match(complete,/registro de descubrimientos/i);
    assert.match(complete,/dibujos, producciones, palabras dictadas/);
    assert.match(complete,/espacios accesibles de juego y exploración/);
    assert.doesNotMatch(complete,/fichas A4|conflicto cognitivo/i);
    assert.doesNotMatch(complete,/Contrasta dos textos o fuentes/);
  }else if(item.level==='Primaria'){
    assert.match(complete,/Rotación multigrado/);
    assert.match(complete,/Ciclos de Primaria presentes en esta aula/);
    assert.match(complete,/Con apoyo, observa imágenes/);
    assert.match(complete,/Compara dos fragmentos o fuentes/);
    const tasks=item.grades.map(g=>window.ddSessionTeachingSequenceV3.gradeTask(session,g).task);
    assert.equal(new Set(tasks).size,3,'Tareas multigrado distintas para 1.º, 3.º y 5.º');
  }else{
    assert.match(complete,/Contrasta dos textos o fuentes/);
    assert.match(complete,/justifica una conclusión/);
  }
  assert.match(window.sessionHtml(session,true),/dd-phase3-sequence/,'Word debe contener la misma secuencia');
  const docx=window.DDWordExport.createBlob(session.title,window.sessionHtml(session,true),false,session.documentContextSnapshot);
  const wordBytes=new Uint8Array(await docx.arrayBuffer());
  assert.deepEqual([...wordBytes.subarray(0,2)],[0x50,0x4b],`${item.name}: Word ZIP inválido`);
  const wordRaw=new TextDecoder().decode(wordBytes);
  assert.match(wordRaw,/REGISTRO DE EVALUACIÓN FORMATIVA/);
  assert.match(wordRaw,/Evidencia a observar/);
  assert.match(wordRaw,new RegExp(`I\\.E\\. ${item.name}`));
  if(item.level==='Primaria'){
    assert.match(wordRaw,/Ciclo III/);
    assert.match(wordRaw,/Ciclo IV/);
    assert.match(wordRaw,/Ciclo V/);
  }
  storedSessions.push({session,level:item.level,school:`I.E. ${item.name}`});
  console.log(`CASO_${item.name.toUpperCase()}_PASS: contexto → situación → reto → producto → unidad/proyecto → sesión`);
}

// Reabrir después de cambiar el perfil/selector tampoco debe alterar
// el nivel, la identidad o las tareas del documento de origen.
for(const saved of storedSessions){
  const html=window.sessionHtml(saved.session);
  assert.equal(saved.session.level,saved.level);
  assert.equal(saved.session.documentContextSnapshot.institution,saved.school);
  assert.match(html,/dd-phase3-sequence/);
  if(saved.level==='Inicial')assert.match(html,/juego y exploración/);
  if(saved.level==='Primaria')assert.match(html,/Rotación multigrado/);
}

// Fase 4: cualquier subconjunto real de 1.º a 6.º, incluso grados del mismo
// ciclo o saltos entre ciclos. Nunca inventar grados/ciclos ausentes.
const primary=storedSessions.find(s=>s.level==='Primaria').session;
const allGrades=['1.º','2.º','3.º','4.º','5.º','6.º'];
const scenarios=[
  {grades:['2.º','4.º'],cycles:['III','IV']},
  {grades:['3.º','6.º'],cycles:['IV','V']},
  {grades:['1.º','2.º'],cycles:['III']},
  {grades:['2.º','5.º','6.º'],cycles:['III','V']},
  {grades:allGrades,cycles:['III','IV','V']},
  {grades:['6.º'],cycles:['V']}
];
for(const scenario of scenarios){
  const modified={...primary,grades:scenario.grades,ieType:'Multigrado'};
  const module=window.ddSessionTeachingSequenceV3;
  const actualGroups=module.primaryCycleGroups(scenario.grades);
  assert.deepEqual([...actualGroups.map(g=>g.cycle)],scenario.cycles);
  assert.deepEqual([...actualGroups.flatMap(g=>g.grades)],scenario.grades);
  const tasks=scenario.grades.map(g=>module.gradeTask(modified,g).task);
  assert.equal(new Set(tasks).size,scenario.grades.length,'No duplicar la actividad de dos grados distintos');
  const html=window.sessionHtml(modified);
  const sequence=html.slice(html.indexOf('class="dd-phase3-sequence"'));
  for(const grade of allGrades){
    const cell=`<td>${grade}</td>`;
    if(scenario.grades.includes(grade))assert.ok(sequence.includes(cell),`Falta ${grade}`);
    else assert.ok(!sequence.includes(cell),`Se agregó ${grade} sin seleccionar`);
  }
  for(const cycle of ['III','IV','V']){
    const cell=`<td>Ciclo ${cycle}</td>`;
    if(scenario.cycles.includes(cycle))assert.ok(sequence.includes(cell),`Falta el ciclo ${cycle}`);
    else assert.ok(!sequence.includes(cell),`Se agregó el ciclo ${cycle} sin grados`);
  }
  assert.equal(/Rotación multigrado/.test(sequence),scenario.grades.length>1);
  if(scenario.grades.join(',')==='2.º,4.º'){
    const doc=window.DDWordExport.createBlob(modified.title,window.sessionHtml(modified,true),false,modified.documentContextSnapshot);
    const raw=new TextDecoder().decode(new Uint8Array(await doc.arrayBuffer()));
    assert.match(raw,/Ciclo III/);
    assert.match(raw,/Ciclo IV/);
    assert.doesNotMatch(raw,/Ciclo V/);
  }
}

// Confirmar que la interfaz permite elegir grados no consecutivos y retiene
// únicamente la selección del docente.
let buttons=[];
registry.gradeChoices=element({appendChild(btn){buttons.push(btn);}});
registry.gradeHelp=element();
Object.assign(window.state,{level:'Primaria',ieType:'Multigrado',grades:[]});
runInContext('renderGrades()',context);
buttons.slice(-6)[1].onclick(); // 2.º
buttons.slice(-6)[5].onclick(); // 6.º
assert.deepEqual([...window.state.grades],['2.º','6.º']);
assert.deepEqual([...window.ddSessionTeachingSequenceV3.primaryCycleGroups(window.state.grades).map(g=>g.cycle)],['III','V']);
assert.match(source('index.html'),/III ciclo:<\/b> 1\.º y 2\.º/);
assert.match(source('index.html'),/IV ciclo:<\/b> 3\.º y 4\.º/);
assert.match(source('index.html'),/V ciclo:<\/b> 5\.º y 6\.º/);
assert.match(source('onboarding.html'),/III ciclo:<\/b> 1\.º y 2\.º/);

// Fase 5: Comunicación exige tres procesos distintos; una actividad cuyo
// verbo central es «escribimos» no se convierte en lectura por mencionar leer.
// Cambiamos de la fixture sintética a la fuente real solo después de probar
// los tres niveles y las combinaciones multigrado.
delete window.DD_OFFICIAL_CURRICULUM;
runInContext(source('official-curriculum-v1.js'),context,{filename:'official-curriculum-v1.js'});
const communicationScenarios=[
  {title:'Leemos textos sobre las semillas',mode:'lectura',task:/Lee un texto accesible/},
  {title:'Escribimos un texto y luego lo leemos a los compañeros',mode:'escritura',task:/Planifica, redacta y revisa un texto/},
  {title:'Dialogamos sobre la lectura de los relatos del biohuerto',mode:'oral',task:/Organiza una exposición o intercambio/}
];
for(const scenario of communicationScenarios){
  const candidate={...primary,title:scenario.title,grades:['3.º'],area:'Comunicación',
    criterion:window.ddSessionLearningCore.criterionForSession('Comunicación',scenario.title,'las semillas','', 'Primaria')};
  assert.equal(window.ddSessionTeachingSequenceV3.communicationMode(candidate),scenario.mode);
  assert.match(window.ddSessionTeachingSequenceV3.gradeTask(candidate,'3.º').task,scenario.task);
  const criterion=window.ddSessionTeachingSequenceV3.gradeCriterion(candidate,'3.º');
  assert.doesNotMatch(criterion,/Organiza y comunica información pertinente/,'No reutilizar el criterio genérico de la unidad');
  if(scenario.mode==='lectura')assert.match(criterion,/Identifica e interpreta información/);
  if(scenario.mode==='escritura')assert.match(criterion,/Produce un texto/);
  if(scenario.mode==='oral')assert.match(criterion,/Comunica información/);
  const html=window.sessionHtml(candidate);
  assert.match(html,/Referencia curricular — Comunicación/);
  assert.match(html,/Los desempeños oficiales están localizados por página/,'No convertir la ubicación en transcripción oficial');
}

// Verificar la integración de la fuente curricular REAL en la sesión, no solo
// el clasificador aislado, incluyendo el documento Word.
for(const scenario of communicationScenarios){
  const candidate={...primary,title:scenario.title,grades:['3.º'],area:'Comunicación',
    criterion:window.ddSessionLearningCore.criterionForSession('Comunicación',scenario.title,'las semillas','', 'Primaria')};
  const expected=window.DD_OFFICIAL_CURRICULUM.pickCompetence('Primaria','Comunicación',scenario.title);
  const html=window.sessionHtml(candidate);
  assert.match(html,new RegExp(expected.name));
  assert.match(html,/Capacidades del programa/);
  assert.match(html,/Programa curricular de Educación Primaria — MINEDU/);
  assert.match(html,/páginas PDF/);
  assert.match(html,/Los desempeños oficiales están localizados por página/);
  const sourcePages=window.DD_PRIMARY_COMMUNICATION_PAGES.forSession(candidate);
  assert.equal(sourcePages.length,1);
  assert.equal(sourcePages[0].cycle,'IV');
  assert.ok(html.includes(`<td>${sourcePages[0].standardPdfPage}</td>`));
  const doc=window.DDWordExport.createBlob(candidate.title,window.sessionHtml(candidate,true),false,candidate.documentContextSnapshot);
  const raw=new TextDecoder().decode(new Uint8Array(await doc.arrayBuffer()));
  assert.match(raw,new RegExp(expected.name),'Word: competencia vinculada a la acción principal');
  assert.match(raw,/Capacidades del programa/);
  assert.match(raw,/Desempeños del grado: páginas PDF/);
}

// Fase 7: Matemática tiene cuatro competencias con procesos pedagógicos,
// criterios, evidencias y páginas oficiales diferentes (sin tocar otros niveles).
const mathScenarios=[
  {title:'Calculamos la masa de semillas',mode:'cantidad',task:/Resuelve una situación con cantidades/},
  {title:'Completamos patrones de crecimiento',mode:'regularidad',task:/Construye y continúa patrones/},
  {title:'Calculamos el perímetro del biohuerto',mode:'forma',task:/Modela formas o recorridos/},
  {title:'Representamos datos de una encuesta del biohuerto',mode:'datos',task:/Recoge y cuenta datos sencillos/}
];
for(const scenario of mathScenarios){
  const candidate={...primary,title:scenario.title,grades:['2.º','6.º'],area:'Matemática',
    criterion:window.ddSessionLearningCore.criterionForSession('Matemática',scenario.title,'semillas del biohuerto','','Primaria')};
  assert.equal(window.ddSessionTeachingSequenceV3.mathematicsMode(candidate),scenario.mode);
  assert.match(window.ddSessionTeachingSequenceV3.gradeTask(candidate,'2.º').task,scenario.task);
  const gradeCriterion=window.ddSessionTeachingSequenceV3.gradeCriterion(candidate,'6.º');
  assert.ok(gradeCriterion.includes('Ajuste sugerido para 6.º'));
  assert.doesNotMatch(gradeCriterion,/Organiza y comunica información pertinente/);
  const expected=window.DD_OFFICIAL_CURRICULUM.pickCompetence('Primaria','Matemática',scenario.title);
  const html=window.sessionHtml(candidate);
  assert.match(html,/Referencia curricular — Matemática/);
  assert.match(html,new RegExp(expected.name));
  assert.match(html,/Los desempeños oficiales están localizados por página/);
  const pages=window.DD_PRIMARY_MATHEMATICS_PAGES.forSession(candidate);
  assert.deepEqual([...pages.map(p=>p.cycle)],['III','V']);
  for(const page of pages)assert.ok(html.includes(`<td>${page.standardPdfPage}</td>`));
  const doc=window.DDWordExport.createBlob(candidate.title,window.sessionHtml(candidate,true),false,candidate.documentContextSnapshot);
  const raw=new TextDecoder().decode(new Uint8Array(await doc.arrayBuffer()));
  assert.match(raw,new RegExp(expected.name));
  assert.match(raw,/Desempeños del grado: páginas PDF/);
}

const primaryUnit=window.state.units.find(u=>u.level==='Primaria');
const realMathIndex=primaryUnit.activities.findIndex(a=>a.area==='Matemática');
assert.ok(realMathIndex>=0,'La Unidad real debe incluir una actividad matemática');
Object.assign(window.state,{level:'Primaria',ieType:'Multigrado',grades:[...primaryUnit.grades],areas:[...primaryUnit.areas]});
registry.sessionUnit.value=primaryUnit.id;
registry.activity.value=String(realMathIndex);
registry.sessionTitle.value=primaryUnit.activities[realMathIndex].title;
const realMathSession=window.buildSession();
assert.equal(realMathSession.area,'Matemática');
assert.ok(realMathSession.sessionAuditV54.ok);
assert.match(window.sessionHtml(realMathSession),/Referencia curricular — Matemática/);
assert.match(realMathSession.purpose,/para explicar|para fundamentar|para justificar/);

console.log('THREE_LEVEL_PEDAGOGY_PASS: 3 niveles y 6 combinaciones multigrado; ciclos III, IV y V solo cuando corresponden');
