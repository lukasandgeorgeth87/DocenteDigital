# AUD-INSTITUTION-MASTER-169 — Ficha Maestra incompleta frente a V2/V3/V5

## Alcance
Auditoría acumulativa de la Ficha Maestra de la IE como fuente única de verdad para Carpeta Docente y Carpeta Director.

## Especificaciones aplicadas
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`: la Ficha Maestra debe registrar una sola vez y reutilizar, entre otros, modalidad, turnos, característica, secciones y recursos disponibles.
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`: datos institucionales desde una fuente maestra única; no deben duplicarse ni contradecirse.
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`: configuración una sola vez y reutilización automática.
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`: Perfil/Ficha institucional es parte esencial del flujo E2E Docente y Director.

## ID de prueba
AUD-INSTITUTION-MASTER-169

## Módulo
Configuración → Ficha Maestra de la IE / fuente única de verdad.

## Entrada
Abrir Configuración y contrastar los campos que el usuario puede registrar y persistir en `institution-master-v46.js` contra la lista obligatoria de la Ficha Maestra definida por V2.

## Resultado esperado
El usuario puede registrar una sola vez todos los datos institucionales necesarios para alimentar de forma consistente documentos Docente y Director, incluyendo cuando correspondan:
- modalidad;
- turnos;
- característica;
- secciones;
- recursos disponibles;
además del resto de datos ya previstos.

Los datos deben quedar persistidos y disponibles para reutilización sin volver a preguntarlos en cada documento.

## Resultado obtenido
La implementación actual sí dispone de una Ficha Maestra real y persistente en el estado local, con campos como IE, códigos, UGEL, DRE/GRE, ubicación, ámbito, gestión, organización, director/docente, número de docentes/estudiantes, niveles y calendarios.

Sin embargo, el formulario visible y el objeto guardado no cubren completamente el esquema obligatorio de V2:
- `shifts` existe en el objeto, pero no hay control visible para registrar/editar turnos;
- no existe un campo visible equivalente para modalidad;
- no existe un campo visible equivalente para característica de la IE;
- no existe captura estructurada de secciones;
- no existe captura estructurada de recursos disponibles.

Por tanto, la Ficha Maestra no puede actuar todavía como fuente completa para todos los documentos Docente/Director previstos por V2/V5.

## Evidencia técnica
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md` — sección “UNA SOLA BASE INSTITUCIONAL”.
- `institution-master-v46.js` — `initialMaster()`, `mountSettings()` y `saveMaster()`.

## PASA / NO PASA
**NO PASA**

## Clasificación
**PARCIALMENTE FUNCIONAL**

## Severidad
**S2 ALTO**

No se clasifica S1/S0 porque la prueba no demuestra por sí sola pérdida, fuga o documento incorrecto emitido; demuestra una brecha estructural que puede causar repetición, omisión o solicitudes adicionales en flujos posteriores.

## Causa raíz
La Ficha Maestra se implementó de forma incremental y cubre el núcleo institucional, pero todavía no se cerró el contrato completo de datos definido por V2 antes de conectar todos los documentos Docente/Director.

## Acción correctiva
1. Definir un esquema versionado de `institutionMaster` alineado con V2 y con aplicabilidad condicional por tipo/nivel de IE.
2. Añadir únicamente los campos realmente necesarios y contextualizados, evitando un formulario gigante.
3. Para turnos/secciones/recursos usar controles simples y repetibles.
4. Mantener procedencia de dato (usuario/fuente oficial/importación) cuando se implemente V3 completo.
5. Crear migración no destructiva desde el estado actual.
6. Probar guardar → recargar → editar → reutilizar en Unidad/Sesión/Director.
7. No modificar históricos emitidos al actualizar la Ficha Maestra.

## Corrección realizada en esta pasada
**No se modificó el esquema.** Añadir estos campos afecta contrato de datos, migración, UX y reutilización en documentos posteriores; no es una corrección pequeña suficientemente demostrable para hacerla sin una prueba integral de regresión.

## Evidencia posterior requerida
- prueba de persistencia de cada nuevo campo;
- reapertura tras recarga/cierre;
- reutilización automática en al menos un documento Docente y uno Director;
- ausencia de solicitud duplicada;
- prueba de modificación de Ficha Maestra sin alterar históricos ya emitidos.

## Riesgo de regresión
MEDIO/ALTO si se añaden campos sin migración: puede romper estados previos, aumentar complejidad del onboarding o generar contradicciones entre configuración activa y Ficha Maestra.

## Impacto
- IUD: negativo mientras falten datos y haya que volver a escribirlos.
- ICGD: negativo por fuente maestra incompleta.
- IFR: impacto indirecto en documentos que dependan de datos faltantes.
- ISU: no calcular puntuación; añadir campos sin diseño progresivo podría empeorar simplicidad.
- Prelaunch: mantiene pendiente el gate E2E de Perfil/Ficha institucional.

## Estado de lanzamiento
Este hallazgo no autoriza a declarar DocenteDigital lista para V1.0. Los S0/S1 previamente abiertos y las pruebas reales esenciales de V5 siguen prevaleciendo.
