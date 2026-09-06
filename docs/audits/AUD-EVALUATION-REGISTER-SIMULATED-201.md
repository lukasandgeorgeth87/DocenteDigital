# AUD-EVALUATION-REGISTER-SIMULATED-201

## Resumen

**Módulo:** Evaluación / Registro auxiliar

**Estado:** NO PASA

**Clasificación funcional:** SIMULADA para registro de evaluación; PARCIALMENTE FUNCIONAL para la pantalla de evaluación

**Severidad:** S1 CRÍTICO — bloqueante V5

## Especificaciones obligatorias aplicadas

- V2 exige que el registro auxiliar recupere estudiantes, áreas, competencias, criterios, evidencias, periodos y valoraciones, y mantenga trazabilidad Evidencia → Evaluación → Registro.
- V3 exige demostrar funcionalidad mediante Entrada → Esperado → Obtenido → Evidencia → PASA/NO PASA, y establece que una función no aprueba solo porque muestra una pantalla o texto.
- V4 exige registrar evaluación en 2–4 pasos y reutilizar información ya existente.
- V5 define Evaluación e instrumentos + Registro auxiliar como funciones esenciales V1.0 y exige probar la cadena Programación → Unidad → Sesiones → Criterios → Evidencias → Instrumentos → Registro.
- Núcleo IA exige herencia de significado hasta Evaluación y Registro.

## Prueba

**ID:** AUD-EVALUATION-REGISTER-SIMULATED-201

**Entrada:** Crear o disponer de una sesión con criterio/evidencia → abrir Evaluación → Registro de evaluación.

**Resultado esperado:** El registro debe recuperar la sesión/unidad pertinente, estudiante(s), área, competencia, criterio, evidencia y periodo; permitir registrar una valoración vinculada a esa evidencia y persistirla para recuperación/seguimiento.

**Resultado obtenido:** `showEvaluation('register')` solo inyecta HTML estático con el mensaje `Usa criterios y evidencias ya registrados` y un `<select>` AD/A/B/C. No consulta `state.lastSession`, `state.units`, estudiantes, criterios, evidencias ni periodos; tampoco guarda la valoración seleccionada ni crea una relación evaluativa persistente.

**Evidencia de implementación:** `app.js`, función `showEvaluation(kind)`. La rama `kind==='register'` construye únicamente una pantalla estática. En el mismo archivo, el estado base contiene nivel, tipo de IE, grados, áreas, idioma, unidades, unidad activa y última sesión, pero no existe en esa ruta un modelo de registros de evaluación/estudiantes ni una operación de guardado asociada al selector.

**PASA/NO PASA:** NO PASA.

## Causa raíz

La interfaz declara una integración que todavía no existe. La frase `Usa criterios y evidencias ya registrados` funciona como afirmación de capacidad, pero el runtime no realiza recuperación ni trazabilidad de esos datos. Es un error silencioso porque la pantalla responde correctamente y permite elegir AD/A/B/C, aunque la selección no se conecta con una evidencia ni queda registrada.

## Riesgo

1. El docente puede creer que evaluó una evidencia cuando solo cambió un control visual sin persistencia.
2. La cadena Sesión → Criterio → Evidencia → Evaluación → Registro queda rota.
3. No es posible demostrar seguimiento del estudiante ni recuperación posterior.
4. Una prueba superficial de UI podría aprobar falsamente el módulo.
5. Bloquea el gate V5 porque Evaluación y Registro auxiliar son funciones esenciales V1.0.

## Acción correctiva requerida

No corregir con un simple botón Guardar sobre el selector actual. Implementar primero un contrato mínimo de evaluación trazable:

`studentId + unitId + sessionId + area + competenceId/reference + criterionId/reference + evidenceId/reference + period + value + feedback + createdAt + provenance`.

La pantalla debe recuperar datos reales del documento fuente, impedir registrar una valoración sin criterio/evidencia suficiente, persistir el registro y demostrar relectura después de recarga/reingreso. La decisión profesional final debe permanecer en el docente y no convertirse en promedio mecánico.

## Retest requerido

1. Crear unidad y sesión reales.
2. Verificar criterio/evidencia concretos.
3. Abrir Registro de evaluación y confirmar herencia exacta.
4. Registrar valoración y retroalimentación.
5. Recargar/cerrar y reabrir.
6. Confirmar persistencia y trazabilidad al mismo estudiante/evidencia.
7. Editar sin alterar históricos no relacionados.
8. Probar móvil y exportación/seguimiento cuando estén implementados.

## Corrección aplicada en esta ejecución

No se modifica runtime. Resolver correctamente requiere modelo persistente de estudiantes/evidencias/evaluaciones y decisión de arquitectura/backend; un parche visual sería engañoso y contrario a V3/V5.

## Impacto en indicadores

- IUD: afecta trazabilidad documental.
- ICGD: afecta coherencia entre sesión, evidencia, evaluación y registro.
- IFR: no puede considerarse funcional esta cadena.
- ISU: no calcular impacto definitivo sin prueba real; la UI es simple pero induce a error.
- Prelaunch: BLOQUEADO por función esencial simulada.

## Estado de lanzamiento

DocenteDigital NO debe declararse lista para V1.0 mientras esta cadena permanezca simulada o existan otros S0/S1/pruebas físicas esenciales pendientes.
