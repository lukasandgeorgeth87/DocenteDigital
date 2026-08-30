/* DocenteDigital – creatividad controlada para Carpeta Director v16 */
(function(){
  if(window.__ddDirectorCreativityV16)return;window.__ddDirectorCreativityV16=true;
  state.directorCreativityPolicy=state.directorCreativityPolicy||{mode:'contextual-no-repeat',normsProtected:true,coherenceProtected:true};save();
  const protectedItems=['Norma y base legal verificada','Tipo de instrumento que corresponde a la IE','Datos institucionales aprobados','Estructura mínima exigible','Coherencia PEI → PAT → PCI → RI / DG','Responsables, plazos y metas aprobados','Numeración oficial de RD/oficios','Versiones y vigencia'];
  const variableItems=['Redacción del diagnóstico','Formulación contextualizada de acciones','Estrategias de implementación','Actividades y acciones de mejora','Ejemplos y evidencias sugeridas','Alternativas para atender riesgos o necesidades','Formas de participación de la comunidad','Presentación y redacción no normativa'];
  window.ddDirectorCreativityPolicy={protectedItems,variableItems,rule:'Variar solo lo flexible. Nunca variar, inventar ni reemplazar lo normativo u oficialmente aprobado.'};
  const screen=byId('director');
  if(screen&&!byId('ddDirectorCreativityCard')){
    const card=document.createElement('div');card.id='ddDirectorCreativityCard';card.className='card topgap';
    card.innerHTML=`<h2>🛡️✨ Creatividad controlada en Gestión</h2><p>Los documentos pueden ser contextualizados y evitar redacciones repetitivas, pero <b>la creatividad nunca está por encima de la normativa ni de los documentos institucionales aprobados</b>.</p><div class="dd-dir-grid"><div><h3>🔒 Se mantiene protegido</h3>${protectedItems.map(x=>`<span>✓ ${escapeHtml(x)}</span>`).join('')}</div><div><h3>✨ Puede variar con pertinencia</h3>${variableItems.map(x=>`<span>↻ ${escapeHtml(x)}</span>`).join('')}</div></div><div class="notice"><b>Regla:</b> si una propuesta novedosa contradice una norma vigente, el PEI/PAT/PCI/RI/DG o los datos reales de la IE, la app debe descartarla.</div>`;
    screen.appendChild(card);
  }
  const css=document.createElement('style');css.textContent=`.dd-dir-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:10px 0}.dd-dir-grid>div{border:1px solid #dbe5df;border-radius:12px;padding:11px;background:#fafcfb}.dd-dir-grid span{display:block;padding:4px 0}@media(max-width:700px){.dd-dir-grid{grid-template-columns:1fr}}`;document.head.appendChild(css);
})();