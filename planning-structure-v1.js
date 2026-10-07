/* DocenteDigital — estructura de planificación MINEDU v1
   Diferencia unidad, proyecto y sesión sin convertirlos en una plantilla rígida.
   La guía de Inicial advierte que no existe un único modelo de proyecto; por ello,
   estas rutas son orientadoras y adaptables.
*/
(function(){
  if(window.__ddPlanningStructureV1)return;
  window.__ddPlanningStructureV1=true;

  const E=v=>escapeHtml(v);

  function isProject(unit){return /proyecto/i.test(unit?.type||'');}

  function projectStages(level){
    if(level==='Inicial')return [
      {name:'1. Nace el interés o problema',desc:'Se recuperan preguntas, curiosidades, necesidades o situaciones significativas de las niñas y los niños mediante conversación, juego, observación y experiencias cercanas.'},
      {name:'2. Planificamos con los niños',desc:'Se acuerda qué quieren saber o hacer, qué acciones pueden realizar, qué materiales necesitan y cómo participarán; el docente organiza la intencionalidad curricular sin anular la voz infantil.'},
      {name:'3. Investigamos, exploramos y creamos',desc:'Se desarrollan experiencias de exploración, indagación, comunicación, representación, juego, arte, resolución de problemas y producción según las competencias movilizadas.'},
      {name:'4. Revisamos y tomamos decisiones',desc:'Los niños comparan lo pensado con lo realizado, revisan producciones, explican hallazgos y reciben retroalimentación para mejorar.'},
      {name:'5. Compartimos y valoramos lo aprendido',desc:'Se comunica el producto, descubrimiento o experiencia a un destinatario real y se conversa sobre qué aprendieron, cómo participaron y qué nuevas preguntas surgieron.'}
    ];
    if(level==='Secundaria')return [
      {name:'1. Problematización y desafío',desc:'Se delimita una situación auténtica, se analizan actores, datos, necesidades y restricciones, y se formula una pregunta o desafío que demande investigación y toma de decisiones.'},
      {name:'2. Planificación del proyecto',desc:'Los estudiantes definen metas parciales, tareas, fuentes, responsabilidades, tiempos, criterios de calidad y evidencias necesarias para responder al desafío.'},
      {name:'3. Investigación y desarrollo',desc:'Se contrastan fuentes, datos y perspectivas; se aplican conocimientos disciplinares, estrategias de colaboración y herramientas pertinentes para construir respuestas o soluciones.'},
      {name:'4. Producción, prueba y mejora',desc:'Se elabora una producción o actuación, se somete a criterios, evidencia o retroalimentación y se realizan ajustes fundamentados.'},
      {name:'5. Comunicación, evaluación y transferencia',desc:'Se presenta el resultado a un destinatario pertinente, se argumentan decisiones, se evalúa el proceso y se transfiere lo aprendido a otra situación.'}
    ];
    return [
      {name:'1. Comprendemos el reto',desc:'Los estudiantes observan, preguntan, recuperan saberes y delimitan qué necesitan comprender o resolver en la situación significativa.'},
      {name:'2. Planificamos cómo aprender y actuar',desc:'Se acuerdan acciones, responsabilidades, fuentes, recursos, tiempos y formas de demostrar el aprendizaje, con apoyos diferenciados cuando corresponda.'},
      {name:'3. Investigamos y desarrollamos aprendizajes',desc:'Se articulan actividades de las áreas, experiencias del contexto, materiales concretos, lectura, resolución de problemas, indagación, diálogo y producción.'},
      {name:'4. Elaboramos, revisamos y mejoramos',desc:'Las producciones se contrastan con criterios visibles; la retroalimentación genera un segundo intento y una mejora observable.'},
      {name:'5. Compartimos, evaluamos y transferimos',desc:'Se comunica el producto o respuesta, se reconoce la evidencia del aprendizaje y se aplica lo aprendido a una nueva situación.'}
    ];
  }

  function unitStages(level){
    return [
      {name:'1. Situación significativa',desc:'Presenta una situación auténtica o verosímil que da sentido al aprendizaje y plantea un reto, problema, necesidad u oportunidad vinculada con el contexto.'},
      {name:'2. Propósitos y criterios',desc:'Se priorizan competencias y capacidades oficiales, se definen criterios contextualizados y se anticipan producciones o actuaciones que permitirán recoger evidencia.'},
      {name:'3. Secuencia de actividades',desc:'Se organizan actividades articuladas y progresivas que permiten enfrentar el reto en varias sesiones, evitando tareas aisladas o sin propósito.'},
      {name:'4. Evaluación formativa',desc:'Se recoge evidencia durante el proceso, se compara con criterios, se retroalimenta y se ajusta la enseñanza y el aprendizaje.'},
      {name:'5. Cierre y transferencia',desc:'Se integran aprendizajes, se valoran avances y se plantea una nueva situación para verificar transferencia y continuidad.'}
    ];
  }

  function planningModel(unit){
    return {
      type:isProject(unit)?'Proyecto de aprendizaje':'Unidad de aprendizaje',
      flexible:true,
      stages:isProject(unit)?projectStages(unit.level):unitStages(unit.level),
      officialComponents:[
        'Situación significativa',
        'Propósito de aprendizaje',
        'Enfoques transversales',
        'Producciones o actuaciones / evidencias',
        'Secuencia de actividades',
        'Criterios de evaluación'
      ],
      sources:[
        'Currículo Nacional de la Educación Básica',
        'Programa curricular del nivel',
        'Orientaciones MINEDU de planificación pertinentes al nivel'
      ]
    };
  }

  function routeHtml(unit){
    const m=planningModel(unit);
    const intro=isProject(unit)
      ? 'El proyecto se organiza como una ruta flexible. Los estudiantes participan activamente en la comprensión del reto, la planificación, el desarrollo, la revisión y la comunicación del producto o respuesta.'
      : 'La unidad organiza una experiencia de aprendizaje articulada alrededor de una situación significativa y una secuencia intencionada de actividades.';
    return `<div class="dd-planning-route">
      <p>${E(intro)}</p>
      <div class="dd-stage-grid">${m.stages.map(s=>`<article><h4>${E(s.name)}</h4><p>${E(s.desc)}</p></article>`).join('')}</div>
      <div class="dd-route-note"><b>Componentes que deben mantenerse articulados:</b> ${m.officialComponents.map(E).join(' · ')}.</div>
    </div>`;
  }

  function apply(unit){
    if(!unit)return unit;
    unit.planningModel=planningModel(unit);
    return unit;
  }

  const prevRender=window.renderUnitOutput;
  if(typeof prevRender==='function'){
    window.renderUnitOutput=function(unit){
      apply(unit);
      const result=prevRender.apply(this,arguments);
      const out=document.getElementById('unitOutput');
      if(!out)return result;

      // Remove any old route section before remounting.
      out.querySelector('#dd-ruta')?.remove();
      const summary=out.querySelector('#dd-resumen');
      if(summary){
        const section=document.createElement('section');
        section.id='dd-ruta';
        section.className='dd-unit-section dd-hidden';
        section.innerHTML=`<h2>${isProject(unit)?'III. Ruta pedagógica del proyecto':'III. Ruta pedagógica de la unidad'}</h2>${routeHtml(unit)}`;
        summary.insertAdjacentElement('afterend',section);
      }
      const tabs=out.querySelector('.dd-tabs');
      if(tabs&&!tabs.querySelector('[data-dd-route-tab]')){
        const b=document.createElement('button');
        b.type='button';b.setAttribute('data-dd-route-tab','true');b.textContent='Ruta';
        b.onclick=()=>ddShowTab('ruta');
        const first=tabs.children[1]; if(first)tabs.insertBefore(b,first);else tabs.appendChild(b);
      }
      return result;
    };
  }

  const prevWord=window.unitWordHtml;
  if(typeof prevWord==='function'){
    window.unitWordHtml=function(unit){
      apply(unit);
      let html=prevWord.apply(this,arguments);
      const heading=isProject(unit)?'III. RUTA PEDAGÓGICA DEL PROYECTO':'III. RUTA PEDAGÓGICA DE LA UNIDAD';
      const block=`<h2>${heading}</h2>${routeHtml(unit)}`;
      if(html.includes('<h2>III. PROPÓSITOS DE APRENDIZAJE</h2>')){
        html=html.replace('<h2>III. PROPÓSITOS DE APRENDIZAJE</h2>',block+'<h2>IV. PROPÓSITOS DE APRENDIZAJE</h2>')
          .replace('<h2>IV. MATRIZ DE ARTICULACIÓN Y EVALUACIÓN</h2>','<h2>V. MATRIZ DE ARTICULACIÓN Y EVALUACIÓN</h2>')
          .replace('<h2>V. SECUENCIA DE SESIONES DE APRENDIZAJE</h2>','<h2>VI. SECUENCIA DE SESIONES DE APRENDIZAJE</h2>')
          .replace('<h2>VI. INSTRUMENTOS DE EVALUACIÓN</h2>','<h2>VII. INSTRUMENTOS DE EVALUACIÓN</h2>')
          .replace('<h2>VII. REGISTRO AUXILIAR</h2>','<h2>VIII. REGISTRO AUXILIAR</h2>');
      }
      return html;
    };
  }

  const css=document.createElement('style');
  css.textContent=`
    .dd-stage-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
    .dd-stage-grid article{border:1px solid #dce6e0;border-radius:12px;padding:11px;background:#fbfdfc}
    .dd-stage-grid h4{margin:0 0 5px;color:#285e49}.dd-stage-grid p{margin:0}
    .dd-route-note{margin-top:10px;padding:10px;border-left:4px solid #2e7656;background:#eef7f1;border-radius:8px}
    @media(max-width:760px){.dd-stage-grid{grid-template-columns:1fr}}
  `;
  document.head.appendChild(css);

  window.DD_PLANNING_STRUCTURE={planningModel,projectStages,unitStages,apply};
})();