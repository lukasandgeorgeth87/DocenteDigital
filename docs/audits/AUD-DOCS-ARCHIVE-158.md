# AUD-DOCS-ARCHIVE-158 — Buscador, archivo documental y papelera no existen como funciones reales

## Alcance
Auditoría V2 + V3 + V4 + V5 + Núcleo IA aplicada al estado productivo actual de DocenteDigital.

## ID de prueba
AUD-DOCS-ARCHIVE-158

## Módulo
Carpeta Docente / Carpeta Director / Mis documentos / Archivo / Buscador / Papelera / recuperación

## Entrada
1. Completar configuración de IE.
2. Crear unidades/proyectos y sesiones disponibles.
3. Intentar localizar una función global para buscar documentos por tema, fecha, estudiante o palabra.
4. Intentar abrir un archivo documental institucional del Director.
5. Intentar eliminar de forma recuperable un documento y restaurarlo desde papelera.

## Resultado esperado
- V4 exige un buscador único y sencillo por tema, documento, fecha, estudiante o palabra relacionada.
- V4 exige borrado seguro: confirmación + papelera + recuperación antes de eliminación definitiva.
- V4 incluye “Mis documentos” en Carpeta Docente y “Archivo” en Carpeta Director.
- V5 declara esenciales para Director “Archivo, buscador y correlativos”, exige crear/editar/buscar/eliminar/recuperar documentos y requiere que el recorrido Director termine en Archivo → Seguimiento.
- V2 exige archivo institucional, búsqueda, recuperación y reutilización como parte del sistema integral.

## Resultado obtenido
En `index.html` no existe pantalla o navegación para `Mis documentos`, `Archivo`, `Buscador` o `Papelera`. La navegación de escritorio contiene Inicio, Mi planificación, Crear mi sesión, Materiales, Evaluación, Director y Configuración. La navegación móvil contiene Inicio, Plan, Sesión, Materiales y Evaluación.

`app.js` mantiene `state.units`, `activeUnitId` y `lastSession`, y puede renderizar la biblioteca específica “Mis unidades/proyectos”, pero no implementa un índice documental global, búsqueda transversal, archivo institucional, colección de eliminados ni restauración individual de documentos.

Las búsquedas de código de los términos funcionales equivalentes no localizaron una implementación productiva que complete estas capacidades.

La producción `https://docente-digital.vercel.app/` sirve el mismo HTML y no expone estas funciones.

## Evidencia
- `index.html`: navegación y superficies productivas actuales; solo existe una biblioteca específica de unidades/proyectos.
- `app.js`: estado principal centrado en unidades y última sesión, sin entidad de archivo/papelera/buscador documental.
- Producción HTTP 200 comprobada tras la prueba.

## PASA / NO PASA
**NO PASA**

## Clasificación
**INEXISTENTE** para buscador global, archivo documental integral y papelera recuperable.

## Severidad
**S1 CRÍTICO para Prelaunch V5**.

Justificación: no se afirma pérdida real de datos ni fuga (por lo que no es S0), pero estas funciones están incluidas explícitamente en el alcance esencial V1.0 y bloquean tanto el recorrido Director como las pruebas de año completo, recuperación documental y operación sostenida. La puntuación global no puede compensar este faltante.

## Causa raíz
El modelo persistente actual se construyó alrededor de tipos concretos (`units`, `lastSession`) y no alrededor de una entidad documental común con metadatos, procedencia, propietario/IE, estado y ciclo de vida. Por ello no existe todavía una capa transversal de archivo, índice y recuperación.

## Acción correctiva
No añadir un campo visual de búsqueda sin índice real. Diseñar primero una entidad documental transversal con al menos:
- id estable;
- IE/tenant y usuario/rol cuando exista backend;
- tipo de documento;
- título;
- fecha de creación/modificación/emisión;
- procedencia y relación con unidad/sesión/PAT/acto correspondiente;
- estado borrador/emitido/archivado/eliminado;
- metadatos de búsqueda;
- `deletedAt` y restauración;
- histórico inmutable para documentos emitidos.

Implementar después:
1. Mis documentos / Archivo.
2. Buscador global sencillo.
3. Papelera con restauración.
4. Eliminación definitiva reforzada.
5. Pruebas con 100, 1 000 y 10 000 documentos según V3/V5.

## Repruebas obligatorias
- Buscar por título, tema, fecha, estudiante y palabra relacionada.
- Buscar con quechua y caracteres especiales.
- Eliminar → Papelera → Restaurar → verificar integridad.
- Documento emitido: impedir modificación retroactiva al cambiar Ficha Maestra.
- Dos IE/cuentas cuando exista backend: comprobar aislamiento.
- Recarga/cierre de navegador durante eliminación/restauración.
- Año completo marzo–diciembre con crecimiento del archivo.
- Móvil: búsqueda y recuperación utilizables sin tabla ilegible.

## Riesgo de regresión
Alto si se implementa como un índice paralelo desconectado de las entidades existentes. La migración deberá conservar IDs y relaciones actuales de unidades/sesiones.

## Impacto en indicadores
- IUD: negativo por inexistencia de “Mis documentos/Archivo”.
- ICGD: negativo por ruptura de trazabilidad y recuperación.
- IFR: no debe calcularse como definitivo hasta que guardar/recuperar/buscar/restaurar se prueben.
- ISU: no debe calcularse como definitivo; falta buscador único y recuperación simple exigidos por V4.
- Prelaunch: bloqueante abierto.

## Normativa externa
Este hallazgo es técnico/funcional y se fundamenta en las especificaciones internas V2–V5 y Núcleo IA. No se declaró vigente ninguna norma MINEDU externa en esta prueba.
