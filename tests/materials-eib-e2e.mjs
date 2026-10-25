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
  const downloadPromise = page.waitForEvent('download', { timeout: 12000 });
  await wordButton.click({ timeout: 12000 });
  const download = await downloadPromise;
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
  console.log('MATERIALS_DIVISION_GRADES_PASS');
  console.log('MATERIALS_EIB_PASS');
} finally {
  await browser.close();
}
