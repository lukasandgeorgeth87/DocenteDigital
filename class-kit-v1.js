/* Acción integrada: unidad aprobada -> actividad -> sesión, ficha e instrumento.
   Usa los motores existentes y conserva sus documentos originales. */
(function(root){
  'use strict';
  if(root.DDClassKit)return;
  const $=id=>document.getElementById(id);
  const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const kits=()=>Array.isArray(state.classKits)?state.classKits:(state.classKits=[]);
  const units=()=>Array.isArray(state.units)?state.units:[];
  const findKit=id=>kits().find(k=>k.id===id);
  const messages=new Map();
  function renderPanel(unit){
    const host=$('unitOutput');if(!host||!unit)return;
    let panel=$('ddClassKitPanel');
    if(!panel){panel=document.createElement('section');panel.id='ddClassKitPanel';panel.className='dd-class-kit';host.appendChild(panel);}
    const related=kits().filter(k=>k.unitId===unit.id);
    panel.innerHTML=`<h2>📚 Preparar una clase completa</h2>
      <p class="sub">Elige una actividad de la unidad. Docente Digital preparará juntos la sesión, una ficha y una lista de cotejo del grado seleccionado. Cada documento será editable y descargable.</p>
      <div class="form2"><label>Actividad de la unidad<select id="ddClassKitActivity">${(unit.activities||[]).map((a,i)=>`<option value="${i}">${E(a.area)} · ${E(a.title)}</option>`).join('')}</select></label>
      <label>Grado para ficha e instrumento<select id="ddClassKitGrade">${(unit.grades||[]).map(g=>`<option value="${E(g)}">${E(g)}</option>`).join('')}</select></label></div>
      <div class="actions"><button class="btn" type="button" data-dd-kit-create="${E(unit.id)}" ${!unit.activities?.length?'disabled':''}>✨ Preparar mi clase</button></div>
      <p id="ddClassKitMessage" class="sub" role="status" aria-live="polite">${E(messages.get(unit.id)||'Se elaborará un borrador para revisar antes de aplicarlo.')}</p>
      ${related.length?'<h3>Clases preparadas</h3>'+related.map(k=>`<div class="dd-kit-item"><div><b>${E(k.activityTitle)}</b><p class="sub">${E(k.grade)} · ${E(k.area)} · Sesión, ficha e instrumento</p></div><div class="actions"><button class="btn alt" type="button" data-dd-kit-open="session" data-dd-kit-id="${E(k.id)}">Sesión</button><button class="btn alt" type="button" data-dd-kit-open="material" data-dd-kit-id="${E(k.id)}">Ficha</button><button class="btn alt" type="button" data-dd-kit-open="assessment" data-dd-kit-id="${E(k.id)}">Instrumento</button></div></div>`).join(''):''}`;
  }
  function status(unitId,message){messages.set(unitId,message);const box=$('ddClassKitMessage');if(box)box.textContent=message;}
  async function create(unitId){
    const unit=units().find(u=>u.id===unitId);
    const index=Number($('ddClassKitActivity')?.value),grade=$('ddClassKitGrade')?.value||unit?.grades?.[0];
    const activity=unit?.activities?.[index];
    if(!unit||!activity||!unit.grades?.includes(grade))return status(unitId,'Selecciona una actividad y un grado válidos.');
    const trigger=$('ddClassKitPanel')?.querySelector('[data-dd-kit-create]');
    if(trigger?.disabled)return;
    if(trigger)trigger.disabled=true;
    status(unitId,'Preparando los documentos y guardando sus versiones…');
    const completed=[];
    try{
      if(typeof root.useUnit!=='function'||typeof root.generateSession!=='function'||!root.DDMaterials?.create||!root.DDEvaluation?.openAssessment)
        throw new Error('Falta un generador del paquete.');
      root.useUnit(unit.id);
      const activitySelect=$('activity');
      if(!activitySelect||![...activitySelect.options].some(o=>Number(o.value)===index))
        throw new Error('La actividad no está disponible en la sesión.');
      activitySelect.value=String(index);root.syncTitle();
      root.generateSession();
      const session=state.lastSession;
      if(!session||session.unitId!==unit.id||session.activityIndex!==index||!session.title)
        throw new Error('No se pudo generar una sesión vinculada con la actividad seleccionada.');
      completed.push('sesión');

      root.go('materials');root.DDMaterials.fill?.();
      if($('materialSource'))$('materialSource').value='session';
      root.DDMaterials.useCurrent?.();
      if($('materialType'))$('materialType').value='Ficha de trabajo';
      if($('materialGrade'))$('materialGrade').value=grade;
      if($('materialArea'))$('materialArea').value=session.area;
      if($('materialTopic'))$('materialTopic').value=session.title;
      root.DDMaterials.create();
      const material=state.lastMaterial;
      if(!material||material.source!=='session'||material.sourceTitle!==session.title||material.grade!==grade)
        throw new Error('La ficha no conserva la sesión y el grado seleccionados.');
      completed.push('ficha');

      root.go('evaluation');root.DDEvaluation.openAssessment();
      if($('ddAssGrade'))$('ddAssGrade').value=grade;
      if($('ddAssArea'))$('ddAssArea').value=session.area;
      if($('ddAssInstrument'))$('ddAssInstrument').value='Lista de cotejo';
      $('ddAssCreate')?.click();
      const instrument=state.lastAssessment;
      if(!instrument||instrument.unitId!==unit.id||instrument.area!==session.area||instrument.grade!==grade||instrument.instrument!=='Lista de cotejo')
        throw new Error('El instrumento no coincide con el grado, área y unidad de la sesión.');
      completed.push('lista de cotejo');

      const kit={id:'kit'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),
        unitId:unit.id,activityIndex:index,activityTitle:session.title,grade,area:session.area,
        sessionId:session.id,materialId:material.id,assessmentId:instrument.id,createdAt:new Date().toISOString()};
      const prior=kits().findIndex(k=>k.unitId===unit.id&&k.activityIndex===index&&k.grade===grade);
      if(prior>=0)kits().splice(prior,1);
      kits().unshift(kit);state.classKits=state.classKits.slice(0,50);
      if(!root.save())throw new Error('El almacenamiento del navegador no confirmó el guardado.');
      let historyReady=true;
      try{await root.DDDocumentLibrary?.synchronize?.();}catch(error){historyReady=false;console.warn('Historial de clase:',error);}
      root.go('plan');root.viewUnit(unit.id);renderPanel(unit);
      status(unitId,historyReady
        ?'✓ Paquete guardado: sesión, ficha e instrumento. Abre cada documento para revisarlo y descargarlo.'
        :'Paquete disponible en esta sesión. No se confirmó el historial de versiones; descarga los documentos antes de cerrar.');
    }catch(error){
      console.warn('Paquete de clase incompleto:',error);
      root.go('plan');root.viewUnit(unit.id);renderPanel(unit);
      status(unitId,'No se completó el paquete ('+completed.join(', ')+'). '+(error.message||'Revisa los campos y vuelve a intentarlo.')+' Los documentos ya generados no se han eliminado.');
    }finally{
      const current=$('ddClassKitPanel')?.querySelector('[data-dd-kit-create]');
      if(current)current.disabled=false;
    }
  }
  function openSaved(kitId,kind){
    const kit=findKit(kitId);if(!kit)return;
    state.activeUnitId=kit.unitId;
    if(kind==='session'){
      const session=(state.sessions||[]).find(s=>s.id===kit.sessionId);
      if(!session)return alert('La sesión ya no se encuentra. Revísala en Mis documentos.');
      state.lastSession=session;root.save();root.go('session');root.fillSessionUnits?.();root.renderSessionOutput?.(session);
    }else if(kind==='material'){
      const material=(state.materials||[]).find(m=>m.id===kit.materialId);
      if(!material)return alert('La ficha ya no está en el archivo activo.');
      state.lastMaterial=material;root.save();root.go('materials');root.DDMaterials?.reopen?.(material.id);
    }else if(kind==='assessment'){
      const instrument=(state.generatedAssessments||[]).find(a=>a.id===kit.assessmentId);
      if(!instrument)return alert('El instrumento ya no está en el archivo activo.');
      state.lastAssessment=instrument;root.save();root.go('evaluation');root.DDEvaluation?.openSavedAssessment?.();
    }
  }
  const priorRender=root.renderUnitOutput;
  if(typeof priorRender==='function')root.renderUnitOutput=function(unit){
    const result=priorRender.apply(this,arguments);
    renderPanel(unit);
    return result;
  };
  document.addEventListener('click',event=>{
    const createButton=event.target.closest('[data-dd-kit-create]');
    if(createButton){create(createButton.dataset.ddKitCreate);return;}
    const openButton=event.target.closest('[data-dd-kit-open]');
    if(openButton)openSaved(openButton.dataset.ddKitId,openButton.dataset.ddKitOpen);
  });
  const css=document.createElement('style');
  css.textContent='.dd-class-kit{margin-top:24px;padding:18px;border:1px solid #c1dacf;border-radius:16px;background:#f6fcf8}.dd-class-kit h2{margin-top:0}.dd-kit-item{display:flex;justify-content:space-between;align-items:center;gap:14px;border-top:1px solid #d9e6df;padding:12px 0}.dd-kit-item p{margin:4px 0 0}.dd-kit-item .actions{flex-wrap:wrap}@media(max-width:650px){.dd-kit-item{display:block}}';
  document.head.appendChild(css);
  root.DDClassKit={create,openSaved,renderPanel};
})(window);
