# Arquitectura de planificación Docente Digital — Motor V3

**Rama de laboratorio:** `feature/motor-pedagogico-v3-integral-20261112`. **Base:** V2 del 12/11/2026. **No desplegar en main ni producción.**

## Diagnóstico técnico

La versión anterior construía sesiones desde plantillas y catálogos específicos. El motor V2 de derechos de 2.º grado sí contiene propuestas curadas, pero no demuestra generación general para otros grados, temas o tipos de planificación. Pasar pruebas de descarga o presencia de títulos tampoco constituye validez pedagógica.

## Contrato V3: una fuente de verdad

Entrada del docente (tipo, grado, áreas, tema, contexto, producto, horario) → preflight sin inventar datos → **proveedor curado de experiencias** → auditoría estructural, temática, curricular y evaluativa → **modelo único inmutable y trazable** → vista, sesión y Word derivados del mismo modelo.

El núcleo `planning-engine-v3-core.js` implementa `preflight`, `audit`, `compile` y `renderDocument` sin sobrescribir el trabajo existente ni hacer llamadas externas. Un proveedor sin catálogo suficiente debe **rechazar**, no rellenar con frases genéricas. Todas las salidas conservan el producto y la selección del docente.

### Contratos imprescindibles

1. **Integridad del encargo:** preservar tipo de planificación, nivel, grado, duración, áreas, producto y horario. Sin inferir historias locales, nombres de docentes o incidentes reales.
2. **Fuente curricular:** cotejar área, competencia y capacidades con el catálogo MINEDU de la app; no permitir nombres inventados.
3. **Evidencia auténtica:** cada sesión tiene una pregunta, actuación observable, evidencia concreta y criterio verificable; sin duplicar títulos ni llenar campos con instrucciones.
4. **Trazabilidad:** cada fila de la secuencia mantiene acción → evidencia → criterio → competencia y fuente.
5. **Progresión:** evitar semanas vacías, bloques dobles, saltos temporales y contenidos que no se relacionan con el tema.
6. **Seguridad documental:** Word proviene del mismo objeto auditado que se ofrece para revisión, sin reemplazarlo por otro texto durante la exportación.
7. **Aprobación docente:** un contrato aprobado estructuralmente no equivale a una programación validada por MINEDU. La matriz de **estándares y desempeños específicos** aún no está completa en la fuente de la app; se requiere vinculación antes de publicitar calidad curricular integral.
8. **Sin gastos:** V3 no activa API, créditos, suscripciones ni GPT.

## Qué se implementó en esta fase

- Compilador V3 aislado, inmutable y sin efecto sobre producción.
- Auditoría de título, situación significativa, reto, propósito, producto, semanas, sesiones, acciones, evidencias, criterios y currículo.
- Construcción de un modelo único para Word, con una tabla de trazabilidad por sesión.
- Prueba V3 con unidad y proyecto, contenido coherente sobre derechos, competencia falsificada, cambio de tema a agua, sesiones repetidas, contenido insuficiente y ausencia de proveedor.
- Los controles V2 y las pruebas anteriores permanecen intactos.

## Qué sigue pendiente y no se debe declarar terminado

- Conectar la interfaz y la generación de sesiones a V3, sustituyendo las múltiples rutas de generación por la puerta de entrada única.
- Implementar y validar proveedores de contenido por grado, tema y nivel, o un servicio de IA controlado, bajo autorización posterior de costos.
- Construir la matriz certificable de estándares y desempeños por grado; vincularla a criterios medibles y a cada evidencia.
- Distinción didáctica plena de proyecto vs unidad (planificación, acciones de producto, agentes, evaluación de impacto).
- Probar al menos tres temas **no incluidos** en el catálogo V2 con docentes reales, en PC y móvil, Word y persistencia después de recargar.
- No ofrecer una versión comercial hasta superar pruebas de uso real y revisión pedagógica humana.

**Regla de aceptación:** ninguna nueva salida se presenta como planificación final sin una cadena curricular y pedagógica consistente. La aplicación debe declarar sus límites cuando falte una fuente de contenido.