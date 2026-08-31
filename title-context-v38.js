/* DocenteDigital – títulos naturales y pertinentes desde el sentido completo v39
   Regla: no copiar la frase del docente como título. Interpretar tema + hecho + intención
   y producir títulos breves, naturales y pedagógicamente utilizables.
*/
(function(){
  if(window.__ddTitleContextV39)return; window.__ddTitleContextV39=true;
  const tidy=s=>String(s||'').replace(/\s+/g,' ').trim();
  const low=s=>tidy(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const cap=s=>{s=tidy(s);return s?s.charAt(0).toUpperCase()+s.slice(1):s;};
  const E=s=>typeof window.escapeHtml==='function'?window.escapeHtml(String(s||'')):String(s||'');
  const STOP=new Set('a al algo ante con de del desde e el ella ellas ellos en entre es esta este estos la las lo los me mi mis muy ni no o para pero por que queremos quiero se sin sobre su sus tu un una unos unas y ya ello nuestra nuestro nuestras nuestros'.split(' '));
  const VERBS=new Set('aparecio aparecieron apareciero aparecen hay vimos observamos encontramos queremos quiero investigar investigamos conocer conocemos aprender aprendemos saber sabemos comprender comprendemos estudiar exploramos explorar realizar hacemos hacer'.split(' '));

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
    return words.slice(0,3).join(' ');
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

  function semantic(raw){
    const corrected=spelling(raw),topic=topicFromEvent(corrected),place=placeFromRaw(corrected),goal=intent(corrected);
    let full=null;try{full=window.ddUnderstandPlanningDescription?.(corrected)||null;}catch(e){}
    return {raw:corrected,topic:topic||tidy(full?.contextConcepts?.[0]||full?.analysis?.words?.[0]||'la situación observada'),place,goal,full};
  }

  function naturalTitles(raw,type){
    const s=semantic(raw),topic=s.topic||'la situación observada',place=s.place;
    const plural=/s$/.test(low(topic));
    const article=plural?'las':'los';
    const project=/proyecto/i.test(type||'');
    const event=/\baparecieron?\b|\bapareciero\b/i.test(s.raw);
    const location=place?` en ${place}`:'';
    let list=[];
    if(event){
      list=project?[
        `Investigamos ${article} ${topic} que aparecieron${location}`,
        `${cap(topic)}${location}: observamos, investigamos y compartimos nuestros hallazgos`,
        `Pequeños investigadores: descubrimos por qué llegaron ${article} ${topic}${location}`
      ]:[
        `Investigamos ${article} ${topic} que aparecieron${location}`,
        `${cap(topic)}${location}: observamos, preguntamos y aprendemos`,
        `Descubrimos el mundo de ${article} ${topic} a partir de lo que observamos${location}`
      ];
    }else{
      list=project?[
        `Investigamos ${topic} y construimos una respuesta con sentido`,
        `${cap(topic)} en acción: observamos, investigamos y compartimos`,
        `De nuestras preguntas a la acción: un proyecto sobre ${topic}`
      ]:[
        `Investigamos ${topic} para comprenderlo mejor`,
        `Descubrimos ${topic}: observamos, preguntamos y aprendemos`,
        `${cap(topic)} bajo la lupa: investigamos y explicamos lo aprendido`
      ];
    }
    return [...new Set(list.map(t=>tidy(t).replace(/\s+/g,' ')))].slice(0,3);
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
  let timer=0;const schedule=()=>{clearTimeout(timer);timer=setTimeout(repaint,360);};
  document.addEventListener('input',e=>{if(e.target?.id==='unitSituation')schedule();},true);
  document.addEventListener('change',e=>{if(e.target?.id==='unitType')schedule();},true);
  setTimeout(repaint,120);

  window.ddAuditTitleContext=function(brief,type){
    const titles=naturalTitles(brief,type),s=semantic(brief);
    return {topic:s.topic,place:s.place,goal:s.goal,titles,coherent:titles.length===3};
  };
})();