# AUD-MAT-INTEGRITY-041 — Materiales / idioma / anti-alucinación

## Especificaciones aplicadas

- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

## Prueba

**ID:** AUD-MAT-INTEGRITY-041

**Módulo:** Materiales / perfil lingüístico / integridad de generación

**Entrada:** abrir Materiales, escribir un tema distinto de agua y solicitar `Lengua originaria` o `Bilingüe`.

**Resultado esperado:** usar el tema real, respetar el idioma seleccionado y no presentar texto demostrativo o traducción no validada como una generación real. Si la IA/servicio lingüístico real no existe todavía, la app debe decirlo y bloquear la fabricación de contenido.

**Resultado obtenido antes:** `generateMaterial()` ignoraba por completo el campo Tema y producía siempre contenido sobre agua. La interfaz usa los valores `Castellano`, `Lengua originaria` y `Bilingüe`, pero el código comprobaba `lang==='Quechua'`; por ello `Lengua originaria` caía en la rama `else` bilingüe y podía mostrar castellano + una frase quechua demostrativa como si fuera material generado.

**Evidencia previa:** `app.js`, función `generateMaterial()`; `index.html`, selector `#materialLanguage` y campo Tema sin `id`.

**Resultado:** NO PASA.

**Severidad:** S1 CRÍTICO.

**Clasificación previa:** SIMULADA / parcialmente rota.

**Causa raíz:** desalineación entre valores de interfaz y lógica legado, contenido fijo de demostración conectado a una acción visible como generador real y ausencia de conexión del campo Tema con la generación.

## Corrección aplicada

Se añadió `material-integrity-v65.js` y se incorporó al cargador estable de `schedule-prompt-v6.js`.

La guardia:

1. identifica y asigna `id="materialTopic"` al campo Tema existente;
2. exige un tema no vacío;
3. exige lengua/variedad cuando se solicita lengua originaria o formato bilingüe;
4. reemplaza la salida demostrativa por un mensaje explícito de estado pendiente;
5. no fabrica traducciones ni textos genéricos mientras no exista un motor de IA/servicio lingüístico validado;
6. expone `ddAuditMaterialIntegrity()` para retest técnico.

## Evidencia posterior

- Commit guardia: `c824d813ebb9f5d731bc8eec9bf536e8e26691c8`.
- Commit cargador: `fcc41d8e31816e336f065bfc8175899ed4329bfa`.
- Vercel deployment asociado a `fcc41d8e...`: `dpl_7wdMjc7idhT3z8VC5TtQEpM8fwcU`, `target=production`, `state=READY`.
- GitHub commit status para `fcc41d8e...`: `Vercel = success`.
- Producción `/`: HTTP 200.
- Producción `/schedule-prompt-v6.js`: HTTP 200 y carga `material-integrity-v65.js`.
- Producción `/material-integrity-v65.js`: HTTP 200 y sirve la guardia V65.

## Estado posterior

**PASA la defensa de integridad**, pero el módulo Materiales continúa **INEXISTENTE/PARCIALMENTE FUNCIONAL en generación real**, porque todavía no existe evidencia de IA real validada para producir materiales contextualizados ni traducción EIB segura.

## Gate V5 y pendientes

Permanece PENDIENTE: generación real; exactitud lingüística; revisión por hablantes/especialistas; prueba física en celular/tablet; Word/PDF/impresión; 100 generaciones; backend; autenticación; aislamiento; OWASP ASVS; backup/restore real; concurrencia y pilotos.

**Riesgo de regresión:** medio. Una futura implementación de IA debe sustituir explícitamente esta guardia solo cuando exista salida estructurada, validación lingüística, trazabilidad de fuente y pruebas V3/V5.

**Impacto:** reduce riesgo de error silencioso, falsa generación y contenido EIB inventado. No habilita puntuación ISU/IFR/Prelaunch definitiva.

No se introdujo ni declaró vigente ninguna norma MINEDU en esta corrección; por tanto, no se añadió afirmación normativa nueva que requiriera verificación externa.