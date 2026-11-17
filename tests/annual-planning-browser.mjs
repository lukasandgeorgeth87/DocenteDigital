/* Programación anual real: sugerencia mensual → unidad → título sincronizado → Word. */
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

const out=process.env.EVIDENCE_DIR||'/tmp/dd-commercial-evidence';
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||undefined});
const page=await browser.newPage({viewport:{width:1365,height:900},acceptDownloads:true});
try{
  await page.goto(process.env.BASE_URL||'http://127.0.0.1:4173',{waitUntil:'networkidle'});
  await page.evaluate(()=>localStorage.clear());
  await page.reload({waitUntil:'networkidle'});
  await page.locator('input[name="ddLevel"][value="Primaria"]').locator('..').click();
  await page.locator('input[name="ddIE"][value="Polidocente"]').locator('..').click();
  await page.locator('[data-dd-grade-group="Primaria"] input[value="3.º"]').locator('..').click();
  await page.locator('[data-dd-area-group="Primaria"] input[value="Comunicación"]').locator('..').click();
  await page.locator('#linguisticMode').selectOption('Monolingüe castellano');
  await page.locator('#ddSetupNativeForm button[type="submit"]').click();
  await page.waitForFunction(()=>window.state?.level==='Primaria'&&typeof window.go==='function',null,{timeout:20000});
  await page.evaluate(()=>{go('annual');window.DDAnnualPlanning.open();});
  await page.locator('#ddAnnualNewYear').fill('2027');
  await page.locator('#ddAnnualNew').click();
  const march=page.locator('#ddAnnualMonths tr[data-month="Marzo"]');
  await march.locator('[data-field="title"]').fill('Convivimos y nos escuchamos en clase');
  await march.locator('[data-annual-create]').click();
  assert.equal(await page.locator('#unitTitle').inputValue(),'Convivimos y nos escuchamos en clase');
  const autoContext=await page.locator('#unitSituation').inputValue();
  assert(autoContext.includes('Convivimos y nos escuchamos en clase'),'El título elegido debe determinar el contexto propuesto');
  assert(autoContext.includes('3.º'),'El perfil previamente configurado debe reutilizarse sin preguntas adicionales');
  await page.waitForFunction(()=>document.querySelector('#unitType')?.value==='Unidad de aprendizaje',null,{timeout:8000});
  await page.locator('#unitTitle').fill('Creamos acuerdos para escuchar todas las voces');
  await page.locator('button[onclick="createUnitDemo()"]',{hasText:'Crear propuesta completa'}).click();
  await page.waitForSelector('#ddProposalChooser:not(.hidden)',{timeout:20000});
  await page.locator('input[name="ddSituation"]').first().check();
  await page.locator('#ddContinueProducts').click();
  await page.waitForSelector('input[name="ddProduct"]');
  await page.locator('input[name="ddProduct"]').first().check();
  await page.locator('#ddBuildUnit').click();
  await page.waitForFunction(()=>window.state.units?.length>0,null,{timeout:20000});
  // La ruta V2 certificada se limita hoy a derechos en 2.º de Primaria.
  // Este caso comprueba que la programación funcione para una unidad libre
  // de 3.º, sin presumir que pasó por un motor aún no generalizado.
  const info=await page.evaluate(()=>({unit:state.units[0],pending:state.annualPendingUnit,plan:state.annualPlans[0]}));
  assert.equal(info.unit.annualMonth,'Marzo');
  assert.equal(info.unit.annualPlanId,info.plan.id);
  assert.equal(info.plan.months.find(m=>m.name==='Marzo').title,info.unit.title);
  assert(!info.pending);
  const annualPrint=await page.evaluate(()=>{
    const unit=state.units[0],plan=state.annualPlans[0];
    const text=new DOMParser().parseFromString(window.DDAnnualPlanning.printHtml(plan),'text/html').body.textContent;
    return {text,product:unit.productTitle||unit.product,context:unit.situationBrief||unit.situation};
  });
  assert(annualPrint.text.includes(annualPrint.product),'El Word anual no recuperó el producto de la unidad vinculada');
  assert(annualPrint.text.includes(annualPrint.context.slice(0,65)),'El Word anual no recuperó el contexto real de la unidad');
  // Prueba el cambio real de título desde la interfaz, no desde el estado.
  await page.evaluate(id=>viewUnit(id),info.unit.id);
  await page.getByRole('button',{name:'Cambiar título'}).click();
  await page.locator('#unitRenameTitle').fill('Escuchamos y dialogamos para convivir mejor');
  await page.getByRole('button',{name:'Guardar título'}).click();
  await page.evaluate(()=>{go('annual');window.DDAnnualPlanning.open();});
  const reflected=await page.locator('#ddAnnualMonths tr[data-month="Marzo"] [data-field="title"]').inputValue();
  assert.equal(reflected,'Escuchamos y dialogamos para convivir mejor');
  assert.equal(await page.locator('#ddAnnualMonths tr').count(),10);
  assert.match(await page.locator('#ddAnnualMonths tr[data-month="Marzo"] [data-annual-product]').innerText(),/Producto sugerido:/);
  await page.screenshot({path:path.join(out,'08-programacion-anual-en-la-app.png'),fullPage:true});
  const download=page.waitForEvent('download',{timeout:20000});
  await page.locator('#ddAnnualDownload').click();
  const file=await download;
  const location=path.join(out,'08-programacion-anual-2027.docx');
  await file.saveAs(location);
  const bytes=await fs.readFile(location);
  assert.equal(bytes.toString('latin1',0,2),'PK');
  await page.evaluate(()=>{go('documents');window.DDDocumentLibrary.open();});
  await page.waitForSelector('#documentsList [data-doc^="anual:"]');
  await page.reload({waitUntil:'networkidle'});
  assert.equal(await page.evaluate(()=>state.annualPlans[0].months.find(m=>m.name==='Marzo').title),'Escuchamos y dialogamos para convivir mejor');
  assert.equal(await page.evaluate(()=>state.units[0].annualMonth),'Marzo');
  await fs.writeFile(path.join(out,'resultado-anual.json'),JSON.stringify({case:'Primaria 3.º · Marzo 2027',months:10,unitCreated:true,titleSynchronized:true,docxDownloaded:true,persisted:true},null,2));
  console.log('PASS Programación anual: 10 meses, sugerencia editable, unidad vinculada, título sincronizado y Word.');
}catch(error){
  await fs.writeFile(path.join(out,'error-anual.txt'),String(error.stack||error));
  throw error;
}finally{await browser.close();}
