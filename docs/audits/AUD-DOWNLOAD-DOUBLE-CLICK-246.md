# AUD-DOWNLOAD-DOUBLE-CLICK-246 — Descargas duplicadas ante doble clic rápido

## Especificaciones aplicadas
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

## Alcance
Carpeta Docente → exportación Word de Unidad/Proyecto y Sesión.

## Prueba principal
**ID:** AUD-DL-DBL-246-A  
**Entrada:** disponer de una Unidad/Proyecto guardada o una Sesión preparada y ejecutar doble clic rápido sobre `Descargar Word`.  
**Resultado esperado:** V5 exige probar doble clic rápido en descargar y evitar operaciones duplicadas. Una única intención del usuario debe producir una sola descarga; durante la operación debe existir una guarda de reentrada/cooldown o mecanismo equivalente.  
**Resultado obtenido:** en producción, `downloadUnitWord()` y `downloadSessionWord()` llaman directamente a `downloadBlob()`. `downloadBlob()` crea un nuevo elemento `<a>`, genera un nuevo `ObjectURL` y ejecuta `a.click()` en cada invocación. No existe `isDownloading`, bloqueo del botón, debounce/cooldown ni otra guarda de reentrada. Por lo tanto, dos eventos de clic aceptados disparan dos intentos independientes de descarga del mismo documento.  
**PASA/NO PASA:** NO PASA.  
**Clasificación:** PARCIALMENTE FUNCIONAL. La descarga funciona, pero no cumple la resistencia a doble clic exigida por V5.  
**Severidad:** S3 MEDIO.

## Evidencia técnica
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`, sección 3: `Probar doble clic rápido en generar/guardar/descargar/crear documentos para impedir duplicados y correlativos repetidos.`
- `app.js`: `downloadBlob(blob,fileName)` crea y activa un enlace de descarga en cada llamada sin control de reentrada.
- `app.js`: `downloadUnitWord(id)` invoca `downloadBlob(...)` directamente.
- `app.js`: `downloadSessionWord()` invoca `downloadBlob(...)` directamente.
- Producción `https://docente-digital.vercel.app/app.js`: respuesta HTTP 200 y mismo código de descarga sin guarda de reentrada, verificado el 2026-09-08.

## Diferencia frente a hallazgos anteriores
- No duplica `AUD-UNIT-DOUBLE-CLICK-DUPLICATION-218`, que trata creación accidental de unidades.
- No duplica `AUD-DOCUMENT-DUPLICATION-MISSING-235`, que trata duplicación intencional y controlada de documentos.
- AUD-246 trata específicamente la repetición accidental de la operación de descarga ante doble clic rápido, exigida de forma separada por V5.

## Causa raíz
La primitiva común `downloadBlob()` se diseñó como una acción inmediata sin estado de operación. Todos los botones de exportación heredan ese comportamiento.

## Acción correctiva recomendada
Implementar una guarda centralizada y reversible en la capa de descarga:
1. bloquear reentradas para la misma descarga durante una ventana corta o mientras la operación está en curso;
2. deshabilitar temporalmente el botón que originó la acción cuando sea posible;
3. mantener el nombre y contenido de archivo deterministas;
4. liberar la guarda aun si ocurre una excepción;
5. no interferir con la descarga de documentos distintos;
6. probar doble y triple clic/tap en Unidad y Sesión;
7. probar también el fallback de `Compartir`, que puede terminar llamando a `downloadBlob()`.

Cuando exista backend o generación remota, la idempotencia debe extenderse a servidor para operaciones que creen artefactos o consuman correlativos.

## Corrección en esta ronda
No se modificó `app.js` en esta ronda. Aunque el defecto es claro, la descarga común también es utilizada por el fallback de compartir en móvil. Sin una prueba interactiva de navegador/descarga disponible en este entorno, cambiar la primitiva y declarar la corrección como validada violaría V3/V5. Se deja la corrección PENDIENTE hasta poder ejecutar la prueba antes/después sobre descarga real.

## Evidencia posterior disponible
- Último deployment productivo anterior a este informe: `dpl_F5HGEaxiMQug7VAepptxyzKAqkyU`, estado `READY`, commit `0dff10c75e22e06c09574c290625696f55a9f4e3`.
- El asset productivo `/app.js` respondió HTTP 200 y contiene el mismo flujo de descarga descrito.

## Riesgo de regresión
Medio-bajo para una guarda bien implementada, pero debe probarse en escritorio y móvil porque `downloadBlob()` también participa en el fallback de `shareFile()`.

## Impacto cualitativo
- **IUD/ICGD:** impacto menor en contenido; afecta higiene del flujo de exportación.
- **IFR:** incumple una prueba funcional explícita V5.
- **ISU:** puede generar archivos duplicados/confusión ante doble clic o tap repetido.
- **Prelaunch:** NO PASA esta prueba parcial; no se calcula puntaje definitivo.

## Pendientes no simulados
- doble clic real en navegador con captura del número de descargas;
- triple clic/tap;
- prueba física en Android/iOS;
- fallback `Compartir → Descargar`;
- Word físico y apertura en Microsoft Word/LibreOffice;
- cualquier prueba de concurrencia/backend futuro.

No se aplica ni se declara vigente ninguna norma externa MINEDU/UGEL para clasificar este hallazgo; deriva directamente de V5.