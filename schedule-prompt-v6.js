/* DocenteDigital – solicitud de horario Word en configuración inicial */
(function(){
  const step4=document.getElementById('step4');
  if(!step4||document.getElementById('ddInitialSchedulePrompt'))return;

  const box=document.createElement('div');
  box.id='ddInitialSchedulePrompt';
  box.className='card inner dd-schedule-prompt';
  box.innerHTML=`
    <h3>🗓️ Horario docente</h3>
    <p><b>¿Deseas subir tu horario docente en Word?</b></p>
    <p class="sub">Es opcional, pero recomendado. DocenteDigital lo analizará y lo guardará para organizar automáticamente las sesiones por día, bloque y área. No tendrás que volver a subirlo mientras tu horario no cambie.</p>
    <div class="actions">
      <button type="button" class="btn alt" id="ddUploadScheduleNow">📄 Subir horario en Word</button>
      <button type="button" class="btn ghost" id="ddScheduleLater">Lo haré después</button>
    </div>
    <small>Formato recomendado: archivo .docx con una tabla que contenga los días de la semana y las áreas por bloque.</small>
  `;

  const eib=step4.querySelector('.card.inner');
  if(eib&&eib.nextSibling)step4.insertBefore(box,eib.nextSibling);else step4.appendChild(box);

  document.getElementById('ddUploadScheduleNow').onclick=()=>{
    if(!state.areas||!state.areas.length){alert('Primero selecciona las áreas de trabajo.');return;}
    const language=document.getElementById('language');
    const q=document.getElementById('quechuaVar');
    if(language)state.language=language.value;
    if(q)state.quechuaVar=q.value;
    save();
    finishSetup();
    setTimeout(()=>{
      go('plan');
      setTimeout(()=>{
        const input=document.getElementById('ddScheduleFile');
        const card=document.getElementById('ddScheduleCard');
        if(card)card.scrollIntoView({behavior:'smooth',block:'start'});
        if(input)input.click();
        else alert('Abre “Horario de clases” y selecciona “Subir horario en Word”.');
      },120);
    },80);
  };

  document.getElementById('ddScheduleLater').onclick=()=>{
    box.classList.add('dd-schedule-later');
    const p=box.querySelector('p.sub');
    if(p)p.textContent='Puedes subirlo después desde Mi planificación → Horario de clases. Mientras tanto, podrás elegir 2 o 3 sesiones por día.';
  };

  const style=document.createElement('style');
  style.textContent=`
    .dd-schedule-prompt{margin-top:12px;border:1px solid #cad9d1;background:linear-gradient(135deg,#f8fcfa,#eef7f2)}
    .dd-schedule-prompt h3{margin-top:0}.dd-schedule-prompt .actions{display:flex;gap:8px;flex-wrap:wrap}.dd-schedule-later{opacity:.9}
  `;
  document.head.appendChild(style);
})();

/* Carga el flujo de selección pedagógica y, después, la auditoría/contexto. */
(function(){
  if(document.querySelector('script[data-dd-proposal-choice]'))return;
  const s=document.createElement('script');
  s.src='proposal-choice-v7.js';
  s.dataset.ddProposalChoice='1';
  s.onload=()=>{
    if(document.querySelector('script[data-dd-context-audit]'))return;
    const a=document.createElement('script');
    a.src='context-audit-v8.js';
    a.dataset.ddContextAudit='1';
    document.body.appendChild(a);
  };
  document.body.appendChild(s);
})();