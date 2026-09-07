# AUD-HISTORICAL-UNIT-SITUATION-GRADE-DRIFT-213

## Estado

- **ID:** AUD-HIST-UNIT-213
- **Módulo:** Unidad/Proyecto · persistencia histórica · exportación
- **Resultado:** NO PASA
- **Clasificación:** PARCIALMENTE FUNCIONAL / ROTA para reconstrucción de unidades históricas incompletas
- **Severidad:** S1 CRÍTICO — bloqueante V5
- **Corrección automática en esta ejecución:** NO aplicada; requiere modificar `app.js` de forma controlada y retestar unidades nuevas y legadas.

## Especificaciones obligatorias aplicadas

Se aplican conjuntamente V2, V3, V4, V5 y Núcleo IA. Para este hallazgo no se necesita declarar vigente ninguna norma MINEDU/UGEL externa: es un defecto de integridad documental y trazabilidad interna.

V3 exige fuente única de verdad, procedencia y establece expresamente que los documentos históricos emitidos deben conservar los datos vigentes al momento de su emisión; los cambios posteriores en datos maestros no deben modificar documentos históricos retroactivamente.

V5 exige guardar, recuperar, editar y exportar sin pérdida ni reescritura silenciosa, y obliga a probar el ciclo completo durante el año escolar.

## Prueba AUD-HIST-UNIT-213-A

### Entrada

1. Tener una unidad/proyecto guardado con `unit.grades`, por ejemplo `1.º, 3.º, 5.º`.
2. La unidad legada contiene `situationBrief` y una `situation` corta o ausente (menos de 180 caracteres), escenario compatible con datos previos/migrados.
3. Cambiar posteriormente la configuración/Ficha Maestra a otros grados, por ejemplo `2.º, 4.º, 6.º`.
4. Volver a abrir la unidad histórica o descargar su Word.

### Resultado esperado

La unidad debe conservar y mostrar exactamente el contexto documental correspondiente a sus propios datos históricos. Si necesita reconstruir una situación significativa legada, debe usar `unit.grades`, no los grados actuales de `state`.

### Resultado obtenido

`unitSituation(unit)` decide reconstruir situaciones cortas mediante:

```js
expandSituation(unit.situationBrief||unit.situation||'')
```

pero `expandSituation(brief)` obtiene los grados desde:

```js
const grades=state.grades.join(', ');
```

Por tanto la reconstrucción utiliza la configuración global **actual** en lugar de `unit.grades`.

La misma función `unitSituation(unit)` se usa tanto en `renderUnitOutput(unit)` como en `unitWordHtml(unit)`. En consecuencia, una unidad legada puede mostrar/exportar una situación significativa con grados diferentes de los que la propia unidad conserva en sus metadatos.

### Evidencia técnica

- `app.js`: `expandSituation()` depende de `state.grades`.
- `app.js`: `unitSituation(unit)` llama a `expandSituation()` sin pasar contexto histórico.
- `app.js`: `renderUnitOutput()` usa `unitSituation(unit)`.
- `app.js`: `unitWordHtml()` usa `unitSituation(unit)`.

### PASA/NO PASA

**NO PASA**.

## Impacto

- Puede existir contradicción dentro del mismo documento: encabezado con `unit.grades` históricos y situación significativa redactada con `state.grades` actuales.
- Viola integridad de históricos y procedencia.
- Afecta vista, Word y compartir porque la reconstrucción se reutiliza en esas rutas.
- Puede afectar trazabilidad Unidad → Sesiones si el docente interpreta como vigente un contexto reconstruido con datos posteriores.
- Impacta negativamente ICGD/IFR y mantiene bloqueado Prelaunch; no se calcula puntuación definitiva.

## Causa raíz

Uso de estado global mutable (`state.grades`) dentro de una función que también se reutiliza para reconstruir documentos históricos. Falta separar contexto de generación actual y contexto persistido del documento.

## Acción correctiva requerida

Cambio pequeño recomendado:

1. Permitir que `expandSituation()` reciba explícitamente los grados/contexto a utilizar, manteniendo `state.grades` solo como valor por defecto para creación nueva.
2. En `unitSituation(unit)`, al reconstruir una unidad existente, pasar siempre `unit.grades`.
3. No reescribir automáticamente la `situation` almacenada en históricos ya emitidos.
4. Añadir prueba de regresión con unidad legada:
   - crear/inyectar unidad A con grados A y situación corta;
   - cambiar Ficha Maestra a grados B;
   - abrir y exportar A;
   - comprobar que encabezado y situación continúan usando grados A.
5. Repetir con cambio de nivel y tipo de IE.

## Riesgo de regresión

Medio si se cambia globalmente `expandSituation()` sin distinguir creación nueva de reconstrucción histórica. Bajo si se introduce un parámetro explícito y se conserva el comportamiento actual para nuevas unidades.

## Evidencia posterior requerida para cerrar

- prueba automatizada reproducible del caso anterior;
- inspección de vista y exportación;
- verificación en producción del runtime realmente cargado;
- HTTP 200 y deployment READY;
- prueba física de Word permanece PENDIENTE hasta abrir el archivo real en dispositivo/Word compatible.

## Estado de lanzamiento

**DocenteDigital NO está lista para lanzamiento V1.0.** Este hallazgo se suma a los bloqueantes abiertos y no puede ser ocultado por una puntuación alta.