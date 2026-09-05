# AUD-SEC-COMPETENCE-FALLBACK-173 — Secundaria puede generar una competencia no oficial

## Alcance

Auditoría conjunta contra:
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

Fecha de verificación: 2026-09-05.

## ID de prueba

**AUD-SEC-COMPETENCE-FALLBACK-173**

## Módulo

Carpeta Docente → Configuración Secundaria → Unidad/Proyecto → Sesión → Competencia priorizada.

## Entrada

1. Configurar nivel `Secundaria`.
2. Seleccionar un grado de Secundaria.
3. Seleccionar el área `EPT`.
4. Crear una unidad/proyecto y una actividad de EPT.
5. Generar la sesión.

También se inspeccionó estáticamente el runtime productivo servido desde `https://docente-digital.vercel.app/app.js`.

## Resultado esperado

La sesión debe utilizar una competencia curricular oficial aplicable al área, grado y propósito, obtenida de una base curricular oficial/versionada o mediante una selección validada. No debe sustituir una competencia oficial por una frase genérica que parezca una competencia.

V3 exige que una misma solicitud no varíe arbitrariamente en competencia oficial y clasifica como S1 un documento pedagógicamente incorrecto. El Núcleo IA exige que una fuente oficial gane ante cualquier propuesta de IA y que la auditoría final compruebe nivel, grado, contexto y fuentes oficiales.

## Resultado obtenido

El runtime productivo ofrece en Secundaria las áreas:

`Comunicación`, `Matemática`, `Ciencia y Tecnología`, `Ciencias Sociales`, `DPCC`, `Inglés`, `Educación Física`, `Arte y Cultura`, `Educación Religiosa`, `EPT`.

`activityVariants()` contiene además actividades específicas para `Ciencias Sociales`, `DPCC`, `Inglés` y `EPT`.

Sin embargo, `competenceFor(area,title)` solo tiene ramas específicas para:

- Comunicación
- Matemática
- Personal Social
- Ciencia y Tecnología
- Arte y Cultura
- Educación Física
- Educación Religiosa
- Psicomotriz

Para `EPT` —y también para `Ciencias Sociales`, `DPCC` e `Inglés`— termina en el fallback:

```js
return `Desarrolla la competencia priorizada del área de ${area}, de acuerdo con la unidad y el grado.`;
```

Por tanto una sesión de EPT puede mostrar como **Competencia priorizada**:

> Desarrolla la competencia priorizada del área de EPT, de acuerdo con la unidad y el grado.

Ese texto no identifica la competencia curricular oficial.

## Contraste con fuente oficial

El Repositorio Institucional del Ministerio de Educación publicó en septiembre de 2025 el **Texto de Educación para el Trabajo 5**, elaborado por la Dirección de Educación Secundaria. Su ficha oficial indica expresamente que el material promueve la competencia **“Gestiona proyectos de emprendimiento económico o social”** establecida en el Currículo Nacional de la Educación Básica.

Fuente oficial verificada el 2026-09-05:
- MINEDU, Repositorio Institucional: `https://repositorio.minedu.gob.pe/handle/20.500.12799/11831`

Como soporte curricular oficial adicional, el Programa Curricular de Educación Secundaria del MINEDU contiene las definiciones de competencias, capacidades y estándares del nivel:
- `https://repositorio.minedu.gob.pe/handle/20.500.12799/4550`

No se declara aquí una norma jurídica nueva ni se infiere vigencia legal a partir de una fuente no oficial.

## Evidencia

### Repositorio/producción

La función `areaOptions()` ofrece `EPT` en Secundaria y `activityVariants()` genera actividades EPT, mientras `competenceFor()` no tiene una rama EPT y cae en el fallback genérico.

La misma implementación fue recuperada directamente de producción el 2026-09-05 desde:

`https://docente-digital.vercel.app/app.js` → HTTP 200.

### Especificación

- V3: competencia oficial no puede variar arbitrariamente y un documento pedagógicamente incorrecto es S1.
- V5: la cadena pedagógica debe probar Programación → Unidad → Sesiones → Criterios → Evidencias → Instrumentos → Registro y realizar pruebas de exactitud pedagógica.
- Núcleo IA: la base oficial protege; si la IA y la fuente oficial entran en conflicto, gana la fuente oficial.

## PASA / NO PASA

**NO PASA**

## Clasificación funcional

**PARCIALMENTE FUNCIONAL**

La ruta genera una sesión y conserva el área, pero no garantiza una competencia curricular oficial para varias áreas de Secundaria.

## Severidad

**S1 — CRÍTICO**

Justificación: la salida puede presentar como “Competencia priorizada” un texto que no es la competencia oficial del área. V3 define como S1 un documento pedagógicamente incorrecto. Esto bloquea la aprobación de V1.0 aunque la sesión abra, guarde o exporte.

## Causa raíz

`competenceFor()` funciona como un mapa heurístico incompleto y no como una fuente curricular oficial, versionada y exhaustiva por nivel/área/competencia. La interfaz ofrece más áreas de las que la función puede resolver correctamente.

## Acción correctiva

1. No utilizar el fallback genérico como valor de “Competencia priorizada”.
2. Construir/usar un catálogo curricular oficial versionado por nivel, área y competencia, con fuente MINEDU y fecha de verificación.
3. Para áreas con varias competencias, seleccionar según intención/actividad con reglas verificables y permitir revisión docente; no elegir por palabras clave aisladas.
4. Si no existe certeza suficiente, mostrar estado pendiente y solicitar/permitir selección de una competencia oficial en lugar de inventar o simular una.
5. Agregar golden tests para todas las áreas ofrecidas en Inicial, Primaria y Secundaria.
6. Probar explícitamente EPT, DPCC, Inglés y Ciencias Sociales en todos los grados de Secundaria antes de aprobar el gate.
7. Verificar después la cadena competencia → criterio → evidencia → instrumento, porque el criterio y la evidencia también dependen actualmente de fallbacks genéricos para estas áreas.

## Corrección aplicada

**PENDIENTE.**

No se modifica automáticamente el mapa curricular porque la corrección requiere fuente curricular oficial completa, decisiones de selección pedagógica por propósito/competencia y pruebas de regresión en todas las áreas. Aplicar un nombre aislado únicamente a EPT ocultaría el mismo problema en DPCC, Inglés y Ciencias Sociales.

## Evidencia posterior requerida

- batería por cada área/grado de Secundaria;
- nombre exacto de competencia proveniente de fuente oficial;
- procedencia/versionado de la fuente;
- coherencia competencia ↔ criterio ↔ evidencia ↔ instrumento;
- persistencia y exportación sin alterar la competencia;
- golden tests automatizados y revisión pedagógica real.

## Riesgo de regresión

**ALTO** si se corrige con otro conjunto de `if/regex` aislados. El riesgo baja si la app usa un catálogo curricular oficial único y versionado con pruebas exhaustivas por área/nivel.

## Impacto en indicadores

- **IUD:** impacto negativo potencial: obliga a corrección manual del documento.
- **ICGD:** impacto negativo directo por inconsistencia curricular.
- **IFR:** NO calcular definitivo; esta falla debe formar parte de la batería funcional/pedagógica.
- **ISU:** NO calcular definitivo; una interfaz simple no compensa un dato curricular incorrecto.
- **Prelaunch:** bloqueante S1 hasta demostrar corrección y pruebas.

## Estado de lanzamiento

**DocenteDigital NO está lista para lanzamiento V1.0.** Este hallazgo se suma a los S0/S1 abiertos y no puede ser ocultado por una puntuación global.