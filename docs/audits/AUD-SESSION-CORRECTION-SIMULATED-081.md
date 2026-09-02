# AUD-SESSION-CORRECTION-SIMULATED-081

## Módulo
Sesiones → corrección/mejora posterior a la generación.

## Especificaciones aplicadas
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

## Prueba
**ID:** AUD-SESSION-CORRECTION-SIMULATED-081

**Entrada:** generar/visualizar una sesión y escribir una indicación en el campo “¿Qué deseas corregir o mejorar?”; pulsar `Enviar`.

**Resultado esperado:** si la corrección con IA está disponible, debe modificar de forma comprobable solo lo solicitado, conservar lo aprobado y dejar evidencia del cambio. Si la IA real todavía no está conectada, la función debe mostrarse claramente como no disponible.

**Resultado obtenido antes de la corrección:** `sendCorrection()` solo añadía al registro visual el texto del usuario y el mensaje “En la siguiente fase con IA...”, sin modificar la sesión ni ejecutar IA. La superficie parecía accionable mediante un campo y botón activos.

**Clasificación antes:** SIMULADA.

**Resultado:** NO PASA.

**Severidad:** S2 — ALTO. Existe falsa apariencia de funcionalidad y puede inducir al docente a creer que su documento fue corregido cuando no hubo modificación.

## Causa raíz
La interfaz de sesión conservaba un control activo previsto para una integración futura de IA, mientras la implementación base únicamente registraba la solicitud como texto.

## Corrección aplicada
Cambio pequeño y reversible en `index.html`:
- se informa expresamente que la corrección con IA todavía no está conectada;
- el campo de corrección queda deshabilitado;
- el botón queda deshabilitado y rotulado `Enviar · Próximamente`;
- se añade `aria-disabled` y una explicación breve mediante `title`.

No se implementó una IA simulada, no se añadió backend ficticio y no se modificó el contenido histórico de ninguna sesión.

**Commit funcional:** `e551108dd65dd603efa1fd28c14e3f02ec8a89e2`.

## Retest posterior
- GitHub Actions `Prelaunch Smoke`, run `33611553741`: `completed / success` para el commit funcional.
- Vercel deployment `dpl_GC9nUR43ysHfBiq3QM7CTufovV8M`: `production / READY` y asociado al commit funcional.
- `https://docente-digital.vercel.app/`: HTTP 200.
- El HTML servido en producción contiene la advertencia y los controles de corrección deshabilitados.

**Estado posterior del defecto específico:** PASA respecto a evitar presentar la corrección con IA como función disponible.

**Clasificación posterior:** INEXISTENTE / DECLARADA PENDIENTE. No se considera FUNCIONAL hasta integrar y probar IA real.

## Riesgo de regresión
Medio. `app.js` todavía conserva `sendCorrection()` como función base; una modificación futura del HTML podría reactivar accidentalmente el control. Debe existir una prueba automatizada que rechace controles activos de corrección mientras no haya integración IA real y evidencia funcional.

## Impacto en métricas
- **IUD/ICGD:** mejora la honestidad funcional y reduce riesgo de uso incorrecto, pero no se calcula valor definitivo.
- **IFR:** disminuye un falso positivo funcional; no se calcula IFR definitivo.
- **ISU:** mejora claridad al evitar una acción que no produce el resultado esperado; ISU definitivo sigue pendiente de usuarios reales.
- **Prelaunch:** elimina este falso control como defecto activo, pero no desbloquea V1.0.

## Bloqueantes V5 que permanecen pendientes
Entre otros: comprensión semántica con IA real; Ficha Maestra completa; Programación; Materiales; Evaluación/Registro; Director E2E; autenticación/aislamiento/backend; OWASP ASVS y privacidad; backup/restauración real; Word/PDF/impresión físicos; móvil físico; 100 generaciones; año completo; concurrencia; monitoreo/costo IA; separación efectiva de entornos; rollback probado y pilotos reales.

No se aplicó ni declaró vigente ninguna norma educativa en esta corrección; por tanto, no se incorporó una referencia normativa externa no verificada.