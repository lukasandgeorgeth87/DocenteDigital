/* DocenteDigital — onboarding nativo v3
   Usa radio buttons y checkboxes HTML nativos para máxima compatibilidad móvil.
*/
(function(){
  if(window.__ddSetupNativeV3)return;
  window.__ddSetupNativeV3=true;

  const $=id=>document.getElementById(id);
  const state=()=>window.state||{};
  const saveSafe=()=>{try{return window.save?.();}catch(_e){return false;}};

  function checkedValue(name){
    return document.querySelector('input[name="'+name+'"]:checked')?.value||'';
  }

  function showGroups(){
    const level=checkedValue('ddLevel');
    document.querySelectorAll('[data-dd-grade-group]').forEach(g=>g.classList.toggle('dd-native-hidden',Boolean(level)&&g.dataset.ddGradeGroup!==level));
    document.querySelectorAll('[data-dd-area-group]').forEach(g=>g.classList.toggle('dd-native-hidden',Boolean(level)&&g.dataset.ddAreaGroup!==level));
  }

  function syncFromState(){
    const s=state();
    if(s.level){
      const r=document.querySelector('input[name="ddLevel"][value="'+CSS.escape(s.level)+'"]');
      if(r)r.checked=true;
    }
    if(s.ieType){
      const r=document.querySelector('input[name="ddIE"][value="'+CSS.escape(s.ieType)+'"]');
      if(r)r.checked=true;
    }
    document.querySelectorAll('[data-dd-grade-group] input[type="checkbox"]').forEach(cb=>cb.checked=(s.grades||[]).includes(cb.value));
    document.querySelectorAll('[data-dd-area-group] input[type="checkbox"]').forEach(cb=>cb.checked=(s.areas||[]).includes(cb.value));
    if($('linguisticMode'))$('linguisticMode').value=s.linguisticMode||'';
    if($('language'))$('language').value=s.language||'Castellano';
    if($('quechuaVar')){
      const current=s.quechuaVar||'Ninguna';
      if(![...$('quechuaVar').options].some(o=>o.value===current)){
        const op=document.createElement('option');op.value=current;op.textContent=current;$('quechuaVar').appendChild(op);
      }
      $('quechuaVar').value=current;
    }
    showGroups();
  }

  function collect(selector){
    return [...document.querySelectorAll(selector+' input[type="checkbox"]:checked')].map(x=>x.value);
  }

  function message(text){
    const box=$('ddNativeSetupMessage');
    if(box){
      box.textContent=text;
      box.classList.remove('hidden');
      try{box.scrollIntoView({behavior:'smooth',block:'center'});}catch(_e){}
    }else alert(text);
  }

  function submit(e){
    e?.preventDefault();
    const level=checkedValue('ddLevel');
    const ie=checkedValue('ddIE');
    if(!level)return message('Selecciona el nivel educativo.');
    if(!ie)return message('Selecciona el tipo de IE.');

    const grades=collect('[data-dd-grade-group="'+CSS.escape(level)+'"]');
    const areas=collect('[data-dd-area-group="'+CSS.escape(level)+'"]');
    if(!grades.length)return message('Selecciona al menos un grado o edad.');
    if(!areas.length)return message('Selecciona al menos un área.');

    const mode=$('linguisticMode')?.value||'';
    if(!mode)return message('Selecciona el tipo de atención lingüística.');

    const s=state();
    s.level=level;
    s.ieType=ie;
    s.grades=grades;
    s.areas=areas;
    s.linguisticMode=mode;
    s.language=$('language')?.value||'Castellano';
    s.quechuaVar=$('quechuaVar')?.value||'Ninguna';
    saveSafe();

    document.body.classList.remove('dd-setup-mode');
    try{window.fillSelects?.();}catch(_e){}
    if(typeof window.go==='function')window.go('home');
    else{
      document.querySelectorAll('.screen').forEach(x=>x.classList.remove('active'));
      $('home')?.classList.add('active');
    }
  }

  function mount(){
    const form=$('ddSetupNativeForm');if(!form)return;
    document.body.classList.add('dd-setup-mode');
    form.addEventListener('submit',submit);

    document.querySelectorAll('input[name="ddLevel"]').forEach(r=>r.addEventListener('change',()=>{
      const s=state();s.level=checkedValue('ddLevel');s.grades=[];s.areas=[];
      document.querySelectorAll('[data-dd-grade-group] input[type="checkbox"],[data-dd-area-group] input[type="checkbox"]').forEach(cb=>cb.checked=false);
      showGroups();saveSafe();
      setTimeout(()=>document.getElementById('ddStepIE')?.scrollIntoView({behavior:'smooth',block:'start'}),80);
    }));

    document.querySelectorAll('input[name="ddIE"]').forEach(r=>r.addEventListener('change',()=>{
      const s=state();s.ieType=checkedValue('ddIE');saveSafe();
      setTimeout(()=>document.getElementById('ddStepGrades')?.scrollIntoView({behavior:'smooth',block:'start'}),80);
    }));

    document.querySelectorAll('[data-dd-grade-group] input[type="checkbox"]').forEach(cb=>cb.addEventListener('change',()=>{
      saveSafe();
      const level=checkedValue('ddLevel');
      if(level){
        const any=document.querySelector('[data-dd-grade-group="'+CSS.escape(level)+'"] input[type="checkbox"]:checked');
        if(any)setTimeout(()=>document.getElementById('ddStepAreas')?.scrollIntoView({behavior:'smooth',block:'start'}),80);
      }
    }));

    syncFromState();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
  window.DDSetupNative={mount,submit,showGroups};
})();