# AUD-DIRECTOR-INERT-CONTROLS-110

- **Módulo:** Carpeta Director / superficie UX
- **Especificaciones:** V2 + V3 + V4 + V5 + Núcleo IA
- **Estado inicial:** NO PASA
- **Clasificación inicial:** PARCIALMENTE FUNCIONAL
- **Severidad:** S2 ALTO

## Prueba

**ID:** AUD-DIR-UI-110

**Entrada:** Abrir `Espacio del Director` y activar `Continuar`, `Crear`, `Abrir` o `Preguntar`.

**Resultado esperado:** Una función disponible debe ejecutar una acción real y verificable. Si todavía no existe, la interfaz debe comunicar claramente que está en desarrollo y no presentar un control aparentemente operativo.

**Resultado obtenido antes de corregir:** Los cuatro botones aparecían como controles activos, pero no tenían `onclick` ni otra acción asociada en `index.html`; tampoco se encontró una conexión posterior que los convirtiera en funciones reales. El clic no producía resultado ni mensaje, generando un error silencioso de UX y una apariencia de funcionalidad no demostrada.

**Evidencia previa:** `index.html`, sección `#director`.

## Causa raíz

La superficie Director fue incorporada como prototipo visual antes de implementar sus flujos. A diferencia del chat de corrección IA, que sí estaba marcado como `Próximamente`, los controles Director no comunicaban su estado real.

## Corrección

Cambio pequeño y reversible en `styles.css`:

- las tarjetas de Director muestran `En desarrollo`;
- los botones se presentan visualmente deshabilitados;
- se bloquea interacción mediante `pointer-events:none` y cursor `not-allowed`.

Commit funcional: `a20a32e3055476eabc135c2cd18b97ef23eb67d1`.

## Evidencia posterior

- GitHub Actions `Prelaunch Smoke` run `33692622054`: `success`.
- Vercel deployment `dpl_HYnK9Xp697UTTWdqx4YX2mfLD2Fn`: `READY`, target `production`.
- `https://docente-digital.vercel.app/styles.css`: HTTP 200 y contiene la regla `#director .card::after{content:'En desarrollo'...}` y el bloqueo de los botones.
- `https://docente-digital.vercel.app/`: HTTP 200.

## Resultado posterior

**PASA** respecto de honestidad de la superficie: una función no implementada ya no aparenta estar disponible.

Esto **NO** convierte la Carpeta Director en funcional. Sus flujos V5 continúan **INEXISTENTES/PENDIENTES** hasta implementar y probar extremo a extremo Perfil IE → Diagnóstico → Gestión → PAT → Documentación → Evidencias → Informes → Archivo → Seguimiento.

## Fuente oficial

No se aplicó ni declaró vigente una norma MINEDU nueva en esta corrección. Es un hallazgo técnico/UX derivado de las especificaciones internas V3/V4/V5.

## Riesgo de regresión

Bajo. La regla CSS está limitada a `#director .card .btn` y no afecta controles Docente.

## Impacto en indicadores

No se recalculan IUD, ICGD, IFR, ISU ni Prelaunch Score. El cambio reduce error silencioso y evita evidencia engañosa, pero no demuestra funcionalidad Director ni sustituye pruebas con usuarios reales.
