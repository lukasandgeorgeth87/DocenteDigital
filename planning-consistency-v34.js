/* DocenteDigital – coherencia de fases y perfil v34
   Corrige dos regresiones seguras:
   1) una situación escrita por el docente no debe conservar reto/productos del texto anterior;
   2) Primaria multigrado/unidocente no debe rotularse EIB si el perfil es monolingüe.
*/
(function(){
  if(window.__ddPlanningConsistencyV34)return;window.__ddPlanningConsistencyV34=true;
  const tidy=s=>String(s||'').replace(/\s+/g,' ').trim();
  const E=v=>typeof window.escapeHtml==='function'?window.escapeHtml(String(v||'')):String(v||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function focusOf(m,raw){return tidy(m?.focus)||tidy(raw).slice(0,120)||'la situación descrita';}
  function challengeFor(m,focus){
    const p=tidy(m?.problem),g=tidy(m?.goal);
    if(p&&g)return `¿Cómo podemos comprender ${focus}, analizar la situación planteada y construir una respuesta sustentada que contribuya a ${g}?`;
    if(p)return `¿Qué necesitamos investigar y explicar sobre ${focus} para comprender mejor la situación y sustentar una respuesta pertinente con evidencias?`;
    if(g)return `¿Qué necesitamos comprender, investigar y poner en práctica sobre ${focus} para ${g}, y cómo demostraremos lo aprendido?`;
    return `¿Cómo podemos explorar y comprender mejor ${focus} para comunicar lo que descubrimos sin asumir hechos que todavía no han sido comprobados?`;
  }
  function productsFor(m,focus){
    const action=!!(tidy(m?.problem)||tidy(m?.goal));
    return [
      {key:'1',title:`Portafolio de evidencias sobre ${focus}`.slice(0,90),text:`Producción organizada con preguntas, registros, representaciones, explicaciones y conclusiones construidas a partir de la situación realmente planteada sobre ${focus}.`},
      {key:'2',title:`Muestra de hallazgos sobre ${focus}`.slice(0,90),text:`Presentación en la que los estudiantes comuniquen lo comprendido sobre ${focus}, utilizando evidencias obtenidas durante las actividades.`},
      action?{key:'3',title:`Respuesta sustentada frente a ${focus}`.slice(0,90),text:`Respuesta, propuesta o acción viable construida solo a partir de lo que la nueva situación permita investigar y comprobar sobre ${focus}.`}:{key:'3',title:`Mapa de preguntas y descubrimientos sobre ${focus}`.slice(0,90),text:`Organizador colectivo con preguntas iniciales, hallazgos y nuevas explicaciones construidas sobre ${focus}.`}
    ];
  }
  function derive(raw){
    const m=typeof window.ddUnderstandPlanningDescription==='function'?window.ddUnderstandPlanningDescription(raw):{raw,focus:raw};
    const expert=typeof window.ddExpertPlanningReasoning==='function'?window.ddExpertPlanningReasoning(raw,m):null;
    if(expert)return {meaning:m,reto:expert.reto,products:expert.products,expert};
    const focus=focusOf(m,raw);return {meaning:m,reto:challengeFor(m,focus),products:productsFor(m,focus),expert:null};
  }

  function renderDerivedProducts(d){
    const grid=document.querySelector('#ddProposalChooser .dd-product-grid');if(!grid||!d?.products)return;
    grid.innerHTML=d.products.map(x=>`<label class="dd-choice-card"><input type="radio" name="ddProduct" value="${E(x.key)}"><span class="pill">Producto ${E(x.key)}</span><h3>${E(x.title)}</h3><p>${E(x.text)}</p><b class="dd-pick">○ Elegir este producto</b></label>`).join('');
    grid.querySelectorAll('input[name="ddProduct"]').forEach(r=>r.addEventListener('change',()=>grid.querySelectorAll('.dd-choice-card').forEach(c=>c.classList.toggle('selected',!!c.querySelector('input')?.checked))));
    const intro=document.querySelector('#ddProposalChooser .dd-choice-intro p');if(intro)intro.textContent='Productos recalculados desde la situación escrita por el docente; no conservan dependencias del texto anterior.';
  }

  document.addEventListener('click',e=>{
    const b=e.target.closest?.('button');if(!b)return;
    if(b.id==='ddContinueProducts'){
      const own=tidy(document.getElementById('ddOwnSituation')?.value);
      if(own){
        const d=derive(own);state._ddCustomSituationDerived=d;
        if(state.pendingUnitChoice){state.pendingUnitChoice.meaning=d.meaning;state.pendingUnitChoice.reto=d.reto;state.pendingUnitChoice.expertReasoning=d.expert||null;state.pendingUnitChoice.products=d.products;state.pendingUnitChoice.pendingDerivedFromOriginal=false;}
        try{if(typeof save==='function')save();}catch(err){}
        setTimeout(()=>renderDerivedProducts(d),0);
      }else state._ddCustomSituationDerived=null;
    }
    const on=b.getAttribute('onclick')||'';
    if(/createUnitDemo/.test(on)){
      const raw=tidy(document.getElementById('unitSituation')?.value),title=document.getElementById('unitTitle');
      if(raw&&title&&!tidy(title.value)&&typeof window.ddExpertPlanningReasoning==='function'){
        const ex=window.ddExpertPlanningReasoning(raw);if(ex?.title)title.value=ex.title;
      }
    }
  },true);

  function correctBadge(){
    const box=document.getElementById('ddSessionEngineBadge');if(!box)return;
    if(state.level==='Primaria'&&(state.ieType==='Multigrado'||state.ieType==='Unidocente')){
      const ling=state.linguisticMode==='EIB'?`EIB · ${E(state.indigenousLanguage||state.quechuaVar||'lengua por confirmar')}`:state.linguisticMode==='Monolingüe castellano'?'monolingüe castellano':'perfil lingüístico por confirmar';
      box.innerHTML=`<b>🌱 Motor pedagógico activo:</b> Primaria ${E(state.ieType)} · <b>${ling}</b> · atención simultánea y diferenciada · procesos didácticos · evaluación formativa.`;
    }
  }
  const oldGo=window.go;if(typeof oldGo==='function')window.go=function(){const r=oldGo.apply(this,arguments);setTimeout(correctBadge,0);return r;};
  document.addEventListener('change',e=>{if(['linguisticMode','quechuaVar','language'].includes(e.target?.id))setTimeout(correctBadge,0)},true);
  setTimeout(correctBadge,0);
})();