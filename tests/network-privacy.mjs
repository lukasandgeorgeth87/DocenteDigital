import { chromium } from 'playwright';

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:4173';
const allowedOrigin = new URL(baseUrl).origin;
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await context.newPage();
const external = [];

function assert(condition, message){ if(!condition) throw new Error(message); }

page.on('request', request => {
  const type = request.resourceType();
  if(!['fetch','xhr','websocket','eventsource'].includes(type)) return;
  let url;
  try{ url = new URL(request.url()); }catch{ return; }
  if(url.origin !== allowedOrigin){
    external.push({type, method:request.method(), url:request.url()});
  }
});

try{
  console.log('PRIVACY 1/3 Carga y configuración');
  await page.goto(baseUrl,{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>localStorage.clear());
  await page.reload({waitUntil:'domcontentloaded'});
  await page.locator('#step1 .choice',{hasText:'Primaria'}).click();
  await page.locator('#step1 .btn',{hasText:'Continuar'}).click();
  await page.locator('#step2 .choice',{hasText:'Multigrado'}).click();
  await page.locator('#step2 .btn',{hasText:'Continuar'}).click();
  for(const grade of ['1.º','3.º','5.º']) await page.locator('#gradeChoices .choice',{hasText:grade}).click();
  await page.locator('#step3 .btn',{hasText:'Continuar'}).click();
  for(const area of ['Comunicación','Matemática']) await page.locator('#areaChoices .choice',{hasText:area}).click();
  await page.locator('#linguisticMode').selectOption({label:'Monolingüe castellano'});
  await page.locator('#step4 .btn',{hasText:'Guardar y entrar'}).click();

  console.log('PRIVACY 2/3 Entrada sensible simulada sin envío');
  await page.waitForFunction(()=>window.__ddPlanningRuntimeReady===true,null,{timeout:20000});
  await page.evaluate(()=>window.go('plan'));
  await page.locator('button[onclick="showUnit()"]',{hasText:'Crear nueva'}).click();
  const chooser=page.locator('#ddPlanningKindChooser');
  if(await chooser.count()){
    await chooser.waitFor({state:'visible',timeout:10000});
    const unitKind=chooser.locator('[data-kind="Unidad de aprendizaje"]');
    if(await unitKind.count())await unitKind.click();
  }
  const marker='PRIVACY_TEST_DO_NOT_SEND_9f76e3';
  await page.locator('#unitSituation').fill(`Queremos trabajar una situación educativa ${marker}.`);
  const create=page.locator('button[onclick="createUnitDemo()"]');
  await create.waitFor({state:'visible',timeout:10000});
  await create.click();
  await page.waitForSelector('#ddProposalChooser:not(.hidden)',{timeout:10000});

  console.log('PRIVACY 3/3 Verificación de red');
  await page.waitForTimeout(800);
  assert(external.length===0,`La Beta realizó solicitudes de datos a orígenes externos: ${JSON.stringify(external)}`);
  console.log('NETWORK_PRIVACY_PASS');
}finally{
  await browser.close();
}
