# AUD-SIGNIFICANT-SITUATION-PROBLEM-097

## Módulo
Núcleo de situación significativa / comprensión semántica.

## Estado inicial
PARCIALMENTE FUNCIONAL — NO PASA — S2 ALTO.

## Entrada
`Hay una plaga de moscas en la fruta del aula.`

## Esperado
Reconocer que el propio usuario expresó un problema, sin inventar causas ni consecuencias, y propagar esa clasificación a situación significativa, reto y producto.

## Obtenido antes
`classify()` no incluía `plaga` ni `infest`, aunque `audit()` sí usaba `plaga` para detectar problematización no autorizada. La misma palabra tenía dos tratamientos incompatibles dentro del mismo núcleo.

## Causa raíz
Inconsistencia entre el clasificador semántico y la auditoría anti-invención.

## Corrección
`significant-situation-core-v53.js` v53.4 incorpora `plaga|infest` en la clasificación de problema explícito. La corrección solo clasifica lo que ya escribió el usuario; no añade causas, consecuencias ni soluciones.

## Evidencia posterior
Producción sirve `significant-situation-core-v53.js` v53.4 por HTTP 200 y el commit funcional quedó con integración Vercel `success`.

## Regresión protegida
- `Aparecieron hormigas en el aula y los estudiantes quieren saber más sobre ellas.` continúa como interés/curiosidad.
- Una `plaga` o `infestación` explícita se trata como problema.
- No se convierte una simple observación en plaga.

## Riesgo de regresión
Bajo. Cambio acotado al clasificador del núcleo.

## Impacto
Mejora ICGD/IFR/Prelaunch en coherencia semántica. No habilita por sí mismo IA real ni aprueba V5.

## Pendientes V5 relacionados
Pruebas de lenguaje natural no codificado, 100 generaciones, usuarios reales, IA semántica real y validación pedagógica integral siguen PENDIENTES.
