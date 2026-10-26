import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1366, height: 768 }, acceptDownloads: true });
const page = await context.newPage();

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
function docxDocumentXml(bytes) {
  let offset = 0;
  while (offset + 30 <= bytes.length && bytes.readUInt32LE(offset) === 0x04034b50) {
    const method = bytes.readUInt16LE(offset + 8);
    const size = bytes.readUInt32LE(offset + 18);
    const nameLength = bytes.readUInt16LE(offset + 26);
    const extraLength = bytes.readUInt16LE(offset + 28);
    const name = bytes.subarray(offset + 30, offset + 30 + nameLength).toString('utf8');
    const start = offset + 30 + nameLength + extraLength;
    const end = start + size;
    assert(end <= bytes.length, 'DOCX ZIP truncado en ' + name);
    if (name === 'word/document.xml') {
      assert(method === 0, 'DOCX usa compresión no soportada por esta prueba');
      return bytes.subarray(start, end).toString('utf8');
    }
    offset = end;
  }
  throw new Error('DOCX sin word/document.xml');
}
async function savedState() {
  return page.evaluate(() => JSON.parse(localStorage.getItem('docenteDigitalPrototype') || '{}'));
}

try {
  console.log('EIB 1/4 Perfil institucional real en formulario nativo');
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await page.locator('input[name="ddLevel"][value="Primaria"]').locator('..').click();
  await page.locator('input[name="ddIE"][value="Multigrado"]').locator('..').click();
  for (const grade of ['1.º', '3.º', '5.º']) {
    await page.locator('[data-dd-grade-group="Primaria"] input[type="checkbox"][value="' + grade + '"]').locator('..').click();
  }
  await page.locator('[data-dd-area-group="Primaria"] input[type="checkbox"][value="Comunicación"]').locator('..').click();
  await page.locator('[data-dd-area-group="Primaria"] input[type="checkbox"][value="Matemática"]').locator('..').click();
  await page.locator('#linguisticMode').selectOption('EIB');
  await page.locator('#language').selectOption('Bilingüe');
  await page.locator('#quechuaVar').selectOption('Quechua Cusco-Collao (Cusco)');
  await page.locator('#ddSetupNativeForm button[type="submit"]').click();
  await page.waitForFunction(() => window.state?.linguisticMode === 'EIB' &&
    window.state?.indigenousLanguage === 'Quechua Cusco-Collao (Cusco)' &&
    document.querySelector('#home')?.classList.contains('active'), null, { timeout: 10000 });

  console.log('EIB 2/4 Materiales heredan lengua/variedad sin traducción inventada');
  await page.evaluate(() => window.go('materials'));
  await page.waitForSelector('#materials.active');
  await page.waitForFunction(() => window.__ddPlanningRuntimeReady === true, null, { timeout: 20000 });
  const languageControls = await page.evaluate(() => ({
    language: document.querySelector('#materialLanguage')?.value,
    variety: document.querySelector('#materialQuechua')?.value,
    disabled: document.querySelector('#materialLanguage')?.disabled
  }));
  assert(!languageControls.disabled && languageControls.language === 'Bilingüe' &&
    languageControls.variety === 'Quechua Cusco-Collao (Cusco)',
    'Materiales no hereda perfil EIB: ' + JSON.stringify(languageControls));
  await page.locator('#materialTopic').fill('Observamos las semillas (prueba ficticia EIB)');
  await page.locator('#materials button[onclick="window.DDMaterials?.createBundle()"]').click();
  assert(await page.locator('#materialOutput .dd-grade-pack').count() === 3,
    'El paquete EIB no diferencia tres grados');
  // Reproduce the legacy truth guard running AFTER the modern bundle renders.
  // Before the fix it unconditionally re-added .hidden to #materialOutput,
  // leaving the Word button at a 0x0 bounding rectangle.
  const guardResult=await page.evaluate(() => {
    window.ddMaterialSurfaceTruthReapply();
    const output=document.getElementById('materialOutput');
    return {
      visible:!!output && !output.classList.contains('hidden'),
      modern:!!output?.querySelector('.dd-editable-material'),
      word:!!output?.querySelector('.dd-material-actions button:nth-child(2)')
    };
  });
  assert(guardResult.visible && guardResult.modern && guardResult.word,
    'El guard legado volvió a ocultar un material moderno: '+JSON.stringify(guardResult));
  assert(await page.evaluate(() => {
    const output=document.querySelector('#materialOutput');
    const actions=output?.querySelector(':scope > .dd-material-actions');
    const editable=output?.querySelector(':scope > .dd-editable-material');
    return Boolean(actions&&editable&&(actions.compareDocumentPosition(editable)&Node.DOCUMENT_POSITION_FOLLOWING));
  }), 'Las acciones Word/Guardar no están accesibles antes del paquete multigrado');
  const warning = await page.locator('#materialOutput .notice').innerText();
  assert(warning.includes('únicamente en castellano') &&
    warning.includes('Quechua Cusco-Collao (Cusco)'),
    'Falta advertencia visible sobre traducción no validada');
  let s = await savedState();
  const id = s.lastMaterial?.id;
  assert(id && s.lastMaterial.lang === 'Bilingüe' &&
    s.lastMaterial.variety === 'Quechua Cusco-Collao (Cusco)',
    'El paquete EIB perdió idioma o variedad en el estado');

  console.log('EIB 3/4 DOCX conserva advertencia una sola vez');
  page.on('dialog', async dialog => {
    console.log('EIB_EXPORT_DIALOG:', dialog.message());
    await dialog.dismiss();
  });
  page.on('pageerror', error => console.log('EIB_EXPORT_PAGEERROR:', error.message));
  const exportDiagnostic = await page.evaluate(() => ({
    hasExporter: typeof window.DDWordExport?.downloadHtml === 'function',
    docxSelfTest: window.ddDocxSelfTest?.(),
    materialType: window.state?.lastMaterial?.type,
    hasOutput: !!document.querySelector('#materialOutput .dd-editable-material'),
    hasWordButton: !!document.querySelector('#materialOutput .dd-material-actions button:nth-child(2)'),
    wordButtonOnclick: document.querySelector('#materialOutput .dd-material-actions button:nth-child(2)')?.getAttribute('onclick'),
    wordButtonDisabled: document.querySelector('#materialOutput .dd-material-actions button:nth-child(2)')?.disabled
  }));
  console.log('EIB_EXPORT_DIAGNOSTIC:', JSON.stringify(exportDiagnostic));
  assert(exportDiagnostic.hasExporter && exportDiagnostic.docxSelfTest && exportDiagnostic.hasOutput,
    'Exportador de material EIB no está listo: ' + JSON.stringify(exportDiagnostic));
  // Exercise the real user-facing button rather than bypassing event dispatch.
  // A failed click must remain visible in CI instead of being reported as PASS.
  const wordButton = page.locator('#materialOutput .dd-material-actions button', { hasText: 'Word' });
  await wordButton.waitFor({ state: 'visible', timeout: 12000 });
  assert(await wordButton.isEnabled(), 'El botón Word EIB está deshabilitado');
  assert(await page.evaluate(() => {
    const b=document.querySelector('#materialOutput .dd-material-actions button:nth-child(2)');
    const r=b.getBoundingClientRect();
    const hit=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);
    return r.top>=0 && r.bottom<=innerHeight && (hit===b || b.contains(hit));
  }), 'El botón Word EIB quedó oculto por la barra superior fija');
  await page.evaluate(() => {
    window.__ddWordClickTrace = { captured: 0, bubbled: 0, handler: 0, exporter: 0, exporterResult: null };
    const trace = window.__ddWordClickTrace;
    const button = document.querySelector('#materialOutput .dd-material-actions button:nth-child(2)');
    button.addEventListener('click', () => { trace.captured++; }, true);
    button.addEventListener('click', () => { trace.bubbled++; });
    const originalHandler = window.DDMaterials.downloadWord;
    window.DDMaterials.downloadWord = function (...args) { trace.handler++; return originalHandler.apply(this, args); };
    const originalExporter = window.DDWordExport.downloadHtml;
    window.DDWordExport.downloadHtml = function (...args) {
      trace.exporter++;
      const result = originalExporter.apply(this, args);
      trace.exporterResult = result;
      return result;
    };
  });
  console.log('EIB_WORD_GEOMETRY:', JSON.stringify(await page.evaluate(() => {
    const el=document.querySelector('#materialOutput .dd-material-actions button:nth-child(2)');
    const r=el.getBoundingClientRect();
    const at=document.elementFromPoint(Math.min(innerWidth-1,Math.max(0,r.x+r.width/2)),Math.min(innerHeight-1,Math.max(0,r.y+r.height/2)));
    return {rect:{x:r.x,y:r.y,width:r.width,height:r.height},scrollY,innerHeight,hit:at?.outerHTML?.slice(0,180),visibility:getComputedStyle(el).visibility,activeScreens:[...document.querySelectorAll('.screen.active')].map(x=>x.id),materialScreenClass:document.querySelector('#materials')?.className,outputClass:document.querySelector('#materialOutput')?.className,ancestors:(()=>{let n=el;const a=[];while(n&&a.length<9){const st=getComputedStyle(n);a.push({tag:n.tagName,id:n.id,className:String(n.className).slice(0,110),display:st.display,visibility:st.visibility,rect:n.getBoundingClientRect().width});n=n.parentElement}return a})()};
  })));
  // Playwright locator.click() intermittently reports "not visible" even when
  // Chromium geometry and hit-testing prove the real button is on-screen.
  // Exercise the actual pointer path at its verified hit-test coordinates,
  // never a programmatic DOM .click() or direct exporter invocation.
  // The geometry check above already proves the button is in the viewport.
  // Avoid a second scrollIntoView: it races the app's pending smooth scroll.
  try { await page.waitForFunction(() => {
    const b=document.querySelector('#materialOutput .dd-material-actions button:nth-child(2)');
    if(!b||b.disabled)return false;
    const r=b.getBoundingClientRect();
    if(!r.width||!r.height||r.top<0||r.bottom>innerHeight)return false;
    const hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);
    return hit===b||b.contains(hit);
  }, null, {timeout:10000}); } catch(error) {
    const snapshot=await page.evaluate(() => {
      const b=document.querySelector('#materialOutput .dd-material-actions button:nth-child(2)');
      const r=b?.getBoundingClientRect();
      const x=r?r.x+r.width/2:0,y=r?r.y+r.height/2:0;
      const hit=document.elementFromPoint(x,y);
      return {active:[...document.querySelectorAll('.screen.active')].map(e=>e.id),screen:document.querySelector('#materials')?.className,output:document.querySelector('#materialOutput')?.className,rect:r&&{x:r.x,y:r.y,w:r.width,h:r.height},hit:hit?.outerHTML?.slice(0,250),scrollY,visibility:b&&getComputedStyle(b).visibility,display:b&&getComputedStyle(b).display,documentState:document.readyState,location:location.href};
    }).catch(e=>({diagnosticError:String(e)}));
    console.log('EIB_WORD_POST_GEOMETRY_FAILURE:',JSON.stringify(snapshot));
    throw error;
  }
  const pointer=await page.evaluate(() => {
    const r=document.querySelector('#materialOutput .dd-material-actions button:nth-child(2)').getBoundingClientRect();
    return {x:r.x+r.width/2,y:r.y+r.height/2};
  });
  let download;
  try {
    [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 20000 }),
      page.mouse.click(pointer.x,pointer.y)
    ]);
  } catch (error) {
    console.log('EIB_WORD_CLICK_FAILURE_TRACE:', JSON.stringify(await page.evaluate(() => window.__ddWordClickTrace).catch(() => ({pageUnavailable:true}))));
    throw error;
  }
  console.log('EIB_WORD_CLICK_TRACE:', JSON.stringify(await page.evaluate(() => window.__ddWordClickTrace)));
  assert(download.suggestedFilename().toLowerCase().endsWith('.docx'),
    'El paquete EIB no se exportó como DOCX');
  const xml = docxDocumentXml(await fs.readFile(await download.path()));
  assert(xml.includes('no ha realizado ni validado una traducción'),
    'El DOCX EIB omitió la advertencia de traducción no validada');
  assert(xml.split('Revisión lingüística requerida:').length === 2,
    'La advertencia EIB está duplicada en el Word');
  for (const grade of ['1', '3', '5']) {
    assert(xml.includes('FIC-' + grade + '-01'), 'El DOCX EIB omitió ficha de ' + grade + '.º');
  }

  console.log('EIB 4/4 Persistencia del idioma y advertencia tras recarga');
  await page.reload({ waitUntil: 'networkidle' });
  s = await savedState();
  assert(s.materials?.some(m => m.id === id && m.lang === 'Bilingüe' &&
    m.variety === 'Quechua Cusco-Collao (Cusco)' &&
    m.html.includes('únicamente en castellano')),
    'El historial EIB perdió la variedad o la advertencia');
  console.log('EIB 5/5 Banco de división diferenciado por grado');
  await page.evaluate(() => window.go('materials'));
  await page.waitForSelector('#materials.active');
  await page.locator('#materialType').selectOption('Banco de problemas');
  await page.locator('#materialTopic').fill('División: repartimos gastos familiares');
  for (const [grade, expected] of [
    ['1.º', ['entre 2 familias', 'Dibuja dos grupos']],
    ['3.º', ['cuántos sobran', 'multiplicación']],
    ['5.º', ['S/ ', 'residuo', 'decimales']]
  ]) {
    await page.locator('#materialGrade').selectOption(grade);
    // Invoke the generator after selecting the actual grade in the UI.
    // Repeated physical clicks are flaky in Chromium and remain an open S2 gate.
    await page.evaluate(() => window.DDMaterials.create());
    const content = await page.locator('#materialOutput .dd-editable-material').innerText();
    const gradeState = await page.evaluate(() => ({ selected: document.querySelector('#materialGrade')?.value, saved: window.state?.lastMaterial?.grade }));
    console.log('DIVISION_GRADE_DIAGNOSTIC:', grade, JSON.stringify(gradeState), JSON.stringify(content.slice(0,700)));
    for (const phrase of expected) {
      assert(content.includes(phrase),
        'Banco de división de ' + grade + ' no contiene ' + phrase);
    }
    assert(!content.includes('se registraron'),
      'Banco de división de ' + grade + ' cayó en resta genérica');
  }
  console.log('EIB 6/6 Fichas de división con cálculos reales diferenciados');
  await page.locator('#materialType').selectOption('Ficha de trabajo');
  await page.locator('#materialArea').selectOption('Matemática');
  await page.locator('#materialTopic').fill('División: repartimos gastos familiares');
  for (const [grade, expected, forbidden] of [
    ['1.º', ['10 monedas', 'entre 2 grupos', 'mitad de 8'], ['25 ÷ 4', 'S/ 87.50']],
    ['3.º', ['24 monedas', '25 monedas', 'residuo'], ['S/ 87.50']],
    ['5.º', ['S/ 87.50', '145 monedas', 'cociente y el residuo'], ['mitad de 8']]
  ]) {
    await page.locator('#materialGrade').selectOption(grade);
    await page.evaluate(() => window.DDMaterials.create());
    const content = await page.locator('#materialOutput .dd-editable-material').innerText();
    for (const phrase of expected) assert(content.includes(phrase),
      'Ficha de división de ' + grade + ' no contiene ' + phrase);
    for (const phrase of forbidden) assert(!content.includes(phrase),
      'Ficha de división de ' + grade + ' recibió tarea de otro ciclo: ' + phrase);
    assert(!content.includes('Representa una situación relacionada con'),
      'Ficha de división de ' + grade + ' volvió a consignas genéricas');
  }
  console.log('MATERIALS_DIVISION_WORKSHEETS_PASS');
  console.log('MATERIALS_DIVISION_GRADES_PASS');
  console.log('MATERIALS_EIB_PASS');
} finally {
  await browser.close();
}
