# AUD-TERRITORIAL-KEYWORD-BIAS-113

## Alcance
Auditoría acumulativa DocenteDigital con base conjunta en V2, V3, V4, V5 y `NUCLEO_IA_DOCENTEDIGITAL.md`.

## Prueba
**ID:** AUD-SEM-TERR-113  
**Módulo:** comprensión semántica / territorialidad / Unidad-Proyecto  
**Entrada:** descripción libre con varios términos, incluyendo o no contexto rural, agrícola o EIB.  
**Esperado:** el apoyo léxico no debe privilegiar términos por pertenecer a un banco rural/EIB; solo debe conservar lo realmente escrito y dejar la comprensión de intención/finalidad al núcleo semántico.  
**Obtenido antes:** `context-keywords-v19.js` asignaba un bonus fijo a una lista cerrada de términos como `siembra`, `papa`, `pachamama`, `yachaq`, `agua`, `riego`, `café`, `cacao`, `banano`, `cítricos`, `moraya`, `chuño`, `familia`, `comunidad`, `tradición` y `saberes`. Ese ranking se reutilizaba dentro del propio módulo para enriquecer propuestas y títulos, por lo que podía elevar artificialmente esos términos sobre otros conceptos explícitos.  
**Estado inicial:** NO PASA.  
**Clasificación:** PARCIALMENTE FUNCIONAL.  
**Severidad:** S2.  
**Causa raíz:** un banco histórico de palabras preferidas permanecía como ponderación interna aunque el Núcleo IA exige que los bancos cerrados sean solo apoyo de variación y que la territorialidad no se asuma rígidamente.

## Corrección
Se eliminó la ponderación `preferred` y el ranking ahora usa únicamente:
1. frecuencia del término realmente escrito por el usuario;
2. orden de aparición como desempate.

No se añadió ninguna inferencia territorial, lingüística o pedagógica nueva. No se modificó el modelo semántico ni se simuló IA real.

**Commit funcional:** `754862ed83fd3c52bf6feed61206222164b93dbb`.

## Evidencia posterior
- GitHub Actions `Prelaunch Smoke` run `33702266737`: `success`.
- Vercel deployment `dpl_EfEJqTRnFykMZjfJFnVLtx7cWW65`: `READY`, target `production`, commit `754862ed83fd3c52bf6feed61206222164b93dbb`.
- `https://docente-digital.vercel.app/`: HTTP 200.
- `https://docente-digital.vercel.app/context-keywords-v19.js`: HTTP 200 y versión `v19.2`, sin lista `preferred` ni bonus territorial.

## Resultado posterior
**PASA** para la regla técnica específica de neutralidad del ranking léxico.  
**Clasificación posterior:** FUNCIONAL en este punto técnico acotado.

Esto **no** demuestra comprensión semántica real, coherencia pedagógica completa ni pertinencia territorial con usuarios reales. La capa sigue siendo un apoyo léxico local; la validación de IA semántica real y los casos robustos V5 permanecen PENDIENTES.

## Riesgo de regresión
Bajo. El cambio elimina únicamente un bonus fijo y conserva el orden, API y estructura del módulo.

## Impacto en indicadores
- IUD: sin cálculo definitivo.
- ICGD: mejora cualitativa de neutralidad contextual, sin puntuación.
- IFR: sin cálculo definitivo.
- ISU: sin cálculo definitivo.
- Prelaunch: no se incrementa score; continúan bloqueantes V5.

## Fuente normativa/oficial
No se aplicó ni declaró vigente una norma MINEDU en esta corrección. El hallazgo es técnico-semántico y deriva de las especificaciones internas de auditoría.

## Bloqueantes V5 que continúan pendientes
E2E Docente y Director; IA semántica real; pruebas físicas móvil/tablet/laptop; 20 DOCX reales, PDF e impresión; autenticación/autorización/aislamiento multiusuario; backend productivo; OWASP ASVS; privacidad integral; backup/restore real; 100 generaciones; año escolar completo; concurrencia; costos/monitoreo IA; pilotos reales.