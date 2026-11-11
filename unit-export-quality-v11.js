/* DocenteDigital Fase 11: corrección de calidad observable en exportación y vista.
   Primaria: conserva decisiones del docente; no inventa desempeños literales ni horario.
   Se aplica al vuelo incluso a unidades ya creadas, sin reescribir el historial. */
(function(){
  if(window.__ddUnitExportQualityV11)return;
  window.__ddUnitExportQualityV11=true;
  const esc=v=>typeof window.escapeHtml==='function'?window.escapeHtml(String(v??'')):
    String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clean=v=>String(v??'').replace(/\s+/g,' ').trim();
  const lower=v=>clean(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const limit=(s,n=130)=>{s=clean(s);return s.length>n?s.slice(0,n).replace(/\s+\S*$/,'')+'…':s;};
  const gradeNum=g=>Number((String(g).match(/\d+/)||[])[0]||0);
  const cycle=n=>n<=2?'III':n<=4?'IV':'V';
  const days=['Lunes','Martes','Miércoles','Jueves','Viernes'];
  function situation(u){
    const authored=clean(u?.situationBrief),selected=clean(u?.situation);
    if(/^Un hecho relacionado con\s*[“"]/.test(selected) || /llam[oó] la atenci[oó]n de los estudiantes de nuestra comunidad/i.test(selected)) {
      if(authored.length>=100)return authored;
      const quote=selected.match(/Un hecho relacionado con\s*[“"]([\s\S]*?)[”"]/);
      if(quote?.[1])return clean(quote[1]);
    }
    const result=selected||authored||'Situación por completar y confirmar con el docente.';
    // Limpiar la concatenación de DOS plantillas detectada en la prueba de
    // 2.º grado, solo cuando NO fue redactada manualmente por el docente.
    let displayed=result;
    if(u?.selectedSituationSource!=='Docente'
       &&/^En nuestra comunidad,\s*En una actividad de aula,/i.test(displayed)){
      displayed=displayed.replace(/^En nuestra comunidad,\s*(?=En una actividad de aula,)/i,'');
      displayed=displayed.replace(/\s*forma parte de la experiencia de los estudiantes de\s+\d+\.\s*[º°]\.?(?:\s*Aunque conocen algunos aspectos[\s\S]*)?$/i,'').trim();
    }
    // La pregunta retadora se muestra una sola vez, en su campo propio.
    // No modifica la situación guardada por el docente.
    if(clean(u?.reto))return displayed.replace(/\s+El reto\s+(?:será|es|central será)\s*:\s*¿[^?]{10,500}\?\s*$/i,'').trim()||displayed;
    return displayed;
  }
  function competences(u,area,title){
    const core=window.DD_OFFICIAL_CURRICULUM;
    // No presentar la primera competencia de una lista como si fuera
    // una selección curricular comprobada cuando el título es ambiguo.
    if(u.level==='Primaria'){
      const classifier=area==='Matemática'?'mathematicsModeFromTitle'
        :area==='Personal Social'?'personalSocialModeFromTitle'
        :area==='Ciencia y Tecnología'?'scienceModeFromTitle'
        :area==='Comunicación'?'communicationModeFromTitle':null;
      if(classifier&&typeof core?.[classifier]==='function'
         &&core[classifier](title)==='indefinido')
        return 'Competencia por seleccionar y confirmar con el CNEB';
    }
    const c=core?.pickCompetence?.(u.level,area,title);
    return c?.name||'Competencia por identificar y confirmar';
  }
  function teacherTitle(u){
    const raw=String(u?.situationBrief||'').replace(/\*\*/g,'').replace(/__+/g,'');
    const m=raw.match(/\bT[ií]tulo\s*:\s*([\s\S]{5,240}?)(?=\s+(?:Nivel|Grado|Duraci[oó]n|[AÁ]reas?\s+curriculares?|Contexto|Pregunta\s+(?:retadora|desafiante)|Producto\s+final)\s*:|\n|$)/i);
    return m?clean(m[1]).replace(/[.;\s]+$/,''):'';
  }
  function cleanProduct(u){
    // La última selección confirmada del docente prevalece sobre un
    // producto genérico heredado. No alterar productos no confirmados.
    const chosen=clean(u?.productTitle);
    const validChosen=!!u?.selectionApproved&&!!chosen
      && !/^(?:Producto final|Producto final indicado por el docente|Producto propuesto por el docente|Por confirmar con el docente)$/i.test(chosen);
    const product=(validChosen?chosen:clean(u?.product))||'Por confirmar con el docente';
    return product.replace(/(?:\.|\s)\s*Organizaci[oó]n\s+de\s+actividades\s*:?[\s\S]*$/i,'').replace(/[.;\s]+$/,'')||product;
  }
  function teacherChallenge(u){
    const raw=String(u?.situationBrief||'').replace(/\*\*/g,'').replace(/__+/g,'');
    const match=raw.match(/\bPregunta\s+(?:retadora|desafiante)\s*:\s*(¿[^?\n]{12,500}\?)/i);
    return match?clean(match[1]):'';
  }
  function challenge(u){
    return teacherChallenge(u)||clean(u?.reto)||'Por confirmar con el docente';
  }
  function strand(area,title){
    const t=lower(title);
    if(area==='Comunicación'){
      // Primero identificar la ACCIÓN del estudiante. «Revisamos textos» es
      // escritura, aunque el título contenga la palabra «textos».
      if(/revis|mejor|corrig|reescrib|edit/.test(t)&&/texto|borrador|mensaje|afiche|escrit|producc|campana/.test(t))return 'escritura';
      if(/escrib|produc|redact|planificamos un texto|rotulo|cartel|borrador/.test(t))return 'escritura';
      if(/leer|leemos|lectura|texto|comprende|interpretamos|informacion|contrastamos fuentes|organizamos informacion/.test(t))return 'lectura';
      return 'oralidad';
    }
    if(area==='Matemática')return /dato|graf|encuesta|tabla|estad|probab/.test(t)?'datos':/perimetr|area|figura|mapa|croquis|forma|geometr/.test(t)?'forma':/patron|equiv|regular|sucesion/.test(t)?'regularidad':'cantidad';
    if(area==='Personal Social'){const mode=window.DD_OFFICIAL_CURRICULUM?.personalSocialModeFromTitle?.(title);if(mode&&mode!=='indefinido')return mode==='economia'?'economía':mode;return /antes|ahora|pasado|histori|cambio|permanencia|fuente|memoria|tradicion/.test(t)?'historia':/dinero|presupuesto|ahorro|consumo|compra/.test(t)?'economía':/espacio|ambiente|territor|croquis|riesgo/.test(t)?'ambiente':'convivencia';}
    if(area==='Ciencia y Tecnología')return /diseñ|constru|prototipo|solucion tecnol/.test(t)?'diseña':/explica|causa|por que/.test(t)?'explica':'indaga';
    return 'general';
  }
  function gradeAction(area,title,grade){
    const n=gradeNum(grade),s=strand(area,title);
    if(!n)return 'Definir una actuación observable para la edad o grado seleccionado.';
    if(area==='Comunicación'){
      if(s==='escritura'&&/revis|mejor|corrig|reescrib|edit/.test(lower(title))){
        return n<=2?'Revisa con apoyo si su texto comunica la idea y realiza una mejora visible.'
          :n<=4?'Revisa la claridad y organización del texto para su destinatario e incorpora mejoras.'
          :'Revisa la coherencia, la adecuación al destinatario y el uso de fuentes; justifica las mejoras de su texto.';
      }
      if(s==='escritura'&&/redact|escrib|borrador|produc/.test(lower(title))){
        return n<=2?'Escribe un mensaje breve con apoyo para comunicar una idea relevante.'
          :n<=4?'Organiza y escribe un texto adecuado al destinatario utilizando información pertinente.'
          :'Redacta mensajes coherentes y argumentados, adecuados al destinatario y respaldados por fuentes verificadas.';
      }
      if(s==='lectura')return n<=2?'Identifica información explícita con imágenes y explica oralmente una idea del texto.':n<=4?'Localiza información relevante y explica con sus palabras la idea principal del texto.':'Contrasta información del texto, infiere una idea y la sustenta con detalles leídos.';
      if(s==='escritura')return n<=2?'Produce un rótulo o frase comprensible con apoyo y revisa si comunica su intención.':n<=4?'Organiza y escribe un texto breve para un destinatario y revisa su claridad.':'Planifica, redacta y revisa un texto coherente usando información de fuentes.';
      return n<=2?'Comunica una idea y escucha respetuosamente a sus compañeros.':n<=4?'Organiza un relato oral y responde preguntas relacionadas con el tema.':'Sustenta oralmente una explicación con razones y responde preguntas.';
    }
    if(area==='Matemática'){
      const t=lower(title);
      if(s==='datos'&&/planteamos preguntas|formulamos preguntas/.test(t))
        return n<=2?'Plantea preguntas sencillas para recoger datos con apoyo.'
          :n<=4?'Formula preguntas y determina qué datos debe recoger para responderlas.'
          :'Formula preguntas de investigación estadística, identifica variables pertinentes y justifica los datos necesarios.';
      if(s==='datos'&&/recogemos y registramos|registramos datos/.test(t))
        return n<=2?'Registra conteos en un pictograma sencillo con dibujos o marcas de apoyo.'
          :n<=4?'Registra datos en tablas y comprueba que los conteos sean correctos.'
          :'Registra y organiza datos de una investigación, verifica su consistencia y explica cómo se recogieron.';
      if(s==='cantidad'&&/contamos y comparamos cantidades|comparamos cantidades/.test(t)&&n>=5)
        return 'Estima, calcula y compara cantidades con unidades pertinentes al contexto, explicando y verificando procedimientos.';
      if(s==='datos')return n<=2?'Organiza conteos en un pictograma sencillo y comenta qué categoría tiene más.':n<=4?'Registra datos en una tabla y compara sus frecuencias con un gráfico.':'Representa datos, interpreta diferencias y sustenta una conclusión.';
      if(s==='forma')return n<=2?'Identifica y representa formas o recorridos con objetos y dibujos.':n<=4?'Elabora croquis o mide y compara longitudes explicando cómo lo hizo.':'Aplica medidas y representaciones espaciales para resolver y verificar un problema.';
      if(s==='regularidad')return n<=2?'Continúa un patrón con material concreto y explica su regla.':n<=4?'Identifica la regla de una secuencia y verifica sus resultados.':'Modela relaciones, compara procedimientos y justifica equivalencias.';
      return n<=2?'Resuelve un problema con material concreto o dibujos y explica su reparto o conteo.':n<=4?'Elige operaciones para resolver el problema y comprueba el procedimiento.':'Modela la situación, compara estrategias y justifica el resultado.';
    }
    if(area==='Personal Social'){
      if(s==='historia')return n<=2?'Describe semejanzas o diferencias entre dos testimonios o imágenes del pasado y presente.':n<=4?'Ordena hechos y distingue cambios y permanencias apoyándose en fuentes.':'Contrasta dos fuentes, explica cambios y permanencias y diferencia hechos de opiniones.';
      if(s==='economía')return n<=2?'Distingue necesidades y decisiones de consumo en un caso cercano.':n<=4?'Explica decisiones de uso responsable de recursos con ejemplos.':'Compara opciones de gasto y ahorro, y argumenta decisiones responsables.';
      if(s==='ambiente')return n<=2?'Reconoce una situación del entorno y propone una acción de cuidado.':n<=4?'Interpreta información del espacio y propone una acción ambiental.':'Analiza causas y consecuencias de un problema territorial y sustenta una propuesta.';
      return n<=2?'Escucha experiencias y propone un acuerdo sencillo de convivencia.':n<=4?'Explica un acuerdo y participa respetando opiniones distintas.':'Delibera con argumentos y propone acciones para el bien común.';
    }
    if(area==='Ciencia y Tecnología'){
      const t=lower(title);
      if(s==='indaga'&&/formulamos preguntas investigables|planteamos preguntas investigables/.test(t))
        return n<=2?'Plantea con apoyo una pregunta sobre lo observado.'
          :n<=4?'Formula una pregunta investigable e identifica qué necesita observar.'
          :'Formula una pregunta investigable e identifica factores y variables relevantes para recoger evidencias.';
      if(s==='indaga'&&/predicciones/.test(t)&&!/datos|resultados/.test(t))
        return n<=2?'Expresa con apoyo lo que cree que ocurrirá antes de observar.'
          :n<=4?'Formula una predicción vinculada con su pregunta y explica por qué la propone.'
          :'Formula una hipótesis o predicción justificada y reconoce qué evidencias permitirían contrastarla.';
      if(s==='indaga'&&/comparamos los datos|predicciones/.test(t)&&/datos/.test(t))
        return n<=2?'Compara lo que observó con lo que había pensado.'
          :n<=4?'Compara los datos registrados con su predicción y comunica diferencias.'
          :'Analiza datos, los contrasta con sus predicciones y fundamenta una conclusión o nueva pregunta.';
      if(s==='indaga'&&/seleccionamos evidencias|seleccionamos resultados/.test(t))
        return n<=2?'Escoge observaciones que apoyen su explicación.'
          :n<=4?'Selecciona registros pertinentes y explica qué muestran.'
          :'Selecciona evidencias científicas pertinentes, justifica su confiabilidad y sustenta recomendaciones.';
      if(s==='diseña')return n<=2?'Representa una posible solución con un dibujo y prueba su funcionamiento.':n<=4?'Diseña un modelo, lo pone a prueba y registra una mejora.':'Justifica un diseño, evalúa pruebas y modifica el prototipo según evidencias.';
      if(s==='explica')return n<=2?'Describe el fenómeno observado con ejemplos y palabras propias.':n<=4?'Relaciona causas y efectos utilizando observaciones y fuentes.':'Elabora una explicación sustentada en conocimientos y evidencias.';
      return n<=2?'Plantea una pregunta, observa y registra mediante dibujos lo que encontró.':n<=4?'Formula una predicción, registra datos y los compara con lo esperado.':'Define variables pertinentes, analiza datos y sustenta una conclusión.';
    }
    if(area==='Arte y Cultura'){
      const appreciation=/exploramos manifestaciones|apreciamos|observamos manifestaciones|analizamos expresiones art[ií]sticas/.test(lower(title));
      if(appreciation)return n<=2?'Describe con ejemplos lo que observa y siente ante una manifestación artística.':n<=4?'Describe elementos de una manifestación artística y explica qué ideas o emociones comunica.':'Interpreta manifestaciones artístico-culturales y sustenta su apreciación con elementos observables y contexto.';
      return n<=2?'Explora materiales y crea una producción artística sencilla para expresar una idea.':n<=4?'Selecciona materiales y lenguajes artísticos y explica decisiones de su creación.':'Combina recursos artísticos para comunicar un mensaje y revisa su producción con criterios de expresión y destinatario.';
    }
    if(area==='Educación Física')return n<=2?'Ejecuta desplazamientos y movimientos básicos con equilibrio y cuidado de su cuerpo.':n<=4?'Coordina movimientos y ajusta sus acciones motrices según un reto y normas de seguridad.':'Controla y adapta movimientos en retos motrices, mostrando coordinación, autonomía y cuidado de su integridad.';
    if(area==='Educación Religiosa')return n<=2?'Expresa con respeto una enseñanza de su fe vinculada al buen trato.':n<=4?'Explica una enseñanza de su fe y propone una acción respetuosa de convivencia.':'Argumenta una reflexión desde su fe sobre la dignidad humana y propone compromisos concretos de respeto y solidaridad.';
    return n<=2?'Participa y comunica mediante una representación sencilla lo que aprendió.':n<=4?'Elabora una producción y explica las decisiones tomadas.':'Desarrolla una producción y argumenta sus decisiones con evidencias.';
  }
  function evidence(area,title){
    const s=strand(area,title),t=lower(title);
    if(area==='Comunicación'&&s==='escritura'&&/revis|mejor|corrig|reescrib|edit/.test(t))
      return 'Borrador con correcciones justificadas y versión mejorada';
    if(area==='Comunicación'&&s==='escritura'&&/redact|escrib|borrador|produc/.test(t))
      return 'Borrador de texto o mensaje dirigido a un destinatario';
    if(area==='Matemática'&&s==='datos'&&/planteamos preguntas|formulamos preguntas/.test(t))
      return 'Preguntas estadísticas y variables por registrar';
    if(area==='Matemática'&&s==='datos'&&/recogemos y registramos|registramos datos/.test(t))
      return 'Registro de datos verificado';
    if(area==='Ciencia y Tecnología'&&s==='indaga'&&/formulamos preguntas investigables|planteamos preguntas investigables/.test(t))
      return 'Pregunta investigable y variables propuestas';
    if(area==='Ciencia y Tecnología'&&s==='indaga'&&/predicciones/.test(t)&&!/datos/.test(t))
      return 'Predicción sustentada y plan para contrastarla';
    if(area==='Ciencia y Tecnología'&&s==='indaga'&&/comparamos los datos/.test(t))
      return 'Comparación de resultados y predicciones';
    if(area==='Ciencia y Tecnología'&&s==='indaga'&&/seleccionamos evidencias/.test(t))
      return 'Selección justificada de evidencias para recomendaciones';
    if(area==='Comunicación')return s==='lectura'?'Respuestas y organizador de lectura':s==='escritura'?'Borrador revisado y texto final':'Intervención oral registrada';
    if(area==='Matemática')return s==='datos'?'Tabla y gráfico interpretados':'Resolución con representación y explicación';
    if(area==='Personal Social')return s==='historia'?'Comparación de fuentes y línea de tiempo':'Organizador o acuerdo argumentado';
    if(area==='Ciencia y Tecnología')return s==='indaga'?'Registro de observaciones y conclusión':s==='diseña'?'Boceto, prototipo y registro de pruebas':'Explicación sustentada';
    return 'Producción o actuación observable';
  }
  function table(head,rows,weights){
    return `<table${weights?' data-col-weights="'+weights.join(',')+'"':''}><thead><tr>${head.map(s=>`<th>${esc(s)}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table>`;
  }
  function gradeRows(unit,area,title){return (unit.grades||[]).map(g=>`<b>${esc(g)}:</b> ${esc(gradeAction(area,title,g))}`).join('<br>');}
  function scheduleTable(unit,week){
    const rows=(unit.activities||[]).filter(x=>(Number(x.week)||1)===week);
    return table(['Día y horario','Área · sesión','Criterio / acción por grado','Evidencia'],rows.map((a,i)=>{
      const idx=(Number(a.order)||((week-1)*15+i+1))-1;
      const day=a.day||days[Math.floor((idx%15)/3)]||'Por confirmar';
      const time=a.time?' · '+a.time:' · Hora por confirmar';
      return `<tr><td> ${esc(day)}${esc(time)}</td><td><b>${esc(a.area)}</b><br>${esc(limit(a.title,105))}</td><td>${gradeRows(unit,a.area,a.title)}</td><td>${esc(evidence(a.area,a.title))}<br><i>${esc((unit.purposes||[]).find(p=>p.area===a.area)?.instrument||'Instrumento por definir')}</i></td></tr>`;
    }),[17,25,40,18]);
  }
  function purposeTable(unit){
    // Cada competencia debe compartir fila con su propio criterio y evidencia:
    // una única fila por área podía mezclar lectura, escritura y oralidad.
    const rows=[];
    for(const area of unit.areas||[]){
      const acts=(unit.activities||[]).filter(a=>a.area===area);
      const representatives=[],seen=new Set();
      for(const a of acts){
        const name=competences(unit,area,a.title);
        const key=name+'|'+strand(area,a.title);
        if(!seen.has(key)){seen.add(key);representatives.push({name,title:a.title});}
      }
      if(!representatives.length)representatives.push({name:'Competencia por identificar y confirmar',title:''});
      for(const item of representatives){
        const official=window.DD_OFFICIAL_CURRICULUM?.getArea?.(unit.level,area)?.find(x=>x.name===item.name);const capacities=Array.isArray(official?.capacities)?official.capacities.join('; '):'';rows.push(`<tr><td><b>${esc(area)}</b><br>${esc(item.name)}${capacities?`<br><small><b>Capacidades MINEDU:</b> ${esc(capacities)}</small>`:''}<br><i>Competencia para cotejo docente</i></td><td>${gradeRows(unit,area,item.title)}</td><td>${esc(evidence(area,item.title))}</td></tr>`);
      }
    }
    return table(['Área y competencia propuesta','Criterios orientadores por grado','Evidencia'],rows,[31,47,22]);
  }

  // Word conserva los componentes pedagógicos de la vista, sin trasladar
  // datos personales ni confundir borradores con desempeños oficiales.
  function assessmentSamples(unit){
    const entries=[],seen=new Set();
    for(const area of unit.areas||[]){
      const activities=(unit.activities||[]).filter(a=>a.area===area);
      for(const activity of activities){
        const competence=competences(unit,area,activity.title);
        const key=area+'|'+competence;
        if(seen.has(key))continue;
        seen.add(key);
        const purpose=(unit.purposes||[]).find(p=>p.area===area);
        entries.push({area,competence,activity:activity.title,
          criterion:(unit.grades||[]).map(g=>g+': '+gradeAction(area,activity.title,g)).join(' / '),
          evidence:evidence(area,activity.title),
          instrument:purpose?.instrument||'Instrumento por revisar'});
      }
    }
    return entries;
  }
  function approachesTable(unit){
    const rows=(unit.enfoques||[]).map(x=>`<tr><td>${esc(x.name||'')}</td><td>${esc(x.value||'')}</td><td>${esc(x.action||'')}</td></tr>`);
    return rows.length?table(['Enfoque transversal','Valor','Acciones observables'],rows,[26,20,54]):'<p>Enfoques por contextualizar y confirmar con el docente.</p>';
  }
  function transversalTable(unit){
    const rows=(unit.transversals||[]).map(x=>`<tr><td><b>${esc(x.name||'')}</b><br>${esc((x.capacities||[]).join('; '))}</td><td>${esc(x.application||'')}</td></tr>`);
    return rows.length?table(['Competencia transversal y capacidades','Aplicación contextualizada'],rows,[54,46]):'<p>Competencias transversales por contextualizar y confirmar.</p>';
  }
  function articulationTable(unit){
    const rows=(unit.activities||[]).map(a=>{
      const purpose=(unit.purposes||[]).find(p=>p.area===a.area);
      const gradeCriteria=(unit.grades||[]).map(g=>g+': '+gradeAction(a.area,a.title,g)).join(' / ');
      return `<tr><td><b>${esc(a.area)}</b><br>${esc(competences(unit,a.area,a.title))}</td><td>${esc(a.title)}<br><small><b>Criterio:</b> ${esc(gradeCriteria)}</small></td><td>${esc(evidence(a.area,a.title))}</td><td>${esc(purpose?.instrument||'Por definir')}</td></tr>`;
    });
    return rows.length?table(['Área y competencia','Actividad / criterio por grado','Evidencia','Instrumento'],rows,[23,42,21,14]):'<p>No existen actividades programadas.</p>';
  }
  // Descriptores orientadores de rúbrica, redactados según la actuación
  // curricular. No son desempeños MINEDU literales ni calificaciones asignadas.
  function instrumentLevels(s){
    const area=clean(s?.area),competence=lower(s?.competence),task=lower(s?.activity);
    const grade=Number((String(s?.grade||'').match(/\d+/)||[])[0]||0);
    // Para grados 1.º–4.º conservar las actuaciones de su propio criterio,
    // sin imponer a los pequeños exigencias propias del ciclo V.
    if(grade>=1&&grade<=4){
      const expected=clean(s?.criterion).replace(/^\d+\s*\.?\s*[º°]\s*:\s*/,'');
      const small=grade<=2;
      let start='Necesita apoyo para realizar la actuación prevista y comunicar qué hizo.';
      let progress='Realiza parte de la actividad y explica sus decisiones mediante preguntas de apoyo.';
      if(area==='Comunicación'){
        if(/se comunica oralmente/.test(competence)){
          start=small?'Expresa una idea breve con apoyo y necesita escuchar a sus compañeros.':'Participa y expresa ideas, pero requiere ayuda para ordenarlas o justificarlas.';
          progress=small?'Comunica ideas sencillas y responde algunas preguntas con acompañamiento.':'Explica una idea con algunos ejemplos y atiende preguntas con orientación.';
        }else if(/lee diversos tipos/.test(competence)){
          start='Localiza información del texto con ayuda de preguntas, imágenes o lectura acompañada.';
          progress='Identifica detalles y propone una interpretación sencilla con orientación.';
        }else if(/escribe diversos tipos/.test(competence)){
          start='Escribe o dicta ideas aisladas y necesita apoyo para organizarlas para un destinatario.';
          progress='Elabora un texto sencillo y revisa algunos aspectos con preguntas de apoyo.';
        }
      }else if(area==='Matemática'){
        start='Representa parcialmente datos o la situación con material y ayuda.';
        progress='Organiza algunos datos o procedimientos y explica un resultado con acompañamiento.';
      }else if(area==='Personal Social'){
        start='Reconoce una situación de convivencia, pero necesita guía para expresar su opinión.';
        progress='Expresa una opinión y propone una acción sencilla con apoyo.';
      }else if(area==='Ciencia y Tecnología'){
        start='Observa una situación y formula una pregunta con orientación.';
        progress='Registra observaciones o propone una explicación inicial con acompañamiento.';
      }else if(area==='Educación Física'){
        start='Ensaya el movimiento con acompañamiento y necesita recordar normas de seguridad.';
        progress='Coordina acciones del reto y mejora con indicaciones.';
      }else if(area==='Arte y Cultura'){
        start='Explora materiales o manifestaciones y necesita apoyo para comunicar lo que observa o crea.';
        progress='Describe o produce algunos elementos y explica decisiones con preguntas de apoyo.';
      }else if(area==='Educación Religiosa'){
        start='Reconoce un ejemplo de respeto con apoyo y necesita explicar qué significa.';
        progress='Relaciona una enseñanza de su fe con un ejemplo concreto y ayuda.';
      }
      return {C:start,B:progress,A:expected||'Criterio por completar y confirmar por grado.',
        AD:'Realiza la actuación prevista de forma autónoma, explica sus decisiones y aplica lo aprendido a otro ejemplo adecuado a su grado.'};
    }
    if(area==='Comunicación'){
      if(/se comunica oralmente/.test(competence))return {
        C:'Comunica ideas aisladas y requiere preguntas de apoyo para expresar razones y escuchar a sus compañeros.',
        B:'Presenta una idea y alguna razón, pero necesita ayuda para organizar su intervención o responder preguntas.',
        A:'Organiza su intervención, sustenta sus ideas con razones pertinentes y responde preguntas respetuosamente.',
        AD:'Contrasta argumentos con información pertinente y adapta sus explicaciones a preguntas nuevas con autonomía.'
      };
      if(/lee diversos tipos/.test(competence))return {
        C:'Identifica información explícita con apoyo; todavía no explica una inferencia sustentada en el texto.',
        B:'Reconoce información e infiere una idea con guía, pero necesita señalar detalles que la respalden.',
        A:'Contrasta información del texto, formula inferencias y las sustenta con detalles de la lectura.',
        AD:'Compara fuentes o perspectivas y justifica interpretaciones con evidencias textuales pertinentes.'
      };
      if(/escribe diversos tipos/.test(competence))return {
        C:'Redacta ideas sueltas y necesita ayuda para organizar el mensaje y reconocer al destinatario.',
        B:'Elabora un borrador comprensible y revisa algunos aspectos de coherencia con acompañamiento.',
        A:'Redacta y revisa un texto coherente, adecuado a su destinatario, y fundamenta sus mensajes.',
        AD:'Revisa con autonomía la eficacia del mensaje, justifica cambios e incorpora fuentes pertinentes.'
      };
    }
    if(area==='Matemática'&&/gesti[oó]n de datos/.test(competence)){
      if(/planteamos preguntas|formulamos preguntas/.test(task))return {
        C:'Propone preguntas vagas y necesita ayuda para precisar qué datos permitirían responderlas.',
        B:'Formula una pregunta que podría responderse con datos y reconoce alguna variable con orientación.',
        A:'Formula preguntas estadísticas, identifica variables pertinentes y justifica los datos necesarios.',
        AD:'Compara preguntas estadísticas alternativas y justifica la pertinencia de variables y formas de recojo.'
      };
      return {
        C:'Registra o representa datos con apoyo y aún no puede explicar qué muestran.',
        B:'Organiza datos y reconoce algunas diferencias, pero necesita ayuda para interpretar resultados.',
        A:'Organiza y representa los datos pertinentes, interpreta diferencias y sustenta conclusiones.',
        AD:'Compara representaciones y reconoce límites de los datos al argumentar conclusiones.'
      };
    }
    if(area==='Personal Social'){
      if(/convive y participa/.test(competence))return {
        C:'Expresa una opinión sobre la convivencia sin relacionarla claramente con derechos o acuerdos.',
        B:'Reconoce derechos o responsabilidades y ofrece algunas razones con acompañamiento.',
        A:'Delibera con argumentos, escucha puntos de vista diferentes y propone acciones para el bien común.',
        AD:'Contrasta perspectivas y justifica acuerdos viables que protegen derechos y favorecen el bien común.'
      };
      if(/interpretaciones hist[oó]ricas/.test(competence))return {
        C:'Menciona hechos del pasado sin identificar la procedencia de la información.',
        B:'Reconoce una fuente y señala cambios o permanencias con apoyo.',
        A:'Contrasta fuentes e interpreta cambios y permanencias, diferenciando hechos y opiniones.',
        AD:'Evalúa interpretaciones alternativas y justifica conclusiones mediante fuentes contrastadas.'
      };
    }
    if(area==='Ciencia y Tecnología'){
      if(/indaga mediante/.test(competence))return {
        C:'Plantea una pregunta general y requiere orientación para reconocer qué puede investigarse.',
        B:'Formula una pregunta investigable e identifica algunos factores o registros con ayuda.',
        A:'Formula una pregunta investigable, reconoce variables pertinentes y explica cómo obtener evidencias.',
        AD:'Justifica variables, controles y límites de su indagación, y plantea mejoras fundamentadas.'
      };
      if(/explica el mundo f[ií]sico/.test(competence))return {
        C:'Describe un fenómeno con ideas iniciales, pero sin vincularlas con evidencias o conocimientos científicos.',
        B:'Relaciona algunas observaciones con una explicación, aunque requiere apoyo para fundamentarla.',
        A:'Explica el fenómeno mediante conocimientos científicos y evidencias pertinentes.',
        AD:'Contrasta explicaciones y sustenta relaciones causales reconociendo límites de la evidencia.'
      };
    }
    if(area==='Arte y Cultura'){
      if(/aprecia de manera cr[ií]tica/.test(competence))return {
        C:'Describe una manifestación artística sin identificar sus elementos expresivos.',
        B:'Reconoce elementos observables y expresa una interpretación inicial con orientación.',
        A:'Interpreta una manifestación artístico-cultural y fundamenta su apreciación con elementos y contexto.',
        AD:'Contrasta interpretaciones y argumenta el sentido de la manifestación desde distintas perspectivas.'
      };
      if(/crea proyectos/.test(competence))return {
        C:'Explora recursos artísticos, pero necesita ayuda para comunicar una intención.',
        B:'Elabora una producción vinculada a una idea y explica algunas decisiones con apoyo.',
        A:'Combina recursos artísticos para comunicar su mensaje y revisa su creación con criterios.',
        AD:'Experimenta alternativas expresivas, justifica elecciones y mejora su obra para un destinatario.'
      };
    }
    if(area==='Educación Física')return {
      C:'Realiza movimientos del reto con apoyo y necesita recordar normas de seguridad.',
      B:'Coordina algunos movimientos y ajusta su actuación con indicaciones del grupo o docente.',
      A:'Adapta sus movimientos al reto, actúa con coordinación y cuida su integridad y la de los demás.',
      AD:'Ajusta autónomamente estrategias motrices y explica decisiones que favorecen una práctica segura.'
    };
    if(area==='Educación Religiosa')return {
      C:'Reconoce una enseñanza vinculada al respeto, pero aún no explica su relación con la dignidad humana.',
      B:'Relaciona una enseñanza de su fe con un ejemplo de respeto y necesita apoyo para justificarlo.',
      A:'Argumenta una reflexión desde su fe sobre la dignidad humana y propone compromisos de respeto.',
      AD:'Contrasta situaciones de convivencia y fundamenta compromisos solidarios desde su reflexión.'
    };
    return {
      C:'Requiere ayuda para mostrar una actuación observable vinculada al criterio previsto.',
      B:'Muestra parte del criterio y señala con acompañamiento qué necesita mejorar.',
      A:'Muestra la actuación prevista en el criterio y la sustenta mediante la evidencia solicitada.',
      AD:'Justifica la actuación con evidencias adicionales y explica cómo aplicarla a otra situación.'
    };
  }
  function instrumentDrafts(unit){
    // Cada grado recibe su propio criterio y cuatro niveles orientadores.
    const rows=assessmentSamples(unit).flatMap(s=>(unit.grades||[]).map(grade=>{
      const criterion=grade+': '+gradeAction(s.area,s.activity,grade);
      const levels=instrumentLevels({...s,grade,criterion});
      return `<tr><td><b>${esc(s.area)}</b><br>${esc(s.competence)}<br><small>Grado: ${esc(grade)}</small></td><td>${esc(criterion)}<br><small>Evidencia: ${esc(s.evidence)}</small></td><td><b>C – Inicio:</b> ${esc(levels.C)}<br><b>B – Proceso:</b> ${esc(levels.B)}<br><b>A – Logro esperado:</b> ${esc(levels.A)}<br><b>AD – Destacado:</b> ${esc(levels.AD)}</td></tr>`;
    }));
    return rows.length?table(['Área / competencia','Criterio y evidencia','Borrador de niveles C, B, A y AD'],rows,[24,38,38]):'<p>Faltan actividades para construir instrumentos.</p>';
  }
  function registerTemplate(unit){
    const grades=unit.grades||[];
    const rows=assessmentSamples(unit).flatMap(s=>grades.map(g=>`<tr><td>${esc(g)}<br>${esc(s.area)}<br><small>${esc(s.competence)}</small></td><td>${esc(s.criterion)}<br><small>${esc(s.evidence)}</small></td><td>C ☐ B ☐ A ☐ AD ☐</td><td>Por registrar con evidencias observadas.</td></tr>`));
    return rows.length?table(['Grado / competencia','Criterio y evidencia','Nivel','Observación / retroalimentación'],rows,[24,43,13,20]):'<p>Registro auxiliar por completar.</p>';
  }
  function qualityFlags(unit){
    const notes=[];
    const acts=unit.activities||[];
    if(acts.some(a=>!a.time))notes.push('Horarios sin registrar: verificar bloques antes de aplicar.');
    if(!unit.documentContextSnapshot?.institution)notes.push('Institución educativa por completar.');
    if(!unit.documentContextSnapshot?.teacher)notes.push('Nombre del docente por completar.');
    // No declarar pertinencia científica si una unidad de derechos solamente
    // enumera todas las áreas del perfil sin problema científico identificable.
    const textForAreas=lower((unit.situationBrief||'')+' '+(unit.situation||''));
    if(/\b(?:los derechos|derechos de la niñez|derechos de los niños)\b/.test(textForAreas)
      && (unit.areas||[]).includes('Ciencia y Tecnología')
      && !/\b(?:salud|cuerpo|ambiente|agua|alimentaci[oó]n|higiene|seres vivos|experimento|hip[oó]tesis|fen[oó]meno)\b/.test(textForAreas))
      notes.push('Ciencia y Tecnología: verificar que exista una pregunta investigable sobre fenómenos naturales; no indagar los derechos como si fueran un fenómeno científico.');
    if(teacherTitle(unit)&&lower(unit.title)!==lower(teacherTitle(unit)))
      notes.push('El título guardado no coincide con el título indicado por el docente; se recuperó la versión original para Word.');
    if(cleanProduct(unit)!==clean(unit.product)){
      if(unit.selectionApproved&&clean(unit.productTitle)&&lower(unit.productTitle)!==lower(unit.product))
        notes.push('El producto almacenado difiere del elegido por el docente; el Word prioriza la selección confirmada y requiere revisar la unidad.');
      else notes.push('El producto guardado contenía texto de instrucciones administrativas; se excluyó de Word.');
    }
    if(teacherChallenge(unit)&&unit.reto&&lower(teacherChallenge(unit))!==lower(unit.reto))
      notes.push('El reto almacenado difiere del indicado por el docente: el Word utiliza la pregunta original y requiere revisión en la plataforma.');
    if((unit.areas||[]).some(a=>!acts.some(x=>x.area===a)))notes.push('Hay áreas sin sesiones asignadas. Revisar la programación.');
    const clause=clean(unit.situationBrief||'').match(/(?:incluye|trabajaremos|[aá]reas:)([^.!?]{8,180})/i)?.[1]||'';
    const available=['Comunicación','Matemática','Personal Social','Ciencia y Tecnología','Arte y Cultura','Educación Física','Educación Religiosa'];
    const requested=available.filter(area=>lower(clause).includes(lower(area)));
    if(requested.length>=2&&(unit.areas||[]).some(area=>!requested.includes(area)))
      notes.push('La solicitud escrita menciona menos áreas que el perfil. Revisar las áreas de la unidad antes de aplicar.');
    if(acts.some(x=>!x.title||!x.area))notes.push('Existen actividades incompletas.');
    if(!acts.length)notes.push('Falta programar la secuencia de actividades.');
    const titles=new Map();
    for(const a of acts){const name=lower(a.title);if(name)titles.set(name,(titles.get(name)||0)+1);}
    const repeated=[...titles].filter(([,count])=>count>=4);
    if(repeated.length)notes.push('Hay títulos de sesiones repetidos cuatro o más veces. Revisar la progresión y evitar reiteraciones.');
    return notes;
  }
  function word(unit){
    const id=unit.documentContextSnapshot||{},activities=unit.activities||[];
    const weeks=[...new Set(activities.map(a=>Number(a.week)||1))].sort((a,b)=>a-b);
    const title=/proyecto/i.test(unit.type||'')?'PROYECTO DE APRENDIZAJE':'UNIDAD DE APRENDIZAJE';
    const general=table(['Campo','Registro','Campo','Registro'],[
      `<tr><td>I.E.</td><td>${esc(id.institution||'Por completar')}</td><td>Docente</td><td>${esc(id.teacher||'Por completar')}</td></tr>`,
      `<tr><td>Nivel</td><td>${esc(unit.level)}</td><td>Organización</td><td>${esc(unit.ieType)}</td></tr>`,
      `<tr><td>Grados / ciclos</td><td>${esc((unit.grades||[]).map(g=>`${g} (ciclo ${cycle(gradeNum(g))})`).join(' · '))}</td><td>Duración</td><td>${esc(unit.duration)}</td></tr>`
    ],[14,35,17,34]);
    const notes=qualityFlags(unit);
    const sequence=weeks.map(week=>`<h3>Semana ${week} — actividades programadas</h3>${scheduleTable(unit,week)}`).join('');
    return `<div class="dd-word-v11"><h1>${esc(title)}</h1><h2>“${esc(teacherTitle(unit)||unit.title)}”</h2>
      <h2>I. DATOS GENERALES</h2>${general}
      <h2>II. SITUACIÓN SIGNIFICATIVA, RETO Y PRODUCTO</h2><p>${esc(situation(unit))}</p>
      <p><b>Pregunta retadora:</b> ${esc(challenge(unit))}</p><p><b>Producto integrador:</b> ${esc(cleanProduct(unit))}</p>${clean(unit.productDescription)&&clean(unit.productDescription)!==cleanProduct(unit)&&(!unit.selectionApproved||lower(unit.product)===lower(cleanProduct(unit)))?`<p><b>Descripción del producto:</b> ${esc(unit.productDescription)}</p>`:''}
      <h2>III. PROPÓSITOS Y CRITERIOS ORIENTADORES</h2><p>Competencias y criterios sugeridos para revisar con el programa curricular MINEDU. Estos criterios no son desempeños oficiales literales.</p>${purposeTable(unit)}
      <h3>ENFOQUES TRANSVERSALES</h3>${approachesTable(unit)}
      <h3>COMPETENCIAS TRANSVERSALES</h3>${transversalTable(unit)}
      <h3>MATRIZ DE ARTICULACIÓN Y EVALUACIÓN</h3>${articulationTable(unit)}
      <h2>IV. RUTA PEDAGÓGICA DE LA UNIDAD</h2><p><b>Explorar y preguntar → Investigar y registrar → Organizar y crear → Comunicar y evaluar.</b> La secuencia detallada figura en las sesiones de cada semana.</p>
      <h2>V. SECUENCIA DE SESIONES</h2>${sequence}
      <h2>VI. EVALUACIÓN FORMATIVA</h2><p>Recoger evidencias durante el trabajo, compararlas con los criterios por grado, ofrecer retroalimentación y permitir mejoras del producto antes de su presentación.</p>
      ${table(['Grado','Evidencia de avance','Instrumento orientador'],(unit.grades||[]).map(g=>`<tr><td>${esc(g)}</td><td>Producción vinculada a la actividad del día</td><td>Lista de cotejo o rúbrica revisada por el docente</td></tr>`),[16,47,37])}
      <h3>INSTRUMENTOS DE EVALUACIÓN — BORRADORES PARA VALIDAR</h3>${instrumentDrafts(unit)}
      <h3>REGISTRO AUXILIAR POR COMPETENCIA</h3>${registerTemplate(unit)}
      <h2>VII. ASPECTOS POR COMPLETAR</h2>${notes.length?`<ul>${notes.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'<p>Los campos esenciales se encuentran registrados. Cotejar competencias y desempeños antes de utilizar la planificación.</p>'}
      <p><i>Documento editable de apoyo. Verificar el CNEB, los desempeños por grado y la pertinencia didáctica antes de usar en aula.</i></p></div>`;
  }
  function preview(unit){
    const weeks=[...new Set((unit.activities||[]).map(a=>Number(a.week)||1))].sort((a,b)=>a-b);
    return `<h2>Secuencia de sesiones por semana (vista resumida)</h2><p><small>Los criterios son propuestas observables editables, no desempeños MINEDU literales.</small></p>${weeks.map(w=>`<h3>Semana ${w}</h3>${scheduleTable(unit,w)}`).join('')}`;
  }
  const oldWord=window.unitWordHtml;
  if(typeof oldWord==='function')window.unitWordHtml=function(unit){
    if(unit?.level!=='Primaria')return oldWord.apply(this,arguments);
    return word(unit);
  };
  const oldRender=window.renderUnitOutput;
  if(typeof oldRender==='function')window.renderUnitOutput=function(unit){
    const result=oldRender.apply(this,arguments);
    if(unit?.level==='Primaria'){
      const section=document.getElementById('dd-sesiones');
      if(section)section.innerHTML=preview(unit);
    }
    return result;
  };
  window.DD_UNIT_EXPORT_QUALITY_V11={situation,gradeAction,scheduleTable,word,qualityFlags,preview,competences,teacherTitle,cleanProduct,teacherChallenge,challenge,evidence,instrumentLevels};
})();
