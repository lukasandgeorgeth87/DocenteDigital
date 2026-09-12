# AUD-PRIVACY-GOVERNANCE-MISSING-264

Fecha de revalidación: 2026-09-12

## Dictamen

**NO PASA · INEXISTENTE como superficie/gobernanza de privacidad de prelanazamiento · S2 ALTO**

Este hallazgo no afirma por sí solo una infracción administrativa ni sustituye una evaluación jurídica. Registra que DocenteDigital ya recoge y conserva datos institucionales y nombres de personas en el navegador, pero la producción no presenta la gobernanza mínima exigida por la especificación V5 antes del lanzamiento: Política de Privacidad, Términos de Uso, canal/mecanismo para ejercicio de derechos y reglas de eliminación de datos cuando corresponda.

## Especificaciones obligatorias aplicadas

- V3: una función no aprueba por existir visualmente; debe demostrarse que usa, guarda, recupera y protege correctamente los datos. V3 también exige probar seguridad, aislamiento, recuperación y que el producto proteja datos antes de escalar.
- V5 §11 Seguridad y privacidad: exige cumplimiento de la normativa peruana vigente de protección de datos, minimización, Política de Privacidad, Términos de Uso, ejercicio de derechos, eliminación de cuenta/datos cuando corresponda y respuesta a incidentes.
- V5 §18: pérdida o fuga de información constituye bloqueante; la puntuación global no puede ocultar un bloqueante.

## Evidencia técnica de producción

### Datos tratados actualmente

`institution-master-v46.js` ofrece y persiste en `localStorage` una Ficha Maestra que puede contener, entre otros:

- nombre de la IE;
- código modular y código de local;
- UGEL / DRE-GRE;
- región, provincia, distrito y localidad;
- nombre del director/a;
- nombre del docente;
- número de docentes y estudiantes;
- calendario escolar/comunal;
- notas institucionales.

El propio módulo declara que estos datos se guardan solo en este navegador durante la etapa actual del prototipo y que una versión multiusuario requerirá autenticación y base de datos segura.

`app.js` persiste el estado general bajo la clave `docenteDigitalPrototype` mediante `localStorage.setItem(...)`.

### Superficie pública observada

La respuesta HTML productiva `https://docente-digital.vercel.app/` (HTTP 200) no muestra enlace, botón o sección identificable de:

- Política de Privacidad;
- Términos de Uso;
- ejercicio de derechos sobre datos personales;
- contacto/canal de privacidad;
- explicación de finalidades, conservación o eliminación de datos.

La búsqueda de repositorio realizada en esta ronda tampoco encontró una implementación con los términos `privacy`, `privacidad`, `protección datos`, `consentimiento` o `ARCO`.

## Verificación normativa actual

Se verificó contra fuentes oficiales antes de registrar este hallazgo:

- Ley N.º 29733, Ley de Protección de Datos Personales, publicada por el Congreso de la República en Gob.pe. Su objeto es garantizar el derecho fundamental a la protección de datos personales.
- Decreto Supremo N.º 016-2024-JUS, nuevo Reglamento de la Ley N.º 29733. La Autoridad Nacional de Protección de Datos Personales informa oficialmente que entró en vigencia el **31 de marzo de 2025**, salvo disposiciones específicas.

Este informe no presume qué obligaciones específicas resultarán aplicables a la versión final, su titular, sus bancos de datos o su futura arquitectura. Esa determinación debe cerrarse antes del lanzamiento con revisión jurídica y técnica basada en el tratamiento real implementado.

## Pruebas

### AUD-PRIV-264-A — Transparencia de privacidad

**Entrada:** abrir producción como usuario nuevo y revisar Inicio, Configuración y navegación pública.

**Resultado esperado:** antes de lanzamiento, acceso claro a Política de Privacidad y Términos de Uso, con información comprensible sobre tratamiento de datos.

**Resultado obtenido:** no se observa ninguna superficie de privacidad o términos en el HTML productivo revisado.

**Evidencia:** HTML productivo HTTP 200 + búsqueda de repositorio.

**Resultado:** **NO PASA**.

**Clasificación:** **INEXISTENTE**.

**Severidad:** **S2 ALTO**.

### AUD-PRIV-264-B — Ejercicio/eliminación de datos

**Entrada:** revisar Configuración y flujos actuales de datos buscando mecanismo específico de privacidad para conocer, corregir o eliminar datos cuando corresponda.

**Resultado esperado:** mecanismo definido y visible acorde al modelo de datos y responsabilidades del producto; no confundir un botón técnico de restablecimiento del prototipo con un procedimiento de privacidad.

**Resultado obtenido:** existe `Restablecer datos` para limpiar el estado del prototipo, pero no se observa política, canal de derechos, identificación del responsable, finalidades, conservación o procedimiento de privacidad.

**Evidencia:** `index.html`, `app.js`, `institution-master-v46.js` de producción.

**Resultado:** **NO PASA**.

**Clasificación:** **PARCIALMENTE FUNCIONAL** para borrado local técnico; **INEXISTENTE** como gobernanza de privacidad.

**Severidad:** **S2 ALTO**.

## Causa raíz

El producto evolucionó desde un prototipo local-first hacia una Ficha Maestra con datos reales, pero la capa de gobernanza de privacidad todavía no acompaña ese crecimiento. La ausencia no es un fallo de renderizado: faltan definición funcional, contenido jurídico validado y flujo de derechos/incidentes.

## Acción correctiva

1. Inventariar todos los datos tratados, finalidad, origen, ubicación, conservación y flujo de eliminación.
2. Aplicar minimización: no pedir ni conservar datos que el flujo V1.0 no necesita.
3. Definir responsable/titular del tratamiento y revisar jurídicamente obligaciones aplicables a la arquitectura final.
4. Publicar Política de Privacidad y Términos de Uso accesibles antes de ingresar datos personales.
5. Implementar canal/procedimiento verificable para ejercicio de derechos y eliminación cuando corresponda.
6. Definir conservación, respuesta a incidentes, backup/restauración y eliminación en backend cuando exista.
7. Repetir pruebas en usuario nuevo, usuario existente, móvil y arquitectura multiusuario antes de cerrar el gate V5.

## Corrección aplicada en esta ronda

**Ninguna corrección funcional.** No es seguro redactar ni publicar unilateralmente textos legales o diseñar obligaciones definitivas sin conocer el responsable del tratamiento, arquitectura final, finalidades y revisión jurídica correspondiente. Se documenta el gap y permanece pendiente.

## Riesgo de regresión

Alto si se implementa autenticación/backend sin cerrar primero el inventario y ciclo de vida de los datos. Una futura migración desde `localStorage` a una base multiusuario puede ampliar el alcance de privacidad, aislamiento, retención, backups y derechos.

## Impacto en indicadores

- **IUD:** sin cálculo definitivo; transparencia insuficiente puede afectar confianza y comprensión.
- **ICGD:** afectación por falta de gobernanza y ciclo de vida explícito de datos.
- **IFR:** sin cálculo definitivo.
- **ISU:** sin cálculo definitivo; falta evidencia de seguridad/privacidad real.
- **Prelaunch:** **NO PASA** en el componente de privacidad de V5 hasta implementar y verificar las medidas requeridas.

## Pendientes que no se simulan

- revisión jurídica específica de aplicabilidad;
- auditoría OWASP ASVS real;
- aislamiento multiusuario;
- ejercicio de derechos real;
- eliminación en backend y backups;
- respuesta a incidentes;
- pruebas con usuarios reales.
