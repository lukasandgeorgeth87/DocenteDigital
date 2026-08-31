/* DocenteDigital – uso real y supuestos ocultos v35
   Neutraliza residuos territoriales del constructor legado y bloquea afirmaciones
   no sustentadas antes de que lleguen a una planificación final.
*/
(function(){
  if(window.__ddUsageRealityV35)return;window.__ddUsageRealityV35=true;
  if(typeof state!=='object')return;

  const tidy=s=>String(s||'').replace(/\s+/g,' ').trim();
  function ctx(){return state.teacherContext||{};}
  function briefText(unitOrBrief){
    if(typeof unitOrBrief==='string')return tidy(unitOrBrief);
    return tidy(unitOrBrief?.situationBrief||unitOrBrief?.planningMeaning?.raw||'');
  }
  function communityIsReal(unitOrBrief){
    const c=ctx(),type=tidy(c.locationType).toLowerCase(),brief=briefText(unitOrBrief);
    return /comunidad campesina|comunidad nativa/.test(type)||/\bcomunidad\b/i.test(brief);
  }
  function placeName(){return tidy(ctx().locationName||ctx().community||ctx().district||'');}
  function neutralize(text,unitOrBrief){
    let s=String(text||'');
    if(!s||communityIsReal(unitOrBrief))return s;
    const name=placeName(),poss=name||'nuestro entorno',def=name||'el entorno';
    s=s.replace(/\bnuestra comunidad\b/gi,poss)
       .replace(/\bnuestro comunidad\b/gi,poss)
       .replace(/\bla comunidad\b/gi,def)
       .replace(/\bde la comunidad\b/gi,name?`de ${name}`:'del entorno')
       .replace(/\bcon la comunidad\b/gi,name?`con actores de ${name}`:'con actores del entorno')
       .replace(/\bcomunal(es)?\b/gi,(m,p)=>p?'locales':'local');
    return s;
  }

  /* Migra únicamente el valor histórico que app.js imponía a perfiles nuevos.
     No borra una selección EIB confirmada por el docente. */
  if(state.quechuaVar==='Quechua Collao'&&state.linguisticMode!=='EIB'){
    state.quechuaVar='';
    if(state.language!=='Castellano'&&!state.linguisticMode)state.language='Castellano';
    if(typeof save==='function'){try{save();}catch(e){}}
  }

  function unsupportedLegacyClaim(input,output){
    const i=tidy(input).toLowerCase(),o=tidy(output).toLowerCase();
    if(!i)return true;
    if(/\bcomunidad\b/.test(o)&&!communityIsReal(input))return true;
    if(/familias participan|participación familiar|organización familiar/.test(o)&&!/famil|madre|padre|abuel|particip/.test(i))return true;
    if(/\byachaq\b/.test(o)&&!/yachaq|sabio|sabia|experto local/.test(i))return true;
    if(/pachamama|madre tierra/.test(o)&&!/pachamama|madre tierra/.test(i))return true;
    if(/se desperdicia|desperdicio de agua/.test(o)&&!/desperd|mal uso|derroche/.test(i))return true;
    if(/se contamina|contaminación/.test(o)&&!/contamin/.test(i))return true;
    if(/no siempre se separan|no se separan/.test(o)&&!/no .*separ|sin separar|mezclan residuos|mala disposición/.test(i))return true;
    if(/problemas ambientales/.test(o)&&!/problema|contamin|deterior|afecta|riesgo/.test(i))return true;
    if(/no siempre reconocen|desconocen|requieren analizar/.test(o)&&!/no reconoc|desconoc|dificult|necesit|requieren/.test(i))return true;
    return false;
  }

  function preliminarySituation(brief){
    const text=tidy(brief);
    const grades=tidy((state.grades||[]).join(', '))||'los grados o edades seleccionados';
    const place=placeName();
    const where=place?` en ${place}`:'';
    if(!text)return `Interpretación preliminar: falta una descripción concreta de la situación. Antes de generar la planificación, el docente debe registrar hechos, intereses, necesidades, oportunidades o condiciones que realmente correspondan a sus estudiantes y contexto.`;
    return `Interpretación preliminar a partir de lo escrito por el docente: “${text}”. Con la información disponible, los estudiantes de ${grades} podrán explorar esta situación${where}, recuperar lo que ya saben e identificar qué necesitan indagar para comprenderla mejor. Reto preliminar: ¿cómo podemos comprender mejor esta situación a partir de la información disponible, qué necesitamos investigar o contrastar y cómo comunicaremos lo aprendido mediante evidencias? Antes de usarla como versión final, se deben confirmar los problemas, causas, actores, consecuencias, saberes locales u oportunidades que no hayan sido expresados explícitamente por el docente.`;
  }

  /* Protege el generador base: si la plantilla antigua añade hechos no expresados,
     se sustituye por una interpretación preliminar explícita en vez de inventarlos. */
  const oldExpandSituation=window.expandSituation;
  if(typeof oldExpandSituation==='function')window.expandSituation=function(brief){
    const out=oldExpandSituation.apply(this,arguments);
    if(unsupportedLegacyClaim(brief,out))return preliminarySituation(brief);
    return neutralize(out,brief);
  };

  const oldProposeUnitTitle=window.proposeUnitTitle;
  if(typeof oldProposeUnitTitle==='function')window.proposeUnitTitle=function(brief,type){
    return neutralize(oldProposeUnitTitle.apply(this,arguments),brief);
  };

  function sanitizeUnit(unit){
    if(!unit||unit.selectionApproved!==true||communityIsReal(unit))return unit;
    unit.title=neutralize(unit.title,unit);
    unit.purpose=neutralize(unit.purpose,unit);
    if(unit.situation&&unsupportedLegacyClaim(briefText(unit),unit.situation))unit.situation=preliminarySituation(briefText(unit));
    else if(unit.situation)unit.situation=neutralize(unit.situation,unit);
    if(Array.isArray(unit.activities))unit.activities.forEach(a=>{if(a&&a.title)a.title=neutralize(a.title,unit);});
    return unit;
  }
  function sanitizeAll(){
    let changed=false;
    (state.units||[]).forEach(u=>{
      if(!u||u.selectionApproved!==true||communityIsReal(u))return;
      const before=JSON.stringify([u.title,u.purpose,u.situation,(u.activities||[]).map(a=>a.title)]);
      sanitizeUnit(u);
      if(before!==JSON.stringify([u.title,u.purpose,u.situation,(u.activities||[]).map(a=>a.title)]))changed=true;
    });
    if(changed&&typeof save==='function'){try{save();}catch(e){}}
    return changed;
  }

  const oldRenderUnitOutput=window.renderUnitOutput;
  if(typeof oldRenderUnitOutput==='function')window.renderUnitOutput=function(unit){sanitizeUnit(unit);return oldRenderUnitOutput.apply(this,arguments);};
  const oldRenderUnits=window.renderUnits;
  if(typeof oldRenderUnits==='function')window.renderUnits=function(){sanitizeAll();return oldRenderUnits.apply(this,arguments);};
  const oldViewUnit=window.viewUnit;
  if(typeof oldViewUnit==='function')window.viewUnit=function(id){const u=(state.units||[]).find(x=>x.id===id);sanitizeUnit(u);return oldViewUnit.apply(this,arguments);};

  sanitizeAll();
  window.ddAuditUsageReality=function(){
    const affected=(state.units||[]).filter(u=>u?.selectionApproved===true&&!communityIsReal(u)&&/\b(nuestra comunidad|la comunidad|comunal)\b/i.test([u.title,u.purpose,u.situation,...(u.activities||[]).map(a=>a.title)].join(' ')));
    return {ok:affected.length===0,affected:affected.map(u=>({id:u.id,title:u.title}))};
  };
})();