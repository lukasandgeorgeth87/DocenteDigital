# AUD-MOBILE-NAV-BOOT-RACE-268

## Estado

**CORREGIDO EN IMPLEMENTACIÓN / E2E Y DISPOSITIVO REAL PENDIENTES**

**Clasificación vigente:** FUNCIONAL EN IMPLEMENTACIÓN; validación final móvil PENDIENTE.

**Severidad original:** S2 ALTO.

**Gate V5:** BLOQUEADO por pruebas físicas y otros hallazgos independientes.

---

## Especificaciones aplicadas

- V2: Director es uno de los dos espacios principales de DocenteDigital.
- V3: una función no se aprueba solo porque exista código; debe probarse con entrada, esperado, obtenido y evidencia.
- V4: las funciones principales deben ser accesibles y simples en móvil; la navegación no debe esconder funciones esenciales.
- V5: la app debe probarse físicamente en celular económico, gama media y tablet; una app inutilizable en celular es bloqueante.

No se declara en este hallazgo ninguna vigencia normativa MINEDU/UGEL externa.

---

## Causa raíz

El HTML/CSS base oculta `.sidebar` a `max-width:850px` y la barra móvil base solo contiene Inicio, Plan, Sesión, Materiales y Evaluación.

`mobile-navigation-guard-v60.js` corrige correctamente ese diseño agregando `Más → Director / Configuración`. Sin embargo, antes de esta corrección la guarda dependía del cargador secuencial de `schedule-prompt-v6.js` y ocupaba una posición tardía, después de múltiples módulos dinámicos.

En una conexión lenta o con un recurso anterior demorado, existía una ventana de bootstrap en la que:

1. la barra lateral de escritorio ya estaba oculta por CSS;
2. la barra móvil base estaba visible;
3. `mobile-navigation-guard-v60.js` todavía no había ejecutado;
4. Director y Configuración carecían temporalmente de ruta visible en móvil.

Este hallazgo no contradice AUD-220/AUD-247: aquellos corrigieron la ausencia técnica final de la ruta; AUD-268 audita la disponibilidad **durante el arranque**.

---

## Prueba AUD-MOBILE-268-A

**ID:** AUD-MOBILE-268-A  
**Módulo:** Navegación móvil / bootstrap / Director  
**Entrada:** cargar la app en viewport <=850 px con red lenta o con módulos previos demorados, antes de completarse la cola dinámica.  
**Resultado esperado:** la ruta móvil a Director y Configuración debe instalarse al inicio y no depender de decenas de módulos pedagógicos/semánticos.  
**Resultado obtenido antes:** `mobile-navigation-guard-v60.js` estaba situado después de múltiples módulos en la cola secuencial de `schedule-prompt-v6.js`; la navegación base no contenía Director/Configuración y el CSS ocultaba la barra lateral.  
**Evidencia:** `styles.css`, `index.html`, `schedule-prompt-v6.js`, `mobile-navigation-guard-v60.js`.  
**PASA/NO PASA antes:** **NO PASA como invariante de bootstrap**.  
**Severidad:** **S2 ALTO**.  
**Clasificación antes:** **PARCIALMENTE FUNCIONAL**.  
**Acción correctiva:** cargar la guarda móvil tempranamente desde una capa ya directa y estable del Director, manteniendo el cargador estable como segundo intento/fallback.

---

## Corrección aplicada

`director-prototype-guard-v40.js` v43 ahora ejecuta `ensureMobileNavigation()` apenas carga la capa directa del Director. Esta función:

- no hace nada si `mobile-navigation-guard-v60.js` ya está activo;
- evita insertar más de un script temprano mediante `data-dd-early-mobile-nav`;
- carga directamente `mobile-navigation-guard-v60.js` sin esperar la cola semántica/pedagógica;
- si esa carga temprana falla, no bloquea la app y deja al cargador estable posterior volver a intentarlo;
- conserva la idempotencia de `mobile-navigation-guard-v60.js` mediante `window.__ddMobileNavigationGuardV60`.

**Commit funcional:** `278a8f21861fd6fbcd11c40926620eee9db90eb6` — `fix: load mobile director navigation guard early`.

---

## Prueba AUD-MOBILE-268-R1

**Entrada:** inspección de la cadena corregida.  
**Resultado esperado:** `director-prototype-guard-v40.js`, cargado directamente poco después de `app.js`, debe disparar la carga de `mobile-navigation-guard-v60.js` sin esperar la cola larga; un fallo temprano debe conservar el reintento del cargador estable.  
**Resultado obtenido:** la implementación v43 instala `ensureMobileNavigation()` y mantiene el cargador secuencial posterior sin eliminarlo.  
**PASA/NO PASA:** **PASA EN IMPLEMENTACIÓN**.  
**Clasificación:** **FUNCIONAL EN IMPLEMENTACIÓN / E2E REAL PENDIENTE**.  
**Severidad residual:** S3 mientras falte validar red lenta y dispositivo real.

---

## Evidencia posterior verificada

Para el estado acumulativo que incluyó la corrección y este expediente (`25fa2aac7435bbff826b3f08fdd7c7aafaabadd9`):

- Vercel desplegó el commit en producción y el deployment `dpl_8T9sSDXjzFpZQFQ9CCgNMuUpEVWH` alcanzó `READY`.
- La URL canónica `https://docente-digital.vercel.app/` respondió HTTP 200.
- `https://docente-digital.vercel.app/director-prototype-guard-v40.js` respondió HTTP 200 y sirve la versión v43 con `ensureMobileNavigation()`.
- La observabilidad de Vercel no registró errores runtime durante la hora verificada.
- Prelaunch Smoke #287, run `34759911558`, terminó `completed / success` exactamente sobre `25fa2aac7435bbff826b3f08fdd7c7aafaabadd9`.

Estas evidencias demuestran despliegue, disponibilidad y smoke técnico; **no sustituyen** el throttling E2E ni la prueba física móvil exigidos por V5.

---

## Pruebas todavía obligatorias

- throttling de red en navegador real;
- 320/360/375/390/412/768/850 px;
- comprobar `Más → Director` y `Más → Configuración` durante arranque lento;
- foco, Escape, targets táctiles y ausencia de clipping;
- celular económico, gama media y tablet;
- interrupción de carga del primer intento y confirmación del fallback del cargador estable;
- Director extremo a extremo cuando sus funciones V1.0 existan realmente.

Estas pruebas permanecen **PENDIENTES** y no se sustituyen por inspección estática, HTTP 200, Vercel READY ni CI smoke.

---

## Riesgo de regresión e impacto

**Riesgo de regresión:** bajo-medio. La guarda móvil es idempotente y la segunda carga posterior queda neutralizada por su bandera global; el principal riesgo pendiente es una doble solicitud de red, no una doble UI.

**Impacto IUD/ICGD/IFR/ISU/Prelaunch:** mejora técnica potencial en accesibilidad móvil del espacio Director y Configuración, pero **no se modifica ninguna métrica definitiva** hasta disponer de pruebas físicas y usuarios reales.

**Gate:** DocenteDigital continúa **NO APROBADA PARA V1.0**.
