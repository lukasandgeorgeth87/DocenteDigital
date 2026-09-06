# AUD-DIRECTOR-EASY-INTERNAL-POLICY-203

## Alcance
Auditoría V4/V5 del espacio Director, enfocada en simplicidad visible y separación entre lógica interna y superficie de usuario.

## Especificaciones aplicadas
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

No se requirió declarar vigencia de una norma MINEDU/UGEL externa para este hallazgo: deriva de las especificaciones internas de UX y prelan­zamiento.

## Prueba
**ID:** AUD-DIRECTOR-EASY-INTERNAL-POLICY-203  
**Módulo:** Carpeta Director / Modo Fácil / UX  
**Entrada:** ingresar al Espacio del Director con `state.mode = easy`.  
**Resultado esperado:** Modo Fácil debe mostrar únicamente acciones y orientación breve; políticas internas, listas de reglas y lógica de auditoría deben permanecer internas o, si aportan valor, aparecer de forma breve en Modo Experto.  
**Resultado obtenido antes:** `director-creativity-v16.js` insertaba siempre una tarjeta visible `Creatividad controlada en Gestión` con dos listas completas (`Se mantiene protegido` / `Puede variar con pertinencia`) y una regla interna del motor. La tarjeta no era `expert-only`, por lo que se exponía también en Modo Fácil.  
**Evidencia:** implementación previa de `director-creativity-v16.js`; V4 exige `MENOS TEXTO + MENOS CLICS + BOTONES CLAROS + PASOS GUIADOS`, Modo Fácil por defecto y que el análisis técnico permanezca interno.  
**PASA/NO PASA antes:** NO PASA.  
**Clasificación antes:** PARCIALMENTE FUNCIONAL. La política de seguridad existía y era válida como lógica interna, pero su presentación contradecía V4.  
**Severidad:** S3 MEDIO.  
**Causa raíz:** la política interna de creatividad del Director fue utilizada simultáneamente como estado del motor y como contenido informativo visible, sin filtrar por modo de uso.

## Corrección aplicada
Cambio pequeño y reversible en `director-creativity-v16.js`:
- conserva `ddDirectorCreativityPolicy`, `protectedItems` y `variableItems` como lógica interna;
- elimina las listas técnicas de la superficie visible;
- muestra únicamente una nota breve y accionable;
- la nota se marca `expert-only`, por lo que Modo Fácil queda limpio;
- no modifica documentos históricos, normativa, datos maestros ni flujos administrativos.

**Commit de corrección:** `618437e05844558218186da8ea61c3f4fd1b4940`.

## Retest esperado
1. Modo Fácil → Director: no debe aparecer la tarjeta técnica ni las listas internas.
2. Modo Experto → Director: puede aparecer la nota breve de revisión experta.
3. `window.ddDirectorCreativityPolicy` debe seguir disponible internamente.
4. No deben alterarse botones, datos ni documentos del Director.

## Riesgo de regresión
Bajo. El cambio afecta solo presentación de una política informativa y conserva el objeto interno utilizado por otras capas.

## Impacto en métricas/gates
- IUD/ISU: mejora cualitativa en claridad y reducción de texto; no se calcula puntuación definitiva sin usuarios reales.
- IFR/ICGD: sin cambio demostrado.
- Prelaunch V5: mejora parcial de V4, pero no desbloquea Carpeta Director productiva ni los demás bloqueantes V5.

## Estado de lanzamiento
DocenteDigital continúa **NO APROBADA PARA LANZAMIENTO V1.0**. Permanecen pendientes, entre otros, Carpeta Director E2E productiva, autenticación/aislamiento, backend/persistencia segura, restore real, pruebas físicas móviles, Word/PDF/impresión reales, 100 generaciones, año completo, OWASP ASVS, privacidad, concurrencia y pilotos reales.
