# AUD-IA-SEMANTIC-159 — Núcleo semántico productivo sin intérprete IA real demostrado

## Alcance
Auditoría acumulativa basada conjuntamente en `AUDITORIA_MAESTRA_INTEGRAL_V2.md`, `ADENDA_AUDITORIA_EJECUTABLE_V3.md`, `AUDITORIA_SIMPLICIDAD_USO_V4.md`, `AUDITORIA_PRELANZAMIENTO_V5.md` y `NUCLEO_IA_DOCENTEDIGITAL.md`.

## ID de prueba
**AUD-IA-SEMANTIC-159**

## Módulo
Núcleo IA / comprensión de lenguaje natural / Unidad-Proyecto / Director.

## Entrada
Pedidos libres que no deben depender de palabras previamente programadas, incluyendo como regresiones prioritarias:

1. `Aparecieron hormigas en el aula y los estudiantes quieren saber más sobre ellas.`
2. `En Ccotataqui se realiza la siembra de tubérculos y productos verdes. Hablaremos sobre esos conocimientos y los volcaremos para sembrar hortalizas en nuestro biohuerto.`
3. Un pedido nuevo con término local/desconocido no presente en los bancos de expresiones.

## Resultado esperado
El Núcleo IA exige el orden **Comprender → estructurar significado → verificar contexto y normativa → proponer → auditar coherencia → permitir decisión**. También exige una Capa A de modelo de IA semántico capaz de interpretar relaciones entre ideas, finalidad, ambigüedad y expresiones nunca programadas, mientras las guardas locales actúan como Capa B de protección.

La V3 exige demostrar funcionalidad real; una función no aprueba por existir una pantalla, una estructura interna o una respuesta plausible.

## Resultado obtenido
`intelligence-core-v44.js` define `interpretAsync()` y solo utiliza una capa remota cuando existe `window.ddRemoteSemanticInterpreter`. Si esa función no existe, retorna directamente `local`, cuyo campo `engine` es `local-semantic-fallback`.

El intérprete local se apoya en expresiones regulares, listas de verbos y motores locales auxiliares. El propio archivo indica que el intérprete IA remoto es una posibilidad futura (`si más adelante existe un intérprete IA remoto seguro`).

En el árbol actual del repositorio no se encontró una ruta backend/API que demuestre una implementación productiva de ese intérprete remoto, y el cargador estable de `schedule-prompt-v6.js` solo carga módulos JavaScript cliente. La producción sirve la misma arquitectura estática.

Esto NO significa que todos los casos fallen: existen guardas y regresiones locales específicas para biohuerto, hormigas, finalidad y territorialidad. Significa que actualmente no está demostrado el requisito más amplio del Núcleo IA: comprender de forma general expresiones nuevas sin depender principalmente de reglas previamente codificadas.

## Evidencia
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`: exige IA semántica real + guardas locales y prohíbe usar bancos cerrados como inteligencia principal.
- `intelligence-core-v44.js`: `interpretAsync()` devuelve el fallback local cuando `window.ddRemoteSemanticInterpreter` no existe y declara `engine:'local-semantic-fallback'`.
- `schedule-prompt-v6.js`: manifiesto productivo de módulos cliente; no demuestra una capa remota semántica.
- Árbol `main` del repositorio auditado en el commit previo `1d335538a82f8946997694ab11586b6527b7f601`: no se identificó una ruta backend/API que implemente y pruebe el contrato `ddRemoteSemanticInterpreter`.
- Producción `https://docente-digital.vercel.app/` y `/app.js`: HTTP 200 y arquitectura cliente actual.

## PASA / NO PASA
**NO PASA**

## Clasificación
**PARCIALMENTE FUNCIONAL**

La capa local es funcional como respaldo y contiene guardas valiosas, pero la Capa A de IA semántica definida por la especificación no está demostrada como funcional en producción.

## Severidad
**S1 CRÍTICO para el Prelaunch V5**

Motivo: afecta el núcleo que determina intención, finalidad, título, situación significativa, reto y producto. Una mala interpretación puede producir una planificación pedagógicamente incorrecta aunque no exista error técnico. No se clasifica S0 porque en esta prueba no se demostró fuga, pérdida irreversible ni acto administrativo con norma inventada.

## Causa raíz
La arquitectura actual evolucionó mediante múltiples motores y guardas locales de regresión antes de conectar y validar una capa semántica general de IA. Esto mejora casos conocidos, pero no prueba generalización ante lenguaje nuevo.

## Acción correctiva
1. Implementar un intérprete semántico remoto seguro con salida estructurada compatible con `DocenteDigital.SemanticProfile`.
2. Mantener guardas locales como validación, no como sustituto de comprensión general.
3. No enviar secretos desde el cliente; usar backend seguro.
4. Validar salida contra Ficha Maestra, perfil lingüístico, currículo y fuentes oficiales cuando corresponda.
5. Mantener procedencia: usuario / IA / fuente oficial / cálculo.
6. Ejecutar golden tests y pruebas adversariales con lenguaje nuevo, errores ortográficos, términos locales, rural/urbano/periurbano, EIB/monolingüe y Director.
7. Probar específicamente biohuerto y hormigas, pero no limitar la validación a estos casos conocidos.
8. Ejecutar batería de 100 generaciones antes de cerrar V5.

## Repruebas obligatorias
- Expresión totalmente nueva que no aparezca en bancos locales.
- Finalidad X→Y en posición inicial, media y final.
- Hormigas: interés/curiosidad, sin convertirlo automáticamente en problema.
- Biohuerto: saberes de siembra como fuente y sembrar hortalizas como finalidad.
- Texto con mala ortografía.
- Término quechua/local desconocido.
- Urbano/periurbano sin forzar `comunidad`.
- Cambio EIB → monolingüe sin herencia indebida.
- Pedido Director ambiguo: preguntar solo lo indispensable y nunca inventar norma, autoridad, acuerdo o firma.

## Riesgo de regresión
**ALTO**. Conectar IA real puede cambiar títulos, retos y productos y debe quedar detrás de un contrato estructurado y golden tests antes de sustituir el fallback.

## Impacto en indicadores
- **IUD:** pendiente; puede mejorar si reduce correcciones de interpretación.
- **ICGD:** afectado directamente por coherencia semántica entre contexto, reto y producto.
- **IFR:** pendiente; una mala interpretación puede aumentar reelaboración.
- **ISU:** indirecto; la promesa `crear con una frase` depende de esta capa.
- **Prelaunch:** bloquea aprobación del Núcleo IA hasta existir evidencia productiva real.

## Estado acumulativo
**ABIERTO / PENDIENTE DE BACKEND + IA REAL + PRUEBAS.**

No se calcula puntuación definitiva y no se declara DocenteDigital lista para lanzamiento.