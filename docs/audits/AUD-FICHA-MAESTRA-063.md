# AUD-FICHA-MAESTRA-063 — Ficha Maestra institucional

## Alcance
Auditoría conforme a V2, V3, V4, V5 y NÚCLEO_IA_DOCENTEDIGITAL.

## Prueba
- **ID:** AUD-FICHA-MAESTRA-063
- **Módulo:** Perfil IE / Ficha Maestra / reutilización / trazabilidad Docente-Director
- **Entrada:** Configurar una IE y luego intentar reutilizar sus datos institucionales en planificación y futura Carpeta Director.
- **Resultado esperado:** Una Ficha Maestra única debe conservar, como mínimo conforme a V2, los datos institucionales necesarios (identificación IE, códigos, UGEL/DRE, ubicación, ámbito, modalidad/niveles/turnos/gestión, organización, EIB/lenguas, director/docentes, grados/secciones/estudiantes, calendarios, recursos y contexto) y reutilizarlos sin volver a pedirlos.
- **Resultado obtenido:** El estado base de `app.js` conserva únicamente modo, nivel, tipo de IE, grados, áreas, idioma/variedad, unidades, unidad activa y última sesión. La pantalla Configuración de producción permite editar Nivel/Tipo/Grados/Áreas y muestra un resumen equivalente. No existe una Ficha Maestra institucional funcional ni una estructura equivalente que cubra los campos exigidos.
- **Estado:** NO PASA
- **Clasificación:** INEXISTENTE
- **Severidad:** S2 — ALTO

## Evidencia
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`: exige una sola base institucional y una Ficha Maestra reutilizable entre Carpeta Docente y Carpeta Director.
- `app.js`: estado base sin estructura de ficha institucional completa.
- `index.html` / producción: Configuración solo ofrece edición de Nivel/Tipo/Grados/Áreas y resumen pedagógico básico.

## Causa raíz
El prototipo fue construido primero alrededor de la configuración pedagógica mínima y generación de unidades/sesiones. La entidad institucional maestra definida por V2/V3 todavía no fue modelada como fuente única de verdad.

## Acción correctiva requerida
No aplicar un parche superficial. Diseñar una entidad `institutionProfile` (o equivalente) versionada, con procedencia de campos, validación y separación entre datos actuales e históricos. Implementar edición, persistencia, reutilización y migración compatible del estado existente. Conectar luego Docente y Director a esa fuente única.

## Pruebas posteriores obligatorias
1. Crear ficha desde cero y reabrirla tras recarga/cierre.
2. Cambiar un dato maestro y confirmar que documentos nuevos usan el dato actual sin modificar históricos emitidos.
3. EIB → monolingüe y viceversa sin herencias incompatibles.
4. Unidocente/multigrado/polidocente.
5. Reutilización automática en Unidad, Sesión y futuros Oficio/RD/Informe/PAT.
6. Campos vacíos, caracteres quechua y nombres extensos.
7. Recuperación/papelera cuando exista backend.

## Riesgo de regresión
ALTO si se intenta añadir campos directamente al estado existente sin esquema/migración: puede romper configuración, unidades guardadas o históricos. Por ello no se realizó corrección funcional automática en esta auditoría.

## Impacto en indicadores
- **IUD:** negativo; aumenta reescritura de datos.
- **ICGD:** negativo; impide coherencia documental institucional.
- **IFR:** negativo; la reutilización y recuperación no cumplen la fuente única.
- **ISU:** no calcular definitivo; la ausencia obliga a futura repetición de datos.
- **Prelaunch:** bloqueante funcional del alcance V1 Director y afecta el recorrido Docente/Director E2E.

## Gate V5
PENDIENTE. DocenteDigital no debe declararse lista para lanzamiento mientras la Ficha Maestra y las demás pruebas reales esenciales de V5 no estén implementadas y demostradas.
