# AUD-MAT-SURFACE-048 — Veracidad de superficie del módulo Materiales

## Especificaciones aplicadas
- `AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `AUDITORIA_PRELANZAMIENTO_V5.md`
- `NUCLEO_IA_DOCENTEDIGITAL.md`

## Prueba
**ID:** AUD-MAT-SURFACE-048

**Módulo:** Carpeta Docente → Materiales / Inicio

**Entrada:** abrir Inicio y luego Materiales antes de que exista un motor de generación contextualizada real y validado.

**Esperado:** la interfaz debe declarar claramente el estado real del módulo; no debe inducir a creer que ya crea lecturas/fichas contextualizadas si la generación real está bloqueada por integridad.

**Obtenido antes:** la tarjeta de Inicio prometía “Lecturas y fichas en castellano, lengua originaria o formato bilingüe”; el módulo indicaba lo mismo y el botón decía “Crear lectura”, aunque `material-integrity-v65.js` bloquea deliberadamente la generación real mientras no exista un motor validado.

**Evidencia previa:** `index.html` + `material-integrity-v65.js`.

**Resultado inicial:** NO PASA.

**Severidad:** S2 ALTO.

**Clasificación previa:** PARCIALMENTE FUNCIONAL con superficie engañosa respecto de una capacidad aún INEXISTENTE.

## Causa raíz
La defensa de integridad se incorporó después de la interfaz base. El bloqueo técnico quedó correcto, pero los textos y el CTA originales siguieron declarando una capacidad de generación que el propio sistema ya impedía para no simular IA real.

## Acción correctiva
Se añadió `material-surface-truth-v70.js` y se cargó desde `schedule-prompt-v6.js` después de `material-integrity-v65.js`.

La superficie ahora:
- informa que la generación contextualizada está en desarrollo;
- cambia “Crear lectura” por “Revisar solicitud de material”;
- evita el encabezado inicial “Lectura generada” antes de disponer de generación real;
- mantiene intacta la guarda anti-simulación existente.

## Evidencia posterior
- Commit de guarda: `d525522224fa78acb785216b1cb992f6d7ae338f`.
- Commit de carga estable: `2f729bf68f393525a1ac4161ecb13f189a7577b3`.
- Deployment Vercel correspondiente al cargador: `dpl_De3fVZGnwNdEGjZqMDfaAQRsWkfZ` — production / READY.
- `https://docente-digital.vercel.app/material-surface-truth-v70.js` responde HTTP 200.

## Retest
**Defensa de veracidad de superficie:** PASA dentro de lo verificable técnicamente.

**Módulo Materiales completo:** INEXISTENTE/PARCIALMENTE FUNCIONAL respecto a generación real; no se aprueba como generador contextualizado.

## Pendientes que no se simulan
- IA semántica/generativa real validada.
- Validación lingüística real para lenguas originarias.
- Pruebas físicas de Word/PDF/impresión.
- Pruebas con usuarios reales y dispositivos físicos.
- Batería de 100 generaciones.

## Riesgo de regresión
Bajo. El cambio solo modifica textos y CTA visibles; no altera datos, documentos, generación, persistencia ni lógica curricular.

## Impacto en indicadores
Mejora cualitativamente confianza documental y simplicidad al reducir una promesa falsa de capacidad. No se recalculan IUD/ICGD/IFR/ISU/Prelaunch por falta de evidencia integral y pruebas reales.
