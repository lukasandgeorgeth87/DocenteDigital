# AUD-DIR-A11Y-DISABLED-112

## Módulo
Carpeta Director / UX / accesibilidad / honestidad funcional.

## Especificaciones aplicadas
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

## Prueba
**ID:** AUD-DIR-A11Y-DISABLED-112

**Entrada:** abrir `Espacio del Director` y recorrer la interfaz mediante teclado/tecnología asistiva cuando `Continuar`, `Crear`, `Abrir` y `Preguntar` todavía no poseen implementación funcional.

**Resultado esperado:** las funciones no implementadas no deben presentarse como controles utilizables ni permanecer en el árbol de interacción; la interfaz debe comunicar de forma simple y honesta que siguen en desarrollo.

**Resultado obtenido antes:** los cuatro elementos seguían siendo `<button>` normales en `index.html`. El CSS únicamente aplicaba `pointer-events:none`, opacidad y cursor visual de bloqueo. Esto impedía clic de ratón/tacto pero no era una deshabilitación semántica robusta.

**Estado inicial:** NO PASA.

**Severidad:** S3 MEDIO.

**Clasificación inicial:** PARCIALMENTE FUNCIONAL.

## Causa raíz
La corrección previa AUD-DIR-UI-110 solucionó la interacción con puntero y añadió la señal visual `En desarrollo`, pero trató indisponibilidad funcional como un estado visual CSS. Los botones inexistentes permanecieron en el HTML como controles reales.

## Corrección aplicada
Cambio pequeño y reversible en `styles.css`:

```css
#director .card .btn{display:none}
```

Se conservan las tarjetas y su distintivo `En desarrollo`, pero desaparecen de la superficie y del árbol renderizado los controles que no ejecutan una función real.

**Commit funcional:** `f2438728dc5aef23194a054ff52587a6d308e518`.

## Evidencia posterior
- GitHub Actions `Prelaunch Smoke` run `33700131202`: `success`.
- Vercel deployment `dpl_6pTuns8W6Lmuhu93uarwofPXwN3x`: `READY`, target `production`, commit `f2438728dc5aef23194a054ff52587a6d308e518`.
- `https://docente-digital.vercel.app/`: HTTP 200.
- `https://docente-digital.vercel.app/styles.css`: HTTP 200 y sirve `#director .card .btn{display:none}`.

## Resultado posterior
**PASA técnicamente respecto de controles inexistentes en la superficie.**

**Clasificación posterior:** FUNCIONAL únicamente para honestidad/interacción de esta superficie. La Carpeta Director continúa sin considerarse funcional de extremo a extremo.

## Límites de evidencia
No se simula ni declara realizada prueba física con lector de pantalla, teclado externo, Android/iOS, tablet ni usuarios reales. Esas verificaciones permanecen PENDIENTES V5.

## Riesgo de regresión
Bajo. Cuando una función Director se implemente realmente, su botón deberá dejar de quedar cubierto por esta regla y entonces deberá probarse su semántica accesible, foco, acción real, persistencia y trazabilidad.

## Impacto en indicadores
No se recalculan IUD, ICGD, IFR, ISU ni Prelaunch Score. El cambio elimina una inconsistencia UX/accesibilidad puntual, pero no aporta evidencia suficiente para incrementar puntuaciones definitivas.

## Gate V5
DocenteDigital continúa NO APROBADA PARA V1.0 mientras sigan pendientes las pruebas y funciones esenciales ya registradas: E2E Docente y Director, backend/autenticación/aislamiento, IA semántica real, Word/PDF/impresión físicos, móvil real, OWASP ASVS, privacidad integral, backup/restauración real, prueba de 100 generaciones, año escolar completo, concurrencia, monitoreo/costos IA y pilotos reales.

## Normativa
Esta corrección es exclusivamente técnica/UX. No se aplicó ni declaró vigente una nueva norma MINEDU, por lo que no corresponde atribuir vigencia normativa externa en esta prueba.