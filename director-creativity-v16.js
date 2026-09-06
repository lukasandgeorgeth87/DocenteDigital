/* DocenteDigital – creatividad controlada para Carpeta Director v17
   V4: la política interna permanece protegida; la superficie del usuario no expone
   listas técnicas ni reglas de motor. En Modo Experto se muestra solo una nota breve.
*/
(function(){
  if(window.__ddDirectorCreativityV17)return;window.__ddDirectorCreativityV17=true;
  state.directorCreativityPolicy=state.directorCreativityPolicy||{mode:'contextual-no-repeat',normsProtected:true,coherenceProtected:true};save();

  const protectedItems=['Norma y base legal verificada','Tipo de instrumento que corresponde a la IE','Datos institucionales aprobados','Estructura mínima exigible','Coherencia PEI → PAT → PCI → RI / DG','Responsables, plazos y metas aprobados','Numeración oficial de RD/oficios','Versiones y vigencia'];
  const variableItems=['Redacción del diagnóstico','Formulación contextualizada de acciones','Estrategias de implementación','Actividades y acciones de mejora','Ejemplos y evidencias sugeridas','Alternativas para atender riesgos o necesidades','Formas de participación de la comunidad','Presentación y redacción no normativa'];

  window.ddDirectorCreativityPolicy={
    protectedItems,
    variableItems,
    rule:'Variar solo lo flexible. Nunca variar, inventar ni reemplazar lo normativo u oficialmente aprobado.'
  };

  const screen=byId('director');
  if(screen&&!byId('ddDirectorCreativityCard')){
    const card=document.createElement('div');
    card.id='ddDirectorCreativityCard';
    card.className='notice topgap expert-only';
    card.innerHTML='<b>Revisión experta:</b> las propuestas pueden adaptarse al contexto, pero los datos institucionales y el sustento normativo deben mantenerse verificados.';
    screen.appendChild(card);
  }
})();