/* DocenteDigital – Núcleo Central de Comprensión v44
   Una sola interpretación reutilizable para documentos de Docente y Director.
   El motor local es respaldo. Si más adelante existe un intérprete IA remoto seguro,
   ddInterpretDeepAsync lo prioriza y conserva este contrato como capa de validación.
*/
(function(){
  if(window.__ddIntelligenceCoreV44)return;window.__ddIntelligenceCoreV44=true;
  if(typeof state!=='object')return;

  const tidy=s=>String(s??'').replace(/\s+/g,' ').trim();
  const norm=s=>tidy(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const esc=s=>typeof window.escapeHtml==='function'?window.escapeHtml(String(s??'')):String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const uniq=a=>{const out=[];for(const x of a||[]){const v=tidy(x);if(v&&!out.some(y=>norm(y)===norm(v)))out.push(v);}return out;};
  const sentences=t=>String(t||'').split(/(?<=[.!?])\s+|\n+/).map(tidy).filter(Boolean);

  function quoted(raw){return uniq([...(String(raw||'').matchAll(/[“”"']([^“”"']{2,100})[“”"']/g))].map(m=>m[1])).slice(0,12);}
  function questions(raw){return uniq((String(raw||'').match(/¿[^?]{3,180}\?/g)||[])).slice(0,8);}
  function quantities(raw){return uniq((String(raw||'').match(/\b\d+(?:[.,]\d+)?\s*(?:semanas?|días?|dias?|horas?|minutos?|años?|estudiantes?|grados?|soles?|kg|g|m|cm|litros?|l)?\b/gi)||[])).slice(0,15);}
  function temporal(raw){return uniq((String(raw||'').match(/\b(?:hoy|mañana|ayer|esta semana|este mes|este año|durante\s+\d+\s+semanas?|en\s+\w+|lunes|martes|miércoles|miercoles|jueves|viernes|enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)\b/gi)||[])).slice(0,12);}
  function explicitActions(raw){
    const re=/\b(?:sembrar|cultivar|crear|construir|elaborar|implementar|organizar|producir|mejorar|recuperar|diseñar|realizar|desarrollar|instalar|preparar|transformar|resolver|cuidar|promover|presentar|registrar|investigar|comparar|explicar|valorar|fortalecer|reducir|evaluar|planificar|redactar|actualizar|aprobar|emitir|informar|solicitar|coordinar)\b[^.!?]{0,120}/gi;
    return uniq(String(raw||'').match(re)||[]).slice(0,12);
  }
  function constraints(raw){
    const ss=sentences(raw),re=/\b(?:debe|deben|sin|solo|solamente|máximo|maximo|mínimo|minimo|no debe|no deben|respetando|según|segun|con|para|hasta|desde)\b/i;
    return ss.filter(s=>re.test(s)).slice(0,8);
  }
  function recipient(raw){
    const m=String(raw||'').match(/\b(?:para|dirigido a|destinado a|presentar a|comunicar a|informar a)\s+(?:los|las|el|la|un|una)?\s*([^,.!?]{3,80})/i);
    return tidy(m?.[1]||'');
  }
  function documentType(raw,scope){
    const n=norm(raw);
    const map=[['Resolución Directoral',/\b(?:rd|resolucion directoral)\b/],['PEI',/\bpei\b|proyecto educativo institucional/],['PAT',/\bpat\b|plan anual de trabajo/],['PCI',/\bpci\b|proyecto curricular institucional/],['Reglamento Interno',/reglamento interno|\bri\b/],['Informe',/\binforme\b/],['Oficio',/\boficio\b/],['Unidad de aprendizaje',/unidad de aprendizaje|\bunidad\b/],['Proyecto de aprendizaje',/proyecto de aprendizaje/],['Sesión de aprendizaje',/sesion de aprendizaje|\bsesion\b/],['Evaluación',/evaluacion|rubrica|lista de cotejo|escala de valoracion/],['Material educativo',/ficha|lectura|material|ppt|diapositiva/]];
    for(const [name,re] of map)if(re.test(n))return name;
    return scope==='director'?'Documento de gestión por determinar':'Planificación o recurso docente por determinar';
  }
  function intentKind(raw,m,goal,scope){
    if(scope==='director')return /crear|redactar|elaborar|actualizar|emitir|aprobar|informar|solicitar/i.test(raw)?'gestión/acción administrativa':'consulta de gestión';
    if(goal?.phrase)return 'aprendizaje con finalidad explícita';
    if(tidy(m?.problem))return 'problema o necesidad';
    if(tidy(m?.opportunity))return 'oportunidad o práctica significativa';
    if(/quieren|desean|interesa|curiosidad|preguntan/i.test(raw))return 'interés o curiosidad';
    return 'exploración del contexto';
  }
  function territorial(){
    const c=state.teacherContext||{};
    return {type:tidy(c.locationType||c.placeType||''),name:tidy(c.locationName||c.locality||c.community||''),district:tidy(c.district||''),province:tidy(c.province||''),region:tidy(c.region||'')};
  }
  function linguistic(){return {mode:tidy(state.linguisticMode||''),language:tidy(state.language||'Castellano'),indigenousLanguage:tidy(state.indigenousLanguage||state.quechuaVar||'Ninguna')};}
  function org(){return {level:tidy(state.level||''),ieType:tidy(state.ieType||''),grades:[...(state.grades||[])],areas:[...(state.areas||[])]};}

  function interpret(raw,opts={}){
    raw=tidy(raw);const scope=opts.scope||'teacher';
    let m={};try{if(typeof window.ddUnderstandPlanningDescription==='function')m=window.ddUnderstandPlanningDescription(raw)||{};}catch(e){}
    let goal=null;try{if(typeof window.ddExtractPlanningGoal==='function')goal=window.ddExtractPlanningGoal(raw);}catch(e){}
    const actions=explicitActions(raw),q=questions(raw),quotes=quoted(raw),nums=quantities(raw),times=temporal(raw),cons=constraints(raw);
    const explicitGoal=tidy(goal?.phrase||m?.goal||'');
    const focus=tidy(m?.focus||m?.contextConcepts?.[0]||raw.slice(0,160)||'');
    const actors=uniq(m?.actors||[]),place=tidy(m?.place||'');
    const missing=[];
    if(!focus)missing.push('foco principal');
    if(scope==='teacher'&&!explicitGoal&&!tidy(m?.problem)&&!tidy(m?.opportunity)&&!/interes|curiosidad|quieren|desean/i.test(norm(raw)))missing.push('intención, necesidad, problema u oportunidad');
    if(scope==='director'&&documentType(raw,scope).includes('por determinar'))missing.push('tipo de documento o acción de gestión');
    const contradictions=[];
    if(/monoling[uü]e/i.test(raw)&&/eib|biling[uü]e/i.test(raw))contradictions.push('El texto menciona simultáneamente monolingüe y EIB/bilingüe; requiere confirmar el perfil lingüístico.');
    const confidence=Math.max(15,Math.min(100,(Number(m?.confidence)||0)+(explicitGoal?15:0)+(actions.length?5:0)+(scope==='director'&&!documentType(raw,scope).includes('determinar')?15:0)));
    const profile={
      schema:'DocenteDigital.SemanticProfile',version:44,createdAt:new Date().toISOString(),engine:'local-semantic-fallback',scope,documentType:opts.documentType||documentType(raw,scope),raw,
      intentKind:intentKind(raw,m,goal,scope),focus,desiredOutcome:explicitGoal,goalSource:tidy(goal?.source||''),problem:tidy(m?.problem||''),cause:tidy(m?.cause||''),consequence:tidy(m?.consequence||''),opportunity:tidy(m?.opportunity||''),
      actors,audience:recipient(raw),placeMentioned:place,territorial:territorial(),linguistic:linguistic(),organization:org(),actions,quotedTerms:quotes,questions:q,quantities:nums,temporal:times,constraints:cons,
      explicitConcepts:uniq([...(m?.contextConcepts||[]),...(m?.problemConcepts||[]),...(m?.goalConcepts||[]),...(m?.analysis?.phrases||[]),...(m?.analysis?.words||[])]).slice(0,30),
      missing,contradictions,confidence,status:confidence>=75?'comprensión sólida':confidence>=50?'comprensión razonable':'comprensión preliminar',
      safeguards:{preserveExplicitFacts:true,doNotInventMissing:true,officialCurriculumWins:true,officialNormsWin:true,teacherDirectorApproves:true},
      provenance:{meaningEngine:!!window.ddUnderstandPlanningDescription,goalEngine:!!window.ddExtractPlanningGoal,rawPreserved:true}
    };
    return profile;
  }

  function contract(documentType,raw,opts={}){
    const p=interpret(raw,{...opts,documentType});
    return {documentType,semanticProfile:p,mustPreserve:uniq([p.desiredOutcome,p.problem,p.placeMentioned,...p.quotedTerms,...p.constraints]).filter(Boolean),mustNotInvent:p.missing,context:{territorial:p.territorial,linguistic:p.linguistic,organization:p.organization},officialProtection:{curriculum:true,norms:true,institutionalData:true},approvalRequired:true};
  }

  async function interpretAsync(raw,opts={}){
    const local=interpret(raw,opts);
    if(typeof window.ddRemoteSemanticInterpreter!=='function')return local;
    try{
      const remote=await window.ddRemoteSemanticInterpreter({text:raw,scope:opts.scope||'teacher',localProfile:local,context:{territorial:local.territorial,linguistic:local.linguistic,organization:local.organization}});
      if(!remote||typeof remote!=='object')return local;
      return {...local,...remote,raw:local.raw,territorial:local.territorial,linguistic:local.linguistic,organization:local.organization,safeguards:local.safeguards,engine:'ai-semantic+local-guard',localFallback:local};
    }catch(e){console.warn('DocenteDigital: intérprete IA remoto no disponible; se usa respaldo local.',e);return local;}
  }

  function persistProfile(key,raw,opts){state.semanticProfiles=state.semanticProfiles||{};state.semanticProfiles[key]=interpret(raw,opts);if(typeof save==='function')save();return state.semanticProfiles[key];}

  /* Unidad/Proyecto: fija el significado antes de construir y alinea el reto con la finalidad explícita. */
  document.addEventListener('click',e=>{
    const b=e.target.closest?.('button');if(!b)return;const on=b.getAttribute('onclick')||'';
    if(/createUnitDemo/.test(on)){
      const raw=document.getElementById('unitSituation')?.value||'';const p=persistProfile('planningDraft',raw,{scope:'teacher',documentType:document.getElementById('unitType')?.value||'Unidad de aprendizaje'});
      setTimeout(()=>{
        const pending=state.pendingUnitChoice;if(!pending)return;pending.semanticProfile=p;
        if(p.desiredOutcome&&typeof window.ddGoalAlignment?.challengeFor==='function'){
          const g={phrase:p.desiredOutcome,source:p.goalSource};pending.reto=window.ddGoalAlignment.challengeFor(raw,g);
        }
        if(typeof save==='function')save();
      },35);
    }
    if(b.id==='ddBuildUnit'){
      const pending=state.pendingUnitChoice,raw=pending?.brief||document.getElementById('unitSituation')?.value||'';const p=interpret(raw,{scope:'teacher',documentType:pending?.type||'Unidad de aprendizaje'});
      if(pending){pending.semanticProfile=p;if(p.desiredOutcome&&typeof window.ddGoalAlignment?.challengeFor==='function')pending.reto=window.ddGoalAlignment.challengeFor(raw,{phrase:p.desiredOutcome,source:p.goalSource});if(typeof save==='function')save();}
      setTimeout(()=>{const u=state.activeUnitId?(state.units||[]).find(x=>x.id===state.activeUnitId):(state.units||[])[0];if(u){u.semanticProfile=p;u.planningContract=contract(u.type||'Unidad de aprendizaje',raw,{scope:'teacher'});if(p.desiredOutcome)u.explicitFinalGoal=p.desiredOutcome;if(typeof save==='function')save();}},140);
    }
    if(/generateSession\(\)/.test(on))setTimeout(()=>{const s=state.lastSession,u=(state.units||[]).find(x=>x.id===s?.unitId);if(s){s.semanticProfile=u?.semanticProfile||interpret(s.brief||'',{scope:'teacher',documentType:'Sesión de aprendizaje'});s.inheritedFinalGoal=u?.explicitFinalGoal||s.semanticProfile?.desiredOutcome||'';if(typeof save==='function')save();}},120);
  },true);

  /* Director: el prototipo todavía no genera todos los documentos, pero ya utiliza el mismo contrato de comprensión. */
  function mountDirectorInterpreter(){
    const screen=document.getElementById('director');if(!screen||document.getElementById('ddDirectorMeaning'))return;
    const box=document.createElement('div');box.id='ddDirectorMeaning';box.className='card topgap';
    box.innerHTML=`<h2>🧠 Comprensión del pedido del Director</h2><p class="sub">Describe con naturalidad qué documento o gestión necesitas. Esta capa interpreta primero; no sustituye la verificación normativa.</p><textarea id="ddDirectorMeaningInput" style="width:100%;min-height:95px" placeholder="Ej.: Necesito una RD para conformar... / Quiero actualizar el PAT porque..."></textarea><div class="actions topgap"><button class="btn" id="ddAnalyzeDirectorRequest">Analizar pedido</button></div><div id="ddDirectorMeaningResult" class="notice hidden topgap"></div>`;
    screen.appendChild(box);
    document.getElementById('ddAnalyzeDirectorRequest').onclick=()=>{const raw=document.getElementById('ddDirectorMeaningInput').value.trim();if(!raw)return alert('Describe el documento o gestión que necesitas.');const p=persistProfile('directorDraft',raw,{scope:'director'}),r=document.getElementById('ddDirectorMeaningResult');r.classList.remove('hidden');r.innerHTML=`<b>Tipo probable:</b> ${esc(p.documentType)}<br><b>Intención:</b> ${esc(p.intentKind)}<br><b>Foco:</b> ${esc(p.focus||'Por precisar')}<br><b>Resultado esperado:</b> ${esc(p.desiredOutcome||'No expresado todavía')}<br><b>Claridad:</b> ${esc(p.status)} · ${p.confidence}%${p.missing.length?`<br><b>Falta precisar:</b> ${esc(p.missing.join('; '))}`:''}<br><small>La generación normativa del documento solo podrá usar requisitos y bases legales verificadas.</small>`;};
  }
  const oldGo=window.go;if(typeof oldGo==='function')window.go=function(id){const r=oldGo.apply(this,arguments);if(id==='director')setTimeout(mountDirectorInterpreter,0);return r;};

  window.ddInterpretDeep=interpret;
  window.ddInterpretDeepAsync=interpretAsync;
  window.ddGenerationContract=contract;
  window.ddPersistSemanticProfile=persistProfile;
  window.ddIntelligenceCore={interpret,interpretAsync,contract};
  setTimeout(mountDirectorInterpreter,0);
})();