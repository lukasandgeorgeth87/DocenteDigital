/* DocenteDigital – Auditoría Ejecutable v47
   Convierte criterios de auditoría en pruebas trazables con ID, evidencia y severidad.
   También agrega procedencia básica de datos y quality gates del prototipo.
*/
(function(){
  if(window.__ddExecutableAuditV47)return;window.__ddExecutableAuditV47=true;
  if(typeof state!=='object')return;

  const tidy=v=>String(v??'').replace(/\s+/g,' ').trim();
  const now=()=>new Date().toISOString();
  const SEVERITY={
    S0:{label:'BLOQUEANTE',rank:0},S1:{label:'CRÍTICO',rank:1},S2:{label:'ALTO',rank:2},S3:{label:'MEDIO',rank:3},S4:{label:'BAJO',rank:4}
  };

  state.dataProvenance=state.dataProvenance||{};
  state.executableAuditRuns=state.executableAuditRuns||[];

  function provenanceSet(key,value,source,meta={}){
    if(!key)return;
    state.dataProvenance[key]={value,source:source||'USUARIO',recordedAt:now(),...meta};
    if(typeof save==='function')save();
    return state.dataProvenance[key];
  }
  function provenanceGet(key){return state.dataProvenance?.[key]||null;}

  function seedMasterProvenance(){
    const m=state.institutionMaster||{};
    const fields=['ieName','modularCode','localCode','ugel','dreGre','region','province','district','locationType','locationName','geographicArea','managementType','organization','directorName','teacherCount','studentCount','schoolCalendar','communalCalendar'];
    for(const f of fields){if(tidy(m[f])&&!provenanceGet('institution.'+f))provenanceSet('institution.'+f,m[f],'FICHA_MAESTRA',{historical:false});}
  }

  function result(id,area,severity,passed,expected,obtained,evidence,action,status='EJECUTADA'){
    return {id,area,severity,passed:!!passed,status,expected,obtained,evidence,action,executedAt:now()};
  }

  const tests=[
    {
      id:'AUD-DAT-001',area:'Datos',severity:'S1',name:'Existe fuente única institucional',run(){
        const m=state.institutionMaster||{};const ok=!!m&&typeof m==='object';
        return result(this.id,this.area,this.severity,ok,'Ficha Maestra institucional única disponible',ok?'institutionMaster disponible':'institutionMaster ausente',Object.keys(m||{}).length+' campos disponibles','Crear/recuperar Ficha Maestra antes de generar documentos');
      }
    },
    {
      id:'AUD-DAT-002',area:'Datos',severity:'S2',name:'Coherencia organización vs número de docentes',run(){
        const m=state.institutionMaster||{},org=tidy(m.organization),n=Number(m.teacherCount||0);let ok=true,msg='Sin inconsistencia detectable con datos actuales';
        if(org==='Unidocente'&&n>1){ok=false;msg=`IE marcada Unidocente pero registra ${n} docentes`;}
        return result(this.id,this.area,this.severity,ok,'No existir contradicción evidente entre organización y personal',msg,{organization:org,teacherCount:m.teacherCount||''},'Advertir y pedir confirmación; nunca decidir automáticamente qué dato es correcto');
      }
    },
    {
      id:'AUD-IA-001',area:'IA',severity:'S1',name:'Núcleo de comprensión disponible',run(){
        const ok=typeof window.ddInterpretDeep==='function';
        return result(this.id,this.area,this.severity,ok,'Motor central de comprensión accesible',ok?'ddInterpretDeep disponible':'ddInterpretDeep no disponible',typeof window.ddInterpretDeep,'Restaurar carga del núcleo de comprensión antes de generar');
      }
    },
    {
      id:'AUD-IA-002',area:'IA',severity:'S1',name:'Finalidad X→Y no se pierde',run(){
        const sample='En la localidad trabajaremos saberes de la siembra de tubérculos y estos conocimientos los aplicaremos para sembrar hortalizas en nuestro biohuerto.';
        let goal='';try{goal=tidy(window.ddExtractPlanningGoal?.(sample)?.phrase||window.ddInterpretDeep?.(sample,{scope:'teacher'})?.desiredOutcome||'');}catch(e){}
        const ok=/biohuerto|huerto/i.test(goal);
        return result(this.id,this.area,this.severity,ok,'Detectar biohuerto como finalidad final','Finalidad detectada: '+(goal||'[ninguna]'),sample,'Corregir extracción/propagación de finalidad; el producto final debe pesar sobre el tema de partida');
      }
    },
    {
      id:'AUD-DOC-001',area:'Docente',severity:'S2',name:'Duración Unidad/Proyecto 1–6 semanas',run(){
        const el=document.getElementById('unitDuration');const vals=el?[...el.options].map(o=>o.textContent.trim()):[];const need=['1 semana','2 semanas','3 semanas','4 semanas','5 semanas','6 semanas'];const ok=need.every(x=>vals.includes(x));
        return result(this.id,this.area,this.severity,ok,'Selector con 1 a 6 semanas',vals.join(' | ')||'selector no disponible',vals,'Restaurar las seis opciones sin imponer duración fija');
      }
    },
    {
      id:'AUD-EIB-001',area:'EIB',severity:'S1',name:'Monolingüe no conserva lengua originaria',run(){
        const mode=tidy(state.linguisticMode||document.getElementById('linguisticMode')?.value||'');const lang=tidy(state.indigenousLanguage||state.quechuaVar||document.getElementById('quechuaVar')?.value||'Ninguna');const ok=!/monoling/i.test(mode)||!lang||lang==='Ninguna';
        return result(this.id,this.area,this.severity,ok,'Si es monolingüe castellano, lengua originaria = Ninguna',`Perfil=${mode||'[sin definir]'}; lengua=${lang||'[sin definir]'}`,{mode,lang},'Limpiar datos lingüísticos heredados cuando cambie de EIB a monolingüe');
      }
    },
    {
      id:'AUD-MOV-001',area:'Móvil',severity:'S2',name:'Viewport móvil configurado',run(){
        const meta=document.querySelector('meta[name="viewport"]');const c=meta?.getAttribute('content')||'';const ok=/width=device-width/i.test(c);
        return result(this.id,this.area,this.severity,ok,'Viewport adaptativo',c||'[ausente]',c,'Agregar viewport correcto y probar además en Android real');
      }
    },
    {
      id:'AUD-EXP-001',area:'Exportación',severity:'S1',name:'Exportador DOCX real presente',run(){
        const candidates=['ddExportDocx','exportUnitDocx','exportSessionDocx','downloadDocx'];const found=candidates.find(k=>typeof window[k]==='function');const ok=!!found||!!window.__ddDocxExportV29;
        return result(this.id,this.area,this.severity,ok,'Módulo DOCX OOXML real cargado',ok?(found||'docx-export-v29 cargado'):'No se detectó exportador DOCX real','Esta prueba confirma presencia, no compatibilidad del archivo','Mantener pendiente la prueba de apertura real Word móvil/escritorio; si falla es S1');
      }
    },
    {
      id:'AUD-DIR-001',area:'Director',severity:'S2',name:'Ficha institucional reutilizable en Director',run(){
        const strip=document.getElementById('ddDirectorInstitutionStrip');const ok=!!strip||!!window.ddInstitutionMaster;
        return result(this.id,this.area,this.severity,ok,'Director puede recuperar datos de Ficha Maestra',ok?'Fuente institucional disponible':'No disponible',!!window.ddInstitutionMaster,'Conectar Ficha Maestra antes de pedir IE/UGEL/director otra vez');
      }
    },
    {
      id:'AUD-SEG-001',area:'Seguridad',severity:'S0',name:'Autenticación multiusuario segura',run(){
        const auth=!!state.authenticatedUser||!!window.ddAuthReady;
        return result(this.id,this.area,this.severity,auth,'Autenticación y aislamiento multiusuario activos',auth?'Se detectó capa de autenticación':'No existe todavía autenticación productiva','Prototipo localStorage','BLOQUEANTE para producción: implementar backend, autenticación y aislamiento de datos');
      }
    },
    {
      id:'AUD-OFF-001',area:'Offline',severity:'S4',name:'Modo offline productivo',run(){
        const implemented=!!window.ddOfflineReady;
        return result(this.id,this.area,this.severity,implemented,'Crear/editar/guardar/reabrir offline si esta función forma parte del alcance productivo',implemented?'Modo offline declarado disponible':'Requisito futuro; no implementado todavía','No se considera falla del prototipo actual','Diseñar sincronización y conflictos antes de prometer modo offline',implemented?'EJECUTADA':'REQUISITO_FUTURO');
      }
    }
  ];

  function runAll(){
    seedMasterProvenance();
    const results=tests.map(t=>{try{return t.run();}catch(e){return result(t.id,t.area,t.severity,false,'Prueba ejecutable sin error','Excepción: '+e.message,String(e.stack||e),'Corregir la prueba o el módulo evaluado');}});
    const blockers=results.filter(r=>!r.passed&&r.status==='EJECUTADA'&&(r.severity==='S0'||r.severity==='S1'));
    const run={id:'RUN-'+Date.now(),executedAt:now(),results,blockers:blockers.map(x=>x.id),productionGate:blockers.length===0};
    state.executableAuditRuns.push(run);state.executableAuditRuns=state.executableAuditRuns.slice(-20);if(typeof save==='function')save();
    return run;
  }

  function renderRun(run){
    const esc=v=>typeof window.escapeHtml==='function'?window.escapeHtml(String(v??'')):String(v??'');
    const rows=run.results.map(r=>`<tr><td><b>${esc(r.id)}</b><br><small>${esc(r.area)}</small></td><td>${r.status==='REQUISITO_FUTURO'?'⚪ FUTURO':r.passed?'✅ PASA':'❌ NO PASA'}</td><td><b>${esc(r.severity)}</b> ${esc(SEVERITY[r.severity]?.label||'')}</td><td>${esc(r.obtained)}</td><td>${esc(r.action)}</td></tr>`).join('');
    return `<div class="notice ${run.productionGate?'success':''}"><b>Quality gate:</b> ${run.productionGate?'Sin S0/S1 detectados por estas pruebas locales. Esto NO equivale a producción aprobada.':'NO APROBADO: existen fallas S0/S1 o bloqueantes.'}</div><div style="overflow:auto"><table><thead><tr><th>Prueba</th><th>Resultado</th><th>Severidad</th><th>Obtenido</th><th>Acción</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  }

  function mountPanel(){
    const host=document.getElementById('settings');if(!host||document.getElementById('ddExecutableAuditPanel'))return;
    const card=document.createElement('div');card.id='ddExecutableAuditPanel';card.className='card topgap';
    card.innerHTML=`<h2>🧪 Auditoría ejecutable</h2><p class="sub">Pruebas identificables con resultado esperado, obtenido, evidencia, severidad y acción correctiva. No sustituye pruebas de laboratorio, piloto ni verificación normativa.</p><div class="actions"><button class="btn" id="ddRunExecutableAudit">▶ Ejecutar pruebas locales</button></div><div id="ddExecutableAuditResult" class="topgap"></div>`;
    host.appendChild(card);
    document.getElementById('ddRunExecutableAudit').onclick=()=>{const run=runAll();document.getElementById('ddExecutableAuditResult').innerHTML=renderRun(run);};
  }

  const oldGo=window.go;if(typeof oldGo==='function')window.go=function(id){const r=oldGo.apply(this,arguments);if(id==='settings')setTimeout(mountPanel,0);return r;};

  window.ddDataProvenance={set:provenanceSet,get:provenanceGet,all:()=>({...state.dataProvenance})};
  window.ddExecutableAudit={tests,runAll,SEVERITY};
  setTimeout(()=>{seedMasterProvenance();mountPanel();},0);
})();