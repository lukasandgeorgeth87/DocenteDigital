/* DocenteDigital – Auditoría Maestra Consolidada v57
   Fuente de control: Auditoría Maestra Integral 31/08/2026.
   Regla: la calidad no se declara; se demuestra con recorrido E2E y evidencia.
   Este módulo NO convierte presencia de código en aprobación de lanzamiento.
*/
(function(){
  if(window.__ddMasterAuditV57)return;window.__ddMasterAuditV57=true;
  if(typeof state!=='object')return;
  const tidy=v=>String(v??'').replace(/\s+/g,' ').trim();
  const low=v=>tidy(v).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const now=()=>new Date().toISOString();
  const BAD_TITLE=/\b(?:unidad|proyecto|sesión|sesion)\s+(?:sobre|de|acerca de)\b|\bquiero enseñar\b|\bquiero trabajar\b/i;
  const SEVERITY={S0:'BLOQUEANTE',S1:'CRÍTICO',S2:'ALTO',S3:'MEDIO',S4:'BAJO'};
  const DIMENSIONS=['IA','SEM','PED','CNEB','COH','DID','EVA','MUL','EIB','INI','PRI','SEC','DOC','DIR','NOR','DAT','UX','ACC','MOV','EXP','SEG','REC','PER','ESC'];
  const GATES=['Pedagogía','IA/semántica','Carpeta Docente','Carpeta Director','Funcionalidad real','Exportación','Móvil','Persistencia','Normativa','Seguridad','Privacidad','Recuperación','Golden tests','Regresión crítica'];
  const result=(id,area,severity,status,expected,obtained,evidence,action)=>({id,area,severity,status,passed:status==='PASA',expected,obtained,evidence,action,executedAt:now()});

  function titles(input,type='Unidad de aprendizaje'){
    try{return (window.ddNaturalPlanningTitles?.(input,type)||window.ddCreativeTitleOptions?.(input,type)||[]).slice(0,3);}catch(e){return[];}
  }
  function hasWord(list,word){return list.every(t=>low(t).includes(low(word)));}
  function distinct(list){return list.length===3&&new Set(list.map(x=>low(x).replace(/[^a-z0-9ñ ]/g,' '))).size===3;}
  function noInstrument(list){return list.length===3&&!list.some(t=>BAD_TITLE.test(t));}
  function noForcedResearch(input,list){
    const research=/investig|indag|averigu|pregunt|quieren saber|queremos saber|curios|aparecieron|observamos|encontramos/.test(low(input));
    return research||!list.some(t=>/investig|indag|bajo la lupa/i.test(t));
  }

  const semanticCases=[
    ['AUD-SEM-001','unidad sobre la primavera','primavera'],
    ['AUD-SEM-002','mis niños quieren saber de mariposas','mariposas'],
    ['AUD-SEM-003','quiero enseñar abejas','abejas'],
    ['AUD-SEM-004','proyecto biohuerto','biohuerto'],
    ['AUD-SEM-005','conocer animales','animales'],
    ['AUD-SEM-006','quiero una unidad sovre la primabera','primavera'],
    ['AUD-SEM-007','primavera','primavera'],
    ['AUD-SEM-008','Quiero trabajar saberes de la siembra de tubérculos y estos conocimientos los aplicaremos para sembrar hortalizas en nuestro biohuerto escolar.','biohuerto']
  ];
  function semanticTests(){
    return semanticCases.map(([id,input,key])=>{
      const list=titles(input,/proyecto/i.test(input)?'Proyecto de aprendizaje':'Unidad de aprendizaje');
      const mci=(()=>{try{return window.ddUnderstandUserIntent?.(input)||null;}catch(e){return null;}})();
      const keyOk=id==='AUD-SEM-008'?/biohuerto/i.test(tidy(mci?.finality||'')+' '+list.join(' ')):id==='AUD-SEM-006'?(list.length===3&&!list.some(t=>/sovre|primabera/i.test(t))):hasWord(list,key);
      const ok=list.length===3&&distinct(list)&&noInstrument(list)&&noForcedResearch(input,list)&&keyOk;
      return result(id,'SEM','S1',ok?'PASA':'NO_PASA','Comprender intención y generar 3 títulos naturales sin copiar instrucción',list.join(' | ')||'[sin títulos]',{input,mci,list},'Corregir MCI/generador general; no añadir un parche exclusivo para este ejemplo');
    });
  }

  const regressions=[
    ['abejas','quiero enseñar abejas'],['mariposas','mis niños quieren saber de mariposas'],['primavera','unidad sobre la primavera'],['biohuerto','proyecto biohuerto'],['agua','queremos aprender sobre el agua'],['familia','queremos valorar a nuestra familia'],['contaminación','observamos contaminación cerca de la escuela'],['lectura','quiero fortalecer la lectura'],['alimentación','queremos aprender sobre alimentación saludable'],['tecnología','queremos conocer el uso responsable de la tecnología']
  ];
  function regressionTest(){
    const evidence=regressions.map(([key,input])=>{const list=titles(input);return{key,input,list,ok:list.length===3&&distinct(list)&&noInstrument(list)&&noForcedResearch(input,list)&&list.some(t=>low(t).includes(low(key)))};});
    const ok=evidence.every(x=>x.ok);
    return result('AUD-REG-SEM-001','SEM','S1',ok?'PASA':'NO_PASA','Abejas+mariposas+primavera+biohuerto+agua+familia+contaminación+lectura+alimentación+tecnología sin regresiones',ok?'10/10 casos coherentes':`${evidence.filter(x=>x.ok).length}/10 casos coherentes`,evidence,'No aprobar cambios del generador hasta recuperar 10/10');
  }

  function titleQuality(){
    const list=titles('unidad sobre la primavera');
    const ok=list.length===3&&distinct(list)&&noInstrument(list)&&!list.some(t=>/^unidad sobre/i.test(t));
    return result('AUD-TIT-001','SEM','S1',ok?'PASA':'NO_PASA','Tres títulos pertinentes, naturales y diversos',list.join(' | '),list,'Regenerar antes de mostrar si pertinencia/naturalidad/diversidad fallan');
  }

  function verticalCoherence(){
    const units=Array.isArray(state.units)?state.units:[];
    if(!units.length)return result('AUD-COH-001','COH','S1','PENDIENTE_DATOS','Idea→título→situación→reto→producto→propósitos→criterios→evidencias→sesiones','No hay unidad guardada para auditar',null,'Repetir automáticamente cuando exista una unidad completa');
    const bad=[];
    for(const u of units){
      const needed={title:u.title,situation:u.situation||u.situationBrief,reto:u.reto||u.challenge,product:u.product,activities:Array.isArray(u.activities)&&u.activities.length};
      if(!needed.title||!needed.situation||!needed.reto||!needed.product||!needed.activities)bad.push({id:u.id,title:u.title,missing:Object.entries(needed).filter(([,v])=>!v).map(([k])=>k)});
    }
    return result('AUD-COH-001','COH','S1',bad.length?'NO_PASA':'PASA','Cadena vertical mínima completa en todas las unidades guardadas',bad.length?`${bad.length} unidad(es) incompletas`:`${units.length} unidad(es) con cadena estructural mínima`,bad,'Completar la cadena y después ejecutar control semántico E2E; presencia no equivale aún a coherencia pedagógica total');
  }

  function userDecision(){
    const units=Array.isArray(state.units)?state.units:[];const affected=units.filter(u=>u.intentContract&&u.intentContract.userDecisionWins!==true);
    return result('AUD-IA-CONT-001','IA','S1',affected.length?'NO_PASA':'PASA','Decisiones explícitas del docente prevalecen sobre plantillas posteriores',affected.length?`${affected.length} contrato(s) sin prioridad del usuario`:'Contratos nuevos registran userDecisionWins=true',{affected:affected.map(u=>u.id)},'No sobrescribir título, reto, producto, duración, grados, áreas o finalidad elegidos por el usuario');
  }

  function durationGate(){
    const el=document.getElementById('unitDuration'),vals=el?[...el.options].map(o=>tidy(o.textContent)):[];
    const selector=['1 semana','2 semanas','3 semanas','4 semanas','5 semanas','6 semanas'].every(x=>vals.includes(x));
    return result('AUD-DOC-DUR-001','DOC','S2',selector?'PENDIENTE_E2E':'NO_PASA','Duración 1–6 semanas modifica sesiones, progresión, producto, complejidad y profundidad',selector?'Selector correcto; efecto pedagógico E2E todavía no demostrado':'Faltan opciones 1–6 semanas',vals,'Generar y comparar unidades de 1/3/6 semanas antes de aprobar');
  }

  function sessionGate(){
    const s=state.lastSession;
    if(!s)return result('AUD-SES-001','PED','S1','PENDIENTE_DATOS','Sesión con título, propósito, competencia, capacidades, desempeño, criterio, evidencia, instrumento, secuencia y evaluación','No existe sesión generada en este perfil',null,'Repetir al crear una sesión');
    const fields=['title','purpose','competence','criterion','evidence','instrument'];const missing=fields.filter(k=>!tidy(s[k]));
    const chain=tidy(s.sessionPedagogicalChain);const ok=!missing.length&&/criterio/.test(low(chain))&&/evidencia/.test(low(chain));
    return result('AUD-SES-001','PED','S1',ok?'PASA':'NO_PASA','Coherencia curricular mínima de sesión',ok?'Estructura mínima completa':`Faltan: ${missing.join(', ')||'cadena pedagógica'}`,{missing,chain},'No generar sesión final si faltan elementos curriculares esenciales');
  }

  function moduleLoadGate(){
    const fail=Array.isArray(window.ddModuleLoadFailures)?window.ddModuleLoadFailures:[];
    return result('AUD-UX-ZERO-001','UX','S1',fail.length?'NO_PASA':'PASA','Sin módulos esenciales fallidos ni pantalla silenciosamente incompleta',fail.length?`Fallaron: ${fail.join(', ')}`:'Sin fallos de carga registrados',fail,'Bloquear creación/exportación y mostrar recuperación cuando un módulo esencial no cargue');
  }

  function localPersistence(){
    let ok=false,why='';try{const k='dd_master_audit_probe';localStorage.setItem(k,'ok');ok=localStorage.getItem(k)==='ok';localStorage.removeItem(k);}catch(e){why=e.message;}
    return result('AUD-REC-LOCAL-001','REC','S1',ok?'PASA':'NO_PASA','Almacenamiento local básico disponible',ok?'Lectura/escritura local correcta':why||'falló localStorage',why,'Esto NO aprueba recuperación; aún debe demostrarse cierre, corte de red, apagado y restauración real');
  }

  function realEvidencePending(){
    return[
      result('AUD-SEG-REAL-001','SEG','S0','PENDIENTE_REAL','Usuario A no accede a datos de Usuario B; aislamiento entre IE','No hay evidencia E2E multiusuario registrada','Requiere backend/autenticación/roles','BLOQUEANTE para lanzamiento'),
      result('AUD-PRIV-REAL-001','SEG','S0','PENDIENTE_REAL','Privacidad y aislamiento de datos estudiantiles','No hay evidencia de prueba real','Requiere pruebas de permisos, minimización, borrado y logs','BLOQUEANTE para lanzamiento'),
      result('AUD-REC-REAL-001','REC','S0','PENDIENTE_REAL','Backup y restauración demostrada','No existe restauración física registrada','La auditoría exige restaurar una copia, no solo crearla','BLOQUEANTE para lanzamiento'),
      result('AUD-EXP-REAL-001','EXP','S1','PENDIENTE_REAL','APP↔Word↔PDF↔impresión verificado','No existe matriz física completa registrada','Abrir/imprimir en Word móvil/escritorio, WPS, Google Docs/alternativas pertinentes','Mantener NO APROBADO'),
      result('AUD-MOV-REAL-001','MOV','S1','PENDIENTE_REAL','Teléfono económico, gama media y pantalla pequeña','No existe prueba física registrada','Responsive no sustituye dispositivo real','Mantener NO APROBADO'),
      result('AUD-INET-REAL-001','REC','S1','PENDIENTE_REAL','3G lento, latencia, pérdida de señal y reconexión sin pérdida','No existe prueba de conectividad rural registrada','Simular y recuperar trabajo','Mantener NO APROBADO'),
      result('AUD-IA100-001','IA','S1','PENDIENTE_REAL','100 generaciones por familia de documento','No se ha registrado batería 100x con métricas','Medir coherencia, exactitud, alucinación, repetición, exportación y tiempo','Mantener NO APROBADO'),
      result('AUD-PILOT-001','UX','S1','PENDIENTE_REAL','Pilotos con docentes/directores reales','No hay evidencia de piloto almacenada','Medir prueba 10 segundos, 5 minutos y ahorro real','Mantener NO APROBADO')
    ];
  }

  function run(){
    const results=[...semanticTests(),titleQuality(),regressionTest(),verticalCoherence(),userDecision(),durationGate(),sessionGate(),moduleLoadGate(),localPersistence(),...realEvidencePending()];
    const blockers=results.filter(r=>r.severity==='S0'&&r.status!=='PASA');
    const critical=results.filter(r=>r.severity==='S1'&&r.status!=='PASA');
    const classification=(blockers.length||critical.length)?'NO_APROBADO':'APROBADO_LOCAL_PENDIENTE_GATES';
    const run={id:'MASTER-'+Date.now(),executedAt:now(),version:'31/08/2026-v57',dimensions:DIMENSIONS,gates:GATES,results,blockers:blockers.map(x=>x.id),critical:critical.map(x=>x.id),productionGate:false,classification};
    state.masterAuditRuns=Array.isArray(state.masterAuditRuns)?state.masterAuditRuns:[];state.masterAuditRuns.push(run);state.masterAuditRuns=state.masterAuditRuns.slice(-10);try{save();}catch(e){}
    return run;
  }

  function esc(v){return typeof window.escapeHtml==='function'?window.escapeHtml(String(v??'')):String(v??'');}
  function renderRun(run){
    const counts={PASA:0,NO_PASA:0,PENDIENTE_REAL:0,PENDIENTE_E2E:0,PENDIENTE_DATOS:0};run.results.forEach(r=>counts[r.status]=(counts[r.status]||0)+1);
    const rows=run.results.map(r=>`<tr><td><b>${esc(r.id)}</b><br><small>${esc(r.area)}</small></td><td>${r.status==='PASA'?'✅ PASA':r.status==='NO_PASA'?'❌ NO PASA':'⏳ '+esc(r.status.replaceAll('_',' '))}</td><td><b>${esc(r.severity)}</b> ${esc(SEVERITY[r.severity]||'')}</td><td>${esc(r.obtained)}</td></tr>`).join('');
    return `<div class="notice"><b>Dictamen:</b> NO APROBADO PARA LANZAMIENTO mientras exista S0/S1 o evidencia real pendiente.<br><small>Pasa local: ${counts.PASA||0} · No pasa: ${counts.NO_PASA||0} · Pendientes reales/E2E: ${(counts.PENDIENTE_REAL||0)+(counts.PENDIENTE_E2E||0)+(counts.PENDIENTE_DATOS||0)}</small></div><div class="dd-master-audit-table"><table><thead><tr><th>Prueba</th><th>Estado</th><th>Severidad</th><th>Resultado</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  }
  function mount(){
    const host=document.getElementById('settings');if(!host)return;
    document.getElementById('ddExecutableAuditPanel')?.classList.add('dd-superseded-audit');document.getElementById('ddPrelaunchEvidenceGate')?.classList.add('dd-superseded-audit');
    let card=document.getElementById('ddMasterAuditPanel');if(card)return;
    card=document.createElement('div');card.id='ddMasterAuditPanel';card.className='card topgap expert-only';
    card.innerHTML='<h2>🧪 Auditoría Maestra Integral</h2><p class="sub">Único Quality Gate consolidado. Las auditorías antiguas quedan subordinadas a este resultado.</p><button class="btn" id="ddRunMasterAudit">Ejecutar auditoría maestra</button><div id="ddMasterAuditResult" class="topgap"></div>';
    host.appendChild(card);document.getElementById('ddRunMasterAudit').onclick=()=>{document.getElementById('ddMasterAuditResult').innerHTML=renderRun(run());};
  }
  const baseGo=window.go;if(typeof baseGo==='function')window.go=function(id){const r=baseGo.apply(this,arguments);if(id==='settings')setTimeout(mount,0);return r;};
  const css=document.createElement('style');css.textContent='.dd-superseded-audit{display:none!important}.dd-master-audit-table{overflow:auto;max-height:62vh}.dd-master-audit-table table{min-width:760px}body:not(.expert) #ddMasterAuditPanel{display:none!important}';document.head.appendChild(css);
  setTimeout(mount,0);
  window.ddMasterAudit={version:'31/08/2026-v57',dimensions:DIMENSIONS,gates:GATES,run,semanticCases,regressions};
})();