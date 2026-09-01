# AUD-DOCX-SHARE-038 — Compartir DOCX / control del usuario móvil

- **Módulo:** DOCX / compartir en móvil / UX / V4-V5
- **Entrada:** En un dispositivo compatible con Web Share API, pulsar “Compartir” una unidad o sesión y cancelar el selector nativo de compartir.
- **Esperado:** Cancelar debe terminar la acción sin provocar otra operación. No debe descargarse automáticamente un archivo que el usuario decidió no compartir.
- **Obtenido antes:** `shareDocx()` capturaba cualquier excepción de `navigator.share()`, incluida `AbortError`, y después ejecutaba `downloadDocx(blob,name)`. Al cancelar el diálogo nativo podía iniciarse una descarga inesperada.
- **Estado inicial:** **NO PASA — S3 — PARCIALMENTE FUNCIONAL**.
- **Causa raíz:** La ruta de fallback no distinguía entre una falla real/ausencia de Web Share y una cancelación explícita del usuario.
- **Corrección:** `docx-export-v29.js` ahora trata `AbortError` como cancelación deliberada y retorna sin descargar. Para errores reales o navegadores sin Web Share, conserva el fallback a descarga DOCX.
- **Commit funcional:** `f672df5757077500f8ffe8610fddcfffbc20ffee`.
- **Evidencia posterior:** GitHub `Vercel: success`; deployment `dpl_AzogkMjyMR5GWLwSqF3pfTZLhFXB` en `production`, estado `READY`; `https://docente-digital.vercel.app/` responde HTTP 200; `https://docente-digital.vercel.app/docx-export-v29.js` responde HTTP 200 y contiene `if(e?.name==='AbortError') return;`.
- **Estado posterior:** **PASA la defensa técnica — PARCIALMENTE FUNCIONAL**.
- **Riesgo / gate V5:** La corrección respeta control del usuario y evita una segunda acción no solicitada. Sigue PENDIENTE prueba física en Android/iOS con Web Share real, apertura del DOCX en Word/LibreOffice/Google Docs, impresión, caracteres de lengua originaria y matriz de compatibilidad móvil. No constituye certificación de exportación DOCX.
