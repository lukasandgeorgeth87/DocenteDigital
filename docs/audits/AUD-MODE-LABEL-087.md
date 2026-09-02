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

## Corrección

Se actualizó `home-surface-truth-v73.js` para:

1. incorporar `syncModeLabel()`, que muestra `🔵 Modo Experto` cuando el modo activo es experto y `✨ Modo Fácil` cuando es fácil;
2. envolver de forma idempotente `window.setMode` mediante `guardModeLabel()` para sincronizar la etiqueta después de cada cambio;
3. sincronizar también al aplicar la guardia, de modo que un modo persistido se refleje al cargar la interfaz.

La modificación es pequeña, local y reversible. No altera generación pedagógica, EIB, Director, persistencia ni exportación.

**Commit funcional:** `09a1564ff8888d96c0a57de67922ac37b927624e`.

## Retest técnico

- GitHub Actions `Prelaunch Smoke`, run `33631285557`: `completed / success` sobre el commit funcional.
- Vercel deployment `dpl_4uBrjfhKs1gkkqnHDnf15sHFyuid`: `production / READY` para el mismo commit.
- Producción sirve `/home-surface-truth-v73.js` con HTTP 200 y contiene `syncModeLabel()` y `guardModeLabel()`.

**Resultado posterior:** PASA a nivel de código e integración desplegada para el defecto concreto.

## Evidencia pendiente que no se simula

No se considera demostrada todavía la interacción en navegador físico, celular/tablet real, lector de pantalla ni prueba con docentes/directores reales. La batería posterior deberá cubrir al menos `Fácil → Experto → Fácil` y recarga con modo Experto persistido.

## Riesgo de regresión

Bajo, pero existe si un módulo futuro vuelve a reemplazar `window.setMode` después de instalar esta guardia. Mantener este caso en las pruebas automatizadas de interfaz cuando exista una batería E2E de navegador.

## Impacto en indicadores

- ISU/IUD: mejora cualitativa de consistencia y comprensión del estado, sin asignar puntaje definitivo.
- IFR: sin cambio cuantificado.
- Prelaunch: corrige un S3 concreto, pero no elimina los bloqueantes V5 pendientes.

## Estado de lanzamiento

Este hallazgo no habilita lanzamiento V1.0. Permanecen pendientes, entre otros, IA semántica real, Ficha Maestra completa, Programación, Materiales, Evaluación/Registro, Director E2E, autenticación/aislamiento/backend, OWASP ASVS y privacidad, restauración real, Word/PDF/impresión físicos, móvil físico, 100 generaciones, año completo, concurrencia, monitoreo/costo IA, separación de entornos, rollback probado y pilotos reales.
