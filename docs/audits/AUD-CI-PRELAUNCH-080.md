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
**Resultado esperado:** existir una puerta automatizada mínima que detecte fallos técnicos básicos antes de una publicación, sin presentarla como sustituto de las pruebas V5 reales.  
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
- GitHub Actions ejecutó realmente `Prelaunch Smoke` sobre el commit posterior de auditoría `3f11574a6155719cbde9b8809b9a8716bd714c55`.
- Run ID: `33609345165`.
- Estado del run: `completed`.
- Conclusión: `success`.
- El commit funcional disparó deployment Vercel `dpl_HQHLTZFemF2EbTYxW5M1v5T2DMJH`, estado `READY`, target `production`.
- El commit documental posterior disparó deployment `dpl_FBaGFL1VUsbntTwCurp8odk9E76i`, también `READY`, target `production`.
- Producción `https://docente-digital.vercel.app/`: HTTP 200 después de la corrección.

## Estado posterior

**PASA para la existencia y ejecución real del smoke gate técnico mínimo.**  
**Clasificación posterior:** FUNCIONAL para este alcance técnico limitado.

No se considera cumplida la puerta V5 completa. El workflow todavía no prueba Docente E2E, Director E2E, multigrado, generación de Unidad/Proyecto/Sesión, Evaluación, Registro, Oficio, RD, Informe, guardado real, buscador, Word/PDF físico, móvil físico, seguridad, IA semántica ni normativa dinámica.

## Riesgo de regresión

Medio. Aunque el runner ya ejecuta y pasa, Vercel sigue desplegando directamente los commits; no existe evidencia de que el deployment espere y bloquee ante un fallo de GitHub Actions. Por ello el smoke test es prevención útil, pero todavía no es un gate duro de publicación.

## Impacto en indicadores

- **IUD:** sin puntuación definitiva; mejora la disciplina técnica de cambios.
- **ICGD:** sin puntuación definitiva; sin impacto directo suficiente.
- **IFR:** mejora parcial de prevención de regresiones técnicas, sin valor definitivo.
- **ISU:** sin puntuación definitiva; no valida usuarios reales.
- **Prelaunch:** mejora parcial; permanece NO APROBADO por los demás bloqueantes V5 y porque el CI todavía no bloquea formalmente el deployment.

## Bloqueantes V5 que permanecen abiertos

IA semántica real; Ficha Maestra completa y procedencia; Programación; Materiales; Evaluación/Registro; Director E2E; autenticación/aislamiento/backend; seguridad OWASP ASVS; privacidad; backup/restore real; Word/PDF/impresión físicos; móvil físico; 100 generaciones; año completo; concurrencia; costo/monitoreo IA; separación efectiva dev/test/prod cuando corresponda; rollback probado; pilotos 5–10, 30–50 y 100–300.
