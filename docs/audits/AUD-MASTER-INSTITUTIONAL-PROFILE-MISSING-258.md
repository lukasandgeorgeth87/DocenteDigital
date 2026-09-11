# AUD-MASTER-INSTITUTIONAL-PROFILE-MISSING-258 — RECTIFICADO / RETIRADO

## Estado actual

**RETIRADO COMO HALLAZGO INDEPENDIENTE.**

La conclusión original de este informe —“la Ficha Maestra institucional no existe”— era incorrecta porque examinó principalmente el estado base de `app.js` y la superficie HTML inicial sin seguir el grafo de carga transitiva del runtime.

La brecha real ya está documentada de forma canónica en:

- `docs/audits/AUD-INSTITUTION-MASTER-169.md` — **Ficha Maestra incompleta frente a V2/V3/V5**.

AUD-258 no debe contabilizarse como S1 ni como bloqueante adicional.

## ID de prueba

**AUD-MASTER-INSTITUTIONAL-PROFILE-MISSING-258**

## Módulo

Ficha Maestra / Configuración / persistencia / trazabilidad Docente–Director.

## Especificaciones aplicables

- V2 exige una sola base institucional y reutilización de datos.
- V3 exige fuente única de verdad, procedencia y conservación de históricos.
- V4 exige configurar una vez y reutilizar.
- V5 incluye Perfil/Ficha de IE en los recorridos E2E Docente y Director.

## Entrada de reprueba

1. Revisar `institution-master-v46.js`.
2. Seguir el grafo de carga del runtime desde `schedule-prompt-v6.js`.
3. Verificar si la Ficha Maestra tiene superficie visible, persistencia y API de reutilización.
4. Contrastar su cobertura con V2.

## Resultado esperado

Si la Ficha Maestra realmente no existe, no debe haber modelo persistente, formulario editable ni integración en el runtime.

Si existe pero es incompleta, debe clasificarse como PARCIALMENTE FUNCIONAL y consolidarse con el hallazgo canónico correspondiente.

## Resultado obtenido

### 1. La Ficha Maestra sí existe

`institution-master-v46.js` implementa `state.institutionMaster` y una superficie visible **“🏫 Ficha Maestra de la IE”** dentro de Configuración.

Incluye, entre otros:

- nombre de IE;
- código modular;
- código de local;
- UGEL;
- DRE/GRE;
- región, provincia y distrito;
- tipo y nombre de lugar;
- ámbito;
- gestión;
- organización de IE;
- director/a;
- docente;
- número de docentes y estudiantes;
- niveles;
- calendario escolar;
- calendario comunal/local;
- características institucionales relevantes;
- rol principal Docente / Director / Docente y Director.

También implementa persistencia en `localStorage`, verificación de que el guardado realmente quedó persistido, sincronización con campos legacy y una API de lectura (`ddInstitutionMaster` / `ddInstitutionData`).

### 2. Está integrada al runtime

`schedule-prompt-v6.js` contiene un cargador secuencial de módulos y lista explícitamente:

```js
'institution-master-v46.js'
```

Por tanto, la ausencia de un `<script>` directo en `index.html` no demuestra que el módulo esté desconectado.

### 3. La implementación es anterior a AUD-258

El historial de GitHub muestra commits de `institution-master-v46.js` al menos desde el **2–3 de septiembre de 2026**, incluyendo correcciones de persistencia e identidad docente. El hallazgo AUD-258 fue creado después, por lo que no puede justificarse como una descripción histórica de una versión anterior sin esa implementación.

### 4. La brecha real es cobertura incompleta

La Ficha Maestra actual no cubre completamente todo el contrato V2. Entre las brechas ya registradas por AUD-169 están:

- turnos sin control visible de edición;
- modalidad no estructurada;
- característica de IE no estructurada;
- secciones no estructuradas;
- recursos disponibles no estructurados;
- procedencia/versionado/snapshots históricos todavía incompletos para V3 completo.

## PASA / NO PASA

### Requisito “Existe una Ficha Maestra institucional real y persistente”
**PASA a nivel de implementación e integración declarada.**

### Requisito “La Ficha Maestra cubre completamente V2/V3/V5 y está demostrada E2E”
**NO PASA / PENDIENTE**, pero esta brecha corresponde a **AUD-INSTITUTION-MASTER-169**, no a AUD-258.

## Clasificación corregida

**PARCIALMENTE FUNCIONAL**, consolidada en AUD-169.

## Severidad corregida

**S1 RETIRADO.**

No se asigna una nueva severidad independiente a AUD-258. La severidad canónica para la cobertura incompleta de Ficha Maestra permanece en **AUD-169: S2 ALTO**, salvo nueva evidencia E2E que justifique reclasificación.

## Causa raíz de la falsa alarma

La auditoría anterior evaluó el estado base de `app.js` y el HTML sin seguir correctamente:

**asset disponible → módulo cableado directa/transitivamente → módulo ejecutado → comportamiento demostrado.**

En este caso se omitió la etapa de cableado transitivo mediante `schedule-prompt-v6.js`.

## Acción correctiva de auditoría

1. No volver a contar AUD-258 como defecto ni como S1.
2. Usar AUD-169 como hallazgo canónico de Ficha Maestra incompleta.
3. Mantener pendientes las pruebas E2E reales de reutilización Docente/Director, históricos y procedencia.
4. En futuras auditorías, seguir siempre el grafo de módulos antes de declarar una función INEXISTENTE.

## Corrección funcional aplicada

**Ninguna.** No se modifica producto porque la función cuestionada ya existe. Esta ronda corrige únicamente la trazabilidad de auditoría.

## Riesgo de regresión

**Bajo para esta rectificación documental.**

El riesgo funcional real continúa en las brechas de AUD-169 y en las pruebas V5 pendientes.

## Impacto acumulativo

- **IUD:** eliminar doble penalización/falso negativo.
- **ICGD:** mantener únicamente la penalización sustentada por cobertura incompleta.
- **IFR:** no asignar S1 por inexistencia falsa; persistencia completa sigue pendiente de E2E.
- **ISU:** sin puntuación definitiva.
- **Prelaunch:** AUD-258 deja de ser bloqueante independiente; V5 sigue bloqueado por otros S0/S1 y pruebas esenciales pendientes.

## Estado final

**RECTIFICADO · RETIRADO COMO HALLAZGO INDEPENDIENTE · NO CONTABILIZAR S1.**

La Ficha Maestra existe y está integrada; su cobertura incompleta continúa bajo **AUD-INSTITUTION-MASTER-169**.
