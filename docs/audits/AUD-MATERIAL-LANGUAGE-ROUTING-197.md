# AUD-MATERIAL-LANGUAGE-ROUTING-197

## Resumen

**Módulo:** Materiales / perfil lingüístico EIB

**Estado:** NO PASA

**Clasificación:** ROTA para `Lengua originaria`; PARCIALMENTE FUNCIONAL para la superficie de selección lingüística

**Severidad:** S1 CRÍTICO

**Gate V5:** Bloqueante pedagógico/EIB hasta corrección y prueba lingüística real.

## Especificaciones aplicadas

- `AUDITORIA_MAESTRA_INTEGRAL_V2.md`: materiales diferenciados y reutilización coherente del perfil institucional.
- `ADENDA_AUDITORIA_EJECUTABLE_V3.md`: EIB no puede hardcodear una variedad por región; debe respetar lengua/variedad y demostrar funcionalidad real.
- `AUDITORIA_SIMPLICIDAD_USO_V4.md`: la interfaz no debe aparentar una función que produce un resultado distinto de la selección del usuario.
- `AUDITORIA_PRELANZAMIENTO_V5.md`: prueba pedagógica/EIB y anti-alucinación antes de lanzamiento.
- `NUCLEO_IA_DOCENTEDIGITAL.md`: conservar lengua y perfil EIB/monolingüe; no inventar contenido; heredar significado hacia Materiales.

No se declara ninguna norma MINEDU externa como vigente en este hallazgo. La evidencia se basa en el contrato interno obligatorio y en el comportamiento determinista del runtime.

## Prueba

**ID de prueba:** AUD-MATERIAL-LANGUAGE-ROUTING-197

**Entrada:**

1. Configurar IE como EIB.
2. Seleccionar `Lengua de trabajo = Lengua originaria`.
3. Seleccionar una lengua originaria válida del catálogo, por ejemplo `Aimara`, `Asháninka`, `Shipibo-Konibo` o `Quechua Cusco-Collao (Cusco)`.
4. Abrir Materiales.
5. Mantener `Idioma = Lengua originaria`.
6. Pulsar `Crear lectura`.

**Resultado esperado:**

- El generador debe reconocer exactamente `Lengua originaria` como modo de salida.
- Debe producir contenido únicamente en la lengua seleccionada si existe un generador lingüístico real y verificado para esa lengua.
- Si no existe dicha capacidad, debe bloquear la generación y explicar de forma sencilla que esa lengua todavía no está disponible.
- Nunca debe introducir castellano ni una frase quechua fija cuando el usuario eligió otra lengua.

**Resultado obtenido:**

`linguistic-profile-v26.js` reemplaza las opciones de Materiales por:

- `Castellano`
- `Lengua originaria`
- `Bilingüe`

Sin embargo, `generateMaterial()` en `app.js` todavía evalúa:

```js
if(lang==='Castellano') ...
else if(lang==='Quechua') ...
else ...
```

La condición `lang === 'Quechua'` es inalcanzable desde la interfaz productiva actual porque el valor correspondiente ahora es `Lengua originaria`.

Por ello `Lengua originaria` cae siempre en el `else`, que genera una salida bilingüe fija:

```text
CASTELLANO: ... | <variety>: Kay yakuqa ...
```

El texto indígena utilizado es una frase quechua hardcodeada independientemente de que la selección sea Aimara, Asháninka, Awajún, Shipibo-Konibo u otra lengua.

Esto produce simultáneamente dos fallos:

1. **fallo de routing:** `Lengua originaria` entrega una salida bilingüe en lugar de monolingüe originaria;
2. **fallo de identidad lingüística:** la etiqueta puede mostrar una lengua seleccionada mientras el contenido subyacente sigue siendo una frase quechua fija.

## Evidencia técnica

### `linguistic-profile-v26.js`

`mountMaterials()` instala exactamente:

```js
ml.innerHTML='<option value="Castellano">Castellano</option><option value="Lengua originaria">Lengua originaria</option><option value="Bilingüe">Bilingüe</option>';
```

El catálogo incluye múltiples lenguas originarias, no solamente quechua.

### `app.js`

`generateMaterial()` conserva la condición heredada `else if(lang==='Quechua')`, que ya no coincide con el valor de la interfaz, y su fallback genera la frase fija `Kay yakuqa...` para cualquier lengua no castellana.

### Producción

El 6 de septiembre de 2026 se verificó mediante la URL productiva de Vercel que:

- `/app.js` responde HTTP 200 y contiene esta lógica;
- `/linguistic-profile-v26.js` responde HTTP 200 y publica `Lengua originaria` / `Bilingüe` junto al catálogo multi-lengua.

Por tanto, el defecto está presente en `main` y en producción, no solo en código histórico.

## PASA / NO PASA

**NO PASA**

## Causa raíz

La superficie lingüística fue ampliada desde un prototipo centrado en quechua a un perfil EIB multi-lengua, pero el generador antiguo `generateMaterial()` no fue migrado al nuevo contrato de valores ni a una arquitectura lingüística real.

## Acción correctiva obligatoria

No corregir cambiando únicamente `lang==='Quechua'` por `lang==='Lengua originaria'`, porque eso seguiría generando quechua para cualquier lengua seleccionada.

Corrección mínima segura:

1. Mantener generación en castellano solo si está verificada.
2. Para `Lengua originaria` o `Bilingüe`, comprobar si existe un generador real para `state.indigenousLanguage` / selección actual.
3. Si no existe, detener la generación y mostrar un mensaje sencillo de función pendiente; no simular traducción.
4. Cuando exista backend/IA lingüística real, probar por cada lengua soportada: texto objetivo, ortografía, variedad, caracteres, fidelidad semántica y revisión humana competente.
5. Guardar lengua, variedad y procedencia del contenido junto al material para trazabilidad.
6. Añadir golden tests EIB que impidan que una lengua seleccionada reciba contenido de otra.

## Retest requerido

- EIB + Quechua Cusco-Collao + Lengua originaria.
- EIB + Aimara + Lengua originaria.
- EIB + Asháninka + Lengua originaria.
- EIB + Shipibo-Konibo + Lengua originaria.
- EIB + cualquiera de las anteriores + Bilingüe.
- Monolingüe castellano.
- Cambio EIB → monolingüe.
- Reapertura de material histórico tras cambio de perfil.

Las pruebas lingüísticas de calidad con hablantes/revisores competentes quedan **PENDIENTES** y no deben simularse.

## Riesgo de regresión

Alto si se parchea con una simple comparación de strings: puede hacer que la interfaz parezca corregida mientras continúa la asignación de contenido quechua a otras lenguas.

## Impacto en indicadores

- **IUD:** impacto negativo por resultado diferente de la opción elegida.
- **ICGD:** impacto negativo por incoherencia entre perfil lingüístico y artefacto.
- **IFR:** no calcular definitivamente; aumenta riesgo funcional del flujo Materiales.
- **ISU:** no calcular definitivamente; la selección es simple, pero el resultado es engañoso.
- **Prelaunch:** bloquea aprobación de Materiales EIB hasta corrección y pruebas reales.

## Decisión

**DocenteDigital NO está lista para lanzamiento V1.0.** Este hallazgo no sustituye los S1/S0 previos ni las pruebas físicas y de usuarios reales exigidas por V5.