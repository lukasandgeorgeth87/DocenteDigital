# AUD-QUICK-ASSISTANT-DIRECTOR-ROUTING-189 — Acceso rápido Director ya no cae en Unidad/Proyecto

## Alcance
Auditoría acumulativa basada conjuntamente en `AUDITORIA_MAESTRA_INTEGRAL_V2.md`, `ADENDA_AUDITORIA_EJECUTABLE_V3.md`, `AUDITORIA_SIMPLICIDAD_USO_V4.md`, `AUDITORIA_PRELANZAMIENTO_V5.md` y `NUCLEO_IA_DOCENTEDIGITAL.md`.

No se aplica ni se declara vigente una norma externa en este hallazgo: la regla verificada es contractual/interna de V4 y del Núcleo IA.

## ID de prueba
**AUD-QUICK-ASSISTANT-DIRECTOR-ROUTING-189**

## Módulo
Inicio / entrada `💬 ¿Qué quieres preparar hoy?` / enrutamiento por intención Docente-Director.

## Entrada principal
`Necesito un oficio para la UGEL`

Casos protegidos por la corrección local:
- oficio;
- resolución / RD;
- PAT, PEI, PCI, RI;
- informe, acta, CONEI, comité;
- UGEL, DRE/GRE, Director, gestión escolar.

## Resultado esperado
V4 §11 exige una entrada visible en lenguaje natural capaz de aceptar pedidos como `Necesito un oficio para la UGEL` y enrutar al flujo correspondiente. Mientras el flujo Director no esté terminado, la salida correcta puede ser una superficie honesta de `Próximamente`, pero nunca convertir una necesidad administrativa en Unidad/Proyecto.

El Núcleo IA sigue exigiendo, para la solución final, comprensión semántica de rol, tarea, intención, finalidad, destinatario y datos faltantes; una lista local de expresiones no sustituye ese motor.

## Resultado obtenido antes de la corrección
`format-v2.js` reconocía solamente sesión y evaluación. Cualquier otro texto ejecutaba el fallback `go('plan') → showUnit()` y copiaba la solicitud a `unitSituation`. Por ello `Necesito un oficio para la UGEL` terminaba incorrectamente en Unidad/Proyecto.

## Corrección aplicada
Commit funcional:

`51aae1f48947aceac703442cd147aed480b805ac` — `fix: prevent Director intents from falling into planning`

Se agregó una guarda previa al fallback docente. Cuando la entrada contiene una intención administrativa/directiva inequívoca, la app:

1. navega al espacio `director`;
2. informa que la Carpeta Director sigue en construcción;
3. declara expresamente que la solicitud no se convertirá en Unidad/Proyecto;
4. termina el manejador antes de `go('plan')`.

El cambio es pequeño, reversible y no genera documentos, normas, acuerdos, correlativos ni datos administrativos.

## Reprueba
### Entrada
`Necesito un oficio para la UGEL`

### Resultado esperado
Director/Oficio o aviso honesto `Próximamente`; nunca Unidad/Proyecto.

### Resultado obtenido
La versión desplegada de `format-v2.js` contiene una rama previa para `oficio` y `ugel`, ejecuta `go('director')`, muestra el aviso de función en construcción y retorna antes del fallback de planificación.

### Evidencia posterior
- GitHub `main`: commit `51aae1f48947aceac703442cd147aed480b805ac`.
- Vercel deployment: `dpl_6xTkpKYcTFkp84UBNnUCpYTBijAv`.
- Target: `production`.
- Estado Vercel verificado: `READY`.
- La URL canónica `https://docente-digital.vercel.app/` respondió HTTP 200 después del despliegue.
- `https://docente-digital.vercel.app/format-v2.js` respondió HTTP 200 y contiene la nueva guarda Director.

## PASA / NO PASA
**PASA técnicamente para el defecto específico de misrouting documentado en AUD-189.**

La validación interactiva completa con usuarios/dispositivos reales permanece **PENDIENTE** conforme V3/V5.

## Clasificación
**FUNCIONAL a nivel de guarda contra el desvío específico.**

El asistente natural global continúa **PARCIALMENTE FUNCIONAL** porque esta corrección no constituye el perfil semántico del Núcleo IA ni demuestra comprensión abierta de lenguaje natural.

## Severidad
El **S2 ALTO de AUD-189 se RETIRA como hallazgo abierto independiente** tras la corrección técnica. No debe contabilizarse nuevamente mientras la misma ruta conserve el comportamiento comprobado.

Los déficits semánticos generales permanecen bajo sus hallazgos canónicos, en especial los relativos al Núcleo IA/comprensión semántica; este cierre no los resuelve ni reduce su severidad automáticamente.

## Causa raíz corregida
Fallback docente universal en el acceso rápido. Se agregó una barrera explícita para intenciones Director inequívocas hasta que exista el router semántico completo.

## Acción pendiente
1. Sustituir progresivamente la guarda por el perfil semántico estructurado definido en `NUCLEO_IA_DOCENTEDIGITAL.md`.
2. Mantener la guarda local como defensa secundaria contra misrouting evidente.
3. Añadir golden tests ejecutables para sesión, unidad/proyecto, evaluación, oficio, RD, informe, PAT y pedidos ambiguos.
4. Reprobar con navegador interactivo, móvil físico y usuarios reales.

## Riesgo de regresión
**MEDIO.** Un cambio posterior del acceso rápido puede volver a introducir el fallback universal. Debe conservarse prueba automática del caso literal `Necesito un oficio para la UGEL`.

## Impacto en indicadores
- **IUD:** mejora puntual al eliminar un desvío conocido; no se calcula puntaje.
- **ICGD:** mejora puntual de enrutamiento, no equivale a gestión directiva completa.
- **IFR:** pendiente de pruebas de usuario.
- **ISU:** mejora específica en “crear con una frase”; puntuación definitiva pendiente.
- **Prelaunch:** no desbloquea V5 por sí solo; permanecen otros bloqueantes y pruebas reales esenciales pendientes.

## Estado acumulativo
**CORREGIDO TÉCNICAMENTE / CERRADO COMO S2 ESPECÍFICO / E2E REAL PENDIENTE.**

DocenteDigital no se declara lista para lanzamiento. No se calculan ISU, IFR ni Prelaunch Score definitivos.