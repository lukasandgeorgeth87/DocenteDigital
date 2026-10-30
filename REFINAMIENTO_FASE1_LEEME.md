# Docente Digital — refinamiento de Unidades, Proyectos y Sesiones (fase 1)

**Fecha:** 28 de octubre de 2026  
**Punto de partida:** archivo del proyecto con identificador `408c9089b16929d7ddeb5e062c3853dc9a590c56` recibido del propietario.  
**Tipo de entrega:** copia independiente para revisión, sin despliegue ni modificación de GitHub o Supabase.

## Qué se corrigió

1. **Continuidad Unidad/Proyecto → Sesión.** Al generar una sesión se copian el nivel, la modalidad institucional, los grados, la lengua y la variante lingüística de la Unidad/Proyecto guardado. No se toman silenciosamente de la configuración global si esta cambió.
2. **Nivel curricular correcto.** La competencia se busca con el nivel de la Unidad/Proyecto de origen, y los datos del taller de Inicial (denominación y duración) respetan ese nivel.
3. **Identidad histórica.** Una Unidad/Proyecto nueva captura la IE y el docente al crearse; una sesión derivada hereda esos datos, y la exportación Word utiliza la identidad registrada en el documento.
4. **Documentos antiguos sin identidad verificable.** Los registros que no guardaban esa información muestran una advertencia antes de la emisión; no se les asigna automáticamente la IE o el docente actual.
5. **Sesiones guardadas estables.** La vista previa de una sesión ya enriquecida no reemplaza su título de actividad, propósito ni criterio con los de otra Unidad/Proyecto actualmente seleccionada.

## Archivos modificados

- `app.js`
- `session-learning-core-v54.js`
- `docx-export-v29.js`
- `tests/unit-session-context-snapshot.mjs` (nueva)
- `tests/historical-document-identity.mjs` (nueva)

## Pruebas realizadas

- Validación de sintaxis (`node --check`) de los archivos JavaScript modificados y las pruebas nuevas.
- 11 pruebas offline automatizadas del proyecto, incluidas las dos regresiones nuevas: **11 aprobadas**.
- El test de exportación inspecciona el XML del archivo Word generado y verifica que la IE y el docente originales se conserven después de cambiar la configuración.

**Límite:** No se ejecutaron las pruebas visuales E2E con navegador porque Chromium no está instalado en el entorno de prueba. No se validó manualmente la experiencia real en celulares ni la apertura en Microsoft Word. Estas comprobaciones deben hacerse antes de vender el producto.

## Lo que sigue pendiente para afirmar calidad pedagógica

- Revisar productos reales de Inicial, Primaria y Secundaria, incluyendo aulas multigrado.
- Validar situaciones significativas, retos, propósito, secuencia, criterios y evidencias en el contexto que proporciona cada docente.
- Vincular y verificar la matriz curricular oficial literal, con versiones y fuentes trazables. Hasta entonces, las referencias curriculares provisionales deben verificarse con MINEDU.
- Realizar una prueba de usuario docente de principio a fin y corregir los problemas encontrados.
- Comprobar exportación DOCX y funcionamiento en computadora y celular.
- Diseñar y probar las cuentas y la suscripción mensual antes de comercializar.

## Cómo revisar esta copia

1. Descomprimir **todo** el ZIP en una carpeta propia, sin mezclarlo con otras versiones.
2. Con una herramienta de servidor web local, abrir `index.html` desde la raíz del proyecto.
3. Configurar una IE y docente de prueba, crear una Unidad/Proyecto y su sesión.
4. Cambiar la configuración a otra IE, docente y nivel, volver a abrir la sesión anterior y exportarla a Word.
5. Confirmar que conserva el contexto original y repetir el ejercicio con Inicial, Primaria y Secundaria.

Para ejecutar las dos regresiones nuevas con Node.js desde la carpeta principal:

```bash
node tests/unit-session-context-snapshot.mjs
node tests/historical-document-identity.mjs
```

> Esta fase mejora la consistencia del código, pero **no certifica** que todas las unidades, proyectos y sesiones estén pedagógicamente perfectos o listos para comercializar.
