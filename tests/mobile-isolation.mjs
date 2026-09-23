import { chromium } from 'playwright';
const BASE=process.env.BASE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
const timed=(p,ms)=>Promise.race([p.then(x=>x,()=>null),new Promise(r=>setTimeout(()=>r(null),ms))]);
async function probe(label,skip){
  const ctx=await browser.newContext({viewport:{width:393,height:851},isMobile:true,hasTouch:true});
  const page=await ctx.newPage();page.setDefaultTimeout(3500);page.setDefaultNavigationTimeout(12000);
  if(skip!==null){
    await page.route(/\.js(?:\?|$)/,async route=>{
      const file=decodeURIComponent(new URL(route.request().url()).pathname.split('/').pop());
      if(skip(file))await route.fulfill({status:200,contentType:'application/javascript',body:'/* isolated */'});
      else await route.continue();
    });
  }
  try{
    if(label==='minimal touch'){
      await page.setContent('<label id="test"><input type="radio" name="x" value="ok"><span>Tap me</span></label>');
      const outcome=await timed(page.locator('#test').tap({timeout:3000}).then(()=>page.locator('#test input').isChecked()),5500);
      console.log('DIAGNOSTIC',label,JSON.stringify({tap:outcome}));
      return;
    }
    await page.goto(BASE,{waitUntil:'load'});
    const radio=page.locator('input[name="ddLevel"][value="Inicial"]');
    const present=await radio.count();
    const status=await timed(page.evaluate(()=>({ready:!!window.__ddSetupNativeV3,level:window.state?.level,bodyClass:document.body.className,active:document.querySelector('.screen.active')?.id})),2000);
    const tap=await timed(radio.locator('..').tap({timeout:3500}).then(()=>radio.isChecked()),6000);
    const after=await timed(page.evaluate(()=>({level:window.state?.level,checked:document.querySelector('input[name="ddLevel"][value="Inicial"]')?.checked,status:document.getElementById('ddNativeSelectionStatus')?.textContent})),2000);
    console.log('DIAGNOSTIC',label,JSON.stringify({present,status,tap,after}));
  }catch(e){console.log('DIAGNOSTIC',label,'ERROR',e.message.slice(0,280));}
  finally{await timed(ctx.close(),2500);}
}
try{
 await probe('minimal touch',null);
 await probe('app + native', f=>!['app.js','setup-native-v2.js','storage-recovery-v26.js'].includes(f));
 await probe('full except optional observer guards',f=>['role-surface-guard-v68.js','easy-surface-simplicity-v55.js','home-surface-truth-v73.js'].includes(f));
 await probe('full except initial guard',f=>f==='initial-curriculum-guard-v72.js');
 await probe('full app',null);
}finally{await timed(browser.close(),2500);}
