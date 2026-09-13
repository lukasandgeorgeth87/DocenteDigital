# AUD-MOBILE-NAV-DUPLICATE-DIRECTOR-274

## Resumen

Se detectó un conflicto entre dos guardias de navegación móvil. `director-prototype-guard-v40.js` carga tempranamente `mobile-navigation-guard-v60.js`, cuya política es conservar cinco accesos frecuentes y agregar un sexto botón `Más` que contiene `Director` y `Configuración`. Sin embargo, `initial-curriculum-guard-v72.js` también ejecuta `ensureDirectorMobileAccess()` y agrega un botón directo `Director` cuando no encuentra un elemento `[data-screen="director"]` en la barra móvil.

El menú `Más` no usa `data-screen="director"`, sino `data-dd-go="director"`. Por ello ambas capas podían coexistir y dejar siete controles en una barra CSS configurada para seis columnas. El problema era independiente del orden efectivo entre la carga dinámica temprana y la guardia curricular: si Director directo aparecía primero, el guard móvil añadía después `Más`; si `Más` aparecía primero, la guardia curricular no lo reconocía como acceso a Director y añadía el botón directo.

## Especificaciones aplicadas

- V4: menos controles simultáneos, funciones secundarias en `Más opciones`, botones utilizables con el pulgar, consistencia y estabilidad de navegación móvil.
- V5: la aplicación debe funcionar físicamente en móvil; el código corregido no sustituye prueba en dispositivos reales.
- V3: el hallazgo se registra con entrada, esperado, obtenido, evidencia, resultado, severidad y acción.

No se aplicó ni declaró vigente ninguna norma externa en esta corrección; por tanto no fue necesaria una afirmación normativa nueva.

## Prueba AUD-MOBILE-274-A

- **Módulo:** Navegación móvil / Director / Configuración.
- **Entrada:** Carga normal de la aplicación en ancho <=850 px con las guardias `director-prototype-guard-v40.js`, `mobile-navigation-guard-v60.js` e `initial-curriculum-guard-v72.js` activas.
- **Resultado esperado:** cinco accesos frecuentes + un único botón `Más`; Director y Configuración accesibles dentro de `Más`; máximo seis controles principales en la barra.
- **Resultado obtenido antes de corregir:** `mobile-navigation-guard-v60.js` agregaba `Más`, mientras `ensureDirectorMobileAccess()` podía agregar también `Director` directo. El selector usado por la guardia curricular no reconoce `data-dd-go="director"` dentro de `Más`.
- **Evidencia:** código de ambas guardias y orden de carga del `index.html`.
- **Resultado:** **NO PASA**.
- **Clasificación:** **PARCIALMENTE FUNCIONAL**.
- **Severidad:** **S2 ALTO**.
- **Causa raíz:** dos capas independientes intentaban resolver el mismo requisito de acceso móvil con selectores y políticas de navegación diferentes.
- **Riesgo:** saturación de la barra, objetivos táctiles más pequeños, inconsistencia visual, duplicación de destino y degradación de la prueba del pulgar.

## Corrección aplicada

Commit funcional: `09fdadf50081a9e4edba785cc83ac1521dc853b5` (`fix: deduplicate mobile Director navigation`).

`mobile-navigation-guard-v60.js` pasa a v60.1 y se convierte en la capa canónica de deduplicación:

1. elimina cualquier botón legado directo `[data-screen="director"]` dentro de `.mobile-nav` antes de montar `Más`;
2. instala un `MutationObserver` limitado a `childList` de la barra móvil;
3. si una guardia posterior intenta reinsertar un Director directo, lo elimina;
4. conserva `Director` y `Configuración` dentro del menú `Más`;
5. conserva seis columnas móviles.

La corrección no modifica rutas, roles, documentos, estado pedagógico, persistencia ni históricos.

## Reprueba AUD-MOBILE-274-R1

- **Entrada:** inspección del código corregido con posible inserción de `Director` antes o después de montar `Más`.
- **Esperado:** el estado estable contiene los cinco accesos base + `Más`, sin `Director` directo duplicado.
- **Obtenido:** `removeLegacyDirector()` limpia el duplicado existente y `MutationObserver` cubre inserciones posteriores.
- **Resultado:** **PASA EN IMPLEMENTACIÓN**.
- **Clasificación posterior:** **FUNCIONAL EN IMPLEMENTACIÓN / E2E FÍSICO PENDIENTE**.
- **Severidad residual:** S3 hasta prueba visual/táctil real.

## Evidencia aún pendiente V5

No se considera cerrado en V5 hasta verificar físicamente al menos 320, 360, 375, 390, 412, 768 y 850 px, celular económico, celular gama media y tablet; comprobar que `Más` abre/cierra, Director y Configuración navegan correctamente, Escape/foco funcionan donde corresponda, no existe clipping y los objetivos táctiles siguen siendo utilizables.

## Impacto en indicadores

- **IUD:** mejora potencial; no se calcula puntuación definitiva sin prueba real.
- **ICGD:** sin cambio pedagógico/directivo de contenido; mejora de acceso al espacio Director.
- **IFR:** reduce un riesgo de regresión visual por carga de guardias; valor definitivo pendiente.
- **ISU:** mejora potencial en consistencia y prueba del pulgar; no se asigna puntaje.
- **Prelaunch:** el hallazgo deja de bloquear por código una navegación estable, pero V5 permanece bloqueado por pruebas móviles físicas y demás evidencias esenciales pendientes.

## Riesgo de regresión

Bajo-medio. El `MutationObserver` observa únicamente cambios de hijos de `.mobile-nav` y elimina exclusivamente botones con `[data-screen="director"]`; no observa atributos ni el resto del DOM. Debe incluirse una prueba automática futura que afirme exactamente seis accesos móviles y una única ruta visible a Director en la superficie principal.