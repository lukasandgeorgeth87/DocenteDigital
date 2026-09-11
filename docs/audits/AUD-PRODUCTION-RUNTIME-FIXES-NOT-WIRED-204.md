# AUD-PRODUCTION-RUNTIME-FIXES-NOT-WIRED-204 — RECTIFICADO

## Especificaciones obligatorias aplicadas
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

## Rectificación 2026-09-11
El hallazgo histórico sostuvo que varias correcciones presentes como assets no estaban cableadas al runtime porque no aparecían directamente en los `<script src>` de `index.html`. Esa conclusión era incompleta: `index.html` carga `schedule-prompt-v6.js`, y este archivo implementa `__ddStableModuleLoaderV49`, un cargador secuencial de módulos transitivos.

La lista productiva del loader incluye expresamente, entre otros:

- `material-integrity-v65.js`
- `director-creativity-v16.js`
- `planning-archive-simplicity-v56.js`
- `context-semantic-v20.js`
- `curriculum-safety-v27.js`
- `home-surface-truth-v73.js`

Por tanto, **la ausencia de esos nombres en el HTML directo no demuestra que estén fuera del grafo de ejecución**.

## Prueba rectificada
**ID:** AUD-PRODUCTION-RUNTIME-FIXES-NOT-WIRED-204

**Entrada:** abrir la producción canónica, inspeccionar `index.html`, seguir cada script cargado y revisar cargadores transitivos.

**Resultado esperado:** distinguir entre:
1. asset disponible;
2. módulo cableado directa o transitivamente;
3. módulo ejecutado sin error;
4. comportamiento observable realmente corregido.

**Resultado obtenido:** los módulos citados anteriormente como “no cableados” sí están declarados en el loader transitivo de `schedule-prompt-v6.js`.

**Resultado de wiring:** PASA a nivel de integración de código.

**Resultado de comportamiento:** PENDIENTE DE E2E real para cada guarda. La existencia del loader no demuestra por sí sola que un override posterior no anule una corrección ni que el efecto final sea correcto en todos los flujos.

## Clasificación vigente
- Deployment/hosting básico: **FUNCIONAL**.
- Loader transitivo: **FUNCIONAL a nivel de código**.
- Wiring de los módulos citados: **FUNCIONAL a nivel de grafo declarado**.
- Comportamiento final de cada guarda: **PENDIENTE DE PRUEBA E2E**.

## Severidad vigente
Se **RETIRA el S1 específico por “correcciones no cableadas”**, porque la premisa factual utilizada para elevar la severidad era incorrecta.

No se retiran otros hallazgos funcionales sobre Materiales, Director, semántica, currículo, persistencia, exportación, seguridad o gate V5. Cada uno debe conservar su propia evidencia y severidad.

## Causa raíz de la falsa alarma
La auditoría anterior inspeccionó la carga directa de `index.html` y algunos scripts intermedios, pero no siguió hasta el final el grafo transitivo introducido por `schedule-prompt-v6.js`.

## Acción correctiva de auditoría
1. Mantener inventario explícito del grafo de módulos cargados.
2. Añadir smoke de navegador que verifique sentinelas de módulos críticos.
3. Comprobar orden de overrides, no solo carga.
4. Fallar CI si falta un módulo declarado como requerido o si un sentinela crítico no aparece.
5. Retestar individualmente Materiales, Director, currículo, persistencia, exportación y simplicidad.

## Evidencia actual
- `index.html` productivo carga `schedule-prompt-v6.js`.
- `schedule-prompt-v6.js` productivo contiene `__ddStableModuleLoaderV49` y la lista secuencial de módulos citada.
- Los assets relevantes siguen disponibles en producción.
- La URL canónica responde HTTP 200 y el deployment está READY.

## Normativa externa
No se declara vigencia normativa externa en esta rectificación. La corrección es de trazabilidad técnica V3/V5.

## Riesgo de regresión
**MEDIO-ALTO.** El sistema aún depende de numerosos overrides globales y del orden secuencial de carga. Una modificación del loader o de funciones globales puede introducir regresiones silenciosas.

## Impacto en indicadores
- Se retira el impacto S1 atribuido exclusivamente a “no wiring”.
- IFR/ICGD continúan pendientes por falta de E2E completo.
- ISU/Prelaunch no se recalculan definitivamente.

## Conclusión
**DocenteDigital continúa NO APROBADA PARA V1.0**, pero no debe mantenerse un bloqueante basado en una premisa de wiring que ya fue refutada por el cargador transitivo productivo. El gate sigue bloqueado por hallazgos y pruebas reales independientes.
