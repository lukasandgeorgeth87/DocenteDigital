/* DocenteDigital — Fase 7. Índice de páginas del Programa curricular de
   Educación Primaria (396 páginas, documento adjunto por el usuario).
   NO transcribe ni certifica desempeños individuales. Las páginas indicadas
   son las del visor PDF; en Matemática la paginación impresa es PDF−2.
*/
(function(){
  if(window.DD_PRIMARY_MATHEMATICS_PAGES)return;
  const source={
    title:'Programa curricular de Educación Primaria — MINEDU',
    landingUrl:'https://www.gob.pe/institucion/minedu/informes-publicaciones/6790803-programa-curricular-de-educacion-primaria',
    repositoryUrl:'https://repositorio.minedu.gob.pe/handle/20.500.12799/4549',
    attachedPdfSha256:'34009689b6e3fe2194ec61c1675af13407528ae5e0f34f4d484007efd9e832f7',
    attachedPdfPageCount:396,
    pageSystem:'PDF (1-indexed); en esta sección los números impresos son PDF−2',
    scope:'Solo Matemática de Primaria, grados 1.º a 6.º; no afecta Inicial o Secundaria'
  };
  const pages={
    cantidad:{
      name:'Resuelve problemas de cantidad',
      III:{standard:238,performance:[238,239]},
      IV:{standard:240,performance:[240,241]},
      V:{standard:242,performance:[242,243]}
    },
    regularidad:{
      name:'Resuelve problemas de regularidad, equivalencia y cambio',
      III:{standard:248,performance:[248,249]},
      IV:{standard:250,performance:[250,251]},
      V:{standard:252,performance:[252,253]}
    },
    forma:{
      name:'Resuelve problemas de forma, movimiento y localización',
      III:{standard:258,performance:[258,259]},
      IV:{standard:260,performance:[260,261]},
      V:{standard:262,performance:[262,263]}
    },
    datos:{
      name:'Resuelve problemas de gestión de datos e incertidumbre',
      III:{standard:268,performance:[268]},
      IV:{standard:269,performance:[269,270]},
      V:{standard:271,performance:[271,272]}
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
    const key=String(mode||'').trim().toLowerCase(),n=gradeNumber(grade),c=cycle(grade);
    const entry=pages[key];
    if(!n||!entry||!c)return null;
    const range=entry[c];
    return{
      mode:key,grade:`${n}.º`,cycle:c,competence:entry.name,
      standardPdfPage:range.standard,
      performancePdfPages:range.performance.slice(),
      performancePrintedPages:range.performance.map(p=>p-2),
      sourceUrl:source.landingUrl,
      literalPerformanceIncluded:false,
      teacherVerificationRequired:true
    };
  }
  function forSession(session){
    if(session?.level!=='Primaria'||session?.area!=='Matemática')return[];
    const resolve=window.DD_OFFICIAL_CURRICULUM?.mathematicsModeFromTitle;
    const mode=typeof resolve==='function'?resolve(session.title||''):'indefinido';
    if(!pages[mode])return[];
    return[...new Set(session.grades||[])].map(g=>forGrade(mode,g)).filter(Boolean);
  }
  window.DD_PRIMARY_MATHEMATICS_PAGES={source,pages,forGrade,forSession,gradeNumber,cycle};
})();
