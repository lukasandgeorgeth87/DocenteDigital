/* DocenteDigital – Superficie simple v55
   Auditoría de simplicidad aplicada al Modo Fácil.
   Regla: potente por dentro, simple por fuera.

   En Modo Fácil:
   - oculta Biblioteca Maestra, autores, estado normativo y motor pedagógico;
   - compacta el contexto cargado;
   - deja visibles solo las decisiones necesarias para preparar la sesión;
   - mantiene estrategias/configuración avanzada en Modo Experto;
   - acorta el botón principal.

   No elimina datos ni reglas internas: solo reduce carga visual.
*/
(function(){
  if(window.__ddEasySurfaceSimplicityV55)return;window.__ddEasySurfaceSimplicityV55=true;
  if(typeof state!=='object')return;

  const tidy=v=>String(v??'').replace(/\s+/g,' ').trim();
  const esc=v=>typeof window.escapeHtml==='function'?window.escapeHtml(String(v??'')):String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const easy=()=>state.mode!=='expert';
  const visible=el=>!!el&&!!(el.offsetWidth||el.offsetHeight||el.getClientRects().length)&&getComputedStyle(el).display!=='none'&&getComputedStyle(el).visibility!=='hidden';

  function markTechnical(){
    const session=document.getElementById('session');
    if(!session)return;
    ['#ddSessionSources','#ddSessionEngineBadge','.dd-engine-badge','.dd-source-strip','.dd-lib-audit-note'].forEach(sel=>{
      session.querySelectorAll(sel).forEach(x=>x.classList.add('dd-easy-technical'));
    });
    [...session.children].forEach(el=>{
      const t=tidy(el.textContent);
      if(/Biblioteca Maestra activa|Motor pedagógico activo|PENDIENTE DE VERIFICACIÓN|autores? de apoyo|jerarquía de fuentes/i.test(t))el.classList.add('dd-easy-technical');
    });
    const strategy=document.getElementById('ddStrategyProfile');
    if(strategy?.closest('label'))strategy.closest('label').classList.add('dd-easy-advanced');
    session.querySelectorAll('.expert-only').forEach(x=>x.classList.add('dd-easy-advanced'));
  }

  function compactContext(){
    const box=document.getElementById('sessionContext');if(!box)return;
    if(easy()){
      const level=tidy(state.level)||'Nivel';
      const type=tidy(state.ieType)||'IE';
      const grades=Array.isArray(state.grades)&&state.grades.length?state.grades.join(', '):'';
      box.classList.add('dd-session-context-compact');
      box.innerHTML=`<span><b>${esc(level)} · ${esc(type)}${grades?` · ${esc(grades)}`:''}</b></span><span class="dd-mini-ok">✓ Datos cargados</span>`;
    }else{
      box.classList.remove('dd-session-context-compact');
      const areas=Array.isArray(state.areas)?state.areas.join(', '):'';
      const grades=Array.isArray(state.grades)?state.grades.join(', '):'';
      box.innerHTML=`<b>Contexto cargado:</b> ${esc(state.level||'')} · ${esc(state.ieType||'')} · ${esc(grades)}${areas?` · ${esc(areas)}`:''}<br>La app reutiliza esta información y no vuelve a pedirla.`;
    }
  }

  function simplifyLabels(){
    const session=document.getElementById('session');if(!session)return;
    const setLabel=(id,label)=>{
      const field=document.getElementById(id),host=field?.closest('label');if(!host)return;
      if(!host.dataset.dd55OriginalLabel){
        const first=[...host.childNodes].find(n=>n.nodeType===Node.TEXT_NODE&&tidy(n.textContent));
        if(first)host.dataset.dd55OriginalLabel=tidy(first.textContent);
      }
      const first=[...host.childNodes].find(n=>n.nodeType===Node.TEXT_NODE&&tidy(n.textContent));
      if(first)first.textContent=(easy()?label:(host.dataset.dd55OriginalLabel||label))+' ';
    };
    setLabel('sessionUnit','Unidad / Proyecto');
    setLabel('activity','Actividad');
    setLabel('sessionTitle','Título');
  }

  function simplifyPrimaryAction(){
    const session=document.getElementById('session');if(!session)return;
    const b=[...session.querySelectorAll('button')].find(x=>/generateSession\(\)/.test(x.getAttribute('onclick')||'')||/PREPARAR MI SESIÓN MAESTRA|PREPARAR MI SESION MAESTRA/i.test(tidy(x.textContent)));
    if(!b)return;
    if(!b.dataset.dd55FullLabel)b.dataset.dd55FullLabel=tidy(b.textContent)||'Preparar mi sesión maestra';
    b.textContent=easy()?'✨ Preparar sesión':b.dataset.dd55FullLabel;
    b.classList.add('dd-session-primary');
  }

  function simplifySession(){
    markTechnical();
    compactContext();
    simplifyLabels();
    simplifyPrimaryAction();
    const session=document.getElementById('session');
    if(session)session.classList.toggle('dd-simple-session',easy());
  }

  // Auditoría adicional: previene que vuelva a llenarse la parte superior de la sesión.
  const simplicityTest={
    id:'AUD-USO-010',area:'Simplicidad',severity:'S2',name:'Sesión simple antes de la acción',
    run(){
      const session=document.getElementById('session');
      if(!session||!easy())return {id:this.id,area:this.area,severity:this.severity,passed:true,status:'EJECUTADA',expected:'Modo Fácil sin bloques técnicos antes de crear la sesión',obtained:'No aplica en Modo Experto o pantalla ausente',evidence:{mode:state.mode},action:'Repetir en Modo Fácil',executedAt:new Date().toISOString()};
      const technical=[...session.querySelectorAll('#ddSessionSources,#ddSessionEngineBadge,.dd-source-strip,.dd-engine-badge,.dd-easy-technical')].filter(visible);
      const context=document.getElementById('sessionContext');
      const contextText=tidy(context?.textContent);
      const primary=[...session.querySelectorAll('button')].find(x=>/Preparar sesión/i.test(tidy(x.textContent)));
      const ok=technical.length===0&&contextText.length<=90&&!!primary;
      return {id:this.id,area:this.area,severity:this.severity,passed:ok,status:'EJECUTADA',expected:'Sin biblioteca/autores/motor visible; contexto breve; acción principal corta',obtained:ok?'Superficie simple':'Persisten elementos de sobrecarga visual',evidence:{technicalVisible:technical.length,contextLength:contextText.length,primaryLabel:tidy(primary?.textContent)},action:'Ocultar información técnica y mover opciones avanzadas a Experto',executedAt:new Date().toISOString()};
    }
  };
  function attachAudit(){
    const base=window.ddExecutableAudit;if(!base||!Array.isArray(base.tests))return false;
    if(!base.tests.some(t=>t.id===simplicityTest.id))base.tests.push(simplicityTest);
    return true;
  }

  const baseRefresh=window.refresh;
  if(typeof baseRefresh==='function')window.refresh=function(){
    const r=baseRefresh.apply(this,arguments);setTimeout(simplifySession,0);return r;
  };
  const baseGo=window.go;
  if(typeof baseGo==='function')window.go=function(id){
    const r=baseGo.apply(this,arguments);if(id==='session')setTimeout(simplifySession,0);return r;
  };
  const baseSetMode=window.setMode;
  if(typeof baseSetMode==='function')window.setMode=function(mode){
    const r=baseSetMode.apply(this,arguments);setTimeout(simplifySession,0);return r;
  };

  // Algunos módulos antiguos insertan avisos después del render. Solo los marcamos;
  // el CSS decide si se ven en Fácil o Experto.
  const observer=new MutationObserver(muts=>{
    if(!document.getElementById('session')?.classList.contains('active'))return;
    if(muts.some(m=>m.addedNodes?.length))setTimeout(()=>{markTechnical();simplifyPrimaryAction();},0);
  });
  observer.observe(document.body,{childList:true,subtree:true});

  let tries=0;const auditTimer=setInterval(()=>{tries++;if(attachAudit()||tries>20)clearInterval(auditTimer);},100);
  setTimeout(simplifySession,0);

  const css=document.createElement('style');css.textContent=`
    body:not(.expert) .dd-source-strip,
    body:not(.expert) .dd-engine-badge,
    body:not(.expert) #ddSessionSources,
    body:not(.expert) #ddSessionEngineBadge,
    body:not(.expert) #session .dd-easy-technical,
    body:not(.expert) #session .dd-easy-advanced{display:none!important}
    body:not(.expert) #session>p.sub{display:none!important}
    body:not(.expert) #session.dd-simple-session{max-width:1120px}
    body:not(.expert) #session.dd-simple-session>h1{margin-bottom:14px}
    body:not(.expert) #session.dd-simple-session>.card{padding:18px;border-radius:18px}
    body:not(.expert) #session .dd-session-context-compact{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 12px;margin-bottom:14px;background:#f4faf6;border:1px solid #cfe6d6;border-radius:12px;line-height:1.25}
    body:not(.expert) #session .dd-mini-ok{white-space:nowrap;font-size:12px;font-weight:800;color:#2f6b45}
    body:not(.expert) #session .form2{gap:12px}
    body:not(.expert) #session label{font-weight:700}
    body:not(.expert) #session select,
    body:not(.expert) #session input{min-height:46px}
    body:not(.expert) #session .dd-session-primary{font-size:16px;min-height:48px;text-transform:none;letter-spacing:0}
    @media(max-width:720px){
      body:not(.expert) #session.dd-simple-session>.card{padding:13px}
      body:not(.expert) #session .dd-session-context-compact{align-items:flex-start;flex-direction:column;gap:5px}
      body:not(.expert) #session .dd-mini-ok{font-size:11px}
    }
  `;document.head.appendChild(css);

  window.ddEasySurfaceSimplicityV55={apply:simplifySession,test:()=>simplicityTest.run()};
})();