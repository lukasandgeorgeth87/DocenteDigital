# AUD-SETUP-AUTOSAVE-RUNTIME-NOT-WIRED-208

## Resumen

**Módulo:** Configuración inicial / persistencia / recuperación

**Estado:** NO PASA

**Severidad:** S1 CRÍTICO

**Clasificación funcional:**
- Configuración inicial base: PARCIALMENTE FUNCIONAL.
- Persistencia al finalizar (`Guardar y entrar`): FUNCIONAL de forma local.
- Autoguardado durante los pasos previos: INEXISTENTE en el runtime productivo canónico.
- Guardia `config-state-guard-v42.js`: implementada en repositorio, pero NO CARGADA por `index.html` productivo.
- Recuperación del progreso intermedio tras recarga/cierre: NO DEMOSTRADA y, por el wiring actual, no disponible para las selecciones aún no guardadas.

## Especificaciones obligatorias aplicadas

V3 exige demostrar funcionalidad mediante entrada → resultado esperado → resultado obtenido → evidencia → PASA/NO PASA → severidad → acción correctiva. V4 exige guardado automático y continuar donde quedó. V5 exige probar recarga, cierre del navegador, cambio de pestaña, interrupción y retorno sin perder información, y considera el guardado inestable un bloqueante de prelaunch.

## Prueba

**ID:** AUD-SETUP-AUTOSAVE-RUNTIME-NOT-WIRED-208

**Entrada:**
1. Abrir DocenteDigital desde cero.
2. Seleccionar Nivel.
3. Seleccionar Tipo de IE.
4. Seleccionar grados/edades y/o áreas.
5. Antes de pulsar `Guardar y entrar`, recargar o cerrar y volver a abrir.

**Resultado esperado:**
Cada cambio relevante de la configuración debe persistirse automáticamente y el sistema debe recuperar el progreso intermedio sin obligar a repetir información ya ingresada.

**Resultado obtenido:**
`app.js` solo persiste inmediatamente en algunas acciones generales y, dentro del asistente inicial, `chooseOne()` y los handlers de grado/área modifican `state` sin llamar a `save()`. La persistencia base del perfil se consolida en `finishSetup()` al final del flujo.

Existe una corrección específica en `config-state-guard-v42.js`: envuelve `chooseOne()`, `nextSetup()`, clics de grados/áreas y cambios del perfil lingüístico para ejecutar `persistSetupProgress()` y `save()`. Sin embargo, el `index.html` productivo no carga `config-state-guard-v42.js`; su lista efectiva de scripts incluye `storage-recovery-v26.js`, `storage-access-guard-v71.js`, `app.js`, `initial-curriculum-guard-v72.js`, `enhancements.js`, `format-v2.js`, `schedule-v3.js`, `strategies-v4.js`, `resources-v5.js` y `schedule-prompt-v6.js`.

Por tanto, la protección de autoguardado está presente en el repositorio pero no forma parte del runtime canónico.

## Evidencia técnica

### `app.js`
- Inicializa `state` desde `localStorage`.
- `save()` escribe `docenteDigitalPrototype`.
- `chooseOne()` cambia `state[key]` pero no guarda.
- Los clics de grado/área cambian `state.grades` / `state.areas` pero no guardan.
- `finishSetup()` ejecuta `save()` al final.

### `config-state-guard-v42.js`
Implementa explícitamente:
- `persistSetupProgress()`;
- wrapper de `chooseOne()` con guardado;
- wrapper de `nextSetup()` con guardado;
- listener de clic para grados/áreas;
- listener de cambio para `linguisticMode`, `language` y `quechuaVar`;
- recuperación guiada al paso pendiente.

### `index.html`
No incluye `<script src="config-state-guard-v42.js"></script>`.

## Causa raíz

La arquitectura contiene correcciones en archivos de guarda independientes, pero el runtime productivo no dispone de un manifiesto/bundle único que garantice que las guardas requeridas se carguen y ejecuten en el orden correcto. Este hallazgo es una manifestación específica del problema de wiring documentado anteriormente, con impacto directo en una exigencia V5 de persistencia y recuperación.

## PASA / NO PASA

**NO PASA.**

La existencia del archivo correctivo no constituye evidencia funcional mientras la página canónica no lo cargue ni ejecute.

## Riesgo

Un docente/director principiante puede completar varios pasos y perder el progreso por recarga, cierre o interrupción antes de `Guardar y entrar`. Es un error silencioso: no aparece Error 500 y Vercel puede seguir READY/HTTP 200.

## Acción correctiva

No conectar únicamente `config-state-guard-v42.js` de forma aislada sin resolver sus dependencias. La guarda exige una configuración lingüística completa; `linguistic-profile-v26.js` es la capa que monta el catálogo EIB y valida lengua/variedad, y actualmente tampoco forma parte del runtime canónico.

La corrección segura debe:
1. definir un manifiesto/bundle productivo único y ordenado;
2. cargar conjuntamente las capas de configuración y perfil lingüístico compatibles;
3. añadir prueba automática de wiring que falle si el autoguardado requerido no está ejecutándose;
4. ejecutar prueba real: seleccionar cada paso → recargar → verificar recuperación exacta;
5. probar EIB y monolingüe, cambio de nivel/tipo de IE y datos incompatibles;
6. confirmar que la recuperación no mezcla datos históricos ni asigna lengua por territorio.

## Evidencia posterior requerida

PENDIENTE hasta comprobar en navegador real/automatizado:
- recarga después de cada paso;
- cierre y reapertura;
- interrupción de conexión;
- EIB con lengua confirmada;
- monolingüe castellano;
- cambio de nivel con limpieza coherente de grados/áreas;
- recuperación exacta sin datos heredados inválidos.

## Fuente oficial externa

No se aplicó ninguna norma externa MINEDU/UGEL/legal a este hallazgo. La conclusión deriva de V2–V5, Núcleo IA y del wiring/código productivo actual. No se declara ninguna vigencia normativa externa.

## Impacto en indicadores

- **IUD:** impacto negativo por repetición de datos y pérdida de avance.
- **ICGD:** impacto negativo por incoherencia entre estado esperado y persistido.
- **IFR:** no calcular definitivamente; este fallo impide aprobar persistencia/recuperación.
- **ISU:** no calcular definitivamente; el usuario puede repetir el asistente por pérdida de progreso.
- **Prelaunch:** BLOQUEADO mientras el guardado/recuperación esencial no esté demostrado.

## Riesgo de regresión

ALTO si se conectan guardas aisladas sin ordenar dependencias: puede bloquear el setup EIB o dejar perfiles parcialmente configurados. La integración debe probarse como conjunto y no mediante inserción indiscriminada de scripts.
