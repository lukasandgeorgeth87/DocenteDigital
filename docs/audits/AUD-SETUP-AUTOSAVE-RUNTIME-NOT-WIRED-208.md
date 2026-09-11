# AUD-SETUP-AUTOSAVE-RUNTIME-NOT-WIRED-208 — rectificación acumulativa

## Estado actual

**Módulo:** Configuración inicial / persistencia / recuperación  
**Estado:** RETIRADO como S1 independiente por premisa de wiring obsoleta.  
**Clasificación:** el autoguardado de la configuración está implementado y cableado transitivamente; su E2E físico/automatizado de cierre, recarga e interrupción continúa PENDIENTE.  
**Severidad contabilizable:** **NO CONTABILIZAR S1 adicional**. El estado canónico de esta capacidad se mantiene en `AUD-SETUP-AUTOSAVE-065`.

## Especificaciones obligatorias aplicadas

Se contrasta conjuntamente con:

- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

V3 exige evidencia real y obliga a distinguir entre archivo existente, wiring directo/transitivo, ejecución y comportamiento probado. V4 exige autoguardado y continuar donde quedó. V5 exige probar recarga, cierre, interrupción y retorno sin pérdida de información.

## ID de prueba

`AUD-SETUP-AUTOSAVE-RUNTIME-NOT-WIRED-208`

## Entrada de reprueba

1. Revisar `app.js` y la implementación específica `config-state-guard-v42.js`.
2. Seguir el grafo de carga desde el `index.html` productivo hacia `schedule-prompt-v6.js`.
3. Comprobar si `config-state-guard-v42.js` forma parte del cargador secuencial estable.
4. Separar la evidencia de wiring de la prueba E2E de recarga/cierre/interrupción.
5. Contrastar con el hallazgo canónico `AUD-SETUP-AUTOSAVE-065` para evitar doble conteo.

## Resultado esperado

- Si `config-state-guard-v42.js` está integrado transitivamente, no puede clasificarse como “NO CARGADO” solo porque no aparezca como `<script>` directo en `index.html`.
- El código debe persistir las decisiones relevantes del setup.
- La recuperación exacta después de recarga/cierre/interrupción solo puede darse por aprobada tras una prueba E2E real.

## Resultado obtenido

### A. La guarda de autoguardado sí está integrada

`schedule-prompt-v6.js`, que sí se carga desde el HTML productivo, define `__ddStableModuleLoaderV49` y contiene expresamente:

```js
'schedule-integrity-v62.js',
'config-state-guard-v42.js',
'linguistic-profile-v26.js',
...
```

El loader crea cada `<script>` secuencialmente, usa `async=false`, continúa mediante `onload`, reintenta una vez ante error y registra fallos en `window.ddModuleLoadFailures`.

Por tanto, la afirmación histórica de AUD-208 —“`config-state-guard-v42.js` está en el repositorio pero NO CARGADA por el runtime productivo”— ya no es correcta.

### B. La implementación sí persiste progreso intermedio

`config-state-guard-v42.js` implementa `persistSetupProgress()` y llama al `save()` existente. Además:

- envuelve `chooseOne()` y persiste después de cada selección;
- envuelve `nextSetup()` y persiste antes de avanzar;
- escucha clics en `#gradeChoices` y `#areaChoices`;
- escucha cambios en `linguisticMode`, `language` y `quechuaVar`;
- sanea grados/áreas incompatibles al cambiar nivel/tipo de IE;
- fuerza volver al paso pendiente cuando detecta una configuración parcial e incompatible.

### C. AUD-065 ya es el registro canónico de esta corrección

`AUD-SETUP-AUTOSAVE-065` documenta el cambio funcional, el commit que introdujo la guarda y su estado posterior como **PASA técnicamente para las decisiones cubiertas**, dejando expresamente pendientes las pruebas físicas/E2E V5.

Mantener AUD-208 como S1 por “runtime no cableado” duplicaría una penalización y contradice tanto el código vigente como el registro canónico AUD-065.

## PASA / NO PASA

- **Implementación de autoguardado del setup:** PASA técnicamente.
- **Wiring de `config-state-guard-v42.js`:** PASA.
- **Recarga/cierre/interrupción real en navegador y dispositivos físicos:** PENDIENTE.
- **Persistencia multiusuario/backend y restore real:** PENDIENTE / fuera de lo demostrado por esta corrección local.
- **AUD-208 como hallazgo S1 independiente:** RETIRADO.

## Clasificación funcional corregida

- Configuración inicial base: **PARCIALMENTE FUNCIONAL** dentro del alcance total V5.
- Autoguardado local de decisiones cubiertas: **FUNCIONAL técnicamente**.
- Recuperación E2E bajo interrupciones reales: **PENDIENTE DE PRUEBA**, no simulada.
- AUD-208: **NO CONTABILIZAR como S1**.

## Causa de la falsa clasificación histórica

La auditoría anterior inspeccionó únicamente la lista de `<script>` directos de `index.html` y no siguió la carga transitiva iniciada por `schedule-prompt-v6.js`. La metodología correcta es:

**asset disponible → wiring directo/transitivo → ejecución → comportamiento demostrado.**

## Acción posterior requerida

No hace falta agregar otro `<script>` directo ni duplicar la guarda. Para cerrar completamente la exigencia V5 se requiere una batería E2E que haga, como mínimo:

1. seleccionar nivel → recargar → comprobar recuperación;
2. seleccionar tipo de IE → recargar;
3. seleccionar grados/edades → recargar;
4. seleccionar áreas → recargar;
5. configurar EIB/monolingüe → recargar;
6. cerrar/reabrir el navegador;
7. simular interrupción de conexión;
8. comprobar que cambios incompatibles limpian solo datos no válidos y no modifican históricos emitidos.

## Evidencia posterior requerida

PENDIENTE hasta ejecución E2E real/automatizada y, para V5 completo, dispositivo físico. La evidencia de wiring no sustituye estas pruebas.

## Fuente oficial externa

No se aplica ni declara vigente ninguna norma externa MINEDU/UGEL/legal en esta rectificación. La conclusión deriva de V2–V5, Núcleo IA y del código/runtime de DocenteDigital.

## Impacto en indicadores

- **IUD/ICGD/IFR/ISU:** retirar la penalización duplicada asociada exclusivamente a “guarda no cableada”; no recalcular puntuaciones definitivas.
- **Prelaunch:** continúa BLOQUEADO por otros S0/S1 y por pruebas esenciales V5 todavía pendientes.

## Riesgo de regresión

**MEDIO.** La carga es transitiva y secuencial; cambios futuros en `schedule-prompt-v6.js`, orden de módulos o nombres de assets pueden desconectar la guarda. Debe existir una prueba automática que verifique tanto el wiring como el comportamiento de recuperación.