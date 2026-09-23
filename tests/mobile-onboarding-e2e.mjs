import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true });

async function runCase(level, ie, grade, area) {
  const context = await browser.newContext({
    viewport: { width: 393, height: 851 },
    screen: { width: 393, height: 851 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    acceptDownloads: true
  });
  const page = await context.newPage();
  page.setDefaultTimeout(9000);
  page.setDefaultNavigationTimeout(16000);
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('console: '+m.text()); });
  try {
    console.log('Móvil comenzando:',level);
    await page.goto(baseUrl, { waitUntil: 'load' });
    console.log('Móvil HTML cargado:',level);
    await page.waitForSelector('#ddSetupNativeForm', { timeout: 12000 });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'load' });
    console.log('Móvil reiniciado:',level);

    const levelRadio = page.locator(`input[name="ddLevel"][value="${level}"]`);
    console.log('Móvil toque de nivel:',level);
    await levelRadio.locator('..').tap();
    if (!await levelRadio.isChecked()) throw new Error('El toque no seleccionó '+level);
    const selected = await page.evaluate(() => window.state?.level);
    if (selected !== level) throw new Error('UI seleccionó '+level+', pero estado='+selected);

    const ieRadio = page.locator(`input[name="ddIE"][value="${ie}"]`);
    console.log('Móvil toque IE:',ie);
    await ieRadio.locator('..').tap();
    if (!await ieRadio.isChecked()) throw new Error('No se pudo seleccionar IE '+ie);
    const ieSelected = await page.evaluate(() => window.state?.ieType);
    if (ieSelected !== ie) throw new Error('IE se ve seleccionada, pero estado='+ieSelected);

    const gradeBox = page.locator(`[data-dd-grade-group="${level}"] input[type=checkbox][value="${grade}"]`);
    await gradeBox.locator('..').tap();
    if (!await gradeBox.isChecked()) throw new Error('No se pudo seleccionar grado '+grade);

    const areaBox = page.locator(`[data-dd-area-group="${level}"] input[type=checkbox][value="${area}"]`);
    await areaBox.locator('..').tap();
    if (!await areaBox.isChecked()) throw new Error('No se pudo seleccionar área '+area);

    await page.locator('#linguisticMode').selectOption('Monolingüe castellano');
    console.log('Móvil enviando formulario:',level);
    await page.getByRole('button', { name: 'Guardar configuración y entrar' }).tap();

    await page.waitForFunction(() =>
      document.querySelector('#home')?.classList.contains('active') &&
      !document.querySelector('#setup')?.classList.contains('active')
      , null, { timeout: 6000 }
    );
    const s = await page.evaluate(() => JSON.parse(localStorage.getItem('docenteDigitalPrototype') || '{}'));
    if (s.level !== level || s.ieType !== ie || !s.grades?.includes(grade) || !s.areas?.includes(area))
      throw new Error('Persistencia incorrecta: '+JSON.stringify({level:s.level,ieType:s.ieType,grades:s.grades,areas:s.areas}));

    await page.reload({waitUntil:'load'});
    if (!await page.locator('#home.active').count())
      throw new Error('Tras recargar la app no recuperó inicio con configuración válida.');

    console.log('MÓVIL OK:', level, ie, grade, area);
    if (errors.length) console.log('Errores de consola durante el caso:', errors.slice(0,10));
  } catch (err) {
    const summary = await page.evaluate(() => ({
      screen:[...document.querySelectorAll('.screen.active')].map(x=>x.id),
      state: {level:window.state?.level, ieType:window.state?.ieType, grades:window.state?.grades, areas:window.state?.areas},
      setupPresent:!!document.getElementById('ddSetupNativeForm'),
      scripts: [...document.scripts].filter(x=>x.src).map(x=>x.src.split('/').pop()).slice(-12),
      elementAtFirstRadio:(() => {let x=document.querySelector('input[name="ddLevel"]+span');if(!x)return null;let r=x.getBoundingClientRect();let e=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return {tag:e?.tagName,id:e?.id,cls:e?.className,text:e?.textContent?.slice(0,50)}})()
    })).catch(() => null);
    console.error('FALLO MÓVIL:', level, err.message, summary, errors);
    await fs.mkdir('/tmp/dd-mobile-artifacts',{recursive:true});
    await page.screenshot({path:`/tmp/dd-mobile-artifacts/${level}.png`,fullPage:true}).catch(()=>{});
    throw err;
  } finally {
    await context.close();
  }
}
try {
  await runCase('Inicial','Polidocente','4 años','Comunicación');
  await runCase('Primaria','Multigrado','3.º','Matemática');
  await runCase('Secundaria','Polidocente','2.º','Ciencia y Tecnología');
  console.log('Móvil: 3/3 casos correctos');
} finally {
  await browser.close();
}
