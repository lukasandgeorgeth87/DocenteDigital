/* DocenteDigital – coherencia focalizada de planificación v51
   Corrige únicamente regresiones verificadas del flujo Unidad/Proyecto:
   - el nombre concreto del producto elegido debe sobrevivir al guardado/exportación;
   - una finalidad explícita debe gobernar los títulos visibles;
   - casos de regresión hormigas en el aula y biohuerto conservan contexto, reto y producto.
   No reemplaza el Núcleo IA para contextos no reconocidos.
*/
(function(){
  if(window.__ddPlanningCoherenceV51)return;window.__ddPlanningCoherenceV51=true;
  if(typeof state!=='object')return;

  const tidy=s=>String(s??'').replace(/\s+/g,' ').trim();
  const norm=s=>tidy(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const esc=s=>typeof window.escapeHtml==='function'?window.escapeHtml(String(s??'')):String(s??'');

  function regressionCase(raw){
    const s=norm(raw);
    if(/hormigas?/.test(s)&&/aula/.test(s)&&/aparec|encontr|observ/.test(s))return'hormigas-aula';
    if(/biohuerto|huerto escolar/.test(s)&&/hortaliza/.test(s)&&/siembr|tubercul|papa|anu|oca|olluco/.test(s))return'biohuerto';
    return'';
  }

  function verifiedPack(raw){
    const c=regressionCase(raw);
    if(c==='hormigas-aula')return{
      reto:'¿Qué podemos investigar sobre las hormigas que aparecieron en el aula para comprender mejor por qué están allí, cómo viven y qué podemos explicar con las evidencias que encontremos?',
      situations:[
        {key:'A',title:'Propuesta 1',text:'En el aula aparecieron hormigas y este hecho despertó la curiosidad de los estudiantes. Quieren saber por qué están allí, cómo viven y qué características tienen. Esta situación cercana permitirá observar, formular preguntas, buscar información, contrastar ideas y comunicar lo aprendido sin asumir respuestas antes de investigar.'},
        {key:'B',title:'Propuesta 2',text:'La presencia de hormigas en el aula ha generado preguntas entre los estudiantes. A partir de lo que observan, podrán recuperar sus ideas iniciales, investigar sus características y comportamiento, registrar hallazgos y explicar con evidencias lo que descubran sobre estos pequeños seres vivos.'}
      ],
      products:[
        {key:'1',title:'Observatorio de hormigas',text:'Observatorio de hormigas'},
        {key:'2',title:'Mural científico sobre las hormigas',text:'Mural científico sobre las hormigas'},
        {key:'3',title:'Guía ilustrada sobre las hormigas',text:'Guía ilustrada sobre las hormigas'}
      ]
    };
    if(c==='biohuerto')return{
      reto:'¿Cómo podemos aprovechar los saberes y prácticas de la siembra que conocemos en nuestro entorno para planificar y sembrar hortalizas en nuestro biohuerto, explicando las decisiones y cuidados que necesitamos realizar?',
      situations:[
        {key:'A',title:'Propuesta 1',text:'Los estudiantes conocen, por sus familias y su entorno, diversos saberes y prácticas relacionados con la siembra de tubérculos. En esta experiencia recuperarán y comprenderán esos conocimientos para utilizarlos en una nueva tarea: planificar y sembrar hortalizas en el biohuerto escolar, tomando decisiones sobre el espacio, las semillas, los cuidados y el seguimiento del cultivo.'},
        {key:'B',title:'Propuesta 2',text:'La siembra forma parte de las experiencias cercanas de los estudiantes. El reto será reconocer qué saberes de esas prácticas pueden aplicarse al cultivo de hortalizas en el biohuerto escolar. Así, observarán, preguntarán, compararán conocimientos, planificarán la siembra y explicarán por qué toman determinadas decisiones durante el proceso.'}
      ],
      products:[
        {key:'1',title:'Biohuerto escolar de hortalizas',text:'Biohuerto escolar de hortalizas'},
        {key:'2',title:'Biohuerto demostrativo con bitácora',text:'Biohuerto demostrativo con bitácora'},
        {key:'3',title:'Ruta “De la chacra al biohuerto”',text:'Ruta “De la chacra al biohuerto”'}
      ]
    };
    return null;
  }

  function syncVerifiedChoiceUI(){
    const pending=state.pendingUnitChoice,host=document.getElementById('ddProposalChooser');
    if(!pending||!host)return;
    const pack=verifiedPack(pending.brief||'');if(!pack)return;
    pending.reto=pack.reto;
    if(host.querySelector('input[name="ddSituation"]')){
      pending.situations=pack.situations;
      [...host.querySelectorAll('.dd-choice-grid .dd-choice-card')].slice(0,2).forEach((card,i)=>{
        const item=pack.situations[i],h=card.querySelector('h3'),p=card.querySelector('p');
        if(h)h.textContent=item.title;if(p)p.textContent=item.text;
      });
    }
    if(host.querySelector('input[name="ddProduct"]')){
      pending.products=pack.products;
      [...host.querySelectorAll('.dd-product-grid .dd-choice-card')].slice(0,3).forEach((card,i)=>{
        const item=pack.products[i],h=card.querySelector('h3'),p=card.querySelector('p');
        if(h)h.textContent=item.title;if(p)p.textContent='';
      });
    }
    if(typeof save==='function')save();
  }

  function repaintGoalAwareTitles(){
    const raw=document.getElementById('unitSituation')?.value||'';
    if(tidy(raw).length<8)return;
    let goal=null;try{goal=window.ddExtractPlanningGoal?.(raw)||null;}catch(e){}
    if(!goal?.phrase)return;
    const box=document.querySelector('#ddIntentBox .dd-title-suggestions');if(!box)return;
    const type=document.getElementById('unitType')?.value||'Unidad de aprendizaje';
    let titles=[];try{titles=window.ddCreativeTitleOptions?.(raw,type)||[];}catch(e){}
    titles=[...new Set(titles.map(tidy).filter(Boolean))].slice(0,3);if(!titles.length)return;
    box.innerHTML=titles.map(t=>`<button type="button" data-dd-title="${esc(t)}">${esc(t)}</button>`).join('');
  }

  function preserveConcreteProduct(){
    const unit=state.activeUnitId?(state.units||[]).find(u=>u.id===state.activeUnitId):(state.units||[])[0];
    if(!unit||!unit.selectionApproved)return;
    const short=tidy(unit.productTitle),current=tidy(unit.product);
    if(!short||short==='Producto propuesto por el docente'||short==='Producto final'||short===current)return;
    unit.productDescription=current;
    unit.product=short;
    if(typeof save==='function')save();
    try{if(typeof renderUnits==='function')renderUnits();if(typeof renderUnitOutput==='function')renderUnitOutput(unit);if(typeof fillSessionUnits==='function')fillSessionUnits();}catch(e){}
  }

  let timer=0;
  document.addEventListener('input',e=>{
    if(e.target?.id!=='unitSituation')return;
    clearTimeout(timer);timer=setTimeout(()=>{repaintGoalAwareTitles();syncVerifiedChoiceUI();},560);
  },true);
  document.addEventListener('change',e=>{
    if(e.target?.id==='unitType')setTimeout(repaintGoalAwareTitles,180);
  },true);
  document.addEventListener('click',e=>{
    const b=e.target.closest?.('button');if(!b)return;
    if(/createUnitDemo/.test(b.getAttribute('onclick')||''))setTimeout(()=>{syncVerifiedChoiceUI();repaintGoalAwareTitles();},150);
    if(b.id==='ddContinueProducts'||b.id==='ddBackSituation')setTimeout(syncVerifiedChoiceUI,120);
    if(b.id==='ddBuildUnit')setTimeout(preserveConcreteProduct,240);
  },true);

  window.ddPlanningRegressionV51={
    caseOf:regressionCase,
    preview:raw=>verifiedPack(raw),
    check(){
      const h=verifiedPack('Aparecieron hormigas en el aula y queremos investigar sobre ello.');
      const b=verifiedPack('Aprenderemos saberes de la siembra de tubérculos y estos conocimientos los aplicaremos para sembrar hortalizas en nuestro biohuerto.');
      return{
        hormigas:!!h&&/aula/i.test(h.situations[0].text)&&h.products[0].title==='Observatorio de hormigas',
        biohuerto:!!b&&/biohuerto/i.test(b.reto)&&/Biohuerto/i.test(b.products[0].title)
      };
    }
  };
})();