# AUD-MOBILE-DIRECTOR-NAV-ABSENT-220

## Estado vigente — rectificación 2026-09-11
- Módulo: navegación móvil / Carpeta Director / Configuración.
- Resultado histórico: NO PASA — S1 CRÍTICO.
- Resultado vigente a nivel de código e integración declarada: **CORREGIDO TÉCNICAMENTE / PENDIENTE DE VALIDACIÓN E2E Y FÍSICA**.
- Severidad vigente por la causa específica “no existe ruta móvil a Director/Configuración”: **sin severidad abierta por defecto demostrado**.
- Gate V5 global: **BLOQUEADO** por pruebas físicas y demás bloqueantes independientes.

## Especificaciones aplicadas
Se aplican conjuntamente AUDITORIA_MAESTRA_INTEGRAL_V2, ADENDA_AUDITORIA_EJECUTABLE_V3, AUDITORIA_SIMPLICIDAD_USO_V4, AUDITORIA_PRELANZAMIENTO_V5 y NUCLEO_IA_DOCENTEDIGITAL.

V4 exige navegación móvil simple y funciones principales utilizables con el pulgar. V5 exige prueba física en celular económico, gama media y tablet, además del recorrido Director extremo a extremo. V3 exige distinguir presencia de código, integración, ejecución y comportamiento real.

## Hallazgo histórico
La auditoría original observó correctamente que el HTML base contiene una `.mobile-nav` con cinco destinos —Inicio, Plan, Sesión, Materiales y Evaluación— y que `styles.css` oculta `.sidebar` a `max-width:850px`. A partir de esa evidencia estática se concluyó que Director y Configuración quedaban inaccesibles.

Esa conclusión quedó incompleta porque no siguió el grafo de carga transitivo incorporado posteriormente.

## Evidencia correctiva actual
### 1. Guarda móvil implementada
`mobile-navigation-guard-v60.js` monta dinámicamente un sexto acceso **☰ Más** dentro de `.mobile-nav` y crea un menú con:

- `🏫 Director` → `data-dd-go="director"`;
- `⚙️ Configuración` → `data-dd-go="settings"`.

El manejador invoca `window.go(target)` y el menú incluye `aria-haspopup`, `aria-expanded`, roles de menú, cierre por clic exterior y tecla Escape. En ancho <=850 px también ajusta la barra móvil a seis columnas.

### 2. Integración transitiva
`index.html` carga `schedule-prompt-v6.js`. Ese archivo contiene `__ddStableModuleLoaderV49` y su lista de módulos incluye expresamente `mobile-navigation-guard-v60.js`. El loader crea los `<script>` de forma secuencial, espera `onload`, reintenta una vez en error y muestra una alerta visible si un módulo requerido no carga.

### 3. Producción verificada
En la revisión del 2026-09-11:

- `https://docente-digital.vercel.app/` respondió HTTP 200;
- `/schedule-prompt-v6.js` respondió HTTP 200 y contiene el loader con `mobile-navigation-guard-v60.js`;
- `/mobile-navigation-guard-v60.js` respondió HTTP 200 y contiene el botón Más y las rutas Director/Configuración;
- el deployment productivo asociado a `main` estaba en estado READY;
- no se encontraron errores runtime en la última hora.

Estas evidencias demuestran **asset + wiring productivo declarado**, no sustituyen una prueba interactiva real.

## Reprueba AUD-MOV-DIR-220-A
**Entrada:** viewport <=850 px, perfil configurado, intentar acceder a Director mediante la interfaz móvil.

**Resultado esperado:** una ruta visible y táctil hacia Director.

**Resultado obtenido verificable en esta ronda:** el runtime desplegado contiene una guarda transitivamente cargada que añade `Más → Director` y llama a `go('director')`.

**PASA/NO PASA:** **PASA a nivel de implementación e integración declarada. Validación E2E/física: PENDIENTE.**

**Clasificación:** FUNCIONAL a nivel de wiring; funcionalidad móvil real no se declara demostrada todavía.

## Reprueba AUD-MOV-SET-220-B
**Entrada:** viewport <=850 px, intentar volver a Configuración.

**Resultado esperado:** ruta visible y simple.

**Resultado obtenido verificable:** la misma guarda añade `Más → Configuración` y llama a `go('settings')`.

**PASA/NO PASA:** **PASA a nivel de implementación e integración declarada. Validación E2E/física: PENDIENTE.**

## Causa raíz histórica
La navegación base reemplazaba la barra lateral por cinco accesos docentes. La corrección adoptó la estrategia recomendada por V4: mantener accesos frecuentes y trasladar destinos secundarios a un menú `Más`, en lugar de comprimir todos los destinos en la barra inferior.

## Acción pendiente
No modificar más código sin prueba interactiva. La siguiente evidencia requerida es:

1. navegador real a 320, 360, 375, 390, 412, 768 y 850 px;
2. comprobar aparición de `Más` después de completar/cargar la app;
3. abrir/cerrar el menú por toque y teclado;
4. entrar a Director y Configuración y volver sin quedar atrapado;
5. verificar tamaño táctil, clipping, superposición y foco;
6. probar en celular económico, gama media y tablet;
7. probar con director principiante y medir la localización de funciones frecuentes.

Si cualquiera de estas pruebas falla, reabrir el defecto con la severidad sustentada por evidencia real.

## Riesgo de regresión
Medio. La solución depende de carga dinámica y puede verse afectada por fallo del loader, orden de módulos, CSS responsive, superposición del menú o cambios futuros de navegación.

## Impacto en indicadores
- ISU/IUD/ICGD: **no mejorar puntuaciones definitivas** hasta pruebas de usuario/dispositivo.
- IFR: no calcular definitivo.
- Prelaunch: continúa BLOQUEADO por pruebas reales esenciales y otros hallazgos abiertos.

## Normativa externa
Este hallazgo es de UX/funcionalidad y no requiere declarar vigencia de una norma MINEDU/UGEL. No se atribuye ninguna vigencia normativa externa en esta rectificación.

## Conclusión
El S1 histórico por **ausencia técnica de una ruta móvil a Director/Configuración** ya no está sustentado por el código y wiring desplegados actuales. Se retira esa severidad específica y se conserva la obligación V5 de demostrar el comportamiento en navegador y dispositivos físicos antes del lanzamiento.
