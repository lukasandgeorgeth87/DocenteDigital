# AUD-EIB-LINGUISTIC-PROFILE-MATERIAL-MISMATCH-221

## Resumen

**Estado:** NO PASA  
**Severidad:** S1 CRÍTICO  
**Clasificación:** Perfil lingüístico = PARCIALMENTE FUNCIONAL; persistencia EIB/monolingüe = ROTA/INEXISTENTE; generación en lengua originaria = ROTA; generación bilingüe = PARCIALMENTE FUNCIONAL/DEMOSTRATIVA.

## Especificaciones aplicadas

- `AUDITORIA_MAESTRA_INTEGRAL_V2.md`: una Ficha Maestra única debe conservar EIB/no EIB, lengua o lenguas y reutilizarlas; la aplicación debe evitar duplicación y contradicción de datos.
- `ADENDA_AUDITORIA_EJECUTABLE_V3.md`: no hardcodear variedad lingüística por región; probar IE EIB y cambio EIB → monolingüe; preservar fuente única de verdad.
- `AUDITORIA_SIMPLICIDAD_USO_V4.md`: la configuración se registra una sola vez y se reutiliza; no pedir ni reinterpretar datos ya definidos.
- `AUDITORIA_PRELANZAMIENTO_V5.md`: probar EIB, caracteres especiales, persistencia, materiales, guardado/recuperación y flujo E2E antes de lanzamiento.
- `NUCLEO_IA_DOCENTEDIGITAL.md`: el perfil semántico debe conservar lengua y perfil EIB/monolingüe; las guardas deben validar EIB/monolingüe y lengua elegida; la auditoría semántica debe verificar que se respetan.

## Evidencia de código/runtime

En `index.html` la configuración ofrece `#linguisticMode` con valores `EIB` y `Monolingüe castellano`, además de `#language` con valores `Castellano`, `Lengua originaria` y `Bilingüe`.

Sin embargo, `finishSetup()` en `app.js` solo persiste:

```js
state.language=byId('language').value;
state.quechuaVar=byId('quechuaVar').value;
save();
```

No lee ni guarda `#linguisticMode`. El estado tampoco inicializa `state.linguisticMode`.

Además `generateMaterial()` evalúa:

```js
if(lang==='Castellano') ...
else if(lang==='Quechua') ...
else ...
```

pero el selector productivo no devuelve `Quechua`; devuelve `Lengua originaria`. Por tanto, al elegir **Lengua originaria**, la función cae en el `else` destinado de hecho a la salida bilingüe y genera contenido mezclado/incorrecto respecto de la opción elegida.

La producción `https://docente-digital.vercel.app/` y `https://docente-digital.vercel.app/app.js` fueron consultadas directamente y contienen estas mismas rutas, con HTTP 200.

## Prueba AUD-EIB-221-A — Persistencia del perfil EIB/monolingüe

**Entrada:** configurar una IE como `EIB`, seleccionar lengua de trabajo y guardar.  
**Resultado esperado:** `EIB` queda persistido como parte de la Ficha Maestra y se reutiliza en Unidad/Proyecto, Sesiones, Materiales y evaluación; al reabrir configuración se conserva el valor.  
**Resultado obtenido:** `finishSetup()` no lee ni almacena `linguisticMode`; el dato se pierde como fuente de verdad.  
**Evidencia:** `index.html` contiene `#linguisticMode`; `app.js` no lo persiste ni lo incorpora al estado.  
**Resultado:** **NO PASA**.  
**Severidad:** **S1 CRÍTICO** porque puede producir documentos/materiales incompatibles con el perfil lingüístico real de la IE y rompe la guarda EIB/monolingüe definida por el Núcleo IA.  
**Acción correctiva:** incorporar `state.linguisticMode`, guardar/restaurar el valor, migrar estados existentes sin inventar datos y usarlo como guarda explícita antes de generar materiales/documentos.

## Prueba AUD-EIB-221-B — Material “Lengua originaria”

**Entrada:** Materiales → Idioma = `Lengua originaria` → generar.  
**Resultado esperado:** salida exclusivamente en la lengua/variedad confirmada, o bloqueo/advertencia si no existe motor lingüístico validado.  
**Resultado obtenido:** `generateMaterial()` busca `lang==='Quechua'`, valor que el selector no produce. `Lengua originaria` cae al `else`, que concatena texto castellano + texto de demostración de la variedad.  
**Evidencia:** diferencia literal entre opciones del selector de `index.html` y ramas de `generateMaterial()` en `app.js`.  
**Resultado:** **NO PASA**.  
**Severidad:** **S1 CRÍTICO** por salida lingüísticamente incorrecta respecto de la opción seleccionada.  
**Acción correctiva:** alinear valores semánticos del selector y el generador mediante constantes/enum (`castellano`, `lengua_originaria`, `bilingue`); no asumir “Quechua” como sinónimo de toda lengua originaria; exigir variedad confirmada y validar la salida.

## Prueba AUD-EIB-221-C — Cambio EIB → monolingüe

**Entrada:** configurar EIB, generar/guardar datos, luego cambiar a monolingüe.  
**Resultado esperado:** documentos históricos mantienen su snapshot; documentos nuevos dejan de heredar componentes EIB no aplicables; el sistema registra explícitamente el nuevo perfil.  
**Resultado obtenido:** al no existir `linguisticMode` persistente, el sistema no puede demostrar ni aplicar de forma fiable esta transición.  
**Resultado:** **NO PASA / NO DEMOSTRADO**.  
**Severidad:** S1 por impacto transversal en generación y trazabilidad lingüística.

## Causa raíz

La UI introdujo un campo de perfil lingüístico sin integrarlo al modelo de estado, mientras el generador de materiales usa valores incompatibles con los del selector. La interfaz y la lógica no comparten un contrato semántico único.

## Corrección segura propuesta

1. Definir enum interno estable para `linguisticMode` y `language`.
2. Persistir `linguisticMode` en la Ficha Maestra.
3. Restaurarlo al abrir configuración.
4. Validar combinaciones: monolingüe + castellano; EIB + lengua/variedad confirmada; bilingüe cuando corresponda.
5. No generar texto en lengua originaria sin motor/plantilla validada; si no existe, mostrar estado PENDIENTE en vez de simular calidad lingüística.
6. Snapshot de `linguisticMode`, lengua y variedad en unidades/sesiones/materiales históricos.
7. Añadir pruebas EIB → monolingüe, monolingüe → EIB, recarga, cierre/reapertura, exportación y móvil.

## Riesgo de regresión

Medio/alto: toca Ficha Maestra y herencia documental. La corrección debe migrar estados antiguos donde el campo no existe y no reinterpretar históricos.

## Impacto en indicadores

- **ICGD/IFR:** negativo por inconsistencia funcional y documental.
- **ISU:** negativo porque el usuario selecciona una opción que la app no respeta.
- **Prelaunch:** bloqueado mientras exista riesgo de generar materiales con perfil lingüístico incorrecto.
- No se calcula una puntuación definitiva sin pruebas reales y piloto.

## Estado de pruebas físicas

PENDIENTES: móvil físico, impresión/Word físico con caracteres de lengua originaria, validación lingüística por hablantes/especialistas, pruebas E2E con IE EIB real.

## Normativa externa

Este hallazgo se determina por las especificaciones internas V2–V5 y Núcleo IA. No se declara aquí ninguna norma MINEDU/UGEL externa como vigente sin verificación oficial independiente.
