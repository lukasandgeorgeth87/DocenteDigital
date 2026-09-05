# AUD-ACCESSIBILITY-SELECTION-168 — Estado de selección no expuesto a tecnologías de asistencia

Fecha de auditoría: 2026-09-05

## Especificaciones obligatorias contrastadas
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

V3 exige auditar por separado teclado, lector de pantalla, contraste, foco, zoom, formularios y mensajes de error. V4 exige que el sistema pueda ser usado por un docente/director con poca experiencia digital, y que las decisiones principales sean claras. V5 mantiene accesibilidad/usabilidad real como evidencia pendiente antes del lanzamiento.

## Fuente técnica externa verificada
W3C mantiene WCAG 2.2 como Recommendation y recomienda usar la versión más reciente. Para controles de interfaz, WCAG 4.1.2 exige que nombre, rol y valor/estado puedan determinarse programáticamente. WAI también mantiene pruebas ACT para controles de formulario y documentación de formularios accesibles.

Fuentes oficiales consultadas: W3C/WAI, 2026-09-05.

## Prueba
**ID:** AUD-ACCESSIBILITY-SELECTION-168

**Módulo:** Configuración inicial / Modo Fácil-Experto / selección de nivel, tipo de IE, grados y áreas.

**Entrada:** recorrer la configuración con teclado/lector de pantalla y seleccionar, por ejemplo, `Primaria`, `Multigrado`, `1.º`, `3.º`, `5.º` y varias áreas; alternar además entre Modo Fácil y Modo Experto.

**Resultado esperado:** el control debe comunicar programáticamente no solo su nombre, sino también si se encuentra seleccionado/activo. En botones que actúan como toggles, la semántica debería expresarse mediante un patrón accesible equivalente (`aria-pressed`, radio/checkbox apropiado u otra relación ARIA/HTML válida), sincronizado con el estado visual.

**Resultado obtenido:** la producción representa la selección mediante la clase CSS `active`. Los botones estáticos de Nivel y Tipo de IE no incluyen `aria-pressed`, `aria-checked`, `role=radio` ni una estructura nativa equivalente. Los botones dinámicos de grados/áreas creados por `renderGrades()` y `renderAreas()` cambian únicamente `className` y el estado JavaScript. `setMode()` también cambia la clase `active` de Fácil/Experto sin actualizar un estado accesible equivalente. La búsqueda del repositorio no encontró `aria-pressed`.

**Evidencia:**
- `index.html`: botones `.choice` de Nivel/Tipo IE y botones Fácil/Experto usan clase `active` como indicador visual.
- `app.js`: `chooseOne()`, `renderGrades()`, `renderAreas()` y `setMode()` cambian clases/estado pero no atributos accesibles de selección.
- Producción `https://docente-digital.vercel.app/` respondió HTTP 200 y sirve actualmente la misma estructura de botones sin estado ARIA de selección.

**PASA/NO PASA:** NO PASA.

**Clasificación:** PARCIALMENTE FUNCIONAL.

**Severidad:** S3 MEDIO.

## Causa raíz
La interfaz fue diseñada primero con feedback visual (`.active`) y posteriormente se añadió foco visible, pero el modelo de estado de los controles no se proyectó todavía al árbol de accesibilidad.

## Acción correctiva
1. Elegir semántica nativa cuando sea viable: radio para selección única y checkbox para selección múltiple.
2. Si se mantienen botones toggle, agregar y sincronizar `aria-pressed="true|false"` en cada cambio.
3. Sincronizar también Modo Fácil/Experto.
4. Mantener el foco visible ya agregado en AUD-ACCESSIBILITY-FOCUS-167.
5. Reprobar con teclado y lector de pantalla real antes de marcar accesibilidad como aprobada.

## Riesgo de regresión
Bajo si se limita a atributos semánticos y no se altera el modelo de datos. Debe comprobarse que no se duplique semántica ni se genere una combinación ARIA inválida.

## Impacto acumulativo
- IUD: negativo hasta que un usuario de lector de pantalla pueda conocer el estado seleccionado.
- ICGD: impacto indirecto bajo.
- IFR: impacto indirecto bajo.
- ISU: no puede cerrarse al 95/100 sin prueba real de accesibilidad y usuarios.
- Prelaunch: no añade por sí solo un S0/S1, pero mantiene accesibilidad real como PENDIENTE.

## Estado de lanzamiento
Este hallazgo no cambia la decisión global: DocenteDigital continúa NO APROBADA PARA LANZAMIENTO V1.0 mientras existan S0/S1 y pruebas reales V5 pendientes.
