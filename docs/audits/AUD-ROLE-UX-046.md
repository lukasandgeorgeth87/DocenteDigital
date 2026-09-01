# AUD-ROLE-UX-046 — Director exclusivo no debe recibir superficie docente por defecto

## Especificaciones aplicadas
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

## Prueba
**ID:** AUD-ROLE-UX-046  
**Módulo:** Rol / navegación / móvil / UX  
**Entrada:** Ficha Maestra con `userRole = Director`.  
**Esperado:** priorizar Carpeta Director y no presentar Planificación, Sesión, Materiales y Evaluación docentes como superficie principal salvo que el perfil sea `Docente y Director`.  
**Obtenido antes:** `role-surface-guard-v68.js` solo ocultaba Director a `Docente`; para `Director` dejaba visibles Inicio docente, Mi planificación, Crear mi sesión, Materiales y Evaluación en escritorio/móvil.  
**Estado inicial:** NO PASA.  
**Clasificación inicial:** PARCIALMENTE FUNCIONAL.  
**Severidad:** S2.

## Causa raíz
La primera guarda de superficie por rol fue asimétrica: implementó `Docente → ocultar Director`, pero no `Director → priorizar Director / ocultar superficie exclusivamente docente`. La existencia del rol separado `Docente y Director` hacía especialmente visible esta inconsistencia.

## Corrección
Actualización pequeña y reversible de `role-surface-guard-v68.js` a lógica interna v69:
- reconoce `Director` exclusivo;
- oculta accesos `home`, `plan`, `session`, `materials`, `evaluation` para Director exclusivo;
- redirige accesos programáticos docentes hacia `director`;
- mantiene `settings` disponible;
- conserva ambos espacios para `Docente y Director`;
- conserva el bloqueo previo de Director para `Docente` exclusivo;
- declara explícitamente que esta capa es solo UX y NO sustituye autenticación/autorización real.

Commit de corrección: `0a6b63bce14a5eceff26335f03764802c1fbda26`.

## Evidencia posterior
- Producción `/role-surface-guard-v68.js`: HTTP 200 y sirve lógica v69.
- Producción `/`: HTTP 200.
- Verificación administrativa `Vercel READY`: PENDIENTE; la API de deployments devuelve 403 por falta de autorización al scope del equipo, por lo que no se declara READY sin evidencia.

## Resultado posterior
**PASA la defensa de superficie por rol** dentro de lo verificable estáticamente y en publicación del asset.  
**Sistema de roles global:** PARCIALMENTE FUNCIONAL, porque siguen pendientes autenticación, autorización, aislamiento entre usuarios/IE, pruebas de escalamiento de privilegios y OWASP ASVS.

## Riesgo de regresión
Medio-bajo. Puede afectar navegación futura si se agregan nuevas pantallas docentes sin `data-screen`/`data-dd-go`; deben incorporarse a la clasificación de rutas por rol.

## Impacto
- **IUD:** mejora de orientación y reducción de opciones irrelevantes.
- **ICGD:** mejora de separación conceptual Docente/Director.
- **IFR:** mejora parcial; no reemplaza permisos reales.
- **ISU:** mejora parcial; no calcular puntuación definitiva.
- **Prelaunch:** no elimina bloqueantes V5 de seguridad/roles reales.

## Fuente oficial
No se introdujo, aplicó ni declaró vigente ninguna norma MINEDU en esta corrección. No corresponde validación normativa nueva.
