# AUD-DIAGNOSTIC-EMPTY-180 — Evaluación diagnóstica expuesta pero sin generación real

## Resumen
La interfaz ofrece `Evaluación diagnóstica` como parte de `Mi planificación`, pero el flujo actual no genera contenido diagnóstico. La acción `generateDiagnostic()` únicamente retira la clase `hidden` de un contenedor vacío (`#diagnosticResult`). No existe en ese flujo construcción de instrumento, criterios, ítems, evidencias, persistencia, edición, recuperación ni conexión posterior con Programación/Unidad.

## Especificaciones aplicadas
- V2: DocenteDigital debe funcionar como sistema integral, reutilizar diagnóstico/contexto y sostener trazabilidad curricular entre planificación, sesiones, evaluación y registro.
- V3: una función no aprueba por aparecer o responder; debe probar entrada → resultado esperado → resultado obtenido → evidencia → estado → severidad → corrección.
- V4: la superficie debe ser simple y no inducir al usuario a creer que una función está lista si no entrega un resultado utilizable.
- V5: el flujo Docente debe probarse extremo a extremo y las funciones críticas deben guardar, recuperar, editar y exportar cuando corresponda.
- Núcleo IA: comprender → estructurar → verificar → proponer → auditar; el diagnóstico debe heredarse a Programación/Unidad cuando forme parte del contexto aprobado.

## Prueba
**ID:** AUD-DIAGNOSTIC-EMPTY-180  
**Módulo:** Carpeta Docente / Mi planificación / Evaluación diagnóstica  
**Persona:** docente principiante y experimentado / QA  

### Entrada
1. Configurar perfil de IE.
2. Ir a `Mi planificación`.
3. Pulsar `Crear diagnóstico`.
4. Elegir Área y Tipo.
5. Pulsar `✨ Crear diagnóstico`.

### Resultado esperado
El sistema debe producir un diagnóstico utilizable y verificable acorde con nivel, grado, área y tipo seleccionado; como mínimo debe generar contenido visible, permitir revisión y conservar la información necesaria para que pueda alimentar la planificación posterior sin reescritura innecesaria.

### Resultado obtenido
En `app.js` la implementación vigente es:

```js
function generateDiagnostic(){byId('diagnosticResult').classList.remove('hidden')}
```

En `index.html`, `#diagnosticResult` se declara vacío:

```html
<div id="diagnosticResult" class="hidden"></div>
```

Por tanto, la acción solo hace visible un contenedor sin contenido. No existe resultado diagnóstico real en este flujo.

## Estado
- **PASA/NO PASA:** NO PASA
- **Clasificación:** SIMULADA / ROTA en generación
- **Severidad:** S2 ALTO

## Causa raíz
La interfaz fue cableada antes de que existiera un modelo funcional de diagnóstico. El botón produce una transición visual, pero no existe lógica de generación, persistencia ni herencia de datos.

## Acción correctiva
No corregir con texto estático ni con una plantilla genérica. Implementar un objeto de diagnóstico estructurado y trazable con, cuando corresponda:
- nivel/grado/área;
- propósito del diagnóstico;
- referencia curricular oficial verificada;
- criterios o aspectos a observar;
- ítems/tareas pertinentes;
- tipo de aplicación;
- evidencias/resultados registrados por el docente;
- estado de borrador/revisión;
- persistencia y recuperación;
- relación con Programación/Unidad;
- exportación cuando corresponda.

Mientras no exista esa implementación real, la interfaz debe marcar la función explícitamente como `En desarrollo` / `Próximamente` o deshabilitar la acción para no comunicar una disponibilidad falsa.

## Riesgo de regresión
MEDIO. La implementación futura debe evitar mezclar diagnóstico de entrada con calificación sumativa y no debe convertir automáticamente resultados en decisiones pedagógicas definitivas.

## Impacto
- **IUD:** negativo; el usuario ejecuta pasos sin obtener producto.
- **ICGD:** negativo; el diagnóstico no alimenta la planificación.
- **IFR:** negativo; función visible sin resultado real.
- **ISU:** negativo; genera confusión pese a una superficie aparentemente simple.
- **Prelaunch:** mantiene el gate V5 abierto hasta demostrar el flujo funcional.

## Evidencia posterior requerida para cerrar
1. Prueba real en navegador con contenido generado.
2. Guardar → recargar → recuperar.
3. Editar y volver a abrir.
4. Verificar herencia hacia Programación/Unidad.
5. Probar Inicial, Primaria y Secundaria.
6. Probar multigrado/unidocente cuando corresponda.
7. Verificar que no inventa competencias ni aprendizajes oficiales.
8. Confirmar producción READY + HTTP 200 después de la corrección.

## Estado de cierre
**ABIERTO — no corregido en este hallazgo.**
