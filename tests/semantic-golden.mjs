import { chromium } from 'playwright';

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1366, height: 768 }, acceptDownloads: true });
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
          return {
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
          // Evaluation must also reject the stale selection rather than
          // showing criteria from the first saved unit or a foreign session.
          // The simple planning shell can omit the evaluation screen in this
          // fixture. Mount a minimal host to exercise the actual evaluation
          // module's rubric/register logic, without claiming full UI coverage.
          const existingEval = document.getElementById('evaluation');
          const fixtureEval = existingEval || document.createElement('section');
          if (!existingEval) {
            fixtureEval.id = 'evaluation';
            document.body.appendChild(fixtureEval);
          }
          window.DDEvaluation.openRubric();
          document.querySelector('#ddRubBuild')?.click();
          const rubricText = document.querySelector('#ddRubBody')?.innerText || '';
          window.DDEvaluation.openRegister();
          const registerText = document.querySelector('#ddEvalBody')?.innerText || '';
          if (!existingEval) fixtureEval.remove();
          return {
            rubricText, registerText,
            evaluationPanel: document.querySelector('#evaluationPanel')?.innerText?.slice(0,300),
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


  // Regression: no teacher-approved purposes must NOT fabricate curricular
  // criteria; a last session may only supply its own grade's explicit criterion.
  const missingApprovedCriteria = await page.evaluate(() => {
    const oldUnits = window.state.units, oldActive = window.state.activeUnitId;
    const oldSession = window.state.lastSession, oldLast = window.state.lastAssessment;
    const oldGenerated = [...(window.state.generatedAssessments || [])];
    const host = document.getElementById('evaluation');
    const fixture = host || document.createElement('section');
    if (!host) { fixture.id = 'evaluation'; document.body.appendChild(fixture); }
    try {
      const unit = {id:'test-no-approved-criteria',title:'Prueba sin criterios',
        areas:['Matemática'],grades:['1.º','3.º'],purposes:[]};
      window.state.units = [...(oldUnits || []),unit];
      window.state.activeUnitId = unit.id;
      window.state.lastSession = null;
      window.DDEvaluation.openAssessment();
      document.getElementById('ddAssGrade').value = '3.º';
      document.getElementById('ddAssArea').value = 'Matemática';
      document.getElementById('ddAssCreate').click();
      const emptyText = document.getElementById('ddAssBody').innerText;
      const emptyUnchanged = window.state.lastAssessment === oldLast;
      window.state.lastSession = {unitId:unit.id,area:'Matemática',
        grades:['1.º'],criterion:'CRITERIO_EXPLICITO_SOLO_PRIMERO'};
      document.getElementById('ddAssCreate').click();
      const otherText = document.getElementById('ddAssBody').innerText;
      const otherUnchanged = window.state.lastAssessment === oldLast;
      document.getElementById('ddAssGrade').value = '1.º';
      document.getElementById('ddAssCreate').click();
      const validText = document.getElementById('ddAssBody').innerText;
      return {emptyText,emptyUnchanged,otherText,otherUnchanged,validText};
    } finally {
      window.state.units = oldUnits;
      window.state.activeUnitId = oldActive;
      window.state.lastSession = oldSession;
      window.state.lastAssessment = oldLast;
      window.state.generatedAssessments = oldGenerated;
      if (!host) fixture.remove();
      window.save();
    }
  });
  assert(missingApprovedCriteria.emptyUnchanged && missingApprovedCriteria.otherUnchanged &&
    /No hay criterios disponibles/.test(missingApprovedCriteria.emptyText) &&
    /No hay criterios disponibles/.test(missingApprovedCriteria.otherText) &&
    !/Demuestra el aprendizaje previsto|CRITERIO_EXPLICITO_SOLO_PRIMERO/.test(
      missingApprovedCriteria.emptyText+' '+missingApprovedCriteria.otherText) &&
    missingApprovedCriteria.validText.includes('CRITERIO_EXPLICITO_SOLO_PRIMERO'),
    'evaluación: inventó criterios o heredó uno de otro grado: '+JSON.stringify(missingApprovedCriteria));

  // Regression: a criterion defined for 1st grade must never appear in a 3rd
  // grade assessment, even if the last session belongs to the same unit.
  const missingGradeCriterion = await page.evaluate(() => {
    const previousUnits = window.state.units;
    const previousActive = window.state.activeUnitId;
    const previousSession = window.state.lastSession;
    const previousLast = window.state.lastAssessment;
    const previousGenerated = [...(window.state.generatedAssessments || [])];
    const host = document.getElementById('evaluation');
    const fixture = host || document.createElement('section');
    if (!host) { fixture.id = 'evaluation'; document.body.appendChild(fixture); }
    try {
      const unit = {
        id: 'test-grade-specific-criterion', title: 'Unidad multigrado ficticia',
        situation: 'Separamos materiales de la escuela.',
        areas: ['Matemática'], grades: ['1.º','3.º'],
        purposes: [{ area: 'Matemática', evidence: 'Representación',
          criteria: [{ grade: '1.º', text: 'CRITERIO_1_UNICO: representa con objetos.' }] }]
      };
      window.state.units = [...(previousUnits || []), unit];
      window.state.activeUnitId = unit.id;
      window.state.lastSession = {
        unitId: unit.id, grade: '1.º', area: 'Matemática',
        criterion: 'CRITERIO_SESION_AJENA_AL_GRADO'
      };
      window.DDEvaluation.openAssessment();
      document.getElementById('ddAssGrade').value = '3.º';
      document.getElementById('ddAssArea').value = 'Matemática';
      document.getElementById('ddAssCreate').click();
      const missingText = document.getElementById('ddAssBody').innerText;
      const unchanged = window.state.lastAssessment === previousLast;
      // "3 años" is an Inicial age, NOT an alternative spelling of 3.º.
      unit.purposes[0].criteria.push({grade:'3 años',text:'CRITERIO_INICIAL_3_ANOS'});
      document.getElementById('ddAssCreate').click();
      const ageText = document.getElementById('ddAssBody').innerText;
      const ageRejected = window.state.lastAssessment === previousLast;
      // The equivalent 3° ordinal must now match 3.º without borrowing 1.º.
      unit.purposes[0].criteria.push({grade:'3°',text:'CRITERIO_3_VARIANTE: explica el reparto.'});
      document.getElementById('ddAssCreate').click();
      const variantText = document.getElementById('ddAssBody').innerText;
      const variantGrade = window.state.lastAssessment?.grade;
      document.getElementById('ddAssGrade').value = '1.º';
      document.getElementById('ddAssCreate').click();
      const validText = document.getElementById('ddAssBody').innerText;
      return { missingText, unchanged, ageText, ageRejected, variantText, variantGrade,
        validText, validGrade: window.state.lastAssessment?.grade };
    } finally {
      window.state.units = previousUnits;
      window.state.activeUnitId = previousActive;
      window.state.lastSession = previousSession;
      window.state.lastAssessment = previousLast;
      window.state.generatedAssessments = previousGenerated;
      if (!host) fixture.remove();
      window.save();
    }
  });
  assert(missingGradeCriterion.unchanged && /No hay criterios disponibles/.test(missingGradeCriterion.missingText),
    'evaluación: 3.º reutilizó un criterio de 1.º o de sesión previa: ' + JSON.stringify(missingGradeCriterion));
  assert(!/CRITERIO_1_UNICO|CRITERIO_SESION_AJENA_AL_GRADO/.test(missingGradeCriterion.missingText),
    'evaluación: se filtró un criterio de otro grado');
  assert(missingGradeCriterion.ageRejected && /No hay criterios disponibles/.test(missingGradeCriterion.ageText) &&
    !missingGradeCriterion.ageText.includes('CRITERIO_INICIAL_3_ANOS'),
    'evaluación: confundió la edad de Inicial con el tercer grado de Primaria');
  assert(missingGradeCriterion.variantGrade === '3.º' &&
    missingGradeCriterion.variantText.includes('CRITERIO_3_VARIANTE') &&
    !missingGradeCriterion.variantText.includes('CRITERIO_1_UNICO'),
    'evaluación: no reconoció la grafía equivalente 3° para 3.º: ' + JSON.stringify(missingGradeCriterion));
  assert(missingGradeCriterion.validGrade === '1.º' && missingGradeCriterion.validText.includes('CRITERIO_1_UNICO'),
    'evaluación: el criterio legítimo de 1.º dejó de funcionar');

  // Pedagogical integrity: levels and next-step suggestions without actual
  // observed evidence must not produce invented conclusions or feedback.
  const evidenceGate = await page.evaluate(() => {
    const previous = {
      units: window.state.units, activeUnitId: window.state.activeUnitId,
      evaluationRecords: window.state.evaluationRecords
    };
    const host = document.getElementById('evaluation');
    const fixture = host || document.createElement('section');
    if (!host) { fixture.id = 'evaluation'; document.body.appendChild(fixture); }
    try {
      const unit = {
        id:'test-evidence-required', title:'Evaluación ficticia sin evidencia',
        grades:['3.º'], areas:['Matemática'], purposes:[]
      };
      const record = {
        unitId:unit.id, grade:'3.º', area:'Matemática',
        criterion:'Explica un reparto con objetos', student:'ESTUDIANTE_FICTICIO',
        level:'A', evidenceNote:'', nextStep:'Practicar otro reparto'
      };
      window.state.units = [...(previous.units || []), unit];
      window.state.activeUnitId = unit.id;
      window.state.evaluationRecords = [...(previous.evaluationRecords || []), record];
      window.DDEvaluation.openConclusions();
      const noEvidenceConclusion =
        document.querySelector('#ddConBody textarea')?.value || '';
      window.DDEvaluation.openFeedback();
      const noEvidenceFeedback =
        document.querySelector('#ddFbBody textarea')?.value || '';
      record.evidenceNote = 'Representó ocho fichas en dos grupos iguales';
      window.DDEvaluation.openConclusions();
      const withEvidenceConclusion =
        document.querySelector('#ddConBody textarea')?.value || '';
      window.DDEvaluation.openFeedback();
      const withEvidenceFeedback =
        document.querySelector('#ddFbBody textarea')?.value || '';
      return {noEvidenceConclusion,noEvidenceFeedback,
        withEvidenceConclusion,withEvidenceFeedback};
    } finally {
      window.state.units = previous.units;
      window.state.activeUnitId = previous.activeUnitId;
      window.state.evaluationRecords = previous.evaluationRecords;
      if (!host) fixture.remove();
      window.save();
    }
  });
  assert(/Falta registrar una evidencia observada/.test(evidenceGate.noEvidenceConclusion) &&
    !/evidencia los aprendizajes esperados|demuestra un desempeño destacado/.test(evidenceGate.noEvidenceConclusion),
    'evaluación: conclusión afirmó logros sin evidencia: '+JSON.stringify(evidenceGate));
  assert(/Falta registrar una evidencia observada/.test(evidenceGate.noEvidenceFeedback) &&
    !/Fortaleza observada|muestra avances/.test(evidenceGate.noEvidenceFeedback),
    'evaluación: retroalimentación inventó fortalezas sin evidencia: '+JSON.stringify(evidenceGate));
  assert(/representó ocho fichas/i.test(evidenceGate.withEvidenceConclusion) &&
    /representó ocho fichas/i.test(evidenceGate.withEvidenceFeedback),
    'evaluación: la evidencia legítima dejó de alimentar conclusiones/retroalimentación: '+JSON.stringify(evidenceGate));

  // Security regression: CSV export must not execute user-provided spreadsheet
  // formulas. Download the actual file from the real Evaluation UI.
  await page.evaluate(() => window.go('evaluation'));
  const csvFixture = await page.evaluate(() => {
    const prior = {
      units: window.state.units, activeUnitId: window.state.activeUnitId,
      evaluationRecords: window.state.evaluationRecords,
      studentRoster: window.state.studentRoster
    };
    const host = document.getElementById('evaluation');
    if (!host) {
      const fixture = document.createElement('section');
      fixture.id = 'evaluation';
      fixture.dataset.csvSecurityFixture = 'true';
      document.body.appendChild(fixture);
    }
    const unit = {
      id: 'test-csv-formula-security', title: 'Unidad ficticia para CSV',
      grades: ['3.º'], areas: ['Matemática'],
      purposes: [{area:'Matemática', evidence:'Respuesta escrita',
        instrument:'Lista de cotejo', criteria:[{grade:'3.º',text:' \t=SUM(1,1)'}]}]
    };
    window.state.units = [...(prior.units || []), unit];
    window.state.activeUnitId = unit.id;
    window.state.studentRoster = {...(prior.studentRoster || {}), '3.º':['=2+3','Código B']};
    window.state.evaluationRecords = [
      ...(prior.evaluationRecords || []),
      {unitId:unit.id,grade:'3.º',area:'Matemática',criterion:' \t=SUM(1,1)',
        student:'=2+3',level:'A',evidenceNote:'+SUM(1,2)',nextStep:'@SUM(3,4)'},
      {unitId:unit.id,grade:'3.º',area:'Matemática',criterion:' \t=SUM(1,1)',
        student:'Código B',level:'B',evidenceNote:'Dibujo correcto',nextStep:' \t=SUM(4,5)'}
    ];
    window.DDEvaluation.openRegister();
    return prior;
  });
  try {
    // Capture the Blob passed by the real CSV button to the global download
    // helper. This tests exported bytes without depending on browser download
    // event timing or filesystem permissions in headless CI.
    const csvResult = await page.evaluate(async () => {
      const original = window.downloadBlob;
      let captured = null;
      window.downloadBlob = (blob, name) => { captured = {blob, name}; };
      try {
        document.getElementById('ddEvalCsv').click();
        if(!captured)return null;
        const bytes = new Uint8Array(await captured.blob.arrayBuffer());
        return {name:captured.name, bom:bytes[0]===0xEF&&bytes[1]===0xBB&&bytes[2]===0xBF,
          text:await captured.blob.text()};
      } finally {
        window.downloadBlob = original;
      }
    });
    assert(csvResult && /\.csv$/i.test(csvResult.name), 'Evaluación no entregó un Blob CSV');
    const csv = csvResult.text;
    assert(csvResult.bom, 'CSV de evaluación perdió BOM UTF-8');
    const escapedCells = ['"\'=2+3"', '"\' \t=SUM(1,1)"', '"\'+SUM(1,2)"',
      '"\'@SUM(3,4)"', '"\'=SUM(4,5)"'];
    for (const escaped of escapedCells) {
      assert(csv.includes(escaped), 'CSV permite fórmula peligrosa sin neutralizar: '+escaped);
    }
    assert(csv.includes('"Código B"') && csv.includes('"Dibujo correcto"'),
      'CSV alteró campos de texto ordinarios');
  } finally {
    await page.evaluate(prior => {
      window.state.units = prior.units;
      window.state.activeUnitId = prior.activeUnitId;
      window.state.evaluationRecords = prior.evaluationRecords;
      window.state.studentRoster = prior.studentRoster;
      document.querySelector('[data-csv-security-fixture="true"]')?.remove();
      window.save();
    }, csvFixture);
  }

  // Regression: requesting ten division tasks must not repeat the first six.
  // Use a fictitious unit and the real evaluation UI, without modifying user data.
  const divisionTen = await page.evaluate(() => {
    const previousUnits = window.state.units;
    const previousActive = window.state.activeUnitId;
    const previousLast = window.state.lastAssessment;
    const previousGenerated = [...(window.state.generatedAssessments || [])];
    const host = document.getElementById('evaluation');
    const fixture = host || document.createElement('section');
    if (!host) { fixture.id = 'evaluation'; document.body.appendChild(fixture); }
    try {
      const grades = ['1.º', '3.º', '5.º'];
      const unit = {
        id: 'test-division-ten', title: 'División y reparto comunitario',
        situation: 'Repartimos panes y semillas en la comunidad.',
        areas: ['Matemática'], grades,
        purposes: [{ area: 'Matemática', evidence: 'Solución explicada',
          instrument: 'Lista de cotejo',
          criteria: grades.map(grade => ({grade, text: 'Resuelve repartos según su grado.'})) }]
      };
      window.state.units = [...(previousUnits || []), unit];
      window.state.activeUnitId = unit.id;
      window.DDEvaluation.openAssessment();
      document.getElementById('ddAssArea').value = 'Matemática';
      document.getElementById('ddAssCount').value = '10';
      return grades.map(grade => {
        document.getElementById('ddAssGrade').value = grade;
        document.getElementById('ddAssCreate').click();
        const tasks = [...document.querySelectorAll('#ddAssBody .dd-assessment-sheet ol > li > p:first-child')]
          .map(p => p.textContent.trim());
        return { grade, tasks, unique: new Set(tasks).size };
      });
    } finally {
      window.state.units = previousUnits;
      window.state.activeUnitId = previousActive;
      window.state.lastAssessment = previousLast;
      window.state.generatedAssessments = previousGenerated;
      if (!host) fixture.remove();
      window.save();
    }
  });
  for (const group of divisionTen) {
    assert(group.tasks.length === 10 && group.unique === 10,
      'evaluación: se repiten consignas de división para ' + group.grade + ': ' + JSON.stringify(group));
    assert(group.tasks.filter(task => /\d/.test(task)).length >= 9,
      'evaluación: una consigna de división no contiene cantidades concretas para ' + group.grade);
  }
  assert(/dos grupos|dos mesas|dos cajas|dos familias/i.test(divisionTen[0].tasks[9]),
    'evaluación: 1.º debe conservar repartos solo entre dos');

  console.log('SEMANTIC_GOLDEN_PASS');
}finally{
  await browser.close();
}
