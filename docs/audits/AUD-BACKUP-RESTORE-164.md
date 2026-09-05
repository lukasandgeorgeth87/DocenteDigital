# AUD-BACKUP-RESTORE-164 — Backup y restauración no implementados

## Alcance
Auditoría de continuidad y recuperación conforme a `AUDITORIA_MAESTRA_INTEGRAL_V2.md`, `ADENDA_AUDITORIA_EJECUTABLE_V3.md`, `AUDITORIA_SIMPLICIDAD_USO_V4.md`, `AUDITORIA_PRELANZAMIENTO_V5.md` y `NUCLEO_IA_DOCENTEDIGITAL.md`.

## ID de prueba
`AUD-BACKUP-RESTORE-164`

## Módulo
Persistencia / Continuidad / Backup / Restauración.

## Entrada
1. Configurar el perfil de trabajo de DocenteDigital.
2. Crear información persistente (por ejemplo, unidad/proyecto y sesión).
3. Buscar un mecanismo real de copia de seguridad de los datos de trabajo.
4. Buscar un mecanismo de restauración a partir de dicha copia.
5. Revisar el código productivo y el repositorio para determinar si el estado cuenta con una segunda copia independiente del navegador/dispositivo.

## Resultado esperado
V5 exige que no baste con afirmar que existen backups: debe realizarse una restauración real de prueba. También exige definir continuidad ante fallos y no lanzar si existe un backup sin restauración comprobada. V3 exige probar backup/restauración y definir RPO/RTO cuando exista arquitectura productiva.

El sistema debe disponer de una estrategia verificable que permita recuperar información después de un fallo o pérdida del almacenamiento primario. La restauración debe probarse de verdad antes de aprobar el gate V5.

## Resultado obtenido
El estado base continúa cargándose desde una sola clave del navegador:

```js
const state=JSON.parse(localStorage.getItem('docenteDigitalPrototype')||'{}');
```

y se guarda mediante:

```js
const save=()=>localStorage.setItem('docenteDigitalPrototype',JSON.stringify(state));
```

En la búsqueda del repositorio no se encontró implementación productiva de backup, restore, importación/restauración de respaldo, snapshot, réplica ni procedimiento de recuperación de datos.

El almacenamiento local del mismo navegador no constituye una copia de seguridad independiente: borrar datos del sitio, perder el perfil del navegador o perder el dispositivo dejaría al estado sin una segunda copia recuperable demostrada.

No se ejecutó una restauración destructiva en producción porque no existe un mecanismo de backup/restauración que pueda someterse legítimamente a esa prueba y porque simular éxito violaría V3/V5.

## Evidencia
- `app.js`: lectura y escritura del estado en `localStorage['docenteDigitalPrototype']`.
- Búsqueda de código del repositorio para `backup`, `restore`, `recovery`, `RPO`, `RTO`, importación/exportación de respaldo: sin implementación localizada.
- V5 §12: backup y continuidad; restauración real obligatoria.
- V3 §19: backups y restauración deben probarse, no declararse.

## PASA / NO PASA
**NO PASA**.

## Clasificación funcional
**INEXISTENTE** para backup/restauración verificable.

La persistencia local existente no se reclasifica aquí: este hallazgo evalúa específicamente la existencia de una copia independiente y su restauración.

## Severidad
**S1 — CRÍTICO para Prelaunch V5.**

No se eleva automáticamente a S0 porque durante esta prueba no se provocó ni demostró una pérdida irreversible de datos reales. Si una prueba real demuestra pérdida irreversible, deberá escalarse a S0 conforme a V3.

## Causa raíz
La arquitectura actual persiste el estado en el navegador antes de disponer de una capa de almacenamiento duradero con política de respaldo y recuperación. No existe todavía evidencia de backend persistente, snapshots versionados, réplica, exportación de respaldo recuperable ni restore drill.

## Acción correctiva
1. Definir el almacenamiento primario productivo y el alcance de los datos respaldados.
2. Implementar copias independientes y versionadas con controles de acceso.
3. Diseñar restauración por usuario/IE sin mezclar tenants ni sobrescribir históricos incorrectamente.
4. Definir RPO/RTO cuando exista arquitectura productiva.
5. Probar restauración real en un entorno de pruebas con datos controlados.
6. Verificar integridad antes/después de restaurar: cantidades, IDs, relaciones, históricos y archivos.
7. Probar pérdida de dispositivo/perfil, fallo de base de datos y recuperación desde backup.
8. Mantener continuidad para abrir/editar/descargar documentos existentes aunque falle la IA.
9. Registrar evidencia de cada restore drill y repetirla tras cambios relevantes de persistencia.

## Evidencia posterior a corrección
**PENDIENTE.** No puede cerrarse con una pantalla, texto de “backup exitoso” o una segunda clave de `localStorage`. Debe demostrarse restauración real desde una copia independiente.

## Fuente oficial normativa
No se aplicó ni declaró vigente ninguna norma MINEDU o legal externa en este hallazgo. La conclusión técnica se fundamenta en las especificaciones internas V3/V5. La normativa de protección de datos deberá verificarse contra fuente oficial vigente cuando se diseñe la política definitiva de backup y retención.

## Riesgo de regresión
**Alto.** Cambios futuros de esquema, autenticación, multi-IE, documentos, adjuntos o cifrado pueden volver incompatibles respaldos anteriores. Las migraciones y restores deben formar parte de las pruebas automatizadas y de recuperación.

## Impacto en indicadores
- **IUD:** no se calcula; la pérdida de continuidad degradaría la utilidad documental.
- **ICGD:** no se calcula; la imposibilidad de restaurar rompe continuidad y trazabilidad documental.
- **IFR:** afectado negativamente por ausencia de recuperación demostrada; sin puntuación definitiva.
- **ISU:** sin puntuación definitiva; recuperar trabajo perdido forma parte de la experiencia real.
- **Prelaunch:** **BLOQUEADO** mientras no exista restore real comprobado.

## Estado acumulativo
`ABIERTO — S1 — INEXISTENTE — BLOQUEANTE V5`

DocenteDigital no debe declararse lista para V1.0 mientras esta prueba y los demás bloqueantes V5 permanezcan abiertos.