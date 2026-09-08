# AUD-ACADEMIC-YEAR-CANONICAL-MISSING-245 — Falta año académico canónico y trazable

## Especificaciones aplicadas
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`: Ficha Maestra única, calendario escolar reutilizable y documentos Docente/Director coherentes.
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`: la fuente única de verdad incluye explícitamente el **año**; los históricos deben conservar los datos vigentes al momento de emisión; los correlativos se controlan por tipo y año.
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`: configuración una sola vez y reutilización automática.
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`: exige simular un año completo marzo–diciembre, guardar/recuperar documentos e impedir que módulos aislados pierdan contexto.
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`: el perfil semántico debe heredarse entre Programación → Unidad/Proyecto → Sesiones → Materiales → Evaluación → Registro.

## ID de prueba
**AUD-YEAR-245-A**

## Módulo
Ficha Maestra / Programación anual / trazabilidad documental Docente y Director.

## Entrada
Configurar la IE y preparar documentos durante un año escolar; luego conservarlos y pasar al siguiente periodo lectivo sin modificar históricos.

## Resultado esperado
Debe existir un dato canónico estructurado y reutilizable de año académico/periodo lectivo —por ejemplo `academicYear` o equivalente— separado del texto descriptivo del calendario. Las unidades, sesiones, evaluaciones y documentos directivos nuevos deben poder heredar ese dato como snapshot/procedencia; al cambiar de año, los documentos históricos deben conservar su periodo original.

## Resultado obtenido
La implementación disponible no define un campo canónico `academicYear`, `schoolYear`, `periodYear` o equivalente en el estado base ni en la Ficha Maestra. `institution-master-v46.js` dispone únicamente de `schoolCalendar`, capturado como texto libre mediante “Calendario escolar / referencia anual”. Ese valor no constituye por sí mismo un identificador normalizado de periodo lectivo.

En `app.js`, las unidades guardan `createdAt` y otros datos de contexto, pero no un año académico estructurado. Las sesiones derivadas tampoco cuentan con un snapshot explícito del año escolar. Por tanto, la fecha técnica de creación no puede sustituir de forma segura al periodo académico: un documento puede prepararse antes, reutilizarse después, pertenecer a un año diferente o necesitar conservar el año vigente al momento de emisión.

La búsqueda específica de una propiedad `academicYear` en el repositorio actual no devolvió implementación. Además, `index.html` de producción no carga `institution-master-v46.js`; por ello el runtime productivo actual tampoco demuestra una fuente canónica del año.

## Evidencia
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`: fuente única de verdad incluye “año”; históricos conservan datos del momento de emisión; correlativos por tipo y año.
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`: prueba de año completo marzo–diciembre y continuidad de datos.
- `institution-master-v46.js`: existe `schoolCalendar` como texto libre, sin propiedad canónica de año.
- `app.js`: unidades y sesiones no registran año académico estructurado.
- `index.html`: producción carga el runtime base y no incluye actualmente `institution-master-v46.js`.

## PASA / NO PASA
**NO PASA**

## Clasificación
**PARCIALMENTE FUNCIONAL / INEXISTENTE para año canónico**

## Severidad
**S2 ALTO**

No se eleva a S1 porque esta prueba no demuestra aún un documento histórico concreto emitido con año incorrecto. Sí demuestra una brecha de trazabilidad que puede afectar programación anual, históricos, archivo, correlativos y cambio de periodo.

## Causa raíz
El modelo institucional incorporó una referencia de calendario en texto libre, pero no cerró el contrato de identidad temporal del ciclo escolar como dato estructurado y versionado. La fecha `createdAt` se usa como metadato técnico, no como periodo académico.

## Acción correctiva
1. Incorporar un campo canónico de periodo lectivo/año académico en el esquema maestro, con migración no destructiva.
2. Mantener `schoolCalendar` como dato descriptivo separado.
3. Registrar procedencia del año y snapshot en documentos cuando corresponda.
4. Al cambiar de año, crear nuevo contexto activo sin alterar documentos históricos.
5. Vincular correlativos y archivo al año que corresponda cuando esos módulos sean funcionales.
6. Probar transición 2026 → 2027 (o dos periodos consecutivos equivalentes) con unidades, sesiones, evaluaciones y documentos Director.
7. No inferir el año únicamente desde `createdAt`.

## Corrección realizada en esta pasada
**No se modificó código funcional.** Añadir el año canónico afecta esquema, migración, snapshots históricos, Programación, Director, archivo y correlativos. No es una corrección pequeña suficientemente segura sin prueba integral de regresión.

## Evidencia posterior requerida
- guardar → recargar → reutilizar año en Docente y Director;
- cambio de año sin alterar históricos;
- unidad/sesión nueva hereda el año activo;
- documento histórico mantiene su año original;
- archivo y búsqueda filtran por año;
- correlativos quedan aislados por tipo/año cuando estén implementados;
- pruebas con datos antiguos sin campo `academicYear`.

## Riesgo de regresión
**MEDIO/ALTO** si se añade sin migración o si se deriva automáticamente de la fecha del sistema.

## Impacto cualitativo
- **IUD:** puede aumentar repetición y correcciones si el usuario debe recordar/reescribir el periodo.
- **ICGD:** negativo por fuente temporal incompleta.
- **IFR:** riesgo de documentos incompletos o históricos ambiguos.
- **ISU:** no calcular; la corrección debe ser automática y simple para no añadir decisiones innecesarias.
- **Prelaunch:** mantiene pendiente el E2E anual y la trazabilidad histórica.

## Estado de lanzamiento
DocenteDigital no puede declararse lista para V1.0 por este hallazgo ni mientras existan S0/S1 y pruebas reales esenciales pendientes del Gate V5.
