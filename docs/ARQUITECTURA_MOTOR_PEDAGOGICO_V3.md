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

## Integración incremental del 13 de noviembre de 2026

**Alcance de esta integración:** vertical validada de 2.º de Primaria, derechos de la niñez. No se atribuye generación universal a la aplicación.

- Se carga \`planning-engine-v3-core.js\` antes del proveedor pedagógico V2 en la interfaz real.
- Al **aprobar** una propuesta, el flujo comprueba el título, situación significativa, reto, propósito, selección de áreas, producto aprobado, 30 actividades, competencias, capacidades, criterios y evidencias mediante V3. La validación no escribe ni modifica el borrador hasta la aprobación docente.
- Si falla el almacenamiento, la operación recupera los campos previos, también la marca de aprobación V3.
- Al **generar una sesión** desde una unidad V2 aprobada, V3 valida la unidad actual y comprueba los momentos didácticos, el propósito, el instrumento y la evidencia de la sesión antes de guardarla. Si falla, conserva la sesión anterior.
- Al **descargar o compartir la unidad en Word**, la aplicación vuelve a auditar los datos actuales y produce el documento desde el modelo V3. Las ediciones incompletas impiden la descarga; ninguna copia antigua de criterios se inserta en silencio.
- Las exportaciones muestran situación significativa, pregunta retadora, propósito, matriz curricular, secuencia por semanas, evidencias, criterios y evaluación formativa. No afirman desempeños específicos que no estén cotejados.
- **Sin nuevos botones**: se reutiliza el flujo existente. La ausencia del compilador V3 en el navegador impide aprobar y exportar una unidad V2, en lugar de simular validación.
- Pruebas obligatorias: \`planning-engine-v3-core.mjs\`, \`planning-engine-v3-v2-compat.mjs\`, \`planning-engine-v3-water-case.mjs\`, \`planning-engine-v3-integration.mjs\`, \`planning-engine-v3-browser.mjs\`, más \`pedagogical-v2-browser.mjs\` y todas las regresiones previas.
- Sin activación de GPT, API de pago, Supabase ni modificación de \`main\`/producción.

### Limitaciones vigentes

1. El proveedor conectado en la interfaz sigue limitado a la ruta curricular validada de **derechos, segundo grado, tres semanas**. La prueba del proyecto del agua es un contrato independiente, aún no constituye una opción conectada a toda la interfaz.
2. Los planificadores anteriores pueden producir **borradores** sobre otros temas; no deben presentarse como planificaciones plenamente auditadas V3.
3. La matriz de estándares y desempeños de grado, así como la validación humana integral de las sesiones y la calidad de sus textos, continúan pendientes. Las pruebas automáticas certifican contratos técnicos, no validez pedagógica del MINEDU.
4. La siguiente etapa es sustituir los proveedores específicos por una interfaz de contenido contextualizado y verificable por nivel/área/grado, respetando el tipo de documento y el producto docente. No añadir más catálogos aislados por tema.
