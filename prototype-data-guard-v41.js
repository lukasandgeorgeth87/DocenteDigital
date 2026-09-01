/* DocenteDigital – guardia de datos prototipo v42
   Evita presentar como resultados reales datos, materiales o conclusiones que aún son demostraciones estáticas.
   No genera ni modifica evidencias, niveles de logro, conclusiones SIAGIE ni contenido en lengua originaria sin datos suficientes.
   V42 además impide crear sesiones desde unidades/actividades demostrativas cuando el docente aún no creó una unidad/proyecto real.
*/
(function(){
  if(window.__ddPrototypeDataGuardV42)return;window.__ddPrototypeDataGuardV42=true;

  const by=id=>document.getElementById(id);
  const notice=(title,body)=>`<div class="notice dd-prototype-notice"><b>🧪 ${title}</b><br>${body}</div>`;

  function markButton(selector,label){
    const btn=document.querySelector(selector);if(!btn)return;
    btn.dataset.ddPrototype='1';
    btn.setAttribute('title','Función en desarrollo: no produce datos reales todavía.');
    if(label)btn.textContent=label;
  }

  // Diagnóstico: el prototipo anterior mostraba cantidades fijas (8/4/2) sin estudiantes ni evidencias.
  window.generateDiagnostic=function(){
    const result=by('diagnosticResult');if(!result)return;
    result.innerHTML=notice(
      'Diagnóstico en desarrollo',
      'No se asignarán cantidades de estudiantes ni niveles de logro sin datos reales. Para una versión funcional se deberán registrar o importar estudiantes, competencias/criterios y evidencias antes de calcular resultados.'
    );
    result.classList.remove('hidden');
  };

  // Materiales: el prototipo anterior ignoraba el tema escrito y devolvía siempre un texto sobre agua,
  // además de frases demostrativas en quechua. Eso puede inducir a usar contenido lingüístico no validado.
  window.generateMaterial=function(){
    const out=by('materialOutput');if(!out)return;
    const text=by('materialText');
    if(text)text.textContent='';
    out.innerHTML=`<h2>Materiales</h2>${notice(
      'Generador de materiales en desarrollo',
      'Esta versión todavía no genera una lectura o ficha fiable a partir del tema y perfil lingüístico. No se mostrará contenido genérico ni traducciones demostrativas como si fueran materiales listos para usar. La lengua originaria deberá generarse con el perfil confirmado y revisión docente.'
    )}`;
    out.classList.remove('hidden');
  };

  // Evaluación: el prototipo anterior mostraba competencia, nivel B y conclusión SIAGIE fijos sin evidencia real.
  window.showEvaluation=function(kind){
    const p=by('evaluationPanel');if(!p)return;
    p.classList.remove('hidden');
    const titles={register:'📋 Registro de evaluación',unit:'🧪 Evaluación de unidad/proyecto',siagie:'📝 Conclusiones descriptivas SIAGIE'};
    const detail=kind==='siagie'
      ?'No se propondrá una conclusión descriptiva ni un nivel de logro sin estudiante, competencia, criterio, evidencia y valoración registrados. Una conclusión fija o de ejemplo no debe confundirse con información apta para SIAGIE.'
      :kind==='register'
        ?'El registro todavía no está conectado a estudiantes, criterios y evidencias persistentes. No se guardará ni mostrará un nivel de logro simulado.'
        :'La evaluación todavía no está conectada de extremo a extremo con competencia, criterio, evidencia e instrumento. No se generará una prueba genérica que pueda confundirse con una evaluación curricular validada.';
    p.innerHTML=`<h2>${titles[kind]||'Evaluación'}</h2>${notice('Función en desarrollo',detail)}`;
    p.scrollIntoView({behavior:'smooth'});
  };

  // Sesiones: el prototipo base ofrecía una unidad y actividades demostrativas cuando state.units estaba vacío.
  // Esa salida podía terminar en una sesión aparentemente real con tema, territorio y actividad no proporcionados por el usuario.
  const baseFillSessionUnits=window.fillSessionUnits;
  if(typeof baseFillSessionUnits==='function')window.fillSessionUnits=function(){
    const r=baseFillSessionUnits.apply(this,arguments);
    if(Array.isArray(state?.units)&&state.units.length)return r;
    const unit=by('sessionUnit'),activity=by('activity'),title=by('sessionTitle');
    if(unit)unit.innerHTML='<option value="">Primero crea una unidad/proyecto</option>';
    if(activity)activity.innerHTML='<option value="">Sin actividad programada</option>';
    if(title)title.value='';
    return r;
  };

  const baseGenerateSession=window.generateSession;
  if(typeof baseGenerateSession==='function')window.generateSession=function(){
    if(!Array.isArray(state?.units)||!state.units.length){
      const out=by('sessionOutput');
      if(out){
        out.innerHTML=`<h2>Crear mi sesión</h2>${notice('Primero crea una unidad o proyecto','La sesión debe nacer de una unidad/proyecto y de una actividad programada reales. DocenteDigital no usará ejemplos internos como si fueran tu planificación.')}`;
        out.classList.remove('hidden');
        out.scrollIntoView({behavior:'smooth'});
      }else alert('Primero crea una unidad o proyecto. La sesión no se generará con datos de ejemplo.');
      return null;
    }
    return baseGenerateSession.apply(this,arguments);
  };

  function annotateUI(){
    markButton('button[onclick="generateDiagnostic()"]','🧪 Ver diagnóstico (en desarrollo)');
    markButton('button[onclick="demoAnnual()"]','🧪 Programación anual (en desarrollo)');
    markButton('button[onclick="generateMaterial()"]','🧪 Materiales (en desarrollo)');
    document.querySelectorAll('button[onclick^="showEvaluation("]').forEach(btn=>{
      btn.dataset.ddPrototype='1';
      btn.setAttribute('title','Función en desarrollo: no produce datos reales todavía.');
      if(!/en desarrollo/i.test(btn.textContent||''))btn.textContent=(btn.textContent||'Abrir')+' · en desarrollo';
    });
    if(!Array.isArray(state?.units)||!state.units.length){
      const btn=document.querySelector('button[onclick="generateSession()"]');
      if(btn)btn.setAttribute('title','Primero crea una unidad/proyecto real; no se usarán ejemplos internos.');
    }
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',annotateUI,{once:true});
  else annotateUI();
  setTimeout(()=>{annotateUI();try{window.fillSessionUnits?.();}catch(e){}},0);
})();