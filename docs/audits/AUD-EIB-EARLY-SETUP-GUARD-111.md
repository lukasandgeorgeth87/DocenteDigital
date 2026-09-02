# AUD-EIB-EARLY-SETUP-GUARD-111

## Alcance
Auditoría acumulativa V2 + V3 + V4 + V5 + Núcleo IA sobre la configuración inicial y el perfil EIB/monolingüe.

## Prueba
- **ID:** AUD-EIB-EARLY-SETUP-GUARD-111
- **Módulo:** Configuración inicial / perfil lingüístico / carga del runtime
- **Entrada:** completar Nivel → Tipo de IE → grados/edades → áreas y activar `Guardar y entrar` antes de que termine de cargarse `linguistic-profile-v26.js`, dejando `Tipo de atención lingüística` sin confirmar; variante EIB con `Lengua originaria / variedad principal = Ninguna`.
- **Resultado esperado:** el flujo debe bloquear la entrada hasta confirmar EIB/Monolingüe; si se selecciona EIB, debe exigir una lengua originaria principal. La validación no puede depender exclusivamente de un módulo cargado después de manera asíncrona.
- **Resultado obtenido antes:** `app.js::finishSetup()` solo validaba áreas y guardaba `language`/`quechuaVar`. La validación obligatoria de `linguisticMode` se añadía posteriormente al cargar `linguistic-profile-v26.js` desde el loader de `schedule-prompt-v6.js`. Existía una ventana de integridad durante el arranque/carga lenta en la que el núcleo base no protegía por sí mismo esa decisión.
- **Estado inicial:** **NO PASA**
- **Clasificación inicial:** **PARCIALMENTE FUNCIONAL**
- **Severidad:** **S2 ALTO**

## Causa raíz
La regla obligatoria del perfil lingüístico estaba implementada únicamente como envoltura tardía de `finishSetup()`. El archivo base conservaba una ruta permisiva. Esto hacía depender un dato estructural de la IE del orden/tiempo de carga de módulos secundarios.

## Corrección
Commit funcional `f05a07a1786774c968fffd79d45ef0e91ba494ac`.

Se añadió en `schedule-prompt-v6.js`, antes de iniciar el loader asíncrono, una guarda temprana que:
1. bloquea `Guardar y entrar` si `linguisticMode` está vacío;
2. bloquea EIB si la lengua originaria principal está vacía o en `Ninguna`;
3. persiste en `state` el modo lingüístico y la lengua confirmada;
4. fuerza `Castellano + Ninguna` en perfil monolingüe;
5. deja que `linguistic-profile-v26.js` continúe aplicando después sus controles completos, sin reemplazarlos.

El cambio es pequeño, reversible y no asigna automáticamente una lengua por territorio.

## Evidencia posterior
- GitHub Actions `Prelaunch Smoke` run `33696429160`: **completed / success** sobre el commit funcional.
- Vercel deployment `dpl_H1Rz6jf3gjyUo6GdeGaUJBhRzGr9`: **READY**, target **production**, commit `f05a07a1786774c968fffd79d45ef0e91ba494ac`.
- `https://docente-digital.vercel.app/`: **HTTP 200** después del deployment.
- `https://docente-digital.vercel.app/schedule-prompt-v6.js`: **HTTP 200** y contiene `__ddEarlyLinguisticSetupGuardV491`.

## Resultado posterior
**PASA técnicamente** para la existencia, orden de carga y despliegue de la guarda temprana.

No se declara probada la interacción física bajo red lenta/intermitente en celular, tablet o laptop. Esa prueba permanece **PENDIENTE V5**.

## Fuente normativa
No se aplicó ni declaró vigente una norma MINEDU nueva en esta corrección. La decisión proviene de las especificaciones internas obligatorias de auditoría y del Núcleo IA. Cualquier afirmación normativa externa futura deberá verificarse contra fuente oficial actual.

## Riesgo de regresión
**Bajo–medio.** Existe doble validación deliberada: guarda temprana + `linguistic-profile-v26.js`. Debe mantenerse la misma semántica (`EIB`, `Monolingüe castellano`, `Ninguna`) si se renombra el perfil en futuras versiones.

## Impacto en indicadores
- **IUD:** mejora la coherencia de datos maestros, sin recalcular puntaje.
- **ICGD:** mejora la consistencia del contexto lingüístico heredado, sin recalcular puntaje.
- **IFR:** reduce una ruta de configuración incompleta, sin recalcular puntaje.
- **ISU:** evita entrar con configuración ambigua; no se asigna puntuación sin usuarios reales.
- **Prelaunch:** elimina este defecto técnico concreto; no altera los bloqueantes V5 pendientes.

## Bloqueantes V5 que permanecen
E2E Docente y Director; IA semántica real; autenticación/autorización/aislamiento multiusuario; backend; móvil/tablet/laptop físicos; Word/PDF/impresión físicos; OWASP ASVS; privacidad integral; backup/restore real; 100 generaciones; año completo; concurrencia productiva; costo/monitoreo IA; pilotos con usuarios reales.

**DocenteDigital NO se declara lista para V1.0 por este hallazgo aislado.**