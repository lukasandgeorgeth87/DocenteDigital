/* DocenteDigital – superficie por rol v68
   V2/V4: el rol explícito orienta la navegación y evita mostrar funciones directivas a quien eligió solo Docente.
   Esta guarda es de UX; NO sustituye autenticación, autorización ni aislamiento multiusuario.
*/
(function(){
  if(window.__ddRoleSurfaceGuardV68)return;window.__ddRoleSurfaceGuardV68=true;

  const tidy=v=>String(v??'').replace(/\s+/g,' ').trim();
  const isDocenteOnly=()=>tidy(window.state?.userRole)==='Docente';

  function applyRoleSurface(){
    const hideDirector=isDocenteOnly();
    document.querySelectorAll('[data-screen="director"], [data-dd-go="director"]').forEach(el=>{
      el.hidden=hideDirector;
      el.setAttribute('aria-hidden',hideDirector?'true':'false');
      if(hideDirector)el.setAttribute('tabindex','-1');else el.removeAttribute('tabindex');
    });
    const director=document.getElementById('director');
    if(director&&hideDirector&&director.classList.contains('active')){
      if(typeof window.go==='function')window.go('home');
    }
  }

  const previousGo=window.go;
  if(typeof previousGo==='function')window.go=function(id){
    if(id==='director'&&isDocenteOnly()){
      previousGo.call(this,'home');
      setTimeout(applyRoleSurface,0);
      alert('Tu perfil está configurado como Docente. Si también cumples funciones de dirección, cambia tu función en Configuración → Ficha Maestra.');
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