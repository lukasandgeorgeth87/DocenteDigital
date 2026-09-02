# AUD-CI-PRELAUNCH-080 — Puerta automática mínima de prepublicación

## Especificaciones aplicadas

- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

## Prueba

**ID:** AUD-CI-PRELAUNCH-080  
**Módulo:** Entrega / CI / prelaunch gate  
**Entrada:** inspección del repositorio para localizar automatizaciones de prueba antes de publicar.  
**Resultado esperado:** existir una puerta automatizada mínima que detecte fallos técnicos básicos antes de una publicación, sin presentar esa puerta como sustituto de las pruebas V5 reales.  
**Resultado obtenido inicial:** no existía `.github/workflows`; no había una automatización versionada de pruebas previas a publicación.  
**Estado inicial:** NO PASA.  
**Clasificación:** INEXISTENTE.  
**Severidad:** S2 ALTO.  
**Causa raíz:** el repositorio dependía del despliegue por commit sin una comprobación automatizada versionada de sintaxis/archivos críticos previa en GitHub Actions.  

## Corrección segura aplicada

Se añadió `.github/workflows/prelaunch-smoke.yml` con alcance deliberadamente limitado:

1. verificar que existan las cinco especificaciones obligatorias de auditoría;
2. ejecutar `node --check` sobre los JavaScript de raíz;
3. rechazar marcadores de conflicto Git sin resolver;
4. comprobar la existencia de archivos críticos de entrada, persistencia, configuración, seguridad curricular y exportación DOCX;
5. declarar expresamente que este smoke test NO valida dispositivos físicos, Word/PDF reales, usuarios reales, backend, OWASP ASVS, restore real, IA semántica, concurrencia ni pilotos.

**Commit funcional:** `ca08d39e80d4bcfd61f3cc25a9e5814c8125283d`.

## Retest

- El workflow existe en la rama principal y es legible desde GitHub.
- La creación del commit disparó un nuevo deployment Vercel asociado al mismo SHA.
- Deployment: `dpl_HQHLTZFemF2EbTYxW5M1v5T2DMJH`.
- Estado Vercel: `READY`.
- Target: `production`.
- Producción `https://docente-digital.vercel.app/`: HTTP 200 después de la corrección.
- En la consulta inmediata a GitHub Actions todavía no aparecía una ejecución (`workflow_runs: []`), por lo que NO se declara probado el funcionamiento efectivo del runner. Debe mantenerse PENDIENTE hasta observar una ejecución real exitosa.

## Estado posterior

**PARCIALMENTE FUNCIONAL / PENDIENTE DE EJECUCIÓN REAL DEL WORKFLOW.**

La ausencia total del gate quedó corregida a nivel de configuración versionada, pero V5 sigue NO CUMPLIDA como puerta de publicación completa porque faltan pruebas automáticas y reales de Docente, Director, multigrado, Unidad, Proyecto, Sesión, Evaluación, Registro, Oficio, RD, Informe, guardado, buscador, Word/PDF, móvil, seguridad, IA y normativa.

## Riesgo de regresión

Medio. El workflow puede existir y aun así no ejecutarse si GitHub Actions está deshabilitado, restringido o falla por configuración del repositorio. Además, Vercel actualmente puede desplegar un commit sin esperar este workflow; por tanto, no se considera todavía un gate bloqueante real del deployment.

## Impacto en indicadores

- **IUD:** sin puntuación definitiva; mejora la disciplina técnica de cambios.
- **ICGD:** sin puntuación definitiva; sin impacto directo suficiente.
- **IFR:** mejora parcial de prevención de regresiones técnicas, sin valor definitivo.
- **ISU:** sin puntuación definitiva; no valida usuarios reales.
- **Prelaunch:** mejora parcial, pero permanece NO APROBADO por ausencia de evidencia de ejecución del workflow y por los demás bloqueantes V5.

## Bloqueantes V5 que permanecen abiertos

IA semántica real; Ficha Maestra completa y procedencia; Programación; Materiales; Evaluación/Registro; Director E2E; autenticación/aislamiento/backend; seguridad OWASP ASVS; privacidad; backup/restore real; Word/PDF/impresión físicos; móvil físico; 100 generaciones; año completo; concurrencia; costo/monitoreo IA; separación efectiva dev/test/prod cuando corresponda; rollback probado; pilotos 5–10, 30–50 y 100–300.
