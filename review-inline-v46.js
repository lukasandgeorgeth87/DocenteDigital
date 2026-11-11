/* DocenteDigital: editor integrado, sin fingir acceso a GPT Plus ni llamadas a API.
   Las modificaciones son explícitas, reversibles y permanecen en la unidad/sesión. */
(function(){
  'use strict';
  if(window.DDReviewV46)return;
  function trim(v){return String(v??'').trim();}
  const maxLength=12000;
  function cleanup(v){
    return trim(v)
      .replace(/\bsobre\s+sobre\b/gi,'sobre')
      .replace(/^En nuestra comunidad,\s*(?=En una actividad de aula,)/i,'')
      .replace(/\s{2,}/g,' ');
  }
  function ensure(field,v){
    const text=trim(v);
    if(text.length<5||text.length>maxLength)throw new Error('Revisa «'+field+'»: debe contener entre 5 y 12 000 caracteres.');
    return text;
  }
  function getState(){return window.state;}
  function revision(record,values){
    const previous={...values,updatedAt:new Date().toISOString()};
    record.reviewHistory=(Array.isArray(record.reviewHistory)?record.reviewHistory:[]).concat([previous]).slice(-12);
  }
  function commitUnit(unit,changes){
    if(!unit||!getState()?.units?.some(u=>u.id===unit.id))throw new Error('La unidad no está disponible. No se guardó nada.');
    const situation=ensure('Situación significativa',changes.situation);
    const reto=ensure('Pregunta retadora',changes.reto);
    const product=ensure('Producto',changes.product);
    revision(unit,{situation:unit.situation,reto:unit.reto,product:unit.product,productTitle:unit.productTitle,
      productDescription:unit.productDescription,selectedSituationSource:unit.selectedSituationSource,
      selectedProductKey:unit.selectedProductKey,approvedSelectionSnapshot:unit.approvedSelectionSnapshot});
    const productChanged=trim(unit.product)!==product;
    unit.situation=situation;unit.reto=reto;unit.product=product;unit.productTitle=product;
    if(productChanged)unit.productDescription='';
    unit.selectionApproved=true;unit.selectedSituationSource='Docente';
    unit.selectedProductKey='';unit.productChoiceSource='own';
    unit.approvedSelectionSnapshot={...(unit.approvedSelectionSnapshot||{}),
      situationKey:'Docente',situationText:situation,productKey:'Docente',productTitle:product,
      productDescription:unit.productDescription||''};
    if(typeof window.save==='function'&&!window.save())throw new Error('Cambios en memoria: no se pudo confirmar su almacenamiento. Descarga una copia antes de cerrar.');
    window.renderUnits?.();window.renderUnitOutput?.(unit);window.fillSessionUnits?.();
    return unit;
  }
  function commitSession(session,changes){
    if(!session||session!==getState()?.lastSession)throw new Error('La sesión ya no está activa. No se guardó nada.');
    const purpose=ensure('Propósito',changes.purpose);
    const evidence=ensure('Evidencia',changes.evidence);
    const challenge=ensure('Reto',changes.challenge);
    const criteria={};
    for(const grade of session.grades||[]){
      criteria[grade]=ensure('Criterio '+grade,changes.criteria?.[grade]);
    }
    revision(session,{purpose:session.purpose,evidence:session.evidence,challenge:session.challenge,
      criterion:session.criterion,teacherCriteria:{...(session.teacherCriteria||{})}});
    session.purpose=purpose;session.evidence=evidence;session.challenge=challenge;
    session.teacherCriteria={...(session.teacherCriteria||{}),...criteria};
    if((session.grades||[]).length===1)session.criterion=criteria[session.grades[0]];
    if(typeof window.save==='function'&&!window.save())throw new Error('Cambios en memoria: no se pudo confirmar su almacenamiento. Descarga una copia antes de cerrar.');
    window.renderSessionOutput?.(session);
    return session;
  }
  function undoUnit(unit){
    if(!unit?.reviewHistory?.length)return false;
    const previous=unit.reviewHistory.pop();
    for(const key of ['situation','reto','product','productTitle','productDescription','selectedSituationSource','selectedProductKey','approvedSelectionSnapshot'])
      if(Object.prototype.hasOwnProperty.call(previous,key))unit[key]=previous[key];
    if(typeof window.save==='function'&&!window.save())throw new Error('No se pudo confirmar el almacenamiento al restaurar.');
    window.renderUnits?.();window.renderUnitOutput?.(unit);
    return true;
  }
  function undoSession(session){
    if(!session?.reviewHistory?.length)return false;
    const previous=session.reviewHistory.pop();
    for(const key of ['purpose','evidence','challenge','criterion','teacherCriteria'])
      if(Object.prototype.hasOwnProperty.call(previous,key))session[key]=previous[key];
    if(typeof window.save==='function'&&!window.save())throw new Error('No se pudo confirmar el almacenamiento al restaurar.');
    window.renderSessionOutput?.(session);
    return true;
  }
  function element(tag,text,className){
    const el=document.createElement(tag);
    if(text!==undefined)el.textContent=text;
    if(className)el.className=className;
    return el;
  }
  function field(panel,label,initial,rows=4){
    const wrapper=element('div',undefined,'dd-review-field');
    const id='ddReviewField'+(panel.querySelectorAll('textarea').length+1);
    const caption=element('label',label);
    caption.htmlFor=id;
    const textarea=element('textarea');
    textarea.id=id;textarea.value=trim(initial);textarea.rows=rows;textarea.maxLength=maxLength;
    textarea.spellcheck=true;
    wrapper.append(caption,textarea);panel.append(wrapper);
    return textarea;
  }
  function open(type,id){
    const state=getState();
    const record=type==='unit'?state?.units?.find(u=>u.id===id):state?.lastSession;
    const container=document.getElementById(type==='unit'?'unitOutput':'sessionOutput');
    if(!record||!container)return false;
    container.querySelector('#ddReviewPanel')?.remove();
    const panel=element('section',undefined,'dd-review-panel');
    panel.id='ddReviewPanel';panel.setAttribute('aria-label','Revisión y corrección de '+(type==='unit'?'unidad':'sesión'));
    panel.append(element('h3',type==='unit'?'Revisar y corregir mi unidad':'Revisar y corregir mi sesión'));
    panel.append(element('p','Sin IA conectada: el docente decide qué cambiar. El texto original se guarda para poder restaurarlo. Las ediciones se reflejan en la vista y en Word.','dd-review-explainer'));
    const inputs={};
    if(type==='unit'){
      inputs.situation=field(panel,'Situación significativa',record.situation||record.situationBrief,6);
      inputs.reto=field(panel,'Pregunta retadora',record.reto,3);
      inputs.product=field(panel,'Producto final',record.product,3);
    }else{
      inputs.purpose=field(panel,'Propósito de la sesión',record.purpose,4);
      inputs.evidence=field(panel,'Evidencia a recoger',record.evidence,3);
      inputs.challenge=field(panel,'Reto o problema de partida',record.challenge,3);
      inputs.criteria={};
      for(const grade of record.grades||[]){
        const saved=record.teacherCriteria?.[grade]||record.criterion||'';
        inputs.criteria[grade]=field(panel,'Criterio de evaluación · '+grade,saved,3);
      }
    }
    const feedback=element('p','La corrección se guardará únicamente cuando pulses «Guardar correcciones».','dd-review-feedback');
    feedback.setAttribute('role','status');
    const actions=element('div',undefined,'actions');
    const clean=element('button','Corregir repeticiones','btn alt');clean.type='button';
    clean.addEventListener('click',()=>{
      const fields=[...panel.querySelectorAll('textarea')];
      let touched=0;
      for(const input of fields){const next=cleanup(input.value);if(next!==input.value){input.value=next;touched++;}}
      feedback.textContent=touched?'Se corrigieron '+touched+' campos en el borrador. Revisa antes de guardar.':'No se encontraron las repeticiones conocidas. Puedes editar manualmente.';
    });
    const save=element('button','Guardar correcciones','btn');save.type='button';
    save.addEventListener('click',()=>{
      try{
        if(type==='unit')commitUnit(record,{situation:inputs.situation.value,reto:inputs.reto.value,product:inputs.product.value});
        else commitSession(record,{purpose:inputs.purpose.value,evidence:inputs.evidence.value,
          challenge:inputs.challenge.value,criteria:Object.fromEntries(Object.entries(inputs.criteria).map(([g,v])=>[g,v.value]))});
      }catch(err){feedback.textContent=err?.message||'No se pudo guardar.';feedback.className='dd-review-feedback dd-review-error';}
    });
    const cancel=element('button','Cancelar','btn ghost');cancel.type='button';
    cancel.addEventListener('click',()=>panel.remove());
    actions.append(clean,save,cancel);
    if(Array.isArray(record.reviewHistory)&&record.reviewHistory.length){
      const undo=element('button','Restaurar versión anterior','btn ghost');undo.type='button';
      undo.addEventListener('click',()=>{try{type==='unit'?undoUnit(record):undoSession(record);}catch(err){feedback.textContent=err.message;}});
      actions.append(undo);
    }
    panel.append(actions,feedback);
    container.append(panel);
    panel.scrollIntoView?.({behavior:'smooth',block:'nearest'});
    return true;
  }
  const style=document.createElement('style');
  style.textContent='.dd-review-panel{border:2px solid #b9d9ca;border-radius:14px;background:#f6fbf8;margin:18px 0;padding:18px}.dd-review-field{margin:12px 0}.dd-review-field label{display:block;font-weight:700;margin-bottom:5px}.dd-review-field textarea{width:100%;box-sizing:border-box;border:1px solid #97b9a8;background:#fff;border-radius:8px;min-height:80px;padding:11px;font:inherit;line-height:1.5}.dd-review-field textarea:focus{outline:3px solid #91d7ba}.dd-review-explainer{color:#38594c}.dd-review-feedback{font-size:13px;color:#38594c}.dd-review-error{color:#a53b32}';
  document.head.appendChild(style);
  window.DDReviewV46=Object.freeze({openUnit:id=>open('unit',id),openSession:()=>open('session'),cleanup,commitUnit,commitSession,undoUnit,undoSession});
})();
