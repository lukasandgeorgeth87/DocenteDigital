/* DocenteDigital – captura local de feedback Beta v1
   No envía datos a servidores. Guarda incidencias en localStorage y permite exportarlas.
*/
(function(){
  if(window.__ddBetaFeedbackV1)return;
  window.__ddBetaFeedbackV1=true;
  const KEY='docenteDigitalBetaFeedback';

  function read(){
    try{const v=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(v)?v:[];}catch(_e){return[];}
  }
  function write(items){localStorage.setItem(KEY,JSON.stringify(items));}
  function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function currentContext(){
    let st={};try{st=JSON.parse(localStorage.getItem('docenteDigitalPrototype')||'{}');}catch(_e){}
    return {level:st.level||'',ieType:st.ieType||'',grades:Array.isArray(st.grades)?st.grades:[],areas:Array.isArray(st.areas)?st.areas:[],mode:st.mode||''};
  }
  function saveFeedback(){
    const role=document.getElementById('ddFeedbackRole')?.value||'';
    const area=document.getElementById('ddFeedbackArea')?.value||'';
    const type=document.getElementById('ddFeedbackType')?.value||'';
    const description=(document.getElementById('ddFeedbackDescription')?.value||'').trim();
    if(!description){alert('Describe brevemente qué ocurrió o qué debería mejorar.');return;}
    const items=read();
    items.unshift({id:`FB-${Date.now()}`,createdAt:new Date().toISOString(),role,area,type,description,context:currentContext(),url:location.pathname});
    write(items.slice(0,100));
    document.getElementById('ddFeedbackDescription').value='';
    renderCount();
    alert('Incidencia guardada en este dispositivo.');
  }
  function renderCount(){
    const target=document.getElementById('ddFeedbackCount');if(target)target.textContent=String(read().length);
  }
  function exportFeedback(){
    const items=read();
    if(!items.length){alert('Todavía no hay incidencias registradas.');return;}
    const envelope={format:'DocenteDigitalBetaFeedback',version:1,exportedAt:new Date().toISOString(),items};
    const blob=new Blob([JSON.stringify(envelope,null,2)],{type:'application/json;charset=utf-8'});
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`DocenteDigital_feedback_${new Date().toISOString().slice(0,10)}.json`;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},1200);
  }
  function copySummary(){
    const items=read();
    if(!items.length){alert('Todavía no hay incidencias registradas.');return;}
    const text=items.map((x,i)=>`${i+1}. [${x.type||'Observación'}] ${x.area||'General'} · ${x.role||'Usuario'}\n${x.description}`).join('\n\n');
    if(navigator.clipboard?.writeText){navigator.clipboard.writeText(text).then(()=>alert('Resumen copiado.')).catch(()=>alert('No se pudo copiar automáticamente.'));}
    else alert('La copia automática no está disponible en este navegador.');
  }
  function clearFeedback(){
    if(!read().length)return;
    if(confirm('¿Eliminar definitivamente las incidencias guardadas en este dispositivo?')){localStorage.removeItem(KEY);renderCount();}
  }
  function addCard(){
    const settings=document.getElementById('settings');
    if(!settings||document.getElementById('ddBetaFeedbackCard'))return;
    const card=document.createElement('div');card.id='ddBetaFeedbackCard';card.className='card topgap';
    card.innerHTML=`<h2>🧪 Reporte de la Beta</h2><p class="sub">Registra problemas o mejoras durante el piloto. Se guarda solo en este dispositivo hasta que lo exportes.</p>
      <div class="form2">
        <label>Perfil<select id="ddFeedbackRole"><option>Docente</option><option>Director</option><option>Otro</option></select></label>
        <label>Flujo<select id="ddFeedbackArea"><option>Unidad/Proyecto</option><option>Sesión</option><option>DOCX/Exportación</option><option>Móvil</option><option>Configuración/EIB</option><option>Recuperación/Respaldo</option><option>General</option></select></label>
        <label>Tipo<select id="ddFeedbackType"><option>No pude continuar</option><option>Resultado incorrecto</option><option>Confuso/difícil</option><option>Error visual</option><option>Sugerencia de mejora</option></select></label>
        <label class="full">¿Qué ocurrió o qué mejorarías?<textarea id="ddFeedbackDescription" placeholder="Ejemplo: al volver a abrir la sesión no encontré... / esperaba que..."></textarea></label>
      </div>
      <div class="actions topgap"><button class="btn" type="button" id="ddSaveFeedback">Guardar incidencia</button><button class="btn ghost" type="button" id="ddExportFeedback">⬇ Exportar JSON</button><button class="btn ghost" type="button" id="ddCopyFeedback">Copiar resumen</button><button class="btn ghost" type="button" id="ddClearFeedback">Limpiar</button></div>
      <small>Incidencias guardadas: <b id="ddFeedbackCount">0</b></small>`;
    settings.appendChild(card);
    document.getElementById('ddSaveFeedback').onclick=saveFeedback;
    document.getElementById('ddExportFeedback').onclick=exportFeedback;
    document.getElementById('ddCopyFeedback').onclick=copySummary;
    document.getElementById('ddClearFeedback').onclick=clearFeedback;
    renderCount();
  }
  function init(){addCard();window.ddBetaFeedback={read,saveFeedback,exportFeedback,getCount:()=>read().length};}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
