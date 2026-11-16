/* Prueba real: insumo -> sugerencia anual -> título docente -> contexto de unidad. */
import assert from 'node:assert/strict';
import {chromium} from 'playwright';

const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||undefined});
const page=await browser.newPage({viewport:{width:1365,height:900}});
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
  await page.locator('button[data-screen="inputs"]').click();
  await page.locator('#ddInputName').fill('Calendario comunal de prueba');
  await page.locator('#ddInputFile').setInputFiles({
    name:'calendario.txt',mimeType:'text/plain',buffer:Buffer.from('Marzo: Limpieza colectiva de canales de riego\nAbril: Feria local de semillas')
  });
  await page.waitForFunction(()=>document.querySelector('#ddInputText')?.value.includes('Feria local de semillas'));
  await page.locator('#ddInputSave').click();
  assert.match(await page.locator('#ddInputStatus').innerText(),/Confirma/);
  await page.locator('#ddInputConsent').check();
  await page.locator('#ddInputSave').click();
  assert.match(await page.locator('#ddInputStatus').innerText(),/guardado/i);
  assert.equal(await page.evaluate(()=>window.state.pedagogicalInputs?.length),1);
  await page.reload({waitUntil:'networkidle'});
  assert.equal(await page.evaluate(()=>window.state.pedagogicalInputs?.length),1);
  await page.evaluate(()=>{go('annual');window.DDAnnualPlanning.open();});
  await page.locator('#ddAnnualNewYear').fill('2027');
  await page.locator('#ddAnnualNew').click();
  const march=page.locator('#ddAnnualMonths tr[data-month="Marzo"]');
  assert.match(await march.locator('[data-field="title"]').inputValue(),/Limpieza colectiva de canales/);
  await march.locator('[data-field="title"]').fill('Conservamos el agua de la comunidad');
  await page.locator('#ddAnnualSave').click();
  await march.locator('[data-annual-create]').click();
  assert.equal(await page.locator('#unitTitle').inputValue(),'Conservamos el agua de la comunidad');
  const context=await page.locator('#unitSituation').inputValue();
  assert(context.includes('Limpieza colectiva de canales de riego'),'La propuesta debe usar el evento de marzo declarado por el docente');
  assert(context.includes('Calendario comunal de prueba'),'La propuesta debe identificar el insumo de procedencia');
  // Importar también un DOCX genuino generado en la app y sugerir un nuevo mes.
  await page.evaluate(()=>{go('inputs');window.DDPedagogicalInputs.open();});
  const word=await page.evaluate(async()=>Array.from(new Uint8Array(await window.DDWordExport.createBlob('Calendario de prueba','<h2>Calendario</h2><p>Mayo: Encuentro comunal de saberes y relatos</p>',false).arrayBuffer())));
  await page.locator('#ddInputFile').setInputFiles({name:'calendario.docx',mimeType:'application/vnd.openxmlformats-officedocument.wordprocessingml.document',buffer:Buffer.from(word)});
  await page.waitForFunction(()=>document.querySelector('#ddInputText')?.value.includes('Encuentro comunal de saberes'));
  await page.locator('#ddInputCategory').selectOption('calendar');
  await page.locator('#ddInputConsent').check();
  await page.locator('#ddInputSave').click();
  assert.equal(await page.evaluate(()=>state.pedagogicalInputs.length),2);
  await page.evaluate(()=>{go('annual');window.DDAnnualPlanning.open();});
  assert.equal(await page.locator('#ddAnnualMonths tr[data-month="Marzo"] [data-field="title"]').inputValue(),'Conservamos el agua de la comunidad');
  await page.locator('#ddAnnualSuggest').click();
  assert.match(await page.locator('#ddAnnualMonths tr[data-month="Mayo"] [data-field="title"]').inputValue(),/Encuentro comunal de saberes/);
  assert.equal(await page.locator('#ddAnnualMonths tr[data-month="Marzo"] [data-field="title"]').inputValue(),'Conservamos el agua de la comunidad');
  await page.evaluate(()=>{go('inputs');window.DDPedagogicalInputs.open();});
  assert.match(await page.locator('#ddInputList').innerText(),/Calendario comunal de prueba/);
  console.log('PASS Insumos: archivo importado y revisado, privacidad, persistencia, calendario, título docente y contexto vinculado.');
}finally{await browser.close();}
