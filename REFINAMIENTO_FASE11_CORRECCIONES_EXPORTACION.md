# Docente Digital — Fase 11: correcciones a partir de un Word real

**Fecha:** 30/10/2026. **Base:** refinamiento fase 10. **Alcance:** revisión de la exportación Word y vista de la secuencia de Primaria; no se ha desplegado a Vercel ni publicado en GitHub.

## Hallazgos observados en el DOCX facilitado por el usuario

- Documento de 31 páginas para una unidad de tres semanas; varias páginas mostraban solo pequeñas porciones de una tabla de sesiones.
- Situación significativa envuelta en una frase automática poco natural («Un hecho relacionado con...»).
- Los criterios se expandían con la narración completa; la columna «desempeño precisado» no mostraba información verificable.
- La programación incluía materias ajenas a las cuatro mencionadas inicialmente. Las opciones del perfil y las áreas realmente escogidas deben verificarse antes de crear la unidad.
- Cabeceras institucionales por completar. Un documento no debe inventar identidad o dirección.
- La verificación de coherencia estructural no garantiza pertinencia curricular.

## Cambios incluidos

1. **`unit-export-quality-v11.js`:** nuevo generador compacto de Word para **Primaria**; respeta la situación escrita cuando hay una plantilla envolvente incorrecta; conserva reto, título, producto y selección de grados; propone criterios cortos y diferenciados por grado según área/título de actividad; organiza las sesiones por semana con cuatro columnas (día/horario, área/sesión, acción por grado, evidencia); indica horarios no registrados y detecta repeticiones de título frecuentes. También actualiza la vista de «Sesiones» de Primaria usando ese esquema compacto.
2. **`docx-export-v29.js`:** `w:tblGrid` explícito, anchuras preferentes según `data-col-weights`, filas no divididas, cabeceras repetibles y saltos de línea en celdas, buscando mejorar compatibilidad de Word y evitar distorsiones de tablas. No habilita GPT ni modifica autenticación.
3. **`proposal-choice-v8.js`:** cuando el docente especifica un producto final por escrito, se precarga en la opción editable para no obligarlo a repetirlo. No se sustituye ni publica sin confirmación.
4. **`planning-chain-integrity-v10.js`:** alertas adicionales para criterios excesivos, sesiones repetidas y horarios sin confirmar (es un aviso, no una validación pedagógica).
5. **`planning-structure-v1.js`:** la pestaña Ruta incluye una lectura resumida de las actividades semanales reales junto al esquema teórico general.
6. **`enhancements.js` / `app.js`:** ajustes de criterios abreviados y preservación de la situación redactada por el docente cuando corresponda; datos institucionales desconocidos quedan «Por completar».
7. **`tests/unit-export-quality-phase11.mjs`:** prueba nueva de generación de HTML, 1.º/3.º/5.º, semanas, conservación de datos y aislamiento de Secundaria.

## Pruebas ejecutadas

- **21 de 21** pruebas offline aprobadas (incluyen continuidad, tres niveles, currículo de Primaria por áreas, exportación y nueva regresión de fase 11). Archivo de resultados: `tests/` y registro de ejecución local (no se incluye log en ZIP para evitar artefactos). 
- **DOCX nativo de prueba** creado por el exportador JavaScript, abierto con `python-docx`, comprobada estructura de **6 tablas** y columnas correctas **[4,3,4,4,4,3]**. Renderizado con LibreOffice a imágenes, inspeccionados páginas 1–3.
- **Estrés de 45 sesiones ficticias**, distribuido en tres semanas, exportado y renderizado en **9 páginas**. Este resultado NO es una comparación directa porque el documento original y el caso sintético difieren en contenido.
- **Prueba automática de la aplicación completa en navegador no realizada:** este entorno bloqueó las rutas `http://127.0.0.1` y `file://`. Se necesita una vista previa actualizada en Vercel y revisión del usuario en Chrome y Microsoft Word.

## Limitaciones expresas

- Los criterios por grado son **propuestas editables**, NO transcripciones oficiales de desempeños MINEDU ni garantía de alineación por cada actividad. Requieren selección y verificación curricular.
- La programación de las sesiones heredadas se conserva; la fase 11 **no rehace automáticamente** el plan de tres semanas ni cambia áreas del perfil. Si hay áreas no deseadas, debe revisarse su selección antes de volver a generar; NO eliminar asignaturas históricas en silencio.
- Los documentos históricos permanecen intactos hasta que se descargue o visualice su nueva versión con el código actualizado.
- No se modificó `main`, ni Supabase, ni la versión de Vercel que usa el usuario. Estas mejoras son **un ZIP local pendiente de integración en una rama de pruebas**.

## Próximo control recomendado

Abrir la fase 11 en una nueva *preview* de Vercel, acceder con el mismo perfil de demostración, volver a abrir la unidad existente, descargar el Word y comprobar: criterios cortos, horario, cuatro columnas de la secuencia, ausencia de párrafos repetidos y áreas seleccionadas. Cotejar con el PDF del Programa Curricular del MINEDU y revisar la impresión en Microsoft Word.
