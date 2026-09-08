# AUD-EXPERT-MODE-SIMULATED-250

## Resumen ejecutivo

**Hallazgo:** el selector `FÁCIL / EXPERTO` existe y persiste, pero el Modo Experto no demuestra controles curriculares/didácticos adicionales; en las pantallas críticas únicamente revela avisos de texto.

**Clasificación:** SIMULADA para la función “Modo Experto con mayor control”.

**Severidad:** S2 ALTO.

**Gate V5:** no constituye por sí solo un S0/S1, pero impide declarar cumplida la exigencia V4 de Modo Fácil/Experto y afecta simplicidad, confianza funcional y trazabilidad del control profesional.

## Especificaciones aplicadas

- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

V3 establece que una función no aprueba porque aparezca o responda: debe demostrarse mediante entrada, resultado esperado, resultado obtenido y evidencia. V4 exige Modo Fácil por defecto y define Modo Experto como un modo que permite mayor control curricular, didáctico, evaluativo, de fuentes y formato, sin mostrar telemetría técnica innecesaria. V5 exige probar funcionalidad real y no lanzar funciones esenciales a medias.

## Evidencia de repositorio

### Selector y persistencia

En `index.html` aparecen los botones:

- `🟢 FÁCIL`
- `🔵 EXPERTO`

En `app.js`, `setMode(mode)`:

1. guarda `state.mode`;
2. agrega o retira la clase `expert` del `<body>`;
3. cambia la clase visual activa de los botones;
4. llama `syncTitle()`.

En `styles.css`:

- `.expert-only{display:none}`
- `.expert .expert-only{display:block}`

Esto confirma que existe cambio visual de modo.

### Qué aparece realmente en Modo Experto

En Unidad/Proyecto, el único elemento `expert-only` visible es un aviso:

`Modo Experto: competencias, capacidades, desempeños, criterios, enfoques y fuentes normativas.`

No contiene inputs, selects, botones, editores ni controles asociados a esas variables.

En Sesión, el único elemento `expert-only` visible es otro aviso:

`Modo Experto: revisión de competencia, desempeño, criterio, evidencia e instrumento.`

Tampoco contiene controles editables para competencia, desempeño, criterio, evidencia o instrumento.

La única diferencia funcional observable vinculada a `state.mode` es que `syncTitle()` establece `title.readOnly = state.mode === 'easy'`, por lo que en Experto se puede editar el título de sesión. Esa diferencia es real pero insuficiente para sostener la promesa de mayor control curricular, didáctico, evaluativo, de fuentes y formato descrita por V4.

## Evidencia de producción

La inspección autenticada de `https://docente-digital.vercel.app/` confirmó HTTP 200 y el mismo HTML con los avisos `expert-only` descritos arriba.

La inspección de `https://docente-digital.vercel.app/app.js` confirmó la misma implementación de `setMode()` y `syncTitle()` desplegada en producción.

Por tanto, no es deuda aislada del repositorio: la misma función incompleta está publicada.

---

## Prueba AUD-EXP-250-A — Unidad/Proyecto

**Entrada:** completar configuración, abrir “Mi planificación” → “Unidad / Proyecto”, cambiar de FÁCIL a EXPERTO.

**Resultado esperado:** aparecer controles adicionales y comprensibles para revisar/modificar como mínimo competencia, capacidades/desempeños cuando correspondan, criterios, enfoques, fuentes o formato, conservando la simplicidad del modo Fácil.

**Resultado obtenido:** aparece únicamente el texto informativo `Modo Experto: competencias, capacidades, desempeños, criterios, enfoques y fuentes normativas.` No aparecen controles funcionales adicionales para dichos elementos.

**Evidencia:** `index.html`, `styles.css`, `app.js`, producción actual.

**Resultado:** NO PASA.

**Clasificación:** SIMULADA.

**Severidad:** S2 ALTO.

**Acción correctiva:** no mostrar una promesa de control experto hasta que exista una implementación mínima real. Diseñar controles avanzados detrás de secciones progresivas y preservar datos estructurados/versionados.

---

## Prueba AUD-EXP-250-B — Sesión

**Entrada:** abrir “Crear mi sesión”, alternar FÁCIL → EXPERTO.

**Resultado esperado:** habilitar revisión explícita y edición controlada de competencia, desempeño, criterio, evidencia e instrumento; cualquier cambio debe conservar coherencia y trazabilidad.

**Resultado obtenido:** solo aparece el aviso `Modo Experto: revisión de competencia, desempeño, criterio, evidencia e instrumento.` No existe editor para esos campos. El título deja de ser `readonly`, pero los demás elementos siguen siendo generados internamente y no editables desde la interfaz.

**Evidencia:** `index.html`; `app.js:setMode`, `syncTitle`, `buildSession`.

**Resultado:** NO PASA.

**Clasificación:** PARCIALMENTE FUNCIONAL para la edición del título; SIMULADA para el control experto curricular prometido.

**Severidad:** S2 ALTO.

**Acción correctiva:** implementar edición estructurada de los campos expertos y validar coherencia sesión ↔ competencia ↔ criterio ↔ evidencia ↔ instrumento antes de guardar/exportar.

---

## Prueba AUD-EXP-250-C — Modo Fácil por defecto

**Entrada:** estado nuevo sin `state.mode` guardado.

**Resultado esperado:** Modo Fácil por defecto.

**Resultado obtenido:** `state.mode = state.mode || 'easy'` y botón Fácil marcado inicialmente como activo.

**Resultado:** PASA técnicamente.

**Clasificación:** FUNCIONAL en este requisito puntual.

**Severidad:** S4 informativo, sin defecto asociado.

## Causa raíz

El diseño implementó primero la distinción visual entre Fácil/Experto y dejó los controles expertos como texto declarativo. Esto incumple la regla V3 de no considerar una función terminada por aparecer en la interfaz.

## Corrección aplicada en esta ronda

No se modificó código funcional. Implementar controles expertos sin modelo estructurado, edición/versionado de documentos y validación de coherencia podría introducir regresiones pedagógicas, modificar históricos o generar falsa sensación de precisión normativa.

Se documenta el hallazgo y se mantiene pendiente hasta poder implementar una solución pequeña, trazable y verificable.

## Riesgo de regresión

**Medio-alto** si se corrige superficialmente agregando inputs desconectados del modelo de datos. Los cambios expertos deben persistir, recuperarse, reflejarse en Word/PDF y no alterar documentos históricos emitidos.

## Impacto en indicadores

- **ISU:** impacto negativo moderado por expectativa engañosa y falta de correspondencia entre etiqueta y función.
- **IFR:** impacto negativo: una función visible no demuestra funcionalidad real.
- **IUD/ICGD:** impacto potencial alto si el usuario cree que revisó aspectos curriculares/directivos que en realidad no pudo controlar.
- **Prelaunch:** pendiente; este hallazgo no autoriza cálculo de score definitivo.

## Normativa externa

Este hallazgo se deriva de las especificaciones internas V3/V4/V5 y no requiere aplicar ni declarar vigente una norma MINEDU/UGEL externa.

## Estado de lanzamiento

**DocenteDigital NO está aprobada para lanzamiento V1.0.** Los S0/S1 acumulados permanecen bloqueantes, y AUD-250 añade evidencia de una función visible que no cumple todavía su alcance declarado.
