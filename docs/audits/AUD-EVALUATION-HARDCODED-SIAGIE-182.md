# AUD-EVALUATION-HARDCODED-SIAGIE-182

## Alcance
Auditoría ejecutable acumulativa de DocenteDigital conforme a V2 + V3 + V4 + V5 + Núcleo IA.

## ID de prueba
**AUD-EVALUATION-HARDCODED-SIAGIE-182**

## Módulo
Carpeta Docente → Evaluación → Registro / Evaluación de unidad-proyecto / Conclusiones descriptivas SIAGIE.

## Entrada
1. Configurar cualquier perfil docente válido.
2. Abrir `Evaluación`.
3. Pulsar `Registrar evaluación`, `Evaluación de unidad/proyecto` y `Conclusiones SIAGIE`.
4. Contrastar lo mostrado con unidad/sesión/criterio/evidencia/estudiante previamente existentes.

## Resultado esperado
Conforme a V2/V3/V5, Evaluación debe reutilizar la trazabilidad real:

`Estudiante → Competencia → Criterio → Evidencia → Valoración → Retroalimentación → Progreso`.

Debe recuperar estudiantes, competencias, criterios y evidencias existentes; permitir guardar/editar/recuperar; una conclusión descriptiva debe derivarse de evidencias reales y no inventar competencia ni nivel de logro. La evaluación de unidad/proyecto debe generar un instrumento/tarea real y verificable.

## Resultado obtenido
En `app.js`, `showEvaluation(kind)` no consulta `state.lastSession`, unidades, criterios, evidencias ni estudiantes:

- `register`: muestra únicamente un selector AD/A/B/C con **B preseleccionado**, sin estudiante, competencia, criterio, evidencia, guardar ni recuperación.
- `unit`: muestra idioma y tipo, pero el botón `✨ Crear evaluación` no tiene acción asociada.
- `siagie`: presenta siempre datos hardcodeados: **Competencia: Resuelve problemas de cantidad**, **Nivel: B** y una conclusión genérica, independientemente del contexto real. Los botones `Aprobar`, `Corregir` y `Copiar para SIAGIE` tampoco tienen acción asociada.

La misma implementación fue confirmada en producción mediante respuesta HTTP 200 de `https://docente-digital.vercel.app/app.js`.

## Evidencia
Repositorio `main`:

```js
function showEvaluation(kind){
  const p=byId('evaluationPanel');p.classList.remove('hidden');
  if(kind==='register')p.innerHTML=`<h2>📋 Registro de evaluación</h2><p>Usa criterios y evidencias ya registrados.</p><label>Nivel de logro<select><option>AD</option><option>A</option><option selected>B</option><option>C</option></select></label>`;
  else if(kind==='unit')p.innerHTML=`...<button class="btn">✨ Crear evaluación</button>`;
  else p.innerHTML=`<h2>📝 Conclusiones descriptivas SIAGIE</h2><div class="document"><p><b>Competencia:</b> Resuelve problemas de cantidad</p><p><b>Nivel:</b> B</p><p><b>Conclusión propuesta:</b> ...</p></div><p><button class="btn">✓ Aprobar</button> <button class="btn alt">✏️ Corregir</button> <button class="btn ghost">📋 Copiar para SIAGIE</button></p>`;
}
```

Producción: `/app.js` respondió HTTP 200 y contiene la misma lógica.

## PASA / NO PASA
**NO PASA**.

## Clasificación funcional
- Registrar evaluación: **SIMULADA / PARCIALMENTE FUNCIONAL en superficie**.
- Evaluación de unidad/proyecto: **ROTA / SIMULADA**.
- Conclusiones SIAGIE: **SIMULADA y pedagógicamente no confiable**.
- Trazabilidad Evaluación → Registro → Seguimiento: **INEXISTENTE** en este flujo.

## Severidad
**S1 CRÍTICO — bloqueante V5.**

### Justificación
V3 define S1 para documento pedagógicamente incorrecto o competencia falsa. La pantalla puede presentar una competencia y un nivel de logro no derivados del estudiante ni de evidencias reales, generando una conclusión que aparenta ser utilizable para SIAGIE. Además, Evaluación/Registro es función esencial congelada para V1.0 en V5.

## Causa raíz
`showEvaluation()` es una demostración HTML estática sin modelo de evaluación ni relaciones persistentes con estudiantes, sesiones, criterios o evidencias.

## Acción correctiva requerida
1. Crear modelo persistente de estudiantes/evidencias/valoraciones con IDs estables.
2. Enlazar `sessionId`, `unitId`, competencia, criterio, evidencia y estudiante.
3. Eliminar valores por defecto que aparenten resultados reales (por ejemplo B preseleccionado) cuando no exista evidencia.
4. Generar conclusiones solo desde evidencias y valoraciones registradas, marcándolas como propuesta pendiente de decisión profesional.
5. Implementar guardar, editar, recuperar, buscar y trazabilidad hacia Registro/Seguimiento.
6. Mantener bloqueada o rotulada como `En desarrollo` toda acción todavía simulada, en lugar de mostrar una conclusión ficticia utilizable.
7. Ejecutar pruebas de campos vacíos, múltiples estudiantes, multigrado, interrupciones, recarga y doble clic.

## Corrección aplicada en esta pasada
**No se implementó el motor de evaluación**, porque requeriría decisiones de arquitectura de datos, persistencia y reglas pedagógicas que no deben simularse mediante un parche superficial.

## Evidencia posterior requerida
- E2E: Unidad → Sesión → Criterio → Evidencia → Estudiante → Valoración → Conclusión → Registro → Seguimiento.
- Recarga/cierre/recuperación sin pérdida.
- Prueba multigrado.
- Prueba de que una conclusión no aparece sin evidencia.
- Prueba de que competencia/nivel corresponden al estudiante y contexto seleccionado.

## Riesgo de regresión
Alto si se corrige únicamente la UI sin modelo persistente: se podría mantener una apariencia funcional con datos no trazables.

## Impacto en indicadores
- IUD: negativo (obliga a reingresar o trabajar fuera de la app).
- ICGD: crítico (rompe criterio ↔ evidencia ↔ valoración ↔ conclusión).
- IFR: no aprobable para este flujo.
- ISU: no calculable como definitivo; la simplicidad visual no compensa una acción pedagógicamente falsa.
- Prelaunch: **bloqueante**.

## Gate V5
**NO PASA. DocenteDigital no puede declararse lista para V1.0 mientras este flujo esencial presente resultados hardcodeados o no trazables.**
