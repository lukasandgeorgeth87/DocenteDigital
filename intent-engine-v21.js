/* DocenteDigital – motor de intención v21: comprende la descripción completa y la convierte en eje de toda la planificación */
(function(){
  if(window.__ddIntentEngineV21)return;window.__ddIntentEngineV21=true;
  if(typeof window.ddAnalyzeContext!=='function')return;

  const esc=v=>typeof escapeHtml==='function'?escapeHtml(String(v||'')):String(v||'');
  const trim=s=>String(s||'').replace(/\s+/g,' ').trim();
  const sentences=text=>String(text||'').split(/(?<=[.!?])\s+|\n+/).map(trim).filter(Boolean);
  const lower=s=>trim(s).toLowerCase();
  const cap=s=>{s=trim(s);return s?s.charAt(0).toUpperCase()+s.slice(1):'';};

  function afterCue(text,cues){
    const raw=String(text||'');
    for(const cue of cues){
      const i=lower(raw).indexOf(cue);
      if(i>=0){
        const chunk=trim(raw.slice(i+cue.length).split(/[.;!?]/)[0]);
        if(chunk.length>=4)return chunk.replace(/^(que|de que|a que)\s+/i,'');
      }
    }
    return'';
  }

  function inferIntent(text){
    const raw=trim(text),analysis=window.ddAnalyzeContext(raw,18);
    const ss=sentences(raw);
    const explicitGoal=afterCue(raw,[
      'queremos ','quiero ','necesitamos ','se necesita ','buscamos ','se busca ','nos proponemos ','el propósito es ','la finalidad es ','con el fin de ','para lograr ','para que '
    ]);
    const issueSentence=ss.find(s=>/(sin embargo|problema|dificultad|necesidad|preocupa|afecta|falta|escasez|pérdida|perdida|disminución|disminucion|desconoc|riesgo|contamin|conflicto|baja|poca|poco|limitad)/i.test(s))||'';
    const opportunitySentence=ss.find(s=>/(oportunidad|fortaleza|tradición|tradicion|saber|práctica|practica|costumbre|actividad comunal|participan|realizan|producen|cultivan|celebran)/i.test(s))||'';

    const concepts=(analysis.concepts||[]).filter(x=>String(x).length<=90);
    const phrases=(analysis.phrases||[]).filter(x=>String(x).split(/\s+/).length<=8);
    let focus=phrases[0]||concepts[0]||raw;
    if(focus.length>85)focus=concepts.slice(0,3).join(', ');
    if(!focus)focus='la situación descrita por el docente';

    const goal=explicitGoal||'';
    const context=state.teacherContext||{};
    const place=context.community||context.district||context.province||'';
    const actors=[];
    const actorPatterns=['estudiantes','niños','niñas','familias','madres','padres','abuelos','abuelas','yachaq','comunidad','productores','autoridades','docentes'];
    actorPatterns.forEach(a=>{if(new RegExp('\\b'+a+'\\b','i').test(raw))actors.push(a);});

    const rawVerbs=(raw.match(/\b[a-záéíóúñü]{4,}(?:ar|er|ir|amos|emos|imos|an|en)\b/gi)||[]).map(lower);
    const verbs=[...new Set(rawVerbs)].slice(0,8);
    const orientation=goal?'meta explícita':issueSentence?'problema o necesidad':opportunitySentence?'oportunidad del contexto':'tema o experiencia del contexto';

    return{
      raw,analysis,focus,goal,issue:issueSentence,opportunity:opportunitySentence,orientation,place,actors,verbs,
      summary: goal
        ?`El docente quiere trabajar ${focus} con la finalidad de ${goal}.`
        :issueSentence
          ?`El eje parece ser ${focus} a partir de una situación que requiere comprenderse o atenderse.`
          :`El eje principal es ${focus}; la planificación debe construir un reto auténtico a partir de esta realidad.`
    };
  }

  function shortGoal(intent){
    let g=trim(intent.goal);
    if(!g&&intent.issue){
      const a=window.ddAnalyzeContext(intent.issue,6);g=(a.concepts||[]).slice(0,2).join(' y ');
    }
    if(!g)g='comprender nuestra realidad y comunicar lo aprendido';
    return g.length>78?g.slice(0,75).replace(/\s+\S*$/,'')+'…':g;
  }

  function shortFocus(intent){
    let f=trim(intent.focus).replace(/["“”]/g,'');
    if(f.length>64){const a=intent.analysis?.concepts||[];f=a.slice(0,2).join(' y ');}
    return f||'nuestra realidad';
  }

  function signature(s){return lower(s).replace(/[^a-z0-9áéíóúñü]+/g,' ').trim();}
  function chooseFresh(key,list,n=5){
    state.intentTitleHistory=state.intentTitleHistory||{};
    const used=Array.isArray(state.intentTitleHistory[key])?state.intentTitleHistory[key]:[];
    let available=list.filter(x=>!used.includes(signature(x)));
    if(available.length<n)available=[...list];
    const out=[];
    while(available.length&&out.length<n){
      const i=Math.floor(Math.random()*available.length);out.push(available.splice(i,1)[0]);
    }
    state.intentTitleHistory[key]=[...used,...out.map(signature)].slice(-36);save();
    return out;
  }

  function titleOptions(text,type){
    const i=inferIntent(text),f=shortFocus(i),g=shortGoal(i),isProject=/proyecto/i.test(String(type||''));
    const place=i.place?` en ${i.place}`:'';
    const unit=[
      `Aprendemos desde ${f}: comprendemos nuestra realidad para ${g}`,
      `${cap(f)}: saberes y aprendizajes para ${g}`,
      `Descubrimos ${f}${place} y construimos aprendizajes con sentido`,
      `Comprendemos ${f} para ${g}`,
      `Nuestra realidad nos enseña: exploramos ${f} y explicamos lo aprendido`,
      `Entre saberes y experiencias: aprendemos a partir de ${f}`,
      `Miramos de cerca ${f}: preguntamos, investigamos y aprendemos`,
      `${cap(f)} en nuestra vida: aprendemos, explicamos y compartimos`,
      `Lo que vivimos también se aprende: comprendemos ${f}${place}`,
      `Preguntas de nuestra realidad: aprendemos a partir de ${f}`,
      `Saberes que dialogan: comprendemos ${f} desde nuestra comunidad`,
      `Aprendemos para actuar: comprendemos ${f} y buscamos maneras de ${g}`
    ];
    const project=[
      `Investigamos ${f} y construimos una respuesta para ${g}`,
      `${cap(f)} en acción: investigamos, decidimos y actuamos${place}`,
      `De nuestras preguntas a la acción: transformamos lo aprendido sobre ${f}`,
      `Un reto de nuestra realidad: investigamos ${f} para ${g}`,
      `Saberes que se convierten en acción: proyecto sobre ${f}`,
      `Investigamos para decidir: construimos una propuesta sobre ${f}`,
      `Nuestra comunidad nos plantea un desafío: actuamos frente a ${f}`,
      `De ${f} a una propuesta útil para nuestra comunidad`,
      `Aprendemos haciendo: investigamos ${f} y creamos una solución con sentido`,
      `${cap(f)}: un proyecto para investigar, crear y compartir`,
      `Voces, saberes y acción: construimos respuestas desde ${f}`,
      `Conocer para transformar: investigamos ${f} y actuamos para ${g}`
    ];
    const theme=signature(f).slice(0,70)||'general';
    return chooseFresh((isProject?'P|':'U|')+theme,isProject?project:unit,6);
  }

  window.ddInferPlanningIntent=inferIntent;
  window.ddIntentTitleOptions=titleOptions;

  // El título creativo pasa a depender primero de la intención leída en la descripción.
  const previousTitles=window.ddCreativeTitleOptions;
  if(typeof previousTitles==='function'){
    window.ddCreativeTitleOptions=function(brief,type){
      const intentional=titleOptions(brief,type);
      const previous=previousTitles.apply(this,arguments)||[];
      return [...intentional,...previous].filter((x,n,a)=>a.findIndex(y=>signature(y)===signature(x))===n).slice(0,8);
    };
  } else window.ddCreativeTitleOptions=titleOptions;

  // Toda propuesta creativa recibe una lectura común del propósito del docente.
  const previousChoices=window.ddCreativeChoices;
  if(typeof previousChoices==='function'){
    window.ddCreativeChoices=function(brief,type,fallback){
      const d=previousChoices.apply(this,arguments)||{};
      const intent=inferIntent(brief),f=shortFocus(intent),g=shortGoal(intent);
      d.intent=intent;
      d.situations=(d.situations||[]).map(x=>{
        let text=trim(x.text);
        if(!lower(text).includes(lower(f).slice(0,22)))text=text.replace(/Reto:/i,`La planificación debe mantener como eje ${f} y responder a la intención de ${g}. Reto:`);
        return {...x,text};
      });
      d.products=(d.products||[]).map(x=>{
        let text=trim(x.text);
        if(!lower(text).includes(lower(f).slice(0,22)))text+=` Debe hacer visible el trabajo sobre ${f} y aportar a ${g}.`;
        return {...x,text};
      });
      return d;
    };
  }

  function paint(){
    const ta=document.getElementById('unitSituation');if(!ta)return;
    let box=document.getElementById('ddIntentBox');
    if(!box){box=document.createElement('div');box.id='ddIntentBox';box.className='dd-intent-box';const kw=document.getElementById('ddKeywordBox');(kw?.parentElement||ta.parentElement).appendChild(box);}
    const raw=ta.value.trim();
    if(raw.length<12){box.innerHTML='<small>✍️ Mientras describes tu contexto, la app irá interpretando qué quieres trabajar y propondrá títulos coherentes.</small>';return;}
    const i=inferIntent(raw),type=document.getElementById('unitType')?.value||'Unidad de aprendizaje',titles=titleOptions(raw,type).slice(0,3);
    const parts=[`<b>🧭 DocenteDigital entendió:</b><div class="dd-intent-grid"><span><small>FOCO</small>${esc(shortFocus(i))}</span><span><small>INTENCIÓN</small>${esc(i.goal||i.orientation)}</span>${i.issue?`<span class="full"><small>SITUACIÓN / NECESIDAD DETECTADA</small>${esc(i.issue)}</span>`:''}</div>`,`<b class="dd-title-label">✨ Títulos propuestos desde tu descripción:</b><div class="dd-title-suggestions">${titles.map(t=>`<button type="button" data-dd-title="${esc(t)}">${esc(t)}</button>`).join('')}</div>`,`<small>Estos títulos cambian según lo que escriba el docente. Al elegir uno, ese mismo entendimiento seguirá guiando situación significativa, reto, producto y secuencia.</small>`];
    box.innerHTML=parts.join('');
  }

  document.addEventListener('click',e=>{
    const titleBtn=e.target.closest?.('[data-dd-title]');
    if(titleBtn){const input=document.getElementById('unitTitle');if(input){input.value=titleBtn.getAttribute('data-dd-title')||'';state._ddTitleWasProvided=true;save();}return;}
    const b=e.target.closest?.('button');if(!b)return;const on=b.getAttribute('onclick')||'';
    if(/createUnitDemo/.test(on)){
      const raw=document.getElementById('unitSituation')?.value||'';state.lastPlanningIntent=inferIntent(raw);save();setTimeout(paint,30);
    }
    if(b.id==='ddBuildUnit'){
      const raw=state.pendingUnitChoice?.brief||document.getElementById('unitSituation')?.value||'',intent=inferIntent(raw);
      state.lastPlanningIntent=intent;save();
      setTimeout(()=>{
        const u=state.activeUnitId?(state.units||[]).find(x=>x.id===state.activeUnitId):(state.units||[])[0];
        if(u){u.planningIntent=intent;u.contextAnalysis=intent.analysis;u.contextKeywords=intent.analysis?.concepts||[];save();}
      },180);
    }
  },true);
  document.addEventListener('input',e=>{if(e.target?.id==='unitSituation')paint();},true);
  document.addEventListener('change',e=>{if(e.target?.id==='unitType')paint();},true);

  const oldShow=window.showUnit;
  if(typeof oldShow==='function')window.showUnit=function(){const r=oldShow.apply(this,arguments);setTimeout(paint,0);return r;};
  setTimeout(paint,0);

  const style=document.createElement('style');style.textContent=`
    .dd-intent-box{margin-top:9px;padding:11px;border-radius:12px;background:#fffaf0;border:1px solid #eadbb8}.dd-intent-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin:8px 0 10px}.dd-intent-grid span{display:block;padding:7px 8px;border-radius:9px;background:#fff;border:1px solid #eee1c7}.dd-intent-grid .full{grid-column:1/-1}.dd-intent-grid small{display:block;font-size:10px;font-weight:800;color:#806d45;margin-bottom:3px}.dd-title-label{display:block;margin-top:8px}.dd-title-suggestions{display:grid;gap:6px;margin:7px 0}.dd-title-suggestions button{text-align:left;border:1px solid #d7c59f;background:#fff;padding:8px 10px;border-radius:9px;cursor:pointer;font:inherit}.dd-title-suggestions button:hover{background:#fff7e8}.dd-intent-box>small{display:block;line-height:1.35;margin-top:5px}@media(max-width:650px){.dd-intent-grid{grid-template-columns:1fr}.dd-intent-grid .full{grid-column:auto}}
  `;document.head.appendChild(style);
})();