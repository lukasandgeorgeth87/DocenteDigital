# AUD-SIMPLICITY-EVIDENCE-104

## Especificaciones aplicadas

- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

## Hallazgo

### AUD-SIM-104A — prueba móvil omitida contaba como PASA

**Módulo:** `simplicity-audit-v49.js`

**Entrada:** ejecutar `AUD-USO-005` con `window.innerWidth > 768`.

**Esperado:** la prueba de pulgar/móvil debe quedar PENDIENTE porque no fue ejecutada en viewport móvil; una prueba física Android sigue pendiente aunque pase el viewport.

**Obtenido antes:** devolvía `passed: true` y texto `Prueba local omitida por ancho de escritorio`.

**Estado antes:** NO PASA.

**Severidad:** S2.

**Clasificación:** PARCIALMENTE FUNCIONAL.

**Causa raíz:** la auditoría confundía “no ejecutada” con “aprobada”, contradiciendo la regla V3 de evidencia ejecutable y el gate V5 de no simular pruebas móviles.

**Corrección:** `AUD-USO-005` ahora devuelve `passed: false`, `status: PENDIENTE` cuando corre en escritorio. Solo puede producir PASA técnico cuando realmente se ejecuta en viewport móvil; la prueba física sigue fuera del alcance automatizado.

### AUD-SIM-104B — flujo Volver no activo contaba como PASA

**Entrada:** ejecutar `AUD-USO-006` sin `#ddProposalChooser` visible.

**Esperado:** PENDIENTE; no existe evidencia del flujo guiado activo.

**Obtenido antes:** `passed: true` con “No hay selector de propuestas activo”.

**Estado antes:** NO PASA.

**Severidad:** S2.

**Clasificación:** PARCIALMENTE FUNCIONAL.

**Corrección:** devuelve `passed: false`, `status: PENDIENTE` hasta ejecutar la prueba con el flujo Unidad/Proyecto activo.

### AUD-SIM-104C — lenguaje sencillo no evaluado contaba como PASA

**Entrada:** ejecutar `AUD-USO-007` en Configuración o sin pantalla activa.

**Esperado:** PENDIENTE porque la prueba exige una pantalla de trabajo del usuario.

**Obtenido antes:** `passed: true`.

**Estado antes:** NO PASA.

**Severidad:** S2.

**Clasificación:** PARCIALMENTE FUNCIONAL.

**Corrección:** ahora devuelve `passed: false`, `status: PENDIENTE` hasta ejecutarse sobre una pantalla de trabajo.

## Evidencia posterior

- Commit funcional: `8cb558fcea275aa3cab4cd987ac0e99a98a149a0`.
- Vercel deployment: `dpl_3rJ5KtdukFvcijMP6t7rzbWLYfik`.
- Estado Vercel: `READY`.
- Target: `production`.
- Producción `/simplicity-audit-v49.js`: HTTP 200 y sirve Auditoría de Simplicidad v50.
- Producción `/`: HTTP 200.

## Riesgo de regresión

Bajo. El cambio no altera funciones docentes/directivas ni datos; solo endurece la interpretación de resultados de auditoría. Puede reducir resultados “PASA” previos porque evidencia insuficiente pasa a PENDIENTE, que es el comportamiento esperado según V3/V5.

## Impacto

- **ISU:** evita inflarlo con pruebas no ejecutadas; permanece PENDIENTE de piloto real.
- **IFR/Prelaunch:** mejora la confiabilidad de la evidencia, no incrementa por sí solo el readiness funcional.
- **IUD/ICGD:** sin cambio funcional directo; mejora la calidad de la auditoría de uso.

## Bloqueantes V5 que permanecen

Pruebas físicas Android/tablet/laptop; Word/PDF/impresión reales; usuarios piloto; E2E Docente y Director; 100 generaciones; año escolar completo; autenticación/autorización/aislamiento; backend; backup/restauración real; OWASP ASVS; privacidad; concurrencia; monitoreo y continuidad productiva.
