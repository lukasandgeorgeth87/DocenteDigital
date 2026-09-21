/* DocenteDigital — onboarding nativo v2
   Controlador externo para evitar bloqueos de handlers inline en navegadores móviles.
*/
(function(){
  if(window.__ddSetupNativeV2)return;
  window.__ddSetupNativeV2=true;

  const $=id=>document.getElementById(id);
  const state=()=>window.state||{};
  const saveSafe=()=>{try{return window.save?.();}catch(_e){return false;}};

  const relevant=(type,level)=>[...document.querySelectorAll('[data-dd-'+type+'-group]')].filter(g=>g.dataset['dd'+type[0].toUpperCase()+type.slice(1)+'Group']===level);

  function showGroups(){
    const level=$('ddNativeLevel')?.value||'';
    document.querySelectorAll('[data-dd-grade-group]').forEach(g=>g.classList.toggle('dd-native-hidden',Boolean(level)&&g.dataset.ddGradeGroup!==level));
    document.querySelectorAll('[data-dd-area-group]').forEach(g=>g.classList.toggle('dd-native-hidden',Boolean(level)&&g.dataset.ddAreaGroup!==level));
  }

  function syncFromState(){
    const s=state();
    if($('ddNativeLevel'))$('ddNativeLevel').value=s.level||'';
    if($('ddNativeIE'))$('ddNativeIE').value=s.ieType||'';
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

  function collect(groupSelector){
    return [...document.querySelectorAll(groupSelector+' input[type="checkbox"]:checked')].map(x=>x.value);
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
    const level=$('ddNativeLevel')?.value||'';
    const ie=$('ddNativeIE')?.value||'';
    if(!level)return message('Selecciona el nivel educativo.');
    if(!ie)return message('Selecciona el tipo de IE.');

    const gradeGroup='[data-dd-grade-group="'+CSS.escape(level)+'"]';
    const areaGroup='[data-dd-area-group="'+CSS.escape(level)+'"]';
    const grades=collect(gradeGroup);
    const areas=collect(areaGroup);
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
    $('ddNativeLevel')?.addEventListener('change',()=>{
      const s=state();
      s.level=$('ddNativeLevel').value;
      s.grades=[];
      s.areas=[];
      document.querySelectorAll('[data-dd-grade-group] input[type="checkbox"],[data-dd-area-group] input[type="checkbox"]').forEach(cb=>cb.checked=false);
      showGroups();saveSafe();
    });
    $('ddNativeIE')?.addEventListener('change',()=>{
      const s=state();s.ieType=$('ddNativeIE').value;saveSafe();
    });
    document.querySelectorAll('[data-dd-grade-group] input[type="checkbox"],[data-dd-area-group] input[type="checkbox"]').forEach(cb=>{
      cb.addEventListener('change',saveSafe);
    });
    syncFromState();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();

  window.DDSetupNative={mount,submit,showGroups};
})();