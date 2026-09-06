# AUD-SECONDARY-CURRICULUM-PLACEHOLDER-200

## Resumen

DocenteDigital permite configurar Secundaria con las áreas Ciencias Sociales, DPCC, Inglés y EPT, pero el generador base de sesiones no tiene una selección curricular específica para estas áreas. `competenceFor()` cae en un fallback textual genérico: `Desarrolla la competencia priorizada del área de ${area}, de acuerdo con la unidad y el grado.`

La capa `session-curriculum-safety-v67.js` reduce el riesgo de presentar esta salida como oficial cuando `curriculumMatrixReady !== true`, cambiando la etiqueta a “Referencia curricular provisional” y mostrando una advertencia. Esta guarda es correcta como barrera de seguridad, pero no convierte el flujo de Secundaria en funcional: la competencia real sigue sin seleccionarse ni heredarse desde una matriz curricular oficial versionada y verificada.

## Especificaciones aplicadas

- V2: trazabilidad Programación → Unidad/Proyecto → Sesiones y respeto de competencias.
- V3: una función no aprueba porque genere texto; debe usar datos correctos, fuente única, trazabilidad y fuentes oficiales verificadas.
- V4: Modo Fácil debe completar lo necesario sin trasladar decisiones técnicas al docente.
- V5: la cadena Docente debe probarse E2E y la exactitud curricular es un gate de lanzamiento.
- Núcleo IA: la base oficial protege; el perfil semántico debe conservar nivel, grados, áreas y contexto hasta la sesión.

## Fuente oficial verificada

Verificación realizada el 2026-09-06 contra fuente oficial MINEDU:

- Página oficial de Programas Curriculares EBR: https://www.gob.pe/90158-ministerio-de-educacion-programas-curriculares-de-la-educacion-basica-regular
- Programa Curricular de Educación Secundaria servido por MINEDU: https://www.minedu.gob.pe/curriculo/pdf/03062016-programa-nivel-secundaria-ebr.pdf

La página oficial vigente de MINEDU señala que los programas curriculares forman parte del Currículo Nacional y contienen competencias, capacidades, estándares y desempeños por grado. En Ciencias Sociales, el programa oficial define competencias concretas, entre ellas “Construye interpretaciones históricas”, “Gestiona responsablemente el espacio y el ambiente” y “Gestiona responsablemente los recursos económicos”. Por tanto, el fallback genérico de DocenteDigital no constituye una competencia curricular válida.

## Prueba

**ID:** AUD-SECONDARY-CURRICULUM-PLACEHOLDER-200

**Módulo:** Sesiones · Secundaria · currículo

**Entrada:**

1. Nivel: Secundaria.
2. Área: Ciencias Sociales (el mismo riesgo existe para DPCC, Inglés y EPT en `competenceFor()`).
3. Crear Unidad/Proyecto y seleccionar una actividad de dicha área.
4. Generar sesión.

**Resultado esperado:**

La sesión debe seleccionar una competencia oficial pertinente a la actividad, grado y finalidad desde una matriz curricular oficial versionada/verificada, conservar su procedencia y mantener coherencia con criterio, evidencia e instrumento. Si la matriz no está disponible, el flujo no debe fingir que la sesión curricular está completa.

**Resultado obtenido:**

`competenceFor()` no contiene ramas para Ciencias Sociales, DPCC, Inglés ni EPT. Para estas áreas retorna el fallback:

```js
return `Desarrolla la competencia priorizada del área de ${area}, de acuerdo con la unidad y el grado.`;
```

`buildSession()` guarda ese texto en `session.competence`. `session-curriculum-safety-v67.js` lo etiqueta como referencia provisional si la matriz oficial no está lista, lo cual evita una falsa afirmación de oficialidad, pero la sesión sigue sin una competencia curricular real resuelta.

**PASA / NO PASA:** NO PASA.

**Clasificación:** PARCIALMENTE FUNCIONAL en seguridad de etiquetado; INEXISTENTE/no demostrada en resolución curricular real de estas áreas de Secundaria.

**Severidad:** S2 ALTO.

## Causa raíz

La aplicación dispone de opciones de áreas de Secundaria en la configuración, pero el motor curricular base fue implementado principalmente para áreas de Inicial/Primaria y algunas áreas comunes. La superficie permite avanzar más lejos que la cobertura real del motor curricular. La guarda v67 mitiga el riesgo de oficialidad falsa, pero no reemplaza la matriz curricular requerida.

## Acción correctiva

No resolver con otro banco heurístico o con cadenas hardcodeadas aisladas. Implementar una matriz curricular oficial, versionada y con procedencia, como mínimo por nivel → área → competencia → capacidades → ciclo/grado → desempeños, y hacer que Unidad y Sesión hereden esa selección. La elección final debe depender de la intención/actividad y no solo del nombre del área.

Mientras la matriz no esté verificada, Modo Fácil debe informar de forma breve que esa parte curricular está pendiente de verificación y evitar entregar la sesión como lista para uso final.

## Corrección aplicada en esta ejecución

No se modificó el runtime. Una modificación pequeña de `competenceFor()` sería insegura porque introduciría currículo hardcodeado sin versión, procedencia ni selección contextual. Se documenta el bloqueante funcional para corregirlo mediante la arquitectura curricular prevista.

## Riesgo de regresión

ALTO si se corrige únicamente el texto visible. La regresión puede aparecer en Unidad → Sesión → Evaluación si cada módulo usa una fuente curricular distinta.

## Impacto

- IUD: negativo para docentes de Secundaria que deben completar/corregir manualmente currículo.
- ICGD: negativo por falta de trazabilidad curricular real.
- IFR: no calculado; falta evidencia E2E.
- ISU: no calculado; una advertencia de verificación tras generar aumenta carga cognitiva.
- Prelaunch: gate Docente Secundaria continúa PENDIENTE/NO PASA.

## Estado de lanzamiento

DocenteDigital no debe declararse lista para V1.0 mientras las áreas ofrecidas en Secundaria no tengan cobertura curricular real demostrada y continúen pendientes las demás pruebas esenciales de V5.
