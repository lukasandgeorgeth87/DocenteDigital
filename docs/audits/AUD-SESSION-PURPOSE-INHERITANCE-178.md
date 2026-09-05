# AUD-SESSION-PURPOSE-INHERITANCE-178

## Módulo
Carpeta Docente → Unidad/Proyecto → Sesión → herencia semántica de finalidad.

## Especificaciones obligatorias aplicadas
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

V2 exige trazabilidad Programación → Unidad/Proyecto → Sesiones y coherencia entre documentos. V3 exige que una función conserve los datos correctos y la coherencia, no solo que genere texto. El Núcleo IA exige expresamente herencia de significado y establece que una finalidad aprobada debe heredarse a los documentos relacionados hasta que el usuario la modifique expresamente.

## ID de prueba
**AUD-SESSION-PURPOSE-INHERITANCE-178**

## Entrada
Crear/usar una Unidad o Proyecto cuya finalidad sea específica y distinta del mero tema de contexto. Caso de regresión prioritario:

> `En Ccotataqui se realiza la siembra de tubérculos y productos verdes. Hablaremos sobre esos conocimientos y los volcaremos para sembrar hortalizas en nuestro biohuerto.`

Relación semántica esperada:
- fuente de aprendizaje: saberes de la siembra;
- finalidad: aplicar esos saberes para sembrar hortalizas en el biohuerto.

Después seleccionar una actividad de esa Unidad/Proyecto y generar una sesión.

## Resultado esperado
La sesión debe heredar explícitamente la finalidad aprobada de la Unidad/Proyecto y conservar su relación X→Y, además de vincularse con el reto/producto pertinente. El propósito de sesión puede precisar el aprendizaje del área y de la actividad, pero no debe sustituir la finalidad aprobada por una fórmula genérica basada solo en el tema/contexto.

## Resultado obtenido
En el runtime base actual, `buildSession()` recupera de la unidad únicamente `unitBrief(unit)` para formar `brief`. Construye luego `session.purpose` desde cero con una plantilla genérica:

`Desarrollar la competencia priorizada del área de ${area} mediante un reto contextualizado en ${brief}, diferenciando las tareas según el grado y promoviendo que los estudiantes expliquen lo que hacen y aprenden.`

El objeto de sesión no copia ni referencia `unit.purpose`, `unit.reto` o `unit.product`. Por tanto, aun cuando la Unidad/Proyecto hubiese logrado comprender y guardar una finalidad específica, el contrato de creación de sesión no garantiza esa herencia.

Esto es un fallo de arquitectura de datos/semántica y no requiere que exista un Error 500 para manifestarse. La sesión puede verse coherente superficialmente porque reutiliza el texto de contexto, pero puede perder la relación entre fuente de aprendizaje y finalidad.

## Evidencia
- `app.js`: `buildSession()` usa `unitBrief(unit)` como `brief`, pero genera `session.purpose` con una frase genérica y no incorpora `unit.purpose`, `unit.reto` ni `unit.product`.
- `enhancements.js`: las Unidades/Proyectos sí manejan campos `purpose`, `reto` y `product`, lo que demuestra que esos significados existen aguas arriba.
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`: sección de herencia de significado exige que una finalidad aprobada se herede a los documentos relacionados hasta modificación expresa.
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`: exige trazabilidad y coherencia entre Unidad/Proyecto y Sesiones.

## PASA / NO PASA
**NO PASA**

## Clasificación
**PARCIALMENTE FUNCIONAL**

La sesión mantiene `unitId`, título de unidad y contexto base cuando existe una unidad real, pero no demuestra herencia semántica completa de finalidad/propósito/reto/producto.

## Severidad
**S2 ALTO**

Motivo: puede producir una incoherencia pedagógica importante y aumentar reelaboración, pero en esta prueba no se demostró todavía una competencia oficial falsa ni una sesión completamente inviable. Si una prueba E2E demuestra que esta pérdida cambia sustancialmente el propósito pedagógico final de una sesión, deberá reevaluarse como S1 conforme V3.

## Causa raíz
El modelo de sesión se construyó como un objeto casi independiente que reutiliza una referencia mínima de la unidad (`brief`, `unitId`, `unitTitle`) en lugar de partir de un perfil semántico/heredado común. La herencia está implícita en texto libre, no garantizada por contrato.

## Acción correctiva requerida
No aplicar un parche textual que concatene `unit.purpose` sin analizar el área y la actividad. La corrección estructural debe:

1. definir un perfil semántico persistente de Unidad/Proyecto;
2. almacenar por separado foco, finalidad, reto y producto/acción final;
3. hacer que la creación de sesión reciba ese perfil como entrada obligatoria;
4. derivar el propósito específico de sesión como `finalidad de unidad + aprendizaje/competencia de actividad`, sin perder X→Y;
5. conservar `source/provenance` para distinguir usuario, IA y fuente oficial;
6. auditar antes de entregar: `finalidad unidad ↔ propósito sesión ↔ reto ↔ evidencia ↔ producto`;
7. agregar golden tests para biohuerto, hormigas, términos locales y finalidades situadas al inicio/medio/final del texto.

## Corrección aplicada en esta pasada
**NO SE MODIFICÓ el runtime.** Resolver este hallazgo correctamente depende del contrato del Núcleo IA y del modelo de datos semántico. Un parche local de texto podría aparentar coherencia sin comprenderla y contradiría la regla `Comprender → estructurar → verificar → proponer → auditar`.

## Reprueba requerida
- Biohuerto X→Y: comprobar que cada sesión conserve la finalidad de aplicar saberes de siembra para sembrar hortalizas, cuando esa sea la finalidad aprobada.
- Hormigas: conservar curiosidad/interés sin convertirla artificialmente en problema.
- Finalidad al inicio, medio y final del texto.
- Unidad editada: sesiones nuevas deben usar la finalidad actual; sesiones históricas emitidas deben conservar la versión original.
- Multigrado: misma finalidad común con propósito/criterio diferenciado por grado cuando corresponda.

## Fuente oficial
No se declara ni aplica una norma educativa externa nueva en este hallazgo. La prueba evalúa el contrato interno obligatorio V2/V3/V5/Núcleo IA. Cualquier competencia o normativa que se incorpore durante la futura corrección deberá verificarse contra fuente oficial vigente antes de usarse.

## Riesgo de regresión
**ALTO**. Modificar la herencia puede afectar títulos, propósitos, criterios, evidencias, materiales y evaluaciones. Debe realizarse con golden tests y control de históricos.

## Impacto
- **IUD:** afectado; una sesión que pierde finalidad requiere corrección manual.
- **ICGD:** afectado directamente en Unidad/Proyecto ↔ Sesión.
- **IFR:** afectado por reelaboración potencial; no se calcula índice definitivo.
- **ISU:** impacto indirecto; la promesa de reutilizar información no se cumple por completo.
- **Prelaunch:** añade un S2 abierto; no sustituye ni reduce S0/S1 existentes.

## Estado acumulativo
**ABIERTO / PENDIENTE DE CORRECCIÓN E2E.**

DocenteDigital no debe declararse lista para lanzamiento mientras existan bloqueantes V5 y pruebas reales esenciales pendientes.