# AUD-MOBILE-DIRECTOR-NAV-INACCESSIBLE-247

## Estado vigente — consolidado 2026-09-11

Este informe documentó históricamente la misma causa raíz que `AUD-MOBILE-DIRECTOR-NAV-ABSENT-220`: la barra móvil base no incluía Director ni Configuración mientras la barra lateral se ocultaba a <=850 px.

La evidencia actual obliga a rectificar el estado.

**Resultado histórico:** NO PASA — S1 CRÍTICO.

**Resultado vigente de la causa específica:** **CORREGIDO TÉCNICAMENTE / PENDIENTE DE VALIDACIÓN E2E Y FÍSICA**.

**Clasificación vigente:** integración declarada FUNCIONAL; comportamiento final en dispositivo real PENDIENTE.

**Severidad vigente por “ruta móvil inexistente”:** sin severidad abierta por defecto demostrado. No duplicar penalización con AUD-220.

**Gate V5:** continúa BLOQUEADO por pruebas reales esenciales y otros hallazgos independientes.

---

## Especificaciones aplicadas

V2 define Carpeta Director como uno de los dos espacios principales y exige reutilización de configuración institucional.

V3 exige `entrada → esperado → obtenido → evidencia → PASA/NO PASA → severidad → acción`, y prohíbe aprobar solo por presencia de código.

V4 exige funciones principales simples, navegación móvil usable, una jerarquía clara y evitar saturar la barra inferior.

V5 exige flujo Director extremo a extremo y pruebas físicas en celular económico, celular gama media y tablet.

---

## Evidencia histórica

El HTML base conserva una `.mobile-nav` con cinco botones: Inicio, Plan, Sesión, Materiales y Evaluación. `styles.css` oculta `.sidebar` a `max-width:850px`.

La conclusión histórica consideró solo esas dos capas y dedujo que Director y Configuración no tenían acceso móvil.

---

## Evidencia nueva que cambia el dictamen

### `mobile-navigation-guard-v60.js`
La producción contiene una guarda que:

1. localiza `.mobile-nav`;
2. agrega el botón `☰ Más`;
3. crea un menú accesible con `🏫 Director` y `⚙️ Configuración`;
4. ejecuta `go('director')` o `go('settings')`;
5. permite cerrar con clic exterior o Escape;
6. ajusta la navegación a seis columnas en <=850 px.

### Carga transitiva
`schedule-prompt-v6.js`, cargado directamente por `index.html`, contiene `__ddStableModuleLoaderV49` y enumera expresamente `mobile-navigation-guard-v60.js`. El cargador inserta cada módulo secuencialmente, reintenta una vez si falla y muestra una alerta si no puede cargarlo.

### Producción
En la revisión del 2026-09-11:

- la URL canónica respondió HTTP 200;
- `schedule-prompt-v6.js` respondió HTTP 200 con el loader esperado;
- `mobile-navigation-guard-v60.js` respondió HTTP 200 con el menú `Más`;
- el deployment productivo correspondiente a `main` estaba READY;
- no se encontraron errores runtime en la última hora.

Esto demuestra que la corrección está **desplegada y cableada declarativamente**. No demuestra por sí sola que el botón se haya pintado y accionado correctamente en un navegador/dispositivo real.

---

## Prueba AUD-MOV-DIR-247-A

**Entrada:** abrir DocenteDigital en viewport <=850 px, completar/cargar perfil y buscar una ruta visible a Director.

**Resultado esperado:** acceso visible y táctil sin usar URL interna ni vista de escritorio.

**Resultado obtenido verificable:** el código productivo cargado transitivamente implementa `Más → Director`.

**PASA/NO PASA:** **PASA a nivel de implementación e integración declarada; E2E/físico PENDIENTE.**

**Acción:** ejecutar navegador real y dispositivos físicos antes de cerrar V5.

---

## Prueba AUD-MOV-SET-247-B

**Entrada:** en viewport <=850 px intentar volver a Configuración.

**Resultado esperado:** ruta visible y sencilla.

**Resultado obtenido verificable:** la guarda implementa `Más → Configuración`.

**PASA/NO PASA:** **PASA a nivel de implementación e integración declarada; E2E/físico PENDIENTE.**

---

## Consolidación con AUD-220

AUD-247 y AUD-220 describen la misma causa raíz. AUD-220 queda como registro canónico de la rectificación; AUD-247 se conserva por trazabilidad histórica, pero **no debe contabilizarse como un S1 adicional**.

---

## Pruebas todavía obligatorias

- aparición de `Más` tras carga completa;
- navegación `Más → Director → volver`;
- navegación `Más → Configuración → volver`;
- 320/360/375/390/412/768/850 px;
- foco, Escape y navegación de teclado;
- prueba del pulgar y targets táctiles;
- ausencia de clipping/superposición;
- celular económico, gama media y tablet;
- director principiante sin manual;
- Oficio/RD/PAT/Informe extremo a extremo cuando esas funciones estén realmente disponibles.

---

## Impacto y gate

Se retira el **S1 específico por inexistencia técnica de la ruta móvil**. Esto no autoriza mejorar ISU, IUD, ICGD, IFR ni Prelaunch de forma definitiva porque faltan pruebas físicas y de usuarios reales.

DocenteDigital continúa **NO APROBADA PARA V1.0** mientras existan bloqueantes V5 independientes y evidencias esenciales pendientes.

## Normativa externa
No se declara ninguna nueva vigencia normativa MINEDU/UGEL en esta rectificación; es un hallazgo de UX/funcionalidad basado en V2/V3/V4/V5 y el runtime desplegado.
