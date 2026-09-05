# AUD-UNIT-TEMPORALIZATION-174 — La secuencia puede exceder la duración elegida

**Fecha de auditoría:** 2026-09-05

## Alcance

Módulo Docente → Unidad / Proyecto → temporalización de actividades. Se revisó el comportamiento contra AUDITORIA_MAESTRA_INTEGRAL_V2, ADENDA_AUDITORIA_EJECUTABLE_V3, AUDITORIA_SIMPLICIDAD_USO_V4, AUDITORIA_PRELANZAMIENTO_V5 y NUCLEO_IA_DOCENTEDIGITAL.

## Prueba

**ID:** AUD-UNIT-TEMPORALIZATION-174  
**Persona:** docente de Primaria / QA / especialista pedagógico  
**Entrada:** Primaria; selección de las 7 áreas disponibles; duración `1 semana`; contexto no vacío; creación de una Unidad de aprendizaje o Proyecto de aprendizaje.  
**Resultado esperado:** la temporalización generada debe respetar la duración seleccionada; para `1 semana` ninguna actividad puede quedar asignada a `Semana 2` o posterior.  
**Resultado obtenido:** `buildActivities()` calcula `target = Math.max(state.areas.length, weeks * 5)`. Con 7 áreas y 1 semana produce 7 actividades. Luego asigna `week: Math.floor(i / 5) + 1`, por lo que las actividades 6 y 7 quedan en `Semana 2`, aunque el documento conserva `duration: "1 semana"`. La vista y la exportación muestran esa semana fuera del rango.  
**PASA / NO PASA:** **NO PASA**  
**Clasificación funcional:** **PARCIALMENTE FUNCIONAL**  
**Severidad:** **S2 ALTO**

## Evidencia reproducible

En `index.html`, Primaria permite varias áreas y el selector de duración ofrece de 1 a 6 semanas. La superficie de Unidad/Proyecto envía esa duración a `createUnitDemo()`.

En `app.js`:

```js
function buildActivities(brief,duration){
  const weeks=Math.max(1,parseInt(duration)||3);
  const target=Math.max(state.areas.length,weeks*5);
  const counters={};
  return Array.from({length:target},(_,i)=>{
    const area=state.areas[i%state.areas.length];
    const variants=activityVariants(area,brief);
    counters[area]=(counters[area]||0)+1;
    return {area,title:variants[(counters[area]-1)%variants.length],week:Math.floor(i/5)+1,order:i+1};
  });
}
```

Caso determinista:

- `weeks = 1`
- `state.areas.length = 7`
- `target = max(7, 5) = 7`
- índices 0–4 → Semana 1
- índices 5–6 → Semana 2

La misma lógica está servida actualmente desde producción en `https://docente-digital.vercel.app/app.js` con respuesta HTTP 200.

## Causa raíz

La cantidad de actividades se decide con una regla y la semana con otra incompatible:

1. el generador obliga a crear al menos una actividad por área;
2. la temporalización supone rígidamente cinco actividades por semana;
3. no existe una validación final `max(activity.week) <= duración seleccionada`;
4. esa regla de cinco actividades semanales tampoco proviene del horario/calendario real de la IE.

## Impacto

- La Unidad/Proyecto puede contradecir una decisión explícita del docente.
- La inconsistencia se hereda a `Crear sesiones`, porque el selector de sesión consume `unit.activities`.
- La exportación de la unidad conserva el mismo número de semana erróneo.
- Es un error silencioso: no genera excepción y no aparecerá necesariamente en logs runtime.
- Afecta negativamente IUD, ICGD, IFR y Prelaunch. No se calcula puntuación definitiva sin las pruebas exigidas por V5.

## Acción correctiva

No aplicar un simple `Math.min(weeks, ...)` como parche definitivo: ocultaría el problema y podría amontonar actividades artificialmente en la última semana.

La corrección debe:

1. construir la temporalización desde el horario/calendario o una capacidad semanal explícita y verificable;
2. reconciliar número de áreas, frecuencia de atención y duración;
3. ejecutar una validación previa al guardado que impida semanas fuera del rango;
4. mostrar al docente una advertencia comprensible cuando la carga propuesta no quepa en la duración elegida;
5. probar combinaciones de 1–6 semanas × cantidad de áreas de Inicial/Primaria/Secundaria, incluyendo multigrado;
6. probar la herencia Unidad → Sesiones y la exportación después de corregir.

## Riesgo de regresión

**Medio/alto** si se toca directamente la distribución de actividades, porque `unit.activities` alimenta vista, sesiones y exportación. Se recomienda resolverlo con pruebas de invariantes antes de cambiar el algoritmo productivo.

## Estado

**ABIERTO.** No se aplicó cambio funcional automático porque la distribución pedagógica correcta requiere definir la temporalización real y no debe sustituirse por una regla arbitraria nueva.

DocenteDigital continúa **NO APROBADA PARA LANZAMIENTO V1.0** mientras existan bloqueantes V5 o falten las pruebas reales esenciales.
