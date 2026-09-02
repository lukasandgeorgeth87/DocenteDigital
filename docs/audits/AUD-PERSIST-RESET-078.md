# AUD-PERSIST-RESET-078 — Borrado irreversible del estado local

## Estado

**NO PASA · S1 · PARCIALMENTE FUNCIONAL**

## Alcance

Persistencia / Configuración / V4 / V5.

## Especificaciones aplicadas

- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

## Prueba

**ID:** AUD-PERSIST-RESET-078

**Entrada:** usuario abre Configuración y pulsa `Restablecer prototipo`, luego confirma.

**Resultado esperado:** una acción destructiva debe ser comprensible, impedir pérdida accidental y permitir recuperación mediante papelera/restauración antes de eliminación definitiva. Los documentos históricos no deben alterarse silenciosamente.

**Resultado obtenido:** `resetDemo()` ejecuta `localStorage.removeItem('docenteDigitalPrototype')` y recarga la página. Existe una confirmación, pero no hay papelera, copia recuperable ni flujo de restauración visible. Se elimina en un solo paso el contenedor que actualmente concentra configuración, unidades, sesión reciente y demás estado del prototipo.

**Evidencia de código:** `app.js`: `function resetDemo(){if(confirm('¿Restablecer la configuración y los datos del prototipo?')){localStorage.removeItem('docenteDigitalPrototype');location.reload()}}`.

**PASA/NO PASA:** NO PASA.

**Severidad:** S1, porque puede ocasionar pérdida completa del trabajo local del usuario y V5 considera la pérdida de información un bloqueante de lanzamiento.

**Clasificación:** PARCIALMENTE FUNCIONAL. La eliminación funciona técnicamente, pero carece de borrado seguro y recuperación.

## Causa raíz

La aplicación conserva gran parte del prototipo en una única clave local y ofrece un restablecimiento global pensado para desarrollo/demo como si fuera una acción de usuario final. No existe todavía una capa de papelera/restauración para esa operación.

## Acción correctiva requerida

1. Retirar `Restablecer prototipo` de la superficie de usuario final o marcarlo como función de desarrollo no disponible.
2. Antes de cualquier borrado real, implementar papelera/restauración y distinguir configuración vigente de documentos históricos.
3. Exigir confirmación reforzada para borrado global.
4. Probar cierre/recarga, eliminación y restauración reales antes de cerrar V5.

No se modifica automáticamente el comportamiento en esta auditoría porque diseñar una restauración correcta exige definir persistencia y conservación de históricos; simular una papelera dentro de la misma clave que se borra produciría una falsa garantía.

## Evidencia posterior

Pendiente de corrección funcional y retest.

## Fuente oficial

No se aplicó ni declaró vigente ninguna norma educativa en esta prueba. El hallazgo deriva de las especificaciones internas V4/V5 y de evidencia directa del código.

## Riesgo de regresión

Alto si se parchea únicamente el texto del botón sin separar datos vigentes, históricos y recuperables.

## Impacto

- IUD: negativo por riesgo de pérdida documental.
- ICGD: negativo por ausencia de recuperación.
- IFR: bloqueado respecto de persistencia/recuperación.
- ISU: no puede cerrarse; borrado seguro V4 incumplido.
- Prelaunch: bloqueante abierto.

## Gate V5

**DocenteDigital NO está lista para lanzamiento V1.0.** El hallazgo permanece abierto hasta demostrar recuperación real.