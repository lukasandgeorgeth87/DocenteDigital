# AUD-QUICK-ASSISTANT-DIRECTOR-ROUTING-189 — El acceso rápido en lenguaje natural desvía pedidos del Director a Unidad/Proyecto

## Alcance
Auditoría acumulativa basada conjuntamente en `AUDITORIA_MAESTRA_INTEGRAL_V2.md`, `ADENDA_AUDITORIA_EJECUTABLE_V3.md`, `AUDITORIA_SIMPLICIDAD_USO_V4.md`, `AUDITORIA_PRELANZAMIENTO_V5.md` y `NUCLEO_IA_DOCENTEDIGITAL.md`.

No se aplica ni se declara vigente una norma externa en este hallazgo: la regla verificada es contractual/interna de V4 y del Núcleo IA. Por tanto, no corresponde atribuirle vigencia MINEDU, UGEL ni legal externa.

## ID de prueba
**AUD-QUICK-ASSISTANT-DIRECTOR-ROUTING-189**

## Módulo
Inicio / entrada `💬 ¿Qué quieres preparar hoy?` / enrutamiento por intención Docente-Director.

## Entrada
Caso literal exigido por V4 como ejemplo de uso en lenguaje natural:

`Necesito un oficio para la UGEL`

Casos de contraste:

1. `Quiero una sesión sobre la papa`.
2. `Necesito una evaluación`.
3. `Necesito un oficio para la UGEL`.

## Resultado esperado
V4 §11 exige una entrada visible en lenguaje natural capaz de aceptar pedidos como `Quiero una sesión sobre la papa` o `Necesito un oficio para la UGEL` y enrutar al flujo correspondiente. V4 §12 establece que el usuario no debe estar obligado a conocer el nombre del documento si puede expresar su necesidad.

El Núcleo IA exige identificar rol, tipo de documento/tarea, intención real, finalidad y destinatario; para Director debe separar documento, motivo, resultado esperado, destinatario, datos institucionales, plazo, responsables, normativa por verificar e información faltante, sin inventar.

Para el caso probado, el sistema debe reconocer un pedido administrativo/directivo y llevar al flujo Director/Oficio cuando esté disponible. Si el flujo todavía no está implementado, la verdad funcional correcta es informar claramente `En desarrollo/Próximamente`, no crear una Unidad/Proyecto docente a partir del texto administrativo.

## Resultado obtenido
En `format-v2.js`, la acción de `ddQuickGo` solo reconoce explícitamente:

- `sesión|sesion` → `go('session')`;
- `evaluación|evaluacion|rúbrica|rubrica` → `go('evaluation')`;
- cualquier otro texto → `go('plan')`, `showUnit()`, copia el pedido a `unitSituation` y ejecuta `ddSuggestTitles()`.

Por tanto, `Necesito un oficio para la UGEL` entra por la rama genérica y se convierte en contexto de una Unidad/Proyecto. El usuario no es dirigido al espacio Director ni recibe la advertencia de que Oficios todavía no está disponible para lanzamiento.

La cadena productiva carga `format-v2.js` y después `schedule-prompt-v6.js`. Este último carga `home-surface-truth-v73.js`, que marca Materiales, Evaluación, Diagnóstico, Programación anual y acciones directivas no implementadas como `Próximamente`, pero no sustituye ni protege el manejador `ddQuickGo`. La misma implementación de `format-v2.js` fue comprobada en la URL productiva con HTTP 200.

Este hallazgo es distinto de `AUD-IA-SEMANTIC-159`: 159 documenta la ausencia de un intérprete IA semántico remoto general; 189 demuestra una falla ejecutable específica de la superficie V4: un ejemplo literal exigido por V4 es encaminado al flujo equivocado.

## Evidencia
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`, §§11–12: entrada natural visible y ejemplo literal de Oficio para UGEL.
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`, §§1, 5 y 8: perfil semántico, herencia Docente/Director y comprensión administrativa.
- `format-v2.js`: manejador `ddQuickGo` con dos ramas y fallback universal a Unidad/Proyecto.
- `schedule-prompt-v6.js`: carga `home-surface-truth-v73.js` después de `format-v2.js`.
- `home-surface-truth-v73.js`: protege acciones Director no conectadas, pero no modifica el enrutador rápido.
- Producción `https://docente-digital.vercel.app/format-v2.js`: HTTP 200 y misma lógica de enrutamiento.

## PASA / NO PASA
**NO PASA**

## Clasificación
**PARCIALMENTE FUNCIONAL** globalmente; **ROTA** para intenciones Director/Oficio desde el acceso rápido.

## Severidad
**S2 ALTO**

Justificación: induce al usuario a un flujo funcionalmente incorrecto, contradice una prueba explícita V4 y puede transformar una necesidad administrativa en una planificación docente. No se eleva a S1 porque el flujo Director ya está marcado como no disponible y en esta prueba no se genera ni emite un acto administrativo, norma o correlativo falso.

## Causa raíz
El acceso rápido fue diseñado como un router local mínimo de prototipo basado en dos grupos de expresiones y un fallback docente universal. La arquitectura semántica posterior no está conectada a este botón como router de intención Docente/Director.

## Acción correctiva
1. Conectar la entrada rápida al perfil semántico/intent router antes de navegar.
2. Determinar `role` y `task/documentType` de manera estructurada; no usar un banco cerrado de palabras como inteligencia principal.
3. Si se detecta una intención Director cuyo flujo aún no está listo, detener el enrutamiento y mostrar una respuesta simple de verdad funcional (`Oficios · Próximamente`) sin convertir el texto en Unidad/Proyecto.
4. Mantener las guardas locales solo como protección contra misrouting evidente, no como sustituto del Núcleo IA.
5. Añadir golden tests mínimos: sesión, unidad/proyecto, evaluación, oficio, RD, informe, PAT y pedido ambiguo.
6. Reprobar en móvil y escritorio, con teclado y entrada táctil.

## Reprueba obligatoria
- `Quiero una sesión sobre la papa` → Sesión o pregunta mínima si falta unidad/contexto.
- `Necesito un oficio para la UGEL` → Director/Oficio o aviso `Próximamente`, nunca Unidad/Proyecto.
- `Debo informar a la UGEL sobre una incidencia` → sugerir Informe/Oficio según información disponible, sin inventar hechos.
- `Necesito actualizar el PAT` → Director/PAT o aviso de función pendiente.
- Texto ambiguo → no asumir Docente por defecto cuando el rol/tarea sea determinante.

## Riesgo de regresión
**MEDIO-ALTO**. Cambiar el router puede afectar el acceso rápido Docente; debe preservarse el fallback seguro y probarse navegación, historial, Modo Fácil y móvil.

## Impacto en indicadores
- **IUD:** afectado; añade desvíos y retrabajo.
- **ICGD:** afectado porque la intención no llega al dominio correcto.
- **IFR:** pendiente, pero el misrouting aumenta reelaboración potencial.
- **ISU:** afectado directamente en “crear con una frase” y “no hacer pensar en la app”; no se calcula puntaje definitivo.
- **Prelaunch:** evidencia adicional de que la experiencia transversal Docente/Director no está cerrada; no modifica por sí sola los bloqueantes S1 ya abiertos.

## Estado acumulativo
**ABIERTO / PENDIENTE DE CORRECCIÓN Y REPRUEBA REAL.**

DocenteDigital no se declara lista para lanzamiento. No se calculan ISU, IFR ni Prelaunch Score definitivos.