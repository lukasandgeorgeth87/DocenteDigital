// Fase 36: nunca almacenar la descripción en el campo canónico del
// producto; es fuente de carreras entre módulos y Word.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const src=readFileSync(new URL('../proposal-choice-v8.js',import.meta.url),'utf8');
assert(src.includes('state.pendingUnitChoice.selectedProduct=picked.title;'),
 'El campo selectedProduct debe conservar el nombre confirmado, no la descripción');
assert(src.includes("state.pendingUnitChoice.selectedProductDescription=picked.description||'';"),
 'Descripción independiente del nombre');
assert(src.includes('state.pendingUnitChoice.selectedProductTitle=picked.title;'),
 'Conservar título en campo explícito');
assert(src.includes('unit.productDescription=selectedCard?tidy(selectedCard.text):(tidy(pending.selectedProductDescription)'),
 'Word y unidad leen la descripción separada');
assert(!src.includes('selectedProduct=picked.description||picked.title'),
 'No admitir el antiguo guardado ambiguo que causaba producto discordante');
console.log('PASS v36: nombre canónico y descripción desacoplados en unidad/proyecto');
