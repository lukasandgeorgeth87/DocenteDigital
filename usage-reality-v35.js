/* DocenteDigital – uso real y supuestos ocultos v35
   Neutraliza residuos territoriales del constructor legado SOLO en planificaciones
   aprobadas por el flujo moderno y SOLO cuando el docente no expresó "comunidad"
   ni registró una Comunidad campesina/nativa como tipo de lugar.
*/
(function(){
  if(window.__ddUsageRealityV35)return;window.__ddUsageRealityV35=true;
  if(typeof state!=='object')return;

  const tidy=s=>String(s||'').replace(/\s+/g,' ').trim();
  function ctx(){return state.teacherContext||{};}
  function communityIsReal(unit){
    const c=ctx(),type=tidy(c.locationType).toLowerCase(),brief=tidy(unit?.situationBrief||unit?.planningMeaning?.raw||'');
    return /comunidad campesina|comunidad nativa/.test(type)||/\bcomunidad\b/i.test(brief);
  }
  function placeName(){return tidy(ctx().locationName||ctx().community||ctx().district||'');}
  function neutralize(text,unit){
    let s=String(text||'');
    if(!s||communityIsReal(unit))return s;
    const name=placeName(),poss=name||'nuestro entorno',def=name||'el entorno';
    s=s.replace(/\bnuestra comunidad\b/gi,poss)
       .replace(/\bnuestro comunidad\b/gi,poss)
       .replace(/\bla comunidad\b/gi,def)
       .replace(/\bde la comunidad\b/gi,name?`de ${name}`:'del entorno')
       .replace(/\bcon la comunidad\b/gi,name?`con actores de ${name}`:'con actores del entorno')
       .replace(/\bcomunal(es)?\b/gi,(m,p)=>p?'locales':'local');
    return s;
  }
  function sanitizeUnit(unit){
    if(!unit||unit.selectionApproved!==true||communityIsReal(unit))return unit;
    unit.title=neutralize(unit.title,unit);
    unit.purpose=neutralize(unit.purpose,unit);
    if(Array.isArray(unit.activities))unit.activities.forEach(a=>{if(a&&a.title)a.title=neutralize(a.title,unit);});
    return unit;
  }
  function sanitizeAll(){
    let changed=false;
    (state.units||[]).forEach(u=>{
      if(!u||u.selectionApproved!==true||communityIsReal(u))return;
      const before=JSON.stringify([u.title,u.purpose,(u.activities||[]).map(a=>a.title)]);
      sanitizeUnit(u);
      if(before!==JSON.stringify([u.title,u.purpose,(u.activities||[]).map(a=>a.title)]))changed=true;
    });
    if(changed&&typeof save==='function'){try{save();}catch(e){}}
    return changed;
  }

  const oldRenderUnitOutput=window.renderUnitOutput;
  if(typeof oldRenderUnitOutput==='function')window.renderUnitOutput=function(unit){sanitizeUnit(unit);return oldRenderUnitOutput.apply(this,arguments);};
  const oldRenderUnits=window.renderUnits;
  if(typeof oldRenderUnits==='function')window.renderUnits=function(){sanitizeAll();return oldRenderUnits.apply(this,arguments);};

  /* También limpia los tres títulos heredados más visibles si una planificación moderna
     acaba de ser creada en un contexto no comunitario. No toca títulos escritos libremente
     que no contienen esos residuos territoriales. */
  const oldViewUnit=window.viewUnit;
  if(typeof oldViewUnit==='function')window.viewUnit=function(id){const u=(state.units||[]).find(x=>x.id===id);sanitizeUnit(u);return oldViewUnit.apply(this,arguments);};

  sanitizeAll();
  window.ddAuditUsageReality=function(){
    const affected=(state.units||[]).filter(u=>u?.selectionApproved===true&&!communityIsReal(u)&&/\b(nuestra comunidad|la comunidad|comunal)\b/i.test([u.title,u.purpose,...(u.activities||[]).map(a=>a.title)].join(' ')));
    return {ok:affected.length===0,affected:affected.map(u=>({id:u.id,title:u.title}))};
  };
})();