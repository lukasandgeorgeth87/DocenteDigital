# AUD-SCHEDULE-DOCX-CSP-177 — Importación de horario Word bloqueada por CSP

## Alcance
Auditoría V2/V3/V4/V5 + Núcleo IA sobre **Mi planificación → Horario de clases → Subir horario en Word (.docx)**. No se aplica ni se declara normativa educativa nueva en este hallazgo.

## Prueba
- **ID:** AUD-SCHEDULE-DOCX-CSP-177
- **Módulo:** Docente → Mi planificación → Horario de clases → importación DOCX
- **Persona:** docente principiante/experimentado + QA + seguridad
- **Entrada:** seleccionar un archivo `.docx` en `Subir horario en Word (.docx)` con `window.mammoth` no precargado.
- **Resultado esperado:** la app debe leer el DOCX o, si la capacidad no está disponible, no presentar la acción como funcional. La política CSP de producción y las dependencias del importador deben ser compatibles.
- **Resultado obtenido:** `schedule-v3.js` implementa `loadMammoth()` creando dinámicamente `<script src="https://unpkg.com/mammoth@1.8.0/mammoth.browser.min.js">`. Sin embargo, la respuesta HTTP real de producción publica `Content-Security-Policy: ... script-src 'self' 'unsafe-inline' ...`, por lo que scripts de `https://unpkg.com` no están autorizados. El HTML de producción tampoco precarga Mammoth desde `'self'`. En estas condiciones, la importación automática no puede completar la carga de su dependencia; el `catch` termina ofreciendo edición manual.
- **Evidencia:** `schedule-v3.js` actual; respuesta HTTP 200 de `https://docente-digital.vercel.app/` y de `/schedule-v3.js`, ambas con CSP `script-src 'self' 'unsafe-inline'`.
- **PASA/NO PASA:** **NO PASA**
- **Clasificación:** **ROTA** para la importación automática DOCX; la edición manual del horario permanece disponible.
- **Severidad:** **S2 ALTO**. No es S1 porque el usuario todavía puede configurar el horario manualmente y la carga Word es una ayuda opcional, pero la interfaz anuncia una capacidad que la configuración de seguridad de producción impide ejecutar.

## Causa raíz
Dependencia de runtime remota (`unpkg.com`) incompatible con la política CSP endurecida del sitio. La función se diseñó antes o al margen de la política de `script-src 'self'`.

## Acción correctiva recomendada
No debilitar CSP a ciegas para permitir un CDN de terceros. Preferir una de estas rutas, con pruebas de regresión y revisión de licencia/supply-chain:
1. empaquetar y servir localmente una versión fijada y verificada del parser DOCX bajo el mismo origen; o
2. sustituir la dependencia por un parser local/controlado; o
3. hasta implementar una de las anteriores, marcar la importación Word como **En desarrollo** y mantener únicamente el editor manual, evitando una función rota visible.

Después debe probarse con DOCX reales: tabla simple, celdas combinadas, caracteres especiales/quechua, horarios incompletos, archivo corrupto, móvil y escritorio.

## Corrección directa en esta pasada
**No aplicada.** Permitir `unpkg.com` en CSP sería un cambio de seguridad/supply-chain no justificable como parche automático. Incorporar una librería de terceros al repositorio requiere validar versión, integridad, licencia y regresiones. Conforme V5, se mantiene el hallazgo abierto en vez de simular una corrección.

## Riesgo de regresión
Alto si se relaja CSP. Medio si se empaqueta una dependencia sin pruebas. Bajo si temporalmente se deshabilita la importación y se conserva el editor manual.

## Impacto cualitativo
- **IUD:** afecta la facilidad de configuración inicial del horario.
- **ICGD:** afecta la reutilización automática de temporalización cuando el docente depende de un DOCX existente.
- **IFR:** reduce confiabilidad funcional por discrepancia interfaz/runtime.
- **ISU:** no se calcula sin usuarios reales.
- **Prelaunch:** agrega un pendiente técnico; no sustituye los bloqueantes S0/S1 ya abiertos.

## Gate V5
DocenteDigital **NO está aprobada para V1.0**. Este S2 se suma a los bloqueantes y pendientes ya existentes; no se calculan ISU/IFR/Prelaunch Score definitivos.