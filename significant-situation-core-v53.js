/* DocenteDigital – Núcleo de situación significativa v53.1
   Regla pedagógica transversal:
   contexto real → situación/interés/necesidad/oportunidad → reto auténtico
   → movilización de competencias → producto/evidencia de aprendizaje.

   Estructura recomendada de salida:
   1. Párrafo de contexto + situación significativa: narra hechos observados y, SOLO si
      están expresadas o verificadas, sus consecuencias. No todo contexto es un problema.
   2. Formulación del reto: pregunta o desafío directo, comprensible y relacionado con
      la situación; moviliza competencias sin adelantar la respuesta.
   3. Definición del producto/evidencia: especifica qué elaborarán, propondrán, harán o
      comunicarán los estudiantes para demostrar el aprendizaje y responder al reto.

   Principios:
   1. No convertir automáticamente todo contexto en un problema.
   2. No inventar causas, consecuencias, actores, conflictos o finalidades no expresadas.
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

  function structure(raw){
    const kind=classify(raw);
    return{
      kind,
      step1:{
        label:kind==='problema'?'Contexto y problema':'Contexto y situación significativa',
        instruction:kind==='problema'
          ?'Narrar los hechos observados y las consecuencias que estén expresadas o verificadas, sin inventar causas ni efectos.'
          :'Narrar los hechos observados, el interés, necesidad, práctica u oportunidad que hace significativa la experiencia para los estudiantes, sin forzar una problemática.'
      },
      step2:{label:'Formulación del reto',instruction:'Plantear una pregunta o desafío directo, comprensible, abierto y relacionado con la situación, capaz de movilizar competencias sin contener la respuesta.'},
      step3:{label:'Definición del producto/evidencia',instruction:'Nombrar una evidencia concreta —objeto, texto, explicación, propuesta, actuación, registro, investigación u otra producción pertinente— que permita demostrar los aprendizajes y responder al reto.'}
    };
  }

  function audit(input){
    const x=input||{},context=tidy(x.context||x.brief||x.situation||''),situation=tidy(x.significantSituation||x.situationText||''),challenge=tidy(x.challenge||x.reto||''),product=tidy(x.product||x.productTitle||'');
    const kind=classify(context),recommended=structure(context),issues=[];
    if(!context)issues.push('Falta un contexto real de partida.');
    if(!situation)issues.push('Falta redactar la situación significativa desde el contexto.');
    if(situation&&context&&kind!=='problema'&&/grave problema|problemática|afecta gravemente|contaminación|plaga/i.test(situation)&&!/problema|contamin|plaga|afecta/i.test(context))issues.push('La redacción convirtió en problema algo que el docente no presentó como problema.');
    if(situation&&context&&/como consecuencia|por ello ocasiona|esto provoca|esto genera/i.test(situation)&&!/consecu|provoca|genera|ocasiona|afecta|perjudic/i.test(context))issues.push('La redacción añadió consecuencias que no aparecen en el contexto; deben verificarse o eliminarse.');
    if(!challenge)issues.push('Falta una pregunta retadora coherente con la situación.');
    else{
      if(!/[¿?]/.test(challenge))issues.push('El reto debe formularse como una pregunta auténtica y comprensible.');
      if(/^(¿)?(?:qué es|cuál es|define|menciona)/i.test(challenge))issues.push('El reto es demasiado reproductivo; debe promover comprensión, indagación, decisión, creación o actuación pertinente.');
    }
    if(!product)issues.push('Falta un producto/evidencia concreta.');
    if(product&&/producto final|evidencia final|trabajo final|actividad final/i.test(product))issues.push('El producto es demasiado genérico; debe nombrar una evidencia observable o comunicable.');
    return{kind,context,situation,challenge,product,structure:recommended,issues,ok:issues.length===0,chain:['contexto real','situación significativa','reto auténtico','movilización de competencias','producto/evidencia']};
  }

  // Casos de regresión conocidos: ejemplos de contrato, no plantillas universales.
  function examples(){return{
    hormigas:{
      context:'Aparecieron hormigas en el aula y los estudiantes quieren saber más sobre ellas.',
      kind:'interés o curiosidad',
      situation:'En los últimos días, los estudiantes observaron que varias hormigas aparecieron dentro del aula. Este hecho despertó su curiosidad y comenzaron a preguntarse de dónde vienen, por qué ingresan al aula y cómo viven. Esta situación cercana constituye una oportunidad para investigar a estos pequeños seres vivos a partir de la observación y otras fuentes de información, registrando y comunicando sus descubrimientos.',
      challenge:'¿Qué podemos descubrir sobre las hormigas que aparecieron en nuestra aula y cómo podemos compartir lo aprendido?',
      product:'Observatorio de hormigas y mural científico de nuestros descubrimientos'
    },
    problemaAmbiental:{
      context:'En los alrededores de la IE se observa acumulación frecuente de residuos y los estudiantes identifican malos olores y espacios sucios.',
      kind:'problema',
      situationRule:'Puede describir hechos y consecuencias observadas; no debe atribuir causas no comprobadas.',
      challengeRule:'Debe orientar a comprender la situación y proponer o aplicar una respuesta sustentada.',
      productRule:'Debe ser una evidencia concreta coherente con el reto, no una actividad genérica.'
    }
  };}

  window.ddSignificantSituationCore={
    classify,
    structure,
    audit,
    examples,
    principle:'contexto real → situación significativa → reto → competencias → producto/evidencia',
    recommendedStructure:['Contexto y situación significativa','Formulación del reto','Definición del producto/evidencia']
  };

  // Integra el contrato a Unidad/Proyecto sin mostrar análisis técnico al docente.
  document.addEventListener('click',e=>{
    const b=e.target.closest?.('button');if(!b)return;
    if(!/createUnitDemo/.test(b.getAttribute('onclick')||'')&&b.id!=='ddBuildUnit')return;
    setTimeout(()=>{
      if(typeof state!=='object')return;
      const pending=state.pendingUnitChoice;
      if(pending){
        pending.pedagogicalChain='contexto real → situación significativa → reto auténtico → movilización de competencias → producto/evidencia';
        pending.contextKind=classify(pending.brief||'');
        pending.significantSituationStructure=structure(pending.brief||'');
      }
      const unit=state.activeUnitId?(state.units||[]).find(u=>u.id===state.activeUnitId):null;
      if(unit){
        const raw=unit.situationBrief||unit.brief||unit.situation||'';
        unit.pedagogicalChain='contexto real → situación significativa → reto auténtico → movilización de competencias → producto/evidencia';
        unit.contextKind=classify(raw);
        unit.significantSituationStructure=structure(raw);
      }
      if(typeof save==='function')save();
    },220);
  },true);
})();