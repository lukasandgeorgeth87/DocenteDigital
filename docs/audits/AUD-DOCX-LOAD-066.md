# AUD-DOCX-LOAD-066 — Exportador DOCX real fuera del runtime

## Especificaciones aplicadas
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

## Prueba
**ID:** AUD-DOCX-LOAD-066  
**Módulo:** Exportación Word / Unidad / Sesión  
**Entrada:** pulsar “Descargar Word” o “Compartir” desde una unidad o sesión.  
**Esperado:** utilizar el exportador OOXML real disponible en `docx-export-v29.js`, producir `.docx`, conservar contenido estructurado y evitar doble descarga rápida.  
**Obtenido antes:** producción no cargaba `docx-export-v29.js`; por tanto seguían activas las funciones antiguas de `app.js`, que construyen HTML con MIME `application/msword` y descargan extensión `.doc`.  
**Evidencia previa:** `app.js` contiene `wordBlob(...)` y `downloadUnitWord(...)` con `.doc`; `docx-export-v29.js` contiene el reemplazo OOXML `.docx`, pero el HTML de producción no lo cargaba directa ni dinámicamente.  
**Resultado inicial:** NO PASA  
**Severidad:** S1  
**Clasificación:** PARCIALMENTE FUNCIONAL

## Causa raíz
Existía una implementación posterior y más segura (`docx-export-v29.js`), pero no estaba integrada al runtime de producción. La presencia del archivo en el repositorio no demostraba funcionalidad, conforme a V3.

## Corrección aplicada
Se actualizó `initial-curriculum-guard-v72.js` a v72.7 para cargar `docx-export-v29.js` como módulo crítico después de los módulos base y registrar el fallo en `window.ddModuleLoadFailures` si no pudiera incorporarse.

Commit funcional: `3016f999bff3a6ef87c7d5fedcbde390ebf887da`.

## Retest técnico posterior
- Vercel deployment `dpl_BKqL2trhSuhj4gL8puzRQ4s63Efa`: `READY`, target `production`.
- `https://docente-digital.vercel.app/`: HTTP 200.
- `https://docente-digital.vercel.app/initial-curriculum-guard-v72.js`: HTTP 200 y sirve v72.7 con carga de `docx-export-v29.js`.
- `https://docente-digital.vercel.app/docx-export-v29.js`: HTTP 200.

## Estado posterior
**PASA a nivel de integración técnica del exportador real.**

No se declara todavía PASA V5 para exportación profesional: quedan PENDIENTES las pruebas físicas obligatorias en Microsoft Word/LibreOffice móvil y escritorio, PDF, impresión, caracteres quechua, tablas, saltos, imágenes, membretes, encabezados/pies, márgenes y la batería mínima de 20 documentos reales.

## Riesgo de regresión
Medio-bajo. El cambio no altera documentos guardados ni la lógica pedagógica; sustituye en runtime las funciones antiguas de exportación por las ya existentes en el repositorio. Debe mantenerse una prueba automatizada que compruebe que `window.__ddDocxExportV29 === true` y `ddDocxSelfTest()` devuelve `true` antes de publicar.

## Impacto en indicadores/gate
- IFR: mejora técnica parcial, sin puntuación definitiva.
- ISU: potencial mejora por compatibilidad y extensión correcta, sin puntuación definitiva.
- Prelaunch: el bloqueante de exportación NO se cierra hasta pruebas físicas Word/PDF/impresión.
- V5: DocenteDigital sigue NO APROBADA PARA LANZAMIENTO V1.0 mientras existan bloqueantes restantes.