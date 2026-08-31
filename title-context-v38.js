/* DocenteDigital – títulos naturales desde MCI v42
   Auditoría Maestra: el título no copia la instrucción del docente; expresa la intención pedagógica.
*/
(function(){
  if(window.__ddTitleContextV42)return;window.__ddTitleContextV42=true;
  const tidy=s=>String(s||'').replace(/\s+/g,' ').trim();
  const low=s=>tidy(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const cap=s=>{s=tidy(s);return s?s.charAt(0).toUpperCase()+s.slice(1):s;};
  const E=s=>typeof window.escapeHtml==='function'?window.escapeHtml(String(s||'')):String(s||'');
  const BAD=/\b(?:unidad|proyecto|sesión|sesion)\s+(?:sobre|de|acerca de)\b|\bquiero enseñar\b|\bquiero trabajar\b|\bnecesito una?\b/i;
  const INTEREST_PREFIX=/^(?:quiero|queremos|quieren|deseo|deseamos|desean)?\s*(?:saber|conocer|aprender|descubrir)\s+(?:más\s+)?(?:sobre|acerca de|de)\s+/i;

  function cleanTheme(value){
    let s=tidy(value);
    s=s.replace(/^(?:unidad|proyecto|sesión|sesion)\s+(?:sobre|de|acerca de)\s+/i,'');
    s=s.replace(INTEREST_PREFIX,'');
    s=s.replace(/^(?:el tema de|tema:)\s*/i,'');
    return tidy(s.replace(/[.!?]+$/,''));
  }
  function isSimpleInterest(raw){
    const s=tidy(raw);
    return INTEREST_PREFIX.test(s) && cleanTheme(s).split(/\s+/).length<=10 && !/\b(?:porque|para|debido|problema|necesidad|afecta|evitar|resolver|solucionar|proponer|hacer frente)\b/i.test(s);
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
  function observed(raw){const s=low(raw);return /\baparecieron?\b|\bencontramos\b|\bobservamos\b|\bvimos\b/.test(s);}
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

  function repaint(){
    const ta=document.getElementById('unitSituation'),box=document.querySelector('#ddIntentBox .dd-title-suggestions');if(!ta||!box||tidy(ta.value).length<3)return;
    const type=document.getElementById('unitType')?.value||'Unidad de aprendizaje',titles=naturalTitles(ta.value,type);
    box.innerHTML=titles.map(t=>`<button type="button" data-dd-title="${E(t)}">${E(t)}</button>`).join('');
  }
  let timer=0;const schedule=()=>{clearTimeout(timer);timer=setTimeout(repaint,220);};
  document.addEventListener('input',e=>{if(e.target?.id==='unitSituation')schedule();},true);
  document.addEventListener('change',e=>{if(e.target?.id==='unitType')schedule();},true);
  setTimeout(repaint,120);

  window.ddAuditTitleContext=function(brief,type){
    const titles=naturalTitles(brief,type),understood=mci(brief,type),forcedInvestigation=!investigative(brief)&&!observed(brief)&&understood.intentKind!=='indagación/curiosidad'&&!isSimpleInterest(brief)&&titles.some(t=>/investig|indag|bajo la lupa/i.test(t));
    const instrumentLeak=titles.some(t=>BAD.test(t));
    const distinct=new Set(titles.map(t=>low(t).replace(/[^a-z0-9ñ ]/g,' '))).size===titles.length;
    return{theme:understood.theme,topic:understood.theme,intentKind:understood.intentKind,finality:understood.finality,titles,coherent:titles.length===3&&!forcedInvestigation&&!instrumentLeak&&distinct,forcedInvestigation,instrumentLeak,distinct,simpleInterest:isSimpleInterest(brief)};
  };
})();