/* DocenteDigital — Sesiones Maestras Core v1
   Integra reglas del proyecto Sesiones Maestras sin mostrar la maquinaria interna.
*/
(function(){
  if(window.__ddSesionesMaestrasCoreV1)return;
  window.__ddSesionesMaestrasCoreV1=true;

  var E=function(v){return escapeHtml(v);};
  var N=function(v){return String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');};

  function gradeN(g){var m=String(g||'').match(/\d+/);return m?parseInt(m[0]):0;}

  function boardFor(session,g){
    var n=gradeN(g),spec=session.topicSpec||{},topic=spec.topic||session.title||'el aprendizaje trabajado';
    var observable=spec.observable||'las ideas y evidencias principales';
    if(session.level==='Inicial'){
      return '<b>'+E(g)+'</b><br>Idea breve: '+E(topic)+'.<br>Palabras o dibujos clave construidos con los niños a partir de lo observado.<br>Pregunta final: ¿qué descubrimos hoy?';
    }
    if(n<=2){
      return '<b>'+E(g)+'</b><br><b>Idea clave:</b> '+E(topic)+'.<br><b>Ejemplo cercano:</b> representar con dibujo, material o una frase breve una evidencia de '+E(observable)+'.<br><b>Palabras clave:</b> seleccionar 3 o 4 términos realmente usados durante la sesión.';
    }
    if(n<=4){
      return '<b>'+E(g)+'</b><br><b>Concepto / idea central:</b> explicar con palabras claras qué aprendimos sobre '+E(topic)+'.<br><b>Ejemplo:</b> recuperar una producción o procedimiento correcto de los estudiantes.<br><b>Vocabulario:</b> registrar los términos disciplinares usados y una aplicación breve.';
    }
    if(session.level==='Primaria'){
      return '<b>'+E(g)+'</b><br><b>Conclusión disciplinar:</b> formular una explicación precisa sobre '+E(topic)+' a partir de las evidencias recogidas.<br><b>Evidencia:</b> '+E(observable)+'.<br><b>Vocabulario:</b> términos propios del área.<br><b>Transferencia:</b> ¿cómo aplicaríamos esta idea en una situación diferente?';
    }
    return '<b>'+E(g)+'</b><br><b>Síntesis conceptual:</b> formular una explicación o conclusión rigurosa sobre '+E(topic)+'.<br><b>Evidencia / fuente:</b> precisar qué dato, procedimiento o producción la sustenta.<br><b>Vocabulario académico:</b> conceptos clave del área.<br><b>Transferencia:</b> plantear una nueva situación para aplicar, contrastar o cuestionar lo aprendido.';
  }

  function boardHtml(session){
    return '<div class="dd-board-grid">'+(session.grades||[]).map(function(g){return '<section>'+boardFor(session,g)+'</section>';}).join('')+'</div>';
  }

  function resourceUse(resource,session,index){
    var r=N(resource),code='MAT-'+String(index+1).padStart(2,'0');
    var moment='Desarrollo',teacher='Presenta y orienta su uso en el momento previsto.',student='Lo utiliza para representar, explorar, resolver o comunicar.',mode='Usar en aula',purpose='Apoyar el logro del propósito y recoger evidencia.';
    if(/pizarra/.test(r)){code='PIZ-01';moment='Formalización / cierre';teacher='Organiza con los estudiantes la idea, procedimiento o conclusión construida.';student='Contrasta su producción y registra la síntesis que corresponde a su grado.';mode='Uso común';purpose='Sistematizar el aprendizaje sin reemplazar la construcción previa.';}
    else if(/proyector|laptop|computadora|tableta|celular/.test(r)){code='TEC-'+String(index+1).padStart(2,'0');moment='Inicio o Desarrollo';teacher='Proyecta o muestra únicamente el recurso visual/textual citado en la actividad.';student='Observa, compara, interpreta o responde a partir del recurso.';mode='Proyectar / mostrar';purpose='Hacer visible información o una situación que no conviene describir solo de forma oral.';}
    else if(/materiales concretos|bloque|semilla|balanza|regla|cinta|tarjeta/.test(r)){code='MAN-'+String(index+1).padStart(2,'0');moment='Desarrollo';teacher='Entrega el material y plantea una acción concreta antes de explicar el procedimiento.';student='Manipula, representa, compara, mide, clasifica o comprueba según la consigna.';mode='Manipular';purpose='Construir o comprobar el aprendizaje mediante una experiencia concreta.';}
    else if(/biblioteca|libro/.test(r)){code='TXT-'+String(index+1).padStart(2,'0');moment='Desarrollo';teacher='Selecciona el texto o fuente pertinente y formula una consigna de búsqueda o contraste.';student='Lee, identifica información y la usa para responder, comparar o sustentar.';mode='Leer / consultar';purpose='Contrastar ideas con una fuente pertinente.';}
    else if(/papelote|cartulina/.test(r)){code='PROD-'+String(index+1).padStart(2,'0');moment='Desarrollo / socialización';teacher='Entrega el soporte con una consigna de producción definida.';student='Organiza y comunica una producción colectiva o por grado.';mode='Producir / exponer';purpose='Hacer visible el razonamiento y facilitar la socialización.';}
    return {code:code,resource:resource,grade:(session.grades||[]).join(', '),moment:moment,teacher:teacher,student:student,mode:mode,purpose:purpose};
  }

  function selectedVisual(){
    try{return JSON.parse(localStorage.getItem('docenteDigitalSelectedResource')||'null');}catch(e){return null;}
  }

  function resourcePlan(session){
    var list=(session.resourcesList||[]).slice();
    var rows=list.map(function(r,i){return resourceUse(r,session,i);});
    var v=selectedVisual();
    if(v&&v.previewUrl){
      rows.unshift({code:'IMG-PROB-01',resource:v.title||'Recurso visual seleccionado',grade:(session.grades||[]).join(', '),moment:'Inicio / problematización',teacher:'Muestra la imagen y formula preguntas de observación, anticipación o comparación sin revelar la respuesta.',student:'Observa, identifica indicios, formula ideas iniciales y las retoma durante el desarrollo.',mode:'Proyectar o imprimir',purpose:'Provocar curiosidad, recuperar saberes y generar una pregunta auténtica.'});
    }
    return rows;
  }

  function resourceTable(session){
    var rows=resourcePlan(session);
    if(!rows.length)return '<p>No se añade ningún recurso extra porque no existe un uso pedagógico definido.</p>';
    return '<div class="dd-scroll"><table class="dd-table"><thead><tr><th>Código</th><th>Recurso</th><th>Grado</th><th>Momento</th><th>Acción docente</th><th>Acción estudiante</th><th>Modalidad</th><th>Finalidad</th></tr></thead><tbody>'+rows.map(function(x){return '<tr><td><b>'+E(x.code)+'</b></td><td>'+E(x.resource)+'</td><td>'+E(x.grade)+'</td><td>'+E(x.moment)+'</td><td>'+E(x.teacher)+'</td><td>'+E(x.student)+'</td><td>'+E(x.mode)+'</td><td>'+E(x.purpose)+'</td></tr>';}).join('')+'</tbody></table></div>';
  }

  function compactResources(session){
    var rows=resourcePlan(session);
    return rows.length?'<ul>'+rows.map(function(x){return '<li><b>'+E(x.code)+':</b> '+E(x.resource)+' — '+E(x.moment)+'.</li>';}).join('')+'</ul>':'<p>Solo se utilizarán los materiales básicos definidos en la actividad.</p>';
  }

  function internalAudit(session){
    var audit={
      noUnitSituationSection:true,
      coherentPurposeCriterionEvidence:Boolean(session.purpose&&session.criterion&&session.evidence&&session.instrument),
      differentiated:Boolean((session.grades||[]).length),
      exactResources:resourcePlan(session).every(function(x){return x.moment&&x.purpose&&x.teacher&&x.student;}),
      boardByGrade:(session.grades||[]).length>0,
      checkedAt:new Date().toISOString()
    };
    try{
      var all=JSON.parse(localStorage.getItem('ddSesionesMaestrasAudit')||'{}');
      all[session.id]=audit;localStorage.setItem('ddSesionesMaestrasAudit',JSON.stringify(all));
    }catch(e){}
    return audit;
  }

  var base=window.sessionHtml;
  if(typeof base==='function'){
    window.sessionHtml=function(session,forWord){
      var html=base.apply(this,arguments);
      internalAudit(session);

      html=html.replace(/<h2>8\. FORMALIZACIÓN PARA PIZARRA<\/h2>[\s\S]*?(?=<h2>9\. MATERIALES \/ ANEXOS<\/h2>)/,'');
      html=html.replace(/<h2>9\. MATERIALES \/ ANEXOS<\/h2>[\s\S]*?(?=<\/div>\s*$)/,'');

      var tail='<h2>8. RECURSOS Y MATERIALES REALMENTE UTILIZADOS</h2>'+compactResources(session)+
        '<h2>9. MATRIZ DE USO DE RECURSOS</h2>'+resourceTable(session)+
        '<h2>10. '+(session.level==='Inicial'?'SISTEMATIZACIÓN BREVE DEL APRENDIZAJE':'PARA PIZARRA / SISTEMATIZACIÓN POR GRADO')+'</h2>'+boardHtml(session);

      if(/<\/div>\s*$/.test(html))html=html.replace(/<\/div>\s*$/,tail+'</div>');
      else html+=tail;
      return html;
    };
  }

  var css=document.createElement('style');
  css.textContent='.dd-board-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.dd-board-grid section{border:1px solid #d9e4de;border-radius:11px;padding:11px;background:#fbfdfc;line-height:1.45}@media(max-width:700px){.dd-board-grid{grid-template-columns:1fr}}';
  document.head.appendChild(css);

  window.DDSesionesMaestrasCore={resourcePlan:resourcePlan,resourceTable:resourceTable,boardHtml:boardHtml};
})();