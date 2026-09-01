# AUD-DIR-UX-047 — Mensajes de funciones Director en desarrollo

## Especificaciones aplicadas
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

## Prueba
**ID:** AUD-DIR-UX-047  
**Módulo:** Espacio Director / UX / V4  
**Entrada:** Abrir el Espacio Director y pulsar una acción prototipo que todavía no tiene flujo real.  
**Esperado:** La app no debe simular una función terminada y debe comunicar la indisponibilidad con lenguaje breve, sencillo y orientado al usuario.  
**Obtenido antes:** La defensa técnica bloqueaba correctamente la acción, pero mostraba textos largos y técnicos como “Módulo Director”, “flujo real y verificable”, “prototipos visibles” y explicaciones de generación/guardado/modificación que aumentaban carga cognitiva.  
**Evidencia:** `director-prototype-guard-v40.js` antes del commit `f2c619014c82bd74074973c82368ef0afa41c12d`.  
**Resultado inicial:** NO PASA  
**Severidad:** S3  
**Clasificación:** PARCIALMENTE FUNCIONAL  
**Causa raíz:** Una guarda de integridad correcta se expresó con lenguaje de QA/desarrollo en la superficie del usuario.  
**Acción correctiva:** Mantener el bloqueo y sustituir los mensajes por “Esta opción aún está en desarrollo.” y una nota breve “En desarrollo: algunas opciones todavía no están disponibles.”  
**Corrección:** commit `f2c619014c82bd74074973c82368ef0afa41c12d`.  
**Evidencia posterior:** producción sirve `director-prototype-guard-v40.js` con lógica v41 y HTTP 200; raíz de producción HTTP 200. Deployment `dpl_4LrDXCSXn4JFByV5buCjYy4QNMXK` en estado `READY`, target `production`, asociado al commit correctivo.  
**Resultado posterior:** PASA la defensa de simplicidad verificable; el módulo Director global continúa PARCIALMENTE FUNCIONAL porque sus flujos reales, persistencia, seguridad, actos administrativos y pruebas de usuario siguen sujetos a V5.  
**Riesgo de regresión:** Bajo. Solo cambia copy de UI y el identificador interno de la guarda; no habilita funciones ni modifica documentos.  
**Impacto:** Mejora cualitativa en IUD/ISU y reducción de carga cognitiva. No se calcula puntaje definitivo. IFR/ICGD/Prelaunch no cambian de estado de gate.

## Normativa
Esta corrección no introduce ni declara vigente ninguna norma MINEDU. No requiere afirmación normativa nueva.

## Gate V5
Permanecen pendientes, entre otros: autenticación/autorización real, aislamiento multiusuario, backend seguro, OWASP ASVS, backup y restore real, IA semántica real, exportación Word/PDF física, dispositivos reales, 100 generaciones, año escolar completo, concurrencia y pilotos.
