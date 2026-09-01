/* DocenteDigital – superficie por rol v69
   V2/V4: el rol explícito orienta la navegación y evita mostrar herramientas de otro rol como si le correspondieran.
   Esta guarda es de UX; NO sustituye autenticación, autorización ni aislamiento multiusuario.
*/
(function(){
  if(window.__ddRoleSurfaceGuardV69)return;window.__ddRoleSurfaceGuardV69=true;

  const tidy=v=>String(v??'').replace(/\s+/g,' ').trim();
  const role=()=>tidy(window.state?.userRole);
  const isDocenteOnly=()=>role()==='Docente';
  const isDirectorOnly=()=>role()==='Director';
  const TEACHER_SCREENS=new Set(['home','plan','session','materials','evaluation']);

  function setHidden(el,hidden){
    el.hidden=hidden;
    el.setAttribute('aria-hidden',hidden?'true':'false');
    if(hidden)el.setAttribute('tabindex','-1');else el.removeAttribute('tabindex');
  }

  function applyRoleSurface(){
    const hideDirector=isDocenteOnly();
    const hideTeacher=isDirectorOnly();

    document.querySelectorAll('[data-screen="director"], [data-dd-go="director"]').forEach(el=>setHidden(el,hideDirector));

    TEACHER_SCREENS.forEach(id=>{
      document.querySelectorAll(`[data-screen="${id}"], [data-dd-go="${id}"]`).forEach(el=>setHidden(el,hideTeacher));
    });

    // Las tarjetas del Inicio no llevan data-screen; las ocultamos solo para Director exclusivo.
    document.querySelectorAll('#home [onclick]').forEach(el=>{
      const action=el.getAttribute('onclick')||'';
      const teacherAction=/\b(?:continueWork|go\(['\"](?:plan|session|materials|evaluation)['\"]\))/.test(action);
      if(teacherAction)setHidden(el,hideTeacher);
    });

    const active=[...document.querySelectorAll('.screen.active')].find(el=>el.id);
    if(active&&hideDirector&&active.id==='director'&&typeof window.go==='function')window.go('home');
    if(active&&hideTeacher&&TEACHER_SCREENS.has(active.id)&&typeof window.go==='function')window.go('director');
  }

  const previousGo=window.go;
  if(typeof previousGo==='function')window.go=function(id){
    if(id==='director'&&isDocenteOnly()){
      previousGo.call(this,'home');
      setTimeout(applyRoleSurface,0);
      alert('Tu perfil está configurado como Docente. Si también cumples funciones de dirección, cambia tu función en Configuración → Ficha Maestra.');
      return;
    }
    if(TEACHER_SCREENS.has(id)&&isDirectorOnly()){
      previousGo.call(this,'director');
      setTimeout(applyRoleSurface,0);
      return;
    }
    const result=previousGo.apply(this,arguments);
    setTimeout(applyRoleSurface,0);
    return result;
  };

  document.addEventListener('click',e=>{
    if(e.target?.closest?.('#ddSaveInstitutionMaster'))setTimeout(applyRoleSurface,30);
  },true);

  const observer=new MutationObserver(()=>applyRoleSurface());
  function start(){
    applyRoleSurface();
    observer.observe(document.body,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();

  window.ddApplyRoleSurface=applyRoleSurface;
})();