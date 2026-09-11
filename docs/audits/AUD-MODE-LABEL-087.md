# AUD-MODE-LABEL-087 — Coherencia visible Modo Fácil / Experto

## Alcance

- Módulo: Inicio / selector de modo.
- Especificaciones aplicadas: Auditoría V3, Simplicidad V4 y gate V5.
- Normativa educativa externa: no aplica a este hallazgo UX; no se declara ninguna vigencia normativa en esta prueba.

## Prueba

**ID:** AUD-MODE-LABEL-087

**Entrada:** con el perfil configurado, cambiar de `FÁCIL` a `EXPERTO` y visualizar Inicio.

**Resultado esperado:** el estado visible de Inicio debe corresponder con el modo realmente activo. Si `state.mode` es `expert`, Inicio no debe continuar mostrando `Modo Fácil`.

**Resultado obtenido antes de corregir:** `setMode(mode)` actualizaba el estado, la clase `expert` del `body` y los botones superiores, pero el indicador de la cabecera de Inicio era texto estático `✨ Modo Fácil` y no se sincronizaba.

**Evidencia inicial:**
- `index.html`: indicador estático `#home .hero .pill` con `✨ Modo Fácil`.
- `app.js`: `setMode(mode)` modifica estado, clases y botones, pero no modifica ese indicador.

**Resultado inicial:** NO PASA.

**Severidad:** S3 — MEDIO. Inconsistencia UX visible; no se demostró pérdida de datos, defecto pedagógico ni defecto de seguridad.

**Clasificación inicial:** PARCIALMENTE FUNCIONAL. El cambio de modo existe, pero una señal principal de la interfaz contradice el estado activo.

## Causa raíz

El indicador de Inicio no estaba enlazado con la fuente de estado `state.mode`. El selector superior y el contenido de Inicio evolucionaron como superficies independientes.

## Corrección implementada como asset

Se creó/actualizó `home-surface-truth-v73.js` para:

1. incorporar `syncModeLabel()`, que muestra `🔵 Modo Experto` cuando el modo activo es experto y `✨ Modo Fácil` cuando es fácil;
2. envolver de forma idempotente `window.setMode` mediante `guardModeLabel()` para sincronizar la etiqueta después de cada cambio;
3. sincronizar también al aplicar la guardia, de modo que un modo persistido se refleje al cargar la interfaz.

La modificación es pequeña, local y reversible. No altera generación pedagógica, EIB, Director, persistencia ni exportación.

**Commit funcional:** `09a1564ff8888d96c0a57de67922ac37b927624e`.

## Retest histórico — evidencia insuficiente

El retest histórico registró:

- GitHub Actions `Prelaunch Smoke`, run `33631285557`: `completed / success` sobre el commit funcional.
- Vercel deployment `dpl_4uBrjfhKs1gkkqnHDnf15sHFyuid`: `production / READY` para el mismo commit.
- `/home-surface-truth-v73.js` respondía HTTP 200 y contenía `syncModeLabel()` y `guardModeLabel()`.

Ese retest **no demuestra integración runtime**. Un asset servido con HTTP 200 no equivale a que `index.html` lo cargue ni a que el navegador ejecute su override. Esta limitación coincide con `AUD-PRODUCTION-RUNTIME-FIXES-NOT-WIRED-204` y `AUD-RUNTIME-GUARDS-NOT-LOADED-230`.

## Revisión de estado productivo — 2026-09-10/11

Se volvió a inspeccionar el HTML servido por la URL canónica `https://docente-digital.vercel.app/` y el `index.html` de `main`.

La cadena de scripts efectivamente declarada en la página canónica carga:

- `storage-recovery-v26.js`
- `storage-access-guard-v71.js`
- `app.js`
- `director-prototype-guard-v40.js`
- `initial-curriculum-guard-v72.js`
- `enhancements.js`
- `format-v2.js`
- script inline `unitBrief`
- `schedule-v3.js`
- `strategies-v4.js`
- `resources-v5.js`
- `schedule-prompt-v6.js`

**`home-surface-truth-v73.js` no está referenciado en el HTML canónico.** Tampoco se encontró en esta prueba evidencia de un cargador transitivo que lo ejecute.

Por ello, la conclusión histórica “PASA a nivel de código e integración desplegada” queda **RECTIFICADA**:

- asset/código correctivo existente: **FUNCIONAL como archivo**;
- integración en runtime canónico: **INEXISTENTE / NO DEMOSTRADA**;
- defecto visible de etiqueta Fácil/Experto en producción: **NO PASA** mientras la guardia no esté cableada y ejecutada;
- severidad del defecto concreto: **S3 MEDIO**;
- causa transversal de release/runtime: ya cubierta por **AUD-204 / AUD-230**, por lo que no se crea una segunda penalización S1 por esta misma causa raíz.

## Resultado vigente

**NO PASA — PARCIALMENTE FUNCIONAL — S3 MEDIO.**

El selector cambia el estado interno y las clases, pero la corrección visible del indicador de Inicio no puede darse por activa en la producción canónica mientras `home-surface-truth-v73.js` permanezca fuera del grafo de ejecución.

## Acción correctiva

No agregar únicamente este script de forma aislada sin revisar el orden de overrides. La corrección debe resolverse dentro del plan transversal de AUD-204/AUD-230:

1. definir manifiesto/bundle de runtime;
2. declarar qué guardas son requeridas;
3. integrar `home-surface-truth-v73.js` en el orden correcto o trasladar `syncModeLabel()` al código canónico;
4. ejecutar prueba real de navegador `Fácil → Experto → Fácil`;
5. recargar con `expert` persistido y comprobar que Inicio muestre `🔵 Modo Experto`;
6. incluir esta aserción en el smoke E2E del runtime, no limitarse a comprobar HTTP 200 del asset.

## Evidencia pendiente que no se simula

No se considera demostrada todavía la interacción en navegador físico, celular/tablet real, lector de pantalla ni prueba con docentes/directores reales. La batería posterior deberá cubrir al menos `Fácil → Experto → Fácil` y recarga con modo Experto persistido.

## Riesgo de regresión

Medio mientras existan múltiples archivos que reemplazan funciones globales sin un manifiesto de carga. Una integración futura puede volver a sustituir `window.setMode` después de instalar la guardia.

## Impacto en indicadores

- ISU/IUD: afectación cualitativa por inconsistencia visible del modo, sin puntaje definitivo.
- IFR: afectado indirectamente por la discrepancia repositorio → runtime ya registrada en AUD-204/AUD-230.
- Prelaunch: el S3 concreto no es bloqueante por sí solo; el gate permanece bloqueado por los S0/S1 y pruebas esenciales pendientes.

## Estado de lanzamiento

Este hallazgo no habilita lanzamiento V1.0. Permanecen pendientes, entre otros, IA semántica real, Ficha Maestra completa, Programación, Materiales, Evaluación/Registro, Director E2E, autenticación/aislamiento/backend, OWASP ASVS y privacidad, restauración real, Word/PDF/impresión físicos, móvil físico, 100 generaciones, año completo, concurrencia, monitoreo/costo IA, separación de entornos, rollback probado y pilotos reales.
