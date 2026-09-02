# AUD-HOME-SURFACE-TRUTH-083

## Módulo
Inicio / V4 simplicidad / V5 verdad funcional.

## Estado
CORREGIDO A NIVEL DE INTEGRACIÓN TÉCNICA. El cierre funcional completo de Materiales y Evaluación sigue PENDIENTE porque sus flujos V1.0 aún no están implementados y probados extremo a extremo.

## Clasificación inicial
PARCIALMENTE FUNCIONAL / SUPERFICIE ENGAÑOSA.

## Severidad inicial
S2 — ALTO.

## ID de prueba
AUD-HOME-SURFACE-TRUTH-083

## Entrada
Abrir Inicio después de configurar el perfil y observar/usar las tarjetas principales “Mi planificación”, “Materiales” y “Evaluación”.

## Resultado esperado
La pantalla principal debe mostrar como acciones disponibles únicamente funciones realmente utilizables. Funciones bloqueadas por prelaunch deben aparecer como no disponibles/próximamente y no actuar como CTA principales. La descripción de Planificación debe distinguir lo disponible de Diagnóstico/Programación anual aún pendientes.

## Resultado obtenido antes de la corrección
`index.html` mostraba tarjetas activas para Materiales y Evaluación con textos que afirmaban capacidades (“Lecturas y fichas…”; “Registro, evaluación y conclusiones SIAGIE”), aunque las guardas V5 posteriores deshabilitan sus acciones principales. La tarjeta Mi planificación también presentaba Diagnóstico y Programación anual junto con las funciones disponibles sin indicar que aquellas permanecen pendientes.

## Evidencia
- `index.html`: Inicio contiene botones activos `go('materials')`, `go('evaluation')` y texto que presenta esos flujos como disponibles.
- `initial-curriculum-guard-v72.js`: `markUnfinishedMaterialsActions()` y `markUnfinishedEvaluationActions()` deshabilitan las acciones principales por no estar implementadas como flujos completos.
- V4 exige menos confusión, una acción principal clara y no mostrar todo como disponible cuando aún no corresponde.
- V5 exige congelar V1.0, preferir pocas funciones excelentes y no aprobar una función porque aparezca o produzca una pantalla.

## Resultado
NO PASA antes de la corrección.

## Causa raíz
La verdad funcional se aplicaba dentro de los módulos Materiales/Evaluación, pero no se propagaba a la superficie principal de Inicio. Existía inconsistencia de disponibilidad entre Home y los módulos destino.

## Acción correctiva aplicada
1. Se creó `home-surface-truth-v73.js`.
2. Se incorporó al cargador estable de `schedule-prompt-v6.js`.
3. En Inicio, las tarjetas Materiales y Evaluación quedan deshabilitadas, con `aria-disabled`, título de indisponibilidad, texto “Próximamente” y sin `onclick`.
4. La tarjeta Mi planificación sigue disponible porque Unidad/Proyecto y horario sí tienen superficie activa, pero su descripción ahora diferencia explícitamente: “Unidades, proyectos y horario disponibles. Diagnóstico y programación anual: próximamente.”

## Commits
- `0d529300cbe1d700fcaa212dac162f0b5d81147c` — crea la guardia de verdad funcional de Inicio.
- `ed3e7377711259c3041a4394b5b2146a22aa10a7` — integra la guardia en el cargador estable.

## Evidencia posterior
- GitHub Actions `Prelaunch Smoke`, run `33621299516`: `completed / success` para `ed3e7377711259c3041a4394b5b2146a22aa10a7`.
- Vercel deployment `dpl_HLVaWKfFgmBjbNiyCYaqwfFmcWPj`: `production / READY` para el commit `ed3e7377711259c3041a4394b5b2146a22aa10a7`.
- `https://docente-digital.vercel.app/`: HTTP 200 posterior al despliegue.
- `https://docente-digital.vercel.app/home-surface-truth-v73.js`: HTTP 200 y contenido de la guardia servido en producción.

## Retest
PASA a nivel de integración técnica respecto de no anunciar como disponibles Materiales/Evaluación desde Inicio y de aclarar la disponibilidad parcial de Planificación.

## Pendiente real
No se clasifica Materiales ni Evaluación como FUNCIONAL. Ambos continúan INEXISTENTES/PARCIALES para V1.0 hasta implementar y probar sus recorridos reales, persistencia, edición, exportación, móvil y trazabilidad.

## Riesgo de regresión
MEDIO. Si se habilita Materiales o Evaluación posteriormente y no se actualiza esta guardia, Inicio podría seguir mostrándolos como “Próximamente”. Cuando esos módulos pasen sus gates V5, debe retirarse/actualizarse la condición en lugar de forzar su disponibilidad.

## Impacto en indicadores
- IUD: mejora cualitativa por reducción de acciones engañosas.
- ICGD: mejora cualitativa en consistencia entre superficies.
- IFR: no cambia la funcionalidad subyacente de Materiales/Evaluación.
- ISU: mejora parcial; no se calcula puntuación definitiva sin usuarios reales.
- Prelaunch: reduce un falso positivo de disponibilidad, pero no cierra ningún bloqueante V5 de Materiales/Evaluación.

## Fuente oficial
No se aplicó ni declaró vigente ninguna norma educativa en esta corrección. Por tanto, no corresponde afirmar vigencia normativa nueva.
