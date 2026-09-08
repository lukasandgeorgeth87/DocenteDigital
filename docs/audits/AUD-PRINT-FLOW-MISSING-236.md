# AUD-PRINT-FLOW-MISSING-236 — Flujo de impresión inexistente

## Especificaciones aplicadas
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

## Alcance
Carpeta Docente → Unidad/Proyecto y Sesión → ciclo de salida profesional.

## Prueba principal
**ID:** AUD-PRINT-236-A  
**Entrada:** disponer de una Unidad/Proyecto o Sesión preparada y querer imprimirla desde la app.  
**Resultado esperado:** V4 define `Vista previa → Word / PDF / Imprimir`; V5 exige probar impresión real y, dentro del ciclo funcional de documentos, incluye `imprimir`. Debe existir una acción clara de impresión o un flujo explícito de vista previa imprimible que no induzca a creer que está disponible si aún no lo está.  
**Resultado obtenido:** el runtime productivo ofrece descarga/compartición Word/DOCX para unidades y sesiones, pero no existe acción `Imprimir`, función `window.print()`, `print()` equivalente ni una superficie específica de impresión. La búsqueda del repositorio por `window.print`, `print(` e `Imprimir` no devuelve una implementación funcional. `docx-export-v29.js` implementa DOCX y compartir, no impresión.  
**PASA/NO PASA:** NO PASA.  
**Clasificación:** INEXISTENTE.  
**Severidad:** S2 ALTO.

## Evidencia técnica
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`, regla 32: `Vista previa → Word / PDF / Imprimir`.
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`, secciones 3 y 9: probar imprimir documentos y realizar impresión real.
- `index.html`: las superficies de Unidad/Sesión no muestran acción de impresión.
- `app.js`: no define flujo de impresión.
- `docx-export-v29.js`: define descarga y compartición DOCX, sin `window.print()` ni equivalente.
- Búsqueda del repositorio por `window.print`, `print(` e `Imprimir`: sin implementación funcional encontrada.

## Causa raíz
El producto ha avanzado en exportación DOCX y compartición, pero el contrato de salida profesional todavía no implementa la tercera vía exigida por V4/V5: impresión directa/controlada desde una vista previa utilizable.

## Acción correctiva recomendada
1. definir una vista previa imprimible única por tipo de documento;
2. añadir acción `Imprimir` claramente separada de `Descargar Word`;
3. crear CSS `@media print` que oculte navegación/controles y preserve tablas, márgenes, saltos e identidad documental;
4. evitar modificar el documento histórico al imprimir;
5. probar caracteres quechua, tablas, páginas múltiples, orientación y encabezados;
6. retestar en Chrome/Edge y móvil donde el navegador permita impresión/guardar PDF;
7. mantener el estado como PENDIENTE hasta realizar impresión física/real conforme V5.

## Corrección directa
No se implementa en esta ronda. Añadir un simple `window.print()` sin hoja de estilo, control de páginas y prueba real podría producir una salida aparentemente funcional pero defectuosa. Esto violaría V3 y V5.

## Riesgo de regresión
Medio si se implementa sin una vista de impresión aislada: la UI, botones, sidebar o tablas podrían aparecer cortados o imprimirse incorrectamente.

## Impacto cualitativo
- **IUD/ICGD:** salida documental incompleta.
- **IFR:** una operación obligatoria V5 permanece inexistente.
- **ISU:** el usuario debe descargar y abrir otra aplicación para imprimir.
- **Prelaunch:** NO PASA esta prueba; no se calcula puntaje definitivo.

## Pendientes no simulados
- impresión física real;
- comparación visual app ↔ Word ↔ PDF ↔ impresión;
- pruebas en impresoras y dispositivos reales;
- al menos 20 documentos Word/PDF/impresión según V5.

No se aplica ni declara vigente normativa MINEDU/UGEL externa para clasificar este hallazgo.