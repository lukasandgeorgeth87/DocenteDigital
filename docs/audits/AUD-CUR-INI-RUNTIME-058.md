# AUD-CUR-INI-RUNTIME-058 — Guardia curricular de Inicial no accedía al estado real

## Especificaciones aplicadas

- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

## Prueba

**ID:** AUD-CUR-INI-RUNTIME-058  
**Módulo:** Perfil IE / Educación Inicial / áreas curriculares  
**Entrada:** estado de la app con `level = 'Inicial'`, ejecución posterior de `initial-curriculum-guard-v72.js` y apertura de la selección de áreas.  
**Esperado:** la guardia debe leer el mismo estado léxico creado por `app.js`, devolver las áreas de Inicial definidas por la guardia y normalizar estados antiguos que contengan `Arte y Cultura`.  
**Obtenido antes:** `app.js` declara `const state = ...` en el ámbito global léxico, pero la guardia comprobaba `window.state`. Un `const` global no se convierte en propiedad de `window`; por ello `window.state` podía ser `undefined`, la rama de Inicial no se activaba y `normalizeInitialAreaState()` retornaba antes de corregir el estado.  
**Evidencia:** `app.js` inicia con `const state=...`; la versión anterior de `initial-curriculum-guard-v72.js` evaluaba `window.state?.level` y `if(!window.state||...) return false`.  
**Resultado inicial:** NO PASA.  
**Severidad:** S1 — la corrección curricular anunciada podía no ejecutarse y dejar visible una estructura curricular incorrecta en una función pedagógica principal.  
**Clasificación inicial:** PARCIALMENTE FUNCIONAL.

## Causa raíz

Confusión entre el ámbito global léxico de JavaScript (`const state`) y las propiedades del objeto global (`window.state`). La guardia fue cargada después de `app.js`, pero buscaba el estado en un lugar distinto al que realmente lo contiene.

## Corrección

`initial-curriculum-guard-v72.js` pasa a lógica interna v72.1 e incorpora `getState()`, que obtiene de forma segura la variable léxica `state` mediante `typeof state !== 'undefined'`. Tanto la sobrescritura de `areaOptions()` como la normalización usan ahora el mismo objeto de estado que usa `app.js`.

Cambio pequeño y reversible. No activa `curriculumMatrixReady`, no modifica documentos históricos y no toca otros repositorios.

## Evidencia posterior

- Commit funcional: `83aae92a5641f0ea65bcddac0a59883878141975`.
- Vercel: deployment `dpl_7MSMFi4PyHSpgj8tUiVNgN5ZSZaF`, target `production`, estado `READY`.
- Producción `/`: HTTP 200.
- Producción `/initial-curriculum-guard-v72.js`: HTTP 200 y sirve v72.1 con `getState()`.

## Estado posterior

**PASA dentro de la evidencia técnica ejecutable disponible.** La prueba demuestra la corrección de la frontera de estado y la publicación del código corregido. No equivale a prueba física en celular ni a validación con usuarios reales.

## Fuente oficial curricular

El compendio oficial vigente publicado por MINEDU en Gob.pe mantiene disponibles los Programas Curriculares de Educación Inicial, Primaria y Secundaria. La estructura curricular de Inicial debe verificarse contra ese Programa Curricular oficial antes de ampliar la matriz completa.

## Riesgo de regresión

Bajo. Si en una refactorización futura `state` deja de existir como variable léxica o se encapsula en un módulo, `getState()` deberá sustituirse por una API explícita de estado. Se recomienda consolidar posteriormente una única interfaz de acceso al estado en vez de parches globales.

## Impacto en índices/gates

- IUD: mejora indirecta al evitar opciones curriculares incorrectas en la configuración.
- ICGD/IFR: mejora técnica puntual; no calcular puntuación definitiva sin batería completa.
- ISU: sin puntuación nueva; requiere prueba real con usuarios.
- Prelaunch: reduce un S1 puntual, pero NO habilita el lanzamiento.

## Bloqueantes V5 que permanecen

Siguen PENDIENTES, entre otros: matriz curricular oficial completa y versionada; autenticación y aislamiento multiusuario; backend productivo; OWASP ASVS real; backup/restauración real; pruebas físicas Word/PDF e impresión; móvil físico; 100 generaciones; año escolar completo; concurrencia; monitoreo/costo IA; continuidad sin IA; y pilotos 5–10, 30–50 y 100–300 usuarios.
