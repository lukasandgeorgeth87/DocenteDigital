# AUD-SESSION-RESOURCES-COSMETIC-215 — “Recursos de hoy” no adapta la sesión

## ID
**AUD-SESSION-RESOURCES-COSMETIC-215**

## Módulo
Carpeta Docente → Sesión → Recursos de hoy.

## Entrada
1. Abrir una Unidad/Proyecto real y seleccionar una actividad.
2. Generar la misma sesión cuatro veces, cambiando únicamente `Recursos de hoy`: `Materiales básicos`, `Con impresora`, `TV/proyector`, `Tabletas/celulares`.
3. Comparar Inicio, Desarrollo, Cierre, reto, tareas diferenciadas, evidencia e instrucciones de uso/alternativa del recurso.

## Resultado esperado
La selección debe afectar realmente la propuesta: una sesión con TV/proyector debe integrar una acción pertinente con ese recurso y ofrecer alternativa no digital; una sesión con impresora debe proponer material imprimible cuando corresponda; tabletas/celulares debe modificar la dinámica de uso; `Materiales básicos` debe ser ejecutable sin esos equipos. V3 exige demostrar funcionalidad por efectos observables y no aprobar un control porque aparezca o guarde texto. V4 exige una interfaz simple en la que cada control visible tenga utilidad real. V5 exige probar el recorrido Docente completo y la continuidad sin IA/condiciones reales de uso antes del lanzamiento.

## Resultado obtenido
`buildSession()` sí lee el selector y guarda literalmente el valor en `session.resources`:

```js
const resources=byId('sessionResources')?.value||'Materiales básicos';
...
resources,
```

Pero `sessionHtml()` utiliza ese valor únicamente en una línea informativa:

```html
<p><b>Recursos:</b> ${escapeHtml(session.resources)}. Se debe ofrecer alternativa no digital cuando corresponda.</p>
```

El resto del documento —Inicio, reto, Desarrollo, tareas diferenciadas, formalización, Cierre e instrumento— no recibe `resources` como condición ni cambia según la opción elegida. `challengeFor()`, `differentiatedTasks()`, `criterionFor()` y `evidenceFor()` tampoco reciben el recurso seleccionado. Por tanto, cambiar `Materiales básicos` por `TV/proyector` o `Tabletas/celulares` produce esencialmente la misma propuesta pedagógica, salvo la etiqueta de recursos.

La frase “Se debe ofrecer alternativa no digital cuando corresponda” tampoco implementa dicha alternativa; solo declara que debería existir.

## Evidencia
- `index.html`: selector `#sessionResources` ofrece cuatro configuraciones distintas.
- `app.js`: `buildSession()` persiste el valor seleccionado.
- `app.js`: `sessionHtml()` solo lo imprime como texto; no condiciona las estrategias ni actividades.
- Producción `https://docente-digital.vercel.app/app.js` sirve el mismo runtime con HTTP 200 en esta revisión.

## PASA / NO PASA
**NO PASA**.

## Clasificación
**PARCIALMENTE FUNCIONAL**: el control guarda y muestra el valor, pero no cumple su finalidad de adaptar la sesión.

## Severidad
**S2 — IMPORTANTE**.

No produce pérdida de datos ni caída, pero crea una promesa de adaptación que el producto no ejecuta y puede dejar una sesión impracticable en una IE sin el recurso elegido o sin alternativa concreta. No elevo a S1 porque el resto de la sesión puede generarse; el cierre de V1.0 sigue bloqueado por S0/S1 ya existentes.

## Causa raíz
El modelo de sesión trata `resources` como metadato de presentación y no como entrada de generación/adaptación.

## Acción correctiva
1. Introducir una función explícita y auditable, por ejemplo `resourcePlan(resources, area, activity, grades)`, que devuelva uso pedagógico + alternativa offline/no digital.
2. Insertar ese plan en Desarrollo y, cuando corresponda, en Inicio/Cierre y materiales.
3. Mantener `Materiales básicos` como baseline totalmente ejecutable sin infraestructura digital.
4. No afirmar disponibilidad de ficha imprimible, PPT o recurso digital si el artefacto real no existe.
5. Añadir prueba automática diferencial: mismas entradas salvo `resources` deben producir diferencias observables y coherentes, no solo una etiqueta distinta.
6. Retestar en móvil y en una prueba real sin TV/impresora/tabletas antes de cerrar V5.

## Corrección automática
**No aplicada.** La solución cambia decisiones pedagógicas y la relación entre sesión y materiales; requiere diseño deliberado y pruebas E2E. Añadir textos genéricos diferentes para cada opción solo reemplazaría una simulación por otra.

## Riesgo de regresión e impacto
- **IUD:** medio; el control visible no entrega el efecto que promete.
- **ICGD:** medio; la sesión no se adapta a recursos disponibles.
- **IFR:** medio; fallo silencioso sin error técnico.
- **ISU:** medio; el docente debe adaptar manualmente.
- **Prelaunch:** evidencia negativa adicional; no modifica por sí sola la prioridad de los S0/S1 ya abiertos.

No se calculan puntajes definitivos.