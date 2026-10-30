# Docente Digital — Fase 6: cotejo con el PDF oficial de Primaria

**Fecha:** 28 de octubre de 2026  
**Documento de referencia:** PDF aportado por el usuario, «Programa curricular de Educación Primaria» (396 páginas).  
**Alcance exclusivo de esta fase:** Comunicación en lengua materna, Primaria, 1.º a 6.º. **No restringe la plataforma:** siguen existiendo Inicial y Secundaria.

## Hallazgo principal

El archivo recibido corresponde únicamente a Educación Primaria. En él se localizaron las tres competencias del área de Comunicación, sus capacidades, los estándares por ciclo y las tablas de desempeños de los seis grados. Esta fase introduce **referencias precisas de páginas** y mejora la coherencia entre el tipo de actividad, el criterio y las evidencias, sin inventar desempeños ni copiar automáticamente textos completos del PDF.

### Referencias verificadas por página del visor PDF

Las referencias se ubican en la sección 6.4 del programa. En esa sección, la **paginación impresa es dos páginas menor** que el índice de página mostrado por un visor de PDF.

| Competencia | Ciclo III (1.º–2.º) | Ciclo IV (3.º–4.º) | Ciclo V (5.º–6.º) |
| --- | --- | --- | --- |
| Comunicación oral | Estándar PDF 152; desempeños 152–153 | Estándar PDF 154; desempeños 154–155 | Estándar PDF 158; desempeños 158–160 |
| Lectura de textos escritos | Estándar PDF 164; desempeños 164–165 | Estándar PDF 166; desempeños 166–167 | Estándar PDF 168; desempeños 168–169 |
| Escritura de textos | Estándar PDF 174; desempeños 174–175 | Estándar PDF 176; desempeños 176–177 | Estándar PDF 178; desempeños 178–179 |

**Identidad de archivo usado en el cotejo:** SHA-256 `34009689b6e3fe2194ec61c1675af13407528ae5e0f34f4d484007efd9e832f7`. Enlace público de la publicación: [MINEDU — Programa Curricular de Educación Primaria](https://www.gob.pe/institucion/minedu/informes-publicaciones/6790803-programa-curricular-de-educacion-primaria).

## Correcciones de la app

1. Nuevo `primary-communication-source-pages-v6.js`: contiene el mapa comprobado de páginas para las **18 combinaciones de competencia y grado** (3 competencias × 6 grados). No incluye desempeños copiados. Rechaza áreas/niveles que no corresponden.
2. `schedule-prompt-v6.js`: carga el módulo de referencias antes de construir la sesión.
3. `session-teaching-sequence-v3.js`: la sesión de Comunicación muestra grado, ciclo, competencia y páginas oficiales de consulta. El docente debe abrir esas páginas para comprobar el desempeño pertinente antes de emitir la planificación.
4. Ajustes diferenciados de lectura y escritura de 1.º a 6.º basados en la progresión que se aprecia en los cuadros. **Son sugerencias de actividades, no desempeños literales del MINEDU.**
5. Corrección de criterios: las sesiones de lectura, oralidad y escritura ya no reutilizan sin más un único criterio genérico de Comunicación establecido para toda la unidad. El criterio específico de la sesión sirve de base y se sugiere un ajuste por grado.
6. Inicial, Secundaria y todas las demás áreas mantienen la lógica existente. La Fase 6 es una copia independiente de Fase 5.

## Pruebas y limitaciones

- **16/16 pruebas automáticas offline aprobadas.**
- Verificadas 18 referencias de grado/competencia, correspondencia de ciclos y ejemplos 2.º/6.º, 3.º, y los seis grados en multigrado.
- Comprobado que la competencia y la referencia de páginas aparecen en el contenido del archivo Word OOXML; falta abrir documentos en Microsoft Word real.
- Los mapas de páginas se contrastaron con el PDF recibido, pero no existe todavía una selección automática **literal y contextualizada** de cada desempeño específico; el docente sigue debiendo elegirlo y comprobarlo en la fuente.
- No se realizó evaluación pedagógica con docentes ni estudiantes, ni se certifica que cada plan generado esté listo para aplicar sin revisión.

## Próximos pasos recomendados

1. Completar matrices trazables para las demás áreas de Primaria (Matemática, Ciencia y Tecnología, Personal Social, etc.), manteniendo competencias, capacidades, estándares y desempeños diferenciados.
2. Solicitar después los **Programas Curriculares de Educación Inicial y de Educación Secundaria** para verificar sus niveles sin mezclar enfoques o edades.
3. Pilotear una Unidad/Proyecto y una sesión por ciclo con docentes reales; revisar archivos Word en computadora y celular.

**No se modificaron GitHub, Supabase, producción ni versiones anteriores.** Este ZIP es una copia del código fuente, no un instalador `.exe` o `.apk`.
