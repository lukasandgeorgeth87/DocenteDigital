# AUD-ROLE-CONFIG-GATE-098

## Módulo
Roles / Configuración / Navegación / Ficha Maestra

## Especificaciones aplicadas
AUDITORIA_MAESTRA_INTEGRAL_V2, ADENDA_AUDITORIA_EJECUTABLE_V3, AUDITORIA_SIMPLICIDAD_USO_V4, AUDITORIA_PRELANZAMIENTO_V5 y NUCLEO_IA_DOCENTEDIGITAL.

## Prueba
**ID:** AUD-ROLE-CONFIG-GATE-098

**Entrada:** Estado con `userRole = "Director"` y configuración pedagógica incompleta (por ejemplo, sin grados/áreas o perfil lingüístico pendiente). Intentar abrir `director` o `settings`.

**Resultado esperado:** Configuración debe estar siempre accesible para definir/corregir rol y Ficha Maestra. Un Director explícito debe poder entrar al espacio Director sin verse obligado a completar configuración pedagógica propia de funciones Docente. Las rutas pedagógicas sí deben mantener su gate.

**Resultado obtenido antes:** `config-state-guard-v42.js` bloqueaba cualquier ruta distinta de `setup` si `hasCompleteBaseConfiguration()` era falso. Además `enforceIncompleteConfiguration()` podía forzar el asistente pedagógico al arrancar aunque el rol persistido fuera Director.

**Clasificación antes:** PARCIALMENTE FUNCIONAL.

**Resultado:** NO PASA.

**Severidad:** S2 ALTO.

## Causa raíz
La guardia de configuración trataba el setup pedagógico (nivel, organización, grados, áreas y perfil lingüístico) como requisito universal de navegación, sin distinguir rutas administrativas ni el rol explícito del usuario.

## Corrección
Cambio pequeño y reversible en `config-state-guard-v42.js`:

- `settings` queda siempre exento del gate pedagógico para permitir editar rol/Ficha Maestra.
- `director` queda exento cuando `userRole` es `Director` o `Docente y Director`.
- Las rutas Docente continúan exigiendo configuración pedagógica completa.
- `enforceIncompleteConfiguration()` ya no fuerza el asistente pedagógico para un rol Director explícito.

No se implementa autenticación/autorización: esta corrección es únicamente de coherencia UX/rol.

## Evidencia posterior
- Commit funcional: `540a6162b82b2a935ef060c7f9f136f38d835d9a`.
- Estado de integración GitHub/Vercel: `success`.
- Producción `/config-state-guard-v42.js`: HTTP 200 y contiene `isDirectorRole`, exención de `settings` y de `director` para rol Director.
- Producción `/`: HTTP 200.
- Consulta administrativa directa del deployment: 403 por falta de autorización al scope del equipo; por ello no se declara `READY` administrativo sin evidencia.

## Retest
PASA a nivel de lógica estática + integración desplegada para el gate por rol.

## Pendientes V5
- autenticación y autorización reales;
- aislamiento entre usuarios/IE;
- pruebas E2E físicas con perfil Director;
- flujo Director completo (diagnóstico, gestión, PAT, documentos, evidencias, informes, archivo y seguimiento);
- seguridad OWASP ASVS y bitácora real.

## Riesgo de regresión
Medio-bajo. El cambio solo relaja el gate para Configuración y para el espacio Director cuando el rol ya fue seleccionado explícitamente. No habilita rutas pedagógicas incompletas.

## Impacto
Mejora IUD/ISU/ICGD y coherencia de roles; no cambia el estado global de Prelaunch: sigue bloqueado por funciones V5 pendientes.