# AUD-TITLE-OBSERVATION-100

## Alcance
Auditoría V2/V3/V4/V5 + Núcleo IA. Módulo: comprensión semántica y títulos de Unidad/Proyecto.

## Prueba
**ID:** AUD-TITLE-OBSERVATION-100  
**Entrada:** `Aparecieron hormigas en el aula.` / `Aparecen moscas en la fruta.`  
**Esperado:** reconocer una observación explícita, limpiar el verbo de aparición del tema y proponer títulos naturales sin copiar la estructura verbal del docente. No convertir la observación en problema ni inventar causas, consecuencias o finalidades.  
**Obtenido antes:** `observed()` reconocía `aparecieron`, pero `OBSERVATION_PREFIX` no lo eliminaba. Esto permitía temas como `aparecieron hormigas en el aula` y títulos gramaticalmente defectuosos del tipo `Descubrimos aparecieron hormigas...`.  
**Estado antes:** NO PASA.  
**Clasificación:** PARCIALMENTE FUNCIONAL.  
**Severidad:** S2 ALTO por incoherencia semántica visible en un flujo esencial de Unidad/Proyecto.

## Causa raíz
La detección semántica de observaciones y la normalización del tema usaban conjuntos verbales diferentes. `observed()` contemplaba `aparecieron`, mientras `OBSERVATION_PREFIX` solo contemplaba ver/observar/encontrar.

## Corrección
Se actualizó `title-context-v38.js` a lógica interna V47, agregando `aparece`, `aparecen`, `apareció/aparecio` y `aparecieron` a `OBSERVATION_PREFIX`. Así `cleanTheme()` retira el verbo antes de construir opciones de título y `isSimpleObservation()` puede clasificar correctamente estas entradas.

## Resultado posterior
Para una observación simple como `Aparecieron hormigas en el aula`, la ruta esperada es un tema limpio `hormigas en el aula` y propuestas del patrón `Observamos hormigas en el aula`, `Conocemos más sobre hormigas en el aula`, `Descubrimos hormigas en el aula y compartimos lo aprendido`.

## Evidencia posterior
- Commit funcional: `b026eb4ac016607f1c629a2a5d67e87fbdb6e709`.
- Estado de integración GitHub/Vercel: `success`.
- Producción `/title-context-v38.js`: HTTP 200 y contiene lógica V47 con los nuevos verbos de aparición.
- Producción `/`: HTTP 200.
- Consulta administrativa de deployments: PENDIENTE por 403 de autorización al scope del equipo; no se declara `READY` administrativo sin evidencia.

## Riesgo de regresión
Bajo-medio. La modificación se limita a observaciones cuyo enunciado inicia con verbos explícitos de aparición. Frases con problema, causa, finalidad o curiosidad siguen saliendo de la rama de observación simple por las guardas existentes.

## Impacto
Mejora directa en comprensión semántica, naturalidad de títulos, simplicidad V4 y gate pedagógico V5. No cambia normativa, currículo, datos institucionales ni históricos.

## Pendientes V5
IA semántica real, pruebas masivas con finalidades no codificadas, matriz curricular oficial versionada, E2E Docente/Director, autenticación/autorización, backup/restore real, PDF, compatibilidad física Word/móvil, seguridad OWASP ASVS, 100 generaciones, año completo, concurrencia y pilotos reales.