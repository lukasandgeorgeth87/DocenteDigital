# AUD-DIRECTOR-DEAD-ACTIONS-181

## Hallazgo

**Módulo:** Carpeta Director / navegación y acciones principales

**Clasificación:** ROTA / SIMULADA en superficie

**Severidad:** S1 CRÍTICO — bloqueante del Gate V5

## Especificaciones aplicables

- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`: Carpeta Director debe cubrir planificación institucional, gestión, documentos de gestión, RD, oficios, informes, planes, comités, CONEI, seguimiento y archivo; Docente y Director deben compartir información institucional.
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`: una función no aprueba por aparecer o responder; debe existir entrada → esperado → obtenido → evidencia → pasa/no pasa → severidad → corrección. Carpeta Director debe modelar procesos completos.
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`: las funciones principales deben ser localizables y utilizables sin manual; una acción principal visible debe funcionar realmente.
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`: flujo E2E Director obligatorio: Perfil IE → Diagnóstico → Documentos de gestión → PAT/actividades → Documentación administrativa → Evidencias → Informes → Archivo → Seguimiento. Carpeta Director V1.0 incluye ficha institucional, documentos de gestión/planes, oficios, RD, informes, actas, comités/CONEI, archivo, buscador, correlativos y seguimiento.
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`: el núcleo debe comprender solicitudes administrativas, distinguir documento/motivo/destinatario/datos/plazo/responsables y nunca inventar normas, acuerdos o firmas.

## Prueba

**ID:** AUD-DIRECTOR-DEAD-ACTIONS-181

**Entrada:** Perfil configurado → abrir `🏫 Director` → intentar usar cualquiera de las cuatro acciones principales visibles:

1. `Continuar pendiente` → botón `Continuar`
2. `Crear documento` → botón `Crear`
3. `DG y Planes` → botón `Abrir`
4. `Asistente del Director` → botón `Preguntar`

**Resultado esperado:** cada acción debe abrir un flujo directivo real, guiado y persistente, reutilizando la Ficha Maestra y permitiendo continuar con el proceso correspondiente.

**Resultado obtenido:** en `index.html` los cuatro botones del `<section id="director">` no tienen `onclick`, `id`, `data-*` de acción ni otro contrato explícito para ejecutar funciones. La producción sirve exactamente esos botones inertes. Además, el `index.html` productivo no carga los módulos directivos que existen en el repositorio (por ejemplo `director-creativity-v16.js` y `director-prototype-guard-v40.js`); la cadena de scripts cargada termina con módulos docentes/horario y no conecta una arquitectura funcional de Director.

**PASA/NO PASA:** NO PASA

## Evidencia reproducible

Fragmento productivo:

```html
<section id="director" class="screen">
  <h1>Espacio del Director</h1>
  ...
  <button class="btn">Continuar</button>
  ...
  <button class="btn alt">Crear</button>
  ...
  <button class="btn alt">Abrir</button>
  ...
  <button class="btn amber">Preguntar</button>
</section>
```

Ninguno tiene manejador de acción.

La producción canónica `https://docente-digital.vercel.app/` respondió HTTP 200 y sirvió este mismo HTML durante la prueba, por lo que no es una discrepancia entre GitHub y producción.

## Causa raíz

La superficie visual de Carpeta Director fue publicada antes de conectar los flujos funcionales y su arquitectura de datos/procesos. Existen piezas directivas en el repositorio, pero no están integradas al documento productivo ni conectadas a estas acciones principales.

## Riesgo

- El usuario Director puede entrar al espacio pero no puede iniciar ninguna tarea principal.
- El recorrido E2E Director requerido por V5 queda bloqueado desde el primer paso operativo.
- La interfaz comunica disponibilidad funcional donde solo existe superficie visual.
- No pueden demostrarse todavía oficios, RD, DG/PAT, archivo, correlativos, trazabilidad ni seguimiento desde este flujo.

## Acción correctiva requerida

No resolver con `alert()`, texto estático ni navegación a pantallas vacías.

Implementar por etapas y con datos reales:

1. modelo de Ficha Institucional compartida;
2. router/acciones directivas reales;
3. flujo `Crear documento` con selección por necesidad natural;
4. DG/planes con persistencia, edición, historial y reutilización;
5. Oficio/RD/Informe/Acta con verificación reforzada en actos de riesgo;
6. correlativos y estados documentales;
7. archivo/buscador/recuperación;
8. continuidad y pendientes;
9. asistente semántico Director conectado al Núcleo IA;
10. pruebas E2E V3/V5.

Mientras no exista, los controles deben marcarse explícitamente como `En desarrollo / Próximamente` y no aparentar acciones funcionales.

## Corrección aplicada en esta pasada

No se modificó la lógica funcional porque una corrección segura requiere arquitectura Director, persistencia, reglas administrativas y decisiones normativas. Se documenta el bloqueante sin simular funcionalidad.

## Evidencia posterior

- GitHub `main`: hallazgo documentado.
- Vercel: último despliegue previo al registro estaba `READY` y correspondía al SHA `a7961b3b21980a62de9a3b5af7ace0005eb1d76b`.
- Producción canónica: HTTP 200 durante la prueba.

## Riesgo de regresión

ALTO cuando se conecten acciones de Director, porque deberá probarse que no rompan Ficha Maestra, históricos, correlativos, permisos, seguridad, navegación móvil ni los flujos Docente existentes.

## Impacto en métricas

- **IUD:** impacto negativo alto por imposibilidad de uso real del perfil Director.
- **ICGD:** impacto negativo crítico en Carpeta Director.
- **IFR:** no puede considerarse completo mientras acciones esenciales estén inertes.
- **ISU:** no puede aprobar simplicidad funcional; una acción clara que no hace nada es peor que una función marcada como pendiente.
- **Prelaunch:** bloqueante V5. No calcular score definitivo.

## Veredicto asociado

DocenteDigital continúa **NO APROBADA PARA LANZAMIENTO V1.0** mientras Carpeta Director esencial permanezca sin flujo funcional demostrable y existan otros bloqueantes V5/pruebas reales pendientes.
