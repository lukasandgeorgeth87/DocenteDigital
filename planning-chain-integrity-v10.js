/* DocenteDigital — Fase 10: trazabilidad transversal de Unidad/Proyecto → sesión.
 * Evidencias y advertencias editables; no certifica desempeños curriculares.
 * No modifica registros antiguos ni reescribe el trabajo del docente.
 */
(function(){
  if(window.DD_PLANNING_CHAIN_V10)return;
  const E=v=>typeof window.escapeHtml==='function'?window.escapeHtml(String(v??''))
    :String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clean=v=>String(v??'').trim();
  const unique=values=>[...new Set((values||[]).map(clean).filter(Boolean))];
  const same=(a,b)=>JSON.stringify(unique(a).slice().sort())===JSON.stringify(unique(b).slice().sort());
  const norm=s=>clean(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ');
  const issues=(id,message,field='coherencia')=>({id,message,field});
  const hasArea=(unit,area)=>unique(unit.areas).some(a=>norm(a)===norm(area));

  // Revisión temática orientativa v16. Nunca declara validez curricular automática.
  // Únicamente advierte inconsistencias evidentes; no bloquea ediciones del docente.
  const semanticGroups=[
    ['agua',/\b(?:agua|aguas|h[íi]dric\w*|gota\w*|ca[ñn]o\w*|grif\w*|rio\w*|lluvia\w*|consumo\s+de\s+agua)\b/],
    ['siembra',/\b(?:siembr\w*|semill\w*|cultiv\w*|huert\w*|cosech\w*|hortaliz\w*|germin\w*)\b/],
    ['residuos',/\b(?:residu\w*|basura\w*|recicl\w*|desech\w*|plastico\w*)\b/],
    ['futbol',/\b(?:futbol\w*|balon\w*|campeonato\w*|partido\s+de\s+futbol)\b/],
    ['volcanes',/\b(?:volcan\w*|erupci\w*|lava|magma)\b/],
    ['astronomia',/\b(?:estrella\w*|planet\w*|galaxia\w*|constelaci\w*|astronomi\w*)\b/],
    ['minerales',/\b(?:mineral\w*|roca\w*|geolog\w*)\b/],
    ['alimentacion',/\b(?:aliment\w*|nutrici\w*|recet\w*|comida\w*|frut\w*)\b/],
    ['patrimonio',/\b(?:patrimoni\w*|festiv\w*|difunt\w*|todos\s+los\s+santos|tradici\w*|costumbr\w*)\b/],
    ['fauna',/\b(?:hormig\w*|abeja\w*|animal\w*|insect\w*|poliniz\w*)\b/]
  ];
  const semanticDomain=s=>new Set(semanticGroups.filter(([,pattern])=>pattern.test(norm(s))).map(([key])=>key));
  const semanticCommon=new Set(('estudiantes docente escuela escolar institucion educativa comunidad familia familias '
    +'problema situacion significativa reto producto final actividad actividades semana semanas '
    +'aprendizaje aprendemos conocimientos competencias capacidades criterios evidencias '
    +'trabajo trabajo realizar realizamos elaboramos presentamos observamos comprendemos '
    +'investigamos investigar analizar analisis datos informacion explica explicamos '
    +'cuidar cuidado promover responsabilidad responsable acciones accion proponemos '
    +'generar crear organizar organizamos propuestas valores objetivo proyecto unidad '
    +'texto textos escribir leemos comunicacion matematica ciencia tecnologia social '
    +'desarrollar mediante desde sobre para como entre donde nuestra nuestro nosotros '
    +'este esta estos estas unos unas hacia estan tambien otras otros porque ellos '
    +'cada todos todas primer grado aula hoy local localmente aprender sabemos '
    +'revisamos resultados evaluacion aprendizaje estudiantil').split(/\s+/));
  const semanticTerms=s=>new Set((norm(s).match(/[a-zñ]{4,}/g)||[])
    .map(x=>x.replace(/(?:ciones|cion|mente|ados|adas|ando|iendo|es|s)$/,'').slice(0,8))
    .filter(x=>x.length>=4&&!semanticCommon.has(x)));
  function topicalLink(base,other){
    const left=semanticDomain(base),right=semanticDomain(other);
    if(left.size&&right.size)return [...left].some(x=>right.has(x))?'coherente':'contradiccion';
    // Sin vocabulario temático reconocido, evitar afirmar contradicción semántica.
    // La superposición es solo una señal de apoyo, no una aprobación curricular.
    const a=semanticTerms(base),b=semanticTerms(other);
    if(a.size&&b.size&&[...a].some(t=>b.has(t)))return 'coherente';
    return 'no-determinable';
  }
  function semanticWarnings(unit){
    const result=[];
    if(!unit||typeof unit!=='object')return result;
    const situation=clean(unit.situation||unit.situationBrief);
    const challenge=clean(unit.reto),product=clean(unit.product);
    if(situation&&challenge&&topicalLink(situation,challenge)==='contradiccion')
      result.push(issues('semantic-challenge','El reto parece abordar un tema distinto al de la situación significativa. Revisa su relación antes de aplicar la planificación.','coherencia temática'));
    if(situation&&product&&topicalLink(situation,product)==='contradiccion')
      result.push(issues('semantic-product','El producto final parece corresponder a otro tema y no al problema de la situación significativa. Revisa su pertinencia.','coherencia temática'));
    const acts=Array.isArray(unit.activities)?unit.activities:[];
    if(/\b(?:contribuya|ayude|sirva)\s+a\s+(?:fuentes|datos|registros|evidencias)\b/i.test(challenge)
      ||/para\s+fuentes\s+confiables\s+y\s+recogemos/i.test(challenge))
      result.push(issues('challenge-malformed',
        'La pregunta retadora contiene una finalidad gramaticalmente incoherente. Revisa el reto indicado por el docente.','reto'));
    // Detectar relleno genérico: la presencia de un campo NO garantiza su calidad.
    // La solicitud original del docente puede contener instrucciones; no se evalúa aquí.
    const placeholder=/tema solicitado por el docente|tema elegido por el docente|contribuya a descargarla en word|sobre el tema trabajado/i;
    for(const [field,value] of [
      ['título',unit.title],['situación significativa',unit.situation],
      ['reto',unit.reto],['producto',unit.product]
    ])if(placeholder.test(clean(value)))result.push(issues('placeholder-'+field,
      field.charAt(0).toUpperCase()+field.slice(1)+': contiene una frase de relleno en lugar de un tema pedagógico concreto.','coherencia temática'));
    const genericActivities=acts.map((a,i)=>({a,i})).filter(({a})=>placeholder.test(clean(a?.title)));
    if(genericActivities.length)result.push(issues('placeholder-sessions',
      'Hay '+genericActivities.length+' actividades con expresiones como «tema solicitado por el docente». Revisa su contexto y propósito.','secuencia'));
    const authored=String(unit.situationBrief||'').replace(/\*\*/g,'').replace(/__+/g,'');
    const statedChallenge=(authored.match(/\bPregunta\s+(?:retadora|desafiante)\s*:\s*(¿[^?\n]{12,500}\?)/i)||[])[1]||'';
    if(statedChallenge&&clean(unit.reto)&&norm(statedChallenge)!==norm(unit.reto))
      result.push(issues('explicit-challenge-differs','La pregunta retadora generada no coincide con la pregunta original del docente.','reto'));
    const requestedTitle=(authored.match(/(?:^|\n)\s*Título\s*:\s*([^\n]{5,120})/i)||[])[1]?.trim().replace(/[.;]+$/,'');
    if(requestedTitle&&clean(unit.title)&&norm(requestedTitle)!==norm(unit.title))
      result.push(issues('explicit-title-differs','El título generado no coincide con el título explícito que indicó el docente.','título'));
    const conflicts=acts.map((a,i)=>({a,i})).filter(({a})=>a&&a.title&&situation&&topicalLink(situation,a.title)==='contradiccion');
    conflicts.slice(0,3).forEach(({a,i})=>result.push(issues('semantic-activity-'+i,
      `Actividad ${i+1} (${clean(a.title)}): parece abordar un tema distinto al de la situación significativa.`,'secuencia')));
    if(conflicts.length>3)result.push(issues('semantic-activity-more',
      `Hay ${conflicts.length-3} actividades adicionales con posibles contradicciones temáticas. Revisar la secuencia completa.`,'secuencia'));
    if(/proyecto/i.test(clean(unit.type))&&acts.length>=5){
      const titles=norm(acts.map(a=>a.title||'').join(' '));
      const projectSteps=[
        ['participación estudiantil en la planificación',/planific\w*|acord\w*|organiza\w*|propon\w*|decid\w*/],
        ['investigación del desafío',/investig\w*|indag\w*|explor\w*|recog\w*|observ\w*|entrevist\w*|busca\w*|fuentes?/],
        ['elaboración del producto',/elabor\w*|crea\w*|constru\w*|diseñ\w*|redact\w*|produc\w*/],
        ['revisión o mejora del producto',/revis\w*|mejor\w*|prob\w*|retroaliment\w*|ajust\w*/],
        ['comunicación del producto',/socializ\w*|present\w*|comunic\w*|compart\w*|difund\w*|expon\w*/]
      ];
      projectSteps.filter(([,re])=>!re.test(titles)).forEach(([step])=>result.push(issues('project-'+step,
        `Proyecto: no se identifica en los títulos de actividades una fase de ${step}. Comprueba que los estudiantes participen efectivamente.`,'ruta del proyecto')));
    }
    return result;
  }

  function auditUnit(unit){
    const warnings=[];
    if(!unit||typeof unit!=='object')return {ok:false,warnings:[issues('not-unit','Unidad o proyecto no disponible.')],checks:[]};
    const checks=[
      {name:'Situación significativa',present:!!clean(unit.situation||unit.situationBrief)},
      {name:'Reto',present:!!clean(unit.reto)},
      {name:'Producto o evidencia integradora',present:!!clean(unit.product)},
      {name:'Secuencia de actividades',present:Array.isArray(unit.activities)&&unit.activities.length>0},
      {name:'Nivel y grados seleccionados',present:!!clean(unit.level)&&unique(unit.grades).length>0},
    ];
    checks.filter(x=>!x.present).forEach(x=>warnings.push(issues('missing-'+norm(x.name),`${x.name}: falta completar o confirmar este componente.`,x.name)));
    const selected=unique(unit.areas);
    (Array.isArray(unit.activities)?unit.activities:[]).forEach((a,i)=>{
      if(!clean(a.title)||!clean(a.area))warnings.push(issues('activity-incomplete-'+i,`Actividad ${i+1}: falta título o área.`, 'secuencia'));
      else if(selected.length&&!hasArea(unit,a.area))warnings.push(issues('activity-area-'+i,`Actividad ${i+1} (${clean(a.title)}): el área ${clean(a.area)} no está entre las seleccionadas.`, 'secuencia'));
    });
    const fullContext=norm(unit.situationBrief||unit.situation||'');
    const purposes=Array.isArray(unit.purposes)?unit.purposes:[];
    const problematic=purposes.some(p=>(p.criteria||[]).some(c=>{
      const value=clean(c.text);return value.length>240||
        (fullContext.length>110&&norm(value).includes(fullContext.slice(0,105)));
    }));
    if(problematic)warnings.push(issues('overlong-criteria','Hay criterios extensos o copiados de la situación significativa. Redactar actuaciones observables y diferenciadas por grado.','evaluación'));
    const acts=Array.isArray(unit.activities)?unit.activities:[];
    if(acts.length>=5&&unit.level!=='Inicial'&&acts.some(a=>!clean(a.time)))
      warnings.push(issues('missing-hours','La secuencia contiene bloques sin horario definido. Confirmar el horario antes de usar el documento.','secuencia'));
    const titleCounts=new Map();
    acts.forEach(a=>{const title=norm(a.title);if(title)titleCounts.set(title,(titleCounts.get(title)||0)+1);});
    if([...titleCounts.values()].some(v=>v>=4))
      warnings.push(issues('repeat-sessions','Existen títulos de sesiones repetidos cuatro veces o más. Revisar la progresión didáctica.','secuencia'));
    warnings.push(...semanticWarnings(unit));
    return {ok:warnings.length===0,warnings,checks,selectedGrades:unique(unit.grades),activityCount:unit.activities?.length||0};
  }
  function getUnit(session){return (typeof state==='object'&&Array.isArray(state.units)?state.units:[]).find(u=>u.id===session?.unitId)||null;}
  function snapshot(unit,session){
    if(!unit)return null;
    const a=unit.activities?.[session.activityIndex]||null;
    return {
      unitId:unit.id,unitTitle:unit.title||'',level:unit.level||'',
      ieType:unit.ieType||'',grades:unique(unit.grades),language:unit.language||'',
      situation:unit.situation||unit.situationBrief||'',
      challenge:unit.reto||'',product:unit.product||'',
      activityTitle:a?.title||session.activitySnapshot?.title||'',
      activityArea:a?.area||session.activitySnapshot?.area||'',
      activityIndex:session.activityIndex,
      capturedAt:session.createdAt||new Date().toISOString()
    };
  }
  function auditSession(session){
    if(!session||typeof session!=='object')return {ok:false,warnings:[issues('no-session','No existe una sesión para revisar.')],context:null};
    const warnings=[];
    const unit=getUnit(session);
    const context=session.planningChainSnapshot||snapshot(unit,session);
    if(session.unitId&&!unit&&!context)warnings.push(issues('missing-unit','No se encontró la unidad/proyecto de origen ni su contexto archivado.','vínculo'));
    if(context){
      if(context.level&&session.level&&context.level!==session.level)warnings.push(issues('level-mismatch','El nivel educativo es diferente al de la unidad/proyecto original.','nivel'));
      if(context.grades?.length&&!same(session.grades,context.grades))warnings.push(issues('grades-mismatch','Los grados de esta sesión no coinciden con los de la unidad/proyecto original.','grados'));
      if(context.activityArea&&norm(context.activityArea)!==norm(session.area))warnings.push(issues('area-mismatch','El área de la sesión difiere del área de la actividad planificada.','área'));
      if(context.activityTitle&&norm(context.activityTitle)!==norm(session.title))warnings.push(issues('title-edited','El título fue editado respecto a la actividad planificada. Verifica que propósito, competencia y criterio sigan correspondiendo.','actividad'));
      if(!clean(context.challenge))warnings.push(issues('no-challenge','La unidad/proyecto no registra un reto explícito. Revísalo antes de aplicar la sesión.','reto'));
      if(!clean(context.product))warnings.push(issues('no-product','La unidad/proyecto no registra un producto integrador. Revísalo antes de aplicar la sesión.','producto'));
    }else warnings.push(issues('no-snapshot','Sesión antigua o de ejemplo: verificar manualmente el vínculo con una unidad/proyecto.','vínculo'));
    if(!clean(session.criterion))warnings.push(issues('no-criterion','Falta el criterio de evaluación de la sesión.','evaluación'));
    if(!clean(session.evidence))warnings.push(issues('no-evidence','Falta la evidencia que observará el docente.','evaluación'));
    if(!clean(session.purpose))warnings.push(issues('no-purpose','Falta el propósito de aprendizaje.','propósito'));
    return {ok:warnings.length===0,warnings,context,unitFound:!!unit};
  }
  const warningList=warnings=>warnings.length
    ?`<ul>${warnings.map(w=>`<li>${E(w.message)}</li>`).join('')}</ul>`
    :'<p>Sin alertas estructurales detectadas. Esta revisión no certifica pertinencia didáctica ni desempeños MINEDU.</p>';
  function unitPanel(unit){
    const a=auditUnit(unit);
    const summary=a.checks.map(c=>`<tr><td>${E(c.name)}</td><td>${c.present?'Presente':'Por revisar'}</td></tr>`).join('');
    return `<section class="dd-phase10-audit" aria-label="Revisión de coherencia de unidad o proyecto"><h2>VERIFICACIÓN DE COHERENCIA (FASE 16)</h2><p>Revisión estructural y alerta temática orientativa. No certifica pertinencia pedagógica ni desempeños MINEDU; el docente debe revisar los vínculos entre situación, reto, producto, actividades y evaluación.</p><table><tr><th>Componente</th><th>Estado</th></tr>${summary}</table>${warningList(a.warnings)}</section>`;
  }
  function sessionPanel(session){
    const a=auditSession(session),c=a.context;
    const rows=c?[
      ['Unidad/Proyecto',c.unitTitle],['Situación de origen',c.situation],['Reto original',c.challenge],
      ['Producto integrador',c.product],['Actividad planificada',c.activityTitle],
      ['Área original',c.activityArea],['Grados originales',(c.grades||[]).join(', ')]
    ]:[];
    return `<section class="dd-phase10-audit" aria-label="Verificación de trazabilidad de la sesión"><h2>10. TRAZABILIDAD UNIDAD/PROYECTO → SESIÓN</h2><p>Los datos de origen se congelan al crear la sesión; se muestran para contrastar la finalidad de la unidad con esta actividad. La edición docente es válida y requiere revisar la correspondencia pedagógica.</p>${rows.length?`<table><tr><th>Elemento</th><th>Referencia al crear la sesión</th></tr>${rows.map(([k,v])=>`<tr><td>${E(k)}</td><td>${E(v||'Por verificar')}</td></tr>`).join('')}</table>`:''}<h3>${a.ok?'Verificación estructural sin alertas':'Aspectos que requieren revisión'}</h3>${warningList(a.warnings)}<p><small>Los criterios y evidencias son propuestas editables. Contrastar competencias, estándares y desempeños con el programa curricular del nivel antes de aplicar.</small></p></section>`;
  }
  const originalBuild=window.buildSession;
  if(typeof originalBuild==='function')window.buildSession=function(){
    const s=originalBuild.apply(this,arguments),u=getUnit(s);
    if(s&&u){s.planningChainSnapshot=snapshot(u,s);if(typeof save==='function')save();}
    return s;
  };
  const originalUnit=window.unitWordHtml;
  if(typeof originalUnit==='function')window.unitWordHtml=function(unit){
    const html=originalUnit.apply(this,arguments);
    return typeof html==='string'&&unit&&!html.includes('dd-phase10-audit')?html+unitPanel(unit):html;
  };
  const originalSession=window.sessionHtml;
  if(typeof originalSession==='function')window.sessionHtml=function(session,forWord=false){
    const html=originalSession.apply(this,arguments);
    return typeof html==='string'&&session&&!html.includes('dd-phase10-audit')?html+sessionPanel(session):html;
  };
  // El mismo control visible en la vista previa de Unidad/Proyecto.
  const originalPreview=window.renderUnitOutput;
  if(typeof originalPreview==='function')window.renderUnitOutput=function(unit){
    const r=originalPreview.apply(this,arguments),target=document.getElementById('unitOutput');
    if(unit&&target&&typeof target.insertAdjacentHTML==='function'){
      target.querySelectorAll?.('.dd-phase10-preview')?.forEach(node=>node.remove());
      target.insertAdjacentHTML('beforeend',`<div class="dd-phase10-preview">${unitPanel(unit)}</div>`);
    }
    return r;
  };
  window.DD_PLANNING_CHAIN_V10={auditUnit,auditSession,snapshot,unitPanel,sessionPanel,semanticWarnings,version:'10.0',semanticVersion:'16.0'};
})();
