/* DocenteDigital — Fase 6. Índice CURRICULAR de páginas, no transcripción
   de desempeños. Verificado contra el PDF adjunto del Programa curricular de
   Educación Primaria (396 páginas). La numeración es la del VISOR PDF;
   el número impreso en el documento es dos páginas menos en este apartado.
*/
(function(){
  if(window.DD_PRIMARY_COMMUNICATION_PAGES)return;
  const source={
    title:'Programa curricular de Educación Primaria — MINEDU',
    landingUrl:'https://www.gob.pe/institucion/minedu/informes-publicaciones/6790803-programa-curricular-de-educacion-primaria',
    repositoryUrl:'https://repositorio.minedu.gob.pe/handle/20.500.12799/4549',
    attachedPdfSha256:'34009689b6e3fe2194ec61c1675af13407528ae5e0f34f4d484007efd9e832f7',
    attachedPdfPageCount:396,
    pageSystem:'PDF (1-indexed); la paginación impresa en esta sección es PDF−2',
    scope:'Solo Comunicación de Primaria en lengua materna; no incluye Inicial, Secundaria, castellano L2 ni inglés'
  };
  const pages={
    oral:{
      name:'Se comunica oralmente en su lengua materna',
      III:{standard:152,performance:[152,153]},
      IV:{standard:154,performance:[154,155]},
      V:{standard:158,performance:[158,159,160]}
    },
    lectura:{
      name:'Lee diversos tipos de textos escritos en su lengua materna',
      III:{standard:164,performance:[164,165]},
      IV:{standard:166,performance:[166,167]},
      V:{standard:168,performance:[168,169]}
    },
    escritura:{
      name:'Escribe diversos tipos de textos en su lengua materna',
      III:{standard:174,performance:[174,175]},
      IV:{standard:176,performance:[176,177]},
      V:{standard:178,performance:[178,179]}
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
    const normalized=String(mode||'').trim().toLowerCase();
    const n=gradeNumber(grade),c=cycle(grade),entry=pages[normalized];
    if(!n||!entry||!c)return null;
    const range=entry[c];
    return{
      mode:normalized,grade:`${n}.º`,cycle:c,competence:entry.name,
      standardPdfPage:range.standard,
      performancePdfPages:range.performance.slice(),
      performancePrintedPages:range.performance.map(p=>p-2),
      sourceUrl:source.landingUrl,
      literalPerformanceIncluded:false,
      teacherVerificationRequired:true
    };
  }
  function forSession(session){
    if(session?.level!=='Primaria'||session?.area!=='Comunicación')return[];
    const resolve=window.DD_OFFICIAL_CURRICULUM?.communicationModeFromTitle;
    const mode=typeof resolve==='function'?resolve(session.title||''):'indefinido';
    if(!pages[mode])return[];
    return[...new Set(session.grades||[])].map(grade=>forGrade(mode,grade)).filter(Boolean);
  }
  window.DD_PRIMARY_COMMUNICATION_PAGES={source,pages,forGrade,forSession,gradeNumber,cycle};
})();
