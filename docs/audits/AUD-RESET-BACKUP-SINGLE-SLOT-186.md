# AUD-RESET-BACKUP-SINGLE-SLOT-186 — Restablecimientos sucesivos pueden sobrescribir una copia recuperable

## Fecha de verificación
2026-09-05

## Especificaciones aplicadas
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

No se aplica en este hallazgo una norma externa curricular o administrativa concreta; por tanto no se declara vigencia normativa externa. El criterio proviene de las especificaciones internas V3/V4/V5 sobre persistencia, recuperación, papelera/backup y prevención de pérdida de información.

## Módulo
Configuración → Restablecer datos → copia de recuperación local

## ID de prueba
`AUD-RESET-BACKUP-SINGLE-SLOT-186`

## Entrada
1. Tener un estado A con unidades/sesiones/configuración almacenadas en `docenteDigitalPrototype`.
2. Ejecutar `Restablecer datos` y aceptar.
3. No pulsar todavía `Restaurar` ni `Descartar copia` del respaldo A.
4. Crear/configurar un nuevo estado B.
5. Ejecutar nuevamente `Restablecer datos` y aceptar.
6. Intentar recuperar el estado A original.

## Resultado esperado
Mientras exista una copia recuperable pendiente, un segundo restablecimiento no debe destruirla silenciosamente. Debe existir historial/múltiples copias o, como mínimo, bloquear el nuevo restablecimiento hasta que el usuario restaure o descarte explícitamente la copia anterior.

## Resultado obtenido
`storage-recovery-v26.js` utiliza una única clave:

```js
const RESET_BACKUP_KEY='docenteDigitalPrototype_reset_backup';
```

En cada restablecimiento aceptado ejecuta:

```js
nativeSetItem.call(localStorage,RESET_BACKUP_KEY,JSON.stringify({savedAt:new Date().toISOString(),data:current}));
```

No comprueba previamente si `RESET_BACKUP_KEY` ya contiene una copia pendiente. Por tanto el segundo restablecimiento reemplaza el respaldo A por B antes de borrar el estado principal. La UI posterior solo puede ofrecer restaurar el contenido más reciente de esa clave.

## Evidencia
- `storage-recovery-v26.js`: `RESET_BACKUP_KEY`, `installRecoverableReset()` y `offerResetRestore()`.
- La implementación de restauración lee exclusivamente `localStorage.getItem(RESET_BACKUP_KEY)`; no existe colección/historial de respaldos de restablecimiento.

## PASA / NO PASA
**NO PASA**

## Clasificación funcional
**PARCIALMENTE FUNCIONAL** para un único restablecimiento pendiente.

**ROTA** para dos restablecimientos sucesivos sin resolver la copia anterior.

## Severidad
**S1 CRÍTICO — bloqueante V5**

### Justificación
V3 clasifica como crítico/bloqueante la pérdida irreversible y exige que backup/restauración sean probados, no declarados. V4 exige recuperación segura. V5 impide lanzamiento con pérdida de información o backup/restauración no comprobados. El camino es determinista: una copia que el sistema presenta como recuperable puede ser sustituida por una acción posterior antes de que el usuario ordene descartarla.

No se eleva artificialmente a S0 en este informe porque el escenario requiere dos restablecimientos explícitamente confirmados. Si una prueba de navegador demuestra pérdida irreversible de información real considerada aún recuperable, la severidad debe reevaluarse conforme a V3.

## Causa raíz
Diseño de respaldo de restablecimiento de **slot único** sin control de versión, cola/historial ni protección frente a sobrescritura.

## Acción correctiva segura recomendada
Cambio mínimo antes de V1.0:

1. Antes de escribir `RESET_BACKUP_KEY`, comprobar si ya existe una copia válida.
2. Si existe, impedir el segundo restablecimiento y mostrar: `Ya existe una copia pendiente. Restáurala o descártala antes de volver a restablecer.`
3. Mantener intacta la copia anterior.
4. Como evolución posterior, migrar a una colección versionada de copias con fecha e identificador.

No se aplicó automáticamente en esta pasada porque modificar el wrapper de recuperación sin una prueba de navegador real puede introducir regresión en un mecanismo de protección de datos. La corrección debe acompañarse de prueba ejecutable de cancelación, restauración y doble restablecimiento.

## Retest obligatorio
1. Crear estado A.
2. Restablecer A → copia A creada.
3. Crear estado B.
4. Intentar restablecer B sin resolver A.
5. Verificar que A no se sobrescribe.
6. Restaurar A y comprobar igualdad del estado recuperado.
7. Repetir después de descartar A y comprobar que B sí puede respaldarse.
8. Recargar navegador entre pasos.
9. Probar cuota llena/bloqueo de storage.
10. Confirmar producción HTTP 200 y despliegue READY.

## Riesgo de regresión
**Medio**: el código está en la capa preventiva cargada antes de `app.js`; una modificación incorrecta puede afectar arranque o restablecimiento. Por ello requiere retest funcional real.

## Impacto
- **IUD:** riesgo de pérdida de trabajo recuperable.
- **ICGD:** reduce confianza documental y continuidad.
- **IFR:** afecta recuperación/persistencia.
- **ISU:** el usuario puede creer que conserva una copia cuando ya fue sustituida.
- **Prelaunch:** bloqueante hasta demostrar recuperación segura.

No se calcula ninguna puntuación definitiva sin evidencia real de usuario/dispositivo/restauración.