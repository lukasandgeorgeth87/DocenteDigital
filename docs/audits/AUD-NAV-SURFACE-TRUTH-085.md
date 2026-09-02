# AUD-NAV-SURFACE-TRUTH-085 — Navegación no debe anunciar módulos aún no disponibles

## Módulo
UX / navegación escritorio y móvil / verdad funcional V4-V5.

## Especificaciones aplicadas
- AUDITORIA_MAESTRA_INTEGRAL_V2.md
- ADENDA_AUDITORIA_EJECUTABLE_V3.md
- AUDITORIA_SIMPLICIDAD_USO_V4.md
- AUDITORIA_PRELANZAMIENTO_V5.md
- NUCLEO_IA_DOCENTEDIGITAL.md

## Prueba
**ID:** AUD-NAV-SURFACE-TRUTH-085  
**Entrada:** revisar Inicio, barra lateral y navegación móvil mientras Materiales y Evaluación continúan bloqueados como funciones de prelaunch.  
**Esperado:** ninguna superficie principal debe presentar Materiales o Evaluación como módulos disponibles mientras sus flujos esenciales no estén funcionalmente demostrados.  
**Obtenido antes:** la corrección previa deshabilitaba las tarjetas del Inicio, pero la barra lateral y la navegación móvil mantenían botones activos hacia `materials` y `evaluation`.  
**Resultado inicial:** NO PASA.  
**Severidad:** S3 MEDIO.  
**Clasificación:** PARCIALMENTE FUNCIONAL (la restricción existía dentro de los módulos, pero la navegación todavía comunicaba disponibilidad).

## Evidencia de causa raíz
`home-surface-truth-v73.js` solo actuaba sobre las tarjetas de Inicio. Las superficies `.sidebar` y `.mobile-nav` no formaban parte de esa guarda.

## Corrección segura aplicada
Se amplió `home-surface-truth-v73.js` para que, mientras Materiales y Evaluación sigan pendientes:
- deshabilite sus accesos en barra lateral y navegación móvil;
- retire sus `onclick` de navegación;
- añada `aria-disabled=true` y etiqueta accesible de “próximamente”;
- marque explícitamente como “Próximamente” el texto de la barra lateral;
- mantenga las tarjetas de Inicio deshabilitadas y con descripción veraz.

No se implementaron Materiales ni Evaluación ni se simuló su funcionalidad.

## Evidencia posterior
- Commit funcional: `3c127ff954b48016277161c669f4590c085f2b97`.
- GitHub Actions `Prelaunch Smoke`: run `33625604522`, estado `completed`, conclusión `success`.
- Deployment Vercel: `dpl_DyR9d2S2wf36igFCZbYR6pvf2wZe`.
- Estado observado: `READY`, target `production`.
- `https://docente-digital.vercel.app/`: HTTP `200 OK` posterior al cambio.
- `https://docente-digital.vercel.app/home-surface-truth-v73.js`: HTTP `200 OK` y contenido actualizado servido por producción.

## Retest
**Resultado:** PASA a nivel de integración técnica para la verdad de superficie de Inicio/barra lateral/navegación móvil.  
No se declara prueba física de celular ni prueba con usuario real.

## Riesgo de regresión
Bajo. El cambio solo afecta accesos a dos módulos ya clasificados como no disponibles. Cuando Materiales o Evaluación superen su gate V5, esta guarda deberá actualizarse o retirarse para reactivar el acceso.

## Impacto en métricas/gates
- IUD: reduce confusión sobre qué funciones docentes están realmente disponibles; no modifica calidad pedagógica.
- ICGD: sin impacto directo.
- IFR: mejora la consistencia entre estado funcional y navegación.
- ISU: mejora cualitativa de claridad; no se calcula puntuación definitiva.
- Prelaunch: elimina un falso indicio de disponibilidad, pero no cierra Materiales ni Evaluación.

## Bloqueantes V5 que continúan pendientes
Materiales, Evaluación/Registro, IA semántica real, Ficha Maestra completa, Programación, Director E2E, autenticación/autorización/aislamiento, OWASP ASVS, privacidad, backup/restore real, Word/PDF/impresión físicos, móvil físico, 100 generaciones, año completo, concurrencia, monitoreo/costos IA, separación efectiva de entornos, rollback probado y pilotos reales.
