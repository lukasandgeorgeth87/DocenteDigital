# AUD-MOBILE-DIRECTOR-NAV-ABSENT-220

## Estado
- Fecha de verificación: 2026-09-07
- Módulo: navegación móvil / Carpeta Director / Configuración
- Resultado: NO PASA
- Severidad: S1 CRÍTICO — bloqueante V5
- Clasificación: navegación móvil Docente = PARCIALMENTE FUNCIONAL; acceso móvil a Director = INEXISTENTE desde la navegación; acceso móvil a Configuración = INEXISTENTE desde la navegación; prueba física en dispositivos = PENDIENTE

## Especificaciones aplicadas
Se aplicaron conjuntamente AUDITORIA_MAESTRA_INTEGRAL_V2, ADENDA_AUDITORIA_EJECUTABLE_V3, AUDITORIA_SIMPLICIDAD_USO_V4, AUDITORIA_PRELANZAMIENTO_V5 y NUCLEO_IA_DOCENTEDIGITAL.

V4 exige que un director principiante pueda localizar funciones frecuentes, que el botón principal sea claro y usable con el pulgar, y establece la prueba de 10 segundos para Oficio, RD, PAT e Informe. V5 exige probar móvil y considera la Carpeta Director parte del alcance esencial V1.0. V3 exige probar UX y funcionalidad por separado y no aprobar una función porque aparezca en otra superficie.

## Evidencia técnica
En `styles.css`, dentro de `@media(max-width:850px)`, `.sidebar{display:none}`. Por tanto la navegación lateral que sí incluye `Director` y `Configuración` desaparece en pantallas de hasta 850 px.

En `index.html`, la navegación móvil contiene únicamente cinco destinos: Inicio, Plan, Sesión, Materiales y Evaluación. No existe botón `data-screen="director"` ni `data-screen="settings"` dentro de `.mobile-nav`.

La producción `https://docente-digital.vercel.app/` sirve actualmente ese mismo HTML/CSS. El HTML productivo muestra la barra móvil con esos cinco destinos y el CSS productivo oculta la barra lateral a <=850 px.

## Prueba AUD-MOV-DIR-220-A
**Entrada:** abrir DocenteDigital con viewport <=850 px y completar el setup.

**Resultado esperado:** desde la navegación principal móvil, el usuario con rol/director debe poder llegar claramente a su espacio de trabajo sin depender de URLs internas, consola, zoom o conocimiento técnico.

**Resultado obtenido:** la barra lateral queda oculta; la barra móvil no contiene Director. No existe otra acción visible en Inicio que lleve al espacio Director.

**PASA/NO PASA:** NO PASA.

**Severidad:** S1 CRÍTICO.

**Acción correctiva:** rediseñar la navegación móvil para incluir el acceso Director sin aumentar confusión. No basta agregar un sexto botón mientras el núcleo Director siga bloqueado; primero debe definirse una navegación móvil coherente con V4 y la funcionalidad real disponible.

## Prueba AUD-MOV-SET-220-B
**Entrada:** viewport <=850 px → intentar volver a Configuración para modificar Ficha/Perfil.

**Resultado esperado:** ruta visible y simple.

**Resultado obtenido:** Configuración desaparece junto con la barra lateral y no está en la barra móvil.

**PASA/NO PASA:** NO PASA.

**Severidad:** S2 IMPORTANTE de forma aislada; queda absorbido por el S1 del flujo Director móvil.

## Causa raíz
La arquitectura responsive sustituye completamente la barra lateral por una navegación móvil de cinco destinos exclusivamente docentes, sin mecanismo `Más`, menú secundario, perfil/rol ni acceso equivalente a Director y Configuración.

## Corrección aplicada
No se modificó código en esta pasada. Agregar Director a la barra móvil expondría un módulo que ya tiene bloqueantes V1.0 abiertos y no resolvería Oficio/RD/PAT/Informe. La corrección debe hacerse junto con el flujo móvil real de Carpeta Director y pruebas de usabilidad.

## Evidencia posterior / producción
- Producción canónica consultada: HTTP 200.
- Vercel: deployment productivo actual READY.
- Errores runtime de la última hora: ninguno encontrado.
- La ausencia de errores no invalida el hallazgo porque es una omisión de navegación, no una excepción runtime.

## Riesgo de regresión
Alto si se añade un botón Director sin revisar ancho, accesibilidad, orden de prioridades, navegación por rol y el límite de acciones principales de V4. También debe evitarse ocultar funciones docentes frecuentes.

## Impacto en métricas
- IUD: impacto negativo por imposibilidad de completar el flujo Director en móvil.
- ICGD: impacto negativo por ruptura de acceso a la Carpeta Director.
- IFR: no calcular definitivo; este S1 invalida cualquier conclusión de preparación.
- ISU: no calcular definitivo; falla encontrar funciones y uso móvil.
- Prelaunch: BLOQUEADO.

## Pendientes reales
Permanecen PENDIENTES: prueba física en celular económico, celular gama media y tablet; prueba con director principiante; prueba de pulgar; medición de 10 segundos; Oficio/RD/PAT/Informe extremo a extremo; concurrencia; restore real y seguridad integral.

## Normativa externa
Este hallazgo es de funcionalidad/UX y no necesita declarar vigencia de una norma MINEDU/UGEL. No se atribuyó vigencia normativa externa sin fuente oficial.
