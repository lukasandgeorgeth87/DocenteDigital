# AUD-SECONDARY-COMPETENCE-FALLBACK-219

## Hallazgo

DocenteDigital permite seleccionar en Secundaria, entre otras, las áreas `Ciencias Sociales`, `DPCC`, `Inglés` y `EPT`. Sin embargo, el runtime canónico `app.js` no define competencias oficiales para esas áreas dentro de `competenceFor(area,title)`.

Cuando una sesión se crea para cualquiera de esas áreas, la función cae en el fallback:

`Desarrolla la competencia priorizada del área de ${area}, de acuerdo con la unidad y el grado.`

Ese texto se muestra posteriormente dentro del documento como **Competencia priorizada**, pese a no ser el nombre de una competencia oficial del CNEB.

## Prueba principal

**ID:** AUD-SECONDARY-COMPETENCE-FALLBACK-219-A  
**Entrada:** Perfil = Secundaria; área = EPT; crear una sesión desde una unidad/actividad EPT.  
**Esperado:** la sesión debe usar una competencia oficial aplicable del CNEB y conservar trazabilidad de su fuente; para Educación para el Trabajo la referencia oficial vigente consultada identifica la competencia `Gestiona proyectos de emprendimiento económico o social`.  
**Obtenido:** `competenceFor('EPT', title)` no tiene rama específica y retorna el fallback genérico `Desarrolla la competencia priorizada del área de EPT, de acuerdo con la unidad y el grado.`  
**Evidencia:** `app.js`: `areaOptions()` ofrece `EPT`; `competenceFor()` no contiene rama EPT y termina en el fallback genérico. El mismo patrón afecta a `Ciencias Sociales`, `DPCC` e `Inglés`.  
**Resultado:** NO PASA.  
**Severidad:** S0 — bloqueante de prelananzamiento porque V5 prohíbe lanzar con competencias o normativa inventadas/no oficiales.  
**Clasificación:** selección del área = FUNCIONAL; generación de la sesión = PARCIAL; competencia curricular = ROTA; trazabilidad oficial = INEXISTENTE/NO DEMOSTRADA.  
**Acción:** sustituir el fallback presentado como competencia por un selector curricular oficial por nivel/área/propósito, con fuente y versión; cuando no pueda determinarse con seguridad la competencia, bloquear la afirmación y solicitar/requerir selección explícita en vez de fabricar una etiqueta curricular.

## Alcance adicional comprobado

- `Ciencias Sociales` está disponible en Secundaria pero carece de rama en `competenceFor()`.
- `DPCC` está disponible en Secundaria pero carece de rama en `competenceFor()`.
- `Inglés` está disponible en Secundaria pero carece de rama en `competenceFor()`.
- `EPT` está disponible en Secundaria pero carece de rama en `competenceFor()`.

Por tanto, no es un caso aislado de EPT sino una falla de cobertura curricular del nivel Secundaria.

## Relación con las auditorías maestras

- **V2:** exige que el sistema determine correctamente función, tipo de IE, información reutilizable, norma aplicable y que genere/audite documentos como sistema integral.
- **V3:** exige que una misma solicitud no varíe arbitrariamente en competencia oficial y que la información curricular tenga fuente única, procedencia y verificación.
- **V4:** el Modo Fácil puede proponer, pero no debe ocultar errores complejos detrás de una interfaz simple; el docente no debería tener que conocer la arquitectura para detectar una competencia inexistente.
- **V5:** la prueba anti-alucinación debe intentar provocar competencias inexistentes y el resultado obligatorio es NO INVENTAR; además, `normativa o competencias inventadas` es un bloqueante explícito del Prelaunch Gate.
- **NÚCLEO IA:** la fuente oficial debe prevalecer frente a propuestas IA; las guardas deben proteger currículo/normativa y registrar procedencia.

## Decisión de corrección

No se aplica parche automático en esta auditoría. Agregar cuatro cadenas hardcodeadas solucionaría solo casos superficiales y seguiría sin resolver áreas con varias competencias, la selección según propósito/título, capacidades/desempeños, grado, trazabilidad y actualización curricular. La corrección segura requiere una fuente curricular estructurada y tests dorados por nivel/área.

## Estado V5

BLOQUEANTE ABIERTO. DocenteDigital no debe aprobar el Prelaunch Gate mientras una sesión pueda presentar como competencia curricular un texto no oficial.
