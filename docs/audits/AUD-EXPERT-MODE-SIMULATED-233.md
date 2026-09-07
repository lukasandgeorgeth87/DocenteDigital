# AUD-EXPERT-MODE-SIMULATED-233

## Resumen

**Estado:** NO PASA  
**Severidad:** S2 ALTO  
**Clasificación:** selector Fácil/Experto = FUNCIONAL; Modo Fácil por defecto = FUNCIONAL; controles adicionales de Modo Experto = INEXISTENTES; capacidad curricular/didáctica/evaluativa adicional = SIMULADA mediante avisos; telemetría técnica visible = NO OBSERVADA en esta prueba.

## Especificaciones obligatorias aplicadas

- `AUDITORIA_MAESTRA_INTEGRAL_V2.md`: DocenteDigital debe funcionar como sistema integral y mantener coherencia curricular/documental, no solo mostrar pantallas.
- `ADENDA_AUDITORIA_EJECUTABLE_V3.md`: una función no aprueba porque aparezca o responda; debe demostrar entrada → resultado esperado → obtenido → evidencia → PASA/NO PASA.
- `AUDITORIA_SIMPLICIDAD_USO_V4.md`: Modo Fácil debe ser el predeterminado y el Modo Experto debe permitir mayor control curricular, didáctico, evaluativo, de fuentes y formato, sin exponer diagnósticos técnicos internos.
- `AUDITORIA_PRELANZAMIENTO_V5.md`: las funciones esenciales deben probarse realmente y no se debe lanzar por apariencia superficial.
- `NUCLEO_IA_DOCENTEDIGITAL.md`: la IA debe comprender, estructurar, verificar y permitir decisión profesional; la interfaz no debe fingir capacidad que no existe.

## Evidencia de implementación

En `index.html` existe un selector superior:

```html
<button id="easyBtn" class="active" onclick="setMode('easy')">🟢 FÁCIL</button>
<button id="expertBtn" onclick="setMode('expert')">🔵 EXPERTO</button>
```

En `app.js`, `setMode(mode)` únicamente persiste el valor, agrega/quita la clase CSS `expert`, actualiza el estado visual de los dos botones y ejecuta `syncTitle()`:

```js
function setMode(mode){
  state.mode=mode;save();
  document.body.classList.toggle('expert',mode==='expert');
  byId('easyBtn')?.classList.toggle('active',mode==='easy');
  byId('expertBtn')?.classList.toggle('active',mode==='expert');
  syncTitle();
}
```

`styles.css` confirma que el mecanismo del modo consiste en mostrar elementos `.expert-only`:

```css
.expert-only{display:none}
.expert .expert-only{display:block}
```

Sin embargo, los elementos `expert-only` relevantes son únicamente avisos de texto, por ejemplo:

- Unidad/Proyecto: `Modo Experto: competencias, capacidades, desempeños, criterios, enfoques y fuentes normativas.`
- Sesión: `Modo Experto: revisión de competencia, desempeño, criterio, evidencia e instrumento.`

No aparecen campos, editores, selectores, fuentes, controles de formato ni acciones adicionales vinculadas a esos conceptos. Tampoco existe en `setMode()` una carga de panel experto, lógica curricular adicional o flujo de revisión profesional.

## Prueba AUD-EXP-233-A — Modo Fácil por defecto

**Entrada:** abrir la aplicación con estado nuevo.  
**Esperado:** Modo Fácil activo por defecto.  
**Obtenido:** `state.mode=state.mode||'easy'`; el botón Fácil se presenta activo.  
**Resultado:** **PASA técnicamente.**  
**Clasificación:** FUNCIONAL en esta comprobación de código.

## Prueba AUD-EXP-233-B — Control curricular adicional

**Entrada:** crear/abrir Unidad o Sesión → pulsar `EXPERTO`.  
**Esperado:** habilitar mayor control curricular sobre competencias, capacidades, desempeños, criterios y fuentes, de forma comprensible.  
**Obtenido:** se muestran avisos que enumeran esas capacidades, pero no controles editables ni acciones para ejercerlas.  
**Evidencia:** `setMode()` + `.expert-only` + avisos de `index.html`.  
**Resultado:** **NO PASA.**  
**Severidad:** **S2 ALTO.**  
**Clasificación:** SIMULADA / INEXISTENTE funcionalmente.

## Prueba AUD-EXP-233-C — Control evaluativo y de formato

**Entrada:** Sesión → `EXPERTO` → intentar revisar criterio, evidencia, instrumento o formato.  
**Esperado:** controles reales para revisar/corregir esos elementos y conservar trazabilidad.  
**Obtenido:** el aviso se hace visible, pero `sessionTitle` es el único campo cuya propiedad `readOnly` cambia con el modo; no se habilitan editores para competencia, criterio, evidencia o instrumento, ni controles de fuentes/formato.  
**Resultado:** **NO PASA.**  
**Severidad:** **S2 ALTO.**

## Prueba AUD-EXP-233-D — Telemetría técnica visible

**Entrada:** activar Modo Experto.  
**Esperado:** no mostrar tokens, temperatura, prompts, RAG, vectores o diagnósticos técnicos internos que no ayuden a decidir.  
**Obtenido:** no se observan esos parámetros en los elementos `expert-only` inspeccionados.  
**Resultado:** **PASA en el alcance de esta inspección estática.**

## Causa raíz

El sistema implementó el estado visual `easy/expert` antes que las capacidades funcionales del modo experto. El contrato de UX existe, pero la funcionalidad que V4 atribuye al modo no fue implementada.

## Acción correctiva

1. No presentar `EXPERTO` como disponible hasta que exista capacidad real.
2. Implementar controles adicionales solo donde aporten decisión profesional: competencia/capacidades/desempeños cuando proceda, criterios/evidencias/instrumentos, fuentes y formato.
3. Mantener Modo Fácil por defecto y no duplicar formularios completos.
4. Conservar datos entre Fácil ↔ Experto y no modificar históricos emitidos.
5. Probar ida/vuelta entre modos, recarga, móvil y documentos existentes.
6. No mostrar telemetría técnica interna.

No se aplica un parche funcional automático en esta ronda porque convertir avisos en editores afecta el modelo curricular, evaluación, trazabilidad y persistencia; hacerlo sin una arquitectura de datos validada crearía otra simulación. Una mitigación segura futura es etiquetar/inhabilitar temporalmente el botón Experto como `En desarrollo` hasta completar la función.

## Riesgo de regresión

Medio: un Modo Experto real tocará Unidad, Sesión, Evaluación, fuentes y persistencia. Debe probarse que el cambio de modo no borra datos ni altera documentos históricos.

## Impacto

- **ISU:** pendiente de medición; el selector actual puede generar una expectativa funcional falsa.
- **ICGD/IFR:** impacto negativo por capacidad anunciada no demostrada.
- **Prelaunch:** V4 no puede considerarse plenamente aprobada mientras el modo permanezca simulado; este hallazgo S2 no reemplaza ni reduce los S0/S1 ya abiertos.
- No se calcula ISU/IFR/Prelaunch Score definitivo.

## Normativa externa

Este hallazgo se determina exclusivamente por V2, V3, V4, V5, Núcleo IA y evidencia de código. No se declara ninguna norma MINEDU/UGEL vigente en esta prueba.

## Pruebas reales pendientes

PENDIENTES: prueba en navegador con usuario principiante/experto real, móvil físico, conservación exacta de campos al alternar modos y evaluación de utilidad del modo con docentes/directores reales.
