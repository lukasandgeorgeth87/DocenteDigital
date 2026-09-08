# AUD-BACK-NAVIGATION-MISSING-240 — Ruta clara de regreso no implementada de forma consistente

## Especificaciones aplicadas
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

## Regla aplicable
V4, punto 18: **“Volver siempre fácil. El usuario no debe sentirse atrapado. Debe existir una ruta clara para volver.”**

## Prueba
**ID:** AUD-BACK-240-A  
**Módulo:** Navegación transversal Docente/Director.  
**Entrada:** entrar desde Inicio a Mi planificación, Crear sesión, Materiales, Evaluación o Director y buscar una acción visible para regresar al contexto anterior.  
**Resultado esperado:** una ruta de regreso explícita, predecible y visible en el contenido o cabecera de cada flujo; en móvil no debe depender de adivinar el menú o usar el botón físico/gesto del navegador.  
**Resultado obtenido:** el `index.html` actual tiene botones `← Atrás` únicamente dentro de los pasos 2–4 del setup inicial. Las pantallas principales (`plan`, `session`, `materials`, `evaluation`, `director`, `settings`) no exponen botón `Volver`, breadcrumb equivalente ni una acción contextual de regreso. La navegación principal lateral permite saltar a otras secciones, pero no representa la semántica “volver al punto anterior”. La búsqueda global del repositorio por `Volver` no devuelve implementación.  
**Resultado:** NO PASA.  
**Severidad:** S3 MEDIO.  
**Clasificación:** PARCIALMENTE FUNCIONAL: navegación global existente; regreso contextual explícito INEXISTENTE fuera del setup.

## Evidencia
- `index.html`: `← Atrás` solo en setup; no hay `Volver` en pantallas funcionales principales.
- `app.js`: `go(id)` cambia de pantalla, pero no mantiene historial de navegación ni expone `goBack()`/equivalente.
- Búsqueda global `Volver`: sin resultados de implementación.

## Causa raíz
La arquitectura de navegación fue concebida como menú lateral por destinos, no como flujo con historial contextual. Esto funciona para saltar entre módulos, pero no satisface V4-18 cuando el usuario entra a una tarea y necesita regresar exactamente al contexto anterior.

## Acción correctiva recomendada
Implementar una regla transversal de regreso sin añadir ruido: una acción secundaria `← Volver` en cabecera de flujo o breadcrumb contextual que conserve el destino anterior válido. En móvil debe permanecer visible y táctil. No usar `history.back()` a ciegas si puede sacar al usuario de la app. Para flujos con cambios sin guardar, integrar primero el modelo de borradores/autosave antes de advertencias de salida.

## Corrección aplicada en esta ronda
No se modificó runtime. Añadir una navegación de regreso aparentemente simple afecta historial, borradores, foco/accesibilidad y móvil; requiere diseño y retest transversal. Solo se documenta el hallazgo verificable.

## Riesgo de regresión
Medio si se implementa sin historial interno: podría sacar al usuario de la app, perder contexto o interferir con autosave pendiente.

## Impacto cualitativo
Afecta simplicidad/ISU y recuperación de contexto. No modifica por sí solo ICGD/IFR ni abre/cierra el Prelaunch Gate frente a S0/S1 ya existentes. No se calcula ISU ni Prelaunch Score definitivo.

## Pendientes reales
- prueba física en celular con navegación por pulgar;
- prueba con docentes/directores principiantes;
- interacción con autosave/borradores;
- accesibilidad de foco y teclado;
- medición de retrocesos y abandono.
