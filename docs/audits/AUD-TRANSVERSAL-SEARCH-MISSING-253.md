# AUD-TRANSVERSAL-SEARCH-MISSING-253

**Fecha de auditoría:** 2026-09-08  
**Módulo:** Navegación / recuperación de documentos / Archivo Director  
**Estado:** NO PASA  
**Clasificación:** INEXISTENTE  
**Severidad:** S2 — ALTO

## Especificaciones obligatorias utilizadas conjuntamente

Se revisaron conjuntamente antes de esta prueba:

- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

V4 exige explícitamente **“Buscador único y sencillo”** para buscar por tema, documento, fecha, estudiante o palabra relacionada, además de “Recientes y favoritos”. V5 incluye **Archivo, buscador y correlativos** entre las funciones esenciales de Carpeta Director V1.0, exige probar crear/editar/duplicar/**buscar**/descargar/imprimir/eliminar/recuperar documentos y, en la simulación de año completo, verificar buscador, archivo, historial, velocidad y organización.

## Prueba AUD-SEARCH-253-A

**Entrada**  
Con una instalación que acumule unidades, sesiones, materiales, evaluaciones y documentos directivos, intentar localizar desde la interfaz un artefacto guardado por una consulta natural como `biohuerto`, por título, tipo, fecha, grado, estudiante o palabra relacionada.

**Resultado esperado**  
Debe existir un buscador visible, único y sencillo que permita localizar artefactos guardados sin recorrer manualmente cada módulo. El resultado debe abrir el artefacto correcto, conservar el contexto histórico y respetar el rol/IE correspondiente. La interfaz no debe exponer telemetría ni parámetros técnicos.

**Resultado obtenido**  
NO existe un buscador transversal visible en `index.html`. El menú principal ofrece Inicio, Mi planificación, Crear mi sesión, Materiales, Evaluación, Director y Configuración; la biblioteca visible se limita a “Mis unidades/proyectos”. El espacio Director servido por el runtime base tampoco presenta una entrada visible de Archivo/Buscador. Las búsquedas de código por `buscador`, `Buscar`, `search(`, `Mis documentos` e `historial` no encontraron una implementación de búsqueda de artefactos en el runtime base. No se encontró un índice de documentos ni un controlador de consulta de usuario que satisfaga V4/V5.

**Evidencia**

- `index.html`: navegación principal sin buscador transversal.
- `index.html`: biblioteca local limitada a `Mis unidades/proyectos`.
- `index.html`: Espacio del Director sin Archivo/Buscador visible en el runtime base.
- `app.js`: no se identificó un controlador de búsqueda transversal de artefactos.
- Búsqueda de código en la rama por defecto: sin coincidencias funcionales para `buscador`, `Buscar`, `search(`, `Mis documentos` o `historial` que implementen esta capacidad.

**PASA / NO PASA:** NO PASA  
**Clasificación:** INEXISTENTE  
**Severidad:** S2 — ALTO

## Causa raíz

La arquitectura visible sigue organizada por pantallas y colecciones particulares, principalmente unidades/proyectos y el último objeto activo, pero no demuestra una capa canónica de artefactos consultables. Falta un modelo común que permita indexar de forma segura título, tipo, fecha, grado/estudiante cuando corresponda, contexto, estado, rol, IE y referencia histórica.

## Acción correctiva recomendada

No se recomienda añadir un `<input>` aislado con filtrado superficial. La corrección debe introducir una búsqueda simple para el usuario y segura internamente:

1. definir identidad estable de artefactos y metadatos mínimos buscables;
2. indexar únicamente información autorizada para el rol/IE actual;
3. buscar por título, tema, tipo, fecha y palabras relacionadas, y por estudiante solo cuando exista una entidad de estudiante segura y autorizada;
4. abrir el artefacto exacto sin alterar snapshots históricos;
5. incorporar Archivo/Mis documentos de manera coherente con V4;
6. probar acentos, quechua, nombres extensos, títulos duplicados, datos históricos y cero resultados;
7. probar al menos grandes volúmenes del ciclo marzo–diciembre antes de aprobar rendimiento/organización;
8. cuando exista backend multiusuario, probar aislamiento para impedir resultados de otra IE o usuario.

## Corrección aplicada en esta ronda

**Ninguna modificación funcional.** Implementar el buscador afecta identidad documental, persistencia, históricos, autorización futura y aislamiento. No es un cambio pequeño y verificable de bajo riesgo; por V3/V5 queda pendiente hasta disponer de la arquitectura necesaria y pruebas reales.

## Riesgo de regresión

**MEDIO/ALTO** si se implementa sin modelo canónico: resultados desactualizados, apertura del documento equivocado, pérdida de referencia histórica, duplicados y, en arquitectura multiusuario, potencial exposición de metadatos entre usuarios/IE.

## Impacto cualitativo en métricas

- **IUD:** impacto negativo en localización y reutilización documental.
- **ICGD:** impacto negativo en continuidad Director → Archivo → Seguimiento.
- **IFR:** no se calcula valor definitivo; falta evidencia de recuperación/búsqueda a escala.
- **ISU:** impacto negativo directo en “Encontrar funciones” y eficiencia, sin calcular puntuación definitiva.
- **Prelaunch:** incumple funciones V1.0 de Director y pruebas obligatorias de búsqueda; no convierte por sí solo el sistema en S0/S1, pero impide aprobar esos criterios.

## Normativa externa

No se aplicó ni se declaró vigente ninguna norma MINEDU/UGEL externa en este hallazgo. La no conformidad deriva de las especificaciones internas obligatorias V4/V5 y de la implementación observada; por tanto no corresponde inventar o atribuir una exigencia normativa externa.

## Gate de lanzamiento

DocenteDigital **NO debe declararse lista para V1.0** por este hallazgo ni mientras continúen bloqueantes S0/S1 o falten pruebas reales esenciales establecidas en V5. No se calcula ISU, IFR ni Prelaunch Score definitivo en este informe.