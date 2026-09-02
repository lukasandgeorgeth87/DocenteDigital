# AUD-TERRITORIAL-ACTORS-088 — Actores familiares no aportados

## Alcance
Auditoría acumulativa DocenteDigital usando conjuntamente V2, V3, V4, V5 y NUCLEO_IA_DOCENTEDIGITAL.

## Prueba
**ID:** AUD-TERRITORIAL-ACTORS-088  
**Módulo:** Unidad / Proyecto — comprensión semántica y territorialidad  
**Entrada:** descripción libre de una situación que no menciona familias, padres, madres, abuelos ni actores familiares (por ejemplo, un interés o problema del aula/entorno).  
**Esperado:** título, situación, reto, producto, propósitos, desempeños, criterios y enfoques no deben introducir actores familiares que el usuario no proporcionó.  
**Obtenido antes:** `enhancements.js` contiene salidas legado que pueden introducir `nuestras familias`, `saberes familiares` y `experiencias familiares y comunitarias`, además de referencias territoriales genéricas. La guardia territorial v61 ya neutralizaba comunidad/Ccotataqui en borradores nuevos, pero no detectaba ni neutralizaba actores familiares inventados.  
**Evidencia previa:** código fuente de `enhancements.js` y `territorial-generation-guard-v61.js`.  
**Resultado previo:** **NO PASA**.  
**Severidad:** **S2 ALTO** — error silencioso de coherencia semántica/actores inventados.  
**Clasificación previa:** **PARCIALMENTE FUNCIONAL**.

## Causa raíz
Las capas legado generan variaciones mediante reglas/palabras clave y asumen que determinados temas rurales implican automáticamente participación familiar. Esto contradice el Núcleo IA: los actores y el territorio deben conservarse cuando fueron expresados, no inventarse por asociación temática.

## Corrección aplicada
Commit funcional: `b009b27873a5f14fa38de52fb2d5496c46b34529`.

Se amplió `territorial-generation-guard-v61.js` de forma pequeña y reversible:

- añade `contextAllowsFamily(unit)` para detectar únicamente actores familiares expresados en el texto del usuario;
- en borradores nuevos, neutraliza `nuestras familias`, `saberes familiares`, `saberes de nuestras familias`, `experiencias familiares y comunitarias` y `de las familias` cuando el usuario no aportó esos actores;
- conserva esas expresiones cuando sí aparecen en la descripción original;
- añade `unauthorizedFamily` a `ddAuditTerritorialGeneration()`;
- mantiene las protecciones existentes: no modifica documentos históricos/emitidos/aprobados y no reemplaza productos/situaciones marcados como aportados por el docente.

## Evidencia posterior
- GitHub Actions `Prelaunch Smoke`, run `33632678031`: `completed / success` para el commit funcional.
- Vercel deployment `dpl_GjLgmntWFzgJ6QM1z57uDY2gHiSu`: `production / READY` para el mismo SHA.
- `https://docente-digital.vercel.app/`: HTTP 200 después del despliegue.
- `https://docente-digital.vercel.app/territorial-generation-guard-v61.js`: HTTP 200 y contiene `contextAllowsFamily` y `unauthorizedFamily`.

## Retest / estado
**Resultado posterior del defecto concreto:** **PASA a nivel de integración técnica de la guardia**.  
**Clasificación del núcleo semántico global:** **PARCIALMENTE FUNCIONAL**. Esta corrección no demuestra IA semántica real ni sustituye las pruebas de finalidad X→Y, biohuerto, hormigas, urbano/periurbano, EIB/monolingüe, 100 generaciones o usuarios reales.

## Riesgo de regresión
Bajo–medio. La guardia actúa solamente sobre borradores nuevos y sobre expresiones concretas no sustentadas. Debe retestearse cuando se sustituya la lógica legado por IA semántica real para evitar duplicar transformaciones.

## Impacto en indicadores
- **IUD/ICGD/IFR/ISU/Prelaunch:** mejora cualitativa puntual de coherencia y reducción de error silencioso; **no se asigna puntuación definitiva** sin evidencia integral y usuarios reales.
- No elimina bloqueantes V5 existentes.

## Fuente oficial/normativa
No se aplicó ni declaró vigente una norma educativa nueva en esta corrección. La decisión se deriva de las especificaciones internas obligatorias de DocenteDigital sobre no invención, comprensión semántica y territorialidad.

## Gate V5
DocenteDigital sigue **NO APROBADA PARA LANZAMIENTO V1.0** mientras falten, entre otras evidencias esenciales: IA semántica real, Ficha Maestra completa, Programación, Materiales, Evaluación/Registro, Director E2E, autenticación/aislamiento/backend, auditoría OWASP ASVS y privacidad, restore real, Word/PDF/impresión físicos, móvil físico, 100 generaciones, año completo, concurrencia, monitoreo/costos, separación efectiva de entornos, rollback probado y pilotos reales.
