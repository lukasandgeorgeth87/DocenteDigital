/* DocenteDigital — Evaluación v1 */
(function(){
  if(window.__ddEvaluationV1)return;
  window.__ddEvaluationV1=true;

  var $=function(id){return document.getElementById(id);};
  var E=function(v){return escapeHtml(v);};

  // The simplified planning shell can replace the evaluation screen markup.
  // Recreate the output panel on demand instead of silently ignoring clicks.
  function ensureEvaluationPanel(){
    var panel=$('evaluationPanel');
    if(panel)return panel;
    var screen=$('evaluation');
    if(!screen)return null;
    panel=document.createElement('div');
    panel.id='evaluationPanel';
    panel.className='card hidden topgap';
    screen.appendChild(panel);
    return panel;
  }

  state.evaluationRecords=Array.isArray(state.evaluationRecords)?state.evaluationRecords:[];
  state.studentRoster=state.studentRoster&&typeof state.studentRoster==='object'?state.studentRoster:{};
  state.generatedAssessments=Array.isArray(state.generatedAssessments)?state.generatedAssessments:[];
  save();

  function activeUnit(){
    // An explicitly selected unit may have been deleted or removed by restore.
    // Never substitute a different unit when displaying student evaluation data.
    if(state.activeUnitId)return (state.units||[]).find(function(u){return u.id===state.activeUnitId;})||null;
    return (state.units||[])[0]||null;
  }

  function purposes(unit){
    if(unit&&Array.isArray(unit.purposes)&&unit.purposes.length)return unit.purposes;
    var areas=(unit&&unit.areas)||state.areas||[];
    var grades=(unit&&unit.grades)||state.grades||[];
    return areas.map(function(area){
      return {area:area,evidence:'Producción o actuación observable vinculada al propósito.',instrument:'Instrumento pertinente.',criteria:grades.map(function(g){return {grade:g,text:'Demuestra el aprendizaje previsto de '+area+' mediante una actuación observable y explicada.'};})};
    });
  }

  function criteriaFor(unit,grade,area){
    // A stale unit selection must not show another unit's criteria or a
    // previous session's assessment evidence.
    if(state.activeUnitId&&!unit)return [];
    var out=[];
    purposes(unit).filter(function(p){return !area||p.area===area;}).forEach(function(p){
      // Criteria are grade-specific. A missing grade must never inherit the first
      // available grade's criterion (especially in multigrade classrooms).
      var c=(p.criteria||[]).find(function(x){return String(x.grade).trim()===String(grade).trim();});
      if(c&&c.text)out.push({area:p.area,criterion:c.text,evidence:p.evidence||'',instrument:p.instrument||''});
    });
    if(!out.length&&(!unit||!Array.isArray(unit.purposes)||!unit.purposes.length)&&state.lastSession&&
      (unit ? state.lastSession.unitId===unit.id : !state.activeUnitId&&!state.lastSession.unitId) &&
      (!area||state.lastSession.area===area)){
      out.push({area:state.lastSession.area||area||'Área',criterion:state.lastSession.criterion||'Criterio de evaluación',evidence:state.lastSession.evidence||'',instrument:state.lastSession.instrument||''});
    }
    return out;
  }

  function roster(grade){
    var list=Array.isArray(state.studentRoster[grade])?state.studentRoster[grade].filter(Boolean):[];
    return list.length?list:['Estudiante 1','Estudiante 2','Estudiante 3','Estudiante 4','Estudiante 5'];
  }

  function label(code){
    return ({C:'Requiere apoyo / Inicio',B:'En proceso',A:'Logro esperado',AD:'Logro destacado'})[code]||'Sin registrar';
  }

  function opts(selected){
    var arr=[['','Seleccionar'],['C','Requiere apoyo / Inicio'],['B','En proceso'],['A','Logro esperado'],['AD','Logro destacado']];
    return arr.map(function(x){return '<option value="'+E(x[0])+'" '+(selected===x[0]?'selected':'')+'>'+E(x[1])+'</option>';}).join('');
  }

  function context(unit){
    var p=state.teacherContext||{};
    var place=[p.institutionName||state.schoolName||'',p.community?((p.localityType||'Localidad')+' '+p.community):'',p.district?('Distrito '+p.district):'',p.province?('Provincia '+p.province):'',p.region?('Región '+p.region):''].filter(Boolean).join(' · ');
    return '<div class="dd-eval-context"><b>'+E((unit&&unit.title)||'Planificación actual')+'</b><span>'+E(place)+'</span></div>';
  }

  function record(unitId,grade,area,criterion,student){
    return state.evaluationRecords.find(function(r){return r.unitId===unitId&&r.grade===grade&&r.area===area&&r.criterion===criterion&&r.student===student;})||{};
  }

  function openRegister(){
    var unit=activeUnit(),panel=ensureEvaluationPanel();if(!panel)return;
    var grades=(unit&&unit.grades)||state.grades||[],areas=(unit&&unit.areas)||state.areas||[];
    panel.classList.remove('hidden');
    panel.innerHTML=context(unit)+'<h2>📋 Registro de evaluación</h2><p class="sub">Los criterios se recuperan de la planificación. El docente registra la evidencia observada; DocenteDigital no inventa resultados. Durante la Beta usa iniciales o códigos y evita datos sensibles.</p><div class="form2"><label>Grado / edad<select id="ddEvalGrade">'+grades.map(function(g){return '<option>'+E(g)+'</option>';}).join('')+'</select></label><label>Área<select id="ddEvalArea"><option value="">Todas las áreas</option>'+areas.map(function(a){return '<option>'+E(a)+'</option>';}).join('')+'</select></label></div><div class="actions"><button class="btn alt" id="ddEvalRoster">👥 Editar estudiantes</button><button class="btn" id="ddEvalLoad">Cargar criterios</button></div><div id="ddEvalBody" class="topgap"></div>';
    $('ddEvalLoad').onclick=renderRegister;
    $('ddEvalRoster').onclick=editRoster;
    renderRegister();
  }

  function editRoster(){
    var grade=$('ddEvalGrade').value,list=roster(grade),box=$('ddEvalBody');
    box.innerHTML='<h3>Estudiantes · '+E(grade)+'</h3><p class="sub">Escribe un código, iniciales o nombre por línea. En la Beta se recomienda usar códigos o iniciales y no registrar datos sensibles.</p><textarea id="ddRosterText" style="width:100%;min-height:220px">'+E(list.join('\n'))+'</textarea><div class="actions"><button class="btn" id="ddRosterSave">💾 Guardar lista</button><button class="btn ghost" id="ddRosterCancel">Cancelar</button></div>';
    $('ddRosterSave').onclick=function(){state.studentRoster[grade]=$('ddRosterText').value.split(/\n+/).map(function(x){return x.trim();}).filter(Boolean);save();renderRegister();};
    $('ddRosterCancel').onclick=renderRegister;
  }

  function renderRegister(){
    var unit=activeUnit(),grade=$('ddEvalGrade').value,area=$('ddEvalArea').value,cs=criteriaFor(unit,grade,area),names=roster(grade),box=$('ddEvalBody');
    if(!cs.length){box.innerHTML='<div class="notice">Aún no hay criterios disponibles.</div>';return;}
    var html='';
    cs.forEach(function(c,ci){
      var rows=names.map(function(student,si){
        var r=record((unit&&unit.id)||'',grade,c.area,c.criterion,student);
        return '<tr><td><input value="'+E(student)+'" readonly></td><td><select class="dd-eval-level" data-ci="'+ci+'" data-si="'+si+'">'+opts(r.level||'')+'</select></td><td><textarea class="dd-eval-note" data-ci="'+ci+'" data-si="'+si+'" placeholder="¿Qué hizo, dijo, resolvió o produjo?">'+E(r.evidenceNote||'')+'</textarea></td><td><textarea class="dd-eval-next" data-ci="'+ci+'" data-si="'+si+'" placeholder="Siguiente paso">'+E(r.nextStep||'')+'</textarea></td></tr>';
      }).join('');
      html+='<section class="dd-eval-criterion"><h3>'+E(c.area)+'</h3><p><b>Criterio:</b> '+E(c.criterion)+'</p><p class="dd-small"><b>Evidencia esperada:</b> '+E(c.evidence)+' · <b>Instrumento:</b> '+E(c.instrument)+'</p><div class="dd-scroll"><table class="dd-table"><thead><tr><th>Estudiante / código</th><th>Nivel</th><th>Evidencia observada</th><th>Siguiente paso</th></tr></thead><tbody>'+rows+'</tbody></table></div></section>';
    });
    html+='<div class="actions"><button class="btn" id="ddEvalSave">💾 Guardar registro</button><button class="btn alt" id="ddEvalCsv">⬇ Descargar CSV</button><button class="btn ghost" id="ddEvalCon">📝 Conclusiones</button></div>';
    box.innerHTML=html;
    $('ddEvalSave').onclick=function(){saveRegister(cs,names,unit,grade,true);};
    $('ddEvalCsv').onclick=function(){saveRegister(cs,names,unit,grade,false);downloadCsv(unit,grade);};
    $('ddEvalCon').onclick=function(){saveRegister(cs,names,unit,grade,false);openConclusions(grade);};
  }

  function saveRegister(cs,names,unit,grade,notify){
    cs.forEach(function(c,ci){
      names.forEach(function(student,si){
        var levelEl=document.querySelector('.dd-eval-level[data-ci="'+ci+'"][data-si="'+si+'"]');
        var noteEl=document.querySelector('.dd-eval-note[data-ci="'+ci+'"][data-si="'+si+'"]');
        var nextEl=document.querySelector('.dd-eval-next[data-ci="'+ci+'"][data-si="'+si+'"]');
        var level=levelEl?levelEl.value:'',note=noteEl?noteEl.value.trim():'',next=nextEl?nextEl.value.trim():'';
        var idx=state.evaluationRecords.findIndex(function(r){return r.unitId===((unit&&unit.id)||'')&&r.grade===grade&&r.area===c.area&&r.criterion===c.criterion&&r.student===student;});
        var rec={unitId:(unit&&unit.id)||'',unitTitle:(unit&&unit.title)||'',grade:grade,area:c.area,criterion:c.criterion,student:student,level:level,evidenceNote:note,nextStep:next,evidenceExpected:c.evidence,instrument:c.instrument,updatedAt:new Date().toISOString()};
        if(idx>=0)state.evaluationRecords[idx]=rec;else if(level||note||next)state.evaluationRecords.push(rec);
      });
    });
    save();
    if(notify){var b=$('ddEvalSave');if(b){var old=b.textContent;b.textContent='✓ Registro guardado';setTimeout(function(){b.textContent=old;},1200);}}
  }

  function downloadCsv(unit,grade){
    var rows=state.evaluationRecords.filter(function(r){return r.unitId===((unit&&unit.id)||'')&&r.grade===grade;});
    var all=[['Estudiante','Grado','Área','Criterio','Nivel','Evidencia observada','Siguiente paso']].concat(rows.map(function(r){return [r.student,r.grade,r.area,r.criterion,label(r.level),r.evidenceNote,r.nextStep];}));
    // CSV quoting does not prevent spreadsheet formula execution. Student codes,
    // teacher notes and criteria are untrusted text; force formula-like cells
    // to be interpreted as literal text when opened in Excel/Sheets.
    function safeCsvCell(value){
      var cell=String(value==null?'':value);
      if(/^[\s\uFEFF]*[=+\-@]/.test(cell)||/^[\t\r\n]/.test(cell))cell="'"+cell;
      return '"'+cell.replace(/"/g,'""')+'"';
    }
    var csv=all.map(function(row){return row.map(safeCsvCell).join(',');}).join('\n');
    downloadBlob(new Blob(['\ufeff',csv],{type:'text/csv;charset=utf-8'}),cleanFileName('Registro_evaluacion_'+((unit&&unit.title)||grade))+'.csv');
  }

  function difficulty(grade){
    var n=parseInt(String(grade||'').match(/\d+/)?String(grade).match(/\d+/)[0]:'1');
    if(state.level==='Inicial'||/años/.test(grade))return 'explorar, representar, comunicar y comparar mediante oralidad, juego, dibujo, movimiento o manipulación';
    if(n<=2)return 'observar, representar con material o dibujo y explicar oralmente';
    if(n<=4)return 'organizar información, aplicar, comparar y explicar';
    if(state.level==='Primaria')return 'analizar, justificar, verificar y transferir';
    return n<=2?'interpretar, relacionar y sustentar':'analizar críticamente, contrastar, argumentar y proponer';
  }

  // Each assessment item must ask for a different observable action. The
  // previous implementation repeated the same generic prompt 4–10 times.
  // These are editable task prompts, NOT verified MINEDU performances.
  function assessmentTask(area,grade,index,unit){
    var n=parseInt(String(grade||'').match(/\d+/)?.[0]||'1',10);
    // Only select division examples when the teacher's approved planning
    // explicitly refers to division/repartition. Other maths units retain
    // their existing tasks rather than inheriting an unrelated topic.
    var planningText=[unit&&unit.title,unit&&unit.situationBrief,unit&&unit.situation,unit&&unit.reto]
      .filter(Boolean).join(' ').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    if(area==='Matemática' && /division|dividir|reparto|repartir|mitad|mitades/.test(planningText)){
      var divisionTasks=n<=2?[
        'Dibuja 10 panes y repártelos en dos grupos iguales. ¿Cuántos panes recibe cada grupo?',
        'Dibuja 8 semillas y marca la mitad. ¿Cuántas semillas marcaste?',
        'Representa con fichas el reparto de 12 objetos entre dos personas. Dibuja los dos grupos.',
        'Comprueba con dibujos si 6 panes pueden repartirse por igual entre dos niñas o niños.',
        'Una familia tiene 14 tarjetas y entrega la mitad a otra familia. ¿Cuántas tarjetas entrega?',
        'Explica con material concreto por qué dos grupos de 5 forman 10 objetos.',
        'Reparte 16 hojas entre dos mesas. Dibuja cuántas hojas quedan en cada mesa.',
        'Coloca 18 fichas en dos cajas con igual cantidad. ¿Cuántas van en cada caja?',
        'Hay 4 panes para dos familias. Muestra con dibujos cuántos recibe cada familia.',
        'Forma dos grupos iguales usando 20 semillas. ¿Cuántas semillas hay en cada grupo?'
      ]:n>=5?[
        'Identifica los datos: cinco familias reparten S/ 87,50 en partes iguales. ¿Cuánto corresponde a cada familia?',
        'Calcula 145 ÷ 6. Expresa el cociente entero y el residuo; interpreta qué representa cada uno.',
        'Se distribuyen S/ 156 entre 8 equipos. Resuelve y comprueba el resultado mediante multiplicación.',
        'Compara 87,50 ÷ 5 y 87,50 ÷ 10. Justifica cuál entrega mayor cantidad por persona.',
        'Un comité dispone de 145 tarjetas para 6 grupos. ¿Cuántas recibe cada grupo y cuántas quedan sin repartir?',
        'Diseña un reparto con decimales que tenga resultado exacto y explica cómo lo verificas.',
        'Se distribuyen S/ 123,60 entre 6 comités. ¿Cuánto recibe cada uno? Comprueba el cálculo.',
        'Calcula 258 ÷ 7. Indica el cociente entero y el residuo y comprueba tu respuesta.',
        'Cinco familias comparten un presupuesto de S/ 96,75. ¿Cuánto corresponde a cada familia?',
        'Reparte 247 panes entre 8 puestos. Calcula cuántos recibe cada uno y decide qué hacer con los sobrantes.'
      ]:[
        'Identifica los datos: 24 panes se reparten entre 4 familias. ¿Cuántos recibe cada una?',
        'Representa con grupos o un esquema la operación 25 ÷ 4. ¿Cuántos recibe cada grupo y cuántos sobran?',
        'Resuelve 36 ÷ 3 y comprueba el resultado con una multiplicación.',
        'Compara el reparto de 24 objetos entre 4 personas y entre 6 personas. ¿Qué cambia?',
        'Una familia distribuye 29 tarjetas entre 5 grupos. Calcula el cociente y el residuo.',
        'Inventa un reparto exacto de 32 semillas, resuélvelo y explica por qué no sobra ninguna.',
        'Reparte 42 lápices entre 6 estudiantes. Calcula y verifica la cantidad para cada uno.',
        'Se reparten 47 tarjetas entre 5 equipos. ¿Cuántas recibe cada equipo y cuántas sobran?',
        'Organiza 63 panes en 7 canastas iguales. ¿Cuántos panes lleva cada canasta?',
        'Distribuye 38 semillas en 4 grupos iguales. ¿Cuántas recibe cada grupo y cuántas sobran?'
      ];
      return divisionTasks[index%divisionTasks.length];
    }
    var early=state.level==='Inicial'||n<=2;
    var advanced=!early&&n>=5;
    var steps;
    if(area==='Matemática'){
      steps=early?[
        'Observa la situación y señala qué cantidades aparecen.',
        'Representa las cantidades con objetos, marcas o dibujos.',
        'Muestra con material cómo resolverías la pregunta.',
        'Cuenta o compara para comprobar tu respuesta.',
        'Dibuja otra forma de mostrar el mismo resultado.',
        'Explica con tus palabras cómo llegaste a tu respuesta.',
        'Identifica cuál de dos respuestas es posible y di por qué.',
        'Completa una representación que haya quedado a medias.',
        'Inventa con objetos una situación parecida y cuéntala.',
        'Revisa tu trabajo con un compañero y corrige si es necesario.'
      ]:advanced?[
        'Identifica los datos, las condiciones y la incógnita del problema.',
        'Representa las relaciones entre cantidades con un esquema o expresión.',
        'Elige una estrategia y resuelve justificando cada operación.',
        'Verifica el resultado mediante un procedimiento independiente.',
        'Analiza si el resultado es razonable en el contexto planteado.',
        'Compara dos procedimientos y argumenta cuál resulta más eficiente.',
        'Detecta un posible error de razonamiento y explica cómo corregirlo.',
        'Modifica un dato, predice el efecto y comprueba tu predicción.',
        'Formula un nuevo problema equivalente y presenta su solución.',
        'Relaciona el procedimiento con una decisión del producto final.'
      ]:[
        'Identifica los datos y la pregunta que debes responder.',
        'Organiza los datos mediante un dibujo, tabla o esquema.',
        'Elige una operación o estrategia y explica tu elección.',
        'Resuelve mostrando los pasos de tu procedimiento.',
        'Comprueba el resultado con otra representación.',
        'Explica qué significa la respuesta en la situación.',
        'Compara dos formas de resolver y encuentra semejanzas.',
        'Localiza y corrige un error en un procedimiento.',
        'Cambia un dato y resuelve la nueva situación.',
        'Plantea un problema parecido y explica cómo resolverlo.'
      ];
    }else if(area==='Comunicación'||/Castellano|Inglés/.test(area)){
      steps=early?[
        'Observa el título o las imágenes y anticipa de qué tratará el texto.',
        'Escucha o lee el texto con apoyo y señala de quién o de qué habla.',
        'Ubica una información que aparece claramente en el texto.',
        'Ordena con dibujos dos o tres hechos o ideas del texto.',
        'Explica con tus palabras una idea importante.',
        'Relaciona una imagen con la parte del texto que corresponde.',
        'Formula una pregunta sobre lo leído o escuchado.',
        'Cuenta a un compañero lo que comprendiste.',
        'Produce una frase o dibujo para comunicar la idea principal.',
        'Revisa si tu producción comunica lo que querías decir.'
      ]:[
        'Anticipa el propósito comunicativo a partir del título y del contexto.',
        'Identifica la información explícita que responde a la pregunta central.',
        'Organiza las ideas principales y secundarias del texto.',
        'Explica una relación entre dos ideas usando evidencias del texto.',
        'Interpreta una información que no está expresada literalmente.',
        'Distingue un hecho de una opinión o interpretación.',
        'Contrasta dos informaciones y señala coincidencias y diferencias.',
        'Elabora un texto o exposición para un destinatario definido.',
        'Revisa la coherencia y claridad de tu producción con criterios.',
        'Sustenta una conclusión citando información del texto trabajado.'
      ];
    }else if(area==='Ciencia y Tecnología'){
      steps=early?[
        'Observa un objeto o fenómeno relacionado con el tema y descríbelo.',
        'Señala qué te gustaría averiguar.',
        'Expresa con un dibujo lo que crees que ocurrirá.',
        'Observa o manipula materiales seguros siguiendo indicaciones.',
        'Dibuja o marca lo que sucedió.',
        'Compara lo que pensabas con lo que observaste.',
        'Menciona una semejanza o diferencia visible.',
        'Cuenta qué hiciste para averiguar la respuesta.',
        'Explica un cuidado necesario al trabajar con materiales.',
        'Comunica con palabras o dibujos qué descubriste.'
      ]:[
        'Describe el fenómeno y formula una pregunta investigable.',
        'Diferencia lo observado de una explicación posible.',
        'Propón una predicción que pueda contrastarse con evidencias.',
        'Organiza un procedimiento de observación o indagación seguro.',
        'Registra los resultados en una tabla, dibujo o esquema.',
        'Compara los datos obtenidos con tu predicción inicial.',
        'Identifica patrones, cambios o diferencias en los resultados.',
        'Explica una conclusión usando evidencias registradas.',
        'Señala una limitación del procedimiento y cómo mejorarla.',
        'Comunica los hallazgos y distingue lo comprobado de lo pendiente.'
      ];
    }else{
      steps=early?[
        'Observa una situación cercana y describe lo que reconoces.',
        'Cuenta una experiencia o conocimiento previo relacionado.',
        'Señala una pregunta que te gustaría resolver.',
        'Representa con dibujo u objetos una idea importante.',
        'Compara dos elementos y menciona una diferencia.',
        'Escucha a un compañero y responde con respeto.',
        'Ordena dos o tres acciones que realizaste.',
        'Explica con tus palabras qué aprendiste.',
        'Propón una acción sencilla para aplicar lo aprendido.',
        'Revisa tu producción y comparte una mejora.'
      ]:[
        'Describe la situación y distingue información conocida y pendiente.',
        'Formula una pregunta pertinente al aprendizaje.',
        'Organiza la información disponible en un esquema.',
        'Compara dos perspectivas, datos o explicaciones.',
        'Analiza una causa o relación entre hechos.',
        'Sustenta una interpretación con una evidencia.',
        'Reconoce una limitación de la información disponible.',
        'Propón una acción o solución justificada.',
        'Explica cómo tu propuesta se relaciona con el producto final.',
        'Evalúa tu trabajo con el criterio y señala qué mejorarías.'
      ];
    }
    return steps[index%steps.length];
  }

  function evaluationTechnique(level,modality,area){
    if(level==='Inicial') return 'Observación de actuaciones, diálogo y producciones del niño o niña';
    if(modality==='Oral') return 'Exposición individual/grupal, diálogo o sustentación';
    if(modality==='Desempeño') return 'Observación de desempeño / tarea auténtica';
    if(modality==='Escrita') return 'Producción escrita / resolución de situaciones';
    if(area==='Comunicación') return 'Producción y comunicación oral/escrita';
    return 'Recojo de evidencias mediante actuación, producción y explicación';
  }

  function recommendedInstrument(level,modality,area,criteriaCount){
    if(level==='Inicial') return criteriaCount<=3?'Lista de cotejo':'Guía de observación';
    if(modality==='Oral') return 'Guía de observación';
    if(modality==='Desempeño') return 'Rúbrica';
    if(modality==='Escrita'&&criteriaCount<=3) return 'Lista de cotejo';
    if(area==='Comunicación'||area==='Ciencia y Tecnología'||area==='Ciencias Sociales'||area==='DPCC') return 'Rúbrica';
    return criteriaCount>=4?'Rúbrica':'Lista de cotejo';
  }

  function instrumentOptions(selected){
    var items=['Automático según evidencia','Lista de cotejo','Rúbrica','Guía de observación','Registro anecdótico','Escala de estimación','Rejilla de evaluación','Ficha de autoevaluación','Ficha de coevaluación'];
    return items.map(function(x){return '<option '+(selected===x?'selected':'')+'>'+E(x)+'</option>';}).join('');
  }

  function openAssessment(){
    var unit=activeUnit(),panel=ensureEvaluationPanel();if(!panel)return;
    var grades=(unit&&unit.grades)||state.grades||[],areas=(unit&&unit.areas)||state.areas||[];
    panel.classList.remove('hidden');
    panel.innerHTML=context(unit)+'<h2>🧪 Evaluación de unidad/proyecto</h2><p class="sub">La evaluación se construye desde criterios y evidencias. DocenteDigital sugiere una técnica e instrumento pertinente, pero el docente puede cambiarlo.</p><div class="form2"><label>Grado / edad<select id="ddAssGrade">'+grades.map(function(g){return '<option>'+E(g)+'</option>';}).join('')+'</select></label><label>Área<select id="ddAssArea">'+areas.map(function(a){return '<option>'+E(a)+'</option>';}).join('')+'</select></label><label>Modalidad<select id="ddAssType"><option>Mixta</option><option>Escrita</option><option>Oral</option><option>Desempeño</option></select></label><label>Instrumento<select id="ddAssInstrument">'+instrumentOptions('Automático según evidencia')+'</select></label><label>Número de tareas<select id="ddAssCount"><option>4</option><option selected>6</option><option>8</option><option>10</option></select></label></div><div class="actions"><button class="btn" id="ddAssCreate">✨ Construir evaluación</button></div><div id="ddAssBody" class="topgap"></div>';
    $('ddAssCreate').onclick=buildAssessment;
  }

  function buildAssessment(){
    var unit=activeUnit(),grade=$('ddAssGrade').value,area=$('ddAssArea').value,type=$('ddAssType').value,count=parseInt($('ddAssCount').value)||6,cs=criteriaFor(unit,grade,area),box=$('ddAssBody');
    if(!cs.length){box.innerHTML='<div class="notice">No hay criterios disponibles para esta área/grado.</div>';return;}
    var chosenInstrument=$('ddAssInstrument')?.value||'Automático según evidencia';
    var instrument=chosenInstrument==='Automático según evidencia'?recommendedInstrument(state.level,type,area,cs.length):chosenInstrument;
    var technique=evaluationTechnique(state.level,type,area);
    var items=[];for(var i=0;i<count;i++){var c=cs[i%cs.length];items.push({task:assessmentTask(area,grade,i,unit),criterion:c.criterion});}
    var situation=String((unit&&(unit.situationBrief||unit.situation))||'').trim();
    var product=String((unit&&(unit.selectionApproved&&unit.productTitle||unit.product))||'').trim();
    var reference='<div class="dd-assessment-reference">'+(situation?'<p><b>Situación de partida:</b> '+E(situation)+'</p>':'')+(product?'<p><b>Producto vinculado:</b> '+E(product)+'</p>':'')+'</div>';
    var body='<article class="dd-assessment-sheet"><div class="dd-material-kicker">Evaluación · '+E(area)+' · '+E(grade)+'</div><h1>'+E((unit&&unit.title)||'Evaluación de aprendizaje')+'</h1>'+reference+'<p><b>Modalidad:</b> '+E(type)+'<br><b>Técnica de recojo de evidencia:</b> '+E(technique)+'<br><b>Instrumento:</b> '+E(instrument)+'</p><p class="dd-small">Consignas diferenciadas por grado: borradores editables; el docente verifica su pertinencia, contexto y alineación con los criterios antes de aplicarlos.</p><ol>'+items.map(function(x){return '<li><p>'+E(x.task)+'</p><p class="dd-small"><b>Criterio asociado:</b> '+E(x.criterion)+'</p><div class="dd-answer-lines tall"></div></li>';}).join('')+'</ol><h2>Criterios que se observarán</h2><ul>'+cs.map(function(x){return '<li>'+E(x.criterion)+'</li>';}).join('')+'</ul><p class="dd-small"><b>Uso formativo:</b> registra la evidencia observada, contrástala con los criterios y utiliza la información para retroalimentar y decidir el siguiente paso de aprendizaje.</p></article>';
    state.lastAssessment={id:'a'+Date.now(),unitId:(unit&&unit.id)||'',unitTitle:(unit&&unit.title)||'',grade:grade,area:area,type:type,technique:technique,instrument:instrument,criteria:cs,html:body,createdAt:new Date().toISOString()};
    state.generatedAssessments.unshift(state.lastAssessment);state.generatedAssessments=state.generatedAssessments.slice(0,20);save();
    box.innerHTML='<div class="dd-editable-material" contenteditable="true" spellcheck="true">'+body+'</div><div class="actions topgap"><button class="btn" id="ddAssWord">⬇ Word</button><button class="btn alt" id="ddAssPrint">🖨 Imprimir / PDF</button></div>';
    $('ddAssWord').onclick=downloadAssessmentWord;$('ddAssPrint').onclick=function(){window.print();};
  }

  function downloadAssessmentWord(){
    var a=state.lastAssessment;if(!a)return;
    var edited=$('ddAssBody').querySelector('.dd-editable-material').innerHTML;
    if(window.DDWordExport?.downloadHtml)return window.DDWordExport.downloadHtml(a.unitTitle||'Evaluación',edited,false,'Evaluacion_'+a.area+'_'+a.grade);
    downloadBlob(wordBlob(a.unitTitle||'Evaluación',edited),cleanFileName('Evaluacion_'+a.area+'_'+a.grade)+'.doc');
  }

  function conclusion(student,recs){
    var valid=recs.filter(function(r){return r.level;});if(!valid.length)return '';
    var counts={C:0,B:0,A:0,AD:0};valid.forEach(function(r){counts[r.level]=(counts[r.level]||0)+1;});
    var dominant=['AD','A','B','C'].sort(function(a,b){return counts[b]-counts[a];})[0];
    var good=valid.find(function(r){return r.level==='AD'||r.level==='A';})||valid[0];
    var need=valid.find(function(r){return r.level==='C'||r.level==='B';})||valid[valid.length-1];
    var ev=good.evidenceNote?' Se observó que '+good.evidenceNote.charAt(0).toLowerCase()+good.evidenceNote.slice(1)+'.':'';
    var next=need.nextStep||'continuar aplicando lo aprendido en situaciones nuevas y explicar con mayor precisión las evidencias que sustentan sus respuestas';
    if(dominant==='AD')return student+' demuestra un desempeño destacado en los criterios trabajados: actúa con autonomía, sustenta sus decisiones y transfiere lo aprendido a nuevas situaciones.'+ev+' Como siguiente desafío, conviene profundizar la argumentación y asumir retos de mayor complejidad.';
    if(dominant==='A')return student+' evidencia los aprendizajes esperados en la mayoría de los criterios trabajados y explica sus decisiones de manera pertinente.'+ev+' Para seguir avanzando, se recomienda '+next+'.';
    if(dominant==='B')return student+' se encuentra en proceso de consolidar los aprendizajes previstos. Muestra avances, pero todavía requiere apoyo para sostener sus explicaciones, procedimientos o producciones con mayor autonomía.'+ev+' El siguiente paso es '+next+'.';
    return student+' requiere apoyo para evidenciar de manera consistente los aprendizajes previstos. Necesita experiencias más guiadas, ejemplos, recursos concretos o preguntas graduadas.'+ev+' Se recomienda '+next+'.';
  }

  function openConclusions(forcedGrade){
    var unit=activeUnit(),panel=ensureEvaluationPanel();if(!panel)return;
    var grades=(unit&&unit.grades)||state.grades||[],areas=(unit&&unit.areas)||state.areas||[],grade=forcedGrade||grades[0]||'';
    panel.classList.remove('hidden');
    panel.innerHTML=context(unit)+'<h2>📝 Borradores de conclusiones descriptivas</h2><p class="sub">Se construyen con las evidencias y niveles ya registrados. El docente revisa y valida cada texto antes de usarlo.</p><div class="form2"><label>Grado / edad<select id="ddConGrade">'+grades.map(function(g){return '<option '+(g===grade?'selected':'')+'>'+E(g)+'</option>';}).join('')+'</select></label><label>Área<select id="ddConArea"><option value="">Todas las áreas</option>'+areas.map(function(a){return '<option>'+E(a)+'</option>';}).join('')+'</select></label></div><div class="actions"><button class="btn" id="ddConGenerate">Generar desde registros</button></div><div id="ddConBody" class="topgap"></div>';
    $('ddConGenerate').onclick=renderConclusions;renderConclusions();
  }

  function renderConclusions(){
    var unit=activeUnit(),grade=$('ddConGrade').value,area=$('ddConArea').value,records=state.evaluationRecords.filter(function(r){return r.unitId===((unit&&unit.id)||'')&&r.grade===grade&&(!area||r.area===area);}),students=[...new Set(records.map(function(r){return r.student;}))],box=$('ddConBody');
    if(!students.length){box.innerHTML='<div class="notice">Aún no hay registros para este grado/área. Primero registra evidencias y niveles.</div>';return;}
    box.innerHTML='<div class="dd-conclusion-list">'+students.map(function(s,i){return '<article><h3>'+E(s)+'</h3><textarea data-i="'+i+'">'+E(conclusion(s,records.filter(function(r){return r.student===s;})))+'</textarea></article>';}).join('')+'</div><div class="actions"><button class="btn" id="ddConWord">⬇ Word</button><button class="btn alt" id="ddConCopy">📋 Copiar todas</button></div>';
    $('ddConWord').onclick=downloadConclusionsWord;
    $('ddConCopy').onclick=async function(){var text=[...document.querySelectorAll('#ddConBody article')].map(function(x){return x.querySelector('h3').textContent+': '+x.querySelector('textarea').value;}).join('\n\n');try{await navigator.clipboard.writeText(text);}catch(e){}};
  }

  function downloadConclusionsWord(){
    var unit=activeUnit(),cards=[...document.querySelectorAll('#ddConBody article')];
    var body='<h1>Conclusiones descriptivas</h1><p><b>'+E((unit&&unit.title)||'')+'</b></p>'+cards.map(function(x){return '<h3>'+E(x.querySelector('h3').textContent)+'</h3><p>'+E(x.querySelector('textarea').value)+'</p>';}).join('');
    if(window.DDWordExport?.downloadHtml)return window.DDWordExport.downloadHtml('Conclusiones descriptivas',body,false,'Conclusiones_'+((unit&&unit.title)||''));
    downloadBlob(wordBlob('Conclusiones descriptivas',body),cleanFileName('Conclusiones_'+((unit&&unit.title)||''))+'.doc');
  }


  function descriptor(level,criterion){
    var c=String(criterion||'').replace(/\s+/g,' ').trim();
    if(level==='AD')return 'Realiza lo esperado con autonomía y precisión, explica sus decisiones con evidencias y transfiere lo aprendido a una situación nueva.';
    if(level==='A')return 'Realiza lo esperado en el criterio de manera pertinente y explica suficientemente su procedimiento, decisión o producción.';
    if(level==='B')return 'Muestra avances parciales en el criterio, pero todavía requiere apoyo para completar, justificar o revisar su actuación con mayor autonomía.';
    return 'Requiere acompañamiento frecuente para comprender la tarea, representar lo que sabe o producir una evidencia relacionada con el criterio.';
  }

  function openRubric(){
    var unit=activeUnit(),panel=ensureEvaluationPanel();if(!panel)return;
    var grades=(unit&&unit.grades)||state.grades||[],areas=(unit&&unit.areas)||state.areas||[];
    panel.classList.remove('hidden');
    panel.innerHTML=context(unit)+'<h2>📏 Rúbrica desde mis criterios</h2><p class="sub">DocenteDigital no cambia el criterio de la planificación: solo propone descriptores observables para que el docente los revise y edite.</p><div class="form2"><label>Grado / edad<select id="ddRubGrade">'+grades.map(function(g){return '<option>'+E(g)+'</option>';}).join('')+'</select></label><label>Área<select id="ddRubArea">'+areas.map(function(a){return '<option>'+E(a)+'</option>';}).join('')+'</select></label></div><div class="actions"><button class="btn" id="ddRubBuild">✨ Construir rúbrica</button></div><div id="ddRubBody" class="topgap"></div>';
    $('ddRubBuild').onclick=buildRubric;
  }

  function buildRubric(){
    var unit=activeUnit(),grade=$('ddRubGrade').value,area=$('ddRubArea').value,cs=criteriaFor(unit,grade,area),box=$('ddRubBody');
    if(!cs.length){box.innerHTML='<div class="notice">No hay criterios disponibles para esta área/grado.</div>';return;}
    var rows=cs.map(function(x){
      return '<tr><td contenteditable="true">'+E(x.criterion)+'</td><td contenteditable="true">'+E(descriptor('AD',x.criterion))+'</td><td contenteditable="true">'+E(descriptor('A',x.criterion))+'</td><td contenteditable="true">'+E(descriptor('B',x.criterion))+'</td><td contenteditable="true">'+E(descriptor('C',x.criterion))+'</td></tr>';
    }).join('');
    var body='<article class="dd-rubric-sheet"><div class="dd-material-kicker">Rúbrica editable · '+E(area)+' · '+E(grade)+'</div><h1>'+E((unit&&unit.title)||'Rúbrica de aprendizaje')+'</h1><p><b>Evidencia relacionada:</b> '+E(cs.map(function(x){return x.evidence;}).filter(Boolean).join(' · '))+'</p><div class="dd-scroll"><table class="dd-table"><thead><tr><th>Criterio</th><th>AD</th><th>A</th><th>B</th><th>C</th></tr></thead><tbody>'+rows+'</tbody></table></div><p class="dd-small">Los descriptores son una propuesta editable. El docente valida que sean pertinentes para la evidencia y el nivel.</p></article>';
    state.lastRubric={id:'rub'+Date.now(),unitId:(unit&&unit.id)||'',unitTitle:(unit&&unit.title)||'',grade:grade,area:area,html:body,createdAt:new Date().toISOString()};save();
    box.innerHTML='<div class="dd-editable-material" contenteditable="true" spellcheck="true">'+body+'</div><div class="actions topgap"><button class="btn" id="ddRubWord">⬇ Word</button><button class="btn alt" id="ddRubPrint">🖨 Imprimir / PDF</button></div>';
    $('ddRubWord').onclick=function(){
      var html=box.querySelector('.dd-editable-material').innerHTML;
      if(window.DDWordExport?.downloadHtml)return window.DDWordExport.downloadHtml('Rúbrica',html,true,'Rubrica_'+area+'_'+grade);
      downloadBlob(wordBlob('Rúbrica',html),cleanFileName('Rubrica_'+area+'_'+grade)+'.doc');
    };
    $('ddRubPrint').onclick=function(){window.print();};
  }

  function feedbackText(student,recs){
    var valid=recs.filter(function(r){return r.level||r.evidenceNote||r.nextStep;});
    if(!valid.length)return '';
    var strongest=valid.find(function(r){return r.level==='AD'||r.level==='A';})||valid[0];
    var need=valid.find(function(r){return r.level==='C'||r.level==='B';})||valid[valid.length-1];
    var strength=strongest.evidenceNote
      ? 'Fortaleza observada: '+strongest.evidenceNote+'.'
      : 'Fortaleza observada: muestra avances en el criterio “'+strongest.criterion+'”.';
    var next=need.nextStep||('Siguiente paso: volver a intentar una tarea relacionada con “'+need.criterion+'”, explicando qué estrategia utilizó y qué evidencia sostiene su respuesta.');
    var question='Pregunta para avanzar: ¿qué cambiarías o comprobarías en un segundo intento para que tu respuesta sea más clara y sustentada?';
    return strength+' '+(next.match(/^Siguiente paso:/i)?next:'Siguiente paso: '+next+'.')+' '+question;
  }

  function openFeedback(){
    var unit=activeUnit(),panel=ensureEvaluationPanel();if(!panel)return;
    var grades=(unit&&unit.grades)||state.grades||[],areas=(unit&&unit.areas)||state.areas||[];
    panel.classList.remove('hidden');
    panel.innerHTML=context(unit)+'<h2>💬 Retroalimentación y siguiente paso</h2><p class="sub">Se construye únicamente con evidencias ya registradas. El borrador queda oculto para el estudiante hasta que el docente lo revise.</p><div class="form2"><label>Grado / edad<select id="ddFbGrade">'+grades.map(function(g){return '<option>'+E(g)+'</option>';}).join('')+'</select></label><label>Área<select id="ddFbArea"><option value="">Todas las áreas</option>'+areas.map(function(a){return '<option>'+E(a)+'</option>';}).join('')+'</select></label></div><div class="actions"><button class="btn" id="ddFbBuild">Preparar borradores</button></div><div id="ddFbBody" class="topgap"></div>';
    $('ddFbBuild').onclick=renderFeedback;
    renderFeedback();
  }

  function renderFeedback(){
    var unit=activeUnit(),grade=$('ddFbGrade')?.value||'',area=$('ddFbArea')?.value||'',records=state.evaluationRecords.filter(function(r){return r.unitId===((unit&&unit.id)||'')&&r.grade===grade&&(!area||r.area===area);}),students=[...new Set(records.map(function(r){return r.student;}))],box=$('ddFbBody');
    if(!students.length){box.innerHTML='<div class="notice">Aún no hay evidencias registradas para este grado/área. Registra primero una actuación, producción o respuesta observable.</div>';return;}
    box.innerHTML='<div class="dd-feedback-list">'+students.map(function(s){return '<article><h3>'+E(s)+'</h3><textarea>'+E(feedbackText(s,records.filter(function(r){return r.student===s;})))+'</textarea><small>Revisa, personaliza y decide si corresponde compartirlo.</small></article>';}).join('')+'</div><div class="actions"><button class="btn" id="ddFbWord">⬇ Word</button><button class="btn alt" id="ddFbCopy">📋 Copiar todos</button></div>';
    $('ddFbWord').onclick=function(){
      var cards=[...box.querySelectorAll('article')];
      var html='<h1>Retroalimentación</h1>'+cards.map(function(x){return '<h3>'+E(x.querySelector('h3').textContent)+'</h3><p>'+E(x.querySelector('textarea').value)+'</p>';}).join('');
      if(window.DDWordExport?.downloadHtml)return window.DDWordExport.downloadHtml('Retroalimentación',html,false,'Retroalimentacion_'+grade);
      downloadBlob(wordBlob('Retroalimentación',html),cleanFileName('Retroalimentacion_'+grade)+'.doc');
    };
    $('ddFbCopy').onclick=async function(){
      var text=[...box.querySelectorAll('article')].map(function(x){return x.querySelector('h3').textContent+': '+x.querySelector('textarea').value;}).join('\n\n');
      try{await navigator.clipboard.writeText(text);}catch(e){}
    };
  }

  var css=document.createElement('style');
  css.textContent='.dd-rubric-sheet{max-width:980px;margin:auto}.dd-feedback-list{display:grid;gap:10px}.dd-feedback-list article{border:1px solid #dce5df;border-radius:12px;padding:12px;background:#fff}.dd-feedback-list textarea{width:100%;min-height:110px}.dd-eval-context{display:flex;gap:8px;flex-wrap:wrap;justify-content:space-between;padding:10px 12px;background:#eef7f2;border-radius:11px;margin-bottom:12px}.dd-eval-context span{font-size:12px;color:#50665b}.dd-eval-criterion{margin:14px 0;padding:12px;border:1px solid #dce5df;border-radius:13px;background:#fbfdfc}.dd-eval-note,.dd-eval-next{min-width:210px;min-height:60px}.dd-assessment-sheet{max-width:850px;margin:auto}.dd-conclusion-list{display:grid;gap:10px}.dd-conclusion-list article{border:1px solid #dce5df;border-radius:12px;padding:12px;background:#fff}.dd-conclusion-list textarea{width:100%;min-height:115px}';
  document.head.appendChild(css);

  window.DDEvaluation={openRegister:openRegister,openAssessment:openAssessment,openConclusions:openConclusions,openRubric:openRubric,openFeedback:openFeedback,renderRegister:renderRegister,renderConclusions:renderConclusions,renderFeedback:renderFeedback};
})();