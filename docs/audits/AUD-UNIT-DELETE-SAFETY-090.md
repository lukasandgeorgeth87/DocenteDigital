# AUD-UNIT-DELETE-SAFETY-090

## Módulo
Unidades / Proyectos — borrado seguro y recuperación.

## Especificaciones aplicadas
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

## Prueba
**ID:** AUD-UNIT-DELETE-SAFETY-090

**Entrada:** Unidad/Proyecto guardado → `Mis unidades/proyectos` → pulsar `Eliminar`.

**Resultado esperado:** el borrado debe ser seguro: confirmación, papelera y recuperación antes de eliminación definitiva. La información no debe perderse irreversiblemente por una acción ordinaria.

**Resultado obtenido antes:** `deleteUnit(id)` solicitaba confirmación y luego ejecutaba `state.units=state.units.filter(...)`, guardando inmediatamente el nuevo estado. No existía papelera ni restauración para esa acción.

**Evidencia previa:** `app.js`, función `deleteUnit(id)`.

**Estado inicial:** NO PASA.

**Clasificación:** PARCIALMENTE FUNCIONAL / insegura para prelaunch.

**Severidad:** S2 ALTO, porque una función de borrado expuesta puede causar pérdida de una planificación guardada sin ruta de recuperación, aunque exista confirmación previa.

## Causa raíz
La implementación del prototipo trataba `Eliminar` como borrado definitivo local. La capa V4/V5 todavía no había neutralizado esta acción mientras faltaba la papelera.

## Corrección aplicada
Commit funcional: `6d6f264afd1a6c765916d07a7a460143299be032`.

Se actualizó `home-surface-truth-v73.js` para:
- bloquear los botones que ejecutan `deleteUnit(...)`;
- mostrar `Eliminar · Próximamente`;
- retirar el `onclick` de la superficie;
- envolver `deleteUnit` con una guardia que no borra datos si una referencia antigua intenta invocarla;
- volver a aplicar el bloqueo después de `renderUnits()`.

La corrección no implementa ni simula papelera. Solo impide pérdida irreversible hasta que papelera + recuperación sean funciones reales y probadas.

## Retest
- Vercel deployment del commit funcional: `dpl_HCc4b7ZKFyjWcwQxHLTNARUjbKUj`.
- Target: production.
- Estado: READY.
- Estado del commit en GitHub/Vercel: success.
- `https://docente-digital.vercel.app/`: HTTP 200.
- `https://docente-digital.vercel.app/home-surface-truth-v73.js`: HTTP 200 y sirve la guardia `markUnsafeUnitDeleteActions()` / `guardUnsafeUnitDeletion()`.

## Resultado posterior
PASA respecto a impedir borrado irreversible desde la interfaz actual.

La capacidad completa **Eliminar → Papelera → Recuperar → Eliminación definitiva** permanece INEXISTENTE/PENDIENTE y no debe aprobarse como función V1.0.

## Riesgo de regresión
Medio. Si otra capa vuelve a redefinir `deleteUnit` o renderiza botones de borrado fuera de `#plan`, deberá incorporar la misma política hasta que exista papelera real. Se recomienda convertir el borrado seguro en servicio de datos central cuando se implemente persistencia/backend.

## Impacto
- **IUD:** mejora parcial al eliminar una acción peligrosa engañosamente disponible.
- **ICGD:** mejora parcial al proteger la continuidad de planificaciones guardadas.
- **IFR:** sin puntuación definitiva; no cambia la falta de recuperación real.
- **ISU:** no calcular; mejora cualitativa de seguridad de uso.
- **Prelaunch:** sigue bloqueado porque papelera/recuperación real y pruebas de persistencia continúan pendientes.

## Fuente oficial
No se aplicó ni declaró vigente ninguna norma educativa en esta corrección. El hallazgo deriva de las especificaciones internas V3/V4/V5 de DocenteDigital.
