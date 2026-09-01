# AUD-CURR-LOAD-061 — Guardia crítica curricular no incluida en la cadena de producción

## Especificaciones aplicadas

- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

## Prueba

**ID:** AUD-CURR-LOAD-061  
**Módulo:** seguridad curricular / arranque / producción  
**Clasificación inicial:** ROTA para la protección curricular esperada  
**Severidad inicial:** S1

### Entrada

Abrir la aplicación y generar/visualizar una Unidad/Proyecto cuando aún no existe una matriz curricular oficial literal, versionada y verificablemente conectada.

### Resultado esperado

La guardia `curriculum-safety-v27.js` (lógica interna v30) debe ejecutarse realmente en producción, mantener `curriculumMatrixReady=false`, advertir que las referencias curriculares requieren verificación y evitar presentar contenido generado como currículo oficial.

### Resultado obtenido antes de corregir

`curriculum-safety-v27.js` existía en el repositorio y había sido corregido previamente, pero `index.html` no lo incluía en su cadena de scripts. Por ello su existencia en GitHub no demostraba ejecución en producción. La protección podía quedar fuera del runtime mientras `enhancements.js` seguía generando referencias curriculares.

### Evidencia

- `index.html` cargaba `storage-recovery-v26.js`, `storage-access-guard-v71.js`, `app.js`, `initial-curriculum-guard-v72.js`, `enhancements.js`, `format-v2.js`, `schedule-v3.js`, `strategies-v4.js`, `resources-v5.js` y `schedule-prompt-v6.js`, pero no `curriculum-safety-v27.js`.
- `curriculum-safety-v27.js` contiene la política v30 que mantiene cerrado el modo curricular oficial hasta disponer de matriz oficial verificable.
- V3 exige funcionalidad demostrable y V5 mantiene la exactitud curricular como gate de lanzamiento.

## Causa raíz

Corrección implementada como archivo independiente sin integración efectiva en la ruta de carga del runtime.

## Acción correctiva

Se actualizó `initial-curriculum-guard-v72.js` a v72.4 para cargar de forma same-origin y controlada `curriculum-safety-v27.js` después de `DOMContentLoaded`, momento en que `enhancements.js` y `format-v2.js` ya han definido las funciones que la guardia necesita envolver. Se evita carga duplicada y se registra un fallo explícito en `window.ddModuleLoadFailures` si el recurso no puede cargarse.

**Commit funcional:** `c204eaafc1fe68c069a864add64c9e7106f4bd39`.

## Retest posterior

- Estado Vercel del commit funcional: `success`.
- La inspección estática confirma que v72.4 contiene la carga de `curriculum-safety-v27.js` y que la guardia v30 sigue forzando `curriculumMatrixReady=false`.
- La comprobación HTTP independiente de `https://docente-digital.vercel.app/` y de ambos assets no pudo completarse en esta ejecución por un fallo temporal de resolución DNS del entorno de auditoría. Por tanto, **HTTP 200 queda PENDIENTE** y no se simula.

## Estado posterior

**PASA parcialmente para integración de runtime; HTTP 200 PENDIENTE por limitación transitoria del entorno.**

La matriz curricular global continúa **PARCIALMENTE FUNCIONAL** y DocenteDigital sigue **NO APROBADA PARA LANZAMIENTO V1.0** mientras permanezcan bloqueantes V5 y pruebas reales esenciales pendientes.

## Riesgo de regresión

Bajo-medio. El cambio añade únicamente una carga same-origin posterior al arranque y contiene protección contra carga duplicada. Debe retestearse en navegador real cuando sea posible.

## Impacto en indicadores

- IUD: no calculado de forma definitiva.
- ICGD: mejora cualitativa de protección curricular, sin puntaje definitivo.
- IFR: no recalculado; falta prueba HTTP/runtime física.
- ISU: sin cambio medible.
- Prelaunch: sigue BLOQUEADO por V5.