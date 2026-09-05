# AUD-DIRECTOR-DEAD-ACTIONS-181

## Hallazgo corregido

**Módulo:** Carpeta Director / acciones principales y disponibilidad funcional

**Clasificación:** INEXISTENTE para los flujos Director V1.0 / superficie correctamente marcada como EN DESARROLLO cuando carga la guardia estable

**Severidad:** S1 CRÍTICO — bloqueante del Gate V5

> Corrección de evidencia: la primera versión de este informe afirmó que producción dejaba los cuatro botones del Director simplemente inertes y que los módulos directivos no se cargaban. La revisión posterior del cargador estable demuestra que esa afirmación era incompleta. `schedule-prompt-v6.js` carga de forma dinámica `director-creativity-v16.js` y `director-prototype-guard-v40.js`; esta última guardia deshabilita los botones sin acción, añade `aria-disabled="true"`, agrega `· En desarrollo` al texto y muestra un aviso breve. Por tanto, la superficie no debe clasificarse como engañosamente funcional cuando la cadena estable termina de cargar. El bloqueante real permanece: no existen todavía los flujos Director V1.0 exigidos por V5.

## Especificaciones aplicables

- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`: Carpeta Director debe cubrir planificación institucional, gestión, documentos de gestión, RD, oficios, informes, planes, comités, CONEI, seguimiento y archivo; Docente y Director deben compartir información institucional.
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`: una función no aprueba por aparecer o responder; debe existir entrada → esperado → obtenido → evidencia → pasa/no pasa → severidad → corrección. Carpeta Director debe modelar procesos completos.
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`: las funciones principales deben ser localizables y utilizables sin manual; las funciones todavía no disponibles no deben aparentar funcionamiento real.
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`: flujo E2E Director obligatorio: Perfil IE → Diagnóstico → Documentos de gestión → PAT/actividades → Documentación administrativa → Evidencias → Informes → Archivo → Seguimiento. Carpeta Director V1.0 incluye ficha institucional, documentos de gestión/planes, oficios, RD, informes, actas, comités/CONEI, archivo, buscador, correlativos y seguimiento.
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`: el núcleo debe comprender solicitudes administrativas, distinguir documento/motivo/destinatario/datos/plazo/responsables y nunca inventar normas, acuerdos o firmas.

## Prueba

**ID:** AUD-DIRECTOR-DEAD-ACTIONS-181

**Entrada:** Perfil configurado → abrir `🏫 Director` → revisar las cuatro acciones principales:

1. `Continuar pendiente`
2. `Crear documento`
3. `DG y Planes`
4. `Asistente del Director`

**Resultado esperado para aprobar V1.0:** cada acción debe abrir un flujo directivo real, guiado y persistente, reutilizando la Ficha Maestra y permitiendo continuar con el proceso correspondiente.

**Resultado obtenido en HTML base:** `index.html` contiene cuatro botones sin manejador funcional propio.

**Resultado obtenido con la cadena runtime estable:** `schedule-prompt-v6.js` carga, entre otros módulos, `director-creativity-v16.js` y `director-prototype-guard-v40.js`. `director-prototype-guard-v40.js` localiza botones del área Director que no tienen acción, los deshabilita, añade `aria-disabled="true"`, cambia su etiqueta a `... · En desarrollo` y muestra el aviso `En desarrollo: algunas opciones todavía no están disponibles.`

La guardia evita que el usuario interprete esos controles como funciones terminadas, pero no implementa los procesos Director requeridos.

**PASA/NO PASA:** NO PASA para Gate V5 / PASA la defensa de verdad de superficie cuando la guardia carga correctamente.

## Evidencia reproducible

### HTML base

```html
<section id="director" class="screen">
  ...
  <button class="btn">Continuar</button>
  <button class="btn alt">Crear</button>
  <button class="btn alt">Abrir</button>
  <button class="btn amber">Preguntar</button>
</section>
```

### Cargador estable

`schedule-prompt-v6.js` incluye explícitamente:

```js
'director-creativity-v16.js',
'director-prototype-guard-v40.js',
```

### Guardia de prototipo

`director-prototype-guard-v40.js` aplica a cada botón sin acción:

```js
btn.disabled=true;
btn.setAttribute('aria-disabled','true');
btn.title='Esta opción aún está en desarrollo.';
btn.textContent=`${btn.textContent.trim()} · En desarrollo`;
```

y añade un aviso de disponibilidad pendiente.

## Causa raíz real

Los procesos funcionales de Carpeta Director todavía no están implementados/conectados para V1.0. La aplicación sí contiene una defensa de superficie que comunica correctamente esa indisponibilidad, por lo que no debe confundirse `función inexistente` con `botón engañosamente operativo`.

## Riesgo

- El recorrido E2E Director requerido por V5 sigue bloqueado.
- No pueden demostrarse todavía Oficio, RD, DG/PAT, archivo, correlativos, trazabilidad, seguimiento ni asistente administrativo real.
- Si el cargador estable o la guardia fallan, el HTML base vuelve a exponer botones sin acción; el sistema de carga ya dispone de aviso global de fallo de módulos, pero este comportamiento debe seguir probándose.
- La severidad S1 se mantiene por ausencia de funciones esenciales V1.0, no por un falso positivo de UX.

## Acción correctiva requerida

No resolver con `alert()`, texto estático ni navegación a pantallas vacías. Mantener la guardia actual mientras se implementa por etapas y con datos reales:

1. modelo de Ficha Institucional compartida;
2. router/acciones directivas reales;
3. flujo `Crear documento` orientado por necesidad;
4. DG/planes con persistencia, edición, historial y reutilización;
5. Oficio/RD/Informe/Acta con verificación reforzada en actos de riesgo;
6. correlativos y estados documentales;
7. archivo/buscador/recuperación;
8. continuidad y pendientes;
9. asistente semántico Director conectado al Núcleo IA;
10. pruebas E2E V3/V5.

## Corrección aplicada en esta revisión

No se alteró lógica funcional. Se corrigió este informe acumulativo para eliminar la afirmación incorrecta de que los módulos directivos no se cargan y para reconocer la guardia de prototipo ya existente. Es un cambio documental pequeño, reversible y verificable.

## Riesgo de regresión

ALTO cuando se conecten acciones de Director, porque deberá probarse que no rompan Ficha Maestra, históricos, correlativos, permisos, seguridad, navegación móvil ni los flujos Docente existentes. También debe conservarse la regla de no exponer controles como disponibles hasta que el flujo real apruebe V3/V5.

## Impacto en métricas

- **IUD:** continúa afectado por ausencia de uso Director real.
- **ICGD:** continúa bloqueado para Carpeta Director.
- **IFR:** no puede considerarse completo mientras falten acciones esenciales.
- **ISU:** la verdad de superficie mejora gracias a la guardia, pero no permite puntaje definitivo sin usuarios reales.
- **Prelaunch:** bloqueante V5 por funcionalidad esencial faltante. No calcular score definitivo.

## Veredicto asociado

DocenteDigital continúa **NO APROBADA PARA LANZAMIENTO V1.0** mientras la Carpeta Director esencial permanezca sin flujos funcionales demostrables y existan otros bloqueantes V5/pruebas reales pendientes.
