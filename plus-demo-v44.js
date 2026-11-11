/* Docente Digital — laboratorio sin API y sin persistencia, 2.º primaria */
(function(){
 'use strict';
 const DATA=Object.freeze({
   situation:{
     label:'Situación significativa',
     before:'En nuestra comunidad, En una actividad de aula, se propone desarrollar los derechos. El docente podrá completar luego la contextualización.',
     after:'Como situación de estudio, los estudiantes de 2.º grado observarán historietas ficticias: una niña quiere expresar su opinión y un niño solicita participar en un juego. Conversarán acerca de lo que ocurre y formularán preguntas sobre el derecho a ser escuchados, jugar, aprender y recibir buen trato.\n\nLeerán textos breves adecuados a su edad, compararán las situaciones de las historietas y explicarán cómo reconocer y respetar los derechos de las niñas y los niños. Como producto elaborarán una guía ilustrada con ejemplos y compromisos para compartir en el aula.\n\nPregunta retadora: ¿Cómo podemos reconocer y explicar nuestros derechos y respetar los de las demás personas?'
   },
   session:{
     label:'Sesión de Comunicación',
     before:'Dialogamos sobre sobre los derechos de la niñez y formulamos preguntas. Se propone dialogar y realizar actividades sobre los derechos.',
     after:'Área: Comunicación · 2.º grado de Primaria\nCompetencia: Se comunica oralmente en su lengua materna.\nTítulo: Dialogamos sobre nuestros derechos.\nPropósito: Hoy expresaremos nuestras ideas sobre los derechos de niñas y niños a partir de historietas ficticias, formularemos preguntas y escucharemos respetuosamente.\nCriterio: Expresa una idea clara sobre un derecho representado, formula una pregunta pertinente y escucha o responde con respeto durante el diálogo.\nEvidencia: Registro de participación oral que permita observar la idea expresada, la pregunta formulada y la interacción con sus compañeros.\n\nINICIO (10 minutos)\nLos estudiantes observan dos viñetas ilustradas. Identifican qué ocurre, comparten sus primeras interpretaciones y conocen el propósito y los criterios de la actividad.\n\nDESARROLLO (20 minutos)\nEn parejas analizan una historieta ficticia. Reconocen el derecho que aparece, plantean una pregunta y preparan una explicación breve con un ejemplo. Dialogan con otra pareja; escuchan, responden y revisan su idea. El docente observa, registra evidencias y ofrece retroalimentación específica.\n\nCIERRE (10 minutos)\nLos estudiantes comunican una conclusión sobre el derecho trabajado, explican qué les permitió escuchar mejor y realizan una autoevaluación oral con los criterios compartidos.'
   },
   rubric:{
     label:'Criterios y rúbrica',
     before:'C – Requiere apoyo para evidenciar el criterio. B – Lo evidencia parcialmente con apoyo. A – Lo evidencia de manera pertinente. AD – Lo supera y transfiere lo aprendido.',
     after:'Área: Comunicación · 2.º grado de Primaria\nCompetencia: Se comunica oralmente en su lengua materna.\nEvidencia: Participación oral durante el diálogo sobre una historieta ficticia.\nCriterio: Expresa una idea sobre un derecho, formula una pregunta relacionada y escucha o responde con respeto.\n\nC – Inicio: Con preguntas de apoyo, expresa una idea breve acerca de la historieta; necesita acompañamiento para formular una pregunta y mantener la escucha.\n\nB – Proceso: Expresa una idea relacionada con un derecho y formula una pregunta sencilla con orientación; escucha las intervenciones, aunque requiere recordatorios.\n\nA – Logro esperado: Explica con claridad una idea sobre el derecho representado, formula una pregunta relacionada y escucha o responde respetuosamente.\n\nAD – Destacado: Explica su idea con un ejemplo adicional, formula preguntas que amplían el diálogo y adapta sus respuestas escuchando otras perspectivas.\n\nEstos descriptores son una propuesta orientadora de Docente Digital, no desempeños oficiales literales del MINEDU. El docente debe revisarlos a la luz del programa curricular, del ciclo y de las evidencias observadas.'
   }
 });
 const $=id=>document.getElementById(id);
 const htmlEscape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function createPrompt(which){
   const d=DATA[which];
   if(!d)return '';
   return [
     'Actúa como especialista pedagógico de Primaria del Perú, ciclo III, 2.º grado.',
     'Revisa y mejora el siguiente componente de una unidad sobre los derechos de las niñas y los niños: '+d.label+'.',
     'Mantén un lenguaje claro para estudiantes de 7 a 8 años y actividades donde el estudiante sea protagonista.',
     'Conserva la competencia pertinente del CNEB. No inventes nombres de competencias, capacidades, desempeños o estándares.',
     'No inventes hechos reales de la comunidad, vulneraciones de derechos ni datos personales. Usa casos ficticios cuando sea necesario.',
     'Alinea propósito, criterios observables, evidencias, actividades e instrumento. Si falta información, indícalo sin inventarla.',
     'Entrega un borrador completo para revisión del docente, en español, sin afirmar validación oficial del MINEDU.',
     'TEXTO PARA REVISAR:\n'+d.before
   ].join('\n\n');
 }
 function validateText(s){const t=String(s||'').trim();return t.length>=60&&t.length<=12000;}
 function wordHtml(which,text){
   const d=DATA[which];
   if(!d||!validateText(text))throw new Error('Texto inválido');
   const lines=String(text).trim().split(/\n\s*\n/);
   return '<h1>'+htmlEscape('Demostración pedagógica — '+d.label)+'</h1>'
     +'<p>2.º grado de Primaria · Ciclo III · Tema: los derechos de la niñez</p>'
     +'<p>Propuesta revisada y aprobada por el docente. No es documento oficial del MINEDU ni generación automática mediante la API.</p>'
     +lines.map(line=>'<p>'+htmlEscape(line).replace(/\n/g,'<br>')+'</p>').join('');
 }
 if(typeof window!=='undefined')window.DDPlusDemoV44=Object.freeze({samples:DATA,createPrompt,validateText,wordHtml});
 function boot(){
   const tabs=[...document.querySelectorAll('[data-section]')];
   const draft=$('draftText'),preview=$('approvedPreview'),download=$('downloadWord');
   if(!draft||!preview||!download)return;
   let active='situation',approved=false;
   const status=(message,kind='')=>{const el=$('demoMessage');el.textContent=message;el.className='status '+kind;};
   function revokeApproval(){
     approved=false;download.disabled=true;
     $('approvalStatus').textContent='Pendiente de revisión docente';
     $('approvalStatus').className='status';
     preview.textContent='Todavía no existe una versión aprobada.';
   }
   function show(which){
     if(!DATA[which])return;
     active=which;
     for(const tab of tabs)tab.setAttribute('aria-pressed',String(tab.dataset.section===which));
     $('beforeTitle').textContent=DATA[which].label+' — antes';
     $('beforeText').textContent=DATA[which].before;
     $('afterTitle').textContent=DATA[which].label+' — propuesta';
     draft.value=DATA[which].after;
     $('fromChatGPT').value='';
     revokeApproval();status('');
   }
   for(const tab of tabs)tab.addEventListener('click',()=>show(tab.dataset.section));
   draft.addEventListener('input',revokeApproval);
   $('restoreDemo').addEventListener('click',()=>{draft.value=DATA[active].after;revokeApproval();status('Ejemplo restaurado. Revísalo antes de aprobarlo.');});
   $('approve').addEventListener('click',()=>{
     if(!validateText(draft.value)){status('El texto debe tener entre 60 y 12 000 caracteres para aprobarlo.','warn');return;}
     approved=true;download.disabled=false;
     $('approvalStatus').textContent='✓ Propuesta aprobada para esta demostración';
     $('approvalStatus').className='status ok';
     preview.textContent=draft.value.trim();
     status('Puedes exportar este borrador revisado en Word.','ok');
   });
   $('usePasted').addEventListener('click',()=>{
     const pasted=$('fromChatGPT').value.trim();
     if(!validateText(pasted)){status('Pega una respuesta de 60 a 12 000 caracteres.','warn');return;}
     draft.value=pasted;revokeApproval();status('Respuesta insertada como borrador. Revisa y aprueba antes de exportar.');
   });
   $('copyPrompt').addEventListener('click',async()=>{
     const content=createPrompt(active);
     try{
       await navigator.clipboard.writeText(content);
       status('Instrucción copiada. Ábrela en tu propio ChatGPT Plus.','ok');
     }catch(_){
       const field=$('fromChatGPT');
       field.value=content;field.focus();field.select();
       status('El navegador no permitió copiar automáticamente. La instrucción quedó seleccionada para que la copies manualmente.','warn');
     }
   });
   download.addEventListener('click',()=>{
     if(!approved||!validateText(draft.value)){revokeApproval();status('Aprueba la versión actual antes de exportar.','warn');return;}
     if(!window.DDWordExport||typeof window.DDWordExport.downloadHtml!=='function'){
       status('No está disponible el exportador DOCX. No se creó un archivo.','warn');return;
     }
     const name='Demostracion_'+active+'_2do_grado';
     window.DDWordExport.downloadHtml('Laboratorio Plus · '+DATA[active].label,wordHtml(active,draft.value),false,name);
     status('Word generado desde el borrador que aprobaste. No se modificó ninguna unidad guardada.','ok');
   });
   show(active);
 }
 if(typeof document!=='undefined'){
   if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
   else boot();
 }
})();