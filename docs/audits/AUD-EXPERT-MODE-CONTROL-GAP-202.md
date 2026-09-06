# AUD-EXPERT-MODE-CONTROL-GAP-202 — Modo Experto promete revisión curricular que no ofrece como control editable

## Especificaciones aplicadas
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

Este hallazgo no necesita declarar vigente ninguna norma MINEDU/UGEL externa: compara una exigencia interna V4/V5 con el comportamiento del runtime actual.

## Prueba
**ID:** AUD-EXPERT-MODE-CONTROL-GAP-202  
**Módulo:** UX / Modo Fácil–Experto / Unidad / Sesión  
**Entrada:** completar configuración, cambiar de `FÁCIL` a `EXPERTO`, abrir Unidad/Proyecto y Sesión e intentar revisar los elementos que la propia interfaz anuncia como disponibles en Modo Experto.  

**Resultado esperado:** conforme a V4, Modo Experto debe mantener la simplicidad del flujo pero habilitar mayor control real sobre componentes curriculares, didácticos, evaluativos, fuentes o formato. Si la interfaz anuncia revisión de competencia, capacidades/desempeños, criterios, evidencia, instrumento, enfoques o fuentes, deben existir controles accionables o una indicación inequívoca de que son solo lectura/no disponibles.

**Resultado obtenido:**
1. `setMode(mode)` en `app.js` persiste el modo y básicamente alterna la clase CSS `expert`; el cambio de modo sí existe y es persistente.
2. `index.html` contiene avisos visibles en Experto que dicen:
   - Unidad/Proyecto: `Modo Experto: competencias, capacidades, desempeños, criterios, enfoques y fuentes normativas.`
   - Sesión: `Modo Experto: revisión de competencia, desempeño, criterio, evidencia e instrumento.`
3. El formulario base de Unidad no incluye campos editables para competencia, capacidades, desempeños, criterios, enfoques o fuentes; conserva Tipo, Duración, Título y Contexto.
4. El formulario base de Sesión no incluye controles editables para competencia, desempeño, criterio, evidencia o instrumento; conserva Unidad/Proyecto, Actividad, Título, Duración y Recursos.
5. `strategies-v4.js` sí añade un control real `ddStrategyProfile` para variar el énfasis de estrategias. `easy-surface-simplicity-v55.js` lo oculta en Fácil y lo deja disponible en Experto. Por tanto, Modo Experto no es completamente simulado: existe al menos una diferencia funcional real, pero está muy por debajo de lo que anuncian sus propios avisos.
6. `easy-surface-simplicity-v55.js` también hace visibles en Experto datos técnicos/pedagógicos que oculta en Fácil; mostrar más información no equivale por sí mismo a permitir revisar/editar los elementos anunciados.

**PASA/NO PASA:** NO PASA respecto de la promesa V4 de mayor control y de las afirmaciones visibles de revisión curricular.  
**Clasificación:** cambio/persistencia de modo = FUNCIONAL; control adicional de estrategias = FUNCIONAL; control curricular/evaluativo anunciado = PARCIALMENTE FUNCIONAL / mayormente INEXISTENTE como edición accionable.  
**Severidad:** S2 ALTO.

## Causa raíz
La arquitectura evolucionó en dos direcciones distintas: la capa V4 ocultó complejidad en Modo Fácil y dejó información/estrategias para Experto, pero los textos de interfaz describen un Modo Experto más completo que los controles realmente implementados. Existe una brecha entre `visibilidad de información avanzada` y `capacidad de revisión/edición avanzada`.

## Acción correctiva recomendada
No añadir decenas de campos de golpe ni exponer telemetría técnica. Implementar de forma progresiva y verificable:
1. definir un contrato explícito de qué puede editar Modo Experto por documento;
2. para Unidad/Proyecto, permitir revisar únicamente campos curriculares que provengan de fuente oficial versionada o marcarlos como provisionales/no disponibles;
3. para Sesión, permitir revisar los valores heredados de Unidad/Proyecto sin romper el snapshot histórico;
4. conservar un solo flujo y una acción principal; lo avanzado debe ser expandible, no una segunda aplicación paralela;
5. diferenciar claramente `ver` de `editar` y nunca prometer “revisión” cuando solo se muestra información;
6. añadir pruebas E2E Fácil→Experto→editar→guardar→recargar→exportar, incluida preservación del histórico.

## Corrección aplicada en este ciclo
No se modificó el runtime. Añadir controles curriculares reales afecta herencia, persistencia, currículo oficial, snapshots históricos y exportaciones; no es un cambio pequeño y seguro. Tampoco se rebajó el aviso de interfaz sin una decisión de producto, porque existe funcionalidad avanzada parcial (estrategias/información) y un cambio aislado podría ocultar trabajo pendiente.

## Evidencia técnica
- `app.js`: `setMode()` alterna `body.expert` y persiste `state.mode`.
- `index.html`: avisos `expert-only` anuncian revisión curricular en Unidad y Sesión, sin controles correspondientes en los formularios base.
- `strategies-v4.js`: inserta `#ddStrategyProfile` como opción avanzada real.
- `easy-surface-simplicity-v55.js`: marca `#ddStrategyProfile` y `.expert-only` como avanzados y los oculta solo en Fácil.
- Producción canónica comprobada el 2026-09-06: HTTP 200 y sirve esos mismos avisos y formularios.

## Riesgo de regresión
Medio. Si se agregan controles expertos sin un contrato común pueden surgir divergencias Unidad→Sesión, modificación involuntaria de históricos o nuevas fuentes duplicadas de verdad. El retest debe cubrir guardado, recarga, exportación y cambio posterior de Ficha Maestra.

## Impacto cualitativo
- **IUD:** negativo moderado: el usuario experto recibe una promesa de control superior a lo disponible.
- **ICGD:** riesgo moderado si en el futuro se añaden ediciones sin herencia/snapshot.
- **IFR / ISU / Prelaunch:** impacto cualitativo negativo; no se calculan puntuaciones definitivas.
- **V5:** no es el único bloqueante; se suma a los S1/S2 y pruebas reales todavía pendientes.

## Gate de lanzamiento
DocenteDigital NO queda aprobada para V1.0. Permanecen abiertos bloqueantes previos y siguen PENDIENTES, entre otros, usuarios reales, móvil físico, Word/PDF físico, restauración real, aislamiento/seguridad, 100 generaciones, año completo y pilotos.