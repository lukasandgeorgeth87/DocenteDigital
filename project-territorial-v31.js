/* DocenteDigital – coherencia territorial de Proyectos v31.1
   Evita asumir comunidad/familias cuando no fueron expresadas.
   No reescribe proyectos históricos emitidos, aprobados o archivados.
*/
(function(){
  if(window.__ddProjectTerritorialV31)return;window.__ddProjectTerritorialV31=true;
  if(typeof state!=='object')return;

  const tidy=s=>String(s||'').replace(/\s+/g,' ').trim();
  const low=s=>tidy(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const isProject=u=>/proyecto/i.test(String(u?.type||''));
  const isHistorical=u=>/emitid|aprobad|archivad|histor/.test(low(u?.status||u?.documentStatus||''));

  function contextEvidence(unit){
    const raw=low(unit?.situationBrief||unit?.planningMeaning?.raw||unit?.situation||'');
    const c=state.teacherContext||{};
    const locationType=tidy(c.locationType||c.placeType||'');
    return{
      raw,
      name:tidy(c.locationName||c.community||''),
      community:/\bcomunidad\b|\bcomunal\b|\bcomunitari[oa]s?\b/.test(raw)||/^Comunidad (campesina|nativa)$/i.test(locationType),
      family:/\bfamilia\b|\bfamilias\b|\bfamiliar\b|\bfamiliares\b|\bmadres?\b|\bpadres?\b|\babuel[oa]s?\b/.test(raw)
    };
  }

  function recipient(unit){
    const e=contextEvidence(unit);
    if(e.community){
      const community=e.name?`comunidad de ${e.name}`:'comunidad vinculada al proyecto';
      return e.family?`familias y ${community}`:community;
    }
    if(e.family)return'familias vinculadas a la situación';
    return'destinatarios vinculados al propósito del proyecto';
  }

  function isLegacyRecipient(value){
    const s=tidy(value);
    return /^familias, comunidad educativa y actores pertinentes de .+$/i.test(s)
      || /^familias, comunidad educativa y otros actores pertinentes del entorno$/i.test(s)
      || /^familias y comunidad de .+$/i.test(s)
      || /^familias y comunidad educativa$/i.test(s);
  }

  function isGeneratedSocialization(value){
    return /^El producto se comparte con .+; los estudiantes explican el proceso seguido, lo aprendido, las decisiones tomadas y evalúan el proyecto\.$/i.test(tidy(value));
  }

  function ensureDesign(unit){
    if(!isProject(unit)||isHistorical(unit))return false;
    const situation=unit.situation||unit.situationBrief||'la situación significativa seleccionada';
    const product=unit.product||'el producto final acordado';
    const rec=recipient(unit);
    let changed=false;
    if(!unit.projectDesign){
      unit.projectDesign={
        authenticProblem:`El proyecto parte de una situación, necesidad, oportunidad o problema auténtico del contexto que los estudiantes necesitan comprender y atender: ${unit.situationBrief||situation}`,
        studentVoice:'Los estudiantes participan en la planificación: expresan lo que saben, plantean preguntas, proponen qué necesitan averiguar, acuerdan tareas y asumen responsabilidades según sus posibilidades y grado.',
        actionPath:'Investigan, dialogan con fuentes pertinentes y, cuando corresponde, con personas vinculadas a la situación; toman decisiones, producen, prueban o revisan sus propuestas y mejoran el producto a partir de criterios y retroalimentación.',
        product:`Producto/solución con sentido: ${product}`,
        recipient:rec,
        socialization:`El producto se comparte con ${rec}; los estudiantes explican el proceso seguido, lo aprendido, las decisiones tomadas y evalúan el proyecto.`,
        phases:[
          '1. Identificamos y comprendemos el problema o desafío.',
          '2. Planificamos con participación de los estudiantes: qué sabemos, qué necesitamos saber, qué haremos, cómo nos organizaremos y qué producto construiremos.',
          '3. Investigamos y desarrollamos acciones desde las áreas y saberes del contexto.',
          '4. Construimos, revisamos y mejoramos el producto o solución.',
          '5. Socializamos el producto y evaluamos el proceso y los aprendizajes.'
        ]
      };
      changed=true;
    }else{
      const d=unit.projectDesign;
      if(isLegacyRecipient(d.recipient)){
        d.recipient=rec;
        changed=true;
      }
      const beforeAction=String(d.actionPath||'');
      const afterAction=beforeAction
        .replace(/fuentes y personas de la comunidad/gi,'fuentes pertinentes y, cuando corresponde, personas vinculadas a la situación')
        .replace(/fuentes y personas pertinentes del entorno/gi,'fuentes pertinentes y, cuando corresponde, personas vinculadas a la situación');
      if(afterAction!==beforeAction){d.actionPath=afterAction;changed=true;}
      if(isGeneratedSocialization(d.socialization)){
        const next=`El producto se comparte con ${rec}; los estudiantes explican el proceso seguido, lo aprendido, las decisiones tomadas y evalúan el proyecto.`;
        if(next!==d.socialization){d.socialization=next;changed=true;}
      }
    }
    if(changed&&typeof save==='function')save();
    return changed;
  }

  const baseRender=window.renderUnitOutput;
  if(typeof baseRender==='function')window.renderUnitOutput=function(unit){ensureDesign(unit);return baseRender.apply(this,arguments);};
  const baseWord=window.unitWordHtml;
  if(typeof baseWord==='function')window.unitWordHtml=function(unit){ensureDesign(unit);return baseWord.apply(this,arguments);};

  // Solo corrige borradores/proyectos no históricos y únicamente patrones legado conocidos.
  (state.units||[]).forEach(ensureDesign);
  window.ddAuditProjectTerritorial=function(unit){
    const d=unit?.projectDesign||{};
    const e=contextEvidence(unit);
    const text=[d.recipient,d.actionPath,d.socialization].filter(Boolean).join(' ');
    const unauthorizedFamily=!e.family&&/\bfamilia\b|\bfamilias\b/i.test(text);
    const unauthorizedCommunity=!e.community&&/\bcomunidad\b|\bcomunal\b|\bcomunitari[oa]s?\b/i.test(text);
    return{pass:!unauthorizedFamily&&!unauthorizedCommunity,historical:isHistorical(unit),unauthorizedFamily,unauthorizedCommunity};
  };
})();