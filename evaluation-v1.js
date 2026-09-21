/* DocenteDigital — Evaluación v1 */
(function(){
  if(window.__ddEvaluationV1)return;
  window.__ddEvaluationV1=true;

  var $=function(id){return document.getElementById(id);};
  var E=function(v){return escapeHtml(v);};

  state.evaluationRecords=Array.isArray(state.evaluationRecords)?state.evaluationRecords:[];
  state.studentRoster=state.studentRoster&&typeof state.studentRoster==='object'?state.studentRoster:{};
  state.generatedAssessments=Array.isArray(state.generatedAssessments)?state.generatedAssessments:[];
  save();

  function activeUnit(){
    return (state.units||[]).find(function(u){return u.id===state.activeUnitId;})||(state.units||[])[0]||null;
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
    var out=[];
    purposes(unit).filter(function(p){return !area||p.area===area;}).forEach(function(p){
      var c=(p.criteria||[]).find(function(x){return String(x.grade)===String(grade);})||(p.criteria||[])[0];
      if(c&&c.text)out.push({area:p.area,criterion:c.text,evidence:p.evidence||'',instrument:p.instrument||''});
    });
    if(!out.length&&state.lastSession){
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
    var unit=activeUnit(),panel=$('evaluationPanel');if(!panel)return;
    var grades=(unit&&unit.grades)||state.grades||[],areas=(unit&&unit.areas)||state.areas||[];
    panel.classList.remove('hidden');
    panel.innerHTML=context(unit)+'<h2>📋 Registro de evaluación</h2><p class="sub">Los criterios se recuperan de la planificación. El docente registra la evidencia observada; DocenteDigital no inventa resultados.</p><div class="form2"><label>Grado / edad<select id="ddEvalGrade">'+grades.map(function(g){return '<option>'+E(g)+'</option>';}).join('')+'</select></label><label>Área<select id="ddEvalArea"><option value="">Todas las áreas</option>'+areas.map(function(a){return '<option>'+E(a)+'</option>';}).join('')+'</select></label></div><div class="actions"><button class="btn alt" id="ddEvalRoster">👥 Editar estudiantes</button><button class="btn" id="ddEvalLoad">Cargar criterios</button></div><div id="ddEvalBody" class="topgap"></div>';
    $('ddEvalLoad').onclick=renderRegister;
    $('ddEvalRoster').onclick=editRoster;
    renderRegister();
  }

  function editRoster(){
    var grade=$('ddEvalGrade').value,list=roster(grade),box=$('ddEvalBody');
    box.innerHTML='<h3>Estudiantes · '+E(grade)+'</h3><p class="sub">Escribe un nombre por línea.</p><textarea id="ddRosterText" style="width:100%;min-height:220px">'+E(list.join('\n'))+'</textarea><div class="actions"><button class="btn" id="ddRosterSave">💾 Guardar lista</button><button class="btn ghost" id="ddRosterCancel">Cancelar</button></div>';
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
      html+='<section class="dd-eval-criterion"><h3>'+E(c.area)+'</h3><p><b>Criterio:</b> '+E(c.criterion)+'</p><p class="dd-small"><b>Evidencia esperada:</b> '+E(c.evidence)+' · <b>Instrumento:</b> '+E(c.instrument)+'</p><div class="dd-scroll"><table class="dd-table"><thead><tr><th>Estudiante</th><th>Nivel</th><th>Evidencia observada</th><th>Siguiente paso</th></tr></thead><tbody>'+rows+'</tbody></table></div></section>';
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
    var csv=all.map(function(row){return row.map(function(v){return '"'+String(v||'').replace(/"/g,'""')+'"';}).join(',');}).join('\n');
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

  function assessmentTask(area,criterion,grade){
    var d=difficulty(grade);
    if(area==='Matemática')return 'Resuelve una situación nueva vinculada con el aprendizaje trabajado. Representa los datos, elige una estrategia, resuelve, comprueba y explica por qué tu respuesta tiene sentido. Nivel esperado: '+d+'.';
    if(area==='Comunicación'||/Castellano|Inglés/.test(area))return 'Lee, escucha o produce un texto breve relacionado con el tema trabajado. Identifica el propósito, organiza la información relevante y justifica sus decisiones con evidencias. Nivel esperado: '+d+'.';
    if(area==='Ciencia y Tecnología')return 'Analiza una observación, registro o conjunto breve de datos. Formula una explicación o conclusión y señala qué evidencia la sustenta. Nivel esperado: '+d+'.';
    if(area==='Personal Social'||area==='Ciencias Sociales'||area==='DPCC')return 'Analiza una situación relacionada con el aprendizaje trabajado y sustenta una propuesta o conclusión usando criterios y evidencias. Nivel esperado: '+d+'.';
    return 'Realiza una actuación o producción que permita demostrar el criterio: “'+criterion+'”. Explica qué hiciste, qué decisiones tomaste y qué evidencia muestra tu aprendizaje. Nivel esperado: '+d+'.';
  }

  function openAssessment(){
    var unit=activeUnit(),panel=$('evaluationPanel');if(!panel)return;
    var grades=(unit&&unit.grades)||state.grades||[],areas=(unit&&unit.areas)||state.areas||[];
    panel.classList.remove('hidden');
    panel.innerHTML=context(unit)+'<h2>🧪 Evaluación de unidad/proyecto</h2><div class="form2"><label>Grado / edad<select id="ddAssGrade">'+grades.map(function(g){return '<option>'+E(g)+'</option>';}).join('')+'</select></label><label>Área<select id="ddAssArea">'+areas.map(function(a){return '<option>'+E(a)+'</option>';}).join('')+'</select></label><label>Modalidad<select id="ddAssType"><option>Mixta</option><option>Escrita</option><option>Oral</option><option>Desempeño</option></select></label><label>Número de tareas<select id="ddAssCount"><option>4</option><option selected>6</option><option>8</option><option>10</option></select></label></div><div class="actions"><button class="btn" id="ddAssCreate">✨ Construir evaluación</button></div><div id="ddAssBody" class="topgap"></div>';
    $('ddAssCreate').onclick=buildAssessment;
  }

  function buildAssessment(){
    var unit=activeUnit(),grade=$('ddAssGrade').value,area=$('ddAssArea').value,type=$('ddAssType').value,count=parseInt($('ddAssCount').value)||6,cs=criteriaFor(unit,grade,area),box=$('ddAssBody');
    if(!cs.length){box.innerHTML='<div class="notice">No hay criterios disponibles para esta área/grado.</div>';return;}
    var items=[];for(var i=0;i<count;i++){var c=cs[i%cs.length];items.push(assessmentTask(area,c.criterion,grade));}
    var body='<article class="dd-assessment-sheet"><div class="dd-material-kicker">Evaluación · '+E(area)+' · '+E(grade)+'</div><h1>'+E((unit&&unit.title)||'Evaluación de aprendizaje')+'</h1><p><b>Modalidad:</b> '+E(type)+'</p><ol>'+items.map(function(x){return '<li><p>'+E(x)+'</p><div class="dd-answer-lines tall"></div></li>';}).join('')+'</ol><h2>Criterios que se observarán</h2><ul>'+cs.map(function(x){return '<li>'+E(x.criterion)+'</li>';}).join('')+'</ul></article>';
    state.lastAssessment={id:'a'+Date.now(),unitId:(unit&&unit.id)||'',unitTitle:(unit&&unit.title)||'',grade:grade,area:area,type:type,criteria:cs,html:body,createdAt:new Date().toISOString()};
    state.generatedAssessments.unshift(state.lastAssessment);state.generatedAssessments=state.generatedAssessments.slice(0,20);save();
    box.innerHTML='<div class="dd-editable-material" contenteditable="true" spellcheck="true">'+body+'</div><div class="actions topgap"><button class="btn" id="ddAssWord">⬇ Word</button><button class="btn alt" id="ddAssPrint">🖨 Imprimir / PDF</button></div>';
    $('ddAssWord').onclick=downloadAssessmentWord;$('ddAssPrint').onclick=function(){window.print();};
  }

  function downloadAssessmentWord(){
    var a=state.lastAssessment;if(!a)return;
    var edited=$('ddAssBody').querySelector('.dd-editable-material').innerHTML;
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
    var unit=activeUnit(),panel=$('evaluationPanel');if(!panel)return;
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
    downloadBlob(wordBlob('Conclusiones descriptivas',body),cleanFileName('Conclusiones_'+((unit&&unit.title)||''))+'.doc');
  }

  var css=document.createElement('style');
  css.textContent='.dd-eval-context{display:flex;gap:8px;flex-wrap:wrap;justify-content:space-between;padding:10px 12px;background:#eef7f2;border-radius:11px;margin-bottom:12px}.dd-eval-context span{font-size:12px;color:#50665b}.dd-eval-criterion{margin:14px 0;padding:12px;border:1px solid #dce5df;border-radius:13px;background:#fbfdfc}.dd-eval-note,.dd-eval-next{min-width:210px;min-height:60px}.dd-assessment-sheet{max-width:850px;margin:auto}.dd-conclusion-list{display:grid;gap:10px}.dd-conclusion-list article{border:1px solid #dce5df;border-radius:12px;padding:12px;background:#fff}.dd-conclusion-list textarea{width:100%;min-height:115px}';
  document.head.appendChild(css);

  window.DDEvaluation={openRegister:openRegister,openAssessment:openAssessment,openConclusions:openConclusions,renderRegister:renderRegister,renderConclusions:renderConclusions};
})();