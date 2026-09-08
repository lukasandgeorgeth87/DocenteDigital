# AUD-SESSION-EDIT-MISSING-241 — Sesión guardada sin edición posterior

## Especificaciones obligatorias aplicadas
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

## Hallazgo

**Módulo:** Carpeta Docente → Sesiones → revisión/edición/persistencia.

**Clasificación:** PARCIALMENTE FUNCIONAL.

**Severidad:** S2 ALTO.

V5 incluye `editar` entre las pruebas funcionales obligatorias de documentos. V2 exige el ciclo Generar → Auditar → Editar → Aprobar → Archivar → Reutilizar. V3 establece que una función solo aprueba si, además de responder correctamente, se guarda, recupera y edita. El Núcleo IA reserva al docente/director la decisión profesional final.

## AUD-SES-241-A — Editar una sesión después de generarla

**Entrada:**
1. Seleccionar una Unidad/Proyecto real y una actividad programada.
2. Preparar una sesión.
3. Revisar la salida guardada.
4. Intentar corregir después de la generación, por ejemplo el propósito, criterio, evidencia, instrumento, actividades o formalización.

**Resultado esperado:**
La sesión debe poder abrirse en modo de edición controlada, modificar campos autorizados, guardar los cambios sobre el mismo documento o una nueva versión explícita, conservar trazabilidad (`updatedAt`, versión/procedencia cuando corresponda) y no modificar retroactivamente otros documentos históricos.

**Resultado obtenido:**
- `buildSession()` crea el objeto y lo guarda únicamente en `state.lastSession`.
- `renderSessionOutput()` presenta el documento como HTML y ofrece solo `Descargar Word` y `Compartir`.
- No existe acción `Editar sesión`, editor de propósito/criterio/evidencia/instrumento ni mecanismo de guardar cambios posteriores sobre la sesión ya creada.
- La interfaz de `Corrección con IA` está correctamente deshabilitada como `Próximamente`, por lo que tampoco constituye edición disponible.
- `sessionTitle` puede dejar de ser `readonly` en Modo Experto antes de generar, pero esto no permite editar la sesión persistida completa después de la generación.

**Resultado:** NO PASA.

**Evidencia:** `app.js` productivo y repositorio: `buildSession()`, `renderSessionOutput()`, `downloadSessionWord()`, `shareSession()`; HTML productivo de la pantalla Sesión.

## AUD-SES-241-B — Reabrir y modificar la última sesión

**Entrada:** generar sesión → salir del módulo → `Continuar mi trabajo` → intentar modificar la sesión recuperada.

**Resultado esperado:** reabrir el mismo documento editable, conservar ID y datos aprobados, permitir cambios explícitos y guardarlos con trazabilidad.

**Resultado obtenido:** `continueWork()` vuelve a `renderSessionOutput(state.lastSession)`, es decir, recupera una vista de la última sesión, pero no un editor del documento.

**Resultado:** NO PASA.

## Causa raíz

El modelo actual trata la sesión principalmente como una salida renderizada y exportable. El estado conserva solo `lastSession`, no una biblioteca/versionado de sesiones editables con operaciones CRUD completas. La revisión posterior se diseñó alrededor de una futura corrección con IA, actualmente deshabilitada, sin un editor convencional independiente de IA.

## Acción correctiva recomendada

No implementar un simple `contenteditable` sobre el HTML. La corrección segura debe:
1. disponer de `state.sessions[]` o persistencia equivalente, no solo `lastSession`;
2. abrir una sesión por `id`;
3. separar datos estructurados de la representación HTML/DOCX;
4. ofrecer edición explícita de campos permitidos;
5. guardar `updatedAt` y, cuando corresponda, historial/versiones;
6. conservar snapshots institucionales/curriculares aprobados y no reescribir históricos automáticamente;
7. mantener la edición manual disponible aunque falle la IA;
8. volver a generar vista previa y DOCX/PDF desde el estado editado;
9. probar cierre/recarga/interrupción y autoguardado;
10. probar móvil y accesibilidad antes de aprobar.

## Corrección aplicada en esta ronda

**Ninguna modificación funcional.** Implementar edición sobre la arquitectura actual sin resolver primero biblioteca de sesiones, historial, autosave y reglas de snapshot podría introducir pérdida de información o cambios retroactivos. Se documenta el hallazgo y se mantiene pendiente.

## Riesgo de regresión

Alto si se corrige superficialmente. Un editor HTML directo podría desalinear sesión ↔ criterio ↔ evidencia ↔ instrumento, romper exportación y alterar documentos ya considerados históricos.

## Impacto cualitativo
- IUD: negativo; impide reutilización/edición natural del documento.
- ICGD: negativo; la decisión profesional no queda plenamente operativa sobre la sesión guardada.
- IFR: negativo; falta una operación funcional requerida por V5.
- ISU: negativo; corregir una sesión obliga a regenerar o editar fuera de la app.
- Prelaunch: mantiene el gate cerrado; no se calcula puntuación definitiva.

## Pendientes que no se simulan
- edición real y versionada;
- autoguardado de edición;
- historial de sesiones;
- prueba E2E Unidad → Sesión editada → Materiales → Evaluación → Registro;
- Word/PDF físicos tras editar;
- dispositivos físicos;
- usuarios reales;
- pruebas de concurrencia/aislamiento cuando exista backend multiusuario.

## Normativa externa

Este hallazgo es funcional/arquitectónico y se sustenta en V2–V5 + Núcleo IA internos. No requiere declarar vigente ninguna norma MINEDU/UGEL externa.