# AUD-FUN-DUPLICATE-105 — acciones críticas por doble clic

## Especificaciones usadas
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

## Prueba
**ID:** AUD-FUN-DUPLICATE-105  
**Módulo:** runtime / acciones críticas  
**Clasificación inicial:** PARCIALMENTE FUNCIONAL  
**Severidad:** S2  

**Entrada:** doble clic rápido sobre el mismo control de Crear / Generar / Guardar / Descargar / Exportar / Preparar / Emitir / Aprobar / Subir / Word / Compartir.  
**Esperado:** una sola acción efectiva; no duplicar unidades, sesiones, descargas ni futuros correlativos.  
**Obtenido antes:** las funciones base `createUnitDemo()` y `generateSession()` no incluían una barrera de doble activación y la interfaz permitía disparar nuevamente el mismo control de forma inmediata.  
**Evidencia de causa:** `app.js` crea unidades y sesiones con cada invocación; V5 exige probar doble clic rápido en acciones críticas.  
**Resultado inicial:** NO PASA.  

## Causa raíz
La superficie no tenía una protección general contra activación duplicada de controles críticos. La generación es síncrona y un segundo evento de clic puede ejecutarse inmediatamente después del primero.

## Corrección
`runtime-audit-v23.js` actualizado a v24.2:
- registra el último clic crítico por control mediante `WeakMap`;
- bloquea una segunda activación del mismo control dentro de 900 ms;
- no afecta navegación normal;
- ignora controles `disabled`/`aria-disabled`;
- registra `window.__ddDuplicateActionBlocked` como evidencia técnica;
- expone `ddAuditDuplicateActionGuard()`.

Cambio pequeño, local y reversible. No modifica contenido pedagógico, normativa, datos maestros ni documentos históricos.

## Retest posterior
- Commit funcional: `b390db19ddab7e607d5e6fa6c66bfc13123c0262`.
- Vercel latest deployment: `dpl_2bJCTrQAaFG2ZbZeAtb7Q4wFKmqz`.
- Estado: `READY`.
- Target: `production`.
- `https://docente-digital.vercel.app/runtime-audit-v23.js`: HTTP 200 y sirve v24.2.
- `https://docente-digital.vercel.app/`: HTTP 200.

## Estado posterior
**PASA técnicamente en la superficie de clic para el caso auditado.**

Permanece **PENDIENTE V5** la prueba física de doble toque en celulares/tablets reales y cualquier prueba de correlativos cuando exista un backend/director real. Esta guardia no sustituye idempotencia de servidor ni transacciones multiusuario.

## Riesgo de regresión
Bajo. La ventana de 900 ms se aplica solo al mismo control y únicamente a etiquetas de acciones críticas. No bloquea controles distintos ni navegación ordinaria.

## Impacto en métricas
- IUD/ICGD: reduce riesgo de duplicación accidental en flujos visibles.
- IFR: mejora parcial de robustez funcional de interfaz.
- ISU: evita resultados duplicados por interacción rápida, sin agregar pasos.
- Prelaunch: reduce un riesgo exigido explícitamente por V5, pero no elimina los bloqueantes de backend, seguridad, exportación física, móvil real, E2E y pilotos.

No se calcula puntaje definitivo por falta de evidencia física y de usuarios reales.
