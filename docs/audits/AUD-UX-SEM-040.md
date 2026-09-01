# AUD-UX-SEM-040 — Análisis léxico interno visible en Unidad/Proyecto

## Especificaciones aplicadas

- `AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `AUDITORIA_PRELANZAMIENTO_V5.md`
- `NUCLEO_IA_DOCENTEDIGITAL.md`

## Prueba

**ID:** AUD-UX-SEM-040  
**Módulo:** Unidad/Proyecto → descripción libre → apoyo semántico visible  
**Entrada:** escribir una descripción libre en `Idea o contexto de partida` y continuar/construir la unidad.  
**Esperado:** conservar internamente el análisis auxiliar, pero mostrar al docente solo una guía breve en lenguaje natural. No exponer palabras/frases detectadas, porcentajes, confianza ni telemetría técnica en el flujo normal.  
**Obtenido antes:** `context-semantic-v20.js` podía volver a pintar `🧠 Señales del texto detectadas (apoyo preliminar)` y chips con los conceptos/frases extraídos. Esto reintroducía una superficie técnica que ya se había retirado en otra capa y podía aparecer especialmente tras `ddBuildUnit`, porque ese listener volvía a ejecutar `paint()`.  
**Estado inicial:** NO PASA.  
**Severidad:** S3.  
**Clasificación:** PARCIALMENTE FUNCIONAL.

## Causa raíz

Existían dos capas históricas escribiendo sobre `#ddKeywordBox`. `context-keywords-v19.js` ya había simplificado la UI, pero `context-semantic-v20.js` conservaba su propia función `paint()` con visualización de conceptos internos. Según el orden de eventos, esa capa podía volver a mostrar el análisis técnico.

## Corrección

Cambio pequeño y reversible en `context-semantic-v20.js`: `paint()` deja de renderizar conceptos, frases o etiquetas de análisis y muestra únicamente una orientación breve: describir qué ocurre, qué interesa o qué se quiere lograr. El análisis léxico continúa guardándose internamente (`lastContextAnalysis`, `contextAnalysis`, `contextKeywords`) para compatibilidad y auditoría; no se altera la generación ni los datos históricos.

**Commit funcional:** `192d5914ce5959c0da88dd9f50f93d5073566ce3`.

## Retest

- Vercel deployment asociado al commit: `dpl_BfjBcwBWAPedqm8SU7Z3scWnJCiK`.
- Target: production.
- Estado Vercel: READY.
- `https://docente-digital.vercel.app/`: HTTP 200.
- `https://docente-digital.vercel.app/context-semantic-v20.js`: HTTP 200.
- El archivo productivo ya sirve el nuevo `paint()` sin `Señales del texto detectadas` ni chips de conceptos.

**Estado posterior de la defensa técnica:** PASA.  
**Clasificación del módulo:** PARCIALMENTE FUNCIONAL, porque ocultar la heurística no demuestra comprensión semántica real.

## Riesgo de regresión

Bajo-medio: otra capa de UI podría volver a pintar diagnósticos técnicos en el mismo contenedor. Conviene mantener una prueba automatizada que busque en la superficie Fácil expresiones como `palabras clave`, `señales detectadas`, `confidence`, `%`, `tokens`, `RAG`, `score` o conceptos extraídos del texto.

## Impacto en gates

- **V4 / ISU:** mejora claridad y reduce carga cognitiva; no se calcula ISU definitivo sin usuarios reales.
- **V3 / IFR:** elimina una inconsistencia visible, pero no demuestra funcionalidad semántica completa.
- **V5 / Prelaunch:** no cierra bloqueantes. Siguen pendientes IA semántica real, pruebas físicas móvil/Word/PDF, autenticación/aislamiento, backend, restore real, OWASP ASVS, 100 generaciones, año completo, concurrencia y pilotos.

## Normativa

Este hallazgo es de UX/arquitectura interna y no requiere declarar vigencia de una norma educativa. No se aplicó ninguna norma MINEDU sin verificación oficial.