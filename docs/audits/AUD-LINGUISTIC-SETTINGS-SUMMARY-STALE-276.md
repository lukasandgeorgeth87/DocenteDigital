# AUD-LINGUISTIC-SETTINGS-SUMMARY-STALE-276

## Estado
PASA EN IMPLEMENTACIÓN · FUNCIONAL EN IMPLEMENTACIÓN · E2E REAL PENDIENTE · severidad residual S3

## Especificaciones aplicadas
- AUDITORIA_MAESTRA_INTEGRAL_V2.md: Ficha Maestra única y reutilización de datos.
- ADENDA_AUDITORIA_EJECUTABLE_V3.md: fuente única de verdad, coherencia y prueba real.
- AUDITORIA_SIMPLICIDAD_USO_V4.md: configuración una sola vez, lenguaje claro y evitar información contradictoria.
- AUDITORIA_PRELANZAMIENTO_V5.md: crear/editar IE, persistencia y recuperación antes de V1.0.
- NUCLEO_IA_DOCENTEDIGITAL.md: respetar perfil EIB/monolingüe y herencia de significado.

## ID de prueba
AUD-LING-276-A

## Entrada
1. Perfil inicial EIB con lengua originaria confirmada.
2. Abrir Configuración para que `settingsSummary` muestre atención lingüística.
3. Editar la Ficha Maestra y cambiar a `Monolingüe castellano`.
4. Volver a Configuración.

## Resultado esperado
El resumen visible debe reflejar siempre el estado maestro actual. Después del cambio debe mostrar `Monolingüe castellano` y no conservar una lengua originaria antigua.

## Resultado obtenido antes de la corrección
`linguistic-profile-v26.js` envolvía `refresh()` y solo agregaba el bloque lingüístico si `settingsSummary.innerHTML` todavía NO contenía `Atención lingüística:`. Si el bloque ya existía, no lo reemplazaba. Por tanto un resumen ya renderizado podía conservar el perfil anterior después de editar la Ficha Maestra.

Fragmento causal previo:

```js
if(summary&&state.linguisticMode){
  const extra=`<br><b>Atención lingüística:</b> ${esc(state.linguisticMode)}...`;
  if(!/Atención lingüística:/.test(summary.innerHTML))summary.innerHTML+=extra;
}
```

## Causa raíz
El resumen lingüístico se trataba como contenido que se añade una sola vez, en lugar de una vista derivada y reemplazable de la Ficha Maestra actual.

## Corrección aplicada
Commit funcional: `83058db1b1998fa312ab85147951f702d8f8f8c3` — `fix: refresh linguistic settings summary from master state`.

`linguistic-profile-v26.js` pasa a v26.1 e incorpora `syncSettingsSummary()`:

```js
function syncSettingsSummary(){
  const summary=document.getElementById('settingsSummary');
  if(!summary)return;
  summary.querySelector('[data-dd-linguistic-summary]')?.remove();
  if(!state.linguisticMode)return;
  const block=document.createElement('span');
  block.dataset.ddLinguisticSummary='1';
  block.innerHTML=`<br><b>Atención lingüística:</b> ${esc(state.linguisticMode)}${state.linguisticMode==='EIB'?`<br><b>Lengua originaria:</b> ${esc(state.indigenousLanguage||NONE)}`:''}`;
  summary.appendChild(block);
}
```

La función se ejecuta después de `refresh()`, al sincronizar explícitamente el perfil y en el montaje inicial. La lengua originaria solo se representa cuando el modo actual es EIB.

## Reprueba AUD-LING-276-R1
### Entrada
Inspección del runtime corregido y producción desplegada.

### Resultado esperado
- Región lingüística reemplazable en cada refresco.
- Sin concatenación permanente del valor antiguo.
- Monolingüe no muestra lengua originaria heredada.
- EIB muestra la lengua maestra actual.

### Resultado obtenido
PASA EN IMPLEMENTACIÓN. El asset de producción contiene v26.1, `syncSettingsSummary()`, remoción de `[data-dd-linguistic-summary]` y render condicional de lengua originaria exclusivamente para EIB.

### Evidencia posterior
- Deployment Vercel `dpl_94Yf4emR4pDTtXZcqGki4Xdqh7yF`.
- SHA desplegado `83058db1b1998fa312ab85147951f702d8f8f8c3`.
- Estado `READY`, target `production`.
- `https://docente-digital.vercel.app/` respondió HTTP 200.
- `https://docente-digital.vercel.app/linguistic-profile-v26.js` respondió HTTP 200 y sirve v26.1.

## Limitación de evidencia
No se declara PASA E2E. El ejecutor `agent-browser` indicado para interacción web no está instalado en el entorno de esta ejecución, por lo que no fue posible realizar automáticamente la secuencia física EIB → Configuración → Monolingüe → Configuración ni el camino inverso. Esa evidencia queda pendiente y no se simula.

## Repruebas todavía obligatorias
- EIB → Configuración → Monolingüe → Configuración: no debe quedar lengua antigua.
- Monolingüe → EIB + lengua confirmada → Configuración: debe aparecer la lengua nueva.
- Recarga de navegador: mismo resultado.
- Reapertura después de persistencia: mismo resultado.
- Móvil físico: resumen legible y sin duplicados.

## Riesgo de regresión
Bajo-medio. El cambio toca solo la representación del resumen de Configuración y no la persistencia maestra; debe vigilarse que otras capas que reconstruyen `settingsSummary` no eliminen el bloque o vuelvan a introducir contenido lingüístico duplicado.

## Impacto en indicadores
- IUD/ICGD: mejora de coherencia visible de datos maestros.
- IFR/ISU/Prelaunch: no calcular puntaje definitivo; sigue faltando la prueba E2E y las evidencias físicas V5.

## Gate V5
Sigue BLOQUEADO. Esta corrección no sustituye pruebas reales pendientes de móvil, Word/PDF, E2E Docente/Director, seguridad, restore, IA100, continuidad sin IA, año completo, escala y pilotos.