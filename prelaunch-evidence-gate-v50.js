/* DocenteDigital – Gate estricto de prelanza V5 v50
   Regla: una comprobación local NO sustituye evidencia física, multiusuario,
   restauración real, piloto ni compatibilidad externa. Nunca convierte presencia
   de código en aprobación de lanzamiento.
*/
(function(){
  if(window.__ddPrelaunchEvidenceGateV50)return;
  window.__ddPrelaunchEvidenceGateV50=true;

  const now=()=>new Date().toISOString();
  const mandatory=[
    {id:'V5-SEC-REAL-001',area:'Seguridad',severity:'S0',label:'Autenticación, autorización y aislamiento entre usuarios/IE',why:'Requiere backend productivo y prueba real de aislamiento; una variable local no demuestra seguridad.'},
    {id:'V5-DOCX-REAL-001',area:'Exportación',severity:'S1',label:'Apertura de DOCX real en Word móvil/escritorio, Google Docs, WPS y LibreOffice',why:'La presencia del generador OOXML no demuestra compatibilidad física ni ausencia de corrupción.'},
    {id:'V5-MOV-REAL-001',area:'Móvil',severity:'S1',label:'Prueba física en celular económico/gama media/tablet',why:'Viewport y responsive de código no sustituyen dispositivo real ni conectividad intermitente.'},
    {id:'V5-BACKUP-REAL-001',area:'Continuidad',severity:'S0',label:'Backup y restauración real',why:'Debe recuperarse información desde una copia real; no basta declarar que existe respaldo.'},
    {id:'V5-E2E-DOC-001',area:'Docente',severity:'S1',label:'E2E Perfil→Programación→Unidad/Proyecto→Sesiones→Materiales→Evaluación→Registro→Seguimiento',why:'Debe probarse la cadena completa sin reescritura ni pérdida de datos.'},
    {id:'V5-E2E-DIR-001',area:'Director',severity:'S1',label:'E2E Perfil→Diagnóstico→Gestión→PAT→Documentación→Evidencias→Informes→Archivo→Seguimiento',why:'El módulo Director no se aprueba por mostrar tarjetas o borradores.'},
    {id:'V5-IA100-001',area:'IA',severity:'S1',label:'100 generaciones + anti-alucinación + finalidades abiertas',why:'Debe medirse coherencia, repetición, invenciones, exactitud y conservación de finalidad.'},
    {id:'V5-PILOT-001',area:'Usuarios reales',severity:'S1',label:'Pilotos reales progresivos',why:'La simplicidad y ahorro real no se pueden aprobar sin docentes/directores reales.'}
  ];

  function run(){
    const results=mandatory.map(x=>({
      ...x,
      status:'PENDIENTE_PRUEBA_REAL',
      passed:false,
      executedAt:now(),
      evidence:'No existe evidencia verificable almacenada por un proceso externo de prueba real.',
      action:'Mantener pendiente y NO declarar lista para lanzar hasta ejecutar y registrar esta prueba.'
    }));
    return {
      id:'PRELAUNCH-V5-'+Date.now(),
      executedAt:now(),
      results,
      blockers:results.filter(r=>r.severity==='S0'||r.severity==='S1').map(r=>r.id),
      productionGate:false,
      classification:'NO_APROBADO_PENDIENTE_EVIDENCIA_REAL'
    };
  }

  function esc(v){
    const s=String(v??'');
    return typeof window.escapeHtml==='function'?window.escapeHtml(s):s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function render(){
    const host=document.getElementById('settings');
    if(!host||document.getElementById('ddPrelaunchEvidenceGate'))return;
    const runResult=run();
    const card=document.createElement('div');
    card.id='ddPrelaunchEvidenceGate';
    card.className='card topgap';
    const rows=runResult.results.map(r=>`<tr><td><b>${esc(r.id)}</b><br><small>${esc(r.area)}</small></td><td>⏳ PENDIENTE REAL</td><td><b>${esc(r.severity)}</b></td><td>${esc(r.label)}</td><td>${esc(r.why)}</td></tr>`).join('');
    card.innerHTML=`<h2>🚧 Gate de prelanza V5</h2><div class="notice"><b>NO APROBADO PARA LANZAMIENTO.</b> Estas pruebas no pueden convertirse en “PASA” por presencia de código, un viewport, un botón, una variable local o un archivo generado. Requieren evidencia real.</div><div style="overflow:auto"><table><thead><tr><th>ID</th><th>Estado</th><th>Severidad</th><th>Prueba obligatoria</th><th>Por qué sigue pendiente</th></tr></thead><tbody>${rows}</tbody></table></div>`;
    host.appendChild(card);
  }

  // Refuerza el resultado programático de la auditoría local sin modificar sus pruebas base.
  const audit=window.ddExecutableAudit;
  if(audit&&typeof audit.runAll==='function'&&!audit.__v50Wrapped){
    const baseRun=audit.runAll.bind(audit);
    audit.runAll=function(){
      const local=baseRun();
      const strict=run();
      return {...local,prelaunchV5:strict,productionGate:false,blockers:[...(local.blockers||[]),...strict.blockers]};
    };
    audit.__v50Wrapped=true;
  }

  const oldGo=window.go;
  if(typeof oldGo==='function')window.go=function(id){
    const r=oldGo.apply(this,arguments);
    if(id==='settings')setTimeout(render,0);
    return r;
  };

  window.ddPrelaunchEvidenceGate={run,mandatory};
  setTimeout(render,0);
})();
