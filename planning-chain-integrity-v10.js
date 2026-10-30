/* DocenteDigital — Fase 10: trazabilidad transversal de Unidad/Proyecto → sesión.
 * Evidencias y advertencias editables; no certifica desempeños curriculares.
 * No modifica registros antiguos ni reescribe el trabajo del docente.
 */
(function(){
  if(window.DD_PLANNING_CHAIN_V10)return;
  const E=v=>typeof window.escapeHtml==='function'?window.escapeHtml(String(v??''))
    :String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clean=v=>String(v??'').trim();
  const unique=values=>[...new Set((values||[]).map(clean).filter(Boolean))];
  const same=(a,b)=>JSON.stringify(unique(a).slice().sort())===JSON.stringify(unique(b).slice().sort());
  const norm=s=>clean(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ');
  const issues=(id,message,field='coherencia')=>({id,message,field});
  const hasArea=(unit,area)=>unique(unit.areas).some(a=>norm(a)===norm(area));

  function auditUnit(unit){
    const warnings=[];
    if(!unit||typeof unit!=='object')return {ok:false,warnings:[issues('not-unit','Unidad o proyecto no disponible.')],checks:[]};
    const checks=[
      {name:'Situación significativa',present:!!clean(unit.situation||unit.situationBrief)},
      {name:'Reto',present:!!clean(unit.reto)},
      {name:'Producto o evidencia integradora',present:!!clean(unit.product)},
      {name:'Secuencia de actividades',present:Array.isArray(unit.activities)&&unit.activities.length>0},
      {name:'Nivel y grados seleccionados',present:!!clean(unit.level)&&unique(unit.grades).length>0},
    ];
    checks.filter(x=>!x.present).forEach(x=>warnings.push(issues('missing-'+norm(x.name),`${x.name}: falta completar o confirmar este componente.`,x.name)));
    const selected=unique(unit.areas);
    (Array.isArray(unit.activities)?unit.activities:[]).forEach((a,i)=>{
      if(!clean(a.title)||!clean(a.area))warnings.push(issues('activity-incomplete-'+i,`Actividad ${i+1}: falta título o área.`, 'secuencia'));
      else if(selected.length&&!hasArea(unit,a.area))warnings.push(issues('activity-area-'+i,`Actividad ${i+1} (${clean(a.title)}): el área ${clean(a.area)} no está entre las seleccionadas.`, 'secuencia'));
    });
    return {ok:warnings.length===0,warnings,checks,selectedGrades:unique(unit.grades),activityCount:unit.activities?.length||0};
  }
  function getUnit(session){return (typeof state==='object'&&Array.isArray(state.units)?state.units:[]).find(u=>u.id===session?.unitId)||null;}
  function snapshot(unit,session){
    if(!unit)return null;
    const a=unit.activities?.[session.activityIndex]||null;
    return {
      unitId:unit.id,unitTitle:unit.title||'',level:unit.level||'',
      ieType:unit.ieType||'',grades:unique(unit.grades),language:unit.language||'',
      situation:unit.situation||unit.situationBrief||'',
      challenge:unit.reto||'',product:unit.product||'',
      activityTitle:a?.title||session.activitySnapshot?.title||'',
      activityArea:a?.area||session.activitySnapshot?.area||'',
      activityIndex:session.activityIndex,
      capturedAt:session.createdAt||new Date().toISOString()
    };
  }
  function auditSession(session){
    if(!session||typeof session!=='object')return {ok:false,warnings:[issues('no-session','No existe una sesión para revisar.')],context:null};
    const warnings=[];
    const unit=getUnit(session);
    const context=session.planningChainSnapshot||snapshot(unit,session);
    if(session.unitId&&!unit&&!context)warnings.push(issues('missing-unit','No se encontró la unidad/proyecto de origen ni su contexto archivado.','vínculo'));
    if(context){
      if(context.level&&session.level&&context.level!==session.level)warnings.push(issues('level-mismatch','El nivel educativo es diferente al de la unidad/proyecto original.','nivel'));
      if(context.grades?.length&&!same(session.grades,context.grades))warnings.push(issues('grades-mismatch','Los grados de esta sesión no coinciden con los de la unidad/proyecto original.','grados'));
      if(context.activityArea&&norm(context.activityArea)!==norm(session.area))warnings.push(issues('area-mismatch','El área de la sesión difiere del área de la actividad planificada.','área'));
      if(context.activityTitle&&norm(context.activityTitle)!==norm(session.title))warnings.push(issues('title-edited','El título fue editado respecto a la actividad planificada. Verifica que propósito, competencia y criterio sigan correspondiendo.','actividad'));
      if(!clean(context.challenge))warnings.push(issues('no-challenge','La unidad/proyecto no registra un reto explícito. Revísalo antes de aplicar la sesión.','reto'));
      if(!clean(context.product))warnings.push(issues('no-product','La unidad/proyecto no registra un producto integrador. Revísalo antes de aplicar la sesión.','producto'));
    }else warnings.push(issues('no-snapshot','Sesión antigua o de ejemplo: verificar manualmente el vínculo con una unidad/proyecto.','vínculo'));
    if(!clean(session.criterion))warnings.push(issues('no-criterion','Falta el criterio de evaluación de la sesión.','evaluación'));
    if(!clean(session.evidence))warnings.push(issues('no-evidence','Falta la evidencia que observará el docente.','evaluación'));
    if(!clean(session.purpose))warnings.push(issues('no-purpose','Falta el propósito de aprendizaje.','propósito'));
    return {ok:warnings.length===0,warnings,context,unitFound:!!unit};
  }
  const warningList=warnings=>warnings.length
    ?`<ul>${warnings.map(w=>`<li>${E(w.message)}</li>`).join('')}</ul>`
    :'<p>Sin alertas estructurales detectadas. Esta revisión no certifica pertinencia didáctica ni desempeños MINEDU.</p>';
  function unitPanel(unit){
    const a=auditUnit(unit);
    const summary=a.checks.map(c=>`<tr><td>${E(c.name)}</td><td>${c.present?'Presente':'Por revisar'}</td></tr>`).join('');
    return `<section class="dd-phase10-audit" aria-label="Revisión de coherencia de unidad o proyecto"><h2>VERIFICACIÓN DE COHERENCIA (FASE 10)</h2><p>Comprobación estructural automática; una sesión o producto no se considera curricularmente validado solo por superar esta lista.</p><table><tr><th>Componente</th><th>Estado</th></tr>${summary}</table>${warningList(a.warnings)}</section>`;
  }
  function sessionPanel(session){
    const a=auditSession(session),c=a.context;
    const rows=c?[
      ['Unidad/Proyecto',c.unitTitle],['Situación de origen',c.situation],['Reto original',c.challenge],
      ['Producto integrador',c.product],['Actividad planificada',c.activityTitle],
      ['Área original',c.activityArea],['Grados originales',(c.grades||[]).join(', ')]
    ]:[];
    return `<section class="dd-phase10-audit" aria-label="Verificación de trazabilidad de la sesión"><h2>10. TRAZABILIDAD UNIDAD/PROYECTO → SESIÓN</h2><p>Los datos de origen se congelan al crear la sesión; se muestran para contrastar la finalidad de la unidad con esta actividad. La edición docente es válida y requiere revisar la correspondencia pedagógica.</p>${rows.length?`<table><tr><th>Elemento</th><th>Referencia al crear la sesión</th></tr>${rows.map(([k,v])=>`<tr><td>${E(k)}</td><td>${E(v||'Por verificar')}</td></tr>`).join('')}</table>`:''}<h3>${a.ok?'Verificación estructural sin alertas':'Aspectos que requieren revisión'}</h3>${warningList(a.warnings)}<p><small>Los criterios y evidencias son propuestas editables. Contrastar competencias, estándares y desempeños con el programa curricular del nivel antes de aplicar.</small></p></section>`;
  }
  const originalBuild=window.buildSession;
  if(typeof originalBuild==='function')window.buildSession=function(){
    const s=originalBuild.apply(this,arguments),u=getUnit(s);
    if(s&&u){s.planningChainSnapshot=snapshot(u,s);if(typeof save==='function')save();}
    return s;
  };
  const originalUnit=window.unitWordHtml;
  if(typeof originalUnit==='function')window.unitWordHtml=function(unit){
    const html=originalUnit.apply(this,arguments);
    return typeof html==='string'&&unit&&!html.includes('dd-phase10-audit')?html+unitPanel(unit):html;
  };
  const originalSession=window.sessionHtml;
  if(typeof originalSession==='function')window.sessionHtml=function(session,forWord=false){
    const html=originalSession.apply(this,arguments);
    return typeof html==='string'&&session&&!html.includes('dd-phase10-audit')?html+sessionPanel(session):html;
  };
  // El mismo control visible en la vista previa de Unidad/Proyecto.
  const originalPreview=window.renderUnitOutput;
  if(typeof originalPreview==='function')window.renderUnitOutput=function(unit){
    const r=originalPreview.apply(this,arguments),target=document.getElementById('unitOutput');
    if(unit&&target&&typeof target.insertAdjacentHTML==='function'){
      target.querySelectorAll?.('.dd-phase10-preview')?.forEach(node=>node.remove());
      target.insertAdjacentHTML('beforeend',`<div class="dd-phase10-preview">${unitPanel(unit)}</div>`);
    }
    return r;
  };
  window.DD_PLANNING_CHAIN_V10={auditUnit,auditSession,snapshot,unitPanel,sessionPanel,version:'10.0'};
})();
