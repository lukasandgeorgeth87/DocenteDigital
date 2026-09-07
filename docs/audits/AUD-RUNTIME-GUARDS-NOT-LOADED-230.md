# AUD-RUNTIME-GUARDS-NOT-LOADED-230

## Alcance
Auditoría V4/V5 + NÚCLEO IA sobre integración real de módulos presentes en el repositorio y carga efectiva en producción.

## Hallazgo principal
La producción carga actualmente estos scripts: `storage-recovery-v26.js`, `storage-access-guard-v71.js`, `app.js`, `initial-curriculum-guard-v72.js`, `enhancements.js`, `format-v2.js`, `schedule-v3.js`, `strategies-v4.js`, `resources-v5.js` y `schedule-prompt-v6.js`.

Sin embargo, el repositorio contiene módulos relevantes que no aparecen en la cadena de carga de `index.html`, entre ellos `context-semantic-v20.js` y `curriculum-safety-v27.js`. Por tanto, su mera existencia en GitHub no constituye evidencia de que sus guardas o análisis estén activos en el runtime productivo.

## Caso AUD-RUNTIME-230-A
**Entrada:** abrir producción y verificar cadena de scripts efectiva.

**Esperado:** todo módulo presentado como protección activa del flujo V4/V5 debe estar integrado en el runtime o explícitamente marcado como histórico/no activo.

**Obtenido:** `context-semantic-v20.js` no se carga. Ese archivo define `ddAnalyzeContext`, `ddContextKeywords` y persistencia de `contextAnalysis`, pero producción continúa usando la lógica de `app.js` basada en `proposeUnitTitle()`, `expandSituation()` y `proposeProduct()`.

**Resultado:** NO PASA.

**Severidad:** S1 CRÍTICO, porque la comprensión semántica es un requisito nuclear y la presencia de un módulo no cargado puede producir una falsa impresión de cobertura.

**Clasificación:** módulo existente = PARCIAL; integración runtime = INEXISTENTE; comprensión semántica real = NO DEMOSTRADA.

## Caso AUD-RUNTIME-230-B
**Entrada:** verificar protección curricular efectiva en producción.

**Esperado:** si no existe matriz curricular oficial literal/versionada/conectada, el runtime debe impedir presentar contenido generado como currículo oficial o mostrar la guarda correspondiente.

**Obtenido:** `curriculum-safety-v27.js` no aparece en la cadena de scripts productiva. El archivo contiene una guarda que fuerza `officialMatrixReady:false`, renombra referencias provisionales y agrega advertencias en pantalla/Word, pero esa guarda no está activa por no cargarse desde `index.html`.

**Resultado:** NO PASA.

**Severidad:** S1 CRÍTICO y bloqueante V5 mientras existan referencias curriculares generadas sin matriz oficial verificablemente conectada.

**Clasificación:** archivo de guarda = PARCIAL; integración = INEXISTENTE; protección curricular productiva atribuible a este módulo = INEXISTENTE.

## Relación con documentos rectores
`NUCLEO_IA_DOCENTEDIGITAL.md` exige Comprender → estructurar significado → verificar contexto y normativa → proponer → auditar coherencia. También exige IA semántica + guardas locales y que una fuente oficial prevalezca sobre la IA.

`AUDITORIA_PRELANZAMIENTO_V5.md` exige anti-alucinación, exactitud pedagógica/normativa y establece como bloqueante normativa o competencias inventadas.

## Acción
No agregar estos `<script>` a producción automáticamente sin prueba de integración: ambos módulos interceptan funciones globales y pueden cambiar salidas, persistencia y exportaciones. Primero debe definirse un manifiesto de módulos activos, pruebas de arranque y tests de contrato. Cada guarda crítica debe demostrar que se cargó y ejecutó; un archivo huérfano debe quedar marcado como histórico o eliminarse tras revisión.

Retest requerido después de cualquier integración: carga sin errores, Unidad/Proyecto, Sesión, DOCX, EIB, currículo preliminar/oficial, persistencia y regresión móvil.
