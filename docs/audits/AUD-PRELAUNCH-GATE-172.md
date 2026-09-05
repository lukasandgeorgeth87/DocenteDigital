# AUD-PRELAUNCH-GATE-172 — El smoke de prelaunch no bloquea la publicación productiva

## Alcance
Auditoría acumulativa V2 + V3 + V4 + V5 + Núcleo IA. Hallazgo de CI/CD y puerta de lanzamiento. No modifica CUSCO-DECIDE-ELECCIONES-2026.

## ID de prueba
AUD-PRELAUNCH-GATE-172

## Módulo
Prelaunch Gate · CI/CD · Producción · Rollback / control de publicación

## Entrada
1. Revisar V5 sección 15 y el principio de gate: antes de cada publicación deben ejecutarse pruebas mínimas y una falla crítica debe impedir publicar.
2. Revisar `.github/workflows/prelaunch-smoke.yml` y su disparador.
3. Comparar cronológicamente una ejecución real del workflow con el deployment productivo del mismo SHA en Vercel.
4. Confirmar el SHA desplegado, estado READY y disponibilidad HTTP.

## Resultado esperado
El candidato de producción debe pasar primero el gate exigido. Como mínimo, el mecanismo de publicación debe impedir que un SHA sea promovido a producción antes de que terminen satisfactoriamente las pruebas obligatorias configuradas para ese candidato. V5 además exige separar desarrollo/pruebas/producción y mantener rollback rápido.

Un workflow que corre en paralelo a producción puede servir como observación, pero no como puerta previa real.

## Resultado obtenido
El repositorio contiene un único workflow principal: `.github/workflows/prelaunch-smoke.yml`. Se dispara con `push` a `main` y `pull_request` a `main`. El propio workflow declara al final que solo es un `technical smoke gate` y que no valida todavía móvil físico, Word/PDF real, backend, OWASP ASVS, restore, IA semántica, concurrencia ni pilotos.

Para el SHA `6ddf550d3e86fbda7b2a6d68721cc54b4c9ef981` se observó:

- GitHub Actions `Prelaunch Smoke` inició el 2026-09-05 a las 10:26:17 UTC.
- El deployment productivo de Vercel `dpl_CWFTSdVmxzB8xc2wonAVsC2jRZX4` fue creado a las 10:26:17.244 UTC para el mismo SHA.
- Vercel marcó ese deployment como READY a las 10:26:21.942 UTC.
- El workflow `Prelaunch Smoke` terminó con `success` a las 10:26:29 UTC.

Por tanto, producción quedó READY aproximadamente 7 segundos antes de que el smoke terminara. Esto demuestra que el workflow actual no está interpuesto como condición previa de promoción productiva para ese flujo de Git → Vercel.

La producción sí respondió HTTP 200 en la reprueba posterior y el deployment observado está READY. Eso demuestra disponibilidad, no cumplimiento del gate V5.

## Evidencia
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`, sección 15: pruebas automáticas antes de publicar; si falla una función crítica, NO PUBLICAR; separar desarrollo/pruebas/producción y mantener rollback rápido.
- `.github/workflows/prelaunch-smoke.yml`: `push`/`pull_request` sobre `main` y alcance explícitamente limitado a smoke técnico.
- GitHub Actions run del SHA `6ddf550d3e86fbda7b2a6d68721cc54b4c9ef981`: inicio 10:26:17 UTC y finalización exitosa 10:26:29 UTC.
- Vercel deployment `dpl_CWFTSdVmxzB8xc2wonAVsC2jRZX4`: mismo SHA; target `production`; created 10:26:17.244 UTC; READY 10:26:21.942 UTC.
- Producción `https://docente-digital.vercel.app/`: HTTP 200 en la reprueba de esta pasada.

## PASA / NO PASA
NO PASA

## Clasificación
PARCIALMENTE FUNCIONAL

Existe CI técnico y se ejecuta correctamente, pero no constituye todavía una puerta previa efectiva para producción.

## Severidad
S1 — CRÍTICO para Prelaunch V5.

Justificación: V5 exige explícitamente que una falla crítica impida publicar. Si producción puede quedar READY antes de concluir el gate configurado, un commit con una falla detectable por ese gate podría ser servido temporal o permanentemente antes de que el CI lo rechace. No se clasifica S0 porque en esta prueba no se demostró fuga, pérdida irreversible, privilegio indebido ni corrupción efectiva de datos/documentos.

## Causa raíz
La integración Git de Vercel despliega automáticamente `main` a producción y GitHub Actions ejecuta el smoke de manera paralela al mismo `push`. No existe evidencia de una etapa de promoción posterior condicionada al éxito del workflow ni de un entorno de staging/preview obligatorio antes de producción.

## Acción correctiva
PENDIENTE de arquitectura CI/CD. No debe simularse cambiando solo el texto del workflow.

Diseño recomendado:
1. dejar que cada commit/PR genere Preview o entorno de pruebas;
2. ejecutar allí el smoke técnico y, progresivamente, los gates V5 automatizables;
3. impedir promoción a producción si falla cualquier prueba S0/S1 definida;
4. promover a producción solo un SHA ya validado;
5. conservar evidencia del SHA probado y del SHA promovido;
6. configurar y probar rollback hacia un deployment previamente conocido como bueno;
7. separar claramente desarrollo, pruebas/preview y producción;
8. cuando existan las suites faltantes, incorporar Docente, Director, multigrado, Unidad, Proyecto, Sesión, Evaluación, Registro, Oficio, RD, Informe, guardado, buscador, Word/PDF, móvil automatizable, seguridad, IA y normativa según V5.

## Reprueba obligatoria
1. Introducir en una rama/candidato una falla deliberada que el smoke detecte (por ejemplo, un error de sintaxis en un archivo controlado).
2. Confirmar que el candidato falla en Preview/CI.
3. Confirmar que producción NO cambia al SHA fallido.
4. Corregir el fallo, ejecutar nuevamente el gate y confirmar éxito.
5. Promover el SHA aprobado y confirmar coincidencia SHA probado ↔ SHA productivo.
6. Ejecutar un rollback controlado a un deployment anterior y documentar resultado.

## Riesgo de regresión
MUY ALTO mientras el despliegue de `main` a producción siga siendo paralelo al gate. Un smoke más completo no resolverá el riesgo si no está ubicado antes de la promoción.

## Impacto en indicadores
- IUD: PENDIENTE; este hallazgo no permite calcularlo.
- ICGD: PENDIENTE; riesgo indirecto por publicación de regresiones.
- IFR: NEGATIVO / PENDIENTE de medición: el proceso de release no garantiza que la validación anteceda a producción.
- ISU: sin cálculo; no sustituye pruebas de usuarios.
- Prelaunch: BLOQUEADO hasta demostrar gate preproductivo efectivo y rollback probado.

## Estado
ABIERTO / PENDIENTE DE REDISEÑO DE PROMOCIÓN CI/CD + REPRUEBA DE BLOQUEO + ROLLBACK REAL.
