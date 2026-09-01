# AUD-PED-RETO-054 — Reto como pregunta o desafío

## Especificaciones aplicadas
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

## Prueba
**ID:** AUD-PED-RETO-054  
**Módulo:** Unidad/Proyecto → situación significativa → reto  
**Clasificación antes:** PARCIALMENTE FUNCIONAL  
**Severidad:** S2  

**Entrada:** una planificación cuyo reto se formula válidamente como desafío directo, por ejemplo: `Investiguemos las hormigas del aula y comuniquemos lo descubierto.`

**Esperado:** aceptar tanto una pregunta retadora como un desafío directo, comprensible, abierto y coherente con la situación, tal como define el Núcleo IA.

**Obtenido antes:** `significant-situation-core-v53.js` añadía el hallazgo `El reto debe formularse como una pregunta auténtica y comprensible.` siempre que no detectaba signos `¿?`. Por tanto, un desafío válido podía ser rechazado únicamente por no estar escrito como pregunta.

**Resultado inicial:** NO PASA.

**Causa raíz:** la implementación del auditor era más restrictiva que su propia especificación, que desde el encabezado y `structure()` admite `pregunta o desafío`.

## Corrección
Se actualizó el núcleo a v53.3:
- se conserva la obligación de que exista un reto;
- se elimina la exigencia artificial de signos de interrogación;
- se mantiene la detección de retos demasiado reproductivos (`qué es`, `cuál es`, `define`, `menciona`).

Commit funcional: `30a4fd1327c6961119bb3ebfda3414d13a517329`.

## Evidencia posterior
- Vercel deployment del commit funcional: `dpl_K3fmFNnKNU2mtgbqSN71cHRN1UZP`.
- Estado Vercel: `production · READY`.
- `https://docente-digital.vercel.app/`: HTTP 200.
- `https://docente-digital.vercel.app/significant-situation-core-v53.js`: HTTP 200 y sirve `v53.3`.

**Resultado posterior del defecto puntual:** PASA dentro de evidencia técnica disponible.

No se declara validación pedagógica con usuarios reales ni prueba física de dispositivo.

## Riesgo de regresión
Bajo. El cambio modifica solo una regla de auditoría; no cambia generación, persistencia, currículo, exportación ni datos históricos.

## Impacto en indicadores
- IUD/ICGD: mejora cualitativa de coherencia reto ↔ intención.
- IFR/ISU/Prelaunch: sin puntuación definitiva; no existe evidencia suficiente para recalcularlos.

## Bloqueantes V5 que permanecen
Siguen pendientes las pruebas reales y/o arquitectura que V5 exige, entre ellas autenticación/aislamiento multiusuario, auditoría de seguridad OWASP ASVS, backup/restauración real, IA semántica real, Word/PDF físicos, dispositivos reales, 100 generaciones, año escolar completo, concurrencia y pilotos.
