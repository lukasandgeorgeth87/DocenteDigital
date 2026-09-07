# AUD-UNIT-EDIT-ABSENT-211 — Una Unidad/Proyecto guardada no puede editarse y volver a guardarse

## ID
**AUD-UNIT-EDIT-ABSENT-211**

## Prioridad
V4/V5 · Carpeta Docente · Unidad/Proyecto · persistencia · trazabilidad · UX.

## Entrada
1. Completar la configuración de la IE.
2. Crear y guardar una Unidad/Proyecto real.
3. Abrir `Mi planificación → Mis unidades/proyectos`.
4. Abrir la unidad guardada.
5. Intentar corregir posteriormente título, duración, situación significativa, producto o secuencia y conservar la misma identidad documental.

## Esperado
Una función V1.0 debe permitir como mínimo `crear → guardar → recuperar → editar → volver a guardar → exportar`, conservando identidad, procedencia e histórico cuando corresponda.

V5 incluye expresamente en Carpeta Docente `Guardar, recuperar, editar y exportar` y exige en pruebas funcionales crear/editar IE y crear/guardar/editar/duplicar/buscar/descargar/imprimir/eliminar/recuperar documentos. También prohíbe aprobar módulos aislados que obliguen a reescribir información al avanzar.

## Obtenido
El runtime canónico permite crear una unidad nueva mediante `createUnitDemo()`, verla con `viewUnit()`, usarla para sesiones, descargarla en Word y eliminarla.

En `renderUnits()` las únicas acciones por documento son:
- `Ver`;
- `Crear sesiones`;
- `Word`;
- `Eliminar`.

En `renderUnitOutput()` las acciones son:
- `Crear sesiones`;
- `Descargar Word`;
- `Compartir`;
- `Crear otra`.

No existe control `Editar`, ni función `editUnit()`, `updateUnit()` o equivalente en `app.js`. La pantalla `Crear unidad/proyecto` siempre construye un objeto nuevo con `id:'u'+Date.now()` y lo inserta con `state.units.unshift(unit)`; no dispone de modo de edición ligado a un `unit.id` existente.

La producción canónica servida por Vercel mantiene la misma superficie: el HTML describe `Mis unidades/proyectos` como biblioteca para abrir, descargar o reutilizar, y no incluye acción de edición. Los scripts cargados en producción son el runtime reducido conocido (`app.js` + guardas/capas actuales), sin una capa de edición de unidades conectada.

## Evidencia
- `app.js`: la creación siempre asigna un ID nuevo y agrega una nueva unidad.
- `app.js::renderUnits()`: no ofrece editar.
- `app.js::renderUnitOutput()`: no ofrece editar.
- Producción `https://docente-digital.vercel.app/`: HTTP 200; la biblioteca y salida de Unidad/Proyecto no contienen control de edición.
- V5: Carpeta Docente incluye guardar, recuperar, editar y exportar; sus pruebas funcionales exigen editar documentos.

## PASA / NO PASA
**NO PASA**

## Clasificación
**PARCIALMENTE FUNCIONAL / edición INEXISTENTE**.

- Crear: FUNCIONAL sujeto a los demás bloqueantes pedagógicos/semánticos.
- Guardar: FUNCIONAL localmente.
- Recuperar/abrir: PARCIALMENTE FUNCIONAL.
- Editar una unidad existente: INEXISTENTE.
- Guardar una edición conservando identidad: INEXISTENTE.
- Versionado/histórico de modificaciones: INEXISTENTE / no demostrado.

## Severidad
**S1 — CRÍTICO / bloqueante V5**.

No es solo una comodidad. En un ciclo escolar real, una unidad requiere reajustes por diagnóstico, avances, calendario, contexto, evidencias y decisiones docentes. Sin edición persistente, el usuario debe crear otra unidad o aceptar un documento desactualizado, lo que rompe el flujo E2E y dificulta la trazabilidad Unidad → Sesiones → Evaluación.

## Riesgo pedagógico y de trazabilidad
Si el docente crea otra unidad para corregir la anterior:
- cambia el `unit.id`;
- las sesiones ya asociadas continúan apuntando al documento anterior;
- puede coexistir una versión vieja y otra nueva sin relación explícita;
- no existe `revision`, `updatedAt`, `parentRevisionId` ni historial de cambios que explique cuál es vigente.

Por ello, resolver la ausencia únicamente duplicando una unidad no es equivalente a editarla.

## Acción requerida
Implementar un modo de edición explícito y versionable:
1. `Editar` abre los datos persistidos de la unidad elegida.
2. El guardado actualiza el mismo documento o crea una revisión explícitamente relacionada, según la política definida.
3. Mantener `createdAt` y añadir `updatedAt`/`revision`/procedencia.
4. Confirmar qué cambios se propagan a sesiones existentes y cuáles solo afectan sesiones nuevas; nunca reinterpretar históricos silenciosamente.
5. Permitir cancelar sin mutar el documento.
6. Retestar recarga, cierre/reapertura, exportación y relación Unidad → Sesiones.

## Pruebas mínimas
1. Crear A → editar título → guardar → recargar → A conserva el mismo ID y el nuevo título.
2. Editar situación/producto → cancelar → A queda intacta.
3. Editar A con sesiones existentes → estas no cambian silenciosamente.
4. Crear sesión nueva después de editar → hereda la revisión vigente definida.
5. Exportar tras editar → el archivo corresponde a la versión mostrada.
6. Historial/procedencia permite identificar creación y última modificación.

## Corrección automática
**No aplicada.** Añadir un botón o reutilizar el formulario sin una política de identidad/versionado sería una función simulada y podría agravar los problemas de snapshot y trazabilidad ya abiertos. La implementación debe resolverse junto con la política documental de históricos.

## Estado Prelaunch
Este hallazgo mantiene abierto el gate V5 de Carpeta Docente. No declarar lista la V1.0 mientras una unidad guardada no pueda editarse y persistirse de forma trazable.
