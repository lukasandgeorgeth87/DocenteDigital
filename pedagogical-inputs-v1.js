/* Insumos voluntarios del docente; solo texto validado en almacenamiento local. */
(function(root){
  'use strict';
  if(root.DDPedagogicalInputs)return;
  const MONTHS=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const RX=new RegExp('\\b('+MONTHS.join('|')+')\\b','i');
  const LABELS={calendar:'Calendario comunal',group:'Características generales del grupo',school:'Proyecto o prioridad institucional',other:'Otro insumo'};
  const $=id=>document.getElementById(id),E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const inputs=()=>Array.isArray(state.pedagogicalInputs)?state.pedagogicalInputs:(state.pedagogicalInputs=[]);
  const clean=v=>String(v||'').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,'').replace(/\r\n?/g,'\n').slice(0,16000).trim();
  function eventsFrom(content){
    const months={};let current='';
    for(const raw of clean(content).split('\n')){
      const line=raw.trim();if(!line)continue;
      const m=line.match(RX);
      if(m){
        current=MONTHS.find(n=>n.toLowerCase()===m[1].toLowerCase())||'';
        const event=line.slice(m.index+m[0].length).replace(/^[\s\d/:;,.|\-–—]+/,'').trim();
        if(event.length>3)(months[current]??=[]).push(event.slice(0,160));
      }else if(current&&line.length>3&&!/^(mes|actividad|fecha|observaci[oó]n)s?$/i.test(line))
        (months[current]??=[]).push(line.slice(0,160));
    }
    for(const month of Object.keys(months))months[month]=[...new Set(months[month])].slice(0,10);
    return months;
  }
  function monthEvents(month){
    const all=inputs().filter(s=>s.category==='calendar'&&s.confirmed).flatMap(s=>(s.events?.[month]||[]).map(text=>({text,source:s.name})));
    const c=String(state.institutionMaster?.communalCalendar||state.teacherContext?.calendar||'');
    all.push(...(eventsFrom(c)[month]||[]).map(text=>({text,source:'Calendario declarado por el docente'})));
    return all.filter((v,i,a)=>a.findIndex(x=>x.text.toLowerCase()===v.text.toLowerCase())===i).slice(0,5);
  }
  function recommendedTitle(month,level){
    const found=monthEvents(month)[0];if(!found)return '';
    const lead=level==='Inicial'?'Exploramos y compartimos: ':level==='Secundaria'?'Investigamos y analizamos: ':'Investigamos y valoramos: ';
    return lead+found.text.replace(/[.!?]+$/,'').slice(0,100);
  }
  function contextualNotes(category,limit=400){
    return inputs().filter(s=>s.category===category&&s.confirmed).map(s=>({source:s.name,text:s.text.slice(0,limit)}));
  }
  async function docxText(file){
    const bytes=new Uint8Array(await file.arrayBuffer()),v=new DataView(bytes.buffer),decoder=new TextDecoder();let end=-1;
    for(let i=bytes.length-22;i>=Math.max(0,bytes.length-65557);i--)if(v.getUint32(i,true)===0x06054b50){end=i;break;}
    if(end<0)throw new Error('Word no reconocido: usa DOCX o copia el texto.');
    let p=v.getUint32(end+16,true);
    for(let i=0,count=v.getUint16(end+10,true);i<count&&p+46<bytes.length;i++){
      if(v.getUint32(p,true)!==0x02014b50)break;
      const method=v.getUint16(p+10,true),size=v.getUint32(p+20,true),n=v.getUint16(p+28,true),e=v.getUint16(p+30,true),c=v.getUint16(p+32,true),offset=v.getUint32(p+42,true);
      const name=decoder.decode(bytes.slice(p+46,p+46+n));p+=46+n+e+c;
      if(name!=='word/document.xml')continue;
      if(size>3000000||offset+30>=bytes.length||v.getUint32(offset,true)!==0x04034b50)throw new Error('Word incompleto o muy grande.');
      const start=offset+30+v.getUint16(offset+26,true)+v.getUint16(offset+28,true);
      if(start+size>bytes.length)throw new Error('Word truncado.');
      let body=bytes.slice(start,start+size);
      if(method===8){
        if(!root.DecompressionStream)throw new Error('El navegador no admite la compresión de Word.');
        body=new Uint8Array(await new Response(new Blob([body]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer());
      }else if(method!==0)throw new Error('Compresión de Word no admitida.');
      const xml=new DOMParser().parseFromString(decoder.decode(body),'application/xml');
      if(xml.getElementsByTagName('parsererror').length)throw new Error('XML de Word no válido.');
      const ns='http://schemas.openxmlformats.org/wordprocessingml/2006/main';
      return [...xml.getElementsByTagNameNS(ns,'p')].map(x=>[...x.getElementsByTagNameNS(ns,'t')].map(t=>t.textContent).join('')).filter(Boolean).join('\n');
    }
    throw new Error('Word sin contenido legible.');
  }
  async function fileText(file){
    if(file.size>4000000)throw new Error('Archivo mayor que 4 MB. Copia un resumen.');
    const name=file.name.toLowerCase();
    if(name.endsWith('.docx'))return {text:await docxText(file),message:'Texto de Word extraído; revísalo.'};
    if(/\.(txt|md|csv|ics)$/.test(name))return {text:await file.text(),message:'Texto importado; revísalo.'};
    if(name.endsWith('.pdf'))return {text:'',message:'Por ahora el PDF requiere copiar su resumen en el recuadro. El archivo no se guarda.'};
    throw new Error('Formato no admitido. Usa Word, texto o resumen de PDF.');
  }
  function status(message){const el=$('ddInputStatus');if(el)el.textContent=message;}
  function list(){
    const host=$('ddInputList');if(!host)return;
    host.innerHTML=inputs().length?inputs().map(s=>`<div class="dd-input-source"><span><b>${E(s.name)}</b><small> · ${E(LABELS[s.category])} · ${s.category==='calendar'?Object.keys(s.events||{}).length+' meses':'Texto revisado'}</small></span><button class="btn alt" type="button" data-dd-remove-input="${E(s.id)}">Quitar</button></div>`).join(''):'<p class="sub">Aún no hay insumos. Puedes planificar sin ellos.</p>';
  }
  function open(){
    const host=$('pedagogicalInputsRoot');if(!host)return;
    host.innerHTML=`<div class="card"><h2>Enseña a DocenteDigital sobre tu contexto</h2>
      <p>Sube un calendario comunal, características generales del aula o prioridades de la IE. El docente conserva el control de los títulos y puede omitir este paso.</p>
      <div class="notice"><b>Privacidad:</b> no incluyas nombres de estudiantes, DNI, teléfonos, diagnósticos individuales ni otros datos sensibles. Solo se guarda el texto revisado en este navegador; los archivos originales no se envían a un servidor.</div>
      <div class="form2 topgap"><label>Tipo de insumo<select id="ddInputCategory">${Object.entries(LABELS).map(([id,label])=>`<option value="${id}">${E(label)}</option>`).join('')}</select></label>
      <label>Nombre del insumo<input id="ddInputName" placeholder="Ej.: Calendario comunal 2027"></label>
      <label class="full">Archivo opcional (Word, texto, CSV, ICS; PDF con resumen manual)<input type="file" id="ddInputFile" accept=".docx,.txt,.md,.csv,.ics,.pdf"></label>
      <label class="full">Información que se puede usar<textarea id="ddInputText" rows="7" placeholder="Marzo: Limpieza comunal de canales\nAbril: Feria de semillas"></textarea><small>Para un calendario, escribe cada mes con sus actividades. Revisa el texto antes de guardarlo.</small></label></div>
      <label class="dd-input-privacy"><input type="checkbox" id="ddInputConsent"> Confirmo que revisé el texto y no contiene datos sensibles de estudiantes.</label>
      <div class="actions topgap"><button class="btn" id="ddInputSave" type="button">💾 Guardar insumo</button><button class="btn alt" id="ddInputAnnual" type="button">📅 Programación anual</button></div>
      <div class="notice topgap" id="ddInputStatus" role="status" aria-live="polite">Puedes registrar hasta 8 insumos de 16 000 caracteres cada uno.</div></div>
      <div class="card topgap"><h2>Insumos guardados</h2><div id="ddInputList"></div></div>`;
    $('ddInputFile').onchange=async()=>{
      const file=$('ddInputFile').files?.[0];if(!file)return;
      if(!$('ddInputName').value.trim())$('ddInputName').value=file.name.replace(/\.[^.]+$/,'');
      try{const result=await fileText(file);$('ddInputText').value=clean(result.text);status(result.message);}
      catch(error){$('ddInputText').value='';status('No se importó: '+error.message);}
    };
    $('ddInputSave').onclick=()=>{
      const name=$('ddInputName').value.trim().slice(0,100),text=clean($('ddInputText').value),category=$('ddInputCategory').value;
      if(!$('ddInputConsent').checked)return status('Confirma antes que el texto fue revisado y no incluye datos sensibles.');
      if(!name||text.length<12)return status('Agrega un nombre y suficiente contenido útil (12 caracteres como mínimo).');
      if(/\b(?:\d{8}|9\d{8})\b|[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(text))return status('Se detectó un posible DNI, teléfono o correo. Elimina esos datos personales antes de guardar.');
      if(inputs().length>=8)return status('Ya tienes 8 insumos; retira uno para continuar.');
      const item={id:'input'+Date.now().toString(36)+Math.random().toString(36).slice(2,7),name,category,text,events:category==='calendar'?eventsFrom(text):{},confirmed:true,createdAt:new Date().toISOString()};
      inputs().push(item);if(!save()){inputs().pop();return status('No se pudo guardar. Revisa el almacenamiento de este navegador.');}
      list();$('ddInputName').value='';$('ddInputText').value='';$('ddInputFile').value='';$('ddInputConsent').checked=false;
      status('✓ Insumo guardado. Se utilizará para nuevas sugerencias. No cambia títulos ya elegidos.');
    };
    $('ddInputAnnual').onclick=()=>{go('annual');root.DDAnnualPlanning?.open();};list();
  }
  document.addEventListener('click',e=>{
    const button=e.target.closest('[data-dd-remove-input]');if(!button)return;
    const i=inputs().findIndex(x=>x.id===button.dataset.ddRemoveInput);if(i<0)return;
    if(!confirm('¿Retirar este insumo de futuras planificaciones?'))return;
    const item=inputs().splice(i,1)[0];if(!save()){inputs().splice(i,0,item);return status('No se pudo guardar la eliminación.');}
    list();status('Insumo retirado. Los títulos existentes siguen intactos.');
  });
  const css=document.createElement('style');
  css.textContent='.dd-input-source{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px;border-bottom:1px solid #d7e3db}.dd-input-source small{display:block;color:#586d62;margin-top:4px}.dd-input-privacy{display:flex;gap:8px;align-items:flex-start;line-height:1.45}.dd-input-privacy input{margin-top:4px}';
  document.head.appendChild(css);
  root.DDPedagogicalInputs={open,eventsFrom,monthEvents,recommendedTitle,contextualNotes};
})(window);
