import { chromium } from 'playwright';

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
const page = await context.newPage();

function assert(condition, message){ if(!condition) throw new Error(message); }
async function state(){ return page.evaluate(() => JSON.parse(localStorage.getItem('docenteDigitalPrototype') || '{}')); }
async function waitPlanningRuntime(){
  await page.waitForFunction(() => window.__ddPlanningRuntimeReady === true, null, { timeout: 20000 });
  const failures = await page.evaluate(() => Array.isArray(window.ddModuleLoadFailures) ? [...window.ddModuleLoadFailures] : []);
  assert(failures.length === 0, `Fallaron módulos críticos: ${failures.join(', ')}`);
}

const cases = [
  {name:'primavera', brief:'Observamos cambios de la primavera en el entorno.'},
  {name:'abejas', brief:'Vemos abejas cerca de algunas flores y queremos observarlas.'},
  {name:'biohuerto', brief:'Estamos trabajando en el biohuerto escolar y queremos registrar lo que sucede con nuestras plantas.'},
  {name:'agua', brief:'Queremos conocer cómo usamos el agua en la escuela.'},
  {name:'familia', brief:'Queremos recoger saberes que nuestras familias comparten con nosotros.'},
  {name:'contaminacion', brief:'Observamos residuos en algunos espacios y queremos registrar lo que encontramos.'},
  {name:'lectura', brief:'Queremos mejorar la comprensión de textos informativos sobre nuestro entorno.'},
  {name:'alimentacion', brief:'Queremos conocer mejor los alimentos que consumimos en nuestra comunidad.'},
  {name:'tecnologia', brief:'Queremos explorar cómo algunas herramientas tecnológicas ayudan en tareas cotidianas.'},
  {name:'pinturas_rupestres', brief:'En la comunidad encontramos pinturas rupestres.'}
];

async function configure(){
  await page.goto(baseUrl,{waitUntil:'networkidle'});
  await page.evaluate(()=>localStorage.clear());
  await page.reload({waitUntil:'networkidle'});
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
  await waitPlanningRuntime();
}

async function createAndChoose(brief){
  await page.evaluate(()=>window.go('plan'));
  await page.locator('button[onclick="showUnit()"]',{hasText:'Crear nueva'}).click();
  const chooser=page.locator('#ddPlanningKindChooser');
  if(await chooser.count()){
    await chooser.waitFor({state:'visible',timeout:10000});
    const unitKind=chooser.locator('[data-kind="Unidad de aprendizaje"]');
    if(await unitKind.count())await unitKind.click();
  }
  await page.locator('#unitTitle').fill('');
  await page.locator('#unitSituation').fill(brief);
  const createButton=page.locator('button[onclick="createUnitDemo()"]');
  assert(await createButton.isEnabled(),`${brief}: crear propuesta sigue bloqueado con runtime listo`);
  await createButton.click();
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
    if(c.name==='biohuerto'){
      await page.evaluate(()=>window.go('materials'));
      await page.locator('#materialSource').selectOption('unit');
      await page.evaluate(()=>window.DDMaterials.useCurrent());
      await page.evaluate(()=>window.DDMaterials.create());
      const linked=await page.locator('#materialOutput').innerText();
      assert(linked.includes('Vinculación con la planificación') &&
        linked.includes('Situación de partida') && linked.includes(String(unit.situation).trim()) && linked.includes('Propósito o reto') && linked.includes('Evidencia o producto'),
        'biohuerto: el material perdió propósito o producto de la unidad');
      const normalizeText = value => String(value||'').replace(/\\s+/g,' ').trim();
      // The approved product can be normalized asynchronously from description
      // to its concrete title after unit creation; compare with current saved state.
      const current = await state();
      const currentUnit = current.units?.find(u => u.id === current.activeUnitId) || current.units?.find(u => u.id === unit.id);
      const expectedProduct = currentUnit?.product || unit.product;
      console.log('BIOHUERTO_TRACE:', JSON.stringify({originalProduct:unit.product,currentProduct:expectedProduct,activeUnitId:current.activeUnitId,output:linked.slice(0,1500)}));
      assert(normalizeText(linked).includes(normalizeText(expectedProduct)),
        'biohuerto: el material no conserva el producto seleccionado de la unidad activa');
      await page.evaluate(() => window.DDMaterials.saveEdits());
      const saved = await state();
      assert(saved.lastMaterial?.html?.includes('dd-planning-reference') &&
        normalizeText(saved.lastMaterial.html).includes(normalizeText(expectedProduct)),
        'biohuerto: guardar la ficha elimina la referencia pedagógica o el producto');
      // A prior session from another unit must not contaminate the current
      // unit's material when the default source is "Última sesión".
      await page.locator('#materialSource').selectOption('session');
      const isolation = await page.evaluate(() => {
        const old = window.state.lastSession;
        try {
          window.state.lastSession = {
            unitId: 'foreign-unit', title: 'Sesión ajena sobre volcanes',
            area: 'Ciencia y Tecnología', purpose: 'Investigar volcanes',
            evidence: 'Maqueta de un volcán', grades: ['5.º']
          };
          window.DDMaterials.useCurrent();
          window.DDMaterials.create();
          // Evaluation must also reject the stale selection rather than
          // showing criteria from the first saved unit or a foreign session.
          window.go('evaluation');
          window.DDEvaluation.openRubric();
          document.querySelector('#ddRubBuild')?.click();
          const rubricText = document.querySelector('#ddRubBody')?.innerText || '';
          window.DDEvaluation.openRegister();
          const registerText = document.querySelector('#ddEvalBody')?.innerText || '';
          return {
            rubricText, registerText,
            evaluationPanel: document.querySelector('#evaluationPanel')?.innerText?.slice(0,300),
            source: window.state.lastMaterial?.source,
            topic: window.state.lastMaterial?.topic,
            output: document.querySelector('#materialOutput')?.innerText || ''
          };
        } finally { window.state.lastSession = old; }
      });
      assert(isolation.source === 'unit' &&
        !/volcanes|volcán/i.test(isolation.topic+' '+isolation.output) &&
        isolation.output.includes('Evidencia o producto'),
        'biohuerto: material contaminado por sesión de otra unidad: '+JSON.stringify(isolation));

      // A deleted/restored unit can leave an explicit ID that no longer exists.
      // Never fall back to another unit or its session and leak its approved
      // product into a new worksheet.
      const staleSelection = await page.evaluate(() => {
        const previousId = window.state.activeUnitId;
        const previousSession = window.state.lastSession;
        try {
          window.state.activeUnitId = 'missing-unit-id';
          window.state.lastSession = {
            unitId: previousId, title: 'Sesión privada de la unidad anterior',
            purpose: 'Propósito privado anterior', evidence: 'Producto privado anterior'
          };
          document.querySelector('#materialTopic').value = '';
          window.DDMaterials.useCurrent();
          window.DDMaterials.create();
          return {
            source: window.state.lastMaterial?.source,
            topic: window.state.lastMaterial?.topic,
            output: document.querySelector('#materialOutput')?.innerText || ''
          };
        } finally {
          window.state.activeUnitId = previousId;
          window.state.lastSession = previousSession;
          window.save();
        }
      });
      assert(/No hay criterios disponibles/i.test(staleSelection.rubricText) &&
        /Aún no hay criterios disponibles/i.test(staleSelection.registerText),
        'evaluación: selección borrada reutilizó criterios de otra unidad: '+JSON.stringify(staleSelection));
      assert(staleSelection.source === 'free' &&
        !/Sesión privada|Propósito privado|Producto privado|Vinculación con la planificación/i.test(staleSelection.output),
        'biohuerto: ID activo inexistente filtró planificación ajena: '+JSON.stringify(staleSelection));


    }
    if(c.name==='pinturas_rupestres'){
      assert(!/en la comunidad encontramos/i.test(title),'pinturas rupestres: copió la oración contextual dentro del título');
      assert(/pinturas rupestres|patrimonio|huellas del pasado/i.test(title),'pinturas rupestres: el título no recuperó el núcleo pedagógico');
      assert(/pinturas rupestres|patrimonio arqueológico/i.test(situation),'pinturas rupestres: la situación no se contextualizó en el patrimonio local');
      assert(!/autores|antigüedad|significado histórico exacto/i.test(situation)||/no se atribuirán|sin.*verific/i.test(situation),'pinturas rupestres: introdujo afirmaciones no verificadas');
    }
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
