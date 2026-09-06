# AUD-WORD-EXPORT-NOT-DOCX-PDF-207

## Resumen

**Severidad:** S1 CRÍTICO — bloqueante V5  
**Estado:** NO PASA  
**Clasificación:** descarga Word básica = PARCIALMENTE FUNCIONAL; DOCX nativo = INEXISTENTE; PDF = INEXISTENTE / no demostrado  
**Módulo:** Exportación profesional · Unidad/Proyecto · Sesión · V5

## Especificaciones obligatorias aplicadas

Esta prueba se ejecuta conjuntamente contra:

- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

V4 exige `Vista previa → Word / PDF / Imprimir` y V5 exige probar al menos 20 documentos Word reales, PDF e impresión reales; Word/PDF corruptos son bloqueantes.

## ID de prueba

`AUD-WORD-EXPORT-NOT-DOCX-PDF-207`

## Entrada

1. Crear o abrir una Unidad/Proyecto y usar `Descargar Word`.
2. Crear una Sesión y usar `Descargar Word`.
3. Revisar el código de `wordDocument()`, `wordBlob()`, `downloadUnitWord()` y `downloadSessionWord()` en el runtime canónico.
4. Verificar presencia de exportación PDF nativa en la interfaz y en el código ejecutado.
5. Contrastar el mismo `app.js` en producción.

## Resultado esperado

Para una V1.0 aprobable:

- la exportación Word debe producir un documento real y utilizable, idealmente DOCX cuando la auditoría exige DOCX;
- debe existir exportación PDF real o una ruta explícita y probada de impresión/PDF;
- el tipo MIME y la extensión deben corresponder al formato anunciado;
- tablas, márgenes, imágenes, fuentes, encabezados, pies, firmas, orientación, saltos y caracteres quechua deben probarse físicamente en documentos reales;
- la app no debe considerar aprobado el bloque de exportación solo porque el navegador descargue un archivo.

## Resultado obtenido

### Evidencia A — “Word” no es DOCX nativo

`wordDocument()` construye un documento HTML completo como texto:

```js
return `<!doctype html><html ...><body>${body}</body></html>`;
```

`wordBlob()` encapsula ese HTML con:

```js
new Blob([...], { type: 'application/msword;charset=utf-8' })
```

Las descargas usan extensión `.doc`:

```js
cleanFileName(unit.title)+'.doc'
cleanFileName(s.title)+'.doc'
```

Por tanto, el flujo actual no genera un paquete OOXML `.docx`; genera HTML compatible con Word y lo entrega como `.doc`.

Esto puede ser útil como exportación básica editable, pero no satisface una afirmación de DOCX nativo ni permite dar por aprobadas las pruebas V5 de exportación profesional.

### Evidencia B — PDF no existe en el runtime canónico

La interfaz de Unidad/Proyecto y Sesión muestra acciones `Descargar Word` / `Word` y compartir, pero no una acción PDF. En `app.js` no existe una función equivalente de generación PDF dentro del flujo canónico inspeccionado.

Por tanto:

- Word básico: disponible como `.doc` HTML;
- DOCX nativo: no implementado;
- PDF: no implementado/no demostrado en este vertical;
- impresión real y validación física de 20 documentos: pendiente, no simulada.

### Evidencia C — producción sirve exactamente esta implementación

La producción canónica `https://docente-digital.vercel.app/app.js` responde HTTP 200 y contiene las mismas funciones `wordDocument`, `wordBlob`, `downloadUnitWord` y `downloadSessionWord`, con `application/msword` y extensión `.doc`.

La página principal de producción responde HTTP 200 y anuncia `descargar ... en Word`, no PDF.

## PASA / NO PASA

**NO PASA**

## Clasificación funcional

- Descarga de archivo editable que Word puede abrir: **PARCIALMENTE FUNCIONAL**.
- Exportación `.doc` basada en HTML: **FUNCIONAL como mecanismo legado/provisional**, sujeto a prueba física.
- DOCX nativo: **INEXISTENTE**.
- PDF real: **INEXISTENTE / NO DEMOSTRADO**.
- Prueba física de 20 Word, PDF e impresión: **PENDIENTE**; no se simula.
- Cumplimiento V5 Exportación profesional: **ROTO / NO PASA**.

## Severidad

**S1 CRÍTICO** porque V5 trata Word/PDF corruptos como bloqueantes y exige demostrar exportaciones profesionales reales antes del lanzamiento. Aunque aquí no se ha demostrado corrupción de los `.doc`, tampoco existe la evidencia necesaria para aprobar DOCX/PDF y el PDF está ausente.

## Riesgo

1. Diferencias de renderizado entre Microsoft Word, LibreOffice, móviles y visores web.
2. Pérdida o cambio de estilos, tablas, saltos o caracteres al abrir HTML disfrazado como documento Word.
3. Usuarios que esperan DOCX/PDF profesional y reciben un formato legado/provisional.
4. Imposibilidad de aprobar el gate V5 sin pruebas físicas reales.

## Acción correctiva requerida

No sustituir la extensión `.doc` por `.docx`; eso sería incorrecto y podría generar archivos inválidos.

La corrección correcta debe:

1. elegir una librería o servicio confiable que genere DOCX OOXML real;
2. conservar tablas, estilos, márgenes, encabezados/pies, firmas, imágenes y caracteres Unicode/quechua;
3. implementar exportación PDF real o una ruta de impresión/PDF explícita y estable;
4. probar al menos 20 documentos reales de diferentes tipos y complejidades;
5. probar apertura en Word y, cuando sea pertinente, otros visores;
6. mantener el `.doc` HTML únicamente como fallback si se etiqueta honestamente y se prueba;
7. añadir smoke técnico que valide MIME/extensión y pruebas de integración de los generadores.

## Corrección directa

**No aplicada.** Cambiar solo el texto del botón o renombrar `.doc` a `.docx` no resolvería el bloqueante. Implementar un generador DOCX/PDF real excede el criterio de cambio pequeño, seguro y reversible para esta pasada y requiere pruebas físicas que esta auditoría no debe simular.

## Evidencia posterior requerida para cierre

- 20 DOCX reales abiertos y revisados;
- PDFs reales revisados;
- impresión real;
- tablas, imágenes, membretes, márgenes, fuentes, encabezados, pies, firmas, saltos, orientación y caracteres quechua;
- verificación de apertura en celular económico y laptop;
- evidencia de que la producción sirve el generador aprobado.

## Estado de lanzamiento

DocenteDigital **NO está aprobada para lanzamiento V1.0** mientras este bloqueante y los demás S0/S1 permanezcan abiertos o falten las pruebas reales esenciales de V5.
