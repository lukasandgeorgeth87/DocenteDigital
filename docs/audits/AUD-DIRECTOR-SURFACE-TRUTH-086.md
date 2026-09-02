# AUD-DIRECTOR-SURFACE-TRUTH-086

## Resumen

Hallazgo V4/V5: la pantalla `Director` mostraba cuatro acciones principales (`Continuar`, `Crear`, `Abrir`, `Preguntar`) sin `onclick` ni flujo funcional asociado. La interfaz las presentaba como acciones disponibles aunque, para el alcance V1.0, los flujos directivos extremo a extremo siguen pendientes.

## Prueba

**ID:** AUD-DIRECTOR-SURFACE-TRUTH-086

**Módulo:** Carpeta Director / superficie UX / verdad funcional

**Entrada:** abrir la pantalla `Director` e inspeccionar sus cuatro botones principales.

**Esperado:** una acción principal visible debe ejecutar un flujo real y demostrable; si todavía no existe, debe mostrarse explícitamente como no disponible para lanzamiento.

**Obtenido antes:** botones visibles y habilitados sin manejador `onclick` ni acción conectada.

**Evidencia anterior:** `index.html`, sección `#director`.

**Resultado inicial:** NO PASA.

**Clasificación inicial:** SIMULADA.

**Severidad:** S3 MEDIO. La acción no produce corrupción ni fuga, pero genera una falsa expectativa funcional y contradice la simplicidad/verdad de superficie exigida por V4/V5.

## Causa raíz

La maqueta visual del espacio Director quedó expuesta como funcional antes de conectar los flujos directivos reales.

## Corrección

Se amplió `home-surface-truth-v73.js` para detectar botones de `#director .card` sin acción conectada y:

- deshabilitarlos;
- aplicar `aria-disabled="true"`;
- identificarlos como `Próximamente`;
- informar que la función aún no está disponible para lanzamiento;
- sustituir la descripción general por una advertencia clara de que las funciones directivas principales siguen en construcción.

Commit funcional: `49134b3e0a8fe20cab579e8e1ab0efc4cc6734f5`.

## Evidencia posterior

- Vercel deployment `dpl_6YgQBrf8WLZyZpYkozjqiAr3fCiq`: `production / READY`.
- `https://docente-digital.vercel.app/`: HTTP 200.
- `https://docente-digital.vercel.app/home-surface-truth-v73.js`: HTTP 200 y contiene `markUnavailableDirectorActions()`.
- `schedule-prompt-v6.js` incluye `home-surface-truth-v73.js` dentro del cargador secuencial estable de módulos.

## Resultado posterior

PASA para la verdad funcional de superficie: la interfaz ya no debe fingir que las acciones directivas sin implementación están disponibles.

La Carpeta Director completa continúa **INEXISTENTE / PARCIALMENTE FUNCIONAL según submódulo** y permanece bloqueada para V1.0 hasta demostrar el recorrido real exigido por V5: Perfil IE → Diagnóstico → Gestión/PAT → documentación → evidencias → informes → archivo → seguimiento.

## Riesgo de regresión

Medio-bajo. Si posteriormente se conecta una acción Director mediante `onclick`, la guardia la deja disponible; los botones sin acción siguen deshabilitados. Debe retestearse cada nuevo flujo Director antes de retirarlo de `Próximamente`.

## Impacto en indicadores

- IUD: mejora cualitativa al reducir falsa disponibilidad.
- ICGD: sin incremento funcional; no se implementó gestión directiva real.
- IFR: mejora la veracidad de interfaz, sin cerrar flujos.
- ISU: mejora cualitativa, sin puntuación definitiva.
- Prelaunch: elimina un falso positivo visual, pero no cierra ningún bloqueante V5 de Carpeta Director.

## Pendientes V5 relacionados

Persisten: Ficha Maestra completa; Diagnóstico institucional; PAT vivo; documentos de gestión; Oficios/RD/Informes/Actas; archivo/buscador/correlativos; seguimiento; autenticación/autorización/aislamiento; pruebas de seguridad; Word/PDF físicos; móvil físico; restauración real; pilotos y pruebas de usuarios reales.
