/* DocenteDigital – palabras clave del contexto + duración 1–6 semanas v19 */
(function(){
  if(window.__ddContextKeywordsV19)return;window.__ddContextKeywordsV19=true;
  const STOP=new Set(('a al algo ante bajo con contra de del desde durante e el ella ellas ellos en entre era es esa ese eso esta estas este estos fue ha hacia hasta hay la las lo los más me mi muy ni no o para pero por porque que se sin sobre su sus tu un una uno unas unos y ya como cómo cual cuando donde qué quien').split(' '));
  const normalize=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9ñáéíóúü\s-]/gi,' ');
  function keywords(text,limit=8){
    const raw=String(text||'').trim();
    const tokens=normalize(raw).split(/\s+/).filter(w=>w.length>=3&&!STOP.has(w));
    const freq={};tokens.forEach(w=>freq[w]=(freq[w]||0)+1);
    /* La lista prioriza términos solo cuando el docente realmente los escribió; no añade contexto rural ni EIB por sí sola. */
    const preferred=['siembra','tarpuy','papa','añu','anu','oca','olluco','semilla','semillas','nativa','nativas','yachaq','pachamama','agua','yaku','riego','clima','climatico','climatica','residuo','residuos','contaminacion','cafe','cacao','banano','citricos','moraya','chuño','chuno','familia','familias','comunidad','tradicion','saberes'];
    return Object.keys(freq).sort((a,b)=>{
      const pa=preferred.includes(a)?3:0,pb=preferred.includes(b)?3:0;
      return (freq[b]+pb)-(freq[a]+pa)||tokens.indexOf(a)-tokens.indexOf(b);
    }).slice(0,limit);
  }
  function phrase(ks){if(!ks?.length)return'';if(ks.length===1)return ks[0];return ks.slice(0,-1).join(', ')+' y '+ks[ks.length-1];}
  window.ddContextKeywords=keywords;window.ddContextKeywordPhrase=text=>phrase(keywords(text));

  function ensureDuration(){const sel=document.getElementById('unitDuration');if(!sel)return;const current=sel.value,wanted=['1 semana','2 semanas','3 semanas','4 semanas','5 semanas','6 semanas'],actual=[...sel.options].map(o=>o.textContent.trim());if(actual.join('|')!==wanted.join('|')){sel.innerHTML=wanted.map(x=>`<option>${x}</option>`).join('');if(wanted.includes(current))sel.value=current;else sel.value='3 semanas';}}

  function paintKeywordBox(){
    const ta=document.getElementById('unitSituation');if(!ta)return;let box=document.getElementById('ddKeywordBox');
    if(!box){box=document.createElement('div');box.id='ddKeywordBox';box.className='dd-keyword-box';ta.parentElement.appendChild(box);ta.addEventListener('input',paintKeywordBox);}
    const ks=keywords(ta.value,8);
    box.innerHTML=ks.length?`<b>🔑 Palabras clave detectadas:</b> ${ks.map(k=>`<span>${k}</span>`).join('')}<small>La app las tomará como referencia para el título, situación, reto, producto y secuencia.</small>`:'<small>Describe con tus propias palabras el interés, situación, necesidad, oportunidad, problema, actores, lugar o propósito que realmente corresponda. No necesitas completar datos que no existan.</small>';
  }

  function enrichCreativeData(){
    const p=state.pendingUnitChoice;if(!p)return;const ks=keywords(p.brief,6),kp=phrase(ks);if(!kp)return;
    if(p._creativeData){p._creativeData.contextKeywords=ks;p._creativeData.situations=(p._creativeData.situations||[]).map(x=>{let text=x.text||'';if(!text.toLowerCase().includes(ks[0]))text=text.replace(/Reto:/,`En esta planificación se prestará especial atención a ${kp}. Reto:`);return {...x,text};});p._creativeData.products=(p._creativeData.products||[]).map(x=>{let text=x.text||'';if(!text.toLowerCase().includes(ks[0]))text+=` El producto debe integrar de manera visible aprendizajes vinculados con ${kp}.`;return {...x,text};});save();}
    let info=document.getElementById('ddProposalKeywords');const host=document.getElementById('ddProposalChooser');if(host){if(!info){info=document.createElement('div');info.id='ddProposalKeywords';info.className='dd-proposal-keywords';host.prepend(info);}info.innerHTML=`<b>🔑 El contexto está guiando la propuesta:</b> ${ks.map(k=>`<span>${k}</span>`).join('')}`;}
  }

  function installTitleWrapper(){
    if(window.__ddKeywordTitleWrapped||typeof window.ddCreativeTitleOptions!=='function')return;window.__ddKeywordTitleWrapped=true;const old=window.ddCreativeTitleOptions;
    window.ddCreativeTitleOptions=function(brief,type){
      const base=old.apply(this,arguments)||[],ks=keywords(brief,4),p=phrase(ks.slice(0,3));if(!p)return base;const project=String(type||'').toLowerCase().includes('proyecto');
      const extra=project?[`Investigamos ${p} y construimos una respuesta pertinente`,`De ${p} a la acción: investigamos, creamos y compartimos`,`Saberes y desafíos de ${p}: un proyecto desde nuestro entorno`]:[`Aprendemos desde ${p}: saberes y experiencias de nuestro entorno`,`Comprendemos ${p} para aprender desde nuestra realidad`,`Entre ${p} y nuestros saberes: construimos aprendizajes con sentido`];
      return [...extra,...base].filter((x,i,a)=>a.indexOf(x)===i).slice(0,6);
    };
  }

  function markGeneratedUnit(){const p=state.pendingUnitChoice;if(!p)return;const ks=keywords(p.brief,8);setTimeout(()=>{const u=state.activeUnitId?(state.units||[]).find(x=>x.id===state.activeUnitId):(state.units||[])[0];if(u&&ks.length){u.contextKeywords=ks;u.duration=document.getElementById('unitDuration')?.value||u.duration;save();}},120);}

  document.addEventListener('click',e=>{const b=e.target.closest?.('button');if(!b)return;const on=b.getAttribute('onclick')||'';if(/createUnitDemo/.test(on))setTimeout(()=>{installTitleWrapper();enrichCreativeData();paintKeywordBox();},70);if(b.id==='ddContinueProducts'||b.id==='ddBackSituation')setTimeout(enrichCreativeData,60);if(b.id==='ddBuildUnit')markGeneratedUnit();},true);
  document.addEventListener('input',e=>{if(e.target?.id==='unitSituation')paintKeywordBox();},true);
  document.addEventListener('change',e=>{if(e.target?.id==='unitDuration')state.pendingPlanningWeeks=parseInt(e.target.value)||3;save();},true);
  function init(){ensureDuration();paintKeywordBox();installTitleWrapper();}const oldShow=window.showUnit;if(typeof oldShow==='function')window.showUnit=function(){const r=oldShow.apply(this,arguments);setTimeout(init,0);return r;};setTimeout(init,0);
  const css=document.createElement('style');css.textContent=`.dd-keyword-box{margin-top:7px;padding:8px 9px;border-radius:10px;background:#f4f8ff;border:1px solid #d8e3f2}.dd-keyword-box span,.dd-proposal-keywords span{display:inline-block;margin:3px 3px 3px 0;padding:3px 7px;border-radius:999px;background:#fff;border:1px solid #cad9e8;font-size:12px}.dd-keyword-box small{display:block;margin-top:5px}.dd-proposal-keywords{margin-bottom:10px;padding:9px 11px;border-radius:11px;background:#f4f8ff;border:1px solid #d8e3f2}`;document.head.appendChild(css);
})();