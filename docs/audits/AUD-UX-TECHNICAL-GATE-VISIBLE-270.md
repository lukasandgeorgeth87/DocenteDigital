# AUD-UX-TECHNICAL-GATE-VISIBLE-270

## Resumen

Hallazgo de simplicidad/UX detectado al contrastar `prelaunch-evidence-gate-v50.js` con V4 y V5. El gate técnico de prelanza es correcto como control interno, pero se renderizaba por defecto dentro de la pantalla `Configuración`, exponiendo al docente/director IDs internos (`V5-*`), severidades S0/S1/S2, estados técnicos y explicaciones extensas.

## Especificaciones aplicadas

- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

V4 exige menos texto, lenguaje sencillo y que Modo Experto no muestre diagnósticos técnicos internos que no ayudan al usuario a decidir. V5, en cambio, exige mantener bloqueado el lanzamiento hasta contar con evidencia real. La corrección debe por tanto ocultar la telemetría de la UI normal sin debilitar el gate programático.

## Prueba

**ID:** AUD-UX-270-A

**Módulo:** Configuración / Gate V5

**Entrada:** usuario Docente o Director abre `Configuración` con el gate V5 cargado y sin activar un modo técnico de auditoría.

**Resultado esperado:** Configuración muestra opciones útiles para el usuario final; el gate V5 sigue operando internamente, pero no expone IDs técnicos, severidades ni telemetría de auditoría.

**Resultado obtenido antes de la corrección:** `prelaunch-evidence-gate-v50.js` ejecutaba `render()` al cargar y también al navegar a `settings`; `render()` agregaba una tabla con IDs V5, estado, severidad, prueba obligatoria y explicación técnica.

**Evidencia:** asset productivo previo `https://docente-digital.vercel.app/prelaunch-evidence-gate-v50.js`, confirmado HTTP 200, contenía `setTimeout(render,0)` y wrapper de `go('settings')` que invocaba `render()` sin una condición de modo auditor.

**Estado previo:** NO PASA

**Clasificación previa:** PARCIALMENTE FUNCIONAL

**Severidad:** S3 MEDIO

**Causa raíz:** una herramienta interna de auditoría fue reutilizada como superficie visible de usuario sin separar claramente telemetría interna de UX docente/director.

## Corrección

Commit funcional: `39db1e4dcaca55d7f710f8fd5bf4ddbb892bf2be` — `fix: hide technical V5 telemetry from user settings`.

Cambio pequeño y reversible en `prelaunch-evidence-gate-v50.js`:

- `run()` y `mandatory[]` permanecen intactos;
- `productionGate:false` permanece intacto;
- los bloqueantes S0/S1 siguen agregándose al resultado programático;
- `render()` solo actúa si `window.__ddShowTechnicalAudit === true`;
- la navegación a Configuración ya no invoca la tabla técnica por defecto;
- se conserva `window.ddPrelaunchEvidenceGate={run,mandatory,render}` para auditoría técnica explícita.

## Reprueba

**ID:** AUD-UX-270-R1

**Entrada:** inspección del asset productivo después de desplegar `39db1e4dcaca55d7f710f8fd5bf4ddbb892bf2be`.

**Esperado:** telemetría oculta por defecto y gate programático intacto.

**Obtenido:** el asset productivo responde HTTP 200 y contiene la condición `window.__ddShowTechnicalAudit!==true` antes de renderizar, mientras conserva `productionGate:false`, `mandatory[]`, `run()` y los bloqueantes.

**Resultado:** PASA EN IMPLEMENTACIÓN

**Clasificación posterior:** FUNCIONAL EN IMPLEMENTACIÓN

**Evidencia de despliegue:** Vercel deployment `dpl_CF68eTrCmkXsTkDtScrd6oBsJKUa`, SHA `39db1e4dcaca55d7f710f8fd5bf4ddbb892bf2be`, estado READY, target production.

**Evidencia CI:** Prelaunch Smoke #292, run `34767348726`, `completed / success`, head SHA `39db1e4dcaca55d7f710f8fd5bf4ddbb892bf2be`.

## Pendientes reales

Esta corrección no demuestra pruebas físicas de facilidad de uso. Permanecen PENDIENTES: usuario principiante, prueba de 10 segundos, móvil físico, prueba del pulgar, pilotos reales y medición ISU final.

## Riesgo de regresión

Bajo. El cambio no altera la lista de bloqueantes ni la lógica de `productionGate`; únicamente separa la superficie técnica de la configuración normal. Riesgo principal: futuras capas podrían volver a renderizar telemetría interna sin flag explícito.

## Impacto en indicadores

- IUD: mejora cualitativa de claridad; no puntuar definitivamente sin usuarios reales.
- ICGD: sin cambio funcional directo.
- IFR: sin cambio directo.
- ISU: potencial mejora en claridad y menor carga cognitiva; no calcular puntaje definitivo.
- Prelaunch: sin cambio de estado; permanece BLOQUEADO por evidencias reales pendientes.

## Gate V5

**NO APROBADO PARA V1.0.** Esta corrección elimina telemetría técnica innecesaria de la superficie normal, pero no sustituye ninguna prueba real obligatoria de V5.
