# AUD-MATERIAL-LANGUAGE-MASTER-PROFILE-280

## Resumen

Hallazgo de coherencia visible entre la Ficha Maestra lingüística y la pantalla Materiales.

## Especificaciones aplicadas

- V2: fuente institucional reutilizable y no repetición de datos.
- V3: fuente única de verdad, prueba ejecutable y cambio EIB → monolingüe sin herencias contradictorias.
- V4: configuración una sola vez, formularios inteligentes, lenguaje simple y menos decisiones innecesarias.
- V5: Perfil IE, Materiales, persistencia y móvil son parte del gate obligatorio.
- Núcleo IA: respetar EIB/monolingüe y lengua elegida en toda la herencia de significado.

## Prueba AUD-LING-MAT-280-A

**Módulo:** Perfil lingüístico → Materiales  
**Entrada:** Ficha Maestra con `linguisticMode = Monolingüe castellano`; abrir Materiales.  
**Resultado esperado:** idioma de material heredado como Castellano y bloqueado contra selecciones incompatibles; lengua originaria = Ninguna.  
**Resultado obtenido antes de corregir:** `syncMaterials()` fijaba `materialLanguage = Castellano`, pero no deshabilitaba el selector; el usuario podía volver a elegir `Lengua originaria` o `Bilingüe` desde la misma pantalla aun cuando el perfil maestro seguía siendo monolingüe.  
**Estado previo:** NO PASA.  
**Clasificación:** PARCIALMENTE FUNCIONAL.  
**Severidad:** S2 ALTO.  
**Causa raíz:** la sincronización imponía un valor inicial pero no protegía la coherencia después de la interacción del usuario.  
**Riesgo:** contradicción silenciosa entre Ficha Maestra y superficie de Materiales; decisión redundante que V4 exige evitar.  

## Corrección

`linguistic-profile-v26.js` pasa de v26.1 a v26.2.

En modo `Monolingüe castellano`:

- `materialLanguage` se fija en `Castellano`;
- el selector queda `disabled` y `aria-disabled=true`;
- `materialQuechua` se fija en `Ninguna` y permanece bloqueado.

En cualquier perfil no monolingüe, ambos controles recuperan su estado editable y se elimina `aria-disabled`.

El cambio no modifica documentos históricos, no genera contenido, no cambia la Ficha Maestra y no altera la lógica pendiente del generador de Materiales.

## Reprueba AUD-LING-MAT-280-R1

**Resultado de implementación:** PASA EN IMPLEMENTACIÓN.  
**Clasificación:** FUNCIONAL EN IMPLEMENTACIÓN / E2E REAL PENDIENTE.  

Queda pendiente demostrar en navegador y dispositivo físico:

1. Monolingüe → Materiales: Castellano bloqueado, Ninguna bloqueada.
2. EIB → Materiales: idioma editable y lengua originaria disponible.
3. EIB → Monolingüe → recarga → Materiales: sin herencia residual.
4. Monolingüe → EIB → recarga → Materiales: controles restaurados correctamente.
5. Persistencia tras cerrar/reabrir navegador y prueba móvil física.

## Impacto en indicadores

- IUD/ICGD: mejora esperada por coherencia de datos; no se calcula puntaje definitivo sin E2E.
- IFR: impacto parcial; el riesgo de contradicción visible se reduce, pero Materiales continúa con bloqueantes funcionales propios.
- ISU: reduce una decisión incompatible y redundante; sin puntaje definitivo hasta prueba de usuarios.
- Prelaunch: no cambia el estado global; V5 continúa BLOQUEADO mientras falten pruebas esenciales y permanezca Materiales sin generación contextual real.

## Riesgo de regresión

Bajo y acotado al estado habilitado/deshabilitado de los dos selectores de idioma en Materiales. Debe vigilarse especialmente el cambio EIB ↔ monolingüe y el montaje tardío de la pantalla.

## Fuente oficial

Esta corrección no aplica ni declara vigencia de una norma nueva. Se fundamenta en las especificaciones internas V2–V5 y Núcleo IA ya adoptadas por el proyecto. Cualquier denominación lingüística o regla normativa externa deberá verificarse separadamente contra fuente oficial vigente antes de declararse válida.
