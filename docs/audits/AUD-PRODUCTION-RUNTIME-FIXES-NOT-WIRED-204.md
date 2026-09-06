# AUD-PRODUCTION-RUNTIME-FIXES-NOT-WIRED-204 — Correcciones desplegadas como archivos pero no activas en el runtime canónico

## Especificaciones obligatorias aplicadas
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

## Prueba
**ID:** AUD-PRODUCTION-RUNTIME-FIXES-NOT-WIRED-204

**Módulo:** Integración release/runtime · Vercel producción · carga efectiva de guardas y correcciones.

**Entrada:** abrir la URL canónica `https://docente-digital.vercel.app/`, inspeccionar el HTML realmente servido y comparar su grafo de scripts con las capas correctivas presentes en `main` y desplegadas como assets estáticos.

**Resultado esperado:** toda corrección que se declare activa en producción debe estar efectivamente cargada —directa o transitivamente— por el runtime canónico y debe existir una prueba que demuestre que su comportamiento sustituyó o protegió al comportamiento legado.

**Resultado obtenido:** la página canónica responde HTTP 200 y el deployment actual está READY, pero el HTML servido carga únicamente este conjunto principal:

- `storage-recovery-v26.js`
- `storage-access-guard-v71.js`
- `app.js`
- `initial-curriculum-guard-v72.js`
- `enhancements.js`
- `format-v2.js`
- `schedule-v3.js`
- `strategies-v4.js`
- `resources-v5.js`
- `schedule-prompt-v6.js`

No referencia, entre otras capas presentes en el repositorio, a `material-integrity-v65.js` ni `director-creativity-v16.js`. Ambas existen en el deployment y pueden responder HTTP 200 cuando se solicita su URL directamente, pero **asset disponible no equivale a código ejecutado**.

En particular:

1. `material-integrity-v65.js` contiene la guarda que reemplaza `window.generateMaterial`, bloquea la generación demostrativa y cambia la acción visible a `Revisar solicitud`. Al no cargarse desde la página canónica, queda expuesto el `generateMaterial()` legado de `app.js`, que contiene texto fijo sobre agua y una rama con frase quechua demostrativa.
2. `director-creativity-v16.js` contiene la corrección v17 del hallazgo 203 (`expert-only` y nota breve). Al no cargarse desde la página canónica, esa corrección no puede considerarse activa únicamente porque el archivo exista y responda 200.
3. `planning-archive-simplicity-v56.js` implementa una mejora V4 del archivo de unidades/proyectos, pero tampoco está en el grafo directo de scripts del HTML canónico.

Se inspeccionó además `enhancements.js`, uno de los scripts efectivamente cargados, sin encontrar referencia a `material-integrity-v65.js` ni un cargador dinámico explícito de ese archivo. No existe evidencia suficiente para afirmar que las capas ausentes se incorporen transitivamente.

## Resultado
**NO PASA.**

## Clasificación
- Deployment/hosting básico: **FUNCIONAL** (READY + HTTP 200).
- Integración del runtime efectivo: **ROTA** para correcciones no cableadas.
- Verificación histórica basada solo en `asset HTTP 200`: **INSUFICIENTE / PARCIALMENTE FUNCIONAL**.
- Materiales seguros en runtime canónico: **ROTA** mientras permanezca activo el comportamiento legado.
- Corrección 203 en runtime canónico: **NO DEMOSTRADA / no activa por carga directa**.

## Severidad
**S1 CRÍTICO — bloqueante V5.**

La severidad se eleva a S1 porque el defecto de integración deja activo comportamiento pedagógico/lingüístico incorrecto conocido y permite falsos positivos de auditoría: un archivo corregido puede desplegarse sin ejecutarse nunca. V3 prohíbe aprobar porque una función responde o porque un artefacto existe; V5 exige que las funciones críticas estén realmente probadas antes de publicar.

## Causa raíz
El proyecto mantiene numerosas capas de corrección/guardas como archivos JS separados, mientras `index.html` conserva una lista manual y limitada de scripts. No existe evidencia de un manifiesto único de runtime, bundling/dependency graph o gate de CI que compruebe que todas las capas marcadas como requeridas para producción se cargan y ejecutan en el navegador canónico.

Además, varias auditorías anteriores verificaron disponibilidad del asset con HTTP 200 como parte de su evidencia posterior. Esa comprobación demuestra que el archivo fue desplegado, pero no demuestra que el navegador lo cargó ni que su override quedó activo.

## Acción correctiva
No se agregan indiscriminadamente todos los scripts a `index.html`, porque el orden de carga, overrides, dependencias y efectos laterales puede provocar regresiones o pantallas blancas.

Corrección requerida:
1. definir un **manifiesto único y ordenado de runtime** o un bundle explícito;
2. clasificar cada capa como requerida, opcional, experimental o solo auditoría;
3. resolver dependencias y orden de overrides;
4. añadir un smoke test de navegador que cargue la URL canónica y verifique sentinelas/efectos reales, no solo existencia de archivos;
5. incluir como mínimo aserciones de que las guardas críticas de Materiales, Director, persistencia, currículo, exportación y prelaunch están efectivamente ejecutadas;
6. fallar CI/publicación cuando un archivo considerado corrección de producción exista pero no esté conectado al grafo de ejecución;
7. retestar los hallazgos previos cuya evidencia posterior se apoyó solo en `asset HTTP 200`.

## Evidencia técnica
- `main` al iniciar esta prueba: `63fce0787aa4a18d2095134cad716c1a57fdbbfb`.
- Deployment asociado antes de registrar el hallazgo: `dpl_ChvpjLEJfezMQN1GjPMyUtNM4R8A`, `READY`, `production`, mismo SHA.
- URL canónica: HTTP 200.
- `material-integrity-v65.js`: HTTP 200 como asset, pero ausente de los `<script src>` del HTML canónico.
- Runtime errors en la última hora: 0. Esto confirma que es un **error silencioso de integración**, no una caída del servicio.

## Normativa externa
Este hallazgo no requiere declarar vigente ninguna norma MINEDU/UGEL/legal externa. Se fundamenta en V2–V5, Núcleo IA y evidencia técnica actual del repositorio/runtime. Por tanto, no se formula ninguna afirmación de vigencia normativa externa sin verificación oficial.

## Riesgo de regresión
**ALTO** si se corrige agregando scripts sin ordenar dependencias. **MEDIO/BAJO** si se introduce manifiesto/bundle con pruebas de navegador y despliegue progresivo.

## Impacto en indicadores
- **IUD:** afectado cualitativamente porque el usuario puede recibir superficies distintas de las correcciones auditadas.
- **ICGD:** afectado por pérdida de confianza en la correspondencia repositorio → runtime.
- **IFR:** afectado: un deployment READY no demuestra integridad funcional.
- **ISU:** no se recalcula; algunas simplificaciones V4 pueden no estar activas.
- **Prelaunch:** **BLOQUEADO** por S1 y por falta de evidencia E2E del runtime efectivo.

No se calculan puntajes definitivos.

## Pendientes reales
- corregir el grafo de carga efectivo;
- retestar navegador real/canónico;
- retestar específicamente Materiales EIB, Director V4, planificación/archivo y demás capas ausentes;
- mantener pendientes las pruebas físicas de móvil, Word/PDF/impresión, restore real, OWASP/aislamiento, 100 generaciones, año completo y pilotos.

## Conclusión
**DocenteDigital NO está aprobada para lanzamiento V1.0.** Un archivo presente en GitHub o servido con HTTP 200 no puede volver a contarse como corrección productiva hasta demostrar que el runtime canónico lo carga, lo ejecuta y produce el comportamiento esperado.