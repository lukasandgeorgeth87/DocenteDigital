# AUD-TRACE-CRITICAL-ACTIONS-170 — Falta bitácora verificable de acciones críticas

## Alcance
Auditoría acumulativa conforme a V2, V3, V4, V5 y Núcleo IA.

## ID de prueba
AUD-TRACE-CRITICAL-ACTIONS-170

## Módulo
Trazabilidad transversal Docente/Director, persistencia, borrado/restauración y futura emisión documental.

## Entrada
Crear, guardar, editar, eliminar y restaurar una unidad/proyecto; revisar si cada acción crítica conserva de forma verificable: quién actuó, qué hizo, cuándo, sobre qué documento y qué cambió.

## Resultado esperado
V3 exige, para acciones críticas, una bitácora mínima con quién, qué hizo, cuándo, documento y cambio realizado. Los históricos no deben modificarse retroactivamente y los correlativos/directivos deben mantener trazabilidad del usuario emisor y anulaciones cuando corresponda.

## Resultado obtenido
1. El runtime principal persiste un único objeto `state` en `localStorage['docenteDigitalPrototype']`; su esquema base incluye modo, nivel, tipo de IE, grados, áreas, idioma, unidades, unidad activa y última sesión, pero no identidad de actor ni bitácora de cambios.
2. La capa de recuperación sí registra marcas técnicas como `savedAt` y conserva copias locales para reset/eliminación, pero esas copias no registran quién ejecutó la acción, documento/versión formal, motivo ni delta del cambio.
3. No se encontró en el código productivo una estructura `auditLog`, `actor`, `createdBy`, `updatedBy`, `changedBy` o equivalente que permita reconstruir acciones críticas de forma atribuible.
4. La producción actual tampoco dispone de autenticación/identidad real; por tanto, aunque se añadiera un array local de eventos, no sería una bitácora confiable ni inmutable.

## Evidencia
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`, apartados Fuente única/procedencia, Correlativos y Roles/permisos/seguridad.
- `app.js`: esquema de estado productivo y persistencia local.
- `storage-recovery-v26.js`: copias recuperables con `savedAt` pero sin actor/delta verificable.
- `index.html`: runtime productivo actual.

## PASA / NO PASA
**NO PASA**.

## Clasificación
**INEXISTENTE** para bitácora atribuible de acciones críticas. La recuperación local es una función distinta y no sustituye trazabilidad.

## Severidad
**S2 ALTO**.

No se clasifica S0/S1 en esta pasada porque no se demostró una modificación histórica fraudulenta, emisión jurídica incorrecta ni pérdida de datos. Sin embargo, la brecha impide demostrar responsabilidad y secuencia de cambios, y será especialmente crítica cuando RD, oficios, correlativos y roles sean funcionales.

## Causa raíz
Arquitectura local/prototipo sin identidad autenticada, almacenamiento durable multiusuario ni modelo de eventos/auditoría.

## Acción correctiva
1. Diseñar una bitácora append-only asociada a identidad autenticada y tenant/IE.
2. Registrar como mínimo actor, rol, timestamp del servidor, acción, recurso/documento, ID/versión anterior y posterior, motivo cuando corresponda y resultado.
3. No guardar contenido sensible completo si basta un delta/metadato minimizado.
4. Separar eventos de auditoría de la papelera/backup; un usuario no debe poder borrar su propia trazabilidad crítica.
5. Para documentos emitidos, conservar snapshot/versionado y no alterar históricos al cambiar Ficha Maestra.
6. Probar creación → edición → emisión → anulación/recuperación → consulta de historial, además de intentos de manipulación de IDs y permisos.

## Corrección directa realizada
No se implementó una bitácora local simulada. La solución correcta depende de autenticación, backend, aislamiento por IE, timestamps confiables y política de retención; implementarla solo en `localStorage` daría una falsa garantía.

## Evidencia posterior requerida
- Dos identidades reales con roles distintos.
- Eventos persistidos server-side e inmutables para el usuario final.
- Prueba de aislamiento entre IE/usuarios.
- Prueba de histórico documental inalterable.
- Prueba de correlativos/anulaciones cuando el módulo Director sea real.

## Riesgo de regresión
Medio/alto: cruza todos los módulos que creen, editen, eliminen, emitan o restauren documentos.

## Impacto en indicadores
- ICGD: negativo por trazabilidad incompleta.
- IFR: función transversal incompleta.
- ISU: sin puntuación definitiva; la bitácora debe ser interna y no recargar el Modo Fácil.
- Prelaunch: pendiente; no compensa ni elimina S0/S1 existentes.

## Gate
DocenteDigital **NO está lista para V1.0** mientras existan bloqueantes V5, S0/S1 o falten pruebas reales esenciales.