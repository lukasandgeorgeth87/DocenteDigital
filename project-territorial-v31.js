/* DocenteDigital – coherencia territorial de Proyectos v31
   Evita que la ruta de Proyecto asuma que toda IE pertenece a una comunidad rural.
*/
(function(){
  if(window.__ddProjectTerritorialV31)return;window.__ddProjectTerritorialV31=true;
  if(typeof state!=='object')return;

  const isProject=u=>/proyecto/i.test(String(u?.type||''));
  function recipient(){
    const c=state.teacherContext||{};
    const name=String(c.locationName||c.community||'').trim();
    return name
      ? `familias, comunidad educativa y actores pertinentes de ${name}`
      : 'familias, comunidad educativa y otros actores pertinentes del entorno';
  }
  function ensureDesign(unit){
    if(!isProject(unit))return;
    const situation=unit.situation||unit.situationBrief||'la situación significativa seleccionada';
    const product=unit.product||'el producto final acordado';
    const rec=recipient();
    if(!unit.projectDesign){
      unit.projectDesign={
        authenticProblem:`El proyecto parte de una situación, necesidad, oportunidad o problema auténtico del contexto que los estudiantes necesitan comprender y atender: ${unit.situationBrief||situation}`,
        studentVoice:'Los estudiantes participan en la planificación: expresan lo que saben, plantean preguntas, proponen qué necesitan averiguar, acuerdan tareas y asumen responsabilidades según sus posibilidades y grado.',
        actionPath:'Investigan, dialogan con fuentes y personas pertinentes del entorno, toman decisiones, producen, prueban o revisan sus propuestas y mejoran el producto a partir de criterios y retroalimentación.',
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
    }else{
      unit.projectDesign.recipient=rec;
      unit.projectDesign.actionPath=String(unit.projectDesign.actionPath||'').replace(/personas de la comunidad/gi,'personas pertinentes del entorno');
      unit.projectDesign.socialization=`El producto se comparte con ${rec}; los estudiantes explican el proceso seguido, lo aprendido, las decisiones tomadas y evalúan el proyecto.`;
    }
    if(typeof save==='function')save();
  }

  const baseRender=window.renderUnitOutput;
  if(typeof baseRender==='function')window.renderUnitOutput=function(unit){ensureDesign(unit);return baseRender.apply(this,arguments);};
  const baseWord=window.unitWordHtml;
  if(typeof baseWord==='function')window.unitWordHtml=function(unit){ensureDesign(unit);return baseWord.apply(this,arguments);};

  (state.units||[]).forEach(ensureDesign);
})();