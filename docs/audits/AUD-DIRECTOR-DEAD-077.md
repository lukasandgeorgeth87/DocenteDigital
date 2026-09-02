# AUD-DIRECTOR-DEAD-077 — Panel Director con acciones visibles sin función

## Especificaciones aplicadas

- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

## Prueba

**ID:** AUD-DIRECTOR-DEAD-077  
**Módulo:** Carpeta Director / navegación principal  
**Entrada:** abrir `Espacio del Director` y activar las acciones visibles `Continuar`, `Crear`, `Abrir` y `Preguntar`.  
**Resultado esperado:** cada acción debe iniciar un flujo Director real y trazable, o quedar claramente deshabilitada/identificada como pendiente. Para V5 el recorrido debe poder demostrar Perfil IE → Diagnóstico → Gestión → PAT → Documentación → Evidencias → Informes → Archivo → Seguimiento.  
**Resultado obtenido:** en `index.html` los cuatro botones del panel Director se renderizan sin `onclick`, enlace, formulario o acción asociada. Aparecen visualmente activos pero no ejecutan flujo alguno.  
**Evidencia:** `index.html`, sección `#director`: `<button class="btn">Continuar</button>`, `<button class="btn alt">Crear</button>`, `<button class="btn alt">Abrir</button>`, `<button class="btn amber">Preguntar</button>`. La misma estructura está servida en producción.  
**Estado:** **NO PASA**  
**Severidad:** **S1 CRÍTICO** porque Carpeta Director forma parte del alcance esencial V1.0/V5 y la interfaz presenta acciones principales como disponibles cuando no tienen implementación.  
**Clasificación:** **INEXISTENTE / ROTA**.  

## Causa raíz

La superficie de Director fue maquetada antes de implementar sus flujos funcionales y no existe una guardia equivalente a la ya usada para otros módulos incompletos que retire o marque esas acciones como pendientes.

## Acción correctiva

No se implementa automáticamente lógica Director ficticia. La corrección segura recomendada es una de estas dos:

1. deshabilitar temporalmente los cuatro botones y marcarlos `Próximamente` hasta que exista el flujo real; o
2. implementar primero un flujo Director mínimo pero completo y trazable, comenzando por Ficha Maestra/Diagnóstico y reutilización de datos.

No debe conectarse ningún botón a plantillas que inventen hechos, responsables, acuerdos, normas, competencias del director o correlativos.

## Evidencia posterior de esta ejecución

Se confirmó que la producción actual responde HTTP 200 y que el deployment vigente está en estado `READY`; esto **no convierte** las funciones Director en funcionales.

## Riesgo de regresión

Alto si se intenta resolver mediante `alert()`, texto fijo o plantillas simuladas: V3 prohíbe aprobar una función porque responda o produzca texto. Mantener pruebas E2E del Director como gate obligatorio.

## Impacto en indicadores

- **IUD:** negativo; acciones principales no completan tareas.
- **ICGD:** negativo; no existe flujo directivo demostrable.
- **IFR:** no puede cerrarse para Director.
- **ISU:** no calcular definitivo; un botón que parece activo y no hace nada incumple claridad y simplicidad.
- **Prelaunch:** bloqueante V5 permanece abierto.

## Normativa

Este hallazgo es funcional/UX y no requiere declarar ninguna norma educativa vigente. No se aplicó ni citó normativa externa sin verificación oficial.

## Gate

**DocenteDigital NO está aprobada para lanzamiento V1.0.** Permanecen pendientes las pruebas reales de Director E2E y los demás bloqueantes V5.