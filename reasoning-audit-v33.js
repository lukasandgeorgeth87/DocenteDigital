/* DocenteDigital – auditoría transversal de razonamiento v33
   Evalúa qué tipo de razonamiento corresponde a cada documento y fase,
   y detecta incoherencias, invenciones y saltos entre insumo → interpretación → producto. */
(function(){
  if(window.__ddReasoningAuditV33)return;window.__ddReasoningAuditV33=true;

  const tidy=s=>String(s||'').replace(/\s+/g,' ').trim();
  const has=v=>tidy(v).length>0;

  const reasoningCatalog={
    RPC:{name:'Razonamiento Pedagógico Contextual',scope:['Unidad','Proyecto','Sesión','Evaluación','Material'],principles:['comprender antes de redactar','distinguir dato explícito de inferencia','no inventar problema, causa, actor o finalidad','adaptar al nivel, modalidad y organización de IE','mantener coherencia entre fases']},
    RIC:{name:'Razonamiento Institucional Contextual',scope:['PEI','PAT','PCI','RI','DG','Informe','Oficio','RD'],principles:['partir del diagnóstico o hecho institucional disponible','no inventar necesidades, metas, comités, obligaciones ni evidencias','distinguir requisito normativo de decisión institucional','conservar trazabilidad entre diagnóstico, objetivos, acciones y seguimiento']},
    RNC:{name:'Razonamiento Normativo y Curricular',scope:['Unidad','Proyecto','Sesión','Evaluación','PEI','PAT','PCI','RI','DG','RD'],principles:['no presentar como oficial lo no verificado','no alterar denominaciones oficiales','separar norma vigente de sugerencia pedagógica','mantener fuente, versión y trazabilidad']},
    REC:{name:'Razonamiento de Evaluación Coherente',scope:['Unidad','Proyecto','Sesión','Evaluación'],principles:['criterio alineado al propósito','evidencia observable','instrumento pertinente','retroalimentación vinculada a criterio y evidencia']},
    RTL:{name:'Razonamiento Territorial y Lingüístico',scope:['Unidad','Proyecto','Sesión','PEI','PAT','PCI','RI','DG'],principles:['usar el lugar realmente registrado','no asumir que toda IE está en una comunidad','respetar urbana/rural/periurbana','distinguir EIB de monolingüe castellano','no forzar lengua o variedad']},
    RDP:{name:'Razonamiento de Dependencias entre Fases',scope:['Todos'],principles:['si cambia una fase fuente, revisar las fases derivadas','no conservar reto, producto, actividad o meta obsoletos','preservar edición manual del usuario o advertir antes de recalcular']}
  };

  const phaseMap={
    Unidad:['contexto','interpretación','título','situación significativa','reto','producto','propósitos','actividades','sesiones','evaluación','exportación'],
    Proyecto:['contexto','interpretación','título','situación significativa','reto','producto','plan de acción','actividades','sesiones','evaluación','socialización','exportación'],
    Sesión:['unidad/proyecto de origen','propósito','criterio','evidencia','inicio','desarrollo','cierre','atención diferenciada','retroalimentación','instrumento','exportación'],
    PEI:['datos institucionales','diagnóstico','identidad','objetivos','metas','propuesta pedagógica','gestión','seguimiento','exportación'],
    PAT:['diagnóstico/prioridades','objetivos','actividades','responsables','cronograma','recursos','indicadores','seguimiento','exportación'],
    PCI:['contexto institucional','caracterización','prioridades curriculares','orientaciones pedagógicas','evaluación','diversificación pertinente','exportación'],
    RI:['datos institucionales','marco aplicable','organización','convivencia','derechos/deberes','procedimientos','medidas','exportación'],
    RD:['hecho/expediente','base normativa verificada','considerandos','decisión','artículos','notificación/archivo','exportación'],
    Informe:['hechos/evidencias','análisis','hallazgos','conclusiones','recomendaciones','anexos','exportación'],
    Evaluación:['propósito','criterio','evidencia','instrumento','valoración','retroalimentación','decisión pedagógica']
  };

  function inferDocumentType(doc){
    const t=tidy(doc?.type||doc?.documentType||doc?.title||'');
    for(const k of Object.keys(phaseMap))if(new RegExp(k,'i').test(t))return k;
    return 'Unidad';
  }

  function applicableReasoning(type){
    const out=[];
    Object.entries(reasoningCatalog).forEach(([key,r])=>{if(r.scope.includes('Todos')||r.scope.includes(type)||(type==='Evaluación'&&r.scope.includes('Evaluación')))out.push({key,...r});});
    return out;
  }

  function auditPlanning(doc,type){
    const findings=[];
    const situation=tidy(doc?.situation),reto=tidy(doc?.reto),product=tidy(doc?.product),meaning=doc?.planningMeaning||{},expert=doc?.expertReasoning||null;
    if((type==='Unidad'||type==='Proyecto')&&!situation)findings.push({priority:'Alta',code:'missing-situation',message:'Falta situación significativa antes de continuar a reto y producto.'});
    if(situation&&!reto)findings.push({priority:'Alta',code:'missing-challenge',message:'Existe situación significativa pero falta un reto derivado de ella.'});
    if(reto&&!product)findings.push({priority:'Media',code:'missing-product',message:'Existe reto pero falta un producto/evidencia integradora coherente.'});
    if(expert?.kind==='interest' && has(meaning?.problem))findings.push({priority:'Alta',code:'interest-problem-conflict',message:'El texto fue interpretado como interés auténtico, pero otra fase conserva un problema. Revisar posible invención o análisis desactualizado.'});
    if(doc?.selectedSituationSource==='Docente' && doc?.pendingDerivedFromOriginal===true)findings.push({priority:'Alta',code:'stale-dependency',message:'La situación fue editada por el docente, pero el reto/producto podría seguir derivado del texto anterior.'});
    return findings;
  }

  function auditTerritorial(){
    const findings=[];const c=state?.teacherContext||{};const mode=tidy(state?.linguisticMode||state?.languageMode||c?.linguisticMode);
    if(/monoling/i.test(mode) && has(state?.originLanguage) && !/ninguna/i.test(state.originLanguage))findings.push({priority:'Alta',code:'stale-origin-language',message:'Perfil monolingüe conserva una lengua originaria distinta de “Ninguna”.'});
    return findings;
  }

  function audit(doc){
    const type=inferDocumentType(doc||{}),phases=phaseMap[type]||[],reasoning=applicableReasoning(type),findings=[...auditPlanning(doc||{},type),...auditTerritorial()];
    const result={at:new Date().toISOString(),documentType:type,phases,reasoning,findings,ok:!findings.some(x=>x.priority==='Alta')};
    state.reasoningAudit=state.reasoningAudit||{};state.reasoningAudit[type]=result;try{if(typeof save==='function')save();}catch(e){}
    return result;
  }

  window.ddReasoningCatalog=reasoningCatalog;
  window.ddDocumentPhaseMap=phaseMap;
  window.ddAuditDocumentReasoning=audit;
  window.ddReasoningAuditFor=function(type,doc){return audit({...doc,type});};
})();