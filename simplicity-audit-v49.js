/* DocenteDigital – Auditoría de Simplicidad v50
   Regla: potente por dentro, simple por fuera.
   Añade pruebas locales de facilidad de uso a la auditoría ejecutable.
   El ISU completo NO se calcula sin piloto con usuarios reales.
   V3/V5: una prueba omitida o no aplicable en el estado actual no cuenta como PASA.
*/
(function(){
  if(window.__ddSimplicityAuditV50)return;window.__ddSimplicityAuditV50=true;
  const tidy=v=>String(v??'').replace(/\s+/g,' ').trim();
  const visible=el=>!!el&&!!(el.offsetWidth||el.offsetHeight||el.getClientRects().length)&&getComputedStyle(el).display!=='none'&&getComputedStyle(el).visibility!=='hidden';
  const now=()=>new Date().toISOString();
  function res(id,severity,passed,expected,obtained,evidence,action,status='EJECUTADA'){
    return {id,area:'Simplicidad',severity,passed:!!passed,status,expected,obtained,evidence,action,executedAt:now()};
  }
  const tests=[
    {
      id:'AUD-USO-001',area:'Simplicidad',severity:'S1',name:'Crear sesión es fácil de encontrar',run(){
        const b=document.querySelector('[data-screen="session"]');const label=tidy(b?.textContent);const ok=!!b&&/sesión/i.test(label)&&label.length<=30;
        return res(this.id,this.severity,ok,'Acceso visible y breve a Crear sesión',label||'[no encontrado]',{exists:!!b,label},'Mantener Crear sesión como acceso principal y reconocible desde la navegación');
      }
    },
    {
      id:'AUD-USO-002',area:'Simplicidad',severity:'S3',name:'Botones principales con texto breve',run(){
        const buttons=[...document.querySelectorAll('button')].filter(visible);const long=buttons.map(b=>tidy(b.textContent)).filter(t=>t.length>48);const ok=long.length===0;
        return res(this.id,this.severity,ok,'Botones visibles con textos breves y accionables',ok?'Sin botones excesivamente largos':`${long.length} botón(es) demasiado largos`,long.slice(0,8),'Acortar etiquetas; mover explicación a ayuda contextual');
      }
    },
    {
      id:'AUD-USO-003',area:'Simplicidad',severity:'S2',name:'Análisis técnico oculto al usuario',run(){
        const selectors=['#ddKeywordBox','.dd-meaning-warning','#ddIntentBox .dd-intent-grid','#ddIntentBox .dd-meaning-synthesis'];const shown=selectors.flatMap(s=>[...document.querySelectorAll(s)]).filter(visible);const ok=shown.length===0;
        return res(this.id,this.severity,ok,'Sin porcentajes, palabras clave ni diagnósticos internos visibles en el flujo normal',ok?'Análisis interno oculto':`${shown.length} bloque(s) técnicos visibles`,shown.map(x=>tidy(x.textContent).slice(0,100)),'Ocultar análisis interno y mostrar solo decisiones útiles');
      }
    },
    {
      id:'AUD-USO-004',area:'Simplicidad',severity:'S3',name:'Ayuda operativa breve',run(){
        const nodes=[...document.querySelectorAll('#unitPanel .sub,#unitPanel small,#ddProposalChooser .dd-choice-intro p')].filter(visible);const long=nodes.map(x=>tidy(x.textContent)).filter(t=>t.length>180);const ok=long.length===0;
        return res(this.id,this.severity,ok,'Ayudas visibles breves (idealmente 1–3 frases)',ok?'Textos operativos dentro del límite local':`${long.length} ayuda(s) extensas`,long.slice(0,5),'Resumir el texto y ofrecer Ver más solo si aporta valor');
      }
    },
    {
      id:'AUD-USO-005',area:'Simplicidad',severity:'S3',name:'Prueba básica del pulgar',run(){
        if(window.innerWidth>768)return res(this.id,this.severity,false,'Botones táctiles cómodos en móvil','PENDIENTE: esta ejecución ocurrió en ancho de escritorio',{width:window.innerWidth},'Ejecutar en viewport móvil y además en Android real','PENDIENTE');
        const buttons=[...document.querySelectorAll('button')].filter(visible);const small=buttons.filter(b=>{const r=b.getBoundingClientRect();return r.height<40||r.width<40;});const ok=small.length===0;
        return res(this.id,this.severity,ok,'Botones visibles de al menos ~40 px en móvil',ok?'Sin objetivos táctiles pequeños detectados':`${small.length} botón(es) pequeños`,small.slice(0,8).map(b=>({label:tidy(b.textContent),rect:b.getBoundingClientRect().toJSON?.()||{width:b.offsetWidth,height:b.offsetHeight}})),'Aumentar área táctil de botones principales');
      }
    },
    {
      id:'AUD-USO-006',area:'Simplicidad',severity:'S2',name:'Ruta para volver en flujos guiados',run(){
        const host=document.getElementById('ddProposalChooser');if(!visible(host))return res(this.id,this.severity,false,'Flujo activo con Volver/Cancelar','PENDIENTE: no hay selector de propuestas activo durante esta ejecución',{active:false},'Repetir durante el flujo Unidad/Proyecto','PENDIENTE');
        const back=host.querySelector('#ddBackSituation,#ddCancelChoice,.btn.ghost');const ok=!!back&&visible(back);
        return res(this.id,this.severity,ok,'Botón Volver o Cancelar visible',ok?tidy(back.textContent):'[ausente]',!!back,'Agregar una salida clara del paso actual');
      }
    },
    {
      id:'AUD-USO-007',area:'Simplicidad',severity:'S2',name:'Sin términos técnicos innecesarios',run(){
        const active=document.querySelector('.screen.active');if(!active||active.id==='settings')return res(this.id,this.severity,false,'Sin jerga técnica en tareas del usuario','PENDIENTE: pantalla técnica/configuración o sin pantalla de trabajo activa',{screen:active?.id||null},'Revisar en pantallas de trabajo','PENDIENTE');
        const text=tidy(active.innerText);const hits=(text.match(/\b(tokens?|rag|vector database|temperatura|prompt del sistema|persistir|instanciar|auditoría semántica)\b/gi)||[]);const ok=hits.length===0;
        return res(this.id,this.severity,ok,'Lenguaje cotidiano en el flujo del usuario',ok?'Sin jerga técnica detectada':`Términos técnicos: ${[...new Set(hits)].join(', ')}`,hits,'Reemplazar por lenguaje sencillo u ocultar la opción técnica');
      }
    },
    {
      id:'AUD-USO-008',area:'Simplicidad',severity:'S2',name:'Continuar donde quedó',run(){
        const b=[...document.querySelectorAll('button')].find(x=>/continuar mi trabajo/i.test(tidy(x.textContent)));const ok=!!b;
        return res(this.id,this.severity,ok,'Acceso a continuar trabajo pendiente','Continuar mi trabajo '+(ok?'disponible':'ausente'),!!b,'Mantener una entrada visible a la última tarea');
      }
    },
    {
      id:'AUD-USO-009',area:'Simplicidad',severity:'S3',name:'Estado de guardado comprensible',run(){
        const text=tidy(document.body.innerText);const ok=/✓\s*guardado|guardado automáticamente|autoguardado/i.test(text);
        return res(this.id,this.severity,ok,'Indicador simple de guardado automático','Indicador '+(ok?'detectado':'no detectado'),'Búsqueda de estado visible','Agregar indicador discreto “✓ Guardado” sin ocupar espacio');
      }
    }
  ];
  function run(){return {executedAt:now(),tests:tests.map(t=>{try{return t.run();}catch(e){return res(t.id,t.severity,false,'Prueba sin excepción','Excepción: '+e.message,String(e.stack||e),'Corregir prueba o interfaz');}}),isuStatus:'PENDIENTE_DE_PILOTO'};}
  function attach(){
    const base=window.ddExecutableAudit;if(!base||!Array.isArray(base.tests))return false;
    for(const t of tests)if(!base.tests.some(x=>x.id===t.id))base.tests.push(t);
    return true;
  }
  let tries=0;const timer=setInterval(()=>{tries++;if(attach()||tries>20)clearInterval(timer);},100);
  window.ddSimplicityAudit={tests,run,isuStatus:'PENDIENTE_DE_PILOTO'};
})();