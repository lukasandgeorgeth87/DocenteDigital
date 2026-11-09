import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const expectedTitle='Investigamos y actuamos para proteger el agua de nuestra comunidad';
const expectedProduct='Campaña escolar «Guardianes del agua», integrada por un informe de investigación, gráficos estadísticos, propuestas de solución, materiales de sensibilización y compromisos de uso responsable del agua';
const challenge='¿Cómo podemos investigar y analizar el uso del agua en nuestra comunidad para proponer soluciones viables que permitan reducir su desperdicio?';
const brief='Quiero crear una UNIDAD DE APRENDIZAJE para 6.º grado de Educación Primaria. Título: '+expectedTitle+
  '. Nivel: Primaria. Grado: 6.º grado. Duración: 3 semanas, con 2 sesiones diarias. Áreas curriculares: Comunicación, Matemática, Personal Social y Ciencia y Tecnología.'+
  ' Contexto: El agua es indispensable para la salud y la agricultura; algunas personas la desperdician.'+
  ' Pregunta retadora: '+challenge+
  ' Producto final: '+expectedProduct+'. Organización de actividades Semana 1: investigamos. Semana 2: analizamos. Semana 3: presentamos.';
const src=read('proposal-choice-v8.js');
const start=src.indexOf('  const tidy=');
const end=src.indexOf('  function topicClass(raw){',start);
assert(start>0&&end>start);
const parsers={};
runInNewContext(src.slice(start,end)+'\nthis.title=namedUnitTitle;this.product=namedProductFinal;this.challenge=statedChallenge;',parsers);
assert.equal(parsers.title(brief),expectedTitle,'Título del docente debe tener prioridad');
assert.equal(parsers.challenge(brief),challenge,'Pregunta retadora exacta');
assert.equal(parsers.product(brief),expectedProduct,'El producto no debe incluir el encabezado Organización de actividades');
assert.equal(parsers.product(brief.replace('Organización de actividades Semana 1:','Organización de actividades: Semana 1:')),expectedProduct);
assert.equal(parsers.product(brief.replace('Organización de actividades Semana 1:','\nOrganización de actividades:\nSemana 1:')),expectedProduct);
assert(src.includes('namedProductFinal(pending.brief)')&&src.includes('selectedCard?pending.selectedProductTitle:pending.selectedProduct'),'Guardado debe priorizar producto explícito y nombre de producto elegido');
assert(src.includes('if(explicitTitle)unit.title=explicitTitle;'),'Guardado debe priorizar título explícito');
const format=read('format-v2.js');
assert(format.includes('window.ddNaturalPlanningTitles'),'Sugerencias deben usar el extractor corregido');
const index=read('index.html');
assert(/<script src="unit-export-quality-v11.js"><\/script>\s*<script src="planning-chain-integrity-v10.js"><\/script>/.test(index),'El auditor debe cargar en la app real');
const official={};runInNewContext(read('official-curriculum-v1.js'),{window:official,state:{level:'Primaria'},document:{readyState:'complete',getElementById(){return null}}});
assert.equal(official.DD_OFFICIAL_CURRICULUM.scienceModeFromTitle('Hacemos predicciones antes de observar'),'indaga');
const w={unitWordHtml:()=>'',DD_OFFICIAL_CURRICULUM:official.DD_OFFICIAL_CURRICULUM};
runInNewContext(read('unit-export-quality-v11.js'),{window:w});
const quality=w.DD_UNIT_EXPORT_QUALITY_V11;
const original={title:'Título antiguo',situationBrief:brief,situation:'En nuestra comunidad desperdician agua y los estudiantes investigan cómo cuidarla.',product:expectedProduct+'. Organización de actividades',reto:challenge,level:'Primaria',type:'Unidad de aprendizaje',duration:'3 semanas',ieType:'Polidocente',grades:['6.º'],areas:['Ciencia y Tecnología'],activities:[],documentContextSnapshot:{institution:'',teacher:''}};
assert.equal(quality.teacherTitle(original),expectedTitle);
assert.equal(quality.cleanProduct(original),expectedProduct);
const output=quality.word(original);
assert(output.includes(expectedTitle));
assert(!output.includes('“Título antiguo”'));
assert(output.includes(expectedProduct));
assert(!output.includes('Organización de actividades'));
assert(quality.qualityFlags(original).some(x=>/título guardado no coincide/i.test(x)));
console.log('PASS v21: título/producto explícitos en solicitud continua, auditor cargado y ciencia indaga');
