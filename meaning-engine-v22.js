/* DocenteDigital – motor de sentido v22: analiza relaciones de la descripción antes de proponer */
(function(){
  if(window.__ddMeaningEngineV22)return;window.__ddMeaningEngineV22=true;
  if(typeof window.ddAnalyzeContext!=='function')return;

  const E=v=>typeof escapeHtml==='function'?escapeHtml(String(v||'')):String(v||'');
  const tidy=s=>String(s||'').replace(/\s+/g,' ').replace(/^[,;:\-–—\s]+|[,;:\-–—\s]+$/g,'').trim();
  const low=s=>tidy(s).toLowerCase();
  const cap=s=>{s=tidy(s);return s?s[0].toUpperCase()+s.slice(1):'';};
  const sent=text=>String(text||'').split(/(?<=[.!?])\s+|\n+/).map(tidy).filter(Boolean);

  const CUES={
    goal:[/\bqueremos\b/i,/\bquiero\b/i,/\bnecesitamos\b/i,/\bbuscamos\b/i,/\bnos proponemos\b/i,/\bcon el fin de\b/i,/\bpara lograr\b/i,/\bpara que\b/i,/\bla finalidad es\b/i,/\bel propósito es\b/i],
    problem:[/\bsin embargo\b/i,/\bpero\b/i,/\baunque\b/i,/\bproblema\b/i,/\bdificultad\b/i,/\bpreocupa\b/i,/\bafecta\b/i,/\bfalta\b/i,/\bescasez\b/i,/\bpérdida\b/i,/\bperdida\b/i,/\bdesconoc/i,/\bno saben\b/i,/\bpoco conocen\b/i,/\briesgo\b/i,/\bcontamin/i,/\bconflicto\b/i,/\bdisminu/i,/\bbaja\b/i,/\blimitad/i],
    cause:[/\bporque\b/i,/\bdebido a\b/i,/\ba causa de\b/i,/\bpor falta de\b/i,/\bpor la falta de\b/i,/\bya que\b/i],
    opportunity:[/\btradición\b/i,/\btradicion\b/i,/\bcostumbre\b/i,/\bsaber(es)?\b/i,/\bpráctica\b/i,/\bpractica\b/i,/\bparticipan\b/i,/\brealizan\b/i,/\bcultivan\b/i,/\bproducen\b/i,/\bcelebran\b/i,/\bconservan\b/i]
  };

  function hasAny(text,patterns){return patterns.some(r=>r.test(text));}
  function splitClauses(text){
    const out=[];
    sent(text).forEach((s,si)=>{
      const pieces=s.split(/\s+(?=(?:sin embargo|pero|aunque|porque|debido a|a causa de|ya que|por eso|por ello|para que|con el fin de|mientras que)\b)/i);
      pieces.map(tidy).filter(Boolean).forEach((p,pi)=>out.push({text:p,sentence:si,part:pi}));
    });
    return out;
  }
  function scoreClause(c,kind){
    let n=0;const t=c.text;
    if(kind==='goal'&&hasAny(t,CUES.goal))n+=10;
    if(kind==='problem'&&hasAny(t,CUES.problem))n+=10;
    if(kind==='cause'&&hasAny(t,CUES.cause))n+=10;
    if(kind==='opportunity'&&hasAny(t,CUES.opportunity))n+=7;
    n+=Math.min((window.ddAnalyzeContext(t,6).concepts||[]).length,5);
    n+=Math.min(t.length/80,2);
    return n;
  }
  function best(clauses,kind){
    return clauses.map(c=>({...c,score:scoreClause(c,kind)})).sort((a,b)=>b.score-a.score)[0]||null;
  }
  function afterMatch(text,patterns){
    for(const r0 of patterns){
      const r=new RegExp(r0.source,r0.flags.replace('g',''));
      const m=r.exec(text);if(!m)continue;
      let x=tidy(text.slice(m.index+m[0].length));
      x=x.replace(/^(que|de que|a que)\s+/i,'');
      if(x.length>3)return x;
    }
    return'';
  }
  function beforeConnector(text){
    return tidy(String(text||'').split(/\b(?:sin embargo|pero|aunque|porque|debido a|a causa de|ya que|para que|con el fin de)\b/i)[0]);
  }
  function compactConcepts(text,n=3){
    const a=window.ddAnalyzeContext(text,n+4),arr=(a.phrases||[]).concat(a.words||[],a.concepts||[]);
    const clean=[];
    for(const x of arr){
      const v=tidy(x).replace(/^(en|de|del|la|el|los|las|un|una)\s+/i,'');
      if(!v||v.length<3||v.length>72)continue;
      if(clean.some(y=>low(y)===low(v)))continue;
      clean.push(v);if(clean.length>=n)break;
    }
    return clean;
  }
  function infer(text){
    const raw=tidy(text),clauses=splitClauses(raw),analysis=window.ddAnalyzeContext(raw,20);
    const goalC=best(clauses,'goal'),problemC=best(clauses,'problem'),causeC=best(clauses,'cause'),oppC=best(clauses,'opportunity');
    const goal=goalC&&scoreClause(goalC,'goal')>=10?afterMatch(goalC.text,CUES.goal):'';
    const problem=problemC&&scoreClause(problemC,'problem')>=10?tidy(problemC.text):'';
    const cause=causeC&&scoreClause(causeC,'cause')>=10?afterMatch(causeC.text,CUES.cause):'';
    const opportunity=oppC&&scoreClause(oppC,'opportunity')>=7?tidy(oppC.text):'';

    // El contexto base se toma de una cláusula descriptiva, no de la cláusula de meta.
    let contextClause=clauses.find(c=>!hasAny(c.text,CUES.goal)&&!hasAny(c.text,CUES.problem))?.text||beforeConnector(raw)||raw;
    if(contextClause.length<8)contextClause=raw;
    const contextConcepts=compactConcepts(contextClause,3);
    const problemConcepts=problem?compactConcepts(problem,2):[];
    const goalConcepts=goal?compactConcepts(goal,2):[];
    const all=[...contextConcepts,...problemConcepts,...goalConcepts];
    const unique=[];all.forEach(x=>{if(!unique.some(y=>low(y)===low(x)))unique.push(x);});
    let focus=unique.slice(0,3).join(' y ');
    if(!focus)focus=(analysis.concepts||[]).slice(0,2).join(' y ')||'la realidad descrita';
    if(focus.length>100)focus=focus.slice(0,97).replace(/\s+\S*$/,'')+'…';

    const need=problem?problem:(goal?`Se busca ${goal}`:'');
    let confidence=0;
    if(raw.length>=35)confidence+=20;
    if(contextConcepts.length)confidence+=20;
    if(problem)confidence+=25;
    if(goal)confidence+=25;
    if(opportunity)confidence+=10;
    confidence=Math.min(confidence,100);
    const status=confidence>=70?'lectura clara':confidence>=45?'lectura probable':'lectura preliminar';

    let synthesis='';
    if(problem&&goal)synthesis=`El docente parte de ${contextConcepts[0]||'una situación de su realidad'}, identifica como aspecto central que ${problem.replace(/^(sin embargo|pero|aunque)[,\s]*/i,'')}, y quiere orientar el aprendizaje a ${goal}.`;
    else if(problem)synthesis=`El docente quiere trabajar ${focus} a partir de una dificultad o necesidad concreta: ${problem.replace(/^(sin embargo|pero|aunque)[,\s]*/i,'')}.`;
    else if(goal)synthesis=`El docente quiere trabajar ${focus} con una intención explícita: ${goal}.`;
    else synthesis=`El docente describe ${focus}. Aún no expresa con claridad un problema, necesidad u objetivo; la propuesta debe ser prudente y no inventarlos.`;

    return{raw,clauses,analysis,contextClause,problem,cause,goal,opportunity,focus,need,confidence,status,synthesis,contextConcepts,problemConcepts,goalConcepts};
  }

  function titleCore(i){
    const main=i.contextConcepts[0]||i.problemConcepts[0]||i.analysis?.concepts?.[0]||'nuestra realidad';
    const secondary=i.problemConcepts.find(x=>low(x)!==low(main))||i.goalConcepts.find(x=>low(x)!==low(main))||'';
    return{main:tidy(main),secondary:tidy(secondary)};
  }
  function sig(s){return low(s).replace(/[^a-z0-9áéíóúñü]+/g,' ').trim();}
  function fresh(list,key,count=5){
    state.meaningTitleHistory=state.meaningTitleHistory||{};
    const used=state.meaningTitleHistory[key]||[];let pool=list.filter(x=>!used.includes(sig(x)));
    if(pool.length<count)pool=[...list];
    const out=[];while(pool.length&&out.length<count){const n=Math.floor(Math.random()*pool.length);out.push(pool.splice(n,1)[0]);}
    state.meaningTitleHistory[key]=[...used,...out.map(sig)].slice(-50);save();return out;
  }
  function titles(text,type){
    const i=infer(text),{main,secondary}=titleCore(i),P=/proyecto/i.test(String(type||''));
    const purpose=i.goal?tidy(i.goal):secondary?`comprender y responder a ${secondary}`:'comprender mejor esta realidad';
    const U=[
      `Aprendemos desde ${main}: comprendemos nuestra realidad con sentido`,
      `Comprendemos ${main} para ${purpose}`,
      `${cap(main)}: saberes, preguntas y aprendizajes desde nuestra comunidad`,
      `Entre experiencias y saberes: aprendemos a partir de ${main}`,
      `Nuestra realidad nos enseña: exploramos ${main} y explicamos lo aprendido`,
      `Preguntamos, comprendemos y aprendemos sobre ${main}`
    ];
    if(secondary)U.push(`${cap(main)} y ${secondary}: construimos aprendizajes desde nuestra realidad`);
    const P=[
      `Investigamos ${main} para construir una respuesta con sentido`,
      `${cap(main)} en acción: investigamos, decidimos y proponemos`,
      `De nuestras preguntas a la acción: un proyecto sobre ${main}`,
      `Conocer para actuar: investigamos ${main} y buscamos una respuesta pertinente`,
      `Nuestra realidad nos plantea un reto: investigamos ${main}`,
      `Saberes y acción: construimos una propuesta a partir de ${main}`
    ];
    if(i.goal)P.push(`Investigamos ${main} para ${tidy(i.goal)}`);
    const list=(P?/a/:/a/); // marcador inofensivo para evitar minificadores defectuosos
    return fresh(P?P:U,(P?'P|':'U|')+sig(main).slice(0,70),6);
  }

  window.ddUnderstandPlanningDescription=infer;
  window.ddIntentTitleOptions=titles;
  window.ddInferPlanningIntent=infer;
  window.ddCreativeTitleOptions=titles;

  function paint(){
    const ta=document.getElementById('unitSituation');if(!ta)return;
    let box=document.getElementById('ddIntentBox');
    if(!box){box=document.createElement('div');box.id='ddIntentBox';box.className='dd-intent-box';ta.parentElement.appendChild(box);}
    const raw=ta.value.trim();
    if(raw.length<15){box.innerHTML='<small>✍️ Describe la situación con naturalidad. La app analizará el sentido completo antes de proponer.</small>';return;}
    const i=infer(raw),type=document.getElementById('unitType')?.value||'Unidad de aprendizaje';
    const ts=titles(raw,type).slice(0,3);
    const warning=i.confidence<45?'<div class="dd-meaning-warning">⚠️ La descripción todavía es muy abierta. DocenteDigital no inventará un problema o intención que el docente no haya expresado.</div>':'';
    box.innerHTML=`<b>🧭 DocenteDigital interpretó la idea completa</b><div class="dd-intent-grid"><span><small>CONTEXTO / FOCO</small>${E(i.focus)}</span><span><small>NIVEL DE CLARIDAD</small>${E(i.status)} · ${i.confidence}%</span>${i.problem?`<span class="full"><small>PROBLEMA / NECESIDAD</small>${E(i.problem)}</span>`:''}${i.cause?`<span class="full"><small>CAUSA EXPRESADA</small>${E(i.cause)}</span>`:''}${i.goal?`<span class="full"><small>LO QUE EL DOCENTE QUIERE LOGRAR</small>${E(i.goal)}</span>`:''}</div><div class="dd-meaning-synthesis"><b>Lectura con sentido:</b> ${E(i.synthesis)}</div>${warning}<b class="dd-title-label">✨ Títulos propuestos desde esta interpretación:</b><div class="dd-title-suggestions">${ts.map(t=>`<button type="button" data-dd-title="${E(t)}">${E(t)}</button>`).join('')}</div><small>Primero se interpreta la frase; después se propone. Este mismo análisis debe orientar situación significativa, reto, producto y secuencia.</small>`;
    state.lastPlanningMeaning=i;save();
  }

  document.addEventListener('input',e=>{if(e.target?.id==='unitSituation')setTimeout(paint,0);},true);
  document.addEventListener('change',e=>{if(e.target?.id==='unitType')setTimeout(paint,0);},true);
  document.addEventListener('click',e=>{
    const t=e.target.closest?.('[data-dd-title]');if(t){const input=document.getElementById('unitTitle');if(input){input.value=t.getAttribute('data-dd-title')||'';state._ddTitleWasProvided=true;save();}return;}
    const b=e.target.closest?.('button');if(!b)return;const on=b.getAttribute('onclick')||'';
    if(/createUnitDemo/.test(on)){const raw=document.getElementById('unitSituation')?.value||'';state.lastPlanningMeaning=infer(raw);save();setTimeout(paint,20);}
    if(b.id==='ddBuildUnit')setTimeout(()=>{const u=state.activeUnitId?(state.units||[]).find(x=>x.id===state.activeUnitId):(state.units||[])[0];if(u){u.planningMeaning=state.lastPlanningMeaning||infer(document.getElementById('unitSituation')?.value||'');save();}},180);
  },true);
  const oldShow=window.showUnit;if(typeof oldShow==='function')window.showUnit=function(){const r=oldShow.apply(this,arguments);setTimeout(paint,0);return r;};
  setTimeout(paint,0);

  const style=document.createElement('style');style.textContent=`.dd-meaning-synthesis{padding:9px 10px;margin:8px 0;border-radius:9px;background:#f7fbf8;border:1px solid #d6e5db;line-height:1.4}.dd-meaning-warning{padding:8px 10px;margin:8px 0;border-radius:9px;background:#fff5df;border:1px solid #efd59c;font-size:13px}`;document.head.appendChild(style);
})();