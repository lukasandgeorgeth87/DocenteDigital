# AUD-MOBILE-DIRECTOR-156 — Carpeta Director inaccesible desde navegación móvil

## Alcance
Auditoría acumulativa V2 + V3 + V4 + V5 + Núcleo IA. Hallazgo técnico/UX; no requiere declarar vigencia de una norma MINEDU externa.

## ID de prueba
AUD-MOBILE-DIRECTOR-156

## Módulo
UX móvil / navegación / Carpeta Director / Prelaunch V5

## Entrada
1. Abrir DocenteDigital en una ventana con ancho <= 850 px.
2. Completar la configuración mínima necesaria para entrar a la aplicación.
3. Intentar acceder a Carpeta Director usando únicamente la navegación visible de la interfaz móvil.

## Resultado esperado
- V4 exige que las funciones principales sean localizables sin manual, que exista navegación simple y que Director tenga accesos claros a su carpeta.
- V5 exige probar el recorrido Director extremo a extremo y considera bloqueante que la aplicación sea inutilizable en celular para funciones principales.
- La navegación móvil debe conservar una ruta visible y comprensible hacia Carpeta Director o un menú equivalente de “Más” que la contenga.

## Resultado obtenido
`styles.css` aplica, para `@media(max-width:850px)`, `.sidebar{display:none}` y activa `.mobile-nav`.

El HTML productivo de `.mobile-nav` contiene únicamente cinco destinos:
- Inicio
- Plan
- Sesión
- Materiales
- Evaluación

No contiene Director ni Configuración ni un menú “Más”.

Por ello, al ocultarse la barra lateral, la ruta visible `go('director')` desaparece de la interfaz móvil normal. La sección `#director` existe en el documento, pero no hay acceso navegable desde el menú móvil.

## Evidencia
- `styles.css`: media query <=850 px oculta `.sidebar` y muestra `.mobile-nav`.
- `index.html` / producción: `.mobile-nav` incluye cinco botones y ninguno apunta a `director`.
- Producción comprobada con HTTP 200.

## PASA / NO PASA
NO PASA

## Clasificación
ROTA en navegación móvil para Carpeta Director.

## Severidad
S1 CRÍTICO para Prelaunch V5.

Justificación: la Carpeta Director es función esencial V1.0 y su ruta no es accesible mediante la navegación móvil que reemplaza completamente a la navegación lateral. No se eleva a S0 porque no hay pérdida/fuga/corrupción de datos demostrada.

## Causa raíz
La navegación responsive fue diseñada solo para el recorrido Docente de cinco destinos. Al ocultarse la barra lateral en móvil no se implementó un mecanismo alternativo que conserve Director y Configuración.

## Acción correctiva recomendada
No basta con aumentar el número de iconos hasta saturar la barra inferior. Aplicar V4:
- mantener 4–5 acciones primarias;
- incorporar “Más” o selector de espacio Docente/Director;
- garantizar acceso visible a Director y Configuración;
- conservar botón Volver y una acción principal por pantalla;
- validar con ancho 320, 360, 375, 390 y 412 px;
- probar también orientación horizontal y zoom.

Como la Carpeta Director productiva aún está marcada “En desarrollo”, no se conecta una navegación que pueda hacer parecer terminada una función incompleta. La corrección de navegación debe integrarse junto con el cierre funcional de Director y después someterse a prueba móvil real.

## Reprueba obligatoria
1. Abrir en <=850 px.
2. Encontrar Director sin URL manual ni consola.
3. Entrar y volver al espacio anterior.
4. Confirmar que no se superponen botones ni contenido en 320–412 px.
5. Ejecutar flujo Director: Perfil IE → Diagnóstico → Gestión → PAT → Documentación → Evidencias → Informes → Archivo → Seguimiento.
6. Mantener prueba física en celular como PENDIENTE hasta ejecutarla realmente.

## Riesgo de regresión
Medio: cambios en navegación móvil pueden saturar la barra inferior, ocultar acciones docentes o generar objetivos táctiles pequeños.

## Impacto
- IUD: negativo, medible parcialmente por inspección técnica; definitivo pendiente de usuario real.
- ICGD: negativo porque impide iniciar el recorrido Director en móvil.
- IFR: sin cálculo definitivo.
- ISU: sin cálculo definitivo; afecta localización de funciones y uso móvil.
- Prelaunch: BLOQUEA cierre V5 hasta corregir y probar físicamente.

## Estado
ABIERTO.

DocenteDigital NO debe declararse lista para lanzamiento mientras este hallazgo y los demás bloqueantes V5 permanezcan abiertos.