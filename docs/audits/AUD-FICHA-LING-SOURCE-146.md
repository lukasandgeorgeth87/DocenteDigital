# AUD-FICHA-LING-SOURCE-146 — Perfil lingüístico fuera de la Ficha Maestra

## Especificaciones aplicadas

- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

## Prueba

**ID:** AUD-FICHA-LING-SOURCE-146  
**Módulo:** Ficha Maestra / Perfil lingüístico / EIB / Fuente única de verdad  
**Entrada:** configurar una IE como EIB, seleccionar lengua originaria y luego revisar/editar la Ficha Maestra institucional.  
**Resultado esperado:** EIB/monolingüe, lengua y variedad pertinentes deben pertenecer a la misma Ficha Maestra institucional y reutilizarse desde allí; cualquier contradicción debe detectarse sin elegir arbitrariamente un valor.  
**Resultado obtenido:** `institution-master-v46.js` mantiene `state.institutionMaster` con identidad, ubicación, gestión, organización, niveles, director/docente, cantidades y calendarios, pero no incorpora `linguisticMode`, `indigenousLanguage` ni variedad lingüística. `linguistic-profile-v26.js` persiste esos datos en campos globales separados (`state.linguisticMode`, `state.indigenousLanguage`, `state.quechuaVar`). `configurationWarnings()` de la Ficha Maestra solo contrasta organización y nivel, no perfil lingüístico.  
**Estado:** NO PASA  
**Clasificación:** PARCIALMENTE FUNCIONAL  
**Severidad:** S2 ALTO

## Causa raíz

La arquitectura lingüística se añadió como módulo transversal posterior y conserva compatibilidad con estado legado, pero no fue integrada al objeto `institutionMaster`. En consecuencia existen dos superficies de configuración para información que V2/V3 requieren tratar como dato institucional reutilizable y trazable.

## Riesgo

- discrepancia entre Ficha Maestra y configuración lingüística activa;
- reutilización incompleta en Docente/Director;
- cambio EIB → monolingüe sin una única procedencia institucional;
- dificultad para auditar qué valor era el vigente al crear un documento;
- riesgo de herencia incorrecta en unidades, sesiones y materiales.

No se afirma que ya exista un documento contaminado; el defecto probado es la duplicidad de fuente y la ausencia de validación cruzada.

## Acción correctiva

Migrar de forma pequeña y compatible los campos lingüísticos a `state.institutionMaster`, manteniendo temporalmente aliases de compatibilidad para módulos antiguos. Añadir validación de contradicciones y migración explícita de estados previos. No seleccionar automáticamente lengua o variedad por territorio.

Después ejecutar pruebas: EIB → guardar → recargar → sesión/material; EIB → monolingüe → recargar → comprobar limpieza de herencia; Ficha Maestra modificada → documento nuevo; documento histórico → confirmar que no cambia retroactivamente.

## Gate V5

Bloquea la demostración completa de Ficha Maestra como fuente única de verdad y la prueba E2E EIB/monolingüe. No se calcula ISU/IFR/Prelaunch Score definitivo.

## Evidencia técnica de esta pasada

- `main`: `a05fc0466433d0ab7e8b70dcdd3ca4831c705085`.
- Vercel producción: `dpl_9z78Jr5yh1Zg2zsYdKAK76Mz8gSN`, estado READY, target production, mismo SHA.
- Producción `https://docente-digital.vercel.app/`: HTTP 200.
- Errores runtime Vercel en la última hora: ninguno agrupado.

No se modificó lógica productiva porque la corrección exige migración de datos y pruebas de regresión EIB/monolingüe; se documentó el hallazgo sin simular resolución.
