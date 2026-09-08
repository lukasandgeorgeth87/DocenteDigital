# AUD-MATERIAL-CONTROLS-IGNORED-HARDCODED-254

**Fecha de auditoría:** 2026-09-08  
**Módulo:** Carpeta Docente / Materiales  
**Estado:** NO PASA  
**Clasificación:** ROTA / SIMULADA según control  
**Severidad:** S1 — CRÍTICO  

## Especificaciones obligatorias utilizadas conjuntamente

Antes de esta prueba se revisaron conjuntamente:

- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

V2 incluye Materiales/Fichas dentro de Carpeta Docente. V3 establece que una función no aprueba por aparecer o producir texto y exige entrada → esperado → obtenido → evidencia → resultado → severidad → corrección. V5 incluye Materiales en el recorrido Docente extremo a extremo y clasifica como S1 un documento pedagógicamente incorrecto. El Núcleo IA exige conservar intención, finalidad, contexto, nivel/grado y restricciones, además de heredar significado entre Unidad/Proyecto → Sesiones → Materiales → Evaluación.

## Prueba AUD-MAT-254-A — Tema escrito por el docente

**Entrada**  
Ir a Materiales, seleccionar un grado válido y escribir como Tema: `Las hormigas que aparecieron en nuestra aula`. Mantener idioma Castellano y pulsar `Crear lectura`.

**Resultado esperado**  
La salida debe responder al tema solicitado, conservar el contexto del aula y adecuarse al grado seleccionado. Si la generación real todavía no existe, la función debe declararse no disponible o pedir completar lo estrictamente necesario; no debe entregar un material de otro tema como si fuera correcto.

**Resultado obtenido**  
NO PASA. El campo Tema de `index.html` no tiene `id` ni otro enlace visible con `generateMaterial()`. La función productiva `generateMaterial()` solo lee `materialLanguage` y `materialQuechua`; no lee el tema escrito. En Castellano siempre devuelve un texto fijo sobre cuidado y reutilización del agua:

`En nuestra comunidad cuidamos el agua porque sostiene la vida de las personas, animales y plantas...`

Por tanto, una solicitud sobre hormigas, biohuerto, mariposas, lectura literaria u otro interés obtiene igualmente un texto de agua.

**Evidencia**

- `index.html`: `Tema<input placeholder="Escribe el tema o interés que deseas trabajar">` sin identificador usado por el generador.
- `app.js`: `generateMaterial()` solo consulta `materialLanguage` y `materialQuechua`.
- Producción `https://docente-digital.vercel.app/app.js`: misma implementación y respuesta fija sobre agua.
- Producción `https://docente-digital.vercel.app/`: HTTP 200 y misma interfaz de Materiales.

**PASA / NO PASA:** NO PASA  
**Clasificación:** ROTA  
**Severidad:** S1 — CRÍTICO

## Prueba AUD-MAT-254-B — Tipo de material

**Entrada**  
Seleccionar `Ficha` o `Tarjetas palabra-imagen`, completar Tema y pulsar el botón principal.

**Resultado esperado**  
El tipo elegido debe determinar estructura y salida: ficha cuando se selecciona Ficha; tarjetas palabra-imagen cuando se seleccionan tarjetas.

**Resultado obtenido**  
NO PASA. El `<select>` de Tipo no tiene `id` y `generateMaterial()` no consulta su valor. El botón mantiene la etiqueta `Crear lectura` y la salida mantiene el encabezado `Lectura generada` cualquiera sea la selección. No existe ramificación funcional para Ficha o Tarjetas.

**Clasificación:** SIMULADA / ROTA  
**Severidad individual:** S2 — ALTO, absorbida por el S1 principal AUD-MAT-254-A.

## Prueba AUD-MAT-254-C — Grado seleccionado

**Entrada**  
Generar el mismo tema para 1.º y luego para 5.º.

**Resultado esperado**  
El material debe utilizar el grado seleccionado para ajustar extensión, vocabulario, consignas, complejidad, apoyos y formato cuando corresponda.

**Resultado obtenido**  
NO PASA. `materialGrade` se llena desde la configuración, pero `generateMaterial()` no lee `materialGrade`. El texto producido es idéntico entre grados para un mismo idioma.

**Clasificación:** SIMULADA  
**Severidad individual:** S2 — ALTO, absorbida por el S1 principal.

## Prueba AUD-MAT-254-D — Herencia Unidad/Sesión → Materiales

**Entrada**  
Crear o seleccionar una Unidad/Proyecto con una finalidad explícita y avanzar al módulo Materiales.

**Resultado esperado**  
Conforme al Núcleo IA, el significado aprobado debe poder heredarse hasta Materiales para evitar que el usuario reescriba contexto y para impedir materiales desconectados de la finalidad.

**Resultado obtenido**  
NO PASA. El generador no consulta `state.activeUnitId`, `state.units`, `state.lastSession`, actividad, área, criterio, evidencia ni perfil semántico. La salida queda desligada de Unidad/Proyecto y Sesión.

**Clasificación:** INEXISTENTE para herencia semántica de Materiales  
**Severidad individual:** S2 — ALTO, absorbida por AUD-254.

## Causa raíz

La pantalla de Materiales expone controles que aparentan determinar la generación, pero el runtime base conserva una función demostrativa mínima y hardcodeada. La interfaz y el motor no comparten un modelo estructurado de solicitud de material. No existe una entrada canónica equivalente a `{type, topic, grade, language, variety, unitId, sessionId, purpose, constraints}` ni validación previa a la salida.

Este defecto es especialmente riesgoso porque es silencioso: la app sí muestra un texto y por ello puede parecer funcional, exactamente el falso positivo prohibido por V3.

## Acción correctiva requerida

No corregir agregando más textos fijos o palabras clave. La solución debe:

1. identificar de forma estructurada Tipo, Tema, Grado, Idioma y variedad;
2. heredar Unidad/Proyecto/Sesión cuando exista y permitir cambiar explícitamente el contexto;
3. generar estructuras distintas para Lectura, Ficha y Tarjetas palabra-imagen;
4. ajustar complejidad por nivel/grado y organización multigrado;
5. conservar términos locales y perfil EIB/monolingüe confirmado;
6. bloquear o marcar claramente `Próximamente` si no existe generación real;
7. auditar coherencia Tema → tipo de material → grado → finalidad → contenido;
8. probar entradas de biohuerto, hormigas en el aula, términos quechuas, tema urbano, textos extensos, campos vacíos y caracteres especiales;
9. incluir pruebas de regresión automatizadas donde `agua` no pueda aparecer por hardcode cuando el usuario solicitó otro tema sin relación;
10. no aprobar hasta ejecutar generación real y revisar muestras pedagógicas por grado.

## Corrección aplicada en esta ronda

**Ninguna modificación funcional.** El defecto requiere conectar datos de interfaz, modelo pedagógico y generación real/guardas. Un parche que simplemente lea el Tema pero siga produciendo plantillas hardcodeadas simularía funcionalidad y violaría V3/Núcleo IA. Se deja pendiente hasta disponer de una implementación verificable.

## Evidencia posterior / producción

Antes de registrar el hallazgo se consultó producción directamente mediante Vercel:

- `https://docente-digital.vercel.app/` → HTTP 200.
- `https://docente-digital.vercel.app/app.js` → HTTP 200.
- La versión productiva contiene la misma función `generateMaterial()` que solo lee idioma/variedad y devuelve contenido fijo sobre agua.

El HTTP 200 confirma disponibilidad del recurso, **no** aprobación funcional.

## Riesgo de regresión

**ALTO** si se corrige de forma parcial: puede cambiar el tema visible pero seguir ignorando grado, tipo, unidad, idioma real o finalidad; también podría introducir traducciones no verificadas o producir fichas pedagógicamente inadecuadas.

## Impacto cualitativo en métricas

- **IUD:** impacto negativo fuerte: el usuario recibe un material distinto de su intención.
- **ICGD:** impacto negativo por ruptura de continuidad Unidad/Sesión → Materiales.
- **IFR:** no se calcula valor definitivo; la función falla funcionalmente para variación de entradas.
- **ISU:** impacto negativo: controles visibles inducen a creer que afectan el resultado cuando no lo hacen.
- **Prelaunch:** bloquea el recorrido Docente V1.0 de Materiales y agrega un S1 pedagógico; no se calcula score definitivo.

## Normativa externa

No se aplicó ni se declaró vigente ninguna norma MINEDU/UGEL externa para este hallazgo. La no conformidad deriva de las especificaciones internas obligatorias y de la implementación observada. Cualquier futura regla curricular o EIB aplicada a la generación deberá verificarse contra fuente oficial actual antes de declararse vigente.

## Gate de lanzamiento

DocenteDigital **NO está lista para lanzamiento V1.0**. AUD-254 demuestra que el módulo Materiales puede entregar contenido pedagógicamente ajeno a la entrada del usuario mientras aparenta haber generado correctamente, por lo que constituye un S1 según la escala interna V3 y un bloqueo adicional de V5. Las pruebas físicas, 100 generaciones, Word/PDF real, restore, seguridad, año completo, concurrencia y pilotos permanecen pendientes.