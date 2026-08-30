/* DocenteDigital – motor de sentido v22: análisis exhaustivo de la descripción antes de proponer */
(function(){
  if(window.__ddMeaningEngineV22)return;window.__ddMeaningEngineV22=true;
  if(typeof window.ddAnalyzeContext!=='function')return;

  const E=v=>typeof escapeHtml==='function'?escapeHtml(String(v||'')):String(v||'');
  const tidy=s=>String(s||'').replace(/\s+/g,' ').replace(/^[,;:\-–—\s]+|[,;:\-–—\s]+$/g,'').trim();
  const low=s=>tidy(s).toLowerCase();
  const cap=s=>{s=tidy(s);return s?s.charAt(0).toUpperCase()+s.slice(1):'';};
  const sentences=text=>String(text||'').split(/(?<=[.!?])\s+|\n+/).map(tidy).filter(Boolean);

  const CUES={
    goal:[/\bqueremos\b/i,/\bquiero\b/i,/\bnecesitamos\b/i,/\bbuscamos\b/i,/\bnos proponemos\b/i,/\bcon el fin de\b/i,/\bpara lograr\b/i,/\bpara que\b/i,/\bla finalidad es\b/i,/\bel propósito es\b/i,/\bse espera que\b/i],
    problem:[/\bsin embargo\b/i,/\bpero\b/i,/\baunque\b/i,/\bproblema\b/i,/\bdificultad\b/i,/\bpreocupa\b/i,/\bafecta\b/i,/\bfalta\b/i,/\bescasez\b/i,/\bpérdida\b/i,/\bperdida\b/i,/\bdesconoc/i,/\bno saben\b/i,/\bpoco conocen\b/i,/\briesgo\b/i,/\bcontamin/i,/\bconflicto\b/i,/\bdisminu/i,/\bbaja\b/i,/\blimitad/i,/\babandono\b/i,/\bdeterioro\b/i],
    cause:[/\bporque\b/i,/\bdebido a\b/i,/\ba causa de\b/i,/\bpor falta de\b/i,/\bpor la falta de\b/i,/\bya que\b/i,/\bcomo consecuencia de\b/i],
    consequence:[/\bpor eso\b/i,/\bpor ello\b/i,/\bcomo consecuencia\b/i,/\bocasiona\b/i,/\bgenera\b/i,/\bprovoca\b/i,/\btrae como consecuencia\b/i],
    opportunity:[/\boportunidad\b/i,/\bfortaleza\b/i,/\btradición\b/i,/\btradicion\b/i,/\bcostumbre\b/i,/\bsaber(es)?\b/i,/\bpráctica\b/i,/\bpractica\b/i,/\bparticipan\b/i,/\brealizan\b/i,/\bcultivan\b/i,/\bproducen\b/i,/\bcelebran\b/i,/\bconservan\b/i,/\borganizan\b/i],
    actors:[/\bestudiantes\b/i,/\bniños\b/i,/\bniñas\b/i,/\bfamilias\b/i,/\bmadres\b/i,/\bpadres\b/i,/\babuelos\b/i,/\babuelas\b/i,/\byachaq\b/i,/\bcomunidad\b/i,/\bproductores\b/i,/\bautoridades\b/i,/\bdocentes\b/i]
  };

  function hasAny(text,patterns){return patterns.some(r=>r.test(text));}
  function splitClauses(text){
    const out=[];
    sentences(text).forEach((s,si)=>{
      const pieces=s.split(/\s+(?=(?:sin embargo|pero|aunque|porque|debido a|a causa de|ya que|por eso|por ello|para que|con el fin de|mientras que|como consecuencia)\b)/i);
      pieces.map(tidy).filter(Boolean).forEach((p,pi)=>out.push({text:p,sentence:si,part:pi}));
    });
    return out;
  }
  function scoreClause(c,kind){
    if(!c)return 0;
    let score=0,patterns=CUES[kind]||[];
    if(hasAny(c.text,patterns))score+=12;
    score+=Math.min((window.ddAnalyzeContext(c.text,8).concepts||[]).length,6);
    score+=Math.min(c.text.length/70,3);
    return score;
  }
  function bestClause(clauses,kind,min=0){
    const ranked=clauses.map(c=>({...c,score:scoreClause(c,kind)})).sort((a,b)=>b.score-a.score);
    return ranked[0]&&ranked[0].score>=min?ranked[0]:null;
  }
  function afterCue(text,patterns){
    for(const source of patterns){
      const r=new RegExp(source.source,source.flags.replace('g',''));
      const m=r.exec(text);if(!m)continue;
      const result=tidy(text.slice(m.index+m[0].length)).replace(/^(que|de que|a que)\s+/i,'');
      if(result.length>3)return result;
    }
    return'';
  }
  function compactConcepts(text,n=3){
    if(!text)return[];
    const a=window.ddAnalyzeContext(text,n+8);
    const candidates=[...(a.phrases||[]),...(a.words||[]),...(a.concepts||[])];
    const result=[];
    for(const x of candidates){
      const value=tidy(x).replace(/^(en|de|del|la|el|los|las|un|una)\s+/i,'');
      if(!value||value.length<3||value.length>78)continue;
      if(result.some(y=>low(y)===low(value)))continue;
      result.push(value);if(result.length>=n)break;
    }
    return result;
  }
  function detectActors(raw){
    const actors=[];
    const names=['estudiantes','niños','niñas','familias','madres','padres','abuelos','abuelas','yachaq','comunidad','productores','autoridades','docentes'];
    names.forEach((name,i)=>{if(CUES.actors[i]&&CUES.actors[i].test(raw))actors.push(name);});
    return actors;
  }
  function detectPlace(raw){
    const ctx=state.teacherContext||{};
    const known=[ctx.community,ctx.district,ctx.province,ctx.region].filter(Boolean);
    const explicit=raw.match(/\b(?:en|de|desde)\s+([A-ZÁÉÍÓÚÑ][\wÁÉÍÓÚÑáéíóúñ-]*(?:\s+[A-ZÁÉÍÓÚÑ][\wÁÉÍÓÚÑáéíóúñ-]*){0,3})/);
    return tidy(explicit?.[1]||known[0]||'');
  }
  function infer(text){
    const raw=tidy(text),analysis=window.ddAnalyzeContext(raw,24),clauses=splitClauses(raw);
    const goalClause=bestClause(clauses,'goal',12);
    const problemClause=bestClause(clauses,'problem',12);
    const causeClause=bestClause(clauses,'cause',12);
    const consequenceClause=bestClause(clauses,'consequence',12);
    const opportunityClause=bestClause(clauses,'opportunity',9);

    const goal=goalClause?afterCue(goalClause.text,CUES.goal):'';
    const problem=problemClause?tidy(problemClause.text):'';
    const cause=causeClause?afterCue(causeClause.text,CUES.cause):'';
    const consequence=consequenceClause?tidy(consequenceClause.text):'';
    const opportunity=opportunityClause?tidy(opportunityClause.text):'';
    const actors=detectActors(raw);
    const place=detectPlace(raw);

    let contextClause=clauses.find(c=>!hasAny(c.text,CUES.goal)&&!hasAny(c.text,CUES.problem)&&!hasAny(c.text,CUES.cause))?.text||sentences(raw)[0]||raw;
    if(contextClause.length<8)contextClause=raw;
    const contextConcepts=compactConcepts(contextClause,4);
    const problemConcepts=compactConcepts(problem,3);
    const goalConcepts=compactConcepts(goal,3);
    const opportunityConcepts=compactConcepts(opportunity,2);

    const combined=[...contextConcepts,...problemConcepts,...goalConcepts,...opportunityConcepts];
    const unique=[];combined.forEach(x=>{if(!unique.some(y=>low(y)===low(x)))unique.push(x);});
    let focus=unique.slice(0,4).join(' · ');
    if(!focus)focus=(analysis.concepts||[]).slice(0,3).join(' · ')||'la realidad descrita por el docente';
    if(focus.length>120)focus=focus.slice(0,117).replace(/\s+\S*$/,'')+'…';

    let confidence=0;
    if(raw.length>=30)confidence+=10;
    if(raw.length>=80)confidence+=10;
    if(contextConcepts.length>=2)confidence+=15;
    if(problem)confidence+=20;
    if(goal)confidence+=20;
    if(cause)confidence+=10;
    if(opportunity)confidence+=5;
    if(actors.length)confidence+=5;
    if(place)confidence+=5;
    confidence=Math.min(confidence,100);
    const status=confidence>=75?'lectura clara':confidence>=50?'lectura razonable':'lectura preliminar';

    const gaps=[];
    if(!problem&&!opportunity)gaps.push('no se distingue todavía un problema, necesidad u oportunidad clara');
    if(!goal)gaps.push('no se expresa todavía qué quiere lograr el docente');
    if(!actors.length)gaps.push('no se mencionan con claridad los actores principales');

    let synthesis='';
    if(problem&&goal){
      synthesis=`La descripción presenta como contexto ${contextConcepts[0]||'una situación de la realidad cercana'}. Se identifica la necesidad o dificultad “${problem.replace(/^(sin embargo|pero|aunque)[,\s]*/i,'')}” y el docente quiere orientar el aprendizaje a ${goal}.`;
    }else if(problem){
      synthesis=`La descripción se centra en ${contextConcepts[0]||focus} y plantea una necesidad o dificultad concreta: ${problem.replace(/^(sin embargo|pero|aunque)[,\s]*/i,'')}. No se debe inventar una finalidad que el docente no haya expresado.`;
    }else if(goal){
      synthesis=`La descripción se centra en ${contextConcepts[0]||focus} y expresa como intención ${goal}. La app debe construir la situación y el reto desde esa intención sin agregar problemas inexistentes.`;
    }else{
      synthesis=`La descripción permite reconocer ${focus}, pero todavía no expresa con suficiente claridad una necesidad, problema u objetivo. La propuesta debe mantenerse prudente y basada solo en lo escrito.`;
    }

    return{raw,analysis,clauses,contextClause,focus,problem,cause,consequence,goal,opportunity,actors,place,confidence,status,gaps,synthesis,contextConcepts,problemConcepts,goalConcepts,opportunityConcepts};
  }

  function sig(s){return low(s).replace(/[^a-z0-9áéíóúñü]+/g,' ').trim();}
  function fresh(list,key,count=6){
    state.meaningTitleHistory=state.meaningTitleHistory||{};
    const used=state.meaningTitleHistory[key]||[];
    let pool=list.filter(x=>!used.includes(sig(x)));
    if(pool.length<count)pool=[...list];
    const out=[];
    while(pool.length&&out.length<count){const index=Math.floor(Math.random()*pool.length);out.push(pool.splice(index,1)[0]);}
    state.meaningTitleHistory[key]=[...used,...out.map(sig)].slice(-60);save();return out;
  }
  function titleOptions(text,type){
    const meaning=infer(text),isProject=/proyecto/i.test(String(type||''));
    const main=meaning.contextConcepts[0]||meaning.problemConcepts[0]||meaning.analysis?.concepts?.[0]||'nuestra realidad';
    const secondary=meaning.problemConcepts.find(x=>low(x)!==low(main))||meaning.goalConcepts.find(x=>low(x)!==low(main))||'';
    const purpose=meaning.goal?tidy(meaning.goal):(secondary?`comprender mejor ${secondary}`:'comprender mejor esta realidad');

    const unitTitles=[
      `Aprendemos desde ${main}: comprendemos nuestra realidad con sentido`,
      `Comprendemos ${main} para ${purpose}`,
      `${cap(main)}: saberes, preguntas y aprendizajes desde nuestra comunidad`,
      `Entre experiencias y saberes: aprendemos a partir de ${main}`,
      `Nuestra realidad nos enseña: exploramos ${main} y explicamos lo aprendido`,
      `Preguntamos, comprendemos y aprendemos sobre ${main}`,
      secondary?`${cap(main)} y ${secondary}: construimos aprendizajes desde nuestra realidad`:`Miramos de cerca ${main}: aprendemos desde lo que vivimos`
    ];
    const projectTitles=[
      `Investigamos ${main} para construir una respuesta con sentido`,
      `${cap(main)} en acción: investigamos, decidimos y proponemos`,
      `De nuestras preguntas a la acción: un proyecto sobre ${main}`,
      `Conocer para actuar: investigamos ${main} y buscamos una respuesta pertinente`,
      `Nuestra realidad nos plantea un reto: investigamos ${main}`,
      `Saberes y acción: construimos una propuesta a partir de ${main}`,
      meaning.goal?`Investigamos ${main} para ${tidy(meaning.goal)}`:`Aprendemos haciendo: investigamos ${main} y construimos una respuesta`
    ];
    return fresh(isProject?projectTitles:unitTitles,(isProject?'P|':'U|')+sig(main).slice(0,80),6);
  }

  window.ddUnderstandPlanningDescription=infer;
  window.ddIntentTitleOptions=titleOptions;
  window.ddInferPlanningIntent=infer;
  window.ddCreativeTitleOptions=titleOptions;

  function paint(){
    const ta=document.getElementById('unitSituation');if(!ta)return;
    let box=document.getElementById('ddIntentBox');
    if(!box){box=document.createElement('div');box.id='ddIntentBox';box.className='dd-intent-box';ta.parentElement.appendChild(box);}
    const raw=ta.value.trim();
    if(raw.length<15){box.innerHTML='<small>✍️ Describe la situación con naturalidad. La app analizará el sentido completo antes de proponer.</small>';return;}
    const meaning=infer(raw),type=document.getElementById('unitType')?.value||'Unidad de aprendizaje';
    const titles=titleOptions(raw,type).slice(0,3);
    const warning=meaning.confidence<50?`<div class="dd-meaning-warning">⚠️ <b>Interpretación todavía preliminar.</b> ${E(meaning.gaps.join('; ')||'Falta contexto suficiente')}. La app no debe inventar esos datos.</div>`:'';
    const rows=[
      `<span><small>CONTEXTO / FOCO</small>${E(meaning.focus)}</span>`,
      `<span><small>CLARIDAD DE LA INTERPRETACIÓN</small>${E(meaning.status)} · ${meaning.confidence}%</span>`,
      meaning.actors.length?`<span><small>ACTORES MENCIONADOS</small>${E(meaning.actors.join(', '))}</span>`:'',
      meaning.place?`<span><small>LUGAR / CONTEXTO TERRITORIAL</small>${E(meaning.place)}</span>`:'',
      meaning.problem?`<span class="full"><small>PROBLEMA / NECESIDAD EXPRESADA</small>${E(meaning.problem)}</span>`:'',
      meaning.cause?`<span class="full"><small>CAUSA EXPRESADA</small>${E(meaning.cause)}</span>`:'',
      meaning.consequence?`<span class="full"><small>CONSECUENCIA EXPRESADA</small>${E(meaning.consequence)}</span>`:'',
      meaning.opportunity?`<span class="full"><small>OPORTUNIDAD / SABER DEL CONTEXTO</small>${E(meaning.opportunity)}</span>`:'',
      meaning.goal?`<span class="full"><small>LO QUE EL DOCENTE QUIERE LOGRAR</small>${E(meaning.goal)}</span>`:''
    ].filter(Boolean).join('');
    box.innerHTML=`<b>🧭 DocenteDigital analizó la idea completa</b><div class="dd-intent-grid">${rows}</div><div class="dd-meaning-synthesis"><b>Lectura con sentido:</b> ${E(meaning.synthesis)}</div>${warning}<b class="dd-title-label">✨ Títulos propuestos después del análisis:</b><div class="dd-title-suggestions">${titles.map(t=>`<button type="button" data-dd-title="${E(t)}">${E(t)}</button>`).join('')}</div><small>Primero comprende relaciones y sentido; después propone. Esta misma interpretación debe dirigir situación significativa, reto, producto, actividades y sesiones.</small>`;
    state.lastPlanningMeaning=meaning;save();
  }

  document.addEventListener('input',e=>{if(e.target?.id==='unitSituation')setTimeout(paint,0);},true);
  document.addEventListener('change',e=>{if(e.target?.id==='unitType')setTimeout(paint,0);},true);
  document.addEventListener('click',e=>{
    const titleButton=e.target.closest?.('[data-dd-title]');
    if(titleButton){const input=document.getElementById('unitTitle');if(input){input.value=titleButton.getAttribute('data-dd-title')||'';state._ddTitleWasProvided=true;save();}return;}
    const button=e.target.closest?.('button');if(!button)return;const on=button.getAttribute('onclick')||'';
    if(/createUnitDemo/.test(on)){const raw=document.getElementById('unitSituation')?.value||'';state.lastPlanningMeaning=infer(raw);save();setTimeout(paint,20);}
    if(button.id==='ddBuildUnit')setTimeout(()=>{
      const unit=state.activeUnitId?(state.units||[]).find(x=>x.id===state.activeUnitId):(state.units||[])[0];
      if(unit){unit.planningMeaning=state.lastPlanningMeaning||infer(document.getElementById('unitSituation')?.value||'');save();}
    },180);
  },true);

  const oldShow=window.showUnit;
  if(typeof oldShow==='function')window.showUnit=function(){const result=oldShow.apply(this,arguments);setTimeout(paint,0);return result;};
  setTimeout(paint,0);

  const style=document.createElement('style');
  style.textContent=`.dd-meaning-synthesis{padding:9px 10px;margin:8px 0;border-radius:9px;background:#f7fbf8;border:1px solid #d6e5db;line-height:1.4}.dd-meaning-warning{padding:8px 10px;margin:8px 0;border-radius:9px;background:#fff5df;border:1px solid #efd59c;font-size:13px}`;
  document.head.appendChild(style);
})();