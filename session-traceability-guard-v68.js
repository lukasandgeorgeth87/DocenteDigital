/* DocenteDigital – guardia de trazabilidad Unidad/Proyecto → Sesión v68
   Bloquea la generación de sesiones desconectadas de una unidad/proyecto real guardado.
*/
(function(){
  if(window.__ddSessionTraceabilityGuardV68)return;window.__ddSessionTraceabilityGuardV68=true;
  if(typeof state!=='object')return;

  function selection(){
    const unitId=document.getElementById('sessionUnit')?.value||'';
    const unit=Array.isArray(state.units)?state.units.find(u=>u&&u.id===unitId):null;
    const index=parseInt(document.getElementById('activity')?.value||'0',10);
    const activity=unit&&Array.isArray(unit.activities)?unit.activities[index]||unit.activities[0]:null;
    return{unit,activity};
  }

  function showEmpty(){
    if(Array.isArray(state.units)&&state.units.length)return;
    const unitSelect=document.getElementById('sessionUnit');
    const activitySelect=document.getElementById('activity');
    if(unitSelect)unitSelect.innerHTML='<option value="" selected disabled>Primero crea una unidad o proyecto</option>';
    if(activitySelect)activitySelect.innerHTML='<option value="" selected disabled>Sin actividad programada</option>';
    const title=document.getElementById('sessionTitle');if(title)title.value='';
    const out=document.getElementById('sessionOutput');if(out)out.classList.add('hidden');
  }

  const fill=window.fillSessionUnits;
  if(typeof fill==='function')window.fillSessionUnits=function(){
    const r=fill.apply(this,arguments);showEmpty();return r;
  };

  const load=window.loadUnitForSession;
  if(typeof load==='function')window.loadUnitForSession=function(){
    if(!Array.isArray(state.units)||!state.units.length){showEmpty();return;}
    return load.apply(this,arguments);
  };

  const generate=window.generateSession;
  if(typeof generate==='function')window.generateSession=function(){
    const {unit,activity}=selection();
    if(!unit||!activity){
      alert('Primero crea o selecciona una unidad/proyecto con una actividad programada. La sesión debe quedar vinculada a esa planificación.');
      return;
    }
    return generate.apply(this,arguments);
  };

  window.ddAuditSessionTraceability=function(){
    const {unit,activity}=selection();
    return{hasSavedUnits:Array.isArray(state.units)&&state.units.length>0,selectedUnitId:unit?.id||null,selectedActivity:activity?.title||null,canGenerate:Boolean(unit&&activity),passes:Boolean(unit&&activity)};
  };

  showEmpty();
})();
