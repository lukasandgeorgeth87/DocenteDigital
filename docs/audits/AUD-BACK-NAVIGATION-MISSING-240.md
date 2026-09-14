# AUD-BACK-NAVIGATION-MISSING-240 — Ruta clara de regreso

## Especificaciones aplicadas
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

## Regla aplicable
V4, punto 18: **“Volver siempre fácil. El usuario no debe sentirse atrapado. Debe existir una ruta clara para volver.”**

## Prueba original
**ID:** AUD-BACK-240-A  
**Módulo:** Navegación transversal Docente/Director.  
**Entrada:** entrar desde Inicio a Mi planificación, Crear sesión, Materiales, Evaluación o Director y buscar una acción visible para regresar al contexto anterior.  
**Resultado esperado:** una ruta de regreso explícita, predecible y visible en el contenido o cabecera de cada flujo; en móvil no debe depender de adivinar el menú o usar el botón físico/gesto del navegador.  
**Resultado obtenido originalmente:** el `index.html` tenía botones `← Atrás` únicamente dentro de los pasos 2–4 del setup inicial; las pantallas principales no exponían una acción contextual de regreso.  
**Resultado original:** NO PASA.  
**Severidad original:** S3 MEDIO.  
**Clasificación original:** PARCIALMENTE FUNCIONAL.

## Revalidación 2026-09-14
El expediente original quedó desactualizado frente al runtime actual. `home-surface-truth-v73.js` implementa ahora `ensureBackButton()` y `guardNavigationHistory()`:
- crea un botón global visible `← Volver` con `aria-label="Volver a la pantalla anterior"`;
- conserva `window.__ddPreviousScreen` al navegar con `go(id)`;
- vuelve a la pantalla anterior válida y, si no existe, cae de forma segura a `home`;
- no usa `history.back()` a ciegas;
- integra el setup: si se está en pasos 2–4, retrocede con `nextSetup(visible-1)`;
- mantiene foco/accesibilidad mediante `syncNavigationAccessibility()`;
- aplica un objetivo táctil mínimo y reglas específicas para móvil/escritorio mediante CSS.

### AUD-BACK-240-R1
**Entrada:** inspección de `home-surface-truth-v73.js` cargado por el runtime estable.  
**Resultado esperado:** implementación de regreso interno, visible y no dependiente del historial externo del navegador.  
**Resultado obtenido:** la implementación está presente y conectada al wrapper de `go()`.  
**Evidencia:** `home-surface-truth-v73.js`: `ensureBackButton()`, `guardNavigationHistory()`, `syncNavigationAccessibility()`; `schedule-prompt-v6.js` incluye `home-surface-truth-v73.js` en la cola estable de módulos.  
**Resultado:** PASA EN IMPLEMENTACIÓN.  
**Clasificación actual:** FUNCIONAL EN IMPLEMENTACIÓN / E2E REAL PENDIENTE.  
**Severidad actual del defecto de código:** cerrada a nivel de implementación; la evidencia de facilidad real permanece PENDIENTE.

## Causa raíz original
La arquitectura base de navegación fue concebida como menú lateral por destinos y no conservaba historial contextual. La capa `home-surface-truth-v73.js` añadió posteriormente historial interno y una acción global de regreso.

## Corrección existente
No se aplicó un cambio de runtime en esta revalidación porque la corrección ya estaba presente. Se corrigió únicamente este expediente para que el informe acumulativo no siga declarando como INEXISTENTE una función ya implementada.

## Riesgo de regresión
Medio. La navegación está compuesta por varios wrappers de `go()`. Debe comprobarse en navegador real que el orden de carga no sobrescribe `guardNavigationHistory()` y que Director/Configuración, setup y navegación móvil conservan el comportamiento esperado.

## Impacto cualitativo
Mejora la conformidad V4 y el ISU cualitativo. No se calcula ISU ni Prelaunch Score definitivo. El cierre definitivo depende de evidencia E2E y usuarios reales, conforme V3/V5.

## Pendientes reales antes de cierre definitivo
- prueba interactiva escritorio: home → plan → volver; home → sesión → volver; configuración/director → volver;
- prueba móvil física y navegación por pulgar;
- prueba con cambios/borradores y autoguardado;
- prueba de foco/teclado/lector de pantalla;
- prueba con docentes/directores principiantes;
- comprobar que la composición de wrappers de `go()` no rompe el historial después de carga completa.
