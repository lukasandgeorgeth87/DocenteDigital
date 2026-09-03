# AUD-MAT-REQUEST-132 — Trazabilidad de la solicitud de materiales

## Especificaciones aplicadas
- `AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `AUDITORIA_PRELANZAMIENTO_V5.md`
- `NUCLEO_IA_DOCENTEDIGITAL.md`

## Prueba
**ID:** AUD-MAT-REQUEST-132

**Módulo:** Carpeta Docente → Materiales / revisión de solicitud.

**Entrada de prueba:** seleccionar un tipo de material (por ejemplo, Ficha), un grado/edad, idioma y tema, y pulsar `Revisar solicitud de material` mientras la generación contextualizada real permanece bloqueada.

**Resultado esperado:** la revisión debe conservar y mostrar todos los datos explícitos relevantes de la solicitud —tipo, grado/edad, tema e idioma— sin fabricar el material ni presentar generación simulada como real.

**Resultado obtenido antes:** `material-integrity-v65.js` conservaba tema e idioma, pero no leía ni mostraba el tipo de material ni el grado/edad seleccionados. Esos controles eran visibles en la interfaz, pero sus valores se perdían en la revisión.

**Resultado inicial:** NO PASA.

**Severidad:** S3 MEDIO.

**Clasificación inicial:** PARCIALMENTE FUNCIONAL.

## Causa raíz
La guarda de integridad se incorporó para bloquear la antigua generación demostrativa, pero solo capturó los campos necesarios para impedir contenido ficticio. El formulario continuó ofreciendo tipo y grado sin heredarlos a la revisión de solicitud.

## Corrección aplicada
`material-integrity-v65.js` ahora:
- identifica el control de tipo de material y le asigna `materialType` si el HTML base aún no tiene ID;
- conserva el tipo seleccionado;
- conserva el grado/edad seleccionado;
- muestra tipo, grado/edad, tema e idioma en la revisión;
- amplía `ddAuditMaterialIntegrity()` para exponer esos valores como evidencia técnica;
- mantiene intacto el bloqueo de generación contextualizada hasta contar con IA/servicio validado.

Commit funcional: `d03d289941c954bcd8f3fad46d0131cb5190b089`.

## Evidencia posterior
- GitHub Actions `Prelaunch Smoke` #93: `completed / success` sobre el commit funcional.
- Deployment Vercel del commit funcional: `dpl_HUTHv6vkBjwixZfgqJun3fPLeXDf` — `READY / production`.
- `https://docente-digital.vercel.app/` respondió HTTP 200 tras el despliegue.
- `https://docente-digital.vercel.app/material-integrity-v65.js` respondió HTTP 200 y sirve `typeControl`, `Tipo solicitado`, `Grado/edad`, `typeValue` y `gradeValue`.

## Retest
**Captura/revisión de contexto de la solicitud:** PASA técnicamente en código, CI y producción.

**Generación real de materiales:** sigue INEXISTENTE/PARCIALMENTE FUNCIONAL y no se aprueba para V1.0. La guarda continúa rechazando contenido genérico o traducciones demostrativas.

## Pendientes que no se simulan
- motor semántico/generativo real validado;
- adecuación por tipo de material y grado/edad mediante generación real;
- validación lingüística de lengua originaria cuando corresponda;
- E2E Unidad/Sesión → Materiales → Evaluación → Registro;
- pruebas físicas móvil/tablet/laptop;
- Word/PDF/impresión reales;
- batería de 100 generaciones y pilotos reales.

## Riesgo de regresión
Bajo. El cambio solo preserva y muestra valores ya seleccionados; no genera contenido, no altera documentos históricos, no modifica normativa ni decisiones pedagógicas.

## Impacto cualitativo
Mejora trazabilidad de datos explícitos, coherencia V4 y fidelidad al Núcleo IA. No se recalculan IUD, ICGD, IFR, ISU ni Prelaunch Score por falta de evidencia integral y usuarios reales.
