import { chromium } from 'playwright';
const BASE=process.env.BASE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
const timed=(p,ms)=>Promise.race([p.then(x=>x,()=>null),new Promise(r=>setTimeout(()=>r(null),ms))]);
const seed={level:'Inicial',ieType:'Polidocente',grades:['4 años'],areas:['Comunicación'],linguisticMode:'Monolingüe castellano',language:'Castellano',quechuaVar:'Ninguna',indigenousLanguage:'Ninguna',linguisticSelectionConfirmed:false,units:[]};
async function probe(label,skip){
  const ctx=await browser.newContext({viewport:{width:393,height:851},isMobile:true,hasTouch:true});
  await ctx.addInitScript(value=>{
    try{if(location.hostname==='127.0.0.1')localStorage.setItem('docenteDigitalPrototype',JSON.stringify(value));}catch(e){}
  },seed);
  const p=await ctx.newPage();
  p.setDefaultTimeout(2000);p.setDefaultNavigationTimeout(9000);
  const errs=[];
  p.on('pageerror',e=>errs.push(e.message.slice(0,160)));
  if(skip!==null)await p.route(/\.js(?:\?|$)/,async route=>{
    const file=new URL(route.request().url()).pathname.split('/').pop();
    if(skip(file))await route.fulfill({status:200,contentType:'application/javascript',body:'/* isolated */'});
    else await route.continue();
  });
  try{
    const nav=await timed(p.goto(BASE,{waitUntil:'domcontentloaded',timeout:8500}).then(()=>true),9200);
    const evaluated=await timed(p.evaluate(()=>({title:document.title,level:window.state?.level,home:!!document.getElementById('home')?.classList.contains('active'),runtime:window.__ddPlanningRuntimeReady||false})),2500);
    console.log('LOADED',label,JSON.stringify({nav,url:p.url(),evaluated,errors:errs.slice(0,3)}));
  }catch(e){console.log('LOADED',label,'ERROR',e.message.slice(0,200),errs.slice(0,2));}
  finally{await timed(ctx.close(),1500);}
}
try{
 await probe('baseline',f=>!['storage-recovery-v26.js','app.js','setup-native-v2.js'].includes(f));
 await probe('full without schedule loader',f=>f==='schedule-prompt-v6.js');
 await probe('full without initial guard',f=>f==='initial-curriculum-guard-v72.js');
 await probe('full without two loaders',f=>['schedule-prompt-v6.js','initial-curriculum-guard-v72.js'].includes(f));
 await probe('full without audit guards',f=>['role-surface-guard-v68.js','easy-surface-simplicity-v55.js','home-surface-truth-v73.js'].includes(f));
 await probe('full app',null);
}finally{await timed(browser.close(),3000);}
