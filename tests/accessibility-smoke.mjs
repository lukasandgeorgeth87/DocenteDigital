import { chromium } from 'playwright';

const baseUrl=process.env.BASE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1280,height:720}});
const page=await context.newPage();

function assert(condition,message){if(!condition)throw new Error(message);}

try{
  console.log('A11Y 1/4 Documento y navegación base');
  await page.goto(baseUrl,{waitUntil:'domcontentloaded'});
  const lang=await page.locator('html').getAttribute('lang');
  assert((lang||'').toLowerCase().startsWith('es'),'El documento no declara idioma español');
  assert((await page.title()).trim().length>0,'La página no tiene título');
  const mainCount=await page.locator('main').count();
  assert(mainCount===1,'Debe existir un único elemento main');

  console.log('A11Y 2/4 Controles visibles con nombre accesible');
  const unnamed=await page.evaluate(()=>{
    const visible=el=>{
      const s=getComputedStyle(el);const r=el.getBoundingClientRect();
      return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0;
    };
    const name=el=>{
      const aria=(el.getAttribute('aria-label')||'').trim();
      if(aria)return aria;
      const labelledby=(el.getAttribute('aria-labelledby')||'').trim();
      if(labelledby){const text=labelledby.split(/\s+/).map(id=>document.getElementById(id)?.textContent||'').join(' ').trim();if(text)return text;}
      const text=(el.textContent||'').replace(/\s+/g,' ').trim();
      if(text)return text;
      const title=(el.getAttribute('title')||'').trim();
      if(title)return title;
      if(el.id){const label=document.querySelector(`label[for="${CSS.escape(el.id)}"]`);if((label?.textContent||'').trim())return label.textContent.trim();}
      const parent=el.closest('label');if((parent?.textContent||'').trim())return parent.textContent.trim();
      return '';
    };
    return [...document.querySelectorAll('button,a[href],input:not([type="hidden"]),select,textarea')]
      .filter(visible).filter(el=>!name(el)).map(el=>`${el.tagName.toLowerCase()}#${el.id||''}.${el.className||''}`).slice(0,20);
  });
  assert(unnamed.length===0,`Hay controles visibles sin nombre accesible: ${unnamed.join(' | ')}`);

  console.log('A11Y 3/4 Teclado y foco básico');
  await page.keyboard.press('Tab');
  const focusInfo=await page.evaluate(()=>({tag:document.activeElement?.tagName||'',body:document.activeElement===document.body,disabled:document.activeElement?.disabled===true}));
  assert(!focusInfo.body&&['BUTTON','A','INPUT','SELECT','TEXTAREA'].includes(focusInfo.tag),`Tab no llegó a un control interactivo: ${JSON.stringify(focusInfo)}`);
  assert(!focusInfo.disabled,'El foco inicial cayó en un control deshabilitado');

  console.log('A11Y 4/4 Móvil: menú Más operable y estado expuesto');
  await page.setViewportSize({width:390,height:844});
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForSelector('#ddMobileMoreBtn',{timeout:10000});
  const more=page.locator('#ddMobileMoreBtn');
  const label=(await more.getAttribute('aria-label'))||(await more.textContent())||'';
  assert(label.trim().length>0,'Botón Más no tiene nombre accesible');
  await more.focus();
  await page.keyboard.press('Enter');
  const menu=page.locator('#ddMobileMoreMenu');
  assert(await menu.isVisible(),'El menú Más no se abre con teclado');
  const director=menu.locator('[data-dd-go="director"]');
  assert(await director.count()===1,'Director no está disponible en menú móvil');

  console.log('ACCESSIBILITY_SMOKE_PASS');
}finally{
  await browser.close();
}
