# AUD-ROLE-STATE-067 — Superficie por rol usa estado real

## Especificaciones aplicadas
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

## Prueba
**ID:** AUD-ROLE-STATE-067  
**Módulo:** Ficha Maestra / roles / navegación Docente–Director  
**Entrada:** guardar `userRole` como `Docente`, `Director` o `Docente y Director` y navegar por las superficies principales.  
**Esperado:** la guardia UX debe leer el mismo estado persistente de `app.js`; Docente no debe recibir como principal la superficie Director, Director exclusivo no debe recibir las herramientas docentes como superficie principal, y el rol combinado conserva ambas.  
**Obtenido antes:** `role-surface-guard-v68.js` resolvía el rol mediante `window.state?.userRole`, mientras `app.js` declara `const state=...`. Una variable global declarada con `const` no se publica como propiedad `window.state`, por lo que la guardia podía interpretar el rol como vacío y no aplicar el filtrado de superficie.  
**Evidencia previa:** `app.js` declara `const state`; versión previa de `role-surface-guard-v68.js` usaba `window.state?.userRole`.  
**Resultado previo:** **NO PASA**  
**Severidad:** **S2 ALTO**  
**Clasificación previa:** **PARCIALMENTE FUNCIONAL**  
**Causa raíz:** desacoplamiento entre el estado léxico real de la aplicación y una guardia que esperaba una propiedad global inexistente.  

## Corrección
Cambio pequeño y reversible en `role-surface-guard-v68.js`:
- versión interna `v69.1`;
- se incorpora `getState()` que obtiene de forma segura la variable léxica `state`;
- `role()` pasa a leer `getState()?.userRole`;
- no se modifica autenticación, autorización, documentos históricos ni datos institucionales.

**Commit funcional:** `2e9cb6a02de408e6cc207edc9bb57e939afc6671`.

## Retest técnico
- Vercel deployment asociado al commit funcional: `dpl_4dT14YGBadd6qqpKB2mfm4GzLeKa`.
- Estado Vercel: **READY**, target **production**.
- `https://docente-digital.vercel.app/`: **HTTP 200**.
- `https://docente-digital.vercel.app/role-surface-guard-v68.js`: **HTTP 200** y sirve `v69.1` con `getState()`.

**Resultado posterior disponible:** **PASA a nivel de integración técnica**.  
**Clasificación posterior:** **FUNCIONAL técnicamente para lectura del rol**, pendiente de prueba de interacción completa con navegador real.

## Alcance y límites
Esta corrección es solamente de superficie/UX. **No demuestra ni sustituye autenticación, autorización, aislamiento multiusuario ni control de privilegios**. Esos requisitos siguen PENDIENTES y forman parte del gate V5 y de la auditoría de seguridad.

## Riesgo de regresión
Bajo. El cambio se limita al origen del dato `userRole`; no modifica la estructura de estado ni la persistencia.

## Impacto en indicadores
- **IUD / ICGD:** mejora la coherencia entre perfil configurado y superficie mostrada.
- **ISU:** mejora potencialmente la simplicidad al evitar funciones ajenas al rol, pero no se calcula puntaje definitivo sin usuarios reales.
- **IFR / Prelaunch:** reduce un defecto funcional de roles, pero no cierra autenticación, autorización ni seguridad.

## Estado de lanzamiento
DocenteDigital continúa **NO APROBADA PARA LANZAMIENTO V1.0** mientras existan bloqueantes V5 o falten pruebas reales esenciales, especialmente autenticación/aislamiento, seguridad OWASP ASVS, backend productivo, backup/restauración real, Word/PDF físicos, móvil físico, 100 generaciones, año completo, concurrencia y pilotos reales.
