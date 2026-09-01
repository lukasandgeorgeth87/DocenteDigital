# AUD-DOCX-CDN-056 — Dependencia externa en importación de horario DOCX

## Alcance
Auditoría V2/V3/V4/V5 + Núcleo IA sobre la importación de horario docente desde Word.

## Prueba
- **ID:** AUD-DOCX-CDN-056
- **Módulo:** Mi planificación → Horario de clases → Subir horario Word (.docx)
- **Entrada:** seleccionar un archivo `.docx` cuando `window.mammoth` todavía no está cargado.
- **Esperado:** el importador debe disponer de su dependencia de lectura DOCX de forma controlada, verificable y resistente a fallos; una indisponibilidad externa no debe producir un error silencioso ni introducir una dependencia de código remoto no controlada en una función importante.
- **Obtenido:** `schedule-v3.js` carga en tiempo de ejecución `https://unpkg.com/mammoth@1.8.0/mammoth.browser.min.js` mediante un `<script>` creado en el navegador. La versión está fijada, pero el código se ejecuta desde un CDN de terceros y no se observa `integrity`/SRI ni copia local/versionada dentro del repositorio.
- **Evidencia:** función `loadMammoth()` de `schedule-v3.js`; producción sirve el mismo código en `https://docente-digital.vercel.app/schedule-v3.js`.
- **Resultado:** NO PASA como requisito de robustez/prelanzamiento; la función base de horario sigue siendo PARCIALMENTE FUNCIONAL hasta resolver esta dependencia y realizar pruebas físicas de DOCX.
- **Severidad:** S2 (ALTO).
- **Clasificación:** PARCIALMENTE FUNCIONAL.

## Causa raíz
Dependencia de conversión DOCX resuelta mediante carga dinámica desde un CDN de terceros en el cliente, sin empaquetado/localización de la librería ni verificación de integridad observable en el código actual.

## Acción correctiva recomendada
1. Preferir una copia versionada y auditada de Mammoth dentro del build/repositorio o gestionarla mediante el sistema de dependencias del proyecto.
2. Si se mantiene un CDN, evaluar SRI + `crossorigin` y una política CSP compatible, verificando previamente que no rompa producción.
3. Mantener un mensaje de fallo comprensible y permitir continuar mediante edición manual del horario.
4. Probar físicamente `.docx` reales con tablas simples, combinadas, celdas fusionadas, caracteres quechua y archivos dañados.

## Corrección aplicada en esta ejecución
No se modificó código funcional. Cambiar la estrategia de suministro de una dependencia ejecutable de terceros afecta seguridad, empaquetado y compatibilidad; no es una corrección pequeña que deba aplicarse sin una prueba específica del artefacto resultante.

## Evidencia posterior disponible
- La raíz de producción responde HTTP 200.
- `schedule-v3.js` responde HTTP 200 y conserva la carga dinámica indicada.
- El deployment de producción vigente previo a este informe estaba en estado READY.

## Bloqueantes V5 relacionados
Siguen pendientes las pruebas físicas de Word/PDF, seguridad formal (incluido OWASP ASVS), continuidad frente a fallos externos y pruebas en dispositivos reales.

## Impacto en indicadores
- **IUD/ICGD:** sin cambio cuantificado.
- **IFR:** riesgo pendiente en robustez de importación DOCX.
- **ISU:** no se asigna puntuación definitiva sin usuarios reales.
- **Prelaunch:** permanece PENDIENTE; este hallazgo no puede ocultarse mediante una puntuación global.

## Riesgo de regresión
Nulo en esta ejecución porque solo se añadió documentación de auditoría.
