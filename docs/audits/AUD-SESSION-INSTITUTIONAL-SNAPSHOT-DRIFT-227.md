# AUD-SESSION-INSTITUTIONAL-SNAPSHOT-DRIFT-227

## Alcance
Sesiones · Ficha Maestra · reapertura histórica · exportación DOCX · trazabilidad V2/V3/V4/V5/Núcleo IA.

## Especificaciones obligatorias aplicadas conjuntamente
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

V3 exige una fuente única de verdad con trazabilidad y establece que los documentos históricos no deben cambiar retroactivamente cuando cambian los datos maestros. V5 exige persistencia/recuperación real y exportaciones confiables antes del lanzamiento. El Núcleo IA exige conservar procedencia y significado entre los eslabones del flujo.

## ID de prueba
`AUD-SESSION-INSTITUTIONAL-SNAPSHOT-DRIFT-227`

## Módulo
Ficha Maestra → Sesión guardada → Continuar / visualizar → Descargar DOCX.

## Entrada
1. Completar la Ficha Maestra con `IE A` y `Docente A`.
2. Crear una Unidad/Proyecto y una Sesión S.
3. Confirmar que S contiene datos informativos derivados de esa Ficha Maestra.
4. Editar posteriormente la Ficha Maestra a `IE B` y/o `Docente B`.
5. Volver a abrir S o descargar nuevamente su DOCX.

## Resultado esperado
La sesión histórica S debe conservar la identidad institucional/docente correspondiente al momento de su creación o a la versión documental que fue guardada. La Ficha Maestra nueva solo debe aplicarse a documentos nuevos, salvo que el usuario decida explícitamente migrar/actualizar un borrador no emitido. Un documento histórico no debe ser reetiquetado silenciosamente con una identidad posterior.

## Resultado obtenido
`session-learning-core-v54.js` construye `session.informativeData` mediante `informativeData(session)`. Esa función obtiene `institution` y `teacher` de `state.institutionMaster` / `state.teacherName` actuales. Más importante: `sessionHtml()` llama otra vez a `enrich(session)` cada vez que la sesión se renderiza, y `enrich(session)` vuelve a ejecutar `session.informativeData=informativeData(session)`. Por tanto, aunque S hubiera guardado `informativeData`, una reapertura/renderización posterior lo reemplaza con la Ficha Maestra vigente en ese momento.

Además, `docx-export-v29.js::docxBlob()` compone la identidad final del documento desde `state.teacherName` y `state.institutionMaster.ieName` actuales. `downloadSessionWord()` invoca `sessionHtml(s,true)` y después `docxBlob(...)`; así la exportación puede incorporar la identidad actual incluso cuando el objeto de sesión corresponde a un contexto histórico previo.

La Ficha Maestra es editable y `saveMaster()` sincroniza sus valores a `state.ieName`, `state.teacherName` y demás campos, por lo que la secuencia de prueba es alcanzable desde la UI real.

## Evidencia técnica
- `institution-master-v46.js`: Ficha Maestra editable; `saveMaster()` reemplaza `state.institutionMaster` y sincroniza `state.teacherName`/`state.ieName`.
- `session-learning-core-v54.js`: `informativeData(session)` lee la Ficha Maestra actual; `enrich(session)` reasigna `session.informativeData`; `sessionHtml()` vuelve a llamar `enrich(session)`.
- `docx-export-v29.js`: `docxBlob()` añade identidad desde `state.teacherName` + `state.institutionMaster.ieName` actuales.
- Producción canónica: `/session-learning-core-v54.js` respondió HTTP 200 y contiene esta misma lógica antes de registrar el hallazgo.

## PASA / NO PASA
**NO PASA.**

## Clasificación
- Ficha Maestra editable: **FUNCIONAL** en almacenamiento local del prototipo.
- Captura inicial de datos informativos de sesión: **PARCIALMENTE FUNCIONAL**.
- Conservación histórica de identidad institucional/docente al reabrir: **ROTA**.
- Conservación histórica de identidad en DOCX: **ROTA / NO DEMOSTRADA**.
- Trazabilidad de versión Ficha Maestra → documento: **INEXISTENTE**.

## Severidad
**S1 CRÍTICO — bloqueante V5.**

Motivo: el defecto puede producir un documento pedagógico con identidad institucional/docente distinta de la que correspondía al documento guardado, sin advertencia ni decisión del usuario. Esto afecta integridad documental y contradice expresamente la regla de no modificar históricos al cambiar datos maestros. Una salida visualmente correcta no compensa la pérdida de procedencia.

## Causa raíz
No existe un contrato de snapshot/versionado de Ficha Maestra por documento. La capa de sesión mezcla dos conceptos distintos:
1. datos históricos propios de la sesión;
2. datos maestros actuales para documentos nuevos.

La rutina `enrich()` se diseñó como enriquecimiento idempotente, pero para `informativeData` actúa como rehidratación desde estado mutable global. El exportador DOCX repite el mismo acoplamiento al estado global.

## Acción correctiva requerida
No se aplica un parche parcial en esta ejecución porque corregir solo `sessionHtml()` dejaría el DOCX con identidad actual, y corregir solo DOCX dejaría la sesión reabierta mutada. La corrección debe ser atómica y coherente:

1. crear un snapshot documental estable al crear la sesión, por ejemplo `documentContextSnapshot`, con `institutionId/version`, nombre IE, docente, nivel/tipo/grados, perfil lingüístico y fecha/versionado pertinente;
2. no sobrescribir ese snapshot en `enrich()` ni al renderizar;
3. hacer que `sessionHtml()` y `docxBlob()` consuman el snapshot del documento, no `state.*` global;
4. distinguir `borrador actualizable` de `emitido/histórico`; los emitidos nunca deben migrarse automáticamente;
5. si un borrador antiguo carece de snapshot, mostrar `dato histórico por verificar` o pedir decisión explícita antes de completar con la Ficha Maestra actual;
6. añadir prueba automática: crear S con IE A/Docente A → cambiar Ficha Maestra a B → reabrir/exportar S → comprobar que sigue A → crear S2 → comprobar que usa B;
7. extender el mismo contrato a Unidad/Proyecto y futuros documentos Director antes de declarar trazabilidad completa.

## Evidencia posterior requerida
- test de navegador real de la secuencia A→B;
- comparación del objeto persistido antes/después de reabrir;
- comparación estructural del DOCX antes/después;
- prueba de que un documento nuevo sí toma la Ficha Maestra B;
- prueba de que abrir un histórico no revierte ni contamina la Ficha Maestra actual;
- prueba móvil y Word físico siguen PENDIENTES.

## Fuente oficial externa
No fue necesario aplicar ni declarar vigente una norma MINEDU/UGEL/legal externa para identificar este defecto. Se fundamenta en las especificaciones obligatorias internas y en evidencia técnica del runtime. No se añade ninguna afirmación de vigencia normativa externa sin verificación oficial.

## Riesgo de regresión
**ALTO** si se corrige únicamente una capa (render o exportación) o copiando automáticamente datos actuales a históricos. **MEDIO/BAJO** si se introduce snapshot inmutable/versionado con pruebas A→B y se separan borradores de documentos emitidos.

## Impacto en indicadores
- **IUD:** afectado por riesgo de mostrar una identidad incorrecta sin advertencia.
- **ICGD:** afectado de forma directa por pérdida de procedencia/versionado.
- **IFR:** afectado porque guardar y recuperar no reproduce el mismo documento contextual.
- **ISU:** no se calcula; el usuario no debería tener que detectar por sí mismo qué identidad cambió.
- **Prelaunch:** **BLOQUEADO** mientras no exista preservación documental demostrada y continúen otros S0/S1.

No se calculan puntajes definitivos.

## Pendientes reales
Usuarios reales, móvil físico, Word físico/impresión, restore real, concurrencia, aislamiento multiusuario, OWASP ASVS, 100 generaciones, año completo y pilotos permanecen **PENDIENTES** y no se simulan.

## Conclusión
DocenteDigital **NO está aprobada para lanzamiento V1.0**. La Ficha Maestra puede actualizarse, pero una Sesión histórica no puede absorber silenciosamente esa identidad posterior al reabrirse o exportarse.