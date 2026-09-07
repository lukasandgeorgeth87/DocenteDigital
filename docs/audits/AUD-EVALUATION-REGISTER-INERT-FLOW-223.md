# AUD-EVALUATION-REGISTER-INERT-FLOW-223

## Resumen

**Módulo:** Carpeta Docente → Evaluación / Registro

**Estado:** NO PASA

**Severidad:** S1 CRÍTICO — bloqueante V5

**Clasificación:**
- acceso visual al módulo: FUNCIONAL;
- apertura de paneles: PARCIALMENTE FUNCIONAL;
- registro de evaluación: SIMULADO / INEXISTENTE como persistencia;
- creación de evaluación de unidad/proyecto: INEXISTENTE;
- conclusiones SIAGIE: SIMULADAS;
- aprobación/corrección/copia: INEXISTENTES;
- trazabilidad Sesión/Evidencia → Evaluación → Registro: ROTA / NO DEMOSTRADA.

## Especificaciones obligatorias aplicadas

V2 exige trazabilidad PROGRAMACIÓN → UNIDAD/PROYECTO → SESIONES → ACTIVIDADES → EVIDENCIAS → EVALUACIÓN → REGISTRO y establece que el Registro Auxiliar debe recuperar criterios/evidencias, permitir editar, guardar, recuperar y exportar.

V3 establece que una función no aprueba porque aparezca o responda; debe conservar datos, recuperarse, editarse, exportarse y mantener trazabilidad. También prohíbe convertir automáticamente el juicio profesional del docente en una operación mecánica.

V4 exige que Registrar evaluación pueda completarse en 2–4 pasos y que la interfaz sea simple, guiada y con acciones principales claras.

V5 incluye Evaluación e instrumentos y Registro auxiliar en el alcance esencial V1.0 y exige el E2E Perfil IE → Programación → Unidad/Proyecto → Sesiones → Materiales → Evaluación → Registro → Seguimiento.

Núcleo IA exige herencia de significado y contexto entre Sesiones → Materiales → Evaluación → Registro.

## Evidencia técnica

En `app.js`, `showEvaluation(kind)` genera tres interfaces:

1. `register`: inserta un `<select>` AD/A/B/C, pero no existe botón de Guardar, estudiante, criterio/evidencia vinculados, persistencia, recuperación ni escritura a una colección de registro.
2. `unit`: inserta un botón `✨ Crear evaluación` sin `onclick`, listener ni función asociada; por tanto, el botón principal no ejecuta creación alguna.
3. `siagie`: inserta botones `✓ Aprobar`, `✏️ Corregir` y `📋 Copiar para SIAGIE` sin `onclick`, listener ni funciones asociadas; la conclusión mostrada es un texto fijo de demostración, no derivado de evidencias persistidas.

El modelo global persistente contiene `units`, `activeUnitId` y `lastSession`, pero no se observa una estructura persistente equivalente para evaluaciones, registros por estudiante/evidencia o conclusiones aprobadas.

La producción canónica sirve actualmente la pantalla Evaluación con las tres tarjetas `Registrar evaluación`, `Evaluación de unidad/proyecto` y `Conclusiones SIAGIE`, por lo que el problema está expuesto al usuario final y no corresponde a código muerto.

## Pruebas

### AUD-EVAL-223-A — Registrar evaluación

**Entrada:** abrir Evaluación → Registrar evaluación → seleccionar AD/A/B/C.

**Resultado esperado:** identificar estudiante, competencia/criterio/evidencia correspondiente, registrar una valoración editable, guardar, recuperar y alimentar seguimiento/registro auxiliar.

**Resultado obtenido:** aparece únicamente un selector de nivel de logro; no existe acción de guardado ni estructura visible/persistente que vincule el dato a estudiante, criterio, evidencia, sesión o unidad.

**Evidencia:** `showEvaluation('register')` crea HTML estático con un `<select>` y sin acción persistente.

**PASA/NO PASA:** NO PASA.

**Severidad:** S1.

**Acción correctiva:** implementar entidad persistente de evaluación vinculada por IDs estables a estudiante, competencia, criterio, evidencia, sesión/unidad; guardar/editar/recuperar; y alimentar registro/seguimiento sin promedio mecánico.

### AUD-EVAL-223-B — Crear evaluación de unidad/proyecto

**Entrada:** abrir Evaluación → Evaluación de unidad/proyecto → escoger idioma/tipo → pulsar `✨ Crear evaluación`.

**Resultado esperado:** generar instrumento/evaluación contextualizada y vinculada a la unidad/proyecto vigente, respetando competencia, criterios, evidencias, grado, idioma/perfil lingüístico y dificultad.

**Resultado obtenido:** el botón renderizado no tiene manejador de evento ni función de creación asociada.

**Evidencia:** HTML generado por `showEvaluation('unit')` contiene `<button class="btn">✨ Crear evaluación</button>` sin `onclick`.

**PASA/NO PASA:** NO PASA.

**Severidad:** S1.

**Acción correctiva:** implementar flujo real y verificable; no sustituirlo por una plantilla fija. Debe heredar el snapshot documental aprobado y producir evidencia editable/persistente/exportable.

### AUD-EVAL-223-C — Conclusiones descriptivas SIAGIE

**Entrada:** abrir Evaluación → Conclusiones SIAGIE → intentar Aprobar / Corregir / Copiar.

**Resultado esperado:** proponer una conclusión a partir de evidencias reales y valoraciones del estudiante; permitir revisión profesional, corrección, aprobación explícita y copia segura sin afirmar datos inexistentes.

**Resultado obtenido:** se muestra una competencia, nivel B y conclusión fija; los botones Aprobar, Corregir y Copiar no tienen manejadores de evento ni lógica persistente.

**Evidencia:** `showEvaluation('siagie')` inyecta contenido estático y tres botones sin `onclick`.

**PASA/NO PASA:** NO PASA.

**Severidad:** S1.

**Acción correctiva:** derivar la propuesta únicamente de evidencias/criterios/valoraciones persistidas, marcar datos faltantes, conservar decisión final del docente y registrar trazabilidad de aprobación/corrección.

## Causa raíz

El módulo Evaluación existe principalmente como prototipo de interfaz y no como subsistema documental persistente. La UI comunica disponibilidad de acciones que no están conectadas a un modelo de datos, comandos de dominio ni persistencia.

## Corrección aplicada

No se modificó código funcional en esta auditoría. Agregar `onclick` aislados sería un parche cosmético y podría simular funcionalidad sin resolver la relación pedagógica y documental requerida por V2/V3/V5.

## Retest requerido

Después de implementar la corrección se debe probar:

- Unidad → Sesión → criterio/evidencia → Evaluación → Registro → Seguimiento;
- varios estudiantes y varias competencias;
- edición y recuperación tras recarga/cierre;
- doble clic;
- campos vacíos y caracteres especiales;
- EIB/monolingüe;
- multigrado;
- no promediar mecánicamente AD/A/B/C;
- conclusión descriptiva basada únicamente en evidencias reales;
- exportación y copia a SIAGIE cuando corresponda;
- móvil físico.

## Impacto en indicadores/gate

- **IUD/ICGD:** impacto negativo por pérdida de continuidad documental.
- **IFR:** no calcular definitivo; flujo esencial incompleto.
- **ISU:** no calcular definitivo; una ruta visual corta no compensa una acción principal inerte.
- **Prelaunch:** gate cerrado por S1 y por E2E Docente incompleto.

No se declara DocenteDigital lista para V1.0.
