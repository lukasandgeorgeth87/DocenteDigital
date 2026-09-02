# AUD-EIB-CONFIRMATION-093

## Alcance
Perfil lingüístico EIB / configuración base / V3-V5 / Núcleo IA.

## Prueba
**ID:** AUD-EIB-CONFIRMATION-093

**Entrada:** estado de IE con `linguisticMode = "EIB"`, una lengua/variedad originaria almacenada y `linguisticSelectionConfirmed` ausente o falso.

**Resultado esperado:** la configuración EIB no debe considerarse completa hasta que la persona usuaria confirme explícitamente la lengua/variedad correspondiente. Una variedad almacenada o heredada no equivale a confirmación.

**Resultado obtenido antes:** `hasCompleteLinguisticConfiguration()` aceptaba cualquier `origin` distinto de `Ninguna`, aunque `linguisticSelectionConfirmed !== true`.

**Estado inicial:** NO PASA.

**Clasificación:** PARCIALMENTE FUNCIONAL.

**Severidad:** S2 ALTO, por riesgo de arrastrar un dato lingüístico no confirmado hacia documentos posteriores.

## Causa raíz
La guardia de configuración validaba presencia de valor, pero no procedencia/confirmación explícita. Existía además una guardia posterior (`linguistic-confirmation-v37.js`) que registraba confirmación, pero la condición de salida del asistente no exigía ese indicador.

## Corrección aplicada
Archivo: `config-state-guard-v42.js`.

1. Para EIB, `hasCompleteLinguisticConfiguration()` exige simultáneamente lengua/variedad distinta de `Ninguna` y `state.linguisticSelectionConfirmed === true`.
2. Al cambiar el modo a EIB, la confirmación vuelve a `false`.
3. Al cambiar explícitamente la lengua/variedad en EIB, se actualizan `indigenousLanguage`, `quechuaVar` y `linguisticSelectionConfirmed`.
4. Al pasar a monolingüe castellano se limpian lengua originaria, variedad y confirmación heredada.
5. La migración del valor legado `Quechua Collao` sin perfil confirmado deja también la confirmación en falso.

## Evidencia posterior
- Commit funcional: `f8714d91504f174c1e2777d21b77d821246551c3`.
- Estado de integración Vercel reportado por GitHub: `success`.
- Producción `https://docente-digital.vercel.app/config-state-guard-v42.js`: HTTP 200 y contiene la condición `state.linguisticSelectionConfirmed===true`.
- Producción raíz `https://docente-digital.vercel.app/`: HTTP 200.
- La consulta administrativa directa de deployments Vercel continúa bloqueada por 403 del scope del equipo; por ello no se declara `READY` administrativo sin evidencia.

## Resultado posterior
PASA a nivel de lógica de guardia e integración desplegada para la condición específica probada por inspección de código y artefacto servido. Quedan PENDIENTES pruebas reales de interacción con navegador/dispositivo, cambio EIB↔monolingüe, variedades oficiales cargadas, persistencia entre sesiones y generación documental EIB completa.

## Especificaciones aplicadas
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`: no hardcodear variedad y exigir configuración EIB pertinente; trazabilidad de datos.
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`: datos consistentes, persistencia y pruebas reales antes de lanzamiento.
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`: distinguir datos seguros, inferidos y faltantes; respetar perfil EIB/monolingüe.

No se declaró vigencia de una norma educativa externa en esta corrección.

## Riesgo de regresión
MEDIO. Debe probarse que todos los selectores de lengua/variedad disparan `change`, que no exista otra ruta que escriba `quechuaVar` sin marcar procedencia y que la migración de perfiles antiguos fuerce revisión sin pérdida de otros datos.

## Impacto en métricas/gates
- IUD: mejora de integridad de dato lingüístico; sin puntaje definitivo.
- ICGD: mejora de coherencia entre configuración y documentos; sin puntaje definitivo.
- IFR: mejora localizada de fiabilidad; sin puntaje definitivo.
- ISU: impacto neutro/positivo al evitar configuraciones silenciosamente incoherentes; sin puntuación definitiva.
- Prelaunch: reduce un riesgo EIB, pero NO cierra el gate V5. Persisten IA semántica real, Ficha Maestra completa, Docente/Director E2E, autenticación/autorización/aislamiento, seguridad, backup/restore, Word/PDF físicos, móvil físico, 100 generaciones, año completo, concurrencia y pilotos reales.
