# AUD-FOLLOWUP-155 — Seguimiento Docente inexistente en el recorrido productivo

## Alcance
Auditoría funcional de la etapa **Seguimiento** exigida por la Auditoría Maestra V2, la Adenda Ejecutable V3, la Auditoría de Simplicidad V4, la Auditoría de Prelanzamiento V5 y el Núcleo IA de DocenteDigital.

## ID de prueba
AUD-FOLLOWUP-155

## Módulo
Docente → Evaluación / Registro → Seguimiento del progreso

## Entrada
1. Completar Perfil de IE.
2. Acceder al recorrido Docente disponible en producción.
3. Llegar a Evaluación / Registrar evaluación.
4. Intentar continuar hacia seguimiento del estudiante, progreso, historial de valoraciones o decisiones posteriores basadas en evidencias.

## Resultado esperado
Debe existir una etapa funcional de seguimiento que recupere de forma trazable los datos reales del estudiante y permita observar su progreso a partir de competencia, criterios, evidencias, valoraciones y retroalimentaciones. Debe conservar la relación con Programación, Unidad/Proyecto, Sesiones y Evaluación.

V5 exige expresamente el recorrido E2E:

`Perfil IE → Programación → Unidad/Proyecto → Sesiones → Materiales → Evaluación → Registro → Seguimiento`.

V2 exige la cadena evaluativa:

`ESTUDIANTE → COMPETENCIA → CRITERIOS → EVIDENCIAS → VALORACIONES → RETROALIMENTACIONES → PROGRESO`.

El Núcleo IA exige que el significado heredado no se pierda hasta Evaluación y Registro y que los documentos/procesos posteriores mantengan coherencia con los datos ya aprobados.

## Resultado obtenido
En el `index.html` productivo no existe pantalla, tarjeta, botón, ruta ni navegación denominada Seguimiento o Progreso. El menú Docente visible termina en Evaluación y no ofrece continuidad posterior.

En `app.js` tampoco existe función, estado o entidad de seguimiento/progreso de estudiantes. El estado principal contiene configuración, `units` y `lastSession`, pero no una colección de progreso/seguimiento. Las búsquedas del repositorio por `seguimiento` y `progreso` no devolvieron implementación productiva.

Por tanto, después de Evaluación/Registro no existe una función que complete el último tramo obligatorio del E2E Docente de V5.

## Evidencia
- `index.html`: navegación principal disponible: Inicio, Mi planificación, Crear mi sesión, Materiales, Evaluación, Director y Configuración; no existe Seguimiento.
- `index.html`: la superficie Evaluación contiene Registrar evaluación, Evaluación de unidad/proyecto y Conclusiones SIAGIE; no existe una acción posterior de seguimiento/progreso.
- `app.js`: el modelo de estado no define seguimiento/progreso y no se encontró una función asociada.
- Búsqueda global del repositorio por `seguimiento` y `progreso`: sin implementación encontrada.

## PASA / NO PASA
**NO PASA**

## Clasificación funcional
**INEXISTENTE**

## Severidad
**S1 — CRÍTICO PARA PRELAUNCH V5**

Justificación: Seguimiento forma parte expresa del recorrido Docente extremo a extremo exigido por V5. Su ausencia impide demostrar el ciclo completo Evaluación → Registro → Seguimiento y, por tanto, bloquea la aprobación V1.0 aunque las pantallas previas abran correctamente.

## Causa raíz
La superficie Docente se ha implementado hasta Evaluación/Registro sin un modelo persistente de progreso del estudiante. No existe todavía una entidad que consolide valoraciones históricas y retroalimentación para observar evolución por competencia/criterio.

## Acción correctiva
Implementar una entidad persistente y trazable de seguimiento, vinculada como mínimo a:

- estudiante;
- IE y grado;
- competencia;
- criterio;
- evidencia;
- valoración;
- retroalimentación;
- periodo/fecha;
- unidad/sesión de procedencia;
- historial de cambios cuando corresponda.

La interfaz debe permitir consultar progreso sin volver a escribir datos, filtrar por estudiante/competencia/periodo y continuar desde Registro. Debe existir una vista simple para Modo Fácil y detalle adicional solo en Modo Experto.

## Pruebas posteriores obligatorias
1. Registrar varias evidencias de un estudiante en fechas distintas → abrir Seguimiento → comprobar orden y procedencia.
2. Dos estudiantes → comprobar aislamiento de sus registros.
3. Dos competencias → comprobar que no se mezclan valoraciones.
4. Recargar/cerrar/reabrir → comprobar persistencia.
5. Cambiar una Ficha Maestra → comprobar que históricos emitidos no se modifican retroactivamente.
6. Multigrado → comprobar filtros por grado y estudiante.
7. EIB/monolingüe → conservar perfil lingüístico correspondiente.
8. Evaluación → Registro → Seguimiento completo sin reingreso de información.
9. Buscador/archivo → localizar registros históricos cuando esas capas estén disponibles.
10. Prueba de año completo marzo–diciembre antes de cerrar V5.

## Corrección aplicada
No se modificó código funcional. La solución requiere modelo de datos, persistencia y diseño de seguimiento; simularlo con una tarjeta o texto prefijado sería contrario a V3/V5.

## Normativa externa
Este hallazgo no declara vigencia de ninguna norma MINEDU ni otra disposición externa. Se sustenta exclusivamente en las especificaciones internas obligatorias V2–V5 y Núcleo IA. Cualquier norma externa que se incorpore posteriormente deberá verificarse contra fuente oficial vigente antes de aplicarse.

## Riesgo de regresión
Alto si se implementa Seguimiento como estado aislado. Debe construirse sobre el modelo evaluativo definitivo para evitar duplicación de estudiantes, competencias, criterios y evidencias.

## Impacto en métricas
- IUD: pendiente; la ausencia impide completar el recorrido real.
- ICGD: afecta trazabilidad y continuidad de datos.
- IFR: bloquea el E2E Docente.
- ISU: no calcular definitivamente; una función inexistente no puede compensarse con facilidad de uso de pantallas previas.
- Prelaunch: bloqueante abierto.

## Gate
DocenteDigital **NO ESTÁ LISTA PARA LANZAR V1.0** mientras este tramo siga inexistente y continúen pendientes las demás pruebas reales esenciales de V5.
