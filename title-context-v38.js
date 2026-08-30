/* DocenteDigital – coherencia temática de títulos v38
   Evita títulos genéricos que ignoran la idea/contexto ingresado por el docente. */
(function(){
  if(window.__ddTitleContextV38)return; window.__ddTitleContextV38=true;
  const tidy=s=>String(s||'').replace(/\s+/g,' ').trim();
  const lower=s=>tidy(s).toLowerCase();
  const cap=s=>{s=tidy(s);return s?s.charAt(0).toUpperCase()+s.slice(1):s;};
  const STOP=new Set('a al algo aprender aprendemos acerca con conocer conocemos de del desde el en estudiar exploramos investigar investigamos la las lo los mas más mi mis nuestro nuestra nuestros nuestras para por que queremos saber sobre su sus tema un una unos unas y'.split(' '));
  function rawTopic(brief){
    let s=tidy(brief);
    s=s.replace(/^(?:los\s+|las\s+)?(?:niños|niñas|estudiantes)\s+(?:quieren|desean|buscan)\s+(?:conocer|saber|aprender|investigar)(?:\s+m[aá]s)?\s+(?:acerca\s+de|sobre)?\s*/i,'');
    s=s.replace(/^(?:queremos|quiero|deseamos|deseo)\s+(?:conocer|saber|aprender|investigar)(?:\s+m[aá]s)?\s+(?:acerca\s+de|sobre)?\s*/i,'');
    s=s.replace(/^(?:conocer|saber|aprender|investigar|estudiar)(?:\s+m[aá]s)?\s+(?:acerca\s+de|sobre)?\s*/i,'');
    s=s.replace(/^(?:tema|inter[eé]s|idea)\s*[:\-]\s*/i,'');
    return tidy(s.replace(/[.!?]+$/,''))||tidy(brief);
  }
  function focusFor(brief){
    try{
      const m=typeof window.ddUnderstandPlanningDescription==='function'?window.ddUnderstandPlanningDescription(brief):null;
      const f=tidy(m?.focus||'');
      if(f&&f.toLowerCase()!=='la realidad descrita'&&f.toLowerCase()!=='la situación descrita'&&f.length<=100)return rawTopic(f);
    }catch(e){}
    return rawTopic(brief);
  }
  function significantWords(s){
    return lower(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9ñ\s]/g,' ').split(/\s+/).filter(w=>w.length>2&&!STOP.has(w));
  }
  function titleMentionsFocus(title,focus){
    const tw=significantWords(title),fw=significantWords(focus);
    if(!fw.length)return true;
    return fw.some(w=>tw.includes(w));
  }
  function explicitCommunity(brief){return /\bcomunidad(?:\s+campesina|\s+nativa)?\b/i.test(tidy(brief));}
  function ungroundedTerritorialAssumption(title,brief){return /\b(?:nuestra\s+comunidad|la\s+comunidad|saberes\s+de\s+(?:nuestra\s+)?comunidad|comunal(?:es)?)\b/i.test(tidy(title))&&!explicitCommunity(brief);}
  function neutralTitles(focus,type){
    const topic=tidy(focus)||'la situación planteada';
    const project=/proyecto/i.test(type||'');
    const initial=String(window.state?.level||'')==='Inicial';
    if(initial){
      if(project)return [
        `Descubrimos ${topic}: investigamos y creamos juntos`,
        `Pequeños investigadores de ${topic}: preguntamos, exploramos y compartimos`,
        `Nuestro proyecto sobre ${topic}: de la curiosidad a nuestros descubrimientos`
      ];
      return [
        `Descubrimos ${topic}`,
        `Exploramos ${topic}: observamos, preguntamos y aprendemos`,
        `Pequeños exploradores: conocemos ${topic}`
      ];
    }
    if(project)return [
      `Investigamos ${topic}: de nuestras preguntas a una respuesta con sentido`,
      `${cap(topic)} en acción: investigamos, creamos y compartimos`,
      `Un reto sobre ${topic}: aprendemos, decidimos y construimos una respuesta`
    ];
    return [
      `Exploramos ${topic}: observamos, preguntamos y aprendemos`,
      `${cap(topic)} bajo la lupa: investigamos para comprender mejor`,
      `Descubrimos ${topic}: de nuestras preguntas a nuevos aprendizajes`
    ];
  }
  const base=window.ddCreativeTitleOptions;
  window.ddCreativeTitleOptions=function(brief,type){
    const focus=focusFor(brief);
    let existing=[];
    try{existing=typeof base==='function'?(base(brief,type)||[]):[];}catch(e){}
    if(existing.length===3&&existing.every(t=>titleMentionsFocus(t,focus)&&!ungroundedTerritorialAssumption(t,brief)))return existing;
    return neutralTitles(focus,type);
  };
  window.ddContextualTitlePreview=function(brief,type){return neutralTitles(focusFor(brief),type);};
  function repaintLivePreview(){
    const ta=document.getElementById('unitSituation'),box=document.querySelector('#ddIntentBox .dd-title-suggestions');
    if(!ta||!box||tidy(ta.value).length<15)return;
    const type=document.getElementById('unitType')?.value||'Unidad de aprendizaje';
    const titles=window.ddContextualTitlePreview(ta.value,type);
    const esc=v=>typeof window.escapeHtml==='function'?window.escapeHtml(String(v||'')):String(v||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
    box.innerHTML=titles.map(t=>`<button type="button" data-dd-title="${esc(t)}">${esc(t)}</button>`).join('');
  }
  let previewTimer=0;
  const schedulePreview=()=>{clearTimeout(previewTimer);previewTimer=setTimeout(repaintLivePreview,340);};
  document.addEventListener('input',e=>{if(e.target?.id==='unitSituation')schedulePreview();},true);
  document.addEventListener('change',e=>{if(e.target?.id==='unitType')schedulePreview();},true);
  setTimeout(repaintLivePreview,80);
  window.ddAuditTitleContext=function(brief,type){
    const focus=focusFor(brief),titles=window.ddCreativeTitleOptions(brief,type);
    return {focus,titles,coherent:titles.length===3&&titles.every(t=>titleMentionsFocus(t,focus)&&!ungroundedTerritorialAssumption(t,brief))};
  };
})();