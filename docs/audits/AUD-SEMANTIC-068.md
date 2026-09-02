# AUD-SEMANTIC-068 — Comprensión semántica real vs. interpretación local preliminar

## Especificaciones aplicadas
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

## Prueba
**ID:** AUD-SEMANTIC-068  
**Módulo:** Unidad / Proyecto — comprensión de descripción libre  
**Entrada representativa:** descripciones libres con finalidad explícita, términos no previstos y relaciones X→Y, por ejemplo un caso en que los saberes de una práctica agrícola se usan como fuente para una finalidad posterior distinta; también casos nuevos como hormigas en el aula.  
**Resultado esperado:** comprender intención, finalidad, problema/interés/oportunidad, territorio, restricciones y relaciones entre ideas antes de proponer título, situación, reto y producto; no depender de palabras clave; no inventar comunidad, problema, causas o finalidad.  
**Resultado obtenido:** `app.js` y `enhancements.js` generan título, reto, situación y producto mediante expresiones regulares/bancos locales (`siembr`, `papa`, `agua`, `residuo`, etc.) y plantillas que introducen repetidamente “comunidad”. El archivo `context-semantic-v20.js` se autodefine como `detección léxica preliminar, no sustituye comprensión semántica`, y su salida registra `analysisType: lexical-preliminary`. La producción tampoco carga ese archivo de forma directa en `index.html`; el flujo efectivo sigue apoyándose en las reglas locales del runtime principal.

## Estado
**NO PASA**  
**Severidad:** S1 — crítico para generación pedagógica confiable  
**Clasificación:** PARCIALMENTE FUNCIONAL / SIMULADA respecto de comprensión semántica real.

La aplicación sí produce propuestas y conserva parte del texto de entrada, pero no existe evidencia de la Capa A de IA semántica exigida por el Núcleo IA. Por ello no se puede aprobar comprensión de descripciones libres, finalidad X→Y, biohuerto, hormigas en el aula ni robustez ante términos nuevos.

## Causa raíz
El prototipo evolucionó con reglas deterministas locales, expresiones regulares, bancos de títulos/productos y plantillas contextuales. Esas guardas pueden ser útiles como respaldo estructural, pero actualmente están actuando como motor principal de interpretación, contrario al principio `Comprender → estructurar significado → verificar → proponer`.

## Corrección segura aplicada
Se evitó seguir presentando esta capacidad como terminada:
- el texto de ayuda de Unidad/Proyecto ahora indica que la interpretación actual es preliminar y que la comprensión semántica con IA real aún no está conectada;
- el botón pasa de `Crear propuesta completa` a `Crear propuesta preliminar`;
- el mensaje de éxito exige revisión antes de uso.

Cambio funcional: commit `89c3fceb27f12ccdf62987acad10164e4bae0c65`.

No se conectó una IA ficticia, no se añadió backend simulado y no se intentó resolver semántica general con más palabras clave.

## Evidencia posterior
- Vercel deployment del commit funcional: `dpl_8ZXoTeviVHszvaZqQrLuUnMQB3bN`.
- Estado: `production · READY`.
- `https://docente-digital.vercel.app/initial-curriculum-guard-v72.js`: HTTP 200 y sirve v72.8 con `markPlanningAsPreliminary()`.

## Pendiente para aprobar
Implementar y demostrar una Capa A de IA semántica real con salida estructurada y guardas locales posteriores. Ejecutar golden tests como mínimo para:
1. finalidad X→Y;
2. biohuerto;
3. hormigas en el aula;
4. interés sin convertirlo en problema;
5. territorio rural/urbano/periurbano sin asumir “comunidad”;
6. términos locales desconocidos;
7. EIB y monolingüe;
8. información contradictoria;
9. producto explícito e implícito;
10. pedidos de Docente y Director.

Las pruebas deben registrar entrada → perfil semántico → propuesta → auditoría → resultado y comprobar ausencia de invenciones.

## Riesgo de regresión
Bajo para la corrección aplicada: solo cambia la presentación honesta del estado funcional. El riesgo alto permanece en el motor actual si se usa la propuesta como documento final sin revisión.

## Impacto en métricas/gates
- **IUD/ICGD/IFR/ISU:** no se recalculan sin evidencia suficiente.
- **Prelaunch:** permanece bloqueado.
- Una puntuación alta no puede compensar este S1 ni los demás bloqueantes V5.
