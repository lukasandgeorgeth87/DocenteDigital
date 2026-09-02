# AUD-INSTITUTION-COUNTS-102

- Módulo: Ficha Maestra de la IE
- Entrada: N.º de docentes o estudiantes con valores como `-3`, `2.5`, `abc`.
- Esperado: aceptar solo enteros no negativos o dejar el campo vacío cuando aún no se conoce.
- Obtenido antes: los campos usaban texto libre con `inputmode=numeric` y se persistían sin validación.
- Estado inicial: NO PASA
- Severidad: S2 ALTO
- Clasificación: PARCIALMENTE FUNCIONAL
- Causa raíz: falta de validación semántica antes de persistir datos maestros reutilizables.
- Corrección: `institution-master-v46.js` v46.4 usa `type=number`, `min=0`, `step=1` y validación lógica `nonNegativeInteger()` antes de guardar.
- Evidencia posterior: commit `72796f77804cf684ece8b443969330e4ca8eb48f`; integración Vercel `success`; producción `/institution-master-v46.js` HTTP 200 y raíz HTTP 200.
- Estado posterior: PASA a nivel de lógica e integración desplegada.
- Riesgo de regresión: bajo; afecta solo dos campos numéricos de la Ficha Maestra.
- Impacto: mejora integridad de fuente única de verdad y reduce contaminación de documentos/estadísticas posteriores.
- Pendiente V5: backend, autenticación, validación multiusuario, pruebas físicas/móvil y ciclo completo Director/Docente siguen pendientes.