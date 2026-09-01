# AUD-DOCX-DOUBLE-039 — doble clic en exportación DOCX

## Especificaciones aplicadas
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

## Prueba
**ID:** AUD-DOCX-DOUBLE-039  
**Módulo:** Exportación / compartir DOCX  
**Entrada:** doble clic rápido sobre Descargar Word o Compartir el mismo documento.  
**Esperado:** una sola acción efectiva; V5 exige probar doble clic rápido en descargar/crear/guardar para impedir duplicados.  
**Obtenido antes:** `downloadDocx()` creaba y pulsaba un nuevo `<a>` en cada invocación y `shareDocx()` no bloqueaba invocaciones concurrentes. Dos pulsaciones podían iniciar dos descargas o dos intentos de compartir.  
**Evidencia previa:** `docx-export-v29.js` antes de `581c7454fecce8c989a7f4d0fce4df7d1213ec7f`.  
**Resultado inicial:** NO PASA.  
**Severidad:** S3 (UX / duplicación accidental; no se observó corrupción documental).  
**Clasificación inicial:** PARCIALMENTE FUNCIONAL.

## Causa raíz
La ruta de exportación no tenía idempotencia temporal ni estado de operación en curso.

## Corrección
Commit `581c7454fecce8c989a7f4d0fce4df7d1213ec7f`:
- ventana de 1200 ms para ignorar una segunda descarga del mismo nombre;
- `shareInFlight` para impedir compartir dos veces mientras la operación nativa sigue abierta;
- mantiene el fallback de descarga si Web Share no está disponible o falla;
- conserva la corrección anterior que respeta `AbortError` al cancelar el selector nativo.

## Retest técnico
- GitHub/Vercel check del commit: `success`.
- Deployment de producción: `dpl_CLGK3QTocZfWHVXAfoo4MUmeR7QZ` — `READY`.
- `https://docente-digital.vercel.app/` — HTTP 200.
- `https://docente-digital.vercel.app/docx-export-v29.js` — HTTP 200 y contiene `DUPLICATE_WINDOW_MS=1200` y `shareInFlight`.

**Resultado posterior de la defensa:** PASA técnicamente.  
**Clasificación posterior del módulo:** PARCIALMENTE FUNCIONAL hasta prueba física Android/iOS y apertura de DOCX real.

## Evidencia pendiente que no se simula
- doble toque físico en Android/iOS;
- apertura del DOCX en Word/Google Docs/LibreOffice;
- impresión física;
- verificación visual de tablas, saltos, caracteres quechua y márgenes.

## Riesgo de regresión
Bajo. La protección solo ignora una segunda acción idéntica dentro de 1,2 s y bloquea compartir mientras la operación nativa está pendiente. Una nueva descarga posterior sigue permitida.

## Impacto en gates
- V4: reduce acciones accidentales y comportamiento confuso.
- V5: cubre parcialmente la prueba obligatoria de doble clic en descarga, pero la evidencia física sigue PENDIENTE.
- ISU/IFR/Prelaunch: sin puntuación definitiva; no se altera ningún gate pendiente.

## Estado de lanzamiento
NO APROBADA PARA LANZAMIENTO. Persisten bloqueantes V5: backend/autenticación/aislamiento, seguridad OWASP ASVS, backup-restauración real, IA semántica real, pruebas Word/PDF/impresión físicas, móvil físico, 100 generaciones, año completo, concurrencia y pilotos.