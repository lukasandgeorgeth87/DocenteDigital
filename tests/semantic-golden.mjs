import { chromium } from 'playwright';

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
const page = await context.newPage();

function assert(condition, message){ if(!condition) throw new Error(message); }
async function state(){ return page.evaluate(() => JSON.parse(localStorage.getItem('docenteDigitalPrototype') || '{}')); }

const cases = [
  {name:'primavera', brief:'Observamos cambios de la primavera en el entorno.'},
  {name:'abejas', brief:'Vemos abejas cerca de algunas flores y queremos observarlas.'},
  {name:'biohuerto', brief:'Estamos trabajando en el biohuerto escolar y queremos registrar lo que sucede con nuestras plantas.'},
  {name:'agua', brief:'Queremos conocer cómo usamos el agua en la escuela.'},
  {name:'familia', brief:'Queremos recoger saberes que nuestras familias comparten con nosotros.'},
  {name:'contaminacion', brief:'Observamos residuos en algunos espacios y queremos registrar lo que encontramos.'},
  {name:'lectura', brief:'Queremos mejorar la comprensión de textos informativos sobre nuestro entorno.'},
  {name:'alimentacion', brief:'Queremos conocer mejor los alimentos que consumimos en nuestra comunidad.'},
  {name:'tecnologia', brief:'Queremos explorar cómo algunas herramientas tecnológicas ayudan en tareas cotidianas.'}
];

async function configure(){
  await page.goto(baseUrl,{waitUntil:'networkidle'});
  await page.evaluate(()=>localStorage.clear());
  await page.reload({waitUntil:'networkidle'});
  await page.locator('#step1 .choice',{hasText:'Primaria'}).click();
  await page.locator('#step1 .btn',{hasText:'Continuar'}).click();
  await page.locator('#step2 .choice',{hasText:'Multigrado'}).click();
  await page.locator('#step2 .btn',{hasText:'Continuar'}).click();
  for(const g of ['1.º','3.º','5.º']) await page.locator('#gradeChoices .choice',{hasText:g}).click();
  await page.locator('#step3 .btn',{hasText:'Continuar'}).click();
  for(const a of ['Comunicación','Matemática','Personal Social','Ciencia y Tecnología']) await page.locator('#areaChoices .choice',{hasText:a}).click();
  await page.locator('#linguisticMode').selectOption({label:'Monolingüe castellano'});
  await page.locator('#step4 .btn',{hasText:'Guardar y entrar'}).click();
}

async function createAndChoose(brief){
  await page.evaluate(()=>window.go('plan'));
  await page.locator('button[onclick="showUnit()"]',{hasText:'Crear nueva'}).click();
  await page.waitForSelector('#ddPlanningKindChooser',{timeout:10000});
  await page.locator('#ddPlanningKindChooser [data-kind="Unidad de aprendizaje"]').click();
  await page.locator('#unitTitle').fill('');
  await page.locator('#unitSituation').fill(brief);
  await page.locator('button[onclick="createUnitDemo()"]',{hasText:/Crear propuesta/}).click();
  await page.waitForSelector('#ddProposalChooser:not(.hidden)',{timeout:10000});
  await page.locator('input[name="ddSituation"]').first().check();
  await page.locator('#ddContinueProducts').click();
  await page.locator('input[name="ddProduct"]').first().check();
  const before=(await state()).units?.length||0;
  await page.locator('#ddBuildUnit').click();
  await page.waitForFunction(expected=>{
    const st=JSON.parse(localStorage.getItem('docenteDigitalPrototype')||'{}');
    return Array.isArray(st.units)&&st.units.length>expected;
  },before,{timeout:10000});
  const st=await state();
  return st.units.find(u=>u.id===st.activeUnitId)||st.units[0];
}

try{
  await configure();
  for(const c of cases){
    console.log(`GOLDEN ${c.name}`);
    const unit=await createAndChoose(c.brief);
    const title=String(unit.title||'').trim();
    const situation=String(unit.situation||'').trim();
    const product=String(unit.product||'').trim();
    assert(unit.situationBrief===c.brief,`${c.name}: no preservó la entrada original`);
    assert(title.length>=8,`${c.name}: título vacío o demasiado corto`);
    assert(title.toLowerCase()!==c.brief.toLowerCase(),`${c.name}: copió literalmente la entrada como título`);
    assert(!/Ccotataqui/i.test(`${title} ${situation} ${product}`),`${c.name}: inventó Ccotataqui sin estar en la entrada`);
    assert(unit.selectionApproved===true,`${c.name}: no registró elección explícita`);
    assert(situation.length>=40,`${c.name}: situación significativa demasiado vacía`);
    assert(product.length>=20,`${c.name}: producto/evidencia insuficiente`);
  }

  const antBrief='Observamos hormigas en el aula.';
  const ant=await createAndChoose(antBrief);
  const antText=`${ant.situation||''} ${ant.product||''}`.toLowerCase();
  assert(!antText.includes('por qué están allí'),'hormigas: reintrodujo la pregunta inventada “por qué están allí”');
  assert(!antText.includes('cómo viven y qué características tienen'),'hormigas: reintrodujo detalle inventado sobre cómo viven');

  console.log('SEMANTIC_GOLDEN_PASS');
}finally{
  await browser.close();
}
