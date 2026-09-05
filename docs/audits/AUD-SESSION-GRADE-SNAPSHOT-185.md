# AUD-SESSION-GRADE-SNAPSHOT-185 — La sesión puede heredar grados actuales distintos a los de su Unidad/Proyecto

## ID
**AUD-SESSION-GRADE-SNAPSHOT-185**

## Módulo
Carpeta Docente → Unidad/Proyecto → Crear sesión → herencia de contexto.

## Entrada
1. Configurar Primaria multigrado con grados `1.º, 3.º y 5.º`.
2. Crear y guardar una Unidad/Proyecto A.
3. Volver a configuración y cambiar los grados activos, por ejemplo a `2.º y 4.º`, sin modificar el documento A ya guardado.
4. Abrir A desde `Mis unidades/proyectos` y pulsar `Crear sesiones`.
5. Generar una sesión para una actividad real de A.

## Resultado esperado
La sesión derivada de A debe heredar el contexto documental de A: nivel, tipo de IE y especialmente `unit.grades`. Cambiar la Ficha/configuración actual no debe reescribir silenciosamente la población objetivo de una Unidad/Proyecto histórico ni de una sesión que nace de ella.

V2 exige trazabilidad `UNIDAD / PROYECTO → SESIONES`; V3 exige fuente única de verdad, procedencia y conservación de históricos; el Núcleo IA exige herencia de significado entre documentos relacionados.

## Resultado obtenido
La Unidad/Proyecto sí guarda una fotografía propia:

```js
level: state.level,
ieType: state.ieType,
grades: [...state.grades],
areas: [...state.areas]
```

Sin embargo, `buildSession()` no usa esos campos del `unit` seleccionado para nivel, tipo de IE y grados. Construye la sesión con el estado global vigente:

```js
level: state.level,
ieType: state.ieType,
grades: [...state.grades],
```

Por tanto, si la configuración cambia después de crear la Unidad A, una sesión nueva asociada a `unitId: A` puede quedar con grados diferentes a `A.grades`.

La capa `session-learning-core-v54.js` enriquece propósito, criterio, evidencia, currículo e `informativeData`, pero conserva `session.grades` y no lo reemplaza por `unit.grades`. `session-curriculum-safety-v67.js` solo protege las etiquetas curriculares provisionales y tampoco corrige la población objetivo. `prototype-data-guard-v41.js` valida que exista unidad/actividad real, pero no compara ni corrige `session.grades` contra la unidad.

## Evidencia
- `app.js`: al crear la unidad se persiste `grades:[...state.grades]`.
- `app.js`: `buildSession()` usa `grades:[...state.grades]` pese a disponer del objeto `unit` seleccionado.
- `session-learning-core-v54.js`: `informativeData()` copia `session.grades` y `enrich()` no sincroniza grados desde la unidad.
- `session-curriculum-safety-v67.js`: no modifica contexto de nivel/grados.
- `prototype-data-guard-v41.js`: exige unidad y actividad reales, pero no valida igualdad de contexto Unidad→Sesión.
- Producción `/app.js` sirve el mismo `buildSession()` con HTTP 200.

## PASA / NO PASA
**NO PASA**

## Clasificación
**PARCIALMENTE FUNCIONAL**

La relación por `unitId` existe, pero la herencia del contexto de grados no es confiable después de un cambio de configuración.

## Severidad
**S1 — CRÍTICO / bloqueante V5**.

Una sesión puede terminar dirigida a grados distintos a los de la unidad de origen. Eso altera diferenciación, tareas, nivel de complejidad y potencialmente criterios/desempeños; no es un detalle visual sino una incoherencia pedagógica central y silenciosa.

## Causa raíz
Mezcla de dos fuentes de verdad durante la derivación documental:
- la Unidad/Proyecto conserva su snapshot histórico;
- `buildSession()` vuelve a consultar el estado global actual para nivel/tipo/grados.

## Acción correctiva
En la construcción de una sesión vinculada a una unidad real, usar primero el snapshot de la unidad:

```js
level: unit?.level || state.level,
ieType: unit?.ieType || state.ieType,
grades: Array.isArray(unit?.grades) ? [...unit.grades] : [...state.grades]
```

Aplicar la misma regla a lengua/perfil territorial u otros datos que deban heredarse documentalmente, distinguiendo datos históricos de datos maestros actuales.

Agregar una guarda de coherencia antes de guardar/exportar:

```text
session.unitId existe → session.grades debe corresponder al snapshot de la unidad,
salvo que el docente haya creado explícitamente una nueva versión de la planificación.
```

Pruebas mínimas de regresión:
1. Unidad 1.º/3.º/5.º → cambiar configuración → sesión sigue 1.º/3.º/5.º.
2. Unidad monogrado → cambiar a multigrado → sesión conserva el grado de la unidad.
3. Cambio de nivel actual no reinterpreta una unidad histórica.
4. Reabrir y exportar conserva el mismo snapshot.
5. Si se desea actualizar la unidad al nuevo contexto, debe ser una acción explícita/versionada.

## Corrección automática
**No aplicada en esta pasada.** El parche local es pequeño, pero la regla de snapshot debe revisarse conjuntamente para nivel, tipo de IE, grados, lengua, perfil EIB y otros campos heredables; cambiar solo `grades` podría dejar una falsa sensación de integridad mientras otros campos continúan mezclando datos históricos y actuales.

## Riesgo de regresión e impacto
- **IUD:** impacto alto por incoherencia Unidad→Sesión.
- **ICGD:** impacto alto por pérdida de contexto pedagógico aprobado.
- **IFR:** impacto alto por error silencioso aunque no exista Error 500.
- **ISU:** impacto indirecto: el usuario tendría que detectar y corregir manualmente grados equivocados.
- **Prelaunch:** bloquea el E2E Docente hasta demostrar herencia consistente y pruebas reales.

No calcular puntajes definitivos con este hallazgo abierto.