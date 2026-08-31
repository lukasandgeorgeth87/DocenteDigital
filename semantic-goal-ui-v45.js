/* DocenteDigital – sincronización visible de finalidad v45 */
(function(){
  if(window.__ddSemanticGoalUIV45)return;window.__ddSemanticGoalUIV45=true;
  const E=v=>typeof escapeHtml==='function'?escapeHtml(String(v??'')):String(v??'');
  function current(){const raw=document.getElementById('unitSituation')?.value||'',type=document.getElementById('unitType')?.value||'Unidad de aprendizaje';let goal=null;try{goal=window.ddExtractPlanningGoal?.(raw)||null;}catch(e){}return{raw,type,goal};}
  function repaint(){
    const {raw,type,goal}=current();if(!goal||!raw.trim())return;
    let titles=[];try{titles=window.ddCreativeTitleOptions?.(raw,type)||[];}catch(e){}
    if(!titles.length)return;
    const top=document.getElementById('ddTitleSuggestions');
    if(top){top.innerHTML='<small><b>🎯 Títulos alineados con la finalidad que escribiste:</b></small>'+titles.slice(0,3).map((t,i)=>`<button type="button" data-dd-goal-title="${i}">${i+1}. ${E(t)}</button>`).join('');top.querySelectorAll('[data-dd-goal-title]').forEach((b,i)=>b.onclick=()=>{const x=document.getElementById('unitTitle');if(x)x.value=titles[i];});}
    const live=document.querySelector('#ddIntentBox .dd-title-suggestions');
    if(live){live.innerHTML=titles.slice(0,3).map(t=>`<button type="button" data-dd-title="${E(t)}">${E(t)}</button>`).join('');}
  }
  let timer=0;const schedule=()=>{clearTimeout(timer);timer=setTimeout(repaint,430);};
  document.addEventListener('input',e=>{if(e.target?.id==='unitSituation')schedule();},true);
  document.addEventListener('change',e=>{if(e.target?.id==='unitType')schedule();},true);
  document.addEventListener('click',e=>{
    const b=e.target.closest?.('button');if(!b)return;
    const {raw,goal}=current();if(!goal)return;
    if(b.id==='ddBuildUnit'){
      const p=state.pendingUnitChoice;if(p&&window.ddGoalAlignment?.challengeFor){p.reto=window.ddGoalAlignment.challengeFor(raw,goal);p.explicitFinalGoal=goal.phrase;if(typeof save==='function')save();}
      setTimeout(()=>{const u=state.activeUnitId?(state.units||[]).find(x=>x.id===state.activeUnitId):(state.units||[])[0];if(u){u.reto=window.ddGoalAlignment?.challengeFor?window.ddGoalAlignment.challengeFor(raw,goal):u.reto;u.explicitFinalGoal=goal.phrase;if(typeof save==='function')save();try{renderUnitOutput(u);}catch(e){}}},190);
    }
  },true);
  setTimeout(repaint,120);
})();