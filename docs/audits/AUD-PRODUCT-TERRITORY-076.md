# AUD-PRODUCT-TERRITORY-076

## Alcance
Unidad/Proyecto — producto preliminar y territorialidad.

## Especificaciones aplicadas
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

## Prueba
**ID:** AUD-PRODUCT-TERRITORY-076  
**Entrada:** descripción de una unidad sobre siembra sin mencionar Ccotataqui.  
**Resultado esperado:** el producto no debe introducir una localidad que el usuario no proporcionó.  
**Resultado obtenido antes:** `enhancements.js::ddProduct()` devolvía `Gran Libro de la Siembra de Ccotataqui...` para cualquier entrada que coincidiera con el patrón de siembra/papa/tarpuy/añu/oca/olluco.  
**Evidencia:** código fuente de `enhancements.js` en `main`, función `ddProduct()`.  
**Estado inicial:** NO PASA.  
**Severidad:** S2 ALTO.  
**Clasificación:** PARCIALMENTE FUNCIONAL con error silencioso de territorialidad.

## Causa raíz
Banco léxico/plantilla creado para un contexto piloto concreto y reutilizado como salida general. El Núcleo IA exige conservar el territorio real y no asumir contexto no proporcionado.

## Corrección segura aplicada
`initial-curriculum-guard-v72.js` actualizado a v73.3. Se envuelve `createUnitDemo()` después de cargar los módulos de la página. Si el usuario no escribió Ccotataqui y el producto preliminar heredado contiene ese topónimo, se elimina antes de conservar/renderizar la propuesta. Si el usuario sí escribió Ccotataqui/Cotataqui, no se modifica.

El cambio es pequeño, reversible y no modifica documentos históricos ya emitidos. No sustituye la IA semántica real ni convierte la lógica léxica actual en comprensión semántica.

## Retest posterior
- Commit funcional: `1d4af1a07b9fed3b5d97d36d5019a3bf27e39d87`.
- Deployment Vercel asociado: `dpl_FybVHXdvB6tj9L2XAZYEeCTKFPka`.
- Estado Vercel: `READY`, target `production`.
- `https://docente-digital.vercel.app/`: HTTP 200.
- `https://docente-digital.vercel.app/initial-curriculum-guard-v72.js`: HTTP 200 y sirve v73.3 con `preventHardcodedCcotataquiProduct()`.

**Estado posterior:** PASA a nivel de integración técnica para el topónimo Ccotataqui introducido por el producto preliminar.

## Pendientes / límites
No se declara resuelta la territorialidad global. `enhancements.js` todavía contiene formulaciones genéricas de “nuestra comunidad” en reto, propósito, enfoques y criterios; resolverlo correctamente requiere una capa semántica/contextual más amplia y pruebas de regresión rural/urbano/periurbano/EIB/monolingüe. Tampoco se simula prueba física en dispositivo ni usuario real.

## Riesgo de regresión
Medio. La corrección depende de que `createUnitDemo()` siga siendo una función global y de que la unidad activa se encuentre en `state.units`. Debe incorporarse como test automatizado cuando exista suite estable.

## Impacto en indicadores
- IUD: mejora cualitativa de exactitud del dato territorial.
- ICGD/IFR/ISU/Prelaunch: sin puntuación definitiva; falta evidencia suficiente y continúan bloqueantes V5.

## Gate V5
DocenteDigital continúa **NO APROBADA PARA LANZAMIENTO V1.0**. Permanecen pendientes, entre otros, IA semántica real, Ficha Maestra completa, Programación, Materiales, Evaluación/Registro, Director E2E, autenticación/aislamiento/backend, OWASP ASVS, backup/restauración real, Word/PDF/impresión físicos, móvil físico, 100 generaciones, año completo, concurrencia y pilotos reales.
