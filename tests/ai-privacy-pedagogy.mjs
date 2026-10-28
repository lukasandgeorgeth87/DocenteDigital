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



// Synthetic roster headings for children must be redacted in both capitalized
// and lowercase forms. They are not safe to send to a model as student names.
for(const [input,expected] of [
  ['Nombre del niño: Luis Mamani','Nombre del niño: [nombre omitido]'],
  ['Nombre de la niña: María Flores','Nombre de la niña: [nombre omitido]'],
  ['Nombre del escolar: José Quispe','Nombre del escolar: [nombre omitido]'],
  ['Nombre del niño: luis mamani','Nombre del niño: [nombre omitido]'],
  ['Nombre de la niña: rosa quispe','Nombre de la niña: [nombre omitido]'],
  ['Nombre del escolar: jose quispe','Nombre del escolar: [nombre omitido]']
]){
  assert.equal(redactPersonalData(input),expected,
    'Se conservó un nombre bajo una etiqueta escolar: '+input);
}

// The same labels can introduce instructions; do not erase classroom verbs.
for(const sentence of [
  'Nombre del niño: Aprende a leer en voz alta.',
  'Nombre de la niña: Observa las plantas.'
]){
  assert.equal(redactPersonalData(sentence),sentence,
    'Se borró una instrucción tras etiqueta escolar: '+sentence);
}

console.log('AI_PRIVACY_PEDAGOGY_PASS: 10 classroom instructions and 9 labeled names');
