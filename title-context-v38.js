/* DocenteDigital – títulos naturales desde MCI v48
   Auditoría Maestra: el título no copia la instrucción del docente; expresa la intención pedagógica.
   V46 normaliza enunciados de desempeño breves como "Describen/Decriben..." para no copiarlos literalmente en el título.
   V47 normaliza observaciones con “aparece/aparecieron” para evitar títulos como “Descubrimos aparecieron hormigas”.
   V48 alinea el detector y el limpiador de observaciones incorporando “vimos”, ya reconocido por observed().
*/
(function(){
  if(window.__ddTitleContextV48)return;window.__ddTitleContextV48=true;
  const tidy=s=>String(s||'').replace(/\s+/g,' ').trim();
  const low=s=>tidy(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const cap=s=>{s=tidy(s);return s?s.charAt(0).toUpperCase()+s.slice(1):s;};
  const E=s=>typeof window.escapeHtml==='function'?window.escapeHtml(String(s||'')):String(s||'');
  const BAD=/\b(?:unidad|proyecto|sesión|sesion)\s+(?:sobre|de|acerca de)\b|\bquiero enseñar\b|\bquiero trabajar\b|\bnecesito una?\b/i;
  const INTEREST_PREFIX=/^(?:quiero|queremos|quieren|deseo|deseamos|desean)?\s*(?:saber|conocer|aprender|descubrir)\s+(?:más\s+)?(?:sobre|acerca de|de)\s+/i;
  const OBSERVATION_PREFIX=/^(?:(?:los|las)\s+estudiantes\s+|(?:los|las)\s+niñ(?:os|as)\s+)?(?:ven|vemos|veo|vimos|vieron|observan|observamos|observo|observaron|encuentran|encontramos|encontraron|aparece|aparecen|apareció|aparecio|aparecieron)\s+/i;
  const OBSERVATION_QUANTITY=/^(?:bastantes?|much[oa]s?|varios?|varias|algunos?|algunas|unos|unas)\s+/i;
  const DESCRIPTION_PREFIX=/^(?:(?:los|las)\s+estudiantes\s+|(?:los|las)\s+niñ(?:os|as)\s+)?(?:describen|decriben|describir|describimos|describo)\s+/i;

  function ddPedagogicalTheme(raw,baseTheme){
    const s=low(raw),theme=tidy(baseTheme||raw);
    if(/(?:arrojan|botan|tiran|dejan|echan).{0,35}(?:basura|residuos?)|(?:basura|residuos?).{0,35}(?:piso|suelo|patio|aula|calle|espacio)/.test(s)) return 'el manejo de residuos y el cuidado de los espacios comunes';
    if(/desperdici|malgast/.test(s)&&/agua/.test(s)) return 'el uso responsable y el cuidado del agua';
    if(/contaminacion|contaminan|contaminado/.test(s)&&/(residu|basura|ambiente|suelo|agua)/.test(s)) return 'la contaminación y el cuidado del ambiente';
    if(/bullying|acoso|agresion|agresión|maltrato/.test(s)) return 'la convivencia respetuosa y la prevención de situaciones de violencia';
    if(/mamifer/.test(s)) return 'los mamíferos y sus características';
    return theme;
  }

  function ddLevelProblemTitles(raw,type){
    const s=low(raw),level=(window.state?.level||'Primaria'),project=/proyecto/i.test(type||'');
    const waste=/(?:arrojan|botan|tiran|dejan|echan).{0,35}(?:basura|residuos?)|(?:basura|residuos?).{0,35}(?:piso|suelo|patio|aula|calle|espacio)/.test(s);
    if(!waste)return null;
    if(level==='Inicial')return [
      'Cada residuo en su lugar: aprendemos a cuidar nuestros espacios',
      'Pequeños guardianes: clasificamos residuos y cuidamos donde jugamos',
      '¿Dónde va cada residuo? Exploramos, clasificamos y cuidamos'
    ];
    if(level==='Secundaria')return project?[
      'Residuos y convivencia: investigamos nuestras prácticas y proponemos mejoras',
      'Del problema a la acción: transformamos el manejo de residuos en nuestra institución',
      '¿Qué hacemos con nuestros residuos? Analizamos evidencias y diseñamos soluciones'
    ]:[
      'Residuos y convivencia: analizamos prácticas y proponemos mejoras',
      '¿Qué hacemos con nuestros residuos? Analizamos evidencias y tomamos decisiones',
      'Manejo de residuos bajo análisis: comprendemos el problema y planteamos alternativas'
    ];
    return project?[
      'Cada residuo en su lugar: investigamos y mejoramos nuestros espacios',
      'Menos residuos en el piso, más cuidado entre todos',
      'Guardianes de nuestros espacios: observamos, proponemos y actuamos'
    ]:[
      'Cada residuo en su lugar: comprendemos y cuidamos nuestros espacios',
      '¿Qué pasa con nuestros residuos? Observamos, analizamos y proponemos',
      'Cuidamos nuestros espacios: aprendemos a manejar mejor los residuos'
    ];
  }

  function cleanTheme(value){
    let s=tidy(value);
    s=s.replace(/^(?:unidad|proyecto|sesión|sesion)\s+(?:sobre|de|acerca de)\s+/i,'');
    s=s.replace(INTEREST_PREFIX,'');
    const wasObservation=OBSERVATION_PREFIX.test(s);
    s=s.replace(OBSERVATION_PREFIX,'');
    if(wasObservation)s=s.replace(OBSERVATION_QUANTITY,'');
    s=s.replace(DESCRIPTION_PREFIX,'');
    s=s.replace(/^(?:en|dentro de)\s+(?:nuestra|la|mi|su)\s+(?:comunidad|localidad|barrio|anexo|centro poblado)\s+(?:encontramos|observamos|vemos|hay|existen|se encuentran|aparecen)\s+/i,'');
    s=s.replace(/^(?:en|dentro de)\s+(?:la\s+)?comunidad\s+(?:de\s+[\p{L}'’ -]+?\s+)?(?:encontramos|observamos|vemos|hay|existen|se encuentran|aparecen)\s+/iu,'');
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
  function isSimpleDescription(raw){
    const s=tidy(raw);
    return DESCRIPTION_PREFIX.test(s) && cleanTheme(s).split(/\s+/).length<=12 && !/\b(?:porque|para|debido|problema|necesidad|afecta|evitar|resolver|solucionar|proponer|hacer frente)\b/i.test(s);
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
  function titleLevel(){
    try{return (typeof state!=='undefined'&&state.level)||'Primaria';}catch(e){return 'Primaria';}
  }

  function semanticIssue(raw,theme){
    const s=low(raw+' '+theme);
    if(/\b(?:basura|residu|recicl|desperdicio)\b/.test(s)&&/\b(?:arrojan?|botan?|tiran?|dejan?|piso|suelo|acumulan?|contamin|manejo|separ|recicl)\b/.test(s)){
      return {key:'waste',theme:'la gestión responsable de los residuos y el cuidado de los espacios comunes'};
    }
    if(/\b(?:desperdici|malgast|derroch)\w*\s+(?:el\s+)?agua\b|\bagua\b.*\b(?:desperdici|malgast|derroch)\w*/.test(s)){
      return {key:'water',theme:'el uso responsable del agua'};
    }
    if(/\b(?:pele|agred|insult|acoso|bullying|conflict|no\s+respet)\w*/.test(s)){
      return {key:'coexistence',theme:'la convivencia, el respeto y la resolución pacífica de conflictos'};
    }
    if(/\b(?:aliment|comida\s+chatarra|nutric|lonchera)\b/.test(s)){
      return {key:'nutrition',theme:'la alimentación saludable y las decisiones que favorecen nuestro bienestar'};
    }
    if(/\b(?:redes\s+sociales|celular|telefono|internet)\b/.test(s)&&/\b(?:exces|mal\s+uso|riesgo|adic|distrac)\w*/.test(s)){
      return {key:'digital',theme:'el uso responsable y seguro de la tecnología'};
    }
    if(/\b(?:pinturas?\s+rupestres?|arte\s+rupestre|petroglif|restos?\s+arqueol[oó]gic|sitios?\s+arqueol[oó]gic|patrimonio\s+arqueol[oó]gic)\b/.test(s)){
      return {key:'heritage',theme:'las pinturas rupestres y el patrimonio arqueológico local'};
    }
    return null;
  }

  function clauseLike(theme){
    const t=low(theme);
    return /^(?:se\s+)?(?:arrojan?|botan?|tiran?|dejan?|usan?|hacen?|tienen?|quieren?|comen?|juegan?|pelean?|contaminan?|desperdician?|malgastan?|usan?|llegan?|faltan?|rompen?|gritan?|copian?|votan?|cuidan?|maltratan?)\b/.test(t);
  }

  function issueTitles(issue,type,level){
    const project=/proyecto/i.test(type||'');
    if(issue.key==='waste'){
      if(level==='Inicial')return [
        'Cada residuo en su lugar: cuidamos nuestros espacios',
        '¿Dónde va la basura? Descubrimos y aprendemos a cuidar',
        'Pequeñas acciones para mantener limpio nuestro entorno'
      ];
      if(level==='Secundaria')return project ? [
        'Del residuo a la acción: investigamos y transformamos nuestros espacios',
        'Basura en el piso: analizamos causas y proponemos soluciones sostenibles',
        'Espacios limpios, decisiones responsables: actuamos frente a los residuos'
      ] : [
        'Residuos y convivencia: analizamos cómo nuestras decisiones afectan los espacios comunes',
        'Del problema a la solución: comprendemos la gestión responsable de los residuos',
        'Espacios limpios, decisiones responsables: investigamos y proponemos mejoras'
      ];
      return project ? [
        'Menos basura, más cuidado: investigamos y mejoramos nuestros espacios',
        'Basura en el piso: observamos, comprendemos y actuamos',
        'Cuidamos nuestra escuela: proponemos soluciones para manejar mejor los residuos'
      ] : [
        'Cuidamos nuestros espacios: aprendemos a manejar responsablemente los residuos',
        'Basura en el piso: observamos, pensamos y proponemos soluciones',
        'Menos residuos, más cuidado: aprendemos a convivir en un ambiente limpio'
      ];
    }
    if(issue.key==='water'){
      if(level==='Secundaria')return [
        'Cada gota cuenta: analizamos el uso del agua y tomamos decisiones responsables',
        'Agua y sostenibilidad: investigamos prácticas de uso y cuidado',
        'Del consumo a la conciencia: proponemos un uso responsable del agua'
      ];
      if(level==='Inicial')return ['El agua es vida: aprendemos a cuidarla','Cada gotita cuenta','Jugamos, descubrimos y cuidamos el agua'];
      return ['Cada gota cuenta: aprendemos a cuidar el agua','Guardianes del agua: observamos, comprendemos y actuamos','El agua en nuestra vida: usamos y cuidamos con responsabilidad'];
    }
    if(issue.key==='coexistence'){
      if(level==='Secundaria')return ['Convivir también se aprende: analizamos conflictos y construimos acuerdos','Del conflicto al diálogo: comprendemos, decidimos y actuamos','Respeto y convivencia: proponemos formas pacíficas de resolver desacuerdos'];
      if(level==='Inicial')return ['Nos tratamos con cariño y respeto','Aprendemos a jugar y convivir juntos','Hablamos, escuchamos y resolvemos juntos'];
      return ['Convivimos mejor cuando dialogamos y respetamos','Del conflicto al acuerdo: aprendemos a resolver problemas juntos','Construimos acuerdos para convivir con respeto'];
    }
    if(issue.key==='nutrition'){
      if(level==='Secundaria')return ['Decisiones que alimentan: analizamos hábitos y construimos bienestar','Alimentación y salud: comprendemos para decidir mejor','Lo que elegimos comer importa: investigamos y proponemos hábitos saludables'];
      if(level==='Inicial')return ['Alimentos que nos ayudan a crecer','Descubrimos sabores que cuidan nuestro cuerpo','Comemos variado para crecer fuertes'];
      return ['Elegimos alimentos que cuidan nuestra salud','Comer bien para vivir mejor: aprendemos y decidimos','Nuestra alimentación bajo la lupa: observamos y mejoramos hábitos'];
    }
    if(issue.key==='digital'){
      if(level==='Secundaria')return ['Conectados con criterio: analizamos el uso responsable de la tecnología','Pantallas, decisiones y bienestar: comprendemos riesgos y oportunidades','Tecnología con propósito: construimos hábitos digitales responsables'];
      return ['Usamos la tecnología con responsabilidad','Pantallas con propósito: aprendemos a decidir mejor','Cuidamos nuestro tiempo y seguridad al usar tecnología'];
    }
    if(issue.key==='heritage'){
      if(level==='Inicial')return [
        'Huellas del pasado: descubrimos formas y colores en las pinturas rupestres',
        'Pequeños exploradores de las huellas antiguas',
        '¿Qué descubrimos en las pinturas de las rocas?'
      ];
      if(level==='Secundaria')return project ? [
        'Huellas del pasado, preguntas del presente: investigamos nuestro patrimonio arqueológico',
        'Arte rupestre y memoria del territorio: analizamos evidencias y comunicamos hallazgos',
        'Patrimonio bajo investigación: interpretamos evidencias de las pinturas rupestres'
      ] : [
        'Pinturas rupestres y memoria del territorio: analizamos evidencias del pasado',
        'Patrimonio arqueológico local: interpretamos, contrastamos y explicamos',
        'Huellas del pasado: estudiamos las pinturas rupestres con evidencias'
      ];
      return project ? [
        'Huellas del pasado en nuestra comunidad: investigamos las pinturas rupestres',
        'Pinturas rupestres: descubrimos qué nos cuentan sobre nuestro patrimonio',
        'Guardianes de nuestra memoria: conocemos y valoramos el patrimonio arqueológico local'
      ] : [
        'Huellas del pasado: conocemos las pinturas rupestres de nuestro entorno',
        'Pinturas rupestres: observamos, preguntamos y buscamos explicaciones',
        'Nuestro patrimonio arqueológico: descubrimos, comprendemos y valoramos'
      ];
    }
    return [];
  }

  function titlesFromIntent(raw,type){
    const u=mci(raw,type),baseTheme=tidy(u.theme)||'esta experiencia',kind=u.intentKind||'exploración/comprensión',goal=tidy(u.finality),project=/proyecto/i.test(type||u.document||''),level=titleLevel();
    const issue=semanticIssue(raw,baseTheme);
    if(issue)return issueTitles(issue,type,level);

    const theme=baseTheme;
    const school=returnToSchool(raw);if(school)return school;
    const season=seasonal(theme);if(season)return season;

    if(clauseLike(theme)){
      if(level==='Secundaria')return project?[
        'Una situación de nuestro entorno bajo investigación: analizamos, explicamos y proponemos',
        'Del problema a la acción: construimos respuestas sustentadas',
        'Comprender para transformar: investigamos una situación cercana'
      ]:[
        'Una situación que nos interpela: analizamos causas, consecuencias y alternativas',
        'Comprender para decidir: estudiamos una situación de nuestro entorno',
        'Del análisis a la propuesta: construimos respuestas sustentadas'
      ];
      if(level==='Inicial')return ['Descubrimos lo que ocurre a nuestro alrededor','Observamos, conversamos y buscamos respuestas','Aprendemos a cuidar y convivir mejor'];
      return ['Observamos lo que ocurre y buscamos explicaciones','Comprendemos una situación de nuestro entorno y proponemos mejoras','Aprendemos para actuar: pensamos, dialogamos y proponemos'];
    }

    if(level==='Secundaria'){
      if(isSimpleInterest(raw))return [
        `${cap(theme)} bajo la lupa: preguntas para comprender mejor`,
        `Exploramos ${theme} con evidencias y nuevas preguntas`,
        `Comprender ${theme}: del interés inicial a una explicación sustentada`
      ];
      if(isSimpleObservation(raw))return [
        `Lo que observamos nos plantea preguntas: analizamos ${theme}`,
        `De la observación a la explicación: comprendemos ${theme}`,
        `${cap(theme)}: interpretamos evidencias y construimos conclusiones`
      ];
      if(investigative(raw)||observed(raw)||kind==='indagación/curiosidad')return project?[
        `Investigamos ${theme}: de las preguntas a las evidencias`,
        `Bajo la lupa: analizamos ${theme} y construimos explicaciones`,
        `Comprender para comunicar: presentamos hallazgos sobre ${theme}`
      ]:[
        `${cap(theme)}: analizamos evidencias para comprenderlo mejor`,
        `Preguntar, contrastar y explicar: estudiamos ${theme}`,
        `De las ideas iniciales a las conclusiones: comprendemos ${theme}`
      ];
      if(kind==='aplicación/acción'||goal)return project?[
        `${cap(theme)} en acción: analizamos, decidimos y proponemos`,
        `Comprender para actuar: construimos respuestas frente a ${theme}`,
        `Del análisis a la propuesta: aplicamos lo aprendido sobre ${theme}`
      ]:[
        `Comprender para decidir: analizamos ${theme}`,
        `${cap(theme)} y toma de decisiones: aplicamos lo aprendido`,
        `Del conocimiento a la acción: resolvemos situaciones vinculadas con ${theme}`
      ];
      return [
        `${cap(theme)}: comprendemos relaciones, causas y consecuencias`,
        `Miradas sobre ${theme}: analizamos, contrastamos y explicamos`,
        `Comprender ${theme}: construimos explicaciones y las sustentamos`
      ];
    }

    if(level==='Inicial'){
      if(isSimpleInterest(raw))return [`Descubrimos ${theme}`,`¿Qué queremos saber sobre ${theme}?`,`Exploramos ${theme} jugando y conversando`];
      if(isSimpleObservation(raw))return [`Observamos ${theme}`,`¿Qué descubrimos al mirar ${theme}?`,`Exploramos ${theme} y contamos lo que vemos`];
      return [`Pequeños exploradores de ${theme}`,`Descubrimos ${theme} con nuestros sentidos`,`Jugamos, observamos y aprendemos sobre ${theme}`];
    }

    if(isSimpleInterest(raw))return [`Descubrimos ${theme}`,`¿Qué queremos saber sobre ${theme}?`,`Exploramos ${theme} y compartimos lo aprendido`];
    if(isSimpleObservation(raw))return [`Observamos ${theme}`,`Conocemos más sobre ${theme}`,`Descubrimos ${theme} y compartimos lo aprendido`];
    if(isSimpleDescription(raw))return [`Conocemos ${theme}`,`Describimos ${theme} con nuestras propias palabras`,`Comprendemos ${theme} y explicamos lo aprendido`];

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
      if(level==='Inicial'){
        list=['Exploramos '+theme+' con curiosidad','Jugamos y descubrimos más sobre '+theme,'¿Qué podemos descubrir sobre '+theme+'?'];
      }else if(level==='Secundaria'){
        list=project
          ? [cap(theme)+': investigamos, contrastamos y construimos una propuesta','Del análisis a la acción: trabajamos '+theme,'Preguntas, evidencias y propuestas sobre '+theme]
          : [cap(theme)+' bajo análisis: comprendemos, contrastamos y explicamos','Comprendemos '+theme+': evidencias para construir explicaciones','Analizamos '+theme+' y sustentamos nuestras conclusiones'];
      }else{
        list=project
          ? ['Investigamos '+theme+' y construimos una respuesta con sentido',cap(theme)+' en acción: observamos, explicamos y proponemos','De nuestras preguntas a una propuesta sobre '+theme]
          : ['Descubrimos '+theme+' a partir de preguntas y evidencias','Comprendemos '+theme+' y explicamos lo aprendido','Exploramos '+theme+' para usar lo aprendido en nuevas situaciones'];
      }
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
    return{theme:understood.theme,topic:understood.theme,intentKind:understood.intentKind,finality:understood.finality,titles,coherent:titles.length===3&&!forcedInvestigation&&!instrumentLeak&&!territorialLeak&&distinct,forcedInvestigation,instrumentLeak,territorialLeak,distinct,simpleInterest:isSimpleInterest(brief),simpleObservation:isSimpleObservation(brief),simpleDescription:isSimpleDescription(brief)};
  };
})();