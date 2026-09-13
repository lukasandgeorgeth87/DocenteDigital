# AUD-LINGUISTIC-SETTINGS-SUMMARY-STALE-276

## Estado
NO PASA · PARCIALMENTE FUNCIONAL · S2 ALTO

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

## Resultado obtenido por inspección verificable
`linguistic-profile-v26.js` envuelve `refresh()` y solo agrega el bloque lingüístico si `settingsSummary.innerHTML` todavía NO contiene `Atención lingüística:`. Si el bloque ya existe, no lo reemplaza. Por tanto un resumen ya renderizado puede conservar el perfil anterior después de editar la Ficha Maestra.

Fragmento causal:

```js
if(summary&&state.linguisticMode){
  const extra=`<br><b>Atención lingüística:</b> ${esc(state.linguisticMode)}...`;
  if(!/Atención lingüística:/.test(summary.innerHTML))summary.innerHTML+=extra;
}
```

## Evidencia
- `linguistic-profile-v26.js` en `main`, función wrapper de `refresh()`.
- `config-state-guard-v42.js` sí sanea los datos internos al pasar a monolingüe; el defecto está en la representación visible posterior, no en esa sanitización.
- Producción al momento de la auditoría: deployment `dpl_DNea4N6psBvHuVJPkkCRjiLcTYib`, SHA `89b1fdf1ec6373923f3992363783f444d053a614`, estado READY.
- URL canónica respondió HTTP 200.
- Vercel no reportó errores runtime durante la última hora; este hallazgo es un error silencioso de coherencia, no un Error 500.

## Causa raíz
El resumen lingüístico se trata como contenido que se añade una sola vez, en lugar de una vista derivada y reemplazable de la Ficha Maestra actual.

## Riesgo
El usuario puede creer que la IE sigue siendo EIB o que mantiene una lengua originaria previamente seleccionada aunque la fuente maestra ya sea monolingüe. Esto puede inducir decisiones pedagógicas posteriores equivocadas y debilita la confianza en la Ficha Maestra como fuente única.

## Acción correctiva requerida
Cambiar el bloque lingüístico del resumen por una región identificable y reemplazarla en cada `refresh()`, o reconstruir el resumen desde estado actual. No concatenar condicionalmente por simple presencia del texto.

Ejemplo seguro de diseño:

```js
const old=summary.querySelector('[data-dd-linguistic-summary]');
old?.remove();
summary.insertAdjacentHTML('beforeend', `<span data-dd-linguistic-summary>...</span>`);
```

La implementación debe escapar valores y mostrar lengua originaria solo cuando `state.linguisticMode==='EIB'`.

## Corrección en esta ronda
PENDIENTE. No se modificó el runtime porque el conector disponible reemplaza archivos completos y, dentro de esta ejecución, no hubo margen suficiente para hacer el reemplazo integral + despliegue + reprueba sin arriesgar una regresión. Se documenta el defecto en lugar de simular una corrección no verificada.

## Reprueba obligatoria
- EIB → Configuración → Monolingüe → Configuración: no debe quedar lengua antigua.
- Monolingüe → EIB + lengua confirmada → Configuración: debe aparecer la lengua nueva.
- Recarga de navegador: mismo resultado.
- Reapertura después de persistencia: mismo resultado.
- Móvil: resumen legible y sin duplicados.

## Impacto en indicadores
- IUD/ICGD: impacto negativo por contradicción visible de datos maestros.
- IFR/ISU/Prelaunch: no calcular puntaje definitivo; el hallazgo mantiene pendiente la prueba real de edición y reutilización de Ficha Maestra.

## Gate V5
Sigue BLOQUEADO. Este hallazgo no es el único bloqueante y no sustituye las pruebas reales pendientes de móvil, Word/PDF, E2E, seguridad, restore, IA100, año completo, escala y pilotos.
