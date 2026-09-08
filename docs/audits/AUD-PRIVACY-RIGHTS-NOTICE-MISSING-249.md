# AUD-PRIVACY-RIGHTS-NOTICE-MISSING-249

Fecha de auditoría: 2026-09-08

## Resumen

DocenteDigital no demuestra actualmente una Política/Aviso de Privacidad accesible en producción ni un flujo operativo para informar finalidades, tratamiento, derechos del titular o canales de ejercicio de derechos antes de incorporar datos personales reales. El hallazgo es especialmente relevante porque la propia V5 exige Política de Privacidad, Términos de Uso, ejercicio de derechos, eliminación de cuenta/datos cuando corresponda y respuesta a incidentes antes del lanzamiento.

## Especificaciones obligatorias aplicadas

- V2: exige protección estricta de datos personales en historial del estudiante y una fuente institucional reutilizable.
- V3: exige roles/permisos, aislamiento entre usuarios, papelera/eliminación definitiva, backups/restauración y que una función no sea aprobada sin demostrar protección de datos.
- V4: exige interfaz simple; cualquier aviso o gestión de derechos debe ser comprensible y no esconderse detrás de lenguaje técnico.
- V5 §11: exige cumplir normativa peruana vigente de protección de datos personales, minimización, Política de Privacidad, Términos de Uso, ejercicio de derechos, eliminación de cuenta/datos cuando corresponda y respuesta a incidentes.
- Núcleo IA: los datos seguros, inferidos y faltantes deben distinguirse y no inventarse; la decisión profesional sigue correspondiendo al usuario.

## Norma oficial verificada antes de aplicarla

Se verificó la vigencia de la Ley N.° 29733, Ley de Protección de Datos Personales, en el Archivo Digital de la Legislación del Congreso del Perú:
https://leyes.congreso.gob.pe/DetLeyNume_1p.aspx?xNorma=6&xNumero=29733&xTipoNorma=0

Se verificó asimismo el nuevo Reglamento aprobado por Decreto Supremo N.° 016-2024-JUS en publicación oficial de El Peruano alojada por el Congreso:
https://www3.congreso.gob.pe/Docs/DGP/DIDP/files/ds_016-2024-jus.pdf

La fuente oficial confirma que el reglamento regula la aplicación de la Ley N.° 29733, particularmente en entorno digital, y contempla derechos sobre datos personales, incluida la supresión/cancelación.

No se interpreta aquí una obligación jurídica particular más allá de lo que las fuentes oficiales y V5 permiten afirmar; cualquier diseño legal definitivo debe ser revisado antes de producción con datos reales.

---

## AUD-PRIV-249-A — Aviso/Política de Privacidad visible

**Módulo:** Producción / privacidad / primer ingreso

**Entrada:** abrir `https://docente-digital.vercel.app/` como usuario nuevo y buscar información de privacidad antes de guardar datos institucionales o pedagógicos.

**Resultado esperado:** acceso visible y comprensible a información de privacidad aplicable, al menos identidad/responsable cuando corresponda, finalidades, categorías de datos, tratamiento, derechos y canal de contacto/ejercicio de derechos. V5 exige expresamente Política de Privacidad antes del lanzamiento.

**Resultado obtenido:** el HTML productivo contiene navegación, configuración inicial, Perfil lingüístico, Planificación, Sesión, Materiales, Evaluación, Director y Configuración, pero no contiene enlace ni sección denominada Política de Privacidad, Aviso de Privacidad, Privacidad, Protección de datos o equivalente.

**Evidencia:** respuesta HTTP 200 del HTML productivo inspeccionado el 2026-09-08; ausencia adicional confirmada mediante búsqueda del repositorio por términos relacionados con privacidad, términos de uso y eliminación de datos.

**Estado:** NO PASA

**Clasificación:** INEXISTENTE

**Severidad:** S2 ALTO

**Causa raíz:** el prototipo funcional fue construido antes de cerrar el modelo de datos personales, autenticación/aislamiento y ciclo de derechos del titular.

**Acción correctiva:** definir primero el mapa real de datos tratados, finalidades, responsables/encargados, almacenamiento y transferencias; luego publicar un aviso/política coherente con la implementación real. No copiar una política genérica ni declarar tratamientos que todavía no existen.

---

## AUD-PRIV-249-B — Ejercicio de derechos y eliminación de datos

**Módulo:** Configuración / cuenta / privacidad

**Entrada:** usuario busca cómo acceder, rectificar, cancelar/suprimir u oponerse al tratamiento de sus datos, o eliminar datos/cuenta cuando corresponda.

**Resultado esperado:** mecanismo documentado y accesible acorde con la arquitectura real, sin confundir `Restablecer datos` local con una solicitud formal de derechos o eliminación de cuenta.

**Resultado obtenido:** producción ofrece `Restablecer datos` dentro de Configuración, pero no demuestra autenticación/cuenta productiva, canal de derechos, solicitud trazable, identificación del alcance de borrado, confirmación de eliminación del servidor, retención, ni procedimiento de atención. Por tanto, `Restablecer datos` no puede aprobarse como mecanismo de derechos del titular.

**Estado:** NO PASA

**Clasificación:** INEXISTENTE para gestión de derechos; PARCIALMENTE FUNCIONAL únicamente para borrado local del prototipo cuando efectivamente aplique.

**Severidad:** S2 ALTO, absorbida en AUD-249.

**Acción correctiva:** implementar este flujo solo cuando la arquitectura de identidad/backend y el mapa de datos estén definidos. Debe distinguir borrado local, eliminación lógica/física, backups, históricos legalmente retenidos cuando correspondan y trazabilidad de la solicitud.

---

## AUD-PRIV-249-C — Términos de Uso y respuesta a incidentes

**Resultado esperado:** V5 requiere Términos de Uso y respuesta a incidentes antes del lanzamiento.

**Resultado obtenido:** no se encontró evidencia accesible en producción ni archivos equivalentes en la búsqueda de código realizada en esta ronda.

**Estado:** NO PASA

**Clasificación:** INEXISTENTE

**Severidad:** S2 ALTO, absorbida en AUD-249.

---

## Corrección aplicada en esta ronda

No se añadió una Política de Privacidad ni Términos de Uso genéricos. Hacerlo sin conocer con certeza backend, autenticación, proveedores IA, almacenamiento, retención, transferencias y datos de estudiantes/docentes podría crear afirmaciones jurídicas falsas y una falsa sensación de cumplimiento.

El cambio seguro y reversible realizado es exclusivamente documentar el hallazgo para que permanezca en el acumulado y cierre el Gate V5 hasta su implementación y validación real.

## Evidencia posterior requerida para cerrar AUD-249

1. Mapa de datos real y minimizado.
2. Identificación de responsables/encargados y proveedores reales.
3. Política/Aviso de Privacidad publicado y accesible antes de entregar datos personales.
4. Términos de Uso publicados.
5. Canal y procedimiento de derechos probado extremo a extremo.
6. Eliminación de cuenta/datos probada cuando corresponda, incluida interacción con backups y retención.
7. Procedimiento de incidentes definido y prueba de mesa.
8. Aislamiento de usuarios/IE y autenticación productiva probados.
9. Revisión contra Ley N.° 29733 y D.S. N.° 016-2024-JUS vigente al momento de lanzamiento.
10. Revisión jurídica/privacidad final antes de trabajar con datos reales de estudiantes.

## Impacto acumulativo

- **IUD/ICGD:** sin puntaje definitivo; afecta confianza y gestión institucional.
- **IFR:** impacto indirecto por falta de protección operacional demostrada.
- **ISU:** no puntuar; una solución futura debe ser sencilla y comprensible.
- **Prelaunch:** bloquea cumplimiento de V5 §11. No convierte por sí sola una ausencia documental en una fuga demostrada; por eso se clasifica S2 y no S0. Cualquier fuga real o exposición entre usuarios seguiría siendo S0 conforme V3/V5.

## Gate

**DocenteDigital NO puede declararse lista para V1.0 mientras AUD-249 permanezca abierto**, además de los S0/S1 acumulados y las pruebas reales esenciales aún pendientes.
