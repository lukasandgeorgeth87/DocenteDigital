# DocenteDigital — estado canónico para continuidad entre conversaciones

**Actualización:** 2026-10-24, 23:16 (America/Lima; 2026-10-25 UTC).  
**Repositorio:** https://github.com/lukasandgeorgeth87/DocenteDigital  
**Rama de desarrollo/beta:** `audit/v5-continuity-offline-diagnostic`  
**Último commit de código/CI previo a esta bitácora:** `0db40f0a7518b2d88034241087559f1eb6384edc`.  
**Versión exacta más reciente:** consultar el HEAD de esta rama; el propio commit que actualiza esta bitácora es posterior al SHA citado.

> Este documento es la fuente de continuidad para recuperar DocenteDigital desde otro chat. Verificar siempre GitHub, CI y Vercel en tiempo real antes de afirmar que una función está terminada. No confundir el HEAD de la rama con el despliegue público.

## Decisiones de producto (vigentes)

1. OpenAI API es el motor principal para generar y mejorar contenido pedagógico; plantillas y generación local son respaldo, con origen distinguible. **GPT real todavía no validado**.
2. Prioridad: beta privada comprobable en navegador, sin fusionar a `main` ni publicar producción sin puertas de seguridad y pruebas.
3. Futuro: versión Windows con almacenamiento local y respaldo, después de estabilizar la web. GPT remoto no funcionará offline sin alternativa local.
4. Enfoque Perú/CNEB/MINEDU, multigrado y EIB con contexto, diferenciación y sin inventar estándares, datos o fuentes oficiales.

## Evidencia de CI y Vercel

- **CI confirmado PASS:** GitHub Actions `Beta E2E Browser Gate` para commit `e1a0de32b12518005b09837f2992a6c065f72f21`, run https://github.com/lukasandgeorgeth87/DocenteDigital/actions/runs/40158344057. Pasaron las etapas de onboarding móvil en tres niveles, E2E beta, regresiones semánticas, privacidad de red, continuidad/recuperación/offline, estructura DOCX y accesibilidad. Es **prueba automatizada con navegador y servidor local en CI**, no piloto docente real.
- **CI nuevo pendiente al redactar:** https://github.com/lukasandgeorgeth87/DocenteDigital/actions/runs/40161251453, commit `0db40f0a7518b2d88034241087559f1eb6384edc`; agrega la puerta de contrato de API GPT simulada. No atribuirle PASS antes de concluir.
- **Preview Vercel verificada READY:** commit `e1a0de32...`, https://docente-digital-7xdp3zo1w-jorgeluispalma87-7403.vercel.app ; HTTP 200 en `/` y `/api/ai-status` comprobados. En esa preview, `configured:false`: falta `OPENAI_API_KEY` en ese entorno; no hubo generación real de IA.
- **Producción pública (rama main):** https://docente-digital.vercel.app ; `/` HTTP 200, pero `/api/ai-status` HTTP 404 en verificación anterior. No confundir producción con preview de beta.
- **Rama frente a main:** antes de nuevos cambios, 207 commits por delante, 0 por detrás; no fusionar a ciegas.

## Cambios recientes con evidencia

| SHA | Archivo(s) | Cambio y estado |
|---|---|---|
| `e1a0de32` | `tests/continuity-resilience.mjs` | Inyecta estado corrupto antes del arranque para evitar carrera de navegación. **CI PASS** run 40158344057. |
| `a88b4630` | `api/ai.js` | Corrige IDs predeterminados de modelos a `gpt-6-luna` (rutina) y `gpt-6.1-sol` (complejo), configurables por entorno. No se ha probado aún acceso real a esos modelos con credenciales. |
| `b3598d93` | `api/ai-status.js` | `text` e `image` no anuncian disponibilidad sin clave; `verified:false` distingue configuración de prueba real. |
| `5218f5a6` | `tests/ai-contract.mjs` | Pruebas deterministas del contrato de endpoints sin claves reales ni consumo de tokens: estado, validación, privacidad del contexto, selección de modelo y errores. |
| `0db40f0a` | `.github/workflows/beta-e2e.yml` | Ejecuta la nueva prueba de contrato GPT en CI. **Resultado pendiente** en el momento de escritura. |

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

1. Consultar run 40161251453; corregir fallos de la nueva prueba si los hay.
2. Verificar nuevo preview Vercel READY, `/` HTTP 200 y `/api/ai-status` HTTP 200; el estado debe reflejar `configured:false` y `text:false` sin clave.
3. Añadir control de acceso/cuota real al endpoint antes de activar API pagada; validar seguridad.
4. Configurar credencial de OpenAI en entorno privado, comprobar conexión real con la herramienta de la app, probar generación de títulos/situaciones/materiales y respaldo local ante fallo.
5. Completar recorrido real docente y director, Word/PDF y restauración de datos. Documentar PASS/FAIL con entradas y salidas.
6. Mantener actualizada esta bitácora **solo cuando haya cambios materiales nuevos** y registrar los SHAs y URLs de evidencia.
