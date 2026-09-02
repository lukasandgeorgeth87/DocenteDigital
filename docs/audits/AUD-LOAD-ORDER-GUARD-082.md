# AUD-LOAD-ORDER-GUARD-082

## Módulo
Carga de scripts / guardas V3-V5 / Unidad-Proyecto.

## Especificaciones aplicadas
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

## Prueba
**ID:** AUD-LOAD-ORDER-GUARD-082

**Entrada:** inspeccionar el HTML servido en producción y comparar el orden real de carga de `app.js`, `initial-curriculum-guard-v72.js` y `enhancements.js` con las reasignaciones de funciones críticas.

**Resultado esperado:** las guardas que envuelven o sustituyen funciones críticas deben instalarse después de la última implementación/reasignación de esas funciones, o contar con un mecanismo que garantice que no sean sobrescritas después.

**Resultado obtenido:** producción carga `app.js` → `initial-curriculum-guard-v72.js` → `enhancements.js`. La guardia `preventHardcodedCcotataquiProduct()` captura y reemplaza `window.createUnitDemo`, pero posteriormente `enhancements.js` reasigna `createUnitDemo=function(){...}`. En consecuencia, la protección aplicada por la guardia puede quedar anulada para la implementación final de Unidad/Proyecto. `enhancements.js` todavía contiene `ddProduct()` con `Gran Libro de la Siembra de Ccotataqui...`.

**Resultado:** NO PASA.

**Clasificación:** PARCIALMENTE FUNCIONAL / REGRESIÓN DE INTEGRACIÓN.

**Severidad:** S2 — ALTO. Una protección semántica/territorial puede existir en código y aun así no gobernar la función ejecutada realmente, generando un falso positivo de auditoría y riesgo de introducir territorio no proporcionado.

## Causa raíz
Orden de carga incompatible con una guardia basada en monkey-patching: la guardia se instala sobre la versión de `createUnitDemo` de `app.js` y después `enhancements.js` reemplaza esa referencia global.

## Acción correctiva pendiente
No se cambió el orden de scripts en esta ejecución porque mover una guardia central afecta también configuración, Sesiones, Director, módulos críticos y otras envolturas. Sin una prueba de navegador automatizada completa de regresión, no es seguro declarar ese cambio como pequeño y verificado.

La corrección debe garantizar de forma explícita una de estas opciones y luego volver a probar:
1. cargar la guardia después de todas las implementaciones que sobrescriben funciones;
2. dejar de depender de monkey-patching y aplicar las validaciones dentro de la implementación final;
3. exportar/reinstalar las guardas después de cada módulo que pueda reemplazar funciones.

## Retest requerido
- caso sin `Ccotataqui`: nunca introducir Ccotataqui;
- caso con `Ccotataqui`: conservarlo;
- caso urbano/periurbano: no asumir comunidad;
- biohuerto finalidad X→Y;
- hormigas en el aula;
- sesión sin Unidad/Proyecto real;
- Director y módulos declarados pendientes;
- errores de carga de módulos críticos;
- persistencia y recuperación.

## Evidencia técnica
- HTML de producción observado el 2026-09-02: `app.js` → `initial-curriculum-guard-v72.js` → `enhancements.js`.
- `initial-curriculum-guard-v72.js`: `preventHardcodedCcotataquiProduct()` envuelve `window.createUnitDemo`.
- `enhancements.js`: reasigna posteriormente `createUnitDemo=function(){...}` y mantiene un producto de siembra con `Ccotataqui` hardcodeado.

## Riesgo de regresión
Alto mientras las guardas dependan del orden de carga. Un cambio futuro puede volver a activar implementaciones antiguas o simuladas aunque la guardia exista en el repositorio.

## Impacto
- **IUD/ICGD:** riesgo de incoherencia territorial y semántica; no se calcula puntaje definitivo.
- **IFR:** aumenta riesgo de falso positivo funcional; no se calcula valor definitivo.
- **ISU:** impacto indirecto por resultados no pertinentes; pendiente de usuarios reales.
- **Prelaunch:** mantiene bloqueado V1.0 hasta demostrar integración real y pruebas E2E.

## Bloqueantes V5 que permanecen
Comprensión semántica IA real; Ficha Maestra completa; Programación; Materiales; Evaluación/Registro; Director E2E; autenticación/aislamiento/backend; OWASP ASVS y privacidad; backup/restauración real; Word/PDF/impresión físicos; móvil físico; 100 generaciones; año completo; concurrencia; monitoreo/costo IA; separación efectiva de entornos; rollback probado y pilotos reales.

No se aplicó ni declaró vigente ninguna norma educativa en este hallazgo.