/* DocenteDigital – interfaz simple de planificación v48
   Filosofía: la IA piensa mucho por dentro y muestra poco por fuera.
   Oculta diagnósticos internos y convierte productos en opciones concretas.
*/
(function(){
  if(window.__ddSimplePlanningUIV48)return;window.__ddSimplePlanningUIV48=true;
  const tidy=s=>String(s||'').replace(/\s+/g,' ').trim();
  const low=s=>tidy(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const E=v=>typeof escapeHtml==='function'?escapeHtml(String(v||'')):String(v||'');

  function planningTopic(raw){
    try{
      const a=window.ddAuditTitleContext?.(raw,document.getElementById('unitType')?.value||'Unidad de aprendizaje');
      if(tidy(a?.topic))return tidy(a.topic);
    }catch(e){}
    const s=low(raw);
    if(/hormigas?/.test(s))return'hormigas';
    if(/mariposas?/.test(s))return'mariposas';
    if(/abejas?/.test(s))return'abejas';
    if(/biohuerto/.test(s))return'biohuerto';
    const words=tidy(raw).replace(/[.,;:!?]/g,' ').split(/\s+/).filter(x=>x.length>3);
    return words.slice(0,2).join(' ')||'nuestro tema';
  }

  function compactProducts(raw){
    const s=low(raw),topic=planningTopic(raw);
    if(/biohuerto/.test(s)&&/(sembr|cultiv|hortaliza)/.test(s))return[
      'Biohuerto de hortalizas',
      'Diario de nuestro biohuerto',
      'Muestra del biohuerto y sus aprendizajes'
    ];
    if(/hormigas?/.test(s))return[
      'Observatorio de hormigas',
      'Mural científico sobre las hormigas',
      'Guía ilustrada sobre las hormigas'
    ];
    if(/mariposas?/.test(s))return[
      'Observatorio de mariposas',
      'Mural científico sobre las mariposas',
      'Guía ilustrada del ciclo de vida de las mariposas'
    ];
    if(/abejas?/.test(s))return[
      'Observatorio de abejas',
      'Mural científico sobre las abejas',
      'Guía ilustrada sobre las abejas y su importancia'
    ];
    if(/agua|yaku|riego/.test(s))return[
      'Guía para cuidar el agua',
      'Mural de acuerdos para el cuidado del agua',
      'Campaña escolar de uso responsable del agua'
    ];
    if(/residu|basura|contamin/.test(s))return[
      'Plan de manejo de residuos del aula',
      'Mural de clasificación de residuos',
      'Campaña para reducir residuos'
    ];
    const t=topic.length>42?topic.slice(0,42).replace(/\s+\S*$/,''):topic;
    return[
      `Mural de hallazgos sobre ${t}`,
      `Guía ilustrada sobre ${t}`,
      `Exposición de nuestros descubrimientos sobre ${t}`
    ];
  }

  function simplifyInterpretation(){
    const box=document.getElementById('ddIntentBox');
    if(!box)return;
    const label=box.querySelector('.dd-title-label');
    if(label)label.textContent='✨ Elige uno de estos títulos';
  }

  function compactProductCards(){
    const host=document.getElementById('ddProposalChooser');
    if(!host||!host.querySelector('input[name="ddProduct"]'))return;
    const raw=state.pendingUnitChoice?.brief||document.getElementById('unitSituation')?.value||'';
    const names=compactProducts(raw);
    const products=(state.pendingUnitChoice?.products||[]);
    products.slice(0,3).forEach((p,i)=>{p.title=names[i];p.text=names[i];});
    if(state.pendingUnitChoice)state.pendingUnitChoice.products=products;
    if(typeof save==='function')save();
    [...host.querySelectorAll('.dd-product-grid .dd-choice-card')].slice(0,3).forEach((card,i)=>{
      const h=card.querySelector('h3'),p=card.querySelector('p');
      if(h)h.textContent=names[i];
      if(p)p.textContent='';
    });
    const intro=host.querySelector('.dd-choice-intro p');
    if(intro)intro.textContent='Elige el producto final que mejor represente lo que lograrán los estudiantes.';
  }

  function simplifySituationIntro(){
    const host=document.getElementById('ddProposalChooser');
    if(!host||!host.querySelector('input[name="ddSituation"]'))return;
    host.querySelectorAll('.dd-choice-intro .notice').forEach(x=>x.remove());
    const p=host.querySelector('.dd-choice-intro p');
    if(p)p.textContent='Elige la situación que mejor represente lo que quieres trabajar.';
  }

  function simplifyAll(){simplifyInterpretation();simplifySituationIntro();compactProductCards();}
  let timer=0;function later(ms=520){clearTimeout(timer);timer=setTimeout(simplifyAll,ms);}
  document.addEventListener('input',e=>{if(e.target?.id==='unitSituation')later();},true);
  document.addEventListener('change',e=>{if(e.target?.id==='unitType')later();},true);
  document.addEventListener('click',e=>{
    const b=e.target.closest?.('button');if(!b)return;
    if(b.id==='ddContinueProducts'||b.id==='ddBackSituation'||/createUnitDemo/.test(b.getAttribute('onclick')||''))setTimeout(simplifyAll,90);
  });
  const oldShow=window.showUnit;if(typeof oldShow==='function')window.showUnit=function(){const r=oldShow.apply(this,arguments);setTimeout(simplifyAll,550);return r;};

  const css=document.createElement('style');css.textContent=`
    /* Análisis interno: nunca ocupa la pantalla normal, ni Fácil ni Experto */
    #ddKeywordBox,#ddProposalKeywords{display:none!important}
    #ddIntentBox>.dd-intent-grid,#ddIntentBox>.dd-meaning-synthesis,#ddIntentBox>.dd-meaning-warning,#ddIntentBox>small,#ddIntentBox>b:first-child{display:none!important}
    #ddIntentBox{background:transparent!important;border:0!important;padding:4px 0!important;margin-top:7px!important}
    #ddIntentBox .dd-title-label{display:block!important;margin:4px 0 7px!important;font-size:14px}
    #ddIntentBox .dd-title-suggestions{gap:7px!important;margin:0!important}
    #ddIntentBox .dd-title-suggestions button{padding:9px 11px!important;background:#fff!important}
    /* Producto al grano */
    .dd-product-grid .dd-choice-card p:empty{display:none!important}
    .dd-product-grid .dd-choice-card h3{font-size:16px;line-height:1.25;margin-bottom:4px}
    .dd-product-grid .dd-choice-card{min-height:118px;display:flex;flex-direction:column;justify-content:flex-start}
    .dd-product-grid .dd-pick{margin-top:auto}
    @media(max-width:650px){#ddIntentBox .dd-title-suggestions button{font-size:14px}.dd-product-grid .dd-choice-card{min-height:auto}}
  `;document.head.appendChild(css);
  setTimeout(simplifyAll,700);
  window.ddCompactProductOptions=compactProducts;
})();