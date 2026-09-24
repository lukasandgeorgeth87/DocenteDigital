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
    document.querySelectorAll('[data-dd-grade-group]').forEach(g=>g.classList.toggle('dd-native-hidden',g.dataset.ddGradeGroup!==level));
    document.querySelectorAll('[data-dd-area-group]').forEach(g=>g.classList.toggle('dd-native-hidden',g.dataset.ddAreaGroup!==level));
    updateLanguageOptions();
    const status=$('ddNativeSelectionStatus');
    if(status){
      const ie=checkedValue('ddIE');
      const grades=selectedItems('grade',level);
      const areas=selectedItems('area',level);
      status.textContent=level
        ? '✓ '+level+(ie?' · '+ie:'')+(grades.length?' · '+grades.join(', '):'')+(areas.length?' · '+areas.join(', '):'')
        : 'Empieza seleccionando un nivel.';
    }
  }

  function selectedItems(type,level){
    const group=[...document.querySelectorAll('[data-dd-'+type+'-group]')]
      .find(g=>g.dataset[type==='grade'?'ddGradeGroup':'ddAreaGroup']===level);
    return group?[...group.querySelectorAll('input[type=checkbox]:checked')].map(x=>x.value):[];
  }

  function updateLanguageOptions(){
    const level=checkedValue('ddLevel'),mode=$('linguisticMode')?.value||'';
    const origin=$('quechuaVar');if(!origin)return;
    const chosen=origin.value||'Ninguna';
    if(mode==='EIB'){
      const opts=window.ddLinguisticLanguages||[
        'Quechua Cusco-Collao (Cusco)','Quechua Chanka','Quechua Central',
        'Aimara','Asháninka','Awajún','Shipibo-Konibo','Otra lengua originaria'
      ];
      if(origin.options.length<2){
        origin.replaceChildren(new Option('Selecciona y confirma tu lengua/variedad','Ninguna'),
          ...opts.map(s=>new Option(s,s)));
      }
      origin.disabled=false;
    }else{
      origin.replaceChildren(new Option('Ninguna','Ninguna'));
      origin.disabled=true;
    }
    if([...origin.options].some(x=>x.value===chosen))origin.value=chosen;
    const csl=document.querySelector('[data-dd-initial-csl]');
    if(csl)csl.hidden=!(level==='Inicial'&&mode==='EIB'&&$('language')?.value==='Lengua originaria'&&selectedItems('grade',level).includes('5 años'));
  }

  function persistSelections(){
    const s=state(),level=checkedValue('ddLevel'),ie=checkedValue('ddIE');
    if(!level)return;
    s.level=level;s.ieType=ie;
    s.grades=selectedItems('grade',level);
    s.areas=selectedItems('area',level);
    showGroups();saveSafe();
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

    const grades=selectedItems('grade',level);
    const areas=selectedItems('area',level);
    if(!grades.length)return message('Selecciona al menos un grado o edad.');
    if(ie==='Polidocente'&&grades.length>1)return message('En una planificación polidocente selecciona un solo grado o edad.');
    if(!areas.length)return message('Selecciona al menos un área.');
    if(level==='Secundaria'&&areas.length>1)return message('En Secundaria selecciona un área principal para esta planificación.');

    const mode=$('linguisticMode')?.value||'';
    if(!mode)return message('Selecciona el tipo de atención lingüística.');
    const selectedOrigin=$('quechuaVar')?.value||'Ninguna';
    if(mode==='EIB'&&(!selectedOrigin||selectedOrigin==='Ninguna')){
      return message('En EIB selecciona y confirma la lengua originaria/variedad antes de entrar.');
    }
    const s=state();
    s.level=level;
    s.ieType=ie;
    s.grades=grades;
    s.areas=areas;
    s.linguisticMode=mode;
    s.language=$('language')?.value||'Castellano';
    s.quechuaVar=mode==='EIB'?selectedOrigin:'Ninguna';
    s.indigenousLanguage=s.quechuaVar;
    s.linguisticSelectionConfirmed=mode==='EIB';
    if(mode!=='EIB')s.language='Castellano';
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
    document.body.classList.toggle('dd-setup-mode',Boolean($('setup')?.classList.contains('active')));
    if(form.dataset.ddNativeMounted==='1')return;
    form.dataset.ddNativeMounted='1';
    form.addEventListener('submit',submit);
    document.querySelectorAll('input[name="ddLevel"]').forEach(r=>r.addEventListener('change',()=>{
      const s=state();s.level=checkedValue('ddLevel');s.grades=[];s.areas=[];
      document.querySelectorAll('[data-dd-grade-group] input[type=checkbox],[data-dd-area-group] input[type=checkbox]')
        .forEach(cb=>cb.checked=false);
      persistSelections();
      setTimeout(()=>document.getElementById('ddStepIE')?.scrollIntoView({behavior:'smooth',block:'start'}),100);
    }));
    document.querySelectorAll('input[name="ddIE"]').forEach(r=>r.addEventListener('change',()=>{
      const s=state();s.ieType=checkedValue('ddIE');s.grades=[];
      document.querySelectorAll('[data-dd-grade-group] input[type=checkbox]').forEach(cb=>cb.checked=false);
      persistSelections();
      setTimeout(()=>document.getElementById('ddStepGrades')?.scrollIntoView({behavior:'smooth',block:'start'}),100);
    }));
    document.querySelectorAll('[data-dd-grade-group] input[type=checkbox]').forEach(cb=>cb.addEventListener('change',()=>{
      if(checkedValue('ddIE')==='Polidocente'&&cb.checked){
        cb.closest('fieldset')?.querySelectorAll('input[type=checkbox]').forEach(other=>{if(other!==cb)other.checked=false;});
      }
      persistSelections();
    }));
    document.querySelectorAll('[data-dd-area-group] input[type=checkbox]').forEach(cb=>cb.addEventListener('change',()=>{
      if(checkedValue('ddLevel')==='Secundaria'&&cb.checked){
        cb.closest('fieldset')?.querySelectorAll('input[type=checkbox]').forEach(other=>{if(other!==cb)other.checked=false;});
      }
      persistSelections();
    }));
    $('linguisticMode')?.addEventListener('change',()=>{
      const s=state();s.linguisticMode=$('linguisticMode').value;
      s.linguisticSelectionConfirmed=false;s.indigenousLanguage='Ninguna';s.quechuaVar='Ninguna';
      if(s.linguisticMode!=='EIB')s.language='Castellano';
      updateLanguageOptions();saveSafe();
    });
    $('language')?.addEventListener('change',()=>{updateLanguageOptions();saveSafe();});
    $('quechuaVar')?.addEventListener('change',()=>{
      const s=state();
      if($('linguisticMode')?.value==='EIB'){
        s.indigenousLanguage=$('quechuaVar').value;s.quechuaVar=s.indigenousLanguage;
        s.linguisticSelectionConfirmed=s.indigenousLanguage!=='Ninguna';
      }
      saveSafe();
    });
    syncFromState();updateLanguageOptions();
  }

  // Navigation is shared with the heavy planning app: never hide the mobile
  // menu after a successfully completed profile or when visiting Home.
  const previousGo=window.go;
  if(typeof previousGo==='function'){
    window.go=function(id){
      const result=previousGo.apply(this,arguments);
      const setupVisible=Boolean($('setup')?.classList.contains('active'));
      document.body.classList.toggle('dd-setup-mode',setupVisible);
      if(setupVisible)mount();
      return result;
    };
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
  window.DDSetupNative={mount,submit,showGroups};
})();