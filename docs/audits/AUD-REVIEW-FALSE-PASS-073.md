# AUD-REVIEW-FALSE-PASS-073

## Módulo
Unidad/Proyecto → Revisión pedagógica

## Prueba
**ID:** AUD-REVIEW-FALSE-PASS-073

**Entrada:** abrir una unidad/proyecto y ejecutar `Revisar coherencia` cuando Instrumentos y Registro auxiliar no cuentan con flujo funcional completo ni evidencia de trazabilidad.

**Esperado:** no marcar PASA aquello que no fue realmente comprobado; los componentes sin evidencia deben mostrarse como pendientes/no verificados.

**Obtenido antes:** `ddReviewUnit()` incluía `['Instrumentos', true]` y `['Registro auxiliar', true]`, mostrando ✓ de forma incondicional.

**Resultado inicial:** NO PASA

**Severidad:** S2 — ALTO

**Clasificación:** SIMULADA / PARCIALMENTE FUNCIONAL

## Causa raíz
La revisión mezclaba verificaciones simples de presencia de datos con afirmaciones de aprobación sobre módulos sin comprobación funcional real.

## Corrección
`format-v2.js` v2.2: Instrumentos y Registro auxiliar usan estado pendiente y el mensaje aclara que la revisión solo comprueba datos visibles de la unidad. IA avanzada, fuentes curriculares, instrumentos y registro permanecen pendientes hasta contar con evidencia.

## Evidencia posterior
- Commit funcional: `94aada836d3957664ed75a38b15d043f524c5529`.
- Deployment Vercel: `dpl_9jnfCH5shuQ78jzjN18WgjxepYUR`.
- Estado: `READY`, target `production`.
- Producción raíz: HTTP 200.
- `/format-v2.js`: HTTP 200 y sirve v2.2.

## Estado posterior
PASA respecto a eliminar el falso positivo. Instrumentos y Registro auxiliar continúan pendientes como funciones V5 reales.

## Riesgo de regresión
Bajo: solo cambia la presentación de la revisión; no modifica datos, históricos, generación, exportación ni persistencia.

## Impacto
IUD/ICGD/ISU: mejora claridad y confianza sin puntaje definitivo. IFR: no cambia; Instrumentos/Registro siguen pendientes. Prelaunch: no cierra bloqueantes, evita ocultarlos con un ✓ incorrecto.

## Bloqueantes relacionados pendientes
Instrumentos reales, Registro auxiliar real, Evaluación completa, trazabilidad criterio→evidencia→instrumento→registro, Ficha Maestra completa, Director E2E, IA semántica real, autenticación/aislamiento, backend, OWASP ASVS, backup/restauración real, Word/PDF físicos, móvil físico, 100 generaciones, año completo, concurrencia y pilotos reales.
