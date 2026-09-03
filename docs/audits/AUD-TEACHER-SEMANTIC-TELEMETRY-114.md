# AUD-TEACHER-SEMANTIC-TELEMETRY-114

## Alcance
Unidad/Proyecto — superficie visible del análisis de intención del docente.

## Especificaciones aplicadas
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

## Prueba
**ID:** AUD-TEACHER-SEMANTIC-TELEMETRY-114

**Entrada:** escribir en Unidad/Proyecto una descripción libre suficiente para que `meaning-engine-v25.js` construya el bloque de interpretación semántica.

**Resultado esperado:** la interfaz debe presentar al docente solamente información útil para decidir, sin porcentajes de confianza ni telemetría/diagnóstico técnico de la interpretación. Los indicadores internos pueden conservarse para auditoría.

**Resultado obtenido antes de corregir:** `meaning-engine-v25.js` insertaba en `#ddIntentBox` la fila visible `CLARIDAD DE LA INTERPRETACIÓN` seguida del estado interno y `${m.confidence}%`.

**Evidencia:** `meaning-engine-v25.js` calcula internamente `confidence` y la mostraba en `paint()`. `visible-analysis-guard-v52.js` declaraba que porcentajes/confianza no debían mostrarse, pero su simplificación estaba limitada al flujo Director. `schedule-prompt-v6.js` carga primero `meaning-engine-v25.js` y posteriormente `visible-analysis-guard-v52.js`, por lo que ambos forman parte del runtime de producción.

**Estado inicial:** NO PASA.

**Severidad:** S3 MEDIO.

**Clasificación inicial:** PARCIALMENTE FUNCIONAL.

## Causa raíz
La política V4 de ocultar telemetría estaba implementada solo para el análisis visible del Director. El motor de significado del Docente repintaba su propio bloque y dejaba visible el porcentaje de confianza.

## Corrección
Se actualizó `visible-analysis-guard-v52.js` a v52.1. Se añadió `simplifyTeacherMeaning()`, que elimina únicamente la fila cuyo rótulo corresponde a `CLARIDAD DE LA INTERPRETACIÓN`. La corrección se reaplica tras cambios de la descripción/tipo y mediante `MutationObserver`, evitando que un repintado del motor vuelva a exponer la telemetría.

El valor interno `confidence` no se elimina ni se modifica; continúa disponible para auditoría interna. No se modifica contenido pedagógico, normativa, perfil EIB, documentos históricos ni datos institucionales.

**Commit funcional:** `a7f6c8e85857cf6f6a56f5c9d32a3c8df8384e9e`.

## Retest
- GitHub Actions `Prelaunch Smoke`, run `33704146825`: `success` para el commit funcional.
- Vercel deployment `dpl_HPakVZaWPgkiwqu9qmABRGE3MjWk`: `READY`, target `production`, commit `a7f6c8e85857cf6f6a56f5c9d32a3c8df8384e9e`.
- `https://docente-digital.vercel.app/`: HTTP 200 después del despliegue.
- `https://docente-digital.vercel.app/visible-analysis-guard-v52.js`: HTTP 200 y sirve v52.1 con `simplifyTeacherMeaning()`.

**Estado posterior:** PASA para la eliminación técnica de telemetría semántica visible en la superficie Docente.

**Clasificación posterior de este punto:** FUNCIONAL.

## Riesgo de regresión
Bajo. La guarda identifica la fila por su rótulo específico y no altera el objeto de significado ni el valor interno de confianza. Si el texto del rótulo cambia, deberá actualizarse el selector lógico o, preferentemente, eliminar la telemetría desde el propio render del motor en una futura refactorización.

## Impacto en métricas
Mejora cualitativamente V4/ISU al reducir información técnica innecesaria, pero no se recalcula ISU, IFR, ICGD ni Prelaunch Score por esta corrección aislada.

## Normativa
No se aplicó ni declaró vigente ninguna norma MINEDU nueva en esta corrección; el hallazgo y la modificación son exclusivamente técnicos/UX.

## Bloqueantes V5 que continúan pendientes
La corrección no acredita comprensión semántica mediante IA real, E2E Docente/Director, pruebas físicas de móvil/tablet/laptop, Word/PDF/impresión reales, backend, autenticación/autorización/aislamiento, OWASP ASVS, privacidad integral, backup/restauración real, 100 generaciones, año escolar completo, concurrencia ni pilotos con usuarios reales.

**Conclusión:** DocenteDigital NO está aprobada para lanzamiento V1.0.