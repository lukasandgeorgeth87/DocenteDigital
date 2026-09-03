/* DocenteDigital – integridad de generación de materiales v65
   V3/V5/Núcleo IA: una salida demostrativa no debe presentarse como material real generado.
*/
(function(){
  if(window.__ddMaterialIntegrityV65)return;window.__ddMaterialIntegrityV65=true;

  const NONE='Ninguna';
  const esc=v=>typeof escapeHtml==='function'?escapeHtml(String(v??'')):String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function topicControl(){
    const section=document.getElementById('materials');
    if(!section)return null;
    const direct=document.getElementById('materialTopic');
    if(direct)return direct;
    const input=[...section.querySelectorAll('input')].find(x=>/tema|inter[eé]s/i.test(`${x.placeholder||''} ${x.closest('label')?.textContent||''}`));
    if(input&&!input.id)input.id='materialTopic';
    return input||null;
  }

  function typeControl(){
    const section=document.getElementById('materials');
    if(!section)return null;
    const direct=document.getElementById('materialType');
    if(direct)return direct;
    const select=[...section.querySelectorAll('select')].find(x=>/^\s*Tipo\b/i.test(x.closest('label')?.textContent||''));
    if(select&&!select.id)select.id='materialType';
    return select||null;
  }

  function actionControl(){
    const section=document.getElementById('materials');
    if(!section)return null;
    return [...section.querySelectorAll('button')].find(x=>(x.getAttribute('onclick')||'').includes('generateMaterial'))||null;
  }

  function syncActionLanguage(){
    const button=actionControl();
    if(button){
      button.textContent='Revisar solicitud';
      button.setAttribute('aria-label','Revisar solicitud de material');
    }
  }

  function showStatus(message,kind='notice'){
    const out=document.getElementById('materialOutput');
    const text=document.getElementById('materialText');
    if(text)text.innerHTML=message;
    if(out){
      const heading=out.querySelector('h2');
      if(heading)heading.textContent=kind==='blocked'?'Material pendiente de generación real':'Revisión del material';
      out.classList.remove('hidden');
      out.scrollIntoView({behavior:'smooth',block:'start'});
    }
  }

  window.generateMaterial=function(){
    const type=typeControl()?.value||'Material';
    const lang=document.getElementById('materialLanguage')?.value||'Castellano';
    const variety=document.getElementById('materialQuechua')?.value||NONE;
    const grade=document.getElementById('materialGrade')?.value||'';
    const topic=(topicControl()?.value||'').trim();

    if(!topic){
      alert('Escribe el tema o interés que deseas trabajar antes de revisar la solicitud.');
      topicControl()?.focus();
      return;
    }

    if((lang==='Lengua originaria'||lang==='Bilingüe')&&(!variety||variety===NONE)){
      alert('Selecciona la lengua originaria o variedad pertinente antes de continuar.');
      document.getElementById('materialQuechua')?.focus();
      return;
    }

    /* El prototipo base generaba siempre un texto sobre agua y, para "Lengua originaria",
       caía por error en una rama bilingüe con una frase quechua demostrativa. Eso podía
       parecer una generación real y además ignoraba por completo el tema escrito.
       Hasta disponer de IA/servicio lingüístico real y validado, mostramos el estado
       verdadero en vez de fabricar contenido. */
    const languageLabel=lang==='Castellano'?'castellano':lang==='Bilingüe'?`formato bilingüe con ${variety}`:variety;
    showStatus(
      `<b>Tipo solicitado:</b> ${esc(type)}.<br>`+
      `${grade?`<b>Grado/edad:</b> ${esc(grade)}.<br>`:''}`+
      `<b>Tema registrado:</b> ${esc(topic)}.<br>`+
      `<b>Idioma solicitado:</b> ${esc(languageLabel)}.<br>`+
      `La generación contextualizada de materiales todavía no está conectada a un motor de IA validado. Para evitar presentar textos genéricos o traducciones demostrativas como reales, DocenteDigital no fabricará el contenido en esta etapa.`,
      'blocked'
    );
  };

  window.ddAuditMaterialIntegrity=function(){
    const topic=topicControl();
    const type=typeControl();
    const action=actionControl();
    return {
      guard:'v65',
      topicField:Boolean(topic),
      topicFieldId:topic?.id||null,
      typeField:Boolean(type),
      typeFieldId:type?.id||null,
      typeValue:type?.value||null,
      gradeValue:document.getElementById('materialGrade')?.value||null,
      languageValue:document.getElementById('materialLanguage')?.value||null,
      varietyValue:document.getElementById('materialQuechua')?.value||null,
      actionLabel:action?.textContent?.trim()||null,
      simulatedGenerationBlocked:true
    };
  };

  topicControl();
  typeControl();
  syncActionLanguage();
})();