/* DocenteDigital – navegación móvil completa v60
   V4: las funciones principales no deben quedar inaccesibles en celular.
   Mantiene cinco accesos frecuentes y agrega “Más” para Director y Configuración.
*/
(function(){
  if(window.__ddMobileNavigationGuardV60)return;window.__ddMobileNavigationGuardV60=true;

  function mount(){
    const nav=document.querySelector('.mobile-nav');
    if(!nav||document.getElementById('ddMobileMoreBtn'))return;

    const more=document.createElement('button');
    more.type='button';
    more.id='ddMobileMoreBtn';
    more.setAttribute('aria-haspopup','true');
    more.setAttribute('aria-expanded','false');
    more.innerHTML='<b>☰</b>Más';
    nav.appendChild(more);

    const menu=document.createElement('div');
    menu.id='ddMobileMoreMenu';
    menu.className='dd-mobile-more-menu hidden';
    menu.setAttribute('role','menu');
    menu.innerHTML='<button type="button" data-dd-go="director" role="menuitem">🏫 <span>Director</span></button><button type="button" data-dd-go="settings" role="menuitem">⚙️ <span>Configuración</span></button>';
    document.body.appendChild(menu);

    const close=()=>{menu.classList.add('hidden');more.setAttribute('aria-expanded','false');};
    more.addEventListener('click',e=>{
      e.preventDefault();e.stopPropagation();
      const opening=menu.classList.contains('hidden');
      menu.classList.toggle('hidden',!opening);
      more.setAttribute('aria-expanded',opening?'true':'false');
    });
    menu.addEventListener('click',e=>{
      const b=e.target.closest('[data-dd-go]');if(!b)return;
      const target=b.dataset.ddGo;
      close();
      if(typeof window.go==='function')window.go(target);
    });
    document.addEventListener('click',e=>{if(!menu.contains(e.target)&&e.target!==more)close();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
  }

  const css=document.createElement('style');
  css.textContent=`
    @media(max-width:850px){
      .mobile-nav{grid-template-columns:repeat(6,1fr)!important}
      .dd-mobile-more-menu{position:fixed;right:12px;bottom:78px;z-index:45;min-width:210px;padding:7px;background:#fff;border:1px solid var(--line);border-radius:16px;box-shadow:0 14px 35px rgba(20,50,80,.22)}
      .dd-mobile-more-menu button{display:flex;width:100%;gap:10px;align-items:center;border:0;background:#fff;border-radius:11px;padding:12px;color:var(--text);font-weight:800;text-align:left}
      .dd-mobile-more-menu button:active,.dd-mobile-more-menu button:focus{background:#eaf7f5;outline:2px solid var(--p);outline-offset:1px}
    }
  `;
  document.head.appendChild(css);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();