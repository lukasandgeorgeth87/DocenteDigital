/* DocenteDigital – perfil lingüístico v26
   Separa explícitamente IE EIB de IE monolingüe castellano.
   Catálogo de lenguas basado en denominaciones usadas por MINEDU; Cusco-Collao se muestra solo como sugerencia editable para el contexto Cusco.
*/
(function(){
  if(window.__ddLinguisticProfileV26)return;window.__ddLinguisticProfileV26=true;
  if(typeof state!=='object')return;

  const FIRST='Quechua Cusco-Collao (Cusco)';
  const NONE='Ninguna';
  const languages=[
    FIRST,
    'Quechua Chanka',
    'Quechua Central',
    'Quechua Cajamarca',
    'Quechua Inkawasi-Kañaris',
    'Quechua amazónico / Kichwa amazónico',
    'Aimara',
    'Achuar',
    'Amahuaca',
    'Arabela',
    'Asháninka',
    'Asheninka',
    'Awajún',
    'Bora',
    'Chamicuro',
    'Cashinahua',
    'Ese eja',
    'Harakbut',
    'Iñapari',
    'Ikitu',
    'Isconahua',
    'Jaqaru',
    'Kakataibo',
    'Kakinte',
    'Kandozi-Chapra',
    'Kapanawa',
    'Kawki',
    'Kukama Kukamiria',
    'Madija',
    'Maijuna',
    'Matsés',
    'Matsigenka',
    'Muniche',
    'Murui-Muinani',
    'Nahua (Yora)',
    'Nanti',
    'Nomatsigenga',
    'Ocaina',
    'Omagua',
    'Resígaro',
    'Secoya',
    'Sharanahua',
    'Shawi',
    'Shipibo-Konibo',
    'Shiwilu',
    'Taushiro',
    'Ticuna',
    'Urarina',
    'Wampis',
    'Yagua',
    'Yaminahua',
    'Yanesha',
    'Yine'
  ];

  const esc=v=>typeof escapeHtml==='function'?escapeHtml(String(v??'')):String(v??'');
  const originOptions=(includeNone=true)=>`${includeNone?`<option value="${NONE}">${NONE}</option>`:''}${languages.map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join('')}`;

  state.linguisticMode=state.linguisticMode||'';
  state.indigenousLanguage=state.indigenousLanguage||((state.quechuaVar&&state.quechuaVar!==NONE)?state.quechuaVar:NONE);

  function mountSetup(){
    const step4=document.getElementById('step4');if(!step4)return;
    let card=document.getElementById('ddLinguisticProfile');
    if(!card){
      const candidates=[...step4.querySelectorAll('.card.inner')];
      card=candidates.find(x=>/configuración eib|perfil lingüístico/i.test(x.textContent||''))||candidates[0];
      if(!card)return;
      card.id='ddLinguisticProfile';
    }
    card.innerHTML=`
      <h3>🌎 Perfil lingüístico de la IE</h3>
      <p class="sub">Primero indica si la institución brinda atención EIB o si trabaja de manera monolingüe en castellano.</p>
      <div class="form2">
        <label>Tipo de atención lingüística
          <select id="linguisticMode">
            <option value="">Selecciona una opción</option>
            <option value="EIB">Educación Intercultural Bilingüe (EIB)</option>
            <option value="Monolingüe castellano">Monolingüe castellano</option>
          </select>
        </label>
        <label>Lengua de trabajo
          <select id="language">
            <option value="Bilingüe">Bilingüe</option>
            <option value="Lengua originaria">Lengua originaria</option>
            <option value="Castellano">Castellano</option>
          </select>
        </label>
        <label class="full">Lengua originaria / variedad principal
          <select id="quechuaVar">${originOptions(true)}</select>
        </label>
      </div>
      <div id="ddLinguisticHelp" class="notice" style="margin-top:8px"></div>
      <small>Para EIB, la lengua seleccionada se reutilizará en planificación, sesiones y materiales. Si la IE es monolingüe castellano, “otra lengua” quedará en <b>Ninguna</b>.</small>
    `;
    const mode=document.getElementById('linguisticMode');
    if(mode)mode.value=state.linguisticMode||'';
    const lang=document.getElementById('language');
    if(lang)lang.value=['Bilingüe','Lengua originaria','Castellano'].includes(state.language)?state.language:(state.linguisticMode==='EIB'?'Bilingüe':'Castellano');
    const origin=document.getElementById('quechuaVar');
    if(origin){
      const preferred=state.indigenousLanguage||state.quechuaVar||NONE;
      origin.value=[NONE,...languages].includes(preferred)?preferred:NONE;
    }
    mode?.addEventListener('change',()=>syncSetup(false));
    lang?.addEventListener('change',persistFromControls);
    origin?.addEventListener('change',persistFromControls);
    syncSetup(true);
  }

  function syncSetup(fromState){
    const mode=document.getElementById('linguisticMode');
    const lang=document.getElementById('language');
    const origin=document.getElementById('quechuaVar');
    const help=document.getElementById('ddLinguisticHelp');
    if(!mode||!lang||!origin)return;
    if(fromState&&state.linguisticMode)mode.value=state.linguisticMode;
    const value=mode.value;
    if(value==='Monolingüe castellano'){
      lang.value='Castellano';lang.disabled=true;
      origin.value=NONE;origin.disabled=true;
      if(help)help.innerHTML='✓ <b>IE monolingüe castellano:</b> se trabajará en castellano y la opción de lengua originaria permanecerá en “Ninguna”.';
    }else if(value==='EIB'){
      lang.disabled=false;origin.disabled=false;
      if(!['Bilingüe','Lengua originaria','Castellano'].includes(lang.value)||lang.value==='Castellano'&&!state.language)lang.value='Bilingüe';
      if(help)help.innerHTML=`✓ <b>IE EIB:</b> selecciona la lengua originaria pertinente. Si tu IE está en Cusco, revisa si corresponde <b>${FIRST}</b>; es solo una sugerencia y no se seleccionará automáticamente.`;
    }else{
      lang.disabled=true;origin.disabled=true;
      if(help)help.textContent='Selecciona EIB o Monolingüe castellano para continuar.';
    }
    persistFromControls(false);
    syncMaterials();
  }

  function persistFromControls(doSave=true){
    const mode=document.getElementById('linguisticMode');
    const lang=document.getElementById('language');
    const origin=document.getElementById('quechuaVar');
    if(!mode||!lang||!origin)return;
    if(mode.value){
      state.linguisticMode=mode.value;
      state.language=mode.value==='Monolingüe castellano'?'Castellano':lang.value;
      state.indigenousLanguage=mode.value==='Monolingüe castellano'?NONE:origin.value;
      state.quechuaVar=state.indigenousLanguage; // compatibilidad con módulos anteriores
      if(doSave&&typeof save==='function')save();
    }
  }

  function mountMaterials(){
    const ml=document.getElementById('materialLanguage');
    const mo=document.getElementById('materialQuechua');
    if(ml&&!ml.dataset.dd26){
      ml.dataset.dd26='1';
      ml.innerHTML='<option value="Castellano">Castellano</option><option value="Lengua originaria">Lengua originaria</option><option value="Bilingüe">Bilingüe</option>';
    }
    if(mo&&!mo.dataset.dd26){
      mo.dataset.dd26='1';
      mo.innerHTML=originOptions(true);
      const label=mo.closest('label');if(label&&label.firstChild)label.firstChild.textContent='Lengua originaria / variedad';
    }
    syncMaterials();
  }

  function syncMaterials(){
    const ml=document.getElementById('materialLanguage');
    const mo=document.getElementById('materialQuechua');
    if(!ml||!mo)return;
    if(state.linguisticMode==='Monolingüe castellano'){
      ml.value='Castellano';
      mo.value=NONE;mo.disabled=true;
    }else{
      mo.disabled=false;
      if(['Castellano','Lengua originaria','Bilingüe'].includes(state.language))ml.value=state.language;
      const v=state.indigenousLanguage||state.quechuaVar||NONE;
      mo.value=[NONE,...languages].includes(v)?v:NONE;
    }
  }

  const previousFinish=window.finishSetup;
  if(typeof previousFinish==='function')window.finishSetup=function(){
    const mode=document.getElementById('linguisticMode');
    const origin=document.getElementById('quechuaVar');
    if(mode&&!mode.value){alert('Indica si la IE es EIB o monolingüe castellano.');return;}
    if(mode?.value==='EIB'&&(!origin?.value||origin.value===NONE)){alert('Selecciona la lengua originaria principal de la IE EIB.');return;}
    persistFromControls(true);
    return previousFinish.apply(this,arguments);
  };

  const previousRenderAreas=window.renderAreas;
  if(typeof previousRenderAreas==='function')window.renderAreas=function(){
    const r=previousRenderAreas.apply(this,arguments);setTimeout(()=>{mountSetup();mountMaterials();},0);return r;
  };

  const previousRefresh=window.refresh;
  if(typeof previousRefresh==='function')window.refresh=function(){
    const r=previousRefresh.apply(this,arguments);
    mountMaterials();
    const summary=document.getElementById('settingsSummary');
    if(summary&&state.linguisticMode){
      const extra=`<br><b>Atención lingüística:</b> ${esc(state.linguisticMode)}${state.linguisticMode==='EIB'?`<br><b>Lengua originaria:</b> ${esc(state.indigenousLanguage||state.quechuaVar||NONE)}`:''}`;
      if(!/Atención lingüística:/.test(summary.innerHTML))summary.innerHTML+=extra;
    }
    return r;
  };

  const previousGo=window.go;
  if(typeof previousGo==='function')window.go=function(id){
    const r=previousGo.apply(this,arguments);setTimeout(()=>{if(id==='materials')mountMaterials();if(id==='setup')mountSetup();},0);return r;
  };

  window.ddLinguisticLanguages=languages.slice();
  window.ddSyncLinguisticProfile=()=>{mountSetup();syncSetup(true);mountMaterials();};
  setTimeout(()=>{mountSetup();mountMaterials();},0);
})();