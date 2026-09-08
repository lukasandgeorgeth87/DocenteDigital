# AUD-STUDENT-MASTER-ROSTER-MISSING-243 — Padrón maestro de estudiantes inexistente

## Alcance
Auditoría acumulativa de la fuente de datos de estudiantes necesaria para Carpeta Docente, evaluación, registro auxiliar y seguimiento.

## Especificaciones obligatorias aplicadas
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

## ID de prueba
**AUD-STUDENT-243-A**

## Módulo
Ficha Maestra / estudiantes → Evaluación → Registro auxiliar → Seguimiento.

## Entrada
1. Configurar una IE en la Ficha Maestra.
2. Registrar el número de estudiantes.
3. Ir a Evaluación / Registro auxiliar.
4. Intentar recuperar estudiantes reales sin volver a escribir sus nombres o inventar identidades.

## Resultado esperado
Debe existir una fuente estructurada y reutilizable de estudiantes, con identificador estable y los datos mínimos necesarios para vincular de forma trazable estudiante → grado/sección → competencia → criterio → evidencia → valoración → retroalimentación → progreso. La información debe reutilizarse en Registro y Seguimiento sin reingreso innecesario.

V2 exige que el Registro Auxiliar recupere automáticamente estudiantes, áreas, competencias, criterios, evidencias, periodos y valoraciones. V3 exige una fuente única de verdad, procedencia y trazabilidad; V5 exige el E2E Docente completo hasta Registro y Seguimiento.

## Resultado obtenido
`institution-master-v46.js` contiene únicamente `studentCount` y un campo visible `N.º de estudiantes`. No define una colección de estudiantes, `studentId`, nombres, grado/sección por estudiante ni mecanismo de importación/alta reutilizable.

El flujo `showEvaluation('register')` de `app.js` tampoco recupera una entidad estudiante; el hallazgo AUD-EVAL-REGISTER-154 ya demuestra que el registro visible carece de estudiante, competencia, criterio, evidencia y persistencia. AUD-243 identifica una causa estructural anterior y distinta: aun sustituyendo esa pantalla, hoy no existe una fuente maestra de estudiantes desde la cual recuperar identidades reales.

Las búsquedas de implementación por `students`, `studentId`, `roster` y equivalentes no encontraron un modelo productivo de padrón de estudiantes en el repositorio actual.

## Evidencia
- `institution-master-v46.js`: `initialMaster()` y `saveMaster()` usan `studentCount`, no una colección de estudiantes.
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`: Registro Auxiliar debe recuperar automáticamente estudiantes y mantener la cadena evaluativa.
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`: Registro Auxiliar debe conservar decisión profesional y trazabilidad; datos importantes deben tener fuente única/procedencia.
- `docs/audits/AUD-EVAL-REGISTER-154.md`: la UI actual de Registro tampoco dispone de estudiante real.

## PASA / NO PASA
**NO PASA**

## Clasificación
**INEXISTENTE** como padrón maestro reutilizable de estudiantes.

## Severidad
**S2 — ALTO**

Se clasifica S2 porque demuestra una brecha estructural importante que impide completar correctamente Registro/Seguimiento, pero no constituye por sí sola evidencia nueva de pérdida irreversible, fuga de datos ni valoración falsa emitida. El S1 de Registro simulado ya está documentado por AUD-EVAL-REGISTER-154 y no se duplica aquí.

## Causa raíz
La Ficha Maestra evolucionó como ficha institucional agregada y conserva solo cantidades. El modelo de estudiante individual no fue definido antes de construir las superficies de Evaluación/Registro.

## Acción correctiva
1. Definir una entidad `Student` con ID estable y esquema mínimo, evitando almacenar datos personales innecesarios.
2. Vincular estudiante con IE, grado y sección cuando corresponda.
3. Implementar alta/importación segura y edición controlada del padrón.
4. Reutilizar esa entidad en Evaluación, Registro, Evidencias y Seguimiento.
5. Mantener históricos por ID/snapshot cuando cambie grado, sección o nombre.
6. Aplicar minimización y controles de privacidad antes de persistir datos personales reales.
7. No implementar backend multiusuario ni importar datos oficiales sin autorización y sin el diseño de seguridad correspondiente.

## Corrección aplicada en esta ronda
No se modificó código funcional. Añadir estudiantes reales introduce datos personales y afecta modelo de datos, privacidad, autenticación, aislamiento y migración. Una lista local improvisada sería insegura y contraria a V3/V5.

## Pruebas posteriores obligatorias
- crear/importar dos estudiantes → guardar → recargar → recuperar exactamente los mismos IDs;
- vincular estudiantes distintos a registros/evidencias distintos sin contaminación;
- cambio de grado/sección sin modificar históricos ya emitidos;
- eliminación/baja con política de conservación y recuperación aplicable;
- multigrado: separar correctamente estudiantes por grado;
- E2E Evaluación → Registro → Seguimiento sin volver a escribir estudiante;
- aislamiento entre usuarios/IE cuando exista backend;
- revisión de privacidad y OWASP ASVS antes de datos personales productivos.

## Normativa externa
Este hallazgo se sustenta en las especificaciones internas y no declara vigente ninguna norma MINEDU/UGEL externa. Cualquier tratamiento real de datos personales deberá verificarse contra las fuentes oficiales vigentes antes de implementarse o declararse conforme.

## Riesgo de regresión
**ALTO** si se incorpora como arreglo rápido: puede duplicar estudiantes, romper históricos o introducir exposición de datos personales. Debe implementarse sobre un modelo versionado y con controles de acceso.

## Impacto cualitativo
- **IUD:** negativo por reingreso potencial de estudiantes.
- **ICGD:** negativo por ausencia de identidad trazable estudiante → evidencia → registro.
- **IFR:** afecta la funcionalidad real del E2E Docente.
- **ISU:** no se calcula; un padrón bien reutilizado debería reducir reescritura.
- **Prelaunch:** mantiene abierto el E2E Evaluación/Registro/Seguimiento.

## Gate
DocenteDigital continúa **NO APROBADA PARA LANZAMIENTO V1.0** mientras existan bloqueantes V5 y falten pruebas reales esenciales.