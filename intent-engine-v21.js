/* DocenteDigital – MCI + motor de intención v22
   Auditoría Maestra 31/08/2026.
   Flujo obligatorio: entrada → comprensión semántica → intención → contexto → finalidad → propuesta.
   La frase instrumental del usuario (p. ej. “unidad sobre…”, “quiero enseñar…”) nunca se reutiliza como título.
*/
(function(){
  if(window.__ddIntentEngineV22)return;window.__ddIntentEngineV22=true;
  if(typeof window.ddAnalyzeContext!=='function')return;

  const esc=v=>typeof escapeHtml==='function'?escapeHtml(String(v||'')):String(v||'');
  const trim=s=>String(s||'').replace(/\s+/g,' ').trim();
  const lower=s=>trim(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const cap=s=>{s=trim(s);return s?s.charAt(0).toUpperCase()+s.slice(1):'';};
  const sentences=text=>String(text||'').split(/(?<=[.!?])\s+|\n+/).map(trim).filter(Boolean);

  function afterCue(text,cues){
    const raw=String(text||'');const low=lower(raw);
    for(const cue of cues){const i=low.indexOf(cue);if(i>=0){const chunk=trim(raw.slice(i+cue.length).split(/[.;!?]/)[0]);if(chunk.length>=3)return chunk.replace(/^(que|de que|a que)\s+/i,'');}}
    return'';
  }

  function documentType(text,typeHint=''){
    const s=lower(text+' '+typeHint);
    if(/\bproyecto\b/.test(s))return'Proyecto de aprendizaje';
    if(/\bsesion\b/.test(s))return'Sesión de aprendizaje';
    if(/\bunidad\b/.test(s))return'Unidad de aprendizaje';
    return /proyecto/i.test(typeHint)?'Proyecto de aprendizaje':/sesión|sesion/i.test(typeHint)?'Sesión de aprendizaje':'Unidad de aprendizaje';
  }

  function stripScaffolding(raw){
    let s=trim(raw).replace(/[.!?]+$/,'');
    s=s.replace(/^(?:por favor\s+)?(?:quiero|quisiera|necesito|deseo|hazme|haz|crea|crear|prepara|preparar|elabora|elaborar|realiza|realizar)\s+/i,'');
    s=s.replace(/^(?:una?|el|la)?\s*(?:unidad(?:\s+de\s+aprendizaje)?|proyecto(?:\s+de\s+aprendizaje)?|sesión(?:\s+de\s+aprendizaje)?|sesion(?:\s+de\s+aprendizaje)?)\s*(?:sobre|acerca\s+de|de|para\s+trabajar|con|:)\s*/i,'');
    s=s.replace(/^(?:trabajar|enseñar|ensenar|conocer|aprender|abordar|ver)\s+(?:sobre\s+|acerca\s+de\s+|de\s+)?/i,'');
    s=s.replace(/^(?:mis|los|las)?\s*(?:niños|ninos|niñas|ninas|estudiantes)\s+(?:quieren|desean|necesitan)\s+(?:saber|conocer|aprender)\s+(?:sobre\s+|acerca\s+de\s+|de\s+)?/i,'');
    return trim(s);
  }

  function explicitFinality(raw){
    const patterns=[
      /(?:para|con el fin de|con la finalidad de)\s+(.+?)(?=[.;!?]|$)/i,
      /(?:lo aprendido|estos conocimientos|estos saberes)\s+(?:lo\s+)?aplicaremos\s+(?:para\s+|en\s+)(.+?)(?=[.;!?]|$)/i,
      /(?:aplicar|usaremos|utilizaremos)\s+(?:lo aprendido|estos conocimientos|estos saberes)?\s*(?:para\s+|en\s+)(.+?)(?=[.;!?]|$)/i
    ];
    for(const p of patterns){const m=trim(raw).match(p);if(m&&trim(m[1]).length>=3)return trim(m[1]);}
    return'';
  }

  function inferTheme(raw){
    const cleaned=stripScaffolding(raw);
    const beforeGoal=cleaned.split(/\b(?:para|con el fin de|con la finalidad de)\b/i)[0];
    const beforeContrast=beforeGoal.split(/\b(?:sin embargo|pero|aunque)\b/i)[0];
    let theme=trim(beforeContrast);
    theme=theme.replace(/^(?:los|las)?\s*(?:niños|ninos|niñas|ninas|estudiantes)\s+/i,'');
    theme=theme.replace(/^(?:quieren|desean|necesitan)\s+(?:saber|conocer|aprender)\s+(?:sobre\s+|de\s+)?/i,'');
    if(theme.length>110){
      const a=window.ddAnalyzeContext(theme,10);theme=trim((a.phrases||[])[0]||(a.concepts||[]).slice(0,3).join(' '));
    }
    return theme||'la situación descrita';
  }

  function intentKind(raw){
    const s=lower(raw);
    if(/investig|indag|averigu|pregunt|quieren saber|curios/.test(s))return'indagación/curiosidad';
    if(/aplicar|implementar|construir|sembrar|crear|elaborar|organizar|mejorar|resolver/.test(s))return'aplicación/acción';
    if(/valorar|tradicion|costumbre|identidad|saberes/.test(s))return'valoración/contexto';
    if(/retorn|regres|vuelv|vacacion|celebr|alegr|encuentro/.test(s))return'experiencia significativa';
    return'exploración/comprensión';
  }

  function actorList(raw){
    const out=[];const s=trim(raw);
    ['estudiantes','niños','niñas','familias','madres','padres','abuelos','abuelas','yachaq','productores','autoridades','docentes'].forEach(a=>{if(new RegExp('\\b'+a+'\\b','i').test(s))out.push(a);});
    return out;
  }

  function understandUserIntent(text,typeHint=''){
    const raw=trim(text),theme=inferTheme(raw),finality=explicitFinality(raw),kind=intentKind(raw),doc=documentType(raw,typeHint);
    const instrumental=/\b(?:unidad|proyecto|sesión|sesion)\s+(?:sobre|de|acerca de)\b|^\s*(?:quiero|necesito|hazme|crea|prepara|elabora)\b/i.test(raw);
    const context=state.teacherContext||{};
    return{
      raw,document:doc,theme,intentKind:kind,finality,actors:actorList(raw),
      place:trim(context.community||context.locationName||context.district||context.province||''),
      instrumentalExpression:instrumental,
      sufficient:theme.length>=3,
      doNotCopyLiterally:instrumental,
      principle:'comprender intención antes de generar'
    };
  }

  function inferIntent(text,typeHint=''){
    const raw=trim(text),mci=understandUserIntent(raw,typeHint),analysis=window.ddAnalyzeContext(raw,18),ss=sentences(raw);
    const explicitGoal=afterCue(raw,['queremos ','quiero ','necesitamos ','se necesita ','buscamos ','se busca ','nos proponemos ','el propósito es ','la finalidad es ','con el fin de ','para lograr ','para que ']);
    const issueSentence=ss.find(s=>/(sin embargo|problema|dificultad|necesidad|preocupa|afecta|falta|escasez|pérdida|perdida|disminución|disminucion|desconoc|riesgo|contamin|conflicto|baja|poca|poco|limitad)/i.test(s))||'';
    const opportunitySentence=ss.find(s=>/(oportunidad|fortaleza|tradición|tradicion|saber|práctica|practica|costumbre|actividad comunal|participan|realizan|producen|cultivan|celebran|retornan|regresan|vacaciones)/i.test(s))||'';
    const goal=mci.finality||explicitGoal||'';
    const orientation=goal?'meta explícita':issueSentence?'problema o necesidad':opportunitySentence?'oportunidad/experiencia del contexto':mci.intentKind;
    return{
      raw,analysis,focus:mci.theme,goal,issue:issueSentence,opportunity:opportunitySentence,orientation,place:mci.place,actors:mci.actors,mci,
      summary:goal?`El docente quiere trabajar ${mci.theme} con la finalidad de ${goal}.`:`El eje principal es ${mci.theme}; la planificación debe responder a una intención de ${mci.intentKind}.`
    };
  }

  function shortGoal(intent){
    let g=trim(intent.goal);
    if(!g){
      if(intent.mci?.intentKind==='indagación/curiosidad')g='responder preguntas y comunicar lo descubierto';
      else if(intent.mci?.intentKind==='aplicación/acción')g='aplicar lo aprendido en una acción con sentido';
      else if(intent.mci?.intentKind==='valoración/contexto')g='comprender y valorar esta experiencia';
      else g='comprenderla y comunicar lo aprendido';
    }
    return g.length>82?g.slice(0,79).replace(/\s+\S*$/,'')+'…':g;
  }
  function shortFocus(intent){let f=trim(intent.focus).replace(/["“”]/g,'');if(f.length>72){const a=intent.analysis?.concepts||[];f=a.slice(0,3).join(' ');}return f||'la situación descrita';}
  function signature(s){return lower(s).replace(/[^a-z0-9ñ]+/g,' ').trim();}
  function chooseFresh(key,list,n=5){state.intentTitleHistory=state.intentTitleHistory||{};const used=Array.isArray(state.intentTitleHistory[key])?state.intentTitleHistory[key]:[];let available=list.filter(x=>!used.includes(signature(x)));if(available.length<n)available=[...list];const out=[];while(available.length&&out.length<n){const i=Math.floor(Math.random()*available.length);out.push(available.splice(i,1)[0]);}state.intentTitleHistory[key]=[...used,...out.map(signature)].slice(-40);try{save();}catch(e){}return out;}

  function titleOptions(text,type){
    const i=inferIntent(text,type),f=shortFocus(i),g=shortGoal(i),project=/proyecto/i.test(String(type||i.mci.document||'')),kind=i.mci.intentKind,place=i.place?` en ${i.place}`:'';
    let list=[];
    if(/primavera/i.test(f)){
      list=[
        'Descubrimos los cambios que trae la primavera a nuestro entorno',
        '¿Qué cambia en nuestro entorno cuando llega la primavera?',
        'Conocemos y cuidamos la vida que florece durante la primavera'
      ];
    }else if(kind==='indagación/curiosidad'){
      list=project?[`De nuestras preguntas a los hallazgos: investigamos ${f}`,`Investigamos ${f} para responder lo que queremos saber`,`Descubrimos ${f}${place} y compartimos nuestros hallazgos`]:[`Descubrimos ${f} a partir de nuestras preguntas`,`Exploramos ${f} para comprenderlo mejor`,`Lo que queremos saber sobre ${f}`];
    }else if(kind==='aplicación/acción'){
      list=project?[`Aprendemos sobre ${f} para ${g}`,`${cap(f)} en acción: aprendemos, decidimos y actuamos`,`Ponemos en práctica lo aprendido sobre ${f}`]:[`Aprendemos sobre ${f} para ${g}`,`Ponemos en práctica nuestros aprendizajes sobre ${f}`,`${cap(f)}: aprendemos haciendo y explicamos lo logrado`];
    }else if(kind==='experiencia significativa'){
      list=[`${cap(f)}`,`Aprendemos a partir de ${f}`,`Compartimos lo que vivimos y aprendemos en ${f}`];
    }else if(kind==='valoración/contexto'){
      list=[`Valoramos y comprendemos ${f}`,`Aprendemos de ${f} y compartimos sus saberes`,`${cap(f)}: saberes que fortalecen nuestros aprendizajes`];
    }else{
      list=[`Descubrimos ${f} y construimos nuevos aprendizajes`,`Exploramos ${f} desde nuestra experiencia`,`Comprendemos ${f} y comunicamos lo aprendido`];
    }
    const bad=/\b(?:unidad|proyecto|sesión|sesion)\s+(?:sobre|de|acerca de)\b|\bquiero enseñar\b|\bquiero trabajar\b/i;
    list=list.map(trim).filter(t=>t&&!bad.test(t));
    const theme=signature(f).slice(0,70)||'general';return chooseFresh((project?'P|':'U|')+theme,list,Math.min(3,list.length));
  }

  window.ddUnderstandUserIntent=understandUserIntent;
  window.ddInferPlanningIntent=inferIntent;
  window.ddIntentTitleOptions=titleOptions;

  const previousTitles=window.ddCreativeTitleOptions;
  window.ddCreativeTitleOptions=function(brief,type){
    const intentional=titleOptions(brief,type);let previous=[];try{previous=typeof previousTitles==='function'?(previousTitles.apply(this,arguments)||[]):[];}catch(e){}
    const mci=understandUserIntent(brief,type);const bad=mci.doNotCopyLiterally?/\b(?:unidad|proyecto|sesión|sesion)\s+(?:sobre|de|acerca de)\b|\bquiero enseñar\b|\bquiero trabajar\b/i:/$a/;
    return [...intentional,...previous].filter(x=>x&&!bad.test(x)).filter((x,n,a)=>a.findIndex(y=>signature(y)===signature(x))===n).slice(0,6);
  };

  const previousChoices=window.ddCreativeChoices;
  if(typeof previousChoices==='function')window.ddCreativeChoices=function(brief,type,fallback){
    const d=previousChoices.apply(this,arguments)||{},intent=inferIntent(brief,type),f=shortFocus(intent),g=shortGoal(intent);d.intent=intent;d.mci=intent.mci;
    d.situations=(d.situations||[]).map(x=>({...x,text:trim(x.text)}));d.products=(d.products||[]).map(x=>({...x,text:trim(x.text)}));return d;
  };

  function paint(){
    const ta=document.getElementById('unitSituation');if(!ta)return;let box=document.getElementById('ddIntentBox');
    if(!box){box=document.createElement('div');box.id='ddIntentBox';box.className='dd-intent-box';(ta.parentElement||document.body).appendChild(box);}
    const raw=ta.value.trim();if(raw.length<3){box.innerHTML='<small>Escribe tu idea con naturalidad.</small>';return;}
    const type=document.getElementById('unitType')?.value||'Unidad de aprendizaje',titles=titleOptions(raw,type).slice(0,3);
    box.innerHTML=`<b class="dd-title-label">✨ Elige uno de estos títulos</b><div class="dd-title-suggestions">${titles.map(t=>`<button type="button" data-dd-title="${esc(t)}">${esc(t)}</button>`).join('')}</div>`;
  }

  document.addEventListener('click',e=>{
    const titleBtn=e.target.closest?.('[data-dd-title]');if(titleBtn){const input=document.getElementById('unitTitle');if(input){input.value=titleBtn.getAttribute('data-dd-title')||'';state._ddTitleWasProvided=true;try{save();}catch(e){}}return;}
    const b=e.target.closest?.('button');if(!b)return;const on=b.getAttribute('onclick')||'';
    if(/createUnitDemo/.test(on)){const raw=document.getElementById('unitSituation')?.value||'';state.lastPlanningIntent=inferIntent(raw,document.getElementById('unitType')?.value||'');try{save();}catch(e){}}
    if(b.id==='ddBuildUnit'){const raw=state.pendingUnitChoice?.brief||document.getElementById('unitSituation')?.value||'',intent=inferIntent(raw,state.pendingUnitChoice?.type||'');state.lastPlanningIntent=intent;try{save();}catch(e){}setTimeout(()=>{const u=state.activeUnitId?(state.units||[]).find(x=>x.id===state.activeUnitId):(state.units||[])[0];if(u){u.planningIntent=intent;u.intentContract={theme:intent.mci.theme,finality:intent.mci.finality,kind:intent.mci.intentKind,userDecisionWins:true};try{save();}catch(e){}}},180);}
  },true);
  document.addEventListener('input',e=>{if(e.target?.id==='unitSituation')paint();},true);
  document.addEventListener('change',e=>{if(e.target?.id==='unitType')paint();},true);
  const oldShow=window.showUnit;if(typeof oldShow==='function')window.showUnit=function(){const r=oldShow.apply(this,arguments);setTimeout(paint,0);return r;};
  setTimeout(paint,0);

  const style=document.createElement('style');style.textContent=`.dd-intent-box{margin-top:9px}.dd-title-label{display:block;margin:7px 0}.dd-title-suggestions{display:grid;gap:6px}.dd-title-suggestions button{text-align:left;border:1px solid #d7c59f;background:#fff;padding:9px 10px;border-radius:9px;cursor:pointer;font:inherit}.dd-title-suggestions button:hover{background:#fff7e8}`;document.head.appendChild(style);
})();