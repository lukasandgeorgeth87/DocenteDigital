# AUD-CONTEXTUAL-HELP-MISSING-238 — Ayuda contextual corta inexistente

## Especificaciones aplicadas
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

## Alcance
Carpeta Docente/Director → simplicidad de uso para usuario principiante → ayuda contextual de pantalla.

## Prueba principal
**ID:** AUD-HELP-238-A  
**Entrada:** un docente o director principiante entra a Configuración, Mi planificación, Crear mi sesión, Materiales, Evaluación o Director y no comprende qué debe hacer en la pantalla actual.  
**Resultado esperado:** V4 exige una ayuda corta tipo `❓ ¿Qué hago aquí?`, con una explicación de máximo 2–3 líneas antes de ofrecer `Ver más`, sin mostrar manuales ni telemetría técnica.  
**Resultado obtenido:** el HTML y el runtime productivo contienen textos descriptivos fijos y pequeños textos de apoyo de campos, pero no existe un control contextual `¿Qué hago aquí?`, `Ver más`, panel de ayuda por pantalla ni función equivalente. La búsqueda global del repositorio por `¿Qué hago aquí?` y `help` no devolvió implementación funcional. El runtime productivo cargado en `https://docente-digital.vercel.app/` tampoco contiene una superficie de ayuda contextual.  
**PASA/NO PASA:** NO PASA.  
**Clasificación:** INEXISTENTE.  
**Severidad:** S3 MEDIO.

## Evidencia técnica
- V4, regla 13: ayuda corta `❓ ¿Qué hago aquí?`, máximo 2–3 líneas antes de `Ver más`.
- V4, reglas 1, 6, 15, 16, 39 y frase guía: el usuario principiante debe operar sin manual extenso.
- `index.html`: no existe botón/enlace/panel contextual de ayuda en los flujos principales.
- Producción: el HTML servido muestra subtítulos y ayudas de campo, pero no una acción de ayuda contextual.
- Búsqueda global de código por `¿Qué hago aquí?` y `help`: sin implementación funcional.

## Distinción frente a funciones ya auditadas
Este hallazgo no duplica:
- `Continuar mi trabajo`, que recupera un punto de trabajo;
- el asistente en lenguaje natural, que debe enrutar necesidades;
- los textos `sub` o `small`, que son descripciones fijas y no una ayuda bajo demanda;
- tutorial inicial, que corresponde a otro requisito V4.

## Causa raíz
La interfaz incorpora orientación permanente en algunos campos, pero todavía no existe una capa de ayuda bajo demanda asociada al contexto exacto de cada pantalla. Esto obliga a aumentar texto fijo o dejar al usuario principiante sin explicación cuando no entiende una decisión.

## Acción correctiva recomendada
1. incorporar en flujos principales una acción secundaria discreta `❓ ¿Qué hago aquí?`;
2. mostrar inicialmente 2–3 líneas concretas sobre la decisión actual;
3. usar `Ver más` solo cuando exista contenido adicional útil;
4. mantener lenguaje docente/directivo, sin términos de IA, RAG, prompts, tokens o arquitectura;
5. no interferir con la acción principal de cada pantalla;
6. verificar foco, teclado, lector de pantalla y cierre del panel;
7. probar con usuario principiante real sin manual.

## Corrección directa
No se implementa en esta ronda. Añadir una ayuda genérica única sería una corrección superficial: cada pantalla necesita contenido contextual específico y debe probarse con accesibilidad y usuarios reales. No se modifica runtime ni documentos históricos.

## Riesgo de regresión
Bajo en datos y alto-medio en UX si se implementa mal: puede aumentar texto, competir visualmente con la acción principal o crear paneles intrusivos en celular.

## Impacto cualitativo
- **IUD/ISU:** impacto directo en facilidad de aprendizaje, autonomía del usuario principiante y solicitudes de ayuda.
- **ICGD/IFR:** sin impacto directo en contenido pedagógico/normativo.
- **Prelaunch:** requisito de simplicidad pendiente; no constituye por sí solo bloqueante S0/S1, pero debe validarse antes de declarar cumplimiento V4.

No se recalculan ISU/IFR/Prelaunch Score definitivos por falta de evidencia de usuarios reales.

## Pendientes no simulados
- prueba con docentes/directores principiantes;
- prueba física en celular/tablet/laptop;
- tiempo de comprensión por pantalla;
- accesibilidad con teclado/lector de pantalla;
- validación de que la ayuda reduce errores sin aumentar clics innecesarios.

No se aplica ni declara vigente normativa MINEDU/UGEL externa para clasificar este hallazgo.