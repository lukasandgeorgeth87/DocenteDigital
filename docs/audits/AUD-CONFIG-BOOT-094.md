# AUD-CONFIG-BOOT-094 — Configuración incompleta visible como terminada

## Especificaciones aplicadas
- AUDITORIA_MAESTRA_INTEGRAL_V2
- ADENDA_AUDITORIA_EJECUTABLE_V3
- AUDITORIA_SIMPLICIDAD_USO_V4
- AUDITORIA_PRELANZAMIENTO_V5
- NUCLEO_IA_DOCENTEDIGITAL

## Prueba
**ID:** AUD-CONFIG-BOOT-094  
**Módulo:** Perfil IE / Ficha Maestra / arranque / EIB  
**Entrada:** estado persistido con nivel + tipo IE + grados + áreas, pero perfil lingüístico sin confirmar; o cambio posterior de organización/nivel que vuelve incompatibles los grados/áreas previos.  
**Esperado:** no mostrar Inicio como si la configuración estuviera terminada; conservar datos válidos y volver inmediatamente al paso exacto pendiente.  
**Obtenido antes:** `app.js` podía abrir Inicio solo por existir `state.level`. La guardia posterior saneaba valores y bloqueaba navegaciones futuras, pero ciertos estados incompletos podían permanecer visualmente en Inicio hasta el siguiente clic.  
**Estado inicial:** NO PASA.  
**Clasificación:** PARCIALMENTE FUNCIONAL.  
**Severidad:** S2 ALTO.

## Causa raíz
El arranque base decide `if(state.level) ... go('home')` antes de que las guardas posteriores terminen de validar configuración completa. Además, una modificación desde Ficha Maestra puede cambiar organización/nivel y volver incompatible una selección previamente válida.

## Corrección
Se amplió `config-state-guard-v42.js` para:
1. sanear nivel/organización/grados/áreas y perfil lingüístico;
2. comprobar la configuración completa al iniciar;
3. si falta o se vuelve incompatible un dato, mostrar inmediatamente `setup`;
4. dirigir al paso exacto: nivel, tipo de IE, grados o áreas/perfil lingüístico;
5. conservar los datos válidos y no elegir automáticamente una alternativa por el usuario.

**Commit final funcional:** `3a35f0487ca581e32552d793ca383b60f5d9a429`.

## Evidencia posterior
- GitHub/Vercel integration status del commit: `success`.
- Producción `/`: HTTP 200.
- Producción `/config-state-guard-v42.js`: HTTP 200 y contiene `enforceIncompleteConfiguration()`.
- No se declara prueba física de navegador/celular ni multiusuario.
- La consulta administrativa de deployments puede requerir reautenticación de scope; no se inventa un estado READY si no existe evidencia administrativa accesible.

## Resultado posterior
**PASA** para la defensa técnica de arranque/configuración incompleta desplegada. La configuración/Ficha Maestra completa permanece **PARCIALMENTE FUNCIONAL** para V5 porque aún faltan backend multiusuario, autenticación, aislamiento, pruebas físicas y recorrido E2E completo.

## Riesgo de regresión
Medio. Hay múltiples capas que envuelven `go()`, `finishSetup()` y la Ficha Maestra. Mantener prueba de regresión al cambiar orden de scripts o lógica de configuración.

## Impacto
- IUD: mejora continuidad y evita pantallas engañosas.
- ICGD: mejora coherencia de datos institucionales/pedagógicos.
- IFR: mejora verdad funcional del arranque.
- ISU: mejora guía al paso pendiente; sin puntaje definitivo.
- Prelaunch: reduce un S2, pero no elimina bloqueantes V5.
