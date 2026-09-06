# AUD-TERRITORIALITY-COMMUNITY-FALLBACK-192 — Territorialidad: fallback indebido a “la comunidad”

## Especificaciones obligatorias aplicadas

Se revisaron conjuntamente:
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

El Núcleo IA exige usar el territorio real sin asumir “comunidad”, conservar términos explícitos y no inventar datos territoriales que el usuario no proporcionó.

## Prueba

**ID:** AUD-TERRITORIALITY-COMMUNITY-FALLBACK-192  
**Módulo:** Contexto / territorialidad / generación de Unidad-Proyecto.  
**Entrada:** usuario describe una situación sin indicar comunidad/localidad en la Ficha/contexto, por ejemplo un contexto urbano o una necesidad escolar genérica.  
**Resultado esperado:** la app debe conservar el carácter territorial no especificado, pedir aclaración solo si fuera imprescindible o redactar de forma neutral; nunca debe convertir por defecto el escenario en “la comunidad”.  
**Resultado obtenido:** `context-audit-v8.js` implementa `placeFromBrief()` con retorno final `"la comunidad"` cuando no existe `teacherContext.community` y el texto no contiene Ccotataqui/Cotataqui. `contextualize()` trata ese valor como fallback y deja intactas expresiones base como `En la comunidad` / `de la comunidad`. Además, al finalizar la unidad asigna un propósito fijo que dice `situación real de su comunidad` y `lo que saben sus familias`, aunque esos elementos no necesariamente fueron expresados por el usuario.  
**Evidencia:** `context-audit-v8.js` en `main`; el archivo forma parte de la cadena runtime productiva del proyecto.  
**PASA/NO PASA:** **NO PASA**.  
**Clasificación:** **PARCIALMENTE FUNCIONAL** para contextos realmente comunales; **ROTA** para entradas no comunales o territorialidad no especificada.  
**Severidad:** **S2 ALTO**.  

## Causa raíz

La capa de contextualización nació orientada a escenarios rurales/comunales y conserva un fallback territorial fijo. La lógica actual mezcla personalización válida con una inferencia no sustentada: si falta territorio, asume comunidad en lugar de mantener neutralidad semántica.

## Acción correctiva

No reemplazar globalmente `comunidad` por `localidad`, porque también sería una inferencia. Implementar una regla explícita:
1. si el usuario/Ficha Maestra proporciona comunidad/localidad/territorio, conservarlo literalmente;
2. si el texto contiene un lugar explícito, conservarlo sin normalizarlo a “comunidad”;
3. si no existe territorio suficiente, redactar de forma neutral (`en su contexto`, `en el entorno descrito`) o marcar el dato como faltante;
4. no agregar `familias`, `comunidad`, práctica comunal ni saber familiar salvo que estén sustentados;
5. heredar el snapshot territorial aprobado hacia Unidad → Sesiones → Materiales → Evaluación;
6. añadir pruebas rural, urbana, periurbana, EIB y monolingüe.

No se aplica corrección automática de runtime en este hallazgo porque el mismo supuesto aparece en plantillas y propósito de unidad; corregir solo una función podría dejar contradicciones internas. La corrección requiere una regla transversal de territorialidad y retest semántico.

## Evidencia posterior requerida

- entrada urbana sin palabra “comunidad” → salida sin comunidad inventada;
- entrada rural con comunidad explícita → conservación literal;
- lugar desconocido/local → conservación del término original;
- texto sin territorio → salida neutral o dato faltante, no inventado;
- verificación de herencia Unidad → Sesión;
- prueba EIB/monolingüe sin inferir lengua por ubicación.

## Normativa externa

Este hallazgo deriva de las especificaciones internas de DocenteDigital y del Núcleo IA. No se declara ni utiliza una norma externa MINEDU/UGEL/legal para sustentar esta prueba.

## Veredicto

DocenteDigital **no está lista para lanzamiento V1.0**. El hallazgo mantiene los bloqueantes V5 previos y demuestra que la territorialidad todavía no cumple la regla de no asumir “comunidad”.