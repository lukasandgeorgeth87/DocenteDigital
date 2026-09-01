/* DocenteDigital – títulos naturales desde MCI v45
   Auditoría Maestra: el título no copia la instrucción del docente; expresa la intención pedagógica.
   V45 normaliza observaciones breves sin convertir cuantificadores circunstanciales en el tema del título.
*/
(function(){
  if(window.__ddTitleContextV45)return;window.__ddTitleContextV45=true;
  const tidy=s=>String(s||'').replace(/\s+/g,' ').trim();
  const low=s=>tidy(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const cap=s=>{s=tidy(s);return s?s.charAt(0).toUpperCase()+s.slice(1):s;};
  const E=s=>typeof window.escapeHtml==='function'?window.escapeHtml(String(s||'')):String(s||'');
  const BAD=/\b(?:unidad|proyecto|sesión|sesion)\s+(?:sobre|de|acerca de)\b|\bquiero enseñar\b|\bquiero trabajar\b|\bnecesito una?\b/i;
  const INTEREST_PREFIX=/^(?:quiero|queremos|quieren|deseo|deseamos|desean)?\s*(?:saber|conocer|aprender|descubrir)\s+(?:más\s+)?(?:sobre|acerca de|de)\s+/i;
  const OBSERVATION_PREFIX=/^(?:(?:los|las)\s+estudiantes\s+|(?:los|las)\s+niñ(?:os|as)\s+)?(?:ven|vemos|veo|vieron|observan|observamos|observo|observaron|encuentran|encontramos|encontraron)\s+/i;
  const OBSERVATION_QUANTITY=/^(?:bastantes?|much[oa]s?|varios?|varias|algunos?|algunas|unos|unas)\s+/i;

  function cleanTheme(value){
    let s=tidy(value);
    s=s.replace(/^(?:unidad|proyecto|sesión|sesion)\s+(?:sobre|de|acerca de)\s+/i,'');
    s=s.replace(INTEREST_PREFIX,'');
    const wasObservation=OBSERVATION_PREFIX.test(s);
    s=s.replace(OBSERVATION_PREFIX,'');
    // Conservamos el hecho original en el perfil semántico; para el título evitamos
    // convertir cuantificadores circunstanciales ("bastantes", "muchas", etc.) en el tema.
    if(wasObservation)s=s.replace(OBSERVATION_QUANTITY,'');
    s=s.replace(/^(?:el tema de|tema:)\s*/i,'');
    return tidy(s.replace(/[.!?]+$/,''));
  }
  function isSimpleInterest(raw){
    const s=tidy(raw);
    return INTEREST_PREFIX.test(s) && cleanTheme(s).split(/\s+/).length<=10 && !/\b(?:porque|para|debido|problema|necesidad|afecta|evitar|resolver|solucionar|proponer|hacer frente)\b/i.test(s);
  }
  function isSimpleObservation(raw){
    const s=tidy(raw);
    return OBSERVATION_PREFIX.test(s) && cleanTheme(s).split(/\s+/).length<=12 && !/\b(?:porque|para|debido|problema|necesidad|afecta|evitar|resolver|solucionar|proponer|hacer frente|pregunt|quieren saber|queremos saber|curios)\b/i.test(s);
  }

  function mci(raw,type){
    try{
      if(typeof window.ddUnderstandUserIntent==='function'){
        const u=window.ddUnderstandUserIntent(raw,type)||{};
        return {...u,theme:cleanTheme(u.theme||raw)};
      }
    }catch(e){}
    return{raw:tidy(raw),theme:cleanTheme(raw),intentKind:'exploración/comprensión',finality:'',place:'',doNotCopyLiterally:BAD.test(raw)};
  }
  function investigative(raw){const s=low(raw);return /investig|indag|averigu|pregunt|quieren saber|queremos saber|curios/.test(s);}
  function observed(raw){const s=low(raw);return OBSERVATION_PREFIX.test(tidy(raw))||/\baparecieron?\b|\bencontramos\b|\bobservamos\b|\bvimos\b|\bvieron\b|\bven\b/.test(s);}
  function returnToSchool(raw){
    const s=low(raw);if(!/(retorn|regres|vuelv|volver)/.test(s)||!/(clase|escuela|colegio|institucion educativa|\bie\b)/.test(s))return null;
    const joy=/alegr|entusias|emocion|content/.test(s),vac=/vacacion/.test(s),m=joy?' con alegría':'',a=vac?' después de las vacaciones':'';
    return[`Volvemos a clases${m}${a}`,`Nos reencontramos${m} al volver a clases${a}`,`${vac?'Después de las vacaciones, ':''}regresamos a clases${m}`];
  }
  function seasonal(theme){
    if(!/primavera/i.test(theme))return null;
    return['Descubrimos los cambios que trae la primavera a nuestro entorno','¿Qué cambia en nuestro entorno cuando llega la primavera?','Conocemos y cuidamos la vida que florece durante la primavera'];
  }
  function titlesFromIntent(raw,type){
    const u=mci(raw,type),theme=tidy(u.theme)||'esta experiencia',kind=u.intentKind||'exploración/comprensión',goal=tidy(u.finality),project=/proyecto/i.test(type||u.document||'');
    const school=returnToSchool(raw);if(school)return school;
    const season=seasonal(theme);if(season)return season;
    if(isSimpleInterest(raw))return [`Descubrimos ${theme}`,`¿Qué queremos saber sobre ${theme}?`,`Exploramos ${theme} y compartimos lo aprendido`];
    if(isSimpleObservation(raw))return [`Observamos ${theme}`,`Conocemos más sobre ${theme}`,`Descubrimos ${theme} y compartimos lo aprendido`];
    let list=[];
    if(investigative(raw)||observed(raw)||kind==='indagación/curiosidad'){
      list=project?[`Investigamos ${theme} para responder nuestras preguntas`,`De nuestras preguntas a los hallazgos: exploramos ${theme}`,`Compartimos lo que descubrimos sobre ${theme}`]:[`Descubrimos ${theme} a partir de nuestras preguntas`,`Exploramos ${theme} para comprenderlo mejor`,`Lo que queremos saber sobre ${theme}`];
    }else if(kind==='aplicación/acción'||goal){
      const purpose=goal?` para ${goal}`:'';
      list=project?[`Aprendemos sobre ${theme}${purpose}`,`${cap(theme)} en acción: aprendemos, decidimos y actuamos`,`Ponemos en práctica lo aprendido sobre ${theme}`]:[`Aprendemos sobre ${theme}${purpose}`,`Ponemos en práctica nuestros aprendizajes sobre ${theme}`,`${cap(theme)}: aprendemos haciendo y explicamos lo logrado`];
    }else if(kind==='experiencia significativa'){
      list=[cap(theme),`Aprendemos a partir de ${theme}`,`Compartimos lo que vivimos y aprendemos en ${theme}`];
    }else if(kind==='valoración/contexto'){
      list=[`Valoramos y comprendemos ${theme}`,`Aprendemos de ${theme} y compartimos sus saberes`,`${cap(theme)}: saberes que fortalecen nuestros aprendizajes`];
    }else{
      list=[`Descubrimos ${theme} y construimos nuevos aprendizajes`,`Exploramos ${theme} desde nuestra experiencia`,`Comprendemos ${theme} y comunicamos lo aprendido`];
    }
    return list;
  }
  function naturalTitles(raw,type){
    return [...new Set(titlesFromIntent(raw,type).map(t=>tidy(t)).filter(t=>t&&!BAD.test(t)))].slice(0,3);
  }

  const previous=window.ddCreativeTitleOptions;
  window.ddCreativeTitleOptions=function(brief,type){
    const natural=naturalTitles(brief,type);let old=[];try{old=typeof previous==='function'?(previous(brief,type)||[]):[];}catch(e){}
    const merged=[...natural,...old].filter(t=>t&&!BAD.test(t)).filter((x,i,a)=>a.findIndex(y=>low(y)===low(x))===i);
    return merged.slice(0,6);
  };
  window.ddContextualTitlePreview=(brief,type)=>naturalTitles(brief,type);
  window.ddNaturalPlanningTitles=naturalTitles;

  let repainting=false;
  function repaint(force=false){
    if(repainting)return;
    const ta=document.getElementById('unitSituation'),box=document.querySelector('#ddIntentBox .dd-title-suggestions');
    if(!ta||!box||tidy(ta.value).length<3)return;
    const type=document.getElementById('unitType')?.value||'Unidad de aprendizaje',titles=naturalTitles(ta.value,type);
    const expected=titles.map(t=>tidy(t));
    const current=[...box.querySelectorAll('button')].map(b=>tidy(b.textContent));
    if(!force&&current.length===expected.length&&current.every((x,i)=>x===expected[i]))return;
    repainting=true;
    box.innerHTML=titles.map(t=>`<button type="button" data-dd-title="${E(t)}">${E(t)}</button>`).join('');
    box.dataset.ddNaturalTitles='1';
    repainting=false;
  }
  let timer=0;const schedule=(ms=120)=>{clearTimeout(timer);timer=setTimeout(()=>repaint(true),ms);};
  document.addEventListener('input',e=>{if(e.target?.id==='unitSituation')schedule();},true);
  document.addEventListener('change',e=>{if(e.target?.id==='unitType')schedule();},true);

  const observer=new MutationObserver(mutations=>{
    if(repainting)return;
    if(mutations.some(m=>m.target?.closest?.('#ddIntentBox .dd-title-suggestions')||m.target?.matches?.('#ddIntentBox .dd-title-suggestions')))schedule(0);
  });
  function armObserver(){
    const host=document.getElementById('ddIntentBox');
    if(host){observer.observe(host,{subtree:true,childList:true,characterData:true});repaint(true);}
  }
  setTimeout(armObserver,120);
  setTimeout(()=>repaint(true),450);

  window.ddAuditTitleContext=function(brief,type){
    const titles=naturalTitles(brief,type),understood=mci(brief,type),forcedInvestigation=!investigative(brief)&&!observed(brief)&&understood.intentKind!=='indagación/curiosidad'&&!isSimpleInterest(brief)&&titles.some(t=>/investig|indag|bajo la lupa/i.test(t));
    const instrumentLeak=titles.some(t=>BAD.test(t));
    const territorialLeak=!/\b(?:comunidad|caserío|caserio|anexo|barrio|ciudad|centro poblado)\b/i.test(brief)&&titles.some(t=>/\b(?:nuestra comunidad|la comunidad|del caserío|del caserio|del anexo|del barrio|de la ciudad|del centro poblado)\b/i.test(t));
    const distinct=new Set(titles.map(t=>low(t).replace(/[^a-z0-9ñ ]/g,' '))).size===titles.length;
    return{theme:understood.theme,topic:understood.theme,intentKind:understood.intentKind,finality:understood.finality,titles,coherent:titles.length===3&&!forcedInvestigation&&!instrumentLeak&&!territorialLeak&&distinct,forcedInvestigation,instrumentLeak,territorialLeak,distinct,simpleInterest:isSimpleInterest(brief),simpleObservation:isSimpleObservation(brief)};
  };
})();