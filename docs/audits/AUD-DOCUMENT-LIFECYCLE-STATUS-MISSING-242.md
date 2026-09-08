# AUD-DOCUMENT-LIFECYCLE-STATUS-MISSING-242 — Documentos guardados sin ciclo de estado trazable

## Especificaciones obligatorias aplicadas
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

## Hallazgo

**Módulos:** Carpeta Docente → Unidad/Proyecto/Sesión; transversal MTD/trazabilidad documental.

**Clasificación:** PARCIALMENTE FUNCIONAL.

**Severidad:** S2 ALTO.

V2 exige un ciclo operativo `Generar → Auditar → Editar → Aprobar → Archivar → Reutilizar`. V3 exige procedencia y trazabilidad y establece que los documentos históricos emitidos no deben modificarse retroactivamente. El Núcleo IA reserva la decisión profesional final al docente/director. La implementación productiva guarda unidades/proyectos y una última sesión, pero no tiene un estado documental estructurado que distinga al menos borrador/revisado/finalizado/archivado ni registra la transición entre esos estados.

## AUD-DOC-242-A — Estado de Unidad/Proyecto guardado

**Entrada:**
1. Crear una Unidad/Proyecto real.
2. Revisar la salida.
3. Guardarla y volver a abrirla desde el archivo.
4. Intentar identificar si está en borrador, revisada, finalizada o archivada.

**Resultado esperado:**
El documento debe conservar un estado explícito y trazable independiente de que simplemente exista en almacenamiento. Un guardado técnico no debe equivaler automáticamente a aprobación profesional. Las transiciones deben ser intencionales y conservar fecha/procedencia; una versión finalizada no debe alterarse retroactivamente al cambiar datos maestros.

**Resultado obtenido:**
- `createUnitDemo()` crea el objeto con `createdAt` y lo inserta directamente en `state.units`.
- `renderUnitOutput()` presenta `✓ Guardada`, pero no existe `status`, `documentStatus`, `reviewedAt`, `approvedAt`, `finalizedAt`, `archivedAt` ni modelo equivalente en el objeto base.
- La biblioteca de planificación ofrece abrir, crear sesiones, descargar Word y eliminar; no diferencia borrador de versión final o archivada.
- La persistencia posterior comprueba únicamente que la unidad exista en `localStorage`; no comprueba estado profesional/documental.

**Resultado:** NO PASA.

## AUD-DOC-242-B — Estado de Sesión guardada

**Entrada:** preparar una sesión → revisar → salir → `Continuar mi trabajo` → determinar su estado profesional.

**Resultado esperado:**
La sesión debe conservar un estado explícito distinto de la mera persistencia y permitir conocer si sigue en borrador/revisión o si fue finalizada por decisión del docente.

**Resultado obtenido:**
- La sesión se conserva como `state.lastSession`.
- La capa de persistencia valida únicamente que `lastSession.id` exista en el estado almacenado.
- No existe estado estructurado de revisión/finalización/archivo ni transición registrada.
- La recuperación vuelve a renderizar el documento, pero no informa si fue revisado o finalizado por el docente.

**Resultado:** NO PASA.

## AUD-DOC-242-C — No confundir “Guardada” con “Aprobada”

**Entrada:** crear una Unidad/Proyecto y observar el indicador visible posterior.

**Resultado esperado:**
La interfaz puede indicar `Guardada` como confirmación técnica, pero no debe convertir ese hecho en aprobación profesional ni ocultar que el contenido sigue siendo revisable.

**Resultado obtenido:**
La UI dice `✓ Guardada`, lo cual es correcto como estado técnico de persistencia, pero no existe un segundo estado profesional. El usuario no dispone de evidencia de revisión/finalización, y el sistema no puede diferenciar un borrador recién generado de un documento que el profesional decidió dejar listo.

**Resultado:** NO PASA como ciclo documental completo; la etiqueta `Guardada` por sí sola no se clasifica como falsa.

## Causa raíz

El prototipo modela principalmente existencia/persistencia del objeto y salida renderizada. Todavía no existe una máquina de estados documental común a Docente y Director ni versionado que permita separar:

- guardado técnico;
- borrador;
- revisado;
- finalizado por el profesional;
- emitido cuando jurídicamente corresponda;
- archivado;
- anulado/reemplazado cuando corresponda.

## Acción correctiva recomendada

No añadir un botón genérico `Aprobar` ni autoaprobar documentos. La corrección segura debe:

1. definir estados por tipo de documento y rol;
2. separar `saved/persisted` de `professionalStatus`;
3. usar transiciones explícitas y reversibles mientras el documento sea borrador;
4. guardar `statusChangedAt`, procedencia y usuario cuando exista autenticación;
5. congelar snapshots de documentos finalizados/emitidos para impedir cambios retroactivos;
6. exigir verificación reforzada para actos administrativos con efectos jurídicos;
7. no asignar firma, aprobación, número o emisión automáticamente;
8. mantener documentos ya creados como `borrador/no clasificado` durante una futura migración, sin inventar que fueron aprobados;
9. integrar archivo, búsqueda, versiones y recuperación;
10. probar E2E y restauración antes de aprobar el gate V5.

## Corrección aplicada en esta ronda

**Ninguna modificación funcional.** Agregar estados sin definir reglas de transición, versionado, autenticación y tratamiento de históricos podría producir falsos aprobados o modificar documentos previos. Se documenta el requisito como S2 y se mantiene pendiente.

## Evidencia técnica

- `app.js`: estado base con `units[]`, `activeUnitId` y `lastSession`, sin ciclo documental; `createUnitDemo()` usa `createdAt`; la salida de unidad muestra `✓ Guardada`.
- `persistence-truth-v63.js`: verifica existencia real en `localStorage`, no estado profesional.
- `planning-archive-simplicity-v56.js`: archivo de unidades/proyectos sin estado documental.
- `schedule-prompt-v6.js`: lista completa de módulos cargados dinámicamente; no hay módulo de lifecycle/approval/archive state.
- Producción canónica inspeccionada: `https://docente-digital.vercel.app/` carga esas capas y responde HTTP 200 en la ronda de auditoría.

## Riesgo de regresión

**Alto si se corrige superficialmente.** Un botón `Aprobar` sin versionado, permisos ni snapshots podría producir documentos falsamente finalizados, alterar históricos o crear riesgos administrativos.

## Impacto cualitativo

- **IUD:** negativo; no se distingue trabajo pendiente de documento listo.
- **ICGD:** negativo; la decisión profesional final no queda registrada como estado.
- **IFR:** negativo; falta parte del ciclo funcional definido en V2/V3.
- **ISU:** negativo moderado; el usuario no sabe con claridad qué está terminado y qué sigue siendo borrador.
- **Prelaunch:** mantiene el gate cerrado mientras no exista trazabilidad documental completa y continúen los bloqueantes S0/S1 previos.

No se calculan puntuaciones definitivas.

## Pendientes que no se simulan

- estados y transiciones reales;
- versionado/historial;
- autenticación y usuario responsable;
- aprobación/finalización real por el profesional;
- emisión y firma de actos administrativos;
- archivo y recuperación multiusuario;
- pruebas E2E Docente y Director;
- pruebas con usuarios reales y dispositivos físicos.

## Normativa externa

Este hallazgo se fundamenta en especificaciones funcionales internas V2–V5 y Núcleo IA. No requiere aplicar ni declarar vigente una norma MINEDU/UGEL externa en esta ronda. Para estados jurídicos de actos administrativos se deberá verificar la normativa oficial vigente antes de diseñar reglas de emisión o aprobación.