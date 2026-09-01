# AUD-MOV-DIRECTOR-064 — Espacio Director inaccesible desde navegación móvil

## Especificaciones aplicadas
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

## Prueba
**ID:** AUD-MOV-DIRECTOR-064  
**Módulo:** navegación móvil / Carpeta Director  
**Entrada:** abrir DocenteDigital en viewport <= 850 px y buscar acceso al espacio Director.  
**Resultado esperado:** al ocultarse la barra lateral de escritorio, la navegación móvil debe conservar una ruta visible hacia la Carpeta Director.  
**Resultado obtenido antes:** `styles.css` oculta `.sidebar` en `max-width:850px`, mientras `index.html` definía una `.mobile-nav` con Inicio, Plan, Sesión, Materiales y Evaluación, sin Director. Por tanto el espacio Director quedaba sin ruta de navegación visible en móvil.  
**Estado inicial:** NO PASA.  
**Clasificación:** ROTA en móvil para acceso Director.  
**Severidad:** S1, porque V5 considera bloqueante que una función principal sea inutilizable en celular y el flujo Director es parte esencial de V1.0.

## Causa raíz
La navegación responsive sustituyó completamente la barra lateral por una barra móvil incompleta, sin conservar el acceso al rol/espacio Director.

## Corrección
Cambio pequeño y reversible en `initial-curriculum-guard-v72.js` (v72.6):
- añade el botón `🏫 Director` a `.mobile-nav` si no existe;
- reutiliza `go('director')`, sin introducir lógica paralela;
- adapta la grilla de navegación a seis columnas;
- no habilita las funciones Director aún inexistentes: siguen marcadas como `Próximamente` por la guardia existente.

**Commit funcional:** `152f7449ccddeebdb02cedc4a618e2e7b4b6f44b`.

## Evidencia posterior
- Vercel deployment `dpl_71bYRKnEw5K57Y2Ku9gjT2ysjGK1`: `READY`, target `production`.
- `https://docente-digital.vercel.app/`: HTTP 200.
- `https://docente-digital.vercel.app/initial-curriculum-guard-v72.js`: HTTP 200 y sirve v72.6 con `ensureDirectorMobileAccess()`.

## Retest
**Resultado posterior:** PASA técnicamente para recuperar la ruta de navegación móvil hacia Director.  
No equivale a prueba física en celular ni convierte el flujo Director en funcional de extremo a extremo.

## Riesgo de regresión
Bajo. La corrección no modifica estado ni documentos y solo añade un acceso a una pantalla ya existente. Debe probarse físicamente el tamaño táctil y legibilidad de seis accesos en celulares económicos antes de aprobar V5 móvil.

## Impacto en indicadores
- **ISU:** mejora parcial de encontrabilidad móvil; no calcular puntaje definitivo sin usuarios reales.
- **IUD/ICGD/IFR:** sin cambio cuantificable demostrado.
- **Prelaunch:** elimina el defecto puntual de navegación, pero el gate móvil permanece pendiente hasta pruebas físicas reales y el flujo Director E2E sigue incompleto.

## Bloqueantes V5 que permanecen
Ficha Maestra completa, Director E2E real, autenticación/aislamiento, backend productivo, OWASP ASVS, privacidad, backup/restauración real, IA semántica real, Word/PDF e impresión física, dispositivos físicos, 100 generaciones, año completo, concurrencia productiva, continuidad sin IA, monitoreo/costo IA y pilotos reales.
