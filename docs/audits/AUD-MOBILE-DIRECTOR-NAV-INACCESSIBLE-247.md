# AUD-MOBILE-DIRECTOR-NAV-INACCESSIBLE-247

## Resumen

**Hallazgo:** la navegación móvil oculta completamente la barra lateral a `max-width:850px`, pero la barra móvil solo contiene Inicio, Plan, Sesión, Materiales y Evaluación. No existe entrada visible a **Director** ni **Configuración**.

**Severidad:** S1 CRÍTICO

**Clasificación funcional:** PARCIALMENTE FUNCIONAL en navegación general; ROTA para acceso móvil al espacio Director desde la interfaz visible.

**Gate V5:** BLOQUEA lanzamiento mientras no se demuestre acceso móvil completo a funciones esenciales del rol Director y pruebas físicas reales.

---

## Especificaciones aplicadas

### V4

V4 exige que DocenteDigital sea simple incluso para usuarios con poca experiencia digital, que las funciones principales sean utilizables en celular, que exista navegación clara y que la app tenga una acción/ruta evidente para la tarea actual. También define como funciones del espacio Director Gestión escolar, Documentos de gestión, Oficios, Resoluciones, Informes, Planes y actividades, Comités/CONEI y Archivo.

### V5

V5 exige probar físicamente en celular económico y gama media; además exige el recorrido Director extremo a extremo y declara bloqueante una app inutilizable en celular en funciones principales.

### V2/V3

V2 define Carpeta Director como uno de los dos grandes espacios del sistema. V3 exige evidencia real y separa presencia visual de funcionalidad efectiva.

---

## Prueba principal

### ID
AUD-MOV-DIR-247-A

### Módulo
Navegación móvil / Carpeta Director

### Entrada
Abrir DocenteDigital con viewport de ancho <=850 px después de completar la configuración inicial e intentar entrar al espacio **Director** usando únicamente controles visibles de la interfaz.

### Resultado esperado
Debe existir una ruta visible, simple y táctil hacia el espacio Director. El usuario no debe necesitar cambiar a vista de escritorio, ejecutar JavaScript, conocer una URL interna ni depender de una barra lateral oculta.

### Resultado obtenido
En `styles.css`, dentro de `@media(max-width:850px)`, `.sidebar{display:none}`. La navegación visible pasa a `.mobile-nav`, configurada con cinco columnas. En `index.html`, esa barra solo incluye:

- Inicio
- Plan
- Sesión
- Materiales
- Evaluación

No contiene botón para `go('director')` ni para `go('settings')`.

El mismo HTML y CSS se sirven actualmente en producción. La respuesta productiva de `https://docente-digital.vercel.app/` fue HTTP 200 y contiene exactamente esa estructura.

### Evidencia

Repositorio:
- `styles.css`: `.sidebar{display:none}` dentro de `@media(max-width:850px)` y `.mobile-nav{display:grid;grid-template-columns:repeat(5,1fr)...}`.
- `index.html`: `<nav class="mobile-nav">` contiene cinco botones y ninguno apunta a `director` o `settings`.

Producción:
- `https://docente-digital.vercel.app/` respondió HTTP 200 y sirve la misma navegación móvil.

### PASA / NO PASA
**NO PASA**

### Severidad
**S1 CRÍTICO**

Justificación: V5 exige que el producto sea utilizable en celular y que el flujo Director sea una función esencial V1.0. En ancho móvil, el rol Director pierde desde la UI visible la única ruta al módulo Director porque la barra lateral desaparece y la barra móvil no la sustituye. Esto impide demostrar el recorrido Director móvil extremo a extremo y entra en el gate de “app inutilizable en celular” para un espacio funcional principal.

---

## Prueba secundaria

### ID
AUD-MOV-SET-247-B

### Módulo
Configuración móvil

### Entrada
Desde viewport <=850 px intentar abrir Configuración mediante controles visibles.

### Esperado
Ruta visible hacia datos institucionales/pedagógicos reutilizables, especialmente porque V4/V5 exigen configuración reutilizable, recuperación y continuidad.

### Obtenido
La barra lateral que contiene Configuración está oculta y la barra móvil no incorpora Configuración.

### Resultado
**NO PASA — S2 ALTO**, absorbido por el hallazgo S1 principal porque comparte la misma causa raíz de navegación móvil incompleta.

---

## Causa raíz

El diseño responsive elimina la navegación de escritorio sin asegurar equivalencia funcional de destinos en la navegación móvil. Se optimizó la barra inferior para cinco accesos docentes, pero no se implementó una estrategia de navegación para el segundo rol principal del producto.

---

## Acción correctiva recomendada

No añadir siete iconos comprimidos a la barra inferior sin prueba UX. Implementar una navegación móvil que conserve acceso a ambos roles y a funciones secundarias, por ejemplo:

1. mantener 4–5 accesos frecuentes según rol activo;
2. incluir una entrada `Más` o menú accesible con Director/Configuración cuando corresponda;
3. si el usuario ejerce rol Director, priorizar los accesos de Carpeta Director;
4. conservar una ruta visible para alternar Docente/Director en IE unidocente cuando una persona ejerza ambos roles;
5. probar foco, lector de pantalla, tamaño táctil y navegación con pulgar;
6. probar físicamente en celular económico, gama media y tablet.

No debe resolverse ocultando funciones esenciales ni obligando a usar “sitio de escritorio”.

---

## Corrección aplicada en esta ronda

**No aplicada.** Aunque el defecto es verificable, una modificación superficial de la barra inferior puede empeorar V4 por exceso de opciones, targets táctiles pequeños o confusión de rol. La corrección debe diseñar navegación móvil por rol y luego probarse de forma interactiva/física. Se deja pendiente para no declarar una corrección no demostrada.

---

## Riesgo de regresión

**Medio.** Cambiar navegación móvil puede afectar espacio disponible, accesibilidad, selección activa, retorno contextual y flujos Docente. Debe probarse al menos en 320, 360, 375, 390, 412, 768 y 850 px, además de dispositivos físicos.

---

## Impacto en indicadores

- **ISU:** impacto directo negativo en encontrar funciones y uso móvil.
- **IFR:** no se calcula; el flujo Director móvil queda incompleto.
- **ICGD:** impacto negativo porque Carpeta Director no puede demostrarse extremo a extremo en móvil.
- **IUD:** impacto negativo por equivalencia funcional insuficiente entre escritorio y móvil.
- **Prelaunch:** bloqueante mientras no se corrija y pruebe realmente.

No se calcula puntuación definitiva.

---

## Pruebas que permanecen pendientes

- celular físico económico;
- celular físico gama media;
- tablet;
- navegación por lector de pantalla;
- prueba del pulgar;
- usuario Director principiante sin manual;
- flujo Director extremo a extremo móvil;
- prueba de retorno y recuperación después de cambiar de módulo.

---

## Conclusión

DocenteDigital **NO PASA** AUD-MOV-DIR-247-A. La producción responde y renderiza, pero a ancho móvil la interfaz elimina la ruta visible hacia uno de los dos espacios principales definidos por V2: Carpeta Director. Esto demuestra por qué V3/V5 prohíben aprobar por simple presencia o HTTP 200.

DocenteDigital continúa **NO APROBADA PARA LANZAMIENTO V1.0**.