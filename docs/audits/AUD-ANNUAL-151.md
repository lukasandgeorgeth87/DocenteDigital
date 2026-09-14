# AUD-ANNUAL-151 — Programación anual simulada

## Estado funcional
- Módulo: Carpeta Docente / Programación anual
- Clasificación funcional: SIMULADA
- Resultado funcional: NO PASA
- Severidad: S1 CRÍTICO para Prelaunch V5
- Verdad de superficie: CORREGIDA EN IMPLEMENTACIÓN / E2E PENDIENTE

## Entrada de prueba
Desde `Mi planificación`, intentar abrir o crear la Programación anual.

## Resultado esperado
La Programación anual debe ser una función esencial de Carpeta Docente V1.0 y participar del recorrido E2E `Perfil IE → Programación → Unidad/Proyecto → Sesiones → Materiales → Evaluación → Registro → Seguimiento`. Debe poder crear/guardar/recuperar/editar/exportar y heredar contexto sin obligar a reescribir información.

## Resultado funcional actual
La implementación base sigue siendo simulada: en `index.html`, el botón de Programación anual nace con `onclick="demoAnnual()"`; en `app.js`, `demoAnnual()` únicamente ejecuta un `alert()` que declara que se trata de un prototipo. No crea una programación, no persiste un documento, no permite editar, recuperar ni exportar y no alimenta las unidades/proyectos posteriores.

Por ello, **AUD-ANNUAL-151 continúa abierto como S1 funcional y bloqueante de V5**.

## Mitigación de verdad de superficie ya implementada
La recomendación original de no presentar un botón activo hacia una función simulada sí fue implementada posteriormente. `home-surface-truth-v73.js` ejecuta `markUnavailablePlanningEntry('demoAnnual','Abrir programación anual')`, que:
- localiza la entrada basada en `demoAnnual`;
- la deshabilita;
- añade `aria-disabled="true"`;
- cambia su etiqueta a `Abrir programación anual · Próximamente`;
- muestra el título `Función aún no disponible para lanzamiento`;
- elimina el `onclick`, evitando que el usuario active el prototipo desde esa superficie.

Además, `clarifyPlanningHomeCard()` comunica en Inicio que `Diagnóstico y programación anual: próximamente`.

### AUD-ANNUAL-151-R1 — verdad de superficie
**Entrada:** inspeccionar la composición final de la pantalla Planificación con la guarda V73 cargada.  
**Resultado esperado:** una función esencial todavía simulada no debe presentarse como disponible.  
**Resultado obtenido:** existe una guarda explícita que deshabilita y rotula la entrada como Próximamente.  
**Evidencia:** `home-surface-truth-v73.js`; `schedule-prompt-v6.js` incluye dicho módulo en la cola estable.  
**Resultado:** PASA EN IMPLEMENTACIÓN para verdad de superficie.  
**Clasificación:** FUNCIONAL EN IMPLEMENTACIÓN / E2E REAL PENDIENTE para la mitigación UX.

### AUD-ANNUAL-151-R2 — funcionalidad real
**Entrada:** exigir crear → guardar → recargar → editar → recuperar → exportar → reutilizar una Programación anual real.  
**Resultado esperado:** flujo documental persistente y trazable.  
**Resultado obtenido:** no existe implementación real demostrada; la función base continúa siendo `demoAnnual()`.  
**Resultado:** NO PASA.  
**Clasificación:** SIMULADA.  
**Severidad:** S1 CRÍTICO.

## Causa raíz
La superficie V1.0 se diseñó antes de implementar el modelo documental y el flujo real de Programación anual. Una capa posterior corrigió la honestidad de la interfaz, pero no sustituye la implementación funcional requerida por V5.

## Acción correctiva pendiente
1. Implementar Programación anual como entidad persistente con trazabilidad a diagnóstico, contexto, calendario, unidades/proyectos y avances.
2. Probar crear → guardar → recargar → editar → recuperar → exportar → usar para crear unidad/proyecto.
3. Repetir la prueba con Inicial, Primaria, Secundaria, EIB/monolingüe y multigrado cuando corresponda.
4. Mantener la entrada deshabilitada como Próximamente hasta que esas pruebas pasen.
5. No cerrar V5 hasta completar el E2E Docente real.

## Riesgo de regresión
Alto si se conecta directamente a unidades/proyectos sin un modelo versionado: podría sobrescribir contexto o romper históricos. La implementación debe ser incremental y reversible. La mitigación UX también debe probarse en navegador real para asegurar que ningún wrapper posterior reactive `demoAnnual()`.

## Impacto en métricas
- IUD/ICGD/IFR/ISU/Prelaunch: impacto negativo cualitativo por funcionalidad esencial ausente; no calcular puntuación definitiva sin evidencia trazable y usuarios reales.
- Prelaunch V5: bloquea lanzamiento porque Programación anual es función esencial de V1.0 y el recorrido E2E Docente queda interrumpido.

## Fuentes internas aplicadas
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

No se aplicó ni declaró vigente una norma externa MINEDU en este hallazgo técnico-funcional.
