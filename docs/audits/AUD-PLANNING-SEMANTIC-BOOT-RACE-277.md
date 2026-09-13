# AUD-PLANNING-SEMANTIC-BOOT-RACE-277

Fecha de auditoría: 2026-09-13

## Alcance

Auditoría cruzada de V2, V3, V4, V5 y `NUCLEO_IA_DOCENTEDIGITAL.md` sobre el arranque real del flujo Unidad/Proyecto.

## Hallazgo

Antes de esta corrección, `schedule-prompt-v6.js` iniciaba la carga secuencial de los módulos semánticos y de coherencia, pero no bloqueaba el botón de creación de Unidad/Proyecto durante esa carga. En esa ventana el runtime base de `enhancements.js` ya estaba disponible y podía generar una propuesta con frases rígidas como “comunidad”, “familias” e incluso un producto de siembra con “Ccotataqui”, antes de que se instalaran `meaning-engine-v25.js`, `project-territorial-v31.js`, `planning-coherence-v51.js`, `significant-situation-core-v53.js` y `territorial-generation-guard-v61.js`.

Esto constituía una carrera de arranque: el resultado dependía de si el usuario alcanzaba a pulsar Crear antes o después de terminar la cadena de módulos.

## Prueba

**ID:** AUD-PLAN-277-A  
**Módulo:** Unidad/Proyecto · bootstrap semántico  
**Entrada:** abrir la app con caché fría o conexión lenta, entrar inmediatamente a Mi planificación → Unidad/Proyecto y pulsar Crear mientras los módulos dinámicos siguen cargando.  
**Resultado esperado:** no permitir generación hasta que las guardas semánticas, territoriales y de coherencia estén instaladas.  
**Resultado obtenido antes:** el botón permanecía accionable y podía invocar el generador base de `enhancements.js`.  
**Estado previo:** NO PASA.  
**Clasificación previa:** PARCIALMENTE FUNCIONAL.  
**Severidad:** S2 ALTO.  
**Causa raíz:** carga secuencial asíncrona sin gate de disponibilidad para la acción principal de planificación.  
**Riesgo:** resultados distintos para la misma entrada según velocidad de red/equipo; introducción silenciosa de actores o territorialidad no expresados.  

## Corrección aplicada

Commit funcional: `6509167274417e7c715027173310ce01eaf9baff` (`fix: gate planning until semantic guards are ready`).

`schedule-prompt-v6.js` incorpora un gate de bootstrap que:

1. mantiene `window.__ddPlanningRuntimeReady=false` al iniciar;
2. desactiva la acción de crear Unidad/Proyecto y muestra `Preparando DocenteDigital…` durante la carga;
3. intercepta en captura cualquier clic de `createUnitDemo` o `ddBuildUnit` mientras el runtime no está listo;
4. define como críticos para planificación `meaning-engine-v25.js`, `title-context-v38.js`, `goal-alignment-v28.js`, `proposal-choice-v8.js`, `project-territorial-v31.js`, `planning-coherence-v51.js`, `significant-situation-core-v53.js` y `territorial-generation-guard-v61.js`;
5. habilita la creación solo al terminar la cadena y si ninguno de esos módulos críticos falló;
6. si falla un módulo crítico, conserva el bloqueo y mantiene el aviso visible de carga fallida.

## Reprueba requerida

**AUD-PLAN-277-R1:** caché fría + red lenta: el botón debe permanecer bloqueado hasta finalizar bootstrap.  
**AUD-PLAN-277-R2:** fallo deliberado de un módulo crítico: el botón debe permanecer bloqueado y debe aparecer aviso visible.  
**AUD-PLAN-277-R3:** bootstrap completo: el botón debe habilitarse y la creación normal debe seguir funcionando.  
**AUD-PLAN-277-R4:** móvil real y equipo de gama baja: misma conducta sin pantalla blanca/negra ni clic perdido silenciosamente.

La inspección de código y el despliegue pueden validar implementación, pero R1-R4 requieren navegador/dispositivo o inyección controlada de fallos para considerarse E2E.

## Impacto en indicadores

- IUD: mejora esperada por evitar una acción disponible antes de estar segura; sin puntaje definitivo.
- ICGD: mejora esperada al reducir generación inconsistente; sin puntaje definitivo.
- IFR: no se recalcula sin batería real completa.
- ISU: no se recalcula sin usuarios reales.
- Prelaunch: el hallazgo reduce un riesgo S2, pero no libera el gate V5.

## Estado

**PASA EN IMPLEMENTACIÓN / E2E REAL PENDIENTE.**

DocenteDigital continúa **NO APROBADA PARA V1.0** mientras existan bloqueantes V5 o falten pruebas reales esenciales.