// Permanent regression inventory: fail CI if a historic test is removed or skipped.
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
const root=new URL('../',import.meta.url);
const workflow=readFileSync(new URL('.github/workflows/preview-planning-regressions.yml',root),'utf8');
const browserWorkflow=readFileSync(new URL('.github/workflows/beta-e2e.yml',root),'utf8');
const cases=[
 ['Grados y rutas','tests/quick-request-routing-phase11.mjs'],
 ['Instrucciones del docente vs tema','tests/teacher-intent-boundary-v12.mjs'],
 ['Áreas solicitadas','tests/unit-explicit-areas-and-situation-v13.mjs'],
 ['Situación contextualizada','tests/creative-situation-sanitization-v13.mjs'],
 ['Solicitud con encabezados','tests/planning-structured-request-v14.mjs'],
 ['Solicitud sobre el agua','tests/structured-water-regression-v15.mjs'],
 ['Coherencia temática','tests/planning-semantic-coherence-v16.mjs'],
 ['Tema sin expresiones genéricas','tests/planning-topic-realization-v17.mjs'],
 ['Reto, producto y secuencia de sexto','tests/sixth-grade-coherence-v18.mjs'],
 ['Criterios y evidencias de Primaria','tests/primary-activity-criteria-v19.mjs'],
 ['Título, pregunta y competencias de sexto','tests/unit-topic-curriculum-coherence-v20.mjs'],
 ['Integridad de Word','tests/unit-export-quality-phase11.mjs'],
 ['Vínculo de planificación','tests/planning-chain-integrity.mjs'],
 ['Seguridad XML de Word','tests/docx-xml-safety.mjs'],
 ['Tema desde contexto','tests/context-topic-golden.mjs'],
 ['Rutas por niveles','tests/three-level-pedagogy.mjs'],
 ['Comunicación oficial','tests/primary-communication-curriculum.mjs'],
 ['Matemática oficial','tests/primary-mathematics-curriculum.mjs'],
 ['Ciencia oficial','tests/primary-science-curriculum.mjs'],
 ['Personal Social oficial','tests/primary-personal-social-curriculum.mjs'],
 ['Inventario permanente','tests/regression-contract-v20.mjs'],
 ['Solicitud real sexto y exportación','tests/teacher-explicit-fields-v21.mjs'],
 ['Petición breve sobre derechos y producto elegido','tests/short-rights-unit-v22.mjs'],
 ['Prioridad de selección de producto','tests/product-selection-priority-v23.mjs'],
 ['Word respeta producto confirmado','tests/unit-export-product-consistency-v24.mjs'],
 ['Contexto asistido sin instrucciones administrativas','tests/assisted-context-grounding-v25.mjs'],
 ['Alertas semánticas de selección contradictoria','tests/unit-semantic-guardrails-v26.mjs'],
 ['Rúbricas diferenciadas por competencia','tests/instrument-descriptors-v27.mjs'],
 ['Paridad rúbricas Chrome Word','tests/instrument-ui-word-parity-v28.mjs'],
 ['Ediciones de unidad sobreviven a renderizados','tests/unit-persistence-draft-preservation-v29.mjs'],
 ['Día real y criterio por sesión en la ruta','tests/unit-sequence-day-criteria-v30.mjs'],
 ['Derechos y Ciencia: fenómeno investigable real','tests/science-rights-inquiry-v31.mjs']
];
assert.match(workflow,/branches:\s*\n\s+- preview\/docentedigital-fase10-20261030/);
assert(browserWorkflow.includes('node tests/sixth-grade-browser-regression-v21.mjs'),'Prueba de navegador de sexto omitida en CI');
assert(existsSync(new URL('tests/sixth-grade-browser-regression-v21.mjs',root)),'Prueba de navegador de sexto eliminada');
assert(browserWorkflow.includes('node tests/short-rights-browser-v22.mjs'),'Prueba de navegador sobre derechos omitida en CI');
assert(existsSync(new URL('tests/short-rights-browser-v22.mjs',root)),'Prueba de navegador sobre derechos eliminada');
assert(!/\bvercel\s+(?:promote|rollback|--prod)\b/.test(workflow));
for(const [label,path] of cases){
 assert(existsSync(new URL(path,root)),'Prueba histórica eliminada: '+label+' ('+path+')');
 assert(workflow.includes('node '+path),'Prueba histórica omitida en CI: '+label+' ('+path+')');
}
console.log('REGRESSION_CONTRACT_V20_PASS: '+cases.length+' pruebas históricas retenidas');
