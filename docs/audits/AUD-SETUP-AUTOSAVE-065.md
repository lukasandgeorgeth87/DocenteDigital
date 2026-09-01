# AUD-SETUP-AUTOSAVE-065 — Persistencia durante configuración inicial

## Marco obligatorio
Auditoría realizada contra `AUDITORIA_MAESTRA_INTEGRAL_V2.md`, `ADENDA_AUDITORIA_EJECUTABLE_V3.md`, `AUDITORIA_SIMPLICIDAD_USO_V4.md`, `AUDITORIA_PRELANZAMIENTO_V5.md` y `NUCLEO_IA_DOCENTEDIGITAL.md`.

## Prueba
- **ID:** AUD-SETUP-AUTOSAVE-065
- **Módulo:** Perfil IE / Configuración / Persistencia
- **Entrada:** iniciar configuración, seleccionar nivel, tipo de IE, grados/edades, áreas o perfil lingüístico y recargar/cerrar antes de pulsar `Guardar y entrar`.
- **Esperado:** el progreso parcial seguro queda guardado y puede recuperarse; configuraciones incompletas no habilitan el resto de la app.
- **Obtenido antes:** `chooseOne()` y los handlers de grado/área modificaban `state` sin llamar a `save()`; el perfil lingüístico se persistía solo al finalizar. Una interrupción previa podía perder el avance.
- **Evidencia previa:** `app.js` define `save()` sobre `localStorage`, pero `chooseOne()` y las selecciones dinámicas de grados/áreas no persistían cada cambio. V4 exige guardado automático y continuar donde quedó; V5 exige probar cierre/recarga/interrupción sin perder información.
- **Estado previo:** **NO PASA**
- **Clasificación previa:** **PARCIALMENTE FUNCIONAL**
- **Severidad:** **S2**

## Causa raíz
La configuración funcionaba como un formulario transaccional: varias decisiones solo existían en memoria hasta finalizar. Esto era incompatible con la expectativa de autosave y recuperación de V4/V5.

## Corrección
Cambio pequeño y reversible en `config-state-guard-v42.js`:
1. se añadió `persistSetupProgress()` para sanear y persistir el estado;
2. `chooseOne()` y `nextSetup()` guardan el progreso;
3. selecciones de grados/áreas se guardan después de que sus handlers actualizan `state`;
4. cambios de `linguisticMode`, `language` y `quechuaVar` actualizan el estado y se guardan;
5. la guardia existente sigue bloqueando la salida del setup mientras la configuración base/lingüística esté incompleta.

Commit funcional: `e71c169e0642956604d0b4eb8e20bc02a89a4881`.

## Evidencia posterior
- Vercel deployment `dpl_22JukdSrxn7Ep3tnmZSXAioLDYQB`: **production / READY**.
- `https://docente-digital.vercel.app/`: **HTTP 200**.
- `https://docente-digital.vercel.app/config-state-guard-v42.js`: **HTTP 200** y contiene `persistSetupProgress()` e `installSetupAutosave()`.
- GitHub/Vercel status del commit funcional: **success**.

## Estado posterior
**PASA técnicamente para persistencia de las decisiones cubiertas por la configuración.**

No se presenta como prueba física de cierre forzado, dispositivo móvil real, pérdida de energía ni persistencia multiusuario/backend. Esas pruebas permanecen pendientes bajo V5.

## Riesgo de regresión
Bajo. El cambio no altera estructuras históricas ni documentos emitidos; usa el mismo `save()` y la misma clave local existentes y aplica previamente la sanitización de coherencia.

## Impacto en indicadores
- **ISU:** impacto favorable parcial por reducir pérdida/repetición de pasos; no se recalcula puntuación definitiva.
- **IFR:** impacto favorable parcial en recuperación local; no demuestra backend ni restore real.
- **IUD/ICGD:** sin puntuación definitiva; mejora la continuidad del perfil de IE.
- **Prelaunch:** reduce un defecto de persistencia, pero no elimina bloqueantes V5.

## Bloqueantes V5 que continúan
Ficha Maestra completa, Director E2E real, autenticación y aislamiento, backend productivo, OWASP ASVS, privacidad completa, backup/restauración real, IA semántica real, Word/PDF físicos, móvil físico, prueba de 100 generaciones, año escolar completo, concurrencia, continuidad sin IA y pilotos reales.
