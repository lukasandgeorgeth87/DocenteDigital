/* DocenteDigital — Materiales v1
   Motor funcional para lecturas, fichas, tarjetas, problemas y organizadores.
   Reutiliza datos de la planificación antes de volver a pedirlos.
*/
(function(){
  if(window.__ddMaterialsV1)return;
  window.__ddMaterialsV1=true;

  const $=id=>document.getElementById(id);
  const E=v=>escapeHtml(v);
  const N=v=>String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const clone=o=>JSON.parse(JSON.stringify(o));

  if(!Array.isArray(state.materials))state.materials=[];
  save();

  function activeUnit(){
    return (state.units||[]).find(u=>u.id===state.activeUnitId)||(state.units||[])[0]||null;
  }

  function profile(){
    return Object.assign({
      teacherName:state.teacherName||'',
      institutionName:state.schoolName||'',
      localityType:'Localidad',
      community:'',
      district:'',
      province:'',
      region:''
    },state.teacherContext||{});
  }

  function placeText(){
    const p=profile();
    return [
      p.institutionName||'',
      p.community?((p.localityType||'Localidad')+' '+p.community):'',
      p.district?('Distrito '+p.district):'',
      p.province?('Provincia '+p.province):'',
      p.region?('Región '+p.region):''
    ].filter(Boolean).join(' · ');
  }

  function gradeNumber(grade){
    return parseInt(String(grade||'').match(/\d+/)?.[0]||'1');
  }

  function sourceContext(){
    const source=$('materialSource')?.value||'session';
    const session=state.lastSession;
    const unit=activeUnit();
    if(source==='session'&&session){
      return {
        source:'session',
        title:session.title||'',
        topic:session.title||'',
        brief:session.brief||unit?.situation||unit?.situationBrief||'',
        area:session.area||'',
        grades:session.grades||state.grades||[],
        purpose:session.purpose||'',
        evidence:session.evidence||''
      };
    }
    if(source==='unit'&&unit){
      return {
        source:'unit',
        title:unit.title||'',
        topic:unit.title||'',
        brief:unit.situation||unit.situationBrief||'',
        area:(unit.areas||[])[0]||'',
        grades:unit.grades||state.grades||[],
        purpose:unit.reto||'',
        evidence:unit.product||''
      };
    }
    return {source:'free',title:'',topic:'',brief:'',area:'',grades:state.grades||[],purpose:'',evidence:''};
  }

  function topicInfo(topic){
    const t=N(topic);
    if(/mamifer|animal|fauna|pelo|pluma|escama/.test(t))return {
      key:'animals',icon:'🐾',
      words:['animal','mamífero','hábitat','alimento','cría','pelo','huella','movimiento'],
      facts:[
        'Los mamíferos son animales vertebrados y la mayoría tiene pelo en alguna etapa de su vida.',
        'Las crías de los mamíferos se alimentan de leche producida por sus madres durante una etapa de su desarrollo.',
        'Los mamíferos viven en ambientes diversos y presentan características relacionadas con su forma de desplazarse y alimentarse.',
        'Comparar animales requiere observar más de una característica y explicar con qué criterio se los agrupa.'
      ]
    };
    if(/semill|germin|siembr|biohuerto|planta/.test(t))return {
      key:'seeds',icon:'🌱',
      words:['semilla','raíz','tallo','agua','suelo','luz','germinación','cuidado'],
      facts:[
        'Una semilla contiene una estructura viva capaz de iniciar una nueva planta cuando encuentra condiciones adecuadas.',
        'Durante la germinación suele aparecer primero la raíz y luego comienza a desarrollarse el tallo.',
        'El agua, el aire y una temperatura adecuada son condiciones importantes para la germinación de muchas semillas.',
        'Registrar cambios durante varios días permite comparar evidencias y explicar mejor lo observado.'
      ]
    };
    if(/agua|yaku/.test(t))return {
      key:'water',icon:'💧',
      words:['agua','río','lluvia','riego','consumo','cuidado','suelo','planta'],
      facts:[
        'El agua es indispensable para las personas, los animales y las plantas.',
        'En la vida diaria se utiliza para beber, preparar alimentos, limpiar, cultivar y realizar otras actividades.',
        'Observar cuánto y cómo usamos el agua ayuda a reconocer oportunidades para evitar desperdicios.',
        'Cuidar las fuentes de agua contribuye al bienestar de la comunidad.'
      ]
    };
    if(/residuo|basura|recicl|contamin/.test(t))return {
      key:'waste',icon:'♻️',
      words:['residuo','papel','plástico','orgánico','reutilizar','reciclar','separar','ambiente'],
      facts:[
        'Los residuos pueden clasificarse según el material del que están hechos y la forma en que pueden aprovecharse o disponerse.',
        'Separar residuos limpios facilita la reutilización y el reciclaje de algunos materiales.',
        'Reducir lo que desechamos suele ser más efectivo que intentar recuperarlo todo después.',
        'Observar los residuos que se producen en un lugar permite proponer acciones concretas de mejora.'
      ]
    };
    if(/igualdad|ecuacion|balanza|equival/.test(t))return {
      key:'equations',icon:'⚖️',
      words:['igualdad','equivalencia','balanza','incógnita','operación','verificar','miembro','resultado'],
      facts:[
        'Una igualdad expresa que dos cantidades o expresiones tienen el mismo valor.',
        'Una balanza equilibrada puede representar la idea de conservar una igualdad.',
        'Las operaciones inversas ayudan a encontrar un valor desconocido.',
        'Comprobar el resultado permite verificar si la igualdad se cumple.'
      ]
    };
    return {
      key:'generic',icon:'🔎',
      words:[topic||'tema','observación','pregunta','evidencia','comparación','explicación','conclusión','aplicación'],
      facts:[
        `Comprender “${topic}” requiere partir de preguntas claras y experiencias o fuentes pertinentes.`,
        'Observar, comparar y registrar información ayuda a diferenciar una opinión de una explicación sustentada.',
        'Explicar con nuestras propias palabras permite organizar lo aprendido y detectar dudas.',
        'Aplicar lo aprendido en una situación nueva permite comprobar si realmente comprendimos.'
      ]
    };
  }

  function readingTitle(topic,level,grade,info){
    const n=gradeNumber(grade);
    if(info.key==='animals'){
      if(level==='Inicial')return 'Pelos, patas y muchas sorpresas';
      if(n<=2)return 'Animales que podemos observar';
      if(n<=4)return '¿Cómo podemos comparar a los mamíferos?';
      return 'Mamíferos: características, diversidad y adaptación';
    }
    if(info.key==='seeds'){
      if(level==='Inicial')return 'Una semilla empieza a cambiar';
      if(n<=2)return 'De semilla a plantita';
      return '¿Qué ocurre cuando una semilla germina?';
    }
    return topic;
  }

  function readingMaterial(topic,level,grade,area){
    const info=topicInfo(topic),n=gradeNumber(grade),title=readingTitle(topic,level,grade,info);
    let paragraphs=[],questions=[];
    if(level==='Inicial'){
      if(info.key==='animals')paragraphs=[
        'Algunos animales tienen pelo. Otros tienen plumas o escamas. Podemos mirar sus patas, su cuerpo y la manera en que se mueven.',
        'Un perro corre, una oveja camina y una vizcacha salta. Cada animal tiene características que podemos observar sin hacerle daño.',
        'Cuando miramos con atención encontramos semejanzas y diferencias. También aparecen nuevas preguntas.'
      ];
      else if(info.key==='seeds')paragraphs=[
        'Tenemos una semilla y la colocamos en un lugar donde podamos observarla.',
        'Con los días puede aparecer una pequeña raíz. Después comienza a crecer el tallo.',
        'Miramos cada día y dibujamos los cambios. Así podemos contar qué descubrimos.'
      ];
      else paragraphs=[...info.facts.slice(0,3)];
      questions=['¿Qué observaste?','¿Qué fue diferente o parecido?','¿Qué te gustaría seguir explorando?'];
    }else{
      paragraphs=[...info.facts];
      if(n>=5)paragraphs.push('Para explicar mejor un fenómeno o una clasificación no basta con nombrar lo observado: conviene indicar qué evidencia sostiene la conclusión y qué información adicional sería necesaria.');
      questions=n<=2
        ? ['¿De qué trata el texto?','Menciona una idea importante.','Dibuja algo que aprendiste y explica qué representa.']
        : n<=4
          ? ['¿Cuál es la idea principal?','¿Qué información ayuda a comprenderla?','Compara dos elementos del texto.','¿Qué pregunta podrías investigar después?']
          : ['¿Cuál es la idea central y qué evidencias la sostienen?','¿Qué relación existe entre dos ideas del texto?','¿Qué limitación o duda queda abierta?','Aplica una idea del texto a una situación diferente.'];
    }

    return `<article class="dd-material-sheet">
      <div class="dd-material-kicker">${E(area)} · ${E(grade)}</div>
      <h1>${E(title)}</h1>
      ${paragraphs.map(p=>`<p>${E(p)}</p>`).join('')}
      <div class="dd-material-task">
        <h3>${level==='Inicial'?'Conversamos y representamos':'Comprendemos y pensamos'}</h3>
        <ol>${questions.map(q=>`<li>${E(q)}</li>`).join('')}</ol>
      </div>
    </article>`;
  }

  function worksheetActivities(topic,level,grade,area){
    const info=topicInfo(topic),n=gradeNumber(grade);
    if(level==='Inicial')return [
      `Observa los materiales, imágenes u objetos relacionados con ${topic} y señala lo que llama tu atención.`,
      'Agrupa dos o más elementos usando una característica visible.',
      'Explica con tus palabras por qué los agrupaste así.',
      `Representa mediante dibujo, modelado o movimiento algo que descubriste sobre ${topic}.`,
      'Comparte tu descubrimiento con un compañero.'
    ];
    if(area==='Matemática')return [
      `Representa una situación relacionada con ${topic} usando material, dibujo, esquema, tabla o expresión matemática.`,
      'Identifica los datos necesarios y explica qué se necesita hallar.',
      'Elige una estrategia y resuelve mostrando tu procedimiento.',
      'Comprueba el resultado mediante otra representación o procedimiento.',
      n>=5?'Justifica por qué tu procedimiento conserva la relación o propiedad trabajada.':'Explica cómo sabes que tu respuesta tiene sentido.',
      `Crea una nueva situación sobre ${topic} cambiando un dato o una condición.`
    ];
    if(area==='Comunicación'||/Castellano|Inglés/.test(area))return n<=2?[
      `Observa el título y una imagen relacionada con ${topic}. Di de qué crees que tratará el texto.`,
      'Lee o escucha y señala una palabra o idea importante.',
      'Relaciona una idea con un dibujo.',
      'Completa una frase para comunicar lo que comprendiste.',
      'Revisa: ¿se entiende lo que quieres decir?'
    ]:[
      `Antes de leer, formula dos preguntas sobre ${topic}.`,
      'Durante la lectura, identifica información que responda tus preguntas.',
      'Distingue una idea principal y dos ideas que la desarrollan.',
      'Comunica una conclusión para un destinatario concreto.',
      'Revisa organización, claridad y evidencia.',
      n>=5?'Reescribe un fragmento para hacerlo más preciso y explica qué mejoraste.':'Mejora una oración o párrafo después de recibir una sugerencia.'
    ];
    return n<=2?[
      `Observa información o materiales sobre ${topic} y representa dos cosas que reconoces.`,
      'Marca o explica una semejanza y una diferencia.',
      'Completa una explicación breve.',
      'Relaciona lo aprendido con una situación de tu entorno.',
      'Formula una nueva pregunta.'
    ]:[
      `Registra tres datos o ideas relevantes sobre ${topic}.`,
      'Organiza la información en un cuadro, esquema o clasificación.',
      'Compara dos ejemplos y explica el criterio que usaste.',
      'Sustenta una conclusión usando al menos una evidencia.',
      'Aplica lo aprendido en una situación nueva.',
      n>=5?'Indica qué información adicional necesitarías para fortalecer tu explicación.':'Formula una pregunta para seguir investigando.'
    ];
  }

  function worksheetMaterial(topic,level,grade,area){
    const acts=worksheetActivities(topic,level,grade,area);
    return `<article class="dd-material-sheet">
      <div class="dd-material-kicker">Ficha de trabajo · ${E(area)} · ${E(grade)}</div>
      <h1>${E(topic)}</h1>
      <p><b>Propósito:</b> desarrollar una evidencia observable mediante acciones de comprensión, aplicación y explicación.</p>
      <ol class="dd-big-list">${acts.map((a,i)=>`<li><b>${i+1}.</b> ${E(a)}<div class="dd-answer-lines"></div></li>`).join('')}</ol>
      <div class="dd-material-reflect"><b>Al final:</b> ¿qué aprendiste?, ¿qué estrategia te ayudó?, ¿qué mejorarías?</div>
    </article>`;
  }

  function cardsMaterial(topic,grade){
    const info=topicInfo(topic);
    const icons={
      animals:['🐕','🐑','🐄','🐈','🐇','🦙','🐎','🐖'],
      seeds:['🌱','🌿','💧','☀️','🌾','🫘','🥬','🪴'],
      water:['💧','🌧️','🏞️','🚿','🌱','🥤','☁️','🪣'],
      waste:['📄','📦','🥫','🧴','🍂','♻️','🗑️','🌍'],
      equations:['⚖️','➕','➖','✖️','➗','🟰','🔢','✅'],
      generic:['🔎','💡','📝','📚','🧩','⭐','❓','✅']
    }[info.key]||[];
    return `<article class="dd-material-sheet">
      <div class="dd-material-kicker">Tarjetas palabra–imagen · ${E(grade)}</div>
      <h1>${E(topic)}</h1>
      <div class="dd-word-cards">
        ${info.words.slice(0,8).map((w,i)=>`<div class="dd-word-card"><div class="dd-word-icon">${icons[i]||'🔎'}</div><b>${E(w)}</b><span>________________</span></div>`).join('')}
      </div>
    </article>`;
  }

  function problemMaterial(topic,grade){
    const n=gradeNumber(grade),t=N(topic),items=[];
    if(/igualdad|ecuacion|balanza|equival/.test(t)){
      const nums=n<=2?[[7,3],[9,4],[8,5],[10,6],[12,7],[11,8],[14,9],[13,6],[15,10],[16,9]]:
        n<=4?[[24,9],[38,17],[45,18],[52,26],[63,27],[71,35],[84,42],[96,38],[105,47],[120,65]]:
        [[47,18],[65,27],[82,36],[96,41],[125,58],[144,69],[175,87],[208,96],[250,135],[320,148]];
      nums.forEach(([a,b],i)=>items.push(`${i+1}. □ + ${b} = ${a}. Halla el valor de □ y comprueba tu respuesta.`));
    }else{
      const ctx=topicInfo(topic);
      for(let i=1;i<=10;i++){
        const a=(n<=2?8:n<=4?24:45)+i*(n<=2?2:n<=4?3:7);
        const b=(n<=2?3:n<=4?8:17)+i;
        items.push(`${i}. En una situación relacionada con ${topic}, se registraron ${a} elementos y luego se utilizaron ${b}. ¿Cuántos quedan? Representa, resuelve y explica cómo comprobaste tu respuesta.`);
      }
    }
    return `<article class="dd-material-sheet"><div class="dd-material-kicker">Banco de problemas · ${E(grade)}</div><h1>${E(topic)}</h1><p><b>Indicaciones:</b> representa, resuelve, comprueba y explica. No basta escribir solo la respuesta.</p><ol class="dd-problem-list">${items.map(x=>`<li>${E(x.replace(/^\d+\.\s*/,''))}<div class="dd-answer-lines tall"></div></li>`).join('')}</ol></article>`;
  }

  function conceptsMaterial(topic,level,grade,area){
    const info=topicInfo(topic);
    return `<article class="dd-material-sheet"><div class="dd-material-kicker">Para pizarra / formalización · ${E(area)} · ${E(grade)}</div><h1>${E(topic)}</h1>
      <div class="dd-concept-grid">${info.facts.map((x,i)=>`<section><b>${i+1}. Idea clave</b><p>${E(x)}</p></section>`).join('')}</div>
      <h3>Vocabulario clave</h3><p>${info.words.map(E).join(' · ')}</p>
      <h3>Pregunta para comprobar comprensión</h3><p>${level==='Inicial'?'¿Qué observaste y cómo lo mostrarías?':'¿Cómo explicarías esta idea con un ejemplo diferente al trabajado?'} </p>
    </article>`;
  }

  function organizerMaterial(topic,level,grade){
    return `<article class="dd-material-sheet"><div class="dd-material-kicker">Organizador de aprendizaje · ${E(grade)}</div><h1>${E(topic)}</h1>
      <div class="dd-organizer">
        <section><h3>Lo que ya sé</h3><div class="dd-answer-lines tall"></div></section>
        <section><h3>Lo que quiero averiguar</h3><div class="dd-answer-lines tall"></div></section>
        <section><h3>Evidencias / información encontrada</h3><div class="dd-answer-lines tall"></div></section>
        <section><h3>Lo que ahora puedo explicar</h3><div class="dd-answer-lines tall"></div></section>
      </div>
      <div class="dd-material-reflect"><b>Transferencia:</b> ${level==='Inicial'?'¿Dónde más podríamos observar algo parecido?':'¿En qué otra situación podrías usar lo aprendido?'}</div>
    </article>`;
  }

  function languageNote(lang,variety){
    if(lang==='Castellano')return '';
    return `<div class="notice"><b>Revisión lingüística requerida:</b> el material fue solicitado en ${E(lang)} ${variety&&variety!=='Ninguna'?'· '+E(variety):''}. Antes de imprimir una versión en lengua originaria, debe ser revisada por un hablante competente o docente EIB de la variedad seleccionada.</div>`;
  }

  function renderByType(type,topic,level,grade,area){
    if(type==='Lectura')return readingMaterial(topic,level,grade,area);
    if(type==='Ficha de trabajo')return worksheetMaterial(topic,level,grade,area);
    if(type==='Tarjetas palabra-imagen')return cardsMaterial(topic,grade);
    if(type==='Banco de problemas')return problemMaterial(topic,grade);
    if(type==='Conceptos para pizarra')return conceptsMaterial(topic,level,grade,area);
    return organizerMaterial(topic,level,grade);
  }

  function create(){
    const ctx=sourceContext();
    const type=$('materialType')?.value||'Lectura';
    const level=state.level||'Primaria';
    const grade=$('materialGrade')?.value||ctx.grades?.[0]||state.grades?.[0]||'1.º';
    const area=$('materialArea')?.value||ctx.area||state.areas?.[0]||'Comunicación';
    const lang=$('materialLanguage')?.value||'Castellano';
    const variety=$('materialQuechua')?.value||state.quechuaVar||'Ninguna';
    const topic=($('materialTopic')?.value||'').trim()||ctx.topic||ctx.title||'Aprendemos desde nuestro contexto';
    const instruction=($('materialInstruction')?.value||'').trim();

    const body=renderByType(type,topic,level,grade,area);
    const p=profile();
    const meta=`<div class="dd-material-meta"><b>${E(p.institutionName||'')}</b>${placeText()?'<span>'+E(placeText())+'</span>':''}<span>${E(level)} · ${E(grade)} · ${E(area)}</span></div>`;
    const extra=instruction?`<div class="dd-material-instruction"><b>Indicación del docente:</b> ${E(instruction)}</div>`:'';
    const html=meta+languageNote(lang,variety)+extra+
      `<div class="dd-editable-material" contenteditable="true" spellcheck="true">${body}</div>`+
      `<div class="actions topgap dd-material-actions">
        <button class="btn" type="button" onclick="window.DDMaterials.saveEdits()">💾 Guardar cambios</button>
        <button class="btn alt" type="button" onclick="window.DDMaterials.downloadWord()">⬇ Word</button>
        <button class="btn alt" type="button" onclick="window.print()">🖨 Imprimir / PDF</button>
        <button class="btn ghost" type="button" onclick="window.DDMaterials.duplicate()">⧉ Crear variante</button>
        <button class="btn ghost" type="button" onclick="go('aihub')">🖼 Imagen / biblioteca</button>
      </div>`;

    const item={
      id:'m'+Date.now(),createdAt:new Date().toISOString(),type,level,grade,area,lang,variety,topic,instruction,
      source:ctx.source,sourceTitle:ctx.title||'',html
    };
    state.materials.unshift(item);
    state.materials=state.materials.slice(0,40);
    state.lastMaterial=item;
    save();
    renderItem(item);
    renderHistory();
  }

  function renderItem(item){
    const out=$('materialOutput');if(!out)return;
    out.innerHTML=item.html;
    out.classList.remove('hidden');
    out.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function saveEdits(){
    const item=state.lastMaterial;
    const editable=document.querySelector('#materialOutput .dd-editable-material');
    if(!item||!editable)return;
    const out=$('materialOutput');
    const meta=out.querySelector('.dd-material-meta')?.outerHTML||'';
    const note=out.querySelector('.notice')?.outerHTML||'';
    const instruction=out.querySelector('.dd-material-instruction')?.outerHTML||'';
    const actions=out.querySelector('.dd-material-actions')?.outerHTML||'';
    item.html=meta+note+instruction+`<div class="dd-editable-material" contenteditable="true" spellcheck="true">${editable.innerHTML}</div>`+actions;
    const idx=(state.materials||[]).findIndex(x=>x.id===item.id);
    if(idx>=0)state.materials[idx]=item;
    save();
    const btn=out.querySelector('.dd-material-actions .btn');
    if(btn){const old=btn.textContent;btn.textContent='✓ Cambios guardados';setTimeout(()=>btn.textContent=old,1200);}
  }

  function createBundle(){
    const ctx=sourceContext();
    const topic=($('materialTopic')?.value||'').trim()||ctx.topic||ctx.title||'Aprendemos desde nuestro contexto';
    const area=$('materialArea')?.value||ctx.area||state.areas?.[0]||'Comunicación';
    const level=state.level||'Primaria';
    const grades=(ctx.grades&&ctx.grades.length?ctx.grades:(state.grades||[])).length
      ? (ctx.grades&&ctx.grades.length?ctx.grades:(state.grades||[]))
      : [$('materialGrade')?.value||'1.º'];
    const types=area==='Matemática'
      ? ['Ficha de trabajo','Banco de problemas','Conceptos para pizarra','Organizador de aprendizaje']
      : ['Lectura','Ficha de trabajo','Conceptos para pizarra','Organizador de aprendizaje'];

    const gradeBlocks=grades.map((grade,gi)=>{
      const codeGrade=String(grade).match(/\d+/)?.[0]||String(gi+1);
      return `<section class="dd-grade-pack">
        <div class="dd-grade-pack-head"><span class="pill">Grado / edad: ${E(grade)}</span><h2>Materiales diferenciados · ${E(grade)}</h2></div>
        ${types.map((t,ti)=>{
          const code=t==='Ficha de trabajo'?`FIC-${codeGrade}-01`
            :t==='Banco de problemas'?`MAT-${codeGrade}-10P`
            :t==='Lectura'?`LEC-${codeGrade}-01`
            :t==='Conceptos para pizarra'?`PIZ-${codeGrade}-01`
            :`ORG-${codeGrade}-01`;
          return `<section class="dd-bundle-section"><div class="dd-resource-code">${E(code)}</div><h3>${E(t)}</h3>${renderByType(t,topic,level,grade,area)}</section>`;
        }).join('')}
      </section>`;
    }).join('');

    const bundleHtml=`<article class="dd-material-bundle"><div class="dd-material-kicker">Paquete de materiales · ${E(area)}</div><h1>Paquete: ${E(topic)}</h1><p><b>Diferenciación:</b> cada grado/edad recibe su propio bloque; no se mezclan fichas de distintos grados en una sola lámina.</p>${gradeBlocks}</article>`;
    const item={id:'m'+Date.now(),createdAt:new Date().toISOString(),type:'Paquete de materiales',level,grade:grades.join(', '),area,lang:'Castellano',variety:'Ninguna',topic,instruction:'',source:ctx.source,sourceTitle:ctx.title||'',html:`<div class="dd-editable-material" contenteditable="true" spellcheck="true">${bundleHtml}</div><div class="actions topgap dd-material-actions"><button class="btn" type="button" onclick="window.DDMaterials.saveEdits()">💾 Guardar cambios</button><button class="btn alt" type="button" onclick="window.DDMaterials.downloadWord()">⬇ Word</button><button class="btn alt" type="button" onclick="window.print()">🖨 Imprimir / PDF</button></div>`};
    state.materials.unshift(item);state.materials=state.materials.slice(0,40);state.lastMaterial=item;save();renderItem(item);renderHistory();
  }

  function useCurrent(){
    const ctx=sourceContext();
    const topic=$('materialTopic');
    if(topic)topic.value=ctx.topic||ctx.title||'';
    const area=$('materialArea');
    if(area&&ctx.area&&[...area.options].some(o=>o.value===ctx.area))area.value=ctx.area;
    const grade=$('materialGrade');
    const g=ctx.grades?.[0];
    if(grade&&g&&[...grade.options].some(o=>o.value===g))grade.value=g;
  }

  function duplicate(){
    const last=state.lastMaterial;if(!last)return;
    if($('materialType'))$('materialType').value=last.type;
    if($('materialTopic'))$('materialTopic').value=last.topic;
    if($('materialArea')&&[...$('materialArea').options].some(o=>o.value===last.area))$('materialArea').value=last.area;
    if($('materialGrade')&&[...$('materialGrade').options].some(o=>o.value===last.grade))$('materialGrade').value=last.grade;
    if($('materialInstruction'))$('materialInstruction').value='Crea una variante manteniendo el propósito y aumentando o reduciendo la complejidad según el grado.';
    $('materialOutput')?.classList.add('hidden');
    $('materialTopic')?.focus();
  }

  function materialWordHtml(item){
    return `<div class="word-border">${item.html.replace(/<div class="actions[\s\S]*$/,'')}</div>`;
  }

  function downloadWord(){
    const item=state.lastMaterial;if(!item)return alert('Primero crea un material.');
    if(typeof wordBlob!=='function'||typeof downloadBlob!=='function')return alert('No se pudo preparar el Word en este dispositivo.');
    downloadBlob(wordBlob(item.topic,materialWordHtml(item)),cleanFileName(item.type+'_'+item.topic)+'.doc');
  }

  function reopen(id){
    const item=(state.materials||[]).find(x=>x.id===id);if(!item)return;
    state.lastMaterial=item;save();renderItem(item);
  }

  function remove(id){
    state.materials=(state.materials||[]).filter(x=>x.id!==id);
    if(state.lastMaterial?.id===id)state.lastMaterial=null;
    save();renderHistory();
  }

  function renderHistory(){
    const box=$('materialHistory');if(!box)return;
    const items=(state.materials||[]).slice(0,8);
    if(!items.length){
      box.innerHTML='<div class="dd-empty">Cuando crees un material aparecerá aquí para que puedas reutilizarlo sin volver a empezar.</div>';
      return;
    }
    box.innerHTML=items.map(item=>`<article class="dd-material-history-item">
      <div><span class="pill">${E(item.type)}</span><h3>${E(item.topic)}</h3><p>${E(item.level)} · ${E(item.grade)} · ${E(item.area)}</p></div>
      <div class="actions"><button class="btn alt" type="button" onclick="window.DDMaterials.reopen('${E(item.id)}')">Abrir</button><button class="btn ghost" type="button" onclick="window.DDMaterials.remove('${E(item.id)}')">Quitar</button></div>
    </article>`).join('');
  }

  function fill(){
    const areas=state.areas?.length?state.areas:(typeof areaOptions==='function'?areaOptions():[]);
    const grades=state.grades?.length?state.grades:(typeof gradeOptions==='function'?gradeOptions():[]);
    if($('materialArea')){
      const old=$('materialArea').value;
      $('materialArea').innerHTML=areas.map(a=>`<option value="${E(a)}">${E(a)}</option>`).join('');
      if(old&&areas.includes(old))$('materialArea').value=old;
    }
    if($('materialGrade')){
      const old=$('materialGrade').value;
      $('materialGrade').innerHTML=grades.map(g=>`<option value="${E(g)}">${E(g)}</option>`).join('');
      if(old&&grades.includes(old))$('materialGrade').value=old;
    }
    if($('materialQuechua')){
      const vars=['Ninguna','Quechua Collao','Quechua Chanka','Aimara','Asháninka','Shipibo-Konibo','Otra lengua originaria'];
      $('materialQuechua').innerHTML=vars.map(v=>`<option value="${E(v)}">${E(v)}</option>`).join('');
      $('materialQuechua').value=state.quechuaVar&&vars.includes(state.quechuaVar)?state.quechuaVar:'Ninguna';
    }
  }

  function wire(){
    fill();
    renderHistory();
    $('materialSource')?.addEventListener('change',useCurrent);
    $('materialLanguage')?.addEventListener('change',()=>{
      const lang=$('materialLanguage').value;
      if($('materialQuechua'))$('materialQuechua').disabled=lang==='Castellano';
    });
    if($('materialLanguage'))$('materialQuechua').disabled=$('materialLanguage').value==='Castellano';
  }

  const oldRefresh=window.refresh;
  if(typeof oldRefresh==='function'){
    window.refresh=function(){
      const r=oldRefresh.apply(this,arguments);
      fill();renderHistory();
      return r;
    };
  }

  const css=document.createElement('style');
  css.textContent=`
    .dd-material-sheet{max-width:820px;margin:auto;padding:18px;background:#fff}
    .dd-material-sheet h1{font-size:26px;margin:8px 0 14px;color:#183f32}
    .dd-material-kicker{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:#3e705e}
    .dd-material-meta{display:flex;gap:10px;flex-wrap:wrap;padding:8px 10px;margin-bottom:10px;border-bottom:1px solid #dbe5df}
    .dd-material-meta span{font-size:12px;color:#667}
    .dd-material-task,.dd-material-reflect,.dd-material-instruction{margin:14px 0;padding:12px;border-radius:12px;background:#f4f8f6;border:1px solid #dce8e1}
    .dd-big-list,.dd-problem-list{padding-left:22px}.dd-big-list li,.dd-problem-list li{margin:13px 0}
    .dd-answer-lines{height:52px;margin-top:8px;background:repeating-linear-gradient(to bottom,transparent 0,transparent 22px,#c8d1cc 23px,#c8d1cc 24px)}
    .dd-answer-lines.tall{height:88px}
    .dd-word-cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
    .dd-word-card{min-height:150px;border:2px dashed #768c81;border-radius:14px;padding:14px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;text-align:center}
    .dd-word-icon{font-size:50px}.dd-word-card b{font-size:20px}.dd-word-card span{color:#89958f}
    .dd-concept-grid,.dd-organizer{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
    .dd-concept-grid section,.dd-organizer section{border:1px solid #d9e4de;border-radius:12px;padding:12px;background:#fbfdfc}
    .dd-editable-material{outline:none;border-radius:10px}.dd-editable-material:focus{box-shadow:0 0 0 2px rgba(47,126,90,.15)}.dd-material-bundle>.dd-bundle-section{margin:22px 0;padding-top:16px;border-top:2px dashed #c8d8cf}.dd-grade-pack{margin:24px 0;padding:14px;border:1px solid #d7e3dc;border-radius:14px;background:#fbfdfc}.dd-grade-pack-head{margin-bottom:10px}.dd-resource-code{display:inline-block;font-size:11px;font-weight:800;letter-spacing:.04em;background:#eaf5ef;border-radius:8px;padding:5px 8px;margin-bottom:6px}.dd-material-history{display:grid;gap:8px}.dd-material-history-item{display:flex;justify-content:space-between;gap:12px;align-items:center;border:1px solid #dce5e0;border-radius:12px;padding:11px;background:#fff}
    .dd-material-history-item h3{margin:5px 0 2px}.dd-material-history-item p{margin:0;color:#677}
    @media(max-width:650px){.dd-word-cards,.dd-concept-grid,.dd-organizer{grid-template-columns:1fr}.dd-material-history-item{align-items:flex-start;flex-direction:column}}
    @media print{body>*:not(.layout){display:none!important}.sidebar,.topbar,.mobile-nav,.dd-material-actions{display:none!important}.content,.screen#materials,.screen#materials.active{display:block!important;padding:0!important}.screen#materials>*:not(.card){display:none!important}#materials .card>*:not(#materialOutput){display:none!important}#materialOutput{display:block!important;border:0!important;box-shadow:none!important}}
  `;
  document.head.appendChild(css);

  window.DDMaterials={create,createBundle,useCurrent,duplicate,saveEdits,downloadWord,reopen,remove,fill,renderHistory};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wire,{once:true});else wire();
})();