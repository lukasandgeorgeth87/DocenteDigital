# AUD-SESSION-LEVEL-IETYPE-SNAPSHOT-DRIFT-217

## Alcance
Auditoría V4/V5 de trazabilidad Unidad/Proyecto → Sesión sobre el runtime canónico de DocenteDigital. No se simulan usuarios reales, backend, IA real ni pruebas físicas.

## Hallazgo
La unidad guarda un snapshot propio de `level` e `ieType`, pero `buildSession()` no los hereda de la unidad seleccionada. La sesión toma `level: state.level` e `ieType: state.ieType`, es decir, la configuración global vigente al momento de generar la sesión.

## Caso ejecutable
**ID:** AUD-SESSION-LEVEL-IETYPE-SNAPSHOT-DRIFT-217-A  
**Entrada:** crear y guardar una unidad U con `level = Primaria`, `ieType = Multigrado`; después modificar la configuración global a `level = Secundaria`, `ieType = Polidocente`; volver a seleccionar U y generar una sesión S.  
**Esperado:** S debe conservar el contexto documental de U (`Primaria`, `Multigrado`) o bloquear explícitamente la generación si el perfil actual es incompatible y exigir una decisión del docente. Nunca debe cambiar silenciosamente la procedencia pedagógica.  
**Obtenido:** `selectedActivity()` recupera correctamente U, pero `buildSession()` asigna `level: state.level` e `ieType: state.ieType`; por tanto S queda identificada como `Secundaria · Polidocente` aunque `unitId` y `unitTitle` correspondan a una unidad creada como `Primaria · Multigrado`. `sessionHtml()` imprime esos valores y usa `session.ieType` para decidir si aplica organización multigrado.  
**Evidencia:** `createUnitDemo()` conserva `level: state.level, ieType: state.ieType` dentro de U; posteriormente `buildSession()` vuelve a consultar el `state` mutable en lugar de `unit.level` / `unit.ieType`. El mismo código está servido por `/app.js` en producción.  
**Resultado:** NO PASA  
**Severidad:** S1 CRÍTICO  
**Clasificación:** Unidad guardada = FUNCIONAL/PARCIAL; vínculo `unitId` = PARCIAL; herencia histórica de nivel = ROTA; herencia histórica de tipo de IE = ROTA; trazabilidad Unidad→Sesión = PARCIAL/INCONSISTENTE.  
**Acción:** hacer que la sesión herede un snapshot documental explícito de la unidad (`unit.level`, `unit.ieType`, `unit.grades`, `unit.language`, `unit.quechuaVar` y demás contexto estable) o implementar una política de incompatibilidad/versionado que requiera decisión explícita antes de convertir una unidad a otro perfil. Añadir golden/regression test: crear unidad A → cambiar Ficha Maestra → generar sesión desde A → verificar que no ocurre deriva silenciosa.

## Impacto V4/V5
V5 exige el recorrido `Perfil IE → Programación → Unidad/Proyecto → Sesiones → Materiales → Evaluación → Registro → Seguimiento` y prohíbe aprobar módulos que pierdan datos u obliguen a reescribir información al avanzar. Este defecto no pierde físicamente la unidad, pero sí altera silenciosamente el contexto pedagógico del documento derivado y rompe la trazabilidad del recorrido.

También afecta V4: el usuario recibe una sesión aparentemente válida sin que la interfaz le advierta que el nivel/tipo de IE de la Ficha Maestra ya no coincide con la unidad fuente. Es un error silencioso, no una decisión pedagógica explícita.

## Corrección
No se modifica el runtime en esta pasada. Cambiar solo dos propiedades a `unit.level` y `unit.ieType` parece pequeño, pero el mismo problema ya existe en otros campos de snapshot (grados y perfil lingüístico) y debe resolverse con una política coherente de procedencia/migración para evitar documentos híbridos. La corrección debe ser atómica y acompañada por pruebas de regresión sobre unidades legadas.

## Gate
Bloqueante V5 pendiente. DocenteDigital no debe considerarse lista para lanzamiento V1.0 mientras una sesión pueda heredar silenciosamente un nivel/tipo de IE diferente al de su unidad fuente.
