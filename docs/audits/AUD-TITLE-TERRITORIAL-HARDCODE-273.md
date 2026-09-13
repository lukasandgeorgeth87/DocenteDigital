# AUD-TITLE-TERRITORIAL-HARDCODE-273

## Hallazgo
El motor `meaning-engine-v25.js` incluía una propuesta de título para unidades con la frase fija `desde nuestra comunidad`, aunque la descripción libre no hubiera expresado comunidad ni el perfil territorial la sustentara.

Esto contradice el Núcleo IA de DocenteDigital: la interpretación debe usar el territorio real sin asumir “comunidad”, y los datos seguros/inferidos/faltantes deben mantenerse diferenciados. También puede inducir a un docente urbano o periurbano a seleccionar un título territorialmente falso.

## Prueba
**ID:** AUD-TITLE-273-A  
**Módulo:** Unidad/Proyecto → comprensión libre → títulos naturales  
**Entrada:** descripción urbana o territorialmente neutra, sin la palabra comunidad ni perfil de comunidad campesina/nativa.  
**Resultado esperado:** ninguna propuesta debe afirmar `nuestra comunidad` sin evidencia.  
**Resultado obtenido previo:** el banco dinámico de títulos incluía `${cap(main)}: saberes, preguntas y aprendizajes desde nuestra comunidad`.  
**Evidencia:** `meaning-engine-v25.js`, función `titlePool()`.  
**Estado previo:** NO PASA.  
**Clasificación:** PARCIALMENTE FUNCIONAL.  
**Severidad:** S2 ALTO.  
**Causa raíz:** frase territorial rígida dentro de una plantilla de título que se ofrece después del análisis semántico, sin condicionarla a evidencia territorial.  
**Acción correctiva:** sustituir la afirmación rígida por `desde nuestro contexto`, formulación neutral que no inventa comunidad y conserva naturalidad.

## Corrección aplicada
Commit funcional: `1ac723be52359c0617524833ffce55992077fd86` (`fix: remove hardcoded community from title suggestions`).

Cambio mínimo y reversible en `meaning-engine-v25.js`:
- antes: `saberes, preguntas y aprendizajes desde nuestra comunidad`;
- ahora: `saberes, preguntas y aprendizajes desde nuestro contexto`.

No se cambió la extracción de finalidad, problema, actores, lugar, confianza, situación significativa ni la lógica de historial de títulos.

## Reprueba
**ID:** AUD-TITLE-273-R1  
**Entrada:** inspección de `titlePool()` después de la corrección.  
**Esperado:** la plantilla ya no contiene una afirmación comunitaria fija.  
**Obtenido:** la plantilla usa `desde nuestro contexto`.  
**Estado:** PASA EN IMPLEMENTACIÓN.  
**Clasificación:** FUNCIONAL EN IMPLEMENTACIÓN / E2E REAL PENDIENTE.  
**Severidad residual:** S2 hasta prueba real con descripciones rural, urbana, periurbana, EIB y monolingüe y verificación de títulos seleccionados/exportados.

## Evidencia posterior de producción
- El commit funcional `1ac723be52359c0617524833ffce55992077fd86` fue desplegado por Vercel en producción como `dpl_54nFeiiT7XJ2W3UKMQsWDVDEgtwo` con estado `READY`.
- La URL canónica `https://docente-digital.vercel.app/` respondió HTTP 200 después de la corrección.
- `https://docente-digital.vercel.app/meaning-engine-v25.js` respondió HTTP 200 y contiene `saberes, preguntas y aprendizajes desde nuestro contexto`.
- Vercel no reportó errores runtime en la última hora consultada.
- Prelaunch Smoke #300, run `34774151643`, terminó `completed / success` sobre el commit de documentación `e60de1c092be7420f907e413a83bcaeea91b49f5`.

## Riesgo de regresión
Bajo. El cambio altera una sola cadena de presentación y no toca persistencia, currículo, generación de documentos ni datos históricos.

## Impacto en indicadores
- **IUD/ICGD:** mejora esperada por mayor pertinencia contextual; no se asigna puntaje definitivo sin evidencia de usuarios.
- **IFR/ISU/Prelaunch:** sin puntuación definitiva. La corrección elimina una inconsistencia, pero no sustituye pruebas E2E, móvil, exportación ni usuarios reales.

## Gate V5
Permanece BLOQUEADO. Esta corrección no valida por sí sola comprensión semántica completa, títulos naturales en todos los contextos, caso biohuerto, caso hormigas, 100 generaciones, móvil físico, Word/PDF/impresión, restore, seguridad, privacidad, año completo ni pilotos.
