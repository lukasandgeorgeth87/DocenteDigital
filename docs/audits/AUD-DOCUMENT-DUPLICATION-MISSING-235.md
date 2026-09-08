# AUD-DOCUMENT-DUPLICATION-MISSING-235 — Duplicación intencional de documentos inexistente

## Especificaciones aplicadas
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

## Alcance
Carpeta Docente → Mis unidades/proyectos → ciclo de vida documental.

## Prueba principal
**ID:** AUD-DOC-DUP-235-A  
**Entrada:** disponer de una Unidad/Proyecto guardada y querer reutilizarla como punto de partida para una nueva planificación sin alterar el original.  
**Resultado esperado:** acción explícita `Duplicar` que cree un nuevo documento con ID propio, preserve el original, indique procedencia (`duplicatedFromId`) y permita editar el duplicado sin modificar históricos. V5 exige probar crear/guardar/editar/**duplicar**/buscar/descargar/imprimir/eliminar/recuperar documentos.  
**Resultado obtenido:** la biblioteca productiva ofrece Abrir/Ver, Crear sesiones, Word y Eliminar. El módulo de archivo simplificado conserva Abrir, Crear sesiones y, en Más, Word/Eliminar. No existe acción `Duplicar`, ni función `duplicateUnit`, `cloneUnit` o equivalente demostrada. La creación mediante `createUnitDemo()` siempre parte del formulario y crea un documento nuevo sin vínculo de procedencia con otro documento.  
**PASA/NO PASA:** NO PASA.  
**Clasificación:** INEXISTENTE.  
**Severidad:** S2 ALTO.

## Evidencia técnica
- `index.html`: la biblioteca de unidades/proyectos no ofrece `Duplicar`.
- `app.js`: `renderUnits()` ofrece Ver, Crear sesiones, Word y Eliminar; `createUnitDemo()` crea un ID nuevo con `Date.now()` pero no clona ni registra procedencia.
- `planning-archive-simplicity-v56.js`: tanto Modo Fácil como Experto omiten una acción de duplicación.
- Búsqueda del repositorio por `Duplicar` no devuelve una implementación funcional.

## Diferencia frente a hallazgos de doble clic
Este hallazgo NO duplica `AUD-FUN-DUPLICATE-105` ni `AUD-UNIT-DOUBLE-CLICK-DUPLICATION-218`. Esos controles tratan la duplicación accidental causada por doble clic. AUD-235 trata la duplicación **intencional y controlada** de un documento como función de ciclo de vida exigida por V5.

## Causa raíz
El modelo documental actual prioriza crear, abrir, exportar y eliminar, pero no define una operación de clonación/versionado reutilizable.

## Acción correctiva recomendada
Implementar una operación de duplicación documental que:
1. genere ID nuevo;
2. conserve el original sin cambios;
3. copie el snapshot estable del documento;
4. registre `duplicatedFromId`, `createdAt`, `updatedAt` y versión de esquema;
5. no copie estados de emisión/aprobación que deban ser únicos;
6. no modifique sesiones históricas del original;
7. abra el duplicado como borrador editable;
8. sea idempotente ante doble clic mediante la guarda ya existente y, cuando haya backend, mediante idempotencia server-side.

## Riesgo de regresión
Medio. Duplicar correctamente requiere una política clara de qué campos se copian y cuáles se reinician. Un `JSON.parse(JSON.stringify(unit))` con ID nuevo sería insuficiente porque podría copiar estados o relaciones que no deberían heredarse.

## Impacto cualitativo
- **IUD/ICGD:** reutilización documental todavía incompleta.
- **IFR:** falta una operación funcional expresamente incluida en V5.
- **ISU:** el docente debe recrear manualmente una planificación parecida.
- **Prelaunch:** NO PASA esta prueba V5; no se calcula puntaje definitivo.

## Pendientes no simulados
- prueba interactiva con navegador real;
- política de duplicación de sesiones/materiales/evaluaciones cuando existan como entidades persistentes;
- pruebas con históricos emitidos;
- pruebas multiusuario/backend.

No se aplica normativa externa MINEDU/UGEL para clasificar este hallazgo.