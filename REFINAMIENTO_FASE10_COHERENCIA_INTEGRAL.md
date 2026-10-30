# Docente Digital — Fase 10: validación transversal de unidad/proyecto → sesión

**Fecha:** 30 de octubre de 2026.  
**Base:** ZIP íntegro de la Fase 9 (Personal Social).  
**Tipo de entrega:** copia independiente del código fuente; sin despliegue ni edición de GitHub, Supabase o Vercel.

## Finalidad

Revisar la coherencia documental transversal: **contexto y situación significativa → reto → producto integrador → secuencia de actividades → sesión → propósito, criterio y evidencia → contenido exportado a Word**. No sustituye el juicio del docente ni prueba que un desempeño curricular concreto sea el correcto.

## Defecto de integración corregido

Las sesiones nuevas no conservaban una ficha explícita e inmutable del **reto, producto integrador, nivel, grados y actividad de origen**. El documento podía presentar una sesión con título editado sin advertir que la actividad de la unidad era otra. Asimismo, era difícil verificar la cadena completa si posteriormente se modificaba o eliminaba la unidad del almacenamiento local.

### Cambios incorporados

1. `planning-chain-integrity-v10.js` **nuevo**: al crear la sesión guarda `planningChainSnapshot` con el título de unidad, situación original, reto, producto, actividad, área, niveles y grados. Los datos se capturan al crear la sesión, sin modificarlos después.
2. Comprueba en cada unidad/proyecto si están presentes la situación, el reto, el producto, la secuencia y los grados, y señala actividades cuyas áreas no figuran entre las seleccionadas.
3. Comprueba en cada sesión si se conserva el nivel, los grados, el área original y la actividad seleccionada, y si existen propósito, criterio y evidencia. **No cambia ni rechaza automáticamente** las ediciones legítimas del docente: presenta alertas para revisar su coherencia.
4. Añade al documento de **unidad/proyecto en Word** una tabla de verificación estructural.
5. Añade a la **sesión en pantalla y en Word** un apartado “10. Trazabilidad Unidad/Proyecto → sesión” que contiene los datos del origen y observaciones de revisión.
6. Añade una verificación visible en la vista previa de la unidad/proyecto.
7. `schedule-prompt-v6.js` carga el módulo al final de la secuencia, sin reescribir los generadores existentes.
8. `tests/planning-chain-integrity.mjs` **nuevo** verifica condiciones normales y adversas; `tests/three-level-pedagogy.mjs` incorpora aserciones de trazabilidad en Inicial, Primaria multigrado y Secundaria.

## Pruebas ejecutadas

- **20/20 pruebas automatizadas offline PASS**, que incluyen 3 escenarios completos (Inicial, Primaria multigrado y Secundaria), 6 combinaciones multigrado, pruebas previas de Comunicación, Matemática, Ciencia y Tecnología y Personal Social, controles de datos históricos y exportación OOXML.
- Prueba adicional: alterar el título de una sesión genera una advertencia, no modifica su unidad de origen; alterar grados muestra discordancia; el snapshot persiste aunque la unidad se quite del estado local; el contenido del panel escapa texto HTML aportado por el docente.
- Todos los tests que no requieren Playwright del paquete fueron reejecutados.
- El test de tres niveles crea blobs DOCX y comprueba su firma ZIP y textos importantes; **no abre Word físico** ni certifica la maquetación en escritorio.

## Límites y pendientes

- La prueba integrada en navegador **no pudo ejecutarse**: el entorno bloqueó la visita a `http://127.0.0.1:4173/` con `ERR_BLOCKED_BY_ADMINISTRATOR`. No se atribuye un PASS de navegador.
- El motor de auditoría comprueba presencia, identidad y consistencia estructural, **no** pertinencia pedagógica sustantiva, calidad del lenguaje, elección literal de desempeños ni correspondencia semántica perfecta entre reto y producto.
- Los estándares y desempeños de Primaria deben seleccionarse por competencia/grado a partir del programa curricular oficial. Los programas de Inicial y Secundaria deben contrastarse antes de declararlos verificados en esas etapas.
- Pendientes: revisión y prueba real con docentes; Word y PDF abierto e impreso; cuenta personal, almacenamiento seguro en Supabase, IA real controlada y suscripciones mensuales.
- No se cambió la publicación actual ni se habilitaron funciones de pago.

## Criterios sugeridos para validación con docentes

1. El docente selecciona 2.º y 4.º: no aparecen tareas, criterios ni estándares para 1.º, 3.º, 5.º o 6.º.
2. El docente crea una unidad del biohuerto y luego una sesión: el reto, el producto y la actividad de origen permanecen visibles en Word.
3. Se edita el título para cambiar de investigación a exposición: aparece advertencia para comprobar competencia, propósito y criterio.
4. Se revisa que la secuencia de sesiones conduzca al producto final; esta relación se valida pedagógicamente con una persona, no solo con un test automático.
5. Dos documentos distintos mantienen sus datos históricos aunque cambie el perfil general de la aplicación.

**Siguiente prioridad:** ejecutar pruebas E2E reales y abrir documentos Word, corregir hallazgos visuales, y después conectar cuentas individuales y persistencia privada a la base Supabase ya creada, manteniendo desactivados los pagos hasta completar seguridad y límites de consumo de IA.
