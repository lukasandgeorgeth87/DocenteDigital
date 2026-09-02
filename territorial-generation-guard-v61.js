/* DocenteDigital – guardia de neutralidad territorial en generación v61
   Corrige únicamente borradores nuevos generados por capas legado.
   No modifica documentos marcados como emitidos/aprobados ni texto propio del docente.
*/
(function(){
  if(window.__ddTerritorialGenerationGuardV61)return;window.__ddTerritorialGenerationGuardV61=true;
  if(typeof state!=='object')return;
  const loadedAt=Date.now();
  const tidy=s=>String(s||'').replace(/\s+/g,' ').trim();
  const low=s=>tidy(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');

  function contextAllowsCommunity(unit){
    const brief=low(unit?.situationBrief||unit?.planningMeaning?.raw||'');
    if(/\bcomunidad\b|\bcomunal\b|\bcomunitari[oa]s?\b/.test(brief))return true;
    const t=tidy(state.teacherContext?.locationType||'');
    return /^Comunidad (campesina|nativa)$/i.test(t);
  }
  function contextAllowsFamily(unit){
    const brief=low(unit?.situationBrief||unit?.planningMeaning?.raw||'');
    return /\bfamilia\b|\bfamilias\b|\bfamiliar\b|\bfamiliares\b|\bmadres?\b|\bpadres?\b|\babuel[oa]s?\b/.test(brief);
  }
  function placeName(){return tidy(state.teacherContext?.locationName||state.teacherContext?.community||'');}
  function isHistorical(unit){
    const s=low(unit?.status||unit?.documentStatus||'');
    return /emitid|aprobad|archivad|histor/.test(s);
  }
  function isNew(unit){
    const t=Date.parse(unit?.createdAt||'');
    return Number.isFinite(t)&&t>=loadedAt-5000;
  }
  function neutralText(value,unit){
    let s=String(value||'');
    const brief=low(unit?.situationBrief||'');
    const location=placeName();
    if(!/ccotataqui/.test(brief)&&low(location)!=='ccotataqui'){
      s=s.replace(/\bde Ccotataqui\b/gi,location?`de ${location}`:'del entorno de los estudiantes');
      s=s.replace(/\bCcotataqui\b/gi,location||'el entorno de los estudiantes');
    }
    if(!contextAllowsCommunity(unit)){
      s=s.replace(/\bnuestra comunidad\b/gi,'nuestro entorno');
      s=s.replace(/\bde nuestra comunidad\b/gi,'de nuestro entorno');
      s=s.replace(/\ben nuestra comunidad\b/gi,'en nuestro entorno');
      s=s.replace(/\bla comunidad\b/gi,'el entorno');
      s=s.replace(/\bde la comunidad\b/gi,'del entorno');
      s=s.replace(/\ben la comunidad\b/gi,'en el entorno');
      s=s.replace(/\bmuestra comunitaria\b/gi,'muestra escolar');
      s=s.replace(/\bpresentación comunitaria\b/gi,'presentación escolar');
    }
    if(!contextAllowsFamily(unit)){
      s=s.replace(/\bsaberes de nuestras familias\b/gi,'saberes mencionados en la situación');
      s=s.replace(/\bsaberes familiares\b/gi,'saberes mencionados en la situación');
      s=s.replace(/\bexperiencias familiares y comunitarias\b/gi,'experiencias relacionadas con la situación');
      s=s.replace(/\bnuestras familias\b/gi,'las personas involucradas en la situación');
      s=s.replace(/\bde las familias\b/gi,'de las personas involucradas');
    }
    return s;
  }
  function sanitizeUnit(unit){
    if(!unit||isHistorical(unit)||!isNew(unit))return false;
    let changed=false;
    const set=(obj,key)=>{if(!obj||typeof obj[key]!=='string')return;const before=obj[key],after=neutralText(before,unit);if(after!==before){obj[key]=after;changed=true;}};
    set(unit,'purpose');set(unit,'reto');
    if(unit.selectedSituationSource!=='Docente')set(unit,'situation');
    if(unit.selectedProductTitle!=='Producto propuesto por el docente')set(unit,'product');
    (unit.purposes||[]).forEach(p=>{
      set(p,'evidence');set(p,'instrument');
      (p.performances||[]).forEach(x=>set(x,'text'));
      (p.criteria||[]).forEach(x=>set(x,'text'));
    });
    (unit.enfoques||[]).forEach(x=>set(x,'action'));
    (unit.activities||[]).forEach(x=>{set(x,'title');set(x,'description');});
    if(changed&&typeof save==='function')save();
    return changed;
  }
  function sanitizeNewest(){
    const id=state.activeUnitId;
    const unit=(state.units||[]).find(x=>x.id===id)||(state.units||[])[0];
    return sanitizeUnit(unit);
  }

  document.addEventListener('click',e=>{
    const b=e.target.closest?.('button');if(!b)return;
    const on=b.getAttribute('onclick')||'';
    if(b.id==='ddBuildUnit'||/createUnitDemo/.test(on)){
      setTimeout(sanitizeNewest,80);setTimeout(sanitizeNewest,220);
    }
  },true);

  const oldRender=window.renderUnitOutput;
  if(typeof oldRender==='function')window.renderUnitOutput=function(unit){sanitizeUnit(unit);return oldRender.apply(this,arguments);};
  const oldWord=window.unitWordHtml;
  if(typeof oldWord==='function')window.unitWordHtml=function(unit){sanitizeUnit(unit);return oldWord.apply(this,arguments);};

  window.ddAuditTerritorialGeneration=function(unit){
    const texts=[unit?.purpose,unit?.reto,unit?.situation,unit?.product,...(unit?.purposes||[]).flatMap(p=>[p.evidence,...(p.performances||[]).map(x=>x.text),...(p.criteria||[]).map(x=>x.text)])].filter(Boolean).join(' ');
    const unauthorizedCommunity=!contextAllowsCommunity(unit)&&/\bnuestra comunidad\b|\bde la comunidad\b|\ben la comunidad\b/i.test(texts);
    const unauthorizedFamily=!contextAllowsFamily(unit)&&/\bnuestras familias\b|\bsaberes familiares\b|\bsaberes de nuestras familias\b|\bexperiencias familiares\b/i.test(texts);
    const foreignCcotataqui=!/ccotataqui/.test(low(unit?.situationBrief||''))&&low(placeName())!=='ccotataqui'&&/ccotataqui/i.test(texts);
    return{pass:!unauthorizedCommunity&&!unauthorizedFamily&&!foreignCcotataqui,unauthorizedCommunity,unauthorizedFamily,foreignCcotataqui};
  };
})();