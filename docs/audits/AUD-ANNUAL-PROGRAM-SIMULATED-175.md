# AUD-ANNUAL-PROGRAM-SIMULATED-175

## Resumen

**Módulo:** Carpeta Docente → Mi planificación → Programación anual  
**Estado:** NO PASA  
**Clasificación:** SIMULADA  
**Severidad:** S1 CRÍTICO / bloqueante V5  
**Fecha de verificación:** 2026-09-05

## Especificaciones aplicadas

- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`: Carpeta Docente incluye Programación anual y exige trazabilidad `PROGRAMACIÓN ANUAL → UNIDAD/PROYECTO → SESIONES → ...`.
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`: una función no aprueba porque aparece o responde; debe producir resultado correcto, guardar, recuperar, editar y mantener trazabilidad.
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`: el usuario debe poder realizar tareas frecuentes de forma guiada y sin superficies engañosas.
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`: Programación forma parte de las funciones esenciales de Carpeta Docente V1.0 y debe probarse en el flujo E2E `Perfil IE → Programación → Unidad/Proyecto → ...`.
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`: el significado aprobado debe heredarse en `Diagnóstico → Programación anual → Unidad/Proyecto → Sesiones → ...`.

## Prueba

**ID de prueba:** AUD-ANNUAL-PROGRAM-SIMULATED-175  
**Persona:** docente principiante / docente experimentado / QA / especialista pedagógico

### Entrada

1. Completar configuración de IE.
2. Entrar a `Mi planificación`.
3. Ubicar la tarjeta `📅 Programación anual`.
4. Pulsar `Abrir`.

### Resultado esperado

La función debe permitir, como mínimo, construir o recuperar una programación anual basada en datos ya registrados; relacionar diagnóstico, contexto, calendario, áreas/grados y unidades/proyectos; guardar, reabrir y editar el documento; y transmitir la programación aprobada hacia las unidades/proyectos posteriores.

### Resultado obtenido

La tarjeta está presente en `index.html` y ejecuta `demoAnnual()`.

En `app.js`, `demoAnnual()` no crea una programación ni cambia a una pantalla funcional. Su implementación es únicamente:

```js
function demoAnnual(){
  alert('Prototipo: la programación anual usará diagnóstico, contexto, calendario, recursos y CNEB para proponer una planificación editable.')
}
```

No existe en esta ruta una estructura `annualProgram`, almacenamiento de programación anual, edición, recuperación, versionado, exportación ni relación real `Programación anual → Unidad/Proyecto`.

La producción `https://docente-digital.vercel.app/` expone actualmente la misma tarjeta `Programación anual` con botón `Abrir`, por lo que el usuario puede interpretar que la función está disponible aunque sea un prototipo.

## Evidencia

- `index.html`: tarjeta visible `📅 Programación anual` → `onclick="demoAnnual()"`.
- `app.js`: `demoAnnual()` muestra explícitamente un `alert` que empieza con `Prototipo:`.
- Producción verificada el 2026-09-05: HTTP 200 y misma tarjeta/handler servidos.
- V5: Programación es función esencial del alcance V1.0.

## PASA / NO PASA

**NO PASA.**

## Clasificación funcional

**SIMULADA.** La superficie existe y responde al clic, pero no ejecuta la función prometida.

## Severidad

**S1 CRÍTICO / bloqueante V5.**

La severidad se fundamenta en que Programación anual está explícitamente dentro del conjunto esencial de Carpeta Docente V1.0 y es un eslabón obligatorio del flujo E2E. Mientras sea simulada, no puede demostrarse el flujo `Perfil IE → Programación → Unidad/Proyecto → ...` exigido por V5.

## Causa raíz

La UI expone una función futura como navegación disponible antes de que exista su modelo de datos y flujo funcional.

## Acción correctiva

No sustituir el `alert` por contenido estático ni por una generación aislada. Implementar una función real que:

1. reutilice Ficha Maestra, diagnóstico, nivel, grados, áreas, calendario y contexto;
2. permita organizar el año y asociar unidades/proyectos;
3. preserve fuente/procedencia de datos y decisiones;
4. guarde automáticamente y permita reabrir/editar;
5. mantenga trazabilidad hacia Unidad/Proyecto;
6. permita exportación cuando el formato esté validado;
7. maneje cambios posteriores sin alterar históricos emitidos;
8. supere prueba E2E y recuperación antes de considerarse FUNCIONAL.

Mientras no se implemente, la opción debería presentarse inequívocamente como **Próximamente / En desarrollo** y no como una acción `Abrir` que aparenta disponibilidad.

## Corrección aplicada en esta pasada

No se modificó comportamiento productivo. Solo se documentó el hallazgo. Implementar una programación anual falsa o incompleta violaría V3/V5.

## Riesgo de regresión

- **Actual:** bajo por documentación únicamente.
- **Implementación futura:** alto, porque Programación anual alimentará Unidad/Proyecto y puede afectar planificación, temporalización, currículo, persistencia y exportación.

## Impacto acumulativo

- **IUD:** negativo: se rompe un eslabón principal de Carpeta Docente.
- **ICGD:** negativo: no hay coherencia demostrable Programación → Unidad.
- **IFR:** negativo: la función visible no es funcionalmente real.
- **ISU:** negativo: `Abrir` comunica disponibilidad de una función que termina en un alert de prototipo.
- **Prelaunch:** bloqueante S1 hasta implementación y prueba E2E real.

No se calcula ningún índice definitivo por falta de las evidencias físicas y de piloto requeridas por V5.
