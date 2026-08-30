/* DocenteDigital – lector abierto de contexto v20: cualquier vocabulario, frases y conceptos */
(function(){
  if(window.__ddContextSemanticV20)return;window.__ddContextSemanticV20=true;

  const STOP=new Set(('a al algo ante bajo con contra de del desde durante e el ella ellas ellos en entre era es esa ese eso esta estas este estos fue ha hacia hasta hay la las lo los mas me mi muy ni no o para pero por porque que se sin sobre su sus tu un una uno unas unos y ya como cual cuando donde quien tambien este esta estos estas ser son somos sea sean fue fueron tiene tienen hacer hace hacen puede pueden debe deben').split(' '));
  const clean=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const norm=s=>clean(s).toLowerCase().replace(/[^a-z0-9ñ\s%-]/gi,' ').replace(/\s+/g,' ').trim();
  const words=s=>norm(s).split(' ').filter(Boolean);
  const contentWords=s=>words(s).filter(w=>w.length>=3&&!STOP.has(w));

  function originalPhraseMap(text){
    const map=new Map();
    String(text||'').split(/\n|[.;:!?]/).forEach(chunk=>{
      chunk.split(',').forEach(part=>{
        const p=part.trim().replace(/^[-–—•\d.)\s]+/,'').trim();
        const k=norm(p);if(k&&k.length>=3&&!map.has(k))map.set(k,p);
      });
    });
    return map;
  }

  function analyze(text,limit=12){
    const raw=String(text||'').trim();
    if(!raw)return{concepts:[],allTerms:[],phrases:[],words:[],numbers:[],raw:''};
    const tokenList=contentWords(raw),freq={};tokenList.forEach(w=>freq[w]=(freq[w]||0)+1);
    const first={};tokenList.forEach((w,i)=>{if(first[w]===undefined)first[w]=i;});
    const candidates=[];
    const seen=new Set();
    const add=(value,score,kind='word')=>{const k=norm(value);if(!k||seen.has(kind+'|'+k))return;seen.add(kind+'|'+k);candidates.push({value:String(value).trim(),key:k,score,kind});};

    // 1) Lo que el docente separa con comas, punto y coma o saltos se interpreta como posible concepto explícito.
    const phraseMap=originalPhraseMap(raw);
    for(const [k,original] of phraseMap.entries()){
      const cw=contentWords(original);
      if(cw.length>=2&&cw.length<=10)add(original,12+Math.min(cw.length,5),'phrase');
      else if(cw.length===1)add(original,7,'word');
    }

    // 2) Frases entre comillas tienen máxima prioridad porque el docente las destacó deliberadamente.
    const quoted=[...raw.matchAll(/[“\"]([^”\"]{2,100})[”\"]/g)].map(m=>m[1].trim());
    quoted.forEach(q=>add(q,25,'phrase'));

    // 3) N-gramas abiertos: no existe lista temática fija. Cualquier combinación significativa puede emerger.
    const rawWords=words(raw);
    for(let n=4;n>=2;n--){
      for(let i=0;i<=rawWords.length-n;i++){
        const gram=rawWords.slice(i,i+n);
        const meaningful=gram.filter(w=>w.length>=3&&!STOP.has(w));
        if(meaningful.length<2)continue;
        const phrase=gram.join(' ');
        const score=4+n+(meaningful.reduce((a,w)=>a+(freq[w]||0),0)/meaningful.length);
        add(phrase,score,'phrase');
      }
    }

    // 4) Palabras individuales: frecuencia, especificidad y posición. Sin vocabulario preferido predefinido.
    Object.keys(freq).forEach(w=>{
      const specificity=Math.min(w.length/4,3);
      const positionBonus=first[w]!==undefined?Math.max(0,2-first[w]/30):0;
      add(w,5+(freq[w]*2)+specificity+positionBonus,'word');
    });

    // 5) Números, porcentajes, años y cantidades pueden ser parte esencial del contexto.
    const nums=[...raw.matchAll(/\b\d+(?:[.,]\d+)?%?\b/g)].map(m=>m[0]);
    nums.forEach(n=>add(n,7,'number'));

    // Evita seleccionar frases casi idénticas entre sí.
    candidates.sort((a,b)=>b.score-a.score||b.value.length-a.value.length);
    const selected=[];
    const similarity=(a,b)=>{
      const A=new Set(contentWords(a)),B=new Set(contentWords(b));if(!A.size||!B.size)return 0;
      const inter=[...A].filter(x=>B.has(x)).length;return inter/Math.min(A.size,B.size);
    };
    for(const c of candidates){
      if(selected.some(s=>similarity(s.value,c.value)>.82))continue;
      selected.push(c);if(selected.length>=limit)break;
    }

    return{
      raw,
      concepts:selected.map(x=>x.value),
      allTerms:candidates.map(x=>x.value),
      phrases:selected.filter(x=>x.kind==='phrase').map(x=>x.value),
      words:selected.filter(x=>x.kind==='word').map(x=>x.value),
      numbers:selected.filter(x=>x.kind==='number').map(x=>x.value)
    };
  }

  window.ddAnalyzeContext=analyze;
  // Compatibilidad: las capas anteriores pueden seguir llamando ddContextKeywords.
  window.ddContextKeywords=(text,limit=12)=>analyze(text,limit).concepts;
  window.ddContextKeywordPhrase=text=>analyze(text,6).concepts.join(', ');

  function ensureDuration(){
    const sel=document.getElementById('unitDuration');if(!sel)return;
    const current=sel.value,wanted=['1 semana','2 semanas','3 semanas','4 semanas','5 semanas','6 semanas'];
    if([...sel.options].map(o=>o.textContent.trim()).join('|')!==wanted.join('|'))sel.innerHTML=wanted.map(x=>`<option>${x}</option>`).join('');
    sel.value=wanted.includes(current)?current:'3 semanas';
  }

  function paint(){
    const ta=document.getElementById('unitSituation');if(!ta)return;
    let box=document.getElementById('ddKeywordBox');
    if(!box){box=document.createElement('div');box.id='ddKeywordBox';box.className='dd-keyword-box';ta.parentElement.appendChild(box);}
    const a=analyze(ta.value,12);
    box.innerHTML=a.concepts.length?`<b>🧠 Conceptos que DocenteDigital está leyendo:</b>${a.concepts.map(k=>`<span>${escapeHtml(k)}</span>`).join('')}<small>Se analiza todo el texto. Aquí solo se muestran los conceptos más relevantes; no existe una lista temática cerrada. Puedes escribir cualquier término, nombre local, problema, actividad, cultivo, profesión, tradición o frase que necesites.</small>`:'<small>Describe libremente tu realidad. DocenteDigital analizará las palabras y frases que tú escribas; no necesitas usar un vocabulario predefinido.</small>';
  }

  function saveAnalysis(){
    const ta=document.getElementById('unitSituation'),p=state.pendingUnitChoice;if(!ta)return;
    const a=analyze(ta.value,16);state.lastContextAnalysis=a;state.pendingPlanningWeeks=parseInt(document.getElementById('unitDuration')?.value)||3;
    if(p){p.contextAnalysis=a;p.contextKeywords=a.concepts;}
    save();
  }

  document.addEventListener('input',e=>{if(e.target?.id==='unitSituation'){paint();}},true);
  document.addEventListener('change',e=>{if(e.target?.id==='unitDuration'){state.pendingPlanningWeeks=parseInt(e.target.value)||3;save();}},true);
  document.addEventListener('click',e=>{
    const b=e.target.closest?.('button');if(!b)return;const on=b.getAttribute('onclick')||'';
    if(/createUnitDemo/.test(on)||b.id==='ddContinueProducts'||b.id==='ddBuildUnit')setTimeout(()=>{saveAnalysis();paint();},20);
    if(b.id==='ddBuildUnit')setTimeout(()=>{
      const u=state.activeUnitId?(state.units||[]).find(x=>x.id===state.activeUnitId):(state.units||[])[0];
      if(u){u.contextAnalysis=state.lastContextAnalysis;u.contextKeywords=state.lastContextAnalysis?.concepts||[];u.duration=document.getElementById('unitDuration')?.value||u.duration;save();}
    },160);
  },true);

  const oldShow=window.showUnit;if(typeof oldShow==='function')window.showUnit=function(){const r=oldShow.apply(this,arguments);setTimeout(()=>{ensureDuration();paint();},0);return r;};
  setTimeout(()=>{ensureDuration();paint();},0);

  const style=document.createElement('style');style.textContent=`.dd-keyword-box{margin-top:8px;padding:9px 10px;border-radius:11px;background:#f4f8ff;border:1px solid #d7e2f0}.dd-keyword-box span{display:inline-block;margin:5px 4px 0 0;padding:4px 8px;border-radius:999px;background:white;border:1px solid #cad8e7;font-size:12px}.dd-keyword-box small{display:block;margin-top:7px;line-height:1.35}`;document.head.appendChild(style);
})();