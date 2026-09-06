# AUD-DIRECTOR-CORE-INEXISTENT-205 — Carpeta Director V1.0 no tiene todavía un flujo operativo ejecutable

## Especificaciones obligatorias aplicadas
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

## Prueba
**ID:** AUD-DIRECTOR-CORE-INEXISTENT-205

**Módulo:** Carpeta Director · flujo V1.0 extremo a extremo.

**Entrada:** abrir producción canónica y revisar el Espacio del Director como director principiante/experimentado, contrastando la superficie realmente servida con el recorrido obligatorio V5: Perfil IE → Diagnóstico → Gestión/Documentos de gestión → PAT → Documentación administrativa → Evidencias → Informes → Archivo → Seguimiento.

**Resultado esperado:** desde la Carpeta Director debe existir al menos una ruta operativa y trazable hacia las funciones V1.0 esenciales: ficha institucional, gestión/planes, oficios, RD, informes/actas, comités/CONEI, archivo/buscador/correlativos y seguimiento. Cada acción debe conducir a un flujo real que recupere datos institucionales, permita guardar, reabrir, editar y, cuando corresponda, exportar.

**Resultado obtenido:** el HTML productivo expone cuatro tarjetas: `Continuar pendiente`, `Crear documento`, `DG y Planes` y `Asistente del Director`, pero sus botones no tienen `onclick`, `data-action`, formulario ni otra acción declarativa. Además, `styles.css` aplica globalmente `#director .card .btn{display:none}` y añade a cada tarjeta la etiqueta `En desarrollo`. Por tanto, la propia producción reconoce que esas acciones todavía no están disponibles y no existe desde esa superficie un recorrido Director ejecutable.

En móvil la situación es todavía más restrictiva: bajo `@media(max-width:850px)` la barra lateral se oculta (`.sidebar{display:none}`) y la navegación inferior contiene solo Inicio, Plan, Sesión, Materiales y Evaluación; no incorpora Director. Así, la Carpeta Director tampoco tiene acceso principal visible en la navegación móvil canónica.

La inspección de producción confirma que el HTML servido conserva exactamente estas cuatro tarjetas sin acciones y el conjunto de scripts actual no convierte esta superficie en un flujo Director completo. La ausencia de errores runtime no modifica el resultado: se trata de capacidad esencial inexistente/no conectada, no de una excepción del servidor.

## Resultado
**NO PASA.**

## Clasificación
- Superficie informativa Director: **PARCIALMENTE FUNCIONAL** (se muestra y comunica que está en desarrollo).
- Continuar pendiente: **INEXISTENTE como función ejecutable**.
- Crear documento administrativo: **INEXISTENTE como flujo ejecutable desde la superficie canónica**.
- DG y Planes: **INEXISTENTE como flujo ejecutable desde la superficie canónica**.
- Asistente del Director: **INEXISTENTE como flujo ejecutable desde la superficie canónica**.
- Ruta Director E2E V5: **INEXISTENTE / NO DEMOSTRADA**.
- Acceso Director en navegación móvil principal: **INEXISTENTE**.

## Severidad
**S1 CRÍTICO — bloqueante V5.**

No se eleva a S0 porque no se observó fuga, corrupción ni privilegio indebido. Se clasifica S1 porque una de las dos carpetas centrales del producto y varias funciones expresamente esenciales de V1.0 no tienen todavía un recorrido operativo demostrable. V5 prohíbe declarar lista la aplicación cuando faltan funciones esenciales y exige probar el recorrido Director extremo a extremo.

## Causa raíz
La UI canónica contiene todavía una **fachada/prototipo protegida** para Director: las tarjetas sirven como marcador de intención de producto, pero no están conectadas a procesos persistentes de gestión institucional. Existen archivos auxiliares de Director en el repositorio, pero el hallazgo 204 ya demostró que presencia de assets no equivale a ejecución productiva; por tanto no se consideran funcionalidad real hasta estar cableados y probados.

## Acción correctiva
No se intenta habilitar los botones con enlaces o `onclick` ficticios, porque eso solo convertiría una ausencia explícita en una simulación peligrosa.

Corrección requerida, por fases:
1. definir el contrato de datos institucionales reutilizable desde la Ficha Maestra;
2. implementar primero un vertical Director completo y persistente, por ejemplo Ficha IE → PAT/actividad → documento relacionado → evidencia → informe → archivo;
3. incorporar luego Oficios, RD con verificación reforzada/correlativos, actas, comités/CONEI y seguimiento;
4. guardar procedencia, snapshot histórico y trazabilidad;
5. añadir acciones reales a la navegación solo cuando cada vertical pase pruebas de crear → guardar → cerrar → recuperar → editar → exportar;
6. incorporar acceso Director usable en móvil sin saturar la barra inferior (por ejemplo `Más` o navegación de rol), validado con V4;
7. ejecutar golden tests Director y E2E antes de retirar la etiqueta `En desarrollo`.

## Evidencia técnica
- `index.html` de `main`: sección `#director` con cuatro botones sin `onclick`/acción.
- `styles.css`: `#director .card .btn{display:none}` y `#director .card::after{content:'En desarrollo'...}`.
- `styles.css` móvil: `.sidebar{display:none}` bajo 850 px.
- `index.html` móvil: `mobile-nav` contiene únicamente Inicio, Plan, Sesión, Materiales y Evaluación.
- Producción canónica verificada: HTTP 200 y mismo HTML Director.
- Deployment previo a registrar este informe: `dpl_C8dGhhWvFxJbmUyykzSBqHf6YN5w`, `READY`, producción, SHA `da0cd1ed4a5fa902e8ddbf060dbd7b74aa7ab226`.
- Runtime errors en la última hora: ninguno encontrado. Esto no implica funcionalidad Director.

## Normativa externa
Este hallazgo no necesita aplicar ni declarar vigente una norma MINEDU/UGEL/legal externa: mide la existencia funcional exigida por V2–V5 y la propia especificación del Núcleo IA. No se formula afirmación normativa externa sin verificación oficial.

## Riesgo de regresión
**ALTO** si se “habilitan” botones antes de implementar persistencia, roles, trazabilidad y verificación administrativa. **MEDIO/BAJO** si se construyen verticales E2E pequeños, se mantienen como `En desarrollo` hasta aprobar y se incorporan smoke/golden tests antes de producción.

## Impacto en indicadores
- **IUD:** afectado cualitativamente; el Director no puede completar tareas básicas desde su espacio.
- **ICGD:** afectado de forma importante; la cadena de gestión documental no está demostrada.
- **IFR:** afectado; hosting READY no equivale a recorrido funcional.
- **ISU:** no se calcula; en móvil no existe acceso Director principal y en escritorio no existen acciones ejecutables.
- **Prelaunch:** **BLOQUEADO** por ausencia de la ruta Director V1.0 y por pruebas reales esenciales pendientes.

No se calculan puntajes definitivos.

## Pendientes reales
- Director E2E completo;
- persistencia y recuperación de documentos Director;
- RD/correlativos con verificación reforzada;
- archivo/buscador/papelera;
- roles y aislamiento multiusuario;
- exportación Word/PDF real;
- móvil físico;
- backup/restore;
- OWASP ASVS;
- pruebas de año completo;
- pilotos reales.

## Conclusión
**DocenteDigital NO está aprobada para lanzamiento V1.0.** La producción actual comunica honestamente que el espacio Director está `En desarrollo`, pero precisamente por ello el gate V5 no puede aprobar: la Carpeta Director todavía no dispone de un recorrido funcional extremo a extremo demostrable.