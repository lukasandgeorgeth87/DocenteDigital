# AUD-EVAL-SURFACE-049 — Veracidad de la superficie de Evaluación

## Especificaciones aplicadas

- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

## Prueba

**ID:** AUD-EVAL-SURFACE-049  
**Módulo:** Evaluación / Inicio / veracidad funcional  
**Entrada:** abrir Inicio y Evaluación en una instalación donde el registro, las evidencias persistentes y las conclusiones SIAGIE aún no están conectadas de extremo a extremo.  
**Esperado:** la app debe mostrar con lenguaje breve que el módulo está en desarrollo; no debe aparentar que ya registra valoraciones o genera conclusiones SIAGIE reales.  
**Obtenido antes:** `index.html` mostraba en Inicio “Registro, evaluación y conclusiones SIAGIE” y en la pantalla Evaluación “Registro, evaluación de unidad/proyecto y conclusiones descriptivas para SIAGIE”. La guardia existente bloqueaba las salidas simuladas y marcaba botones como “en desarrollo”, pero la superficie principal seguía prometiendo capacidades todavía no demostradas.  
**Evidencia:** `index.html` y `prototype-data-guard-v41.js` antes de v44.  
**Resultado inicial:** **NO PASA**.  
**Severidad:** **S2 ALTO** por riesgo de expectativa funcional incorrecta en una función V1.0 esencial de V5.  
**Clasificación:** **PARCIALMENTE FUNCIONAL**; registro/evaluación/conclusiones de extremo a extremo continúan no demostrados.

## Causa raíz

La protección de datos prototipo se concentraba en impedir resultados falsos después del clic, pero no corregía los textos de descubrimiento del módulo en Inicio y en la cabecera de Evaluación. Se producía una contradicción entre la veracidad interna del guard y la promesa visible de la interfaz.

## Corrección

Se actualizó `prototype-data-guard-v41.js` a lógica interna v44 para:

1. mantener intactos los bloqueos que impiden niveles, conclusiones o registros simulados;
2. cambiar la descripción de Evaluación a “Estas opciones aún están en desarrollo. No registran valoraciones ni generan conclusiones SIAGIE reales todavía.”;
3. cambiar la tarjeta de Inicio a “Módulo en desarrollo: registro y conclusiones aún no están conectados a evidencias reales.”;
4. conservar los botones marcados como “en desarrollo”.

Cambio pequeño, reversible y solo de superficie/verdad funcional. No se añadió lógica curricular, datos, normativa, backend ni resultados simulados.

## Retest

- Commit funcional: `a4b32e4010c9daa9ae738af90dd1ee6bd949cc2e`.
- Vercel deployment: `dpl_Au19m1NR7yqKXsfHGydmamcjBub5`.
- Estado: **production · READY**.
- `https://docente-digital.vercel.app/`: **HTTP 200**.
- `https://docente-digital.vercel.app/prototype-data-guard-v41.js`: **HTTP 200** y sirve la lógica v44.

**Resultado posterior:** **PASA la defensa de veracidad de superficie**. El módulo Evaluación completo permanece **PARCIALMENTE FUNCIONAL / PENDIENTE V5** hasta demostrar estudiantes, criterios, evidencias, valoraciones, persistencia, edición, exportación, recuperación y pruebas reales de extremo a extremo.

## Normativa

Esta corrección no aplica ni declara vigente una norma MINEDU específica. No se modificó contenido curricular o administrativo normativo.

## Riesgo de regresión

**Bajo.** El cambio modifica únicamente textos visibles y reutiliza la guardia ya cargada. Debe revalidarse cuando exista Evaluación real para retirar el aviso solo después de las pruebas V5 correspondientes.

## Impacto en indicadores

- **IUD:** mejora cualitativa de claridad; sin puntuación definitiva.
- **ICGD:** sin puntuación definitiva; reduce una promesa funcional engañosa.
- **IFR:** mejora local de veracidad funcional; no se calcula globalmente.
- **ISU:** mejora cualitativa de comprensión; no se calcula sin usuarios reales.
- **Prelaunch:** no cambia el gate global; Evaluación real sigue pendiente y los bloqueantes V5 permanecen abiertos.
