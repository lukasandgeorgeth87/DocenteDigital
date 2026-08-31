/* DocenteDigital – Núcleo de situación significativa v53
   Regla pedagógica transversal:
   contexto real → situación/interés/necesidad/oportunidad → reto auténtico
   → movilización de competencias → producto/evidencia de aprendizaje.

   Principios:
   1. No convertir automáticamente todo contexto en un problema.
   2. No inventar causas, actores, conflictos o finalidades no expresadas.
   3. El reto nace de la situación y moviliza aprendizajes; no anticipa la respuesta.
   4. El producto es una evidencia concreta y coherente con el reto.
   5. La situación significativa no es relleno narrativo: gobierna la planificación posterior.
*/
(function(){
  if(window.__ddSignificantSituationCoreV53)return;window.__ddSignificantSituationCoreV53=true;
  const tidy=v=>String(v??'').replace(/\s+/g,' ').trim();
  const norm=v=>tidy(v).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');

  function classify(raw){
    const s=norm(raw);
    if(/curios|interes|quieren saber|pregunt|observar|aparec|encontr/.test(s))return'interés o curiosidad';
    if(/necesit|hace falta|requiere|dificult/.test(s))return'necesidad';
    if(/problema|contamin|riesgo|conflict|afecta|perjudic/.test(s))return'problema';
    if(/costumbre|tradicion|siembra|cosecha|festiv|practica|saberes|biohuerto|feria/.test(s))return'práctica u oportunidad del contexto';
    return'situación del contexto';
  }

  function audit(input){
    const x=input||{},context=tidy(x.context||x.brief||x.situation||''),situation=tidy(x.significantSituation||x.situationText||''),challenge=tidy(x.challenge||x.reto||''),product=tidy(x.product||x.productTitle||'');
    const kind=classify(context);
    const issues=[];
    if(!context)issues.push('Falta un contexto real de partida.');
    if(!situation)issues.push('Falta redactar la situación significativa desde el contexto.');
    if(situation&&context&&kind!=='problema'&&/grave problema|problemática|afecta gravemente|contaminación|plaga/i.test(situation)&&!/problema|contamin|plaga|afecta/i.test(context))issues.push('La redacción convirtió en problema algo que el docente no presentó como problema.');
    if(!challenge)issues.push('Falta una pregunta retadora coherente con la situación.');
    else if(!/[¿?]/.test(challenge))issues.push('El reto debe formularse como una pregunta auténtica y comprensible.');
    if(!product)issues.push('Falta un producto/evidencia concreta.');
    if(product&&/producto final|evidencia final|trabajo final|actividad final/i.test(product))issues.push('El producto es demasiado genérico; debe nombrar una evidencia observable o comunicable.');
    return{kind,context,situation,challenge,product,issues,ok:issues.length===0,chain:['contexto real','situación significativa','reto auténtico','movilización de competencias','producto/evidencia']};
  }

  // Casos de regresión conocidos: se mantienen como ejemplos de contrato, no como plantillas universales.
  function examples(){return{
    hormigas:{
      context:'Aparecieron hormigas en el aula y los estudiantes quieren saber más sobre ellas.',
      kind:'interés o curiosidad',
      situation:'En los últimos días, los estudiantes observaron que varias hormigas aparecieron dentro del aula. Este hecho despertó su curiosidad y comenzaron a preguntarse de dónde vienen, por qué ingresan al aula y cómo viven. Esta situación cercana constituye una oportunidad para investigar a estos pequeños seres vivos a partir de la observación y otras fuentes de información, registrando y comunicando sus descubrimientos.',
      challenge:'¿Qué podemos descubrir sobre las hormigas que aparecieron en nuestra aula y cómo podemos compartir lo aprendido?',
      product:'Observatorio de hormigas y mural científico de nuestros descubrimientos'
    }
  };}

  // Expone el contrato para que Núcleo IA, Unidad/Proyecto, sesiones y exportación utilicen la misma lógica.
  window.ddSignificantSituationCore={classify,audit,examples,principle:'contexto real → situación significativa → reto → competencias → producto/evidencia'};

  // Integra el contrato a la elección de Unidad/Proyecto sin mostrar análisis técnico al docente.
  document.addEventListener('click',e=>{
    const b=e.target.closest?.('button');if(!b)return;
    if(!/createUnitDemo/.test(b.getAttribute('onclick')||'')&&b.id!=='ddBuildUnit')return;
    setTimeout(()=>{
      if(typeof state!=='object')return;
      const pending=state.pendingUnitChoice;
      if(pending){
        pending.pedagogicalChain='contexto real → situación significativa → reto auténtico → movilización de competencias → producto/evidencia';
        pending.contextKind=classify(pending.brief||'');
      }
      const unit=state.activeUnitId?(state.units||[]).find(u=>u.id===state.activeUnitId):null;
      if(unit){
        unit.pedagogicalChain='contexto real → situación significativa → reto auténtico → movilización de competencias → producto/evidencia';
        unit.contextKind=classify(unit.situationBrief||unit.brief||unit.situation||'');
      }
      if(typeof save==='function')save();
    },220);
  },true);
})();