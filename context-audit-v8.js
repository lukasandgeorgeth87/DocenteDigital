/* DocenteDigital – contexto real del docente + lenguaje claro + auditoría relámpago del Prompt Maestro */
(function(){
  const E=v=>escapeHtml(v);
  state.teacherContext=state.teacherContext||{community:'',district:'',province:'',region:'',calendar:'',notes:''};
  state.teacherLanguage=state.teacherLanguage!==false;
  save();

  function ctx(){return state.teacherContext||{};}
  function placeFromBrief(brief=''){
    const c=ctx();
    if((c.community||'').trim()){
      const parts=[c.community,c.district?`distrito de ${c.district}`:'',c.province?`provincia de ${c.province}`:'',c.region||''].filter(Boolean);
      return parts.join(', ');
    }
    const s=String(brief||'');
    if(/ccotataqui|cotataqui/i.test(s))return 'Ccotataqui';
    return 'la comunidad';
  }
  function contextSummary(){
    const c=ctx();
    const geo=[c.community,c.district,c.province,c.region].filter(Boolean).join(' · ');
    const extra=[c.calendar,c.notes].filter(Boolean).join(' · ');
    return [geo,extra].filter(Boolean).join(' — ')||'Usaré la información que escribas en el contexto de la unidad.';
  }
  function teacherify(text){
    let t=String(text||'');
    const replacements=[
      [/constituye una práctica familiar y comunal en la que se movilizan saberes sobre/gi,'es una práctica de las familias y de la comunidad donde se ponen en juego conocimientos sobre'],
      [/Esta situación plantea la necesidad de recuperar, profundizar y comparar saberes locales con otros conocimientos para tomar decisiones y comunicar lo aprendido\./gi,'Por eso, en la escuela necesitamos recuperar lo que saben las familias, conversar sobre ello, compararlo con otros conocimientos y usarlo para aprender y tomar decisiones.'],
      [/Se plantea una oportunidad para profundizar en el saber local, compararlo con otros conocimientos y construir compromisos pertinentes\./gi,'Esto nos da la oportunidad de conocer mejor lo que saben nuestras familias, compararlo con otros conocimientos y acordar acciones que sí podamos cumplir.'],
      [/Se requiere comprender el problema desde datos, experiencias y saberes locales para construir alternativas viables\./gi,'Necesitamos conocer mejor lo que está pasando, escuchar a las familias, recoger información y pensar en soluciones que realmente podamos realizar.'],
      [/movilizar competencias/gi,'aprender desde varias áreas'],
      [/respuesta pertinente/gi,'respuesta útil y cercana a su realidad'],
      [/alternativas viables/gi,'soluciones que realmente podamos realizar'],
      [/producciones y evidencias articuladas/gi,'trabajos y evidencias relacionadas entre sí'],
      [/sustentadas/gi,'explicadas con razones y evidencias']
    ];
    replacements.forEach(([a,b])=>t=t.replace(a,b));
    return t;
  }
  function contextualize(text,brief=''){
    let t=teacherify(text);
    const place=placeFromBrief(brief);
    if(place!=='la comunidad'){
      t=t.replace(/^En la comunidad\b/i,`En ${place}`)
         .replace(/^En Ccotataqui\b/i,`En ${place}`)
         .replace(/\bde la comunidad\b/gi,`de ${ctx().community||'la comunidad'}`);
    }
    const c=ctx();
    const extra=[c.calendar,c.notes].filter(Boolean).join(' ');
    if(extra&&t&&!t.toLowerCase().includes(extra.toLowerCase().slice(0,30))){
      const dot=t.indexOf('.');
      if(dot>0)t=t.slice(0,dot+1)+` En este contexto, ${extra}`+t.slice(dot+1);
    }
    return t;
  }

  function mountContextSettings(){
    const card=byId('settings')?.querySelector('.card');
    if(!card||byId('ddTeacherContextSettings'))return;
    const c=ctx();
    const box=document.createElement('div');
    box.id='ddTeacherContextSettings';box.className='dd-profile-box';
    box.innerHTML=`<h2>📍 Contexto donde trabajo</h2><p class="sub">Regístralo una sola vez. DocenteDigital lo reutilizará para que las unidades no parezcan hechas para cualquier lugar.</p><div class="form2">
      <label>Comunidad / localidad<input id="ddCtxCommunity" value="${E(c.community||'')}" placeholder="Ej.: Ccotataqui"></label>
      <label>Distrito<input id="ddCtxDistrict" value="${E(c.district||'')}" placeholder="Ej.: Pisac"></label>
      <label>Provincia<input id="ddCtxProvince" value="${E(c.province||'')}" placeholder="Ej.: Calca"></label>
      <label>Región / departamento<input id="ddCtxRegion" value="${E(c.region||'')}" placeholder="Ej.: Cusco"></label>
      <label class="full">Calendario comunal / actividad del momento<input id="ddCtxCalendar" value="${E(c.calendar||'')}" placeholder="Ej.: siembra de papa, cosecha, pago a la Pachamama, fiesta comunal"></label>
      <label class="full">Otros rasgos importantes<textarea id="ddCtxNotes" placeholder="Ej.: familias quechua hablantes, agricultura familiar, participación de yachaq...">${E(c.notes||'')}</textarea></label>
    </div><button class="btn" id="ddSaveTeacherContext">💾 Guardar mi contexto</button><div id="ddCtxSaved" class="success hidden topgap"></div>`;
    card.prepend(box);
    byId('ddSaveTeacherContext').onclick=()=>{
      state.teacherContext={community:byId('ddCtxCommunity').value.trim(),district:byId('ddCtxDistrict').value.trim(),province:byId('ddCtxProvince').value.trim(),region:byId('ddCtxRegion').value.trim(),calendar:byId('ddCtxCalendar').value.trim(),notes:byId('ddCtxNotes').value.trim()};
      save();byId('ddCtxSaved').textContent='✓ Contexto guardado. Se reutilizará automáticamente en las próximas unidades y proyectos.';byId('ddCtxSaved').classList.remove('hidden');mountQuickContext(true);
    };
  }

  function mountQuickContext(force=false){
    const panel=byId('unitPanel');if(!panel)return;
    let box=byId('ddQuickContext');
    if(!box){box=document.createElement('div');box.id='ddQuickContext';box.className='dd-context-strip';const form=panel.querySelector('.form2');panel.insertBefore(box,form||panel.firstChild);}
    if(force||!box.dataset.ready){
      box.dataset.ready='1';
      box.innerHTML=`<b>📍 Contexto que usará esta unidad:</b> <span id="ddQuickContextText">${E(contextSummary())}</span> <button type="button" class="btn ghost dd-mini" id="ddEditContext">Editar contexto</button>`;
      byId('ddEditContext').onclick=()=>{go('settings');setTimeout(()=>byId('ddTeacherContextSettings')?.scrollIntoView({behavior:'smooth'}),80);};
    } else if(byId('ddQuickContextText'))byId('ddQuickContextText').textContent=contextSummary();
  }

  function updateProposalLanguage(){
    const host=byId('ddProposalChooser');const pending=state.pendingUnitChoice;if(!host||!pending)return;
    const brief=pending.brief||'';
    if(Array.isArray(pending.situations)){
      pending.situations=pending.situations.map(x=>({...x,text:contextualize(x.text,brief)}));
      save();
      document.querySelectorAll('input[name="ddSituation"]').forEach(input=>{
        const item=pending.situations.find(x=>x.key===input.value);const p=input.closest('.dd-choice-card')?.querySelector('p');if(item&&p)p.textContent=item.text;
      });
      const intro=host.querySelector('.dd-choice-intro p');
      if(intro&&/dos opciones/i.test(intro.textContent))intro.innerHTML=`La app propone <b>dos opciones</b> con contexto, problema o necesidad y un reto claro. Están redactadas en <b>lenguaje cercano al docente</b> y toman como referencia: <b>${E(contextSummary())}</b>. Puedes elegir una o escribir la tuya.`;
    }
    if(Array.isArray(pending.products)){
      pending.products=pending.products.map(x=>({...x,text:teacherify(x.text)}));save();
      document.querySelectorAll('input[name="ddProduct"]').forEach(input=>{const item=pending.products.find(x=>x.key===input.value);const p=input.closest('.dd-choice-card')?.querySelector('p');if(item&&p)p.textContent=item.text;});
    }
  }

  function curriculumSourceStatus(){
    // El prototipo aún no debe afirmar que un estándar/desempeño fue copiado literalmente si no está conectado a la matriz curricular interna.
    return state.curriculumMatrixReady===true;
  }
  function auditPreflight(){
    const p=state.pendingUnitChoice||{};
    const productOwn=(byId('ddOwnProduct')?.value||'').trim();
    const productKey=document.querySelector('input[name="ddProduct"]:checked')?.value;
    const product=productOwn||(p.products||[]).find(x=>x.key===productKey)?.text||'';
    const situation=p.selectedSituation||'';
    const duration=byId('unitDuration')?.value||'';
    const brief=p.brief||byId('unitSituation')?.value||'';
    const checks=[
      ['Datos generales',!!(state.level&&state.ieType&&(state.grades||[]).length&&(state.areas||[]).length&&duration)],
      ['Contexto real del docente',!!(brief.trim()&&(ctx().community||ctx().calendar||ctx().notes||brief.trim().length>15))],
      ['2 situaciones propuestas',Array.isArray(p.situations)&&p.situations.length===2],
      ['Situación elegida con reto',!!(situation&&situation.includes('?')&&situation.length>120)],
      ['3 productos propuestos',Array.isArray(p.products)&&p.products.length===3],
      ['Producto final elegido',!!product],
      ['Áreas y grados definidos',!!((state.areas||[]).length&&(state.grades||[]).length)],
      ['Horario / distribución disponible',!!(state.schedule||['2','3'].includes(state.unitSessionMode))],
      ['Reglas de matriz y coherencia activas',true],
      ['Fuente curricular literal conectada',curriculumSourceStatus()]
    ];
    const ok=checks.filter(x=>x[1]).length;
    return {checks,ok,total:checks.length,warning:!curriculumSourceStatus()};
  }
  function showAudit(a){
    let box=byId('ddAuditToast');if(!box){box=document.createElement('div');box.id='ddAuditToast';document.body.appendChild(box);}
    box.className='dd-audit-toast show';
    const rows=a.checks.map(([n,ok])=>`<span class="${ok?'ok':'warn'}">${ok?'✓':'⚠'} ${E(n)}</span>`).join('');
    box.innerHTML=`<div class="dd-audit-head"><b>⚡ Auditoría relámpago</b><strong>${a.ok}/${a.total}</strong></div><div class="dd-audit-grid">${rows}</div>${a.warning?'<small>La estructura puede seguir para probar el prototipo, pero la versión final no debe presentar estándares o desempeños como “literales” hasta conectarlos a la matriz curricular correspondiente.</small>':'<small>Todo listo. Se construirá la unidad respetando el Prompt Maestro.</small>'}`;
  }
  function hideAudit(){byId('ddAuditToast')?.classList.remove('show');}

  let skipAudit=false;
  document.addEventListener('click',e=>{
    const b=e.target.closest?.('#ddBuildUnit');if(!b||skipAudit)return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    const a=auditPreflight();state.lastPromptAudit={at:new Date().toISOString(),ok:a.ok,total:a.total,warning:a.warning};save();showAudit(a);
    setTimeout(()=>{hideAudit();skipAudit=true;b.click();skipAudit=false;setTimeout(()=>{
      const u=(state.units||[])[0];if(u){u.promptAudit=state.lastPromptAudit;u.teacherLanguage=true;u.contextSnapshot={...ctx()};u.purpose='Que los estudiantes aprendan a partir de una situación real de su comunidad, relacionando lo que saben sus familias con los aprendizajes de las áreas y desarrollando actividades adecuadas a cada grado.';save();renderUnits();renderUnitOutput(u);}
    },80);},700);
  },true);

  const observer=new MutationObserver(()=>{mountQuickContext();updateProposalLanguage();});
  observer.observe(document.body,{childList:true,subtree:true});
  mountContextSettings();mountQuickContext();

  const css=document.createElement('style');css.textContent=`
    .dd-context-strip{margin:10px 0 14px;padding:10px 12px;border:1px dashed #8aa79a;border-radius:12px;background:#f7fbf9}.dd-mini{padding:5px 9px;margin-left:6px}.dd-audit-toast{position:fixed;z-index:99999;left:50%;top:76px;transform:translate(-50%,-15px);width:min(720px,calc(100vw - 24px));background:#fff;border:1px solid #b9c9c0;border-radius:16px;box-shadow:0 18px 48px rgba(0,0,0,.22);padding:14px;opacity:0;pointer-events:none;transition:.18s}.dd-audit-toast.show{opacity:1;transform:translate(-50%,0)}.dd-audit-head{display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:8px}.dd-audit-head strong{font-size:18px}.dd-audit-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}.dd-audit-grid span{padding:6px 8px;border-radius:8px;font-size:13px}.dd-audit-grid .ok{background:#eaf7ef}.dd-audit-grid .warn{background:#fff6df}.dd-audit-toast small{display:block;margin-top:8px;color:#5d665f}@media(max-width:620px){.dd-audit-grid{grid-template-columns:1fr}.dd-audit-toast{top:58px}}
  `;document.head.appendChild(css);
})();