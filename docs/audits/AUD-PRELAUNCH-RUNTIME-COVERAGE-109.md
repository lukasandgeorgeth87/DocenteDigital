# AUD-PRELAUNCH-RUNTIME-COVERAGE-109

## Resumen

Se detectó una cobertura insuficiente en el gate automático `Prelaunch Smoke`: la prueba de wiring de módulos críticos solo exigía cinco módulos auditados, aunque V3/V5 requieren que funciones críticas como persistencia, roles, seguridad curricular, exportación DOCX e integridad de materiales no se den por disponibles si su guardia real no está activa en producción.

## Prueba

- **ID:** AUD-PRELAUNCH-RUNTIME-COVERAGE-109
- **Módulo:** CI / Prelaunch Gate
- **Entrada:** desconexión hipotética de un módulo crítico V5 distinto de los cinco originalmente listados, por ejemplo `docx-export-v29.js`, `role-surface-guard-v68.js`, `persistence-truth-v63.js` o `material-integrity-v65.js`.
- **Esperado:** el gate debe fallar si un módulo crítico existe en el repositorio pero deja de estar conectado a la ruta de producción.
- **Obtenido antes:** el gate solo verificaba wiring para cinco módulos; por tanto una regresión de wiring en otros componentes V5 podía no bloquear CI.
- **Estado inicial:** NO PASA.
- **Clasificación:** PARCIALMENTE FUNCIONAL.
- **Severidad:** S2 ALTO.

## Causa raíz

La lista `required` de `.github/workflows/prelaunch-smoke.yml` había crecido de forma incremental y no cubría toda la superficie crítica priorizada por V3/V5.

## Corrección

Se amplió la lista obligatoria de wiring para incluir:

- `config-state-guard-v42.js`
- `linguistic-profile-v26.js`
- `linguistic-confirmation-v37.js`
- `institution-master-v46.js`
- `title-context-v38.js`
- `significant-situation-core-v53.js`
- `role-surface-guard-v68.js`
- `persistence-truth-v63.js`
- `curriculum-safety-v27.js`
- `docx-export-v29.js`
- `material-integrity-v65.js`
- `runtime-audit-v23.js`
- `prelaunch-evidence-gate-v50.js`
- `simplicity-audit-v49.js`

La comprobación continúa siendo estática: verifica que el módulo exista y esté referenciado por la ruta de carga de producción. No reemplaza E2E real ni prueba física.

## Evidencia posterior

Commit funcional: `93fb60f5cd2f85feab28d4bf52abc1a3f33a0267`.

GitHub Actions `Prelaunch Smoke` run `33691974845`: el paso **Verify audited critical runtime modules are wired to production** completó con `success` durante el retest.

Vercel creó deployment de producción `dpl_CYJ5SFNA1D3AucU83Z7jELHwpLuU` para el mismo commit y reportó estado `READY`.

La raíz de producción fue recuperada posteriormente mediante el conector Vercel con HTTP 200.

## Resultado posterior

- **Estado:** PASA para cobertura estática ampliada del wiring crítico.
- **Clasificación:** FUNCIONAL como gate técnico estático.
- **Riesgo de regresión:** medio; nuevos módulos críticos deben añadirse al manifiesto/gate cuando se incorporen.
- **Impacto en IUD/ICGD/IFR/ISU/Prelaunch:** no se recalculan indicadores. Mejora la confiabilidad del gate, pero no constituye evidencia de usuario real, móvil físico, Word/PDF físico, backend, OWASP ASVS, restore, concurrencia, IA real ni piloto.

## Bloqueantes V5 que permanecen pendientes

Se mantienen PENDIENTES, sin simulación: E2E completo Docente y Director, pruebas físicas móvil/tablet/laptop, Word/PDF e impresión real, autenticación/autorización/aislamiento multiusuario, backend y backup/restore real, OWASP ASVS, privacidad, 100 generaciones con IA real, año completo, escala/concurrencia, monitoreo operativo completo y pilotos con usuarios reales.

## Normativa

Esta corrección es exclusivamente técnica de CI/runtime. No se aplicó ni declaró vigente ninguna norma MINEDU, UGEL, DRE/GRE o administrativa nueva.