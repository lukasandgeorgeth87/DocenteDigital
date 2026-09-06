# AUD-GLOBAL-SEARCH-MISSING-191 — Buscador único V4 inexistente

## Especificaciones obligatorias aplicadas

Se revisaron conjuntamente:
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

V4, punto 22, exige expresamente un **“Buscador único y sencillo”** capaz de buscar por tema, documento, fecha, estudiante o palabra relacionada. V4 también incluye `🔍 Mis documentos` para Docente y `🔍 Archivo` para Director.

## Prueba

**ID:** AUD-GLOBAL-SEARCH-MISSING-191  
**Módulo:** Navegación / archivo / recuperación de documentos.  
**Entrada:** usuario con varias unidades/proyectos y demás documentos guardados intenta localizar un trabajo por tema, documento, fecha, estudiante o palabra relacionada.  
**Resultado esperado:** disponer de un buscador único visible y sencillo que consulte los documentos accesibles sin exigir recorrer manualmente cada módulo.  
**Resultado obtenido:** la superficie productiva actual no ofrece buscador global ni acceso `Mis documentos`. El archivo de planificación `planning-archive-simplicity-v56.js` únicamente presenta contador, `Ver archivo`, listado de unidades/proyectos y acciones Abrir/Crear sesiones/Word/Eliminar; no implementa campo, índice, filtro ni función de búsqueda. La lista estable de módulos cargados por `schedule-prompt-v6.js` tampoco contiene un módulo de búsqueda o archivo global. La producción canónica sirve la misma superficie.  
**Evidencia:** `index.html`, `planning-archive-simplicity-v56.js`, `schedule-prompt-v6.js` en `main` y sus equivalentes servidos en `https://docente-digital.vercel.app/`.  
**PASA/NO PASA:** **NO PASA**.  
**Clasificación:** **INEXISTENTE** como buscador global; el listado simple de unidades permanece **PARCIALMENTE FUNCIONAL** como archivo local.  
**Severidad:** **S2 ALTO**.  

## Causa raíz

La simplificación V56 resolvió parcialmente la consulta del archivo de unidades/proyectos, pero se centró en reducir ruido visual. No existe todavía un índice documental transversal ni un contrato común de metadatos que reúna unidad/proyecto, sesión, evaluación, material, estudiante y futuro documento Director para permitir búsqueda única.

## Acción correctiva

No añadir un filtro aislado solo para `state.units`, porque aparentaría cumplir V4 sin cubrir la intención real. Implementar primero un índice documental común y luego un buscador único que:
1. respete rol y permisos;
2. busque al menos por título/tema, tipo de documento, fecha y palabras relacionadas;
3. incorpore estudiante solo cuando exista un modelo real y autorizado de estudiantes;
4. devuelva resultados con tipo, contexto y acción `Abrir`;
5. funcione en móvil y Modo Fácil;
6. mantenga separados históricos y datos maestros actuales;
7. no exponga datos de otro usuario/IE cuando exista backend multiusuario.

Hasta que exista backend/autenticación real, cualquier búsqueda se limita estrictamente al estado local del usuario y no puede considerarse validado el aislamiento multiusuario.

## Evidencia posterior requerida

- E2E con al menos varios tipos de documentos y términos repetidos;
- búsqueda por tema/título, tipo y fecha;
- búsqueda por estudiante cuando exista el modelo real;
- prueba móvil real;
- persistencia tras recarga;
- permisos/aislamiento cuando exista backend;
- prueba con archivo suficientemente grande para evaluar utilidad y rendimiento.

## Riesgo de regresión

Medio si se implementa de forma transversal: puede afectar navegación, apertura de históricos, filtros por rol y rendimiento. Bajo mientras este commit se limite a documentar el hallazgo.

## Impacto cualitativo

- **IUD:** negativo por recuperación incompleta de trabajo guardado.
- **ICGD:** negativo al no existir recuperación transversal Docente/Director.
- **IFR:** no cambia por sí solo, pero dificulta demostrar recuperación operativa.
- **ISU:** incumplimiento directo del requisito V4; no se calcula puntuación definitiva.
- **Prelaunch:** permanece bloqueado por otros S1 y pruebas reales V5, además de este S2.

## Normativa externa

Este hallazgo es de producto/UX definido por las especificaciones internas V4/V5; no se aplica ni declara vigente ninguna norma MINEDU/UGEL/legal externa en esta prueba.

## Veredicto

DocenteDigital **no está lista para lanzamiento V1.0**. Este hallazgo no sustituye ni reduce los bloqueantes V5 ya abiertos. No se calculan ISU/IFR/Prelaunch Score definitivos sin evidencia integral y usuarios reales.
