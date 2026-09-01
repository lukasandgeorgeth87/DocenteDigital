# AUD-STO-STARTUP-053 — Conservación del estado ante fallo de Storage al iniciar

## Especificaciones aplicadas
- `AUDITORIA_MAESTRA_INTEGRAL_V2.md`: evitar pérdida de información y mantener recuperación.
- `ADENDA_AUDITORIA_EJECUTABLE_V3.md`: función real = entrada → esperado → obtenido → evidencia → estado → severidad → acción.
- `AUDITORIA_SIMPLICIDAD_USO_V4.md`: errores comprensibles y recuperación del trabajo.
- `AUDITORIA_PRELANZAMIENTO_V5.md`: pérdida irreversible y guardado inestable son bloqueantes; no declarar listo sin pruebas reales.

No se aplicó ni declaró vigente ninguna norma MINEDU en esta corrección.

## Prueba
**ID:** AUD-STO-STARTUP-053  
**Módulo:** persistencia local / arranque  
**Entrada:** estado JSON válido pero con configuración base incompleta; durante la normalización inicial `localStorage.setItem()` falla, por ejemplo por cuota llena o almacenamiento bloqueado.  
**Esperado:** conservar el estado original, no tratar un fallo de Storage como corrupción y advertir al usuario.  
**Obtenido antes:** el `catch` común intentaba respaldar y luego ejecutaba `localStorage.removeItem(KEY)` tanto para JSON corrupto como para fallos de lectura/escritura. Si la cuota impedía también crear la copia, podía eliminarse el único estado válido existente.  
**Evidencia previa:** `storage-recovery-v26.js` en el commit anterior a `e6041867cf9d62f9a96bdd3d0a7fcff5080c5ac5`.  
**Resultado inicial:** NO PASA.  
**Clasificación:** ROTA en esta condición de fallo.  
**Severidad:** S0 por riesgo de pérdida irreversible local, aunque el escenario depende de una condición excepcional del navegador.  
**Causa raíz:** un mismo bloque `catch` confundía corrupción del contenido con fallo operativo de Web Storage.

## Corrección aplicada
Commit funcional: `e6041867cf9d62f9a96bdd3d0a7fcff5080c5ac5`.

Cambio pequeño y reversible en `storage-recovery-v26.js` (lógica interna v26.1):
1. se marca explícitamente `stateInvalid` solo cuando falla el parseo JSON o la forma del estado es inválida;
2. solo ese caso puede respaldar y retirar el estado principal dañado;
3. un fallo de lectura/escritura con estado no demostrado como corrupto conserva el original;
4. se registra `window.__ddStorageStartupError` y se muestra la advertencia de almacenamiento.

## Retest técnico
- Harness lógico: estado válido incompleto + fallo simulado de escritura => `removed=false`, `startup=true`.
- Harness lógico: JSON inválido => `stateInvalid=true` y entra en la ruta de recuperación de estado corrupto.
- Producción `https://docente-digital.vercel.app/` => HTTP 200 tras el despliegue funcional.
- Producción `/storage-recovery-v26.js` => HTTP 200 y sirve `v26.1`, incluida la separación entre `stateInvalid` y `__ddStorageStartupError`.
- Deployment del commit funcional: `dpl_HcdhCCwfDQvQjNDt8doKzWELWq7o` => `production / READY`.

## Estado posterior
**PASA dentro de la evidencia técnica ejecutable disponible.** La persistencia global sigue **PARCIALMENTE FUNCIONAL** porque depende de `localStorage`; no existe todavía backend multiusuario, backup/restore productivo ni aislamiento autenticado demostrado.

## Riesgo de regresión
Medio. Cambios futuros en el arranque o en `app.js` pueden volver a mezclar errores de corrupción con fallos de Storage. Conviene convertir este escenario en prueba automática de regresión.

## Impacto en indicadores
- IUD: mejora al evitar borrado inesperado.
- ICGD: mejora la confianza de conservación local.
- IFR: mejora parcial en recuperación, sin convertir almacenamiento local en persistencia productiva.
- ISU: mejora por advertencia comprensible; sin puntaje definitivo.
- Prelaunch: elimina este riesgo puntual, pero no cierra el gate de persistencia/backup V5.

## Bloqueantes V5 que permanecen
Autenticación/autorización real, aislamiento entre usuarios/IE, backend y persistencia productiva, OWASP ASVS, privacidad completa, backup y restore real, IA semántica real, matriz curricular oficial versionada, pruebas físicas de Word/PDF/móvil, batería de 100 generaciones, año escolar completo, concurrencia y pilotos reales.
