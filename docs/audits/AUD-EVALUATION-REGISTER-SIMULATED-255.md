# AUD-EVALUATION-REGISTER-SIMULATED-255

## Resumen

**Hallazgo:** el módulo Evaluación/Registro muestra superficies que aparentan funcionalidad, pero el runtime productivo no demuestra creación real de evaluación, persistencia del registro ni trazabilidad estudiante → competencia → criterio → evidencia → valoración → retroalimentación.

**Severidad:** S1 CRÍTICO — bloquea el tramo Evaluación → Registro del recorrido Docente V5.

**Clasificación global del módulo:** SIMULADA / ROTA.

## Especificaciones obligatorias aplicadas

- V2 exige evaluación por competencias y que el Registro Auxiliar recupere estudiantes, áreas, competencias, criterios, evidencias, periodos y valoraciones; además debe editar, guardar, recuperar, exportar y visualizar progreso.
- V3 establece que una función no aprueba por aparecer o producir texto; exige evidencia funcional real. También prohíbe convertir mecánicamente valoraciones en promedios y exige que el registro retroalimente la planificación.
- V4 fija para registrar evaluación una ruta de 2–4 pasos y exige simplicidad, guardado y recuperación.
- V5 incorpora Evaluación e instrumentos y Registro auxiliar como funciones esenciales de V1.0 y exige el recorrido Perfil IE → Programación → Unidad/Proyecto → Sesiones → Materiales → Evaluación → Registro → Seguimiento.
- Núcleo IA exige heredar significado y contexto hasta Evaluación y Registro.

No se aplicó ni declaró vigente ninguna norma externa en este hallazgo; por ello no fue necesario afirmar vigencia normativa MINEDU/UGEL.

---

## AUD-EVAL-255-A — Crear evaluación de Unidad/Proyecto

**Entrada:** abrir Evaluación → Evaluación de unidad/proyecto → seleccionar idioma y tipo → pulsar “Crear evaluación”.

**Resultado esperado:** construir una evaluación relacionada con la unidad/sesión activa, grado(s), área(s), competencia(s), criterios y evidencias; respetar tipo e idioma; mostrar resultado revisable y permitir guardarlo.

**Resultado obtenido:** `showEvaluation('unit')` inserta un formulario visual con selectores de Idioma y Tipo y un botón `✨ Crear evaluación`, pero dicho botón no tiene `onclick`, listener ni controlador asociado. La función no consulta `activeUnitId`, `lastSession`, grado, área, competencia, criterio o evidencia; tampoco crea ni persiste objeto de evaluación.

**Evidencia:** `app.js`, función `showEvaluation(kind)`.

**Resultado:** NO PASA.

**Clasificación:** ROTA / SIMULADA.

**Severidad:** S1 CRÍTICO.

**Acción correctiva:** implementar modelo de evaluación real vinculado a unidad/sesión y perfil semántico; generar ítems/desempeños/instrumento pertinentes; guardar el artefacto y probar trazabilidad, idioma, tipo, multigrado, recarga y exportación.

---

## AUD-EVAL-255-B — Registro de evaluación

**Entrada:** abrir Evaluación → Registro de evaluación → seleccionar un nivel de logro.

**Resultado esperado:** escoger o recuperar estudiante, competencia, criterio y evidencia; registrar valoración con contexto y periodo; guardar, recuperar y alimentar seguimiento/progreso sin promedio mecánico.

**Resultado obtenido:** la vista contiene únicamente un `<select>` AD/A/B/C con B preseleccionado. No existe identificación de estudiante, competencia, criterio, evidencia, periodo ni retroalimentación. El cambio del select no actualiza `state`, no ejecuta `save()` y no existe colección persistente de registros.

**Evidencia:** `app.js`, rama `kind==='register'` de `showEvaluation` y modelo global de `state`, que solo mantiene modo, nivel, tipo IE, grados, áreas, lengua, unidades, unidad activa y última sesión.

**Resultado:** NO PASA.

**Clasificación:** SIMULADA.

**Severidad:** S1 CRÍTICO, absorbida por el hallazgo principal.

**Acción correctiva:** modelar registro estructurado por estudiante + competencia + criterio + evidencia + periodo + valoración + retroalimentación + procedencia; persistir y recuperar; conectar con seguimiento y próximas decisiones pedagógicas.

---

## AUD-EVAL-255-C — Conclusiones descriptivas

**Entrada:** abrir “Conclusiones descriptivas SIAGIE” desde cualquier contexto que no sea Matemática/Resuelve problemas de cantidad o con un estudiante/valoración distintos.

**Resultado esperado:** recuperar datos reales del estudiante y de sus evidencias/valoraciones, proponer una conclusión contextualizada y mantener la decisión final en el docente.

**Resultado obtenido:** la interfaz devuelve siempre los valores hardcodeados `Competencia: Resuelve problemas de cantidad`, `Nivel: B` y una conclusión fija. Los botones `Aprobar`, `Corregir` y `Copiar para SIAGIE` tampoco tienen acciones asociadas en el HTML inyectado.

**Evidencia:** `app.js`, rama final de `showEvaluation(kind)`.

**Resultado:** NO PASA.

**Clasificación:** SIMULADA / potencialmente pedagógicamente incorrecta.

**Severidad:** S1 CRÍTICO.

**Acción correctiva:** no generar conclusión sin estudiante, competencia, periodo y evidencias reales; diferenciar dato real y propuesta IA; implementar revisión/corrección/copiar solo después de pruebas funcionales y guardas anti-invención.

---

## Causa raíz

El módulo fue implementado como demostración de interfaz mediante `innerHTML`, no como flujo de dominio. No existe un modelo persistente de evaluaciones ni registros, no hay relaciones con estudiantes/criterios/evidencias, y los botones principales carecen de lógica funcional.

## Evidencia en producción

El recurso productivo `https://docente-digital.vercel.app/app.js` respondió HTTP 200 y contiene la misma función `showEvaluation(kind)` descrita arriba. Por tanto, el defecto está desplegado en producción y no es solo una diferencia del repositorio.

## Corrección aplicada en esta ronda

No se modificó el runtime. Un parche superficial para hacer clic en el botón sin implementar modelo, persistencia y trazabilidad produciría una falsa validación contraria a V3/V5. La corrección requiere trabajo funcional de dominio y pruebas reales.

## Riesgo de regresión

ALTO. Evaluación y Registro se conectan con sesión, estudiante, competencias, evidencias, conclusiones descriptivas, seguimiento, persistencia y futuros reportes. Debe implementarse detrás de pruebas automatizadas y fixtures pedagógicos controlados.

## Impacto

- **IUD:** negativo; el recorrido Docente se interrumpe en Evaluación/Registro.
- **ICGD:** negativo; no existe continuidad criterio/evidencia → valoración → seguimiento.
- **IFR:** no calcular definitivamente; funcionalidad crítica sin evidencia real.
- **ISU:** no calcular definitivamente; una interfaz sencilla que no funciona no puede considerarse simple de uso.
- **Prelaunch:** bloqueado por S1 y por incumplimiento del recorrido V5.

## Estado de lanzamiento

**NO APROBADA PARA LANZAMIENTO V1.0.**

Pruebas físicas de dispositivos, Word/PDF físico, 100 generaciones, restore real, seguridad real, año completo, concurrencia y pilotos permanecen PENDIENTES hasta ejecutarse realmente.