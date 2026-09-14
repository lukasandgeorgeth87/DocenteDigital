# AUD-IDENTITY-PREVIEW-PLACEHOLDER-278

## Módulo
Unidad/Proyecto · vista previa documental · Ficha Maestra · integridad de identidad.

## Especificaciones aplicadas
Se revisó conjuntamente `AUDITORIA_MAESTRA_INTEGRAL_V2.md`, `ADENDA_AUDITORIA_EJECUTABLE_V3.md`, `AUDITORIA_SIMPLICIDAD_USO_V4.md`, `AUDITORIA_PRELANZAMIENTO_V5.md` y `NUCLEO_IA_DOCENTEDIGITAL.md`.

Este hallazgo no requiere declarar vigente una norma externa: trata de integridad y trazabilidad interna de datos suministrados por el usuario.

## Clasificación inicial
- Estado: NO PASA
- Severidad: S2 ALTO
- Función: PARCIALMENTE FUNCIONAL
- Tipo: error silencioso de identidad visible

## Prueba
**ID:** AUD-IDENTITY-PREVIEW-278-A

**Entrada:** perfil/Ficha Maestra sin `teacherName` y sin `schoolName`; crear o abrir una Unidad/Proyecto y renderizar su vista previa.

**Resultado esperado:** si los datos de identidad no existen, la vista previa no debe presentar nombres, cargos ni etiquetas genéricas como si fueran datos reales. Si existe solo uno de los dos datos, debe mostrar únicamente el dato realmente guardado.

**Resultado obtenido antes:** `format-v2.js` añadía siempre `.dd-preview-footer` con `${state.teacherName||'Docente'} · ${state.schoolName||'Institución Educativa'}`. Un perfil vacío mostraba `Docente · Institución Educativa` en el pie visible, pese a que ninguno de esos valores provenía del usuario.

**Evidencia:** inspección directa de `format-v2.js`; el hallazgo previo AUD-IDENTITY-HARDCODE-072 había eliminado nombres concretos hardcodeados, pero mantuvo expresamente etiquetas genéricas para presentación. La corrección posterior de AUD-DOCX-DATA-022 cubrió el OOXML real, no esta vista previa HTML.

## Causa raíz
La capa visual trataba etiquetas de ausencia como si fueran contenido documental. La fuente de verdad (`teacherName`, `schoolName`) estaba vacía, pero la presentación fabricaba un pie no sustentado.

## Corrección
Commit funcional `d33f887d5861f37162d87401e743978789200e2c` (`fix: hide placeholder identity from unit preview`).

`runtime-audit-v23.js` pasa a v24.3 y añade una defensa de superficie que:
1. deriva el pie exclusivamente de `state.teacherName` y `state.schoolName` no vacíos;
2. elimina `.dd-preview-footer` cuando ambos datos faltan;
3. muestra solo el dato existente cuando uno de los dos está informado;
4. no cambia históricos ni valores maestros;
5. expone `ddAuditIdentityPreviewTruth()` para comparar identidad esperada con la visible.

## Reprueba técnica
**ID:** AUD-IDENTITY-PREVIEW-278-R1

**Entrada:** implementación v24.3.

**Esperado:** ningún placeholder de identidad debe sobrevivir después de `renderUnitOutput()`.

**Obtenido:** el wrapper ejecuta el render original y sincroniza inmediatamente el pie con los valores reales; si no hay valores, lo elimina. La función de auditoría compara `expected` contra `visible` sin atribuir datos ausentes.

**Estado:** PASA EN IMPLEMENTACIÓN · FUNCIONAL EN IMPLEMENTACIÓN.

## Pruebas reales pendientes
- Crear Unidad/Proyecto con ambos datos vacíos y comprobar visualmente que no aparece pie de identidad.
- Repetir con solo docente, solo IE y ambos datos reales.
- Recargar, reabrir y comprobar persistencia.
- Verificar móvil físico.
- Verificar que el DOCX real siga omitiendo campos ausentes y no haya regresión entre preview y exportación.

Hasta completar esas pruebas, no se considera PASA E2E.

## Riesgo de regresión
Medio. `format-v2.js` conserva el fallback legado, por lo que esta defensa depende del wrapper runtime v24.3. Debe incorporarse una prueba automática que falle si una vista documental presenta un valor no derivado de la Ficha Maestra/estado real.

## Impacto
- ICGD/IFR: mejora la trazabilidad y reduce afirmaciones institucionales no sustentadas.
- IUD/ISU: impacto indirecto positivo al evitar información confusa.
- Prelaunch: reduce un defecto, pero no modifica el gate global ni compensa bloqueantes S0/S1 pendientes.

No se calculan ISU, IFR ni Prelaunch Score definitivos sin evidencia real.

## Gate V5
DocenteDigital continúa NO APROBADA para V1.0. Permanecen pendientes E2E Docente/Director, usuarios reales, móvil físico, Word/PDF/impresión, 100 generaciones/anti-alucinación, autoguardado/restore, seguridad/aislamiento, privacidad, continuidad sin IA, año escolar completo, escala y pilotos.