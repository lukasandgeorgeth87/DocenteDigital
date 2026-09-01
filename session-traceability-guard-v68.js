/* DocenteDigital – guardia de trazabilidad Unidad/Proyecto → Sesión v68
   Impide presentar una sesión como válida cuando no nace de una unidad/proyecto real guardado.
*/
(function(){
  if(window.__ddSessionTraceabilityGuardV68)return;window.__ddSessionTraceabilityGuardV68=true;
  if(typeof state!=='object')return;

  function realSelection(){
    const unitId=document.getElementById('sessionUnit')?.value||'';
    const unit=Array.isArray(state.units)?state.units.find(u=>u&&u.id===unitId):null;
    const index=parseInt(document.getElementById('activity')?.value||'0',10);
    const activity=unit&&Array.isArray(unit.activities)?unit.activities[index]||unit.activities[0]:null;
    return{unit,activity};
  }

  function paintEmptyState(){
    if(Array.isArray(state.units)&&state.units.length)return;
    const unitSelect=document.getElementById('sessionUnit');
    const activitySelect=document.getElementById('activity');
    if(unitSelect)unitSelect.innerHTML='<option value="" selected disabled>Primero crea una unidad o proyecto</option>';
    if(activitySelect)activitySelect.innerHTML='<option value="" selected disabled>Sin actividad programada</option>';
    const title=document.getElementById('sessionTitle');if(title)title.value='';
    const out=document.getElementById('sessionOutput');if(out)out.classList.add('hidden');
  }

  const baseFill=window.fillSessionUnits;
  if(typeof baseFill==='function')window.fillSessionUnits=function(){
    const result=baseFill.apply(this,arguments);
    paintEmptyState();
    return result;
  };

  const baseLoad=window.loadUnitForSession;
  if(typeof baseLoad==='function')window.loadUnitForSession=function(){
    if(!Array.isArray(state.units)||!state.units.length){paintEmptyState();return;}
    return baseLoad.apply(this,arguments);
  };

  const baseGenerate=window.generateSession;
  if(typeof baseGenerate==='function')window.generateSession=function(){
    const {unit,activity}=realSelection();
    if(!unit||!activity){
      alert('Primero crea o selecciona una unidad/proyecto con una actividad programada. La sesión debe quedar vinculada a esa planificación.');
      if(typeof window.go==='function')window.go('plan');
      if(typeof window.showUnit==='function')setTimeout(()=>window.showUnit(),0);
      return;
    }
    return baseGenerate.apply(this,arguments);
  };

  window.ddAuditSessionTraceability=function(){
    const {unit,activity}=realSelection();
    return{hasSavedUnits:Array.isArray(state.units)&&state.units.length>0,selectedUnitId:unit?.id||null,selectedActivity:activity?.title||null,canGenerate:Boolean(unit&&activity),passes:Boolean(unit&&activity)};
  };

  paintEmptyState();
})();