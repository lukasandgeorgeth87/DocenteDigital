# AUD-STO-ACCESS-055 — almacenamiento bloqueado y arranque seguro

## Alcance
Persistencia / recuperación / pantallas blancas-negras / V4-V5.

## Especificaciones aplicadas
- `AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `AUDITORIA_PRELANZAMIENTO_V5.md`
- `NUCLEO_IA_DOCENTEDIGITAL.md`

## Prueba
**ID:** AUD-STO-ACCESS-055

**Entrada:** ejecutar la aplicación en un navegador/contexto donde `localStorage.getItem()` o `localStorage.setItem()` lance `SecurityError`, `InvalidStateError` o `NotAllowedError`.

**Resultado esperado:** la app no debe quedar en blanco/negro. Debe continuar de forma degradada durante la sesión, informar que el guardado local está bloqueado y no afirmar que los cambios quedaron persistidos.

**Resultado obtenido antes:** `storage-recovery-v26.js` capturaba el primer error de acceso, pero `app.js` volvía a ejecutar inmediatamente `localStorage.getItem('docenteDigitalPrototype')` sin protección. Si el navegador seguía bloqueando Storage, el arranque podía detenerse antes de inicializar la interfaz. Además, la guardia de `setItem` existente solo absorbía errores de cuota; un `SecurityError` podía volver a propagarse desde acciones de guardado.

**Evidencia de causa raíz:** `index.html` carga `storage-recovery-v26.js` antes de `app.js`; `app.js` inicia con `JSON.parse(localStorage.getItem(...))`; la protección previa no interceptaba lecturas bloqueadas de forma persistente.

**Estado inicial:** NO PASA.

**Clasificación:** ROTA bajo la condición probada por inspección técnica.

**Severidad:** S1 — una restricción real del navegador puede impedir el arranque de una función principal y producir una pantalla inutilizable, supuesto bloqueante de prelaunch V5.

## Corrección aplicada
Se añadió `storage-access-guard-v71.js` y se carga entre `storage-recovery-v26.js` y `app.js`.

La guardia:
- intercepta únicamente errores de acceso bloqueado (`SecurityError`, `InvalidStateError`, `NotAllowedError`);
- deja pasar errores distintos para no ocultar fallos reales;
- devuelve `null` en lectura bloqueada para permitir un arranque degradado en memoria;
- evita que una escritura bloqueada rompa el flujo;
- muestra una advertencia visible y sencilla indicando que los cambios pueden perderse al cerrar o recargar;
- no declara persistencia cuando Storage está bloqueado.

Cambios pequeños y reversibles:
- `storage-access-guard-v71.js`
- `index.html` (una inclusión de script antes de `app.js`).

## Evidencia posterior
- Commit del guard: `c28809ea501a06ce8e9de91ddba284920eef13df`.
- Commit de integración: `accd4f4c0c04c5286c7ab53e14e3e9ce917b80ab`.
- Estado GitHub/Vercel del commit de integración: `success`, descripción `Deployment has completed`.

## Retest
**Técnico por inspección de carga:** PASA para la ruta de excepción diseñada: la guardia queda cargada antes de la primera lectura no protegida de `app.js`.

**Prueba física en Safari/iOS, WebView, modo privado, políticas empresariales y navegadores con Storage realmente bloqueado:** PENDIENTE. No se simula como realizada.

**HTTP 200 del dominio productivo y del nuevo asset:** PENDIENTE en esta ejecución por imposibilidad del entorno de resolución/acceso HTTP directo. No se declara sin evidencia.

**Vercel READY:** existe evidencia de estado de deployment `success / Deployment has completed`; no se equipara a una comprobación administrativa adicional de READY si esa vista no está disponible.

## Riesgo de regresión
Bajo. La guardia solo absorbe errores explícitos de bloqueo de Storage. Errores de programación o de otra naturaleza continúan propagándose.

## Impacto
- IUD: mejora potencial al evitar pantalla inutilizable.
- ICGD/IFR: mejora de resiliencia de guardado degradado, sin convertir `localStorage` en persistencia robusta.
- ISU: mejora cualitativa; no se calcula puntaje definitivo.
- Prelaunch: elimina una causa técnica concreta de pantalla blanca/negra, pero no cierra el gate V5.

## Bloqueantes V5 que permanecen
Persistencia multiusuario/backend, autenticación y aislamiento, auditoría OWASP ASVS real, backup/restauración real, pruebas físicas móvil/Word/PDF/impresión, 100 generaciones, año completo, concurrencia productiva, pilotos reales, IA semántica real y validación curricular/normativa versionada.

DocenteDigital NO se declara lista para lanzamiento.
