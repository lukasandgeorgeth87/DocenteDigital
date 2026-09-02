# AUD-TERRITORY-HARDCODE-075

## Módulo
Unidad / Proyecto — títulos naturales, territorialidad y contexto.

## Especificaciones aplicadas
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

## Prueba
**ID:** AUD-TERRITORY-HARDCODE-075

**Entrada:** descripción de una unidad/proyecto sobre siembra o residuos sin mencionar Ccotataqui, por ejemplo: `En una escuela urbana queremos investigar cómo reducir los residuos del patio`.

**Resultado esperado:** los títulos no deben introducir una localidad que el usuario no escribió. Si el territorio no está confirmado, usar una formulación neutral. Si el usuario menciona explícitamente Ccotataqui, puede conservarse ese término.

**Resultado obtenido antes:** `format-v2.js` incluía títulos predeterminados con `Ccotataqui` para ramas de siembra y residuos, aun cuando el texto de entrada no contenía esa localidad.

**Evidencia antes:** `titleOptions()` contenía, entre otros, `Hatun Tarpuy de Ccotataqui`, `...en Ccotataqui` y `Ccotataqui limpio` como textos cerrados.

**Estado antes:** NO PASA.

**Clasificación:** PARCIALMENTE FUNCIONAL con error silencioso de territorialidad.

**Severidad:** S2 — puede introducir un dato territorial falso en una propuesta pedagógica y contaminar documentos de otra IE, aunque no produce pérdida de datos ni constituye por sí solo una fuga de información.

## Causa raíz
Los bancos de títulos se diseñaron desde un contexto piloto específico y esa localidad quedó codificada como parte fija de varias opciones. El Núcleo IA exige conservar términos locales cuando existen, pero no inventar territorio ni asumir `comunidad`/localidad cuando no fue aportada.

## Corrección aplicada
`format-v2.js` pasa a v2.3:
- detecta `Ccotataqui/Cotataqui` únicamente cuando aparece explícitamente en la descripción;
- usa `nuestro entorno` cuando esa localidad no fue indicada;
- elimina Ccotataqui fijo de títulos de siembra/residuos;
- neutraliza el ejemplo del acceso rápido para no sesgar la entrada hacia una IE concreta.

**Commit funcional:** `f9817f5e8eedb554ee928a769bf1cd689fbfcab4`.

## Evidencia posterior
- GitHub sirve `format-v2.js` v2.3 con `explicitlyCcotataqui` y `placeName` condicionado a la entrada.
- Deployment Vercel asociado al commit funcional: `dpl_6QFi7BLVnYrNFK1RxfuvkpqkpiXS`, `production`, `READY`.
- Producción `/`: HTTP 200.
- Producción `/format-v2.js`: HTTP 200 y contiene v2.3.

## Retest lógico puntual
- Entrada sin `Ccotataqui/Cotataqui` → `placeName = nuestro entorno` → no se inserta Ccotataqui en los títulos corregidos.
- Entrada que contiene `Ccotataqui` o `Cotataqui` → `placeName = Ccotataqui` → se conserva el lugar de forma explícitamente sustentada por el usuario.

Este retest es de integración/código y producción. No equivale a una prueba con usuario real ni valida comprensión semántica IA general.

## Riesgo de regresión
Bajo. La modificación afecta únicamente textos propuestos en `titleOptions()` y el placeholder del acceso rápido; no cambia persistencia, históricos, currículo, seguridad, backend ni exportación.

## Impacto en indicadores
- **IUD/ICGD/IFR/ISU/Prelaunch:** mejora cualitativa en confianza documental, pertinencia contextual y simplicidad, pero no se calcula ni modifica una puntuación definitiva sin batería trazable y usuarios reales.
- No cierra el bloqueante de comprensión semántica real.

## Bloqueantes V5 que permanecen
Continúan pendientes, entre otros: comprensión semántica con IA real y pruebas de finalidad X→Y/biohuerto/hormigas; Ficha Maestra completa; Programación; Materiales; Evaluación/Registro; Director E2E; autenticación/aislamiento/backend; OWASP ASVS; privacidad; backup/restauración real; Word/PDF/impresión físicos; móvil físico; 100 generaciones; año completo; concurrencia; monitoreo/costo IA y pilotos reales.

**DocenteDigital no queda aprobada para lanzamiento V1.0 por esta corrección.**