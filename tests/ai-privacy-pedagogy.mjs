import assert from 'node:assert/strict';
import {createRequire} from 'node:module';

const require=createRequire(import.meta.url);
const {redactPersonalData}=require('../api/_ai-privacy.js');

// Synthetic school content: preserve learning actions after roster-like labels.
// The privacy layer must not turn valid teaching instructions into names.
for(const sentence of [
  'Estudiante: Observa las semillas y registra cambios.',
  'Alumno - Compara los resultados de la germinación.',
  'Alumna = Explica la germinación con dibujos.',
  'Escolar: Identifica las partes de una planta.',
  'Niña: Registra los cambios en la tabla.',
  'Alumno: Clasifica las hojas por su tamaño.',
  'Estudiante: Investiga sobre el agua.',
  'Estudiante: Representa con dibujos el crecimiento.'
]){
  assert.equal(redactPersonalData(sentence),sentence,
    'Se borró una instrucción pedagógica válida: '+sentence);
}

// Labeled names must still be removed, even when followed by the same verbs.
for(const [input,expected] of [
  ['Estudiante: Rosa Quispe observa las semillas.',
    'Estudiante: [nombre omitido] observa las semillas.'],
  ['Alumno: rosa quispe compara los resultados.',
    'Alumno: [nombre omitido] compara los resultados.'],
  ['Alumna - María Flores explica la actividad.',
    'Alumna: [nombre omitido] explica la actividad.']
]){
  assert.equal(redactPersonalData(input),expected,
    'Se perdió la redacción de un nombre etiquetado: '+input);
}

console.log('AI_PRIVACY_PEDAGOGY_PASS: 8 classroom instructions and 3 labeled names');
