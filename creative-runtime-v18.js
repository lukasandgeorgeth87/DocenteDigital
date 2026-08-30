/* DocenteDigital – adaptador creativo para flujo existente v18 */
(function(){
  if(window.__ddCreativeRuntimeV18)return;window.__ddCreativeRuntimeV18=true;
  if(!window.ddCreativeChoices)return;
  const E=v=>escapeHtml(v);

  function pending(){return state.pendingUnitChoice||null;}
  function ensureCreativeData(){
    const p=pending();if(!p)return null;
    if(!p._creativeData){p._creativeData=window.ddCreativeChoices(p.brief,p.type,{situations:p.situations,products:p.products});save();}
    return p._creativeData;
  }
  function paintSituations(){
    const host=byId('ddProposalChooser'),p=pending(),d=ensureCreativeData();if(!host||!p||!d)return;
    if(!host.querySelector('input[name="ddSituation"]'))return;
    d.situations.forEach(x=>{
      const input=host.querySelector(`input[name="ddSituation"][value="${x.key}"]`),card=input?.closest('.dd-choice-card');if(!card)return;
      const h=card.querySelector('h3'),txt=card.querySelector('p');if(h)h.textContent=x.title;if(txt)txt.textContent=x.text;
    });
    const intro=host.querySelector('.dd-choice-intro p');if(intro)intro.innerHTML='La app propone <b>dos opciones nuevas</b> cada vez. Conservan contexto, problema/necesidad y <b>un reto claro</b>, pero evitan repetir inmediatamente la misma redacción.';
    if(!host.querySelector('.dd-new-ideas-note')){const n=document.createElement('div');n.className='dd-new-ideas-note';n.innerHTML='✨ <b>Motor creativo activo:</b> si vuelves a crear otra planificación sobre el mismo tema, se priorizarán otras situaciones.';host.querySelector('.dd-choice-intro')?.appendChild(n);}
  }
  function paintProducts(){
    const host=byId('ddProposalChooser'),d=ensureCreativeData();if(!host||!d||!host.querySelector('input[name="ddProduct"]'))return;
    d.products.forEach(x=>{
      const input=host.querySelector(`input[name="ddProduct"][value="${x.key}"]`),card=input?.closest('.dd-choice-card');if(!card)return;
      const h=card.querySelector('h3'),txt=card.querySelector('p');if(h)h.textContent=x.title;if(txt)txt.textContent=x.text;
    });
    const intro=host.querySelector('.dd-choice-intro p');if(intro)intro.innerHTML='Con la situación elegida, DocenteDigital propone <b>tres productos diferentes</b> y evita repetir inmediatamente los ya ofrecidos para este tema.';
    if(!host.querySelector('.dd-new-ideas-note')){const n=document.createElement('div');n.className='dd-new-ideas-note';n.innerHTML='✨ <b>No repetición inmediata:</b> el motor recuerda productos usados y recorre otras alternativas antes de volver a ellos.';host.querySelector('.dd-choice-intro')?.appendChild(n);}
  }
  function creativeSituationSelected(){
    const own=(byId('ddOwnSituation')?.value||'').trim();if(own)return own;
    const key=document.querySelector('input[name="ddSituation"]:checked')?.value,d=ensureCreativeData();return d?.situations.find(x=>x.key===key)?.text||'';
  }
  function creativeProductSelected(){
    const own=(byId('ddOwnProduct')?.value||'').trim();if(own)return{title:'Producto propuesto por el docente',text:own};
    const key=document.querySelector('input[name="ddProduct"]:checked')?.value,d=ensureCreativeData(),x=d?.products.find(y=>y.key===key);return x?{title:x.title,text:x.text}:null;
  }

  document.addEventListener('click',e=>{
    const b=e.target.closest?.('button');if(!b)return;
    const on=b.getAttribute('onclick')||'';
    if(/createUnitDemo/.test(on)){
      state._ddTitleWasProvided=!!(byId('unitTitle')?.value||'').trim();save();
      setTimeout(()=>{const p=pending();if(p){delete p._creativeData;save();}paintSituations();},25);
      return;
    }
    if(b.id==='ddContinueProducts'){
      const chosen=creativeSituationSelected();
      setTimeout(()=>{const p=pending();if(p&&chosen){p.selectedSituation=chosen;save();}paintProducts();},25);return;
    }
    if(b.id==='ddBackSituation'){
      setTimeout(()=>{const p=pending();if(p){delete p._creativeData;save();}paintSituations();},25);return;
    }
    if(b.id==='ddBuildUnit'){
      const p=pending(),situation=(p?.selectedSituation||creativeSituationSelected()),product=creativeProductSelected();
      const before=new Set((state.units||[]).map(x=>x.id));const brief=p?.brief||byId('unitSituation')?.value||'',type=p?.type||byId('unitType')?.value||'Unidad de aprendizaje';
      setTimeout(()=>{
        const u=(state.units||[]).find(x=>!before.has(x.id))||(state.activeUnitId?(state.units||[]).find(x=>x.id===state.activeUnitId):null);if(!u)return;
        const d=p?._creativeData;
        if(situation)u.situation=situation;
        if(product){u.product=product.text;u.productTitle=product.title;}
        if(d){u.situationOptions=d.situations;u.productOptions=d.products;}
        if(!state._ddTitleWasProvided&&window.ddCreativeTitleOptions){const titles=window.ddCreativeTitleOptions(brief,type);if(titles?.length){u.title=titles[0];if(byId('unitTitle'))byId('unitTitle').value=u.title;}}
        u.creativeGeneration=true;u.creativeGenerationAt=new Date().toISOString();
        save();renderUnits();renderUnitOutput(u);fillSessionUnits();
      },80);
    }
  },true);

  const css=document.createElement('style');css.textContent=`.dd-new-ideas-note{margin-top:9px;padding:8px 10px;border-radius:10px;background:#eef7ff;border:1px solid #cfe1f0;font-size:13px}`;document.head.appendChild(css);
})();