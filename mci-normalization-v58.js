/* DocenteDigital – MCI normalización v58
   Refuerza el Motor de Comprensión de Intención antes de los generadores.
   Corrige: instrucción ≠ tema, errores ortográficos de alta confianza y tema ≠ finalidad.
*/
(function(){
  if(window.__ddMciNormalizationV58)return;window.__ddMciNormalizationV58=true;
  const tidy=v=>String(v??'').replace(/\s+/g,' ').trim();
  const low=v=>tidy(v).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const cap=v=>{v=tidy(v);return v?v[0].toUpperCase()+v.slice(1):v;};
  const BAD=/\b(?:unidad|proyecto|sesión|sesion)\s+(?:sobre|de|acerca de)\b|\bquiero enseñar\b|\bquiero trabajar\b/i;

  function normalize(raw){
    return tidy(raw)
      .replace(/\bsovre\b/gi,'sobre')
      .replace(/\bprimabera\b/gi,'primavera')
      .replace(/\bmaripozas\b/gi,'mariposas')
      .replace(/\bavejas\b/gi,'abejas')
      .replace(/\b(?:bio\s*guerto|bioguerto)\b/gi,'biohuerto')
      .replace(/\bapareciero\b/gi,'aparecieron');
  }
  function documentType(raw,typeHint=''){
    const s=low(raw+' '+typeHint);if(/\bproyecto\b/.test(s))return'Proyecto de aprendizaje';if(/\bsesion\b/.test(s))return'Sesión de aprendizaje';return'Unidad de aprendizaje';
  }
  function stripScaffold(raw){
    let s=normalize(raw).replace(/[.!?]+$/,'');
    s=s.replace(/^(?:por favor\s+)?(?:quiero|quisiera|necesito|deseo|hazme|haz|crea|crear|prepara|preparar|elabora|elaborar|realiza|realizar)\s+/i,'');
    s=s.replace(/^(?:una?|el|la)?\s*(?:unidad(?:\s+de\s+aprendizaje)?|proyecto(?:\s+de\s+aprendizaje)?|sesión(?:\s+de\s+aprendizaje)?|sesion(?:\s+de\s+aprendizaje)?)\b\s*(?:(?:sobre|acerca\s+de|de|para\s+trabajar|con|:)\s*)?/i,'');
    s=s.replace(/^(?:trabajar|enseñar|ensenar|conocer|aprender|abordar|ver|fortalecer)\s+(?:sobre\s+|acerca\s+de\s+|de\s+)?/i,'');
    s=s.replace(/^(?:mis|los|las)?\s*(?:niños|ninos|niñas|ninas|estudiantes)\s+(?:quieren|desean|necesitan)\s+(?:saber|conocer|aprender)\s+(?:sobre\s+|acerca\s+de\s+|de\s+)?/i,'');
    return tidy(s);
  }
  function finality(raw){
    const s=normalize(raw),patterns=[
      /(?:estos conocimientos|estos saberes|lo aprendido)\s+(?:los?\s+)?aplicaremos\s+(?:para\s+|en\s+)(.+?)(?=[.;!?]|$)/i,
      /(?:aplicar|usaremos|utilizaremos)\s+(?:lo aprendido|estos conocimientos|estos saberes)?\s*(?:para\s+|en\s+)(.+?)(?=[.;!?]|$)/i,
      /(?:con el fin de|con la finalidad de|para después|para luego|para posteriormente)\s+(.+?)(?=[.;!?]|$)/i,
      /\bpara\s+(.+?)(?=[.;!?]|$)/i
    ];
    for(const p of patterns){const m=s.match(p);if(m&&tidy(m[1]).length>=3)return tidy(m[1]);}return'';
  }
  function theme(raw){
    let s=stripScaffold(raw);
    s=s.split(/\b(?:y\s+estos\s+conocimientos|y\s+estos\s+saberes|y\s+lo\s+aprendido|para\s+después|para\s+luego|para\s+posteriormente|con\s+el\s+fin\s+de|con\s+la\s+finalidad\s+de)\b/i)[0];
    s=s.split(/\b(?:sin embargo|pero|aunque)\b/i)[0];
    s=s.replace(/^(?:los|las)?\s*(?:niños|ninos|niñas|ninas|estudiantes)\s+/i,'');
    s=s.replace(/^(?:quieren|desean|necesitan)\s+(?:saber|conocer|aprender)\s+(?:sobre\s+|de\s+)?/i,'');
    return tidy(s)||'la situación descrita';
  }
  function kind(raw){const s=low(normalize(raw));if(/investig|indag|averigu|pregunt|quieren saber|curios/.test(s))return'indagación/curiosidad';if(/aplicar|implementar|construir|sembrar|crear|elaborar|organizar|mejorar|resolver/.test(s))return'aplicación/acción';if(/valorar|tradicion|costumbre|identidad|saberes/.test(s))return'valoración/contexto';if(/retorn|regres|vuelv|vacacion|celebr|alegr|encuentro/.test(s))return'experiencia significativa';return'exploración/comprensión';}
  function actors(raw){const out=[],s=normalize(raw);['estudiantes','niños','niñas','familias','madres','padres','abuelos','abuelas','yachaq','productores','autoridades','docentes'].forEach(a=>{if(new RegExp('\\b'+a+'\\b','i').test(s))out.push(a);});return out;}

  const baseUnderstand=window.ddUnderstandUserIntent;
  function understand(raw,typeHint=''){
    const corrected=normalize(raw),base=(()=>{try{return typeof baseUnderstand==='function'?(baseUnderstand(corrected,typeHint)||{}):{};}catch(e){return{};}})();
    const t=theme(corrected),f=finality(corrected);return{...base,raw:tidy(raw),normalizedRaw:corrected,document:documentType(corrected,typeHint),theme:t,finality:f,intentKind:kind(corrected),actors:actors(corrected),instrumentalExpression:BAD.test(corrected)||/^\s*(?:unidad|proyecto|sesión|sesion)\b/i.test(corrected),doNotCopyLiterally:true,sufficient:t.length>=3,normalizationApplied:corrected!==tidy(raw)};
  }
  window.ddUnderstandUserIntent=understand;

  const baseInfer=window.ddInferPlanningIntent;
  window.ddInferPlanningIntent=function(raw,typeHint=''){
    const corrected=normalize(raw),base=(()=>{try{return typeof baseInfer==='function'?(baseInfer(corrected,typeHint)||{}):{};}catch(e){return{};}})(),m=understand(raw,typeHint);
    return{...base,raw:tidy(raw),focus:m.theme,goal:m.finality||base.goal||'',orientation:m.finality?'meta explícita':m.intentKind,actors:m.actors,mci:m,summary:m.finality?`El docente quiere trabajar ${m.theme} con la finalidad de ${m.finality}.`:`El eje principal es ${m.theme}; la planificación debe responder a ${m.intentKind}.`};
  };

  function titleSet(raw,type){
    const m=understand(raw,type),t=m.theme,g=m.finality,project=/proyecto/i.test(type||m.document||'');let list=[];
    if(/primavera/i.test(t))list=['Descubrimos los cambios que trae la primavera a nuestro entorno','¿Qué cambia en nuestro entorno cuando llega la primavera?','Conocemos y cuidamos la vida que florece durante la primavera'];
    else if(m.intentKind==='indagación/curiosidad')list=project?[`Investigamos ${t} para responder nuestras preguntas`,`De nuestras preguntas a los hallazgos: exploramos ${t}`,`Compartimos lo que descubrimos sobre ${t}`]:[`Descubrimos ${t} a partir de nuestras preguntas`,`Exploramos ${t} para comprenderlo mejor`,`Lo que queremos saber sobre ${t}`];
    else if(m.intentKind==='aplicación/acción'||g)list=[`Aprendemos sobre ${t}${g?` para ${g}`:''}`,`Ponemos en práctica nuestros aprendizajes sobre ${t}`,`${cap(t)}: aprendemos haciendo y explicamos lo logrado`];
    else if(m.intentKind==='valoración/contexto')list=[`Valoramos y comprendemos ${t}`,`Aprendemos de ${t} y compartimos sus saberes`,`${cap(t)}: saberes que fortalecen nuestros aprendizajes`];
    else if(m.intentKind==='experiencia significativa')list=[cap(t),`Aprendemos a partir de ${t}`,`Compartimos lo que vivimos y aprendemos en ${t}`];
    else list=[`Descubrimos ${t} y construimos nuevos aprendizajes`,`Exploramos ${t} desde nuestra experiencia`,`Comprendemos ${t} y comunicamos lo aprendido`];
    return [...new Set(list.map(tidy).filter(x=>x&&!BAD.test(x)))].slice(0,3);
  }
  window.ddIntentTitleOptions=titleSet;
  const oldCreative=window.ddCreativeTitleOptions;
  window.ddCreativeTitleOptions=function(raw,type){let old=[];try{old=typeof oldCreative==='function'?(oldCreative(normalize(raw),type)||[]):[];}catch(e){}const fresh=titleSet(raw,type);return[...fresh,...old].filter(x=>x&&!BAD.test(x)).filter((x,i,a)=>a.findIndex(y=>low(y)===low(x))===i).slice(0,6);};
  window.ddMCI={normalize,stripScaffold,theme,finality,understand,titleSet};
})();