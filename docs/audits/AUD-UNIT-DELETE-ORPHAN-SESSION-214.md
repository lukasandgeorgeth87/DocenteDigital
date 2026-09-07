# AUD-UNIT-DELETE-ORPHAN-SESSION-214

## Resumen

**Módulo:** Unidad/Proyecto → Sesión → Persistencia/Recuperación

**Estado:** NO PASA

**Clasificación funcional:** ROTA la integridad referencial Unidad→Sesión después de eliminar la unidad fuente; PARCIALMENTE FUNCIONAL la recuperación aislada de la unidad; FUNCIONAL de forma limitada la reapertura de la última sesión.

**Severidad:** S1 CRÍTICO — bloqueante V5.

## Especificaciones obligatorias aplicadas conjuntamente

- **V2:** exige trazabilidad PROGRAMACIÓN → UNIDAD/PROYECTO → SESIONES → ACTIVIDADES → EVIDENCIAS → EVALUACIÓN → REGISTRO y que las sesiones mantengan relación con la unidad original.
- **V3:** no aprueba una función porque responda o muestre datos; exige conservar información, recuperarla y mantener trazabilidad documental.
- **V4:** exige borrado seguro, recuperación y continuidad del trabajo sin hacer pensar al usuario en la arquitectura interna.
- **V5:** exige crear/editar/eliminar/recuperar documentos y demostrar el recorrido Docente E2E sin pérdida de datos ni relaciones; una cadena esencial rota bloquea V1.0.
- **Núcleo IA:** exige herencia de significado Unidad/Proyecto → Sesiones → Materiales → Evaluación → Registro hasta que el usuario lo cambie expresamente.

No se aplica en este hallazgo ninguna norma externa MINEDU/UGEL/legal cuya vigencia deba declararse; la comprobación es de arquitectura, persistencia, trazabilidad y UX contra las especificaciones internas obligatorias.

## Prueba principal

**ID:** AUD-UNIT-DELETE-ORPHAN-SESSION-214-A

**Entrada:**
1. Crear y guardar una Unidad/Proyecto U.
2. Crear una sesión S desde una actividad de U.
3. Confirmar que S conserva `unitId = U.id` y `unitTitle`.
4. Eliminar U desde “Mis unidades/proyectos”.
5. Desde Inicio, usar “Continuar mi trabajo”.

**Resultado esperado:** La aplicación debe preservar explícitamente la integridad documental. Una política válida sería bloquear la eliminación mientras existan documentos dependientes, o mover U y sus relaciones a papelera de forma atómica y reversible. “Continuar” nunca debe abrir silenciosamente una sesión cuya unidad fuente ya no existe en el conjunto activo.

**Resultado obtenido:** `buildSession()` persiste la sesión como `state.lastSession` con `unitId` y `unitTitle`. `deleteUnit(id)` elimina exclusivamente U de `state.units` y no comprueba ni limpia `state.lastSession` cuando `lastSession.unitId === id`. Después, `continueWork()` prioriza incondicionalmente `state.lastSession`, por lo que puede reabrir S aunque la unidad U ya haya sido eliminada. La sesión sigue pudiendo mostrarse, descargarse y compartirse como si su relación de origen siguiera vigente.

**Evidencia:** `app.js` productivo: `buildSession()` asigna `unitId` y luego `state.lastSession=session; save()`. `deleteUnit()` filtra únicamente `state.units`. `continueWork()` evalúa primero `state.lastSession`. `downloadSessionWord()` y `shareSession()` también usan directamente `state.lastSession`.

**PASA/NO PASA:** **NO PASA**.

**Severidad:** **S1 CRÍTICO**.

**Acción correctiva:** definir y aplicar una política de integridad referencial y borrado reversible para documentos relacionados. No basta con ocultar la sesión o borrar `lastSession`; debe preservarse el historial y sus relaciones.

## Prueba de recuperación

**ID:** AUD-UNIT-DELETE-ORPHAN-SESSION-214-B

**Entrada:** U → crear S → eliminar U → observar estado → restaurar U mediante la protección de recuperación.

**Resultado esperado:** la restauración debe reponer el mismo documento fuente y validar de forma explícita que las relaciones `unitId` de los documentos dependientes vuelven a resolver correctamente, sin sustituirlos por otra unidad ni por un ejemplo.

**Resultado obtenido:** `storage-recovery-v26.js` crea una copia recuperable de la **unidad** y al restaurar la reintroduce en `current.units` conservando su ID. Esto puede volver a hacer resoluble la referencia de S si la copia sigue disponible, pero la guarda no audita documentos dependientes ni maneja la relación de manera atómica. Mientras U está eliminada, S permanece activa y huérfana. Además, la recuperación de borrado usa actualmente un único slot, problema ya documentado por AUD-UNIT-DELETE-SINGLE-BACKUP-OVERWRITE-210.

**PASA/NO PASA:** **NO PASA** como política completa de integridad y recuperación relacional.

**Clasificación:** PARCIALMENTE FUNCIONAL la recuperación aislada; ROTA la integridad relacional durante el estado eliminado.

## Causa raíz

El modelo persistente trata `state.units` y `state.lastSession` como objetos independientes y no aplica reglas referenciales entre ellos. El borrado opera sobre la colección de unidades sin consultar documentos dependientes. “Continuar” utiliza la presencia de `lastSession` como criterio suficiente y no valida que `lastSession.unitId` siga apuntando a una unidad activa o recuperable.

El problema se agrava con el hallazgo 212: todavía no existe una colección persistente `sessions[]`, de modo que no hay una infraestructura documental capaz de enumerar todas las dependencias de una unidad antes de eliminarla.

## Riesgos

1. Una sesión puede mostrarse como vigente aunque su documento fuente ya no exista en el archivo activo.
2. El usuario puede descargar o compartir un documento cuyo origen no puede reabrirse ni auditarse desde la aplicación.
3. La siguiente generación puede seleccionar otra unidad o el fallback de ejemplo, creando discontinuidad semántica y documental.
4. La cadena Unidad → Sesiones → Evaluación → Registro queda sin garantía de integridad.
5. Una eliminación aparentemente local puede producir estados imposibles de explicar a un docente principiante.

## Corrección requerida

La solución adecuada debe coordinarse con el cierre del hallazgo 212 y, como mínimo:

1. disponer de documentos de sesión identificables y persistentes (`sessions[]` o repositorio equivalente);
2. mantener `unitId` estable y validable;
3. antes de eliminar una unidad, enumerar dependencias;
4. bloquear el borrado o mover **unidad + relaciones** a papelera de forma atómica;
5. usar `lastSessionId` solo como puntero a una sesión existente/no eliminada;
6. si el puntero queda inválido, no abrir silenciosamente contenido huérfano y ofrecer una explicación/recuperación simple;
7. restaurar manteniendo los mismos IDs y relaciones;
8. incluir doble clic, recarga e interrupción en las pruebas.

No se aplicó una corrección de runtime en esta ejecución: borrar también `state.lastSession` sería destructivo y contrario a la conservación histórica; permitir la sesión huérfana también es incorrecto. La solución depende del modelo persistente de sesiones y de una política documental explícita.

## Retest obligatorio

- U → S → eliminar U → Continuar: no debe existir documento huérfano silencioso.
- U → S → eliminar U → restaurar U → reabrir S: debe conservar exactamente el mismo vínculo.
- U con varias sesiones → eliminar/restaurar: todas las relaciones deben conservarse.
- Dos eliminaciones consecutivas y restauraciones independientes.
- Recarga/cierre entre cada paso.
- Repetir en móvil real cuando exista la batería física V5.

## Evidencia productiva de esta ejecución

La URL canónica `https://docente-digital.vercel.app/` respondió **HTTP 200 OK** y sirve `storage-recovery-v26.js` seguido de `app.js`. El `app.js` servido por producción también respondió **HTTP 200 OK** y contiene exactamente las rutas descritas: `deleteUnit()`, `buildSession()`, `continueWork()`, `downloadSessionWord()` y `shareSession()`.

La reproducción mediante navegador físico/automatizado con clics sigue **PENDIENTE** y no se sustituye por evidencia ficticia. El hallazgo se demuestra estáticamente contra el runtime real servido porque la transición de estado es determinista en el código ejecutado.

## Impacto en indicadores

- **IUD:** afecta integridad y trazabilidad documental.
- **ICGD:** afecta continuidad semántica Unidad→Sesión.
- **IFR:** la cadena de recuperación/documentos dependientes no puede considerarse funcional.
- **ISU:** no calcular puntuación definitiva; el usuario recibe un estado contradictorio difícil de comprender.
- **Prelaunch:** **BLOQUEADO** por S1 y por los demás bloqueantes/pruebas reales pendientes.

## Estado de lanzamiento

**DocenteDigital NO está lista para lanzamiento V1.0.** Este hallazgo no reemplaza ni reduce los S0/S1 anteriores y no habilita ningún cálculo definitivo de ISU/IFR/Prelaunch Score.