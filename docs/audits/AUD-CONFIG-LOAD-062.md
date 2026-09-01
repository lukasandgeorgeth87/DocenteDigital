# AUD-CONFIG-LOAD-062 — Guardia de coherencia de configuración fuera de la cadena de producción

## Especificaciones aplicadas

- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

## Prueba

**ID:** AUD-CONFIG-LOAD-062  
**Módulo:** Perfil IE / configuración / EIB-monolingüe / persistencia  
**Clasificación inicial:** PARCIALMENTE FUNCIONAL  
**Severidad inicial:** S2

### Entrada

Abrir DocenteDigital con estado antiguo o incompleto, especialmente cuando `linguisticMode` aún no existe y el prototipo base inicializa `quechuaVar` con `Quechua Collao`; también cambiar nivel o tipo de IE después de haber seleccionado grados/áreas de otra configuración.

### Resultado esperado

La guardia de coherencia `config-state-guard-v42.js` debe ejecutarse realmente en producción para:

- retirar la variedad `Quechua Collao` heredada cuando no existe perfil lingüístico confirmado;
- mantener `Castellano + Ninguna` en perfil monolingüe;
- impedir herencias de grados/áreas incompatibles al cambiar nivel o tipo de IE;
- impedir abandonar el asistente con configuración semánticamente incompleta.

### Resultado obtenido antes de corregir

`config-state-guard-v42.js` existía y contenía esas protecciones, pero `index.html` no lo cargaba y la cadena dinámica existente solo aseguraba `curriculum-safety-v27.js`. Por tanto, la protección podía no ejecutarse en producción. Mientras tanto, `app.js` conserva como valor base histórico `state.quechuaVar = state.quechuaVar || 'Quechua Collao'`.

### Evidencia

- `app.js`: inicializa `quechuaVar` con `Quechua Collao` cuando el estado no tiene valor.
- `config-state-guard-v42.js`: sanea ese valor si no existe `linguisticMode`, normaliza monolingüe y limpia configuraciones incompatibles.
- `index.html`: no incluye `config-state-guard-v42.js` entre sus scripts estáticos.
- V3 exige fuente única de verdad y prueba EIB → monolingüe sin herencias indebidas.
- Núcleo IA exige conservar lengua y perfil EIB/monolingüe sin territorialidad rígida.
- V5 exige persistencia y configuración confiables antes del lanzamiento.

## Causa raíz

Una protección correctiva fue implementada como módulo independiente sin garantizar su incorporación al runtime de producción.

## Acción correctiva

Se actualizó `initial-curriculum-guard-v72.js` a v72.5. La función de carga crítica ahora incorpora, same-origin y después de cargar los módulos base:

- `config-state-guard-v42.js`;
- `curriculum-safety-v27.js`.

La carga evita duplicados, utiliza flags de módulo ya existentes y registra los fallos en `window.ddModuleLoadFailures` sin ocultarlos.

**Commit funcional:** `2b005ee9ba81f6f53ae3f552d8e99c65b825f9fa`.

## Retest posterior

- Inspección estática: v72.5 contiene la carga explícita de `config-state-guard-v42.js` y conserva la carga de seguridad curricular.
- `config-state-guard-v42.js` continúa disponible en el repositorio y mantiene las reglas de saneamiento descritas.
- Estado Vercel y HTTP deben verificarse antes de cerrar la ejecución; si no pueden demostrarse, permanecen PENDIENTES y no se simulan.

## Estado posterior

**Corrección integrada; validación final de despliegue/HTTP pendiente durante la ejecución actual.**

La configuración global no se considera validada con usuarios reales ni dispositivos físicos. DocenteDigital continúa NO APROBADA PARA LANZAMIENTO V1.0 mientras existan bloqueantes V5 y pruebas esenciales pendientes.

## Riesgo de regresión

Bajo-medio. El cambio solo incorpora una guardia ya existente y same-origin al runtime. Debe vigilarse la interacción entre wrappers de `finishSetup`, `go`, `chooseOne` y `nextSetup`.

## Impacto en indicadores

- IUD: no calculado definitivamente.
- ICGD: mejora cualitativa de coherencia del Perfil IE, sin puntuación definitiva.
- IFR: pendiente de confirmación de despliegue y HTTP.
- ISU: no calculado definitivamente.
- Prelaunch: continúa BLOQUEADO por V5.
