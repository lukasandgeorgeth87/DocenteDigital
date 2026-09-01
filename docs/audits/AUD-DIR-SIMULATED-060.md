# AUD-DIR-SIMULATED-060

## Alcance
Carpeta Director / UX / funcionalidad real / gate V5.

## Especificaciones aplicadas
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

## Prueba
**ID:** AUD-DIR-SIMULATED-060

**Entrada:** abrir `Espacio del Director` y accionar `Continuar pendiente`, `Crear documento`, `DG y Planes` o `Asistente del Director`.

**Esperado:** cada control principal debe ejecutar un flujo real o, si todavía no existe, presentarse inequívocamente como no disponible. V3 no permite aprobar una función porque aparezca en pantalla; V4 exige controles claros y V5 exige el flujo Director extremo a extremo antes del lanzamiento.

**Obtenido antes:** los cuatro botones estaban visualmente habilitados, pero no tenían `onclick`, `formaction` ni otro comportamiento asociado en el HTML base. Eran controles sin acción que podían hacer creer al usuario que la función existía.

**Evidencia previa:** `index.html`, sección `#director`.

**Resultado previo:** NO PASA.

**Severidad:** S2 ALTO.

**Clasificación previa:** SIMULADA.

## Causa raíz
La superficie de Director fue presentada como interfaz accionable antes de que los flujos correspondientes estuvieran implementados.

## Corrección segura aplicada
En `initial-curriculum-guard-v72.js` v72.3 se añadió una guardia de transparencia V5 que:
- detecta botones de `#director` sin acción real;
- los deshabilita;
- añade `aria-disabled=true` y texto `Próximamente`;
- muestra un aviso sencillo indicando que esas funciones todavía están en construcción y no se consideran listas para lanzamiento.

No se inventó funcionalidad, no se alteró información institucional, no se modificaron históricos y no se tocó otro repositorio.

**Commit funcional:** `a30373aed62e4960d608b45cf7a126f4147682fb`.

## Retest
La versión v72.3 está presente en el commit funcional y la guardia solo afecta botones sin comportamiento real dentro de `#director`. El estado Vercel del commit funcional pasó a `success`.

**Resultado posterior de la corrección de transparencia:** PASA técnicamente para evitar controles simulados.

**Clasificación posterior del flujo Director:** INEXISTENTE/PARCIAL según submódulo; no se reclasifica como funcional. Los flujos reales de Continuar pendiente, creación documental, DG/Planes y Asistente Director siguen pendientes.

## Riesgo de regresión
Bajo. La guardia ignora cualquier botón que adquiera `onclick` o `formaction`; por tanto, una futura implementación real deja de ser deshabilitada automáticamente.

## Impacto en indicadores
- IUD/ICGD/IFR/ISU/Prelaunch: mejora cualitativa de honestidad de interfaz y reducción de error silencioso.
- No se asigna puntuación definitiva sin evidencia de usuarios reales.

## Gate V5
DocenteDigital sigue **NO APROBADA PARA LANZAMIENTO V1.0**. El flujo Director extremo a extremo continúa pendiente, junto con autenticación/aislamiento, backend productivo, OWASP ASVS real, backup/restauración real, Word/PDF y móvil físicos, 100 generaciones, año completo, concurrencia y pilotos.