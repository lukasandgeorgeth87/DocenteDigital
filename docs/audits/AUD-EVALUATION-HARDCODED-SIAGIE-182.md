# AUD-EVALUATION-HARDCODED-SIAGIE-182 — REVISADO

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
4. Contrastar el comportamiento final de runtime, no solo la implementación base de `app.js`.

## Resultado esperado
Evaluación debe reutilizar trazabilidad real:

`Estudiante → Competencia → Criterio → Evidencia → Valoración → Retroalimentación → Progreso`.

Debe recuperar estudiantes, competencias, criterios y evidencias existentes; guardar/editar/recuperar; y generar conclusiones únicamente desde evidencias reales.

## Resultado obtenido revisado
`app.js` contiene una implementación base demostrativa con datos hardcodeados: selector AD/A/B/C con B preseleccionado y una conclusión SIAGIE fija para “Resuelve problemas de cantidad”. Sin embargo, esa no es la conducta final cuando termina de cargar la cadena estable de módulos.

`schedule-prompt-v6.js` carga `prototype-data-guard-v41.js`. Esa guardia reemplaza `window.showEvaluation` y evita presentar dichos datos como reales:

- Registro: muestra que aún no está conectado a estudiantes, criterios ni evidencias persistentes.
- Evaluación de unidad/proyecto: informa que aún no existe conexión E2E competencia → criterio → evidencia → instrumento.
- Conclusiones SIAGIE: no muestra competencia, nivel ni conclusión ficticia; declara que no se propondrán sin estudiante, competencia, criterio, evidencia y valoración registrados.
- Los botones de Evaluación se anotan explícitamente como `en desarrollo` y la tarjeta de Inicio también advierte que el módulo no está conectado a evidencias reales.

Por tanto, el hallazgo original era correcto sobre la ausencia del motor de evaluación, pero incompleto al afirmar que la superficie productiva final necesariamente exponía los datos hardcodeados de `app.js`.

## Evidencia
Cadena runtime:

`schedule-prompt-v6.js` → `prototype-data-guard-v41.js`.

La guardia contiene:

```js
window.showEvaluation=function(kind){
  const p=by('evaluationPanel');
  ...
  p.innerHTML=`<h2>${titles[kind]||'Evaluación'}</h2>${notice('Función en desarrollo',detail)}`;
};
```

y además marca los botones de `showEvaluation(...)` como función en desarrollo.

Producción respondió HTTP 200 para la aplicación y sirve la misma cadena de módulos.

## PASA / NO PASA
**NO PASA V5** como módulo funcional de Evaluación/Registro/Seguimiento.

La verdad de superficie UX **PASA PARCIALMENTE** porque la guardia evita mostrar valoraciones o conclusiones ficticias como utilizables cuando carga correctamente.

## Clasificación funcional revisada
- Registrar evaluación: **INEXISTENTE funcionalmente / superficie protegida**.
- Evaluación de unidad/proyecto: **INEXISTENTE funcionalmente / superficie protegida**.
- Conclusiones SIAGIE: **INEXISTENTE funcionalmente / superficie protegida**.
- Trazabilidad Evaluación → Registro → Seguimiento: **INEXISTENTE**.
- Protección contra datos prototipo: **FUNCIONAL/PARCIAL**, dependiente de que la cadena de módulos cargue sin fallo.

## Severidad
**S1 CRÍTICO — bloqueante V5**, por ausencia del flujo esencial de evaluación y trazabilidad, no por exposición final confirmada de una conclusión ficticia.

## Causa raíz
El motor real de evaluación todavía no existe. `app.js` conserva contenido demostrativo heredado, mientras una guardia posterior lo neutraliza para mantener verdad de superficie. Esta arquitectura deja deuda técnica y dependencia del orden/carga de módulos.

## Acción correctiva requerida
1. Crear modelo persistente de estudiantes/evidencias/valoraciones con IDs estables.
2. Enlazar `sessionId`, `unitId`, competencia, criterio, evidencia y estudiante.
3. Generar conclusiones solo desde evidencias y valoraciones registradas, siempre como propuesta editable por el profesional.
4. Implementar guardar, editar, recuperar, buscar y trazabilidad hacia Registro/Seguimiento.
5. Retirar del `app.js` base los valores demostrativos hardcodeados una vez exista el flujo real, para no depender de una guardia posterior.
6. Mantener `En desarrollo` mientras el motor no exista.
7. Ejecutar E2E multigrado y pruebas de recarga, doble clic, ausencia de evidencias y recuperación.

## Corrección aplicada en esta pasada
Se corrigió únicamente este documento de auditoría para reflejar el runtime final observado. No se modificó la lógica productiva.

## Evidencia posterior requerida
- E2E: Unidad → Sesión → Criterio → Evidencia → Estudiante → Valoración → Conclusión → Registro → Seguimiento.
- Recarga/cierre/recuperación sin pérdida.
- Prueba multigrado.
- Prueba de que una conclusión no aparece sin evidencia.
- Prueba de que competencia/nivel corresponden al estudiante y contexto seleccionado.
- Prueba de fallo de carga de módulos que confirme que no reaparecen resultados ficticios utilizables.

## Gate V5
**NO PASA. DocenteDigital no puede declararse lista para V1.0 mientras Evaluación/Registro/Seguimiento siga inexistente de extremo a extremo.**
