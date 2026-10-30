import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInContext, createContext } from 'node:vm';

// Prueba offline del motor real: cambiar la configuración general NO debe
// cambiar nivel, grados, modalidad o lengua de una Unidad/Proyecto guardado.
const source = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const data = new Map();
const original = {
  sessionUnit: { value: 'unidad-primaria' },
  activity: {
    value: '0', selectedIndex: 0,
    options: [{ textContent: 'Comunicación · Leemos textos del biohuerto' }],
    closest: () => null
  },
  sessionTitle: { value: 'Leemos textos del biohuerto' },
  sessionDuration: {
    value: '45 minutos',
    options: [{ value: '40 minutos' }, { value: '60 minutos' }]
  },
  sessionResources: { value: 'Textos e imágenes del biohuerto' }
};
const requests = [];
const window = {
  DD_OFFICIAL_CURRICULUM: {
    pickCompetence(level, area) {
      requests.push({ level, area });
      return { name: `Competencia de prueba (${level} · ${area})` };
    }
  }
};
const document = {
  body: { classList: { toggle() {} } },
  getElementById: id => original[id] || null,
  querySelectorAll: () => [],
  querySelector: () => null
};
const localStorage = {
  getItem: key => data.get(key) ?? null,
  setItem: (key, value) => data.set(key, String(value))
};
const context = createContext({ window, document, localStorage, console, Date, setTimeout, clearTimeout });
runInContext(source, context, { filename: 'app.js' });
const state = window.state;

function build(unit, current) {
  state.units = [unit];
  Object.assign(state, current);
  original.sessionUnit.value = unit.id;
  original.sessionTitle.value = unit.activities[0].title;
  requests.length = 0;
  const result = runInContext('buildSession()', context);
  return JSON.parse(JSON.stringify(result));
}

const primaria = {
  id: 'unidad-primaria', title: 'Investigamos nuestro biohuerto', type: 'Unidad de aprendizaje',
  situationBrief: 'Observamos los cambios en las semillas del biohuerto.',
  level: 'Primaria', ieType: 'Multigrado', grades: ['1.º', '3.º', '5.º'],
  language: 'Quechua', quechuaVar: 'Quechua Chanka',
  activities: [{ area: 'Comunicación', title: 'Leemos textos del biohuerto' }]
};
const sesionPrimaria = build(primaria, {
  level: 'Secundaria', ieType: 'Polidocente', grades: ['4.º'],
  language: 'Castellano', quechuaVar: 'Quechua Collao'
});
assert.equal(sesionPrimaria.level, 'Primaria');
assert.equal(sesionPrimaria.ieType, 'Multigrado');
assert.deepEqual(sesionPrimaria.grades, ['1.º', '3.º', '5.º']);
assert.equal(sesionPrimaria.language, 'Quechua');
assert.equal(sesionPrimaria.quechuaVar, 'Quechua Chanka');
assert.deepEqual(primaria.grades, ['1.º', '3.º', '5.º'], 'No modificar la unidad histórica');
assert.equal(requests[0]?.level, 'Primaria', 'El currículo debe consultarse con el nivel de la unidad');

const inicial = {
  id: 'unidad-inicial', title: 'Exploramos nuestros colores', type: 'Proyecto de aprendizaje',
  situationBrief: 'Jugamos con pigmentos y formas en el aula.',
  level: 'Inicial', ieType: 'Polidocente', grades: ['5 años'], language: 'Castellano',
  activities: [{ area: 'Arte y Cultura', title: 'Pintamos con materiales seguros', kind: 'taller', workshopType: 'Arte' }]
};
const sesionInicial = build(inicial, { level: 'Secundaria', ieType: 'Multigrado', grades: ['2.º'] });
assert.equal(sesionInicial.level, 'Inicial');
assert.deepEqual(sesionInicial.grades, ['5 años']);
assert.equal(sesionInicial.activityKindLabel, 'Actividad de aprendizaje');
assert.match(sesionInicial.purpose, /niñas y los niños/);
assert.equal(requests[0]?.level, 'Inicial');
runInContext('syncTitle()', context);
assert.equal(original.sessionDuration.value, '40 minutos', 'Duración de taller según el nivel de la unidad');

// Compatibilidad: las unidades antiguas sin snapshot siguen pudiendo
// usar su configuración actual mientras el docente las revisa.
const antigua = {
  id: 'unidad-antigua', title: 'Propuesta de ejemplo', situationBrief: 'Medimos el aula.',
  activities: [{ area: 'Matemática', title: 'Medimos el aula' }]
};
const sesionAntigua = build(antigua, {
  level: 'Primaria', ieType: 'Polidocente', grades: ['2.º'], language: 'Castellano'
});
assert.equal(sesionAntigua.level, 'Primaria');
assert.deepEqual(sesionAntigua.grades, ['2.º']);
assert.equal(requests[0]?.level, 'Primaria');

assert.equal(JSON.parse(data.get('docenteDigitalPrototype')).lastSession.level, 'Primaria');
console.log('UNIT_SESSION_CONTEXT_SNAPSHOT_PASS: nivel, grados, modalidad y lengua heredados de Unidad/Proyecto');
