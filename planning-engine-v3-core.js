/* Docente Digital — núcleo de planificación V3.
 * Una sola puerta de entrada para unidades, proyectos y sesiones.
 * Sin efectos laterales, sin llamadas a IA y sin afirmar desempeños no verificados.
 * Un proveedor curado aporta contenido; este núcleo controla su coherencia.
 */
(function(root){
 'use strict';
 if(root.DDPlanningCoreV3)return;
 const VERSION='3.0.0-contract-first';
 const clean=v=>String(v??'').replace(/\s+/g,' ').trim();
 const norm=v=>clean(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const copy=v=>JSON.parse(JSON.stringify(v));
 const escape=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
 const issue=(code,field,message)=>({code,field,message});
 const APPROVED_TYPES=['Unidad de aprendizaje','Proyecto de aprendizaje'];
 const PHASES=['exploracion','investigacion','produccion','comunicacion','evaluacion'];
 const BANNED=/tema solicitado por el docente|tema elegido por el docente|se propone desarrollar|el docente podra completar|en el entorno cercano de los estudiantes|sobre el en el entorno|crear una unidad de aprendizaje|crear un proyecto de aprendizaje/i;
 const DOMAINS=[
  ['agua',/\b(agua|hidric\w*|grif\w*|rio|rios|lluvia|lluvias|gotas?)\b/],
  ['derechos',/\b(derech\w*|convivencia|participacion|buen trato)\b/],
  ['siembra',/\b(siembra|semill\w*|huert\w*|cultiv\w*|germin\w*|cosech\w*)\b/],
  ['residuos',/\b(residu\w*|basura|recicl\w*|desech\w*)\b/],
  ['patrimonio',/\b(patrimonio|tradicion\w*|costumbr\w*|difuntos|tanta\s*wawa)\b/]
 ];
 const classified=s=>new Set(DOMAINS.filter(x=>x[1].test(norm(s))).map(x=>x[0]));
 const incompatible=(topic,other)=>{
  const a=classified(topic),b=classified(other);
  return a.size>0&&b.size>0&&![...a].some(x=>b.has(x));
 };
 const result=(errors,warnings,extra={})=>({
  ok:errors.length===0, errors, warnings, version:VERSION,...extra
 });
 function preflight(unit){
  const errors=[],warnings=[];
  if(!unit||typeof unit!=='object')return result([issue('unit_missing','unidad','No se recibió una planificación.')],warnings);
  if(!APPROVED_TYPES.includes(unit.type))
   errors.push(issue('type_unsupported','tipo','Indique Unidad de aprendizaje o Proyecto de aprendizaje; no se convertirán entre sí.'));
  if(!['Inicial','Primaria','Secundaria'].includes(unit.level))
   errors.push(issue('level_missing','nivel','Falta un nivel reconocido.'));
  if(!Array.isArray(unit.grades)||unit.grades.length===0||unit.grades.some(x=>!clean(x)))
   errors.push(issue('grade_missing','grado','Faltan los grados; no se puede asignar un grado supuesto.'));
  if(!Array.isArray(unit.areas)||!unit.areas.length)
   errors.push(issue('areas_missing','áreas','El docente debe seleccionar áreas.'));
  if(!clean(unit.duration))errors.push(issue('duration_missing','duración','Falta la duración.'));
  const subject=clean(unit.topic||unit.situationBrief||'');
  if(subject.length<3||/^una experiencia cercana/i.test(subject))
   errors.push(issue('subject_missing','tema','Falta una temática o situación concreta.'));
  if(!clean(unit.productTitle||unit.product)||/producto (?:(?:integrador|final) )?por (?:definir|confirmar)/i.test(clean(unit.product)))
   errors.push(issue('product_missing','producto','El producto no está definido; no puede inventarse.'));
  if(incompatible(subject,unit.title))
   errors.push(issue('topic_mismatch','título','El título parece corresponder a otro tema.'));
  if(!clean(unit.documentContextSnapshot?.institution))
   warnings.push(issue('institution_unconfirmed','institución','Institución no confirmada; no se reemplazará con un nombre inventado.'));
  if(!clean(unit.documentContextSnapshot?.teacher))
   warnings.push(issue('teacher_unconfirmed','docente','Docente no confirmado; no se reemplazará con un nombre inventado.'));
  return result(errors,warnings,{subject});
 }
 function curriculumMatch(curriculum,level,area,name,capacities){
  const official=curriculum?.getArea?.(level,area);
  if(!Array.isArray(official)||!official.length)return null;
  const found=official.find(x=>clean(x.name)===clean(name));
  if(!found||!Array.isArray(found.capacities)||!found.capacities.length)return null;
  if(capacities?.length&&!capacities.every(c=>found.capacities.some(o=>clean(c)===clean(o))))return null;
  return {competence:found.name,capacities:[...found.capacities],
   source:curriculum.sourceFor?.(level)?.title||'Programa curricular pendiente de confirmar'};
 }
 function didactic(area,activity){
  const steps=activity.steps||activity.v2Plan?.steps||[];
  if(area==='Matemática'&&steps.length){
   const labels=steps.map(s=>norm(Array.isArray(s)?s[0]:s.name));
   const expected=['familiarizacion','busqueda','socializacion','reflexion','otros problemas'];
   if(!expected.every((word,i)=>labels[i]?.includes(word) ||
     (i===4&&labels[i]?.includes('planteamiento de otros'))))return false;
  }
  return true;
 }
 function audit(unit,plan,curriculum){
  const before=preflight(unit);
  const errors=[...before.errors],warnings=[...before.warnings];
  if(!plan||!Array.isArray(plan.activities)||!plan.activities.length){
   errors.push(issue('no_sessions','sesiones','El motor no entregó sesiones planificadas.'));
   return result(errors,warnings);
  }
  const title=clean(plan.title||unit.title),situation=clean(plan.situation),
   reto=clean(plan.reto),purpose=clean(plan.purpose),
   product=clean(plan.product||unit.productTitle||unit.product);
  for(const [field,value,min] of [['título',title,12],['situación significativa',situation,160],
    ['reto',reto,25],['propósito',purpose,65],['producto',product,8]]){
   if(value.length<min)errors.push(issue('field_incomplete',field,'El campo '+field+' requiere una redacción específica.'));
   if(BANNED.test(norm(value)))errors.push(issue('placeholder',field,'El campo '+field+' contiene instrucciones o frases de plantilla.'));
  }
  const theme=before.subject;
  for(const [field,value] of [['título',title],['situación significativa',situation],['reto',reto]]){
   if(incompatible(theme,value))errors.push(issue('topic_mismatch',field,'El campo '+field+' se desvía del tema declarado.'));
  }
  if(clean(unit.productTitle||unit.product)&&norm(product)!==norm(unit.productTitle||unit.product))
   errors.push(issue('product_changed','producto','No se puede sustituir el producto aprobado.'));
  // Un proyecto no es una unidad con otra etiqueta: exige hitos de creación y validación.
  const milestones=Array.isArray(plan.projectMilestones)?plan.projectMilestones:[];
  if(unit.type==='Proyecto de aprendizaje'){
   const needs=['planificacion','investigacion','construccion','evaluacion'];
   if(milestones.length<4||!needs.every(key=>milestones.some(m=>norm(m.phase)===key)))
    errors.push(issue('project_cycle_missing','proyecto',
     'El proyecto necesita hitos verificables de planificación, investigación, construcción y evaluación del producto.'));
   for(const milestone of milestones){
    if(clean(milestone.action).length<35||clean(milestone.evidence).length<18)
     errors.push(issue('project_milestone_weak','proyecto',
      'Cada hito del proyecto requiere una acción estudiantil y evidencia de avance.'));
   }
  }
  const allowed=new Set(unit.areas||[]),seen=new Set(),trail=[],weekCounts=new Map(),blocks=new Set();
  for(let i=0;i<plan.activities.length;i++){
   const a=plan.activities[i]||{},field='sesión '+(i+1);
   const name=clean(a.title),area=clean(a.area),week=Number(a.week);
   const p=a.v2Plan||a;
   const studentAction=clean(a.studentAction||p.studentAction);
   const evidence=clean(a.evidence||p.evidence);
   const criterion=clean(a.criterion||p.criterion);
   const question=clean(p.question||a.question);
   const resource=clean(p.resource||a.resource);
   if(!allowed.has(area))errors.push(issue('area_not_selected',field,'Se incorporó el área '+area+' sin selección del docente.'));
   if(name.length<15||BANNED.test(norm(name)))
    errors.push(issue('title_generic',field,'Falta un título específico y pedagógico.'));
   const identity=norm(name);
   if(seen.has(identity))errors.push(issue('title_duplicate',field,'Título repetido: '+name));
   seen.add(identity);
   if(!Number.isInteger(week)||week<1||week>52)
    errors.push(issue('week_invalid',field,'Semana inválida.'));
   else weekCounts.set(week,(weekCounts.get(week)||0)+1);
   if(clean(a.day)&&clean(a.block)){
    const blockId=[week,norm(a.day),a.block].join('|');
    if(blocks.has(blockId))errors.push(issue('schedule_overlap',field,'Dos sesiones ocupan el mismo bloque.'));
    blocks.add(blockId);
   }
   if(studentAction.length<45)errors.push(issue('action_weak',field,'Falta una actuación estudiantil concreta y observable.'));
   if(evidence.length<18)errors.push(issue('evidence_weak',field,'Falta una evidencia verificable.'));
   if(criterion.length<25)errors.push(issue('criterion_weak',field,'El criterio debe explicar qué se observará.'));
   if(question.length<12)errors.push(issue('question_weak',field,'Falta una pregunta de aprendizaje concreta.'));
   if(!resource)warnings.push(issue('resource_missing',field,'Faltan materiales y fuentes de trabajo.'));
   if(!didactic(area,a))errors.push(issue('didactic_sequence',field,'La secuencia de Matemática no respeta los cinco procesos previstos.'));
   if(incompatible(theme,name+' '+studentAction))
    errors.push(issue('session_topic_mismatch',field,'El título y la actuación parecen ajenos al tema.'));
   const match=curriculumMatch(curriculum,unit.level,area,p.competence||a.competence,p.capacities||a.capacities);
   if(!match)errors.push(issue('curriculum_unverified',field,'La competencia y capacidades no están corroboradas para '+area+'.'));
   trail.push({order:i+1,week:week,day:a.day||'',block:a.block||'',area,title:name,
    studentAction,evidence,criterion,question,resource,competence:match?.competence||'',
    capacities:match?.capacities||[],source:match?.source||'',product,stage:clean(p.phase||a.stage)});
  }
  const weeks=parseInt(unit.duration,10);
  if(Number.isFinite(weeks)&&weeks>0){
   for(let w=1;w<=weeks;w++)if(!weekCounts.has(w))
    errors.push(issue('week_missing','cronograma','La semana '+w+' no tiene actividades.'));
   for(const w of weekCounts.keys())if(w>weeks)
    errors.push(issue('week_outside','cronograma','Hay sesiones fuera de la duración aprobada.'));
  }
  // No se llaman "desempeños oficiales" a los criterios redactados por el motor.
  warnings.push(issue('performance_not_verified','currículo',
   'Los desempeños y estándares de grado requieren vinculación documental y revisión docente; no se presentan como verificados.'));
  return result(errors,warnings,{normalized:{type:unit.type,level:unit.level,grades:copy(unit.grades||[]),
   areas:copy(unit.areas||[]),duration:unit.duration,title,situation,reto,purpose,product,
   documentContextSnapshot:copy(unit.documentContextSnapshot||{}),projectMilestones:copy(milestones),sessions:trail},
   coverage:{sessions:trail.length,weeks:Object.fromEntries(weekCounts),uniqueTitles:seen.size}});
 }
 function compile(unit,provider,curriculum){
  const before=preflight(unit);
  if(!before.ok)return before;
  if(typeof provider!=='function')return result([issue('provider_missing','contenido',
    'Falta un proveedor de actividades verificadas; no se rellenará con títulos genéricos.')],before.warnings);
  const input=copy(unit),original=JSON.stringify(unit);
  let generated;
  try{generated=provider(input);}
  catch(e){return result([issue('provider_failure','contenido',
    'El proveedor no pudo construir una planificación: '+clean(e?.message))],before.warnings);}
  if(JSON.stringify(unit)!==original)return result([issue('provider_mutation','contenido',
    'El proveedor modificó el borrador original, algo no permitido.')],before.warnings);
  if(generated?.ok===false)return result([issue('provider_rejected','contenido',generated.reason||'Sin contenido curado.')],before.warnings);
  const audited=audit(unit,generated,curriculum);
  if(!audited.ok)return audited;
  return {...audited,reviewRequired:true,readyForPublishing:false,
   origin:'contenido local cotejado, sin GPT',approvalRequired:true};
 }
 function compileSession(compiled,order,guide){
  const errors=[],warnings=[];
  if(!compiled?.ok||!compiled.normalized)
   return result([issue('unit_unverified','unidad','No se puede crear una sesión desde una planificación no validada.')],warnings);
  const unit=compiled.normalized;
  const activity=unit.sessions.find(x=>x.order===Number(order));
  if(!activity)return result([issue('session_missing','sesión','La sesión solicitada no forma parte de la planificación auditada.')],warnings);
  if(!guide||typeof guide!=='object')
   return result([issue('session_guide_missing','sesión',
    'Faltan las estrategias didácticas concretas. No se completarán con frases vacías.')],warnings);
  const steps=Array.isArray(guide.steps)?guide.steps.map(v=>({
   name:clean(Array.isArray(v)?v[0]:v.name),
   action:clean(Array.isArray(v)?v[1]:v.action)
  })):[];
  if(steps.length<3||steps.some(x=>x.name.length<5||x.action.length<40))
   errors.push(issue('session_steps_weak','procesos','Cada proceso exige una actuación clara y suficientemente desarrollada.'));
  if(activity.area==='Matemática'){
   const expected=['familiarizacion','busqueda','socializacion','reflexion'];
   if(steps.length!==5||!expected.every((x,i)=>norm(steps[i]?.name).includes(x))||
    !/otros problemas|planteamiento de otros/.test(norm(steps[4]?.name)))
    errors.push(issue('math_didactic','procesos','Matemática debe mantener los cinco procesos didácticos en orden.'));
  }
  const start=Number(guide.minutes?.start),develop=Number(guide.minutes?.develop),
   close=Number(guide.minutes?.close);
  if(![start,develop,close].every(v=>Number.isInteger(v)&&v>0))
   errors.push(issue('time_missing','tiempo','Indique minutos reales para Inicio, Desarrollo y Cierre.'));
  const purpose=clean(guide.purpose);
  if(purpose.length<40)errors.push(issue('session_purpose','propósito','Falta un propósito específico ligado a la actuación.'));
  const instrument=clean(guide.instrument);
  if(instrument.length<8)errors.push(issue('session_instrument','evaluación','Falta el instrumento adecuado para observar la evidencia.'));
  if(errors.length)return result(errors,warnings);
  const session={
   version:VERSION,sourceUnitType:unit.type,sourceUnitTitle:unit.title,
   order:activity.order,title:activity.title,area:activity.area,level:unit.level,grades:copy(unit.grades),
   week:activity.week,day:activity.day,block:activity.block,
   competence:activity.competence,capacities:copy(activity.capacities),
   question:activity.question,purpose,studentAction:activity.studentAction,
   evidence:activity.evidence,criterion:activity.criterion,resource:activity.resource,
   instrument,steps,minutes:{start,develop,close,total:start+develop+close},
   product:unit.product,documentContextSnapshot:copy(unit.documentContextSnapshot),
   status:'REQUIERE_REVISION_DOCENTE'
  };
  return result(errors,warnings,{session,reviewRequired:true,readyForPublishing:false});
 }
 function renderSessionDocument(compiled){
  if(!compiled?.ok||!compiled.session)throw new Error('No se exporta una sesión sin contrato completo.');
  const s=compiled.session,steps=s.steps.map(x=>'<li><b>'+escape(x.name)+':</b> '+escape(x.action)+'</li>').join('');
  return '<article class="dd-session-v3"><h1>SESIÓN DE APRENDIZAJE</h1><h2>'+escape(s.title)+'</h2>'+
   '<p><b>Unidad o proyecto:</b> '+escape(s.sourceUnitTitle)+' · <b>Grados:</b> '+escape(s.grades.join(', '))+'</p>'+
   '<p><b>Área:</b> '+escape(s.area)+' · <b>Semana:</b> '+escape(s.week)+' · <b>Día:</b> '+escape(s.day)+'</p>'+
   '<h3>Propósitos y evaluación</h3><p><b>Propósito:</b> '+escape(s.purpose)+'</p>'+
   '<p><b>Competencia:</b> '+escape(s.competence)+'</p>'+
   '<p><b>Capacidades:</b> '+escape(s.capacities.join('; '))+'</p>'+
   '<p><b>Criterio:</b> '+escape(s.criterion)+' · <b>Evidencia:</b> '+escape(s.evidence)+
   ' · <b>Instrumento:</b> '+escape(s.instrument)+'</p>'+
   '<h3>Inicio — '+s.minutes.start+' min</h3><p>Presentación de la pregunta: '+escape(s.question)+
   '. El docente recoge las explicaciones de inicio, sin adelantar respuestas.</p>'+
   '<h3>Desarrollo — '+s.minutes.develop+' min</h3><ol>'+steps+'</ol>'+
   '<h3>Cierre — '+s.minutes.close+' min</h3><p>Los estudiantes explican sus evidencias y las contrastan con el criterio; expresan una mejora para su siguiente actuación.</p>'+
   '<h3>Materiales</h3><p>'+escape(s.resource||'Por confirmar con el docente')+'</p>'+
   '<p><i>Borrador sujeto a revisión docente: no se atribuyen desempeños o estándares no cotejados al MINEDU.</i></p></article>';
 }
 function renderDocument(model){
  if(!model?.normalized||!model.ok)throw new Error('No se exporta un plan sin validación estructural.');
  const m=model.normalized;
  const grid=(head,rows)=>'<table border="1" cellpadding="5"><thead><tr>'+head.map(x=>'<th>'+escape(x)+'</th>').join('')+
   '</tr></thead><tbody>'+rows.map(row=>'<tr>'+row.map(x=>'<td>'+escape(x)+'</td>').join('')+'</tr>').join('')+'</tbody></table>';
  const matrix=m.sessions.map(x=>[String(x.order),x.week+' / '+x.day,x.area,x.title,x.competence,
   x.studentAction,x.evidence,x.criterion]);
  return '<article class="dd-planning-v3"><h1>'+escape(m.type)+'</h1><h2>'+escape(m.title)+'</h2>'+
   '<p><b>Grado:</b> '+escape(m.grades.join(', '))+' · <b>Duración:</b> '+escape(m.duration)+'</p>'+
   '<p><b>IE:</b> '+escape(m.documentContextSnapshot.institution||'Por confirmar')+
   ' · <b>Docente:</b> '+escape(m.documentContextSnapshot.teacher||'Por confirmar')+'</p>'+
   '<h2>Situación significativa</h2><p>'+escape(m.situation)+'</p>'+
   '<p><b>Pregunta retadora:</b> '+escape(m.reto)+'</p><h2>Propósito y producto</h2><p>'+escape(m.purpose)+'</p>'+
   '<p><b>Producto:</b> '+escape(m.product)+'</p>'+
    (m.type==='Proyecto de aprendizaje'?'<h2>Hitos del proyecto</h2>'+grid(['Fase','Acción','Evidencia'],m.projectMilestones.map(x=>[x.phase,x.action,x.evidence])):'')+
   '<h2>Secuencia de aprendizaje con trazabilidad</h2>'+
   grid(['N.º','Semana / día','Área','Sesión','Competencia','Acción estudiantil','Evidencia','Criterio'],matrix)+
   '<p><i>Competencias contrastadas con el catálogo curricular de la aplicación. Desempeños y estándares de grado pendientes de cotejo. Requiere revisión y aprobación del docente.</i></p></article>';
 }
 root.DDPlanningCoreV3=Object.freeze({version:VERSION,preflight,audit,compile,compileSession,renderDocument,renderSessionDocument});
})(typeof window!=='undefined'?window:globalThis);
