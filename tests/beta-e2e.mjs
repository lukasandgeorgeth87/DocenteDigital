import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1366, height: 768 }, acceptDownloads: true });
const page = await context.newPage();

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function state() {
  return page.evaluate(() => JSON.parse(localStorage.getItem('docenteDigitalPrototype') || '{}'));
}

try {
  console.log('1/8 Carga limpia y configuración multigrado');
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });

  await page.locator('#step1 .choice', { hasText: 'Primaria' }).click();
  await page.locator('#step1 .btn', { hasText: 'Continuar' }).click();
  await page.locator('#step2 .choice', { hasText: 'Multigrado' }).click();
  await page.locator('#step2 .btn', { hasText: 'Continuar' }).click();

  for (const grade of ['1.º', '3.º', '5.º']) {
    await page.locator('#gradeChoices .choice', { hasText: grade }).click();
  }
  await page.locator('#step3 .btn', { hasText: 'Continuar' }).click();

  for (const area of ['Comunicación', 'Matemática', 'Personal Social', 'Ciencia y Tecnología']) {
    await page.locator('#areaChoices .choice', { hasText: area }).click();
  }
  await page.locator('#linguisticMode').selectOption({ label: 'Monolingüe castellano' });
  await page.locator('#step4 .btn', { hasText: 'Guardar y entrar' }).click();

  let s = await state();
  assert(s.level === 'Primaria', 'No se guardó el nivel Primaria');
  assert(s.ieType === 'Multigrado', 'No se guardó Multigrado');
  for (const grade of ['1.º', '3.º', '5.º']) assert(s.grades.includes(grade), `Falta grado ${grade}`);

  console.log('2/8 Persistencia tras recarga');
  const beforeReload = JSON.stringify(s);
  await page.reload({ waitUntil: 'networkidle' });
  s = await state();
  assert(s.level === 'Primaria' && s.ieType === 'Multigrado', 'Se perdió la configuración tras recarga');
  assert(s.grades.length >= 3, 'Se perdieron grados tras recarga');
  assert(JSON.stringify(s).length >= beforeReload.length * 0.8, 'El estado persistido se redujo de forma inesperada');

  console.log('3/8 Unidad real sin invención territorial');
  await page.evaluate(() => window.go('plan'));
  await page.locator('button[onclick="showUnit()"]', { hasText: 'Crear nueva' }).click();
  const brief = 'Observamos cambios de la primavera en el entorno y queremos registrar lo que vemos.';
  await page.locator('#unitSituation').fill(brief);
  await page.locator('button[onclick="createUnitDemo()"]', { hasText: /Crear propuesta/ }).click();

  // El flujo actual exige elección explícita de situación y producto antes de guardar.
  await page.waitForSelector('#ddProposalChooser:not(.hidden)', { timeout: 10000 });
  await page.locator('input[name="ddSituation"]').first().check();
  await page.locator('#ddContinueProducts').click();
  await page.waitForSelector('input[name="ddProduct"]', { timeout: 10000 });
  await page.locator('input[name="ddProduct"]').first().check();
  await page.locator('#ddBuildUnit').click();

  await page.waitForFunction(() => {
    const st = JSON.parse(localStorage.getItem('docenteDigitalPrototype') || '{}');
    return Array.isArray(st.units) && st.units.length > 0;
  }, null, { timeout: 10000 });
  s = await state();
  const unit = s.units.find(u => u.id === s.activeUnitId) || s.units[0];
  assert(unit, 'No se creó la unidad');
  assert(unit.situationBrief === brief, 'No se preservó la intención original del docente');
  assert(unit.title && unit.title.toLowerCase() !== brief.toLowerCase(), 'El título copió literalmente la entrada');
  assert(unit.selectionApproved === true, 'La unidad no conserva aprobación explícita de situación/producto');
  assert(!/Ccotataqui/i.test(unit.product || ''), 'Se inventó Ccotataqui sin estar en la entrada');

  console.log('4/8 Sesión vinculada a unidad real');
  await page.evaluate(() => window.go('session'));
  await page.waitForFunction(() => document.querySelector('#sessionUnit')?.value);
  const sessionButton = page.locator('#session button[onclick="generateSession()"]');
  assert(await sessionButton.isEnabled(), 'Botón de sesión quedó deshabilitado aun con unidad real');
  await sessionButton.click();
  await page.waitForFunction(() => {
    const st = JSON.parse(localStorage.getItem('docenteDigitalPrototype') || '{}');
    return !!st.lastSession;
  }, null, { timeout: 10000 });
  s = await state();
  assert(s.lastSession.unitId === s.activeUnitId, 'La sesión perdió la trazabilidad con la unidad');

  console.log('5/8 Exportación DOCX real en navegador');
  await page.waitForFunction(() => typeof window.ddDocxSelfTest === 'function', null, { timeout: 10000 });
  const docxSelfTest = await page.evaluate(() => window.ddDocxSelfTest());
  assert(docxSelfTest === true, 'ddDocxSelfTest falló');
  const downloadPromise = page.waitForEvent('download');
  await page.evaluate(() => window.downloadSessionWord());
  const download = await downloadPromise;
  const filePath = await download.path();
  assert(filePath, 'No se obtuvo el archivo DOCX descargado');
  const bytes = await fs.readFile(filePath);
  assert(bytes.length > 500, `DOCX demasiado pequeño: ${bytes.length} bytes`);
  assert(bytes[0] === 0x50 && bytes[1] === 0x4b, 'El archivo descargado no es un contenedor ZIP/OOXML válido');
  assert(download.suggestedFilename().toLowerCase().endsWith('.docx'), 'La exportación no usa extensión .docx');

  console.log('6/8 Backup/restauración real del estado local');
  const backupBeforeReset = localStorageString(await state());
  let acceptedReset = false;
  page.once('dialog', async dialog => {
    acceptedReset = true;
    await dialog.accept();
  });
  await page.evaluate(() => window.resetDemo());
  await page.waitForLoadState('domcontentloaded').catch(() => {});
  assert(acceptedReset, 'No apareció confirmación de restablecimiento recuperable');
  await page.waitForSelector('#ddResetRestore', { timeout: 10000 });
  await page.locator('#ddResetRestore [data-action="restore"]').click();
  await page.waitForLoadState('domcontentloaded').catch(() => {});
  await page.waitForFunction(() => {
    const st = JSON.parse(localStorage.getItem('docenteDigitalPrototype') || '{}');
    return Array.isArray(st.units) && st.units.length > 0 && !!st.lastSession;
  }, null, { timeout: 10000 });
  const restored = localStorageString(await state());
  assert(restored.length >= backupBeforeReset.length * 0.8, 'La restauración no recuperó el estado sustancial');

  console.log('7/8 Superficies incompletas no se presentan como terminadas');
  await page.evaluate(() => window.go('evaluation'));
  const enabledEvaluationButtons = await page.locator('#evaluation button:not([disabled])').count();
  assert(enabledEvaluationButtons === 0, 'Evaluación simulada aparece habilitada');
  await page.evaluate(() => window.go('director'));
  const enabledDirectorButtons = await page.locator('#director button:not([disabled])').count();
  assert(enabledDirectorButtons === 0, 'Funciones Director simuladas aparecen habilitadas');

  console.log('8/8 Vista móvil y navegación Director');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: 'networkidle' });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  assert(overflow <= 2, `Hay desborde horizontal móvil de ${overflow}px`);
  const mobileNavVisible = await page.locator('.mobile-nav').isVisible();
  assert(mobileNavVisible, 'La navegación móvil no es visible');
  await page.waitForSelector('.mobile-nav [data-screen="director"]', { timeout: 10000 });
  await page.locator('.mobile-nav [data-screen="director"]').click();
  assert(await page.locator('#director').isVisible(), 'No se puede abrir Director desde móvil');

  console.log('BETA_E2E_PASS');
} finally {
  await browser.close();
}

function localStorageString(obj) {
  return JSON.stringify(obj || {});
}
