# AUD-REPAIR-DESTRUCTIVE-166 — Reparación pública borra el estado principal sin confirmación reforzada

## Alcance
Auditoría V2 + V3 + V4 + V5 + Núcleo IA. Hallazgo técnico/UX; no se declara vigencia de norma externa nueva.

## ID de prueba
AUD-REPAIR-DESTRUCTIVE-166

## Módulo
Persistencia / recuperación / seguridad de borrado / ruta `/reparar.html`.

## Entrada
1. Tener información persistida en `localStorage['docenteDigitalPrototype']`.
2. Abrir directamente `https://docente-digital.vercel.app/reparar.html`.
3. Pulsar una vez `Reparar y abrir DocenteDigital`.

## Resultado esperado
Una acción que elimina el estado principal debe cumplir al menos:
- advertencia inequívoca sobre qué se eliminará;
- confirmación explícita antes de ejecutar la limpieza;
- recuperación comprensible y verificable;
- no convertir una herramienta técnica de soporte en una acción destructiva accidental.

V4 exige borrado seguro mediante confirmación + papelera + recuperación. V5 exige probar persistencia, recuperación y no perder información; V3 exige que acciones críticas sean trazables y no se consideren seguras solo porque exista un respaldo.

## Resultado obtenido
La ruta pública `/reparar.html` está desplegada en producción y devuelve HTTP 200. Su botón principal ejecuta directamente, en el primer clic:

```js
var k='docenteDigitalPrototype',
    b='docenteDigitalPrototype_reset_backup',
    v=localStorage.getItem(k);
if(v) localStorage.setItem(b, JSON.stringify({savedAt:new Date().toISOString(),data:v}));
localStorage.removeItem(k);
```

No existe un segundo paso de confirmación antes de `localStorage.removeItem(k)`. La página sí crea primero una copia local cuando existe estado, por lo que no corresponde afirmar pérdida irreversible demostrada.

La copia queda además en el mismo `localStorage`/perfil de navegador, por lo que no equivale a backup independiente; este límite ya está cubierto por AUD-BACKUP-RESTORE-164.

## Evidencia
- Repositorio: `reparar.html` contiene el handler anterior y no contiene `confirm(...)`, diálogo equivalente ni segundo paso antes de eliminar la clave principal.
- Producción comprobada el 2026-09-05: `https://docente-digital.vercel.app/reparar.html` respondió HTTP 200 y sirvió la misma lógica.
- El endpoint está públicamente accesible como archivo estático; no existe autenticación productiva que limite su uso.

## PASA / NO PASA
**NO PASA**

## Clasificación funcional
**PARCIALMENTE FUNCIONAL**

La recuperación defensiva existe, pero la acción destructiva no tiene confirmación reforzada y puede ejecutarse accidentalmente con un toque/clic.

## Severidad
**S2 ALTO**

No se eleva a S0 porque esta prueba no demostró pérdida irreversible: antes del borrado se intenta crear una copia local. Tampoco se eleva automáticamente a S1 porque el estado puede restaurarse mientras permanezca la copia y el perfil local. Si una prueba real demuestra que la restauración falla o que el backup no queda accesible después de este flujo, reclasificar.

## Causa raíz
`reparar.html` fue diseñado como herramienta técnica de recuperación rápida y priorizó salir de un estado bloqueante, pero quedó desplegado como superficie productiva pública y su CTA principal realiza la limpieza en el primer clic.

## Acción correctiva recomendada
Cambio pequeño y reversible:
1. Mantener la creación previa del backup.
2. Añadir una confirmación explícita que explique: `Se limpiará la configuración y el trabajo local de este navegador. Se creará una copia recuperable antes de continuar.`
3. Separar acciones visualmente: `Volver sin cambios` como opción segura y `Reparar` como acción de riesgo.
4. Tras reparar, mostrar de forma visible cómo restaurar la copia; no depender de que el usuario conozca la existencia de la guardia interna.
5. Probar doble clic/tap rápido para impedir ejecuciones repetidas o sobrescritura innecesaria del backup.
6. Reprobar en móvil físico antes de cerrar V5.

## Repruebas obligatorias
- Estado vacío → reparar no debe crear falsa recuperación.
- Estado válido → backup se crea antes del borrado.
- Cancelar confirmación → estado permanece idéntico.
- Confirmar → estado principal se limpia y backup permanece.
- Restaurar → unidades, configuración y sesión previa reaparecen sin pérdida.
- Doble clic/tap → una sola operación lógica.
- Navegador cerrado después de limpiar pero antes de restaurar → copia sigue disponible.
- Dispositivo/perfil distinto → dejar PENDIENTE hasta existir backup independiente; no simular recuperación.

## Riesgo de regresión
Bajo si se agrega únicamente una guardia de confirmación y bloqueo de doble clic, sin alterar formato del backup ni claves existentes. Alto si se modifica el esquema de almacenamiento sin migración.

## Impacto en indicadores/gate
- IUD/ISU: impacto negativo por riesgo de acción accidental y recuperación poco explícita.
- IFR: impacto negativo moderado por fragilidad operacional del flujo de reparación.
- ICGD: sin cambio directo.
- Prelaunch V5: permanece abierto como evidencia de recuperación/borrado aún no completamente segura.

## Estado de lanzamiento
Este hallazgo no cambia la conclusión acumulada: **DocenteDigital NO está aprobada para lanzamiento V1.0** mientras existan S0/S1 abiertos y pruebas reales esenciales pendientes.
