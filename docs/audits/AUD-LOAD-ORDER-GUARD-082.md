# AUD-LOAD-ORDER-GUARD-082

## Módulo
Carga de scripts / guardas V3-V5 / Unidad-Proyecto.

## Especificaciones aplicadas
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

## Corrección de auditoría
Este hallazgo fue inicialmente registrado como una regresión S2 por observar el orden estático de scripts `app.js` → `initial-curriculum-guard-v72.js` → `enhancements.js`. Esa conclusión era incompleta porque no consideró el momento real en que se instala la guardia.

`initial-curriculum-guard-v72.js` no ejecuta `preventHardcodedCcotataquiProduct()` inmediatamente durante el parseo cuando `document.readyState === 'loading'`. Registra `initializeUiGuards()` para `DOMContentLoaded`. Como `enhancements.js` se carga de forma síncrona durante el mismo parseo y antes de que dispare `DOMContentLoaded`, su reasignación final de `createUnitDemo` ya existe cuando `initializeUiGuards()` se ejecuta. Por tanto, `preventHardcodedCcotataquiProduct()` envuelve la implementación final disponible en ese momento.

## Prueba corregida
**ID:** AUD-LOAD-ORDER-GUARD-082

**Entrada:** inspeccionar el HTML y el ciclo real de ejecución de `app.js`, `initial-curriculum-guard-v72.js` y `enhancements.js`, incluyendo `DOMContentLoaded`.

**Resultado esperado:** la guardia territorial debe instalarse después de la última reasignación síncrona de `createUnitDemo` que participa en el flujo actual.

**Resultado obtenido:** aunque el archivo de la guardia aparece antes de `enhancements.js` en el HTML, `initializeUiGuards()` se difiere hasta `DOMContentLoaded`. `enhancements.js` termina de cargarse y reasigna `createUnitDemo` antes de ese evento. Luego `preventHardcodedCcotataquiProduct()` captura y envuelve esa implementación final.

**Resultado:** PASA para este riesgo específico de orden de carga síncrono.

**Clasificación:** FUNCIONAL como instalación diferida de la guardia; la territorialidad global sigue PARCIALMENTE FUNCIONAL por otras formulaciones rígidas que permanecen en el generador preliminar.

**Severidad corregida:** S4 — registro de auditoría corregido. No se mantiene el S2 previo por orden de carga.

## Evidencia técnica
- Producción sirve `app.js` → `initial-curriculum-guard-v72.js` → `enhancements.js`.
- `initial-curriculum-guard-v72.js` registra `initializeUiGuards` en `DOMContentLoaded` cuando el documento aún está cargando.
- `initializeUiGuards()` invoca `preventHardcodedCcotataquiProduct()`.
- `enhancements.js` se ejecuta síncronamente antes de `DOMContentLoaded`, por lo que su `createUnitDemo=function(){...}` ya está definido cuando la guardia lo envuelve.
- Producción respondió HTTP 200 para `/` y `/initial-curriculum-guard-v72.js` en el retest del 2026-09-02.

## Riesgo residual real
El problema de territorialidad no queda cerrado globalmente. `enhancements.js` todavía contiene textos automáticos con `Ccotataqui`, `nuestra comunidad` y `nuestras familias`. La guardia corrige específicamente el producto con Ccotataqui cuando ese topónimo no fue proporcionado, pero no sustituye una comprensión semántica real ni neutraliza todas las presunciones territoriales.

También existe riesgo futuro si se agrega un script posterior a `DOMContentLoaded` que vuelva a sobrescribir `createUnitDemo`; ese escenario deberá cubrirse con prueba automatizada o validación dentro de la implementación definitiva.

## Acción correctiva
No se modificó código funcional en esta corrección porque el defecto de orden de carga descrito originalmente no existe bajo el ciclo de ejecución actual. Se corrigió el informe para no mantener un falso positivo.

La mejora estructural futura sigue siendo trasladar validaciones críticas desde monkey-patching a la implementación definitiva y cubrirlas con pruebas automatizadas.

## Impacto
- **IUD/ICGD:** sin cambio cuantitativo; territorialidad global continúa pendiente.
- **IFR:** mejora la confiabilidad de la auditoría al retirar un falso positivo.
- **ISU:** sin puntaje definitivo; requiere usuarios reales.
- **Prelaunch:** no cambia el gate V5; los bloqueantes reales permanecen abiertos.

## Bloqueantes V5 que permanecen
Comprensión semántica IA real; Ficha Maestra completa; Programación; Materiales; Evaluación/Registro; Director E2E; autenticación/aislamiento/backend; OWASP ASVS y privacidad; backup/restauración real; Word/PDF/impresión físicos; móvil físico; 100 generaciones; año completo; concurrencia; monitoreo/costo IA; separación efectiva de entornos; rollback probado y pilotos reales.

No se aplicó ni declaró vigente ninguna norma educativa en esta corrección.