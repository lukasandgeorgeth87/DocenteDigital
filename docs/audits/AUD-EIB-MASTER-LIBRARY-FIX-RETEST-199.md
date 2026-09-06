# AUD-EIB-MASTER-LIBRARY-FIX-RETEST-199

## Resumen

**Módulo:** EIB / Biblioteca Maestra / Materiales

**Estado:** NO PASA como corrección del bloqueante `AUD-MATERIAL-LANGUAGE-ROUTING-197`

**Clasificación:** Biblioteca Maestra EIB = PARCIALMENTE FUNCIONAL; Materiales EIB = ROTA

**Severidad:** S1 CRÍTICO heredado del hallazgo 197

**Gate V5:** continúa bloqueado.

## Motivo del retest

El commit `52809fab7111942e6360d2bc9ba6f95737b9a976` (`fix: route EIB master library by linguistic mode`) cambia `master-library-v10.js` para considerar EIB cuando `state.linguisticMode === 'EIB'`.

El cambio es pequeño y razonable para activar referencias EIB de la Biblioteca Maestra, pero no modifica el generador de Materiales que originó `AUD-MATERIAL-LANGUAGE-ROUTING-197`.

## Especificaciones aplicadas

- V2: Materiales y trazabilidad del perfil institucional/EIB.
- V3: una función no aprueba por aparecer o responder; EIB debe respetar lengua/variedad y demostrar funcionalidad real.
- V4: la interfaz debe ser simple y no engañar al usuario sobre el resultado de una selección.
- V5: Materiales EIB y salida pedagógica correcta son parte del gate de pre-lanzamiento.
- Núcleo IA: lengua y perfil EIB/monolingüe deben conservarse hasta Materiales; no inventar contenido lingüístico.

No se declara ninguna norma externa como vigente en este retest; la evidencia deriva del contrato interno y del código productivo.

## Prueba

**ID:** AUD-EIB-MASTER-LIBRARY-FIX-RETEST-199

**Entrada:**
1. Revisar el commit `52809fab...`.
2. Configurar conceptualmente una IE `EIB` con `Lengua de trabajo = Lengua originaria`.
3. Seleccionar una lengua no quechua, por ejemplo Aimara.
4. Ejecutar la ruta de Materiales / Crear lectura.

**Resultado esperado:**
- Si el commit pretende corregir la cadena EIB, Materiales debe respetar la lengua seleccionada o bloquear la generación si no existe soporte real.

**Resultado obtenido:**
- `master-library-v10.js` ahora detecta EIB mediante `state.linguisticMode` y activa autores/referencias EIB.
- `generateMaterial()` en `app.js` permanece sin cambios: reconoce `Castellano`, conserva una rama heredada `lang === 'Quechua'` que ya no coincide con la interfaz actual y usa un `else` que etiqueta la lengua seleccionada pero inserta la frase fija `Kay yakuqa...`.
- Por tanto, el cambio de Biblioteca Maestra no corrige la salida lingüística de Materiales.

## PASA / NO PASA

**NO PASA** como cierre o corrección de `AUD-MATERIAL-LANGUAGE-ROUTING-197`.

El cambio sí mejora parcialmente el enrutamiento de referencias EIB de la Biblioteca Maestra, pero no debe utilizarse como evidencia de que Materiales EIB está corregido.

## Causa raíz

La arquitectura EIB está fragmentada: `linguistic-profile-v26.js`, `master-library-v10.js` y `generateMaterial()` no comparten todavía un contrato lingüístico único y probado de extremo a extremo.

## Acción correctiva

1. Mantener el cambio de `master-library-v10.js` si no genera regresiones.
2. No cerrar `AUD-MATERIAL-LANGUAGE-ROUTING-197`.
3. Migrar `generateMaterial()` al contrato actual `linguisticMode + language + indigenousLanguage`.
4. Bloquear salidas en lenguas sin generador real/verificado en vez de reutilizar contenido quechua fijo.
5. Añadir pruebas automatizadas: EIB+Quechua, EIB+Aimara, EIB+Asháninka, EIB+Shipibo-Konibo, Bilingüe, Monolingüe castellano y cambio de perfil.
6. Mantener revisión humana competente como PENDIENTE para calidad lingüística real.

## Riesgo de regresión

Alto si se considera resuelto el problema por el solo hecho de que la Biblioteca Maestra detecte EIB. La interfaz puede seguir produciendo un material lingüísticamente falso sin error técnico visible.

## Impacto

- **IUD/ICGD:** sigue afectado por inconsistencia entre selección y artefacto.
- **IFR/ISU/Prelaunch:** no calcular definitivamente.
- **Prelaunch:** S1 continúa abierto.

## Decisión

DocenteDigital continúa **NO APROBADA PARA LANZAMIENTO V1.0**. Este retest no reemplaza ni reduce los bloqueantes previos ni las pruebas reales exigidas por V5.