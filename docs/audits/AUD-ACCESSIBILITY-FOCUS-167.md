# AUD-ACCESSIBILITY-FOCUS-167 — Foco visible de teclado insuficiente

## Alcance
Auditoría conjunta contra V2, V3, V4, V5 y Núcleo IA, con énfasis en accesibilidad de teclado y uso por usuarios que no dependen del mouse.

## Especificaciones aplicadas
- V3 exige auditar teclado, lector de pantalla, contraste, foco, zoom, formularios y mensajes de error.
- V4 exige facilidad de uso, botones claros, legibilidad, prueba sin manual y funcionamiento cómodo en distintos dispositivos.
- V5 exige que las funciones esenciales sean utilizables y probadas antes del lanzamiento.

## Fuente externa verificada
WCAG 2.2 del W3C se consultó como referencia técnica vigente. El criterio 2.4.7 exige que el foco de teclado sea visible; WCAG 2.2 además incorpora criterios de foco no oculto y apariencia de foco.

## Prueba
**ID:** AUD-ACCESSIBILITY-FOCUS-167

**Entrada:** navegar por la aplicación utilizando Tab/Shift+Tab en botones, campos, selectores y navegación principal.

**Resultado esperado:** cada control interactivo debe mostrar un indicador de foco claramente perceptible y no depender solo del hover o del estado activo por mouse.

**Resultado obtenido antes de la corrección:** `styles.css` no definía ningún estilo `:focus` o `:focus-visible`; sí definía estados `:hover` y `.active`. Esto dejaba el indicador exclusivamente a la implementación por defecto del navegador, sin una garantía visual consistente con la interfaz personalizada.

**Evidencia:**
- `styles.css` previo, SHA blob `251dcca28cbc6dfc39d18b3b827375585c096603`: no contenía `:focus`/`:focus-visible`.
- `index.html` contiene numerosos controles `button`, `input`, `select` y `textarea` usados en flujos esenciales.

**PASA/NO PASA inicial:** NO PASA.

**Clasificación inicial:** PARCIALMENTE FUNCIONAL.

**Severidad:** S3 MEDIO. No se demostró imposibilidad total de navegación por teclado ni pérdida de datos, pero sí una inconsistencia de accesibilidad/UX exigida explícitamente por V3.

## Causa raíz
La interfaz fue estilizada principalmente para estados visuales de mouse/touch (`hover`, `active`) sin una regla transversal para foco de teclado.

## Corrección aplicada
Se añadió una regla global pequeña y reversible:

```css
button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 3px solid #111827;
  outline-offset: 3px;
}
```

Commit de corrección: `bfb12d335a682299e23f6848e064d3f344b80f9e`.

## Resultado posterior
A nivel de código, los controles nativos principales ahora tienen un indicador explícito de foco visible. Queda PENDIENTE la validación física/visual completa con teclado real, zoom, lector de pantalla, contraste medido y navegación por todos los flujos en navegador/dispositivo real.

**Estado posterior:** PARCIALMENTE FUNCIONAL / mejora aplicada, prueba física pendiente.

## Riesgo de regresión
Bajo. La regla solo se activa mediante `:focus-visible` y no modifica la interacción por mouse/touch. Debe comprobarse que el contorno no quede oculto por elementos sticky en móvil.

## Impacto
- IUD: mejora esperada, no puntuar definitivamente sin usuarios reales.
- ICGD: sin impacto directo demostrado.
- IFR: mejora puntual de usabilidad, sin puntuación definitiva.
- ISU: mejora parcial en navegación/claridad, sin puntaje definitivo.
- Prelaunch: no elimina bloqueantes S0/S1 existentes; reduce una brecha de accesibilidad.

## Pendientes relacionados
- recorrido completo solo teclado;
- lector de pantalla;
- nombres/roles/estados accesibles;
- foco al cambiar de pantalla/modal;
- zoom 200%/400%;
- contraste medido;
- tamaño de objetivos táctiles;
- validación física en móvil/tablet/laptop.
