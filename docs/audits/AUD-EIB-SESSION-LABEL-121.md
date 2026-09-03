# AUD-EIB-SESSION-LABEL-121

## Módulo
Sesión / perfil lingüístico / EIB-monolingüe / trazabilidad visible.

## Especificaciones aplicadas
- Auditoría Maestra Integral V2.
- Adenda Ejecutable V3.
- Auditoría de Simplicidad V4.
- Auditoría de Prelanzamiento V5.
- Núcleo IA DocenteDigital.

## Prueba
**ID:** AUD-EIB-SESSION-LABEL-121

**Entrada:** configurar Primaria + IE Multigrado o Unidocente + perfil `Monolingüe castellano`; abrir Crear mi sesión y ejecutar la auditoría previa a generación.

**Resultado esperado:** la interfaz y la auditoría deben respetar el perfil lingüístico explícitamente configurado. Una IE monolingüe no debe ser rotulada como EIB.

**Resultado obtenido antes de corregir:** `stable-core-v12.js` determinaba el rótulo EIB únicamente por `Primaria + Multigrado/Unidocente`, sin comprobar `state.linguisticMode`. El badge mostraba `Primaria EIB ...` y el pie de auditoría declaraba activo un Prompt Maestro EIB incluso con perfil monolingüe.

**Evidencia:** `linguistic-profile-v26.js` separa explícitamente `EIB` y `Monolingüe castellano`; `stable-core-v12.js` no usaba esa distinción al presentar el motor de sesión. La misma versión fue verificada en producción antes del cambio.

**Resultado inicial:** NO PASA.

**Severidad:** S2 ALTO.

**Clasificación:** PARCIALMENTE FUNCIONAL.

## Causa raíz
El predicado `isPrimaryMulti()` comprobaba nivel y organización de IE, pero no el perfil lingüístico. La condición era suficiente para atención multigrado, no para afirmar EIB.

## Corrección
Se añadió `isPrimaryEibMulti()`, que exige también `state.linguisticMode === 'EIB'`. El badge mantiene la mención EIB solo cuando el perfil está confirmado como EIB. Para Primaria multigrado/unidocente no EIB se usa un rótulo neutral sin atribuir EIB. El mensaje de auditoría previa a sesión también quedó condicionado por el perfil lingüístico.

## Alcance de la corrección
Cambio pequeño y reversible en `stable-core-v12.js`. No modifica currículo, competencias, lengua seleccionada, documentos históricos, normativa, backend ni datos del usuario.

## Retest requerido
- Prelaunch Smoke del PR: pendiente al crear este registro.
- Prelaunch Smoke de `main`: pendiente hasta merge.
- Vercel READY: pendiente hasta merge.
- HTTP 200 raíz y activo corregido en producción: pendiente hasta merge.

## Riesgo de regresión
Bajo. El flujo multigrado sigue usando la misma auditoría previa; solo se evita presentar EIB cuando el perfil no lo confirma.

## Impacto en indicadores
Mejora cualitativa de coherencia EIB/monolingüe, trazabilidad e integridad de contexto. No se recalculan IUD, ICGD, IFR, ISU ni Prelaunch Score sin evidencia completa y pilotos reales.

## Bloqueantes V5 que permanecen
Esta corrección no valida IA semántica real, E2E Docente/Director, backend/autenticación/aislamiento, dispositivos físicos, Word/PDF/impresión reales, OWASP ASVS, backup/restore, 100 generaciones, año completo, concurrencia ni pilotos reales. El gate CI/CD previamente detectado también permanece pendiente.
