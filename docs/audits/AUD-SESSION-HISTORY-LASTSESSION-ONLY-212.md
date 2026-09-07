# AUD-SESSION-HISTORY-LASTSESSION-ONLY-212

## Resumen

DocenteDigital conserva las unidades como colección (`state.units`), pero las sesiones no se almacenan en una colección equivalente. El runtime productivo usa únicamente `state.lastSession`. Cada nueva generación reemplaza la sesión anterior como único objeto recuperable. Esto impide demostrar historial, búsqueda, recuperación, edición, relación uno-a-muchos Unidad→Sesiones, registro/evaluación trazable y la función requerida de crear y guardar todas las sesiones de una unidad.

## Especificaciones aplicadas

- V2: la generación articulada exige PROGRAMACIÓN → UNIDAD/PROYECTO → SESIONES → ACTIVIDADES → EVIDENCIAS → EVALUACIÓN → REGISTRO; una sesión no debe quedar desconectada. La función “Crear sesiones de toda la unidad” debe guardar cada sesión individualmente y mantener relación con la unidad original.
- V3: una función solo aprueba si responde, conserva datos, se recupera, se edita, se exporta, no pierde información y mantiene trazabilidad.
- V4: continuar donde quedó, recientes, buscador, guardado automático y recuperación del trabajo.
- V5: Carpeta Docente V1.0 exige Sesiones y “guardar, recuperar, editar y exportar”; el E2E obligatorio es Perfil IE → Programación → Unidad/Proyecto → Sesiones → Materiales → Evaluación → Registro → Seguimiento.
- Núcleo IA: el significado aprobado debe heredarse Unidad/Proyecto → Sesiones → Materiales → Evaluación → Registro.

No se utiliza normativa externa MINEDU/UGEL para declarar este hallazgo; por tanto no se formula aquí ninguna afirmación de vigencia normativa externa.

## Evidencia técnica

En `app.js` el estado inicializa:

```js
state.units=Array.isArray(state.units)?state.units:[];
state.activeUnitId=state.activeUnitId||null;
state.lastSession=state.lastSession||null;
```

No existe inicialización equivalente de `state.sessions` como colección.

`buildSession()` crea un nuevo objeto con `id`, `unitId` y demás campos, pero termina con:

```js
state.lastSession=session;
save();
return session;
```

La nueva sesión reemplaza a la anterior como única sesión persistida accesible por la implementación base.

`continueWork()` también solo puede recuperar `state.lastSession`:

```js
if(state.lastSession){go('session');renderSessionOutput(state.lastSession);}
```

`downloadSessionWord()` y `shareSession()` dependen igualmente de `state.lastSession`.

No se encontró en la implementación base una colección `state.sessions`, una función para listar sesiones guardadas por unidad, recuperación por `session.id`, edición de una sesión histórica, papelera de sesiones, buscador de sesiones ni vínculo persistente de muchas sesiones con una unidad.

La producción canónica consultada en esta ejecución sirve `/app.js` con HTTP 200 y contiene exactamente este patrón `state.lastSession`; por tanto el hallazgo afecta al runtime actualmente desplegado y no es solo código muerto del repositorio.

## Prueba principal

**ID:** AUD-SESSION-212-A  
**Módulo:** Carpeta Docente / Sesiones / Persistencia y trazabilidad  
**Entrada:** crear una unidad con varias actividades; generar sesión A para la actividad 1; generar sesión B para la actividad 2; intentar reabrir A desde la app y comprobar que ambas permanezcan ligadas a la unidad.  
**Resultado esperado:** A y B quedan guardadas individualmente, recuperables por ID, vinculadas a `unitId`, visibles en historial/listado y disponibles para continuar, editar, exportar y alimentar evaluación/registro.  
**Resultado obtenido:** la implementación persiste únicamente `state.lastSession`; al crear B, A deja de ser la sesión recuperable por la ruta principal. No existe colección/listado de sesiones históricas.  
**Evidencia:** `app.js` inicializa `lastSession`; `buildSession()` asigna `state.lastSession=session`; `continueWork()`, descarga y compartir leen solo ese objeto. La producción canónica sirve el mismo código.  
**PASA/NO PASA:** NO PASA.  
**Severidad:** S1 CRÍTICO.  
**Clasificación:** creación individual de sesión = PARCIALMENTE FUNCIONAL; persistencia de última sesión = FUNCIONAL de forma limitada; historial de sesiones = INEXISTENTE; relación uno-a-muchos Unidad→Sesiones = INEXISTENTE/NO DEMOSTRADA; recuperación de sesiones anteriores = ROTA/INEXISTENTE.

## Prueba de “Crear sesiones de toda la unidad”

**ID:** AUD-SESSION-212-B  
**Entrada:** abrir una unidad con múltiples actividades y solicitar generar todas sus sesiones.  
**Resultado esperado:** leer la unidad completa, desarrollar todas las sesiones, guardar cada una individualmente, conservar títulos/áreas/temporalización, mantener `unitId` y permitir descargar/recuperar el conjunto.  
**Resultado obtenido:** la superficie base conduce a crear sesiones por actividad; el modelo de datos solo admite una `lastSession` recuperable y no contiene una colección persistente capaz de conservar todo el conjunto.  
**PASA/NO PASA:** NO PASA.  
**Severidad:** S1 CRÍTICO.  
**Clasificación:** INEXISTENTE como flujo E2E demostrado conforme V2/V5.

## Causa raíz

El prototipo evolucionó con persistencia de unidades como colección, pero la sesión quedó modelada como “documento actual/último documento” y no como entidad documental persistente. El resto de módulos no puede construir trazabilidad estable sobre una entidad que no tiene repositorio propio.

## Acción correctiva recomendada

No corregir agregando solo `state.sessions=[]` sin migración y UX. La corrección debe ser pequeña por fases pero coherente:

1. Introducir esquema versionado para `sessions[]` con `id`, `unitId`, `activityOrder/activityId`, `createdAt`, `updatedAt`, `revision`, estado y snapshot de contexto aprobado.
2. Migrar de forma segura `lastSession` existente a `sessions[]` cuando corresponda, sin duplicar ni perder el objeto previo.
3. Mantener `lastSessionId` solo como puntero de “continuar”, no como almacenamiento único.
4. Crear listado “Mis sesiones” por unidad, recientes y buscador; permitir abrir por ID.
5. Añadir edición con historial o revisión y política explícita para no modificar documentos históricos silenciosamente.
6. Implementar eliminación segura/papelera independiente para sesiones.
7. Hacer que Materiales, Evaluación y Registro referencien `sessionId` y `unitId` reales.
8. Implementar “Crear sesiones de toda la unidad” como operación que genere y persista N sesiones sin sobrescribir las anteriores, con control de doble clic/idempotencia.
9. Agregar pruebas automatizadas: crear A+B+C → recargar → recuperar A/B/C → editar B → exportar A → eliminar/restaurar C → confirmar vínculos a la unidad.

## Corrección aplicada en esta ejecución

No se modificó runtime. Corregir el modelo documental de sesiones afecta persistencia, migración, edición, evaluación, registro y trazabilidad, por lo que no es un cambio seguro de una sola línea. Se documenta como pendiente estructural y bloqueante V5.

## Evidencia posterior y producción

- Producción canónica `/app.js`: HTTP 200 durante esta ejecución.
- Último deployment observado antes de registrar este informe: `dpl_9H8eETY7NEYdA6KECuZ4Bxv2RMiL`, estado READY, target production, SHA `91ba384780923ad7de9db37b0de4c78d50a7507a`.
- Observabilidad Vercel, última hora: no se encontraron errores runtime. El defecto es silencioso de modelo/persistencia, no una caída HTTP.
- Tras publicar este informe deberá confirmarse el nuevo SHA/deployment READY y HTTP 200, sin considerar el hallazgo resuelto por ello.

## Riesgo de regresión

ALTO si se introduce una colección sin migración o se cambia la relación con unidades. Debe conservarse compatibilidad con usuarios que ya tienen `lastSession`, evitar duplicados en doble clic y no borrar sesiones al editar datos maestros.

## Impacto en indicadores/gate

- IUD: impacto alto; no existe historial documental completo de sesiones.
- ICGD: impacto alto; se rompe continuidad Unidad → Sesiones → Evaluación/Registro.
- IFR: impacto alto; una generación posterior puede desplazar la única sesión recuperable anterior.
- ISU: no calcular definitivo; “continuar donde quedó” solo cubre la última sesión y no historial real.
- Prelaunch: BLOQUEADO por S1 y por E2E Docente incompleto.

## Estado

**ABIERTO — S1 CRÍTICO — BLOQUEANTE V5.**

DocenteDigital no debe declararse lista para V1.0 mientras las sesiones no sean entidades persistentes, recuperables y trazables individualmente y mientras no se demuestre el flujo completo de todas las sesiones de una unidad.
