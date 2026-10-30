/* Fase 9: referencia curricular verificable por página del PDF de Primaria
   (396 páginas). NO transcribe ni selecciona desempeños oficiales automáticamente.
   Numeración de visor PDF (1-indexed); impresa = PDF menos 2.
*/
(function(){
  if(window.DD_PRIMARY_PERSONAL_SOCIAL_PAGES)return;
  const source={
    title:'Programa curricular de Educación Primaria — MINEDU',
    landingUrl:'https://www.gob.pe/institucion/minedu/informes-publicaciones/6790803-programa-curricular-de-educacion-primaria',
    repositoryUrl:'https://repositorio.minedu.gob.pe/handle/20.500.12799/4549',
    attachedPdfSha256:'34009689b6e3fe2194ec61c1675af13407528ae5e0f34f4d484007efd9e832f7',
    attachedPdfPageCount:396,
    pageSystem:'PDF 1-indexed; página impresa = PDF−2',
    scope:'Personal Social, Primaria 1.º–6.º únicamente'
  };
  // La página del estándar corresponde a la descripción esperada al final
  // del ciclo, no a la escala de niveles de desarrollo de la competencia.
  const pages={
    identidad:{name:'Construye su identidad',
      III:{standard:78,performance:[79]},IV:{standard:80,performance:[80]},V:{standard:81,performance:[82]}},
    convivencia:{name:'Convive y participa democráticamente en la búsqueda del bien común',
      III:{standard:86,performance:[86]},IV:{standard:87,performance:[88]},V:{standard:89,performance:[90]}},
    historia:{name:'Construye interpretaciones históricas',
      III:{standard:94,performance:[94]},IV:{standard:95,performance:[95]},V:{standard:96,performance:[96]}},
    ambiente:{name:'Gestiona responsablemente el espacio y el ambiente',
      III:{standard:100,performance:[100]},IV:{standard:101,performance:[101]},V:{standard:102,performance:[103]}},
    economia:{name:'Gestiona responsablemente los recursos económicos',
      III:{standard:108,performance:[108]},IV:{standard:109,performance:[109]},V:{standard:110,performance:[110]}}
  };
  function gradeNumber(value){const m=String(value||'').trim().match(/^([1-6])(?:\.?[º°])?$/);return m?+m[1]:0;}
  function cycle(value){const n=gradeNumber(value);return !n?null:n<=2?'III':n<=4?'IV':'V';}
  function forGrade(mode,grade){
    const key=String(mode||'').trim().toLowerCase(),n=gradeNumber(grade),c=cycle(grade),entry=pages[key];
    if(!entry||!n||!c)return null;
    const ref=entry[c];
    return {mode:key,grade:`${n}.º`,cycle:c,competence:entry.name,
      standardPdfPage:ref.standard,performancePdfPages:ref.performance.slice(),
      performancePrintedPages:ref.performance.map(page=>page-2),sourceUrl:source.landingUrl,
      literalPerformanceIncluded:false,teacherVerificationRequired:true};
  }
  function forSession(session){
    if(session?.level!=='Primaria'||session?.area!=='Personal Social')return [];
    const resolver=window.DD_OFFICIAL_CURRICULUM?.personalSocialModeFromTitle;
    const mode=typeof resolver==='function'?resolver(session.title||session.activityTitle||''):'indefinido';
    if(!pages[mode])return [];
    return [...new Set(session.grades||[])].map(g=>forGrade(mode,g)).filter(Boolean);
  }
  window.DD_PRIMARY_PERSONAL_SOCIAL_PAGES={source,pages,forGrade,forSession,gradeNumber,cycle};
})();
