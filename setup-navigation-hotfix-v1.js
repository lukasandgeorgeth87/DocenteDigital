/* DocenteDigital — hotfix navegación del asistente inicial v1
   Evita bloqueos del flujo Nivel → Tipo IE → Grados → Áreas en navegadores móviles.
   Maneja los botones del asistente de forma directa, sin depender de handlers inline previos.
*/
(function(){
  if(window.__ddSetupNavigationHotfixV1)return;
  window.__ddSetupNavigationHotfixV1=true;

  const $=id=>document.getElementById(id);
  const arr=v=>Array.isArray(v)?v:[];
  const persist=()=>{try{window.save?.();}catch(_e){}};

  function showStep(n){
    [1,2,3,4].forEach(i=>{
      const el=$('step'+i);
      if(el)el.classList.toggle('hidden',i!==n);
      const badge=$('s'+i);
      if(badge)badge.classList.toggle('active',i<=n);
    });
    if(n===3)renderGradesSafe();
    if(n===4)renderAreasSafe();
    try{document.querySelector('#setup .card')?.scrollIntoView({behavior:'smooth',block:'start'});}catch(_e){}
  }

  function selectOne(key,val,button){
    if(!window.state)return;
    window.state[key]=val;
    const wrap=button?.closest('.choices');
    wrap?.querySelectorAll('.choice').forEach(b=>b.classList.toggle('active',b===button));
    persist();
    // Este hotfix intercepta el toque antes del onclick original.
    // Por eso debe avanzar aquí mismo después de seleccionar.
    if(key==='level')setTimeout(()=>advance(2),70);
    if(key==='ieType')setTimeout(()=>advance(3),70);
  }

  function gradeOptionsSafe(){
    const level=window.state?.level;
    if(level==='Inicial')return ['3 años','4 años','5 años'];
    if(level==='Primaria')return ['1.º','2.º','3.º','4.º','5.º','6.º'];
    return ['1.º','2.º','3.º','4.º','5.º'];
  }

  function areaOptionsSafe(){
    const level=window.state?.level;
    if(level==='Inicial')return ['Comunicación','Matemática','Personal Social','Ciencia y Tecnología','Psicomotriz','Arte y Cultura'];
    if(level==='Primaria')return ['Comunicación','Matemática','Personal Social','Ciencia y Tecnología','Arte y Cultura','Educación Física','Educación Religiosa'];
    return ['Comunicación','Matemática','Ciencia y Tecnología','Ciencias Sociales','DPCC','Inglés','Educación Física','Arte y Cultura','Educación Religiosa','EPT'];
  }

  function renderGradesSafe(){
    const wrap=$('gradeChoices');if(!wrap||!window.state)return;
    const multi=window.state.ieType==='Multigrado'||window.state.ieType==='Unidocente';
    const help=$('gradeHelp');
    if(help)help.textContent=multi?'Puedes seleccionar varios grados o edades para una planificación común y diferenciada.':'Selecciona el grado con el que trabajarás.';
    wrap.innerHTML='';
    gradeOptionsSafe().forEach(g=>{
      const b=document.createElement('button');
      b.type='button';
      b.className='choice'+(arr(window.state.grades).includes(g)?' active':'');
      b.textContent=g;
      b.dataset.ddGrade=g;
      wrap.appendChild(b);
    });
  }

  function renderAreasSafe(){
    const wrap=$('areaChoices');if(!wrap||!window.state)return;
    const multiple=window.state.level!=='Secundaria';
    const help=$('areaHelp');
    if(help)help.textContent=multiple?'En Inicial y Primaria puedes seleccionar varias áreas.':'En Secundaria la programación se organiza por área.';
    wrap.innerHTML='';
    areaOptionsSafe().forEach(a=>{
      const b=document.createElement('button');
      b.type='button';
      b.className='choice'+(arr(window.state.areas).includes(a)?' active':'');
      b.textContent=a;
      b.dataset.ddArea=a;
      wrap.appendChild(b);
    });
  }

  function toggleGrade(button){
    const g=button.dataset.ddGrade;if(!g||!window.state)return;
    const multi=window.state.ieType==='Multigrado'||window.state.ieType==='Unidocente';
    const current=arr(window.state.grades);
    window.state.grades=multi?(current.includes(g)?current.filter(x=>x!==g):[...current,g]):[g];
    renderGradesSafe();persist();
  }

  function toggleArea(button){
    const a=button.dataset.ddArea;if(!a||!window.state)return;
    const multiple=window.state.level!=='Secundaria';
    const current=arr(window.state.areas);
    window.state.areas=multiple?(current.includes(a)?current.filter(x=>x!==a):[...current,a]):[a];
    renderAreasSafe();persist();
  }

  function advance(n){
    const s=window.state||{};
    if(n===2&&!s.level){alert('Primero selecciona el nivel educativo.');return;}
    if(n===3&&!s.ieType){alert('Selecciona el tipo de IE.');return;}
    if(n===4&&!arr(s.grades).length){alert('Selecciona al menos un grado o edad.');return;}
    showStep(n);
  }

  function finish(){
    const s=window.state||{};
    if(!arr(s.areas).length){alert('Selecciona al menos un área.');return;}
    const mode=$('linguisticMode')?.value||'';
    if(!mode){alert('Selecciona el tipo de atención lingüística de la IE.');return;}
    s.linguisticMode=mode;
    s.language=$('language')?.value||'Castellano';
    s.quechuaVar=$('quechuaVar')?.value||'Ninguna';
    persist();
    try{window.fillSelects?.();}catch(_e){}
    if(typeof window.go==='function')window.go('home');
    else{
      document.querySelectorAll('.screen').forEach(x=>x.classList.remove('active'));
      $('home')?.classList.add('active');
    }
  }

  function handle(e){
    const setup=$('setup');
    if(!setup||!setup.contains(e.target))return;
    const button=e.target.closest('button');
    if(!button)return;

    if(button.dataset.ddGrade){
      e.preventDefault();e.stopImmediatePropagation();toggleGrade(button);return;
    }
    if(button.dataset.ddArea){
      e.preventDefault();e.stopImmediatePropagation();toggleArea(button);return;
    }

    const raw=button.getAttribute('onclick')||'';
    let m=raw.match(/chooseOne\(['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]/);
    if(m){
      e.preventDefault();e.stopImmediatePropagation();selectOne(m[1],m[2],button);return;
    }
    m=raw.match(/nextSetup\((\d+)\)/);
    if(m){
      e.preventDefault();e.stopImmediatePropagation();advance(Number(m[1]));return;
    }
    if(/finishSetup\(\)/.test(raw)){
      e.preventDefault();e.stopImmediatePropagation();finish();return;
    }
  }

  document.addEventListener('click',handle,true);
  document.addEventListener('touchend',function(e){
    const button=e.target.closest?.('#setup button');
    if(!button)return;
    // Click sintetizado del navegador hará el trabajo. Esta marca solo permite diagnóstico.
    window.__ddLastSetupTouch={label:(button.textContent||'').trim(),at:new Date().toISOString()};
  },true);

  window.DDSetupHotfix={showStep,advance,finish,renderGradesSafe,renderAreasSafe};
})();