# AUD-MODE-LABEL-087 — Coherencia visible Modo Fácil / Experto

## Alcance
- Módulo: Inicio / selector de modo.
- Especificaciones aplicadas: Auditoría V3, Simplicidad V4 y gate V5.
- Normativa educativa externa: no aplica a este hallazgo UX.

## Prueba
**ID:** AUD-MODE-LABEL-087

**Entrada:** con el perfil configurado, cambiar de `FÁCIL` a `EXPERTO` y visualizar Inicio.

**Resultado esperado:** el estado visible de Inicio debe corresponder con el modo realmente activo.

## Historia del hallazgo
Inicialmente `setMode(mode)` actualizaba estado, clase `expert` y botones superiores, mientras la etiqueta de Inicio permanecía estática en `✨ Modo Fácil`.

Se implementó `home-surface-truth-v73.js` con `syncModeLabel()` y `guardModeLabel()` para sincronizar la etiqueta tras cada cambio y al restaurar estado persistido.

## Rectificación 2026-09-11
Una revisión posterior volvió a clasificar el defecto como activo al observar que `home-surface-truth-v73.js` no aparece directamente en los `<script src>` de `index.html`. Esa conclusión fue incorrecta porque no siguió la carga transitiva.

`index.html` carga `schedule-prompt-v6.js`, y este contiene `__ddStableModuleLoaderV49`. Su lista `modules=[...]` incluye expresamente `home-surface-truth-v73.js`. El cargador inserta cada módulo secuencialmente mediante elementos `<script>` y espera `onload` antes de continuar.

Por tanto:
- asset correctivo existente: **sí**;
- módulo incluido en el grafo transitivo productivo: **sí**;
- guardia de etiqueta implementada: **sí**;
- prueba física/E2E del cambio visible y restauración tras recarga: **todavía pendiente**.

## Resultado vigente
**PASA a nivel de código e integración declarada.**

No se mantiene un S3 abierto por “etiqueta no sincronizada” basándose únicamente en la ausencia del asset dentro de `index.html`.

La validación final en navegador real `Fácil → Experto → Fácil` y recarga con `expert` persistido continúa pendiente de V3/V5. Hasta tenerla, el hallazgo se considera **CORREGIDO TÉCNICAMENTE / PENDIENTE DE VALIDACIÓN E2E**, no un defecto demostrado en producción.

## Evidencia
- `home-surface-truth-v73.js`: `syncModeLabel()` cambia el indicador a `🔵 Modo Experto` o `✨ Modo Fácil` según `state.mode`.
- `home-surface-truth-v73.js`: `guardModeLabel()` envuelve `window.setMode` y sincroniza después del cambio.
- `schedule-prompt-v6.js`: loader estable que incluye `home-surface-truth-v73.js`.
- Producción canónica: `schedule-prompt-v6.js` y `home-surface-truth-v73.js` responden HTTP 200.

## Severidad vigente
**Sin severidad abierta por defecto demostrado.** El S3 histórico queda cerrado técnicamente, sujeto a retest E2E.

## Reprueba obligatoria
1. Cargar con modo fácil y comprobar `✨ Modo Fácil`.
2. Cambiar a experto y comprobar `🔵 Modo Experto`.
3. Volver a fácil y comprobar sincronización.
4. Recargar con `expert` persistido y comprobar restauración visible.
5. Repetir en móvil y escritorio.

## Riesgo de regresión
**MEDIO.** Existen múltiples overrides globales y carga secuencial; un cambio de orden puede sustituir `setMode` después de instalar la guardia.

## Impacto en indicadores
No recalcular ISU/IUD/IFR/Prelaunch de forma definitiva sin E2E y usuarios reales.

## Estado de lanzamiento
Este cierre técnico no habilita lanzamiento. El gate V5 permanece bloqueado por otros hallazgos S0/S1 y pruebas esenciales pendientes.
