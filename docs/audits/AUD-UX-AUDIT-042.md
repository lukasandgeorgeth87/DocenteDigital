# AUD-UX-AUDIT-042 — Superficie de auditoría en Modo Fácil

## Especificaciones aplicadas

- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

## Prueba

**ID:** AUD-UX-AUDIT-042  
**Módulo:** Unidad/Proyecto — Modo Fácil — revisión previa  
**Clasificación inicial:** PARCIALMENTE FUNCIONAL  
**Severidad:** S3

### Entrada

Crear una Unidad/Proyecto en Modo Fácil y llegar a la revisión previa al botón de construcción final.

### Resultado esperado

La auditoría técnica debe permanecer interna. El usuario principiante debe ver lenguaje breve y orientado a la acción, sin puntuaciones, nombres de motores, matrices o telemetría técnica. La V4 exige una superficie simple, Modo Fácil por defecto y que la complejidad quede por dentro.

### Resultado obtenido antes

`context-audit-v8.js` mostraba una caja visible titulada `Auditoría relámpago`, un resultado numérico `ok/total` y verificaciones como `Reglas de matriz y coherencia activas` y `Fuente curricular literal conectada`. La misma capa continuaba automáticamente con la creación después del aviso, por lo que la puntuación visible tampoco debía interpretarse como un gate de aprobación.

### Evidencia

Código fuente previo: `context-audit-v8.js`, funciones `auditPreflight()` y `showAudit()`.

### Resultado inicial

**NO PASA — S3 — PARCIALMENTE FUNCIONAL.**

## Corrección segura y reversible

Se añadió `easy-audit-surface-v66.js`, cargado por `schedule-prompt-v6.js` después de `easy-surface-simplicity-v55.js`.

La corrección es exclusivamente de superficie:

- oculta en Modo Fácil la cuadrícula técnica y el marcador numérico;
- reemplaza el encabezado por `Revisando antes de crear`;
- transforma el detalle técnico en una explicación breve y comprensible;
- conserva sin alterar los resultados, datos y reglas internas de la auditoría;
- mantiene el detalle disponible en Modo Experto.

No se modificaron decisiones pedagógicas, normas, contenido histórico, datos maestros ni lógica de generación.

## Evidencia posterior

- Commit de la defensa: `1a76dc8247da85e1b8273566ea32e75a200ab680`.
- Commit de carga estable: `be1fee0aa530ead47817efc9080ab83ae463af89`.
- Deployment Vercel asociado al commit de carga: `dpl_n3Pxtt8VgsTdMeZ5Zw4X5k6V1qtL` — **production / READY**.
- `https://docente-digital.vercel.app/` — **HTTP 200**.
- `https://docente-digital.vercel.app/schedule-prompt-v6.js` — **HTTP 200** y contiene `easy-audit-surface-v66.js` en la lista de módulos.
- `https://docente-digital.vercel.app/easy-audit-surface-v66.js` — **HTTP 200**.
- Vercel no reportó errores de runtime para el proyecto en las últimas 24 horas al momento de esta prueba.

## Estado posterior

**PASA la defensa técnica de superficie / PARCIALMENTE FUNCIONAL el flujo completo.**

No se simularon usuarios reales, interacción física móvil ni comprensión de un docente principiante. La validación de simplicidad con usuarios reales permanece PENDIENTE según V4/V5.

## Riesgo de regresión

Bajo. La defensa no modifica el contenido de la auditoría ni el documento generado. El riesgo principal sería que una futura capa cambie los selectores DOM de `ddAuditToast`; por ello debe permanecer en las pruebas de regresión de Modo Fácil.

## Impacto en gates

- **ISU:** mejora parcial de claridad; no calcular puntuación definitiva sin usuarios reales.
- **IUD / ICGD / IFR:** sin puntuación definitiva; no se modifica lógica documental.
- **Prelaunch:** no cierra ningún bloqueante V5.

## Bloqueantes V5 que permanecen

Autenticación y aislamiento multiusuario, backend seguro, OWASP ASVS, backup/restauración real, IA semántica real, pruebas de 100 generaciones, Word/PDF/impresión reales, dispositivos físicos, año escolar completo, concurrencia productiva y pilotos con usuarios reales.

No se aplicó ni declaró vigente ninguna norma MINEDU en esta corrección; por tanto no se introdujeron afirmaciones normativas nuevas.