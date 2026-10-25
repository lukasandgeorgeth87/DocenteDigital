# DocenteDigital — estado canónico para continuidad entre conversaciones

**Actualización:** 2026-10-25, aproximadamente 00:20 (America/Lima).  
**Repositorio:** https://github.com/lukasandgeorgeth87/DocenteDigital  
**Rama de desarrollo/beta:** `audit/v5-continuity-offline-diagnostic`  
**Último commit de código/prueba previo a esta bitácora:** `b689bccc20a485639300901a407cf5f3d5579be0`.  
**Versión exacta más reciente:** consultar el HEAD de esta rama; el propio commit que actualiza esta bitácora es posterior al SHA citado.

> Este documento es la fuente de continuidad para recuperar DocenteDigital desde otro chat. Verificar siempre GitHub, CI y Vercel en tiempo real antes de afirmar que una función está terminada. No confundir el HEAD de la rama con el despliegue público.

## Decisiones de producto (vigentes)

1. OpenAI API es el motor principal para generar y mejorar contenido pedagógico; plantillas y generación local son respaldo, con origen distinguible. **GPT real todavía no validado**.
2. Prioridad: beta privada comprobable en navegador, sin fusionar a `main` ni publicar producción sin puertas de seguridad y pruebas.
3. Futuro: versión Windows con almacenamiento local y respaldo, después de estabilizar la web. GPT remoto no funcionará offline sin alternativa local.
4. Enfoque Perú/CNEB/MINEDU, multigrado y EIB con contexto, diferenciación y sin inventar estándares, datos o fuentes oficiales.

## Evidencia de CI y Vercel

- **CI confirmado PASS:** GitHub Actions `Beta E2E Browser Gate` para commit `e1a0de32b12518005b09837f2992a6c065f72f21`, run https://github.com/lukasandgeorgeth87/DocenteDigital/actions/runs/40158344057. Pasaron las etapas de onboarding móvil en tres niveles, E2E beta, regresiones semánticas, privacidad de red, continuidad/recuperación/offline, estructura DOCX y accesibilidad. Es **prueba automatizada con navegador y servidor local en CI**, no piloto docente real.
- **CI PASS con nuevo contrato GPT simulado:** https://github.com/lukasandgeorgeth87/DocenteDigital/actions/runs/40161251453, commit `0db40f0a7518b2d88034241087559f1eb6384edc`. Incluye prueba de contrato GPT, móvil, beta E2E, golden semántico, privacidad, continuidad, DOCX y accesibilidad. **Nueva ejecución pendiente:** https://github.com/lukasandgeorgeth87/DocenteDigital/actions/runs/40161330019, commit `d75e5700`, amplía el contrato a generación de imagen simulada.
- **Preview Vercel verificada READY:** commit `d75e5700...`, https://docente-digital-ctxmiq30k-jorgeluispalma87-7403.vercel.app ; HTTP 200 en `/` y `/api/ai-status` comprobados. Estado: `configured:false`, `text:false`, `image:false`, `verified:false`; no hubo generación real de IA. Variables Vercel consultadas sin descifrar: `OPENAI_API_KEY` existe solo para target `production`, no para `preview`. No copiar ni publicar la clave en una preview sin control de acceso y cuota.
- **Producción pública (rama main):** https://docente-digital.vercel.app ; `/` HTTP 200, pero `/api/ai-status` HTTP 404 en verificación anterior. No confundir producción con preview de beta.
- **Rama frente a main:** antes de nuevos cambios, 207 commits por delante, 0 por detrás; no fusionar a ciegas.

## Ejecución adicional del 25/10/2026 (00:14–00:20, Perú)

- **CI anterior comprobado:** run 40161330019, commit `d75e5700`, **PASS** completo (incluida imagen simulada). Fuente: https://github.com/lukasandgeorgeth87/DocenteDigital/actions/runs/40161330019.
- **Regresión detectada:** run 40161420829 para `fb2b1941`, **FAIL** en prueba DOCX (espera de descarga agotada tras 30 s); continuidad y GPT simulado sí pasaron. Fuente: https://github.com/lukasandgeorgeth87/DocenteDigital/actions/runs/40161420829. No se concluye que el DOCX de usuario esté roto: el fallo es intermitente y requiere reproducción/diagnóstico.
- **Corrección de seguridad de salida GPT:** `c6322be95a1dfc4ffab46df70bed60410ace2d72` modifica `api/ai.js` para rechazar respuestas JSON con estructura incorrecta y respuestas de proveedor con estado incompleto; no anuncia éxito pedagógico falso.
- **Pruebas de regresión añadidas:** `c3b4479715ba87da4b1f32229820fab8bf4ee54f` amplía `tests/ai-contract.mjs` con rechazo de salida malformada y truncada. CI: https://github.com/lukasandgeorgeth87/DocenteDigital/actions/runs/40164847169 (pendiente al redactar).
- **Diagnóstico DOCX reforzado:** `b689bccc20a485639300901a407cf5f3d5579be0` espera hidratación real de sesión, verifica el exportador OOXML y comunica si aparece alerta en vez de agotar 30 s sin diagnóstico. CI: https://github.com/lukasandgeorgeth87/DocenteDigital/actions/runs/40164916942 (pendiente al redactar).
- **Vercel comprobado:** preview para `c3b44797` https://docente-digital-2wxpq6mqu-jorgeluispalma87-7403.vercel.app **READY**, GET `/` HTTP 200, GET `/api/ai-status` HTTP 200 y `configured:false, verified:false`. Aún no se verificó preview del SHA `b689bccc`.
- **Bloqueantes inalterados:** sin GPT real (clave ausente en preview), sin autenticación/cuota de endpoint pagado, sin piloto ni backend multiusuario. **V5 21/100**, desarrollo histórico 75% (estimación, no prueba).

## Cambios recientes con evidencia

| SHA | Archivo(s) | Cambio y estado |
|---|---|---|
| `e1a0de32` | `tests/continuity-resilience.mjs` | Inyecta estado corrupto antes del arranque para evitar carrera de navegación. **CI PASS** run 40158344057. |
| `a88b4630` | `api/ai.js` | Corrige IDs predeterminados de modelos a `gpt-6-luna` (rutina) y `gpt-6.1-sol` (complejo), configurables por entorno. No se ha probado aún acceso real a esos modelos con credenciales. |
| `b3598d93` | `api/ai-status.js` | `text` e `image` no anuncian disponibilidad sin clave; `verified:false` distingue configuración de prueba real. |
| `5218f5a6` | `tests/ai-contract.mjs` | Pruebas deterministas del contrato de endpoints sin claves reales ni consumo de tokens: estado, validación, privacidad del contexto, selección de modelo y errores. |
| `0db40f0a` | `.github/workflows/beta-e2e.yml` | Ejecuta la nueva prueba de contrato GPT en CI. **CI PASS**, run 40161251453. |
| `d75e5700` | `tests/ai-contract.mjs` | Amplía el contrato a confirmación de crédito y generación de imagen simulada, sin consumo real. CI para este SHA pendiente al redactar. |

## Estado funcional: no exagerar

| Componente | Evidencia | Clasificación |
|---|---|---|
| Inicio, onboarding y navegación móvil | CI E2E PASS para e1a0de32 | FUNCIONAL en pruebas automatizadas |
| Unidad/sesión, coherencia semántica | CI beta + golden PASS para e1a0de32 | PARCIALMENTE FUNCIONAL; falta piloto integral |
| Guardado, copia JSON, recuperación corrupta, uso offline y DOCX | CI continuidad + DOCX PASS para e1a0de32 | FUNCIONAL en escenarios probados; no equivale a respaldo en servidor |
| Materiales y evaluación | Módulos de la rama beta presentes; producción pública los deshabilita | PARCIALMENTE FUNCIONAL / sin cierre de producto |
| Director | Código de módulo en rama beta | PARCIALMENTE FUNCIONAL; falta prueba integral |
| IA GPT texto e imagen | Endpoints y frontend existen en rama beta; preview `configured:false` | INEXISTENTE como generación real comprobada; contrato simulado en prueba nueva |
| Autenticación multiusuario, sincronización cloud y aislamiento de datos | Sin evidencia de backend productivo validado | BLOQUEANTE de lanzamiento |
| App Windows | Planificada | NO IMPLEMENTADA |

## Riesgos / bloqueantes

- **S1:** generación GPT real no validada: configurar `OPENAI_API_KEY` **en preview**, comprobar acceso a modelos y prueba de extremo a extremo sin divulgar la clave.
- **S1:** seguridad de endpoint de IA con coste por solicitud: no hay autenticación y control de cuota verificables; mantener beta privada y no exponer endpoint con clave al público.
- **S1:** faltan backend multiusuario, privacidad/aislamiento, respaldo remoto y pruebas de concurrencia; no habilitar lanzamiento general.
- **S2:** materiales, evaluación, director, PDF y recorridos completos necesitan prueba de usuario y validación funcional adicional.
- **S2:** confirmar despliegue READY y HTTP 200 del HEAD más reciente antes de compartirlo como beta.

## Métricas de seguimiento (sin mezclarlas)

- **Desarrollo funcional estimado histórico:** 75 %, NO revalidado como porcentaje de cierre.
- **Cierre V5 histórico:** 21/100 puntos. **Se mantiene 21/100** hasta reconciliar evidencia por cada bloque de la matriz: runtime 10, UX 10, IA 15, flujo docente 15, materiales 10, evaluación 10, director 10, persistencia/exportación 8, CI/CD 7, seguridad/piloto 5.
- No asignar porcentajes ficticios por número de commits o por presencia de archivos.

## Próximos pasos, orden de ejecución

1. Consultar run 40161330019 para confirmar prueba de imagen simulada; corregir fallos si los hay.
2. Preview del SHA d75e5700 ya verificada READY y HTTP 200 en `/` y `/api/ai-status`; repetir verificación tras nuevos commits.
3. Añadir control de acceso/cuota real al endpoint antes de activar API pagada; validar seguridad.
4. Configurar credencial de OpenAI en entorno privado, comprobar conexión real con la herramienta de la app, probar generación de títulos/situaciones/materiales y respaldo local ante fallo.
5. Completar recorrido real docente y director, Word/PDF y restauración de datos. Documentar PASS/FAIL con entradas y salidas.
6. Mantener actualizada esta bitácora **solo cuando haya cambios materiales nuevos** y registrar los SHAs y URLs de evidencia.

## Avance 25/10/2026, 01:17 (Perú)

- Código: 5a23af8b corrige la respuesta exitosa de imagen sin imagen; 51cf710d agrega pruebas para respuestas vacías; 7af66319 aclara comentario.
- GitHub Actions 40168324471: CI completo PASS en commit 7af66319; contrato GPT simulado, onboarding móvil, beta E2E, golden semántico, privacidad de red, continuidad/recuperación, DOCX y accesibilidad aprobados. No es prueba de generación real. Evidencia: https://github.com/lukasandgeorgeth87/DocenteDigital/actions/runs/40168324471
- Preview de 7af66319: READY; GET raíz HTTP 200 y GET /api/ai-status HTTP 200; configured=false, verified=false.
- Pendientes: autenticación y límites de consumo, generación GPT real y recorrido integral de usuario con datos de prueba.
- Métricas sin cambio: cierre V5 21/100; desarrollo funcional histórico estimado 75 %.

## Avance 25/10/2026, madrugada — respaldo local de títulos (rama de pruebas)

- **Código:** commit `63a4fd3a25db78fbbef8e9349849eb4cb762d739`, archivo `openai-runtime-v1.js`. Cuando la API GPT no está configurada o falla, el botón «3 títulos con IA» ahora ofrece hasta tres títulos mediante el motor local ya existente, **etiquetados claramente «Opciones locales sin IA (respaldo)»**, seleccionables y editables. Si tampoco existe el motor local, conserva el aviso de error. El panel GPT deja de llamar «conectada» a una clave configurada sin prueba real y ahora indica «conexión aún no verificada».
- **Regresión nueva:** commit `ba21b8787b312cdcfae6de8601f341f98082de51`, `tests/ai-local-fallback.mjs`, prueba sin red de propuestas locales, selección de una propuesta y etiqueta veraz de conexión.
- **CI:** commit `728065994936f4eda86a2f971f814f9e6b1c74c4` incorpora `node tests/ai-local-fallback.mjs` al flujo `.github/workflows/beta-e2e.yml`. Run https://github.com/lukasandgeorgeth87/DocenteDigital/actions/runs/40171926193: paso **«Validate offline title fallback and truthful GPT connection status» PASS**; ejecución integral aún en curso al registrar este avance. El contrato GPT simulado también pasó en este run.
- **Vercel:** preview del commit `72806599` **READY** según listado de despliegues: https://docente-digital-ixobuh87h-jorgeluispalma87-7403.vercel.app . GET `/` **HTTP 200**, GET `/api/ai-status` **HTTP 200**; respuesta `configured:false,verified:false`. No se hizo ninguna generación real ni se activó una clave.
- **Estado:** fallback local de títulos probado automáticamente; GPT real, seguridad de acceso/cuota, materiales, evaluación, Director, respaldo remoto y piloto permanecen pendientes. **V5 21/100 sin cambios; desarrollo histórico estimado 75 %**. No se modificó producción.
- **Siguiente paso:** comprobar el resultado final del run 40171926193; después proteger el endpoint de IA de pago y ejecutar generación real únicamente en un entorno privado con control de acceso y consumo.


## Avance 25/10/2026, 03:12 (Perú) — interruptor de seguridad para IA de pago

- **Rama:** `audit/v5-continuity-offline-diagnostic`. **HEAD de código:** `a5ba887a518f44c0fbdd8d5bbc1eaf99e923dce5`. La rama `main` y los datos de producción no se modificaron.
- **GitHub Actions previo:** run `40171926193` **PASS** completo (incluye fallback local de títulos, contrato GPT simulado, E2E móvil, privacidad, continuidad, DOCX y accesibilidad). URL: https://github.com/lukasandgeorgeth87/DocenteDigital/actions/runs/40171926193 .
- **Nuevo código de seguridad:** `330b68c8` (api/ai.js) y `84b60fc0` (api/image.js) requieren `DD_AI_BETA_ENABLED=true` en servidor para realizar llamadas pagadas. Una clave `OPENAI_API_KEY` por sí sola ya **no activa** llamadas a OpenAI. Si la clave está presente pero el interruptor apagado, ambos endpoints responden HTTP 503 `ai_beta_disabled`. Si falta la clave, mantienen HTTP 503 `openai_not_configured`.
- **Estado y UX:** `842305fc` (api/ai-status.js) separa `configured` de `enabled` y declara `text/image` disponibles solo cuando ambas condiciones son verdaderas; `964482db` y `a5ba887a` (openai-runtime-v1.js) impiden solicitudes de texto/imagen y muestran una explicación cuando el interruptor está apagado.
- **Regresión añadida:** `d1834b46` (tests/ai-contract.mjs) verifica con proveedor simulado que una clave configurada sin `DD_AI_BETA_ENABLED` no genera solicitudes pagadas y que los endpoints retornan 503. **CI del HEAD:** https://github.com/lukasandgeorgeth87/DocenteDigital/actions/runs/40175734233 — **en progreso** en el momento de este registro; NO afirmar PASS hasta comprobarlo.
- **Vercel preview del HEAD:** https://docente-digital-818p5631e-jorgeluispalma87-7403.vercel.app — despliegue **READY** según Vercel, GET `/` HTTP **200**, GET `/api/ai-status` HTTP **200**, respuesta real `{"ok":true,"configured":false,"enabled":false,"text":false,"image":false,"verified":false,"server_side":true}`.
- **Limitación crítica S1:** el interruptor es una barrera de activación accidental y facturación, **NO autentica usuarios, no limita solicitudes ni impide abuso si se habilita**. No activar `DD_AI_BETA_ENABLED` con una clave real hasta implementar protección de acceso y cuotas, además de pruebas reales. GPT principal, plantillas locales como respaldo y app Windows futura se mantienen como decisiones de arquitectura; Windows aún no implementado.
- **Próxima acción:** comprobar conclusión y logs del run 40175734233; corregir cualquier regresión; después implementar autenticación/cuotas antes de habilitar GPT real. Recorrido docente integral, materiales, evaluación, director, PDF, respaldo remoto y piloto siguen pendientes de cierre.
- **Métricas:** desarrollo funcional histórico estimado **75 %** (sin revalidar); cierre V5 **21/100** (sin incremento por falta de cierre integral del bloque seguridad).


## Avance 25/10/2026, 04:14 (Perú) — regresión CI del interruptor de IA corregida

- **Hallazgo real:** el run GitHub Actions [40175734233](https://github.com/lukasandgeorgeth87/DocenteDigital/actions/runs/40175734233) terminó **FAIL** en `tests/ai-local-fallback.mjs` (línea 47). La prueba esperaba el aviso «conexión aún no verificada» al existir una clave, pero el nuevo interruptor de seguridad correctamente mostraba «IA desactivada por seguridad». El contrato del servidor GPT simulado sí pasó; las etapas posteriores del navegador fueron omitidas por el fallo temprano. No declarar CI aprobado para el commit anterior.
- **Corrección guardada:** commit `621017703f9da6453247aa8a2636e1c15ca80d78`, archivo `tests/ai-local-fallback.mjs`. La prueba distingue ahora (1) clave configurada con beta apagada: debe mostrar desactivación segura, y (2) beta encendida sin prueba real del proveedor: debe mostrar conexión aún no verificada. En ambos casos prohíbe anunciar conexión comprobada. Es una corrección de prueba para alinearla con la nueva regla de seguridad; no habilita IA de pago.
- **CI de corrección:** [run 40179850910](https://github.com/lukasandgeorgeth87/DocenteDigital/actions/runs/40179850910) en curso al redactar. **Pendiente confirmar PASS/FAIL integral** y corregir si aparecen otras regresiones.
- **Vercel de la corrección:** [preview de commit 62101770](https://docente-digital-bm2cgcyps-jorgeluispalma87-7403.vercel.app) **READY**; GET `/` HTTP 200, GET `/api/ai-status` HTTP 200, cuerpo `{\"ok\":true,\"configured\":false,\"enabled\":false,\"text\":false,\"image\":false,\"verified\":false,\"server_side\":true}`. No hay prueba real de OpenAI.
- **Seguridad:** mantener `DD_AI_BETA_ENABLED` apagado hasta disponer de autenticación y cuotas. Producción y datos reales intactos. No se ha cerrado el bloqueo S1.
- **Continuidad:** rama `audit/v5-continuity-offline-diagnostic`; HEAD de código antes de esta actualización `621017703f9da6453247aa8a2636e1c15ca80d78`. Para el HEAD definitivo consultar GitHub. Próxima acción: confirmar resultado de CI 40179850910; si PASS, continuar con control de acceso y cuotas de beta privada.
- **Métricas:** desarrollo funcional histórico 75 % estimado, cierre V5 **21/100** (ambos sin modificación; no confundir reparación de regresión de pruebas con cierre integral de seguridad).


## Avance 25/10/2026, 05:14 (inicio de ejecución, Perú) — acceso privado a endpoints de IA

- **Rama de trabajo:** `audit/v5-continuity-offline-diagnostic`; último commit de código y CI antes de esta actualización: `3ad841badd491150a0ef76f6dee659cf6b780c08`. Consultar el HEAD actual para el SHA definitivo. La rama principal y los datos de producción permanecen intactos.
- **Seguridad real implementada en código:** `27456225` añade `api/_beta-access.js`, que exige `DD_AI_BETA_TOKEN` de 32 caracteres o más, y compara el token recibido en `x-dd-beta-token` mediante hashes SHA-256 y comparación de tiempo constante. Si el secreto no existe o es débil: HTTP 503 `beta_access_not_configured`; si falta o es incorrecto el token: HTTP 401 `beta_access_denied`. Esto es una **barrera de acceso compartida de beta privada**, NO autenticación individual ni límite de gasto.
- **Aplicación del control:** `6e756258` protege `api/ai.js`; `9f62f326` protege `api/image.js`; `e2a22798` actualiza `api/ai-status.js` con `access_required` y `access_configured`. Mantiene la exigencia adicional de `DD_AI_BETA_ENABLED=true` y `OPENAI_API_KEY`. Ninguna llamada pagada puede ocurrir solo por configurar la clave.
- **Pruebas de servidor:** `2d8ac14c` amplía `tests/ai-contract.mjs`: clave sin flag, flag sin secreto, token ausente o incorrecto y protección del endpoint de imágenes. En el run [40184038600](https://github.com/lukasandgeorgeth87/DocenteDigital/actions/runs/40184038600), el contrato GPT **PASS** y la ejecución integral **SUCCESS** (verificado después del primer registro).
- **Interfaz privada:** `09f7d0a6` agrega campo para introducir código temporal de acceso en el asistente, retenido **solo en memoria de la pestaña**, sin localStorage; lo transmite en la cabecera de solicitudes de texto e imagen y muestra mensajes claros de denegación. No es la clave de OpenAI ni debe enviarse por chat.
- **Regresión del cliente:** `19a162a4` crea `tests/ai-beta-client.mjs`, `d6e7ca48` corrige el montaje de prueba y `3ad841ba` incorpora la comprobación al flujo CI. En el run [40184095345](https://github.com/lukasandgeorgeth87/DocenteDigital/actions/runs/40184095345), los pasos de contrato GPT, fallback local y **«Validate private beta client access token handling» PASS**; el resto de E2E seguía ejecutándose al registrar.
- **Vercel preview del código HEAD `3ad841ba`:** [abrir preview](https://docente-digital-l1wfsp0s7-jorgeluispalma87-7403.vercel.app). Estado **READY** confirmado con `get_deployment`; GET `/` HTTP **200** y GET `/api/ai-status` HTTP **200**, cuerpo `{"ok":true,"configured":false,"enabled":false,"access_required":true,"access_configured":false,"text":false,"image":false,"verified":false,"server_side":true}`. No se configuraron secretos ni se realizaron llamadas reales a OpenAI.
- **Pendientes S1:** faltan autenticación por usuario, cuotas duraderas por usuario, límites presupuestarios del proveedor, clave/configuración privada de OpenAI y prueba de generación real. **No activar la API pagada ni considerar segura una beta pública.** El token compartido es solo una barrera mínima para pruebas controladas, no una solución de lanzamiento.
- **Pendientes S2:** pruebas reales de materiales, evaluación, Director, PDF, recorrido completo con usuarios y respaldo remoto. La futura app PC no está implementada.
- **Decisiones vigentes:** GPT como motor principal cuando esté protegido y probado; títulos/plantillas locales como respaldo; app Windows/PC como fase posterior.
- **Métricas sin inflación:** desarrollo funcional histórico estimado **75 %** (no revalidado); cierre V5 **21/100** (sin incremento hasta cerrar bloqueantes).
- **Próximo paso:** confirmar conclusión integral del run 40184095345, corregir regresiones si aparecen; implementar control de cuotas persistente y autenticación individual antes de activar IA real; después probar el recorrido docente completo en una beta privada.


## Avance 25/10/2026, 06:14–06:25 (Perú) — cuota diaria duradera para IA de pago

- **Objetivo material:** impedir que un token compartido permita solicitudes de IA pagadas ilimitadas. Se añadió una **cuota global diaria persistente**, sin confundirla con autenticación individual ni con un tope monetario de OpenAI.
- **Código:** `302002d1` crea `api/_ai-quota.js`. Reserva unidades mediante un único `EVAL` Lua atómico sobre Redis REST de Upstash: lee consumo, comprueba el límite, incrementa y establece expiración. Clave por día UTC; 1 unidad para texto y 5 para imagen; tope configurable `DD_AI_DAILY_MAX_UNITS` (entero de 1 a 10000). Las unidades son una política de admisión, **no equivalen a dólares ni garantizan el gasto real**.
- **Integración:** `e89a6b05` (`api/ai.js`) y `4f337737` (`api/image.js`) reservan cuota **antes** de contactar al proveedor; `5b0c0581` (`api/ai-status.js`) muestra `quota_configured` y no anuncia generación disponible si falta cuota.
- **Protección por defecto:** sin `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` o `DD_AI_DAILY_MAX_UNITS`, HTTP 503 `ai_quota_not_configured`; ante fallo de Redis, HTTP 503 `ai_quota_unavailable`; al agotarse el límite, HTTP 429 `ai_daily_quota_exceeded`. No existe fallback en memoria que permita saltarse el contador entre instancias.
- **Pruebas:** `ca8bc160`, `3c00f52b` y `bf8870c7` amplían `tests/ai-contract.mjs` con simulación de EVAL, cuota ausente, límite agotado, coste de imagen y corte de acceso al proveedor cuando Redis falla. La ejecución [40188136208](https://github.com/lukasandgeorgeth87/DocenteDigital/actions/runs/40188136208) confirmó **PASS del paso de contrato GPT**; resultado integral pendiente de comprobación final al escribir este registro. El run [40188248040](https://github.com/lukasandgeorgeth87/DocenteDigital/actions/runs/40188248040) corresponde al último cambio de prueba y estaba en cola al consultarlo.
- **Interfaz:** `f0b0e147` (`openai-runtime-v1.js`) distingue falta de cuota, servicio de cuota no disponible y límite diario agotado, sin presentar una conexión inexistente. `56feb7a3` añade regresión de este estado en `tests/ai-local-fallback.mjs`.
- **Vercel:** preview de `56feb7a3` **READY**: https://docente-digital-8ra0vli0w-jorgeluispalma87-7403.vercel.app . El despliegue de `bf8870c7` estaba **BUILDING** al consultar; no se verificó HTTP 200 del último HEAD. Producción y datos reales sin cambios.
- **Configuración pendiente:** `OPENAI_API_KEY`, `DD_AI_BETA_ENABLED=true`, `DD_AI_BETA_TOKEN` (>=32 caracteres), `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` y `DD_AI_DAILY_MAX_UNITS` en entorno **privado**; no publicar secretos. El Redis real y OpenAI real **NO** se han probado: solo proveedor/Redis simulados en CI. Validar primero credenciales, límite del proveedor y beta privada controlada.
- **Bloqueantes que permanecen:** S1 autenticación individual, presupuesto monetario/consumo real y prueba GPT real; S2 recorridos completos de docente/director, materiales, evaluación, PDF, backup remoto y pilotos. No declarar beta lista para público.
- **Métricas sin incremento artificial:** desarrollo funcional histórico **75 % estimado**, cierre V5 **21/100**. No confundir una barrera global con cierre integral de seguridad.
- **Próximo paso:** confirmar resultado final de CI para `bf8870c7` y Vercel READY, corregir regresiones si aparecen, verificar contador Redis real en beta cerrada y probar generación OpenAI con presupuesto estricto; continuar recorrido docente.


### Cierre de verificación de la ejecución 06:xx (25/10/2026, Perú)

- **CI final PASS:** run [40188248040](https://github.com/lukasandgeorgeth87/DocenteDigital/actions/runs/40188248040) completado con **SUCCESS** para el commit de código/prueba `bf8870c7075365bcdb173fdcf76982a5f51f4b23`. Aprobó contrato de IA con Redis simulado y fallos de cuota, respaldo local y mensajes, token privado en memoria, navegación móvil, beta E2E, golden semántico, privacidad de red, continuidad/recuperación, estructura DOCX y accesibilidad. **No** implica validación con Redis real ni OpenAI real.
- **Preview del commit de código `bf8870c7`: READY** según Vercel: https://docente-digital-c67yhmyct-jorgeluispalma87-7403.vercel.app . **Preview del commit documental `dd795c30`: READY**: https://docente-digital-8p987bxgq-jorgeluispalma87-7403.vercel.app . En esta ejecución no fue posible verificar HTTP 200 desde el cliente externo, por lo que se consigna únicamente READY.
- **Producción no alterada.** Continúan S1: servicio GPT real sin probar, Redis real sin configurar/probar, falta autenticación individual y presupuesto monetario independiente. **V5 21/100; desarrollo histórico 75 % estimado**, sin cambio.


## Avance 25/10/2026, 07:14–07:20 (Perú) — evitar falsos éxitos de GPT con títulos incompletos

- **Rama exclusiva:** `audit/v5-continuity-offline-diagnostic`. **Último commit funcional/de pruebas previo a esta bitácora:** `ce3a78932b496d26a7e8f0fe8f8209f0fff00382`; confirmar HEAD posterior a esta actualización. Sin modificaciones a `main`, producción ni datos reales.
- **Punto de partida comprobado:** GitHub Actions run [40188248040](https://github.com/lukasandgeorgeth87/DocenteDigital/actions/runs/40188248040) **PASS** completo para `bf8870c7` (contrato IA simulado, fallback local, token privado, navegación móvil, beta E2E, regresiones semánticas, privacidad, continuidad, DOCX y accesibilidad). No extrapolar ese PASS a los commits nuevos.
- **Corrección de código:** `cd1250c15dfbd3aa0204f46a93c2745860555edf` en `api/ai.js`. El validador de respuesta estructurada ahora rechaza JSON correcto pero sin contenido pedagógico, opciones vacías y, para `title_options`, menos/más de tres títulos o títulos duplicados (sin distinguir mayúsculas ni espacios externos). Antes estos casos podían devolver HTTP 200 y presentar una generación inutilizable. No hay llamadas a OpenAI real.
- **Pruebas de regresión:** `ce3a78932b496d26a7e8f0fe8f8209f0fff00382` en `tests/ai-contract.mjs`. Casos nuevos: salida vacía HTTP 502; dos títulos HTTP 502; duplicados HTTP 502; tres distintos HTTP 200. **Prueba aislada ejecutada realmente:** extracción de la función `validStructuredResult` del archivo de GitHub y ejecución en JavaScript con cinco casos (válido, vacío, dos títulos, duplicados, opción vacía): **5/5 PASS**. Esta prueba aislada **no sustituye GitHub Actions ni una llamada GPT real**.
- **GitHub Actions del SHA `ce3a7893`:** **PENDIENTE DE VERIFICACIÓN** al redactar; no afirmar CI integral PASS sin evidencia de ejecución.
- **Vercel del SHA `ce3a7893`:** despliegue de preview **READY** y verificado mediante GET de la página principal **HTTP 200** y GET `/api/ai-status` **HTTP 200**: https://docente-digital-i9fltwrhn-jorgeluispalma87-7403.vercel.app . Estado: `configured:false, enabled:false, access_configured:false, quota_configured:false, text:false, image:false, verified:false`. **GPT real NO disponible ni probado**.
- **Módulos:** onboarding/móvil, continuidad, DOCX y fallback de títulos tienen evidencia previa de CI automatizado; los nuevos casos de validez de salida tienen solo prueba aislada hasta verificar nuevo CI. Flujo docente integral, materiales, evaluación, director, PDF, respaldo remoto y piloto docente siguen **PARCIALES/no validados integralmente**. Autenticación individual y app Windows/PC **NO DISPONIBLES**. La cuota Redis está implementada y simulada en CI anterior, pero **NO probada con Redis real**.
- **Bloqueantes:** **S0:** ninguno nuevo identificado; **S1:** GPT real, Redis real, autenticación individual, límite monetario del proveedor y protección integral de beta; **S2:** recorrido completo docente/director, materiales, evaluación, PDF, piloto, backup remoto y confirmación de CI de los nuevos cambios; **S3:** afinar UX y mensajes; **S4:** futura app Windows/PC. No considerar una beta pública lista.
- **Decisiones inalteradas:** GPT es motor principal solo tras prueba real y controles de gasto; títulos/plantillas locales son respaldo identificado; app PC es una fase futura, no implementada.
- **Próximo paso verificable:** comprobar GitHub Actions para `ce3a7893`; corregir cualquier FAIL. Después ejecutar recorrido real con datos ficticios, validar la cuota con Redis real y preparar credenciales privadas de OpenAI bajo límites seguros, sin exponer secretos.
- **Métricas separadas:** desarrollo funcional histórico **75 % estimado** (sin revalidación); cierre V5 **21/100** (sin incremento). Matriz: runtime 10, UX 10, IA 15, flujo docente 15, materiales 10, evaluación 10, director 10, persistencia/exportación 8, CI/CD 7, seguridad/piloto 5. No asignar puntos por commits o por despliegue READY.
