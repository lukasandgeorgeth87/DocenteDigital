# AUD-MULTIGRADE-ASSESSMENT-NONDIFFERENTIATED-256

## Resumen

**Estado:** NO PASA  
**Severidad:** S1 CRÍTICO  
**Clasificación:** atención/tareas multigrado = PARCIALMENTE FUNCIONAL; evaluación diferenciada por grado = ROTA/INEXISTENTE.

DocenteDigital permite configurar una IE `Multigrado` o `Unidocente`, seleccionar varios grados y genera tareas distintas según el grado. Sin embargo, la misma sesión conserva un único `criterion`, una única `evidence` y un único `instrument` para todos los grados seleccionados. La salida muestra una tabla de tareas diferenciadas por grado, pero el instrumento final contiene una sola fila con el mismo criterio y tres niveles genéricos, sin grado ni descriptor diferenciado.

Esto impide demostrar una evaluación coherente con las exigencias distintas que la propia sesión asigna a cada grado. En una sesión 1.º + 3.º + 5.º, por ejemplo, la tarea de 1.º pide representar con dibujos/material concreto/oralidad, 3.º organiza información y explica procedimientos, y 5.º analiza y justifica con evidencias; aun así, todos quedan bajo el mismo criterio, evidencia e instrumento sin adaptación del desempeño esperado.

## Especificaciones obligatorias aplicadas

- `AUDITORIA_MAESTRA_INTEGRAL_V2.md`: exige coherencia entre sesión → criterio → evidencia → instrumento → registro y atención diferenciada en multigrado.
- `ADENDA_AUDITORIA_EJECUTABLE_V3.md`: una función no aprueba porque aparezca o produzca texto; la viabilidad multigrado debe demostrarse. Su escala clasifica como S1 una sesión multigrado inviable.
- `AUDITORIA_SIMPLICIDAD_USO_V4.md`: el multigrado debe ser simple para el usuario, sin obligarlo a rehacer manualmente la diferenciación que la app afirma realizar.
- `AUDITORIA_PRELANZAMIENTO_V5.md`: Unidad/Proyecto → Sesiones → Evaluación → Registro es recorrido esencial y deben probarse múltiples grados antes del lanzamiento.
- `NUCLEO_IA_DOCENTEDIGITAL.md`: nivel, grados y organización de IE forman parte del significado que debe heredarse y verificarse hasta Evaluación y Registro.

## Evidencia de implementación

En `app.js`:

1. `differentiatedTasks(grades, area, brief)` sí recorre todos los grados y cambia la exigencia según el grado.
2. `criterionFor(area, brief)` no recibe grado y devuelve un único criterio.
3. `evidenceFor(area)` no recibe grado y devuelve una única evidencia.
4. `instrumentFor(area)` no recibe grado y devuelve un único instrumento.
5. `buildSession()` almacena únicamente:

```js
criterion: criterionFor(area,brief),
evidence: evidenceFor(area),
instrument: instrumentFor(area)
```

No existe `criteriaByGrade`, `evidenceByGrade`, `assessmentByGrade` ni estructura equivalente.

6. `sessionHtml()` imprime la diferenciación únicamente en la tabla de tareas:

```html
<th>Grado/edad</th><th>Tarea diferenciada</th>
```

pero después presenta un solo criterio, una sola evidencia y un solo instrumento. El instrumento breve final tiene una única fila:

```html
<tr><th>Criterio</th><th>Logrado</th><th>En proceso</th><th>Requiere apoyo</th></tr>
<tr><td>${session.criterion}</td><td></td><td></td><td></td></tr>
```

No hay columna de grado ni descriptores de expectativa diferenciados.

La misma implementación fue comprobada en `https://docente-digital.vercel.app/app.js` con respuesta HTTP 200.

## Prueba AUD-MUL-256-A — Coherencia tarea ↔ criterio por grado

**Entrada:** Primaria → IE Multigrado → seleccionar `1.º`, `3.º` y `5.º` → Matemática → crear Unidad/Proyecto → crear una sesión.

**Resultado esperado:** si las tareas exigen desempeños diferentes por grado, la evaluación debe poder identificar qué se espera observar en 1.º, 3.º y 5.º. Esto puede resolverse con criterios diferenciados o con un criterio común acompañado de descriptores/indicadores de desempeño claramente diferenciados por grado, conservando trazabilidad con la evidencia y el instrumento.

**Resultado obtenido:** la tarea sí cambia por grado, pero la sesión almacena y muestra un único criterio y una única evidencia para los tres grados. No existe descriptor evaluativo por grado.

**Evidencia:** `differentiatedTasks()` usa el grado; `criterionFor()` y `evidenceFor()` no lo usan; `buildSession()` solo crea un valor único de cada uno.

**Resultado:** **NO PASA**.  
**Severidad:** **S1 CRÍTICO**.  
**Clasificación:** **PARCIALMENTE FUNCIONAL** para diferenciación pedagógica general; **ROTA/INEXISTENTE** para diferenciación evaluativa.

**Acción correctiva:** modelar explícitamente la evaluación multigrado, por ejemplo `assessmentByGrade`, o un criterio común con descriptores por grado cuando pedagógicamente corresponda. La decisión de si corresponde un criterio común o criterios diferenciados debe provenir de la lógica pedagógica/curricular y no de un parche textual automático.

## Prueba AUD-MUL-256-B — Instrumento aplicable a varios grados

**Entrada:** misma sesión multigrado 1.º + 3.º + 5.º → revisar “Instrumento breve”.

**Resultado esperado:** instrumento utilizable para registrar evidencia de cada grado/estudiante de acuerdo con la expectativa correspondiente.

**Resultado obtenido:** una sola fila de criterio y tres columnas genéricas (`Logrado`, `En proceso`, `Requiere apoyo`), sin grado, estudiante ni descriptor diferenciado. El instrumento no permite distinguir si el logro evaluado corresponde a la tarea de 1.º, 3.º o 5.º.

**Resultado:** **NO PASA**.  
**Severidad:** S1, absorbida por AUD-256-A por compartir causa raíz.

**Acción correctiva:** generar una matriz/instrumento que mantenga vínculo `grado → criterio/descriptores → evidencia → estudiante/valoración`, sin duplicar trabajo innecesario al docente.

## Causa raíz

La implementación diferencia la **actividad** pero no el **modelo de evaluación**. La estructura de la sesión fue diseñada con campos escalares (`criterion`, `evidence`, `instrument`) aun cuando `grades` es una colección. Como consecuencia, la complejidad multigrado desaparece precisamente en el tramo evaluación/registro.

## Corrección segura propuesta

No se aplica parche automático en esta auditoría porque resolverlo correctamente requiere decisión pedagógica/curricular y debe integrarse con el futuro Registro Auxiliar. Un cambio seguro requiere:

1. Definir contrato de evaluación multigrado.
2. Mantener un criterio común solo cuando sea pedagógicamente válido y diferenciar la expectativa por grado.
3. Permitir criterios diferenciados cuando la competencia/tarea lo requiera.
4. Persistir procedencia y relación con unidad, sesión, grado y evidencia.
5. Generar instrumento utilizable por grado/estudiante.
6. Heredar esa estructura hacia Evaluación y Registro.
7. Probar combinaciones 1.º/3.º/5.º, 2.º/4.º/6.º y un solo grado como control.
8. Validar con docentes multigrado reales antes de cerrar V5.

## No duplicación del acumulado

El árbol actual de `docs/audits` no contiene un hallazgo dedicado a la ausencia de diferenciación de `criterion/evidence/instrument` por grado en sesiones multigrado. AUD-256 se distingue de los hallazgos de snapshot de grados, formalización, propósito, instrumentos por área y evaluación simulada: aquí la falla específica es la ruptura entre **tarea diferenciada por grado** y **evaluación no diferenciada** dentro de la propia sesión.

## Riesgo de regresión

**Medio/alto.** Cambiar el esquema de evaluación afecta sesiones guardadas, exportación, instrumentos y futura integración con Registro Auxiliar. Debe existir migración compatible para sesiones históricas; no se deben reinterpretar ni modificar documentos ya emitidos.

## Impacto en indicadores

- **IUD/ICGD:** impacto negativo por incoherencia interna de la sesión multigrado.
- **IFR:** impacto negativo porque la función parece completa pero no demuestra evaluabilidad por grado.
- **ISU:** impacto negativo si el docente debe reconstruir manualmente criterios/instrumentos para cada grado.
- **Prelaunch:** bloqueante mientras no se demuestre una sesión multigrado evaluable extremo a extremo.
- No se calcula puntaje definitivo.

## Pruebas que permanecen PENDIENTES

- Validación pedagógica con docente multigrado real.
- Registro por estudiantes reales y recuperación posterior.
- Impresión/Word físico de instrumentos multigrado.
- Prueba en celular físico.
- Integración real Sesión → Evaluación → Registro → Seguimiento.

## Normativa externa

Este hallazgo se sustenta en las especificaciones internas obligatorias V2–V5 y Núcleo IA, además del comportamiento observable del runtime. No se aplica ni se declara vigente en este informe una norma MINEDU/UGEL externa; por tanto, no se atribuye ninguna exigencia normativa externa sin verificación oficial.