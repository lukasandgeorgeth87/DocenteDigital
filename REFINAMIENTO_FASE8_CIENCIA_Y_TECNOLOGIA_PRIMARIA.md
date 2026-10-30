# Docente Digital — Fase 8: Ciencia y Tecnología de Primaria

**Fecha de elaboración:** 29 de octubre de 2026.  
**Versión base:** Fase 7 de refinamiento, conservada como copia independiente.  
**Fuente:** *Programa curricular de Educación Primaria*, Ministerio de Educación del Perú, documento de 396 páginas aportado por el usuario. SHA-256 verificado: `34009689b6e3fe2194ec61c1675af13407528ae5e0f34f4d484007efd9e832f7`.

## Alcance

Exclusivamente **Ciencia y Tecnología, 1.º–6.º de Primaria**, con agrupación III (1.º–2.º), IV (3.º–4.º), V (5.º–6.º). La aplicación mantiene sin modificaciones intencionales la lógica curricular de Inicial, Secundaria, Comunicación y Matemática. No se modificaron GitHub, Supabase ni Vercel.

## Competencias y capacidades de referencia

1. **Indaga mediante métodos científicos para construir sus conocimientos:** cinco capacidades: problematiza, diseña estrategias, genera/registra datos, analiza datos, evalúa y comunica.
2. **Explica el mundo físico basándose en conocimientos sobre los seres vivos, materia y energía, biodiversidad, Tierra y universo:** dos capacidades: comprende/usa conocimientos científicos y evalúa implicancias.
3. **Diseña y construye soluciones tecnológicas para resolver problemas de su entorno:** cuatro capacidades: determina, diseña, implementa/valida, evalúa/comunica.

Estos nombres y capacidades ya figuraban en el núcleo curricular; en esta fase se corrigió cómo se escoge la competencia principal y se traduce a una sesión de aprendizaje.

## Referencias comprobadas en el PDF aportado

Numeración del **visor PDF** (base 1); la paginación **impresa** es dos unidades menor.

| Competencia | III (1.º–2.º) | IV (3.º–4.º) | V (5.º–6.º) |
| --- | --- | --- | --- |
| Indaga | Estándar 278; desempeños 278–279 | Estándar 280; desempeños 280–281 | Estándar 282; desempeños 282–283 |
| Explica | Estándar 288; desempeños 288–289 | Estándar 290; desempeños 290–291 | Estándar 292; desempeños 292–293 |
| Diseña y construye | Estándar 298; desempeños 298–299 | Estándar 300; desempeños 300–301 | Estándar 302; desempeños 302–304 |

**Advertencia curricular:** estas referencias ubican tablas por ciclo y columnas de grado. **No son una transcripción ni una asignación automática de desempeños individuales.** El docente todavía debe seleccionar, contrastar y contextualizar el desempeño pertinente para la actividad.

## Correcciones funcionales

- `official-curriculum-v1.js`: `scienceModeFromTitle` distingue una **indagación** («Indagamos cómo cambia la masa con levadura»), una **explicación científica** («Explicamos cómo actúa la levadura») y un **diseño tecnológico** («Diseñamos un filtro de agua»). Si el título no permite decidir, devuelve `indefinido` y la sesión pide confirmación en lugar de fingir una elección curricular certificada. La lógica histórica de Inicial y Secundaria no se tocó.
- `primary-science-source-pages-v8.js` (nuevo): índice de páginas para las 18 combinaciones de 3 competencias × 6 grados, con fuente y comprobación docente explícitas.
- `session-learning-core-v54.js`: propósito, criterio y evidencia específicos para cada una de las tres competencias **solo en Primaria**, sin forzar que todas las sesiones sean experimentos.
- `session-teaching-sequence-v3.js`: mediación y desarrollo específicos (pregunta/plan/datos/conclusión; conocimientos/evidencias/implicancias; necesidad/diseño/prototipo/pruebas); tareas, criterios y evidencias diferenciados por grado; tabla de fuente en pantalla y en HTML de exportación Word.
- `schedule-prompt-v6.js`: carga el índice de Ciencia y Tecnología antes del generador de sesiones.
- `tests/primary-science-curriculum.mjs` (nuevo): verifica nombres/capacidades, páginas, títulos, selección multigrado, advertencias, HTML de sesión y modo Word.

## Verificaciones

- **18/18 pruebas offline de Node aprobadas**, incluidas las de Comunicación, Matemática, historial del docente, compatibilidad multigrado, contrato de IA y seguridad XML DOCX.
- Prueba específica: **3 competencias, 11 capacidades, 18 referencias grado/competencia, 10 títulos y 3 sesiones de la capa real**, con grados 1.º, 3.º y 6.º elegidos para el ejemplo. También comprueba que las actividades indefinidas no simulen una competencia confirmada.
- Integridad del paquete ZIP comprobada. Ningún archivo de la Fase 7 fue alterado.

## Pendiente antes de afirmar calidad curricular final

- Contrastar en el documento oficial **cada desempeño literal** del grado con las actividades y criterios que efectivamente propone la app.
- Validar didáctica y seguridad de actividades experimentales en un piloto real de Primaria.
- Abrir documentos de ejemplo en Word de escritorio y móvil: aquí se probó **HTML de salida para Word y regresión XML**, no una impresión física.
- Ejecutar E2E de navegador y pruebas en dispositivo real; Playwright no está instalado en este entorno.
- Integrar esta copia con el repositorio cuando el usuario lo autorice; no hay cambios desplegados automáticamente.

**Siguiente área sugerida:** Personal Social de Primaria, o consolidar pruebas pedagógicas transversales antes de continuar, según prioridad comercial.

Este ZIP corresponde a **código fuente**, no a un instalador `.exe`/`.apk`.
