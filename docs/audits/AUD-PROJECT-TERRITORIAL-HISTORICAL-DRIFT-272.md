# AUD-PROJECT-TERRITORIAL-HISTORICAL-DRIFT-272 — Proyecto: actores inventados y reescritura retroactiva de históricos

## Especificaciones obligatorias aplicadas

Se revisaron conjuntamente:
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

V3 exige que los documentos históricos emitidos conserven los datos vigentes al momento de su emisión y prohíbe modificarlos retroactivamente. El Núcleo IA exige no inventar actores ni territorialidad y conservar la intención completa del usuario.

## Hallazgo previo a la corrección

`project-territorial-v31.js` tenía dos problemas combinados:

1. `recipient()` devolvía siempre `familias, comunidad educativa...` incluso cuando la situación no mencionaba familias ni comunidad.
2. al cargar el módulo se ejecutaba `(state.units||[]).forEach(ensureDesign)` y `ensureDesign()` no distinguía estados históricos; por tanto podía reescribir `recipient`, `actionPath` y `socialization` de proyectos previamente emitidos, aprobados, archivados o históricos.

El problema era especialmente relevante porque `unit-project-mode-v13.js` presenta `projectDesign` en la salida visible y en la exportación Word del Proyecto. Por ello no era una telemetría interna: podía modificar el documento mostrado/exportado.

## Prueba principal

**ID:** AUD-PROJECT-272-A  
**Módulo:** Proyecto de aprendizaje / territorialidad / integridad histórica.  
**Entrada:** proyecto histórico con `status=Emitido` y un `projectDesign.recipient` propio del momento de emisión; posteriormente cambia la Ficha Maestra o el contexto territorial y se vuelve a abrir la aplicación.  
**Resultado esperado:** el proyecto histórico mantiene exactamente sus datos de emisión; el contexto maestro actualizado solo afecta documentos nuevos.  
**Resultado obtenido antes del fix:** `project-territorial-v31.js` recorría todas las unidades y reasignaba `recipient`, `actionPath` y `socialization` sin excluir históricos.  
**Evidencia:** versión previa del módulo y regla V3 de inmutabilidad histórica.  
**PASA/NO PASA previo:** **NO PASA**.  
**Clasificación previa:** **PARCIALMENTE FUNCIONAL**.  
**Severidad:** **S2 ALTO** por pérdida de trazabilidad e integridad documental histórica; no se eleva a S0/S1 porque no se demostró en esta ronda corrupción irreversible ni afectación de un acto administrativo real.

## Prueba de actores territoriales

**ID:** AUD-PROJECT-272-B  
**Entrada:** Proyecto con situación urbana o territorialidad no especificada, sin menciones a familia/comunidad y sin Ficha Maestra de tipo `Comunidad campesina`/`Comunidad nativa`.  
**Resultado esperado:** no agregar familias, comunidad ni actores territoriales no proporcionados; usar formulación neutral hasta contar con evidencia suficiente.  
**Resultado obtenido antes del fix:** `recipient()` generaba `familias, comunidad educativa y otros actores pertinentes del entorno` y la socialización heredaba esa inferencia.  
**PASA/NO PASA previo:** **NO PASA**.  
**Clasificación previa:** **PARCIALMENTE FUNCIONAL**.  
**Severidad:** **S2 ALTO**.

## Causa raíz

Una capa creada para neutralizar el sesgo rural reemplazó `personas de la comunidad` por expresiones más generales, pero conservó una plantilla fija de destinatarios basada en `familias` y no incorporó protección de estado histórico. Además, el saneamiento se ejecutaba globalmente en cada carga.

## Corrección aplicada

Commit funcional: `788670e1329f2ca32cd7b8b51dc3219477391e35` (`fix: preserve historical project territorial context`).

`project-territorial-v31.js` pasa a v31.1 y ahora:

- detecta `Emitido`, `Aprobado`, `Archivado` e `Histórico` y retorna sin modificar esos proyectos;
- solo considera comunidad cuando aparece explícitamente en la situación o cuando el tipo de lugar de la Ficha Maestra es `Comunidad campesina`/`Comunidad nativa`;
- solo incorpora familias cuando la situación menciona familia/familias/madres/padres/abuelos u otra forma equivalente prevista;
- cuando faltan ambos datos usa `destinatarios vinculados al propósito del proyecto`;
- reemplaza únicamente patrones legado conocidos en borradores no históricos, reduciendo el riesgo de sobrescribir texto libre del usuario;
- neutraliza la frase legado `fuentes y personas de la comunidad`;
- expone `ddAuditProjectTerritorial(unit)` como control técnico de actores no sustentados.

No se modificaron documentos históricos existentes para "arreglarlos"; precisamente se bloqueó su reescritura automática.

## Reprueba de implementación

**ID:** AUD-PROJECT-272-R1  
**Entrada:** inspección del runtime corregido.  
**Esperado:** históricos excluidos del saneamiento; actores solo cuando existen evidencias; fallback neutral.  
**Obtenido:** `isHistorical()` bloquea `ensureDesign()` y `contextEvidence()` gobierna `community`/`family`; `recipient()` usa fallback neutral.  
**Estado:** **PASA EN IMPLEMENTACIÓN**.  
**Clasificación actual:** **FUNCIONAL EN IMPLEMENTACIÓN / E2E REAL PENDIENTE**.  
**Severidad residual:** **S2** hasta ejecutar reapertura real de un proyecto histórico y generación real de un Proyecto urbano/neutro.

## Evidencia real aún pendiente

V3/V5 impiden cerrar definitivamente el hallazgo solo por inspección de código. Quedan pendientes:

- crear un Proyecto urbano sin familia/comunidad y comprobar pantalla + DOCX;
- crear un Proyecto con comunidad explícita y comprobar conservación literal;
- crear un Proyecto con familias pero sin comunidad y comprobar que no se agregue comunidad;
- emitir/marcar histórico un proyecto, cambiar Ficha Maestra, recargar y demostrar que no cambia;
- probar cierre/reapertura y almacenamiento real;
- probar móvil físico y Word real.

El ejecutor interactivo `agent-browser` no está disponible en el entorno de esta ronda, por lo que no se simula evidencia E2E.

## Normativa externa

Este hallazgo y su corrección se sustentan en las especificaciones internas obligatorias y en el Núcleo IA. No se usó ni se declaró vigente ninguna norma externa MINEDU/UGEL/legal en esta corrección; por tanto no se introduce una afirmación normativa externa sin verificación oficial.

## Riesgo de regresión

**Medio.** El módulo comparte datos con `unit-project-mode-v13.js`, renderizado, Word y persistencia. La corrección se limitó a la capa territorial y conserva los campos existentes. El riesgo principal está en proyectos antiguos sin estado formal, que continúan siendo borradores y solo se corrigen cuando coinciden con patrones legado reconocibles.

## Impacto en métricas

- **IUD:** mejora cualitativa esperada al reducir actores inventados; no se asigna puntaje definitivo sin prueba de usuario.
- **ICGD:** mejora la coherencia territorial del Proyecto; no se calcula valor definitivo.
- **IFR:** mejora la fidelidad de datos históricos y destinatarios; pendiente de E2E.
- **ISU:** sin cambio cuantificable en esta ronda.
- **Prelaunch:** sigue **BLOQUEADO** por pruebas reales esenciales pendientes.

## Veredicto

La falla está corregida **en implementación**, no certificada aún mediante E2E físico. DocenteDigital **NO está lista para lanzamiento V1.0** mientras continúen los bloqueantes V5 y las pruebas reales esenciales pendientes.