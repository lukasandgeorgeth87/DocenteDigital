# AUD-SESSION-LINGUISTIC-SNAPSHOT-193

## Módulo
Sesión / EIB / perfil lingüístico / herencia Unidad→Sesión / trazabilidad.

## Especificaciones aplicadas
- Auditoría Maestra Integral V2.
- Adenda Ejecutable V3.
- Auditoría de Simplicidad V4.
- Auditoría de Prelanzamiento V5.
- Núcleo IA DocenteDigital.

## Prueba
**ID:** AUD-SESSION-LINGUISTIC-SNAPSHOT-193

**Entrada:** configurar una IE EIB con lengua/variedad A; crear y guardar una Unidad/Proyecto; posteriormente cambiar la configuración lingüística general a otra lengua/variedad B o a monolingüe castellano; volver a la Unidad A y generar una sesión derivada.

**Esperado:** la Unidad conserva su snapshot histórico lingüístico y la Sesión derivada hereda de forma explícita el perfil lingüístico aprobado de su Unidad de origen (modo lingüístico, lengua de trabajo y lengua originaria/variedad), salvo cambio/versionado deliberado del usuario. Esa información debe quedar trazable en el objeto y, cuando sea pedagógicamente pertinente, en la salida/exportación. No debe depender silenciosamente del estado global actual.

**Obtenido:** `createUnitDemo()` guarda `language: state.language` y `quechuaVar: state.quechuaVar` dentro de la Unidad. Sin embargo, `buildSession()` no copia esos campos ni `linguisticMode`/`indigenousLanguage` al objeto sesión. `sessionHtml()` tampoco presenta el perfil lingüístico. `session-learning-core-v54.js` enriquece propósito, competencia, capacidades, desempeño, enfoques, criterio, evidencia y datos informativos, pero no añade snapshot lingüístico ni lo hereda de la Unidad.

Esto deja dos fuentes de verdad: la Unidad conserva parte de su contexto lingüístico histórico, mientras la sesión no lo inmoviliza. Cualquier módulo posterior que consulte `state.linguisticMode`, `state.language` o `state.indigenousLanguage` puede usar la configuración actual en lugar de la vigente cuando se creó/aprobó la Unidad.

## Evidencia técnica
- `app.js`: `createUnitDemo()` persiste `language` y `quechuaVar` en la Unidad.
- `app.js`: `buildSession()` persiste nivel, tipo de IE y grados desde estado global, pero no guarda `language`, `quechuaVar`, `linguisticMode` ni `indigenousLanguage`.
- `app.js`: `sessionHtml()` no muestra perfil lingüístico.
- `linguistic-profile-v26.js`: declara que para EIB la lengua seleccionada se reutilizará en planificación, sesiones y materiales, y mantiene el perfil en `state`.
- `session-learning-core-v54.js`: el enriquecimiento de sesión no incorpora perfil lingüístico.

## Resultado
**NO PASA.**

**Severidad:** S1 CRÍTICO por integridad/trazabilidad pedagógica EIB y deriva silenciosa del contexto histórico Unidad→Sesión.

**Clasificación:** PARCIALMENTE FUNCIONAL. La configuración EIB existe y la Unidad guarda parte del snapshot; la herencia histórica completa hacia Sesión es INEXISTENTE.

## Causa raíz
El perfil lingüístico está modelado principalmente como configuración global mutable. La Unidad toma un snapshot parcial, pero la sesión no define una fuente de verdad lingüística propia ni hereda explícitamente el snapshot de la Unidad.

## Acción requerida
Definir contrato de herencia histórico antes de corregir:
1. ampliar el snapshot de Unidad a `linguisticMode`, `language`, `indigenousLanguage` y variedad normalizada;
2. hacer que la Sesión derivada herede prioritariamente esos datos de la Unidad;
3. usar `state` solo como fallback para sesiones sin Unidad válida;
4. validar coherencia antes de guardar/exportar;
5. versionar o pedir decisión explícita si el usuario cambia el perfil lingüístico de la IE después de crear la Unidad;
6. probar EIB→EIB con cambio de lengua, EIB→monolingüe y monolingüe→EIB.

## Corrección automática
No aplicada. Corregir solo el objeto sesión sin definir conjuntamente migración de unidades históricas, materiales, exportaciones y módulos que aún leen el estado global podría crear una falsa sensación de consistencia. No es un cambio pequeño suficientemente aislado para esta pasada.

## Relación con hallazgos previos
Es distinto de AUD-EIB-SESSION-LABEL-121, que corrigió un rótulo EIB incorrecto en la superficie de Sesión. También complementa AUD-SESSION-GRADE-SNAPSHOT-185: ambos evidencian que la herencia histórica Unidad→Sesión todavía no tiene un contrato único para todos los campos contextuales.

## Bloqueantes V5
Permanece NO APROBADO el prelaunch mientras no exista trazabilidad E2E del perfil lingüístico, pruebas reales EIB/monolingüe, DOCX/PDF verificables, persistencia estable, backend/seguridad, dispositivos físicos, 100 generaciones y pilotos reales.
