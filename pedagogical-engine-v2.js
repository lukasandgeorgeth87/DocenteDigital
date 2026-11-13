/* Docente Digital — Motor Pedagógico V2: planificación por evidencia, no por rotación de frases.
 * Primer alcance certificado: Primaria 2.º, 3 semanas, derechos de la niñez, 2 sesiones/día.
 * Se activa SOLO tras revisar y aprobar una propuesta. No llama a GPT ni escribe producción.
 */
(function(root){
 'use strict';
 if(root.DDPedagogicalV2)return;
 const data=root.DD_PED_V2_CATALOG;
 if(!data)return;
 const VERSION='2.0.0-rights-grade2';
 const AREAS=Object.keys(data.routes);
 const DAYS=['Lunes','Martes','Miércoles','Jueves','Viernes'];
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const text=v=>String(v??'').replace(/[ \t]+/g,' ').trim();
 const norm=v=>text(v).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 const own=(obj,key)=>Object.prototype.hasOwnProperty.call(obj,key);
 const phaseName=week=>['Explorar y preguntar','Investigar y construir explicaciones','Comunicar, revisar y evaluar'][week-1]||'';
 const warn=message=>({ok:false,reason:message});
 const isRightsUnit=unit=>Boolean(unit&&unit.level==='Primaria'
  &&Array.isArray(unit.grades)&&unit.grades.length===1&&/^\s*2\.\s*[º°]\s*$/.test(unit.grades[0])
  &&/^\s*3\s+semanas?\s*$/i.test(unit.duration||'')
  &&/\bderechos?\b/.test(norm([unit.situationBrief,unit.title,unit.situation].join(' '))));
 function eligible(unit){
  if(!isRightsUnit(unit))return false;
  if(!Array.isArray(unit.activities)||unit.activities.length!==30)return false;
  return true;
 }
 function source(){return root.DD_OFFICIAL_CURRICULUM;}
 function competence(area,key){
  const official=data.competences[key];
  const list=source()?.getArea?.('Primaria',area)||[];
  return list.find(x=>x.name===official&&Array.isArray(x.capacities)&&x.capacities.length)||null;
 }
 function design(unit){
  if(!isRightsUnit(unit))return warn('Esta primera versión está validada exclusivamente para 2.º de Primaria, derechos y tres semanas.');
  if(!Array.isArray(unit.activities)||unit.activities.length!==30)
   return warn('El horario contiene '+(unit.activities?.length||0)+' sesiones. Para esta prueba se requieren 30: dos por día durante tres semanas. No inventaremos sesiones ni cambiaremos el horario.');
  const daily={},weekly={},used={},plans=[];
  const product=text(unit.productTitle||unit.product)||'Producto integrador por definir';
  const originalTitle=text(unit.title);
  const title=/derech/i.test(originalTitle)&&!/(?:quiero|necesito|crear una unidad|\b3 semanas\b)/i.test(originalTitle)
    ?originalTitle:'Nuestros derechos en acción: investigamos y compartimos lo aprendido';
  for(const item of unit.activities){
   const week=Number(item.week),area=text(item.area),day=text(item.day);
   if(!Number.isInteger(week)||week<1||week>3)return warn('Una actividad no tiene una semana válida.');
   if(!AREAS.includes(area))return warn('El área '+area+' todavía no cuenta con una ruta V2 validada.');
   if(!DAYS.includes(day))return warn('El día '+day+' no está registrado en el horario esperado.');
   const dayKey=week+'|'+day;
   daily[dayKey]=(daily[dayKey]||0)+1;
   weekly[week]=(weekly[week]||0)+1;
   const key=area+'|'+week;
   const ordinal=used[key]||0;
   const tuple=data.routes[area][week-1]?.[ordinal];
   if(!tuple)return warn('No existe una actividad diferente y revisada para '+area+' en la semana '+week+'. No repetiré un título genérico.');
   const c=competence(area,tuple[6]);
   if(!c)return warn('Competencia curricular sin confirmar para '+area+': '+(data.competences[tuple[6]]||'sin denominación')+'.');
   used[key]=ordinal+1;
   const [activityTitle,question,studentAction,evidence,criterion,resource,compKey]=tuple;
   const contribution=week===1
     ?'Reconocer derechos, formular preguntas y reunir primeras evidencias para decidir qué comunicará el producto.'
     :week===2
       ?'Organizar la información y producir o revisar componentes que contribuyen al producto elegido.'
       :'Revisar, comunicar y evaluar lo aprendido con apoyo de evidencias y criterios.';
   plans.push({...item,title:activityTitle,week,area,studentAction,evidence,criterion,
    v2Plan:{version:VERSION,week,phase:phaseName(week),question,studentAction,
      evidence,criterion,resource,competence:c.name,capacities:[...c.capacities],
      contribution,kind:compKey,product}});
  }
  for(let week=1;week<=3;week++){
   if(weekly[week]!==10)return warn('Semana '+week+': el horario contiene '+(weekly[week]||0)+' sesiones, no 10.');
   for(const day of DAYS)if(daily[week+'|'+day]!==2)
    return warn('Semana '+week+', '+day+': se requieren dos sesiones del horario real, sin inventarlas.');
  }
  const titles=new Set(plans.map(a=>norm(a.title)));
  if(titles.size!==30)return warn('Hay títulos repetidos. Es necesario ampliar el catálogo antes de guardar.');
  const proposedSituation=
   'Como punto de partida, los estudiantes de segundo grado conocerán dos historietas ficticias: en una, una niña desea explicar su opinión y ser escuchada; en otra, varios niños conversan sobre cómo participar juntos en un juego. No se presenta ninguna de estas escenas como un hecho ocurrido en la institución o en las familias.\n\n'
   +'Al observarlas, los estudiantes expresarán qué derechos reconocen, formularán preguntas y leerán textos breves sobre el derecho a aprender, jugar, recibir buen trato y ser escuchados. A lo largo de tres semanas dialogarán, analizarán situaciones ficticias, propondrán acuerdos, resolverán problemas con datos recogidos en clase y elaborarán producciones adecuadas a su edad. Los resultados de las experiencias de Ciencia y Tecnología se registrarán tal como se observen, sin afirmar hechos que no puedan comprobarse.\n\n'
   +'Al concluir, organizarán y compartirán '+product.toLowerCase()+' con explicaciones claras, ejemplos respetuosos y evidencias de lo aprendido. La propuesta se adecuará con el docente a las características reales de su aula.';
  const challenge='¿Cómo podemos explicar nuestros derechos con ejemplos claros, respetar los derechos de los demás y compartir lo aprendido mediante nuestro producto?';
  const purpose='Que los estudiantes de segundo grado comprendan derechos de la niñez mediante historias ficticias y fuentes adecuadas a su edad, dialoguen y lean con propósito, escriban y revisen mensajes, utilicen datos reales de clase en actividades matemáticas y participen en acuerdos de convivencia, para comunicar lo aprendido mediante '+product+'.';
  return {ok:true,version:VERSION,title,situation:proposedSituation,reto:challenge,purpose,product,
   activities:plans,scope:'Segundo grado de Primaria (ciclo III); derechos; tres semanas; 30 sesiones de horario existente',
   curricularVerified:true,coverage:{weeks:weekly,areas:[...new Set(plans.map(a=>a.area))],sessions:plans.length},
   warnings:['Las situaciones iniciales son ficticias; no atribuir incidentes reales a la comunidad.',
    'Los criterios son propuestas de evaluación, no desempeños oficiales literales.',
    'Revisar fuentes y actuaciones de Ciencia y Tecnología antes de aplicar en el aula.']};
 }
 function describeProcesses(plan,area){
  const q=plan.question,action=plan.studentAction,evidence=plan.evidence;
  if(area==='Matemática')return [
   ['Familiarización con el problema','Leen o escuchan la pregunta «'+q+'». Identifican datos, condiciones y lo que deben averiguar, con sus propias palabras.'],
   ['Búsqueda y ejecución de estrategias',action+' Representan con material concreto, dibujos o una tabla según corresponda.'],
   ['Socialización de representaciones','Comparan dos procedimientos; señalan qué representan los números o datos y explican por qué una respuesta es válida.'],
   ['Reflexión y generalización','Comprueban la respuesta con los datos disponibles y expresan una regla o procedimiento que se sostiene en lo trabajado.'],
   ['Planteamiento de otros problemas','Cambian una cantidad o condición del ejemplo y explican qué deben ajustar para resolver una nueva situación.']
  ];
  if(area==='Comunicación'){
   if(plan.kind==='read')return [
    ['Antes de leer','Exploran el título y la imagen, anticipan de qué tratará el texto y señalan qué información esperan encontrar.'],
    ['Durante la lectura',action+' Subrayan o señalan una pista concreta del texto.'],
    ['Después de leer','Comparan lo que anticiparon con lo leído; responden «'+q+'» usando una pista y no solo su opinión.'],
    ['Revisión y comunicación','Comparten su interpretación, escuchan otra y completan la evidencia: '+evidence+'.']
   ];
   if(plan.kind==='write')return [
    ['Planificación','Identifican destinatario, propósito y mensaje; responden «'+q+'».'],
    ['Textualización',action+' Organizan sus ideas en un primer borrador.'],
    ['Revisión','Intercambian sus textos, contrastan con el criterio y realizan una corrección visible.'],
    ['Publicación o uso','Presentan el texto revisado y explican qué decisión de escritura lo hizo más claro.']
   ];
   return [
    ['Antes del intercambio','Observan la escena ficticia y anticipan respuestas a «'+q+'». Acuerdan cómo escuchar y pedir la palabra.'],
    ['Durante el intercambio',action+' El docente registra intervenciones y preguntas sin dirigir todas las respuestas.'],
    ['Después del intercambio','En parejas reconocen una idea que lograron explicar y una intervención que ayudó a comprender mejor.'],
    ['Retroalimentación','Contrastan su participación con el criterio y reformulan una pregunta o explicación cuando sea necesario.']
   ];
  }
  if(area==='Personal Social')return [
   ['Problematización','Leen o representan una escena ficticia vinculada a «'+q+'»; identifican el asunto común y puntos de vista diferentes.'],
   ['Análisis de información',action+' Diferencian lo que observan en la historia de su propia opinión.'],
   ['Toma de decisiones','Deliberan y justifican un acuerdo o acción que respete los derechos y favorezca la convivencia.'],
   ['Seguimiento','Explican cómo observarán el cumplimiento del acuerdo y registran '+evidence.toLowerCase()+'.']
  ];
  if(area==='Ciencia y Tecnología')return [
   ['Problematización','Formulan «'+q+'» como una pregunta sobre materiales o hechos observables, sin asumir el resultado.'],
   ['Predicción y plan','Comunican una predicción; acuerdan materiales seguros, qué condición cambiarán y qué mantendrán constante.'],
   ['Registro y análisis',action+' Registran solo lo que efectivamente observan en la ficha.'],
   ['Conclusión y límites','Comparan observación y predicción, reconocen lo no comprobado y comunican '+evidence.toLowerCase()+'.']
  ];
  if(area==='Arte y Cultura')return [
   ['Exploración','Observan distintas representaciones y comentan «'+q+'».'],
   ['Creación',action+' Deciden materiales y bocetan alternativas.'],
   ['Revisión','Comparan su producción con el mensaje que quieren comunicar y mejoran un detalle.'],
   ['Comunicación','Muestran '+evidence.toLowerCase()+' y explican su decisión artística.']
  ];
  if(area==='Educación Física')return [
   ['Activación y acuerdos','Reconocen el espacio, preparan el cuerpo de forma segura y responden «'+q+'».'],
   ['Acción motriz',action+' Acuerdan roles sin eliminación o exclusión de participantes.'],
   ['Ajustes','Detienen la actividad cuando lo requiere la seguridad; proponen y prueban una regla más inclusiva.'],
   ['Vuelta a la calma','Explican cómo cooperaron y registran '+evidence.toLowerCase()+'.']
  ];
  return [
   ['Experiencia y pregunta','Escuchan un relato pertinente a la educación religiosa de su IE y dialogan sobre «'+q+'».'],
   ['Reflexión',action+' Distinguen lo narrado de sus propias experiencias.'],
   ['Decisión de buen trato','Proponen una acción de respeto o solidaridad realizable en el aula sin atribuir creencias a otras personas.'],
   ['Comunicación','Comparten '+evidence.toLowerCase()+' y escuchan otras perspectivas.']
  ];
 }
 function sessionDetails(session,unit,activity){
  if(!activity?.v2Plan||!unit?.pedagogicalV2?.approved)return null;
  const p=activity.v2Plan;
  return {version:VERSION,...p,steps:describeProcesses(p,activity.area),
   title:activity.title,area:activity.area,week:activity.week,day:activity.day,time:activity.time||'',
   criterion:activity.criterion,evidence:activity.evidence,studentAction:activity.studentAction,
   purpose:'Hoy resolveremos esta pregunta: «'+p.question+'». Mostraremos lo aprendido mediante '+p.evidence.toLowerCase()+'.',
   unitTitle:unit.title};
 }
 const table=(headers,rows)=>'<table style="border-collapse:collapse;width:100%" border="1" cellpadding="5"><thead><tr>'
  +headers.map(h=>'<th>'+esc(h)+'</th>').join('')+'</tr></thead><tbody>'
  +rows.map(cells=>'<tr>'+cells.map(c=>'<td>'+esc(c)+'</td>').join('')+'</tr>').join('')
  +'</tbody></table>';
 function unitHtml(unit){
  const identity=unit.documentContextSnapshot||{};
  const areas=[...new Set(unit.activities.map(a=>a.area))];
  const grouped=new Map();
  for(const act of unit.activities){
   const key=act.area+'|'+act.v2Plan.competence;
   if(!grouped.has(key))grouped.set(key,act.v2Plan);
  }
  const purposeRows=[...grouped.entries()].map(([key,p])=>[key.split('|')[0],p.competence,p.capacities.join('; '),
   unit.activities.filter(a=>a.v2Plan.competence===p.competence).map(a=>a.criterion).slice(0,2).join(' / ')]);
  const body=['<div class="dd-v2-document">',
   '<h1 style="text-align:center">'+esc((unit.type||'Unidad de aprendizaje').toUpperCase())+' — PROPUESTA PEDAGÓGICA V2</h1>',
   '<h2 style="text-align:center">“'+esc(unit.title)+'”</h2>',
   '<p><b>Alcance:</b> 2.º grado de Primaria · Ciclo III · Tres semanas · '+unit.activities.length+' sesiones del horario guardado</p>',
   '<h2>I. DATOS GENERALES</h2>',table(['Dato','Información'],[
    ['Institución',identity.institution||'Por confirmar con el docente'],
    ['Docente',identity.teacher||'Por confirmar con el docente'],
    ['Grado y atención',unit.grades.join(', ')+' · '+unit.ieType],
    ['Áreas seleccionadas',areas.join(', ')],['Producto final',unit.product]]),
   '<h2>II. SITUACIÓN SIGNIFICATIVA</h2>',...String(unit.situation).split('\n\n').map(s=>'<p>'+esc(s)+'</p>'),
   '<p><b>Pregunta retadora:</b> '+esc(unit.reto)+'</p>',
   '<h2>III. PROPÓSITO INTEGRADOR Y PRODUCTO</h2>',
   '<p>'+esc(unit.purpose)+'</p><p><b>Producto aprobado:</b> '+esc(unit.product)+'</p>',
   '<h2>IV. MATRIZ CURRICULAR DE ARTICULACIÓN</h2>',
   '<p>Competencias y capacidades cotejadas con el núcleo curricular oficial de la aplicación. Los criterios son propuestas observables a revisar, no citas literales de desempeños.</p>',
   table(['Área','Competencia','Capacidades','Criterios orientadores'],purposeRows),
   '<h2>V. SECUENCIA PROGRESIVA DE SESIONES</h2>',
   '<p>Semana 1: explorar y preguntar; semana 2: investigar y construir; semana 3: comunicar, revisar y evaluar. No se modifican los días ni los bloques del horario.</p>'];
  for(let w=1;w<=3;w++){
   body.push('<h3>Semana '+w+' — '+esc(phaseName(w))+'</h3>');
   body.push(table(['Día / bloque','Área','Sesión','Actuación y evidencia','Criterio'],
    unit.activities.filter(a=>a.week===w).map(a=>[
     a.day+' · '+(a.time||'Bloque '+a.block),a.area,a.title,
     a.studentAction+' Evidencia: '+a.evidence,a.criterion])));
  }
  body.push('<h2>VI. EVALUACIÓN FORMATIVA Y SEGUIMIENTO</h2>',
    '<p>En cada sesión observar la actuación descrita, registrar la evidencia indicada y retroalimentar usando el criterio de esa sesión. No marcar un nivel sin evidencia concreta.</p>',
    '<p><b>Escala orientadora:</b> C: necesita acompañamiento para iniciar la actuación. B: presenta parte de la evidencia con orientación. A: demuestra la actuación según el criterio. AD: la explica y la aplica en otra situación pertinente. Redactar descriptores específicos tras observar al grupo.</p>',
    '<h2>VII. DECISIONES DE CALIDAD Y ASPECTOS POR VERIFICAR</h2><ul>',
    '<li>Historietas y casos ficticios: no atribuir vulneraciones de derechos a estudiantes o familias reales.</li>',
    '<li>Verificar disponibilidad de materiales, idioma de enseñanza y adecuaciones de acceso y participación.</li>',
    '<li>Las observaciones científicas no prueban eliminación de microorganismos.</li>',
    '<li>Revisar los desempeños de 2.º grado y la pertinencia de los criterios antes de aplicar.</li>',
    '</ul><p><i>Producto de planificación supervisado por el docente; no es documento oficialmente emitido por el MINEDU.</i></p>',
    '</div>');
  return body.join('');
 }
 function sessionHtmlV2(session){
  const p=session.pedagogicalV2;
  const question=session.challenge||p.question;
  const evidence=session.evidence||p.evidence;
  const times=session.times||{start:10,dev:20,close:10};
  const steps=p.steps.map(([label,action])=>'<li><b>'+esc(label)+'</b>: '+esc(action)+'</li>').join('');
  return '<div class="dd-v2-document">'
   +'<h1 style="text-align:center">SESIÓN DE APRENDIZAJE — 2.º GRADO DE PRIMARIA</h1>'
   +'<h2 style="text-align:center">“'+esc(session.title)+'”</h2>'
   +table(['Datos','Detalle'],[
     ['Área / ciclo',session.area+' · Ciclo III'],
     ['Unidad',session.unitTitle],
     ['Semana / día',p.week+' · '+p.day],
     ['Duración',session.duration],
     ['Competencia oficial',p.competence],
     ['Capacidades oficiales',p.capacities.join('; ')],
     ['Producto de unidad',p.product]])
   +'<h2>I. PROPÓSITO, CRITERIO Y EVIDENCIA</h2>'
   +'<p><b>Propósito para estudiantes:</b> '+esc(session.purpose)+'</p>'
   +table(['Criterio observable','Evidencia','Instrumento'],[[
     session.teacherCriteria?.['2.º']||session.criterion,session.evidence,session.instrument||'Lista de cotejo']])
   +'<h2>II. MOMENTOS Y PROCESOS DIDÁCTICOS</h2>'
   +'<h3>INICIO — '+esc(times.start??10)+' min</h3>'
   +'<p>Observan el recurso previsto: '+esc(p.resource)+' Plantean ideas iniciales ante la pregunta «'+esc(question)+'». El docente recoge sus explicaciones sin adelantar respuestas y comunica el propósito y el criterio.</p>'
   +'<h3>DESARROLLO — '+esc(times.dev??20)+' min</h3>'
   +'<ol>'+steps+'</ol>'
   +'<h3>CIERRE — '+esc(times.close??10)+' min</h3>'
   +'<p>Explican o muestran '+esc(evidence.toLowerCase())+'; comparan su actuación con el criterio, reconocen una dificultad y acuerdan una mejora concreta.</p>'
   +'<h2>III. RETO CONCRETO, TAREA Y EVALUACIÓN</h2>'
   +'<p><b>Pregunta de trabajo:</b> '+esc(question)+'</p>'
   +'<p><b>Acción del estudiante:</b> '+esc(p.studentAction)+'</p>'
   +'<p><b>Contribución a la unidad:</b> '+esc(p.contribution)+'</p>'
   +table(['Nivel','Descriptor propuesto a verificar'],[
     ['C – Inicio','Requiere apoyo directo para realizar la actuación y producir evidencia.'],
     ['B – Proceso','Realiza parte de la actuación y requiere preguntas orientadoras para completarla.'],
     ['A – Logro esperado',session.teacherCriteria?.['2.º']||session.criterion],
     ['AD – Destacado','Justifica la actuación y explica cómo aplicarla en otro ejemplo apropiado a su edad.']])
   +'<h2>IV. MATERIALES Y PREPARACIÓN</h2><p>'+esc(p.resource)+'</p>'
   +'<p>El docente prepara solo los materiales previstos, revisa la seguridad del ejemplo y recoge evidencias reales sin exponer datos personales.</p>'
   +'<p><i>Competencia y capacidades verificadas en el programa curricular. Criterios y actuaciones son propuestas pedagógicas sujetas a revisión.</i></p>'
   +'</div>';
 }
 function auditWithV3(unit,proposal){
  const core=root.DDPlanningCoreV3;
  if(!core){
   if(typeof document!=='undefined')throw new Error('El Motor V3 no está cargado. No se aprobará ni exportará una planificación sin su revisión.');
   return null; // Compatibilidad con las pruebas históricas de V2 aisladas, sin navegador.
  }
  const reviewed=core.compile(unit,()=>proposal,source());
  if(!reviewed.ok){
   const first=reviewed.errors.slice(0,4).map(x=>x.field+': '+x.message).join(' ');
   throw new Error('La planificación no superó la revisión V3. '+first);
  }
  return reviewed;
 }
 function currentApprovedPlan(unit){
  return {title:unit.title,situation:unit.situation,reto:unit.reto,
   purpose:unit.purpose,product:unit.product,activities:unit.activities};
 }
 function apply(unit,proposal,edits={}){
  if(!proposal?.ok||!eligible(unit))throw new Error('Propuesta incompatible o incompleta. No se modificó la unidad.');
  if(proposal.activities.length!==30||!proposal.activities.every(x=>x.v2Plan?.competence&&x.criterion&&x.evidence))
   throw new Error('No se puede guardar una propuesta que no cumpla los criterios de coherencia.');
  const title=text(edits.title||proposal.title),situation=text(edits.situation||proposal.situation),
   reto=text(edits.reto||proposal.reto),purpose=text(edits.purpose||proposal.purpose);
  if(title.length<12||situation.length<180||reto.length<35||purpose.length<90)
   throw new Error('Revisa los campos antes de aprobar; faltan datos pedagógicos esenciales.');
  if(!/\bderechos?\b/.test(norm(title+' '+situation+' '+reto)))
   throw new Error('El texto dejó de responder al tema de derechos. No se modificó la unidad.');
  const v3Review=auditWithV3(unit,{...proposal,title,situation,reto,purpose});
  const backup={title:unit.title,situation:unit.situation,reto:unit.reto,purpose:unit.purpose,
   activities:unit.activities,selectedSituationSource:unit.selectedSituationSource,
   approvedSelectionSnapshot:unit.approvedSelectionSnapshot,pedagogicalV2:unit.pedagogicalV2,
   pedagogicalV3:unit.pedagogicalV3};
  const prior=JSON.parse(JSON.stringify(backup));
  unit.title=title;unit.situation=situation;unit.reto=reto;unit.purpose=purpose;
  unit.activities=proposal.activities;
  unit.selectedSituationSource='Docente';
  unit.approvedSelectionSnapshot={...(unit.approvedSelectionSnapshot||{}),situationKey:'Docente',
   situationText:situation,productKey:unit.selectedProductKey||'Docente',
   productTitle:unit.productTitle||unit.product,productDescription:unit.productDescription||''};
  unit.pedagogicalV2={version:VERSION,approved:true,scope:proposal.scope,approvedAt:new Date().toISOString(),
   original:prior,areaCount:proposal.coverage.areas.length,sessions:proposal.activities.length};
  if(v3Review)unit.pedagogicalV3={version:v3Review.version,auditedAt:new Date().toISOString(),
   warnings:v3Review.warnings.map(w=>({code:w.code,field:w.field,message:w.message}))};
  if(typeof root.save==='function'&&root.save()===false){
   for(const name of ['title','situation','reto','purpose','activities','selectedSituationSource',
    'approvedSelectionSnapshot','pedagogicalV2','pedagogicalV3']){
    if(own(prior,name))unit[name]=prior[name];else delete unit[name];
   }
   throw new Error('No se pudo guardar en este dispositivo. La versión anterior se conserva.');
  }
  return unit;
 }
 function restore(unit){
  const old=unit?.pedagogicalV2?.original;
  if(!old)return false;
  const snapshot=JSON.parse(JSON.stringify(unit));
  for(const name of ['title','situation','reto','purpose','activities','selectedSituationSource','approvedSelectionSnapshot'])
   unit[name]=old[name];
  if(old.pedagogicalV2)unit.pedagogicalV2=old.pedagogicalV2;else delete unit.pedagogicalV2;
  if(old.pedagogicalV3)unit.pedagogicalV3=old.pedagogicalV3;else delete unit.pedagogicalV3;
  if(typeof root.save==='function'&&root.save()===false){
   Object.assign(unit,snapshot);throw new Error('No se pudo guardar la restauración.');
  }
  return true;
 }
 function renderProposal(unit){
  const out=document.getElementById('unitOutput');
  if(!out)return;
  out.querySelector('#ddV2Proposal')?.remove();
  const proposal=design(unit);
  const wrap=document.createElement('section');
  wrap.id='ddV2Proposal';wrap.className='dd-v2-panel';
  const h=document.createElement('h2');h.textContent='Propuesta pedagógica 2.0 · derechos de 2.º';
  wrap.append(h);
  if(!proposal.ok){
   const note=document.createElement('p');note.textContent=proposal.reason;wrap.append(note);out.prepend(wrap);return;
  }
  const info=document.createElement('p');
  info.textContent='Vista previa sin cambios guardados. '+proposal.coverage.sessions+' sesiones con títulos diferentes, actuaciones, criterios y evidencias. El horario y el producto que elegiste se mantienen.';
  wrap.append(info);
  const fields={};
  for(const [name,label,content,rows] of [
   ['title','Título propuesto',proposal.title,2],
   ['situation','Situación significativa',proposal.situation,8],
   ['reto','Pregunta retadora',proposal.reto,3],
   ['purpose','Propósito integrador',proposal.purpose,4]
  ]){
   const lb=document.createElement('label');lb.textContent=label;
   const tx=document.createElement('textarea');tx.value=content;tx.rows=rows;tx.maxLength=12000;tx.dataset.field=name;
   lb.append(tx);wrap.append(lb);fields[name]=tx;
  }
  const summary=document.createElement('div');summary.className='dd-v2-plan-preview';
  const caption=document.createElement('h3');caption.textContent='Ruta de las 30 sesiones — sin títulos repetidos';summary.append(caption);
  for(let w=1;w<=3;w++){
   const wh=document.createElement('h4');wh.textContent='Semana '+w+' · '+phaseName(w);summary.append(wh);
   const ul=document.createElement('ol');
   for(const lesson of proposal.activities.filter(a=>a.week===w)){
    const li=document.createElement('li');li.textContent=lesson.day+' · '+lesson.area+' · '+lesson.title+' — Evidencia: '+lesson.evidence;ul.append(li);
   }
   summary.append(ul);
  }
  wrap.append(summary);
  const feedback=document.createElement('p');feedback.setAttribute('role','status');wrap.append(feedback);
  const buttons=document.createElement('div');buttons.className='actions';
  const save=document.createElement('button');save.type='button';save.className='btn';save.textContent='Aprobar y generar unidad 2.0';
  const cancel=document.createElement('button');cancel.type='button';cancel.className='btn ghost';cancel.textContent='Conservar mi unidad actual';
  save.addEventListener('click',()=>{
   try{
    apply(unit,proposal,Object.fromEntries(Object.entries(fields).map(([k,v])=>[k,v.value])));
    root.renderUnits?.();root.renderUnitOutput?.(unit);root.fillSessionUnits?.();
   }catch(e){feedback.textContent=e.message;}
  });
  cancel.addEventListener('click',()=>wrap.remove());
  buttons.append(save,cancel);wrap.append(buttons);
  out.prepend(wrap);
  wrap.scrollIntoView?.({behavior:'smooth',block:'start'});
 }
 function uiApproved(unit,out){
  out.innerHTML='<div class="dd-v2-panel"><span class="pill">Propuesta V2 aprobada por el docente</span><h1>'+esc(unit.title)+'</h1>'
   +'<p>2.º grado · Ciclo III · tres semanas · 30 sesiones · Horario original conservado</p>'
   +'<h2>Situación significativa</h2>'+unit.situation.split('\n\n').map(x=>'<p>'+esc(x)+'</p>').join('')
   +'<p><b>Reto:</b> '+esc(unit.reto)+'</p><p><b>Propósito:</b> '+esc(unit.purpose)+'</p>'
   +'<p><b>Producto aprobado:</b> '+esc(unit.product)+'</p>'
   +'<div class="actions"><button type="button" class="btn" data-v2="sessions">Crear sesiones de esta unidad</button>'
   +'<button type="button" class="btn alt" data-v2="word">Descargar Word completo</button>'
   +'<button type="button" class="btn ghost" data-v2="restore">Restaurar versión anterior</button></div>'
   +'<h2>Progresión de sesiones y evidencias</h2>'
   +[1,2,3].map(w=>'<h3>Semana '+w+' — '+phaseName(w)+'</h3>'
      +table(['Día','Área','Título específico','Evidencia y criterio'],unit.activities.filter(a=>a.week===w).map(a=>[
       a.day,a.area,a.title,a.evidence+' · '+a.criterion]))).join('')
   +'<p><small>Las competencias están cotejadas con el núcleo curricular; los criterios son orientadores y el docente debe validar desempeños y pertinencia.</small></p>'
   +'</div>';
  const a=out.querySelector('[data-v2="sessions"]');if(a)a.addEventListener('click',()=>root.useUnit?.(unit.id));
  const b=out.querySelector('[data-v2="word"]');if(b)b.addEventListener('click',()=>root.downloadUnitWord?.(unit.id));
  const c=out.querySelector('[data-v2="restore"]');if(c)c.addEventListener('click',()=>{
    if(!root.confirm?.('¿Restaurar la versión anterior de esta unidad? Se conservarán tus demás unidades.'))return;
    try{restore(unit);root.renderUnitOutput?.(unit);root.renderUnits?.();}catch(e){root.alert?.(e.message);}
  });
 }
 const previousRender=root.renderUnitOutput;
 if(typeof previousRender==='function')root.renderUnitOutput=function(unit){
  const result=previousRender.apply(this,arguments);
  if(!isRightsUnit(unit))return result;
  const out=document.getElementById('unitOutput');if(!out)return result;
  if(unit?.pedagogicalV2?.approved){uiApproved(unit,out);return result;}
  const btn=document.createElement('button');
  btn.type='button';btn.className='btn';btn.id='ddV2Start';
  btn.textContent='Construir propuesta pedagógica 2.0';
  btn.addEventListener('click',()=>renderProposal(unit));
  const banner=document.createElement('div');banner.className='dd-v2-cta';
  banner.append(btn);
  const notice=document.createElement('p');notice.textContent='Genera una ruta de 30 sesiones con evidencias y criterios distintos; podrás revisarla antes de guardarla. Disponible inicialmente para derechos de 2.º grado.';
  banner.append(notice);out.prepend(banner);
  return result;
 };
 const previousBuild=root.buildSession;
 if(typeof previousBuild==='function')root.buildSession=function(){
  const prior=root.state?.lastSession;
  const session=previousBuild.apply(this,arguments);
  const unit=root.state?.units?.find(u=>u.id===session.unitId);
  const activity=unit?.activities?.[session.activityIndex];
  const p=sessionDetails(session,unit,activity);
  if(!p)return session;
  try{
   const checked=auditWithV3(unit,currentApprovedPlan(unit));
   if(checked){
    const compiled=root.DDPlanningCoreV3.compileSession(checked,session.activityIndex+1,{
     purpose:p.purpose,steps:p.steps,
     minutes:{start:session.times?.start,develop:session.times?.dev,close:session.times?.close},
     instrument:session.instrument||'Lista de cotejo'
    });
    if(!compiled.ok)throw new Error('La sesión no pasó V3: '+
     compiled.errors.slice(0,3).map(x=>x.message).join(' '));
    session.pedagogicalV3=compiled.session;
   }
   session.title=activity.title;session.competence=p.competence;session.capacities=p.capacities;
   session.purpose=p.purpose;
   session.criterion=p.criterion;session.evidence=p.evidence;session.challenge=p.question;
   session.resources=p.resource;session.pedagogicalV2=p;session.teacherReviewApproved=true;
   root.save?.();
   return session;
  }catch(error){
   if(root.state)root.state.lastSession=prior||null;
   root.save?.();
   throw error;
  }
 };
 const previousUnitWord=root.unitWordHtml;
 if(typeof previousUnitWord==='function')root.unitWordHtml=function(unit){
  if(unit?.pedagogicalV2?.approved){
   const checked=auditWithV3(unit,currentApprovedPlan(unit));
   if(checked)return root.DDPlanningCoreV3.renderDocument(checked);
   return unitHtml(unit);
  }
  return previousUnitWord.apply(this,arguments);
 };
 const previousSessionHtml=root.sessionHtml;
 if(typeof previousSessionHtml==='function')root.sessionHtml=function(session){
  if(session?.pedagogicalV2?.version===VERSION)return sessionHtmlV2(session);
  return previousSessionHtml.apply(this,arguments);
 };
 if(typeof document!=='undefined'){
  const style=document.createElement('style');
  style.textContent='.dd-v2-cta,.dd-v2-panel{background:#f7fcf9;border:1px solid #a9cdb8;border-radius:14px;padding:17px;margin:15px 0}.dd-v2-cta p{color:#45695a}.dd-v2-panel label{display:block;font-weight:700;margin:12px 0}.dd-v2-panel textarea{display:block;width:100%;min-height:72px;border-radius:9px;border:1px solid #a6c7b5;padding:9px;font:inherit;line-height:1.5;margin-top:6px}.dd-v2-panel textarea:focus{outline:3px solid #81c7a3}.dd-v2-panel li{margin:6px 0}.dd-v2-panel table{font-size:13px}.dd-v2-panel td,.dd-v2-panel th{vertical-align:top}.dd-v2-plan-preview{max-height:440px;overflow:auto;border:1px solid #d9e7de;background:white;padding:12px;border-radius:10px}';
  document.head?.appendChild(style);
 }
 root.DDPedagogicalV2=Object.freeze({version:VERSION,eligible,design,apply,restore,unitHtml,sessionHtmlV2,sessionDetails,describeProcesses});
})(window);
