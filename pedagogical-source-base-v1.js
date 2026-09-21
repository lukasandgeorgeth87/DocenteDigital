/* DocenteDigital — Base documental pedagógica v1
   Fuentes oficiales MINEDU verificadas y referentes complementarios.
   Regla de precedencia:
   1) CNEB/Programa curricular MINEDU y normativa oficial vigente.
   2) Unidad/proyecto vigente del docente.
   3) Cartillas y materiales oficiales MINEDU.
   4) Referentes pedagógicos complementarios.
   Nunca inventar páginas, citas o materiales específicos no verificados.
*/
(function(){
  if(window.DD_PEDAGOGICAL_SOURCES)return;

  const OFFICIAL=[
    {id:'cneb',level:'Todos',kind:'curriculo',title:'Currículo Nacional de la Educación Básica',year:2017,authority:'MINEDU',url:'https://www.minedu.gob.pe/curriculo/pdf/curriculo-nacional-de-la-educacion-basica.pdf'},
    {id:'pc-inicial',level:'Inicial',kind:'curriculo',title:'Programa curricular de Educación Inicial',year:2016,authority:'MINEDU',url:'https://repositorio.minedu.gob.pe/handle/20.500.12799/4548'},
    {id:'pc-primaria',level:'Primaria',kind:'curriculo',title:'Programa curricular de Educación Primaria',year:2016,authority:'MINEDU',url:'https://repositorio.minedu.gob.pe/handle/20.500.12799/4549'},
    {id:'pc-secundaria',level:'Secundaria',kind:'curriculo',title:'Programa curricular de Educación Secundaria',year:2016,authority:'MINEDU',url:'https://repositorio.minedu.gob.pe/handle/20.500.12799/4550'},
    {id:'plan-primaria',level:'Primaria',kind:'planificacion',title:'¿Cómo planificar el proceso de enseñanza, aprendizaje y evaluación formativa? Cartilla de planificación curricular para Educación Primaria',year:2017,authority:'MINEDU',url:'https://repositorio.minedu.gob.pe/handle/20.500.12799/5310'},
    {id:'multigrado',level:'Primaria',kind:'multigrado',title:'¿Cómo planificar sesiones de aprendizaje para aulas multigrado?',year:2019,authority:'MINEDU',url:'https://repositorio.minedu.gob.pe/handle/20.500.12799/10342'},
    {id:'eib-plan',level:'Primaria',kind:'eib',title:'Cómo organizamos y planificamos el trabajo en una escuela de Educación Primaria Intercultural Bilingüe',year:2017,authority:'MINEDU',url:'https://repositorio.minedu.gob.pe/bitstream/handle/20.500.12799/5303/C%C3%B3mo%20organizamos%20y%20planificamos%20el%20trabajo%20en%20una%20escuela%20de%20educaci%C3%B3n%20primaria%20intercultural%20biling%C3%BCe.pdf'},
    {id:'inicial-proyectos',level:'Inicial',kind:'planificacion',title:'Cartilla para el uso de las unidades y proyectos de aprendizaje. II ciclo de Educación Inicial',year:2016,authority:'MINEDU',url:'https://repositorio.minedu.gob.pe/bitstream/handle/20.500.12799/4536/Cartilla%20para%20el%20uso%20de%20las%20unidades%20y%20proyectos%20de%20aprendizaje.%20II%20ciclo%20de%20educacion%20inicial.pdf'},
    {id:'inicial-proyecto-tienda',level:'Inicial',kind:'ejemplo-proyecto',title:'Proyectos de aprendizaje: una tienda en nuestra aula',year:2019,authority:'MINEDU',url:'https://repositorio.minedu.gob.pe/handle/20.500.12799/6520'},
    {id:'rubricas-2025',level:'Todos',kind:'rubrica-docente',title:'Rúbricas de observación de aula para la Evaluación del Desempeño Docente: instructivo para la aplicación',year:2025,authority:'MINEDU',url:'https://repositorio.minedu.gob.pe/handle/20.500.12799/11396'},
    {id:'rubricas-guia-2025',level:'Todos',kind:'rubrica-docente',title:'Rúbricas de observación de aula para la Evaluación del Desempeño Docente: guía del participante',year:2025,authority:'MINEDU',url:'https://repositorio.minedu.gob.pe/handle/20.500.12799/11397'},
    {id:'sec-comunicacion',level:'Secundaria',kind:'didactica',title:'Orientaciones para el desarrollo y la evaluación de las competencias. Área de Comunicación',year:2022,authority:'MINEDU',url:'https://repositorio.minedu.gob.pe/handle/20.500.12799/8794'},
    {id:'sec-matematica-fichas',level:'Secundaria',kind:'didactica',title:'Orientaciones pedagógicas para el uso de las Fichas de Matemática',year:2024,authority:'MINEDU',url:'https://repositorio.minedu.gob.pe/handle/20.500.12799/10770'},
    {id:'sec-matematica-indagacion',level:'Secundaria',kind:'didactica',title:'Orientaciones para la indagación en Matemática',year:2024,authority:'MINEDU',url:'https://repositorio.minedu.gob.pe/handle/20.500.12799/10826'},
    {id:'sec-cyt-2025',level:'Secundaria',kind:'didactica',title:'Fascículo Enfoque Indagación y alfabetización científica y tecnológica',year:2025,authority:'MINEDU',url:'https://repositorio.minedu.gob.pe/handle/20.500.12799/11846'},
    {id:'refuerzo-primaria-2025',level:'Primaria',kind:'materiales',title:'Refuerzo Escolar 2025: orientaciones para la etapa de diagnóstico',year:2025,authority:'MINEDU',url:'https://repositorio.minedu.gob.pe/handle/20.500.12799/11864'},
    {id:'inicial-mate-juego',level:'Inicial',kind:'materiales',title:'Resolvemos problemas jugando 1: orientaciones para docentes, competencia Resuelve problemas de cantidad, 5 años',year:2022,authority:'MINEDU',url:'https://repositorio.minedu.gob.pe/handle/20.500.12799/8042'},
    {id:'sec-com1-2025',level:'Secundaria',kind:'materiales',area:'Comunicación',grade:'1',title:'Fichas de aprendizaje de Comunicación 1',year:2025,authority:'MINEDU',url:'https://repositorio.minedu.gob.pe/handle/20.500.12799/10828'},
    {id:'sec-com2-2025',level:'Secundaria',kind:'materiales',area:'Comunicación',grade:'2',title:'Fichas de aprendizaje de Comunicación 2',year:2025,authority:'MINEDU',url:'https://repositorio.minedu.gob.pe/handle/20.500.12799/10829'},
    {id:'sec-com3-2025',level:'Secundaria',kind:'materiales',area:'Comunicación',grade:'3',title:'Fichas de aprendizaje de Comunicación 3',year:2025,authority:'MINEDU',url:'https://repositorio.minedu.gob.pe/handle/20.500.12799/10830'},
    {id:'sec-com4-2025',level:'Secundaria',kind:'materiales',area:'Comunicación',grade:'4',title:'Fichas de aprendizaje de Comunicación 4',year:2025,authority:'MINEDU',url:'https://repositorio.minedu.gob.pe/handle/20.500.12799/10831'},
    {id:'sec-com5-2025',level:'Secundaria',kind:'materiales',area:'Comunicación',grade:'5',title:'Fichas de aprendizaje de Comunicación 5',year:2025,authority:'MINEDU',url:'https://repositorio.minedu.gob.pe/handle/20.500.12799/10832'}
  ];

  const AUTHORS=[
    {name:'Doug Lemov',use:['participación activa','comprobación de comprensión','altas expectativas','cultura de aula']},
    {name:'Rebeca Anijovich',use:['evaluación formativa','criterios visibles','retroalimentación','metacognición']},
    {name:'Francisco Mora',use:['curiosidad','atención','emoción y aprendizaje']},
    {name:'Frida Díaz Barriga',use:['aprendizaje situado','tareas auténticas','estudio de casos','colaboración']},
    {name:'Delia Lerner',use:['prácticas sociales de lectura y escritura','propósito comunicativo real']},
    {name:'Daniel Cassany',use:['procesos de escritura','revisión','lector y escritor estratégico']},
    {name:'George Pólya',use:['resolución de problemas','planificación','verificación']},
    {name:'Guy Brousseau',use:['situaciones didácticas','formulación','validación','institucionalización']},
    {name:'Melina Furman',use:['indagación','preguntas investigables','evidencias','explicaciones']},
    {name:'Carol Ann Tomlinson',use:['diferenciación','agrupamiento flexible','tareas escalonadas']}
  ];

  const RUBRIC_2025=[
    'Involucra activamente a los estudiantes en el proceso de aprendizaje',
    'Promueve el razonamiento, la creatividad y/o el pensamiento crítico',
    'Evalúa el progreso de los aprendizajes para retroalimentar a los estudiantes y adecuar su enseñanza',
    'Propicia un ambiente de respeto y proximidad',
    'Regula positivamente el comportamiento de los estudiantes'
  ];

  function officialFor(level,kind){
    return OFFICIAL.filter(x=>(x.level==='Todos'||x.level===level)&&(!kind||x.kind===kind));
  }
  function materialFor(level,area,grades=[]){
    const gs=(grades||[]).map(g=>String(g).match(/\d+/)?.[0]).filter(Boolean);
    return OFFICIAL.filter(x=>{
      if(x.kind!=='materiales'||x.level!==level)return false;
      if(x.area&&x.area!==area)return false;
      if(x.grade&&gs.length&&!gs.includes(x.grade))return false;
      return true;
    });
  }
  window.DD_PEDAGOGICAL_SOURCES={version:'1.0.0',official:OFFICIAL,authors:AUTHORS,rubric2025:RUBRIC_2025,officialFor,materialFor};
})();