# AUD-INSTITUTION-PERSISTENCE-103

## Alcance
Auditoría ejecutable V3 + simplicidad V4 + gate V5 aplicada a la Ficha Maestra de la IE.

## Prueba
**ID:** AUD-INSTITUTION-PERSISTENCE-103  
**Módulo:** Ficha Maestra / persistencia  
**Clasificación inicial:** PARCIALMENTE FUNCIONAL  
**Severidad inicial:** S2 ALTO

**Entrada:** completar la Ficha Maestra y provocar un fallo de persistencia local (por ejemplo, almacenamiento bloqueado o escritura rechazada por cuota).  
**Resultado esperado:** no mostrar confirmación de guardado si el estado no quedó realmente persistido; advertir que los datos siguen solo en memoria/pantalla y podrían perderse al recargar.  
**Resultado obtenido antes:** `saveMaster()` llamaba a `save()` y mostraba siempre `Ficha Maestra guardada`, aunque la capa de almacenamiento puede absorber un `QuotaExceededError` para evitar romper la interfaz. La pantalla podía por tanto afirmar guardado sin evidencia de persistencia efectiva.  
**Evidencia de código previa:** `institution-master-v46.js` v46.4 confirmaba guardado sin releer `localStorage`; `persistence-truth-v63.js` ya aplica esta comprobación a unidades y sesiones, demostrando el patrón requerido por V4/V5.  
**Resultado inicial:** NO PASA.

## Causa raíz
La confirmación de UI dependía de la ejecución de `save()` y no del estado efectivamente recuperable desde la fuente de persistencia local. Al existir una guardia que evita que los fallos de cuota rompan la aplicación, la ausencia de excepción no equivalía a escritura exitosa.

## Corrección
Actualizado `institution-master-v46.js` a v46.5:
- añade `STORAGE_KEY` explícita;
- incorpora `masterPersisted(updatedAt, role)` para releer y verificar el registro guardado;
- solo muestra el mensaje de éxito cuando `institutionMaster.updatedAt` y el rol coinciden con el estado recuperado de `localStorage`;
- si la comprobación falla, registra `window.__ddPersistenceTruthFailure` y muestra advertencia visible de trabajo no persistido;
- no borra ni inventa datos y no modifica históricos.

**Commit funcional:** `49a78d17655db4bbf8b0f1addc5acf1e2d30bb92`.

## Retest técnico
- GitHub/Vercel integration: `success`.
- Deployment asociado al commit: `dpl_J7jDyeKZZ3uGp1sshs69dpSzR9cY`.
- Estado Vercel: `READY`.
- Target: `production`.
- `https://docente-digital.vercel.app/institution-master-v46.js`: HTTP 200 y sirve v46.5 con `masterPersisted()` y `showSaveFailure()`.
- `https://docente-digital.vercel.app/`: HTTP 200.

## Estado posterior
**PASA a nivel de lógica e integración desplegada.** La prueba física de cuota/almacenamiento bloqueado en navegadores y dispositivos reales sigue PENDIENTE V5 y no se simula como validada.

## Riesgo de regresión
Bajo. La corrección no cambia el esquema de datos ni el flujo normal exitoso; añade una verificación posterior al guardado y una salida segura cuando la persistencia no puede demostrarse.

## Impacto
- **IUD:** mejora la veracidad de la Ficha Maestra y su reutilización.
- **ICGD:** mejora la confianza en datos institucionales recuperables.
- **IFR:** reduce confirmaciones falsas de guardado.
- **ISU:** mejora mensajes de error comprensibles y recuperación de trabajo.
- **Prelaunch:** reduce un riesgo de guardado inestable, pero no elimina los bloqueantes V5 de backend, backup/restore real, autenticación, aislamiento, móvil físico y pruebas de ciclo completo.

## Gate V5
DocenteDigital continúa **NO APROBADA PARA LANZAMIENTO V1.0** mientras falten pruebas reales esenciales y permanezcan módulos V1.0 incompletos.