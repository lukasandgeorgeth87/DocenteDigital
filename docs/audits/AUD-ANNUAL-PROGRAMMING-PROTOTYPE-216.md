# AUD-ANNUAL-PROGRAMMING-PROTOTYPE-216

## Resumen

**Módulo:** Carpeta Docente → Mi planificación → Programación anual  
**Estado:** INEXISTENTE como función V1.0 / SIMULADA en la interfaz  
**Resultado:** NO PASA  
**Severidad:** S1 CRÍTICO — bloqueante V5  
**Fecha de verificación:** 2026-09-07

## Especificaciones aplicadas

- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`: la Carpeta Docente debe incluir Programación anual y mantener trazabilidad Programación → Unidad/Proyecto → Sesiones → Evaluación → Registro.
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`: una función no aprueba por aparecer o responder; debe demostrar entrada, resultado, persistencia, recuperación, edición, exportación y trazabilidad.
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`: la experiencia debe ser simple, guiada y reutilizar datos ya conocidos.
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`: Programación es función esencial V1.0 y forma parte del E2E Docente obligatorio Perfil IE → Programación → Unidad/Proyecto → Sesiones → Materiales → Evaluación → Registro → Seguimiento.
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`: el significado debe heredarse desde diagnóstico/programación hacia unidad, sesiones, materiales, evaluación y registro.

## ID de prueba

### AUD-ANNUAL-216-A — Abrir Programación anual

**Entrada:** Perfil IE configurado → Mi planificación → Programación anual → `Abrir`.

**Resultado esperado:** abrir una programación anual real, editable y persistente que reutilice perfil IE, diagnóstico, contexto, calendario, áreas, grados y recursos; permita guardar, recuperar, editar y alimentar unidades/proyectos posteriores.

**Resultado obtenido:** `index.html` expone el botón `Abrir` enlazado a `demoAnnual()`. En `app.js`, `demoAnnual()` únicamente ejecuta un `alert()` con el texto: `Prototipo: la programación anual usará diagnóstico, contexto, calendario, recursos y CNEB para proponer una planificación editable.` No crea documento, no genera estructura anual, no persiste datos, no permite editar, no exporta y no crea vínculo hacia unidades/proyectos.

**Evidencia:**
- `index.html`: tarjeta `📅 Programación anual` → `onclick="demoAnnual()"`.
- `app.js`: `function demoAnnual(){alert('Prototipo: la programación anual usará diagnóstico, contexto, calendario, recursos y CNEB para proponer una planificación editable.')}`.
- Producción `https://docente-digital.vercel.app/` y `/app.js` verificadas el 2026-09-07 devuelven ese mismo wiring y código.

**PASA/NO PASA:** NO PASA.

## Clasificación funcional

- Tarjeta y botón visibles: **FUNCIONAL visualmente**.
- Apertura de una programación anual real: **SIMULADA**.
- Generación de programación anual: **INEXISTENTE**.
- Guardado/recuperación: **INEXISTENTE**.
- Edición: **INEXISTENTE**.
- Exportación: **INEXISTENTE**.
- Trazabilidad Programación → Unidad/Proyecto: **INEXISTENTE**.
- Reajuste con diagnóstico/contexto/avances anunciado por la UI: **INEXISTENTE / NO DEMOSTRADO**.

## Causa raíz

La interfaz presenta Programación anual como función accesible, pero el runtime conserva una función demostrativa (`demoAnnual`) que solo muestra un mensaje. No existe un modelo de datos `annualPrograms[]` ni equivalente, ni una relación persistente con diagnóstico/unidades.

## Acción correctiva requerida

No reemplazar el `alert()` por texto estático o una plantilla cosmética. Implementar como mínimo:

1. entidad persistente de Programación anual con ID estable y año;
2. reutilización de Ficha Maestra/Perfil IE y diagnóstico;
3. organización temporal anual por periodos y áreas según nivel/organización de IE;
4. edición y autoguardado;
5. recuperación, recientes, buscador y papelera cuando corresponda;
6. relación explícita `annualProgramId → unit/project IDs`;
7. conservación de históricos ante cambios posteriores de datos maestros;
8. exportación profesional posterior a la implementación DOCX/PDF real;
9. retest E2E Programación → Unidad/Proyecto → Sesiones → Evaluación → Registro.

## Corrección automática

**No aplicada.** Reemplazar la simulación por una implementación parcial sería riesgoso porque requiere modelo de datos, persistencia, trazabilidad curricular y decisiones pedagógicas. Según la política de auditoría, debe quedar pendiente hasta disponer de una implementación verificable.

## Riesgo de regresión

Alto si se implementa sin un esquema documental versionado: puede romper unidades ya guardadas, duplicar información de Ficha Maestra o crear una programación desconectada de las unidades.

## Impacto

- **IUD:** negativo; obliga a trabajar fuera de la app o saltar el eslabón anual.
- **ICGD:** negativo; rompe continuidad documental.
- **IFR:** no calculable de forma definitiva; la cadena funcional está incompleta.
- **ISU:** no calculable de forma definitiva; un botón simple que no realiza la tarea no cuenta como simplicidad efectiva.
- **Prelaunch:** **BLOQUEADO** por ausencia de una función esencial V1.0 y ruptura del E2E Docente.

## Normativa externa

Este hallazgo no necesita declarar vigencia de una norma MINEDU/UGEL externa: se basa en las especificaciones internas obligatorias V2–V5 y Núcleo IA, además del comportamiento técnico verificable del runtime. Cualquier contenido curricular/normativo que se implemente posteriormente deberá verificarse contra fuente oficial vigente antes de aplicarse.

## Estado de lanzamiento

**DocenteDigital NO está lista para lanzamiento V1.0.** Este hallazgo se suma a los bloqueantes acumulados existentes; no se calculan ISU/IFR/Prelaunch Score definitivos.