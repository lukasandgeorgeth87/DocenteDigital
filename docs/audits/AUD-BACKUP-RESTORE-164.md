# AUD-BACKUP-RESTORE-164 — Falta backup independiente y restore drill real

## Alcance
Auditoría de continuidad y recuperación conforme a `AUDITORIA_MAESTRA_INTEGRAL_V2.md`, `ADENDA_AUDITORIA_EJECUTABLE_V3.md`, `AUDITORIA_SIMPLICIDAD_USO_V4.md`, `AUDITORIA_PRELANZAMIENTO_V5.md` y `NUCLEO_IA_DOCENTEDIGITAL.md`.

## ID de prueba
`AUD-BACKUP-RESTORE-164`

## Módulo
Persistencia / Continuidad / Backup / Restauración.

## Entrada
1. Configurar el perfil de trabajo de DocenteDigital.
2. Crear información persistente (por ejemplo, unidad/proyecto y sesión).
3. Revisar mecanismos de recuperación local existentes.
4. Buscar una copia de seguridad independiente del almacenamiento primario del navegador/dispositivo.
5. Buscar un procedimiento de restauración real desde esa copia independiente.

## Resultado esperado
V5 exige que no baste con afirmar que existen backups: debe realizarse una restauración real de prueba. También exige definir continuidad ante fallos y mantiene como bloqueante un backup sin restauración comprobada. V3 exige probar backups/restauración y definir RPO/RTO cuando exista arquitectura productiva.

El sistema debe disponer de una estrategia verificable que permita recuperar información después de perder el almacenamiento primario. La restauración debe probarse realmente antes de aprobar el gate V5.

## Resultado obtenido
El estado base continúa cargándose desde una clave del navegador:

```js
const state=JSON.parse(localStorage.getItem('docenteDigitalPrototype')||'{}');
```

y se guarda mediante:

```js
const save=()=>localStorage.setItem('docenteDigitalPrototype',JSON.stringify(state));
```

Existe `storage-recovery-v26.js`. Este módulo aporta recuperación preventiva útil dentro del mismo `localStorage`:

- conserva una copia local antes de `resetDemo()`;
- permite restaurar esa copia si el restablecimiento fue accidental;
- conserva una copia local de una unidad/proyecto antes de eliminarla y permite deshacer esa eliminación;
- preserva estados inválidos en una clave local de recuperación antes de limpiar la clave principal.

Estas protecciones son reales y no deben confundirse con inexistencia total de recuperación.

Sin embargo, todas esas copias permanecen en el mismo almacenamiento del mismo perfil de navegador. No se encontró una copia independiente —backend, almacenamiento externo controlado, snapshot/replica, archivo de backup recuperable o mecanismo equivalente— ni un procedimiento de restore drill desde una segunda fuente.

Por ello, borrar los datos completos del sitio, perder el perfil del navegador o perder el dispositivo elimina también la fuente primaria y las copias locales del mismo origen. No existe evidencia de recuperación ante ese escenario.

No se ejecutó una restauración destructiva de producción desde una copia independiente porque esa segunda copia no existe demostrablemente; simularla violaría V3/V5.

## Evidencia
- `app.js`: lectura y escritura del estado en `localStorage['docenteDigitalPrototype']`.
- `storage-recovery-v26.js`: copias recuperables locales para reset, eliminación e integridad de almacenamiento, todas dentro del mismo `localStorage`.
- Revisión del repositorio: no se localizó backend de backup, snapshot/replica, exportación/importación de backup independiente ni restore drill.
- V5 §12: backup y continuidad; restauración real obligatoria.
- V3 §19: backups y restauración deben probarse, no solo declararse.

## PASA / NO PASA
**NO PASA** para el requisito V5 de backup/restore de continuidad.

## Clasificación funcional
- **Recuperación local ante reset/eliminación:** `PARCIALMENTE FUNCIONAL` y con evidencia de implementación.
- **Backup independiente del almacenamiento primario:** `INEXISTENTE`.
- **Restauración real desde backup independiente:** `INEXISTENTE / PENDIENTE DE IMPLEMENTACIÓN`.

## Severidad
**S1 — CRÍTICO para Prelaunch V5.**

No se eleva automáticamente a S0 porque durante esta prueba no se provocó ni demostró pérdida irreversible de datos reales. Si una prueba real demuestra pérdida irreversible, deberá escalarse a S0 conforme a V3.

## Causa raíz
La arquitectura actual mejora la seguridad frente a errores locales puntuales, pero sigue usando el mismo `localStorage` como almacenamiento principal y como ubicación de sus copias de recuperación. No existe todavía evidencia de una segunda capa durable e independiente con política de backup/restauración.

## Acción correctiva
1. Conservar `storage-recovery-v26.js` como protección local, pero no presentarlo como backup de continuidad.
2. Definir el almacenamiento primario productivo y el alcance de los datos respaldados.
3. Implementar copias independientes y versionadas con controles de acceso.
4. Diseñar restauración por usuario/IE sin mezclar tenants ni sobrescribir históricos incorrectamente.
5. Definir RPO/RTO cuando exista arquitectura productiva.
6. Probar restauración real en un entorno de pruebas con datos controlados.
7. Verificar integridad antes/después de restaurar: cantidades, IDs, relaciones, históricos y archivos.
8. Probar pérdida total del perfil/dispositivo, fallo del almacenamiento primario y recuperación desde backup.
9. Mantener continuidad para abrir/editar/descargar documentos existentes aunque falle la IA.
10. Registrar evidencia de cada restore drill y repetirla tras cambios relevantes de persistencia.

## Evidencia posterior a corrección
**PENDIENTE.** No puede cerrarse con una pantalla, un mensaje de “backup exitoso” ni otra clave dentro del mismo `localStorage`. Debe demostrarse restauración real desde una copia independiente.

## Fuente oficial normativa
No se aplicó ni declaró vigente ninguna norma MINEDU o legal externa en este hallazgo. La conclusión técnica se fundamenta en las especificaciones internas V3/V5. Cualquier política futura de retención/protección de datos deberá verificarse contra fuentes oficiales vigentes antes de declararse conforme.

## Riesgo de regresión
**Alto.** Cambios futuros de esquema, autenticación, multi-IE, documentos, adjuntos o cifrado pueden volver incompatibles respaldos anteriores. Las migraciones y restores deben formar parte de pruebas automatizadas y de recuperación.

## Impacto en indicadores
- **IUD:** no se calcula; una pérdida sin recuperación degradaría la utilidad documental.
- **ICGD:** no se calcula; ausencia de restore independiente afecta continuidad y trazabilidad.
- **IFR:** afectado negativamente por ausencia de recuperación demostrada; sin puntuación definitiva.
- **ISU:** sin puntuación definitiva; la recuperación local es una mejora, pero no sustituye continuidad real.
- **Prelaunch:** **BLOQUEADO** mientras no exista restore real comprobado desde backup independiente.

## Estado acumulativo
`ABIERTO — S1 — BACKUP INDEPENDIENTE INEXISTENTE — RECUPERACIÓN LOCAL PARCIAL — BLOQUEANTE V5`

DocenteDigital no debe declararse lista para V1.0 mientras esta prueba y los demás bloqueantes V5 permanezcan abiertos.