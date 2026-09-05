# AUD-PRIVACY-GOVERNANCE-163 — Privacidad y gobierno de datos no tienen superficie funcional

## Estado

- **Módulo:** Seguridad / Privacidad / Prelaunch V5
- **Clasificación:** INEXISTENTE
- **Severidad:** S1 CRÍTICO para Prelaunch V5
- **Resultado:** NO PASA

## Especificaciones aplicadas

Esta prueba se sustenta exclusivamente en las especificaciones internas obligatorias del proyecto, especialmente `AUDITORIA_PRELANZAMIENTO_V5.md` y `ADENDA_AUDITORIA_EJECUTABLE_V3.md`. No se declara en este hallazgo cumplimiento ni vigencia de una norma externa específica.

V5 exige antes del lanzamiento revisar seguridad y privacidad y disponer, cuando corresponda, de Política de Privacidad, Términos de Uso, ejercicio de derechos y eliminación de cuenta/datos. V3 exige aislamiento, papelera/recuperación y pruebas reales de seguridad.

## ID de prueba

`AUD-PRIVACY-GOVERNANCE-163`

## Entrada

1. Abrir la aplicación desde cero.
2. Configurar datos de IE/perfil y generar información persistente.
3. Buscar desde Inicio, Configuración y navegación principal una acción para:
   - consultar Política de Privacidad;
   - consultar Términos de Uso;
   - saber qué datos conserva DocenteDigital;
   - solicitar/eliminar datos;
   - cerrar sesión o desvincular identidad cuando exista autenticación;
   - conocer el canal de ejercicio de derechos o respuesta a incidentes.
4. Revisar el repositorio buscando superficies o archivos productivos relacionados con privacidad, términos o eliminación de datos.

## Resultado esperado

Antes de V1.0 debe existir una experiencia clara y accesible que permita al usuario conocer el tratamiento básico de sus datos y ejecutar o solicitar las acciones que correspondan. Estas capacidades no deben quedar únicamente como texto de auditoría interno.

## Resultado obtenido

- La aplicación productiva almacena estado persistente del usuario en navegador mediante `localStorage`.
- La navegación productiva expone Inicio, Planificación, Sesión, Materiales, Evaluación, Director y Configuración.
- No existe en esa superficie visible enlace o acción a Política de Privacidad, Términos de Uso, gestión/eliminación de datos o canal de derechos.
- La búsqueda del repositorio por términos relacionados con privacidad/términos no devuelve implementación productiva.
- No existe autenticación productiva demostrada, por lo que eliminación de cuenta no es todavía ejecutable; aun así, la gestión de los datos ya persistidos tampoco tiene superficie propia.

## Evidencia técnica

- `app.js` carga y guarda el estado bajo una clave de `localStorage` (`docenteDigitalPrototype`).
- `index.html` no incluye accesos de privacidad/términos en la navegación principal auditada.
- Búsqueda de código para términos de privacidad/términos: sin resultados productivos.

## Causa raíz

La persistencia y las funciones pedagógicas se implementaron antes de crear una capa explícita de gobierno de datos y confianza del usuario. El sistema ya conserva información, pero no dispone de una superficie equivalente para explicar, controlar o eliminar esa información.

## Riesgo

- Falta de transparencia para el usuario.
- Imposibilidad de ejercer control desde la propia aplicación sobre datos persistidos.
- Bloqueo del gate de seguridad/privacidad V5.
- Riesgo de regresión alto cuando se incorpore backend/autenticación si el gobierno de datos se añade tardíamente.

## Acción correctiva

No simular cumplimiento con un modal genérico.

Implementar antes del lanzamiento:

1. Centro de Privacidad accesible desde Configuración y pie/navegación secundaria.
2. Política de Privacidad y Términos versionados y fechados, redactados/revisados con sustento jurídico vigente antes de publicación.
3. Vista simple de qué datos se guardan y dónde, según la arquitectura real.
4. Acción segura de eliminar datos locales y, cuando exista backend, solicitud/eliminación de cuenta y datos conforme corresponda.
5. Confirmación reforzada para borrado definitivo y separación respecto de Papelera documental.
6. Registro de versión aceptada cuando exista autenticación y sea jurídicamente/operativamente pertinente.
7. Canal de contacto/incidentes y procedimiento de ejercicio de derechos cuando aplique.
8. Pruebas de que borrar datos realmente los elimina del almacenamiento correspondiente sin afectar a otros usuarios/IE.

## Repruebas obligatorias

- Usuario nuevo encuentra Privacidad/Términos sin manual.
- Datos locales pueden eliminarse de forma controlada.
- Tras recarga no reaparecen datos eliminados.
- Cuando exista backend: Usuario A no puede borrar ni consultar datos de Usuario B.
- Históricos institucionales sujetos a conservación no deben eliminarse de manera destructiva sin política definida.
- Móvil físico y escritorio.
- Verificación jurídica contra fuentes oficiales vigentes antes de declarar cumplimiento normativo.

## Impacto en indicadores

- **IUD:** pendiente; no calcular valor definitivo.
- **ICGD:** afectado por falta de gobierno/trazabilidad de datos.
- **IFR:** afectado por ausencia de control y recuperación/borrado verificable.
- **ISU:** afectado porque el usuario no puede localizar controles de privacidad.
- **Prelaunch:** BLOQUEADO mientras la exigencia V5 de privacidad no tenga implementación y prueba real.

## Decisión de lanzamiento

**NO APROBADO.** Este hallazgo no puede cerrarse solo creando documentos legales; requiere implementación funcional acorde con la arquitectura real y pruebas posteriores.