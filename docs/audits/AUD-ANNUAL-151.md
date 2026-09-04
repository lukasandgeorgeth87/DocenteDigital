# AUD-ANNUAL-151 — Programación anual simulada

## Estado
- Módulo: Carpeta Docente / Programación anual
- Clasificación: SIMULADA
- Resultado: NO PASA
- Severidad: S1 CRÍTICO para Prelaunch V5

## Entrada de prueba
Desde `Mi planificación`, pulsar `Programación anual → Abrir`.

## Resultado esperado
La Programación anual debe ser una función esencial de Carpeta Docente V1.0 y participar del recorrido E2E `Perfil IE → Programación → Unidad/Proyecto → Sesiones → Materiales → Evaluación → Registro → Seguimiento`. Debe poder crear/guardar/recuperar/editar/exportar y heredar contexto sin obligar a reescribir información.

## Resultado obtenido
En `index.html`, el botón `Programación anual` llama a `demoAnnual()`.

En `app.js`, `demoAnnual()` únicamente ejecuta un `alert()` con el texto de que se trata de un prototipo. No crea una programación, no persiste un documento, no permite editar, recuperar ni exportar y no alimenta las unidades/proyectos posteriores.

## Evidencia
- `index.html`: botón `onclick="demoAnnual()"`.
- `app.js`: `function demoAnnual(){alert('Prototipo: la programación anual usará diagnóstico, contexto, calendario, recursos y CNEB para proponer una planificación editable.')}`.
- Producción comprobada el 2026-09-04: `/` y `/app.js` sirven la misma implementación mediante HTTP 200.

## Causa raíz
La superficie V1.0 fue expuesta antes de implementar el modelo documental y el flujo real de Programación anual.

## Acción correctiva
1. Mientras siga sin implementarse, no presentarla con un botón activo `Abrir`; marcar claramente `Próximamente` o deshabilitarla.
2. Implementar Programación anual como entidad persistente con trazabilidad a diagnóstico, contexto, calendario, unidades/proyectos y avances.
3. Probar crear → guardar → recargar → editar → recuperar → exportar → usar para crear unidad/proyecto.
4. Repetir la prueba con Inicial, Primaria, Secundaria, EIB/monolingüe y multigrado cuando corresponda.
5. No cerrar V5 hasta completar el E2E Docente real.

## Riesgo de regresión
Alto si se conecta directamente a unidades/proyectos sin un modelo versionado: podría sobrescribir contexto o romper históricos. La implementación debe ser incremental y reversible.

## Impacto en métricas
- IUD/ICGD/IFR/ISU/Prelaunch: impacto negativo cualitativo; no calcular puntuación definitiva sin evidencia trazable y usuarios reales.
- Prelaunch V5: bloquea lanzamiento porque Programación anual es función esencial de V1.0 y el recorrido E2E Docente queda interrumpido.

## Fuentes internas aplicadas
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

No se aplicó ni declaró vigente una norma externa MINEDU en este hallazgo técnico-funcional.