# AUD-CRITICAL-MODULE-SILENT-074

## Módulo
Carga de guardias críticas / errores silenciosos / continuidad segura.

## Especificaciones aplicadas
- AUDITORIA_MAESTRA_INTEGRAL_V2.md
- ADENDA_AUDITORIA_EJECUTABLE_V3.md
- AUDITORIA_SIMPLICIDAD_USO_V4.md
- AUDITORIA_PRELANZAMIENTO_V5.md
- NUCLEO_IA_DOCENTEDIGITAL.md

## Prueba
**ID:** AUD-CRITICAL-MODULE-SILENT-074

**Entrada:** provocar o simular fallo de carga HTTP de uno de los módulos críticos cargados dinámicamente por `initial-curriculum-guard-v72.js`: `config-state-guard-v42.js`, `curriculum-safety-v27.js` o `docx-export-v29.js`.

**Resultado esperado:** el fallo debe quedar registrado y también ser visible para el usuario en lenguaje sencillo; no debe continuar como un error silencioso porque puede dejar inactivas guardas de configuración, seguridad curricular o exportación DOCX.

**Resultado obtenido antes:** `script.onerror` solo agregaba el archivo a `window.ddModuleLoadFailures` y escribía `console.error`. El usuario final no recibía ninguna advertencia visible. Si fallaba el exportador DOCX, la app podía quedar expuesta al comportamiento de exportación anterior; si fallaba seguridad curricular/configuración, las protecciones correspondientes podían no activarse sin señal visible.

**Evidencia:** `initial-curriculum-guard-v72.js` v73.1, función `loadCriticalModule()`.

**Estado inicial:** NO PASA.

**Severidad:** S2 ALTO. Un fallo de red/CDN puede degradar protecciones importantes sin Error 500 ni aviso de interfaz. Si el fallo derivara en exportación inutilizable o contenido curricular presentado indebidamente, el impacto concreto podría escalar a S1; esta prueba no simula ni declara que dicho fallo haya ocurrido en producción.

**Clasificación:** PARCIALMENTE FUNCIONAL.

## Causa raíz
El manejador `onerror` de módulos críticos trataba el problema solo como diagnóstico técnico interno (array + consola), sin superficie de error para el docente/director.

## Corrección
`initial-curriculum-guard-v72.js` actualizado a v73.2. Se añadió `showCriticalModuleWarning(src)` y el `onerror` ahora muestra una alerta visible, breve y comprensible que indica no continuar con documentos importantes ni descargar archivos hasta recuperar la protección.

Cambio pequeño y reversible; no modifica backend, IA, currículo, documentos históricos, autenticación ni datos del usuario.

## Retest posterior
- Commit funcional: `cfab2d67f88b0c6ddc39be5ed796d11db9439571`.
- Deployment asociado: `dpl_A2GNTy5Ug8N2JJbR9QqF4aTKz7Xg`.
- Estado Vercel: production / READY.
- `https://docente-digital.vercel.app/`: HTTP 200.
- `https://docente-digital.vercel.app/initial-curriculum-guard-v72.js`: HTTP 200 y sirve v73.2 con `showCriticalModuleWarning()` conectado a `script.onerror`.

**Estado posterior:** PASA a nivel de integración técnica respecto a visibilidad del fallo. No se declara probada físicamente la experiencia de fallo de red en dispositivos reales.

## Riesgo de regresión
Bajo. La alerta solo aparece en `onerror` de los tres módulos declarados críticos. No altera la ruta normal cuando cargan correctamente.

## Impacto en indicadores
- IUD: mejora cualitativa por eliminación de error silencioso visible al usuario; sin puntaje definitivo.
- ICGD: sin cambio cuantificado.
- IFR: reduce riesgo de fallo no comunicado; sin cálculo definitivo.
- ISU: mejora recuperación/comprensión de errores; sin puntaje definitivo por falta de usuarios reales.
- Prelaunch: reduce un riesgo técnico, pero no cierra los bloqueantes V5 existentes.

## Gate V5
DocenteDigital sigue NO APROBADA PARA LANZAMIENTO V1.0. Permanecen pendientes pruebas reales esenciales: Ficha Maestra completa, flujos Docente/Director E2E, Programación, Materiales, Evaluación/Registro, IA semántica real, autenticación/aislamiento, backend, OWASP ASVS, privacidad, backup/restauración real, Word/PDF e impresión físicos, móvil físico, 100 generaciones, año completo, concurrencia, monitoreo/costos IA y pilotos.