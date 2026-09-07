# AUD-INSTRUMENT-SELECTION-BY-AREA-224

## Resumen

**Estado:** NO PASA  
**Severidad:** S2 ALTO  
**Clasificación:** PARCIALMENTE FUNCIONAL / PEDAGÓGICAMENTE INSUFICIENTE  
**Módulo:** Sesiones → criterio/evidencia/instrumento  
**Gate V5:** no cierra por sí solo un gate adicional, pero mantiene sin demostrar la cadena pedagógica Sesión → Criterio → Evidencia → Instrumento → Registro.

## Especificaciones obligatorias aplicadas

- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`: el generador de instrumentos debe seleccionar según necesidad y analizar **criterio + evidencia + naturaleza del aprendizaje**; no seleccionar un instrumento solo por costumbre.
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`: una función no aprueba porque genere texto; debe ser correcta, trazable y verificable.
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`: exige probar la cadena Programación → Unidad → Sesiones → Criterios → Evidencias → Instrumentos → Registro.
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`: la app debe comprender el significado, verificar contexto y mantener coherencia entre fases.

## Evidencia técnica

En `app.js` la función productiva es:

```js
function instrumentFor(area){
  return area==='Ciencia y Tecnología'
    ? 'Rúbrica breve de indagación'
    : 'Lista de cotejo con un criterio claro y medible'
}
```

`buildSession()` llama a `instrumentFor(area)` sin pasar criterio, evidencia, tipo de desempeño, producto, competencia, grado ni naturaleza de la actividad.

Esto implica que cualquier sesión de Comunicación, Matemática, Personal Social, Arte y Cultura, Educación Física, Educación Religiosa o Psicomotriz recibe por defecto una **lista de cotejo**, aun cuando la evidencia pueda exigir una rúbrica, escala de valoración, registro anecdótico u otro instrumento pertinente.

## Pruebas

### AUD-INST-224-A — Comunicación: producción escrita compleja

**Entrada:** sesión de Comunicación cuyo título implique planificar/escribir/revisar un texto y cuya evidencia sea una producción comunicativa revisada.

**Esperado:** el sistema analiza criterio + evidencia + naturaleza del producto y selecciona/proporciona un instrumento pertinente; si existe más de una opción válida, propone justificadamente y permite decisión docente.

**Obtenido:** `instrumentFor('Comunicación')` devuelve siempre `Lista de cotejo con un criterio claro y medible`.

**Resultado:** NO PASA.

### AUD-INST-224-B — Personal Social: acuerdos/propuesta argumentada

**Entrada:** sesión de Personal Social con evidencia `Conclusiones, acuerdos o propuesta argumentada sobre la situación analizada`.

**Esperado:** instrumento elegido según lo que se observará y el nivel de calidad requerido, no solo por el nombre del área.

**Obtenido:** lista de cotejo fija.

**Resultado:** NO PASA.

### AUD-INST-224-C — Arte y Cultura / Educación Física

**Entrada:** sesión con producción artística o desempeño motriz observable.

**Esperado:** selección basada en desempeño/producto y criterio, con posibilidad de rúbrica o escala si corresponde.

**Obtenido:** lista de cotejo fija.

**Resultado:** NO PASA.

## Causa raíz

La selección del instrumento está implementada como una regla binaria por **área** y no como parte del razonamiento evaluativo. No existe un contrato estructurado que reciba al menos:

- competencia;
- criterio;
- evidencia;
- naturaleza del desempeño/producto;
- grado/edad;
- finalidad de la evaluación.

## Acción correctiva recomendada

Crear un selector auditable de instrumentos, por ejemplo `selectInstrument({area, competence, criterion, evidence, evidenceType, grade, assessmentPurpose})`, con reglas explícitas y posibilidad de revisión docente.

Reglas mínimas:

1. identificar qué evidencia se observará;
2. determinar si se evalúa presencia/ausencia, calidad por niveles, frecuencia/intensidad, proceso o desempeño;
3. proponer instrumento pertinente;
4. explicar brevemente por qué;
5. permitir que el docente lo cambie;
6. persistir la decisión y reutilizarla en Registro.

No corregir sustituyendo una lista fija por otra tabla fija de área→instrumento; eso mantendría el mismo defecto conceptual.

## Evidencia posterior / retest requerido

PENDIENTE. Debe retestearse con golden cases de Comunicación, Matemática, Personal Social, Ciencia y Tecnología, Arte y Cultura y Educación Física; además con distintos tipos de evidencia dentro de una misma área.

## Fuente oficial externa

No se aplicó una norma externa para clasificar este hallazgo. La conclusión deriva de las especificaciones obligatorias del proyecto y del código productivo actual. Cualquier norma o lineamiento externo que se incorpore después deberá verificarse contra fuente oficial vigente antes de declararlo aplicable.

## Riesgo de regresión

**Medio-alto.** Cambiar la lógica de instrumentos puede alterar sesiones existentes, Word y futura integración con Registro. Debe versionarse y probarse antes de producción.

## Impacto

- **IUD:** negativo; el instrumento puede no corresponder a la evidencia.
- **ICGD:** negativo; rompe coherencia criterio→evidencia→instrumento.
- **IFR:** pendiente; no calcular puntaje definitivo.
- **ISU:** impacto indirecto; una selección errónea aumenta corrección manual.
- **Prelaunch:** mantiene sin demostrar la cadena pedagógica completa exigida por V5.

## Conclusión

La función de instrumento existe y produce texto, pero no cumple el criterio de funcionalidad real exigido por V2/V3/V5. Actualmente es **PARCIALMENTE FUNCIONAL** y la selección es **pedagógicamente insuficiente** porque depende casi exclusivamente del área.