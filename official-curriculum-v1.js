/* DocenteDigital — Núcleo curricular oficial MINEDU v1
   Fuentes: Currículo Nacional de la Educación Básica y Programas Curriculares
   de Educación Inicial, Primaria y Secundaria, modificados por RM N.° 159-2017-MINEDU.
   Regla: nombres de áreas, competencias y capacidades de este archivo provienen
   de documentos oficiales MINEDU. Los criterios, evidencias y actividades que
   genere la app son contextualizaciones pedagógicas y no se presentan como texto
   literal del MINEDU.
*/
(function(){
  if(window.DD_OFFICIAL_CURRICULUM)return;

  const SOURCES={
    cneb:{
      id:'CNEB-2017',
      title:'Currículo Nacional de la Educación Básica',
      authority:'Ministerio de Educación del Perú',
      approvedBy:'RM N.° 281-2016-MINEDU',
      modifiedBy:'RM N.° 159-2017-MINEDU',
      officialUrl:'https://www.minedu.gob.pe/curriculo/pdf/curriculo-nacional-de-la-educacion-basica.pdf',
      portalUrl:'https://minedu.gob.pe/curriculo/'
    },
    Inicial:{
      id:'PC-INICIAL',
      title:'Programa curricular de Educación Inicial',
      authority:'Ministerio de Educación del Perú',
      approvedBy:'RM N.° 649-2016-MINEDU',
      modifiedBy:'RM N.° 159-2017-MINEDU',
      officialUrl:'https://www.minedu.gob.pe/curriculo/pdf/programa-curricular-educacion-inicial.pdf',
      repositoryUrl:'https://repositorio.minedu.gob.pe/handle/20.500.12799/4548'
    },
    Primaria:{
      id:'PC-PRIMARIA',
      title:'Programa curricular de Educación Primaria',
      authority:'Ministerio de Educación del Perú',
      approvedBy:'RM N.° 649-2016-MINEDU',
      modifiedBy:'RM N.° 159-2017-MINEDU',
      officialUrl:'https://www.minedu.gob.pe/curriculo/pdf/programa-curricular-educacion-primaria.pdf',
      repositoryUrl:'https://repositorio.minedu.gob.pe/handle/20.500.12799/4549'
    },
    Secundaria:{
      id:'PC-SECUNDARIA',
      title:'Programa curricular de Educación Secundaria',
      authority:'Ministerio de Educación del Perú',
      approvedBy:'RM N.° 649-2016-MINEDU',
      modifiedBy:'RM N.° 159-2017-MINEDU',
      officialUrl:'https://www.minedu.gob.pe/curriculo/pdf/programa-curricular-educacion-secundaria.pdf',
      repositoryUrl:'https://repositorio.minedu.gob.pe/handle/20.500.12799/4550'
    },
    rm159:{
      id:'RM-159-2017',
      title:'RM N.° 159-2017-MINEDU',
      authority:'Ministerio de Educación del Perú',
      officialUrl:'https://www.minedu.gob.pe/curriculo/pdf/rm-n-159-2017-minedu.pdf'
    }
  };

  const C=(name,capacities)=>({name,capacities});

  const COMMUNICATION=[
    C('Se comunica oralmente en su lengua materna',[
      'Obtiene información del texto oral',
      'Infiere e interpreta información del texto oral',
      'Adecúa, organiza y desarrolla las ideas de forma coherente y cohesionada',
      'Utiliza recursos no verbales y paraverbales de forma estratégica',
      'Interactúa estratégicamente con distintos interlocutores',
      'Reflexiona y evalúa la forma, el contenido y contexto del texto oral'
    ]),
    C('Lee diversos tipos de textos escritos en su lengua materna',[
      'Obtiene información del texto escrito',
      'Infiere e interpreta información del texto',
      'Reflexiona y evalúa la forma, el contenido y contexto del texto'
    ]),
    C('Escribe diversos tipos de textos en su lengua materna',[
      'Adecúa el texto a la situación comunicativa',
      'Organiza y desarrolla las ideas de forma coherente y cohesionada',
      'Utiliza convenciones del lenguaje escrito de forma pertinente',
      'Reflexiona y evalúa la forma, el contenido y contexto del texto escrito'
    ])
  ];

  const MATH=[
    C('Resuelve problemas de cantidad',[
      'Traduce cantidades a expresiones numéricas',
      'Comunica su comprensión sobre los números y las operaciones',
      'Usa estrategias y procedimientos de estimación y cálculo',
      'Argumenta afirmaciones sobre las relaciones numéricas y las operaciones'
    ]),
    C('Resuelve problemas de regularidad, equivalencia y cambio',[
      'Traduce datos y condiciones a expresiones algebraicas y gráficas',
      'Comunica su comprensión sobre las relaciones algebraicas',
      'Usa estrategias y procedimientos para encontrar equivalencias y reglas generales',
      'Argumenta afirmaciones sobre relaciones de cambio y equivalencia'
    ]),
    C('Resuelve problemas de forma, movimiento y localización',[
      'Modela objetos con formas geométricas y sus transformaciones',
      'Comunica su comprensión sobre las formas y relaciones geométricas',
      'Usa estrategias y procedimientos para orientarse en el espacio',
      'Argumenta afirmaciones sobre relaciones geométricas'
    ]),
    C('Resuelve problemas de gestión de datos e incertidumbre',[
      'Representa datos con gráficos y medidas estadísticas o probabilísticas',
      'Comunica su comprensión de los conceptos estadísticos y probabilísticos',
      'Usa estrategias y procedimientos para recopilar y procesar datos',
      'Sustenta conclusiones o decisiones con base en la información obtenida'
    ])
  ];

  const CYT=[
    C('Indaga mediante métodos científicos para construir sus conocimientos',[
      'Problematiza situaciones para hacer indagación',
      'Diseña estrategias para hacer indagación',
      'Genera y registra datos e información',
      'Analiza datos e información',
      'Evalúa y comunica el proceso y resultados de su indagación'
    ]),
    C('Explica el mundo físico basándose en conocimientos sobre los seres vivos, materia y energía, biodiversidad, Tierra y universo',[
      'Comprende y usa conocimientos sobre los seres vivos, materia y energía, biodiversidad, Tierra y universo',
      'Evalúa las implicancias del saber y del quehacer científico y tecnológico'
    ]),
    C('Diseña y construye soluciones tecnológicas para resolver problemas de su entorno',[
      'Determina una alternativa de solución tecnológica',
      'Diseña la alternativa de solución tecnológica',
      'Implementa y valida la alternativa de solución tecnológica',
      'Evalúa y comunica el funcionamiento y los impactos de su alternativa de solución tecnológica'
    ])
  ];

  const PERSONAL_SOCIAL=[
    C('Construye su identidad',[
      'Se valora a sí mismo',
      'Autorregula sus emociones',
      'Reflexiona y argumenta éticamente',
      'Vive su sexualidad de manera integral y responsable de acuerdo a su etapa de desarrollo y madurez'
    ]),
    C('Convive y participa democráticamente en la búsqueda del bien común',[
      'Interactúa con todas las personas',
      'Construye normas y asume acuerdos y leyes',
      'Maneja conflictos de manera constructiva',
      'Delibera sobre asuntos públicos',
      'Participa en acciones que promueven el bienestar común'
    ]),
    C('Construye interpretaciones históricas',[
      'Interpreta críticamente fuentes diversas',
      'Comprende el tiempo histórico',
      'Elabora explicaciones sobre procesos históricos'
    ]),
    C('Gestiona responsablemente el espacio y el ambiente',[
      'Comprende las relaciones entre los elementos naturales y sociales',
      'Maneja fuentes de información para comprender el espacio geográfico y el ambiente',
      'Genera acciones para conservar el ambiente local y global'
    ]),
    C('Gestiona responsablemente los recursos económicos',[
      'Comprende las relaciones entre los elementos del sistema económico y financiero',
      'Toma decisiones económicas y financieras'
    ])
  ];

  const DPCC=PERSONAL_SOCIAL.slice(0,2);
  const SOCIAL_SCIENCES=PERSONAL_SOCIAL.slice(2);

  const PE=[
    C('Se desenvuelve de manera autónoma a través de su motricidad',[
      'Comprende su cuerpo',
      'Se expresa corporalmente'
    ]),
    C('Asume una vida saludable',[
      'Comprende las relaciones entre la actividad física, alimentación, postura e higiene personal y del ambiente, y la salud',
      'Incorpora prácticas que mejoran su calidad de vida'
    ]),
    C('Interactúa a través de sus habilidades sociomotrices',[
      'Se relaciona utilizando sus habilidades sociomotrices',
      'Crea y aplica estrategias y tácticas de juego'
    ])
  ];

  const ART=[
    C('Aprecia de manera crítica manifestaciones artístico-culturales',[
      'Percibe manifestaciones artístico-culturales',
      'Contextualiza manifestaciones artístico-culturales',
      'Reflexiona creativa y críticamente sobre manifestaciones artístico-culturales'
    ]),
    C('Crea proyectos desde los lenguajes artísticos',[
      'Explora y experimenta los lenguajes del arte',
      'Aplica procesos creativos',
      'Evalúa y comunica sus procesos y proyectos'
    ])
  ];

  const RELIGION=[
    C('Construye su identidad como persona humana, amada por Dios, digna, libre y trascendente, comprendiendo la doctrina de su propia religión, abierto al diálogo con las que le son cercanas',[
      'Conoce a Dios y asume su identidad religiosa y espiritual como persona digna, libre y trascendente',
      'Cultiva y valora las manifestaciones religiosas de su entorno argumentando su fe de manera comprensible y respetuosa'
    ]),
    C('Asume la experiencia del encuentro personal y comunitario con Dios en su proyecto de vida en coherencia con su creencia religiosa',[
      'Transforma su entorno desde el encuentro personal y comunitario con Dios y desde la fe que profesa',
      'Actúa coherentemente en razón de su fe según los principios de su conciencia moral en situaciones concretas de la vida'
    ])
  ];

  const ORAL_SECOND=[
    C('Se comunica oralmente en castellano como segunda lengua',[
      'Obtiene información del texto oral',
      'Infiere e interpreta información del texto oral',
      'Adecúa, organiza y desarrolla el texto de forma coherente y cohesionada',
      'Utiliza recursos no verbales y paraverbales de forma estratégica',
      'Interactúa estratégicamente con distintos interlocutores',
      'Reflexiona y evalúa la forma, el contenido y contexto del texto oral'
    ])
  ];

  const CASTELLANO_L2=[
    ...ORAL_SECOND,
    C('Lee diversos tipos de textos escritos en castellano como segunda lengua',[
      'Obtiene información del texto escrito',
      'Infiere e interpreta información del texto',
      'Reflexiona y evalúa la forma, el contenido y contexto del texto'
    ]),
    C('Escribe diversos tipos de textos en castellano como segunda lengua',[
      'Adecúa el texto a la situación comunicativa',
      'Organiza y desarrolla las ideas de forma coherente y cohesionada',
      'Utiliza convenciones del lenguaje escrito de forma pertinente',
      'Reflexiona y evalúa la forma, el contenido y contexto del texto escrito'
    ])
  ];

  const ENGLISH=[
    C('Se comunica oralmente en inglés como lengua extranjera',[
      'Obtiene información de textos orales',
      'Infiere e interpreta información de textos orales',
      'Adecúa, organiza y desarrolla las ideas de forma coherente y cohesionada',
      'Utiliza recursos no verbales y paraverbales de forma estratégica',
      'Interactúa estratégicamente con distintos interlocutores',
      'Reflexiona y evalúa la forma, el contenido y el contexto del texto oral'
    ]),
    C('Lee diversos tipos de textos escritos en inglés como lengua extranjera',[
      'Obtiene información del texto escrito',
      'Infiere e interpreta información del texto',
      'Reflexiona y evalúa la forma, el contenido y contexto del texto'
    ]),
    C('Escribe diversos tipos de textos en inglés como lengua extranjera',[
      'Adecúa el texto a la situación comunicativa',
      'Organiza y desarrolla las ideas de forma coherente y cohesionada',
      'Utiliza convenciones del lenguaje escrito de forma pertinente',
      'Reflexiona y evalúa la forma, el contenido y contexto del texto escrito'
    ])
  ];

  const EPT=[
    C('Gestiona proyectos de emprendimiento económico o social',[
      'Crea propuestas de valor',
      'Aplica habilidades técnicas',
      'Trabaja cooperativamente para lograr objetivos y metas',
      'Evalúa los resultados del proyecto de emprendimiento'
    ])
  ];

  const TRANSVERSAL_FULL=[
    C('Se desenvuelve en entornos virtuales generados por las TIC',[
      'Personaliza entornos virtuales',
      'Gestiona información del entorno virtual',
      'Interactúa en entornos virtuales',
      'Crea objetos virtuales en diversos formatos'
    ]),
    C('Gestiona su aprendizaje de manera autónoma',[
      'Define metas de aprendizaje',
      'Organiza acciones estratégicas para alcanzar sus metas de aprendizaje',
      'Monitorea y ajusta su desempeño durante el proceso de aprendizaje'
    ])
  ];

  const INITIAL_TRANSVERSAL=[
    C('Se desenvuelve en entornos virtuales generados por las TIC',[
      'Personaliza entornos virtuales',
      'Gestiona información del entorno virtual',
      'Crea objetos virtuales en diversos formatos'
    ]),
    TRANSVERSAL_FULL[1]
  ];

  const INITIAL_COMM=[
    COMMUNICATION[0],
    C('Lee diversos tipos de texto en su lengua materna',[
      'Obtiene información del texto escrito',
      'Infiere e interpreta información del texto escrito',
      'Reflexiona y evalúa la forma, el contenido y contexto del texto escrito'
    ]),
    C('Escribe diversos tipos de texto en su lengua materna',[
      'Adecúa el texto a la situación comunicativa',
      'Organiza y desarrolla las ideas de forma coherente y cohesionada',
      'Utiliza convenciones del lenguaje escrito de forma pertinente',
      'Reflexiona y evalúa la forma, el contenido y contexto del texto escrito'
    ]),
    C('Crea proyectos desde los lenguajes del arte',[
      'Explora y experimenta los lenguajes del arte',
      'Aplica procesos creativos',
      'Socializa sus procesos y proyectos'
    ])
  ];

  const INITIAL_PERSONAL=[
    C('Construye su identidad',[
      'Se valora a sí mismo',
      'Autorregula sus emociones'
    ]),
    C('Convive y participa democráticamente en la búsqueda del bien común',[
      'Interactúa con todas las personas',
      'Construye normas y asume acuerdos y leyes',
      'Participa en acciones que promueven el bienestar común'
    ]),
    RELIGION[0]
  ];

  const INITIAL_MATH=[
    C('Resuelve problemas de cantidad',[
      'Traduce cantidades a expresiones numéricas',
      'Comunica su comprensión sobre los números y las operaciones',
      'Usa estrategias y procedimientos de estimación y cálculo'
    ]),
    C('Resuelve problemas de forma, movimiento y localización',[
      'Modela objetos con formas geométricas y sus transformaciones',
      'Comunica su comprensión sobre las formas y relaciones geométricas',
      'Usa estrategias y procedimientos para orientarse en el espacio'
    ])
  ];

  const INITIAL_CYT=[CYT[0]];

  const MATRIX={
    Inicial:{
      areas:{
        'Personal Social':INITIAL_PERSONAL,
        'Psicomotriz':[PE[0]],
        'Comunicación':INITIAL_COMM,
        'Castellano como Segunda Lengua':ORAL_SECOND,
        'Matemática':INITIAL_MATH,
        'Ciencia y Tecnología':INITIAL_CYT
      },
      transversals:INITIAL_TRANSVERSAL
    },
    Primaria:{
      areas:{
        'Personal Social':PERSONAL_SOCIAL,
        'Educación Religiosa':RELIGION,
        'Educación Física':PE,
        'Comunicación':COMMUNICATION,
        'Arte y Cultura':ART,
        'Castellano como Segunda Lengua':CASTELLANO_L2,
        'Inglés como Lengua Extranjera':ENGLISH,
        'Matemática':MATH,
        'Ciencia y Tecnología':CYT
      },
      transversals:TRANSVERSAL_FULL
    },
    Secundaria:{
      areas:{
        'Desarrollo Personal, Ciudadanía y Cívica':DPCC,
        'Ciencias Sociales':SOCIAL_SCIENCES,
        'Educación para el Trabajo':EPT,
        'Educación Física':PE,
        'Comunicación':COMMUNICATION,
        'Arte y Cultura':ART,
        'Castellano como Segunda Lengua':CASTELLANO_L2,
        'Inglés como Lengua Extranjera':ENGLISH,
        'Matemática':MATH,
        'Ciencia y Tecnología':CYT,
        'Educación Religiosa':RELIGION
      },
      transversals:TRANSVERSAL_FULL
    }
  };

  const ALIASES={
    'DPCC':'Desarrollo Personal, Ciudadanía y Cívica',
    'EPT':'Educación para el Trabajo',
    'Inglés':'Inglés como Lengua Extranjera',
    'Castellano como segunda lengua':'Castellano como Segunda Lengua'
  };

  function canonicalArea(area){return ALIASES[area]||area;}
  function areas(level){return Object.keys(MATRIX[level]?.areas||{});}
  function getArea(level,area){return MATRIX[level]?.areas?.[canonicalArea(area)]||[];}
  function getTransversals(level){return MATRIX[level]?.transversals||[];}
  function sourceFor(level){return SOURCES[level]||null;}

  function pickCompetence(level,area,title=''){
    const list=getArea(level,area);
    if(!list.length)return null;
    const t=String(title||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    const find=(re)=>list.find(x=>re.test(x.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')));
    const a=canonicalArea(area);

    if(level==='Inicial'&&a==='Personal Social'){
      if(/dios|fe|relig|oracion|creacion/.test(t))return list.find(x=>/amada por dios/i.test(x.name))||list[0];
      if(/identidad|emocion|familia|caracteristica personal|quien soy/.test(t))return find(/construye su identidad/)||list[0];
      return find(/convive y participa/)||list[0];
    }
    if(level==='Inicial'&&a==='Comunicación'){
      if(/arte|artist|dibu|pint|model|crea proyecto/.test(t))return find(/crea proyectos/)||list[0];
      if(/lee|lectura|texto escrito|cuento|libro/.test(t))return find(/lee diversos tipos/)||list[0];
      if(/escrib|produc|trazo|texto/.test(t))return find(/escribe diversos tipos/)||list[0];
      return find(/se comunica oralmente/)||list[0];
    }

    if(['Comunicación','Castellano como Segunda Lengua','Inglés como Lengua Extranjera'].includes(a)){
      if(/lee|lectura|texto escrito|comprension lectora/.test(t))return find(/lee diversos tipos/)||list[0];
      if(/escrib|produc|redact|revis|texto/.test(t))return find(/escribe diversos tipos/)||list[0];
      return find(/se comunica oralmente/)||list[0];
    }
    if(a==='Matemática'){
      if(/tabla|grafico|dato|estadistic|probabil|encuesta/.test(t))return find(/gestion de datos/)||list[0];
      if(/forma|geometr|ubic|espacio|medida|perimet|area|movimiento|localiz/.test(t))return find(/forma, movimiento y localizacion/)||list[0];
      if(/patron|regular|equival|igualdad|ecuacion|cambio/.test(t))return find(/regularidad, equivalencia y cambio/)||list[0];
      return find(/cantidad/)||list[0];
    }
    if(a==='Ciencia y Tecnología'){
      if(/disen|constru|solucion|prototipo|tecnolog/.test(t))return find(/disena y construye/)||list[0];
      if(/indag|observ|pregunta|hipotes|exper|dato|resultado|germin/.test(t))return find(/indaga mediante/)||list[0];
      return find(/explica el mundo fisico/)||list[0];
    }
    if(a==='Personal Social'){
      if(/histori|pasado|cambio|permanencia|fuente/.test(t))return find(/interpretaciones historicas/)||list[0];
      if(/ambiente|espacio|territorio|mapa|riesgo/.test(t))return find(/espacio y el ambiente/)||list[0];
      if(/econom|dinero|ahorro|recurso econom/.test(t))return find(/recursos economicos/)||list[0];
      if(/identidad|emocion|familia|caracteristica personal/.test(t))return find(/construye su identidad/)||list[0];
      return find(/convive y participa/)||list[0];
    }
    if(a==='Desarrollo Personal, Ciudadanía y Cívica'){
      if(/identidad|emocion|sexualidad|etica|autoconoc/.test(t))return find(/construye su identidad/)||list[0];
      return find(/convive y participa/)||list[0];
    }
    if(a==='Ciencias Sociales'){
      if(/histori|pasado|fuente|tiempo/.test(t))return find(/interpretaciones historicas/)||list[0];
      if(/econom|dinero|mercado|recurso/.test(t))return find(/recursos economicos/)||list[0];
      return find(/espacio y el ambiente/)||list[0];
    }
    if(a==='Educación Física'){
      if(/salud|aliment|higiene|postura|actividad fisica/.test(t))return find(/vida saludable/)||list[0];
      if(/motric|cuerpo|movimiento|expresion corporal/.test(t))return find(/motricidad/)||list[0];
      return find(/sociomotrices/)||list[0];
    }
    if(a==='Arte y Cultura'){
      if(/aprecia|analiza|manifestacion|obra|cultura/.test(t))return find(/aprecia/)||list[0];
      return find(/crea proyectos/)||list[0];
    }
    return list[0];
  }

  function sourceBadge(level){
    const s=sourceFor(level);
    if(!s)return '';
    return `MINEDU · ${s.title} · ${s.modifiedBy}`;
  }

  window.DD_OFFICIAL_CURRICULUM={
    version:'1.0.0',
    verified:true,
    scope:'areas-competencies-capacities-transversal-competencies',
    performanceMatrixReady:false,
    requiredForGeneration:true,
    sources:SOURCES,
    matrix:MATRIX,
    areas,
    getArea,
    getTransversals,
    sourceFor,
    sourceBadge,
    pickCompetence,
    canonicalArea
  };

  /* La UI debe ofrecer únicamente áreas oficiales del nivel. */
  const previousAreaOptions=window.areaOptions;
  if(typeof previousAreaOptions==='function'){
    window.areaOptions=function(){
      try{
        const level=typeof state==='object'&&state?state.level:'';
        const official=areas(level);
        if(official.length)return official;
      }catch(_e){}
      return previousAreaOptions.apply(this,arguments);
    };
  }

  function sourceLinksHtml(level){
    const src=sourceFor(level);
    const cneb=SOURCES.cneb;
    const rm=SOURCES.rm159;
    const link=(url,label)=>url?`<a class="btn ghost" href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`:'';
    return `
      <div class="dd-official-source-card success">
        <b>✓ Fuente curricular oficial MINEDU cargada</b>
        <p style="margin:6px 0 10px">DocenteDigital toma áreas, competencias, capacidades y competencias transversales de las fuentes oficiales. Los criterios, evidencias y actividades se muestran como contextualizaciones pedagógicas.</p>
        <div class="actions" style="flex-wrap:wrap">
          ${link(cneb.officialUrl,'📘 Abrir/descargar CNEB')}
          ${link(src?.officialUrl||src?.repositoryUrl,'📚 Programa curricular de '+(level||'nivel'))}
          ${link(rm.officialUrl,'⚖️ RM 159-2017-MINEDU')}
        </div>
      </div>`;
  }

  function renderOfficialSourceStatus(){
    const level=(typeof state==='object'&&state?.level)||'';
    const plan=document.getElementById('plan');
    if(plan){
      let box=plan.querySelector('[data-dd-official-source]');
      if(!box){
        box=document.createElement('div');
        box.setAttribute('data-dd-official-source','true');
        const sub=plan.querySelector('.sub');
        if(sub)sub.insertAdjacentElement('afterend',box);else plan.prepend(box);
      }
      box.innerHTML=sourceLinksHtml(level);
    }
    const settings=document.getElementById('settings');
    if(settings){
      let box=settings.querySelector('[data-dd-official-source]');
      if(!box){
        box=document.createElement('div');
        box.className='topgap';
        box.setAttribute('data-dd-official-source','true');
        settings.appendChild(box);
      }
      box.innerHTML=sourceLinksHtml(level);
    }
  }

  const previousRefresh=window.refresh;
  if(typeof previousRefresh==='function'){
    window.refresh=function(){
      const result=previousRefresh.apply(this,arguments);
      renderOfficialSourceStatus();
      return result;
    };
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',renderOfficialSourceStatus,{once:true});
  else renderOfficialSourceStatus();

  window.__ddOfficialCurriculumV1=true;
})();