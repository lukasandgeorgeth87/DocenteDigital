// Fase 37: ningún guardado puede sustituir la elección aprobada de
// situación y producto; no reescribir unidades antiguas sin snapshot.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const src=readFileSync(new URL('../app.js',import.meta.url),'utf8');
const a=src.indexOf('function ddProtectApprovedSelections(){');
const b=src.indexOf('const save=()=>{',a);
assert(a>=0&&b>a);
const saved={
 selectionApproved:true,productTitle:'Expo interactiva: derechos',product:'Descripción reemplazada por otro proceso',
 productDescription:'',situation:'En el entorno cercano de los estudiantes se propone desarrollar...',
 approvedSelectionSnapshot:{
  productTitle:'Expo interactiva: derechos',productKey:'2',
  situationKey:'B',
  situationText:'Los estudiantes leen casos ficticios sobre derechos y preparan una exposición.'
 }
};
const old={selectionApproved:true,product:'Juego de mesa',productTitle:'Juego de mesa',
 situation:'Mi situación antigua'};const manual={selectionApproved:false,product:'Mural personalizado',productTitle:'Expo'};
const state={units:[saved,old,manual]};
const ctx={state};runInNewContext(src.slice(a,b)+'\nthis.protect=ddProtectApprovedSelections;',ctx);
ctx.protect();
assert.equal(saved.product,'Expo interactiva: derechos');
assert.equal(saved.productTitle,'Expo interactiva: derechos');
assert.equal(saved.situation,saved.approvedSelectionSnapshot.situationText);
assert.equal(saved.productDescription,'Descripción reemplazada por otro proceso');
assert.equal(old.product,'Juego de mesa','No modificar unidades sin confirmación histórica');
assert.equal(manual.product,'Mural personalizado','No modificar producciones manuales');
saved.product='Otro producto accidental';saved.situation='Un texto válido editado con detalles auténticos.';
ctx.protect();
assert.equal(saved.product,'Expo interactiva: derechos');
assert.equal(saved.situation,'Un texto válido editado con detalles auténticos.','No sustituir ediciones válidas del contexto');
assert(src.includes('ddProtectApprovedSelections();\n    localStorage.setItem'), 'La protección debe ejecutarse antes de escribir en localStorage');
const chooser=readFileSync(new URL('../proposal-choice-v8.js',import.meta.url),'utf8');
assert(chooser.includes('unit.approvedSelectionSnapshot={situationKey:unit.selectedSituationSource'));
console.log('PASS v37: producto y situación aprobados protegidos durante la persistencia');
