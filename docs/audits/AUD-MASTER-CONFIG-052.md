# AUD-MASTER-CONFIG-052 — Coherencia Ficha Maestra ↔ configuración activa

## Especificaciones aplicadas
- AUDITORIA_MAESTRA_INTEGRAL_V2.md: Ficha Maestra única y reutilización de datos institucionales.
- ADENDA_AUDITORIA_EJECUTABLE_V3.md: fuente única de verdad; detectar configuraciones inconsistentes sin decidir arbitrariamente cuál dato es correcto.
- AUDITORIA_SIMPLICIDAD_USO_V4.md: configuración una sola vez, mensajes comprensibles y evitar trabajo duplicado.
- AUDITORIA_PRELANZAMIENTO_V5.md: no aprobar flujos que pierdan o contradigan datos al avanzar.
- NUCLEO_IA_DOCENTEDIGITAL.md: conservar contexto y detectar contradicciones antes de generar.

## Prueba
**ID:** AUD-MASTER-CONFIG-052  
**Módulo:** Ficha Maestra / Configuración  
**Entrada:** Ficha Maestra guardada con organización `Multigrado` y nivel `Primaria`; posteriormente configuración activa modificada a otra organización o a un nivel no incluido en la Ficha Maestra.  
**Esperado:** la app debe detectar la contradicción y pedir revisión; no debe escoger silenciosamente uno de los dos valores ni seguir tratándolos como datos equivalentes.  
**Obtenido antes:** `institution-master-v46.js` mantenía `institutionMaster.organization` y `institutionMaster.levels` separados de `state.ieType` y `state.level`, pero no advertía al usuario cuando se contradecían. Esto podía dejar dos fuentes operativas divergentes.  
**Evidencia:** revisión de `institution-master-v46.js` v46.2 y `config-state-guard-v42.js`.  
**Resultado inicial:** NO PASA.  
**Clasificación:** PARCIALMENTE FUNCIONAL.  
**Severidad:** S2 — mala trazabilidad / configuración institucional incoherente.  
**Causa raíz:** coexistencia de Ficha Maestra y configuración activa sin comprobación explícita de discrepancias.  

## Corrección segura aplicada
Se actualizó `institution-master-v46.js` a lógica interna v46.3 con `configurationWarnings()` para detectar:
1. organización activa distinta de la registrada en Ficha Maestra;
2. nivel activo que no figura entre los niveles registrados en Ficha Maestra.

La app muestra `⚠ Revisar configuración` y explica que DocenteDigital no elegirá automáticamente cuál dato es correcto. No sobrescribe silenciosamente datos ni modifica históricos.

## Evidencia posterior
- Commit funcional: `c6fd27203ccde39bb2a63625fb7c9cfd141d199f`.
- Producción `/institution-master-v46.js`: HTTP 200 y sirve v46.3 con `configurationWarnings()`.
- Producción `/`: HTTP 200 en retest posterior a la corrección.
- Vercel READY administrativo: PENDIENTE porque la API de deployments devuelve 403 por falta de autorización al scope del equipo.

## Estado posterior
**PASA dentro del alcance de detección de contradicciones.** La Ficha Maestra global sigue PARCIALMENTE FUNCIONAL porque aún se apoya en `localStorage`, no existe backend multiusuario/autenticación/aislamiento y parte del perfil pedagógico-lingüístico continúa en estructuras separadas.

## Riesgo de regresión
Bajo. El cambio no migra ni sustituye valores; solo detecta divergencias y muestra una advertencia en Configuración.

## Impacto
- IUD: mejora trazabilidad institucional.
- ICGD: mejora coherencia de datos reutilizados.
- IFR/ISU/Prelaunch: mejora parcial; no se recalculan puntajes definitivos sin evidencia real.

## Fuentes oficiales
No se aplicó ni declaró una norma MINEDU nueva en esta corrección; por tanto, no corresponde afirmar vigencia normativa adicional.
