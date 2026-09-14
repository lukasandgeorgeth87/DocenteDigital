# AUD-MATERIAL-SURFACE-TRUTH-CLICKABLE-SIMULATION-279

**Fecha de auditoría:** 2026-09-13  
**Módulo:** Carpeta Docente / Materiales / Verdad de superficie  
**Estado inicial:** NO PASA  
**Clasificación inicial:** PARCIALMENTE FUNCIONAL  
**Severidad:** S2 — ALTO  

## Especificaciones obligatorias utilizadas conjuntamente

Se revisaron conjuntamente antes de emitir este hallazgo:

- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

V3 prohíbe aprobar una función porque aparezca o produzca texto. V4 exige una superficie simple y veraz, sin acciones que aparenten estar disponibles cuando no lo están. V5 incluye Materiales en el recorrido Docente extremo a extremo. El Núcleo IA exige conservar la intención completa, contexto, grado, lengua y finalidad antes de producir un material.

## Relación con hallazgos anteriores

`AUD-MATERIAL-CONTROLS-IGNORED-HARDCODED-254` ya demostró que el generador base de Materiales es **ROTO/SIMULADO, S1**: ignora tema, tipo y grado y puede producir un texto fijo ajeno a la entrada. Este expediente **no duplica AUD-254**. Audita una regresión diferente: la capa posterior `material-surface-truth-v70.js`, creada para decir la verdad sobre esa función no disponible, cambiaba las etiquetas pero conservaba ejecutable el `onclick="generateMaterial()"` legado.

## AUD-MAT-279-A — Botón renombrado pero simulación todavía ejecutable

**Entrada**  
Abrir Materiales después de cargar la guarda `material-surface-truth-v70.js`; escribir un tema no relacionado con agua, por ejemplo `Las hormigas que aparecieron en nuestra aula`; seleccionar un grado y Castellano; pulsar el botón principal, que la guarda renombraba a `Revisar solicitud de material`.

**Resultado esperado**  
Mientras `generationDeclaredReady:false`, la superficie debe impedir ejecutar el generador demostrativo. El botón debe estar deshabilitado o conducir exclusivamente a un estado informativo de “en desarrollo”, sin producir contenido que pueda confundirse con material final.

**Resultado obtenido antes de la corrección**  
NO PASA. `material-surface-truth-v70.js` cambiaba el texto y `aria-label` del botón, pero no eliminaba el atributo inline `onclick="generateMaterial()"` definido en `index.html`, no lo deshabilitaba y no reemplazaba `window.generateMaterial`. Por ello, el botón renombrado seguía invocando el generador base que AUD-254 ya demostró como simulado/roto.

**Evidencia**

- `index.html`: botón de Materiales con `onclick="generateMaterial()"`.
- `app.js`: `generateMaterial()` conserva salida demostrativa hardcodeada y no consume Tema/Tipo/Grado.
- `material-surface-truth-v70.js` previo: renombraba el botón pero no eliminaba su acción ni lo deshabilitaba.
- `AUD-MATERIAL-CONTROLS-IGNORED-HARDCODED-254.md`: evidencia previa del S1 funcional subyacente.

**PASA / NO PASA:** NO PASA  
**Clasificación:** PARCIALMENTE FUNCIONAL  
**Severidad propia del guard:** S2 — ALTO  
**Severidad heredada del generador subyacente:** AUD-254 continúa S1 — CRÍTICO y bloqueante V5.

## Causa raíz

La corrección de “verdad de superficie” se implementó como cambio cosmético de etiquetas. El estado interno `generationDeclaredReady:false` no estaba conectado a la capacidad de ejecutar la acción. Además, `ddAuditMaterialSurfaceTruth()` consideraba `truthfulSurface:true` únicamente por encontrar el botón renombrado, sin verificar si seguía habilitado o si conservaba el `onclick` de la simulación.

## Corrección aplicada

Commit funcional: `8f673c5b089a6b53cbcf2d2f4855b2b9f238331e` — `fix: disable simulated material generation surface`.

`material-surface-truth-v70.js` pasa a **v70.1** y ahora:

1. identifica de forma estable el botón incluso después de renombrarlo;
2. conserva la acción antigua solo como metadato interno de diagnóstico (`data-dd-legacy-action`), sin ejecutarla;
3. elimina el `onclick` inline;
4. establece `disabled` y `aria-disabled=true`;
5. muestra `Generación de material · En desarrollo`;
6. mantiene oculto el resultado demostrativo;
7. cambia `ddAuditMaterialSurfaceTruth()` para que `truthfulSurface` solo sea verdadero cuando el botón está deshabilitado y no existe acción inline;
8. expone `simulatedGeneratorReachable` para detectar una futura regresión.

La corrección es pequeña, reversible y no intenta simular una generación real inexistente. No modifica materiales históricos ni datos de Ficha Maestra.

## AUD-MAT-279-R1 — Reprueba de implementación

**Entrada**  
Inspección del runtime v70.1 y ejecución del auditor de superficie cuando el DOM esté disponible.

**Resultado esperado**  
Botón deshabilitado, sin `onclick`; `generationDeclaredReady:false`; `truthfulSurface:true`; `simulatedGeneratorReachable:false`.

**Resultado obtenido en implementación**  
PASA EN IMPLEMENTACIÓN. El código v70.1 fuerza esas condiciones y vuelve a aplicarlas después del montaje inicial.

**Estado:** FUNCIONAL EN IMPLEMENTACIÓN para verdad de superficie.  
**E2E real:** PENDIENTE hasta ejecutar la interacción en navegador/dispositivo real.

## Evidencia posterior requerida

Antes de cerrar completamente el hallazgo debe comprobarse en producción:

- carga de v70.1;
- botón realmente no accionable con ratón, teclado y toque;
- ausencia de salida demostrativa al pulsar/activar;
- navegación móvil sin bloqueo colateral;
- HTTP 200 de raíz y asset;
- Vercel READY del SHA final;
- smoke automatizado del SHA final cuando exista ejecución verificable.

## Riesgo de regresión

**MEDIO.** Una capa posterior podría volver a asignar `onclick`, reemplazar el botón o declarar disponible la generación sin conectar el motor real. Por ello se añadió `simulatedGeneratorReachable` al auditor ejecutable.

## Impacto cualitativo en indicadores

- **IUD:** mejora la honestidad documental al impedir que una demostración sea confundida con producto usable; no se asigna puntaje.
- **ICGD:** sin mejora funcional de generación; Materiales sigue fuera del recorrido E2E real.
- **IFR:** no se calcula valor definitivo; el S1 AUD-254 permanece.
- **ISU:** mejora claridad de la superficie, pero no se calcula score sin usuarios reales.
- **Prelaunch:** no desbloquea V5; únicamente evita exponer como ejecutable una función ya conocida como no lista.

## Normativa externa

No se aplicó ni se declaró vigente ninguna norma externa MINEDU/UGEL en esta corrección. El hallazgo deriva de las cinco especificaciones internas obligatorias y de la implementación observada. Las futuras reglas pedagógicas/EIB que se incorporen al generador real deberán verificarse contra fuente oficial vigente antes de aplicarse.

## Gate de lanzamiento

DocenteDigital **NO está lista para V1.0**. El S1 AUD-254 continúa abierto hasta implementar y probar generación contextualizada real de Materiales. Además permanecen pendientes los E2E Docente/Director, 100 generaciones y anti-alucinación, móvil físico, Word/PDF/impresión reales, autoguardado/restore, seguridad/aislamiento, privacidad, continuidad sin IA, año completo, escala y pilotos.