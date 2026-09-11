# AUD-MASTER-INSTITUTIONAL-PROFILE-MISSING-258

## Resumen

DocenteDigital no implementa todavía la **Ficha Maestra de la IE** exigida por `AUDITORIA_MAESTRA_INTEGRAL_V2.md` y necesaria para el gate de prelananzamiento V5. La configuración productiva actual persiste únicamente datos pedagógicos básicos (`mode`, `level`, `ieType`, `grades`, `areas`, `language`, `quechuaVar`) y no una fuente institucional única de verdad con los datos de identificación, gestión y contexto que deben reutilizarse entre Carpeta Docente y Carpeta Director.

## ID de prueba

**AUD-MASTER-INSTITUTIONAL-PROFILE-MISSING-258**

## Módulo

Ficha Maestra / Configuración / persistencia / trazabilidad Docente–Director.

## Especificaciones aplicables

- **V2, sección 3 — UNA SOLA BASE INSTITUCIONAL:** exige una FICHA MAESTRA DE LA IE y registrar una sola vez, entre otros, nombre de IE, código modular, código de local, UGEL, DRE/GRE, región, provincia, distrito, centro poblado/comunidad, ámbito, modalidad, niveles, turnos, gestión, característica, EIB/no EIB, lenguas, director, docentes, grados, secciones, estudiantes, calendario, recursos y características de la comunidad. Prohíbe solicitar nuevamente esos datos en cada documento.
- **V2, sección 5 — NO DUPLICAR INFORMACIÓN:** los datos institucionales ya registrados deben reutilizarse en PEI, PAT, PCI, RI/DG, RD, oficios, informes, planes y actas.
- **V3, sección 3 — Fuente única de verdad y procedencia:** los datos institucionales deben proceder de una fuente maestra única y no almacenarse contradictoriamente por documento.
- **V4, sección 34 — Configuración una sola vez:** la Ficha Maestra se completa y luego se reutiliza.
- **V5, secciones 1 y 2:** Perfil/Ficha de IE es parte esencial de V1.0 y primer eslabón de los recorridos E2E Docente y Director.

## Entrada

1. Abrir una instalación nueva.
2. Completar el flujo inicial.
3. Abrir **Configuración**.
4. Buscar campos institucionales maestros y comprobar el estado persistido.
5. Intentar reutilizar esos datos en módulos Docente/Director.

## Resultado esperado

Debe existir una Ficha Maestra institucional persistente y editable, con al menos los datos necesarios para identificar la IE y alimentar documentos posteriores sin volver a pedirlos. Los documentos históricos emitidos deben conservar el snapshot vigente al momento de emisión; los nuevos deben consumir la versión maestra actual.

## Resultado obtenido

### 1. Estado persistido principal

`app.js` inicializa únicamente:

```js
state.mode=state.mode||'easy';
state.level=state.level||'';
state.ieType=state.ieType||'';
state.grades=state.grades||[];
state.areas=state.areas||[];
state.language=state.language||'Castellano';
state.quechuaVar=state.quechuaVar||'Quechua Collao';
state.units=Array.isArray(state.units)?state.units:[];
state.activeUnitId=state.activeUnitId||null;
state.lastSession=state.lastSession||null;
```

No existen en esta estructura campos institucionales canónicos como nombre de IE, código modular, código de local, UGEL, DRE/GRE, región/provincia/distrito, director, docentes, turnos, gestión, secciones, matrícula, calendario ni recursos.

### 2. Flujo inicial

La producción solicita únicamente:

- nivel;
- tipo de IE;
- grados/edades;
- áreas;
- perfil lingüístico/lengua.

No solicita ni importa una identidad institucional mínima.

### 3. Pantalla Configuración

La pantalla productiva resume solamente:

- nivel;
- tipo de IE;
- grados/edades;
- áreas;
- idioma.

La acción disponible es **“Editar Nivel/Tipo/Grados/Áreas”**; no existe una superficie equivalente a Ficha Maestra institucional.

### 4. Consecuencia transversal

La app no puede demostrar todavía reutilización automática y consistente de identidad institucional entre:

**Docente → Programación/Unidad/Sesión/Evaluación**

y
**Director → DG/PAT/Oficio/RD/Informe/Archivo**.

Tampoco existe una base suficiente para implementar procedencia, snapshots históricos ni detección de contradicciones institucionales.

## Evidencia productiva

La URL canónica `https://docente-digital.vercel.app/` respondió HTTP 200 durante esta ronda y su HTML muestra el flujo inicial y la pantalla Configuración descritos arriba. El deployment productivo vigente corresponde al SHA `fe7220099c5c8208c9dd3e55d8c9127b4ae15523`.

## PASA / NO PASA

**NO PASA**

## Clasificación funcional

**INEXISTENTE** para la Ficha Maestra institucional completa.

La configuración pedagógica básica sí existe, por lo que no debe confundirse su existencia con el cumplimiento de la Ficha Maestra V2/V5.

## Severidad

**S1 — CRÍTICO**

Justificación: es un requisito estructural de V1.0 y el primer eslabón de ambos recorridos E2E V5. Sin una fuente institucional única no puede demostrarse reutilización, trazabilidad Docente–Director, coherencia entre documentos ni conservación correcta de datos institucionales. No se clasifica S0 porque en esta prueba no se demostró fuga, corrupción irreversible ni privilegio indebido.

## Causa raíz

El prototipo fue construido alrededor de un estado pedagógico mínimo y módulos de generación, sin un modelo canónico versionado de entidad IE y perfiles institucionales asociados.

## Acción correctiva

No debe resolverse añadiendo campos aislados a diferentes formularios. Implementar un modelo único y versionado, por ejemplo:

```text
IE_MASTER
├─ identidad
├─ ubicación
├─ organización
├─ gestión
├─ perfil lingüístico/EIB
├─ director/docentes
├─ grados/secciones/matrícula
├─ calendarios
├─ recursos/contexto
├─ procedencia por dato
├─ updatedAt/version
└─ historial/snapshots para documentos emitidos
```

Luego:

1. crear/editar Ficha Maestra desde una sola superficie;
2. validar datos obligatorios y contradicciones;
3. reutilizar automáticamente en Docente y Director;
4. registrar procedencia;
5. guardar snapshot en documentos emitidos para no modificar históricos;
6. migrar de forma segura el estado local existente;
7. probar creación, edición, cierre/recarga, cambio de datos maestros y documentos históricos;
8. ejecutar E2E Docente y Director con verificación de no repetición.

## Corrección aplicada en esta ronda

**No se aplica cambio funcional automático.** La solución afecta el modelo de datos, migración y comportamiento transversal de documentos, por lo que no es un parche pequeño y reversible que pueda considerarse seguro sin batería de regresión.

## Evidencia posterior

Se documenta el hallazgo únicamente. La producción se mantiene sin cambios funcionales.

## Fuente oficial / normativa externa

Este hallazgo no necesita una nueva declaración de vigencia normativa MINEDU: deriva de las especificaciones internas V2–V5. Cualquier dato o regla normativa que posteriormente alimente la Ficha Maestra deberá verificarse contra fuente oficial vigente antes de incorporarse.

## Riesgo de regresión de la futura corrección

**ALTO**, porque una migración incorrecta podría perder configuración existente, modificar documentos históricos o introducir contradicciones entre módulos. Requiere migración versionada, backups y pruebas E2E.

## Impacto

- **IUD:** alto — impide trazabilidad institucional Docente/Director completa.
- **ICGD:** alto — afecta coherencia y reutilización de datos de gestión.
- **IFR:** alto — falta fuente única y recuperación institucional completa.
- **ISU:** medio/alto — obliga a reintroducir datos cuando módulos reales se implementen.
- **Prelaunch:** bloqueante estructural para V1.0.

## Estado acumulativo

**ABIERTO · NO PASA · S1 CRÍTICO · BLOQUEANTE V5**

No calcular puntuaciones definitivas hasta disponer de evidencia real de usuarios, documentos físicos, dispositivos físicos, restauración, seguridad y recorridos E2E completos.
