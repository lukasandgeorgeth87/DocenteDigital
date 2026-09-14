# AUD-MATERIALS-SIMULATED-071

## Reconciliación del expediente — 2026-09-14

Este expediente es el antecedente general de la falla de generación simulada de Materiales. La prueba ejecutable posterior `AUD-MATERIAL-CONTROLS-IGNORED-HARDCODED-254` demuestra el mismo S1 subyacente con mayor granularidad (Tema, Tipo, Grado y herencia Unidad/Sesión → Materiales) y queda como **expediente canónico del bloqueante funcional**.

**Regla de cómputo acumulativo:** `AUD-MATERIALS-SIMULATED-071` y `AUD-MATERIAL-CONTROLS-IGNORED-HARDCODED-254` **NO deben contarse como dos S1 independientes**. AUD-071 se conserva por trazabilidad histórica; AUD-254 concentra el estado funcional vigente del bloqueante. La falla distinta de verdad de superficie `AUD-MATERIAL-SURFACE-TRUTH-CLICKABLE-SIMULATION-279` sí conserva identidad propia porque auditó que una guarda visual dejaba ejecutable el generador legado; esa regresión quedó corregida en `material-surface-truth-v70.js` v70.1 y permanece con E2E real pendiente.

La situación actual del producto es coherente con esta separación: `material-integrity-v65.js` evita fabricar una salida y declara que la generación contextualizada no está conectada a un motor validado; `material-surface-truth-v70.js` v70.1 deshabilita la acción, elimina el `onclick` y presenta `Generación de material · En desarrollo`. Esto mejora la verdad de interfaz, pero **no implementa Materiales reales**. Por tanto el S1 funcional canónico AUD-254 continúa abierto y V5 sigue bloqueado.

## Módulo
Carpeta Docente → Materiales

## Especificaciones aplicadas
- AUDITORIA_MAESTRA_INTEGRAL_V2.md
- ADENDA_AUDITORIA_EJECUTABLE_V3.md
- AUDITORIA_SIMPLICIDAD_USO_V4.md
- AUDITORIA_PRELANZAMIENTO_V5.md
- NUCLEO_IA_DOCENTEDIGITAL.md

## Prueba
**ID:** AUD-MATERIALS-SIMULATED-071

**Entrada:** abrir Materiales, seleccionar tipo/idioma/grado, escribir un tema distinto de agua (por ejemplo, hormigas, biohuerto, siembra u otro) y pulsar Crear lectura.

**Resultado esperado:** el material debe responder al tema, grado, idioma y perfil lingüístico seleccionados; no debe inventar una traducción ni ignorar la entrada. Si la generación contextual real no está implementada, la función debe declararse pendiente y no simular un resultado.

**Resultado obtenido antes:** `generateMaterial()` no lee el campo Tema ni el grado. Para Castellano devuelve siempre un texto fijo sobre cuidado del agua. La interfaz ofrece `Lengua originaria` y `Bilingüe`, mientras la función compara contra `Quechua`; por tanto la lógica no corresponde a las opciones visibles. Además incorpora frases quechuas de demostración sin una generación/validación lingüística contextual trazable.

**Evidencia:** `index.html` muestra los selectores de Tipo, Idioma, Lengua originaria/variedad, Grado y Tema; `app.js` implementa `generateMaterial()` con contenido fijo sobre agua y sin lectura del input Tema.

**Estado inicial:** NO PASA

**Severidad:** S1 — riesgo de entregar material pedagógicamente incorrecto o no pertinente al pedido.

**Clasificación inicial:** SIMULADA / PARCIALMENTE FUNCIONAL

## Causa raíz
La superficie de Materiales fue expuesta como generador funcional antes de existir un flujo contextual que utilice realmente tema, grado, idioma, perfil EIB/monolingüe y validación del contenido.

## Corrección segura aplicada
Se actualizó `initial-curriculum-guard-v72.js` a v73.1 para deshabilitar el control que invoca `generateMaterial()`, retirar su `onclick`, marcarlo `aria-disabled`, rotularlo `Crear material · Próximamente` y mostrar un aviso sencillo indicando que la generación contextualizada aún no está implementada como flujo completo.

No se modificó el contenido histórico ni se fabricó una alternativa de IA, traducción o backend inexistente.

## Evidencia posterior
Commit funcional: `9f2b0e7094874072975b48b3484dad5a8c3b5437`.

El estado combinado de GitHub para Vercel pasó a `success` después del despliegue del commit funcional.

La comprobación HTTP directa de `https://docente-digital.vercel.app/` y del asset `/initial-curriculum-guard-v72.js` no pudo completarse en aquella ejecución por un fallo temporal de resolución DNS del entorno de auditoría. Ese pendiente histórico no debe confundirse con la evidencia productiva posterior registrada en AUD-279.

## Estado posterior
- Presentación engañosa del generador fijo como función terminada: mitigada en implementación y reforzada por `material-surface-truth-v70.js` v70.1; E2E físico pendiente.
- Generación contextual real de materiales: INEXISTENTE / PENDIENTE; bloqueante canónico `AUD-MATERIAL-CONTROLS-IGNORED-HARDCODED-254`.
- Validación lingüística EIB real: PENDIENTE.
- Prueba física móvil/impresión: PENDIENTE.

## Fuente oficial
No fue necesario declarar vigencia de una norma específica para este hallazgo; se trata de una prueba funcional y pedagógica según las especificaciones internas V2–V5 y Núcleo IA.

## Riesgo de regresión
Bajo para la mitigación visual aplicada, porque solo deshabilita una acción simulada sin alterar persistencia, documentos guardados ni datos institucionales. Medio para la superficie completa, porque una capa posterior podría volver a conectar el generador legado; AUD-279 añade una guarda específica contra esa regresión. Debe retirarse esta protección cuando exista un generador real probado.

## Impacto en indicadores
- IUD/ICGD: el flujo de materiales sigue incompleto; no corresponde aumentar puntajes definitivos.
- IFR: mejora al eliminar una respuesta falsa/irrelevante, pero la función real sigue pendiente; AUD-071 no se suma nuevamente a AUD-254.
- ISU: mejora la claridad al no prometer una función inexistente, aunque el módulo pendiente reduce completitud.
- Prelaunch: continúa bloqueado porque Materiales forma parte del recorrido Docente V1.0 y aún no existe generación contextual real.

## Gate V5
DocenteDigital NO se declara lista para lanzamiento. Permanecen pendientes, entre otros, Ficha Maestra completa, Programación real, Materiales reales, Evaluación/Registro reales, Director E2E, IA semántica real, autenticación/aislamiento, backend productivo, OWASP ASVS, privacidad, backup/restauración real, Word/PDF físicos, móvil físico, 100 generaciones, año completo, concurrencia y pilotos reales.