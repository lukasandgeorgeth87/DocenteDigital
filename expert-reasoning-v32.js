/* DocenteDigital – razonamiento experto v32
   Regla: partir de lo que el docente realmente expresa; distinguir interés, problema,
   necesidad u oportunidad; no inventar hechos; adaptar título, situación, reto y producto
   al nivel. Primera especialización segura: Inicial + interés auténtico. */
(function(){
  if(window.__ddExpertReasoningV32)return; window.__ddExpertReasoningV32=true;

  const tidy=s=>String(s||'').replace(/\s+/g,' ').trim();
  const norm=s=>tidy(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const esc=s=>typeof window.escapeHtml==='function'?window.escapeHtml(s):String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function isInitial(){
    const candidates=[state?.level,state?.educationLevel,document.getElementById('level')?.value,document.getElementById('educationLevel')?.value];
    return candidates.some(v=>/inicial/i.test(String(v||'')));
  }

  function interestReading(raw,m){
    const n=norm(raw);
    const explicit=/(quieren|quiere|desean|desea|les interesa|interesados|interes|curiosidad|quieren saber|quieren conocer|preguntan|pregunta|quieren descubrir)/.test(n);
    const problem=tidy(m?.problem), cause=tidy(m?.cause), consequence=tidy(m?.consequence), goal=tidy(m?.goal);
    return explicit && !problem && !cause && !consequence && !goal;
  }

  function extractInterest(raw){
    let x=tidy(raw)
      .replace(/^(los|las)?\s*(niños|niñas|estudiantes|alumnos|alumnas)(\s+y\s+(niños|niñas|estudiantes))?\s*/i,'')
      .replace(/^(quieren|desean|les interesa|tienen curiosidad por|muestran interés por|muestran interes por)\s*/i,'')
      .replace(/^(saber|conocer|aprender|descubrir|investigar)\s+(sobre|acerca de)?\s*/i,'')
      .replace(/[.?!]+$/,'');
    x=tidy(x);
    return x||'este tema que despierta su curiosidad';
  }

  function prettyTopic(topic){
    let t=tidy(topic).replace(/^(sobre|acerca de)\s+/i,'');
    return t.charAt(0).toLowerCase()+t.slice(1);
  }

  function initialInterestPack(raw,m){
    const topic=prettyTopic(extractInterest(raw));
    const title=`Descubrimos ${topic}`;
    const situation=`Los niños y niñas han mostrado interés por conocer más sobre ${topic}. Este interés constituye una oportunidad para observar, preguntar, expresar lo que piensan y buscar respuestas mediante experiencias apropiadas para su edad. A partir de sus descubrimientos podrán comunicar lo aprendido utilizando distintas formas de expresión.`;
    const reto=`¿Cómo podemos descubrir más sobre ${topic} para contar a otros lo que aprendimos?`;
    const products=[
      {key:'1',title:`Rincón de descubrimientos sobre ${topic}`.slice(0,90),text:`Espacio construido progresivamente con dibujos, representaciones, preguntas, hallazgos y producciones orales de los niños sobre ${topic}.`},
      {key:'2',title:`Álbum de nuestros hallazgos sobre ${topic}`.slice(0,90),text:`Álbum colectivo con dibujos, registros y explicaciones dictadas o expresadas por los niños a partir de lo que observaron y descubrieron sobre ${topic}.`},
      {key:'3',title:`Muestra: lo que descubrimos sobre ${topic}`.slice(0,90),text:`Pequeña muestra para comunicar a otros, mediante dibujos, modelados, movimientos, palabras y otros lenguajes, lo que los niños descubrieron sobre ${topic}.`}
    ];
    return {kind:'interest',topic,title,situation,reto,products,confidence:90,interpretation:'Interés auténtico expresado por el docente; no se añade un problema no mencionado.'};
  }

  function analyze(raw,m){
    if(isInitial() && interestReading(raw,m))return initialInterestPack(raw,m);
    return null;
  }

  window.ddExpertPlanningReasoning=function(raw,meaning){
    const m=meaning||((typeof window.ddUnderstandPlanningDescription==='function')?window.ddUnderstandPlanningDescription(raw):{});
    return analyze(raw,m);
  };

  /* Integra el razonamiento sin sustituir el analizador general. proposal-choice consulta este
     resultado y solo lo usa cuando hay una regla segura y verificable. */
  window.ddApplyExpertReasoningToProposal=function(raw,base){
    const expert=window.ddExpertPlanningReasoning(raw,base?.meaning);
    if(!expert)return base;
    const situationA={key:'A',title:'Opción A · Parte del interés de los niños',text:`${expert.situation} Reto: ${expert.reto}`};
    const situationB={key:'B',title:'Opción B · Exploramos y comunicamos',text:`${expert.situation} La experiencia conservará las preguntas reales de los niños como punto de partida y evitará convertir su curiosidad en un problema que no ha sido expresado. Reto: ${expert.reto}`};
    return {...base,focus:expert.topic,reto:expert.reto,situations:[situationA,situationB],products:expert.products,expertReasoning:expert};
  };

  /* Muestra una señal breve para que el docente sepa cómo fue interpretado su texto. */
  document.addEventListener('click',()=>{
    const p=state?.pendingUnitChoice;
    if(!p?.expertReasoning)return;
    const host=document.getElementById('ddProposalChooser');
    if(!host||host.querySelector('.dd-expert-reading'))return;
    const intro=host.querySelector('.dd-choice-intro');
    if(!intro)return;
    const note=document.createElement('div'); note.className='notice dd-expert-reading';
    note.innerHTML=`🧠 <b>Lectura experta:</b> ${esc(p.expertReasoning.interpretation)}`;
    intro.appendChild(note);
  },true);
})();