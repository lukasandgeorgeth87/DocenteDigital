# AUD-RESET-PENDING-BACKUP-OVERWRITE-265

**Fecha de auditoría:** 2026-09-12  
**Módulo:** Configuración → Restablecer datos / Persistencia y recuperación  
**Especificaciones aplicadas conjuntamente:** `AUDITORIA_MAESTRA_INTEGRAL_V2.md`, `ADENDA_AUDITORIA_EJECUTABLE_V3.md`, `AUDITORIA_SIMPLICIDAD_USO_V4.md`, `AUDITORIA_PRELANZAMIENTO_V5.md`, `NUCLEO_IA_DOCENTEDIGITAL.md`  
**Estado del gate:** BLOQUEADO; este informe no autoriza V1.0.

## Resumen

Se detectó una ruta de pérdida irreversible en la recuperación posterior a **Restablecer datos**. `storage-recovery-v26.js` conservaba una única copia bajo `docenteDigitalPrototype_reset_backup`, pero antes de un nuevo restablecimiento no comprobaba si esa copia seguía pendiente. Por ello, después de restablecer un estado A, ignorar la opción Restaurar/Descartar, crear un nuevo estado B y volver a restablecer, la copia de A podía ser sobrescrita por B.

La V3 clasifica la pérdida irreversible como S0. V4 y V5 exigen recuperación efectiva y pruebas reales antes del lanzamiento. El defecto fue corregido de forma pequeña y reversible en `storage-recovery-v26.js` v26.3: un nuevo restablecimiento queda bloqueado mientras exista una copia pendiente y cualquier fallo al comprobar dicha copia cancela la operación de forma conservadora.

## Pruebas

### AUD-RESET-265-A — segundo restablecimiento con copia anterior pendiente

- **Entrada:** estado A persistido → Restablecer → no Restaurar ni Descartar la copia → crear/guardar estado B → pulsar Restablecer otra vez.
- **Resultado esperado:** la copia recuperable de A no debe sobrescribirse; el sistema debe obligar a resolverla primero.
- **Resultado obtenido antes de la corrección:** el wrapper escribía incondicionalmente una nueva estructura en `docenteDigitalPrototype_reset_backup`; la única copia de A podía quedar reemplazada por B.
- **Evidencia:** revisión ejecutable del flujo de `installRecoverableReset()` en `storage-recovery-v26.js` v26.2 y existencia de una única `RESET_BACKUP_KEY`.
- **Resultado:** **NO PASA** en v26.2.
- **Clasificación:** **PARCIALMENTE FUNCIONAL**.
- **Severidad:** **S0 BLOQUEANTE** por riesgo de pérdida irreversible de la única copia recuperable.
- **Causa raíz:** respaldo de ranura única sin guardia previa de copia pendiente.
- **Acción correctiva aplicada:** v26.3 consulta `RESET_BACKUP_KEY` antes de confirmar/crear otro respaldo; si existe, cancela el nuevo restablecimiento, muestra la recuperación anterior y exige Restaurar o Descartar definitivamente.
- **Evidencia posterior de código:** commit `5abdb7147c68cdc0617e2973ec2c5f5301092f01`.
- **Estado posterior:** **CORREGIDO EN IMPLEMENTACIÓN; E2E REAL PENDIENTE**.

### AUD-RESET-265-B — fallo al comprobar la copia pendiente

- **Entrada:** acceso a almacenamiento local falla al consultar `RESET_BACKUP_KEY` antes de restablecer.
- **Resultado esperado:** operación destructiva cancelada; el estado principal debe permanecer intacto.
- **Resultado obtenido tras la corrección:** se captura la excepción, se informa al usuario y se retorna sin borrar `docenteDigitalPrototype`.
- **Evidencia:** guardia `try/catch` incorporada en `installRecoverableReset()` v26.3.
- **Resultado:** **PASA A NIVEL DE IMPLEMENTACIÓN**.
- **Clasificación:** **FUNCIONAL EN IMPLEMENTACIÓN; prueba de navegador con almacenamiento restringido PENDIENTE**.
- **Severidad residual:** no se rebaja el gate por evidencia estática; la prueba E2E exigida por V5 sigue pendiente.
- **Acción correctiva:** mantener comportamiento fail-closed y añadir prueba automatizada que fuerce excepción de Storage.

### AUD-RESET-265-C — fallo al crear el backup

- **Entrada:** el estado principal existe y `nativeSetItem(...RESET_BACKUP_KEY...)` falla por cuota/permisos.
- **Resultado esperado:** no eliminar el estado principal.
- **Resultado obtenido:** v26.2 ya cancelaba el restablecimiento y conservaba el estado; v26.3 mantiene ese comportamiento.
- **Resultado:** **PASA A NIVEL DE IMPLEMENTACIÓN; E2E PENDIENTE**.
- **Clasificación:** **FUNCIONAL EN IMPLEMENTACIÓN**.

## Evidencia posterior al despliegue

- El commit acumulativo `c0ed7afc566d8e199b7ebb671de29e0279c48c7d` fue desplegado por Vercel como `dpl_CGbpyem2uJrsQQ5o5zqHW31eu4Pc` con estado **READY** y destino **production**.
- La URL canónica `https://docente-digital.vercel.app/` respondió **HTTP 200 OK**.
- El asset productivo `https://docente-digital.vercel.app/storage-recovery-v26.js` respondió **HTTP 200** y sirve explícitamente **v26.3**, incluida la guardia que impide sobrescribir una copia de restablecimiento pendiente.
- No se observaron errores runtime en Vercel durante la ventana de una hora revisada después del cambio.
- GitHub Actions **Prelaunch Smoke #266** (`run 34725904997`) terminó **completed / success** exactamente sobre `c0ed7afc566d8e199b7ebb671de29e0279c48c7d`.
- Estas comprobaciones demuestran despliegue, carga del asset y smoke técnico; **no sustituyen** las pruebas E2E de recuperación ni las pruebas físicas exigidas por V5.

## Validaciones aún obligatorias

No se considera cerrado de forma definitiva hasta ejecutar en navegador real como mínimo:

1. A → Restablecer → Restaurar A.
2. A → Restablecer → recargar/cerrar/abrir → Restaurar A.
3. A → Restablecer → crear B → intentar segundo Restablecer: debe bloquearse y A debe seguir íntegra.
4. A → Restablecer → Descartar copia → Restablecer B: debe permitirse únicamente después del descarte explícito.
5. Simular `getItem` fallido sobre la clave de recuperación: no debe borrarse A.
6. Simular `setItem` fallido/cuota llena al crear el backup: no debe borrarse A.
7. Ejecutar los casos anteriores en móvil físico y tras interrupción de pestaña/navegador.

## Riesgo de regresión

**Medio-bajo.** El cambio se limita a la acción destructiva de restablecimiento y replica el patrón fail-closed ya utilizado para la eliminación recuperable de unidades. Riesgos a vigilar: banner de recuperación oculto, bloqueo permanente por backup inválido y accesibilidad del diálogo en móvil.

## Impacto en métricas

- **IUD:** mejora esperable por prevención de pérdida, pero no se calcula puntaje definitivo.
- **ICGD:** mejora la integridad de datos local; sin puntaje definitivo.
- **IFR / ISU / Prelaunch Score:** **NO CALCULADOS** por falta de pruebas reales obligatorias.
- **V5:** el gate general permanece **BLOQUEADO** por otros hallazgos y pruebas esenciales pendientes.

## Normativa externa

Esta prueba no aplica ni declara vigente una norma MINEDU externa nueva; se fundamenta en las especificaciones internas V2–V5 y en comportamiento observable del código. No se introduce ninguna afirmación normativa sin fuente oficial.
