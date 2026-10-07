import { chromium } from 'playwright';
const BASE=process.env.BASE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
const scripts=[
'storage-recovery-v26.js','storage-access-guard-v71.js','app.js','official-curriculum-v1.js',
'pedagogical-source-base-v1.js','export-fallback-guard-v39.js','director-prototype-guard-v40.js',
'initial-curriculum-guard-v72.js','enhancements.js','planning-structure-v1.js','format-v2.js',
'teacher-context-v1.js','proposal-choice-v8.js','schedule-v3.js','strategies-v4.js',
'master-session-v1.js','resources-v5.js','schedule-prompt-v6.js','ai-library-router-v1.js',
'materials-v1.js','evaluation-v1.js','sesiones-maestras-core-v1.js','planning-tools-v1.js',
'director-v1.js','docx-export-v29.js','persistence-truth-v63.js',
'mobile-navigation-guard-v60.js','beta-launch-safety-v1.js','initial-surface-guard-v1.js',
'product-audit-runtime-v1.js','setup-native-v2.js'
];
const seed={level:'Inicial',ieType:'Polidocente',grades:['4 años'],areas:['Comunicación'],linguisticMode:'Monolingüe castellano',language:'Castellano',quechuaVar:'Ninguna',indigenousLanguage:'Ninguna',linguisticSelectionConfirmed:false,units:[]};
const timed=(p,ms)=>Promise.race([p.then(x=>x,()=>null),new Promise(r=>setTimeout(()=>r(null),ms))]);
async function probe(count,excluding=[]){
 const context=await browser.newContext({viewport:{width:393,height:851},isMobile:true,hasTouch:true});
 await context.addInitScript(value=>{if(location.hostname==='127.0.0.1')localStorage.setItem('docenteDigitalPrototype',JSON.stringify(value));},seed);
 const page=await context.newPage();
 await page.route(/\.js(?:\?|$)/,async route=>{
  const file=new URL(route.request().url()).pathname.split('/').pop();
  if(!scripts.slice(0,count).includes(file)||excluding.includes(file)){
    await route.fulfill({status:200,contentType:'application/javascript',body:'/* isolated */'});
  }else await route.continue();
 });
 let nav=await timed(page.goto(BASE,{waitUntil:'domcontentloaded',timeout:2300}).then(()=>true),2500);
 let data=await timed(page.evaluate(()=>({active:document.querySelector('.screen.active')?.id,level:window.state?.level,ready:window.__ddPlanningRuntimeReady})),1400);
 console.log('PREFIX',count,'EXCLUDING',excluding,'NAV',nav,'DATA',JSON.stringify(data));
 await timed(context.close(),1200);
}
try{
 for(const n of [26,28,29,30,31])await probe(n,['schedule-prompt-v6.js','initial-curriculum-guard-v72.js']);
 await probe(31,['schedule-prompt-v6.js','initial-curriculum-guard-v72.js','product-audit-runtime-v1.js']);
 await probe(31,['schedule-prompt-v6.js','initial-curriculum-guard-v72.js','setup-native-v2.js']);
 await probe(31,['schedule-prompt-v6.js','initial-curriculum-guard-v72.js','initial-surface-guard-v1.js']);
}finally{await timed(browser.close(),2000);}
