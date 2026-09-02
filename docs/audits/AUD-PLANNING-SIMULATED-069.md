# AUD-PLANNING-SIMULATED-069

## Módulo
Carpeta Docente → Mi planificación → Evaluación diagnóstica / Programación anual.

## Especificaciones aplicadas
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

## Prueba
**ID:** AUD-PLANNING-SIMULATED-069

**Entrada:** abrir `Mi planificación`, entrar a Evaluación diagnóstica y pulsar `Crear diagnóstico`; pulsar `Abrir` en Programación anual.

**Esperado:** cada control visible debe ejecutar un flujo funcional completo, producir un resultado verificable, persistible y reutilizable; si todavía no existe, debe declararse claramente no disponible.

**Obtenido antes:** `generateDiagnostic()` solo retiraba la clase `hidden` de un contenedor `diagnosticResult` vacío. `demoAnnual()` únicamente mostraba un `alert` declarando que era un prototipo. Ambos controles se presentaban como acciones operativas.

**Estado antes:** NO PASA.

**Clasificación:** SIMULADA / PARCIALMENTE FUNCIONAL.

**Severidad:** S2 — función importante de planificación presentada como operativa sin flujo real, con riesgo de confundir al docente y de aprobar falsamente el recorrido V5.

## Causa raíz
La maqueta de interfaz permaneció expuesta después de incorporar gates V3/V4/V5. Existían handlers demostrativos sin una guardia que diferenciara funciones implementadas de funciones futuras.

## Corrección segura y reversible
En `initial-curriculum-guard-v72.js` v72.9 se añadió `markUnfinishedPlanningActions()` para:
- deshabilitar `generateDiagnostic` mientras no produzca un diagnóstico real;
- deshabilitar `demoAnnual` mientras no exista programación anual funcional;
- retirar los `onclick` simulados;
- marcar ambos controles como `Próximamente`;
- mostrar un aviso claro de que no se consideran listos para lanzamiento.

No se implementó artificialmente currículo, IA, backend, diagnóstico ni programación anual.

## Evidencia posterior
- Commit funcional: `2feee3a5487bef46af47974baeca4ef09e0dbf10`.
- Deployment Vercel: `dpl_C65EX9V6timqkidrHEXTqcPZB9wQ` → production / READY.
- `https://docente-digital.vercel.app/` → HTTP 200.
- `https://docente-digital.vercel.app/initial-curriculum-guard-v72.js` → HTTP 200 y sirve v72.9 con `markUnfinishedPlanningActions()`.

## Estado posterior
PASA únicamente respecto a **no presentar funciones simuladas como funcionales**.

Evaluación diagnóstica y Programación anual continúan **INEXISTENTES/PENDIENTES como flujos V1.0** y no pueden aprobar el gate V5 hasta su implementación y prueba real extremo a extremo.

## Riesgo de regresión
Bajo. La modificación solo afecta botones cuyos handlers actuales son explícitamente demostrativos o vacíos. Debe retirarse esta guardia cuando las funciones reales sustituyan esos handlers.

## Impacto en indicadores
- IUD: mejora cualitativa por evitar una interacción engañosa; sin puntuación definitiva.
- ICGD: sin cierre; Programación anual sigue pendiente.
- IFR: mejora en honestidad funcional, no en cobertura funcional.
- ISU: mejora cualitativa en claridad; no calcular valor definitivo sin usuarios reales.
- Prelaunch: no mejora el gate de cobertura; elimina una falsa apariencia de cumplimiento pero mantiene el bloqueante.

## Gate V5
DocenteDigital sigue **NO APROBADA PARA LANZAMIENTO V1.0** mientras permanezcan pendientes flujos esenciales, pruebas físicas, seguridad, backend, IA real, exportación física, año completo, concurrencia y pilotos.