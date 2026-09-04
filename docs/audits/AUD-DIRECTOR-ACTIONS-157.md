# AUD-DIRECTOR-ACTIONS-157 — Acciones principales de Director inertes

## Alcance
Auditoría V2 + V3 + V4 + V5 + Núcleo IA sobre la Carpeta Director del runtime productivo.

## ID de prueba
AUD-DIRECTOR-ACTIONS-157

## Módulo
Carpeta Director / navegación funcional / E2E Director

## Entrada
1. Completar la configuración inicial.
2. Abrir `Espacio del Director` desde escritorio.
3. Accionar sucesivamente `Continuar`, `Crear`, `Abrir` y `Preguntar`.

## Resultado esperado
Cada acción principal debe iniciar un flujo real y trazable:
- `Continuar`: recuperar un pendiente real del Director.
- `Crear documento`: abrir flujo de documentación directiva con datos institucionales heredados.
- `DG y Planes`: abrir los instrumentos/planes aplicables y su estado.
- `Asistente del Director`: iniciar asistencia contextual sin inventar datos ni actos administrativos.

V5 exige poder probar el recorrido Director extremo a extremo: Perfil IE → Diagnóstico → Gestión → PAT → Documentación → Evidencias → Informes → Archivo → Seguimiento. V3 exige demostrar funcionalidad real, no aprobar una función por aparecer en pantalla.

## Resultado obtenido
En `index.html`, las cuatro acciones del bloque `#director` están declaradas como botones sin `onclick`, sin `form`, sin enlace y sin identificador funcional asociado:

```html
<button class="btn">Continuar</button>
<button class="btn alt">Crear</button>
<button class="btn alt">Abrir</button>
<button class="btn amber">Preguntar</button>
```

El `app.js` base tampoco define una ruta Director específica que sea invocada por esos botones. La producción servida en `https://docente-digital.vercel.app/` contiene el mismo bloque HTML.

## Evidencia
- `index.html`, sección `id="director"`.
- Producción HTTP 200 con el mismo HTML.
- Deployment de producción vigente al momento de la prueba: `dpl_AdqUPsYP1vT1r9fDpvz9iS2A9TGW`, estado READY, commit `99a687450bdb403be8757e036b1e60ffadb5d1c6`.

## PASA / NO PASA
**NO PASA**

## Clasificación
**SIMULADA / ROTA como superficie funcional del Director.**

## Severidad
**S1 — crítico para Prelaunch V5.**

No se clasifica S0 porque no produce por sí mismo pérdida o filtración demostrada de datos; sí bloquea una función esencial y el E2E Director obligatorio.

## Causa raíz
La interfaz del Director fue expuesta antes de conectar sus acciones a un modelo persistente de gestión directiva. La pantalla comunica disponibilidad funcional, pero los controles principales son elementos visuales inertes.

## Acción correctiva
No conectar los botones a `alert()` ni a texto prefijado. Implementar progresivamente rutas reales y persistentes para:
1. pendientes/continuidad;
2. documentos directivos;
3. DG/planes y seguimiento;
4. asistente contextual con guardas de datos oficiales y actos administrativos.

Mientras esas funciones no existan, la alternativa segura es marcar explícitamente la superficie como `Próximamente` o deshabilitar los botones para no simular disponibilidad.

## Repruebas obligatorias
- Acción única por pantalla y `Volver` visible.
- Continuar donde quedó tras recarga.
- Doble clic.
- Campos vacíos y datos extremos.
- Reutilización de Ficha Maestra sin repetir datos.
- Histórico emitido inmutable ante cambios maestros posteriores.
- Flujo completo Director V5.
- Móvil real después de resolver AUD-MOBILE-DIRECTOR-156.
- Autorización/roles cuando exista backend real.

## Riesgo de regresión
Medio-alto: conectar acciones de Director puede exponer funciones incompletas o datos prefijados y crear falsos positivos de disponibilidad.

## Impacto en métricas
- IUD: impacto negativo por controles sin efecto.
- ICGD: impacto negativo porque el flujo Director no puede demostrarse.
- IFR: impacto negativo por función esencial simulada.
- ISU: no calcular definitivo sin prueba de usuarios reales.
- Prelaunch: bloqueante S1; no puede declararse V1.0 lista mientras permanezca abierto.

## Fuente oficial externa
No se aplicó ni declaró vigente ninguna norma MINEDU en esta prueba. El hallazgo es técnico/funcional y se basa en las especificaciones internas V2–V5 + Núcleo IA.