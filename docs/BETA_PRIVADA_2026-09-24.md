# DocenteDigital — Beta Privada 24/09/2026

## Objetivo

Validar con docentes y directores reales el núcleo útil de DocenteDigital sin presentar como terminadas funciones que todavía no superan pruebas de producción.

## Clasificación de esta versión

**BETA PRIVADA DE VALIDACIÓN.** No equivale a lanzamiento público ni a SaaS multiusuario terminado.

## Alcance habilitado

- Configuración de nivel, tipo de IE, grados y áreas.
- Perfil lingüístico EIB/monolingüe con confirmación explícita.
- Modo Fácil / Experto.
- Creación de Unidad/Proyecto con elección explícita de situación significativa y producto.
- Preservación de la intención original del docente.
- Creación de sesiones vinculadas a una Unidad/Proyecto real.
- Diferenciación multigrado en los flujos que ya la implementan.
- Exportación DOCX mediante OOXML real.
- Persistencia local y recuperación preventiva.
- Respaldo JSON descargable/restaurable en la Beta.
- Navegación adaptable a escritorio y móvil.

## Funciones que NO deben presentarse como terminadas

- IA generativa remota real.
- Autenticación y backend multiusuario.
- Aislamiento real entre instituciones en producción.
- Evaluación completa y Registro Auxiliar E2E.
- Programación anual E2E.
- Generación contextualizada completa de materiales.
- Módulo Director E2E completo.
- PDF e impresión validados físicamente.
- Integraciones externas con SIAGIE, Google Drive u otros sistemas.

Estas superficies deben permanecer deshabilitadas, marcadas como **Próximamente**, o claramente identificadas como prototipo.

## Principios no negociables

1. No inventar competencias, capacidades, normas, resultados institucionales ni datos del contexto.
2. No añadir Ccotataqui u otro territorio si el usuario no lo proporcionó.
3. No generar sesiones a partir de una unidad de demostración cuando no existe una unidad real.
4. No presentar HTML renombrado como Word; la exportación debe ser DOCX OOXML válido.
5. No convertir una sugerencia de IA en valoración final sin confirmación docente.
6. No rebajar el Gate de Producción para cumplir la fecha de la Beta.
7. Si un módulo crítico no carga, fallar de forma visible y segura.

## Evidencia técnica existente

- `Prelaunch Smoke` en GitHub Actions valida sintaxis, assets, módulos críticos y regresiones conocidas.
- `Beta E2E Browser Gate` usa Chromium real para probar el flujo de Beta.
- `tests/semantic-golden.mjs` prueba generalización semántica en varios temas.
- `storage-recovery-v26.js` protege recuperación y restablecimientos accidentales.
- `docx-export-v29.js` implementa DOCX OOXML real y autoprueba.
- `prelaunch-evidence-gate-v50.js` mantiene bloqueada la aprobación de producción hasta existir evidencia real suficiente.

## Plan de 7 días

### Día 1 — Gate técnico
- Dejar `Prelaunch Smoke` y `Beta E2E Browser Gate` en verde.
- Resolver fallos del flujo Unidad → Sesión → DOCX → recuperación.

### Día 2 — Semántica y CNEB
- Ejecutar batería golden: primavera, abejas, biohuerto, agua, familia, contaminación, lectura, alimentación, tecnología y hormigas.
- Revisar inventos, repeticiones y coherencia.

### Día 3 — Móvil y continuidad
- Probar celular real de gama media/económica.
- Probar recarga, cierre accidental, almacenamiento y restauración JSON.

### Día 4 — Documentos
- Abrir DOCX en Word, Google Docs, WPS y LibreOffice.
- Verificar tildes, ñ, tablas, márgenes y saltos.

### Día 5 — Piloto interno
- 2 docentes + 1 director.
- Registrar tiempo, errores, retrabajo y confianza.

### Día 6 — Correcciones y congelamiento
- Corregir solo S0/S1/S2 relevantes para la Beta.
- Congelar nuevas funciones.

### Día 7 — Beta privada
- 5 docentes + 2 directores + al menos 2 contextos institucionales.
- Mantener aviso visible de Beta Privada.
- Recolectar incidencias y decidir siguiente versión.

## Criterio de salida de la Beta

La Beta puede abrirse si:

- CI está verde.
- No existe pérdida reproducible de trabajo en los flujos habilitados.
- Unidad → Sesión conserva trazabilidad.
- DOCX se descarga como archivo OOXML válido.
- Funciones incompletas no aparecen como terminadas.
- El usuario puede descargar un respaldo de su trabajo.
- El alcance Beta está claramente visible.

## Criterio de Producción

La producción pública continúa bloqueada hasta cerrar autenticación/autorización multiusuario, aislamiento entre IE, pruebas físicas de exportación/móvil, recuperación externa, piloto real, continuidad ante caída de IA y los demás requisitos definidos por `prelaunch-evidence-gate-v50.js`.
