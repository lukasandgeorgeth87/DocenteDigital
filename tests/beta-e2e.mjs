import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1366, height: 768 }, acceptDownloads: true });
const page = await context.newPage();

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

// Read the actual Word document part, not just the ZIP signature.
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
    assert(end <= bytes.length, `DOCX ZIP truncado en ${name}`);
    if (name === 'word/document.xml') {
      assert(method === 0, 'DOCX usa compresión no soportada por esta prueba');
      return bytes.subarray(start, end).toString('utf8');
    }
    offset = end;
  }
  throw new Error('DOCX sin word/document.xml');
}

async function state() {
  return page.evaluate(() => JSON.parse(localStorage.getItem('docenteDigitalPrototype') || '{}'));
}

async function waitPlanningRuntime() {
  await page.waitForFunction(() => window.__ddPlanningRuntimeReady === true, null, { timeout: 20000 });
  const failures = await page.evaluate(() => Array.isArray(window.ddModuleLoadFailures) ? [...window.ddModuleLoadFailures] : []);
  assert(failures.length === 0, `Fallaron módulos críticos: ${failures.join(', ')}`);
}

try {
  console.log('1/9 Carga limpia y configuración multigrado');
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.waitForSelector('#ddBetaBanner', { timeout: 10000 });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('#ddBetaBanner', { timeout: 10000 });

  await page.locator('input[name="ddLevel"][value="Primaria"]').locator('..').click();
  await page.locator('input[name="ddIE"][value="Multigrado"]').locator('..').click();
  for(const grade of ['1.º','3.º','5.º']) {
    await page.locator('[data-dd-grade-group="Primaria"] input[type="checkbox"][value="'+grade+'"]').locator('..').click();
  }
  for(const area of ["Comunicación","Matemática","Personal Social","Ciencia y Tecnología"]) {
    await page.locator('[data-dd-area-group="Primaria"] input[type="checkbox"][value="'+area+'"]').locator('..').click();
  }
  await page.locator('#linguisticMode').selectOption('Monolingüe castellano');
  await page.locator('#ddSetupNativeForm button[type="submit"]').click();

  let s = await state();
  assert(s.level === 'Primaria', 'No se guardó el nivel Primaria');
  assert(s.ieType === 'Multigrado', 'No se guardó Multigrado');
  for (const grade of ['1.º', '3.º', '5.º']) assert(s.grades.includes(grade), `Falta grado ${grade}`);

  console.log('2/9 Persistencia tras recarga');
  const beforeReload = JSON.stringify(s);
  await page.reload({ waitUntil: 'networkidle' });
  s = await state();
  assert(s.level === 'Primaria' && s.ieType === 'Multigrado', 'Se perdió la configuración tras recarga');
  assert(s.grades.length >= 3, 'Se perdieron grados tras recarga');
  assert(JSON.stringify(s).length >= beforeReload.length * 0.8, 'El estado persistido se redujo de forma inesperada');

  console.log('3/9 Unidad real sin invención territorial');
  await waitPlanningRuntime();
  await page.evaluate(() => window.go('plan'));
  await page.locator('button[onclick="showUnit()"]', { hasText: 'Crear nueva' }).click();
  const kindChooser = page.locator('#ddPlanningKindChooser');
  if (await kindChooser.count()) {
    await kindChooser.waitFor({ state: 'visible', timeout: 10000 });
    const unitKind = kindChooser.locator('[data-kind="Unidad de aprendizaje"]');
    if (await unitKind.count()) await unitKind.click();
  }
  const brief = 'Observamos cambios de la primavera en el entorno y queremos registrar lo que vemos.';
  await page.locator('#unitSituation').fill(brief);
  const createButton = page.locator('button[onclick="createUnitDemo()"]');
  await createButton.waitFor({ state: 'visible', timeout: 10000 });
  assert(await createButton.isEnabled(), 'Crear propuesta sigue bloqueado luego de cargar el runtime');
  await createButton.click();

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

  console.log('4/9 Sesión vinculada a unidad real');
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

  console.log('5/9 Exportación DOCX y respaldo Beta');
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
  assert(docxDocumentXml(bytes).includes('wordprocessingml'), 'La sesión descargada no contiene XML Word válido');
  assert(docxDocumentXml(bytes).includes(s.lastSession.title), 'El DOCX de sesión omitió el título generado');

  await page.evaluate(() => window.go('settings'));
  await page.waitForSelector('#ddBetaBackupCard', { timeout: 10000 });
  const backupDownloadPromise = page.waitForEvent('download');
  await page.locator('#ddExportBackup').click();
  const backupDownload = await backupDownloadPromise;
  const backupPath = await backupDownload.path();
  assert(backupPath, 'No se descargó el respaldo JSON');
  const backupEnvelope = JSON.parse(await fs.readFile(backupPath, 'utf8'));
  assert(backupEnvelope.format === 'DocenteDigitalBackup', 'Formato de respaldo Beta inválido');
  assert(Array.isArray(backupEnvelope.data?.units) && backupEnvelope.data.units.length > 0, 'El respaldo no contiene unidades');
  assert(backupEnvelope.data?.lastSession, 'El respaldo no contiene la última sesión');

  console.log('6/9 Backup/restauración real del estado local');
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

  console.log('7/9 Evaluación y Director ya tienen flujos funcionales de Beta');
  await page.evaluate(() => window.go('evaluation'));
  const enabledEvaluationButtons = await page.locator('#evaluation button:not([disabled])').count();
  assert(enabledEvaluationButtons >= 5, 'Evaluación no expone los flujos activos esperados');
  assert(await page.evaluate(() => typeof window.DDEvaluation?.openRegister === 'function'), 'Registro de evaluación no está conectado');
  assert(await page.evaluate(() => typeof window.DDEvaluation?.openRubric === 'function'), 'Rúbrica no está conectada');
  assert(await page.evaluate(() => typeof window.DDEvaluation?.openFeedback === 'function'), 'Retroalimentación no está conectada');

  // A visible button is not proof of a usable assessment: save a synthetic
  // student's evidence, reload later and verify it survives persistence.
  await page.evaluate(() => window.DDEvaluation.openRegister());
  await page.locator('#ddEvalGrade').waitFor({state:'visible'});
  const assessedGrade = await page.locator('#ddEvalGrade').inputValue();
  await page.locator('#ddEvalRoster').click();
  await page.locator('#ddRosterText').fill('EST-TEST-01');
  await page.locator('#ddRosterSave').click();
  assert(await page.locator('.dd-eval-level').count() > 0, 'El registro no muestra criterios editables');
  await page.locator('.dd-eval-level').first().selectOption('A');
  await page.locator('.dd-eval-note').first().fill('Resolvió la actividad con una evidencia observable de prueba.');
  await page.locator('.dd-eval-next').first().fill('Explicar oralmente el procedimiento.');
  await page.locator('#ddEvalSave').click();
  s = await state();
  const savedAssessment = s.evaluationRecords?.find(r => r.student === 'EST-TEST-01' && r.grade === assessedGrade && r.level === 'A');
  assert(savedAssessment?.evidenceNote?.includes('evidencia observable'), 'La evaluación real no guardó la evidencia ficticia');
  assert(savedAssessment?.unitId === s.activeUnitId, 'La evaluación perdió su vínculo con la unidad');

  await page.evaluate(() => window.go('director'));
  assert(await page.locator('#director').isVisible(), 'Director no quedó visible tras navegar desde Evaluación');
  const enabledDirectorButtons = await page.locator('#director button:not([disabled])').count();
  assert(enabledDirectorButtons >= 3, 'Director no expone sus flujos activos esperados');
  assert(await page.evaluate(() => typeof window.DDDirector?.openDocument === 'function'), 'Documentos de Director no están conectados');
  assert(await page.evaluate(() => typeof window.DDDirector?.openPlan === 'function'), 'Planes de Director no están conectados');
  await page.evaluate(() => window.DDDirector.openDocument());
  await page.locator('#ddDirType').selectOption('Informe');
  await page.locator('#ddDirRecipient').fill('Equipo de prueba');
  await page.locator('#ddDirSubject').fill('Informe ficticio de continuidad beta');
  await page.locator('#ddDirContext').fill('Datos sintéticos para verificar persistencia.');
  await page.locator('#ddDirMain').fill('Se verificó la generación de un documento editable.');
  const directorVisibility = await page.evaluate(() => {
    const panel=document.querySelector('#directorPanel'),button=document.querySelector('#ddDirBuild');
    return {screen:document.querySelector('#director')?.className,panel:panel?.className,
      screenDisplay:getComputedStyle(document.querySelector('#director')).display,
      panelDisplay:panel?getComputedStyle(panel).display:null,
      buttonDisplay:button?getComputedStyle(button).display:null,
      buttonDisabled:button?.disabled};
  });
  assert(await page.locator('#ddDirBuild').isVisible(), 'Director: formulario oculto '+JSON.stringify(directorVisibility));
  await page.locator('#ddDirBuild').click();
  assert(await page.locator('#ddDirResult .dd-editable-material').count() === 1, 'Director no generó un documento editable');
  s = await state();
  assert(s.lastDirectorDoc?.html?.includes('Datos sintéticos'), 'El documento de Director no se guardó');
  assert(s.directorDocs?.some(d => d.id === s.lastDirectorDoc.id), 'El documento no aparece en el historial');
  await page.locator('#ddDirResult .dd-editable-material').evaluate(el => el.insertAdjacentHTML('beforeend', '<p>Revisión ficticia guardada.</p>'));
  await page.locator('#ddDirSave').click();
  const directorDownloadPromise = page.waitForEvent('download', {timeout:15000});
  await page.locator('#ddDirWord').click();
  const directorDownload = await directorDownloadPromise;
  const directorBytes = await fs.readFile(await directorDownload.path());
  assert(directorBytes.length > 500 && directorBytes[0] === 0x50 && directorBytes[1] === 0x4b, 'La exportación Word de Director no generó un DOCX ZIP');
  assert(directorDownload.suggestedFilename().toLowerCase().endsWith('.docx'), 'Director exportó una extensión distinta de DOCX');
  assert(docxDocumentXml(directorBytes).includes('Revisión ficticia guardada.'), 'El DOCX de Director omitió la edición guardada');

  // Regression: Word export of an edited institutional plan must also save
  // those changes to the local history, even without clicking Guardar.
  await page.evaluate(() => window.DDDirector.openPlan());
  await page.locator('#ddPlanType').selectOption('Plan lector');
  await page.locator('#ddPlanPeriod').fill('2027');
  await page.locator('#ddPlanNeed').fill('Necesidad ficticia de fortalecer la lectura.');
  await page.locator('#ddPlanEvidence').fill('Evidencia de prueba, no institucional.');
  await page.locator('#ddPlanBuild').click();
  assert(await page.locator('#ddPlanResult .dd-editable-material').count() === 1, 'Director no construyó el plan institucional');
  await page.locator('#ddPlanResult .dd-editable-material').evaluate(el =>
    el.insertAdjacentHTML('beforeend', '<p>Acuerdo de prueba conservado al exportar.</p>'));
  const planDownloadPromise = page.waitForEvent('download', {timeout:15000});
  await page.locator('#ddPlanWord').click();
  const planDownload = await planDownloadPromise;
  const planBytes = await fs.readFile(await planDownload.path());
  assert(planBytes.length > 500 && planBytes[0] === 0x50 && planBytes[1] === 0x4b,
    'Plan institucional no exportó un DOCX ZIP');
  assert(planDownload.suggestedFilename().toLowerCase().endsWith('.docx'),
    'Plan institucional exportó una extensión distinta de DOCX');
  assert(docxDocumentXml(planBytes).includes('Acuerdo de prueba conservado al exportar.'),
    'El DOCX del plan omitió la edición del usuario');
  s = await state();
  assert(s.lastDirectorDoc?.type === 'Plan' && s.lastDirectorDoc?.html?.includes('Acuerdo de prueba conservado'),
    'Exportar el plan no conservó la edición en el estado persistido');
  assert(s.directorDocs?.some(d => d.id === s.lastDirectorDoc.id && d.html.includes('Acuerdo de prueba conservado')),
    'La edición exportada no se guardó en el historial del Director');

  await page.reload({waitUntil:'networkidle'});
  await waitPlanningRuntime();
  s = await state();
  assert(s.evaluationRecords?.some(r => r.student === 'EST-TEST-01' && r.level === 'A'), 'La evaluación desapareció tras recargar');
  assert(s.directorDocs?.some(d => d.type === 'Informe' && d.html.includes('Revisión ficticia guardada.')),
    'Los cambios del informe de Director desaparecieron tras recargar');
  assert(s.lastDirectorDoc?.type === 'Plan' && s.lastDirectorDoc?.html?.includes('Acuerdo de prueba conservado'),
    'La edición del plan exportado desapareció tras recargar');

  console.log('8/9 Materiales diferenciados 1.º/3.º/5.º: edición, DOCX y recuperación');
  await page.evaluate(() => window.go('materials'));
  assert(await page.evaluate(() => typeof window.DDMaterials?.createBundle === 'function'),
    'El motor de materiales no está disponible');
  await page.locator('#materialSource').selectOption('session');
  await page.locator('#materialArea').selectOption('Comunicación');
  await page.locator('#materialTopic').fill('Cuidamos las semillas en el aula (prueba ficticia)');
  await page.locator('#materialSourceText').fill('Texto de prueba: observamos semillas y registramos sus cambios.');
  await page.locator('#materials button[onclick="window.DDMaterials?.createBundle()"]').click();
  const gradePacks = page.locator('#materialOutput .dd-grade-pack');
  assert(await gradePacks.count() === 3, 'El paquete no contiene exactamente tres bloques de grado');
  for (const grade of ['1.º','3.º','5.º']) {
    const pack = gradePacks.filter({ has: page.locator('.dd-grade-pack-head', { hasText: grade }) });
    assert(await pack.count() === 1, `Falta el bloque diferenciado de ${grade}`);
    assert(await pack.locator('.dd-bundle-section').count() === 4,
      `El grado ${grade} no tiene sus cuatro recursos diferenciados`);
    const code = `FIC-${grade[0]}-01`;
    assert((await pack.innerText()).includes(code), `Falta la ficha identificada ${code}`);
  }
  await page.locator('#materialOutput .dd-editable-material').evaluate(el =>
    el.insertAdjacentHTML('beforeend', '<p>Adaptación docente ficticia conservada al exportar.</p>'));
  // Export without clicking Guardar: the downloaded file and history must
  // contain the exact on-screen edit, as already required for Director.
  const materialDownloadPromise = page.waitForEvent('download', { timeout: 15000 });
  await page.locator('#materialOutput .dd-material-actions button', { hasText: 'Word' }).click();
  const materialDownload = await materialDownloadPromise;
  assert(materialDownload.suggestedFilename().toLowerCase().endsWith('.docx'),
    'El paquete de materiales no se exportó como DOCX');
  const materialBytes = await fs.readFile(await materialDownload.path());
  const materialXml = docxDocumentXml(materialBytes);
  for (const grade of ['1','3','5']) {
    assert(materialXml.includes(`FIC-${grade}-01`), `El DOCX omitió la ficha de ${grade}.º`);
  }
  assert(materialXml.includes('Adaptación docente ficticia conservada al exportar.'),
    'El DOCX omitió una edición sin guardar del docente');
  s = await state();
  const materialId = s.lastMaterial?.id;
  assert(materialId && s.lastMaterial.html.includes('Adaptación docente ficticia conservada'),
    'Exportar Word no guardó la edición del material en el estado local');
  assert(s.materials?.some(m => m.id === materialId && m.html.includes('Adaptación docente ficticia conservada')),
    'El historial de materiales no conserva la versión exportada');
  await page.reload({ waitUntil: 'networkidle' });
  await waitPlanningRuntime();
  s = await state();
  assert(s.materials?.some(m => m.id === materialId && m.html.includes('Adaptación docente ficticia conservada')),
    'La edición exportada del paquete desapareció después de recargar');

  console.log('8b/9 EIB: elección bilingüe preservada y traducción no validada advertida en Word');
  await page.evaluate(() => window.go('materials'));
  await page.locator('#materialLanguage').selectOption('Bilingüe');
  await page.locator('#materialQuechua').selectOption('Quechua Collao');
  await page.locator('#materials button[onclick="window.DDMaterials?.createBundle()"]').click();
  const languageWarning = await page.locator('#materialOutput .notice').innerText();
  assert(languageWarning.includes('únicamente en castellano') && languageWarning.includes('Quechua Collao'),
    'El paquete EIB no advierte que el contenido sigue sin traducir');
  s = await state();
  const eibId = s.lastMaterial?.id;
  assert(s.lastMaterial?.lang === 'Bilingüe' && s.lastMaterial?.variety === 'Quechua Collao',
    'El paquete EIB perdió el idioma o variedad elegidos por el docente');
  const eibDownloadPromise = page.waitForEvent('download', { timeout: 15000 });
  await page.locator('#materialOutput .dd-material-actions button', { hasText: 'Word' }).click();
  const eibDownload = await eibDownloadPromise;
  const eibXml = docxDocumentXml(await fs.readFile(await eibDownload.path()));
  assert(eibXml.includes('no ha realizado ni validado una traducción'),
    'El DOCX EIB omitió la advertencia de traducción no validada');
  await page.reload({ waitUntil: 'networkidle' });
  await waitPlanningRuntime();
  s = await state();
  assert(s.materials?.some(m => m.id === eibId && m.lang === 'Bilingüe' &&
    m.variety === 'Quechua Collao' && m.html.includes('únicamente en castellano')),
    'El historial EIB no recuperó el idioma y la advertencia tras recargar');

  console.log('9/9 Vista móvil y navegación Director');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: 'networkidle' });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  assert(overflow <= 2, `Hay desborde horizontal móvil de ${overflow}px`);
  const mobileNavVisible = await page.locator('.mobile-nav').isVisible();
  assert(mobileNavVisible, 'La navegación móvil no es visible');
  const moreButton = page.locator('#ddMobileMoreBtn');
  await moreButton.waitFor({ state: 'visible', timeout: 10000 });
  await moreButton.click();
  const directorMenuItem = page.locator('#ddMobileMoreMenu [data-dd-go="director"]');
  await directorMenuItem.waitFor({ state: 'visible', timeout: 10000 });
  await directorMenuItem.click();
  assert(await page.locator('#director').isVisible(), 'No se puede abrir Director desde Más en móvil');

  console.log('BETA_E2E_PASS');
} finally {
  await browser.close();
}

function localStorageString(obj) {
  return JSON.stringify(obj || {});
}
