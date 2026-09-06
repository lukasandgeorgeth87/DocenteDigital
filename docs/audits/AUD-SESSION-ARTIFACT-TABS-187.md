# AUD-SESSION-ARTIFACT-TABS-187 — Ficha / Instrumento / Formalización / PPT aparecen como pestañas, pero no existen como artefactos navegables

## Alcance
Auditoría acumulativa V2 + V3 + V4 + V5 + Núcleo IA. Revisión estática del repositorio y contraste con HTML servido en producción. No simula navegador físico ni generación real de PPT/PDF y no modifica CUSCO-DECIDE-ELECCIONES-2026.

## ID de prueba
AUD-SESSION-ARTIFACT-TABS-187

## Módulo
Sesión de aprendizaje · Materiales asociados · UX · Trazabilidad de artefactos

## Entrada
1. Crear/generar una sesión.
2. Observar el bloque de salida de sesión.
3. Intentar acceder a las superficies visibles `Ficha`, `Instrumento`, `Formalización` y `PPT`.
4. Revisar el contrato real de `renderSessionOutput()` y los módulos runtime cargados después de `app.js`.

## Resultado esperado
Si la interfaz presenta esos nombres como pestañas del producto de sesión, cada una debe corresponder a una vista/artefacto real, seleccionable y coherente con la sesión. Como mínimo:
- Ficha: material o actividad vinculada a la sesión y grado.
- Instrumento: instrumento editable/usable derivado del criterio y evidencia.
- Formalización: contenido pertinente solo cuando corresponda al área/proceso, diferenciado por grado cuando aplique.
- PPT: presentación o artefacto exportable/visualizable realmente generado.

Si un artefacto aún no existe, V4/V5 exigen no presentarlo como disponible; debe marcarse claramente `En desarrollo` o retirarse de la superficie principal.

## Resultado obtenido
`index.html` muestra cinco elementos visuales con clase `tab`: `Sesión`, `Ficha`, `Instrumento`, `Formalización` y `PPT`. Solamente `Sesión` está marcada `active`.

Los otros cuatro elementos son `<span>` sin `onclick`, sin `role="tab"`, sin identificador, sin `aria-controls` y sin enlace a paneles asociados.

`renderSessionOutput(session)` únicamente escribe `sessionHtml(session,false)` dentro de `#sessionDocument` y agrega dos acciones: Descargar Word y Compartir. No existe lógica de selección de pestañas ni cambio de contenido para Ficha, Instrumento, Formalización o PPT.

`sessionHtml()` sí incluye dentro del documento principal una tabla denominada `Instrumento breve` y un bloque textual fijo `Formalización / construcción del aprendizaje`, pero esto no convierte las pestañas visibles en superficies funcionales independientes. Tampoco se genera un objeto `ficha`, `ppt`, `slides`, archivo `.pptx` ni representación equivalente asociada a la sesión.

El HTML servido actualmente por `https://docente-digital.vercel.app/` contiene exactamente estas pestañas visibles.

## Evidencia
- `index.html`: `<span class="tab">Ficha</span>`, `<span class="tab">Instrumento</span>`, `<span class="tab">Formalización</span>`, `<span class="tab">PPT</span>` sin manejadores ni paneles asociados.
- `app.js::renderSessionOutput()`: solo renderiza `sessionHtml()` en `sessionDocument` y crea Descargar Word / Compartir.
- `app.js::sessionHtml()`: integra un instrumento breve y una formalización genérica en la misma sesión; no crea artefactos separados.
- `schedule-prompt-v6.js`: carga módulos de sesión y seguridad, pero el loader no declara un módulo específico de generación PPT ni una navegación de estos tabs.
- Producción HTTP 200: la misma superficie `Sesión | Ficha | Instrumento | Formalización | PPT` está presente en el HTML servido.

## PASA / NO PASA
NO PASA

## Clasificación
PARCIAL / SIMULADA EN SUPERFICIE

La sesión principal y su descarga DOCX tienen implementación, pero las cuatro superficies adicionales visibles no poseen contrato funcional como pestañas/artefactos.

## Severidad
S2 — ALTO

Justificación: no constituye por sí sola pérdida/fuga de datos, pero genera una expectativa funcional directa en un flujo principal. Para un docente, `Ficha` y `PPT` son entregables distintos; presentarlos como pestañas sin contenido real contradice la simplicidad/verdad de interfaz de V4 y la obligación V5 de demostrar materiales/exportación utilizables.

## Impacto pedagógico/UX
- Confunde al docente respecto de qué productos fueron realmente generados.
- Puede llevar a creer que existe PPT o ficha lista cuando no existe.
- La `Formalización` aparece como artefacto universal aun cuando pedagógicamente no corresponde usar ese término/proceso en todas las áreas.
- Debilita la trazabilidad Sesión → Material/Ficha → Instrumento → Presentación.

## Acción segura recomendada
Corrección mínima y reversible antes de implementar los artefactos:
1. conservar únicamente la pestaña `Sesión` como activa/real;
2. cambiar `Ficha`, `Instrumento`, `Formalización` y `PPT` por etiquetas explícitas `En desarrollo`, sin apariencia de control seleccionable; o retirarlas temporalmente;
3. no fabricar contenido demostrativo para simular que funcionan.

Implementación definitiva:
- modelo de artefactos asociados a `sessionId`;
- ficha diferenciada por grado;
- instrumento derivado de criterio/evidencia y editable;
- formalización condicional según área/proceso;
- PPT realmente generado, visualizable/exportable y vinculado a la sesión;
- persistencia y reapertura de cada artefacto;
- prueba móvil y exportación real.

## Reprueba obligatoria
- Generar una sesión y comprobar que cada pestaña visible abre contenido real correspondiente.
- Recargar/cerrar y volver a abrir: artefactos conservan relación con la misma sesión.
- Verificar multigrado y EIB.
- Comprobar que `Formalización` no se fuerza cuando no corresponde.
- Probar PPT real en herramienta compatible y revisar que no sea un botón/pestaña simulada.

## Estado
ABIERTO / BLOQUEANTE DE VERDAD DE SUPERFICIE V4-V5 HASTA CORRECCIÓN.
