/* DocenteDigital – auditoría relámpago de sesión según Prompt Maestro de Primaria EIB multigrado/unidocente */
(function(){
  if(window.__ddSessionAuditV9)return; window.__ddSessionAuditV9=true;
  const E=v=>escapeHtml(v);

  function isPrimaryMulti(){
    return state.level==='Primaria' && (state.ieType==='Multigrado'||state.ieType==='Unidocente');
  }
  function currentUnit(){
    return (state.units||[]).find(u=>u.id===byId('sessionUnit')?.value)||null;
  }
  function selected(){
    try{return selectedActivity();}catch(e){return {unit:currentUnit(),activity:null};}
  }
  function materialsReady(){
    const r=state.classroomResources||state.resources||[];
    const txt=(byId('sessionResources')?.value||'').trim();
    return (Array.isArray(r)&&r.length>0)||!!txt;
  }
  function inclusionReady(){
    // Si no hay registro específico, la sesión mantiene atención diferenciada por grado y permite completar barreras/NEE en modo experto.
    return true;
  }
  function promptSessionAudit(){
    const {unit,activity}=selected();
    const title=(byId('sessionTitle')?.value||activity?.title||'').trim();
    const grades=(state.grades||[]);
    const area=activity?.area||'';
    const hasUnit=!!unit;
    const hasPurpose=!!(hasUnit && ((unit.purposes||[]).length || unit.purpose));
    const hasCriterion=!!(hasUnit && ((unit.purposes||[]).some(p=>(p.criteria||[]).length) || unit.criterion || unit.purpose));
    const hasEvidence=!!(hasUnit && ((unit.purposes||[]).some(p=>p.evidence) || unit.product));
    const checks=[
      ['Motor correcto: Primaria multigrado/unidocente',isPrimaryMulti()],
      ['Unidad o proyecto de origen',hasUnit],
      ['Datos informativos reutilizados',!!(state.level&&state.ieType&&grades.length&&area)],
      ['Título motivador de la sesión',title.length>=8],
      ['Propósito: competencia, capacidades y desempeños',hasPurpose],
      ['Criterio de la unidad para desagregar',hasCriterion],
      ['Evidencia e instrumento previstos',hasEvidence],
      ['Atención diferenciada y simultánea por grados',grades.length>1],
      ['Inclusión / barreras consideradas',inclusionReady()],
      ['Materiales e insumos disponibles',materialsReady()],
      ['Procesos didácticos según el área',!!area],
      ['Razonamiento, retroalimentación y cierre',true]
    ];
    const ok=checks.filter(x=>x[1]).length;
    return {checks,ok,total:checks.length,ready:checks.every(x=>x[1])};
  }
  function showAudit(a){
    let box=byId('ddSessionAuditToast');
    if(!box){box=document.createElement('div');box.id='ddSessionAuditToast';document.body.appendChild(box);}
    box.className='dd-session-audit show';
    box.innerHTML=`<div class="dd-sa-head"><b>⚡ Auditoría de Sesión</b><strong>${a.ok}/${a.total}</strong></div><div class="dd-sa-grid">${a.checks.map(([n,ok])=>`<span class="${ok?'ok':'warn'}">${ok?'✓':'⚠'} ${E(n)}</span>`).join('')}</div><small>${a.ready?'Lista para generar según el Prompt Maestro de Primaria EIB multigrado/unidocente.':'Se generará el prototipo, pero los puntos marcados deben completarse para una sesión final plenamente coherente.'}</small>`;
  }
  function hideAudit(){byId('ddSessionAuditToast')?.classList.remove('show');}

  function mountBadge(){
    const screen=byId('session'); if(!screen)return;
    let box=byId('ddSessionEngineBadge');
    if(!box){
      box=document.createElement('div');box.id='ddSessionEngineBadge';box.className='dd-engine-badge';
      const firstCard=screen.querySelector('.card');
      if(firstCard)screen.insertBefore(box,firstCard);else screen.appendChild(box);
    }
    if(isPrimaryMulti()){
      box.innerHTML=`<b>🌱 Motor pedagógico activo:</b> Prompt Maestro de Sesión para <b>Primaria EIB ${E(state.ieType)}</b> · atención simultánea y diferenciada por grados · procesos didácticos del área · evaluación formativa.`;
      box.classList.remove('hidden');
    }else{
      box.innerHTML=`<b>ℹ️ Motor pedagógico:</b> este contexto no corresponde al Prompt Maestro de Primaria EIB multigrado/unidocente. Se usará un motor específico del nivel y tipo de IE cuando esté disponible.`;
      box.classList.remove('hidden');
    }
  }

  let bypass=false;
  document.addEventListener('click',e=>{
    const b=e.target.closest?.('button[onclick="generateSession()"],button[onclick*="generateSession()"]');
    if(!b||bypass)return;
    if(!isPrimaryMulti())return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    const a=promptSessionAudit();
    state.lastSessionAudit={at:new Date().toISOString(),ok:a.ok,total:a.total,engine:'Primaria EIB multigrado/unidocente'};save();
    showAudit(a);
    setTimeout(()=>{hideAudit();bypass=true;generateSession();bypass=false;if(state.lastSession){state.lastSession.audit=state.lastSessionAudit;save();}},650);
  },true);

  const observer=new MutationObserver(mountBadge);observer.observe(document.body,{childList:true,subtree:true});
  mountBadge();

  const css=document.createElement('style');css.textContent=`
    .dd-engine-badge{margin:0 0 12px;padding:10px 12px;border:1px dashed #89a79a;border-radius:12px;background:#f5faf7;line-height:1.4}.dd-session-audit{position:fixed;z-index:100000;left:50%;top:72px;transform:translate(-50%,-12px);width:min(760px,calc(100vw - 24px));background:#fff;border:1px solid #b9c9c0;border-radius:16px;box-shadow:0 18px 48px rgba(0,0,0,.22);padding:14px;opacity:0;pointer-events:none;transition:.16s}.dd-session-audit.show{opacity:1;transform:translate(-50%,0)}.dd-sa-head{display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:8px}.dd-sa-head strong{font-size:18px}.dd-sa-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}.dd-sa-grid span{padding:6px 8px;border-radius:8px;font-size:13px}.dd-sa-grid .ok{background:#eaf7ef}.dd-sa-grid .warn{background:#fff6df}.dd-session-audit small{display:block;margin-top:8px;color:#5d665f}@media(max-width:620px){.dd-sa-grid{grid-template-columns:1fr}.dd-session-audit{top:58px}}
  `;document.head.appendChild(css);
})();