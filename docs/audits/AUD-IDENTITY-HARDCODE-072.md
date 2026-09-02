# AUD-IDENTITY-HARDCODE-072

## Módulo
Ficha Maestra / identidad institucional / exportación documental.

## Clasificación inicial
- Estado: NO PASA
- Severidad: S1
- Función: PARCIALMENTE FUNCIONAL con error silencioso de identidad

## Prueba
**ID:** AUD-IDENTITY-HARDCODE-072

**Entrada:** perfil nuevo sin `teacherName` ni `schoolName`.

**Resultado esperado:** la aplicación no debe inventar ni precargar una identidad personal o institucional concreta. Debe conservar esos datos como pendientes hasta que provengan del usuario/Ficha Maestra u otra fuente autorizada.

**Resultado obtenido antes:** `format-v2.js` asignaba automáticamente `JORGE LUIS PALMA RODRIGUEZ` e `I.E. 50740 CCOTATAQUI` cuando faltaban esos campos y ejecutaba `save()`. Esos valores podían terminar en la vista previa y pie documental de un usuario distinto.

## Causa raíz
Datos de un contexto de desarrollo/piloto fueron usados como valores predeterminados globales en una superficie que se carga para todos los perfiles.

## Corrección
Commit funcional `0ec5436500559feeaf8fbc5fb2b01d7b9b5d82b6`.

`format-v2.js` v2.1 ya no crea esos valores concretos. Los perfiles nuevos parten con cadenas vacías cuando el dato no existe y los valores ya registrados se conservan para evitar alterar históricos o datos legítimos existentes. La presentación documental utiliza etiquetas genéricas (`Docente`, `Institución Educativa`) solo cuando no hay identidad registrada.

## Evidencia posterior
- Deployment de producción: `dpl_6wSHoQwuuAgZ9Mi9nSfxvfx6GCsD` → READY.
- `https://docente-digital.vercel.app/` → HTTP 200.
- `https://docente-digital.vercel.app/format-v2.js` → HTTP 200 y sirve v2.1 sin los defaults personales/institucionales hardcodeados.

## Resultado posterior
PASA para el defecto específico de creación automática de identidad concreta.

## Pendientes relacionados
La Ficha Maestra completa, procedencia de datos, autenticación/aislamiento, backend y pruebas con usuarios reales siguen pendientes. No se migraron automáticamente estados antiguos que ya contengan esos valores, porque no puede distinguirse de forma segura si son datos legítimos del usuario o restos del piloto.

## Riesgo de regresión
Medio. Debe añadirse una prueba automática que impida introducir nombres de personas, IE, UGEL, localidad o códigos concretos como defaults globales.

## Impacto
Mejora trazabilidad y confianza documental (ICGD/IFR) y reduce error silencioso. No se calcula ISU/IFR/Prelaunch Score definitivo sin evidencia real.

## Gate V5
DocenteDigital NO queda aprobada para lanzamiento V1.0 por este cambio. Persisten los demás bloqueantes V5.