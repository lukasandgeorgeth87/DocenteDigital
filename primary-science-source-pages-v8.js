/* Fase 8: index de consulta, Programa curricular de Educacion Primaria,
   archivo de 396 paginas aportado por el usuario, SHA-256 comprobado.
   NO copia ni asigna automaticamente desempenos oficiales particulares.
   Paginas del visor PDF, 1-indexed; numero impreso = pagina PDF - 2.
*/
(function(){
  if(window.DD_PRIMARY_SCIENCE_PAGES)return;
  const source={
    title:'Programa curricular de Educación Primaria — MINEDU',
    landingUrl:'https://www.gob.pe/institucion/minedu/informes-publicaciones/6790803-programa-curricular-de-educacion-primaria',
    repositoryUrl:'https://repositorio.minedu.gob.pe/handle/20.500.12799/4549',
    attachedPdfSha256:'34009689b6e3fe2194ec61c1675af13407528ae5e0f34f4d484007efd9e832f7',
    attachedPdfPageCount:396,
    pageSystem:'PDF 1-indexed; página impresa = PDF−2',
    scope:'Solo Ciencia y Tecnología Primaria (1.º–6.º); Inicial y Secundaria sin cambios'
  };
  const pages={
    indaga:{
      name:'Indaga mediante métodos científicos para construir sus conocimientos',
      III:{standard:278,performance:[278,279]},
      IV:{standard:280,performance:[280,281]},
      V:{standard:282,performance:[282,283]}
    },
    explica:{
      name:'Explica el mundo físico basándose en conocimientos sobre los seres vivos, materia y energía, biodiversidad, Tierra y universo',
      III:{standard:288,performance:[288,289]},
      IV:{standard:290,performance:[290,291]},
      V:{standard:292,performance:[292,293]}
    },
    disena:{
      name:'Diseña y construye soluciones tecnológicas para resolver problemas de su entorno',
      III:{standard:298,performance:[298,299]},
      IV:{standard:300,performance:[300,301]},
      V:{standard:302,performance:[302,303,304]}
    }
  };
  function gradeNumber(value){
    const match=String(value||'').trim().match(/^([1-6])(?:\.?[º°])?$/);
    return match?Number(match[1]):0;
  }
  function cycle(grade){
    const n=gradeNumber(grade);
    return n<1?null:n<=2?'III':n<=4?'IV':'V';
  }
  function forGrade(mode,grade){
    const key=String(mode||'').trim().toLowerCase(),n=gradeNumber(grade),c=cycle(grade),entry=pages[key];
    if(!entry||!n||!c)return null;
    const range=entry[c];
    return{mode:key,grade:`${n}.º`,cycle:c,competence:entry.name,
      standardPdfPage:range.standard,
      performancePdfPages:range.performance.slice(),
      performancePrintedPages:range.performance.map(p=>p-2),
      sourceUrl:source.landingUrl,
      literalPerformanceIncluded:false,
      teacherVerificationRequired:true};
  }
  function forSession(session){
    if(session?.level!=='Primaria'||session?.area!=='Ciencia y Tecnología')return[];
    const resolver=window.DD_OFFICIAL_CURRICULUM?.scienceModeFromTitle;
    const mode=typeof resolver==='function'?resolver(session.title||session.activityTitle||''):'indefinido';
    if(!pages[mode])return[];
    return[...new Set(session.grades||[])].map(grade=>forGrade(mode,grade)).filter(Boolean);
  }
  window.DD_PRIMARY_SCIENCE_PAGES={source,pages,forGrade,forSession,gradeNumber,cycle};
})();
