# AUD-PLAN-DIAGNOSTIC-ENTRY-089 — Entrada simulada de Evaluación diagnóstica

Fecha de auditoría: 2026-09-02

## Alcance

Módulo: Carpeta Docente → Mi planificación → Evaluación diagnóstica.

Especificaciones internas aplicadas conjuntamente: `AUDITORIA_MAESTRA_INTEGRAL_V2.md`, `ADENDA_AUDITORIA_EJECUTABLE_V3.md`, `AUDITORIA_SIMPLICIDAD_USO_V4.md`, `AUDITORIA_PRELANZAMIENTO_V5.md` y `NUCLEO_IA_DOCENTEDIGITAL.md`.

No se aplicó ni se declaró vigente una nueva norma educativa en esta corrección. El hallazgo es técnico/UX y de verdad funcional de la interfaz.

## Prueba

**ID:** AUD-PLAN-DIAGNOSTIC-ENTRY-089

**Entrada:** con un perfil de IE ya configurado, abrir `Mi planificación` e intentar iniciar `Evaluación diagnóstica` mediante el botón `Crear diagnóstico`.

**Resultado esperado:** si la evaluación diagnóstica todavía no está implementada como flujo real, la entrada principal debe indicarlo y no debe conducir al usuario a una pantalla sin una acción funcional. Una función no debe aprobar ni presentarse como disponible solo porque abre un panel.

**Resultado obtenido antes de corregir:** el botón principal ejecutaba `showDiagnostic()`, que únicamente mostraba `diagnosticPanel`. Dentro del panel, `generateDiagnostic()` únicamente quitaba la clase `hidden` de `diagnosticResult`. La guardia V5 existente deshabilitaba el botón interno asociado a `generateDiagnostic`, pero dejaba activo el botón exterior `showDiagnostic()`. El usuario podía, por tanto, hacer un clic aparentemente válido hacia un flujo ya clasificado como pendiente y terminar frente a una acción bloqueada.

**Estado inicial:** NO PASA.

**Clasificación inicial:** SIMULADA / PARCIALMENTE FUNCIONAL.

**Severidad:** S3 — MEDIO. No se observó pérdida de datos, pero la superficie inducía a creer disponible una función esencial V5 que no tiene flujo completo y añadía un clic inútil, contrario a la simplicidad V4.

## Causa raíz

La protección de prelaunch se aplicaba al handler interno `generateDiagnostic`, pero no al punto de entrada `showDiagnostic`. Había inconsistencia entre la verdad funcional del flujo y su navegación inicial.

## Corrección aplicada

Cambio pequeño y reversible en `home-surface-truth-v73.js`:

- se añadió una guardia genérica `markUnavailablePlanningEntry(handler, label)`;
- `showDiagnostic` queda deshabilitado desde la tarjeta principal;
- el botón recibe `disabled`, `aria-disabled`, `aria-label` y `title` explicativo;
- se elimina su `onclick` mientras el flujo siga sin implementación real;
- la etiqueta pasa a `Crear diagnóstico · Próximamente`;
- se mantiene también la protección de Programación anual como operación idempotente.

Commit funcional: `675a382b6d241570e74cea0528caaf2316136cc6`.

## Evidencia posterior

1. GitHub Actions `Prelaunch Smoke`, run `33637674964`, terminó `completed / success` sobre el commit funcional.
2. Vercel desplegó el commit como producción en `dpl_3hJstxa2WYPiJ7psZKhxzrQzWhwR`, estado `READY`.
3. `https://docente-digital.vercel.app/` respondió HTTP 200 después del despliegue.
4. `https://docente-digital.vercel.app/home-surface-truth-v73.js` respondió HTTP 200 y sirve la nueva llamada `markUnavailablePlanningEntry('showDiagnostic','Crear diagnóstico')`.

No se declara prueba física móvil ni prueba con usuario real. Tampoco se considera implementada la Evaluación diagnóstica; únicamente se corrigió la presentación engañosa de su entrada.

## Resultado posterior

**PASA** respecto a verdad funcional de la entrada y reducción del clic muerto.

La función `Evaluación diagnóstica` continúa **INEXISTENTE/PENDIENTE PARA V1.0** hasta disponer de un flujo real probado de extremo a extremo.

## Riesgo de regresión

Bajo. La modificación solo desactiva una ruta que ya terminaba en una acción marcada como no disponible. `Unidad / Proyecto` permanece activa. Debe repetirse prueba de navegador cuando se implemente un flujo diagnóstico real para retirar esta guardia deliberadamente.

## Impacto cualitativo

- **IUD:** mejora la correspondencia entre acción visible y capacidad real.
- **ICGD:** sin cambio sustantivo; el flujo diagnóstico todavía no existe.
- **IFR:** reduce un falso positivo funcional, pero no demuestra fiabilidad del módulo.
- **ISU:** mejora cualitativa por menor clic inútil; no se calcula puntaje definitivo sin usuarios reales.
- **Prelaunch:** elimina esta inconsistencia superficial, pero no desbloquea V1.0.

## Bloqueantes V5 que permanecen

Permanecen pendientes, entre otros: IA semántica real y baterías finalidad X→Y/biohuerto/hormigas; Ficha Maestra completa; Programación anual y diagnóstico reales; Materiales; Evaluación/Registro; Director E2E; autenticación, autorización, aislamiento y backend; OWASP ASVS y privacidad; restauración real; validación física Word/PDF/impresión; móvil físico; 100 generaciones; año escolar completo; concurrencia cuando exista arquitectura multiusuario; monitoreo/costos IA; separación efectiva de entornos; hard gate de publicación; rollback probado y pilotos reales.

DocenteDigital no se considera lista para lanzamiento V1.0.