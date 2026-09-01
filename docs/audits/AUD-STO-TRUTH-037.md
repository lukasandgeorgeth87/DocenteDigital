# AUD-STO-TRUTH-037 — Verdad de persistencia de sesiones

## Especificaciones aplicadas

- `AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `AUDITORIA_PRELANZAMIENTO_V5.md`
- `NUCLEO_IA_DOCENTEDIGITAL.md`

## Prueba

**ID:** AUD-STO-TRUTH-037  
**Módulo:** Sesiones / persistencia / recuperación  
**Entrada:** generar una sesión cuando `localStorage` no consigue persistir `state.lastSession` (por cuota agotada, almacenamiento bloqueado u otro fallo local).  
**Resultado esperado:** la app debe distinguir entre una sesión visible en memoria y una sesión realmente persistida; debe advertir claramente que una recarga podría perderla.  
**Resultado obtenido antes:** `buildSession()` asignaba `state.lastSession=session`, llamaba a `save()` y devolvía la sesión. La defensa de verdad de persistencia existente solo comprobaba unidades/proyectos, por lo que una sesión podía quedar visible y descargable en memoria sin que hubiera quedado guardada en `docenteDigitalPrototype`.  
**Estado inicial:** NO PASA.  
**Severidad:** S1 CRÍTICO.  
**Clasificación:** PARCIALMENTE FUNCIONAL.

## Causa raíz

La corrección `AUD-STO-TRUTH-034` verificaba persistencia de unidades/proyectos, pero no extendía la misma garantía a `state.lastSession`. La cadena de sesión seguía dependiendo de `save()` sin una comprobación posterior contra el estado realmente almacenado.

## Acción correctiva

Se actualizó `persistence-truth-v63.js` a lógica interna V64 para:

1. comprobar `lastSession.id` contra el contenido realmente almacenado en `docenteDigitalPrototype`;
2. envolver `generateSession()` y `renderSessionOutput()`;
3. mostrar `⚠️ Esta sesión no quedó guardada en el dispositivo` cuando la sesión existe solo en memoria;
4. mantener la descarga disponible para no impedir que el docente rescate el trabajo visible;
5. ampliar `ddAuditPersistenceTruth()` con `sessionPersisted` y `lastSessionId`.

No se implementa ni se declara backend, backup productivo ni sincronización remota.

## Evidencia posterior

- Commit funcional: `d208bf24939ee804ae951dd68fb57cc97ddc9c29`.
- Estado GitHub/Vercel: `success` — “Deployment has completed”.
- Deployment: `dpl_LtF7MT6PraM9rvU13RWKxutfGNoP`.
- Target: `production`.
- Estado Vercel: `READY`.
- Alias productivo: `docente-digital.vercel.app`.
- `https://docente-digital.vercel.app/`: HTTP 200.
- `https://docente-digital.vercel.app/persistence-truth-v63.js`: HTTP 200 y sirve V64 con `sessionPersisted()` y `AUD-STO-TRUTH-037`.

## Estado posterior

**PASA la defensa técnica / PARCIALMENTE FUNCIONAL.**

No se considera cerrada la prueba física de cuota agotada + recarga en dispositivos reales. Continúan pendientes los gates V5 de backend seguro, autenticación/aislamiento, backup/restore real, móvil físico, Word/PDF/impresión reales, IA semántica real, 100 generaciones, año completo, OWASP ASVS, concurrencia y pilotos.

**Estado de lanzamiento: NO APROBADO.**