# AUD-NUCLEO-SEMANTIC-RUNTIME-170 — Núcleo semántico no cargado en producción

## Alcance
Auditoría acumulativa conforme a `AUDITORIA_MAESTRA_INTEGRAL_V2.md`, `ADENDA_AUDITORIA_EJECUTABLE_V3.md`, `AUDITORIA_SIMPLICIDAD_USO_V4.md`, `AUDITORIA_PRELANZAMIENTO_V5.md` y `NUCLEO_IA_DOCENTEDIGITAL.md`.

## ID de prueba
AUD-NUCLEO-SEMANTIC-RUNTIME-170

## Módulo
Unidad/Proyecto → comprensión de lenguaje natural → título/situación/reto/producto.

## Entrada
Texto libre de contexto, incluyendo casos no agrícolas y urbanos, por ejemplo: `En un aula urbana de Lima, mis estudiantes encontraron hormigas junto a una ventana y quieren saber cómo viven, qué comen y por qué aparecen allí.`

## Resultado esperado
El Núcleo IA exige: comprender → estructurar significado → verificar contexto/normativa → proponer → auditar coherencia. La finalidad y el contexto completo deben estar por encima de palabras dominantes; no se debe asumir automáticamente `comunidad`, convertir un interés en problema ni depender de bancos cerrados de palabras clave. La interpretación debe ser reutilizable y distinguir datos explícitos, inferidos, faltantes y confianza.

## Resultado obtenido
1. El `index.html` que sirve producción no carga `context-semantic-v20.js`, `context-keywords-v19.js`, `context-audit-v8.js`, `creative-runtime-v18.js`, `creativity-engine-v14.js` ni otros módulos semánticos existentes en el repositorio. La cadena productiva visible carga esencialmente `app.js`, `enhancements.js`, formato, horario, estrategias y recursos.
2. `app.js` continúa tomando decisiones mediante expresiones regulares cerradas (`siembr|papa|...`, `pachamama`, `agua|yaku`, `residuo|...`) y usa como fallback títulos y situaciones centrados en `nuestra comunidad`.
3. `enhancements.js` conserva la misma lógica por palabras clave y defaults territoriales/comunitarios para reto, producto, propósito, desempeños y criterios.
4. El archivo `context-semantic-v20.js` existe en el repositorio, pero él mismo declara que es `detección léxica preliminar, no sustituye comprensión semántica`; además, al no estar referenciado por `index.html`, no forma parte del runtime productivo actual.
5. La respuesta HTTP productiva verificada sirve el mismo `index.html` y devuelve 200 OK, confirmando que la cadena de scripts observada corresponde al sitio publicado.

## Evidencia
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`: contrato de comprensión semántica y prohibición de bancos cerrados como inteligencia principal.
- `index.html`: lista real de scripts del runtime productivo.
- `app.js`: `proposeUnitTitle`, `expandSituation`, `proposeProduct` basados en regex y fallback `comunidad`.
- `enhancements.js`: `ddReto`, `ddProduct`, `ddContext` y propósito por reglas cerradas.
- `context-semantic-v20.js`: módulo léxico preliminar existente pero no cargado por `index.html`.
- Producción `https://docente-digital.vercel.app/`: HTTP 200 y HTML con la misma lista de scripts.

## PASA / NO PASA
**NO PASA**.

## Clasificación
**SIMULADA / PARCIALMENTE FUNCIONAL** para comprensión semántica. La app genera propuestas, pero el runtime actual no demuestra el Núcleo IA obligatorio ni una comprensión semántica abierta.

## Severidad
**S1 CRÍTICO** para Prelaunch V5, porque puede producir unidades/proyectos pedagógicamente incoherentes o territorialmente incorrectos mientras la interfaz afirma analizar la situación sin inventar elementos.

## Causa raíz
Desalineación entre módulos existentes en el repositorio y la cadena de scripts realmente publicada; además, la lógica activa principal sigue siendo heurística/keyword-based y community-centric.

## Acción correctiva
1. No conectar ciegamente los módulos antiguos solo por existir: `context-semantic-v20.js` sigue siendo léxico preliminar.
2. Implementar una capa semántica real con salida estructurada conforme al Núcleo IA: intención, finalidad, actores, lugar, restricciones, EIB/monolingüe, productos, datos explícitos/inferidos/faltantes, contradicciones y confianza.
3. Mantener guardas locales anti-invención y fuente oficial por encima del modelo.
4. Eliminar `comunidad` como fallback territorial rígido y no convertir intereses en problemas.
5. Ejecutar golden tests con: biohuerto X→Y, hormigas en aula urbana, interés sin problema, contexto periurbano, EIB, monolingüe, texto con errores, términos locales desconocidos y finalidad al final del texto.
6. No declarar la función como IA semántica hasta disponer de backend/modelo real y pruebas repetibles.

## Corrección directa realizada
No se conectó ni sustituyó el motor semántico en esta pasada porque hacerlo requiere IA/backend real, contrato de salida, guardas, pruebas pedagógicas y control de regresión. Conectar archivos léxicos antiguos sería una falsa corrección.

## Evidencia posterior requerida
- Prueba real de navegador con batería semántica.
- Salida estructurada auditable.
- Comparación esperado/obtenido en cada caso.
- Reprueba de títulos, situación, reto, producto y secuencia.
- Vercel READY + HTTP 200 después de la corrección futura.

## Riesgo de regresión
Alto: cambios en comprensión afectan Unidad/Proyecto, sesiones, materiales, evaluación y herencia de significado.

## Impacto en indicadores
- IUD: negativo hasta demostrar coherencia pedagógica real.
- ICGD: negativo por desalineación entre intención y documento.
- IFR: no cerrar; generación técnica no equivale a funcionalidad correcta.
- ISU: no puntuar definitivamente; una interfaz simple con resultados incorrectos no aprueba.
- Prelaunch: bloqueante abierto.

## Gate
DocenteDigital **NO está lista para V1.0** mientras este hallazgo y cualquier S0/S1 permanezcan abiertos o falten pruebas reales esenciales.