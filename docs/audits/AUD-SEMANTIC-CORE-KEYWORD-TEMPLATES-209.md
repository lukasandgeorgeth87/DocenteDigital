# AUD-SEMANTIC-CORE-KEYWORD-TEMPLATES-209

## Estado
- Fecha de auditoría: 2026-09-06
- Módulo: Unidad / Proyecto → comprensión de contexto → título → situación significativa → reto → producto
- Resultado: **NO PASA**
- Severidad: **S1 CRÍTICO**
- Clasificación: **PARCIALMENTE FUNCIONAL / SEMÁNTICAMENTE ROTA para descripciones libres**
- Gate V5: **BLOQUEADO**

## Especificaciones aplicadas
Se aplican conjuntamente:
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

El Núcleo IA exige: **Comprender → estructurar significado → verificar contexto/normativa → proponer → auditar coherencia → decisión profesional**; prohíbe usar bancos cerrados de palabras/títulos/productos como inteligencia principal y exige preservar la finalidad explícita.

## Evidencia productiva
La producción canónica carga `app.js` y `enhancements.js`.

En `app.js`, `proposeUnitTitle()`, `expandSituation()` y `proposeProduct()` deciden mediante expresiones regulares cerradas como:
- `/siembr|papa|tarpuy|añu|oca|olluco/`
- `/pachamama|madre tierra/`
- `/agua|yaku/`
- `/residuo|basura|contamin/`

Cuando no hay coincidencia se usa una plantilla genérica de “comunidad”.

`enhancements.js`, que sí se ejecuta en producción, vuelve a aplicar la misma estrategia en `ddReto()` y `ddProduct()`. Para cualquier entrada que contenga una palabra de siembra, `ddProduct()` retorna incluso **“Gran Libro de la Siembra de Ccotataqui…”**, aunque el usuario no haya indicado Ccotataqui.

El repositorio contiene `context-semantic-v20.js`, pero ese archivo declara expresamente que su análisis es `lexical-preliminary`, que **NO infiere intención, finalidad ni relaciones causales**; además no está cargado por el HTML canónico actual.

## Prueba 209-A — finalidad X→Y / biohuerto
### ID
`AUD-SEM-209-A`

### Entrada
“En Ccotataqui se realiza la siembra de tubérculos y productos verdes. Hablaremos sobre esos conocimientos y los volcaremos para sembrar hortalizas en nuestro biohuerto.”

### Resultado esperado
La comprensión debe distinguir:
- fuente de aprendizaje: saberes de la siembra;
- finalidad: aplicar esos saberes para sembrar hortalizas en el biohuerto.

Título, situación significativa, reto, producto, actividades y evidencias deben conducir al biohuerto.

### Resultado obtenido por el runtime productivo
La presencia de `siembr` activa directamente la rama cerrada de siembra:
- título base: “Aprendemos y participamos en la siembra de nuestra comunidad”;
- situación significativa: plantilla centrada en el proceso de siembra;
- reto de `enhancements.js`: qué aprender de la siembra y cómo integrar saberes familiares/escolares;
- producto: “Gran Libro de la Siembra de Ccotataqui y muestra comunitaria…”.

La finalidad explícita **biohuerto** no gobierna la salida.

### Resultado
**NO PASA — S1 CRÍTICO.**

### Causa raíz
Selección por coincidencia de palabras dominantes en lugar de un perfil semántico que separe fuente, finalidad, actores, restricciones y producto esperado.

## Prueba 209-B — contexto libre no previsto / hormigas
### ID
`AUD-SEM-209-B`

### Entrada
“Los estudiantes quieren saber sobre las hormigas que encontraron en el aula.”

### Resultado esperado
Interpretar un interés/curiosidad auténtico, conservar `hormigas` + `aula`, no convertirlo automáticamente en problema comunitario y proponer un reto/producto pertinente al interés investigable.

### Resultado obtenido por inspección determinista del runtime
No existe rama semántica para hormigas. El sistema cae al fallback:
- título genérico de situaciones de “nuestra comunidad”;
- situación genérica que agrega experiencias, saberes, necesidades y oportunidades;
- reto genérico sobre “el reto de nuestra comunidad”;
- producto genérico.

No se demuestra comprensión específica de curiosidad, aula, observación de hormigas ni finalidad investigable.

### Resultado
**NO PASA — S1 CRÍTICO.**

## Prueba 209-C — territorialidad no rígida
### ID
`AUD-SEM-209-C`

### Entrada
Una descripción de siembra que no menciona Ccotataqui.

### Resultado esperado
Conservar únicamente el territorio explícito o dejarlo pendiente; nunca inventar comunidad/localidad.

### Resultado obtenido
`enhancements.js::ddProduct()` hardcodea “Gran Libro de la Siembra de Ccotataqui…” para toda coincidencia de siembra. `app.js` y otros fallbacks también presuponen “la comunidad”.

### Resultado
**NO PASA — S1 CRÍTICO.**

## Riesgo
El error es silencioso: la aplicación genera contenido fluido y aparentemente contextualizado, pero puede cambiar la finalidad real, insertar una territorialidad no declarada y convertir intereses en plantillas comunitarias. Esto afecta título, situación, reto, producto, secuencia y posteriormente sesiones/evaluación por herencia.

## Acción correctiva
No corregir agregando más palabras clave ni nuevos casos `if`. Eso ampliaría el banco cerrado y no resolvería el Núcleo IA.

La corrección requiere:
1. una capa semántica real que produzca un perfil estructurado con `raw`, `focus`, `intent`, `finality`, `situationType`, `actors`, `place`, `constraints`, `explicitProduct`, `missingData`, `confidence` y procedencia;
2. guardas locales que impidan inventar territorio, actores, problemas, causas, consecuencias o productos;
3. herencia del perfil aprobado Unidad → Sesiones → Materiales → Evaluación → Registro;
4. golden tests obligatorios para biohuerto, hormigas, contexto urbano, EIB/monolingüe, términos locales desconocidos, varias finalidades y datos contradictorios;
5. prueba E2E en el navegador productivo, no solo prueba de funciones aisladas.

## Corrección aplicada en esta ejecución
**NINGUNA al runtime.** Implementar comprensión semántica real afecta arquitectura/IA y no es un cambio pequeño y seguro. No se simula una solución añadiendo más regex.

## Impacto en indicadores
- IUD: afectado; una unidad puede desviarse de la finalidad real.
- ICGD: afectado por pérdida de coherencia entre intención, reto, producto y secuencia.
- IFR: afectado por necesidad de reelaborar una planificación aparentemente terminada.
- ISU: no se calcula; una salida fluida pero incorrecta aumenta corrección y desconfianza.
- Prelaunch: **BLOQUEADO por S1**.

## Pendientes de evidencia real V5
Continúan pendientes usuarios reales, dispositivo móvil físico, 100 generaciones, Word/PDF físicos, año completo, concurrencia cuando exista backend multiusuario, restore real, aislamiento/seguridad y pilotos.

## Conclusión
DocenteDigital no puede declararse lista para V1.0 mientras el flujo principal de Unidad/Proyecto use coincidencias léxicas y plantillas cerradas como comprensión principal. La calidad semántica debe demostrarse con casos libres y finalidad explícita, no por apariencia textual.