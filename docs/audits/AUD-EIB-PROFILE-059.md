# AUD-EIB-PROFILE-059 — Perfil lingüístico EIB/monolingüe no persistía

## Especificaciones aplicadas
- `AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `AUDITORIA_PRELANZAMIENTO_V5.md`
- `NUCLEO_IA_DOCENTEDIGITAL.md`

## Prueba
**ID:** AUD-EIB-PROFILE-059  
**Módulo:** Configuración / Perfil IE / EIB  
**Entrada:** completar Nivel + Tipo de IE + grados/edades + áreas y escoger `Educación Intercultural Bilingüe (EIB)` o `Monolingüe castellano` antes de pulsar `Guardar y entrar`.  
**Esperado:** el tipo de atención lingüística debe validarse, guardarse y reutilizarse como dato estructurado del perfil; en monolingüe castellano no debe quedar una variedad originaria heredada; en EIB con lengua originaria/bilingüe debe exigirse confirmar la lengua/variedad.  
**Obtenido antes:** `index.html` mostraba el selector `#linguisticMode`, pero `finishSetup()` en `app.js` solo copiaba `language` y `quechuaVar`; `linguisticMode` no se trasladaba al estado. La interfaz permitía aparentar que el perfil EIB/monolingüe estaba configurado sin que el motor pudiera reutilizar ese dato.  
**Resultado inicial:** NO PASA.  
**Clasificación:** PARCIALMENTE FUNCIONAL.  
**Severidad:** S2 ALTO.  
**Causa raíz:** desacople entre control visible y estado persistido.

## Corrección
Cambio pequeño y reversible en `initial-curriculum-guard-v72.js`, lógica interna v72.2:
1. envuelve `finishSetup()`;
2. obliga a seleccionar EIB o monolingüe castellano;
3. persiste `state.linguisticMode`;
4. si el perfil es monolingüe fuerza `Castellano` + `Ninguna` para evitar herencia indebida;
5. si el perfil es EIB y se elige lengua originaria/bilingüe, bloquea guardado hasta confirmar lengua/variedad;
6. restaura controles desde el estado cuando se vuelve a configuración.

## Evidencia posterior
- Commit funcional: `1a63b9bdeba3c933f2e3b2d89ce7b3b26f6f8e11`.
- GitHub vuelve a servir `initial-curriculum-guard-v72.js` con v72.2 y la lógica de validación/persistencia.
- Estado combinado del commit: `Vercel = success`.

## Retest
**Estado posterior del defecto puntual:** PASA con evidencia técnica estática y de despliegue disponible.  
**PENDIENTE:** prueba física en navegador/dispositivo real, persistencia multiusuario/backend, aislamiento y verificación EIB integral extremo a extremo.

## Riesgo de regresión
Bajo-medio. El cambio envuelve una función existente y no modifica documentos históricos ni currículo. Debe retestearse junto con futuras refactorizaciones de configuración.

## Impacto
- **IUD:** mejora la reutilización de datos institucionales.
- **ICGD:** mejora coherencia de configuración.
- **IFR:** impacto positivo parcial; no se calcula puntuación definitiva.
- **ISU:** evita una configuración engañosa, sin puntaje definitivo.
- **Prelaunch:** reduce un S2, pero no elimina bloqueantes V5.

## Gate V5
DocenteDigital NO queda lista para V1.0 por esta corrección. Permanecen pendientes autenticación/aislamiento, backend productivo, OWASP ASVS, backup/restauración real, IA semántica real, exportación Word/PDF física, móvil físico, 100 generaciones, año completo, concurrencia y pilotos reales.