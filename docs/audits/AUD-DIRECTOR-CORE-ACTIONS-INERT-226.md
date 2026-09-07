# AUD-DIRECTOR-CORE-ACTIONS-INERT-226

## Resumen

Se confirma que la superficie principal de **Carpeta Director** existe visualmente, pero sus cuatro acciones principales no tienen manejadores ni flujo funcional asociado en la producción auditada: **Continuar pendiente**, **Crear documento**, **DG y Planes** y **Asistente del Director**. La interfaz, por tanto, no demuestra las funciones directivas esenciales exigidas por V2, V3, V4, V5 y el Núcleo IA.

**Severidad:** S1 CRÍTICO — bloqueante V5.

## Especificaciones obligatorias aplicadas

- **V2:** Carpeta Director debe ser un centro de gestión de la IE, con instrumentos de gestión, documentación administrativa, seguimiento, archivo y trazabilidad; no una colección de plantillas.
- **V3:** una función no aprueba por aparecer o responder; debe completar el proceso y mantener trazabilidad. La Carpeta Director debe modelar procesos completos.
- **V4:** un director principiante debe localizar y ejecutar tareas frecuentes con botones claros, pocos pasos y una acción principal evidente.
- **V5:** el E2E Director obligatorio es Perfil IE → Diagnóstico → Gestión → PAT → Documentación → Evidencias → Informes → Archivo → Seguimiento; las funciones Director forman parte del alcance esencial V1.0.
- **Núcleo IA:** los pedidos del Director deben interpretarse semánticamente, separar tipo de documento, motivo, resultado esperado, destinatario, datos institucionales, plazo, responsables, normativa a verificar y datos faltantes; no inventar hechos ni firmas.

## Evidencia técnica

En `index.html`, la sección `#director` contiene cuatro botones visibles:

- `Continuar`
- `Crear`
- `Abrir`
- `Preguntar`

Ninguno tiene `onclick`, listener declarado ni vínculo a una función de `app.js`.

En `app.js` tampoco existe un conjunto funcional Director equivalente a creación de oficio/RD/informe/PAT, correlativos, archivo, recuperación, seguimiento o asistente semántico directivo. El flujo real se detiene en la pantalla.

## Pruebas

### AUD-DIR-226-A — Continuar pendiente

**Entrada:** Perfil configurado → Director → Continuar pendiente → `Continuar`.

**Resultado esperado:** recuperar el último proceso/documento pendiente del Director y continuar desde el punto guardado.

**Resultado obtenido:** botón visible sin acción asociada.

**Evidencia:** botón sin manejador en `index.html`; no existe función correspondiente en `app.js`.

**Resultado:** NO PASA.

**Clasificación:** INEXISTENTE funcionalmente / FUNCIONAL solo como elemento visual.

**Severidad:** S1.

### AUD-DIR-226-B — Crear documento

**Entrada:** Director → Crear documento → `Crear`.

**Resultado esperado:** iniciar un flujo guiado que identifique la necesidad y permita producir, como mínimo según corresponda, oficio, RD, informe, acta u otro documento esencial con datos institucionales reutilizados y verificación reforzada en actos de riesgo.

**Resultado obtenido:** botón visible sin acción asociada; no existe selección de necesidad, tipo documental, destinatario, datos institucionales, verificación normativa, borrador, revisión, guardado o archivo.

**Resultado:** NO PASA.

**Clasificación:** INEXISTENTE.

**Severidad:** S1.

### AUD-DIR-226-C — DG y Planes

**Entrada:** Director → DG y Planes → `Abrir`.

**Resultado esperado:** acceder a documentos/instrumentos de gestión y planes aplicables, con recuperación de Ficha Maestra y seguimiento.

**Resultado obtenido:** botón visible sin acción asociada; no existe flujo DG/PAT/PEI/PCI/RI o equivalente demostrado.

**Resultado:** NO PASA.

**Clasificación:** INEXISTENTE.

**Severidad:** S1.

### AUD-DIR-226-D — Asistente del Director

**Entrada:** Director → Asistente del Director → `Preguntar`.

**Resultado esperado:** entrada en lenguaje natural que interprete intención administrativa y enrute al flujo pertinente conservando motivo, resultado esperado, destinatario, datos institucionales, plazos, responsables y requisitos normativos.

**Resultado obtenido:** botón visible sin acción asociada; no existe entrada semántica ni enrutamiento Director.

**Resultado:** NO PASA.

**Clasificación:** INEXISTENTE.

**Severidad:** S1.

## Causa raíz

La pantalla Director está implementada como **shell visual** anterior a la implementación de los procesos, entidades persistentes y guardas de seguridad/normativa necesarios. No existe todavía un motor operativo Director conectado a datos, persistencia, archivo, correlativos, trazabilidad o Núcleo IA.

## Acción correctiva

No corresponde añadir `onclick` que abra alertas o plantillas estáticas, porque eso convertiría una función inexistente en una simulación.

La corrección debe implementarse por flujo, con cambios pequeños y verificables:

1. definir entidades persistentes de procesos/documentos Director con IDs estables;
2. implementar primero un flujo esencial completo y de bajo riesgo (por ejemplo, oficio borrador sin firma automática), con Ficha Maestra, guardar/editar/recuperar/archivar;
3. añadir buscador, recientes, estado pendiente y trazabilidad;
4. implementar PAT/DG y seguimiento;
5. implementar RD solo con matriz de competencia y verificación normativa reforzada;
6. conectar el Asistente del Director al perfil semántico del Núcleo IA;
7. ejecutar pruebas E2E Director antes de habilitar visualmente funciones como disponibles.

## Evidencia posterior

No se modificó código funcional en esta auditoría porque la solución requiere backend/persistencia/roles/decisiones normativas y no puede validarse con un parche seguro y pequeño. El hallazgo queda PENDIENTE.

## Riesgo de regresión

Alto si se habilitan botones antes de implementar persistencia y control de competencia normativa: pueden aparecer documentos aparentemente funcionales sin trazabilidad, archivo o verificación de autoridad.

## Impacto en indicadores

- **IUD:** afectación alta en Carpeta Director.
- **ICGD:** afectación alta por ausencia de cadena directiva demostrada.
- **IFR:** no calcular definitivo; el E2E Director no está completo.
- **ISU:** no calcular definitivo; una pantalla simple con botones inertes no constituye simplicidad funcional.
- **Prelaunch:** bloqueante V5; no aprobar lanzamiento V1.0.

## Pruebas que continúan PENDIENTES

Usuarios Director reales, móvil físico, Word/PDF e impresión física, actos administrativos con verificación normativa real, seguridad/aislamiento multiusuario, backup/restore real, concurrencia y pilotos.
