// Fase 24: el Word conserva el producto seleccionado incluso en unidades antiguas.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const source=readFileSync(new URL('../unit-export-quality-v11.js',import.meta.url),'utf8');
const sandbox={window:{unitWordHtml:()=>'<p>Exportador anterior</p>'}};
runInNewContext(source,sandbox);
const q=sandbox.window.DD_UNIT_EXPORT_QUALITY_V11;
const selected='Expo interactiva: descubrimos nuestros derechos';
const unit={level:'Primaria',type:'Unidad de aprendizaje',title:'Conocemos los derechos',
 duration:'3 semanas',ieType:'Polidocente',grades:['6.º'],areas:['Comunicación'],
 situation:'Los estudiantes investigan sus derechos con situaciones ficticias.',
 reto:'¿Cómo podemos explicar y respetar los derechos de todos?',
 selectionApproved:true,productTitle:selected,product:'Juego de mesa «Reto Tarpuy»',
 productDescription:'Instrucciones para fabricar un juego de mesa ajeno',
 activities:[],documentContextSnapshot:{institution:'',teacher:''}};
assert.equal(q.cleanProduct(unit),selected);
const word=q.word(unit);
assert(word.includes('<b>Producto integrador:</b> '+selected));
assert(!word.includes('Instrucciones para fabricar un juego de mesa ajeno'));
assert(q.qualityFlags(unit).some(x=>/difiere del elegido por el docente/.test(x)));
assert.equal(q.cleanProduct({...unit,selectionApproved:false}),'Juego de mesa «Reto Tarpuy»');
assert.equal(q.cleanProduct({...unit,product:'Campaña escolar Guardianes del agua',productTitle:'Producto final indicado por el docente'}),'Campaña escolar Guardianes del agua');
console.log('PASS v24: exportación prioriza el producto confirmado y alerta discrepancias');
