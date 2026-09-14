# AUD-ROLE-CONFIG-GATE-098

## Módulo
Roles / Configuración / Navegación / Ficha Maestra

## Especificaciones aplicadas
AUDITORIA_MAESTRA_INTEGRAL_V2, ADENDA_AUDITORIA_EJECUTABLE_V3, AUDITORIA_SIMPLICIDAD_USO_V4, AUDITORIA_PRELANZAMIENTO_V5 y NUCLEO_IA_DOCENTEDIGITAL.

## Prueba
**ID:** AUD-ROLE-CONFIG-GATE-098

**Entrada:** Estado con `userRole = "Director"` y configuración pedagógica incompleta (por ejemplo, sin nivel, grados/áreas o perfil lingüístico pendiente). Intentar abrir `director` o `settings`.

**Resultado esperado:** Configuración debe estar siempre accesible para definir/corregir rol y Ficha Maestra. Un Director explícito debe poder entrar al espacio Director sin verse obligado a completar configuración pedagógica propia de funciones Docente. Las rutas pedagógicas sí deben mantener su gate.

**Resultado obtenido originalmente:** `config-state-guard-v42.js` bloqueaba cualquier ruta distinta de `setup` si `hasCompleteBaseConfiguration()` era falso. Además `enforceIncompleteConfiguration()` podía forzar el asistente pedagógico al arrancar aunque el rol persistido fuera Director.

**Clasificación original:** PARCIALMENTE FUNCIONAL.

**Resultado original:** NO PASA.

**Severidad:** S2 ALTO.

## Causa raíz original
La guardia de configuración trataba el setup pedagógico (nivel, organización, grados, áreas y perfil lingüístico) como requisito universal de navegación, sin distinguir rutas administrativas ni el rol explícito del usuario.

## Corrección inicial
Cambio pequeño y reversible en `config-state-guard-v42.js`:

- `settings` queda siempre exento del gate pedagógico para permitir editar rol/Ficha Maestra.
- `director` queda exento cuando `userRole` es `Director` o `Docente y Director`.
- Las rutas Docente continúan exigiendo configuración pedagógica completa.
- `enforceIncompleteConfiguration()` ya no fuerza el asistente pedagógico para un rol Director explícito.

No se implementa autenticación/autorización: esta corrección es únicamente de coherencia UX/rol.

## Regresión detectada — 2026-09-14

### AUD-ROLE-CONFIG-GATE-098-R2

**Entrada:** `userRole="Director"`, `state.level=""`, abrir `director`. También probar `settings` desde un estado completamente nuevo sin nivel.

**Resultado esperado:** abrir directamente la superficie administrativa correspondiente.

**Resultado obtenido antes de la corrección R2:** aunque `config-state-guard-v42.js` declaraba esas rutas exentas, terminaba llamando a la función `go()` original de `app.js`. Esa función base conserva el gate legado `if(!state.level&&id!=='setup'){showSetup();return}`, por lo que el Director sin nivel era reenviado otra vez al setup pedagógico. La corrección inicial protegía el wrapper, pero no neutralizaba el gate base para estas dos excepciones.

**Evidencia:** `app.js` mantiene el requisito global de `state.level` en `go()`, mientras la versión previa de `config-state-guard-v42.js` delegaba las rutas exentas a ese `originalGo`.

**Resultado R2 antes del parche:** NO PASA.

**Clasificación R2 antes del parche:** PARCIALMENTE FUNCIONAL.

**Severidad R2:** S2 ALTO.

### Causa raíz R2
Composición incompleta de wrappers: la capa nueva distinguía rol y ruta, pero delegaba finalmente en una implementación base con una precondición más restrictiva. El orden de guardas hacía inefectiva la excepción precisamente cuando faltaba `state.level`.

### Corrección R2
`config-state-guard-v42.js` pasa a v42.1 e incorpora `openAdministrativeSurface(id)` únicamente para los casos administrativos exentos cuando no existe `state.level`:

- `settings` se puede abrir desde cero para configurar rol y Ficha Maestra;
- `director` se puede abrir sin nivel cuando el rol ya es `Director` o `Docente y Director`;
- no se relaja el gate de `home`, `plan`, `session`, `materials` ni `evaluation`;
- la ruta administrativa mantiene actualización visual de navegación y reutiliza `refresh()` sin inventar datos pedagógicos.

Commit funcional R2: `c35d1d056788f6f5af26bc75ab481605898c85ae` (`fix: allow admin surfaces before pedagogic setup`).

## Evidencia posterior acumulada
- Corrección inicial: commit `540a6162b82b2a935ef060c7f9f136f38d835d9a`.
- Corrección R2: commit `c35d1d056788f6f5af26bc75ab481605898c85ae`.
- La revisión estática R2 confirma que la excepción ya no delega en `app.js` cuando falta `state.level`.
- La confirmación E2E en navegador real sigue PENDIENTE; no se sustituye por revisión estática ni por HTTP 200.

## Retest actual
**PASA EN IMPLEMENTACIÓN / E2E REAL PENDIENTE.**

Repruebas necesarias:
1. estado nuevo → `settings` abre sin seleccionar nivel;
2. rol Director + sin nivel → `director` abre;
3. rol Docente + sin nivel → `director` no abre;
4. rol Director + intento de `session` → ruta pedagógica sigue protegida;
5. guardar Ficha Maestra y cambiar entre Director / Docente y Director / Docente;
6. recarga y móvil real.

## Pendientes V5
- autenticación y autorización reales;
- aislamiento entre usuarios/IE;
- pruebas E2E físicas con perfil Director;
- flujo Director completo (diagnóstico, gestión, PAT, documentos, evidencias, informes, archivo y seguimiento);
- seguridad OWASP ASVS y bitácora real.

## Riesgo de regresión
Medio. El cambio solo evita delegar al gate legado de `app.js` en dos superficies administrativas expresamente permitidas; cualquier cambio futuro en la composición de wrappers de `go()` debe volver a ejecutar R2.

## Impacto
Mejora IUD/ISU/ICGD y coherencia de roles; no cambia el estado global de Prelaunch: sigue bloqueado por funciones V5 pendientes. No se calcula puntuación definitiva sin evidencia real.