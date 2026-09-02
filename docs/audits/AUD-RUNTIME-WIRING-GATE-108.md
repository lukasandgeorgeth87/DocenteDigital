# AUD-RUNTIME-WIRING-GATE-108

## Alcance
Auditoría técnica V3/V5 de trazabilidad de módulos críticos hacia el runtime de producción. No aplica ni declara vigencia normativa MINEDU; no sustituye pruebas de navegador, móvil físico, backend, IA real, seguridad ni usuarios reales.

## Prueba
**ID:** AUD-PRELAUNCH-WIRING-GATE-108  
**Módulo:** CI / Prelaunch Smoke / integración de runtime  
**Entrada:** validación de que `title-context-v38.js`, `significant-situation-core-v53.js`, `institution-master-v46.js`, `runtime-audit-v23.js` y `simplicity-audit-v49.js` estén conectados al runtime de producción.  
**Esperado:** considerar conectado un módulo cuando sea alcanzable desde `index.html` directamente o mediante un cargador de módulos que el propio `index.html` ejecute.  
**Obtenido antes:** el gate solo inspeccionaba `index.html` e `initial-curriculum-guard-v72.js`, por lo que declaró los cinco módulos como no conectados e hizo fallar CI, aunque `index.html` carga `schedule-prompt-v6.js` y este contiene el cargador estable que incluye los cinco módulos.  
**Estado inicial:** NO PASA  
**Severidad:** S2  
**Clasificación:** ROTA (prueba de auditoría), mientras la conexión estática del runtime era FUNCIONAL.

## Causa raíz
La prueba de wiring modelaba una cadena de carga incompleta. Omitía `schedule-prompt-v6.js`, que es una entrada real del HTML de producción y contiene `__ddStableModuleLoaderV49` con carga secuencial de los módulos auditados.

## Corrección
Se amplió `.github/workflows/prelaunch-smoke.yml` para inspeccionar:

- `index.html`
- `initial-curriculum-guard-v72.js`
- `schedule-prompt-v6.js`

No se modificó lógica pedagógica, datos institucionales, roles, persistencia ni documentos.

**Commit funcional:** `8d905aa15e4824a276e9d3ce9638f3ea8837a226`

## Retest
- GitHub Actions `Prelaunch Smoke` run `33687417873`: **success**.
- Vercel deployment `dpl_5EN2oFff8eaMyvgLfacerbcvx3xS`: **READY**, target **production**.
- `https://docente-digital.vercel.app/`: **HTTP 200**.
- Producción sigue cargando `schedule-prompt-v6.js` desde `index.html`.

## Rectificación de AUD-RUNTIME-WIRING-107
La conclusión de que los cinco módulos estaban desconectados fue un **falso positivo del gate**. Se retira ese S1 como bloqueante de wiring estático. Los módulos están conectados mediante el cargador estable.

Esto **no demuestra por sí solo** que cada módulo funcione correctamente bajo todas las interacciones del navegador. Las pruebas funcionales, físicas y V5 correspondientes continúan separadas y pendientes cuando no exista evidencia real.

## Riesgo de regresión
Bajo. El cambio solo amplía las fuentes que el gate examina para reconstruir la ruta real de carga. Un módulo sigue fallando el gate si no existe o no aparece en ninguno de los entrypoints/loaders auditados.

## Impacto en indicadores
No se recalculan IUD, ICGD, IFR, ISU ni Prelaunch Score. La corrección elimina evidencia falsa y mejora la integridad del gate; no acredita pruebas físicas ni funcionalidad E2E.

## Bloqueantes V5 que permanecen
Continúan pendientes, según evidencia disponible, las pruebas reales esenciales que correspondan: móvil/dispositivos físicos, Word/PDF/impresión reales, usuarios piloto, backend y aislamiento multiusuario, autenticación/autorización, restore real, OWASP ASVS, IA semántica real, 100 generaciones, año escolar completo, concurrencia y pilotos escalonados.