# AUD-SESSION-FORMALIZATION-UNCONDITIONAL-222

## Alcance
Auditoría estática del runtime productivo `app.js`, contrastada con `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`, `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`, `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`, `docs/AUDITORIA_PRELANZAMIENTO_V5.md` y `docs/NUCLEO_IA_DOCENTEDIGITAL.md`.

## Hallazgo principal

**ID:** AUD-SESSION-FORMALIZATION-UNCONDITIONAL-222-A  
**Entrada:** generar sesiones de distintas áreas y competencias, por ejemplo Comunicación oral, Arte y Cultura, Educación Física, Personal Social o una sesión de indagación en Ciencia y Tecnología.  
**Esperado:** la estructura de la sesión debe seleccionar procesos pedagógicos/didácticos coherentes con el área y competencia. El término y momento de **formalización** debe aparecer únicamente cuando corresponda al proceso didáctico elegido; en otras áreas debe usarse la fase pertinente (construcción, producción, contrastación, socialización, reflexión, etc.) sin imponer una plantilla única.  
**Obtenido:** `sessionHtml(session, forWord)` inserta de manera incondicional, para todas las áreas y competencias, el bloque fijo `<h3>Formalización / construcción del aprendizaje</h3>` y el mismo párrafo genérico. No existe una selección previa de proceso didáctico por área/competencia ni una condición que determine si la formalización corresponde.  
**Evidencia:** `app.js`, función `sessionHtml()`. La misma función ya conoce `session.area`, pero el bloque de formalización no depende de ese valor. `buildSession()` tampoco persiste un `didacticProcess`, `processModel` o equivalente.  
**Resultado:** **NO PASA**.  
**Severidad:** **S1 – CRÍTICO para calidad pedagógica / bloqueante V5 mientras Sesiones sea función esencial V1.0.**  
**Clasificación:** generación técnica de sesión = **PARCIALMENTE FUNCIONAL**; selección de proceso didáctico = **INEXISTENTE**; adecuación del momento de formalización = **ROTA/GENÉRICA**.

## Impacto
1. Una sesión puede aparentar estructura pedagógica válida aunque no haya seleccionado el proceso didáctico que corresponde al área y competencia.
2. El error se replica en pantalla y en exportación Word porque ambos reutilizan `sessionHtml()`.
3. Al usar una plantilla transversal fija se debilita la coherencia competencia → propósito → actividad → proceso didáctico → evidencia → instrumento.
4. El problema no se resuelve cambiando solo el título del bloque: falta un selector estructurado de procesos por área/competencia y una representación persistida en la entidad Sesión.

## Relación con las auditorías maestras
- V2 exige un Motor de Procesos Pedagógicos y Didácticos (MDPD) y que la aplicación opere como sistema pedagógico integral, no como generador textual.
- V5 exige que Sesiones sea una función esencial demostrada y que la cadena Programación → Unidad → Sesiones → Criterios → Evidencias → Instrumentos → Registro funcione sin aparentar funcionalidad.
- El Núcleo IA obliga a conservar significado y contexto entre Unidad/Proyecto y Sesión y a auditar coherencia antes de entregar.

## Acción recomendada
No aplicar un parche cosmético de renombrado. Implementar de forma estructurada:
1. `didacticProcessModel` seleccionado por nivel + área + competencia/tipo de actividad.
2. Secuencia de fases persistida dentro de la sesión.
3. Render condicional: usar `formalización` solo cuando corresponda; en caso contrario, emplear la fase pertinente al proceso elegido.
4. Golden tests por área que verifiquen que Comunicación, Matemática, Ciencia y Tecnología, Personal Social/DPCC/Ciencias Sociales, Arte, Educación Física, Religión, Inglés y EPT no reciben una misma secuencia genérica.
5. Retest de vista y exportación para asegurar que ambos usan exactamente el mismo modelo pedagógico persistido.

## Corrección aplicada
**Ninguna modificación de runtime.** Un cambio aislado del encabezado sería superficial y podría ocultar el defecto estructural. Se registra el hallazgo como evidencia auditable y se mantiene el bloqueante de prelaunch.
