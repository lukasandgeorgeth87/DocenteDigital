# AUD-RECENTS-FAVORITES-MISSING-260

## Resumen

- **ID:** AUD-RECENTS-FAVORITES-MISSING-260
- **Módulo:** UX / navegación / recuperación de trabajo / V4
- **Clasificación:** INEXISTENTE
- **Resultado:** NO PASA
- **Severidad:** S3 MEDIO
- **Gate V5:** no bloquea por sí solo, pero afecta simplicidad, recuperación y eficiencia de navegación; debe quedar resuelto o explícitamente acotado antes de cerrar V1.0.

## Especificación aplicable

`docs/AUDITORIA_SIMPLICIDAD_USO_V4.md` exige expresamente:

- **20. Continuar donde quedó:** ofrecer accesos a sesión, unidad, oficio u otro trabajo pendiente.
- **21. Recientes y favoritos:** mostrar documentos recientes y tareas frecuentes para reducir búsquedas.
- **22. Buscador único y sencillo:** buscar por tema, documento, fecha, estudiante o palabra relacionada.

La exigencia de Recientes/Favoritos es independiente de que exista un botón general “Continuar mi trabajo” o un archivo de unidades/proyectos.

## Prueba

### Entrada

Usuario con varios documentos guardados y trabajos realizados en momentos distintos intenta:

1. localizar rápidamente uno de los últimos documentos usados;
2. fijar una unidad/proyecto o documento frecuente como favorito;
3. volver a ese elemento sin recorrer el archivo completo.

### Resultado esperado

Debe existir una superficie clara y simple de **Recientes** y/o **Favoritos** que reduzca búsqueda y clics, especialmente para usuarios principiantes y móviles.

### Resultado obtenido

La producción canónica contiene:

- `Continuar mi trabajo` en Inicio;
- `Mis unidades/proyectos` dentro de planificación;
- una capa `planning-archive-simplicity-v56.js` que compacta ese archivo y ofrece Abrir, Crear sesiones, Word y Eliminar.

No se encontró una función visible o modelo de estado para:

- lista de documentos recientes;
- fecha/orden de último acceso orientado a navegación;
- marcar/desmarcar favoritos;
- superficie de favoritos;
- recuperación rápida de documentos frecuentes distinta del último trabajo.

Tampoco el cargador estable `schedule-prompt-v6.js` incluye un módulo específico de Recientes/Favoritos.

### Evidencia

- HTML productivo de `https://docente-digital.vercel.app/`: Inicio muestra `Continuar mi trabajo`, pero no Recientes/Favoritos.
- `schedule-prompt-v6.js`: lista completa de módulos cargados sin módulo de Recientes/Favoritos.
- `planning-archive-simplicity-v56.js`: archivo compacto de unidades/proyectos sin marca o vista de favoritos ni lista de recientes.
- Búsqueda de repositorio por `Recientes`, `favoritos`, `favorite/favorites` sin implementación localizada.

## Dictamen

**NO PASA · INEXISTENTE · S3 MEDIO.**

No se eleva a S1/S2 porque el usuario aún puede abrir el archivo y existe `Continuar mi trabajo`; el defecto es de eficiencia, encontrabilidad y simplicidad, no evidencia pérdida de datos ni corrupción documental.

## Causa raíz

La simplificación actual resolvió el acceso al último trabajo y compactó el archivo de planificación, pero no implementó la capa de navegación secundaria requerida por V4 para múltiples documentos y tareas frecuentes.

## Acción correctiva recomendada

Implementar de forma pequeña y reversible:

1. registrar `lastOpenedAt` al abrir/usar documentos, sin modificar documentos históricos emitidos;
2. permitir `favorite: true/false` como metadato de navegación, separado del contenido documental;
3. mostrar en Inicio un bloque compacto `Recientes` (3–5 elementos) y opcionalmente `Favoritos`;
4. en móvil, mantener una sola acción principal por tarjeta y enviar acciones secundarias a `Más`;
5. no usar IA para ordenar/filtrar recientes o favoritos;
6. probar persistencia tras recarga/cierre, eliminación/restauración y migración de datos existentes;
7. probar que documentos antiguos sin estos metadatos sigan abriendo normalmente.

## Riesgo de regresión

- Bajo si los metadatos se mantienen fuera del contenido histórico del documento.
- Medio si se modifica directamente la estructura canónica de documentos sin migración.
- No debe alterar correlativos, contenido emitido, firmas, fechas ni datos maestros históricos.

## Impacto en indicadores

- **IUD:** negativo moderado por mayor fricción para recuperar trabajo.
- **ICGD:** impacto menor/indirecto.
- **IFR:** impacto menor; no es una falla de generación.
- **ISU:** impacto directo en Encontrar funciones, Cantidad de pasos y Recuperación del trabajo.
- **Prelaunch:** no bloqueante aislado, pero pendiente para demostrar V4 de forma completa.

## Estado de pruebas reales

PENDIENTE validar con usuarios reales:

- tiempo para localizar el tercer/quinto documento reciente;
- comportamiento móvil;
- utilidad de favoritos;
- persistencia en cierre/recarga;
- interacción con papelera y recuperación.

No se calculan ISU/IFR/Prelaunch Score definitivos con esta evidencia parcial.

## Evidencia posterior de despliegue y CI — 11/09/2026

La evidencia técnica que había quedado abierta tras crear este hallazgo fue cerrada sin cambiar el dictamen funcional:

- **GitHub Actions:** `Prelaunch Smoke #238`, asociado al SHA `ae349b70b61e8800cc864b92136b2a1d0ad56fa7`, terminó `completed / success`.
- **Vercel:** deployment `dpl_AGx2yh67tHWsBQqR8RLdzpGPvZXM`, mismo SHA, permanece `READY · production`.
- **Producción canónica:** `https://docente-digital.vercel.app/` respondió **HTTP 200 OK** después del despliegue.
- **Cabeceras productivas observadas:** HSTS, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`, `Permissions-Policy` restrictiva y CSP activa.

### Interpretación

Estas comprobaciones demuestran **sanidad técnica del despliegue y del smoke disponible**, no la existencia ni el funcionamiento de Recientes/Favoritos. El resultado funcional de AUD-260 permanece:

**NO PASA · INEXISTENTE · S3 MEDIO.**

No convertir un smoke exitoso ni un HTTP 200 en aprobación de una función que V4 exige y que continúa ausente.