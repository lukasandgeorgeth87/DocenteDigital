/* DocenteDigital – alineación de finalidad v28
   Detecta para qué quiere usar el docente los aprendizajes y obliga a que
   título, situación, reto y producto mantengan esa finalidad.
*/
(function(){
  if(window.__ddGoalAlignmentV28)return;window.__ddGoalAlignmentV28=true;
  if(typeof state!=='object')return;

  const E=v=>typeof escapeHtml==='function'?escapeHtml(String(v??'')):String(v??'');
  const tidy=s=>String(s||'').replace(/\s+/g,' ').trim().replace(/[.?!,;:]+$/,'');
  const low=s=>tidy(s).toLowerCase();
  const cap=s=>{s=tidy(s);return s?s[0].toUpperCase()+s.slice(1):''};

  function extractGoal(text){
    const raw=tidy(text);if(!raw)return null;
    const patterns=[
      /(?:estos|esos|los|nuestros)?\s*(?:conocimientos|saberes|aprendizajes)[^.!?]{0,90}?\b(?:los?|las?)?\s*(?:volcaremos|aplicaremos|usaremos|utilizaremos|llevaremos|emplearemos|pondremos en práctica|pondremos en practica)\s+(?:para\s+|en\s+)?(.+?)(?=$|[.!?])/i,
      /\b(?:lo|los|las)?\s*(?:volcaremos|aplicaremos|usaremos|utilizaremos|llevaremos|emplearemos|pondremos en práctica|pondremos en practica)\s+(?:para\s+|en\s+)?(.+?)(?=$|[.!?])/i,
      /\b(?:culminaremos|terminaremos|finalizaremos)\s+(?:con\s+|en\s+)?(.+?)(?=$|[.!?])/i,
      /\b(?:queremos|buscamos|esperamos|nos proponemos|pretendemos)\s+(?:lograr\s+|hacer\s+|que\s+)?(.+?)(?=$|[.!?])/i,
      /\b(?:nos servirá para|nos servira para|servirá para|servira para)\s+(.+?)(?=$|[.!?])/i
    ];
    for(const re of patterns){const m=raw.match(re);if(m&&tidy(m[1]).length>=4)return{phrase:tidy(m[1]),source:m[0]};}
    const action='sembrar|cultivar|crear|construir|elaborar|implementar|organizar|producir|mejorar|recuperar|diseñar|realizar|desarrollar|instalar|preparar|poner|hacer|transformar|resolver|cuidar|promover|presentar|fabricar|registrar|investigar';
    const re=new RegExp('\\b(?:para|con el fin de|con el propósito de|con el proposito de)\\s+((?:'+action+')\\b[^.!?]*)','ig');
    const found=[...raw.matchAll(re)];
    if(found.length){const m=found[found.length-1];const phrase=tidy(m[1]);if(phrase.length>=4)return{phrase,source:m[0]};}
    return null;
  }

  function themeLabel(brief){
    const s=low(brief);
    if(/siembr|tarpuy|papa|añu|oca|olluco|tubércul|tubercul/.test(s))return'los saberes y prácticas de la siembra';
    if(/pachamama|madre tierra/.test(s))return'los saberes y prácticas vinculados con la Pachamama';
    if(/agua|yaku/.test(s))return'el uso y cuidado del agua';
    if(/residuo|basura|contamin/.test(s))return'el manejo de residuos y el cuidado del entorno';
    const m=typeof window.ddUnderstandPlanningDescription==='function'?window.ddUnderstandPlanningDescription(brief):null;
    return tidy(m?.contextConcepts?.[0]||m?.focus||'la situación descrita');
  }

  function placeLabel(brief){
    const c=state.teacherContext||{};
    const m=typeof window.ddUnderstandPlanningDescription==='function'?window.ddUnderstandPlanningDescription(brief):null;
    return tidy(m?.place||c.locality||c.community||'el entorno de la IE');
  }

  function isBiohuerto(goal){return /\bbio\s*huerto\b|\bbiohuerto\b|\bhuerto escolar\b/i.test(goal||'');}
  function goalTitles(brief,type,goal){
    const P=/proyecto/i.test(String(type||'')),place=placeLabel(brief),topic=themeLabel(brief),g=tidy(goal.phrase);
    if(isBiohuerto(g)){
      return P?[
        `De la chacra al biohuerto: investigamos saberes de la siembra y cultivamos hortalizas`,
        `Sembramos saberes en acción: construimos nuestro biohuerto de hortalizas`,
        `Del Hatun Tarpuy al biohuerto: investigamos, planificamos y sembramos`,
        `Saberes que germinan: llevamos lo aprendido de la siembra a nuestro biohuerto`,
        `Nuestro biohuerto aprende de ${place}: investigamos y ponemos la siembra en práctica`,
        `De los saberes agrícolas a la acción: hacemos crecer nuestro biohuerto`
      ]:[
        `De la chacra al biohuerto: aprendemos de la siembra y cultivamos hortalizas`,
        `Sembramos saberes: aprendemos en ${place} y los aplicamos en nuestro biohuerto`,
        `Saberes que germinan: de la siembra de nuestro entorno al biohuerto escolar`,
        `Aprendemos de la siembra para hacer crecer nuestro biohuerto`,
        `De los tubérculos a las hortalizas: aprendemos y sembramos en nuestro biohuerto`,
        `Lo que aprendemos de la siembra cobra vida en nuestro biohuerto`
      ];
    }
    const action=g.replace(/^para\s+/i,'');
    return P?[
      `De lo que aprendemos a la acción: investigamos ${topic} para ${action}`,
      `${cap(topic)} en acción: investigamos y nos preparamos para ${action}`,
      `Aprendemos haciendo: de ${topic} a ${action}`,
      `Investigamos nuestra realidad y aplicamos lo aprendido para ${action}`,
      `Saberes que se transforman en acción: ${action}`,
      `Del análisis a la práctica: aprendemos sobre ${topic} para ${action}`
    ]:[
      `Aprendemos sobre ${topic} para ${action}`,
      `De nuestros saberes a la práctica: ${action}`,
      `${cap(topic)}: comprendemos, aprendemos y aplicamos para ${action}`,
      `Lo que aprendemos tiene un propósito: ${action}`,
      `Comprendemos ${topic} y usamos lo aprendido para ${action}`,
      `Aprendizajes con sentido: de ${topic} a ${action}`
    ];
  }

  function challengeFor(brief,goal){
    const topic=themeLabel(brief),g=tidy(goal.phrase);
    if(isBiohuerto(g))return `¿Cómo podemos aprovechar los saberes y prácticas de la siembra que conocemos en nuestro entorno para planificar y sembrar hortalizas en nuestro biohuerto, explicando las decisiones y cuidados que necesitamos realizar?`;
    return `¿Cómo podemos comprender ${topic} y utilizar lo aprendido para ${g}, tomando decisiones pertinentes, explicando nuestras razones y valorando los resultados obtenidos?`;
  }

  function alignSituation(text,brief,goal,index){
    const base=tidy(String(text||'').replace(/\s*Reto\s*:\s*[\s\S]*$/i,''));
    const g=tidy(goal.phrase),challenge=challengeFor(brief,goal);
    const bridge=isBiohuerto(g)
      ?'La intención no es quedarse únicamente en conocer o explicar la siembra: los estudiantes utilizarán esos aprendizajes para planificar y realizar la siembra de hortalizas en el biohuerto, tomando decisiones sobre preparación, semillas, distribución, cuidado y seguimiento.'
      :`La finalidad expresada por el docente es que estos aprendizajes se utilicen para ${g}. Por ello, la planificación deberá conducir de la comprensión a una aplicación concreta y verificable.`;
    const lead=index===1?'Desde una mirada vivencial, ':'Desde una formulación clara, ';
    return `${lead}${base} ${bridge} Reto: ${challenge}`;
  }

  function goalProducts(brief,type,goal){
    const g=tidy(goal.phrase);
    if(isBiohuerto(g))return[
      {key:'1',title:'Biohuerto escolar de hortalizas',text:'Producto/acción central: planificación, preparación y siembra de hortalizas en el biohuerto escolar aplicando los saberes recuperados sobre siembra. Incluye distribución del espacio, selección de semillas o plantines, registro del proceso y acuerdos de cuidado.'},
      {key:'2',title:'Biohuerto demostrativo con bitácora de aprendizaje',text:'Implementación o fortalecimiento del biohuerto con hortalizas y una bitácora por grados donde los estudiantes registran decisiones, medidas, observaciones, explicaciones, textos y evidencias del proceso desde la preparación hasta el seguimiento.'},
      {key:'3',title:'Ruta “De la chacra al biohuerto”',text:'Aplicación práctica de los conocimientos de la siembra en un biohuerto de hortalizas, acompañada por estaciones o evidencias que expliquen qué saber se recuperó, cómo se aplicó, qué decisiones se tomaron y qué resultados se observaron.'}
    ];
    return[
      {key:'1',title:`Acción final: ${cap(g)}`,text:`Producto/acción central directamente vinculada con la intención docente: ${g}. Los estudiantes deberán planificarla, ejecutarla o desarrollarla según su nivel y recoger evidencias del proceso y de las decisiones tomadas.`},
      {key:'2',title:'Plan de aplicación y bitácora de evidencias',text:`Plan práctico para ${g}, acompañado de registros, textos, datos, representaciones, observaciones y reflexiones que muestren cómo los aprendizajes de las áreas se utilizaron en una situación real.`},
      {key:'3',title:'Aplicación práctica y socialización de resultados',text:`Realización de ${g} como acción o producto integrador, seguida de una explicación a destinatarios reales sobre qué se aprendió, cómo se aplicó, qué decisiones se tomaron y qué resultados se obtuvieron.`}
    ];
  }

  const previousTitles=window.ddCreativeTitleOptions;
  if(typeof previousTitles==='function')window.ddCreativeTitleOptions=function(brief,type){
    const goal=extractGoal(brief);if(!goal)return previousTitles.apply(this,arguments);
    const goalList=goalTitles(brief,type,goal);
    state.goalTitleHistory=state.goalTitleHistory||{};
    const key=low(themeLabel(brief)+'|'+goal.phrase+'|'+type).slice(0,180),used=state.goalTitleHistory[key]||[];
    let fresh=goalList.filter(x=>!used.includes(low(x)));if(fresh.length<3)fresh=goalList.slice();
    fresh.sort(()=>Math.random()-.5);const out=fresh.slice(0,3);
    state.goalTitleHistory[key]=[...used,...out.map(low)].slice(-30);if(typeof save==='function')save();
    return out;
  };
  window.ddIntentTitleOptions=window.ddCreativeTitleOptions;

  const previousChoices=window.ddCreativeChoices;
  if(typeof previousChoices==='function')window.ddCreativeChoices=function(brief,type,fallback){
    const base=previousChoices.apply(this,arguments),goal=extractGoal(brief);if(!goal)return base;
    return{
      situations:(base?.situations||[]).map((x,i)=>({...x,text:alignSituation(x.text,brief,goal,i)})),
      products:goalProducts(brief,type,goal)
    };
  };

  const previousProducts=window.ddCreativeProducts;
  if(typeof previousProducts==='function')window.ddCreativeProducts=function(brief,type,fallback){
    const goal=extractGoal(brief);return goal?goalProducts(brief,type,goal):previousProducts.apply(this,arguments);
  };

  function showTitleSuggestions(){
    const brief=document.getElementById('unitSituation')?.value.trim()||'';if(!brief)return alert('Primero escribe la idea o contexto de partida.');
    const type=document.getElementById('unitType')?.value||'Unidad de aprendizaje';const opts=window.ddCreativeTitleOptions(brief,type);
    let box=document.getElementById('ddTitleSuggestions');if(!box){box=document.createElement('div');box.id='ddTitleSuggestions';box.className='dd-title-suggestions';document.getElementById('unitTitle')?.parentElement?.appendChild(box);}
    const goal=extractGoal(brief);
    box.innerHTML=`<small><b>${goal?'Títulos alineados con lo que quieres lograr:':'3 títulos propuestos:'}</b></small>`+opts.map((t,i)=>`<button type="button" data-dd-v28-title="${i}">${i+1}. ${E(t)}</button>`).join('');
    box.querySelectorAll('[data-dd-v28-title]').forEach((b,i)=>b.onclick=()=>{const input=document.getElementById('unitTitle');if(input){input.value=opts[i];state._ddManualTitle=true;if(typeof save==='function')save();}});
  }
  window.ddSuggestTitles=showTitleSuggestions;

  function mountButton(){const b=document.querySelector('.dd-title-btn');if(b){b.textContent='✨ Proponer 3 títulos según mi intención';b.onclick=showTitleSuggestions;}}
  function paintGoal(){
    const ta=document.getElementById('unitSituation');if(!ta)return;const goal=extractGoal(ta.value);let old=document.getElementById('ddGoalDetected');
    if(!goal){old?.remove();return;}
    const box=document.getElementById('ddIntentBox')||ta.parentElement;
    if(!old){old=document.createElement('div');old.id='ddGoalDetected';old.className='dd-goal-detected';box.appendChild(old);}
    old.innerHTML=`<b>🎯 Finalidad detectada:</b> ${E(goal.phrase)}<br><small>Esta finalidad tendrá prioridad al construir el título, la situación significativa, el reto y el producto.</small>`;
    const current=document.getElementById('unitTitle')?.value||'';
    if(current&&isBiohuerto(goal.phrase)&&!/biohuerto|huerto/i.test(current))old.innerHTML+=`<div class="dd-goal-warning">⚠️ El título actual todavía no refleja la meta final. Pulsa “Proponer 3 títulos según mi intención”.</div>`;
  }

  let timer=0;
  document.addEventListener('input',e=>{
    if(e.target?.id==='unitTitle'){state._ddManualTitle=true;if(typeof save==='function')save();return;}
    if(e.target?.id==='unitSituation'){clearTimeout(timer);timer=setTimeout(()=>{paintGoal();const box=document.getElementById('ddTitleSuggestions');if(box)showTitleSuggestions();},360);}
  },true);
  document.addEventListener('change',e=>{if(e.target?.id==='unitType'){setTimeout(()=>{paintGoal();const box=document.getElementById('ddTitleSuggestions');if(box)showTitleSuggestions();},30);}},true);
  document.addEventListener('click',e=>{
    const b=e.target.closest?.('button');if(!b)return;const on=b.getAttribute('onclick')||'';
    if(/createUnitDemo/.test(on)){
      const brief=document.getElementById('unitSituation')?.value||'',goal=extractGoal(brief),title=document.getElementById('unitTitle');
      if(goal&&title&&!state._ddManualTitle){const opts=window.ddCreativeTitleOptions(brief,document.getElementById('unitType')?.value||'Unidad de aprendizaje');if(opts?.[0])title.value=opts[0];}
      state.lastExplicitGoal=goal||null;if(typeof save==='function')save();
    }
  },true);

  window.ddExtractPlanningGoal=extractGoal;
  window.ddGoalAlignment={extractGoal,challengeFor,goalProducts};
  setTimeout(()=>{mountButton();paintGoal();},0);

  const style=document.createElement('style');style.textContent=`.dd-goal-detected{margin:9px 0;padding:9px 11px;border:1px solid #b9d8c6;background:#f1faf4;border-radius:10px;line-height:1.4}.dd-goal-warning{margin-top:7px;padding:7px 8px;background:#fff5dc;border-radius:8px;color:#785b14}`;document.head.appendChild(style);
})();