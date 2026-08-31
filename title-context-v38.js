/* DocenteDigital – títulos naturales y pertinentes desde el sentido completo v40
   Regla: primero comprender el tipo de situación y la intención; después redactar.
   Nunca convertir automáticamente cualquier contexto en una investigación.
*/
(function(){
  if(window.__ddTitleContextV40)return; window.__ddTitleContextV40=true;
  const tidy=s=>String(s||'').replace(/\s+/g,' ').trim();
  const low=s=>tidy(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const cap=s=>{s=tidy(s);return s?s.charAt(0).toUpperCase()+s.slice(1):s;};
  const E=s=>typeof window.escapeHtml==='function'?window.escapeHtml(String(s||'')):String(s||'');
  const STOP=new Set('a al algo ante con de del desde e el ella ellas ellos en entre es esta este estos la las lo los me mi mis muy ni no o para pero por que queremos quiero se sin sobre su sus tu un una unos unas y ya ello nuestra nuestro nuestras nuestros'.split(' '));
  const VERBS=new Set('aparecio aparecieron apareciero aparecen hay vimos observamos encontramos queremos quiero investigar investigamos conocer conocemos aprender aprendemos saber sabemos comprender comprendemos estudiar exploramos explorar realizar hacemos hacer retornan regresan vuelven vuelve retorna regresa'.split(' '));

  function spelling(s){
    return tidy(s)
      .replace(/\bapareciero\b/gi,'aparecieron')
      .replace(/\baparecieron\s+las\s+hormigas\s+en\s+el\s+aula\s+y\s+queremos\s+investigar\s+sobre\s+ello\b/gi,'aparecieron hormigas en el aula y queremos investigarlas');
  }

  function stripIntent(raw){
    let s=spelling(raw).replace(/[.!?]+$/,'');
    s=s.split(/\b(?:y\s+)?(?:queremos|quiero|deseamos|deseo|nos interesa|buscamos|necesitamos)\b/i)[0];
    s=s.split(/\b(?:con el fin de|con la finalidad de|para lograr|para que)\b/i)[0];
    return tidy(s);
  }

  function topicFromEvent(raw){
    const s=stripIntent(raw);
    let m=s.match(/\b(?:aparecieron?|apareciero|aparecen|encontramos|observamos|vimos|hay|llegaron?)\s+(.+?)(?=\s+(?:en|dentro de|cerca de|junto a)\s+|$)/i);
    if(m&&tidy(m[1]).length<=70)return tidy(m[1]).replace(/^(unos?|unas?|los|las)\s+/i,'');
    m=s.match(/\b(?:sobre|acerca de)\s+(.+)$/i);
    if(m&&tidy(m[1]).length<=70)return tidy(m[1]);
    const words=low(s).replace(/[^a-z0-9ñ\s-]/g,' ').split(/\s+/).filter(w=>w.length>2&&!STOP.has(w)&&!VERBS.has(w));
    return words.slice(0,4).join(' ');
  }

  function placeFromRaw(raw){
    const s=spelling(raw);
    const m=s.match(/\b(?:en|dentro de|cerca de|junto a)\s+(el|la|los|las)?\s*([^,.;!?]+?)(?=\s+(?:y\s+queremos|queremos|para|porque|pero|sin embargo)\b|[,.!?]|$)/i);
    if(!m)return'';
    return tidy([m[1]||'',m[2]||''].filter(Boolean).join(' '));
  }

  function intent(raw){
    const s=spelling(raw);
    const m=s.match(/\b(?:queremos|quiero|deseamos|deseo|nos interesa|buscamos|necesitamos)\s+(.+?)(?=[.!?]|$)/i);
    return tidy(m?.[1]||'').replace(/^investigar\s+sobre\s+ello$/i,'investigar lo observado');
  }

  function hasInvestigativeIntent(raw){
    const s=low(raw);
    return /\binvestig|\bindag|\baverigu|\bqueremos saber|\bquieren saber|\bnos preguntamos|\bpreguntarse|\bdescubrir por que|\bcomprender por que/.test(s);
  }

  function isObservedOccurrence(raw){
    const s=low(raw);
    return /\baparecieron?\b|\bencontramos\b|\bobservamos\b|\bvimos\b|\bhay\b/.test(s);
  }

  function returnToSchool(raw){
    const s=low(raw);
    if(!/(retorn|regres|vuelv|volver)/.test(s)||!/(clase|escuela|colegio|institucion educativa|ie\b)/.test(s))return null;
    const joy=/alegr|entusias|emocion|content/.test(s);
    const vacation=/vacacion/.test(s);
    const mood=joy?' con alegría':'';
    const after=vacation?' después de las vacaciones':'';
    return [
      `Volvemos a clases${mood}${after}`,
      `Nos reencontramos${mood} al volver a clases${vacation?' después de las vacaciones':''}`,
      `${vacation?'Después de las vacaciones, ':''}regresamos a clases${mood}`
    ];
  }

  function explicitActionTitles(raw,type){
    const s=spelling(raw).replace(/[.!?]+$/,'');
    const n=low(s);
    const project=/proyecto/i.test(type||'');
    if(/\bsiembr|\bcosech|\btej|\bferia|\bbiohuerto|\bhuerto/.test(n)){
      const core=topicFromEvent(s)||'nuestros saberes y prácticas';
      return project?[
        `Aprendemos haciendo a partir de ${core}`,
        `Ponemos en práctica nuestros saberes sobre ${core}`,
        `Compartimos lo que aprendemos sobre ${core}`
      ]:[
        `Aprendemos a partir de ${core}`,
        `Valoramos y ponemos en práctica saberes sobre ${core}`,
        `Compartimos nuestros aprendizajes sobre ${core}`
      ];
    }
    return null;
  }

  function semantic(raw){
    const corrected=spelling(raw),topic=topicFromEvent(corrected),place=placeFromRaw(corrected),goal=intent(corrected);
    let full=null;try{full=window.ddUnderstandPlanningDescription?.(corrected)||null;}catch(e){}
    return {raw:corrected,topic:topic||tidy(full?.contextConcepts?.[0]||full?.analysis?.words?.[0]||'la situación observada'),place,goal,full};
  }

  function genericNaturalTitles(raw,type){
    const sentence=cap(stripIntent(raw));
    const topic=topicFromEvent(raw)||'esta experiencia';
    const project=/proyecto/i.test(type||'');
    const safeSentence=sentence.length<=105?sentence:'';
    const list=project?[
      safeSentence||`Construimos aprendizajes a partir de ${topic}`,
      `Aprendemos y actuamos a partir de ${topic}`,
      `Compartimos lo que descubrimos y construimos sobre ${topic}`
    ]:[
      safeSentence||`Aprendemos a partir de ${topic}`,
      `Comprendemos mejor ${topic} desde nuestra experiencia`,
      `Compartimos y construimos aprendizajes sobre ${topic}`
    ];
    return list;
  }

  function naturalTitles(raw,type){
    const s=semantic(raw),topic=s.topic||'la situación observada',place=s.place;
    const project=/proyecto/i.test(type||'');
    const location=place?` en ${place}`:'';
    let list=[];

    const schoolReturn=returnToSchool(s.raw);
    if(schoolReturn){
      list=schoolReturn;
    }else if(hasInvestigativeIntent(s.raw)||isObservedOccurrence(s.raw)){
      const plural=/s$/.test(low(topic));
      const article=plural?'las':'los';
      list=project?[
        `Investigamos ${article} ${topic}${location} para responder nuestras preguntas`,
        `${cap(topic)}${location}: observamos, investigamos y compartimos nuestros hallazgos`,
        `De nuestras preguntas a los hallazgos: investigamos ${article} ${topic}${location}`
      ]:[
        `Investigamos ${article} ${topic}${location} a partir de lo que observamos`,
        `${cap(topic)}${location}: observamos, preguntamos y aprendemos`,
        `Descubrimos el mundo de ${article} ${topic}${location}`
      ];
    }else{
      list=explicitActionTitles(s.raw,type)||genericNaturalTitles(s.raw,type);
    }

    return [...new Set(list.map(t=>tidy(t).replace(/\s+/g,' ')).filter(Boolean))].slice(0,3);
  }

  const previous=window.ddCreativeTitleOptions;
  window.ddCreativeTitleOptions=function(brief,type){
    const natural=naturalTitles(brief,type);
    let old=[];try{old=typeof previous==='function'?(previous(brief,type)||[]):[];}catch(e){}
    const merged=[...natural,...old].filter((x,i,a)=>x&&a.findIndex(y=>low(y)===low(x))===i);
    return merged.slice(0,6);
  };
  window.ddContextualTitlePreview=(brief,type)=>naturalTitles(brief,type);
  window.ddNaturalPlanningTitles=naturalTitles;

  function repaint(){
    const ta=document.getElementById('unitSituation'),box=document.querySelector('#ddIntentBox .dd-title-suggestions');
    if(!ta||!box||tidy(ta.value).length<8)return;
    const type=document.getElementById('unitType')?.value||'Unidad de aprendizaje';
    const titles=naturalTitles(ta.value,type);
    box.innerHTML=titles.map(t=>`<button type="button" data-dd-title="${E(t)}">${E(t)}</button>`).join('');
  }
  let timer=0;const schedule=()=>{clearTimeout(timer);timer=setTimeout(repaint,300);};
  document.addEventListener('input',e=>{if(e.target?.id==='unitSituation')schedule();},true);
  document.addEventListener('change',e=>{if(e.target?.id==='unitType')schedule();},true);
  setTimeout(repaint,120);

  window.ddAuditTitleContext=function(brief,type){
    const titles=naturalTitles(brief,type),s=semantic(brief),forcedInvestigation=!hasInvestigativeIntent(brief)&&!isObservedOccurrence(brief)&&titles.some(t=>/investig|indag|bajo la lupa/i.test(t));
    const returnRegression=naturalTitles('los niños retornan a clases con alegría después de las vacaciones','Unidad de aprendizaje');
    return {
      topic:s.topic,place:s.place,goal:s.goal,titles,
      coherent:titles.length===3&&!forcedInvestigation,
      forcedInvestigation,
      regressions:{
        retornoClases:returnRegression.length===3&&!returnRegression.some(t=>/investig|bajo la lupa/i.test(t))&&returnRegression.every(t=>/clases/i.test(t))
      }
    };
  };
})();